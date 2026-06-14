//=============================================================================
// AmeSouls.js — v1.0
// Système souls-like : Feu d'Âme (checkpoint/repos) + mort sans Game Over
// RPG Maker MV   ·   by JOKO
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Souls-like : Feu d'Âme (repos + checkpoint) ; la mort
 * renvoie au dernier Feu d'Âme et coûte des âmes (au lieu du Game Over).
 * @author JOKO
 *
 * @param soulVar
 * @text Variable — Âmes
 * @type variable
 * @default 15
 * @desc Compteur d'âmes (la même que Lou). En meurt, on en perd un pourcentage.
 *
 * @param lossPct
 * @text Perte d'âmes à la mort (%)
 * @type number
 * @min 0
 * @max 100
 * @default 50
 *
 * @param reviveRate
 * @text PV de réapparition (%)
 * @type number
 * @min 1
 * @max 100
 * @default 100
 * @desc % des PV/PM rendus en réapparaissant au Feu d'Âme.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE FEU D'ÂME (souls-like)                                          by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  ▶ POSER / UTILISER UN FEU D'ÂME (dans un événement, ex. un brasier)
 *      FEU repos      Soigne toute l'équipe ET enregistre ce lieu comme
 *                     point de réapparition (checkpoint).
 *      FEU set        Enregistre seulement le checkpoint (sans soigner).
 *
 *  ▶ LA MORT
 *      Quand toute l'équipe tombe, au lieu du Game Over :
 *        • tu réapparais au dernier Feu d'Âme,
 *        • l'équipe est ranimée,
 *        • tu PERDS un pourcentage de tes âmes (paramètre).
 *      Tant qu'aucun Feu d'Âme n'a été allumé, la mort = Game Over normal.
 *
 *  Le checkpoint est stocké dans la sauvegarde (rien à gérer côté variables).
 *  Idée : place un événement « brasier » avec la commande « FEU repos » dans
 *  chaque zone sûre — c'est ton feu de camp / bonfire.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('AmeSouls');
    var SOUL_VAR = parseInt(P['soulVar'] || 15);
    var LOSS = (parseInt(P['lossPct'] || 50)) / 100;
    var REVIVE = (parseInt(P['reviveRate'] || 100)) / 100;

    function ready() {
        return typeof $gameSystem !== 'undefined' && $gameSystem;
    }

    function setCheckpoint() {
        if (!ready()) return;
        $gameSystem._ameCheckpoint = {
            mapId: $gameMap.mapId(),
            x: $gamePlayer.x,
            y: $gamePlayer.y,
            dir: $gamePlayer.direction()
        };
    }

    function reviveParty() {
        $gameParty.members().forEach(function (a) {
            a.clearStates();
            a.revive ? a.revive() : a.removeState(a.deathStateId());
            a.setHp(Math.max(1, Math.floor(a.mhp * REVIVE)));
            a.setMp(Math.floor(a.mmp * REVIVE));
            a.clearActions();
        });
    }

    function restAtFire() {
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        setCheckpoint();
    }

    //=========================================================================
    // COMMANDES — FEU repos / FEU set
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pc.call(this, command, args);
        if (String(command).toUpperCase() !== 'FEU') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'repos') {
            restAtFire();
            $gameMessage.add('\\C[14]✦ Tu te reposes au Feu d\'Âme. Tes forces reviennent.\\C[0]');
        } else if (sub === 'set') {
            setCheckpoint();
        }
    };

    //=========================================================================
    // MORT — remplace le Game Over par une réapparition au Feu d'Âme
    //=========================================================================
    var _Scene_Gameover_start = Scene_Gameover.prototype.start;
    Scene_Gameover.prototype.start = function () {
        var ck = ready() ? $gameSystem._ameCheckpoint : null;
        if (ck && ck.mapId > 0) {
            // Perte d'âmes
            if (SOUL_VAR) {
                var s = $gameVariables.value(SOUL_VAR);
                $gameVariables.setValue(SOUL_VAR, Math.floor(s * (1 - LOSS)));
            }
            reviveParty();
            $gamePlayer.reserveTransfer(ck.mapId, ck.x, ck.y, ck.dir || 2, 0);
            if ($gameSystem.replayBgm) $gameSystem.replayBgm();
            SceneManager.goto(Scene_Map);
            return;
        }
        _Scene_Gameover_start.call(this);
    };

})();
