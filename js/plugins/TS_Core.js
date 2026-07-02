//=============================================================================
// TS_Core.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Socle des Trois Sources : couleur d'affinite (window.TS).
 * @author JOKO
 */
(function(){'use strict';

window.TS = window.TS || {};
TS.branchOf = function(s){ s=String(s||'').toLowerCase().trim();
  if(['positif','positive','originel'].indexOf(s)>=0) return 'esprit';
  if(['negatif','négative','negative','sombre'].indexOf(s)>=0) return 'corps';
  if(['spirituelle','spirituel','ame','âme'].indexOf(s)>=0) return 'ame';
  if(['pur','parfait','semi-parfait'].indexOf(s)>=0) return 'or'; return null; };
TS.COL = {esprit:'#5E92E6', corps:'#9166E6', ame:'#E0726E', or:'#D8B254'};
TS.sourceOf = function(b){ if(!b) return null;
  var d = b.isActor&&b.isActor()? b.actor() : (b.isEnemy&&b.isEnemy()? b.enemy():null);
  if(!d||!d.meta) return null;
  var b1=TS.branchOf(d.meta.Mana), b2=TS.branchOf(d.meta.Mana2);
  return (b2&&b2!==b1)?'or':b1; };
TS.color = function(b){ var s=TS.sourceOf(b); return s?TS.COL[s]:null; };

})();
