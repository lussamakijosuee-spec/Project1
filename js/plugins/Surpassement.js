//=============================================================================
// Surpassement.js — v1.0  ·  Le sens en mécanique : dompter sa facette
// RPG Maker MV   ·   by JOKO   ·   s'appuie sur JadeEntitePlunging (Santé Mentale)
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Quand un héros atteint la Maîtrise mentale, il SE DÉPASSE
 * (état bonus + moment narratif). Quand sa facette l'emporte, elle se manifeste.
 * La morale du jeu, rendue mécanique. Additif.
 * @author JOKO
 *
 * @param rewardState
 * @text État « Surpassé » (récompense)
 * @type state
 * @default 188
 *
 * @help
 *  Lit la jauge de Santé Mentale (var 11-14, 1-10) de chaque héros.
 *  • Maîtrise (9-10) → il dompte sa facette : état « Surpassé » (+stats/+crit),
 *    et la 1re fois, un message de croissance permanent.
 *  • Effondrement/Instable (1-2) → sa facette se manifeste (réplique thématique).
 *  Aucune configuration. Compatible avec le système de phases existant.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('Surpassement');
    var REWARD = parseInt(P['rewardState'] || 188);

    // héros -> { var de Santé Mentale, nom de la facette domptée, manifestation de l'excès }
    var FACETS = {
        1: { v: 11, maitrise: 'a dompté sa colère', exces: 'La colère brûle dans les yeux de %1.' },
        2: { v: 12, maitrise: 'a retrouvé sa concentration', exces: '%1 perd le fil. Son esprit s\'éparpille.' },
        3: { v: 13, maitrise: 'a trouvé son équilibre', exces: '%1 ne se retient plus. Quelque chose déborde.' },
        4: { v: 14, maitrise: 'a trouvé sa confiance', exces: '%1 doute. « …et si je n\'y arrivais pas ? »' }
    };
    function gauge(v) { return ($gameVariables ? $gameVariables.value(v) : 7); }
    function log(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }

    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        $gameParty.battleMembers().forEach(function (a) {
            var f = FACETS[a.actorId()]; if (!f) return;
            var g = gauge(f.v);
            if (g >= 9) {                                        // MAÎTRISE -> dépassement
                if (!a.isStateAffected(REWARD)) {
                    a.addState(REWARD);
                    log('\\C[14]★ ' + a.name() + ' ' + f.maitrise + ' — elle se dépasse.\\C[0]');
                    // premier dépassement de la partie : note de croissance
                    $gameSystem._surpasse = $gameSystem._surpasse || {};
                    if (!$gameSystem._surpasse[a.actorId()]) {
                        $gameSystem._surpasse[a.actorId()] = true;
                        log('\\C[6]Quelque part, quelqu\'un sourit. Fier d\'elle.\\C[0]');
                    }
                }
            } else {
                a.removeState(REWARD);
                if (g <= 2 && Math.randomInt(100) < 40) log('\\C[8]' + f.exces.replace('%1', a.name()) + '\\C[0]');
            }
        });
        _startTurn.call(this);
    };
})();
