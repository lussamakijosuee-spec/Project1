/*
 * DEUX CHRONOMÈTRES POUR UNE SEULE HORLOGE
 * ---------------------------------------------------------------------------
 * MOG_VisualTimer (celui de JOKO, avec ses images Timer_Gauge, Timer_Layout,
 * Timer_Number) et SRD_TimerUpgrade (que j'ai branché ce mois-ci) réécrivent
 * tous les deux Spriteset_Base.createTimer, Game_Timer.initialize et
 * Game_Timer.start.
 *
 * Lire le code ne suffit pas à trancher : SRD ne remplace pas bêtement, il
 * CAPTURE la fonction de MOG (Scene_Base.prototype.createTimer = Spriteset_
 * Base.prototype.createTimer) puis vide l'originale. Selon l'ordre de
 * chargement, ça peut aussi bien préserver le chronomètre de JOKO que
 * l'effacer.
 *
 * Alors on lance le chronomètre pour de vrai, et on regarde ce qui est à
 * l'écran — dans les deux configurations.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/le_chronometre.js
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var CIBLE = path.join(RACINE, 'js', 'plugins.js');
var SHOTS = path.join(__dirname, 'captures') + path.sep;
fs.mkdirSync(SHOTS, { recursive: true });
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

var ORIGINAL = fs.readFileSync(CIBLE, 'utf8');
process.on('exit', function () { fs.writeFileSync(CIBLE, ORIGINAL, 'utf8'); });
process.on('SIGINT', function () { fs.writeFileSync(CIBLE, ORIGINAL, 'utf8'); process.exit(130); });
var d0 = ORIGINAL.indexOf('['), f0 = ORIGINAL.lastIndexOf(']');
function poser(eteints) {
    var a = JSON.parse(ORIGINAL.slice(d0, f0 + 1));
    a.forEach(function (p) { if (eteints.indexOf(p.name) >= 0) { p.status = false; } });
    fs.writeFileSync(CIBLE, ORIGINAL.slice(0, d0) + '[\n' +
        a.map(function (p) { return JSON.stringify(p); }).join(',\n') + '\n]' + ORIGINAL.slice(f0 + 1), 'utf8');
}

var ok = 0, ko = 0;
function V(l, c, d) {
    if (c) { ok++; console.log('   OK  ' + l + (d ? '  — ' + d : '')); }
    else { ko++; console.log('   KO  ' + l + (d ? '  — ' + d : '')); }
}

/** Lance le chronomètre 60 secondes sur la carte et rend ce qu'on voit. */
async function regarder(nav, libelle, nomCapture) {
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var img404 = [];
    page.on('response', function (r) {
        if (r.status() >= 400 && /Timer/i.test(r.url())) { img404.push(r.url().split('/').pop()); }
    });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 120000 });
    await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () {
        return SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Map'
            && !SceneManager.isSceneChanging();
    }, null, { timeout: 40000 });
    await page.waitForTimeout(1800);
    await page.evaluate(function () { $gameTimer.start(60 * 60); });   // 60 secondes
    await page.waitForTimeout(2500);

    var vu = await page.evaluate(function () {
        /* On cherche un sprite de chronomètre PARTOUT : le moteur le pose
         * soit dans le spriteset (MV nu et MOG), soit dans la scène (ce que
         * fait SRD). Chercher à un seul endroit conclurait « absent » par
         * erreur. */
        function fouiller(racine, prof) {
            var out = [];
            if (!racine || !racine.children || prof > 6) { return out; }
            racine.children.forEach(function (c) {
                var n = c.constructor ? c.constructor.name : '?';
                if (/Timer/i.test(n)) {
                    out.push({ classe: n, visible: c.visible !== false, opacite: c.opacity, x: Math.round(c.x), y: Math.round(c.y) });
                }
                out = out.concat(fouiller(c, prof + 1));
            });
            return out;
        }
        var s = SceneManager._scene;
        return {
            secondes: $gameTimer.seconds(),
            tourne: $gameTimer.isWorking(),
            sprites: fouiller(s, 0),
            // que vaut la fonction du moteur, au bout du compte ?
            createTimerVide: String(Spriteset_Base.prototype.createTimer).replace(/\s+/g, '') === 'function(){}',
            surScene: typeof Scene_Base.prototype.createTimer === 'function'
        };
    });
    await page.screenshot({ path: SHOTS + nomCapture + '.png' });
    console.log('   [capture] ' + nomCapture);
    await page.close();
    vu.img404 = img404;
    vu.libelle = libelle;
    return vu;
}

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    console.log('=== DEUX CHRONOMÈTRES POUR UNE SEULE HORLOGE ===\n');

    console.log('1) Les deux allumés, comme aujourd\'hui');
    poser([]);
    var deux = await regarder(nav, 'les deux', 'chrono_les_deux');
    console.log('      ' + deux.secondes + ' s · ' + deux.sprites.length + ' sprite(s) de chrono : ' +
        deux.sprites.map(function (s) { return s.classe + (s.visible ? '' : ' (caché)'); }).join(', ') || '(aucun)');
    if (deux.img404.length) { console.log('      images manquantes : ' + deux.img404.join(', ')); }

    console.log('\n2) Seulement celui de JOKO (MOG_VisualTimer)');
    poser(['SRD_TimerUpgrade']);
    var mog = await regarder(nav, 'MOG seul', 'chrono_mog_seul');
    console.log('      ' + mog.secondes + ' s · ' + mog.sprites.length + ' sprite(s) de chrono : ' +
        mog.sprites.map(function (s) { return s.classe; }).join(', ') || '(aucun)');

    console.log('\n3) Seulement le mien (SRD_TimerUpgrade)');
    poser(['MOG_VisualTimer']);
    var srd = await regarder(nav, 'SRD seul', 'chrono_srd_seul');
    console.log('      ' + srd.secondes + ' s · ' + srd.sprites.length + ' sprite(s) de chrono : ' +
        srd.sprites.map(function (s) { return s.classe; }).join(', ') || '(aucun)');

    console.log('\n4) Le verdict');
    V('le chronomètre tourne dans les trois cas',
        deux.tourne && mog.tourne && srd.tourne,
        [deux, mog, srd].map(function (x) { return x.libelle + ':' + (x.tourne ? 'oui' : 'NON'); }).join(' · '));
    V('quelque chose s\'affiche quand les deux sont allumés',
        deux.sprites.length > 0,
        deux.sprites.length + ' sprite(s)');
    /* ⚠ La question qui tranche : avec les deux allumés, voit-on le
     *   chronomètre de JOKO, ou celui que j'ai ajouté par-dessus ? On compare
     *   les classes de sprites, pas les impressions. */
    var classes = function (x) { return x.sprites.map(function (s) { return s.classe; }).sort().join(','); };
    var commeMog = classes(deux) === classes(mog);
    var commeSrd = classes(deux) === classes(srd);
    console.log('      les deux → ' + (classes(deux) || '(rien)'));
    console.log('      MOG seul → ' + (classes(mog) || '(rien)'));
    console.log('      moi seul → ' + (classes(srd) || '(rien)'));
    V('avec les deux, c\'est le chronomètre de JOKO qu\'on voit',
        commeMog && !commeSrd,
        commeSrd ? 'non : c\'est le mien qui gagne, celui de JOKO est écrasé'
            : commeMog ? 'oui' : 'ni l\'un ni l\'autre — les deux se sont annulés');
    V('les images de JOKO se chargent quand les deux sont allumés',
        deux.img404.length === 0, deux.img404.join(', ') || 'aucune manquante');

    console.log('\n' + '='.repeat(64));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('  js/plugins.js est remis comme avant.');
    console.log('='.repeat(64));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
