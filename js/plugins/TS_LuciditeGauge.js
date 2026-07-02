//=============================================================================
// TS_LuciditeGauge.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Petit bandeau de Lucidite du meneur affiche en combat (bleu = clair, rouge = au bord du Fond).
 * @author JOKO
 */
(function(){'use strict';

var _cw=Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows=function(){ _cw.call(this);
  var s=new Sprite(new Bitmap(180,20)); s.x=8; s.y=8; this.addChild(s); this._tsLuc=s; };
var _upd=Scene_Battle.prototype.update;
Scene_Battle.prototype.update=function(){ _upd.call(this);
  if(!this._tsLuc||!window.TS)return; var a=$gameParty.leader(); if(!a){this._tsLuc.visible=false;return;} this._tsLuc.visible=true;
  var lu=TS.lucidite(a); var b=this._tsLuc.bitmap; b.clear();
  b.fillRect(0,6,160,8,'rgba(0,0,0,.5)'); var col=lu>60?'#5E92E6':lu>30?'#D8B254':'#E0726E';
  b.fillRect(1,7,Math.floor(158*lu/100),6,col); b.fontSize=12; b.textColor='#cfe0ff'; b.drawText('Lucidite '+lu,0,-4,160,16,'left'); };

})();
