// node tools/verifier.js — le docteur du projet : vérifie tous les IDs croisés.
var fs=require('fs'); function L(f){return JSON.parse(fs.readFileSync('data/'+f+'.json'));}
var sk=L('Skills'),st=L('States'),en=L('Enemies'),tr=L('Troops'),cl=L('Classes'),an=L('Animations'),it=L('Items');
var err=0; function bad(m){console.log('✗',m);err++;}
[['Skills',sk],['States',st],['Enemies',en],['Troops',tr],['Classes',cl],['Items',it]].forEach(function(p){
  p[1].forEach(function(e,i){ if(e&&e.id!==undefined&&e.id!==i) bad(p[0]+' désaligné id '+e.id+' index '+i); });});
cl.forEach(function(c){ if(!c)return; c.learnings.forEach(function(l){ if(!sk[l.skillId]) bad('classe '+c.id+' apprend skill inexistant '+l.skillId); });});
sk.forEach(function(s){ if(!s)return;
  if(s.animationId>0&&!an[s.animationId]) bad('skill '+s.id+' anim inexistante '+s.animationId);
  (s.effects||[]).forEach(function(e){ if(e.code===21&&e.dataId>0&&!st[e.dataId]) bad('skill '+s.id+' pose état inexistant '+e.dataId); });});
it.forEach(function(s){ if(!s)return; (s.effects||[]).forEach(function(e){ if(e.code===21&&e.dataId>0&&!st[e.dataId]) bad('item '+s.id+' pose état inexistant '+e.dataId); });});
tr.forEach(function(t){ if(!t)return; (t.members||[]).forEach(function(m){ if(!en[m.enemyId]) bad('troupe '+t.id+' ennemi inexistant '+m.enemyId); });});
en.forEach(function(e){ if(!e)return; (e.actions||[]).forEach(function(a){ if(!sk[a.skillId]) bad('ennemi '+e.id+' skill inexistant '+a.skillId); });});
console.log(err?('— '+err+' problème(s)'):'✓ TOUT EST SAIN — aucun ID cassé.');
process.exit(err?1:0);
