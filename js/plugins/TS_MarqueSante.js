//=============================================================================
// TS_MarqueSante.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ L'etat de la marque suit la sante de l'ame (PV) : Pleine / Felee / Affamee, annonce en debut de combat.
 * @author JOKO
 */
(function(){'use strict';

var _sb=BattleManager.startBattle;
BattleManager.startBattle=function(){ _sb.call(this); var w=this._logWindow; if(!w)return;
  $gameParty.battleMembers().forEach(function(a){ var r=a.hpRate(); var s=r>0.7?null:(r>0.35?'\C[6]Marque felee\C[0]':'\C[8]Marque affamee\C[0]');
    if(s) w.push('addText',a.name()+' : '+s); }); };

})();
