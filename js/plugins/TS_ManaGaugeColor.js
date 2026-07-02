//=============================================================================
// TS_ManaGaugeColor.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La jauge de PM prend la couleur de la source du heros.
 * @author JOKO
 */
(function(){'use strict';

var _c1 = Window_Base.prototype.mpGaugeColor1, _c2 = Window_Base.prototype.mpGaugeColor2;
Window_Base.prototype.mpGaugeColor1 = function(){ var a=this._TSactor; var c=a&&window.TS&&TS.color(a); return c||_c1.call(this); };
var _draw = Window_Base.prototype.drawActorMp;
Window_Base.prototype.drawActorMp = function(actor,x,y,w){ this._TSactor=actor; _draw.call(this,actor,x,y,w); this._TSactor=null; };

})();
