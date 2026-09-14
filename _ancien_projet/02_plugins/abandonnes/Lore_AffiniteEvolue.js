//=============================================================================
// Lore_AffiniteEvolue.js — v1.0 · « L'affinité n'est PAS figée » : la Santé
//   Mentale fait glisser la puissance vers le Corps (bas) ou l'Esprit (haut).
//=============================================================================
/*:
 * @plugindesc [Lore 11/50] Selon la SAN d'un heros : SAN basse -> +15% aux sorts du CORPS (rage), SAN haute -> +15% aux sorts de l'ESPRIT (serenite). Inverse en malus leger.
 * @author JOKO
 * @help Utilise window.Ame (phases 1-5). N'affecte que les 4 heros.
 */
(function () {
    'use strict';
    function srcEl(el){ if([4,5,8,11,15].indexOf(el)>=0)return'corps'; if([3,6,9,10,12,13].indexOf(el)>=0)return'esprit'; return null; }
    var _mdv=Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue=function(target,critical){
        var v=_mdv.call(this,target,critical); var u=this.subject();
        if(!u||!u.isActor||!u.isActor()||typeof window.Ame==='undefined')return v;
        var ph=window.Ame.phase(u.actorId()); if(!ph)return v;
        var it=this.item(); if(!it||!it.damage)return v; var es=srcEl(it.damage.elementId); if(!es)return v;
        var f=1;
        if(es==='corps') f = ph<=2 ? 1.15 : (ph>=4 ? 0.9 : 1);   // rage renforce le corps
        if(es==='esprit') f = ph>=4 ? 1.15 : (ph<=2 ? 0.9 : 1);  // serenite renforce l'esprit
        return Math.round(v*f);
    };
})();
