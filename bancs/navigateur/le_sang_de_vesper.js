/*
 * BANC NAVIGATEUR — LE SANG DE VESPER (le rework, V1, 2026-10-25)
 * ---------------------------------------------------------------------------
 * La Bible : « Vesper a une affinité naturelle au mana spirituel ; son don le
 * transforme en sang, et son sang se manie par les voies d'art. » JOKO, le
 * 2026-10-25 : « Oui tout » sur V1 — ses techniques de sang se paient en PV,
 * et restent des mouvements.
 *
 * La branche « sang » (type 10, celle que son don ouvre) passe en % de PV, au
 * tiers de son ancien coût (comme les écrits : PM → PV au tiers). Ses capacités
 * de la Voie du Sang (Art du Sang, Sang pour Sang…) restent en PT.
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. chaque technique de la branche se paie en PV, ni PM ni PT ; une capacité
 *      de la Voie du Sang et l'Hiver de Korrah gardent leur monnaie ;
 *   2. elle paie vraiment : ses PV baissent du prix, et sous le prix elle ne
 *      peut plus la lancer ; Rendre le Sang la soigne toujours ;
 *   3. ce sont toujours des mouvements (l'art, la Voie, le négatif), dans son
 *      affinité (pas de ×1,5) ;
 *   4. le menu affiche le prix en PV.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   cmd /c start "" /b /wait /low /affinity 3 node bancs/navigateur/le_sang_de_vesper.js
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

    console.log('=== LE SANG DE VESPER ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var o = {}, ves = $gameActors.actor(1), kor = $gameActors.actor(2);
        var e = $gameTroop.members()[0];
        e.addParam(0, 9999999); e.recoverAll();
        Math.random = function () { return 0.5; };
        var SANG = ves.skills().filter(function (s) { return s.stypeId === 10; });
        o.sang = SANG.map(function (s) { return { id: s.id, nom: s.name, pv: ves.skillHpCost(s), pm: ves.skillMpCost(s), pt: ves.skillTpCost(s) }; });
        o.voieDuSang = [1132, 146].map(function (id) { var s = $dataSkills[id]; return { nom: s.name, pv: ves.skillHpCost(s), pt: ves.skillTpCost(s), pm: ves.skillMpCost(s) }; });
        var hiver = kor.skills().filter(function (s) { return s.stypeId === 6 && s.mpCost > 0; })[0];
        o.hiver = { nom: hiver.name, pm: kor.skillMpCost(hiver), pv: kor.skillHpCost(hiver) };

        // 2 · elle paie vraiment
        var sp = $dataSkills[1299];
        ves.recoverAll(); var avant = ves.hp; ves.paySkillCost(sp);
        o.paye = { avant: avant, apres: ves.hp, prix: ves.skillHpCost(sp), tp: ves.tp };
        ves.setHp(ves.skillHpCost(sp)); o.sousLePrix = ves.canPaySkillCost(sp);
        ves.setHp(ves.skillHpCost(sp) + 1); o.justeAuDessus = ves.canPaySkillCost(sp);
        ves.recoverAll();
        // Rendre le Sang : elle paie, puis le Pacte et l'ATQ la soignent
        var rs = $dataSkills[1143];
        ves.setHp(Math.floor(ves.mhp * 0.5)); ves._pacte = Math.floor(ves.mhp * 0.6);
        var pv0 = ves.hp; ves.paySkillCost(rs); var pv1 = ves.hp;
        var a = new Game_Action(ves); a.setSkill(1143); a.setTarget(e.index()); e.clearResult(); a.apply(e);
        if (a.applyGlobal) { a.applyGlobal(); }
        o.rendre = { avant: pv0, paye: pv1, apres: ves.hp, prix: ves.skillHpCost(rs) };
        ves.recoverAll();

        // 3 · des mouvements
        o.arts = SANG.map(function (s) { return { nom: s.name, art: LesTroisArts.art(s), mot: /^Parole n°2 /.test(s.name) }; });
        var as = new Game_Action(ves); as.setSkill(1299); as.setTarget(e.index());
        o.voie = LeMouvement.voie(as);
        o.elements = as.getItemElements();
        o.hors = SANG.filter(function (s) { return LesTroisArts.horsAffinite(ves, s); }).map(function (s) { return s.name; });

        // 4 · le menu
        var w = new Window_BattleSkill(0, 0, 400, 200), ecrit = [], dt = w.drawText;
        w.setActor(ves); w._data = [sp];
        w.drawText = function (t) { ecrit.push(String(t)); return dt.apply(this, arguments); };
        w.contents.clear(); w.drawItem(0); w.drawText = dt;
        o.menu = ecrit;
        return o;
    });

    console.log('1) La branche sang se paie en PV');
    v('Vesper a ses techniques de sang', r.sang.length >= 9, r.sang.length + ' : ' + r.sang.map(function (s) { return s.nom; }).join(', '));
    var faux = r.sang.filter(function (s) { return !(s.pv > 0 && s.pm === 0 && s.pt === 0); });
    v('chacune coûte des PV, ni PM ni PT', faux.length === 0, faux.length ? faux.map(function (s) { return s.nom + ' ' + s.pv + ' PV / ' + s.pm + ' PM / ' + s.pt + ' PT'; }).join(' · ') : r.sang.map(function (s) { return s.nom + ' ' + s.pv; }).slice(0, 4).join(' · ') + '…');
    v('contre-épreuve : la Voie du Sang (Art du Sang, Sang pour Sang) reste en PT', r.voieDuSang.every(function (s) { return s.pt > 0 && s.pv === 0; }), r.voieDuSang.map(function (s) { return s.nom + ' ' + s.pt + ' PT'; }).join(' · '));
    v('contre-épreuve : l\'Hiver de Korrah reste en PM', r.hiver.pm > 0 && r.hiver.pv === 0, r.hiver.nom + ' ' + r.hiver.pm + ' PM');

    console.log('\n2) Elle paie vraiment');
    v('Sang Perçant lui prend son prix en PV, et pas de PT', r.paye.avant - r.paye.apres === r.paye.prix && r.paye.prix > 0, r.paye.avant + ' → ' + r.paye.apres + ' (prix ' + r.paye.prix + ')');
    v('à son prix en PV, elle ne peut plus la lancer ; un PV de plus, si', !r.sousLePrix && r.justeAuDessus);
    v('Rendre le Sang : elle paie, puis le sang la soigne', r.rendre.paye === r.rendre.avant - r.rendre.prix && r.rendre.apres > r.rendre.avant, r.rendre.avant + ' → ' + r.rendre.paye + ' → ' + r.rendre.apres);

    console.log('\n3) Toujours des mouvements');
    v('chacune est un mouvement — sauf les « Parole n°2 », que leur mot de passe range dans l\'écrit (déjà en PV)',
      r.arts.every(function (x) { return x.art === (x.mot ? 'ecrit' : 'mouvement'); }) && r.arts.some(function (x) { return x.mot; }),
      r.arts.map(function (x) { return x.nom.replace('Parole n°2 ', '') + ' ' + x.art; }).join(', '));
    v('Sang Perçant prend la Voie du Sang et frappe en négatif', !!r.voie && r.elements.indexOf(4) >= 0, JSON.stringify(r.voie) + ' · éléments ' + r.elements.join(','));
    v('dans son affinité : aucune n\'est hors affinité', r.hors.length === 0, r.hors.join(', '));

    console.log('\n4) À l\'écran');
    v('le menu affiche le prix en PV de Sang Perçant', r.menu.some(function (t) { return /\d/.test(t) && /HP|PV/.test(t); }), r.menu.join(' | '));

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
