//=============================================================================
// TS_Consommation.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Competence notee <Consume> : devorer l'ame → soigne le lanceur, mais monte l'Errance (interdit).
 * @author JOKO
 */
(function(){'use strict';

var _exec=Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage=function(t,v){ _exec.call(this,t,v);
  var it=this.item&&this.item(), s=this.subject();
  if(v>0&&it&&it.meta&&it.meta.Consume&&s){ var h=Math.round(v*0.4); s.gainHp(h); s.startDamagePopup&&s.startDamagePopup();
    if(s.isActor&&s.isActor()&&window.Errance) Errance.add(s.actorId(),3);
    var w=BattleManager._logWindow; if(w)w.push('addText','\C[8]'+s.name()+' devore l\'essence… l\'Errance monte.\C[0]'); } };

})();
