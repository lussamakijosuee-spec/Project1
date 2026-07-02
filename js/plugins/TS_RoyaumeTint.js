//=============================================================================
// TS_RoyaumeTint.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Carte notee <Royaume: or|vultric|mages|est> : ambiance coloree du royaume (or, rouge, glace, foret).
 * @author JOKO
 */
(function(){'use strict';

var T={or:[30,20,-20,0],vultric:[40,-20,-30,0],mages:[-30,-10,30,20],est:[-20,20,-20,10]};
var _s=Game_Map.prototype.setup;
Game_Map.prototype.setup=function(id){ _s.call(this,id);
  if($dataMap&&$dataMap.meta&&$dataMap.meta.Royaume&&$gameScreen){ var t=T[String($dataMap.meta.Royaume).toLowerCase().trim()];
    if(t)$gameScreen.startTint(t,1); } };

})();
