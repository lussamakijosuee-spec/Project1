/*
 * BANC NAVIGATEUR — L'ÉCRIT (LEcrit.js, 2026-10-22)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-22 : « Spirituelle c'est plus comme les symboles le fait de
 * écrire ou préparer des écrits le système de Full Metal Alchemist » ; « B pour
 * l'écrit » (c'est toi qui l'actives) ; « Oui la volonté, l'âme, la détermination ».
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. la base : « ᛟ Activer » (1309, instantanée, apprise au niveau 1 par les
 *      quatre classes), l'état 257 « ᛟ Écrit » qui ne s'use pas ;
 *   2. ce qui s'écrit : les écrits des capacités — pas les dons (type âme,
 *      invocations), pas une attaque à plusieurs, pas la Parole lue d'Aël, pas
 *      un mouvement, pas une Parole, pas un ennemi ;
 *   3. écrire : rien ne part, l'écrit est gardé, montré (état, chiffre, annonce) ;
 *   4. Activer : grisé sans écrit ; tous les écrits partent d'un coup, ×1,25,
 *      dans l'ordre — un soin écrit sur les alliés ne soigne qu'à ce moment ;
 *   5. 3 écrits en attente au plus (les dons restent possibles) ; un ennemi tombé
 *      emporte ses écrits ;
 *   6. la volonté : sur l'écrit activé et sur les dons ; pas sur un mouvement ;
 *   7. un vrai combat laissé tourner : ludwing écrit, écrit, active.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/l_ecrit.js
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

    async function ouvrirCombat() {
        await page.evaluate(function () {
            $gameParty.members().forEach(function (a) { a.recoverAll(); });
            BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(2500);
    }
    async function fermerCombat() {
        await page.evaluate(function () {
            delete SceneManager._scene.update;
            BattleManager.endBattle(2); $gameParty.onBattleEnd(); $gameTroop.onBattleEnd();
            SceneManager.goto(Scene_Map);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(800);
    }

    console.log('=== L\'ÉCRIT ===\n');
    await ouvrirCombat();
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var L = LEcrit, ETAT = 257, ACT = 1309, out = {};
        var ves = $gameActors.actor(1), kor = $gameActors.actor(2), lud = $gameActors.actor(3), ael = $gameActors.actor(4);
        var e = $gameTroop.members()[0], e2 = $gameTroop.members()[1];
        [e, e2].forEach(function (x) { x.addParam(0, 9999999); x.recoverAll(); });
        Math.random = function () { return 0.5; };
        function act(h, id, cible) {
            var a = new Game_Action(h); a.setSkill(id);
            if (cible) { a.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible)); }
            return a;
        }
        function lancer(h, id, cible) { var a = act(h, id, cible); cible.clearResult(); a.apply(cible); return a; }
        function annonces(b) { return (b._ctAnnonces || []).map(function (x) { return x.texte; }); }
        function nettoyer() {
            $gameParty.members().forEach(function (a) { a._ecrits = []; a.recoverAll(); a._ctAnnonces = []; });
            [e, e2].forEach(function (x) { x.eraseState(ETAT); x.removeStateCounter(ETAT); x.recoverAll(); x._ctAnnonces = []; });
        }

        // 1 · la base
        var sk = $dataSkills[ACT];
        out.base = { nom: sk && sk.name, instant: CombatTactique.estInstantane(sk), type: sk && sk.stypeId,
                     classes: [1, 2, 3, 4].map(function (c) { return $dataClasses[c].learnings.some(function (l) { return l.skillId === ACT && l.level === 1; }); }),
                     appris: $gameParty.members().filter(function (a) { return a.actorId() !== 6; }).map(function (a) { return a.isLearnedSkill(ACT); }),
                     etat: { nom: $dataStates[ETAT].name, fin: $dataStates[ETAT].autoRemovalTiming } };

        // 2 · ce qui s'écrit
        var syllabe = L.doitEcrire(act(ael, 820, e));
        ael._paroleLue = 820;
        out.qui = { trait: L.doitEcrire(act(lud, 158, e)), barriere: L.doitEcrire(act(kor, 152, kor)), syllabe: syllabe,
                    ame: L.doitEcrire(act(lud, 466, e)), invocation: L.doitEcrire(act(lud, 124, e)), trio: L.doitEcrire(act(ves, 417, e)),
                    lue: L.doitEcrire(act(ael, 820, e)), mouvement: L.doitEcrire(act(kor, 1106, e)), parole: L.doitEcrire(act(ael, 1216, e)),
                    ennemi: L.doitEcrire((function () { var a = new Game_Action(e); a.setSkill(158); return a; })()) };
        ael._paroleLue = 0;

        // 3 · écrire
        nettoyer();
        var hp0 = e.hp;
        lancer(lud, 158, e);
        out.ecrire = { perdu: hp0 - e.hp, ecrits: L.ecrits(lud).length, etat: e.isStateAffected(ETAT), chiffre: e.getStateCounter(ETAT),
                       annonce: annonces(e), touche: e.result().isHit() && !e.result().missed };

        // 4 · activer
        nettoyer();
        out.grise = lud.canUse(sk);
        var ref = act(lud, 158, e).makeDamageValue(e, false);
        lancer(lud, 158, e); lancer(lud, 158, e);
        out.pret = lud.canUse(sk);
        hp0 = e.hp;
        lancer(lud, ACT, lud);
        // ×1,25 préparé, ×1,15 de résonance (deux ensemble)
        out.activer = { perdu: hp0 - e.hp, attendu: 2 * Math.round(ref * 1.25 * 1.15), ref: ref, reste: L.ecrits(lud).length,
                        etat: e.isStateAffected(ETAT), annonce: annonces(lud) };
        // un soin écrit sur toute l'équipe : rien tout de suite, tout à l'activation
        nettoyer();
        ael.setHp(1); kor.setHp(Math.floor(kor.mhp * 0.8));
        var ac = act(kor, 12, ael); ac.makeTargets().forEach(function (t) { t.clearResult(); ac.apply(t); });
        out.soin = { tout_de_suite: ael.hp, ecrits: L.ecrits(kor).length, chiffreAel: ael.getStateCounter(ETAT) };
        lancer(kor, ACT, kor);
        out.soin.apres = ael.hp;

        // 5 · trois au plus ; un ennemi tombé emporte ses écrits
        nettoyer();
        lancer(lud, 158, e); lancer(lud, 158, e);
        out.max2 = lud.canUse($dataSkills[158]);
        lancer(lud, 158, e2);
        out.max3 = { trait: lud.canUse($dataSkills[158]), don: lud.canUse($dataSkills[466]), activer: lud.canUse(sk) };
        e2.addState(1);
        out.mort = { ecrits: L.ecrits(lud).length, surE2: L.surCible(e2) };
        e2.revive(); nettoyer();

        // 6 · la volonté
        lud.setHp(Math.floor(lud.mhp / 2));
        var refMoitie = act(lud, 158, e).makeDamageValue(e, false);
        lud.recoverAll();
        var refPlein = act(lud, 158, e).makeDamageValue(e, false);
        lud.setHp(Math.floor(lud.mhp / 2));
        var donMoitie = act(lud, 466, e).makeDamageValue(e, false); lud.recoverAll();
        var donPlein = act(lud, 466, e).makeDamageValue(e, false);
        kor.setTp(100); var mvtPlein = act(kor, 1106, e).makeDamageValue(e, false);
        kor.setHp(Math.floor(kor.mhp / 2)); var mvtMoitie = act(kor, 1106, e).makeDamageValue(e, false);
        out.volonte = { ecrit: refMoitie / refPlein, don: donMoitie / donPlein, mvt: mvtMoitie / mvtPlein };
        nettoyer();
        return out;
    });

    console.log('1) La base');
    v('« ᛟ Activer » (1309) : capacité instantanée', r.base.nom === 'ᛟ Activer' && r.base.instant && r.base.type === 1, JSON.stringify(r.base).slice(0, 120));
    v('apprise au niveau 1 par les quatre classes, et connue des quatre héros', r.base.classes.every(Boolean) && r.base.appris.length >= 4 && r.base.appris.every(Boolean), JSON.stringify(r.base.appris));
    v('l\'état 257 « ᛟ Écrit » ne s\'use pas tout seul', r.base.etat.nom === 'ᛟ Écrit' && r.base.etat.fin === 0, JSON.stringify(r.base.etat));

    console.log('\n2) Ce qui s\'écrit');
    var q = r.qui;
    v('Trait Spectral (ludwing), Barrière Magique (Korrah), Syllabe de la Fin (l\'ultime d\'Aël)', q.trait && q.barriere && q.syllabe, JSON.stringify(q));
    v('les dons partent tout de suite : Aspiration d\'Âme (type âme), Jugement des Défunts (invocation)', !q.ame && !q.invocation);
    v('aussi : une attaque à plusieurs (Trio), la Parole lue du livre d\'Aël', !q.trio && !q.lue);
    v('contre-épreuve : ni un mouvement, ni une Parole, ni un ennemi', !q.mouvement && !q.parole && !q.ennemi);

    console.log('\n3) Écrire');
    var w = r.ecrire;
    v('rien ne part : l\'ennemi ne perd rien, et ce n\'est pas un « raté »', w.perdu === 0 && w.touche, String(w.perdu));
    v('l\'écrit est gardé (1), montré sur l\'ennemi (état, chiffre 1) et annoncé', w.ecrits === 1 && w.etat && w.chiffre === 1 && w.annonce.indexOf('ᛟ Écrit') >= 0, w.annonce.join(' | '));

    console.log('\n4) Activer');
    v('grisé sans écrit, possible avec', !r.grise && r.pret);
    var a = r.activer;
    v('deux écrits partent d\'un coup, chacun ×1,25 et ×1,15 de résonance', Math.abs(a.perdu - a.attendu) <= 2, a.perdu + ' / ' + a.attendu + ' (un coup lancé : ' + a.ref + ')');
    v('il n\'en reste rien : ni écrit, ni état ; « ᛟ Activé ×2 » au-dessus de ludwing', a.reste === 0 && !a.etat && a.annonce.some(function (t) { return /Activé ×2/.test(t); }), a.annonce.join(' | '));
    v('un soin écrit sur l\'équipe ne soigne pas tout de suite', r.soin.tout_de_suite === 1 && r.soin.ecrits >= 4 && r.soin.chiffreAel === 1, JSON.stringify(r.soin));
    v('…il soigne à l\'activation', r.soin.apres > 1, String(r.soin.apres));

    console.log('\n5) Trois au plus, et la mort');
    v('à 2 écrits, on écrit encore', r.max2);
    v('à 3 : les écrits sont grisés, un don reste possible, Activer aussi', !r.max3.trait && r.max3.don && r.max3.activer, JSON.stringify(r.max3));
    v('un ennemi tombé emporte son écrit (les autres restent)', r.mort.ecrits === 2 && r.mort.surE2 === 0, JSON.stringify(r.mort));

    console.log('\n6) La volonté');
    v('à mi-PV : un écrit ×1,25, un don de l\'âme ×1,25', Math.abs(r.volonte.ecrit - 1.25) < 0.01 && Math.abs(r.volonte.don - 1.25) < 0.01, JSON.stringify(r.volonte));
    v('contre-épreuve : un mouvement ne prend pas la volonté', Math.abs(r.volonte.mvt - 1) < 0.001);
    await fermerCombat();

    console.log('\n7) Un vrai combat laissé tourner');
    await page.evaluate(function () {
        Game_Actor.prototype.isAutoBattle = function () { return true; };
        Game_Actor.prototype.makeAutoBattleActions = function () {
            this.clearActions();
            var act = new Game_Action(this);
            if (this.actorId() === 3) {
                window.__n = (window.__n || 0) + 1;
                if (window.__n % 3 === 0) { act.setSkill(1309); } else { act.setSkill(158); act.setTarget(0); }
            } else { act.setGuard(); }
            this.setAction(0, act);
        };
        window.__vus = [];
        var an = CombatTactique.annoncer;
        CombatTactique.annoncer = function (b, t) { window.__vus.push(t); return an.apply(this, arguments); };
    });
    await ouvrirCombat();
    await page.evaluate(function () {
        $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); e.addParam(2, -e.atk + 1); e.addParam(4, -e.mat + 1); window.__pv0 = e.hp; });
        $gameParty.members().forEach(function (a) { a.addParam(0, 9999999); a.recoverAll(); });
    });
    try {
        await page.waitForFunction(function () { return (window.__n || 0) >= 4 && $gameTroop.turnCount() >= 4; }, null, { timeout: 300000, polling: 300 });
    } catch (x) { }
    var vrai = await page.evaluate(function () { return { n: window.__n, vus: window.__vus, tour: $gameTroop.turnCount() }; });
    v('le combat a tourné (' + vrai.n + ' choix de ludwing, tour ' + vrai.tour + ')', vrai.n >= 4);
    // (un ennemi qui frappe ludwing referme aussi ses écrits : « ᛟ Piège ! » — LEcrit, sa signature)
    v('ludwing a écrit, puis ses écrits sont partis : « ᛟ Écrit », puis « ᛟ Activé » ou « ᛟ Piège ! »', vrai.vus.indexOf('ᛟ Écrit') >= 0 && vrai.vus.some(function (t) { return /Activé ×|Piège !/.test(t); }),
      vrai.vus.filter(function (t) { return /ᛟ/.test(t); }).slice(0, 6).join(' | '));
    await fermerCombat();

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
