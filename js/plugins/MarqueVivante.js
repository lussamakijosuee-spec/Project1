//=============================================================================
// MarqueVivante.js — v1.0  ·  La Marque vivante (l'ADN de l'âme)
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ « Lire une marque, c'est lire où en est une âme » : l'état
 * de la Marque (Pleine/Fêlée/Affamée/Gonflée/Creuse) dérivé des trois jauges.
 * Écran de lecture façon Regard. Lecture seule, additif.
 * @author JOKO
 *
 * @param menuCommand
 * @text Entrée Menu (vide = aucune)
 * @type string
 * @default
 * @desc Vide par défaut (le menu est déjà chargé) : ouvrir par la commande MARQUE.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA MARQUE VIVANTE                                                   by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  « La marque évolue avec l'âme : elle s'étend chez ceux qui s'élargissent,
 *   se rétracte chez ceux dont l'âme s'éteint. »
 *
 *  ▶ ÉTAT DE LA MARQUE — dérivé des jauges partagées (aucun réglage) :
 *      CREUSE   éteinte — âme vidée          (une Chute consommée à 100)
 *      GONFLÉE  difforme — nourrie d'âmes    (Errance ≥ 40)
 *      FÊLÉE    brisée, cicatrices — trauma  (santé mentale : phase ≤ 2)
 *      AFFAMÉE  rétractée — l'âme s'épuise   (Corruption ≥ 70)
 *      PLEINE   nette, ample — âme saine     (sinon)
 *    (priorité dans cet ordre ; purement descriptif — les malus réels restent
 *     du ressort de chaque système de Chute, pas de double peine.)
 *
 *  ▶ ÉTENDUE — la marque s'étend avec la puissance : % lu sur le score des
 *    Rangs (window.Rangs) si présent, sinon sur le niveau.
 *
 *  Écran :  commande de plugin  MARQUE     (ou l'entrée de menu si définie)
 *  Script :  Marque.etat(actorId) → 'pleine'|'felee'|'affamee'|'gonflee'|'creuse'
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('MarqueVivante');
    var MENU = String(P['menuCommand'] || '');

    var ETATS = {
        creuse:  { nom: 'CREUSE',  col: '#7E7688', desc: 'éteinte — âme vidée ; un corps sans feu' },
        gonflee: { nom: 'GONFLÉE', col: '#B79CF5', desc: 'difforme — nourrie d\'autres âmes ; voie de l\'Errant' },
        felee:   { nom: 'FÊLÉE',   col: '#9CC0F5', desc: 'brisée, cicatrices — trauma ; matérialise mal' },
        affamee: { nom: 'AFFAMÉE', col: '#F0928E', desc: 'rétractée — âme qui s\'épuise ; danger' },
        pleine:  { nom: 'PLEINE',  col: '#5CC98A', desc: 'nette, ample — âme saine, en croissance' }
    };

    function jCorps(id)  { try { return window.Corruption ? window.Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function jAme(id)    { try { return window.Errance ? window.Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function phaseEsprit(id) { try { return window.Ame ? (window.Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }

    var Marque = {
        etat: function (id) {
            if (jCorps(id) >= 100 || jAme(id) >= 100) return 'creuse';
            if (jAme(id) >= 40) return 'gonflee';
            if (phaseEsprit(id) <= 2) return 'felee';
            if (jCorps(id) >= 70) return 'affamee';
            return 'pleine';
        },
        etendue: function (id) {
            try { if (window.Rangs) { var d = window.Rangs.details(id); if (d) return Math.min(100, d.score); } } catch (e) {}
            var a = $gameActors && $gameActors.actor(id);
            return a ? Math.min(100, Math.round((a.level / 99) * 100)) : 0;
        },
        info: function (id) { return ETATS[this.etat(id)]; }
    };
    window.Marque = Marque;

    //--- Écran de lecture (façon Regard) ---
    function Window_Marque() { this.initialize.apply(this, arguments); }
    Window_Marque.prototype = Object.create(Window_Base.prototype);
    Window_Marque.prototype.constructor = Window_Marque;
    Window_Marque.prototype.standardFontSize = function () { return 20; };
    Window_Marque.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.refresh();
    };
    Window_Marque.prototype.refresh = function () {
        this.contents.clear();
        var W = this.contentsWidth();
        this.contents.fontSize = 21; this.changeTextColor('#EBC974');
        this.drawText('LA MARQUE VIVANTE', 0, 2, W, 'center');
        this.contents.fontSize = 13; this.changeTextColor('#7E7688');
        this.drawText('« Lire une marque, c\'est lire où en est une âme. »', 0, 30, W, 'center');

        var members = $gameParty.members();
        var top = 64, rowH = Math.min(100, Math.floor((this.contentsHeight() - top) / Math.max(1, members.length)));
        for (var i = 0; i < members.length; i++) {
            var a = members[i], id = a.actorId();
            var etat = Marque.etat(id), inf = ETATS[etat], ext = Marque.etendue(id);
            var y = top + i * rowH;
            this.contents.fontSize = 19; this.changeTextColor('#ECE6D8');
            this.drawText(a.name(), 8, y, 200, 'left');
            this.contents.fontSize = 17; this.changeTextColor(inf.col);
            this.drawText('Marque ' + inf.nom, 8, y + 24, 240, 'left');
            this.contents.fontSize = 13; this.changeTextColor('#B6AE9C');
            this.drawText(inf.desc, 240, y + 26, W - 250, 'left');
            // étendue : la marque gagne du corps avec la puissance
            var bw = W - 20, by = y + 52;
            this.contents.fontSize = 12; this.changeTextColor('#7E7688');
            this.drawText('étendue ' + ext + ' %', 8, by - 4, 140, 'left');
            this.contents.fillRect(140, by, bw - 140, 10, 'rgba(0,0,0,0.5)');
            this.contents.fillRect(141, by + 1, Math.floor((bw - 142) * ext / 100), 8, inf.col);
        }
        this.resetFontSettings();
    };
    function Scene_Marque() { this.initialize.apply(this, arguments); }
    window.Scene_Marque = Scene_Marque;
    Scene_Marque.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Marque.prototype.constructor = Scene_Marque;
    Scene_Marque.prototype.create = function () { Scene_MenuBase.prototype.create.call(this); this._w = new Window_Marque(); this.addWindow(this._w); };
    Scene_Marque.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) { SoundManager.playCancel(); this.popScene(); }
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() === 'MARQUE') SceneManager.push(Scene_Marque);
    };
    if (MENU.length > 0) {
        var _add = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () { _add.call(this); this.addCommand(MENU, 'marqueVivante', true); };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () { _cw.call(this); this._commandWindow.setHandler('marqueVivante', function () { SceneManager.push(Scene_Marque); }); };
    }
})();
