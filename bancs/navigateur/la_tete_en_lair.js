/*
 * BANC NAVIGATEUR — LA TÊTE EN L'AIR (le rework, K1, 2026-10-25)
 * ---------------------------------------------------------------------------
 * La Bible, Korrah : « Son gouffre : la tête en l'air poussée à l'extrême, des
 * attaques visées ratées, des objets qui tombent. Elle doit apprendre à se
 * concentrer. » JOKO, le 2026-10-25 : « Oui tout » sur K1.
 *
 * Dans LeMouvement : ses attaques sur une seule cible ratent 15 % du temps
 * (pas une <Sur>) ; penser juste (une Parole dans sa posture) ou Focalisation
 * la concentrent (état 258, 🎯) : sa prochaine attaque visée ne rate pas, ne
 * s'esquive pas, frappe ×1,25, et la concentration part.
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. les réglages et l'état 258 ;
 *   2. distraite, son attaque visée rate et « 💭 La tête ailleurs… » flotte ;
 *      pas celle de Vesper, pas une <Sur>, pas un coup de zone ; et sur 4 000
 *      tirages, elle rate ~15 % du temps ;
 *   3. Focalisation la concentre (sans rater elle-même) ; concentrée, elle ne
 *      rate pas, ne s'esquive pas, frappe ×1,25, et la concentration part ;
 *   4. penser juste la concentre aussi — la Parole qui pense n'use pas la
 *      concentration, le mouvement d'après, si ;
 *   5. ni Vesper ni un ennemi ne sont concernés.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   cmd /c start "" /b /wait /low /affinity 3 node bancs/navigateur/la_tete_en_lair.js
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

    console.log('=== LA TÊTE EN L\'AIR ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var o = {}, CONC = 258, hasard = Math.random;
        var ves = $gameActors.actor(1), kor = $gameActors.actor(2);
        var e = $gameTroop.members()[0];
        e.addParam(0, 9999999); e.recoverAll();
        $gameParty.members().forEach(function (a) { a.addParam(0, 9999999); a.recoverAll(); });
        function des(x) { Math.random = function () { return x; }; }
        function annonces(b) { return (b._ctAnnonces || []).map(function (a) { return a.texte; }); }
        function remettre(h) { h._mvtVoie = ''; h._mvtFlux = 0; h._mvtDernier = 0; h._mvtPense = false; h._ctAnnonces = []; h.removeState(CONC); }
        // une action par le vrai chemin : startAction → apply → endAction
        function jouer(h, id, cible) {
            var act = new Game_Action(h); act.setSkill(id);
            act.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible));
            h._actions = [act]; h.setMp(h.mmp); h.setTp(100);
            BattleManager._subject = h; BattleManager.startAction();
            cible.clearResult(); act.apply(cible);
            var res = { rate: cible.result().missed, esquive: cible.result().evaded, dmg: cible.result().hpDamage, tete: act._tete };
            BattleManager.endAction(); BattleManager._subject = null;
            e.recoverAll();
            return res;
        }

        // 1 · les réglages
        var pl = {}; $plugins.forEach(function (p) { pl[p.name] = p; });
        var P = pl.LeMouvement.parameters;
        o.reglages = { tete: P.teteEnLair, rate: P.rateTeteEnLair, etat: P.etatConcentree, bonus: P.bonusConcentree, focal: P.seConcentrent, nom: $dataStates[CONC].name, icone: $dataStates[CONC].iconIndex };

        // 2 · distraite
        des(0.1);
        remettre(kor); o.distraite = jouer(kor, 1106, e); o.distraite.annonce = annonces(kor).indexOf('💭 La tête ailleurs…') >= 0;
        remettre(ves); o.vesper = jouer(ves, 1066, e);
        remettre(kor); o.sur = jouer(kor, 1160, e);                         // Maîtrise <Sur>
        remettre(kor); o.zone = jouer(kor, 155, e);                         // Vague Équilibrée, sur tous
        des(0.5); remettre(kor); o.pasDistraite = jouer(kor, 1106, e);
        Math.random = hasard;
        var n = 0, N = 4000;
        for (var i = 0; i < N; i++) { var a = new Game_Action(kor); a.setSkill(1106); a.setTarget(e.index()); if (a.itemHit(e) === 0) { n++; } }
        o.taux = n / N;

        // 3 · Focalisation la concentre
        des(0.1); remettre(kor);
        o.focal = jouer(kor, 451, e);
        o.focal.etat = kor.isStateAffected(CONC); o.focal.annonce = annonces(kor).indexOf('🎯 Concentrée') >= 0;
        kor._ctAnnonces = [];
        o.concentree = jouer(kor, 1106, e);
        o.concentree.etatApres = kor.isStateAffected(CONC);
        o.concentree.annonce = annonces(kor).filter(function (t) { return /Concentrée ×1,25/.test(t); }).length > 0;
        // ×1,25 et pas d'esquive : la même action, concentrée ou non
        des(0.5);
        var x1 = new Game_Action(kor); x1.setSkill(1106); x1.setTarget(e.index()); x1._tete = ''; var sans = x1.makeDamageValue(e, false);
        var x2 = new Game_Action(kor); x2.setSkill(1106); x2.setTarget(e.index()); x2._tete = 'concentree'; var avec = x2.makeDamageValue(e, false);
        o.bonus = { sans: sans, avec: avec };
        // l'esquive se lit sur un coup physique (un coup sûr ne s'esquive jamais) : l'Attaque
        var y1 = new Game_Action(kor); y1.setAttack(); y1._tete = '';
        var y2 = new Game_Action(kor); y2.setAttack(); y2._tete = 'concentree';
        Object.defineProperty(e, 'eva', { configurable: true, get: function () { return 0.9; } });
        o.esquive = { sans: y1.itemEva(e), avec: y2.itemEva(e) };
        delete e.eva;

        // 4 · penser juste la concentre
        des(0.5); remettre(kor);
        jouer(kor, 1106, e);                                               // une posture
        kor._ctAnnonces = [];
        o.pense = jouer(kor, 1207, e);                                     // une Parole dans la posture : penser juste
        o.pense.etat = kor.isStateAffected(CONC);
        o.pense.annonces = annonces(kor);
        o.apres = jouer(kor, 1098, e);                                     // Traverser : le mouvement d'après l'use
        o.apres.etat = kor.isStateAffected(CONC);

        // 5 · ni Vesper ni un ennemi
        remettre(ves); jouer(ves, 1066, e); jouer(ves, 1186, e);
        o.vesperConcentree = ves.isStateAffected(CONC);
        des(0.1);
        var en = new Game_Action(e); en.setAttack(); en.setTarget(0);
        o.ennemi = en.itemHit(ves) > 0;
        Math.random = hasard;
        return o;
    });

    console.log('1) Les réglages');
    v('LeMouvement : Korrah (2), 15 %, état 258, ×1,25, Focalisation (451)', r.reglages.tete === '2' && r.reglages.rate === '15' && r.reglages.etat === '258' && r.reglages.bonus === '1.25' && r.reglages.focal === '451', JSON.stringify(r.reglages));
    v('l\'état 258 est « 🎯 Concentrée », avec son icône', r.reglages.nom === '🎯 Concentrée' && r.reglages.icone > 0, r.reglages.nom + ' · icône ' + r.reglages.icone);

    console.log('\n2) La tête ailleurs');
    v('distraite, son attaque visée rate', r.distraite.rate && r.distraite.tete === 'ailleurs', JSON.stringify(r.distraite));
    v('et « 💭 La tête ailleurs… » flotte au-dessus d\'elle', r.distraite.annonce);
    v('contre-épreuve : le même tirage, Vesper touche', !r.vesper.rate, JSON.stringify(r.vesper));
    v('contre-épreuve : une <Sur> (Maîtrise) ne rate pas', !r.sur.rate && r.sur.tete !== 'ailleurs', JSON.stringify(r.sur));
    v('contre-épreuve : un coup sur tous (Vague Équilibrée) ne rate pas', !r.zone.rate && !r.zone.tete, JSON.stringify(r.zone));
    v('contre-épreuve : au-dessus de 15 %, elle touche', !r.pasDistraite.rate, JSON.stringify(r.pasDistraite));
    v('sur 4 000 tirages, elle rate ~15 % du temps', r.taux > 0.13 && r.taux < 0.17, (r.taux * 100).toFixed(1) + ' %');

    console.log('\n3) Focalisation');
    v('Focalisation la concentre — et elle-même ne rate pas', r.focal.etat && r.focal.annonce && !r.focal.rate, JSON.stringify(r.focal));
    v('concentrée, le même tirage ne la fait plus rater', !r.concentree.rate && r.concentree.tete === 'concentree', JSON.stringify(r.concentree));
    v('… elle frappe ×1,25', Math.abs(r.bonus.avec / r.bonus.sans - 1.25) < 0.01, r.bonus.sans + ' → ' + r.bonus.avec);
    v('… elle ne s\'esquive pas (contre : 90 % d\'esquive sans la concentration)', r.esquive.avec === 0 && r.esquive.sans > 0.5, JSON.stringify(r.esquive));
    v('… la concentration part, et ça se dit', !r.concentree.etatApres && r.concentree.annonce);

    console.log('\n4) Penser juste');
    v('une Parole dans sa posture la concentre', r.pense.etat && r.pense.annonces.indexOf('🎯 Concentrée') >= 0, r.pense.annonces.join(' | '));
    v('la Parole qui pense n\'use pas la concentration ; le mouvement d\'après, si', r.pense.tete !== 'concentree' && r.apres.tete === 'concentree' && !r.apres.etat, JSON.stringify({ parole: r.pense.tete, mouvement: r.apres.tete, reste: r.apres.etat }));

    console.log('\n5) Ni Vesper ni un ennemi');
    v('Vesper ne se concentre pas (Frappe Pleine puis une Parole dans sa posture)', !r.vesperConcentree);
    v('un ennemi qui tire bas touche toujours', r.ennemi);

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
