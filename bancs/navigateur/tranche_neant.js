/*
 * BANC NAVIGATEUR — TRANCHE-NÉANT, SELON L'ARME TENUE (2026-10-26)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-26, à « qu'elle devienne un art d'arme de Vesper (style
 * Lame, selon l'arme tenue) » : « oui donc plusieurs variantes ».
 *
 * Une variante par famille d'arts d'armes, tirée de ses arts : à l'épée (et
 * au fouet, à l'éclat — sans famille) 445, toute la troupe, elle part avant
 * tout le monde (Iaï) ; à la dague 1310, un ennemi, la moitié de l'armure
 * ignorée (Sous la Garde) ; à la hache 1311, toute la troupe, peut étourdir
 * (Coup d'Épaule) ; à la lance 1312, toute la troupe, 30 % de l'armure ignorés,
 * ils ralentissent (Percée, Balayage) ; à distance 1313, quatre traits au
 * hasard (Tirs en Pluie) ; aux poings 1314, un ennemi, peut donner le vertige
 * (Talon Retourné). Même prix, même recharge, même contre-coup.
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. en Lame, elle voit UNE Tranche-Néant, celle de l'arme qu'elle tient
 *      (épée, Lame Écarlate, dague, hache, lance, canne, arc, fusil, gant,
 *      griffe, mains nues, fouet, éclat) ; en Sang et en Garde, aucune ;
 *   2. chaque forme fait ce qu'elle dit — et pas les autres : l'épée part
 *      la première, la dague perce l'armure, la hache étourdit, la lance
 *      ralentit, la distance tire quatre fois, les poings donnent le vertige ;
 *   3. les variantes sont la même fiche que 445 (prix, recharge, contre-coup,
 *      ultime, art) sauf leur forme ; la forme s'annonce, un art d'arme non.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   cmd /c start "" /b /wait /low /affinity 3 node bancs/navigateur/tranche_neant.js
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

    console.log('=== TRANCHE-NÉANT, SELON L\'ARME TENUE ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var o = {}, ves = $gameActors.actor(1), TN = [445, 1310, 1311, 1312, 1313, 1314];
        var e = $gameTroop.members()[0];
        $gameTroop.members().forEach(function (x) { x.addParam(0, 9999999); x.recoverAll(); });
        Math.random = function () { return 0.5; };
        function armeDe(t) { return $dataWeapons.filter(function (w) { return w && w.name && w.wtypeId === t; })[0] || null; }
        function vues() { return StylesVesper.kit().filter(function (i) { return TN.indexOf(i) >= 0; }); }
        function tenir(t) { ves.forceChangeEquip(0, t === 0 ? null : armeDe(t)); }
        PacteDeSang.changerStyle('lame');

        // 1 · la bonne variante selon l'arme
        var ARMES = [['épée', 2], ['Lame Écarlate', 15], ['dague', 1], ['hache', 4], ['lance', 12], ['canne', 6], ['arc', 7], ['fusil', 9],
                     ['gant', 11], ['griffe', 10], ['mains nues', 0], ['fouet', 5], ['éclat', 16]];
        o.selon = ARMES.map(function (x) {
            if (x[1] && !armeDe(x[1])) { return { nom: x[0], absente: true }; }
            tenir(x[1]);
            return { nom: x[0], vues: vues(), peut: TN.filter(function (i) { return ves.canUse($dataSkills[i]); }) };
        });
        tenir(1);
        PacteDeSang.changerStyle('saignee'); o.enSang = vues();
        PacteDeSang.changerStyle('garde'); o.enGarde = vues();
        PacteDeSang.changerStyle('lame');

        // 2 · chaque forme fait ce qu'elle dit
        function action(id) { var a = new Game_Action(ves); a.setSkill(id); a.setTarget(e.index()); return a; }
        o.cibles = {};
        TN.forEach(function (id) { o.cibles[id] = action(id).makeTargets().length; });
        o.vivants = $gameTroop.aliveMembers().length;
        // l'épée part la première, même devant un ennemi bien plus rapide ; pas la dague
        e.addParam(6, 99999);
        function quiCommence(id) {
            var g = new Game_Action(e); g.setGuard(); e._actions = [g];
            $gameTroop.members().forEach(function (m) { if (m !== e) { m._actions = []; } });
            ves._actions = [action(id)];
            $gameParty.members().forEach(function (m) { if (m !== ves) { m._actions = []; } });
            ves._mvtFlux = 0;
            BattleManager.makeActionOrders();
            return BattleManager._actionBattlers[0] === ves;
        }
        o.premier = quiCommence(445); o.premierContre = quiCommence(1310);
        e.addParam(6, -99999); BattleManager._actionBattlers = [];
        // la dague perce l'armure : sa frappe baisse moins que celle des poings quand l'armure triple
        function frappe(id) { return action(id).evalDamageFormula(e); }
        var d0 = frappe(1310), p0 = frappe(1314), l0 = frappe(1312), s0 = frappe(445);
        e.addParam(3, e.def * 2);
        o.perce = { dague: frappe(1310) / d0, poings: frappe(1314) / p0, lance: frappe(1312) / l0, epee: frappe(445) / s0 };
        e.addParam(3, -Math.round(e.def * 2 / 3));
        // les effets : hache (Étourdi), lance (ralentit), poings (Vertige) — sous un hasard qui les laisse passer
        function effet(id, test) {
            e.clearResult(); [134, 222].forEach(function (s) { e.eraseState(s); }); e.removeBuff(6); e._buffs[6] = 0;
            Math.random = function () { return 0.01; };
            var a = action(id); a.apply(e);
            Math.random = function () { return 0.5; };
            return test();
        }
        function etourdi() { return e.isStateAffected(134); }
        function ralenti() { return e.isDebuffAffected(6); }
        function vertige() { return e.isStateAffected(222); }
        o.effets = {
            hache: effet(1311, etourdi), hacheContre: effet(445, etourdi),
            lance: effet(1312, ralenti), lanceContre: effet(1311, ralenti),
            poings: effet(1314, vertige), poingsContre: effet(1310, vertige)
        };
        [134, 222].forEach(function (s) { e.eraseState(s); }); e._buffs[6] = 0;

        // 3 · la même fiche que 445, sauf sa forme ; ce qui se voit
        // les champs de la base de MV (YEP en calcule d'autres au chargement, selon la portée et le numéro)
        var ref = $dataSkills[445], CHAMPS = ['animationId', 'hitType', 'iconIndex', 'message1', 'message2', 'mpCost', 'name', 'occasion', 'repeats',
            'requiredWtypeId1', 'requiredWtypeId2', 'speed', 'stypeId', 'successRate', 'tpCost', 'tpGain'];
        function sansForme(s) { return JSON.stringify(CHAMPS.map(function (k) { return s[k]; })); }
        function noteSansForme(s) { return s.note.replace(/<ArtArme:[^>]*>\n/, '').replace(/<Premier>\n/, '').replace(/\nvariante de Tranche-Néant[^\n]*/, '').replace(/\nrecharge posee le[^\n]*/, ''); }
        o.memeFiche = TN.slice(1).map(function (id) {
            var s = $dataSkills[id];
            return { id: id, ok: sansForme(s) === sansForme(ref) && noteSansForme(s) === noteSansForme(ref) && s.damage.elementId === ref.damage.elementId && s.damage.type === ref.damage.type
                && s.description.split('\n')[0] === ref.description.split('\n')[0],
                pv: ves.skillHpCost(s), art: LesTroisArts.art(s), hors: LesTroisArts.horsAffinite(ves, s), recharge: s.meta.Cooldown };
        });
        o.prix445 = ves.skillHpCost(ref);
        function annonces() { return (ves._ctAnnonces || []).map(function (a) { return a.texte; }); }
        function lancer(id) { ves._ctAnnonces = []; var a = action(id); e.clearResult(); a.apply(e); return annonces(); }
        tenir(1); o.annonceDague = lancer(1310);
        tenir(5); o.annonceFouet = lancer(445);
        tenir(2); o.annonceArt = lancer(1281);
        tenir(2);
        return o;
    });

    console.log('1) Elle voit celle de l\'arme qu\'elle tient');
    var ATTENDU = { 'épée': 445, 'Lame Écarlate': 445, 'dague': 1310, 'hache': 1311, 'lance': 1312, 'canne': 1312, 'arc': 1313, 'fusil': 1313,
                    'gant': 1314, 'griffe': 1314, 'mains nues': 1314, 'fouet': 445, 'éclat': 445 };
    r.selon.forEach(function (x) {
        if (x.absente) { console.log('   —   ' + x.nom + ' : aucune arme de ce type dans la base'); return; }
        var a = ATTENDU[x.nom];
        v(x.nom + ' → ' + a + ', et rien d\'autre (menu et lancer)', x.vues.length === 1 && x.vues[0] === a && x.peut.length === 1 && x.peut[0] === a,
          'vues ' + x.vues.join(',') + ' · peut ' + x.peut.join(','));
    });
    v('contre-épreuve : en Sang et en Garde, aucune Tranche-Néant', r.enSang.length === 0 && r.enGarde.length === 0, 'Sang ' + r.enSang.join(',') + ' · Garde ' + r.enGarde.join(','));

    console.log('\n2) Chaque forme fait ce qu\'elle dit');
    var c = r.cibles, n = r.vivants;
    v('toute la troupe : épée, hache, lance ; un seul : dague, poings ; quatre traits : distance', c[445] === n && c[1311] === n && c[1312] === n && c[1310] === 1 && c[1314] === 1 && c[1313] === 4,
      JSON.stringify(c) + ' · ' + n + ' ennemis');
    v('à l\'épée, elle part avant un ennemi bien plus rapide', r.premier);
    v('…contre-épreuve : à la dague, non', !r.premierContre);
    v('la dague perce l\'armure : armure ×3, sa frappe baisse moins que celle des poings', r.perce.dague > r.perce.poings + 0.05,
      'dague ×' + r.perce.dague.toFixed(2) + ' · poings ×' + r.perce.poings.toFixed(2) + ' · lance ×' + r.perce.lance.toFixed(2) + ' · épée ×' + r.perce.epee.toFixed(2));
    v('la lance aussi, moins que la dague', r.perce.lance > r.perce.epee + 0.03 && r.perce.lance < r.perce.dague);
    v('la hache étourdit ; l\'épée, non', r.effets.hache && !r.effets.hacheContre);
    v('la lance ralentit ; la hache, non', r.effets.lance && !r.effets.lanceContre);
    v('les poings donnent le vertige ; la dague, non', r.effets.poings && !r.effets.poingsContre);

    console.log('\n3) La même technique, sous une autre forme');
    v('chaque variante est la fiche de 445 sauf sa forme (prix, recharge, contre-coup, ultime, élément, première ligne)', r.memeFiche.every(function (x) { return x.ok; }),
      r.memeFiche.filter(function (x) { return !x.ok; }).map(function (x) { return x.id; }).join(',') || 'les 5');
    v('même prix en PV que 445, des mouvements, dans son affinité, 3 tours de recharge', r.memeFiche.every(function (x) { return x.pv === r.prix445 && x.pv > 0 && x.art === 'mouvement' && !x.hors && String(x.recharge).trim() === '3'; }),
      r.prix445 + ' PV · ' + r.memeFiche.map(function (x) { return x.pv + '/' + x.art; }).join(' '));
    v('la forme s\'annonce : « ⚔ Tranche-Néant · à la dague »', r.annonceDague.indexOf('⚔ Tranche-Néant · à la dague') >= 0, r.annonceDague.join(' | '));
    v('au fouet (sans famille), le nom de l\'arme', r.annonceFouet.indexOf('⚔ Tranche-Néant · fouet') >= 0, r.annonceFouet.join(' | '));
    v('contre-épreuve : un art d\'arme ordinaire (Fil du Vent) ne s\'annonce pas', !r.annonceArt.some(function (t) { return /^⚔/.test(t); }), r.annonceArt.join(' | '));

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
