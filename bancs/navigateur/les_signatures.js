/*
 * BANC NAVIGATEUR — LES SIGNATURES DES QUATRE (2026-10-22)
 * ---------------------------------------------------------------------------
 * JOKO : « je t'autorise à tout même les capacités », puis « rendre les
 * vraiment intéressant et original ». Une signature par héros, tirée de son
 * profil écrit, branchée sur un des trois arts :
 *   VESPER (« spécialiste de la CONTRE-ATTAQUE ») — le contre-temps : sa riposte
 *     fait monter son flux, et au 3 elle est un geste juste ; <Riposte> (ses
 *     gardes) arme une riposte ; <ApresRiposte> frappe ×1,5 après une riposte ;
 *   KORRAH (« frapper juste ET penser juste ») — sa Parole est un pas du flux,
 *     le geste juste peut tomber sur elle ; <Lecture> : son prochain mouvement
 *     sur l'ennemi lu frappe ×1,5 ;
 *   LUDWING (« maître du rage-bait », « le plus CHANCEUX ») — ses écrits sont
 *     des pièges : ils partent quand l'ennemi le frappe ; 1 chance sur 4 qu'un
 *     écrit reste ; et pour tous, la résonance (des écrits qui partent ensemble) ;
 *   AËL (« oser dire et faire des choses pour ELLE ») — compléter sa propre
 *     phrase ne la referme pas, ×1,2.
 * Chaque signature est vérifiée dans les deux sens : elle joue pour son héros,
 * pas pour un autre.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/les_signatures.js
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
    await page.evaluate(function () {
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(2500);

    console.log('=== LES SIGNATURES DES QUATRE ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var M = LeMouvement, out = {};
        var ves = $gameActors.actor(1), kor = $gameActors.actor(2), lud = $gameActors.actor(3), ael = $gameActors.actor(4);
        var e = $gameTroop.members()[0], e2 = $gameTroop.members()[1];
        [e, e2].forEach(function (x) { x.addParam(0, 9999999); x.recoverAll(); });
        $gameParty.members().forEach(function (a) { a.addParam(0, 9999999); a.recoverAll(); });
        Math.random = function () { return 0.5; };
        function annonces(b) { return (b._ctAnnonces || []).map(function (a) { return a.texte; }); }
        function vider(b) { b._ctAnnonces = []; }
        // une action par le vrai chemin : startAction → apply → endAction
        function jouer(h, id, cible) {
            var act = new Game_Action(h); act.setSkill(id);
            act.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible));
            h._actions = [act]; h.setMp(h.mmp); h.setTp(100);
            BattleManager._subject = h; BattleManager.startAction();
            cible.clearResult(); act.apply(cible);
            var dmg = cible.result().hpDamage;
            BattleManager.endAction(); BattleManager._subject = null;
            return { dmg: dmg, mult: act._mvtMult || 1, act: act };
        }
        function remettre(h) { h._mvtVoie = ''; h._mvtFlux = 0; h._mvtDernier = 0; h._mvtPense = false; h._riposte = false; h._voieReflux = null; h._voieRenvoi = null; vider(h); }
        // l'ennemi frappe h de `valeur` par le chemin des dégâts (là où partent Reflux et Renvoi)
        function frappe(h, valeur) {
            var a = new Game_Action(e); a.setAttack();
            var pvE = e.hp; h.clearResult(); a.executeDamage(h, valeur); return pvE - e.hp;
        }

        // ── 1 · VESPER, le contre-temps ──────────────────────────────────
        var V = {};
        // ses gestes du contre-temps sont ceux de la Garde ; en Lame, ses mouvements prendraient la Voie de son arme (2026-10-26)
        PacteDeSang.changerStyle('garde');
        remettre(ves); jouer(ves, 1066, e);                           // Frappe Pleine : une posture
        vider(ves); jouer(ves, 1233, ves);                            // Garde Haute <Riposte> (un mouvement : la Voie du Sang)
        V.armee = { reflux: ves._voieReflux, annonce: annonces(ves).indexOf('⚔ Riposte prête') >= 0, posture: M.posture(ves) };
        vider(ves); var petit = Math.floor(ves.mhp * 0.05), fluxAvant = M.flux(ves);
        V.rendu = frappe(ves, petit); V.petit = petit;
        V.flux1 = M.flux(ves) - fluxAvant; V.annonce1 = annonces(ves).filter(function (t) { return /Contre-temps/.test(t); });
        ves._mvtFlux = 2; ves._voieReflux = 1; vider(ves);
        V.renduGeste = frappe(ves, petit); V.flux3 = M.flux(ves);
        V.annonceGeste = annonces(ves).filter(function (t) { return /GESTE JUSTE · contre-temps/.test(t); });
        // après la riposte : Contre-Courant ×1,5 (sans le flux, mis à part) ; son action finie, c'est passé
        function valeur(id) { var a = new Game_Action(ves); a.setSkill(id); return a.makeDamageValue(e, false); }
        ves._riposte = true; var avec = valeur(1076);
        ves._riposte = false; var sans = valeur(1076);
        ves._riposte = true; jouer(ves, 1076, e);
        V.apres = { avec: avec, sans: sans, apresAction: ves._riposte, autre: (function () { ves._riposte = true; var x = valeur(1066) === (function () { ves._riposte = false; return valeur(1066); })(); return x; })() };
        // contre-épreuve : Korrah riposte (Reflux armé à la main) sans que son flux bouge
        remettre(kor); jouer(kor, 1106, e); kor._voieReflux = 1; var fluxK = M.flux(kor);
        frappe(kor, Math.floor(kor.mhp * 0.05));
        V.korrah = { avant: fluxK, apres: M.flux(kor) };
        // un gros coup brise la posture avant la riposte : elle rend quand même, sans flux
        remettre(ves); jouer(ves, 1066, e); ves._voieReflux = 1;
        ves._adapt = {};                                              // un premier coup de ce type : la Garde ne s'y est pas encore faite
        var gros = Math.ceil(ves.mhp * 0.2); V.gros = { rendu: frappe(ves, gros), posture: M.posture(ves), flux: M.flux(ves), valeur: gros };
        ves.recoverAll();
        out.vesper = V;

        // ── 2 · KORRAH, penser juste ──────────────────────────────────────
        var K = {};
        remettre(kor); jouer(kor, 1106, e);                           // Pas de Côté : posture éclair
        vider(kor); var p1 = jouer(kor, 1206, e);                     // une Parole de Foudre : un pas du flux
        K.p1 = { flux: M.flux(kor), posture: M.posture(kor), mult: p1.mult, annonce: annonces(kor).filter(function (t) { return /Penser juste/.test(t); }) };
        var m2 = jouer(kor, 1107, e);                                 // Trait Foudroyant, même Voie : après une Parole, ça change
        K.m2 = { flux: M.flux(kor), mult: m2.mult };
        vider(kor); var p3 = jouer(kor, 1207, e);                     // une autre Parole : flux 3 → penser juste
        K.p3 = { flux: M.flux(kor), mult: p3.mult, annonce: annonces(kor).filter(function (t) { return /PENSER JUSTE/.test(t); }) };
        // contre-épreuve : Vesper dans sa posture, une Parole la rompt
        remettre(ves); jouer(ves, 1066, e); jouer(ves, 1186, e);
        K.vesper = { posture: M.posture(ves), flux: M.flux(ves) };
        // la lecture : Œil du Stratège lit l'ennemi ; son mouvement suivant sur lui ×1,5, une fois
        remettre(kor); e.recoverAll(); vider(e);
        jouer(kor, 95, e);
        K.lu = { par: e._luPar, annonce: annonces(e).indexOf('◎ Lu') >= 0 };
        var l1 = jouer(kor, 1106, e);
        K.lu.mult = l1.mult; K.lu.apres = e._luPar;
        var l2 = jouer(kor, 1098, e);
        K.lu.ensuite = l2.mult;
        // contre-épreuve : ce n'est pas Vesper qui profite de la lecture de Korrah
        jouer(kor, 95, e); remettre(ves); var lv = jouer(ves, 1066, e);
        K.lu.vesper = { mult: lv.mult, reste: e._luPar };
        e._luPar = 0;
        out.korrah = K;

        // ── 3 · LUDWING, le piège, la chance, la résonance ───────────────
        var L = {}, E = LEcrit;
        function ecrire(h, id, cible) { var a = new Game_Action(h); a.setSkill(id); a.setTarget(cible.index()); cible.clearResult(); a.apply(cible); }
        function ennemiFrappe(qui, cible) {
            var a = new Game_Action(qui); a.setAttack(); a.setTarget($gameParty.members().indexOf(cible)); qui._actions = [a];
            BattleManager._subject = qui; BattleManager.startAction(); BattleManager.endAction(); BattleManager._subject = null;
        }
        lud._ecrits = []; e.recoverAll(); e2.recoverAll();
        ecrire(lud, 158, e); ecrire(lud, 158, e); ecrire(lud, 158, e2);
        var hpE = e.hp, hpE2 = e2.hp; vider(e);
        ennemiFrappe(e, lud);
        L.piege = { perdu: hpE - e.hp, reste: E.ecrits(lud).length, autre: hpE2 - e2.hp, annonce: annonces(e).indexOf('ᛟ Piège !') >= 0 };
        // contre-épreuve : l'ennemi frappe un autre que ludwing — rien ne part
        lud._ecrits = []; ecrire(lud, 158, e); hpE = e.hp;
        ennemiFrappe(e, ves);
        L.ailleurs = { perdu: hpE - e.hp, reste: E.ecrits(lud).length };
        // contre-épreuve : les écrits de Korrah ne sont pas des pièges (une rune dans l'air sur l'ennemi, Désorientation —
        // depuis le 2026-10-26, une rune qui vise tous les ennemis se trace au sol, et celle-là part quand l'ennemi agit)
        kor._ecrits = []; lud._ecrits = []; ecrire(kor, 94, e); hpE = e.hp;
        ennemiFrappe(e, kor);
        L.korrah = { perdu: hpE - e.hp, reste: E.ecrits(kor).length };
        kor._ecrits = [];
        // la chance : 1 sur 4, l'écrit reste (tirage forcé)
        lud._ecrits = []; ecrire(lud, 158, e);
        Math.random = function () { return 0.1; }; E.activer(lud); Math.random = function () { return 0.5; };
        L.chance = { reste: E.ecrits(lud).length, annonce: annonces(e).indexOf('🍀 Toujours écrit') >= 0 };
        lud._ecrits = []; ecrire(lud, 158, e); E.activer(lud); L.sansChance = E.ecrits(lud).length;
        // la résonance : trois écrits ensemble frappent ×1,3 chacun ; un seul, rien de plus
        lud._ecrits = []; e.recoverAll();
        var ref = (function () { var a = new Game_Action(lud); a.setSkill(158); return a.makeDamageValue(e, false); })();
        ecrire(lud, 158, e); hpE = e.hp; E.activer(lud); var un = hpE - e.hp;
        e.recoverAll(); ecrire(lud, 158, e); ecrire(lud, 158, e); ecrire(lud, 158, e); hpE = e.hp; vider(lud);
        E.activer(lud); var trois = hpE - e.hp;
        L.resonance = { ref: ref, un: un, trois: trois, annonce: annonces(lud).filter(function (t) { return /Résonance/.test(t); }) };
        lud._ecrits = []; e.recoverAll();
        out.ludwing = L;

        // ── 4 · AËL, pour elle ────────────────────────────────────────────
        var A = {};
        function parler(h, id) { var a = new Game_Action(h); a.setSkill(id); a.setTarget(0); e.clearResult(); a.apply(e); return a; }
        LaParole.poser(0); vider(ael);
        parler(ael, 1216);                                           // Lumière — Lueur : Lumière en suspens, par Aël
        var d = parler(ael, 1197);                                   // Vent — Rafale (double) : sa propre phrase
        A.double = { phrase: LaParole.phrase(), mult: d._paroleMult, annonce: annonces(ael).filter(function (t) { return /Pour elle/.test(t); }) };
        var f = parler(ael, 1219);                                   // Lumière — Aube… même élément : on reprend la phrase
        LaParole.poser(14, 'Aël');
        var g = parler(lud, 1224);                                   // ludwing fusionne la Lumière d'Aël : sa phrase à elle, pas à lui
        A.ludwing = { phrase: LaParole.phrase(), mult: g._paroleMult };
        LaParole.poser(8, 'Vesper');
        var h = parler(ael, 1197);                                   // Aël complète la phrase de Vesper : elle se referme
        A.amie = { phrase: LaParole.phrase(), mult: h._paroleMult };
        LaParole.poser(0);
        out.ael = A;
        return out;
    });

    console.log('1) Vesper — le contre-temps');
    var V = r.vesper;
    v('Garde Haute arme une riposte (c\'est un mouvement, une garde : posture du Miroir)', V.armee.reflux === 1 && V.armee.annonce && V.armee.posture === 'miroir', JSON.stringify(V.armee));
    v('on la frappe : l\'ennemi reçoit ce qu\'il a donné, et son flux monte de 1', V.rendu === V.petit && V.flux1 === 1 && V.annonce1.length > 0, V.rendu + ' / ' + V.petit + ' · ' + V.annonce1.join(''));
    v('au flux 3, la riposte est un geste juste : ×1,5', Math.abs(V.renduGeste - Math.floor(V.petit * 1.5)) <= 1 && V.flux3 === 0 && V.annonceGeste.length > 0, V.renduGeste + ' / ' + Math.floor(V.petit * 1.5));
    v('après la riposte, Contre-Courant frappe ×1,5', Math.abs(V.apres.avec / V.apres.sans - 1.5) < 0.02, V.apres.sans + ' → ' + V.apres.avec);
    v('…pour son action suivante seulement ; et pas une technique sans la balise', V.apres.apresAction === false && V.apres.autre === true);
    v('contre-épreuve : la riposte de Korrah ne touche pas son flux', V.korrah.avant === V.korrah.apres, JSON.stringify(V.korrah));
    v('un coup de 20 % brise sa posture avant : elle rend quand même, sans flux', V.gros.rendu === V.gros.valeur && V.gros.posture === '' && V.gros.flux === 0, JSON.stringify(V.gros));

    console.log('\n2) Korrah — penser juste');
    var K = r.korrah;
    v('dans sa posture, une Parole ne rompt rien : flux 1, ×1,15, annoncé', K.p1.flux === 1 && K.p1.posture === 'eclair' && Math.abs(K.p1.mult - 1.15) < 1e-9 && K.p1.annonce.length > 0, JSON.stringify(K.p1));
    v('le mouvement d\'après, même Voie, compte comme un changement : flux 2', K.m2.flux === 2 && Math.abs(K.m2.mult - 1.15) < 1e-9, JSON.stringify(K.m2));
    v('une Parole au flux 3 : PENSER JUSTE ×1,5', K.p3.flux === 0 && Math.abs(K.p3.mult - 1.5) < 1e-9 && K.p3.annonce.length > 0, JSON.stringify(K.p3));
    v('contre-épreuve : chez Vesper, une Parole rompt la posture', K.vesper.posture === '' && K.vesper.flux === 0, JSON.stringify(K.vesper));
    v('Œil du Stratège lit l\'ennemi (◎ Lu)', K.lu.par === 2 && K.lu.annonce, JSON.stringify(K.lu));
    v('…son mouvement suivant sur lui ×1,5, une seule fois', Math.abs(K.lu.mult - 1.5) < 1e-9 && K.lu.apres === 0 && Math.abs(K.lu.ensuite - 1.15) < 1e-9, K.lu.mult + ' puis ' + K.lu.ensuite);
    v('contre-épreuve : Vesper ne profite pas de la lecture de Korrah', K.lu.vesper.mult === 1 && K.lu.vesper.reste === 2, JSON.stringify(K.lu.vesper));

    console.log('\n3) ludwing — le piège, la chance, la résonance');
    var L = r.ludwing;
    v('l\'ennemi qui frappe ludwing referme le piège : ses deux écrits partent', L.piege.perdu > 0 && L.piege.annonce && L.piege.reste === 1, JSON.stringify(L.piege));
    v('…celui écrit sur l\'autre ennemi attend', L.piege.autre === 0);
    v('contre-épreuve : l\'ennemi frappe Vesper — le piège ne bouge pas', L.ailleurs.perdu === 0 && L.ailleurs.reste === 1, JSON.stringify(L.ailleurs));
    v('contre-épreuve : les écrits de Korrah ne sont pas des pièges', L.korrah.perdu === 0 && L.korrah.reste === 1, JSON.stringify(L.korrah));
    v('la chance (tirage sous 25 %) : l\'écrit parti reste écrit 🍀', L.chance.reste === 1 && L.chance.annonce, JSON.stringify(L.chance));
    v('sans la chance (tirage 50 %), il s\'en va', L.sansChance === 0);
    v('résonance : trois écrits ensemble, chacun ×1,3 de plus (et ×1,25 d\'accord : trois Frappe)', Math.abs(L.resonance.trois / (3 * L.resonance.un) - 1.3 * 1.25) < 0.01 && L.resonance.annonce.length > 0,
      'un : ' + L.resonance.un + ' · trois : ' + L.resonance.trois + ' (×' + (L.resonance.trois / (3 * L.resonance.un)).toFixed(3) + ')');

    console.log('\n4) Aël — pour elle');
    var A = r.ael;
    v('elle complète sa propre phrase : la Lumière reste en suspens, ×1,2, annoncé', A.double.phrase && A.double.phrase.el === 14 && Math.abs(A.double.mult - 1.2) < 1e-9 && A.double.annonce.length > 0, JSON.stringify(A.double));
    v('contre-épreuve : ludwing fusionne la Lumière d\'Aël — ×1,5 de la Fusion, rien de plus, la phrase se referme', A.ludwing.phrase === null && Math.abs(A.ludwing.mult - 1.5) < 1e-9, JSON.stringify(A.ludwing));
    v('contre-épreuve : Aël complète la phrase de Vesper — elle se referme, ×1', A.amie.phrase === null && Math.abs(A.amie.mult - 1) < 1e-9, JSON.stringify(A.amie));

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
