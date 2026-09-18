/*
 * BANC — LES DOUZE MÉCANIQUES DE BOSS
 * ---------------------------------------------------------------------------
 * Une mécanique de boss ne lève jamais d'erreur quand elle ne marche pas :
 * elle ne fait simplement RIEN, et le combat continue comme avant. Karkinos se
 * rétracte sans que la carapace encaisse, Reprise 21 meurt une seule fois,
 * La Pondeuse pond dans le vide. Aucun contrôle de données ne peut le voir —
 * les données sont correctes, c'est leur rencontre avec le moteur qui ne l'est
 * pas. Il faut faire tourner le vrai plugin.
 *
 * Ce banc charge `js/plugins/MecaniquesDeBoss.js` sur un moteur MV simulé,
 * puis joue chaque mécanique pour de bon.
 *
 * ⚠ ET IL VÉRIFIE DANS LES DEUX SENS (§6). Faire marcher une mécanique est la
 * moitié du travail ; l'autre moitié est qu'elle ne se déclenche PAS ailleurs.
 * Un ennemi ordinaire, sans notetag, doit traverser les douze sans rien sentir.
 * C'est le contrôle « aucune mécanique ne bave sur un ennemi ordinaire ».
 *
 * ⚠ PIÈGE DES MÉTADONNÉES (§7). MV garde l'espace après les deux-points :
 * « <MecaDime: 3> » donne « 3 ». Le banc écrit ses notetags AVEC l'espace,
 * comme l'éditeur, pour que l'oubli d'un trim() tombe ici et pas en jeu.
 *
 *   node bancs/14_mecaniques_de_boss.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');
var L = function (n) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', n + '.json'), 'utf8')); };

var CHARGE = 207, SURCHARGE = 218;

//===========================================================================
// 1 · Un moteur MV assez fidèle pour que le plugin s'y branche
//===========================================================================
var REGLAGES = (function () {
    var src = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
    var bac = {};
    (new Function('$plugins', 'bac', src.replace(/^\s*var\s+\$plugins\s*=/, '$plugins =') +
        '\n;bac.p = $plugins;'))(null, bac);
    var e = bac.p.filter(function (x) { return x.name === 'MecaniquesDeBoss'; })[0];
    if (!e) { console.error('✗ MecaniquesDeBoss n\'est pas inscrit dans js/plugins.js'); process.exit(1); }
    if (!e.status) { console.error('✗ MecaniquesDeBoss est inscrit mais ÉTEINT'); process.exit(1); }
    return e.parameters;
})();

function Game_BattlerBase() { }
Game_BattlerBase.prototype.elementRate = function () { return 1; };
Game_BattlerBase.prototype.die = function () { this._hp = 0; this._vivant = false; };

function Game_Battler() { }
Game_Battler.prototype = Object.create(Game_BattlerBase.prototype);
Game_Battler.prototype.addState = function (id) { if (this._states.indexOf(id) < 0) this._states.push(id); };

function Game_Enemy() { }
Game_Enemy.prototype = Object.create(Game_Battler.prototype);

function Game_Party() { }
Game_Party.prototype.onBattleStart = function () { };
Game_Party.prototype.onBattleEnd = function () { };

function Game_Action() { }
Game_Action.prototype.subject = function () { return this._sujet; };
Game_Action.prototype.item = function () { return this._item; };
Game_Action.prototype.isPhysical = function () { return this._physique !== false; };
Game_Action.prototype.executeDamage = function (target, value) { target._degatsRecus = value; target._hp -= value; };
Game_Action.prototype.makeDamageValue = function () { return this._brut === undefined ? 1000 : this._brut; };
Game_Action.prototype.itemHit = function () { return 0.5; };
Game_Action.prototype.itemEva = function () { return 0.5; };
Game_Action.prototype.numRepeats = function () { return 1; };
Game_Action.prototype.applyGlobal = function () { };

var BattleManager = { _logWindow: null, startTurn: function () { } };

global.Game_BattlerBase = Game_BattlerBase;
global.Game_Battler = Game_Battler;
global.Game_Enemy = Game_Enemy;
global.Game_Party = Game_Party;
global.Game_Action = Game_Action;
global.BattleManager = BattleManager;
global.PluginManager = { parameters: function () { return REGLAGES; } };
global.$gameTroop = null;
global.$gameParty = null;
global.console = console;

require(path.join(RACINE, 'js', 'plugins', 'MecaniquesDeBoss.js'));

//===========================================================================
// 2 · Fabriquer des combattants
//===========================================================================
function combattant(donnees, estEnnemi, pv) {
    var b = Object.create(estEnnemi ? Game_Enemy.prototype : Game_Battler.prototype);
    b._d = donnees; b._ennemi = estEnnemi;
    b._hp = pv; b.mhp = pv; b._states = []; b._vivant = true; b._paru = true;
    b.isEnemy = function () { return this._ennemi; };
    b.enemy = function () { return this._d; };
    b.isAlive = function () { return this._vivant && this._hp > 0; };
    b.isDead = function () { return !this.isAlive(); };
    b.isStateAffected = function (id) { return this._states.indexOf(id) >= 0; };
    b.clearStates = function () { this._states = []; };
    b.name = function () { return (this._d && this._d.name) || 'héros'; };
    b.hpRate = function () { return this._hp / this.mhp; };
    b.gainHp = function (v) { this._hp += v; if (this._hp <= 0) { this._hp = 0; this._vivant = false; } };
    b.setHp = function (v) { this._hp = v; this._vivant = v > 0; };
    b.refresh = function () { };
    b.isAppeared = function () { return this._paru; };
    b.appear = function () { this._paru = true; };
    Object.defineProperty(b, 'hp', { get: function () { return this._hp; }, configurable: true });
    return b;
}

function scene(noteBoss, pvBoss, membresEnPlus) {
    var boss = combattant({ id: 1, name: 'BOSS', note: noteBoss }, true, pvBoss || 100000);
    var troupe = [boss].concat(membresEnPlus || []);
    global.$gameTroop = {
        members: function () { return troupe; },
        aliveMembers: function () { return troupe.filter(function (m) { return m.isAlive(); }); },
        makeUniqueNames: function () { }
    };
    var heros = [combattant({ name: 'Vesper' }, false, 7000), combattant({ name: 'Aël' }, false, 6000)];
    global.$gameParty = {
        members: function () { return heros; },
        aliveMembers: function () { return heros.filter(function (h) { return h.isAlive(); }); }
    };
    return { boss: boss, heros: heros, troupe: troupe };
}

function tour() { BattleManager.startTurn(); }
function frappe(sujet, cible, brut, physique, item) {
    var a = Object.create(Game_Action.prototype);
    a._sujet = sujet; a._brut = brut; a._physique = physique; a._item = item || { note: '' };
    a.executeDamage(cible, a.makeDamageValue(cible, false));
    return cible._degatsRecus;
}

//===========================================================================
// 3 · Les contrôles
//===========================================================================
var FRAPPE_BOSS = { note: '<Apres: surcharge>' };

function controles(monde) {
    var r = [], N = monde.notes;

    // ——— THANATOS · la Dîme
    (function () {
        var s = scene(N.dime, 100000);
        s.boss.addState(CHARGE);
        tour();                                   // il inscrit un nom
        var marque = s.boss._dimeCible;
        s.boss._states = [];
        // <MecaDime: 3> : le compte descend d'un par tour APRÈS l'inscription,
        // il tombe donc au troisième battement, pas au deuxième.
        tour(); tour(); tour();
        var pris = marque && marque.hp < marque.mhp;
        r.push(['Thanatos · la Dîme marque un héros et tombe à échéance', !!pris,
            marque ? marque.name() + ' : ' + marque.hp + ' / ' + marque.mhp + ' PV' : 'personne marqué']);

        var s2 = scene(N.dime, 100000);
        s2.boss.addState(CHARGE); tour();
        var m2 = s2.boss._dimeCible;
        s2.boss.addState(SURCHARGE);              // la fenêtre de riposte
        r.push(['Thanatos · mettre le boss à découvert efface la Dîme',
            s2.boss._dimeCible === null, m2 ? 'la marque de ' + m2.name() + ' est levée' : '—']);
    })();

    // ——— LEVIATHAN · la marée
    (function () {
        var s = scene(N.maree, 100000);
        var a = Object.create(Game_Action.prototype); a._sujet = s.boss;
        var avant = a.itemHit(s.heros[0]) + ':' + a.itemEva(s.heros[0]);
        s.boss.addState(CHARGE);
        var apres = a.itemHit(s.heros[0]) + ':' + a.itemEva(s.heros[0]);
        r.push(['Leviathan · l\'eau retirée, la frappe ne peut plus rater',
            avant === '0.5:0.5' && apres === '1:0', avant + '  →  ' + apres]);
    })();

    // ——— LA FORME DE VIE ULTIME · les cinq gueules
    (function () {
        var s = scene(N.gueules, 100000);
        var a = Object.create(Game_Action.prototype); a._sujet = s.boss; a._item = FRAPPE_BOSS;
        var plein = a.numRepeats();
        s.boss.setHp(Math.floor(s.boss.mhp * 0.15));
        var fin = a.numRepeats();
        r.push(['la forme de vie ultime · une frappe par gueule, et elles se ferment',
            plein === 5 && fin === 1, plein + ' souffles à PV pleins → ' + fin + ' à 15 %']);
    })();

    // ——— KARKINOS · la carapace
    (function () {
        var s = scene(N.carapace, 100000);
        s.boss.addState(CHARGE);
        var phys = frappe(s.boss._d && null, s.boss, 1000, true);
        var magi = frappe(null, s.boss, 1000, false);
        r.push(['Karkinos · rétracté, le physique glisse et la magie passe',
            phys === 200 && magi === 1000, 'physique ' + phys + ' · magie ' + magi + ' (sur 1000)']);
    })();

    // ——— LE COMPTEUR · le compte à rebours
    (function () {
        var s = scene(N.compte, 100000);
        var pvAvant = s.heros[0].hp;
        for (var i = 0; i < 5; i++) tour();
        r.push(['Le Compteur · à zéro, tout le groupe encaisse',
            s.heros[0].hp < pvAvant, pvAvant + ' → ' + s.heros[0].hp + ' PV après 5 tours']);
    })();

    // ——— LA PONDEUSE · la ponte
    (function () {
        var oeufs = [combattant({ name: 'Larve' }, true, 200), combattant({ name: 'Larve' }, true, 200)];
        oeufs.forEach(function (o) { o._paru = false; });
        var s = scene(N.ponte, 100000, oeufs);
        s.boss.addState(CHARGE);
        tour();
        r.push(['La Pondeuse · un œuf éclot quand elle pond',
            oeufs[0].isAppeared(), oeufs.filter(function (o) { return o.isAppeared(); }).length + ' / 2 écloses']);
    })();

    // ——— LE DERNIER DES PETITS · le nombre
    (function () {
        var s = scene(N.nombre, 100000);
        var a = Object.create(Game_Action.prototype); a._sujet = s.boss; a._brut = 1000;
        var plein = a.makeDamageValue(s.heros[0], false);
        s.boss.setHp(1);
        var mourant = a.makeDamageValue(s.heros[0], false);
        r.push(['Le Dernier des Petits · plus il est blessé, plus il frappe',
            plein === 1000 && mourant > 2100, plein + ' à PV pleins → ' + mourant + ' à 1 PV']);
    })();

    // ——— GOLIATH-ZÉRO · la chaleur
    (function () {
        var s = scene(N.chaleur, 100000);
        for (var i = 0; i < 6; i++) tour();
        r.push(['Goliath-Zéro · il disjoncte et se met à découvert',
            s.boss.isStateAffected(SURCHARGE) && s.boss.hp < s.boss.mhp,
            'PV ' + s.boss.hp + ' / ' + s.boss.mhp + ' · Surcharge : ' + s.boss.isStateAffected(SURCHARGE)]);
    })();

    // ——— LE NON-DÉFINI · la recompilation
    (function () {
        var s = scene(N.recompile, 100000);
        tour();
        s.boss.setHp(Math.floor(s.boss.mhp * 0.5));
        tour();
        var t = s.boss._tableRecompile;
        var faibles = t ? Object.keys(t).filter(function (k) { return t[k] > 1; }).length : 0;
        var forts = t ? Object.keys(t).filter(function (k) { return t[k] < 1; }).length : 0;
        r.push(['Le Non-Défini · au palier suivant, ses élements sont retirés au sort',
            !!t && faibles === 2 && forts === 2,
            t ? faibles + ' faiblesses · ' + forts + ' résistances' : 'aucune table']);
    })();

    // ——— REPRISE 21 · les reprises
    (function () {
        var s = scene(N.reprises, 100000);
        s.boss.die();
        var vivant1 = s.boss.isAlive(), pv1 = s.boss.hp;
        s.boss.die();
        var vivant2 = s.boss.isAlive();
        s.boss.die();
        r.push(['Reprise 21 · il revient deux fois, plus faible, puis tombe',
            vivant1 && vivant2 && !s.boss.isAlive(),
            'reprise 1 à ' + pv1 + ' PV · reprise 2 · puis mort']);
    })();

    // ——— RUKKHA · le retournement
    (function () {
        var s = scene(N.retournement, 100000);
        s.boss.addState(CHARGE);
        var rentree = frappe(null, s.boss, 900, true);
        s.boss._states = [SURCHARGE];
        var surLeDos = frappe(null, s.boss, 900, true);
        r.push(['Rukkha · tête rentrée elle encaisse, sur le dos elle déguste',
            rentree === 300 && surLeDos === 1800, 'rentrée ' + rentree + ' · sur le dos ' + surLeDos + ' (sur 900)']);
    })();

    // ——— NOM EFFACÉ · le nom pris
    (function () {
        var s = scene(N.nom, 100000);
        var a = Object.create(Game_Action.prototype); a._sujet = s.boss; a._item = FRAPPE_BOSS;
        a.applyGlobal();
        var vole = s.heros.filter(function (h) { return h._nomPris; })[0];
        var b = Object.create(Game_Action.prototype); b._sujet = vole; b._brut = 1000;
        var diminue = vole ? b.makeDamageValue(s.boss, false) : -1;
        s.boss.addState(SURCHARGE);
        r.push(['Nom Effacé · le héros dépossédé frappe à moitié, et retrouve son nom',
            !!vole && diminue === 500 && !vole._nomPris,
            vole ? vole.name() + ' : ' + diminue + ' au lieu de 1000, puis rendu' : 'personne dépossédé']);
    })();

    // ——— LE SENS INVERSE : un ennemi ordinaire ne sent rien
    (function () {
        var s = scene(N.ordinaire, 100000);
        var avantPv = s.boss.hp, avantHeros = s.heros[0].hp;
        s.boss.addState(CHARGE);
        for (var i = 0; i < 8; i++) tour();
        var a = Object.create(Game_Action.prototype); a._sujet = s.boss; a._brut = 1000; a._item = FRAPPE_BOSS;
        var d = frappe(null, s.boss, 1000, true);
        a.applyGlobal();
        // ⚠ On relève les PV AVANT de le tuer : die() les met à zéro, et une
        // première version comparait donc 0 à « avantPv − 1000 ». Le contrôle
        // accusait le plugin d'un défaut qui était dans le banc.
        var degatsIntacts = (s.boss.hp === avantPv - 1000);
        s.boss._states = [];
        s.boss.die();
        r.push(['aucune mécanique ne bave sur un ennemi ordinaire',
            degatsIntacts && s.heros[0].hp === avantHeros &&
            a.numRepeats() === 1 && a.itemHit() === 0.5 && !s.heros[0]._nomPris && !s.boss.isAlive(),
            'dégâts ' + d + ' intacts · groupe intact · pas de reprise']);
    })();

    return r;
}

//===========================================================================
// 4 · Exécution
//===========================================================================
// Les notetags sont écrits AVEC l'espace après les deux-points, comme MV.
var BASE = {
    notes: {
        dime: '<MecaDime: 3>', maree: '<MecaMaree>', gueules: '<MecaGueules: 5>',
        carapace: '<MecaCarapace: 20>', compte: '<MecaCompteARebours: 5>',
        ponte: '<MecaPonte: 751, 3>', nombre: '<MecaNombre: 120>', chaleur: '<MecaChaleur: 6>',
        recompile: '<MecaRecompile>', reprises: '<MecaReprises: 2>',
        retournement: '<MecaRetournement>', nom: '<MecaNom>', ordinaire: '<Rang: C>'
    }
};
var copie = function (o) { return JSON.parse(JSON.stringify(o)); };

var ok = 0, ko = 0;
console.log('\n1) Les douze mécaniques, jouées sur le vrai plugin');
controles(BASE).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

// Chaque sabotage retire SA mécanique : son contrôle, et lui seul, doit tomber.
var SABOTAGES = [
    ['la Dîme retirée à Thanatos', function (b) { b.notes.dime = '<Rang: S>'; }, /la Dîme marque/],
    ['la marée retirée à Leviathan', function (b) { b.notes.maree = '<Rang: S>'; }, /l'eau retirée/],
    ['les gueules retirées', function (b) { b.notes.gueules = '<Rang: S>'; }, /une frappe par gueule/],
    ['la carapace retirée à Karkinos', function (b) { b.notes.carapace = '<Rang: S>'; }, /le physique glisse/],
    ['le compte retiré au Compteur', function (b) { b.notes.compte = '<Rang: S>'; }, /à zéro, tout le groupe/],
    ['la ponte retirée à La Pondeuse', function (b) { b.notes.ponte = '<Rang: S>'; }, /un œuf éclot/],
    ['le nombre retiré au Dernier des Petits', function (b) { b.notes.nombre = '<Rang: S>'; }, /plus il est blessé/],
    ['la chaleur retirée à Goliath-Zéro', function (b) { b.notes.chaleur = '<Rang: S>'; }, /il disjoncte/],
    ['la recompilation retirée', function (b) { b.notes.recompile = '<Rang: S>'; }, /retirés au sort/],
    ['les reprises retirées', function (b) { b.notes.reprises = '<Rang: S>'; }, /il revient deux fois/],
    ['le retournement retiré à Rukkha', function (b) { b.notes.retournement = '<Rang: S>'; }, /tête rentrée/],
    ['le vol de nom retiré', function (b) { b.notes.nom = '<Rang: S>'; }, /frappe à moitié/],
    ['une mécanique collée sur l\'ennemi ordinaire', function (b) { b.notes.ordinaire = '<MecaReprises: 2>'; }, /ne bave sur un ennemi ordinaire/]
];

console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
SABOTAGES.forEach(function (s) {
    var b = copie(BASE);
    s[1](b);
    var vise = controles(b).filter(function (c) { return !c[1] && s[2].test(c[0]); });
    if (vise.length) { ok++; console.log('   ✓ ' + s[0] + '  →  « ' + vise[0][0] + ' » tombe'); }
    else { ko++; console.log('   ✗ ' + s[0] + '  →  son contrôle ne tombe PAS'); }
});

// Et sur la vraie base : les douze notetags sont-ils bien posés ?
console.log('\n3) Sur la vraie base');
var E = L('Enemies');
var ATTENDU = [[828, 'MecaDime'], [826, 'MecaMaree'], [827, 'MecaGueules'], [823, 'MecaCarapace'],
    [821, 'MecaCompteARebours'], [822, 'MecaPonte'], [824, 'MecaNombre'], [820, 'MecaChaleur'],
    [819, 'MecaRecompile'], [818, 'MecaReprises'], [825, 'MecaRetournement'], [817, 'MecaNom']];
var manquants = ATTENDU.filter(function (a) {
    return !E[a[0]] || !new RegExp('<\\s*' + a[1] + '\\s*[:>]', 'i').test(E[a[0]].note || '');
});
if (!manquants.length) { ok++; console.log('   ✓ les douze notetags sont posés sur leurs boss  —  12 / 12'); }
else { ko++; console.log('   ✗ notetags manquants : ' + manquants.map(function (m) { return m[1]; }).join(', ')); }

// La Pondeuse doit avoir de quoi pondre
var T = L('Troops');
var tp = (T[553] || { members: [] }).members.filter(function (m) { return m.hidden; }).length;
if (tp >= 1) { ok++; console.log('   ✓ La Pondeuse a une couvée cachée dans sa troupe  —  ' + tp + ' œuf(s)'); }
else { ko++; console.log('   ✗ La Pondeuse n\'a aucun membre caché : « Elle Pond » pondrait dans le vide'); }

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
