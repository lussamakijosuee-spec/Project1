/*
 * LES OUTILS DE SCÈNE, DANS LE VRAI MOTEUR
 * ---------------------------------------------------------------------------
 * js/plugins/OutilsDeScene.js promet cinq choses. Chacune est jouée ici sur
 * une vraie carte (la Ville Forestière, ses PNJ, ses habitants), et chacune
 * avec sa CONTRE-ÉPREUVE — sinon un moteur qui ne fait rien passerait :
 *
 *   ① en mode cinématique, un PNJ qui se promène s'arrête — et hors scène,
 *     le même PNJ bouge ;
 *   ② un « Définir un déplacement » bloqué par un PNJ : en scène, le
 *     personnage traverse et la scène finit — hors scène, la scène attend
 *     toujours (on ne change rien hors du mode cinématique), et le bandeau
 *     de test le dit dans les deux cas ;
 *   ③ la caméra glisse jusqu'à un PNJ éloigné, puis revient au joueur ;
 *   ④ les bandes de cinéma descendent et repartent ;
 *   ⑤ MAINTENIR Échap saute à l'étiquette — un simple appui ne saute rien,
 *     et sans « SCENE passer » maintenir ne saute rien non plus ;
 *   ⑥ « SCENE attendre » attend que tous les déplacements soient finis ;
 *   ⑦ « SCENE icone » : l'icône demandée apparaît AU-DESSUS du personnage,
 *     s'en va seule, « attendre » fait patienter la ligne d'après, « off »
 *     l'enlève tout de suite, et un personnage absent ne plante rien.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/les_outils_de_scene.js
 */
