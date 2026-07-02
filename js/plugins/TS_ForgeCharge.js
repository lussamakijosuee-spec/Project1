//=============================================================================
// TS_ForgeCharge.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Commande de plugin FORGE <heroId> : le heros se concentre, sa prochaine frappe physique est doublee.
 * @author JOKO
 */
(function(){'use strict';

var _mdv=Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue=function(t,c){ var v=_mdv.call(this,t,c); var s=this.subject();
  if(v>0&&s&&s._tsForge&&this.isPhysical&&this.isPhysical()){ v=Math.round(v*2); s._tsForge=false;
    if($gameScreen)$gameScreen.startFlash([255,180,80,120],14); } return v; };
var _pc=Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
  if(String(c).toUpperCase()==='FORGE'){ var id=parseInt(a[0]||1)||1; var ac=$gameActors.actor(id); if(ac)ac._tsForge=true; } };

})();
