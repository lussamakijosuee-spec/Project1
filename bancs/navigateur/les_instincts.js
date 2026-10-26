/*
 * BANC NAVIGATEUR — L'INSTINCT DES ENNEMIS (LesInstincts.js, 2026-10-26)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-26 : « on passe au ennemis maintenant refait un rework » —
 * « Tous les 549 », « Une mécanique par ennemi ». Chaque instinct vient de la
 * phrase de sa famille ou de la Bible (les Sentinelles apprennent, les Loups
 * d'étoiles chassent en meute, les Revenants reviennent…).
 *
 * Ce banc vérifie chaque instinct dans le vrai moteur, et dans les deux sens :
 * il fait ce qu'il dit, et un ennemi sans lui ne le fait pas.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/les_instincts.js
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

    await page.goto(BASE + '/index.html', { waitUntil: 'load', timeout: 120000 });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen(); }, null, { timeout: 180000 });
    await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.evaluate(function () {
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
    });
    // sur un PC chargé, l'ouverture du combat se perd parfois : on la redemande
    for (var essai = 0; essai < 4; essai++) {
        try {
            await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
            break;
        } catch (x) {
            if (essai === 3) { throw x; }
            await page.evaluate(function () { if (!(SceneManager._scene instanceof Scene_Battle)) { BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle); } });
        }
    }
    await page.waitForTimeout(2500);

    console.log('=== L\'INSTINCT DES ENNEMIS ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var out = {}, hasard = 0.5;
        Math.random = function () { return hasard; };
        var ves = $gameActors.actor(1), kor = $gameActors.actor(2), lud = $gameActors.actor(3);
        var T = $gameTroop.members(), e = T[0], e2 = T[1];
        // chaque ennemi a sa propre fiche, pour lui donner son instinct sans toucher à l'autre
        T.forEach(function (x) { var d = JSON.parse(JSON.stringify(x.enemy())); x.enemy = function () { return d; }; });
        function inst(x, nom) { x.enemy().meta.Instinct = nom; }
        function remettre() {
            hasard = 0.5;
            T.forEach(function (x) {
                inst(x, ''); x.revive(); x.clearStates(); x.clearBuffs(); x.addParam(0, 9999999 - x.mhp); x.recoverAll(); x._ctAnnonces = [];
                if (!x._atkBanc) { x._atkBanc = true; x.addParam(2, 400); }    // des coups assez forts pour lire les rapports
                ['_rancoeur', '_cibleRancoeur', '_appris', '_vole', '_revenu', '_revientAFaire', '_mirage', '_mirageRetour', '_embuscade', '_explose',
                 '_meuteTombee', '_reprend', '_arracheA', '_compteElan', '_elanConsomme', '_mSh', '_sh'].forEach(function (k) { delete x[k]; });
                x.show && x.show(); x.appear && x.appear();
            });
            $gameParty.members().forEach(function (a) { a.recoverAll(); a.clearBuffs(); a.clearStates(); a._ctAnnonces = []; a._ecrits = []; });
        }
        function annonces(b) { return (b._ctAnnonces || []).map(function (x) { return x.texte; }); }
        function attaque(qui, cible) { var a = new Game_Action(qui); a.setAttack(); if (cible.isActor()) { a.setTarget($gameParty.members().indexOf(cible)); } else { a.setTarget(cible.index()); } return a; }
        function coup(qui, cible) { var a = attaque(qui, cible); cible.clearResult(); a.apply(cible); return cible.result().hpDamage; }
        function valeur(qui, cible) { return attaque(qui, cible).makeDamageValue(cible, false); }
        function competence(qui, id, cible) { var a = new Game_Action(qui); a.setSkill(id); a.setTarget(cible.isActor() ? $gameParty.members().indexOf(cible) : cible.index()); return a; }
        function finAction(qui) { BattleManager._subject = qui; try { BattleManager.endAction(); } catch (x) { out.erreurFin = String(x); } BattleManager._subject = null; }

        out.base = { liste: LesInstincts.LISTE.length, etats: [261, 262, 263, 264, 265].map(function (i) { return $dataStates[i].name; }),
                     plugin: $plugins.filter(function (p) { return p.name === 'LesInstincts'; })[0].status };

        // meute : « quand l'une tombe, les autres s'énervent »
        remettre(); inst(e, 'meute'); inst(e2, 'meute');
        var m0 = valeur(e, ves); e2.addState(e2.deathStateId()); var m1 = valeur(e, ves);
        inst(e, ''); var m2 = valeur(e, ves);
        out.meute = { vivante: m0, tombee: m1, sans: m2 };
        // essaim : « individuellement, rien »
        remettre(); inst(e, 'essaim'); inst(e2, 'essaim');
        var s0 = valeur(e, ves); e2.addState(e2.deathStateId()); var s1 = valeur(e, ves);
        out.essaim = { ensemble: s0, seul: s1 };
        // charge : l'élan tous les 3 tours, ×2 ; un gros coup le brise
        remettre(); inst(e, 'charge');
        var c0 = valeur(e, ves);
        e.makeActions(); e.makeActions(); var avant = e.numActions(); e.makeActions();
        out.charge = { avantElan: avant, elan: e.isStateAffected(261), actions: e.numActions(), x2: valeur(e, ves) / c0 };
        e.clearResult(); competence(ves, 1, e).executeDamage(e, Math.ceil(e.mhp * 0.16));
        out.charge.brise = !e.isStateAffected(261);
        e.clearResult(); e.addState(261); competence(ves, 1, e).executeDamage(e, 1); out.charge.petitCoup = e.isStateAffected(261);
        // vole : il prend de l'or, fuit bas, rend tout s'il tombe
        remettre(); inst(e, 'vole'); $gameParty.gainGold(1000);
        var or0 = $gameParty.gold(); coup(e, ves); var or1 = $gameParty.gold();
        out.vole = { pris: or0 - or1, garde: e._vole };
        e.setHp(Math.floor(e.mhp * 0.2)); finAction(e); out.vole.fuit = e.isHidden();
        remettre(); inst(e, 'vole'); or0 = $gameParty.gold(); coup(e, ves); e.addState(e.deathStateId()); out.vole.rendu = $gameParty.gold() === or0;
        // revient : la première fois, il se relève à 30 %
        remettre(); inst(e, 'revient');
        var a = competence(ves, 1, e); e.clearResult(); a.executeDamage(e, e.hp + 100);
        out.revient = { tenu: e.hp }; finAction(ves);
        out.revient.releve = Math.round(e.hp / e.mhp * 100); out.revient.annonce = annonces(e).some(function (t) { return /revient/.test(t); });
        a = competence(ves, 1, e); e.clearResult(); a.executeDamage(e, e.hp + 100); out.revient.secondeFois = e.hp;
        remettre(); a = competence(ves, 1, e); e.clearResult(); a.executeDamage(e, e.hp + 100); out.revient.sans = e.hp;
        // apprend : une technique déjà reçue ×0,7, ×0,49, jamais moins que ×0,4
        // (un témoin sans l'instinct reçoit la même suite : ce que le reste du jeu change d'un coup à l'autre s'annule)
        remettre(); inst(e, 'apprend');
        var sk = 1, ap = [];
        for (var i = 0; i < 4; i++) {
            var ac = competence(ves, sk, e), at = competence(ves, sk, e2);
            ap.push(ac.makeDamageValue(e, false) / at.makeDamageValue(e2, false));
            e.clearResult(); ac.apply(e); e2.clearResult(); at.apply(e2); e.recoverAll(); e2.recoverAll();
        }
        out.apprend = { suite: ap.map(function (x) { return Math.round(x / ap[0] * 100) / 100; }) };
        var autre = competence(ves, 1186, e); out.apprend.autre = autre.makeDamageValue(e, false) > 0 && !(e._appris || {})[1186];
        // rancœur : +10 % par coup, il vise celui qui l'a frappé
        remettre(); inst(e, 'rancoeur');
        var r0 = valeur(e, ves); coup(kor, e); coup(kor, e); var r1 = valeur(e, ves);
        out.rancoeur = { x: Math.round(r1 / r0 * 100) / 100, etat: e.isStateAffected(262), chiffre: e.getStateCounter ? e.getStateCounter(262) : null,
                         vise: attaque(e, ves).makeTargets()[0] === kor };
        // mirage : esquive, dissipé au premier coup
        remettre(); inst(e, 'mirage'); e.addState(263); e._mirage = true;
        out.mirage = { esquive: e.eva };
        var am = competence(ves, 1, e); e.clearResult(); am.executeDamage(e, 10); e.onDamage(10);
        am.executeDamage(e, 1);
        out.mirage.dissipe = !e.isStateAffected(263) && annonces(e).some(function (t) { return /dissipe/.test(t); });
        // dévore : il reprend 30 % de ce qu'il fait
        remettre(); inst(e, 'devore'); e.setHp(Math.floor(e.mhp / 2)); var hpD = e.hp;
        // (sur Vesper, sa Voie du Miroir renverrait le coup : on mesure sur ludwing)
        var dv = coup(e, lud); out.devore = { pris: e.hp - hpD, attendu: Math.round(dv * 0.3) };
        // chair vive : qui le frappe au corps reprend 20 %
        remettre(); inst(e, 'epines'); var pv = ves.hp; var ep = coup(ves, e);
        out.epines = { perdu: pv - ves.hp, attendu: Math.round(ep * 0.2) };
        // chœur : ses alliés frappent ×1,1
        remettre(); inst(e2, 'choeur'); var ch0 = valeur(e, ves); remettre(); var ch1 = valeur(e, ves);
        out.choeur = { x: Math.round(ch0 / ch1 * 100) / 100 };
        // reflet : 50 % reviennent, sauf sur sa faiblesse
        remettre(); inst(e, 'reflet'); pv = ves.hp; var rf = coup(ves, e);
        out.reflet = { perdu: pv - ves.hp, attendu: Math.round(rf * 0.5) };
        var faible = []; for (var el = 1; el <= 30; el++) { faible.push({ code: 11, dataId: el, value: 2 }); }   // faible à tout
        var traits0 = e.enemy().traits; e.enemy().traits = traits0.concat(faible);
        pv = ves.hp; coup(ves, e); out.reflet.surFaiblesse = pv - ves.hp;
        e.enemy().traits = traits0;
        // carapace : ÷2 tant qu'il a plus de la moitié de ses PV (sans bouclier), puis plus
        remettre(); var ca1 = valeur(ves, e); inst(e, 'carapace'); e._mSh = 0; var ca0 = valeur(ves, e);
        e.setHp(Math.floor(e.mhp * 0.4)); var ca2 = valeur(ves, e);
        e._mSh = 3; e._sh = 0; e.setHp(e.mhp); var ca3 = valeur(ves, e);
        out.carapace = { tient: Math.round(ca0 / ca1 * 100) / 100, craque: Math.round(ca2 / ca1 * 100) / 100, briseBouclier: Math.round(ca3 / ca1 * 100) / 100 };
        // explose : à sa mort, chaque héros perd 10 % de ses PV max
        remettre(); inst(e, 'explose'); pv = ves.hp; e.addState(e.deathStateId()); finAction(ves);
        out.explose = { perdu: pv - ves.hp, attendu: Math.round(ves.mhp * 0.1) };
        remettre(); pv = ves.hp; e.addState(e.deathStateId()); finAction(ves); out.explose.sans = pv - ves.hp;
        // embuscade : au premier tour, avant tout le monde, sur le plus faible, ×1,5
        remettre(); inst(e2, 'embuscade'); kor.setHp(Math.floor(kor.mhp * 0.2));
        var t0 = $gameTroop._turnCount; $gameTroop._turnCount = 1;
        BattleManager._actionBattlers = []; BattleManager.makeActionOrders();
        out.embuscade = { premier: BattleManager._actionBattlers[0] === e2, vise: attaque(e2, ves).makeTargets()[0] === kor };
        var eb0 = valeur(e2, ves); e2._embuscade = false; var eb1 = valeur(e2, ves);
        out.embuscade.x = Math.round(eb0 / eb1 * 100) / 100;
        $gameTroop._turnCount = t0; BattleManager._actionBattlers = [];
        // frénésie : sous 50 %, deux actions
        remettre(); inst(e, 'frenesie'); e.setHp(Math.floor(e.mhp * 0.4)); finAction(ves);
        out.frenesie = { etat: e.isStateAffected(264), plus: e.actionPlusSet ? e.actionPlusSet().length : null };
        remettre(); inst(e, 'frenesie'); e.setHp(Math.floor(e.mhp * 0.6)); finAction(ves); out.frenesie.auDessus = e.isStateAffected(264);
        // venin, brûlure
        remettre(); inst(e, 'venin'); hasard = 0.1; coup(e, ves); out.venin = { saigne: ves.isStateAffected(17) };
        remettre(); inst(e, 'venin'); hasard = 0.9; coup(e, ves); out.venin.chanceContre = ves.isStateAffected(17);
        remettre(); inst(e, 'brule'); coup(e, ves); out.brule = ves.isStateAffected(18);
        // garde : il prend le coup visé sur un allié affaibli
        remettre(); inst(e, 'garde'); e2.setHp(Math.floor(e2.mhp * 0.3));
        out.garde = { prend: attaque(ves, e2).makeTargets()[0] === e };
        e2.setHp(e2.mhp); out.garde.allieSain = attaque(ves, e2).makeTargets()[0] === e2;
        // marque : le héros repéré prend plus
        remettre(); var mk0 = valeur(e2, ves); inst(e, 'marque'); coup(e, ves); var mk1 = valeur(e2, ves);
        out.marque = { repere: ves.isStateAffected(265), x: Math.round(mk1 / mk0 * 100) / 100 };
        // reprend : la dernière technique qu'on lui a portée, il la renvoie à qui l'a lancée
        remettre(); inst(e, 'reprend'); var ar = competence(lud, 1186, e); e.clearResult(); ar.apply(e);
        e.makeActions(); var act0 = e.action(0);
        out.reprend = { competence: act0 && act0.item() && act0.item().id, cible: act0 && act0.makeTargets()[0] === lud };
        // corrige : une rune effacée, sinon un renfort
        remettre(); inst(e, 'corrige'); ves._ecrits = [{ cible: e2, competence: 158 }, { cible: e2, competence: 158 }];
        coup(e, ves); out.corrige = { runes: ves._ecrits.length };
        ves._ecrits = []; ves.addBuff(2, 3); coup(e, ves); out.corrige.renfort = ves.isBuffAffected(2);
        // arrache : il prend de l'attaque, il la rend en tombant
        remettre(); inst(e, 'arrache'); coup(e, ves);
        out.arrache = { prise: ves.isDebuffAffected(2), gardee: e.isBuffAffected(2) };
        e.addState(e.deathStateId()); out.arrache.rendue = !ves.isDebuffAffected(2);
        // repare : 6 % de PV à chaque fin de tour (fin de tour jouée à la main)
        remettre(); inst(e, 'repare'); e.setHp(Math.floor(e.mhp / 2)); var rp0 = e.hp;
        try { BattleManager.endTurn(); } catch (x) { out.erreurTour = String(x); }
        out.repare = { gagne: e.hp - rp0, attendu: Math.round(e.mhp * 0.06) };
        remettre();
        return out;
    });

    console.log('0) La base');
    v('le greffon est allumé, 24 instincts, les états 261-265', r.base.plugin && r.base.liste === 24 && r.base.etats.every(Boolean), JSON.stringify(r.base));
    console.log('\n1) Les instincts');
    v('meute : rien tant que la meute est entière, ×1,2 quand l\'une tombe ; sans meute, rien', r.meute.vivante === r.meute.sans && Math.abs(r.meute.tombee / r.meute.vivante - 1.2) < 0.02, JSON.stringify(r.meute));
    v('essaim : ×1,1 avec un autre membre vivant, rien seul', Math.abs(r.essaim.ensemble / r.essaim.seul - 1.1) < 0.02, JSON.stringify(r.essaim));
    v('charge : au 3ᵉ tour il prend son élan (aucune action, l\'état), puis ×2', r.charge.avantElan > 0 && r.charge.elan && r.charge.actions === 0 && Math.abs(r.charge.x2 - 2) < 0.02, JSON.stringify(r.charge));
    v('…un coup de 16 % de ses PV brise l\'élan ; un petit coup, non', r.charge.brise && r.charge.petitCoup);
    v('vole : son coup prend de l\'or, sous 30 % il fuit, tombé il rend tout', r.vole.pris > 0 && r.vole.garde === r.vole.pris && r.vole.fuit && r.vole.rendu, JSON.stringify(r.vole));
    v('revient : il refuse de tomber (1 PV), se relève à 30 %, une fois ; sans l\'instinct, il tombe', r.revient.tenu === 1 && r.revient.releve === 30 && r.revient.annonce && r.revient.secondeFois === 0 && r.revient.sans === 0, JSON.stringify(r.revient));
    v('apprend : ×1, ×0,7, ×0,49, ×0,4 au plus bas ; une autre technique, entière', JSON.stringify(r.apprend.suite) === '[1,0.7,0.49,0.4]' && r.apprend.autre, JSON.stringify(r.apprend));
    v('rancœur : deux coups ×1,2, l\'état et son chiffre, il vise Korrah qui l\'a frappé', Math.abs(r.rancoeur.x - 1.2) <= 0.02 && r.rancoeur.etat && r.rancoeur.chiffre === 2 && r.rancoeur.vise, JSON.stringify(r.rancoeur));
    v('mirage : +40 % d\'esquive, dissipé au premier coup', r.mirage.esquive >= 0.4 && r.mirage.dissipe, JSON.stringify(r.mirage));
    v('dévore : il reprend 30 % de ce qu\'il fait', r.devore.pris > 0 && Math.abs(r.devore.pris - r.devore.attendu) <= 1, JSON.stringify(r.devore));
    v('chair vive : qui le frappe au corps reprend 20 %', r.epines.perdu > 0 && Math.abs(r.epines.perdu - r.epines.attendu) <= 1, JSON.stringify(r.epines));
    v('chœur : ses alliés frappent ×1,1', Math.abs(r.choeur.x - 1.1) <= 0.02, JSON.stringify(r.choeur));
    v('reflet : 50 % reviennent ; sur sa faiblesse, rien', Math.abs(r.reflet.perdu - r.reflet.attendu) <= 1 && r.reflet.surFaiblesse === 0, JSON.stringify(r.reflet));
    v('carapace : ÷2 au-dessus de la moitié, entière en dessous, entière quand son bouclier est brisé', r.carapace.tient === 0.5 && r.carapace.craque === 1 && r.carapace.briseBouclier === 1, JSON.stringify(r.carapace));
    v('explose : à sa mort, chaque héros perd 10 % ; sans l\'instinct, rien', Math.abs(r.explose.perdu - r.explose.attendu) <= 1 && r.explose.sans === 0, JSON.stringify(r.explose));
    v('embuscade : au premier tour il part le premier, sur le plus faible, ×1,5', r.embuscade.premier && r.embuscade.vise && Math.abs(r.embuscade.x - 1.5) <= 0.02, JSON.stringify(r.embuscade));
    v('frénésie : sous 50 %, l\'état et une action de plus ; au-dessus, rien', r.frenesie.etat && r.frenesie.plus > 0 && !r.frenesie.auDessus, JSON.stringify(r.frenesie));
    v('venin : il fait saigner (hasard pour) ; pas quand le hasard est contre', r.venin.saigne && !r.venin.chanceContre, JSON.stringify(r.venin));
    v('brûle : ses coups brûlent', r.brule === true);
    v('garde : il prend le coup visé sur un allié affaibli ; pas sur un allié en forme', r.garde.prend && r.garde.allieSain, JSON.stringify(r.garde));
    v('marque : le héros est repéré, et un autre ennemi le frappe ×1,3', r.marque.repere && Math.abs(r.marque.x - 1.3) <= 0.02, JSON.stringify(r.marque));
    v('reprend : il renvoie à ludwing la Parole qu\'il lui a portée', r.reprend.competence === 1186 && r.reprend.cible, JSON.stringify(r.reprend));
    v('corrige : une rune effacée du cercle ; sans rune, un renfort', r.corrige.runes === 1 && !r.corrige.renfort, JSON.stringify(r.corrige));
    v('arrache : il prend de l\'attaque et se la recoud ; tombé, il rend', r.arrache.prise && r.arrache.gardee && r.arrache.rendue, JSON.stringify(r.arrache));
    v('répare : 6 % de ses PV à la fin du tour', Math.abs(r.repare.gagne - r.repare.attendu) <= 1, JSON.stringify(r.repare) + (r.erreurTour ? ' ' + r.erreurTour : ''));
    v('aucune erreur dans la page', err.length === 0 && !r.erreurFin, (err.slice(0, 3).join(' · ') + ' ' + (r.erreurFin || '')).trim());
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
