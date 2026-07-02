//=============================================================================
// TS_ManaOverflow.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Quand les PM d'un heros sont pleins, une etincelle marque sa surcharge de mana (log de combat).
 * @author JOKO
 */
(function(){'use strict';

var _st = BattleManager.startTurn;
BattleManager.startTurn = function(){ var w=this._logWindow;
  if(w) $gameParty.battleMembers().forEach(function(a){ if(a.mp>=a.mmp && a.mmp>0 && !a._tsFull){ a._tsFull=true;
    w.push('addText','\C[17]✦ '+a.name()+' deborde de mana.\C[0]'); } else if(a.mp<a.mmp){ a._tsFull=false; } });
  _st.call(this);
};

})();
