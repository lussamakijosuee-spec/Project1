/*
 * BANC NAVIGATEUR — LE BESTIAIRE ET L'ENCYCLOPÉDIE, OUVERTS POUR DE VRAI
 * ---------------------------------------------------------------------------
 * CE BANC EXISTE PARCE QU'UN PLANTAGE EST PASSÉ.
 *
 * `EnemyBook` et `ItemBook` ont été branchés le 2026-09-20. Le Bestiaire a été
 * vérifié dans le moteur ; l'Encyclopédie, non. Elle plantait à l'ouverture :
 *
 *     TypeError: Cannot read property 'name' of null
 *     at Window_ItemBookIndex.refresh (ItemBook.js:274)
 *
 * LA CAUSE NE SE VOIT PAS DANS `data/`. Les quatre fichiers sont pleins :
 * 2 000 objets, 560 armes, 290 armures, zéro trou. Mais `YEP_ItemCore` rallonge
 * ces tableaux AU DÉMARRAGE avec un réservoir d'emplacements NULS pour ses
 * objets indépendants — mesuré ici : les armes passent de 560 à 3 008 dont
 * 2 440 nuls, les armures de 290 à 3 008 dont 2 710. Les trois boucles de
 * `refresh()` lisaient `.name` sans vérifier l'entrée.
 *
 * D'où la règle que ce banc applique : UN ÉCRAN NE SE VÉRIFIE PAS EN LISANT LES
 * DONNÉES, IL SE VÉRIFIE EN L'OUVRANT. Et quand deux écrans se ressemblent, on
 * ouvre LES DEUX — c'est très exactement l'erreur qui a coûté ce plantage.
 *
 * Il n'est pas automatique : il lui faut Playwright et un serveur.
 *
 *   npx http-server -p 8899 -c-1 .        (dans un autre terminal, à la racine)
 *   node bancs/navigateur/les_livres.js
 */

'use strict';
var { chromium } = require('playwright');
var path = require('path');
var SHOTS = process.env.ETT_CAPTURES || path.join(__dirname, 'captures') + path.sep;
require('fs').mkdirSync(SHOTS, { recursive: true });
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });

    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push('PAGEERROR: ' + e.message); });
    page.on('console', function (m) { if (m.type() === 'error') { erreurs.push('CONSOLE: ' + m.text().slice(0, 160)); } });

    var ok = 0, ko = 0;
    var verifie = function (libelle, condition, detail) {
        if (condition) { ok++; console.log('   OK  ' + libelle + (detail ? '  -- ' + detail : '')); }
        else { ko++; console.log('   KO  ' + libelle + (detail ? '  -- ' + detail : '')); }
    };

    console.log('=== LE BESTIAIRE ET L\'ENCYCLOPEDIE ===\n');
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 120000 });
    await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () {
        return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging();
    }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);

    // ── 1 · le réservoir de YEP_ItemCore, mesuré et pas supposé ──────────────
    console.log('1) Ce que le moteur ajoute aux tableaux');
    var pool = await page.evaluate(function () {
        var nuls = function (a) { var n = 0; for (var i = 1; i < a.length; i++) { if (!a[i]) { n++; } } return n; };
        return {
            objets: $dataItems.length - 1, objetsNuls: nuls($dataItems),
            armes: $dataWeapons.length - 1, armesNulles: nuls($dataWeapons),
            armures: $dataArmors.length - 1, armuresNulles: nuls($dataArmors)
        };
    });
    verifie('les tableaux portent bien des trous nuls en mémoire',
        pool.armesNulles > 0 || pool.armuresNulles > 0 || pool.objetsNuls > 0,
        'objets ' + pool.objets + ' (' + pool.objetsNuls + ' nuls) · armes ' + pool.armes +
        ' (' + pool.armesNulles + ' nuls) · armures ' + pool.armures + ' (' + pool.armuresNulles + ' nuls)');

    // ── 2 · chaque livre, ouvert DEPUIS LE MENU et parcouru ──────────────────
    var parcourir = async function (libelle, classeScene, fichier) {
        console.log('\n' + (libelle === 'Bestiaire' ? '2' : '3') + ') ' + libelle);
        var avant = erreurs.length;

        await page.evaluate(function () {
            if (!(SceneManager._scene instanceof Scene_Menu)) { SceneManager.push(Scene_Menu); }
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Menu; }, null, { timeout: 30000 });
        await page.waitForTimeout(1000);

        var trouve = await page.evaluate(function (nom) {
            var w = SceneManager._scene._commandWindow;
            for (var i = 0; i < w.maxItems(); i++) {
                if (w.commandName(i) === nom) { w.select(i); w.processOk(); return true; }
            }
            return false;
        }, libelle);
        verifie('la commande « ' + libelle + ' » est dans le menu', trouve);
        await page.waitForTimeout(2200);

        var scene = await page.evaluate(function () { return SceneManager._scene.constructor.name; });
        verifie('elle ouvre ' + classeScene, scene === classeScene, 'scène « ' + scene + ' »');
        if (scene !== classeScene) { return; }

        // On PARCOURT la liste : refresh() la construit, et c'est là que le null attendait.
        var liste = await page.evaluate(function () {
            var s = SceneManager._scene, w = null;
            (s._windowLayer ? s._windowLayer.children : []).forEach(function (c) { if (c._list && !w) { w = c; } });
            if (!w) { s.children.forEach(function (c) { if (c._list && !w) { w = c; } }); }
            if (!w) { return { trouvee: false }; }
            var n = 0;
            for (var i = 0; i < Math.min(w.maxItems(), 40); i++) { w.select(i); n++; }
            w.select(0);
            return { trouvee: true, total: w.maxItems(), parcourus: n };
        });
        verifie('la liste se construit', liste.trouvee === true,
            liste.trouvee ? liste.total + ' entrées' : 'fenêtre de liste introuvable');
        verifie('elle se parcourt entrée par entrée', liste.parcourus > 0,
            liste.parcourus + ' entrées sélectionnées');

        await page.waitForTimeout(700);
        await page.screenshot({ path: SHOTS + fichier });
        console.log('   [capture] ' + fichier);
        verifie('aucune erreur pendant ce livre', erreurs.length === avant,
            erreurs.slice(avant, avant + 2).join(' | ') || 'rien');

        await page.evaluate(function () { SceneManager.pop(); });
        await page.waitForTimeout(1200);
        await page.evaluate(function () { if (SceneManager._scene instanceof Scene_Menu) { SceneManager.pop(); } });
        await page.waitForTimeout(1000);
    };

    await parcourir('Bestiaire', 'Scene_EnemyBook', 'livre_bestiaire.png');
    await parcourir('Encyclopédie', 'Scene_ItemBook', 'livre_encyclopedie.png');

    console.log('\n4) Le bilan');
    verifie('aucune erreur JavaScript sur toute la séance', erreurs.length === 0,
        erreurs.slice(0, 3).join(' | ') || 'rien');

    console.log('\n' + '='.repeat(70));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(70));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
