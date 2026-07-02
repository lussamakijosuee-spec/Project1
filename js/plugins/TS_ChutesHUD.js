//=============================================================================
// TS_ChutesHUD.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ HUD des trois Chutes en combat : Bete (Corruption), Errance, Dement (lucidite inverse).
 * @author JOKO
 */
(function(){'use strict';

var _cw=Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows=function(){ _cw.call(this);
  var s=new Sprite(new Bitmap(150,64)); s.x=Graphics.width-160; s.y=8; this.addChild(s); this._tsCh=s; };
function bar(b,y,lab,val,col){ b.fillRect(46,y+2,100,8,'rgba(0,0,0,.5)'); b.fillRect(47,y+3,Math.floor(98*val/100),6,col);
  b.fontSize=11; b.textColor='#eee'; b.drawText(lab,0,y-3,44,14,'left'); }
var _upd=Scene_Battle.prototype.update;
Scene_Battle.prototype.update=function(){ _upd.call(this); if(!this._tsCh)return;
  var a=$gameParty.leader(); if(!a){this._tsCh.visible=false;return;} this._tsCh.visible=true;
  var b=this._tsCh.bitmap; b.clear();
  var bete=(window.Corruption?Corruption.niveau(a.actorId()):0)||0;
  var err=(window.Errance?Errance.niveau(a.actorId()):0)||0;
  var dem=window.TS?100-TS.lucidite(a):0;
  bar(b,4,'Bete',bete,'#9166E6'); bar(b,22,'Errant',err,'#E0726E'); bar(b,40,'Dement',dem,'#5E92E6'); };

})();
