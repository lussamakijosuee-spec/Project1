//=============================================================================
// LeMur.js — v1.0 · Au-delà de la trame, quelque chose regarde (méta-horreur)
// RPG Maker MV · by JOKO / Claude · charger APRÈS JadeEntitePlunging, en DERNIER
//  des plugins Dément. Distorsion de la réalité + 4e mur. Tout est simulé.
//=============================================================================
/*:
 * @plugindesc [v1.0] Aux profondeurs du Lac (le Mur, le Fond), la réalité se
 * distord et le jeu cesse de faire peur au héros pour te viser TOI : il lit ta
 * partie et te parle. Faux plantage, titre qui ment. 100 % simulé (rien de réel).
 * @author JOKO / Claude
 *
 * @param seuilDistorsion
 * @text Phase ≤ … : la réalité se distord
 * @type number
 * @min 1
 * @max 5
 * @default 3
 * @desc La distorsion visuelle commence à cette phase mentale (3 = la Trame).
 *
 * @param seuilMur
 * @text Phase ≤ … : le Mur te parle
 * @type number
 * @min 1
 * @max 5
 * @default 2
 * @desc Les manifestations méta (4e mur) commencent à cette phase (2 = le Mur).
 *
 * @param frequence
 * @text Fréquence des manifestations (%)
 * @type number
 * @min 0
 * @max 100
 * @default 100
 * @desc Rareté des moments méta. 0 = distorsion visuelle seule, sans 4e mur.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE MUR — « le monde ne serait pas seulement vécu : il serait joué »
 * ═══════════════════════════════════════════════════════════════════════════
 *  C'est le fond du Lac, la vérité interdite du codex : au-delà de la trame,
 *  quelque chose regarde — les mains qu'on ne voit pas. La corruption ultime
 *  n'est pas de devenir fou : c'est d'entrevoir les JOUEURS et les Reprises.
 *
 *  ▶ LA DISTORSION (rework visuel) — dès la Trame, l'écran se déforme : frange
 *    chromatique qui respire, glyphes de code qui suintent aux bords (« le code
 *    sous les choses »), clignements de réalité. Plus tu sombres, plus c'est fort.
 *
 *  ▶ LE MUR TE PARLE (méta-horreur) — au Mur et au Fond, de rares manifestations
 *    ne visent plus le héros mais TOI, derrière l'écran :
 *      • il LIT ta partie (temps de jeu, sauvegardes, Reprises) et te répond ;
 *      • un FAUX plantage — écran noir, fausse erreur — puis « …non. Tu es là. » ;
 *      • le TITRE de la fenêtre ment un instant.
 *    Tout est SIMULÉ dans le jeu : aucun accès à ton ordinateur, aucune vraie
 *    erreur, rien de cassé. De l'illusion — comme Jade.
 *
 *  Se calme dès que l'esprit remonte. Commande : MUR off / on · MUR forcer.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('LeMur');
    var S_DIST = parseInt(P['seuilDistorsion'] || 3);
    var S_MUR = parseInt(P['seuilMur'] || 2);
    var FREQ = parseInt(P['frequence'] || 100) / 100;

    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }
    function leader() { return $gameParty && $gameParty.leader(); }
    function profPhase() { var l = leader(); return l ? phase(l.actorId()) : 5; }
    function actif() { return !($gameSystem && $gameSystem._murOff); }
    // intensité visuelle 0..1 (commence au seuil de distorsion)
    function intensite() {
        var p = profPhase();
        if (p > S_DIST) return 0;
        return Math.min(1, (S_DIST - p + 1) / S_DIST);
    }

    //=========================================================================
    // PART A · LA DISTORSION DE LA RÉALITÉ (calque procédural)
    //=========================================================================
    var GLY = ['0', '1', '{', '}', '/', '\\', '=', '<', '>', '#', '§', '¤', '02', '11', 'ﬦ'];

    function creerCalque(scene) {
        var W = Graphics.width, H = Graphics.height;
        var v = { root: new Sprite() };
        v.fringe = new Sprite(new Bitmap(W, H)); v.fringe.opacity = 0; v.fringe.blendMode = 1;
        v.trame = new Sprite(new Bitmap(W, H)); v.trame.opacity = 0;
        v.vignette = new Sprite(new Bitmap(W, H)); v.vignette.opacity = 0;
        v.blink = new Sprite(new Bitmap(W, H)); v.blink.bitmap.fillAll('#ffffff'); v.blink.opacity = 0; v.blink.blendMode = 1;
        v.root.addChild(v.vignette); v.root.addChild(v.fringe); v.root.addChild(v.trame); v.root.addChild(v.blink);
        v.t = 0; v.lastInt = -1; v.blinkT = 0;
        scene.addChild(v.root);
        // vignette chromatique (statique par niveau)
        return v;
    }
    function dessinerVignette(bmp, it) {
        var W = bmp.width, H = bmp.height, c = bmp.context;
        bmp.clear();
        var g = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.30, W / 2, H / 2, Math.max(W, H) * 0.62);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(4,0,10,' + (0.5 * it).toFixed(2) + ')');
        c.fillStyle = g; c.fillRect(0, 0, W, H);
        if (bmp._setDirty) bmp._setDirty();
    }
    function dessinerFringe(bmp, it, t) {
        var W = bmp.width, H = bmp.height, c = bmp.context;
        bmp.clear();
        // frange chromatique qui respire aux bords G (rouge) / D (cyan)
        var amp = 6 + it * 22 + Math.sin(t * 0.05) * 4 * it;
        for (var y = 0; y < H; y += 2) {
            var o = Math.sin(y * 0.04 + t * 0.06) * amp;
            c.fillStyle = 'rgba(200,20,40,' + (0.10 * it).toFixed(3) + ')';
            c.fillRect(0, y, 40 + o, 2);
            c.fillStyle = 'rgba(20,200,220,' + (0.10 * it).toFixed(3) + ')';
            c.fillRect(W - 40 - o, y, 40 + o, 2);
        }
        if (bmp._setDirty) bmp._setDirty();
    }
    function dessinerTrame(bmp, it, t) {
        var W = bmp.width, H = bmp.height, c = bmp.context;
        bmp.clear();
        c.font = '14px GameFont, monospace';
        var n = Math.floor(30 * it);
        for (var i = 0; i < n; i++) {
            // suinte des bords vers le centre
            var edge = Math.random();
            var x, y;
            if (edge < 0.5) { x = Math.random() < 0.5 ? Math.random() * W * 0.16 : W - Math.random() * W * 0.16; y = Math.random() * H; }
            else { y = Math.random() < 0.5 ? Math.random() * H * 0.16 : H - Math.random() * H * 0.16; x = Math.random() * W; }
            var a = (0.10 + Math.random() * 0.25) * it;
            c.fillStyle = 'rgba(120,255,170,' + a.toFixed(3) + ')';
            c.fillText(GLY[Math.floor(Math.random() * GLY.length)], x, y);
        }
        if (bmp._setDirty) bmp._setDirty();
    }

    function majCalque(v) {
        var it = actif() ? intensite() : 0;
        v.t++;
        if (it <= 0.001) {
            v.vignette.opacity = v.fringe.opacity = v.trame.opacity = 0;
            v.blink.opacity = Math.max(0, v.blink.opacity - 20);
            v.lastInt = -1;
            return;
        }
        if (Math.abs(it - v.lastInt) > 0.02) { dessinerVignette(v.vignette.bitmap, it); v.lastInt = it; }
        if (v.t % 4 === 0) dessinerFringe(v.fringe.bitmap, it, v.t);
        if (v.t % 6 === 0) dessinerTrame(v.trame.bitmap, it, v.t);
        v.vignette.opacity = Math.round(255 * it);
        v.fringe.opacity = Math.round(200 * it);
        v.trame.opacity = Math.round(220 * it);
        // léger tremblement de l'image quand c'est profond
        v.root.x = it > 0.6 && Math.random() < 0.1 ? Math.round((Math.random() * 2 - 1) * it * 3) : 0;
        // clignement de réalité
        if (v.blink.opacity > 0) v.blink.opacity -= 18;
        else if (Math.random() < 0.004 + it * 0.01) v.blink.opacity = Math.round(40 + 70 * it);
    }

    //=========================================================================
    // PART B · LE MUR TE PARLE (4e mur — tout est simulé)
    //=========================================================================
    function playtime() { try { return $gameSystem.playtimeText ? $gameSystem.playtimeText() : '??:??:??'; } catch (e) { return '??:??:??'; } }
    function saves() { try { return $gameSystem.saveCount ? $gameSystem.saveCount() : ($gameSystem._saveCount || 0); } catch (e) { return 0; } }
    function reprises() { try { return $gameSystem._reprises || $gameSystem._reprise || 0; } catch (e) { return 0; } }

    function adressePlayer() {
        var lignes = [
            '\\C[8]Tu joues depuis ' + playtime() + '.\\C[0]',
            '\\C[8]Tu crois regarder ' + (leader() ? leader().name() : 'ce héros') + '.\\C[0]',
            '\\C[18]Mais qui regarde qui ?\\C[0]'
        ];
        if (saves() > 0) {
            lignes = [
                '\\C[8]Tu as sauvegardé ' + saves() + ' fois.\\C[0]',
                '\\C[8]Aucune de ces fois ne te protège de ce que tu vas voir.\\C[0]',
                '\\C[18]Il compte, lui aussi.\\C[0]'
            ];
        } else if (reprises() > 0) {
            lignes = [
                '\\C[8]Combien de fois es-tu déjà mort ici ?\\C[0]',
                '\\C[8]' + reprises() + '. Lui, il compte. Toi, tu oublies.\\C[0]',
                '\\C[18]C\'est ça, ton confort. L\'oubli.\\C[0]'
            ];
        }
        lignes.forEach(function (l) { $gameMessage.add(l); });
    }

    // faux plantage : écran noir + fausse erreur, puis récupération (simulé)
    var faux = { on: false, sp: null, t: 0 };
    function fauxPlantage(scene) {
        if (faux.on || !scene) return;
        faux.on = true; faux.t = 0;
        try { AudioManager.stopBgm(); AudioManager.playSe({ name: 'Buzzer1', volume: 70, pitch: 60, pan: 0 }); } catch (e) {}
        var sp = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        var b = sp.bitmap; b.fillAll('#000000');
        b.fontFace = 'monospace'; b.fontSize = 18; b.textColor = '#c0c0c0';
        var err = [
            'TypeError: cannot read property \'ame\' of null',
            '    at Game_Actor.esprit (rpg_objects.js:?)',
            '    at Scene_Map.update (le_mur.js:0)',
            '',
            'La réalité a cessé de répondre.',
            'Sauvegarde corrompue ? (' + saves() + ' sauvegardes)',
        ];
        for (var i = 0; i < err.length; i++) b.drawText(err[i], 40, 60 + i * 26, Graphics.width - 80, 24, 'left');
        if (b._setDirty) b._setDirty();
        scene.addChild(sp); faux.sp = sp;
    }
    function majFauxPlantage() {
        if (!faux.on) return;
        faux.t++;
        if (faux.t === 150) {
            var b = faux.sp.bitmap;
            b.fontSize = 22; b.textColor = '#e8e8e8';
            b.drawText('…', 40, 260, 200, 28, 'left');
        }
        if (faux.t === 200) {
            var b2 = faux.sp.bitmap;
            b2.textColor = '#b07cff';
            b2.drawText('non. Je plaisante. Tu es toujours là.', 40, 300, Graphics.width - 80, 28, 'left');
            b2.textColor = '#8d8d9c';
            b2.drawText('Pour l\'instant.', 40, 334, 400, 24, 'left');
            if (b2._setDirty) b2._setDirty();
            try { AudioManager.replayBgm && AudioManager.replayBgm(); } catch (e) {}
        }
        if (faux.t > 300) {
            faux.sp.opacity -= 12;
            if (faux.sp.opacity <= 0) { if (faux.sp.parent) faux.sp.parent.removeChild(faux.sp); faux.on = false; faux.sp = null; }
        }
    }

    // le titre de la fenêtre ment un instant (navigateur : réel mais inoffensif)
    function titreMent() {
        try {
            if (typeof document === 'undefined') return;
            if (!window._murTitre) window._murTitre = document.title;
            document.title = 'IL TE VOIT';
            setTimeout(function () { try { document.title = window._murTitre; } catch (e) {} }, 4000);
        } catch (e) {}
    }

    function manifestation(scene) {
        var r = Math.random();
        if (r < 0.45) adressePlayer();
        else if (r < 0.8) { fauxPlantage(scene); }
        else { titreMent(); $gameScreen.startFlash([180, 180, 255, 120], 40);
            $gameMessage.add('\\C[8]As-tu vu ? Là-haut. Le titre.\\C[0]');
            $gameMessage.add('\\C[18]Il sait où tu es assis.\\C[0]'); }
    }

    //=========================================================================
    // Intégration carte
    //=========================================================================
    var _createUpper = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function () {
        _createUpper.call(this);
        try { this._murCalque = creerCalque(this); } catch (e) { this._murCalque = null; }
        this._murCd = 240;
    };
    var _upd = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _upd.call(this);
        try {
            if (this._murCalque) majCalque(this._murCalque);
            majFauxPlantage();
            if (!actif() || FREQ <= 0 || faux.on || $gameMessage.isBusy()) return;
            if (profPhase() > S_MUR) { this._murCd = 240; return; }
            if (--this._murCd > 0) return;
            this._murCd = 600 + Math.floor(Math.random() * 700);
            if (Math.random() < FREQ) manifestation(this);
        } catch (e) {}
    };
    // fige le joueur pendant le faux plantage
    var _canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function () { if (faux.on) return false; return _canMove.call(this); };

    //--- commande ---------------------------------------------------------------
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'MUR') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'off') { if ($gameSystem) $gameSystem._murOff = true; }
        else if (sub === 'on') { if ($gameSystem) $gameSystem._murOff = false; }
        else if (sub === 'forcer') { var sc = SceneManager._scene; if (sc instanceof Scene_Map) manifestation(sc); }
    };
})();
