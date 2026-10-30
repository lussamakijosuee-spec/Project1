/*
 * LA MARCHE — ils marchent comme des gens, pas n'importe comment
 * ---------------------------------------------------------------------------
 * JOKO, 2026-10-30 : « le plus gros problème c'est la marche, ils font
 * n'importe quoi presque ». Mesuré avant la correction : à 10 h, 23 % des pas
 * de la Ville Forestière étaient des allers-retours (un pas, puis le pas
 * inverse : ils piétinaient une fois arrivés), et Mathurin, qui ne quitte pas
 * son réverbère, faisait 13 pas en 40 secondes.
 *
 * On suit chaque PNJ case par case et on compte :
 *   ① les allers-retours, à 10 h (chacun à son poste) et à midi (tout le monde
 *     va sur la place) : moins de 5 % des pas ;
 *   ② Mathurin, sédentaire à son réverbère, ne fait pas un pas ;
 *   ③ à midi, chacun vise SA case de la place (aucune case visée par deux) ;
 *   ④ un PNJ qui sort par une porte où le joueur se tient se faufile à côté de lui ;
 *   ⑤ contre-épreuve : un PNJ qu'on fait piétiner exprès est bien attrapé.
 *
 *   node bancs/navigateur/la_marche.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var ok = 0, ko = 0, erreurs = [];
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 160)); });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title'; }, null, { timeout: 120000 });
    await page.evaluate(function () {
        DataManager.setupNewGame();
        $gameSystem._meteo = { cle: '', type: 'clair', force: 'clair' };   // beau temps : sous la pluie, on rentre
        SceneManager.goto(Scene_Map);
        // la trace : à chaque image, la case de chacun
        var _u = Scene_Map.prototype.update;
        Scene_Map.prototype.update = function () {
            _u.call(this);
            if (!window.__trace) return;
            $gameMap.events().forEach(function (e) {
                if (!e._vie || e._vie.metier === 'fixe' || e._pageIndex < 0 || e.opacity() === 0) return;
                var t = window.__trace[e.eventId()] = window.__trace[e.eventId()] || { nom: e.event().name, pos: [] };
                var k = e.x + ',' + e.y; if (t.pos[t.pos.length - 1] !== k) t.pos.push(k);
            });
        };
        window.mesurer = function () {
            var r = { pas: 0, ar: 0, parQui: {} };
            Object.keys(window.__trace || {}).forEach(function (id) {
                var p = window.__trace[id].pos.map(function (k) { return k.split(',').map(Number); }), pas = 0, ar = 0;
                for (var i = 1; i < p.length; i++) {
                    if (Math.abs(p[i][0] - p[i - 1][0]) + Math.abs(p[i][1] - p[i - 1][1]) !== 1) continue;
                    pas++;
                    if (i >= 2 && p[i][0] === p[i - 2][0] && p[i][1] === p[i - 2][1]) ar++;
                }
                r.pas += pas; r.ar += ar; r.parQui[id] = { nom: window.__trace[id].nom, pas: pas, ar: ar };
            });
            return r;
        };
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && window.AlleesEtVenues && AlleesEtVenues.pret(); }, null, { timeout: 60000 });

    async function suivre(carte, h, m, secondes, x, y) {
        await page.evaluate(function (p) {
            $gameSystem.set_hour(p.h); $gameSystem.set_minute(p.m); $gameScreen.changeWeather('none', 0, 0);
            $gamePlayer.reserveTransfer(p.carte, p.x, p.y, 2, 0);
        }, { carte: carte, h: h, m: m, x: x, y: y });
        await page.waitForFunction(function (c) { return $gameMap.mapId() === c && SceneManager._scene._spriteset && !$gamePlayer.isTransferring() && $gameMap._vieRecensee; }, carte, { timeout: 30000 });
        await page.evaluate(function () { $gamePlayer.setThrough(true); $gamePlayer.setOpacity(0); window.__trace = {}; });
        await page.waitForTimeout(secondes * 1000);
        return page.evaluate(function () { var r = window.mesurer(); window.__trace = null; return r; });
    }

    console.log('LA MARCHE');
    var dix = await suivre(29, 9, 55, 30, 20, 24);
    V('① à 10 h, en ville : moins de 5 % d\'allers-retours (ils ne piétinent plus)', dix.pas > 0 && dix.ar / dix.pas < 0.05, dix.pas + ' pas, ' + dix.ar + ' allers-retours (' + Math.round(100 * dix.ar / Math.max(1, dix.pas)) + ' % ; 23 % avant la correction)');
    var mathurin = dix.parQui[53] || { pas: 0 };
    V('② Mathurin, à son réverbère, ne fait pas un pas', mathurin.pas === 0, mathurin.pas + ' pas en 30 s (13 en 40 s avant)');
    var midi = await suivre(29, 11, 58, 30, 20, 24);
    V('① à midi, ils vont sur la place sans aller-retour', midi.pas > 0 && midi.ar / midi.pas < 0.05, midi.pas + ' pas, ' + midi.ar + ' allers-retours (' + Math.round(100 * midi.ar / Math.max(1, midi.pas)) + ' %)');
    var cases = await page.evaluate(function () {
        var l = $gameMap._viePNJ.filter(function (e) { return e._vie && e._vie.but === 'place'; }), vues = {};
        l.forEach(function (e) { var k = e._vie.place.x + ',' + e._vie.place.y; vues[k] = (vues[k] || 0) + 1; });
        return { n: l.length, partagees: Object.keys(vues).filter(function (k) { return vues[k] > 1; }).length };
    });
    V('③ à midi, chacun vise sa case de la place', cases.n > 1 && cases.partagees === 0, cases.n + ' sur la place · ' + cases.partagees + ' case(s) visée(s) par deux');

    // ④ la forge à 22 h : Renaud sort, le joueur se tient dans le couloir de la porte (une case de large)
    // (Renaud est un client « le jour » : à 10 h il est là, à 22 h il s'en va)
    await page.evaluate(function () { $gameSystem.set_hour(10); $gameSystem.set_minute(0); $gamePlayer.reserveTransfer(41, 10, 11, 2, 0); });
    var la = await page.waitForFunction(function () { return $gameMap.mapId() === 41 && !$gamePlayer.isTransferring() && $gameMap.event(4)._pageIndex >= 0 && !$gameMap.event(4)._habArrivee; }, null, { timeout: 90000 }).then(function () { return true; }, function () { return false; });
    // ⚠ pas à l'image même de l'arrivée : la carte n'est « prête » (Habitants fait marcher) qu'après sa première image
    await page.waitForTimeout(1500);
    await page.evaluate(function () { $gamePlayer.setThrough(false); $gamePlayer.setOpacity(255); $gamePlayer.locate(10, 11); $gameSystem.set_hour(22); $gameSystem.set_minute(0); $gameMap.requestRefresh(); });
    var part = await page.waitForFunction(function () { return !!$gameMap.event(4)._habDepart; }, null, { timeout: 60000, polling: 100 }).then(function () { return true; }, function () { return false; });
    if (!part) console.log('      (diagnostic) ' + JSON.stringify(await page.evaluate(function () { var e = $gameMap.event(4); return { h: $gameSystem.hour() + ':' + $gameSystem.minute(), sw202: $gameSwitches.value(202), page: e._pageIndex, passage: e._habPassage, pret: $gameMap._habPret, present: Habitants.present(e), scene: e._vieScene, pos: [e.x, e.y], carte: $gameMap.mapId(), msg: $gameMessage.isBusy(), run: $gameMap.isEventRunning() }; })));
    var t0 = Date.now();
    var sorti = part && await page.waitForFunction(function () { var e = $gameMap.event(4); return e._pageIndex < 0 && !e._habDepart; }, null, { timeout: 120000, polling: 500 }).then(function () { return true; }, function () { return false; });
    var ou = await page.evaluate(function () { var e = $gameMap.event(4); return { x: e.x, y: e.y, joueur: [$gamePlayer.x, $gamePlayer.y], b: e._habDepart && e._habDepart.bloque }; });
    // sans page, MV le rend traversable (c'est normal) : on le fait revenir le lendemain, il doit être solide
    await page.evaluate(function () { $gameSystem.set_hour(10); $gameSystem.set_minute(0); $gameMap.requestRefresh(); });
    await page.waitForFunction(function () { var e = $gameMap.event(4); return e._pageIndex >= 0 && !e._habArrivee && e._habDelai === undefined; }, null, { timeout: 120000, polling: 500 }).catch(function () {});
    var solide = await page.evaluate(function () { var e = $gameMap.event(4); return e._pageIndex >= 0 && !e.isThrough(); });
    V('④ le joueur dans la porte : le client se faufile à côté de lui et sort', la && part && sorti && solide && ou.joueur[0] === 10 && ou.joueur[1] === 11, !la ? 'Renaud n\'était pas là à 10 h' : !part ? 'il n\'est pas parti à 22 h' : sorti ? 'parti à 22 h, sorti en ' + Math.round((Date.now() - t0) / 1000) + ' s, le joueur toujours en (' + ou.joueur.join(',') + ')' + (solide ? ', et revenu le lendemain, il est solide' : ', mais revenu le lendemain, il traverse encore les gens') : 'toujours là, en (' + ou.x + ',' + ou.y + '), bloqué ' + ou.b + ' fois');

    // ⑤ contre-épreuve : on fait piétiner Mathurin exprès, le banc doit le voir
    await page.evaluate(function () { $gameSystem.set_hour(10); $gameSystem.set_minute(0); $gamePlayer.reserveTransfer(29, 20, 24, 2, 0); });
    await page.waitForFunction(function () { return $gameMap.mapId() === 29 && !$gamePlayer.isTransferring() && $gameMap._vieRecensee; }, null, { timeout: 30000 });
    var faux = await page.evaluate(function () {
        $gamePlayer.setThrough(true); window.__trace = {};
        var e = $gameMap.event(53), x0 = e.x, y0 = e.y, d = 0;
        window.__pietine = setInterval(function () { if (!e.isMoving()) { e.moveStraight([4, 6][d++ % 2]); } }, 150);
        return [x0, y0];
    });
    await page.waitForTimeout(8000);
    var pie = await page.evaluate(function () { clearInterval(window.__pietine); var r = window.mesurer(); window.__trace = null; return r.parQui[53] || { pas: 0, ar: 0 }; });
    V('⑤ contre-épreuve : un PNJ qu\'on fait piétiner exprès est attrapé', pie.pas > 2 && pie.ar > 0, 'Mathurin forcé : ' + pie.pas + ' pas, ' + pie.ar + ' allers-retours comptés');

    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 2).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
