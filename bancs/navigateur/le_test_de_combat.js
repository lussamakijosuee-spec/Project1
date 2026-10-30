/*
 * LE « TEST DE COMBAT » DE L'ÉDITEUR
 * ---------------------------------------------------------------------------
 * Le bouton « Test de combat » de RPG Maker lance un combat SANS carte
 * ($dataMap vide). Un plugin qui lit la carte en combat le fait planter, et
 * rien ne le voit en jouant normalement. On le rejoue comme l'éditeur :
 * DataManager.setupBattleTest(), puis la scène de combat.
 *
 *   ① le test de combat s'ouvre jusqu'aux commandes, sans erreur, et un tour
 *     se joue ;
 *   ② contre-épreuve : sans la garde d'Allegement sur MOG_VisualTimer, le
 *     même banc voit le plantage (il attrape bien le coupable).
 *
 *   node bancs/navigateur/le_test_de_combat.js
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }

    async function essai(sansGarde) {
        var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
        var erreurs = [];
        page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 160)); });
        if (sansGarde) {
            var src = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'plugins', 'Allegement.js'), 'utf8');
            var sans = src.replace(/TimerGauge\.prototype\.isHudVisible = function \(\) \{[^}]*\};/, '');
            if (sans === src) throw new Error('la garde MOG_VisualTimer n\'est plus dans Allegement.js');
            await page.route('**/js/plugins/Allegement.js', function (r) { r.fulfill({ status: 200, contentType: 'application/javascript', body: sans }); });
        }
        await page.goto(BASE + '/index.html', { waitUntil: 'load' });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
        await page.evaluate(function () {
            // MV attrape les erreurs de scène et affiche son écran rouge : on les note aussi
            var _c = SceneManager.catchException;
            SceneManager.catchException = function (e) { window.__plantage = String(e && e.message || e).slice(0, 160); return _c.apply(this, arguments); };
            DataManager.setupBattleTest(); SceneManager.goto(Scene_Battle);
        });
        // la troupe de test peut être un boss qui se présente (« ◈ Le Percepteur… ») : on valide ses messages
        // comme le joueur, sinon le combat attend une touche pour toujours
        await page.evaluate(function () {
            window.__valider = setInterval(function () {
                var w = SceneManager._scene && SceneManager._scene._messageWindow;
                if ($gameMessage.isBusy() && w && w.pause) { w.pause = false; w.terminateMessage(); }
            }, 300);
        });
        var pret = await page.waitForFunction(function () { var s = SceneManager._scene; return window.__plantage || (s instanceof Scene_Battle && s._actorCommandWindow && s._actorCommandWindow.active); }, null, { timeout: 90000 }).then(function () { return true; }, function () { return false; });
        var r = await page.evaluate(function () { var s = SceneManager._scene; return { plantage: window.__plantage || null, commandes: !!(s._actorCommandWindow && s._actorCommandWindow.active), carte: !!$dataMap, troupe: $gameTroop.members().map(function (e) { return e.name(); }).join(', ') }; });
        r.pret = pret; r.erreurs = erreurs;
        if (!sansGarde && r.commandes) {
            // un tour : tout le monde attaque le premier ennemi
            for (var i = 0; i < 12; i++) {
                var actif = await page.evaluate(function () { var s = SceneManager._scene; return s._actorCommandWindow && s._actorCommandWindow.active; });
                if (actif) { await page.evaluate(function () { var a = BattleManager.actor(); if (a) { a.inputtingAction().setAttack(); a.inputtingAction().setTarget(0); } BattleManager.selectNextCommand(); SceneManager._scene.changeInputWindow(); }); }
                await page.waitForTimeout(700);
            }
            r.tour = await page.evaluate(function () { return { tours: $gameTroop.turnCount(), plantage: window.__plantage || null }; });
        }
        await page.close();
        return r;
    }

    console.log('LE TEST DE COMBAT DE L\'ÉDITEUR');
    var a = await essai(false);
    V('le test de combat s\'ouvre jusqu\'aux commandes, sans carte', a.commandes && !a.carte && !a.plantage && a.erreurs.length === 0, 'troupe de test : ' + a.troupe + (a.plantage ? ' · ' + a.plantage : ''));
    V('… et un tour se joue sans erreur', a.tour && !a.tour.plantage && a.erreurs.length === 0, a.tour ? 'tour ' + a.tour.tours + (a.tour.plantage ? ' · ' + a.tour.plantage : '') : 'pas joué');
    var b = await essai(true);
    V('contre-épreuve : sans la garde sur MOG_VisualTimer, le banc voit le plantage', !!b.plantage && /scrollType/.test(b.plantage), b.plantage || 'aucun plantage vu');

    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
