/*
 * BANC NAVIGATEUR — LES PEUPLES DU CHAPITRE 1 (LesPeuples.js, Parler v1.1 ; 2026-11-08)
 * ---------------------------------------------------------------------------
 * JOKO : « Fais tous les ennemis […] plus développé et original ». Chaque peuple de la page Notion
 * « Le royaume des monstres » se bat comme il vit. Ce banc essaie chaque trait dans le vrai moteur, et dans
 * les deux sens : il fait ce qu'il dit, et sans lui (autre peuple, boss, hasard contraire) il ne le fait pas.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899
 *   node bancs/navigateur/les_peuples.js
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
    await page.evaluate(function () { $gameParty.members().forEach(function (a) { a.recoverAll(); }); BattleManager.setup(7, true, true); SceneManager.push(Scene_Battle); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging() && BattleManager.isInputting(); }, null, { timeout: 120000 });

    console.log('=== LES PEUPLES ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var out = {}, hasard = 0.5;
        Math.random = function () { return hasard; };
        var H = $gameParty.members(), ves = H[0], h2 = H[1], h3 = H[2];
        var T = $gameTroop.members(), e1 = T[0], e2 = T[1], e3 = T[2];
        T.forEach(function (x) { var d = JSON.parse(JSON.stringify(x.enemy())); d.note = d.note.replace(/<\s*(Meca\w*|Phases)\s*:[^>]*>|<Boss>/gi, ''); x.enemy = function () { return d; }; x._rangEquilibre = undefined; });
        function peuple(x, cle) { x.enemy().meta.Peuple = cle; }
        function reset() {
            hasard = 0.5; $gameTroop._turnCount = 1;
            T.forEach(function (x) {
                x.appear(); x.revive(); x.clearStates(); x.clearBuffs(); x.addParam(0, 9999999 - x.mhp); x.recoverAll(); x._ctAnnonces = [];
                Object.keys(x).filter(function (k) { return /^_(humeur|couronne|colere|coups|rancune|releves|seRelever|dernierFeu|veille|recueil|vacille|refus|souvenir|pasPaye|mortVue|fondue|expFusion|nomPropre|parler)/.test(k); }).forEach(function (k) { delete x[k]; });
                peuple(x, 'aucun');
            });
            H.forEach(function (a) {
                a.recoverAll(); a.clearStates(); a.clearBuffs(); a._ctAnnonces = []; delete a._piegeGobelin; delete a._souvenirMange; delete a._derniereTechnique;
                // la posture, le flux, les ripostes armées (LeMouvement, MaitriseVoies) : un contrôle ne doit pas hériter du précédent
                Object.keys(a).filter(function (k) { return /^_(mvt|riposte|reprise|lache|leurre|contre|touche|apres|voie)/.test(k); }).forEach(function (k) { delete a[k]; });
            });
        }
        function ann(b) { return (b._ctAnnonces || []).map(function (x) { return x.texte; }); }
        function attaque(qui, cible) { var a = new Game_Action(qui); a.setAttack(); a.setTarget(cible.isActor() ? H.indexOf(cible) : cible.index()); return a; }
        function val(qui, cible) { return attaque(qui, cible).makeDamageValue(cible, false); }
        function frappe(qui, cible) { var a = attaque(qui, cible); cible.clearResult(); a.apply(cible); return cible.result(); }
        function finAction(qui) { BattleManager._subject = qui; try { BattleManager.endAction(); } catch (x) { out.erreurFin = String(x); } BattleManager._subject = null; }
        T.forEach(function (x) { x.addParam(2, 300); });
        var P = LesPeuples;

        // les noms propres
        reset(); peuple(e1, 'gelees'); peuple(e2, 'gelees'); e1.enemy().name = 'Gelée'; e2.enemy().name = 'Gelée';   // un nom propre va à qui porte le nom de son peuple
        $gameSystem._nomsDuChapitre = null;
        T.forEach(function (x) { delete x._nomPropre; });
        LesPeuples.debutDeCombat();
        out.noms = { a: e1.name(), b: e2.name(), sansPeuple: e3.name() };

        // les gelées : rouge frappe plus, bleu encaisse, l'élément change l'humeur, la teinte suit, deux de même humeur fusionnent
        reset(); peuple(e1, 'gelees');
        var base = val(e1, ves); e1._humeur = 'rouge'; var rouge = val(e1, ves);
        var recu = val(ves, e1); e1._humeur = 'bleu'; var recuBleu = val(ves, e1);
        out.gelee = { rouge: rouge / base, bleu: recuBleu / recu, teinte: e1.battlerHue() };
        var feu = new Game_Action(ves); feu.setSkill(1); feu.getItemElements = function () { return [8]; }; feu.setTarget(e1.index()); e1.clearResult(); feu.apply(e1);
        out.gelee.venue = e1._humeurVenue;
        P.debutDeTour(); out.gelee.apres = e1._humeur;
        reset(); peuple(e1, 'gelees'); peuple(e2, 'gelees'); e1._humeur = 'rose'; e2._humeur = 'rose';
        e1.setHp(1000); e2.setHp(800); P.debutDeTour();
        out.fusion = { cachee: e2.isHidden() && !e1.isHidden(), pv: e1.hp, annonces: ann(e1).concat(ann(e2)) };
        reset(); peuple(e1, 'gelees'); peuple(e2, 'gelees'); e1._humeur = 'rose'; e2._humeur = 'bleu'; P.debutDeTour();
        out.fusionNon = !e1.isHidden() && !e2.isHidden();

        // les gobelins : la couronne, le piège
        reset(); peuple(e1, 'gobelins'); peuple(e2, 'gobelins');
        var sans = val(e3, ves); e3.enemy().meta.Peuple = 'gobelins'; e3._couronne = true; var chef = val(e3, ves); e3._couronne = false; var autre = val(e3, ves);
        out.couronne = { chef: chef / sans, autre: autre / sans };
        e1._couronne = true; e1._couronneDepuis = 1; $gameTroop._turnCount = 3; P.debutDeTour();
        out.couronne.tourne = !e1._couronne && T.some(function (x) { return x._couronne; });
        reset(); ves._piegeGobelin = true; var pv = ves.hp;
        ves._actions = [new Game_Action(ves)]; ves.action(0).setAttack(); BattleManager._subject = ves; BattleManager._action = null;
        try { BattleManager.startAction(); } catch (x) { out.erreurPiege = String(x); }
        out.piege = { perdu: pv - ves.hp, effroi: ves.isStateAffected(279) };
        BattleManager._subject = null;

        // les orques : la colère dite, ou gardée
        reset(); peuple(e1, 'orques'); var b1 = val(e1, ves);
        for (var i = 0; i < 3; i++) { frappe(ves, e1); }
        out.orque = { annoncee: !!e1._colereAnnoncee }; $gameTroop._turnCount = 2; e1.makeActions();
        out.orque.dite = e1._colereDite && !e1.isStateAffected(169);
        var b2 = val(e1, ves); out.orque.calme = b2 / b1;
        reset(); peuple(e1, 'orques'); for (i = 0; i < 3; i++) { frappe(ves, e1); } frappe(ves, e1); $gameTroop._turnCount = 2; e1.makeActions();
        out.orque.gardee = e1.isStateAffected(169);

        // les farfadets : la blague, et ils se refont tant qu'on rit
        reset(); peuple(e1, 'farfadets'); $gameTroop._turnCount = 4; P.debutDeTour();
        out.farfadet = { rit: H.some(function (h) { return h.isStateAffected(167); }) };
        e1.setHp(Math.floor(e1.mhp / 2)); var hpF = e1.hp; P.finDeTour(); out.farfadet.refait = e1.hp > hpF;
        H.forEach(function (h) { h.removeState(167); }); hpF = e1.hp; P.finDeTour(); out.farfadet.sansRire = e1.hp === hpF;

        // les trolls : la rancune le relève, puis plus
        reset(); peuple(e1, 'trolls'); e1.enemy().note += '\n<Rang: D>'; e1._rangEquilibre = undefined; e1._rancune = 1;
        e1.clearResult(); e1.setHp(0); e1.addState(e1.deathStateId()); finAction(ves);
        out.troll = { releve: e1.isAlive(), rancune: e1._rancune, pv: e1.hp, etats: e1.states().map(function (s) { return s.id; }).join(',') };
        e1.clearResult(); e1.setHp(0); e1.addState(e1.deathStateId()); finAction(ves); out.troll.reste = e1.isDead();

        // les pleureuses : le cri, la Veille
        reset(); peuple(e1, 'pleureuses'); $gameTroop._turnCount = 3; P.debutDeTour();
        out.pleureuse = { accable: H.filter(function (h) { return h.isAlive(); }).every(function (h) { return h.isStateAffected(168); }) };
        e2.clearResult(); e2.setHp(0); e2.addState(e2.deathStateId()); finAction(ves); e1.makeActions();
        out.pleureuse.veille = e1._actions.length === 0;

        // les loups : la peur, le rire
        reset(); peuple(e1, 'loups');
        var calme = val(e1, ves); h2.addState(279); var peur = val(e1, ves); ves.addState(167); var rire = val(e1, ves);
        out.loup = { peur: peur / calme, rire: rire / peur };

        // les murmures : le doute ; les envies : la jalousie, pris sans payer ; les rêveurs : le sommeil, le rêve
        // (le hasard au milieu : à 0,1, le héros esquive)
        // (sur ludwing : une riposte de Vesper armée par un contrôle précédent prendrait le coup à sa place)
        reset(); peuple(e1, 'murmures'); hasard = 0.5; var rm = frappe(e1, h2); out.murmure = { doute: h2.isStateAffected(282), touche: 'utilisé ' + rm.used + ' raté ' + rm.missed + ' esquivé ' + rm.evaded + ' dégâts ' + rm.hpDamage };
        reset(); peuple(e1, 'envies'); hasard = 0.5; frappe(e1, ves); out.envie = { jaloux: ves.isStateAffected(280) };
        h2.addBuff(2, 3); ves._actions = [new Game_Action(ves)]; ves.action(0).setAttack(); BattleManager._subject = ves; BattleManager.startAction(); BattleManager._subject = null;
        out.envie.prend = ves.isBuffAffected(2) && !h2.isBuffAffected(2);
        reset(); peuple(e1, 'envies'); var avantPaye = val(e1, ves); ves._actions = [new Game_Action(ves)]; ves.action(0).setItem(1); BattleManager._subject = ves; BattleManager.startAction(); BattleManager._subject = null;
        out.envie.sansPayer = val(e1, ves) / avantPaye;
        reset(); peuple(e1, 'reveurs'); hasard = 0.45; frappe(e1, ves); out.reveur = { dort: ves.isStateAffected(19) };
        ves.setHp(Math.floor(ves.mhp / 2)); var pvR = ves.hp; P.finDeTour(); out.reveur.reve = ves.hp > pvR;
        reset(); peuple(e1, 'reveurs'); hasard = 0.9; frappe(e1, ves); out.reveur.hasard = !ves.isStateAffected(19);

        // les petits refus : « Non ! »
        reset(); peuple(e1, 'petitsrefus'); hasard = 0.1; ves.addBuff(2, 3); out.refus = { contraire: ves.isDebuffAffected(2) };
        ves.clearBuffs(); hasard = 0.9; ves.addBuff(2, 3); out.refus.sinon = ves.isBuffAffected(2);
        e2._refus = true; e2.addState(5); out.refus.protege = !e2.isStateAffected(5); e2.addState(5); out.refus.uneFois = e2.isStateAffected(5);

        // les rancœurs, les statues, les errants, les braises
        reset(); peuple(e1, 'rancoeurs'); $gameTroop._turnCount = 0; var r0 = val(e1, ves); $gameTroop._turnCount = 3; out.rancoeur = val(e1, ves) / r0;
        reset(); var st0 = val(ves, e1); peuple(e1, 'statues'); var stP = val(ves, e1); e2.hide(); e3.hide(); var stS = val(ves, e1);
        out.statue = { protegee: stP / st0, seule: stS / st0 };
        reset(); var er0 = val(ves, e1); peuple(e1, 'errants');
        var mvt = attaque(ves, e1); var art = LesTroisArts.art; LesTroisArts.art = function () { return 'mouvement'; }; var erM = mvt.makeDamageValue(e1, false);
        LesTroisArts.art = function () { return 'ecrit'; }; var erE = mvt.makeDamageValue(e1, false); LesTroisArts.art = art;
        out.errant = { mouvement: erM / er0, ecrit: erE / er0 };
        reset(); var br0 = val(ves, e1); peuple(e1, 'braises'); e1._vacille = true; out.braise = val(ves, e1) / br0;

        // les vouivres : le plus haut niveau, petit coup, grand coup
        // (le niveau maximum est 90 : les autres descendent, puis remontent)
        reset(); peuple(e1, 'vouivres'); var niveaux = H.map(function (h) { return h.level; });
        H.forEach(function (h) { if (h !== h3) { h._level = h.level - 10; } });
        var vise = attaque(e1, ves).makeTargets()[0]; out.vouivre = { vise: vise === h3, qui: vise ? vise.name() : '?' };
        H.forEach(function (h, i) { h._level = niveaux[i]; });
        var a0 = attaque(ves, e2); var petitBase = a0.makeDamageValue(e2, false);
        e1.addParam(0, 999999999); e1.recoverAll(); var petit = val(ves, e1);
        out.vouivre.petit = petit / petitBase;

        // les os-têtus : il se relève, sauf au feu ; les affamés : un souvenir mangé
        reset(); peuple(e1, 'ostetus'); e1._releves = 2; e1._dernierFeu = false; e1.clearResult(); e1.setHp(0); e1.addState(e1.deathStateId()); finAction(ves); P.finDeTour();
        out.ostetus = { releve: e1.isAlive(), seRelever: e1._seRelever, releves: e1._releves, pv: e1.hp };
        reset(); peuple(e1, 'ostetus'); e1._releves = 2; e1._dernierFeu = true; e1.clearResult(); e1.setHp(0); e1.addState(e1.deathStateId()); finAction(ves); P.finDeTour();
        out.ostetus.feu = e1.isDead();
        reset(); peuple(e1, 'affames'); ves._derniereTechnique = 3; hasard = 0.5; frappe(e1, ves);
        out.affame = { scelle: !ves.canUse($dataSkills[3]), attaque: ves.canUse($dataSkills[1]) };

        // les états d'âme : l'Effroi interdit de frapper, la Superbe refuse les soins des autres
        reset(); ves.addState(279); out.effroi = { attaque: ves.canUse($dataSkills[1]), garde: ves.canUse($dataSkills[2]) };
        reset(); ves.setHp(Math.floor(ves.mhp / 2)); ves.addState(281); var soin = new Game_Action(h2); soin.setSkill(1); var pvS = ves.hp; soin.executeHpDamage(ves, -100);
        out.superbe = { refuse: ves.hp === pvS }; var soi = new Game_Action(ves); soi.setSkill(1); soi.executeHpDamage(ves, -100); out.superbe.soi = ves.hp > pvS;

        // un boss garde sa mécanique : pas de trait
        reset(); peuple(e1, 'gelees'); e1._humeur = 'rouge'; e1.enemy().note += '\n<Boss>'; var boss = val(e1, ves); e1.enemy().note = e1.enemy().note.replace('<Boss>', ''); var pasBoss = val(e1, ves);
        out.boss = boss / pasBoss;

        // Épargner : un humain, hors du Chapitre 1
        reset(); $dataMap.meta['Chapitre 1'] = false; peuple(e1, 'humains'); peuple(e2, 'gelees');
        e1.setHp(Math.floor(e1.mhp * 0.2)); e2.setHp(Math.floor(e2.mhp * 0.2)); e1._vole = 40; $gameSystem._ethique = 0;
        var or = $gameParty.gold();
        out.epargner = { humain: Parler.parlable(e1), monstre: Parler.parlable(e2) };
        var ep = new Game_Action(ves); ep.setSkill(Parler.skillDe('epargner')); ep.setTarget(e1.index()); ep.apply(e1);
        out.epargner.rendu = e1.isHidden() && $gameParty.gold() - or === 40 && Parler.ethique() === 1;
        reset(); peuple(e1, 'humains'); e1.setHp(Math.floor(e1.mhp * 0.2));
        var mauvais = new Game_Action(ves); mauvais.setSkill(Parler.skillDe('plaisanter')); mauvais.setTarget(e1.index()); mauvais.apply(e1);
        out.epargner.plaisanter = !e1.isHidden();
        return out;
    });

    v('chaque créature d\'un peuple a un nom à elle, jamais le même', /\(Gelée\)$/.test(r.noms.a) && /\(Gelée\)$/.test(r.noms.b) && r.noms.a !== r.noms.b, r.noms.a + ' · ' + r.noms.b);
    v('contre-épreuve : sans peuple, pas de nom propre', !/\(/.test(r.noms.sansPeuple), r.noms.sansPeuple);
    v('Gelée rouge (colère) : elle frappe ×1,3', Math.abs(r.gelee.rouge - 1.3) < 0.03, r.gelee.rouge.toFixed(2));
    v('Gelée bleue (chagrin) : elle encaisse ×0,6', Math.abs(r.gelee.bleu - 0.6) < 0.03, r.gelee.bleu.toFixed(2));
    v('… sa teinte suit son humeur', r.gelee.teinte === 200, String(r.gelee.teinte));
    v('le Feu la met en colère au tour suivant', r.gelee.venue === 'rouge' && r.gelee.apres === 'rouge');
    v('deux gelées de même humeur fusionnent (la plus faible entre dans l\'autre)', r.fusion.cachee && r.fusion.pv === 1800, r.fusion.pv + ' PV · ' + r.fusion.annonces.join(' | '));
    v('contre-épreuve : d\'humeurs différentes, non', r.fusionNon);
    v('Gobelins : le chef frappe ×1,25, les autres ×1,1', Math.abs(r.couronne.chef - 1.25) < 0.03 && Math.abs(r.couronne.autre - 1.1) < 0.03, r.couronne.chef.toFixed(2) + ' / ' + r.couronne.autre.toFixed(2));
    v('… au bout de deux tours, la couronne passe à un autre', r.couronne.tourne);
    v('… le piège : le premier héros qui agit le prend (PV et Effroi)', r.piege.perdu > 0 && r.piege.effroi, (r.erreurPiege || '') + ' −' + r.piege.perdu);
    v('Orques : touché trois fois, il annonce sa colère', r.orque.annoncee);
    v('… laissée dite, il se calme (×0,8)', r.orque.dite && Math.abs(r.orque.calme - 0.8) < 0.05, r.orque.calme.toFixed(2));
    v('… interrompue, elle l\'emporte (Emporté)', r.orque.gardee);
    v('Farfadets : une blague, un héros rit', r.farfadet.rit);
    v('… tant qu\'on rit, il se refait ; sans rire, non', r.farfadet.refait && r.farfadet.sansRire);
    v('Trolls : la rancune le relève, et s\'use', r.troll.releve && r.troll.rancune === 0 && r.troll.reste, JSON.stringify(r.troll));
    v('Pleureuses : le cri accable tout le groupe', r.pleureuse.accable);
    v('… un des siens tombe : elle chante la Veille (pas d\'action)', r.pleureuse.veille);
    v('Loups-Frisson : plus forts quand quelqu\'un a peur, moins sur qui rit', r.loup.peur > 1.1 && r.loup.rire < 0.85, r.loup.peur.toFixed(2) + ' / ' + r.loup.rire.toFixed(2));
    v('Murmures : leurs coups sèment le doute', r.murmure.doute, r.murmure.touche);
    v('Envies : leurs coups rendent jaloux', r.envie.jaloux);
    v('… le jaloux prend les renforts d\'un allié', r.envie.prend);
    v('… prendre un objet devant elles les met en colère (×1,3)', Math.abs(r.envie.sansPayer - 1.3) < 0.05, r.envie.sansPayer.toFixed(2));
    v('Rêveurs : les spores endorment, et qui dort se refait', r.reveur.dort && r.reveur.reve);
    v('… contre-épreuve : un hasard contraire, il reste éveillé', r.reveur.hasard);
    v('Petits Refus : « Non ! », un renfort devient son contraire', r.refus.contraire);
    v('… contre-épreuve : un hasard contraire, le renfort reste', r.refus.sinon);
    v('… un allié protégé du prochain état, une fois', r.refus.protege && r.refus.uneFois);
    v('Rancœurs : +12 % par tour', Math.abs(r.rancoeur - 1.36) < 0.04, r.rancoeur.toFixed(2));
    v('Statues : ×0,25 tant qu\'un autre se bat, ×1,5 seules', Math.abs(r.statue.protegee - 0.25) < 0.03 && Math.abs(r.statue.seule - 1.5) < 0.05, r.statue.protegee.toFixed(2) + ' / ' + r.statue.seule.toFixed(2));
    v('Errants : un mouvement ×0,5, une rune ×1,5', Math.abs(r.errant.mouvement - 0.5) < 0.03 && Math.abs(r.errant.ecrit - 1.5) < 0.05, r.errant.mouvement.toFixed(2) + ' / ' + r.errant.ecrit.toFixed(2));
    v('Braises : quand elle vacille, presque rien (×0,2)', Math.abs(r.braise - 0.2) < 0.03, r.braise.toFixed(2));
    v('Vouivres : elles visent le plus haut niveau', r.vouivre.vise, r.vouivre.qui);
    v('… un petit coup ne les touche qu\'à moitié', Math.abs(r.vouivre.petit - 0.5) < 0.05, r.vouivre.petit.toFixed(2));
    v('Os-Têtus : il se relève ; au Feu ou à la Lumière, non', r.ostetus.releve && r.ostetus.feu, JSON.stringify(r.ostetus));
    v('Affamés : la dernière technique est mangée, l\'Attaque reste', r.affame.scelle && r.affame.attaque);
    v('Effroi : il ne peut pas attaquer, il peut se garder', !r.effroi.attaque && r.effroi.garde);
    v('Superbe : il refuse les soins des autres, pas les siens', r.superbe.refuse && r.superbe.soi);
    v('contre-épreuve : un boss garde sa mécanique (pas de trait de peuple)', Math.abs(r.boss - 1 / 1.3) < 0.03, r.boss.toFixed(2));
    v('Épargner : hors du Chapitre 1, un humain s\'écoute, une gelée non', r.epargner.humain && !r.epargner.monstre);
    v('… il se rend, rend ce qu\'il a volé, l\'éthique monte', r.epargner.rendu);
    v('… contre-épreuve : « Plaisanter » ne le fait pas se rendre', r.epargner.plaisanter);
    v('aucune erreur dans le jeu', err.length === 0 && !r.erreurFin, err.slice(0, 4).join(' | ') + (r.erreurFin || ''));
    console.log('\n' + ok + ' OK, ' + ko + ' KO');
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
