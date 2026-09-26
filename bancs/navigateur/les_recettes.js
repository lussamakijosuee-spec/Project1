/*
 * BANC NAVIGATEUR — LES RECETTES TOURNENT, POUR DE VRAI
 * ---------------------------------------------------------------------------
 * JOKO : « il faut que le programme puisse marcher. »
 *
 * Chaque événement commun ✎ (1001 et suivants) est EXÉCUTÉ dans le vrai
 * moteur, avec tous les plugins, par un vrai Game_Interpreter, depuis un
 * événement de carte (l'atelier, carte 68) — trois fois, avec des choix tirés
 * au hasard pour passer par des branches différentes.
 *
 * Seules les sorties vers un AUTRE écran sont interceptées (combat, boutique,
 * menu, transfert, game over…) : on note qu'elles ont été demandées, et on
 * continue. Les messages sont fermés, les choix et les nombres répondus.
 *
 * Une recette est en défaut si elle lève une erreur. Une recette qui tourne
 * encore au bout de 6 000 images est listée à part (elle attend peut-être une
 * touche, c'est voulu pour certaines).
 *
 *   npx http-server -p 8899 -c-1 .     puis     node bancs/navigateur/les_recettes.js
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
  await page.waitForTimeout(1200);
  await page.evaluate(function () { [1, 2, 3, 4].forEach(function (id) { if ($gameParty._actors.indexOf(id) < 0) $gameParty.addActor(id); }); $gamePlayer.reserveTransfer(68, 3, 3, 2, 2); });
  await page.waitForFunction(function () { return $gameMap.mapId() === 68 && SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
  await page.waitForTimeout(800);

  // Les images d'animation se chargent en asynchrone : dans le jeu, entre
  // deux images ; ici, on les charge d'abord, puis on laisse le temps.
  await page.evaluate(function () {
    for (var i = 1001; i < $dataCommonEvents.length; i++) {
      var c = $dataCommonEvents[i]; if (!c) continue;
      c.list.forEach(function (x) {
        if (x.code === 212) { var a = $dataAnimations[x.parameters[1]]; if (a) { ImageManager.loadAnimation(a.animation1Name, a.animation1Hue); ImageManager.loadAnimation(a.animation2Name, a.animation2Hue); } }
      });
    }
  });
  await page.waitForTimeout(5000);
  var r = await page.evaluate(function () {
    var sorties = {};
    function note(q) { sorties[q] = (sorties[q] || 0) + 1; }
    // les sorties vers un autre écran : notées, pas suivies
    SceneManager.push = function (c) { note('écran ' + (c && c.name)); };
    SceneManager.goto = function (c) { note('écran ' + (c && c.name)); };
    SceneManager.prepareNextScene = function () { };
    Game_Player.prototype.reserveTransfer = function (m) { note('transfert'); };
    BattleManager.setup = function () { note('combat'); };
    BattleManager.setEventCallback = function (cb) { this._eventCallback = cb; };

    var CE = $dataCommonEvents, resultats = { ok: 0, erreurs: [], longues: [], total: 0 };
    var ids = [];
    for (var i = 1001; i < CE.length; i++) if (CE[i] && /^✎ /.test(CE[i].name)) ids.push(i);
    resultats.total = ids.length;
    var avant = { actors: $gameParty._actors.slice() };

    function repondre(passe) {
      if (!$gameMessage.isBusy()) return;
      if ($gameMessage.isChoice()) {
        var n = $gameMessage.choices().length;
        $gameMessage.onChoice((Math.floor(Math.random() * n) + passe) % n);
      }
      if ($gameMessage.isNumberInput()) $gameVariables.setValue($gameMessage.numInputVariableId(), [0, 1234, 7, 12, 451][passe % 5]);
      if ($gameMessage.isItemChoice()) $gameVariables.setValue($gameMessage.itemChoiceVariableId(), passe === 1 ? 9 : 0);
      $gameMessage.clear();
    }

    ids.forEach(function (id) {
      var ce = CE[id], plantee = null, longue = false;
      for (var passe = 0; passe < 3 && !plantee; passe++) {
        $gameParty._actors = avant.actors.slice(); $gamePlayer.refresh();
        $gameParty.gainGold(5000); $gameParty.members().forEach(function (a) { a.recoverAll(); });
        [1, 3, 9, 15, 44, 45, 81, 82, 83, 84, 110, 54, 42, 60, 6, 5].forEach(function (x) { $gameParty.gainItem($dataItems[x], 3); });
        $gameMessage.clear(); $gameTimer.stop();
        var it = new Game_Interpreter();
        it.setup(ce.list, 1);
        var n = 0;
        try {
          while (it.isRunning() && n < 6000) {
            repondre(passe);
            it.update();
            $gameMap.events().forEach(function (e) { e.update(); });
            $gamePlayer.update(false);
            $gameMap.updateScroll();
            $gameScreen.update(); $gameTimer.update(true);
            // les bulles et les animations se terminent dans les sprites : on
            // fait vivre l'affichage comme le fait la scène
            var sc = SceneManager._scene; if (sc && sc._spriteset) sc._spriteset.update();
            if (it._waitMode === 'transfer') it._waitMode = '';
            n++;
          }
          if (it.isRunning()) longue = true;
        } catch (e) { plantee = e.message; }
      }
      if (plantee) resultats.erreurs.push(id + ' ' + ce.name + ' → ' + plantee);
      else if (longue) resultats.longues.push(id + ' ' + ce.name);
      else resultats.ok++;
    });
    resultats.sorties = sorties;
    return resultats;
  });
  // Seconde passe, en TEMPS RÉEL : ce qui tournait encore est rejoué par
  // l'interprète de la carte, image après image, comme dans le jeu. Seules
  // les recettes qui attendent volontairement le joueur doivent y rester.
  var VOULUES = /deviner un nombre|appuie sur OK/;
  var encore = [];
  for (var k = 0; k < r.longues.length; k++) {
    var id = Number(r.longues[k].split(' ')[0]);
    await page.evaluate(function (id) {
      window.__rep = setInterval(function () {
        if (!$gameMessage.isBusy()) return;
        if ($gameMessage.isChoice()) $gameMessage.onChoice(0);
        if ($gameMessage.isNumberInput()) $gameVariables.setValue($gameMessage.numInputVariableId(), 1);
        $gameMessage.clear();
      }, 50);
      $gameMap._interpreter.setup($dataCommonEvents[id].list, 1);
    }, id);
    var fini = false;
    for (var t = 0; t < 40 && !fini; t++) { await page.waitForTimeout(250); fini = await page.evaluate(function () { return !$gameMap._interpreter.isRunning(); }); }
    await page.evaluate(function () { clearInterval(window.__rep); $gameMap._interpreter.clear(); $gameMessage.clear(); });
    if (!fini) encore.push(r.longues[k]);
  }
  var bloquees = encore.filter(function (x) { return !VOULUES.test(x); });
  r.longuesReelles = encore;

  console.log('\n  ' + r.total + ' recettes exécutées 3 fois chacune');
  console.log('  ' + r.ok + ' vont au bout sans erreur');
  console.log('  ' + r.erreurs.length + ' lèvent une erreur');
  r.erreurs.forEach(function (x) { console.log('     ✗ ' + x); });
  console.log('  ' + (r.longues.length - encore.length) + ' autres vont au bout en temps réel (animations, défilement)');
  console.log('  ' + encore.length + ' attendent le joueur, et c\'est voulu :');
  encore.forEach(function (x) { console.log('     … ' + x); });
  if (bloquees.length) { console.log('  ✗ ' + bloquees.length + ' restent bloquées sans raison :'); bloquees.forEach(function (x) { console.log('     ✗ ' + x); }); }
  console.log('  sorties demandées : ' + JSON.stringify(r.sorties));
  console.log('  erreurs de page : ' + (err.length ? err.slice(0, 5).join(' | ') : 'aucune'));
  await nav.close();
  process.exit(r.erreurs.length || err.length || bloquees.length ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
