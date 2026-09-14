//=============================================================================
// RageBaitDuo.js — v1.0  ·  Régis & Quentin (boss duo rage-bait)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le duo Régis & Quentin : Régis provoque et fanfaronne
 * (beaucoup de PV, peu de menace) ; quand il tombe, Quentin entre en fureur.
 * @author JOKO
 *
 * @param regisId
 * @text ID ennemi — Régis
 * @type number
 * @default 73
 *
 * @param quentinId
 * @text ID ennemi — Quentin
 * @type number
 * @default 74
 *
 * @param enrageStateId
 * @text État de fureur (Quentin)
 * @type state
 * @default 7
 *
 * @param tauntChance
 * @text Chance de provocation / tour (%)
 * @type number
 * @default 60
 *
 * @help
 *  Place les deux dans une même troupe (ex. Troupe 501). Aucune configuration
 *  d'événement requise : le plugin gère les provocations et la fureur.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('RageBaitDuo');
    var REGIS = parseInt(P['regisId'] || 73);
    var QUENTIN = parseInt(P['quentinId'] || 74);
    var ENRAGE = parseInt(P['enrageStateId'] || 7);
    var CHANCE = parseInt(P['tauntChance'] || 60);

    var TAUNTS = [
        'Régis : « C\'est tout ce que tu as ? Lamentable. »',
        'Régis : « Je n\'ai même pas encore commencé à essayer. »',
        'Régis : « Quentin, occupe-toi de ça, je me lime les ongles. »',
        'Régis : « Tu transpires ? Déjà ? Hahaha, minable ! »',
        'Régis : « Vise-moi donc — ah non, tu n\'oserais pas. »'
    ];
    var HIT = ['Régis : « Même pas mal ! »', 'Régis : « Tu m\'as décoiffé, sale brute ! »', 'Régis : « C\'était de la triche ! »'];

    function log(msg) {
        var w = BattleManager._logWindow;
        if (w) { w.push('addText', msg); w.push('wait'); }
    }
    function inTroop(id) { return $gameTroop.members().some(function (e) { return e.enemyId() === id; }); }
    function alive(id) { return $gameTroop.aliveMembers().some(function (e) { return e.enemyId() === id; }); }

    // Provocation en début de tour
    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        if (inTroop(REGIS) && alive(REGIS) && Math.randomInt(100) < CHANCE) log(TAUNTS[Math.randomInt(TAUNTS.length)]);
        _startTurn.call(this);
    };

    // Raillerie quand Régis encaisse un coup
    var _exec = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _exec.call(this, target, value);
        if (value > 0 && target.isEnemy && target.isEnemy() && target.enemyId() === REGIS && target.isAlive() && Math.randomInt(100) < 35) {
            log(HIT[Math.randomInt(HIT.length)]);
        }
    };

    // Quand Régis tombe -> Quentin entre en fureur
    var _die = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function () {
        var wasRegis = (this.enemyId() === REGIS);
        _die.call(this);
        if (wasRegis && inTroop(QUENTIN)) {
            var q = $gameTroop.aliveMembers().filter(function (e) { return e.enemyId() === QUENTIN; })[0];
            if (q && !q._duoEnraged) {
                q._duoEnraged = true;
                if (ENRAGE > 0) q.addState(ENRAGE);
                q.addBuff(2, 5); q.addBuff(6, 5);   // ATK & AGI +
                log('Quentin baisse la tête… puis relève des yeux GLACÉS.');
                log('Quentin : « Tu n\'aurais pas dû toucher à Régis. »');
            }
        }
    };
})();
