/*
 * BANC NAVIGATEUR — SEIRYU, CINQUIÈME COMBATTANT
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-09-24 : « Korrah, elle a deux personnes qui attaquent.
 * L'esprit qui fait pas beaucoup de dégâts, mais qui est utile pour la
 * protection et pour les soins, pour protéger ses alliés ou elle-même. »
 *
 * Avant, l'Avatar n'était pas quelqu'un : une action de plus, jouée depuis
 * Korrah, avec une image posée derrière elle. Pas de PV, pas de tour, pas
 * d'existence — on ne pouvait ni le viser ni le voir tomber.
 *
 * Ce banc vérifie qu'il EXISTE maintenant :
 *
 *   · il entre en cinquième et sort à la fin — jamais dans le menu ;
 *   · il a ses PV, son niveau (celui de Korrah) et son répertoire ;
 *   · le joueur ne le pilote pas : il décide seul, selon sa posture ;
 *   · au complet il frappe, un allié blessé il soigne, en garde il ne
 *     frappe plus du tout ;
 *   · les trois ordres de Korrah changent bien sa posture ;
 *   · « Devant Vous » le pose en SUBSTITUT au sens de MV ;
 *   · il s'éteint avec elle — sans quoi le groupe pourrait être à terre sans
 *     que le combat se termine.
 *
 * Il n'est pas automatique : il lui faut Playwright et un serveur.
 *
 *   npx http-server -p 8899 -c-1 .        (dans un autre terminal, à la racine)
 *   node bancs/navigateur/seiryu_cinquieme.js
 */

