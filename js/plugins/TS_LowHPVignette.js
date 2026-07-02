//=============================================================================
// TS_LowHPVignette.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Un halo rouge envahit l'ecran quand un heros est en danger (PV bas) en combat.
 * @author JOKO
 */
(function(){'use strict';

var _upd = Spriteset_Battle.prototype.update;
Spriteset_Battle.prototype.update = function(){ _upd.call(this);
  if(!this._tsVig){ var b=new Sprite(new Bitmap(Graphics.width,Graphics.height)); var g=b.bitmap._context;
    var grd=g.createRadialGradient(Graphics.width/2,Graphics.height/2,Graphics.height*0.35,Graphics.width/2,Graphics.height/2,Graphics.height*0.75);
    grd.addColorStop(0,'rgba(0,0,0,0)'); grd.addColorStop(1,'rgba(150,20,20,1)');
    g.fillStyle=grd; g.fillRect(0,0,Graphics.width,Graphics.height); b.bitmap._setDirty&&b.bitmap._setDirty();
    b.blendMode=1; b.opacity=0; this.addChild(b); this._tsVig=b; }
  var p=$gameParty.inBattle()?$gameParty.battleMembers():[]; var lo=0;
  p.forEach(function(a){ if(a.isAlive()&&a.hpRate()<0.3) lo=Math.max(lo,1-a.hpRate()/0.3); });
  this._tsVig.opacity += ((lo*150) - this._tsVig.opacity)*0.1;
};

})();
