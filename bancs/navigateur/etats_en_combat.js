/*
 * BANC — LES ÉTATS, DANS LE MOTEUR QUI TOURNE
 * ---------------------------------------------------------------------------
 * Un notetag d'état que rien ne parse ne lève AUCUNE erreur : MV lit la note,
 * n'y reconnaît rien, et passe. L'état est posé, son icône s'affiche, et il
 * ne fait strictement rien.
 *
 * Trois états étaient dans ce cas :
 *
 *   #16  Domaine Déployé   <Custom Execution Eval> — YEP_BuffsStatesCore lit
 *        `<CUSTOM (.*) EFFECT>`, pas EVAL. Vingt lignes jamais exécutées.
 *   #220 ☠ Compte à Rebours  <Doom: 4>   — inconnu de tout plugin
 *   #214 ♻ Reprise           <Reprise>   — idem
 *
 * Lire les fichiers ne peut pas le dire : la note EXISTE, elle est simplement
 * ignorée. Il faut poser l'état sur un vrai combattant et regarder.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/etats_en_combat.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

var ok = 0, ko = 0;
function verdict(t, passe, detail) {
    if (passe) { ok++; console.log('   ✓ ' + t + '  —  ' + detail); }
    else { ko++; console.log('   ✗ ' + t + '  —  ' + detail); }
}

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var err = [];
    page.on('pageerror', function (e) { err.push(e.message); });

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    await page.waitForTimeout(1500);
    for (var i = 0; i < 20; i++) {
        if (await page.evaluate(function () { return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded(); })) { break; }
        await page.keyboard.down('Enter'); await page.waitForTimeout(120); await page.keyboard.up('Enter');
        await page.waitForTimeout(1500);
    }
    await page.waitForTimeout(2500);
    await page.evaluate(function () { BattleManager.setup(1, false, true); SceneManager.goto(Scene_Battle); });
    await page.waitForTimeout(5000);

    console.log('LES ÉTATS, DANS LE MOTEUR QUI TOURNE\n');

    // ── 1. Yanfly a-t-il seulement LU les blocs ? ────────────────────────────
    var lus = await page.evaluate(function () {
        var o = { total: 0, avecEffets: 0, cibles: {} };
        for (var i = 1; i < $dataStates.length; i++) {
            var s = $dataStates[i];
            if (!s || !s.name) { continue; }
            o.total++;
            var e = s.customEffectEval;
            if (!e) { continue; }
            var poses = Object.keys(e).filter(function (k) { return e[k] && String(e[k]).trim(); });
            if (poses.length) { o.avecEffets++; }
            if ([16, 214, 220].indexOf(i) >= 0) { o.cibles[i] = { nom: s.name, temps: poses }; }
        }
        return o;
    });

    verdict('YEP_BuffsStatesCore lit des effets sur les états', lus.avecEffets > 0,
        lus.avecEffets + ' états sur ' + lus.total + ' portent au moins un effet relu');
    [16, 214, 220].forEach(function (id) {
        var c = lus.cibles[id];
        verdict('#' + id + ' « ' + (c ? c.nom : '?') + ' » : ses temps sont relus',
            !!c && c.temps.length > 0,
            c && c.temps.length ? c.temps.join(', ') : 'AUCUN — la note est encore ignorée');
    });

    // ── 2. Le compte à rebours tombe-t-il vraiment ? ─────────────────────────
    var doom = await page.evaluate(function () {
        var g = $gameTroop.members()[0];
        g.recoverAll();
        g.addState(220);
        var suite = [];
        for (var t = 0; t < 7 && !g.isDead(); t++) {
            g.customEffectEval(220, 'turnEndState');
            suite.push(g._doom);
            if (g.isDead()) { break; }
        }
        return { suite: suite, mort: g.isDead(), annonce: Number($dataStates[220].meta.Doom) };
    });
    console.log('\n   ── ☠ Compte à Rebours  (le tag annonce ' + doom.annonce + ')');
    console.log('      décompte observé : ' + doom.suite.join(' → '));
    verdict('le compte descend tour après tour', doom.suite.length > 1 && doom.suite[0] > doom.suite[1],
        doom.suite.join(' → '));
    verdict('arrivé à zéro, il tue le porteur', doom.mort,
        doom.mort ? 'mort au bout de ' + doom.suite.length + ' tours' : 'le porteur est toujours debout');
    verdict('le nombre vient bien du tag <Doom: n>', doom.suite[0] === doom.annonce - 1,
        'premier décompte ' + doom.suite[0] + ' pour un tag à ' + doom.annonce);

    // ── 3. La Reprise : on porte un VRAI coup fatal ─────────────────────────
    //  tourne dans , sur les états de la
    // CIBLE, juste avant que le coup porte. On monte donc une vraie action et
    // on la laisse frapper — appeler l eval à la main ne prouverait rien.
    var reprise = await page.evaluate(function () {
        var g = $gameTroop.members()[0];
        var frappeur = $gameParty.battleMembers()[0];
        function coupFatal() {
            var a = new Game_Action(frappeur);
            a.setSkill(1);
            a.executeDamage(g, g.mhp * 10);   // très largement mortel
            g.refresh();
        }
        g.clearStates(); g.recoverAll();
        g._repriseFaite = false;
        g.addState(214);
        var o = { pvAvant: g.hp };
        coupFatal();
        o.releve = !g.isDead();
        o.pv = g.hp;
        o.part = Math.round(g.hp / g.mhp * 100);
        o.gardeEtat = g.isStateAffected(214);
        // Un second coup fatal, sans reposer l état : il doit rester à terre.
        coupFatal();
        o.deuxieme = !g.isDead();
        return o;
    });
    console.log("\n   ── ♻ Reprise");
    verdict("elle encaisse un coup mortel et le porteur tient debout", reprise.releve,
        reprise.releve ? "remis à " + reprise.pv + " PV (" + reprise.part + " % des PV max)" : "il est tombé");
    verdict("elle s épuise après usage", !reprise.gardeEtat,
        reprise.gardeEtat ? "l état est encore là" : "l état s est retiré de lui-même");
    verdict("une seule Reprise ne relève qu une fois", !reprise.deuxieme,
        reprise.deuxieme ? "il a survécu au second coup" : "la seconde mort est définitive");
    // ── 4. Domaine Déployé coûte-t-il ses 15 % ? ─────────────────────────────
    var domaine = await page.evaluate(function () {
        var g = $gameTroop.members()[0];
        g.clearStates(); g.recoverAll();
        g.addState(16);
        var avant = g.hp;
        g.customEffectEval(16, 'actionStartState');
        return { avant: avant, apres: g.hp, attendu: Math.floor(g.mhp * 0.15) };
    });
    console.log('\n   ── Domaine Déployé');
    verdict('bouger coûte 15 % des PV max au porteur', domaine.avant - domaine.apres === domaine.attendu,
        'PV ' + domaine.avant + ' → ' + domaine.apres + '  (attendu −' + domaine.attendu + ')');

    /* « process is not defined » vient du décor, pas du jeu : ce banc tourne
   *  dans un navigateur, le jeu tourne dans NW.js qui fournit « process ».
   *  Vérifié en injectant un process de NW.js : ces erreurs-là tombent à
   *  zéro. On les écarte, mais on les affiche ; tout le reste reste une panne. */
    var horsNWjs = err.filter(function (e) { return /process is not defined/.test(e); });
    var vraies = err.filter(function (e) { return !/process is not defined/.test(e); });
    if (horsNWjs.length) { console.log('   (' + horsNWjs.length + ' « process is not defined » : propre au navigateur, mis de côté)'); }
    verdict('aucune erreur JavaScript', vraies.length === 0, vraies.slice(0, 3).join(' | ') || 'rien');

    console.log('\n' + '='.repeat(70));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(70));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
