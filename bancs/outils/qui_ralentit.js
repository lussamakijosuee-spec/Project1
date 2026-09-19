/*
 * QUI RALENTIT LE DÉMARRAGE ?
 * ---------------------------------------------------------------------------
 * Brancher des plugins allonge le démarrage : chacun est un fichier à aller
 * chercher. Mais un fichier de 40 Ko ne coûte pas six secondes. Quand le
 * démarrage explose, c'est UN plugin qui travaille avant le titre, pas les
 * trente-huit.
 *
 * Cet outil éteint un plugin à la fois et regarde ce que le démarrage y
 * gagne. Celui dont l'absence fait gagner des secondes est le coupable ;
 * les autres coûtent quelques dizaines de millisecondes, ce qui est le prix
 * normal d'un fichier de plus.
 *
 * ⚠ Une seule mesure ne vaut rien : le démarrage varie d'une fois sur
 *   l'autre. On mesure donc d'abord le TOUT plusieurs fois pour connaître
 *   cette variation, et on ne retient un écart que s'il la dépasse.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/outils/qui_ralentit.js                    (tous les allumés)
 *   node bancs/outils/qui_ralentit.js MOG_Weather_EX YEP_MessageCore …
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var CIBLE = path.join(RACINE, 'js', 'plugins.js');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

var ORIGINAL = fs.readFileSync(CIBLE, 'utf8');
process.on('exit', function () { fs.writeFileSync(CIBLE, ORIGINAL, 'utf8'); });
process.on('SIGINT', function () { fs.writeFileSync(CIBLE, ORIGINAL, 'utf8'); process.exit(130); });

var d0 = ORIGINAL.indexOf('['), f0 = ORIGINAL.lastIndexOf(']');
var base = JSON.parse(ORIGINAL.slice(d0, f0 + 1));
function poser(sansCes) {
    var l = base.map(function (p) {
        return sansCes.indexOf(p.name) >= 0 ? Object.assign({}, p, { status: false }) : p;
    });
    fs.writeFileSync(CIBLE, ORIGINAL.slice(0, d0) + '[\n' + l.map(function (p) { return JSON.stringify(p); }).join(',\n') + '\n]' + ORIGINAL.slice(f0 + 1), 'utf8');
}

var suspects = process.argv.slice(2).filter(function (a) { return !/^--/.test(a); });
if (!suspects.length) {
    // sans argument : TOUS les plugins allumés. Compter une famille en
    // particulier était une commodité du jour où on en branchait une ;
    // ça n'a plus de sens, et ça cacherait le vrai coupable.
    suspects = base.filter(function (p) { return p.status && !/^▬/.test(p.name); })
        .map(function (p) { return p.name; });
}

async function mesure(nav) {
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var t0 = Date.now(), ok = true;
    try {
        await page.goto(BASE + '/index.html', { waitUntil: 'load' });
        await page.waitForFunction(function () {
            var s = SceneManager._scene;
            return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
        }, null, { timeout: 60000 });
    } catch (e) { ok = false; }
    var ms = Date.now() - t0;
    await page.close();
    return ok ? ms : -1;
}

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    console.log('═'.repeat(70));
    console.log('  QUI RALENTIT LE DÉMARRAGE ?');
    console.log('═'.repeat(70));

    /* ── le bruit de fond : trois mesures du même état ── */
    poser([]);
    var temoins = [];
    for (var k = 0; k < 3; k++) { temoins.push(await mesure(nav)); }
    var moyenne = Math.round(temoins.reduce(function (a, b) { return a + b; }, 0) / temoins.length);
    var bruit = Math.max.apply(null, temoins) - Math.min.apply(null, temoins);
    console.log('\n   tout allumé : ' + temoins.join(' · ') + ' ms');
    console.log('   moyenne ' + moyenne + ' ms, variation naturelle ' + bruit + ' ms');
    console.log('   → on ne retient un gain que s\'il dépasse ' + Math.max(bruit, 300) + ' ms\n');
    var seuil = Math.max(bruit, 300);

    var res = [];
    for (var i = 0; i < suspects.length; i++) {
        poser([suspects[i]]);
        var t = await mesure(nav);
        var gain = t < 0 ? 0 : moyenne - t;
        res.push({ n: suspects[i], t: t, gain: gain });
        var verdict = t < 0 ? '(ne démarre plus sans lui)'
            : (gain > seuil ? '← COÛTE ' + gain + ' ms' : '');
        console.log('   sans ' + suspects[i].padEnd(34) + String(t).padStart(6) + ' ms   ' + verdict);
    }

    res.sort(function (a, b) { return b.gain - a.gain; });
    console.log('\n' + '─'.repeat(70));
    console.log('  LES PLUS CHERS');
    console.log('─'.repeat(70));
    res.slice(0, 6).forEach(function (r) {
        console.log('   ' + r.n.padEnd(36) + (r.gain > seuil ? String(r.gain) + ' ms' : 'dans le bruit'));
    });
    console.log('\n  js/plugins.js est remis comme avant.');
    await nav.close();
})();
