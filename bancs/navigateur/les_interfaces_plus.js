/*
 * INTERFACEPLUS, DANS LE VRAI MOTEUR
 * ---------------------------------------------------------------------------
 *   ① TOUCHE M n : la touche M lance l'événement commun n ; une touche non
 *     liée ne fait rien ; « TOUCHE M off » délie (contre-épreuves)
 *   ② IMAGE clic : un clic SUR l'image lance l'événement commun (et le
 *     joueur ne part pas marcher vers le clic) ; à côté, rien
 *   ③ MENU_EC : la liste montre les noms, cache celui dont la condition
 *     <si: …> est fausse ; le choix est joué puis l'événement reprend ;
 *     Échap ne joue rien et l'événement reprend aussi
 *   ④ événements communs automatiques : une fuite (combat abandonné) lance
 *     celui de « fuite », une montée de niveau celui de « niveau » avec le
 *     numéro du héros ; un moment sans événement commun ne lance rien, et
 *     rien ne coupe un événement en cours (contre-épreuves)
 *   ⑤ CHOISIR : la compétence ou l'arme choisie va dans la variable ; Échap
 *     y met 0
 *   ⑥ <Boutique si: s[30]> : l'objet n'est pas en vente interrupteur OFF, il
 *     l'est ON, et les prix restent en face des bons objets
 *
 *   node bancs/navigateur/les_interfaces_plus.js
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    var ev = function (f, a) { return page.evaluate(f, a); };
    async function touche(k) { await page.keyboard.down(k); await page.waitForTimeout(80); await page.keyboard.up(k); await page.waitForTimeout(200); }
    async function commande(t) { await ev(function (t) { $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: [t] }, { code: 0, indent: 0, parameters: [] }], 0); }, t); await page.waitForTimeout(300); }

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    await ev(function () {
        DataManager.setupNewGame(); $gameSystem._meteo = { force: 'clair' }; $gamePlayer.reserveTransfer(29, 10, 10, 2, 0); SceneManager.goto(Scene_Map);
        // trois événements communs d'essai, en fin de base
        window.__ec = [];
        function ce(nom, marque, extra) {
            var id = $dataCommonEvents.length;
            $dataCommonEvents.push({ id: id, name: nom, switchId: 1, trigger: 0, list: (extra || []).concat([{ code: 355, indent: 0, parameters: ['window.__ec.push("' + marque + '")'] }, { code: 0, indent: 0, parameters: [] }]) });
            return id;
        }
        window.__ids = { a: ce('✎ Voyage · Le port', 'port', [{ code: 108, indent: 0, parameters: ['Rejoindre le port en barque.'] }]),
            b: ce('✎ Voyage · La montagne', 'montagne'),
            c: ce('✎ Voyage · Le sanctuaire', 'sanctuaire', [{ code: 108, indent: 0, parameters: ['<si: s[30]> Débloqué plus tard.'] }]),
            d: ce('✎ Voyage · La crypte', 'crypte', [{ code: 108, indent: 0, parameters: ['<si: v[40] >= 3>'] }]) };
    });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1200);
    var ids = await ev(function () { return window.__ids; });
    console.log('INTERFACEPLUS');

    console.log('\n── ① les touches ──');
    await commande('TOUCHE M ' + ids.a);
    await touche('m'); await page.waitForTimeout(500);
    var t1 = await ev(function () { return window.__ec.slice(); });
    await touche('k'); await page.waitForTimeout(400);
    var t2 = await ev(function () { return window.__ec.slice(); });
    await commande('TOUCHE M off');
    await touche('m'); await page.waitForTimeout(400);
    var t3 = await ev(function () { return window.__ec.slice(); });
    V('TOUCHE M : M lance l\'événement commun', t1.join() === 'port', JSON.stringify(t1));
    V('contre-épreuve : K, non liée, ne lance rien', t2.join() === 'port', JSON.stringify(t2));
    V('contre-épreuve : « TOUCHE M off », M ne lance plus rien', t3.join() === 'port', JSON.stringify(t3));

    console.log('\n── ② l\'image cliquable ──');
    var img = fs.readdirSync(path.join(__dirname, '..', '..', 'img', 'pictures')).filter(function (f) { return /\.png$/.test(f); })[0].replace(/\.png$/, '');
    await ev(function (a) {
        window.__ec.length = 0;
        $gameScreen.showPicture(5, a.img, 0, 300, 200, 25, 25, 255, 0);   // réduite : l'image entière tient à l'écran
        $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['IMAGE clic 5 ' + a.id] }, { code: 0, indent: 0, parameters: [] }], 0);
    }, { img: img, id: ids.b });
    await page.waitForTimeout(800);
    var bornes = await ev(function () { var c = SceneManager._scene._spriteset._pictureContainer.children.filter(function (s) { return s._pictureId === 5; })[0]; var b = c.getBounds(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
    await page.mouse.click(bornes.x + bornes.w / 2, bornes.y + bornes.h / 2);
    await page.waitForTimeout(600);
    var c1 = await ev(function () { return { ec: window.__ec.slice(), dest: $gameTemp.isDestinationValid(), reserve: $gameTemp._commonEventId, courant: $gameMap.isEventRunning() }; });
    await page.mouse.click(Math.min(800, bornes.x + bornes.w + 60), Math.min(600, bornes.y + bornes.h + 60));
    await page.waitForTimeout(600);
    var c2 = await ev(function () { return window.__ec.slice(); });
    V('un clic SUR l\'image (« ' + img + ' ») lance l\'événement commun, sans faire marcher le joueur', c1.ec.join() === 'montagne' && !c1.dest, JSON.stringify(c1));
    V('contre-épreuve : un clic à côté ne lance rien', c2.join() === 'montagne', JSON.stringify(c2));
    await ev(function () { $gameScreen.erasePicture(5); $gameTemp.clearDestination(); });

    console.log('\n── ③ le menu d\'événements communs ──');
    async function menu(sw30, v40) {
        await ev(function (a) {
            var ids = a.ids;
            // v40 = 1 par défaut : la crypte (<si: v[40] >= 3>) doit rester cachée — l'ancienne
            // lecture coupait au « > » de « >= » et la montrait dès que v40 n'était pas nul
            window.__ec.length = 0; $gameSwitches.setValue(30, !!a.sw); $gameVariables.setValue(40, a.v40 || 1);
            $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['MENU_EC ' + ids.a + ' ' + ids.b + ' ' + ids.c + ' ' + ids.d] }, { code: 355, indent: 0, parameters: ['window.__ec.push("après")'] }, { code: 0, indent: 0, parameters: [] }], 0);
        }, { ids: ids, sw: sw30, v40: v40 });
        await page.waitForTimeout(800);
        return ev(function () { var m = $gameMap._interpreter._ipMenu; return m ? { noms: m.w._list.map(function (c) { return c.name; }), aide: m.h._text } : null; });
    }
    var m1 = await menu();
    await page.screenshot({ path: path.join(__dirname, 'captures', 'menu_evenements_communs.png') });
    V('le menu montre les noms, sans le sanctuaire verrouillé (<si: s[30]>, interrupteur OFF)', m1 && m1.noms.join('|') === 'Le port|La montagne', m1 && m1.noms.join(' | '));
    V('le premier commentaire sert d\'aide', m1 && /Rejoindre le port/.test(m1.aide), m1 && m1.aide);
    await touche('ArrowDown'); await touche('Enter'); await page.waitForTimeout(700);
    var r1 = await ev(function () { return window.__ec.slice(); });
    V('choisir « La montagne » la joue, puis l\'événement reprend', r1.join() === 'montagne,après', JSON.stringify(r1));
    await menu();
    await touche('Escape'); await page.waitForTimeout(700);
    var r2 = await ev(function () { return { ec: window.__ec.slice(), scene: SceneManager._scene.constructor.name }; });
    V('contre-épreuve : Échap ne joue rien, l\'événement reprend, le menu principal ne s\'ouvre pas', r2.ec.join() === 'après' && r2.scene === 'Scene_Map', JSON.stringify(r2));
    var m3 = await menu(true);
    V('contre-épreuve : interrupteur 30 ON, le sanctuaire apparaît', m3 && m3.noms.length === 3 && m3.noms[2] === 'Le sanctuaire', m3 && m3.noms.join(' | '));
    await touche('Escape'); await page.waitForTimeout(500);
    var m4 = await menu(true, 3);
    V('<si: v[40] >= 3> : cachée à v40 = 1 (ci-dessus), la crypte apparaît à v40 = 3', m4 && m4.noms.length === 4 && m4.noms[3] === 'La crypte', m4 && m4.noms.join(' | '));
    await touche('Escape'); await page.waitForTimeout(500);

    console.log('\n── ④ les événements communs automatiques ──');
    var auto = await ev(function () {
        function ce(nom, marque) { var id = $dataCommonEvents.length; $dataCommonEvents.push({ id: id, name: nom, switchId: 1, trigger: 0, list: [{ code: 355, indent: 0, parameters: ['window.__ec.push("' + marque + '"' + (marque === 'niveau' ? ' + ":" + $gameVariables.value(40)' : '') + ')'] }, { code: 0, indent: 0, parameters: [] }] }); return id; }
        for (var k in InterfacePlus.auto) delete InterfacePlus.auto[k];
        InterfacePlus.auto.fuite = ce('auto fuite', 'fuite');
        InterfacePlus.auto.niveau = ce('auto niveau', 'niveau');
        InterfacePlus.variableHeros = 40; window.__v40 = true;
        window.__ec.length = 0;
        return true;
    });
    await ev(function () { BattleManager.setup(2, true, true); SceneManager.push(Scene_Battle); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && BattleManager._phase && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(500);
    for (var z = 0; z < 20 && (await ev(function () { return $gameMessage.isBusy(); })); z++) { await page.keyboard.press('Enter'); await page.waitForTimeout(150); }
    await ev(function () { $gameTroop._interpreter.clear(); BattleManager.processAbort(); });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1200);
    var a1 = await ev(function () { return window.__ec.slice(); });
    V('combat abandonné : l\'événement commun « fuite » se joue, de retour sur la carte', a1.join() === 'fuite', JSON.stringify(a1));
    // une montée de niveau PENDANT un événement : elle attend qu'il finisse
    await ev(function () {
        window.__ec.length = 0;
        $gameMap._interpreter.setup([{ code: 230, indent: 0, parameters: [40] }, { code: 355, indent: 0, parameters: ['window.__ec.push("événement fini")'] }, { code: 0, indent: 0, parameters: [] }], 0);
        // GALV_ManualLevel met l'expérience en réserve si « show » est faux : on passe par le vrai chemin de montée de niveau
        var h = $gameParty.leader(); window.__heros = h.actorId(); h.changeExp(h.expForLevel(h.level + 1), true);
    });
    await page.waitForTimeout(1800);
    var a2 = await ev(function () { return { ec: window.__ec.slice(), heros: window.__heros }; });
    V('montée de niveau pendant un événement : « niveau » attend la fin, puis se joue avec le numéro du héros', a2.ec[0] === 'événement fini' && a2.ec[1] === 'niveau:' + a2.heros, JSON.stringify(a2));
    var a3 = await ev(function () { return InterfacePlus.auto.victoire === undefined && !($gameTemp._ipAuto || []).length; });
    V('contre-épreuve : « victoire » n\'a pas d\'événement commun, rien n\'est en attente', a3, '');

    console.log('\n── ⑤ CHOISIR ──');
    async function choisir(cmd, k, annuler) {
        await ev(function (c) { $gameVariables.setValue(41, -1); $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: [c] }, { code: 0, indent: 0, parameters: [] }], 0); }, cmd);
        await page.waitForTimeout(600);
        var liste = await ev(function () { var m = $gameMap._interpreter._ipMenu; return m ? m.w._list.map(function (c) { return c.ext.id; }) : null; });
        if (annuler) await touche('Escape');
        else { for (var i = 0; i < k; i++) await touche('ArrowDown'); await touche('Enter'); }
        await page.waitForTimeout(500);
        return { liste: liste, v: await ev(function () { return $gameVariables.value(41); }) };
    }
    var ch1 = await choisir('CHOISIR competence 41', 1);
    var attendu = await ev(function () { return $gameParty.leader().skills().map(function (s) { return s.id; }); });
    V('CHOISIR competence 41 : les compétences du chef, la 2e choisie → v41', ch1.liste && ch1.liste.join() === attendu.join() && ch1.v === attendu[1], 'liste de ' + (ch1.liste || []).length + ' · v41 = ' + ch1.v);
    var ch2 = await choisir('CHOISIR competence 41', 0, true);
    V('contre-épreuve : Échap met 0', ch2.v === 0, 'v41 = ' + ch2.v);
    await ev(function () { $gameParty.gainItem($dataWeapons[1], 1); $gameParty.gainItem($dataWeapons[2], 1); });
    var ch3 = await choisir('CHOISIR arme 41', 1);
    var armes = await ev(function () { return $gameParty.weapons().map(function (w) { return w.id; }); });
    V('CHOISIR arme 41 : les armes du sac, la 2e → v41', ch3.liste && ch3.liste.join() === armes.join() && ch3.v === armes[1], 'armes ' + armes.join(',') + ' · v41 = ' + ch3.v);

    console.log('\n── ⑥ la boutique conditionnelle ──');
    async function boutique(sw) {
        await ev(function (sw) {
            $gameSwitches.setValue(30, sw);
            if ($dataItems[1].note.indexOf('<Boutique si') < 0) $dataItems[1].note += '\n<Boutique si: s[30]>';
            SceneManager.push(Scene_Shop); SceneManager.prepareNextScene([[0, 1, 1, 111], [0, 2, 1, 222]], true);
        }, sw);
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Shop && SceneManager._scene._buyWindow; }, null, { timeout: 20000 });
        await page.waitForTimeout(400);
        var r = await ev(function () { var w = SceneManager._scene._buyWindow; return w._data.map(function (it, i) { return it.id + '=' + w._price[i]; }); });
        await ev(function () { SceneManager.pop(); });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 20000 });
        await page.waitForTimeout(300);
        return r;
    }
    var b1 = await boutique(false), b2 = await boutique(true);
    V('<Boutique si: s[30]> : interrupteur OFF, l\'objet 1 n\'est pas en vente, l\'objet 2 garde SON prix', b1.join() === '2=222', b1.join(' · '));
    V('contre-épreuve : interrupteur ON, les deux, chacun à son prix', b2.join() === '1=111,2=222', b2.join(' · '));

    console.log('\n── le bilan ──');
    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
