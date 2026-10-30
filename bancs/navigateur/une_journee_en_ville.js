/*
 * BANC NAVIGATEUR — UNE JOURNÉE EN VILLE, POUR DE VRAI
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-09-27 : « quand il commence à faire nuit, les gens commencent
 * à rentrer […] à une certaine heure, ils vont à un autre endroit […] les
 * portes : si la porte est fermée, ça marque fermée […] ». On REGARDE :
 *
 *  1. SES HORAIRES — à 10 h, MOG allume « TS · Jour » (202) : les deux clients
 *     de la forge (carte 41) sont là ; à 22 h, non.
 *  2. LES PORTES — la porte du bar (carte 29) : à 12 h elle transfère vers le
 *     bar ; à 6 h elle est fermée et propose de frapper. L'auberge transfère
 *     à 3 h du matin. Une maison sans destination est fermée à clé.
 *  3. LES INTÉRIEURS — on entre au bar avec la météo des saisons levée (231) :
 *     dedans elle est coupée et la teinte est nulle ; on ressort : elle revient.
 *  4. LE PASSAGE — au bar, à 18 h Silas arrive PAR LA PORTE et marche à sa
 *     place ; à 4 h il marche jusqu'à la porte avant de disparaître.
 *  5. LA SOIRÉE — carte 29, à 19 h, un habitant <Soiree: 14,32> marche jusqu'à
 *     la porte du bar et y entre.
 *  6. TOUTES LES CONVERSATIONS de chaque habitant de chaque carte, aux quatre
 *     saisons, matin et soir, jusqu'à « Au revoir » : aucune erreur.
 *
 *   npx http-server -p 8899 -c-1 .     puis     node bancs/navigateur/une_journee_en_ville.js
 */
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
(async function () {
  var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
  var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
  var err = []; page.on('pageerror', function (e) { err.push(e.message.split('\n')[0]); });
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 180000 });
  await page.evaluate(function () { DataManager.setupNewGame(); $gameSystem._meteo = { cle: "", type: "clair", force: "clair" };   // beau temps : sous la pluie, les habitants rentrent (MeteoVivante)
    SceneManager.goto(Scene_Map); });
  await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
  var echecs = 0;
  function ok(c, m) { console.log('  ' + (c ? '✓' : '✗') + ' ' + m); if (!c) echecs++; }
  async function aller(carte, x, y) {
    await page.evaluate(function (a) { $gamePlayer.reserveTransfer(a[0], a[1], a[2], 2, 2); }, [carte, x, y]);
    await page.waitForFunction(function (c) { return $gameMap.mapId() === c && SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, carte, { timeout: 60000 });
    await page.waitForTimeout(500);
  }
  async function heure(h) { await page.evaluate(function (h) { $gameSystem.set_hour(h); $gameSystem.set_minute(0); $gameMap.requestRefresh(); }, h); await page.waitForTimeout(300); }
  await page.evaluate(function () { window.__transfertVrai = Game_Player.prototype.reserveTransfer; });
  var parler = function () {
    window.__parler = function (list, id, choixFixe) {
      var it = new Game_Interpreter(); it.setup(list, id); var n = 0, vus = [];
      while (it.isRunning() && n < 4000) {
        if ($gameMessage.isBusy()) {
          vus.push($gameMessage.allText());
          if ($gameMessage.isChoice()) { var k = $gameMessage.choices().length; $gameMessage.onChoice(choixFixe != null ? choixFixe : Math.floor(Math.random() * k)); }
          $gameMessage.clear();
        }
        it.update(); $gameMap.events().forEach(function (e) { e.update(); }); n++;
        if (it._waitMode === 'transfer') { it._waitMode = ''; }
      }
      return { fini: !it.isRunning(), textes: vus };
    };
  };

  /* 1. ses horaires (MOG 202) */
  await aller(41, 10, 11);
  await heure(10);
  var r1 = null;   // chacun entre à son tour, dans les trois secondes (Habitants v1.2)
  for (var t1 = 0; t1 < 16 && !(r1 && r1[1] >= 0 && r1[2] >= 0); t1++) { await page.waitForTimeout(250); r1 = await page.evaluate(function () { return [$gameSwitches.value(202), $gameMap.event(4)._pageIndex, $gameMap.event(6)._pageIndex]; }); }
  await heure(22);
  var r1b = null;
  for (var t0 = 0; t0 < 40 && !(r1b && r1b[1] < 0); t0++) { await page.waitForTimeout(500); r1b = await page.evaluate(function () { return [$gameSwitches.value(202), $gameMap.event(4)._pageIndex, $gameMap.event(4)._habDepart ? 1 : 0]; }); }
  ok(r1[0] && r1[1] >= 0 && r1[2] >= 0 && !r1b[0] && r1b[1] < 0, 'horaires de JOKO réparés : à 10 h « TS · Jour » allumé, les clients de la forge sont là ; à 22 h ils sortent par la porte, puis n\'y sont plus');

  /* 2. les portes */
  await aller(29, 14, 33);
  await page.evaluate(parler);
  var portes = await page.evaluate(function () {
    var t = [];
    var avant = Game_Player.prototype.reserveTransfer;
    Game_Player.prototype.reserveTransfer = function (m) { t.push(m); };
    function essai(id, h, choix) { t.length = 0; $gameSystem.set_hour(h); var r = window.__parler($gameMap.event(id).event().pages[0].list, id, choix); return { t: t.slice(), textes: r.textes }; }
    var bar12 = essai(21, 12), bar6 = essai(21, 6, 0), aub3 = essai(15, 3), maison = essai(16, 14, 0);
    Game_Player.prototype.reserveTransfer = avant;
    return { bar12: bar12, bar6: bar6, aub3: aub3, maison: maison };
  });
  ok(portes.bar12.t[0] === 46, 'la porte du bar à 12 h : on entre (vers la carte 46)');
  ok(!portes.bar6.t.length && /Fermé/.test(portes.bar6.textes.join(' ')), 'la porte du bar à 6 h : « ' + (portes.bar6.textes[0] || '').replace(/\n/g, ' ') + ' », et l\'on peut frapper');
  ok(portes.aub3.t[0] === 44, 'l\'auberge à 3 h du matin : on entre (elle ne ferme jamais)');
  ok(!portes.maison.t.length && /fermée à clé/.test(portes.maison.textes.join(' ')), 'une maison sans destination : « ' + (portes.maison.textes[0] || '') + ' » — frapper : « ' + (portes.maison.textes[2] || '').replace(/\n/g, ' ').slice(0, 60) + ' »');

  /* 3. les intérieurs */
  await page.evaluate(function () { $gameSwitches.setValue(231, true); });
  await aller(46, 20, 38);
  var dedans = await page.evaluate(function () { return [$gameSwitches.value(231), $gameScreen.tone().join(','), Interieurs.est()]; });
  await aller(29, 14, 33);
  var dehors = await page.evaluate(function () { return [$gameSwitches.value(231), Interieurs.est()]; });
  ok(dedans[2] && dedans[0] === false && dedans[1] === '0,0,0,0' && dehors[0] === true && !dehors[1], 'intérieur : au bar la météo des saisons est coupée (231 OFF) et la teinte nulle ; dehors elle revient (231 ON)');

  /* 4. le passage */
  await aller(46, 20, 36);
  await heure(17);
  await page.waitForTimeout(800);
  await heure(18);
  var silasId = await page.evaluate(function () { return $gameMap.events().filter(function (e) { return e.event().name === 'Silas'; })[0].eventId(); });
  var arrivee = null;   // il entre dans les trois secondes (arrivées étalées)
  for (var t2 = 0; t2 < 16 && !(arrivee && arrivee.page >= 0); t2++) { await page.waitForTimeout(250); arrivee = await page.evaluate(function (id) { var e = $gameMap.event(id); return { page: e._pageIndex, x: e.x, y: e.y, marche: !!e._habArrivee, place: [e.event().x, e.event().y] }; }, silasId); }
  var fin = null;
  for (var t = 0; t < 40 && !fin; t++) { await page.waitForTimeout(500); fin = await page.evaluate(function (id) { var e = $gameMap.event(id); return !e._habArrivee ? [e.x, e.y] : null; }, silasId); }
  ok(arrivee.page >= 0 && arrivee.marche && fin && fin[0] === arrivee.place[0] && fin[1] === arrivee.place[1], 'à 18 h Silas entre par la porte (' + arrivee.x + ',' + arrivee.y + ') et marche jusqu\'à sa place (' + arrivee.place.join(',') + ')' + (fin ? ' — arrivé' : ' — pas arrivé'));
  await heure(4);
  var depart = await page.evaluate(function (id) { var e = $gameMap.event(id); return { page: e._pageIndex, marche: !!e._habDepart }; }, silasId);
  var parti = false;
  for (t = 0; t < 40 && !parti; t++) { await page.waitForTimeout(500); parti = await page.evaluate(function (id) { var e = $gameMap.event(id); return !e._habDepart && e._pageIndex < 0; }, silasId); }
  ok(depart.page >= 0 && depart.marche && parti, 'à 4 h Silas marche jusqu\'à la porte, puis n\'est plus là');

  /* 5. la soirée au bar — un habitant qui a <Soiree: 14,32> (Gaston, l'év. 27,
   *    a été retiré par JOKO le 2026-10-01 ; Colette et Mado y vont aussi) */
  await aller(29, 20, 22);
  var soiree = await page.evaluate(function () {
    var e = $gameMap.events().filter(function (e) { return e.page() && e.page().list.some(function (c) { return (c.code === 108 || c.code === 408) && /<Soiree:\s*14,\s*32>/.test(c.parameters[0]); }); })[0];
    return e ? { id: e.eventId(), nom: e.event().name } : null;
  });
  await heure(19);
  var gaston = null;
  for (t = 0; soiree && t < 240 && !gaston; t++) {   // Colette part de 11,9 : 25 cases
    await page.waitForTimeout(500);
    gaston = await page.evaluate(function (id) { var s = VieDuVillage.etat().filter(function (v) { return v.id === id; })[0]; return s && s.dedans ? s : null; }, soiree.id);
  }
  var but = soiree ? await page.evaluate(function (id) { var s = VieDuVillage.etat().filter(function (v) { return v.id === id; })[0]; return s && s.but; }, soiree.id) : '—';
  ok(!!gaston, 'à 19 h ' + (soiree ? soiree.nom + ' (év. ' + soiree.id + ', <Soiree: 14,32>)' : 'personne n\'a <Soiree: 14,32>') + ' va au bar : but « ' + but + ' »' + (gaston ? ', entré' : ', pas encore entré'));

  /* 6. toutes les conversations */
  var total = { pages: 0, ok: 0, erreurs: [] };
  // une carte que JOKO a retirée (le Village Montagnard, 36, le 2026-10-29) se dit et se saute
  var lesCartes = await page.evaluate(function (l) { return l.filter(function (c) { return !!$dataMapInfos[c]; }); }, [29, 30, 31, 33, 36, 41, 42, 43, 44, 46, 47]);
  if (lesCartes.indexOf(36) < 0) { console.log('  ·  36 : cette carte n\'existe plus, sautée'); }
  for (var carte of lesCartes) {
    await aller(carte, 1, 1);
    await page.evaluate(parler);
    var r = await page.evaluate(function () {
      SceneManager.push = function () { }; SceneManager.prepareNextScene = function () { };
      Game_Player.prototype.reserveTransfer = function () { };
      var res = { pages: 0, ok: 0, erreurs: [] };
      try {
      var hab = $gameMap.events().filter(function (e) { return e.event().pages.some(function (p) { return p.list.some(function (c) { return c.code === 108 && /^◆ (HABITANT|PORTE)/.test(c.parameters[0]); }); }); });
      [1, 2, 3, 4].forEach(function (s) { [9, 21].forEach(function (h) {
        $gameSystem.set_season(s); $gameSystem.set_hour(h); $gameParty.gainGold(300);
        hab.forEach(function (ev) { ev.event().pages.forEach(function (pg, k) {
          if (!pg.list.some(function (c) { return c.code === 108 && /^◆ (HABITANT|PORTE)/.test(c.parameters[0]); })) return;
          res.pages++;
          try { if (window.__parler(pg.list, ev.eventId()).fini) res.ok++; else res.erreurs.push(ev.event().name + ' p' + (k + 1) + ' sans fin'); }
          catch (x) { res.erreurs.push(ev.event().name + ' p' + (k + 1) + ' → ' + x.message); }
        }); });
      }); });
      } finally { Game_Player.prototype.reserveTransfer = window.__transfertVrai; }
      return res;
    });
    total.pages += r.pages; total.ok += r.ok; total.erreurs = total.erreurs.concat(r.erreurs.map(function (x) { return carte + ' : ' + x; }));
  }
  ok(!total.erreurs.length, total.pages + ' conversations et portes (10 cartes × 4 saisons × matin et soir) : ' + total.ok + ' vont au bout');
  total.erreurs.slice(0, 10).forEach(function (x) { console.log('     ✗ ' + x); });
  ok(!err.length, 'erreurs de page : ' + (err.length ? err.slice(0, 5).join(' | ') : 'aucune'));
  await nav.close();
  console.log('\n  ' + (echecs ? echecs + ' contrôle(s) en échec' : 'tout passe'));
  process.exit(echecs ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
