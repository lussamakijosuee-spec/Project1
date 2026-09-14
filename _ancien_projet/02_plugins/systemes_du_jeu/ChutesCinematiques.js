//=============================================================================
// ChutesCinematiques.js — v1.0  ·  Les Chutes, à l'écran (horreur)
// RPG Maker MV   ·   by JOKO   ·   inspirations : BROKENSCRIPT, méta-horreur
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les Chutes deviennent VISIBLES : l'Errant englouti par sa
 * marque (fond dans le sol), la Bête (transformation physique), le Fond du Lac
 * (hallucinations, stickmen, glitchs, méta). Additif.
 * @author JOKO
 *
 * @param animErrant
 * @text Animation — Chute de l'Errant
 * @type animation
 * @default 358
 *
 * @param animBete
 * @text Animation — Chute de la Bête
 * @type animation
 * @default 359
 *
 * @param animFond
 * @text Animation — le Fond du Lac
 * @type animation
 * @default 360
 *
 * @param picBase
 * @text Premier ID d'image réservé
 * @type number
 * @min 1
 * @max 95
 * @default 91
 * @desc Le plugin utilise 6 IDs d'images à partir de celui-ci (91-96 par défaut). Ne les utilise pas ailleurs.
 *
 * @param beteSprite
 * @text Sprite de la Bête (transformation)
 * @type string
 * @default $BigMonster1
 * @desc Feuille de personnage prise par un héros devenu la Bête (vide = pas de transformation visuelle). Ex : $BigMonster1, Evil.
 *
 * @param beteSpriteIndex
 * @text Index dans la feuille
 * @type number
 * @min 0
 * @max 7
 * @default 0
 *
 * @param phaseHallu
 * @text Hallucinations dès la phase…
 * @type number
 * @min 1
 * @max 4
 * @default 2
 * @desc Phase mentale (≤) à partir de laquelle un héros voit ce que les autres ne voient pas (stickmen…).
 *
 * @param metaTitre
 * @text Toucher au titre de la fenêtre ? (méta)
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Au Fond du Lac, le titre de la fenêtre du jeu se met à murmurer. (BROKENSCRIPT)
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES CHUTES, À L'ÉCRAN                                               by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  AUTOMATIQUE (sur la carte) :
 *
 *  ▶ L'ERRANT (Errance = 100) — la marque recouvre entièrement le héros,
 *    il FOND LITTÉRALEMENT DANS LE SOL : animation, la marque envahit l'écran
 *    en 3 vagues, message d'oubli. (L'Oubli réel — retrait du groupe — reste
 *    ton choix de mise en scène : REINE oubli <id>.)
 *
 *  ▶ LA BÊTE (Corruption = 100) — transformation PHYSIQUE : éclat violet,
 *    secousse, la silhouette de la Bête apparaît… et le sprite du héros
 *    DEVIENT une bête (paramètre beteSprite). Il redevient lui-même si sa
 *    corruption est purgée sous 100.
 *
 *  ▶ LE FOND DU LAC (phase mentale 1) — la folie : mode BROKENSCRIPT.
 *    Tant qu'un héros du groupe est au Fond, la carte se corrompt par vagues :
 *    glitchs à l'écran, stickmen noirs qui te fixent, yeux dans le noir,
 *    fausses erreurs système, le TITRE de la fenêtre qui murmure, et le
 *    personnage qui devient conscient de sa condition (messages méta rares).
 *    Dès la phase ≤ phaseHallu (2) : hallucinations légères (silhouettes).
 *
 *  IMAGES UTILISÉES (déjà générées dans img/pictures) :
 *    glitch_overlay1-3 · stickman_regard · stickman_foule · yeux_du_fond ·
 *    erreur_ame · marque_envahissante1-3 · silhouette_bete
 *  ANIMATIONS (déjà en base) : 358 l'Errant · 359 la Bête · 360 le Fond.
 *  PERSONNAGES : $OmbreStick / $OmbreStickGrand (pose-les comme événements !)
 *
 *  COMMANDES (cutscenes) :
 *      CHUTE errant <acteurId>     joue la cinématique de l'Errant
 *      CHUTE bete <acteurId>       joue la transformation de la Bête
 *      CHUTE fond                  joue l'ouverture du Fond (œil plein écran)
 *      CHUTE calme                 coupe le mode BROKENSCRIPT (si tu scénarises)
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('ChutesCinematiques');
    var ANIM_ERRANT = parseInt(P['animErrant'] || 358);
    var ANIM_BETE = parseInt(P['animBete'] || 359);
    var ANIM_FOND = parseInt(P['animFond'] || 360);
    var PIC = parseInt(P['picBase'] || 91);
    var BETE_CHAR = String(P['beteSprite'] === undefined ? '$BigMonster1' : P['beteSprite']);
    var BETE_IDX = parseInt(P['beteSpriteIndex'] || 0);
    var PHASE_HALLU = parseInt(P['phaseHallu'] || 2);
    var META_TITRE = String(P['metaTitre'] || 'true') === 'true';

    var TITRES = ['IL TE VOIT', 'NE REGARDE PAS', 'tu m\'entends ?', 'LE LAC N\'A PAS DE FOND', '...'];
    var META_MSG = [
        '\\C[8]…tu me vois, maintenant. Derrière la vitre.\\C[0]',
        '\\C[8]Ce monde continue de tourner quand tu fermes le jeu.\\C[0]',
        '\\C[8]%1 comprend, soudain. Il n\'y a pas de hasard. Il y a une main.\\C[0]',
        '\\C[8]Les âmes errantes te regardent depuis longtemps. Tu viens seulement de les voir.\\C[0]'
    ];

    var titreOriginal = null;
    function setTitre(t) {
        if (!META_TITRE) return;
        try {
            if (titreOriginal === null) titreOriginal = document.title;
            document.title = t;
        } catch (e) {}
    }
    function restoreTitre() {
        try { if (titreOriginal !== null) document.title = titreOriginal; } catch (e) {}
    }

    function jCorr(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function jErr(id) { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }

    function store() {
        if (!$gameSystem) return {};
        if (!$gameSystem._chutesCine) $gameSystem._chutesCine = { vu: {}, sprites: {}, off: false };
        return $gameSystem._chutesCine;
    }

    //=========================================================================
    // Mini-timeline : séquences d'étapes [délaiFrames, fn] jouées sur la carte
    //=========================================================================
    var queue = [];
    function play(steps) { queue = queue.concat(steps); }
    function tickQueue() {
        if (!queue.length) return;
        var s = queue[0];
        if (s[0] > 0) { s[0]--; return; }
        queue.shift();
        try { s[1] && s[1](); } catch (e) {}
    }
    function pic(id, name, x, y, opacity, blend) {
        $gameScreen.showPicture(PIC + id, name, 0, x || 0, y || 0, 100, 100, opacity === undefined ? 255 : opacity, blend || 0);
    }
    function unpic(id) { $gameScreen.erasePicture(PIC + id); }
    function msg(t) { if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t); }

    //=========================================================================
    // CINÉMATIQUES
    //=========================================================================
    function cineErrant(actorId) {
        var a = $gameActors.actor(actorId); if (!a) return;
        var nom = a.name();
        play([
            [0, function () { $gameScreen.startTint([-40, -60, -50, 60], 40); $gamePlayer.requestAnimation(ANIM_ERRANT); }],
            [30, function () { pic(4, 'marque_envahissante1'); }],
            [40, function () { pic(4, 'marque_envahissante2'); }],
            [40, function () { pic(4, 'marque_envahissante3'); AudioManager.playSe({ name: 'Darkness3', pan: 0, pitch: 55, volume: 95 }); }],
            [50, function () { msg('\\C[2]La marque recouvre ' + nom + ' tout entier.\\C[0]'); msg('\\C[2]Il fond dans le sol — et le monde, déjà, commence à l\'oublier.\\C[0]'); }],
            [20, function () { unpic(4); $gameScreen.startTint([0, 0, 0, 0], 90); }]
        ]);
    }
    function cineBete(actorId) {
        var a = $gameActors.actor(actorId); if (!a) return;
        var nom = a.name();
        play([
            [0, function () { $gameScreen.startFlash([145, 102, 230, 220], 30); $gameScreen.startShake(7, 7, 50); $gamePlayer.requestAnimation(ANIM_BETE); }],
            [40, function () { pic(5, 'silhouette_bete', (Graphics.boxWidth - 340) / 2, (Graphics.boxHeight - 320) / 2, 0); }],
            [1, function () { $gameScreen.movePicture(PIC + 5, 0, (Graphics.boxWidth - 340) / 2, (Graphics.boxHeight - 320) / 2, 100, 100, 255, 0, 30); }],
            [45, function () {
                if (BETE_CHAR) {
                    var s = store();
                    if (!s.sprites[actorId]) s.sprites[actorId] = [a.characterName(), a.characterIndex()];
                    a.setCharacterImage(BETE_CHAR, BETE_IDX);
                    $gamePlayer.refresh();
                }
                msg('\\C[18]' + nom + ' n\'a plus de mots. Plus de raison. Rien que le mouvement,\\C[0]');
                msg('\\C[18]parfait et vide. La Bête a pris tout ce qu\'il était.\\C[0]');
            }],
            [20, function () { unpic(5); }]
        ]);
    }
    function cineFond() {
        play([
            [0, function () { AudioManager.playSe({ name: 'Darkness3', pan: 0, pitch: 45, volume: 100 }); $gameScreen.startTint([-70, -70, -50, 120], 60); if ($gamePlayer.requestAnimation) $gamePlayer.requestAnimation(ANIM_FOND); }],
            [70, function () { pic(2, 'yeux_du_fond', 0, 0, 0); $gameScreen.movePicture(PIC + 2, 0, 0, 0, 100, 100, 230, 0, 60); }],
            [80, function () { msg('\\C[1]Tout, d\'un coup.\\C[0]'); msg('\\C[8]Le Fond n\'est pas vide. Le Fond regarde.\\C[0]'); }],
            [30, function () { $gameScreen.movePicture(PIC + 2, 0, 0, 0, 100, 100, 0, 0, 90); }],
            [95, function () { unpic(2); }]
        ]);
    }

    //=========================================================================
    // SURVEILLANCE — déclenche les cinématiques au franchissement
    //=========================================================================
    function surveiller() {
        var s = store();
        $gameParty.members().forEach(function (m) {
            var id = m.actorId();
            // la Bête
            if (jCorr(id) >= 100) {
                if (!s.vu['b' + id]) { s.vu['b' + id] = true; cineBete(id); }
            } else if (s.vu['b' + id]) {
                s.vu['b' + id] = false;
                // purgé : il redevient lui-même
                var orig = s.sprites[id];
                if (orig) { var a = $gameActors.actor(id); if (a) { a.setCharacterImage(orig[0], orig[1]); $gamePlayer.refresh(); } delete s.sprites[id]; }
            }
            // l'Errant
            if (jErr(id) >= 100) {
                if (!s.vu['e' + id]) { s.vu['e' + id] = true; cineErrant(id); }
            } else s.vu['e' + id] = false;
            // le Fond
            if (phase(id) <= 1) {
                if (!s.vu['f' + id]) { s.vu['f' + id] = true; cineFond(); }
            } else s.vu['f' + id] = false;
        });
    }

    //=========================================================================
    // MODE BROKENSCRIPT — ambiance tant qu'un héros est au Fond
    //=========================================================================
    function quelquUnAuFond() {
        return $gameParty.members().some(function (m) { return phase(m.actorId()) <= 1; });
    }
    function quelquUnHallucine() {
        return $gameParty.members().some(function (m) { return phase(m.actorId()) <= PHASE_HALLU; });
    }

    function vagueHorreur() {
        var r = Math.randomInt(100);
        if (r < 30) {           // glitch
            var g = 'glitch_overlay' + (1 + Math.randomInt(3));
            pic(0, g, 0, 0, 200);
            play([[8, function () { unpic(0); }], [5, function () { pic(0, g, 0, 0, 140); }], [6, function () { unpic(0); }]]);
            AudioManager.playSe({ name: 'Darkness1', pan: 0, pitch: 150, volume: 55 });
        } else if (r < 55) {    // stickman qui te fixe
            var x = Math.randomInt(2) === 0 ? 30 : Graphics.boxWidth - 270;
            pic(1, 'stickman_regard', x, Graphics.boxHeight - 580, 0);
            $gameScreen.movePicture(PIC + 1, 0, x, Graphics.boxHeight - 580, 100, 100, 235, 0, 20);
            play([[75, function () { unpic(1); }]]);
            AudioManager.playSe({ name: 'Darkness2', pan: x < 100 ? -60 : 60, pitch: 70, volume: 70 });
        } else if (r < 72) {    // fausse erreur système
            pic(3, 'erreur_ame', (Graphics.boxWidth - 430) / 2 + Math.randomInt(120) - 60, 120 + Math.randomInt(200), 255);
            AudioManager.playSe({ name: 'Buzzer1', pan: 0, pitch: 80, volume: 70 });
            play([[50, function () { unpic(3); }]]);
        } else if (r < 88) {    // le titre murmure
            setTitre(TITRES[Math.randomInt(TITRES.length)]);
            play([[120, function () { restoreTitre(); }]]);
        } else {                // conscience méta
            var m = META_MSG[Math.randomInt(META_MSG.length)];
            var h = $gameParty.members().filter(function (x) { return phase(x.actorId()) <= 1; })[0];
            msg(m.replace('%1', h ? h.name() : '…'));
        }
    }

    function halluLegere() {
        pic(1, 'stickman_foule', 0, 0, 0);
        $gameScreen.movePicture(PIC + 1, 0, 0, 0, 100, 100, 110, 0, 40);
        play([[80, function () { unpic(1); }]]);
    }

    //=========================================================================
    // Boucle carte
    //=========================================================================
    var _updMap = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _updMap.call(this);
        try {
            tickQueue();
            if (store().off) return;
            this._chuT = (this._chuT || 0) + 1;
            if (this._chuT % 45 === 0) surveiller();
            if ($gameMessage.isBusy()) return;
            if (this._chuT % 420 === 0 && quelquUnAuFond()) {          // ~7 s : vague d'horreur
                if (Math.randomInt(100) < 65) vagueHorreur();
            } else if (this._chuT % 1080 === 0 && quelquUnHallucine()) { // ~18 s : hallucination légère
                if (Math.randomInt(100) < 30) halluLegere();
            }
        } catch (e) {}
    };

    // On quitte la carte / le Fond : remettre le titre
    var _stopMap = Scene_Map.prototype.stop;
    Scene_Map.prototype.stop = function () { restoreTitre(); _stopMap.call(this); };

    //=========================================================================
    // Commandes
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'CHUTE') return;
        var sub = (args[0] || '').toLowerCase();
        var id = parseInt(args[1]) || ($gameParty.leader() ? $gameParty.leader().actorId() : 1);
        if (sub === 'errant') cineErrant(id);
        else if (sub === 'bete' || sub === 'bête') cineBete(id);
        else if (sub === 'fond') cineFond();
        else if (sub === 'calme') { store().off = true; restoreTitre(); }
        else if (sub === 'reprendre') store().off = false;
    };
})();
