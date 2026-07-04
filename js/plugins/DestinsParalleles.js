//=============================================================================
// DestinsParalleles.js — v1.0  ·  Les vies parallèles des héros absents
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les héros non recrutés CONTINUENT LEUR VIE : leurs jauges
 * dérivent vers leur Chute, ils progressent, et quand tu les croises tu peux
 * les recruter — ou affronter ce qu'ils sont devenus. Additif.
 * @author JOKO
 *
 * @param pasParTick
 * @text Pas entre deux « battements de vie »
 * @type number
 * @min 10
 * @default 60
 * @desc Tous les N pas du groupe, la vie des absents avance d'un battement.
 *
 * @param deriveMin
 * @text Dérive min par battement
 * @type number
 * @min 0
 * @default 1
 *
 * @param deriveMax
 * @text Dérive max par battement
 * @type number
 * @min 0
 * @default 2
 *
 * @param chanceRepit
 * @text Chance de répit (%)
 * @type number
 * @min 0
 * @max 100
 * @default 30
 * @desc À chaque battement, chance que l'absent RÉSISTE (sa jauge recule au lieu d'avancer). La vie a des hauts et des bas.
 *
 * @param xpPct
 * @text Part d'XP des absents (%)
 * @type number
 * @min 0
 * @max 100
 * @default 50
 * @desc Les absents vivent leurs propres batailles : ils gagnent ce % de l'XP de tes combats.
 *
 * @param pauseSwitch
 * @text Interrupteur de pause (0 = aucun)
 * @type switch
 * @default 0
 * @desc ON = les vies parallèles se figent (cutscenes, prologue…).
 *
 * @param voieActor1
 * @text Dérive du héros 1 (Aël, l'Équilibre)
 * @type select
 * @option corps (la Bête)
 * @value corps
 * @option esprit (le Dément)
 * @value esprit
 * @option ame (l'Errant)
 * @value ame
 * @option aleatoire
 * @value aleatoire
 * @default aleatoire
 *
 * @param voieActor2
 * @text Dérive du héros 2 (Korrah, la Maîtrise)
 * @type select
 * @option corps (la Bête)
 * @value corps
 * @option esprit (le Dément)
 * @value esprit
 * @option ame (l'Errant)
 * @value ame
 * @option aleatoire
 * @value aleatoire
 * @default corps
 *
 * @param voieActor3
 * @text Dérive du héros 3 (ludwing, le Symbole)
 * @type select
 * @option corps (la Bête)
 * @value corps
 * @option esprit (le Dément)
 * @value esprit
 * @option ame (l'Errant)
 * @value ame
 * @option aleatoire
 * @value aleatoire
 * @default ame
 *
 * @param voieActor4
 * @text Dérive du héros 4 (Vesper, la Parole)
 * @type select
 * @option corps (la Bête)
 * @value corps
 * @option esprit (le Dément)
 * @value esprit
 * @option ame (l'Errant)
 * @value ame
 * @option aleatoire
 * @value aleatoire
 * @default esprit
 *
 * @param rumeurs
 * @text Rumeurs aux paliers ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Quand un absent franchit 40/70/100, une rumeur s'affiche sur la carte.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES DESTINS PARALLÈLES                                              by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Tu choisis UN héros au départ. Les trois autres ne t'attendent pas : ils
 *  vivent, luttent, et dérivent chacun vers sa propre Chute. Quand tu les
 *  croises enfin, ce que tu trouves dépend du temps écoulé — un allié à
 *  recruter, ou ce qu'il est devenu.
 *
 *  ▶ QUI EST « ABSENT » : tout acteur 1-4 qui n'est PAS dans le groupe.
 *    Recruté ($gameParty.addActor) → sa vie parallèle s'arrête, il garde ses
 *    jauges (les MêMES jauges partagées : Corruption / Errance / santé mentale).
 *
 *  ▶ LA DÉRIVE : tous les `pasParTick` pas, chaque absent avance d'un
 *    battement vers SA voie (paramétrable par héros) :
 *      corps  → +Corruption      esprit → −santé mentale      ame → +Errance
 *    …sauf répit (`chanceRepit` %) : ce jour-là, il résiste (la jauge recule).
 *
 *  ▶ ILS PROGRESSENT AUSSI : les absents gagnent xpPct % de l'XP de tes
 *    combats (ils mènent les leurs). Leur rang (RangsPuissance) suit.
 *
 *  ▶ LA CHUTE : une jauge au bout (Corruption 100 / Errance 100 / phase 1)
 *    = l'absent A CHUTÉ. À toi de scénariser la rencontre : le recruter
 *    (s'il tient debout) ou affronter ce qu'il est devenu (crée l'ennemi
 *    « Thylane, la Bête » dans la base et branche l'événement — recettes
 *    dans le GUIDE_DEVELOPPEUR).
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  COMMANDES
 *      DESTINS ecran            écran des vies parallèles
 *      DESTINS tick 20          avance la vie des absents de 20 battements
 *                               (ellipse : « trois lunes passèrent… »)
 *      DESTINS pause on|off     fige / relance les dérives
 *  SCRIPTS
 *      Destins.absent(2)        → true si l'acteur 2 vit sa vie ailleurs
 *      Destins.chute(2)         → '' | 'bete' | 'dement' | 'errant'
 *      Destins.aChute(2)        → true si l'acteur 2 a chuté
 *  ─────────────────────────────────────────────────────────────────────────
 *  RECETTE — la rencontre (événement de PNJ) :
 *      ◆ Si (Script) : Destins.chute(2) === ''
 *          ◆ dialogue…  ◆ Script : $gameParty.addActor(2)
 *      ◆ Sinon
 *          ◆ dialogue…  ◆ Lancer le combat : « Neyssa, la Démente » (ennemi)
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('DestinsParalleles');
    var TICK = parseInt(P['pasParTick'] || 60);
    var D_MIN = parseInt(P['deriveMin'] || 1);
    var D_MAX = parseInt(P['deriveMax'] || 2);
    var REPIT = parseInt(P['chanceRepit'] || 30);
    var XP_PCT = parseInt(P['xpPct'] || 50) / 100;
    var SW_PAUSE = parseInt(P['pauseSwitch'] || 0);
    var RUMEURS = String(P['rumeurs'] || 'true') === 'true';

    var VOIE = {
        1: String(P['voieActor1'] || 'aleatoire'),   // Aël — l'Équilibre qui vacille
        2: String(P['voieActor2'] || 'corps'),       // Korrah — la Maîtrise → la Bête
        3: String(P['voieActor3'] || 'ame'),         // ludwing — le Symbole → l'Errant
        4: String(P['voieActor4'] || 'esprit')       // Vesper — la Parole → le Dément
    };
    var HEROS = [1, 2, 3, 4];
    var AXES = ['corps', 'esprit', 'ame'];

    var RUMEUR_TXT = {
        corps:  { 40: 'On parle d\'yeux de braise violette, quelque part sur les routes…',
                  70: 'Un village de l\'Est murmure qu\'une bête à forme humaine rôde la nuit.',
                  100: '\\C[18]Les routes parlent d\'une Bête qu\'on ne raisonne plus. Quelqu\'un que tu connaissais.\\C[0]' },
        esprit: { 40: 'Une voyageuse parlerait seule, dit-on, à des choses que nul ne voit…',
                  70: 'On raconte qu\'une femme lit l\'avenir dans un lac — et rit sans s\'arrêter.',
                  100: '\\C[18]Un Dément erre entre les royaumes. Sa voix, dit-on, t\'est familière.\\C[0]' },
        ame:    { 40: 'Un marchand jure avoir vu quelqu\'un de translucide au clair de lune…',
                  70: 'Les liseurs de l\'Est évitent une silhouette gonflée d\'âmes volées.',
                  100: '\\C[18]Une âme errante suit les routes que tu prends. Elle te cherche, peut-être.\\C[0]' }
    };

    function store() {
        if (!$gameSystem) return {};
        if (!$gameSystem._destins) $gameSystem._destins = { pause: false, paliers: {} };
        return $gameSystem._destins;
    }
    function enPause() {
        if (store().pause) return true;
        if (SW_PAUSE > 0 && $gameSwitches && $gameSwitches.value(SW_PAUSE)) return true;
        return false;
    }
    function estAbsent(id) {
        if (!$gameParty || !$gameActors || !$gameActors.actor(id)) return false;
        return !$gameParty.members().some(function (m) { return m.actorId() === id; });
    }
    function axeDe(id) {
        var v = VOIE[id] || 'aleatoire';
        return v === 'aleatoire' ? AXES[Math.randomInt(3)] : v;
    }
    function jauge(id, axe) {
        try {
            if (axe === 'corps') return window.Corruption ? window.Corruption.niveau(id) : 0;
            if (axe === 'ame') return window.Errance ? window.Errance.niveau(id) : 0;
            if (window.Ame) { var ph = window.Ame.phase(id) || 5; return Math.round((5 - ph) / 4 * 100); }
        } catch (e) {}
        return 0;
    }
    function pousser(id, axe, n) {
        try {
            if (axe === 'corps' && window.Corruption) window.Corruption.add(id, n);
            else if (axe === 'ame' && window.Errance) window.Errance.add(id, n);
            else if (axe === 'esprit' && window.Ame) {
                if (n > 0) window.Ame.mauvais(id, Math.max(1, Math.round(n / 2)));
                else window.Ame.bon(id, Math.max(1, Math.round(-n / 2)));
            }
        } catch (e) {}
    }
    function rumeur(id, axe, seuil) {
        if (!RUMEURS || !$gameMessage || $gameMessage.isBusy()) return;
        var s = store();
        var key = id + ':' + axe + ':' + seuil;
        if (s.paliers[key]) return;
        s.paliers[key] = true;
        var txt = RUMEUR_TXT[axe] && RUMEUR_TXT[axe][seuil];
        if (txt) $gameMessage.add('\\C[16]— Rumeur —\\C[0] ' + txt);
    }

    var Destins = {
        absent: estAbsent,
        chute: function (id) {
            try {
                if (window.Corruption && window.Corruption.niveau(id) >= 100) return 'bete';
                if (window.Errance && window.Errance.niveau(id) >= 100) return 'errant';
                if (window.Ame && (window.Ame.phase(id) || 5) <= 1) return 'dement';
            } catch (e) {}
            return '';
        },
        aChute: function (id) { return this.chute(id) !== ''; },
        tick: function (fois) {
            fois = Math.max(1, fois || 1);
            for (var t = 0; t < fois; t++) {
                HEROS.forEach(function (id) {
                    if (!estAbsent(id)) return;
                    if (Destins.chute(id)) return;         // déjà au fond
                    var axe = axeDe(id);
                    var avant = jauge(id, axe);
                    var n = D_MIN + Math.randomInt(Math.max(1, D_MAX - D_MIN + 1));
                    if (Math.randomInt(100) < REPIT) n = -n;   // répit : il résiste
                    pousser(id, axe, n);
                    var apres = jauge(id, axe);
                    [40, 70, 100].forEach(function (seuil) {
                        if (avant < seuil && apres >= seuil) rumeur(id, axe, seuil);
                    });
                });
            }
        }
    };
    window.Destins = Destins;

    // La vie avance quand le groupe marche.
    var _incSteps = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function () {
        _incSteps.call(this);
        if (enPause()) return;
        if (this.steps() % TICK === 0) Destins.tick(1);
    };

    // Les absents mènent leurs propres batailles : part d'XP.
    var _gainExp = BattleManager.gainExp;
    BattleManager.gainExp = function () {
        _gainExp.call(this);
        if (XP_PCT <= 0 || enPause()) return;
        var exp = Math.floor(this._rewards.exp * XP_PCT);
        if (exp <= 0) return;
        HEROS.forEach(function (id) {
            if (!estAbsent(id)) return;
            var a = $gameActors.actor(id);
            if (a) a.changeExp(a.currentExp() + exp, false);
        });
    };

    //--- Écran des vies parallèles ---
    function Window_Destins() { this.initialize.apply(this, arguments); }
    Window_Destins.prototype = Object.create(Window_Base.prototype);
    Window_Destins.prototype.constructor = Window_Destins;
    Window_Destins.prototype.standardFontSize = function () { return 20; };
    Window_Destins.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.refresh();
    };
    Window_Destins.prototype.refresh = function () {
        this.contents.clear();
        var W = this.contentsWidth();
        this.contents.fontSize = 21; this.changeTextColor('#EBC974');
        this.drawText('LES DESTINS PARALLÈLES', 0, 2, W, 'center');
        this.contents.fontSize = 13; this.changeTextColor('#7E7688');
        this.drawText('« Eux ne t\'attendent pas. »', 0, 30, W, 'center');

        var absents = HEROS.filter(estAbsent);
        if (absents.length === 0) {
            this.contents.fontSize = 16; this.changeTextColor('#B6AE9C');
            this.drawText('Tout le monde marche à tes côtés.', 0, this.contentsHeight() / 2, W, 'center');
            this.resetFontSettings();
            return;
        }
        var NOMCHUTE = { bete: 'la Bête', dement: 'le Dément', errant: 'l\'Errant' };
        var top = 64, rowH = Math.min(110, Math.floor((this.contentsHeight() - top) / absents.length));
        for (var i = 0; i < absents.length; i++) {
            var id = absents[i], a = $gameActors.actor(id);
            var y = top + i * rowH;
            var chute = Destins.chute(id);
            this.contents.fontSize = 19; this.changeTextColor('#ECE6D8');
            this.drawText(a.name() + '  · niv ' + a.level, 8, y, 300, 'left');
            var rang = '';
            try { if (window.Rangs) rang = 'rang ' + window.Rangs.rang(id); } catch (e) {}
            this.contents.fontSize = 14; this.changeTextColor('#B6AE9C');
            this.drawText(rang, W - 130, y, 122, 'right');
            if (chute) {
                this.contents.fontSize = 16; this.changeTextColor('#F0928E');
                this.drawText('A CHUTÉ — ' + NOMCHUTE[chute], 8, y + 24, W - 16, 'left');
            } else {
                var c = jauge(id, 'corps'), e = jauge(id, 'esprit'), am = jauge(id, 'ame');
                this.contents.fontSize = 14;
                this.changeTextColor('#B79CF5'); this.drawText('Corps ' + c, 8, y + 24, 130, 'left');
                this.changeTextColor('#9CC0F5'); this.drawText('Esprit ' + e, 148, y + 24, 130, 'left');
                this.changeTextColor('#F0928E'); this.drawText('Âme ' + am, 288, y + 24, 130, 'left');
                var pire = Math.max(c, e, am);
                this.contents.fontSize = 13; this.changeTextColor('#7E7688');
                var etat = pire >= 70 ? 'au bord du gouffre' : pire >= 40 ? 'en train de glisser' : 'tient bon';
                this.drawText('— ' + etat, 428, y + 25, W - 440, 'left');
            }
        }
        this.resetFontSettings();
    };
    function Scene_Destins() { this.initialize.apply(this, arguments); }
    window.Scene_Destins = Scene_Destins;
    Scene_Destins.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Destins.prototype.constructor = Scene_Destins;
    Scene_Destins.prototype.create = function () { Scene_MenuBase.prototype.create.call(this); this._w = new Window_Destins(); this.addWindow(this._w); };
    Scene_Destins.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) { SoundManager.playCancel(); this.popScene(); }
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'DESTINS') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'ecran' || sub === 'écran') SceneManager.push(Scene_Destins);
        else if (sub === 'tick') Destins.tick(parseInt(args[1]) || 1);
        else if (sub === 'pause') store().pause = String(args[1] || 'on').toLowerCase() !== 'off';
    };
})();
