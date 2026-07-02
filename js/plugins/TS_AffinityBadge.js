//=============================================================================
// TS_AffinityBadge.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Un petit badge (E/C/A/=) colore la source du heros dans les menus.
 * @author JOKO
 */
(function(){'use strict';

var LET={esprit:'E',corps:'C',ame:'A',or:'='};
var _dn = Window_Base.prototype.drawActorClass;
Window_Base.prototype.drawActorClass = function(actor,x,y,w){
  _dn.call(this,actor,x,y,w);
  if(!window.TS) return; var s=TS.sourceOf(actor); if(!s) return;
  this.changeTextColor(TS.COL[s]); this.drawText('['+LET[s]+']', x+(w||168)-28, y, 28, 'right'); this.resetTextColor();
};

})();
