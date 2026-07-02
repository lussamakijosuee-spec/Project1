//=============================================================================
// TS_InsightReveal.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Lucidite elevee : au debut du combat, on percoit la faiblesse elementaire des ennemis (le voile se leve).
 * @author JOKO
 */
(function(){'use strict';

var _sb=BattleManager.startBattle;
BattleManager.startBattle=function(){ _sb.call(this); var w=this._logWindow; if(!w||!window.TS)return;
  var lead=$gameParty.leader(); if(!lead||TS.lucidite(lead)<60)return;
  $gameTroop.aliveMembers().forEach(function(e){ var weak=[];
    for(var el=8;el<=15;el++){ if(e.elementRate(el)>1.0) weak.push(el); }
    if(weak.length) w.push('addText','\C[1]Insight : '+e.name()+' redoute l\'element '+weak[0]+'.\C[0]'); }); };

})();
