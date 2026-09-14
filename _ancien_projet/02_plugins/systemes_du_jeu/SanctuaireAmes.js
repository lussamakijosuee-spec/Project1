//=============================================================================
// SanctuaireAmes.js — v1.0  ·  Le Sanctuaire (arbre de compétences via âmes)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Sanctuaire d'Âmes : dépense tes âmes (var 15) pour
 * apprendre de nouvelles compétences à tes héros (à la souls-like).
 * @author JOKO
 *
 * @param soulVar
 * @text Variable — Âmes
 * @type variable
 * @default 15
 *
 * @help
 *  Ouvre le sanctuaire depuis un événement :
 *      Plugin Command :  SANCTUAIRE
 *  Choisis un héros, puis une compétence à apprendre (coût en âmes). Les
 *  compétences déjà apprises ou trop chères sont grisées.
 *  Les nœuds sont configurés dans le tableau NODES (par ID d'acteur).
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('SanctuaireAmes');
    var SOUL = parseInt(P['soulVar'] || 15);
    // ID d'acteur -> [[skillId, coût en âmes], ...]
    var NODES = {
        1: [[220, 20], [260, 40], [300, 70], [340, 110]],
        2: [[230, 20], [270, 40], [310, 70], [350, 110]],
        3: [[240, 20], [280, 40], [320, 70], [360, 110]],
        4: [[250, 20], [290, 40], [330, 70], [370, 110]]
    };

    function souls() { return $gameVariables ? $gameVariables.value(SOUL) : 0; }
    function spend(n) { $gameVariables.setValue(SOUL, Math.max(0, souls() - n)); }
    function nodesOf(id) {
        return (NODES[id] || []).filter(function (n) {
            return $dataSkills[n[0]] && $dataSkills[n[0]].name;
        });
    }

    function Window_SancActor() { this.initialize.apply(this, arguments); }
    Window_SancActor.prototype = Object.create(Window_Command.prototype);
    Window_SancActor.prototype.constructor = Window_SancActor;
    Window_SancActor.prototype.initialize = function () { Window_Command.prototype.initialize.call(this, 0, 72); };
    Window_SancActor.prototype.windowWidth = function () { return 300; };
    Window_SancActor.prototype.makeCommandList = function () {
        $gameParty.members().forEach(function (a) { this.addCommand(a.name(), 'a' + a.actorId()); }, this);
    };

    function Window_SancSouls() { this.initialize.apply(this, arguments); }
    Window_SancSouls.prototype = Object.create(Window_Base.prototype);
    Window_SancSouls.prototype.constructor = Window_SancSouls;
    Window_SancSouls.prototype.initialize = function (x, y, w) {
        Window_Base.prototype.initialize.call(this, x, y, w, this.fittingHeight(1)); this.refresh();
    };
    Window_SancSouls.prototype.refresh = function () {
        this.contents.clear();
        this.changeTextColor(this.systemColor()); this.drawText('Âmes :', 8, 0, 100);
        this.resetTextColor(); this.drawText(souls(), 0, 0, this.contentsWidth() - 12, 'right');
    };

    function Window_SancNodes() { this.initialize.apply(this, arguments); }
    Window_SancNodes.prototype = Object.create(Window_Command.prototype);
    Window_SancNodes.prototype.constructor = Window_SancNodes;
    Window_SancNodes.prototype.initialize = function (x, y) { Window_Command.prototype.initialize.call(this, x, y); this._actor = null; this.deactivate(); };
    Window_SancNodes.prototype.windowWidth = function () { return 516; };
    Window_SancNodes.prototype.setActor = function (a) { this._actor = a; this.refresh(); this.select(0); };
    Window_SancNodes.prototype.makeCommandList = function () {
        if (!this._actor) return;
        nodesOf(this._actor.actorId()).forEach(function (n) {
            var sk = $dataSkills[n[0]], known = this._actor.isLearnedSkill(n[0]);
            var label = sk.name + (known ? '  (apprise)' : '   — ' + n[1] + ' âmes');
            this.addCommand(label, 'n' + n[0], !known && souls() >= n[1]);
        }, this);
    };

    function Scene_Sanctuaire() { this.initialize.apply(this, arguments); }
    window.Scene_Sanctuaire = Scene_Sanctuaire;
    Scene_Sanctuaire.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Sanctuaire.prototype.constructor = Scene_Sanctuaire;
    Scene_Sanctuaire.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._title = new Window_Help(1); this._title.setText('\\C[14]LE SANCTUAIRE D\'ÂMES\\C[0] — apprends des compétences avec tes âmes.');
        this.addWindow(this._title);
        this._actorWin = new Window_SancActor();
        this._actorWin.setHandler('ok', this.onActor.bind(this));
        this._actorWin.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._actorWin);
        this._soulsWin = new Window_SancSouls(this._actorWin.width, 72, Graphics.boxWidth - this._actorWin.width);
        this.addWindow(this._soulsWin);
        this._nodeWin = new Window_SancNodes(0, this._actorWin.y + this._actorWin.height);
        this._nodeWin.setHandler('ok', this.onNode.bind(this));
        this._nodeWin.setHandler('cancel', this.onNodeCancel.bind(this));
        this.addWindow(this._nodeWin);
    };
    Scene_Sanctuaire.prototype.onActor = function () {
        var id = parseInt(this._actorWin.currentSymbol().substr(1));
        this._actor = $gameActors.actor(id);
        this._nodeWin.setActor(this._actor); this._nodeWin.activate(); this._actorWin.deactivate();
    };
    Scene_Sanctuaire.prototype.onNode = function () {
        var sid = parseInt(this._nodeWin.currentSymbol().substr(1));
        var node = (NODES[this._actor.actorId()] || []).filter(function (n) { return n[0] === sid; })[0];
        if (node && souls() >= node[1] && !this._actor.isLearnedSkill(sid)) {
            spend(node[1]); this._actor.learnSkill(sid);
            SoundManager.playUseSkill();
            this._nodeWin.refresh(); this._soulsWin.refresh();
        } else SoundManager.playBuzzer();
        this._nodeWin.activate();
    };
    Scene_Sanctuaire.prototype.onNodeCancel = function () { this._nodeWin.deactivate(); this._actorWin.activate(); };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() === 'SANCTUAIRE') SceneManager.push(Scene_Sanctuaire);
    };
})();
