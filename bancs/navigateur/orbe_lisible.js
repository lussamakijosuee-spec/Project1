/*
 * L'ORBE EST-IL LISIBLE ?
 *
 * Sur les captures de JOKO, trois choses n'allaient pas :
 *   · les noms sortaient du cadre et se faisaient couper — « mbre de griffe »,
 *     « ANA semi-parfait » ;
 *   · à quatorze branches, les noms du bas se marchaient dessus ;
 *   · une branche verrouillée pesait autant qu'une branche jouable, si bien
 *     que l'orbe était plein de chemins qui ne mènent nulle part.
 *
 * On ne relit pas le code : le sprite expose maintenant le RECTANGLE de chaque
 * étiquette qu'il a posée (_etiquettes), et on mesure ces rectangles. Un
 * contrôle qui regarde le code ne saurait pas dire si deux mots se touchent.
 *
 * La largeur mesurée est celle du TEXTE, pas de la boîte : deux boîtes de 150
 * pixels se frôlent souvent alors que les mots, eux, sont loin l'un de l'autre.
 *
 * Prérequis :  npx http-server -p 8899 -c-1 .
 * Lancement  :  node bancs/navigateur/orbe_lisible.js
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var SHOTS = process.env.SHOTS || '/tmp/orbe/';
fs.mkdirSync(SHOTS, { recursive: true });
var BASE = 'http://127.0.0.1:8899';

var ok = 0, ko = 0;
function V(l, c, d) {
    if (c) { ok++; console.log('   OK  ' + l + (d ? '  — ' + d : '')); }
    else { ko++; console.log('   KO  ' + l + (d ? '  — ' + d : '')); }
}

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push('PAGEERROR: ' + e.message); });
    page.on('console', function (m) { if (m.type() === 'error') { erreurs.push('CONSOLE: ' + m.text().slice(0, 160)); } });
    var ev = function (f, a) { return page.evaluate(f, a); };
    var touche = async function (k) {
        await page.keyboard.down(k); await page.waitForTimeout(150);
        await page.keyboard.up(k); await page.waitForTimeout(240);
    };

    console.log('\n── on démarre ──');
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 120000 });
    await ev(function () {
        DataManager.setupNewGame();
        $gameParty._actors = [3, 1, 2, 4];
        $gameParty.members().forEach(function (m) { m.recoverAll(); m.setTp(100); });
        SceneManager.goto(Scene_Map);
    });
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded();
    }, null, { timeout: 60000 }).catch(function () { });
    await page.waitForTimeout(1800);

    /** Le relevé de ce qui est DESSINÉ, pour l'acteur donné. */
    function releve() {
        return ev(function () {
            var s = SceneManager._scene;
            if (s.constructor.name !== 'Scene_OrbeCapacites') { return { scene: s.constructor.name }; }
            var o = s._orbe;
            return {
                scene: s.constructor.name, nom: s.actor().name(),
                L: o.bitmap.width, H: o.bitmap.height, cx: o._cx, cy: o._cy,
                branches: (s._branches || []).length,
                ouvertes: (s._branches || []).filter(function (b) { return b.ouverte; }).length,
                choisie: (s._branches || [])[s._iBranche] ? {
                    nom: (s._branches || [])[s._iBranche].nom.trim(),
                    ouverte: (s._branches || [])[s._iBranche].ouverte
                } : null,
                etiquettes: (o._etiquettes || []).slice()
            };
        });
    }

    function chevauchent(a, b) {
        return a.x < b.x + b.l && b.x < a.x + a.l && a.y < b.y + b.h && b.y < a.y + a.h;
    }

    async function examiner(titre, r) {
        console.log('\n── ' + titre + ' : ' + r.nom + ' (' + r.branches + ' branches, ' +
            r.ouvertes + ' ouvertes) ──');

        // ① rien ne sort du cadre
        var dehors = r.etiquettes.filter(function (e) {
            return e.x < 0 || e.y < 0 || e.x + e.l > r.L || e.y + e.h > r.H;
        });
        V('aucun nom ne sort du cadre', dehors.length === 0,
            dehors.map(function (e) { return e.nom.trim() + ' (' + e.x + ',' + e.y + ')'; }).join(' | ') ||
            r.etiquettes.length + ' étiquette(s), toutes dans ' + r.L + '×' + r.H);

        // ② deux noms ne se touchent jamais
        var collisions = [];
        for (var i = 0; i < r.etiquettes.length; i++) {
            for (var j = i + 1; j < r.etiquettes.length; j++) {
                if (chevauchent(r.etiquettes[i], r.etiquettes[j])) {
                    collisions.push(r.etiquettes[i].nom.trim() + ' ∩ ' + r.etiquettes[j].nom.trim());
                }
            }
        }
        V('deux noms ne se chevauchent jamais', collisions.length === 0,
            collisions.slice(0, 3).join(' | ') || 'aucun chevauchement');

        // ③ aucun nom ne se pose sur le visage du héros
        var surLeVisage = r.etiquettes.filter(function (e) {
            var px = Math.max(e.x, Math.min(r.cx, e.x + e.l));
            var py = Math.max(e.y, Math.min(r.cy, e.y + e.h));
            var d = Math.sqrt((px - r.cx) * (px - r.cx) + (py - r.cy) * (py - r.cy));
            return d < 70;                      // le rayon de l'orbe
        });
        V('aucun nom ne se pose sur le visage', surLeVisage.length === 0,
            surLeVisage.map(function (e) { return e.nom.trim(); }).join(' | ') || 'le centre est dégagé');

        // ④ aucun nom ne se pose sur son propre point
        var surSonPoint = r.etiquettes.filter(function (e) {
            return e.px >= e.x && e.px <= e.x + e.l && e.py >= e.y && e.py <= e.y + e.h;
        });
        V('aucun nom ne se pose sur son propre point', surSonPoint.length === 0,
            surSonPoint.map(function (e) { return e.nom.trim(); }).join(' | ') || 'chaque nom est à côté de son rond');

        // ⑤ on nomme ce qui sert, et seulement ça
        var attendu = r.ouvertes + ((r.choisie && !r.choisie.ouverte) ? 1 : 0);
        V('on nomme les branches jouables, plus celle sous le curseur',
            r.etiquettes.length === attendu,
            r.etiquettes.length + ' nom(s) pour ' + r.ouvertes + ' ouverte(s)' +
            (r.choisie && !r.choisie.ouverte ? ' + « ' + r.choisie.nom + ' » sous le curseur' : ''));
        return r;
    }

    // ── ludwing : le cas le plus chargé, 14 branches dont 11 verrouillées ──
    await ev(function () { $gameParty.setMenuActor($gameActors.actor(3)); SceneManager.push(Scene_Skill); });
    await page.waitForTimeout(2400);
    var r1 = await releve();
    V('l\'Orbe s\'ouvre', r1.scene === 'Scene_OrbeCapacites', 'scène ' + r1.scene);
    await examiner('branche ouverte sous le curseur', r1);
    await page.screenshot({ path: SHOTS + 'o1_ludwing.png' });

    // on va chercher une branche VERROUILLÉE : elle doit alors être nommée
    for (var k = 0; k < 12; k++) {
        await touche('ArrowRight');
        var r = await releve();
        if (r.choisie && !r.choisie.ouverte) { break; }
    }
    var r2 = await releve();
    V('on peut atteindre une branche verrouillée', !!(r2.choisie && !r2.choisie.ouverte),
        r2.choisie ? r2.choisie.nom + (r2.choisie.ouverte ? ' (ouverte)' : ' (verrouillée)') : '—');
    await examiner('branche verrouillée sous le curseur', r2);
    await page.screenshot({ path: SHOTS + 'o2_ludwing_verrou.png' });

    // ── Vesper : moins de branches, autre répartition ──
    await ev(function () { SceneManager.pop(); });
    await page.waitForTimeout(1500);
    await ev(function () { $gameParty.setMenuActor($gameActors.actor(1)); SceneManager.push(Scene_Skill); });
    await page.waitForTimeout(2400);
    await examiner('Vesper', await releve());
    await page.screenshot({ path: SHOTS + 'o3_vesper.png' });

    // ── CONTRE-ÉPREUVE ───────────────────────────────────────────────────
    // Le contrôle du chevauchement doit savoir dire NON : on pose deux
    // étiquettes l'une sur l'autre, exprès, et il doit les attraper.
    console.log('\n── contre-épreuve ──');
    var faux = [{ nom: 'A', x: 10, y: 10, l: 100, h: 24, px: 0, py: 0 },
                { nom: 'B', x: 60, y: 20, l: 100, h: 24, px: 0, py: 0 }];
    V('un chevauchement volontaire est bien vu', chevauchent(faux[0], faux[1]),
        'deux rectangles qui se croisent sont détectés');
    var loin = [{ nom: 'A', x: 10, y: 10, l: 40, h: 24, px: 0, py: 0 },
                { nom: 'B', x: 200, y: 10, l: 40, h: 24, px: 0, py: 0 }];
    V('et deux noms éloignés restent innocentés', !chevauchent(loin[0], loin[1]),
        'pas de faux positif');

    console.log('\n── le bilan ──');
    /* « process is not defined » vient du décor, pas du jeu : ce banc tourne
   *  dans un navigateur, le jeu tourne dans NW.js qui fournit « process ».
   *  Vérifié en injectant un process de NW.js : ces erreurs-là tombent à
   *  zéro. On les écarte, mais on les affiche ; tout le reste reste une panne. */
    var horsNWjs = erreurs.filter(function (e) { return /process is not defined/.test(e); });
    var vraies = erreurs.filter(function (e) { return !/process is not defined/.test(e); });
    if (horsNWjs.length) { console.log('   (' + horsNWjs.length + ' « process is not defined » : propre au navigateur, mis de côté)'); }
    V('aucune erreur JavaScript', vraies.length === 0, vraies.slice(0, 3).join(' | ') || 'rien');

    console.log('\n' + '='.repeat(64));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(64));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
