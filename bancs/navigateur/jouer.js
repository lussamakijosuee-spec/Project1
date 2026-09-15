/*
 * BANC NAVIGATEUR — le jeu restauré, ouvert et joué pour de vrai
 * ---------------------------------------------------------------------------
 * Les autres bancs lisent des fichiers. Celui-ci OUVRE LE JEU dans Chromium,
 * appuie sur les touches, et regarde ce qui se passe.
 *
 * Ce qu'il surveille en particulier depuis la restauration du 2026-09-15 :
 * `js/plugins.js` a été RECONSTRUIT à la main à partir de `plugins.js.ancien`,
 * en n'en gardant que les entrées tierces. Deux choses peuvent casser là :
 *
 *   - une entrée qui désigne un fichier absent — MV échoue au chargement ;
 *   - un plugin tiers qui appelait un plugin du projet, désormais écarté.
 *
 * Aucune lecture de fichier ne voit ça. Il faut lancer le jeu.
 *
 * IL N'EST PAS AUTOMATIQUE : il demande Node, Playwright et un serveur.
 *
 *   npx http-server -p 8899 -c-1 .          (dans un autre terminal, à la racine)
 *   node bancs/navigateur/jouer.js
 *
 * Les captures atterrissent dans bancs/navigateur/captures/.
 */

