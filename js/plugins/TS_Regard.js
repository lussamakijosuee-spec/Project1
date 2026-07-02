//=============================================================================
// TS_Regard.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Competence notee <Regard> : le Regard lit l'ame de la cible (PV restants + nature revelee).
 * @author JOKO
 */
(function(){'use strict';

var _apply=Game_Action.prototype.apply;
Game_Action.prototype.apply=function(t){ _apply.call(this,t);
  var it=this.item&&this.item(); if(!(it&&it.meta&&it.meta.Regard&&t&&t.isEnemy&&t.isEnemy()))return;
  var w=BattleManager._logWindow; if(!w)return;
  var pct=Math.floor(100*t.hp/t.mhp);
  w.push('addText','\C[2]Le Regard : '+t.name()+' — ame a '+pct+'%'+(t.hp<t.mhp*0.3?' (faille ouverte !)':'')+'\C[0]'); };

})();
