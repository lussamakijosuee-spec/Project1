/*
 * BANC NAVIGATEUR — LE SPIRITUEL (LeSpirituel.js, 2026-10-20)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-20 : « mana spirituel, c'est plus de soi, émotion de soi,
 * volonté » ; « les runes, les marquages, tout ce qui est nécromancie » ;
 * « finis le rework spirituel ».
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. les réglages et l'état de la marque (icône, 3 tours) ;
 *   2. qui écrit : une technique de l'âme de ludwing (élément 2, élément 7) —
 *      pas un mouvement, pas une Parole, pas l'Attaque, pas un ennemi ;
 *   3. la marque : écrite au coup (40 % des dégâts), comptée en chiffre,
 *      3 au plus (la plus vieille s'en va), annoncée ;
 *   4. quand l'ennemi agit, ses marques éclatent d'un coup — pas s'il n'en a pas ;
 *   5. tombé marqué, l'âme revient à qui l'a écrite (8 % des PV max par marque)
 *      — rien sur un ennemi sans marque ;
 *   6. la volonté : ×1 en pleine forme, ×1,25 à mi-PV, +0,25 par allié tombé,
 *      ×1,75 au plus ; sur les soins de l'âme aussi ; pas sur un mouvement ;
 *   7. la marque s'efface au bout de 3 tours ;
 *   8. un vrai combat laissé tourner : ludwing marque, l'ennemi agit, ça éclate.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/le_spirituel.js
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

    async function ouvrirCombat() {
        await page.evaluate(function () {
            $gameParty.members().forEach(function (a) { a.recoverAll(); });
            BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(2500);
    }
    async function fermerCombat() {
        await page.evaluate(function () {
            delete SceneManager._scene.update;
            BattleManager.endBattle(2); $gameParty.onBattleEnd(); $gameTroop.onBattleEnd();
            SceneManager.goto(Scene_Map);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(800);
    }

    console.log('=== LE SPIRITUEL ===\n');
    await ouvrirCombat();
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var S = LeSpirituel, ETAT = 257, out = {};
        var lud = $gameActors.actor(3), kor = $gameActors.actor(2), ael = $gameActors.actor(4), ves = $gameActors.actor(1);
        var e = $gameTroop.members()[0], e2 = $gameTroop.members()[1];
        [e, e2].forEach(function (x) { x.addParam(0, 9999999); x.recoverAll(); });
        Math.random = function () { return 0.5; };
        function act(h, id, cible) {
            var a = new Game_Action(h); a.setSkill(id);
            a.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible));
            return a;
        }
        // un coup appliqué comme le moteur le fait ; on garde les dégâts
        function frapper(h, id, cible) {
            var a = act(h, id, cible); h.setMp(h.mmp); h.setTp(100);
            cible.clearResult(); a.apply(cible);
            return cible.result().hpDamage;
        }
        function nettoyer(x) { x._marquesAme = []; x.eraseState(ETAT); x.removeStateCounter(ETAT); x.recoverAll(); x._ctAnnonces = []; }

        // 1 · réglages
        out.reglages = $plugins.filter(function (p) { return p.name === 'LeSpirituel'; })[0];
        var st = $dataStates[ETAT];
        out.etat = { nom: st.name, icone: st.iconIndex, tours: st.maxTurns, fin: st.autoRemovalTiming };

        // 2 · qui écrit
        var parole = ael.skills().filter(function (s) { return LaParole.estParole(s) && s.damage.type === 1 && s.scope === 1; })[0];
        out.qui = {
            traitSpectral: S.estSpirituel(act(lud, 158, e)), registre: S.estSpirituel(act(lud, 1165, e)), aspiration: S.estSpirituel(act(lud, 466, e)),
            mouvement: S.estSpirituel(act(kor, 1106, e)), parole: S.estSpirituel(act(ael, parole.id, e)), attaque: S.estSpirituel(act(lud, 1, e)),
            ennemi: S.estSpirituel((function () { var a = new Game_Action(e); a.setSkill(158); return a; })())
        };
        nettoyer(e);
        frapper(kor, 1106, e); frapper(ael, parole.id, e); frapper(lud, 1, e);
        out.contreMarques = S.marques(e).length + (e.isStateAffected(ETAT) ? 1 : 0);

        // 3 · la marque
        nettoyer(e); lud.recoverAll();
        var d1 = frapper(lud, 158, e);
        out.m1 = { degats: d1, marques: S.marques(e), etat: e.isStateAffected(ETAT), compteur: e.getStateCounter(ETAT),
                   annonce: (e._ctAnnonces || []).map(function (a) { return a.texte; }) };
        frapper(lud, 158, e); frapper(lud, 1165, e);
        out.m3 = { n: S.marques(e).length, compteur: e.getStateCounter(ETAT) };
        var avant = JSON.stringify(S.marques(e).slice(1));
        var d4 = frapper(lud, 466, e);
        var apres = S.marques(e);
        out.m4 = { n: apres.length, compteur: e.getStateCounter(ETAT),
                   decale: JSON.stringify(apres.slice(0, 2)) === avant && apres[2].valeur === Math.floor(d4 * 0.4) };

        // 4 · l'ennemi agit : ça éclate
        var total = S.marques(e).reduce(function (t, m) { return t + m.valeur; }, 0);
        var hp0 = e.hp;
        var ea = new Game_Action(e); ea.setSkill(1); ea.setTarget(0); e._actions = [ea];
        BattleManager._subject = e; BattleManager.startAction(); BattleManager.endAction(); BattleManager._subject = null;
        out.eclat = { total: total, perdu: hp0 - e.hp, reste: S.marques(e).length, etat: e.isStateAffected(ETAT),
                      annonce: (e._ctAnnonces || []).map(function (a) { return a.texte; }).filter(function (t) { return /Éclat −/.test(t); }) };
        nettoyer(e2); var hp2 = e2.hp;
        var eb = new Game_Action(e2); eb.setSkill(1); eb.setTarget(0); e2._actions = [eb];
        BattleManager._subject = e2; BattleManager.startAction(); BattleManager.endAction(); BattleManager._subject = null;
        out.eclatSans = hp2 - e2.hp;
        // l'éclat qui tue : une vraie mise à mort (l'âme de PorteurDAmes) et l'âme qui revient à ludwing
        nettoyer(e); lud.recoverAll(); frapper(lud, 158, e);
        e.setHp(Math.max(1, Math.floor(S.marques(e)[0].valeur / 2)));
        var ames0 = $gameVariables.value(15); lud.setHp(Math.floor(lud.mhp / 2)); var pvL = lud.hp;
        var ec = new Game_Action(e); ec.setSkill(1); ec.setTarget(0); e._actions = [ec];
        BattleManager._subject = e; BattleManager.startAction(); BattleManager.endAction(); BattleManager._subject = null;
        out.eclatTue = { mort: e.isDead(), ames: $gameVariables.value(15) - ames0, pv: lud.hp - pvL, attendu: Math.floor(lud.mhp * 0.08) };
        e.revive(); nettoyer(e);

        // 5 · tombé marqué : l'âme revient
        nettoyer(e); lud.recoverAll(); frapper(lud, 158, e); frapper(lud, 158, e);
        lud.setHp(Math.floor(lud.mhp / 2)); var pv0 = lud.hp;
        e.gainHp(-e.hp);
        out.retour = { gagne: lud.hp - pv0, attendu: Math.floor(lud.mhp * 0.08 * 2), mort: e.isDead() };
        e.revive(); nettoyer(e);
        nettoyer(e2); lud.setHp(Math.floor(lud.mhp / 2)); pv0 = lud.hp;
        e2.gainHp(-e2.hp);
        out.retourSans = lud.hp - pv0;
        e2.revive(); nettoyer(e2);

        // 6 · la volonté
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        nettoyer(e); lud.recoverAll(); var plein = frapper(lud, 158, e);
        nettoyer(e); lud.setHp(Math.floor(lud.mhp / 2)); var moitie = frapper(lud, 158, e);
        var volMoitie = S.volonte(lud);
        ves.setHp(0); nettoyer(e); var unTombe = S.volonte(lud);
        kor.setHp(0); ael.setHp(0); lud.setHp(1); var plafond = S.volonte(lud);
        $gameParty.members().forEach(function (a) { a.revive(); a.recoverAll(); });
        nettoyer(e); kor.recoverAll(); var mvtPlein = frapper(kor, 1106, e);
        nettoyer(e); kor.setHp(Math.floor(kor.mhp / 2)); var mvtMoitie = frapper(kor, 1106, e);
        // un soin de l'âme : Encouragement (élément 2) de Korrah
        kor.recoverAll(); ael.setHp(1);
        var soinPlein = (function () { ael.clearResult(); var a = act(kor, 12, ael); a.apply(ael); return -ael.result().hpDamage; })();
        kor.setHp(Math.floor(kor.mhp / 2)); ael.setHp(1);
        var soinMoitie = (function () { ael.clearResult(); var a = act(kor, 12, ael); a.apply(ael); return -ael.result().hpDamage; })();
        out.volonte = { plein: plein, moitie: moitie, volMoitie: volMoitie, unTombe: unTombe, plafond: plafond,
                        mvtPlein: mvtPlein, mvtMoitie: mvtMoitie, soinPlein: soinPlein, soinMoitie: soinMoitie,
                        annonce: (lud._ctAnnonces || []).map(function (a) { return a.texte; }).filter(function (t) { return /Volonté/.test(t); }) };
        $gameParty.members().forEach(function (a) { a.recoverAll(); });

        // 7 · trois tours
        nettoyer(e); frapper(lud, 158, e);
        var tours = [];
        for (var i = 0; i < 4; i++) { e.onTurnEnd(); tours.push(e.isStateAffected(ETAT)); }
        out.tours = { suite: tours, marques: S.marques(e).length };
        nettoyer(e);
        return out;
    });

    console.log('1) Les réglages et la marque');
    v('LeSpirituel est actif : 40 % gardés, 3 marques au plus, 8 % rendus', r.reglages && r.reglages.status &&
      r.reglages.parameters.forceMarque === '40' && r.reglages.parameters.marquesMax === '3' && r.reglages.parameters.retourAme === '8');
    v('l\'état 257 « ᛟ Marque de l\'âme » : une icône, 3 tours, s\'use en fin de tour', r.etat.icone > 0 && r.etat.tours === 3 && r.etat.fin === 2, JSON.stringify(r.etat));

    console.log('\n2) Qui écrit une marque');
    v('ludwing : Trait Spectral (élément 2), Registre (élément 7), Aspiration d\'Âme (type ame)',
      r.qui.traitSpectral && r.qui.registre && r.qui.aspiration);
    v('contre-épreuve : pas un mouvement, pas une Parole, pas l\'Attaque, pas un ennemi',
      !r.qui.mouvement && !r.qui.parole && !r.qui.attaque && !r.qui.ennemi, JSON.stringify(r.qui));
    v('contre-épreuve : un mouvement, une Parole et une Attaque n\'écrivent rien sur l\'ennemi', r.contreMarques === 0);

    console.log('\n3) La marque');
    var m1 = r.m1;
    v('Trait Spectral touche : une marque, qui garde 40 % du coup', m1.marques.length === 1 && m1.marques[0].valeur === Math.floor(m1.degats * 0.4) && m1.marques[0].acteur === 3,
      m1.degats + ' de dégâts → ' + (m1.marques[0] && m1.marques[0].valeur));
    v('elle se voit : l\'état sur l\'ennemi, le chiffre 1, l\'annonce', m1.etat && m1.compteur === 1 && m1.annonce.some(function (t) { return /Marque ×1/.test(t); }), m1.annonce.join(' | '));
    v('trois coups : trois marques, le chiffre 3', r.m3.n === 3 && r.m3.compteur === 3);
    v('un quatrième : toujours 3, la plus vieille s\'en va, la nouvelle entre', r.m4.n === 3 && r.m4.compteur === 3 && r.m4.decale);

    console.log('\n4) Quand l\'ennemi agit, ça éclate');
    v('il agit : il perd d\'un coup toute la valeur de ses marques', r.eclat.perdu === r.eclat.total && r.eclat.total > 0, r.eclat.perdu + ' / ' + r.eclat.total);
    v('…les marques sont parties, l\'état aussi, et l\'éclat s\'est annoncé', r.eclat.reste === 0 && !r.eclat.etat && r.eclat.annonce.length > 0, r.eclat.annonce.join(''));
    v('contre-épreuve : un ennemi sans marque qui agit ne perd rien', r.eclatSans === 0, String(r.eclatSans));
    v('l\'éclat qui tue est une vraie mise à mort : l\'âme compte (PorteurDAmes), et l\'âme revient à ludwing',
      r.eclatTue.mort && r.eclatTue.ames >= 1 && r.eclatTue.pv === r.eclatTue.attendu, JSON.stringify(r.eclatTue));

    console.log('\n5) Tombé marqué, l\'âme revient');
    v('deux marques de ludwing : il reprend 16 % de ses PV max', r.retour.mort && r.retour.gagne === r.retour.attendu, r.retour.gagne + ' / ' + r.retour.attendu);
    v('contre-épreuve : un ennemi sans marque qui tombe ne rend rien', r.retourSans === 0, String(r.retourSans));

    console.log('\n6) La volonté');
    var w = r.volonte;
    v('à mi-PV : ×1,25 (les dégâts suivent)', Math.abs(w.volMoitie - 1.25) < 0.01 && Math.abs(w.moitie / w.plein - 1.25) < 0.01,
      w.plein + ' → ' + w.moitie + ' (×' + (w.moitie / w.plein).toFixed(3) + ')');
    v('un allié tombé : +0,25', Math.abs(w.unTombe - 1.5) < 0.01, String(w.unTombe));
    v('jamais plus de ×1,75', Math.abs(w.plafond - 1.75) < 0.001, String(w.plafond));
    v('un soin de l\'âme (Encouragement) aussi : ×1,25 à mi-PV', Math.abs(w.soinMoitie / w.soinPlein - 1.25) < 0.01, w.soinPlein + ' → ' + w.soinMoitie);
    v('contre-épreuve : un mouvement ne prend pas la volonté', w.mvtMoitie === w.mvtPlein, w.mvtPlein + ' / ' + w.mvtMoitie);
    v('la volonté s\'annonce au-dessus de ludwing', w.annonce.length > 0, w.annonce[0] || '');

    console.log('\n7) Trois tours');
    v('la marque tient 3 fins de tour, puis s\'efface avec ses valeurs', r.tours.marques === 0 &&
      (r.tours.suite.join(',') === 'true,true,false,false' || r.tours.suite.join(',') === 'true,true,true,false'),
      r.tours.suite.join(',') + ' · marques ' + r.tours.marques);
    await fermerCombat();

    // ── 8 · un vrai combat ─────────────────────────────────────────────
    console.log('\n8) Un vrai combat laissé tourner');
    await page.evaluate(function () {
        Game_Actor.prototype.isAutoBattle = function () { return true; };
        Game_Actor.prototype.makeAutoBattleActions = function () {
            this.clearActions();
            var act = new Game_Action(this);
            if (this.actorId() === 3) { act.setSkill(158); act.setTarget(0); window.__n = (window.__n || 0) + 1; } else { act.setGuard(); }
            this.setAction(0, act);
        };
        window.__vus = [];
        var an = CombatTactique.annoncer;
        CombatTactique.annoncer = function (b, t) { window.__vus.push(t); return an.apply(this, arguments); };
    });
    await ouvrirCombat();
    await page.evaluate(function () {
        $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); e.addParam(2, -e.atk + 1); e.addParam(4, -e.mat + 1); });
        $gameParty.members().forEach(function (a) { a.addParam(0, 9999999); a.recoverAll(); a.setMp(a.mmp); });
    });
    try {
        await page.waitForFunction(function () { return (window.__n || 0) >= 3 && $gameTroop.turnCount() >= 3; }, null, { timeout: 300000, polling: 300 });
    } catch (x) { }
    var vrai = await page.evaluate(function () { return { n: window.__n, vus: window.__vus, tour: $gameTroop.turnCount() }; });
    v('le combat a tourné (' + vrai.n + ' Traits Spectraux, tour ' + vrai.tour + ')', vrai.n >= 3);
    v('ludwing a marqué, et la marque s\'est annoncée', vrai.vus.some(function (t) { return /Marque ×/.test(t); }));
    v('l\'ennemi marqué a agi, et la marque a éclaté', vrai.vus.some(function (t) { return /Éclat −/.test(t); }), vrai.vus.filter(function (t) { return /ᛟ/.test(t); }).slice(0, 5).join(' | '));
    await fermerCombat();

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