'use strict';
var { chromium } = require('playwright');
var path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var CARTE = 29;

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    var ev = function (f, a) { return page.evaluate(f, a); };
    async function attendreQue(f, a, ms) { try { await page.waitForFunction(f, a, { timeout: ms }); return true; } catch (e) { return false; } }

    // en mode test : le bandeau des signalements existe
    await page.goto(BASE + '/index.html?test', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    await ev(function (id) {
        DataManager.setupNewGame();
        $gameSystem._meteo = { force: 'clair' };
        $gamePlayer.reserveTransfer(id, 10, 10, 2, 0);
        SceneManager.goto(Scene_Map);
    }, CARTE);
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);

    // Un couloir libre de 6 cases, et deux PNJ que l'on prépare pour l'essai.
    var prep = await ev(function () {
        var evs = $gameMap.events().filter(function (e) { return e.characterName() && !e._erased; });
        var couloir = null;
        for (var y = 2; y < $gameMap.height() - 2 && !couloir; y++) {
            for (var x = 2; x < $gameMap.width() - 8 && !couloir; x++) {
                var bon = true;
                for (var k = 0; k < 6 && bon; k++) {
                    if (!$gameMap.isPassable(x + k, y, 6) || !$gameMap.isPassable(x + k + 1, y, 4) || $gameMap.eventsXy(x + k, y).length) bon = false;
                }
                if (bon && Math.abs(x - $gamePlayer.x) + Math.abs(y - $gamePlayer.y) > 3) couloir = { x: x, y: y };
            }
        }
        return { couloir: couloir, ids: evs.map(function (e) { return e.eventId(); }) };
    });
    if (!prep.couloir || prep.ids.length < 3) { console.log('   ⚠ carte inutilisable pour l\'essai'); await nav.close(); process.exit(2); }
    var A = prep.ids[0], B = prep.ids[1], C = prep.ids[2];
    console.log('LES OUTILS DE SCÈNE — carte ' + CARTE + ', couloir en ' + prep.couloir.x + ',' + prep.couloir.y + ', PNJ ' + A + ' / ' + B + ' / ' + C);

    // ── ① les PNJ s'arrêtent ─────────────────────────────────────────────
    console.log('\n── ① les PNJ s\'arrêtent pendant une scène ──');
    async function promeneur(scene) {
        await ev(function (a) {
            $gameSwitches.setValue(912, a.scene);
            var e = $gameMap.event(a.C);
            e.locate(a.x + 2, a.y + 3 < $gameMap.height() ? a.y : a.y);
            e._moveType = 1; e._moveFrequency = 5; e._moveSpeed = 5; e._through = true;   // il peut aller partout
            window.__pos = [];
        }, { scene: scene, C: C, x: prep.couloir.x, y: prep.couloir.y });
        for (var i = 0; i < 12; i++) { await page.waitForTimeout(250); await ev(function (c) { var e = $gameMap.event(c); window.__pos.push(e.x + ',' + e.y); }, C); }
        return ev(function () { var vu = {}; window.__pos.forEach(function (p) { vu[p] = 1; }); return Object.keys(vu).length; });
    }
    var horsScene = await promeneur(false);
    var enScene = await promeneur(true);
    V('en scène, un PNJ qui se promène reste sur sa case', enScene === 1, enScene + ' case(s) occupée(s) en 3 s');
    V('contre-épreuve : hors scène, le même PNJ se promène', horsScene > 1, horsScene + ' cases occupées en 3 s');
    await ev(function (c) { var e = $gameMap.event(c); e._moveType = 0; e._through = false; $gameSwitches.setValue(912, false); }, C);

    // ── ② le garde-fou ───────────────────────────────────────────────────
    console.log('\n── ② un déplacement bloqué par un PNJ ──');
    async function bloque(scene) {
        return ev(function (a) {
            OutilsDeScene._aAfficher = null;
            var n0 = OutilsDeScene.signalements().length;
            $gameSwitches.setValue(912, a.scene);
            var ea = $gameMap.event(a.A), eb = $gameMap.event(a.B);
            [ea, eb].forEach(function (e) { e._moveType = 0; e._through = false; e._priorityType = 1; e.setThrough(false); });
            ea.locate(a.x, a.y); eb.locate(a.x + 2, a.y);
            var route = { list: [{ code: 3, indent: null }, { code: 3, indent: null }, { code: 3, indent: null }, { code: 3, indent: null }, { code: 0 }], repeat: false, skippable: false, wait: true };
            $gameMap._interpreter.setup([
                { code: 205, indent: 0, parameters: [a.A, route] },
                { code: 355, indent: 0, parameters: ['window.__finBloque = true'] },
                { code: 0, indent: 0, parameters: [] }], a.A);
            window.__finBloque = false; window.__n0 = n0;
            return true;
        }, { scene: scene, A: A, B: B, x: prep.couloir.x, y: prep.couloir.y });
    }
    await bloque(true);
    var fini = await attendreQue(function () { return window.__finBloque; }, null, 6000);
    var r2 = await ev(function (a) {
        var ea = $gameMap.event(a.A);
        return { x: ea.x, through: ea.isThrough(), sig: OutilsDeScene.signalements().slice(window.__n0), bandeau: !!OutilsDeScene._aAfficher || !!(SceneManager._scene._odsSignal) };
    }, { A: A });
    V('en scène, le personnage bloqué traverse et la scène se termine', fini, 'arrivé en x=' + r2.x + ' (départ ' + prep.couloir.x + ', obstacle en ' + (prep.couloir.x + 2) + ')');
    V('après coup, il n\'est plus traversant', r2.through === false, 'traversant = ' + r2.through);
    V('le bandeau de test l\'a signalé', r2.sig.length > 0, r2.sig[0] || 'rien');

    await bloque(false);
    var finiHors = await attendreQue(function () { return window.__finBloque; }, null, 4500);
    var r3 = await ev(function () { return { sig: OutilsDeScene.signalements().slice(window.__n0), court: $gameMap._interpreter.isRunning() }; });
    V('contre-épreuve : hors scène, rien ne change — la commande attend toujours', !finiHors && r3.court, 'après 4,5 s : ' + (finiHors ? 'finie' : 'toujours en attente'));
    V('… et le bandeau dit où ça coince', r3.sig.length > 0, r3.sig[0] || 'rien');
    await ev(function (a) {   // on libère la carte
        $gameMap._interpreter.clear(); var e = $gameMap.event(a.A); e._moveRouteForcing = false; e.restoreMoveRoute();
        $gameMap.event(a.B).locate(1, 1);
    }, { A: A, B: B });

    // ── ③ la caméra ──────────────────────────────────────────────────────
    console.log('\n── ③ la caméra ──');
    var cam = await ev(function (a) {
        // le PNJ le plus éloigné du joueur
        var loin = $gameMap.events().filter(function (e) { return e.characterName(); }).sort(function (u, v) {
            return (Math.abs(v.x - $gamePlayer.x) + Math.abs(v.y - $gamePlayer.y)) - (Math.abs(u.x - $gamePlayer.x) + Math.abs(u.y - $gamePlayer.y));
        })[0];
        window.__loin = loin.eventId();
        window.__d0 = { x: $gameMap.displayX(), y: $gameMap.displayY() };
        $gameMap._interpreter.setup([
            { code: 356, indent: 0, parameters: ['SCENE camera ' + loin.eventId() + ' 40 attendre'] },
            { code: 355, indent: 0, parameters: ['window.__camFin = Graphics.frameCount'] },
            { code: 0, indent: 0, parameters: [] }], 0);
        window.__camDebut = Graphics.frameCount; window.__camFin = 0;
        return { id: loin.eventId(), x: loin.x, y: loin.y, joueur: $gamePlayer.x + ',' + $gamePlayer.y };
    });
    await attendreQue(function () { return window.__camFin > 0; }, null, 8000);
    var c1 = await ev(function () {
        var e = $gameMap.event(window.__loin);
        var cx = $gameMap.displayX() + $gamePlayer.centerX(), cy = $gameMap.displayY() + $gamePlayer.centerY();
        var finX = $gameMap.width() - $gameMap.screenTileX(), finY = $gameMap.height() - $gameMap.screenTileY();
        var attenduX = Math.max(0, Math.min(e._realX - $gamePlayer.centerX(), finX)), attenduY = Math.max(0, Math.min(e._realY - $gamePlayer.centerY(), finY));
        return { ecart: Math.abs($gameMap.displayX() - attenduX) + Math.abs($gameMap.displayY() - attenduY), images: window.__camFin - window.__camDebut,
            bouge: Math.abs($gameMap.displayX() - window.__d0.x) + Math.abs($gameMap.displayY() - window.__d0.y) };
    });
    V('la caméra arrive sur le PNJ éloigné (événement ' + cam.id + ' en ' + cam.x + ',' + cam.y + ')', c1.ecart < 0.05 && c1.bouge > 1,
        'déplacée de ' + c1.bouge.toFixed(1) + ' cases, écart final ' + c1.ecart.toFixed(2) + ', en ' + c1.images + ' images (attendu ~40)');
    await ev(function () {
        $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['SCENE camera joueur 30 attendre'] }, { code: 0, indent: 0, parameters: [] }], 0);
    });
    await page.waitForTimeout(1500);
    var c2 = await ev(function () {
        var finX = $gameMap.width() - $gameMap.screenTileX(), finY = $gameMap.height() - $gameMap.screenTileY();
        var ax = Math.max(0, Math.min($gamePlayer._realX - $gamePlayer.centerX(), finX)), ay = Math.max(0, Math.min($gamePlayer._realY - $gamePlayer.centerY(), finY));
        return { cam: $gameSystem._ods.cam, ecart: Math.abs($gameMap.displayX() - ax) + Math.abs($gameMap.displayY() - ay) };
    });
    V('« SCENE camera joueur » ramène la vue et rend la main au joueur', !c2.cam && c2.ecart < 0.05, 'écart ' + c2.ecart.toFixed(2) + ', caméra ' + (c2.cam ? 'encore active' : 'relâchée'));

    // ── ④ les bandes ─────────────────────────────────────────────────────
    console.log('\n── ④ les bandes de cinéma ──');
    await ev(function () { $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['SCENE barres'] }, { code: 0, indent: 0, parameters: [] }], 0); });
    await page.waitForTimeout(1200);
    var b1 = await ev(function () { var s = SceneManager._scene._odsBandes; return { h: Math.round(s._h), visible: s.visible, bas: s._bas.y }; });
    await page.screenshot({ path: path.join(__dirname, 'captures', 'scene_bandes.png') });
    await ev(function () { $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['SCENE barres off'] }, { code: 0, indent: 0, parameters: [] }], 0); });
    await page.waitForTimeout(1200);
    var b2 = await ev(function () { var s = SceneManager._scene._odsBandes; return { h: Math.round(s._h), visible: s.visible }; });
    V('« SCENE barres » : deux bandes de 64 px', b1.h === 64 && b1.visible && b1.bas === 624 - 64, 'hauteur ' + b1.h + ', bande du bas en y=' + b1.bas);
    V('« SCENE barres off » : elles repartent', b2.h === 0 && !b2.visible, 'hauteur ' + b2.h);

    // ── ⑤ passer la scène ────────────────────────────────────────────────
    console.log('\n── ⑤ passer la scène (maintenir Échap) ──');
    async function scenePassable(arme) {
        await ev(function (arme) {
            var l = [];
            if (arme) l.push({ code: 356, indent: 0, parameters: ['SCENE passer FIN'] });
            l.push({ code: 101, indent: 0, parameters: ['', 0, 0, 2] }, { code: 401, indent: 0, parameters: ['Une longue scène… (on doit pouvoir la passer)'] });
            l.push({ code: 230, indent: 0, parameters: [900] });
            l.push({ code: 355, indent: 0, parameters: ['window.__pasSaute = true'] });
            l.push({ code: 118, indent: 0, parameters: ['FIN'] });
            l.push({ code: 355, indent: 0, parameters: ['window.__fin = Graphics.frameCount'] });
            l.push({ code: 0, indent: 0, parameters: [] });
            window.__fin = 0; window.__pasSaute = false;
            $gameMap._interpreter.setup(l, 0);
        }, arme);
        await page.waitForTimeout(900);
    }
    // un appui court : rien ne doit sauter (il fait seulement défiler le message)
    await scenePassable(true);
    await page.keyboard.down('Escape'); await page.waitForTimeout(120); await page.keyboard.up('Escape');
    await page.waitForTimeout(1500);
    var court = await ev(function () { return { fin: window.__fin, court: $gameMap._interpreter.isRunning() }; });
    V('contre-épreuve : un simple appui sur Échap ne passe pas la scène', court.fin === 0 && court.court, court.fin ? 'sautée !' : 'la scène continue');
    // maintenir : on saute à FIN, sans passer par la ligne d'avant
    await page.keyboard.down('Escape'); await page.waitForTimeout(1400); await page.keyboard.up('Escape');
    await page.waitForTimeout(400);
    var tenu = await ev(function () { return { fin: window.__fin, pasSaute: window.__pasSaute, message: $gameMessage.isBusy(), lum: $gameScreen.brightness() }; });
    V('maintenir Échap saute à l\'étiquette « FIN »', tenu.fin > 0 && !tenu.pasSaute, tenu.fin ? 'étiquette atteinte, la ligne d\'avant n\'a pas été jouée' : 'pas sautée');
    V('le message en cours est refermé', !tenu.message, 'message ouvert : ' + tenu.message);
    await page.waitForTimeout(800);
    // sans « SCENE passer », maintenir ne fait rien
    await scenePassable(false);
    await page.keyboard.down('Escape'); await page.waitForTimeout(1400); await page.keyboard.up('Escape');
    await page.waitForTimeout(500);
    var sans = await ev(function () { return { fin: window.__fin, court: $gameMap._interpreter.isRunning() }; });
    V('contre-épreuve : sans « SCENE passer », maintenir Échap ne saute rien', sans.fin === 0 && sans.court, sans.fin ? 'sautée !' : 'la scène continue');
    await ev(function () { $gameMap._interpreter.clear(); $gameMessage.clear(); var w = SceneManager._scene._messageWindow; w._textState = null; w.pause = false; w.terminateMessage(); });
    await page.waitForTimeout(600);

    // ── ⑥ attendre tout le monde ─────────────────────────────────────────
    console.log('\n── ⑥ « SCENE attendre » ──');
    await ev(function (a) {
        var ea = $gameMap.event(a.A), eb = $gameMap.event(a.B);
        ea.locate(a.x, a.y); eb.locate(a.x, a.y + 1 < $gameMap.height() ? a.y + 1 : a.y);
        [ea, eb].forEach(function (e) { e.setThrough(true); });
        function route(n) { var l = []; for (var i = 0; i < n; i++) l.push({ code: 3, indent: null }); l.push({ code: 0 }); return { list: l, repeat: false, skippable: true, wait: false }; }
        $gameMap._interpreter.setup([
            { code: 205, indent: 0, parameters: [a.A, route(1)] },
            { code: 205, indent: 0, parameters: [a.B, route(5)] },
            { code: 356, indent: 0, parameters: ['SCENE attendre'] },
            { code: 355, indent: 0, parameters: ['window.__tous = { a: $gameMap.event(' + a.A + ').isMoveRouteForcing(), b: $gameMap.event(' + a.B + ').isMoveRouteForcing(), bx: $gameMap.event(' + a.B + ').x }'] },
            { code: 0, indent: 0, parameters: [] }], 0);
        window.__tous = null;
    }, { A: A, B: B, x: prep.couloir.x, y: prep.couloir.y });
    await attendreQue(function () { return !!window.__tous; }, null, 8000);
    var t = await ev(function () { return window.__tous; });
    V('la ligne d\'après attend que les deux aient fini (le plus long : 5 pas)', t && !t.a && !t.b, t ? 'B arrivé en x=' + t.bx + ' (départ ' + prep.couloir.x + ')' : 'jamais atteinte');

    console.log('\n── ⑦ « SCENE icone » ──');
    async function icone(qui) {
        return ev(function (a) {
            var car = a.qui === 'joueur' ? $gamePlayer : $gameMap.event(a.qui);
            var sp = SceneManager._scene._spriteset._characterSprites.filter(function (s) { return s._character === car; })[0];
            var ic = sp && sp._odsIcone;
            return { donnee: car._odsIcone ? car._odsIcone.icone : 0, sprite: !!(ic && ic.parent), dessus: ic ? ic.y < sp.y - 20 && Math.abs(ic.x - sp.x) < 2 : false,
                cadre: ic ? [ic._frame.x, ic._frame.y] : null };
        }, { qui: qui });
    }
    await ev(function (a) {
        window.__apres = null;
        $gameMap._interpreter.setup([
            { code: 356, indent: 0, parameters: ['SCENE icone ' + a.C + ' 87 60 attendre'] },
            { code: 355, indent: 0, parameters: ['window.__apres = { encore: !!$gameMap.event(' + a.C + ')._odsIcone }'] },
            { code: 0, indent: 0, parameters: [] }], 0);
    }, { C: C });
    await page.waitForTimeout(400);
    var i1 = await icone(C);
    V('l\'icône 87 apparaît au-dessus du PNJ ' + C + ' (bonne case d\'IconSet)', i1.donnee === 87 && i1.sprite && i1.dessus && i1.cadre && i1.cadre[0] === 87 % 16 * 32 && i1.cadre[1] === Math.floor(87 / 16) * 32, JSON.stringify(i1));
    var pendant = await ev(function () { return window.__apres; });
    await attendreQue(function () { return !!window.__apres; }, null, 6000);
    var i2 = await icone(C), apres = await ev(function () { return window.__apres; });
    V('« attendre » : la ligne d\'après ne passe qu\'une fois l\'icône partie, et l\'icône s\'en va seule', pendant === null && apres && !apres.encore && !i2.sprite, 'pendant : ' + JSON.stringify(pendant) + ' · après : ' + JSON.stringify(apres));
    await ev(function () { $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['SCENE icone joueur 5 600'] }, { code: 0, indent: 0, parameters: [] }], 0); });
    await page.waitForTimeout(300);
    var i3 = await icone('joueur');
    await ev(function () { $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['SCENE icone joueur off'] }, { code: 0, indent: 0, parameters: [] }], 0); });
    await page.waitForTimeout(300);
    var i4 = await icone('joueur');
    V('contre-épreuve : sur le joueur pour 10 s, « off » l\'enlève tout de suite', i3.sprite && i3.dessus && !i4.sprite && i4.donnee === 0, 'avant off : ' + i3.sprite + ' · après : ' + i4.sprite);
    var n0 = erreurs.length;
    await ev(function () { $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['SCENE icone 9999 87'] }, { code: 0, indent: 0, parameters: [] }], 0); });
    await page.waitForTimeout(300);
    var sig = await ev(function () { return OutilsDeScene._aAfficher ? OutilsDeScene._aAfficher.texte : ''; });
    V('un personnage absent : rien ne plante, le bandeau de test le dit', erreurs.length === n0 && /aucun personnage/.test(sig), sig);

    console.log('\n── le bilan ──');
    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
