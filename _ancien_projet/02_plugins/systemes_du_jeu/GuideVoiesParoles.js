//=============================================================================
// GuideVoiesParoles.js — v1.0 · L'écran qui explique (pensé pour le joueur)
// RPG Maker MV   ·   à charger APRÈS MaitriseVoies et ParolesSysteme
//=============================================================================
/*:
 * @plugindesc [v1.0] Un écran clair qui EXPLIQUE les Voies (ta façon de te
 * battre + son Prix) et les Paroles (ta magie selon ta santé mentale), en
 * langage joueur. Barres de maîtrise + jauge de fiabilité. Rien à deviner.
 * @author Claude
 *
 * @param nomMenu
 * @text Nom dans le menu / le guide
 * @type string
 * @default Voies & Paroles
 *
 * @param ajouterMenu
 * @text Ajouter au menu principal
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Tente d'ajouter l'entrée au menu. Si tu utilises YEP_MainMenuManager,
 *       laisse sur Non et pointe une commande vers SceneManager.push(Scene_GuideVP).
 *
 * @help
 * ════════════════════════════════════════════════════════════════════════
 *  GUIDE — VOIES & PAROLES
 * ════════════════════════════════════════════════════════════════════════
 *  Deux systèmes puissants de ce jeu sont, sans écran, difficiles à saisir.
 *  Ce plugin ajoute UN écran qui les rend limpides pour le joueur :
 *
 *   • LES VOIES (le Corps) — ta façon de frapper. Chaque Voie a un effet
 *     signature ET un Prix (un revers). L'écran montre ton NIVEAU de maîtrise
 *     par Voie (barre), ce que ça fait, et comment l'éveiller.
 *
 *   • LES PAROLES (la magie) — chaque sort est une « parole ». Plus elle est
 *     longue, plus elle est forte… mais plus elle peut se briser. Ce qui la
 *     tient, c'est ta SANTÉ MENTALE. L'écran affiche ta lucidité et la
 *     FIABILITÉ concrète (%) d'une parole courte / moyenne / longue.
 *
 *  Aucune valeur inventée : tout est lu sur les vrais systèmes
 *  (window.Voies, window.Ame, paramètres de ParolesSysteme).
 *
 *  OUVRIR L'ÉCRAN :
 *    • Commande d'événement :  GUIDEVP        (un livre, un PNJ, un tuto…)
 *    • Script :                SceneManager.push(Scene_GuideVP)
 *    • Menu principal : param « Ajouter au menu » (ou via YEP_MainMenuManager).
 *
 *  DANS L'ÉCRAN :  ← →  changer de héros   ·   ↑ ↓  défiler   ·   Échap  retour
 * ════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('GuideVoiesParoles');
    var NOM = String(P['nomMenu'] || 'Voies & Paroles');
    var ADD_MENU = String(P['ajouterMenu'] || 'true') === 'true';

    // Paramètres lus sur ParolesSysteme (pour recalculer la fiabilité à l'identique)
    var PP = PluginManager.parameters('ParolesSysteme');
    var TALENT_F = String(PP['TalentFormula'] || 'a.mat');
    var TF = parseFloat(PP['CombatWindow'] || 5) || 5;
    // Paramètres lus sur MaitriseVoies
    var VP = PluginManager.parameters('MaitriseVoies');
    var MAST_CAP = parseFloat(VP['masteryCap']) || 40;
    var MAST_SCALE = (parseFloat(VP['masteryScale']) || 0.5) / 100;

    //=========================================================================
    // Lecture des vraies données
    //=========================================================================
    function mastery(actorId, voie) {
        try { return window.Voies ? (window.Voies.mastery(actorId, voie) || 0) : 0; } catch (e) { return 0; }
    }
    // santé mentale 0..1 (jauge 1–10 en priorité, sinon phase 1–5)
    function sante(actorId) {
        try {
            if (window.Ame) {
                if (typeof window.Ame.jauge === 'function') {
                    var g = window.Ame.jauge(actorId);
                    if (g) return Math.max(0, Math.min(1, g / 10));
                }
                if (typeof window.Ame.phase === 'function') {
                    var p = window.Ame.phase(actorId);
                    if (p) return Math.max(0, Math.min(1, p / 5));
                }
            }
        } catch (e) {}
        return 0.7;
    }
    function talent(actor) {
        try { return Math.max(1, Function('a', 'return (' + TALENT_F + ');')(actor)); }
        catch (e) { return Math.max(1, (actor && actor.mat) || 1); }
    }
    // fiabilité d'une parole de longueur L pour cet acteur (0..1) — formule ParolesSysteme
    function fiabilite(actor, L) {
        var Kd = talent(actor) * Math.max(0.15, sante(actor.actorId()));
        var Kr = 8 * Math.pow(L, 1.8);
        var Tinc = 0.8 * L;
        return Math.max(0, Math.min(1, Math.min(1, Kd / Kr) * Math.min(1, TF / Tinc)));
    }

    //=========================================================================
    // Textes joueur — les 5 Voies + les 4 avancées
    //=========================================================================
    // [clé, Nom, couleur, ce que ça fait, le Prix, comment l'éveiller, avancée?]
    var VOIES = [
        ['forge',  'FORGE',  '#ff8a3d', 'Le Point Final : tes coups frappent très fort.',
                   'Prix : tout ou rien. Si la frappe rate, tu te blesses.', false],
        ['onde',   'ONDE',   '#54b8ff', 'Le Reflux : la prochaine attaque ennemie est renvoyée.',
                   'Prix : il faut encaisser pour riposter — question de timing.', false],
        ['source', 'SOURCE', '#5fe08a', 'Le Reflux des chairs : tes techniques te soignent.',
                   'Prix : ça t\'expose à l\'Errance — tu commences à t\'égarer.', false],
        ['miroir', 'MIROIR', '#7fe6e0', 'Le Renvoi : réduit la prochaine attaque et la retourne.',
                   'Prix : défensif — il faut provoquer le coup pour le renvoyer.', false],
        ['vide',   'VIDE',   '#b98cff', 'L\'Immobile : traverse la défense adverse.',
                   'Prix : chaque usage t\'enfonce vers la Bête (corruption).', false],
        ['eclair', 'ÉCLAIR', '#ffe14d', 'Plus de coups critiques, plus souvent.',
                   'Prix : discipline — l\'éclat n\'attend pas.', true],
        ['domaine','DOMAINE','#ff6ad5', 'Territoire : touche garantie et dégâts accrus.',
                   'Prix : ouvrir un Domaine puise très profond (corruption).', true],
        ['flash',  'ÉCLAT NOIR','#ff5a5a', 'Une chance de frappe dévastatrice.',
                   'Prix : l\'Éclat se paie sur toi-même.', true],
        ['sang',   'SANG',   '#e0405a', 'Vole des PV à l\'ennemi que tu frappes.',
                   'Prix : le sang nourrit la Bête en toi (corruption).', true]
    ];

    function rangVoie(m) {
        if (m <= 0) return 'Dormante';
        if (m < MAST_CAP * 0.28) return 'Éveil';
        if (m < MAST_CAP * 0.55) return 'Adepte';
        if (m < MAST_CAP * 0.80) return 'Maître';
        return 'Légende';
    }
    function nomSante(p) {
        p *= 100;
        if (p >= 80) return 'Lucide';
        if (p >= 55) return 'Fragile';
        if (p >= 30) return 'Vacillant';
        return 'Au bord du gouffre';
    }
    function couleurSante(p) { return p >= 0.8 ? '#7fe6e0' : p >= 0.55 ? '#ffe14d' : p >= 0.3 ? '#ff8a3d' : '#ff5a5a'; }
    function tierFiab(f) {
        if (f >= 0.85) return { t: 'SÛR', c: '#5fe08a' };
        if (f >= 0.6)  return { t: 'RISQUÉ', c: '#ffe14d' };
        if (f >= 0.35) return { t: 'FRAGILE', c: '#ff8a3d' };
        return { t: 'DANGER', c: '#ff5a5a' };
    }

    //=========================================================================
    // Fenêtre du guide (dessin manuel + défilement)
    //=========================================================================
    function Window_GuideVP() { this.initialize.apply(this, arguments); }
    Window_GuideVP.prototype = Object.create(Window_Base.prototype);
    Window_GuideVP.prototype.constructor = Window_GuideVP;

    Window_GuideVP.prototype.initialize = function (x, y, w, h) {
        Window_Base.prototype.initialize.call(this, x, y, w, h);
        this._actor = null;
        this._scroll = 0;
        this._contentH = 0;
    };
    Window_GuideVP.prototype.setActor = function (actor) {
        if (this._actor !== actor) { this._actor = actor; this._scroll = 0; this.refresh(); }
    };
    Window_GuideVP.prototype.scrollBy = function (d) {
        var max = Math.max(0, this._contentH - this.contentsHeight());
        var ns = Math.max(0, Math.min(max, this._scroll + d));
        if (ns !== this._scroll) { this._scroll = ns; this.refresh(); }
    };

    // helpers de dessin
    Window_GuideVP.prototype._txt = function (s, x, y, w, align, color, size) {
        this.contents.fontSize = size || 20;
        this.changeTextColor(color || '#ffffff');
        this.contents.drawText(s, x, y - this._scroll, w, (size || 20) + 8, align || 'left');
    };
    Window_GuideVP.prototype._sep = function (y) {
        this.contents.paintOpacity = 90;
        this.contents.fillRect(0, y - this._scroll, this.contentsWidth(), 2, '#ffffff');
        this.contents.paintOpacity = 255;
    };

    Window_GuideVP.prototype.refresh = function () {
        this.contents.clear();
        if (!this._actor) return;
        var a = this._actor, W = this.contentsWidth(), y = 0;

        // ── Titre + héros ────────────────────────────────────────────────
        this._txt('GUIDE — VOIES & PAROLES', 0, y, W, 'left', '#cfe6ea', 26); y += 40;
        this._txt(a.name(), 0, y, W, 'left', '#ffffff', 24);
        this._txt('← →  changer de héros    ↑ ↓  défiler    Échap  retour', 0, y + 4, W, 'right', '#9aa0b0', 16);
        y += 40;

        // ── Santé mentale ────────────────────────────────────────────────
        var p = sante(a.actorId());
        var ph = (window.Ame && Ame.phase) ? (Ame.phase(a.actorId()) || Math.round(p * 5)) : Math.round(p * 5);
        var mi = window.LoreCanon ? LoreCanon.mental(ph) : { nom: nomSante(p), couleur: couleurSante(p) };
        this._txt('Santé mentale — ' + mi.nom, 0, y, W, 'left', mi.couleur, 20); y += 30;
        this.drawGauge(2, y - 22 - this._scroll, W - 4, p, mi.couleur, '#ffffff');
        this._txt(Math.round(p * 100) + ' %', 0, y - 4, W - 6, 'right', '#e8e8e8', 16); y += 22;
        this._txt('C\'est elle qui tient tes Paroles. Esprit clair = magie sûre ; esprit qui vacille = ratés.',
                  0, y, W, 'left', '#9aa0b0', 16); y += 32;

        // ── LES VOIES ────────────────────────────────────────────────────
        this._sep(y); y += 10;
        this._txt('◆ LES VOIES DU CORPS', 0, y, W, 'left', '#ffcf6a', 22); y += 30;
        this._txt('Ta façon de te battre. Chacune a un effet signature… et un Prix.',
                  0, y, W, 'left', '#9aa0b0', 16); y += 30;

        VOIES.forEach(function (v) {
            var m = mastery(a.actorId(), v[0]);
            if (v[5] && m <= 0) return; // Voie avancée non éveillée : on ne l'affiche pas encore
            var rate = Math.max(0, Math.min(1, m / MAST_CAP));
            // nom + rang + niveau
            this._txt(v[1], 0, y, W * 0.5, 'left', v[2], 20);
            this._txt(rangVoie(m) + '   ·   Niv. ' + m + ' / ' + MAST_CAP, 0, y, W, 'right',
                      m > 0 ? '#e8e8e8' : '#7a7f8c', 18);
            y += 26;
            // barre de maîtrise
            this.drawGauge(2, y - 22 - this._scroll, W - 4, rate, v[2], '#ffffff');
            y += 10;
            // effet + prix, ou comment l'éveiller
            if (m > 0) {
                var bonus = Math.round(m * MAST_SCALE * 100);
                this._txt(v[3] + (bonus ? '  (+' + bonus + '% à force égale)' : ''), 8, y, W - 8, 'left', '#d8dbe4', 17); y += 24;
                this._txt(v[4], 8, y, W - 8, 'left', '#ff9a5a', 17); y += 30;
            } else {
                this._txt(v[3], 8, y, W - 8, 'left', '#8b909c', 17); y += 24;
                this._txt('Dormante — utilise une technique « ' + v[1] + ' » en combat pour l\'éveiller.',
                          8, y, W - 8, 'left', '#7a7f8c', 16); y += 30;
            }
        }, this);

        // ── LES PAROLES ──────────────────────────────────────────────────
        y += 4; this._sep(y); y += 10;
        this._txt('◆ LES PAROLES (magie)', 0, y, W, 'left', '#8fd3ff', 22); y += 30;
        this._txt('Chaque sort est une parole. Plus elle est LONGUE, plus elle est forte —',
                  0, y, W, 'left', '#d8dbe4', 17); y += 24;
        this._txt('mais plus elle risque de se briser (contrecoup). Ta lucidité la tient.',
                  0, y, W, 'left', '#d8dbe4', 17); y += 32;

        [['Parole courte', 3], ['Parole moyenne', 4], ['Parole longue', 5]].forEach(function (row) {
            var f = fiabilite(a, row[1]), tf = tierFiab(f);
            this._txt(row[0] + ' (L' + row[1] + ')', 8, y, W * 0.5, 'left', '#e8e8e8', 18);
            this._txt(Math.round(f * 100) + ' %', 0, y, W * 0.62, 'right', '#e8e8e8', 18);
            this._txt(tf.t, 0, y, W, 'right', tf.c, 18);
            y += 24;
            this.drawGauge(8, y - 20 - this._scroll, W - 16, f, tf.c, '#ffffff');
            y += 22;
        }, this);
        y += 6;
        var conseil = p >= 0.7
            ? 'Conseil : ton esprit tient — tu peux tenter les longues paroles et les Ultimes.'
            : p >= 0.4
                ? 'Conseil : reste sur des paroles courtes/moyennes ; les longues vont vaciller.'
                : 'Conseil : uniquement des paroles courtes. Soigne ta lucidité avant tout.';
        this._txt(conseil, 0, y, W, 'left', couleurSante(p), 17); y += 30;

        this._contentH = y + this._scroll; // hauteur totale absolue
    };

    //=========================================================================
    // Scène du guide
    //=========================================================================
    function Scene_GuideVP() { this.initialize.apply(this, arguments); }
    Scene_GuideVP.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_GuideVP.prototype.constructor = Scene_GuideVP;

    Scene_GuideVP.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        var x = 24, y = 24, w = Graphics.boxWidth - 48, h = Graphics.boxHeight - 48;
        this._win = new Window_GuideVP(x, y, w, h);
        this.addWindow(this._win);
        var members = $gameParty.members();
        this._idx = 0;
        var cur = $gameParty.menuActor ? $gameParty.menuActor() : null;
        if (cur) { var i = members.indexOf(cur); if (i >= 0) this._idx = i; }
        this._setActor();
    };
    Scene_GuideVP.prototype._setActor = function () {
        var m = $gameParty.members();
        if (!m.length) return;
        this._idx = (this._idx + m.length) % m.length;
        this._win.setActor(m[this._idx]);
    };
    Scene_GuideVP.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isRepeated('down'))  this._win.scrollBy(36);
        if (Input.isRepeated('up'))    this._win.scrollBy(-36);
        if (Input.isTriggered('right') || Input.isTriggered('pagedown')) { SoundManager.playCursor(); this._idx++; this._setActor(); }
        if (Input.isTriggered('left')  || Input.isTriggered('pageup'))   { SoundManager.playCursor(); this._idx--; this._setActor(); }
        if (Input.isTriggered('cancel')) { SoundManager.playCancel(); this.popScene(); }
    };

    window.Scene_GuideVP = Scene_GuideVP;

    //=========================================================================
    // Ouverture : commande d'événement + (option) menu
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() === 'GUIDEVP') SceneManager.push(Scene_GuideVP);
    };

    if (ADD_MENU) {
        var _addOrig = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            _addOrig.call(this);
            if (!this._guideVPAdded) { this.addCommand(NOM, 'guideVP', true); this._guideVPAdded = true; }
        };
        var _createCmd = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _createCmd.call(this);
            this._commandWindow.setHandler('guideVP', function () { SceneManager.push(Scene_GuideVP); }.bind(this));
        };
    }
})();
