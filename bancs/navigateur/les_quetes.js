/*
 * BANC NAVIGATEUR — LES QUÊTES, JOUÉES POUR DE VRAI
 * ---------------------------------------------------------------------------
 * JOKO, 2026-09-26 : « ce qui me manque particulièrement, c'est les événements
 * de quête ». Ce banc ouvre le jeu, arrive dans la Caverne, traverse jusqu'à
 * la ville, parle aux PNJ, tue ce qu'il faut, revient chercher la paie — et
 * regarde le journal YEP, la sauvegarde, et les contre-épreuves.
 *
 *   npx http-server -p 8899 -c-1 .          (à la racine, dans un autre terminal)
 *   node bancs/navigateur/les_quetes.js
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
    var ev = function (fn, arg) { return page.evaluate(fn, arg); };
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen(); }, null, { timeout: 180000 });
    await ev(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1200);
    await ev(function () {
        [1, 2, 3, 4].forEach(function (id) { if (!$gameParty.members().some(function (m) { return m.actorId() === id; })) { $gameParty.addActor(id); } });
        // Parler à un événement sans clavier : on déroule son interprète à la main, en répondant
        // aux choix par leur index. Les 356 (QUEST …) passent par le vrai pluginCommand.
        window.parler = function (nom, choix) {
            var e = $gameMap.events().filter(function (x) { return x.event().name === nom; })[0];
            if (!e) { return { absent: true }; }
            var it = new Game_Interpreter(); it.setup(e.list(), e.eventId());
            var textes = [], n = 0;
            while (it.isRunning() && n++ < 2000) {
                it.update();
                if ($gameMessage.isBusy()) {
                    if ($gameMessage.hasText()) { textes.push($gameMessage.allText()); }
                    if ($gameMessage.isChoice()) { $gameMessage.onChoice(choix || 0); }
                    $gameMessage.clear();
                }
            }
            $gameMap.refresh();
            return { textes: textes, tours: n };
        };
        window.aller = function (carte) { $gamePlayer.reserveTransfer(carte, 1, 1, 2, 0); };
        window.tuer = function (idEnnemi, fois) { for (var i = 0; i < fois; i++) { var g = new Game_Enemy(idEnnemi, 0, 0); g.setHp(0); g.refresh(); if (g.isAlive()) { g.die(); } } };
    });
    async function aller(carte) {
        await ev(function (c) { $gamePlayer.reserveTransfer(c, 1, 1, 2, 0); }, carte);
        await page.waitForFunction(function (c) { return $gameMap.mapId() === c && !$gamePlayer.isTransferring() && !SceneManager.isSceneChanging(); }, carte, { timeout: 30000 });
        // laisser courir l'autorun d'arrivée
        for (var i = 0; i < 90; i++) {
            var occupe = await ev(function () { if ($gameMessage.isBusy()) { $gameMessage.clear(); } return $gameMap.isEventRunning(); });
            if (!occupe) { break; }
            await page.waitForTimeout(33);
        }
        await page.waitForTimeout(150);
    }

    console.log('\n══ LES QUÊTES PRINCIPALES, SANS PNJ ' + '═'.repeat(40));
    await aller(28);
    var s1 = await ev(function () { return { statut: $gameSystem.questStatus('sortie'), suivie: $gameSystem._queteSuivie, yep: $gameSystem.getQuestsAvailable().length, data: $dataQuests.filter(Boolean).map(function (q) { return q.name; }) }; });
    ok('entrer dans la Caverne ouvre « Sortir de la pierre »', s1.statut === 'active', 'suivie : ' + s1.suivie);
    ok('la quête est dans le journal YEP', s1.yep === 1 && s1.data.some(function (n) { return /Sortir de la pierre/.test(n); }), s1.data.join(' · '));
    await aller(32); await aller(31);
    var s2 = await ev(function () { var q = $gameSystem.quete('sortie'); return { faits: q.objs.map(function (o) { return o.done; }), statut: q.status }; });
    ok('le Marécage et la Forêt cochent leurs objectifs', s2.faits[0] && s2.faits[1] && !s2.faits[2], JSON.stringify(s2.faits));
    await aller(29);
    var s3 = await ev(function () { return { sortie: $gameSystem.questStatus('sortie'), noms: $gameSystem.questStatus('noms'), feu: $gameSystem.questStatus('feu'), marche: $gameSystem.questStatus('marche'), finies: $gameSystem.getQuestsCompleted().length, annonces: Quetes.annonces().length }; });
    ok('arriver en ville accomplit la quête d\'elle-même (auto)', s3.sortie === 'done' && s3.finies === 1);
    ok('et ouvre les Sept Noms, le Feu d\'Âme et le Marché', s3.noms === 'active' && s3.feu === 'active' && s3.marche === 'active');
    ok('contre-épreuve : revenir en ville ne rouvre rien', (await (async function () { await aller(30); await aller(29); return ev(function () { return $gameSystem.questList().length; }); })()) === 4);
    var feu = await ev(function () { var avant = $gameSystem.questObjDone('feu', 1); var it = new Game_Interpreter(); it.setup([{ code: 356, indent: 0, parameters: ['FEU repos'] }, { code: 0, indent: 0, parameters: [] }]); var n = 0; while (it.isRunning() && n++ < 200) { it.update(); if ($gameMessage.isBusy()) { $gameMessage.clear(); } } return { avant: avant, apres: $gameSystem.questObjDone('feu', 1), statut: $gameSystem.questStatus('feu') }; });
    ok('se reposer au Feu d\'Âme (commande FEU) accomplit l\'apprentissage', !feu.avant && feu.apres && feu.statut === 'done');

    console.log('\n══ UN CONTRAT DE CHASSE : LE GARDE ' + '═'.repeat(41));
    var g1 = await ev(function () { var r = parler('✎ Garde de la ville', 0); return { textes: r.textes.length, statut: $gameSystem.questStatus('bandits'), compteurs: Quetes.compteurs().filter(function (c) { return c.quete === 'bandits'; }).length, variable: Quetes.compteurs().filter(function (c) { return c.quete === 'bandits'; }).map(function (c) { return c.variable; })[0] }; });
    ok('le garde parle et donne « Les bandits de la Forêt Perdue »', g1.textes >= 2 && g1.statut === 'active', g1.textes + ' boîtes');
    ok('un compteur de chasse est posé, sur une variable ≥ 300', g1.compteurs === 1 && g1.variable >= 300, 'variable ' + g1.variable);
    var g2 = await ev(function () { tuer(4, 2); var orc = $gameSystem.questCompte('bandits', 1); tuer(2, 3); var trois = $gameSystem.questCompte('bandits', 1); var obj = $dataQuests[$gameSystem.quete('bandits').numero].objectives[1]; return { orc: orc, trois: trois, texte: obj }; });
    ok('contre-épreuve : deux Minotaures tués ne comptent pas', g2.orc === 0);
    ok('trois bandits tués comptent trois', g2.trois === 3, 'journal : « ' + g2.texte + ' »');
    var g3 = await ev(function () { var avant = $gameParty.gold(); var r = parler('✎ Garde de la ville', 0); return { statut: $gameSystem.questStatus('bandits'), or: $gameParty.gold() - avant, fait: $gameSystem.questObjDone('bandits', 1) }; });
    ok('à trois sur cinq, le garde fait patienter et ne paie pas', g3.statut === 'active' && g3.or === 0 && !g3.fait);
    var g4 = await ev(function () { tuer(2, 2); var avant = $gameParty.gold(), pot = $gameParty.numItems($dataItems[11]); var r = parler('✎ Garde de la ville', 0); return { statut: $gameSystem.questStatus('bandits'), or: $gameParty.gold() - avant, potions: $gameParty.numItems($dataItems[11]) - pot, yep: $gameSystem.getQuestsCompleted().length, textes: r.textes }; });
    ok('à cinq, le garde paie 300 or et 2 Potions Supérieures, la quête est accomplie', g4.statut === 'done' && g4.or === 300 && g4.potions === 2, g4.textes.slice(-1)[0]);
    ok('le journal YEP la range dans les accomplies', g4.yep === 3);
    var g5 = await ev(function () { var r = parler('✎ Garde de la ville', 0); return r.textes[0] || ''; });
    ok('après, le garde a une dernière réplique', /Forêt Perdue/.test(g5), g5.slice(0, 50));

    console.log('\n══ LES QUÊTES DE JOKO, REMISES : TOBIN, COLIN, SARIELLE ' + '═'.repeat(20));
    await aller(46);
    var t1 = await ev(function () { erreurs = []; var r1 = parler('Tobin le pêcheur', 0); var st = $gameSystem.questStatus('couteau'); var r2 = parler('Coffre oublié', 0); var couteau = $gameParty.numItems($dataItems[69]); var r4 = parler('Tobin le pêcheur', 0); return { st: st, couteau: couteau, fin: $gameSystem.questStatus('couteau'), plusDeCouteau: $gameParty.numItems($dataItems[69]), t4: r4.textes.join(' ') }; });
    ok('Tobin donne « Le couteau de Tobin » — sa commande QUEST vit à nouveau', t1.st === 'active');
    ok('le coffre oublié rend le couteau', t1.couteau === 1);
    ok('le rapporter accomplit la quête et le rend à Tobin', t1.fin === 'done' && t1.plusDeCouteau === 0, t1.t4.slice(0, 60));
    var c1 = await ev(function () { var r1 = parler('barde', 0); var r2 = parler('barde', 1); return { textes: r2.textes.join(' '), erreurs: 0 }; });
    ok('Colin le barde ne plante plus sur questStatus (sans quête : une chanson)', /chanson|Colin/.test(c1.textes), c1.textes.slice(0, 60));
    ok('aucune erreur JavaScript jusqu\'ici', erreurs.length === 0, erreurs.slice(0, 2).join(' | '));
    await aller(36);
    var s4 = await ev(function () { var r = parler('Vieille Sarielle', 0); return { st: $gameSystem.questStatus('rumeurs'), objs: $gameSystem.quete('rumeurs') ? $gameSystem.quete('rumeurs').objs.length : 0 }; });
    ok('Sarielle donne « Les trois rumeurs » avec ses trois objectifs', s4.st === 'active' && s4.objs === 3, s4.objs + ' objectifs');
    var m1 = await ev(function () { var v = $gameVariables.value(45); var r = parler('EV029', 0); return { avant: v, apres: $gameVariables.value(45), fait: $gameSystem.questObjDone('rumeurs', 1) }; });
    ok('Marn le fossoyeur livre sa rumeur (variable 45 +1, objectif coché)', m1.apres === m1.avant + 1 && m1.fait);

    console.log('\n══ LES QUÊTES DE PERSONNAGE ET LA SAUVEGARDE ' + '═'.repeat(31));
    await aller(29);
    var k1 = await ev(function () { parler('✎ Maître d\'armes', 0); var st = $gameSystem.questStatus('vesper'); Quetes.compteurs().filter(function (c) { return c.quete === 'vesper'; }).forEach(function (c) { $gameVariables.setValue(c.variable, 4); }); return { st: st }; });
    ok('le maître d\'armes ouvre la quête de Vesper (cinq changements de Style)', k1.st === 'active');
    var k2 = await ev(function () { parler('✎ Maître d\'armes', 0); return { vesper: $gameSystem.questStatus('vesper'), korrah: $gameSystem.questStatus('korrah') }; });
    ok('à quatre sur cinq, il attend encore', k2.vesper === 'active' && k2.korrah === 'none');
    var k3 = await ev(function () {
        // le cinquième changement, comme le joueur le ferait : par la fenêtre de compétences du combat
        var sc = { _skillWindow: { item: function () { return $dataSkills[1266]; } } };
        var faux = Object.create(Scene_Battle.prototype); faux._skillWindow = sc._skillWindow;
        var _ok = Object.getPrototypeOf(Scene_Battle.prototype).onSkillOk;
        try { Scene_Battle.prototype.onSkillOk.call({ _skillWindow: sc._skillWindow, _actorCommandWindow: { activate: function () { } }, _statusWindow: { refresh: function () { } } }); } catch (e) { }
        var fiole = $gameParty.numItems($dataItems[70]); parler('✎ Maître d\'armes', 0);
        return { vesper: $gameSystem.questStatus('vesper'), korrah: $gameSystem.questStatus('korrah'), fioles: $gameParty.numItems($dataItems[70]) - fiole };
    });
    ok('le cinquième Style choisi accomplit la quête ; il paie et passe à Korrah', k3.vesper === 'done' && k3.korrah === 'active' && k3.fioles === 2);
    var k4 = await ev(function () { var a = $gameActors.actor(2); a.useItem($dataSkills[1263]); a.useItem($dataSkills[1264]); var deux = $gameSystem.questCompte('korrah', 1); a.useItem($dataSkills[1263]); parler('✎ Maître d\'armes', 0); return { deux: deux, korrah: $gameSystem.questStatus('korrah'), ludwing: $gameSystem.questStatus('ludwing') }; });
    ok('trois ordres à l\'Avatar : la quête de Korrah tombe, celle de ludwing s\'ouvre', k4.deux === 2 && k4.korrah === 'done' && k4.ludwing === 'active');
    var sv = await ev(function () {
        var contenu = JsonEx.stringify(DataManager.makeSaveContents());
        var nombre = $dataQuests.filter(Boolean).length;
        DataManager.questDatabaseCreate();                          // comme au lancement du jeu : la base repart vide
        var vide = $dataQuests.filter(Boolean).length;
        DataManager.extractSaveContents(JsonEx.parse(contenu));     // la partie chargée
        return { avant: nombre, vide: vide, apres: $dataQuests.filter(Boolean).length, statut: $gameSystem.questStatus('bandits'), finies: $gameSystem.getQuestsCompleted().length, texte: $dataQuests[$gameSystem.quete('bandits').numero].objectives[1] };
    });
    ok('charger une partie reconstruit le journal YEP (la base repart vide au lancement)', sv.vide === 0 && sv.apres === sv.avant && sv.statut === 'done', sv.vide + ' → ' + sv.apres + ' quêtes · « ' + sv.texte + ' »');
    ok('et les accomplies restent accomplies', sv.finies >= 3, sv.finies + ' accomplies');

    console.log('\n══ LE JOURNAL, OUVERT ' + '═'.repeat(54));
    await ev(function () { SceneManager.push(Scene_Quest); });
    await page.waitForFunction(function () { return SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Quest' && !SceneManager.isSceneChanging(); }, null, { timeout: 30000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: require('path').join(__dirname, 'captures', 'quetes_journal.png') }).catch(function () { });
    var j = await ev(function () { var s = SceneManager._scene; var cat = s._categoryWindow; return { cats: cat ? cat._list.map(function (c) { return c.name; }) : [], scene: s.constructor.name }; });
    ok('le journal s\'ouvre, en français', j.scene === 'Scene_Quest' && j.cats.some(function (c) { return /En cours/.test(c); }) && !j.cats.some(function (c) { return /Available/.test(c); }), j.cats.map(function (c) { return c.replace(/\\i\[\d+\]/g, ''); }).join(' · '));
    ok('rien n\'a planté pendant la passe', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));

    console.log('\n' + '═'.repeat(74) + '\n   ' + vert + ' vert · ' + rouge + ' rouge\n' + '═'.repeat(74));
    await nav.close();
    process.exit(rouge ? 1 : 0);
})();
