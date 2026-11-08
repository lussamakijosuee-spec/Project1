/*
 * BANC NAVIGATEUR — PARLER (Parler.js, 2026-11-08)
 * ---------------------------------------------------------------------------
 * La Bible de JOKO, « Le Chapitre 1 dans le jeu » : au Chapitre 1, chaque adversaire est quelqu'un,
 * la commande Parler s'ajoute à Attaquer. Tranché avec le jeu : elle s'ouvre quand l'adversaire baisse
 * sa garde (bouclier brisé ou sous un seuil de PV). JOKO : « Par carte » — une carte <Chapitre 1>.
 *
 * Deux parties :
 *   1. le vrai combat, saisi par les fenêtres : Parler → une approche → un ennemi, le tour joué par le
 *      moteur, l'orque apaisé s'en va ; jamais deux fenêtres de saisie actives ;
 *   2. les règles, dans les deux sens : le peuple par le nom (et pas « Sorcier »), la carte, la garde,
 *      la bonne et la mauvaise approche, le rang, le boss, la fuite, frapper garde baissée, Impressionner,
 *      Offrir, l'expérience sans l'or.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/parler.js
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

    async function combat(troupe) {
        await page.evaluate(function (t) {
            $dataMap.meta['Chapitre 1'] = true;     // la carte du banc devient une carte du Chapitre 1
            $gameParty.members().forEach(function (a) { a.recoverAll(); });
            BattleManager.setup(t, true, true);
            if (SceneManager._scene instanceof Scene_Battle) { SceneManager.goto(Scene_Battle); } else { SceneManager.push(Scene_Battle); }
        }, troupe);
        for (var essai = 0; essai < 4; essai++) {
            try {
                await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
                break;
            } catch (x) {
                if (essai === 3) { throw x; }
                await page.evaluate(function (t) { if (!(SceneManager._scene instanceof Scene_Battle)) { BattleManager.setup(t, true, true); SceneManager.push(Scene_Battle); } }, troupe);
            }
        }
        await page.waitForFunction(function () { return BattleManager.isInputting() && BattleManager.actor() && SceneManager._scene._actorCommandWindow.active; }, null, { timeout: 90000 });
    }

    console.log('=== PARLER ===\n');
    console.log('— 1. Le vrai combat (troupe 5 : deux Orcs)');
    await combat(5);
    var r1 = await page.evaluate(function () {
        var s = SceneManager._scene, out = {};
        var T = $gameTroop.members(), o1 = T[0], o2 = T[1];
        o1.setHp(Math.floor(o1.mhp * 0.25));          // il baisse sa garde
        o2.addParam(0, 999999); o2.recoverAll();
        $gameParty.members().forEach(function (a) { a.addParam(3, 99999); a.recoverAll(); });   // personne ne tombe
        o1._ctAnnonces = [];
        // refaire les ordres : la garde vient de baisser
        s._actorCommandWindow.setup(BattleManager.actor());
        var cmd = s._actorCommandWindow, i = cmd.findSymbol('parler');
        out.commande = i >= 0; out.active = i >= 0 && cmd.isCommandEnabled(i);
        function actives() {
            return ['_actorCommandWindow', '_skillWindow', '_itemWindow', '_enemyWindow', '_actorWindow', '_parlerWindow', '_partyCommandWindow']
                .filter(function (k) { return s[k] && s[k].active; });
        }
        cmd.select(i); cmd.processOk();
        out.apresParler = actives();
        var w = s._parlerWindow;
        w.select(w.findSymbol('plaisanter')); w.processOk();
        out.apresApproche = actives();
        // l'orque à pleins PV n'écoute pas : on reste sur le choix de la cible
        s._enemyWindow.select(1); s._enemyWindow.processOk();
        out.refusPleinsPV = actives();
        s._enemyWindow.processCancel();
        out.apresAnnuler = actives();
        w.select(w.findSymbol('ecouter')); w.processOk();
        s._enemyWindow.select(0); s._enemyWindow.processOk();
        out.approcheChoisie = (function () { var a = BattleManager.actor(); return a ? null : 'fini'; })();
        // les autres héros se gardent
        var garde = 0;
        while (BattleManager.isInputting() && BattleManager.actor() && garde++ < 8) { var c = s._actorCommandWindow, g = c.findSymbol('guard'); if (g < 0) { BattleManager.inputtingAction().setGuard(); s.selectNextCommand(); } else { c.select(g); c.processOk(); } }
        out.activesFin = actives();
        out.tourLance = !BattleManager.isInputting();
        out.actions = $gameParty.members().map(function (a) { var x = a.action(0); return a.name() + ':' + (x && x.item() ? x.item().name + '>' + x._targetIndex : '-'); });
        out.phase = BattleManager._phase;
        return out;
    });
    v('la commande « 💬 Parler » est dans les ordres', r1.commande);
    v('… et ouverte : un Orc a baissé sa garde', r1.active);
    v('Parler ouvre la liste des approches, seule active', r1.apresParler.join() === '_parlerWindow', r1.apresParler.join());
    v('une approche choisie : seul le choix de la cible est actif', r1.apresApproche.join() === '_enemyWindow', r1.apresApproche.join());
    v('un Orc à pleins PV refuse la cible, on reste sur la cible', r1.refusPleinsPV.join() === '_enemyWindow', r1.refusPleinsPV.join());
    v('annuler la cible revient aux approches', r1.apresAnnuler.join() === '_parlerWindow', r1.apresAnnuler.join());
    v('le tour part, aucune fenêtre de saisie active', r1.tourLance && !r1.activesFin.length, r1.activesFin.join() + ' ' + r1.phase + ' · ' + r1.actions.join(' | '));
    try {
        await page.waitForFunction(function () { var o = $gameTroop.members()[0]; return o._parlerParti || BattleManager.isInputting(); }, null, { timeout: 180000 });
    } catch (x) { }
    var r1b = await page.evaluate(function () {
        var o = $gameTroop.members()[0];
        var s = SceneManager._scene; return { etat: JSON.stringify({ actives: ['_actorCommandWindow','_skillWindow','_enemyWindow','_actorWindow','_parlerWindow','_partyCommandWindow','_itemWindow'].filter(function(k){return s[k]&&s[k].active;}), busy: s.isBusy && s.isBusy(), log: s._logWindow && s._logWindow.isBusy(), sujet: BattleManager._subject && BattleManager._subject.name(), action: BattleManager._action && BattleManager._action.item() && BattleManager._action.item().name, anim: s._spriteset && s._spriteset.isAnimationPlaying(), effet: s._spriteset && s._spriteset.isEffecting(), attente: BattleManager._logWindow && BattleManager._logWindow._waitMode, msg: $gameMessage.isBusy(), yep: BattleManager._phase + '/' + (BattleManager._actionList||[]).length }), phase: BattleManager._phase, tours: $gameTroop.turnCount(), log: (window._parlerLog||[]).join(';'), parti: o._parlerParti || null, cache: o.isHidden(), vivant: o.isAlive(), rep: Parler.reputation('orques'),
                 annonces: (o._ctAnnonces || []).map(function (x) { return x.texte; }) };
    });
    v('le moteur joue « Écouter » : l\'Orc se calme et s\'en va', r1b.parti === 'calme' && r1b.cache && !r1b.vivant, r1b.parti + ' · ' + r1b.annonces.join(' | ') + ' · phase ' + r1b.phase + ' tour ' + r1b.tours + ' ' + r1b.log + ' ' + r1b.etat);
    v('la réputation des Orques monte', r1b.rep === 1, String(r1b.rep));

    await page.waitForTimeout(1000);

    console.log('\n— 2. Les règles (troupe 7 : l\'Ogre et deux Orcs)');
    await combat(7);
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var out = {}, hasard = 0.99;
        Math.random = function () { return hasard; };
        $gameSystem._reputationPeuples = {}; $gameSystem._ethique = 0;
        var ves = $gameActors.actor(1);
        var T = $gameTroop.members();
        T.forEach(function (x) { var d = JSON.parse(JSON.stringify(x.enemy())); x.enemy = function () { return d; }; x._rangEquilibre = undefined; });
        var ogre = T[0], o1 = T[1], o2 = T[2];
        function remettre(x) { x.appear(); x.revive(); x.clearStates(); x.recoverAll(); delete x._parler; delete x._parlerParti; delete x._parlerSeSait; delete x._parlerGrosCoup; delete x._parlerCadeau; x._ctAnnonces = []; }
        function annonces(b) { return (b._ctAnnonces || []).map(function (x) { return x.texte; }); }
        function parle(cle, cible) { var a = new Game_Action(ves); a.setSkill(Parler.skillDe(cle)); a.setTarget(cible.index()); a.apply(cible); }
        // la lecture par le nom : une fiche sans <Peuple:> (depuis l'étape 2, les fiches portent leur peuple)
        function enemyById(id) { var e = new Game_Enemy(id, 0, 0); var d = JSON.parse(JSON.stringify(e.enemy())); delete d.meta.Peuple; delete d.meta.Monde; e.enemy = function () { return d; }; return e; }

        // les six approches sont des compétences en mémoire, lues par le moteur
        out.skills = Parler.APPROCHES.map(function (a) { var s = $dataSkills[Parler.skillDe(a.cle)]; return s && s.meta.Parler && s.meta.Parler.trim() === a.cle ? s.name : null; });
        // le peuple, par un mot entier du nom
        out.peuples = { orc: (Parler.peuple(o1) || {}).cle, ogre: Parler.peuple(ogre), slime: (Parler.peuple(enemyById(6)) || {}).cle,
                        harpie: (Parler.peuple(enemyById(50)) || {}).cle, sorcier: Parler.peuple(enemyById(58)), thanatos: Parler.peuple(enemyById(828)),
                        squelette: Parler.parlable(enemyById(48)) };
        // la carte
        $dataMap.meta['Chapitre 1'] = false;
        out.horsChapitre = { parlable: Parler.parlable(o1) };
        var cmd = new Window_ActorCommand(); cmd.setup(ves); out.horsChapitre.commande = cmd.findSymbol('parler');
        $dataMap.meta['Chapitre 1'] = true;
        cmd.setup(ves); var ic = cmd.findSymbol('parler');
        out.pleinsPV = { commande: ic, ouverte: ic >= 0 && cmd.isCommandEnabled(ic), garde: Parler.gardeBaissee(o1) };
        // la garde : brisé, ou sous 30 %
        o1.addState(o1.etatDeBrise()); out.brise = Parler.gardeBaissee(o1); o1.removeState(o1.etatDeBrise());
        o1.setHp(Math.floor(o1.mhp * 0.29)); out.sous30 = Parler.gardeBaissee(o1);
        cmd.setup(ves); out.commandeOuverte = cmd.isCommandEnabled(cmd.findSymbol('parler'));
        o1.setHp(Math.floor(o1.mhp * 0.31)); out.au31 = Parler.gardeBaissee(o1);

        // la mauvaise approche : il refuse, s'énerve, l'indice de son peuple
        remettre(o1); o1.setHp(Math.floor(o1.mhp * 0.25));
        var a = new Game_Action(o1); a.setAttack(); var avant = a.makeDamageValue(ves, false);
        parle('plaisanter', o1);
        var apres = a.makeDamageValue(ves, false);
        out.refus = { colere: o1._parler.colere, annonces: annonces(o1), rapport: avant ? apres / avant : 0, present: o1.isAlive() };

        // la bonne : rang D, une seule suffit — il se calme, rapporte son expérience, pas son or
        var expAvant = $gameTroop.expTotal(), orAvant = $gameTroop.goldTotal();
        parle('ecouter', o1);
        out.calme = { parti: o1._parlerParti, cache: o1.isHidden(), rep: Parler.reputation('orques'),
                      exp: $gameTroop.expTotal() - expAvant, expOrc: o1.exp(), or: $gameTroop.goldTotal() - orAvant, annonces: annonces(o1) };

        // rang C : deux bonnes réponses
        remettre(o2); o2.enemy().note = o2.enemy().note.replace(/<Rang:[^>]*>/i, '') + '\n<Rang: C>'; o2._rangEquilibre = undefined;
        o2.setHp(Math.floor(o2.mhp * 0.2));
        parle('ecouter', o2);
        out.rangC = { besoin: Parler.besoin(o2), present: o2.isAlive(), annonces: annonces(o2) };
        parle('ecouter', o2);
        out.rangC.apres = o2._parlerParti;

        // la fuite : apaisé sous 10 %, ni réputation ni expérience
        remettre(o2); o2.enemy().note = o2.enemy().note.replace(/<Rang:[^>]*>/i, '<Rang: D>'); o2._rangEquilibre = undefined;
        var rep = Parler.reputation('orques'); expAvant = $gameTroop.expTotal();
        o2.setHp(Math.max(1, Math.floor(o2.mhp * 0.05)));
        parle('ecouter', o2);
        out.fuite = { parti: o2._parlerParti, cache: o2.isHidden(), rep: Parler.reputation('orques') - rep, exp: $gameTroop.expTotal() - expAvant };

        // un boss n'a pas Parler
        remettre(o2); o2.enemy().note += '\n<Phases: 2>';
        o2.setHp(Math.floor(o2.mhp * 0.2));
        out.boss = { parlable: Parler.parlable(o2), garde: Parler.gardeBaissee(o2) };
        parle('ecouter', o2);
        out.boss.parti = o2._parlerParti || null;
        o2.enemy().note = o2.enemy().note.replace('<Phases: 2>', '');

        // le frapper garde baissée : ça se sait, une fois
        // (le hasard du banc au milieu : le coup touche, sans critique)
        hasard = 0.5;
        remettre(o2); $gameSystem._ethique = 0; rep = Parler.reputation('orques');
        o2.addParam(0, 99999); o2.recoverAll(); o2.setHp(Math.floor(o2.mhp * 0.25));
        var at = new Game_Action(ves); at.setAttack(); at.setTarget(o2.index()); o2.clearResult(); at.apply(o2);
        var touche1 = o2.result().hpDamage;
        var at2 = new Game_Action(ves); at2.setAttack(); at2.setTarget(o2.index()); o2.clearResult(); at2.apply(o2);
        out.frapper = { rep: Parler.reputation('orques') - rep, ethique: Parler.ethique(), annonces: annonces(o2), touche: touche1 > 0 && o2.result().hpDamage > 0 };
        // contre-épreuve : le frapper à pleins PV ne se sait pas (et le coup a bien touché)
        remettre(o2); $gameSystem._ethique = 0; o2.addParam(0, 99999); o2.recoverAll();
        var at3 = new Game_Action(ves); at3.setAttack(); at3.setTarget(o2.index()); o2.clearResult(); at3.apply(o2);
        out.frapperPleins = { ethique: Parler.ethique(), touche: o2.result().hpDamage > 0 };
        hasard = 0.99;

        // Impressionner (une Vouivre) : sans gros coup, non ; après un gros coup, oui
        remettre(o2); o2.enemy().meta.Peuple = 'vouivres'; o2.setHp(Math.floor(o2.mhp * 0.25));
        parle('impressionner', o2);
        out.impressionner = { sans: o2._parlerParti || null, annonces: annonces(o2) };
        var gros = new Game_Action(ves); gros.setAttack(); gros.executeHpDamage(o2, Math.ceil(o2.mhp * 0.16));
        o2.setHp(Math.floor(o2.mhp * 0.25));
        parle('impressionner', o2);
        out.impressionner.avec = o2._parlerParti || null;
        o2.enemy().meta.Peuple = 'orques';   // (depuis l'étape 2, la fiche a un <Monde:> : sans <Peuple:>, plus de peuple)

        // Offrir (une Envie) : paie son or ; sans or, rien
        remettre(o2); o2.enemy().meta.Peuple = 'envies'; o2.setHp(Math.floor(o2.mhp * 0.25));
        $gameParty.loseGold($gameParty.gold()); $gameParty.gainGold(5);
        parle('offrir', o2);
        out.offrirSansOr = { or: $gameParty.gold(), parti: o2._parlerParti || null };
        $gameParty.gainGold(1000); var orP = $gameParty.gold();
        parle('offrir', o2);
        out.offrir = { paye: orP - $gameParty.gold(), prix: Math.max(10, o2.gold()), parti: o2._parlerParti || null };
        o2.enemy().meta.Peuple = 'orques';

        // le cadeau : une fois sur quatre (le hasard du banc le force)
        remettre(o2); o2.setHp(Math.floor(o2.mhp * 0.25)); hasard = 0.01;
        var d = o2.enemy(); d.dropItems = [{ kind: 1, dataId: 1, denominator: 1 }];
        parle('ecouter', o2);
        out.cadeau = { objet: o2._parlerCadeau ? o2._parlerCadeau.name : null, dansLeButin: $gameTroop.makeDropItems().indexOf(o2._parlerCadeau) >= 0 };
        hasard = 0.99;
        // contre-épreuve : <SansParler>
        remettre(o2); o2.enemy().meta.SansParler = true; out.sansParler = Parler.parlable(o2); delete o2.enemy().meta.SansParler;
        return out;
    });

    v('les six approches existent, lues par le moteur', r.skills.every(Boolean), r.skills.join(', '));
    v('Orc → Orques, Slime → Gelées, Harpie → Pleureuses', r.peuples.orc === 'orques' && r.peuples.slime === 'gelees' && r.peuples.harpie === 'pleureuses');
    v('contre-épreuve : l\'Ogre, le Sorcier Noir (« orc » dans le mot), Thanatos (« imp ») ne sont d\'aucun peuple',
      !r.peuples.ogre && !r.peuples.sorcier && !r.peuples.thanatos);
    v('un Squelette (les morts : une quête) n\'a pas Parler', !r.peuples.squelette);
    v('hors d\'une carte <Chapitre 1> : ni Parler, ni commande', !r.horsChapitre.parlable && r.horsChapitre.commande < 0);
    v('sur la carte : la commande est là, grisée tant que personne ne baisse sa garde', r.pleinsPV.commande >= 0 && !r.pleinsPV.ouverte && !r.pleinsPV.garde);
    v('bouclier brisé : il baisse sa garde', r.brise);
    v('sous 30 % de PV : il baisse sa garde, la commande s\'ouvre', r.sous30 && r.commandeOuverte);
    v('contre-épreuve : à 31 %, non', !r.au31);
    v('la mauvaise approche : il refuse, et l\'indice de son peuple s\'affiche', r.refus.colere === 1 && r.refus.present &&
      r.refus.annonces.some(function (t) { return /refuse/.test(t); }) && r.refus.annonces.some(function (t) { return /Orques/.test(t); }), r.refus.annonces.join(' | '));
    v('… et il frappe 10 % plus fort', Math.abs(r.refus.rapport - 1.1) < 0.02, r.refus.rapport.toFixed(3));
    v('la bonne approche (rang D, une suffit) : il se calme et s\'en va', r.calme.parti === 'calme' && r.calme.cache, r.calme.annonces.join(' | '));
    v('… la réputation des Orques monte', r.calme.rep === 1, String(r.calme.rep));
    v('… il rapporte son expérience, pas son or', r.calme.exp === r.calme.expOrc && r.calme.or === 0, 'exp ' + r.calme.exp + '/' + r.calme.expOrc + ' · or ' + r.calme.or);
    v('rang C : deux bonnes réponses (« 1/2 », puis il part)', r.rangC.besoin === 2 && r.rangC.present && r.rangC.apres === 'calme', r.rangC.annonces.join(' | '));
    v('apaisé sous 10 % : il s\'enfuit, sans réputation ni expérience', r.fuite.parti === 'fuite' && r.fuite.cache && r.fuite.rep === 0 && r.fuite.exp === 0);
    v('un boss n\'a pas Parler, et ne s\'apaise pas', !r.boss.parlable && !r.boss.garde && !r.boss.parti);
    v('le frapper garde baissée se sait : réputation −1, éthique −1, une seule fois', r.frapper.touche && r.frapper.rep === -1 && r.frapper.ethique === -1 &&
      r.frapper.annonces.filter(function (t) { return /baissé sa garde/.test(t); }).length === 1, r.frapper.annonces.join(' | '));
    v('contre-épreuve : le frapper à pleins PV ne se sait pas (le coup touche)', r.frapperPleins.touche && r.frapperPleins.ethique === 0);
    v('Impressionner sans gros coup : non ; après un coup de 16 % : oui', !r.impressionner.sans && r.impressionner.avec === 'calme', r.impressionner.annonces.join(' | '));
    v('Offrir sans assez d\'or : rien ne se passe, rien n\'est pris', r.offrirSansOr.or === 5 && !r.offrirSansOr.parti);
    v('Offrir : il prend son or, et c\'est la bonne approche d\'une Envie', r.offrir.paye === r.offrir.prix && r.offrir.parti === 'calme', 'payé ' + r.offrir.paye);
    v('un cadeau : l\'objet de son butin, et il est dans le butin du combat', !!r.cadeau.objet && r.cadeau.dansLeButin, r.cadeau.objet);
    v('<SansParler> : pas de Parler', !r.sansParler);

    v('aucune erreur dans le jeu', err.length === 0, err.slice(0, 5).join(' | '));
    console.log('\n' + ok + ' OK, ' + ko + ' KO');
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
