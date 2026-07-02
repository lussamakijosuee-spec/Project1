//=============================================================================
// TS_SourceQuote.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Au debut de certains combats, une maxime des Trois Sources s'affiche (ambiance).
 * @author JOKO
 */
(function(){'use strict';

var Q=['Les faibles choisissent une voie. Les forts les portent toutes.',
'On ne cree rien : on descend chercher ce qui etait deja la.',
'Pencher donne la puissance — et un peu de la chute qui va avec.',
'Le maitre n\'est pas le plus fort : c\'est celui qui sait revenir.'];
var _s=BattleManager.startBattle; BattleManager.startBattle=function(){ _s.call(this);
  if(this._logWindow && Math.randomInt(100)<25){ this._logWindow.push('addText','\C[8]« '+Q[Math.randomInt(Q.length)]+' »\C[0]'); this._logWindow.push('wait'); }
};

})();
