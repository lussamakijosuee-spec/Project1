//=============================================================================
// KevSignature.js — v1.0  ·  Kev, l'Empereur — La Loi du Plus Fort (Radahn)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Kev (<Radahn>) : sa fureur enfle à chaque tour (ATK qui
 * snowball — course contre la montre), et le Mana Sombre/Négatif LE SOIGNE.
 * Enrage à bas PV. Additif.
 * @author JOKO
 *
 * @param growth
 * @text Gain d'ATK par tour (%)
 * @type number
 * @default 12
 *
 * @param elDark
 * @text Élément Sombre
 * @type number
 * @default 5
 *
 * @param elNeg
 * @text Élément Négatif
 * @type number
 * @default 4
 *
 * @help
 *  Détecte l'ennemi marqué <Radahn> dans sa Note (Kev).
 *  • Chaque tour, sa fureur enfle : +X% d'ATK cumulés (il faut le vaincre vite).
 *  • Le frapper avec du Mana Sombre/Négatif le SOIGNE (force la variété).
 *  • À 30% PV, il entre en fureur impériale (gros bond de puissance).
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('KevSignature');
    var GROW = (parseInt(P['growth'] || 12)) / 100;
    var EL_DARK = parseInt(P['elDark'] || 5);
    var EL_NEG = parseInt(P['elNeg'] || 4);

    function isKev(b) { return b && b.isEnemy && b.isEnemy() && b.enemy() && b.enemy().meta && b.enemy().meta.Radahn; }
    function getKev() { return $gameTroop ? $gameTroop.aliveMembers().filter(isKev)[0] : null; }
    function log(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }

    // --- ATK qui enfle à chaque tour (snowball) ---
    var _pb = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function (pid) {
        var v = _pb.call(this, pid);
        if (pid === 2 && isKev(this) && this._kevStacks) v *= (1 + GROW * this._kevStacks);
        return Math.round(v);
    };

    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        var k = getKev();
        if (k) {
            if (k._kevStacks == null) k._kevStacks = 0;
            k._kevStacks++;
            if (k._kevStacks % 2 === 0) log('\\C[18]La fureur de ' + k.name() + ' enfle. Sa force redouble.\\C[0]');
            if (k.hpRate() <= 0.30 && !k._kevRage) {
                k._kevRage = true; k._kevStacks += 4;
                $gameScreen.startFlash([200, 0, 60, 170], 40); $gameScreen.startShake(7, 8, 50);
                log('\\C[18]★ « JE SUIS LA LOI. » ' + k.name() + ' déchaîne sa fureur impériale !\\C[0]');
            }
            k.refresh();
        }
        _startTurn.call(this);
    };

    // --- Le Sombre / Négatif le NOURRIT ---
    var _exec = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        if (isKev(target) && value > 0) {
            var item = this.item(), el = (item && item.damage) ? item.damage.elementId : 0;
            if (el === EL_DARK || el === EL_NEG) {
                var heal = Math.floor(value * 0.6);
                target.gainHp(heal);
                if (target.startDamagePopup) target.startDamagePopup();
                log('Le Sombre nourrit l\'Empereur — ' + target.name() + ' absorbe ' + heal + ' PV.');
                _exec.call(this, target, 0);
                return;
            }
        }
        _exec.call(this, target, value);
    };
})();
