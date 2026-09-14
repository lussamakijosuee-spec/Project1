//=============================================================================
// Lore_ObjetSpirituelMenu.js — v1.0 · Affiche le palier de l'Objet Spirituel
//   dans l'écran de Statut.
//=============================================================================
/*:
 * @plugindesc [Lore 20/50] Ecran Statut : ajoute une ligne « Objet Spirituel : <palier> » sous la classe. Necessite Lore_ObjetSpirituel.
 * @author JOKO
 * @help Additif, non intrusif.
 */
(function(){ 'use strict';
    if(typeof Window_Status==='undefined')return;
    var _b1=Window_Status.prototype.drawBlock1;
    Window_Status.prototype.drawBlock1=function(y){ _b1.call(this,y);
        try{ if(window.ObjetSpirituel&&this._actor){ var p=window.ObjetSpirituel.palier(this._actor);
            var lh=this.lineHeight(); this.changeTextColor(this.textColor(6));
            this.contents.fontSize=20; this.drawText('◈ Objet Spirituel : '+p.n, 96, y+lh*3, 360); this.contents.fontSize=28; this.resetTextColor(); }
        }catch(e){} };
})();
