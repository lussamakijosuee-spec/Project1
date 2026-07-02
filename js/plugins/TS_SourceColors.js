//=============================================================================
// TS_SourceColors.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le nom des heros/ennemis se colore selon leur source (Esprit bleu / Corps violet / Ame rose / equilibre or).
 * @author JOKO
 */
(function(){'use strict';

var _dn = Window_Base.prototype.drawActorName;
Window_Base.prototype.drawActorName = function(actor,x,y,w){
  var c = window.TS && TS.color(actor);
  if(c){ this.changeTextColor(c); this.drawText(actor.name(),x,y,w||168); this.resetTextColor(); return; }
  _dn.call(this,actor,x,y,w);
};

})();
