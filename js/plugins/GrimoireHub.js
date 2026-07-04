//=============================================================================
// GrimoireHub.js — v1.0  ·  Le Grimoire (hub de tous les écrans du système)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ UNE entrée de menu « Grimoire » qui regroupe tous les
 * écrans (Triangle, Rangs, Marque, Destins, Corruption, Errance, Entraînement,
 * Codex) et désencombre le menu principal. Additif.
 * @author JOKO
 *
 * @param menuCommand
 * @text Entrée Menu
 * @type string
 * @default Grimoire
 *
 * @param masquerEntrees
 * @text Masquer les entrées individuelles ?
 * @type boolean
 * @on Oui (menu propre)
 * @off Non
 * @default true
 * @desc Retire du menu principal les entrées Corruption/Errance/Triangle/Rangs/Marque/Codex (tout est dans le Grimoire).
 *
 * @help
 *  À charger EN DERNIER (après tous les plugins d'écrans).
 *
 *  Le Grimoire liste automatiquement les écrans disponibles — un plugin
 *  désactivé disparaît de la liste tout seul :
 *      Le Triangle        (TriangleAffinites)
 *      Les Rangs          (RangsPuissance)
 *      La Marque          (MarqueVivante)
 *      Les Destins        (DestinsParalleles)
 *      L'Entraînement     (PortesProgression)
 *      La Corruption      (CorruptionAme)
 *      L'Errance          (Errance)
 *      Le Codex du Mana   (ManaCodex)
 *
 *  Commande de plugin :  GRIMOIRE
 *  Si « masquer » est actif, les entrées individuelles de ces écrans sont
 *  retirées du menu principal (leurs commandes de plugin marchent toujours).
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('GrimoireHub');
    var MENU = String(P['menuCommand'] || 'Grimoire');
    var MASQUER = String(P['masquerEntrees'] || 'true') === 'true';

    // [libellé, nom de la scène globale]
    var PAGES = [
        ['Le Triangle',      'Scene_Triangle'],
        ['Les Rangs',        'Scene_Rangs'],
        ['La Marque',        'Scene_Marque'],
        ['Les Destins',      'Scene_Destins'],
        ['L\'Entraînement',  'Scene_Portes'],
        ['La Corruption',    'Scene_Corruption'],
        ['L\'Errance',       'Scene_Errance'],
        ['Le Codex du Mana', 'Scene_ManaCodex']
    ];
    function dispo() {
        return PAGES.filter(function (p) { return typeof window[p[1]] === 'function'; });
    }

    //--- Fenêtre de commandes du Grimoire ---
    function Window_Grimoire() { this.initialize.apply(this, arguments); }
    Window_Grimoire.prototype = Object.create(Window_Command.prototype);
    Window_Grimoire.prototype.constructor = Window_Grimoire;
    Window_Grimoire.prototype.initialize = function () {
        var w = 400;
        var x = (Graphics.boxWidth - w) / 2;
        Window_Command.prototype.initialize.call(this, x, 0);
        this.updatePlacement();
    };
    Window_Grimoire.prototype.windowWidth = function () { return 400; };
    Window_Grimoire.prototype.updatePlacement = function () {
        this.y = Math.max(0, (Graphics.boxHeight - this.height) / 2);
    };
    Window_Grimoire.prototype.makeCommandList = function () {
        dispo().forEach(function (p) { this.addCommand(p[0], p[1], true); }, this);
    };

    //--- Scène ---
    function Scene_Grimoire() { this.initialize.apply(this, arguments); }
    window.Scene_Grimoire = Scene_Grimoire;
    Scene_Grimoire.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Grimoire.prototype.constructor = Scene_Grimoire;
    Scene_Grimoire.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._cmd = new Window_Grimoire();
        var self = this;
        dispo().forEach(function (p) {
            self._cmd.setHandler(p[1], function () { SceneManager.push(window[p[1]]); });
        });
        this._cmd.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._cmd);
        // Titre au-dessus
        this._titre = new Window_Base(this._cmd.x, this._cmd.y - 64, this._cmd.width, 60);
        this._titre.contents.fontSize = 20;
        this._titre.changeTextColor('#EBC974');
        this._titre.drawText('— LE GRIMOIRE —', 0, 0, this._titre.contentsWidth(), 'center');
        this.addWindow(this._titre);
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() === 'GRIMOIRE') SceneManager.push(Scene_Grimoire);
    };

    // Entrée de menu unique
    if (MENU.length > 0) {
        var _add = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            _add.call(this);
            this.addCommand(MENU, 'grimoireHub', true);
        };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _cw.call(this);
            this._commandWindow.setHandler('grimoireHub', function () { SceneManager.push(Scene_Grimoire); });
        };
    }

    // Désencombrer le menu : filtrer les entrées individuelles (leurs commandes
    // de plugin restent utilisables).
    if (MASQUER) {
        var CACHES = ['corruptionAme', 'errance', 'triangleAffinites', 'rangsPuissance', 'marqueVivante', 'manaCodex'];
        var _addCommand = Window_MenuCommand.prototype.addCommand;
        Window_MenuCommand.prototype.addCommand = function (name, symbol, enabled, ext) {
            if (CACHES.indexOf(symbol) >= 0) return;
            _addCommand.call(this, name, symbol, enabled, ext);
        };
    }
})();
