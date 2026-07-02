//=============================================================================
// TS_Instant.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Competence notee <Souffle> : instantanee → gros bonus de vitesse d'action (la Maitrise ne s'incante pas).
 * @author JOKO
 */
(function(){'use strict';

var _spd=Game_Action.prototype.speed;
Game_Action.prototype.speed=function(){ var s=_spd.call(this); var it=this.item&&this.item();
  if(it&&it.meta&&it.meta.Souffle) s+=2000; return s; };

})();
