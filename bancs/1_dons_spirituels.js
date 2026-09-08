// Banc d'essai minimal : simule juste ce que DonsSpirituels.js touche.
const fs = require('fs');
const path = require('path').join(__dirname, '../');

// ── méta RPG Maker MV (extractMetadata, à l'identique) ─────────────────────
function meta(note) {
  const re = /<([^<>:]+)(:?)([^>]*)>/g; const m = {}; let x;
  while ((x = re.exec(note || ''))) m[x[1]] = x[2] === ':' ? x[3] : true;
  return m;
}
const load = f => JSON.parse(fs.readFileSync(path + 'data/' + f, 'utf8'));
const W = load('Weapons.json'), A = load('Armors.json'), AC = load('Actors.json');
[W, A].forEach(l => l.forEach(o => { if (o) o.meta = meta(o.note); }));

// ── stubs du moteur ────────────────────────────────────────────────────────
global.PluginManager = { parameters: () => ({}) };
global.$dataWeapons = W; global.$dataArmors = A;
global.$gameSystem = {};
const EQUIP_SLOTS = [1,2,3,4,5,6,7];

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

const ACTORS = {}; [1,2,3,4].forEach(i => ACTORS[i] = new Actor(i));
// Comme MV : actor() construit à la demande, _data contient les acteurs déjà créés.
// DonsSpirituels lit _data pour ne JAMAIS déclencher de construction (récursion).
global.$gameActors = { _data: ACTORS, actor: i => ACTORS[i] };
global.$gameParty = { members: () => Object.values(ACTORS) };
global.$gameMessage = { isBusy: () => true, add: () => {} };
global.SceneManager = { _scene: {} };
global.window = global;

const noop = function () {};
global.Game_Action = { prototype: { apply: noop, makeDamageValue: () => 100, isDamage: () => true } };
global.Game_BattlerBase = { prototype: { isSkillTypeSealed: () => false } };
global.Game_Battler = { prototype: { onTurnEnd: noop, regenerateHp: noop, paramRate: () => 1 } };
global.Game_Actor = { prototype: { recoverAll: noop, paramPlus: () => 0 } };
global.Game_Interpreter = { prototype: { pluginCommand: noop } };
global.Scene_MenuBase = function () {}; global.Window_Base = function () {};
global.Graphics = { boxWidth: 816, boxHeight: 624 };

const Dons = (function(){ eval(fs.readFileSync(path + 'js/plugins/DonsSpirituels.js', 'utf8')); return window.Dons; })();

// ── vérifications ──────────────────────────────────────────────────────────
let ko = 0;
const ok = (cond, txt) => { console.log((cond ? '  ✔ ' : '  ✘ ') + txt); if (!cond) ko++; };

console.log('\n=== Chaque Don est trouvé dans SON slot ===');
const SLOT = { 1: 'Arme', 5: 'Accessoire', 7: 'Âme' };
[1,2,3,4].forEach(i => {
  const d = Dons.de(i);
  console.log(`  #${i} ${ACTORS[i].name().padEnd(8)} ${d.typeNom.padEnd(18)} slot ${d.slotNom.padEnd(11)} → « ${d.piece} » (palier ${d.palier})`);
  ok(d.porte, `    le Don de ${ACTORS[i].name()} est bien porté`);
});
ok(Dons.de(1).slotNom === 'Accessoire', 'OBJET de Vesper  → Accessoire');
ok(Dons.de(3).slotNom === 'Accessoire', 'OBJET de ludwing → Accessoire');
ok(Dons.de(2).slotNom === 'Âme',        'FAMILIER Korrah  → Âme');
ok(Dons.de(4).slotNom === 'Arme',       'ARME Aël         → Arme');

console.log('\n=== Endurance : 40 + niveau×2 + (palier−1)×20 ===');
ok(Dons.de(4).max === 42, 'Aël niv.1 palier 1 → 42');
ACTORS[4].level = 60; ACTORS[4]._equips[0] = 516;   // Vérité de l'Arc
ok(Dons.de(4).max === 220, 'Aël niv.60 palier 4 → 220 (' + Dons.de(4).max + ')');

console.log('\n=== La jauge propre aux OBJETS ===');
ok(Dons.de(1).jauge && Dons.de(1).jauge.nom === 'Sang',  'Vesper  a une jauge de Sang');
ok(Dons.de(3).jauge && Dons.de(3).jauge.nom === 'Ombre', 'ludwing a une jauge d\'Ombre');
ok(Dons.de(2).jauge === null, 'le FAMILIER n\'a pas de seconde jauge');
ok(Dons.de(4).jauge === null, 'l\'ARME n\'a pas de seconde jauge');

