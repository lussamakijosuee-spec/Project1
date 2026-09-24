/*
 * L'ÉCRAN DES DONS SPIRITUELS — est-ce que la page tient dans l'écran ?
 *
 * Le défaut mesuré le 2026-09-19, à la remontée de DonsSpirituels.js : à quatre
 * héros, la page réclamait 904 pixels dans une fenêtre qui en offre 588. Le bas
 * de page, cloué à « Graphics.boxHeight - lh*4 », s'écrivait PAR-DESSUS Aël et
 * Korrah, et la ligne « en main : … » était tronquée au bord droit parce qu'elle
 * demandait la largeur entière depuis x = 24.
 *
 * On ne mesure pas l'intention (le code contient-il un rétrécissement ?) mais le
 * RÉSULTAT DESSINÉ : la scène expose _mesure {besoin, place, facteur, ligne,
 * police} après avoir posé la page.
 *
 * CONTRE-ÉPREUVE : avec un seul héros, la page tient sans rien rétrécir. Un
 * mécanisme qui rétrécit toujours ne prouve rien — il faut qu'il sache aussi
 * ne pas se déclencher.
 *
 * Prérequis :  npx http-server -p 8899 -c-1 .
 * Lancement  :  node bancs/navigateur/ecran_des_dons.js
 */
