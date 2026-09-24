// ════════════════════════════════════════════════════════════════════════════
//  BANC D'ESSAI — L'AVATAR MONTE EN NIVEAU + IL EST INSÉPARABLE   (v3.0)
//  Trois niveaux (25 · 50 · 85), contrôle croissant, techniques apprises,
//  et le lien qui ne se rompt qu'avec elle.
// ════════════════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path').join(__dirname, '../');

function meta(note) {
    const re = /<([^<>:]+)(:?)([^>]*)>/g; const m = {}; let x;
    while ((x = re.exec(note || ''))) m[x[1]] = x[2] === ':' ? x[3] : true;
    return m;
}
const load = f => JSON.parse(fs.readFileSync(path + 'data/' + f, 'utf8'));
const W = load('Weapons.json'), A = load('Armors.json'), AC = load('Actors.json'),
      SK = load('Skills.json'), C = load('Classes.json');
[W, A, SK].forEach(l => l.forEach(o => { if (o) o.meta = meta(o.note); }));

let ko = 0, journal = [];
const ok = (c, t) => { if (c) console.log('  ✔ ' + t); else { ko++; console.log('  ✘ ' + t); } };

// ── moteur simulé ───────────────────────────────────────────────────────────
global.window = global;
global.PluginManager = { parameters: () => ({}) };
global.$dataWeapons = W; global.$dataArmors = A; global.$dataSkills = SK;
global.$gameSystem = {};
global.$gameMessage = { isBusy: () => true, add: t => journal.push(t) };
global.SoundManager = { playBuzzer: () => {}, playCancel: () => {} };
global.Graphics = { boxWidth: 816, boxHeight: 624 };
const EQUIP_SLOTS = [1, 2, 3, 4, 5, 6, 7];

// Les ennemis du banc
function Enemy(i, hp) { this.i = i; this.hp = hp; this.mhp = hp; this._dead = false; }
Enemy.prototype.isEnemy = () => true;
Enemy.prototype.isActor = () => false;
Enemy.prototype.isAlive = function () { return !this._dead; };
Enemy.prototype.name = function () { return 'ennemi ' + this.i; };
Enemy.prototype.result = function () { return { isHit: () => true }; };
const TROUPE = [new Enemy(1, 900), new Enemy(2, 400), new Enemy(3, 700)];
global.$gameTroop = { aliveMembers: () => TROUPE.filter(e => e.isAlive()), members: () => TROUPE };

function Actor(id) {
    const src = AC.find(a => a && a.id === id);
    this.id = id; this.level = 1; this.hp = 900; this.mhp = 900;
    this._equips = src.equips.slice(); this._restr = 0;
}
Actor.prototype.isActor = () => true;
Actor.prototype.isEnemy = () => false;
Actor.prototype.actorId = function () { return this.id; };
Actor.prototype.name = function () { return AC.find(a => a && a.id === this.id).name; };
Actor.prototype.equipSlots = () => EQUIP_SLOTS;
Actor.prototype.equips = function () {
    return this._equips.map((v, i) => !v ? null : (EQUIP_SLOTS[i] === 1 ? W[v] : A[v]));
};
Actor.prototype.weapons = function () { return this.equips().filter(x => x && x.wtypeId); };
Actor.prototype.isAlive = function () { return this.hp > 0; };
Actor.prototype.restriction = function () { return this._restr; };
Actor.prototype.gainHp = function (n) { this.hp = Math.max(0, this.hp + n); };
Actor.prototype.refresh = function () {};
Actor.prototype.changeEquip = function (s, it) { this._equips[s] = it ? it.id : 0; };

const ACTORS = {}; [1, 2, 3, 4].forEach(i => ACTORS[i] = new Actor(i));
const K = ACTORS[2];                                    // Korrah
// Comme MV : actor() construit à la demande, _data contient les acteurs déjà créés.
// DonsSpirituels lit _data pour ne JAMAIS déclencher de construction (récursion).
global.$gameActors = { _data: ACTORS, actor: i => ACTORS[i] };
global.$gameParty = { members: () => Object.values(ACTORS), gainItem: () => {}, numItems: () => 0 };

const noop = function () {};
let LOG = [];
global.SceneManager = { _scene: { _logWindow: {
    push: (...a) => { if (a[0] === 'addText') LOG.push(a[1]); },
    displayActionResults: noop
} } };
global.BattleManager = { endAction: noop, _logWindow: null };

