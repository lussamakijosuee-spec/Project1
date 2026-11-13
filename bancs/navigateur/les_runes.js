/*
 * BANC NAVIGATEUR — LES RUNES (LEcrit.js v2.0, 2026-10-26)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-26 : le mana spirituel, ce sont des runes écrites, « avec une
 * technique simple le stylo d'âme qui permet de […] désigner un cercle dans
 * l'air ou le sol » ; il a choisi « Cercle, runes, fermer le cercle » : le
 * stylo d'âme trace un cercle, dans l'air sur une cible (il la suit) ou au sol
 * (une zone qui part quand l'ennemi y agit) ; trois runes au plus ; fermer le
 * cercle les fait partir ensemble ; deux runes qui s'accordent fusionnent ;
 * échange équivalent : chaque rune se paie en vie.
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. les fiches : chaque écrit est une rune (« Rune de Sceau : … »), son signe
 *      est écrit ; les états 257 « ᛟ Cercle » (dans l'air) et 260 (au sol) ;
 *   2. au sol : une rune qui vise plusieurs cibles se trace UNE fois, sur ce
 *      côté, et ne fait rien tout de suite ;
 *   3. le sol répond : après l'action d'un ennemi, le cercle côté ennemi part ;
 *      côté héros, seulement si l'ennemi a visé un héros ;
 *   4. l'accord : deux runes du même signe ×1,25 chacune ; deux signes
 *      différents, non ; le Sceau accordé est sûr ;
 *   5. la transmutation entière : trois du même signe, la vie payée revient ;
 *      deux, non ;
 *   6. trois au plus, dans l'air et au sol ensemble ; l'aide dit « au sol ».
 *   7. deux runes au choix (v2.1, JOKO : « tu mets un truc, et c'est toi qui
 *      l'actives au bon moment », « Deux runes au choix ») : une rune de zone
 *      gardée attend Activer, l'ennemi qui agit ne la fait pas partir ; un piège
 *      part ; le choix ne se pose que pour une rune de zone.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/les_runes.js
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
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging() && SceneManager.isCurrentSceneStarted() && SceneManager._scene.isActive(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.evaluate(function () {
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(2500);

    console.log('=== LES RUNES ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var L = LEcrit, AIR = 257, SOL = 260, ACT = 1309, out = {};
        var ves = $gameActors.actor(1), kor = $gameActors.actor(2), lud = $gameActors.actor(3), ael = $gameActors.actor(4);
        var e = $gameTroop.members()[0], e2 = $gameTroop.members()[1];
        [e, e2].forEach(function (x) { x.addParam(0, 9999999); x.recoverAll(); });
        var hasard = 0.5;
        Math.random = function () { return hasard; };
        function act(h, id, cible) {
            var a = new Game_Action(h); a.setSkill(id);
            if (cible) { a.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible)); }
            return a;
        }
        function lancer(h, id, cible) { var a = act(h, id, cible); a.makeTargets().forEach(function (t) { t.clearResult(); a.apply(t); }); return a; }
        function annonces(b) { return (b._ctAnnonces || []).map(function (x) { return x.texte; }); }
        function nettoyer() {
            hasard = 0.5;
            $gameParty.members().forEach(function (a) { a._ecrits = []; a.recoverAll(); a._ctAnnonces = []; a._rempart = false; });
            $gameTroop.members().concat($gameParty.members()).forEach(function (x) {
                [AIR, SOL].forEach(function (s) { x.eraseState(s); x.removeStateCounter(s); });
                x._ctAnnonces = []; x._scelle = 0;
            });
            [e, e2].forEach(function (x) { x.recoverAll(); });
        }
        /** Un ennemi agit pour de vrai : BattleManager.startAction puis endAction. */
        function ennemiAgit(qui, cible) {
            var a = new Game_Action(qui);
            if (cible) { a.setAttack(); a.setTarget($gameParty.members().indexOf(cible)); } else { a.setGuard(); }
            qui._actions = [a];
            BattleManager._subject = qui; BattleManager.startAction(); BattleManager.endAction(); BattleManager._subject = null;
        }

        // 1 · les fiches
        // les fiches des héros (elles portent <Art:>) ; un ennemi n'écrit pas
        var deHeros = function (s) { return s && s.meta && typeof s.meta.Art === 'string' && LesTroisArts.art(s) === 'ecrit'; };
        var ecrits = $dataSkills.filter(function (s) { return deHeros(s) && [3, 4, 5, 6, 10, 25].indexOf(s.stypeId) < 0; });
        out.fiches = { n: ecrits.length, sansRune: ecrits.filter(function (s) { return !/^Rune /.test(s.name); }).map(function (s) { return s.id + ' ' + s.name; }),
                       parole: $dataSkills.filter(function (s) { return deHeros(s) && /^Parole n°/.test(s.name); }).length,
                       signes: {}, nomSigne: [] };
        ecrits.forEach(function (s) {
            var g = typeof s.meta.Rune === 'string' ? s.meta.Rune.trim() : '';
            out.fiches.signes[g] = (out.fiches.signes[g] || 0) + 1;
            var attendu = { frappe: 'de Frappe', prise: 'de Prise', sceau: 'de Sceau', lien: 'de Lien', rempart: 'de Rempart' }[g];
            if (attendu && s.name.indexOf('Rune ' + attendu + ' : ') !== 0) { out.fiches.nomSigne.push(s.id + ' ' + s.name); }
        });
        out.etats = { air: $dataStates[AIR].name, sol: $dataStates[SOL] && $dataStates[SOL].name, solFin: $dataStates[SOL] && $dataStates[SOL].autoRemovalTiming };

        // 2 · au sol : Rune de Rempart : Encouragement (12, tous les alliés) ; Le Symbole (1170, tous les ennemis ;
        // pas Chaîne Courte : une rune de l'âme, du collier de ludwing, part tout de suite)
        nettoyer();
        ael.setHp(1);
        lancer(kor, 12, ael);
        out.solAllies = { ecrits: L.ecrits(kor).length, sol: L.ecrits(kor).map(function (m) { return m.sol; }).join(','), soin: ael.hp,
                          chiffres: $gameParty.battleMembers().map(function (a) { return a.isStateAffected(SOL) ? a.getStateCounter(SOL) : 0; }),
                          air: $gameParty.battleMembers().some(function (a) { return a.isStateAffected(AIR); }), annonce: annonces(kor) };
        var hp0 = e.hp, hp20 = e2.hp;
        lancer(lud, 1170, e);
        out.solEnnemis = { ecrits: L.ecrits(lud).length, sol: (L.ecrits(lud)[0] || {}).sol, perdu: hp0 - e.hp + hp20 - e2.hp,
                           chiffres: [e, e2].map(function (x) { return x.isStateAffected(SOL) ? x.getStateCounter(SOL) : 0; }) };
        // contre-épreuve : une rune qui vise une seule cible se trace dans l'air, sur elle
        lancer(lud, 158, e);
        out.air = { surE: e.isStateAffected(AIR) && e.getStateCounter(AIR), sol: (L.ecrits(lud)[1] || {}).sol || '' };

        // 3 · le sol répond
        // un ennemi qui garde (il ne vise aucun héros) : le cercle côté ennemi part, pas celui des héros
        hp0 = e.hp; hp20 = e2.hp;
        ennemiAgit(e2, null);
        out.repond = { ennemisPerdu: hp0 - e.hp + hp20 - e2.hp, ludReste: L.ecrits(lud).length, korReste: L.ecrits(kor).length, ael: ael.hp,
                       annonce: annonces(e2).concat(annonces(lud)), chiffreE: e.isStateAffected(SOL) };
        // un ennemi qui frappe un héros : le cercle des héros part (le soin arrive)
        ael.setHp(1);
        ennemiAgit(e, ves);
        out.repond.apres = { korReste: L.ecrits(kor).length, ael: ael.hp, chiffreAel: ael.isStateAffected(SOL) };

        // 4 · l'accord
        nettoyer();
        var ref = act(lud, 158, e).makeDamageValue(e, false);
        lud._ecrits = [{ cible: e, competence: 158 }, { cible: e, competence: 158 }];
        hp0 = e.hp; L.activer(lud);
        out.accord = { perdu: hp0 - e.hp, attendu: 2 * Math.round(ref * 1.25 * 1.15 * 1.25), ref: ref, annonce: annonces(lud) };
        // contre-épreuve : Frappe + Sceau (Faire Douter, 1242) — pas d'accord
        nettoyer();
        lud._ecrits = [{ cible: e, competence: 158 }, { cible: e2, competence: 1242 }];
        hp0 = e.hp; L.activer(lud);
        out.sansAccord = { perdu: hp0 - e.hp, attendu: Math.round(ref * 1.25 * 1.15), annonce: annonces(lud) };
        // le Sceau accordé est sûr : deux Sceaux (Faire Douter 50 %, Désorientation 25 %), le hasard contre
        nettoyer(); hasard = 0.99;
        BattleManager._actionBattlers = [e, e2];
        lud._ecrits = [{ cible: e, competence: 1242 }, { cible: e, competence: 94 }];
        L.activer(lud);
        out.sceau = { scelle: BattleManager._actionBattlers.indexOf(e) < 0 || e._scelle > 0 };
        nettoyer(); hasard = 0.99;
        BattleManager._actionBattlers = [e, e2];
        lud._ecrits = [{ cible: e, competence: 1242 }];
        L.activer(lud);
        out.sceau.seul = BattleManager._actionBattlers.indexOf(e) < 0 || e._scelle > 0;
        BattleManager._actionBattlers = [];

        // 5 · la transmutation entière : trois Frappe, la vie payée revient
        nettoyer();
        lud.setHp(Math.floor(lud.mhp / 2));
        var pv0 = lud.hp;
        lud._ecrits = [{ cible: e, competence: 158, pv: 40 }, { cible: e, competence: 158, pv: 40 }, { cible: e2, competence: 158, pv: 40 }];
        L.activer(lud);
        out.transmutation = { rendu: lud.hp - pv0, annonce: annonces(lud) };
        nettoyer();
        lud.setHp(Math.floor(lud.mhp / 2)); pv0 = lud.hp;
        lud._ecrits = [{ cible: e, competence: 158, pv: 40 }, { cible: e, competence: 158, pv: 40 }];
        L.activer(lud);
        out.transmutation.deux = lud.hp - pv0;
        // le prix est retenu quand la rune s'inscrit : le vrai paiement
        nettoyer();
        var a = act(lud, 158, e); lud._actions = [a];
        var avant = lud.hp; lud.paySkillCost($dataSkills[158]); var paye = avant - lud.hp;
        e.clearResult(); a.apply(e);
        out.prix = { paye: paye, retenu: (L.ecrits(lud)[0] || {}).pv };

        // 6 · trois au plus, dans l'air et au sol ensemble ; l'aide
        nettoyer();
        lancer(lud, 158, e); lancer(lud, 1170, e);
        out.max = { deux: lud.canUse($dataSkills[158]) };
        lancer(lud, 158, e2);
        out.max.trois = lud.canUse($dataSkills[158]); out.max.activer = lud.canUse($dataSkills[ACT]);
        var hw = SceneManager._scene._helpWindow;
        var faux = Object.create(Window_SkillList.prototype);
        faux._actor = lud; faux._helpWindow = hw; faux.item = function () { return $dataSkills[ACT]; };
        Window_SkillList.prototype.updateHelp.call(faux);
        out.aide = String(hw._text || '');

        // 7 · deux runes au choix : Garder (elle attend Activer) ou Piège (elle part quand l'ennemi agit)
        nettoyer();
        var g = act(lud, 1170, e); g._modeRune = 'garder';
        g.makeTargets().forEach(function (x) { x.clearResult(); g.apply(x); });
        hp0 = e.hp; hp20 = e2.hp;
        ennemiAgit(e2, null);
        out.garder = { reste: L.ecrits(lud).length, garde: !!(L.ecrits(lud)[0] || {}).garde, perdu: hp0 - e.hp + hp20 - e2.hp, annonce: annonces(lud) };
        hp0 = e.hp; hp20 = e2.hp;
        L.activer(lud);
        out.garder.active = hp0 - e.hp + hp20 - e2.hp; out.garder.apres = L.ecrits(lud).length;
        nettoyer();
        var p = act(lud, 1170, e); p._modeRune = 'piege';
        p.makeTargets().forEach(function (x) { x.clearResult(); p.apply(x); });
        hp0 = e.hp; hp20 = e2.hp;
        ennemiAgit(e2, null);
        out.piege = { perdu: hp0 - e.hp + hp20 - e2.hp, reste: L.ecrits(lud).length, annonce: annonces(lud) };
        var sc = SceneManager._scene, w = sc._fenetreRune;
        out.choix = { zone: L.auChoix(lud, $dataSkills[1170]), une: L.auChoix(lud, $dataSkills[158]), soutien: L.auChoix(kor, $dataSkills[12]),
                      fenetre: !!w && w.maxItems() === 2 && w.commandSymbol(0) === 'garder' && w.commandSymbol(1) === 'piege',
                      noms: w ? [w.commandName(0), w.commandName(1)] : [] };
        // le chemin du menu : choisir « Garder » pose le mode sur l'action en cours de saisie
        var enCours = new Game_Action(lud), biAvant = BattleManager.inputtingAction;
        BattleManager.inputtingAction = function () { return enCours; };
        var faussesFenetres = { _fenetreRune: w, _skillWindow: { activate: function () { }, item: function () { return $dataSkills[1170]; }, hide: function () { } },
            _helpWindow: sc._helpWindow, onSelectAction: function () { }, selectNextCommand: function () { } };
        try { Scene_Battle.prototype.choisirRune.call(faussesFenetres, 'garder'); } catch (x) { out.choixErreur = String(x).slice(0, 120); }
        BattleManager.inputtingAction = biAvant;
        out.choix.mode = enCours._modeRune;
        // 8 · effacer une rune : elle disparaît sans partir, la moitié de la vie payée revient
        nettoyer();
        lancer(lud, 158, e); lancer(lud, 1170, e);
        var ru = L.ecrits(lud); ru[0].pv = 400; ru[1].pv = 0; lud._ecrits = ru;
        lud.setHp(Math.floor(lud.mhp / 2)); hp0 = e.hp; var pvL = lud.hp;
        out.efface = { rate: L.effacer(lud, 7), resteRate: L.ecrits(lud).length };
        out.efface.rendu = L.effacer(lud, 0);
        out.efface.hp = lud.hp - pvL; out.efface.reste = L.ecrits(lud).length; out.efface.air = e.isStateAffected(257); out.efface.sol = e.isStateAffected(260);
        out.efface.rendu2 = L.effacer(lud, 0);
        out.efface.reste2 = L.ecrits(lud).length; out.efface.sol2 = e.isStateAffected(260); out.efface.perdu = hp0 - e.hp;
        out.efface.activer = lud.canUse($dataSkills[ACT]);
        var fe = sc._fenetreEffacer, avantE = fe && fe.active;
        if (fe) { [sc._partyCommandWindow, sc._actorCommandWindow, sc._skillWindow, sc._itemWindow, sc._actorWindow, sc._enemyWindow].forEach(function (x) { if (x) { x._av = x.active; x.active = false; } });
            fe.active = true; out.efface.saisie = sc.isAnyInputWindowActive(); fe.active = false; out.efface.saisieSans = sc.isAnyInputWindowActive(); fe.active = avantE;
            [sc._partyCommandWindow, sc._actorCommandWindow, sc._skillWindow, sc._itemWindow, sc._actorWindow, sc._enemyWindow].forEach(function (x) { if (x) { x.active = x._av; } }); }
        nettoyer();
        // tant qu'elle est ouverte, c'est la fenêtre de saisie : sinon MV rouvre les ordres derrière elle
        var actives = ['_partyCommandWindow', '_actorCommandWindow', '_skillWindow', '_itemWindow', '_actorWindow', '_enemyWindow'].map(function (k) { return sc[k]; }).filter(function (x) { return x && x.active; });
        actives.forEach(function (x) { x.active = false; });
        var avantR = w.active;
        w.active = true; out.choix.saisie = sc.isAnyInputWindowActive();
        w.active = false; out.choix.saisieSans = sc.isAnyInputWindowActive();
        w.active = avantR; actives.forEach(function (x) { x.active = true; });
        nettoyer();
        return out;
    });

    console.log('1) Les fiches');
    var f = r.fiches;
    v('chaque écrit (hors ultimes et branches des dons) s\'appelle « Rune … » (' + f.n + ')', f.n >= 30 && f.sansRune.length === 0, f.sansRune.slice(0, 4).join(' · '));
    v('plus aucun écrit ne s\'appelle « Parole n°X »', f.parole === 0, String(f.parole));
    v('le signe est sur la fiche, et le nom le dit (« Rune de Sceau : … »)', f.nomSigne.length === 0 && f.signes.sceau >= 3 && f.signes.rempart >= 3 && f.signes.lien >= 3 && f.signes.prise >= 3 && f.signes.frappe >= 3,
      JSON.stringify(f.signes) + ' ' + f.nomSigne.slice(0, 3).join(' · '));
    v('états : 257 « ᛟ Cercle » (dans l\'air), 260 « ✒ Cercle au sol », qui ne s\'use pas', r.etats.air === 'ᛟ Cercle' && r.etats.sol === '✒ Cercle au sol' && r.etats.solFin === 0, JSON.stringify(r.etats));

    console.log('\n2) Au sol');
    var s = r.solAllies;
    v('Encouragement (tous les alliés) : une seule rune, au sol côté héros, montrée sur chacun (1)', s.ecrits === 1 && s.sol === 'allies' && s.chiffres.every(function (n) { return n === 1; }) && !s.air, JSON.stringify(s));
    v('…elle ne soigne pas tout de suite, et « ✒ Cercle au sol » s\'annonce', s.soin === 1 && s.annonce.some(function (t) { return /(Piège|Gardée) au sol/.test(t); }), s.annonce.join(' | '));
    var se = r.solEnnemis;
    v('Le Symbole (tous les ennemis) : une rune au sol côté ennemi, rien ne part', se.ecrits === 1 && se.sol === 'ennemis' && se.perdu === 0 && se.chiffres.every(function (n) { return n === 1; }), JSON.stringify(se));
    v('contre-épreuve : Trait Spectral (une cible) se trace dans l\'air, sur elle', r.air.surE === 1 && r.air.sol === '', JSON.stringify(r.air));

    console.log('\n3) Le sol répond');
    var p = r.repond;
    v('un ennemi agit (il garde) : le cercle au sol côté ennemi part, l\'air reste', p.ennemisPerdu > 0 && p.ludReste === 1 && !p.chiffreE && p.annonce.some(function (t) { return /Le sol répond/.test(t); }), JSON.stringify(p).slice(0, 220));
    v('…contre-épreuve : il n\'a visé aucun héros, le cercle des héros attend', p.korReste === 1 && p.ael === 1);
    v('un ennemi frappe un héros : le cercle des héros part, le soin arrive', p.apres.korReste === 0 && p.apres.ael > 1 && !p.apres.chiffreAel, JSON.stringify(p.apres));

    console.log('\n4) L\'accord');
    var a = r.accord;
    v('deux Frappe ensemble : chacune ×1,25 (préparée) ×1,15 (résonance) ×1,25 (accord)', Math.abs(a.perdu - a.attendu) <= 2, a.perdu + ' / ' + a.attendu + ' (un coup lancé : ' + a.ref + ')');
    v('…« ᛟ Accord · Frappe » au-dessus de ludwing, et « ᛟ Le cercle se ferme ×2 »', a.annonce.some(function (t) { return /Accord · Frappe/.test(t); }) && a.annonce.some(function (t) { return /Le cercle se ferme ×2/.test(t); }), a.annonce.join(' | '));
    v('contre-épreuve : Frappe + Sceau, pas d\'accord', Math.abs(r.sansAccord.perdu - r.sansAccord.attendu) <= 2 && !r.sansAccord.annonce.some(function (t) { return /Accord/.test(t); }), r.sansAccord.perdu + ' / ' + r.sansAccord.attendu);
    v('le Sceau accordé est sûr (deux Sceaux, le hasard contre)', r.sceau.scelle);
    v('…contre-épreuve : un Sceau seul, le hasard contre, ne scelle pas', !r.sceau.seul);

    console.log('\n5) La transmutation entière');
    v('trois Frappe ensemble : la vie payée revient (3 × 40)', r.transmutation.rendu === 120 && r.transmutation.annonce.some(function (t) { return /Transmutation entière/.test(t); }), r.transmutation.rendu + ' · ' + r.transmutation.annonce.join(' | '));
    v('contre-épreuve : deux, la vie ne revient pas', r.transmutation.deux === 0, String(r.transmutation.deux));
    v('le prix d\'une rune est retenu quand elle s\'inscrit', r.prix.paye > 0 && r.prix.retenu === r.prix.paye, JSON.stringify(r.prix));

    console.log('\n6) Trois au plus, et l\'aide');
    v('dans l\'air et au sol ensemble : à 2, on inscrit encore ; à 3, non ; fermer le cercle, oui', r.max.deux && !r.max.trois && r.max.activer, JSON.stringify(r.max));
    v('Activer, dans l\'aide : « ᛟ Dans le cercle : … », la rune au sol le dit (« au sol » gardée, « piège » sinon ; en court « (sol) », « (piège) »)', /ᛟ (Dans le cercle|Cercle) : /.test(r.aide) && /au sol|\(sol\)|piège/.test(r.aide), r.aide.replace(/\n/g, ' / '));

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n7) Deux runes au choix');
    var gd = r.garder;
    v('Garder : l\'ennemi agit, la rune de zone reste au sol et rien ne part (« ᛟ Gardée au sol »)', gd.reste === 1 && gd.garde && gd.perdu === 0 && gd.annonce.some(function (t) { return /Gardée au sol/.test(t); }), JSON.stringify(gd).slice(0, 220));
    v('…c\'est Activer qui la fait partir', gd.active > 0 && gd.apres === 0, gd.active + ' PV · reste ' + gd.apres);
    v('Piège : l\'ennemi agit, elle part toute seule (« ✒ Piège au sol »)', r.piege.perdu > 0 && r.piege.reste === 0 && r.piege.annonce.some(function (t) { return /Piège au sol/.test(t); }), JSON.stringify(r.piege).slice(0, 200));
    v('le choix ne se pose que pour une rune de zone (Le Symbole, Encouragement), pas pour une rune à une cible', r.choix.zone && r.choix.soutien && !r.choix.une, JSON.stringify(r.choix));
    v('la fenêtre du choix : « Garder », puis « Piège »', r.choix.fenetre, r.choix.noms.join(' / '));
    v('choisir « Garder » dans le menu le pose sur l\'action', r.choix.mode === 'garder', String(r.choix.mode) + (r.choixErreur ? ' · ' + r.choixErreur : ''));

    v('la fenêtre du choix ouverte est la fenêtre de saisie (sinon les ordres se rouvrent derrière et OK valide les deux) ; fermée, non', r.choix.saisie === true && r.choix.saisieSans === false, r.choix.saisie + ' / ' + r.choix.saisieSans);
    console.log('\n8) Effacer une rune');
    var ef = r.efface;
    v('effacer la rune dans l\'air : elle disparaît de sa cible, la moitié de la vie payée revient (400 → +200), l\'autre reste', ef.rendu === 200 && ef.hp === 200 && ef.reste === 1 && !ef.air && ef.sol, JSON.stringify(ef));
    v('effacer la rune au sol : le cercle au sol s\'efface, rien ne revient d\'une rune qui n\'a rien coûté, et rien n\'est parti', ef.rendu2 === 0 && ef.reste2 === 0 && !ef.sol2 && ef.perdu === 0 && !ef.activer, JSON.stringify(ef));
    v('contre-épreuve : effacer une rune qui n\'existe pas ne change rien', ef.rate === -1 && ef.resteRate === 2);
    v('la fenêtre « Effacer » ouverte est la fenêtre de saisie ; fermée, non', ef.saisie === true && ef.saisieSans === false, ef.saisie + ' / ' + ef.saisieSans);
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
