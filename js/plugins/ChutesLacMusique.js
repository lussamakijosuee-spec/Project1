//=============================================================================
// ChutesLacMusique.js — v1.0 · L'Appel du Lac (musique procédurale)
// RPG Maker MV   ·   moteur WebAudio · boîte à musique 1800 / VHS terrifiant
//=============================================================================
/*:
 * @plugindesc [v1.0] 30 mélodies GÉNÉRÉES en direct pour les Chutes : boîte à
 * musique désaccordée façon 1800, souffle de bande VHS, drone terrifiant.
 * S'intensifie avec la Chute. Aucun fichier audio à ajouter.
 * @author JOKO / Claude
 *
 * @param volume
 * @text Volume (%)
 * @type number
 * @min 0
 * @max 100
 * @default 70
 * @desc Volume de base du Lac (multiplié par le volume BGM des options).
 *
 * @param auto
 * @text Déclenchement automatique
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Le Lac se met à chanter tout seul quand la folie (phase mentale) descend.
 *
 * @param seuil
 * @text Seuil d'apparition (%)
 * @type number
 * @min 0
 * @max 90
 * @default 20
 * @desc En dessous de ce % de pression de Chute, le Lac reste muet.
 *
 * @param remplacerBGM
 * @text Étouffer la musique du jeu
 * @type boolean
 * @on Oui
 * @off Non
 * @default false
 * @desc Baisse la BGM normale à mesure que le Lac prend le dessus.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'APPEL DU LAC — 30 mélodies qui n'existent dans aucun fichier
 * ═══════════════════════════════════════════════════════════════════════════
 *  Toute la musique est SYNTHÉTISÉE en direct (WebAudio). Rien à installer.
 *  Le timbre : une boîte à musique ancienne, légèrement fausse (1800), noyée
 *  dans le souffle d'une vieille cassette VHS (wow & flutter, sifflement,
 *  coupures), au-dessus d'un drone sourd et terrifiant. Chaque écoute est
 *  unique — les notes sont tissées sur le moment, jamais deux fois pareil.
 *
 *  30 THÈMES nommés (échelle + registre + tempo + timbre + tremblement).
 *  Plus la Chute approche (phase mentale qui descend), plus la musique :
 *    • se désaccorde et tremble (bande qui se déforme),
 *    • s'assombrit et se densifie,
 *    • laisse échapper des dissonances qui « appellent ».
 *
 *  COMMANDES :
 *      CHUTELAC play [thème] [intensité%]   lance le Lac (ex: CHUTELAC play 3 80)
 *      CHUTELAC theme <nom|index>           change de thème en douceur
 *      CHUTELAC intensite <%>               force l'intensité (0-100)
 *      CHUTELAC stop                        éteint le Lac (fondu)
 *      CHUTELAC auto on|off                 (dé)active le déclenchement auto
 *  SCRIPT :
 *      ChutesLac.themes()   → liste des 30 noms
 *      ChutesLac.play(i, 0.8) / ChutesLac.stop() / ChutesLac.intensite(0.5)
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

    // Pression de Chute la plus forte du groupe (0..1) — le Fond pèse le plus.
    function pressionChute() {
        var m = 0;
        if ($gameParty) $gameParty.members().forEach(function (a) {
            var id = a.actorId();
            m = Math.max(m, (5 - phase(id)) / 4, jErr(id) / 100 * 0.8, jCorr(id) / 100 * 0.7);
        });
        return m.clamp(0, 1);
    }

    //=========================================================================
    // Les 30 thèmes  (échelles en demi-tons, registre MIDI, tempo, timbre…)
    //=========================================================================
    var SC = {
        aeolien:   [0, 2, 3, 5, 7, 8, 10],
        phrygien:  [0, 1, 3, 5, 7, 8, 10],
        harmo:     [0, 2, 3, 5, 7, 8, 11],
        locrien:   [0, 1, 3, 5, 6, 8, 10],
        hira:      [0, 2, 3, 7, 8],          // boîte à musique japonaise
        inSen:     [0, 1, 5, 7, 8],
        ton:       [0, 2, 4, 6, 8, 10],      // gammes par tons (vertige)
        penta:     [0, 3, 5, 7, 10],
        double:    [0, 1, 4, 5, 7, 8, 11]    // double harmonique (funeste)
    };
    // nom, gamme, note de base (MIDI), durée d'un pas (s), timbre, tremblement
    var THEMES = [
        ['Berceuse du Fond',        SC.hira,    60, 0.62, 'boite',  0.5],
        ['Ne coule pas encore',     SC.aeolien, 57, 0.55, 'boite',  0.6],
        ['Détends-toi',             SC.penta,   62, 0.70, 'verre',  0.4],
        ['Cassette n°7',            SC.phrygien,55, 0.50, 'cloche', 0.8],
        ['Sourire sous l\'eau',     SC.inSen,   64, 0.66, 'boite',  0.5],
        ['1897',                    SC.harmo,   53, 0.58, 'cloche', 0.7],
        ['La main douce',           SC.hira,    59, 0.60, 'boite',  0.6],
        ['Laisse-toi aller',        SC.penta,   57, 0.72, 'verre',  0.5],
        ['Le lac respire',          SC.aeolien, 50, 0.80, 'cloche', 0.7],
        ['Comptine noyée',          SC.inSen,   62, 0.54, 'boite',  0.7],
        ['VHS — piste morte',       SC.locrien, 52, 0.48, 'cloche', 1.0],
        ['Tout va bien maintenant', SC.penta,   60, 0.68, 'verre',  0.4],
        ['Les yeux du fond',        SC.double,  49, 0.60, 'cloche', 0.9],
        ['Poupée cassée',           SC.phrygien,58, 0.52, 'boite',  0.8],
        ['Reste, reste',            SC.hira,    55, 0.64, 'boite',  0.6],
        ['Valse des noyés',         SC.harmo,   57, 0.45, 'cloche', 0.7],
        ['Enregistrement 03',       SC.locrien, 54, 0.50, 'cloche', 1.0],
        ['Le sommeil du lac',       SC.aeolien, 48, 0.88, 'verre',  0.6],
        ['Petit ami de l\'eau',     SC.inSen,   63, 0.58, 'boite',  0.6],
        ['Chambre 1800',            SC.double,  52, 0.56, 'cloche', 0.9],
        ['Souffle contre la vitre', SC.ton,     56, 0.62, 'verre',  0.8],
        ['On t\'attend en bas',     SC.phrygien,51, 0.54, 'cloche', 0.9],
        ['Berceuse à l\'envers',    SC.hira,    60, 0.66, 'boite',  0.7],
        ['La bande se déforme',     SC.ton,     54, 0.50, 'cloche', 1.0],
        ['Doux, si doux',           SC.penta,   59, 0.74, 'verre',  0.4],
        ['Le rire des enfants',     SC.inSen,   65, 0.48, 'boite',  0.7],
        ['Dernier tour de manège',  SC.harmo,   55, 0.46, 'cloche', 0.8],
        ['Sous la surface',         SC.aeolien, 50, 0.78, 'verre',  0.7],
        ['Rembobine',               SC.locrien, 53, 0.52, 'cloche', 1.0],
        ['L\'eau est chaude',       SC.hira,    58, 0.70, 'boite',  0.5]
    ];

    function midiFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

    //=========================================================================
    // Le moteur audio
    //=========================================================================
    var Lac = {
        ctx: null, master: null, wet: null, wobble: null, wobbleGain: null,
        flutter: null, flutterGain: null, hissGain: null, drone: [], droneGain: null,
        actif: false, intensite: 0, cible: 0, themeIndex: 0,
        nextTime: 0, timer: null, motif: [], motifPos: 0, whineOsc: null, whineGain: null
    };

    function ctxOK() {
        try {
            Lac.ctx = (window.WebAudio && WebAudio._context) ? WebAudio._context : Lac.ctx;
            if (!Lac.ctx && typeof AudioContext !== 'undefined') Lac.ctx = new AudioContext();
            if (Lac.ctx && Lac.ctx.state === 'suspended') Lac.ctx.resume();
            return !!Lac.ctx;
        } catch (e) { return false; }
    }

    function bruitBuffer(ctx, secondes) {
        var n = ctx.sampleRate * secondes;
        var buf = ctx.createBuffer(1, n, ctx.sampleRate);
        var d = buf.getChannelData(0);
        for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
        return buf;
    }

    function construire() {
        if (Lac.master || !ctxOK()) return !!Lac.master;
        var ctx = Lac.ctx;

        Lac.master = ctx.createGain();
        Lac.master.gain.value = 0;
        Lac.master.connect(ctx.destination);

        // réverbération hantée : delay rebouclé + lowpass
        var delay = ctx.createDelay(1.0); delay.delayTime.value = 0.19;
        var fb = ctx.createGain(); fb.gain.value = 0.38;
        var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
        delay.connect(lp); lp.connect(fb); fb.connect(delay);
        Lac.wet = ctx.createGain(); Lac.wet.gain.value = 0.9;
        delay.connect(Lac.wet); Lac.wet.connect(Lac.master);
        Lac._delay = delay;

        // tremblement de bande (wow) + flutter rapide → détune des notes/drone
        Lac.wobble = ctx.createOscillator(); Lac.wobble.type = 'sine'; Lac.wobble.frequency.value = 0.7;
        Lac.wobbleGain = ctx.createGain(); Lac.wobbleGain.gain.value = 12;
        Lac.wobble.connect(Lac.wobbleGain); Lac.wobble.start();
        Lac.flutter = ctx.createOscillator(); Lac.flutter.type = 'triangle'; Lac.flutter.frequency.value = 6.3;
        Lac.flutterGain = ctx.createGain(); Lac.flutterGain.gain.value = 4;
        Lac.flutter.connect(Lac.flutterGain); Lac.flutter.start();

        // souffle de cassette
        var hiss = ctx.createBufferSource(); hiss.buffer = bruitBuffer(ctx, 2); hiss.loop = true;
        var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 5200;
        Lac.hissGain = ctx.createGain(); Lac.hissGain.gain.value = 0.02;
        hiss.connect(hp); hp.connect(Lac.hissGain); Lac.hissGain.connect(Lac.master);
        hiss.start();

        // drone sourd
        Lac.droneGain = ctx.createGain(); Lac.droneGain.gain.value = 0.0;
        var dlp = ctx.createBiquadFilter(); dlp.type = 'lowpass'; dlp.frequency.value = 500;
        Lac.droneGain.connect(dlp); dlp.connect(Lac.master);
        [0, 0].forEach(function (_, i) {
            var o = ctx.createOscillator(); o.type = i ? 'triangle' : 'sine';
            o.detune.value = i ? 7 : -5;
            Lac.wobbleGain.connect(o.detune);
            o.connect(Lac.droneGain); o.start();
            Lac.drone.push(o);
        });

        // sifflement aigu VHS (va et vient)
        Lac.whineOsc = ctx.createOscillator(); Lac.whineOsc.type = 'sine'; Lac.whineOsc.frequency.value = 8400;
        Lac.whineGain = ctx.createGain(); Lac.whineGain.gain.value = 0;
        Lac.whineOsc.connect(Lac.whineGain); Lac.whineGain.connect(Lac.master); Lac.whineOsc.start();

        return true;
    }

    // Une note de « boîte à musique »
    function jouerNote(freq, t, timbre, gain, detuneRnd) {
        var ctx = Lac.ctx;
        var g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        var dur, atk;
        if (timbre === 'cloche') { dur = 2.2; atk = 0.006; }
        else if (timbre === 'verre') { dur = 1.6; atk = 0.02; }
        else { dur = 1.0; atk = 0.004; } // boite
        g.gain.exponentialRampToValueAtTime(gain, t + atk);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        var o = ctx.createOscillator();
        o.type = timbre === 'cloche' ? 'sine' : (timbre === 'verre' ? 'sine' : 'triangle');
        o.frequency.value = freq;
        o.detune.value = detuneRnd;
        Lac.wobbleGain.connect(o.detune);
        Lac.flutterGain.connect(o.detune);
        o.connect(g);

        // harmonique faible (inharmonique pour la cloche → métal froid)
        var o2 = ctx.createOscillator();
        o2.type = 'sine';
        o2.frequency.value = freq * (timbre === 'cloche' ? 2.76 : 2.0);
        var g2 = ctx.createGain(); g2.gain.value = 0;
        g2.gain.setValueAtTime(0.0001, t);
        g2.gain.exponentialRampToValueAtTime(gain * 0.25, t + atk);
        g2.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.7);
        o2.connect(g2);

        g.connect(Lac._delay); g.connect(Lac.master);
        g2.connect(Lac._delay); g2.connect(Lac.master);
        o.start(t); o.stop(t + dur + 0.05);
        o2.start(t); o2.stop(t + dur + 0.05);
    }

    function nouveauMotif(theme) {
        var sc = theme[1], n = 3 + Math.floor(Math.random() * 4);
        var m = [];
        for (var i = 0; i < n; i++) m.push(Math.floor(Math.random() * sc.length) + (Math.random() < 0.3 ? sc.length : 0));
        return m;
    }

    function scheduler() {
        if (!Lac.actif) return;
        var ctx = Lac.ctx;
        var theme = THEMES[Lac.themeIndex];
        var sc = theme[1], root = theme[2], step = theme[3], timbre = theme[4], trem = theme[5];
        var it = Lac.intensite;

        // paramètres pilotés par l'intensité
        Lac.wobbleGain.gain.value = (6 + trem * 10) + it * 26;      // se désaccorde en sombrant
        Lac.flutterGain.gain.value = 2 + it * 8;
        Lac.hissGain.gain.value = 0.015 + it * 0.05;
        Lac.droneGain.gain.setTargetAtTime(0.05 + it * 0.16, ctx.currentTime, 0.4);
        Lac._delay && (Lac._delay.delayTime.value = 0.16 + it * 0.06);

        var densite = 0.45 + it * 0.4;
        while (Lac.nextTime < ctx.currentTime + 0.25) {
            var t = Lac.nextTime;
            if (Math.random() < densite) {
                if (!Lac.motif.length || Lac.motifPos >= Lac.motif.length) {
                    Lac.motif = nouveauMotif(theme); Lac.motifPos = 0;
                }
                var deg = Lac.motif[Lac.motifPos++];
                var oct = Math.floor(deg / sc.length);
                var semis = sc[deg % sc.length] + oct * 12;
                // dissonance qui « appelle » quand ça sombre
                if (Math.random() < it * 0.22) semis += (Math.random() < 0.5 ? 1 : 6);
                var m = root + semis + (Math.random() < 0.25 ? -12 : 0);
                var detune = (Math.random() * 2 - 1) * (8 + it * 22); // faux
                var g = (timbre === 'cloche' ? 0.16 : 0.20) * (0.7 + Math.random() * 0.5);
                jouerNote(midiFreq(m), t, timbre, g, detune);
            }
            // coupure de bande (dropout) rare, plus fréquente en sombrant
            if (Math.random() < 0.015 + it * 0.05) {
                Lac.master.gain.cancelScheduledValues(t);
                Lac.master.gain.setTargetAtTime(0.0, t, 0.01);
                Lac.master.gain.setTargetAtTime(volumeCible(), t + 0.05 + Math.random() * 0.12, 0.05);
            }
            // sifflement VHS qui va et vient
            if (Math.random() < 0.03) {
                Lac.whineGain.gain.setTargetAtTime(0.004 + it * 0.01, t, 0.3);
                Lac.whineGain.gain.setTargetAtTime(0, t + 0.5 + Math.random(), 0.6);
            }
            Lac.nextTime += step * (0.9 + Math.random() * 0.25);
        }
    }

    function volumeCible() {
        var cfgBgm = (typeof ConfigManager !== 'undefined' && ConfigManager.bgmVolume != null)
            ? ConfigManager.bgmVolume / 100 : 1;
        return VOL_BASE * cfgBgm * (0.25 + 0.75 * Lac.intensite);
    }

    //=========================================================================
    // Contrôle
    //=========================================================================
    function play(themeIdx, intensite) {
        if (!construire()) return;
        if (themeIdx != null) Lac.themeIndex = ((themeIdx | 0) % THEMES.length + THEMES.length) % THEMES.length;
        Lac.cible = intensite == null ? Math.max(0.5, Lac.cible) : intensite.clamp(0, 1);
        Lac.wobble.frequency.value = 0.5 + Math.random() * 0.6;
        Lac.motif = []; Lac.motifPos = 0;
        if (!Lac.actif) {
            Lac.actif = true;
            Lac.nextTime = Lac.ctx.currentTime + 0.1;
            Lac.timer = setInterval(scheduler, 45);
        }
        if (DUCK) try { AudioManager.fadeOutBgm(3); } catch (e) {}
    }
    function stop() {
        if (!Lac.actif) return;
        Lac.cible = 0;
        // on laisse le fondu se faire, puis coupe le scheduler
        setTimeout(function () {
            if (Lac.cible <= 0.001) {
                Lac.actif = false;
                if (Lac.timer) { clearInterval(Lac.timer); Lac.timer = null; }
                if (DUCK) try { if ($gameSystem && $gameSystem.replayBgm) $gameSystem.replayBgm(); } catch (e) {}
            }
        }, 2600);
    }
    function setIntensite(x) { Lac.cible = x.clamp(0, 1); if (Lac.cible > 0 && !Lac.actif) play(null, Lac.cible); }

    // lissage de l'intensité + du volume (appelé chaque frame sur la carte)
    function maj() {
        if (!Lac.master) return;
        Lac.intensite += (Lac.cible - Lac.intensite) * 0.03;
        if (Lac.intensite < 0.001 && Lac.cible <= 0) Lac.intensite = 0;
        var v = Lac.actif || Lac.intensite > 0.001 ? volumeCible() : 0;
        try { Lac.master.gain.setTargetAtTime(v, Lac.ctx.currentTime, 0.3); } catch (e) {}
    }

    // API publique
    window.ChutesLac = {
        themes: function () { return THEMES.map(function (t) { return t[0]; }); },
        play: play, stop: stop, intensite: setIntensite,
        theme: function (nomOuIdx) {
            var i = typeof nomOuIdx === 'number' ? nomOuIdx :
                THEMES.map(function (t) { return t[0].toLowerCase(); }).indexOf(String(nomOuIdx).toLowerCase());
            if (i >= 0) Lac.themeIndex = i;
        }
    };

    //=========================================================================
    // Intégration carte : mode auto + lissage + arrêt en quittant
    //=========================================================================
    var _updMap = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _updMap.call(this);
        try {
            if (AUTO && !($gameSystem && $gameSystem._lacAutoOff)) {
                var pr = pressionChute();
                if (pr >= SEUIL) {
                    if (!Lac.actif) {
                        // choisit un thème selon l'humeur du moment
                        play(Math.floor(Math.random() * THEMES.length), pr);
                    }
                    Lac.cible = pr;
                } else if (Lac.actif && Lac.cible > 0) {
                    stop();
                }
            }
            maj();
        } catch (e) {}
    };

    var _stopMap = Scene_Map.prototype.stop;
    Scene_Map.prototype.stop = function () {
        // on garde le Lac s'il chante encore (transition de carte), sinon on le laisse mourir
        _stopMap.call(this);
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
            if ($gameSystem) $gameSystem._lacAutoOff = true; // scénarisé : on laisse la main
            play(isNaN(th) ? null : th, it);
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
