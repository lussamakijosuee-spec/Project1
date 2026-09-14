//=============================================================================
// AmeStatusScene.js — v1.0
// Écran visuel de Santé Mentale de l'Âme (complément de JadeEntitePlunging)
// RPG Maker MV   ·   by JOKO
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Écran/Page visuelle de Santé Mentale (jauges des 4 âmes)
 * Affiche les phases psychologiques des personnages. Requiert JadeEntitePlunging.
 * @author JOKO
 *
 * @param menuCommand
 * @text Texte commande Menu
 * @type string
 * @default Santé Mentale
 * @desc Libellé ajouté au menu principal (laisser vide pour ne pas l'ajouter).
 *
 * @param showInMenu
 * @text Ajouter au Menu principal ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  ÉCRAN DE SANTÉ MENTALE                                              by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Affiche une page avec, pour chaque personnage, sa jauge (1–10), sa phase
 *  psychologique (couleur + nom) et, pour Lou, le nombre d'âmes damnées.
 *
 *  OUVRIR L'ÉCRAN
 *  ──────────────────────────────────────────────────────────────────────────
 *   • Plugin Command :   AME ecran
 *   • Script (event) :   SceneManager.push(Scene_AmeStatus)
 *   • Menu principal :   ajouté automatiquement si « Ajouter au Menu » = Oui
 *
 *  Nécessite que JadeEntitePlunging.js soit chargé AVANT ce plugin
 *  (window.Ame doit exister).
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('AmeStatusScene');
    var MENU_TEXT  = String(P['menuCommand'] || 'Santé Mentale');
    var SHOW_MENU  = String(P['showInMenu'] || 'true') === 'true';

    // Personnages affichés : [actorId, libellé de l'axe psychologique]
    var ROWS = [
        [1, 'Maîtrise'],
        [2, 'Concentration'],
        [3, 'Sérénité'],
        [4, 'Confiance']
    ];

    // Couleur de la jauge selon la phase (1 à 5)
    var PHASE_COLOR = {
        1: '#e74c3c', // Effondrement — rouge
        2: '#e67e22', // Instable     — orange
        3: '#f1c40f', // Tension      — jaune
        4: '#2ecc71', // Stable       — vert
        5: '#3498db'  // Maîtrise     — bleu
    };

    // Affinités de Mana : mot-clé du notetag -> { libellé, couleur }
    var MANA_INFO = {
        negatif:     { label: 'Mana Négatif',     color: '#e67e22' },
        positif:     { label: 'Mana Positif',     color: '#2ecc71' },
        spirituelle: { label: 'Mana Spirituelle', color: '#9b59b6' },
        ame:         { label: 'Mana Spirituelle', color: '#9b59b6' },
        sombre:      { label: 'Mana Sombre',      color: '#8e44ad' },
        pur:         { label: 'Mana Pur',         color: '#f1c40f' },
        parfait:     { label: 'Mana Pur',         color: '#f1c40f' }
    };

    function manaKey(raw) {
        return String(raw || '').toLowerCase().trim()
            .replace('é', 'e').replace('â', 'a');
    }

    /** Affinité(s) d'un acteur depuis ses notetags <Mana> / <Mana2>. */
    function affinityOfActor(actorId) {
        var data = $dataActors[actorId];
        if (!data || !data.meta) return null;
        var keys = [];
        if (data.meta.Mana)  keys.push(manaKey(data.meta.Mana));
        if (data.meta.Mana2) keys.push(manaKey(data.meta.Mana2));
        if (keys.length === 0) return null;
        var infos = keys.map(function (k) { return MANA_INFO[k]; }).filter(Boolean);
        if (infos.length === 0) return null;
        if (infos.length === 1) return { label: infos[0].label, color: infos[0].color, dual: false };
        // Dual : deux affinités → libellé combiné, couleur de la première
        return {
            label: infos[0].label + ' + ' + infos[1].label + '  (Dual)',
            color: infos[0].color,
            dual: true
        };
    }

    /** Garde-fou : le système de jauges est-il présent ? */
    function ameReady() {
        return typeof window.Ame !== 'undefined' && window.Ame;
    }

    //=========================================================================
    // WINDOW — Window_AmeStatus
    //=========================================================================

    function Window_AmeStatus() {
        this.initialize.apply(this, arguments);
    }

    Window_AmeStatus.prototype = Object.create(Window_Base.prototype);
    Window_AmeStatus.prototype.constructor = Window_AmeStatus;

    Window_AmeStatus.prototype.initialize = function () {
        var w = Graphics.boxWidth;
        var h = Graphics.boxHeight;
        Window_Base.prototype.initialize.call(this, 0, 0, w, h);
        this.refresh();
    };

    Window_AmeStatus.prototype.refresh = function () {
        this.contents.clear();
        if (!ameReady()) {
            this.drawText('JadeEntitePlunging.js non chargé.', 0, 0, this.contentsWidth(), 'center');
            return;
        }

        // Titre
        this.changeTextColor(this.systemColor());
        this.drawText('— Santé Mentale de l\'Âme —', 0, 0, this.contentsWidth(), 'center');
        this.resetTextColor();

        var top = this.lineHeight() * 2;
        var rowH = Math.floor((this.contentsHeight() - top) / ROWS.length);

        for (var i = 0; i < ROWS.length; i++) {
            this.drawAmeRow(ROWS[i][0], ROWS[i][1], top + i * rowH, rowH);
        }
    };

    Window_AmeStatus.prototype.drawAmeRow = function (actorId, axisLabel, y, rowH) {
        var actor = $gameActors.actor(actorId);
        var name  = actor ? actor.name() : ('Acteur ' + actorId);
        var val   = window.Ame.jauge(actorId);
        var phase = window.Ame.phase(actorId);
        var pName = window.Ame.nomPhase(actorId);
        var color = PHASE_COLOR[phase] || '#ffffff';

        var lh = this.lineHeight();
        var x  = 0;
        var w  = this.contentsWidth();

        // Ligne 1 : Nom — (axe) ......... Phase X · Nom
        this.changeTextColor(this.normalColor());
        this.drawText(name, x, y, 220, 'left');
        this.changeTextColor(this.systemColor());
        this.drawText('(' + axisLabel + ')', x + 220, y, 220, 'left');

        this.changeTextColor(color);
        this.drawText('Phase ' + phase + ' · ' + pName, x, y, w, 'right');
        this.resetTextColor();

        // Ligne 2 : barre + valeur/10
        var barY = y + lh + 4;
        var barW = w - 90;
        this.drawAmeGauge(x, barY, barW, val / 10, color);

        this.changeTextColor(color);
        this.drawText(val + ' / 10', x + barW + 8, barY - 6, 82, 'right');
        this.resetTextColor();

        // Ligne 3 : Affinité de Mana
        var aff = affinityOfActor(actorId);
        var line3Y = barY + lh;
        if (aff) {
            this.changeTextColor(this.systemColor());
            this.drawText('Affinité :', x, line3Y, 110, 'left');
            this.changeTextColor(aff.color);
            this.drawText(aff.label, x + 110, line3Y, w - 110, 'left');
            this.resetTextColor();
        }

        // Bonus Lou : âmes damnées (aligné à droite de la ligne d'affinité)
        if (actorId === 3) {
            var souls = $gameVariables.value(15);
            this.changeTextColor(this.systemColor());
            this.drawText('Âmes damnées : ' + souls, x, line3Y, w, 'right');
            this.resetTextColor();
        }
    };

    /** Barre dessinée à la main (couleur libre, indépendante du windowskin). */
    Window_AmeStatus.prototype.drawAmeGauge = function (x, y, width, rate, color) {
        var h = 16;
        var gy = y + (this.lineHeight() - h) / 2;
        rate = Math.max(0, Math.min(1, rate));
        if (window.LoreCanon) { LoreCanon.bar(this.contents, x, gy, width, h, rate, color); }
        else {
            this.contents.fillRect(x, gy, width, h, 'rgba(0,0,0,0.6)');
            this.contents.fillRect(x + 1, gy + 1, Math.floor((width - 2) * rate), h - 2, color);
            this.contents.fillRect(x, gy, width, 1, '#ffffff');
            this.contents.fillRect(x, gy + h - 1, width, 1, '#ffffff');
        }
    };

    //=========================================================================
    // SCENE — Scene_AmeStatus
    //=========================================================================

    function Scene_AmeStatus() {
        this.initialize.apply(this, arguments);
    }
    window.Scene_AmeStatus = Scene_AmeStatus;

    Scene_AmeStatus.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_AmeStatus.prototype.constructor = Scene_AmeStatus;

    Scene_AmeStatus.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._window = new Window_AmeStatus();
        this.addWindow(this._window);
    };

    Scene_AmeStatus.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('cancel') || Input.isTriggered('ok') ||
            TouchInput.isCancelled()) {
            SoundManager.playCancel();
            this.popScene();
        }
    };

    //=========================================================================
    // COMMANDE PLUGIN — AME ecran
    //=========================================================================

    var _GI_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _GI_pluginCommand.call(this, command, args);
        if (String(command).toUpperCase() === 'AME' &&
            (args[0] || '').toLowerCase() === 'ecran') {
            SceneManager.push(Scene_AmeStatus);
        }
    };

    //=========================================================================
    // INTÉGRATION AU MENU PRINCIPAL
    //=========================================================================

    if (SHOW_MENU && MENU_TEXT.length > 0) {

        var _SM_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _SM_createCommandWindow.call(this);
            this._commandWindow.setHandler('ameStatus', this.commandAmeStatus.bind(this));
        };

        Scene_Menu.prototype.commandAmeStatus = function () {
            SceneManager.push(Scene_AmeStatus);
        };

        var _WMC_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            _WMC_addOriginalCommands.call(this);
            this.addCommand(MENU_TEXT, 'ameStatus', true);
        };
    }

})();
