/*
 * INTERFACEPLUS, DANS LE VRAI MOTEUR
 * ---------------------------------------------------------------------------
 *   ① TOUCHE M n : la touche M lance l'événement commun n ; une touche non
 *     liée ne fait rien ; « TOUCHE M off » délie (contre-épreuves)
 *   ② IMAGE clic : un clic SUR l'image lance l'événement commun (et le
 *     joueur ne part pas marcher vers le clic) ; à côté, rien
 *   ③ MENU_EC : la liste montre les noms, cache celui dont la condition
 *     <si: …> est fausse ; le choix est joué puis l'événement reprend ;
 *     Échap ne joue rien et l'événement reprend aussi
 *
 *   node bancs/navigateur/les_interfaces_plus.js
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    var ev = function (f, a) { return page.evaluate(f, a); };
    async function touche(k) { await page.keyboard.down(k); await page.waitForTimeout(80); await page.keyboard.up(k); await page.waitForTimeout(200); }
    async function commande(t) { await ev(function (t) { $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: [t] }, { code: 0, indent: 0, parameters: [] }], 0); }, t); await page.waitForTimeout(300); }

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    await ev(function () {
        DataManager.setupNewGame(); $gameSystem._meteo = { force: 'clair' }; $gamePlayer.reserveTransfer(29, 10, 10, 2, 0); SceneManager.goto(Scene_Map);
        // trois événements communs d'essai, en fin de base
        window.__ec = [];
        function ce(nom, marque, extra) {
            var id = $dataCommonEvents.length;
            $dataCommonEvents.push({ id: id, name: nom, switchId: 1, trigger: 0, list: (extra || []).concat([{ code: 355, indent: 0, parameters: ['window.__ec.push("' + marque + '")'] }, { code: 0, indent: 0, parameters: [] }]) });
            return id;
        }
        window.__ids = { a: ce('✎ Voyage · Le port', 'port', [{ code: 108, indent: 0, parameters: ['Rejoindre le port en barque.'] }]),
            b: ce('✎ Voyage · La montagne', 'montagne'),
            c: ce('✎ Voyage · Le sanctuaire', 'sanctuaire', [{ code: 108, indent: 0, parameters: ['<si: s[30]> Débloqué plus tard.'] }]) };
    });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1200);
    var ids = await ev(function () { return window.__ids; });
    console.log('INTERFACEPLUS');

    console.log('\n── ① les touches ──');
    await commande('TOUCHE M ' + ids.a);
    await touche('m'); await page.waitForTimeout(500);
    var t1 = await ev(function () { return window.__ec.slice(); });
    await touche('k'); await page.waitForTimeout(400);
    var t2 = await ev(function () { return window.__ec.slice(); });
    await commande('TOUCHE M off');
    await touche('m'); await page.waitForTimeout(400);
    var t3 = await ev(function () { return window.__ec.slice(); });
    V('TOUCHE M : M lance l\'événement commun', t1.join() === 'port', JSON.stringify(t1));
    V('contre-épreuve : K, non liée, ne lance rien', t2.join() === 'port', JSON.stringify(t2));
    V('contre-épreuve : « TOUCHE M off », M ne lance plus rien', t3.join() === 'port', JSON.stringify(t3));

    console.log('\n── ② l\'image cliquable ──');
    var img = fs.readdirSync(path.join(__dirname, '..', '..', 'img', 'pictures')).filter(function (f) { return /\.png$/.test(f); })[0].replace(/\.png$/, '');
    await ev(function (a) {
        window.__ec.length = 0;
        $gameScreen.showPicture(5, a.img, 0, 300, 200, 25, 25, 255, 0);   // réduite : l'image entière tient à l'écran
        $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['IMAGE clic 5 ' + a.id] }, { code: 0, indent: 0, parameters: [] }], 0);
    }, { img: img, id: ids.b });
    await page.waitForTimeout(800);
    var bornes = await ev(function () { var c = SceneManager._scene._spriteset._pictureContainer.children.filter(function (s) { return s._pictureId === 5; })[0]; var b = c.getBounds(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
    await page.mouse.click(bornes.x + bornes.w / 2, bornes.y + bornes.h / 2);
    await page.waitForTimeout(600);
    var c1 = await ev(function () { return { ec: window.__ec.slice(), dest: $gameTemp.isDestinationValid(), reserve: $gameTemp._commonEventId, courant: $gameMap.isEventRunning() }; });
    await page.mouse.click(Math.min(800, bornes.x + bornes.w + 60), Math.min(600, bornes.y + bornes.h + 60));
    await page.waitForTimeout(600);
    var c2 = await ev(function () { return window.__ec.slice(); });
    V('un clic SUR l\'image (« ' + img + ' ») lance l\'événement commun, sans faire marcher le joueur', c1.ec.join() === 'montagne' && !c1.dest, JSON.stringify(c1));
    V('contre-épreuve : un clic à côté ne lance rien', c2.join() === 'montagne', JSON.stringify(c2));
    await ev(function () { $gameScreen.erasePicture(5); $gameTemp.clearDestination(); });

    console.log('\n── ③ le menu d\'événements communs ──');
    async function menu(sw30) {
        await ev(function (a) {
            var ids = a.ids;
            window.__ec.length = 0; $gameSwitches.setValue(30, !!a.sw);
            $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['MENU_EC ' + ids.a + ' ' + ids.b + ' ' + ids.c] }, { code: 355, indent: 0, parameters: ['window.__ec.push("après")'] }, { code: 0, indent: 0, parameters: [] }], 0);
        }, { ids: ids, sw: sw30 });
        await page.waitForTimeout(800);
        return ev(function () { var m = $gameMap._interpreter._ipMenu; return m ? { noms: m.w._list.map(function (c) { return c.name; }), aide: m.h._text } : null; });
    }
    var m1 = await menu();
    await page.screenshot({ path: path.join(__dirname, 'captures', 'menu_evenements_communs.png') });
    V('le menu montre les noms, sans le sanctuaire verrouillé (<si: s[30]>, interrupteur OFF)', m1 && m1.noms.join('|') === 'Le port|La montagne', m1 && m1.noms.join(' | '));
    V('le premier commentaire sert d\'aide', m1 && /Rejoindre le port/.test(m1.aide), m1 && m1.aide);
    await touche('ArrowDown'); await touche('Enter'); await page.waitForTimeout(700);
    var r1 = await ev(function () { return window.__ec.slice(); });
    V('choisir « La montagne » la joue, puis l\'événement reprend', r1.join() === 'montagne,après', JSON.stringify(r1));
    await menu();
    await touche('Escape'); await page.waitForTimeout(700);
    var r2 = await ev(function () { return { ec: window.__ec.slice(), scene: SceneManager._scene.constructor.name }; });
    V('contre-épreuve : Échap ne joue rien, l\'événement reprend, le menu principal ne s\'ouvre pas', r2.ec.join() === 'après' && r2.scene === 'Scene_Map', JSON.stringify(r2));
    var m3 = await menu(true);
    V('contre-épreuve : interrupteur 30 ON, le sanctuaire apparaît', m3 && m3.noms.length === 3 && m3.noms[2] === 'Le sanctuaire', m3 && m3.noms.join(' | '));
    await touche('Escape'); await page.waitForTimeout(500);

    console.log('\n── le bilan ──');
    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
