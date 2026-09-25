/*
 * BANC NAVIGATEUR — VESPER (LE PACTE, LES STYLES) ET AËL (LA BIBLIOTHÈQUE)
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
        PacteDeSang.changerStyle('lame');

        // ① inscrire, puis ② absorber
        frappe(1138, e);
        out.dette = e.isStateAffected(PacteDeSang.dette);
        out.pacteApresMarque = PacteDeSang.pct();                    // l'inscription n'absorbe pas
        var sansMasque = degats(1, e);
        frappe(1, e);
        out.detteApres = e.isStateAffected(PacteDeSang.dette);
        out.pacteApresAbsorb = PacteDeSang.pct();
        out.masque = PacteDeSang.masque();

        // ③ le Masque : +0,6 × 1,5 (Lame) × Pacte%
        PacteDeSang.poser(1.0);
        var avecMasque = degats(1, e);
        out.ratioLame = avecMasque / sansMasque;
        PacteDeSang.changerStyle('saignee');
        out.ratioSaignee = degats(1, e) / sansMasque;
        PacteDeSang.changerStyle('lame');
        // consommation : 10 % en Lame
        PacteDeSang.poser(1.0);
        var p0 = PacteDeSang.pacte();
        a.setHp(Math.floor(a.mhp * 0.5)); var hpL = a.hp;
        var act = new Game_Action(a); act.setAttack(); jouer(act, e);
        out.consoLame = 1 - PacteDeSang.pacte() / p0;
        out.lameNeBoitPas = a.hp <= hpL;
        // sous le seuil : pas de Masque (contre-épreuve)
        PacteDeSang.poser(0.2);
        out.ratioSousSeuil = degats(1, e) / sansMasque;

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

        // ⑤ Rendre le Sang : le soin d'abord, le coup (et son recul) ensuite
        a.setHp(Math.floor(a.mhp * 0.2)); PacteDeSang.poser(1.2);
        var pr = PacteDeSang.pacte(), hp3 = a.hp;
        var soinVu = 0, vg = Game_Battler.prototype.gainHp;
        Game_Battler.prototype.gainHp = function (x) { if (this === a && x > 0 && this._soinAutorise) { soinVu += x; } return vg.call(this, x); };
        frappe(1143, e);
        Game_Battler.prototype.gainHp = vg;
        out.rendre = { soin: soinVu, attendu: Math.floor(pr * 0.5 + a.atk * 1.5), pacte: PacteDeSang.pacte(), vivante: a.isAlive(), hp0: hp3, hp: a.hp };

        // Le recul du mana négatif : pas sur la part du Masque
        PacteDeSang.changerStyle('lame'); a.setHp(a.mhp); a.setTp(100);
        PacteDeSang.poser(0);
        var sans = new Game_Action(a); sans.setSkill(1139);
        var dSans = sans.makeDamageValue(e, false);
        PacteDeSang.poser(1.0);
        var avec = new Game_Action(a); avec.setSkill(1139);
        var hr = a.hp; BattleManager._subject = a; BattleManager._action = avec;
        var dAvec = avec.makeDamageValue(e, false); avec.executeDamage(e, dAvec);
        BattleManager._subject = null; BattleManager._action = null;
        out.recul = { base: dSans, total: dAvec, perdu: hr - a.hp, surLaBase: Math.floor(dSans * 0.15), surLeTotal: Math.floor(dAvec * 0.15) };

        // Saignée : le Pacte consommé revient en PV
        PacteDeSang.changerStyle('saignee'); PacteDeSang.poser(1.0); a.setHp(Math.floor(a.mhp * 0.5));
        var hp4 = a.hp, p4 = PacteDeSang.pacte();
        var s2 = new Game_Action(a); s2.setAttack(); jouer(s2, e);
        out.saignee = { soin: a.hp - hp4, brule: p4 - PacteDeSang.pacte() };

        // Garde : −40 %, Réserve, Libération qui inscrit
        PacteDeSang.changerStyle('lame');
        var ea = new Game_Action(e); ea.setAttack();
        var coupLame = ea.makeDamageValue(a, false);
        PacteDeSang.changerStyle('garde');
        var coupGarde = ea.makeDamageValue(a, false);
        out.garde = { lame: coupLame, garde: coupGarde, reserve: PacteDeSang.reserve() };
        e.removeState(PacteDeSang.dette);
        var sansRes = new Game_Action(a); sansRes.setAttack();
        var base = sansRes.makeDamageValue(e, false);            // consomme la Réserve
        out.liberation = { bonus: base - Math.floor(sansMasque), reserveApres: PacteDeSang.reserve() };
        PacteDeSang.changerStyle('garde');
        ea.makeDamageValue(a, false);
        var lib = new Game_Action(a); lib.setAttack(); jouer(lib, e);
        out.libInscrit = e.isStateAffected(PacteDeSang.dette);
        PacteDeSang.changerStyle('lame');
        return out;
    });
    ok('Vesper ouvre « style » et connaît ses trois Styles', v.types);
    ok('Première Entaille inscrit la Dette', v.dette);
    ok('…sans l\'absorber dans le même geste', v.pacteApresMarque === 0);
    ok('le coup suivant absorbe : Pacte = 65 %', !v.detteApres && Math.abs(v.pacteApresAbsorb - 0.65) < 0.01,
        Math.round(v.pacteApresAbsorb * 100) + ' %');
    ok('le Masque Rouge s\'allume (≥ 30 %)', v.masque);
    ok('Masque en Lame, Pacte 100 % : ×1,90', Math.abs(v.ratioLame - 1.9) < 0.02, '×' + v.ratioLame.toFixed(2));
    ok('Masque en Saignée : ×1,30', Math.abs(v.ratioSaignee - 1.3) < 0.02, '×' + v.ratioSaignee.toFixed(2));
    ok('sous 30 %, pas de Masque (contre-épreuve)', Math.abs(v.ratioSousSeuil - 1) < 0.01, '×' + v.ratioSousSeuil.toFixed(2));
    ok('en Lame, chaque coup brûle 10 % du Pacte', Math.abs(v.consoLame - 0.10) < 0.01, Math.round(v.consoLame * 1000) / 10 + ' %');
    ok('en Lame, le sang qu\'elle boit ne lui revient pas (Arlecchino)', v.lameNeBoitPas);
    ok('un soin rembourse le Pacte, pas les PV', v.soinAvecPacte.hp === 0 && v.soinAvecPacte.pacte === 1000,
        '+' + v.soinAvecPacte.hp + ' PV · −' + v.soinAvecPacte.pacte + ' au Pacte');
    ok('sans Pacte, en combat, on ne la soigne pas (Arlecchino)', v.soinSansPacte === 0);
    ok('une potion non plus', v.potion === 0, '+' + v.potion);
    ok('Rendre le Sang : ½ Pacte + 150 % ATQ, et le Pacte s\'efface', v.rendre.soin === v.rendre.attendu && v.rendre.pacte === 0,
        '+' + v.rendre.soin + ' PV (attendu ' + v.rendre.attendu + ')');
    ok('…et le recul ne la tue plus avant le soin', v.rendre.vivante && v.rendre.hp > v.rendre.hp0,
        v.rendre.hp0 + ' → ' + v.rendre.hp + ' PV');
    ok('le recul (15 %) porte sur la base, pas sur la part du Masque', Math.abs(v.recul.perdu - v.recul.surLaBase) <= 2,
        'perdu ' + v.recul.perdu + ' · base ' + v.recul.surLaBase + ' · sur le total ç\'aurait été ' + v.recul.surLeTotal);
    ok('Saignée : le Pacte brûlé revient, et la Voie du Sang boit pour elle', v.saignee.brule > 0 && v.saignee.soin > v.saignee.brule,
        '+' + v.saignee.soin + ' PV (dont ' + v.saignee.brule + ' de Pacte)');
    ok('Garde : −40 % de dégâts reçus', Math.abs(v.garde.garde / v.garde.lame - 0.6) < 0.02, v.garde.lame + ' → ' + v.garde.garde);
    ok('…et le bloqué part en Réserve', v.garde.reserve > 0, v.garde.reserve + '');
    ok('la Libération ajoute la Réserve au coup suivant, puis la vide', v.liberation.bonus > 0 && v.liberation.reserveApres === 0,
        '+' + v.liberation.bonus);
    ok('la Libération inscrit la Dette', v.libInscrit);

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
