//=============================================================================
// TS_Resonance.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ RESONANCE <id1> <id2> : deux ames accordees partagent +ATK/+DEF tant que les deux vivent (le Symbole).
 * @author JOKO
 */
(function(){'use strict';

function link(){ $gameSystem._tsReso=$gameSystem._tsReso||[]; return $gameSystem._tsReso; }
var _pr=Game_Actor.prototype.paramRate;
Game_Actor.prototype.paramRate=function(p){ var r=_pr.call(this,p); var L=link();
  for(var i=0;i<L.length;i++){ var a=$gameActors.actor(L[i][0]), b=$gameActors.actor(L[i][1]);
    if((this===a||this===b)&&a&&b&&a.isAlive()&&b.isAlive()){ if(p===2||p===3) r*=1.2; } }
  return r; };
var _pc=Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
  if(String(c).toUpperCase()!=='RESONANCE')return; var L=link(); var i1=parseInt(a[0]),i2=parseInt(a[1]);
  if(a[0]==='off'){ $gameSystem._tsReso=[]; } else if(i1&&i2){ L.push([i1,i2]);
    if($gameMessage)$gameMessage.add('\C[2]Deux ames entrent en resonance.\C[0]'); } };

})();
