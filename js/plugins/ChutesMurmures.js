//=============================================================================
// ChutesMurmures.js — v2.0 · Trois voix murmurent · Poème des âmes
// RPG Maker MV   ·   à charger APRÈS ChutesLacMusique
//=============================================================================
/*:
 * @plugindesc [v2.0] Chaque Chute murmure la sienne : le Lac invite à couler
 * (Dément), le Sang réclame la chasse (Bête), les Dévorés appellent à partir
 * (Errant). De plus en plus fort en sombrant. + un POÈME des âmes tombées.
 * @author JOKO / Claude
 *
 * @param seuil
 * @text Seuil des murmures (%)
 * @type number
 * @min 0
 * @max 90
 * @default 18
 * @desc En dessous de ce % de pression de Chute, le Lac se tait.
 *
 * @param sons
 * @text Souffle chuchoté
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Un « shhh » synthétisé accompagne chaque murmure (WebAudio).
 *
 * @param variableAmes
 * @text Variable « nombre d'âmes » (option)
 * @type variable
 * @default 0
 * @desc Si > 0 et non nulle, force le nombre d'âmes du poème. Sinon : héros tombés (Chutes).
 *
 * @param themePoeme
 * @text Thème musical du poème
 * @type number
 * @min 0
 * @max 29
 * @default 20
 * @desc Index du thème ChutesLacMusique joué pendant le poème (20 = Berceuse du Fond).
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE LAC MURMURE — et compte les âmes
 * ═══════════════════════════════════════════════════════════════════════════
 *  ▶ MURMURES — quand la santé mentale d'un héros s'effondre (phase mentale),
 *    des mots doux flottent à l'écran : « laisse-toi couler… », « détends-toi… »,
 *    « l'eau est douce… ». L'invitation à lâcher prise, à se laisser aller dans
 *    le lac. Plus il sombre, plus les murmures sont nombreux et pressants.
 *    (calques non interactifs, aucun conflit)
 *
 *  ▶ POÈME DES ÂMES — un poème récité sur voile noir, qui S'ADAPTE au nombre
 *    d'âmes déjà tombées au fond : plus il y a de disparus, plus le fond « se
 *    remplit », plus le poème appelle. Le compte vient de Chutes (héros perdus)
 *    ou d'une variable de jeu si tu préfères la piloter.
 *    Pendant le poème, la musique du Lac (ChutesLacMusique) se lève.
 *
 *  COMMANDES :
 *      CHUTEPOEME            récite le poème (nombre d'âmes automatique)
 *      CHUTEPOEME <n>        récite le poème pour n âmes (mise en scène)
 *      CHUTEMURMURE off/on   coupe / rallume les murmures
 *  SCRIPT :
 *      ChutesMurmures.nbAmes()   → nombre d'âmes retenu
 *      ChutesMurmures.poeme()    → déclenche le poème
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('ChutesMurmures');
    var SEUIL = Number(P['seuil'] || 18) / 100;
    var SONS = String(P['sons'] || 'true') === 'true';
    var VAR_AMES = Number(P['variableAmes'] || 0);
    var THEME_POEME = Number(P['themePoeme'] || 20);

    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }
    function jErr(id)  { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function jCorr(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }

    // Les trois pressions du groupe (0..1). Le Lac (mental) déclenche aussi le poème.
    function pressionsVoies() {
        var f = 0, b = 0, e = 0;
        if ($gameParty) $gameParty.members().forEach(function (a) {
            var id = a.actorId();
            f = Math.max(f, window.ChutesNoyau ? ChutesNoyau.mentalActeur(id) : (3 - phase(id)) / 2);
            b = Math.max(b, window.ChutesNoyau ? ChutesNoyau.beteActeur(id)   : (jCorr(id) - 40) / 60);
            e = Math.max(e, window.ChutesNoyau ? ChutesNoyau.errantActeur(id) : (jErr(id)  - 40) / 60);
        });
        return { fond: f.clamp(0, 1), bete: b.clamp(0, 1), errant: e.clamp(0, 1) };
    }
    function pression() { return pressionsVoies().fond; } // le Lac = mental (poème)
    function actif() { return !($gameSystem && $gameSystem._murmureOff); }

    //=========================================================================
    // Nombre d'âmes tombées
    //=========================================================================
    function nbAmes() {
        if (VAR_AMES > 0 && $gameVariables) {
            var v = $gameVariables.value(VAR_AMES);
            if (v && v > 0) return v;
        }
        var n = 0;
        try {
            if (window.Chutes && Chutes.perdu) {
                for (var id = 1; id <= 20; id++) { if ($dataActors && $dataActors[id] && Chutes.perdu(id)) n++; }
            }
        } catch (e) {}
        return n;
    }

    //=========================================================================
    // Souffle chuchoté synthétisé (WebAudio)
    //=========================================================================
    function souffle(pan, force) {
        if (!SONS) return;
        try {
            var ctx = (window.WebAudio && WebAudio._context) ? WebAudio._context : null;
            if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume();
            var dur = 0.5 + Math.random() * 0.5;
            var n = ctx.sampleRate * dur;
            var buf = ctx.createBuffer(1, n, ctx.sampleRate);
            var d = buf.getChannelData(0);
            for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1);
            var src = ctx.createBufferSource(); src.buffer = buf;
            var bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
            bp.frequency.value = 1400 + Math.random() * 1200; bp.Q.value = 3 + Math.random() * 4;
            var g = ctx.createGain();
            g.gain.setValueAtTime(0.0001, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.03 * (force || 1), ctx.currentTime + dur * 0.35);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
            var pn = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
            src.connect(bp); bp.connect(g);
            if (pn) { pn.pan.value = (pan || 0); g.connect(pn); pn.connect(ctx.destination); }
            else g.connect(ctx.destination);
            src.start(); src.stop(ctx.currentTime + dur + 0.05);
        } catch (e) {}
    }

    //=========================================================================
    // MURMURES — mots flottants qui invitent à lâcher prise
    //=========================================================================
    // Le LAC (Dément) — l'invitation à se laisser couler
    var MURMURES = [
        'laisse-toi couler…', 'détends-toi…', 'l\'eau est si douce…', 'ferme les yeux…',
        'plus besoin de lutter…', 'viens te reposer…', 'le lac te tiendra…',
        'personne ne t\'en voudra…', 'tu es fatigué, non ?', 'laisse le fond te prendre…',
        'respire, tout doucement…', 'reste avec nous, en bas…', 'tout s\'arrête ici…',
        'abandonne, c\'est doux…', 'glisse… glisse…', 'ce n\'est pas grave de lâcher…'
    ];
    // Le SANG (Bête) — la faim qui monte, l'appel de la chasse
    var MURMURES_SANG = [
        'cours…', 'chasse…', 'mords…', 'tu les sens ? leur sang…', 'lâche prise, laisse-moi sortir…',
        'plus de mots… juste courir…', 'ils sont si lents, si tendres…', 'la meute t\'attend…',
        'tu as faim, avoue-le…', 'arrête de te retenir…', 'deviens ce que tu es…', 'goûte…',
        'la nuit t\'appartient…', 'rappelle-toi… tu étais un dieu…'
    ];
    // Les DÉVORÉS (Errant) — les âmes prises qui parlent depuis la marque
    var MURMURES_AMES = [
        'personne ne te retient…', 'tu peux partir, maintenant…', 'deviens léger…',
        'on t\'a gardé une place, là-haut…', 'ton nom pèse trop lourd, laisse-le…',
        'nous sommes tant, en toi…', 'plus rien ne t\'amarre…', 'traverse…',
        'entends-tu la musique ?', 'les étoiles noires t\'attendent…', 'lâche la rive…',
        'tu ne sens déjà plus le froid…', 'oublie, c\'est plus léger…', 'flotte avec nous…'
    ];
    var PALV = {
        fond:   { pool: MURMURES, col: function (pr) { return 'rgba(' + (120 + (pr * 40 | 0)) + ',' + (150 + (pr * 60 | 0)) + ',' + (170 + (pr * 50 | 0)) + ',1)'; }, out: 'rgba(0,10,20,0.5)', pan: 'lat', son: 0.6 },
        bete:   { pool: MURMURES_SANG, col: function (pr) { return 'rgba(' + (170 + (pr * 60 | 0)) + ',' + (40 - (pr * 30 | 0)) + ',' + (46 - (pr * 20 | 0)) + ',1)'; }, out: 'rgba(20,0,0,0.6)', pan: 'lat', son: 0.5 },
        errant: { pool: MURMURES_AMES, col: function (pr) { return 'rgba(' + (150 + (pr * 40 | 0)) + ',' + (150 + (pr * 60 | 0)) + ',' + (235) + ',' + (0.85).toFixed(2) + ')'; }, out: 'rgba(4,4,20,0.55)', pan: 'lat', son: 0.7 }
    };

    function spawnMurmure(scene, voie, pr) {
        var pal = PALV[voie] || PALV.fond;
        var mot = pal.pool[Math.floor(Math.random() * pal.pool.length)];
        var W = 460, H = 60;
        var bmp = new Bitmap(W, H);
        bmp.fontFace = 'GameFont';
        bmp.fontSize = 22 + Math.round(pr * 8);
        bmp.fontItalic = true;
        bmp.textColor = pal.col(pr);
        bmp.outlineColor = pal.out;
        bmp.outlineWidth = 3;
        bmp.drawText(mot, 0, 0, W, H, 'center');
        if (bmp._setDirty) bmp._setDirty();

        var sp = new Sprite(bmp);
        sp.anchor.x = 0.5; sp.anchor.y = 0.5;
        sp.x = (Graphics.width / 2) + (Math.random() * 2 - 1) * Graphics.width * 0.28;
        sp.y = Graphics.height * (0.35 + Math.random() * 0.4);
        sp.opacity = 0;
        // le Sang tremble et reste ; le Lac et les âmes remontent comme des bulles
        var monte = voie === 'bete' ? 0.02 + Math.random() * 0.04 : 0.12 + Math.random() * 0.1;
        sp._mur = { t: 0, fadeIn: 40, hold: 60 + Math.round(pr * 60), fadeOut: 55, max: 90 + Math.round(pr * 90), monte: monte, voie: voie, shake: voie === 'bete' ? 1 : 0 };
        scene._murLayer.addChild(sp);
        scene._murs.push(sp);
        souffle(sp.x < Graphics.width / 2 ? -0.5 : 0.5, pal.son + pr);
    }

    function majMurmure(sp) {
        var d = sp._mur; d.t++;
        var op;
        if (d.t < d.fadeIn) op = d.max * (d.t / d.fadeIn);
        else if (d.t < d.fadeIn + d.hold) op = d.max;
        else op = d.max * (1 - (d.t - d.fadeIn - d.hold) / d.fadeOut);
        sp.opacity = Math.max(0, Math.round(op));
        sp.y -= d.monte; // le mot remonte lentement, comme une bulle
        if (d.shake) sp.x += (Math.random() * 2 - 1) * 0.8; // le Sang vibre
        return d.t < d.fadeIn + d.hold + d.fadeOut;
    }

    //=========================================================================
    // POÈME DES ÂMES — récité sur voile noir, adapté au compte
    //=========================================================================
    function construirePoeme(n) {
        var L = [];
        L.push('Le lac ne parle pas.');
        L.push('Le lac compte.');
        L.push('');
        if (n <= 0) {
            L.push('Personne n\'est encore descendu.');
            L.push('Mais l\'eau attend. L\'eau a tout son temps.');
        } else {
            var mots = ['une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'];
            var mot = n <= 10 ? mots[n - 1] : String(n);
            L.push(mot.charAt(0).toUpperCase() + mot.slice(1) + (n > 1 ? ' âmes, déjà.' : ' âme, déjà.'));
            L.push(n > 1 ? 'Elles ne rêvent plus. Elles ondulent.' : 'Elle ne rêve plus. Elle ondule.');
            L.push('');
            var k = Math.min(n, 4);
            for (var i = 0; i < k; i++) L.push('· une lumière de moins sur la rive.');
            if (n > 4) L.push('· …et d\'autres, que tu ne comptes déjà plus.');
        }
        L.push('');
        if (n >= 4) L.push('Le fond est presque plein.');
        else if (n >= 2) L.push('Le fond s\'habitue à vos visages.');
        else L.push('Le fond a tout son temps.');
        L.push('');
        L.push(n >= 1 ? 'Descends. On t\'a gardé une place.' : 'Descends. Sois le premier.');
        return L;
    }

    var poeme = { actif: false, voile: null, lignes: [], idx: 0, t: 0, phase: 0 };

    function lancerPoeme(n) {
        if (poeme.actif) return;
        var scene = SceneManager._scene;
        if (!scene || !scene.addChild) return;
        if (n == null) n = nbAmes();
        poeme.lignes = construirePoeme(n);
        poeme.idx = 0; poeme.t = 0; poeme.phase = 1; poeme.actif = true;
        poeme.voile = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        poeme.voile.bitmap.fillAll('#000000');
        poeme.voile.opacity = 0;
        scene.addChild(poeme.voile);
        try { AudioManager.fadeOutBgm(3); } catch (e) {}
        try { if (window.ChutesLac) ChutesLac.play(THEME_POEME, 0.9); } catch (e) {}
    }

    function majPoeme() {
        if (!poeme.actif || !poeme.voile) return;
        poeme.t++;
        var b = poeme.voile.bitmap;
        if (poeme.phase === 1) {               // le voile monte
            poeme.voile.opacity = Math.min(255, poeme.voile.opacity + 6);
            if (poeme.voile.opacity >= 255) { poeme.phase = 2; poeme.t = 0; }
        } else if (poeme.phase === 2) {        // écriture ligne à ligne
            if (poeme.t >= 6) {
                poeme.t = 0;
                if (poeme.idx < poeme.lignes.length) {
                    var ligne = poeme.lignes[poeme.idx++];
                    b.fontFace = 'GameFont'; b.fontSize = 22; b.fontItalic = true;
                    b.textColor = '#cfe6ea';
                    var y = 110 + poeme.idx * 30;
                    if (ligne !== '') b.drawText(ligne, 0, y, Graphics.width, 30, 'center');
                    if (b._setDirty) b._setDirty();
                    // pause plus longue après une ligne pleine
                    poeme.t = ligne === '' ? 4 : -46;
                } else { poeme.phase = 3; poeme.t = 0; }
            }
        } else if (poeme.phase === 3) {        // temps de lecture
            if (poeme.t > 150) { poeme.phase = 4; poeme.t = 0; }
        } else if (poeme.phase === 4) {        // le voile redescend
            poeme.voile.opacity -= 4;
            if (poeme.voile.opacity <= 0) {
                if (poeme.voile.parent) poeme.voile.parent.removeChild(poeme.voile);
                poeme.voile = null; poeme.actif = false;
                try { if (window.ChutesLac) ChutesLac.stop(); } catch (e) {}
                try { if ($gameSystem && $gameSystem.replayBgm) $gameSystem.replayBgm(); } catch (e) {}
            }
        }
    }

    // fige le joueur pendant le poème
    var _canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function () {
        if (poeme.actif) return false;
        return _canMove.call(this);
    };

    //=========================================================================
    // Intégration carte
    //=========================================================================
    var _createWindowLayer = Scene_Map.prototype.createWindowLayer;
    Scene_Map.prototype.createWindowLayer = function () {
        this._murLayer = new Sprite();
        this._murs = [];
        this.addChild(this._murLayer);
        _createWindowLayer.call(this);
    };

    var _updMap = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _updMap.call(this);
        try {
            majPoeme();
            if (!this._murLayer) return;
            for (var i = this._murs.length - 1; i >= 0; i--) {
                if (!majMurmure(this._murs[i])) {
                    if (this._murs[i].parent) this._murs[i].parent.removeChild(this._murs[i]);
                    this._murs.splice(i, 1);
                }
            }
            if (!actif() || poeme.actif || $gameMessage.isBusy()) return;
            var pv = pressionsVoies();
            var pr = Math.max(pv.fond, pv.bete, pv.errant);
            if (pr < SEUIL || this._murs.length >= 3) return;
            this._murCd = (this._murCd || Math.round(120 + Math.random() * 180));
            this._murCd--;
            if (this._murCd <= 0) {
                this._murCd = Math.round((60 + Math.random() * 180) * (1 - 0.7 * pr)) + 30;
                // tirage pondéré par la pression de chaque voie
                var total = pv.fond + pv.bete + pv.errant;
                var r = Math.random() * total, voie, p;
                if (r < pv.fond) { voie = 'fond'; p = pv.fond; }
                else if (r < pv.fond + pv.bete) { voie = 'bete'; p = pv.bete; }
                else { voie = 'errant'; p = pv.errant; }
                spawnMurmure(this, voie, p);
            }
        } catch (e) {}
    };

    //=========================================================================
    // API + commandes
    //=========================================================================
    window.ChutesMurmures = { nbAmes: nbAmes, poeme: function (n) { lancerPoeme(n); } };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        var c = String(cmd).toUpperCase();
        if (c === 'CHUTEPOEME') {
            var n = args[0] != null && args[0] !== '' ? parseInt(args[0]) : null;
            lancerPoeme(isNaN(n) ? null : n);
        } else if (c === 'CHUTEMURMURE') {
            var sub = (args[0] || '').toLowerCase();
            if (sub === 'off') { if ($gameSystem) $gameSystem._murmureOff = true; }
            else if (sub === 'on') { if ($gameSystem) $gameSystem._murmureOff = false; }
        }
    };
})();
