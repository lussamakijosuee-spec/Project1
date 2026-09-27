/*
 * BANC NAVIGATEUR — LA VITRINE DES RECETTES (carte 70), POUR DE VRAI
 * ---------------------------------------------------------------------------
 * JOKO : « juste un event comme ça, je copie, je copie, je copie. »
 * Un événement copié doit marcher sur sa carte comme il marche ici. Donc :
 *
 *  1. EN TEMPS RÉEL — on entre sur la vitrine et on s'y promène 25 secondes,
 *     avec tous les plugins. Les processus parallèles tournent. Rien ne doit
 *     planter, ni sortir de la carte, ni lancer un combat, ni afficher un
 *     message tout seul.
 *  2. LES IMAGES — chaque page affiche un sprite ou une tuile qui se charge.
 *  3. CHAQUE PAGE DE CHAQUE ÉVÉNEMENT est exécutée par un vrai
 *     Game_Interpreter AVEC le numéro de l'événement (l'interrupteur local, le
 *     déplacement « cet événement », l'effacement agissent sur lui), trois
 *     fois, avec des choix au hasard. Les sorties vers un autre écran sont
 *     notées, pas suivies (comme bancs/navigateur/les_recettes.js).
 *
 *   npx http-server -p 8899 -c-1 .     puis     node bancs/navigateur/la_vitrine.js
 */
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var CARTE = 70;
(async function () {
  var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
  var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
  var err = []; page.on('pageerror', function (e) { err.push(e.message.split('\n')[0]); });
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 180000 });
  await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
  await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.evaluate(function (c) { [1, 2, 3, 4].forEach(function (id) { if ($gameParty._actors.indexOf(id) < 0) $gameParty.addActor(id); }); $gamePlayer.reserveTransfer(c, 1, 2, 2, 2); }, CARTE);
  await page.waitForFunction(function (c) { return $gameMap.mapId() === c && SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, CARTE, { timeout: 60000 });

  /* ── 1. en temps réel ─────────────────────────────────────────────── */
  await page.evaluate(function () {
    window.__vit = { transferts: [], combats: [], ecrans: [], messages: [], fins: [] };
    var V = window.__vit;
    function qui(it) { var e = $gameMap.event(it._eventId); return it._eventId + ' ' + (e ? e.event().name : '?'); }
    var t201 = Game_Interpreter.prototype.command201;
    Game_Interpreter.prototype.command201 = function () { V.transferts.push(qui(this)); return true; };
    Game_Interpreter.prototype.command301 = function () { V.combats.push(qui(this)); return true; };
    Game_Interpreter.prototype.command353 = function () { V.fins.push(qui(this)); return true; };
    var t101 = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function () { V.messages.push(qui(this)); return t101.call(this); };
    setInterval(function () { if ($gameMessage.isBusy()) { if ($gameMessage.isChoice()) $gameMessage.onChoice(0); $gameMessage.clear(); } }, 100);
    // le joueur se promène dans les allées (rangées impaires : le plancher)
    window.__marche = setInterval(function () {
      if ($gamePlayer.isMoving()) return;
      var d = [2, 4, 6, 8][Math.floor(Math.random() * 4)];
      $gamePlayer.moveStraight(d);
    }, 120);
  });
  await page.waitForTimeout(25000);
  var reel = await page.evaluate(function (c) {
    clearInterval(window.__marche);
    var V = window.__vit;
    return { carte: $gameMap.mapId() === c, scene: SceneManager._scene.constructor.name, V: V, pas: $gameParty.steps() };
  }, CARTE);
  function uniq(l) { var o = {}; l.forEach(function (x) { o[x] = (o[x] || 0) + 1; }); return Object.keys(o).map(function (k) { return k + (o[k] > 1 ? ' ×' + o[k] : ''); }); }
  console.log('\n  1. 25 s en temps réel sur la vitrine (' + reel.pas + ' pas) : scène ' + reel.scene + (reel.carte ? ', toujours sur la carte' : ', SORTI DE LA CARTE'));
  console.log('     transferts demandés tout seuls : ' + (uniq(reel.V.transferts).join(' · ') || 'aucun'));
  console.log('     combats demandés tout seuls    : ' + (uniq(reel.V.combats).join(' · ') || 'aucun'));
  console.log('     game over demandés             : ' + (uniq(reel.V.fins).join(' · ') || 'aucun'));
  console.log('     messages affichés              : ' + (uniq(reel.V.messages).join(' · ') || 'aucun'));
  var errReel = err.slice();

  /* ── 2. les images ────────────────────────────────────────────────── */
  var img = await page.evaluate(async function () {
    var noms = {};
    $dataMap.events.forEach(function (e) { if (e) e.pages.forEach(function (p) { if (p.image.characterName) noms[p.image.characterName] = 1; }); });
    var mauvaises = [];
    await Promise.all(Object.keys(noms).map(function (n) {
      return new Promise(function (ok) {
        var b = ImageManager.loadCharacter(n);
        var t = setInterval(function () { if (b.isReady() || b.isError()) { clearInterval(t); if (b.isError()) mauvaises.push(n); ok(); } }, 50);
      });
    }));
    return { n: Object.keys(noms).length, mauvaises: mauvaises };
  });
  console.log('  2. ' + img.n + ' feuilles de sprites employées · ' + (img.mauvaises.length ? '✗ illisibles : ' + img.mauvaises.join(', ') : 'toutes se chargent'));

  /* ── 3. chaque page de chaque événement ───────────────────────────── */
  var r = await page.evaluate(function () {
    var sorties = {};
    function note(q) { sorties[q] = (sorties[q] || 0) + 1; }
    Game_Interpreter.prototype.command201 = function () { note('transfert'); return true; };
    Game_Interpreter.prototype.command301 = function () { note('combat'); return true; };
    Game_Interpreter.prototype.command353 = function () { note('game over'); return true; };
    SceneManager.push = function (c) { note('écran ' + (c && c.name)); };
    SceneManager.goto = function (c) { note('écran ' + (c && c.name)); };
    SceneManager.prepareNextScene = function () { };
    BattleManager.setup = function () { note('combat'); };
    var res = { pages: 0, ok: 0, erreurs: [], longues: [] };
    var avant = $gameParty._actors.slice();
    function repondre(passe) {
      if (!$gameMessage.isBusy()) return;
      if ($gameMessage.isChoice()) { var n = $gameMessage.choices().length; $gameMessage.onChoice((Math.floor(Math.random() * n) + passe) % n); }
      if ($gameMessage.isNumberInput()) $gameVariables.setValue($gameMessage.numInputVariableId(), [0, 1234, 7, 12, 451][passe % 5]);
      if ($gameMessage.isItemChoice()) $gameVariables.setValue($gameMessage.itemChoiceVariableId(), passe === 1 ? 9 : 0);
      $gameMessage.clear();
    }
    $gameMap.events().forEach(function (ev) {
      var id = ev.eventId();
      ev.event().pages.forEach(function (pg, k) {
        res.pages++;
        var plantee = null, longue = false;
        for (var passe = 0; passe < 3 && !plantee; passe++) {
          $gameParty._actors = avant.slice(); $gamePlayer.refresh();
          $gameParty.gainGold(5000); $gameParty.members().forEach(function (a) { a.recoverAll(); });
          [1, 3, 9, 15, 44, 45, 81, 82, 83, 84, 110, 54, 42, 60, 6, 5].forEach(function (x) { $gameParty.gainItem($dataItems[x], 3); });
          $gameMessage.clear(); $gameTimer.stop();
          var it = new Game_Interpreter();
          it.setup(pg.list, id);
          var n = 0;
          try {
            while (it.isRunning() && n < 6000) {
              repondre(passe);
              it.update();
              $gameMap.events().forEach(function (e) { e.update(); });
              $gamePlayer.update(false); $gameMap.updateScroll(); $gameScreen.update(); $gameTimer.update(true);
              var sc = SceneManager._scene; if (sc && sc._spriteset) sc._spriteset.update();
              if (it._waitMode === 'transfer') it._waitMode = '';
              n++;
            }
            if (it.isRunning()) longue = true;
          } catch (e) { plantee = e.message; }
        }
        var nom = id + ' ' + ev.event().name + (k ? ' (page ' + (k + 1) + ')' : '');
        if (plantee) res.erreurs.push(nom + ' → ' + plantee);
        else if (longue) res.longues.push(nom);
        else res.ok++;
      });
    });
    res.sorties = sorties;
    return res;
  });
  // Seconde passe, en TEMPS RÉEL : ce qui tournait encore est rejoué par
  // l'interprète de la carte, image après image, comme dans le jeu.
  var VOULUES = /deviner un nombre|appuie sur OK/;
  var encore = [];
  for (var k = 0; k < r.longues.length; k++) {
    var m = r.longues[k].match(/^(\d+) .*?(?: \(page (\d+)\))?$/);
    await page.evaluate(function (a) {
      window.__rep = setInterval(function () {
        if (!$gameMessage.isBusy()) return;
        if ($gameMessage.isChoice()) $gameMessage.onChoice(0);
        if ($gameMessage.isNumberInput()) $gameVariables.setValue($gameMessage.numInputVariableId(), 1);
        $gameMessage.clear();
      }, 50);
      $gameMap._interpreter.setup($gameMap.event(a[0]).event().pages[a[1]].list, a[0]);
    }, [Number(m[1]), m[2] ? Number(m[2]) - 1 : 0]);
    var fini = false;
    for (var t = 0; t < 40 && !fini; t++) { await page.waitForTimeout(250); fini = await page.evaluate(function () { return !$gameMap._interpreter.isRunning(); }); }
    await page.evaluate(function () { clearInterval(window.__rep); $gameMap._interpreter.clear(); $gameMessage.clear(); });
    if (!fini) encore.push(r.longues[k]);
  }
  r.longues = encore;
  var bloquees = r.longues.filter(function (x) { return !VOULUES.test(x); });
  console.log('  3. ' + r.pages + ' pages exécutées 3 fois chacune : ' + r.ok + ' vont au bout · ' + r.erreurs.length + ' erreur(s) · ' + r.longues.length + ' encore en cours, même en temps réel');
  r.erreurs.forEach(function (x) { console.log('     ✗ ' + x); });
  r.longues.forEach(function (x) { console.log('     … ' + x + (VOULUES.test(x) ? ' (attend le joueur, c\'est voulu)' : '')); });
  console.log('     sorties demandées : ' + JSON.stringify(r.sorties));
  console.log('  erreurs de page : ' + (err.length ? err.slice(0, 6).join(' | ') : 'aucune'));
  await nav.close();
  var auto = reel.V.transferts.length + reel.V.combats.length + reel.V.fins.length;
  process.exit(!reel.carte || auto || errReel.length || img.mauvaises.length || r.erreurs.length || bloquees.length || err.length ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
