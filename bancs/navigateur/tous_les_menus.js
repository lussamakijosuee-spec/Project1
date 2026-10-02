/*
 * TOUS LES MENUS, OUVERTS ET PARCOURUS
 * ---------------------------------------------------------------------------
 * « Un écran ne se vérifie pas en lisant les données : il se vérifie en
 * l'ouvrant » (le plantage de l'Encyclopédie, voir LISEZ-MOI). Ce banc ouvre
 * CHAQUE commande du menu principal, telle que le joueur la voit, pour
 * chaque héros quand la commande en demande un, puis parcourt l'écran au
 * clavier : bas ×25, droite, gauche, page suivante, page précédente, OK sur
 * la première ligne, et retour. Il fait pareil avec l'écran-titre (Options,
 * Continuer) et l'écran de sauvegarde.
 *
 * Il relève : les erreurs JavaScript, les fichiers introuvables, un écran
 * qui ne s'ouvre pas, un écran dont on ne ressort pas.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/tous_les_menus.js
 */
'use strict';
var { chromium } = require('playwright');
var path = require('path');
var fs = require('fs');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var SHOTS = path.join(__dirname, 'captures', 'menus');

(async function () {
    fs.mkdirSync(SHOTS, { recursive: true });
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [], absents = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    page.on('response', function (r) { if (r.status() >= 400) absents.push(r.url().replace(BASE, '')); });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    var ev = function (f, a) { return page.evaluate(f, a); };
    async function touche(k, n) { for (var i = 0; i < (n || 1); i++) { await page.keyboard.down(k); await page.waitForTimeout(60); await page.keyboard.up(k); await page.waitForTimeout(70); } }
    async function scene() { return ev(function () { return SceneManager._scene ? SceneManager._scene.constructor.name : '?'; }); }
    async function stable() {
        await page.waitForFunction(function () { return SceneManager._scene && !SceneManager.isSceneChanging() && SceneManager._scene.isReady && SceneManager._scene.isReady(); }, null, { timeout: 20000 }).catch(function () {});
        await page.waitForTimeout(500);
    }

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });

    // ── le détecteur de texte coupé ──
    // Tout texte dessiné dans le contenu d'une fenêtre est mesuré : s'il
    // dépasse le bord droit (ou tombe sous le bas) du contenu, le joueur ne
    // le voit qu'en partie. On garde l'écran, la fenêtre et le texte.
    await ev(function () {
        window.__coupes = {};
        var _cc = Window_Base.prototype.createContents;
        Window_Base.prototype.createContents = function () {
            _cc.call(this);
            if (this.contents) this.contents.__fenetre = this.constructor.name;
        };
        var _dt = Bitmap.prototype.drawText;
        Bitmap.prototype.drawText = function (text, x, y, maxWidth, lineHeight, align) {
            if (this.__fenetre && text !== undefined && String(text).trim() && y >= 0 && y < this.height) {
                var w = Math.min(this.measureTextWidth(String(text)), maxWidth || 1e9);
                var x0 = align === 'center' ? x + ((maxWidth || 0) - w) / 2 : align === 'right' ? x + (maxWidth || 0) - w : x;
                var bas = y + (lineHeight || this.fontSize) - (lineHeight - this.fontSize * 0.7) / 2;
                if (x0 + w > this.width + 2 || (lineHeight && y + lineHeight * 0.75 > this.height + 2)) {
                    var sc = SceneManager._scene ? SceneManager._scene.constructor.name : '?';
                    var k = sc + ' · ' + this.__fenetre;
                    var e = (window.__coupes[k] = window.__coupes[k] || { n: 0, ex: '' });
                    e.n++; if (!e.ex || String(text).length > e.ex.length) e.ex = String(text).slice(0, 60);
                }
            }
            return _dt.apply(this, arguments);
        };
    });

    // ── l'écran-titre : Options ──
    console.log('\n── l\'écran-titre ──');
    var avantErr = erreurs.length;
    await ev(function () { SceneManager.push(Scene_Options); });
    await stable();
    var sc = await scene();
    await touche('ArrowDown', 30); await touche('ArrowRight', 2); await touche('ArrowLeft', 2);
    await page.screenshot({ path: path.join(SHOTS, 'titre_options.png') });
    await touche('Escape'); await stable();
    V('Options (depuis le titre) s\'ouvre, se parcourt et se referme', sc === 'Scene_Options' && erreurs.length === avantErr, sc + ' → ' + (await scene()));
    await ev(function () { ConfigManager.load(); });

    // ── une partie, sur la carte ──
    await ev(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && SceneManager._scene.isReady() && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);

    // les commandes du menu principal, telles que le joueur les voit
    await ev(function () { SceneManager.push(Scene_Menu); });
    await stable();
    var commandes = await ev(function () {
        var w = SceneManager._scene._commandWindow;
        return w._list.map(function (c, i) { return { i: i, nom: c.name.replace(/\\[A-Z]+\[\d+\]/gi, '').trim(), symbole: c.symbol, actif: c.enabled }; });
    });
    console.log('\n── le menu principal : ' + commandes.length + ' commandes ──');
    console.log('   ' + commandes.map(function (c) { return c.nom + (c.actif ? '' : ' (grisée)'); }).join(' · '));
    await page.screenshot({ path: path.join(SHOTS, 'menu.png') });

    var heros = await ev(function () { return $gameParty.members().length; });
    for (var k = 0; k < commandes.length; k++) {
        var c = commandes[k];
        if (!c.actif) { console.log('   ·  « ' + c.nom + ' » grisée — passée'); continue; }
        if (/gameEnd|toTitle|fin|quitter/i.test(c.symbole)) {
            // l'écran de fin s'ouvre, mais on n'y confirme rien
        }
        avantErr = erreurs.length;
        var nAbs = absents.length;
        // on choisit la commande comme le joueur : curseur + OK
        await ev(function (i) { var w = SceneManager._scene._commandWindow; w.select(i); w.activate(); }, c.i);
        await touche('Enter');
        await page.waitForTimeout(400);
        // une commande « personnelle » demande un héros : on prend le premier
        var demandeHeros = await ev(function () { var s = SceneManager._scene; return s instanceof Scene_Menu && s._statusWindow && s._statusWindow.active; });
        if (demandeHeros) { await touche('Enter'); }
        await stable();
        var ouvert = await scene();
        var parcouru = true;
        if (ouvert !== 'Scene_Menu') {
            await touche('ArrowDown', 25); await touche('ArrowRight'); await touche('ArrowLeft');
            await touche('PageDown'); await touche('PageUp');
            await page.screenshot({ path: path.join(SHOTS, 'cmd_' + String(k).padStart(2, '0') + '_' + c.symbole.replace(/\W/g, '') + '.png') });
            if (heros > 1) { await touche('w'); await touche('q'); }   // héros suivant / précédent (pageup/pagedown de MV)
        }
        // on ressort : retour jusqu'au menu, pas plus loin (l'écran de fin, lui, propose « annuler »)
        for (var r = 0; r < 8 && (await scene()) !== 'Scene_Menu'; r++) {
            if ((await scene()) === 'Scene_GameEnd') { await ev(function () { SceneManager._scene.popScene(); }); }
            else await touche('Escape');
            await page.waitForTimeout(450);
        }
        await stable();
        var revenu = (await scene()) === 'Scene_Menu';
        var e = erreurs.slice(avantErr), a = absents.slice(nAbs);
        V('« ' + c.nom + ' » (' + c.symbole + ')', revenu && !e.length && !a.length,
            ouvert + (revenu ? '' : ' — ON N\'EN RESSORT PAS') + (e.length ? ' — ' + e[0] : '') + (a.length ? ' — introuvable : ' + a[0] : ''));
        if (!revenu) { await ev(function () { SceneManager.goto(Scene_Menu); }); await stable(); }
    }

    // ── sauvegarder puis charger, par les écrans ──
    console.log('\n── sauvegarde et chargement, par les écrans ──');
    avantErr = erreurs.length;
    await ev(function () { SceneManager.push(Scene_Save); }); await stable();
    await touche('ArrowDown', 3); await touche('ArrowUp', 3);
    await page.screenshot({ path: path.join(SHOTS, 'sauvegarde.png') });
    await touche('Escape'); await stable();
    await ev(function () { SceneManager.push(Scene_Load); }); await stable();
    await touche('ArrowDown', 3);
    await page.screenshot({ path: path.join(SHOTS, 'chargement.png') });
    await touche('Escape'); await stable();
    V('les écrans de sauvegarde et de chargement s\'ouvrent et se parcourent', erreurs.length === avantErr, erreurs.slice(avantErr)[0] || 'rien');

    // Le texte coupé au bord d'une fenêtre : un caractère par appel dans
    // drawTextEx — on regroupe par écran et par fenêtre.
    var coupes = await ev(function () { return window.__coupes; });
    var cles = Object.keys(coupes);
    console.log('\n── du texte coupé au bord d\'une fenêtre : ' + cles.length + ' fenêtre(s) ──');
    cles.forEach(function (k) { console.log('   ⚠ ' + k + ' — ' + coupes[k].n + ' tracé(s) hors du cadre, ex. « ' + coupes[k].ex + ' »'); });

    console.log('\n── le bilan ──');
    // contre-épreuve faite le 2026-10-02 : avant les corrections, ce contrôle
    // trouvait l'Orbe, le journal des quêtes et le livre des musiques
    V('aucun texte coupé au bord d\'une fenêtre', cles.length === 0, cles.join(' | ') || 'rien');
    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    var vus = {}; absents.forEach(function (x) { vus[x] = 1; });
    V('aucun fichier introuvable', absents.length === 0, Object.keys(vus).slice(0, 4).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    console.log('  captures : ' + SHOTS);
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
