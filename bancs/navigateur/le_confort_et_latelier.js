/*
 * LE CONFORT DE LECTURE ET L'ATELIER DE TEST, DANS LE VRAI MOTEUR
 * ---------------------------------------------------------------------------
 * ConfortDeLecture.js : la vitesse du texte se MESURE en images — lente,
 * normale, rapide, instantanée doivent donner quatre durées dans le bon
 * ordre, et les pauses écrites (\.) doivent survivre à « instantanée ». Le
 * journal garde les répliques (nom et visage compris), s'ouvre avec Q, et
 * tant qu'il est ouvert le message ne défile pas et le joueur ne bouge pas.
 *
 * AtelierDeTest.js : hors test, il n'existe pas (F6 ne fait rien) ; en test,
 * F6 fait tourner la carte deux fois plus vite (une attente de 120 images
 * en prend ~60), F7 montre les étiquettes, F10 gagne le combat, Ctrl+clic
 * pose le joueur sur la case.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/le_confort_et_latelier.js
 */
'use strict';
var { chromium } = require('playwright');
var path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var CARTE = 29;

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--no-sandbox', '--mute-audio'] });
    var erreurs = [];
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }

    async function ouvrir(test) {
        var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
        page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
        await page.goto(BASE + '/index.html' + (test ? '?test' : ''), { waitUntil: 'load' });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
        await page.evaluate(function (id) {
            DataManager.setupNewGame(); $gameSystem._meteo = { force: 'clair' };
            $gamePlayer.reserveTransfer(id, 10, 10, 2, 0); SceneManager.goto(Scene_Map);
        }, CARTE);
        await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }, null, { timeout: 60000 });
        await page.waitForTimeout(1200);
        return page;
    }
    async function touche(page, k, ms) { await page.keyboard.down(k); await page.waitForTimeout(ms || 90); await page.keyboard.up(k); await page.waitForTimeout(120); }
    // ⚠ MV ignore les touches pendant 10 images après la fin d'un message
    //   (startPause → startWait(10)) : on attend que le message attende
    //   VRAIMENT le joueur avant d'appuyer, sinon un Entrée sur deux se perd.
    async function avancer(page) {
        for (var essai = 0; essai < 4; essai++) {
            await page.waitForFunction(function () { var w = SceneManager._scene._messageWindow; return !$gameMessage.isBusy() || (w.pause && w._waitCount <= 0 && w.isOpen()); }, null, { timeout: 20000 }).catch(function () {});
            var avant = await page.evaluate(function () { return $gameMessage.isBusy() ? $gameMessage.allText() + '#' + (window.ConfortDeLecture ? ConfortDeLecture.journal().length : 0) : ''; });
            if (!avant) return;
            await touche(page, 'Enter');
            // l'appui a-t-il été pris ? (le message a changé, ou il n'y en a plus)
            var pris = await page.waitForFunction(function (a) {
                return !$gameMessage.isBusy() || ($gameMessage.allText() + '#' + (window.ConfortDeLecture ? ConfortDeLecture.journal().length : 0)) !== a;
            }, avant, { timeout: 1500 }).then(function () { return true; }).catch(function () { return false; });
            if (pris) return;
        }
    }
    // ═══════════ ConfortDeLecture ═══════════
    var page = await ouvrir(false);
    var ev = function (f, a) { return page.evaluate(f, a); };
    console.log('LE CONFORT DE LECTURE');

    console.log('\n── l\'option « Vitesse du texte » ──');
    await ev(function () { SceneManager.push(Scene_Options); });
    await page.waitForTimeout(1200);
    var opt = await ev(function () {
        var w = SceneManager._scene._optionsWindow, i = w.findSymbol('vitesseTexte');
        return { i: i, texte: i >= 0 ? w.statusText(i) : '' };
    });
    V('la ligne est dans les Options, sur « Normale »', opt.i >= 0 && opt.texte === 'Normale', 'ligne ' + opt.i + ' : « ' + opt.texte + ' »');
    await ev(function (i) { var w = SceneManager._scene._optionsWindow; w.select(i); }, opt.i);
    await touche(page, 'ArrowRight');
    var apres = await ev(function (i) { var w = SceneManager._scene._optionsWindow; return { t: w.statusText(i), v: ConfigManager.vitesseTexte }; }, opt.i);
    V('flèche droite : « Rapide », et c\'est bien le réglage', apres.t === 'Rapide' && apres.v === 2, '« ' + apres.t + ' » · ConfigManager.vitesseTexte = ' + apres.v);
    await touche(page, 'Escape'); await page.waitForTimeout(1200);

    console.log('\n── la vitesse, mesurée en images ──');
    var LIGNE = 'Une phrase assez longue pour mesurer la vitesse du texte, lettre après lettre.';
    async function duree(v, texte) {
        await ev(function (a) {
            ConfigManager.vitesseTexte = a.v;
            var w = SceneManager._scene._messageWindow;
            if (!w._cdlEspion) {
                w._cdlEspion = true;
                var _eot = w.onEndOfText;
                w.onEndOfText = function () { window.__finTexte = Graphics.frameCount; _eot.call(this); };
                var _sm = w.startMessage;
                w.startMessage = function () { window.__debutTexte = Graphics.frameCount; _sm.call(this); };
            }
            window.__finTexte = 0;
            $gameMap._interpreter.setup([{ code: 101, indent: 0, parameters: ['', 0, 0, 2] }, { code: 401, indent: 0, parameters: [a.t] }, { code: 0, indent: 0, parameters: [] }], 0);
        }, { v: v, t: texte });
        await page.waitForFunction(function () { return window.__finTexte > 0; }, null, { timeout: 20000 }).catch(function () {});
        var d = await ev(function () { return window.__finTexte ? window.__finTexte - window.__debutTexte : -1; });
        await avancer(page);
        await page.waitForFunction(function () { return !$gameMessage.isBusy(); }, null, { timeout: 5000 }).catch(function () {});
        return d;
    }
    var d0 = await duree(0, LIGNE), d1 = await duree(1, LIGNE), d2 = await duree(2, LIGNE), d3 = await duree(3, LIGNE);
    console.log('      ' + LIGNE.length + ' lettres : lente ' + d0 + ' · normale ' + d1 + ' · rapide ' + d2 + ' · instantanée ' + d3 + ' images');
    V('normale ≈ une lettre par image (celle de MV)', d1 >= LIGNE.length * 0.8 && d1 <= LIGNE.length * 1.3, d1 + ' images');
    V('lente ≈ deux fois plus longue', d0 >= d1 * 1.6, d0 + ' contre ' + d1);
    V('rapide ≈ trois fois plus courte', d2 > 0 && d2 <= d1 / 2.4, d2 + ' contre ' + d1);
    // les ~11 premières images sont l'ouverture de la fenêtre, à toutes les vitesses
    var ouverture = Math.max(0, d1 - LIGNE.length);
    V('instantanée : la page d\'un coup (après l\'ouverture de la fenêtre)', d3 >= 0 && d3 <= ouverture + 3, d3 + ' image(s), dont ~' + ouverture + ' d\'ouverture');
    var dPause = await duree(3, 'Avant\\.\\.\\. après.');
    V('instantanée garde les pauses écrites (\\. = 15 images)', dPause >= 40, dPause + ' images pour trois « \\. »');
    await ev(function () { ConfigManager.vitesseTexte = 1; });

    console.log('\n── le journal des dialogues ──');
    await ev(function () {
        $gameSystem._journalDialogues = [];
        var l = [];
        for (var i = 1; i <= 8; i++) {
            l.push({ code: 101, indent: 0, parameters: [i % 2 ? 'Actor1' : '', 0, 0, 2] });
            l.push({ code: 401, indent: 0, parameters: [(i === 3 ? '\\n<Gaston>' : '') + 'Réplique numéro ' + i + ', pour remplir le journal.'] });
        }
        l.push({ code: 0, indent: 0, parameters: [] });
        $gameMap._interpreter.setup(l, 0);
    });
    for (var k = 0; k < 7; k++) { await avancer(page); }
    await page.waitForFunction(function () { var w = SceneManager._scene._messageWindow; return ConfortDeLecture.journal().length === 8 && w.pause && w._waitCount <= 0; }, null, { timeout: 20000 }).catch(function () {});
    // la 8e réplique attend le joueur : on ouvre le journal par-dessus
    var j = await ev(function () { var j = ConfortDeLecture.journal(); return { n: j.length, nom: j[2] && j[2].nom, visage: j[0] && j[0].visage, texte: j[2] && j[2].texte, enCours: $gameMessage.isBusy() }; });
    V('les répliques sont gardées, avec le nom et le visage', j.n === 8 && j.nom === 'Gaston' && j.visage === 'Actor1', j.n + ' répliques · nom « ' + j.nom + ' » · visage ' + j.visage);
    V('… et le texte sans le code du nom', j.texte && j.texte.indexOf('<Gaston>') < 0 && /Réplique numéro 3/.test(j.texte), '« ' + j.texte + ' »');
    await touche(page, 'q');
    await page.waitForTimeout(700);
    var o = await ev(function () { var w = SceneManager._scene._journalDialogues; return { ouvert: ConfortDeLecture.ouvert(), debut: w._debut, max: w._dernierDebut }; });
    await page.screenshot({ path: path.join(__dirname, 'captures', 'journal_dialogues.png') });
    V('Q ouvre le journal pendant qu\'un message attend', o.ouvert, 'ouvert, première réplique visible : n°' + (o.debut + 1));
    await touche(page, 'Enter'); await page.waitForTimeout(400);
    var bloque = await ev(function () { return $gameMessage.isBusy(); });
    V('journal ouvert : Entrée ne fait pas défiler le message caché dessous', bloque, 'message toujours là : ' + bloque);
    await touche(page, 'ArrowUp');
    var monte = await ev(function () { return SceneManager._scene._journalDialogues._debut; });
    V('flèche haut : on remonte dans le journal', monte === o.debut - 1 || (o.debut === 0 && monte === 0), 'début ' + o.debut + ' → ' + monte);
    await touche(page, 'q'); await page.waitForTimeout(700);
    var ferme = await ev(function () { return !ConfortDeLecture.ouvert(); });
    V('Q referme le journal', ferme, '');
    await avancer(page); await page.waitForTimeout(500);
    var fini = await ev(function () { return !$gameMessage.isBusy(); });
    V('contre-épreuve : journal fermé, Entrée fait de nouveau défiler', fini, 'message terminé : ' + fini);
    // sur la carte, le joueur ne bouge pas tant que le journal est ouvert
    await touche(page, 'q'); await page.waitForTimeout(600);
    var x0 = await ev(function () { return $gamePlayer.x + ',' + $gamePlayer.y; });
    await touche(page, 'ArrowLeft', 600); await touche(page, 'ArrowUp', 600);
    var x1 = await ev(function () { return $gamePlayer.x + ',' + $gamePlayer.y; });
    await touche(page, 'Escape'); await page.waitForTimeout(700);
    var menu = await ev(function () { return SceneManager._scene.constructor.name; });
    V('journal ouvert sur la carte : le joueur ne bouge pas, Échap ferme sans ouvrir le menu', x0 === x1 && menu === 'Scene_Map' && !(await ev(function () { return ConfortDeLecture.ouvert(); })), x0 + ' → ' + x1 + ' · scène ' + menu);

    console.log('\n── l\'atelier de test, hors test ──');
    var hors = await ev(function () { return { actif: AtelierDeTest.actif, v: AtelierDeTest.vitesse }; });
    await touche(page, 'F6');
    var hors2 = await ev(function () { return AtelierDeTest.vitesse; });
    V('hors test (le jeu de tes potes), l\'atelier n\'existe pas : F6 ne fait rien', !hors.actif && hors2 === undefined, 'actif = ' + hors.actif + ', vitesse = ' + hors2);
    await page.close();

    // ═══════════ AtelierDeTest, en test ═══════════
    page = await ouvrir(true);
    ev = function (f, a) { return page.evaluate(f, a); };
    console.log('\nL\'ATELIER DE TEST (lancé comme depuis l\'éditeur)');
    async function attente120() {
        await ev(function () {
            window.__w = 0;
            $gameMap._interpreter.setup([{ code: 355, indent: 0, parameters: ['window.__w0 = Graphics.frameCount'] }, { code: 230, indent: 0, parameters: [120] },
                { code: 355, indent: 0, parameters: ['window.__w = Graphics.frameCount - window.__w0'] }, { code: 0, indent: 0, parameters: [] }], 0);
        });
        await page.waitForFunction(function () { return window.__w > 0; }, null, { timeout: 20000 }).catch(function () {});
        return ev(function () { return window.__w; });
    }
    var a1 = await attente120();
    await touche(page, 'F6');
    var a2 = await attente120();
    var v2 = await ev(function () { return AtelierDeTest.vitesse; });
    V('F6 : ×2 — une attente de 120 images n\'en prend plus que ~60', v2 === 2 && a2 <= a1 * 0.6, '×1 : ' + a1 + ' images · ×' + v2 + ' : ' + a2 + ' images');
    await touche(page, 'F6'); await touche(page, 'F6');
    V('F6 encore : ×4 puis retour à ×1', (await ev(function () { return AtelierDeTest.vitesse; })) === 1, '');

    await touche(page, 'F7'); await page.waitForTimeout(500);
    var et = await ev(function () {
        var n = 0, ex = '';
        SceneManager._scene._spriteset._characterSprites.forEach(function (s) { if (s._adtEtiquette && s._adtEtiquette.visible) { n++; if (!ex && s._character instanceof Game_Event) ex = s._adtEtiquette._texte; } });
        return { n: n, ex: ex };
    });
    await page.screenshot({ path: path.join(__dirname, 'captures', 'atelier_etiquettes.png') });
    V('F7 : chaque événement affiche son numéro, son nom et sa page', et.n > 3 && /^\d+ · .+ · (p\d+|aucune page)$/.test(et.ex), et.n + ' étiquettes, ex. « ' + et.ex + ' »');
    await touche(page, 'F7');

    // Ctrl+clic : on vise une case libre près du joueur
    var cible = await ev(function () {
        for (var d = 2; d < 6; d++) {
            var x = $gamePlayer.x + d, y = $gamePlayer.y;
            if ($gameMap.isValid(x, y) && $gameMap.isPassable(x, y, 4)) return { x: x, y: y, px: $gameMap.adjustX(x) * $gameMap.tileWidth() + 24, py: $gameMap.adjustY(y) * $gameMap.tileHeight() + 24 };
        }
        return null;
    });
    if (cible) {
        await page.keyboard.down('Control');
        await page.mouse.click(cible.px, cible.py);
        await page.waitForTimeout(300);
        await page.keyboard.up('Control');
        await page.waitForTimeout(300);
        var ici = await ev(function () { return $gamePlayer.x + ',' + $gamePlayer.y; });
        V('Ctrl+clic pose le joueur sur la case cliquée', ici === cible.x + ',' + cible.y, 'visé ' + cible.x + ',' + cible.y + ' · arrivé ' + ici);
    }

    // F10 : victoire immédiate
    await ev(function () { BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && BattleManager._phase === 'input'; }, null, { timeout: 30000 }).catch(function () {});
    await touche(page, 'F10');
    var fin = await page.waitForFunction(function () { return $gameTroop.isAllDead() && (BattleManager._victoryPhase || BattleManager._phase === 'battleEnd' || !(SceneManager._scene instanceof Scene_Battle)); }, null, { timeout: 15000 }).then(function () { return true; }).catch(function () { return false; });
    V('F10 en combat : tous les ennemis tombent et la victoire s\'affiche', fin, '');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(__dirname, 'captures', 'atelier_victoire.png') });

    console.log('\n── le bilan ──');
    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
