/*
 * LE THEATRHYTHM — celui de MOG, tel quel, et ce que TheatrhythmPlus ajoute
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-02 : « il était très bien la version qui était de base […] je
 * voulais juste que tu l'améliores et fasses plus un snap pour que je puisse
 * l'éditer », puis ses choix : « Éditeur avec grille », « Notes spéciales,
 * Attaque des héros, Ennemi qui varie ».
 *
 *   ① sans partition : le jeu de MOG — ses vraies images, ses six notes qui
 *     avancent d'un pas par image, au hasard ;
 *   ② les notes spéciales : la dorée est critique, la verte soigne, la rouge
 *     tapée est un raté, laissée passer ne coûte rien (contre-épreuve : une
 *     note normale laissée passer, si) ;
 *   ③ l'attaque du héros à la 10e note d'affilée, avec <Theatrhythm: …> ;
 *   ④ l'ennemi qui s'énerve sous 50 % et 25 % ;
 *   ⑤ une partition écrite : chaque note arrive à SON temps, sur la bonne
 *     touche et la bonne rangée, au centre de la zone critique à son temps ;
 *     la mauvaise touche rate ; la boucle de la musique rejoue la partition ;
 *   ⑥ l'éditeur : poser, héros, type, effacer, annuler, enregistrer, essayer
 *     dans le vrai Theatrhythm et revenir (points et résultat rendus) ;
 *   ⑦ les semaines Whitty, Matt, Dabi : neuf partitions justes, un événement
 *     commun par chanson, chaque semaine qui monte, et Whitty 3 joué pour de vrai.
 *
 *   node bancs/navigateur/le_theatrhythm.js
 */
