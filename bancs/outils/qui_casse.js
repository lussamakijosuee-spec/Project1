/*
 * QUI CASSE LE DÉMARRAGE ?
 * ---------------------------------------------------------------------------
 * Quand le jeu ne va plus jusqu'au titre après avoir branché un lot de
 * plugins, lire les erreurs ne suffit pas : une seule erreur en entraîne
 * cinq autres, et le vrai coupable est rarement celui qui crie.
 *
 * Cet outil éteint TOUT le lot, puis rallume les plugins UN PAR UN, en
 * relançant le jeu à chaque fois. Celui qui fait basculer le démarrage est
 * le coupable, et on le sait sans discuter.
 *
 * Il remet js/plugins.js dans son état de départ en sortant, quoi qu'il
 * arrive — y compris si on l'interrompt.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/outils/qui_casse.js MOG_Compass YEP_ItemCore …
 *   node bancs/outils/qui_casse.js --tout-le-lot     (tous les plugins allumés)
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var CIBLE = path.join(RACINE, 'js', 'plugins.js');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

var ORIGINAL = fs.readFileSync(CIBLE, 'utf8');
function remettre() { fs.writeFileSync(CIBLE, ORIGINAL, 'utf8'); }
process.on('exit', remettre);
process.on('SIGINT', function () { remettre(); process.exit(130); });

function lire() {
    var t = fs.readFileSync(CIBLE, 'utf8');
    return JSON.parse(t.slice(t.indexOf('['), t.lastIndexOf(']') + 1));
}
function poser(liste) {
    var t = ORIGINAL;
    var corps = '[\n' + liste.map(function (p) { return JSON.stringify(p); }).join(',\n') + '\n]';
    fs.writeFileSync(CIBLE, t.slice(0, t.indexOf('[')) + corps + t.slice(t.lastIndexOf(']') + 1), 'utf8');
}

var args = process.argv.slice(2);
var base = lire();
var suspects;
if (args.indexOf('--tout-le-lot') >= 0) {
    // tous les plugins allumés, sans distinction de famille
    suspects = base.filter(function (p) { return p.status && !/^▬/.test(p.name); })
        .map(function (p) { return p.name; });
} else {
    suspects = args.filter(function (a) { return !/^--/.test(a); });
}
if (!suspects.length) { console.error('  donne des noms de plugins, ou --tout-le-lot.'); process.exit(1); }

/** Le jeu va-t-il jusqu'à son titre ? Retourne null si oui, le motif sinon. */
async function demarre(nav) {
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 120)); });
    page.on('response', function (r) {
        if (r.status() >= 400 && /\.(png|ogg|json|js)$/.test(r.url())) {
            erreurs.push('404 ' + r.url().replace(BASE, ''));
        }
    });
    var motif = null;
    try {
        await page.goto(BASE + '/index.html', { waitUntil: 'load' });
        await page.waitForFunction(function () {
            var s = SceneManager._scene;
            return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
        }, null, { timeout: 45000 });
    } catch (e) {
        motif = erreurs.length ? erreurs[0] : 'n\'atteint pas le titre';
    }
    await page.close();
    return { casse: motif, erreurs: erreurs };
}

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });

    console.log('═'.repeat(74));
    console.log('  QUI CASSE LE DÉMARRAGE ?  (' + suspects.length + ' suspect(s))');
    console.log('═'.repeat(74));

    /* ── 1. tout le lot éteint : le jeu doit repartir. Sinon le problème
     *      n'est pas dans le lot, et rallumer un par un ne prouverait rien. ── */
    var eteint = base.map(function (p) {
        return suspects.indexOf(p.name) >= 0 ? Object.assign({}, p, { status: false }) : p;
    });
    poser(eteint);
    var temoin = await demarre(nav);
    if (temoin.casse) {
        console.log('\n  ⚠ LE JEU NE DÉMARRE PAS MÊME AVEC TOUT LE LOT ÉTEINT.');
        console.log('    Le coupable est ailleurs : ' + temoin.casse);
        await nav.close(); process.exit(1);
    }
    console.log('\n  témoin : tout le lot éteint → le jeu démarre. ✔\n');

    /* ── 2. un par un ── */
    var coupables = [], sains = [];
    for (var i = 0; i < suspects.length; i++) {
        var nom = suspects[i];
        var essai = base.map(function (p) {
            if (suspects.indexOf(p.name) < 0) { return p; }
            return Object.assign({}, p, { status: p.name === nom });
        });
        poser(essai);
        var r = await demarre(nav);
        if (r.casse) {
            coupables.push({ n: nom, pourquoi: r.casse });
            console.log('   ✘ ' + nom.padEnd(34) + r.casse);
        } else {
            sains.push(nom);
            console.log('   ✔ ' + nom);
        }
    }

    /* ── 3. tous les sains ensemble : deux plugins inoffensifs seuls peuvent
     *      se casser l'un l'autre. Le un-par-un ne le verrait pas. ── */
    console.log('\n  ── et tous les sains ENSEMBLE ? ──');
    var ensemble = base.map(function (p) {
        if (suspects.indexOf(p.name) < 0) { return p; }
        return Object.assign({}, p, { status: sains.indexOf(p.name) >= 0 });
    });
    poser(ensemble);
    var fin = await demarre(nav);
    console.log(fin.casse ? '   ✘ ensemble, ils cassent : ' + fin.casse
        : '   ✔ les ' + sains.length + ' sains tiennent ensemble.');

    /* ── 4. si l'ensemble casse alors que chacun tient seul, c'est une
     *      QUERELLE : deux plugins qui se marchent dessus. On la cerne par
     *      dichotomie — on coupe le groupe en deux, on garde la moitié qui
     *      casse, on recommence — puis on remet un par un les écartés pour
     *      trouver le partenaire manquant. ── */
    async function avec(noms) {
        poser(base.map(function (p) {
            if (suspects.indexOf(p.name) < 0) { return p; }
            return Object.assign({}, p, { status: noms.indexOf(p.name) >= 0 });
        }));
        return (await demarre(nav)).casse;
    }
    if (fin.casse && sains.length > 1) {
        console.log('\n  ── la querelle, par dichotomie ──');
        var groupe = sains.slice();
        while (groupe.length > 1) {
            var moitie = groupe.slice(0, Math.ceil(groupe.length / 2));
            var casse = await avec(moitie);
            console.log('     ' + String(moitie.length).padStart(3) + ' plugins → ' + (casse ? 'casse' : 'tient'));
            if (casse) { groupe = moitie; }
            else {
                var autre = groupe.slice(Math.ceil(groupe.length / 2));
                if (await avec(autre)) { groupe = autre; }
                else { break; }   // la casse a besoin des deux moitiés
            }
        }
        if (groupe.length === 1) {
            console.log('     → ' + groupe[0] + ' seul suffit à casser QUAND il est dans le lot.');
        } else {
            // la casse est répartie : on cherche le plus petit noyau
            var noyau = groupe.slice();
            for (var j = 0; j < groupe.length; j++) {
                var essai2 = noyau.filter(function (x) { return x !== groupe[j]; });
                if (essai2.length && await avec(essai2)) { noyau = essai2; }
            }
            console.log('     → il en faut ' + noyau.length + ' réunis : ' + noyau.join(' + '));
        }
    }

    console.log('\n' + '═'.repeat(74));
    console.log('  ' + coupables.length + ' coupable(s) · ' + sains.length + ' sain(s)');
    coupables.forEach(function (c) { console.log('     ✘ ' + c.n + '  —  ' + c.pourquoi); });
    console.log('═'.repeat(74));
    console.log('  js/plugins.js est remis comme avant.');
    await nav.close();
})();
