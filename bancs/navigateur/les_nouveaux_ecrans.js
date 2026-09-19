/*
 * CE QUE LES PLUGINS BRANCHÉS CHANGENT À L'ÉCRAN
 * ---------------------------------------------------------------------------
 * Trente-huit plugins viennent d'être branchés. Les bancs disent qu'ils ne
 * cassent rien ; ils ne disent pas à quoi ça RESSEMBLE. Celui-ci ouvre les
 * écrans touchés et les photographie, pour que JOKO juge sur pièce.
 *
 * Il vérifie aussi ce qu'on ne voit pas sur une image : que les options
 * ajoutées existent vraiment, que les textes sont en français, et qu'une
 * fenêtre n'est pas passée sous une autre.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/les_nouveaux_ecrans.js
 */
'use strict';
var { chromium } = require('playwright');
var path = require('path');
var SHOTS = path.join(__dirname, 'captures') + path.sep;
require('fs').mkdirSync(SHOTS, { recursive: true });
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push('PAGEERROR: ' + e.message.slice(0, 140)); });
    page.on('console', function (m) { if (m.type() === 'error') { erreurs.push('CONSOLE: ' + m.text().slice(0, 140)); } });

    var ok = 0, ko = 0;
    var V = function (l, c, d) {
        if (c) { ok++; console.log('   OK  ' + l + (d ? '  — ' + d : '')); }
        else { ko++; console.log('   KO  ' + l + (d ? '  — ' + d : '')); }
    };
    var ev = function (f, a) { return page.evaluate(f, a); };
    var photo = async function (n) { await page.screenshot({ path: SHOTS + n + '.png' }); console.log('   [capture] ' + n); };
    var pause = function (ms) { return page.waitForTimeout(ms); };

    console.log('=== LES NOUVEAUX ÉCRANS ===\n');
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 120000 });
    await pause(700);

    console.log('1) Les plugins sont-ils vraiment en vie ?');
    /* ⚠ « a-t-il des réglages ? » n'est PAS la bonne question : certains
     *   plugins n'en ont aucun par construction (WindowLayers,
     *   WindowFrameAntiStretch). Les compter morts pour ça, c'est mesurer le
     *   motif au lieu du symptôme. On vérifie donc chacun sur ce qu'il FAIT :
     *   un réglage lu pour ceux qui en ont, une trace dans le moteur pour
     *   les autres. */
    var vivants = await ev(function () {
        function aDesReglages(n) {
            var p = PluginManager.parameters(n);
            return !!(p && Object.keys(p).length);
        }
        return {
            'SRD_GameUpgrade': aDesReglages('SRD_GameUpgrade'),
            'SRD_PreloaderCore': aDesReglages('SRD_PreloaderCore') && typeof Scene_Preload !== 'undefined',
            'SRD_OptionsUpgrade': aDesReglages('SRD_OptionsUpgrade') && typeof Window_OptionsCategory !== 'undefined',
            'SRD_MasterVolume': aDesReglages('SRD_MasterVolume') && 'masterVolume' in ConfigManager,
            'SRD_FullscreenToggleOption': aDesReglages('SRD_FullscreenToggleOption'),
            'SRD_ShakingText': aDesReglages('SRD_ShakingText'),
            'SRD_AudioFader': aDesReglages('SRD_AudioFader'),
            /* SRD_TimerUpgrade a été ÉTEINT volontairement : MOG_VisualTimer,
             * celui de JOKO avec ses images, fait déjà le travail. On vérifie
             * donc l'inverse — qu'il n'est PAS là, et que celui de JOKO l'est. */
            'SRD_CustomColors': aDesReglages('SRD_CustomColors'),
            // sans réglage : on les reconnaît à la marque qu'ils laissent
            /* ⚠ « addWindowLayer existe » ne prouve rien : MV nu l'a déjà.
             *   Ce que ce plugin fait vraiment, c'est remplacer le rendu
             *   masqué de WindowLayer par celui d'un conteneur PIXI ordinaire
             *   — chaque fenêtre dessinée sur son propre plan. C'est ÇA qu'on
             *   mesure, et l'égalité de fonction ne peut pas mentir. */
            'SRD_WindowLayers': typeof SRD !== 'undefined' && !!SRD.WindowLayers &&
                typeof WindowLayer !== 'undefined' && typeof PIXI !== 'undefined' &&
                (WindowLayer.prototype.renderWebGL === PIXI.Container.prototype.renderWebGL ||
                    WindowLayer.prototype._renderWebGL === (PIXI.DisplayObjectContainer || {}).prototype?._renderWebGL),
            'SRD_WindowFrameAntiStretch': !!(Window.prototype._refreshFrame &&
                /repeat|tile|drawPattern|_frameSprite\.children/.test(String(Window.prototype._refreshFrame)))
        };
    });
    var morts = Object.keys(vivants).filter(function (n) { return !vivants[n]; });
    V('les plugins branchés sont tous vivants', morts.length === 0,
        morts.join(', ') || 'les ' + Object.keys(vivants).length);

    /* Le chronomètre : un seul doit tenir l'écran, et c'est celui de JOKO. */
    var chrono = await ev(function () {
        return {
            mien: !!($plugins || []).filter(function (p) { return p.name === 'SRD_TimerUpgrade' && p.status; }).length,
            sien: !!($plugins || []).filter(function (p) { return p.name === 'MOG_VisualTimer' && p.status; }).length
        };
    });
    V('le chronomètre de JOKO est le seul allumé', chrono.sien && !chrono.mien,
        'MOG_VisualTimer ' + (chrono.sien ? 'allumé' : 'ÉTEINT') +
        ' · SRD_TimerUpgrade ' + (chrono.mien ? 'ALLUMÉ AUSSI' : 'éteint'));

    /* ── contre-épreuve : un plugin qu'on n'a PAS branché ne doit pas
     *    ressortir comme vivant, sinon ce contrôle ne prouve rien ── */
    var fantome = await ev(function () {
        var p = PluginManager.parameters('SRD_PKM_TypeSystem');
        return !!(p && Object.keys(p).length);
    });
    V('un plugin non branché reste absent (contre-épreuve)', !fantome,
        fantome ? 'SRD_PKM_TypeSystem répond alors qu\'il est éteint' : 'SRD_PKM_TypeSystem muet');

    console.log('\n2) L\'écran des options');
    await ev(function () { SceneManager.push(Scene_Options); });
    await pause(1400);
    var opt = await ev(function () {
        var s = SceneManager._scene;
        function lignes(w) {
            if (!w || !w.maxItems) { return []; }
            var l = [];
            for (var i = 0; i < w.maxItems(); i++) {
                try { l.push(w.commandName ? w.commandName(i) : ''); } catch (e) { l.push('?'); }
            }
            return l;
        }
        return {
            scene: s.constructor.name,
            // ⚠ deux fenêtres distinctes : les CATÉGORIES en haut, les
            //   OPTIONS de la catégorie choisie en dessous. Lire l'une en
            //   croyant lire l'autre, c'est ce qui m'a fait dire que les
            //   catégories étaient en anglais alors qu'elles n'étaient même
            //   pas celles que je regardais.
            categories: lignes(s._categoryWindow),
            options: lignes(s._optionsWindow)
        };
    });
    console.log('      catégories : ' + (opt.categories.join(' · ') || '(aucune)'));
    console.log('      options    : ' + opt.options.join(' · '));
    V('l\'écran des options s\'ouvre', opt.scene === 'Scene_Options', opt.scene);
    V('les options sont rangées en catégories', opt.categories.length > 0,
        opt.categories.length ? opt.categories.length + ' catégorie(s)' : 'liste à plat');
    var fr = opt.categories.join(' ');
    V('les catégories sont en français', /Général/.test(fr) && /Son/.test(fr) && /Fenêtre/.test(fr), fr);
    V('aucune catégorie n\'est restée en anglais', !/\bGeneral\b|\bWindow\b/.test(fr), fr);
    await photo('srd_01_options');

    /* les options ajoutées vivent dans une catégorie : on entre dedans */
    /* on parcourt TOUTES les catégories : une option ajoutée peut avoir
     * atterri dans n'importe laquelle, et la chercher dans une seule
     * reviendrait à conclure « absente » sur un mauvais endroit. */
    var toutes = {};
    for (var ci = 0; ci < opt.categories.length; ci++) {
        await ev(function (i) {
            var s = SceneManager._scene;
            s._categoryWindow.select(i);
            s._categoryWindow.processOk();
        }, ci);
        await pause(700);
        toutes[opt.categories[ci]] = await ev(function () {
            var w = SceneManager._scene._optionsWindow, l = [];
            if (w) { for (var i = 0; i < w.maxItems(); i++) { l.push(w.commandName(i)); } }
            return l;
        });
        await ev(function () {
            var s = SceneManager._scene;
            if (s._optionsWindow && s._optionsWindow.active) { s._optionsWindow.processCancel(); }
        });
        await pause(400);
    }
    Object.keys(toutes).forEach(function (c) {
        console.log('      ' + c.padEnd(12) + toutes[c].join(' · '));
    });
    var tout = [].concat.apply([], Object.keys(toutes).map(function (c) { return toutes[c]; }));
    V('le volume général est dans les options',
        tout.some(function (x) { return /volume général/i.test(x); }), tout.length + ' option(s) en tout');
    V('le plein écran est dans les options',
        tout.some(function (x) { return /plein écran/i.test(x); }), '');
    V('les options de JOKO sont toujours là',
        tout.some(function (x) { return /clavier/i.test(x); }), 'Clavier trouvé');
    await photo('srd_02_options_son');

    console.log('\n3) Le menu, la carte, le combat — rien n\'a bougé de travers');
    /* ⚠ Piège déjà payé une fois : « while (scène !== X) SceneManager.pop() »
     *   ne finit JAMAIS. MV ne change de scène qu'à l'image suivante, donc la
     *   boucle tourne pour l'éternité dans la même image et fige le
     *   navigateur. On va droit au but avec goto, et on ATTEND. */
    await ev(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () {
        return SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Map'
            && !SceneManager.isSceneChanging();
    }, null, { timeout: 40000 });
    await pause(1800);
    await photo('srd_03_carte');

    await ev(function () { SceneManager.push(Scene_Menu); });
    await pause(1400);
    var menu = await ev(function () {
        var s = SceneManager._scene;
        var c = s._commandWindow, l = [];
        if (c) { for (var i = 0; i < c.maxItems(); i++) { l.push(c.commandName(i)); } }
        return { scene: s.constructor.name, lignes: l, or: !!s._goldWindow };
    });
    V('le menu s\'ouvre encore', menu.scene === 'Scene_Menu', menu.scene);
    V('les commandes de JOKO sont toutes là', menu.lignes.length >= 6, menu.lignes.length + ' : ' + menu.lignes.join(' · '));
    V('la fenêtre d\'or est encore là', menu.or === true);
    await photo('srd_04_menu');

    console.log('\n4) Le combat s\'ouvre (c\'est ce que le préchargeur cassait)');
    await ev(function () { SceneManager.pop(); });   // quitter le menu — une fois, pas en boucle
    await page.waitForFunction(function () {
        return SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Map';
    }, null, { timeout: 30000 });
    await pause(900);
    await ev(function () { BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle); });
    await pause(4200);
    var bat = await ev(function () {
        var s = SceneManager._scene;
        return {
            scene: s.constructor.name,
            ennemis: $gameTroop ? $gameTroop.members().length : 0,
            bgm: AudioManager._currentBgm ? AudioManager._currentBgm.name : '(aucune)'
        };
    });
    V('le combat s\'ouvre', bat.scene === 'Scene_Battle', bat.scene + ' · ' + bat.ennemis + ' ennemi(s)');
    V('la musique de combat part', bat.bgm !== '(aucune)', bat.bgm);
    await photo('srd_05_combat');

    console.log('\n5) Le bilan');
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
