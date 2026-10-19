/*
 * BANC NAVIGATEUR — LE FROID CONFIÉ (Korrah et seiryu, LeFroidConfie.js)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-19 : « Piste 1, le froid confié : Korrah joue deux corps
 * avec seiryu, ses sorts d'Hiver chargent seiryu, et « change » devient
 * l'échange de place. » — « Oui, écris tout comme listé ».
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *
 *   1. la jauge monte du coût exact en PM, et SEULEMENT avec l'Hiver de Korrah ;
 *   2. seiryu chargé : soins ×1,25, coups de glace ×1,5 qui engourdissent,
 *      gardes +1 tour et « le froid mord » — et rien sans assez de froid ;
 *   3. « Rends-le » vide toute la jauge : dégâts × (1 + froid ÷ 50), Gelure ;
 *   4. Le Froid Rendu demande la jauge pleine, et ne coûte plus de PM ;
 *   5. tombé chargé, le froid revient sur elle (Saisie dès 60) — pas s'il
 *      s'éteint avec elle ;
 *   6. Change : la place, ce que les ENNEMIS ont posé (pas le reste), les coups
 *      ciblés détournés sur elle — et pas les coups de zone ;
 *   7. un vrai combat : saisie avant d'avoir joué, elle perd CE tour-là et
 *      rejoue au suivant ; l'ordre du groupe est rendu à la fin.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/le_froid_confie.js
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

    console.log('=== LE FROID CONFIÉ ===\n');

    async function ouvrirCombat() {
        await page.evaluate(function () {
            window.__ordreAvant = $gameParty._actors.slice();
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
        Seiryu.experience(Seiryu.seuils.dresse);          // Dressé : il obéit à chaque ordre
        window.__k = function () { return $gameActors.actor(2); };
        window.__s = function () { return $gameActors.actor(6); };
        window.__e = function () { return $gameTroop.aliveMembers()[0]; };
        window.__tour = function () { $gameTroop.increaseTurn(); BattleManager._enteredEndPhase = false; BattleManager.endTurn(); };
        // une action jouée à la main, touchée à coup sûr (on rejoue jusqu'au coup porté)
        window.__agir = function (sujet, idSkill, cible) {
            var act, r;
            for (var i = 0; i < 30; i++) {
                act = new Game_Action(sujet); act.setSkill(idSkill);
                cible.clearResult(); act.apply(cible); r = cible.result();
                if (r.isHit()) { break; }
            }
            return { act: act, r: r };
        };
        // des coups sans hasard, pour comparer au chiffre près
        window.__fixe = function (ids) { ids.forEach(function (id) { $dataSkills[id].damage.variance = 0; $dataSkills[id].damage.critical = false; }); };
        window.__coup = function (cible, n) {
            var act = new Game_Action(__e()); act.setAttack();
            cible.clearResult(); act.executeDamage(cible, n);
        };
        window.__tombe = function (a) { a.clearResult(); a.addState(a.deathStateId()); };
        window.__releve = function (a) { a.clearResult(); a.removeState(a.deathStateId()); a.setHp(a.mhp); };
        window.__pleins = function () { $gameParty.members().forEach(function (a) { if (a.isAlive()) { a.setMp(a.mmp); a.setTp(100); } }); };
        window.__pleins();
        __fixe([1259, 1251, 1254]);
    });

    // ── 1 · la jauge ────────────────────────────────────────────────────
    console.log('1) La jauge');
    var j = await page.evaluate(function () {
        var k = __k(), s = __s(), r = { reglages: FroidConfie.reglages() };
        r.depart = FroidConfie.jauge(); r.etatDepart = s.isStateAffected(243);
        var cout = function (id) { return k.skillMpCost($dataSkills[id]); };
        r.c1211 = cout(1211); k.paySkillCost($dataSkills[1211]); r.apres1211 = FroidConfie.jauge();
        r.etat = s.isStateAffected(243); r.compteur = s.getStateCounter ? s.getStateCounter(243) : null;
        r.c1215 = cout(1215); k.paySkillCost($dataSkills[1215]); r.apres1215 = FroidConfie.jauge();
        k.paySkillCost($dataSkills[1155]); r.plafond = FroidConfie.jauge();
        FroidConfie.poser(0);
        k.paySkillCost($dataSkills[96]); r.horsHiver = FroidConfie.jauge();      // Corps-à-corps lourd
        $gameActors.actor(3).paySkillCost($dataSkills[1211]); r.ludwing = FroidConfie.jauge();
        r.c90 = cout(90); k.paySkillCost($dataSkills[90]); r.apres90 = FroidConfie.jauge();
        FroidConfie.poser(0); r.etatVide = s.isStateAffected(243);
        __pleins();
        return r;
    });
    v('elle part de zéro, sans icône', j.depart === 0 && !j.etatDepart, 'réglages ' + JSON.stringify(j.reglages).slice(0, 120) + '…');
    v('« Glace — Givre » confie son coût exact', j.apres1211 === j.c1211, j.c1211 + ' PM → ' + j.apres1211 + ' de froid');
    v('seiryu porte l\'icône ❄ Froid confié, avec le nombre', j.etat && String(j.compteur) === String(j.apres1211), 'compteur ' + j.compteur);
    v('« Glace — Hiver » s\'y ajoute', j.apres1215 === j.c1211 + j.c1215, '+' + j.c1215 + ' → ' + j.apres1215);
    v('la jauge s\'arrête à 100', j.plafond === 100, String(j.plafond));
    v('« Instant Gelé » aussi (12 PM)', j.apres90 === j.c90, j.c90 + ' → ' + j.apres90);
    v('contre-épreuve : une compétence hors Hiver ne confie rien', j.horsHiver === 0);
    v('contre-épreuve : ludwing ne confie rien', j.ludwing === 0);
    v('vide, l\'icône s\'en va', !j.etatVide);

    // ── 2 · seiryu chargé ───────────────────────────────────────────────
    console.log('\n2) seiryu chargé');
    var c = await page.evaluate(function () {
        var s = __s(), e = __e(), ael = $gameActors.actor(4), r = {};
        // soin
        ael.setHp(Math.floor(ael.mhp * 0.2)); FroidConfie.poser(0);
        var a0 = __agir(s, 1259, ael); r.soin0 = -a0.r.hpDamage; r.j0 = FroidConfie.jauge();
        ael.setHp(Math.floor(ael.mhp * 0.2)); FroidConfie.poser(100);
        var a1 = __agir(s, 1259, ael); r.soin1 = -a1.r.hpDamage; r.j1 = FroidConfie.jauge();
        // coup
        e.recoverAll(); e.removeState(211); FroidConfie.poser(0);
        var b0 = __agir(s, 1251, e); r.coup0 = b0.r.hpDamage; r.engourdi0 = e.isStateAffected(211);
        e.recoverAll(); e.removeState(211); FroidConfie.poser(100);
        var b1 = __agir(s, 1251, e); r.coup1 = b1.r.hpDamage; r.engourdi1 = e.isStateAffected(211); r.j2 = FroidConfie.jauge();
        r.taux4 = e.elementRate(4); r.taux13 = e.elementRate(13); r.elements = b1.act.getItemElements ? b1.act.getItemElements() : null;
        // l'échelle : le plus petit sort d'Hiver de Korrah, sur la même cible
        __fixe([1211]); e.recoverAll();
        r.korrahGivre = __agir(__k(), 1211, e).r.hpDamage;
        e.recoverAll();                                       // la chauve-souris n'y survit pas : on la relève
        // pas assez de froid : rien
        ael.setHp(Math.floor(ael.mhp * 0.2)); FroidConfie.poser(10);
        var a2 = __agir(s, 1259, ael); r.soinMaigre = -a2.r.hpDamage; r.j3 = FroidConfie.jauge();
        // garde : Le Souffle Qui Couvre sur chacun
        var allies = $gameParty.aliveMembers();
        allies.forEach(function (m) { m.removeState(229); m.removeState(246); });
        FroidConfie.poser(0);
        allies.forEach(function (m) { var g = new Game_Action(s); g.setSkill(1262); m.clearResult(); g.apply(m); });
        r.garde0 = allies.map(function (m) { return (m._stateTurns[229] || 0) + '/' + (m.isStateAffected(246) ? 'mord' : '-'); });
        allies.forEach(function (m) { m.removeState(229); m.removeState(246); });
        FroidConfie.poser(100);
        var g1 = new Game_Action(s); g1.setSkill(1262);
        allies.forEach(function (m) { m.clearResult(); g1.apply(m); });
        r.garde1 = allies.map(function (m) { return (m._stateTurns[229] || 0) + '/' + (m.isStateAffected(246) ? 'mord:' + m._stateTurns[246] : '-'); });
        r.j4 = FroidConfie.jauge();
        // le froid mord : un ennemi qui frappe un protégé s'engourdit…
        var cible = $gameActors.actor(3);
        e.removeState(211);
        var frappe = new Game_Action(e); frappe.setAttack();
        for (var i = 0; i < 30; i++) { cible.clearResult(); frappe = new Game_Action(e); frappe.setAttack(); frappe.apply(cible); if (cible.result().isHit()) { break; } }
        r.mord = e.isStateAffected(211);
        // … et pas sans la garde chargée
        e.removeState(211); cible.removeState(246);
        for (i = 0; i < 30; i++) { cible.clearResult(); frappe = new Game_Action(e); frappe.setAttack(); frappe.apply(cible); if (cible.result().isHit()) { break; } }
        r.mordSans = e.isStateAffected(211);
        // un autre héros ne dépense rien
        FroidConfie.poser(100);
        ael.setHp(Math.floor(ael.mhp * 0.5));
        __agir($gameActors.actor(3), 1, e); r.j5 = FroidConfie.jauge();
        allies.forEach(function (m) { m.removeState(229); m.removeState(246); m.recoverAll(); });
        e.recoverAll(); e.removeState(211); FroidConfie.poser(0); __pleins();
        return r;
    });
    var rs = c.soin1 / c.soin0;
    v('soin chargé ×' + String(j.reglages.bonusSoin).replace('.', ',') + ' (le réglage)', j.reglages.bonusSoin === 1.25 && Math.abs(rs - j.reglages.bonusSoin) < 0.01,
        c.soin0 + ' → ' + c.soin1 + ' PV (×' + rs.toFixed(3) + ')');
    v('il a pris 25 de froid, pas plus', c.j0 === 0 && c.j1 === 75, '100 → ' + c.j1);
    var attendu = c.coup0 * 1.5 * (c.taux4 ? c.taux13 / c.taux4 : 1);
    v('coup chargé : de glace, ×1,5', c.taux4 > 0 && Math.abs(c.coup1 - attendu) <= 2 && JSON.stringify(c.elements) === '[13]',
        c.coup0 + ' → ' + c.coup1 + ' dégâts (attendu ' + Math.round(attendu) + ', taux 4=' + c.taux4 + ' 13=' + c.taux13 + ', éléments ' + JSON.stringify(c.elements) + ')');
    v('il engourdit à coup sûr — et seulement chargé', c.engourdi1 && !c.engourdi0, 'sans froid : ' + c.engourdi0 + ' · chargé : ' + c.engourdi1);
    v('il reste un soutien : chargé, il frappe moins fort que le plus petit Hiver de Korrah', c.coup1 < c.korrahGivre,
        'seiryu chargé ' + c.coup1 + ' · Korrah « Glace — Givre » ' + c.korrahGivre);
    v('contre-épreuve : 10 de froid, rien ne se charge', c.j3 === 10 && c.soinMaigre === c.soin0, 'jauge ' + c.j3 + ' · soin ' + c.soinMaigre);
    v('garde chargée : +1 tour, et « le froid mord » sur chacun',
        c.garde0.every(function (x) { return x === '3/-'; }) && c.garde1.every(function (x) { return x === '4/mord:4'; }),
        'sans : ' + c.garde0.join(' ') + ' · chargée : ' + c.garde1.join(' '));
    v('une seule charge pour toute l\'action de groupe', c.j4 === 75, '100 → ' + c.j4);
    v('qui frappe un protégé chargé s\'engourdit', c.mord);
    v('contre-épreuve : sans garde chargée, rien', !c.mordSans);
    v('contre-épreuve : ludwing qui frappe ne dépense pas le froid', c.j5 === 100);

    // ── 3 · Rends-le ────────────────────────────────────────────────────
    console.log('\n3) « Rends-le »');
    var rl = await page.evaluate(function () {
        var s = __s(), k = __k(), e = __e(), r = {};
        e.recoverAll(); e.removeState(94); FroidConfie.poser(0);
        r.base = __agir(s, 1254, e).r.hpDamage;
        e.recoverAll(); e.removeState(94); e.removeState(211);
        FroidConfie.poser(80);
        var ordre = new Game_Action(k); ordre.setSkill(1258); e.clearResult(); ordre.apply(e);   // l'ordre : seiryu est appelé
        r.forcees = BattleManager._actionForcedBattler ? 1 : (BattleManager._forcedBattlers ? BattleManager._forcedBattlers.length : 0);
        r.tout = __agir(s, 1254, e).r.hpDamage; r.gelure = e.isStateAffected(94); r.jauge = FroidConfie.jauge();
        // sans l'ordre, la même technique ne vide pas tout : une charge
        e.recoverAll(); FroidConfie.poser(80);
        r.seul = __agir(s, 1254, e).r.hpDamage; r.jaugeSeul = FroidConfie.jauge();
        BattleManager._actionForcedBattler = null; if (BattleManager._forcedBattlers) { BattleManager._forcedBattlers = []; }
        e.recoverAll(); e.removeState(94); e.removeState(211); FroidConfie.poser(0); __pleins();
        return r;
    });
    v('sur l\'ordre, tout part : × (1 + 80 ÷ 50) = ×2,6', Math.abs(rl.tout - rl.base * 2.6) <= 2 && rl.jauge === 0, rl.base + ' → ' + rl.tout + ' · jauge ' + rl.jauge);
    v('Gelure à coup sûr dès 50 de froid', rl.gelure);
    v('seul, il ne vide pas tout : une charge (×1,5)', Math.abs(rl.seul - rl.base * 1.5) <= 2 && rl.jaugeSeul === 55, rl.seul + ' · jauge ' + rl.jaugeSeul);

    // ── 4 · Le Froid Rendu ──────────────────────────────────────────────
    console.log('\n4) Le Froid Rendu (800)');
    var fr = await page.evaluate(function () {
        var k = __k(), sk = $dataSkills[800], r = {};
        r.pm = sk.mpCost; r.pt = sk.tpCost; r.desc = sk.description.split('\n')[0];
        k.setTp(100);
        FroidConfie.poser(99); r.a99 = k.canUse(sk);
        FroidConfie.poser(100); r.a100 = k.canUse(sk);
        var pmAvant = k.mp; k.paySkillCost(sk); r.apres = FroidConfie.jauge(); r.pmPaye = pmAvant - k.mp;
        r.hiver13 = $dataSkills.filter(function (x) { return x && x.stypeId === 6 && x.id !== 800; })
            .every(function (x) { return /\nConfie son coût en froid à seiryu\.$/.test(x.description); });
        __pleins();
        return r;
    });
    v('0 PM, 100 PT', fr.pm === 0 && fr.pt === 100);
    v('99 de froid : impossible ; 100 : possible', !fr.a99 && fr.a100);
    v('lancé, il prend toute la jauge, et aucun PM', fr.apres === 0 && fr.pmPaye === 0, 'jauge ' + fr.apres + ' · PM payés ' + fr.pmPaye);
    v('sa description le dit', /toute la jauge \(100\)/.test(fr.desc), fr.desc);
    v('les 13 autres compétences d\'Hiver portent la ligne', fr.hiver13);

    // ── 5 · le froid qui revient ────────────────────────────────────────
    console.log('\n5) Le froid qui revient');
    var rv = await page.evaluate(function () {
        var s = __s(), k = __k(), r = {};
        var ramener = function () { var n = 0; while (s.isDead() && n++ < 6) { __tour(); } return s.isAlive(); };
        k.removeState(211); k.removeState(244);
        BattleManager._performedBattlers = [];
        FroidConfie.poser(40); __coup(s, s.hp + 50);
        r.peu = { engourdie: k.isStateAffected(211), saisie: k.isStateAffected(244), jauge: FroidConfie.jauge() };
        r.revenu1 = ramener();
        k.removeState(211); k.removeState(244);
        BattleManager._performedBattlers = [];                  // elle n'a pas encore joué ce tour
        FroidConfie.poser(80); __coup(s, s.hp + 50);
        r.avant = { saisie: k.isStateAffected(244), tours: k._stateTurns[244], bouge: k.canMove() };
        r.revenu2 = ramener();
        k.removeState(211); k.removeState(244);
        BattleManager._performedBattlers = [k];                 // elle a déjà joué
        FroidConfie.poser(80); __coup(s, s.hp + 50);
        r.apres = { saisie: k.isStateAffected(244), tours: k._stateTurns[244] };
        r.revenu3 = ramener();
        // éteint AVEC elle : rien ne revient
        k.removeState(211); k.removeState(244); BattleManager._performedBattlers = [];
        FroidConfie.poser(80);
        __tombe(k); BattleManager.endAction();
        r.eteint = s.isDead(); r.jaugeEteint = FroidConfie.jauge();
        __releve(k); BattleManager.endAction();
        r.avecElle = { revenu: s.isAlive(), engourdie: k.isStateAffected(211), saisie: k.isStateAffected(244) };
        k.removeState(211); k.removeState(244); s.recoverAll(); __pleins();
        return r;
    });
    v('40 de froid perdu : elle s\'engourdit, sans perdre de tour', rv.peu.engourdie && !rv.peu.saisie && rv.peu.jauge === 0, JSON.stringify(rv.peu));
    v('80 perdu avant qu\'elle joue : saisie pour CE tour', rv.avant.saisie && rv.avant.tours === 1 && !rv.avant.bouge, JSON.stringify(rv.avant));
    v('80 perdu après qu\'elle a joué : saisie pour le tour SUIVANT', rv.apres.saisie && rv.apres.tours === 2, JSON.stringify(rv.apres));
    v('seiryu se reforme à chaque fois (règle de SeiryuLeFamilier)', rv.revenu1 && rv.revenu2 && rv.revenu3);
    v('éteint avec elle : le froid se perd', rv.eteint && rv.jaugeEteint === 0);
    v('… et ne revient pas sur elle quand elle se relève', rv.avecElle.revenu && !rv.avecElle.engourdie && !rv.avecElle.saisie, JSON.stringify(rv.avecElle));

    // ── 6 · Change ──────────────────────────────────────────────────────
    console.log('\n6) Change');
    var ch = await page.evaluate(function () {
        var k = __k(), s = __s(), e = __e(), ves = $gameActors.actor(1), lud = $gameActors.actor(3), r = {};
        r.ordreAvant = $gameParty._actors.slice();
        // l'ennemi pose un engourdissement et une baisse de vitesse sur Vesper (Givre Profond).
        // La baisse est tirée au sort (taux × chance) : on rejoue jusqu'à avoir les deux.
        r.tauxBaisse = ves.debuffRate(6);
        ves.removeState(211); ves.clearBuffs();
        for (var i = 0; i < 200 && !(ves.isStateAffected(211) && ves._buffs[6] < 0); i++) {
            var a = new Game_Action(e); a.setSkill(1155); ves.clearResult(); a.apply(ves); ves.setHp(ves.mhp);
        }
        r.vesAvant = { engourdie: ves.isStateAffected(211), vitesse: ves._buffs[6] };
        // et seiryu lui pose sa garde : ça, c'est à elle, ça reste
        var g = new Game_Action(s); g.setSkill(1262); ves.clearResult(); g.apply(ves);
        k.removeState(211); k.clearBuffs && k.clearBuffs();
        var ch = new Game_Action(k); ch.setSkill(438); ves.clearResult(); ch.apply(ves);
        r.ordreApres = $gameParty._actors.slice();
        r.korrah = { engourdie: k.isStateAffected(211), vitesse: k._buffs[6] };
        r.vesper = { engourdie: ves.isStateAffected(211), vitesse: ves._buffs[6], garde: ves.isStateAffected(229), place: ves.isStateAffected(245), tours: ves._stateTurns[245] };
        // les coups ciblés sur Vesper la frappent, elle
        var coup = new Game_Action(e); coup.setAttack(); BattleManager._action = coup;
        r.detourne = BattleManager.applySubstitute(ves) === k;
        r.lud = BattleManager.applySubstitute(lud) === lud;
        var zone = new Game_Action(e); zone.setSkill(1152); BattleManager._action = zone;      // Gel de Surface : tous
        r.zone = BattleManager.applySubstitute(ves) === ves;
        var allie = new Game_Action(lud); allie.setSkill(1259); BattleManager._action = allie;
        r.allie = BattleManager.applySubstitute(ves) === ves;
        // immobilisée, elle ne couvre plus
        BattleManager._action = coup; k.addState(244);
        r.saisie = BattleManager.applySubstitute(ves) === ves;
        k.removeState(244);
        // sur seiryu : rien ne bouge à l'écran, mais elle le couvre
        var ordre1 = $gameParty._actors.slice();
        var ch2 = new Game_Action(k); ch2.setSkill(438); s.clearResult(); ch2.apply(s);
        r.surSeiryu = { ordre: JSON.stringify($gameParty._actors) === JSON.stringify(ordre1), place: s.isStateAffected(245), vesperLibre: !ves.isStateAffected(245) };
        BattleManager._action = coup;
        r.couvreSeiryu = BattleManager.applySubstitute(s) === k;
        BattleManager._action = null;
        s.removeState(245); k.removeState(211); k.clearBuffs && k.clearBuffs(); ves.removeState(229);
        return r;
    });
    v('l\'ennemi a bien posé son froid sur Vesper', ch.vesAvant.engourdie && ch.vesAvant.vitesse < 0, JSON.stringify(ch.vesAvant) + ' · taux de baisse ' + ch.tauxBaisse);
    var iK = ch.ordreAvant.indexOf(2), iV = ch.ordreAvant.indexOf(1);
    v('Korrah prend la place de Vesper dans le groupe', ch.ordreApres[iK] === 1 && ch.ordreApres[iV] === 2, ch.ordreAvant.join(',') + ' → ' + ch.ordreApres.join(','));
    v('elle lui reprend ce que l\'ennemi a posé', ch.korrah.engourdie && ch.korrah.vitesse < 0 && !ch.vesper.engourdie && !(ch.vesper.vitesse < 0),
        'Korrah ' + JSON.stringify(ch.korrah) + ' · Vesper ' + JSON.stringify(ch.vesper));
    v('contre-épreuve : la garde de seiryu reste à Vesper', ch.vesper.garde);
    v('Vesper est « à sa place » pour 3 tours', ch.vesper.place && ch.vesper.tours === 3);
    v('un coup ennemi ciblé sur Vesper frappe Korrah', ch.detourne);
    v('contre-épreuve : un coup sur ludwing reste sur ludwing', ch.lud);
    v('contre-épreuve : un coup de zone n\'est pas détourné', ch.zone);
    v('contre-épreuve : un soin d\'allié n\'est pas détourné', ch.allie);
    v('contre-épreuve : saisie, elle ne couvre plus', ch.saisie);
    v('sur seiryu : rien ne bouge à l\'écran, la place passe à lui', ch.surSeiryu.ordre && ch.surSeiryu.place && ch.surSeiryu.vesperLibre, JSON.stringify(ch.surSeiryu));
    v('et les coups qui le visent la frappent, elle', ch.couvreSeiryu);

    // ── 7 · un vrai combat ──────────────────────────────────────────────
    console.log('\n7) Un vrai combat, laissé tourner');
    await page.evaluate(function () {
        SceneManager._scene.update = window.__vraieMaj;
        BattleManager.endBattle(2); $gameParty.onBattleEnd(); $gameTroop.onBattleEnd();
        window.__ordreFin = $gameParty._actors.slice();
        SceneManager.goto(Scene_Map);
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    var fin = await page.evaluate(function () { return { avant: window.__ordreAvant, fin: window.__ordreFin }; });
    v('à la fin du combat, l\'ordre du groupe est rendu', JSON.stringify(fin.avant) === JSON.stringify(fin.fin), fin.avant.join(',') + ' → ' + fin.fin.join(','));
    await page.waitForTimeout(800);
    await page.evaluate(function () {
        window.__auto = Game_Actor.prototype.isAutoBattle;
        Game_Actor.prototype.isAutoBattle = function () { return true; };
    });
    await ouvrirCombat();
    await page.evaluate(function () {
        $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); });
        $gameParty.members().forEach(function (a) { a.recoverAll(); if (a.actorId() !== 6) { a.addParam(0, 9999999); a.recoverAll(); } });
        window.__journal = [];
        var push = Window_BattleLog.prototype.addText;
        Window_BattleLog.prototype.addText = function (t) { window.__journal.push(String(t)); return push.call(this, t); };
        window.__joue = [];
        var sa = BattleManager.startAction;
        BattleManager.startAction = function () {
            if (this._subject && this._subject.isActor() && this._subject.actorId() === 2) { window.__joue.push($gameTroop.turnCount()); }
            return sa.apply(this, arguments);
        };
        // au début du tour 2, avant qu'elle joue : seiryu tombe avec 80 de froid
        window.__saisiAu = 2;
        var st = BattleManager.startTurn;
        BattleManager.startTurn = function () {
            var r = st.apply(this, arguments);
            if ($gameTroop.turnCount() === window.__saisiAu) {
                var s = $gameActors.actor(6);
                if (s.isAlive()) {
                    FroidConfie.poser(80);
                    var act = new Game_Action($gameTroop.aliveMembers()[0]); act.setAttack();
                    s.clearResult(); act.executeDamage(s, s.hp + 50);
                    window.__saisie = { tours: $gameActors.actor(2)._stateTurns[244], saisie: $gameActors.actor(2).isStateAffected(244) };
                }
            }
            return r;
        };
    });
    try {
        await page.waitForFunction(function () { return $gameTroop.turnCount() >= 4 || !$gameParty.inBattle(); }, null, { timeout: 420000, polling: 500 });
    } catch (e) { }
    await page.waitForTimeout(1000);
    var reel = await page.evaluate(function () {
        return { joue: window.__joue, saisie: window.__saisie, tour: $gameTroop.turnCount(),
                 journal: window.__journal.filter(function (l) { return /froid|Change/i.test(l); }).map(function (l) { return l.replace(/\\C\[\d+\]/g, ''); }) };
    });
    var au = function (t) { return reel.joue.filter(function (x) { return x === t; }).length; };
    v('le moteur a joué jusqu\'au tour 4', reel.tour >= 4, 'tour ' + reel.tour);
    v('saisie au début du tour 2, avant d\'avoir joué', reel.saisie && reel.saisie.saisie && reel.saisie.tours === 1, JSON.stringify(reel.saisie));
    v('elle joue au tour 1, PAS au tour 2, et rejoue au tour 3', au(1) >= 1 && au(2) === 0 && au(3) >= 1, 'ses actions par tour : ' + JSON.stringify(reel.joue));
    v('le journal le dit au joueur', reel.journal.some(function (l) { return /revient sur Korrah/.test(l); }), reel.journal.slice(0, 3).join(' | '));

    console.log('');
    v('aucune erreur JavaScript', err.length === 0, err.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(72) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(72));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
