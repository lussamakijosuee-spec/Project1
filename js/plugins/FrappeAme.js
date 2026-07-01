//=============================================================================
// FrappeAme.js — v1.0  ·  La Frappe d'âme (4e opération du Symbole)
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ <FrappeAme> : le coup traverse chair, armure et mana
 * sombre — il frappe l'ÂME (ignore DEF/MDF et les résistances). Mais frapper
 * une âme, c'est user la sienne : le lanceur gagne de l'Errance. Additif.
 * @author JOKO
 *
 * @param errancePrix
 * @text Prix — Errance gagnée par frappe
 * @type number
 * @default 2
 *
 * @param stunChance
 * @text Chance de sonner la cible (%)
 * @type number
 * @default 30
 *
 * @help
 *  « On ne blesse pas le corps : on heurte l'âme. Une lame qu'aucun bouclier
 *  n'arrête. Mais frapper une âme, c'est toucher la sienne au passage. »
 *
 *  ▶ Note de compétence :
 *      <FrappeAme>            la frappe ignore DEF/MDF et les résistances
 *                             élémentaires de la cible (élément forcé à 100%).
 *      <FrappeAmeEtat: id>    (option) état « sonné » appliqué (stunChance %).
 *  ▶ Prix : le lanceur (héros) gagne +2 d'Errance par frappe (plugin Errance).
 *  ▶ Conseillé : compétences de type âme (stype 9) / élément 2 (spirituel).
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('FrappeAme');
    var PRIX = parseInt(P['errancePrix'] || 2);
    var STUN = parseInt(P['stunChance'] || 30);

    function isFrappe(action) {
        var it = action && action.item && action.item();
        return !!(it && it.meta && it.meta.FrappeAme);
    }

    // L'âme n'a ni chair ni armure : DEF/MDF de la cible = 0 dans la formule
    var _evalDmg = Game_Action.prototype.evalDamageFormula;
    Game_Action.prototype.evalDamageFormula = function (target) {
        if (isFrappe(this) && target) {
            var proxy = Object.create(target);
            Object.defineProperty(proxy, 'def', { value: 0 });
            Object.defineProperty(proxy, 'mdf', { value: 0 });
            try {
                var item = this.item();
                var a = this.subject(); var b = proxy;
                var v = $gameVariables; var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
                var value = Math.max(eval(item.damage.formula), 0) * sign;
                return isNaN(value) ? 0 : value;
            } catch (e) { return 0; }
        }
        return _evalDmg.call(this, target);
    };

    // Traverse les résistances : taux élémentaire forcé à 100 %
    var _calcElem = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function (target) {
        if (isFrappe(this)) return 1;
        return _calcElem.call(this, target);
    };

    // Effets à l'impact : prix d'Errance + « sonné » éventuel
    var _execDmg = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _execDmg.call(this, target, value);
        if (value > 0 && isFrappe(this)) {
            var s = this.subject();
            if (s && s.isActor && s.isActor() && window.Errance) Errance.add(s.actorId(), PRIX);
            var it = this.item();
            var st = it.meta.FrappeAmeEtat ? parseInt(it.meta.FrappeAmeEtat) : 0;
            if (st > 0 && Math.randomInt(100) < STUN && target.isAlive()) target.addState(st);
            if ($gameScreen) $gameScreen.startFlash([240, 120, 160, 140], 20);
        }
    };
})();
