//=============================================================================
// Lore_Reprises.js — v1.0 · Les Reprises (méta-horreur du Lac)
//   « Il arrive qu'un être tombe, et que le monde revienne en arrière. Nul ne
//   s'en souvient — sauf ceux qui ont touché les seuils profonds du Lac. »
//=============================================================================
/*:
 * @plugindesc [Lore] Le jeu compte tes game over À TRAVERS les parties
 * (Reprises). Les héros assez profonds dans le Lac s'en souviennent — murmures.
 * @author JOKO
 *
 * @param phaseSouvenir
 * @text Phase max pour se souvenir
 * @type number
 * @min 1
 * @max 5
 * @default 3
 * @desc Un héros se souvient des Reprises si sa phase mentale est ≤ à cette valeur (3 = la trame et plus profond).
 *
 * @help
 *  ▶ Une REPRISE = un game over. Le compte est gardé dans la config du jeu
 *    (ConfigManager) : il SURVIT aux sauvegardes, aux nouvelles parties, au
 *    « recommencer ». Le monde a repris ; le jeu, lui, n'a pas oublié.
 *
 *  ▶ Au retour sur la carte, si au moins un héros est assez profond dans le
 *    Lac (phase ≤ phaseSouvenir), une fois par session, un souvenir flou :
 *    « …tu es déjà tombé. N morts qui n'ont pas compté. »
 *
 *  Script :  Reprises.total()      → nombre de Reprises (toutes parties).
 *  Commande (mise en scène) :  REPRISES dire   → force le murmure.
 *  Aucune dépendance dure (sans window.Ame : phase supposée 5, silence).
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('Lore_Reprises');
    var PHASE_MAX = parseInt(P['phaseSouvenir'] || 3);
    var shownThisSession = false;

    //--- Persistance via ConfigManager (survit à tout) -------------------------
    var _makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
        var config = _makeData.call(this);
        config.reprises = this.reprises || 0;
        return config;
    };
    var _applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        _applyData.call(this, config);
        this.reprises = config.reprises || 0;
    };

    var Reprises = {
        total: function () { return ConfigManager.reprises || 0; },
        murmure: function () {
            var n = this.total();
            if (n <= 0 || !$gameMessage || $gameMessage.isBusy()) return;
            $gameMessage.add('\\C[1]…un souvenir flou. Tu es déjà tombé.\\C[0]');
            $gameMessage.add('\\C[8]' + n + (n > 1 ? ' morts' : ' mort') + ' qui n\'' + (n > 1 ? 'ont' : 'a') + ' pas compté. Le monde a repris.\\C[0]');
        }
    };
    window.Reprises = Reprises;

    //--- Chaque game over est une Reprise --------------------------------------
    var _goStart = Scene_Gameover.prototype.start;
    Scene_Gameover.prototype.start = function () {
        _goStart.call(this);
        try {
            ConfigManager.reprises = (ConfigManager.reprises || 0) + 1;
            ConfigManager.save();
        } catch (e) {}
    };

    //--- Le souvenir : une fois par session, pour les lucides profonds ---------
    function quelquUnSeSouvient() {
        if (!window.Ame || !$gameParty) return false;
        return $gameParty.members().some(function (m) {
            var p = 5;
            try { p = window.Ame.phase(m.actorId()) || 5; } catch (e) {}
            return p <= PHASE_MAX;
        });
    }
    var _mapStart = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _mapStart.call(this);
        try {
            if (shownThisSession || Reprises.total() <= 0) return;
            if (!quelquUnSeSouvient()) return;
            shownThisSession = true;
            Reprises.murmure();
        } catch (e) {}
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'REPRISES') return;
        if ((args[0] || '').toLowerCase() === 'dire') Reprises.murmure();
    };
})();
