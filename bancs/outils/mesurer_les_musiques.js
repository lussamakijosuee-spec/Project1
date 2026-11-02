/*
 * MESURER DES MUSIQUES — le tempo, le premier temps, et la carte des attaques
 * ---------------------------------------------------------------------------
 * Ouvre un navigateur (Playwright) sur une page vide, décode chaque musique de
 * audio/bgm comme le jeu, et en tire : le tempo, le premier temps, la durée, et
 * pour chaque double-croche la force de l'attaque (grave, médium, aigu) et le
 * volume. Sert à écrire des partitions à la main (ecrire_les_semaines.js).
 *
 *   node bancs/outils/mesurer_les_musiques.js Battle1 Crasher …   (→ la console)
 *   require('./mesurer_les_musiques').mesurer(['Battle1'])         (→ une promesse)
 */
'use strict';
var http = require('http'), fs = require('fs'), path = require('path');
var RACINE = path.join(__dirname, '..', '..');

function serveur() {
    return new Promise(function (r) {
        var s = http.createServer(function (req, res) {
            var p = decodeURIComponent(req.url.split('?')[0]);
            if (p === '/vide') { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<!doctype html><title>vide</title>'); return; }
            var f = path.join(RACINE, p);
            if (f.indexOf(RACINE) !== 0 || !fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
            res.writeHead(200, { 'Content-Type': 'audio/ogg' });
            fs.createReadStream(f).pipe(res);
        });
        s.listen(0, '127.0.0.1', function () { r(s); });
    });
}

// Dans la page : décoder, puis mesurer
function analyserDansLaPage(nom) {
    return fetch('/audio/bgm/' + encodeURIComponent(nom) + '.ogg').then(function (r) { return r.arrayBuffer(); }).then(function (ab) {
        var c = new OfflineAudioContext(1, 44100, 44100);
        return c.decodeAudioData(ab);
    }).then(function (b) {
        var sr = b.sampleRate, a = b.getChannelData(0), d = b.numberOfChannels > 1 ? b.getChannelData(1) : null;
        var SAUT = 512, nf = Math.floor(b.length / SAUT), fr = sr / SAUT;
        var kb = 1 - Math.exp(-2 * Math.PI * 150 / sr), kh = 1 - Math.exp(-2 * Math.PI * 2500 / sr), pb = 0, ph = 0, j = 0;
        var B = new Float32Array(nf), M = new Float32Array(nf), H = new Float32Array(nf), rms = new Float32Array(nf);
        for (var f = 0; f < nf; f++) {
            var eb = 0, em = 0, eh = 0, et = 0;
            for (var i = 0; i < SAUT; i++, j++) {
                var x = d ? (a[j] + d[j]) * 0.5 : a[j];
                pb += kb * (x - pb); ph += kh * (x - ph);
                var md = ph - pb, hi = x - ph;
                eb += pb * pb; em += md * md; eh += hi * hi; et += x * x;
            }
            B[f] = Math.log(1e-7 + eb); M[f] = Math.log(1e-7 + em); H[f] = Math.log(1e-7 + eh); rms[f] = Math.sqrt(et / SAUT);
        }
        var fb = new Float32Array(nf), fm = new Float32Array(nf), fh = new Float32Array(nf), env = new Float32Array(nf), moy = 0;
        for (f = 1; f < nf; f++) {
            fb[f] = Math.max(0, B[f] - B[f - 1]); fm[f] = Math.max(0, M[f] - M[f - 1]); fh[f] = Math.max(0, H[f] - H[f - 1]);
            env[f] = 1.2 * fb[f] + fm[f] + 0.8 * fh[f]; moy += env[f];
        }
        moy /= nf;
        var lmin = Math.floor(fr * 60 / 190), lmax = Math.ceil(fr * 60 / 70), best = -1e9, lag = lmin;
        for (var L = lmin; L <= lmax; L++) {
            var s = 0;
            for (f = 0; f + L < nf; f++) s += (env[f] - moy) * (env[f + L] - moy);
            s = s / (nf - L) * Math.exp(-0.5 * Math.pow(Math.log2(60 * fr / L / 120) / 0.6, 2));
            if (s > best) { best = s; lag = L; }
        }
        function val(t) { var k = t | 0; return k >= 0 && k + 1 < nf ? env[k] + (env[k + 1] - env[k]) * (t - k) : 0; }
        function noter(bpm) {
            var per = 60 * fr / bpm, bb = -1, phase = 0;
            for (var p0 = 0; p0 < per; p0 += 0.5) { var t = 0; for (var q = p0; q < nf; q += per) t += val(q); if (t > bb) { bb = t; phase = p0; } }
            return { bpm: bpm, phase: phase, score: bb * per / nf };
        }
        var bpm0 = 60 * fr / lag, res = noter(bpm0);
        for (var bp = bpm0 * 0.97; bp <= bpm0 * 1.03; bp += 0.05) { var rr = noter(bp); if (rr.score > res.score) res = rr; }
        var rond = Math.round(res.bpm);
        if (Math.abs(rond - res.bpm) < 0.2) { var r2 = noter(rond); if (r2.score >= res.score * 0.98) res = r2; }
        var battue = 60 / res.bpm, dec = res.phase / fr;
        while (dec - battue >= 0) dec -= battue;
        // pour chaque double-croche : la force (rapportée à la moyenne locale), la bande qui domine, le volume
        var grille = [], pas = battue / 4, rmsMax = 0;
        for (f = 0; f < nf; f++) if (rms[f] > rmsMax) rmsMax = rms[f];
        function fen(t, w) { var k0 = Math.max(0, Math.floor((t - w) * fr)), k1 = Math.min(nf, Math.floor((t + w) * fr)), s = 0; for (var q = k0; q < k1; q++) s += env[q]; return s / Math.max(1, k1 - k0); }
        for (var g = 0; ; g++) {
            var t = dec + g * pas;
            if (t >= b.duration - 0.5) break;
            var k = Math.round(t * fr), m = 0, lo = 0, mi = 0, hi2 = 0;
            for (var q = k - 1; q <= k + 1; q++) if (q >= 0 && q < nf) { if (env[q] > m) m = env[q]; lo += fb[q]; mi += fm[q]; hi2 += fh[q]; }
            var loc = fen(t, 2), vol = k < nf ? rms[k] / rmsMax : 0;
            grille.push([Math.round(t * 1000), Math.round(m / Math.max(1e-6, loc) * 100) / 100, Math.round(m * 100) / 100,
                lo > mi && lo > hi2 ? 0 : hi2 > mi ? 2 : 1, Math.round(vol * 100) / 100]);
        }
        return { nom: nom, bpm: Math.round(res.bpm * 100) / 100, decalage: Math.round(dec * 1000), duree: Math.round(b.duration * 1000), grille: grille };
    });
}

function mesurer(noms) {
    var { chromium } = require('playwright');
    var srv, nav;
    return serveur().then(function (s) { srv = s; return chromium.launch({ args: ['--no-sandbox', '--mute-audio'] }); })
        .then(function (n) { nav = n; return nav.newPage(); })
        .then(function (page) {
            return page.goto('http://127.0.0.1:' + srv.address().port + '/vide').then(function () {
                var res = [];
                return noms.reduce(function (p, nom) {
                    return p.then(function () { return page.evaluate(analyserDansLaPage, nom).then(function (r) { res.push(r); }, function (e) { res.push({ nom: nom, erreur: e.message }); }); });
                }, Promise.resolve()).then(function () { return res; });
            });
        })
        .then(function (res) { return nav.close().then(function () { srv.close(); return res; }); });
}
module.exports = { mesurer: mesurer };

if (require.main === module) {
    mesurer(process.argv.slice(2)).then(function (res) {
        res.forEach(function (r) {
            if (r.erreur) { console.log(r.nom + ' : ' + r.erreur); return; }
            var forts = r.grille.filter(function (g) { return g[1] >= 1.3 && g[2] >= 0.45; }).length;
            console.log(r.nom + ' : ' + r.bpm + ' temps/min, ' + Math.round(r.duree / 1000) + ' s, ' + Math.round(forts / (r.duree / 1000) * 10) / 10 + ' attaques fortes/s, volume moyen ' +
                Math.round(r.grille.reduce(function (s, g) { return s + g[4]; }, 0) / r.grille.length * 100) + ' %');
        });
    });
}
