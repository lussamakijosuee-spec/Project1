// Banc d'essai : AvatarSpirituel.js — la créature agit-elle vraiment seule ?
const fs=require('fs'); const P=require('path').join(__dirname, '../');
function meta(n){const re=/<([^<>:]+)(:?)([^>]*)>/g;const m={};let x;while((x=re.exec(n||'')))m[x[1]]=x[2]===':'?x[3]:true;return m;}
const load=f=>JSON.parse(fs.readFileSync(P+'data/'+f,'utf8'));
const W=load('Weapons.json'),A=load('Armors.json'),AC=load('Actors.json'),SK=load('Skills.json');
[W,A,SK].forEach(l=>l.forEach(o=>{if(o)o.meta=meta(o.note);}));
global.window=global;
global.PluginManager={parameters:()=>({})};
global.$dataWeapons=W; global.$dataArmors=A; global.$dataSkills=SK;
global.$gameSystem={};
const SLOTS=[1,2,3,4,5,6,7];

// ── acteurs ────────────────────────────────────────────────────────────────
function Actor(id){const s=AC.find(a=>a&&a.id===id);this.id=id;this.level=20;this.hp=1000;this.mhp=1000;
  this.atk=100;this._equips=s.equips.slice();}
Actor.prototype.isActor=()=>true; Actor.prototype.isEnemy=()=>false;
Actor.prototype.actorId=function(){return this.id;};
Actor.prototype.name=function(){return AC.find(a=>a&&a.id===this.id).name;};
Actor.prototype.isAlive=function(){return this.hp>0;};
Actor.prototype.equipSlots=()=>SLOTS;
Actor.prototype.equips=function(){return this._equips.map((v,i)=>!v?null:(SLOTS[i]===1?W[v]:A[v]));};
Actor.prototype.gainHp=function(n){this.hp=Math.max(0,this.hp+n);};
Actor.prototype.result=function(){return this._res||(this._res={});};
// ── ennemis ────────────────────────────────────────────────────────────────
function Enemy(n,hp){this.n=n;this.hp=hp;this.mhp=hp;this.def=20;this._res={};}
Enemy.prototype.isActor=()=>false; Enemy.prototype.isEnemy=()=>true;
Enemy.prototype.name=function(){return this.n;};
Enemy.prototype.isAlive=function(){return this.hp>0;};
Enemy.prototype.result=function(){return this._res || (this._res={});};
Enemy.prototype.gainHp=function(v){this.hp=Math.max(0,this.hp+v);};

const korrah=new Actor(2);
const ennemis=[new Enemy('Gobelin',400),new Enemy('Spectre',250),new Enemy('Golem',900)];
global.$gameActors={actor:i=>i===2?korrah:null};
global.$gameTroop={members:()=>ennemis,aliveMembers:()=>ennemis.filter(e=>e.isAlive())};
global.$gameMessage={isBusy:()=>true,add:()=>{}};

// ── journal de combat : on note ce que le familier raconte et fait ─────────
const JOURNAL=[]; const ANIMS=[];
global.SceneManager={_scene:{_logWindow:{
  push:(m,...a)=>{ if(m==='addText')JOURNAL.push(a[0].replace(/\\C\[\d+\]/g,''));
                   if(m==='showAnimation')ANIMS.push({anim:a[2],cibles:a[1].length}); },
  displayActionResults:()=>{}
}}};

// ── Game_Action minimal mais fidèle ────────────────────────────────────────
function Game_Action(sujet){this._sujet=sujet;this._item=null;this._targetIndex=-1;}
Game_Action.prototype.setSkill=function(id){this._item=SK[id];};
Game_Action.prototype.setTarget=function(i){this._targetIndex=i;};
Game_Action.prototype.item=function(){return this._item;};
Game_Action.prototype.subject=function(){return this._sujet;};
Game_Action.prototype.makeTargets=function(){
  const v=$gameTroop.aliveMembers();
  if(this._item.scope===2) return v.slice();
  if(this._item.scope===11) return [this._sujet];
  const i=this._targetIndex;
  const vise=(i>=0&&$gameTroop.members()[i]&&$gameTroop.members()[i].isAlive())?$gameTroop.members()[i]:v[0];
  return [vise];
};
Game_Action.prototype.apply=function(t){
  const a=this._sujet,b=t;
  const val=Math.max(0,Math.floor(eval(this._item.damage.formula)));
  Game_Action.prototype.executeHpDamage.call(this,t,val);
};
Game_Action.prototype.executeHpDamage=function(t,v){t.gainHp(-v);t.result().hpDamage=v;};
Game_Action.prototype.applyGlobal=function(){};
global.Game_Action=Game_Action;
global.Game_Battler={prototype:{onTurnStart:function(){},onBattleStart:function(){}}};
global.Game_Interpreter={prototype:{pluginCommand:function(){}}};
global.BattleManager={_subject:null,_targets:[],endAction:function(){}};
global.Game_Actor={prototype:{recoverAll:function(){},paramPlus:()=>0}};
global.Game_BattlerBase={prototype:{isSkillTypeSealed:()=>false}};
Game_Battler.prototype.onTurnEnd=function(){};
Game_Battler.prototype.regenerateHp=function(){};
Game_Battler.prototype.paramRate=()=>1;
Game_Action.prototype.isDamage=function(){return this._item&&this._item.damage.type===1;};
Game_Action.prototype.makeDamageValue=function(v){return v;};
global.Scene_MenuBase=function(){}; global.Window_Base=function(){};
global.Graphics={boxWidth:816,boxHeight:624};

