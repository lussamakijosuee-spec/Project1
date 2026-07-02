//=============================================================================
// TS_AuraFloor.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Un cercle d'aura, couleur de la source, brille au sol sous chaque combattant.
 * @author JOKO
 */
(function(){'use strict';

function bmp(c){ var b=new Bitmap(140,140); var g=b._context;
  var gr=g.createRadialGradient(70,70,6,70,70,66); gr.addColorStop(0,c); gr.addColorStop(.6,c+'66'); gr.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=gr; g.beginPath(); g.arc(70,70,66,0,6.3); g.fill(); b._setDirty&&b._setDirty(); return b; }
var cache={};
function upd(sp){ var b=sp._battler; var c=b&&b.isAlive&&b.isAlive()&&window.TS?TS.color(b):null;
  if(!c){ if(sp._tsA) sp._tsA.visible=false; return; }
  if(!sp._tsA){ var s=new Sprite(); s.anchor.x=.5; s.anchor.y=.5; s.blendMode=1; sp.addChildAt(s,0); sp._tsA=s; }
  if(sp._tsA._c!==c){ cache[c]=cache[c]||bmp(c); sp._tsA.bitmap=cache[c]; sp._tsA._c=c; }
  sp._tsA.visible=true; sp._tsA.y=-16; sp._tsA.scale.y=.7;
  sp._tsA.opacity=70+30*Math.sin(Graphics.frameCount/18);
}
var _a=Sprite_Actor.prototype.update; Sprite_Actor.prototype.update=function(){_a.call(this); if(this._battler)upd(this);};
var _e=Sprite_Enemy.prototype.update; Sprite_Enemy.prototype.update=function(){_e.call(this); if(this._battler)upd(this);};

})();