var { chromium } = require('playwright');
var SHOTS = process.env.ETT_CAPTURES || '/tmp/seiryu/';
require('fs').mkdirSync(SHOTS, { recursive: true });
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

    console.log('=== SEIRYU, CINQUIÈME COMBATTANT ===\n');

    // ── 1 · hors combat, il n'existe pas ──────────────────────────────────
    console.log('1) Hors combat');
    var horsCombat = await page.evaluate(function () {
        return { membres: $gameParty.members().map(function (a) { return a.name(); }),
                 taille: $gameParty.size(), max: $gameParty.maxBattleMembers() };
    });
    v('il n\'est PAS dans le groupe sur la carte', horsCombat.membres.indexOf('seiryu') < 0,
        horsCombat.membres.join(' · ') + '  (max en combat : ' + horsCombat.max + ')');

    // ── 2 · il entre ──────────────────────────────────────────────────────
    console.log('\n2) Il entre au combat');
    await page.evaluate(function () {
        $gameParty.members().forEach(function (a) { a.recoverAll(); a.setTp(100); });
        BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(3000);
    var dedans = await page.evaluate(function () {
        var s = $gameActors.actor(6), k = $gameActors.actor(2);
        return {
            combattants: $gameParty.battleMembers().map(function (a) { return a.name(); }),
            max: $gameParty.maxBattleMembers(),
            pv: s.hp + '/' + s.mhp, pm: s.mp + '/' + s.mmp,
            niveau: s._level, niveauKorrah: k._level,
            stats: { atk: s.atk, def: s.def, mat: s.mat, agi: s.agi },
            statsK: { atk: k.atk, def: k.def, mat: k.mat, agi: k.agi },
            competences: s.skills().map(function (x) { return x.name; }),
            pilotable: s.canInput(), auto: s.isAutoBattle(),
            visable: $gameParty.battleMembers().indexOf(s) >= 0
        };
    });
    v('il est le cinquième combattant', dedans.combattants.length === 5 && dedans.combattants.indexOf('seiryu') >= 0,
        dedans.combattants.join(' · ') + '  (max ' + dedans.max + ')');
    v('il a ses propres PV', /^\d+\/\d+$/.test(dedans.pv) && parseInt(dedans.pv) > 0, dedans.pv + ' PV · ' + dedans.pm + ' PM');
    v('son niveau suit celui de Korrah', dedans.niveau === dedans.niveauKorrah,
        'seiryu niveau ' + dedans.niveau + ' · Korrah niveau ' + dedans.niveauKorrah);
    // Korrah porte de l'équipement légendaire, seiryu est nu : on compare donc
    // « nettement plus fragile » et « presque aussi rapide », pas l'égalité.
    v('il est plus fragile qu\'elle, et presque aussi rapide',
        dedans.stats.def < dedans.statsK.def * 0.6 && dedans.stats.agi >= dedans.statsK.agi * 0.85,
        'DÉF ' + dedans.stats.def + ' contre ' + dedans.statsK.def + ' (' + Math.round(dedans.stats.def / dedans.statsK.def * 100) + ' %)' +
        ' · AGI ' + dedans.stats.agi + ' contre ' + dedans.statsK.agi + ' (' + Math.round(dedans.stats.agi / dedans.statsK.agi * 100) + ' %)');
    v('il connaît son répertoire', dedans.competences.length >= 10, dedans.competences.length + ' : ' + dedans.competences.slice(0, 5).join(', ') + '…');
    v('le joueur ne le pilote pas', dedans.pilotable === false && dedans.auto === true,
        'canInput=' + dedans.pilotable + ' · isAutoBattle=' + dedans.auto);
    await page.screenshot({ path: SHOTS + '01_il_entre.png' });

    // ── 3 · sa place ──────────────────────────────────────────────────────
    console.log('\n3) Sa place sur le champ');
    var place = await page.evaluate(function () {
        var sp = SceneManager._scene._spriteset;
        var lui = window.AvatarCorps.sprite(), elle = window.AvatarCorps.spritePorteuse();
        var enfants = (sp._battleField.children || []).map(function (c) { return c.constructor.name + (c._actor ? ':' + c._actor.actorId() : (c._battler ? ':e' : '')); });
        var demi = (lui && lui._mainSprite && lui._mainSprite.bitmap) ? (lui._mainSprite.bitmap.width / 9) * Math.abs(lui.scale.x) / 2 : 0;
        return {
            lui: lui ? { x: Math.round(lui.x), y: Math.round(lui.y), ech: lui.scale.x } : null,
            elle: elle ? { x: Math.round(elle.x), y: Math.round(elle.y) } : null,
            rangLui: enfants.findIndex(function (n) { return /:6$/.test(n); }),
            rangElle: enfants.findIndex(function (n) { return /:2$/.test(n); }),
            gauche: lui ? lui.x - demi : null, droite: lui ? lui.x + demi : null
        };
    });
    v('il se tient derrière elle', !!place.lui && !!place.elle && place.lui.x > place.elle.x && place.lui.y < place.elle.y,
        'Korrah (' + (place.elle ? place.elle.x + ',' + place.elle.y : '?') + ')  seiryu (' + (place.lui ? place.lui.x + ',' + place.lui.y : '?') + ')');
    v('il est DESSINÉ derrière elle', place.rangLui >= 0 && place.rangElle >= 0 && place.rangLui < place.rangElle,
        'rang ' + place.rangLui + ' contre ' + place.rangElle);
    v('il tient entièrement dans l\'écran', place.gauche >= 0 && place.droite <= 816,
        'de x=' + Math.round(place.gauche) + ' à x=' + Math.round(place.droite) + ' sur 816');

    // ── 4 · il flotte ─────────────────────────────────────────────────────
    var y1 = await page.evaluate(function () { return window.AvatarCorps.sprite().y; });
    await page.waitForTimeout(700);
    var y2 = await page.evaluate(function () { return window.AvatarCorps.sprite().y; });
    v('il flotte', Math.abs(y1 - y2) > 0.4, 'y ' + y1.toFixed(1) + ' → ' + y2.toFixed(1));

    // ── 5 · il décide tout seul ───────────────────────────────────────────
    console.log('\n4) Il décide tout seul');
    // ⚠ Depuis la v2 (le Lien), une partie neuve le fait démarrer SAUVAGE —
    //   « au début il est incontrôlable, voire complètement stupide » (JOKO).
    //   Ce qu'on vérifie ici, c'est le seiryu qui a appris : palier Dressé.
    //   Le Sauvage a son propre contrôle dans bancs/navigateur/lavatar_obeit.js.
    await page.evaluate(function () { window.Seiryu.experience(window.Seiryu.seuils.dresse); });
    var libre = await page.evaluate(function () {
        var s = $gameActors.actor(6);
        window.Seiryu.posture('libre');
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        s.clearActions(); s.makeActions();
        var a = s.currentAction();
        return { posture: window.Seiryu.posture(), skill: a && a.item() ? a.item().name : null };
    });
    v('au complet et en posture LIBRE, il frappe avec SES techniques',
        !!libre.skill && libre.skill !== 'Attaque', 'il choisit « ' + libre.skill + ' »');

    var soigne = await page.evaluate(function () {
        var s = $gameActors.actor(6);
        var v = $gameParty.members().filter(function (a) { return a.actorId() === 1; })[0];
        v.setHp(Math.floor(v.mhp * 0.2));          // Vesper à 20 %
        s.clearActions(); s.makeActions();
        var a = s.currentAction();
        var it = a && a.item();
        return { skill: it ? it.name : null, soin: it ? it.damage.type === 3 : false,
                 pvVesper: Math.round(v.hp / v.mhp * 100) };
    });
    v('un allié tombe à 20 %, il SOIGNE au lieu de frapper', soigne.soin === true,
        'Vesper à ' + soigne.pvVesper + ' % → il choisit « ' + soigne.skill + ' »');

    var garde = await page.evaluate(function () {
        var s = $gameActors.actor(6);
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        window.Seiryu.posture('garde');
        s.clearActions(); s.makeActions();
        var a = s.currentAction(); var it = a && a.item();
        return { posture: window.Seiryu.posture(), skill: it ? it.name : null,
                 frappe: it ? (it.damage.type === 1) : null };
    });
    v('en posture GARDE, il ne frappe plus', garde.frappe === false,
        'posture « ' + garde.posture + ' » → « ' + garde.skill + ' »');

    // ── 6 · les trois ordres ──────────────────────────────────────────────
    console.log('\n5) Les trois ordres de Korrah');
    for (var i = 0; i < 3; i++) {
        var r = await page.evaluate(function (idx) {
            var ids = [1246, 1247, 1248], attendus = ['libre', 'agressif', 'garde'];
            var k = $gameParty.members().filter(function (a) { return a.actorId() === 2; })[0];
            window.Seiryu.posture('libre');
            var act = new Game_Action(k); act.setSkill(ids[idx]); act.applyGlobal();
            return { skill: $dataSkills[ids[idx]].name, obtenu: window.Seiryu.posture(), attendu: attendus[idx] };
        }, i);
        v('« ' + r.skill +' » met la posture « ' + r.attendu + ' »', r.obtenu === r.attendu, 'obtenu « ' + r.obtenu + ' »');
    }

    // ── 7 · il protège pour de vrai ───────────────────────────────────────
    console.log('\n6) Sa protection, appliquée');
    var prot = await page.evaluate(function () {
        var s = $gameActors.actor(6);
        s.recoverAll();
        var act = new Game_Action(s); act.setSkill(1261); act.setTarget(0);
        act.apply(s);
        var apres = s.isStateAffected(228);
        var subst = s.isSubstitute ? s.isSubstitute() : null;
        return { etat: apres, substitut: subst, defense: s.def };
    });
    v('« Devant Vous » lui pose bien son état', prot.etat === true, 'état 228 posé');
    v('et MV le reconnaît comme SUBSTITUT', prot.substitut === true,
        'isSubstitute() = ' + prot.substitut + ' — il encaissera à la place des alliés faibles');

    var heal = await page.evaluate(function () {
        var s = $gameActors.actor(6);
        var v = $gameParty.members().filter(function (a) { return a.actorId() === 1; })[0];
        v.setHp(Math.floor(v.mhp * 0.3));
        var avant = v.hp;
        var act = new Game_Action(s); act.setSkill(1259); act.setTarget(0);
        act.apply(v);
        return { avant: avant, apres: v.hp, max: v.mhp, mat: s.mat };
    });
    v('son soin rend vraiment des PV', heal.apres > heal.avant,
        heal.avant + ' → ' + heal.apres + ' sur ' + heal.max + '  (+' + (heal.apres - heal.avant) + ', soit ' + Math.round((heal.apres - heal.avant) / heal.max * 100) + ' % de sa vie)');
    await page.screenshot({ path: SHOTS + '02_il_protege.png' });

    // ── 8 · il s'éteint avec elle ─────────────────────────────────────────
    console.log('\n7) Il s\'éteint avec elle');
    var chute = await page.evaluate(function () {
        var s = $gameActors.actor(6);
        var k = $gameParty.members().filter(function (a) { return a.actorId() === 2; })[0];
        s.recoverAll(); k.setHp(0); k.refresh();
        BattleManager.endTurn();
        return { korrahMorte: k.isDead(), seiryuMort: s.isDead() };
    });
    v('Korrah tombe, seiryu s\'éteint', chute.korrahMorte && chute.seiryuMort,
        'Korrah morte=' + chute.korrahMorte + ' · seiryu mort=' + chute.seiryuMort);
    var retour = await page.evaluate(function () {
        var s = $gameActors.actor(6);
        var k = $gameParty.members().filter(function (a) { return a.actorId() === 2; })[0];
        k.removeState(k.deathStateId()); k.setHp(k.mhp); k.refresh();
        BattleManager.endTurn();
        return { seiryuVivant: s.isAlive(), pv: s.hp + '/' + s.mhp };
    });
    v('elle se relève, il revient', retour.seiryuVivant === true, retour.pv + '  (il ne revient pas à pleine vie)');

    // ── 9 · il sort ───────────────────────────────────────────────────────
    console.log('\n8) Il sort du combat');
    await page.evaluate(function () { BattleManager.endBattle(0); });
    await page.waitForTimeout(900);
    await page.evaluate(function () { while (!(SceneManager._scene instanceof Scene_Map) && !SceneManager.isSceneChanging()) { SceneManager.pop(); } });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 30000 }).catch(function () { });
    await page.waitForTimeout(1200);
    var sorti = await page.evaluate(function () {
        return { membres: $gameParty.members().map(function (a) { return a.name(); }), max: $gameParty.maxBattleMembers() };
    });
    v('il a quitté le groupe', sorti.membres.indexOf('seiryu') < 0,
        sorti.membres.join(' · ') + '  (max revenu à ' + sorti.max + ')');

    console.log();
    v('aucune erreur JavaScript', err.length === 0, err.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(72));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(72));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
