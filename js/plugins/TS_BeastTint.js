//=============================================================================
// TS_BeastTint.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Plus la Corruption (la Bete) d'un heros est haute, plus son sprite se teinte de penombre.
 * @author JOKO
 */
(function(){'use strict';

var _upd=Sprite_Actor.prototype.update;
Sprite_Actor.prototype.update=function(){ _upd.call(this); var b=this._battler;
  if(b&&b.isActor&&b.isActor()&&window.Corruption){ var lv=Corruption.niveau(b.actorId())||0; var t=lv/100;
    if(this.setBlendColor) this.setBlendColor([60*t,0,60*t, Math.round(90*t)]); } };

})();
