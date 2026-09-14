//=============================================================================
// RelicPassifs.js — v1.0  ·  Passifs des Reliques & Talismans
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Passifs uniques des reliques équipées (notetag <Relic: x>) :
 * vol de vie, rage à bas PV, épines, gain d'âmes, soin d'ouverture.
 * @author JOKO
 *
 * @param soulVar
 * @text Variable — Âmes
 * @type variable
 * @default 15
 *
 * @help
 *  Sur une armure/accessoire (Note) :
 *      <Relic: lifesteal>   soigne 20% des dégâts infligés
 *      <Relic: lowhp>       +50% de dégâts quand PV < 30%
 *      <Relic: thorns>      renvoie 25% des dégâts physiques subis
 *      <Relic: soulgain>    +1 âme par ennemi vaincu
 *      <Relic: firstaid>    soigne 20% des PV au début du combat
 *  (Les autres passifs — crit, agilité, contre, régén PM — sont des traits
 *   d'équipement classiques, sans plugin.)
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('RelicPassifs');
    var SOUL = parseInt(P['soulVar'] || 15);

    function hasRelic(battler, type) {
        if (!battler || !battler.isActor || !battler.isActor() || !battler.armors) return false;
        return battler.armors().some(function (a) { return a && a.meta && a.meta.Relic && String(a.meta.Relic).trim() === type; });
    }
    function partyHasRelic(type) {
        return $gameParty.battleMembers().some(function (a) { return hasRelic(a, type); });
    }

    // lowhp : +50% de dégâts sous 30% PV
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, crit) {
        var v = _mdv.call(this, target, crit);
        var s = this.subject();
        if (v > 0 && hasRelic(s, 'lowhp') && s.hpRate() < 0.30) v = Math.floor(v * 1.5);
        return v;
    };

    // lifesteal + thorns
    var _exec = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _exec.call(this, target, value);
        if (value <= 0) return;
        var s = this.subject();
        // Vol de vie
        if (hasRelic(s, 'lifesteal') && s.isAlive()) {
            var heal = Math.floor(value * 0.20);
            if (heal > 0) {
                s.gainHp(heal);
                var lw = SceneManager._scene && SceneManager._scene._logWindow;
                if (lw) lw.push('addText', s.name() + ' draine ' + heal + ' PV (relique).');
            }
        }
        // Épines : la cible (héros) renvoie 25% des dégâts physiques
        if (this.isPhysical && this.isPhysical() && hasRelic(target, 'thorns') && s && s.isEnemy && s.isEnemy() && s.isAlive()) {
            var ref = Math.max(1, Math.floor(value * 0.25));
            s.gainHp(-ref); s.startDamagePopup();
        }
    };

    // soulgain : +1 âme par ennemi vaincu (si un héros équipe la relique)
    var _die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function () {
        _die.call(this);
        if (this.isEnemy && this.isEnemy() && partyHasRelic('soulgain') && $gameVariables) {
            $gameVariables.setValue(SOUL, $gameVariables.value(SOUL) + 1);
        }
    };

    // firstaid : soin d'ouverture de combat
    var _startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _startBattle.call(this);
        $gameParty.battleMembers().forEach(function (a) {
            if (hasRelic(a, 'firstaid')) a.gainHp(Math.floor(a.mhp * 0.20));
        });
    };
})();
