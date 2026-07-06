//=============================================================================
// ChutesLacMusique.js — v2.0 · Trois Chutes, trois horreurs (musique procédurale)
// RPG Maker MV   ·   moteur WebAudio · BROKENSCRIPT / Lovecraft
//=============================================================================
/*:
 * @plugindesc [v2.0] 30 mélodies GÉNÉRÉES en direct, une horreur par Chute :
 * l'Errant (dread cosmique lovecraftien), la Bête (drone qui grogne), le Fond
 * (boîte à musique VHS glitchée façon BROKENSCRIPT). Aucun fichier audio.
 * @author JOKO / Claude
 *
 * @param volume
 * @text Volume (%)
 * @type number
 * @min 0
 * @max 100
 * @default 70
 * @desc Volume de base (multiplié par le volume BGM des options).
 *
 * @param auto
 * @text Déclenchement automatique
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc La musique se lève seule selon la Chute dominante du groupe.
 *
 * @param seuil
 * @text Seuil d'apparition (%)
 * @type number
 * @min 0
 * @max 90
 * @default 20
 * @desc En dessous de ce % de pression de Chute, silence.
 *
 * @param remplacerBGM
 * @text Étouffer la musique du jeu
 * @type boolean
 * @on Oui
 * @off Non
 * @default false
 * @desc Fait taire la BGM normale quand l'horreur prend le dessus.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  TROIS CHUTES, TROIS HORREURS — musique synthétisée en direct (WebAudio)
 * ═══════════════════════════════════════════════════════════════════════════
 *  Rien à installer : tout est généré à la volée, jamais deux fois pareil.
 *  Chaque type de Chute a SA signature, dans la veine BROKENSCRIPT / Lovecraft.
 *
 *   ▶ L'ERRANT — dread cosmique lovecraftien. Nappes creuses et lointaines,
 *     sub-graves qui gonflent comme une marée, grappes de notes dissonantes,
 *     détune microtonale : la sensation lente d'être effacé, dé-fait.
 *
 *   ▶ LA BÊTE — body-horror. Un drone saturé qui GROGNE, des scies désaccordées,
 *     un flutter nerveux, des coups sourds irréguliers. La chair qui change.
 *
 *   ▶ LE FOND / LE DÉMENT — BROKENSCRIPT. Boîte à musique ancienne (1800) noyée
 *     dans une cassette VHS : wow & flutter, sifflement, et surtout des GLITCHES
 *     numériques — bégaiements, coupures franches, rembobinages, silences secs.
 *
 *  Plus la Chute approche, plus l'horreur correspondante s'intensifie
 *  (désaccord, dissonance, glitch, saturation). Le mode AUTO choisit la voie
 *  de la Chute la plus forte du groupe et un thème dedans.
 *
 *  30 THÈMES nommés, 10 par voie. ChutesLac.themes() les liste.
 *
 *  COMMANDES :
 *      CHUTELAC play [thème] [intensité%]   lance (ex: CHUTELAC play 12 80)
 *      CHUTELAC voie <errant|bete|fond> [%] force une voie
 *      CHUTELAC theme <nom|index>           change de thème
 *      CHUTELAC intensite <%>               force l'intensité (0-100)
 *      CHUTELAC stop                        éteint (fondu)
 *      CHUTELAC auto on|off                 (dé)active l'auto
 *  SCRIPT :
 *      ChutesLac.play(i,0.8) · ChutesLac.voie('bete',0.9) · ChutesLac.stop()
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('ChutesLacMusique');
    var VOL_BASE = Number(P['volume'] || 70) / 100;
    var AUTO = String(P['auto'] || 'true') === 'true';
    var SEUIL = Number(P['seuil'] || 20) / 100;
    var DUCK = String(P['remplacerBGM'] || 'false') === 'true';

    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }
    function jErr(id)  { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function jCorr(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }

    // Voie de Chute dominante du groupe (0..1 par type)
    function pressionsTypes() {
        var b = 0, e = 0, f = 0;
        if ($gameParty) $gameParty.members().forEach(function (a) {
            var id = a.actorId();
            b = Math.max(b, window.ChutesNoyau ? ChutesNoyau.beteActeur(id)   : (jCorr(id) - 40) / 60);
            e = Math.max(e, window.ChutesNoyau ? ChutesNoyau.errantActeur(id) : (jErr(id)  - 40) / 60);
            f = Math.max(f, window.ChutesNoyau ? ChutesNoyau.mentalActeur(id) : (3 - phase(id)) / 2);
        });
        return { bete: b.clamp(0, 1), errant: e.clamp(0, 1), fond: f.clamp(0, 1) };
    }
    function voieDominante() {
        var p = pressionsTypes();
        var mx = Math.max(p.bete, p.errant, p.fond);
        if (mx <= 0) return null;
        var v = p.fond === mx ? 'fond' : (p.errant === mx ? 'errant' : 'bete');
        return { voie: v, pr: mx };
    }

    //=========================================================================
    // Gammes + 30 thèmes (10 par voie)
    //=========================================================================
    var SC = {
        aeolien:  [0, 2, 3, 5, 7, 8, 10],
        phrygien: [0, 1, 3, 5, 7, 8, 10],
        harmo:    [0, 2, 3, 5, 7, 8, 11],
        locrien:  [0, 1, 3, 5, 6, 8, 10],
        hira:     [0, 2, 3, 7, 8],
        inSen:    [0, 1, 5, 7, 8],
        ton:      [0, 2, 4, 6, 8, 10],
        penta:    [0, 3, 5, 7, 10],
        double:   [0, 1, 4, 5, 7, 8, 11]
    };
    // [nom, gamme, root(MIDI), pas(s), timbre, tremble, voie]
    var THEMES = [
        // ── ERRANT : dread cosmique, effacement (Lovecraft) ──────────────────
        ['L\'oubli lent',            SC.ton,     48, 0.90, 'verre',  0.6, 'errant'],
        ['Personne ne se souviendra',SC.aeolien, 45, 0.85, 'verre',  0.7, 'errant'],
        ['La marque monte',          SC.locrien, 47, 0.80, 'cloche', 0.7, 'errant'],
        ['Effacement',               SC.ton,     50, 0.95, 'verre',  0.8, 'errant'],
        ['Le nom qui s\'efface',     SC.phrygien,43, 0.82, 'verre',  0.6, 'errant'],
        ['Poussière d\'âme',         SC.aeolien, 48, 0.88, 'cloche', 0.7, 'errant'],
        ['Le vide t\'appelle',       SC.locrien, 41, 1.00, 'verre',  0.9, 'errant'],
        ['Dissolution',              SC.double,  46, 0.86, 'cloche', 0.8, 'errant'],
        ['Sous les étoiles noires',  SC.ton,     44, 0.92, 'verre',  0.7, 'errant'],
        ['Il n\'a jamais existé',    SC.phrygien,49, 0.84, 'cloche', 0.6, 'errant'],
        // ── BÊTE : body-horror, drone qui grogne ─────────────────────────────
        ['La chair change',          SC.phrygien,38, 0.50, 'cloche', 0.9, 'bete'],
        ['Grognement',               SC.locrien, 36, 0.46, 'cloche', 1.0, 'bete'],
        ['Plus de mots',             SC.double,  40, 0.52, 'cloche', 0.8, 'bete'],
        ['Os qui craquent',          SC.harmo,   37, 0.44, 'cloche', 0.9, 'bete'],
        ['La Bête au loin',          SC.phrygien,34, 0.58, 'cloche', 1.0, 'bete'],
        ['Fauve',                    SC.locrien, 39, 0.42, 'cloche', 0.9, 'bete'],
        ['Rien que le mouvement',    SC.harmo,   41, 0.48, 'cloche', 0.8, 'bete'],
        ['Meute',                    SC.double,  35, 0.50, 'cloche', 1.0, 'bete'],
        ['Sang violet',              SC.phrygien,42, 0.54, 'cloche', 0.9, 'bete'],
        ['Ce qui reste de toi',      SC.aeolien, 38, 0.56, 'cloche', 0.8, 'bete'],
        // ── FOND / DÉMENT : boîte à musique VHS glitchée (BROKENSCRIPT) ───────
        ['Berceuse du Fond',         SC.hira,    60, 0.62, 'boite',  0.5, 'fond'],
        ['Cassette n°7',             SC.phrygien,55, 0.50, 'boite',  0.8, 'fond'],
        ['1897',                     SC.harmo,   53, 0.58, 'boite',  0.7, 'fond'],
        ['VHS — piste morte',        SC.locrien, 52, 0.48, 'boite',  1.0, 'fond'],
        ['Comptine noyée',           SC.inSen,   62, 0.54, 'boite',  0.7, 'fond'],
        ['Les yeux du fond',         SC.double,  49, 0.60, 'boite',  0.9, 'fond'],
        ['Poupée cassée',            SC.phrygien,58, 0.52, 'boite',  0.8, 'fond'],
        ['Rembobine',                SC.locrien, 54, 0.50, 'boite',  1.0, 'fond'],
        ['La bande se déforme',      SC.ton,     56, 0.50, 'boite',  1.0, 'fond'],
        ['Le rire des enfants',      SC.inSen,   65, 0.48, 'boite',  0.7, 'fond']
    ];

    // Palette sonore par voie
    var PAL = {
        errant: { droneWave: 'sine',     droneMul: 0.5, filtre: 1600, noteWave: 'sine',
                  glitch: 0.01, cluster: 0.30, growl: 0, sub: 0.12, hiss: 0.010, whine: 0.2, attaque: 6 },
        bete:   { droneWave: 'sawtooth', droneMul: 0.5, filtre: 700,  noteWave: 'sawtooth',
                  glitch: 0.04, cluster: 0.12, growl: 1, sub: 0.06, hiss: 0.020, whine: 0.1, attaque: 1 },
        fond:   { droneWave: 'triangle', droneMul: 0.5, filtre: 2500, noteWave: 'triangle',
                  glitch: 0.16, cluster: 0.06, growl: 0.2, sub: 0.04, hiss: 0.045, whine: 1.0, attaque: 1 }
    };

    function midiFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    function palActive() { return PAL[THEMES[Lac.themeIndex][6]] || PAL.fond; }

    //=========================================================================
    // Moteur audio
    //=========================================================================
    var Lac = {
        ctx: null, master: null, wet: null, delay: null, wobble: null, wobbleGain: null,
        flutter: null, flutterGain: null, hiss: null, hissGain: null, hissHP: null,
        drone: [], droneGain: null, droneLP: null, droneShaper: null, beteShaper: null,
        whineOsc: null, whineGain: null,
        actif: false, intensite: 0, cible: 0, themeIndex: 20,
        nextTime: 0, timer: null, motif: [], motifPos: 0
    };

    function ctxOK() {
        try {
            Lac.ctx = (window.WebAudio && WebAudio._context) ? WebAudio._context : Lac.ctx;
            if (!Lac.ctx && typeof AudioContext !== 'undefined') Lac.ctx = new AudioContext();
            if (Lac.ctx && Lac.ctx.state === 'suspended') Lac.ctx.resume();
            return !!Lac.ctx;
        } catch (e) { return false; }
    }
    function bruit(ctx, s) {
        var n = ctx.sampleRate * s, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
        for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
        return buf;
    }
    function courbeDist(amount) {
        var n = 4096, c = new Float32Array(n), deg = Math.PI / 180;
        for (var i = 0; i < n; i++) { var x = i * 2 / n - 1; c[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x)); }
        return c;
    }

    function construire() {
        if (Lac.master || !ctxOK()) return !!Lac.master;
        var ctx = Lac.ctx;

        Lac.master = ctx.createGain(); Lac.master.gain.value = 0; Lac.master.connect(ctx.destination);

        // réverbération hantée (delay rebouclé + lowpass)
        Lac.delay = ctx.createDelay(1.0); Lac.delay.delayTime.value = 0.19;
        var fb = ctx.createGain(); fb.gain.value = 0.4;
        var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
        Lac.delay.connect(lp); lp.connect(fb); fb.connect(Lac.delay);
        Lac.wet = ctx.createGain(); Lac.wet.gain.value = 0.9; Lac.delay.connect(Lac.wet); Lac.wet.connect(Lac.master);

        // wow (lent) + flutter (rapide) → détune
        Lac.wobble = ctx.createOscillator(); Lac.wobble.type = 'sine'; Lac.wobble.frequency.value = 0.7;
        Lac.wobbleGain = ctx.createGain(); Lac.wobbleGain.gain.value = 12; Lac.wobble.connect(Lac.wobbleGain); Lac.wobble.start();
        Lac.flutter = ctx.createOscillator(); Lac.flutter.type = 'triangle'; Lac.flutter.frequency.value = 6.3;
        Lac.flutterGain = ctx.createGain(); Lac.flutterGain.gain.value = 4; Lac.flutter.connect(Lac.flutterGain); Lac.flutter.start();

        // souffle cassette
        Lac.hiss = ctx.createBufferSource(); Lac.hiss.buffer = bruit(ctx, 2); Lac.hiss.loop = true;
        Lac.hissHP = ctx.createBiquadFilter(); Lac.hissHP.type = 'highpass'; Lac.hissHP.frequency.value = 5200;
        Lac.hissGain = ctx.createGain(); Lac.hissGain.gain.value = 0.02;
        Lac.hiss.connect(Lac.hissHP); Lac.hissHP.connect(Lac.hissGain); Lac.hissGain.connect(Lac.master); Lac.hiss.start();

        // saturation partagée (grognement de la Bête)
        Lac.beteShaper = ctx.createWaveShaper(); Lac.beteShaper.curve = courbeDist(60); Lac.beteShaper.oversample = '2x';
        Lac.beteShaper.connect(Lac.master); Lac.beteShaper.connect(Lac.delay);

        // drone
        Lac.droneShaper = ctx.createWaveShaper();
        Lac.droneLP = ctx.createBiquadFilter(); Lac.droneLP.type = 'lowpass'; Lac.droneLP.frequency.value = 600;
        Lac.droneGain = ctx.createGain(); Lac.droneGain.gain.value = 0;
        Lac.droneShaper.connect(Lac.droneLP); Lac.droneLP.connect(Lac.droneGain); Lac.droneGain.connect(Lac.master);
        [0, 1].forEach(function (i) {
            var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 55 * (i ? 1.01 : 0.99);
            o.detune.value = i ? 7 : -6; Lac.wobbleGain.connect(o.detune);
            o.connect(Lac.droneShaper); o.start(); Lac.drone.push(o);
        });

        // sifflement aigu VHS
        Lac.whineOsc = ctx.createOscillator(); Lac.whineOsc.type = 'sine'; Lac.whineOsc.frequency.value = 8400;
        Lac.whineGain = ctx.createGain(); Lac.whineGain.gain.value = 0;
        Lac.whineOsc.connect(Lac.whineGain); Lac.whineGain.connect(Lac.master); Lac.whineOsc.start();

        return true;
    }

    // Applique la palette de la voie courante au drone/souffle
    function appliquerPalette() {
        var pal = palActive(), ctx = Lac.ctx, base = THEMES[Lac.themeIndex][2] - 24;
        var f0 = midiFreq(base) * pal.droneMul * 2;
        Lac.drone.forEach(function (o, i) {
            o.type = pal.droneWave;
            o.frequency.setTargetAtTime(f0 * (i ? 1.008 : 0.992), ctx.currentTime, 0.6);
        });
        Lac.droneShaper.curve = pal.growl >= 1 ? courbeDist(80) : (pal.growl > 0 ? courbeDist(12) : null);
        Lac.droneLP.frequency.setTargetAtTime(pal.filtre, ctx.currentTime, 0.5);
    }

    function jouerNote(freq, t, timbre, gain, detune, pal) {
        var ctx = Lac.ctx, g = ctx.createGain();
        var dur = timbre === 'cloche' ? 2.2 : (timbre === 'verre' ? 1.9 : 1.0);
        var atk = 0.004 * pal.attaque;                 // errant : attaque lente (nappe qui enfle)
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(gain, t + atk);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        var o = ctx.createOscillator();
        o.type = pal.noteWave;
        o.frequency.value = freq; o.detune.value = detune;
        Lac.wobbleGain.connect(o.detune); Lac.flutterGain.connect(o.detune);
        var dest = (pal.growl >= 1) ? Lac.beteShaper : null;
        if (dest) { o.connect(g); g.connect(dest); }
        else { o.connect(g); g.connect(Lac.delay); g.connect(Lac.master); }

        // partiel inharmonique (métal froid / cloche)
        if (timbre !== 'boite' || Math.random() < 0.4) {
            var o2 = ctx.createOscillator(); o2.type = 'sine';
            o2.frequency.value = freq * (timbre === 'cloche' ? 2.76 : 2.0);
            var g2 = ctx.createGain(); g2.gain.setValueAtTime(0.0001, t);
            g2.gain.exponentialRampToValueAtTime(gain * 0.22, t + atk + 0.01);
            g2.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.7);
            o2.connect(g2); g2.connect(Lac.delay); g2.connect(Lac.master);
            o2.start(t); o2.stop(t + dur + 0.05);
        }
        o.start(t); o.stop(t + dur + 0.05);
    }

    // sub-grave qui gonfle (Lovecraft)
    function subGonfle(t, freq, dur, g) {
        var ctx = Lac.ctx, o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq;
        var gn = ctx.createGain(); gn.gain.setValueAtTime(0.0001, t);
        gn.gain.exponentialRampToValueAtTime(g, t + dur * 0.5);
        gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(gn); gn.connect(Lac.master); o.start(t); o.stop(t + dur + 0.05);
    }
    // bégaiement / coupure numérique (BROKENSCRIPT)
    function glitchStutter(t, it) {
        var v = volumeCible(), n = 3 + Math.floor(Math.random() * 5), sp = 0.02 + Math.random() * 0.05;
        for (var i = 0; i <= n; i++) Lac.master.gain.setValueAtTime(i % 2 ? 0.0 : v, t + i * sp);
        Lac.master.gain.setValueAtTime(v, t + (n + 1) * sp);
    }

    function volumeCible() {
        var cfg = (typeof ConfigManager !== 'undefined' && ConfigManager.bgmVolume != null) ? ConfigManager.bgmVolume / 100 : 1;
        return VOL_BASE * cfg * (0.25 + 0.75 * Lac.intensite);
    }

    function nouveauMotif(theme) {
        var sc = theme[1], n = 3 + Math.floor(Math.random() * 4), m = [];
        for (var i = 0; i < n; i++) m.push(Math.floor(Math.random() * sc.length) + (Math.random() < 0.3 ? sc.length : 0));
        return m;
    }

    function scheduler() {
        if (!Lac.actif) return;
        var ctx = Lac.ctx, theme = THEMES[Lac.themeIndex];
        var sc = theme[1], root = theme[2], step = theme[3], timbre = theme[4], trem = theme[5];
        var pal = palActive(), it = Lac.intensite;

        Lac.wobbleGain.gain.value = (5 + trem * 10) + it * 28;
        Lac.flutterGain.gain.value = 2 + it * 9;
        Lac.hissGain.gain.value = pal.hiss + it * 0.05;
        Lac.droneGain.gain.setTargetAtTime(0.05 + it * (pal.growl >= 1 ? 0.22 : 0.16), ctx.currentTime, 0.4);
        Lac.delay.delayTime.value = 0.16 + it * 0.06;

        var densite = 0.42 + it * 0.4;
        while (Lac.nextTime < ctx.currentTime + 0.25) {
            var t = Lac.nextTime;
            if (Math.random() < densite) {
                if (!Lac.motif.length || Lac.motifPos >= Lac.motif.length) { Lac.motif = nouveauMotif(theme); Lac.motifPos = 0; }
                var deg = Lac.motif[Lac.motifPos++];
                var oct = Math.floor(deg / sc.length), semis = sc[deg % sc.length] + oct * 12;
                if (Math.random() < it * 0.22) semis += (Math.random() < 0.5 ? 1 : 6); // dissonance qui appelle
                var m = root + semis + (Math.random() < 0.25 ? -12 : 0);
                var detune = (Math.random() * 2 - 1) * (8 + it * 24);
                var gN = (pal.noteWave === 'sawtooth' ? 0.12 : (timbre === 'cloche' ? 0.16 : 0.20)) * (0.7 + Math.random() * 0.5);
                jouerNote(midiFreq(m), t, timbre, gN, detune, pal);
                // grappe dissonante (Lovecraft)
                if (Math.random() < pal.cluster * (0.4 + it)) {
                    jouerNote(midiFreq(m + 1), t + 0.01, timbre, gN * 0.6, detune + 6, pal);
                    if (Math.random() < 0.5) jouerNote(midiFreq(m + 6), t + 0.02, timbre, gN * 0.5, detune - 8, pal);
                }
            }
            // sub qui gonfle
            if (Math.random() < pal.sub * (0.5 + it)) subGonfle(t, midiFreq(root - 24), 2 + Math.random() * 2, 0.05 + it * 0.06);
            // glitch numérique
            if (Math.random() < pal.glitch * (0.5 + it)) glitchStutter(t, it);
            // sifflement VHS
            if (Math.random() < 0.03 * pal.whine) {
                Lac.whineGain.gain.setTargetAtTime(0.004 + it * 0.01, t, 0.3);
                Lac.whineGain.gain.setTargetAtTime(0, t + 0.5 + Math.random(), 0.6);
            }
            Lac.nextTime += step * (0.9 + Math.random() * 0.25);
        }
    }

    //=========================================================================
    // Contrôle
    //=========================================================================
    function play(themeIdx, intensite) {
        if (!construire()) return;
        if (themeIdx != null) Lac.themeIndex = ((themeIdx | 0) % THEMES.length + THEMES.length) % THEMES.length;
        appliquerPalette();
        Lac.cible = intensite == null ? Math.max(0.5, Lac.cible) : intensite.clamp(0, 1);
        Lac.wobble.frequency.value = 0.5 + Math.random() * 0.6;
        Lac.motif = []; Lac.motifPos = 0;
        if (!Lac.actif) { Lac.actif = true; Lac.nextTime = Lac.ctx.currentTime + 0.1; Lac.timer = setInterval(scheduler, 45); }
        if (DUCK) try { AudioManager.fadeOutBgm(3); } catch (e) {}
    }
    function stop() {
        if (!Lac.actif) return;
        Lac.cible = 0;
        setTimeout(function () {
            if (Lac.cible <= 0.001) {
                Lac.actif = false;
                if (Lac.timer) { clearInterval(Lac.timer); Lac.timer = null; }
                if (DUCK) try { if ($gameSystem && $gameSystem.replayBgm) $gameSystem.replayBgm(); } catch (e) {}
            }
        }, 2600);
    }
    function setIntensite(x) { Lac.cible = x.clamp(0, 1); if (Lac.cible > 0 && !Lac.actif) play(null, Lac.cible); }

    // choisit un thème aléatoire d'une voie donnée
    function themeDeVoie(voie) {
        var idx = [];
        THEMES.forEach(function (t, i) { if (t[6] === voie) idx.push(i); });
        return idx.length ? idx[Math.floor(Math.random() * idx.length)] : 20;
    }
    function jouerVoie(voie, intensite) {
        if (!PAL[voie]) return;
        if (THEMES[Lac.themeIndex][6] !== voie || !Lac.actif) play(themeDeVoie(voie), intensite);
        else Lac.cible = (intensite == null ? Lac.cible : intensite.clamp(0, 1));
    }

    function maj() {
        if (!Lac.master) return;
        Lac.intensite += (Lac.cible - Lac.intensite) * 0.03;
        if (Lac.intensite < 0.001 && Lac.cible <= 0) Lac.intensite = 0;
        var v = (Lac.actif || Lac.intensite > 0.001) ? volumeCible() : 0;
        try { Lac.master.gain.setTargetAtTime(v, Lac.ctx.currentTime, 0.3); } catch (e) {}
    }

    window.ChutesLac = {
        themes: function () { return THEMES.map(function (t) { return t[0] + ' [' + t[6] + ']'; }); },
        play: play, stop: stop, intensite: setIntensite,
        voie: jouerVoie,
        theme: function (nomOuIdx) {
            var i = typeof nomOuIdx === 'number' ? nomOuIdx :
                THEMES.map(function (t) { return t[0].toLowerCase(); }).indexOf(String(nomOuIdx).toLowerCase());
            if (i >= 0) { Lac.themeIndex = i; if (Lac.actif) appliquerPalette(); }
        }
    };

    //=========================================================================
    // Intégration carte : auto par voie dominante
    //=========================================================================
    var _updMap = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _updMap.call(this);
        try {
            if (AUTO && !($gameSystem && $gameSystem._lacAutoOff)) {
                var d = voieDominante();
                if (d && d.pr >= SEUIL) jouerVoie(d.voie, d.pr);
                else if (Lac.actif && Lac.cible > 0) stop();
            }
            maj();
        } catch (e) {}
    };

    //=========================================================================
    // Commande
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'CHUTELAC') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'play') {
            var th = args[1] != null && args[1] !== '' ? parseInt(args[1]) : null;
            var it = args[2] != null ? parseInt(args[2]) / 100 : 0.7;
            if ($gameSystem) $gameSystem._lacAutoOff = true;
            play(isNaN(th) ? null : th, it);
        } else if (sub === 'voie') {
            if ($gameSystem) $gameSystem._lacAutoOff = true;
            jouerVoie(String(args[1] || '').toLowerCase(), args[2] != null ? parseInt(args[2]) / 100 : 0.8);
        } else if (sub === 'theme') {
            window.ChutesLac.theme(isNaN(parseInt(args[1])) ? args.slice(1).join(' ') : parseInt(args[1]));
        } else if (sub === 'intensite') {
            setIntensite((parseInt(args[1]) || 0) / 100);
        } else if (sub === 'stop') {
            if ($gameSystem) $gameSystem._lacAutoOff = false;
            stop();
        } else if (sub === 'auto') {
            if ($gameSystem) $gameSystem._lacAutoOff = (String(args[1]).toLowerCase() === 'off');
        }
    };
})();
