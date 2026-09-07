// Banc d'essai du Tableau de Chasse — on REPRODUIT le crash avant de vérifier le correctif.
const fs=require('fs'); const P=require('path').join(__dirname, '../../');
const L=f=>JSON.parse(fs.readFileSync(P+'data/'+f,'utf8'));
const meta=n=>{const re=/<([^<>:]+)(:?)([^>]*)>/g;const m={};let x;while((x=re.exec(n||'')))m[x[1].trim()]=x[2]===':'?x[3].trim():true;return m;};
global.window=global;
global.$dataTroops=L('Troops.json'); global.$dataEnemies=L('Enemies.json');
$dataEnemies.forEach(e=>{if(e)e.meta=meta(e.note);});
global.$gameSystem={}; global.$gameSwitches={value:()=>true};
global.$gameParty={members:()=>[{},{},{},{}],isAllDead:()=>false,gainGold:()=>{}};
global.$gameMessage={add:()=>{}}; global.$gamePlayer={makeEncounterCount:()=>{}};
global.SoundManager={playBuzzer:()=>{}};
global.PluginManager={parameters:()=>({})};
global.Graphics={boxWidth:816,boxHeight:624};

// ── le moteur MV, avec le piège : select() appelé PENDANT l'initialisation ──
let selectPendantInit=0;
function Window_Base(){ this.initialize.apply(this,arguments); }
Window_Base.prototype.initialize=function(x,y,w,h){this.x=x;this.y=y;this.width=w;this.height=h;
  this.contents={clear:()=>{}};};
Window_Base.prototype.lineHeight=()=>36;
Window_Base.prototype.standardPadding=()=>18;
Window_Base.prototype.textColor=i=>i;
Window_Base.prototype.changeTextColor=function(){};
Window_Base.prototype.resetTextColor=function(){};
Window_Base.prototype.changePaintOpacity=function(){};
Window_Base.prototype.drawText=function(){};
Window_Base.prototype.contentsWidth=function(){return this.width-36;};
function Window_Selectable(){ this.initialize.apply(this,arguments); }
Window_Selectable.prototype=Object.create(Window_Base.prototype);
Window_Selectable.prototype.initialize=function(x,y,w,h){
  this._index=-1;
  Window_Base.prototype.initialize.call(this,x,y,w,h);
  // C'EST ICI QUE ÇA CASSAIT : MOG_Scrollbar / MOG_CursorBorder / YEP_X_BattleSysCTB
  // surchargent select(), qui est appelé pendant l'initialisation.
  selectPendantInit++;
  this.reselect();
};
Window_Selectable.prototype.maxItems=()=>0;
Window_Selectable.prototype.index=function(){return this._index;};
Window_Selectable.prototype.select=function(i){this._index=i;this.ensureCursorVisible();};
Window_Selectable.prototype.reselect=function(){this.select(this._index);};
Window_Selectable.prototype.ensureCursorVisible=function(){this.setTopRow(0);};
Window_Selectable.prototype.setTopRow=function(){this.maxTopRow();};
Window_Selectable.prototype.maxTopRow=function(){return Math.max(0,this.maxRows()-1);};
Window_Selectable.prototype.maxRows=function(){return Math.max(1,Math.ceil(this.maxItems()/1));};
Window_Selectable.prototype.refresh=function(){for(let i=0;i<this.maxItems();i++)this.drawItem(i);};
Window_Selectable.prototype.drawItem=function(){};
Window_Selectable.prototype.itemRectForText=function(){return{x:0,y:0,width:700,height:36};};
Window_Selectable.prototype.activate=function(){};
Window_Selectable.prototype.setHandler=function(){};
global.Window_Base=Window_Base; global.Window_Selectable=Window_Selectable;
global.Window_MenuCommand=function(){}; Window_MenuCommand.prototype={addOriginalCommands:function(){},addCommand:function(){}};
function Scene_MenuBase(){} Scene_MenuBase.prototype.create=function(){};
Scene_MenuBase.prototype.start=function(){}; Scene_MenuBase.prototype.initialize=function(){};
Scene_MenuBase.prototype.addWindow=function(){}; Scene_MenuBase.prototype.popScene=function(){};
global.Scene_MenuBase=Scene_MenuBase;
global.Scene_Menu=function(){}; Scene_Menu.prototype={createCommandWindow:function(){}};
global.Scene_Battle=function(){};
global.SceneManager={push:function(s){global._pushed=s;},pop:()=>{}};
global.BattleManager={setup:function(id){global._troop=id;},setEventCallback:()=>{},
  processVictory:()=>{},processDefeat:()=>{}};
