//=============================================================================
// TS_Lucidite.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Socle Lucidite : window.TS.lucidite(actor) (0-100) lu sur la var mentale 11-14, sinon 80.
 * @author JOKO
 */
(function(){'use strict';

window.TS=window.TS||{}; var MV={1:11,2:12,3:13,4:14};
TS.lucidite=function(a){ if(!a||!a.actorId)return 80; var v=MV[a.actorId()];
  if(!v||!$gameVariables)return 80; return Math.max(0,Math.min(100,$gameVariables.value(v)*10)); };

})();
