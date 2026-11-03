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
 *         une rune de zone : « Garder », puis « Piège », puis Annuler ce choix ;
 *         chaque cible proposée (ennemi ou allié) : le curseur dessus, puis
 *         Annuler comme JOKO, d'un clic droit, la souris sur un autre combattant
 *         — et retour à la liste ;
 *   et à chaque pas, jamais deux fenêtres de saisie actives à la fois (une
 *   fenêtre active cachée derrière une autre répond encore aux touches) ;
 *   puis, pour finir, chacun lance une compétence qui frappe et le tour se joue.
 *
 * Le 2026-11-03 (« Système de runes avec les pièges, c'est ça qui marche pas ») :
 * après « Garder / Piège », LEcrit laissait la liste des compétences active,
 * cachée derrière la fenêtre des cibles ; un clic droit sur un héros l'annulait,
 * vidait l'action, et la fenêtre des alliés relisait l'action vide.
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
            // les fenêtres de saisie actives (ouvertes) : jamais plus d'une
            out.doubles = [];
            function actives() {
                return S._windowLayer.children.filter(function (w) { return w instanceof Window_Selectable && w.active && w.isOpen(); })
                    .map(function (w) { return w.constructor.name; });
            }
            function seul(chemin) { var a = actives(); if (a.length > 1) out.doubles.push(chemin + '  →  ' + a.join(' + ')); }
            // une image où l'on clique à droite (Annuler), la souris sur un autre combattant que la cible
            function clicDroit(fen) {
                var autres = fen === S._actorWindow ? $gameParty.battleMembers() : $gameTroop.aliveMembers();
                var autre = autres.filter(function (b, i) { return i !== fen.index() && b.isSpriteVisible() && b.isAppeared(); })[0];
                var mx = TouchInput._mouseOverX, my = TouchInput._mouseOverY;
                if (autre) { TouchInput._mouseOverX = autre.spritePosX(); TouchInput._mouseOverY = autre.spritePosY() - autre.spriteHeight() / 2; }
                TouchInput._cancelled = true;
                try { S._windowLayer.children.slice().forEach(function (w) { if (w instanceof Window_Selectable) w.update(); }); }
                finally { TouchInput._cancelled = false; TouchInput._mouseOverX = mx; TouchInput._mouseOverY = my; }
            }
            function nomLigne(w, k) { var it = w._data && w._data[k]; return it ? '#' + it.id + ' ' + it.name : 'ligne ' + k; }
            function cibles(chemin) {
                var fen = S._enemyWindow && S._enemyWindow.active ? S._enemyWindow : (S._actorWindow && S._actorWindow.active ? S._actorWindow : null);
                if (!fen) return;
                for (var c = 0; c < fen.maxItems(); c++) { out.vus.cibles++; essai(chemin + ' › ' + (fen === S._enemyWindow ? 'ennemi ' : 'allié ') + (c + 1), function () { fen.select(c); fen.updateHelp && fen.updateHelp(); }); }
                seul(chemin + ' › la cible');
                essai(chemin + ' › annuler la cible (clic droit sur un autre)', function () { clicDroit(fen); });
                if (fen.active) essai(chemin + ' › annuler la cible', function () { fen.processCancel(); });
                seul(chemin + ' › la cible annulée');
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
                            var fr = S._fenetreRune;
                            if (fr && fr.active) {
                                if (!out.premiereRune) out.premiereRune = { heros: $gameParty.members().indexOf(a), cmd: i, ligne: k, nom: cl };
                                // une rune de zone : Garder, puis Piège (chacun jusqu'aux cibles), puis Annuler le choix
                                ['garder', 'piege', 'annuler'].forEach(function (mode, m) {
                                    if (m > 0 && !fr.active) essai(cl + ' › rouvrir le choix', function () { if (!liste.active) liste.activate(); liste.select(k); liste.processOk(); });
                                    if (!fr.active) return;
                                    seul(cl + ' › Garder / Piège');
                                    if (mode === 'annuler') { essai(cl + ' › annuler le choix', function () { fr.processCancel(); }); seul(cl + ' › choix annulé'); return; }
                                    essai(cl + ' › ' + mode, function () { fr.select(m); fr.processOk(); });
                                    seul(cl + ' › ' + mode);
                                    cibles(cl + ' › ' + mode);
                                });
                            } else {
                                if (!out.premierAllie && S._actorWindow.active && !S._actorWindow._inputLock) out.premierAllie = { heros: $gameParty.members().indexOf(a), cmd: i, ligne: k, nom: cl };
                                seul(cl + ' › OK');
                                cibles(cl);
                            }
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

        // Dans les deux sens : ce que le balayage contrôle doit attraper l'ancien défaut.
        async function contreEpreuves(r) {
            var ce = await page.evaluate(function (p) {
                var S = SceneManager._scene, res = {};
                var suivant = BattleManager.selectNextCommand; BattleManager.selectNextCommand = function () {};
                function actives() { return S._windowLayer.children.filter(function (w) { return w instanceof Window_Selectable && w.active && w.isOpen(); }).map(function (w) { return w.constructor.name; }); }
                function aller(l) {
                    var a = $gameParty.members()[l.heros];
                    BattleManager._actorIndex = l.heros; a.makeActions(); a.setActionState('inputting'); S.startActorCommandSelection();
                    var cw = S._actorCommandWindow; cw.activate(); cw.select(l.cmd); cw.processOk();
                    var liste = S._skillWindow.active ? S._skillWindow : S._itemWindow;
                    liste.select(l.ligne); liste.processOk();
                }
                function revenir() {
                    [S._partyCommandWindow, S._actorCommandWindow, S._skillWindow, S._itemWindow, S._actorWindow, S._enemyWindow, S._fenetreRune].forEach(function (w) { if (w) { w.deactivate(); if (w !== S._actorCommandWindow) w.hide(); } });
                    TouchInput.clear();
                }
                try {
                    // ① la rune de zone : « Piège », puis combien de fenêtres répondent
                    if (p.rune) {
                        // LEcrit d'avant : choisirRune réactivait la liste (la fenêtre du choix garde son
                        // gestionnaire lié à sa création : on rejoue la ligne retirée, pas le prototype)
                        try { aller(p.rune); S._fenetreRune.select(1); S._skillWindow.activate(); S._fenetreRune.processOk(); res.avant = actives(); } finally { revenir(); }
                        aller(p.rune); S._fenetreRune.select(1); S._fenetreRune.processOk(); res.apres = actives(); revenir();
                    }
                    // ② la fenêtre des alliés ouverte, l'action vidée sous elle, le curseur bouge
                    if (p.allie) {
                        var texte = Window_Help.prototype.specialSelectionText;
                        function bouger() {
                            aller(p.allie);
                            BattleManager.inputtingAction().clear();
                            try { S._actorWindow.select((S._actorWindow.index() + 1) % S._actorWindow.maxItems()); return 'rien'; } catch (e) { return e.message; } finally { revenir(); }
                        }
                        Window_Help.prototype.specialSelectionText = function (action) { BattleManager.resetSelection(); if (!action) return false; return !action.needsSelection(); };   // YEP d'origine
                        try { res.sansGarde = bouger(); } finally { Window_Help.prototype.specialSelectionText = texte; }
                        res.avecGarde = bouger();
                    }
                } finally { BattleManager.selectNextCommand = suivant; }
                return res;
            }, { rune: r.premiereRune, allie: r.premierAllie });
            console.log('\n── Contre-épreuves');
            if (r.premiereRune) {
                V("LEcrit d'avant (la liste réactivée) : deux fenêtres actives après « Piège », attrapé", ce.avant && ce.avant.length > 1, r.premiereRune.nom + ' : ' + (ce.avant || []).join(' + '));
                V('maintenant : une seule fenêtre active après « Piège »', ce.apres && ce.apres.length === 1, (ce.apres || []).join(' + '));
            } else V('une rune de zone (Garder / Piège) a été trouvée pour la contre-épreuve', false);
            if (r.premierAllie) {
                V("YEP d'origine : l'action vidée sous la fenêtre des alliés plante (« scope of null »)", /scope/.test(ce.sansGarde), r.premierAllie.nom + ' : ' + ce.sansGarde);
                V('maintenant : la même chose ne plante plus', ce.avecGarde === 'rien', ce.avecGarde);
            } else V('une cible alliée a été trouvée pour la contre-épreuve', false);
        }
        for (var tour = 1; tour <= TOURS; tour++) {
            var r = await page.evaluate(function () { return window.__balayer(); });
            console.log('\n── Tour ' + tour + ' · ' + r.heros.join(' · '));
            console.log('Vus : ' + r.vus.commandes + ' commandes, ' + r.vus.lignes + ' lignes, ' + r.vus.cibles + ' cibles');
            var groupes = {};
            r.erreurs.forEach(function (e) { var cle = e.split('  →  ')[1]; (groupes[cle] = groupes[cle] || []).push(e.split('  →  ')[0]); });
            Object.keys(groupes).forEach(function (k) { console.log('   ✗ ' + k + '\n       ' + groupes[k].length + ' fois, dont : ' + groupes[k].slice(0, 4).join(' · ')); });
            V('tour ' + tour + ' : aucun plantage dans les menus (troupe ' + TROUPE + ')', r.erreurs.length === 0, r.erreurs.length + ' plantage(s), ' + Object.keys(groupes).length + ' différent(s)');
            r.doubles.slice(0, 6).forEach(function (d) { console.log('       ' + d); });
            V('tour ' + tour + ' : jamais deux fenêtres de saisie actives à la fois', r.doubles.length === 0, r.doubles.length + ' fois');
            if (tour === 1) await contreEpreuves(r);

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
