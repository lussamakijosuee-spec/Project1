/*
 * LES OUTILS DE COMBAT DE COMBATPLUS, DANS LE VRAI MOTEUR
 * ---------------------------------------------------------------------------
 *   ① l'option « Animations (combat) » : en combat, une animation joue à la
 *     vitesse 4 → 3 → 2 images ; sur la carte, rien ne change (contre-
 *     épreuve) ; l'option est sauvée, bornée, et son texte tient dans la
 *     fenêtre des options ;
 *   ② « COMBAT musique garder » : la musique de la carte continue pendant
 *     CE combat, et le suivant reprend la musique de combat (une seule fois) ;
 *     un nom de fichier la remplace ; « toujours » et « défaut » ;
 *   ③ <Fond région 7: Castle1, Castle2> : un combat lancé sur la région 7
 *     prend ces fonds ; ailleurs, le fond habituel (contre-épreuve).
 *
 *   node bancs/navigateur/les_outils_de_combat.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var TROUPE = 2, MUSIQUE_CARTE = '058-Slow01', AUTRE = 'Battle-Ayakashi';

(async function () {
    var nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    var ev = function (f, a) { return page.evaluate(f, a); };
    async function commande(t) { await ev(function (t) { $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: [t] }, { code: 0, indent: 0, parameters: [] }], 0); }, t); await page.waitForTimeout(200); }
    async function surLaCarte() {
        await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }, null, { timeout: 60000 });
        await page.waitForTimeout(500);
    }
    async function combat() {
        await ev(function (t) { BattleManager.setup(t, true, true); $gamePlayer.makeEncounterCount(); SceneManager.push(Scene_Battle); }, TROUPE);
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && BattleManager._phase && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(500);
        return ev(function () {
            var s = SceneManager._scene._spriteset;
            return { bgm: AudioManager._currentBgm ? AudioManager._currentBgm.name : '', fond1: s._back1Sprite.bitmap ? s._back1Sprite.bitmap._url : '', fond2: s._back2Sprite.bitmap ? s._back2Sprite.bitmap._url : '' };
        });
    }
    async function retour() {
        for (var z = 0; z < 30 && (await ev(function () { return $gameMessage.isBusy(); })); z++) { await page.keyboard.press('Enter'); await page.waitForTimeout(150); }
        await ev(function () { $gameTroop._interpreter.clear(); BattleManager.processAbort(); });
        await surLaCarte();
        return ev(function () { return { bgm: AudioManager._currentBgm ? AudioManager._currentBgm.name : '', suivante: $gameSystem._cpMusiqueSuivante || null }; });
    }
    function musiqueCarte() { return ev(function (m) { AudioManager.playBgm({ name: m, volume: 90, pitch: 100, pan: 0 }); }, MUSIQUE_CARTE); }

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    await ev(function () { DataManager.setupNewGame(); $gameSystem._meteo = { force: 'clair' }; $gamePlayer.reserveTransfer(29, 10, 10, 2, 0); SceneManager.goto(Scene_Map); });
    await surLaCarte();
    var musiqueCombat = await ev(function () { return $gameSystem.battleBgm().name; });
    console.log('LES OUTILS DE COMBAT  (musique de combat : ' + musiqueCombat + ')');

    console.log('\n── ① l\'option « Animations (combat) » ──');
    var c0 = await combat();
    var rates = await ev(function () {
        return [0, 1, 2].map(function (v) { ConfigManager.animCombat = v; var a = new Sprite_Animation(); a.setupRate(); return a._rate; });
    });
    await retour();
    var carte = await ev(function () { ConfigManager.animCombat = 2; var a = new Sprite_Animation(); a.setupRate(); var r = a._rate; ConfigManager.animCombat = 0; return r; });
    V('en combat : Normal 4, Rapide 3, Éclair 2 images par case d\'animation', rates.join() === '4,3,2', rates.join(' → '));
    V('contre-épreuve : sur la carte, même en Éclair, la vitesse reste 4', carte === 4, 'vitesse ' + carte);
    var opt = await ev(function () {
        var c = ConfigManager.makeData(); var o = {};
        ConfigManager.applyData({ animCombat: 7 }); o.borne = ConfigManager.animCombat;
        ConfigManager.applyData({}); o.absent = ConfigManager.animCombat;
        var w = new Window_Options(), i = w._list.map(function (x) { return x.symbol; }).indexOf('animCombat');
        var larges = ['Normal', 'Rapide', 'Éclair'].map(function (t) { return w.textWidth(t); });
        w.select(i); w.cursorRight(); o.apresDroite = ConfigManager.animCombat; o.texte = w.statusText(i); ConfigManager.animCombat = 0;
        return { sauvee: 'animCombat' in c, borne: o.borne, absent: o.absent, present: i >= 0, larges: Math.max.apply(null, larges), place: w.statusWidth(), apresDroite: o.apresDroite, texte: o.texte };
    });
    V('l\'option est dans le menu, sauvée, bornée (7 → 2, absente → 0), et → passe à « Rapide »', opt.present && opt.sauvee && opt.borne === 2 && opt.absent === 0 && opt.apresDroite === 1 && opt.texte === 'Rapide', JSON.stringify(opt));
    V('son texte tient dans sa colonne', opt.larges <= opt.place, 'le plus large ' + opt.larges + ' px pour ' + opt.place);

    console.log('\n── ② la musique d\'un combat scénarisé ──');
    await musiqueCarte();
    await commande('COMBAT musique garder');
    var m1 = await combat();
    var r1 = await retour();
    var m2 = await combat();
    await retour();
    V('« COMBAT musique garder » : la musique de la carte continue pendant le combat', m1.bgm === MUSIQUE_CARTE, m1.bgm);
    V('… elle est toujours là après, et la consigne est consommée', r1.bgm === MUSIQUE_CARTE && !r1.suivante, JSON.stringify(r1));
    V('contre-épreuve : le combat suivant reprend la musique de combat', m2.bgm === musiqueCombat, m2.bgm);
    await musiqueCarte();
    await commande('COMBAT musique ' + AUTRE);
    var m3 = await combat();
    await retour();
    V('« COMBAT musique ' + AUTRE + ' » : ce combat-là joue ce fichier', m3.bgm === AUTRE, m3.bgm);
    await commande('COMBAT musique garder toujours');
    await musiqueCarte();
    var m4 = await combat(); await retour();
    var m5 = await combat(); await retour();
    await commande('COMBAT musique défaut');
    var m6 = await combat(); await retour();
    V('« toujours » garde la musique deux combats de suite ; « défaut » rend la musique de combat', m4.bgm === MUSIQUE_CARTE && m5.bgm === MUSIQUE_CARTE && m6.bgm === musiqueCombat, [m4.bgm, m5.bgm, m6.bgm].join(' · '));

    console.log('\n── ③ un fond de combat selon la région ──');
    var reg = await ev(function () {
        $dataMap.note += '\n<Fond région 7: Castle1, Castle2>';
        var x = $gamePlayer.x, y = $gamePlayer.y, w = $dataMap.width, h = $dataMap.height;
        window.__case = (5 * h + y) * w + x; window.__avant = $dataMap.data[window.__case];
        $dataMap.data[window.__case] = 7;
        return $gamePlayer.regionId();
    });
    var f1 = await combat();
    await retour();
    await ev(function () { $dataMap.data[window.__case] = window.__avant; });
    var f2 = await combat();
    await retour();
    V('sur la région ' + reg + ' : les fonds Castle1 et Castle2', reg === 7 && /battlebacks1\/Castle1\.png$/.test(f1.fond1) && /battlebacks2\/Castle2\.png$/.test(f1.fond2), f1.fond1 + ' · ' + f1.fond2);
    V('contre-épreuve : hors de la région, le fond habituel', !/Castle1/.test(f2.fond1), f2.fond1 || '(aucun)');

    console.log('\n── le bilan ──');
    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
