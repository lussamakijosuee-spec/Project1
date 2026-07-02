//=============================================================================
// TS_Reprise.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La mort n'est pas toujours definitive : au Game Over, un message de Reprise (la sauvegarde, cote lore).
 * @author JOKO
 */
(function(){'use strict';

var _go=Scene_Gameover.prototype.create;
Scene_Gameover.prototype.create=function(){ _go.call(this);
  var w=new Window_Base(0,Graphics.boxHeight-80,Graphics.boxWidth,72);
  w.opacity=0; w.drawText('« Le monde revient en arriere. Nul ne s\'en souviendra… sauf toi. »',0,0,w.contentsWidth(),'center');
  this.addWindow(w); };

})();
