/*
 * LA ROUE DE KEVÉRATUS — Mahoraga v3 (MahoragaBoss.js)
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-03 : « rework mahoraga […] plus intéressant et plus simple
 * aussi car au final noyé de concept c'est pas bon », puis : Kevératus
 * Vultric ; la Roue s'adapte aux trois arts ; à 50 %, la Bête ; un jeu
 * d'attaques neuf. Son texte (EMPIRE_DU_CORPS.md) : « il s'adapte à n'importe
 * quoi pour en réduire les effets » — « une baisse de dégâts à chaque fois
 * qu'il est touché ».
 *
 *   ① sa fiche : Kevératus Vultric, ses 5 attaques neuves, sa Réponse, le Traqué ;
 *   ② la Roue : un art qui le touche tourne d'un cran (×1, ×0,7, ×0,4, ADAPTÉ
 *     ×0,1), une fois par action ; les autres arts ne bougent pas ; une
 *     estimation (l'IA, l'aide) ne la tourne pas ; contre-épreuve : un ennemi
 *     ordinaire prend tout ;
 *   ③ adapté : il répond à qui l'a frappé (la Réponse dans la file des
 *     actions forcées, sur ce héros) ;
 *   ④ un art qu'il n'a pas vu d'un tour perd un cran ; celui qu'il a vu garde ;
 *   ⑤ la Bête sous 50 % : deux actions, la Roue en deux coups (×1, ×0,5,
 *     ADAPTÉ) ; jamais deux frappes annoncées le même tour ;
 *   ⑥ la Chasse : son Croc va sur le Traqué, sinon sur le plus blessé ;
 *   ⑦ à l'écran : la Roue au-dessus du combat, sa ligne dans la barre du boss.
 *
 *   node bancs/navigateur/la_roue_de_keveratus.js
 */
