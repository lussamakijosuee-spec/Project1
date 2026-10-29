/*
 * BANC NAVIGATEUR — LES RÉACTIONS ÉLÉMENTAIRES (FusionElements v2.0, 2026-10-29)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-29 : « je voulais comme sur genshin des combo élémentaires
 * qui donnait un effet », puis, sur la table proposée : « Oui et modifier le
 * plugin en vrai rework monstrueux ».
 *
 * Un coup d'élément laisse son aura sur l'ennemi (2 tours) ; un autre élément
 * la fait réagir. Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. l'aura : posée par un coup qui blesse, pas par un coup raté ; le même
 *      élément la rafraîchit, un élément qui ne réagit pas la remplace ; un
 *      ennemi n'en pose pas sur un héros ; elle tient 2 fins de tour ;
 *   2. chacune des 12 réactions fait ce que dit la table — et pas sans
 *      l'aura : Vapeur et Fonte ×1,5 (et dans l'autre ordre), Surcharge sur
 *      l'autre ennemi, Lave, Givre (pas sur un boss), Électrocharge à chaque
 *      fin de tour pendant 2 tours, Plante, Supraconduction (DÉF ×0,5), Métal,
 *      Cristallisation (le prochain coup reçu ÷2, une fois), Crépuscule,
 *      Dispersion (l'aura passe à l'autre, et réagit avec la sienne) ;
 *   3. une Fusion de LaParole ne pose ni ne réagit ; Fusion._eteint coupe tout ;
 *   4. ça se voit : l'annonce au-dessus de l'ennemi, le compte du combat, et
 *      au choix de la cible, l'aide dit « ◈ Feu → 💨 Vapeur ».
 * Pour mesurer les dégâts sans hasard : les Chauves-souris perdent en mémoire
 * leur rang (donc leur bouclier) et leur instinct (le mirage).
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   cmd /c start "" /b /wait /low /affinity 3 node bancs/navigateur/les_reactions.js
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
        // sans bouclier ni mirage : des dégâts sans hasard
        $dataTroops[1].members.forEach(function (m) {
            var en = $dataEnemies[m.enemyId];
            en.note = en.note.replace(/<\s*Rang\s*:[^>]*>/gi, '').replace(/<\s*Instinct\s*:[^>]*>/gi, '');
            delete en.meta.Rang; delete en.meta.Instinct;
        });
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(2500);

    console.log('=== LES RÉACTIONS ÉLÉMENTAIRES ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        if (window.LesInstincts) { LesInstincts._eteint = true; }
        var o = {}, F = window.Fusion, A = F.etats.aura;
        var kor = $gameActors.actor(2), ael = $gameActors.actor(4);
        var e = $gameTroop.members()[0], e2 = $gameTroop.members()[1];
        $gameTroop.members().forEach(function (x) { x.addParam(0, 9999999); x.recoverAll(); });
        $gameParty.members().forEach(function (x) { x.addParam(0, 9999999); x.recoverAll(); });
        Math.random = function () { return 0.5; };
        // une compétence d'essai par élément : 1 000 de dégâts, toucher sûr, sans art
        function essai(el, id, succes) {
            var s = JSON.parse(JSON.stringify($dataSkills[1]));
            s.id = id; s.name = 'Essai ' + el; s.damage.elementId = el; s.damage.formula = '1000'; s.damage.variance = 0; s.damage.critical = false;
            s.scope = 1; s.hitType = 0; s.successRate = succes === undefined ? 100 : succes; s.repeats = 1; s.effects = []; s.mpCost = 0; s.tpCost = 0;
            s.note = '<Art: aucun>'; s.meta = { Art: ' aucun' }; s.multipleElements = [];
            $dataSkills[id] = s; return id;
        }
        var SK = {}; [8, 9, 10, 11, 12, 13, 14, 15].forEach(function (el) { SK[el] = essai(el, 9000 + el); });
        var RATE = essai(8, 9100, 0);                                   // un coup de Feu qui rate
        function propre(b) {
            b.recoverAll(); b.clearResult();
            Object.keys(A).forEach(function (k) { b.eraseState(A[k]); });
            [F.etats.gele, F.etats.supra, F.etats.electro, F.etats.cristal, 91, 5, 136].forEach(function (id) { b.eraseState(id); });
            b._electro = null; b._cristal = false; b._gele = 0; b._ctAnnonces = []; b.refresh();
        }
        function coup(h, el, cible, id) {
            var a = new Game_Action(h); a.setSkill(id || SK[el]);
            a.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible));
            h._actions = [a]; BattleManager._subject = h; BattleManager.startAction();
            cible.clearResult(); a.apply(cible);
            var d = cible.result().hpDamage;
            BattleManager.endAction(); BattleManager._subject = null;
            return d;
        }
        function auraDe(b) { return F.aura(b); }
        function annonces(b) { return (b._ctAnnonces || []).map(function (x) { return x.texte; }); }
        function poser(b, el) { b.addNewState(A[el]); b.resetStateCounts(A[el]); b.refresh(); }
        // comme un vrai tour : startTurn remet le drapeau de YEP (une fin de tour par tour), et plus aucun
        // chiffre ne s'affiche (YEP attend la fin des popups — la scène ne tourne pas, ici)
        BattleManager._spriteset.isPopupPlaying = function () { return false; };
        function finDeTour() { $gameTroop._turnCount++; BattleManager._enteredEndPhase = false; BattleManager.endTurn(); }

        // 1 · l'aura
        propre(e); coup(ael, 8, e); o.pose = auraDe(e);
        propre(e); coup(ael, 8, e, RATE); o.rate = auraDe(e);
        propre(e); coup(ael, 8, e); coup(ael, 8, e); o.meme = auraDe(e);
        propre(e); coup(ael, 8, e); coup(ael, 14, e); o.remplace = auraDe(e);
        propre(kor); var ge = new Game_Action(e); ge.setSkill(SK[8]); ge.setTarget($gameParty.members().indexOf(kor)); kor.clearResult(); ge.apply(kor); o.surHeros = auraDe(kor);
        propre(e); coup(ael, 8, e); finDeTour(); o.apres1 = auraDe(e); finDeTour(); o.apres2 = auraDe(e);

        // 2 · les réactions
        function reaction(el1, el2, cible, lanceur) {
            cible = cible || e; lanceur = lanceur || ael;
            propre(cible); propre(e2); propre(lanceur);
            var base = coup(lanceur, el2, cible);                       // sans aura
            propre(cible); poser(cible, el1); cible._ctAnnonces = [];
            var avant = F.compte();
            var d = coup(lanceur, el2, cible);
            return { base: base, d: d, aura: auraDe(cible), annonces: annonces(cible), compte: F.compte(), avant: avant };
        }
        var x;
        x = reaction(8, 9); o.vapeur = { k: x.d / x.base, brule: e.isStateAffected(91), aveugle: e.isStateAffected(5), aura: x.aura, annonce: x.annonces.filter(function (t) { return /VAPEUR/.test(t); })[0] || '' };
        x = reaction(9, 8); o.vapeurInverse = x.d / x.base;
        x = reaction(8, 13); o.fonte = x.d / x.base;
        x = reaction(14, 9); o.sansReaction = x.d / x.base;            // Lumière puis Eau : rien
        propre(e2); var pv2 = e2.hp; x = reaction(8, 12); o.surcharge = { autre: pv2 - e2.hp, coup: x.d };
        x = reaction(8, 11); o.lave = e.isStateAffected(91);
        BattleManager._actionBattlers = [e, e2];
        x = reaction(9, 13); o.givre = { retire: BattleManager._actionBattlers.indexOf(e) < 0, etat: e.isStateAffected(F.etats.gele) };
        BattleManager._actionBattlers = [];
        x = reaction(9, 13); o.givreSuivant = { gele: e._gele, etat: e.isStateAffected(F.etats.gele) };
        e._gele = 0;
        var note = e.enemy().note; e.enemy().note = note + '\n<Rang: S>';
        BattleManager._actionBattlers = [e, e2];
        x = reaction(9, 13); o.givreBoss = { reste: BattleManager._actionBattlers.indexOf(e) >= 0, gele: e._gele || 0, annonce: x.annonces.join(' | ') };
        e.enemy().note = note; BattleManager._actionBattlers = [];
        x = reaction(9, 12); var hpE = e.hp; finDeTour(); var t1 = hpE - e.hp; finDeTour(); var t2 = hpE - t1 - e.hp; finDeTour(); var t3 = hpE - t1 - t2 - e.hp;
        o.electro = { coup: x.d, t1: t1, t2: t2, t3: t3, etat: e.isStateAffected(F.etats.electro) };
        ael.setHp(Math.floor(ael.mhp / 2)); var pvA = ael.hp;
        x = reaction(9, 11); o.plante = { soin: ael.hp - pvA, coup: x.d };
        // (propre() remet le lanceur à plein : on le remet à moitié juste avant le coup)
        propre(e); propre(ael); poser(e, 9); ael.setHp(Math.floor(ael.mhp / 2)); pvA = ael.hp; var dp = coup(ael, 11, e); o.plante = { soin: ael.hp - pvA, coup: dp };
        propre(e); var defAvant = e.def; poser(e, 12); coup(ael, 13, e); o.supra = { avant: defAvant, apres: e.def, etat: e.isStateAffected(F.etats.supra) };
        x = reaction(11, 12); o.metal = e.isStateAffected(136);
        propre(e); propre(kor); poser(e, 11); coup(kor, 13, e); o.cristal = { porte: !!kor._cristal, etat: kor.isStateAffected(F.etats.cristal) };
        var ea = new Game_Action(e); ea.setAttack(); var dCristal = ea.makeDamageValue(kor, false); var dEnsuite = ea.makeDamageValue(kor, false);
        o.cristal.k = dCristal / dEnsuite; o.cristal.parti = !kor._cristal && !kor.isStateAffected(F.etats.cristal);
        propre(e); propre(ael); poser(e, 14); ael.setHp(Math.floor(ael.mhp / 2)); pvA = ael.hp; var dc = coup(ael, 15, e);
        o.crepuscule = { aveugle: e.isStateAffected(5), soin: ael.hp - pvA, coup: dc };
        // Dispersion : le Feu de l'un passe à l'autre ; et sur un autre qui portait l'Eau, il réagit (Vapeur, sur le souffle)
        propre(e); propre(e2); poser(e, 8); var dd = coup(ael, 10, e); o.disperse = { e: auraDe(e), e2: auraDe(e2), coup: dd };
        propre(e); propre(e2); poser(e, 8); poser(e2, 9); var pvB = e2.hp; e2._ctAnnonces = []; coup(ael, 10, e);
        o.disperseReagit = { e2: auraDe(e2), souffle: pvB - e2.hp, brule: e2.isStateAffected(91), annonce: annonces(e2).filter(function (t) { return /VAPEUR/.test(t); })[0] || '' };
        propre(e); propre(e2); poser(e, 10); coup(ael, 12, e); o.disperseInverse = auraDe(e2);

        // 3 · une Fusion de LaParole ; tout coupé
        propre(e); poser(e, 8);
        var fu = new Game_Action(ael); fu.setSkill(SK[9]); fu.setTarget(e.index()); fu._paroleDecidee = true; fu._paroleElements = [17];
        e.clearResult(); fu.apply(e); o.fusionLP = { aura: auraDe(e), brule: e.isStateAffected(91) };
        propre(e); F._eteint = true; coup(ael, 8, e); o.eteint = auraDe(e); poser(e, 8); coup(ael, 9, e); o.eteintReaction = e.isStateAffected(91); F._eteint = false;

        // 3 bis · chaque réaction joue SON animation, sur la cible (pas au centre de l'écran)
        var jouees = [], sa = e.startAnimation;
        e.startAnimation = function (id) { jouees.push(id); return sa.apply(this, arguments); };
        var paires = { vapeur: [8, 9], fonte: [8, 13], surcharge: [8, 12], lave: [8, 11], givre: [9, 13], electrocharge: [9, 12],
            plante: [9, 11], supraconduction: [12, 13], metal: [11, 12], cristallisation: [11, 13], crepuscule: [14, 15], dispersion: [8, 10] };
        o.anims = {};
        Object.keys(paires).forEach(function (r) {
            propre(e); propre(e2); poser(e, paires[r][0]); jouees.length = 0; coup(ael, paires[r][1], e);
            var id = jouees[0] || 0, a = $dataAnimations[id];
            o.anims[r] = { id: id, nom: a ? a.name : '', image: a ? a.animation1Name : '', position: a ? a.position : -1 };
        });
        e.startAnimation = sa;

        // 4 · l'aide au choix de la cible
        propre(e); poser(e, 8);
        var w = new Window_Help(2), ecrit = [], dt = w.drawText;
        w.drawText = function (t) { ecrit.push(String(t)); return dt.apply(this, arguments); };
        var act = new Game_Action(ael); act.setSkill(SK[9]);
        var vraie = BattleManager.inputtingAction; BattleManager.inputtingAction = function () { return act; };
        w.drawBattler(e); o.aide = ecrit.slice();
        ecrit.length = 0; propre(e); w.drawBattler(e); o.aideSans = ecrit.slice();
        BattleManager.inputtingAction = vraie; w.drawText = dt;
        o.compteFin = F.compte();
        o.ancienneApi = typeof F.enSuspens === 'function';
        return o;
    });

    console.log('1) L\'aura');
    v('un coup de Feu qui blesse laisse ◈ Feu', r.pose === 8, String(r.pose));
    v('…contre-épreuve : un coup qui rate, rien', r.rate === 0, String(r.rate));
    v('le même élément la garde ; un élément qui ne réagit pas (Lumière) la remplace', r.meme === 8 && r.remplace === 14, r.meme + ' · ' + r.remplace);
    v('un ennemi ne pose pas d\'aura sur un héros (réglage)', r.surHeros === 0, String(r.surHeros));
    v('elle tient 2 fins de tour', r.apres1 === 8 && r.apres2 === 0, r.apres1 + ' puis ' + r.apres2);

    console.log('\n2) Les réactions');
    v('💨 Vapeur (Feu, puis Eau) : ×1,5, Brûlure et Aveuglé, l\'aura consommée', Math.abs(r.vapeur.k - 1.5) < 0.02 && r.vapeur.brule && r.vapeur.aveugle && r.vapeur.aura === 0, JSON.stringify(r.vapeur));
    v('…et dans l\'autre ordre (Eau, puis Feu)', Math.abs(r.vapeurInverse - 1.5) < 0.02, String(r.vapeurInverse));
    v('🔥 Fonte (Feu, puis Glace) : ×1,5', Math.abs(r.fonte - 1.5) < 0.02, String(r.fonte));
    v('…contre-épreuve : Lumière puis Eau, ×1', Math.abs(r.sansReaction - 1) < 0.01, String(r.sansReaction));
    v('💥 Surcharge : l\'autre ennemi prend la moitié du coup', r.surcharge.autre > 0 && Math.abs(r.surcharge.autre - r.surcharge.coup * 0.5) <= 1, JSON.stringify(r.surcharge));
    v('🌋 Lave : Brûlure', r.lave);
    v('🧊 Givre : il n\'a pas encore agi, il perd cette action (et il est Gelé)', r.givre.retire && r.givre.etat, JSON.stringify(r.givre));
    v('…il a déjà agi : il perd celle du tour suivant', r.givreSuivant.gele > 0 && r.givreSuivant.etat, JSON.stringify(r.givreSuivant));
    v('…contre-épreuve : un boss (rang S) n\'est pas gelé, et ça se dit', r.givreBoss.reste && !r.givreBoss.gele && /résiste/.test(r.givreBoss.annonce), JSON.stringify(r.givreBoss));
    v('⚡ Électrocharge : 25 % du coup à 2 fins de tour, puis rien', r.electro.t1 > 0 && Math.abs(r.electro.t1 - r.electro.coup * 0.25) <= 1 && r.electro.t2 === r.electro.t1 && r.electro.t3 === 0 && !r.electro.etat, JSON.stringify(r.electro));
    v('🌿 Plante : le lanceur reprend 15 % du coup', r.plante.soin > 0 && Math.abs(r.plante.soin - r.plante.coup * 0.15) <= 1, JSON.stringify(r.plante));
    v('❄ Supraconduction : DÉF ×0,5', r.supra.etat && Math.abs(r.supra.apres - r.supra.avant * 0.5) <= 1, JSON.stringify(r.supra));
    v('⚙ Métal : Paralysie', r.metal);
    v('💎 Cristallisation : le lanceur a son cristal ; le prochain coup reçu ÷2, une fois', r.cristal.porte && r.cristal.etat && Math.abs(r.cristal.k - 0.5) < 0.02 && r.cristal.parti, JSON.stringify(r.cristal));
    v('🌗 Crépuscule : Aveuglé, et le lanceur reprend 10 %', r.crepuscule.aveugle && r.crepuscule.soin > 0 && Math.abs(r.crepuscule.soin - r.crepuscule.coup * 0.1) <= 1, JSON.stringify(r.crepuscule));
    v('🌪 Dispersion : le Feu de l\'un passe à l\'autre', r.disperse.e === 0 && r.disperse.e2 === 8, JSON.stringify(r.disperse));
    v('…sur un autre qui portait l\'Eau : il réagit (Vapeur), sur le souffle', r.disperseReagit.souffle > 0 && r.disperseReagit.brule && r.disperseReagit.e2 === 0 && !!r.disperseReagit.annonce, JSON.stringify(r.disperseReagit));
    v('…et dans l\'autre ordre (Vent, puis Foudre) : la Foudre passe', r.disperseInverse === 12, String(r.disperseInverse));

    console.log('\n3) Ce qui ne réagit pas');
    v('une Fusion de LaParole ne pose ni ne réagit', r.fusionLP.aura === 8 && !r.fusionLP.brule, JSON.stringify(r.fusionLP));
    v('Fusion._eteint coupe tout', r.eteint === 0 && !r.eteintReaction);

    console.log('\n4) Ce qui se voit');
    v('l\'annonce au-dessus de l\'ennemi : « 💨 VAPEUR ×1,5 »', /💨 VAPEUR · ×1,5/.test(r.vapeur.annonce), r.vapeur.annonce);
    v('le compte du combat', (r.compteFin.vapeur || 0) >= 2 && (r.compteFin.fonte || 0) >= 1, JSON.stringify(r.compteFin));
    var an = r.anims, ks = Object.keys(an);
    var liste = ks.map(function (k) { return k + ' ' + an[k].id + ' « ' + an[k].nom + ' » (' + an[k].image + ')'; }).join(' · ');
    v('chaque réaction joue une animation sur la cible', ks.length === 12 && ks.every(function (k) { return an[k].id > 0 && an[k].image; }), liste);
    v('…une image différente pour chacune (12 sur 12)', ks.map(function (k) { return an[k].image; }).filter(function (x, i, l) { return l.indexOf(x) === i; }).length === 12);
    v('…jouée sur l\'ennemi, pas au centre de l\'écran', ks.every(function (k) { return an[k].position !== 3; }),
        ks.filter(function (k) { return an[k].position === 3; }).join(', '));
    v('au choix de la cible, l\'aide dit « ◈ Feu → 💨 Vapeur »', r.aide.some(function (t) { return /◈ Feu → 💨 Vapeur/.test(t); }), r.aide.join(' | '));
    v('…sans aura, ce que le coup posera (« → ◈ Eau »)', r.aideSans.some(function (t) { return /→ ◈ Eau/.test(t); }), r.aideSans.join(' | '));
    v('l\'ancienne API (window.Fusion) reste', r.ancienneApi);

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
