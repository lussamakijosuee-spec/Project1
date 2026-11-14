/*
 * LES MENUS
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-12 : « Continue dans les menus pour les améliorer ou refaire »,
 * puis, sur les six idées : « Oui tout ». (LesMenus.js, et les mots des réglages.)
 *
 *   ① le menu principal : toutes les commandes sans défiler, les cinq
 *      combattants à l'écran, le lieu, l'heure, les âmes et l'or ;
 *   ② les Carnets : les cinq écrans rangés dessous, chacun s'ouvre encore ;
 *   ③ plus un mot d'anglais : PV / PM / PT, l'écran d'équipement, la fiche d'un
 *      objet, la sauvegarde ;
 *   ④ le Statut : la description de chaque héros en entier ;
 *   ⑤ le Bestiaire : les rencontrés d'abord, une ligne pour les autres, le
 *      compte — et une créature rencontrée de plus le change ;
 *   ⑥ les Options : quatre groupes, aucune option perdue, le curseur ne
 *      s'arrête jamais sur un titre.
 *
 *   node bancs/navigateur/les_menus.js
 *   Captures : bancs/navigateur/captures/menu_principal.png, menu_carnets.png
 */
'use strict';
var { chromium } = require('playwright');
var http = require('http'), fs = require('fs'), path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var serveur = http.createServer(function (req, res) {
    var f = path.join(RACINE, decodeURIComponent(req.url.split('?')[0]));
    if (f.indexOf(RACINE) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200); fs.createReadStream(f).pipe(res);
});
var erreurs = [];
(async function () {
    var ok = 0, ko = 0, nav = null;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    try {
        await new Promise(function (r) { serveur.listen(0, '127.0.0.1', r); });
        nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
        var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
        page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 300)); });
        await page.goto('http://127.0.0.1:' + serveur.address().port + '/index.html', { waitUntil: 'load' });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 180000 });
        await page.evaluate(function () { DataManager.setupNewGame(); $gameParty._actors = [1, 2, 3, 4, 6]; $gameParty.gainGold(12345); $gamePlayer.reserveTransfer(29, 20, 20, 2, 0); SceneManager.goto(Scene_Map); });
        var carte = function () { return SceneManager._scene instanceof Scene_Map && SceneManager.isCurrentSceneStarted(); };
        var pasCarte = function (nom) { var s = SceneManager._scene; return s && s.constructor.name === nom && SceneManager.isCurrentSceneStarted(); };
        await page.waitForFunction(carte, null, { timeout: 120000 });
        var dossier = path.join(__dirname, 'captures'); if (!fs.existsSync(dossier)) fs.mkdirSync(dossier);
        var photo = async function (nom) { try { await page.waitForTimeout(500); await page.screenshot({ path: path.join(dossier, nom) }); } catch (e) { /* sans capture */ } };

        console.log('═'.repeat(74)); console.log('  LES MENUS'); console.log('═'.repeat(74));
        console.log('\n① Le menu principal');
        await page.evaluate(function () { SceneManager.push(Scene_Menu); });
        await page.waitForFunction(pasCarte, 'Scene_Menu', { timeout: 60000 });
        await photo('menu_principal.png');
        var r1 = await page.evaluate(function () {
            var S = SceneManager._scene, cw = S._commandWindow, sw = S._statusWindow, lw = S._lieuWindow, o = {};
            o.commandes = cw._list.map(function (c) { return c.name; });
            o.sansDefiler = cw.maxItems() <= cw.maxPageRows() && cw.y + cw.height <= Graphics.boxHeight;
            o.heros = $gameParty.size(); o.lignes = sw.numVisibleRows();
            var r = sw.itemRect(o.heros - 1); o.dernierDedans = r.y + r.height <= sw.contentsHeight() + 1;
            var ecrit = [], _dt = sw.drawText; sw.drawText = function (t) { ecrit.push(String(t)); _dt.apply(this, arguments); }; sw.refresh(); sw.drawText = _dt;
            o.noms = $gameParty.members().map(function (a) { return a.name(); }).filter(function (n) { return ecrit.indexOf(n) >= 0; }).length;
            o.barres = ecrit.filter(function (t) { return t === 'PV' || t === 'PM' || t === 'PT'; }).length;
            var v = $gameActors.actor(1); o.pv = ecrit.indexOf(String(v.hp).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' / ' + String(v.mhp).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')) >= 0;
            var e2 = [], _d2 = lw.drawText; lw.drawText = function (t) { e2.push(String(t)); _d2.apply(this, arguments); }; lw.refresh(); lw.drawText = _d2;
            o.lieu = e2; o.attendu = { lieu: LesMenus.lieu(), or: '12 345', ames: String(LesMenus.ames()) };
            // rien d'autre ne se dessine sous les commandes (l'or et la ligne des âmes d'avant sont cachés)
            o.dessous = S._windowLayer.children.filter(function (w) { return w !== lw && w.visible && w.x < cw.width && w.y >= cw.y + cw.height - 4 && w.openness > 0; }).length;
            return o;
        });
        V('toutes les commandes tiennent sans défiler', r1.sansDefiler && r1.commandes.length <= 10, r1.commandes.join(' · '));
        V('les cinq combattants sont à l\'écran, seiryu compris, avec PV, PM et PT', r1.heros === 5 && r1.lignes === 5 && r1.dernierDedans && r1.noms === 5 && r1.barres === 15 && r1.pv, r1.noms + ' noms, ' + r1.barres + ' barres');
        V('sous les commandes : le lieu, l\'heure, les âmes dites en toutes lettres, l\'or', r1.lieu.indexOf(r1.attendu.lieu) >= 0 && r1.lieu.indexOf('Heure') >= 0 && r1.lieu.indexOf('✦ Âmes') >= 0 && r1.lieu.indexOf(r1.attendu.ames) >= 0 && r1.lieu.indexOf(r1.attendu.or) >= 0 && r1.dessous === 0, r1.lieu.join(' | '));

        console.log('\n② Les Carnets');
        var r2 = await page.evaluate(function () {
            var S = SceneManager._scene, cw = S._commandWindow, o = {};
            o.ranges = cw._carnets.map(function (c) { return c.symbol; });
            o.absents = o.ranges.filter(function (s) { return cw.findSymbol(s) >= 0; }).length;
            o.place = cw._list.map(function (c) { return c.symbol; });
            cw.select(cw.findSymbol('carnets')); cw.processOk();
            var w = S._carnetsWindow;
            o.ouvert = !!w && w.visible && w.active && !cw.active; o.lignes = w ? w._list.map(function (c) { return c.name; }) : [];
            o.dedans = w ? w.y >= 0 && w.y + w.height <= Graphics.boxHeight && w.x + w.width <= Graphics.boxWidth : false;
            return o;
        });
        await photo('menu_carnets.png');
        V('Bestiaire, Encyclopédie, Musiques, Éléments et Statistiques sont sous « Carnets », après les Quêtes', r2.ranges.length === 5 && r2.absents === 0 && r2.place.indexOf('carnets') === r2.place.indexOf('quest') + 1, r2.lignes.join(' · '));
        V('OK ouvre la petite liste, dans l\'écran, et c\'est elle qui a la main', r2.ouvert && r2.dedans && r2.lignes.length === 5);
        // chaque carnet ouvre encore son écran
        var ouverts = [];
        for (var k = 0; k < 5; k++) {
            var nom = await page.evaluate(function (k) {
                var S = SceneManager._scene, cw = S._commandWindow;
                if (!S._carnetsWindow || !S._carnetsWindow.active) { cw.activate(); cw.select(cw.findSymbol('carnets')); cw.processOk(); }
                var w = S._carnetsWindow; w.select(k); var n = w.commandName(k); w.processOk(); return n;
            }, k);
            var change = await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name !== 'Scene_Menu' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 30000 }).then(function () { return true; }, function () { return false; });
            var sc = await page.evaluate(function () { return SceneManager._scene.constructor.name; });
            ouverts.push(nom + ' → ' + (change ? sc : '✗'));
            await page.evaluate(function () { if (!(SceneManager._scene instanceof Scene_Menu)) { SceneManager.pop(); } });
            await page.waitForFunction(pasCarte, 'Scene_Menu', { timeout: 60000 });
        }
        V('chacun des cinq ouvre encore son écran, et on revient au menu', ouverts.every(function (t) { return !/✗|Scene_Menu$/.test(t); }), ouverts.join(' ; '));
        var r2b = await page.evaluate(function () {
            var S = SceneManager._scene, cw = S._commandWindow;
            cw.activate(); cw.select(cw.findSymbol('carnets')); cw.processOk(); S._carnetsWindow.processCancel();
            return { ferme: !S._carnetsWindow.visible && !S._carnetsWindow.active && cw.active };
        });
        V('Annuler referme la liste et rend la main aux commandes', r2b.ferme);

        console.log('\n③ En français');
        var r3 = await page.evaluate(function () {
            var o = {};
            o.termes = [TextManager.hpA, TextManager.mpA, TextManager.tpA, TextManager.param(0), TextManager.param(1)];
            var k = LesMenus._equipTraduit, faux = { actor: function () { return { _equipments: [null], equips: function () { return [{}]; } }; }, _itemWindow: { item: function () { return {}; } }, _categoryWindow: { index: function () { return 0; } } };
            try { o.equip = k ? Scene_Equip.prototype[k].call(Object.create(Scene_Equip.prototype, { _itemWindow: { value: faux._itemWindow }, _categoryWindow: { value: faux._categoryWindow }, actor: { value: faux.actor } })).map(function (c) { return c[0] + '/' + c[1]; }) : null; } catch (e) { o.equip = 'erreur ' + e.message; }
            var I = PluginManager.parameters('YEP_ItemCore'), E = PluginManager.parameters('YEP_EquipCore'), Sv = PluginManager.parameters('YEP_SaveCore'), T = PluginManager.parameters('TSR_EquipSlots');
            o.reglages = [I['Recovery Format'], I['Add State'], I['Remove State'], I['Add Buff'], I['Remove Buff'], E['Empty Text'], Sv['Playtime'], Sv['Confirm Yes'], Sv['Confirm No'], T['Params Name Acronyms']];
            return o;
        });
        var anglais = /\b(HP|MP|TP|Heal|State|Buff|Empty|Playtime|Yes|No|MHP|MMP|ATK|DEF|MAT|MDF|LUK|remove|optimize|cancel|change|equip)\b/;
        V('PV, PM, PT, « PV max », « PM max »', r3.termes.join() === 'PV,PM,PT,PV max,PM max', r3.termes.join(', '));
        V('l\'écran d\'équipement : Changer, Optimiser, Annuler (les symboles, eux, n\'ont pas bougé)', Array.isArray(r3.equip) && r3.equip.join() === 'Changer/equip,Optimiser/optimize,Annuler/cancel', String(r3.equip));
        V('plus un mot d\'anglais dans les réglages de la fiche d\'objet, de l\'équipement et de la sauvegarde', r3.reglages.every(function (t) { return t && !anglais.test(String(t)); }), r3.reglages.slice(0, 9).join(' | '));

        console.log('\n④ Le Statut');
        await page.evaluate(function () { SceneManager.goto(Scene_Map); });
        await page.waitForFunction(carte, null, { timeout: 60000 });
        var r4 = [];
        for (var id of [1, 2, 3, 4]) {
            await page.evaluate(function (id) { $gameParty.setMenuActor($gameActors.actor(id)); SceneManager.push(Scene_Status); }, id);
            await page.waitForFunction(pasCarte, 'Scene_Status', { timeout: 60000 });
            r4.push(await page.evaluate(function () {
                var w = SceneManager._scene._statusWindow, a = w._actor, ecrit = [], _dt = w.drawText;
                w.drawText = function (t) { ecrit.push(String(t)); _dt.apply(this, arguments); }; w.refresh(); w.drawText = _dt;
                var texte = String(a.profile() || '').replace(/\s+/g, ' ').trim(), fin = texte.slice(-25);
                return { nom: a.name(), lignes: w._profilLignes, coupe: w._profilCoupe, fin: ecrit.some(function (t) { return t.replace(/\s+/g, ' ').trim().slice(-25) === fin; }), n: texte.length };
            }));
            await page.evaluate(function () { SceneManager.goto(Scene_Map); });
            await page.waitForFunction(carte, null, { timeout: 60000 });
        }
        V('la description de chaque héros est écrite jusqu\'à son dernier mot', r4.every(function (x) { return !x.coupe && x.fin; }), r4.map(function (x) { return x.nom + ' ' + x.n + ' signes, ' + x.lignes + ' lignes'; }).join(' · '));

        console.log('\n⑤ Le Bestiaire');
        await page.evaluate(function () { [1, 2, 3].forEach(function (i) { $gameSystem.addToEnemyBook(i); }); SceneManager.push(Scene_EnemyBook); });
        await page.waitForFunction(pasCarte, 'Scene_EnemyBook', { timeout: 60000 });
        var r5 = await page.evaluate(function () {
            var S = SceneManager._scene, w = S._indexWindow, c = LesMenus.bestiaire(), o = { compte: c };
            o.liste = w._list.length; o.vusDabord = w._list.slice(0, c.vus).every(function (e) { return e.name && $gameSystem.isInEnemyBook(e); });
            o.derniere = w._list[w._list.length - 1]._inconnus;
            var ecrit = [], _dt = w.drawText; w.drawText = function (t) { ecrit.push(String(t)); _dt.apply(this, arguments); }; for (var i = 0; i < w.maxItems(); i++) w.drawItem(i); w.drawText = _dt;
            o.mur = ecrit.filter(function (t) { return t === '??????'; }).length; o.ligne = ecrit[ecrit.length - 1];
            // sur la ligne des inconnus, le bas dit le compte
            w.select(w.maxItems() - 1); w.updateStatus();
            var st = S._statusWindow, e2 = [], _d2 = st.drawText; st.drawText = function (t) { e2.push(String(t)); _d2.apply(this, arguments); }; st.refresh(); st.drawText = _d2;
            o.bas = e2;
            // une créature de plus
            var id = 0; for (var k = 1; k < $dataEnemies.length && !id; k++) { var e = $dataEnemies[k]; if (e && e.name && e.meta.book !== 'no' && !$gameSystem.isInEnemyBook(e)) id = k; }
            $gameSystem.addToEnemyBook(id); w.refresh(); o.apres = LesMenus.bestiaire().vus; o.listeApres = w._list.length;
            return o;
        });
        V('les créatures rencontrées d\'abord, puis une seule ligne pour les autres (plus de mur de « ?????? »)', r5.compte.vus >= 3 && r5.liste === r5.compte.vus + 1 && r5.vusDabord && r5.derniere === r5.compte.total - r5.compte.vus && r5.mur === 0, r5.ligne);
        V('le bas dit le compte', r5.bas.indexOf(r5.compte.vus + ' / ' + r5.compte.total) >= 0, r5.bas.slice(0, 2).join(' '));
        V('contre-épreuve : une créature rencontrée de plus entre dans la liste et dans le compte', r5.apres === r5.compte.vus + 1 && r5.listeApres === r5.liste + 1, r5.compte.vus + ' → ' + r5.apres);
        await page.evaluate(function () { SceneManager.goto(Scene_Map); });
        await page.waitForFunction(carte, null, { timeout: 60000 });

        console.log('\n⑥ Les Options');
        await page.evaluate(function () { SceneManager.push(Scene_Options); });
        await page.waitForFunction(pasCarte, 'Scene_Options', { timeout: 60000 });
        var r6 = await page.evaluate(function () {
            var w = SceneManager._scene._optionsWindow, o = {};
            var titres = w._list.filter(function (c) { return /^titre_/.test(c.symbol); });
            o.titres = titres.map(function (c) { return c.name; });
            var options = w._list.filter(function (c) { return !/^titre_/.test(c.symbol); });
            o.n = options.length; o.doubles = options.length - options.map(function (c) { return c.symbol; }).filter(function (s, i, l) { return l.indexOf(s) === i; }).length;
            o.connues = ['alwaysDash', 'bgmVolume', 'vitesseCombat', 'vitesseTexte'].filter(function (s) { return w.findSymbol(s) < 0; });
            // où tombent quelques options connues
            function groupe(s) { var i = w.findSymbol(s), g = ''; for (var k = i; k >= 0; k--) { if (/^titre_/.test(w.commandSymbol(k))) { g = w.commandName(k); break; } } return g; }
            o.groupes = { bgmVolume: groupe('bgmVolume'), vitesseCombat: groupe('vitesseCombat'), vitesseTexte: groupe('vitesseTexte'), alwaysDash: groupe('alwaysDash') };
            // le curseur : un tour complet vers le bas, puis vers le haut
            var surTitre = 0, vus = {};
            w.select(0); for (var i = 0; i < w.maxItems() + 3; i++) { if (/^titre_/.test(w.commandSymbol(w.index()))) surTitre++; vus[w.index()] = 1; w.cursorDown(true); }
            for (var j = 0; j < w.maxItems() + 3; j++) { if (/^titre_/.test(w.commandSymbol(w.index()))) surTitre++; vus[w.index()] = 1; w.cursorUp(true); }
            o.surTitre = surTitre; o.atteintes = Object.keys(vus).length;
            // une option marche encore
            var avant = ConfigManager.alwaysDash; w.select(w.findSymbol('alwaysDash')); w.processOk(); o.bascule = ConfigManager.alwaysDash !== avant; w.processOk();
            return o;
        });
        V('quatre groupes : Jeu, Combat, Affichage, Son', r6.titres.join() === 'Jeu,Combat,Affichage,Son', r6.n + ' options');
        V('aucune option perdue ni doublée, chacune dans son groupe', r6.doubles === 0 && !r6.connues.length && r6.groupes.bgmVolume === 'Son' && r6.groupes.vitesseCombat === 'Combat' && r6.groupes.vitesseTexte === 'Affichage' && r6.groupes.alwaysDash === 'Jeu', JSON.stringify(r6.groupes));
        V('le curseur ne s\'arrête jamais sur un titre, atteint toutes les options, et une option bascule encore', r6.surTitre === 0 && r6.atteintes === r6.n && r6.bascule, r6.atteintes + ' / ' + r6.n);
        V('aucune erreur dans la page', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
    } catch (e) {
        ko++; console.log('   ✗ le banc a planté : ' + (e && e.stack || e)); if (erreurs.length) console.log('     erreurs : ' + erreurs.slice(0, 3).join(' | '));
    } finally { if (nav) await nav.close(); serveur.close(); }
    console.log('\n' + (ko ? '❌ ' + ko + ' échec(s), ' : '✅ ') + ok + ' contrôle(s) réussi(s)');
    process.exit(ko ? 1 : 0);
})();
