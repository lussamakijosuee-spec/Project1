/*
 * DIALOGUESPLUS, DANS LE VRAI MOTEUR
 * ---------------------------------------------------------------------------
 *   ① un choix <si: …> faux disparaît, vrai il revient (contre-épreuve) ;
 *   ② un choix <grisé: …> est visible mais refuse d'être pris (buzzer) ;
 *   ③ deux « Afficher des choix » à la suite : une seule liste de 8, et le
 *     7e choix mène bien à SA branche dans le 2e bloc (et pas ailleurs) ;
 *   ④ \bulle[n] : la fenêtre se pose au-dessus de l'événement n, à sa taille ;
 *     le message suivant, sans bulle, retrouve sa place (contre-épreuve) ;
 *   ⑤ \m[ves] devient le nom de Vesper.
 *
 *   node bancs/navigateur/les_dialogues_plus.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    var ev = function (f, a) { return page.evaluate(f, a); };
    async function touche(k) { await page.keyboard.down(k); await page.waitForTimeout(80); await page.keyboard.up(k); await page.waitForTimeout(150); }

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    await ev(function () { DataManager.setupNewGame(); $gameSystem._meteo = { force: 'clair' }; $gamePlayer.reserveTransfer(29, 10, 10, 2, 0); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1200);

    function choix(blocs) {   // une liste d'événement : des blocs de choix qui se suivent, chaque branche pose window.__b
        var l = [];
        blocs.forEach(function (b, k) {
            l.push({ code: 102, indent: 0, parameters: [b, -1, 0, 2, 0] });
            b.forEach(function (t, i) {
                l.push({ code: 402, indent: 0, parameters: [i, t] });
                l.push({ code: 355, indent: 1, parameters: ['window.__b = "' + k + ':' + i + '"'] });
                l.push({ code: 0, indent: 1, parameters: [] });
            });
            l.push({ code: 404, indent: 0, parameters: [] });
        });
        l.push({ code: 355, indent: 0, parameters: ['window.__fin = true'] });
        l.push({ code: 0, indent: 0, parameters: [] });
        return l;
    }
    async function poser(blocs) {
        await ev(function (l) { window.__b = null; window.__fin = false; $gameMap._interpreter.setup(l, 0); }, choix(blocs));
        await page.waitForFunction(function () { var w = SceneManager._scene._messageWindow._choiceWindow; return w.active && w.isOpen(); }, null, { timeout: 10000 }).catch(function () {});
        await page.waitForTimeout(200);
        return ev(function () { var w = SceneManager._scene._messageWindow._choiceWindow; return w._list.map(function (c) { return (c.enabled ? '' : '(grisé) ') + c.name; }); });
    }
    async function prendre(i) {
        await ev(function (i) { SceneManager._scene._messageWindow._choiceWindow.select(i); }, i);
        await touche('Enter');
        await page.waitForTimeout(400);
        return ev(function () { return { b: window.__b, fin: window.__fin, ouvert: SceneManager._scene._messageWindow._choiceWindow.active }; });
    }

    console.log('DIALOGUESPLUS');
    console.log('\n── ① et ② les conditions ──');
    await ev(function () { $gameSwitches.setValue(12, false); $gameParty.loseGold(999999); });
    var l1 = await poser([['Bonjour', 'Parler de la lettre <si: s[12]>', 'Payer 500 or <grisé: $gameParty.gold() < 500>', 'Au revoir']]);
    V('<si: s[12]> faux : le choix n\'apparaît pas', l1.indexOf('Parler de la lettre') < 0 && l1.length === 3, l1.join(' | '));
    V('<grisé: …> vrai : visible mais grisé, et sans la balise', l1.indexOf('(grisé) Payer 500 or') >= 0, '');
    var r1 = await prendre(1);   // le grisé (2e visible)
    V('un choix grisé ne se prend pas', r1.ouvert && !r1.b, r1.b ? 'pris : ' + r1.b : 'toujours ouvert');
    var r2 = await prendre(2);   // « Au revoir » : 3e visible = 4e d'origine
    V('« Au revoir » (3e visible) mène à SA branche (4e de l\'éditeur)', r2.b === '0:3' && r2.fin, 'branche ' + r2.b);
    await ev(function () { $gameSwitches.setValue(12, true); $gameParty.gainGold(1000); });
    var l2 = await poser([['Bonjour', 'Parler de la lettre <si: s[12]>', 'Payer 500 or <grisé: $gameParty.gold() < 500>', 'Au revoir']]);
    V('contre-épreuve : interrupteur ON et 1000 or, les quatre choix, aucun grisé', l2.length === 4 && l2.join('|').indexOf('(grisé)') < 0, l2.join(' | '));
    var r3 = await prendre(1);
    V('… et la lettre mène à sa branche', r3.b === '0:1', 'branche ' + r3.b);

    console.log('\n── ③ plus de 6 choix ──');
    var l3 = await poser([['A1', 'A2', 'A3', 'A4', 'A5', 'A6'], ['B1', 'B2']]);
    V('deux blocs à la suite : une seule liste de 8', l3.length === 8 && l3[6] === 'B1', l3.join(' '));
    var r4 = await prendre(6);
    V('le 7e (B1) mène à la 1re branche du 2e bloc, aucune autre ne s\'exécute', r4.b === '1:0' && r4.fin, 'branche ' + r4.b);
    await poser([['A1', 'A2', 'A3', 'A4', 'A5', 'A6'], ['B1', 'B2']]);
    var r5 = await prendre(2);
    V('contre-épreuve : le 3e (A3) mène au 1er bloc, le 2e bloc ne s\'ouvre pas', r5.b === '0:2' && r5.fin, 'branche ' + r5.b);

    console.log('\n── ④ la bulle ──');
    var cible = await ev(function () { var e = $gameMap.events().filter(function (e) { return e.characterName() && e.screenY() > 150 && e.screenY() < 600 && e.screenX() > 100 && e.screenX() < 700; })[0]; return e ? { id: e.eventId(), x: e.screenX(), y: e.screenY() } : null; });
    await ev(function (id) { $gameMap._interpreter.setup([{ code: 101, indent: 0, parameters: ['', 0, 0, 2] }, { code: 401, indent: 0, parameters: ['\\bulle[' + id + ']Tu es enfin là.'] },
        { code: 101, indent: 0, parameters: ['', 0, 0, 2] }, { code: 401, indent: 0, parameters: ['Et maintenant, sans bulle.'] }, { code: 0, indent: 0, parameters: [] }], 0); }, cible.id);
    await page.waitForTimeout(1200);
    var b1 = await ev(function () { var w = SceneManager._scene._messageWindow; return { x: w.x, y: w.y, w: w.width, h: w.height }; });
    await page.screenshot({ path: require('path').join(__dirname, 'captures', 'dialogues_bulle.png') });
    var auDessus = b1.y + b1.h <= cible.y && b1.x <= cible.x && b1.x + b1.w >= cible.x;
    V('la bulle se pose au-dessus de l\'événement ' + cible.id + ', à la taille du texte', auDessus && b1.w < 500, 'fenêtre ' + b1.w + '×' + b1.h + ' en ' + b1.x + ',' + b1.y + ' · personnage en ' + cible.x + ',' + cible.y);
    await page.waitForFunction(function () { var w = SceneManager._scene._messageWindow; return w.pause && w._waitCount <= 0; }, null, { timeout: 8000 }).catch(function () {});
    await touche('Enter'); await page.waitForTimeout(1200);
    var b2 = await ev(function () { var w = SceneManager._scene._messageWindow; return { x: w.x, y: w.y, w: w.width, texte: $gameMessage.allText() }; });
    V('contre-épreuve : le message suivant retrouve sa place et sa largeur', b2.w === 816 && b2.x === 0 && /sans bulle/.test(b2.texte), 'fenêtre ' + b2.w + ' de large en ' + b2.x + ',' + b2.y);
    await page.waitForFunction(function () { var w = SceneManager._scene._messageWindow; return w.pause && w._waitCount <= 0; }, null, { timeout: 8000 }).catch(function () {});
    await touche('Enter'); await page.waitForTimeout(600);

    console.log('\n── ⑤ les macros ──');
    var m = await ev(function () { var w = new Window_Base(0, 0, 400, 100); return w.convertEscapeCharacters('Bonjour \\m[ves] et \\m[inconnue]').replace(/\x1b/g, '\\'); });
    V('\\m[ves] devient le nom de Vesper en couleur ; une clé inconnue reste telle quelle', /\\C\[2\]Vesper\\C\[0\]/i.test(m) && /\\m\[inconnue\]/.test(m), m);

    console.log('\n── le bilan ──');
    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
