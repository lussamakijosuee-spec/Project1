/*
 * BANC NAVIGATEUR — LE POIDS DES ÂMES (le rework, L1, 2026-10-25)
 * ---------------------------------------------------------------------------
 * La Bible, ludwing : « son âme est unique : absorber d'autres âmes le rend
 * plus puissant, mais leurs traumas viennent avec. » JOKO, le 2026-10-25 :
 * « Oui tout » sur L1.
 *
 * Dans LeRegistre : en combat, chaque âme gardée (la variable 15) donne +2 % à
 * ses dégâts (10 âmes comptées au plus) ; au-delà de 5, chaque âme de plus lui
 * coûte 3 % de DÉF (60 % au plus), l'état 259 dit la perte — jusqu'à ce qu'il
 * les dépense. Amasser ou dépenser.
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. les réglages et l'état 259 ;
 *   2. ses dégâts suivent ses âmes (0, 5, 30 → plafond de 10) — pas ses soins, pas
 *      ceux de Vesper ; « ✦ Âmes ×1,1 » flotte quand il frappe ;
 *   3. sa DÉF : rien jusqu'à 5, −9 % à 8, −60 % au plus — pas celle de Vesper ;
 *   4. l'état 259 et son chiffre, l'annonce ; dépenser l'allège ;
 *   5. Registre._sansPoids coupe la règle (contre-épreuve).
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   cmd /c start "" /b /wait /low /affinity 3 node bancs/navigateur/le_poids_des_ames.js
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

    console.log('=== LE POIDS DES ÂMES ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var o = {}, POIDS = 259;
        var ves = $gameActors.actor(1), lud = $gameActors.actor(3);
        var e = $gameTroop.members()[0];
        e.addParam(0, 9999999); e.recoverAll();
        Math.random = function () { return 0.5; };
        function ames(n) { $gameVariables.setValue(15, n); }
        function degats(h, id, cible) { var a = new Game_Action(h); a.setSkill(id); a.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible)); return a.makeDamageValue(cible, false); }
        function annonces(b) { return (b._ctAnnonces || []).map(function (a) { return a.texte; }); }

        // 1 · les réglages
        var pl = {}; $plugins.forEach(function (p) { pl[p.name] = p; });
        var P = pl.LeRegistre.parameters;
        o.reglages = { par: P.bonusParAme, max: P.bonusAmesMax, seuil: P.seuilPoids, def: P.defenseParAme, poidsMax: P.poidsMax, etat: P.etatPoids, nom: $dataStates[POIDS].name, icone: $dataStates[POIDS].iconIndex };

        // 2 · ses dégâts
        ames(0); var d0 = degats(lud, 1, e), s0 = degats(lud, 1082, ves), v0 = degats(ves, 1066, e);
        ames(5); var d5 = degats(lud, 1, e), s5 = degats(lud, 1082, ves), v5 = degats(ves, 1066, e);
        ames(30); var d30 = degats(lud, 1, e);
        o.degats = { d0: d0, d5: d5, d30: d30, soin0: s0, soin5: s5, ves0: v0, ves5: v5 };
        ames(5); lud._ctAnnonces = [];
        var a = new Game_Action(lud); a.setAttack(); a.setTarget(e.index()); e.clearResult(); a.apply(e); e.recoverAll();
        o.annonceFrappe = annonces(lud).filter(function (t) { return /Âmes ×/.test(t); });

        // 3 · sa DÉF
        ames(0); var def0 = lud.def, vdef0 = ves.def;
        ames(5); var def5 = lud.def;
        ames(8); var def8 = lud.def, vdef8 = ves.def;
        ames(40); var def40 = lud.def;
        o.def = { d0: def0, d5: def5, d8: def8, d40: def40, ves0: vdef0, ves8: vdef8 };

        // 4 · l'état, son chiffre, l'annonce ; dépenser l'allège
        ames(0); lud._ctAnnonces = [];
        ames(8);
        o.etat8 = { la: lud.isStateAffected(POIDS), chiffre: lud.getStateCounter ? lud.getStateCounter(POIDS) : null, annonce: annonces(lud).filter(function (t) { return /poids des âmes/.test(t); }) };
        lud._ctAnnonces = [];
        ames(3);
        o.etat3 = { la: lud.isStateAffected(POIDS), annonce: annonces(lud).filter(function (t) { return /Plus léger/.test(t); }), def: lud.def };

        // 5 · la règle coupée
        ames(30); Registre._sansPoids = true;
        o.sans = { d: degats(lud, 1, e), def: lud.def };
        Registre._sansPoids = false;
        ames(0);
        return o;
    });

    function proche(x, y) { return Math.abs(x - y) <= 0.01; }
    console.log('1) Les réglages');
    v('LeRegistre : +2 % par âme, 10 au plus, poids au-delà de 5, −3 % de DÉF par âme, 60 % au plus, état 259',
      r.reglages.par === '2' && r.reglages.max === '10' && r.reglages.seuil === '5' && r.reglages.def === '3' && r.reglages.poidsMax === '60' && r.reglages.etat === '259', JSON.stringify(r.reglages));
    v('l\'état 259 est « 😵 Le poids des âmes », avec son icône', r.reglages.nom === '😵 Le poids des âmes' && r.reglages.icone > 0);

    console.log('\n2) Plus fort de ce qu\'il garde');
    var D = r.degats;
    v('5 âmes : ses coups ×1,1', proche(D.d5 / D.d0, 1.10), D.d0 + ' → ' + D.d5);
    v('30 âmes : ×1,2 au plus (10 comptées)', proche(D.d30 / D.d0, 1.20), D.d0 + ' → ' + D.d30);
    v('contre-épreuve : ses soins ne changent pas (Main Chaude)', D.soin0 === D.soin5, D.soin0 + ' / ' + D.soin5);
    v('contre-épreuve : les coups de Vesper ne changent pas', D.ves0 === D.ves5, D.ves0 + ' / ' + D.ves5);
    v('« ✦ Âmes ×1,1 » flotte quand il frappe', r.annonceFrappe.length === 1 && /×1,1$/.test(r.annonceFrappe[0]), r.annonceFrappe.join(' | '));

    console.log('\n3) Plus lourd au-delà de 5');
    var F = r.def;
    v('jusqu\'à 5 âmes, sa DÉF ne bouge pas', F.d5 === F.d0, F.d0 + ' / ' + F.d5);
    v('8 âmes : DÉF −9 %', Math.abs(F.d8 / F.d0 - 0.91) < 0.01, F.d0 + ' → ' + F.d8);
    v('40 âmes : −60 % au plus', Math.abs(F.d40 / F.d0 - 0.40) < 0.01, F.d0 + ' → ' + F.d40);
    v('contre-épreuve : la DÉF de Vesper ne bouge pas', F.ves0 === F.ves8);

    console.log('\n4) Ça se voit, et dépenser l\'allège');
    v('8 âmes : l\'état 259, « -9% » en chiffre', r.etat8.la && r.etat8.chiffre === '-9%', JSON.stringify(r.etat8.chiffre));
    v('… et « 😵 Le poids des âmes · DÉF −9 % » flotte', r.etat8.annonce.some(function (t) { return /DÉF −9 %/.test(t); }), r.etat8.annonce.join(' | '));
    v('dépensées jusqu\'à 3 : l\'état part, « ✦ Plus léger », la DÉF revient', !r.etat3.la && r.etat3.annonce.length > 0 && r.etat3.def === F.d0, r.etat3.annonce.join(' | ') + ' · DÉF ' + r.etat3.def);

    console.log('\n5) Contre-épreuve');
    v('Registre._sansPoids : ni bonus ni poids, même à 30 âmes', r.sans.d === D.d0 && r.sans.def === F.d0, JSON.stringify(r.sans));

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