'use strict';
var { chromium } = require('playwright');
var http = require('http'), fs = require('fs'), path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.ttf': 'font/ttf', '.woff': 'font/woff', '.otf': 'font/otf', '.webm': 'video/webm', '.mp4': 'video/mp4' };
var serveur = http.createServer(function (req, res) {
    var f = path.join(RACINE, decodeURIComponent(req.url.split('?')[0]));
    if (f.indexOf(RACINE) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
});
var erreurs = [];

(async function () {
    await new Promise(function (r) { serveur.listen(0, '127.0.0.1', r); });
    var BASE = 'http://127.0.0.1:' + serveur.address().port;
    var nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    page.on('console', function (m) { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) erreurs.push(m.text().slice(0, 200)); });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title'; }, null, { timeout: 180000 });
    var inscrit = await page.evaluate(function () { return !!window.TheatrhythmPlus; });
    if (!inscrit) await page.addScriptTag({ path: path.join(RACINE, 'js/plugins/TheatrhythmPlus.js') });
    console.log('TheatrhythmPlus ' + (inscrit ? 'inscrit dans plugins.js' : 'chargé par le banc (pas encore dans plugins.js)'));
    await page.evaluate(function () {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
        window.attendre = function (f, ms) {
            return new Promise(function (r, rej) { var t0 = performance.now(); (function v() { var x; try { x = f(); } catch (e) { x = false; } if (x) r(x); else if (performance.now() - t0 > (ms || 20000)) rej(new Error('trop long')); else setTimeout(v, 10); })(); });
        };
        window.lancer = function (musique) {
            if (musique) $gameSystem._theatrhythmMusique = musique;
            var i = new Game_Interpreter();
            i.setup([{ code: 356, indent: 0, parameters: ['theatrhythm : 99 : 5'] }, { code: 0, indent: 0, parameters: [] }]);
            i.update();
        };
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 60000 });
    async function demarrer() {
        await page.waitForFunction(function () { return SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Theatrhythm'; }, null, { timeout: 60000 });
        for (var e = 0; e < 240; e++) {   // « Prêt ? » : MOG attend Entrée
            var ph = await page.evaluate(function () { var s = SceneManager._scene; return s.constructor.name !== 'Scene_Theatrhythm' ? -1 : $gameSystem._theatrhythm_phase === 1 ? 1 : s._phase && s._phase[0] === 2 ? 2 : 0; });
            if (ph === 1) return;
            if (ph === 2) await page.keyboard.press('Enter');   // une seule fois, quand MOG l'attend
            await page.waitForTimeout(400);
        }
        throw new Error('le Theatrhythm ne démarre pas');
    }
    async function revenir() {
        await page.evaluate(function () { SceneManager.goto(Scene_Map); });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 120000 });
    }

    // ① sans partition : le jeu de MOG
    console.log('\n① Sans partition : le Theatrhythm de MOG, tel quel');
    var mogIdentique = require('child_process').execSync('git diff --quiet 78c0b444f~1 -- js/plugins/MOG_Theatrhythm.js && echo oui || echo non', { cwd: RACINE }).toString().trim();
    V('le fichier de MOG est celui d\'origine', mogIdentique === 'oui');
    await page.evaluate(function () { TheatrhythmPlus.reglages.critiques = 0; TheatrhythmPlus.reglages.soins = 0; TheatrhythmPlus.reglages.pieges = 0; lancer(); });
    await demarrer();
    var r1 = await page.evaluate(async function () {
        var s = SceneManager._scene, k = s._sprite_buttons;
        var x0 = k._keys.map(function (x) { return x.x; }), f0 = Graphics.frameCount;
        await attendre(function () { return Graphics.frameCount >= f0 + 5; });
        var avance = k._keys.map(function (x, i) { return x.x - x0[i]; });
        return { image: s._buttons_img._url || s._buttons_img.url || '', largeur: s._buttons_img.width, slots: k._keys.length, partition: !!k._partition,
            avance: avance, vitesse: k._keys_speed, images: Graphics.frameCount - f0 };
    });
    V('ses vraies images (img/theatrhythm)', /img\/theatrhythm\/Theatrhythm_A/.test(r1.image) && r1.largeur > 0, r1.image + ' · ' + r1.largeur + ' px');
    V('six notes, au hasard, sans partition', r1.slots === 6 && !r1.partition);
    V('les notes avancent d\'un pas par image, comme MOG', r1.avance.some(function (a) { return a > 0 && a % r1.vitesse === 0; }), JSON.stringify(r1.avance));
    await revenir();

    // ② les notes spéciales
    console.log('\n② Les notes spéciales');
    await page.evaluate(function () { lancer(); });
    await demarrer();
    var r2 = await page.evaluate(async function () {
        var s = SceneManager._scene, k = s._sprite_buttons, out = {};
        s._enemy_hp = [1e9, 1e9]; s._party_hp = [1e9, 1e9];
        // une note de chaque type, posée au centre de la zone critique de la rangée 0
        function poser(i, type, touche) {
            k._keys_c[i] = touche; k._keys_h[i] = 0; k._keys_f[i] = false; k._keys_s[i] = false; k._keys_r[i] = true; k._keys_i[i] = 0;
            k._keys_type[i] = type; k._keys[i].x = k.x_critique(); k._keys[i].opacity = 255;
            for (var j = 0; j < k._keys.length; j++) if (j !== i) { k._keys[j].x = k._limit[4] + 500; }
        }
        function taper(touche) { $gameSystem._theatrhythm_key_data = [null, 0, 0, 0]; k.keyisValid(touche); var r = $gameSystem._theatrhythm_key_data.slice(); s.refresh_effect(); return r; }
        // la dorée
        poser(0, 1, 4); out.doree = taper(4)[1];
        // la verte
        s._party_hp[0] = s._party_hp[1] * 0.5; var avant = s._party_hp[0];
        poser(1, 2, 5); out.verte = taper(5)[1]; out.soin = Math.round((s._party_hp[0] - avant) / s._party_hp[1] * 100);
        // la rouge tapée
        $gameSystem._theatrhythm_chain_data[0] = 5;
        poser(2, 3, 6); out.rouge = taper(6)[1]; out.chaineRouge = $gameSystem._theatrhythm_chain_data[0];
        // la rouge laissée passer, puis une normale laissée passer (contre-épreuve)
        $gameSystem._theatrhythm_miss_dmg = false; poser(3, 3, 7); k._keys[3].x = k._limit[1] + 1; k.slow_pressed(3); out.rougeLaissee = $gameSystem._theatrhythm_miss_dmg;
        $gameSystem._theatrhythm_miss_dmg = false; poser(4, 0, 7); k.slow_pressed(4); out.normaleLaissee = $gameSystem._theatrhythm_miss_dmg;
        $gameSystem._theatrhythm_miss_dmg = false;
        // au hasard : avec 100 % de dorées, toutes les notes refaites sont dorées et teintées
        TheatrhythmPlus.reglages.critiques = 1;
        for (var i = 0; i < 6; i++) k.refresh_keys(i);
        out.toutesDorees = k._keys_type.slice(0, 6).every(function (t) { return t === 1; }) && k._keys[0].getBlendColor()[3] > 0;
        TheatrhythmPlus.reglages.critiques = 0;
        for (var j = 0; j < 6; j++) k.refresh_keys(j);
        out.aucune = k._keys_type.slice(0, 6).every(function (t) { return t === 0; }) && k._keys[0].getBlendColor()[3] === 0;
        return out;
    });
    V('la dorée est toujours un coup critique', r2.doree === 2, String(r2.doree));
    V('la verte touche et soigne le groupe (15 %)', r2.verte >= 1 && r2.soin === 15, 'soin ' + r2.soin + ' %');
    V('la rouge tapée est un raté, la chaîne retombe', r2.rouge === 0 && r2.chaineRouge === 0);
    V('la rouge laissée passer ne coûte rien', r2.rougeLaissee === false);
    V('contre-épreuve : une normale laissée passer, l\'ennemi frappe', r2.normaleLaissee === true);
    V('au hasard, la part des dorées suit le réglage (100 % → toutes, teintées ; 0 % → aucune)', r2.toutesDorees && r2.aucune);

    // ③ l'attaque du héros
    console.log('\n③ L\'attaque du héros');
    var r3 = await page.evaluate(function () {
        var s = SceneManager._scene, out = {};
        var a = s._battlers[0], note = a.actor().note;
        var c = TheatrhythmPlus.competences(a);
        out.sansBalise = c.length > 0 && c.every(function (x) { return x.damage.type === 1; });
        a.actor().note = note + '\n<Theatrhythm: 1>';
        out.balise = TheatrhythmPlus.competences(a).map(function (x) { return x.id; }).join(',');
        s._enemy_hp[0] = s._enemy_hp[1];
        $gameSystem._theatrhythm_chain_data[0] = 8; $gameSystem._theatrhythm_key_data = [0, 1, 0, 0];
        var hp0 = s._enemy_hp[0]; s.execute_hit_enemy(0, 1); var coup = hp0 - s._enemy_hp[0];
        out.neuvieme = s._annonce.opacity;
        hp0 = s._enemy_hp[0]; $gameSystem._theatrhythm_key_data = [0, 1, 0, 0]; s.execute_hit_enemy(0, 1); var dixieme = hp0 - s._enemy_hp[0];
        out.coup = coup; out.dixieme = dixieme; out.annonce = s._annonce.opacity;
        a.actor().note = note;
        return out;
    });
    V('sans balise : ses compétences qui frappent', r3.sansBalise);
    V('<Theatrhythm: 1> choisit la compétence', r3.balise === '1', r3.balise);
    V('la 10e note d\'affilée : l\'attaque du héros (×3 en plus), annoncée', r3.neuvieme === 0 && r3.annonce > 0 && r3.dixieme >= r3.coup * 3.5, r3.coup + ' puis ' + r3.dixieme);

    // ④ l'ennemi qui s'énerve
    console.log('\n④ L\'ennemi qui s\'énerve');
    var r4 = await page.evaluate(async function () {
        var s = SceneManager._scene, k = s._sprite_buttons, out = {};
        s._enemy_hp[0] = s._enemy_hp[1]; var f0 = Graphics.frameCount;
        await attendre(function () { return Graphics.frameCount > f0 + 2; });
        var v0 = k._keys_speed, atk0 = s._enemy_atk;
        s._enemy_hp[0] = Math.floor(s._enemy_hp[1] * 0.4); f0 = Graphics.frameCount;
        await attendre(function () { return Graphics.frameCount > f0 + 2; });
        out.v50 = k._keys_speed / v0; out.atk50 = s._enemy_atk / atk0;
        s._enemy_hp[0] = Math.floor(s._enemy_hp[1] * 0.2); f0 = Graphics.frameCount;
        await attendre(function () { return Graphics.frameCount > f0 + 2; });
        out.v25 = k._keys_speed / v0; out.atk25 = s._enemy_atk / atk0;
        return out;
    });
    V('sous 50 % : les notes ×1,25', Math.abs(r4.v50 - 1.25) < 0.01 && r4.atk50 === 1, r4.v50.toFixed(2));
    V('sous 25 % : ×1,5, et il frappe ×1,2', Math.abs(r4.v25 - 1.5) < 0.01 && Math.abs(r4.atk25 - 1.2) < 0.02, r4.v25.toFixed(2) + ' · ' + r4.atk25.toFixed(2));
    await revenir();

    // ⑤ une partition écrite
    console.log('\n⑤ Une partition écrite');
    await page.evaluate(function () {
        TheatrhythmPlus.reglages.critiques = 0;
        var notes = [];
        for (var i = 0; i < 300; i++) notes.push([3000 + i * 500, [4, 5, 6, 7, 0, 1][i % 6], i % 3, i % 10 === 9 ? 1 : 0]);
        TheatrhythmPlus._partitions.Battle1 = { version: 1, musique: 'Battle1', bpm: 120, decalage: 0, notes: notes };
        lancer('Battle1');
    });
    await demarrer();
    var r5 = await page.evaluate(async function () {
        var s = SceneManager._scene, k = s._sprite_buttons, out = {};
        s._enemy_hp = [1e9, 1e9]; s._party_hp = [1e9, 1e9];
        out.partition = !!k._partition; out.slots = k._keys.length;
        // une note arrive : la bonne touche, la bonne rangée, sa place vient du temps
        var i = await attendre(function () { for (var j = 0; j < k._keys.length; j++) if (k._keys_t[j] !== null && k._keys_t[j] > k.temps_musique() + 400) return j + 1; return 0; }, 60000) - 1;
        var tn = k._keys_t[i], t = k.temps_musique();
        var note = k._notesP.filter(function (n) { return n[0] === tn; })[0];
        out.touche = [k._keys_c[i], note && note[1]]; out.rang = [k._keys_h[i], note && note[2]];
        k.placer_ecrite(i, t); out.ecart = Math.abs(k._keys[i].x - (k.x_critique() - (tn - t) * k.px_par_ms()));
        // à son temps, elle est au centre de la zone critique : la bonne touche, critique
        k.placer_ecrite(i, tn);
        out.auCentre = k._keys[i].x > k._limit[2] && k._keys[i].x < k._limit[3];
        $gameSystem._theatrhythm_key_data = [null, 0, 0, 0];
        var mauvaise = k._keys_c[i] === 4 ? 5 : 4;
        for (var j2 = 0; j2 < k._keys.length; j2++) if (j2 !== i && k._keys_c[j2] === mauvaise) k._keys[j2].x = k._limit[4] + 500;
        k.keyisValid(mauvaise); out.mauvaise = $gameSystem._theatrhythm_key_data[1]; s.refresh_effect();
        $gameSystem._theatrhythm_key_data = [null, 0, 0, 0];
        k.keyisValid(k._keys_c[i]); out.bonne = $gameSystem._theatrhythm_key_data[1];
        // la boucle : au tour suivant, la partition recommence au début de la boucle
        // une touche quand aucune note n'est à gauche de la cible : MOG plantait (execute_miss)
        var xs = k._keys.map(function (x) { return x.x; });
        k._keys.forEach(function (x) { x.x = k._limit[4] + 200; });
        $gameSystem._theatrhythm_key_data = [null, 0, 0, 0];
        try { k.keyisValid(4); out.sansNote = $gameSystem._theatrhythm_key_data[1] === 0 && $gameSystem._theatrhythm_key_data[0] === 0; } catch (e) { out.sansNote = 'plante : ' + e.message; }
        k._keys.forEach(function (x, j) { x.x = xs[j]; });
        $gameSystem._theatrhythm_key_data = [null, 0, 0, 0];
        var sauve = { p: k._prochaine, t: k._tour, b: k._boucle };
        k._boucle = { debut: 3000, longueur: 10000 }; k._prochaine = k._notesP.length; k._tour = 0;
        var n2 = k.note_suivante();
        out.boucle = n2 && n2.t === 3000 + 10000 && k._tour === 1;
        k._prochaine = sauve.p; k._tour = sauve.t; k._boucle = sauve.b;
        return out;
    });
    V('la partition de Battle1 est lue, plus de place pour les notes (16)', r5.partition && r5.slots === 16);
    V('la note arrive sur SA touche et SA rangée', r5.touche[0] === r5.touche[1] && r5.rang[0] === r5.rang[1], JSON.stringify(r5.touche) + ' ' + JSON.stringify(r5.rang));
    V('sa place vient du temps de la musique', r5.ecart < 0.5, r5.ecart.toFixed(2) + ' px');
    V('à son temps, elle est au centre de la zone critique', r5.auCentre);
    V('la mauvaise touche rate, la bonne est critique', r5.mauvaise === 0 && r5.bonne === 2, r5.mauvaise + ' / ' + r5.bonne);
    V('une touche sans aucune note à l\'écran : un raté, pas un plantage', r5.sansNote === true, String(r5.sansNote));
    V('la musique boucle : la partition aussi', r5.boucle);
    await revenir();

    // ⑥ l'éditeur
    console.log('\n⑥ L\'éditeur à grille');
    await page.evaluate(function () {
        delete TheatrhythmPlus._partitions.Battle1;
        TheatrhythmPlus._partitions.Battle1 = null;
        window.__ecrit = null;
        TheatrhythmPlus.ecrire = function (nom, p) { window.__ecrit = { nom: nom, p: JSON.parse(JSON.stringify(p)) }; this._partitions[nom] = p; return 'theatrhythm/' + nom + '.json'; };
        $gameVariables.setValue(Moghunter.theatrhythm_variable_id, 1234);
        var i = new Game_Interpreter();
        i.setup([{ code: 356, indent: 0, parameters: ['theatrhythm_editeur Battle1'] }, { code: 0, indent: 0, parameters: [] }]);
        i.update();
    });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_TheatrhythmEditeur && s._pret; }, null, { timeout: 180000 });
    async function touche(k, m) {
        await page.evaluate(function (a) {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: a.k, shiftKey: !!a.m.shift, ctrlKey: !!a.m.ctrl, bubbles: true }));
        }, { k: k, m: m || {} });
    }
    var bpm = await page.evaluate(function () { var s = SceneManager._scene; s._curseur = s.caler(2000); return s._p.bpm; });
    await touche('a');
    await touche('r');
    await touche('t');
    await touche('ArrowDown');
    await touche('5');
    var r6 = await page.evaluate(function () { var s = SceneManager._scene; return { notes: JSON.parse(JSON.stringify(s._p.notes)), pas: s.pas(), c: s._curseur }; });
    V('le tempo de la musique est trouvé pour la grille', bpm >= 60 && bpm <= 200, String(bpm));
    V('A pose la note A au curseur (héros au hasard, normale)', r6.notes.some(function (n) { return n[1] === 0 && n[2] === -1 && n[3] === 0; }), JSON.stringify(r6.notes[0]));
    V('R puis T : héros 1, note dorée ; ↓ avance d\'un pas ; 5 pose ↑', r6.notes.some(function (n) { return n[1] === 4 && n[2] === 0 && n[3] === 1 && Math.abs(n[0] - r6.c) <= 1; }), JSON.stringify(r6.notes[1]));
    V('… sur la grille (le snap)', r6.notes.length === 2 && Math.abs(r6.notes[1][0] - r6.notes[0][0] - r6.pas) <= 1, Math.round(r6.notes[1][0] - r6.notes[0][0]) + ' ms = 1 pas');
    await touche('5');
    var n5 = await page.evaluate(function () { return SceneManager._scene._p.notes.length; });
    await touche('z', { ctrl: true });
    var nZ = await page.evaluate(function () { return SceneManager._scene._p.notes.length; });
    V('5 encore une fois l\'enlève, Ctrl+Z la rend', n5 === 1 && nZ === 2);
    await touche('s', { ctrl: true });
    var r6b = await page.evaluate(function () { return { e: window.__ecrit, m: SceneManager._scene._modifie }; });
    V('Ctrl+S enregistre', r6b.e && r6b.e.nom === 'Battle1' && r6b.e.p.notes.length === 2 && !r6b.m);
    // essayer dans le vrai Theatrhythm, puis revenir
    await touche('Enter');
    await demarrer();
    var r6c = await page.evaluate(function () { var k = SceneManager._scene._sprite_buttons; return { partition: !!k._partition, notes: k._notesP.length, var: $gameVariables.value(Moghunter.theatrhythm_variable_id) }; });
    V('Entrée : le vrai Theatrhythm, avec ces notes', r6c.partition && r6c.notes === 2);
    await page.evaluate(function () { $gameVariables.setValue(Moghunter.theatrhythm_variable_id, 99999); SceneManager.pop(); });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_TheatrhythmEditeur && s._pret; }, null, { timeout: 180000 });
    var r6d = await page.evaluate(function () { var s = SceneManager._scene; return { n: s._p.notes.length, c: s._curseur, v: $gameVariables.value(Moghunter.theatrhythm_variable_id), m: $gameSystem._theatrhythmMusique }; });
    V('… et on revient dans l\'éditeur, au même endroit', r6d.n === 2 && r6d.c === r6.c);
    V('les points d\'avant l\'essai sont rendus', r6d.v === 1234, String(r6d.v));
    await touche('Escape');
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 120000 });
    V('Échap quitte l\'éditeur', true);

    // ⑦ les semaines : Whitty, Matt, Dabi
    console.log('\n⑦ Les semaines (Whitty, Matt, Dabi)');
    var semaines = require('../outils/semaines.json');
    var ces = JSON.parse(fs.readFileSync(path.join(RACINE, 'data', 'CommonEvents.json'), 'utf8'));
    var sw = Number(JSON.parse(/var \$plugins =\s*(\[[\s\S]*\]);?\s*$/.exec(fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8'))[1])
        .filter(function (p) { return p.name === 'MOG_Theatrhythm'; })[0].parameters['Result Switch ID']);
    var stats = {}, fichiersOk = true, evOk = true, details = [];
    semaines.forEach(function (c) {
        var f = path.join(RACINE, 'theatrhythm', c.musique + '.json');
        var p = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
        var bon = p && p.notes.length > 50 && p.pvSelonChanson && p.notes.every(function (n, i) {
            return n[0] >= 0 && n[1] >= 0 && n[1] <= 7 && n[2] >= -1 && n[2] <= 3 && n[3] >= 0 && n[3] <= 3 && (!i || p.notes[i - 1][0] <= n[0]);
        });
        if (!bon) { fichiersOk = false; details.push(c.musique); }
        var e = ces.filter(function (x) { return x && x.name.indexOf('🎵 ' + c.adversaire + ' ' + c.niveau + ' · ') === 0; })[0];
        var cmds = e ? e.list.filter(function (x) { return x.code === 356; }).map(function (x) { return x.parameters[0]; }) : [];
        if (cmds[0] !== 'theatrhythm_musique ' + c.musique || cmds[1] !== 'theatrhythm : ' + c.ennemi + ' : ' + c.vitesse) { evOk = false; details.push('événement ' + c.adversaire + ' ' + c.niveau); }
        c.id = e && e.id;
        var s = stats[c.adversaire] = stats[c.adversaire] || [];
        s.push({ rouges: p ? p.notes.filter(function (n) { return n[3] === 3; }).length : 0, densite: p ? p.notes.length / (p.notes[p.notes.length - 1][0] / 1000) : 0 });
    });
    V('neuf partitions justes (touches, héros, types, triées, « pvSelonChanson »)', fichiersOk, details.join(', '));
    V('un événement commun par chanson : sa musique, son ennemi, sa vitesse', evOk, details.join(', '));
    var montent = Object.keys(stats).every(function (a) { var s = stats[a]; return s[0].densite < s[1].densite && s[1].densite < s[2].densite; });
    V('chaque semaine monte : de plus en plus de notes par seconde', montent, Object.keys(stats).map(function (a) { return a + ' ' + stats[a].map(function (x) { return x.densite.toFixed(1); }).join(' < '); }).join(' · '));
    V('les rouges : Whitty en pose à partir de la 2e, Dabi de plus en plus, Matt seulement dans Target Practice',
        stats.Whitty[0].rouges === 0 && stats.Whitty[1].rouges > 0 && stats.Whitty[2].rouges > stats.Whitty[1].rouges &&
        stats.Dabi[0].rouges < stats.Dabi[1].rouges && stats.Dabi[1].rouges < stats.Dabi[2].rouges &&
        stats.Matt[0].rouges === 0 && stats.Matt[1].rouges === 0 && stats.Matt[2].rouges > 0,
        Object.keys(stats).map(function (a) { return a + ' ' + stats[a].map(function (x) { return x.rouges; }).join('/'); }).join(' · '));
    var semOk = ['Whitty', 'Matt', 'Dabi'].every(function (a) {
        var e = ces.filter(function (x) { return x && x.name === '🎵 Semaine ' + a; })[0];
        if (!e) return false;
        var appels = e.list.filter(function (x) { return x.code === 117; }).map(function (x) { return x.parameters[0]; });
        var tests = e.list.filter(function (x) { return x.code === 111 && x.parameters[0] === 0 && x.parameters[1] === sw && x.parameters[2] === 1; }).length;
        var ids = semaines.filter(function (c) { return c.adversaire === a; }).map(function (c) { return c.id; });
        return JSON.stringify(appels) === JSON.stringify(ids) && tests === 3;
    });
    V('« 🎵 Semaine … » : les trois chansons dans l\'ordre, arrêt si perdu (interrupteur ' + sw + ')', semOk);
    // une chanson pour de vrai : Whitty 3 · Ballistic
    var c3 = semaines.filter(function (c) { return c.adversaire === 'Whitty' && c.niveau === 3; })[0];
    await page.evaluate(function (id) {
        var i = new Game_Interpreter();
        i.setup($dataCommonEvents[id].list); i.update();
    }, c3.id);
    await demarrer();
    var r7 = await page.evaluate(async function (c) {
        var s = SceneManager._scene, k = s._sprite_buttons, p = TheatrhythmPlus.lire(c.musique);
        var coup = Math.max(s._party_atk - s._enemy_def, 1), attendu = Math.floor(coup * p.notes.filter(function (n) { return n[3] !== 3; }).length * 0.8 * 1.3);
        var vue = await attendre(function () { for (var j = 0; j < k._keys.length; j++) if (k._keys_t[j] !== null) return true; return false; }, 60000);
        return { musique: k._musique, ennemi: s._enemy.enemyId(), vitesse: k._keys_speed, pv: s._enemy_hp[1], attendu: attendu, notes: !!vue, cur: AudioManager._currentBgm && AudioManager._currentBgm.name };
    }, c3);
    V('« 🎵 Whitty 3 » lance Ballistic : sa musique, Croûte Brûlante, vitesse 8', r7.musique === c3.musique && r7.cur === c3.musique && r7.ennemi === c3.ennemi && r7.vitesse === c3.vitesse, JSON.stringify([r7.cur, r7.ennemi, r7.vitesse]));
    V('l\'ennemi tient la chanson (PV pris sur la partition)', Math.abs(r7.pv - r7.attendu) <= 1 && r7.pv > 1000, r7.pv + ' PV');
    V('les notes de la partition arrivent', r7.notes);
    await revenir();

    V('aucune erreur dans la page', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
    console.log('\n' + (ko ? '❌ ' + ko + ' échec(s), ' + ok + ' réussite(s)' : '✅ TOUT PASSE (' + ok + ' contrôles)'));
    await nav.close(); serveur.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); console.error('erreurs de la page :', erreurs.slice(0, 5)); serveur.close(); process.exit(1); });
