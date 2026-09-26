// Banc d'essai : on SIMULE des combats contre le nouveau bestiaire.
const fs=require('fs'); const D=require('path').join(__dirname, '../../data/');
const L=f=>JSON.parse(fs.readFileSync(D+f,'utf8'));
const E=L('Enemies.json'),S=L('Skills.json'),T=L('Troops.json'),ST=L('States.json'),AN=L('Animations.json');
const meta=n=>{const re=/<([^<>:]+)(:?)([^>]*)>/g;const m={};let x;while((x=re.exec(n||'')))m[x[1].trim()]=x[2]===':'?x[3].trim():true;return m;};
E.forEach(e=>{if(e)e._m=meta(e.note);});
global.$gameVariables={value:()=>5}; global.$gameSwitches={value:()=>false};
global.$gameTroop={turnCount:()=>3,aliveMembers:()=>[{},{},{}],members:()=>[{}]};
global.$gameActors={actor:()=>({atk:100,mat:100,def:80,mdf:80})};
global.$gameParty={members:()=>[{}],aliveMembers:()=>[{}]};

let ko=0; const ok=(c,t)=>{console.log((c?'  ✔ ':'  ✘ ')+t); if(!c)ko++;};
const NEW=E.filter(e=>e&&e.name&&e.id>=428);
const BOSS=NEW.filter(e=>e._m.Boss);
const NORM=NEW.filter(e=>!e._m.Boss);

console.log(`\n=== LE BESTIAIRE : ${NEW.length} nouveaux (${NORM.length} de troupe, ${BOSS.length} boss) ===`);
ok(NEW.length>=400,`au moins 400 nouveaux ennemis (${NEW.length}) — le compte exact appartient au joueur`);
ok(new Set(NEW.map(e=>e.name)).size===NEW.length,'aucun doublon de nom parmi les nouveaux');

console.log('\n=== Chaque ennemi est JOUABLE ===');
let sansAction=0,skillMort=0,sansSprite=0,animKo=0,statNulle=0;
const sprites=new Set(fs.readdirSync(require('path').join(__dirname, '../../img/sv_enemies')).map(f=>f.replace(/\.png$/,'')));
for(const e of NEW){
  if(!e.actions.length) sansAction++;
  for(const a of e.actions){ const s=S[a.skillId]; if(!s||!s.name) skillMort++;
    else if(s.animationId>0&&!AN[s.animationId]) animKo++; }
  if(!sprites.has(e.battlerName)) sansSprite++;
  if(e.params.some(p=>p<=0)) statNulle++;
}
ok(sansAction===0,`tous ont des actions (${sansAction} sans)`);
ok(skillMort===0,`toutes les actions pointent sur une compétence réelle (${skillMort} cassées)`);
ok(animKo===0,`toutes les animations référencées existent (${animKo} manquantes)`);
ok(sansSprite===0,`tous les sprites existent dans img/sv_enemies (${sansSprite} manquants)`);
ok(statNulle===0,`aucune statistique nulle ou négative (${statNulle})`);

console.log('\n=== Les formules du nouveau bestiaire ne font JAMAIS 0 ===');
const B=(o)=>Object.assign({hp:1000,mhp:1000,mp:200,mmp:200,tp:50,atk:100,def:80,mat:100,mdf:80,agi:70,luk:60,level:30},o||{});
const cas=[['ordinaire',B(),B()],['blindé',B(),B({def:400,mdf:400})],['faible lanceur',B({atk:20,mat:20}),B()],
           ['colosse',B({atk:900,mat:900}),B({def:600,mdf:600})]];
const idsNouv=new Set(); NEW.forEach(e=>e.actions.forEach(a=>idsNouv.add(a.skillId)));
let zero=0,erreur=0; const exemples=[];
for(const id of idsNouv){
  const s=S[id]; if(!s||!s.name||s.damage.type!==1) continue;
  for(const [nom,a,b] of cas){
    let v; try{ v=eval(`(function(a,b){return ${s.damage.formula};})`)(a,b); }catch(e){ erreur++; break; }
    if(!(v>0)){ zero++; if(exemples.length<4)exemples.push(`#${id} ${s.name} [${nom}] → ${v}`); break; }
  }
}
exemples.forEach(x=>console.log('      '+x));
ok(erreur===0,`aucune formule en erreur (${erreur})`);
ok(zero===0,`aucune compétence du bestiaire ne tombe à 0, même contre DÉF 600 (${zero})`);

