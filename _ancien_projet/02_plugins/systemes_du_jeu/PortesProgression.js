//=============================================================================
// PortesProgression.js — v1.0  ·  Entraîner les trois voies & les Portes
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ « Le secret n'est pas de maxer une voie, mais d'entraîner
 * les trois » : chaque art utilisé gagne de l'entraînement (courbe du Codex),
 * et trois PORTES se déverrouillent (Fusion, Semi-Parfait, Parole ultime).
 * @author JOKO
 *
 * @param xpParUsage
 * @text Entraînement gagné par usage
 * @type number
 * @min 1
 * @default 10
 *
 * @param fusionSwitch
 * @text Porte de Fusion — interrupteur (0 = aucun)
 * @type switch
 * @default 0
 * @desc Allumé quand un héros a 2 arts au niveau 2+. Branchez-le sur FusionElements (switchId).
 *
 * @param fusionSkill
 * @text Porte de Fusion — skill apprise (0 = aucune)
 * @type skill
 * @default 0
 *
 * @param semiSwitch
 * @text Porte du Semi-Parfait — interrupteur (0 = aucun)
 * @type switch
 * @default 0
 * @desc Allumé quand un héros a les 3 arts au niveau 3+.
 *
 * @param semiSkill
 * @text Porte du Semi-Parfait — skill apprise (0 = aucune)
 * @type skill
 * @default 0
 *
 * @param ultimeSkill
 * @text Parole ultime — skill apprise (0 = aucune)
 * @type skill
 * @default 0
 * @desc Apprise quand un héros a les 3 arts au niveau 5 ET tient l'équilibre (Mana Semi-Parfait).
 *
 * @param showLog
 * @text Annoncer les gains / portes ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES TROIS VOIES & LES PORTES                                        by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  « Chaque niveau coûte un peu plus : Niv 1 = 100 · Niv 2 = 300 (cumul) ·
 *   Niv 3 = 600 · Niv 4 = 1000. » (+ Niv 5 = 1500, le sommet.)
 *
 *  ▶ ENTRAÎNEMENT (automatique, par héros) — chaque usage en combat compte :
 *      ESPRIT  : lancer une Parole (sort à coût de PM, éléments 3/6/8-16)
 *      CORPS   : une technique de Maîtrise (<Voie: ...> ou éléments 4/5)
 *      ÂME     : un art du Symbole (élément 2, skill type 9, <FrappeAme>,
 *                <Invocation>)
 *    Gain : xpParUsage par action. Courbe cumulée : 100/300/600/1000/1500.
 *
 *  ▶ LES TROIS PORTES (vérifiées après chaque gain) :
 *      ① FUSION DE SORTS   — 2 arts au niveau 2+  → interrupteur + skill.
 *      ② MANA SEMI-PARFAIT — 3 arts au niveau 3+  → interrupteur + skill.
 *      ③ PAROLE ULTIME     — 3 arts au niveau 5 ET l'équilibre tenu
 *                            (window.Equilibre = 'semiparfait') → skill.
 *    Chaque porte ne s'annonce qu'une fois par héros. Les paramètres à 0 sont
 *    ignorés (vous pouvez ne brancher que ce qui vous intéresse).
 *
 *  ▶ COMMANDES & SCRIPTS
 *    PORTES ecran                      écran d'entraînement du groupe
 *    PORTES xp <acteurId> <art> <n>    donner de l'entraînement à la main
 *                                      (art = esprit | corps | ame)
 *    Portes.niveau(actorId, 'corps')   → 0-5
 *    Portes.xp(actorId, 'esprit')      → entraînement cumulé
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('PortesProgression');
    var XP_USE = parseInt(P['xpParUsage'] || 10);
    var SW_FUSION = parseInt(P['fusionSwitch'] || 0);
    var SK_FUSION = parseInt(P['fusionSkill'] || 0);
    var SW_SEMI = parseInt(P['semiSwitch'] || 0);
    var SK_SEMI = parseInt(P['semiSkill'] || 0);
    var SK_ULTIME = parseInt(P['ultimeSkill'] || 0);
    var SHOW = String(P['showLog'] || 'true') === 'true';

    var SEUILS = [100, 300, 600, 1000, 1500];   // cumul → niv 1..5 (courbe du Codex)
    var ARTS = ['esprit', 'corps', 'ame'];
    var NOMS = { esprit: 'l\'Esprit', corps: 'le Corps', ame: 'l\'Âme' };
    var COLS = { esprit: '#9CC0F5', corps: '#B79CF5', ame: '#F0928E' };

    function log(t) {
        if (!SHOW) return;
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.addText(t); }
        else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t);
    }
    function store() {
        if (!$gameSystem) return {};
        if (!$gameSystem._portes) $gameSystem._portes = { xp: {}, unlocked: {} };
        return $gameSystem._portes;
    }
    function xpOf(id, art) {
        var s = store(); var a = s.xp[id];
        return (a && a[art]) || 0;
    }
    function niveauOf(id, art) {
        var xp = xpOf(id, art), niv = 0;
        for (var i = 0; i < SEUILS.length; i++) { if (xp >= SEUILS[i]) niv = i + 1; }
        return niv;
    }

    var Portes = {
        xp: xpOf,
        niveau: niveauOf,
        gagner: function (id, art, n) {
            if (ARTS.indexOf(art) < 0 || !id) return;
            var s = store();
            if (!s.xp[id]) s.xp[id] = {};
            var avant = niveauOf(id, art);
            s.xp[id][art] = (s.xp[id][art] || 0) + (n || XP_USE);
            var apres = niveauOf(id, art);
            if (apres > avant) {
                var a = $gameActors && $gameActors.actor(id);
                log('\\C[16]' + (a ? a.name() : '') + ' progresse dans ' + NOMS[art] + ' — niveau ' + apres + '.\\C[0]');
            }
            this.verifierPortes(id);
        },
        verifierPortes: function (id) {
            var s = store();
            var a = $gameActors && $gameActors.actor(id);
            if (!a) return;
            var u = s.unlocked[id] || (s.unlocked[id] = {});
            var niveaux = ARTS.map(function (art) { return niveauOf(id, art); });
            var nb2 = niveaux.filter(function (n) { return n >= 2; }).length;
            var nb3 = niveaux.filter(function (n) { return n >= 3; }).length;
            var nb5 = niveaux.filter(function (n) { return n >= 5; }).length;

            // ① Porte de Fusion : 2 arts niv 2+
            if (!u.fusion && nb2 >= 2) {
                u.fusion = true;
                if (SW_FUSION > 0 && $gameSwitches) $gameSwitches.setValue(SW_FUSION, true);
                if (SK_FUSION > 0) a.learnSkill(SK_FUSION);
                log('\\C[14]★ Porte de Fusion — ' + a.name() + ' peut mêler les éléments.\\C[0]');
            }
            // ② Porte du Semi-Parfait : 3 arts niv 3+
            if (!u.semi && nb3 >= 3) {
                u.semi = true;
                if (SW_SEMI > 0 && $gameSwitches) $gameSwitches.setValue(SW_SEMI, true);
                if (SK_SEMI > 0) a.learnSkill(SK_SEMI);
                log('\\C[14]★ Porte du Semi-Parfait — les trois sources s\'accordent en ' + a.name() + '.\\C[0]');
            }
            // ③ Parole ultime : 3 arts niv 5 + équilibre tenu
            if (!u.ultime && nb5 >= 3) {
                var equil = false;
                try { equil = !!(window.Equilibre && window.Equilibre.etat(id) === 'semiparfait'); } catch (e) {}
                if (equil) {
                    u.ultime = true;
                    if (SK_ULTIME > 0) a.learnSkill(SK_ULTIME);
                    log('\\C[14]★ LA PAROLE ULTIME — ' + a.name() + ' tient les trois voies au sommet, en équilibre.\\C[0]');
                }
            }
        }
    };
    window.Portes = Portes;

    //--- Détection de l'art utilisé (mêmes conventions que les autres plugins) --
    function artOf(action) {
        var it = action && action.item && action.item();
        if (!it || !action.isSkill || !action.isSkill()) return '';
        var el = it.damage ? it.damage.elementId : 0;
        if (it.meta && (it.meta.FrappeAme || it.meta.Invocation)) return 'ame';
        if (el === 2 || it.stypeId === 9) return 'ame';
        if ((it.meta && it.meta.Voie) || el === 4 || el === 5) return 'corps';
        if ((it.mpCost || 0) > 0 && (el === 3 || el === 6 || (el >= 8 && el <= 16))) return 'esprit';
        return '';
    }

    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        if (this._portesCompte || !$gameParty.inBattle()) return;
        this._portesCompte = true;   // une fois par action, même multi-cibles
        var s = this.subject();
        if (!s || !s.isActor || !s.isActor()) return;
        var art = artOf(this);
        if (art) Portes.gagner(s.actorId(), art, XP_USE);
    };

    //--- Écran d'entraînement ---
    function Window_Portes() { this.initialize.apply(this, arguments); }
    Window_Portes.prototype = Object.create(Window_Base.prototype);
    Window_Portes.prototype.constructor = Window_Portes;
    Window_Portes.prototype.standardFontSize = function () { return 20; };
    Window_Portes.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.refresh();
    };
    Window_Portes.prototype.refresh = function () {
        this.contents.clear();
        var W = this.contentsWidth();
        this.contents.fontSize = 21; this.changeTextColor('#EBC974');
        this.drawText('L\'ENTRAÎNEMENT DES TROIS VOIES', 0, 2, W, 'center');
        this.contents.fontSize = 13; this.changeTextColor('#7E7688');
        this.drawText('« Les faibles choisissent une voie. Les forts les portent toutes. »', 0, 30, W, 'center');

        var members = $gameParty.members();
        var top = 64, rowH = Math.min(104, Math.floor((this.contentsHeight() - top) / Math.max(1, members.length)));
        for (var i = 0; i < members.length; i++) {
            var a = members[i], id = a.actorId();
            var y = top + i * rowH;
            this.contents.fontSize = 19; this.changeTextColor('#ECE6D8');
            this.drawText(a.name(), 8, y, 180, 'left');
            for (var k = 0; k < ARTS.length; k++) {
                var art = ARTS[k], niv = niveauOf(id, art), xp = xpOf(id, art);
                var next = niv < 5 ? SEUILS[niv] : SEUILS[4];
                var by = y + 26 + k * 22;
                this.contents.fontSize = 13; this.changeTextColor(COLS[art]);
                this.drawText(NOMS[art] + '  niv ' + niv, 8, by - 4, 150, 'left');
                var bw = W - 260;
                this.contents.fillRect(160, by, bw, 10, 'rgba(0,0,0,0.5)');
                var fill = niv >= 5 ? 1 : Math.min(1, xp / next);
                this.contents.fillRect(161, by + 1, Math.floor((bw - 2) * fill), 8, COLS[art]);
                this.changeTextColor('#7E7688');
                this.drawText(niv >= 5 ? 'sommet' : (xp + ' / ' + next), W - 92, by - 4, 88, 'right');
            }
        }
        this.resetFontSettings();
    };
    function Scene_Portes() { this.initialize.apply(this, arguments); }
    window.Scene_Portes = Scene_Portes;
    Scene_Portes.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Portes.prototype.constructor = Scene_Portes;
    Scene_Portes.prototype.create = function () { Scene_MenuBase.prototype.create.call(this); this._w = new Window_Portes(); this.addWindow(this._w); };
    Scene_Portes.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) { SoundManager.playCancel(); this.popScene(); }
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'PORTES') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'ecran' || sub === 'écran') SceneManager.push(Scene_Portes);
        else if (sub === 'xp') Portes.gagner(parseInt(args[1]) || 0, String(args[2] || '').toLowerCase(), parseInt(args[3]) || XP_USE);
    };
})();
