/*
 * LES MENUS DE COMBAT — chaque commande, chaque compétence, chaque cible
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-03 (écran « Cannot read property 'scope' of null » en
 * combat) : « En fait, vérifie dans le jeu que crash. Je me saoule qu'il y ait
 * autant de crash. »
 *
 * La chasse aux bugs (la_chasse_aux_bugs.js) joue les troupes en combat
 * AUTOMATIQUE : elle ne passe jamais par les fenêtres où le joueur choisit.
 * Ce banc y passe, comme une manette, par les vrais gestionnaires de MV :
 *
 *   pour chaque héros qui saisit (les 4, seiryu joue seul),
 *     chaque commande de sa fenêtre d'ordres (Attaque, ᛟ Activer, Voies,
 *     Paroles, Runes, branches, Ultimes, Combo, Garde, Objets…),
 *       chaque ligne de la liste (compétence ou objet) : le curseur dessus
 *       (l'aide se dessine), puis OK si elle est permise,
 *         chaque cible proposée (ennemi ou allié) : le curseur dessus, puis
 *         Annuler — et retour à la liste ;
 *   puis, pour finir, chacun attaque et le tour se joue.
 *
 * Chaque erreur est notée avec son chemin : « Aël › Paroles › #1196 … ›
 * allié 2 », et la première ligne utile de la pile.
 *
 *   node bancs/navigateur/les_menus_de_combat.js            (troupe 7)
 *   node bancs/navigateur/les_menus_de_combat.js 21         (une autre troupe)
 *   TOURS=3 node bancs/navigateur/les_menus_de_combat.js 21 (trois tours : lent)
 */
