//=============================================================================
// JosuMirror.js — v1.0  ·  Josu, le Miroir de Thylane (Joie destructrice)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Josu : plus on le frappe, plus sa JOIE monte (il devient
 * fort/agressif). Refuse de le frapper et sa joie retombe → le masque tombe,
 * il s'expose (Le Vide). Le contraste de Thylane. Additif.
 * @author JOKO
 *
 * @param josuId
 * @text ID ennemi — Josu
 * @type number
 * @default 76
 *
 * @param euphState
 * @text État Euphorie
 * @type state
 * @default 186
 *
 * @param videState
 * @text État Le Vide
 * @type state
 * @default 187
 *
 * @help
 *  Jauge de JOIE (0-100, départ 50).
 *  • Chaque coup encaissé : +Joie (« Encore ! Encore ! »).
 *  • Aucun coup pendant un tour : -Joie (l'amusement retombe).
 *  • Joie haute (>=80) : EUPHORIE — plus rapide, frappe bien plus fort.
 *  • Joie basse (<=20) : LE VIDE — le masque tombe, il subit +45% de dégâts.
 *  Sa force est proportionnelle à sa joie : l'achever exige de l'affamer d'abord.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('JosuMirror');
    var JID = parseInt(P['josuId'] || 76);
    var EUPH = parseInt(P['euphState'] || 186);
    var VIDE = parseInt(P['videState'] || 187);

    function isJosu(b) { return b && b.isEnemy && b.isEnemy() && b.enemyId() === JID; }
    function getJosu() { return $gameTroop ? $gameTroop.aliveMembers().filter(isJosu)[0] : null; }
    function log(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }
    function joie(b) { if (b._joie == null) b._joie = 50; return b._joie; }

    // Force proportionnelle à la joie (0.55x à vide → 1.6x en euphorie)
    var _pb = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function (pid) {
        var v = _pb.call(this, pid);
        if ((pid === 2 || pid === 4) && isJosu(this)) v *= (0.55 + joie(this) / 100 * 1.05);
        return Math.round(v);
    };

    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        var j = getJosu();
        if (j) {
            joie(j);
            if (!j._joieHit) {                               // personne ne l'a frappé : l'ennui le gagne
                j._joie = Math.max(0, j._joie - 14);
                if (j._joie <= 35) log('\\C[8]' + j.name() + ' : « …pourquoi vous ne jouez plus avec moi ? »\\C[0]');
            }
            j._joieHit = false;
            // états selon la joie
            j.removeState(EUPH); j.removeState(VIDE);
            if (j._joie >= 80) { j.addState(EUPH); log('\\C[14]' + j.name() + ' est EUPHORIQUE — il en redemande !\\C[0]'); }
            else if (j._joie <= 20) { j.addState(VIDE); log('\\C[8]Le masque de ' + j.name() + ' tombe. Le vide le rattrape. (Il s\'expose.)\\C[0]'); }
            j.refresh();
        }
        _startTurn.call(this);
    };

    var _exec = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        if (isJosu(target) && value > 0) {
            joie(target);
            if (target._joie <= 20) value = Math.round(value * 1.45);   // Le Vide : vulnérable
            target._joieHit = true;
            var before = target._joie;
            target._joie = Math.min(100, target._joie + 16);            // sa joie grimpe sous les coups
            if (Math.randomInt(100) < 45) log('\\C[14]' + target.name() + ' : « Encore ! ENCORE ! »\\C[0]');
        }
        _exec.call(this, target, value);
    };
})();
