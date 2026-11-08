/*
 * BANC NAVIGATEUR — LES BOSS DE LA BIBLE ET LES BRAISES (LesPeuples v1.1, Parler v1.2 ; 2026-11-08)
 * ---------------------------------------------------------------------------
 * La Bible de JOKO, « Le Chapitre 1 dans le jeu » : « Comment l'arrêter sans le tuer » — Dame Sanglot (lui rendre les
 * braises), Ruedan (l'aider à pardonner), Aymeric (la braise de sa mère), Vaëlle (elle revient), la Gelée-Reine (écouter
 * chaque voix), Hurle-Doux (laisser dire sa colère, puis le vaincre loyalement), Brennus (un duel), Corvina (briser sa
 * volonté). Et « Les braises » : un habitant du Chapitre 1 tué pour de bon ne laisse que sa braise.
 * Chaque règle dans les deux sens : elle fait ce qu'elle dit, et sans sa balise, rien.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899
 *   node bancs/navigateur/les_boss_de_la_bible.js
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
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging() && BattleManager.isInputting(); }, null, { timeout: 300000 });

    console.log('=== LES BOSS DE LA BIBLE ET LES BRAISES ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var out = {}, hasard = 0.5;
        Math.random = function () { return hasard; };
        var H = $gameParty.members(), ves = H[0], h2 = H[1];
        var T = $gameTroop.members(), e1 = T[0], e2 = T[1], e3 = T[2];
        T.forEach(function (x) { var d = JSON.parse(JSON.stringify(x.enemy())); d.note = d.note.replace(/<\s*(Meca\w*|Phases)\s*:[^>]*>|<Boss>/gi, ''); x.enemy = function () { return d; }; x._rangEquilibre = undefined; });
        var BRAISE = $dataItems[113];
        function fiche(x, balises) { var d = x.enemy(); d.meta = { Peuple: 'aucun' }; Object.keys(balises || {}).forEach(function (k) { d.meta[k] = balises[k]; }); }
        function reset() {
            hasard = 0.5; $gameTroop._turnCount = 1; $dataMap.meta['Chapitre 1'] = true;
            T.forEach(function (x) {
                x.appear(); x.revive(); x.clearStates(); x.clearBuffs(); x.addParam(0, 999999 - x.mhp); x.recoverAll(); x._ctAnnonces = []; x.clearResult();
                Object.keys(x).filter(function (k) { return /^_(humeur|couronne|colere|coups|rancune|releves|seRelever|dernierFeu|veille|recueil|vacille|refus|souvenir|pasPaye|mortVue|fondue|expFusion|nomPropre|parler|braise|volonte|tenue|duel|deshonneur|gardeAnnoncee)/.test(k); }).forEach(function (k) { delete x[k]; });
                fiche(x, {});
            });
            H.forEach(function (a) {
                a.recoverAll(); a.clearStates(); a.clearBuffs(); a._ctAnnonces = [];
                Object.keys(a).filter(function (k) { return /^_(mvt|riposte|reprise|lache|leurre|contre|touche|apres|voie)/.test(k); }).forEach(function (k) { delete a[k]; });
            });
            $gameParty.loseItem(BRAISE, 99); [114, 115, 116].forEach(function (i) { $gameParty.loseItem($dataItems[i], 99); });
        }
        function ann(b) { return (b._ctAnnonces || []).map(function (x) { return x.texte; }); }
        function attaque(qui, cible) { var a = new Game_Action(qui); a.setAttack(); a.setTarget(cible.isActor() ? H.indexOf(cible) : cible.index()); return a; }
        function val(qui, cible) { return attaque(qui, cible).makeDamageValue(cible, false); }
        function frappe(qui, cible) { var a = attaque(qui, cible); cible.clearResult(); a.apply(cible); return cible.result(); }
        function tuer(x) { x.clearResult(); x.setHp(0); x.addState(x.deathStateId()); }
        function finAction() { BattleManager._subject = ves; try { BattleManager.endAction(); } catch (x) { out.erreurFin = String(x); } BattleManager._subject = null; }
        function parle(cle, cible) { var a = new Game_Action(ves); a.setSkill(Parler.skillDe(cle)); a.setTarget(cible.index()); a.apply(cible); }
        T.forEach(function (x) { x.addParam(2, 300); });

        // les braises : un habitant du Chapitre 1 tué ; pas un humain du dehors, pas un apaisé
        reset(); fiche(e1, { Monde: 'chapitre1', Peuple: 'gelees' }); tuer(e1); finAction();
        out.braise = { tombe: e1.makeDropItems().indexOf(BRAISE) >= 0, annonces: ann(e1) };
        reset(); fiche(e1, { Monde: 'exterieur', Peuple: 'humains' }); tuer(e1); finAction(); out.braise.dehors = e1.makeDropItems().indexOf(BRAISE) < 0;
        reset(); fiche(e1, { Monde: 'chapitre1', Peuple: 'gelees' }); e1._parlerParti = 'calme'; tuer(e1); finAction(); out.braise.apaise = e1.makeDropItems().indexOf(BRAISE) < 0;

        // Dame Sanglot : elle déteste qui porte les braises ; on les lui rend (Offrir), sans or
        reset(); fiche(e1, { Peuple: 'pleureuses', GardeLesBraises: true, 'Parler approches': 'offrir', 'Parler besoin': '3', 'Parler objet': '113' });
        var sansBraise = val(e1, ves); $gameParty.gainItem(BRAISE, 5); var avecBraise = val(e1, ves);
        out.sanglot = { colere: avecBraise / sansBraise };
        e1.setHp(Math.floor(e1.mhp * 0.2)); var or = $gameParty.gold();
        parle('offrir', e1); parle('offrir', e1);
        out.sanglot.deux = { braises: $gameParty.numItems(BRAISE), present: !e1.isHidden(), or: $gameParty.gold() - or };
        parle('offrir', e1); out.sanglot.fini = e1.isHidden() && $gameParty.numItems(BRAISE) === 2;

        // Aymeric : sans la braise de sa mère, la bonne approche ne suffit pas (pas de colère) ; avec, il s'arrête ; hors du Chapitre 1 aussi
        reset(); $dataMap.meta['Chapitre 1'] = false;
        fiche(e1, { Peuple: 'humains', Tenue: true, 'Parler approches': 'offrir', 'Parler besoin': '1', 'Parler objet': '114', 'Parler fin': 'Il reconnaît la braise.', 'Parler interrupteur': '320' });
        e1.setHp(Math.floor(e1.mhp * 0.2)); $gameSwitches.setValue(320, false);
        out.aymeric = { parlable: Parler.parlable(e1) };
        parle('offrir', e1); out.aymeric.sans = { present: !e1.isHidden(), colere: (e1._parler || {}).colere || 0, annonces: ann(e1) };
        $gameParty.gainItem($dataItems[114], 1); parle('offrir', e1);
        out.aymeric.avec = e1.isHidden() && $gameSwitches.value(320) && $gameParty.numItems($dataItems[114]) === 0;
        // sa Tenue : les autres à l'abri, jusqu'à un coup de 15 %
        reset(); fiche(e1, { Tenue: true });
        e1.addParam(0, -(e1.mhp - 2000)); e1.recoverAll();
        var abri = val(ves, e2); fiche(e1, {}); var sansTenue = val(ves, e2); fiche(e1, { Tenue: true });
        out.tenue = { abri: abri / sansTenue };
        frappe(ves, e1); out.tenue.rompue = !!e1._tenueRompue && Math.abs(val(ves, e2) / sansTenue - 1) < 0.02;

        // Brennus : un duel
        reset(); fiche(e1, { Peuple: 'humains', Duel: true });
        var seul = val(h2, e1); frappe(ves, e1); var tiers = val(h2, e1);
        var avant = val(e1, ves); frappe(h2, e1); var apres = val(e1, ves);
        out.duel = { dueliste: e1._dueliste === ves, tiers: tiers / seul, colere: apres / avant, annonces: ann(e1) };

        // Hurle-Doux : les chants, et vaincu loyalement
        reset(); fiche(e1, { Peuple: 'orques', Chants: true, Loyal: true }); $gameTroop._turnCount = 3;
        e2.setHp(Math.floor(e2.mhp / 2)); var pv2 = e2.hp; LesPeuples.debutDeTour(); out.chants = { joie: e2.hp > pv2 };
        e1.setHp(Math.floor(e1.mhp * 0.5)); var pvH = ves.hp; LesPeuples.debutDeTour(); out.chants.colere = ves.hp < pvH;
        e1.setHp(Math.floor(e1.mhp * 0.2)); LesPeuples.debutDeTour(); out.chants.chagrin = ves.isStateAffected(168);
        reset(); fiche(e1, { Peuple: 'orques', Chants: true, Loyal: true }); e1._colereDite = true; tuer(e1); finAction();
        out.loyal = { incline: e1.isHidden() && e1._parlerParti === 'calme' };
        reset(); fiche(e1, { Peuple: 'orques', Chants: true, Loyal: true }); tuer(e1); finAction(); out.loyal.sansDire = e1.isDead() && !e1.isHidden();

        // Corvina : elle revient tant que sa volonté tient ; la Brisure la fissure ; brisée, elle s'en va
        reset(); fiche(e1, { Volonte: '2' }); LesPeuples.debutDeCombat();
        tuer(e1); finAction(); out.corvina = { revient: e1.isAlive() && e1._volonte === 1 };
        e1.clearResult(); e1.addState(1005); out.corvina.brisure = e1._volonte === 0;
        tuer(e1); finAction(); out.corvina.brisee = e1.isHidden() && e1._parlerParti === 'calme';

        // Vaëlle : elle n'esquive pas, elle reviendra, plus forte
        // (des PV sous le plafond de 999 999, sinon « plus forte » ne se voit pas)
        reset(); $gameSystem._centFois = {}; fiche(e1, { CentFois: true }); e1.addParam(0, -(e1.mhp - 5000)); e1.recoverAll();
        out.vaelle = { esquive: e1.xparam(1) };
        var mhp1 = e1.mhp; tuer(e1); finAction(); out.vaelle.compte = $gameSystem._centFois[e1.enemyId()];
        e1.revive(); e1.recoverAll(); LesPeuples.debutDeCombat(); out.vaelle.plusForte = e1.mhp > mhp1;
        reset(); out.vaelle.sansBalise = e1.xparam(1) > 0;

        // Ruedan : écouter lui ôte sa rancune
        reset(); fiche(e1, { Peuple: 'trolls', Pardon: true, 'Parler approches': 'ecouter', 'Parler besoin': '3' }); e1._rancune = 3;
        e1.setHp(Math.floor(e1.mhp * 0.2)); parle('ecouter', e1); parle('ecouter', e1);
        out.ruedan = { rancune: e1._rancune, present: !e1.isHidden() }; parle('ecouter', e1); out.ruedan.paix = e1.isHidden();

        // la Gelée-Reine : écouter chaque voix (son propre texte, son propre nombre)
        reset(); fiche(e1, { Peuple: 'gelees', 'Parler approches': 'ecouter', 'Parler besoin': '5', 'Parler texte': 'Une voix se tait' });
        e1.setHp(Math.floor(e1.mhp * 0.2)); parle('ecouter', e1);
        out.reine = { texte: ann(e1).join(' | '), besoin: Parler.besoin(e1) };
        parle('avouer', e1); out.reine.avouer = (e1._parler || {}).colere === 1;
        return out;
    });

    v('braises : un habitant du Chapitre 1 tué laisse sa braise', r.braise.tombe, r.braise.annonces.join(' | '));
    v('… pas un humain du dehors, pas une créature apaisée', r.braise.dehors && r.braise.apaise);
    v('Dame Sanglot : porter cinq braises la met en colère (×1,5)', Math.abs(r.sanglot.colere - 1.5) < 0.03, r.sanglot.colere.toFixed(2));
    v('… lui rendre deux braises : elle écoute, aucun or n\'est pris', r.sanglot.deux.braises === 3 && r.sanglot.deux.present && r.sanglot.deux.or === 0, JSON.stringify(r.sanglot.deux));
    v('… la troisième : elle s\'en va', r.sanglot.fini);
    v('Aymeric : on peut lui parler même hors du Chapitre 1 (sa façon à lui)', r.aymeric.parlable);
    v('… sans la braise de sa mère : rien ne se passe, et pas de colère', r.aymeric.sans.present && r.aymeric.sans.colere === 0, r.aymeric.sans.annonces.join(' | '));
    v('… avec : il s\'arrête, l\'objet est rendu, l\'interrupteur s\'allume', r.aymeric.avec);
    v('la Tenue : les autres encaissent ×0,7', Math.abs(r.tenue.abri - 0.7) < 0.03, r.tenue.abri.toFixed(2));
    v('… un coup de 15 % la rompt', r.tenue.rompue);
    v('Brennus : le premier qui frappe est son duelliste', r.duel.dueliste);
    v('… un autre frappe à moitié, et le met en colère (+20 %)', Math.abs(r.duel.tiers - 0.5) < 0.03 && Math.abs(r.duel.colere - 1.2) < 0.03, r.duel.tiers.toFixed(2) + ' / ' + r.duel.colere.toFixed(2) + ' · ' + r.duel.annonces.join(' | '));
    v('Hurle-Doux chante : sa joie soigne, sa colère blesse, son chagrin accable', r.chants.joie && r.chants.colere && r.chants.chagrin);
    v('… tombé après avoir dit sa colère : il s\'incline', r.loyal.incline);
    v('… contre-épreuve : sans l\'avoir dite, il tombe', r.loyal.sansDire);
    v('Corvina : tombée, elle revient (volonté 2 → 1)', r.corvina.revient);
    v('… la Brisure fissure sa volonté', r.corvina.brisure);
    v('… brisée, elle s\'en va', r.corvina.brisee);
    v('Vaëlle n\'esquive jamais ; tombée, elle reviendra, plus forte', r.vaelle.esquive === 0 && r.vaelle.compte === 1 && r.vaelle.plusForte, JSON.stringify(r.vaelle));
    v('… contre-épreuve : sans la balise, on esquive', r.vaelle.sansBalise);
    v('Ruedan : chaque bonne réponse lui ôte une rancune, puis il pardonne', r.ruedan.rancune === 1 && r.ruedan.present && r.ruedan.paix, JSON.stringify(r.ruedan));
    v('la Gelée-Reine : son texte, son nombre de voix', /Une voix se tait · 1\/5/.test(r.reine.texte) && r.reine.besoin === 5, r.reine.texte);
    v('… sa façon remplace celle de son peuple (Avouer ne marche plus)', r.reine.avouer);
    v('aucune erreur dans le jeu', err.length === 0 && !r.erreurFin, err.slice(0, 4).join(' | ') + (r.erreurFin || ''));
    console.log('\n' + ok + ' OK, ' + ko + ' KO');
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
