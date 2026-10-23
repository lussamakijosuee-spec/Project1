/*
 * BANC NAVIGATEUR — LES VERBES DES TROIS ARTS (2026-10-22)
 * ---------------------------------------------------------------------------
 * JOKO : « Oui rework tout » ; « Extrêmement développé et extrêmement
 * intéressant, surtout jouable et dans les règles ». Chaque capacité reçoit un
 * verbe de SON art, tiré de son nom :
 *   CORPS (LeMouvement) : <Ouvre> <Finit> <Reprise> <Sur> <Entre> <Grace>
 *     <Immobile> <Accumule> <EclatNoir> ;
 *   PAROLE (LaParole) : <Reste> <Assez> <MotJuste> <Suspend: n> <Viens>
 *     <Pars> <Nomme> ;
 *   ÉCRIT (LEcrit) : <Cercle> <Referme> <Sceau: n> <Pret> <Symbole>, et
 *     <Appat> (Vannes).
 * Chaque verbe est vérifié dans les deux sens, sur les vraies capacités de la
 * base (et les balises y sont bien posées).
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/les_verbes.js
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

    console.log('=== LES VERBES DES TROIS ARTS ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var M = LeMouvement, E = LEcrit, out = {};
        var ves = $gameActors.actor(1), kor = $gameActors.actor(2), lud = $gameActors.actor(3), ael = $gameActors.actor(4);
        var e = $gameTroop.members()[0], e2 = $gameTroop.members()[1];
        [e, e2].forEach(function (x) { x.addParam(0, 9999999); x.recoverAll(); });
        $gameParty.members().forEach(function (a) { a.addParam(0, 9999999); a.recoverAll(); });
        Math.random = function () { return 0.5; };
        function annonces(b) { return (b._ctAnnonces || []).map(function (a) { return a.texte; }); }
        function jouer(h, id, cible) {
            var act = new Game_Action(h); act.setSkill(id);
            act.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible));
            h._actions = [act]; h.setMp(h.mmp); h.setTp(100);
            BattleManager._subject = h; BattleManager.startAction();
            cible.clearResult(); act.apply(cible);
            BattleManager.endAction(); BattleManager._subject = null;
            return act;
        }
        function remettre(h) { h._mvtVoie = ''; h._mvtFlux = 0; h._mvtDernier = 0; h._mvtPense = false; h._riposte = false; h._reprise = 0; h._touche = false; h._ripostesCompte = 0; h._voiesVues = {}; h._lache = false; h._ctAnnonces = []; }
        function tag(id, nom) { return new RegExp('<' + nom + '[:>]').test($dataSkills[id].note); }

        // ── CORPS ──────────────────────────────────────────────────────────
        var C = {};
        remettre(ves); jouer(ves, 1071, ves); C.ouvre = M.flux(ves);                               // Trempe <Ouvre>
        remettre(ves); jouer(ves, 1066, e); C.ouvreContre = M.flux(ves);
        remettre(ves); jouer(ves, 1066, e); ves._mvtFlux = 2; C.finit = jouer(ves, 1068, e)._mvtMult; C.finitFlux = M.flux(ves);   // Le Point Final <Finit>
        remettre(ves); jouer(ves, 1066, e); C.finitContre = jouer(ves, 1068, e)._mvtMult;
        remettre(ves); jouer(ves, 1066, e);
        C.reprise = [jouer(ves, 1072, e)._mvtMult, jouer(ves, 1072, e)._mvtMult, jouer(ves, 1072, e)._mvtMult];   // Reprise du Marteau
        remettre(ves); jouer(ves, 4, e); C.repriseContre = jouer(ves, 4, e)._mvtMult;   // Double Attaque : sans verbe
        remettre(kor); jouer(kor, 1160, e); C.sur = jouer(kor, 1160, e)._mvtMult;                   // Maîtrise <Sur>
        var aSur = new Game_Action(kor); aSur.setSkill(1160); C.surTouche = [aSur.itemHit(e), aSur.itemEva(e)];
        remettre(kor); jouer(kor, 1157, e); C.surContre = jouer(kor, 1157, e)._mvtMult;
        remettre(kor); BattleManager._performedBattlers = [e]; C.entre = jouer(kor, 1105, e)._mvtMult;   // Le Creux Entre Deux
        remettre(kor); BattleManager._performedBattlers = []; C.entreContre = jouer(kor, 1105, e)._mvtMult;
        remettre(kor); e.setHp(Math.floor(e.mhp * 0.2)); C.grace = jouer(kor, 1112, e)._mvtMult;      // Coup de Grâce Éclair
        remettre(kor); e.recoverAll(); C.graceContre = jouer(kor, 1112, e)._mvtMult;
        remettre(kor); C.immobile = jouer(kor, 1103, e)._mvtMult;                                  // L'Immobile
        remettre(kor); kor.onDamage(1); C.immobileContre = jouer(kor, 1103, e)._mvtMult;
        C.immobileApres = kor._touche;
        remettre(ves); ves._ripostesCompte = 2; C.accumule = jouer(ves, 1078, e)._mvtMult; C.accumuleReste = ves._ripostesCompte;   // Grande Marée
        remettre(ves); C.accumuleContre = jouer(ves, 1078, e)._mvtMult;
        // Éclat Noir : un tirage (0,9) qui ne donne pas l'éclat mais touche — sûr avec 2 de flux, pas sans
        Math.random = function () { return 0.9; };
        remettre(kor); jouer(kor, 1106, e); kor._mvtFlux = 2; e._ctAnnonces = []; jouer(kor, 1124, e);
        C.eclat = annonces(e).some(function (t) { return /ÉCLAT NOIR/.test(t); });
        remettre(kor); jouer(kor, 1106, e); e._ctAnnonces = []; jouer(kor, 1124, e);
        C.eclatContre = annonces(e).some(function (t) { return /ÉCLAT NOIR/.test(t); });
        Math.random = function () { return 0.5; };
        C.balises = [tag(1071, 'Ouvre'), tag(1068, 'Finit'), tag(1072, 'Reprise'), tag(1160, 'Sur'), tag(1105, 'Entre'), tag(1112, 'Grace'), tag(1103, 'Immobile'), tag(1078, 'Accumule'), tag(1124, 'EclatNoir')];
        out.corps = C;

        // ── PAROLE ─────────────────────────────────────────────────────────
        var P = {};
        function parler(h, id, cible) { var a = new Game_Action(h); a.setSkill(id); a.setTarget(cible ? cible.index() : 0); var t = cible || e; t.clearResult(); a.apply(t); return a; }
        var T = $gameTroop.turnCount();
        LaParole.poser(8, 'Vesper'); parler(ael, 1175); P.reste = LaParole.phrase().tour - T;           // « Reste. »
        LaParole.poser(8, 'Vesper'); parler(kor, 151); P.resteContre = LaParole.phrase().tour - T;
        LaParole.poser(9, 'Vesper'); var as = parler(ael, 1180);                                        // « Assez. »
        P.assez = { el: as.getItemElements().sort().join(), mult: as._paroleMult, phrase: LaParole.phrase() };
        LaParole.poser(0); var as2 = parler(ael, 1180); P.assezContre = { el: as2.getItemElements().join(), mult: as2._paroleMult };
        var taux = e.elementRate; e.elementRate = function (id) { return id === 11 ? 2 : 1; };
        LaParole.poser(0); var mj = parler(ael, 1182);                                                   // Le Mot Juste
        P.motJuste = { el: mj._paroleElements, phrase: LaParole.phrase() };
        e.elementRate = function (id) { return id === 15 ? 2 : 1; };
        LaParole.poser(0); P.motJuste2 = parler(ael, 1182)._paroleElements;
        e.elementRate = taux;
        LaParole.poser(0); parler(ael, 474); P.pluie = LaParole.phrase();                                // « Qu'il pleuve. »
        LaParole.poser(0); parler(ael, 476); P.neige = LaParole.phrase();                                // « Qu'il neige. »
        ael._viens = null; parler(ael, 101);                                                              // « Viens. »
        var tv = new Game_Action(ael); tv.setSkill(1174); tv.setTarget(0); P.viens = tv.makeTargets().length;
        var tv2 = new Game_Action(ael); tv2.setSkill(1174); tv2.setTarget(0); P.viensApres = tv2.makeTargets().length;
        BattleManager._actionBattlers = [e, e2, ves]; parler(ael, 102, e);                                  // « Pars. »
        P.pars = BattleManager._actionBattlers.map(function (b) { return b.name(); });
        P.parsAttendu = [e2.name(), ves.name(), e.name()];
        BattleManager._actionBattlers = [e2, ves]; parler(ael, 102, e); P.parsFlag = e._pars - $gameTroop.turnCount();
        $gameTroop._turnCount++; BattleManager._actionBattlers = []; BattleManager.makeActionOrders();
        var ordre = BattleManager._actionBattlers; P.parsTourSuivant = ordre.indexOf(e) === ordre.length - 1; P.parsVide = e._pars;
        $gameTroop._turnCount--;
        BattleManager._actionBattlers = [];
        // Volée Nommée : la prochaine Parole d'un héros sur lui ×1,3, une seule
        e.recoverAll(); e._nomme = false;
        var sans = (function () { var a = new Game_Action(kor); a.setSkill(151); a._paroleDecidee = true; return a.makeDamageValue(e, false); })();
        parler(ael, 1176, e); P.nomme = e._nomme;
        var avec = (function () { var a = new Game_Action(kor); a.setSkill(151); a._paroleDecidee = true; return a.makeDamageValue(e, false); })();
        P.nommeRatio = avec / sans; P.nommeConsomme = e._nomme;
        parler(ael, 1176, e);
        var mv = new Game_Action(ves); mv.setSkill(1066); mv.makeDamageValue(e, false); P.nommeMouvement = e._nomme;
        e._nomme = false; LaParole.poser(0);
        P.balises = [tag(1175, 'Reste'), tag(1180, 'Assez'), tag(1182, 'MotJuste'), tag(474, 'Suspend'), tag(101, 'Viens'), tag(102, 'Pars'), tag(1176, 'Nomme')];
        out.parole = P;

        // ── ÉCRIT ──────────────────────────────────────────────────────────
        var W = {};
        function ecrire(h, id, cible) { var a = new Game_Action(h); a.setSkill(id); a.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible)); cible.clearResult(); a.apply(cible); }
        function payer(h, id, cible) { var a = new Game_Action(h); a.setSkill(id); a.setTarget(cible.index()); h._actions = [a]; h.recoverAll(); var pv = h.hp; h.paySkillCost($dataSkills[id]); return pv - h.hp; }
        function ennemiFrappe(qui, cible) {
            var a = new Game_Action(qui); a.setAttack(); a.setTarget($gameParty.members().indexOf(cible)); qui._actions = [a];
            BattleManager._subject = qui; BattleManager.startAction(); BattleManager.endAction(); BattleManager._subject = null;
        }
        [ves, kor, lud, ael].forEach(function (a) { a._ecrits = []; });
        ecrire(lud, 1114, e);                                                                              // Tracer le Cercle
        W.cercle = payer(lud, 158, e); W.cercleContre = payer(lud, 158, e2);
        lud._ecrits = []; e.recoverAll(); e2.recoverAll();
        ecrire(lud, 158, e2); ecrire(lud, 1115, e);                                                         // Territoire Scellé
        var hp2 = e2.hp; ennemiFrappe(e, lud);
        W.referme = { e2: hp2 - e2.hp, reste: E.ecrits(lud).length };
        lud._ecrits = []; e2.recoverAll();
        ecrire(lud, 158, e2); ecrire(lud, 158, e); hp2 = e2.hp; ennemiFrappe(e, lud);
        W.refermeContre = hp2 - e2.hp;
        lud._ecrits = [];
        BattleManager._actionBattlers = [e, e2]; e.clearActions(); e.makeActions();
        ecrire(lud, 1116, e); E.activer(lud);                                                               // La Règle du Lieu
        W.sceau = BattleManager._actionBattlers.indexOf(e) < 0;
        BattleManager._actionBattlers = [e, e2];
        Math.random = function () { return 0.6; }; ecrire(lud, 1242, e); E.activer(lud);                     // Faire Douter : 0,6 > 50 %
        W.douteRate = BattleManager._actionBattlers.indexOf(e) >= 0;
        Math.random = function () { return 0.4; }; ecrire(lud, 1242, e); E.activer(lud);
        W.douteTient = BattleManager._actionBattlers.indexOf(e) < 0;
        Math.random = function () { return 0.5; };
        BattleManager._actionBattlers = []; lud._ecrits = [];
        ecrire(lud, 1166, ves); E.activer(lud);                                                             // Ombre Prêtée sur Vesper
        W.pret = !!ves._ombreDe;
        ecrire(lud, 158, e); e.recoverAll(); var hpE = e.hp; ennemiFrappe(e, ves);
        W.pretPiege = hpE - e.hp;
        ecrire(lud, 158, e); hpE = e.hp; ennemiFrappe(e, kor);
        W.pretContre = hpE - e.hp;
        lud._ecrits = []; ves._ombreDe = null; e.recoverAll();
        ecrire(lud, 1170, e); ecrire(lud, 158, e); var aR = E.ecrits(lud).length;                          // Le Symbole
        lud._ctAnnonces = []; E.activer(lud);
        W.symbole = annonces(lud).filter(function (t) { return /Résonance/.test(t); });
        lud._ecrits = []; ecrire(lud, 158, e); ecrire(lud, 158, e); lud._ctAnnonces = []; E.activer(lud);
        W.symboleContre = annonces(lud).filter(function (t) { return /Résonance/.test(t); });
        // Vannes <Appat> : l'ennemi touché frappe ludwing
        jouer(lud, 13, e);
        var at = new Game_Action(e); at.setAttack(); at.setTarget($gameParty.members().indexOf(ael));
        W.appat = at.makeTargets().map(function (b) { return b.name(); });
        var at2 = new Game_Action(e2); at2.setAttack(); at2.setTarget($gameParty.members().indexOf(ael));
        W.appatContre = at2.makeTargets().map(function (b) { return b.name(); });
        e._appat = null; lud._ecrits = [];
        W.balises = [tag(1114, 'Cercle'), tag(1115, 'Referme'), tag(1116, 'Sceau'), tag(1242, 'Sceau'), tag(1166, 'Pret'), tag(1170, 'Symbole'), tag(13, 'Appat')];
        W.saignee = { art: LesTroisArts.art($dataSkills[1134]), pv: /<HP Cost: 7%>/.test($dataSkills[1134].note), pt: $dataSkills[1134].tpCost };
        out.ecrit = W;

        // ── DEUXIÈME PAQUET ───────────────────────────────────────────────
        var D = {};
        D.balises = [tag(1069, 'Lache'), tag(1130, 'Ouvre'), tag(1137, 'Finit'), tag(447, 'Entre'), tag(448, 'Riposte'), tag(1079, 'Ouvre'),
                     tag(1113, 'Premier'), tag(816, 'NeufVoies'), tag(140, 'Assez'), tag(454, 'ToutOuRien'), tag(1128, 'Riposte'),
                     tag(812, 'Riposte'), tag(1129, 'Sur'), tag(1185, 'Reste')];
        // Marteau à Deux Mains : ×1,5, la garde ouverte (elle encaisse ×1,5) jusqu'à sa prochaine action
        remettre(ves); D.lache = jouer(ves, 1069, e)._mvtMult; D.lacheOuverte = ves._lache;
        var coup = function () { var a = new Game_Action(e); a.setAttack(); return a.makeDamageValue(ves, false); };
        var ouverte = coup(); ves._lache = false; var fermee = coup();
        D.lacheRatio = ouverte / fermee; D.lacheExact = ouverte === Math.round(fermee * 1.5);
        ves._lache = true; jouer(ves, 1066, e); D.lacheApres = ves._lache;
        // Plus Vite que le Geste : avant tout le monde, même avant un ennemi en Garde (+2000 de vitesse)
        function quiCommence(h, id) {
            var g = new Game_Action(e); g.setGuard(); e._actions = [g]; e2._actions = [];
            var a = new Game_Action(h); a.setSkill(id); a.setTarget(1); h._actions = [a];
            $gameParty.members().forEach(function (m) { if (m !== h) { m._actions = []; } });
            BattleManager.makeActionOrders();
            return BattleManager._actionBattlers[0] ? BattleManager._actionBattlers[0].name() : '';
        }
        remettre(kor); D.premier = quiCommence(kor, 1113); D.premierContre = quiCommence(kor, 1112); D.ennemiNom = e.name();
        BattleManager._actionBattlers = [];
        // Carnage des Neuf Voies : +10 % par Voie déjà prise
        remettre(kor); jouer(kor, 1106, e); jouer(kor, 1098, e); jouer(kor, 1122, e); kor._ctAnnonces = [];
        jouer(kor, 816, e); D.neuf = annonces(kor).filter(function (t) { return /Voies? ×/.test(t); });
        remettre(kor); jouer(kor, 816, e); D.neufContre = annonces(kor).filter(function (t) { return /Voies? ×/.test(t); });
        // Tout ou Rien : ludwing tire deux fois (0,6 puis 0,3 → pile) ; Vesper une seule (0,6 → face)
        function suite(t) { var s = t.slice(); Math.random = function () { return s.length ? s.shift() : 0.5; }; }
        remettre(lud); suite([0.6, 0.3]); D.tout = jouer(lud, 454, e)._mvtMult;
        remettre(ves); suite([0.6, 0.3]); D.rien = jouer(ves, 454, e)._mvtMult;
        Math.random = function () { return 0.5; };
        // Garde Sereine, Contre-Éclat : la riposte s'arme aussi en frappant
        remettre(ves); jouer(ves, 448, e); D.gardeSereine = ves._voieReflux;
        remettre(lud); lud._voieReflux = null; jouer(lud, 1128, e); D.contreEclat = lud._voieReflux;
        ves._voieReflux = null; lud._voieReflux = null;
        out.deux = D;

        // ── TROISIÈME PAQUET ──────────────────────────────────────────────
        var T3 = {};
        T3.balises = [tag(1075, 'Entre'), tag(1136, 'Lache'), tag(143, 'Ouvre'), tag(145, 'Finit'), tag(1122, 'Ouvre'), tag(1102, 'Entre'),
                      tag(1172, 'Leurre'), tag(1126, 'Reprise'), tag(1168, 'Sur'), tag(1163, 'Reste'), tag(1174, 'Avec')];
        // Trait Clair <Avec> : la flèche part avec l'élément en suspens, la phrase reste
        LaParole.poser(8, 'Vesper'); var tc = parler(ael, 1174, e);
        T3.avec = { el: tc._paroleElements, phrase: LaParole.phrase() };
        LaParole.poser(8, 'Vesper'); parler(ael, 1216, e); T3.avecContre = LaParole.phrase();
        LaParole.poser(0);
        // Ombres Multiples <Leurre> : esquive +50 % jusqu'à sa prochaine action
        remettre(lud); jouer(lud, 1172, e);
        var coupL = new Game_Action(e); coupL.setAttack();
        var avecL = coupL.itemEva(lud); lud._leurre = false; var sansL = coupL.itemEva(lud);
        T3.leurre = { avec: avecL, sans: sansL };
        lud._leurre = true; jouer(lud, 1066, e); T3.leurreApres = lud._leurre;
        out.trois = T3;

        // ── QUATRIÈME PAQUET : le soutien ─────────────────────────────────
        var Q = {};
        var poses = [1066, 1132, 1145, 1226, 1232, 1123, 94, 449, 450, 12, 1237, 1080, 110, 1117, 1083, 1087, 1090, 1094, 1178, 1179, 1234, 1245];
        Q.balises = poses.filter(function (id) { return !/<(Sur|Reprise|Rempart|Devant|Rythme|EclatNoir|Sceau|Assez|MotJuste|Riposte|Encourage|Reste)[:>]/.test($dataSkills[id].note); });
        // Encourager (Aël) sur Vesper : sa prochaine action qui blesse ×1,2, une fois
        e.recoverAll(); ves._encourage = false;
        // (Encourager donne aussi +ATQ : on compare après, avec et sans l'encouragement)
        parler(ael, 1234, ves); Q.encourage = ves._encourage;
        var valV = function () { var a = new Game_Action(ves); a.setSkill(1066); return a.makeDamageValue(e, false); };
        var avecE = valV(), ensuite = valV();
        Q.encourageRatio = avecE / ensuite; Q.encourageExact = avecE === Math.round(ensuite * 1.2); Q.encourageUneFois = ves._encourage === false;
        // « Debout. » : l'allié relevé agit en premier au tour suivant
        kor.addState(1); parler(ael, 1178, kor);
        Q.debout = { vivante: kor.isAlive(), devant: kor._devant };
        var g = new Game_Action(e); g.setGuard(); e._actions = [g]; e2._actions = [];
        $gameParty.members().forEach(function (m) { m._actions = []; });
        var ak = new Game_Action(kor); ak.setSkill(151); ak.setTarget(0); kor._actions = [ak];
        BattleManager.makeActionOrders();
        Q.deboutPremier = BattleManager._actionBattlers[0] ? BattleManager._actionBattlers[0].name() : '';
        Q.deboutUneFois = kor._devant;
        BattleManager._actionBattlers = []; kor._actions = [];
        // Affûter (Korrah, toute l'équipe) : un point de flux à qui est en posture, jamais 3
        remettre(ves); jouer(ves, 1066, e); remettre(lud);
        var affuter = function () { var a = new Game_Action(kor); a.setSkill(1237); a.makeTargets().forEach(function (t) { t.clearResult(); a.apply(t); }); };
        affuter();
        Q.rythme = { ves: M.flux(ves), lud: M.flux(lud) };
        ves._mvtFlux = 1; affuter(); affuter(); Q.rythmeMax = M.flux(ves);
        // Cloison (ludwing, écrit sur l'équipe) : quand il part, le prochain coup sur l'allié ÷2, une fois
        [ves, kor, lud, ael].forEach(function (a) { a._ecrits = []; a._rempart = false; });
        var coupV = function () { var a = new Game_Action(e); a.setAttack(); return a.makeDamageValue(ves, false); };
        // (Cloison donne aussi +DÉF : on compare après l'activation, avec et sans le rempart)
        ecrire(lud, 1117, ves); Q.remparEcrit = !ves._rempart;
        E.activer(lud); Q.rempart = ves._rempart;
        var avecR = coupV(), apresR = coupV();
        Q.rempartRatio = avecR / apresR; Q.rempartExact = avecR === Math.round(apresR * 0.5); Q.rempartUneFois = ves._rempart === false;
        ves._rempart = true;
        var soinR = (function () { var a = new Game_Action(ael); a.setSkill(167); return a.makeDamageValue(ves, false); })();
        Q.rempartSoin = ves._rempart;
        ves._rempart = false; [ves, kor, lud, ael].forEach(function (a) { a._ecrits = []; });
        out.quatre = Q;
        return out;
    });

    var C = r.corps;
    console.log('1) Le corps');
    v('les balises sont posées sur les vraies capacités', C.balises.every(Boolean), JSON.stringify(C.balises));
    v('<Ouvre> (Trempe) : posture avec 1 de flux ; contre-épreuve, Frappe Pleine : 0', C.ouvre === 1 && C.ouvreContre === 0);
    v('<Finit> (Le Point Final) : flux 2 → ×1,6 et flux 0 ; sans flux, ×1', Math.abs(C.finit - 1.6) < 1e-9 && C.finitFlux === 0 && C.finitContre === 1, C.finit + ' / ' + C.finitContre);
    v('<Reprise> (Reprise du Marteau) : ×1,2 puis ×1,5 en la répétant', Math.abs(C.reprise[1] - 1.2) < 1e-9 && Math.abs(C.reprise[2] - 1.5) < 1e-9, JSON.stringify(C.reprise));
    v('…contre-épreuve : Double Attaque répétée s\'use (×0,85)', Math.abs(C.repriseContre - 0.85) < 1e-9);
    v('<Sur> (Maîtrise) : répétée sans s\'user, ne rate pas', C.sur === 1 && C.surTouche[0] === 1 && C.surTouche[1] === 0, C.sur + ' · ' + JSON.stringify(C.surTouche));
    v('…contre-épreuve : Angle Parfait répété s\'use', Math.abs(C.surContre - 0.85) < 1e-9);
    v('<Entre> (Le Creux Entre Deux) : ×1,5 sur un ennemi qui a déjà agi ; pas sinon', Math.abs(C.entre - 1.5) < 1e-9 && C.entreContre === 1, C.entre + ' / ' + C.entreContre);
    v('<Grace> (Coup de Grâce Éclair) : ×1,5 sous 25 % ; pas à pleine vie', Math.abs(C.grace - 1.5) < 1e-9 && C.graceContre === 1, C.grace + ' / ' + C.graceContre);
    v('<Immobile> (L\'Immobile) : ×1,5 si personne ne l\'a touchée ; pas sinon', Math.abs(C.immobile - 1.5) < 1e-9 && C.immobileContre === 1 && C.immobileApres === false, C.immobile + ' / ' + C.immobileContre);
    v('<Accumule> (Grande Marée) : 2 ripostes gardées → ×1,3, et on repart de 0 ; sans riposte, ×1', Math.abs(C.accumule - 1.3) < 1e-9 && C.accumuleReste === 0 && C.accumuleContre === 1, C.accumule + ' / ' + C.accumuleContre);
    v('<EclatNoir> : avec 2 de flux, l\'Éclat Noir sort même sur un mauvais tirage ; sans flux, non', C.eclat && !C.eclatContre);

    var P = r.parole;
    console.log('\n2) La Parole');
    v('les balises sont posées', P.balises.every(Boolean), JSON.stringify(P.balises));
    v('« Reste. » : la phrase tient un tour de plus ; une autre Parole n\'y touche pas', P.reste === 1 && P.resteContre === 0, P.reste + ' / ' + P.resteContre);
    v('« Assez. » : ferme la phrase, frappe avec son élément (Eau + positif), ×1,5', P.assez.el === '3,9' && Math.abs(P.assez.mult - 1.5) < 1e-9 && P.assez.phrase === null, JSON.stringify(P.assez));
    v('…sans phrase, ×1 et son seul mana', P.assezContre.el === '3' && P.assezContre.mult === 1, JSON.stringify(P.assezContre));
    v('Le Mot Juste : l\'élément qui marche (Terre) et il reste en suspens ; un autre ennemi, un autre mot (Ombre)',
      JSON.stringify(P.motJuste.el) === '[11]' && P.motJuste.phrase && P.motJuste.phrase.el === 11 && JSON.stringify(P.motJuste2) === '[15]', JSON.stringify(P.motJuste) + ' · ' + JSON.stringify(P.motJuste2));
    v('« Qu\'il pleuve. » laisse l\'Eau en suspens, « Qu\'il neige. » la Glace', P.pluie && P.pluie.el === 9 && P.neige && P.neige.el === 13);
    v('« Viens. » : sa Parole suivante à une cible les prend tous, une seule fois', P.viens >= 2 && P.viensApres === 1, P.viens + ' puis ' + P.viensApres);
    v('« Pars. » : l\'ennemi passe en dernier ce tour', JSON.stringify(P.pars) === JSON.stringify(P.parsAttendu), P.pars.join(' > '));
    v('…s\'il a déjà agi : en dernier au tour suivant, une fois', P.parsFlag === 1 && P.parsTourSuivant && P.parsVide === 0);
    v('Volée Nommée : nommé, la Parole suivante ×1,3 et c\'est consommé', P.nomme === true && Math.abs(P.nommeRatio - 1.3) < 0.01 && P.nommeConsomme === false, P.nommeRatio.toFixed(3));
    v('…contre-épreuve : un mouvement ne consomme pas le nom', P.nommeMouvement === true);

    var W = r.ecrit;
    console.log('\n3) L\'écrit');
    v('les balises sont posées', W.balises.every(Boolean), JSON.stringify(W.balises));
    v('Tracer le Cercle : dans le cercle, son écrit ne coûte rien ; hors du cercle, 7 % de PV', W.cercle === 0 && W.cercleContre > 0, W.cercle + ' / ' + W.cercleContre);
    v('Territoire Scellé : quand il part, tous ses autres écrits partent (même sur l\'autre ennemi)', W.referme.e2 > 0 && W.referme.reste === 0, JSON.stringify(W.referme));
    v('…contre-épreuve : sans lui, l\'écrit sur l\'autre ennemi attend', W.refermeContre === 0);
    v('La Règle du Lieu : l\'ennemi perd sa prochaine action', W.sceau);
    v('Faire Douter : 1 chance sur 2 (0,6 : non ; 0,4 : oui)', W.douteRate && W.douteTient);
    v('Ombre Prêtée : qui frappe Vesper referme le piège de ludwing', W.pret && W.pretPiege > 0, String(W.pretPiege));
    v('…contre-épreuve : frapper Korrah n\'y fait rien', W.pretContre === 0);
    v('Le Symbole compte pour deux : avec un autre écrit, résonance ×1,3 (au lieu de ×1,15)', W.symbole.join() === 'ᛟ Résonance ×1,3' && W.symboleContre.join() === 'ᛟ Résonance ×1,15', W.symbole.join() + ' / ' + W.symboleContre.join());
    v('Vannes : l\'ennemi provoqué frappe ludwing au lieu d\'Aël ; un autre non', W.appat.join() === 'ludwing' && W.appatContre.join() !== 'ludwing', W.appat.join() + ' / ' + W.appatContre.join());
    v('Saignée Continue est devenue un écrit de Vesper, payé en PV', W.saignee.art === 'ecrit' && W.saignee.pv && W.saignee.pt === 0);

    var D = r.deux;
    console.log('\n4) Le deuxième paquet');
    v('les 14 balises sont posées', D.balises.every(Boolean), JSON.stringify(D.balises));
    v('Marteau à Deux Mains : ×1,5, et elle encaisse ×1,5 tant que sa garde est lâchée', Math.abs(D.lache - 1.5) < 1e-9 && D.lacheOuverte && D.lacheExact,
      D.lache + ' · encaisse ×' + D.lacheRatio.toFixed(3));
    v('…sa garde se referme à son action suivante', D.lacheApres === false);
    v('Plus Vite que le Geste part avant tout le monde, même un ennemi en Garde', D.premier === 'Korrah', D.premier);
    v('…contre-épreuve : Coup de Grâce Éclair, sans flux, ne passe pas devant', D.premierContre !== 'Korrah', D.premierContre);
    v('Carnage des Neuf Voies : 3 Voies déjà prises → ×1,3 ; dans un combat neuf, rien', D.neuf.join() === '◆ 3 Voies ×1,3' && D.neufContre.length === 0, D.neuf.join() + ' / ' + D.neufContre.join());
    v('Tout ou Rien : ludwing tire deux fois et garde pile (×2) ; un autre garde face (×0,25)', D.tout === 2 && D.rien === 0.25, D.tout + ' / ' + D.rien);
    v('Garde Sereine (Vesper) et Contre-Éclat (ludwing) arment la riposte en frappant', D.gardeSereine === 1 && D.contreEclat === 1);

    var T3 = r.trois;
    console.log('\n5) Le troisième paquet');
    v('les 11 balises sont posées', T3.balises.every(Boolean), JSON.stringify(T3.balises));
    v('Trait Clair : Lumière ET le Feu en suspens, et la phrase de Vesper reste', JSON.stringify(T3.avec.el) === '[14,8]' && T3.avec.phrase && T3.avec.phrase.el === 8 && T3.avec.phrase.par === 'Vesper', JSON.stringify(T3.avec));
    v('…contre-épreuve : Lumière — Lueur remplace la phrase', T3.avecContre && T3.avecContre.el === 14, JSON.stringify(T3.avecContre));
    v('Ombres Multiples : esquive +30 % sur ludwing', Math.abs(T3.leurre.avec - T3.leurre.sans - 0.3) < 1e-9, JSON.stringify(T3.leurre));
    v('…jusqu\'à sa prochaine action', T3.leurreApres === false);

    var Q = r.quatre;
    console.log('\n6) Le quatrième paquet : le soutien');
    v('les balises sont posées (échantillon de 22 sur 99)', Q.balises.length === 0, Q.balises.join(', '));
    v('Encourager : Vesper encouragée frappe ×1,2 à sa prochaine action', Q.encourage === true && Q.encourageExact, Q.encourageRatio.toFixed(3));
    v('…une seule fois', Q.encourageUneFois);
    v('« Debout. » relève Korrah, qui agit en premier au tour suivant (même devant un ennemi en Garde)', Q.debout.vivante && Q.debout.devant && Q.deboutPremier === 'Korrah', JSON.stringify(Q.debout) + ' · ' + Q.deboutPremier);
    v('…une seule fois', Q.deboutUneFois === false);
    v('Affûter : Vesper (en posture) prend un point de flux ; ludwing (sans posture) rien', Q.rythme.ves === 1 && Q.rythme.lud === 0, JSON.stringify(Q.rythme));
    v('…jamais 3 : le geste juste reste à faire', Q.rythmeMax === 2);
    v('Cloison écrite ne protège pas encore ; activée, le prochain coup sur Vesper ÷2', Q.remparEcrit && Q.rempart === true && Q.rempartExact, Q.rempartRatio.toFixed(3));
    v('…une seule fois, et un soin ne l\'use pas', Q.rempartUneFois && Q.rempartSoin === true);

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
