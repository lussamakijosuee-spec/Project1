//=============================================================================
// BestiaireAmes.js — v1.0  ·  Le Bestiaire (encyclopédie des ennemis)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Bestiaire qui se remplit au combat : stats, affinité de
 * Mana et lore de chaque ennemi rencontré. Entrée menu dédiée.
 * @author JOKO
 *
 * @param menuCommand
 * @text Entrée Menu (vide = aucune)
 * @type string
 * @default Bestiaire
 *
 * @help
 *  Chaque ennemi affronté est enregistré. Lore optionnel via la Note d'un
 *  ennemi :  <Lore: une phrase de description>
 *  Ouvrir :  BESTIAIRE   (ou entrée de menu)   ·   Script : $gameSystem.bestiaireSeen(id)
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('BestiaireAmes');
    var MENU = String(P['menuCommand'] || 'Bestiaire');
    var MANA = { negatif: 'Mana Négatif', positif: 'Mana Positif', spirituelle: 'Mana Spirituel', sombre: 'Mana Sombre', pur: 'Mana Pur', originel: 'Mana Originel' };
    var PN = ['PV', 'PM', 'ATQ', 'DÉF', 'MAG', 'DFM', 'AGI', 'CHA'];

    function seen() { if (!$gameSystem._bestiaire) $gameSystem._bestiaire = {}; return $gameSystem._bestiaire; }
    Game_System.prototype.bestiaireSeen = function (id) { return !!seen()[id]; };

    // Enregistrement au début du combat
    var _startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _startBattle.call(this);
        $gameTroop.members().forEach(function (e) { if (e.enemyId) seen()[e.enemyId] = true; });
    };

    function namedEnemies() {
        return $dataEnemies.filter(function (e) { return e && e.name && e.name.trim(); });
    }

    //--- Liste ---
    function Window_BestList() { this.initialize.apply(this, arguments); }
    Window_BestList.prototype = Object.create(Window_Selectable.prototype);
    Window_BestList.prototype.constructor = Window_BestList;
    Window_BestList.prototype.initialize = function () {
        Window_Selectable.prototype.initialize.call(this, 0, 0, 300, Graphics.boxHeight);
        this._data = namedEnemies(); this.refresh(); this.select(0); this.activate();
    };
    Window_BestList.prototype.maxItems = function () { return this._data ? this._data.length : 0; };
    Window_BestList.prototype.enemy = function () { return this._data[this.index()]; };
    Window_BestList.prototype.drawItem = function (i) {
        var e = this._data[i], r = this.itemRect(i), got = $gameSystem.bestiaireSeen(e.id);
        this.changeTextColor(got ? this.normalColor() : this.textColor(8));
        this.drawText(got ? e.name : '? ? ?', r.x + 4, r.y, r.width - 8);
        this.resetTextColor();
    };
    Window_BestList.prototype.refresh = function () { this.createContents(); for (var i = 0; i < this.maxItems(); i++) this.drawItem(i); };

    //--- Détail ---
    function Window_BestDetail() { this.initialize.apply(this, arguments); }
    Window_BestDetail.prototype = Object.create(Window_Base.prototype);
    Window_BestDetail.prototype.constructor = Window_BestDetail;
    Window_BestDetail.prototype.initialize = function (x) { Window_Base.prototype.initialize.call(this, x, 0, Graphics.boxWidth - x, Graphics.boxHeight); };
    Window_BestDetail.prototype.setEnemy = function (e) { this._enemy = e; this.refresh(); };
    Window_BestDetail.prototype.refresh = function () {
        this.contents.clear(); var e = this._enemy; if (!e) return;
        if (!$gameSystem.bestiaireSeen(e.id)) {
            this.changeTextColor(this.textColor(8)); this.drawText('Ennemi non encore rencontré.', 0, 0, this.contentsWidth(), 'center'); this.resetTextColor(); return;
        }
        var w = this.contentsWidth(), y = 0, lh = this.lineHeight();
        this.changeTextColor(this.systemColor()); this.drawText(e.name, 0, y, w, 'center'); this.resetTextColor(); y += lh * 1.4;
        // affinité de mana
        var mk = e.meta && e.meta.Mana ? String(e.meta.Mana).toLowerCase().trim() : '';
        this.changeTextColor(this.systemColor()); this.drawText('Affinité :', 0, y, 120);
        this.resetTextColor(); this.drawText(MANA[mk] || 'Neutre', 120, y, w - 120); y += lh;
        // stats (2 colonnes)
        for (var p = 0; p < 8; p++) {
            var cx = (p % 2) * (w / 2), cy = y + Math.floor(p / 2) * lh;
            this.changeTextColor(this.systemColor()); this.drawText(PN[p], cx, cy, 80);
            this.resetTextColor(); this.drawText(e.params[p], cx + 80, cy, 120);
        }
        y += lh * 4 + 8;
        this.contents.fillRect(0, y, w, 2, this.systemColor()); y += 8;
        // lore
        var lore = e.meta && e.meta.Lore ? String(e.meta.Lore) : 'Aucune information connue sur cette créature.';
        this.drawTextEx(lore, 0, y);
    };

    function Scene_Bestiaire() { this.initialize.apply(this, arguments); }
    window.Scene_Bestiaire = Scene_Bestiaire;
    Scene_Bestiaire.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Bestiaire.prototype.constructor = Scene_Bestiaire;
    Scene_Bestiaire.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._list = new Window_BestList();
        this._list.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._list);
        this._detail = new Window_BestDetail(this._list.width);
        this.addWindow(this._detail);
        this._list.setHandler('ok', function () { this._list.activate(); }.bind(this));
    };
    Scene_Bestiaire.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (this._list && this._detail && this._list.enemy() !== this._lastE) {
            this._lastE = this._list.enemy(); this._detail.setEnemy(this._lastE);
        }
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() === 'BESTIAIRE') SceneManager.push(Scene_Bestiaire);
    };
    if (MENU.length > 0) {
        var _add = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () { _add.call(this); this.addCommand(MENU, 'bestiaire', true); };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () { _cw.call(this); this._commandWindow.setHandler('bestiaire', function () { SceneManager.push(Scene_Bestiaire); }); };
    }
})();