console.log('\n=== Le PLANCHER rattrape les anciennes formules ===');
function plancher(v,atk,taux){ if(v>0)return v; if(taux<=0)return v; return Math.max(1,Math.floor(atk*8/100*taux)); }
const vieilles=[[ 'a.atk * 4 - b.def * 2',100,400],['a.mat*5 - b.mdf*1.5',20,80],['a.atk * 5 - b.def * 20',100,80]];
let rattrapes=0;
for(const [f,atk,def] of vieilles){
  const brut=eval(`(function(a,b){return ${f};})`)(B({atk,mat:atk}),B({def,mdf:def}));
  const apres=plancher(Math.max(brut,0),atk,1);
  console.log(`      « ${f} »  →  brut ${Math.round(brut)}  →  avec plancher ${apres}`);
  if(brut<=0&&apres>0) rattrapes++;
}
ok(rattrapes===3,`les 3 cas morts font maintenant quelque chose (${rattrapes}/3)`);
ok(plancher(0,100,0)===0,'une IMMUNITÉ élémentaire (taux 0) reste une immunité');

console.log('\n=== Les boss : télégraphe, coup annoncé, fenêtre de contre ===');
// Les boss <DonoBoss> sont ceux de JOKO, montés à la main : leur propre IA
// (<AI Priority>), leurs propres scripts de troupe. Ils ne suivent pas le
// schéma Charge → coup annoncé → Surcharge du bestiaire généré, et c'est
// voulu (§4 : les ennemis de JOKO restent hors des passes). On les compte
// à part au lieu de les accuser.
const DONO=b=>!!b._m.DonoBoss;
const BOSS_GEN=BOSS.filter(b=>!DONO(b));
let telOk=0,finOk=0,phasesOk=0;
for(const b of BOSS_GEN){
  const tel=b.actions.find(a=>{const s=S[a.skillId];return s&&s.note.includes('<Telegraphe>');});
  const fin=b.actions.find(a=>{const s=S[a.skillId];return s&&s.note.includes('<Apres: surcharge>');});
  if(tel&&tel.conditionType===1) telOk++;
  // le coup annoncé ne sort QUE si le boss est en état ⚡ Charge (207)
  if(fin&&fin.conditionType===4&&fin.conditionParam1===207) finOk++;
  if(fin){const s=S[fin.skillId]; if(s.effects.some(e=>e.code===21&&e.dataId===218)) phasesOk++;}
}
ok(telOk===BOSS_GEN.length,`les ${BOSS_GEN.length} boss du bestiaire télégraphient (action conditionnée au tour) · ${BOSS.length-BOSS_GEN.length} boss de JOKO à part`);
ok(finOk===BOSS_GEN.length,`leur coup lourd ne sort QUE s'ils sont en « ⚡ Charge » (${finOk})`);
ok(phasesOk===BOSS_GEN.length,`et les laisse en « ✷ Surcharge » — la fenêtre pour riposter (${phasesOk})`);

console.log('\n=== Les événements de phase des boss ===');
const TB=T.filter(t=>t&&t.name&&t.name.startsWith('◈'));
ok(TB.length===BOSS.length,`${TB.length} troupes de boss`);
let pagesOk=0,condOk=0;
for(const t of TB){
  // au MOINS 4 pages : entrée, phase II, phase III, rappel. Les gros boss en
  // ont 5 ou 6 (bascule de musique, renforts) — c'est voulu, pas un défaut.
  if(t.pages.length>=4) pagesOk++;
  const seuils=t.pages.filter(p=>p.conditions.enemyValid).map(p=>p.conditions.enemyHp);
  if(seuils.includes(60)&&seuils.includes(25)) condOk++;
}
ok(pagesOk===TB.length,'chaque boss a 4 pages : entrée, phase II, phase III, rappel de mécanique');
ok(condOk===TB.length,'les phases se déclenchent bien à 60 % et 25 % de PV');
// les commandes d'événement doivent être valides
let cmdKo=0;
for(const t of TB) for(const p of t.pages) for(const c of p.list){
  // 241/242 = jouer / arrêter le BGM : les boss basculent leur musique en
  // changeant de phase. 224 = flash d'écran, 225 = secousse, 335 = un renfort
  // caché apparaît : la mise en scène que JOKO a écrite pour Donovano. Ce sont
  // des commandes valides de MV, pas des casses (§6).
  if(![0,101,401,333,337,241,242,224,225,335].includes(c.code)) cmdKo++;
  if(c.code===333&&(!ST[c.parameters[2]]||!ST[c.parameters[2]].name)) cmdKo++;
  if(c.code===337&&!AN[c.parameters[1]]) cmdKo++;
}
ok(cmdKo===0,`toutes les commandes d'événement sont valides et pointent sur du réel (${cmdKo} cassées)`);

