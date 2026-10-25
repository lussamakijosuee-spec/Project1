/*
 * BANC NAVIGATEUR — LES TROIS ARTS (LesTroisArts.js, 2026-10-22)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-22 : « fait comme ça devait être de base » — trois sources,
 * trois arts, trois barres ; « oui pour le 2 » (l'Attaque à +20 PT, la Relique
 * ne garde plus les PT) ; « je t'autorise à tout […] sauf les dons ».
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. les réglages : LesTroisArts et LEcrit actifs ; LeSpirituel, FusionMana,
 *      ElementsVivants éteints ; plus de recul en PV du négatif ;
 *   2. l'art de chaque compétence : Paroles, mouvements, écrits, et ce qui
 *      n'est aucun art (Garde, ordres à seiryu, Styles, Contrats, soutien) ;
 *      LaParole et LeMouvement suivent la même règle ;
 *   3. le triangle : le mana d'une compétence de héros est celui de son art
 *      (éléments, dégâts, annonce ▲) — pas chez un ennemi ;
 *   4. le prix suit l'art sur toutes les capacités des quatre classes — et
 *      pas sur les dons ;
 *   5. la barre de PT : l'Attaque rend 20 PT (× TCR), la Relique ne les garde plus ;
 *   6. l'aide d'une compétence dit son art.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/les_trois_arts.js
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

    console.log('=== LES TROIS ARTS ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var A = LesTroisArts, out = {};
        var ves = $gameActors.actor(1), kor = $gameActors.actor(2), lud = $gameActors.actor(3), ael = $gameActors.actor(4);
        var e = $gameTroop.members()[0];
        e.addParam(0, 9999999); e.recoverAll();
        Math.random = function () { return 0.5; };
        function act(h, id, cible) {
            var a = new Game_Action(h); a.setSkill(id);
            if (cible) { a.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible)); }
            return a;
        }
        function art(id) { return A.art($dataSkills[id]); }

        // 1 · réglages
        var pl = {}; $plugins.forEach(function (p) { pl[p.name] = p; });
        out.reglages = { arts: !!pl.LesTroisArts && pl.LesTroisArts.status, ecrit: !!pl.LEcrit && pl.LEcrit.status,
                         spirituel: pl.LeSpirituel.status, fusion: pl.FusionMana.status, vivants: pl.ElementsVivants.status,
                         recul: pl.ManaAffinity.parameters.recoilNegatif + '/' + pl.ManaAffinity.parameters.recoilSombre };

        // 2 · l'art
        out.paroles = [1186, 151, 9, 1211, 1178].map(art);
        out.mouvements = [1106, 1, 53, 153, 56, 1082].map(art);
        out.ecrits = [158, 1165, 466, 152, 825].map(art);
        out.aucun = [2, 6, 1246, 1265, 1279, 14].map(art);
        out.tags = [1114, 1236, 1233].map(art);
        out.laParole = [LaParole.estParole($dataSkills[1186]), LaParole.estParole($dataSkills[158]), LaParole.estParole($dataSkills[1106])];
        out.voies = [LeMouvement.voie(act(kor, 1106, e)), LeMouvement.voie(act(kor, 1211, e)), LeMouvement.voie(act(lud, 158, e)), LeMouvement.voie(act(ael, 1236, ael))];

        // 3 · le triangle
        out.elements = {
            feu: act(ves, 1186, e).getItemElements().sort(), renvoi: act(ael, 1091, e).getItemElements().sort(),
            ecrit: act(lud, 158, e).getItemElements().sort(), attaque: act(kor, 1, e).getItemElements(),
            ennemi: (function () { var a = new Game_Action(e); a.setSkill(1186); return a.getItemElements().sort(); })()
        };
        var taux = e.elementRate;
        e.elementRate = function (id) { return id === 4 ? 2 : 1; };
        kor.setTp(100); kor.setMp(kor.mmp);
        e._ctAnnonces = [];
        var a1 = act(kor, 1106, e); var dCorps = a1.makeDamageValue(e, false);
        e.elementRate = function () { return 1; };
        var dNeutre = act(kor, 1106, e).makeDamageValue(e, false);
        e.elementRate = function (id) { return id === 4 ? 2 : 1; };
        e.recoverAll(); e.clearResult(); act(kor, 1106, e).apply(e);
        out.triangle = { corps: dCorps, neutre: dNeutre, annonce: (e._ctAnnonces || []).map(function (x) { return x.texte; }) };
        var dParole = act(ael, 1216, e).makeDamageValue(e, false);
        e.elementRate = function () { return 1; };
        out.triangle.paroleContre = act(ael, 1216, e).makeDamageValue(e, false) === dParole;
        e.elementRate = taux;

        // 4 · le prix suit l'art
        var DONS = [4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26], DONS_IDS = [71, 810, 438];
        var ennemis = {}; $dataEnemies.forEach(function (x) { if (x) x.actions.forEach(function (y) { ennemis[y.skillId] = 1; }); });
        var vus = {}, faux = [], n = { parole: 0, mouvement: 0, ecrit: 0 };
        [1, 2, 3, 4].forEach(function (c) { $dataClasses[c].learnings.forEach(function (l) { vus[l.skillId] = 1; }); });
        Object.keys(vus).forEach(function (k) {
            var s = $dataSkills[+k]; if (!s || s.id <= 2 || DONS.indexOf(s.stypeId) >= 0 || DONS_IDS.indexOf(s.id) >= 0 || ennemis[s.id]) return;
            var ar = A.art(s); if (!ar) return;
            var pv = /<HP Cost:\s*\d+%>/i.test(s.note), ult = s.stypeId === 3;
            var bon = ar === 'parole' ? (s.tpCost === 0 && (!pv || ult)) :
                      ar === 'mouvement' ? (s.mpCost === 0 && (!pv || ult)) : (s.mpCost === 0 && s.tpCost === 0);
            n[ar]++;
            if (!bon) faux.push(s.id + ' ' + s.name + ' (' + ar + ')');
        });
        // toute capacité a un art, sauf ce qui n'en est aucun (Fuir, revelation, VUE) et les pièces des dons
        var SANS_ART = [6, 461, 480, 438, 818, 14, 111, 69];
        var orphelines = Object.keys(vus).map(Number).filter(function (id) {
            var s = $dataSkills[id];
            return s && s.id > 2 && s.id !== 1309 && DONS.indexOf(s.stypeId) < 0 && !A.art(s) && SANS_ART.indexOf(id) < 0;
        }).map(function (id) { return id + ' ' + $dataSkills[id].name; });
        out.prix = { n: n, faux: faux, orphelines: orphelines,
                     dons: [$dataSkills[1159].mpCost, $dataSkills[1138].mpCost + '/' + (/<HP Cost: 5%>/.test($dataSkills[1138].note)), $dataSkills[466].mpCost + '/' + /HP Cost/.test($dataSkills[466].note)],
                     exemples: [$dataSkills[1106].mpCost + '/' + $dataSkills[1106].tpCost, $dataSkills[453].mpCost + '/' + /HP Cost: 30%/.test($dataSkills[453].note),
                                $dataSkills[172].mpCost + '/' + $dataSkills[172].tpCost] };

        // 5 · la barre de PT
        out.pt = { gain: $dataSkills[1].tpGain, garde: [44, 45, 46].map(function (i) { return $dataArmors[i].traits.some(function (t) { return t.code === 62 && t.dataId === 3; }); }),
                   tcr: ves.tcr, preserve: $gameParty.members().map(function (a) { return a.isPreserveTp(); }) };
        ves.setTp(0); ves.clearResult(); var at = act(ves, 1, e); e.clearResult(); at.apply(e);
        out.pt.apres = ves.tp; out.pt.attendu = Math.floor(20 * ves.tcr);
        // plus de recul en PV : un mouvement négatif de Korrah ne lui coûte rien en chair
        kor.recoverAll(); var pvK = kor.hp; e.clearResult(); act(kor, 1122, e).apply(e);
        out.pt.recul = pvK - kor.hp;

        // 6 · l'aide
        var w = new Window_BattleSkill(0, 0, 400, 200), h = new Window_Help(2);
        w.setHelpWindow(h); w.setActor(ves); w._data = [$dataSkills[1186], $dataSkills[1106], $dataSkills[158]];
        out.aide = [0, 1, 2].map(function (i) { w.select(i); w.updateHelp(); return h._text.split('】')[0] + '】'; });
        return out;
    });

    console.log('1) Les réglages');
    v('LesTroisArts et LEcrit actifs ; LeSpirituel, FusionMana, ElementsVivants éteints',
      r.reglages.arts && r.reglages.ecrit && !r.reglages.spirituel && !r.reglages.fusion && !r.reglages.vivants, JSON.stringify(r.reglages));
    v('le négatif ne coûte plus de PV (ManaAffinity : recul 0 / 0)', r.reglages.recul === '0/0');

    console.log('\n2) L\'art de chaque compétence');
    v('Paroles : une échelle, « Parole n°3 », « Parole n°8 Feu », l\'Hiver de Korrah, une réanimation', r.paroles.every(function (x) { return x === 'parole'; }), r.paroles.join(', '));
    v('mouvements : une Voie, l\'Attaque, le sang (élément 4), « Parole n°4 », BERSEK, un soin de la Source', r.mouvements.every(function (x) { return x === 'mouvement'; }), r.mouvements.join(', '));
    v('écrits : « Parole n°2 », « Parole n°7 », le type âme, l\'élément 2, une rune', r.ecrits.every(function (x) { return x === 'ecrit'; }), r.ecrits.join(', '));
    v('aucun art : la Garde, Fuir, un ordre à seiryu, un Style, le Contrat, la Roulette du Destin', r.aucun.every(function (x) { return x === ''; }), r.aucun.join(', '));
    v('<Art:> sur la fiche décide : Tracer le Cercle est un écrit, Accélérer une Parole, Garde Haute un mouvement',
      r.tags.join() === 'ecrit,parole,mouvement', r.tags.join(', '));
    v('LaParole suit la même règle (une Parole oui ; un écrit et un mouvement non)', r.laParole[0] && !r.laParole[1] && !r.laParole[2]);
    v('LeMouvement aussi : seul le mouvement prend une posture', !!r.voies[0] && !r.voies[1] && !r.voies[2] && !r.voies[3], JSON.stringify(r.voies));

    console.log('\n3) Le triangle');
    var el = r.elements;
    v('une Parole de Feu : Feu ET positif', el.feu.join() === '3,8', el.feu.join());
    v('Renvoi Net d\'Aël (fiche en positif) : c\'est un mouvement, il frappe en négatif', el.renvoi.join() === '4', el.renvoi.join());
    v('un écrit frappe en spirituel ; l\'Attaque porte le négatif', el.ecrit.join() === '2' && el.attaque.indexOf(4) >= 0, el.ecrit.join() + ' / ' + el.attaque.join());
    v('contre-épreuve : la même Parole lancée par un ennemi garde ses éléments', el.ennemi.join() === '8', el.ennemi.join());
    v('un ennemi de l\'Âme (faible au négatif ×2) prend ×2 d\'un mouvement', r.triangle.corps === r.triangle.neutre * 2 || Math.abs(r.triangle.corps / r.triangle.neutre - 2) < 0.01, r.triangle.neutre + ' → ' + r.triangle.corps);
    v('et ça s\'annonce au-dessus de lui : ▲ Corps ×2', r.triangle.annonce.some(function (t) { return /▲ Corps ×2/.test(t); }), r.triangle.annonce.join(' | '));
    v('contre-épreuve : une Parole (positif) ne prend pas la faiblesse au négatif', r.triangle.paroleContre);

    console.log('\n4) Le prix suit l\'art (capacités des quatre classes)');
    v('chaque Parole en PM, chaque mouvement en PT, chaque écrit en PV', r.prix.faux.length === 0,
      JSON.stringify(r.prix.n) + (r.prix.faux.length ? ' — à revoir : ' + r.prix.faux.slice(0, 6).join(' · ') : ''));
    v('toute capacité a son art (sauf Fuir, revelation, VUE et les pièces des dons)', r.prix.orphelines.length === 0, r.prix.orphelines.slice(0, 8).join(' · '));
    v('exemples : Pas de Côté 0 PM / 12 PT ; Dévoreur d\'Âmes 0 PM, 30 % PV ; Pluie d\'Étoiles 53 PM / 0 PT',
      r.prix.exemples.join(' | ') === '0/12 | 0/true | 53/0', r.prix.exemples.join(' | '));
    // le 2026-10-25 (le rework, V1), le sang de Vesper se paie en sang : Première Entaille passe de 12 PM à 5 % de PV
    v('contre-épreuve : la règle des arts ne touche pas les dons (Froid Partagé 54 PM, Aspiration d\'Âme en PV ; Première Entaille en PV depuis V1)',
      r.prix.dons.join(' | ') === '54 | 0/true | 0/true', r.prix.dons.join(' | '));

    console.log('\n5) La barre de PT');
    v('l\'Attaque rend 20 PT (avant : 100)', r.pt.gain === 20);
    v('les Reliques 44-46 ne gardent plus les PT, aucun héros ne les garde', r.pt.garde.every(function (x) { return !x; }) && r.pt.preserve.every(function (x) { return !x; }), JSON.stringify(r.pt.preserve));
    v('une Attaque de Vesper : 20 × son TCR', r.pt.apres === r.pt.attendu, r.pt.apres + ' PT (TCR ' + r.pt.tcr.toFixed(2) + ')');
    v('un mouvement négatif ne brûle plus la chair (0 PV de recul)', r.pt.recul === 0, String(r.pt.recul));

    console.log('\n6) À l\'écran');
    v('l\'aide dit l\'art : 【PAROLE · …】, 【MOUVEMENT · …】, 【ÉCRIT】', /^【PAROLE/.test(r.aide[0]) && /^【MOUVEMENT/.test(r.aide[1]) && r.aide[2] === '【ÉCRIT】', r.aide.join(' '));

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
