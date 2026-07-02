//=============================================================================
// TS_Astre.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Ennemi note <Astre> : au debut du combat, un avertissement « FUYEZ » (on ne classe pas un dieu).
 * @author JOKO
 */
(function(){'use strict';

var _sb=BattleManager.startBattle;
BattleManager.startBattle=function(){ _sb.call(this);
  var astre=$gameTroop.members().some(function(e){ return e.enemy()&&e.enemy().meta&&e.enemy().meta.Astre; });
  if(astre){ if($gameScreen)$gameScreen.startFlash([255,255,255,160],30); var w=this._logWindow;
    if(w){ w.push('addText','\C[8]— ASTRE —\C[0]'); w.push('addText','\C[8]Ce n\'est pas une force. C\'est : FUYEZ.\C[0]'); w.push('wait'); } } };

})();
