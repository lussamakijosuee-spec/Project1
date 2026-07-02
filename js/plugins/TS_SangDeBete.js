//=============================================================================
// TS_SangDeBete.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Chaque usage du Corps (mana negatif/sombre) reveille le sang de bete : messages a paliers.
 * @author JOKO
 */
(function(){'use strict';

var _exec=Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage=function(t,v){ _exec.call(this,t,v);
  var s=this.subject(), it=this.item&&this.item(); if(!(s&&s.isActor&&s.isActor()&&it&&it.damage))return;
  var el=it.damage.elementId; if(v>0&&(el===4||el===5)){ s._tsBete=(s._tsBete||0)+1;
    var w=BattleManager._logWindow; if(!w)return;
    if(s._tsBete===8) w.push('addText','\C[2]Le sang de '+s.name()+' fremit.\C[0]');
    if(s._tsBete===16) w.push('addText','\C[6]La fievre monte dans les veines de '+s.name()+'…\C[0]'); }
};

})();
