/*
 * BANC NAVIGATEUR — LE REGISTRE (ludwing, LeRegistre.js)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-19 : « Piste 1, le Registre : les âmes deviennent sa
 * monnaie, il les gagne en prenant (morts, drains) et les dépense pour tout
 * (invocations, copies choisies, mises, Royaume), un seul Domaine où tout est
 * gratuit. » — « Oui, écris tout comme listé ».
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. le compteur ✦ Âmes suit la variable 15 ;
 *   2. les gains : une mort (+1), un Marqué qui tombe (+2 de plus), ses drains
 *      (+1, +1 sur un Marqué) — pas ses coups qui ne drainent pas ;
 *   3. les invocations sont dans son menu, et coûtent leurs âmes ;
 *   4. les copies : la branche n'apparaît qu'avec des copies, elles n'y sont
 *      que là, coûtent 2 âmes et rien d'autre, frappent « à sa mesure » (50 % d'Ombre — Nuit, élément de la copie), se consomment ;
 *      un Marqué se laisse copier dès la première fois, pas un autre ;
 *   5. les mises : la Roulette (seuil +1 par âme) et l'Arme d'Ombre (un tirage de
 *      plus par âme, le meilleur gardé) — sans âme, rien ne change ;
 *   6. le Domaine (198) : copies gratuites et gardées, mises offertes ; et
 *      LouCopySystem réglé sur le même état ;
 *   7. un vrai combat : les âmes montent, aucune erreur.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/le_registre.js
 */

