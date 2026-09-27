/*
 * BANC NAVIGATEUR — LES HABITANTS DU BAR ET DE L'AUBERGE, POUR DE VRAI
 * ---------------------------------------------------------------------------
 * Les cartes 46 (bar) et 44 (auberge), dans le vrai moteur, avec tous les
 * plugins (Habitants.js, MOG_TimeSystem, le nom en boîte YEP…) :
 *
 *  1. LES HORAIRES — à 8 h, 14 h, 20 h et 2 h, qui est là ? Un habitant
 *     absent n'a pas de page (on ne peut ni le voir ni lui parler) ; il
 *     revient quand l'heure tourne, sans quitter la carte.
 *  2. LA MÉMOIRE — deux conversations de suite : « visites » passe de 1 à 2 ;
 *     sept jours plus tard, « jours depuis » vaut 7.
 *  3. CHAQUE PAGE DE CHAQUE HABITANT, aux quatre saisons et aux quatre
 *     moments, parcourue jusqu'à « Au revoir » avec des choix au hasard :
 *     aucune erreur, et la conversation se termine toujours.
 *
 *   npx http-server -p 8899 -c-1 .     puis     node bancs/navigateur/les_habitants.js
 */
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
(async function () {
  var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
  var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
  var err = []; page.on('pageerror', function (e) { err.push(e.message.split('\n')[0]); });
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 180000 });
  await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
  await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
  await page.waitForTimeout(1000);
  var echecs = 0;
  function ok(c, m) { console.log('  ' + (c ? '✓' : '✗') + ' ' + m); if (!c) echecs++; }

  for (var carte of [46, 44]) {
    await page.evaluate(function (c) { $gamePlayer.reserveTransfer(c, 10, 20, 2, 2); }, carte);
    await page.waitForFunction(function (c) { return $gameMap.mapId() === c && SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, carte, { timeout: 60000 });
    await page.waitForTimeout(600);
    console.log('\n  ── carte ' + carte + ' ──');

    /* 1. les horaires */
    var h = await page.evaluate(function () {
      var hab = $gameMap.events().filter(function (e) { return e.page() || e.event().pages.some(function (p) { return p.list.some(function (c) { return c.code === 108 && /^◆ HABITANT/.test(c.parameters[0]); }); }); })
        .filter(function (e) { return e.event().pages.some(function (p) { return p.list.some(function (c) { return c.code === 108 && /^◆ HABITANT/.test(c.parameters[0]); }); }); });
      var res = {};
      [8, 14, 20, 2].forEach(function (hh) {
        $gameSystem.set_hour(hh); $gameMap.update(false); $gameMap.refreshIfNeeded();
        res[hh] = hab.filter(function (e) { return e._pageIndex >= 0; }).map(function (e) { return e.event().name; });
      });
      var silas = $gameMap.events().filter(function (e) { return e.event().name === 'Silas'; })[0];
      var r = { res: res, total: hab.length };
      if (silas) { $gameSystem.set_hour(10); $gameMap.update(false); $gameMap.refreshIfNeeded(); r.silas10 = silas._pageIndex; $gameSystem.set_hour(20); $gameMap.update(false); $gameMap.refreshIfNeeded(); r.silas20 = silas._pageIndex; }
      return r;
    });
    Object.keys(h.res).forEach(function (hh) { console.log('    ' + String(hh).padStart(2) + ' h : ' + h.res[hh].length + '/' + h.total + ' présents — ' + h.res[hh].join(', ')); });
    if (carte === 46) ok(h.silas10 === -1 && h.silas20 >= 0, 'Silas (<Horaire: 18-4>) : absent à 10 h, présent à 20 h, sans quitter la carte');

    /* 2 + 3. la mémoire, puis chaque page */
    var r = await page.evaluate(function () {
      var sorties = {};
      SceneManager.push = function (c) { sorties[c && c.name] = (sorties[c && c.name] || 0) + 1; };
      SceneManager.prepareNextScene = function () { };
      var res = { pages: 0, ok: 0, erreurs: [], longues: [], memoire: null };
      function parler(ev, pg) {
        var it = new Game_Interpreter(); it.setup(pg.list, ev.eventId()); var n = 0;
        while (it.isRunning() && n < 4000) {
          if ($gameMessage.isBusy()) {
            if ($gameMessage.isChoice()) { var k = $gameMessage.choices().length; $gameMessage.onChoice(Math.floor(Math.random() * k)); }
            $gameMessage.clear();
          }
          it.update(); $gameMap.events().forEach(function (e) { e.update(); }); $gameScreen.update(); n++;
        }
        return !it.isRunning();
      }
      var hab = $gameMap.events().filter(function (e) { return e.event().pages.some(function (p) { return p.list.some(function (c) { return c.code === 108 && /^◆ HABITANT/.test(c.parameters[0]); }); }); });
      // la mémoire, sur le premier habitant
      var e0 = hab[0], p0 = e0.event().pages.filter(function (p) { return p.list.some(function (c) { return c.code === 108 && /^◆ HABITANT/.test(c.parameters[0]); }); })[0];
      $gameParty.gainGold(10000);
      parler(e0, p0); var v1 = $gameVariables.value(880);
      parler(e0, p0); var v2 = $gameVariables.value(880);
      $gameSystem.add_day(7); parler(e0, p0); var j = $gameVariables.value(881);
      res.memoire = [e0.event().name, v1, v2, j];
      for (var s = 1; s <= 4; s++) {
        [8, 14, 20, 2].forEach(function (hh) {
          $gameSystem.set_season(s); $gameSystem.set_hour(hh);
          hab.forEach(function (ev) {
            ev.event().pages.forEach(function (pg, k) {
              if (!pg.list.some(function (c) { return c.code === 108 && /^◆ HABITANT/.test(c.parameters[0]); })) return;
              res.pages++;
              $gameParty.gainGold(200);
              try { if (parler(ev, pg)) res.ok++; else res.longues.push(ev.event().name + ' p' + (k + 1)); }
              catch (x) { res.erreurs.push(ev.event().name + ' p' + (k + 1) + ' → ' + x.message); }
            });
          });
        });
      }
      res.sorties = sorties;
      return res;
    });
    ok(r.memoire[1] === 1 && r.memoire[2] === 2 && r.memoire[3] === 7, 'mémoire (' + r.memoire[0] + ') : visites 1 puis 2, puis 7 jours d\'absence comptés → ' + r.memoire.slice(1).join(' / '));
    ok(r.erreurs.length === 0, r.pages + ' conversations (4 saisons × 4 moments × chaque page) : ' + r.erreurs.length + ' erreur(s)');
    r.erreurs.slice(0, 8).forEach(function (x) { console.log('     ✗ ' + x); });
    ok(r.longues.length === 0, 'toutes finissent par « Au revoir » (' + r.ok + '/' + r.pages + ')' + (r.longues.length ? ' — sans fin : ' + r.longues.slice(0, 6).join(', ') : ''));
    console.log('    écrans ouverts (boutiques…) : ' + JSON.stringify(r.sorties));
  }
  ok(err.length === 0, 'erreurs de page : ' + (err.length ? err.slice(0, 5).join(' | ') : 'aucune'));
  await nav.close();
  console.log('\n  ' + (echecs ? echecs + ' contrôle(s) en échec' : 'tout passe'));
  process.exit(echecs ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
