//=============================================================================
// TS_Concentration.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Se mettre en Garde charge la Concentration → la prochaine Parole (magie) frappe +50%.
 * @author JOKO
 */
(function(){'use strict';

var _end=Game_Battler.prototype.performActionEnd;
Game_Battler.prototype.performActionEnd=function(){ _end.call(this);
  if(this.isActor&&this.isActor()){ if(this.isGuard&&this.isGuard()) this._tsConc=true; } };
var _mdv=Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue=function(t,c){ var v=_mdv.call(this,t,c); var s=this.subject();
  if(v>0&&s&&s._tsConc&&this.isMagical&&this.isMagical()){ v=Math.round(v*1.5); s._tsConc=false; } return v; };

})();