'use strict';
var { chromium } = require('playwright');
var http = require('http'), fs = require('fs'), path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.ttf': 'font/ttf', '.woff': 'font/woff', '.otf': 'font/otf' };
var serveur = http.createServer(function (req, res) {
    var f = path.join(RACINE, decodeURIComponent(req.url.split('?')[0]));
    if (f.indexOf(RACINE) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
});
var erreurs = [];

(async function () {
    var ok = 0, ko = 0, nav = null;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    try {
        await new Promise(function (r) { serveur.listen(0, '127.0.0.1', r); });
        nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
        var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
        page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
        await page.goto('http://127.0.0.1:' + serveur.address().port + '/index.html', { waitUntil: 'load' });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 180000 });

        // ① sa fiche
        var r1 = await page.evaluate(function () {
            var e = $dataEnemies[21], st = $dataStates[278];
            return {
                nom: e.name, roue: !!e.meta.Mahoraga, actions: e.actions.map(function (a) { return a.skillId; }),
                existent: [1322, 1323, 1324, 1325, 1326, 1327].every(function (i) { return $dataSkills[i] && $dataSkills[i].name; }),
                chasse: !!$dataSkills[1322].meta.Chasse, telegraphe: /<Telegraphe>/.test($dataSkills[1326].note), frappe: /<Apres: surcharge>/.test($dataSkills[1327].note),
                traque: st && st.name, tgr: st && st.traits.some(function (t) { return t.code === 23 && t.dataId === 0 && t.value >= 5; })
            };
        });
        console.log('\n① Sa fiche');
        V('l\'ennemi 21 s\'appelle Kevératus Vultric et porte la Roue', r1.nom === 'Kevératus Vultric' && r1.roue, r1.nom);
        V('ses 5 attaques neuves, sa Réponse : les fiches existent', r1.existent && r1.actions.join() === '1322,1324,1323,1326,1327', r1.actions.join(', '));
        V('le Croc chasse, les Chaînes s\'annoncent (Charge), Déchaîné est la frappe', r1.chasse && r1.telegraphe && r1.frappe);
        V('🎯 Traqué : on le vise d\'abord', r1.traque === '🎯 Traqué' && r1.tgr);

        // le combat : la troupe 21, l'équipe
        await page.evaluate(function () {
            DataManager.setupNewGame();
            $gameParty._actors = [1, 2, 3, 4];
            $gamePlayer.reserveTransfer(10, 5, 5, 2, 0);
            SceneManager.goto(Scene_Map);
        });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Map' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 120000 });
        await page.evaluate(function () { BattleManager.setup(21, true, true); SceneManager.push(Scene_Battle); });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Battle' && SceneManager.isCurrentSceneStarted() && BattleManager._phase === 'input'; }, null, { timeout: 120000 });
        await page.evaluate(function () {
            // une compétence qui frappe, de chaque art, chez un héros qui la connaît
            window.coupDe = function (art) {
                var l = $gameParty.members();
                for (var i = 0; i < l.length; i++) {
                    var s = l[i].skills().filter(function (x) { return x.damage.type === 1 && x.scope === 1 && LesTroisArts.art(x) === art; })[0];
                    if (s) { var a = new Game_Action(l[i]); a.setSkill(s.id); return a; }
                }
                return null;
            };
            window.boss = $gameTroop.members()[0];
        });

        // ② la Roue
        var r2 = await page.evaluate(function () {
            var b = boss, out = {}, a = coupDe('parole'), m = coupDe('mouvement');
            b._roue = { mouvement: 0, parole: 0, ecrit: 0 }; b._roueVu = {};
            function estime(act) { var v = 0; for (var k = 0; k < 4; k++) { var x = act.makeDamageValue(b, false); v = Math.max(v, x); } return v; }
            Math.random = (function () { return function () { return 0.5; }; })();
            var plein = estime(a);
            out.estimeSansTourner = BattleManager._roueCoup == null && b._roue.parole === 0;
            var suite = [];
            for (var n = 0; n < 4; n++) { suite.push(Math.round(estime(a) / plein * 100) / 100); LaRoue.tourner(b, 'parole', a.subject()); }
            out.suite = suite;
            out.mouvementIntact = Math.round(estime(m) / estime(m) * 100) / 100 === 1 && b._roue.mouvement === 0;
            // une vraie action : elle se note ; deux cibles, deux coups, un seul cran
            b._roue.parole = 0;
            BattleManager._action = a;
            a.makeDamageValue(b, false); a.makeDamageValue(b, false);
            out.note = BattleManager._roueCoup && BattleManager._roueCoup.art;
            BattleManager._action = null; BattleManager._roueCoup = null;
            // contre-épreuve : un ennemi ordinaire
            var o = new Game_Enemy(1, 0, 0);
            out.ordinaire = estime(a) !== a.makeDamageValue(o, false) || !o._roue;
            out.ordinaireRoue = o._roue === undefined;
            return out;
        });
        console.log('\n② La Roue');
        V('Paroles : ×1, ×0,7, ×0,4, puis ADAPTÉ ×0,1', JSON.stringify(r2.suite) === '[1,0.7,0.4,0.1]', JSON.stringify(r2.suite));
        V('une estimation (l\'IA, l\'aide) ne la tourne pas', r2.estimeSansTourner);
        V('les Voies, qu\'il n\'a pas vues, frappent à plein', r2.mouvementIntact);
        V('une vraie action se note une fois (son art)', r2.note === 'parole', r2.note);
        V('contre-épreuve : un ennemi ordinaire n\'a pas de Roue', r2.ordinaireRoue);

        // ③ la Réponse
        var r3 = await page.evaluate(function () {
            var b = boss, a = coupDe('ecrit'), h = a.subject();
            b._roue = { mouvement: 0, parole: 0, ecrit: 2 }; b._roueVu = {};
            if ($gameTemp._forceActionQueue) $gameTemp._forceActionQueue.list = [];
            LaRoue.tourner(b, 'ecrit', h);
            var q = ($gameTemp._forceActionQueue && $gameTemp._forceActionQueue.list) || [];
            var rep = q.filter(function (c) { return c.code === 339 && c.parameters[2] === 1325; })[0];
            return { adapte: LaRoue.adapte(b, 'ecrit'), reponse: !!rep, cible: rep && rep.parameters[3], heros: h.index(), nom: h.name() };
        });
        console.log('\n③ Adapté : il répond');
        V('le 3e coup de Runes : ADAPTÉ, et sa Réponse part sur celui qui l\'a frappé', r3.adapte && r3.reponse && r3.cible === r3.heros, r3.nom + ' (rang ' + r3.heros + ')');

        // ④ ce qu'il ne voit plus, il l'oublie
        var r4 = await page.evaluate(function () {
            var b = boss;
            b._roue = { mouvement: 2, parole: 2, ecrit: 1 }; b._roueVu = { parole: true };
            BattleManager.endTurn();
            var apres = JSON.parse(JSON.stringify(b._roue));
            BattleManager.startInput();
            return apres;
        });
        console.log('\n④ Il oublie ce qu\'il ne voit plus');
        V('fin du tour : Voies 2 → 1, Runes 1 → 0, Paroles (vues) restent à 2', r4.mouvement === 1 && r4.ecrit === 0 && r4.parole === 2, JSON.stringify(r4));

        // ⑤ la Bête
        var r5 = await page.evaluate(function () {
            var b = boss, out = {};
            b._roue = { mouvement: 3, parole: 1, ecrit: 0 };
            out.avant = b._bete;
            b.setHp(Math.floor(b.mhp * 0.49));
            b.makeActions();
            out.bete = b._bete; out.actions = b.numActions();
            out.mouvementAdapte = LaRoue.adapte(b, 'mouvement') && b._roue.mouvement === 2;
            out.paroleMult = LaRoue.mult(b, 'parole');
            // chargé : jamais deux Déchaîné le même tour
            b.addState(207);
            var deux = 0;
            for (var k = 0; k < 20; k++) { b.makeActions(); deux = Math.max(deux, b._actions.filter(function (x) { return x.item() && x.item().id === 1327; }).length); }
            out.dechaines = deux;
            b.removeState(207);
            return out;
        });
        console.log('\n⑤ La Bête');
        V('sous 50 % : la Bête, deux actions par tour', !r5.avant && r5.bete && r5.actions === 2, r5.actions + ' actions');
        V('sa Roue s\'adapte en deux coups : ×1, ×0,5, ADAPTÉ', r5.mouvementAdapte && r5.paroleMult === 0.5, 'Paroles ×' + r5.paroleMult);
        V('chargé, il ne lance qu\'un Déchaîné par tour', r5.dechaines === 1, r5.dechaines + ' au plus');

        // ⑥ la Chasse
        var r6 = await page.evaluate(function () {
            var b = boss, h = $gameParty.members(), out = {};
            h.forEach(function (x) { x.recoverAll(); });
            h[2].setHp(Math.floor(h[2].mhp * 0.3));
            var a = new Game_Action(b); a.setSkill(1322);
            out.blesse = a.makeTargets()[0] === h[2];
            h[1].addState(278);
            out.traque = a.makeTargets()[0] === h[1];
            h[1].removeState(278);
            out.noms = [h[2].name(), h[1].name()];
            return out;
        });
        console.log('\n⑥ La Chasse');
        V('le Croc va sur le plus blessé', r6.blesse, r6.noms[0] + ' à 30 %');
        V('… et sur le Traqué d\'abord', r6.traque, r6.noms[1] + ' traqué');

        // ⑧ une gêne, une fois
        var r8 = await page.evaluate(function () {
            var b = boss, h = $gameParty.aliveMembers()[0], out = {};
            function deuxFois(id, qui) {
                BattleManager._subject = qui; b.addState(id); var une = b.isStateAffected(id);
                b.removeState(id); b.clearResult(); b.addState(id); var deux = b.isStateAffected(id);
                b.removeState(id); BattleManager._subject = null; return [une, deux];
            }
            b._roueEtats = [];
            out.aveugle = deuxFois(5, h);
            out.aura = deuxFois(266, h);
            out.brise = deuxFois(1005, h);
            out.lui = deuxFois(8, b);
            return out;
        });
        console.log('\n⑧ Une gêne, il ne la subit qu\'une fois');
        V('Aveuglé posé par un héros : subi la 1re fois, refusé la 2e', r8.aveugle[0] === true && r8.aveugle[1] === false, JSON.stringify(r8.aveugle));
        V('contre-épreuve : une aura de réaction (◈ Feu) tient les deux fois', r8.aura[0] && r8.aura[1]);
        V('contre-épreuve : la Brisure du bouclier tient les deux fois', r8.brise[0] && r8.brise[1]);
        V('contre-épreuve : ce qu\'il se pose lui-même tient les deux fois', r8.lui[0] && r8.lui[1]);

        // ⑦ à l'écran
        var r7 = await page.evaluate(function () {
            var sp = SceneManager._scene._spriteset;
            return { roue: !!(sp._roue && sp._roue.visible), ligne: window.MecaBoss && MecaBoss.ligne ? MecaBoss.ligne(boss) : '' };
        });
        console.log('\n⑦ À l\'écran');
        V('la Roue est au-dessus du combat', r7.roue);
        V('la barre du boss dit sa Roue', /☸ Voies .* · Paroles .* · Runes .*LA BÊTE/.test(r7.ligne), r7.ligne);
        V('aucune erreur dans la page', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
    } catch (e) {
        ko++; console.error(e); console.error('erreurs de la page :', erreurs.slice(0, 5));
    } finally {
        if (nav) await nav.close();
        serveur.close();
    }
    console.log('\n' + (ko ? '❌ ' + ko + ' échec(s), ' + ok + ' réussite(s)' : '✅ TOUT PASSE (' + ok + ' contrôles)'));
    process.exit(ko ? 1 : 0);
})();
