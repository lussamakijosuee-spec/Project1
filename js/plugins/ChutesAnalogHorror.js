//=============================================================================
// ChutesAnalogHorror.js — v1.0 · La cassette qui te regarde (analog horror)
// RPG Maker MV   ·   à charger APRÈS ChutesLacMusique
//=============================================================================
/*:
 * @plugindesc [v1.0] Esthétique ANALOG HORROR : l'écran devient une vieille
 * cassette VHS — scanlines, tracking qui roule, neige, incrustation REC +
 * horodatage corrompu, pertes de signal et messages de diffusion. Selon la Chute.
 * @author JOKO / Claude
 *
 * @param seuil
 * @text Seuil d'apparition (%)
 * @type number
 * @min 0
 * @max 90
 * @default 15
 * @desc En dessous de ce % de pression de Chute, l'écran reste normal.
 *
 * @param opaciteMax
 * @text Intensité max (%)
 * @type number
 * @min 10
 * @max 100
 * @default 70
 * @desc Force maximale de l'effet cassette au plus fort de la Chute.
 *
 * @param rec
 * @text Incrustation REC + horodatage
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param messages
 * @text Messages de diffusion
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Textes façon écran-mire (« AUCUN SIGNAL », « CETTE CASSETTE VOUS REGARDE »…).
 *
 * @param toujours
 * @text Toujours actif (fond léger)
 * @type boolean
 * @on Oui
 * @off Non
 * @default false
 * @desc Garde un très léger grain VHS même hors Chute (nostalgie malsaine).
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  ANALOG HORROR — l'écran est une bande magnétique, et elle se dégrade
 * ═══════════════════════════════════════════════════════════════════════════
 *  Quand un héros sombre, l'image cesse d'être « le jeu » : elle devient un
 *  vieil enregistrement retrouvé. Tout est dessiné par le plugin, rien à
 *  installer.
 *
 *    • SCANLINES fines + léger bombé de tube.
 *    • TRACKING : une bande de bruit qui roule verticalement (réglage cassette).
 *    • NEIGE (statique) par bouffées, de plus en plus fréquentes.
 *    • ● REC + horodatage (199X/██/██  ▮▮:▮▮:▮▮) qui se corrompt en sombrant.
 *    • PERTES DE SIGNAL : neige plein écran + « AUCUN SIGNAL / VEUILLEZ
 *      PATIENTER », et des lignes de diffusion qui te parlent.
 *
 *  C'est l'esthétique du FOND (BROKENSCRIPT) : l'intensité suit la santé
 *  mentale qui s'effondre (phase mentale). Rien tant que l'esprit tient
 *  (phases 5-4-3) ; ça démarre phase 2 et culmine à la folie (phase 1).
 *  Calque non interactif ; $gameScreen n'est pas touché.
 *
 *  COMMANDES :
 *      CHUTEVHS off / on        coupe / rallume
 *      CHUTEVHS burst           force une perte de signal maintenant
 *      CHUTEVHS niveau <%>      force l'intensité (mise en scène)
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('ChutesAnalogHorror');
    var SEUIL = Number(P['seuil'] || 15) / 100;
    var OPMAX = Number(P['opaciteMax'] || 70) / 100;
    var REC = String(P['rec'] || 'true') === 'true';
    var MSG = String(P['messages'] || 'true') === 'true';
    var TOUJOURS = String(P['toujours'] || 'false') === 'true';

    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }
    function jErr(id)  { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function jCorr(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function pression() {
        var m = 0;
        if ($gameParty) $gameParty.members().forEach(function (a) {
            var id = a.actorId();
            m = Math.max(m, window.ChutesNoyau ? ChutesNoyau.mentalActeur(id) : (3 - phase(id)) / 2); // VHS = le Fond mental (noyau)
        });
        return m.clamp(0, 1);
    }
    function actif() { return !($gameSystem && $gameSystem._vhsOff); }

    var MESSAGES = [
        'AUCUN SIGNAL', 'VEUILLEZ PATIENTER', 'NE FERMEZ PAS LES YEUX',
        'CETTE CASSETTE VOUS REGARDE', 'PROPRIÉTÉ DU LAC', 'ENREGISTREMENT EN COURS',
        'IL EST DERRIÈRE VOUS', 'REMBOBINEZ SI VOUS L\'OSEZ', 'SUJET TOUJOURS CONSCIENT'
    ];

    //=========================================================================
    // Fabrication des calques (une fois)
    //=========================================================================
    function bmpScanlines() {
        var w = Graphics.width, h = Graphics.height, b = new Bitmap(w, h), c = b.context;
        c.fillStyle = 'rgba(0,0,0,0.35)';
        for (var y = 0; y < h; y += 3) c.fillRect(0, y, w, 1);
        // vignette de tube (coins assombris)
        var g = c.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.62);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.55)');
        c.fillStyle = g; c.fillRect(0, 0, w, h);
        if (b._setDirty) b._setDirty();
        return b;
    }
    function bmpNoise(w, h) {
        var b = new Bitmap(w, h), c = b.context;
        var img = c.createImageData(w, h), d = img.data;
        for (var i = 0; i < d.length; i += 4) {
            var v = (Math.random() * 255) | 0;
            d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
        }
        c.putImageData(img, 0, 0);
        if (b._setDirty) b._setDirty();
        return b;
    }
    function bmpTracking(w, h) {
        var b = new Bitmap(w, h), c = b.context;
        for (var y = 0; y < h; y++) {
            var a = Math.sin((y / h) * Math.PI); // plus fort au centre de la bande
            for (var x = 0; x < w; x += 2) {
                if (Math.random() < 0.5) {
                    c.fillStyle = 'rgba(255,255,255,' + (a * (0.15 + Math.random() * 0.4)).toFixed(3) + ')';
                    c.fillRect(x, y, 2, 1);
                }
            }
        }
        if (b._setDirty) b._setDirty();
        return b;
    }

    var _scan = null, _noiseFrames = [], _track = null;
    function scanBmp() { return _scan || (_scan = bmpScanlines()); }
    function noiseBmp(i) {
        if (!_noiseFrames.length) {
            var w = Math.round(Graphics.width / 3), h = Math.round(Graphics.height / 3);
            for (var k = 0; k < 4; k++) _noiseFrames.push(bmpNoise(w, h));
        }
        return _noiseFrames[i % _noiseFrames.length];
    }
    function trackBmp() { return _track || (_track = bmpTracking(Graphics.width, Math.round(Graphics.height * 0.14))); }

    //=========================================================================
    // Le contrôleur d'écran-cassette
    //=========================================================================
    function creerCalque(scene) {
        var vhs = { root: new Sprite() };
        var W = Graphics.width, H = Graphics.height;

        // neige (petit bitmap étiré = gros grain VHS)
        vhs.noise = new Sprite(noiseBmp(0));
        vhs.noise.scale.x = 3; vhs.noise.scale.y = 3; vhs.noise.opacity = 0;
        vhs.noise.blendMode = 1; // ADD : neige qui éclaircit
        vhs.root.addChild(vhs.noise);

        // bande de tracking qui roule
        vhs.track = new Sprite(trackBmp());
        vhs.track.opacity = 0; vhs.track.y = -9999; vhs.track.blendMode = 1;
        vhs.root.addChild(vhs.track);

        // scanlines + vignette de tube
        vhs.scan = new Sprite(scanBmp());
        vhs.scan.opacity = 0;
        vhs.root.addChild(vhs.scan);

        // incrustation REC + horodatage
        vhs.osd = new Sprite(new Bitmap(W, H));
        vhs.osd.opacity = 0;
        vhs.root.addChild(vhs.osd);

        // texte de diffusion (perte de signal)
        vhs.msg = new Sprite(new Bitmap(W, 80));
        vhs.msg.anchor.y = 0.5; vhs.msg.y = H / 2; vhs.msg.opacity = 0;
        vhs.root.addChild(vhs.msg);

        vhs.t = 0; vhs.burst = 0; vhs.signal = 0; vhs.recBlink = 0; vhs.corrupt = 0; vhs.msgTxt = ''; vhs.osdT = -1;
        scene.addChild(vhs.root);
        return vhs;
    }

    function dessinerOSD(bmp, pr) {
        bmp.clear();
        bmp.fontFace = 'GameFont'; bmp.fontSize = 20;
        // ● REC (clignote)
        bmp.textColor = '#ff2b2b';
        bmp.drawText('●', 24, 20, 20, 24, 'left');
        bmp.textColor = '#eaeaea';
        bmp.drawText('REC', 46, 20, 80, 24, 'left');
        bmp.drawText('SP', Graphics.width - 60, 20, 40, 24, 'left');
        // horodatage, corrompu selon la pression
        var f = Graphics.frameCount || 0;
        var s = Math.floor(f / 60), hh = Math.floor(s / 3600) % 24, mm = Math.floor(s / 60) % 60, ss = s % 60;
        function d2(n) { return (n < 10 ? '0' : '') + n; }
        function corr(str) {
            if (pr <= 0.2) return str;
            var gly = ['█', '▓', '?', '#', '%', 'X'];
            return str.split('').map(function (ch) {
                return Math.random() < pr * 0.4 && ch !== ' ' ? gly[Math.floor(Math.random() * gly.length)] : ch;
            }).join('');
        }
        var an = 1990 + (Math.floor(f / 1000) % 9);
        var date = corr(an + '/' + corr('██') + '/' + corr('██'));
        var heure = corr(d2(hh) + ':' + d2(mm) + ':' + d2(ss));
        bmp.fontSize = 18; bmp.textColor = '#dddddd';
        bmp.drawText(date, Graphics.width - 220, Graphics.height - 54, 200, 22, 'right');
        bmp.drawText(heure, Graphics.width - 220, Graphics.height - 32, 200, 22, 'right');
        if (bmp._setDirty) bmp._setDirty();
    }

    function dessinerMessage(bmp, txt) {
        bmp.clear();
        bmp.fontFace = 'GameFont'; bmp.fontSize = 34; bmp.fontBold = true;
        bmp.textColor = '#ffffff'; bmp.outlineColor = 'rgba(0,0,0,0.8)'; bmp.outlineWidth = 6;
        bmp.drawText(txt, 0, 0, Graphics.width, 80, 'center');
        if (bmp._setDirty) bmp._setDirty();
    }

    function majCalque(vhs, prBrut) {
        var pr = TOUJOURS ? Math.max(0.12, prBrut) : prBrut;
        var forced = ($gameSystem && $gameSystem._vhsNiveau != null) ? $gameSystem._vhsNiveau : null;
        if (forced != null) pr = forced;
        if (!actif()) pr = 0;
        var W = Graphics.width, H = Graphics.height;
        vhs.t++;

        var on = pr > 0.001;
        var force = OPMAX * pr;

        // scanlines / vignette : présence de base dès qu'on est dedans
        vhs.scan.opacity = Math.round(160 * force);

        // léger tremblement de l'image (instabilité de la bande)
        vhs.root.y = on ? Math.round((Math.random() < 0.15 ? (Math.random() * 2 - 1) * (1 + pr * 3) : 0)) : 0;

        // neige de fond, plus dense en sombrant + bouffées
        if (vhs.t % 3 === 0) vhs.noise.bitmap = noiseBmp(vhs.t);
        var noiseBase = 18 * force;
        if (vhs.burst > 0) { vhs.burst--; noiseBase = 120 + Math.random() * 60; }
        else if (on && Math.random() < 0.01 + pr * 0.05) vhs.burst = 3 + Math.floor(Math.random() * 6);
        vhs.noise.opacity = Math.round(noiseBase);
        vhs.noise.x = (Math.random() * 6 - 3);

        // bande de tracking qui roule vers le bas
        if (on) {
            if (vhs.track.y < -H * 0.14) vhs.track.y = H + 20;
            vhs.track.y -= 2 + pr * 4;
            vhs.track.opacity = Math.round(120 * force);
        } else vhs.track.opacity = 0;

        // OSD REC + horodatage (redessiné ~2×/s, clignotement du point)
        if (REC && on) {
            if (vhs.t - vhs.osdT >= 30 || vhs.osdT < 0) { dessinerOSD(vhs.osd.bitmap, pr); vhs.osdT = vhs.t; }
            vhs.recBlink = (vhs.recBlink + 1) % 60;
            vhs.osd.opacity = vhs.recBlink < 40 ? 230 : 90;
        } else vhs.osd.opacity = 0;

        // perte de signal : neige plein écran + message
        if (vhs.signal > 0) {
            vhs.signal--;
            vhs.noise.opacity = 200 + Math.random() * 40;
            vhs.msg.opacity = Math.min(255, vhs.msg.opacity + 30);
        } else {
            vhs.msg.opacity = Math.max(0, vhs.msg.opacity - 20);
            if (MSG && on && Math.random() < 0.0016 + pr * 0.004) {
                vhs.msgTxt = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
                dessinerMessage(vhs.msg.bitmap, vhs.msgTxt);
                vhs.signal = 24 + Math.floor(Math.random() * 40 + pr * 40);
            }
        }
    }

    //=========================================================================
    // Intégration carte
    //=========================================================================
    var _createWindowLayer = Scene_Map.prototype.createWindowLayer;
    Scene_Map.prototype.createWindowLayer = function () {
        // calque cassette AU-DESSUS des fenêtres : toute l'image est « la bande »
        _createWindowLayer.call(this);
        try { this._vhs = creerCalque(this); } catch (e) { this._vhs = null; }
    };

    var _updMap = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _updMap.call(this);
        try { if (this._vhs) majCalque(this._vhs, pression()); } catch (e) {}
    };

    //=========================================================================
    // Commande
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'CHUTEVHS') return;
        var sub = (args[0] || '').toLowerCase();
        var sc = SceneManager._scene;
        if (sub === 'off') { if ($gameSystem) $gameSystem._vhsOff = true; }
        else if (sub === 'on') { if ($gameSystem) $gameSystem._vhsOff = false; }
        else if (sub === 'burst') {
            if (sc && sc._vhs) {
                sc._vhs.msgTxt = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
                dessinerMessage(sc._vhs.msg.bitmap, sc._vhs.msgTxt);
                sc._vhs.signal = 50; sc._vhs.burst = 10;
            }
        }
        else if (sub === 'niveau') {
            var v = parseInt(args[1]);
            if ($gameSystem) $gameSystem._vhsNiveau = isNaN(v) ? null : (v / 100).clamp(0, 1);
        }
    };
})();
