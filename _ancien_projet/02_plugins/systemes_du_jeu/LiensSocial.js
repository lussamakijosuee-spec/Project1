//=============================================================================
// LiensSocial.js — v1.0  ·  Les Liens (Social Links à la Persona)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les Liens : approfondis tes liens avec les 4 héros via
 * les événements ; chaque palier donne des bonus de stats permanents.
 * @author JOKO
 *
 * @param maxLevel
 * @text Niveau de lien max
 * @type number
 * @default 10
 *
 * @param menuCommand
 * @text Entrée Menu (vide = aucune)
 * @type string
 * @default Liens
 *
 * @help
 *  Dans tes événements de dialogue/quête :
 *      LIEN up <clé> [n]     Renforce le lien (+n, défaut 1)
 *      LIEN set <clé> <v>    Fixe le niveau de lien
 *      LIEN ecran            Ouvre l'écran des Liens
 *  Clé = thylane / neyssa / lou / tianna (ou l'ID d'acteur).
 *
 *  Chaque niveau de lien donne au héros un bonus PERMANENT (PV + stats).
 *  Script : Lien.niveau('lou')
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('LiensSocial');
    var MAX = parseInt(P['maxLevel'] || 10);
    var MENU = String(P['menuCommand'] || 'Liens');
    var KEY = { thylane: 1, neyssa: 2, lou: 3, tianna: 4 };

    function resolve(k) {
        if (typeof k === 'number') return k;
        var s = String(k).toLowerCase().trim();
        if (KEY[s]) return KEY[s];
        var n = parseInt(s); return isNaN(n) ? 0 : n;
    }
    function store() {
        if (!$gameSystem) return {};
        if (!$gameSystem._liens) $gameSystem._liens = {};
        return $gameSystem._liens;
    }

    var Lien = {
        niveau: function (k) { var id = resolve(k); return store()[id] || 0; },
        set: function (k, v) {
            var id = resolve(k); if (!id) return;
            store()[id] = Math.max(0, Math.min(MAX, Math.round(v)));
            var a = $gameActors.actor(id); if (a) a.refresh();
            if (store()[id] >= MAX && window.Succes) window.Succes.unlock(10);
        },
        up: function (k, n) {
            var id = resolve(k); if (!id) return;
            var before = this.niveau(id);
            this.set(id, before + Math.abs(Number(n) || 1));
            var after = this.niveau(id);
            if (after > before) {
                var a = $gameActors.actor(id);
                $gameMessage.add('\\C[14]✦ Ton lien avec ' + (a ? a.name() : '') + ' se renforce ! (Niv. ' + after + ')\\C[0]');
            }
        }
    };
    window.Lien = Lien;

    // Bonus permanent par niveau de lien
    var BONUS = { 0: 25, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 1: 8 };
    var _pp = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function (pid) {
        var v = _pp.call(this, pid);
        var lv = store()[this.actorId()] || 0;
        if (lv > 0) v += (BONUS[pid] || 1) * lv;
        return v;
    };

    //--- Écran des Liens ---
    function Window_Liens() { this.initialize.apply(this, arguments); }
    Window_Liens.prototype = Object.create(Window_Base.prototype);
    Window_Liens.prototype.constructor = Window_Liens;
    Window_Liens.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.refresh();
    };
    Window_Liens.prototype.refresh = function () {
        this.contents.clear();
        this.changeTextColor(this.systemColor());
        this.drawText('— LES LIENS —', 0, 0, this.contentsWidth(), 'center');
        this.resetTextColor();
        var top = this.lineHeight() * 2, rowH = Math.floor((this.contentsHeight() - top) / 4);
        for (var i = 1; i <= 4; i++) {
            var a = $gameActors.actor(i); if (!a) continue;
            var y = top + (i - 1) * rowH, lv = store()[i] || 0;
            this.changeTextColor(this.normalColor());
            this.drawText(a.name(), 0, y, 220);
            this.changeTextColor(this.systemColor());
            this.drawText('Lien ' + lv + ' / ' + MAX, 0, y, this.contentsWidth(), 'right');
            var bw = this.contentsWidth() - 20, gy = y + this.lineHeight() + 6;
            this.contents.fillRect(0, gy, bw, 16, 'rgba(0,0,0,0.5)');
            this.contents.fillRect(1, gy + 1, Math.floor((bw - 2) * lv / MAX), 14, '#e84393');
            this.resetTextColor();
        }
    };
    function Scene_Liens() { this.initialize.apply(this, arguments); }
    window.Scene_Liens = Scene_Liens;
    Scene_Liens.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Liens.prototype.constructor = Scene_Liens;
    Scene_Liens.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._w = new Window_Liens(); this.addWindow(this._w);
    };
    Scene_Liens.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) {
            SoundManager.playCancel(); this.popScene();
        }
    };

    //--- Commande plugin + menu ---
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'LIEN') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'up') Lien.up(args[1], args[2]);
        else if (sub === 'set') Lien.set(args[1], args[2]);
        else if (sub === 'ecran') SceneManager.push(Scene_Liens);
    };
    if (MENU.length > 0) {
        var _add = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            _add.call(this); this.addCommand(MENU, 'liensSocial', true);
        };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _cw.call(this);
            this._commandWindow.setHandler('liensSocial', function () { SceneManager.push(Scene_Liens); });
        };
    }
})();
