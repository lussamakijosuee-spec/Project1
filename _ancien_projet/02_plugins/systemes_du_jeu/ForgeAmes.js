//=============================================================================
// ForgeAmes.js — v1.0  ·  La Forge d'Âmes (souls-like weapon/stat upgrade)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Forge d'Âmes : dépense tes âmes (var 15) pour renforcer
 * définitivement les stats de tes héros, chez un PNJ forgeron.
 * @author JOKO
 *
 * @param soulVar
 * @text Variable — Âmes
 * @type variable
 * @default 15
 *
 * @param baseCost
 * @text Coût de base (en âmes)
 * @type number
 * @min 1
 * @default 5
 * @desc Coût du 1er renforcement d'une stat. Augmente à chaque niveau.
 *
 * @help
 *  Ouvre la forge depuis un événement « forgeron » :
 *      Plugin Command :  FORGE
 *  Tu choisis un héros puis une stat ; chaque renforcement coûte des âmes
 *  (coût croissant) et donne un bonus PERMANENT. Les âmes = ta monnaie souls.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('ForgeAmes');
    var SOUL = parseInt(P['soulVar'] || 15);
    var BASE = parseInt(P['baseCost'] || 5);
    var STATS = [[0, 'Vitalité (PV)'], [2, 'Force'], [3, 'Défense'], [4, 'Magie'], [5, 'Esprit'], [6, 'Agilité']];
    var GAIN = { 0: 60, 2: 8, 3: 8, 4: 8, 5: 8, 6: 6 };

    var _pp = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function (pid) {
        var v = _pp.call(this, pid);
        if (this._forgeBonus && this._forgeBonus[pid]) v += this._forgeBonus[pid];
        return v;
    };
    Game_Actor.prototype.forgeLevel = function (pid) { return (this._forgeLv && this._forgeLv[pid]) || 0; };
    Game_Actor.prototype.forgeCost = function (pid) { return BASE * (this.forgeLevel(pid) + 1); };
    Game_Actor.prototype.applyForge = function (pid) {
        this._forgeBonus = this._forgeBonus || {}; this._forgeLv = this._forgeLv || {};
        this._forgeBonus[pid] = (this._forgeBonus[pid] || 0) + (GAIN[pid] || 5);
        this._forgeLv[pid] = (this._forgeLv[pid] || 0) + 1;
        this.refresh();
        if (window.Succes) window.Succes.unlock(7);
    };

    function souls() { return $gameVariables ? $gameVariables.value(SOUL) : 0; }
    function spend(n) { $gameVariables.setValue(SOUL, Math.max(0, souls() - n)); }

    //--- Fenêtre : choix du héros ---
    function Window_ForgeActor() { this.initialize.apply(this, arguments); }
    Window_ForgeActor.prototype = Object.create(Window_Command.prototype);
    Window_ForgeActor.prototype.constructor = Window_ForgeActor;
    Window_ForgeActor.prototype.initialize = function () {
        Window_Command.prototype.initialize.call(this, 0, this.fittingHeight(1));
    };
    Window_ForgeActor.prototype.windowWidth = function () { return 340; };
    Window_ForgeActor.prototype.makeCommandList = function () {
        $gameParty.members().forEach(function (a) {
            this.addCommand(a.name(), 'actor' + a.actorId());
        }, this);
    };

    //--- Fenêtre : âmes ---
    function Window_ForgeSouls() { this.initialize.apply(this, arguments); }
    Window_ForgeSouls.prototype = Object.create(Window_Base.prototype);
    Window_ForgeSouls.prototype.constructor = Window_ForgeSouls;
    Window_ForgeSouls.prototype.initialize = function (x, y, w) {
        Window_Base.prototype.initialize.call(this, x, y, w, this.fittingHeight(1));
        this.refresh();
    };
    Window_ForgeSouls.prototype.refresh = function () {
        this.contents.clear();
        this.changeTextColor(this.systemColor());
        this.drawText('Âmes :', 8, 0, 120);
        this.changeTextColor(this.normalColor());
        this.drawText(souls(), 0, 0, this.contentsWidth() - 12, 'right');
    };

    //--- Fenêtre : stats à renforcer ---
    function Window_ForgeStat() { this.initialize.apply(this, arguments); }
    Window_ForgeStat.prototype = Object.create(Window_Command.prototype);
    Window_ForgeStat.prototype.constructor = Window_ForgeStat;
    Window_ForgeStat.prototype.initialize = function (x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
        this._actor = null; this.deactivate();
    };
    Window_ForgeStat.prototype.windowWidth = function () { return 476; };
    Window_ForgeStat.prototype.setActor = function (a) { this._actor = a; this.refresh(); };
    Window_ForgeStat.prototype.makeCommandList = function () {
        if (!this._actor) return;
        STATS.forEach(function (s) {
            var lv = this._actor.forgeLevel(s[0]);
            var cost = this._actor.forgeCost(s[0]);
            var label = s[1] + '  +' + lv + '   (coût ' + cost + ')';
            this.addCommand(label, 'stat' + s[0], souls() >= cost);
        }, this);
    };

    //--- Scène ---
    function Scene_Forge() { this.initialize.apply(this, arguments); }
    window.Scene_Forge = Scene_Forge;
    Scene_Forge.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Forge.prototype.constructor = Scene_Forge;
    Scene_Forge.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._title = new Window_Help(1); this._title.setText('\\C[14]LA FORGE D\'ÂMES\\C[0] — renforce tes héros avec tes âmes.');
        this.addWindow(this._title);
        this._actorWin = new Window_ForgeActor();
        this._actorWin.y = this._title.height;
        this._actorWin.setHandler('ok', this.onActor.bind(this));
        this._actorWin.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._actorWin);
        this._soulsWin = new Window_ForgeSouls(this._actorWin.width, this._title.height, Graphics.boxWidth - this._actorWin.width);
        this.addWindow(this._soulsWin);
        this._statWin = new Window_ForgeStat(0, this._actorWin.y + this._actorWin.height);
        this._statWin.setHandler('ok', this.onStat.bind(this));
        this._statWin.setHandler('cancel', this.onStatCancel.bind(this));
        for (var i = 0; i < 6; i++) this._statWin.setHandler('stat' + STATS[i][0], this.onStat.bind(this));
        this.addWindow(this._statWin);
    };
    Scene_Forge.prototype.onActor = function () {
        var id = parseInt(this._actorWin.currentSymbol().replace('actor', ''));
        this._actor = $gameActors.actor(id);
        this._statWin.setActor(this._actor);
        this._statWin.activate(); this._statWin.select(0);
        this._actorWin.deactivate();
    };
    Scene_Forge.prototype.onStat = function () {
        var pid = parseInt(this._statWin.currentSymbol().replace('stat', ''));
        var cost = this._actor.forgeCost(pid);
        if (souls() >= cost) {
            spend(cost); this._actor.applyForge(pid);
            SoundManager.playUseSkill();
            this._statWin.refresh(); this._soulsWin.refresh();
        } else { SoundManager.playBuzzer(); }
        this._statWin.activate();
    };
    Scene_Forge.prototype.onStatCancel = function () {
        this._statWin.deactivate(); this._actorWin.activate();
    };

    //--- Commande plugin ---
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() === 'FORGE') SceneManager.push(Scene_Forge);
    };
})();
