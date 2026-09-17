/*
 * BANC — LE PLAFOND DES COMPÉTENCES EN POURCENTAGE DE PV MAX
 * ---------------------------------------------------------------------------
 * Ce que le banc doit attraper, et pourquoi rien d'autre ne l'attrape.
 *
 * Une formule « b.mhp * 0.80 » ne lève aucune erreur, n'écrit rien dans le
 * journal, et fonctionne exactement comme prévu : elle retire 80 % des PV de
 * la cible. Le défaut n'est pas dans le code, il est dans la RENCONTRE entre
 * cette formule et un boss à 98 800 PV — 79 040 dégâts d'un coup, deux héros
 * suffisent à finir le combat au premier tour. Aucun contrôle de données ne
 * peut le voir : il faut faire tourner le vrai calcul de dégâts.
 *
 * Le banc charge donc `js/plugins/PlafondPourcentagePV.js` lui-même, sur un
 * Game_Action simulé, et mesure ce que le moteur rendra — pas ce qu'on croit
 * lui avoir dit (§6).
 *
 * ⚠ LE PIÈGE DES MÉTADONNÉES (§7). MV garde l'espace après les deux-points :
 * « <PlafondPV: 5%> » donne « 5%» avec une espace devant. Un plugin qui
 * oublie le trim() lit « aucun » là où on a écrit « aucun », mais échoue sur
 * « 5% ». Le banc écrit ses notetags AVEC l'espace, comme l'éditeur.
 *
 * ⚠ ET LE PIÈGE DU SENS INVERSE. Plafonner est facile ; plafonner SEULEMENT
 * ce qu'il faut est le vrai travail. Le banc vérifie donc dans les deux sens :
 * que le plafond tombe sur les compétences en % de PV contre un boss, ET
 * qu'il laisse tranquilles les soins, les compétences ordinaires, et les
 * ennemis qui ne sont pas des boss.
 *
 *   node bancs/12_plafond_pourcentage_pv.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');
var L = function (n) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', n + '.json'), 'utf8')); };

//===========================================================================
// 1 · Un moteur MV assez fidèle pour que le plugin s'y branche pour de vrai
//===========================================================================

// Les réglages tels que js/plugins.js les porte : on ne les invente pas.
var REGLAGES = (function () {
    var src = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
    var bac = {};
    (new Function('$plugins', 'bac', src.replace(/^\s*var\s+\$plugins\s*=/, '$plugins =') +
        '\n;bac.p = $plugins;'))(null, bac);
    var e = bac.p.filter(function (x) { return x.name === 'PlafondPourcentagePV'; })[0];
    if (!e) { console.error('✗ PlafondPourcentagePV n\'est pas inscrit dans js/plugins.js'); process.exit(1); }
    if (!e.status) { console.error('✗ PlafondPourcentagePV est inscrit mais ÉTEINT'); process.exit(1); }
    return e.parameters;
})();

function Game_Action() { }
Game_Action.prototype.item = function () { return this._item; };
// le calcul de MV, réduit à ce qui compte ici : Math.max(eval(formule), 0)
Game_Action.prototype.makeDamageValue = function (target) {
    var a = this._sujet, b = target;
    var v;
    try { v = eval(this._item.damage.formula); } catch (e) { v = 0; }
    if (!isFinite(v)) v = 0;
    v = Math.floor(v);
    // type 3/4 = soin : MV en fait une valeur négative (on rend des PV)
    if (this._item.damage.type === 3 || this._item.damage.type === 4) v = -Math.abs(v);
    else v = Math.max(v, 0);
    return v;
};

function Combattant(donnees, estEnnemi) {
    this._d = donnees; this._ennemi = estEnnemi;
    var p = donnees.params || [3000, 400, 180, 130, 180, 130, 110, 80];
    this.mhp = p[0]; this.hp = p[0]; this.mp = p[1]; this.atk = p[2];
    this.def = p[3]; this.mat = p[4]; this.mdf = p[5]; this.agi = p[6]; this.luk = p[7] || 50;
    this.level = 99;
}
Combattant.prototype.isEnemy = function () { return this._ennemi; };
Combattant.prototype.enemy = function () { return this._d; };

global.Game_Action = Game_Action;
global.PluginManager = { parameters: function () { return REGLAGES; } };

// on charge le VRAI plugin, pas une copie de sa logique
require(path.join(RACINE, 'js', 'plugins', 'PlafondPourcentagePV.js'));

function frappe(competence, lanceur, cible) {
    var act = new Game_Action();
    act._item = competence; act._sujet = lanceur;
    return act.makeDamageValue(cible);
}

//===========================================================================
// 2 · Les contrôles
//===========================================================================

var HEROS = { atk: 390, def: 241, mat: 198, mdf: 209, agi: 277, luk: 50, hp: 7256, mhp: 7256, level: 99 };

function competence(formule, type) {
    return { damage: { formula: formule, type: type === undefined ? 1 : type } };
}
function ennemi(note, pv) {
    return { note: note, params: [pv || 98800, 1710, 1064, 798, 1026, 760, 350, 196] };
}

function controles(monde) {
    var r = [], PV = 98800;
    var boss = new Combattant(ennemi(monde.noteBoss, PV), true);
    var mob = new Combattant(ennemi(monde.noteMob, PV), true);

    var pct = competence('b.mhp * 0.80');
    var ordinaire = competence('Math.floor(a.atk * 24 * 200 / (200 + b.def))');
    var soin = competence('b.mhp * 0.50', 3);

    // — le cas réel : la compétence qui tuait un boss en un tour
    var dBoss = frappe(pct, HEROS, boss);
    r.push(['une compétence en % de PV max est plafonnée contre un boss',
        dBoss <= Math.ceil(PV * 0.10),
        dBoss + ' dégâts sur ' + PV + ' PV (' + Math.round(dBoss / PV * 100) + ' %)']);

    // — et elle reste forte : un plafond qui l'annulerait serait un autre défaut
    r.push(['le plafond ne l\'annule pas : elle reste une grosse frappe',
        dBoss >= Math.floor(PV * 0.08),
        dBoss + ' dégâts, soit ' + Math.round(dBoss / PV * 100) + ' % des PV du boss']);

    // — sens inverse n°1 : hors boss, le caractère est intact
    var dMob = frappe(pct, HEROS, mob);
    r.push(['hors boss, la compétence en % garde ses 80 %',
        dMob === Math.floor(PV * 0.80),
        dMob + ' dégâts attendus ' + Math.floor(PV * 0.80)]);

    // — sens inverse n°2 : une compétence ordinaire n'est jamais touchée
    var dOrd = frappe(ordinaire, HEROS, boss);
    var dOrdAttendu = Math.floor(390 * 24 * 200 / (200 + 798));
    r.push(['une compétence ordinaire traverse le plafond sans rien perdre',
        dOrd === dOrdAttendu, dOrd + ' dégâts, attendu ' + dOrdAttendu]);

    // — sens inverse n°3 : un soin n'est pas un dégât
    var dSoin = frappe(soin, HEROS, boss);
    r.push(['un soin en % de PV max n\'est pas plafonné',
        dSoin === -Math.floor(PV * 0.50),
        dSoin + ' (un soin reste négatif et entier)']);

    // — le réglage fin, ennemi par ennemi, AVEC l'espace que MV laisse
    var serre = new Combattant(ennemi('<Boss>\n<PlafondPV: 5%>', PV), true);
    var dSerre = frappe(pct, HEROS, serre);
    r.push(['<PlafondPV: 5%> resserre le plafond (et le trim() est fait)',
        dSerre === Math.floor(PV * 0.05),
        dSerre + ' dégâts, attendu ' + Math.floor(PV * 0.05)]);

    var libre = new Combattant(ennemi('<Boss>\n<PlafondPV: aucun>', PV), true);
    r.push(['<PlafondPV: aucun> rend le boss au plein fouet',
        frappe(pct, HEROS, libre) === Math.floor(PV * 0.80),
        'le boss encaisse ses 80 %']);

    // — sur la VRAIE base : plus aucune compétence ne tue un boss en un tour
    var S = monde.Skills, E = monde.Enemies, T = monde.Troops;
    var bossIds = {};
    T.forEach(function (t) {
        if (t && /◈/.test(t.name || '')) (t.members || []).forEach(function (m) { bossIds[m.enemyId] = 1; });
    });
    var pires = [];
    Object.keys(bossIds).forEach(function (id) {
        var e = E[id]; if (!e) return;
        var c = new Combattant(e, true);
        S.forEach(function (s) {
            if (!s || !s.damage || !s.damage.formula || s.damage.type !== 1) return;
            var d = frappe(s, HEROS, c);
            if (d > c.mhp * 0.25) pires.push(s.name + ' → ' + Math.round(d / c.mhp * 100) + ' % de ' + e.name);
        });
    });
    r.push(['sur la vraie base, aucune compétence ne retire plus du quart d\'un boss',
        pires.length === 0,
        pires.length ? pires.slice(0, 3).join(' · ') : Object.keys(bossIds).length + ' boss × ' + S.filter(Boolean).length + ' compétences passés au crible']);

    return r;
}

//===========================================================================
// 3 · Exécution
//===========================================================================

var BASE = { noteBoss: '<Boss>\n<Rang: S>', noteMob: '<Rang: C>',
    Skills: L('Skills'), Enemies: L('Enemies'), Troops: L('Troops') };
var copie = function (o) { return JSON.parse(JSON.stringify(o)); };

var ok = 0, ko = 0;
console.log('\n1) Sur le vrai plugin et la vraie base');
controles(BASE).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

// Chaque sabotage doit faire tomber SON contrôle, et lui seul.
var SABOTAGES = [
    ['le marqueur <Boss> retiré au boss',
        function (b) { b.noteBoss = '<Rang: S>'; }, /plafonnée contre un boss/],
    ['un ennemi ordinaire promu <Boss>',
        function (b) { b.noteMob = '<Boss>'; }, /garde ses 80 %/],
    ['une compétence en % de PV glissée sur un boss de la vraie base',
        function (b) {
            var s = b.Skills.filter(function (x) { return x && x.damage && x.damage.formula; })[0];
            s.damage.formula = 'b.mhp * 0.90'; s.damage.type = 1;
            b.Enemies.forEach(function (e) { if (e && e.note) { e.note = e.note.replace(/<\s*Boss\s*>/gi, ''); } });
        }, /plus du quart d'un boss/]
];

console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
SABOTAGES.forEach(function (s) {
    var b = copie(BASE);
    s[1](b);
    var vise = controles(b).filter(function (c) { return !c[1] && s[2].test(c[0]); });
    if (vise.length) { ok++; console.log('   ✓ ' + s[0] + '  →  « ' + vise[0][0] + ' » tombe'); }
    else { ko++; console.log('   ✗ ' + s[0] + '  →  son contrôle ne tombe PAS'); }
});

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
