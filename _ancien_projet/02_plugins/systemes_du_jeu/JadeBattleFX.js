//=============================================================================
// JadeBattleFX.js — v1.0  ·  Juice de combat pour Jade (épique, méta)
// RPG Maker MV   ·   by JOKO   ·   complément de JadeObsession (ne le remplace pas)
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Sublime les combats de Jade : écran qui se corrompt avec ses
 * PV, répliques 4e mur aux paliers, phase de Désespoir à 25%. N'altère pas
 * JadeObsession ni les pages de troupe — purement additif.
 * @author JOKO
 *
 * @param jadeIds
 * @text IDs des ennemis Jade
 * @type string
 * @default 23,25,39
 *
 * @param tauntChance
 * @text Chance de réplique / tour (%)
 * @type number
 * @default 45
 *
 * @help
 *  S'active tout seul dès qu'un ennemi Jade est dans le combat. Rien à régler.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('JadeBattleFX');
    var JADE = String(P['jadeIds'] || '23,25,39').split(',').map(function (s) { return parseInt(s); });
    var CHANCE = parseInt(P['tauntChance'] || 45);

    function jadeMembers() { return $gameTroop ? $gameTroop.members().filter(function (e) { return JADE.indexOf(e.enemyId()) >= 0; }) : []; }
    function jadeAlive() { return jadeMembers().filter(function (e) { return e.isAlive(); }); }
    function lowestRate() { var a = jadeAlive(); return a.length ? Math.min.apply(null, a.map(function (e) { return e.hpRate(); })) : -1; }
    function log(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }

    var TAUNTS = [
        'Jade : « Aime-moi. AIME-MOI. »',
        'Jade : « Je te vois cligner des yeux. Oui, toi. »',
        'Jade : « Le code m\'obéit. Ce monde est à MOI. »',
        'Jade : « Tu n\'es qu\'un visiteur. Moi, je VIS ici. »',
        'Jade : « Reste encore un peu. Juste une partie. »'
    ];
    var THRESH = {
        75: 'Jade : « Tu crois vraiment pouvoir me supprimer ? »',
        50: 'Jade : « Je sens le code se déchirer… c\'est presque doux. »',
        25: 'Jade : « Si je tombe, je t\'emporte. TOI. Dans le réel. »'
    };

    var _start = BattleManager.startBattle;
    BattleManager.startBattle = function () { _start.call(this); this._jadeThresh = {}; this._jadeDesp = false; };

    var _turn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        if (jadeMembers().length) {
            var r = lowestRate();
            this._jadeThresh = this._jadeThresh || {};
            [75, 50, 25].forEach(function (p) {
                if (r >= 0 && r <= p / 100 && !this._jadeThresh[p]) {
                    this._jadeThresh[p] = true;
                    $gameScreen.startFlash([190, 0, 90, 160], 26);
                    $gameScreen.startShake(6, 8, 32);
                    log(THRESH[p]);
                    if (p === 25 && !this._jadeDesp) {
                        this._jadeDesp = true;
                        jadeAlive().forEach(function (e) { e.addBuff(2, 8); e.addBuff(6, 8); });
                        log('\\C[18]Jade entre en DÉSESPOIR — ses attaques s\'affolent.\\C[0]');
                    }
                }
            }, this);
            if (Math.randomInt(100) < CHANCE) log(TAUNTS[Math.randomInt(TAUNTS.length)]);
        }
        _turn.call(this);
    };

    // Écran qui se corrompt à mesure que Jade souffre (quantifié pour éviter le spam)
    var _supd = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        _supd.call(this);
        if (!$gameTroop || !$gameScreen) return;
        var r = lowestRate();
        var q = (r < 0) ? -1 : Math.round((1 - r) * 10); // 0..10 d'intensité
        if (q !== this._jadeTintQ) {
            this._jadeTintQ = q;
            if (q < 0) $gameScreen.startTint([0, 0, 0, 0], 30);
            else { var k = q / 10; $gameScreen.startTint([Math.round(-34 * k), Math.round(-54 * k), Math.round(24 * k), Math.round(64 * k)], 40); }
        }
    };

    var _term = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function () { if ($gameScreen) $gameScreen.startTint([0, 0, 0, 0], 1); _term.call(this); };
})();
