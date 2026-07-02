//=============================================================================
// TS_Rangs.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Rang de puissance D→S affiche sous le nom dans le menu (l'echelle de l'Ordre d'Or).
 * @author JOKO
 */
(function(){'use strict';

function rang(a){ var lv=a.level||1; return lv>=60?['S','#EBC974']:lv>=45?['A','#F0928E']:lv>=30?['B','#9CC0F5']:lv>=15?['C','#B6AE9C']:['D','#7E7688']; }
var _dsi=Window_Base.prototype.drawActorLevel;
Window_Base.prototype.drawActorLevel=function(a,x,y){ _dsi.call(this,a,x,y);
  var r=rang(a); this.changeTextColor(r[1]); this.drawText('['+r[0]+']',x+84,y,40); this.resetTextColor(); };

})();
