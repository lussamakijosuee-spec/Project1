/*
 * CE QUE LES PLUGINS COÛTENT, ET CE QU'ILS RAPPORTENT
 * ---------------------------------------------------------------------------
 * JOKO vient d'installer 130 plugins d'un coup. Avant d'en allumer un seul,
 * il faut un point de comparaison : combien de temps le jeu met à démarrer,
 * combien d'images par seconde il tient, combien de mémoire il prend, et
 * surtout COMBIEN DE FICHIERS IL VA CHERCHER.
 *
 * Ce dernier chiffre est le seul qui compte vraiment pour la lenteur : chaque
 * plugin inscrit dans js/plugins.js est une requête réseau de plus AVANT que
 * le titre s'affiche, qu'il serve à quelque chose ou non. Un plugin éteint
 * (« status: false ») n'est pas chargé — c'est pour ça que 130 fichiers
 * peuvent dormir sur le disque sans rien coûter.
 *
 * Il ne modifie rien. Il mesure, il écrit le résultat, on compare après.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/le_poids_des_plugins.js            (mesure)
 *   node bancs/navigateur/le_poids_des_plugins.js --avant    (mesure ET enregistre comme référence)
 */

'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var REF = path.join(__dirname, 'poids_reference.json');
var ENREGISTRER = process.argv.indexOf('--avant') >= 0;

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });

    var erreurs = [], absents = [], requetesJS = 0, octetsJS = 0;
    page.on('pageerror', function (e) { erreurs.push('PAGEERROR: ' + e.message.slice(0, 180)); });
    page.on('console', function (m) { if (m.type() === 'error') { erreurs.push('CONSOLE: ' + m.text().slice(0, 180)); } });
    page.on('response', function (r) {
        var u = r.url();
        if (r.status() >= 400) { absents.push('HTTP ' + r.status() + ' ' + u.replace(BASE, '')); }
        if (/\/js\/plugins\//.test(u)) {
            requetesJS++;
            var l = r.headers()['content-length'];
            if (l) { octetsJS += parseInt(l, 10); }
        }
    });

    var t0 = Date.now();
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    try {
        await page.waitForFunction(function () {
            var s = SceneManager._scene;
            return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
        }, null, { timeout: 60000 });
    } catch (e) {
        /* ⚠ Un banc qui meurt en silence ne sert à rien. Si le titre n'arrive
         *   pas, c'est justement le moment où il faut dire CE QUI a cassé :
         *   la scène atteinte, les erreurs, les fichiers introuvables. */
        console.log('═'.repeat(72));
        console.log('  LE JEU N\'ATTEINT PAS SON TITRE');
        console.log('═'.repeat(72));
        var ou = await page.evaluate(function () {
            return {
                scene: SceneManager._scene ? SceneManager._scene.constructor.name : '(aucune)',
                erreurMV: (document.querySelector('.error-title') || {}).textContent || '',
                detail: (document.querySelector('.error-message') || {}).textContent || '',
                plugins: typeof $plugins !== 'undefined' ? $plugins.length : -1
            };
        }).catch(function () { return { scene: '(page morte)' }; });
        console.log('   scène atteinte : ' + ou.scene);
        if (ou.erreurMV) { console.log('   MV affiche     : ' + ou.erreurMV + ' — ' + ou.detail); }
        console.log('\n   ── erreurs (' + erreurs.length + ') ──');
        erreurs.slice(0, 12).forEach(function (x) { console.log('     ' + x); });
        console.log('\n   ── fichiers introuvables (' + absents.length + ') ──');
        var vu = {}; absents.forEach(function (x) { vu[x] = 1; });
        Object.keys(vu).slice(0, 12).forEach(function (x) { console.log('     ' + x); });
        await page.screenshot({ path: path.join(__dirname, 'captures', 'plugins_bloque.png') });
        await nav.close();
        process.exit(1);
    }
    var demarrage = Date.now() - t0;

    /* ── les images par seconde, mesurées sur 3 secondes de titre ── */
    var fps = await page.evaluate(function () {
        return new Promise(function (resolve) {
            var n = 0, debut = performance.now();
            function tic() {
                n++;
                if (performance.now() - debut < 3000) { requestAnimationFrame(tic); }
                else { resolve(Math.round(n / ((performance.now() - debut) / 1000))); }
            }
            requestAnimationFrame(tic);
        });
    });

    var memoire = await page.evaluate(function () {
        return performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : -1;
    });

    /* ── ce que le moteur a réellement chargé ── */
    var etat = await page.evaluate(function () {
        var inscrits = ($plugins || []).filter(function (p) { return !/^▬/.test(p.name); });
        return {
            inscrits: inscrits.length,
            actifs: inscrits.filter(function (p) { return p.status; }).length,
            // un plugin est vraiment là si PluginManager a retenu ses paramètres
            parametres: Object.keys(PluginManager._parameters || {}).length
        };
    });

    var mesure = {
        quand: new Date().toISOString().slice(0, 19),
        demarrage: demarrage,
        fps: fps,
        memoire: memoire,
        requetesJS: requetesJS,
        kilooctetsJS: Math.round(octetsJS / 1024),
        inscrits: etat.inscrits,
        actifs: etat.actifs,
        erreurs: erreurs.length,
        absents: absents.length
    };

    console.log('═'.repeat(72));
    console.log('  LE POIDS DES PLUGINS');
    console.log('═'.repeat(72));
    console.log('   démarrage jusqu\'au titre : ' + demarrage + ' ms');
    console.log('   images par seconde        : ' + fps);
    console.log('   mémoire                   : ' + memoire + ' Mo');
    console.log('   fichiers js/plugins/ tirés : ' + requetesJS + '  (' + Math.round(octetsJS / 1024) + ' Ko)');
    console.log('   plugins inscrits / actifs  : ' + etat.inscrits + ' / ' + etat.actifs);
    console.log('   erreurs                    : ' + erreurs.length);
    console.log('   fichiers manquants         : ' + absents.length);

    if (erreurs.length) {
        console.log('\n   ── les erreurs ──');
        erreurs.slice(0, 20).forEach(function (e) { console.log('     ' + e); });
        if (erreurs.length > 20) { console.log('     … et ' + (erreurs.length - 20) + ' autres'); }
    }
    if (absents.length) {
        console.log('\n   ── les fichiers que le jeu réclame sans les trouver ──');
        var u = {}; absents.forEach(function (a) { u[a] = (u[a] || 0) + 1; });
        Object.keys(u).slice(0, 20).forEach(function (a) { console.log('     ' + a + (u[a] > 1 ? '  ×' + u[a] : '')); });
        if (Object.keys(u).length > 20) { console.log('     … et ' + (Object.keys(u).length - 20) + ' autres'); }
    }

    /* ── la comparaison ── */
    if (ENREGISTRER) {
        fs.writeFileSync(REF, JSON.stringify(mesure, null, 1), 'utf8');
        console.log('\n   référence enregistrée : bancs/navigateur/poids_reference.json');
    } else if (fs.existsSync(REF)) {
        var av = JSON.parse(fs.readFileSync(REF, 'utf8'));
        console.log('\n' + '─'.repeat(72));
        console.log('  AVANT (' + av.quand + ')   →   MAINTENANT');
        console.log('─'.repeat(72));
        var ligne = function (nom, a, b, unite, mieuxSiBas) {
            var d = b - a;
            var fleche = d === 0 ? '  =' : (d > 0 ? ' +' + d : ' ' + d);
            var juge = d === 0 ? '' : ((mieuxSiBas ? d < 0 : d > 0) ? '   ✔' : '   ⚠');
            console.log('   ' + nom.padEnd(28) + String(a).padStart(7) + ' → ' + String(b).padStart(7) + ' ' + unite.padEnd(4) + fleche.padStart(8) + juge);
        };
        ligne('démarrage', av.demarrage, mesure.demarrage, 'ms', true);
        ligne('images par seconde', av.fps, mesure.fps, '', false);
        ligne('mémoire', av.memoire, mesure.memoire, 'Mo', true);
        ligne('fichiers plugins tirés', av.requetesJS, mesure.requetesJS, '', true);
        ligne('poids des plugins', av.kilooctetsJS, mesure.kilooctetsJS, 'Ko', true);
        ligne('plugins actifs', av.actifs, mesure.actifs, '', false);
        ligne('erreurs', av.erreurs, mesure.erreurs, '', true);
        ligne('fichiers manquants', av.absents, mesure.absents, '', true);
    }

    console.log('\n' + '═'.repeat(72));
    await nav.close();
    process.exit(erreurs.length > 0 ? 1 : 0);
})();
