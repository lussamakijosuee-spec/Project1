/*
 * BANC — MAHORAGA, LA ROUE QUI S'ADAPTE
 * ---------------------------------------------------------------------------
 * CE QU'IL ATTRAPE
 *
 * Mahoraga s'adapte : la deuxième fois qu'on lui fait la même chose, ça ne
 * marche plus (−70 %), et s'il a vu venir le patron, −90 % et il contre. Sa
 * seule faiblesse est le Mana Pur : ×2 dégâts.
 *
 * Tout ça peut échouer SANS UN MOT :
 *
 *  · le plugin n'était pas chargé du tout, alors que l'ennemi 21 « Champion de
 *    Vultric » porte <Mahoraga> ET <Radahn> depuis le début. Rien ne le
 *    signalait : le boss se battait comme un ennemi ordinaire ;
 *
 *  · sa faiblesse pointait sur l'élément 5. Or l'élément 5 « Mana Sombre » a
 *    été REPLIÉ sur le 4 : plus aucune compétence du jeu ne pointe dessus. La
 *    faiblesse ne pouvait donc jamais se déclencher. Le canon donne DEUX
 *    éléments au Mana Pur — 7 et 16 — et c'est sur ceux-là qu'il faut lire.
 *    Un contrôle qui se contenterait de « le paramètre existe » passerait ;
 *    celui-ci vérifie qu'il désigne un élément dont des compétences se servent.
 *
 *  · ses compétences de contre sont données par identifiant (63, 37, 41). Un
 *    identifiant vide, et le contre part sur une compétence qui n'existe pas.
 *
 *   node bancs/16_mahoraga.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');
var L = function (n) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', n + '.json'), 'utf8')); };

//===========================================================================
// 1 · Le plugin, tel que js/plugins.js le règle
//===========================================================================
var ENTREE = (function () {
    var src = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
    var bac = {};
    (new Function('$plugins', 'bac', src.replace(/^\s*var\s+\$plugins\s*=/, '$plugins =') +
        '\n;bac.p = $plugins;'))(null, bac);
    return bac.p.filter(function (x) { return x.name === 'MahoragaBoss'; })[0];
})();
if (!ENTREE) { console.error('✗ MahoragaBoss n\'est pas inscrit dans js/plugins.js'); process.exit(1); }
if (!ENTREE.status) { console.error('✗ MahoragaBoss est inscrit mais ÉTEINT'); process.exit(1); }

function Game_BattlerBase() { }
Game_BattlerBase.prototype.isMahoraga = function () { return false; };
function Game_Battler() { }
Game_Battler.prototype = Object.create(Game_BattlerBase.prototype);
Game_Battler.prototype.addState = function (id) { this._states.push(id); };
function Game_Enemy() { }
Game_Enemy.prototype = Object.create(Game_Battler.prototype);
Game_Enemy.prototype.setup = function () { };
Game_Enemy.prototype.makeActions = function () { };
function Game_Action() { }
Game_Action.prototype.subject = function () { return this._sujet; };
Game_Action.prototype.item = function () { return this._item; };
Game_Action.prototype.makeDamageValue = function () { return this._brut; };
var BattleManager = { _logWindow: null, endAction: function () { }, forceAction: function () { } };

global.Game_BattlerBase = Game_BattlerBase;
global.Game_Battler = Game_Battler;
global.Game_Enemy = Game_Enemy;
global.Game_Action = Game_Action;
global.BattleManager = BattleManager;
global.AudioManager = { playSe: function () { } };
global.SceneManager = { _scene: null };
global.$gameParty = { aliveMembers: function () { return []; } };
global.PluginManager = { parameters: function () { return ENTREE.parameters; } };
// Les vraies animations : un numéro réglé dans plugins.js doit exister.
global.$dataAnimations = JSON.parse(fs.readFileSync(path.join(RACINE, 'data', 'Animations.json'), 'utf8'));

require(path.join(RACINE, 'js', 'plugins', 'MahoragaBoss.js'));

function boss(note, pv) {
    var b = Object.create(Game_Enemy.prototype);
    b._d = { note: note, meta: {} };
    (note.match(/<\s*([A-Za-zÀ-ÿ]+)\s*>/g) || []).forEach(function (m) {
        b._d.meta[m.replace(/[<>]/g, '').trim()] = true;
    });
    b._hp = pv; b.mhp = pv; b._states = [];
    b.isEnemy = function () { return true; };
    b.enemy = function () { return this._d; };
    b.hpRate = function () { return this._hp / this.mhp; };
    b.isAlive = function () { return this._hp > 0; };
    // MV n'a PAS de requestAnimation sur un combattant : l'ancien banc le
    // simulait, et cachait ainsi le plantage dès qu'une animation était réglée.
    b._anims = [];
    b.startAnimation = function (id) { this._anims.push(id); };
    b.forceAction = function () { };
    Game_Enemy.prototype.setup.call(b);
    // le plugin initialise son état interne dans setup() — on rejoue ce qu'il y fait
    b._mSkills = {}; b._mStates = []; b._mRage = 0; b._mBerserk = false;
    b._mAnnounced = { 1: false, 2: false, 3: false }; b._mHistory = {};
    return b;
}
function heros() {
    var h = Object.create(Game_Battler.prototype);
    h._states = [];
    h.isEnemy = function () { return false; };
    h.actorId = function () { return 1; };
    h.isAlive = function () { return true; };
    h.index = function () { return 0; };
    return h;
}
function frappe(sujet, cible, brut, skillId, elementId) {
    var a = Object.create(Game_Action.prototype);
    a._sujet = sujet; a._brut = brut;
    a._item = { id: skillId, damage: { elementId: elementId === undefined ? 1 : elementId } };
    return a.makeDamageValue(cible, false);
}

//===========================================================================
// 2 · Les contrôles
//===========================================================================
function controles(monde) {
    var r = [], S = monde.Skills, E = monde.Enemies;

    // ——— l'adaptation, jouée coup par coup
    (function () {
        var m = boss('<Mahoraga>', 100000);
        var h = heros();
        var un = frappe(h, m, 1000, 100);      // phase 1 : 1re frappe, il encaisse
        var deux = frappe(h, m, 1000, 100);    // 2e : il s'adapte
        var trois = frappe(h, m, 1000, 100);   // 3e : ça ne marche plus
        r.push(['la même technique cesse de marcher sur lui',
            un === 1000 && deux === 1000 && trois < 400,
            un + ' → ' + deux + ' → ' + trois + ' (il faut 2 frappes pour qu\'il daigne s\'adapter, phase 1)']);

        var autre = frappe(h, m, 1000, 200);   // une technique neuve : plein tarif
        r.push(['une technique qu\'il n\'a jamais vue passe à plein tarif',
            autre === 1000, autre + ' dégâts sur 1000']);
    })();

    // ——— la faiblesse au Mana Pur doit viser un élément VIVANT
    (function () {
        var elems = String(ENTREE.parameters['PureManaElementId'] || '')
            .split(',').map(function (s) { return Number(s.trim()); }).filter(function (n) { return n > 0; });
        var servis = elems.filter(function (id) {
            return S.some(function (s) { return s && s.damage && s.damage.elementId === id; });
        });
        r.push(['la faiblesse au Mana Pur vise des éléments dont des compétences se servent',
            elems.length > 0 && servis.length === elems.length,
            'réglé sur [' + elems.join(', ') + '] · servis par des compétences : [' + servis.join(', ') + ']']);

        if (servis.length) {
            var m = boss('<Mahoraga>', 100000);
            var d = frappe(heros(), m, 1000, 300, servis[0]);
            r.push(['le Mana Pur lui fait bien le double', d === 2000, d + ' dégâts sur 1000']);
        } else {
            r.push(['le Mana Pur lui fait bien le double', false, 'aucun élément servi : intestable']);
        }
    })();

    // ——— les compétences de contre existent
    (function () {
        var manquantes = [];
        ['CounterSkillIds_P1', 'CounterSkillIds_P2', 'CounterSkillIds_P3'].forEach(function (k) {
            String(ENTREE.parameters[k] || '').split(',').forEach(function (s) {
                var id = Number(s.trim());
                if (id > 0 && (!S[id] || !S[id].name)) manquantes.push(k + ' → ' + id);
            });
        });
        r.push(['chaque compétence de contre existe vraiment', manquantes.length === 0,
            manquantes.length ? manquantes.join(' · ') : 'les trois pools pointent sur du réel']);
    })();

    // ——— l'adaptation aux états
    (function () {
        var m = boss('<Mahoraga>', 100000);
        // un héros le lui inflige : la Roue ne s'adapte qu'à l'autre camp
        BattleManager._subject = { isActor: function () { return true; } };
        m.addState(50);
        var premier = m._states.indexOf(50) >= 0;
        m._states = [];
        m.addState(50);
        var second = m._states.indexOf(50) >= 0;
        // contre-épreuve : ce qu'il se pose lui-même, il le garde
        BattleManager._subject = m; m._states = [];
        m.addState(51); m._states = []; m.addState(51);
        var sienne = m._states.indexOf(51) >= 0;
        BattleManager._subject = null;
        r.push(['la Roue ne s\'adapte pas à ce qu\'il se pose lui-même', sienne,
            sienne ? 'sa posture tient la seconde fois' : 'refusée — il s\'immunisait contre lui-même']);
        r.push(['un état qu\'il a déjà subi ne le reprend plus',
            premier && !second, premier ? 'subi une fois, refusé ensuite' : 'il ne l\'a même pas subi']);
    })();

    // ——— sur la vraie base : le boss est tagué et jouable
    (function () {
        var tagues = E.filter(function (e) { return e && e.name && /<\s*Mahoraga\s*>/i.test(e.note || ''); });
        r.push(['au moins un ennemi porte <Mahoraga>', tagues.length > 0,
            tagues.length ? tagues.map(function (e) { return e.id + ' ' + e.name; }).join(', ') : 'aucun']);

        var rad = E.filter(function (e) { return e && e.name && /<\s*Radahn\s*>/i.test(e.note || ''); });
        r.push(['le bloc <Radahn> a lui aussi son porteur', rad.length > 0,
            rad.length ? rad.map(function (e) { return e.id + ' ' + e.name; }).join(', ') : 'aucun']);
    })();

    // ——— les sons annoncés existent sur le disque
    (function () {
        var manquants = ['AdaptSE', 'ImmuneSE', 'PhaseSE', 'BerserkSE'].map(function (k) {
            return String(ENTREE.parameters[k] || '').trim();
        }).filter(function (n) { return n && !fs.existsSync(path.join(RACINE, 'audio', 'se', n + '.ogg')); });
        r.push(['chaque son réglé existe dans audio/se', manquants.length === 0,
            manquants.length ? manquants.join(', ') : 'tous les sons réglés sont sur le disque']);
    })();

    return r;
}

//===========================================================================
var BASE = { Skills: L('Skills'), Enemies: L('Enemies') };
var copie = function (o) { return JSON.parse(JSON.stringify(o)); };

var ok = 0, ko = 0;
console.log('\n1) Sur le vrai plugin et la vraie base');
controles(BASE).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

var SABOTAGES = [
    ['le <Mahoraga> retiré à son porteur', function (b) {
        b.Enemies.forEach(function (e) { if (e && e.note) e.note = e.note.replace(/<\s*Mahoraga\s*>/gi, ''); });
    }, /porte <Mahoraga>/],
    ['le <Radahn> retiré à son porteur', function (b) {
        b.Enemies.forEach(function (e) { if (e && e.note) e.note = e.note.replace(/<\s*Radahn\s*>/gi, ''); });
    }, /bloc <Radahn>/],
    ['une compétence de contre vidée', function (b) {
        var id = Number(String(ENTREE.parameters['CounterSkillIds_P1']).split(',')[0].trim());
        if (b.Skills[id]) b.Skills[id].name = '';
    }, /compétence de contre existe/]
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
