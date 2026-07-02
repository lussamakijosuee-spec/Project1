//=============================================================================
// TS_BloodDNA.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La couleur du sang (flash de degats) trahit l'ADN d'ame : Esprit bleu, Corps violet, Ame rose.
 * @author JOKO
 */
(function(){'use strict';

var _sd = Sprite_Battler.prototype.setupDamagePopup;
Sprite_Battler.prototype.setupDamagePopup = function(){ _sd.call(this);
  var b=this._battler; if(b&&b.result&&b.result().hpAffected&&b.result().hpDamage>0&&window.TS){
    var s=TS.sourceOf(b); if(s){ var m={esprit:[80,140,230],corps:[145,102,230],ame:[224,114,110],or:[216,178,84]}[s];
      if(m&&$gameScreen) $gameScreen.startFlash([m[0],m[1],m[2],60],12); } }
};

})();
