//=============================================================================
// LeRythme.js — v1.0  ·  Le jeu de rythme, comme FNF
// RPG Maker MV   ·   pour JOKO
//   Sans dépendance. LaBoiteAMusique et MOG_Theatrhythm s'en servent.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le jeu de rythme façon Friday Night Funkin' : quatre
 * flèches, les notes sur le temps de la musique, n'importe quelle musique du jeu.
 * @author pour JOKO
 *
 * @param vitesse
 * @text Vitesse de défilement
 * @type number
 * @decimals 2
 * @min 0.3
 * @default 1.00
 * @desc Multiplie la vitesse des notes de toutes les partitions (1 = normal).
 *
 * @param duel
 * @text Duel (l'adversaire chante aussi) ?
 * @type boolean
 * @default true
 * @desc Partitions automatiques : quatre mesures pour l'adversaire, quatre pour
 * toi, comme dans FNF. Non : toutes les notes sont à toi.
 *
 * @param fantome
 * @text Taper dans le vide ne coûte rien ?
 * @type boolean
 * @default true
 * @desc Le « ghost tapping » de FNF. Non : une touche sans note est un raté.
 *
 * @param basEnHaut
 * @text Notes qui descendent ?
 * @type boolean
 * @default false
 * @desc Non : les notes montent vers les flèches en haut (FNF). Oui : elles
 * descendent vers les flèches en bas (« downscroll »).
 *
 * @param decalageAudio
 * @text Calage du son (ms)
 * @type number
 * @min -500
 * @max 500
 * @default 0
 * @desc Si les notes arrivent toujours en avance sur le son, mets un nombre
 * positif ; en retard, négatif. 0 convient presque partout.
 *
 * @param notesSpecialesAuto
 * @text Notes spéciales dans les partitions auto ?
 * @type boolean
 * @default true
 * @desc Oui : la partition auto pose des notes critiques, des soins (facile,
 * normal) et des pièges (difficile). Non : seulement des notes normales et longues.
 *
 * @param volume
 * @text Volume de la musique (%)
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param variableScore
 * @text Variable du score
 * @type variable
 * @default 0
 * @desc Le score de la dernière partie y est écrit. 0 : aucune.
 *
 * @param interrupteurVictoire
 * @text Interrupteur de la victoire
 * @type switch
 * @default 0
 * @desc Allumé si la dernière partie est gagnée, éteint sinon. 0 : aucun.
 *
 * @param editeur
 * @text L'éditeur est proposé dans le menu ?
 * @type boolean
 * @default true
 * @desc Oui : « Éditer la partition » apparaît avant chaque partie. Non : on
 * n'y entre que par la commande rythme_editeur.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE JEU DE RYTHME
 * ═══════════════════════════════════════════════════════════════════════════
 *  Deux rangées de quatre flèches : à gauche l'adversaire, à droite toi. Les
 *  notes montent ; tape la flèche quand elle passe sur la sienne.
 *    Touches : ← ↓ ↑ →   ou   D F J K   (et la croix d'une manette)
 *    Échap : pause.
 *  Le jugement : Sick (±45 ms), Bien (±90), Bof (±166), Raté. La barre de vie
 *  penche vers celui qui chante le mieux ; vide de ton côté, c'est perdu.
 *
 *  N'IMPORTE QUELLE MUSIQUE
 *  Le jeu écoute la musique, trouve son tempo et ses temps forts, et en tire
 *  une partition jouable en trois difficultés (facile, normal, difficile).
 *  Une partition écrite par toi passe avant : rythme/partitions/<musique>.json
 *  (l'éditeur l'écrit). Une difficulté que tu laisses vide reste en auto.
 *
 *  LES NOTES
 *    normale · longue (on la tient) · piège (ne pas taper : elle fait mal) ·
 *    soin (rend de la vie) · critique (score double)
 *
 *  LES EFFETS DE CHANSON (posés dans l'éditeur)
 *    vitesse  — les notes vont plus vite ou plus lentement
 *    tremble  — tes flèches tremblent
 *    cache    — tes flèches s'effacent (0) ou reviennent (1)
 *    zoom     — la caméra zoome d'un coup puis revient
 *    secousse — l'écran secoue
 *    flash    — un éclair blanc
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  COMMANDES DE MODULE
 *  ─────────────────────────────────────────────────────────────────────────
 *    rythme Battle1                  la musique Battle1 : on choisit la
 *                                    difficulté (et l'éditeur) au début
 *    rythme Battle1 difficile        directement en difficile
 *    rythme Battle1 normal contre:2  contre l'acteur 2
 *    rythme Battle1 normal contre:e12  contre l'ennemi 12
 *    rythme_editeur Battle1          l'éditeur de partition
 *  Un nom de musique avec des espaces s'écrit tel quel.
 *  En script : Rythme.jouer('Battle1', 'normal'), Rythme.editer('Battle1').
 *  Après la partie : $gameSystem._rythmeDernier = { score, rang, victoire }.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  L'ÉDITEUR — rythme_editeur <musique>
 *  ─────────────────────────────────────────────────────────────────────────
 *    Espace        lecture / pause
 *    ↑ ↓ / molette avancer, reculer d'un pas de grille (Pg↑ Pg↓ : une mesure)
 *    D F J K       poser / enlever une note à toi au curseur (en lecture :
 *                  elle s'enregistre au temps ; tenue, elle devient longue)
 *    Maj + D F J K   … pour l'adversaire
 *    Clic          poser / enlever une note · clic droit : enlever
 *    L / Maj+L     allonger / raccourcir la note au curseur
 *    T             type de note (normale, piège, soin, critique)
 *    G             grille (1, 1/2, 1/3, 1/4, 1/6, 1/8 de temps)
 *    E / R         choisir un effet / le poser au curseur
 *    V / Maj+V     valeur de l'effet au curseur · N / Maj+N : sa durée
 *    Suppr         effacer tout ce qui est sur la ligne du curseur
 *    Tab           difficulté suivante
 *    B / Maj+B     tempo +0,1 / −0,1 (Ctrl : ±1) · O / Maj+O : décalage ±5 ms
 *    A (deux fois) remplacer cette difficulté par la partition auto
 *    H             le clic des notes pendant la lecture
 *    Z             zoom de la frise
 *    Ctrl+Z Ctrl+Y annuler / rétablir · Ctrl+S enregistrer
 *    Entrée        jouer depuis le curseur · Échap : quitter
 *  L'enregistrement écrit rythme/partitions/<musique>.json (en jeu de test,
 *  sur le PC). Dans un navigateur, le fichier est téléchargé.
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('LeRythme');
    function num(k, d) { var v = P[k]; return v === undefined || v === '' ? d : Number(v); }
    function oui(k, d) { var v = P[k]; return v === undefined || v === '' ? d : v === 'true'; }

    var Rythme = window.Rythme = {
        reglages: {
            vitesse: num('vitesse', 1), duel: oui('duel', true), fantome: oui('fantome', true),
            basEnHaut: oui('basEnHaut', false), decalage: num('decalageAudio', 0),
            notesSpecialesAuto: oui('notesSpecialesAuto', true), volume: num('volume', 90),
            variableScore: num('variableScore', 0), interrupteurVictoire: num('interrupteurVictoire', 0),
            editeur: oui('editeur', true)
        },
        DIFFICULTES: ['facile', 'normal', 'difficile'],
        NOMS_DIFF: { facile: 'Facile', normal: 'Normal', difficile: 'Difficile' },
        TYPES: ['normale', 'piège', 'soin', 'critique'],
        EFFETS: ['vitesse', 'tremble', 'cache', 'zoom', 'secousse', 'flash'],
        // valeur et durée (ms) par défaut d'un effet posé dans l'éditeur
        EFFET_DEFAUT: { vitesse: [1.5, 0], tremble: [6, 2000], cache: [0, 500], zoom: [1.12, 400], secousse: [8, 400], flash: [1, 300] },
        // les fenêtres du jugement, en ms
        SICK: 45, BIEN: 90, BOF: 166, PIEGE: 60,
        _analyses: {}, _partitions: {}, _tampons: {}
    };

    //=========================================================================
    // Les fichiers : la liste des musiques, les partitions
    //=========================================================================
    var fs = null, chemin = null, racine = '';
    if (Utils.isNwjs()) {
        try { fs = require('fs'); chemin = require('path'); racine = chemin.dirname(process.mainModule.filename); } catch (e) { fs = null; }
    }
    Rythme.fs = fs;

    function lireJsonSync(url) {
        try {
            var x = new XMLHttpRequest();
            x.open('GET', url, false);
            x.overrideMimeType('application/json');
            x.send(null);
            if (x.status === 200 || (x.status === 0 && x.responseText)) return JSON.parse(x.responseText);
        } catch (e) { /* absent */ }
        return null;
    }

    function trierNoms(a, b) { return a.toLowerCase().localeCompare(b.toLowerCase(), 'fr'); }

    // [{ nom, formats: ['ogg', 'm4a'] }] — sur le PC, lue dans audio/bgm ; sinon rythme/musiques.json
    Rythme.musiques = function () {
        if (this._musiques) return this._musiques;
        var liste = null, pochettes = null;
        if (fs) {
            try {
                var noms = {};
                fs.readdirSync(chemin.join(racine, 'audio', 'bgm')).forEach(function (f) {
                    var m = /^(.*)\.(ogg|m4a)$/i.exec(f);
                    if (m) (noms[m[1]] = noms[m[1]] || []).push(m[2].toLowerCase());
                });
                liste = Object.keys(noms).sort(trierNoms).map(function (n) { return { nom: n, formats: noms[n] }; });
                pochettes = fs.readdirSync(chemin.join(racine, 'img', 'musicbook'))
                    .filter(function (f) { return /\.png$/i.test(f); }).map(function (f) { return f.replace(/\.png$/i, ''); });
            } catch (e) { liste = null; }
        }
        if (!liste) {
            var j = lireJsonSync('rythme/musiques.json');
            if (j) { liste = j.musiques || []; pochettes = j.pochettes || []; }
        }
        this._musiques = liste || [];
        this._pochettes = {};
        (pochettes || []).forEach(function (p) { this._pochettes[p] = true; }, this);
        this._parNom = {};
        this._musiques.forEach(function (m) { this._parNom[m.nom] = m; }, this);
        return this._musiques;
    };
    Rythme.musique = function (nom) { this.musiques(); return this._parNom[nom] || null; };
    Rythme.aUnePochette = function (nom) { this.musiques(); return !!this._pochettes[nom]; };

    // Ce que ce moteur sait lire : l'ogg partout sur PC, le m4a (AAC) pas toujours
    Rythme.peutLire = {
        ogg: WebAudio.canPlayOgg(),
        m4a: (function () { try { return !!document.createElement('audio').canPlayType('audio/mp4; codecs="mp4a.40.2"'); } catch (e) { return false; } })()
    };
    // L'extension à prendre pour cette musique, ou null si aucun format n'est lisible ici
    Rythme.extDe = function (nom) {
        var d = AudioManager.audioFileExt().slice(1), m = this.musique(nom);
        if (!m) return d;
        if (m.formats.indexOf(d) >= 0 && this.peutLire[d] !== false) return d;
        for (var i = 0; i < m.formats.length; i++) if (this.peutLire[m.formats[i]]) return m.formats[i];
        return null;
    };
    Rythme.lisible = function (nom) { return this.extDe(nom) !== null; };

    // Une musique qui n'existerait que dans l'autre format (.m4a sur PC, .ogg sur mobile) :
    // MV chercherait un fichier absent et planterait. On ne change l'extension que dans ce cas.
    var _creerTampon = AudioManager.createBuffer;
    AudioManager.createBuffer = function (dossier, nom) {
        if (dossier === 'bgm' && Rythme.musique(nom)) {
            var ext = Rythme.extDe(nom), d = this.audioFileExt();
            if (ext && '.' + ext !== d) {
                var ancien = this.audioFileExt;
                this.audioFileExt = function () { return '.' + ext; };
                try { return _creerTampon.call(this, dossier, nom); } finally { this.audioFileExt = ancien; }
            }
        }
        return _creerTampon.call(this, dossier, nom);
    };

    // Le nom affiché : « Battle-Conflict_loop » → « Battle Conflict loop »
    Rythme.titre = function (nom) {
        return String(nom).replace(/^Z_Net_/i, '').replace(/^\d+[\s._-]+/, '').replace(/[_]+/g, ' ')
            .replace(/(\S)-(?=\S)/g, '$1 ').replace(/\s+-\s+/g, ' - ').replace(/\s+/g, ' ').trim();
    };

    function nomDeFichier(nom) { return String(nom).replace(/[\\/:*?"<>|]/g, '_'); }

    // La partition écrite par JOKO pour cette musique, ou null
    Rythme.lirePartition = function (nom) {
        if (this._partitions[nom] !== undefined) return this._partitions[nom];
        var p = null;
        if (fs) {
            var f = chemin.join(racine, 'rythme', 'partitions', nomDeFichier(nom) + '.json');
            try { if (fs.existsSync(f)) p = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { p = null; }
        } else {
            p = lireJsonSync('rythme/partitions/' + encodeURIComponent(nomDeFichier(nom)) + '.json');
        }
        this._partitions[nom] = p;
        return p;
    };

    // Écrit la partition (sur le PC), ou la fait télécharger (navigateur). Rend le chemin, ou ''.
    Rythme.ecrirePartition = function (nom, p) {
        var texte = JSON.stringify(p, null, 1);
        this._partitions[nom] = JSON.parse(texte);
        if (fs) {
            var dossier = chemin.join(racine, 'rythme', 'partitions');
            if (!fs.existsSync(chemin.join(racine, 'rythme'))) fs.mkdirSync(chemin.join(racine, 'rythme'));
            if (!fs.existsSync(dossier)) fs.mkdirSync(dossier);
            var f = chemin.join(dossier, nomDeFichier(nom) + '.json');
            fs.writeFileSync(f, texte, 'utf8');
            return 'rythme/partitions/' + nomDeFichier(nom) + '.json';
        }
        try {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([texte], { type: 'application/json' }));
            a.download = nomDeFichier(nom) + '.json';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
        } catch (e) { /* rien */ }
        return '';
    };
    Rythme.aSaPartition = function (nom) { return !!this.lirePartition(nom); };

    //=========================================================================
    // Charger le son : on décode nous-mêmes (pour l'analyse, et un lecteur précis)
    //=========================================================================
    // rappel(err, AudioBuffer)
    Rythme.chargerSon = function (nom, rappel) {
        var tampons = this._tampons;
        if (tampons[nom] && tampons[nom].buffer) { rappel(null, tampons[nom].buffer); return; }
        if (tampons[nom]) { tampons[nom].attente.push(rappel); return; }
        var ext = this.extDe(nom);
        if (!ext) { rappel('format illisible ici (' + ((this.musique(nom) || {}).formats || []).join(', ') + ')'); return; }
        if (!WebAudio._context) { rappel('pas de son dans ce navigateur'); return; }
        var t = tampons[nom] = { buffer: null, attente: [rappel] };
        function fini(err, b) {
            if (err) delete tampons[nom]; else t.buffer = b;
            t.attente.splice(0).forEach(function (r) { r(err, b); });
        }
        var url = 'audio/bgm/' + encodeURIComponent(nom) + '.' + ext;
        if (Decrypter.hasEncryptedAudio) url = Decrypter.extToEncryptExt(url);
        var x = new XMLHttpRequest();
        x.open('GET', url);
        x.responseType = 'arraybuffer';
        x.onload = function () {
            if (x.status >= 400 || !x.response) { fini('fichier introuvable : ' + url); return; }
            var tableau = x.response;
            if (Decrypter.hasEncryptedAudio) tableau = Decrypter.decryptArrayBuffer(tableau);
            try {
                WebAudio._context.decodeAudioData(tableau, function (b) { fini(null, b); },
                    function () { fini('le son ne se décode pas (' + ext + ')'); });
            } catch (e) { fini('le son ne se décode pas (' + ext + ')'); }
        };
        x.onerror = function () { fini('fichier introuvable : ' + url); };
        x.send();
    };
    // On ne garde en mémoire que les deux derniers sons décodés
    Rythme._ordre = [];
    Rythme._garder = function (nom) {
        this._ordre = this._ordre.filter(function (n) { return n !== nom; });
        this._ordre.push(nom);
        while (this._ordre.length > 2) delete this._tampons[this._ordre.shift()];
    };

    // La musique du jeu est mise de côté une fois, et rendue quand on sort pour de bon
    Rythme.entrer = function () {
        if (this._mise) return;
        BattleManager.saveBgmAndBgs(); AudioManager.fadeOutBgm(1); AudioManager.stopBgs();
        this._mise = true;
    };
    Rythme.sortir = function () {
        if (!this._mise) return;
        this._mise = false;
        BattleManager.replayBgmAndBgs();
    };

    // Un lecteur qui sait exactement où il en est
    function Lecteur(buffer) { this.buffer = buffer; this.source = null; this.t0 = 0; this.pos = 0; this.joue = false; this.volume = Rythme.reglages.volume / 100; }
    Lecteur.prototype.latence = function () {
        var c = WebAudio._context;
        return (c.outputLatency || 0) + (c.baseLatency || 0);
    };
    Lecteur.prototype.jouer = function (depuis) {
        this.arreter();
        var c = WebAudio._context, s = c.createBufferSource(), g = c.createGain();
        depuis = Math.max(0, Math.min(depuis || 0, this.buffer.duration));
        s.buffer = this.buffer;
        g.gain.value = this.volume * (AudioManager._bgmVolume / 100);
        s.connect(g);
        g.connect(WebAudio._masterGainNode || c.destination);
        s.start(0, depuis);
        this.source = s; this.gain = g; this.t0 = c.currentTime - depuis; this.joue = true;
    };
    // En secondes, ce qu'on entend en ce moment
    Lecteur.prototype.temps = function () {
        if (!this.joue) return this.pos;
        return WebAudio._context.currentTime - this.t0 - this.latence();
    };
    Lecteur.prototype.pause = function () { if (this.joue) { this.pos = this.temps(); this.arreter(); } };
    Lecteur.prototype.arreter = function () {
        if (this.source) { try { this.source.stop(0); } catch (e) { /* déjà arrêté */ } this.source.disconnect(); if (this.gain) this.gain.disconnect(); }
        this.source = null; this.gain = null; this.joue = false;
    };
    Lecteur.prototype.duree = function () { return this.buffer.duration; };
    Rythme.Lecteur = Lecteur;

    //=========================================================================
    // L'analyse : le tempo, le premier temps, les temps forts
    //=========================================================================
    var SAUT = 512;

    Rythme.analyser = function (nom, buffer) {
        if (this._analyses[nom]) return this._analyses[nom];
        var sr = buffer.sampleRate, n = buffer.length, a = buffer.getChannelData(0);
        var b = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;
        var nf = Math.floor(n / SAUT), fr = sr / SAUT;
        var bas = new Float32Array(nf), mil = new Float32Array(nf), haut = new Float32Array(nf), rms = new Float32Array(nf);
        var kb = 1 - Math.exp(-2 * Math.PI * 150 / sr), kh = 1 - Math.exp(-2 * Math.PI * 2500 / sr);
        var pb = 0, ph = 0, j = 0, f, i;
        for (f = 0; f < nf; f++) {
            var eb = 0, em = 0, eh = 0, et = 0;
            for (i = 0; i < SAUT; i++, j++) {
                var x = b ? (a[j] + b[j]) * 0.5 : a[j];
                pb += kb * (x - pb); ph += kh * (x - ph);
                var md = ph - pb, hi = x - ph;
                eb += pb * pb; em += md * md; eh += hi * hi; et += x * x;
            }
            bas[f] = Math.log(1e-7 + eb); mil[f] = Math.log(1e-7 + em); haut[f] = Math.log(1e-7 + eh); rms[f] = Math.sqrt(et / SAUT);
        }
        // le flux : ce qui monte d'une trame à l'autre, par bande
        var fb = new Float32Array(nf), fm = new Float32Array(nf), fh = new Float32Array(nf), env = new Float32Array(nf), somme = 0;
        for (f = 1; f < nf; f++) {
            fb[f] = Math.max(0, bas[f] - bas[f - 1]); fm[f] = Math.max(0, mil[f] - mil[f - 1]); fh[f] = Math.max(0, haut[f] - haut[f - 1]);
            env[f] = 1.2 * fb[f] + fm[f] + 0.8 * fh[f];
            somme += env[f];
        }
        var moy = somme / Math.max(1, nf);
        // un son trop calme (rms) ne fait pas de note
        var rmsMax = 0; for (f = 0; f < nf; f++) if (rms[f] > rmsMax) rmsMax = rms[f];
        for (f = 0; f < nf; f++) if (rms[f] < rmsMax * 0.04) env[f] *= 0.2;

        // ── le tempo : l'autocorrélation de l'enveloppe, de 70 à 190 au temps par minute
        var c = new Float32Array(nf);
        for (f = 0; f < nf; f++) c[f] = env[f] - moy;
        var lmin = Math.floor(fr * 60 / 190), lmax = Math.ceil(fr * 60 / 70), meilleur = -1e9, lag = lmin;
        for (var L = lmin; L <= lmax; L++) {
            var s = 0;
            for (f = 0; f + L < nf; f++) s += c[f] * c[f + L];
            var bpmL = 60 * fr / L, poids = Math.exp(-0.5 * Math.pow(Math.log2(bpmL / 120) / 0.6, 2));
            s = (s / (nf - L)) * poids;
            if (s > meilleur) { meilleur = s; lag = L; }
        }
        var bpm0 = 60 * fr / lag;
        // affiner : le tempo et la phase qui tombent le mieux sur les temps forts
        function valeur(t) { var k = t | 0; return k >= 0 && k + 1 < nf ? env[k] + (env[k + 1] - env[k]) * (t - k) : 0; }
        function note(bpm) {
            var per = 60 * fr / bpm, best = -1, phase = 0;
            for (var ph0 = 0; ph0 < per; ph0 += 0.5) {
                var s = 0;
                for (var t = ph0; t < nf; t += per) s += valeur(t);
                if (s > best) { best = s; phase = ph0; }
            }
            return { bpm: bpm, phase: phase, score: best * per / nf };
        }
        var res = note(bpm0);
        for (var bpm = bpm0 * 0.97; bpm <= bpm0 * 1.03; bpm += 0.05) { var r = note(bpm); if (r.score > res.score) res = r; }
        var rond = Math.round(res.bpm);
        if (Math.abs(rond - res.bpm) < 0.2) { var r2 = note(rond); if (r2.score >= res.score * 0.98) res = r2; }
        var periode = 60 / res.bpm, decalage = res.phase / fr;
        while (decalage - periode >= 0) decalage -= periode;

        var an = {
            bpm: Math.round(res.bpm * 100) / 100, decalage: Math.round(decalage * 1000), duree: buffer.duration,
            fr: fr, env: env, rms: rms, fb: fb, fm: fm, fh: fh, rmsMax: rmsMax, moy: moy,
            pre: (function () { var p = new Float64Array(nf + 1); for (var q = 0; q < nf; q++) p[q + 1] = p[q] + env[q]; return p; })()
        };
        this._analyses[nom] = an;
        return an;
    };

    // Un hasard qui donne toujours la même partition pour la même musique
    function hasard(graine) {
        var h = 2166136261;
        for (var i = 0; i < graine.length; i++) { h ^= graine.charCodeAt(i); h = Math.imul(h, 16777619); }
        return function () { h += 0x6D2B79F5; var t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    }

    // ── La partition automatique
    // une attaque, c'est l'énergie d'une bande qui monte d'un coup (en log) ; un bruit continu reste dessous
    var SEUIL_ABSOLU = 0.45, CONFIANCE_MIN = 1.25;
    var REGLE_AUTO = {
        facile: { div: 1, ecart: 0.40, seuil: 1.30, accords: false, pieges: false, soins: true },
        normal: { div: 2, ecart: 0.20, seuil: 1.15, accords: false, pieges: false, soins: true },
        difficile: { div: 4, ecart: 0.11, seuil: 1.00, accords: true, pieges: true, soins: false }
    };

    Rythme.partitionAuto = function (nom, an, diff) {
        var R = REGLE_AUTO[diff], fr = an.fr, env = an.env, nf = env.length;
        var tempsParBattue = 60 / an.bpm, pas = tempsParBattue / R.div, rnd = hasard(nom + '|' + diff);
        var special = Rythme.reglages.notesSpecialesAuto, duel = Rythme.reglages.duel;
        function trame(t) { return Math.round(t * fr); }
        function force(t) { var k = trame(t), m = 0; for (var q = k - 1; q <= k + 1; q++) if (q >= 0 && q < nf && env[q] > m) m = env[q]; return m; }
        function moyenneLocale(t) { var k0 = Math.max(0, trame(t - 2)), k1 = Math.min(nf, trame(t + 2)); return (an.pre[k1] - an.pre[k0]) / Math.max(1, k1 - k0); }
        function rmsMoyen(t0, t1) { var k0 = Math.max(0, trame(t0)), k1 = Math.min(nf, trame(t1)), s = 0; for (var q = k0; q < k1; q++) s += an.rms[q]; return s / Math.max(1, k1 - k0); }
        function hauteur(t) { var k = trame(t), lo = 0, mi = 0, hi = 0; for (var q = Math.max(1, k - 1); q <= Math.min(nf - 1, k + 1); q++) { lo += an.fb[q]; mi += an.fm[q]; hi += an.fh[q]; } return (hi + 0.5 * mi) / (lo + mi + hi + 1e-6); }

        var debut = an.decalage / 1000, fin = an.duree - 1.0, notes = [], derniere = -9, dernierCouloir = -1, repet = 0, decalCouloir = 0;
        // Le rythme est-il là ? Sur la grille (les croches) le son attaque ; un huitième de temps à côté, beaucoup
        // moins. Un bruit, une nappe sans rythme : autant d'un côté que de l'autre, et pas de note.
        var demi = tempsParBattue / 2, confiances = {};
        function confiance(t) {
            var cle = Math.floor(t / 2);
            if (confiances[cle] !== undefined) return confiances[cle];
            var k0 = Math.ceil((cle * 2 - 6 - debut) / demi), k1 = Math.floor((cle * 2 + 8 - debut) / demi), sur = 0, cote = 0;
            for (var k = k0; k <= k1; k++) { var g = debut + k * demi; if (g < 0 || g > an.duree) continue; sur += force(g); cote += force(g + tempsParBattue / 8); }
            return (confiances[cle] = sur / Math.max(1e-6, cote));
        }
        var mesure = -1;
        for (var g = 0; ; g++) {
            var t = debut + g * pas;
            if (t >= fin) break;
            if (t < 0.5) continue;
            var surTemps = (g % R.div) === 0, s = force(t) * (surTemps ? 1.15 : 1);
            var m = moyenneLocale(t);
            if (s < R.seuil * m || s < an.moy * 0.35 || s < SEUIL_ABSOLU) continue;
            if (confiance(t) < CONFIANCE_MIN) continue;
            if (t - derniere < R.ecart) continue;
            var nouvelleMesure = Math.floor((t - debut) / (tempsParBattue * 4));
            if (nouvelleMesure !== mesure) { mesure = nouvelleMesure; decalCouloir = Math.floor(rnd() * 4); }
            var c = (Math.min(3, Math.floor(hauteur(t) * 4.4)) + decalCouloir) % 4;
            if (c === dernierCouloir) { repet++; if (repet >= (diff === 'difficile' ? 2 : 1)) { c = (c + 1 + Math.floor(rnd() * 3)) % 4; repet = 0; } } else repet = 0;
            dernierCouloir = c; derniere = t;
            notes.push({ t: t, c: c, d: 0, type: 0, s: s / Math.max(1e-6, m) });
            if (R.accords && surTemps && s > 2.3 * m) notes.push({ t: t, c: (c + 2) % 4, d: 0, type: 0, s: 0 });
        }
        // les notes longues : un son qui tient, et de la place avant la suivante
        for (var i = 0; i < notes.length; i++) {
            var n = notes[i], suivante = notes[i + 1] ? notes[i + 1].t : fin;
            if (notes[i + 1] && notes[i + 1].t === n.t) continue;
            var place = suivante - n.t;
            if (place >= tempsParBattue) {
                var tenu = rmsMoyen(n.t + 0.05, n.t + place * 0.7), attaque = rmsMoyen(n.t, n.t + 0.1), dl = Math.min(place - tempsParBattue * 0.5, tempsParBattue * 2);
                if (tenu >= attaque * 0.5 && dl >= tempsParBattue * 0.5) n.d = dl;
            }
        }
        // le duel : quatre mesures chacun, l'adversaire commence
        var section = tempsParBattue * 16;
        notes.forEach(function (n) {
            var sec = Math.floor((n.t - debut) / section);
            n.joueur = !duel || (sec % 2 === 1);
        });
        // les notes spéciales
        if (special) {
            var parSection = {};
            notes.forEach(function (n) { if (!n.joueur) return; var k = Math.floor((n.t - debut) / section); if (!parSection[k] || n.s > parSection[k].s) parSection[k] = n; });
            Object.keys(parSection).forEach(function (k) { parSection[k].type = 3; });
            if (R.soins) {
                var dernierSoin = -1e9;
                notes.forEach(function (n) { if (n.joueur && n.type === 0 && n.t - dernierSoin >= tempsParBattue * 32) { n.type = 2; dernierSoin = n.t; } });
            }
            if (R.pieges) {
                var pieges = [];
                Object.keys(parSection).forEach(function (k) {
                    var t0 = debut + Number(k) * section;
                    // sur la grille, dans une flèche où rien n'est à taper à ce moment-là (à côté d'une vraie note, c'est permis)
                    var marge = Math.max(tempsParBattue * 0.3, 0.15);
                    for (var essai = 0; essai < 48; essai++) {
                        var tp = t0 + Math.floor(rnd() * 64) * tempsParBattue / 4, cp = Math.floor(rnd() * 4);
                        var libre = notes.every(function (n) { return !n.joueur || n.c !== cp || Math.abs(n.t + n.d - tp) > marge && Math.abs(n.t - tp) > marge && !(n.t < tp && tp < n.t + n.d); });
                        if (libre && tp < fin) { pieges.push({ t: tp, c: cp, d: 0, type: 1, joueur: true }); break; }
                    }
                });
                notes = notes.concat(pieges);
            }
        }
        return notes.map(function (n) { return [Math.round(n.t * 1000), n.c + (n.joueur ? 4 : 0), Math.round(n.d * 1000), n.type]; })
            .sort(function (x, y) { return x[0] - y[0] || x[1] - y[1]; });
    };

    // Les effets automatiques : un zoom et un éclair quand la musique « lâche tout »
    Rythme.effetsAuto = function (an) {
        var section = 60 / an.bpm * 16, debut = an.decalage / 1000, eff = [], avant = 0;
        for (var t = debut; t < an.duree - section; t += section) {
            var k0 = Math.floor(t * an.fr), k1 = Math.floor((t + section) * an.fr), s = 0;
            for (var q = k0; q < k1 && q < an.rms.length; q++) s += an.rms[q];
            s /= Math.max(1, k1 - k0);
            if (avant > 0 && s > avant * 1.35 && s > an.rmsMax * 0.25) {
                eff.push([Math.round(t * 1000), 'zoom', 1.1, 450]);
                eff.push([Math.round(t * 1000), 'flash', 1, 250]);
            }
            avant = s;
        }
        return eff;
    };

    // La partition complète d'une musique : celle de JOKO, et l'auto pour ce qui manque
    Rythme.partition = function (nom, an) {
        var a = this._auto = this._auto || {};
        if (!a[nom]) {
            a[nom] = { version: 1, musique: nom, auto: true, bpm: an.bpm, decalage: an.decalage, vitesse: 1, difficultes: {}, effets: this.effetsAuto(an) };
            this.DIFFICULTES.forEach(function (d) { a[nom].difficultes[d] = { notes: this.partitionAuto(nom, an, d) }; }, this);
        }
        var auto = a[nom], perso = this.lirePartition(nom);
        if (!perso) return auto;
        var p = JSON.parse(JSON.stringify(perso));
        p.difficultes = p.difficultes || {};
        p.bpm = p.bpm || auto.bpm;
        if (p.decalage === undefined) p.decalage = auto.decalage;
        p.vitesse = p.vitesse || 1;
        p.effets = p.effets || [];
        p._auto = {};
        this.DIFFICULTES.forEach(function (d) {
            if (!p.difficultes[d] || !p.difficultes[d].notes || !p.difficultes[d].notes.length) {
                p.difficultes[d] = { notes: auto.difficultes[d].notes.slice() };
                p._auto[d] = true;
            }
        });
        return p;
    };

    // Tout préparer pour une musique : rappel(err, { buffer, analyse, partition })
    Rythme.preparer = function (nom, rappel) {
        var self = this;
        this.chargerSon(nom, function (err, buffer) {
            if (err) { rappel(err); return; }
            self._garder(nom);
            var an = self.analyser(nom, buffer);
            rappel(null, { buffer: buffer, analyse: an, partition: self.partition(nom, an) });
        });
    };

    //=========================================================================
    // Les records
    //=========================================================================
    Rythme.records = function () {
        if (!$gameSystem) return {};
        $gameSystem._rythmeRecords = $gameSystem._rythmeRecords || {};
        return $gameSystem._rythmeRecords;
    };
    Rythme.record = function (nom, diff) { return this.records()[nom + '|' + diff] || null; };
    Rythme.meilleurRecord = function (nom) {
        var best = null;
        this.DIFFICULTES.forEach(function (d) { var r = this.record(nom, d); if (r && (!best || r.score > best.score)) best = Object.assign({ diff: d }, r); }, this);
        return best;
    };
    Rythme.rang = function (precision, mort, sansRate) {
        if (mort) return 'Perdu';
        if (precision >= 99.99 && sansRate) return 'S+';
        if (precision >= 95) return 'S';
        if (precision >= 90) return 'A';
        if (precision >= 80) return 'B';
        if (precision >= 70) return 'C';
        return 'D';
    };

    //=========================================================================
    // Le dessin : les flèches, en code (aucune image ajoutée)
    //=========================================================================
    var COULEURS = ['#c24b99', '#00ffff', '#12fa05', '#f9393f'];
    var ANGLES = [0, -Math.PI / 2, Math.PI / 2, Math.PI];   // gauche, bas, haut, droite (la flèche de base pointe à gauche)
    Rythme.COULEURS = COULEURS;

    function cheminFleche(ctx, t) {
        // une flèche qui pointe à gauche, dans un carré de côté t centré sur 0
        var h = t / 2;
        ctx.beginPath();
        ctx.moveTo(-h * 0.92, 0);
        ctx.lineTo(-h * 0.05, -h * 0.86);
        ctx.lineTo(-h * 0.05, -h * 0.36);
        ctx.lineTo(h * 0.86, -h * 0.36);
        ctx.lineTo(h * 0.86, h * 0.36);
        ctx.lineTo(-h * 0.05, h * 0.36);
        ctx.lineTo(-h * 0.05, h * 0.86);
        ctx.closePath();
    }

    var _cacheDessins = {};
    // genre : 'note', 'recepteur', 'presse', 'confirme' ; type : 0-3
    Rythme.dessinFleche = function (couloir, taille, genre, type) {
        var cle = [couloir, taille, genre, type || 0].join('|');
        if (_cacheDessins[cle]) return _cacheDessins[cle];
        var bm = new Bitmap(taille + 8, taille + 8), ctx = bm._context, c = COULEURS[couloir % 4];
        ctx.save();
        ctx.translate((taille + 8) / 2, (taille + 8) / 2);
        ctx.rotate(ANGLES[couloir % 4]);
        cheminFleche(ctx, taille);
        ctx.lineJoin = 'round';
        if (genre === 'recepteur') {
            ctx.fillStyle = 'rgba(135,163,173,0.55)'; ctx.fill();
            ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(30,30,40,0.9)'; ctx.stroke();
        } else if (genre === 'presse') {
            ctx.fillStyle = 'rgba(200,220,230,0.8)'; ctx.fill();
            ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(20,20,30,1)'; ctx.stroke();
        } else {
            var fond = c;
            if (type === 1) fond = '#2a2a33';
            else if (type === 2) fond = '#7dff9a';
            else if (type === 3) fond = '#ffd447';
            if (genre === 'confirme') { ctx.shadowColor = c; ctx.shadowBlur = 16; }
            ctx.fillStyle = fond; ctx.fill();
            ctx.shadowBlur = 0;
            ctx.lineWidth = 4; ctx.strokeStyle = type === 1 ? '#ff2b2b' : '#000'; ctx.stroke();
            // un reflet
            ctx.save(); ctx.clip();
            ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(-taille / 2, -taille / 2, taille, taille * 0.32);
            ctx.restore();
        }
        ctx.restore();
        // le signe du type, toujours droit
        ctx.save();
        ctx.translate((taille + 8) / 2, (taille + 8) / 2);
        if (type === 1) {           // piège : une croix
            ctx.strokeStyle = '#ff2b2b'; ctx.lineWidth = 5;
            ctx.beginPath(); ctx.moveTo(-9, -9); ctx.lineTo(9, 9); ctx.moveTo(9, -9); ctx.lineTo(-9, 9); ctx.stroke();
        } else if (type === 2) {    // soin : une croix verte
            ctx.fillStyle = '#ffffff'; ctx.fillRect(-3, -10, 6, 20); ctx.fillRect(-10, -3, 20, 6);
            ctx.strokeStyle = '#0a6b22'; ctx.lineWidth = 1.5; ctx.strokeRect(-3, -10, 6, 20); ctx.strokeRect(-10, -3, 20, 6);
        } else if (type === 3) {    // critique : une étoile
            ctx.fillStyle = '#fff'; ctx.strokeStyle = '#8a5a00'; ctx.lineWidth = 2;
            ctx.beginPath();
            for (var k = 0; k < 10; k++) { var r = k % 2 ? 4.5 : 11, an = -Math.PI / 2 + k * Math.PI / 5; ctx[k ? 'lineTo' : 'moveTo'](Math.cos(an) * r, Math.sin(an) * r); }
            ctx.closePath(); ctx.fill(); ctx.stroke();
        }
        ctx.restore();
        bm._setDirty();
        _cacheDessins[cle] = bm;
        return bm;
    };
    Rythme.dessinQueue = function (couloir, type) {
        var cle = 'queue|' + couloir + '|' + (type || 0);
        if (_cacheDessins[cle]) return _cacheDessins[cle];
        var bm = new Bitmap(20, 64), c = type === 1 ? '#555' : type === 2 ? '#7dff9a' : type === 3 ? '#ffd447' : COULEURS[couloir % 4];
        bm.fillRect(0, 0, 20, 64, '#000');
        bm.fillRect(3, 0, 14, 64, c);
        bm.paintOpacity = 255;
        _cacheDessins[cle] = bm;
        return bm;
    };

    function texte(bm, t, x, y, w, h, align, taille, couleur, contour) {
        bm.fontSize = taille || 24;
        bm.textColor = couleur || '#ffffff';
        bm.outlineColor = contour || 'rgba(0,0,0,0.85)';
        bm.outlineWidth = Math.max(4, Math.round((taille || 24) / 5));
        bm.drawText(t, x, y, w, h, align || 'left');
    }
    Rythme.texte = texte;

    //=========================================================================
    // Le clavier : on écoute les touches nous-mêmes (pour l'instant exact)
    //=========================================================================
    var TOUCHES = { arrowleft: 0, arrowdown: 1, arrowup: 2, arrowright: 3, d: 0, f: 1, j: 2, k: 3 };
    Rythme.couloirDeTouche = function (e) { var k = (e.key || '').toLowerCase(); return TOUCHES[k] !== undefined ? TOUCHES[k] : -1; };

    function Ecoute(cible) {
        this.cible = cible;
        this._bas = this.bas.bind(this); this._haut = this.haut.bind(this);
        document.addEventListener('keydown', this._bas, true);
        document.addEventListener('keyup', this._haut, true);
    }
    Ecoute.prototype.bas = function (e) {
        if (e.repeat && this.cible.toucheRepetee !== true) { if (/^Arrow|^Page|^ $/.test(e.key)) e.preventDefault(); return; }
        if (this.cible.toucheBas(e) !== false) { e.preventDefault(); e.stopPropagation(); }
    };
    Ecoute.prototype.haut = function (e) { if (this.cible.toucheHaut) this.cible.toucheHaut(e); };
    Ecoute.prototype.fin = function () {
        document.removeEventListener('keydown', this._bas, true);
        document.removeEventListener('keyup', this._haut, true);
        Input.clear();
    };
    // L'instant de l'appui, en secondes du lecteur
    Rythme.tempsDeTouche = function (lecteur, e) {
        var maintenant = lecteur.temps();
        if (e && typeof e.timeStamp === 'number' && e.timeStamp > 0 && e.timeStamp <= performance.now() + 5) {
            maintenant -= Math.max(0, (performance.now() - e.timeStamp) / 1000);
        }
        return maintenant - Rythme.reglages.decalage / 1000;
    };

    // La manette : la croix et les quatre boutons
    var MANETTE = [[14, 2], [13, 0], [12, 3], [15, 1]];
    function lireManette(etat) {
        var pads = navigator.getGamepads ? navigator.getGamepads() : [], res = [];
        for (var c = 0; c < 4; c++) {
            var p = false;
            for (var i = 0; i < pads.length; i++) {
                var g = pads[i]; if (!g || !g.buttons) continue;
                MANETTE[c].forEach(function (b) { if (g.buttons[b] && g.buttons[b].pressed) p = true; });
            }
            res.push(p && !etat[c] ? 'bas' : !p && etat[c] ? 'haut' : null);
            etat[c] = p;
        }
        return res;
    }

    //=========================================================================
    // Les personnages qui chantent (le battler de côté d'un acteur)
    //=========================================================================
    // poses de la planche SV : [colonne de bloc, rangée]
    var POSES = { attente: [0, 1], gauche: [1, 0], bas: [1, 1], haut: [1, 4], droite: [1, 3], rate: [0, 4], victoire: [2, 1], tombe: [2, 2] };
    var POSE_COULOIR = ['gauche', 'bas', 'haut', 'droite'];

    function Chanteur(qui, miroir) {
        Sprite.call(this);
        this.anchor.x = 0.5; this.anchor.y = 1;
        this._pose = 'attente'; this._image = 0; this._tempsPose = 0; this._miroir = miroir;
        this._nom = '';
        if (qui && qui.acteur) {
            var a = $gameActors.actor(qui.acteur);
            if (a) { this._nom = a.name(); if (a.battlerName()) this.bitmap = ImageManager.loadSvActor(a.battlerName()); }
            this._sv = true;
        } else if (qui && qui.ennemi && $dataEnemies[qui.ennemi]) {
            var en = $dataEnemies[qui.ennemi];
            this._nom = en.name;
            this.bitmap = $gameSystem.isSideView() ? ImageManager.loadSvEnemy(en.battlerName, en.battlerHue) : ImageManager.loadEnemy(en.battlerName, en.battlerHue);
            this._sv = false;
        }
        this.scale.x = this.scale.y = this._sv ? 2 : 1;
        if (miroir) this.scale.x = -this.scale.x;
        this._base = this.scale.y;
    }
    Chanteur.prototype = Object.create(Sprite.prototype);
    Chanteur.prototype.constructor = Chanteur;
    Chanteur.prototype.poser = function (pose, duree) { this._pose = pose; this._tempsPose = duree || 18; this._image = 0; this._compte = 0; };
    Chanteur.prototype.chanter = function (couloir, duree) { this.poser(POSE_COULOIR[couloir % 4], duree); };
    Chanteur.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if (!this.bitmap || !this.bitmap.isReady()) return;
        if (this._tempsPose > 0 && --this._tempsPose === 0 && this._pose !== 'tombe' && this._pose !== 'victoire') this._pose = 'attente';
        this._compte = (this._compte || 0) + 1;
        if (this._compte % 10 === 0) this._image = (this._image + 1) % 3;
        if (this._sv) {
            var cw = this.bitmap.width / 9, ch = this.bitmap.height / 6, p = POSES[this._pose] || POSES.attente;
            this.setFrame((p[0] * 3 + this._image) * cw, p[1] * ch, cw, ch);
        } else {
            // un ennemi : il respire, et il bondit quand il chante
            var bond = this._pose === 'attente' ? 0 : Math.max(0, this._tempsPose) / 18;
            this.scale.y = this._base * (1 + 0.03 * Math.sin(this._compte / 12) + 0.08 * bond);
        }
    };
    Rythme.Chanteur = Chanteur;

    // L'adversaire : « contre:2 », « contre:e12 », ou le deuxième de l'équipe
    Rythme.adversaire = function (texteContre) {
        var m = /^e(\d+)$/i.exec(texteContre || '');
        if (m) return { ennemi: Number(m[1]) };
        if (/^\d+$/.test(texteContre || '')) return { acteur: Number(texteContre) };
        var membres = $gameParty.members();
        if (membres[1]) return { acteur: membres[1].actorId() };
        return null;
    };

    //=========================================================================
    // Scene_Rythme — la partie
    //=========================================================================
    function Scene_Rythme() { this.initialize.apply(this, arguments); }
    Scene_Rythme.prototype = Object.create(Scene_Base.prototype);
    Scene_Rythme.prototype.constructor = Scene_Rythme;
    window.Scene_Rythme = Scene_Rythme;

    var TAILLE = 64, ECART = 74;

    Scene_Rythme.prototype.initialize = function () {
        Scene_Base.prototype.initialize.call(this);
        this._o = {};
    };
    // o : { musique, difficulte, contre, partition (de l'éditeur), depuis (ms), editeur (bool) }
    Scene_Rythme.prototype.prepare = function (o) { this._o = o || {}; };

    Scene_Rythme.prototype.create = function () {
        Scene_Base.prototype.create.call(this);
        Rythme.entrer();
        this._etat = 'charge';
        this._camera = new Sprite();
        this._camera.x = Graphics.boxWidth / 2; this._camera.y = Graphics.boxHeight / 2;
        this._camera.pivot.x = Graphics.boxWidth / 2; this._camera.pivot.y = Graphics.boxHeight / 2;
        this.addChild(this._camera);
        this.creerFond();
        this.creerChanteurs();
        this.creerRangees();
        this.creerInterface();
        this._eclair = new Sprite(new Bitmap(Graphics.boxWidth, Graphics.boxHeight));
        this._eclair.bitmap.fillAll('#ffffff'); this._eclair.opacity = 0;
        this.addChild(this._eclair);
        this._panneau = new Sprite(new Bitmap(Graphics.boxWidth, Graphics.boxHeight));
        this.addChild(this._panneau);
        this.afficherAttente('Écoute de la musique…');
        var self = this;
        // laisser l'écran s'afficher avant l'analyse (quelques dixièmes de seconde)
        setTimeout(function () {
            Rythme.preparer(self._o.musique, function (err, r) {
                if (self._fini) return;
                if (err) { self._erreur = err; self._etat = 'erreur'; self.afficherAttente('Impossible de jouer « ' + Rythme.titre(self._o.musique) + ' » :\n' + err + '\n\nÉchap ou Entrée pour revenir.'); return; }
                self._son = r;
                self._partitionComplete = self._o.partition || r.partition;
                if (self._o.difficulte) self.commencer(self._o.difficulte);
                else self.ouvrirMenu();
            });
        }, 60);
    };

    Scene_Rythme.prototype.start = function () {
        Scene_Base.prototype.start.call(this);
        this._ecoute = new Ecoute(this);
        this._manette = [false, false, false, false];
        this.startFadeIn(this.fadeSpeed(), false);
    };

    Scene_Rythme.prototype.terminate = function () {
        Scene_Base.prototype.terminate.call(this);
        this._fini = true;
        if (this._ecoute) this._ecoute.fin();
        if (this._lecteur) this._lecteur.arreter();
    };

    // ── le décor
    Scene_Rythme.prototype.creerFond = function () {
        var w = Graphics.boxWidth, h = Graphics.boxHeight, fond = new Sprite(new Bitmap(w, h));
        var ctx = fond.bitmap._context, g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#1b1030'); g.addColorStop(0.55, '#2c1450'); g.addColorStop(1, '#0d0718');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        // une scène : le plancher et les projecteurs
        ctx.fillStyle = '#120a1f'; ctx.fillRect(0, h * 0.78, w, h * 0.22);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        for (var i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(80 + i * 140, 0); ctx.lineTo(20 + i * 140, h * 0.78); ctx.lineTo(160 + i * 140, h * 0.78); ctx.closePath(); ctx.fill(); }
        fond.bitmap._setDirty();
        this._fond = fond;
        this._camera.addChild(fond);
        // la pochette, si elle existe, en grand et pâle
        var nom = this._o.musique;
        if (Rythme.aUnePochette(nom)) {
            var p = new Sprite(ImageManager.loadBitmap('img/musicbook/', nom, 0, true));
            p.anchor.x = p.anchor.y = 0.5; p.x = w / 2; p.y = h * 0.42; p.opacity = 70;
            this._camera.addChild(p);
        }
        this._pulse = new Sprite(new Bitmap(w, h));
        var c2 = this._pulse.bitmap._context, rg = c2.createRadialGradient(w / 2, h * 0.5, 40, w / 2, h * 0.5, w * 0.7);
        rg.addColorStop(0, 'rgba(255,120,220,0.35)'); rg.addColorStop(1, 'rgba(255,120,220,0)');
        c2.fillStyle = rg; c2.fillRect(0, 0, w, h); this._pulse.bitmap._setDirty();
        this._pulse.opacity = 0;
        this._camera.addChild(this._pulse);
    };

    Scene_Rythme.prototype.creerChanteurs = function () {
        var adv = Rythme.adversaire(this._o.contre), chef = $gameParty.leader();
        this._adv = new Chanteur(adv, true);
        this._adv.x = 190; this._adv.y = Graphics.boxHeight * 0.80;
        this._toi = new Chanteur(chef ? { acteur: chef.actorId() } : null, false);
        this._toi.x = Graphics.boxWidth - 190; this._toi.y = Graphics.boxHeight * 0.80;
        this._camera.addChild(this._adv);
        this._camera.addChild(this._toi);
    };

    Scene_Rythme.prototype.creerRangees = function () {
        var bas = Rythme.reglages.basEnHaut, y = bas ? Graphics.boxHeight - 110 : 90;
        this._yRecepteur = y;
        this._rangees = [];
        for (var cote = 0; cote < 2; cote++) {
            var r = new Sprite(), x0 = cote === 0 ? 40 : Graphics.boxWidth - 40 - 4 * ECART;
            r.x = 0; r.y = 0;
            r._recepteurs = [];
            r._queues = new Sprite(); r.addChild(r._queues);
            for (var c = 0; c < 4; c++) {
                var s = new Sprite(Rythme.dessinFleche(c, TAILLE, 'recepteur'));
                s.anchor.x = s.anchor.y = 0.5;
                s.x = x0 + ECART * c + ECART / 2; s.y = y;
                s._xBase = s.x; s._etat = 'repos'; s._compte = 0; s._couloir = c;
                r._recepteurs.push(s); r.addChild(s);
            }
            r._notes = new Sprite(); r.addChild(r._notes);
            r._x0 = x0;
            this._rangees.push(r);
            this._camera.addChild(r);
        }
        this._eclats = new Sprite(); this._camera.addChild(this._eclats);
    };
    Scene_Rythme.prototype.xCouloir = function (couloir) {
        var r = this._rangees[couloir >= 4 ? 1 : 0];
        return r._recepteurs[couloir % 4]._xBase;
    };

    Scene_Rythme.prototype.creerInterface = function () {
        var w = Graphics.boxWidth;
        this._barre = new Sprite(new Bitmap(w, 90));
        this._barre.y = Rythme.reglages.basEnHaut ? 6 : Graphics.boxHeight - 96;
        this.addChild(this._barre);
        this._juge = new Sprite(new Bitmap(320, 110));
        this._juge.anchor.x = this._juge.anchor.y = 0.5;
        this._juge.x = w / 2; this._juge.y = Graphics.boxHeight * 0.46; this._juge.opacity = 0;
        this._camera.addChild(this._juge);
        this._haut = new Sprite(new Bitmap(w, 30));
        this._haut.y = Rythme.reglages.basEnHaut ? Graphics.boxHeight - 30 : 2;
        this.addChild(this._haut);
        this._compteur = new Sprite(new Bitmap(400, 140));
        this._compteur.anchor.x = this._compteur.anchor.y = 0.5;
        this._compteur.x = w / 2; this._compteur.y = Graphics.boxHeight / 2;
        this.addChild(this._compteur);
    };

    Scene_Rythme.prototype.afficherAttente = function (t) {
        var b = this._panneau.bitmap; b.clear();
        b.fillRect(0, 0, b.width, b.height, 'rgba(0,0,0,0.55)');
        String(t).split('\n').forEach(function (l, i, tout) {
            texte(b, l, 0, b.height / 2 - tout.length * 18 + i * 36, b.width, 36, 'center', 26);
        });
    };

    // ── le menu d'avant la partie
    Scene_Rythme.prototype.ouvrirMenu = function () {
        this._etat = 'menu';
        this._choix = ['facile', 'normal', 'difficile'];
        if (Rythme.reglages.editeur && !this._o.editeur) this._choix.push('editer');
        this._choix.push('quitter');
        this._index = this._choix.indexOf($gameSystem._rythmeDiff || 'normal');
        if (this._index < 0) this._index = 1;
        this.dessinerMenu();
    };
    Scene_Rythme.prototype.libelle = function (c) {
        if (c === 'editer') return '✎ Éditer la partition';
        if (c === 'quitter') return 'Revenir';
        var r = Rythme.record(this._o.musique, c), p = this._partitionComplete;
        var nb = p.difficultes[c].notes.filter(function (n) { return n[1] >= 4 || !Rythme.reglages.duel; }).length;
        return Rythme.NOMS_DIFF[c] + '   · ' + nb + ' notes' + (r ? '   · record ' + r.rang + ' ' + r.score : '');
    };
    Scene_Rythme.prototype.dessinerMenu = function () {
        var b = this._panneau.bitmap, w = b.width, p = this._partitionComplete, perso = !!Rythme.lirePartition(this._o.musique);
        b.clear();
        b.fillRect(0, 0, w, b.height, 'rgba(0,0,0,0.6)');
        texte(b, '♪ ' + Rythme.titre(this._o.musique), 0, 100, w, 44, 'center', 34, '#ffd447');
        texte(b, p.bpm + ' temps / minute' + (perso ? '   · ★ partition de JOKO' : '   · partition auto'), 0, 146, w, 28, 'center', 18, '#cfc6ff');
        this._choix.forEach(function (c, i) {
            var y = 210 + i * 46, sel = i === this._index;
            if (sel) b.fillRect(w / 2 - 260, y - 2, 520, 42, 'rgba(255,255,255,0.15)');
            texte(b, (sel ? '▶ ' : '') + this.libelle(c), 0, y, w, 38, 'center', 24, sel ? '#ffffff' : '#bbbbbb');
        }, this);
        texte(b, '← ↓ ↑ →  ou  D F J K  ·  Échap : pause', 0, b.height - 70, w, 26, 'center', 18, '#aaaaaa');
    };
    Scene_Rythme.prototype.choisirMenu = function () {
        var c = this._choix[this._index];
        SoundManager.playOk();
        if (c === 'quitter') { this.quitter(); return; }
        if (c === 'editer') { this._fini = true; SceneManager.goto(Scene_RythmeEditeur); SceneManager.prepareNextScene({ musique: this._o.musique, retour: this._o }); return; }
        $gameSystem._rythmeDiff = c;
        this.commencer(c);
    };

    // ── la partie
    Scene_Rythme.prototype.commencer = function (diff) {
        var p = this._partitionComplete, depuis = this._o.depuis || 0;
        this._diff = diff;
        this._bpm = p.bpm; this._battue = 60000 / p.bpm; this._decal = p.decalage || 0;
        this._vitesseBase = (p.vitesse || 1) * Rythme.reglages.vitesse * (diff === 'facile' ? 0.85 : diff === 'difficile' ? 1.15 : 1);
        this._notes = (p.difficultes[diff] ? p.difficultes[diff].notes : []).filter(function (n) { return n[0] >= depuis - 50; })
            .map(function (n) { return { t: n[0], c: Rythme.reglages.duel ? n[1] : (n[1] % 4) + 4, d: n[2] || 0, type: n[3] || 0, etat: 0, sprite: null }; });
        this._effets = (p.effets || []).filter(function (e) { return e[0] >= depuis; }).slice().sort(function (a, b) { return a[0] - b[0]; });
        this._prochain = 0; this._premier = 0; this._prochainEffet = 0;
        this._vie = 50; this._score = 0; this._combo = 0; this._comboMax = 0;
        this._compte = { sick: 0, bien: 0, bof: 0, rate: 0 }; this._precisionSomme = 0; this._jugees = 0;
        this._tenues = [null, null, null, null];
        this._touches = [false, false, false, false];
        this._effet = { vitesse: 1, tremble: null, cache: null, cacheOpacite: 1, zoom: 0, secousse: null };
        this._lecteur = new Lecteur(this._son.buffer);
        this._duree = Math.min(this._son.buffer.duration * 1000, p.fin || 1e12);
        this._depuis = depuis;
        // le décompte : quatre temps avant la musique
        this._etat = 'compte';
        this._compteDebut = performance.now();
        this._panneau.bitmap.clear();
        this._dernierBattement = -1;
        this.dessinerBarre();
    };

    // Le temps de la partie, en ms (négatif pendant le décompte)
    Scene_Rythme.prototype.maintenant = function () {
        if (this._etat === 'compte') return this._depuis - (this._battue * 4 - (performance.now() - this._compteDebut));
        return this._lecteur.temps() * 1000 - Rythme.reglages.decalage;
    };

    Scene_Rythme.prototype.vitessePx = function () { return 0.45 * this._vitesseBase * this._effet.vitesse; };   // px par ms

    Scene_Rythme.prototype.update = function () {
        Scene_Base.prototype.update.call(this);
        if (this._etat === 'compte' || this._etat === 'joue') this.mettreAJourPartie();
        this.mettreAJourCamera();
        this.mettreAJourJuge();
        if (this._etat === 'joue') this.lireManette();
    };

    Scene_Rythme.prototype.mettreAJourPartie = function () {
        var t = this.maintenant();
        if (this._etat === 'compte') {
            var reste = Math.ceil((this._depuis - t) / this._battue);
            if (reste !== this._dernierCompte) {
                this._dernierCompte = reste;
                var mots = { 4: '3', 3: '2', 2: '1', 1: 'C\'est parti !' };
                if (mots[reste]) { this.montrerCompte(mots[reste]); SoundManager.playCursor(); }
            }
            if (t >= this._depuis) {
                this._etat = 'joue';
                this._lecteur.jouer(this._depuis / 1000);
                t = this.maintenant();
            }
        }
        this.battement(t);
        this.appliquerEffets(t);
        this.placerNotes(t);
        this.jouerAdversaire(t);
        this.verifierRates(t);
        this.verifierTenues(t);
        this.mettreAJourRecepteurs();
        if (this._etat === 'joue' && t >= this._duree + 300) this.finir(false);
    };

    Scene_Rythme.prototype.montrerCompte = function (mot) {
        var b = this._compteur.bitmap; b.clear();
        texte(b, mot, 0, 20, b.width, 100, 'center', mot.length > 2 ? 54 : 84, '#ffffff');
        this._compteur.opacity = 255; this._compteur.scale.x = this._compteur.scale.y = 1.4;
    };

    // Chaque temps : la scène respire ; chaque mesure, la caméra « bop »
    Scene_Rythme.prototype.battement = function (t) {
        var k = Math.floor((t - this._decal) / this._battue);
        if (k !== this._dernierBattement) {
            this._dernierBattement = k;
            this._pulse.opacity = 120;
            if (k % 4 === 0 && this._etat === 'joue') this._bop = 0.025;
        }
        this._pulse.opacity = Math.max(0, this._pulse.opacity - 6);
        if (this._compteur.opacity > 0) { this._compteur.opacity -= 6; this._compteur.scale.x = this._compteur.scale.y = Math.max(1, this._compteur.scale.x - 0.02); }
    };

    Scene_Rythme.prototype.appliquerEffets = function (t) {
        while (this._prochainEffet < this._effets.length && this._effets[this._prochainEffet][0] <= t) {
            // un effet compte depuis SON temps (une image en retard ne le rallonge pas)
            var e = this._effets[this._prochainEffet++], type = e[1], v = Number(e[2]), d = Number(e[3]) || 0, te = e[0];
            if (type === 'vitesse') this._effet.vitesse = v > 0 ? v : 1;
            else if (type === 'tremble') this._effet.tremble = { fin: te + (d || 1000), force: v || 6 };
            else if (type === 'cache') this._effet.cache = { de: this._effet.cacheOpacite, a: Math.max(0, Math.min(1, v)), t0: te, d: Math.max(1, d) };
            else if (type === 'zoom') { this._effet.zoom = Math.max(this._effet.zoom, (v || 1.1) - 1); this._effet.zoomDuree = Math.max(1, d || 400); }
            else if (type === 'secousse') this._effet.secousse = { fin: te + (d || 400), force: v || 8 };
            else if (type === 'flash') { this._eclair.opacity = 255 * Math.max(0.1, Math.min(1, v || 1)); this._eclairPas = 255 / Math.max(1, (d || 300) / 16.7); }
        }
        var ef = this._effet;
        if (ef.cache) {
            var k = Math.min(1, (t - ef.cache.t0) / ef.cache.d);
            ef.cacheOpacite = ef.cache.de + (ef.cache.a - ef.cache.de) * k;
            if (k >= 1) ef.cache = null;
        }
        this._rangees[1].opacity = 255 * ef.cacheOpacite;
        if (ef.tremble && t > ef.tremble.fin) ef.tremble = null;
        if (ef.secousse && t > ef.secousse.fin) ef.secousse = null;
        if (this._eclair.opacity > 0) this._eclair.opacity -= this._eclairPas || 15;
    };

    Scene_Rythme.prototype.mettreAJourCamera = function () {
        var ef = this._effet || {};
        this._bop = Math.max(0, (this._bop || 0) - 0.0025);
        if (ef.zoom > 0) ef.zoom = Math.max(0, ef.zoom - ef.zoom * 16.7 / Math.max(50, ef.zoomDuree || 400) - 0.001);
        var z = 1 + (this._bop || 0) + (ef.zoom || 0);
        this._camera.scale.x = this._camera.scale.y = z;
        var sx = 0, sy = 0;
        if (ef.secousse) { sx = (Math.random() * 2 - 1) * ef.secousse.force; sy = (Math.random() * 2 - 1) * ef.secousse.force; }
        this._camera.x = Graphics.boxWidth / 2 + sx; this._camera.y = Graphics.boxHeight / 2 + sy;
    };

    // ── les notes à l'écran
    Scene_Rythme.prototype.yDeNote = function (tNote, t) {
        var dy = (tNote - t) * this.vitessePx();
        return Rythme.reglages.basEnHaut ? this._yRecepteur - dy : this._yRecepteur + dy;
    };
    Scene_Rythme.prototype.placerNotes = function (t) {
        var horizon = t + (Graphics.boxHeight + 80) / this.vitessePx();
        while (this._prochain < this._notes.length && this._notes[this._prochain].t <= horizon) {
            var n = this._notes[this._prochain++];
            if (n.etat !== 0) continue;
            var r = this._rangees[n.c >= 4 ? 1 : 0], s = new Sprite(Rythme.dessinFleche(n.c % 4, TAILLE, 'note', n.type));
            s.anchor.x = s.anchor.y = 0.5;
            s.x = this.xCouloir(n.c);
            n.sprite = s;
            if (n.d > 0) {
                var q = new Sprite(Rythme.dessinQueue(n.c % 4, n.type));
                q.anchor.x = 0.5; q.anchor.y = Rythme.reglages.basEnHaut ? 1 : 0; q.opacity = 190;
                q.x = s.x; n.queue = q; r._queues.addChild(q);
            }
            r._notes.addChild(s);
        }
        var tremble = this._effet.tremble;
        for (var i = this._premier; i < this._notes.length && i < this._prochain; i++) {
            var n2 = this._notes[i];
            if (!n2.sprite && !n2.queue) continue;
            var debut = n2.etat === 2 ? Math.max(t, n2.t) : n2.t;   // une note longue tenue : sa tête reste sur la flèche
            if (n2.sprite) {
                n2.sprite.y = this.yDeNote(debut, t);
                n2.sprite.x = this.xCouloir(n2.c) + (tremble && n2.c >= 4 ? (Math.random() * 2 - 1) * tremble.force : 0);
                if (n2.etat === 3) { n2.sprite.opacity = Math.max(0, n2.sprite.opacity - 20); }
            }
            if (n2.queue) {
                var y0 = this.yDeNote(debut, t), y1 = this.yDeNote(n2.t + n2.d, t), haut = Math.max(0, Math.abs(y1 - y0));
                n2.queue.y = y0; n2.queue.scale.y = haut / 64; n2.queue.x = this.xCouloir(n2.c);
                if (n2.etat === 3) n2.queue.opacity = Math.max(0, n2.queue.opacity - 20);
            }
            // trop loin derrière : on retire
            var fin = n2.t + n2.d;
            if ((n2.etat === 1 || n2.etat === 4) || (n2.etat === 3 && t > fin + 400) || (n2.etat === 0 && t > fin + 600)) this.retirerNote(n2);
        }
        // les notes réglées et parties de l'écran ne sont plus regardées
        while (this._premier < this._prochain) {
            var p = this._notes[this._premier];
            if ((p.etat === 1 || p.etat === 3 || p.etat === 4) && !p.sprite && !p.queue) this._premier++; else break;
        }
    };
    Scene_Rythme.prototype.retirerNote = function (n) {
        if (n.sprite && n.sprite.parent) n.sprite.parent.removeChild(n.sprite);
        if (n.queue && n.queue.parent) n.queue.parent.removeChild(n.queue);
        n.sprite = null; n.queue = null;
    };

    // n.etat : 0 attend · 1 touchée · 2 tenue · 3 ratée · 4 piège évité/laissé
    Scene_Rythme.prototype.jouerAdversaire = function (t) {
        for (var i = this._premier; i < this._prochain; i++) {
            var n = this._notes[i];
            if (n.c >= 4) continue;
            if (n.etat === 0 && t >= n.t) {
                if (n.type === 1) { n.etat = 4; continue; }   // l'adversaire évite ses pièges
                n.etat = n.d > 0 ? 2 : 1;
                this.allumer(n.c, 'confirme', n.type);
                this._adv.chanter(n.c, n.d > 0 ? Math.max(18, n.d / 16.7) : 18);
                if (n.etat === 1) this.retirerNote(n);
            }
            if (n.etat === 2) {
                this.allumer(n.c, 'confirme', n.type);
                if (t >= n.t + n.d) { n.etat = 1; this.retirerNote(n); }
            }
        }
    };

    Scene_Rythme.prototype.verifierRates = function (t) {
        for (var i = this._premier; i < this._prochain; i++) {
            var n = this._notes[i];
            if (n.c < 4 || n.etat !== 0) continue;
            if (t > n.t + Rythme.BOF) {
                if (n.type === 1) { n.etat = 4; continue; }   // un piège laissé passer : bien joué
                n.etat = 3;
                n.rateAvant = { combo: this._combo, vie: this._vie };   // si l'appui arrive en retard, on la rend
                this.rate(n.c);
            }
        }
    };

    Scene_Rythme.prototype.verifierTenues = function (t) {
        for (var c = 0; c < 4; c++) {
            var n = this._tenues[c];
            if (!n) continue;
            if (t >= n.t + n.d) {            // tenue jusqu'au bout
                this._tenues[c] = null; n.etat = 1; this.retirerNote(n);
                this._score += 100; this.changerVie(1.5);
                continue;
            }
            if (!this._touches[c]) {         // lâchée trop tôt
                if (n.t + n.d - t > 120) { this._tenues[c] = null; n.etat = 3; this.rate(c + 4, 'Lâché'); }
                else { this._tenues[c] = null; n.etat = 1; this.retirerNote(n); this._score += 100; }
                continue;
            }
            this._score += 1;
            this.allumer(c + 4, 'confirme', n.type);
            if (Graphics.frameCount % 12 === 0) this._toi.chanter(c, 14);
        }
    };

    // ── le clavier
    Scene_Rythme.prototype.toucheBas = function (e) {
        var c = Rythme.couloirDeTouche(e), k = (e.key || '').toLowerCase();
        if (this._etat === 'menu' || this._etat === 'pause' || this._etat === 'fin' || this._etat === 'erreur') return this.toucheMenu(e, c, k);
        if (k === 'escape') { if (this._etat === 'joue' || this._etat === 'compte') this.pause(); return; }
        if (c < 0) return false;
        if (this._etat !== 'joue' || this._touches[c]) return;
        this._touches[c] = true;
        this.appuyer(c, Rythme.tempsDeTouche(this._lecteur, e) * 1000);
    };
    Scene_Rythme.prototype.toucheHaut = function (e) {
        var c = Rythme.couloirDeTouche(e);
        if (c >= 0) this._touches[c] = false;
    };
    Scene_Rythme.prototype.lireManette = function () {
        var ev = lireManette(this._manette);
        for (var c = 0; c < 4; c++) {
            if (ev[c] === 'bas' && !this._touches[c]) { this._touches[c] = true; this.appuyer(c, this.maintenant()); }
            else if (ev[c] === 'haut') this._touches[c] = false;
        }
    };

    Scene_Rythme.prototype.appuyer = function (c, te) {
        var couloir = c + 4, choix = null, piege = null;
        for (var i = this._premier; i < this._prochain; i++) {
            var n = this._notes[i];
            if (n.c !== couloir) continue;
            var dt = Math.abs(n.t - te);
            // un PC qui rame lit la touche en retard : la note a pu être déclarée ratée avant. L'appui était à temps : on la rend.
            if (n.etat === 3 && n.rateAvant && n.d === 0 && dt <= Rythme.BOF && (!choix || dt < Math.abs(choix.t - te))) { choix = n; continue; }
            if (n.etat !== 0) continue;
            if (n.type === 1) { if (dt <= Rythme.PIEGE && (!piege || dt < Math.abs(piege.t - te))) piege = n; continue; }
            if (dt <= Rythme.BOF && (!choix || dt < Math.abs(choix.t - te))) choix = n;
        }
        this.allumer(couloir, 'presse');
        if (choix) {
            if (choix.etat === 3) {   // le raté déclaré trop tôt est annulé
                this._compte.rate--; this._jugees--; this._score += 10;
                this._combo = choix.rateAvant.combo; this._vie = choix.rateAvant.vie;
                choix.rateAvant = null;
            }
            this.toucher(choix, Math.abs(choix.t - te));
            return;
        }
        if (piege) {
            piege.etat = 1; this.retirerNote(piege);
            this.changerVie(-12); this._combo = 0; this._score -= 50;
            this.juger('Aïe !', '#ff4040'); this._toi.poser('rate', 20);
            this.eclat(couloir, '#ff3030');
            SoundManager.playBuzzer();
            return;
        }
        if (!Rythme.reglages.fantome) this.rate(couloir);
    };

    Scene_Rythme.prototype.toucher = function (n, dt) {
        var jug, mot, couleur, pts, vie, prec;
        if (dt <= Rythme.SICK) { jug = 'sick'; mot = 'Sick !'; couleur = '#00e5ff'; pts = 350; vie = 2.3; prec = 1; }
        else if (dt <= Rythme.BIEN) { jug = 'bien'; mot = 'Bien'; couleur = '#7dff7d'; pts = 200; vie = 1.5; prec = 0.75; }
        else { jug = 'bof'; mot = 'Bof'; couleur = '#ffb347'; pts = 50; vie = 0.4; prec = 0.3; }
        if (n.type === 3) { pts *= 2; mot = '★ ' + mot; couleur = '#ffd447'; }
        if (n.type === 2) { vie += 15; mot = '♥ ' + mot; }
        this._compte[jug]++; this._precisionSomme += prec; this._jugees++;
        this._score += pts; this._combo++; this._comboMax = Math.max(this._comboMax, this._combo);
        this.changerVie(vie);
        this.juger(mot, couleur);
        this.allumer(n.c, 'confirme', n.type);
        this._toi.chanter(n.c % 4, n.d > 0 ? Math.max(18, n.d / 16.7) : 18);
        if (jug === 'sick' || n.type) this.eclat(n.c, n.type === 3 ? '#ffd447' : n.type === 2 ? '#7dff9a' : Rythme.COULEURS[n.c % 4]);
        if (n.d > 0) { n.etat = 2; this._tenues[n.c % 4] = n; }
        else { n.etat = 1; this.retirerNote(n); }
    };

    Scene_Rythme.prototype.rate = function (couloir, mot) {
        this._compte.rate++; this._jugees++;
        this._score -= 10; this._combo = 0;
        this.changerVie(-4.75);
        this.juger(mot || 'Raté', '#ff5050');
        this._toi.poser('rate', 18);
    };

    Scene_Rythme.prototype.changerVie = function (dv) {
        this._vie = Math.max(0, Math.min(100, this._vie + dv));
        this.dessinerBarre();
        if (this._vie <= 0 && this._etat === 'joue') this.finir(true);
    };

    // ── ce qui se voit
    Scene_Rythme.prototype.allumer = function (couloir, genre, type) {
        var r = this._rangees[couloir >= 4 ? 1 : 0], s = r._recepteurs[couloir % 4];
        s.bitmap = Rythme.dessinFleche(couloir % 4, TAILLE, genre, type);
        s._compte = genre === 'confirme' ? 8 : 6;
        s.scale.x = s.scale.y = genre === 'confirme' ? 1.12 : 0.92;
    };
    Scene_Rythme.prototype.mettreAJourRecepteurs = function () {
        var tremble = this._effet.tremble;
        this._rangees.forEach(function (r, cote) {
            r._recepteurs.forEach(function (s) {
                if (s._compte > 0 && --s._compte === 0) {
                    var tenu = cote === 1 && this._touches[s._couloir];
                    s.bitmap = Rythme.dessinFleche(s._couloir, TAILLE, tenu ? 'presse' : 'recepteur');
                    s.scale.x = s.scale.y = 1;
                    if (tenu) s._compte = 1;
                }
                s.x = s._xBase + (tremble && cote === 1 ? (Math.random() * 2 - 1) * tremble.force : 0);
            }, this);
        }, this);
        // les éclats
        this._eclats.children.slice().forEach(function (e) {
            e.opacity -= 18; e.scale.x = e.scale.y = e.scale.x + 0.06;
            if (e.opacity <= 0) this._eclats.removeChild(e);
        }, this);
    };
    Scene_Rythme.prototype.eclat = function (couloir, couleur) {
        var b = new Bitmap(96, 96), ctx = b._context;
        ctx.strokeStyle = couleur; ctx.lineWidth = 5; ctx.shadowColor = couleur; ctx.shadowBlur = 12;
        for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(48 + Math.cos(a) * 18, 48 + Math.sin(a) * 18); ctx.lineTo(48 + Math.cos(a) * 40, 48 + Math.sin(a) * 40); ctx.stroke(); }
        b._setDirty();
        var s = new Sprite(b); s.anchor.x = s.anchor.y = 0.5;
        s.x = this.xCouloir(couloir); s.y = this._yRecepteur; s.scale.x = s.scale.y = 0.7;
        this._eclats.addChild(s);
    };
    Scene_Rythme.prototype.juger = function (mot, couleur) {
        var b = this._juge.bitmap; b.clear();
        texte(b, mot, 0, 4, b.width, 56, 'center', 44, couleur);
        if (this._combo >= 2) texte(b, String(this._combo), 0, 58, b.width, 46, 'center', 38, '#ffffff');
        this._juge.opacity = 255; this._juge.scale.x = this._juge.scale.y = 1.25; this._jugeTemps = 30;
    };
    Scene_Rythme.prototype.mettreAJourJuge = function () {
        if (this._juge.scale.x > 1) this._juge.scale.x = this._juge.scale.y = Math.max(1, this._juge.scale.x - 0.03);
        if (this._jugeTemps > 0) this._jugeTemps--; else if (this._juge.opacity > 0) this._juge.opacity -= 12;
        if (this._etat === 'joue' && Graphics.frameCount % 6 === 0) this.dessinerHaut();
    };
    Scene_Rythme.prototype.precision = function () { return this._jugees ? this._precisionSomme / this._jugees * 100 : 100; };
    Scene_Rythme.prototype.dessinerBarre = function () {
        var b = this._barre.bitmap, w = b.width, bw = 520, x0 = (w - bw) / 2, y0 = 10;
        b.clear();
        b.fillRect(x0 - 4, y0 - 4, bw + 8, 28, '#000000');
        var part = bw * this._vie / 100;
        b.fillRect(x0, y0, bw - part, 20, '#e0263c');
        b.fillRect(x0 + bw - part, y0, part, 20, '#38e05a');
        var xm = x0 + bw - part;
        b.fillRect(xm - 3, y0 - 8, 6, 36, '#ffffff');
        texte(b, this._adv._nom || '???', x0, y0 + 24, 200, 26, 'left', 18, '#ff8a9a');
        texte(b, this._toi._nom || 'Toi', x0 + bw - 200, y0 + 24, 200, 26, 'right', 18, '#9dffaf');
        var info = 'Score ' + this._score + '   ·   Ratés ' + this._compte.rate + '   ·   Précision ' + this.precision().toFixed(2) + ' %';
        texte(b, info, 0, y0 + 46, w, 26, 'center', 18);
    };
    Scene_Rythme.prototype.dessinerHaut = function () {
        var b = this._haut.bitmap, w = b.width, t = this.maintenant();
        b.clear();
        var k = Math.max(0, Math.min(1, t / this._duree));
        b.fillRect(w / 2 - 160, 8, 320, 14, 'rgba(0,0,0,0.6)');
        b.fillRect(w / 2 - 160, 8, 320 * k, 14, '#ffd447');
        texte(b, Rythme.titre(this._o.musique) + ' · ' + Rythme.NOMS_DIFF[this._diff], w / 2 - 158, 2, 316, 26, 'center', 14);
    };

    // ── pause, fin
    Scene_Rythme.prototype.pause = function () {
        if (this._etat === 'joue') this._lecteur.pause();
        this._etatAvant = this._etat;
        this._pauseCompte = this._etat === 'compte' ? performance.now() - this._compteDebut : 0;
        this._etat = 'pause';
        this._choix = ['reprendre', 'recommencer', this._o.editeur ? 'editeur' : 'quitter'];
        this._index = 0;
        this.dessinerChoix('Pause');
    };
    Scene_Rythme.prototype.LIBELLES = { reprendre: 'Reprendre', recommencer: 'Recommencer', quitter: 'Quitter', editeur: 'Retour à l\'éditeur', rejouer: 'Rejouer', menu: 'Changer de difficulté' };
    Scene_Rythme.prototype.dessinerChoix = function (titre, lignes) {
        var b = this._panneau.bitmap, w = b.width;
        b.clear();
        b.fillRect(0, 0, w, b.height, 'rgba(0,0,0,0.6)');
        texte(b, titre, 0, 110, w, 50, 'center', 40, '#ffd447');
        (lignes || []).forEach(function (l, i) { texte(b, l[0], 0, 170 + i * 30, w, 30, 'center', l[2] || 22, l[1] || '#ffffff'); });
        var y0 = 190 + (lignes ? lignes.length * 30 + 20 : 40);
        this._choix.forEach(function (c, i) {
            var sel = i === this._index;
            if (sel) b.fillRect(w / 2 - 180, y0 + i * 44 - 2, 360, 40, 'rgba(255,255,255,0.15)');
            texte(b, (sel ? '▶ ' : '') + this.LIBELLES[c], 0, y0 + i * 44, w, 36, 'center', 24, sel ? '#ffffff' : '#bbbbbb');
        }, this);
        this._lignes = lignes; this._titre = titre;
    };
    Scene_Rythme.prototype.toucheMenu = function (e, c, k) {
        if (this._etat === 'erreur') { if (k === 'escape' || k === 'enter' || k === ' ') this.quitter(); return; }
        var n = this._choix.length;
        if (k === 'arrowup' || c === 2) { this._index = (this._index + n - 1) % n; SoundManager.playCursor(); }
        else if (k === 'arrowdown' || c === 1) { this._index = (this._index + 1) % n; SoundManager.playCursor(); }
        else if (k === 'enter' || k === ' ' || k === 'z') { this.valider(); return; }
        else if (k === 'escape' || k === 'x') {
            if (this._etat === 'pause') { this._index = 0; this.valider(); return; }
            if (this._etat === 'menu') { this.quitter(); return; }
            return;
        } else return false;
        if (this._etat === 'menu') this.dessinerMenu(); else this.dessinerChoix(this._titre, this._lignes);
    };
    Scene_Rythme.prototype.valider = function () {
        if (this._etat === 'menu') { this.choisirMenu(); return; }
        var c = this._choix[this._index];
        SoundManager.playOk();
        if (c === 'reprendre') {
            this._panneau.bitmap.clear();
            if (this._etatAvant === 'compte') { this._etat = 'compte'; this._compteDebut = performance.now() - this._pauseCompte; }
            else { this._etat = 'joue'; this._lecteur.jouer(this._lecteur.pos); }
            this._touches = [false, false, false, false];
        } else if (c === 'recommencer' || c === 'rejouer') { this.nettoyerNotes(); this._lecteur.arreter(); this.commencer(this._diff); }
        else if (c === 'menu') { this.nettoyerNotes(); this._lecteur.arreter(); this.ouvrirMenu(); }
        else if (c === 'editeur' || c === 'quitter') this.quitter();
    };
    Scene_Rythme.prototype.nettoyerNotes = function () {
        (this._notes || []).forEach(function (n) { this.retirerNote(n); }, this);
        this._tenues = [null, null, null, null];
    };
    Scene_Rythme.prototype.finir = function (mort) {
        if (this._etat === 'fin') return;
        this._etat = 'fin';
        this._lecteur.arreter();
        var prec = this.precision(), rang = Rythme.rang(prec, mort, this._compte.rate === 0), nom = this._o.musique;
        var res = { score: this._score, rang: rang, victoire: !mort, precision: Math.round(prec * 100) / 100, comboMax: this._comboMax, musique: nom, difficulte: this._diff };
        var nouveau = false;
        if (!this._o.editeur && !this._o.partition) {
            var r = Rythme.records(), cle = nom + '|' + this._diff;
            if (!mort && (!r[cle] || r[cle].score < res.score)) { r[cle] = { score: res.score, rang: rang, precision: res.precision }; nouveau = true; }
        }
        $gameSystem._rythmeDernier = res;
        if (Rythme.reglages.variableScore > 0) $gameVariables.setValue(Rythme.reglages.variableScore, res.score);
        if (Rythme.reglages.interrupteurVictoire > 0) $gameSwitches.setValue(Rythme.reglages.interrupteurVictoire, !mort);
        if (mort) { this._toi.poser('tombe', 99999); this._adv.poser('victoire', 99999); }
        else { this._toi.poser('victoire', 99999); }
        this._choix = ['rejouer'];
        if (!this._o.difficulte) this._choix.push('menu');
        this._choix.push(this._o.editeur ? 'editeur' : 'quitter');
        this._index = 0;
        var lignes = [
            [mort ? 'Perdu…' : 'Rang  ' + rang, mort ? '#ff5050' : '#ffffff', 34],
            ['Score ' + res.score + (nouveau ? '   ★ Nouveau record !' : ''), nouveau ? '#ffd447' : '#ffffff'],
            ['Précision ' + res.precision.toFixed(2) + ' %   ·   Combo max ' + this._comboMax],
            ['Sick ' + this._compte.sick + '   ·   Bien ' + this._compte.bien + '   ·   Bof ' + this._compte.bof + '   ·   Ratés ' + this._compte.rate, '#cfc6ff']
        ];
        this.dessinerChoix(mort ? 'Fin de la partie' : 'Bien chanté !', lignes);
        if (mort) SoundManager.playBuzzer(); else AudioManager.playMe($dataSystem.victoryMe);
    };
    Scene_Rythme.prototype.quitter = function () {
        if (this._fini) return;
        this._fini = true;
        if (this._lecteur) this._lecteur.arreter();
        if (this._o.editeur && this._o.retourEditeur) { SceneManager.goto(Scene_RythmeEditeur); SceneManager.prepareNextScene(this._o.retourEditeur); return; }
        Rythme.sortir();
        this.popScene();
    };

    //=========================================================================
    // Scene_RythmeEditeur — l'éditeur de partition
    //=========================================================================
    function Scene_RythmeEditeur() { this.initialize.apply(this, arguments); }
    Scene_RythmeEditeur.prototype = Object.create(Scene_Base.prototype);
    Scene_RythmeEditeur.prototype.constructor = Scene_RythmeEditeur;
    window.Scene_RythmeEditeur = Scene_RythmeEditeur;

    var GRILLES = [1, 2, 3, 4, 6, 8], ZOOMS = [0.12, 0.2, 0.3, 0.45, 0.7];
    var LARGEUR_COL = 52, X_COLS = 46, Y_CURSEUR = 200, LARGEUR_FRISE = 528;

    Scene_RythmeEditeur.prototype.initialize = function () { Scene_Base.prototype.initialize.call(this); this._o = {}; };
    // o : { musique, etat (pour revenir d'un essai), retour (le menu de la partie) }
    Scene_RythmeEditeur.prototype.prepare = function (o) { this._o = o || {}; };
    Scene_RythmeEditeur.prototype.create = function () {
        Scene_Base.prototype.create.call(this);
        Rythme.entrer();
        this._frise = new Sprite(new Bitmap(LARGEUR_FRISE, Graphics.boxHeight));
        this._infos = new Sprite(new Bitmap(Graphics.boxWidth - LARGEUR_FRISE, Graphics.boxHeight));
        this._infos.x = LARGEUR_FRISE;
        this.addChild(this._frise); this.addChild(this._infos);
        this._message = ''; this._messageTemps = 0;
        var b = this._frise.bitmap;
        b.fillAll('#14101f'); texte(b, 'Écoute de la musique…', 0, 280, LARGEUR_FRISE, 40, 'center', 24);
        var self = this;
        setTimeout(function () {
            Rythme.preparer(self._o.musique, function (err, r) {
                if (self._fini) return;
                if (err) { self._erreur = err; self.dessinerErreur(); return; }
                self.ouvrir(r);
            });
        }, 60);
    };
    Scene_RythmeEditeur.prototype.dessinerErreur = function () {
        var b = this._frise.bitmap; b.clear(); b.fillAll('#14101f');
        texte(b, 'Impossible d\'ouvrir cette musique :', 0, 250, LARGEUR_FRISE, 30, 'center', 20);
        texte(b, this._erreur, 0, 284, LARGEUR_FRISE, 30, 'center', 18, '#ff8080');
        texte(b, 'Échap pour revenir', 0, 330, LARGEUR_FRISE, 30, 'center', 18, '#aaaaaa');
    };
    Scene_RythmeEditeur.prototype.ouvrir = function (r) {
        this._son = r;
        this._lecteur = new Lecteur(r.buffer);
        var e = this._o.etat;
        if (e) {      // retour d'un essai : on reprend où on était
            this._p = e.p; this._diff = e.diff; this._curseur = e.curseur; this._grille = e.grille; this._zoom = e.zoom;
            this._type = e.type; this._effetChoisi = e.effetChoisi; this._modifie = e.modifie; this._annuler = e.annuler; this._refaire = e.refaire; this._clic = e.clic;
        } else {
            var perso = Rythme.lirePartition(this._o.musique), base = r.partition;
            this._p = perso ? JSON.parse(JSON.stringify(perso)) : { version: 1, musique: this._o.musique, bpm: base.bpm, decalage: base.decalage, vitesse: 1, difficultes: {}, effets: [] };
            this._p.difficultes = this._p.difficultes || {};
            this._p.bpm = this._p.bpm || base.bpm; if (this._p.decalage === undefined) this._p.decalage = base.decalage;
            this._p.effets = this._p.effets || [];
            delete this._p.auto; delete this._p._auto;
            Rythme.DIFFICULTES.forEach(function (d) { if (!this._p.difficultes[d]) this._p.difficultes[d] = { notes: [] }; }, this);
            this._diff = $gameSystem._rythmeDiff || 'normal';
            // une partition neuve part de l'auto : on la corrige plutôt que tout écrire
            if (!perso) {
                Rythme.DIFFICULTES.forEach(function (d) { this._p.difficultes[d].notes = base.difficultes[d].notes.map(function (n) { return n.slice(); }); }, this);
                this._p.effets = (base.effets || []).map(function (x) { return x.slice(); });
            }
            this._curseur = 0; this._grille = 2; this._zoom = 2; this._type = 0; this._effetChoisi = 0; this._modifie = !perso; this._annuler = []; this._refaire = []; this._clic = true;
            if (!perso) this.dire('Partition de départ : l\'auto. Corrige-la, puis Ctrl+S.');
        }
        this._tenus = {};
        this._pret = true;
        this._dernierClic = -1;
    };
    Scene_RythmeEditeur.prototype.start = function () {
        Scene_Base.prototype.start.call(this);
        this._ecoute = new Ecoute(this);
        this._ecoute.cible.toucheRepetee = true;
        this.startFadeIn(this.fadeSpeed(), false);
    };
    Scene_RythmeEditeur.prototype.terminate = function () {
        Scene_Base.prototype.terminate.call(this);
        this._fini = true;
        if (this._ecoute) this._ecoute.fin();
        if (this._lecteur) this._lecteur.arreter();
    };

    // ── l'état
    Scene_RythmeEditeur.prototype.notes = function () { return this._p.difficultes[this._diff].notes; };
    Scene_RythmeEditeur.prototype.pas = function () { return 60000 / this._p.bpm / GRILLES[this._grille]; };
    Scene_RythmeEditeur.prototype.caler = function (t) {
        var pas = this.pas(), d = this._p.decalage || 0;
        return Math.round(d + Math.round((t - d) / pas) * pas);
    };
    Scene_RythmeEditeur.prototype.temps = function () { return this._lecteur && this._lecteur.joue ? this._lecteur.temps() * 1000 : this._curseur; };
    Scene_RythmeEditeur.prototype.duree = function () { return this._son.buffer.duration * 1000; };
    Scene_RythmeEditeur.prototype.memoriser = function () {
        this._annuler.push(JSON.stringify({ n: this._p.difficultes, e: this._p.effets, b: this._p.bpm, d: this._p.decalage }));
        if (this._annuler.length > 60) this._annuler.shift();
        this._refaire = [];
        this._modifie = true;
    };
    Scene_RythmeEditeur.prototype.restaurer = function (depuis, vers) {
        if (!depuis.length) { this.dire('Rien à ' + (depuis === this._annuler ? 'annuler' : 'rétablir')); return; }
        vers.push(JSON.stringify({ n: this._p.difficultes, e: this._p.effets, b: this._p.bpm, d: this._p.decalage }));
        var s = JSON.parse(depuis.pop());
        this._p.difficultes = s.n; this._p.effets = s.e; this._p.bpm = s.b; this._p.decalage = s.d;
        this._modifie = true;
    };
    Scene_RythmeEditeur.prototype.dire = function (m) { this._message = m; this._messageTemps = 240; };
    Scene_RythmeEditeur.prototype.trierNotes = function () { this.notes().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; }); };
    Scene_RythmeEditeur.prototype.noteA = function (t, couloir) {
        var n = this.notes(), tol = Math.max(8, this.pas() / 3);
        for (var i = 0; i < n.length; i++) if (n[i][1] === couloir && Math.abs(n[i][0] - t) <= tol) return i;
        return -1;
    };
    Scene_RythmeEditeur.prototype.basculer = function (t, couloir, force) {
        this.memoriser();
        var i = this.noteA(t, couloir);
        if (i >= 0 && force !== 'poser') { this.notes().splice(i, 1); return null; }
        if (i >= 0) return this.notes()[i];
        var n = [Math.max(0, Math.round(t)), couloir, 0, this._type];
        this.notes().push(n); this.trierNotes();
        this._dernierCouloir = couloir;
        return n;
    };

    // ── le clavier
    Scene_RythmeEditeur.prototype.toucheBas = function (e) {
        if (!this._pret) { if (e.key === 'Escape') this.quitter(true); return; }
        var k = (e.key || '').toLowerCase(), maj = e.shiftKey, ctrl = e.ctrlKey || e.metaKey, c = Rythme.couloirDeTouche(e);
        var lecture = this._lecteur.joue;
        if (e.repeat && !/^arrow|^page/.test(k)) return;
        // les notes : D F J K (et les flèches gauche/droite sont aux notes aussi, haut/bas déplacent)
        if (c >= 0 && /^[dfjk]$/.test(k) && !ctrl) {
            var couloir = c + (maj ? 0 : 4);
            if (lecture) {
                var t = this.caler(Rythme.tempsDeTouche(this._lecteur, e) * 1000);
                var n = this.basculer(t, couloir, 'poser');
                this._tenus[k] = { n: n, t: t };
            } else this.basculer(this._curseur, couloir);
            return;
        }
        if (ctrl && k === 'z') { this.restaurer(this._annuler, this._refaire); return; }
        if (ctrl && k === 'y') { this.restaurer(this._refaire, this._annuler); return; }
        if (ctrl && k === 's') { this.enregistrer(); return; }
        if (ctrl && k === 'b') { this.memoriser(); this._p.bpm = Math.max(30, Math.round((this._p.bpm + (maj ? -1 : 1)) * 100) / 100); return; }
        switch (k) {
            case ' ': this.lecture(); return;
            case 'arrowup': case 'arrowdown': this.deplacer((k === 'arrowdown' ? 1 : -1) * this.pas()); return;
            case 'pageup': case 'pagedown': this.deplacer((k === 'pagedown' ? 1 : -1) * 4 * 60000 / this._p.bpm); return;
            case 'home': this.deplacer(-1e9); return;
            case 'end': this.deplacer(1e9); return;
            case 't': this._type = (this._type + 1) % 4; this.dire('Nouvelles notes : ' + Rythme.TYPES[this._type]); return;
            case 'g': this._grille = (this._grille + 1) % GRILLES.length; this._curseur = this.caler(this._curseur); this.dire('Grille : 1/' + GRILLES[this._grille] + ' de temps'); return;
            case 'z': this._zoom = (this._zoom + 1) % ZOOMS.length; return;
            case 'h': this._clic = !this._clic; this.dire('Clic des notes : ' + (this._clic ? 'oui' : 'non')); return;
            case 'tab': this._diff = Rythme.DIFFICULTES[(Rythme.DIFFICULTES.indexOf(this._diff) + 1) % 3]; this.dire('Difficulté : ' + Rythme.NOMS_DIFF[this._diff]); return;
            case 'b': this.memoriser(); this._p.bpm = Math.max(30, Math.round((this._p.bpm + (maj ? -0.1 : 0.1)) * 100) / 100); return;
            case 'o': this.memoriser(); this._p.decalage = (this._p.decalage || 0) + (maj ? -5 : 5); return;
            case 'l': this.allonger(maj ? -1 : 1); return;
            case 'e': this._effetChoisi = (this._effetChoisi + (maj ? Rythme.EFFETS.length - 1 : 1)) % Rythme.EFFETS.length; this.dire('Effet : ' + Rythme.EFFETS[this._effetChoisi]); return;
            case 'r': this.poserEffet(); return;
            case 'v': this.reglerEffet(0, maj ? -1 : 1); return;
            case 'n': this.reglerEffet(1, maj ? -1 : 1); return;
            case 'delete': case 'backspace': this.effacerLigne(); return;
            case 'a': this.remplirAuto(); return;
            case 'enter': this.essayer(); return;
            case 'escape': this.quitter(); return;
        }
        return false;
    };
    Scene_RythmeEditeur.prototype.toucheHaut = function (e) {
        var k = (e.key || '').toLowerCase(), tenu = this._tenus && this._tenus[k];
        if (!tenu) return;
        delete this._tenus[k];
        if (!this._lecteur.joue || !tenu.n) return;
        var fin = this.caler(Rythme.tempsDeTouche(this._lecteur, e) * 1000);
        if (fin - tenu.t >= this.pas() * 0.99) tenu.n[2] = Math.round(fin - tenu.t);
    };

    Scene_RythmeEditeur.prototype.lecture = function () {
        if (this._lecteur.joue) { this._lecteur.pause(); this._curseur = this.caler(this._lecteur.pos * 1000); }
        else { this._lecteur.jouer(Math.max(0, this._curseur) / 1000); this._dernierClic = this._curseur; }
    };
    Scene_RythmeEditeur.prototype.deplacer = function (dt) {
        if (this._lecteur.joue) { this._lecteur.jouer(Math.max(0, this.temps() + dt) / 1000); return; }
        this._curseur = this.caler(Math.max(0, Math.min(this.duree(), this._curseur + dt)));
    };
    Scene_RythmeEditeur.prototype.allonger = function (sens) {
        var c = this._dernierCouloir === undefined ? 4 : this._dernierCouloir, i = this.noteA(this._curseur, c);
        if (i < 0) { this.notes().forEach(function (n, j) { if (i < 0 && Math.abs(n[0] - this._curseur) <= this.pas() / 3) i = j; }, this); }
        if (i < 0) { this.dire('Pas de note sur la ligne du curseur'); return; }
        this.memoriser();
        var n = this.notes()[i];
        n[2] = Math.max(0, Math.round((n[2] || 0) + sens * this.pas()));
        this.dire(n[2] ? 'Note longue : ' + (n[2] / (60000 / this._p.bpm)).toFixed(2) + ' temps' : 'Note simple');
    };
    Scene_RythmeEditeur.prototype.effetA = function (t) {
        var tol = Math.max(8, this.pas() / 3);
        for (var i = 0; i < this._p.effets.length; i++) if (Math.abs(this._p.effets[i][0] - t) <= tol) return i;
        return -1;
    };
    Scene_RythmeEditeur.prototype.poserEffet = function () {
        this.memoriser();
        var type = Rythme.EFFETS[this._effetChoisi], d = Rythme.EFFET_DEFAUT[type];
        this._p.effets.push([Math.round(this._curseur), type, d[0], d[1]]);
        this._p.effets.sort(function (a, b) { return a[0] - b[0]; });
        this.dire('Effet posé : ' + type + ' ' + d[0] + (d[1] ? ' · ' + d[1] + ' ms' : '') + '  (V, N pour régler)');
    };
    Scene_RythmeEditeur.prototype.reglerEffet = function (quoi, sens) {
        var i = this.effetA(this._curseur);
        if (i < 0) { this.dire('Pas d\'effet sur la ligne du curseur (R pour en poser un)'); return; }
        this.memoriser();
        var e = this._p.effets[i];
        if (quoi === 0) {
            var pas = e[1] === 'vitesse' ? 0.1 : e[1] === 'cache' ? 1 : e[1] === 'zoom' ? 0.02 : e[1] === 'flash' ? 0.1 : 1;
            e[2] = Math.round((Number(e[2]) + sens * pas) * 100) / 100;
            if (e[1] === 'cache') e[2] = Math.max(0, Math.min(1, e[2]));
            if (e[1] === 'vitesse' || e[1] === 'zoom') e[2] = Math.max(0.1, e[2]);
        } else e[3] = Math.max(0, (Number(e[3]) || 0) + sens * 100);
        this.dire(e[1] + ' : valeur ' + e[2] + ' · durée ' + e[3] + ' ms');
    };
    Scene_RythmeEditeur.prototype.effacerLigne = function () {
        var t = this._curseur, tol = Math.max(8, this.pas() / 3), avant = this.notes().length + this._p.effets.length;
        this.memoriser();
        this._p.difficultes[this._diff].notes = this.notes().filter(function (n) { return Math.abs(n[0] - t) > tol; });
        this._p.effets = this._p.effets.filter(function (e) { return Math.abs(e[0] - t) > tol; });
        var n = avant - this.notes().length - this._p.effets.length;
        if (!n) { this._annuler.pop(); this.dire('Rien sur cette ligne'); } else this.dire(n + ' effacé(s)');
    };
    Scene_RythmeEditeur.prototype.remplirAuto = function () {
        if (!this._confirmeAuto || performance.now() - this._confirmeAuto > 2500) { this._confirmeAuto = performance.now(); this.dire('A encore une fois : remplacer ' + Rythme.NOMS_DIFF[this._diff] + ' par l\'auto'); return; }
        this._confirmeAuto = 0;
        this.memoriser();
        var an = this._son.analyse;
        this._p.difficultes[this._diff].notes = Rythme.partitionAuto(this._o.musique, an, this._diff);
        this.dire(Rythme.NOMS_DIFF[this._diff] + ' remplacé par la partition auto');
    };
    Scene_RythmeEditeur.prototype.enregistrer = function () {
        var p = JSON.parse(JSON.stringify(this._p));
        p.version = 1; p.musique = this._o.musique; p.auteur = 'JOKO'; p.modifie = new Date().toISOString().slice(0, 10);
        try {
            var f = Rythme.ecrirePartition(this._o.musique, p);
            this._modifie = false;
            this.dire(f ? 'Enregistré ✓  ' + f : 'Téléchargé ✓ (à mettre dans rythme/partitions/)');
        } catch (err) { this.dire('Échec de l\'enregistrement : ' + err.message); }
    };
    Scene_RythmeEditeur.prototype.etat = function () {
        return { p: this._p, diff: this._diff, curseur: this._curseur, grille: this._grille, zoom: this._zoom, type: this._type, effetChoisi: this._effetChoisi,
            modifie: this._modifie, annuler: this._annuler, refaire: this._refaire, clic: this._clic };
    };
    Scene_RythmeEditeur.prototype.essayer = function () {
        if (this._lecteur.joue) this.lecture();
        var p = JSON.parse(JSON.stringify(this._p)), retour = { musique: this._o.musique, etat: this.etat(), retour: this._o.retour };
        this._fini = true;
        SceneManager.goto(Scene_Rythme);
        SceneManager.prepareNextScene({ musique: this._o.musique, difficulte: this._diff, partition: p, depuis: Math.max(0, this._curseur - 2000), editeur: true, retourEditeur: retour });
    };
    Scene_RythmeEditeur.prototype.quitter = function (force) {
        if (this._modifie && !force && (!this._confirmeQuitter || performance.now() - this._confirmeQuitter > 2500)) {
            this._confirmeQuitter = performance.now();
            this.dire('Pas enregistré ! Échap encore pour quitter quand même, Ctrl+S pour enregistrer');
            return;
        }
        this._fini = true;
        if (this._lecteur) this._lecteur.arreter();
        // revenir au menu de la partie (s'il y en avait un), sinon d'où l'on vient
        if (this._o.retour) { SceneManager.goto(Scene_Rythme); var r = Object.assign({}, this._o.retour); r.editeur = false; delete r.partition; SceneManager.prepareNextScene(r); return; }
        Rythme.sortir();
        this.popScene();
    };

    // ── la souris
    Scene_RythmeEditeur.prototype.lireSouris = function () {
        if (!this._pret) return;
        var zoom = ZOOMS[this._zoom];
        if (TouchInput.wheelY && !this._lecteur.joue) this.deplacer((TouchInput.wheelY > 0 ? 1 : -1) * this.pas());
        var clic = TouchInput.isTriggered(), droit = TouchInput.isCancelled();
        if (!clic && !droit) return;
        var x = TouchInput.x, y = TouchInput.y;
        if (x < X_COLS || x >= X_COLS + 8 * LARGEUR_COL + 12) return;
        var col = Math.floor((x - X_COLS - (x >= X_COLS + 4 * LARGEUR_COL + 12 ? 12 : 0)) / LARGEUR_COL);
        if (col < 0 || col > 7) return;
        var t = this.caler(this.temps() + (y - Y_CURSEUR) / zoom);
        if (t < 0) return;
        if (droit) { var i = this.noteA(t, col); if (i >= 0) { this.memoriser(); this.notes().splice(i, 1); } return; }
        this.basculer(t, col);
    };

    Scene_RythmeEditeur.prototype.update = function () {
        Scene_Base.prototype.update.call(this);
        if (!this._pret) return;
        if (this._lecteur.joue && this._lecteur.temps() * 1000 >= this.duree()) { this._lecteur.arreter(); this._lecteur.pos = 0; this._curseur = this.caler(this.duree()); }
        this.lireSouris();
        this.clics();
        if (this._messageTemps > 0) this._messageTemps--;
        this.dessinerFrise();
        if (Graphics.frameCount % 3 === 0 || !this._lecteur.joue) this.dessinerInfos();
    };
    // le petit clic de chaque note pendant la lecture
    Scene_RythmeEditeur.prototype.clics = function () {
        if (!this._lecteur.joue || !this._clic) { this._dernierClic = this.temps(); return; }
        var t = this.temps(), avant = this._dernierClic, sonne = false;
        this.notes().forEach(function (n) { if (n[0] > avant && n[0] <= t) sonne = true; });
        if (sonne) SoundManager.playCursor();
        this._dernierClic = t;
    };

    // ── le dessin
    Scene_RythmeEditeur.prototype.dessinerFrise = function () {
        var b = this._frise.bitmap, h = b.height, zoom = ZOOMS[this._zoom], t = this.temps(), an = this._son.analyse;
        var battue = 60000 / this._p.bpm, d = this._p.decalage || 0, self = this;
        b.clear(); b.fillAll('#14101f');
        function xCol(c) { return X_COLS + c * LARGEUR_COL + (c >= 4 ? 12 : 0); }
        function y(tn) { return Y_CURSEUR + (tn - t) * zoom; }
        var t0 = t - Y_CURSEUR / zoom, t1 = t + (h - Y_CURSEUR) / zoom;
        // le fond des colonnes
        for (var c = 0; c < 8; c++) b.fillRect(xCol(c), 0, LARGEUR_COL - 2, h, c >= 4 ? 'rgba(80,200,120,0.07)' : 'rgba(220,80,110,0.07)');
        // la forme du son
        var xs = xCol(7) + LARGEUR_COL + 4, ws = LARGEUR_FRISE - xs - 2;
        if (ws > 6) {
            for (var py = 0; py < h; py += 2) {
                var tt = t0 + py / zoom, k = Math.floor(tt / 1000 * an.fr);
                if (k < 0 || k >= an.rms.length) continue;
                var v = Math.min(1, an.rms[k] / an.rmsMax) * ws;
                b.fillRect(xs, py, Math.max(1, v), 2, 'rgba(160,140,255,0.55)');
            }
        }
        // les lignes de la grille
        var pas = this.pas(), kpas0 = Math.ceil((t0 - d) / pas), kpas1 = Math.floor((t1 - d) / pas);
        for (var kp = kpas0; kp <= kpas1; kp++) {
            var tl = d + kp * pas, yl = y(tl), surTemps = Math.abs(((tl - d) / battue) - Math.round((tl - d) / battue)) < 0.001;
            var nb = Math.round((tl - d) / battue), mesure = surTemps && nb % 4 === 0;
            b.fillRect(X_COLS, Math.round(yl), xCol(7) + LARGEUR_COL - X_COLS, mesure ? 2 : 1, mesure ? 'rgba(255,255,255,0.45)' : surTemps ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)');
            if (mesure && tl >= 0) texte(b, String(nb / 4 + 1), 0, yl - 10, X_COLS - 4, 20, 'right', 13, '#999999');
        }
        // les effets, dans la marge
        this._p.effets.forEach(function (e) {
            if (e[0] < t0 - 2000 || e[0] > t1) return;
            var ye = y(e[0]);
            b.fillRect(2, ye - 1, X_COLS - 4, 3, '#ffd447');
            texte(b, e[1].slice(0, 5), 2, ye + 1, X_COLS, 16, 'left', 11, '#ffd447');
        });
        // les notes
        var petite = 40;
        this.notes().forEach(function (n) {
            var fin = n[0] + (n[2] || 0);
            if (fin < t0 - 100 || n[0] > t1 + 100) return;
            var x = xCol(n[1]) + (LARGEUR_COL - 2) / 2, yn = y(n[0]);
            if (n[2] > 0) {
                var yf = y(fin);
                b.fillRect(x - 6, yn, 12, yf - yn, Rythme.COULEURS[n[1] % 4]);
                b.fillRect(x - 6, yf - 3, 12, 3, '#ffffff');
            }
            var img = Rythme.dessinFleche(n[1] % 4, petite, 'note', n[3] || 0);
            b.blt(img, 0, 0, img.width, img.height, x - img.width / 2, yn - img.height / 2);
        });
        // le curseur
        b.fillRect(X_COLS - 6, Y_CURSEUR - 1, xCol(7) + LARGEUR_COL - X_COLS + 12, 3, this._lecteur.joue ? '#ff5577' : '#ffffff');
        texte(b, 'adversaire', xCol(0), 4, 4 * LARGEUR_COL, 20, 'center', 14, '#ff8a9a');
        texte(b, 'toi', xCol(4), 4, 4 * LARGEUR_COL, 20, 'center', 14, '#9dffaf');
    };
    Scene_RythmeEditeur.prototype.dessinerInfos = function () {
        var b = this._infos.bitmap, w = b.width, t = Math.max(0, this.temps()), y = 8, battue = 60000 / this._p.bpm;
        b.clear(); b.fillAll('#1d1730');
        function ligne(s, couleur, taille) { texte(b, s, 10, y, w - 20, (taille || 16) + 6, 'left', taille || 16, couleur || '#ffffff'); y += (taille || 16) + 6; }
        ligne('✎ ' + Rythme.titre(this._o.musique), '#ffd447', 18);
        ligne(Rythme.NOMS_DIFF[this._diff] + (this._modifie ? '   · non enregistré' : '   · enregistré'), this._modifie ? '#ffb347' : '#9dffaf');
        var min = Math.floor(t / 60000), sec = (t % 60000) / 1000, temps = Math.floor((t - (this._p.decalage || 0)) / battue);
        ligne(min + ':' + (sec < 10 ? '0' : '') + sec.toFixed(2) + '   mesure ' + (Math.floor(temps / 4) + 1) + ' · temps ' + (((temps % 4) + 4) % 4 + 1));
        ligne('Tempo ' + this._p.bpm + '   décalage ' + (this._p.decalage || 0) + ' ms');
        ligne('Grille 1/' + GRILLES[this._grille] + '   ·   zoom ' + (this._zoom + 1));
        ligne('Notes : ' + Rythme.TYPES[this._type] + '   ·   effet : ' + Rythme.EFFETS[this._effetChoisi], '#cfc6ff');
        var ns = this.notes();
        ligne(ns.filter(function (n) { return n[1] >= 4; }).length + ' à toi · ' + ns.filter(function (n) { return n[1] < 4; }).length + ' adversaire · ' + this._p.effets.length + ' effets', '#aaaaaa', 14);
        var ie = this.effetA(this._curseur);
        if (ie >= 0) { var e = this._p.effets[ie]; ligne('Au curseur : ' + e[1] + ' ' + e[2] + ' · ' + e[3] + ' ms', '#ffd447', 14); }
        y += 4;
        [['Espace', 'lecture / pause'], ['↑ ↓ molette', 'avancer d\'un pas'], ['Pg↑ Pg↓', 'une mesure'], ['D F J K', 'note à toi'], ['Maj+DFJK', 'note adversaire'],
            ['Clic', 'poser / enlever'], ['L / Maj+L', 'note plus / moins longue'], ['T', 'type de note'], ['G / Z', 'grille / zoom'], ['E / R', 'choisir / poser effet'],
            ['V N', 'valeur / durée (Maj : −)'], ['Suppr', 'effacer la ligne'], ['Tab', 'difficulté'], ['B / O', 'tempo / décalage'], ['A A', 'remplir en auto'],
            ['H', 'clic des notes'], ['Ctrl+Z Y', 'annuler / rétablir'], ['Ctrl+S', 'enregistrer'], ['Entrée', 'jouer d\'ici'], ['Échap', 'quitter']
        ].forEach(function (l) {
            texte(b, l[0], 10, y, 92, 18, 'left', 13, '#ffd447');
            texte(b, l[1], 104, y, w - 110, 18, 'left', 13, '#dddddd');
            y += 18;
        });
        if (this._messageTemps > 0) {
            b.fillRect(0, b.height - 54, w, 54, 'rgba(0,0,0,0.6)');
            var mots = this._message, l1 = mots, l2 = '';
            if (mots.length > 34) { var cut = mots.lastIndexOf(' ', 34); l1 = mots.slice(0, cut); l2 = mots.slice(cut + 1); }
            texte(b, l1, 8, b.height - 50, w - 16, 22, 'left', 14, '#ffffff');
            texte(b, l2, 8, b.height - 28, w - 16, 22, 'left', 14, '#ffffff');
        }
    };

    //=========================================================================
    // Les commandes
    //=========================================================================
    Rythme.jouer = function (musique, difficulte, contre) {
        if (!musique) return;
        SceneManager.push(Scene_Rythme);
        SceneManager.prepareNextScene({ musique: musique, difficulte: Rythme.DIFFICULTES.indexOf(difficulte) >= 0 ? difficulte : null, contre: contre });
    };
    Rythme.editer = function (musique) {
        if (!musique) return;
        SceneManager.push(Scene_RythmeEditeur);
        SceneManager.prepareNextScene({ musique: musique });
    };

    // « rythme Ma Musique difficile contre:2 » : le nom peut avoir des espaces
    function lireArgs(args) {
        var mots = args.slice(), diff = null, contre = null, reste = [];
        mots.forEach(function (m) {
            var l = m.toLowerCase(), c = /^contre:(.+)$/i.exec(m);
            if (c) contre = c[1];
            else if (Rythme.DIFFICULTES.indexOf(l) >= 0) diff = l;
            else reste.push(m);
        });
        var nom = reste.join(' ');
        // un nom écrit sans la bonne casse : on retrouve le fichier
        if (nom && !Rythme.musique(nom)) {
            var bas = nom.toLowerCase(), trouve = Rythme.musiques().filter(function (m) { return m.nom.toLowerCase() === bas; })[0];
            if (trouve) nom = trouve.nom;
        }
        return { nom: nom, diff: diff, contre: contre };
    }
    var _commande = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _commande.call(this, command, args);
        var c = (command || '').toLowerCase();
        if (c === 'rythme') { var a = lireArgs(args); Rythme.jouer(a.nom, a.diff, a.contre); this.wait(2); }
        else if (c === 'rythme_editeur') { var b = lireArgs(args); Rythme.editer(b.nom); this.wait(2); }
    };
})();
