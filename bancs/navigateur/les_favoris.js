/*
 * LES FAVORIS ET « REFAIRE »
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-10 — à « si je devais améliorer un truc ? » : les menus de
 * capacités (Korrah 92 lignes, Aël 93, neuf à l'écran) ; aux Favoris et à
 * « Refaire » : « Pourquoi pas ».
 *
 * Le vrai combat, par les vraies fenêtres (le curseur, OK, Annuler, Maj) :
 *   ① « ★ Favoris » est sous l'Attaque ; vide, la liste dit comment épingler ;
 *   ② Maj sur une technique l'épingle (l'étoile), Maj encore l'enlève ; 8 au plus ;
 *   ③ un favori se lance par le chemin ordinaire (la cible, une seule fenêtre active) ;
 *   ④ « ↻ Refaire » : la dernière technique, le curseur sur la même cible ;
 *      Annuler revient en arrière sans rien figer ; grisée sans mana ;
 *      jamais l'Attaque, la Garde ni ᛟ Activer ;
 *   ⑤ un favori que le héros ne connaît plus n'est pas montré, et revient ;
 *      les favoris tiennent dans la sauvegarde ; seiryu n'a rien.
 *
 *   node bancs/navigateur/les_favoris.js
 */
'use strict';
var { chromium } = require('playwright');
var http = require('http'), fs = require('fs'), path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var TROUPE = Number(process.argv[2] || 7);
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
        await page.evaluate(function () {
            DataManager.setupNewGame();
            $gameParty._actors = [1, 2, 3, 4, 6];
            $gamePlayer.reserveTransfer(10, 5, 5, 2, 0);
            SceneManager.goto(Scene_Map);
        });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Map' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 120000 });
        await page.evaluate(function (t) {
            var B = window.__b = {};
            SceneManager.requestUpdate = function () {};            // le banc fait avancer le jeu, image par image
            B.image = function () { if (!ImageManager.isReady()) return false; Graphics.frameCount++; SceneManager.updateInputData(); SceneManager.changeScene(); SceneManager.updateScene(); return true; };
            B.avancer = function (n, jusqua) { for (var i = 0; i < n; i++) { if (jusqua && jusqua()) return true; if (!B.image()) return false; } return !!(jusqua && jusqua()); };
            // les fenêtres de saisie actives et ouvertes
            B.actives = function () {
                var S = SceneManager._scene, out = [];
                ['_partyCommandWindow', '_actorCommandWindow', '_skillWindow', '_itemWindow', '_actorWindow', '_enemyWindow'].forEach(function (k) { var w = S[k]; if (w && w.active && w.isOpen()) out.push(k); });
                return out;
            };
            B.commandes = function () { return SceneManager._scene._actorCommandWindow._list.map(function (c) { return { nom: c.name, s: c.symbol, ext: c.ext, ok: c.enabled }; }); };
            // choisir une commande par son « ext », comme une touche OK
            B.commande = function (ext) {
                var w = SceneManager._scene._actorCommandWindow, i = -1;
                w._list.forEach(function (c, k) { if (c.symbol === 'skill' && c.ext === ext) i = k; });
                if (i < 0) return false;
                w.select(i); w.processOk(); return true;
            };
            B.touche = function (nom) { Input._currentState[nom] = true; B.image(); Input._currentState[nom] = false; B.image(); };
            BattleManager.setup(t, false, false); SceneManager.push(Scene_Battle);
        }, TROUPE);
        async function jusqua(cond, max) {
            for (var i = 0; i < (max || 300); i++) {
                var fini = await page.evaluate(function (c) { var f = new Function('return (' + c + ')();'); return window.__b.avancer(120, f); }, cond.toString());
                if (fini) return true;
                await page.waitForTimeout(2);
            }
            return false;
        }
        await jusqua(function () { return SceneManager._scene instanceof Scene_Battle && BattleManager._phase === 'input' && !!BattleManager.actor() && SceneManager._scene._actorCommandWindow.active; });

        console.log('═'.repeat(74));
        console.log('  LES FAVORIS ET « REFAIRE »');
        console.log('═'.repeat(74));

        console.log('\n① La commande « ★ Favoris »');
        var r1 = await page.evaluate(function () {
            var B = window.__b, S = SceneManager._scene, o = {};
            o.qui = BattleManager.actor().name();
            o.cmd = B.commandes();
            o.lignesAvant = 0; var a = BattleManager.actor();
            [901, 902, 903].forEach(function (t) { var f = Object.create(Window_SkillList.prototype); f._actor = a; f._stypeId = t; o.lignesAvant += a.skills().filter(function (s) { return Window_SkillList.prototype.includes.call(f, s); }).length; });
            B.commande(Favoris.TYPE_FAVORIS);
            o.actives = B.actives(); o.lignes = S._skillWindow.maxItems(); o.aide = S._helpWindow._text;
            S._skillWindow.processCancel(); o.retour = B.actives();
            return o;
        });
        var iAtt = r1.cmd.findIndex(function (c) { return c.s === 'attack'; }), iFav = r1.cmd.findIndex(function (c) { return c.ext === 904; });
        V('« ★ Favoris » est juste sous l\'Attaque, et pas de « Refaire » avant d\'avoir rien lancé', iFav === iAtt + 1 && !r1.cmd.some(function (c) { return c.ext === 905; }), r1.qui + ' : ' + r1.cmd.map(function (c) { return c.nom; }).join(' · '));
        V('vide, la liste s\'ouvre et dit comment épingler ; Annuler revient aux ordres', r1.lignes === 0 && /Maj/.test(r1.aide) && r1.actives.join() === '_skillWindow' && r1.retour.join() === '_actorCommandWindow', String(r1.aide).replace(/\n/g, ' / '));

        console.log('\n② Épingler');
        var r2 = await page.evaluate(function () {
            var B = window.__b, S = SceneManager._scene, a = BattleManager.actor(), o = {};
            // la première branche du héros qui a une technique à cible ennemie qu'il peut lancer
            var type = 0, idx = -1;
            S._actorCommandWindow._list.some(function (c) {
                if (c.symbol !== 'skill' || c.ext >= 904) return false;
                var f = Object.create(Window_SkillList.prototype); f._actor = a; f._stypeId = c.ext; f.makeItemList = Window_SkillList.prototype.makeItemList; f.makeItemList();
                for (var i = 0; i < f._data.length; i++) { var s = f._data[i]; if (s && s.scope === 1 && a.canUse(s) && !/<(unison|Combo|Instantan|Rune)/i.test(s.note) && s.id !== 1309) { type = c.ext; idx = i; return true; } }
                return false;
            });
            o.type = type; B.commande(type);
            var w = S._skillWindow; w.select(idx); o.tech = w.item().id; o.nom = w.item().name; B.tech = o.tech; B.type = type; B.idx = idx;
            B.touche('shift');
            o.epingle = Favoris.de(a); o.indexGarde = w.index() === idx && w.item().id === o.tech;
            var ecrit = [], _dt = w.drawText; w.drawText = function (t) { ecrit.push(String(t)); _dt.apply(this, arguments); }; w.refresh(); w.drawText = _dt;
            o.etoile = ecrit.indexOf('★') >= 0;
            B.touche('shift'); o.enleve = Favoris.de(a);
            // huit au plus
            var autres = a.skills().filter(function (s) { return s.id !== o.tech; }).slice(0, 8).map(function (s) { return s.id; });
            autres.forEach(function (id) { Favoris.basculer(a, id); });
            o.plein = Favoris.de(a).length; w.select(idx); B.touche('shift'); o.refuse = Favoris.de(a).indexOf(o.tech) < 0; o.aidePlein = S._helpWindow._text;
            a._favoris = []; B.touche('shift'); o.fin = Favoris.de(a);
            w.processCancel();
            return o;
        });
        V('Maj sur une technique l\'épingle : l\'étoile, le curseur ne bouge pas', r2.epingle.join() === String(r2.tech) && r2.etoile && r2.indexGarde, r2.nom);
        V('Maj encore l\'enlève', r2.enleve.length === 0);
        V('huit au plus : la neuvième est refusée, et l\'aide dit pourquoi', r2.plein === 8 && r2.refuse && /8 favoris/.test(r2.aidePlein), String(r2.aidePlein).replace(/\n/g, ' / '));

        console.log('\n③ Lancer un favori');
        var r3 = await page.evaluate(function () {
            var B = window.__b, S = SceneManager._scene, a = BattleManager.actor(), o = {};
            o.favoris = Favoris.de(a);
            B.commande(Favoris.TYPE_FAVORIS);
            var w = S._skillWindow; o.liste = w._data.map(function (s) { return s.id; }); w.select(0); w.processOk();
            o.actives = B.actives();
            var ew = S._enemyWindow; o.nbEnnemis = ew._enemies.length;
            var k = Math.min(1, ew._enemies.length - 1); ew.select(k); B.cible = ew._enemies[k].index(); B.acteur = a.actorId();
            ew.processOk();
            var act = a.action(0);
            o.action = act && act.item() ? act.item().id : 0; o.cible = act ? act._targetIndex : -9; o.voulue = B.cible;
            o.apres = B.actives(); o.suivant = BattleManager.actor() ? BattleManager.actor().name() : null;
            return o;
        });
        V('la liste « Favoris » contient la technique épinglée', r3.liste.join() === String(r2.tech), r3.liste.join(', '));
        V('OK ouvre le choix de la cible, une seule fenêtre active', r3.actives.join() === '_enemyWindow', r3.actives.join(', '));
        V('la cible choisie, l\'action est bien cette technique sur cet ennemi, et la main passe au héros suivant', r3.action === r2.tech && r3.cible === r3.voulue && r3.apres.join() === '_actorCommandWindow' && !!r3.suivant, '#' + r3.action + ' → ennemi ' + r3.cible + ' ; au tour de ' + r3.suivant);

        console.log('\n④ « ↻ Refaire »');
        var r4 = await page.evaluate(function () {
            var B = window.__b, S = SceneManager._scene, o = {};
            // revenir au héros d'avant, comme avec Annuler
            S._actorCommandWindow.processCancel();
            var a = BattleManager.actor(); o.qui = a.actorId() === B.acteur;
            o.cmd = B.commandes();
            var c = o.cmd.filter(function (x) { return x.ext === Favoris.TYPE_REFAIRE; })[0];
            o.nom = c && c.nom; o.ok = c && c.ok; o.attendu = '↻ ' + String($dataSkills[B.tech].name).split(' : ').pop();
            o.ordre = o.cmd.map(function (x) { return x.s === 'attack' ? 'A' : x.ext === 905 ? 'R' : x.ext === 904 ? 'F' : x.s === 'ecritActiver' ? 'E' : '.'; }).join('');
            B.commande(Favoris.TYPE_REFAIRE);
            o.actives = B.actives();
            var ew = S._enemyWindow; o.curseur = ew.enemy() ? ew.enemy().index() : -1; o.voulue = B.cible;
            // Annuler : la liste d'une ligne, puis les ordres — rien ne se fige
            ew.processCancel(); o.annule1 = B.actives(); o.uneLigne = S._skillWindow.maxItems();
            S._skillWindow.processCancel(); o.annule2 = B.actives();
            // de nouveau, jusqu'au bout
            B.commande(Favoris.TYPE_REFAIRE); S._enemyWindow.processOk();
            var act = a.action(0); o.action = act && act.item() ? act.item().id : 0; o.cible = act ? act._targetIndex : -9;
            // sans mana ni PT ni PV à payer : grisée
            S._actorCommandWindow.processCancel(); a = BattleManager.actor();
            var mp = a.mp, tp = a.tp, hp = a.hp; a._mp = 0; a._tp = 0; a._hp = 1;
            S._actorCommandWindow.refresh(); var g = B.commandes().filter(function (x) { return x.ext === 905; })[0]; o.grisee = g ? g.ok : null; o.peut = a.canUse($dataSkills[B.tech]);
            a._mp = mp; a._tp = tp; a._hp = hp; S._actorCommandWindow.refresh();
            // jamais l'Attaque, la Garde, ᛟ Activer
            var garde = a._lastBattleSkill.itemId();
            o.jamais = [a.attackSkillId(), a.guardSkillId(), 1309].map(function (id) { a.setLastBattleSkill($dataSkills[id]); return Favoris.derniere(a); });
            a.setLastBattleSkill($dataSkills[garde]);
            // la cible tombée : le curseur ne plante pas, il reste sur un vivant
            var cible = $gameTroop.members()[B.cible]; cible.addState(1);
            B.commande(Favoris.TYPE_REFAIRE); o.surVivant = S._enemyWindow.enemy() ? S._enemyWindow.enemy().isAlive() : (B.actives().join() !== '_enemyWindow');
            if (B.actives().join() === '_enemyWindow') { S._enemyWindow.processCancel(); S._skillWindow.processCancel(); }
            cible.removeState(1); cible.setHp(cible.mhp);
            o.fin = B.actives();
            return o;
        });
        V('après une technique, « ↻ Nom » apparaît sous l\'Attaque, avant les Favoris', r4.qui && r4.nom === r4.attendu && r4.ok === true && /^AE?RF/.test(r4.ordre), r4.nom + '  (' + r4.ordre + ')');
        V('OK : tout de suite le choix de la cible, le curseur sur la même', r4.actives.join() === '_enemyWindow' && r4.curseur === r4.voulue, 'ennemi ' + r4.curseur);
        V('Annuler revient à la liste d\'une ligne, puis aux ordres — une seule fenêtre active à chaque pas', r4.annule1.join() === '_skillWindow' && r4.uneLigne === 1 && r4.annule2.join() === '_actorCommandWindow', r4.annule1.join() + ' → ' + r4.annule2.join());
        V('OK deux fois : la même technique sur la même cible', r4.action === r2.tech && r4.cible === r4.voulue, '#' + r4.action + ' → ennemi ' + r4.cible);
        V('grisée quand on ne peut pas la payer', r4.grisee === false || r4.peut === true, 'peut la lancer : ' + r4.peut + ', commande permise : ' + r4.grisee);
        V('contre-épreuve : jamais l\'Attaque, la Garde ni ᛟ Activer', r4.jamais.every(function (x) { return x === null; }));
        V('la cible tombée : le curseur est sur un ennemi debout, et on revient aux ordres sans rien figer', r4.surVivant && r4.fin.join() === '_actorCommandWindow', r4.fin.join());

        console.log('\n⑤ Ce qui tient');
        var r5 = await page.evaluate(function () {
            var B = window.__b, a = BattleManager.actor(), o = {};
            var s = $dataSkills[B.tech];
            o.avant = Favoris.visibles(a).map(function (x) { return x.id; });
            a.forgetSkill(B.tech); o.oublie = Favoris.visibles(a).length; o.garde = Favoris.de(a).join();
            o.refaireOublie = Favoris.derniere(a);
            a.learnSkill(B.tech); o.revenu = Favoris.visibles(a).map(function (x) { return x.id; });
            // la sauvegarde
            var copie = JsonEx.parse(JsonEx.stringify($gameActors)); o.sauve = (copie.actor(a.actorId())._favoris || []).join();
            // seiryu : ni favoris ni refaire dans ses ordres (il joue seul)
            var w = new Window_ActorCommand(); w.setup($gameActors.actor(6));
            o.seiryu = w._list.filter(function (c) { return c.ext >= 904; }).length;
            // au menu (hors combat) : la même touche épingle
            $gameParty._inBattle = false;
            var m = new Window_SkillList(0, 0, 400, 300); m.setActor(a); m.setStypeId(s.stypeId); m.refresh();
            var i = m._data.indexOf(s); o.auMenu = null;
            if (i >= 0) { m.select(i); a._favoris = []; m.epingler(); o.auMenu = Favoris.de(a).join(); }
            $gameParty._inBattle = true;
            return o;
        });
        V('un favori que le héros ne connaît plus n\'est pas montré (ni « Refaire ») ; il revient avec la technique', r5.oublie === 0 && r5.garde === String(r2.tech) && r5.refaireOublie === null && r5.revenu.join() === String(r2.tech));
        V('les favoris sont dans la sauvegarde', r5.sauve === String(r2.tech), r5.sauve);
        V('seiryu, qui joue seul, n\'a ni l\'un ni l\'autre', r5.seiryu === 0);
        V('au menu des capacités, hors combat, la même touche épingle', r5.auMenu === null || r5.auMenu === String(r2.tech), r5.auMenu === null ? '(cette technique n\'est pas dans sa branche au menu)' : r5.auMenu);
        V('aucune erreur dans la page', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
    } catch (e) {
        ko++; console.log('   ✗ le banc a planté : ' + (e && e.stack || e)); if (erreurs.length) console.log('     erreurs : ' + erreurs.slice(0, 3).join(' | '));
    } finally {
        if (nav) await nav.close();
        serveur.close();
    }
    console.log('\n' + (ko ? '❌ ' + ko + ' échec(s), ' : '✅ ') + ok + ' contrôle(s) réussi(s)');
    process.exit(ko ? 1 : 0);
})();