var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var err = [];
    page.on('pageerror', function (e) { err.push(e.message.split('\n')[0]); });
    page.on('console', function (m) { if (m.type() === 'error' && !/Failed to load|net::ERR/.test(m.text())) { err.push('CONSOLE ' + m.text().slice(0, 150)); } });
    var ok = 0, ko = 0;
    var v = function (t, c, d) { if (c) { ok++; console.log('   OK  ' + t + (d ? '  — ' + d : '')); } else { ko++; console.log('   KO  ' + t + (d ? '  — ' + d : '')); } };

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen(); }, null, { timeout: 180000 });
    await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);

    console.log('=== LE REGISTRE ===\n');

    async function ouvrirCombat() {
        await page.evaluate(function () {
            $gameParty.members().forEach(function (a) { a.recoverAll(); });
            BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(2500);
    }
    await ouvrirCombat();
    await page.evaluate(function () {
        var SC = SceneManager._scene;
        window.__vraieMaj = SC.update;
        SC.update = function () { };
        window.__l = function () { return $gameActors.actor(3); };
        window.__e = function () { return $gameTroop.members()[0]; };
        window.__ames = function (n) { if (n !== undefined) { $gameVariables.setValue(15, n); } return $gameVariables.value(15); };
        window.__solide = function (e) { e.addParam(0, 9999999); e.recoverAll(); };
        window.__agir = function (sujet, idSkill, cible) {
            var act, r;
            for (var i = 0; i < 30; i++) {
                act = new Game_Action(sujet); act.setSkill(idSkill);
                cible.clearResult(); act.apply(cible); r = cible.result();
                if (r.isHit()) { break; }
            }
            return { act: act, r: r };
        };
        // une mort donnée par un héros (comme le moteur : executeDamage)
        window.__tue = function (heros, e) {
            var act = new Game_Action(heros); act.setAttack();
            e.clearResult(); act.executeDamage(e, e.hp + 10);
        };
        window.__releve = function (e) { e.recoverAll(); e.clearResult(); };
        $gameParty.members().forEach(function (a) { a.setMp(a.mmp); a.setTp(100); });
        // une technique ennemie qui frappe, pour les copies
        window.__techEnnemie = (function () {
            var vues = {};
            $dataEnemies.forEach(function (en) { if (en) { en.actions.forEach(function (a) { vues[a.skillId] = true; }); } });
            return $dataSkills.filter(function (s) {
                return s && vues[s.id] && s.id > 2 && s.damage.type === 1 && s.scope === 1 && !$gameActors.actor(3).isLearnedSkill(s.id);
            }).map(function (s) { return s.id; });
        })();
    });

    // ── 1 · le compteur ─────────────────────────────────────────────────
    console.log('1) Le compteur');
    var c = await page.evaluate(function () {
        var l = __l(), r = { reglages: Registre.reglages() };
        __ames(10); r.a = { etat: l.isStateAffected(247), n: l.getStateCounter ? l.getStateCounter(247) : null };
        __ames(4); r.b = { n: l.getStateCounter ? l.getStateCounter(247) : null };
        r.autres = [1, 2, 4].some(function (id) { return $gameActors.actor(id).isStateAffected(247); });
        return r;
    });
    v('ludwing porte ✦ Âmes, avec le nombre', c.a.etat && String(c.a.n) === '10', 'réglages ' + JSON.stringify(c.reglages).slice(0, 110) + '…');
    v('le nombre suit la variable 15', String(c.b.n) === '4', String(c.b.n));
    v('contre-épreuve : personne d\'autre ne le porte', !c.autres);

    // ── 2 · gagner ──────────────────────────────────────────────────────
    console.log('\n2) Gagner');
    var g = await page.evaluate(function () {
        var l = __l(), ves = $gameActors.actor(1), e = __e(), r = {};
        __ames(0); __releve(e); e.removeState(213);
        __tue(ves, e); r.mort = __ames(); __releve(e);
        __ames(0); e.addState(213); r.marqueAvant = e.isStateAffected(213);
        __tue(ves, e); r.mortMarque = __ames(); __releve(e);
        __solide(e); e.removeState(213);
        __ames(0); __agir(l, 466, e); r.drain = __ames();
        __ames(0); e.addState(213); __agir(l, 466, e); r.drainMarque = __ames();
        __ames(0); e.removeState(213); __agir(l, 1221, e); r.pasDrain = __ames();      // Ombre — Voile : dégâts, pas un drain
        __ames(0); e.addState(213); __agir(l, 1221, e); r.pasDrainMarque = __ames();
        e.removeState(213); __releve(e);
        return r;
    });
    v('une mort ordinaire : +1 (PorteurDAmes, inchangé)', g.mort === 1, String(g.mort));
    v('un Marqué qui tombe : +2 de plus', g.marqueAvant && g.mortMarque === 3, String(g.mortMarque));
    v('son drain qui touche : +1', g.drain === 1, String(g.drain));
    v('son drain sur un Marqué : +2', g.drainMarque === 2, String(g.drainMarque));
    v('contre-épreuve : un coup qui ne draine pas ne rapporte rien', g.pasDrain === 0 && g.pasDrainMarque === 0, g.pasDrain + ' / ' + g.pasDrainMarque);

    // ── 3 · les invocations ─────────────────────────────────────────────
    console.log('\n3) Les invocations');
    var inv = await page.evaluate(function () {
        var l = __l(), r = {};
        r.branche = l.addedSkillTypes().indexOf(8) >= 0;
        __ames(2); r.a2 = { jugement: l.canUse($dataSkills[124]), rappel: l.canUse($dataSkills[125]) };
        __ames(3); r.a3 = l.canUse($dataSkills[124]);
        l.paySkillCost($dataSkills[124]); r.apres = __ames();
        return r;
    });
    v('la branche « invocation » est dans son menu, dès le début', inv.branche);
    v('2 âmes : Rappel des Âmes oui, Jugement des Défunts non (3)', inv.a2.rappel && !inv.a2.jugement, JSON.stringify(inv.a2));
    v('3 âmes : Jugement possible, et il les prend', inv.a3 && inv.apres === 0, 'reste ' + inv.apres);

    // ── 4 · les copies ──────────────────────────────────────────────────
    console.log('\n4) Les copies');
    var cp = await page.evaluate(function () {
        var l = __l(), e = __e(), r = {};
        l._louCopiedSkills = [];
        r.tech = __techEnnemie.length;
        var id = __techEnnemie[0], sk = $dataSkills[id];
        r.nom = sk ? sk.name : null;
        r.sansCopie = l.addedSkillTypes().indexOf(26) >= 0;
        Registre.copier(id);
        r.avecCopie = l.addedSkillTypes().indexOf(26) >= 0;
        r.dansSkills = l.skills().indexOf(sk) >= 0;
        var w = new Window_SkillList(0, 0, 400, 300); w.setActor(l);
        w.setStypeId(26); r.dansBranche = w._data.indexOf(sk) >= 0;
        w.setStypeId(sk.stypeId); r.ailleurs = w._data.indexOf(sk) >= 0;
        r.couts = { pm: l.skillMpCost(sk), pt: l.skillTpCost(sk) };
        __ames(1); r.a1 = l.canUse(sk);
        __ames(2); r.a2 = l.canUse(sk);
        // la puissance « à sa mesure » : 50 % d'Ombre — Nuit (sans élément) × l'élément de la copie
        // (le poids des âmes, le rework L1, multiplie tout ce qu'il frappe selon ses âmes : on le met à part ici)
        Registre._sansPoids = true;
        var ref = $dataSkills[1224], sauve = [sk.damage.variance, sk.damage.critical, ref.damage.variance, ref.damage.critical];
        sk.damage.variance = 0; sk.damage.critical = false; ref.damage.variance = 0; ref.damage.critical = false;
        __solide(e);
        var a0 = new Game_Action(l); a0.setSkill(id); var plein = a0.makeDamageValue(e, false);
        var rn = new Game_Action(l); rn.setSkill(1224); rn.calcElementRate = function () { return 1; };
        // la copie est une technique du don (type 26) : Nuit, sa mesure, se compte sans le prix de l'affinité (LesTroisArts)
        LesTroisArts._sansAffinites = true; var neutre = rn.makeDamageValue(e, false); LesTroisArts._sansAffinites = false;
        l.paySkillCost(sk);
        r.apres = { ames: __ames(), gardee: l._louCopiedSkills.indexOf(id) >= 0, collee: l._registreCopie === id, affaiblie: !!l._louCopyWeaken };
        var a1 = new Game_Action(l); a1.setSkill(id);
        r.mesure = { valeur: a1.makeDamageValue(e, false), attendu: Math.round(neutre * 0.5 * a1.calcElementRate(e)), sansRegle: plein };
        // la copie au hasard de « copie d'Âme » (65) garde la règle de LouCopySystem : ses stats, à moitié
        l._registreCopie = 0; l._louCopyWeaken = true;
        var a2 = new Game_Action(l); a2.setSkill(id); r.hasard = { valeur: a2.makeDamageValue(e, false), attendu: Math.floor(plein * 0.5) };
        l._louCopyWeaken = false;
        Registre._sansPoids = false;
        sk.damage.variance = sauve[0]; sk.damage.critical = sauve[1]; ref.damage.variance = sauve[2]; ref.damage.critical = sauve[3];
        r.brancheVide = l.addedSkillTypes().indexOf(26) >= 0;
        // un Marqué se laisse copier dès sa première technique — un autre non
        var id2 = __techEnnemie[1] || __techEnnemie[0];
        var jouer = function (ennemi, idSkill) {
            ennemi.makeActions(); ennemi.action(0).setSkill(idSkill); ennemi.action(0).setTarget(0);
            BattleManager._subject = ennemi; BattleManager._phase = 'turn';
            try { BattleManager.startAction(); } catch (x) { r.erreurAction = String(x.message).slice(0, 120); }
            BattleManager._subject = null; BattleManager._action = null; BattleManager._targets = [];
            if (BattleManager._logWindow) { BattleManager._logWindow.clear(); }
        };
        l._louCopiedSkills = [];
        e.removeState(213); jouer(e, id2); r.nonMarque = l._louCopiedSkills.indexOf(id2) >= 0;
        var e2 = $gameTroop.members()[1] || e; __solide(e2);
        l._louCopiedSkills = []; e2.addState(213); jouer(e2, id); r.marque = l._louCopiedSkills.indexOf(id) >= 0;
        l._louCopiedSkills = []; e2.addState(213); jouer(e2, 1); r.attaque = l._louCopiedSkills.length;
        e2.removeState(213);
        return r;
    });
    v('il existe des techniques ennemies à copier', cp.tech > 0, cp.tech + ' · essai sur « ' + cp.nom + ' »');
    v('sans copie : pas de branche « Copies »', !cp.sansCopie);
    v('avec une copie : la branche apparaît, la copie y est', cp.avecCopie && cp.dansSkills && cp.dansBranche);
    v('contre-épreuve : la copie n\'est pas dans sa branche d\'origine', !cp.ailleurs);
    v('elle ne coûte ni PM ni PT', cp.couts.pm === 0 && cp.couts.pt === 0, JSON.stringify(cp.couts));
    v('1 âme : impossible ; 2 : possible', !cp.a1 && cp.a2);
    v('collée : 2 âmes, copie consommée', cp.apres.ames === 0 && !cp.apres.gardee && cp.apres.collee && !cp.apres.affaiblie, JSON.stringify(cp.apres));
    v('« à sa mesure » : 50 % d\'Ombre — Nuit, avec l\'élément de la copie', Math.abs(cp.mesure.valeur - cp.mesure.attendu) <= 1 && cp.mesure.valeur > cp.mesure.sansRegle,
        cp.mesure.valeur + ' (attendu ' + cp.mesure.attendu + ' ; ' + cp.mesure.sansRegle + ' avec ses stats à 100 %)');
    v('contre-épreuve : « copie d\'Âme », au hasard, reste à moitié de ses stats', cp.hasard.valeur === cp.hasard.attendu, cp.hasard.valeur + ' / ' + cp.hasard.attendu);
    v('plus de copie : la branche s\'en va', !cp.brancheVide);
    v('un ennemi Marqué : copié dès sa première technique', cp.marque, cp.erreurAction || '');
    v('contre-épreuve : un ennemi non Marqué, première fois — rien', !cp.nonMarque);
    v('contre-épreuve : on ne copie pas l\'Attaque', cp.attaque === 0);

    // ── 5 · les mises ───────────────────────────────────────────────────
    console.log('\n5) Les mises');
    var mi = await page.evaluate(function () {
        var l = __l(), r = {};
        // jouer les premières commandes d'un événement commun, comme le moteur
        // jusqu'à la commande qui écrit la variable `v` (incluse) — l'Arme d'Ombre retire
        // d'abord les anciennes armes, puis tire au sort
        var debut = function (ev, v) {
            var it = new Game_Interpreter(), l2 = $dataCommonEvents[ev].list; it.setup(l2);
            var fin = l2.findIndex(function (c) { return c.code === 122 && c.parameters[0] === v; });
            while (it._index <= fin) { it.executeCommand(); }
        };
        // Roulette : la mise s'ajoute au seuil (1 au départ)
        __ames(10); l.paySkillCost($dataSkills[14]); r.ames = __ames(); r.mise = JSON.stringify($gameTemp._registreMise);
        debut(1, 5); r.seuil = $gameVariables.value(5); r.vide = $gameTemp._registreMise === null;
        __ames(3); l.paySkillCost($dataSkills[14]); r.ames3 = __ames(); debut(1, 5); r.seuil3 = $gameVariables.value(5);
        __ames(0); l.paySkillCost($dataSkills[14]); debut(1, 5); r.seuil0 = $gameVariables.value(5);
        // Arme d'Ombre : des tirages imposés — 100, puis 900, 500, 960 : il garde 960
        var vrai = Math.randomInt, suite = [99, 899, 499, 959], k = 0;
        Math.randomInt = function (m) { return k < suite.length ? suite[k++] : vrai(m); };
        __ames(10); l.paySkillCost($dataSkills[111]); r.amesArme = __ames();
        debut(22, 41); r.tirage = $gameVariables.value(41);
        Math.randomInt = vrai;
        k = 0; Math.randomInt = function (m) { return k < suite.length ? suite[k++] : vrai(m); };
        __ames(0); l.paySkillCost($dataSkills[111]); debut(22, 41); r.tirage0 = $gameVariables.value(41);
        Math.randomInt = vrai;
        // contre-épreuve : quelqu'un d'autre qui lance la Roulette ne mise rien
        __ames(10); $gameActors.actor(1).paySkillCost($dataSkills[14]); r.autre = __ames() + ' ' + JSON.stringify($gameTemp._registreMise);
        $gameTemp._registreMise = null;
        return r;
    });
    v('Roulette, 10 âmes : il en mise 5', mi.ames === 5, mi.mise);
    v('… et le seuil passe de 1 à 6 (6 chances sur 30)', mi.seuil === 6 && mi.vide, String(mi.seuil));
    v('3 âmes : il mise les 3, seuil 4', mi.ames3 === 0 && mi.seuil3 === 4, mi.ames3 + ' · ' + mi.seuil3);
    v('sans âme : seuil 1, comme avant', mi.seuil0 === 1);
    v('Arme d\'Ombre, 10 âmes : 3 misées, le meilleur de 4 tirages gardé', mi.amesArme === 7 && mi.tirage === 960, mi.amesArme + ' âmes · tirage ' + mi.tirage);
    v('sans âme : le premier tirage, comme avant', mi.tirage0 === 100, String(mi.tirage0));
    v('contre-épreuve : Vesper ne mise rien', /^10 null$/.test(mi.autre), mi.autre);

    // ── 6 · le Domaine ──────────────────────────────────────────────────
    console.log('\n6) Le Domaine');
    var dm = await page.evaluate(function () {
        var l = __l(), r = {};
        r.lou = PluginManager.parameters('LouCopySystem').domainStateId;
        l.addState(198); r.dans = l.isStateAffected(198);
        var id = __techEnnemie[0], sk = $dataSkills[id];
        l._louCopiedSkills = [id]; __ames(0);
        r.copie = l.canUse(sk); l.paySkillCost(sk); r.copieApres = { ames: __ames(), gardee: l._louCopiedSkills.indexOf(id) >= 0 };
        l._louCopyWeaken = false; l._registreCopie = 0;
        l.paySkillCost($dataSkills[14]); r.mise = JSON.stringify($gameTemp._registreMise) + ' · ' + __ames();
        $gameTemp._registreMise = null;
        __ames(0); r.invocation = l.canUse($dataSkills[124]);
        l.removeState(198); l._louCopiedSkills = [];
        return r;
    });
    v('LouCopySystem est réglé sur le même Domaine (198)', dm.lou === '198', dm.lou);
    v('dans le Domaine : une copie sans âme, gratuite et gardée', dm.dans && dm.copie && dm.copieApres.ames === 0 && dm.copieApres.gardee, JSON.stringify(dm.copieApres));
    v('dans le Domaine : la mise maximale, offerte', /"n":5/.test(dm.mise) && / 0$/.test(dm.mise), dm.mise);
    v('dans le Domaine : une invocation sans âme (RoyaumeImperial)', dm.invocation);

    // ── 7 · un vrai combat ──────────────────────────────────────────────
    console.log('\n7) Un vrai combat, laissé tourner');
    await page.evaluate(function () {
        SceneManager._scene.update = window.__vraieMaj;
        BattleManager.endBattle(2); $gameParty.onBattleEnd(); $gameTroop.onBattleEnd();
        SceneManager.goto(Scene_Map);
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(800);
    await page.evaluate(function () {
        Game_Actor.prototype.isAutoBattle = function () { return true; };
        $gameVariables.setValue(15, 0);
    });
    await ouvrirCombat();
    await page.evaluate(function () { window.__debutCompteur = $gameActors.actor(3).isStateAffected(247); });
    try {
        await page.waitForFunction(function () { return !$gameParty.inBattle() || $gameTroop.isAllDead(); }, null, { timeout: 420000, polling: 500 });
    } catch (e) { }
    await page.waitForTimeout(1500);
    var reel = await page.evaluate(function () { return { ames: $gameVariables.value(15), morts: $gameTroop.deadMembers().length, tour: $gameTroop.turnCount() }; });
    v('le combat se termine', reel.morts >= 1, reel.morts + ' ennemi(s) tombé(s) en ' + reel.tour + ' tour(s)');
    v('les âmes sont montées', reel.ames >= reel.morts, reel.ames + ' âme(s)');

    console.log('');
    v('aucune erreur JavaScript', err.length === 0, err.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(72) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(72));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
