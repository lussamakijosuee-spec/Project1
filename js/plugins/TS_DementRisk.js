//=============================================================================
// TS_DementRisk.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Lucidite tres basse : au debut du combat, risque de Confusion (l'esprit vacille au bord du Fond).
 * @author JOKO
 */
(function(){'use strict';

var _sb=BattleManager.startBattle;
BattleManager.startBattle=function(){ _sb.call(this); if(!window.TS)return;
  $gameParty.battleMembers().forEach(function(a){ if(TS.lucidite(a)<=20 && Math.randomInt(100)<30){
    if($dataStates[4]) a.addState(4); var w=BattleManager._logWindow;
    if(w)w.push('addText','\C[1]L\'esprit de '+a.name()+' vacille — le Fond l\'appelle.\C[0]'); } }); };

})();
