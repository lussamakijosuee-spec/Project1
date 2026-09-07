// Banc d'essai du gros lot : Voies, compétences de héros, butin, tableau de chasse.
const fs=require('fs'); const D=require('path').join(__dirname, '../../data/');
const L=f=>JSON.parse(fs.readFileSync(D+f,'utf8'));
const S=L('Skills.json'),C=L('Classes.json'),W=L('Weapons.json'),A=L('Armors.json'),
      I=L('Items.json'),E=L('Enemies.json'),T=L('Troops.json'),AN=L('Animations.json'),ST=L('States.json');
const meta=n=>{const re=/<([^<>:]+)(:?)([^>]*)>/g;const m={};let x;while((x=re.exec(n||'')))m[x[1].trim()]=x[2]===':'?x[3].trim():true;return m;};
let ko=0; const ok=(c,t)=>{console.log((c?'  ✔ ':'  ✘ ')+t); if(!c)ko++;};
global.$gameVariables={value:()=>5};global.$gameTroop={turnCount:()=>3,aliveMembers:()=>[{},{},{}]};
global.$gameActors={actor:()=>({atk:180,mat:180})};global.$gameParty={aliveMembers:()=>[{}]};
const NEW=S.filter(s=>s&&s.name&&s.id>=1066);

console.log(`\n═══ LES ${NEW.length} NOUVELLES COMPÉTENCES ═══`);
ok(NEW.length>=180,`au moins 180 créées (${NEW.length}) — dont les 3 ordres à l'Avatar (v3.0)`);
ok(new Set(NEW.map(s=>s.name)).size===NEW.length,'aucun doublon de nom');
let animKo=0,etatKo=0;
NEW.forEach(s=>{ if(s.animationId>0&&!AN[s.animationId])animKo++;
  s.effects.forEach(e=>{if((e.code===21||e.code===22)&&e.dataId>0&&(!ST[e.dataId]||!ST[e.dataId].name))etatKo++;});});
ok(animKo===0,`toutes les animations existent (${animKo} manquantes)`);
ok(etatKo===0,`tous les états référencés existent (${etatKo} manquants)`);

console.log('\n═══ LES 9 VOIES ═══');
const parVoie={};
S.forEach(s=>{if(!s||!s.name)return;const m=(s.note||'').match(/<Voie:\s*(\w+)>/);if(m)parVoie[m[1]]=(parVoie[m[1]]||0)+1;});
const V9=['forge','onde','source','miroir','vide','eclair','domaine','flash','sang'];
V9.forEach(v=>console.log(`      ${v.padEnd(9)} ${String(parVoie[v]||0).padStart(3)} techniques`));
ok(V9.every(v=>(parVoie[v]||0)>=8),'les 9 Voies ont au moins 8 techniques (avant : 3 en avaient ZÉRO)');

console.log('\n═══ FORMULES — aucune ne tombe à 0 ═══');
const B=o=>Object.assign({hp:3000,mhp:3000,mp:400,mmp:400,tp:50,atk:180,def:130,mat:180,mdf:130,agi:110,luk:80,level:35},o||{});
const cas=[['ordinaire',B(),B()],['blindé',B(),B({def:600,mdf:600})],['faible',B({atk:30,mat:30}),B()]];
let zero=0,err=0;
NEW.filter(s=>s.damage.type===1||s.damage.type===5).forEach(s=>{
  for(const[n,a,b]of cas){let v;try{v=eval(`(function(a,b){return ${s.damage.formula};})`)(a,b);}catch(e){err++;return;}
    if(!(v>0)){zero++;return;}}});
ok(err===0,`aucune formule en erreur (${err})`);
ok(zero===0,`aucune ne fait 0 dégât, même contre DÉF 600 ou lanceur faible (${zero})`);

console.log('\n═══ LES COMPÉTENCES SONT-ELLES ATTEIGNABLES ? ═══');
const app=new Set(); C.forEach(c=>{if(c&&c.name)c.learnings.forEach(l=>app.add(l.skillId));});
const orphelines=NEW.filter(s=>!app.has(s.id));
ok(orphelines.length===0,`les 180 sont apprises par une classe (${orphelines.length} orphelines)`);
const casse=[...app].filter(i=>!(S[i]&&S[i].name));
ok(casse.length===0,`aucun apprentissage cassé (${casse.length})`);
C.filter(c=>c&&c.name).forEach(c=>{
  const lv=c.learnings.map(l=>l.level);
  console.log(`      classe ${c.id} ${c.name.padEnd(14)} ${String(c.learnings.length).padStart(3)} compétences · niveaux ${Math.min(...lv)} → ${Math.max(...lv)}`);});
// La classe 5 « familié » est le personnage-Stand du joueur : hors lot, volontairement.
ok([1,2,3,4].every(i=>C[i]&&C[i].learnings.length>=79),'chacun des 4 héros a au moins 79 compétences');

