//=============================================================================
// TS_AmeAbsorb.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Achever un ennemi avec un sort de l'Ame (element 2) rend un peu de PV a toute l'equipe (essence recueillie).
 * @author JOKO
 */
(function(){'use strict';

var _die=Game_Enemy.prototype.die;
Game_Enemy.prototype.die=function(){ var la=BattleManager._action;
  if(la&&la.item&&la.item()&&la.item().damage&&la.item().damage.elementId===2){
    $gameParty.aliveMembers().forEach(function(a){ a.gainHp(Math.round(a.mhp*0.08)); });
    var w=BattleManager._logWindow; if(w)w.push('addText','\C[2]L\'essence recueillie ravive l\'equipe.\C[0]'); }
  _die.call(this); };

})();
