/*
 * BANC NAVIGATEUR — LA CHASSE AUX BUGS, DANS LE VRAI MOTEUR
 * ---------------------------------------------------------------------------
 * JOKO, 2026-10-02 : « un gigantesque chantier anti bug potentiel ou bug ».
 * Le banc statique (bancs/23_chasse_aux_bugs.js) lit les données ; celui-ci
 * les JOUE, et attrape chaque erreur que le moteur lève.
 *
 *   cartes   chaque carte est chargée pour de vrai, puis vit 3 secondes
 *            (processus parallèles, autoruns, plugins de carte) ;
 *   pages    chaque page de chaque événement, et chaque événement commun,
 *            est exécutée jusqu'au bout — deux fois, une par branche de
 *            choix. Les transferts, combats, boutiques, menus, fin de partie
 *            et vidéos sont neutralisés (notés, pas joués) pour que le
 *            balayage continue ;
 *   combats  chaque troupe est combattue en combat automatique (héros niveau
 *            50), accéléré ×4, jusqu'à la victoire, la défaite ou 3 tours.
 *            Un combat qui ne progresse plus est signalé « figé ».
 *
 * Une erreur porte son contexte : « carte 29 év.12 p2 », « troupe 519 ».
 * Les cartes et événements communs d'atelier (✎, ★, démos) sont comptés à
 * part et ne font pas échouer le banc.
 *
 *   node bancs/navigateur/la_chasse_aux_bugs.js            tout (≈ 1 h)
 *   node bancs/navigateur/la_chasse_aux_bugs.js cartes pages
 *   node bancs/navigateur/la_chasse_aux_bugs.js combats --de 500 --a 530
 *
 * Mesuré le 2026-10-02 : voir le commit qui l'a ajouté.
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs'), path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var R = path.join(__dirname, '..', '..');
var args = process.argv.slice(2);
function opt(n, d) { var i = args.indexOf(n); return i >= 0 ? Number(args[i + 1]) : d; }
var PARTIES = args.filter(function (a) { return /^(cartes|pages|combats)$/.test(a); });
if (!PARTIES.length) PARTIES = ['cartes', 'pages', 'combats'];
var ONGLETS = opt('--onglets', 3), DE = opt('--de', 1), A = opt('--a', 99999);

var INFOS = JSON.parse(fs.readFileSync(path.join(R, 'data', 'MapInfos.json'), 'utf8'));
var CES = JSON.parse(fs.readFileSync(path.join(R, 'data', 'CommonEvents.json'), 'utf8'));
var TROUPES = JSON.parse(fs.readFileSync(path.join(R, 'data', 'Troops.json'), 'utf8'));
function estDemo(id) { var i = INFOS[id]; if (!i) return true; return /✎|★|SALLE DE TEST|^MAP\d+$/.test(i.name) || (id >= 3 && id <= 27) || id === 66 || id === 67; }
function ctxDemo(ctx) {
    var m = ctx.match(/^carte (\d+)/); if (m) return estDemo(Number(m[1]));
    var c = ctx.match(/^événement commun (\d+)/); if (c) { var e = CES[Number(c[1])]; return !e || /^✎/.test(e.name); }
    return false;
}

var erreurs = {};           // clé → { ctx, msg, n }
var neFinitPas = [], figes = [], nonCharges = [], issues = {}, pagesJouees = 0;
function noter(ctx, msg) {
    var k = ctx + '|' + msg; if (erreurs[k]) { erreurs[k].n++; return; }
    erreurs[k] = { ctx: ctx, msg: msg, n: 1 };
}

/* ── ce que chaque onglet installe dans le jeu ── */
function outils() {
    window.__ctx = 'démarrage'; window.__err = [];
    var dire = function (e) { var m = (e && (e.stack || e.message) || String(e)).split('\n').slice(0, 3).join(' / ').replace(/https?:\/\/[^/]+\/js\//g, ''); window.__err.push([window.__ctx, m]); };
    window.__dire = dire;
    // une erreur ne stoppe plus le jeu : on la note avec son contexte
    SceneManager.catchException = function (e) { dire(e); };
    SceneManager.onError = function (e) { dire(e); };
    window.addEventListener('error', function (e) { dire(e.error || e.message); });
    // les messages défilent seuls
    Window_Message.prototype.isTriggered = function () { return true; };

    // ── le bac à sable pour une page ──
    var vrai = { transfer: Game_Player.prototype.reserveTransfer, push: SceneManager.push, goto: SceneManager.goto, c301: Game_Interpreter.prototype.command301, video: Graphics.playVideo };
    function neutraliser(on) {
        if (on) {
            Game_Player.prototype.reserveTransfer = function () { };
            SceneManager.push = function () { }; SceneManager.goto = function () { };
            Game_Interpreter.prototype.command301 = function () { this._branch[this._indent] = 0; return true; };
            Graphics.playVideo = function () { };
        } else {
            Game_Player.prototype.reserveTransfer = vrai.transfer;
            SceneManager.push = vrai.push; SceneManager.goto = vrai.goto;
            Game_Interpreter.prototype.command301 = vrai.c301; Graphics.playVideo = vrai.video;
        }
    }
    window.__neutraliser = neutraliser;
    window.__executer = function (liste, evId, choix) {
        var it = new Game_Interpreter(); it.setup(liste, evId || 0);
        var pas = 0;
        while (it.isRunning() && pas < 400) {
            if ($gameMessage.isChoice()) { $gameMessage.onChoice(Math.min(choix, $gameMessage.choices().length - 1)); $gameMessage.clear(); }
            else if ($gameMessage.isBusy()) $gameMessage.clear();
            it._waitCount = 0; it._waitMode = '';
            if (it._childInterpreter) { it._childInterpreter._waitCount = 0; it._childInterpreter._waitMode = ''; }
            Graphics.frameCount++;
            try { it.update(); } catch (e) { dire(e); return 'erreur'; }
            pas++;
        }
        $gameMessage.clear();
        return it.isRunning() ? 'encours' : 'fini';
    };
    window.__propre = function () {
        $gameMessage.clear(); if ($gameMap._interpreter) $gameMap._interpreter.clear();
        $gameScreen.clear && $gameScreen.clear();
        if ($gameSystem.weatherEX_initialize) try { $gameSystem.weatherEX_initialize(true); } catch (e) { }
        [1, 2, 3, 4].forEach(function (i) { if ($gameParty._actors.indexOf(i) < 0) $gameParty.addActor(i); });
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
    };
}

async function ouvrir(nav, nom) {
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var etat = { ctx: 'démarrage' };
    page.on('pageerror', function (e) { noter(etat.ctx, 'pageerror ' + e.message.split('\n')[0]); });
    page.on('response', function (r) { if (r.status() === 404) noter(etat.ctx, 'fichier introuvable (404) : ' + decodeURIComponent(r.url().replace(BASE + '/', ''))); });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 180000 });
    await page.evaluate(outils);
    await page.evaluate(function () { DataManager.setupNewGame(); window.__propre(); $gameParty.members().forEach(function (a) { a.changeLevel(50, false); a.recoverAll(); }); $gamePlayer.reserveTransfer(29, 20, 22, 2, 0); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return $gameMap.mapId() === 29 && SceneManager._sceneStarted && SceneManager._scene instanceof Scene_Map; }, null, { timeout: 60000 });
    await page.evaluate(function () { window.__propre(); });
    page.__etat = etat; page.__nom = nom;
    return page;
}
async function relever(page) {
    var l = await page.evaluate(function () { var x = window.__err; window.__err = []; return x; });
    l.forEach(function (e) { noter(e[0], e[1]); });
}
async function allerA(page, id, x, y) {
    await page.evaluate(function (d) { window.__neutraliser(false); window.__propre(); $gamePlayer.reserveTransfer(d[0], d[1], d[2], 2, 0); }, [id, x || 0, y || 0]);
    try {
        await page.waitForFunction(function (d) { return $gameMap.mapId() === d && SceneManager._sceneStarted && SceneManager._scene instanceof Scene_Map; }, id, { timeout: 30000 });
        return true;
    } catch (e) { return false; }
}

