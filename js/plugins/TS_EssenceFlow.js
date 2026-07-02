//=============================================================================
// TS_EssenceFlow.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les sorts de l'Ame (element 2) rendent un peu de PM au lanceur : l'essence circule.
 * @author JOKO
 */
(function(){'use strict';

var _exec=Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage=function(t,v){ _exec.call(this,t,v);
  var it=this.item&&this.item(), s=this.subject();
  if(v>0&&it&&it.damage&&it.damage.elementId===2&&s){ s.gainMp(Math.round((it.mpCost||0)*0.3)); } };

})();