eval(fs.readFileSync(P+'js/plugins/DonsSpirituels.js','utf8'));
eval(fs.readFileSync(P+'js/plugins/AvatarSpirituel.js','utf8'));

let ko=0; const ok=(c,t)=>{console.log((c?'  ✔ ':'  ✘ ')+t); if(!c)ko++;};
const tour=(cible)=>{ Game_Battler.prototype.onTurnStart.call(korrah);
  BattleManager._subject=korrah; BattleManager._targets=cible?[cible]:[];
  BattleManager.endAction.call(BattleManager); };

console.log('\n=== Il joue son propre tour ===');
JOURNAL.length=0; ANIMS.length=0;
tour(null);
console.log('  journal :', JOURNAL.join(' / '));
ok(JOURNAL.some(l=>l.includes('agit de lui-même')), "l'Armure Volante agit d'elle-même");
ok(ANIMS.length===1 && ANIMS[0].anim===21, 'son animation à lui (21 · Frapper Spécial 1)');
ok(ennemis[1].hp<250, 'il a frappé le plus bas en PV — le Spectre ('+ennemis[1].hp+'/250)');

console.log("\n=== Il finit le travail de sa porteuse ===");
JOURNAL.length=0; const avant=ennemis[2].hp;
tour(ennemis[2]);                      // Korrah vient de frapper le Golem
ok(ennemis[2].hp<avant, 'il enchaîne sur la cible que Korrah venait de frapper');

console.log('\n=== Un seul familier par tour, pas deux ===');
JOURNAL.length=0;
BattleManager._subject=korrah; BattleManager.endAction.call(BattleManager);
BattleManager.endAction.call(BattleManager);
ok(JOURNAL.filter(l=>l.includes('agit')).length<=1, "il n'agit qu'une fois par tour");

console.log('\n=== Palier 3 : il déferle sur le groupe un tour sur deux ===');
korrah.level=35; korrah._equips[6]=78;   // Armure Résonante — palier 3
Dons.reparer(2);
JOURNAL.length=0; ANIMS.length=0;
for(let t=0;t<4;t++) tour(null);
const defer=ANIMS.filter(a=>a.anim===404);
ok(defer.length>0, 'la Déferlante (anim 404) sort quand il y a plusieurs ennemis');
ok(defer.every(a=>a.cibles>1), 'et elle touche bien tout le groupe');

console.log('\n=== Il se met devant quand elle est en danger (posture LIBRE) ===');
JOURNAL.length=0; korrah.hp=200;         // 20 % de PV → sous le seuil de 40 %
tour(null);
ok(JOURNAL.some(l=>l.includes('se place devant')), 'sous 40 % de PV, il cesse de frapper pour protéger');

console.log('\n=== Il encaisse à sa place — et ça use son Endurance ===');
korrah.hp=1000; Dons.reparer(2);
const endAvant=Dons.de(2).endurance;
const coup=new Game_Action(ennemis[0]);
JOURNAL.length=0;
Game_Action.prototype.executeHpDamage.call(coup, korrah, 200);
ok(korrah.hp>800, 'les 200 dégâts sont amortis — elle ne perd que '+(1000-korrah.hp));
ok(JOURNAL.some(l=>l.includes('encaisse à sa place')), 'le familier annonce qu\'il encaisse');
ok(Dons.de(2).endurance<endAvant, "protéger use son Endurance ("+endAvant+' → '+Dons.de(2).endurance+')');

console.log('\n=== Posture GARDE : il ne frappe plus, il protège beaucoup plus ===');
Familiers.posture(2,'garde'); Dons.reparer(2); korrah.hp=1000;
JOURNAL.length=0;
tour(null);
ok(!JOURNAL.some(l=>l.includes('agit de lui-même')), 'en garde, il ne frappe plus');
Game_Action.prototype.executeHpDamage.call(coup, korrah, 200);
ok(1000-korrah.hp===110, 'il encaisse 45 % (90) au lieu de 20 % (40) — elle ne perd que '+(1000-korrah.hp)+' au lieu de 160');

console.log('\n=== Brisé : il fatigue, un tour sur deux, et tout ÷2 ===');
Familiers.posture(2,'libre'); Dons.casser(2); korrah.hp=1000;
JOURNAL.length=0;
for(let t=0;t<4;t++) tour(null);
const agi=JOURNAL.filter(l=>l.includes('agit de lui-même')).length;
const pause=JOURNAL.filter(l=>l.includes('se recompose')).length;
ok(pause>0 && agi<4, 'brisé, il saute des tours ('+agi+' actions, '+pause+' pauses sur 4 tours)');
korrah.hp=1000; Game_Action.prototype.executeHpDamage.call(coup, korrah, 200);
ok(1000-korrah.hp>=170, 'brisé, il n\'amortit plus que la moitié (perte '+(1000-korrah.hp)+'/200)');

console.log('\n=== Retiré du slot Âme : il n\'existe plus ===');
Dons.reparer(2); korrah._equips[6]=0; korrah.hp=1000;
JOURNAL.length=0;
tour(null);
ok(!Familiers.present(2), 'window.Avatars.present(2) → false');
ok(JOURNAL.length===0, 'aucune action, aucun message');
Game_Action.prototype.executeHpDamage.call(coup, korrah, 200);
ok(korrah.hp===800, 'plus aucune interception : elle prend les 200 en entier');

console.log(ko===0?'\n✅ TOUT PASSE\n':`\n❌ ${ko} échec(s)\n`);
process.exit(ko?1:0);
