//=============================================================================
// JourNuit.js — v1.0  ·  Cycle Jour/Nuit & Mana
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Jour/Nuit : teinte l'écran et module le Mana — Positif
 * plus fort le JOUR, Sombre plus fort la NUIT. Renforce le lore et la stratégie.
 * @author JOKO
 *
 * @param elPositif
 * @text Élément — Positif
 * @type number
 * @default 3
 *
 * @param elSombre
 * @text Élément — Sombre
 * @type number
 * @default 5
 *
 * @param bonus
 * @text Bonus (favorable)
 * @type number
 * @decimals 2
 * @default 1.20
 *
 * @param malus
 * @text Malus (défavorable)
 * @type number
 * @decimals 2
 * @default 0.80
 *
 * @param autoSteps
 * @text Bascule auto tous les N pas (0 = manuel)
 * @type number
 * @default 0
 * @desc Si > 0, le jour/nuit bascule automatiquement tous les N pas du joueur.
 *
 * @help
 *  Dans un événement :
 *      TEMPS jour          Passe au jour (teinte claire)
 *      TEMPS nuit          Passe à la nuit (teinte sombre)
 *      TEMPS basculer      Inverse jour/nuit
 *  Effet combat : Mana Positif ×1.2 le jour / ×0.8 la nuit ; Mana Sombre
 *  ×1.2 la nuit / ×0.8 le jour. Se cumule avec ManaAffinity.
 *  Script : $gameSystem.estNuit()
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('JourNuit');
    var EL_POS = parseInt(P['elPositif'] || 3);
    var EL_SOM = parseInt(P['elSombre'] || 5);
    var BON = parseFloat(P['bonus'] || 1.2);
    var MAL = parseFloat(P['malus'] || 0.8);
    var AUTO = parseInt(P['autoSteps'] || 0);

    Game_System.prototype.estNuit = function () { return !!this._nuit; };

    function applyTint(quick) {
        var t = $gameSystem.estNuit() ? [-68, -68, 0, 68] : [0, 0, 0, 0];
        $gameScreen.startTint(t, quick ? 1 : 60);
    }
    function setNuit(v) {
        if (!$gameSystem) return;
        $gameSystem._nuit = v; applyTint(false);
    }

    // Re-applique la teinte au chargement d'une carte (cohérence après save/transfert)
    var _onMapStart = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _onMapStart.call(this);
        if ($gameSystem && $gameSystem._nuit !== undefined) applyTint(true);
    };

    // Bascule auto par pas
    if (AUTO > 0) {
        var _incSteps = Game_Party.prototype.increaseSteps;
        Game_Party.prototype.increaseSteps = function () {
            _incSteps.call(this);
            if (this.steps() % AUTO === 0) setNuit(!$gameSystem.estNuit());
        };
    }

    //--- Modulateur de Mana selon l'heure ---
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var value = _mdv.call(this, target, critical);
        if (value === 0 || !$gameSystem) return value;
        var item = this.item(); if (!item || !item.damage) return value;
        var el = item.damage.elementId;
        var nuit = $gameSystem.estNuit();
        var f = 1;
        if (el === EL_POS) f = nuit ? MAL : BON;
        else if (el === EL_SOM) f = nuit ? BON : MAL;
        if (f !== 1) value = Math.floor(value * f);
        return value;
    };

    //--- Commande plugin ---
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'TEMPS') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'jour') setNuit(false);
        else if (sub === 'nuit') setNuit(true);
        else if (sub === 'basculer') setNuit(!$gameSystem.estNuit());
    };
})();
