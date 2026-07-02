//=============================================================================
// TS_Rune.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Objet/arme notee <Rune: skillId> : lance une Parole gravee sans reciter. Commande RUNE <heroId>.
 * @author JOKO
 */
(function(){'use strict';

var _pc=Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
  if(String(c).toUpperCase()!=='RUNE')return; var id=parseInt(a[0]||1)||1; var ac=$gameActors.actor(id); if(!ac)return;
  var sid=0; ac.equips().forEach(function(e){ if(e&&e.meta&&e.meta.Rune) sid=parseInt(e.meta.Rune); });
  if(sid&&$dataSkills[sid]&&$gameMessage) $gameMessage.add('\C[1]La rune s\'illumine : '+$dataSkills[sid].name+'.\C[0]'); };

})();
