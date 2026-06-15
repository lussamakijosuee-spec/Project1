//=============================================================================
// FactionsAmes.js — v2.0  ·  Les Factions jouables (allégeance, but, fin)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v2.0 ■ Rallie une faction (Royaume des Étoiles/Jada · Empire
 * Vultric · Culte des Âmes · Affranchis) : bonus d'équipe + route de fin.
 * @author JOKO
 *
 * @param factionVar
 * @text Variable de faction
 * @type variable
 * @default 19
 * @desc 0=aucune · 1=Étoiles/Jada · 2=Vultric · 3=Culte · 4=Affranchis
 *
 * @param endingVar
 * @text Variable de fin (0 = désactivé)
 * @type variable
 * @default 0
 * @desc Si > 0, reçoit l'id de la fin liée à la faction ralliée.
 *
 * @param menuCommand
 * @text Entrée menu (vide = aucune)
 * @type string
 * @default Factions
 *
 * @help
 *  Dans un événement :
 *      FACTION join etoiles | jada        → Royaume des Étoiles (Possession)
 *      FACTION join vultric | empire      → Empire Vultric      (Instinct)
 *      FACTION join culte | voix | ames   → Culte des Âmes       (Transcendance)
 *      FACTION join libre | affranchis    → Les Affranchis       (Nouvelle Vie)
 *      FACTION quit
 *      FACTION ecran                       → ouvre l'écran des factions
 *  Scripts : $gameSystem.faction()  ·  $gameSystem.factionEnding()
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('FactionsAmes');
    var FVAR = parseInt(P['factionVar'] || 19);
    var EVAR = parseInt(P['endingVar'] || 0);
    var MENU = String(P['menuCommand'] || 'Factions');

    // id -> données de faction
    var FACTIONS = {
        1: { name: 'Royaume des Étoiles', chief: 'Jada, la Marionnette', color: 10,
             credo: 'Briser la barrière du monde et prendre un corps humain réel.',
             but: 'Réunir les âmes et la Clé pour s\'échapper dans la réalité — en volant la place du joueur. Les âmes restent prisonnières du jeu ; seuls les corps sortent.',
             fin: 'Possession', endId: 3, bonus: { 4: 20, 6: 16 } },          // MAT, AGI
        2: { name: 'Empire Vultric', chief: 'l\'Empereur Kiev', color: 18,
             credo: 'Une liberté absolue, sans morale ni limite.',
             but: 'Tout réduire au Mana Sombre et Négatif : effacer l\'esprit et les émotions, ne laisser que l\'instinct et le désir. Un monde libre, mais de pure destruction.',
             fin: 'Instinct', endId: 5, bonus: { 2: 18, 0: 220 } },           // ATK, MHP
        3: { name: 'Culte des Âmes', chief: 'la Grande Prêtresse', color: 14,
             credo: 'Que plus personne ne souffre, jamais.',
             but: 'Transcender et fondre toutes les âmes en une seule. Une paix totale… mais sans émotion ni libre arbitre, et les joueurs restent coincés dans le jeu.',
             fin: 'Transcendance', endId: 2, bonus: { 5: 18, 1: 60, 7: 16 } }, // MDF, MMP, LUK
        4: { name: 'Les Affranchis', chief: 'personne — c\'est le but', color: 3,
             credo: 'Refaire sa vie ici, libre, parmi les siens.',
             but: 'Renoncer à la grande quête pour vivre simplement dans ce monde. Faux, peut-être — mais on peut y aimer, y fonder une famille, y être quelqu\'un.',
             fin: 'Nouvelle Vie', endId: 7, bonus: { 0: 120, 2: 8, 6: 8 } }    // un peu de tout
    };
    var KEY = { etoiles: 1, jada: 1, vultric: 2, empire: 2, culte: 3, voix: 3, ames: 3, libre: 4, affranchis: 4 };

    Game_System.prototype.faction = function () { return this._faction || 0; };
    Game_System.prototype.factionData = function () { return FACTIONS[this.faction()] || null; };
    Game_System.prototype.factionEnding = function () { var d = this.factionData(); return d ? d.endId : 0; };

    function join(f) {
        if (!$gameSystem) return;
        $gameSystem._faction = f;
        if ($gameVariables) {
            $gameVariables.setValue(FVAR, f);
            if (EVAR > 0) $gameVariables.setValue(EVAR, f ? FACTIONS[f].endId : 0);
        }
        $gameParty.members().forEach(function (a) { a.refresh(); });
        if (f && $gameMessage) {
            var d = FACTIONS[f];
            $gameMessage.add('\\C[' + d.color + ']Tu rallies : ' + d.name + '.\\C[0]');
            $gameMessage.add('Voie de fin : « ' + d.fin + ' ».');
        }
        if (f && window.Succes) window.Succes.unlock(6);
    }

    var _pp = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function (pid) {
        var v = _pp.call(this, pid);
        var f = (typeof $gameSystem !== 'undefined' && $gameSystem) ? $gameSystem.faction() : 0;
        if (f && FACTIONS[f] && FACTIONS[f].bonus[pid]) v += FACTIONS[f].bonus[pid];
        return v;
    };

    //--- Écran des factions ---
    function Window_Factions() { this.initialize.apply(this, arguments); }
    Window_Factions.prototype = Object.create(Window_Base.prototype);
    Window_Factions.prototype.constructor = Window_Factions;
    Window_Factions.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.refresh();
    };
    Window_Factions.prototype.wrap = function (text, max) {
        var words = String(text).split(' '), lines = [], cur = '';
        words.forEach(function (w) {
            if (!cur) cur = w; else if ((cur + ' ' + w).length <= max) cur += ' ' + w; else { lines.push(cur); cur = w; }
        });
        if (cur) lines.push(cur);
        return lines;
    };
    Window_Factions.prototype.refresh = function () {
        this.contents.clear();
        var cur = $gameSystem.faction();
        this.changeTextColor(this.systemColor());
        this.drawText('— LES FACTIONS —', 0, 0, this.contentsWidth(), 'center');
        this.resetTextColor();
        var y = this.lineHeight() * 1.6, ids = [1, 2, 3, 4], W = this.contentsWidth(), self = this;
        ids.forEach(function (id) {
            var d = FACTIONS[id], joined = (id === cur);
            self.changeTextColor(self.textColor(d.color));
            self.drawText((joined ? '★ ' : '') + d.name, 0, y, W - 200);
            self.drawText('Fin : ' + d.fin, 0, y, W, 'right');
            self.resetTextColor(); y += self.lineHeight();
            self.changeTextColor(self.textColor(8));
            self.drawText('Meneur : ' + d.chief, 16, y, W - 16); y += self.lineHeight();
            self.resetTextColor();
            self.wrap('But : ' + d.but, 64).forEach(function (l) { self.drawText(l, 16, y, W - 16); y += self.lineHeight(); });
            self.contents.fillRect(0, y + 4, W, 1, self.textColor(8)); y += self.lineHeight() * 0.7;
        });
    };
    function Scene_Factions() { this.initialize.apply(this, arguments); }
    window.Scene_Factions = Scene_Factions;
    Scene_Factions.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Factions.prototype.constructor = Scene_Factions;
    Scene_Factions.prototype.create = function () { Scene_MenuBase.prototype.create.call(this); this.addWindow(new Window_Factions()); };
    Scene_Factions.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) { SoundManager.playCancel(); this.popScene(); }
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'FACTION') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'join') join(KEY[(args[1] || '').toLowerCase()] || 0);
        else if (sub === 'quit') join(0);
        else if (sub === 'ecran') SceneManager.push(Scene_Factions);
    };
    if (MENU.length > 0) {
        var _add = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () { _add.call(this); this.addCommand(MENU, 'factionsAmes', true); };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () { _cw.call(this); this._commandWindow.setHandler('factionsAmes', function () { SceneManager.push(Scene_Factions); }); };
    }
})();
