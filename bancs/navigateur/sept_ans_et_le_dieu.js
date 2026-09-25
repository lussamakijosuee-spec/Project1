/*
 * BANC NAVIGATEUR — SEPT ANS ET LE DIEU SANS VISAGE
 * ---------------------------------------------------------------------------
 * Les deux seuls boss atteignables qui n'avaient AUCUNE mécanique propre.
 * JOKO : « Écris-leur la leur. » Et, pour le second : « le dieu sans visage,
 * un des boss finale ».
 *
 * Rien n'a été inventé : les deux combats étaient déjà dans les noms que JOKO
 * avait écrits.
 *
 *   SEPT ANS, ce qui sort d'un miroir brisé
 *     « Surface Lisse » · « Bris Total » · « Les Éclats se Lèvent » · « Renvoi »
 *     → tant que sa surface est lisse, il RENVOIE une part de ce qu'il encaisse.
 *       Un grand coup la BRISE au lieu de revenir : plus de renvoi pendant
 *       quelques tours, mais les éclats se lèvent. Puis il se relisse.
 *       La décision : le cogner doucement et saigner, ou le briser d'un coup.
 *
 *   LE DIEU SANS VISAGE
 *     « Elle Lève les Yeux » — « Elle cherche une étoile qui n'est plus là. »
 *     → il PREND le visage d'un héros, celui qui frappe le plus fort. Ce héros
 *       perd toutes ses branches : il ne lui reste que l'Attaque, la Garde et
 *       les objets. Le dieu, lui, frappe 40 % plus fort tant qu'il le porte.
 *       On le récupère en le mettant à découvert — la même prise que pour les
 *       comptes, donc rien de neuf à apprendre.
 *
 * Il n'est pas automatique : il lui faut Playwright et un serveur.
 *
 *   npx http-server -p 8899 -c-1 .        (dans un autre terminal, à la racine)
 *   node bancs/navigateur/sept_ans_et_le_dieu.js
 */

