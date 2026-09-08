// ════════════════════════════════════════════════════════════════════════════
//  BANC D'ESSAI — LE VERROU DU DON + LES ORDRES À L'AVATAR   (v3.0)
//  On rejoue le vrai code des plugins sur des stubs qui se comportent comme MV,
//  y compris changeEquip / clearEquipments / optimizeEquipments.
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
      SK = load('Skills.json');
[W, A, SK].forEach(l => l.forEach(o => { if (o) o.meta = meta(o.note); }));

let ko = 0, journal = [];
const ok = (c, t) => { if (c) console.log('  ✔ ' + t); else { ko++; console.log('  ✘ ' + t); } };

// ── moteur simulé ───────────────────────────────────────────────────────────
global.window = global;
global.PluginManager = { parameters: () => ({}) };
global.$dataWeapons = W; global.$dataArmors = A; global.$dataSkills = SK;
global.$gameSystem = {};
global.$gameMessage = { isBusy: () => true, add: t => journal.push(t) };
global.SoundManager = { playBuzzer: () => journal.push('BUZZER'), playCancel: () => {} };
global.Graphics = { boxWidth: 816, boxHeight: 624 };
const EQUIP_SLOTS = [1, 2, 3, 4, 5, 6, 7];

// Game_Actor, aussi proche de MV que nécessaire
function Actor(id) {
    const src = AC.find(a => a && a.id === id);
    this.id = id; this.level = 1; this.hp = 500; this.mhp = 500;
    this._equips = src.equips.slice();
}
Actor.prototype.isActor = () => true;
Actor.prototype.actorId = function () { return this.id; };
Actor.prototype.name = function () { return AC.find(a => a && a.id === this.id).name; };
Actor.prototype.equipSlots = () => EQUIP_SLOTS;
Actor.prototype.equips = function () {
    return this._equips.map((v, i) => !v ? null : (EQUIP_SLOTS[i] === 1 ? W[v] : A[v]));
};
Actor.prototype.weapons = function () { return this.equips().filter(x => x && x.wtypeId); };
Actor.prototype.gainHp = function (n) { this.hp = Math.max(1, this.hp + n); };
Actor.prototype.refresh = function () {};
// v3.0 — l'Avatar ne vit que tant qu'elle est vivante ET consciente :
// sans ces deux-là, le plugin le croit éteint et refuse tous les ordres.
Actor.prototype.isAlive = function () { return this.hp > 0; };
Actor.prototype.restriction = function () { return this._restr || 0; };
// MV : changeEquip échange avec le groupe puis pose l'objet si l'etypeId colle
Actor.prototype.changeEquip = function (slotId, item) {
    if (item && EQUIP_SLOTS[slotId] !== item.etypeId) return;
    this._equips[slotId] = item ? item.id : 0;
};
// MV : clearEquipments passe par changeEquip — donc par le verrou
Actor.prototype.clearEquipments = function () {
    for (let i = 0; i < EQUIP_SLOTS.length; i++) this.changeEquip(i, null);
};
Actor.prototype.bestEquipItem = function () { return null; };
Actor.prototype.optimizeEquipments = function () {
    this.clearEquipments();
    for (let i = 0; i < EQUIP_SLOTS.length; i++) this.changeEquip(i, this.bestEquipItem(i));
};

const ACTORS = {}; [1, 2, 3, 4].forEach(i => ACTORS[i] = new Actor(i));
// Comme MV : actor() construit à la demande, _data contient les acteurs déjà créés.
// DonsSpirituels lit _data pour ne JAMAIS déclencher de construction (récursion).
global.$gameActors = { _data: ACTORS, actor: i => ACTORS[i] };
global.$gameParty = { members: () => Object.values(ACTORS), gainItem: () => {}, numItems: () => 0 };
global.SceneManager = { _scene: {} };

const noop = function () {};
global.Game_Action = { prototype: { apply: noop, applyGlobal: noop, makeDamageValue: () => 100,
                                    isDamage: () => true, executeHpDamage: noop } };
global.Game_BattlerBase = { prototype: { isSkillTypeSealed: () => false, canEquip: () => true } };
global.Game_Battler = { prototype: { onTurnEnd: noop, onTurnStart: noop, onBattleStart: noop,
                                     regenerateHp: noop, paramRate: () => 1 } };
global.Game_Actor = { prototype: Actor.prototype };
Game_Actor.prototype.paramPlus = () => 0;
Game_Actor.prototype.recoverAll = noop;
Game_Actor.prototype.levelUp = noop;
global.Game_Interpreter = { prototype: { pluginCommand: noop } };
global.Scene_MenuBase = function () {}; global.Window_Base = function () {};
global.BattleManager = { endAction: noop };
global.Input = { isTriggered: () => false }; global.TouchInput = { isCancelled: () => false };
global.AudioManager = { playSe: noop };
global.Scene_Map = { prototype: { onMapLoaded: noop, update: noop } };

eval(fs.readFileSync(path + 'js/plugins/ObjetSpirituel.js', 'utf8'));
eval(fs.readFileSync(path + 'js/plugins/DonsSpirituels.js', 'utf8'));

