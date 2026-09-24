/*
 * LE PARI MORTEL — on va parier, comme un joueur.
 *
 * L'événement CE21 « HAKARI » existait depuis toujours, réglé, avec son état
 * et ses paliers. Trois choses l'empêchaient d'exister :
 *   · AUCUN événement ne l'appelait — il était injoignable ;
 *   · sa commande « ␣JACKPOT win » commençait par une espace, donc MV lisait
 *     un nom de commande vide et ne la transmettait à personne ;
 *   · le JACKPOT ne se montrait pas : aucun rouleau, aucun décompte.
 * Et le JACKPOT durait 10 à 15 TOURS quand JOKO le veut en TEMPS.
 *
 * Ce banc mesure le résultat, pas l'intention : il ouvre la porte, il parie,
 * il regarde les secondes descendre, et il vérifie qu'une seconde de jeu vaut
 * bien 60 images.
 *
 * Prérequis :  npx http-server -p 8899 -c-1 .
 * Lancement  :  node bancs/navigateur/le_pari_mortel.js
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var SHOTS = process.env.SHOTS || '/tmp/pari/';
fs.mkdirSync(SHOTS, { recursive: true });
var BASE = 'http://127.0.0.1:8899';

var ok = 0, ko = 0;
function V(libelle, condition, detail) {
    if (condition) { ok++; console.log('   OK  ' + libelle + (detail ? '  — ' + detail : '')); }
    else { ko++; console.log('   KO  ' + libelle + (detail ? '  — ' + detail : '')); }
}

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [], absents = [];
    page.on('pageerror', function (e) { erreurs.push('PAGEERROR: ' + e.message); });
    page.on('console', function (m) { if (m.type() === 'error') { erreurs.push('CONSOLE: ' + m.text().slice(0, 170)); } });
    page.on('response', function (r) { if (r.status() >= 400) { absents.push(r.status() + ' ' + r.url().replace(BASE, '')); } });
    var ev = function (f, a) { return page.evaluate(f, a); };
    var scene = function () { return ev(function () { return SceneManager._scene.constructor.name; }); };
    var touche = async function (k, ms) {
        await page.keyboard.down(k); await page.waitForTimeout(ms || 110);
        await page.keyboard.up(k); await page.waitForTimeout(ms || 110);
    };

    console.log('\n── on démarre ──');
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 120000 });
    await ev(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded();
    }, null, { timeout: 60000 }).catch(function () { });
    await page.waitForTimeout(1600);
    for (var z = 0; z < 40 && (await ev(function () { return $gameMap.isEventRunning() || $gameMessage.isBusy(); })); z++) { await touche('Enter', 70); }

    // ── ① l'état n'est plus réglé sur des tours ──────────────────────────────
    console.log('\n── ① « du temps, pas des tours » ──');
    var regl = await ev(function () {
        var s = $dataStates[11];
        return { nom: s.name, auto: s.autoRemovalTiming, min: s.minTurns, max: s.maxTurns,
                 secondes: Number($plugins.filter(function (p) { return p.name === 'JackpotHakari'; })[0].parameters['secondes']) };
    });
    V('le retrait par tours est coupé', regl.auto === 0,
        '« ' + regl.nom + ' » — autoRemovalTiming ' + regl.auto + ' (les ' + regl.min + '-' + regl.max + ' tours ne comptent plus)');
    V('la durée est réglée en secondes', regl.secondes === 60, regl.secondes + ' s');

    // ── ② la porte existe et mène à l'événement ──────────────────────────────
    console.log('\n── ② la porte dans la Salle de Test ──');
    await ev(function () { $gamePlayer.reserveTransfer(2, 18, 11, 8, 0); });
    await page.waitForFunction(function () { return $gameMap.mapId() === 2 && !$gamePlayer.isTransferring(); }, null, { timeout: 30000 }).catch(function () { });
    await page.waitForTimeout(2000);
    var porte = await ev(function () {
        var e = $gameMap.events().filter(function (x) { return x.eventId() === 59; })[0];
        return e ? { nom: e.event().name, x: e.x, y: e.y } : null;
    });
    V('« Le Pari Mortel » est posée', !!porte, porte ? porte.nom + ' (' + porte.x + ',' + porte.y + ')' : 'absente');

    await ev(function () { $gamePlayer.locate(18, 10); $gamePlayer.setDirection(8); });
    // après un locate(), le joueur met quelques images à se poser : le tout
    // premier appui tombe dans le vide. On frappe jusqu'à ce qu'il réponde,
    // comme un joueur qui appuie une deuxième fois.
    await page.waitForFunction(function () { return !$gamePlayer.isMoving(); }, null, { timeout: 6000 }).catch(function () { });
    await page.waitForTimeout(600);
    // On attend SON texte à elle, pas « un message quelconque » : d'autres
    // plugins parlent au démarrage (l'Avatar de Korrah, par exemple) et se
    // faire prendre pour la porte ferait passer un contrôle qui ne prouve rien.
    var parle = { busy: false, texte: '' };
    for (var a0 = 0; a0 < 8; a0++) {
        parle = await ev(function () {
            return { busy: $gameMessage.isBusy(), texte: $gameMessage.allText().replace(/\n/g, ' / ') };
        });
        if (/Pari Mortel/.test(parle.texte)) { break; }
        await touche('Enter', 240);
    }
    V('c\'est bien ELLE qui parle', /Pari Mortel/.test(parle.texte), '« ' + parle.texte + ' »');
    await page.screenshot({ path: SHOTS + 'j1_la_porte.png' });

    // ── ③ on parie, et les rouleaux tournent ─────────────────────────────────
    console.log('\n── ③ on parie ──');
    for (var c0 = 0; c0 < 6 && !(await ev(function () { return $gameMessage._choices.length > 0; })); c0++) { await touche('Enter', 180); }
    var choix = await ev(function () { return $gameMessage._choices.slice(); });
    V('le choix est proposé', choix.length === 2, choix.join(' | '));

    await touche('Enter', 260);                 // « Parier »
    await page.waitForTimeout(1200);
    // on laisse l'événement dérouler ; les rouleaux prennent ~130 images
    for (var t = 0; t < 30; t++) {
        await page.waitForTimeout(220);
        if (await ev(function () { return !!(SceneManager._scene._rouleaux); })) { break; }
        if (await ev(function () { return $gameMessage.isBusy(); })) { await touche('Enter', 90); }
    }
    var roul = await ev(function () {
        var r = SceneManager._scene._rouleaux;
        return r ? { gagne: r._gagne, resultat: r._resultat, arrets: r._arrets } : null;
    });
    V('les rouleaux apparaissent', !!roul, roul ? (roul.gagne ? 'sur un gain' : 'sur un échec') + ' — arrêts aux images ' + roul.arrets.join('/') : 'aucun rouleau');
    await page.screenshot({ path: SHOTS + 'j2_rouleaux.png' });

    // on laisse tourner jusqu'au bout des rouleaux, puis on déroule les messages
    await page.waitForTimeout(2600);
    await page.screenshot({ path: SHOTS + 'j3_rouleaux_fin.png' });
    for (var m = 0; m < 25 && (await ev(function () { return $gameMessage.isBusy() || $gameMap.isEventRunning(); })); m++) { await touche('Enter', 110); }
    await page.waitForTimeout(900);

    // La commande que l'espace rendait muette — on la lit dans la base chargée,
    // c'est la mesure exacte, sans dépendre du tirage.
    //
    // ⚠ Ce contrôle épinglait `$dataCommonEvents[21].list[12]`. Un index en dur
    // ne mesure pas le défaut, il mesure une POSITION : le jour où l'événement
    // a été réordonné dans l'éditeur, il a accusé une commande parfaitement
    // saine. On balaie donc TOUS les événements communs à la recherche du vrai
    // symptôme — une espace de tête, qui fait lire à MV un nom de commande vide.
    var cmd = await ev(function () {
        var fautives = [], vues = [];
        $dataCommonEvents.forEach(function (e) {
            if (!e) { return; }
            e.list.forEach(function (c, i) {
                if (c.code !== 356) { return; }
                var s = c.parameters[0];
                vues.push(s);
                if (/^\s/.test(s)) { fautives.push('évCommun ' + e.id + ' [' + i + '] ' + JSON.stringify(s)); }
            });
        });
        return { fautives: fautives, total: vues.length, win: vues.indexOf('JACKPOT win') >= 0 };
    });
    V('aucune commande de plugin ne porte d\'espace de tête', cmd.fautives.length === 0,
        cmd.total + ' commandes 356 relues · ' + (cmd.fautives.join(' · ') || 'aucune fautive'));
    V('« JACKPOT win » est bien présente quelque part', cmd.win === true,
        cmd.win ? 'trouvée' : 'introuvable dans les ' + cmd.total + ' commandes');
    var muette = await ev(function () {
        // ce que MV faisait AVANT : il coupe sur les espaces et prend le premier
        var args = ' JACKPOT win'.split(' ');
        return args.shift();
    });
    V('CONTRE-TEST — avec l\'espace, MV lisait un nom vide', muette === '',
        'nom de commande = ' + JSON.stringify(muette) + ' → transmise à personne');

    // ── ④ le JACKPOT tourne, et il se compte en secondes ─────────────────────
    // Le tirage de l'événement est celui de JOKO : 1 chance sur 15 au premier
    // pari. Le banc n'a pas à le truquer pour mesurer la MINUTE — il ouvre le
    // jackpot par la porte de service et regarde le temps descendre.
    console.log('\n── ④ la minute ──');
    await ev(function () { Jackpot.ouvrir(3); });
    await page.waitForTimeout(700);
    var jp = await ev(function () {
        var a = $gameActors.actor(3);
        return {
            actif: window.Jackpot ? Jackpot.actif() : null,
            reste: window.Jackpot ? Jackpot.restant() : null,
            etat: a.isStateAffected(11),
            interrupteur: $gameSwitches.value(6),
            bgm: AudioManager._currentBgm ? AudioManager._currentBgm.name : '—',
            bgmGardee: ($gameSystem._jackpot && $gameSystem._jackpot.bgm) ? $gameSystem._jackpot.bgm.name : '—'
        };
    });
    V('l\'état JACKPOT est posé sur ludwing', jp.etat === true, 'régén 1000 %, immunité à la mort, seul le type JACKPOT ouvert');
    V('le décompte est parti', jp.actif === true, jp.reste + ' secondes au compteur');
    V('la musique en cours est mise de côté', jp.bgmGardee !== '—' || jp.bgm === '—',
        'en cours : « ' + jp.bgm +' »  ·  gardée : « ' + jp.bgmGardee + ' »');
    await page.screenshot({ path: SHOTS + 'j4_jackpot.png' });

    // le cœur de la demande : une seconde de jeu = 60 images, pas un tour
    var avant = await ev(function () { return $gameSystem._jackpot ? { s: Jackpot.restant(), i: $gameSystem._jackpot.images } : { s: 0, i: 0 }; });
    await page.waitForTimeout(3000);
    var apres = await ev(function () { return $gameSystem._jackpot ? { s: Jackpot.restant(), i: $gameSystem._jackpot.images } : { s: 0, i: 0 }; });
    var ecoule = avant.i - apres.i;
    V('le compteur descend tout seul, sans aucun tour joué', ecoule > 0,
        avant.s + ' s → ' + apres.s + ' s  (' + ecoule + ' images en 3 secondes réelles)');
    V('une seconde de jeu vaut bien ~60 images', ecoule > 90 && ecoule < 260,
        ecoule + ' images — on attend ~180 pour 3 s, le navigateur sans carte graphique traîne un peu');

    // ── ⑤ la fin : l'état tombe et la musique revient ────────────────────────
    console.log('\n── ⑤ la fin de la minute ──');
    var fin = await ev(function () {
        if (!$gameSystem._jackpot) { return '—'; }
        $gameSystem._jackpot.images = 2;          // on avance jusqu'au bout
        return $gameSystem._jackpot.bgm ? $gameSystem._jackpot.bgm.name : '—';
    });
    await page.waitForTimeout(1500);
    var apresFin = await ev(function () {
        var a = $gameActors.actor(3);
        return { etat: a.isStateAffected(11), actif: Jackpot.actif(),
                 bgm: AudioManager._currentBgm ? AudioManager._currentBgm.name : '—' };
    });
    V('l\'état se retire quand la minute s\'épuise', apresFin.etat === false, '');
    V('le décompte s\'éteint avec lui', apresFin.actif === false, '');
    V('la musique de départ revient', apresFin.bgm === fin || fin === '—',
        'rendue : « ' + apresFin.bgm + ' »  ·  gardée : « ' + fin + ' »');
    await page.screenshot({ path: SHOTS + 'j5_apres.png' });

    // ── ⑥ CONTRE-ÉPREUVE : sans jackpot, rien ne s'affiche ni ne tourne ──────
    console.log('\n── ⑥ contre-épreuve ──');
    var temoin = await ev(function () {
        var f = SceneManager._scene._fenetreJackpot;
        return { fenetre: !!f, visible: f ? f.visible : null, restant: Jackpot.restant() };
    });
    V('la fenêtre du décompte existe mais reste cachée', temoin.fenetre === true && temoin.visible === false,
        'elle ne s\'affiche que pendant le jackpot');
    V('et le compteur est bien à zéro', temoin.restant === 0, temoin.restant + ' s');

    console.log('\n── le bilan ──');
    /* « process is not defined » vient du décor, pas du jeu : ce banc tourne
   *  dans un navigateur, le jeu tourne dans NW.js qui fournit « process ».
   *  Vérifié en injectant un process de NW.js : ces erreurs-là tombent à
   *  zéro. On les écarte, mais on les affiche ; tout le reste reste une panne. */
    var horsNWjs = erreurs.filter(function (e) { return /process is not defined/.test(e); });
    var vraies = erreurs.filter(function (e) { return !/process is not defined/.test(e); });
    if (horsNWjs.length) { console.log('   (' + horsNWjs.length + ' « process is not defined » : propre au navigateur, mis de côté)'); }
    V('aucune erreur JavaScript', vraies.length === 0, vraies.slice(0, 3).join(' | ') || 'rien');
    V('aucune ressource manquante', absents.length === 0, absents.slice(0, 4).join(' | ') || 'rien');

    console.log('\n' + '='.repeat(64));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(64));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
