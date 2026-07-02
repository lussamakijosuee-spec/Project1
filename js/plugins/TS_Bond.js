//=============================================================================
// TS_Bond.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Lien : quand un allie tombe, les autres serrent les rangs (+ATK temporaire, la rage du deuil).
 * @author JOKO
 */
(function(){'use strict';

var _die=Game_Actor.prototype.die;
Game_Actor.prototype.die=function(){ _die.call(this);
  if($gameParty.inBattle()){ $gameParty.aliveMembers().forEach(function(a){ a._tsBond=(a._tsBond||0)+1; });
    var w=BattleManager._logWindow; if(w)w.push('addText','\C[6]La chute d\'un allie enflamme les autres.\C[0]'); } };
var _pr=Game_Actor.prototype.paramRate;
Game_Actor.prototype.paramRate=function(p){ var r=_pr.call(this,p); if(p===2&&this._tsBond) r*=(1+0.1*this._tsBond); return r; };
var _end=BattleManager.endBattle; BattleManager.endBattle=function(x){ $gameParty.members().forEach(function(a){a._tsBond=0;}); _end.call(this,x); };

})();
