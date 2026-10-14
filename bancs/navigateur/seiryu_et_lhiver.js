/*
 * BANC NAVIGATEUR — SEIRYU ET L'HIVER
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-14 : « Seiryu doit être plus utile et un soutien réel avec
 * qui hiver est vraiment lié. Seiryu, quand il meurt d'une attaque, il prend
 * 2 tours pour réapparaître ; pendant sa disparition Korrah ne peut plus
 * utiliser ses capacités hiver. »
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *
 *   · tombé sous un coup, il est ABSENT, et Korrah perd l'Hiver (et ses
 *     ordres) — mais garde tout le reste, et les autres héros ne perdent rien ;
 *   · rien ne le ramène plus tôt : ni Plume de Phénix, ni PV rendus ;
 *   · il revient à la fin du 2e tour qui suit, avec la moitié de sa vie, et
 *     l'Hiver revient avec lui ;
 *   · éteint AVEC elle, rien ne change : il revient quand elle se relève ;
 *     son absence finie pendant qu'elle est à terre, il l'attend ;
 *   · un vrai combat, laissé tourner : il s'efface à l'écran, se reforme au
 *     bon tour, et réapparaît ;
 *   · ses soins pèsent : un quart de la vie de qui les reçoit.
 *
 *   npx http-server -p 8899 -c-1 .        (dans un autre terminal, à la racine)
 *   node bancs/navigateur/seiryu_et_lhiver.js
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

    console.log('=== SEIRYU ET L\'HIVER ===\n');

    // Un combat ouvert, puis le moteur figé : on mène les tours à la main.
    async function ouvrirCombat() {
        await page.evaluate(function () {
            $gameParty.members().forEach(function (a) { a.recoverAll(); });
            BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(2500);
    }
    await ouvrirCombat();
    await page.evaluate(function () {
        var SC = SceneManager._scene;
        window.__vraieMaj = SC.update;
        SC.update = function () { };
        // un tour qui passe : MV compte le tour au début, et le referme
        window.__tour = function () { $gameTroop.increaseTurn(); BattleManager._enteredEndPhase = false; BattleManager.endTurn(); };
        // ⚠ Comme MV avant chaque coup : on vide le résultat de la cible —
        //   sinon un état qu'elle vient de perdre ne peut pas revenir.
        window.__coup = function (cible, n) {
            var e = $gameTroop.aliveMembers()[0];
            var act = new Game_Action(e); act.setAttack();
            cible.clearResult();
            act.executeDamage(cible, n);
        };
        window.__tombe = function (a) { a.clearResult(); a.addState(a.deathStateId()); };
        window.__releve = function (a) { a.clearResult(); a.removeState(a.deathStateId()); a.setHp(a.mhp); };
        window.__peut = function (actorId, skillId) { return $gameActors.actor(actorId).canUse($dataSkills[skillId]); };
        $gameParty.members().forEach(function (a) { a.setMp(a.mmp); a.setTp(100); });
    });

    var HIVER = 90, HIVER2 = 1211, ORDRE = 1255, AUTRE = 96, ATTAQUE = 1, LUDWING = 47;

    // ── 1 · avant : tout marche ─────────────────────────────────────────
    console.log('1) Avant');
    var avant = await page.evaluate(function (ids) {
        var s = $gameActors.actor(6);
        return { present: Seiryu.present(), vivant: s.isAlive(), reglages: Seiryu.reglages(),
                 hiver: __peut(2, ids[0]), hiver2: __peut(2, ids[1]), ordre: __peut(2, ids[2]) };
    }, [HIVER, HIVER2, ORDRE]);
    v('seiryu est là, vivant', avant.present && avant.vivant, 'réglages ' + JSON.stringify(avant.reglages));
    v('Korrah peut lancer l\'Hiver', avant.hiver && avant.hiver2, '« Instant Gelé » et « Glace — Givre »');
    v('Korrah peut donner un ordre à seiryu', avant.ordre, '« Avatar — Vise ça »');

    // ── 2 · il tombe sous un coup ───────────────────────────────────────
    console.log('\n2) Il tombe sous un coup');
    var tombe = await page.evaluate(function (ids) {
        var s = $gameActors.actor(6), t = $gameTroop.turnCount();
        __coup(s, s.hp + 50);
        return { t: t, mort: s.isDead(), absence: Seiryu.absence(), sansLui: Seiryu.sansLui(),
                 hiver: __peut(2, ids[0]), hiver2: __peut(2, ids[1]), ordre: __peut(2, ids[2]),
                 autre: __peut(2, ids[3]), attaque: __peut(2, ids[4]), ludwing: __peut(3, ids[5]),
                 bilan: Seiryu.bilan() };
    }, [HIVER, HIVER2, ORDRE, AUTRE, ATTAQUE, LUDWING]);
    v('il est à terre, et son absence commence', tombe.mort && !!tombe.absence && tombe.absence.retour === tombe.t + 2,
        'tour ' + tombe.t + ' → retour prévu à la fin du tour ' + (tombe.absence ? tombe.absence.retour : '?'));
    v('Korrah ne peut PLUS lancer l\'Hiver', !tombe.hiver && !tombe.hiver2);
    v('ni donner d\'ordre à un seiryu absent', !tombe.ordre);
    v('contre-épreuve : elle garde ses autres compétences', tombe.autre && tombe.attaque, '« Corps-à-corps lourd » et l\'Attaque');
    v('contre-épreuve : ludwing ne perd rien', tombe.ludwing);
    v('le bilan compte sa chute', tombe.bilan && tombe.bilan.morts === 1, JSON.stringify(tombe.bilan));

    // ── 3 · rien ne le ramène plus tôt ──────────────────────────────────
    console.log('\n3) Rien ne le ramène plus tôt');
    var tot = await page.evaluate(function () {
        var s = $gameActors.actor(6), r = {};
        var k = $gameActors.actor(2);
        var plume = new Game_Action(k); plume.setItemObject($dataItems[24]);
        plume.apply(s);
        r.plume = s.isDead();
        s.setHp(800);
        r.pv = s.isDead() + ' (' + s.hp + ' PV)';
        s.removeState(s.deathStateId());
        r.retire = s.isDead();
        return r;
    });
    v('une Plume de Phénix ne le relève pas', tot.plume);
    v('des PV rendus non plus', /^true \(0 PV\)$/.test(tot.pv), tot.pv);
    v('ni un « retirer l\'état de mort »', tot.retire);

    // ── 4 · deux tours, puis il revient ─────────────────────────────────
    console.log('\n4) Deux tours, puis il revient');
    var t1 = await page.evaluate(function (h) { __tour(); var s = $gameActors.actor(6); return { t: $gameTroop.turnCount(), mort: s.isDead(), hiver: __peut(2, h) }; }, HIVER);
    var t2 = await page.evaluate(function (h) { __tour(); var s = $gameActors.actor(6); return { t: $gameTroop.turnCount(), mort: s.isDead(), hiver: __peut(2, h) }; }, HIVER);
    var t3 = await page.evaluate(function (h) {
        __tour(); var s = $gameActors.actor(6);
        return { t: $gameTroop.turnCount(), mort: s.isDead(), hiver: __peut(2, h), pv: s.hp, mhp: s.mhp, absence: Seiryu.absence(), bilan: Seiryu.bilan() };
    }, HIVER);
    v('fin du tour ' + t1.t + ' : toujours absent, pas d\'Hiver', t1.mort && !t1.hiver);
    v('fin du tour ' + t2.t + ' : il se reforme', !t2.mort && t2.hiver,
        t2.mort ? 'encore absent' : 'revenu');
    v('il revient avec la moitié de sa vie', t3.pv === Math.floor(t3.mhp * 0.5), t3.pv + ' / ' + t3.mhp);
    v('l\'Hiver revient à Korrah, et l\'absence est close', t3.hiver && t3.absence === null);
    v('le bilan compte les tours sans lui', t3.bilan && t3.bilan.toursSansLui === 2, JSON.stringify(t3.bilan));

    // ── 5 · éteint avec elle : rien ne change ───────────────────────────
    console.log('\n5) Éteint avec elle');
    var avec = await page.evaluate(function () {
        var s = $gameActors.actor(6), k = $gameActors.actor(2), r = {};
        __tombe(k);
        BattleManager.endAction();
        r.eteint = s.isDead(); r.absence = Seiryu.absence();
        __releve(k);
        BattleManager.endAction();
        r.revient = s.isAlive(); r.pv = s.hp; r.mhp = s.mhp;
        return r;
    });
    v('Korrah tombe : il s\'éteint, SANS absence à purger', avec.eteint && avec.absence === null);
    v('elle se relève : il revient aussitôt', avec.revient, avec.pv + ' / ' + avec.mhp + ' PV (un quart, comme avant)');

    // ── 6 · son absence finit pendant qu'elle est à terre ───────────────
    console.log('\n6) Son absence finit pendant qu\'elle est à terre');
    var attend = await page.evaluate(function () {
        var s = $gameActors.actor(6), k = $gameActors.actor(2), r = {};
        __coup(s, s.hp + 50);                       // il tombe sous un coup
        __tombe(k);                                 // puis elle tombe
        __tour(); __tour(); __tour();               // son absence est finie
        r.toujoursMort = s.isDead(); r.abs = Seiryu.absence(); r.fini = !!(r.abs && r.abs.fini); r.t = $gameTroop.turnCount();
        __releve(k);
        BattleManager.endAction();                  // elle se relève
        r.revient = s.isAlive(); r.pv = s.hp; r.mhp = s.mhp;
        return r;
    });
    v('son absence est finie, mais il l\'attend', attend.toujoursMort && attend.fini, 'mort=' + attend.toujoursMort + ' · absence ' + JSON.stringify(attend.abs) + ' · tour ' + attend.t);
    v('elle se relève : il se reforme', attend.revient, attend.pv + ' / ' + attend.mhp + ' PV');

    // ── 7 · ses soins pèsent ────────────────────────────────────────────
    console.log('\n7) Ses soins');
    var soin = await page.evaluate(function () {
        var s = $gameActors.actor(6), cible = $gameActors.actor(3);
        s.recoverAll();
        cible.setHp(Math.floor(cible.mhp * 0.2));
        var avant = cible.hp, act = new Game_Action(s); act.setSkill(1259);
        act.apply(cible);
        var un = cible.hp - avant;
        $gameParty.members().forEach(function (m) { if (m !== s) { m.setHp(Math.floor(m.mhp * 0.2)); } });
        var avants = $gameParty.members().map(function (m) { return m.hp; });
        var grp = new Game_Action(s); grp.setSkill(1260);
        $gameParty.members().forEach(function (m) { if (m !== s) { grp.apply(m); } });
        // Vesper ne se soigne pas en combat (le Pacte) : elle n'est pas comptée
        var gains = $gameParty.members().map(function (m, i) {
            if (m === s || (window.PacteDeSang && !PacteDeSang.soignable(m))) { return null; }
            return (m.hp - avants[i]) / m.mhp;
        }).filter(function (x) { return x !== null; });
        return { un: un, mhp: cible.mhp, nom: cible.name(), groupe: gains };
    });
    var pctUn = soin.un / soin.mhp;
    v('« Ce Que Le Dragon Rend » rend au moins un quart d\'une vie', pctUn >= 0.25,
        '+' + soin.un + ' PV sur ' + soin.mhp + ' (' + Math.round(pctUn * 100) + ' %) à ' + soin.nom + ' — 13 % avant la v3');
    var minG = Math.min.apply(null, soin.groupe);
    v('« Le Souffle Long » rend au moins 12 % à chacun', minG >= 0.12,
        soin.groupe.map(function (g) { return Math.round(g * 100) + ' %'; }).join(' · '));

    // ── 8 · un vrai combat, laissé tourner ──────────────────────────────
    console.log('\n8) Un vrai combat, laissé tourner');
    // Un combat NEUF : celui d'avant a été mené à la main, phase par phase.
    await page.evaluate(function () {
        // la scène doit vivre pour finir son fondu de sortie
        SceneManager._scene.update = window.__vraieMaj;
        BattleManager.endBattle(2); $gameParty.onBattleEnd(); $gameTroop.onBattleEnd();
        SceneManager.goto(Scene_Map);
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(800);
    // tout le monde se bat seul — AVANT d'ouvrir : sinon le premier héros
    // attend une commande que personne ne donnera
    await page.evaluate(function () {
        window.__auto = Game_Actor.prototype.isAutoBattle;
        Game_Actor.prototype.isAutoBattle = function () { return true; };
    });
    await ouvrirCombat();
    await page.evaluate(function () {
        var SC = SceneManager._scene;
        var exp = { a: Game_Action.prototype.executeDamage };
        window.__coup = function (cible, n) {
            var e = $gameTroop.aliveMembers()[0];
            var act = new Game_Action(e); act.setAttack();
            cible.clearResult();
            exp.a.call(act, cible, n);
        };
        // personne ne gagne trop vite
        $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); });
        $gameParty.members().forEach(function (a) { a.recoverAll(); if (a.actorId() !== 6) { a.addParam(0, 9999999); a.recoverAll(); } });
        BattleManager._enteredEndPhase = false;
        window.__journal = [];
        var push = Window_BattleLog.prototype.addText;
        Window_BattleLog.prototype.addText = function (t) { window.__journal.push(String(t)); return push.call(this, t); };
        window.__suivi = [];
        var fin = BattleManager.endTurn;
        BattleManager.endTurn = function () {
            var s = $gameActors.actor(6), sp = window.AvatarCorps.sprite();
            window.__suivi.push({ t: $gameTroop.turnCount(), mort: s.isDead(), opacite: sp ? sp.opacity : null });
            return fin.apply(this, arguments);
        };
        var s = $gameActors.actor(6);
        __coup(s, s.hp + 50);
        window.__tombeAu = $gameTroop.turnCount();
    });
    await page.waitForTimeout(1200);
    var efface = await page.evaluate(function () { var sp = window.AvatarCorps.sprite(); return sp ? sp.opacity : null; });
    v('à l\'écran, il s\'efface', efface !== null && efface < 40, 'opacité ' + efface + ' / 255');
    try {
        await page.waitForFunction(function () { return $gameTroop.turnCount() >= window.__tombeAu + 3 || !$gameParty.inBattle(); }, null, { timeout: 420000, polling: 500 });
    } catch (e) { }
    await page.waitForTimeout(1500);
    var reel = await page.evaluate(function () {
        var sp = window.AvatarCorps.sprite();
        return { tombeAu: window.__tombeAu, suivi: window.__suivi, journal: window.__journal.filter(function (l) { return /seiryu/i.test(l); }),
                 vivant: $gameActors.actor(6).isAlive(), opacite: sp ? sp.opacity : null, tour: $gameTroop.turnCount() };
    });
    var finDe = function (t) { return reel.suivi.filter(function (x) { return x.t === t; })[0]; };
    var a1 = finDe(reel.tombeAu + 1), a2 = finDe(reel.tombeAu + 2);
    v('le moteur joue : il manque le tour ' + (reel.tombeAu + 1), !!a1 && a1.mort, a1 ? 'mort à la fin du tour ' + a1.t : 'tour non atteint (tour ' + reel.tour + ')');
    v('il revient à la fin du tour ' + (reel.tombeAu + 2), !!a2 && reel.vivant && reel.tour >= reel.tombeAu + 3,
        'tour actuel ' + reel.tour + ' · vivant=' + reel.vivant);
    v('et il réapparaît à l\'écran', reel.opacite !== null && reel.opacite > 200, 'opacité ' + reel.opacite + ' / 255');
    v('le journal le dit au joueur', reel.journal.some(function (l) { return /se dissipe/.test(l); }) && reel.journal.some(function (l) { return /se reforme/.test(l); }),
        reel.journal.map(function (l) { return l.replace(/\\C\[\d+\]/g, ''); }).slice(0, 4).join(' | '));

    console.log('');
    v('aucune erreur JavaScript', err.length === 0, err.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(72) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(72));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
