/*
 * BANC NAVIGATEUR — VESPER (LE PACTE, LES STYLES) ET AËL (LA BIBLIOTHÈQUE)
 * (Pacte v2.0, 2026-10-14 : ni Pacte ni Masque en Lame ; ce que font les kits
 *  et les ultimes de chaque Style : vesper_les_styles.js)
 * ---------------------------------------------------------------------------
 * JOKO : « Vesper V1 juste comme Arlecchino ET 3 parfait, et Aël parfait
 * tout — fais extrêmement attention pour que ce soit bien et jouable. »
 *
 * Chaque règle est jouée dans un vrai combat, et chacune a sa contre-épreuve :
 * une règle qu'on ne peut pas faire tomber ne prouve rien (§6).
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var vert = 0, rouge = 0;
function ok(nom, cond, detail) {
    if (cond) { vert++; console.log('   ✓ ' + nom + (detail ? '   ' + detail : '')); }
    else { rouge++; console.log('   ✗ ' + nom + (detail ? '   ' + detail : '')); }
}

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.split('\n')[0]); });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen(); }, null, { timeout: 180000 });
    await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.evaluate(function () {
        [1, 2, 3, 4].forEach(function (id) { if (!$gameParty.members().some(function (m) { return m.actorId() === id; })) { $gameParty.addActor(id); } });
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(3000);

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n══ VESPER — LE PACTE DE SANG ' + '═'.repeat(44));
    var v = await page.evaluate(function () {
        var out = {}, a = $gameActors.actor(1), e = $gameTroop.members()[0];
        $gameTroop.members().forEach(function (x) { x._paramPlus[0] += 9999999; x.setHp(x.mhp); });
        Game_Action.prototype.applyVariance = function (d) { return d; };  // le dé, figé pour mesurer
        // ⚠ Et le jet de touche : une attaque ratée n'absorbe pas la Dette
        //   (c'est juste, en jeu), mais la première version du banc virait au
        //   rouge une fois sur trois pour une chauve-souris qui esquivait.
        Game_Action.prototype.itemHit = function () { return 1; };
        Game_Action.prototype.itemEva = function () { return 0; };
        // ⚠ Comme le moteur : BattleManager._subject / _action désignent Vesper
        //   pendant SON action. C'est ce qui distingue le sang qu'elle boit
        //   (Voie du Sang) d'un soin venu d'ailleurs.
        function jouer(act, cible) { BattleManager._subject = a; BattleManager._action = act; act.apply(cible); BattleManager._subject = null; BattleManager._action = null; }
        function frappe(id, cible) { var act = new Game_Action(a); act.setSkill(id); a.useItem(act.item()); jouer(act, cible); return act; }
        function degats(id, cible) { var act = new Game_Action(a); act.setSkill(id); return act.makeDamageValue(cible, false); }

        out.types = a.addedSkillTypes().indexOf(22) >= 0 && [1265, 1266, 1267].every(function (i) { return a.hasSkill(i) || a.isLearnedSkill(i) || a.skills().some(function (s) { return s.id === i; }); });
        a.setMp(a.mmp); a.setTp(100);
        // v2.0 (2026-10-14) : en Lame, ni Pacte ni Masque — le Pacte se joue en Garde et en Sang.
        PacteDeSang.changerStyle('garde');

        // ① inscrire, puis ② absorber
        frappe(1138, e);
        out.dette = e.isStateAffected(PacteDeSang.dette);
        out.pacteApresMarque = PacteDeSang.pct();                    // l'inscription n'absorbe pas
        var sansMasque = degats(1, e);
        frappe(1, e);
        out.detteApres = e.isStateAffected(PacteDeSang.dette);
        out.pacteApresAbsorb = PacteDeSang.pct();
        out.masque = PacteDeSang.masque();
        // contre-épreuve : en Lame, le même coup n'absorbe rien
        PacteDeSang.poser(0); frappe(1138, e);
        PacteDeSang.changerStyle('lame'); frappe(1, e);
        out.lameAbsorbe = { dette: e.isStateAffected(PacteDeSang.dette), pacte: PacteDeSang.pct() };
        e.removeState(PacteDeSang.dette);

        // ③ le Masque, mesuré dans SON Style (chacun porte ses traits) : Pacte vide contre Pacte plein
        function ratio(s) { PacteDeSang.changerStyle(s); PacteDeSang.poser(0); var d0 = degats(1, e); PacteDeSang.poser(1.0); var d1 = degats(1, e); return { r: d1 / d0, masque: PacteDeSang.masque() }; }
        out.ratioGarde = ratio('garde');
        out.ratioSang = ratio('saignee');
        out.ratioLame = ratio('lame');
        // consommation : 7,5 % en Garde, 10 % en Sang, rien en Lame
        function conso(s) {
            PacteDeSang.changerStyle(s); PacteDeSang.poser(1.0); e.removeState(PacteDeSang.dette);
            var p0 = PacteDeSang.pacte(); a.setHp(Math.floor(a.mhp * 0.5)); var hp = a.hp;
            var act = new Game_Action(a); act.setAttack(); jouer(act, e);
            return { c: 1 - PacteDeSang.pacte() / p0, soin: a.hp - hp };
        }
        out.consoGarde = conso('garde');
        out.consoSang = conso('saignee');
        out.consoLame = conso('lame');
        // sous le seuil : pas de Masque (contre-épreuve)
        PacteDeSang.changerStyle('garde'); PacteDeSang.poser(0);
        var baseGarde = degats(1, e);
        PacteDeSang.poser(0.2);
        out.ratioSousSeuil = degats(1, e) / baseGarde;

        // ④ les soins
        a.setHp(Math.floor(a.mhp * 0.5)); PacteDeSang.poser(0.5);
        var hp0 = a.hp, pa0 = PacteDeSang.pacte();
        a.gainHp(1000);
        out.soinAvecPacte = { hp: a.hp - hp0, pacte: pa0 - PacteDeSang.pacte() };
        PacteDeSang.poser(0);
        var hp1 = a.hp; a.gainHp(1000);
        out.soinSansPacte = a.hp - hp1;
        // une potion aussi
        $gameParty.gainItem($dataItems[1], 1);
        var hp2 = a.hp, it = new Game_Action(a); it.setItem(1); it.apply(a);
        out.potion = a.hp - hp2;
        // v2.0 : en Lame, elle a posé son Pacte — les soins passent (soinsEnLame)
        PacteDeSang.changerStyle('lame'); PacteDeSang.poser(0.5);
        var hpL = a.hp, paL = PacteDeSang.pacte(); a.gainHp(1000);
        out.soinLame = { hp: a.hp - hpL, pacte: paL - PacteDeSang.pacte(), soignable: PacteDeSang.soignable(a) };
        PacteDeSang.changerStyle('garde'); out.soignableGarde = PacteDeSang.soignable(a);
        a.setHp(Math.floor(a.mhp * 0.5));

        // ⑤ Rendre le Sang : le soin d'abord, le coup (et son recul) ensuite
        a.setHp(Math.floor(a.mhp * 0.2)); PacteDeSang.poser(1.2);
        var pr = PacteDeSang.pacte(), hp3 = a.hp;
        var soinVu = 0, vg = Game_Battler.prototype.gainHp;
        Game_Battler.prototype.gainHp = function (x) { if (this === a && x > 0 && this._soinAutorise) { soinVu += x; } return vg.call(this, x); };
        frappe(1143, e);
        Game_Battler.prototype.gainHp = vg;
        out.rendre = { soin: soinVu, attendu: Math.floor(pr * 0.5 + a.atk * 1.5), pacte: PacteDeSang.pacte(), vivante: a.isAlive(), hp0: hp3, hp: a.hp };

        // Le recul du mana négatif : pas sur la part du Masque (en Garde : ni vol de vie, ni Masque coupé)
        PacteDeSang.changerStyle('garde'); a.setHp(a.mhp); a.setTp(100); e.removeState(PacteDeSang.dette);
        PacteDeSang.poser(0);
        var sans = new Game_Action(a); sans.setSkill(1139);
        var dSans = sans.makeDamageValue(e, false);
        PacteDeSang.poser(1.0);
        var avec = new Game_Action(a); avec.setSkill(1139);
        var hr = a.hp; BattleManager._subject = a; BattleManager._action = avec;
        var dAvec = avec.makeDamageValue(e, false); avec.executeDamage(e, dAvec);
        BattleManager._subject = null; BattleManager._action = null;
        out.recul = { base: dSans, total: dAvec, perdu: hr - a.hp, surLaBase: Math.floor(dSans * 0.15), surLeTotal: Math.floor(dAvec * 0.15) };

        // Sang : le Pacte consommé revient en PV
        PacteDeSang.changerStyle('saignee'); PacteDeSang.poser(1.0); a.setHp(Math.floor(a.mhp * 0.5)); e.removeState(PacteDeSang.dette);
        var hp4 = a.hp, p4 = PacteDeSang.pacte();
        var s2 = new Game_Action(a); s2.setAttack(); jouer(s2, e);
        out.saignee = { soin: a.hp - hp4, brule: p4 - PacteDeSang.pacte() };

        // Garde : plus de −40 % ni de Réserve (l'adaptation les remplace), mais DÉF ×1,4
        PacteDeSang.changerStyle('lame');
        var ea = new Game_Action(e); ea.setAttack();
        var coupLame = ea.makeDamageValue(a, false);
        PacteDeSang.changerStyle('garde'); PacteDeSang.poser(0);
        var coupGarde = ea.makeDamageValue(a, false);
        var sansRes = new Game_Action(a); sansRes.setAttack();
        out.garde = { lame: coupLame, garde: coupGarde, reserve: PacteDeSang.reserve(), apres: sansRes.makeDamageValue(e, false), base: degats(1, e) };
        PacteDeSang.changerStyle('lame');
        return out;
    });
    ok('Vesper ouvre « style » et connaît ses trois Styles', v.types);
    ok('Première Entaille inscrit la Dette', v.dette);
    ok('…sans l\'absorber dans le même geste', v.pacteApresMarque === 0);
    ok('le coup suivant absorbe (Garde) : Pacte = 65 %', !v.detteApres && Math.abs(v.pacteApresAbsorb - 0.65) < 0.01,
        Math.round(v.pacteApresAbsorb * 100) + ' %');
    ok('le Masque Rouge s\'allume (≥ 30 %)', v.masque);
    ok('en Lame, le coup n\'absorbe rien : la Dette reste, Pacte 0 (contre-épreuve)', v.lameAbsorbe.dette && v.lameAbsorbe.pacte === 0,
        Math.round(v.lameAbsorbe.pacte * 100) + ' %');
    ok('Masque en Garde, Pacte 100 % : ×1,60', Math.abs(v.ratioGarde.r - 1.6) < 0.02, '×' + v.ratioGarde.r.toFixed(2));
    ok('Masque en Sang : ×1,90 (la plus agressive)', Math.abs(v.ratioSang.r - 1.9) < 0.02, '×' + v.ratioSang.r.toFixed(2));
    ok('en Lame, pas de Masque même à 100 % (« son masque s\'enlève »)', Math.abs(v.ratioLame.r - 1) < 0.01 && !v.ratioLame.masque,
        '×' + v.ratioLame.r.toFixed(2));
    ok('sous 30 %, pas de Masque (contre-épreuve)', Math.abs(v.ratioSousSeuil - 1) < 0.01, '×' + v.ratioSousSeuil.toFixed(2));
    ok('en Garde, chaque coup consomme 7,5 % du Pacte', Math.abs(v.consoGarde.c - 0.075) < 0.01, Math.round(v.consoGarde.c * 1000) / 10 + ' %');
    ok('…sans qu\'il lui revienne (Arlecchino)', v.consoGarde.soin <= 0, '+' + v.consoGarde.soin + ' PV');
    ok('en Sang, 10 % par coup', Math.abs(v.consoSang.c - 0.10) < 0.01, Math.round(v.consoSang.c * 1000) / 10 + ' %');
    ok('en Lame, rien ne se consomme (contre-épreuve)', v.consoLame.c === 0, Math.round(v.consoLame.c * 1000) / 10 + ' %');
    ok('un soin rembourse le Pacte, pas les PV', v.soinAvecPacte.hp === 0 && v.soinAvecPacte.pacte === 1000,
        '+' + v.soinAvecPacte.hp + ' PV · −' + v.soinAvecPacte.pacte + ' au Pacte');
    ok('sans Pacte, en combat, on ne la soigne pas (Arlecchino)', v.soinSansPacte === 0);
    ok('une potion non plus', v.potion === 0, '+' + v.potion);
    ok('en Lame, le Pacte est posé : le soin passe tel quel', v.soinLame.hp === 1000 && v.soinLame.pacte === 0 && v.soinLame.soignable,
        '+' + v.soinLame.hp + ' PV · Pacte −' + v.soinLame.pacte);
    ok('…et en Garde, non (contre-épreuve)', !v.soignableGarde);
    ok('Rendre le Sang : ½ Pacte + 150 % ATQ, et le Pacte s\'efface', v.rendre.soin === v.rendre.attendu && v.rendre.pacte === 0,
        '+' + v.rendre.soin + ' PV (attendu ' + v.rendre.attendu + ')');
    ok('…et le recul ne la tue plus avant le soin', v.rendre.vivante && v.rendre.hp > v.rendre.hp0,
        v.rendre.hp0 + ' → ' + v.rendre.hp + ' PV');
    ok('le recul (15 %) porte sur la base, pas sur la part du Masque', v.recul.total > v.recul.base && Math.abs(v.recul.perdu - v.recul.surLaBase) <= 2,
        'perdu ' + v.recul.perdu + ' · base ' + v.recul.surLaBase + ' · sur le total ç\'aurait été ' + v.recul.surLeTotal);
    ok('Sang : le Pacte brûlé revient, et la Voie du Sang boit pour elle', v.saignee.brule > 0 && v.saignee.soin > v.saignee.brule,
        '+' + v.saignee.soin + ' PV (dont ' + v.saignee.brule + ' de Pacte)');
    ok('la Garde encaisse mieux que la Lame (DÉF ×1,4 contre ×0,85)', v.garde.garde < v.garde.lame, 'Lame ' + v.garde.lame + ' · Garde ' + v.garde.garde);
    ok('plus de Réserve ni de Libération (remplacées par l\'adaptation)', v.garde.reserve === 0 && v.garde.apres === v.garde.base,
        'Réserve ' + v.garde.reserve + ' · coup suivant ' + v.garde.apres + ' = ' + v.garde.base);

    // ── Les Styles ne font pas perdre le tour ────────────────────────────
    console.log('\n── LES STYLES, SANS PERDRE LE TOUR ' + '─'.repeat(38));
    var st = await page.evaluate(function () {
        var sc = SceneManager._scene, a = $gameActors.actor(1);
        BattleManager._phase = 'input'; BattleManager._actorIndex = $gameParty.members().indexOf(a);
        a.clearActions(); a.makeActions();
        sc._skillWindow.setActor(a); sc._skillWindow.setStypeId(22); sc._skillWindow.refresh();
        sc._skillWindow.show(); sc._skillWindow.activate();
        var idx = sc._skillWindow._data.map(function (s) { return s && s.id; }).indexOf(1266);
        sc._skillWindow.select(idx);
        var avant = BattleManager._actorIndex;
        sc.onSkillOk();
        return {
            style: PacteDeSang.style(), toujoursVesper: BattleManager.actor() === a, index: BattleManager._actorIndex === avant,
            commande: sc._actorCommandWindow.active, actionVide: !a.inputtingAction() || !a.inputtingAction().item()
        };
    });
    ok('choisir « Style — Garde » change le style', st.style === 'garde');
    ok('et on reste sur Vesper, son action encore à choisir', st.toujoursVesper && st.index && st.commande && st.actionVide);
    // JOKO : « quand Vesper change de style de combat […] un effet visuel, un truc très simple, juste que tu le voies. »
    var fx = await page.evaluate(function () {
        var a = $gameActors.actor(1), out = {};
        a._animations = []; PacteDeSang.changerStyle('saignee');
        out.n = a._animations.length; out.id = out.n ? a._animations[0].animationId : 0;
        out.nom = out.id ? $dataAnimations[out.id].name : ''; out.frames = out.id ? $dataAnimations[out.id].frames.length : 0;
        // contre-épreuve : le même changement fait par le moteur au début du combat ne joue rien
        a._animations = []; BattleManager.startBattle(); out.auDebut = a._animations.length;
        PacteDeSang.changerStyle('lame');
        return out;
    });
    ok('changer de Style joue un effet visuel sur Vesper', fx.n > 0 && fx.frames > 1, fx.id + ' « ' + fx.nom + ' »');
    ok('contre-épreuve : la reprise du Style au début du combat, elle, est muette', fx.auDebut === 0);

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n══ AËL — LA BIBLIOTHÈQUE ' + '═'.repeat(48));
    var l = await page.evaluate(function () {
        var out = {}, a = $gameActors.actor(4), e = $gameTroop.members()[0], e2 = $gameTroop.members()[1];
        $gameTemp._forceActionQueue = undefined;
        function agir(id, cible) {
            var act = new Game_Action(a); act.setSkill(id);
            act.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible));
            a._actions = [act];
            a.useItem(act.item()); act.apply(cible);
        }
        a.setMp(a.mmp);
        out.types = a.addedSkillTypes().indexOf(23) >= 0;
        // A · la Lecture monte quand elle dépense peu
        e._lectureAel = 0;
        agir(1273, e); out.l1 = BibliothequeAel.lecture(e);   // Voile, 12 PM
        agir(1274, e); out.l2 = BibliothequeAel.lecture(e);   // Oubli, 15 PM
        // … et tombe si elle paie trop de sa poche (contre-épreuve)
        agir(1277, e2);                                        // Fermeture, 30 PM
        out.l3 = BibliothequeAel.lecture(e);
        // Miracle : quatre actions économes
        e.appear(); e2.appear(); e2._porteRetour = 0;
        [1269, 1270, 1271, 1272, 1268].forEach(function (i) { a.forgetSkill(i); });
        e._lectureAel = 0; $gameTemp._forceActionQueue = undefined;
        for (var i = 0; i < 4; i++) { agir(1273, e); }
        var q = $gameTemp._forceActionQueue ? $gameTemp._forceActionQueue.list[0].parameters : null;
        var t = BibliothequeAel.flecheContre(e);
        out.miracle = { appris: t ? a.isLearnedSkill(t.id) : false, fleche: t ? $dataSkills[t.id].name : null, taux: t ? t.taux : null,
            tire: q ? q[2] : null, attendu: t ? t.id : null, lecture: BibliothequeAel.lecture(e), gratuit: a._miracleGratuit };
        // la flèche forcée ne coûte rien
        var mp0 = a.mp; var fa = new Game_Action(a); fa.setSkill(out.miracle.attendu || 1268); a.useItem(fa.item());
        out.miracle.cout = mp0 - a.mp;
        $gameTemp._forceActionQueue = undefined;
        // ennemi qui résiste à tout : pas de faille (contre-épreuve)
        var dur = new Game_Enemy(e.enemyId(), 0, 0);
        dur.elementRate = function () { return 0.5; };
        out.resistant = BibliothequeAel.flecheContre(dur);

        // B · le Contrat : Korrah paie, et la Lecture tient
        var k = $gameActors.actor(2); k.setMp(k.mmp);
        agir(1279, k);
        out.partenaire = BibliothequeAel.partenaire() ? BibliothequeAel.partenaire().name() : null;
        e._lectureAel = 0.5; e2._lectureAel = 0;
        var mpA = a.mp, mpK = k.mp;
        agir(1277, e2);                                          // 30 PM, payés par Korrah
        out.contrat = { ael: mpA - a.mp, korrah: mpK - k.mp, lecture: BibliothequeAel.lecture(e), lecture2: BibliothequeAel.lecture(e2) };
        out.protegeK = k.isStateAffected(237);
        e2.appear(); e2._porteRetour = 0;

        // Contrat Forcé : elle puise chez l'ennemi
        e.setMp(500); agir(1280, e);
        var mpE = e.mp, mpA2 = a.mp;
        agir(1275, e);                                            // Gouffre, 18 PM
        out.force = { ennemi: mpE - e.mp, ael: mpA2 - a.mp };

        // C · les Portes
        out.voile = e.isStateAffected(239);
        agir(1278, k); out.allege = k.isStateAffected(242) && Math.abs(k.agi / k.paramBase(6) - 1.5) < 0.6;
        a.setMp(a.mmp);
        // Fermeture : un non-boss part trois tours
        agir(1277, e2);
        out.fermeNonBoss = e2.isHidden();
        out.retour = e2._porteRetour - $gameTroop.turnCount();
        // pas le dernier debout
        agir(1277, e);
        out.fermeDernier = e.isHidden();
        e2.appear(); e2._porteRetour = 0;
        // pas un rang S
        var s = $dataEnemies.filter(function (x) { return x && /<Rang:\s*S>/i.test(x.note || ''); })[0];
        out.bossImmunise = BibliothequeAel.estBoss(new Game_Enemy(s.id, 0, 0));
        out.pasBoss = BibliothequeAel.estBoss(e);
        return out;
    });
    ok('Aël ouvre « portes »', l.types);
    ok('une action économe : Lecture +25 %', Math.abs(l.l1 - 0.25) < 0.001 && Math.abs(l.l2 - 0.5) < 0.001,
        Math.round(l.l1 * 100) + ' % → ' + Math.round(l.l2 * 100) + ' %');
    ok('payer 30 PM de sa poche : elle perd le fil (contre-épreuve)', l.l3 === 0);
    ok('à 100 % : MIRACLE — elle apprend la Flèche de la faille', l.miracle.appris, l.miracle.fleche + ' (dégâts ×' + l.miracle.taux + ')');
    ok('…et la tire aussitôt sur cet ennemi', l.miracle.tire === l.miracle.attendu);
    ok('…gratuitement', l.miracle.cout === 0, l.miracle.cout + ' PM');
    ok('un ennemi qui résiste à tout : pas de faille (contre-épreuve)', l.resistant === null);
    ok('le Contrat lie Korrah', l.partenaire === 'Korrah');
    ok('c\'est Korrah qui paie les 30 PM', l.contrat.ael === 0 && l.contrat.korrah === 30, 'Aël −' + l.contrat.ael + ' · Korrah −' + l.contrat.korrah);
    ok('…et la Lecture ne tombe pas : le 1er garde 50 %, le visé prend +25 %',
        Math.abs(l.contrat.lecture - 0.5) < 0.001 && Math.abs(l.contrat.lecture2 - 0.25) < 0.001,
        Math.round(l.contrat.lecture * 100) + ' % · ' + Math.round(l.contrat.lecture2 * 100) + ' %');
    ok('Korrah est couverte (Sous Contrat)', l.protegeK);
    ok('Contrat Forcé : l\'ennemi paie', l.force.ennemi === 18 && l.force.ael === 0, 'ennemi −' + l.force.ennemi + ' · Aël −' + l.force.ael);
    ok('le Voile tombe sur l\'ennemi', l.voile);
    ok('l\'Allègement allège', l.allege);
    ok('la Fermeture retire un ennemi ordinaire', l.fermeNonBoss);
    ok('…pour trois tours', l.retour === 3, l.retour + ' tours');
    ok('pas le dernier debout (contre-épreuve)', !l.fermeDernier);
    ok('un rang S ne se ferme pas', l.bossImmunise && !l.pasBoss);

    console.log('\n── LES ERREURS DU MOTEUR ' + '─'.repeat(48));
    ok('rien n\'a planté', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
    console.log('\n' + '═'.repeat(74) + '\n   ' + vert + ' vert · ' + rouge + ' rouge\n' + '═'.repeat(74) + '\n');
    await nav.close();
    process.exit(rouge ? 1 : 0);
})();