/* ════════ cartes + pages ════════ */
async function cartesEtPages(page) {
    var ids = INFOS.filter(Boolean).map(function (i) { return i.id; });
    for (var id of ids) {
        var m = JSON.parse(fs.readFileSync(path.join(R, 'data', 'Map' + String(id).padStart(3, '0') + '.json'), 'utf8'));
        // une case praticable quelconque : le milieu
        page.__etat.ctx = 'carte ' + id + ' (chargement)';
        await page.evaluate(function (c) { window.__ctx = c; }, page.__etat.ctx);
        var ok = await allerA(page, id, Math.floor(m.width / 2), Math.floor(m.height / 2));
        if (!ok) { nonCharges.push('carte ' + id + ' « ' + INFOS[id].name + ' » ne finit pas de charger en 30 s'); await relever(page); await allerA(page, 29, 20, 22); continue; }
        if (PARTIES.indexOf('cartes') >= 0) {
            page.__etat.ctx = 'carte ' + id + ' (3 s de jeu)';
            await page.evaluate(function (c) { window.__ctx = c; }, page.__etat.ctx);
            await page.waitForTimeout(3000);
            await relever(page);
        }
        if (PARTIES.indexOf('pages') >= 0) {
            var r = await page.evaluate(function (id) {
                var res = { fini: 0, encours: [], erreur: 0, n: 0 };
                window.__neutraliser(true);
                $dataMap.events.forEach(function (e) {
                    if (!e) return;
                    e.pages.forEach(function (p, pi) {
                        [0, 1].forEach(function (choix) {
                            if (choix === 1 && !p.list.some(function (c) { return c.code === 102; })) return;
                            window.__ctx = 'carte ' + id + ' év.' + e.id + ' « ' + e.name + ' » p' + (pi + 1) + (choix ? ' (2e choix)' : '');
                            var s = window.__executer(p.list, e.id, choix); res.n++;
                            if (s === 'encours' && p.trigger < 4) res.encours.push(window.__ctx);
                            res[s === 'encours' ? 'fini' : s] = (res[s === 'encours' ? 'fini' : s] || 0) + 1;
                        });
                    });
                });
                window.__neutraliser(false);
                return res;
            }, id);
            r.encours.forEach(function (c) { neFinitPas.push(c); }); pagesJouees += r.n;
            await relever(page);
        }
        process.stdout.write('.');
    }
    if (PARTIES.indexOf('pages') >= 0) {
        await allerA(page, 29, 20, 22);
        var r2 = await page.evaluate(function () {
            var res = { encours: [], n: 0 };
            window.__neutraliser(true);
            $dataCommonEvents.forEach(function (c) {
                if (!c) return;
                [0, 1].forEach(function (choix) {
                    if (choix === 1 && !c.list.some(function (x) { return x.code === 102; })) return;
                    window.__ctx = 'événement commun ' + c.id + ' « ' + c.name + ' »' + (choix ? ' (2e choix)' : '');
                    var s = window.__executer(c.list, 0, choix); res.n++;
                    if (s === 'encours' && c.trigger === 0) res.encours.push(window.__ctx);
                });
            });
            window.__neutraliser(false);
            return res;
        });
        r2.encours.forEach(function (c) { neFinitPas.push(c); }); pagesJouees += r2.n;
        await relever(page);
    }
}

