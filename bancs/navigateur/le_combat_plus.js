/*
 * COMBATPLUS, DANS LE VRAI MOTEUR
 * ---------------------------------------------------------------------------
 *   ① la transition : tourbillon par défaut, « TRANSITION eclats » pour UN
 *     combat (le suivant revient au tourbillon), éclats tout seuls pour un
 *     boss, « mv » rend le zoom d'origine ; la musique, la photo du fond et
 *     le fondu restent ceux de MV, à la même image (n = 30)
 *   ② la jauge : invisible au repos ; visée, elle apparaît (et pas celle du
 *     voisin) ; touchée, elle apparaît, montre la trace, puis s'efface
 *   ③ <Sans jauge> la cache ; le boss qui a sa grande barre n'en a pas
 *     d'autre — et sans la grande barre, la sienne revient (contre-épreuve)
 *   ④ sous 25 % de PV l'ennemi vacille ; à 70 %, non ; soigné, il s'arrête
 *   Le tout en WebGL (le rendu du jeu sur PC : torsion par la carte
 *   graphique), puis les deux transitions en Canvas (le repli) ; à chaque
 *   fois on mesure les PIXELS à l'écran : l'effet se voit, ce n'est pas un
 *   écran noir.
 *
 *   node bancs/navigateur/le_combat_plus.js
 */
