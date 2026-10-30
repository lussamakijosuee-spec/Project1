/*
 * EST-CE QUE ÇA RAME EN VILLE ?
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-09-30 : « regarde le jeu et corrige les lag ».
 * bancs/navigateur/ca_rame.js ne regardait que la Plaine et la Salle de Test.
 * Ici : chaque carte où vivent les habitants (et la vitrine, 808 événements),
 * à 19 h, quand tout le monde est dehors. On compte les images par seconde et
 * le temps de calcul de chaque image (SceneManager.updateMain : logique +
 * rendu). Il faut tenir 16,7 ms pour 60 images/s.
 *
 * Mesures du 2026-09-30 (Chromium sans carte graphique) :
 *   avant  : la vitrine s'ARRÊTAIT (plantage d'Olivia_MetaControls) ; une fois
 *            réparée, 50 img/s, 15,3 ms par image ; Village Montagnard 4,0 ms
 *   après  : vitrine 60 img/s, 7,6 ms ; Village Montagnard 3,2 ms
 *            (js/plugins/Allegement.js : sprites hors écran en veille)
 * Échec si une carte plante, passe sous 55 img/s, ou dépasse 12 ms en moyenne.
 *
 *   npx http-server -p 8899 -c-1 .     puis     node bancs/navigateur/ca_rame_en_ville.js
 */
var { chromium } = require('playwright');
var CARTES = (process.argv[2] || '1,29,30,33,36,41,44,46,47,70').split(',').map(Number);
var echecs = 0;
(async function () {
  var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
  var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
  var err = []; page.on('pageerror', function (e) { err.push(e.message.split('\n')[0]); });
  await page.goto((process.env.ETT_URL || 'http://127.0.0.1:8899') + '/index.html', { waitUntil: 'load' });
  await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 180000 });
  await page.evaluate(function () {
    DataManager.setupNewGame(); SceneManager.goto(Scene_Map);
    window.__t = []; var u = SceneManager.updateMain;
    SceneManager.updateMain = function () { var a = performance.now(); u.call(this); window.__t.push(performance.now() - a); };
  });
  await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
  // une carte que JOKO a retirée (le Village Montagnard, 36, le 2026-10-29) se dit et se saute
  var existent = await page.evaluate(function (l) { return l.filter(function (c) { return !!$dataMapInfos[c]; }); }, CARTES);
  CARTES.filter(function (c) { return existent.indexOf(c) < 0; }).forEach(function (c) { console.log('  ·  ' + c + ' : cette carte n\'existe plus, sautée'); });
  for (var c of existent) {
    await page.evaluate(function (c) { var info = $dataMapInfos[c]; $gamePlayer.reserveTransfer(c, 10, 10, 2, 2); $gameSystem.set_hour(19); }, c);
    await page.waitForFunction(function (c) { return $gameMap.mapId() === c && SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, c, { timeout: 60000 });
    await page.waitForTimeout(2500);
    var r = await page.evaluate(async function () {
      window.__t = []; var n = 0, t0 = performance.now();
      await new Promise(function (ok) { function f() { n++; if (performance.now() - t0 < 5000) requestAnimationFrame(f); else ok(); } requestAnimationFrame(f); });
      if (!window.__t.length) return { fps: 0, moy: '999', p95: '-', max: '-', ev: $gameMap.events().length, nom: $dataMapInfos[$gameMap.mapId()].name + ' (le jeu est ARRÊTÉ)' };
      var t = window.__t.slice().sort(function (a, b) { return a - b; });
      var moy = t.reduce(function (s, x) { return s + x; }, 0) / t.length;
      return { fps: Math.round(n / 5), moy: moy.toFixed(1), p95: t[Math.floor(t.length * 0.95)].toFixed(1), max: t[t.length - 1].toFixed(0), ev: $gameMap.events().length, nom: $dataMapInfos[$gameMap.mapId()].name };
    });
    var mauvais = r.fps < 55 || Number(r.moy) > 12;
    if (mauvais) echecs++;
    console.log((mauvais ? '  ✗ ' : '  ✓ ') + String(c).padStart(3) + ' ' + r.nom.padEnd(34) + ' ' + String(r.fps).padStart(3) + ' img/s · calcul par image moy ' + r.moy + ' ms · p95 ' + r.p95 + ' · max ' + r.max + ' · ' + r.ev + ' événements');
  }
  console.log('erreurs : ' + (err.length ? err.slice(0, 5).join(' | ') : 'aucune'));
  if (err.length) echecs++;
  await nav.close();
  console.log(echecs ? '\n  ' + echecs + ' problème(s)' : '\n  tout passe');
  process.exit(echecs ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
