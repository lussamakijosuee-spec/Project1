/*
 * BANC NAVIGATEUR — VESPER : LES TROIS STYLES ET SA COLÈRE
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-14 : « Lame c'est parfait, 2A + 2C, 3A + 3B pour l'ulti et
 * 3C pour les techniques, garde c'est parfait 4B » — « je parie extrêmement
 * fort sur le gameplay ».
 *
 * Chaque règle de LesStylesDeVesper.js, jouée dans le vrai moteur, avec sa
 * contre-épreuve (§6) :
 *
 *   · LE KIT     chaque Style ne voit que ses compétences ; les branches vides
 *                disparaissent ; les arts suivent l'arme tenue ;
 *   · LAME       État de Flow sous 20 % seulement, 2 actions par tour pendant
 *                3 tours pleins, une contre-attaque par esquive, l'Épuisement ;
 *   · SANG       Berserker en Rage seulement : la Colère boit les coups, 1 PV
 *                minimum, chaque coup soigne, BERSEK ×2, le contrecoup ;
 *                Convergence → Sang Perçant ×2 sans défense, Supernova +2 ;
 *   · GARDE      −15 % par coup du même type jusqu'à −75 %, la Garde boit PM
 *                et PT de plus en plus, l'armure cède, l'Arme de Sang ;
 *   · COLÈRE     +10 par coup (×0,5 / ×1,5 / ×1), la Vanne de ludwing (LesInteractions), la Rage
 *                (×1,5, et ludwing prend 60 % de ses coups à cible unique) ;
 *   · UN VRAI COMBAT, laissé tourner, sans erreur.
 *
 *   npx http-server -p 8899 -c-1 -s .        (dans un autre terminal, à la racine)
 *   node bancs/navigateur/vesper_les_styles.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var vert = 0, rouge = 0;
function ok(nom, cond, detail) {
    if (cond) { vert++; console.log('   ✓ ' + nom + (detail !== undefined && detail !== '' ? '   ' + detail : '')); }
    else { rouge++; console.log('   ✗ ' + nom + (detail !== undefined && detail !== '' ? '   ' + detail : '')); }
}

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.split('\n')[0]); });
    page.on('console', function (m) { if (m.type() === 'error' && !/Failed to load|net::ERR/.test(m.text())) { erreurs.push('CONSOLE ' + m.text().slice(0, 160)); } });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen(); }, null, { timeout: 180000 });
    await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);

    async function ouvrirCombat() {
        await page.evaluate(function () {
            [1, 2, 3, 4].forEach(function (id) { if (!$gameParty.members().some(function (m) { return m.actorId() === id; })) { $gameParty.addActor(id); } });
            $gameParty.members().forEach(function (a) { a.recoverAll(); });
            BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(2500);
    }
    await ouvrirCombat();

    // Le moteur figé : on mène les coups et les tours à la main.
    await page.evaluate(function () {
        var SC = SceneManager._scene;
        window.__vraieMaj = SC.update;
        SC.update = function () { };
        window.__orig = { variance: Game_Action.prototype.applyVariance, hit: Game_Action.prototype.itemHit, eva: Game_Action.prototype.itemEva, cri: Game_Action.prototype.itemCri };
        Game_Action.prototype.applyVariance = function (d) { return d; };      // le dé, figé pour mesurer
        Game_Action.prototype.itemHit = function () { return 1; };
        Game_Action.prototype.itemEva = function () { return 0; };
        Game_Action.prototype.itemCri = function () { return 0; };
        $gameTroop.members().forEach(function (x) { x._paramPlus[0] += 9999999; x.setHp(x.mhp); });
        var a = $gameActors.actor(1);
        window.V = a; window.L = $gameActors.actor(3); window.E = $gameTroop.members()[0];
        // un tour qui passe, comme MV : compté au début, refermé à la fin
        window.__tour = function () { $gameTroop.increaseTurn(); BattleManager._enteredEndPhase = false; BattleManager.endTurn(); };
        // jouer une action comme le moteur : sujet et action désignés pendant le coup
        window.__jouer = function (act, cible) {
            var s = act.subject();
            BattleManager._subject = s; BattleManager._action = act;
            cible.clearResult(); act.apply(cible);
            BattleManager._subject = null; BattleManager._action = null;
        };
        window.__frappe = function (id, cible) { var act = new Game_Action(V); act.setSkill(id); V.useItem(act.item()); __jouer(act, cible || E); return act; };
        window.__degats = function (id, cible, sujet) { var act = new Game_Action(sujet || V); if (id === 1) { act.setAttack(); } else { act.setSkill(id); } return act.makeDamageValue(cible || E, false); };
        // un coup ennemi de n PV exactement sur Vesper (élément de la compétence, ou l'attaque)
        window.__coup = function (n, skillId) {
            var act = new Game_Action(E); if (skillId) { act.setSkill(skillId); } else { act.setAttack(); }
            V.clearResult(); act.executeDamage(V, n); return act;
        };
        window.__style = function (s) { PacteDeSang.changerStyle(s); };
        window.__vider = function () {
            [1001, 1002, 1003, 1004, 12, 87, 134].forEach(function (id) { V.clearResult(); V.eraseState(id); });
            V._colere = 0; V._adapt = {}; V._gardeTours = 0; V._sangEncaisse = 0; V._tourVu = null; V._flowEsquive = null;
            PacteDeSang.poser(0); V.setHp(V.mhp); V.setMp(V.mmp); V.setTp(100); V.clearResult();
            $gameTemp._forceActionQueue = undefined;
            var w = SceneManager._scene._logWindow; if (w) { w._methods = []; w.clear(); }
        };
        window.__armeDe = function (types) {
            return $dataWeapons.filter(function (w) { return w && w.name && types.indexOf(w.wtypeId) >= 0; })[0] || null;
        };
        __vider();
    });

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n══ LE KIT DE CHAQUE STYLE ' + '═'.repeat(48));
    var kit = await page.evaluate(function () {
        var out = {}, a = V, sc = SceneManager._scene;
        var epee = __armeDe([2]), dague = __armeDe([1]), gant = __armeDe([11]), canne = __armeDe([6]), griffe = __armeDe([10]), fouet = __armeDe([5]), ecarlate = __armeDe([15]);
        out.armes = [epee, dague, gant, canne, griffe, fouet, ecarlate].map(function (w) { return w ? w.name : '—'; });
        function arts() { return StylesVesper.kit().filter(function (i) { return $dataSkills[i].stypeId === 24; }); }
        function familles() {
            var f = {}; arts().forEach(function (i) { f[String($dataSkills[i].meta.ArtArme).trim()] = true; }); return Object.keys(f).sort().join(',');
        }
        function branches() {
            sc._actorCommandWindow.setup(a);
            return sc._actorCommandWindow._list.filter(function (c) { return c.symbol === 'skill'; }).map(function (c) { return c.ext; });
        }
        a.forceChangeEquip(0, epee);
        __style('lame');
        var kl = StylesVesper.kit();
        out.lame = { n: kl.length, sang: kl.filter(function (i) { return /<Style:\s*(sang|garde)>/.test($dataSkills[i].note); }).length,
                     familles: familles(), branches: branches(), peutSang: a.canUse($dataSkills[1139]), peutArt: a.canUse($dataSkills[1281]) };
        // le menu de compétences de combat le cache aussi
        sc._skillWindow.setActor(a); sc._skillWindow.setStypeId(1); sc._skillWindow.refresh();
        out.lameListe = sc._skillWindow._data.filter(Boolean).map(function (s) { return s.id; });
        __style('saignee');
        var ks = StylesVesper.kit();
        out.sang = { n: ks.length, lame: ks.filter(function (i) { return /<Style:\s*(lame|garde)>/.test($dataSkills[i].note); }).length,
                     branches: branches(), peutSang: a.canUse($dataSkills[1139]), peutArt: a.canUse($dataSkills[1281]),
                     paroles: ks.filter(function (i) { return /^Parole/.test($dataSkills[i].name); }).map(function (i) { return $dataSkills[i].name; }) };
        __style('garde');
        var kg = StylesVesper.kit();
        out.garde = { n: kg.length, branches: branches(), paroles: kg.filter(function (i) { return /^Parole/.test($dataSkills[i].name); }).length };
        __style('lame');
        out.epee = familles();
        a.forceChangeEquip(0, dague); out.dague = familles();
        a.forceChangeEquip(0, gant); out.gant = familles();
        a.forceChangeEquip(0, canne); out.canne = familles();
        a.forceChangeEquip(0, griffe); out.griffe = familles();
        a.forceChangeEquip(0, fouet); out.fouet = familles();
        a.forceChangeEquip(0, ecarlate); out.ecarlate = familles();
        a.forceChangeEquip(0, null); out.mainsNues = familles();
        a.forceChangeEquip(0, epee);
        return out;
    });
    ok('Lame : ses compétences, sans rien de Sang ni de Garde', kit.lame.n > 0 && kit.lame.sang === 0, kit.lame.n + ' compétences');
    ok('Lame : la branche « sang » disparaît, « arts » est là', kit.lame.branches.indexOf(10) < 0 && kit.lame.branches.indexOf(24) >= 0,
        'branches ' + kit.lame.branches.join(','));
    ok('Lame : une technique de Sang ne se lance pas (le moteur aussi la refuse)', !kit.lame.peutSang && kit.lame.peutArt);
    ok('Lame : le menu de combat ne montre que son kit', kit.lameListe.every(function (i) { return [1139, 1066, 9].indexOf(i) < 0; }),
        kit.lameListe.length + ' en « capacité »');
    ok('Sang : son kit, sans Lame ni Garde', kit.sang.n > 0 && kit.sang.lame === 0, kit.sang.n + ' compétences');
    ok('Sang : aucune Parole (« elle n\'en possède pas »)', kit.sang.paroles.length === 0, kit.sang.paroles.join(' · ') || 'aucune');
    ok('Sang : « arts » disparaît, « sang » est là (contre-épreuve)', kit.sang.branches.indexOf(24) < 0 && kit.sang.branches.indexOf(10) >= 0
        && kit.sang.peutSang && !kit.sang.peutArt, 'branches ' + kit.sang.branches.join(','));
    ok('Garde : elle garde ses Paroles', kit.garde.paroles > 0 && kit.garde.branches.indexOf(24) < 0, kit.garde.paroles + ' Paroles');
    console.log('     (armes : ' + kit.armes.join(' · ') + ')');
    ok('Épée en main : les arts de l\'épée', kit.epee === 'epee', kit.epee);
    ok('Dague en main : ceux de la dague, et plus ceux de l\'épée (contre-épreuve)', kit.dague === 'dague', kit.dague);
    ok('Gant : les poings', kit.gant === 'poings', kit.gant);
    ok('Canne : la lance (bâton d\'hast)', kit.canne === 'lance', kit.canne);
    ok('Griffe : les poings', kit.griffe === 'poings', kit.griffe);
    ok('Mains nues : les poings', kit.mainsNues === 'poings', kit.mainsNues);
    ok('Lame Écarlate (type SANG, ses armes à elle) : l\'épée', kit.ecarlate === 'epee', kit.ecarlate);
    ok('Fouet : aucun art (famille non couverte — contre-épreuve)', kit.fouet === '', kit.fouet || 'aucun');

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n══ LAME — ☯ ÉTAT DE FLOW (2A + 2C) ' + '═'.repeat(39));
    var fl = await page.evaluate(function () {
        var out = {}, a = V, FLOW = 126;
        __vider(); __style('lame');
        a.setHp(Math.floor(a.mhp * 0.5));
        out.cache50 = !StylesVesper.dansLeKit(FLOW) && !a.canUse($dataSkills[FLOW]);
        a.setHp(Math.floor(a.mhp * 0.2));
        out.voit20 = StylesVesper.dansLeKit(FLOW) && a.canUse($dataSkills[FLOW]);
        __style('saignee'); out.pasEnSang = !StylesVesper.dansLeKit(FLOW); __style('lame');
        __frappe(FLOW, a);
        out.flow = a.isStateAffected(87);
        var t = []; for (var i = 0; i < 40; i++) { t.push(a.makeActionTimes()); }
        out.actions = t.every(function (x) { return x === 2; });
        out.serein = a.addedSkillTypes().indexOf(19) >= 0;
        out.plusDeStyle = !a.canUse($dataSkills[1266]);
        out.plusDeFlow = !StylesVesper.dansLeKit(FLOW);
        // ── 2A : chaque esquive, une contre-attaque
        function file() { var q = $gameTemp._forceActionQueue; return q ? q.list.map(function (c) { return c.parameters.join(':'); }) : []; }
        $gameTemp._forceActionQueue = undefined;
        var esq = new Game_Action(E); esq.setAttack(); esq.itemEva = function () { return 1; };
        __jouer(esq, a);
        out.esquive = { evaded: a.result().evaded, pendant: file().length };
        __jouer(esq, a);                              // même action, deuxième coup esquivé
        E.onAllActionsEnd();                          // l'ennemi a fini : la contre part
        out.esquive.file = file();
        out.uneParAction = file().length;
        $gameTemp._forceActionQueue = undefined;
        // la Zone : un petit coup (< 15 % PV max) est dévié
        a.setHp(Math.floor(a.mhp * 0.2));
        var hp0 = a.hp, petit = new Game_Action(E); petit.setAttack();
        var vrai = Game_Action.prototype.makeDamageValue;
        petit.makeDamageValue = function () { return Math.floor(a.mhp * 0.05); };
        __jouer(petit, a); E.onAllActionsEnd();
        out.devie = { perdu: hp0 - a.hp, file: file() };
        $gameTemp._forceActionQueue = undefined;
        // contre-épreuve : un gros coup qui porte — pas de contre
        var r = Math.random; Math.random = function () { return 0.99; };
        a.setHp(a.mhp);
        var gros = new Game_Action(E); gros.setAttack();
        gros.makeDamageValue = function () { return Math.floor(a.mhp * 0.3); };
        var hp1 = a.hp; __jouer(gros, a); E.onAllActionsEnd();
        Math.random = r;
        out.porte = { perdu: hp1 - a.hp, file: file() };
        $gameTemp._forceActionQueue = undefined;
        // contre-épreuve : sans le Flow, une esquive ne contre pas
        a.clearResult(); a.eraseState(87);
        var esq2 = new Game_Action(E); esq2.setAttack(); esq2.itemEva = function () { return 1; };
        __jouer(esq2, a); E.onAllActionsEnd();
        out.sansFlow = file().length;
        $gameTemp._forceActionQueue = undefined;
        // ── la durée : 3 tours pleins, puis l'Épuisement
        __vider(); __style('lame'); a.setHp(Math.floor(a.mhp * 0.2));
        __frappe(FLOW, a);                            // tour T
        var vu = [];
        for (var k = 0; k < 5; k++) { __tour(); vu.push((a.isStateAffected(87) ? 'F' : '-') + (a.isStateAffected(1002) ? 'É' : '')); }
        out.duree = vu.join(' ');
        // pendant l'Épuisement, pas de Flow, même sous 20 %
        a.setHp(Math.floor(a.mhp * 0.1)); a.clearResult(); a.eraseState(87); a.addState(1002);
        out.epuise = !a.canUse($dataSkills[FLOW]);
        a.clearResult(); a.eraseState(1002);
        out.apresEpuise = a.canUse($dataSkills[FLOW]);
        return out;
    });
    ok('à 50 % de PV, l\'État de Flow n\'apparaît pas (contre-épreuve)', fl.cache50);
    ok('à 20 % de PV, il apparaît et se lance', fl.voit20);
    ok('…mais pas en Sang : c\'est l\'ultime de la Lame', fl.pasEnSang);
    ok('lancé : ☯ État de Flow', fl.flow);
    ok('2C : deux actions par tour', fl.actions);
    ok('les Arts Sereins s\'ouvrent', fl.serein);
    ok('on ne change pas de Style au milieu du Flow', fl.plusDeStyle);
    ok('il ne se relance pas tant qu\'il dure', fl.plusDeFlow);
    ok('2A : une esquive → elle contre (Frappe de l\'Instant Juste)', fl.esquive.file.length === 1 && /^1:1:131:/.test(fl.esquive.file[0]),
        fl.esquive.file.join(' ') || 'rien');
    ok('…une fois l\'ennemi servi : l\'« esquive » reste affichée', fl.esquive.evaded && fl.esquive.pendant === 0);
    ok('…une contre-attaque par action ennemie, pas une par coup', fl.uneParAction === 1, fl.uneParAction + '');
    ok('la Zone dévie un petit coup → contre aussi', fl.devie.perdu === 0 && fl.devie.file.length === 1, '−' + fl.devie.perdu + ' PV · ' + fl.devie.file.length + ' contre');
    ok('un coup qui porte ne déclenche rien (contre-épreuve)', fl.porte.perdu > 0 && fl.porte.file.length === 0, '−' + fl.porte.perdu + ' PV');
    ok('sans le Flow, une esquive ne contre pas (contre-épreuve)', fl.sansFlow === 0);
    ok('3 tours pleins de Flow, puis 2 d\'Épuisement', fl.duree === 'F F F -É -É', 'fin des tours : ' + fl.duree);
    ok('pendant l\'Épuisement, pas de nouveau Flow', fl.epuise && fl.apresEpuise);

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n══ LA COLÈRE ET LA RAGE ' + '═'.repeat(50));
    var co = await page.evaluate(function () {
        var out = { nomV: V.name() }, a = V, VANNE = 1302;
        function coupDans(s) { __vider(); __style(s); __coup(100); return StylesVesper.colere(); }
        out.parCoup = { lame: coupDans('lame'), sang: coupDans('saignee'), garde: coupDans('garde') };
        // un allié qui la frappe ne l'énerve pas (contre-épreuve)
        __vider(); __style('garde');
        var ami = new Game_Action(L); ami.setAttack(); a.clearResult(); ami.executeDamage(a, 100);
        out.parAmi = StylesVesper.colere();
        // la Vanne (LesInteractions, 2026-10-14) : ludwing choisit sa cible ; sur Vesper, +50 × son Style
        __vider(); __style('garde'); L.setMp(L.mmp);
        out.vannePeut = L.canUse($dataSkills[VANNE]);
        var v = new Game_Action(L); v.setSkill(VANNE); v.setTarget($gameParty.members().indexOf(a));
        out.vanneCible = v.makeTargets().map(function (c) { return c.name(); }).join(',');
        __jouer(v, a); L._interactionsEnAttente = [];
        out.vanneGarde = StylesVesper.colere();
        __vider(); __style('lame'); __jouer(v, a); L._interactionsEnAttente = []; out.vanneLame = StylesVesper.colere();
        __vider(); __style('saignee'); __jouer(v, a); L._interactionsEnAttente = []; out.vanneSang = StylesVesper.colere();
        // contre-épreuve : sur Korrah, pas de Colère pour Vesper
        __vider(); var k = $gameActors.actor(2); __jouer(v, k); L._interactionsEnAttente = []; out.vanneKorrah = StylesVesper.colere();
        // à 100 : la Rage
        __vider(); __style('lame');
        var d0 = __degats(1, E);
        a._colere = 95; __style('garde'); __coup(100);
        out.rage = a.isStateAffected(1001);
        out.colereRage = StylesVesper.colere();
        __style('lame');
        out.ratioRage = __degats(1, E) / d0;
        // en Rage, ses coups à cible unique : ludwing 60 % du temps
        function part(skillId) {
            var lud = 0, N = 1000;
            for (var i = 0; i < N; i++) {
                var act = new Game_Action(a); if (skillId) { act.setSkill(skillId); } else { act.setAttack(); }
                act.setTarget(0);
                var t = act.makeTargets();
                if (t.some(function (x) { return x === L; })) { lud++; }
            }
            var w = SceneManager._scene._logWindow; if (w) { w._methods = []; }
            return lud / N;
        }
        out.partRage = part(0);
        out.partToutLeMonde = part(1287);                // Fauche : tous les ennemis — jamais ludwing
        // la Rage finie, la Colère retombe
        a.clearResult(); a.removeState(1001);
        out.apres = StylesVesper.colere();
        out.partCalme = part(0);
        return out;
    });
    ok('coup reçu en Lame : +5 (« moins apte à la colère »)', co.parCoup.lame === 5, '+' + co.parCoup.lame);
    ok('coup reçu en Sang : +15', co.parCoup.sang === 15, '+' + co.parCoup.sang);
    ok('coup reçu en Garde : +10', co.parCoup.garde === 10, '+' + co.parCoup.garde);
    ok('un coup d\'allié ne l\'énerve pas (contre-épreuve)', co.parAmi === 0, '+' + co.parAmi);
    ok('ludwing peut lancer sa Vanne', co.vannePeut);
    ok('la Vanne vise l\'allié choisi', co.vanneCible === co.nomV, co.vanneCible);
    ok('Vanne : +50 en Garde, +25 en Lame, +75 en Sang', co.vanneGarde === 50 && co.vanneLame === 25 && co.vanneSang === 75,
        co.vanneGarde + ' · ' + co.vanneLame + ' · ' + co.vanneSang);
    ok('à 100 : 💢 la Rage', co.rage && co.colereRage === 100);
    ok('en Rage : ×1,5 de dégâts', Math.abs(co.ratioRage - 1.5) < 0.01, '×' + co.ratioRage.toFixed(2));
    ok('la Vanne sur Korrah n\'énerve pas Vesper (contre-épreuve)', co.vanneKorrah === 0, '+' + co.vanneKorrah);
    ok('en Rage : ludwing prend ~60 % de ses coups à cible unique', Math.abs(co.partRage - 0.6) < 0.05, Math.round(co.partRage * 100) + ' % sur 1000');
    ok('…jamais sur un coup de zone (contre-épreuve)', co.partToutLeMonde === 0, Math.round(co.partToutLeMonde * 100) + ' %');
    ok('la Rage finie, la Colère retombe à 0 et ludwing est tranquille', co.apres === 0 && co.partCalme === 0,
        'Colère ' + co.apres + ' · ludwing ' + Math.round(co.partCalme * 100) + ' %');

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n══ SANG — 🩸 BERSERKER (3A + 3B) ET LA CONVERGENCE (3C) ' + '═'.repeat(17));
    var be = await page.evaluate(function () {
        var out = {}, a = V, B = 26;
        __vider(); __style('saignee');
        out.sansRage = !StylesVesper.dansLeKit(B);
        StylesVesper.poserColere(100);
        __style('lame'); out.rageLame = !StylesVesper.dansLeKit(B); __style('saignee');
        out.rageSang = StylesVesper.dansLeKit(B) && a.canUse($dataSkills[B]);
        __frappe(B, a);
        out.berserk = a.isStateAffected(12) && !a.isStateAffected(1001);
        out.colere = StylesVesper.colere();
        out.bersek = a.addedSkillTypes().indexOf(5) >= 0 && [56, 57, 58, 59].filter(function (i) { return a.canUse($dataSkills[i]); }).length;
        out.pasDeStyle = !a.canUse($dataSkills[1265]);
        var r57 = new Game_Action(a); r57.setSkill(57); out.rep = r57.numRepeats();
        out.pasDeRage = (StylesVesper.poserColere(100), !a.isStateAffected(1001));
        a._colere = 100;
        // 3B : la Colère boit le coup
        a.setHp(a.mhp); var hp0 = a.hp;
        __coup(Math.floor(a.mhp * 0.3));
        out.boit = { perdu: hp0 - a.hp, colere: Math.round(StylesVesper.colere()) };
        // 3A : plus rien à boire — 1 PV minimum
        __coup(a.mhp * 5);
        out.unPV = { hp: a.hp, vivante: a.isAlive() };
        a.gainHp(-a.mhp * 3); out.poison = a.hp;
        a.clearResult(); a.addState(a.deathStateId()); out.mortRefusee = a.isAlive();
        // chaque coup la soigne : 25 % (+ les 20 % du Style Sang)
        a.setHp(Math.floor(a.mhp * 0.3)); PacteDeSang.poser(0);
        var hp1 = a.hp, act = new Game_Action(a); act.setAttack(); __jouer(act, E);
        out.vol = { soin: a.hp - hp1, degats: E.result().hpDamage };
        // ×2 : la technique BERSEK et ses répétitions
        // le contrecoup
        a.setHp(Math.floor(a.mhp * 0.6)); var hp2 = a.hp;
        a.clearResult(); a.removeState(12);
        out.contrecoup = { perdu: hp2 - a.hp, attendu: Math.floor(a.mhp * 0.2), etourdie: a.isStateAffected(134), colere: StylesVesper.colere() };
        var r57b = new Game_Action(a); r57b.setSkill(57); out.repHors = r57b.numRepeats();
        // contre-épreuve : hors Berserker, le vol de vie n'est que celui du Style
        __vider(); __style('saignee'); a.setHp(Math.floor(a.mhp * 0.3));
        var hp3 = a.hp, act2 = new Game_Action(a); act2.setAttack(); __jouer(act2, E);
        out.volHors = { soin: a.hp - hp3, degats: E.result().hpDamage };
        // contre-épreuve : hors Berserker, le coup mortel la tue
        __vider(); __style('saignee');
        __coup(a.mhp * 5); out.horsMeurt = a.isDead();
        a.clearResult(); a.removeState(a.deathStateId()); a.setHp(a.mhp);
        // contrecoup à 1 PV : il ne la tue pas
        __vider(); __style('saignee'); StylesVesper.poserColere(100); __frappe(B, a);
        a.setHp(1); a.clearResult(); a.removeState(12); out.contrecoupVivante = a.isAlive();
        // la durée : 3 tours pleins
        __vider(); __style('saignee'); StylesVesper.poserColere(100); __frappe(B, a);
        var vu = []; for (var k = 0; k < 5; k++) { __tour(); vu.push((a.isStateAffected(12) ? 'B' : '-') + (a.isStateAffected(134) ? 'é' : '')); }
        out.duree = vu.join(' ');
        // ── 3C : la Convergence
        __vider(); __style('saignee');
        var sp0 = __degats(1299, E);
        __frappe(813, a);
        out.conv = a.isStateAffected(1004);
        var sp1 = __degats(1299, E);
        out.ratioPercant = sp1 / sp0;
        out.defE = E.def;
        var sn = new Game_Action(a); sn.setSkill(1300); out.supernova = sn.makeTargets().length;
        __frappe(1, E); a.onAllActionsEnd(); out.attaqueGarde = a.isStateAffected(1004);
        __frappe(1299, E); a.onAllActionsEnd(); out.percantConsomme = !a.isStateAffected(1004);
        var sn2 = new Game_Action(a); sn2.setSkill(1300); out.supernovaSans = sn2.makeTargets().length;
        return out;
    });
    ok('sans Rage, pas de Berserker (contre-épreuve)', be.sansRage);
    ok('en Rage mais en Lame : pas de Berserker', be.rageLame);
    ok('en Rage et en Sang : 🩸 Berserker apparaît', be.rageSang);
    ok('lancé : Berserker, et la Rage s\'efface (plus de coups vers ludwing)', be.berserk);
    ok('le BERSEK s\'ouvre', be.bersek >= 4, be.bersek + ' techniques');
    ok('on ne change pas de Style en Berserker', be.pasDeStyle);
    ok('3A : ses techniques BERSEK frappent deux fois', be.rep === 2 * be.repHors && be.repHors >= 1, 'Frappe Écarlate ' + be.repHors + ' → ' + be.rep + ' coups');
    ok('en Berserker, la Rage ne revient pas par-dessus', be.pasDeRage);
    ok('3B : la Colère boit le coup à la place des PV', be.boit.perdu === 0 && be.boit.colere === 70, '−' + be.boit.perdu + ' PV · Colère ' + be.boit.colere);
    ok('3A : plus rien à boire — elle reste à 1 PV', be.unPV.vivante && be.unPV.hp === 1, be.unPV.hp + ' PV');
    ok('…ni le poison ni la mort ne la font tomber', be.poison === 1 && be.mortRefusee);
    // En Sang, elle boit déjà : 20 % (le Style) + la Voie du sang (MaitriseVoies). Le Berserker ajoute 25 %.
    var volB = be.vol.soin / be.vol.degats, volH = be.volHors.soin / be.volHors.degats;
    ok('chaque coup la soigne : +25 % en Berserker', Math.abs(volB - volH - 0.25) < 0.02,
        Math.round(volH * 100) + ' % → ' + Math.round(volB * 100) + ' % des dégâts (+' + be.vol.soin + ' PV pour ' + be.vol.degats + ')');
    ok('hors Berserker, le Style Sang boit déjà (contre-épreuve)', volH >= 0.2, Math.round(volH * 100) + ' %');
    ok('hors Berserker, le coup mortel la tue (contre-épreuve)', be.horsMeurt);
    ok('le contrecoup : 20 % de sa vie, étourdie, Colère à 0', be.contrecoup.perdu === be.contrecoup.attendu && be.contrecoup.etourdie && be.contrecoup.colere === 0,
        '−' + be.contrecoup.perdu + ' PV');
    ok('…mais il ne la tue pas', be.contrecoupVivante);
    ok('3 tours pleins de Berserker, puis un tour étourdie', be.duree === 'B B B -é -', 'fin des tours : ' + be.duree);
    ok('✶ Convergence', be.conv);
    ok('Sang Perçant ×2 et à travers toute défense', be.ratioPercant > 2, '×' + be.ratioPercant.toFixed(2) + ' (DÉF ennemie ' + be.defE + ')');
    ok('Supernova : 6 éclats au lieu de 4', be.supernova === 6 && be.supernovaSans === 4, be.supernovaSans + ' → ' + be.supernova);
    ok('une autre attaque ne consomme pas la Convergence (contre-épreuve)', be.attaqueGarde);
    ok('Sang Perçant la consomme', be.percantConsomme);

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n══ GARDE — ⚙ L\'ADAPTATION ET L\'ARME DE SANG (4B) ' + '═'.repeat(23));
    var ga = await page.evaluate(function () {
        var out = {}, a = V;
        var feu = $dataSkills.filter(function (s) { return s && s.damage && s.damage.type === 1 && s.damage.elementId === 8; })[0];
        out.feuNom = feu ? feu.name : '—';
        __vider(); __style('garde');
        a._paramPlus[0] += 999999; a.setHp(a.mhp);
        var suite = [];
        for (var i = 0; i < 7; i++) { var h = a.hp; __coup(1000); suite.push(h - a.hp); }
        out.physique = suite.join(' ');
        var h2 = a.hp; __coup(1000, feu.id); var h3 = a.hp; __coup(1000, feu.id);
        out.feu = (h2 - h3) + ' ' + (h3 - a.hp);
        out.encaisse = StylesVesper.sangEncaisse();
        out.adapt = StylesVesper.adaptation();
        // contre-épreuve : en Lame, rien ne s'adapte
        __vider(); __style('lame'); a.setHp(a.mhp);
        var s2 = []; for (var j = 0; j < 3; j++) { var hh = a.hp; __coup(1000); s2.push(hh - a.hp); }
        out.lame = s2.join(' ');
        out.lameEncaisse = StylesVesper.sangEncaisse();
        // quitter la Garde : tout est oublié à la fin du tour
        __vider(); __style('garde'); __coup(1000); __coup(1000);
        __style('lame'); __tour();
        out.oubli = Object.keys(StylesVesper.adaptation()).length;
        // ── la Garde boit : 5 %, 10 %, 20 %, 40 %, 80 %
        __vider(); __style('lame'); a.setMp(Math.floor(a.mmp / 2)); a.setTp(50);
        var m0 = a.mp, t0 = a.tp; __tour();
        var regenMp = a.mp - m0, regenTp = a.tp - t0;
        out.regen = regenMp + ' PM · ' + regenTp + ' PT';
        __vider(); __style('garde');
        var bus = [];
        for (var k = 0; k < 3; k++) { a.setMp(Math.floor(a.mmp / 2)); a.setTp(50); var mm = a.mp; __tour(); bus.push(mm - a.mp + regenMp); }
        out.boit = bus.join(' ');
        out.boitAttendu = [0.05, 0.10, 0.20].map(function (p) { return Math.ceil(a.mmp * p); }).join(' ');
        // à sec : l'armure cède
        __vider(); __style('garde'); __coup(1000); __coup(1000);
        var def0 = a.def; a.setMp(0); a.setTp(0);
        // ni PM ni PT ne reviennent (mais les états, eux, s'usent : chez YEP c'est dans regenerateAll)
        var vrai = { mp: Game_Battler.prototype.regenerateMp, tp: Game_Battler.prototype.regenerateTp };
        Game_Battler.prototype.regenerateMp = function () { }; Game_Battler.prototype.regenerateTp = function () { };
        __tour();
        out.brisee = { etat: a.isStateAffected(1003), adapt: Object.keys(StylesVesper.adaptation()).length, def: a.def / def0 };
        // brisée : ni adaptation ni sang encaissé
        var enc = StylesVesper.sangEncaisse(), hb = a.hp; __coup(1000); var hb2 = a.hp; __coup(1000);
        out.briseeCoups = (hb - hb2) + ' ' + (hb2 - a.hp);
        out.briseeEncaisse = StylesVesper.sangEncaisse() - enc;
        a.setMp(a.mmp); a.setTp(100);
        var vu = []; for (var q = 0; q < 2; q++) { __tour(); vu.push(a.isStateAffected(1003) ? 'X' : '-'); }
        out.briseeDuree = vu.join(' ');
        Game_Battler.prototype.regenerateMp = vrai.mp; Game_Battler.prototype.regenerateTp = vrai.tp;
        // contre-épreuve : avec du PM, elle tient
        __vider(); __style('garde'); a.setMp(a.mmp); a.setTp(0); __tour();
        out.tient = !a.isStateAffected(1003);
        // ── L'Arme de Sang
        __vider(); __style('garde'); a.setHp(a.mhp);
        __coup(Math.floor(a.mhp * 0.1));
        out.armeTrop = !a.canUse($dataSkills[1301]);
        __coup(Math.floor(a.mhp * 0.15));
        var enc2 = StylesVesper.sangEncaisse();
        out.armePeut = a.canUse($dataSkills[1301]);
        var avec = __degats(1301, E);
        var garde = a._sangEncaisse; a._sangEncaisse = 0; var sans = __degats(1301, E); a._sangEncaisse = garde;
        out.arme = { bonus: avec - sans, attendu: Math.floor(Math.floor(enc2 * 1.2) * E.elementRate(1)), enc: enc2 };
        __frappe(1301, E); a.onAllActionsEnd();
        out.armeVide = StylesVesper.sangEncaisse();
        __style('lame'); out.armeLame = !StylesVesper.dansLeKit(1301);
        a._paramPlus[0] -= 999999; a.setHp(a.mhp);
        return out;
    });
    ok('7 coups physiques de 1000 : −15 % par coup, jusqu\'à −75 %', ga.physique === '1000 850 700 550 400 250 250', ga.physique);
    ok('le feu repart de zéro : chaque type s\'apprend à part (' + ga.feuNom + ')', ga.feu === '1000 850', ga.feu);
    ok('…et le sang encaissé compte les coups avant l\'adaptation', ga.encaisse === 9000, ga.encaisse + '');
    ok('en Lame, rien ne s\'adapte ni ne s\'encaisse (contre-épreuve)', ga.lame === '1000 1000 1000' && ga.lameEncaisse === 0, ga.lame);
    ok('quitter la Garde, c\'est tout oublier', ga.oubli === 0);
    ok('la Garde boit de plus en plus : 5 %, 10 %, 20 % des PM', ga.boit === ga.boitAttendu, ga.boit + ' (attendu ' + ga.boitAttendu + ' · régén. ' + ga.regen + ')');
    ok('à sec : 💔 l\'armure cède, adaptations perdues', ga.brisee.etat && ga.brisee.adapt === 0, 'DÉF ×' + ga.brisee.def.toFixed(2));
    ok('…DÉF ×0,5', Math.abs(ga.brisee.def - 0.5) < 0.02);
    ok('brisée : plus d\'adaptation ni de sang encaissé', ga.briseeCoups.split(' ')[0] === ga.briseeCoups.split(' ')[1] && ga.briseeEncaisse === 0, ga.briseeCoups);
    ok('l\'armure reste brisée deux tours pleins', ga.briseeDuree === 'X -', ga.briseeDuree);
    ok('avec des PM, elle tient (contre-épreuve)', ga.tient);
    ok('L\'Arme de Sang : refusée sous 20 % de sa vie encaissés', ga.armeTrop);
    ok('…possible au-delà', ga.armePeut, ga.arme.enc + ' encaissés');
    ok('…elle rend tout : +120 % du sang encaissé', Math.abs(ga.arme.bonus / ga.arme.attendu - 1) < 0.05, '+' + ga.arme.bonus + ' (attendu ' + ga.arme.attendu + ')');
    ok('…et le compte repart à zéro', ga.armeVide === 0);
    ok('l\'Arme de Sang est de la Garde (pas en Lame)', ga.armeLame);

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n══ À L\'ÉCRAN ' + '═'.repeat(60));
    var ec = await page.evaluate(function () {
        __vider(); __style('garde'); __coup(500); __coup(500);
        var w = SceneManager._scene._fenetreColere;
        if (!w) { return { fenetre: false }; }
        w.update();
        return { fenetre: true, texte: w.texte(V), visible: w.visible, y: w.y };
    });
    ok('la jauge de Colère est à l\'écran', ec.fenetre && ec.visible, ec.texte);
    ok('en Garde, elle montre l\'adaptation et le sang encaissé', ec.fenetre && /⚙/.test(ec.texte) && /🩸/.test(ec.texte));

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n══ UN VRAI COMBAT, LAISSÉ TOURNER ' + '═'.repeat(40));
    await page.evaluate(function () {
        Game_Action.prototype.applyVariance = __orig.variance; Game_Action.prototype.itemHit = __orig.hit;
        Game_Action.prototype.itemEva = __orig.eva; Game_Action.prototype.itemCri = __orig.cri;
        __vider();
        SceneManager._scene.update = window.__vraieMaj;
        BattleManager.endBattle(2); $gameParty.onBattleEnd(); $gameTroop.onBattleEnd();
        SceneManager.goto(Scene_Map);
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(800);
    await page.evaluate(function () { Game_Actor.prototype.isAutoBattle = function () { return true; }; });
    await ouvrirCombat();
    await page.evaluate(function () {
        $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); });
        $gameParty.members().forEach(function (a) { a.addParam(0, 9999999); a.recoverAll(); });
        window.__journal = [];
        var push = Window_BattleLog.prototype.addText;
        Window_BattleLog.prototype.addText = function (t) { window.__journal.push(String(t)); return push.call(this, t); };
        PacteDeSang.changerStyle('garde');
        window.__debut = $gameTroop.turnCount();
    });
    try {
        await page.waitForFunction(function () { return $gameTroop.turnCount() >= window.__debut + 3 || !$gameParty.inBattle(); }, null, { timeout: 300000, polling: 500 });
    } catch (e) { }
    var garde = await page.evaluate(function () {
        return { tour: $gameTroop.turnCount() - window.__debut, boit: window.__journal.filter(function (l) { return /La Garde boit/.test(l); }).length,
                 adapte: window.__journal.filter(function (l) { return /s'adapte/.test(l); }).length };
    });
    ok('en Garde, le moteur joue : la Garde boit à chaque tour', garde.tour >= 3 && garde.boit >= 3, garde.tour + ' tours · ' + garde.boit + ' fois · ' + garde.adapte + ' adaptations');
    await page.evaluate(function () {
        PacteDeSang.changerStyle('saignee'); StylesVesper.poserColere(100);
        window.__debut = $gameTroop.turnCount(); window.__journal = [];
    });
    try {
        await page.waitForFunction(function () { return $gameTroop.turnCount() >= window.__debut + 2 || !$gameParty.inBattle(); }, null, { timeout: 300000, polling: 500 });
    } catch (e) { }
    var rage = await page.evaluate(function () {
        return { tour: $gameTroop.turnCount() - window.__debut, rage: window.__journal.filter(function (l) { return /EXPLOSE DE RAGE|perd le fil|Berserker|lâche la bride/.test(l); }),
                 enCombat: $gameParty.inBattle(), phase: BattleManager._phase, sujet: BattleManager._subject ? BattleManager._subject.name() : '—',
                 fin: window.__journal.slice(-6).join(' / ').replace(/\\C\[\d+\]/g, '') };
    });
    ok('en Rage, le combat continue sans accroc', rage.tour >= 2, rage.tour + ' tours · ' + (rage.rage.slice(0, 2).join(' / ').replace(/\\C\[\d+\]/g, '') || '—')
        + (rage.tour >= 2 ? '' : ' · en combat=' + rage.enCombat + ' phase=' + rage.phase + ' sujet=' + rage.sujet + ' · ' + rage.fin));

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n── LES ERREURS DU MOTEUR ' + '─'.repeat(48));
    ok('rien n\'a planté', erreurs.length === 0, erreurs.slice(0, 5).join(' | '));
    console.log('\n' + '═'.repeat(74) + '\n   ' + vert + ' vert · ' + rouge + ' rouge\n' + '═'.repeat(74));
    await nav.close();
    process.exit(rouge ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
