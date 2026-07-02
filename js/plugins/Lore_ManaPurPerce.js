//=============================================================================
// Lore_ManaPurPerce.js — v1.0 · Le Mana Pur / Semi-Parfait IGNORE les
//   résistances élémentaires (il transcende le cycle).
//=============================================================================
/*:
 * @plugindesc [Lore 04/50] Elements Mana Parfait(7) et Mana semi-parfait(16) ignorent la resistance elementaire de la cible (taux force a 100%).
 * @author JOKO
 * @help Aucune config. Perce toute resistance/faiblesse pour ces deux elements.
 */
(function () {
    'use strict';
    var PUR=[7,16];
    var _rate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target){
        var it=this.item();
        if(it&&it.damage&&PUR.indexOf(it.damage.elementId)>=0) return 1.0;
        return _rate.call(this,target);
    };
})();
