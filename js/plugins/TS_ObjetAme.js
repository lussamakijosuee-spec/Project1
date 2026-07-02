//=============================================================================
// TS_ObjetAme.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Competence notee <ObjetAme: pct> : tirer un objet d'ame → bouclier temporaire (pct% des PV max en PV supplementaires).
 * @author JOKO
 */
(function(){'use strict';

var _apply=Game_Action.prototype.applyItemUserEffect;
Game_Action.prototype.applyItemUserEffect=function(t){ _apply.call(this,t);
  var it=this.item&&this.item(); var s=this.subject();
  if(it&&it.meta&&it.meta.ObjetAme&&s){ var pct=Math.max(0,parseInt(it.meta.ObjetAme))/100;
    var g=Math.round(s.mhp*pct); s._tsShield=(s._tsShield||0)+g;
    var w=BattleManager._logWindow; if(w)w.push('addText','\C[2]'+s.name()+' materialise un objet d\'ame (+'+g+' PV bouclier).\C[0]'); } };
var _gh=Game_Battler.prototype.gainHp;
Game_Battler.prototype.gainHp=function(v){ if(v<0&&this._tsShield>0){ var abs=Math.min(this._tsShield,-v); this._tsShield-=abs; v+=abs; } _gh.call(this,v); };

})();
