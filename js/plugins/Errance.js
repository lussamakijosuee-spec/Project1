//=============================================================================
// Errance.js — v1.0  ·  La Chute de l'Âme : l'Errant
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Consommer des âmes (art du Symbole) fait enfler la jauge
 * d'ERRANCE : on gagne en puissance, mais on glisse hors du monde — l'Errant.
 * Additif, auto-suffisant (aucun état de base requis).
 * @author JOKO
 *
 * @param elAme
 * @text Élément — Âme / Spirituel
 * @type number
 * @default 2
 *
 * @param sktAme
 * @text Skill type — âme
 * @type number
 * @default 9
 * @desc Les compétences de ce type comptent comme « Consommation ».
 *
 * @param gainKill
 * @text Gain — âme dévorée (mise à mort)
 * @type number
 * @default 5
 * @desc Errance gagnée quand on ACHÈVE un ennemi avec un art de l'Âme.
 *
 * @param gainUse
 * @text Gain — usage offensif
 * @type number
 * @default 1
 *
 * @param menuCommand
 * @text Entrée Menu (vide = aucune)
 * @type string
 * @default Errance
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'ERRANT — la Chute de l'Âme                                       by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  La voie de l'Âme crée en dépensant ce qu'on est. Son opération interdite, la
 *  CONSOMMATION (dévorer l'essence des âmes qu'on abat), fait grandir le pouvoir
 *  mais déforme : palier après palier, on glisse HORS du monde physique. Au bout,
 *  on devient une âme errante — comme celles que régit la Reine Oubliée.
 *
 *  JAUGE (0-100, par héros) — paliers :
 *     0  Ancré        ·  40  Décharné  ·  70  Gonflé d'âmes  ·  100  l'Errant
 *
 *  EFFET (auto, sans état de base) :
 *   • Puissance : +ATK et +MAT qui montent avec l'errance (chaque âme te grandit).
 *   • Fragilité : on encaisse de plus en plus (jusqu'à +40 % de dégâts subis au
 *     palier 100) — le corps se dissout, on n'appartient plus tout à fait au réel.
 *
 *  GAGNER :  achever un ennemi avec un art de l'Âme (élém 2 / skill type 9).
 *  RÉDUIRE : commande  ERRANCE purge <héros> <n>   (ex. au Feu d'Âme / Sanctuaire)
 *  Écran :   ERRANCE ecran      ·   Script : Errance.niveau('lou')
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('Errance');
    var EL_AME    = parseInt(P['elAme'] || 2);
    var SKT_AME   = parseInt(P['sktAme'] || 9);
    var GAIN_KILL = parseInt(P['gainKill'] || 5);
    var GAIN_USE  = parseInt(P['gainUse'] || 1);
    var MENU      = String(P['menuCommand'] || 'Errance');

    var KEY = { thylane: 1, neyssa: 2, lou: 3, tianna: 4 };
    function resolve(k) { if (typeof k === 'number') return k; var s = String(k).toLowerCase().trim(); return KEY[s] || parseInt(s) || 0; }
    function store() { if (!$gameSystem) return {}; if (!$gameSystem._errance) $gameSystem._errance = {}; return $gameSystem._errance; }
    function stageName(lv) { return lv >= 100 ? 'l\'Errant' : lv >= 70 ? 'Gonflé d\'âmes' : lv >= 40 ? 'Décharné' : 'Ancré'; }
    function log(t) { var w = SceneManager._scene && SceneManager._scene._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }

    var Errance = {
        niveau: function (k) { return store()[resolve(k)] || 0; },
        add: function (actorId, n) {
            var s = store(); var before = s[actorId] || 0;
            s[actorId] = Math.max(0, Math.min(100, before + n));
            var a = $gameActors && $gameActors.actor(actorId);
            if (before < 100 && s[actorId] >= 100 && a) {
                log('\\C[2]' + a.name() + ' n\'appartient plus tout à fait au monde — l\'Errant.\\C[0]');
            } else if (before < 70 && s[actorId] >= 70 && a) {
                log('\\C[2]La marque de ' + a.name() + ' enfle, gonflée d\'âmes volées…\\C[0]');
            }
        },
        purge: function (k, n) { var id = resolve(k); var s = store(); s[id] = Math.max(0, (s[id] || 0) - Math.abs(n || 30)); },
        factor: function (actor) { return actor && actor.isActor && actor.isActor() ? this.niveau(actor.actorId()) / 100 : 0; }
    };
    window.Errance = Errance;

    function isAmeAction(action) {
        var it = action && action.item && action.item();
        if (!it) return false;
        var el = it.damage ? it.damage.elementId : 0;
        return el === EL_AME || it.stypeId === SKT_AME || (it.meta && it.meta.Consume);
    }

    // Gain : usage offensif + consommation (mise à mort) avec un art de l'Âme
    var _exec = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _exec.call(this, target, value);
        var s = this.subject();
        if (value > 0 && s && s.isActor && s.isActor() && isAmeAction(this)) {
            var gain = GAIN_USE;
            if (target && target.isEnemy && target.isEnemy() && target.isDead()) gain += GAIN_KILL;
            Errance.add(s.actorId(), gain);
        }
    };

    // Puissance (+ATK/+MAT) qui monte avec l'errance
    var _paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function (paramId) {
        var v = _paramPlus.call(this, paramId);
        var f = Errance.factor(this);
        if (f > 0 && (paramId === 2 || paramId === 4)) {
            v += Math.floor(this.paramBase(paramId) * 0.5 * f);   // jusqu'à +50 % au palier 100
        }
        return v;
    };

    // Fragilité : l'Errant encaisse de plus en plus (corps qui se dissout)
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _mdv.call(this, target, critical);
        if (v > 0 && target && target.isActor && target.isActor()) {
            var f = Errance.factor(target);
            if (f > 0) v = Math.floor(v * (1 + 0.4 * f));
        }
        return v;
    };

    // Décroissance lente hors-combat (on se réancre en marchant)
    var _incSteps = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function () {
        _incSteps.call(this);
        if (this.steps() % 75 === 0) { var s = store(); Object.keys(s).forEach(function (id) { if (s[id] > 0) s[id] -= 1; }); }
    };

    //--- Écran d'errance ---
    function Window_Errance() { this.initialize.apply(this, arguments); }
    Window_Errance.prototype = Object.create(Window_Base.prototype);
    Window_Errance.prototype.constructor = Window_Errance;
    Window_Errance.prototype.initialize = function () { Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight); this.refresh(); };
    Window_Errance.prototype.refresh = function () {
        this.contents.clear();
        this.changeTextColor(this.systemColor()); this.drawText('— ERRANCE · la Chute de l\'Âme —', 0, 0, this.contentsWidth(), 'center'); this.resetTextColor();
        var top = this.lineHeight() * 2, rowH = Math.floor((this.contentsHeight() - top) / 4);
        for (var i = 1; i <= 4; i++) {
            var a = $gameActors.actor(i); if (!a) continue;
            var y = top + (i - 1) * rowH, lv = Errance.niveau(i);
            var col = lv >= 100 ? '#7f8cff' : lv >= 70 ? '#9b6fd8' : lv >= 40 ? '#5dcaa5' : '#7fbf7f';
            this.changeTextColor(this.normalColor()); this.drawText(a.name(), 0, y, 220);
            this.changeTextColor(col); this.drawText(stageName(lv) + ' · ' + lv + ' / 100', 0, y, this.contentsWidth(), 'right');
            var bw = this.contentsWidth() - 20, gy = y + this.lineHeight() + 6;
            this.contents.fillRect(0, gy, bw, 16, 'rgba(0,0,0,0.5)');
            this.contents.fillRect(1, gy + 1, Math.floor((bw - 2) * lv / 100), 14, col);
            this.resetTextColor();
        }
    };
    function Scene_Errance() { this.initialize.apply(this, arguments); }
    Scene_Errance.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Errance.prototype.constructor = Scene_Errance;
    Scene_Errance.prototype.create = function () { Scene_MenuBase.prototype.create.call(this); this._w = new Window_Errance(); this.addWindow(this._w); };
    Scene_Errance.prototype.update = function () { Scene_MenuBase.prototype.update.call(this); if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) this.popScene(); };
    window.Scene_Errance = Scene_Errance;

    // Commandes de plugin
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'ERRANCE') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'ecran' || sub === 'écran') SceneManager.push(Scene_Errance);
        else if (sub === 'purge') Errance.purge(args[1], parseInt(args[2] || 30));
        else if (sub === 'add') Errance.add(resolve(args[1]), parseInt(args[2] || 10));
    };

    // Entrée menu optionnelle
    if (MENU) {
        var _addMain = Window_MenuCommand.prototype.addMainCommands;
        Window_MenuCommand.prototype.addMainCommands = function () { _addMain.call(this); this.addCommand(MENU, 'errance', true); };
        var _createCmd = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () { _createCmd.call(this); this._commandWindow.setHandler('errance', function () { SceneManager.push(Scene_Errance); }); };
    }
})();