'use strict';
var { chromium } = require('playwright');
var path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var NORMALE = 2, BOSS = 519;

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--no-sandbox', '--mute-audio', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    var CAP = path.join(__dirname, 'captures');
    // les pixels d'une capture : luminance moyenne, contraste, écart à une autre
    var labo = await nav.newPage();
    async function pixels(png, ref) {
        return labo.evaluate(function (a) {
            function charger(b) { return new Promise(function (ok) { var i = new Image(); i.onload = function () { var c = document.createElement('canvas'); c.width = i.width; c.height = i.height; var x = c.getContext('2d'); x.drawImage(i, 0, 0); ok(x.getImageData(0, 0, i.width, i.height).data); }; i.src = 'data:image/png;base64,' + b; }); }
            return Promise.all([charger(a.png), a.ref ? charger(a.ref) : null]).then(function (d) {
                var p = d[0], r = d[1], n = 0, s = 0, s2 = 0, diff = 0;
                for (var k = 0; k < p.length; k += 16) { var l = (p[k] + p[k + 1] + p[k + 2]) / 3; s += l; s2 += l * l; n++; if (r) diff += Math.abs(l - (r[k] + r[k + 1] + r[k + 2]) / 3); }
                var m = s / n; return { moyenne: Math.round(m), contraste: Math.round(Math.sqrt(s2 / n - m * m)), ecart: r ? Math.round(diff / n) : null };
            });
        }, { png: png.toString('base64'), ref: ref ? ref.toString('base64') : null });
    }

  for (var mode of ['webgl', 'canvas']) {
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    var ev = function (f, a) { return page.evaluate(f, a); };

    await page.goto(BASE + '/index.html' + (mode === 'webgl' ? '?webgl' : ''), { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    await ev(function () {
        DataManager.setupNewGame(); $gameSystem._meteo = { force: 'clair' }; $gamePlayer.reserveTransfer(29, 10, 10, 2, 0); SceneManager.goto(Scene_Map);
        // le relevé de chaque image de la transition
        var _u = Scene_Map.prototype.updateEncounterEffect;
        Scene_Map.prototype.updateEncounterEffect = function () {
            var t0 = performance.now();
            _u.call(this);
            var d = this.encounterEffectSpeed(), n = d - this._encounterEffectDuration, tr = this._cpTransition;
            var deplace = 0;
            if (tr && tr._eclats) tr._eclats.forEach(function (s) { deplace += Math.abs(s.x - s._x0) + Math.abs(s.y - s._y0); });
            window.__trace.push({ n: n, style: this._cpStyle, trans: !!tr, filtre: !!(tr && tr._torsion), angle: tr && tr._torsion ? tr._torsion.uniforms.angle : 0,
                rot: tr && tr._photo ? tr._photo.rotation : 0, eclats: tr && tr._eclats ? Math.round(deplace / tr._eclats.length) : 0,
                zoom: $gameScreen.zoomScale(), bgm: AudioManager._currentBgm ? AudioManager._currentBgm.name : '', fondu: this._fadeDuration > 0 && this._fadeSign < 0,
                fond: !!SceneManager.backgroundBitmap(), ms: Math.round(performance.now() - t0) });
        };
    });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1200);
    var rendu = await ev(function () { return Graphics.isWebGL() ? 'webgl' : 'canvas'; });
    console.log('\nCOMBATPLUS · rendu ' + rendu.toUpperCase());
    V('le moteur tourne bien en ' + mode, rendu === mode, rendu);
    var carte = await page.screenshot();

    // en images de jeu, pas en millisecondes : en WebGL logiciel, le jeu rame
    async function images(n) { var f0 = await ev(function () { return Graphics.frameCount; }); await page.waitForFunction(function (f) { return Graphics.frameCount >= f; }, f0 + n, { timeout: 120000 }); }
    async function combat(troupe, capture) {
        await ev(function (t) { window.__trace = []; BattleManager.setup(t, true, true); $gamePlayer.makeEncounterCount(); SceneManager.push(Scene_Battle); }, troupe);
        var img = null;
        if (capture) {
            await page.waitForFunction(function () { return window.__trace.length >= 20; }, null, { timeout: 20000 }).catch(function () {});
            img = await page.screenshot({ path: path.join(CAP, mode + '_' + capture) });
        }
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && BattleManager._phase && !SceneManager.isSceneChanging(); }, null, { timeout: 40000 }).catch(function () {});
        await page.waitForTimeout(800);
        var r = await ev(function () { return { trace: window.__trace.slice(), scene: SceneManager._scene.constructor.name, bgmCombat: $gameSystem.battleBgm().name }; });
        r.img = img;
        return r;
    }
    async function retour() {
        // un boss a souvent un dialogue d'entrée : on le passe avant de quitter
        for (var z = 0; z < 40 && (await ev(function () { return $gameMessage.isBusy(); })); z++) { await page.keyboard.press('Enter'); await images(6); }
        await ev(function () { $gameTroop._interpreter.clear(); BattleManager.processAbort(); });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging() && SceneManager._scene.isReady(); }, null, { timeout: 30000 }).catch(function () {});
        await page.waitForTimeout(800);
        var sc = await ev(function () { return { s: SceneManager._scene.constructor.name, phase: BattleManager._phase, msg: $gameMessage.isBusy(), ev: $gameTroop.isEventRunning(), occupe: SceneManager._scene.isBusy && SceneManager._scene.isBusy(), bm: BattleManager.isBusy() }; });
        if (sc.s !== 'Scene_Map') console.log('   (retour sur la carte manqué : ' + JSON.stringify(sc) + ')');
    }
    async function commande(t) { await ev(function (t) { $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: [t] }, { code: 0, indent: 0, parameters: [] }], 0); }, t); await page.waitForTimeout(300); }
    function a(trace, n) { return trace.filter(function (x) { return x.n === n; })[0] || {}; }

    console.log('\n── ① la transition ──');
    var c1 = await combat(NORMALE, 'transition_tourbillon.png');
    var t = c1.trace, m = a(t, 20), fin = a(t, 50);
    V('par défaut : tourbillon, l\'effet naît à n = 2', a(t, 1).trans === false && a(t, 2).trans && m.style === 'tourbillon', 'style ' + m.style + (m.filtre ? ', torsion WebGL' : ', repli sans filtre'));
    V('l\'écran s\'enroule de plus en plus', m.filtre ? (a(t, 10).angle < m.angle && m.angle < fin.angle) : (a(t, 10).rot < m.rot && m.rot < fin.rot),
        m.filtre ? 'angle ' + [a(t, 10).angle, m.angle, fin.angle].map(function (x) { return x.toFixed(2); }).join(' → ') : '');
    V('la musique de combat et le fondu partent à n = 30, comme dans MV', a(t, 29).bgm !== c1.bgmCombat && a(t, 30).bgm === c1.bgmCombat && !a(t, 29).fondu && a(t, 30).fondu, 'musique « ' + a(t, 30).bgm + ' »');
    V('la photo floutée du fond de combat est prise, le zoom de MV n\'est pas joué', a(t, 2).fond && t.every(function (x) { return x.zoom === 1; }), '');
    V('le combat s\'ouvre', c1.scene === 'Scene_Battle', 'image la plus lente de la transition : ' + Math.max.apply(null, t.map(function (x) { return x.ms; })) + ' ms');
    var px1 = await pixels(c1.img, carte);
    V('à l\'écran : la carte tourbillonne (image changée, pas un écran uni)', px1.contraste > 12 && px1.ecart > 8, JSON.stringify(px1));
    await retour();

    await commande('TRANSITION eclats');
    var c2 = await combat(NORMALE, 'transition_eclats.png');
    t = c2.trace;
    V('« TRANSITION eclats » : l\'écran se brise, les morceaux partent', a(t, 20).style === 'eclats' && a(t, 6).eclats <= 2 && a(t, 30).eclats > 40, 'déplacement moyen des éclats : n=6 ' + a(t, 6).eclats + ' px · n=30 ' + a(t, 30).eclats + ' px');
    var px2 = await pixels(c2.img, carte);
    V('à l\'écran : des morceaux de carte sur du noir', px2.contraste > 12 && px2.ecart > 8, JSON.stringify(px2));
    await retour();
    if (mode === 'canvas') {
        V('aucune erreur JavaScript (canvas)', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
        await page.close(); continue;
    }
    var c3 = await combat(NORMALE);
    V('contre-épreuve : le combat suivant revient au tourbillon (la commande vaut une fois)', a(c3.trace, 20).style === 'tourbillon', a(c3.trace, 20).style);

    console.log('\n── ② la jauge ──');
    var info = function () {
        return ev(function () {
            // dans l'ordre de la TROUPE (les sprites, eux, sont triés de haut en bas)
            return $gameTroop.members().map(function (b) {
                var j = CombatPlus.jauges().filter(function (j) { return j._cible._enemy === b; })[0], s = j._cible;
                return { op: Math.round(j.opacity), x: j.x + j.bitmap.width / 2, y: j.y, sx: s.x, sy: s.y, aff: j._affiche, taux: b.hpRate(), rot: s.rotation, nom: b.name() };
            });
        });
    };
    await images(30);
    var j0 = await info();
    V('deux ennemis, deux jauges, invisibles au repos', j0.length === 2 && j0.every(function (j) { return j.op === 0; }), j0.map(function (j) { return j.nom + ' ' + j.op; }).join(' · '));
    await ev(function () { $gameTroop.members()[0].select(); });
    await images(30);
    var j1 = await info();
    var statut = await ev(function () { var w = SceneManager._scene._statusWindow; return w && w.visible && w.isOpen() ? w.y : 624; });
    V('visé : sa jauge apparaît, pas celle du voisin', j1[0].op === 255 && j1[1].op === 0, j1.map(function (j) { return j.op; }).join(' / '));
    V('… à ses pieds, centrée sur lui, sans mordre sur la fenêtre d\'état', Math.abs(j1[0].y - j1[0].sy) <= 20 && j1[0].y + 11 <= statut && Math.abs(j1[0].x - j1[0].sx) <= 3,
        'jauge ' + Math.round(j1[0].x) + ',' + j1[0].y + ' · pieds ' + Math.round(j1[0].sx) + ',' + Math.round(j1[0].sy) + ' · fenêtre d\'état en y=' + statut);
    await ev(function () { $gameTroop.members()[0].deselect(); });
    await images(30);
    V('contre-épreuve : plus visé, elle s\'efface', (await info())[0].op === 0, '');
    await ev(function () { var e = $gameTroop.members()[1]; e.gainHp(-Math.floor(e.mhp * 0.3)); });
    await images(8);
    var j2 = await info();
    await page.screenshot({ path: path.join(CAP, 'jauge_ennemie.png') });
    V('touché : sa jauge apparaît, avec la trace dorée de ce qu\'il a perdu', j2[1].op > 200 && j2[1].aff > j2[1].taux + 0.1, 'PV ' + Math.round(j2[1].taux * 100) + ' %, trace ' + Math.round(j2[1].aff * 100) + ' %');
    await images(200);
    var j3 = await info();
    V('… puis la trace rejoint les PV, et la jauge s\'efface', j3[1].op === 0 && Math.abs(j3[1].aff - j3[1].taux) < 0.001, 'opacité ' + j3[1].op);

    console.log('\n── ③ les exceptions ──');
    await ev(function () { var e = $gameTroop.members()[1]; e.enemy().meta['Sans jauge'] = true; e.select(); });
    await images(30);
    var j4 = await info();
    await ev(function () { var e = $gameTroop.members()[1]; delete e.enemy().meta['Sans jauge']; });
    await images(30);
    var j5 = await info();
    await ev(function () { $gameTroop.members()[1].deselect(); });
    V('<Sans jauge> : visé, toujours rien ; la note retirée, la jauge revient', j4[1].op === 0 && j5[1].op === 255, j4[1].op + ' puis ' + j5[1].op);

    console.log('\n── ④ vaciller ──');
    async function rotations() {
        var r = [];
        for (var i = 0; i < 12; i++) { r.push((await info()).map(function (j) { return j.rot; })); await images(3); }
        return r;
    }
    await ev(function () { var e = $gameTroop.members()[0]; e.setHp(Math.max(1, Math.floor(e.mhp * 0.2))); });
    var r1 = await rotations();
    var amp0 = Math.max.apply(null, r1.map(function (x) { return Math.abs(x[0]); })), amp1 = Math.max.apply(null, r1.map(function (x) { return Math.abs(x[1]); }));
    var bouge = r1.some(function (x) { return Math.abs(x[0] - r1[0][0]) > 0.002; });
    V('à 20 % de PV : il vacille', amp0 > 0.004 && bouge, 'jusqu\'à ' + (amp0 * 180 / Math.PI).toFixed(1) + '°');
    V('contre-épreuve : le voisin, à 70 %, ne bouge pas', amp1 === 0, (amp1 * 180 / Math.PI).toFixed(2) + '°');
    await page.screenshot({ path: path.join(CAP, 'ennemi_qui_vacille.png') });
    await ev(function () { var e = $gameTroop.members()[0]; e.setHp(e.mhp); });
    await images(2);
    V('contre-épreuve : soigné, il se redresse net', (await info())[0].rot === 0, '');
    await retour();

    console.log('\n── le boss ──');
    var c4 = await combat(BOSS, 'transition_boss.png');
    V('un boss : les éclats, sans rien demander', a(c4.trace, 20).style === 'eclats', a(c4.trace, 20).style);
    await images(60);
    await ev(function () { $gameTroop.members()[0].select(); });
    await images(30);
    var jb = await ev(function () { var j = CombatPlus.jauges()[0], s = SceneManager._scene; return { op: Math.round(j.opacity), barre: !!(s._barreBoss && s._barreBoss._boss === j._cible._enemy) }; });
    V('le boss a sa grande barre : pas de seconde jauge sous ses pieds', jb.barre && jb.op === 0, 'grande barre ' + (jb.barre ? 'oui' : 'non') + ', jauge ' + jb.op);
    var jb2 = await ev(function () {
        var s = SceneManager._scene, b = s._barreBoss, f = Graphics.frameCount; s._barreBoss = null;
        return new Promise(function (ok) { (function attendre() { if (Graphics.frameCount < f + 30) return requestAnimationFrame(attendre); var o = Math.round(CombatPlus.jauges()[0].opacity); s._barreBoss = b; ok(o); })(); });
    });
    V('contre-épreuve : sans la grande barre, sa jauge revient', jb2 === 255, 'jauge ' + jb2);
    await ev(function () { $gameTroop.members()[0].deselect(); });
    await retour();

    await commande('TRANSITION mv toujours');
    var c5 = await combat(NORMALE);
    var zmax = Math.max.apply(null, c5.trace.map(function (x) { return x.zoom; }));
    V('« TRANSITION mv toujours » : le zoom d\'origine de MV, sans effet maison', c5.trace.every(function (x) { return !x.trans; }) && zmax > 1.5, 'zoom jusqu\'à ×' + zmax.toFixed(1) + ' · image de la photo : MV seul ' + a(c5.trace, 2).ms + ' ms, tourbillon ' + a(c1.trace, 2).ms + ' ms');
    await retour();
    await commande('TRANSITION défaut');
    var s6 = await ev(function () { $gameTroop.setup(2); return CombatPlus.styleDuProchainCombat(); });
    V('« TRANSITION défaut » : retour au réglage du plugin', s6 === 'tourbillon', s6);
    V('aucune erreur JavaScript (' + mode + ')', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    await page.close();
  }

    console.log('\n── le bilan ──');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
