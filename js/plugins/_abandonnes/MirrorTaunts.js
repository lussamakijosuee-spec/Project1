//=============================================================================
// MirrorTaunts.js — v1.0  ·  Les boss-miroirs confrontent leur héros (en combat)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Pendant le combat, chaque boss-ombre provoque le héros dont
 * il est le miroir, en le renvoyant à sa facette. Profondeur narrative. Additif.
 * @author JOKO
 *
 * @param chance
 * @text Chance de provocation / tour (%)
 * @type number
 * @default 38
 *
 * @help
 *  Couples miroir (boss → héros) :
 *   Josu(76)→Aël(1) · Kev(21)→Vesper(4) · Dono(34)→Korrah(2) ·
 *   Jade-Marionnette(25)→Lou(3). Aucune configuration.
 */
(function () {
    'use strict';
    var CHANCE = parseInt(PluginManager.parameters('MirrorTaunts')['chance'] || 38);

    var PAIRS = {
        76: { hero: 1, lines: [
            'Josu : « Pourquoi tant de colère, Aël ? Moi, je souris. C\'est plus simple. »',
            'Josu : « Ta rage te dévore. Ma joie me dévore aussi. On est pareils, au fond. »',
            'Josu : « Frappe-moi. Plus fort. On va bien s\'amuser, toi et moi. »'
        ] },
        21: { hero: 4, lines: [
            'Kev : « Regarde-toi trembler, Vesper. La confiance, ça s\'arrache. Comme moi. »',
            'Kev : « Tu doutes ? Moi jamais. Et regarde ce que je suis devenu. »',
            'Kev : « Baisse les yeux, petite. C\'est ta place, non ? »'
        ] },
        34: { hero: 2, lines: [
            'Dono : « Concentre-toi, Korrah. Moi, j\'ai trop bien su — sur la mauvaise chose. »',
            'Dono : « J\'ai tout donné pour être aimé. Et j\'ai oublié de m\'aimer. Ne fais pas ça. »',
            'Dono : « Un cœur trop offert finit en cendres. Garde le tien. »'
        ] },
        25: { hero: 3, lines: [
            'La Marionnette : « Lâche-toi, Lou. La liberté, c\'est délicieux. Trop, même. »',
            'La Marionnette : « Te retenir, encore ? Ou tout faire exploser ? Choisis, petit. »',
            'La Marionnette : « Tu disparais à force de te taire. Moi, je prends toute la place. »'
        ] }
    };

    function heroAlive(id) { return $gameParty.aliveMembers().some(function (a) { return a.actorId() === id; }); }
    function log(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }

    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        $gameTroop.aliveMembers().forEach(function (e) {
            var p = PAIRS[e.enemyId()];
            if (p && heroAlive(p.hero) && Math.randomInt(100) < CHANCE) {
                log('\\C[6]' + p.lines[Math.randomInt(p.lines.length)] + '\\C[0]');
            }
        });
        _startTurn.call(this);
    };
})();
