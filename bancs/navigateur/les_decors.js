/*
 * DECORSLIBRES, DANS LE VRAI MOTEUR
 * ---------------------------------------------------------------------------
 *   ① les décors de data/Decors.json s'affichent sur LEUR carte, au pixel,
 *     sur la bonne couche, les animés défilent ; celui d'une autre carte
 *     n'apparaît pas (contre-épreuve)
 *   ② hors test, Ctrl+D n'ouvre rien (contre-épreuve)
 *   ③ en test : Ctrl+D ouvre le panneau ; une image cliquée puis un clic sur
 *     la carte pose le décor là où est la souris (sans faire marcher le
 *     joueur) ; clic droit l'enlève ; « Annuler » retire le dernier ;
 *     « Enregistrer » donne le texte de data/Decors.json (pas de disque ici)
 *
 *   node bancs/navigateur/les_decors.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    var erreurs = [];
    async function ouvrir(test) {
        var page = await nav.newPage({ viewport: { width: 1120, height: 700 } });
        page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
        await page.goto(BASE + '/index.html' + (test ? '?test' : ''), { waitUntil: 'load' });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
        await page.evaluate(function () { DataManager.setupNewGame(); $gameSystem._meteo = { force: 'clair' }; $gamePlayer.reserveTransfer(29, 10, 10, 2, 0); SceneManager.goto(Scene_Map); });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }, null, { timeout: 60000 });
        await page.waitForTimeout(800);
        return page;
    }
    console.log('DECORSLIBRES');

    console.log('\n── ② hors test ──');
    var p0 = await ouvrir(false);
    await p0.keyboard.down('Control'); await p0.keyboard.press('d'); await p0.keyboard.up('Control');
    await p0.waitForTimeout(300);
    var h = await p0.evaluate(function () { return { ouvert: DecorsLibres.ouvert, panneau: !!document.getElementById('decors-libres'), index: DecorsLibres.index.length }; });
    V('hors test, Ctrl+D n\'ouvre rien (l\'éditeur n\'existe que pour JOKO)', !h.ouvert && !h.panneau, JSON.stringify(h));
    await p0.close();

    var page = await ouvrir(true);
    var ev = function (f, a) { return page.evaluate(f, a); };

    console.log('\n── ① l\'affichage ──');
    await ev(function () {
        var px = $gamePlayer.x * 48 + 24, py = $gamePlayer.y * 48 + 48;
        DecorsLibres.donnees['29'] = [{ image: 'Beds/Bed A', x: px + 96, y: py, couche: 'personnages' },
            { image: 'Light/Animated/Campfire A [3x1]', x: px - 96, y: py, couche: 'sol', echelle: 150 }];
        DecorsLibres.donnees['30'] = [{ image: 'Beds/Bed B', x: px, y: py, couche: 'dessus' }];
        $gamePlayer.reserveTransfer(29, $gamePlayer.x, $gamePlayer.y, 2, 2);
    });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }, null, { timeout: 60000 });
    await page.waitForTimeout(800);
    var aff = await ev(function () {
        var ss = SceneManager._scene._spriteset;
        return ss._decors.map(function (s) {
            return { img: s._decor.image, z: s.z, dx: s.x - (s._decor.x - $gameMap.displayX() * 48), dy: s.y - (s._decor.y - $gameMap.displayY() * 48), cadre: s._frame.width, dansLaCarte: ss._tilemap.children.indexOf(s) >= 0, echelle: s.scale.x };
        });
    });
    var f1 = await ev(function () { return SceneManager._scene._spriteset._decors[1]._frame.x; });
    await page.waitForTimeout(700);
    var f2 = await ev(function () { return SceneManager._scene._spriteset._decors[1]._frame.x; });
    V('deux décors sur la carte 29, au pixel près, dans la carte', aff.length === 2 && aff.every(function (a) { return a.dx === 0 && a.dy === 0 && a.dansLaCarte; }), JSON.stringify(aff.map(function (a) { return a.img + ' z' + a.z; })));
    V('couches : « personnages » z 3, « sol » z 1 ; taille 150 %', aff[0].z === 3 && aff[1].z === 1 && aff[1].echelle === 1.5, '');
    V('le feu de camp [3x1] est découpé en 3 et défile', aff[1].cadre === 48 && f1 !== f2, 'case x ' + f1 + ' → ' + f2);
    V('contre-épreuve : le lit de la carte 30 n\'est pas sur la carte 29', !aff.some(function (a) { return a.img === 'Beds/Bed B'; }), '');

    console.log('\n── ③ l\'éditeur, en test ──');
    await page.keyboard.down('Control'); await page.keyboard.press('d'); await page.keyboard.up('Control');
    await page.waitForTimeout(400);
    var o = await ev(function () { var p = document.getElementById('decors-libres'); return { ouvert: DecorsLibres.ouvert, visible: !!p && p.style.display !== 'none', vignettes: p ? p.querySelectorAll('#dl-grille img').length : 0 }; });
    V('Ctrl+D ouvre le panneau, avec ses vignettes', o.ouvert && o.visible && o.vignettes > 50, JSON.stringify(o));
    await page.fill('#dl-filtre', 'barrel');
    await page.waitForTimeout(200);
    var nomChoisi = await page.$eval('#dl-grille img', function (i) { return i.dataset.nom; });
    await page.click('#dl-grille img');
    async function pageXY(cx, cy) { return ev(function (a) { var r = Graphics._canvas.getBoundingClientRect(); return { x: r.left + a.x * r.width / Graphics.width, y: r.top + a.y * r.height / Graphics.height }; }, { x: cx, y: cy }); }
    var n0 = await ev(function () { return DecorsLibres.deLaCarte(29).length; });
    if (process.env.SONDE) console.log('SONDE', JSON.stringify(await ev(function (a) { var r = Graphics._canvas.getBoundingClientRect(); var x = r.left + 300 * r.width / Graphics.width, y = r.top + 250 * r.height / Graphics.height; var el = document.elementFromPoint(x, y); return { choix: DecorsLibres.etat.choix, el: el && (el.tagName + '#' + el.id), r: [r.left, r.top, r.width, r.height], scene: SceneManager._scene.constructor.name }; })));
    var cible = { x: 300, y: 250 }, pt = await pageXY(cible.x, cible.y);
    await page.mouse.move(pt.x, pt.y); await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
    await page.waitForTimeout(400);
    var pose = await ev(function (c) {
        var l = DecorsLibres.deLaCarte(29), d = l[l.length - 1];
        return { n: l.length, d: d, attendu: { x: Math.round(c.x + $gameMap.displayX() * 48), y: Math.round(c.y + $gameMap.displayY() * 48) }, sprite: SceneManager._scene._spriteset._decors.some(function (s) { return s._decor === d; }), dest: $gameTemp.isDestinationValid() };
    }, cible);
    V('« ' + nomChoisi + ' » cliqué, puis un clic sur la carte : posé sous la souris, et affiché', pose.n === n0 + 1 && pose.d.image === nomChoisi && Math.abs(pose.d.x - pose.attendu.x) <= 1 && Math.abs(pose.d.y - pose.attendu.y) <= 1 && pose.sprite, JSON.stringify(pose.d) + ' attendu ' + JSON.stringify(pose.attendu));
    V('… et le joueur n\'est pas parti marcher', !pose.dest, '');
    await page.waitForTimeout(300);
    if (process.env.SONDE) console.log('SONDE2', JSON.stringify(await ev(function () { return { scene: SceneManager._scene.constructor.name, transfert: $gamePlayer.isTransferring(), carte: $gameMap.mapId(), suivante: SceneManager._nextScene && SceneManager._nextScene.constructor.name }; })));
    var haut = await ev(function () { var ss = SceneManager._scene._spriteset, d = DecorsLibres.deLaCarte(29).slice(-1)[0]; var s = ss._decors.filter(function (x) { return x._decor === d; })[0]; var b = s.getBounds(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
    var pt2 = await pageXY(haut.x, haut.y);
    await page.mouse.click(pt2.x, pt2.y, { button: 'right' });
    await page.waitForTimeout(300);
    var n2 = await ev(function () { var sc = SceneManager._scene; return { n: DecorsLibres.deLaCarte(29).length, sprites: sc._spriteset ? sc._spriteset._decors.length : -1, scene: sc.constructor.name }; });
    V('clic droit sur le décor : il est enlevé (données et image), et le menu ne s\'ouvre pas', n2.n === n0 && n2.sprites === 2 && n2.scene === 'Scene_Map', JSON.stringify(n2));
    await page.mouse.move(pt.x, pt.y); await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
    await page.waitForTimeout(300);
    await page.click('#dl-annuler');
    await page.waitForTimeout(200);
    var n3 = await ev(function () { return DecorsLibres.deLaCarte(29).length; });
    V('« Annuler » retire le dernier posé', n3 === n0, n3 + ' décor(s)');
    await page.mouse.move(pt.x, pt.y); await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
    await page.waitForTimeout(300);
    await page.click('#dl-enregistrer');
    await page.waitForTimeout(200);
    var en = await ev(function () { var t = document.getElementById('dl-texte'); var j = JSON.parse(t.value); return { visible: t.style.display !== 'none', n29: (j['29'] || []).length, n30: (j['30'] || []).length }; });
    V('« Enregistrer » sans disque : le texte complet de data/Decors.json (carte 29 et carte 30)', en.visible && en.n29 === n0 + 1 && en.n30 === 1, JSON.stringify(en));
    await page.keyboard.down('Control'); await page.keyboard.press('d'); await page.keyboard.up('Control');
    await page.waitForTimeout(300);
    V('Ctrl+D referme le panneau', !(await ev(function () { return DecorsLibres.ouvert; })), '');

    console.log('\n── le bilan ──');
    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
