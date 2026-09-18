/*
 * BANC — LA BOUCLE DES BOSS : mise en garde → frappe → à découvert
 * ---------------------------------------------------------------------------
 * Deux pannes, toutes deux muettes, que rien d'autre ne pouvait voir.
 *
 * 1 · LA SURCHARGE TOMBAIT SUR LE GROUPE. Les 41 compétences <Apres: surcharge>
 *     ont pour portée « tous les ennemis » — vue du boss, LE GROUPE. MV pose
 *     les effets d'une compétence sur ses cibles : c'étaient donc les héros qui
 *     passaient à DÉF ×0.4 et ×1.6 dégâts subis, juste après avoir encaissé la
 *     plus grosse attaque du boss. La mécanique tournait à l'envers, et aucun
 *     contrôle de DONNÉES ne pouvait l'attraper : la donnée est correcte, c'est
 *     sa RENCONTRE avec le moteur qui ne l'est pas. Il faut appliquer l'effet
 *     pour de bon pour s'en apercevoir.
 *
 * 2 · L'IA N'ENCHAÎNAIT PAS. La mise en garde partait sur « TURN % 3 === 1 »
 *     et la frappe sur « TURN % 3 === 2 » : une parité, pas un enchaînement.
 *     Trois lignes de PV bas lançaient même la frappe sans aucune mise en
 *     garde. Le joueur ne voyait jamais le signal, et la fenêtre de riposte ne
 *     s'ouvrait pas.
 *
 * ⚠ CE BANC NE RELIT PAS LA LOGIQUE QUI A ÉCRIT LES DOCTRINES. Comme
 * `9_doctrines.js`, il rejoue les expressions régulières de YEP_BattleAICore
 * lui-même, relues dans le fichier du plugin : on mesure ce que Yanfly fera,
 * pas ce qu'on croit lui avoir dit. Une ligne qu'il ne sait pas découper est
 * abandonnée EN SILENCE.
 *
 *   node bancs/13_boucle_des_boss.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');
var L = function (n) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', n + '.json'), 'utf8')); };

var CHARGE = 207, SURCHARGE = 218;

//===========================================================================
// 1 · Un moteur MV assez fidèle pour que le plugin s'y branche pour de vrai
//===========================================================================

var REGLAGES = (function () {
    var src = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
    var bac = {};
    (new Function('$plugins', 'bac', src.replace(/^\s*var\s+\$plugins\s*=/, '$plugins =') +
        '\n;bac.p = $plugins;'))(null, bac);
    var e = bac.p.filter(function (x) { return x.name === 'BossTelegraphe'; })[0];
    if (!e) { console.error('✗ BossTelegraphe n\'est pas inscrit dans js/plugins.js'); process.exit(1); }
    if (!e.status) { console.error('✗ BossTelegraphe est inscrit mais ÉTEINT'); process.exit(1); }
    return e.parameters;
})();

function Game_Battler() { this._states = []; this._vivant = true; }
Game_Battler.prototype.addState = function (id) { if (this._states.indexOf(id) < 0) this._states.push(id); };
Game_Battler.prototype.removeState = function (id) { var i = this._states.indexOf(id); if (i >= 0) this._states.splice(i, 1); };
Game_Battler.prototype.isStateAffected = function (id) { return this._states.indexOf(id) >= 0; };
Game_Battler.prototype.isAlive = function () { return this._vivant; };

function Game_Action() { }
Game_Action.EFFECT_ADD_STATE = 21;
Game_Action.prototype.item = function () { return this._item; };
Game_Action.prototype.subject = function () { return this._sujet; };
// le comportement de MV, réduit à ce qui compte : l'effet va sur la CIBLE
Game_Action.prototype.applyItemEffect = function (target, effect) {
    if (effect.code === Game_Action.EFFECT_ADD_STATE) target.addState(effect.dataId);
};
Game_Action.prototype.applyGlobal = function () { };

global.Game_Action = Game_Action;
global.Game_Battler = Game_Battler;
global.PluginManager = { parameters: function () { return REGLAGES; } };

require(path.join(RACINE, 'js', 'plugins', 'BossTelegraphe.js'));

//===========================================================================
// 2 · Les motifs de Yanfly, relus dans SON fichier
//===========================================================================
var SRC_IA = fs.readFileSync(path.join(RACINE, 'js', 'plugins', 'YEP_BattleAICore.js'), 'utf8');
var MOTIFS = [
    /[ ]*(.*):[ ](?:SKILL)[ ](\d+),[ ](.*)/i,
    /[ ]*(.*):[ ](?:SKILL)[ ](\d+)/i,
    /[ ]*(.*):[ ](.*),[ ](.*)/i,
    /[ ]*(.*):[ ](.*)/i
];
(function verifieMotifs() {
    // si Yanfly change ses motifs, ce banc doit le dire plutôt que mentir
    if (SRC_IA.indexOf('(?:SKILL)[ ](\\d+),[ ]') < 0) {
        console.error('⚠ les motifs de YEP_BattleAICore ont changé — ce banc doit être relu');
    }
})();

function decoupe(ligne) {
    for (var i = 0; i < MOTIFS.length; i++) {
        var m = MOTIFS[i].exec(ligne);
        if (m) return { cond: m[1], skill: parseInt(m[2], 10), cible: m[3] || 'RANDOM' };
    }
    return null;
}

//===========================================================================
// 3 · Les contrôles
//===========================================================================

function controles(monde) {
    var r = [], S = monde.Skills, E = monde.Enemies, T = monde.Troops;

    var estTele = function (s) { return s && /<\s*Telegraphe\s*>/i.test(s.note || ''); };
    var estFrappe = function (s) { return s && /<\s*Apres\s*:\s*surcharge\s*>/i.test(s.note || ''); };

    // ——— A · l'effet, appliqué pour de vrai
    var frappes = S.filter(estFrappe);
    var maisonAilleurs = 0, maisonSurLeBoss = 0;
    frappes.forEach(function (sk) {
        var boss = new Game_Battler(), hero = new Game_Battler();
        var act = new Game_Action(); act._item = sk; act._sujet = boss;
        act.applyGlobal();
        (sk.effects || []).forEach(function (ef) { act.applyItemEffect(hero, ef); });
        if (hero.isStateAffected(SURCHARGE)) maisonAilleurs++;
        if (boss.isStateAffected(SURCHARGE)) maisonSurLeBoss++;
    });
    r.push(['la Surcharge ne tombe jamais sur le groupe', maisonAilleurs === 0,
        frappes.length + ' frappes jouées · ' + maisonAilleurs + ' posée(s) sur un héros']);
    r.push(['la Surcharge tombe bien sur le lanceur', maisonSurLeBoss === frappes.length,
        maisonSurLeBoss + ' / ' + frappes.length + ' boss mis à découvert']);

    // ——— B · les mises en garde se chargent elles-mêmes
    var teles = S.filter(estTele);
    var malPortees = teles.filter(function (s) { return s.scope !== 11; });
    r.push(['chaque mise en garde vise son lanceur (portée « soi-même »)',
        malPortees.length === 0,
        teles.length + ' mises en garde · ' + malPortees.length + ' mal portée(s)']);

    // ——— C · les doctrines des boss enchaînent vraiment
    var bossIds = {};
    T.forEach(function (t) { if (t && /◈/.test(t.name || '')) (t.members || []).forEach(function (m) { bossIds[m.enemyId] = 1; }); });
    var ids = Object.keys(bossIds).map(Number);

    var sansChaine = [], frappeNue = [], sansElan = [], illisible = [];
    ids.forEach(function (id) {
        var e = E[id]; if (!e || !e.note) return;
        var m = /<AI Priority>([\s\S]*?)<\/AI Priority>/i.exec(e.note); if (!m) return;
        var own = (e.actions || []).map(function (a) { return a.skillId; });
        var tId = own.filter(function (i) { return estTele(S[i]); })[0];
        var pId = own.filter(function (i) { return estFrappe(S[i]); })[0];
        if (!tId || !pId) return;

        var lignes = m[1].split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
        var premiere = null, aElan = false;

        lignes.forEach(function (l, i) {
            var d = decoupe(l);
            if (!d) { illisible.push(e.name + ' : ' + l); return; }
            if (i === 0) premiere = d;
            if (d.skill === tId) aElan = true;
            // une ligne qui lance la FRAPPE sans lire la Charge est une frappe nue
            if (d.skill === pId && !/enCharge/i.test(d.cond)) frappeNue.push(e.name + ' → ' + l);
        });

        if (!premiere || premiere.skill !== pId || !/enCharge/i.test(premiere.cond)) sansChaine.push(e.name);
        if (!aElan) sansElan.push(e.name);
    });

    r.push(['chaque boss lit sa Charge AVANT tout le reste', sansChaine.length === 0,
        ids.length + ' boss · ' + sansChaine.length + ' sans la ligne en tête' +
        (sansChaine.length ? ' : ' + sansChaine.slice(0, 3).join(', ') : '')]);
    r.push(['aucune frappe ne part sans mise en garde', frappeNue.length === 0,
        frappeNue.length ? frappeNue.slice(0, 2).join(' · ') : 'aucune frappe nue']);
    r.push(['chaque boss garde un moyen de prendre son élan', sansElan.length === 0,
        sansElan.length ? sansElan.slice(0, 3).join(', ') : 'tous peuvent se charger']);
    r.push(['chaque ligne se découpe comme Yanfly la découpe', illisible.length === 0,
        illisible.length ? illisible.slice(0, 2).join(' · ') : 'toutes les lignes passent les 4 motifs']);

    // ——— D · la boucle, jouée sur trois tours
    var boss = new Game_Battler();
    var journal = [];
    /*
     * ⚠ Ce bloc prenait ids[0] tel quel — le premier boss d'une troupe « ◈ ».
     * Tant que ce premier-là portait la boucle, tout allait bien ; le jour où le
     * ◈ a été rendu à la troupe 539, ids[0] est devenu un boss SANS mise en
     * garde, et le banc a planté au lieu d'accuser quoi que ce soit. La section C
     * juste au-dessus écartait pourtant déjà ce cas (`if (!tId || !pId) return`).
     * On choisit donc explicitement un boss qui porte la boucle entière.
     */
    var e0 = null, t0, p0;
    for (var iB = 0; iB < ids.length && !e0; iB++) {
        var cand = E[ids[iB]];
        if (!cand || !cand.actions) { continue; }
        var ownC = cand.actions.map(function (a) { return a.skillId; });
        var tC = ownC.filter(function (i) { return estTele(S[i]); })[0];
        var pC = ownC.filter(function (i) { return estFrappe(S[i]); })[0];
        if (tC && pC) { e0 = cand; t0 = tC; p0 = pC; }
    }
    if (!e0) {
        r.push(['la boucle se joue : élan → frappe → à découvert', false,
            'aucun boss « ◈ » ne porte à la fois une mise en garde et une frappe — ' +
            'il n\'y a plus rien à jouer']);
        return r;
    }
    var own0 = e0.actions.map(function (a) { return a.skillId; });

    // tour N — il prend son élan (portée soi-même)
    var a1 = new Game_Action(); a1._item = S[t0]; a1._sujet = boss;
    a1.applyGlobal(); (S[t0].effects || []).forEach(function (ef) { a1.applyItemEffect(boss, ef); });
    journal.push(boss.isStateAffected(CHARGE) ? 'chargé' : 'RIEN');

    // tour N+1 — chargé, il frappe
    var chargeAuMoment = boss.isStateAffected(CHARGE);
    var a2 = new Game_Action(); a2._item = S[p0]; a2._sujet = boss;
    var hero = new Game_Battler();
    a2.applyGlobal(); (S[p0].effects || []).forEach(function (ef) { a2.applyItemEffect(hero, ef); });
    boss.removeState(CHARGE);   // MV la retire en fin d'action
    journal.push(boss.isStateAffected(SURCHARGE) ? 'à découvert' : 'RIEN');

    r.push(['la boucle se joue : élan → frappe → à découvert',
        journal[0] === 'chargé' && chargeAuMoment && journal[1] === 'à découvert' && !hero.isStateAffected(SURCHARGE),
        journal.join(' → ') + (hero.isStateAffected(SURCHARGE) ? ' MAIS le héros aussi !' : '')]);

    return r;
}

