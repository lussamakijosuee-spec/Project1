//=============================================================================
// TS_CombatLearning.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le Corps progresse par le combat : vaincre au corps-a-corps peut « voler » une lecon (message + petit soin de TP).
 * @author JOKO
 */
(function(){'use strict';

var _die=Game_Enemy.prototype.die;
Game_Enemy.prototype.die=function(){ var la=BattleManager._action;
  if(la&&la.subject().isActor&&la.subject().isActor()&&la.isPhysical&&la.isPhysical()&&Math.randomInt(100)<20){
    var a=la.subject(); a.gainTp(15); var w=BattleManager._logWindow;
    if(w) w.push('addText','\C[6]'+a.name()+' vole une lecon du combat. (+TP)\C[0]'); }
  _die.call(this); };

})();
