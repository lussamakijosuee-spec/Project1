/*
 * LE RYTHME — le jeu de rythme façon FNF, la boîte à musique, le Theatrhythm
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-02 : « le rendre encore plus intéressant […] comme sur FNF »,
 * « personnaliser mes attaques » (types de notes, effets de chanson), et la
 * Music Box avec « presque toutes les musiques du jeu ».
 *
 *   ① la liste : toutes les musiques du dossier, les titres de MOG gardés ;
 *   ② une vieille sauvegarde (10 musiques) garde ce qu'elle avait entendu,
 *     et une musique jouée en jeu se débloque ;
 *   ③ l'analyse retrouve le tempo et le premier temps d'un son fabriqué
 *     (128 et 95 temps par minute), et ses notes tombent sur les coups ;
 *     contre-épreuve : un bruit sans rythme ne donne presque pas de notes ;
 *   ④ une vraie musique du jeu : trois difficultés, de plus en plus de notes ;
 *   ⑤ la partie : Sick, Bien, Bof, Raté, le piège, le soin, la critique, la
 *     note longue tenue et lâchée, l'adversaire qui chante, les effets, une
 *     vraie touche du clavier, la fin, le record, la défaite ;
 *   ⑥ l'éditeur : poser, enlever, allonger, le type, un effet, annuler,
 *     enregistrer, l'essai et le retour à l'éditeur ;
 *   ⑦ la boîte : un disque dessiné sans pochette, Tab, Maj lance la partie,
 *     et au retour la musique de la carte est toujours la bonne ;
 *   ⑧ le Theatrhythm de MOG s'ouvre (ses images sont dessinées), ses notes
 *     suivent la musique de combat, la bonne touche touche, la mauvaise rate.
 *
 *   node bancs/navigateur/le_rythme.js
 *   (le banc lance son propre petit serveur ; aucun fichier du jeu n'est écrit)
 */
'use strict';
var { chromium } = require('playwright');
var http = require('http'), fs = require('fs'), path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var erreursGlobales = [];

var TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.css': 'text/css', '.ttf': 'font/ttf', '.woff': 'font/woff', '.otf': 'font/otf', '.webm': 'video/webm', '.mp4': 'video/mp4' };
var serveur = http.createServer(function (req, res) {
    var p = decodeURIComponent(req.url.split('?')[0]);
    var f = path.join(RACINE, p);
    if (f.indexOf(RACINE) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
});

(async function () {
    await new Promise(function (r) { serveur.listen(0, '127.0.0.1', r); });
    var BASE = 'http://127.0.0.1:' + serveur.address().port;
    var nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var ok = 0, ko = 0, erreurs = erreursGlobales;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    page.on('console', function (m) { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) erreurs.push(m.text().slice(0, 200)); });
    var absents = [];
    page.on('response', function (r) { if (r.status() === 404) absents.push(decodeURIComponent(r.url().replace(/^https?:\/\/[^\/]+\//, ''))); });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title'; }, null, { timeout: 120000 });
    // tant que JOKO n'a pas inscrit les plugins (l'éditeur ouvert), le banc les charge lui-même
    var inscrits = await page.evaluate(function () { return !!window.Rythme; });
    if (!inscrits) {
        await page.addScriptTag({ path: path.join(RACINE, 'js/plugins/LeRythme.js') });
        await page.addScriptTag({ path: path.join(RACINE, 'js/plugins/LaBoiteAMusique.js') });
    }
    console.log('Plugins ' + (inscrits ? 'inscrits dans plugins.js' : 'chargés par le banc (pas encore dans plugins.js)'));
    await page.evaluate(function () {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
        // un son fabriqué : un coup (grave + bruit) à chaque temps, un petit coup au demi-temps
        window.fabriquer = function (bpm, decalage, duree, sansRythme) {
            var c = WebAudio._context, sr = 44100, n = Math.floor(sr * duree), b = c.createBuffer(2, n, sr);
            var g = b.getChannelData(0), d = b.getChannelData(1), per = 60 / bpm, coups = [];
            var graine = 12345; function alea() { graine = (graine + 0x6D2B79F5) | 0; var t = Math.imul(graine ^ graine >>> 15, 1 | graine); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
            for (var i = 0; i < n; i++) { var v = (alea() * 2 - 1) * (sansRythme ? 0.25 : 0.004); g[i] = v; d[i] = v; }
            if (!sansRythme) {
                for (var t = decalage; t < duree - 0.2; t += per / 2) {
                    var fort = Math.abs(((t - decalage) / per) - Math.round((t - decalage) / per)) < 0.01;
                    if (fort) coups.push(Math.round(t * 1000));
                    var i0 = Math.floor(t * sr);
                    for (var k = 0; k < sr * 0.12 && i0 + k < n; k++) {
                        var env = Math.exp(-k / (sr * (fort ? 0.03 : 0.01))), s = fort ? 0.9 * Math.sin(2 * Math.PI * 60 * k / sr) * env + (alea() * 2 - 1) * 0.4 * env : (alea() * 2 - 1) * 0.12 * env;
                        g[i0 + k] += s; d[i0 + k] += s;
                    }
                }
            }
            return { buffer: b, coups: coups };
        };
        window.attendre = function (f, ms) {
            return new Promise(function (r, rej) { var t0 = performance.now(); (function v() { var x; try { x = f(); } catch (e) { x = false; } if (x) r(x); else if (performance.now() - t0 > (ms || 20000)) rej(new Error('trop long')); else setTimeout(v, 10); })(); });
        };
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 60000 });

    // ① la liste
    console.log('\n① La liste des musiques');
    var r1 = await page.evaluate(function () {
        var t = {}; Moghunter.musicbook_titles.forEach(function (x) { t[x[0]] = x; });
        return { n: Rythme.musiques().length, titres: Moghunter.musicbook_titles.length, battle1: t.Battle1 && t.Battle1[1], autre: t['Battle-Conflict_loop'] && t['Battle-Conflict_loop'][1],
            theme3: !!t.Theme3, lisibles: Rythme.musiques().filter(function (m) { return Rythme.lisible(m.nom); }).length };
    });
    var surDisque = JSON.parse(fs.readFileSync(path.join(RACINE, 'rythme', 'musiques.json'), 'utf8')).musiques.length;
    V('toutes les musiques du dossier sont dans la boîte', r1.n === surDisque && r1.titres === surDisque, r1.titres + ' / ' + surDisque);
    V('les titres que MOG avait écrits restent', r1.battle1 === 'Hero And Legends', 'Battle1 → ' + r1.battle1);
    V('les autres ont un titre tiré du nom', r1.autre === 'Battle Conflict loop', r1.autre);
    V('une musique que le jeu n\'a pas (Theme3) n\'est plus listée', !r1.theme3);
    V('toutes se lisent ici', r1.lisibles === surDisque, r1.lisibles + ' lisibles');

    // ② une vieille sauvegarde
    console.log('\n② Une sauvegarde d\'avant, et le déblocage à l\'écoute');
    var r2 = await page.evaluate(function () {
        $gameSystem._music_list = [[true, 'Battle1', 'Hero And Legends', '', null, 0, 0], [false, 'Field1', 'Our Destiny', '', null, 0, 0]];
        $gameSystem.boiteAJour();
        var l = $gameSystem._music_list, get = function (n) { return l.filter(function (e) { return e[1] === n; })[0]; };
        var avant = get('Dungeon2')[0];
        AudioManager.playBgm({ name: 'Dungeon2', volume: 0, pitch: 100, pan: 0 });
        var apres = get('Dungeon2')[0];
        AudioManager.stopBgm();
        return { n: l.length, battle1: get('Battle1')[0], field1: get('Field1')[0], avant: avant, apres: apres };
    });
    V('la liste passe de 2 à toutes', r2.n === surDisque, String(r2.n));
    V('ce qui était entendu le reste', r2.battle1 === true);
    V('ce qui ne l\'était pas ne le devient pas', r2.field1 === false);
    V('une musique jouée en jeu se débloque', r2.avant === false && r2.apres === true);

    // ③ l'analyse d'un son fabriqué
    console.log('\n③ L\'analyse retrouve le tempo');
    var r3 = await page.evaluate(function () {
        function essai(bpm, dec) {
            var f = fabriquer(bpm, dec, 30), nom = '__test_' + bpm;
            delete Rythme._analyses[nom];
            var an = Rythme.analyser(nom, f.buffer), notes = Rythme.partitionAuto(nom, an, 'normal');
            var surCoup = notes.filter(function (n) { return f.coups.some(function (c) { return Math.abs(c - n[0]) <= 30; }); }).length;
            var demi = notes.filter(function (n) { return f.coups.some(function (c) { return Math.abs(c + 30000 / bpm - n[0]) <= 30; }); }).length;
            return { bpm: an.bpm, dec: an.decalage, notes: notes.length, justes: surCoup + demi, coups: f.coups.length };
        }
        var bruit = fabriquer(120, 0, 30, true);
        delete Rythme._analyses.__bruit;
        var anB = Rythme.analyser('__bruit', bruit.buffer);
        return { a: essai(128, 0.3), b: essai(95, 0.71), bruit: Rythme.partitionAuto('__bruit', anB, 'normal').length };
    });
    V('128 temps / minute retrouvé', Math.abs(r3.a.bpm - 128) <= 0.5, r3.a.bpm);
    V('son premier temps (300 ms) retrouvé', Math.abs(((r3.a.dec - 300) % (60000 / 128) + 60000 / 128) % (60000 / 128)) <= 25 || Math.abs(((r3.a.dec - 300) % (60000 / 128) + 60000 / 128) % (60000 / 128) - 60000 / 128) <= 25, r3.a.dec + ' ms');
    V('les notes tombent sur les coups', r3.a.notes > 20 && r3.a.justes / r3.a.notes >= 0.95, r3.a.justes + ' / ' + r3.a.notes);
    V('95 temps / minute retrouvé', Math.abs(r3.b.bpm - 95) <= 0.5, r3.b.bpm);
    V('… et ses notes sur les coups', r3.b.notes > 15 && r3.b.justes / r3.b.notes >= 0.95, r3.b.justes + ' / ' + r3.b.notes);
    V('contre-épreuve : un bruit sans rythme ne fait presque pas de notes', r3.bruit < r3.a.notes / 3, r3.bruit + ' notes contre ' + r3.a.notes);

    // ④ une vraie musique du jeu
    console.log('\n④ Une vraie musique : Battle1');
    var r4 = await page.evaluate(function () {
        return new Promise(function (res) {
            var t0 = performance.now();
            Rythme.chargerSon('Battle1', function () { var t1 = performance.now(); Rythme.preparer('Battle1', function (err, r) {
                if (err) { res({ err: err }); return; }
                var d = {}, p = r.partition;
                Rythme.DIFFICULTES.forEach(function (k) {
                    var n = p.difficultes[k].notes;
                    d[k] = { n: n.length, joueur: n.filter(function (x) { return x[1] >= 4; }).length, adv: n.filter(function (x) { return x[1] < 4; }).length,
                        trie: n.every(function (x, i) { return !i || n[i - 1][0] <= x[0]; }), dedans: n.every(function (x) { return x[0] >= 0 && x[0] + x[2] <= r.buffer.duration * 1000 && x[1] >= 0 && x[1] <= 7; }),
                        types: [0, 1, 2, 3].map(function (t) { return n.filter(function (x) { return x[3] === t; }).length; }), longues: n.filter(function (x) { return x[2] > 0; }).length };
                });
                var e = Array.prototype.slice.call(r.analyse.env).sort(function (a, b) { return a - b; });
                res({ bpm: p.bpm, d: d, charge: Math.round(t1 - t0), ms: Math.round(performance.now() - t1), duree: r.buffer.duration, p50: e[Math.floor(e.length * 0.5)].toFixed(2), p90: e[Math.floor(e.length * 0.9)].toFixed(2), p99: e[Math.floor(e.length * 0.99)].toFixed(2) });
            }); });
        });
    });
    if (r4.err) V('Battle1 se prépare', false, r4.err);
    else {
        V('Battle1 se prépare', true, r4.bpm + ' temps/min, ' + Math.round(r4.duree) + ' s ; chargé en ' + r4.charge + ' ms, analysé en ' + r4.ms + ' ms ; attaques p50 ' + r4.p50 + ' p90 ' + r4.p90 + ' p99 ' + r4.p99);
        V('facile < normal < difficile', r4.d.facile.n < r4.d.normal.n && r4.d.normal.n < r4.d.difficile.n, r4.d.facile.n + ' < ' + r4.d.normal.n + ' < ' + r4.d.difficile.n);
        V('le duel : des notes à toi et à l\'adversaire', r4.d.normal.joueur > 20 && r4.d.normal.adv > 20, r4.d.normal.joueur + ' / ' + r4.d.normal.adv);
        V('triées, dans la musique, sur 8 flèches', ['facile', 'normal', 'difficile'].every(function (k) { return r4.d[k].trie && r4.d[k].dedans; }));
        V('des notes longues', r4.d.normal.longues > 0, String(r4.d.normal.longues));
        V('des critiques partout, des soins en facile, des pièges en difficile', r4.d.normal.types[3] > 0 && r4.d.facile.types[2] > 0 && r4.d.difficile.types[1] > 0 && r4.d.facile.types[1] === 0,
            'critiques ' + r4.d.normal.types[3] + ' · soins ' + r4.d.facile.types[2] + ' · pièges ' + r4.d.difficile.types[1]);
    }

    var r4b = await page.evaluate(function () {
        return new Promise(function (res) { Rythme.preparer('Field1', function (err, r) { if (err) { res({ err: err }); return; } var p = r.partition; res({ bpm: p.bpm, f: p.difficultes.facile.notes.length, n: p.difficultes.normal.notes.length, d: p.difficultes.difficile.notes.length, duree: Math.round(r.buffer.duration) }); }); });
    });
    V('une musique calme (Field1) a aussi sa partition', !r4b.err && r4b.f > 15 && r4b.n > r4b.f, r4b.err || (r4b.bpm + ' temps/min, ' + r4b.duree + ' s : ' + r4b.f + ' / ' + r4b.n + ' / ' + r4b.d));

    // ⑤ la partie, sur un son fabriqué et une partition écrite
    console.log('\n⑤ La partie');
    await page.evaluate(function () {
        var f = fabriquer(120, 0.5, 40);
        Rythme._tampons.__partie = { buffer: f.buffer, attente: [] };
        var B = 500;   // un temps = 500 ms
        // [temps, flèche (0-3 adversaire, 4-7 toi), durée, type]
        var notes = [
            [2500, 0, 0, 0], [2500 + B, 1, 0, 0],                       // l'adversaire chante
            [4500, 4, 0, 0], [4500 + B, 5, 0, 0], [4500 + 2 * B, 6, 0, 0], // Sick, Bien, Bof
            [6500, 7, 0, 0],                                            // laissée passer : raté
            [7500, 4, 0, 1],                                            // piège touché
            [8500, 5, 0, 1],                                            // piège laissé
            [9500, 6, 0, 2],                                            // soin
            [10500, 7, 0, 3],                                           // critique
            [11500, 4, 1000, 0],                                        // longue tenue
            [13500, 5, 1000, 0],                                        // longue lâchée
            [15500, 6, 0, 0]                                            // pour la touche du clavier
        ];
        Rythme._partitions.__partie = { version: 1, bpm: 120, decalage: 500, vitesse: 1, difficultes: { normal: { notes: notes } }, effets: [[3000, 'vitesse', 2, 0], [3500, 'flash', 1, 300], [12000, 'cache', 0, 200], [14500, 'cache', 1, 200]], fin: 17000 };
        Rythme.musiques(); Rythme._parNom.__partie = { nom: '__partie', formats: ['ogg'] };
        window.__fini = null;
        Rythme.jouer('__partie', 'normal');
    });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Rythme && s._etat === 'joue'; }, null, { timeout: 180000 });
    // l'horloge de la partie est tenue par le banc : la machine peut être lente, le jeu reste juste
    await page.evaluate(function () {
        window.horloge = function (s) { window.__t = s.maintenant(); s._lecteur.temps = function () { return window.__t / 1000; }; };
        window.aller = function (t) { window.__t = t; var f0 = Graphics.frameCount; return attendre(function () { return Graphics.frameCount >= f0 + 3; }, 30000); };
        horloge(SceneManager._scene);
    });
    var r5 = await page.evaluate(async function () {
        var s = SceneManager._scene, out = {};
        function note(t, c) { return s._notes.filter(function (n) { return n.t === t && n.c === c; })[0]; }
        // l'adversaire
        await aller(3100);
        out.adv = [note(2500, 0).etat, note(3000, 1).etat];
        out.vitesse = s._effet.vitesse;
        // Sick, Bien, Bof : chacune quand elle est à l'écran
        await aller(4300);
        var v0 = s._vie, sc0 = s._score;
        s.appuyer(0, 4500 + 10); out.sick = [s._compte.sick, s._score - sc0];
        await aller(4800); s.appuyer(1, 5000 - 70); out.bien = s._compte.bien;
        await aller(5300); s.appuyer(2, 5500 + 150); out.bof = s._compte.bof;
        out.combo = s._combo; out.vieMonte = s._vie > v0;
        // contre-épreuve : une touche loin de toute note ne touche rien et ne coûte rien (fantôme)
        var avant = JSON.stringify(s._compte); s.appuyer(3, 5900); out.fantome = JSON.stringify(s._compte) === avant;
        // le raté
        await aller(6500 + 250);
        out.rate = s._compte.rate; out.comboApres = s._combo; out.rateEtat = note(6500, 7).etat;
        // les pièges
        await aller(7400);
        var v1 = s._vie; s.appuyer(0, 7500); out.piege = Math.round((v1 - s._vie) * 100) / 100;
        await aller(8500 + 250); out.piegeLaisse = s._compte.rate === out.rate && note(8500, 5).etat === 4;
        // soin et critique
        await aller(9400);
        var v2 = s._vie; s.appuyer(2, 9500); out.soin = Math.round((s._vie - v2) * 100) / 100;
        await aller(10400);
        var sc1 = s._score; s.appuyer(3, 10500); out.critique = s._score - sc1;
        // la longue tenue
        var l1 = note(11500, 4);
        await aller(11490);
        s._touches[0] = true; s.appuyer(0, 11500);
        await aller(12000); out.tenueEtat = l1.etat;
        await aller(12350); out.cacheOpacite = s._rangees[1].opacity;
        await aller(12600); out.tenueFinie = l1.etat; s._touches[0] = false;
        // la longue lâchée
        var l2 = note(13500, 5), r0 = s._compte.rate;
        await aller(13490);
        s._touches[1] = true; s.appuyer(1, 13500);
        await aller(13700);
        s._touches[1] = false;
        await aller(13800);
        out.lache = [l2.etat, s._compte.rate - r0];
        await aller(14800); out.cacheRevient = s._rangees[1].opacity;
        return out;
    });
    V('l\'adversaire chante ses notes tout seul', r5.adv[0] === 1 && r5.adv[1] === 1, JSON.stringify(r5.adv));
    V('l\'effet « vitesse » change la vitesse', r5.vitesse === 2, String(r5.vitesse));
    V('à 10 ms : Sick, 350 points', r5.sick[0] === 1 && r5.sick[1] === 350, JSON.stringify(r5.sick));
    V('à 70 ms : Bien ; à 150 ms : Bof', r5.bien === 1 && r5.bof === 1);
    V('le combo monte, la vie aussi', r5.combo === 3 && r5.vieMonte, 'combo ' + r5.combo);
    V('contre-épreuve : une touche sans note ne compte rien', r5.fantome);
    V('une note laissée passer est ratée, le combo retombe', r5.rate === 1 && r5.comboApres === 0 && r5.rateEtat === 3);
    V('un piège touché fait mal (−12)', r5.piege === 12, String(r5.piege));
    V('un piège laissé passer : rien de perdu', r5.piegeLaisse);
    V('une note de soin rend de la vie', r5.soin >= 15, '+' + r5.soin);
    V('une note critique vaut double', r5.critique === 700, String(r5.critique));
    V('une note longue tenue jusqu\'au bout est réussie', r5.tenueEtat === 2 && r5.tenueFinie === 1, r5.tenueEtat + ' → ' + r5.tenueFinie);
    V('l\'effet « cache » efface tes flèches, puis les rend', r5.cacheOpacite < 30 && r5.cacheRevient > 225, r5.cacheOpacite + ' → ' + r5.cacheRevient);
    V('une note longue lâchée trop tôt est ratée', r5.lache[0] === 3 && r5.lache[1] === 1, JSON.stringify(r5.lache));

    // une vraie touche du clavier : l'instant pris est celui de l'appui (son horodatage), pas celui où le jeu le lit
    var r5b = await page.evaluate(async function () {
        var s = SceneManager._scene;
        await aller(15500 - 40);
        window.__tp = performance.now();
        s._lecteur.temps = function () { return (window.__t + performance.now() - window.__tp) / 1000; };   // l'horloge repart
        var app = s.appuyer, bas = s.toucheBas;
        s.appuyer = function (c, te) { window.__app = { c: c, te: te, maintenant: s.maintenant() }; return app.call(this, c, te); };
        s.toucheBas = function (e) { window.__ts = e.timeStamp; return bas.call(this, e); };
        return true;
    });
    await page.keyboard.press('j');
    var r5c = await page.evaluate(async function () {
        var s = SceneManager._scene, n = s._notes.filter(function (x) { return x.t === 15500; })[0];
        await attendre(function () { return window.__app; }, 10000);
        var attendu = window.__t + (window.__ts - window.__tp), etatNote = n.etat;
        s._lecteur.temps = function () { return window.__t / 1000; };
        await aller(17400);
        await attendre(function () { return s._etat === 'fin'; }, 30000);
        var res = $gameSystem._rythmeDernier, rec = Rythme.record('__partie', 'normal');
        return { c: __app.c, te: __app.te, attendu: attendu, retard: __app.maintenant - __app.te, etat: etatNote, fin: s._etat, res: res, rec: rec };
    });
    V('la touche J du clavier : la bonne flèche, au temps de l\'appui', r5c.c === 2 && Math.abs(r5c.te - r5c.attendu) <= 25, 'écart ' + Math.round(r5c.te - r5c.attendu) + ' ms ; le jeu l\'a lue ' + Math.round(r5c.retard) + ' ms plus tard');
    V('… et la note est jugée sur cet instant', Math.abs(r5c.te - 15500) <= 166 ? r5c.etat === 1 : r5c.etat === 0, 'à ' + Math.round(r5c.te - 15500) + ' ms de la note → ' + (r5c.etat === 1 ? 'touchée' : 'pas touchée'));
    V('la musique finie, la partie se termine', r5c.fin === 'fin' && r5c.res && r5c.res.victoire === true, r5c.res && ('rang ' + r5c.res.rang + ', score ' + r5c.res.score));
    V('le record est gardé', r5c.rec && r5c.rec.score === r5c.res.score);
    // la défaite
    var r5d = await page.evaluate(async function () {
        var s = SceneManager._scene;
        s._index = 0; s.valider();   // rejouer
        await attendre(function () { return s._etat === 'joue'; }, 60000);
        horloge(s);
        s._vie = 3;
        await aller(4700);
        await attendre(function () { return s._etat === 'fin'; }, 30000);
        return $gameSystem._rythmeDernier;
    });
    V('la vie à zéro : perdu', r5d && r5d.victoire === false && r5d.rang === 'Perdu');
    await page.evaluate(function () { SceneManager._scene.quitter(); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 20000 });
    var r5e = await page.evaluate(function () { return { mise: !!Rythme._mise, escape: !!(SceneManager._scene && Input.isPressed('escape')) }; });
    V('au retour sur la carte, la musique de la carte est rendue', !r5e.mise);

    // ⑥ l'éditeur
    console.log('\n⑥ L\'éditeur');
    await page.evaluate(function () {
        window.__ecrit = null;
        Rythme._ecrireVrai = Rythme.ecrirePartition;
        Rythme.ecrirePartition = function (nom, p) { window.__ecrit = { nom: nom, p: JSON.parse(JSON.stringify(p)) }; this._partitions[nom] = p; return 'rythme/partitions/' + nom + '.json'; };
        Rythme.editer('__partie');
    });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_RythmeEditeur && s._pret; }, null, { timeout: 180000 });
    async function touche(k, mods) {
        await page.evaluate(function (a) {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: a.k, shiftKey: !!a.m.shift, ctrlKey: !!a.m.ctrl, bubbles: true }));
            document.dispatchEvent(new KeyboardEvent('keyup', { key: a.k, shiftKey: !!a.m.shift, ctrlKey: !!a.m.ctrl, bubbles: true }));
        }, { k: k, m: mods || {} });
    }
    var r6a = await page.evaluate(function () { var s = SceneManager._scene; s._curseur = s.caler(1000); return { n: s.notes().length, c: s._curseur }; });
    await touche('k');
    var r6b = await page.evaluate(function () { var s = SceneManager._scene; return { n: s.notes().length, note: s.notes().filter(function (n) { return n[0] === s._curseur; })[0] }; });
    V('K pose une note à toi au curseur (flèche droite)', r6b.n === r6a.n + 1 && r6b.note && r6b.note[1] === 7, JSON.stringify(r6b.note));
    await touche('k');
    var r6c = await page.evaluate(function () { return SceneManager._scene.notes().length; });
    V('K encore une fois l\'enlève', r6c === r6a.n);
    await touche('D', { shift: true });
    await touche('t');
    await touche('ArrowDown');
    await touche('f');
    await touche('l');
    await touche('l');
    var r6d = await page.evaluate(function () {
        var s = SceneManager._scene, pas = s.pas(), n = s.notes();
        return { adv: n.filter(function (x) { return x[0] === 1000 && x[1] === 0; })[0], longue: n.filter(function (x) { return Math.abs(x[0] - (1000 + pas)) < 2 && x[1] === 5; })[0], pas: pas, type: s._type };
    });
    V('Maj+D pose une note à l\'adversaire', r6d.adv && r6d.adv[3] === 0, JSON.stringify(r6d.adv));
    V('T change le type : la note suivante est un piège', r6d.longue && r6d.longue[3] === 1, JSON.stringify(r6d.longue));
    V('L deux fois : elle dure deux pas de grille', r6d.longue && Math.abs(r6d.longue[2] - 2 * r6d.pas) <= 1, r6d.longue && r6d.longue[2] + ' ms');
    await touche('e'); await touche('e');   // vitesse → tremble → cache
    await touche('r');
    await touche('v');
    var r6e = await page.evaluate(function () { var s = SceneManager._scene; return s._p.effets.filter(function (e) { return Math.abs(e[0] - s._curseur) < 2; })[0]; });
    V('E choisit l\'effet, R le pose, V règle sa valeur', r6e && r6e[1] === 'cache' && r6e[2] === 1, JSON.stringify(r6e));
    var nAvant = await page.evaluate(function () { return SceneManager._scene.notes().length; });
    await touche('Delete');
    var nSuppr = await page.evaluate(function () { return SceneManager._scene.notes().length; });
    await touche('z', { ctrl: true });
    var nAnnule = await page.evaluate(function () { return SceneManager._scene.notes().length; });
    V('Suppr efface la ligne, Ctrl+Z la rend', nSuppr === nAvant - 1 && nAnnule === nAvant, nAvant + ' → ' + nSuppr + ' → ' + nAnnule);
    await touche('s', { ctrl: true });
    var r6f = await page.evaluate(function () { var s = SceneManager._scene; return { ecrit: window.__ecrit, modifie: s._modifie }; });
    V('Ctrl+S enregistre la partition', r6f.ecrit && r6f.ecrit.nom === '__partie' && r6f.ecrit.p.difficultes.normal.notes.length === nAnnule && !r6f.modifie);
    // l'essai, et le retour à l'éditeur
    await touche('Enter');
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Rythme && s._etat === 'joue'; }, null, { timeout: 180000 });
    var r6g = await page.evaluate(function () { var s = SceneManager._scene; return { depuis: s._depuis, notes: s._notes.length }; });
    V('Entrée joue depuis le curseur (deux secondes avant)', r6g.depuis === 0 || r6g.depuis > 0, 'depuis ' + r6g.depuis + ' ms');
    await page.keyboard.press('Escape');
    var r6h = await page.evaluate(function () { var s = SceneManager._scene; return { etat: s._etat, choix: s._choix.slice() }; });
    V('Échap : la pause propose le retour à l\'éditeur', r6h.etat === 'pause' && r6h.choix.indexOf('editeur') >= 0, r6h.choix.join(', '));
    await page.evaluate(function () { var s = SceneManager._scene; s._index = s._choix.indexOf('editeur'); s.valider(); });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_RythmeEditeur && s._pret; }, null, { timeout: 180000 });
    var r6i = await page.evaluate(function () { var s = SceneManager._scene; return { n: s.notes().length, curseur: s._curseur, modifie: s._modifie }; });
    V('… et l\'éditeur reprend où il était', r6i.n === nAnnule && Math.abs(r6i.curseur - (1000 + r6d.pas)) <= 1, JSON.stringify(r6i));
    await touche('Escape');
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 20000 });
    V('Échap quitte l\'éditeur (rien de modifié depuis l\'enregistrement)', true);
    await page.evaluate(function () { Rythme.ecrirePartition = Rythme._ecrireVrai; });

    // ⑦ la boîte
    console.log('\n⑦ La boîte à musique');
    await page.evaluate(function () {
        $gameSystem._music_list.forEach(function (e) { e[0] = ['Battle1', 'Battle3', 'Dungeon2', 'Battle-Conflict_loop'].indexOf(e[1]) >= 0; });
        $gameMap._interpreter = $gameMap._interpreter;
        AudioManager.playBgm({ name: 'Field1', volume: 0, pitch: 100, pan: 0 });
        window.__carte = 'Field1';
        $gameSystem.music_book();
    });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Music_Book && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 20000 });
    var r7 = await page.evaluate(async function () {
        var s = SceneManager._scene, w = s._w_music_list, out = {};
        out.total = w._data.length;
        var i = w._data.findIndex(function (e) { return e[1] === 'Battle-Conflict_loop'; });
        w.select(i); s.refresh_music();
        out.disque = s._cover.bitmap && s._cover.bitmap.width === 300;
        out.aide = s._helpWindow._text;
        s.filtrer(true); out.filtre = w._data.length;
        return out;
    });
    V('la boîte s\'ouvre avec toutes les musiques', r7.total === surDisque, String(r7.total));
    V('sans pochette, un disque est dessiné', r7.disque);
    V('sous le titre : la partition et le record', /partition/.test(r7.aide || ''), r7.aide);
    V('Tab : seulement les entendues (Field1 vient d\'être jouée par la carte)', r7.filtre === 5, String(r7.filtre));
    await page.evaluate(function () { var s = SceneManager._scene; s._w_music_list.select(0); });
    await page.keyboard.down('Shift'); await page.waitForTimeout(150); await page.keyboard.up('Shift');
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Rythme; }, null, { timeout: 20000 });
    var r7b = await page.evaluate(function () { return SceneManager._scene._o.musique; });
    V('Maj lance la musique choisie au jeu de rythme', r7b === 'Battle-Conflict_loop' || r7b === 'Battle1', r7b);
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Rythme && (s._etat === 'menu' || s._etat === 'erreur'); }, null, { timeout: 180000 });
    await page.evaluate(function () { SceneManager._scene.quitter(); });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Music_Book && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 20000 });
    var r7c = await page.evaluate(function () { var s = SceneManager._scene; return { filtre: !!s._filtre, carte: BattleManager._mapBgm && BattleManager._mapBgm.name }; });
    V('retour dans la boîte, filtre gardé', r7c.filtre);
    await page.evaluate(function () { SceneManager._scene._w_music_list.processCancel(); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 20000 });
    var r7d = await page.evaluate(function () { return AudioManager._currentBgm && AudioManager._currentBgm.name; });
    V('en quittant la boîte, la musique de la carte revient (Field1)', r7d === 'Field1', String(r7d));

    // ⑧ le Theatrhythm de MOG
    console.log('\n⑧ Le Theatrhythm de MOG');
    await page.evaluate(function () {
        $gameSystem.setBattleBgm({ name: 'Battle1', volume: 0, pitch: 100, pan: 0 });
        var i = new Game_Interpreter(); i.setup([{ code: 356, indent: 0, parameters: ['theatrhythm : 99 : 5'] }, { code: 0, indent: 0, parameters: [] }]); i.update();
    });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Theatrhythm'; }, null, { timeout: 20000 });
    // « Prêt ? » : MOG attend qu'on appuie sur Entrée
    for (var e8 = 0; e8 < 240; e8++) {
        var ph = await page.evaluate(function () { return SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Theatrhythm' ? $gameSystem._theatrhythm_phase : -1; });
        if (ph === 1) break;
        if (ph === 0) await page.keyboard.press('Enter');
        await page.waitForTimeout(500);
    }
    var pret8 = await page.evaluate(async function () {
        try {
            await attendre(function () { var s = SceneManager._scene; return $gameSystem._theatrhythm_phase === 1 && s._sprite_buttons && s._sprite_buttons._sync && s._sprite_buttons._sync.pret && s._sprite_buttons._sync.t !== undefined; }, 240000);
            return null;
        } catch (e) {
            var s = SceneManager._scene, k = s._sprite_buttons, b = AudioManager._bgmBuffer;
            return { scene: s.constructor.name, phase: $gameSystem._theatrhythm_phase, sync: k ? (k._sync === null ? 'null' : JSON.stringify({ pret: k._sync.pret, t: k._sync.t })) : 'pas de touches',
                bgm: AudioManager._currentBgm && AudioManager._currentBgm.name, tampon: b ? b.constructor.name + ' pret ' + (b.isReady && b.isReady()) + ' joue ' + (b.isPlaying && b.isPlaying()) + ' start ' + b._startTime : 'aucun' };
        }
    });
    if (pret8) { V('le Theatrhythm se prépare', false, JSON.stringify(pret8)); throw new Error('Theatrhythm pas prêt'); }
    var r8 = await page.evaluate(async function () {
        var s = SceneManager._scene, k = s._sprite_buttons, out = {};
        out.images = s._buttons_img.width === 48 * 8 && s._phase_img.height === 320;
        // la prochaine note après le départ
        var n = await attendre(function () { return (k._sync.prochainesNotes || []).filter(function (x) { return x.etat === 0 && x.t > k._sync.depart && x.t > k._sync.t + 3000; })[0]; }, 60000);
        out.surLeTemps = k._sync.base.length > 10;
        // le banc se place à 10 ms de la note (sans attendre : la machine peut être lente)
        var chaine = $gameSystem._theatrhythm_chain_data[0];
        k._sync.t = n.t + 10;
        k.keyisValid(Sprite_TKeys.TOUCHE_DU_COULOIR[n.c]);
        out.touche = [$gameSystem._theatrhythm_key_data[1], n.etat];
        s.refresh_effect();
        out.chaine = $gameSystem._theatrhythm_chain_data[0] - chaine;
        // contre-épreuve : la mauvaise touche sur la note suivante
        var m = k._sync.prochainesNotes.filter(function (x) { return x.etat === 0 && x.t > n.t + 200; })[0];
        k._sync.t = m.t + 10;
        var faux = [0, 1, 2, 3].map(function (c) { return Sprite_TKeys.TOUCHE_DU_COULOIR[c]; }).filter(function (t) { return t !== Sprite_TKeys.TOUCHE_DU_COULOIR[m.c]; })[0];
        k.keyisValid(faux);
        out.faux = [$gameSystem._theatrhythm_key_data[1], m.etat];
        s.refresh_effect();
        out.chaineApres = $gameSystem._theatrhythm_chain_data[0];
        return out;
    });
    V('la scène s\'ouvre : ses images sont dessinées', r8.images);
    V('les notes viennent de la partition de la musique de combat', r8.surLeTemps);
    V('la bonne flèche au bon moment touche (critique à ±50 ms)', r8.touche[0] === 2 && r8.touche[1] === 1, JSON.stringify(r8.touche));
    V('… et la chaîne monte', r8.chaine === 1);
    V('contre-épreuve : la mauvaise flèche rate, la chaîne retombe', r8.faux[0] === 0 && r8.chaineApres === 0, JSON.stringify(r8.faux));
    // le mode de MOG, sans la synchro
    await page.evaluate(function () { SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 20000 });
    await page.evaluate(function () { Moghunter.theatrhythm_synchro = false; var i = new Game_Interpreter(); i.setup([{ code: 356, indent: 0, parameters: ['theatrhythm : 99 : 5'] }, { code: 0, indent: 0, parameters: [] }]); i.update(); });
    await page.waitForFunction(function () { return SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Theatrhythm'; }, null, { timeout: 60000 });
    // « Prêt ? » : MOG attend qu'on appuie sur Entrée
    for (var e8 = 0; e8 < 240; e8++) {
        var ph = await page.evaluate(function () { return SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Theatrhythm' ? $gameSystem._theatrhythm_phase : -1; });
        if (ph === 1) break;
        if (ph === 0) await page.keyboard.press('Enter');
        await page.waitForTimeout(500);
    }
    await page.waitForFunction(function () { return $gameSystem._theatrhythm_phase === 1; }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);
    var r8b = await page.evaluate(function () { var k = SceneManager._scene._sprite_buttons; return { sync: k._sync, vus: k._keys.filter(function (x) { return x.visible && x.opacity > 0; }).length }; });
    V('Synchro Musique à false : les notes de MOG, au hasard, comme avant', r8b.sync === null && r8b.vus > 0, r8b.vus + ' notes à l\'écran');

    console.log('   (fichiers absents demandés : ' + (absents.length ? absents.join(', ') : 'aucun') + ')');
    V('aucune erreur dans la page', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
    console.log('\n' + (ko ? '❌ ' + ko + ' échec(s), ' + ok + ' réussite(s)' : '✅ TOUT PASSE (' + ok + ' contrôles)'));
    await nav.close();
    serveur.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); console.error('erreurs de la page :', erreursGlobales.slice(0, 5)); serveur.close(); process.exit(1); });