//===========================================================================
// 4 · Exécution
//===========================================================================
var BASE = { Skills: L('Skills'), Enemies: L('Enemies'), Troops: L('Troops') };
var copie = function (o) { return JSON.parse(JSON.stringify(o)); };

var ok = 0, ko = 0;
console.log('\n1) Sur le vrai plugin et la vraie base');
controles(BASE).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

var SABOTAGES = [
    ['une mise en garde repointée sur le groupe', function (b) {
        b.Skills.filter(function (s) { return s && /<\s*Telegraphe\s*>/i.test(s.note || ''); })[0].scope = 2;
    }, /vise son lanceur/],
    ['la ligne de Charge retirée à un boss', function (b) {
        var t = b.Troops.filter(function (x) { return x && /◈/.test(x.name || ''); })[0];
        var e = b.Enemies[t.members[0].enemyId];
        e.note = e.note.replace(/EVAL user\.enCharge\(\)[^\n]*\n/, '');
    }, /lit sa Charge AVANT/],
    ['une frappe relancée sur une ligne de PV bas', function (b) {
        var t = b.Troops.filter(function (x) { return x && /◈/.test(x.name || ''); })[0];
        var e = b.Enemies[t.members[0].enemyId];
        var own = (e.actions || []).map(function (a) { return a.skillId; });
        var p = own.filter(function (i) { return b.Skills[i] && /<\s*Apres\s*:\s*surcharge\s*>/i.test(b.Skills[i].note || ''); })[0];
        e.note = e.note.replace('<\/AI Priority>', 'HP% param <= 50%: Skill ' + p + ', Random\n<\/AI Priority>');
    }, /sans mise en garde/],
    ['un boss privé de sa mise en garde', function (b) {
        var t = b.Troops.filter(function (x) { return x && /◈/.test(x.name || ''); })[0];
        var e = b.Enemies[t.members[0].enemyId];
        var own = (e.actions || []).map(function (a) { return a.skillId; });
        var tg = own.filter(function (i) { return b.Skills[i] && /<\s*Telegraphe\s*>/i.test(b.Skills[i].note || ''); })[0];
        e.note = e.note.replace(new RegExp('^[^\\n]*Skill ' + tg + '[^\\n]*$', 'gm'), '');
    }, /prendre son élan/]
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