global.Game_Interpreter={prototype:{pluginCommand:function(){}}};

eval(fs.readFileSync(P+'js/plugins/ChasseAuxPrimes.js','utf8'));

let ko=0; const ok=(c,t)=>{console.log((c?'  ✔ ':'  ✘ ')+t); if(!c)ko++;};
console.log('\n=== LE CRASH SIGNALÉ ===');
let scene;
try{ scene=new (window.Scene_Primes)(); scene.create();
     ok(true,'l\'écran s\'ouvre sans planter (select() appelé '+selectPendantInit+' fois pendant l\'initialisation)'); }
catch(e){ ok(false,'plante encore : '+e.message); }

console.log('\n=== LE CONTENU DU TABLEAU ===');
const fam=window.Primes.familles();
ok(fam.length===18,`18 familles listées (${fam.length})`);
ok(window.Primes.bossDispo().length===0,'aucun contrat de boss ouvert au départ');
let total=0; fam.forEach(f=>{const p=window.Primes.progression(f); total+=p.total;});
ok(total===270,`270 contrats au total (${total})`);

console.log('\n=== NAVIGATION : familles → rangs → formations ===');
try{
  scene._liste.dresser('familles',null,null);
  ok(scene._liste.maxItems()===18+41,`l'écran d'accueil montre 18 familles + 41 boss (${scene._liste.maxItems()})`);
  const f0=scene._liste._data[0].cle;
  scene._liste.dresser('rangs',f0,null);
  ok(scene._liste.maxItems()===5,`« ${f0} » a bien 5 rangs (${scene._liste.maxItems()})`);
  scene._liste.dresser('formations',f0,'D');
  ok(scene._liste.maxItems()===3,`rang D : 3 formations (${scene._liste.maxItems()})`);
}catch(e){ ok(false,'navigation cassée : '+e.message); }

console.log('\n=== CAS TORDUS (ce qui plantait avant) ===');
try{ scene._liste.dresser('rangs','Famille Qui N\'Existe Pas',null);
     ok(scene._liste.maxItems()===0,'une famille inconnue donne une liste vide, sans planter'); }
catch(e){ ok(false,'plante sur une famille inconnue : '+e.message); }
try{ scene._liste.dresser('formations','Famille Qui N\'Existe Pas','S');
     ok(scene._liste.maxItems()===0,'un rang inconnu donne une liste vide, sans planter'); }
catch(e){ ok(false,'plante sur un rang inconnu : '+e.message); }
try{ const w=Object.create(Object.getPrototypeOf(scene._liste)); w.initialize(0,0,100,100);
     ok(w.maxItems()===0,'une liste fraîchement créée répond 0 au lieu de planter'); }
catch(e){ ok(false,'plante à la création : '+e.message); }

console.log('\n=== LE COMBAT ===');
scene._liste.dresser('formations',fam[0],'D');
const entree=scene._liste._data[0].entree;
scene._niveau='formations'; scene._famille=fam[0]; scene._rang='D';
scene._liste.select(0);
try{ scene.onOk(); ok(global._troop===entree.id,`le combat démarre sur la bonne troupe (#${global._troop})`);
     ok(global._pushed===Scene_Battle,'et pousse bien l\'écran de combat'); }
catch(e){ ok(false,'le lancement plante : '+e.message); }
// équipe à terre
global.$gameParty.isAllDead=()=>true; global._troop=null;
try{ scene.onOk(); ok(global._troop===null,'équipe à terre : le combat ne démarre pas (buzzer)'); }
catch(e){ ok(false,'plante quand l\'équipe est à terre : '+e.message); }
global.$gameParty.isAllDead=()=>false;

console.log('\n=== LA PRIME ===');
global.$gameSystem={}; let or=0; global.$gameParty.gainGold=n=>{or+=n;};
scene._liste.dresser('formations',fam[0],'D'); scene._liste.select(0); scene.onOk();
BattleManager.processVictory();
ok(or===240,`première victoire en rang D : 80 × 3 = 240 or (${or})`);
scene.onOk(); BattleManager.processVictory();
ok(or===320,`même contrat une seconde fois : +80 seulement (${or})`);

console.log(ko===0?'\n✅ TOUT PASSE\n':`\n❌ ${ko} échec(s)\n`);
process.exit(ko?1:0);
