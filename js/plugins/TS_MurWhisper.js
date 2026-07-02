//=============================================================================
// TS_MurWhisper.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Sur une carte notee <Mur> (ou region), des voix du dehors murmurent au hasard (horreur du Lac).
 * @author JOKO
 */
(function(){'use strict';

var VOIX=['…tu crois lire le monde…','…quelqu\'un te regarde…','…ce nom, tu ne l\'as dit a personne…','…reviens…'];
var _upd=Scene_Map.prototype.update;
Scene_Map.prototype.update=function(){ _upd.call(this);
  var m=$dataMap; if(!m||!m.meta||!m.meta.Mur)return;
  if(!this._tsW) this._tsW=0; this._tsW++;
  if(this._tsW%600===0 && Math.randomInt(100)<50 && !$gameMessage.isBusy()){
    $gameMessage.add('\\C[8]'+VOIX[Math.randomInt(VOIX.length)]+'\\C[0]'); } };

})();
