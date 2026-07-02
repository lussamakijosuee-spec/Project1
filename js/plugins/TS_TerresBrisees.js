//=============================================================================
// TS_TerresBrisees.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Carte notee <Brisees> : le reel est instable → micro-glitches (secousses/flashs) aleatoires.
 * @author JOKO
 */
(function(){'use strict';

var _upd=Scene_Map.prototype.update;
Scene_Map.prototype.update=function(){ _upd.call(this);
  if(!$dataMap||!$dataMap.meta||!$dataMap.meta.Brisees)return; if(Math.randomInt(360)===0){
    $gameScreen.startShake(3,6,8); if(Math.randomInt(3)===0)$gameScreen.startFlash([120,90,160,60],12); } };

})();
