// Banc d'essai : ObjetSpirituel.js — l'évolution des DEUX chaînes, dans les bons slots.
const fs = require('fs'); const P = require('path').join(__dirname, '../');
function meta(n){const re=/<([^<>:]+)(:?)([^>]*)>/g;const m={};let x;while((x=re.exec(n||'')))m[x[1]]=x[2]===':'?x[3]:true;return m;}
const load=f=>JSON.parse(fs.readFileSync(P+'data/'+f,'utf8'));
const W=load('Weapons.json'),A=load('Armors.json'),AC=load('Actors.json');
[W,A].forEach(l=>l.forEach(o=>{if(o)o.meta=meta(o.note);}));
global.window=global;
global.PluginManager={parameters:()=>({})};
global.$dataWeapons=W; global.$dataArmors=A;
const SLOTS=[1,2,3,4,5,6,7];
const sac={};                                   // inventaire : clé "W12"/"A68" → nombre
const key=it=>(it.wtypeId?'W':'A')+it.id;

function Actor(id){const s=AC.find(a=>a&&a.id===id);this.id=id;this.level=1;this._equips=s.equips.slice();}
Actor.prototype.actorId=function(){return this.id;};
Actor.prototype.name=function(){return AC.find(a=>a&&a.id===this.id).name;};
Actor.prototype.equipSlots=()=>SLOTS;
Actor.prototype.equips=function(){return this._equips.map((v,i)=>!v?null:(SLOTS[i]===1?W[v]:A[v]));};
Actor.prototype.changeEquip=function(slot,item){
  const anc=this._equips[slot];
  if(anc){const d=SLOTS[slot]===1?W[anc]:A[anc]; sac[key(d)]=(sac[key(d)]||0)+1;}
  this._equips[slot]=item?item.id:0;
  if(item){sac[key(item)]=(sac[key(item)]||0)-1;}
};
const ACTORS={};[1,2,3,4].forEach(i=>ACTORS[i]=new Actor(i));
// Comme MV : actor() construit à la demande, _data contient les acteurs déjà créés.
// DonsSpirituels lit _data pour ne JAMAIS déclencher de construction (récursion).
global.$gameActors={_data:ACTORS, actor:i=>ACTORS[i]};
global.$gameParty={members:()=>Object.values(ACTORS),
  gainItem:(it,n)=>{sac[key(it)]=(sac[key(it)]||0)+n;},
  loseItem:(it,n)=>{sac[key(it)]=(sac[key(it)]||0)-n;},
  numItems:it=>sac[key(it)]||0};
global.$gameMap={isEventRunning:()=>true}; global.$gameMessage={isBusy:()=>true,add:()=>{}};
global.AudioManager={playSe:()=>{}};
const noop=function(){};
global.Game_Actor={prototype:{levelUp:noop,paramPlus:()=>0}};
global.Scene_Map={prototype:{onMapLoaded:noop,update:noop}};
global.Game_Interpreter={prototype:{pluginCommand:noop}};
eval(fs.readFileSync(P+'js/plugins/ObjetSpirituel.js','utf8'));

let ko=0; const ok=(c,t)=>{console.log((c?'  ✔ ':'  ✘ ')+t); if(!c)ko++;};
const ET={1:'Arme',5:'Accessoire',7:'Âme'};
function etat(a){
  return a.equips().map((it,i)=>it?`${ET[SLOTS[i]]||SLOTS[i]}=${it.name}`:null).filter(Boolean).join(' | ');
}
console.log('\n=== Départ (niveau 1) ===');
[1,2,3,4].forEach(i=>console.log('  '+ACTORS[i].name().padEnd(8)+' '+etat(ACTORS[i])));

console.log('\n=== Montée aux paliers 2 (niv.15), 3 (niv.35), 4 (niv.60) ===');
[[15,'Naissant/Forme'],[35,'Résonance'],[60,'Vérité']].forEach(([lv,nom])=>{
  console.log('  — niveau '+lv+' ('+nom+') —');
  [1,2,3,4].forEach(i=>{ACTORS[i].level=lv;Game_Actor.prototype.levelUp.call(ACTORS[i]);});
  [1,2,3,4].forEach(i=>console.log('    '+ACTORS[i].name().padEnd(8)+' '+etat(ACTORS[i])));
});

console.log('\n=== Vérifications ===');
// v3.0 — UN SEUL Don par personne : le Don monte de palier, l'arme de main NON.
// L'arme ordinaire équipée au départ doit être encore là, inchangée, au niveau 60.
ok(ACTORS[1]._equips[4]===71, 'Vesper : Masque p4 à l\'Accessoire (son seul Don)');
ok(ACTORS[1]._equips[0]===160, 'Vesper : son arme est restée la Lame Écarlate de Fer — l\'acier ne monte pas tout seul');
ok(ACTORS[2]._equips[6]===79, 'Korrah : Armure Volante p4 à l\'Âme (son seul Don)');
ok(ACTORS[2]._equips[0]===139, 'Korrah : son arme est restée le Gantelet de Fer — l\'acier ne monte pas tout seul');
ok(ACTORS[3]._equips[4]===75, 'ludwing : Amulette p4 à l\'Accessoire (son seul Don)');
ok(ACTORS[3]._equips[0]===2,  'ludwing : sa hache est restée la Hache Valo — l\'acier ne monte pas tout seul');
ok(ACTORS[4]._equips[0]===516, 'Aël : l\'Arc p4 à l\'Arme (son Don EST son arme)');
ok(ACTORS[4]._equips[6]===0, 'Aël : slot Âme resté LIBRE — l\'avantage des 80 %');
const restes=Object.entries(sac).filter(([k,n])=>n>0);
ok(restes.length===0, 'aucun palier inférieur ne traîne dans le sac ('+(restes.map(([k,n])=>k+'×'+n).join(', ')||'sac vide')+')');

console.log('\n=== OBJET rendre : on perd son Don, le plugin le restitue ===');
ACTORS[3]._equips[4]=0; sac['A75']=0;
Game_Interpreter.prototype.pluginCommand.call({},'OBJET',['rendre']);
ok(ACTORS[3]._equips[4]===75, 'ludwing retrouve « Vérité de l\'Amulette » à l\'Accessoire');

console.log(ko===0?'\n✅ TOUT PASSE\n':`\n❌ ${ko} échec(s)\n`);
process.exit(ko?1:0);