// Game_Action : assez fidèle pour que le plugin s'exécute pour de vrai
let DEGATS = [];
function Game_Action(subject) { this._subject = subject; this._targetIndex = -1; this._item = null; }
Game_Action.prototype.subject = function () { return this._subject; };
Game_Action.prototype.setSkill = function (id) { this._item = SK[id]; };
Game_Action.prototype.item = function () { return this._item; };
Game_Action.prototype.setTarget = function (i) { this._targetIndex = i; };
Game_Action.prototype.makeTargets = function () {
    if (!this._item) return [];
    if (this._item.scope === 2) return $gameTroop.aliveMembers();
    if (this._item.scope === 11) return [this._subject];
    const t = TROUPE[this._targetIndex];
    return t && t.isAlive() ? [t] : [];
};
Game_Action.prototype.apply = function (target) {
    const v = this.makeDamageValue(target, false);
    DEGATS.push({ cible: target.name(), valeur: v, skill: this._item.name });
};
Game_Action.prototype.makeDamageValue = function () { return 100; };  // base fixe
// comme MV : c'est le moteur qui répète, pas la formule
Game_Action.prototype.numRepeats = function () { return this._item ? (this._item.repeats || 1) : 1; };
Game_Action.prototype.applyGlobal = noop;
Game_Action.prototype.executeHpDamage = noop;
Game_Action.prototype.isDamage = () => true;
global.Game_Action = Game_Action;

global.Game_BattlerBase = { prototype: { isSkillTypeSealed: () => false, canEquip: () => true } };
global.Game_Battler = { prototype: { onTurnEnd: noop, onTurnStart: noop, onBattleStart: noop,
                                     regenerateHp: noop, paramRate: () => 1, refresh: noop } };
global.Game_Actor = { prototype: Actor.prototype };
Game_Actor.prototype.paramPlus = () => 0;
Game_Actor.prototype.recoverAll = noop;
Game_Actor.prototype.levelUp = noop;
global.Game_Interpreter = { prototype: { pluginCommand: noop } };
global.Scene_MenuBase = function () {}; global.Window_Base = function () {};
global.Input = { isTriggered: () => false }; global.TouchInput = { isCancelled: () => false };
global.AudioManager = { playSe: noop };
global.Scene_Map = { prototype: { onMapLoaded: noop, update: noop } };