console.log('\n═══ LE BUTIN DES 41 BOSS ═══');
const BOSS=E.filter(e=>e&&e.name&&meta(e.note).Boss);
let dropKo=0,sansArme=0;
BOSS.forEach(b=>{ let arme=false;
  b.dropItems.forEach(d=>{ if(d.kind===0)return;
    const tab={1:I,2:W,3:A}[d.kind];
    if(!tab||!tab[d.dataId]||!tab[d.dataId].name)dropKo++;
    if(d.kind===2)arme=true; });
  if(!arme)sansArme++; });
ok(dropKo===0,`tous les butins pointent sur du réel (${dropKo} cassés)`);
ok(sansArme===0,`les ${BOSS.length} boss lâchent une arme unique (${sansArme} sans)`);
const armesBoss=W.filter(w=>w&&w.name&&(w.note||'').includes('<ButinBoss:'));
const reliques=A.filter(a=>a&&a.name&&(a.note||'').includes('<ButinBoss:'));
ok(armesBoss.length===41,`41 armes de boss (${armesBoss.length})`);
ok(reliques.length>=20,`${reliques.length} reliques d'Âme`);

console.log('\n═══ LES MATÉRIAUX ═══');
const mats=I.filter(x=>x&&x.name&&(x.note||'').includes('<Materiau'));
ok(mats.length===24,`24 matériaux (${mats.length})`);
const familles=new Set(E.filter(e=>e&&e.name&&e.id>=428).map(e=>meta(e.note).Famille).filter(Boolean));
const matFam=new Set(mats.map(m=>(m.note.match(/<Materiau:\s*(.+?)>/)||[])[1]).filter(Boolean));
ok([...familles].every(f=>matFam.has(f)),`les ${familles.size} familles ont chacune leur matériau`);
const troupeSansMat=E.filter(e=>e&&e.name&&e.id>=428&&!meta(e.note).Boss&&
  !e.dropItems.some(d=>d.kind===1&&mats.some(m=>m.id===d.dataId)));
ok(troupeSansMat.length===0,`les 360 ennemis de troupe lâchent leur matériau (${troupeSansMat.length} sans)`);

console.log('\n═══ LE TABLEAU DE CHASSE peut-il lire le bestiaire ? ═══');
const fam={},boss=[];
T.forEach((t,i)=>{ if(!t||!t.name)return;
  const m=t.name.match(/^(.+?)\s+—\s+(.+?)\s+\(([DCBAS])\)$/);
  if(m){ (fam[m[1]]=fam[m[1]]||{})[m[3]]=(fam[m[1]][m[3]]||[]).concat([i]); return; }
  if(t.name.charAt(0)==='◈')boss.push(i); });
console.log(`      ${Object.keys(fam).length} familles lisibles · ${boss.length} contrats de boss`);
ok(Object.keys(fam).length===18,`les 18 familles sont reconnues par le motif du plugin`);
ok(boss.length===41,`les 41 contrats de boss sont reconnus`);
const totalContrats=Object.values(fam).reduce((s,r)=>s+Object.values(r).reduce((a,l)=>a+l.length,0),0);
console.log(`      ${totalContrats} contrats de chasse au total`);
ok(totalContrats>=250,`au moins 250 contrats atteignables (${totalContrats})`);
let membreKo=0;
T.forEach(t=>{if(!t||!t.name)return;t.members.forEach(m=>{if(!E[m.enemyId]||!E[m.enemyId].name)membreKo++;});});
ok(membreKo===0,`toutes les troupes pointent sur des ennemis réels (${membreKo})`);

console.log('\n═══ ÉQUILIBRE : payant > gratuit ═══');
const P={1:1,2:3,3:1,4:2,5:3,6:4,7:1,8:4,11:1,0:0};
function dmg(s){try{const v=eval(`(function(a,b){return ${s.damage.formula};})`)(B(),B());
  const r=Math.max(0,v)*(s.repeats||1)*(P[s.scope]||1);
  return Number.isFinite(r)?r:null;}catch(e){return null;}}   // les NaN cassaient le tri
const payantes=[...app].map(i=>S[i]).filter(s=>s&&s.name&&s.damage.type===1&&(s.mpCost||0)+(s.tpCost||0)>0)
  .map(dmg).filter(v=>v!==null).sort((a,b)=>a-b);
const gratuites=[...app].map(i=>S[i]).filter(s=>s&&s.name&&s.damage.type===1&&(s.mpCost||0)+(s.tpCost||0)===0)
  .map(dmg).filter(v=>v!==null);
const medP=payantes[Math.floor(payantes.length/2)], maxG=Math.max(...gratuites);
console.log(`      payante médiane : ${Math.round(medP)}   ·   meilleure gratuite : ${Math.round(maxG)}`);
ok(medP>maxG,'la compétence payante médiane dépasse enfin la meilleure attaque gratuite');

console.log(ko===0?'\n✅ TOUT PASSE\n':`\n❌ ${ko} échec(s)\n`);
process.exit(ko?1:0);
