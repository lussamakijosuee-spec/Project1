//=============================================================================
// TS_MiroirCounter.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Voie du Miroir : en Garde, une chance de RENVOYER une part des degats a l'attaquant.
 * @author JOKO
 */
(function(){'use strict';

var _exec=Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage=function(t,v){ _exec.call(this,t,v);
  if(v>0&&t&&t.isGuard&&t.isGuard()&&this.subject()&&Math.randomInt(100)<40){ var s=this.subject();
    var back=Math.max(1,Math.round(v*0.3)); s.gainHp(-back); if(s.startDamagePopup)s.startDamagePopup();
    var w=BattleManager._logWindow; if(w) w.push('addText','\C[6]Renvoi ! '+back+' degats retournent a l\'envoyeur.\C[0]'); }
};

})();
