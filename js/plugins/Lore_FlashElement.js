//=============================================================================
// Lore_FlashElement.js — v1.0 · Un coup lourd fait « flasher » l'écran de la
//   couleur de son élément (lecture instantanée de la nature du dégât).
//=============================================================================
/*:
 * @plugindesc [Lore 48/50] Quand un coup depasse 25% des PV max de la cible, l'ecran flashe de la couleur de l'element. Punch visuel, lisible.
 * @author JOKO
 * @help Feu=rouge, Glace=cyan, Sombre=violet... Non intrusif (seuil eleve).
 */
(function(){ 'use strict';
    var C={1:[180,180,180],2:[200,120,255],3:[255,215,90],4:[110,168,255],5:[176,97,224],6:[240,240,240],7:[120,220,255],8:[255,90,50],9:[80,190,255],10:[120,220,120],11:[199,154,91],12:[255,225,74],13:[174,240,255],14:[255,243,160],15:[138,127,176],16:[224,160,255]};
    var _apply=Game_Action.prototype.apply;
    Game_Action.prototype.apply=function(target){ _apply.call(this,target);
        try{ var it=this.item(); if(!it||!it.damage)return; var res=target&&target.result?target.result():null; if(!res||res.hpDamage<=0)return;
            if(res.hpDamage>=target.mhp*0.25){ var el=it.damage.elementId; if(el===-1){ var ae=this.subject().attackElements(); el=ae.length?ae[0]:0; }
                var col=C[el]; if(col&&$gameScreen)$gameScreen.startFlash([col[0],col[1],col[2],110],22); }
        }catch(e){} };
})();
