//=============================================================================
// TS_FluxMomentum.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Enchainer les attaques physiques monte le FLUX (+degats) ; lancer une magie le remet a zero.
 * @author JOKO
 */
(function(){'use strict';

var _exec=Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage=function(t,v){ var s=this.subject();
  if(s){ if(this.isPhysical&&this.isPhysical()){ s._tsFlux=Math.min(5,(s._tsFlux||0)+1); }
         else if(this.isMagical&&this.isMagical()){ s._tsFlux=0; } }
  _exec.call(this,t,v); };
var _mdv=Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue=function(t,c){ var v=_mdv.call(this,t,c); var s=this.subject();
  if(v>0&&this.isPhysical&&this.isPhysical()&&s&&s._tsFlux) v=Math.round(v*(1+0.06*s._tsFlux)); return v; };

})();
