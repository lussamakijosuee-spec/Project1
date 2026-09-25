/*
 * BANC NAVIGATEUR — LA PRISE DU JOUEUR SUR LES MÉCANIQUES DE BOSS
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-09-25 : « les combats pas intéressants, je parle de certains
 * boss ».
 *
 * Diagnostic, en jouant Le Compteur sur quatorze tours : son compte faisait
 * 4-3-2-1-ZÉRO puis recommençait, SANS AUCUNE CONDITION. Le groupe le frappait
 * depuis le tour 14, ses PV tombaient de 100 % à 36 %, il changeait de phase —
 * le compte ne bougeait pas d'un chiffre.
 *
 *     co._compte--;
 *     if (co._compte <= 0) { ★ ZÉRO ; co._compte = total; }
 *
 * Une mécanique qui annonce sans jamais rien demander n'est pas une mécanique :
 * c'est un métronome. Le joueur la subit, il ne la joue pas. Et ce n'était pas
 * un manque d'idées — `MecaniquesDeBoss.js` en implémente DOUZE, toutes posées
 * sur un ennemi. Il manquait la prise.
 *
 * JOKO a tranché : « En le mettant à découvert. » Tout ce qui se compte ne
 * compte plus quand le boss est en ✷ Surcharge. Le briser gagne un tour, et ça
 * se branche sur le télégraphe qu'il avait déjà écrit — le joueur n'a rien de
 * neuf à apprendre.
 *
 * Ce banc vérifie les quatre choses qui font la différence :
 *   · le compte se FIGE pendant qu'il est à découvert ;
 *   · il REPART quand le boss se reprend ;
 *   · le joueur LIT que son coup a servi — une prise invisible ne vaut rien ;
 *   · ZÉRO frappe sur les PV MAX et peut donc tuer. « Oui, et durement. »
 *
 * Il n'est pas automatique : il lui faut Playwright et un serveur.
 *
 *   npx http-server -p 8899 -c-1 .        (dans un autre terminal, à la racine)
 *   node bancs/navigateur/la_prise_sur_les_boss.js
 */

var { chromium } = require('playwright');
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
  await page.evaluate(function(){ $gameParty.members().forEach(function(a){a.recoverAll();}); BattleManager.setup(552,false,false); SceneManager.push(Scene_Battle); });
  await page.waitForFunction(function(){return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging();},null,{timeout:60000});
  await page.waitForTimeout(3000);

  var r = await page.evaluate(function(){
    var b=$gameTroop.members()[0], SUR=218, log=[], dit=[];
    var w=SceneManager._scene._logWindow, vrai=w.push.bind(w);
    w.push=function(m,t){ if(m==='addText'&&t) dit.push(String(t).replace(/\\C\[\d+\]/g,'')); return vrai(m,t); };
    // on laisse courir 3 tours, puis on le met à découvert 3 tours, puis on relâche
    for (var t=0;t<10;t++){
      dit.length=0;
      if (t>=3 && t<=5){ if(!b.isStateAffected(SUR)) b.addState(SUR); } else { b.removeState(SUR); }
      $gameTroop.increaseTurn();
      try { BattleManager.startTurn(); } catch(e){}
      log.push({ tour:t+1, surcharge:b.isStateAffected(SUR), compte:b._compte, lu:dit.join(' | ') });
    }
    // et les dégâts de ZÉRO : sur les PV MAX maintenant
    var h=$gameParty.members()[0];
    h.setHp(h.mhp);
    var avant=h.hp;
    b._compte=1; b.removeState(SUR);
    $gameTroop.increaseTurn(); try{ BattleManager.startTurn(); }catch(e){}
    var apres=h.hp;
    return { log:log, zeroAvant:avant, zeroApres:apres, mhp:h.mhp };
  });

  console.log('=== LE COMPTE, MAINTENANT QU\'IL A UNE PRISE ===\n');
  r.log.forEach(function(l){
    console.log('   tour '+String(l.tour).padStart(2)+'  '+(l.surcharge?'✷ À DÉCOUVERT':'             ')+'  compte='+String(l.compte).padEnd(3)+'  '+l.lu.slice(0,78));
  });
  console.log();
  var pendant=r.log.filter(function(l){return l.surcharge;}).map(function(l){return l.compte;});
  var fige = pendant.length>1 && pendant.every(function(x){return x===pendant[0];});
  v('le compte se FIGE pendant qu\'il est à découvert', fige, 'pendant la Surcharge : '+pendant.join(' → '));
  v('et il repart quand il se reprend',
    r.log[6] && r.log[5] && r.log[6].compte < r.log[5].compte, 'tour 6 compte='+(r.log[5]||{}).compte+' → tour 7 compte='+(r.log[6]||{}).compte);
  v('le joueur LIT que son coup a servi', r.log.some(function(l){return /le compte s.arr/i.test(l.lu);}), 'ligne de journal présente');
  var perte=r.zeroAvant-r.zeroApres;
  v('ZÉRO peut désormais tuer — il frappe sur les PV MAX',
    perte >= Math.floor(r.mhp*0.40), perte+' PV perdus sur '+r.mhp+' ('+Math.round(perte/r.mhp*100)+' % des PV MAX) — deux Zéro d\'affilée tuent');
  console.log();
  v('aucune erreur JavaScript', err.length===0, err.slice(0,2).join(' | ')||'rien');
  console.log('\n'+'='.repeat(70));
  console.log('  '+ok+' contrôles passés · '+ko+' échec(s)');
  console.log('='.repeat(70));
  await nav.close();
  process.exit(ko?1:0);
})();
