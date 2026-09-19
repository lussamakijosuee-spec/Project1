/*
 * EST-CE QUE ÇA RAME ?
 *
 * JOKO : « le rendre moins lagant ».
 * « Ça rame » n'est pas une impression : ça se mesure. Ce banc compte les
 * images réellement affichées par seconde sur la carte et en combat, chronomètre
 * le démarrage, et dit QUELS plugins pèsent — en comptant les crochets posés sur
 * les deux fonctions appelées soixante fois par seconde : la mise à jour de la
 * scène et celle de la carte.
 *
 * ⚠ Chromium tourne ici SANS carte graphique (swiftshader) : les chiffres
 *   absolus sont plus bas que sur la machine de JOKO. Ce qui compte, c'est
 *   l'écart entre les scènes et l'évolution d'une mesure à l'autre.
 *
 * Prérequis :  npx http-server -p 8899 -c-1 .
 * Lancement  :  node bancs/navigateur/ca_rame.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var ev = function (f, a) { return page.evaluate(f, a); };

    console.log('═'.repeat(70));
    console.log('  EST-CE QUE ÇA RAME ?');
    console.log('═'.repeat(70));

    var t0 = Date.now();
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 180000 });
    var demarrage = (Date.now() - t0) / 1000;

    var charge = await ev(function () {
        return {
            plugins: $plugins.length,
            actifs: $plugins.filter(function (p) { return p.status && !/^▬/.test(p.name); }).length,
            cartes: Object.keys($dataMapInfos).filter(function (k) { return $dataMapInfos[k]; }).length
        };
    });
    console.log('\n  Démarrage jusqu\'au titre : ' + demarrage.toFixed(1) + ' s');
    console.log('  ' + charge.actifs + ' plugins actifs sur ' + charge.plugins + ' déclarés · ' + charge.cartes + ' cartes');

    /** Compte les images pendant n millisecondes, sur la scène en cours. */
    async function mesurer(nom, ms) {
        await ev(function () { window.__img0 = Graphics.frameCount; });
        await page.waitForTimeout(ms);
        var n = await ev(function () { return Graphics.frameCount - window.__img0; });
        var ips = n / (ms / 1000);
        var juge = ips >= 50 ? 'fluide' : (ips >= 35 ? 'ça passe' : (ips >= 20 ? 'ça traîne' : 'ça rame'));
        console.log('  ' + nom.padEnd(22) + String(Math.round(ips)).padStart(3) + ' images/s   ' + juge);
        return ips;
    }

    console.log('\n  ── images par seconde ──');
    var ipsTitre = await mesurer('écran-titre', 3000);

    await ev(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded();
    }, null, { timeout: 60000 }).catch(function () { });
    await page.waitForTimeout(2500);
    for (var z = 0; z < 30 && (await ev(function () { return $gameMessage.isBusy(); })); z++) {
        await page.keyboard.press('Enter'); await page.waitForTimeout(90);
    }
    var ipsCarte = await mesurer('carte de départ', 4000);

    // une carte chargée : la Salle de Test et ses portes
    await ev(function () { $gamePlayer.reserveTransfer(2, 18, 11, 8, 0); });
    await page.waitForFunction(function () { return $gameMap.mapId() === 2 && !$gamePlayer.isTransferring(); }, null, { timeout: 30000 }).catch(function () { });
    await page.waitForTimeout(2000);
    var ipsSalle = await mesurer('Salle de Test', 4000);

    await ev(function () {
        var t = null;
        for (var i = 1; i < $dataTroops.length && !t; i++) { if ($dataTroops[i] && $dataTroops[i].members.length) { t = i; } }
        BattleManager.setup(t, true, true);
        $gamePlayer.makeEncounterCount();
        SceneManager.push(Scene_Battle);
    });
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Battle' && BattleManager._phase;
    }, null, { timeout: 40000 }).catch(function () { });
    await page.waitForTimeout(2500);
    var ipsCombat = await mesurer('combat', 4000);

    /* ── qui s'accroche aux fonctions chaudes ── */
    console.log('\n  ── ce qui tourne soixante fois par seconde ──');
    var chaines = await ev(function () {
        // Chaque plugin qui « alias » une fonction ajoute un maillon. Plus la
        // chaîne est longue, plus chaque image coûte cher.
        function longueur(f) {
            var s = String(f);
            // on compte les appels à une fonction sauvegardée (_xxx.call / .apply)
            return (s.match(/\.(call|apply)\s*\(/g) || []).length;
        }
        return {
            scene: longueur(Scene_Map.prototype.update),
            carte: longueur(Game_Map.prototype.update),
            joueur: longueur(Game_Player.prototype.update),
            combat: longueur(Scene_Battle.prototype.update),
            fenetre: longueur(Window_Base.prototype.update)
        };
    });
    Object.keys(chaines).forEach(function (k) {
        console.log('    ' + k.padEnd(10) + chaines[k] + ' maillon(s) empilés par les plugins');
    });

    /* ── la mémoire ── */
    var memoire = await ev(function () {
        return performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null;
    });
    if (memoire !== null) { console.log('\n  Mémoire employée : ' + memoire + ' Mo'); }

    console.log('\n' + '═'.repeat(70));
    var pire = Math.min(ipsTitre, ipsCarte, ipsSalle, ipsCombat);
    console.log('  Le pire moment tourne à ' + Math.round(pire) + ' images/s.');
    console.log('  (Chromium sans carte graphique : chez JOKO ce sera plus haut.');
    console.log('   Ce qui compte, c\'est de comparer d\'une mesure à l\'autre.)');
    console.log('═'.repeat(70));
    await nav.close();
})();
