//=============================================================================
// NewGamePlus.js — v1.0  ·  New Game + (souls-like)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ New Game + : recommence l'aventure en gardant niveaux,
 * objets et équipement, mais avec des ennemis renforcés (et plus de butin).
 * @author JOKO
 *
 * @param startMap
 * @text Carte de départ
 * @type number
 * @default 1
 * @desc Map où l'on est transféré au lancement d'un New Game +.
 *
 * @param startX
 * @text X de départ
 * @type number
 * @default 8
 *
 * @param startY
 * @text Y de départ
 * @type number
 * @default 6
 *
 * @param diffPerCycle
 * @text Difficulté ajoutée par cycle
 * @type number
 * @decimals 2
 * @default 0.50
 * @desc +50% aux stats des ennemis par cycle de NG+ (et +exp/or).
 *
 * @help
 *  Quand le joueur finit le jeu, lance :
 *      Plugin Command :  NGPLUS start
 *  → cycle +1, équipe conservée (niveaux/objets/équipement), transfert à la
 *    carte de départ. Les ennemis deviennent plus forts à chaque cycle.
 *
 *  Utile dans un script/condition :  $gameSystem.ngPlusCycle()
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('NewGamePlus');
    var SMAP = parseInt(P['startMap'] || 1);
    var SX = parseInt(P['startX'] || 8);
    var SY = parseInt(P['startY'] || 6);
    var DIFF = parseFloat(P['diffPerCycle'] || 0.5);

    Game_System.prototype.ngPlusCycle = function () { return this._ngPlus || 0; };
    Game_System.prototype.ngPlusFactor = function () { return 1 + DIFF * this.ngPlusCycle(); };

    function startNGPlus() {
        $gameSystem._ngPlus = ($gameSystem._ngPlus || 0) + 1;
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        $gamePlayer.reserveTransfer(SMAP, SX, SY, 2, 0);
        if (window.Succes) window.Succes.unlock(9);
    }

    //--- Renforcement des ennemis selon le cycle ---
    var _paramBase = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function (pid) {
        var v = _paramBase.call(this, pid);
        if ($gameSystem && $gameSystem.ngPlusCycle() > 0) v = Math.round(v * $gameSystem.ngPlusFactor());
        return v;
    };
    var _exp = Game_Enemy.prototype.exp;
    Game_Enemy.prototype.exp = function () {
        var v = _exp.call(this);
        if ($gameSystem && $gameSystem.ngPlusCycle() > 0) v = Math.round(v * $gameSystem.ngPlusFactor());
        return v;
    };
    var _gold = Game_Enemy.prototype.gold;
    Game_Enemy.prototype.gold = function () {
        var v = _gold.call(this);
        if ($gameSystem && $gameSystem.ngPlusCycle() > 0) v = Math.round(v * $gameSystem.ngPlusFactor());
        return v;
    };

    //--- Commande plugin ---
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() === 'NGPLUS' && (args[0] || '').toLowerCase() === 'start') {
            startNGPlus();
        }
    };
})();
