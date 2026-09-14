//=============================================================================
// QuestJournal.js — v1.0  ·  Journal de Quêtes
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Journal de quêtes (principale & secondaires) : objectifs,
 * suivi, statut, quête traquée. Écran dédié + entrée menu.
 * @author JOKO
 *
 * @param menuCommand
 * @text Entrée menu (vide = aucune)
 * @type string
 * @default Journal
 *
 * @param showTracker
 * @text Afficher le suivi sur la carte
 * @type boolean
 * @default true
 *
 * @help
 * ──────────────────────────────────────────────────────────────────────────
 *  Commandes de plugin (les guillemets gèrent les espaces) :
 *    QUEST add main  <id> "Titre" "Description"
 *    QUEST add side  <id> "Titre" "Description"
 *    QUEST obj  <id> "Texte de l'objectif"        (en ajoute un)
 *    QUEST step <id> <n>                           (objectif n accompli, 1-based)
 *    QUEST step <id> next                          (accomplit le prochain objectif)
 *    QUEST done <id>        ·  QUEST fail <id>
 *    QUEST track <id>       ·  QUEST untrack
 *    QUEST ecran                                   (ouvre le journal)
 *  Scripts : $gameSystem.questDone('id')  ·  $gameSystem.questStatus('id')
 * ──────────────────────────────────────────────────────────────────────────
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('QuestJournal');
    var MENU = String(P['menuCommand'] || 'Journal');
    var TRACKER = String(P['showTracker'] || 'true') === 'true';

    function tokenize(str) {
        var re = /"([^"]*)"|(\S+)/g, m, out = [];
        while ((m = re.exec(str)) !== null) out.push(m[1] !== undefined ? m[1] : m[2]);
        return out;
    }

    //--- Modèle ---
    function store() { if (!$gameSystem._quests) { $gameSystem._quests = {}; $gameSystem._questOrder = []; } return $gameSystem._quests; }
    Game_System.prototype.quest = function (id) { return store()[id] || null; };
    Game_System.prototype.questStatus = function (id) { var q = this.quest(id); return q ? q.status : 'none'; };
    Game_System.prototype.questDone = function (id) { return this.questStatus(id) === 'done'; };
    Game_System.prototype.questList = function () { var s = store(); return ($gameSystem._questOrder || []).map(function (id) { return s[id]; }).filter(Boolean); };

    function add(type, id, title, desc) {
        var s = store();
        if (!s[id]) $gameSystem._questOrder.push(id);
        s[id] = { id: id, type: (type === 'main' ? 'main' : 'side'), title: title || id, desc: desc || '', objs: [], status: 'active' };
        if (!$gameSystem._track) $gameSystem._track = id;
        notify('\\C[14]Nouvelle quête : ' + s[id].title + '\\C[0]');
    }
    function obj(id, text) { var q = store()[id]; if (q) q.objs.push({ text: text, done: false }); }
    function step(id, n) {
        var q = store()[id]; if (!q) return;
        if (n === 'next') { for (var i = 0; i < q.objs.length; i++) if (!q.objs[i].done) { q.objs[i].done = true; break; } }
        else { var idx = parseInt(n) - 1; if (q.objs[idx]) q.objs[idx].done = true; }
    }
    function finish(id, ok) {
        var q = store()[id]; if (!q) return;
        q.status = ok ? 'done' : 'failed';
        if (ok) q.objs.forEach(function (o) { o.done = true; });
        if ($gameSystem._track === id) $gameSystem._track = nextActive();
        notify(ok ? '\\C[3]Quête accomplie : ' + q.title + '\\C[0]' : '\\C[18]Quête échouée : ' + q.title + '\\C[0]');
    }
    function nextActive() { var l = $gameSystem.questList().filter(function (q) { return q.status === 'active'; }); return l.length ? l[0].id : null; }
    function notify(t) { if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t); }

    //--- Suivi sur la carte ---
    function Window_QuestTracker() { this.initialize.apply(this, arguments); }
    Window_QuestTracker.prototype = Object.create(Window_Base.prototype);
    Window_QuestTracker.prototype.constructor = Window_QuestTracker;
    Window_QuestTracker.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, Graphics.boxWidth - 320, 0, 320, this.fittingHeight(3));
        this.opacity = 180; this._sig = ''; this.refresh();
    };
    Window_QuestTracker.prototype.refresh = function () {
        this.contents.clear();
        var q = $gameSystem._track ? $gameSystem.quest($gameSystem._track) : null;
        if (!q || q.status !== 'active') { this.visible = false; return; }
        this.visible = true;
        this.changeTextColor(this.textColor(q.type === 'main' ? 14 : 6));
        this.drawText((q.type === 'main' ? '◆ ' : '◇ ') + q.title, 0, 0, this.contentsWidth());
        this.resetTextColor();
        var cur = null; for (var i = 0; i < q.objs.length; i++) if (!q.objs[i].done) { cur = q.objs[i]; break; }
        if (cur) { this.changeTextColor(this.textColor(8)); this.drawText('• ' + cur.text, 8, this.lineHeight(), this.contentsWidth() - 8); this.resetTextColor(); }
    };
    Window_QuestTracker.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        var q = $gameSystem._track ? $gameSystem.quest($gameSystem._track) : null;
        var sig = q ? q.id + q.status + q.objs.filter(function (o) { return o.done; }).length : '';
        if (sig !== this._sig) { this._sig = sig; this.refresh(); }
    };
    if (TRACKER) {
        var _cAll = Scene_Map.prototype.createAllWindows;
        Scene_Map.prototype.createAllWindows = function () { _cAll.call(this); this._questTracker = new Window_QuestTracker(); this.addWindow(this._questTracker); };
        var _upMap = Scene_Map.prototype.update;
        Scene_Map.prototype.update = function () { _upMap.call(this); if (this._questTracker) this._questTracker.visible = !$gameMessage.isBusy() && this._questTracker.visible; };
    }

    //--- Écran du journal ---
    function Window_QuestList() { this.initialize.apply(this, arguments); }
    Window_QuestList.prototype = Object.create(Window_Selectable.prototype);
    Window_QuestList.prototype.constructor = Window_QuestList;
    Window_QuestList.prototype.initialize = function () {
        Window_Selectable.prototype.initialize.call(this, 0, 0, 320, Graphics.boxHeight);
        this.refresh(); this.select(0); this.activate();
    };
    Window_QuestList.prototype.makeData = function () {
        var all = $gameSystem.questList();
        var order = { main: 0, side: 1 };
        this._data = all.filter(function (q) { return q.status === 'active'; }).sort(function (a, b) { return order[a.type] - order[b.type]; })
            .concat(all.filter(function (q) { return q.status !== 'active'; }));
    };
    Window_QuestList.prototype.maxItems = function () { return this._data ? this._data.length : 0; };
    Window_QuestList.prototype.quest = function () { return this._data[this.index()]; };
    Window_QuestList.prototype.drawItem = function (i) {
        var q = this._data[i], r = this.itemRect(i);
        var col = q.status === 'done' ? 3 : q.status === 'failed' ? 18 : (q.type === 'main' ? 14 : 0);
        var mark = q.status === 'done' ? '✓ ' : q.status === 'failed' ? '✗ ' : (q.type === 'main' ? '◆ ' : '◇ ');
        this.changeTextColor(this.textColor(col));
        this.drawText(mark + q.title, r.x + 4, r.y, r.width - 8);
        this.resetTextColor();
    };
    Window_QuestList.prototype.refresh = function () { this.makeData(); this.createContents(); for (var i = 0; i < this.maxItems(); i++) this.drawItem(i); };

    function Window_QuestInfo() { this.initialize.apply(this, arguments); }
    Window_QuestInfo.prototype = Object.create(Window_Base.prototype);
    Window_QuestInfo.prototype.constructor = Window_QuestInfo;
    Window_QuestInfo.prototype.initialize = function (x) { Window_Base.prototype.initialize.call(this, x, 0, Graphics.boxWidth - x, Graphics.boxHeight); };
    Window_QuestInfo.prototype.setQuest = function (q) { if (this._q !== q) { this._q = q; this.refresh(); } };
    Window_QuestInfo.prototype.refresh = function () {
        this.contents.clear(); var q = this._q; if (!q) return;
        var w = this.contentsWidth(), y = 0;
        this.changeTextColor(this.textColor(q.type === 'main' ? 14 : 6));
        this.drawText((q.type === 'main' ? 'QUÊTE PRINCIPALE' : 'QUÊTE SECONDAIRE'), 0, y, w); y += this.lineHeight();
        this.resetTextColor();
        this.drawTextEx(q.title, 0, y); y += this.lineHeight() * 1.2;
        this.contents.fillRect(0, y, w, 1, this.textColor(8)); y += 8;
        y = this.drawWrapped(q.desc, 0, y) + 8;
        this.changeTextColor(this.systemColor()); this.drawText('Objectifs :', 0, y, w); this.resetTextColor(); y += this.lineHeight();
        q.objs.forEach(function (o) {
            this.changeTextColor(this.textColor(o.done ? 3 : 0));
            y = this.drawWrapped((o.done ? '✓ ' : '• ') + o.text, 8, y);
            this.resetTextColor();
        }, this);
        if (q.status !== 'active') {
            this.changeTextColor(this.textColor(q.status === 'done' ? 3 : 18));
            this.drawText(q.status === 'done' ? '— Accomplie —' : '— Échouée —', 0, this.contentsHeight() - this.lineHeight(), w, 'center');
            this.resetTextColor();
        }
    };
    Window_QuestInfo.prototype.drawWrapped = function (text, x, y) {
        var max = Math.floor((this.contentsWidth() - x) / 12), words = String(text).split(' '), line = '', self = this;
        words.forEach(function (wd) {
            if (!line) line = wd; else if ((line + ' ' + wd).length <= max) line += ' ' + wd;
            else { self.drawText(line, x, y, self.contentsWidth() - x); y += self.lineHeight(); line = wd; }
        });
        if (line) { this.drawText(line, x, y, this.contentsWidth() - x); y += this.lineHeight(); }
        return y;
    };

    function Scene_Quests() { this.initialize.apply(this, arguments); }
    window.Scene_Quests = Scene_Quests;
    Scene_Quests.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Quests.prototype.constructor = Scene_Quests;
    Scene_Quests.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._list = new Window_QuestList();
        this._list.setHandler('cancel', this.popScene.bind(this));
        this._list.setHandler('ok', this.onOk.bind(this));
        this.addWindow(this._list);
        this._info = new Window_QuestInfo(this._list.width);
        this.addWindow(this._info);
        if (this._list.maxItems() === 0) { this._empty = new Window_Base(0, 0, Graphics.boxWidth, this.fittingHeight ? 72 : 72); }
    };
    Scene_Quests.prototype.onOk = function () { var q = this._list.quest(); if (q) $gameSystem._track = q.id; this._list.activate(); };
    Scene_Quests.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (this._list && this._info) this._info.setQuest(this._list.quest());
    };

    //--- Commandes ---
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'QUEST') return;
        var t = tokenize(args.join(' ')), sub = (t[0] || '').toLowerCase();
        if (sub === 'add') add((t[1] || 'side').toLowerCase(), t[2], t[3], t[4]);
        else if (sub === 'obj') obj(t[1], t[2]);
        else if (sub === 'step') step(t[1], (t[2] || 'next'));
        else if (sub === 'done') finish(t[1], true);
        else if (sub === 'fail') finish(t[1], false);
        else if (sub === 'track') $gameSystem._track = t[1];
        else if (sub === 'untrack') $gameSystem._track = null;
        else if (sub === 'ecran') SceneManager.push(Scene_Quests);
    };
    if (MENU.length > 0) {
        var _add = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () { _add.call(this); this.addCommand(MENU, 'questJournal', true); };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () { _cw.call(this); this._commandWindow.setHandler('questJournal', function () { SceneManager.push(Scene_Quests); }); };
    }
})();
