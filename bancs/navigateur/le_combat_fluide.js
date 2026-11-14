/*
 * LE COMBAT FLUIDE ET SON RAPPORT
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-10 : « Améliore le jeu la fluidité des combats et un rapport
 * des combats que le joueur va faire » — le rapport : « Dans le jeu, après le
 * combat ».
 *
 * « Fluide » se mesure. Ce banc fait tourner le vrai combat image par image
 * (la logique du jeu, sans attendre l'horloge : le résultat ne dépend pas de la
 * machine) et compte, pour chaque action, combien d'images elle dure et ce que
 * le jeu attend pendant ce temps (l'animation, une pause du journal, un pas).
 *
 *   ① la mesure : les mêmes actions des mêmes héros, CombatFluide éteint puis
 *      allumé — et le détail de ce qui est attendu ;
 *   ② les temps morts : une ligne de journal invisible n'attend plus, les
 *      pauses sont raccourcies ; éteint, tout est comme avant ;
 *   ③ les animations : 3 images par dessin en combat, 4 sur la carte ;
 *   ④ les images chargées d'avance, dès que la technique est choisie ;
 *   ⑤ l'avance rapide (Maj tenue) : ×3 pendant les actions, jamais pendant la
 *      saisie, un message ou la victoire ;
 *   ⑥ l'option « Vitesse des combats » ;
 *   ⑦ le rapport : chaque chiffre contre une mesure indépendante, ses
 *      contre-épreuves, l'écran de victoire jusqu'au bout.
 *
 *   node bancs/navigateur/le_combat_fluide.js          (troupe 7)
 *   node bancs/navigateur/le_combat_fluide.js 21       (une autre troupe)
 *   Une capture de l'écran du rapport : bancs/navigateur/captures/rapport_de_combat.png
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

        // ── les outils dans la page : le jeu avance à la main, image par image
        await page.evaluate(function () {
            var B = window.__b = { plan: null, m: null };
            SceneManager.requestUpdate = function () {};            // plus d'horloge : c'est le banc qui fait avancer
            Game_Actor.prototype.isAutoBattle = function () { return true; };
            // le plan : au tour 1 l'Attaque, au tour 2 une technique à animation — les mêmes d'un combat à l'autre
            var _auto = Game_Actor.prototype.makeAutoBattleActions;
            Game_Actor.prototype.makeAutoBattleActions = function () {
                var p = B.plan && B.plan[this.actorId()];
                if (!p) return _auto.call(this);
                var id = p[Math.min(p.length - 1, Math.max(0, $gameTroop.turnCount()))];
                for (var i = 0; i < this.numActions(); i++) { var a = new Game_Action(this); a.setSkill(id); a.setTarget(0); this.setAction(i, a); }
                this.setActionState('waiting');
            };
            var _sa = BattleManager.startAction;
            BattleManager.startAction = function () {
                _sa.call(this);
                var it = this._action && this._action.item(), s = this._subject;
                if (B.m) { B.m.cur = { qui: s ? s.name() : '?', heros: !!(s && s.isActor()), acteur: s && s.isActor() ? s.actorId() : 0, id: it ? it.id : 0, nom: it ? it.name : '?', f: 0, cat: {} }; B.m.actions.push(B.m.cur); }
            };
            var _ea = BattleManager.endAction;
            BattleManager.endAction = function () { _ea.call(this); if (B.m) B.m.cur = null; };
            // une image de jeu (sans dessin) ; rend false si une image est encore en chargement
            B.image = function () {
                if (!ImageManager.isReady()) return false;
                var m = B.m, S = SceneManager._scene;
                if (m && S instanceof Scene_Battle && SceneManager.isCurrentSceneStarted()) {
                    var L = BattleManager._logWindow, ph = BattleManager._phase, c;
                    if (BattleManager._victoryPhase) c = 'victoire';
                    else if ($gameMessage.isBusy()) c = 'message';
                    else if (L && L._waitCount > 0) c = 'pause';
                    else if (L && L._waitMode) c = L._waitMode;
                    else c = 'le reste';
                    m.f++; m.cat[c] = (m.cat[c] || 0) + 1;
                    if (m.cur) { m.cur.f++; m.cur.cat[c] = (m.cur.cat[c] || 0) + 1; }
                }
                Graphics.frameCount++;
                SceneManager.updateInputData(); SceneManager.changeScene(); SceneManager.updateScene();
                return true;
            };
            B.avancer = function (n, jusqua) {
                for (var i = 0; i < n; i++) { if (jusqua && jusqua()) return true; if (!B.image()) return false; }
                return !!(jusqua && jusqua());
            };
            B.combat = function (troupe) {
                BattleManager.setup(troupe, false, false); SceneManager.push(Scene_Battle);
                B.m = { f: 0, cat: {}, actions: [], cur: null };
            };
            // passer de la saisie au tour, comme si le joueur avait tout choisi : les fenêtres fermées d'abord
            B.lancerTour = function () {
                var S = SceneManager._scene;
                if (BattleManager._phase !== 'input') return;
                $gameParty.battleMembers().forEach(function (a) { if (a.actorId() !== 6) a.makeAutoBattleActions(); });
                [S._actorCommandWindow, S._partyCommandWindow, S._skillWindow, S._itemWindow, S._actorWindow, S._enemyWindow].forEach(function (w) { if (w) w.deactivate(); });
                S.endCommandSelection(); BattleManager.clearActor();
                BattleManager.startTurn();
            };
            B.enCombat = function () { var s = SceneManager._scene; return s instanceof Scene_Battle && SceneManager.isCurrentSceneStarted() && !!BattleManager._logWindow; };
            // des ennemis qui tiennent : beaucoup de PV, pour que les deux combats jouent les mêmes actions
            B.solides = function () { $gameTroop.members().forEach(function (e) { e.addParam(0, 50000000); e.setHp(e.mhp); }); };
        });
        async function jusqua(cond, max, arg) {
            for (var i = 0; i < (max || 400); i++) {
                var fini = await page.evaluate(function (a) { var f = new Function('a', 'return (' + a.c + ')(a.arg);'); return window.__b.avancer(120, function () { return f(a); }); }, { c: cond.toString(), arg: arg });
                if (fini) return true;
                await page.waitForTimeout(2);
            }
            return false;
        }
        async function unCombat(eteint, tours) {
            await page.evaluate(function (a) { CombatFluide._eteint = a.eteint; CombatFluide._force = 0; window.__b.combat(a.t); }, { eteint: eteint, t: TROUPE });
            await jusqua(function () { return window.__b.enCombat(); }, 200);
            await page.evaluate(function () { window.__b.solides(); });
            var fini = await jusqua(function (a) { return $gameTroop.turnCount() > a || !(SceneManager._scene instanceof Scene_Battle) || BattleManager._victoryPhase; }, 600, tours);
            var m = await page.evaluate(function () { return window.__b.m; });
            m.fini = fini;
            // sortir du combat
            await page.evaluate(function () { window.__b.m = null; BattleManager._phase = 'aborting'; $gameParty.members().forEach(function (a) { a.recoverAll(); a.clearActions(); }); SceneManager.pop(); });
            await jusqua(function () { return SceneManager._scene instanceof Scene_Map && SceneManager.isCurrentSceneStarted(); }, 200);
            return m;
        }

        console.log('═'.repeat(74));
        console.log('  LE COMBAT FLUIDE ET SON RAPPORT — troupe ' + TROUPE);
        console.log('═'.repeat(74));

        // le plan : l'Attaque, puis la première technique de dégâts à animation que chacun peut lancer
        var plan = await page.evaluate(function () {
            var p = {};
            [1, 2, 3, 4].forEach(function (id) {
                var a = $gameActors.actor(id), choix = 0;
                a.skills().some(function (s) {
                    if (s.animationId > 0 && s.scope === 1 && s.damage.type === 1 && a.canUse(s) && s.id !== a.attackSkillId() && !/<(unison|Combo|Telegraphe|Instantan)/i.test(s.note)) { choix = s.id; return true; }
                    return false;
                });
                p[id] = [a.attackSkillId(), choix || a.attackSkillId()];
            });
            window.__b.plan = p;
            var noms = {}; Object.keys(p).forEach(function (k) { noms[$gameActors.actor(+k).name()] = p[k].map(function (i) { return $dataSkills[i].name; }); });
            return noms;
        });

        // ── ① la mesure ──────────────────────────────────────────────────────
        console.log('\n① La mesure — les mêmes actions, éteint puis allumé (deux tours)');
        var avant = await unCombat(true, 2);
        var apres = await unCombat(false, 2);
        function cle(a) { return a.acteur + ':' + a.id; }
        function parCle(m) { var o = {}; m.actions.forEach(function (a) { if (a.heros && a.acteur !== 6 && a.f > 0) { var k = cle(a); (o[k] = o[k] || []).push(a); } }); return o; }
        var A = parCle(avant), Z = parCle(apres), sa = 0, sz = 0, n = 0, causes = { avant: {}, apres: {} };
        Object.keys(A).forEach(function (k) {
            if (!Z[k]) return;
            var a = A[k][0], z = Z[k][0];
            sa += a.f; sz += z.f; n++;
            Object.keys(a.cat).forEach(function (c) { causes.avant[c] = (causes.avant[c] || 0) + a.cat[c]; });
            Object.keys(z.cat).forEach(function (c) { causes.apres[c] = (causes.apres[c] || 0) + z.cat[c]; });
            console.log('     ' + (a.qui + ' · ' + a.nom).padEnd(54) + String(a.f).padStart(4) + ' → ' + String(z.f).padStart(4) + ' images');
        });
        var tous = {}; Object.keys(causes.avant).concat(Object.keys(causes.apres)).forEach(function (c) { tous[c] = 1; });
        console.log('     ce que le jeu attend, par action (images) :');
        Object.keys(tous).sort(function (x, y) { return (causes.avant[y] || 0) - (causes.avant[x] || 0); }).forEach(function (c) {
            console.log('        ' + c.padEnd(12) + ((causes.avant[c] || 0) / Math.max(1, n)).toFixed(0).padStart(5) + ' → ' + ((causes.apres[c] || 0) / Math.max(1, n)).toFixed(0).padStart(5));
        });
        var gain = sa > 0 ? 100 * (1 - sz / sa) : 0;
        V('les deux combats ont joué leurs deux tours, les mêmes actions', avant.fini && apres.fini && n >= 4, n + ' actions comparées · ' + JSON.stringify(plan));
        V('une action dure moins longtemps (au moins 20 % de moins)', gain >= 20, (sa / Math.max(1, n)).toFixed(0) + ' → ' + (sz / Math.max(1, n)).toFixed(0) + ' images par action (' + (sa / Math.max(1, n) / 60).toFixed(2) + ' s → ' + (sz / Math.max(1, n) / 60).toFixed(2) + ' s), −' + gain.toFixed(0) + ' %');
        V('ce sont les pauses et l\'animation qui ont raccourci, pas les pas', (causes.apres.pause || 0) < (causes.avant.pause || 0) && (causes.apres.animation || 0) < (causes.avant.animation || 0) && Math.abs((causes.apres.movement || 0) - (causes.avant.movement || 0)) <= n * 4,
            'pause ' + (causes.avant.pause || 0) + ' → ' + (causes.apres.pause || 0) + ', animation ' + (causes.avant.animation || 0) + ' → ' + (causes.apres.animation || 0) + ', pas ' + (causes.avant.movement || 0) + ' → ' + (causes.apres.movement || 0));

        // ── un combat ouvert pour les contrôles suivants ──────────────────────
        await page.evaluate(function (t) { CombatFluide._eteint = false; window.__b.plan = null; window.__b.combat(t); }, TROUPE);
        await jusqua(function () { return window.__b.enCombat(); }, 200);
        await page.evaluate(function () { window.__b.solides(); Game_Actor.prototype.isAutoBattle = function () { return false; }; });
        await jusqua(function () { return BattleManager._phase === 'input' && !!BattleManager.actor(); }, 300);

        console.log('\n② Les temps morts');
        var r2 = await page.evaluate(function () {
            var L = BattleManager._logWindow, o = {};
            function ligne() { L._waitCount = 0; L.addText('une ligne que personne ne voit'); var v = L._waitCount; L._waitCount = 0; return v; }
            o.vueDeCote = $gameSystem.isSideView();
            o.allume = ligne(); o.pause = L.messageSpeed();
            CombatFluide._eteint = true; o.eteint = ligne(); o.pauseEteint = L.messageSpeed(); CombatFluide._eteint = false;
            // le geste du héros
            var s = BattleManager._subject, a = BattleManager._action;
            BattleManager._subject = $gameParty.battleMembers()[0]; BattleManager._action = new Game_Action(BattleManager._subject); BattleManager._action.setAttack();
            L._waitCount = 0; BattleManager.actionPerformAction(); o.geste = L._waitCount;
            CombatFluide._eteint = true; L._waitCount = 0; BattleManager.actionPerformAction(); o.gesteEteint = L._waitCount; CombatFluide._eteint = false;
            L._waitCount = 0; L._methods = []; BattleManager._subject = s; BattleManager._action = a;
            // un « wait: 30 » écrit dans une séquence d'action n'est pas touché
            BattleManager.actionWait(30); o.ecrit = L._waitCount; L._waitCount = 0;
            return o;
        });
        V('une ligne de journal invisible ne fait plus attendre', r2.vueDeCote && r2.allume === 0, r2.allume + ' image');
        V('la pause du journal : 8 images ; le geste du héros : 12', r2.pause === 8 && r2.geste === 12, r2.pause + ' et ' + r2.geste);
        V('contre-épreuve : éteint, 16 images la ligne, 16 la pause, 20 le geste (comme avant)', r2.eteint === 16 && r2.pauseEteint === 16 && r2.gesteEteint === 20, [r2.eteint, r2.pauseEteint, r2.gesteEteint].join(', '));
        V('un « wait: 30 » écrit dans une séquence d\'action reste à 30', r2.ecrit === 30, String(r2.ecrit));

        console.log('\n③ Les animations');
        var r3 = await page.evaluate(function () {
            function cadence() { var s = new Sprite_Animation(); s.setupRate(); return s._rate; }
            var o = { combat: cadence() };
            CombatFluide._eteint = true; o.eteint = cadence(); CombatFluide._eteint = false;
            var sc = SceneManager._scene; SceneManager._scene = new Scene_Map(); try { o.carte = cadence(); } catch (e) { o.carte = String(e.message); } SceneManager._scene = sc;
            o.yep = Yanfly.Param.AnimationRate;
            return o;
        });
        V('en combat, chaque dessin d\'une animation dure 3 images', r3.combat === 3, String(r3.combat));
        V('contre-épreuve : éteint, ou sur la carte, la cadence de YEP_CoreEngine', r3.eteint === r3.yep && r3.carte === r3.yep, 'éteint ' + r3.eteint + ', carte ' + r3.carte + ', YEP ' + r3.yep);

        console.log('\n④ Les images chargées d\'avance');
        var r4 = await page.evaluate(function () {
            var vues = [], _la = ImageManager.loadAnimation;
            ImageManager.loadAnimation = function (nom, teinte) { vues.push(nom); return _la.call(this, nom, teinte); };
            var o = { cas: [] };
            $gameParty.battleMembers().slice(0, 4).forEach(function (a) {
                var s = a.skills().filter(function (s) { return s.animationId > 0 && $dataAnimations[s.animationId] && $dataAnimations[s.animationId].animation1Name; })[0];
                if (!s) return;
                var an = $dataAnimations[s.animationId];
                vues.length = 0; var act = new Game_Action(a); act.setSkill(s.id);
                var allume = vues.indexOf(an.animation1Name) >= 0;
                CombatFluide._eteint = true; vues.length = 0; act.setSkill(s.id); var eteint = vues.length; CombatFluide._eteint = false;
                o.cas.push({ qui: a.name(), quoi: s.name, image: an.animation1Name, allume: allume, eteint: eteint });
            });
            // l'attaque normale : les animations de l'arme
            var v = $gameParty.battleMembers()[0]; vues.length = 0; var at = new Game_Action(v); at.setAttack();
            var arme = $dataAnimations[v.attackAnimationId1()];
            o.arme = { image: arme && arme.animation1Name, vue: !!arme && vues.indexOf(arme.animation1Name) >= 0 };
            // les ennemis : ce qu'ils savent faire, au début du combat
            var attendues = {}, manque = [];
            $gameTroop.members().forEach(function (e) { e.enemy().actions.forEach(function (ac) { CombatFluide.animationsDe($dataSkills[ac.skillId], e).forEach(function (id) { var n = $dataAnimations[id] && $dataAnimations[id].animation1Name; if (n) attendues[n] = 1; }); }); });
            vues.length = 0; var _sb = BattleManager.startBattle; // rejouer seulement notre crochet : on relit la liste
            $gameTroop.members().forEach(function (e) { e.enemy().actions.forEach(function (ac) { CombatFluide.precharger($dataSkills[ac.skillId], e); }); });
            Object.keys(attendues).forEach(function (n) { if (vues.indexOf(n) < 0) manque.push(n); });
            o.ennemis = { n: Object.keys(attendues).length, manque: manque };
            // une séquence d'action qui nomme une animation
            o.sequence = CombatFluide.animationsDe({ animationId: 0, note: '<target action>\nanimation 52: target\n</target action>' }, v);
            ImageManager.loadAnimation = _la;
            return o;
        });
        V('choisir une technique charge l\'image de son animation', r4.cas.length >= 3 && r4.cas.every(function (c) { return c.allume; }), r4.cas.map(function (c) { return c.qui + ' · ' + c.quoi + ' → ' + c.image; }).join(' ; '));
        V('l\'Attaque charge l\'animation de l\'arme tenue', r4.arme.vue, String(r4.arme.image));
        V('les animations des ennemis de la troupe aussi', r4.ennemis.n > 0 && !r4.ennemis.manque.length, r4.ennemis.n + ' images' + (r4.ennemis.manque.length ? ', manque ' + r4.ennemis.manque.join(', ') : ''));
        V('une animation nommée dans une séquence d\'action est vue', r4.sequence.length === 1 && r4.sequence[0] === 52, JSON.stringify(r4.sequence));
        V('contre-épreuve : éteint, rien n\'est chargé d\'avance', r4.cas.every(function (c) { return c.eteint === 0; }), r4.cas.map(function (c) { return c.eteint; }).join(', '));

        console.log('\n⑤ L\'avance rapide');
        var r5a = await page.evaluate(function () {
            var S = SceneManager._scene, o = {};
            Input._currentState.shift = true; Input.update();
            o.saisie = CombatFluide.facteur(S); o.phase = BattleManager._phase;
            return o;
        });
        V('pendant qu\'on choisit, Maj tenue ne change rien', r5a.phase === 'input' && r5a.saisie === 1, 'phase ' + r5a.phase + ', ×' + r5a.saisie);
        // le tour se joue, Maj tenue
        await page.evaluate(function () {
            Game_Actor.prototype.isAutoBattle = function () { return true; };
            window.__b.plan = {}; [1, 2, 3, 4].forEach(function (id) { window.__b.plan[id] = [$gameActors.actor(id).attackSkillId()]; });
            window.__b.m = { f: 0, cat: {}, actions: [], cur: null }; CombatFluide._enPlus = 0;
            Input._currentState.shift = true;
            window.__b.lancerTour();
        });
        await jusqua(function () { return window.__b.m.actions.filter(function (a) { return a.heros && a.acteur !== 6; }).length >= 3 && !window.__b.m.cur; }, 300);
        var r5 = await page.evaluate(function () {
            var m = window.__b.m, S = SceneManager._scene, o = { images: m.f, enPlus: CombatFluide._enPlus, actions: m.actions.filter(function (a) { return a.heros && a.acteur !== 6 && a.id === 1; }).map(function (a) { return a.f; }) };
            o.facteur = CombatFluide.peutAccelerer(S) ? CombatFluide.facteur(S) : 0;
            // un message à l'écran : on n'accélère pas
            $gameMessage.add('un message'); o.message = CombatFluide.facteur(S); $gameMessage.clear();
            // l'écran de victoire non plus
            BattleManager._victoryPhase = true; o.victoire = CombatFluide.facteur(S); BattleManager._victoryPhase = false;
            // « ok » n'est jamais une touche d'avance rapide
            Input._currentState.shift = false; Input._currentState.ok = true; Input.update();
            o.ok = CombatFluide.peutAccelerer(S) ? CombatFluide.facteur(S) : 1;
            Input._currentState.ok = false; Input.update();
            CombatFluide._eteint = true; Input._currentState.shift = true; Input.update(); o.eteint = CombatFluide.facteur(S); CombatFluide._eteint = false;
            Input._currentState.shift = false; Input.update();
            return o;
        });
        var moyRapide = r5.actions.reduce(function (a, b) { return a + b; }, 0) / Math.max(1, r5.actions.length);
        var attaqueNormale = apres.actions.filter(function (a) { return a.heros && a.acteur !== 6 && a.id === 1; });
        var moyNormale = attaqueNormale.reduce(function (a, b) { return a + b.f; }, 0) / Math.max(1, attaqueNormale.length);
        V('Maj tenue pendant les actions : trois mises à jour par image', r5.enPlus >= r5.images * 1.6 && r5.enPlus <= r5.images * 2, r5.enPlus + ' en plus sur ' + r5.images + ' images');
        V('une Attaque défile environ trois fois plus vite', r5.actions.length >= 3 && moyRapide <= moyNormale * 0.45, moyNormale.toFixed(0) + ' → ' + moyRapide.toFixed(0) + ' images à l\'écran');
        V('jamais pendant un message ni l\'écran de victoire ; « ok » tenue ne déclenche rien', r5.message === 1 && r5.victoire === 1 && r5.ok === 1, 'message ×' + r5.message + ', victoire ×' + r5.victoire + ', ok ×' + r5.ok);
        V('contre-épreuve : éteint, Maj ne fait rien', r5.eteint === 1, '×' + r5.eteint);

        console.log('\n⑥ L\'option « Vitesse des combats »');
        var r6 = await page.evaluate(function () {
            var o = {}, S = SceneManager._scene;
            o.defaut = ConfigManager.vitesseCombat;
            o.sauvee = 'vitesseCombat' in ConfigManager.makeData();
            var d = ConfigManager.makeData(); d.vitesseCombat = 9; ConfigManager.applyData(d); o.bornee = ConfigManager.vitesseCombat;
            var peut = CombatFluide.peutAccelerer; CombatFluide.peutAccelerer = function () { return true; };
            o.facteurs = [0, 1, 2, 3].map(function (v) { ConfigManager.vitesseCombat = v; return CombatFluide.facteur(S); });
            CombatFluide.peutAccelerer = peut; ConfigManager.vitesseCombat = 0;
            var w = new Window_Options(); o.ligne = w._list.some(function (c) { return c.symbol === 'vitesseCombat' && c.name === 'Vitesse des combats'; });
            var i = w.findSymbol('vitesseCombat'); o.texte = w.statusText(i); w.select(i); w.processOk(); o.apresOk = w.statusText(i); w.cursorLeft(false); o.retour = w.statusText(i);
            ConfigManager.vitesseCombat = 0;
            return o;
        });
        V('la ligne est dans les Options, « Normale » par défaut, gardée avec les réglages', r6.ligne && r6.defaut === 0 && r6.texte === 'Normale' && r6.sauvee, r6.texte);
        V('Normale ×1, Vive ×1,25, Rapide ×1,5, Très rapide ×2 ; une valeur folle est bornée', r6.facteurs.join(' ') === '1 1.25 1.5 2' && r6.bornee === 3 && r6.apresOk === 'Vive' && r6.retour === 'Normale', r6.facteurs.join(', ') + ' · OK → ' + r6.apresOk);

        // ── ⑦ le rapport ─────────────────────────────────────────────────────
        console.log('\n⑦ Le rapport du combat');
        // finir le tour en cours, proprement, puis des coups mesurés à la main
        await jusqua(function () { return BattleManager._phase === 'input' || BattleManager._phase === 'turnEnd' || $gameTroop.turnCount() >= 2; }, 400);
        var r7 = await page.evaluate(function () {
            var C = RapportDeCombat.chiffres(), o = {};
            var v = $gameActors.actor(1), ael = $gameActors.actor(4), e = $gameTroop.members()[0];
            o.heros = C.ordre.slice();
            // un coup : ce que l'ennemi perd est ce qui est compté
            function coup(sujet, cible, id) {
                var a = new Game_Action(sujet); a.setSkill(id);
                var pv = cible.hp, f = JSON.parse(JSON.stringify(C.heros[(sujet.isActor() ? sujet : cible).actorId()]));
                cible.clearResult(); a.apply(cible);
                return { perdu: pv - cible.hp, f: f, touche: cible.result().isHit(), affiche: cible.result().hpDamage };
            }
            var essais = 0, c;
            do { c = coup(v, e, v.attackSkillId()); essais++; } while ((!c.touche || c.perdu <= 0) && essais < 20);
            o.inflige = { perdu: c.perdu, compte: C.heros[1].inflige - c.f.inflige };
            o.meilleur = C.heros[1].coup.v >= c.perdu && !!C.heros[1].coup.nom;
            // un coup reçu
            essais = 0; ael.setHp(ael.mhp);
            // (l'Ogre de la troupe 7 a « mort 20 % » sur son attaque : une mort d'état n'est pas un chiffre — on prend un coup ordinaire)
            do { ael.removeState(1); ael.setHp(ael.mhp); c = coup(e, ael, e.attackSkillId()); essais++; } while ((!c.touche || c.perdu <= 0 || ael.isDead()) && essais < 40);
            ael.removeState(1); ael.setHp(ael.mhp); C.heros[4].tombe = 0;
            o.recu = { perdu: c.perdu, compte: C.heros[4].recu - c.f.recu, affiche: c.affiche };
            // un soin : seulement les PV vraiment rendus
            var soin = ael.skills().concat($dataSkills.filter(Boolean)).filter(function (s) { return s && s.damage.type === 3 && (s.scope === 7 || s.scope === 9 || s.scope === 11); })[0];
            v.setHp(v.mhp - 10); var sA = C.heros[4].soins;
            var as = new Game_Action(ael); as.setSkill(soin.id); v.clearResult(); as.apply(v);
            o.soin = { nom: soin.name, rendu: 10 - (v.mhp - v.hp), compte: C.heros[4].soins - sA };
            var sB = C.heros[4].soins; v.clearResult(); as.apply(v); o.soinPlein = C.heros[4].soins - sB;
            // le poison n'est à personne
            var avantRecu = C.heros[1].recu; v.gainHp(-50); o.poison = C.heros[1].recu - avantRecu; v.setHp(v.mhp);
            // tomber : compté une fois
            var k = $gameActors.actor(2); k.addState(1); k.addState(1); o.tombe = C.heros[2].tombe; k.removeState(1); k.setHp(k.mhp);
            // la brisure du bouclier
            var b0 = C.brises; e.addState(1005); e.addState(1005); o.brise = C.brises - b0; o.aBrise = e.isStateAffected(1005); e.removeState(1005);
            // hors combat, rien n'est compté
            return o;
        });
        V('les cinq héros au combat ont leur ligne (seiryu compris)', r7.heros.join(',') === '1,2,3,4,6', r7.heros.join(', '));
        V('dégâts infligés : exactement ce que l\'ennemi a perdu, et le meilleur coup retenu', r7.inflige.perdu > 0 && r7.inflige.perdu === r7.inflige.compte && r7.meilleur, r7.inflige.perdu + ' perdus, ' + r7.inflige.compte + ' comptés');
        V('dégâts reçus : exactement ce que le héros a perdu', r7.recu.perdu > 0 && r7.recu.perdu === r7.recu.compte, r7.recu.perdu + ' / ' + r7.recu.compte + ' (affiché ' + r7.recu.affiche + ')');
        V('un soin ne compte que les PV rendus ; sur des PV pleins, rien', r7.soin.compte === r7.soin.rendu && r7.soin.rendu > 0 && r7.soinPlein === 0, r7.soin.nom + ' : ' + r7.soin.compte + ' comptés pour ' + r7.soin.rendu + ' rendus, puis ' + r7.soinPlein);
        V('contre-épreuve : des PV perdus sans coup (poison) ne sont à personne', r7.poison === 0, String(r7.poison));
        V('tomber est compté une fois ; une brisure aussi', r7.tombe === 1 && (!r7.aBrise || r7.brise === 1), 'tombé ' + r7.tombe + ', brisure ' + r7.brise);

        // la victoire : les ennemis tombent sous un vrai coup, l'écran défile
        await page.evaluate(function () {
            Game_Actor.prototype.isAutoBattle = function () { return true; };
            window.__b.plan = {}; [1, 2, 3, 4].forEach(function (id) { window.__b.plan[id] = [$gameActors.actor(id).attackSkillId()]; });
            window.__b.m = null; window.__b.avantVictoire = JSON.parse(JSON.stringify(RapportDeCombat.chiffres().heros));
            $gameTroop.members().forEach(function (e) { e.setHp(1); });
            window.__b.lancerTour();
        });
        var vict = await jusqua(function () { if (!$gameTroop.isAllDead()) window.__b.lancerTour(); return !!BattleManager._victoryPhase; }, 600);
        // l'expérience passe, puis le rapport s'ouvre
        var ouvert = await jusqua(function () {
            var S = SceneManager._scene;
            if (S._victoryRapportWindow && S._victoryRapportWindow.isOpen()) { Input._currentState.ok = false; return true; }
            Input._currentState.ok = (Graphics.frameCount % 30) < 2 && !S._victoryRapportWindow;
            return false;
        }, 300);
        var r8 = await page.evaluate(function () {
            var S = SceneManager._scene, C = RapportDeCombat.chiffres(), o = {};
            o.etape = S._victoryStep; o.suite = (S._victorySteps || []).slice();
            o.titre = S._victoryTitleWindow && S._victoryTitleWindow._text !== undefined ? S._victoryTitleWindow._text : null;
            o.tours = C.tours; o.vaincus = C.vaincus; o.troupe = $gameTroop.members().length; o.fin = C.fin > 0;
            o.coup = C.coup; o.record = RapportDeCombat.record(); o.battu = C.recordBattu;
            o.total = 0; C.ordre.forEach(function (id) { o.total += C.heros[id].inflige; });
            o.tueurs = 0; C.ordre.forEach(function (id) { o.tueurs += C.heros[id].vaincus; });
            o.lignes = ['_fenetrePacte', '_fenetreColere', '_fenetreLecture', '_fenetrePhrase', '_fenetreSeiryu'].filter(function (k) { return S[k] && S[k].visible; });
            try { S._victoryRapportWindow.refresh(); o.dessin = true; } catch (e) { o.dessin = e.message; }
            // ce qui est écrit sur la fenêtre
            var ecrit = [], w = S._victoryRapportWindow, _dt = w.drawText;
            w.drawText = function (t) { ecrit.push(String(t)); _dt.apply(this, arguments); };
            w.refresh(); w.drawText = _dt; o.ecrit = ecrit;
            return o;
        });
        V('la victoire arrive, et le rapport s\'ouvre entre l\'expérience et le butin', vict && ouvert && r8.etape === 'RAPPORT' && r8.suite.join(',') === 'DROPS', 'étape ' + r8.etape + ', ensuite ' + r8.suite.join(', '));
        V('tous les ennemis sont comptés vaincus ; à un héros quand c\'est son coup (pas un souffle de réaction)', r8.vaincus === r8.troupe && r8.tueurs >= 1 && r8.tueurs <= r8.troupe, r8.vaincus + ' / ' + r8.troupe + ', attribués ' + r8.tueurs);
        V('la fenêtre se dessine : tours, durée, les cinq noms, le plus gros coup', r8.dessin === true && ['Tours', 'Durée', 'Ennemis vaincus', 'Dégâts infligés', 'Vesper', 'Korrah', 'ludwing', 'Aël', 'seiryu'].every(function (m) { return r8.ecrit.indexOf(m) >= 0; }) && r8.ecrit.some(function (t) { return /^Plus gros coup : /.test(t); }), r8.ecrit.filter(function (t) { return /Plus gros coup|Réactions|réaction|tombé|Tombés/.test(t); }).join(' | '));
        V('les lignes du Pacte, de la Colère, du livre et de seiryu ne s\'écrivent plus sur l\'écran de victoire', r8.lignes.length === 0, r8.lignes.join(', '));
        V('le plus gros coup devient le record de la partie (le premier ne « bat » rien)', r8.coup.v > 0 && r8.record.v === r8.coup.v && r8.battu === false, r8.coup.nom + ' · ' + r8.coup.v);
        // la capture, pour JOKO
        try {
            await page.evaluate(function () { for (var i = 0; i < 3; i++) { Graphics._skipCount = 0; Graphics.render(SceneManager._scene); } });
            await page.waitForTimeout(300);
            var dossier = path.join(__dirname, 'captures'); if (!fs.existsSync(dossier)) fs.mkdirSync(dossier);
            await page.screenshot({ path: path.join(dossier, 'rapport_de_combat.png') });
        } catch (e) { console.log('     (capture impossible : ' + e.message.slice(0, 80) + ')'); }
        // OK : le rapport se ferme, le butin, la fin du combat
        var sorti = await jusqua(function () {
            Input._currentState.ok = (Graphics.frameCount % 30) < 2;
            return SceneManager._scene instanceof Scene_Map && SceneManager.isCurrentSceneStarted();
        }, 600);
        await page.evaluate(function () { Input._currentState.ok = false; });
        V('OK ferme le rapport, le butin passe, on revient sur la carte', sorti);

        // un deuxième combat : le record, RAPPORT off, hors combat
        var r9 = await page.evaluate(function (t) {
            var o = {}, rec = RapportDeCombat.record().v;
            BattleManager.setup(t, false, false);
            var C = RapportDeCombat.chiffres();
            o.neuf = C.coup.v === 0 && C.vaincus === 0 && C.ordre.length === 5;
            // un coup plus gros que le record
            $gameParty._inBattle = true;
            var v = $gameActors.actor(1), e = $gameTroop.members()[0], a = new Game_Action(v); a.setAttack();
            a.executeHpDamage(e, rec + 1000);
            RapportDeCombat.clore(); o.battu = C.recordBattu; o.record = RapportDeCombat.record().v === rec + 1000;
            o.voulu = RapportDeCombat.voulu();
            $gameSystem._rapportCoupe = false; var it = new Game_Interpreter(); it._params = ['RAPPORT off']; it.pluginCommand('RAPPORT', ['off']); o.coupe = RapportDeCombat.voulu();
            it._params = ['RAPPORT on']; it.pluginCommand('RAPPORT', ['on']); o.rendu = RapportDeCombat.voulu();
            // hors combat (un objet de soin au menu) : rien n'est compté
            $gameParty._inBattle = false; var s0 = JSON.stringify(C.heros);
            a.executeHpDamage(e, 500); o.horsCombat = JSON.stringify(C.heros) === s0;
            return o;
        }, TROUPE);
        V('un nouveau combat repart de zéro', r9.neuf);
        V('un coup plus gros que le record : « ★ Record battu », et le record monte', r9.battu === true && r9.record);
        V('RAPPORT off le retire de l\'écran de victoire, RAPPORT on le rend', r9.voulu === true && r9.coupe === false && r9.rendu === true);
        V('contre-épreuve : hors combat, rien n\'est compté', r9.horsCombat);

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