// ─────────────────────────────────────────────────────────────────────────────
// ⚠ ON NE CHARGE QUE CE QUE LE JEU CHARGE.
// Le 2026-09-24, JOKO a retiré le système des Dons Spirituels. Ce banc
// continuait d'évaluer `DonsSpirituels.js` depuis le disque : il mesurait donc
// un moteur qui n'existe plus, et accusait l'Avatar d'avoir disparu alors qu'il
// va très bien. Un banc qui charge un greffon éteint ne simule pas le moteur
// (§6). On lit le registre, et on s'aligne dessus.
const _REGISTRE = JSON.parse(
    require('fs').readFileSync(path + 'js/plugins.js', 'utf8')
        .replace(/^[^\[]*/, '').replace(/;\s*$/, ''));
const _greffonActif = n => _REGISTRE.some(p => p.name === n && p.status);
// ─────────────────────────────────────────────────────────────────────────────

if (_greffonActif('DonsSpirituels')) { eval(fs.readFileSync(path + 'js/plugins/DonsSpirituels.js', 'utf8')); }
eval(fs.readFileSync(path + 'js/plugins/AvatarSpirituel.js', 'utf8'));
const Av = window.Avatars;

const reset = () => { LOG = []; DEGATS = []; journal = []; };

console.log('\n=== 1 · LES TROIS SEUILS : 25 · 50 · 85 ===');
const attendu = [[1, 0], [24, 0], [25, 1], [49, 1], [50, 2], [84, 2], [85, 3], [99, 3]];
attendu.forEach(([lv, n]) => {
    K.level = lv;
    ok(Av.niveau(2) === n, 'Korrah niveau ' + String(lv).padStart(2) + ' → Avatar niveau ' + n
       + (Av.niveau(2) === n ? '' : ' (obtenu ' + Av.niveau(2) + ')'));
});

console.log('\n=== 2 · LE CONTRÔLE MONTE AVEC LA PUISSANCE ===');
const modes = { 1: 'AUTOMATIQUE', 25: 'SEMI-AUTOMATIQUE', 50: 'SEMI-AUTOMATIQUE affermi', 85: 'CONTRÔLE TOTAL' };
Object.keys(modes).forEach(lv => {
    K.level = parseInt(lv);
    ok(Av.de(2).controle === modes[lv], 'niveau ' + lv + ' → ' + modes[lv]);
});
K.level = 1;  ok(Av.de(2).prochainSeuil === 25, 'au départ, le prochain seuil annoncé est 25');
K.level = 85; ok(Av.de(2).prochainSeuil === 0,  'au niveau 3, plus de seuil suivant');

console.log('\n=== 3 · IL APPREND DEUX TECHNIQUES PAR NIVEAU ===');
const compte = {};
[1, 25, 50, 85].forEach(lv => { K.level = lv; compte[lv] = Av.de(2).techniques.length; });
ok(compte[1] === 2,   'naissance : 2 gestes (frappe + garde) — obtenu ' + compte[1]);
ok(compte[25] === 4,  'niveau 1 : +2 → 4 — obtenu ' + compte[25]);
ok(compte[50] === 6,  'niveau 2 : +2 → 6 — obtenu ' + compte[50]);
ok(compte[85] === 8,  'niveau 3 : +2 → 8 — obtenu ' + compte[85]);
K.level = 85;
const noms = Av.de(2).techniques.map(s => SK[s].name);
ok(noms.length === new Set(noms).size, 'aucun doublon dans son répertoire');
console.log('      → ' + noms.join(' · '));

console.log('\n=== 4 · SA PUISSANCE MONTE AUSSI ===');
const P = {};
[1, 25, 50, 85].forEach(lv => { K.level = lv; P[lv] = Av.de(2).puissance; });
ok(Math.abs(P[1]  - 1.00) < 0.001, 'naissance ×1.00');
ok(Math.abs(P[25] - 1.15) < 0.001, 'niveau 1 ×1.15');
ok(Math.abs(P[50] - 1.30) < 0.001, 'niveau 2 ×1.30');
ok(Math.abs(P[85] - 1.45) < 0.001, 'niveau 3 ×1.45');
// et elle s'applique vraiment aux dégâts
K.level = 1;  reset(); Av.agir(2); const d1 = DEGATS[0] ? DEGATS[0].valeur : 0;
K.level = 85; reset(); Av.agir(2); const d3 = DEGATS[0] ? DEGATS[0].valeur : 0;
ok(d1 === 100, 'à la naissance, une frappe de base vaut 100 (référence)');
ok(d3 === 145, 'au niveau 3, la même frappe vaut 145 — obtenu ' + d3);

console.log('\n=== 5 · IL EST INSÉPARABLE — rien ne peut le lui prendre ===');
K.level = 50; K.hp = 900; K._restr = 0;
ok(Av.present(2), 'elle est vivante et consciente → il est là');

// ── EN SOMMEIL DEPUIS LE 2026-09-24 ────────────────────────────────────────
// « Brisé » était un état du DON : la pièce s'usait, se fendait, se réparait.
// JOKO a retiré le système des Dons — « trop complexe pour rien ». L'Avatar
// lui a survécu comme FAMILIER : il ne se casse plus, il n'a plus d'endurance.
// Ces deux contrôles n'ont donc plus d'objet. On ne les efface pas (§3) : ils
// se rallument tout seuls le jour où DonsSpirituels revient au registre.
if (_greffonActif('DonsSpirituels')) {
    window.Dons.casser(2);
    ok(Av.present(2), 'BRISÉ, il est toujours là — il fatigue, il ne disparaît pas');
    ok(Av.de(2).brise, '…et il est bien signalé comme brisé');
    window.Dons.reparer(2);
} else {
    console.log('  ⏸ « brisé » est en sommeil — le système des Dons est retiré, un familier ne se casse pas');
}

// inconsciente → il s'éteint
K._restr = 4;
ok(!Av.present(2), 'elle perd conscience (restriction 4) → il s\'éteint');
ok(Av.de(2).eteinte, '…et la fiche le dit clairement');
reset(); Av.agir(2);
ok(DEGATS.length === 0, '…il n\'agit plus du tout');

// elle revient → il revient
K._restr = 0;
ok(Av.present(2), 'elle rouvre les yeux → il est là');
reset(); Av.agir(2);
ok(DEGATS.length === 1, '…et il agit de nouveau');

// tombée → il s'éteint
K.hp = 0;
ok(!Av.present(2), 'elle tombe → il s\'éteint avec elle');
K.hp = 900;
ok(Av.present(2), 'elle est relevée → il est là');

console.log('\n=== 6 · LES ORDRES DIRIGÉS SUIVENT SON NIVEAU ===');
function jouer(skillId, cibleIdx) {
    reset();
    const a = new Game_Action(K);
    a._item = SK[skillId];
    a._targets = cibleIdx === undefined ? null : [TROUPE[cibleIdx]];
    Game_Action.prototype.applyGlobal.call(a);
    return { degats: DEGATS.slice(), log: LOG.slice() };
}
// 1255 « Vise ça » exige le niveau 1
K.level = 1;
let r = jouer(1255, 0);
ok(r.degats.length === 0, 'niveau 0 : « Vise ça » est refusé — il ne sait pas encore faire');
ok(r.log.some(l => /ne sait pas encore/.test(l)), '…et on le lui dit clairement');

K.level = 25;
r = jouer(1255, 0);
ok(r.degats.length === 3, 'niveau 1 : « Vise ça » exécute Poings Enchaînés — 3 coups');
ok(r.degats.every(d => d.cible === 'ennemi 1'), '…sur la cible QU\'ELLE a désignée, pas la plus faible');
ok(r.degats[0].skill === 'Poings Enchaînés', '…et c\'est bien la technique de l\'ordre');

// 1256 « Étau » exige le niveau 2
r = jouer(1256, 0);
ok(r.degats.length === 0, 'niveau 1 : « Étau » est encore refusé');
K.level = 50;
r = jouer(1256, 2);
ok(r.degats.length === 1 && r.degats[0].skill === "Étau de l'Armure",
   'niveau 2 : « Étau » passe — elle choisit la cible ET le geste');
ok(r.degats[0].cible === 'ennemi 3', '…sur l\'ennemi 3, celui qu\'elle vise');

// 1257 « Unisson » exige le niveau 3
r = jouer(1257, 0);
ok(r.degats.length === 0, 'niveau 2 : « Unisson » est encore refusé');
K.level = 85;
r = jouer(1257, 0);
ok(r.degats.length === 3 && r.degats[0].skill === "Déferlante d'Unisson",
   'niveau 3 : « Unisson » frappe les trois ennemis');
r = jouer(1258, 0);
ok(r.degats.length === 3 && r.degats[0].skill === 'Ce Que Le Froid Garde',
   'niveau 3 : « Rends-le » aussi');

console.log('\n=== 7 · UN ORDRE DIRIGÉ PASSE OUTRE LA POSTURE DE GARDE ===');
Av.posture(2, 'garde');
reset(); Av.agir(2);
ok(DEGATS.length === 0, 'en posture GARDE, laissé à lui-même il ne frappe pas');
r = jouer(1257, 0);
ok(r.degats.length === 3, '…mais un ordre dirigé, elle, il l\'exécute — c\'est ça, le contrôle');
Av.posture(2, 'libre');

console.log('\n=== 8 · LES DONNÉES SUIVENT ===');
const ORDRES = { 1255: 25, 1256: 50, 1257: 85, 1258: 85 };
Object.keys(ORDRES).forEach(sid => {
    sid = parseInt(sid);
    const l = C[2].learnings.find(x => x.skillId === sid);
    ok(l && l.level === ORDRES[sid],
       '« ' + SK[sid].name + ' » apprise au niveau ' + ORDRES[sid] + (l ? '' : ' — JAMAIS APPRISE'));
    ok(C[2].traits.some(t => t.code === 41 && t.dataId === SK[sid].stypeId),
       '  · son type de compétence est ouvert à Korrah');
});
[1249, 1250, 1251, 1252, 1253, 1254].forEach(id => {
    ok(SK[id] && SK[id].meta['Avatar'] !== undefined,
       '#' + id + ' « ' + (SK[id] ? SK[id].name : '?') + ' » est bien notée <Avatar>');
    ok(SK[id] && SK[id].occasion === 3,
       '  · jamais jouable depuis un menu (occasion 3)');
    ok(!C[2].learnings.some(l => l.skillId === id),
       '  · Korrah ne l\'apprend pas — c\'est LUI qui la joue');
});
// les frappes de l'Avatar ne doivent pas s'effondrer contre une grosse DÉF
[469, 470, 1249, 1251, 1253, 1254].forEach(id => {
    const f = SK[id].damage.formula;
    const a = { atk: 400 }, b = { def: 900 };
    let v = 0;
    try { v = Math.max(eval(f), 0); } catch (e) { v = NaN; }
    ok(Number.isFinite(v) && v > 0,
       '#' + id + ' « ' + SK[id].name + ' » fait encore ' + Math.floor(v) + ' dégâts contre DÉF 900');
});

console.log(ko === 0 ? '\n✅ TOUT PASSE\n' : `\n❌ ${ko} échec(s)\n`);
process.exit(ko ? 1 : 0);
