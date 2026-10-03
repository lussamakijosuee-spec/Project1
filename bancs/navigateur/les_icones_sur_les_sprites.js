/*
 * LES CARRÉS NOIRS AU-DESSUS DES ENNEMIS
 * ---------------------------------------------------------------------------
 * IconSet.png fait 8 384 px de haut ; le WebGL de ce Chromium (comme beaucoup
 * de portables) plafonne les textures à 8 192 px et refuse l'image entière :
 * chaque icône posée par un SPRITE sortait en carré noir. Allegement découpe
 * maintenant une image trop haute en pages.
 *   ① en combat, les icônes d'état des ennemis ne sont plus des carrés noirs
 *     (mesuré en PIXELS sur la capture, contre le fond juste à côté)
 *   ② une icône du HAUT de la feuille et une du BAS (au-delà de 8 192 px),
 *     posées en sprite : à l'écran, la même couleur que leur copie de 32 px
 *     posée à côté (même rendu, mêmes filtres du jeu)
 *   ③ contre-épreuve : sans le découpage, l'icône du bas sort noire
 *   ④ en Canvas (pas de plafond), rien n'est découpé
 *
 *   node bancs/navigateur/les_icones_sur_les_sprites.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    var erreurs = [];
    console.log('LES ICÔNES SUR LES SPRITES');

    async function ouvrir(nav, webgl) {
        var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
        page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
        await page.goto(BASE + '/index.html' + (webgl ? '?webgl' : ''), { waitUntil: 'load' });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
        await page.evaluate(function () { DataManager.setupNewGame(); $gameSystem._meteo = { force: 'clair' }; $gamePlayer.reserveTransfer(29, 10, 10, 2, 0); SceneManager.goto(Scene_Map); });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }, null, { timeout: 60000 });
        await page.evaluate(function () { BattleManager.setup(2, true, true); SceneManager.push(Scene_Battle); });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && BattleManager._phase === 'input' && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(800);
        return page;
    }
    // la couleur moyenne (et la part de noir pur) d'un carré de la capture
    async function zone(page, png, x, y, w, h) {
        return page.evaluate(function (a) {
            return new Promise(function (ok) {
                var i = new Image();
                i.onload = function () {
                    var c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
                    var g = c.getContext('2d'); g.drawImage(i, 0, 0);
                    var d = g.getImageData(a.x, a.y, a.w, a.h).data, s = [0, 0, 0], noirs = 0, n = 0;
                    for (var k = 0; k < d.length; k += 4) { s[0] += d[k]; s[1] += d[k + 1]; s[2] += d[k + 2]; if (d[k] + d[k + 1] + d[k + 2] < 6) noirs++; n++; }
                    ok({ moy: s.map(function (v) { return Math.round(v / n); }), noir: Math.round(noirs * 100 / n) });
                };
                i.src = 'data:image/png;base64,' + a.png;
            });
        }, { png: png.toString('base64'), x: x, y: y, w: w, h: h });
    }

    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--no-sandbox', '--mute-audio', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
    var page = await ouvrir(nav, true);
    var info = await page.evaluate(function () { return { webgl: Graphics.isWebGL(), plafond: Allegement.plafondTextures(), haut: ImageManager.loadSystem('IconSet').height }; });
    console.log('\n   rendu ' + (info.webgl ? 'WebGL' : 'Canvas') + ' · textures jusqu\'à ' + info.plafond + ' px · IconSet ' + info.haut + ' px de haut');
    V('le banc tourne bien avec une carte qui plafonne sous la hauteur d\'IconSet', info.webgl && info.plafond > 0 && info.plafond < info.haut, JSON.stringify(info));

    console.log('\n── ① les icônes d\'état des ennemis ──');
    var icones = await page.evaluate(function () {
        var l = [];
        (function voir(o) { if (!o) return; if (o instanceof Sprite_StateIcon && o.worldVisible) { var b = o.getBounds(); l.push({ x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }); } (o.children || []).forEach(voir); })(SceneManager._scene);
        return l;
    });
    var png = await page.screenshot();
    var noirs = [];
    for (var i = 0; i < icones.length; i++) { var z = await zone(page, png, icones[i].x + 4, icones[i].y + 4, 24, 24); noirs.push(z.noir); }
    V(icones.length + ' icône(s) d\'état sur les ennemis : aucune n\'est un carré noir', icones.length > 0 && noirs.every(function (n) { return n < 20; }), 'noir pur : ' + noirs.map(function (n) { return n + ' %'; }).join(', '));

    console.log('\n── ② une icône du haut, une du bas de la feuille ──');
    async function poser(decoupage) {
        return page.evaluate(function (dec) {
            Allegement.decoupage = dec;
            var bm = ImageManager.loadSystem('IconSet'), sc = SceneManager._scene;
            // une icône bien pleine, en haut et au-delà de 8 192 px
            // une icône avec un bloc 6×6 bien opaque : on comparera CE bloc à l'écran
            function pleine(depuis) {
                for (var idx = depuis; idx < depuis + 400; idx++) {
                    var x = (idx % 16) * 32, y = Math.floor(idx / 16) * 32, t = new Bitmap(32, 32); t.blt(bm, x, y, 32, 32, 0, 0);
                    var d = t._context.getImageData(0, 0, 32, 32).data;
                    for (var by = 4; by <= 22; by += 2) for (var bx = 4; bx <= 22; bx += 2) {
                        var s = [0, 0, 0], plein = true;
                        for (var yy = by; yy < by + 6 && plein; yy++) for (var xx = bx; xx < bx + 6; xx++) { var k = (yy * 32 + xx) * 4; if (d[k + 3] < 255) { plein = false; break; } s[0] += d[k]; s[1] += d[k + 1]; s[2] += d[k + 2]; }
                        if (plein && s[0] + s[1] + s[2] > 36 * 150) return { idx: idx, bx: bx, by: by, moy: s.map(function (v) { return Math.round(v / 36); }) };
                    }
                }
                return null;
            }
            var haut = pleine(10), bas = pleine(Math.ceil(8200 / 32) * 16);
            (sc.__essais || []).forEach(function (s) { sc.removeChild(s); });
            // à côté de chacune, la RÉFÉRENCE : la même icône copiée dans une petite
            // image de 32 px (aucun plafond ne la gêne), qui passe par le même rendu
            // (mêmes filtres de couleur du jeu)
            sc.__essais = [];
            [haut, bas].forEach(function (ic, i) {
                var s = new Sprite(bm); s.setFrame((ic.idx % 16) * 32, Math.floor(ic.idx / 16) * 32, 32, 32);
                s.x = 300 + i * 160; s.y = 150; s.scale.x = s.scale.y = 2; sc.addChild(s); sc.__essais.push(s);
                var t = new Bitmap(32, 32); t.blt(bm, (ic.idx % 16) * 32, Math.floor(ic.idx / 16) * 32, 32, 32, 0, 0);
                var r = new Sprite(t); r.x = 380 + i * 160; r.y = 150; r.scale.x = r.scale.y = 2; sc.addChild(r); sc.__essais.push(r);
            });
            return { haut: haut, bas: bas };
        }, decoupage);
    }
    var ic = await poser(true);
    await page.waitForTimeout(400);
    png = await page.screenshot();
    // le bloc opaque, à l'échelle 2, sans ses bords (filtrage)
    function bloc(x, c) { return [x + c.bx * 2 + 2, 150 + c.by * 2 + 2, 8, 8]; }
    async function mesure(b) { return zone(page, png, b[0], b[1], b[2], b[3]); }
    var bh = bloc(300, ic.haut), bb = bloc(460, ic.bas);
    var zh = await mesure(bh), zb = await mesure(bb), rh = await mesure(bloc(380, ic.haut)), rb = await mesure(bloc(540, ic.bas));
    function proche(a, b) { return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) < 30; }
    V('icône ' + ic.haut.idx + ' (haut de la feuille) : la même couleur que sa copie de référence', proche(zh.moy, rh.moy) && rh.noir < 20, JSON.stringify(zh.moy) + ' / référence ' + JSON.stringify(rh.moy));
    V('icône ' + ic.bas.idx + ' (au-delà de 8 192 px) : la même couleur que sa copie, pas du noir', proche(zb.moy, rb.moy) && zb.noir < 20 && rb.noir < 20, JSON.stringify(zb.moy) + ' / référence ' + JSON.stringify(rb.moy) + ' · noir ' + zb.noir + ' %');

    console.log('\n── ③ contre-épreuve : sans le découpage ──');
    await poser(false);
    await page.waitForTimeout(400);
    png = await page.screenshot();
    var zb0 = await zone(page, png, bb[0], bb[1], bb[2], bb[3]);
    V('sans le découpage, la même icône sort en carré noir (le défaut est bien là)', zb0.noir > 80, 'noir ' + zb0.noir + ' % · ' + JSON.stringify(zb0.moy));
    await page.evaluate(function () { Allegement.decoupage = true; });
    await page.close();
    await nav.close();

    console.log('\n── ④ en Canvas ──');
    var nav2 = await chromium.launch({ args: ['--no-sandbox', '--mute-audio', '--disable-gpu', '--disable-webgl'] });
    var p2 = await ouvrir(nav2, false);
    var c = await p2.evaluate(function () { var bm = ImageManager.loadSystem('IconSet'); return { webgl: Graphics.isWebGL(), plafond: Allegement.plafondTextures(), pages: Allegement.pagesDe(bm) }; });
    V('en Canvas : pas de plafond, rien n\'est découpé', !c.webgl && c.plafond === 0 && c.pages === null, JSON.stringify(c));
    await nav2.close();

    console.log('\n── le bilan ──');
    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