var { chromium } = require('playwright');
var SHOTS = process.env.ETT_CAPTURES || '/tmp/db/';
require('fs').mkdirSync(SHOTS,{recursive:true});
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
(async function(){
  var nav = await chromium.launch({ args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox','--mute-audio'] });
  var page = await nav.newPage({ viewport:{width:816,height:624} });
  var err=[]; page.on('pageerror',function(e){err.push(e.message.split('\n')[0]);});
  var ok=0,ko=0; var v=function(t,c,d){ if(c){ok++;console.log('   OK  '+t+(d?'  — '+d:''));}else{ko++;console.log('   KO  '+t+(d?'  — '+d:''));} };
  await page.goto(BASE+'/index.html',{waitUntil:'load'});
  await page.waitForFunction(function(){var s=SceneManager._scene;return s&&s._commandWindow&&s._commandWindow.active&&s._commandWindow.isOpen();},null,{timeout:180000});
  await page.evaluate(function(){DataManager.setupNewGame();SceneManager.goto(Scene_Map);});
  await page.waitForFunction(function(){return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging();},null,{timeout:60000});
  await page.waitForTimeout(1200);

  var combat = async function(troupe){
    await page.evaluate(function(t){
      if (SceneManager._scene instanceof Scene_Battle) { SceneManager.pop(); }
      $gameParty.members().forEach(function(a){a.recoverAll();a.setTp(100);});
      BattleManager.setup(t,false,false); SceneManager.push(Scene_Battle);
    }, troupe);
    await page.waitForFunction(function(){return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging();},null,{timeout:60000});
    await page.waitForTimeout(2600);
  };

  // ══════════ SEPT ANS · le miroir
  console.log('=== SEPT ANS — le miroir ===\n');
  await combat(538);
  var m = await page.evaluate(function(){
    var b=$gameTroop.members()[0], h=$gameParty.members()[0], dit=[];
    var w=SceneManager._scene._logWindow, vrai=w.push.bind(w);
    w.push=function(x,t){ if(x==='addText'&&t) dit.push(String(t).replace(/\\C\[\d+\]/g,'')); return vrai(x,t); };
    var out={ nom:b.name().trim(), meca:/MecaMiroir/.test(b.enemy().note), etapes:[] };
    var frapper=function(part,libelle){
      dit.length=0;
      h.setHp(h.mhp);
      var act=new Game_Action(h); act.setSkill(1); act.setTarget(0);
      var pvH=h.hp, pvB=b.hp;
      var degats=Math.floor(b.mhp*part);
      Game_Action.prototype.executeHpDamage.call(act, b, degats);
      out.etapes.push({ libelle:libelle, inflige:degats, renvoye:pvH-h.hp, brise:b._miroirBrise||0, lu:dit.join(' | ') });
    };
    frapper(0.03,'petit coup (3 % de ses PV)');
    frapper(0.03,'petit coup (3 %)');
    frapper(0.15,'GRAND coup (15 % — au-dessus du seuil de 12 %)');
    frapper(0.03,'petit coup, surface brisée');
    // on laisse passer les tours : elle doit se relisser
    for (var t=0;t<4;t++){ dit.length=0; $gameTroop.increaseTurn(); try{BattleManager.startTurn();}catch(e){}
      out.etapes.push({ libelle:'— un tour passe —', inflige:0, renvoye:0, brise:b._miroirBrise||0, lu:dit.join(' | ') }); }
    frapper(0.03,'petit coup, surface relissée');
    return out;
  });
  v('Sept Ans porte bien <MecaMiroir>', m.meca, m.nom);
  m.etapes.forEach(function(e){
    console.log('      '+e.libelle.padEnd(46)+(e.inflige?('inflige '+String(e.inflige).padStart(6)):'            ')+
      '  renvoyé '+String(e.renvoye).padStart(5)+'  brisé='+e.brise);
    if(e.lu) console.log('          '+e.lu.slice(0,96));
  });
  var petit1=m.etapes[0], grand=m.etapes[2], apres=m.etapes[3], relisse=m.etapes[m.etapes.length-1];
  v('un petit coup lui REVIENT', petit1.renvoye>0, petit1.renvoye+' PV renvoyés sur '+petit1.inflige+' infligés (~35 %)');
  v('un grand coup le BRISE au lieu de revenir', grand.renvoye===0 && grand.brise>0, 'brisé pour '+grand.brise+' tours');
  v('brisé, plus rien ne revient', apres.renvoye===0, 'renvoyé '+apres.renvoye);
  v('il se relisse, et le renvoi reprend', relisse.renvoye>0, relisse.renvoye+' PV renvoyés à nouveau');

  // ══════════ LE DIEU SANS VISAGE
  console.log('\n=== LE DIEU SANS VISAGE — il prend un visage ===\n');
  await combat(539);
  var d = await page.evaluate(function(){
    var b=$gameTroop.members()[0], dit=[];
    var w=SceneManager._scene._logWindow, vrai=w.push.bind(w);
    w.push=function(x,t){ if(x==='addText'&&t) dit.push(String(t).replace(/\\C\[\d+\]/g,'')); return vrai(x,t); };
    var out={ nom:b.name().trim(), meca:/MecaSansVisage/.test(b.enemy().note), etapes:[] };
    var etape=function(l){
      var v=b._visageDe;
      out.etapes.push({ l:l, porte:v?v.name():null,
        scelle: v? [1,2,3].every(function(t){return v.isSkillTypeSealed(t);}) : null,
        peutJouer: v? v.skills().filter(function(s){return v.canUse(s);}).length : null,
        lu:dit.join(' | ') }); dit.length=0; };
    etape('au départ');
    b.addState(207);  // ⚡ Charge
    $gameTroop.increaseTurn(); try{BattleManager.startTurn();}catch(e){}
    etape('il charge → il prend un visage');
    var cible=b._visageDe;
    b.removeState(207); b.addState(218);  // ✷ Surcharge : on le met à découvert
    $gameTroop.increaseTurn(); try{BattleManager.startTurn();}catch(e){}
    etape('on le met à découvert → il rend');
    out.rendu = cible ? !cible.isStateAffected(230) : null;
    out.cible = cible ? cible.name() : null;
    return out;
  });
  v('le dieu porte bien <MecaSansVisage>', d.meca, d.nom);
  d.etapes.forEach(function(e){
    console.log('      '+e.l.padEnd(40)+' porte « '+String(e.porte||'personne').padEnd(9)+' »'+
      (e.scelle!==null?('  branches scellées='+e.scelle+'  jouables='+e.peutJouer):''));
    if(e.lu) console.log('          '+e.lu.slice(0,96));
  });
  v('il prend le visage de quelqu\'un quand il charge', d.etapes[1].porte!==null, 'il prend « '+d.etapes[1].porte+' »');
  v('ce héros ne peut plus rien faire de ce qu\'il savait', d.etapes[1].scelle===true,
     'ses trois branches sont scellées · '+d.etapes[1].peutJouer+' compétence(s) encore jouable(s)');
  v('mis à découvert, il RÉTABLIT le visage', d.rendu===true, d.cible+' l\'a retrouvé');
  await page.screenshot({path:SHOTS+'dieu.png'});

  console.log();
  v('aucune erreur JavaScript', err.length===0, err.slice(0,2).join(' | ')||'rien');
  console.log('\n'+'='.repeat(72));
  console.log('  '+ok+' contrôles passés · '+ko+' échec(s)');
  console.log('='.repeat(72));
  await nav.close();
  process.exit(ko?1:0);
})();
