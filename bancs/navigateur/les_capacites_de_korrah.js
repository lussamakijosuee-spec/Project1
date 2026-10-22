/*
 * BANC NAVIGATEUR — LES CAPACITÉS DE KORRAH (LeFroidConfie.js v1.1)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-20 : « Oui, écris les 10 capacités de Korrah comme listé :
 * seiryu suit le coup, +50 % sur l'engourdi, seiryu en profite aussi, Ralentir
 * confie son froid, Elle Prend Ta Place prend sa place. Puis banc et mesure. »
 * Puis le deuxième paquet (v1.2) : « seiryu suit le coup, +50 % sur l'engourdi,
 * seiryu en profite aussi, et elle reprend du froid pour engourdir. »
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. les réglages, et les balises et lignes des 10 fiches ;
 *   2. <SurEngourdi> : +50 % sur un engourdi — pas sur un autre, pas sur une
 *      capacité sans balise ;
 *   3. <ConfieFroid> : Ralentir confie ses 20 PM — pas une autre capacité, pas
 *      sans seiryu ;
 *   4. <ADeux> : Prise de Position et Le Souffle Retenu buffent aussi seiryu —
 *      pas Vesper, pas un seiryu tombé ;
 *   5. <APlace> : Elle Prend Ta Place pose 🔄 À sa place 2 tours, les coups
 *      ennemis ciblés sur l'allié vont à Korrah, une seule place à la fois ;
 *   6. <SeiryuSuit> : il suit avec son coup chargé (25 de froid, glace,
 *      engourdit) — pas sans froid, pas après une capacité sans balise ;
 *   7. un vrai combat laissé tourner : Pas de Côté, seiryu suit, le journal le dit ;
 *   8. le deuxième paquet : <ReprendFroid> (25 de froid repris, le coup engourdit ;
 *      rien sans froid), et une capacité de chaque famille sur ses nouvelles fiches.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/les_capacites_de_korrah.js
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

    console.log('=== LES CAPACITÉS DE KORRAH ===\n');

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
            delete SceneManager._scene.update;      // la scène doit tourner pour se fermer (son fondu)
            BattleManager.endBattle(2); $gameParty.onBattleEnd(); $gameTroop.onBattleEnd();
            SceneManager.goto(Scene_Map);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(800);
    }

    // ── 1 · réglages et fiches ─────────────────────────────────────────
    console.log('1) Les réglages et les fiches');
    var d = await page.evaluate(function () {
        var liste = { 1106: 'SeiryuSuit', 1098: 'SeiryuSuit', 1108: 'SeiryuSuit', 1107: 'SurEngourdi', 1154: 'SurEngourdi',
                      1110: 'SurEngourdi', 1151: 'ADeux', 1100: 'ADeux', 1241: 'ConfieFroid', 1156: 'APlace',
                      1153: 'SeiryuSuit', 1243: 'SeiryuSuit', 1158: 'SeiryuSuit', 1109: 'SurEngourdi', 155: 'SurEngourdi',
                      156: 'ADeux', 1079: 'ADeux', 1111: 'ADeux', 1099: 'ReprendFroid', 1101: 'ReprendFroid' };
        var balises = Object.keys(liste).filter(function (id) { return $dataSkills[id].meta[liste[id]] === true; }).length;
        var lignes = Object.keys(liste).filter(function (id) { return $dataSkills[id].description.split('\n').length === 2; }).length;
        return { r: FroidConfie.reglages(), balises: balises, lignes: lignes };
    });
    v('réglages : +50 % sur l\'engourdi, la place 2 tours, soins chargés toujours ×1,25', d.r.bonusEngourdi === 50 && d.r.toursAPlace === 2 && d.r.bonusSoin === 1.25);
    v('les 20 fiches portent leur balise', d.balises === 20, d.balises + ' / 20');
    v('…et leur ligne de description', d.lignes === 20, d.lignes + ' / 20');

    await ouvrirCombat();
    await page.evaluate(function () {
        var SC = SceneManager._scene;
        window.__vraieMaj = SC.update;
        SC.update = function () { };
        window.__k = function () { return $gameActors.actor(2); };
        window.__s = function () { return $gameActors.actor(6); };
        window.__agir = function (sujet, id, cible) {
            var act = new Game_Action(sujet); act.setSkill(id);
            act.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible));
            sujet._actions = [act];
            sujet.useItem(act.item()); cible.clearResult(); act.apply(cible);
            return act;
        };
        window.__degats = function (sujet, id, cible) { var a = new Game_Action(sujet); a.setSkill(id); return a.makeDamageValue(cible, false); };
        window.__journal = [];
        var push = Window_BattleLog.prototype.push;
        Window_BattleLog.prototype.push = function (nom, t) {
            if (nom === 'addText') { window.__journal.push(String(t).replace(/\\C\[\d+\]/g, '')); }
            return push.apply(this, arguments);
        };
        $gameParty.members().forEach(function (x) { x.setMp(x.mmp); x.setTp(100); });
        // 2026-10-22 : ses mouvements se paient en PT (LesTroisArts) ; ce banc juge les liens avec seiryu,
        // pas la barre (contrôlée par les_trois_arts) : les PT ne manquent jamais ici.
        Game_BattlerBase.prototype.skillTpCost = function () { return 0; };
        $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); });
        window.__alea = Math.random; Math.random = function () { return 0.5; };
    });

    // ── 2 · <SurEngourdi> ──────────────────────────────────────────────
    console.log('\n2) +50 % sur l\'engourdi');
    var e2 = await page.evaluate(function () {
        var k = __k(), e = $gameTroop.members()[0], ves = $gameActors.actor(1), r = {};
        e.removeState(211);
        var a0 = __degats(k, 1107, e), f0 = __degats(k, 1110, e), m0 = __degats(k, 1160, e), v0 = __degats(ves, 1, e);
        e.addState(211); r.engourdi = e.isStateAffected(211);
        var a1 = __degats(k, 1107, e), f1 = __degats(k, 1110, e), m1 = __degats(k, 1160, e), v1 = __degats(ves, 1, e);
        e.removeState(211);
        r.trait = a1 / a0; r.fil = f1 / f0; r.maitrise = m1 / m0; r.vesper = v1 / v0; r.a = [a0, a1];
        return r;
    });
    v('Trait Foudroyant : ×1,5 sur un engourdi', e2.engourdi && Math.abs(e2.trait - 1.5) < 0.01, e2.a.join(' → '));
    v('Fil de Foudre : ×1,5 sur un engourdi', Math.abs(e2.fil - 1.5) < 0.01, e2.fil.toFixed(3));
    v('contre-épreuve : Maîtrise (sans balise) ne change pas', Math.abs(e2.maitrise - 1) < 0.01, e2.maitrise.toFixed(3));
    v('contre-épreuve : l\'Attaque de Vesper ne change pas', Math.abs(e2.vesper - 1) < 0.01, e2.vesper.toFixed(3));

    // ── 3 · <ConfieFroid> ──────────────────────────────────────────────
    console.log('\n3) Ralentir confie son froid');
    var c3 = await page.evaluate(function () {
        var k = __k(), s = __s(), r = {};
        FroidConfie.poser(0); k.paySkillCost($dataSkills[1241]); r.ralentir = FroidConfie.jauge(); r.cout = k.skillMpCost($dataSkills[1241]);
        FroidConfie.poser(0); k.paySkillCost($dataSkills[1107]); r.trait = FroidConfie.jauge();
        s.addState(s.deathStateId()); FroidConfie.poser(0); k.paySkillCost($dataSkills[1241]); r.tombe = FroidConfie.jauge();
        s.removeState(s.deathStateId()); s.recoverAll(); FroidConfie.poser(0);
        return r;
    });
    v('Ralentir confie ses PM en froid', c3.ralentir === c3.cout && c3.cout > 0, c3.ralentir + ' de froid pour ' + c3.cout + ' PM');
    v('contre-épreuve : Trait Foudroyant ne confie rien', c3.trait === 0);
    v('contre-épreuve : seiryu tombé, rien n\'est confié', c3.tombe === 0);

    // ── 4 · <ADeux> ────────────────────────────────────────────────────
    console.log('\n4) seiryu en profite aussi');
    var a4 = await page.evaluate(function () {
        var k = __k(), s = __s(), ves = $gameActors.actor(1), r = {};
        [k, s, ves].forEach(function (x) { x.clearBuffs(); });
        __journal.length = 0;
        __agir(k, 1151, k);
        r.prise = { korrah: k.isBuffAffected(6) && k.isBuffAffected(3), seiryu: s.isBuffAffected(6) && s.isBuffAffected(3), vesper: ves.isBuffAffected(6) };
        r.journal = __journal.some(function (t) { return /en profite aussi/.test(t); });
        [k, s].forEach(function (x) { x.clearBuffs(); });
        __agir(k, 1100, k);
        r.souffle = { korrah: k.isBuffAffected(4) && k.isBuffAffected(5), seiryu: s.isBuffAffected(4) && s.isBuffAffected(5) };
        [k, s].forEach(function (x) { x.clearBuffs(); });
        __agir(k, 1236, k);                         // Accélérer : pas de balise
        r.sansBalise = s.isBuffAffected(6);
        [k, s].forEach(function (x) { x.clearBuffs(); });
        s.addState(s.deathStateId()); __agir(k, 1151, k); r.tombe = s.isBuffAffected(6);
        s.removeState(s.deathStateId()); s.recoverAll();
        [k, s].forEach(function (x) { x.clearBuffs(); });
        return r;
    });
    v('Prise de Position : Korrah ET seiryu (AGI, DÉF)', a4.prise.korrah && a4.prise.seiryu, JSON.stringify(a4.prise));
    v('…pas Vesper (contre-épreuve)', !a4.prise.vesper);
    v('le journal le dit', a4.journal);
    v('Le Souffle Retenu : Korrah ET seiryu (DÉF.M, DÉF)', a4.souffle.korrah && a4.souffle.seiryu, JSON.stringify(a4.souffle));
    v('contre-épreuve : Accélérer (sans balise) ne passe pas par elle', !a4.sansBalise);
    v('contre-épreuve : seiryu tombé n\'a rien', !a4.tombe);

    // ── 5 · <APlace> ───────────────────────────────────────────────────
    console.log('\n5) Elle Prend Ta Place');
    var p5 = await page.evaluate(function () {
        var k = __k(), ves = $gameActors.actor(1), lud = $gameActors.actor(3), e = $gameTroop.members()[0], r = {};
        [ves, lud].forEach(function (x) { x.eraseState(245); });
        var coupEnnemi = new Game_Action(e); coupEnnemi.setAttack();
        BattleManager._action = coupEnnemi;
        r.avant = BattleManager.applySubstitute(ves) === ves;
        ves.setHp(Math.floor(ves.mhp / 2)); ves.addState(213);
        var hp0 = ves.hp;
        __agir(k, 1156, ves);
        r.etat = ves.isStateAffected(245); r.tours = ves._stateTurns[245];
        r.soin = ves.hp > hp0; r.marque = !ves.isStateAffected(213);
        r.detourne = BattleManager.applySubstitute(ves) === k;
        var zone = new Game_Action(e); zone.setSkill(1); zone._item.setObject($dataSkills.filter(function (s) { return s && s.scope === 2 && s.damage.type === 1; })[0]);
        BattleManager._action = zone; r.zone = BattleManager.applySubstitute(ves) === ves;
        BattleManager._action = coupEnnemi;
        __agir(k, 1156, lud);
        r.uneSeule = !ves.isStateAffected(245) && lud.isStateAffected(245);
        [ves, lud].forEach(function (x) { x.eraseState(245); });
        BattleManager._action = null;
        return r;
    });
    v('avant : le coup ennemi va bien sur Vesper', p5.avant);
    v('🔄 À sa place sur Vesper, pour 2 tours', p5.etat && p5.tours === 2, 'tours ' + p5.tours);
    v('…le soin et le Marqué retiré restent', p5.soin && p5.marque);
    v('un coup ennemi ciblé sur Vesper frappe Korrah', p5.detourne);
    v('contre-épreuve : un coup de zone ne se détourne pas', p5.zone);
    v('une seule place à la fois', p5.uneSeule);

    // ── 6 · <SeiryuSuit> ───────────────────────────────────────────────
    console.log('\n6) seiryu suit le coup');
    var s6 = await page.evaluate(function () {
        var k = __k(), s = __s(), e = $gameTroop.members()[0], r = {};
        e.recoverAll(); e.removeState(211); k._seiryuSuit = null;
        __agir(k, 1107, e); r.sansBalise = k._seiryuSuit === null;
        __agir(k, 1106, e); r.retenu = k._seiryuSuit === e;
        // ce que son coup chargé doit faire
        var att = new Game_Action(s); att.setAttack(); att._froidCharge = 25;
        r.attendu = att.makeDamageValue(e, false);
        e.removeState(211); FroidConfie.poser(100);
        var hp0 = e.hp; __journal.length = 0;
        FroidConfie.suivre(k);
        r.fait = hp0 - e.hp; r.jauge = FroidConfie.jauge(); r.engourdi = e.isStateAffected(211); r.vide = k._seiryuSuit === null;
        r.journal = __journal.filter(function (t) { return /suit le coup/.test(t); })[0] || '';
        // sans froid : rien
        e.recoverAll(); e.removeState(211); FroidConfie.poser(10); k._seiryuSuit = e;
        hp0 = e.hp; FroidConfie.suivre(k);
        r.sansFroid = { hp: hp0 - e.hp, jauge: FroidConfie.jauge() };
        FroidConfie.poser(0);
        return r;
    });
    v('une capacité sans balise ne prépare rien', s6.sansBalise);
    v('Pas de Côté retient sa cible', s6.retenu);
    v('seiryu suit : son coup chargé, au chiffre près', s6.fait === s6.attendu && s6.fait > 0, s6.fait + ' / ' + s6.attendu + ' attendus');
    v('…il prend 25 de froid', s6.jauge === 75, s6.jauge + '/100');
    v('…et il engourdit', s6.engourdi);
    v('…le journal le dit', /seiryu suit le coup : \d+ dégâts/.test(s6.journal), s6.journal);
    v('contre-épreuve : sans 25 de froid, il ne suit pas', s6.sansFroid.hp === 0 && s6.sansFroid.jauge === 10, JSON.stringify(s6.sansFroid));

    // ── 8 · le deuxième paquet ─────────────────────────────────────────
    console.log('\n8) Le deuxième paquet');
    var p8 = await page.evaluate(function () {
        var k = __k(), s = __s(), e = $gameTroop.members()[0], r = {};
        e.recoverAll(); e.removeState(211); FroidConfie.poser(100); __journal.length = 0;
        var act = __agir(k, 1099, e);                       // Paume Immobile
        r.reprend = { jauge: FroidConfie.jauge(), engourdi: e.isStateAffected(211), touche: e.result().isHit(),
            journal: __journal.filter(function (t) { return /reprend 25 de froid/.test(t); })[0] || '' };
        e.recoverAll(); e.removeState(211); FroidConfie.poser(10);
        __agir(k, 1101, e);                                 // Point Creux, sans assez de froid
        r.sansFroid = { jauge: FroidConfie.jauge(), engourdi: e.isStateAffected(211) };
        e.removeState(211); FroidConfie.poser(100);
        __agir(k, 1109, e); r.instantSansEngourdi = FroidConfie.jauge();   // Instant Foudroyant ne reprend rien
        var i0 = __degats(k, 1109, e); e.addState(211); var i1 = __degats(k, 1109, e); e.removeState(211);
        r.instant = i1 / i0;
        [k, s].forEach(function (x) { x.clearBuffs(); });
        __agir(k, 156, k); r.contreSort = s.isBuffAffected(4) && s.isBuffAffected(5);
        [k, s].forEach(function (x) { x.clearBuffs(); });
        __agir(k, 1111, k); r.charge = s.isBuffAffected(6) && s.isBuffAffected(7);
        [k, s].forEach(function (x) { x.clearBuffs(); });
        k._seiryuSuit = null; __agir(k, 1243, e); r.sceller = k._seiryuSuit === e; k._seiryuSuit = null;
        FroidConfie.poser(0);
        return r;
    });
    v('Paume Immobile reprend 25 de froid à seiryu', p8.reprend.jauge === 75, p8.reprend.jauge + '/100');
    v('…et le coup engourdit à coup sûr', p8.reprend.touche && p8.reprend.engourdi);
    v('…le journal le dit', /reprend 25 de froid/.test(p8.reprend.journal), p8.reprend.journal);
    v('contre-épreuve : Point Creux avec 10 de froid ne reprend rien et n\'engourdit pas', p8.sansFroid.jauge === 10 && !p8.sansFroid.engourdi, JSON.stringify(p8.sansFroid));
    v('contre-épreuve : Instant Foudroyant ne reprend pas de froid', p8.instantSansEngourdi === 100);
    v('Instant Foudroyant : ×1,5 sur un engourdi', Math.abs(p8.instant - 1.5) < 0.01, p8.instant.toFixed(3));
    v('Contre-Sort : seiryu a aussi MAG et DÉF.M', p8.contreSort);
    v('Charge Statique : seiryu a aussi AGI et Chance', p8.charge);
    v('Sceller la Voix (sans dégâts) prépare quand même seiryu', p8.sceller);

    await page.evaluate(function () { Math.random = window.__alea; });
    await fermerCombat();

    // ── 7 · un vrai combat ─────────────────────────────────────────────
    console.log('\n7) Un vrai combat, laissé tourner');
    await page.evaluate(function () {
        Game_Actor.prototype.isAutoBattle = function () { return true; };
        var mk = Game_Actor.prototype.makeAutoBattleActions;
        Game_Actor.prototype.makeAutoBattleActions = function () {
            if (this.actorId() === 6) { return mk.apply(this, arguments); }    // seiryu décide seul
            this.clearActions();
            var act = new Game_Action(this);
            if (this.actorId() === 2) { act.setSkill(1106); act.setTarget(0); } else { act.setGuard(); }
            this.setAction(0, act);
        };
        // un témoin posé APRÈS LeFroidConfie : il passe le premier
        var sa = BattleManager.startAction;
        BattleManager.startAction = function () {
            var s = this._subject;
            if (s && s.isActor() && s.actorId() === 2 && !window.__mesure) {
                FroidConfie.poser(window.__froid);
                window.__mesure = { ennemi: $gameTroop.members()[0], tour: $gameTroop.turnCount() };
            }
            return sa.apply(this, arguments);
        };
        var ea = BattleManager.endAction;
        BattleManager.endAction = function () {
            var s = this._subject, m = window.__mesure;
            if (s && s.isActor() && s.actorId() === 2 && m && !m.fin) {
                var j0 = FroidConfie.jauge(), hp0 = m.ennemi.hp;
                var r = ea.apply(this, arguments);
                m.fin = { jauge0: j0, jauge1: FroidConfie.jauge(), suivi: hp0 - m.ennemi.hp, engourdi: m.ennemi.isStateAffected(211) };
                return r;
            }
            return ea.apply(this, arguments);
        };
        window.__journal = [];                      // l'écoute du journal est déjà posée (section 1)
    });
    async function essai(froid) {
        await page.evaluate(function (f) { window.__froid = f; window.__mesure = null; window.__journal = []; }, froid);
        await ouvrirCombat();
        await page.evaluate(function () {
            $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); e.addParam(2, -e.atk + 1); e.addParam(4, -e.mat + 1); });
            $gameParty.members().forEach(function (a) { if (a.actorId() !== 6) { a.addParam(0, 9999999); } a.recoverAll(); });
        });
        try {
            await page.waitForFunction(function () { var m = window.__mesure; return (m && m.fin) || !$gameParty.inBattle(); }, null, { timeout: 300000, polling: 300 });
        } catch (e) { }
        var r = await page.evaluate(function () {
            var m = window.__mesure;
            return { fin: m && m.fin, journal: window.__journal.filter(function (t) { return /suit le coup/.test(t); }) };
        });
        await fermerCombat();
        return r;
    }
    var A = await essai(100);
    v('Pas de Côté avec 100 de froid : seiryu suit, 25 de froid pris', !!A.fin && A.fin.jauge0 === 100 && A.fin.jauge1 === 75 && A.fin.suivi > 0,
        A.fin ? JSON.stringify(A.fin) : 'Korrah n\'a pas joué');
    v('…l\'ennemi est engourdi, et le journal le dit', !!A.fin && A.fin.engourdi && A.journal.length === 1, A.journal.join(' | '));
    var B = await essai(0);
    v('contre-épreuve, sans froid : il ne suit pas', !!B.fin && B.fin.suivi === 0 && B.journal.length === 0, B.fin ? JSON.stringify(B.fin) : 'Korrah n\'a pas joué');

    console.log('');
    v('aucune erreur JavaScript', err.length === 0, err.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(72) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(72));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
