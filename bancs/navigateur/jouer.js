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
    verifie('tous les plugins actifs sont charges', pasCharges.length === 0,
        plugins.declares.length + ' declares - ' + plugins.charges.length + ' charges' +
        (pasCharges.length ? ' - MANQUENT : ' + pasCharges.join(', ') : ''));
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
    // Chaque plugin qui ajoute une commande allonge la liste, et la fenêtre du
    // temps est posée à une hauteur fixe. Deux fenêtres qui se recouvrent ne
    // lèvent aucune erreur : elles se dessinent l'une sur l'autre, en silence.
    var menu = await ev(function () {
        var s = SceneManager._scene, c = s._commandWindow, t = null;
        for (var k in s) {
            if (s[k] && s[k].constructor && /Time/.test(s[k].constructor.name) && s[k].width !== undefined && s[k].visible) {
                t = { x: s[k].x, y: s[k].y, w: s[k].width, h: s[k].height };
            }
        }
        return { cmds: c._list.map(function (x) { return x.name; }),
                 cmd: { x: c.x, y: c.y, w: c.width, h: c.height },
                 or: s._goldWindow ? { x: s._goldWindow.x, y: s._goldWindow.y, w: s._goldWindow.width, h: s._goldWindow.height } : null,
                 temps: t, ecran: [Graphics.boxWidth, Graphics.boxHeight] };
    });
    function chevauche(a, b) {
        if (!a || !b) { return false; }
        return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
    }
    verifie('les commandes du menu tiennent a l ecran',
        menu.cmd.y + menu.cmd.h <= menu.ecran[1],
        menu.cmds.length + ' commandes : ' + menu.cmds.join(' · '));
    // « tenir a l ecran » ne suffit pas : la fenetre peut etre a l ecran et
    // n en montrer que huit sur onze. On compte les rangees reellement offertes.
    var rangees = await ev(function () { var c = SceneManager._scene._commandWindow; return { vues: c.maxPageItems(), total: c.maxItems() }; });
    verifie('toutes les commandes se voient sans faire defiler', rangees.vues >= rangees.total,
        rangees.vues + ' rangees offertes pour ' + rangees.total + ' commandes');
    verifie('aucune fenetre du menu n en recouvre une autre',
        !chevauche(menu.cmd, menu.temps) && !chevauche(menu.cmd, menu.or) && !chevauche(menu.temps, menu.or),
        'commandes ' + JSON.stringify(menu.cmd) + ' · temps ' + JSON.stringify(menu.temps) + ' · or ' + JSON.stringify(menu.or));
    // On ne devine pas ce qui « a l'air anglais » : « Options » et « Formation »
    // sont les termes français que JOKO a lui-même écrits dans System.json, et
    // un contrôle qui les accuse ne mesure rien. On vise nommément les libellés
    // que les plugins posent par défaut, et qu'il faut avoir traduits.
    var ANGLAIS = ['Quest', 'Patch Notes', 'Music Book', 'Debug', 'Common Event 1', 'Item', 'Skill', 'Equip', 'Status', 'Save', 'Game End'];
    var restes = menu.cmds.filter(function (n) { return ANGLAIS.indexOf(n) >= 0; });
    verifie('aucun libelle par defaut de plugin n est reste en anglais', restes.length === 0,
        restes.length ? 'reste : ' + restes.join(' · ') : menu.cmds.join(' · '));
    // Le Codex est un fichier ouvert par YEP_PatchNotes. Le plugin ne verifie
    // rien : si le chemin est faux, le joueur clique et rien ne s ouvre.
    // On demande donc au plugin l URL qu il construirait, et on la va chercher.
    var codex = await ev(function () {
        return { fichier: Yanfly.Param.PatchNotesFilename, url: Yanfly.getPatchFileUrl(),
                 commande: Yanfly.Param.PatchCmd };
    });
    var rep = await page.request.get(BASE + '/' + codex.fichier).catch(function () { return null; });
    verifie('le Codex des Trois Sources est bien la ou le menu l envoie',
        !!rep && rep.status() === 200,
        '« ' + codex.commande +' » -> ' + codex.fichier + ' (HTTP ' + (rep ? rep.status() : 'injoignable') + ')');
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
    // Deux plugins reglent l opacite des fenetres, et Aries002 charge APRES
    // YEP_CoreEngine : c est le sien qui gagne. On lit donc la valeur que la
    // fenetre porte vraiment, pas celle qu on croit avoir reglee.
    var fen = await ev(function () {
        var w = SceneManager._scene._itemWindow;
        return { opacite: w.backOpacity, colonnes: w.maxCols(), largeur: w.width,
                 nomLePlusLong: $gameParty.leader().skills().reduce(function (a, s) { return s.name.length > a.length ? s.name : a; }, '') };
    });
    verifie('les fenetres sont bien a l opacite voulue', fen.opacite === 240,
        'backOpacity = ' + fen.opacite + ' (si ce n est pas 240, un plugin charge plus tard l a ecrase)');
    verifie('la liste des competences tient sur une colonne', fen.colonnes === 1,
        fen.colonnes + ' colonne(s) sur ' + fen.largeur + 'px · nom le plus long : « ' + fen.nomLePlusLong + ' »');
    await photo('05_competences');
    await ev(function () { SceneManager.goto(Scene_Equip); });
    await page.waitForTimeout(1400);
    verifie('l ecran d equipement s ouvre', (await scene()) === 'Scene_Equip',
        await ev(function () { return $gameParty.leader().equipSlots().length + ' emplacements'; }));
    await photo('06_equipement');
    await ev(function () { SceneManager.goto(Scene_Map); });
    await page.waitForTimeout(1200);

    console.log('\n6b) Les ecrans du systeme de mana');
    // Un plugin peut se charger sans rien faire. Ces deux ecrans sont la preuve
    // que le systeme de mana tourne : on les ouvre et on lit ce qu ils affichent.
    var mana = await ev(function () {
        return { elements: typeof Scene_MvxElements !== 'undefined',
                 triangle: typeof Scene_Triangle !== 'undefined',
                 paroles: typeof Paroles !== 'undefined' && typeof Paroles.tenue === 'function',
                 voies: typeof window.Voies !== 'undefined',
                 fusion: typeof window.Fusion !== 'undefined' };
    });
    verifie('les espaces de noms du systeme de mana sont poses',
        mana.elements && mana.triangle && mana.paroles && mana.voies && mana.fusion,
        'Scene_MvxElements ' + mana.elements + ' · Scene_Triangle ' + mana.triangle +
        ' · Paroles.tenue ' + mana.paroles + ' · Voies ' + mana.voies + ' · Fusion ' + mana.fusion);
    // On compare la scene a la CLASSE, pas a son nom : VisualMaxEX declare
    // « Scene_MvxElementsClass » en interne, et un controle qui attend
    // « Scene_MvxElements » accuse un ecran qui marche tres bien.
    await ev(function () { SceneManager.goto(Scene_MvxElements); });
    await page.waitForTimeout(1600);
    verifie('l ecran des Elements s ouvre',
        await ev(function () { return SceneManager._scene instanceof Scene_MvxElements; }),
        await scene());
    await photo('13_elements');
    // Le cycle pierre-feuille-ciseaux a ete SUPPRIME par ManaAffinity v2.0
    // (« l avantage vient des ARTS et des CHUTES, pas d un cycle entre
    // branches »). L ecran ne doit plus l annoncer : sinon il enseigne au
    // joueur une regle qui n existe plus. On lit le bandeau d aide LA, sur
    // l ecran des Elements — pas apres en avoir change.
    var bandeau = await ev(function () {
        var s = SceneManager._scene;
        var t = (s._help && s._help._text) ? String(s._help._text) : '';
        var lignes = [];
        if (s._list && s._list._data) { lignes = s._list._data.slice(0, 8).map(function (x) { return String(x && x.desc || ''); }); }
        return t + ' ‖ ' + lignes.join(' / ');
    });
    verifie('l ecran des Elements n annonce plus le cycle supprime',
        !/cycle de mana|fort vs|faible vs/i.test(bandeau),
        bandeau.slice(0, 110));
    await ev(function () { SceneManager.goto(Scene_Triangle); });
    await page.waitForTimeout(1600);
    verifie('l ecran du Triangle s ouvre',
        await ev(function () { return SceneManager._scene instanceof Scene_Triangle; }),
        await scene());
    await photo('14_triangle');
    await ev(function () { SceneManager.goto(Scene_Map); });
    await page.waitForTimeout(1400);

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
    // On s arrete une fois sur l ecran de fin de combat de YEP_VictoryAftermath :
    // c est la qu on verifie que ses libelles sont bien en francais.
    var tours = 0, vu = false;
    while (tours < 120 && (await scene()) === 'Scene_Battle') {
        if (!vu && (await ev(function () { return !!BattleManager._victoryPhase; }))) {
            vu = true; await page.waitForTimeout(1200); await photo('07b_victoire');
        }
        await touche('Enter', 70); tours++;
    }
    verifie('l ecran de fin de combat de Yanfly s affiche', vu === true);
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

    // Les 4 événements communs de saison guettaient les interrupteurs de la démo
    // (116-119). Repointés sur les nôtres (215-218), ils doivent réellement
    // partir : on lit la météo que MOG_Weather_EX a mise en route, pas le
    // numéro qu'on croit avoir écrit.
    var saison = await ev(function () {
        var s = {};
        for (var i = 215; i <= 218; i++) { s[i] = { nom: $dataSystem.switches[i], leve: $gameSwitches.value(i) }; }
        var gardiens = [60, 61, 62, 63].map(function (i) {
            return $dataCommonEvents[i] ? $dataCommonEvents[i].name + '->' + $dataCommonEvents[i].switchId : '?';
        });
        return { s: s, gardiens: gardiens, meteo: $gameSystem.weatherMode ? $gameSystem.weatherMode(0) : null };
    });
    verifie('les evenements de saison guettent bien nos interrupteurs',
        saison.gardiens.every(function (g) { var n = Number(g.split('->')[1]); return n >= 215 && n <= 218; }),
        saison.gardiens.join(' · '));
    // Et leur verrou maitre ne doit plus tomber sur un interrupteur de JOKO :
    // celui de la demo etait le 4, qui ici s appelle « combat boss1 ».
    var verrou = await ev(function () {
        var v = [];
        [60, 61, 62, 63].forEach(function (i) {
            var e = $dataCommonEvents[i]; if (!e) { return; }
            e.list.forEach(function (c) { if (c.code === 111 && c.parameters[0] === 0) { v.push(c.parameters[1]); } });
        });
        return { ids: v, nom: $dataSystem.switches[v[0]] };
    });
    verifie('le verrou maitre des saisons est sur une case a nous',
        verrou.ids.every(function (i) { return i >= 200; }),
        'interrupteur ' + verrou.ids.join('/') + ' « ' + verrou.nom + ' »');
    // La vraie preuve : on leve le verrou et on regarde si la meteo demarre.
    // Avant, weatherMode vaut -1 (aucune couche) ; apres, le mode de la saison.
    var avantMeteo = await ev(function () { return $gameSystem.weatherMode(0); });
    await ev(function (id) { $gameSwitches.setValue(id, true); }, verrou.ids[0]);
    await page.waitForTimeout(2500);
    var apresMeteo = await ev(function () { return $gameSystem.weatherMode(0); });
    verifie('le verrou leve, la saison lance vraiment sa meteo', apresMeteo > 0 && apresMeteo !== avantMeteo,
        'weatherMode(0) : ' + avantMeteo + ' -> ' + apresMeteo + ' · saison levee : ' +
        Object.keys(saison.s).filter(function (k) { return saison.s[k].leve; }).map(function (k) { return saison.s[k].nom; }).join(', '));
    verifie('verrou baisse, rien ne partait (contre-epreuve)', avantMeteo <= 0,
        'avant la levee, weatherMode(0) valait ' + avantMeteo);
    await photo('12_saison');

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