/* ════════ combats ════════ */
async function combats(page, liste) {
    await page.evaluate(function () {
        Game_Actor.prototype.isAutoBattle = function () { return true; };
        // accéléré ×4 : trois mises à jour de plus entre deux images
        setInterval(function () {
            if (!(SceneManager._scene instanceof Scene_Battle) || !SceneManager._sceneStarted || window.__pause) return;
            for (var k = 0; k < 3; k++) { Graphics.frameCount++; try { SceneManager.updateScene(); } catch (e) { window.__dire(e); } if (!(SceneManager._scene instanceof Scene_Battle)) break; }
        }, 16);
    });
    for (var t of liste) {
        page.__etat.ctx = 'troupe ' + t + ' « ' + TROUPES[t].name + ' »';
        await page.evaluate(function (c) { window.__ctx = c; window.__propre(); $gameMap.events().forEach(function (e) { e.erase(); }); }, page.__etat.ctx);
        await page.evaluate(function (t) {
            $gameParty.members().forEach(function (a) { a.changeLevel(50, false); a.recoverAll(); });
            BattleManager.setup(t, true, true); SceneManager.push(Scene_Battle);
        }, t);
        try { await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && SceneManager._sceneStarted; }, null, { timeout: 30000 }); }
        catch (e) { nonCharges.push(page.__etat.ctx + ' : le combat ne démarre pas en 30 s'); await relever(page); await allerA(page, 29, 20, 22); continue; }
        var r = await page.evaluate(async function () {
            var t0 = performance.now(), dernier = performance.now(), sig = '';
            while (true) {
                await new Promise(function (ok) { setTimeout(ok, 250); });
                if (!(SceneManager._scene instanceof Scene_Battle)) return { fin: 'sorti' };
                if (BattleManager.isBattleEnd() || BattleManager._victoryPhase) return { fin: 'fin' };
                if ($gameTroop.turnCount() >= 3) return { fin: '3 tours' };
                var s = [$gameTroop.turnCount(), BattleManager._phase, BattleManager._subject && BattleManager._subject.name(), $gameTroop.members().map(function (e) { return e.hp; }).join(','), $gameParty.members().map(function (e) { return e.hp + ':' + e.mp; }).join(',')].join('|');
                if (s !== sig) { sig = s; dernier = performance.now(); }
                if (performance.now() - dernier > 20000) return { fin: 'figé', etat: 'phase ' + BattleManager._phase + ' · sujet ' + (BattleManager._subject ? BattleManager._subject.name() : '—') + ' · tour ' + $gameTroop.turnCount() + ' · message ' + $gameMessage.isBusy() + ' · événement ' + $gameTroop.isEventRunning() };
                if (performance.now() - t0 > 90000) return { fin: 'long' };
            }
        });
        issues[r.fin] = (issues[r.fin] || 0) + 1;
        if (r.fin === 'figé') figes.push(page.__etat.ctx + ' — ' + r.etat);
        await relever(page);
        // sortir proprement
        await page.evaluate(function () {
            window.__pause = true;
            if (SceneManager._scene instanceof Scene_Battle) { try { BattleManager.processAbort(); } catch (e) { } }
            setTimeout(function () { if (!(SceneManager._scene instanceof Scene_Map)) { $gamePlayer.reserveTransfer(29, 20, 22, 2, 0); SceneManager.goto(Scene_Map); } window.__pause = false; }, 4000);
        });
        try { await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && SceneManager._sceneStarted; }, null, { timeout: 30000 }); }
        catch (e) { await allerA(page, 29, 20, 22); }
        await page.evaluate(function () { window.__pause = false; });
        process.stdout.write(r.fin === 'figé' ? 'F' : '.');
    }
}