'use strict';
var { chromium } = require('playwright');
var http = require('http'), fs = require('fs'), path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var TROUPE = Number(process.argv[2] || 7);
var TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.ttf': 'font/ttf', '.woff': 'font/woff', '.otf': 'font/otf' };
var serveur = http.createServer(function (req, res) {
    var f = path.join(RACINE, decodeURIComponent(req.url.split('?')[0]));
    if (f.indexOf(RACINE) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
});
var horsPas = [];

(async function () {
    var ok = 0, ko = 0, nav = null;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    try {
        await new Promise(function (r) { serveur.listen(0, '127.0.0.1', r); });
        nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
        var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
        page.on('pageerror', function (e) { horsPas.push(e.message.slice(0, 200)); });
        await page.goto('http://127.0.0.1:' + serveur.address().port + '/index.html', { waitUntil: 'load' });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 180000 });
        await page.evaluate(function () {
            DataManager.setupNewGame();
            $gameParty._actors = [1, 2, 3, 4, 6];
            // de quoi remplir la fenêtre des objets : un de chaque objet utilisable en combat
            $dataItems.forEach(function (it) { if (it && it.name && (it.occasion === 0 || it.occasion === 1)) $gameParty.gainItem(it, 1); });
            $gamePlayer.reserveTransfer(10, 5, 5, 2, 0);
            SceneManager.goto(Scene_Map);
        });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Map' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 120000 });
        await page.evaluate(function (t) { BattleManager.setup(t, true, true); SceneManager.push(Scene_Battle); }, TROUPE);
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Battle' && SceneManager.isCurrentSceneStarted() && BattleManager._phase === 'input' && BattleManager.actor(); }, null, { timeout: 120000 });

        await page.evaluate(function () { window.__balayer = function () {
            var S = SceneManager._scene, out = { erreurs: [], vus: { commandes: 0, lignes: 0, cibles: 0 }, heros: [] };
            function pile(e) { return String(e && e.stack || '').split('\n').slice(1, 3).map(function (l) { return l.trim().replace(/\(?https?:\/\/[^/]+\/js\/plugins\//, '(').replace(/\)$/, ''); }).join(' ← '); }
            function essai(chemin, f) {
                try { f(); return true; } catch (e) { out.erreurs.push(chemin + '  →  ' + e.message + '  [' + pile(e) + ']'); return false; }
            }
            function nomLigne(w, k) { var it = w._data && w._data[k]; return it ? '#' + it.id + ' ' + it.name : 'ligne ' + k; }
            function cibles(chemin) {
                var fen = S._enemyWindow && S._enemyWindow.active ? S._enemyWindow : (S._actorWindow && S._actorWindow.active ? S._actorWindow : null);
                if (!fen) return;
                for (var c = 0; c < fen.maxItems(); c++) { out.vus.cibles++; essai(chemin + ' › ' + (fen === S._enemyWindow ? 'ennemi ' : 'allié ') + (c + 1), function () { fen.select(c); fen.updateHelp && fen.updateHelp(); }); }
                essai(chemin + ' › annuler la cible', function () { fen.processCancel(); });
            }
            // comme la vraie touche OK / Annuler (processOk / processCancel : la fenêtre
            // se désactive) ; et pendant le balayage, le héros garde la main : une
            // compétence sans cible ne passe pas au suivant (ni ne lance le tour)
            var suivant = BattleManager.selectNextCommand;
            BattleManager.selectNextCommand = function () {};
            var heros = $gameParty.battleMembers().filter(function (a) { return a.canInput(); });
            heros.forEach(function (a) {
                essai(a.name() + ' › prendre la main', function () {
                    BattleManager._actorIndex = $gameParty.members().indexOf(a);
                    a.makeActions(); a.setActionState('inputting');
                    S.startActorCommandSelection();
                });
                var cw = S._actorCommandWindow, n = 0;
                out.heros.push(a.name() + ' (' + cw.maxItems() + ' commandes)');
                for (var i = 0; i < cw.maxItems(); i++) {
                    var cmd = cw._list[i], chemin = a.name() + ' › ' + cmd.name;
                    if (!cmd.enabled) continue;
                    out.vus.commandes++;
                    if (!essai(chemin + ' › ouvrir', function () { cw.activate(); cw.select(i); cw.processOk(); })) { essai(chemin + ' › revenir', function () { S.startActorCommandSelection(); }); continue; }
                    var liste = S._skillWindow && S._skillWindow.active ? S._skillWindow : (S._itemWindow && S._itemWindow.active ? S._itemWindow : null);
                    if (liste) {
                        for (var k = 0; k < liste.maxItems(); k++) {
                            out.vus.lignes++;
                            var cl = chemin + ' › ' + nomLigne(liste, k);
                            if (!essai(cl + ' › le curseur dessus', function () { liste.select(k); liste.updateHelp(); })) continue;
                            if (!liste.isCurrentItemEnabled()) continue;
                            if (!essai(cl + ' › OK', function () { liste.processOk(); })) { essai(cl + ' › revenir', function () { liste.activate(); }); continue; }
                            cibles(cl);
                            // revenu sur la liste ? (une compétence sans cible a fini la saisie : on la reprend)
                            if (!liste.active) essai(cl + ' › reprendre', function () {
                                BattleManager._actorIndex = $gameParty.members().indexOf(a); a.makeActions(); a.setActionState('inputting');
                                S.startActorCommandSelection(); cw.activate(); cw.select(i); cw.processOk();
                            });
                        }
                        essai(chemin + ' › fermer la liste', function () { if (liste.active) liste.processCancel(); });
                    } else {
                        cibles(chemin);
                    }
                    essai(chemin + ' › revenir aux ordres', function () {
                        BattleManager._actorIndex = $gameParty.members().indexOf(a); a.makeActions(); a.setActionState('inputting');
                        S.startActorCommandSelection();
                    });
                }
            });
            BattleManager.selectNextCommand = suivant;
            return out;
        }; });

        // balayer, jouer un vrai tour, rebalayer : l'état du combat change (Réponses,
        // Traque, Bête, seiryu, états…) — TOURS=1 par défaut, TOURS=3 pour aller plus loin (lent :
        // bridé, une action de boss prend une à deux minutes)
        var TOURS = Number(process.env.TOURS || 1);
        for (var tour = 1; tour <= TOURS; tour++) {
            var r = await page.evaluate(function () { return window.__balayer(); });
            console.log('\n── Tour ' + tour + ' · ' + r.heros.join(' · '));
            console.log('Vus : ' + r.vus.commandes + ' commandes, ' + r.vus.lignes + ' lignes, ' + r.vus.cibles + ' cibles');
            var groupes = {};
            r.erreurs.forEach(function (e) { var cle = e.split('  →  ')[1]; (groupes[cle] = groupes[cle] || []).push(e.split('  →  ')[0]); });
            Object.keys(groupes).forEach(function (k) { console.log('   ✗ ' + k + '\n       ' + groupes[k].length + ' fois, dont : ' + groupes[k].slice(0, 4).join(' · ')); });
            V('tour ' + tour + ' : aucun plantage dans les menus (troupe ' + TROUPE + ')', r.erreurs.length === 0, r.erreurs.length + ' plantage(s), ' + Object.keys(groupes).length + ' différent(s)');

            // un vrai tour : chacun lance une compétence qui frappe (une autre à chaque tour), sinon il attaque
            var avant = horsPas.length;
            await page.evaluate(function (n) {
                var S = SceneManager._scene;
                $gameParty.battleMembers().filter(function (a) { return a.canInput(); }).forEach(function (a, j) {
                    BattleManager._actorIndex = $gameParty.members().indexOf(a); a.makeActions(); a.setActionState('inputting');
                    S.startActorCommandSelection();
                    var act = BattleManager.inputtingAction();
                    var l = a.skills().filter(function (s) { return s.damage.type === 1 && s.scope === 1 && a.canUse(s); });
                    if (l.length) act.setSkill(l[(n * 7 + j * 3) % l.length].id); else act.setAttack();
                    act.setTarget(0);
                });
                // comme après le dernier OK : plus aucune fenêtre de saisie active (sinon
                // Scene_Battle n'appelle plus BattleManager.update et le combat attend)
                [S._partyCommandWindow, S._actorCommandWindow, S._skillWindow, S._itemWindow, S._actorWindow, S._enemyWindow].forEach(function (w) { if (w) w.deactivate(); });
                S.endCommandSelection(); BattleManager._actorIndex = -1; BattleManager.startTurn();
            }, tour);
            await page.waitForFunction(function () { return (BattleManager._phase === 'input' && BattleManager.actor()) || BattleManager.isBattleEnd() || $gameParty.isAllDead(); }, null, { timeout: 900000 }).catch(function () {});
            V('tour ' + tour + ' : il se joue sans erreur', horsPas.length === avant, horsPas.slice(avant, avant + 2).join(' | '));
            var fin = await page.evaluate(function () { return BattleManager.isBattleEnd() || $gameParty.isAllDead() || !(BattleManager._phase === 'input' && BattleManager.actor()); });
            if (fin) { console.log('   (le combat est fini, ou ne revient pas à la saisie)'); break; }
        }
        V('aucune erreur hors des essais', horsPas.length === 0, horsPas.slice(0, 3).join(' | '));
    } catch (e) {
        ko++; console.error(e);
    } finally {
        if (nav) await nav.close();
        serveur.close();
    }
    console.log('\n' + (ko ? '❌ ' + ko + ' échec(s), ' + ok + ' réussite(s)' : '✅ TOUT PASSE (' + ok + ' contrôles)'));
    process.exit(ko ? 1 : 0);
})();
