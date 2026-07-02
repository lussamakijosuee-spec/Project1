//=============================================================================
// TS_CodexSources.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Menu CODEX3 : un petit livre des Trois Sources, Arts et Chutes (rappel lore en jeu).
 * @author JOKO
 */
(function(){'use strict';

function Scene_TS(){ this.initialize.apply(this,arguments); }
Scene_TS.prototype=Object.create(Scene_MenuBase.prototype); Scene_TS.prototype.constructor=Scene_TS;
Scene_TS.prototype.create=function(){ Scene_MenuBase.prototype.create.call(this);
  var w=new Window_Base(0,0,Graphics.boxWidth,Graphics.boxHeight); this.addWindow(w); var y=0,L=w.lineHeight();
  function line(t){ w.drawTextEx(t,20,y); y+=L; }
  line('\\C[14]LES TROIS SOURCES\\C[0]'); y+=6;
  line('\\C[1]ESPRIT\\C[0] — la Parole — prix: la lucidite — chute: le Dement');
  line('\\C[6]CORPS\\C[0]  — la Maitrise — prix: l\'humanite — chute: la Bete');
  line('\\C[2]AME\\C[0]    — le Symbole — prix: l\'essence — chute: l\'Errant'); y+=8;
  line('\\C[17]Le centre des trois = le Mana Semi-Parfait.\\C[0]');
  line('« Le maitre n\'est pas le plus fort : c\'est celui qui sait revenir. »'); };
Scene_TS.prototype.update=function(){ Scene_MenuBase.prototype.update.call(this);
  if(Input.isTriggered('cancel')||Input.isTriggered('ok')||TouchInput.isCancelled())this.popScene(); };
var _pc=Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
  if(String(c).toUpperCase()==='CODEX3') SceneManager.push(Scene_TS); };

})();
