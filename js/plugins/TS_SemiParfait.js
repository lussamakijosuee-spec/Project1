//=============================================================================
// TS_SemiParfait.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Equilibre : si les 3 Chutes du meneur restent basses, il entre dans l'etat Surpasse (id 188) en combat.
 * @author JOKO
 */
(function(){'use strict';

var _st=BattleManager.startTurn;
BattleManager.startTurn=function(){ $gameParty.battleMembers().forEach(function(a){
  if(!a.isActor||!a.isActor())return; var bete=window.Corruption?Corruption.niveau(a.actorId()):0;
  var err=window.Errance?Errance.niveau(a.actorId()):0; var dem=window.TS?100-TS.lucidite(a):100;
  var eq = bete<25&&err<25&&dem<40;
  if($dataStates[188]){ if(eq&&!a.isStateAffected(188)){ a.addState(188);
    var w=BattleManager._logWindow; if(w)w.push('addText','\C[17]★ '+a.name()+' tient l\'equilibre — Semi-Parfait.\C[0]'); }
    else if(!eq&&a.isStateAffected(188)) a.removeState(188); } });
  _st.call(this); };

})();
