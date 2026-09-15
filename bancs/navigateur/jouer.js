/*
 * BANC NAVIGATEUR — le jeu, lancé et joué pour de vrai
 * ---------------------------------------------------------------------------
 * Les trois autres bancs lisent des fichiers. Celui-ci OUVRE LE JEU dans
 * Chromium, appuie sur les touches, et regarde ce qui se passe. Il a trouvé
 * quatre bugs qu'aucune lecture de données n'aurait vus :
 *
 *   - la tuile 0 mal étiquetée : soit rien ne bloque, soit tout bloque ;
 *   - un autorun sans seconde page : le joueur ne peut plus jamais bouger ;
 *   - aucune précision sur les classes ni les ennemis : « Manqué ! » à l'infini ;
 *   - les héros sans sprite : le joueur est invisible sur sa propre carte.
 *
 * IL N'EST PAS AUTOMATIQUE : il demande Node, Playwright et un serveur.
 *
 *   npm i -D playwright && npx playwright install chromium
 *   npx http-server -p 8899 -c-1 .          (dans un autre terminal, à la racine)
 *   node bancs/navigateur/jouer.js
 *
 * Les captures atterrissent dans bancs/navigateur/captures/.
 */

'use strict';
var { chromium } = require('playwright');
var SHOTS = process.env.ETT_CAPTURES || require('path').join(__dirname, 'captures') + require('path').sep;
require('fs').mkdirSync(SHOTS, { recursive: true });

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });

    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push('PAGEERROR: ' + e.message); });
    page.on('console', function (m) { if (m.type() === 'error') { erreurs.push('CONSOLE: ' + m.text().slice(0, 200)); } });
    page.on('response', function (r) { if (r.status() >= 400) { erreurs.push('HTTP ' + r.status() + ' ' + r.url().replace('http://127.0.0.1:8899', '')); } });

    var ev = function (fn, arg) { return page.evaluate(fn, arg); };
    var scene = function () { return ev(function () { return SceneManager._scene ? SceneManager._scene.constructor.name : '?'; }); };
    // MV ne voit une touche que si elle reste enfoncée au moins une frame.
    var touche = async function (k, ms) {
        await page.keyboard.down(k); await page.waitForTimeout(ms || 110);
        await page.keyboard.up(k);   await page.waitForTimeout(ms || 110);
    };
    var photo = async function (nom) {
        await page.screenshot({ path: SHOTS + nom + '.png' });
        console.log('   [capture] ' + nom + '  (scene ' + (await scene()) + ')');
    };
    var ok = 0, ko = 0;
    var verifie = function (libelle, condition, detail) {
        if (condition) { ok++; console.log('   OK  ' + libelle + (detail ? '  -- ' + detail : '')); }
        else { ko++; console.log('   KO  ' + libelle + (detail ? '  -- ' + detail : '')); }
    };

    console.log('=== LE JEU, JOUE POUR DE VRAI ===\n');
    await page.goto('http://127.0.0.1:8899/index.html', { waitUntil: 'load' });

    console.log('1) L ecran-titre');
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 60000 });
    await page.waitForTimeout(600);
    await photo('01_titre');
    verifie('le titre s affiche et ses commandes repondent', (await scene()) === 'Scene_Title',
        await ev(function () { return $dataSystem.gameTitle; }));

    console.log('\n2) Nouvelle partie');
    await touche('Enter');
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded();
    }, null, { timeout: 30000 }).catch(function () {});
    await page.waitForTimeout(1200);
    verifie('la carte se charge', (await scene()) === 'Scene_Map',
        await ev(function () { return 'carte ' + $gameMap.mapId() + ' - ' + $dataMap.displayName; }));

    console.log('\n3) L introduction en autorun');
    // Laisser l autorun DEMARRER avant de conclure : sinon on mesure le vide,
    // et l evenement bloque ensuite tout le reste du test.
    await page.waitForFunction(function () { return $gameMap.isEventRunning(); }, null, { timeout: 8000 })
        .then(function () { console.log('   (l autorun a bien demarre)'); })
        .catch(function () { console.log('   (aucun autorun detecte)'); });
    var t = 0;
    while (t < 40 && (await ev(function () { return $gameMap.isEventRunning() || $gameMessage.isBusy(); }))) {
        await touche('Enter', 90); t++;
    }
    await page.waitForTimeout(600);
    await page.waitForTimeout(500);
    await photo('02_carte');
    verifie('l autorun se termine et rend la main',
        !(await ev(function () { return $gameMap.isEventRunning(); })), t + ' pressions');

    console.log('\n4) Marcher au clavier');
    var avant = await ev(function () { return { x: $gamePlayer.x, y: $gamePlayer.y }; });
    await page.keyboard.down('ArrowLeft');  await page.waitForTimeout(1800);
    await page.keyboard.up('ArrowLeft');    await page.waitForTimeout(400);
    await page.keyboard.down('ArrowDown');  await page.waitForTimeout(900);
    await page.keyboard.up('ArrowDown');    await page.waitForTimeout(500);
    var apres = await ev(function () { return { x: $gamePlayer.x, y: $gamePlayer.y, pas: $gameParty.steps() }; });
    verifie('le personnage se deplace', apres.x !== avant.x || apres.y !== avant.y,
        '(' + avant.x + ',' + avant.y + ') -> (' + apres.x + ',' + apres.y + '), ' + apres.pas + ' pas');

    console.log('\n5) Les bords de la carte');
    var mur = await ev(function () {
        return { coin: $gameMap.isPassable(0, 0, 2), centre: $gameMap.isPassable(9, 8, 2) };
    });
    verifie('le pourtour bloque', mur.coin === false);
    verifie('le sol laisse passer', mur.centre === true);

    console.log('\n6) La faim');
    var f0 = await ev(function () { return ETT.Faim.valeur(1); });
    await ev(function () { for (var i = 0; i < 200; i++) { $gameParty.increaseSteps(); } });
    var f1 = await ev(function () { return ETT.Faim.valeur(1); });
    verifie('la marche creuse', f1 > f0, f0 + ' -> ' + f1);

    var repas = await ev(function () {
        $gameParty.gainItem($dataItems[1], 1);
        ETT.Faim.ajouter(1, 60);
        var v = $gameActors.actor(1), av = ETT.Faim.valeur(1);
        var a = new Game_Action(v); a.setItem(1); a.apply(v);
        $gameParty.consumeItem($dataItems[1]);
        return { avant: av, apres: ETT.Faim.valeur(1), socle: ETT.Faim.socle(1), stade: ETT.Faim.nomStade(1) };
    });
    verifie('manger comble', repas.apres < repas.avant,
        'faim ' + repas.avant + ' -> ' + repas.apres + ' | socle ' + repas.socle + ' | ' + repas.stade);

    var st3 = await ev(function () {
        ETT.Faim.ajouter(1, 75 - ETT.Faim.valeur(1));
        return { nom: ETT.Faim.nomStade(1), stade: ETT.Faim.stade(1),
                 etats: $gameActors.actor(1).states().map(function (s) { return s.name; }) };
    });
    verifie('le stade pose son etat en jeu', st3.stade === 3 && st3.etats.indexOf('Stade 3 — La Fièvre') >= 0,
        st3.nom + ' | etats : ' + st3.etats.join(', '));

    await ev(function () { ETT.Faim.annone(); });

    console.log('\n7) Le menu');
    await touche('Escape');
    await page.waitForTimeout(1000);
    await photo('03_menu');
    verifie('le menu s ouvre', (await scene()) === 'Scene_Menu');
    await touche('Escape');
    await page.waitForTimeout(900);

    console.log('\n8) Un combat');
    // Un message encore ouvert rend BattleManager occupe pour toujours : attendre.
    await page.waitForFunction(function () {
        return !$gameMessage.isBusy() && !$gameMap.isEventRunning();
    }, null, { timeout: 15000 }).catch(function () {});
    await ev(function () { BattleManager.setup(1, true, false); SceneManager.push(Scene_Battle); });
    await page.waitForTimeout(4000);
    await photo('04_combat');
    verifie('le combat demarre', (await scene()) === 'Scene_Battle',
        await ev(function () { return $gameTroop.members().map(function (e) { return e.name(); }).join(', '); }));

    var coups = 0;
    while (coups < 140 && (await scene()) === 'Scene_Battle') { await touche('Enter', 80); coups++; }
    await page.waitForTimeout(2500);
    await photo('05_apres_combat');

    var bilan = await ev(function () {
        return { scene: SceneManager._scene.constructor.name,
                 pv: $gameParty.members().map(function (a) { return a.name() + ' ' + a.hp + '/' + a.mhp; }),
                 or: $gameParty.gold(), niveau: $gameActors.actor(1).level,
                 objets: $gameParty.items().map(function (i) { return i.name + 'x' + $gameParty.numItems(i); }) };
    });
    verifie('le combat se termine et rend la main', bilan.scene === 'Scene_Map',
        coups + ' pressions | or ' + bilan.or + ' | niveau ' + bilan.niveau +
        ' | butin ' + (bilan.objets.join(', ') || 'aucun'));
    console.log('   PV apres : ' + bilan.pv.join(' | '));

    console.log('\n9) Passer d une carte a l autre');
    for (var m = 2; m <= 3; m++) {
        await ev(function (id) { $gamePlayer.reserveTransfer(id, 5, 5, 2, 0); }, m);
        await page.waitForFunction(function (id) {
            return $gameMap.mapId() === id && DataManager.isMapLoaded() && !$gamePlayer.isTransferring();
        }, m, { timeout: 20000 }).catch(function () {});
        await page.waitForTimeout(1200);
        var ici = await ev(function () {
            return { id: $gameMap.mapId(), nom: $dataMap.displayName,
                     ev: $gameMap.events().length, renc: $dataMap.encounterList.length };
        });
        verifie('carte ' + m + ' accessible', ici.id === m,
            ici.nom + ' | ' + ici.ev + ' evenements | ' + ici.renc + ' rencontres');
        await photo('0' + (5 + m) + '_carte' + m);
    }

    console.log('\n10) Sauvegarde (sur la carte, jamais en plein combat :');
    console.log('    un chargement remplace $gameTroop et le combat en cours plante)');
    var sauve = await ev(function () {
        $gameSystem.onBeforeSave();
        var s = DataManager.saveGame(1);
        var l = s ? DataManager.loadGame(1) : false;
        return { s: s, l: l, faim: ETT.Faim.valeur(1), socle: ETT.Faim.socle(1) };
    });
    verifie('la partie se sauvegarde et se recharge', sauve.s && sauve.l,
        'faim conservee : ' + sauve.faim + ' | socle ' + sauve.socle);

    // En dernier, parce que la Mue declenche un game over : c est le jeu qui
    // fonctionne, pas un bug — mais ca met fin a la partie.
    console.log('\n11) La Mue (elle termine la partie, volontairement)');
    await ev(function () { ETT.Faim.ajouter(1, 200); });
    await page.waitForTimeout(500);
    var mue = await ev(function () {
        return { stade: ETT.Faim.stade(1), switch21: $gameSwitches.value(21) };
    });
    // L interrupteur 21 est peut-etre DEJA retombe : l evenement le coupe en
    // premier, pour ne pas repartir en boucle. On mesure donc le stade, et la
    // consequence (le game over ci-dessous), pas l etat instantane du drapeau.
    verifie('la faim au maximum donne le stade 4', mue.stade === 4,
        'stade ' + mue.stade + ' | interrupteur 21 deja retombe : ' + (mue.switch21 === false));
    var t2 = 0;
    while (t2 < 30 && (await scene()) !== 'Scene_Gameover') {
        await touche('Enter', 90); t2++;
    }
    await photo('09_mue');
    verifie('l evenement de la Mue mene au game over',
        (await scene()) === 'Scene_Gameover', t2 + ' pressions');

    console.log('\n=== BILAN ===');
    console.log(ok + ' controles passes, ' + ko + ' en echec');
    if (erreurs.length === 0) { console.log('Aucune erreur JavaScript, aucune ressource manquante.'); }
    else {
        console.log('Erreurs (' + erreurs.length + ') :');
        erreurs.slice(0, 20).forEach(function (e) { console.log('   ! ' + e); });
    }
    await nav.close();
    process.exit(ko === 0 && erreurs.length === 0 ? 0 : 1);
})().catch(function (e) { console.log('ECHEC : ' + e.message); process.exit(1); });