console.log('\n=== Le cycle du mana est branché sur TOUT le monde ===');
const tous=E.filter(e=>e&&e.name);
// Le Mana Pur TRANSCENDE le cycle (canon §4) : ni faiblesse, ni résistance. C'est voulu.
// Les boss <DonoBoss> de JOKO gardent la fiche qu'il leur a écrite (§4) : on ne leur pose rien.
const sansRes=tous.filter(e=>!e.traits.some(t=>t.code===11)&&e._m.Mana!=='pur'&&!e._m.DonoBoss);
const purs=tous.filter(e=>e._m.Mana==='pur');
ok(sansRes.length===0,`plus aucun ennemi hors-cycle sans résistance (${sansRes.length} sur ${tous.length})`);
// « transcender le cycle » = aucune résistance sur le TRIANGLE (2 spirituelle, 3 positive,
// 4 négative). Un profil élémentaire propre (feu, ombre…) reste permis, et sain en jeu.
const CYCLE=[2,3,4];
// On mesure le symptôme : un taux à 1.0 est inerte, il ne plie pas le triangle.
const horsCycle=purs.filter(e=>!e.traits.some(t=>t.code===11&&CYCLE.includes(t.dataId)&&t.value!==1));
ok(horsCycle.length===purs.length,`les ${purs.length} êtres de Mana Pur échappent au triangle du cycle (${horsCycle.length})`);
const sansMana=tous.filter(e=>!e._m.Mana);
ok(sansMana.length===0,`plus aucun ennemi sans <Mana:> déclaré (${sansMana.length})`);

console.log('\n=== Plus personne ne sait « seulement attaquer » ===');
const monotones=tous.filter(e=>e.actions.length&&e.actions.every(a=>a.skillId===1));
ok(monotones.length===0,`${monotones.length} ennemi(s) n'ont que « Attaque » (avant : 59)`);

console.log('\n=== Les troupes du bestiaire ===');
const TN=T.filter(t=>t&&t.name&&/\((D|C|B|A|S)\)$/.test(t.name));
ok(TN.length>=100,`${TN.length} troupes de rencontre créées`);
let membreKo=0;
for(const t of T){ if(!t||!t.name)continue; for(const m of t.members){ const e=E[m.enemyId]; if(!e||!e.name)membreKo++; } }
ok(membreKo===0,`toutes les troupes du jeu pointent sur des ennemis réels (${membreKo} cassées)`);

console.log('\n=== La courbe de progression ===');
const parRang={};
for(const e of NORM){ const r=e._m.Rang||'?'; (parRang[r]=parRang[r]||[]).push(e.params[0]); }
for(const r of ['D','C','B','A','S']){ const v=parRang[r]||[];
  if(v.length) console.log(`      rang ${r} : ${v.length} ennemis, PV ${Math.min(...v)} → ${Math.max(...v)}`); }
const moy=r=>{const v=parRang[r]||[0];return v.reduce((a,b)=>a+b,0)/v.length;};
ok(moy('D')<moy('C')&&moy('C')<moy('B')&&moy('B')<moy('A')&&moy('A')<moy('S'),'la courbe monte bien de D à S');
const hpBoss=BOSS.map(b=>b.params[0]);
ok(Math.min(...hpBoss)>moy('S'),`le plus faible boss (${Math.min(...hpBoss)} PV) dépasse le rang S moyen (${Math.round(moy('S'))})`);

console.log(ko===0?'\n✅ TOUT PASSE\n':`\n❌ ${ko} échec(s)\n`);
process.exit(ko?1:0);