console.log('\n=== Le MASQUE : son sang ne la blesse pas tant qu\'il tient ===');
// JOKO : « un masque qui lui permet d'utiliser son sang comme elle veut sans
// se blesser ». C'est TOUT son talent d'Objet — il n'accorde aucune
// statistique, aucun bonus. Ce qui se vérifie, c'est l'absence de prix.
const sang = () => {
  const a = { subject: () => ACTORS[1], item: () => ({ stypeId: 10, meta: {} }),
              isDamage: () => true, _donUse: false };
  const avant = ACTORS[1].hp;
  Game_Action.prototype.apply.call(a, {});
  return avant - ACTORS[1].hp;
};
Dons.reparer(1); ACTORS[1].hp = 500;
ok(sang() === 0, 'masque INTACT → une attaque de sang ne lui coûte aucun PV');

console.log('\n=== Abuser du sang FEND le masque (canon) ===');
for (let t = 0; t < 9; t++) sang();          // la 1re est déjà passée ci-dessus
ok(Dons.jauge(1).val === 0 && Dons.estCasse(1), '10 techniques de sang → jauge pleine → masque FENDU');

ACTORS[1].hp = 500;
const prix = sang();
ok(prix > 0, 'masque FENDU → dès lors son sang la blesse (−' + prix + ' PV)');
ok(prix === Math.floor(ACTORS[1].mhp * 8 / 100), '…et il lui coûte 8 % de ses PV max');

console.log('\n=== Abuser de l\'ombre fait EXPLOSER l\'amulette ===');
const act3 = { subject: () => ACTORS[3], item: () => ({ stypeId: 12, meta: {} }), isDamage: () => true };
for (let t = 0; t < 9; t++) { act3._donUse = false; Game_Action.prototype.apply.call(act3, {}); }
ok(Dons.ombreBloquee(3), 'jauge d\'Ombre pleine → explosion → blocage actif');
ok(Game_BattlerBase.prototype.isSkillTypeSealed.call(ACTORS[3], 14) === true, 'types d\'ombre 11-18 scellés');
ok(Game_BattlerBase.prototype.isSkillTypeSealed.call(ACTORS[3], 9) === false, 'le type « ame » (9) reste ouvert');

console.log('\n=== Brisé = tout ÷2, y compris les stats de la pièce ===');
Dons.reparer(1); Dons.casser(1);
const piece = A[68];
ok(Game_Actor.prototype.paramPlus.call(ACTORS[1], 0) === -Math.floor(piece.params[0] * 0.5),
   'Masque brisé → la moitié de ses PV bonus est retirée (' + Game_Actor.prototype.paramPlus.call(ACTORS[1], 0) + ')');
ok(Game_Action.prototype.makeDamageValue.call({ subject: () => ACTORS[1] }, {}, false) === 50,
   'dégâts 100 → 50');

console.log('\n=== Le FAMILIER : bonus, et le Trait qu\'il débloque ===');
ok(Math.abs(Game_Battler.prototype.paramRate.call(ACTORS[2], 2) - 1.10) < 1e-9, 'familier entier → +10 % ATK');
ok(Dons.traitDebloque(2) === 'hiver', 'familier porté → HIVER disponible');
Dons.casser(2);
ok(Math.abs(Game_Battler.prototype.paramRate.call(ACTORS[2], 2) - 1.05) < 1e-9, 'familier brisé → +5 % (÷2)');
ACTORS[2]._equips[6] = 0;   // on retire le familier du slot Âme
ok(Dons.traitDebloque(2) === '', 'familier retiré → HIVER indisponible');
ok(Dons.de(2).porte === false, 'et le Don est signalé « non porté »');
ok(Game_Battler.prototype.paramRate.call(ACTORS[2], 2) === 1, 'plus aucun bonus');

console.log('\n=== Le repos répare ===');
Game_Actor.prototype.recoverAll.call(ACTORS[1]);
ok(!Dons.estCasse(1) && Dons.jauge(1).val === 0, 'recoverAll → Don réparé et jauge vidée');

console.log(ko === 0 ? '\n✅ TOUT PASSE\n' : `\n❌ ${ko} échec(s)\n`);
process.exit(ko ? 1 : 0);
