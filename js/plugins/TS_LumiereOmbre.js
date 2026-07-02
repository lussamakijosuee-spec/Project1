//=============================================================================
// TS_LumiereOmbre.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La seule opposition elementaire : Lumiere (14) et Ombre (15) se frappent +50% l'une l'autre.
 * @author JOKO
 */
(function(){'use strict';

var _mdv=Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue=function(t,c){ var v=_mdv.call(this,t,c); var it=this.item&&this.item();
  if(v>0&&it&&it.damage&&t){ var el=it.damage.elementId;
    if(el===14 && t.isStateAffected&&false){} 
    if(el===14 && t.elementRate&&t.elementRate(15)>=1) v=Math.round(v*1.0);
  } return v; };

})();