console.log('\n=== 1 · LE DON NE SE RETIRE PAS ===');
const v = ACTORS[1];
ok(v._equips[4] === 68, 'Vesper porte bien son Masque (#68) à l\'Accessoire');
journal = [];
v.changeEquip(4, null);
ok(v._equips[4] === 68, 'la retirer à la main ne marche pas — le Masque reste');
ok(journal.indexOf('BUZZER') >= 0, 'le refus est signalé au joueur (buzzer)');
v.changeEquip(4, A[80]);                   // tenter d'écraser par le Carquois
ok(v._equips[4] === 68, 'la remplacer par un autre accessoire ne marche pas non plus');

console.log('\n=== 2 · « TOUT RETIRER » ET « OPTIMISER » NE LE JETTENT PAS ===');
v._equips[0] = 160;
v.clearEquipments();
ok(v._equips[4] === 68, 'après « tout retirer », le Don est toujours là');
ok(v._equips[0] === 0,  '…et l\'arme ordinaire, elle, a bien été retirée');
v._equips[0] = 160;
v.optimizeEquipments();
ok(v._equips[4] === 68, 'après « optimiser », le Don est toujours là');

console.log('\n=== 3 · UN DON NE SE PRÊTE PAS ===');
const k = ACTORS[2];
journal = [];
k.changeEquip(4, A[68]);                   // le Masque de Vesper sur Korrah
ok(k._equips[4] !== 68, 'Korrah ne peut pas porter le Masque de Vesper');
ok(journal.indexOf('BUZZER') >= 0, 'le refus est signalé');
ok(Game_BattlerBase.prototype.canEquip.call(k, A[68]) === false,
   'le Masque n\'apparaît même pas dans la liste d\'équipement de Korrah');
ok(Game_BattlerBase.prototype.canEquip.call(ACTORS[1], A[68]) === true,
   '…mais il apparaît bien dans celle de Vesper');
ok(Game_BattlerBase.prototype.canEquip.call(k, W[160]) === true,
   'une arme ordinaire reste équipable par tout le monde');

console.log('\n=== 4 · L\'ÉVOLUTION, ELLE, A LE DROIT (drapeau interne) ===');
ACTORS[1].level = 60;
window._DonInterne = true;
ACTORS[1].changeEquip(4, A[71]);
window._DonInterne = false;
ok(ACTORS[1]._equips[4] === 71, 'ObjetSpirituel peut faire monter le Don de palier');
ok(window._DonInterne === false, 'le drapeau est bien retombé');
journal = [];
ACTORS[1].changeEquip(4, null);
ok(ACTORS[1]._equips[4] === 71, '…et le verrou s\'est refermé aussitôt après');

console.log('\n=== 5 · LES ORDRES À L\'AVATAR ===');
// on recharge l'Avatar par-dessus le même moteur
global.$gameTroop = { aliveMembers: () => [], members: () => [] };
eval(fs.readFileSync(path + 'js/plugins/AvatarSpirituel.js', 'utf8'));

ok(typeof window.Avatars === 'object', 'window.Avatars existe');
ok(window.Familiers === window.Avatars, 'l\'ancien nom window.Familiers reste un alias');
ok(window.Avatars.de(2).posture === 'libre', 'posture de départ : libre');

// on joue les trois compétences comme le ferait le combat
function jouerOrdre(skillId) {
    const act = { _parAvatar: false, subject: () => ACTORS[2], item: () => SK[skillId] };
    Game_Action.prototype.applyGlobal.call(act);
}
jouerOrdre(1248);
ok(window.Avatars.de(2).posture === 'garde', '« Avatar — Devant moi » → posture GARDE');
jouerOrdre(1247);
ok(window.Avatars.de(2).posture === 'agressif', '« Avatar — Assaut » → posture AGRESSIF');
jouerOrdre(1246);
ok(window.Avatars.de(2).posture === 'libre', '« Avatar — Laisse-le faire » → posture LIBRE');

// une compétence sans notetag ne doit rien changer
window.Avatars.posture(2, 'garde');
jouerOrdre(469);
ok(window.Avatars.de(2).posture === 'garde', 'une compétence ordinaire ne change pas la posture');

// l'Avatar retiré : l'ordre est refusé proprement, sans planter
window.Avatars.posture(2, 'libre');
const sauve = ACTORS[2]._equips[6];
ACTORS[2]._equips[6] = 0;
journal = [];
let planté = false;
try { jouerOrdre(1248); } catch (e) { planté = true; }
ok(!planté, 'sans Avatar au slot Âme, donner un ordre ne plante pas');
ok(window.Avatars.de(2).posture === 'libre', '…et la posture ne bouge pas');
ACTORS[2]._equips[6] = sauve;

console.log('\n=== 6 · « FAMILIER » RESTE COMPRIS (anciens événements) ===');
Game_Interpreter.prototype.pluginCommand.call({}, 'FAMILIER', ['posture', '2', 'garde']);
ok(window.Avatars.de(2).posture === 'garde', 'la vieille commande FAMILIER posture marche encore');
Game_Interpreter.prototype.pluginCommand.call({}, 'AVATAR', ['posture', '2', 'libre']);
ok(window.Avatars.de(2).posture === 'libre', 'la nouvelle commande AVATAR posture marche');
ok(window.Dons.aLaForme(2, 'familier') && window.Dons.aLaForme(2, 'avatar'),
   'aLaForme accepte les deux mots — rien ne casse');
ok(window.Dons.estAvatar(2) && !window.Dons.estAvatar(1), 'estAvatar() ne désigne que Korrah');

console.log(ko === 0 ? '\n✅ TOUT PASSE\n' : `\n❌ ${ko} échec(s)\n`);
process.exit(ko ? 1 : 0);