'use strict';
var { chromium } = require('playwright');
var path = require('path');
var SHOTS = process.env.ETT_CAPTURES || path.join(__dirname, 'captures') + path.sep;
require('fs').mkdirSync(SHOTS, { recursive: true });
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });

    var erreurs = [];
    var absents = [];
    page.on('pageerror', function (e) { erreurs.push('PAGEERROR: ' + e.message); });
    page.on('console', function (m) { if (m.type() === 'error') { erreurs.push('CONSOLE: ' + m.text().slice(0, 200)); } });
    page.on('response', function (r) {
        if (r.status() >= 400) { absents.push('HTTP ' + r.status() + ' ' + r.url().replace(BASE, '')); }
    });

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

    console.log('=== LE JEU RESTAURE, OUVERT POUR DE VRAI ===\n');
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });

    console.log('1) Le chargement : la base et les plugins');
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 120000 });
    await page.waitForTimeout(800);

    var base = await ev(function () {
        return {
            titre: $dataSystem.gameTitle,
            competences: $dataSkills.length - 1,
            ennemis: $dataEnemies.length - 1,
            etats: $dataStates.length - 1,
            troupes: $dataTroops.length - 1,
            animations: $dataAnimations.length - 1,
            cartes: $dataMapInfos.filter(function (m) { return !!m; }).length,
            evenementsCommuns: $dataCommonEvents.length - 1
        };
    });
    verifie('la base entiere est relue par le moteur', base.competences > 800 && base.ennemis > 400 && base.cartes > 60,
        base.competences + ' competences - ' + base.ennemis + ' ennemis - ' + base.etats + ' etats - ' +
        base.troupes + ' troupes - ' + base.animations + ' animations - ' + base.cartes + ' cartes - ' +
        base.evenementsCommuns + ' evenements communs');

    // Chaque entrée active de plugins.js doit avoir été chargée ET avoir posé son
    // objet de paramètres. Un fichier absent ne lève rien de visible : MV se tait.
    var plugins = await ev(function () {
        var actifs = $plugins.filter(function (p) { return p.status && /^[A-Za-z0-9_]/.test(p.name); });
        return {
            declares: actifs.map(function (p) { return p.name; }),
            charges: PluginManager._scripts.slice(),
            yep: typeof Yanfly !== 'undefined',
            mog: typeof Imported !== 'undefined' && Object.keys(Imported).filter(function (k) { return /^MOG/.test(k); }).length
        };
    });
    var pasCharges = plugins.declares.filter(function (n) { return plugins.charges.indexOf(n) < 0; });
    verifie('les 41 plugins tiers actifs sont tous charges', pasCharges.length === 0,
        plugins.charges.length + ' charges' + (pasCharges.length ? ' - MANQUENT : ' + pasCharges.join(', ') : ''));
    verifie('Yanfly a pose son espace de noms', plugins.yep === true);
    verifie('les MOG se sont declares dans Imported', plugins.mog >= 20, plugins.mog + ' MOG_*');

    await photo('01_titre');
    verifie('l ecran-titre s affiche et ses commandes repondent', (await scene()) === 'Scene_Title', base.titre);

    console.log('\n2) Nouvelle partie');
    await touche('Enter');
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded();
    }, null, { timeout: 60000 }).catch(function () {});
    await page.waitForTimeout(1500);
    var carte = await ev(function () {
        return { id: $gameMap.mapId(), nom: $dataMapInfos[$gameMap.mapId()] ? $dataMapInfos[$gameMap.mapId()].name : '?',
                 equipe: $gameParty.members().map(function (a) { return a.name(); }) };
    });
    verifie('la carte de depart se charge', (await scene()) === 'Scene_Map',
        'carte ' + carte.id + ' « ' + carte.nom + ' »');
    verifie('l equipe de depart est montee', carte.equipe.length > 0, carte.equipe.join(', '));

    console.log('\n3) Ce que la carte lance toute seule');
    await page.waitForFunction(function () { return $gameMap.isEventRunning(); }, null, { timeout: 8000 })
        .then(function () { console.log('   (un evenement demarre tout seul)'); })
        .catch(function () { console.log('   (aucun evenement au demarrage)'); });
    var t = 0;
    while (t < 60 && (await ev(function () { return $gameMap.isEventRunning() || $gameMessage.isBusy(); }))) {
        await touche('Enter', 80); t++;
    }
    await page.waitForTimeout(800);
    await photo('02_carte');
    verifie('le moteur rend la main au joueur', !(await ev(function () { return $gameMap.isEventRunning(); })),
        t + ' validation(s)');

    console.log('\n4) Marcher');
    var depart = await ev(function () { return $gamePlayer.x + ',' + $gamePlayer.y; });
    for (var i = 0; i < 4; i++) { await touche('ArrowDown', 130); }
    for (var j = 0; j < 4; j++) { await touche('ArrowRight', 130); }
    await page.waitForTimeout(500);
    var arrivee = await ev(function () { return $gamePlayer.x + ',' + $gamePlayer.y; });
    verifie('le heros se deplace au clavier', depart !== arrivee, depart + ' -> ' + arrivee);
    verifie('le heros a un sprite', await ev(function () {
        return !!$gameParty.leader().characterName();
    }), await ev(function () { return $gameParty.leader().characterName(); }));
    await photo('03_marche');

    console.log('\n5) Le menu');
    await touche('Escape', 250);
    await page.waitForTimeout(900);
    verifie('le menu s ouvre', (await scene()) === 'Scene_Menu');
    await photo('04_menu');
    await touche('Escape', 250);
    await page.waitForTimeout(700);
    verifie('le menu se referme sur la carte', (await scene()) === 'Scene_Map');

    console.log('\n6) Les ecrans que Yanfly reecrit');
    // YEP_SkillCore et TSR_EquipSlots redessinent ces deux scenes de fond en comble,
    // et les relisent sur 1258 competences et tout l'equipement. C'est la qu'un
    // plugin du projet ecarte se serait fait sentir.
    await touche('Escape', 250); await page.waitForTimeout(700);
    await ev(function () { SceneManager.push(Scene_Skill); });
    await page.waitForTimeout(1400);
    verifie('l ecran des competences s ouvre', (await scene()) === 'Scene_Skill',
        await ev(function () { return $gameParty.leader().skills().length + ' competences sur le porteur'; }));
    await photo('05_competences');
    await ev(function () { SceneManager.goto(Scene_Equip); });
    await page.waitForTimeout(1400);
    verifie('l ecran d equipement s ouvre', (await scene()) === 'Scene_Equip',
        await ev(function () { return $gameParty.leader().equipSlots().length + ' emplacements'; }));
    await photo('06_equipement');
    await ev(function () { SceneManager.goto(Scene_Map); });
    await page.waitForTimeout(1200);

    console.log('\n7) Un combat, mene jusqu au bout');
    // Le coeur du risque : BattleEngineCore + les trois ActSeqPack + le CTB +
    // AnimatedSVEnemies, sans un seul plugin du projet pour les epauler.
    var troupe = await ev(function () {
        var t = null;
        for (var i = 1; i < $dataTroops.length && !t; i++) {
            if ($dataTroops[i] && $dataTroops[i].members.length) { t = i; }
        }
        BattleManager.setup(t, true, true);
        $gamePlayer.makeEncounterCount();
        SceneManager.push(Scene_Battle);
        return { id: t, nom: $dataTroops[t].name, membres: $dataTroops[t].members.length };
    });
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Battle';
    }, null, { timeout: 30000 }).catch(function () {});
    await page.waitForTimeout(2500);
    verifie('le combat s ouvre', (await scene()) === 'Scene_Battle',
        'troupe ' + troupe.id + ' « ' + troupe.nom + ' » - ' + troupe.membres + ' ennemi(s)');
    await photo('07_combat');
    // Marteler Entree : attaquer, encaisser, jusqu a la victoire ou la defaite.
    var tours = 0;
    while (tours < 120 && (await scene()) === 'Scene_Battle') {
        await touche('Enter', 70); tours++;
    }
    await page.waitForTimeout(1200);
    var issue = await ev(function () {
        return { scene: SceneManager._scene.constructor.name, tour: $gameTroop ? $gameTroop.turnCount() : -1 };
    });
    verifie('le combat se joue et se termine', issue.scene !== 'Scene_Battle',
        issue.tour + ' tour(s) - retour sur ' + issue.scene);
    await photo('08_apres_combat');

    console.log('\n8) Le temps : MOG_TimeSystem, son horloge et le chrono');
    // Un plugin peut se charger sans rien faire. On ne regarde pas s'il est là :
    // on fait tourner l'horloge et on lit ce qu'elle a changé dans la partie.
    // On ne demande pas au plugin s'il est chargé : on lui demande QUELLES cases il
    // emploie, puis on lit ces cases-là. Un ID mal recopié se verrait aussitôt.
    var avant = await ev(function () {
        $gameSystem._time_sys_active = true;
        return { idMin: $gameSystem._min_variableId, idH: $gameSystem._hour_variableId,
                 min: $gameVariables._data[$gameSystem._min_variableId],
                 h: $gameVariables._data[$gameSystem._hour_variableId],
                 hud: !!SceneManager._scene.sprite_time_engine };
    });
    verifie('l horloge est dessinee sur la carte', avant.hud === true,
        'variables employées : minute ' + avant.idMin + ' · heure ' + avant.idH);
    verifie('le plugin emploie bien la plage libre 200+', avant.idH >= 200,
        'heure sur la variable ' + avant.idH);
    // Le temps n'avance pas pendant un événement ni un message : on laisse courir.
    await page.waitForTimeout(6000);
    var apres = await ev(function () {
        var s = [];
        for (var i = 200; i <= 230; i++) { if ($gameSwitches.value(i)) { s.push(i + ' ' + $dataSystem.switches[i]); } }
        return { min: $gameVariables._data[$gameSystem._min_variableId],
                 h: $gameVariables._data[$gameSystem._hour_variableId],
                 jour: $gameVariables.value(201), annee: $gameVariables.value(202),
                 phases: s, teinte: $gameScreen.tone().join(',') };
    });
    verifie('le temps avance tout seul', apres.min !== avant.min || apres.h !== avant.h,
        avant.h + 'h' + avant.min + '  ->  ' + apres.h + 'h' + apres.min);
    verifie('les interrupteurs de phase, de jour et de saison basculent', apres.phases.length >= 3,
        apres.phases.join(' · '));
    verifie('la date est posee dans les variables 201 et 202', apres.jour >= 1 && apres.annee >= 1,
        'jour ' + apres.jour + ' · année ' + apres.annee + ' · teinte ' + apres.teinte);
    await photo('09_horloge');
    // Le chrono : MOG_VisualTimer ne lance rien, il DESSINE le minuteur de MV.
    // On le lance donc comme un événement le fait, puis on regarde s'il s'affiche.
    var chrono = await ev(function () {
        $gameTimer.start(30 * 60);
        return { actif: $gameTimer.isWorking(), reste: $gameTimer.seconds(),
                 dessine: !!$gameSystem._timerGauge && $gameSystem._timerGauge.enabled === true };
    });
    verifie('le minuteur de MV tourne', chrono.actif === true, chrono.reste + ' secondes');
    verifie('MOG_VisualTimer le prend en charge', chrono.dessine === true);
    await page.waitForTimeout(1500);
    await photo('10_chrono');
    await ev(function () { $gameTimer.stop(); });

    // La moitié visible du système : la nuit doit assombrir l'écran.
    // On pousse l'heure à 22h et on lit la teinte que le moteur applique.
    await ev(function () { $gameSystem.set_hour(22); });
    await page.waitForTimeout(3500);
    var nuit = await ev(function () {
        return { teinte: $gameScreen.tone(), nuit: $gameSwitches.value(205),
                 h: $gameVariables._data[$gameSystem._hour_variableId] };
    });
    verifie('la nuit assombrit l ecran', nuit.teinte[0] < -20,
        nuit.h + 'h · teinte ' + nuit.teinte.join(',') + ' · interrupteur « TS · Nuit » ' + (nuit.nuit ? 'levé' : 'baissé'));
    await photo('11_nuit');

    console.log('\n9) Le bilan du moteur');
    verifie('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 6).join(' | ') || 'rien');
    verifie('aucune ressource manquante', absents.length === 0,
        absents.length ? absents.length + ' : ' + absents.slice(0, 6).join(' | ') : 'rien');

    await nav.close();
    console.log('\n' + '='.repeat(70));
    console.log('  ' + ok + ' controles passes - ' + ko + ' echec(s)');
    console.log('='.repeat(70));
    process.exit(ko ? 1 : 0);
})();
