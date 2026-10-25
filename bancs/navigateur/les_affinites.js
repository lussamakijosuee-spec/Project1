/*
 * BANC NAVIGATEUR — LES AFFINITÉS (LesTroisArts.js v1.1, 2026-10-24)
 * ---------------------------------------------------------------------------
 * La Bible : « Chaque personne naît avec une seule affinité […] C'est le don
 * ou le trait qui ajoute une seconde affinité » ; « un art hors de son affinité
 * coûte plus et rend moins ». JOKO, le 2026-10-24 : « L'affinité unique oui
 * c'est tout ». Vesper spirituel + négatif (son sang), Korrah négatif +
 * positif (l'Hiver de seiryu), ludwing négatif + spirituel (ses âmes), Aël
 * positif seul.
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens, héros par héros :
 *   1. les affinités lues dans les réglages ; seiryu et les ennemis n'en ont pas ;
 *   2. un art hors affinité coûte ×1,5 dans sa monnaie (PM, PT, PV) et rend
 *      ×0,75 (dégâts, soins, PM rendus) — jamais plus que la jauge pleine ;
 *      contre-épreuve : LesTroisArts._sansAffinites rend les valeurs d'avant ;
 *   3. un art dans l'affinité ne change pas ;
 *   4. hors de la règle : l'Attaque, seiryu, les ennemis, les dons, les combos ;
 *   5. à l'écran : l'aide dit « hors affinité », le coût affiché est le vrai,
 *      « ◇ Hors affinité » flotte au-dessus du héros (pas sur un art à lui).
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   cmd /c start "" /b /wait /low /affinity 3 node bancs/navigateur/les_affinites.js
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

    console.log('=== LES AFFINITÉS ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var A = LesTroisArts, o = {};
        var ves = $gameActors.actor(1), kor = $gameActors.actor(2), lud = $gameActors.actor(3), ael = $gameActors.actor(4), sei = $gameActors.actor(6);
        var e = $gameTroop.members()[0];
        e.addParam(0, 9999999); e.recoverAll();
        Math.random = function () { return 0.5; };
        function act(h, id, cible) {
            var a = new Game_Action(h); a.setSkill(id);
            if (cible) { a.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible)); }
            return a;
        }
        // une mesure, règle tenue puis coupée (puis tenue encore : elle doit redonner la même chose)
        function deux(f) { A._sansAffinites = false; var avec = f(); A._sansAffinites = true; var sans = f(); A._sansAffinites = false; return { avec: avec, sans: sans, stable: f() === avec }; }
        function prix(h, id) {
            var s = $dataSkills[id];
            return deux(function () { return h.skillMpCost(s) + '/' + h.skillTpCost(s) + '/' + h.skillHpCost(s); });
        }
        function degats(h, id, cible) {
            return deux(function () { h.recoverAll(); h.setTp(100); cible.recoverAll(); return act(h, id, cible).makeDamageValue(cible, false); });
        }

        // 1 · les affinités
        o.aff = [ves, kor, lud, ael, sei].map(function (h) { return A.affinites(h).join('+'); });
        o.affEnnemi = A.affinites(e).length;

        // 2 · hors affinité : ×1,5 / ×0,75
        o.hors = {
            vesPrix: prix(ves, 1186), vesDeg: degats(ves, 1186, e),        // Parole n°8 Feu — Braise
            vesSoin: degats(ves, 1226, kor),                                // Pansement Rapide (une Parole qui soigne)
            korPrix: prix(kor, 452), korDeg: degats(kor, 452, e),           // Parole n°2 Onde Concentrée (un écrit, en PV)
            korMur: prix(kor, 152),                                         // Barrière Magique (écrit, 9 % PV)
            ludPrix: prix(lud, 1221), ludDeg: degats(lud, 1221, e),         // Parole n°15 Ombre — Voile
            aelPrix: prix(ael, 1091), aelDeg: degats(ael, 1091, e),         // Renvoi Net (un mouvement)
            aelDomaine: prix(ael, 1121),                                    // Le Domaine Entier : 70 PT
            vrai: [A.horsAffinite(ves, $dataSkills[1186]), A.horsAffinite(kor, $dataSkills[452]), A.horsAffinite(lud, $dataSkills[1221]), A.horsAffinite(ael, $dataSkills[1091])]
        };
        // les PM rendus par un effet (Encouragement de Korrah : 20 % des PM)
        o.hors.korPM = deux(function () { ves.setMp(0); act(kor, 12, ves).itemEffectRecoverMp(ves, $dataSkills[12].effects[0]); return ves.mp; });
        ves.recoverAll();
        // la jauge pleine suffit au Domaine Entier, une de moins non
        ael.setTp(100); o.hors.peut100 = ael.canPaySkillCost($dataSkills[1121]);
        ael.setTp(99);  o.hors.peut99 = ael.canPaySkillCost($dataSkills[1121]);

        // 3 · dans l'affinité : rien ne change
        o.dans = {
            ves: [prix(ves, 53), degats(ves, 53, e), degats(ves, 158, e)],     // Lame de Sang (mouvement), Trait Spectral (écrit)
            kor: [prix(kor, 1106), degats(kor, 1106, e), prix(kor, 1186), degats(kor, 1186, e)],   // Pas de Côté, une Parole
            lud: [prix(lud, 158), degats(lud, 158, e), degats(lud, 1106, e)],
            ael: [prix(ael, 1216), degats(ael, 1216, e), degats(ael, 1226, kor)],
            faux: [A.horsAffinite(ves, $dataSkills[53]), A.horsAffinite(kor, $dataSkills[1186]), A.horsAffinite(lud, $dataSkills[158]), A.horsAffinite(ael, $dataSkills[1216])]
        };

        // 4 · hors de la règle
        o.regle = {
            attaque: [A.art($dataSkills[1]), A.horsAffinite(ael, $dataSkills[1]), degats(ael, 1, e)],
            seiryu: [A.horsAffinite(sei, $dataSkills[1186]), prix(sei, 1186)],
            ennemi: [A.horsAffinite(e, $dataSkills[1186]), deux(function () { e.recoverAll(); var a = new Game_Action(e); a.setSkill(1186); a.setTarget(0); return a.makeDamageValue(ves, false); })],
            don: [A.art($dataSkills[810]), prix(lud, 810), prix(lud, 51)],     // Ténèbres Impériales, Danse de l'Euphorie (JACKPOT)
            combo: [A.art($dataSkills[1305]), A.horsAffinite(ael, $dataSkills[1305]), prix(ael, 1305)]   // Feu Attisé (Vesper + Aël)
        };

        // 5 · à l'écran
        var w = new Window_BattleSkill(0, 0, 400, 200), h = new Window_Help(2);
        w.setHelpWindow(h);
        function aide(acteur, ids) { w.setActor(acteur); w._data = ids.map(function (i) { return $dataSkills[i]; }); return ids.map(function (i, k) { w.select(k); w.updateHelp(); return h._text.split('】')[0] + '】'; }); }
        o.aide = { ves: aide(ves, [1186, 53, 158]), ael: aide(ael, [1091, 1216]), kor: aide(kor, [452, 1106]) };
        var ecrit = [], dt = w.drawText;
        w.drawText = function (t) { ecrit.push(String(t)); return dt.apply(this, arguments); };
        w.setActor(ves); w._data = [$dataSkills[1186]];
        o.coutAffiche = deux(function () { w.contents.clear(); ecrit = []; w.drawItem(0); return ecrit.filter(function (s) { return /^\d+\s*MP$/.test(s); }).join(); });
        w.drawText = dt;
        function flotte(hh, id) { hh._ctAnnonces = []; e.recoverAll(); e.clearResult(); act(hh, id, e).apply(e); var t = (hh._ctAnnonces || []).map(function (x) { return x.texte; }); hh._ctAnnonces = []; return t; }
        ves.recoverAll(); ael.recoverAll(); ael.setTp(100);
        o.flotte = { ves: flotte(ves, 1186), vesContre: flotte(ves, 53), ael: flotte(ael, 1091), aelContre: flotte(ael, 1216) };
        return o;
    });

    function x(m) { return m.avec + ' (sans la règle : ' + m.sans + ')'; }
    function ratio(m, k) { return m.stable && m.sans !== 0 && Math.abs(m.avec / m.sans - k) < 0.01; }
    function pareil(m) { return m.stable && m.avec === m.sans; }

    console.log('1) Les affinités');
    v('Vesper spirituel + négatif, Korrah négatif + positif, ludwing négatif + spirituel, Aël positif seul',
      r.aff.slice(0, 4).join(' | ') === 'ecrit+mouvement | mouvement+parole | mouvement+ecrit | parole', r.aff.slice(0, 4).join(' | '));
    v('seiryu et les ennemis n\'en ont pas', r.aff[4] === '' && r.affEnnemi === 0);

    console.log('\n2) Hors affinité : coûte ×1,5, rend ×0,75');
    var H = r.hors;
    v('les quatre sont reconnus hors affinité (Parole de Vesper, écrit de Korrah, Parole de ludwing, mouvement d\'Aël)', H.vrai.every(Boolean), H.vrai.join(', '));
    v('Vesper, Braise (Parole) : 10 PM → 15', H.vesPrix.stable && H.vesPrix.avec === '15/0/0' && H.vesPrix.sans === '10/0/0', x(H.vesPrix));
    v('Vesper, Braise : dégâts ×0,75', ratio(H.vesDeg, 0.75), x(H.vesDeg));
    v('Vesper, Pansement Rapide (Parole) : soin ×0,75', ratio(H.vesSoin, 0.75) && H.vesSoin.avec < 0, x(H.vesSoin));
    v('Korrah, Onde Concentrée (écrit) : son prix en PV ×1,5, ses dégâts ×0,75',
      H.korPrix.stable && +H.korPrix.avec.split('/')[2] === Math.ceil(+H.korPrix.sans.split('/')[2] * 1.5) && ratio(H.korDeg, 0.75), x(H.korPrix) + ' · ' + x(H.korDeg));
    v('Korrah, Barrière Magique (écrit, 9 % PV) : ×1,5', H.korMur.stable && +H.korMur.avec.split('/')[2] === Math.ceil(+H.korMur.sans.split('/')[2] * 1.5), x(H.korMur));
    v('Korrah, Encouragement (écrit) : les PM rendus ×0,75', H.korPM.stable && H.korPM.sans > 0 && Math.abs(H.korPM.avec / H.korPM.sans - 0.75) < 0.02, x(H.korPM));
    v('ludwing, Voile (Parole) : 10 PM → 15, dégâts ×0,75', H.ludPrix.avec === '15/0/0' && H.ludPrix.sans === '10/0/0' && ratio(H.ludDeg, 0.75), x(H.ludPrix) + ' · ' + x(H.ludDeg));
    v('Aël, Renvoi Net (mouvement) : 28 PT → 42, dégâts ×0,75', H.aelPrix.avec === '0/42/0' && H.aelPrix.sans === '0/28/0' && ratio(H.aelDeg, 0.75), x(H.aelPrix) + ' · ' + x(H.aelDeg));
    v('Aël, Le Domaine Entier : 70 PT → 100, pas 105 (jamais plus que la jauge pleine)', H.aelDomaine.avec === '0/100/0' && H.aelDomaine.sans === '0/70/0', x(H.aelDomaine));
    v('… et il part avec la jauge pleine, pas avec 99', H.peut100 && !H.peut99);

    console.log('\n3) Dans l\'affinité : rien ne change');
    var D = r.dans;
    v('les quatre sont reconnus dans l\'affinité', D.faux.every(function (b) { return !b; }), D.faux.join(', '));
    v('Vesper : Lame de Sang (mouvement) au même prix et à la même force, Trait Spectral (écrit) aussi', D.ves.every(pareil), D.ves.map(x).join(' · '));
    v('Korrah : Pas de Côté (mouvement), Braise (Parole)', D.kor.every(pareil), D.kor.map(x).join(' · '));
    v('ludwing : Trait Spectral (écrit), Pas de Côté (mouvement)', D.lud.every(pareil), D.lud.map(x).join(' · '));
    v('Aël : Lueur (Parole), Pansement Rapide (soin de Parole)', D.ael.every(pareil), D.ael.map(x).join(' · '));

    console.log('\n4) Hors de la règle');
    var G = r.regle;
    v('l\'Attaque d\'Aël (un mouvement) ne change pas', G.attaque[0] === 'mouvement' && !G.attaque[1] && pareil(G.attaque[2]), x(G.attaque[2]));
    v('seiryu ne change pas', !G.seiryu[0] && pareil(G.seiryu[1]), x(G.seiryu[1]));
    v('un ennemi qui lance une Parole ne change pas', !G.ennemi[0] && pareil(G.ennemi[1]), x(G.ennemi[1]));
    v('les dons : Ténèbres Impériales (une Parole) et la Danse de l\'Euphorie de ludwing gardent leur prix',
      G.don[0] === 'parole' && pareil(G.don[1]) && G.don[1].avec === '60/0/0' && pareil(G.don[2]), x(G.don[1]) + ' · ' + x(G.don[2]));
    v('les combos : Feu Attisé (un mouvement) coûte toujours 46 PM à Aël', G.combo[0] === 'mouvement' && !G.combo[1] && pareil(G.combo[2]) && G.combo[2].avec === '46/0/0', x(G.combo[2]));

    console.log('\n5) À l\'écran');
    v('l\'aide de Vesper : 【PAROLE · FEU · hors affinité】 ; ses mouvements et ses écrits, non',
      r.aide.ves[0] === '【PAROLE · FEU · hors affinité】' && !/hors/.test(r.aide.ves[1]) && r.aide.ves[2] === '【ÉCRIT】', r.aide.ves.join(' '));
    v('l\'aide d\'Aël : son mouvement est hors affinité, sa Parole non', /^【MOUVEMENT.*hors affinité】$/.test(r.aide.ael[0]) && !/hors/.test(r.aide.ael[1]), r.aide.ael.join(' '));
    v('l\'aide de Korrah : son écrit est hors affinité, son mouvement non', /^【ÉCRIT.*hors affinité】$/.test(r.aide.kor[0]) && !/hors/.test(r.aide.kor[1]), r.aide.kor.join(' '));
    v('le coût affiché est le vrai : 15 PM pour Braise (10 sans la règle)', r.coutAffiche.stable && r.coutAffiche.avec === '15MP' && r.coutAffiche.sans === '10MP', x(r.coutAffiche));
    v('« ◇ Hors affinité » au-dessus de Vesper (Braise) et d\'Aël (Renvoi Net)',
      r.flotte.ves.indexOf('◇ Hors affinité') >= 0 && r.flotte.ael.indexOf('◇ Hors affinité') >= 0, r.flotte.ves.join(' | ') + ' / ' + r.flotte.ael.join(' | '));
    v('contre-épreuve : rien sur la Lame de Sang de Vesper ni sur la Lueur d\'Aël',
      r.flotte.vesContre.indexOf('◇ Hors affinité') < 0 && r.flotte.aelContre.indexOf('◇ Hors affinité') < 0, r.flotte.vesContre.join(' | ') + ' / ' + r.flotte.aelContre.join(' | '));

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
