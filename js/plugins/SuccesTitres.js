//=============================================================================
// SuccesTitres.js — v1.0  ·  Succès / Titres (achievements)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Succès débloquables avec écran dédié + entrée menu.
 * @author JOKO
 *
 * @param menuCommand
 * @text Entrée Menu (vide = aucune)
 * @type string
 * @default Succès
 *
 * @help
 *  Débloque un succès dans un événement :
 *      SUCCES unlock <id>
 *      SUCCES ecran            (ouvre la liste)
 *  IDs disponibles (modifiable dans le code, tableau LIST) :
 *    1 premier_sang  2 ame_collectee  3 feu_dame  4 dual  5 combo
 *    6 faction  7 forge  8 boss  9 ng_plus  10 lien_max
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('SuccesTitres');
    var MENU = String(P['menuCommand'] || 'Succès');

    var LIST = [
        { id: 1,  nom: 'Premier Sang',        desc: 'Remporter ton premier combat.' },
        { id: 2,  nom: 'Glaneur d\'Âmes',     desc: 'Absorber ta première âme.' },
        { id: 3,  nom: 'Au coin du Feu',      desc: 'Te reposer à un Feu d\'Âme.' },
        { id: 4,  nom: 'Double Nature',       desc: 'Découvrir une affinité duale.' },
        { id: 5,  nom: 'Coeurs Unis',         desc: 'Déclencher un combo d\'équipe.' },
        { id: 6,  nom: 'Allégeance',          desc: 'Rejoindre une faction.' },
        { id: 7,  nom: 'Âme Forgée',          desc: 'Renforcer un héros à la Forge.' },
        { id: 8,  nom: 'Briseur de Légende',  desc: 'Vaincre un boss majeur.' },
        { id: 9,  nom: 'Éternel Recommencement', desc: 'Lancer un New Game +.' },
        { id: 10, nom: 'Lien Indéfectible',   desc: 'Atteindre un Lien maximal.' }
    ];

    function store() {
        if (!$gameSystem) return {};
        if (!$gameSystem._succes) $gameSystem._succes = {};
        return $gameSystem._succes;
    }
    function unlock(id) {
        var s = store();
        if (!s[id]) {
            s[id] = true;
            var a = LIST.filter(function (x) { return x.id === id; })[0];
            if (a && $gameMessage) $gameMessage.add('\\C[14]★ Succès débloqué : ' + a.nom + ' !\\C[0]');
        }
    }

    function Window_Succes() { this.initialize.apply(this, arguments); }
    Window_Succes.prototype = Object.create(Window_Selectable.prototype);
    Window_Succes.prototype.constructor = Window_Succes;
    Window_Succes.prototype.initialize = function () {
        Window_Selectable.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.refresh(); this.activate();
    };
    Window_Succes.prototype.maxItems = function () { return LIST.length; };
    Window_Succes.prototype.itemHeight = function () { return this.lineHeight() * 2; };
    Window_Succes.prototype.drawItem = function (index) {
        var a = LIST[index], r = this.itemRect(index), got = !!store()[a.id];
        this.changeTextColor(got ? this.textColor(14) : this.textColor(7));
        this.drawText((got ? '★ ' : '☆ ') + a.nom, r.x + 6, r.y, r.width - 12);
        this.changeTextColor(this.textColor(got ? 0 : 8));
        this.drawText(got ? a.desc : '— verrouillé —', r.x + 24, r.y + this.lineHeight(), r.width - 30);
        this.resetTextColor();
    };
    Window_Succes.prototype.refresh = function () {
        this.createContents();
        for (var i = 0; i < this.maxItems(); i++) this.drawItem(i);
    };

    function Scene_Succes() { this.initialize.apply(this, arguments); }
    window.Scene_Succes = Scene_Succes;
    Scene_Succes.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Succes.prototype.constructor = Scene_Succes;
    Scene_Succes.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._w = new Window_Succes();
        this._w.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._w);
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'SUCCES') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'unlock') unlock(parseInt(args[1]));
        else if (sub === 'ecran') SceneManager.push(Scene_Succes);
    };

    if (MENU.length > 0) {
        var _add = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            _add.call(this); this.addCommand(MENU, 'succesTitres', true);
        };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _cw.call(this);
            this._commandWindow.setHandler('succesTitres', function () { SceneManager.push(Scene_Succes); });
        };
    }
})();
