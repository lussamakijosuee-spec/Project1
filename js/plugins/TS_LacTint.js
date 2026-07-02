//=============================================================================
// TS_LacTint.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Carte notee <Lac> : teinte froide et desaturee automatique (ambiance des profondeurs).
 * @author JOKO
 */
(function(){'use strict';

var _upd=Game_Map.prototype.setup;
Game_Map.prototype.setup=function(id){ _upd.call(this,id);
  if($dataMap&&$dataMap.meta&&$dataMap.meta.Lac&&$gameScreen) $gameScreen.startTint([-50,-30,10,60],1); };

})();
