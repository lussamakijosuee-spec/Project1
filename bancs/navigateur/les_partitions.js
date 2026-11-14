/*
 * LES PARTITIONS — le Theatrhythm de MOG joue les partitions de JOKO
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-02 : « le plugin de base était excellent, il était parfait
 * comme il était, ce que je voulais c'est créer mes propres musiques. Savoir
 * quelle musique va avancer, savoir à quel rythme, qui suit la musique […] pas
 * que ce soit automatique », puis : « Dans le Studio ».
 *
 *  DANS LE JEU (LesPartitions.js ; MOG_Theatrhythm.js n'est pas touché)
 *   ① « theatrhythm : 1 : 2 : nom » charge la partition, la scène la prend ;
 *   ② chaque note naît à son heure, dans son couloir, avec son bouton, à la
 *     place que le temps lui donne ; un couloir de trop revient sur l'équipe ;
 *   ③ MOG la juge : la bonne touche au bon moment frappe (critique) ; une
 *     touche entre deux notes ne coûte rien ; une note ratée, l'ennemi frappe ;
 *   ④ « ça accélère » : la note d'après le drapeau arrive à sa vitesse ;
 *   ⑤ la partition finie : victoire (comme FNF), l'interrupteur 955 s'allume ;
 *   ⑥ contre-épreuves : sans nom, MOG au hasard (6 notes, couloirs tirés) ;
 *     une partition introuvable, MOG au hasard, sans planter ;
 *   ⑦ avec une musique, le temps est celui de la musique.
 *
 *  DANS LE STUDIO (studio/pages/rythmes.html, un serveur à nous, port 8793)
 *   ⑧ un clic pose une note sur le temps (aimant 1/4), « libre » où l'on
 *     clique, clic droit l'enlève, la bande « vitesse » pose un drapeau ;
 *   ⑨ au clavier, en lecture : S pose un « S » dans le couloir actif ; Ctrl+Z ;
 *   ⑩ Enregistrer écrit data/rythmes/<nom>.json, il se relit ; un nom avec
 *     une espace est refusé. Le fichier du banc est effacé à la fin.
 *
 *   node bancs/navigateur/les_partitions.js
 */