'use strict';
// ═════════════════════════════════════════════════════════════════════════════
// BANC EN SOMMEIL DEPUIS LE 2026-09-24
//
// Ce banc ouvre `Scene_Dons`, l'écran des Dons Spirituels. JOKO a retiré le
// système — « trop complexe pour rien » — et l'écran avec lui. On n'efface pas
// le banc (§3) : il se rallume tout seul si DonsSpirituels revient au registre.
//
// Ce qui est mesuré à la place :
//   · que le retrait tient            → bancs/21_le_retrait_des_dons.js
//   · l'Avatar, seule pièce gardée    → bancs/navigateur/le_corps_de_lavatar.js
// ═════════════════════════════════════════════════════════════════════════════
(function () {
    var reg = JSON.parse(require('fs').readFileSync(
        require('path').join(__dirname, '..', '..', 'js', 'plugins.js'), 'utf8')
        .replace(/^[^\[]*/, '').replace(/;\s*$/, ''));
    if (!reg.some(function (p) { return p.name === 'DonsSpirituels' && p.status; })) {
        console.log('\n  ⏸  BANC EN SOMMEIL — l\'ecran des Dons a ete retire avec son systeme.');
        console.log('     Voir  bancs/21_le_retrait_des_dons.js\n');
        process.exit(0);
    }
})();

var { chromium } = require('playwright');
var fs = require('fs');
var SHOTS = process.env.SHOTS || '/tmp/dons/';
fs.mkdirSync(SHOTS, { recursive: true });
var BASE = 'http://127.0.0.1:8899';

var ok = 0, ko = 0;
function V(libelle, condition, detail) {
    if (condition) { ok++; console.log('   OK  ' + libelle + (detail ? '  — ' + detail : '')); }
    else { ko++; console.log('   KO  ' + libelle + (detail ? '  — ' + detail : '')); }
}

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [], absents = [];
    page.on('pageerror', function (e) { erreurs.push('PAGEERROR: ' + e.message); });
    page.on('console', function (m) { if (m.type() === 'error') { erreurs.push('CONSOLE: ' + m.text().slice(0, 170)); } });
    page.on('response', function (r) { if (r.status() >= 400) { absents.push(r.status() + ' ' + r.url().replace(BASE, '')); } });
    var ev = function (f, a) { return page.evaluate(f, a); };

    console.log('\n── on démarre ──');
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 120000 });
    await ev(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded();
    }, null, { timeout: 60000 }).catch(function () { });
    await page.waitForTimeout(2000);
    // les âmes se posent APRÈS la carte : un autorun de Map001 remet les
    // variables à zéro si on le fait avant.
    await ev(function () { $gameVariables.setValue(15, 12); $gameParty.members().forEach(function (m) { m.recoverAll(); }); });

    V('le plugin est chargé et expose son écran', await ev(function () { return !!window.Scene_Dons; }),
        'window.Scene_Dons');

    // ── le groupe entier ─────────────────────────────────────────────────────
    console.log('\n── à quatre héros, la page doit tenir ──');
    await ev(function () { SceneManager.push(window.Scene_Dons); });
    await page.waitForTimeout(2200);
    var quatre = await ev(function () {
        var s = SceneManager._scene;
        return { scene: s.constructor.name, m: s._mesure,
                 place: s._w.contentsHeight(), larg: s._w.contentsWidth(),
                 membres: $gameParty.members().length };
    });
    V('l\'écran s\'ouvre', quatre.scene === 'Scene_Dons', quatre.membres + ' héros');
    V('la page est bien plus longue que la fenêtre', quatre.m && quatre.m.besoin > quatre.place,
        quatre.m ? Math.round(quatre.m.besoin) + ' px demandés pour ' + quatre.place + ' px offerts' : 'pas de mesure');
    V('et pourtant tout tient une fois posé',
        !!quatre.m && (quatre.m.besoin * quatre.m.facteur) <= quatre.place + 2,
        quatre.m ? 'rétréci à ×' + quatre.m.facteur.toFixed(2) + ' — ligne ' + quatre.m.ligne + ' px, police ' + quatre.m.police : '—');
    V('la police reste lisible', !!quatre.m && quatre.m.police >= 14,
        quatre.m ? quatre.m.police + ' px (plancher : 14)' : '—');
    await page.screenshot({ path: SHOTS + 'd1_quatre_heros.png' });

    // les quatre Dons sont bien nommés, et chacun dans son slot
    var dons = await ev(function () {
        return $gameParty.members().map(function (a) {
            var d = window.Dons && window.Dons.de(a.actorId());
            return d ? a.name() + '→' + d.nom + '/' + d.slotNom : a.name() + '→AUCUN';
        });
    });
    V('chaque héros a son Don, un seul', dons.length === 4 && dons.every(function (x) { return x.indexOf('AUCUN') < 0; }),
        dons.join(' · '));

    // ── CONTRE-ÉPREUVE : un seul héros, rien à rétrécir ──────────────────────
    console.log('\n── contre-épreuve : à un seul héros, on ne rétrécit pas ──');
    await ev(function () {
        SceneManager.pop();
        $gameParty._actors = [4];          // Aël : son Don EST son arme, page courte
    });
    await page.waitForTimeout(1400);
    await ev(function () { SceneManager.push(window.Scene_Dons); });
    await page.waitForTimeout(2000);
    var un = await ev(function () {
        var s = SceneManager._scene;
        return { m: s._mesure, place: s._w.contentsHeight(), membres: $gameParty.members().length };
    });
    V('la page courte tient sans aide', !!un.m && un.m.besoin <= un.place,
        un.m ? Math.round(un.m.besoin) + ' px pour ' + un.place + ' px' : '—');
    V('le rétrécissement ne s\'est PAS déclenché', !!un.m && un.m.facteur === 1,
        un.m ? 'facteur ×' + un.m.facteur + ' — il ne se déclenche que quand il faut' : '—');
    V('la police est restée pleine taille', !!un.m && un.m.police >= 20,
        un.m ? un.m.police + ' px' : '—');
    await page.screenshot({ path: SHOTS + 'd2_un_heros.png' });

    // ── on en sort ───────────────────────────────────────────────────────────
    console.log('\n── on doit pouvoir en sortir ──');
    await page.keyboard.down('Escape'); await page.waitForTimeout(150);
    await page.keyboard.up('Escape'); await page.waitForTimeout(1600);
    V('Échap referme l\'écran', (await ev(function () { return SceneManager._scene.constructor.name; })) !== 'Scene_Dons',
        'retour sur ' + (await ev(function () { return SceneManager._scene.constructor.name; })));

    console.log('\n── le bilan ──');
    /* « process is not defined » vient du décor, pas du jeu : ce banc tourne
   *  dans un navigateur, le jeu tourne dans NW.js qui fournit « process ».
   *  Vérifié en injectant un process de NW.js : ces erreurs-là tombent à
   *  zéro. On les écarte, mais on les affiche ; tout le reste reste une panne. */
    var horsNWjs = erreurs.filter(function (e) { return /process is not defined/.test(e); });
    var vraies = erreurs.filter(function (e) { return !/process is not defined/.test(e); });
    if (horsNWjs.length) { console.log('   (' + horsNWjs.length + ' « process is not defined » : propre au navigateur, mis de côté)'); }
    V('aucune erreur JavaScript', vraies.length === 0, vraies.slice(0, 3).join(' | ') || 'rien');
    V('aucune ressource manquante', absents.length === 0, absents.slice(0, 3).join(' | ') || 'rien');

    console.log('\n' + '='.repeat(64));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(64));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
