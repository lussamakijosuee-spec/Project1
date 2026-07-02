//=============================================================================
// TS_PacteReine.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Commande PACTE <heroId> : la Reine benit (etat 188 puissant) contre un prix — jamais sans consentement.
 * @author JOKO
 */
(function(){'use strict';

var _pc=Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
  if(String(c).toUpperCase()!=='PACTE')return; var id=parseInt(a[0]||1)||1; var ac=$gameActors.actor(id); if(!ac)return;
  if($dataStates[188]) ac.addState(188);
  if(window.Errance) Errance.add(id,20);
  if($gameMessage){ $gameMessage.add('\C[8]La Deesse blanche accorde son don…\C[0]');
    $gameMessage.add('\C[8]…et la verite qui va avec. (le prix : +Errance)\C[0]'); } };

})();
