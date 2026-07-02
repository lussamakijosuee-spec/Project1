//=============================================================================
// TS_CritImpact.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les coups critiques font trembler l'ecran et un flash bref (impact).
 * @author JOKO
 */
(function(){'use strict';

var _apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target){ _apply.call(this,target);
  var r=target.result(); if(r&&r.critical&&$gameScreen){ $gameScreen.startShake(4,8,12); $gameScreen.startFlash([255,255,255,90],10); }
};

})();
