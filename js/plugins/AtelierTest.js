//=============================================================================
// AtelierTest.js — v1.0  ·  L'Atelier (outils de playtest)
// RPG Maker MV   ·   by JOKO   ·   PLAYTEST UNIQUEMENT (invisible en vrai jeu)
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Menu de test (playtest seulement) : régler toutes les
 * jauges, simuler les chutes, donner âmes/XP, tout purger — en deux clics.
 * @author JOKO
 *
 * @help
 *  UNIQUEMENT en test (lancement depuis l'éditeur). En jeu exporté, ce plugin
 *  ne fait strictement rien.
 *
 *  OUVRIR :  commande de plugin  ATELIER
 *            ou  F9 → rien à voir ; le plus simple : un événement de debug
 *            sur ta carte de test avec la commande ATELIER.
 *
 *  ACTIONS (appliquées à TOUT le groupe sauf mention) :
 *   · Corruption +25 / tout à 0
 *   · Errance +25 / tout à 0
 *   · Santé mentale -2 / au max
 *   · +20 âmes (Var 15)
 *   · +300 entraînement des 3 arts (Portes)
 *   · Simuler la chute d'un absent (Korrah→Bête, ludwing→Errant, Vesper→Dément)
 *   · Avancer les Destins de 50 battements
 *   · TOUT purger (jauges à zéro, tutos revus)
 *
 *  Chaque action joue un son et reste dans l'écran : enchaîne les réglages,
 *  puis va tester en combat.
 */
(function () {
    'use strict';

    function playtest() { return typeof Utils !== 'undefined' && Utils.isOptionValid('test'); }

    function chaqueHeros(fn) {
        [1, 2, 3, 4].forEach(function (id) { if ($gameActors && $gameActors.actor(id)) fn(id); });
    }
    function ok() { SoundManager.playOk(); }

    var ACTIONS = [
        ['Corruption +25 (tous)', function () { chaqueHeros(function (id) { if (window.Corruption) Corruption.add(id, 25); }); }],
        ['Corruption → 0 (tous)', function () { chaqueHeros(function (id) { if (window.Corruption) Corruption.purge(id, 999); }); }],
        ['Errance +25 (tous)', function () { chaqueHeros(function (id) { if (window.Errance) Errance.add(id, 25); }); }],
        ['Errance → 0 (tous)', function () { chaqueHeros(function (id) { if (window.Errance) Errance.purge(id, 999); }); }],
        ['Santé mentale -2 (tous)', function () { chaqueHeros(function (id) { if (window.Ame) Ame.mauvais(id, 2); }); }],
        ['Santé mentale → max (tous)', function () { chaqueHeros(function (id) { if (window.Ame) Ame.setJauge(id, 10); }); }],
        ['+20 âmes (Var 15)', function () { $gameVariables.setValue(15, $gameVariables.value(15) + 20); }],
        ['+300 entraînement des 3 arts', function () {
            chaqueHeros(function (id) {
                if (window.Portes) ['esprit', 'corps', 'ame'].forEach(function (a) { Portes.gagner(id, a, 300); });
            });
        }],
        ['Chute : Korrah → la Bête', function () { if (window.Corruption) Corruption.add(2, 999); }],
        ['Chute : ludwing → l\'Errant', function () { if (window.Errance) Errance.add(3, 999); }],
        ['Chute : Vesper → le Dément', function () { if (window.Ame) Ame.setJauge(4, 1); }],
        ['Destins : +50 battements', function () { if (window.Destins) Destins.tick(50); }],
        ['TOUT purger + tutos revus', function () {
            chaqueHeros(function (id) {
                if (window.Corruption) Corruption.purge(id, 999);
                if (window.Errance) Errance.purge(id, 999);
                if (window.Ame) Ame.setJauge(id, 10);
            });
            if ($gameSystem) { $gameSystem._tutosVus = {}; }
        }]
    ];

    function Window_Atelier() { this.initialize.apply(this, arguments); }
    Window_Atelier.prototype = Object.create(Window_Command.prototype);
    Window_Atelier.prototype.constructor = Window_Atelier;
    Window_Atelier.prototype.initialize = function () {
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = Math.max(0, (Graphics.boxHeight - this.height) / 2);
    };
    Window_Atelier.prototype.windowWidth = function () { return 480; };
    Window_Atelier.prototype.numVisibleRows = function () { return Math.min(13, ACTIONS.length); };
    Window_Atelier.prototype.makeCommandList = function () {
        ACTIONS.forEach(function (a, i) { this.addCommand(a[0], 'act' + i, true); }, this);
    };

    function Scene_Atelier() { this.initialize.apply(this, arguments); }
    window.Scene_Atelier = Scene_Atelier;
    Scene_Atelier.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Atelier.prototype.constructor = Scene_Atelier;
    Scene_Atelier.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._cmd = new Window_Atelier();
        var self = this;
        ACTIONS.forEach(function (a, i) {
            self._cmd.setHandler('act' + i, function () {
                try { a[1](); ok(); } catch (e) { SoundManager.playBuzzer(); }
                self._cmd.activate();
            });
        });
        this._cmd.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._cmd);
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'ATELIER') return;
        if (playtest()) SceneManager.push(Scene_Atelier);
    };

    // Entrée de menu, en playtest uniquement
    var _add = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        _add.call(this);
        if (playtest()) this.addCommand('⚙ Atelier', 'atelierTest', true);
    };
    var _cw = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        _cw.call(this);
        this._commandWindow.setHandler('atelierTest', function () { SceneManager.push(Scene_Atelier); });
    };
})();
