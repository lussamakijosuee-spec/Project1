//=============================================================================
// TS_Endurance.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La Voie de la Source (Corps) : rester en Garde regenere lentement des PV (patience faite art).
 * @author JOKO
 */
(function(){'use strict';

var _og=Game_Battler.prototype.onTurnEnd;
Game_Battler.prototype.onTurnEnd=function(){ _og.call(this);
  if(this.isGuard&&this.isGuard&&this._actorId!==undefined){} };
var _act=Game_Battler.prototype.performActionEnd;
Game_Battler.prototype.performActionEnd=function(){ _act.call(this);
  if(this.isActor&&this.isActor()&&this.isGuard&&this.isGuard()){ var h=Math.round(this.mhp*0.05); this.gainHp(h); if(this.startDamagePopup)this.startDamagePopup(); } };

})();