(async function () {
    var t0 = Date.now();
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var travaux = [];
    if (PARTIES.indexOf('cartes') >= 0 || PARTIES.indexOf('pages') >= 0) {
        travaux.push((async function () { var p = await ouvrir(nav, 'cartes'); await cartesEtPages(p); })());
    }
    if (PARTIES.indexOf('combats') >= 0) {
        var ids = TROUPES.map(function (t, i) { return t && t.members.length && i >= DE && i <= A ? i : 0; }).filter(Boolean);
        var n = Math.max(1, ONGLETS - (travaux.length ? 1 : 0));
        for (var k = 0; k < n; k++) {
            (function (part) { travaux.push((async function () { var p = await ouvrir(nav, 'combats ' + k); await combats(p, part); })()); })(ids.filter(function (x, i) { return i % n === k; }));
        }
    }
    await Promise.all(travaux);
    await nav.close();
    console.log('\n');

    var l = Object.keys(erreurs).map(function (k) { return erreurs[k]; });
    var jeu = l.filter(function (e) { return !ctxDemo(e.ctx); }), demo = l.filter(function (e) { return ctxDemo(e.ctx); });
    function montre(titre, a) { console.log(titre + ' : ' + a.length); a.forEach(function (e) { console.log('   ' + e.ctx + ' — ' + e.msg + (e.n > 1 ? '  (×' + e.n + ')' : '')); }); }
    console.log('════ LA CHASSE AUX BUGS, DANS LE MOTEUR ════  (' + Math.round((Date.now() - t0) / 60000) + ' min)');
    console.log('joué : ' + pagesJouees + ' pages et événements communs · combats : ' + JSON.stringify(issues));
    montre('✗ erreurs dans le jeu', jeu);
    montre('✗ combats figés', figes.map(function (f) { return { ctx: f, msg: '', n: 1 }; }));
    montre('✗ ne se charge pas', nonCharges.map(function (f) { return { ctx: f, msg: '', n: 1 }; }));
    montre('⚠ erreurs dans les ateliers / démos / recettes ✎', demo);
    console.log('⚠ pages qui ne finissent pas (attente sans fin, boucle) : ' + neFinitPas.length);
    neFinitPas.slice(0, 30).forEach(function (c) { console.log('   ' + c); });
    var echec = jeu.length + figes.length + nonCharges.length;
    console.log(echec ? '\n❌ ' + echec + ' défaut(s)' : '\n✅ TOUT PASSE');
    process.exit(echec ? 1 : 0);
})();
