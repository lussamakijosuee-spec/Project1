//=============================================================================
// TS_LacDescent.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Commande LAC on|off : descendre dans le Lac → teinte bleu-glace + brume (revele le cache).
 * @author JOKO
 */
(function(){'use strict';

var _pc=Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
  if(String(c).toUpperCase()!=='LAC')return;
  if((a[0]||'on')==='off'){ $gameScreen.startTint([0,0,0,0],60); }
  else { $gameScreen.startTint([-68,-40,20,80],90); if($gameMessage)$gameMessage.add('\C[1]Tu descends dans le Lac. Le voile se leve…\C[0]'); } };

})();
