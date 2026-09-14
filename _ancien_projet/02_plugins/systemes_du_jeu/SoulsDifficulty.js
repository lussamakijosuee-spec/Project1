//=============================================================================
// SoulsDifficulty.js — v1.0  ·  Difficulté façon Elden Ring
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Difficulté souls (Histoire/Normal/Elden/Cauchemar) : ennemis
 * plus résistants et bien plus dangereux, soin en combat réduit. Menu + commande.
 * @author JOKO
 *
 * @param defaultTier
 * @text Difficulté par défaut
 * @type select
 * @option histoire
 * @option normal
 * @option elden
 * @option cauchemar
 * @default elden
 *
 * @param menuCommand
 * @text Entrée menu (vide = aucune)
 * @type string
 * @default Difficulté
 *
 * @help
 *  Échelonne TOUS les ennemis (PV, attaque) et les dégâts subis par l'équipe.
 *  Le soin en combat est réduit aux paliers durs (le repos au Feu d'Âme reste
 *  pleinement efficace). Change via le menu « Difficulté » ou : DIFFICULTE elden.
 *  Script : $gameSystem.difficulty()
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('SoulsDifficulty');
    var DEF = String(P['defaultTier'] || 'elden');
    var MENU = String(P['menuCommand'] || 'Difficulté');

    // hp = mult PV ennemis · atk = mult ATQ/MAG ennemis · dmg = mult dégâts subis
    // heal = mult soin reçu en combat
    var TIERS = {
        histoire:  { name: 'Histoire',  hp: 0.6, atk: 0.7, dmg: 0.65, heal: 1.2, col: 3 },
        normal:    { name: 'Normal',    hp: 1.0, atk: 1.0, dmg: 1.0,  heal: 1.0, col: 0 },
        elden:     { name: 'Elden',     hp: 2.2, atk: 1.6, dmg: 1.6,  heal: 0.7, col: 17 },
        cauchemar: { name: 'Cauchemar', hp: 3.6, atk: 2.3, dmg: 2.1,  heal: 0.5, col: 18 }
    };
    var ORDER = ['histoire', 'normal', 'elden', 'cauchemar'];

    Game_System.prototype.difficulty = function () { return this._difficulty || DEF; };
    Game_System.prototype.setDifficulty = function (t) { if (TIERS[t]) this._difficulty = t; };
    function T() { return TIERS[($gameSystem && $gameSystem.difficulty()) || DEF] || TIERS.normal; }

    // --- Ennemis plus durs (PV + ATQ/MAG) ---
    var _eParamBase = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function (paramId) {
        var v = _eParamBase.call(this, paramId), t = T();
        if (paramId === 0) v *= t.hp;            // MHP
        else if (paramId === 2 || paramId === 4) v *= t.atk;  // ATK, MAT
        return Math.round(v);
    };

    // --- Dégâts subis par l'équipe amplifiés ---
    var _exec = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        var s = this.subject();
        if (value > 0 && target && target.isActor && target.isActor() && s && s.isEnemy && s.isEnemy()) {
            value = Math.round(value * T().dmg);
        }
        _exec.call(this, target, value);
    };

    // --- Soin en combat réduit (le Feu d'Âme hors combat reste intact) ---
    var _recHp = Game_Action.prototype.itemEffectRecoverHp;
    Game_Action.prototype.itemEffectRecoverHp = function (target, effect) {
        if ($gameParty.inBattle()) {
            var h = T().heal;
            var orig = effect.value1, orig2 = effect.value2;
            effect = { code: effect.code, dataId: effect.dataId, value1: effect.value1 * h, value2: effect.value2 * h };
        }
        _recHp.call(this, target, effect);
    };

    //--- Écran de difficulté ---
    function Scene_Difficulty() { this.initialize.apply(this, arguments); }
    window.Scene_Difficulty = Scene_Difficulty;
    Scene_Difficulty.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Difficulty.prototype.constructor = Scene_Difficulty;
    Scene_Difficulty.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._help = new Window_Base(0, 0, Graphics.boxWidth, 120);
        this.addWindow(this._help);
        this._cmd = new Window_DifficultyList(0, 120);
        this._cmd.setHandler('ok', this.onOk.bind(this));
        this._cmd.setHandler('cancel', this.popScene.bind(this));
        this._cmd.setHandler('select', this.refreshHelp.bind(this));
        this.addWindow(this._cmd);
        this.refreshHelp();
    };
    Scene_Difficulty.prototype.refreshHelp = function () {
        var t = TIERS[ORDER[this._cmd.index()]];
        this._help.contents.clear();
        this._help.changeTextColor(this._help.textColor(t.col));
        this._help.drawText('— ' + t.name + ' —', 0, 0, this._help.contentsWidth(), 'center');
        this._help.resetTextColor();
        this._help.drawText('PV ennemis ×' + t.hp + '   Attaque ×' + t.atk, 0, 36, this._help.contentsWidth(), 'center');
        this._help.drawText('Dégâts subis ×' + t.dmg + '   Soin en combat ×' + t.heal, 0, 64, this._help.contentsWidth(), 'center');
    };
    Scene_Difficulty.prototype.onOk = function () {
        $gameSystem.setDifficulty(ORDER[this._cmd.index()]);
        SoundManager.playEquip(); this._cmd.refresh(); this.refreshHelp(); this._cmd.activate();
    };

    function Window_DifficultyList() { this.initialize.apply(this, arguments); }
    Window_DifficultyList.prototype = Object.create(Window_Command.prototype);
    Window_DifficultyList.prototype.constructor = Window_DifficultyList;
    Window_DifficultyList.prototype.initialize = function (x, y) { Window_Command.prototype.initialize.call(this, x, y); };
    Window_DifficultyList.prototype.windowWidth = function () { return Graphics.boxWidth; };
    Window_DifficultyList.prototype.makeCommandList = function () {
        ORDER.forEach(function (k) {
            var t = TIERS[k], cur = $gameSystem && $gameSystem.difficulty() === k;
            this.addCommand((cur ? '★ ' : '   ') + t.name, k);
        }, this);
    };
    Window_DifficultyList.prototype.select = function (i) { Window_Command.prototype.select.call(this, i); if (this.active && this._handlers && this._handlers['select']) this._handlers['select'](); };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() === 'DIFFICULTE') { var t = (args[0] || '').toLowerCase(); if (TIERS[t]) $gameSystem.setDifficulty(t); }
    };
    if (MENU.length > 0) {
        var _add = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () { _add.call(this); this.addCommand(MENU, 'soulsDiff', true); };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () { _cw.call(this); this._commandWindow.setHandler('soulsDiff', function () { SceneManager.push(Scene_Difficulty); }); };
    }
})();
