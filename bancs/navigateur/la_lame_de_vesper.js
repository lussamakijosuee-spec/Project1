/*
 * BANC NAVIGATEUR — LA LAME DE VESPER (L1, L2, L4 — 2026-10-26)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-26, sur la proposition mesurée des Styles : « L1 l2, l4 ».
 * La Bible : « la Lame (les arts de l'arme qu'elle tient, et l'État de
 * Flow) » ; « Le contre-temps. Chaque riposte fait monter son flux, et la
 * troisième est un geste juste. »
 *
 *   L1 — en Lame, un mouvement sans Voie à lui prend celle de l'arme tenue
 *        (épée Miroir, dague Éclair, hache Forge, lance Vide, distance Flash,
 *        poings Onde) au lieu de la Voie du Sang ; changer de Style change de
 *        Voie, et le flux monte ;
 *   L2 — chaque art d'arme a un verbe du corps, tiré de sa description ;
 *   L4 — la contre-attaque du Flow est une riposte du contre-temps.
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. la Voie selon l'arme, en Lame seulement ; une Voie écrite reste la
 *      sienne ; sans famille (le fouet), la Voie du Sang ; en Sang et en Garde,
 *      la Voie du Sang ;
 *   2. passer de la Lame au Sang fait monter le flux ; rester dans le Sang, non ;
 *   3. les 18 arts portent leur verbe et sa ligne ; quatre verbes jouent pour
 *      de vrai (Iaï part le premier, le Couperet lâche la garde, Percée ne
 *      s'use pas, Saut du Héron met tout le flux) — et pas sans eux ;
 *   4. la contre-attaque du Flow : le chemin de LesStylesDeVesper l'annonce
 *      comme riposte ; elle fait monter le flux, la 3ᵉ est un geste juste, elle
 *      ne compte pas comme un geste de plus, et « après la riposte » tient
 *      jusqu'à sa vraie action suivante ; sans l'annonce, c'est un geste
 *      ordinaire.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   cmd /c start "" /b /wait /low /affinity 3 node bancs/navigateur/la_lame_de_vesper.js
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

    console.log('=== LA LAME DE VESPER ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var o = {}, ves = $gameActors.actor(1), M = LeMouvement;
        var e = $gameTroop.members()[0];
        $gameTroop.members().forEach(function (x) { x.addParam(0, 9999999); x.recoverAll(); });
        ves.addParam(0, 9999999); ves.recoverAll();
        Math.random = function () { return 0.5; };
        function armeDe(t) { return $dataWeapons.filter(function (w) { return w && w.name && w.wtypeId === t; })[0] || null; }
        function tenir(t) { ves.forceChangeEquip(0, t === 0 ? null : armeDe(t)); }
        function action(id, forcee) { var a = new Game_Action(ves, !!forcee); if (id === 1) { a.setAttack(); } else { a.setSkill(id); } a.setTarget(e.index()); return a; }
        function voie(id) { return Voies.voieDe(action(id)); }
        function annonces() { return (ves._ctAnnonces || []).map(function (a) { return a.texte; }); }
        function remettre() { ves._mvtVoie = ''; ves._mvtFlux = 0; ves._mvtDernier = 0; ves._mvtPense = false; ves._riposte = false; ves._reprise = 0; ves._touche = false; ves._lache = false; ves._riposteForcee = 0; ves._riposteEnCours = false; ves._ctAnnonces = []; }
        function jouer(a) {
            ves._actions = [a]; ves.setMp(ves.mmp); ves.setTp(100); ves.setHp(ves.mhp);
            BattleManager._subject = ves; BattleManager.startAction();
            e.clearResult(); a.apply(e);
            BattleManager.endAction(); BattleManager._subject = null;
            return a;
        }

        // 1 · la Voie selon l'arme
        PacteDeSang.changerStyle('lame');
        var ARMES = [['épée', 2, 1281], ['dague', 1, 1284], ['hache', 4, 1287], ['lance', 12, 1290], ['arc', 7, 1293], ['gant', 11, 1296], ['mains nues', 0, 1]];
        o.voies = ARMES.map(function (x) { tenir(x[1]); return { arme: x[0], art: voie(x[2]), attaque: voie(1), tn: voie(445) }; });
        tenir(5); o.fouet = voie(1);
        tenir(2); o.ecrite = { fil: voie(128), chirurgie: voie(129), contre: voie(131) };
        PacteDeSang.changerStyle('saignee'); o.enSang = voie(1);
        PacteDeSang.changerStyle('garde'); o.enGarde = voie(1);
        // 2 · changer de Style, c'est changer de Voie
        PacteDeSang.changerStyle('lame'); tenir(2); remettre();
        jouer(action(1281)); o.apresLame = { voie: M.posture(ves), flux: M.flux(ves) };
        PacteDeSang.changerStyle('saignee');
        jouer(action(1)); o.apresSang = { voie: M.posture(ves), flux: M.flux(ves) };
        remettre(); jouer(action(1139)); jouer(action(1)); o.resteSang = { voie: M.posture(ves), flux: M.flux(ves) };

        // 3 · les verbes des arts
        PacteDeSang.changerStyle('lame'); tenir(2);
        o.tags = {};
        for (var id = 1281; id <= 1298; id++) {
            var s = $dataSkills[id], m = /<(Ouvre|Entre|Premier|Sur|Lache|Finit|Reprise|Immobile)>/.exec(s.note);
            o.tags[id] = { verbe: m ? m[1] : '', ligne: s.description.split('\n').length === 2 };
        }
        // Iaï part avant un ennemi bien plus rapide ; Taille et Talon, non
        e.addParam(6, 99999);
        function premier(id) {
            var g = new Game_Action(e); g.setGuard(); e._actions = [g];
            $gameTroop.members().forEach(function (x) { if (x !== e) { x._actions = []; } });
            $gameParty.members().forEach(function (x) { x._actions = []; });
            remettre(); ves._actions = [action(id)];
            BattleManager.makeActionOrders();
            return BattleManager._actionBattlers[0] === ves;
        }
        o.iai = premier(1283); o.iaiContre = premier(1282);
        e.addParam(6, -99999); BattleManager._actionBattlers = [];
        // le Couperet (hache) : ×1,5, et la garde lâchée
        tenir(4); remettre(); var c = jouer(action(1289)); o.couperet = { mult: c._mvtMult, lache: !!ves._lache };
        remettre(); var c2 = jouer(action(1288)); o.couperetContre = { mult: c2._mvtMult, lache: !!ves._lache };
        // Percée (lance) répétée ne s'use pas ; Balayage répété, si
        tenir(12); remettre(); jouer(action(1290)); o.percee = jouer(action(1290))._mvtMult;
        remettre(); jouer(action(1291)); o.peerceContre = jouer(action(1291))._mvtMult;
        // Saut du Héron : tout le flux dans le coup ; Percée, non
        remettre(); jouer(action(1290)); ves._mvtFlux = 2; var sh = jouer(action(1292)); o.heron = { mult: sh._mvtMult, flux: M.flux(ves) };
        remettre(); jouer(action(1291)); ves._mvtFlux = 2; var sh2 = jouer(action(1290)); o.heronContre = { mult: sh2._mvtMult, flux: M.flux(ves) };

        // 4 · la contre-attaque du Flow est une riposte
        tenir(2); PacteDeSang.changerStyle('lame');
        // le vrai chemin : l'ennemi a fini, une esquive était en attente
        remettre(); ves.addState(StylesVesper.etats.flow); ves._contreEnAttente = e;
        var forcees = []; var q = BattleManager.queueForceAction;
        BattleManager.queueForceAction = function (b, sk) { forcees.push([b === ves, sk]); };
        e.onAllActionsEnd();
        BattleManager.queueForceAction = q;
        o.chemin = { annoncee: ves._riposteForcee, forcee: forcees };
        ves.eraseState(StylesVesper.etats.flow); ves._riposteForcee = 0;
        // elle fait monter le flux, la 3ᵉ est un geste juste, et ne compte pas comme un geste de plus
        remettre(); jouer(action(1282));                      // une posture (Miroir, l'épée), flux 0 (Fil du Vent <Ouvre> en donnerait 1)
        var dernier = ves._mvtDernier, voieAvant = M.posture(ves);
        M.riposteForcee(ves, 131); var r1 = jouer(action(131, true));
        o.r1 = { flux: M.flux(ves), mult: r1._mvtMult, voie: M.posture(ves), dernier: ves._mvtDernier === dernier, voieAvant: voieAvant, riposte: !!ves._riposte, annonce: annonces().filter(function (t) { return /Contre-temps/.test(t); }) };
        M.riposteForcee(ves, 131); jouer(action(131, true));
        M.riposteForcee(ves, 131); var r3 = jouer(action(131, true));
        o.r3 = { flux: M.flux(ves), mult: r3._mvtMult, geste: annonces().some(function (t) { return /GESTE JUSTE · contre-temps/.test(t); }) };
        // « après la riposte » tient jusqu'à sa vraie action suivante, puis part
        o.apresTient = !!ves._riposte;
        jouer(action(1281)); o.apresPart = !ves._riposte;
        // sans l'annonce : un geste ordinaire (autre Voie : l'Onde), « après la riposte » ne tient pas
        remettre(); jouer(action(1281)); var n1 = jouer(action(131, true));
        o.sans = { flux: M.flux(ves), voie: M.posture(ves), dernier: ves._mvtDernier, riposte: !!ves._riposte, mult: n1._mvtMult };
        return o;
    });

    console.log('1) En Lame, la Voie de l\'arme tenue');
    var ATT = { 'épée': 'miroir', 'dague': 'eclair', 'hache': 'forge', 'lance': 'vide', 'arc': 'flash', 'gant': 'onde', 'mains nues': 'onde' };
    r.voies.forEach(function (x) {
        var a = ATT[x.arme];
        v(x.arme + ' → ' + a + ' (son art, l\'Attaque, Tranche-Néant)', (x.arme === 'mains nues' || x.art === a) && x.attaque === a && x.tn === a, JSON.stringify(x));
    });
    v('au fouet (aucune famille) : la Voie du Sang', r.fouet === 'sang', r.fouet);
    v('une Voie écrite reste la sienne (Fil Clair Éclair, Chirurgie du Vide, la contre-attaque du Flow Onde)', r.ecrite.fil === 'eclair' && r.ecrite.chirurgie === 'vide' && r.ecrite.contre === 'onde', JSON.stringify(r.ecrite));
    v('contre-épreuve : en Sang et en Garde, la Voie du Sang', r.enSang === 'sang' && r.enGarde === 'sang', r.enSang + ' · ' + r.enGarde);

    console.log('\n2) Changer de Style, c\'est changer de Voie');
    v('un art d\'épée : posture du Miroir', r.apresLame.voie === 'miroir', JSON.stringify(r.apresLame));
    v('puis en Sang, l\'Attaque : posture du Sang, et le flux monte', r.apresSang.voie === 'sang' && r.apresSang.flux === r.apresLame.flux + 1, JSON.stringify(r.apresSang));
    v('contre-épreuve : rester dans le Sang ne fait rien monter', r.resteSang.voie === 'sang' && r.resteSang.flux === 0, JSON.stringify(r.resteSang));

    console.log('\n3) Chaque art a son verbe');
    var sans = Object.keys(r.tags).filter(function (k) { return !r.tags[k].verbe || !r.tags[k].ligne; });
    v('les 18 arts portent un verbe et sa ligne de description', sans.length === 0, sans.join(',') || Object.keys(r.tags).map(function (k) { return r.tags[k].verbe; }).join(' '));
    v('Iaï part avant un ennemi bien plus rapide', r.iai);
    v('…contre-épreuve : Taille et Talon, non', !r.iaiContre);
    v('le Couperet : ×1,5, et la garde lâchée', Math.abs(r.couperet.mult - 1.5) < 0.01 && r.couperet.lache, JSON.stringify(r.couperet));
    v('…contre-épreuve : le Coup d\'Épaule, non', r.couperetContre.mult !== 1.5 && !r.couperetContre.lache, JSON.stringify(r.couperetContre));
    v('Percée répétée ne s\'use pas', r.percee >= 1, String(r.percee));
    v('…contre-épreuve : Balayage répété s\'use', r.peerceContre < 1, String(r.peerceContre));
    v('Saut du Héron met tout le flux dans le coup (flux 2 : ×1,6, flux 0)', r.heron.mult > 1.5 && r.heron.flux === 0, JSON.stringify(r.heron));
    v('…contre-épreuve : Percée garde son flux', r.heronContre.flux > 0, JSON.stringify(r.heronContre));

    console.log('\n4) La contre-attaque du Flow est une riposte');
    v('le chemin du Flow l\'annonce comme riposte, puis la force', r.chemin.annoncee === 131 && r.chemin.forcee.length === 1 && r.chemin.forcee[0][0] && r.chemin.forcee[0][1] === 131, JSON.stringify(r.chemin));
    v('elle fait monter le flux, sans changer de posture ni compter comme un geste de plus', r.r1.flux === 1 && r.r1.voie === r.r1.voieAvant && r.r1.dernier && r.r1.annonce.length > 0, JSON.stringify(r.r1));
    v('la 3ᵉ est un geste juste (×1,5)', Math.abs(r.r3.mult - 1.5) < 0.01 && r.r3.flux === 0 && r.r3.geste, JSON.stringify(r.r3));
    v('« après la riposte » tient jusqu\'à sa vraie action suivante, puis part', r.apresTient && r.apresPart);
    v('contre-épreuve : sans l\'annonce, un geste ordinaire (autre Voie, l\'Onde)', r.sans.voie === 'onde' && r.sans.dernier === 131 && !r.sans.riposte, JSON.stringify(r.sans));

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
