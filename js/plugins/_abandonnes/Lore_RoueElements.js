//=============================================================================
// Lore_RoueElements.js — v1.0 · La Roue des Éléments : frapper la faiblesse
//   (Feu→Eau→Foudre→Terre→Vent→Glace→Feu, Ombre⇄Lumière) donne un bonus visuel.
//=============================================================================
/*:
 * @plugindesc [Lore 07/50] Annonce « FAIBLESSE ! » quand l'element de l'attaque bat celui de l'ennemi selon la Roue. Purement narratif/visuel.
 * @author JOKO
 * @help Lit l'element de l'attaque et l'element defensif de la cible (<RoueElem: 8>).
 */
(function () {
    'use strict';
    var WHEEL={8:9,9:12,12:11,11:10,10:13,13:8,15:14,14:15}; // attaquant -> faiblesse de la cible
    var NAME={8:'Feu',9:'Eau',10:'Vent',11:'Terre',12:'Foudre',13:'Glace',14:'Lumière',15:'Ombre'};
    function defElem(b){ try{ var n=b.enemy?b.enemy().note:(b.actor?b.actor().note:''); var m=/<RoueElem:\s*(\d+)>/i.exec(n||''); return m?Number(m[1]):0; }catch(e){return 0;} }
    var _apply=Game_Action.prototype.apply;
    Game_Action.prototype.apply=function(target){
        _apply.call(this,target); var it=this.item(); if(!it||!it.damage) return;
        var atk=it.damage.elementId, de=defElem(target); if(!atk||!de) return;
        if(WHEEL[atk]===de){ var w=BattleManager._logWindow; if(w) w.push('addText','\\C[17]⚡ FAIBLESSE ! '+(NAME[atk]||'')+' brise '+(NAME[de]||'')+' !\\C[0]');
            if($gameScreen) $gameScreen.startFlash([255,230,120,80],18); }
    };
})();
