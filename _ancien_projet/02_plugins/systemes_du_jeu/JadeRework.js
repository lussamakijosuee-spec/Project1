//=============================================================================
// JadeRework.js — v1.0  ·  Jade Primordiale : « Dernier Souffle » (Last Breath)
// RPG Maker MV   ·   by JOKO   (additif — ne modifie pas JadeObsession.js)
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Boss secret le plus dur : à sa "mort", Jade Primordiale
 * renaît en CHAOS (Dernier Souffle), aidée par la seconde Jade. Survis !
 * @author JOKO
 *
 * @param chaosState
 * @text État Chaos Primordial
 * @type state
 * @default 180
 *
 * @param reviveRate
 * @text PV à la renaissance (%)
 * @type number
 * @default 65
 *
 * @help
 *  Notetags (sur les ennemis Jade) :
 *      <JadePrime>    la déesse primordiale (renaît une fois en Chaos).
 *      <JadeSecond>   la seconde Jade qui l'aide (se déchaîne au Dernier Souffle).
 *
 *  Quand la Primordiale tombe la 1re fois : elle ne meurt pas — elle entre
 *  dans sa forme CHAOS (stats énormes, attaques de survie), l'écran vire au
 *  rouge, et la seconde Jade se régénère et se déchaîne. C'est le moment le
 *  plus dur du jeu : il faut SURVIVRE avant de pouvoir l'achever.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('JadeRework');
    var CHAOS = parseInt(P['chaosState'] || 180);
    var REVIVE = (parseInt(P['reviveRate'] || 65)) / 100;

    function meta(b, k) { return b && b.isEnemy && b.isEnemy() && b.enemy() && b.enemy().meta && b.enemy().meta[k]; }
    function isPrime(b) { return meta(b, 'JadePrime'); }
    function isSecond(b) { return meta(b, 'JadeSecond'); }
    function log(t) { var s = SceneManager._scene; if (s && s._logWindow) s._logWindow.push('addText', t); }

    function lastBreathFX() {
        if ($gameScreen) {
            $gameScreen.startFlash([255, 0, 40, 200], 60);
            $gameScreen.startShake(8, 8, 120);
            $gameScreen.startTint([-40, -80, -80, 80], 1);
        }
        AudioManager.playSe({ name: 'Explosion2', volume: 100, pitch: 70, pan: 0 });
    }

    // « Dernier Souffle » : la Primordiale renaît une fois en Chaos.
    var _die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function () {
        if (isPrime(this) && !this._lastBreath) {
            this._lastBreath = true;
            this.clearStates();                                 // annule la mort
            this.setHp(Math.max(1, Math.floor(this.mhp * REVIVE)));
            this.addState(CHAOS);                               // forme Chaos
            this.clearActions();
            lastBreathFX();
            log("\\C[18]JADE : « …Tu crois m'avoir tuée ? »\\C[0]");
            log("\\C[2]★ DERNIER SOUFFLE — la déesse primordiale se déchaîne. SURVIS.\\C[0]");
            // La seconde Jade se régénère et l'aide
            if ($gameTroop) {
                $gameTroop.members().forEach(function (m) {
                    if (isSecond(m) && m.isAlive()) {
                        m.recoverAll();
                        m.addState(CHAOS);
                        log("\\C[2]La seconde Jade hurle et amplifie le chaos !\\C[0]");
                    }
                });
            }
            return;                                             // elle ne tombe pas
        }
        _die.call(this);
    };
})();
