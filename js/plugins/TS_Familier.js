//=============================================================================
// TS_Familier.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Competence notee <Familier> : materialise un familier d'ame → coup de suite gratuit sur la cible.
 * @author JOKO
 */
(function(){'use strict';

var _apply=Game_Action.prototype.apply;
Game_Action.prototype.apply=function(t){ _apply.call(this,t);
  var it=this.item&&this.item(); if(!(it&&it.meta&&it.meta.Familier&&t&&t.isAlive&&t.isAlive()))return; if(this._tsFam)return; this._tsFam=true;
  var extra=Math.max(1,Math.round((t.result().hpDamage||0)*0.5));
  if(extra>0){ t.gainHp(-extra); t.startDamagePopup&&t.startDamagePopup();
    var w=BattleManager._logWindow; if(w)w.push('addText','\C[2]Le familier frappe encore ('+extra+').\C[0]'); } };

})();
