/*
 * LE CARNET DE COMMANDES DIT-IL VRAI ?
 * ---------------------------------------------------------------------------
 * docs/COMMANDES_DU_JEU.md annonce plus de cent commandes. Elles ont été
 * tirées du code, pas d'une documentation — mais « tirées du code » n'est pas
 * « vérifiées ». Un carnet où une commande sur dix ne marche pas est pire
 * qu'un carnet vide : JOKO passerait une soirée à chercher pourquoi son
 * événement ne fait rien.
 *
 * Alors on ouvre le jeu et on TIRE les commandes, pour de vrai, en regardant
 * ce qui change dans le moteur.
 *
 * ⚠ Et on le fait DANS LES DEUX SENS. Vérifier que les bonnes marchent ne
 *   prouve rien tout seul : si le moteur avalait n'importe quoi sans rien
 *   faire, le contrôle serait vert pareil. On tire donc aussi des commandes
 *   que personne n'écoute, et elles ne doivent RIEN changer.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/le_carnet_dit_vrai.js
 */
'use strict';
var { chromium } = require('playwright');
var path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push('PAGEERROR: ' + e.message.slice(0, 130)); });
    page.on('console', function (m) { if (m.type() === 'error') { erreurs.push('CONSOLE: ' + m.text().slice(0, 130)); } });

    var ok = 0, ko = 0;
    var V = function (l, c, d) {
        if (c) { ok++; console.log('   OK  ' + l + (d ? '  — ' + d : '')); }
        else { ko++; console.log('   KO  ' + l + (d ? '  — ' + d : '')); }
    };
    var ev = function (f, a) { return page.evaluate(f, a); };

    console.log('=== LE CARNET DIT-IL VRAI ? ===\n');
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 120000 });
    await ev(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () {
        return SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Map'
            && !SceneManager.isSceneChanging();
    }, null, { timeout: 40000 });
    await page.waitForTimeout(1800);

    /* On tire la commande comme un événement le ferait : MV découpe la ligne
     * sur les espaces, le premier morceau est le nom, le reste les arguments.
     * C'est exactement ce que fait Game_Interpreter.command356. */
    /* ⚠ Appeler pluginCommand() directement ne suffit PAS. Certains plugins
     *   (YEP_PictureSpritesheets) relisent la ligne entière dans
     *   `this._params[0]`, que le moteur remplit dans executeCommand avant
     *   d'appeler pluginCommand. Sans ça, ils plantent sur un `undefined` —
     *   et mon banc a d'abord accusé toutes les commandes du carnet, y compris
     *   les mortes, d'une panne qui n'existait que dans le banc.
     *   On reproduit donc le contexte exactement : _params porte la ligne. */
    async function tirer(ligne) {
        return await ev(function (l) {
            var args = String(l).split(' ');
            var cmd = args.shift();
            var it = new Game_Interpreter();
            it.setup([{ code: 356, indent: 0, parameters: [l] }], 0);
            it._params = [l];
            it._index = 0;
            try { it.pluginCommand(cmd, args); return { ok: true, cmd: cmd }; }
            catch (e) { return { ok: false, cmd: cmd, erreur: String(e.message).slice(0, 90) }; }
        }, ligne);
    }
    /* Une empreinte de l'état du moteur : ce qui bouge quand une commande
     * fait quelque chose. On compare avant / après. */
    function empreinte() {
        return ev(function () {
            var s = SceneManager._scene;
            return JSON.stringify({
                vars: ($gameVariables && $gameVariables._data || []).join(','),
                sws: ($gameSwitches && $gameSwitches._data || []).join(','),
                or: $gameParty.gold(),
                meteo: $gameScreen.weatherType() + '/' + $gameScreen.weatherPower(),
                heure: (typeof $gameSystem.hour === 'function') ? $gameSystem.hour() : null,
                enfants: s._spriteset ? s._spriteset.children.length : 0,
                systeme: Object.keys($gameSystem).length
            });
        });
    }

    console.log('1) Des commandes que le carnet annonce comme vivantes');
    /* Choisies pour être SANS DANGER : elles changent un état qu'on peut
     * lire, et rien qui abîme une sauvegarde. */
    var vivantes = [
        ['GainGold 777', 'YEP_CoreEngine'],
        ['show_compass', 'MOG_Compass'],
        ['clear_all_weathers', 'MOG_Weather_EX'],
        ['weather : 0 : 15 : 30 : 100 : 0 : Cloud_01A', 'MOG_Weather_EX'],
        ['DOMAINE ouvrir 3', 'RoyaumeImperial'],
        ['hide_compass', 'MOG_Compass']
    ];
    var reconnues = 0, plantees = [];
    for (var i = 0; i < vivantes.length; i++) {
        var avant = await empreinte();
        var r = await tirer(vivantes[i][0]);
        await page.waitForTimeout(450);
        var apres = await empreinte();
        var bouge = avant !== apres;
        if (!r.ok) { plantees.push(vivantes[i][0] + ' → ' + r.erreur); }
        else if (bouge) { reconnues++; }
        console.log('      ' + vivantes[i][0].padEnd(46) +
            (!r.ok ? '✘ plante : ' + r.erreur : (bouge ? '✔ le moteur bouge' : '· rien de visible')) +
            '   (' + vivantes[i][1] + ')');
    }
    V('aucune commande du carnet ne plante', plantees.length === 0, plantees.join(' | ') || 'aucune');
    V('la plupart changent quelque chose dans le moteur', reconnues >= 4,
        reconnues + ' sur ' + vivantes.length + ' font bouger l\'état');

    console.log('\n2) LA CONTRE-ÉPREUVE : des commandes que personne n\'écoute');
    /* ⚠ 2026-10-02 : les « sept mortes » du 19 septembre (NPC, AME, CHUTE,
     *   FEU, TEMPS, FORGE, MARQUE) ont toutes trouvé preneur le 25
     *   (EvenementsUtiles, JadeEntitePlunging, MarqueVivante) — le banc les
     *   accusait de bouger. La contre-épreuve garde son rôle avec ce qui est
     *   muet AUJOURD'HUI : un nom qu'aucun plugin n'écoute, et ces vraies
     *   commandes précédées d'une espace (MV perd alors le nom, cf. §3). */
    var mortes = ['PERSONNE_NECOUTE 1', 'XYZ ouvrir', ' FEU repos', ' TEMPS nuit', ' FORGE', ' GainGold 500'];
    var remuantes = [];
    for (var j = 0; j < mortes.length; j++) {
        var av = await empreinte();
        var rr = await tirer(mortes[j]);
        await page.waitForTimeout(350);
        var ap = await empreinte();
        if (av !== ap) { remuantes.push(mortes[j]); }
        console.log('      ' + JSON.stringify(mortes[j]).padEnd(26) +
            (!rr.ok ? '✘ plante : ' + rr.erreur : (av !== ap ? '⚠ ÇA BOUGE — elle n\'est pas morte' : '· rien, comme annoncé')));
    }
    V('les commandes que personne n\'écoute ne font vraiment rien', remuantes.length === 0,
        remuantes.join(', ') || mortes.length + ' tirées, toutes muettes');

    console.log('\n3) Le piège de l\'espace en tête');
    /* On démontre le défaut que le carnet met en garde : MV découpe sur les
     * espaces et jette le premier morceau. Avec une espace devant, ce morceau
     * est vide — le nom de la commande est perdu. */
    var espace = await ev(function () {
        var avec = ' GainGold 500'.split(' ');
        var nomAvec = avec.shift();
        var sans = 'GainGold 500'.split(' ');
        var nomSans = sans.shift();
        return { avec: nomAvec, sans: nomSans, argsAvec: avec.join('|') };
    });
    console.log('      « GainGold 500 »  → nom lu : « ' + espace.sans + ' »');
    console.log('      «  GainGold 500 » → nom lu : « ' + espace.avec + ' »   args : ' + espace.argsAvec);
    V('une espace en tête vide bien le nom de la commande',
        espace.avec === '' && espace.sans === 'GainGold',
        '« ' + espace.avec + ' » contre « ' + espace.sans + ' »');

    console.log('\n4) Le bilan');
    var horsNWjs = erreurs.filter(function (e) { return /process is not defined/.test(e); });
    var vraies = erreurs.filter(function (e) { return !/process is not defined/.test(e); });
    if (horsNWjs.length) { console.log('   (' + horsNWjs.length + ' « process is not defined » : propre au navigateur, mis de côté)'); }
    V('aucune erreur JavaScript pendant les tirs', vraies.length === 0, vraies.slice(0, 3).join(' | ') || 'rien');

    console.log('\n' + '='.repeat(66));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