'use strict';
var { chromium } = require('playwright');
var http = require('http'), fs = require('fs'), path = require('path');
var spawn = require('child_process').spawn;
var RACINE = path.join(__dirname, '..', '..');
var PORT_STUDIO = 8793;
var NOM_BANC = '_banc_partitions';
var TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.ttf': 'font/ttf', '.woff': 'font/woff', '.otf': 'font/otf' };
var serveur = http.createServer(function (req, res) {
    var f = path.join(RACINE, decodeURIComponent(req.url.split('?')[0]));
    if (f.indexOf(RACINE) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
});
var erreurs = [];

// la partition d'essai : 5 notes, un drapeau « ça accélère » avant la dernière
var ESSAI = {
    version: 1, musique: null, bpm: 120, decalage: 0, vitesse: 4,
    notes: [{ t: 1, c: 0, b: 0 }, { t: 2, c: 1, b: 4 }, { t: 3, c: 2, b: 2 }, { t: 4, c: 3, b: 7 }, { t: 5, c: 5, b: 1 }],
    vitesses: [{ t: 4.5, v: 12 }]
};

function lancerStudio(port) {
    return new Promise(function (ok, ko) {
        var p = spawn(process.execPath, [path.join(RACINE, 'studio', 'serveur.js')], {
            env: Object.assign({}, process.env, { STUDIO_PORT: String(port), STUDIO_EDITEUR: 'banc_aucun_editeur.exe' }), windowsHide: true });
        var sortie = '';
        var minuteur = setTimeout(function () { ko(new Error('le Studio ne démarre pas : ' + sortie)); }, 15000);
        p.stdout.on('data', function (d) {
            sortie += d;
            if (/Studio prêt/.test(sortie)) { clearTimeout(minuteur); ok(p); }
            else if (/tourne déjà/.test(sortie)) { clearTimeout(minuteur); ko(new Error('le port ' + port + ' est déjà pris')); }
        });
        p.stderr.on('data', function (d) { sortie += d; });
        p.on('exit', function (c) { clearTimeout(minuteur); ko(new Error('le Studio s\'est arrêté (' + c + ') : ' + sortie)); });
    });
}

(async function () {
    var ok = 0, ko = 0, studio = null, nav = null;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    var fichierBanc = path.join(RACINE, 'data', 'rythmes', NOM_BANC + '.json');
    var dejaLa = fs.existsSync(fichierBanc);
    try {
        await new Promise(function (r) { serveur.listen(0, '127.0.0.1', r); });
        nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
        var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
        page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
        // les partitions du banc ne passent pas par le disque
        await page.route('**/data/rythmes/_essai_banc.json', function (r) { r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ESSAI) }); });
        await page.route('**/data/rythmes/_essai_musique.json', function (r) { r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(Object.assign({}, ESSAI, { musique: { name: 'Battle1', volume: 90, pitch: 100, pan: 0 } })) }); });
        await page.route('**/data/rythmes/nexiste_pas.json', function (r) { r.fulfill({ status: 404, body: '' }); });
        await page.goto('http://127.0.0.1:' + serveur.address().port + '/index.html', { waitUntil: 'load' });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 180000 });

        await page.evaluate(function () {
            DataManager.setupNewGame();
            $gameParty._actors = [1, 2, 3, 4];
            $gamePlayer.reserveTransfer(1, 7, 7, 2, 0);
            SceneManager.goto(Scene_Map);
            window.lancer = function (texte) {
                $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: [texte] }, { code: 0, indent: 0, parameters: [] }], 0);
            };
        });
        var surLaCarte = function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Map' && SceneManager.isCurrentSceneStarted() && $gameMap.mapId() === 1; };
        var dansLaScene = function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Theatrhythm' && SceneManager.isCurrentSceneStarted() && s._sprite_buttons; };
        await page.waitForFunction(surLaCarte, null, { timeout: 180000 });

        // ① la commande et la partition
        await page.evaluate(function () { lancer('theatrhythm : 1 : 2 : _essai_banc'); });
        await page.waitForFunction(dansLaScene, null, { timeout: 120000 });
        var r1 = await page.evaluate(function () {
            var s = SceneManager._scene;
            window.__t = 0;
            s.tempsPartition = function () { return window.__t; };      // l'horloge du banc
            $gameSystem._theatrhythm_phase = 1;
            // des PV d'essai : personne ne tombe avant la fin de la partition
            s._enemy_hp = [999999, 999999]; s._party_hp = [999999, 999999];
            window.__rates = 0;
            var rate = s.execute_miss_damage;
            s.execute_miss_damage = function () { if ($gameSystem._theatrhythm_phase === 1) window.__rates++; return rate.apply(this, arguments); };
            return { partition: s._partition && s._partition.nom, notes: s._partition && s._partition.notes.length, fin: s._partition && s._partition.fin, suit: !!s._sprite_buttons._partitionScene };
        });
        console.log('\n① La commande charge la partition');
        V('« theatrhythm : 1 : 2 : _essai_banc » : la scène a sa partition', r1.partition === '_essai_banc' && r1.notes === 5, JSON.stringify(r1));
        V('les notes de MOG la suivent', r1.suit === true);

        // ② les notes naissent à leur heure, à leur place
        async function a(t) { await page.evaluate(function (x) { window.__t = x; }, t); await page.waitForTimeout(250); }
        function etat() {
            return page.evaluate(function () {
                var b = SceneManager._scene._sprite_buttons, l = [];
                for (var i = 0; i < b._keys.length; i++) if (b._noteDe[i]) l.push({ t: b._noteDe[i].t, h: b._keys_h[i], c: b._keys_c[i], x: Math.round(b._keys[i].x), y: Math.round(b._keys[i].y), f: b._keys_f[i], v: b._noteDe[i].v });
                return { notes: l, xJ: Math.round(b.xJuste()), cw: b._cw, y: b._positions.map(function (p) { return p[1]; }), limites: b._limit.map(Math.round) };
            });
        }
        await a(0);
        var e0 = await etat();
        console.log('\n② Chaque note à son heure, dans son couloir, avec son bouton');
        var n1 = e0.notes.filter(function (n) { return n.t === 1; })[0], n2 = e0.notes.filter(function (n) { return n.t === 2; })[0];
        V('à 0 s, les notes de 1 s et 2 s sont en route, pas celle de 5 s', n1 && n2 && !e0.notes.some(function (n) { return n.t === 5; }), e0.notes.map(function (n) { return n.t + 's'; }).join(' '));
        V('la note de 1 s : couloir 1, bouton A, à 1 s du cercle (4 × 60 px/s)', n1 && n1.h === 0 && n1.c === 0 && Math.abs(n1.x - (e0.xJ - 240)) <= 1 && n1.y === e0.y[0], JSON.stringify(n1) + ' xJuste ' + e0.xJ);
        V('la note de 2 s : couloir 2, bouton ↑', n2 && n2.h === 1 && n2.c === 4 && n2.y === e0.y[1], JSON.stringify(n2));

        // ③ MOG juge
        console.log('\n③ MOG la juge');
        await a(1);
        var r3 = await page.evaluate(function () {
            var s = SceneManager._scene, avant = s._enemy_hp[0];
            s.check_key(0);
            return { degats: avant - s._enemy_hp[0], chaine: $gameSystem._theatrhythm_chain_data[0], frappee: SceneManager._scene._sprite_buttons._keys_f.some(function (f) { return f; }) };
        });
        V('A au bon moment : la note est frappée, l\'ennemi perd des PV, la chaîne monte', r3.frappee && r3.degats > 0 && r3.chaine === 1, JSON.stringify(r3));
        await a(1.2);
        var r3b = await page.evaluate(function () {
            var s = SceneManager._scene, avant = [s._party_hp[0], s._enemy_hp[0]];
            s.check_key(3);
            return { equipe: avant[0] - s._party_hp[0], chaine: $gameSystem._theatrhythm_chain_data[0], ennemi: avant[1] - s._enemy_hp[0],
                silence: String(PluginManager.parameters('LesPartitions').silenceSansNote || 'rien') };
        });
        // le réglage de JOKO décide (« HIUBI », 2026-11-05 : silenceSansNote « rate », la règle de MOG)
        var silenceRate = r3b.silence === 'rate';
        if (silenceRate) V('X entre deux notes, réglage « rate » (celui de JOKO) : MOG compte un raté (l\'ennemi frappe, la chaîne retombe)', r3b.equipe > 0 && r3b.chaine === 0 && r3b.ennemi === 0, JSON.stringify(r3b));
        else V('X entre deux notes, réglage « rien » : rien ne se passe (ni raté, ni chaîne perdue)', r3b.equipe === 0 && r3b.chaine === 1 && r3b.ennemi === 0, JSON.stringify(r3b));
        await a(2.8);
        await page.waitForTimeout(500);
        var r3c = await page.evaluate(function () { return { rates: window.__rates, chaine: $gameSystem._theatrhythm_chain_data[0], phase: $gameSystem._theatrhythm_phase }; });
        V('la note de 2 s ratée : MOG compte le raté (l\'ennemi riposte), la chaîne retombe', r3c.rates === (silenceRate ? 2 : 1) && r3c.chaine === 0 && r3c.phase === 1, JSON.stringify(r3c) + (silenceRate ? ' (le X d\'avant compte aussi)' : ''));

        // ④ un couloir de trop, et « ça accélère »
        console.log('\n④ Un couloir de trop, et « ça accélère »');
        await a(4.9);
        var e4 = await etat();
        var n5 = e4.notes.filter(function (n) { return n.t === 5; })[0];
        V('couloir 6 dans une équipe de 4 : il revient sur le 2e héros', n5 && n5.h === 1, JSON.stringify(n5));
        V('après le drapeau ⚡12 : la note arrive à 12 (720 px/s, 72 px à 0,1 s)', n5 && n5.v === 12 && Math.abs(n5.x - (e4.xJ - 72)) <= 1, n5 && (e4.xJ - n5.x) + ' px');

        // ⑤ la partition finie
        console.log('\n⑤ La partition finie');
        await a(6.4);
        var avantFin = await page.evaluate(function () { return $gameSystem._theatrhythm_phase; });
        V('juste avant la fin (6,4 s) : on joue encore', avantFin === 1, 'phase ' + avantFin);
        await a(6.6);
        await page.waitForFunction(function () { return $gameSystem._theatrhythm_phase === 10; }, null, { timeout: 20000 }).catch(function () {});
        var r5 = await page.evaluate(function () { return { phase: $gameSystem._theatrhythm_phase, gagne: $gameSwitches.value(955) }; });
        V('tenir jusqu\'au bout : victoire, l\'interrupteur 955 s\'allume', r5.phase === 10 && r5.gagne === true, JSON.stringify(r5));

        // ⑥ contre-épreuves : MOG au hasard
        console.log('\n⑥ Sans partition, MOG comme avant');
        async function deNouveau(texte) {
            await page.evaluate(function () { SceneManager.goto(Scene_Map); });
            await page.waitForFunction(surLaCarte, null, { timeout: 120000 });
            await page.evaluate(function (t) { lancer(t); }, texte);
            await page.waitForFunction(dansLaScene, null, { timeout: 120000 });
            return page.evaluate(function () {
                var s = SceneManager._scene, b = s._sprite_buttons;
                return { partition: !!s._partition, suit: !!b._partitionScene, notes: b._keys.length };
            });
        }
        var r6 = await deNouveau('theatrhythm : 1 : 2');
        V('« theatrhythm : 1 : 2 » : pas de partition, les 6 notes de MOG', !r6.partition && !r6.suit && r6.notes === 6, JSON.stringify(r6));
        var r6b = await deNouveau('theatrhythm : 1 : 2 : nexiste_pas');
        V('une partition introuvable : MOG au hasard, sans planter', !r6b.partition && !r6b.suit && r6b.notes === 6, JSON.stringify(r6b));

        // ⑦ le temps de la musique
        console.log('\n⑦ Avec une musique, le temps est le sien');
        await deNouveau('theatrhythm : 1 : 2 : _essai_musique');
        await page.evaluate(function () { $gameSystem._theatrhythm_phase = 1; });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s._partitionAudio || (s._debutPartition != null && Graphics.frameCount - s._debutPartition > 400); }, null, { timeout: 60000 }).catch(function () {});
        var r7 = await page.evaluate(function () {
            var s = SceneManager._scene, b = s._musiquePartition;
            var t = s.tempsPartition(), audio = b && b._startTime ? (WebAudio._context.currentTime - b._startTime) * (b._pitch || 1) : null;
            return { audio: !!s._partitionAudio, t: t, ecart: audio == null ? null : Math.abs(t - audio), musique: AudioManager._currentBgm && AudioManager._currentBgm.name };
        });
        if (r7.audio) V('la musique « Battle1 » joue, et le temps des notes est sa position', r7.musique === 'Battle1' && r7.ecart < 0.05, 'écart ' + (r7.ecart != null ? r7.ecart.toFixed(3) : '?') + ' s');
        else V('pas de son dans ce navigateur : après 3 s d\'attente, le temps des images prend le relais (la musique est bien la sienne)', r7.musique === 'Battle1' && r7.t > 0, JSON.stringify(r7));
        V('aucune erreur dans le jeu', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
        await page.close();

        // ── le Studio ──────────────────────────────────────────────────────────
        studio = await lancerStudio(PORT_STUDIO);
        var p2 = await nav.newPage({ viewport: { width: 1280, height: 860 } });
        var err2 = [];
        p2.on('pageerror', function (e) { err2.push(e.message.slice(0, 200)); });
        p2.on('dialog', function (d) { d.accept('10'); });
        var base = 'http://127.0.0.1:' + PORT_STUDIO;
        await p2.goto(base + '/rythmes');
        await p2.evaluate(function () { localStorage.removeItem('studio.rythme'); });
        await p2.reload();
        await p2.waitForFunction(function () { return typeof P !== 'undefined' && document.getElementById('musique').options.length > 1; }, null, { timeout: 30000 });
        await p2.fill('#nom', NOM_BANC);
        await p2.fill('#bpm', '120'); await p2.dispatchEvent('#bpm', 'change');
        await p2.fill('#decalage', '0'); await p2.dispatchEvent('#decalage', 'change');
        await p2.selectOption('#aimant', '4');
        var boite = await p2.locator('#toile').boundingBox();
        function ou(t, c) {
            return p2.evaluate(function (a) { return { x: GOUTTIERE + (a.t - vue.debut) * vue.pxs, y: c2y(a.c) }; function c2y(c) { return c < 0 ? REGLE + PISTE / 2 : REGLE + PISTE + c * COULOIR + COULOIR / 2; } }, { t: t, c: c });
        }
        async function clic(t, c, bouton) { var o = await ou(t, c); await p2.mouse.click(boite.x + o.x, boite.y + o.y, { button: bouton || 'left' }); await p2.waitForTimeout(80); }
        function notes() { return p2.evaluate(function () { return { notes: JSON.parse(JSON.stringify(P.notes)), vitesses: JSON.parse(JSON.stringify(P.vitesses)) }; }); }

        console.log('\n⑧ Le Studio : poser à la souris');
        await clic(1.05, 1);
        var s8 = await notes();
        V('un clic à 1,05 s dans le couloir 2 : la note se pose sur le temps (1 s), bouton Z', s8.notes.length === 1 && s8.notes[0].t === 1 && s8.notes[0].c === 1 && s8.notes[0].b === 2, JSON.stringify(s8.notes));
        await p2.click('#palette button:nth-child(5)');
        await p2.selectOption('#aimant', '0');
        await clic(1.37, 2);
        s8 = await notes();
        var libre = s8.notes.filter(function (n) { return n.c === 2; })[0];
        V('aimant « libre » : la note va où l\'on clique (1,37 s), bouton ↑', libre && Math.abs(libre.t - 1.37) < 0.01 && libre.b === 4, JSON.stringify(libre));
        await clic(1.0, 1, 'right');
        s8 = await notes();
        V('clic droit sur la note de 1 s : elle part', s8.notes.length === 1 && s8.notes[0].c === 2);
        await clic(2, -1);
        s8 = await notes();
        V('un clic dans la bande « vitesse » à 2 s : drapeau ⚡10', s8.vitesses.length === 1 && Math.abs(s8.vitesses[0].t - 2) < 0.01 && s8.vitesses[0].v === 10, JSON.stringify(s8.vitesses));

        console.log('\n⑨ Le Studio : au clavier');
        await p2.selectOption('#aimant', '4');
        await p2.keyboard.press('Digit4');
        await p2.click('#btnEnreg');
        await p2.waitForTimeout(400);
        await p2.keyboard.press('KeyS');
        await p2.keyboard.press('Space');
        s8 = await notes();
        var cle = s8.notes.filter(function (n) { return n.c === 3; })[0];
        V('en lecture, ⏺ puis S : un « S » dans le couloir actif (4)', s8.notes.length === 2 && cle && cle.b === 1, JSON.stringify(cle));
        await p2.keyboard.press('Control+KeyZ');
        s8 = await notes();
        V('Ctrl+Z : il part', s8.notes.length === 1 && !s8.notes.some(function (n) { return n.c === 3; }));

        console.log('\n⑩ Le Studio : enregistrer');
        if (dejaLa) { V('le fichier du banc n\'existait pas avant', false, fichierBanc + ' existe déjà : le banc ne l\'écrase pas'); }
        else {
            await p2.click('#btnEnregistrer');
            await p2.waitForFunction(function () { var t = document.getElementById('toast'); return /écrites|nom|illisible/i.test(t.textContent) && /visible/.test(t.className); }, null, { timeout: 15000 }).catch(function () {});
            var ecrit = fs.existsSync(fichierBanc) ? JSON.parse(fs.readFileSync(fichierBanc, 'utf8')) : null;
            V('data/rythmes/' + NOM_BANC + '.json est écrit, avec sa note, son drapeau et son tempo', ecrit && ecrit.version === 1 && ecrit.notes.length === 1 && ecrit.vitesses.length === 1 && ecrit.bpm === 120,
                ecrit ? JSON.stringify(ecrit.notes) : 'absent');
            var relu = await p2.evaluate(function (n) { return fetch('/api/rythme?nom=' + n).then(function (r) { return r.json(); }); }, NOM_BANC);
            V('il se relit par le Studio', relu && relu.notes && relu.notes.length === 1);
            var refus = await p2.evaluate(function () { return fetch('/api/rythme', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nom: 'mon chant', partition: { notes: [] } }) }).then(function (r) { return r.json().then(function (j) { return [r.status, j.erreur]; }); }); });
            V('contre-épreuve : « mon chant » (une espace) est refusé', refus[0] === 400 && /espace/.test(refus[1]), refus.join(' — '));
            var cmd = await p2.textContent('#commande');
            V('la commande à copier', cmd === 'theatrhythm : 1 : 6 : ' + NOM_BANC, cmd);
        }
        V('aucune erreur dans le Studio', err2.length === 0, err2.slice(0, 3).join(' | '));
    } catch (e) {
        ko++; console.error(e);
    } finally {
        if (!dejaLa && fs.existsSync(fichierBanc)) fs.unlinkSync(fichierBanc);   // le fichier du banc, et lui seul
        if (studio) studio.kill();
        if (nav) await nav.close();
        serveur.close();
    }
    console.log('\n' + (ko ? '❌ ' + ko + ' échec(s), ' + ok + ' réussite(s)' : '✅ TOUT PASSE (' + ok + ' contrôles)'));
    process.exit(ko ? 1 : 0);
})();
