//=============================================================================
// DonoBoss.js — v1.0  ·  Dono, le Génie Progressif (3e boss principal)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Dono : boss duo (lui + son Esprit Vengeur). Génie qui
 * évolue avec le combat — empathie → sérieux → synchronisation → Mana Parfait.
 * @author JOKO
 *
 * @param empathieState
 * @text État Empathie (se retient)
 * @type state
 * @default 176
 *
 * @param serieuxState
 * @text État Sérieux
 * @type state
 * @default 177
 *
 * @param eveilState
 * @text État Éveil (Mana Parfait)
 * @type state
 * @default 178
 *
 * @param syncReduc
 * @text Réduction de dégâts si l'Esprit vit
 * @type number
 * @decimals 2
 * @default 0.70
 * @desc Tant que l'Esprit Vengeur est vivant, Dono ne subit que ce % de dégâts (sync parfaite).
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  DONO — LE GÉNIE PROGRESSIF                                         by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Un homme trop concentré sur son amour, au talent pur : il maîtrise
 *  naturellement les 3 affinités et n'atteint le Mana Parfait qu'EN COMBAT,
 *  en se dépassant. Son esprit (les « deux yeux ») se synchronise avec lui.
 *
 *  ▶ Mets le notetag <DonoBoss> sur l'ennemi Dono, <DonoEsprit> sur l'Esprit.
 *
 *  PHASES (selon les PV de Dono) :
 *   • 100–70 %  EMPATHIE   : il se retient (dégâts réduits, katana mesuré).
 *   • < 70 %    SÉRIEUX    : le masque tombe — vitesse & férocité Sekiro.
 *   • < 40 %    SYNCHRO    : parfaitement synchro avec son esprit ; il
 *                            ÉVOLUE à chaque tour (génie progressif, +stats).
 *   • < 15 %    ÉVEIL      : il libère le MANA PARFAIT (ignore tout).
 *
 *  Tant que l'Esprit Vengeur vit, Dono subit moins de dégâts (paranoïa/sync) :
 *  bats l'esprit pour le rendre vulnérable.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('DonoBoss');
    var EMP = parseInt(P['empathieState'] || 176);
    var SER = parseInt(P['serieuxState'] || 177);
    var EVE = parseInt(P['eveilState'] || 178);
    var SYNC = parseFloat(P['syncReduc'] || 0.70);

    function isDono(b) { return b && b.isEnemy && b.isEnemy() && b.enemy() && b.enemy().meta && b.enemy().meta.DonoBoss; }
    function isEsprit(b) { return b && b.isEnemy && b.isEnemy() && b.enemy() && b.enemy().meta && b.enemy().meta.DonoEsprit; }
    function espritVivant() {
        return $gameTroop && $gameTroop.members().some(function (m) { return isEsprit(m) && m.isAlive(); });
    }
    function log(text) {
        var s = SceneManager._scene;
        if (s && s._logWindow) { s._logWindow.push('addText', text); }
    }

    // Phases vérifiées à chaque tour de Dono
    var _makeActions = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function () {
        if (isDono(this)) this.donoPhaseCheck();
        _makeActions.call(this);
    };

    Game_Enemy.prototype.donoPhaseCheck = function () {
        var r = this.hpRate();
        if (this._donoPhase === undefined) { this._donoPhase = 0; this._donoEvolve = 0; }

        if (this._donoPhase < 1) {
            this.addState(EMP);
            log(this.name() + ' vous observe avec une étrange douceur…');
            this._donoPhase = 1;
        }
        if (r <= 0.70 && this._donoPhase < 2) {
            this.removeState(EMP); this.addState(SER);
            log('\\C[2]Le masque de ' + this.name() + ' tombe. « …Tu m\'obliges à être sérieux. »\\C[0]');
            this._donoPhase = 2;
        }
        if (r <= 0.40 && this._donoPhase < 3) {
            log('\\C[1]Son esprit et lui se synchronisent parfaitement. Il évolue à chaque échange…\\C[0]');
            this._donoPhase = 3;
        }
        if (r <= 0.15 && this._donoPhase < 4) {
            this.addState(EVE);
            log('\\C[14]★ ' + this.name() + ' se dépasse : il atteint enfin le MANA PARFAIT !\\C[0]');
            this._donoPhase = 4;
        }
        // Génie progressif : à partir de la phase 3, il monte en puissance
        if (this._donoPhase >= 3) {
            this._donoEvolve = Math.min((this._donoEvolve || 0) + 1, 25);
        }
    };

    // Génie progressif -> bonus de stats croissant (ATK & MAT)
    var _paramPlus = Game_Enemy.prototype.paramPlus;
    Game_Enemy.prototype.paramPlus = function (pid) {
        var v = _paramPlus.call(this, pid);
        if (isDono(this) && this._donoEvolve && (pid === 2 || pid === 4)) {
            v += this._donoEvolve * 6;
        }
        return v;
    };

    // Synchronisation : Dono subit moins de dégâts tant que l'Esprit vit
    var _makeDamage = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var value = _makeDamage.call(this, target, critical);
        if (value > 0 && isDono(target) && espritVivant()) {
            value = Math.floor(value * SYNC);
        }
        return value;
    };

    // Quand l'Esprit meurt : Dono perd sa protection (message)
    var _die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function () {
        var wasEsprit = isEsprit(this);
        _die.call(this);
        if (wasEsprit) {
            log('\\C[2]L\'Esprit Vengeur se dissipe… La paranoïa de Dono se fissure : il est vulnérable !\\C[0]');
        }
    };

})();
