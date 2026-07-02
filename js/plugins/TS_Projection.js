//=============================================================================
// TS_Projection.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Competence notee <Projection:x> : projette du mana sombre → x% de degats aux AUTRES ennemis (onde de choc).
 * @author JOKO
 */
(function(){'use strict';

var _apply=Game_Action.prototype.apply;
Game_Action.prototype.apply=function(target){ _apply.call(this,target);
  var it=this.item&&this.item(); if(!(it&&it.meta&&it.meta.Projection))return; if(this._tsSplash)return; this._tsSplash=true;
  var pct=Math.max(0,parseInt(it.meta.Projection))/100; var v=target.result().hpDamage;
  if(v>0&&$gameTroop){ $gameTroop.aliveMembers().forEach(function(e){ if(e!==target){ e.gainHp(-Math.max(1,Math.round(v*pct))); e.startDamagePopup(); } }); }
};

})();
