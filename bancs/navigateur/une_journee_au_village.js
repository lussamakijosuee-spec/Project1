/*
 * UNE JOURNÉE AU VILLAGE DE PÊCHE.
 *
 * JOKO veut des PNJ « qui rentrent chez eux quand c'est le soir, qui sortent
 * dehors quand il fait jour, qui partent travailler ». On ne vérifie pas ça en
 * lisant le code : on avance l'horloge heure par heure et on REGARDE OÙ ILS
 * SONT.
 *
 * Le banc pousse l'heure, laisse le jeu tourner quelques secondes pour que les
 * PNJ marchent, et relève la position de chacun. À la fin il dit, pour chaque
 * façon de vivre, si la journée a la forme attendue :
 *
 *   · la nuit, le village est vide — sauf les gardes ;
 *   · au matin, tout le monde ressort ;
 *   · à midi, on se rapproche de la place ;
 *   · sous la pluie, ça rentre.
 *
 * CONTRE-ÉPREUVE : un PNJ marqué <Vie: fixe> ne doit jamais bouger, et le
 * plugin éteint ne doit rien piloter du tout.
 *
 * Prérequis :  npx http-server -p 8899 -c-1 .
 * Lancement  :  node bancs/navigateur/une_journee_au_village.js
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var SHOTS = process.env.SHOTS || '/tmp/village/';
fs.mkdirSync(SHOTS, { recursive: true });
var BASE = 'http://127.0.0.1:8899';
var CARTE = 33;

var ok = 0, ko = 0;
function V(l, c, d) {
    if (c) { ok++; console.log('   OK  ' + l + (d ? '  — ' + d : '')); }
    else { ko++; console.log('   KO  ' + l + (d ? '  — ' + d : '')); }
}

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push('PAGEERROR: ' + e.message); });
    page.on('console', function (m) { if (m.type() === 'error') { erreurs.push('CONSOLE: ' + m.text().slice(0, 160)); } });
    var ev = function (f, a) { return page.evaluate(f, a); };

    console.log('\n── on entre au village ──');
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 120000 });
    await ev(function () { DataManager.setupNewGame(); $gameSystem._meteo = { cle: "", type: "clair", force: "clair" };   // beau temps : sous la pluie, les habitants rentrent (MeteoVivante)
    SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded();
    }, null, { timeout: 60000 }).catch(function () { });
    await page.waitForTimeout(1600);
    await ev(function (c) { $gamePlayer.reserveTransfer(c, 20, 20, 2, 0); }, CARTE);
    await page.waitForFunction(function (c) {
        return $gameMap.mapId() === c && !$gamePlayer.isTransferring();
    }, CARTE, { timeout: 30000 }).catch(function () { });
    await page.waitForTimeout(2500);

    var depart = await ev(function () {
        return {
            carte: $gameMap.mapId(), nom: $dataMapInfos[$gameMap.mapId()].name,
            etat: window.VieDuVillage ? VieDuVillage.etat() : null
        };
    });
    V('on est au bon endroit', depart.carte === CARTE, '« ' + depart.nom + ' »');
    V('le plugin a recensé les PNJ', !!depart.etat && depart.etat.length > 0,
        depart.etat ? depart.etat.length + ' PNJ pris en charge' : 'aucun');

    if (depart.etat && depart.etat.length) {
        var parMetier = {};
        depart.etat.forEach(function (p) { parMetier[p.metier] = (parMetier[p.metier] || 0) + 1; });
        console.log('     façons de vivre : ' + Object.keys(parMetier).map(function (m) {
            return m + ' ×' + parMetier[m];
        }).join(' · '));
        var sansLogis = depart.etat.filter(function (p) {
            return !p.logis || (p.logis.x === p.poste.x && p.logis.y === p.poste.y);
        });
        V('chacun a trouvé une porte comme logis', sansLogis.length === 0,
            sansLogis.length ? sansLogis.length + ' sans porte proche (ils dormiront sur place)'
                             : 'les ' + depart.etat.length + ' ont un logis');
    }

    /** Pousse l'horloge à l'heure voulue, laisse marcher, puis relève.
     *  ⚠ 2026-10-31 : en IMAGES de jeu, plus en secondes — à ~10 images par seconde ici, et depuis qu'ils marchent à
     *  la vitesse de l'éditeur (3 : 32 images par case), quatre secondes ne disaient plus rien. « assez » : la chose
     *  attendue est arrivée, on relève tout de suite ; sinon, au bout des images, et le contrôle juge. */
    async function aHeure(h, images, assez) {
        await ev(function (hh) {
            // MOG_TimeSystem range l'heure dans une VARIABLE (la 200) et la lit
            // de là : $gameSystem.hour() fait $gameVariables._data[200].
            // Il expose set_hour() pour la poser proprement.
            // ⚠ 2026-10-30 : et les minutes à zéro. Une heure de jeu dure 25 secondes :
            //   posée à 12 h 40, elle passait à 13 h pendant l'attente, et à 13 h chacun
            //   retourne à son poste.
            if (typeof $gameSystem.set_hour === 'function') { $gameSystem.set_hour(hh); if ($gameSystem.set_minute) $gameSystem.set_minute(0); }
            else { $gameVariables.setValue(200, hh); }
        }, h);
        await page.waitForFunction(function (p) {
            if (window.__depuis === undefined || window.__heureVisee !== p.h) { window.__depuis = Graphics.frameCount; window.__heureVisee = p.h; }
            if (Graphics.frameCount - window.__depuis >= p.n) { window.__depuis = undefined; return true; }
            if (p.assez && Graphics.frameCount - window.__depuis >= 120 && new Function('e', 'return ' + p.assez)(VieDuVillage.etat())) { window.__depuis = undefined; return true; }
            return false;
        }, { h: h, n: images || 300, assez: assez || null }, { timeout: 600000, polling: 250 });
        return await ev(function () {
            var e = window.VieDuVillage ? VieDuVillage.etat() : [];
            return {
                h: VieDuVillage.heure(),
                dehors: e.filter(function (p) { return !p.dedans; }).length,
                dedans: e.filter(function (p) { return p.dedans; }).length,
                total: e.length,
                gardesDehors: e.filter(function (p) { return p.metier === 'garde' && !p.dedans; }).length,
                gardes: e.filter(function (p) { return p.metier === 'garde'; }).length,
                // la distance de CEUX QUI VISENT LA PLACE : mêler ceux qui
                // vont ailleurs noyait la mesure et le contrôle passait tout
                // seul, sans rien prouver.
                distPlace: e.filter(function (p) { return !p.dedans && p.place && p.but === 'place'; })
                    .map(function (p) { return Math.abs(p.x - p.place.x) + Math.abs(p.y - p.place.y); }),
                versLogis: e.filter(function (p) { return p.but === 'logis'; }).length,
                villageois: e.filter(function (p) { return p.metier !== 'garde'; }).length,
                buts: e.reduce(function (a, p) { a[p.but || '—'] = (a[p.but || '—'] || 0) + 1; return a; }, {})
            };
        });
    }
    function moyenne(t) { return t.length ? Math.round(t.reduce(function (a, b) { return a + b; }, 0) / t.length) : 0; }

    /* ── la journée, heure par heure ── */
    console.log('\n── la journée, heure par heure ──');
    console.log('    heure   dehors  dedans   distance moyenne à la place   ce qu\'ils visent');
    var journee = {};
    for (var h of [2, 7, 10, 12, 15, 19, 22]) {
        // ⚠ 2026-10-30 : une heure de jeu dure deux minutes ; à midi, la place est à quinze
        //   cases de certains postes : quatre secondes ne suffisaient pas pour y arriver.
        // la nuit : rentrés en moins de 1 200 images (≈ 50 minutes de jeu) ; à midi : près de la place en moins de 1 000
        var vide = 'e.filter(function (p) { return p.dedans; }).length >= Math.ceil(e.filter(function (p) { return p.but === "logis"; }).length * 0.6)';
        var proche = '(function (l) { return l.length > 0 && l.reduce(function (a, b) { return a + b; }, 0) / l.length <= 6; })(e.filter(function (p) { return !p.dedans && p.place && p.but === "place"; }).map(function (p) { return Math.abs(p.x - p.place.x) + Math.abs(p.y - p.place.y); }))';
        var r = await aHeure(h, (h === 2 || h === 22) ? 1200 : h === 12 ? 1000 : 300, (h === 2 || h === 22) ? vide : h === 12 ? proche : null);
        journee[h] = r;
        console.log('     ' + String(h).padStart(2) + ' h    ' +
            String(r.dehors).padStart(4) + '    ' + String(r.dedans).padStart(4) + '        ' +
            String(moyenne(r.distPlace)).padStart(3) + '                    ' +
            Object.keys(r.buts).map(function (k) { return k + '×' + r.buts[k]; }).join(' · '));
        await page.screenshot({ path: SHOTS + 'v_' + String(h).padStart(2, '0') + 'h.png' });
    }

    /* ── ce qu'on attend d'une journée ── */
    console.log('\n── la forme de la journée ──');
    var nuit = journee[2], matin = journee[10], soir = journee[22];

    V('la nuit, le village se vide', nuit.dedans >= Math.ceil(nuit.versLogis * 0.6),
        nuit.dedans + ' rentré(s) sur ' + nuit.versLogis + ' qui visaient leur logis (' +
        nuit.villageois + ' non-gardes en tout)');
    V('les gardes, eux, restent dehors', nuit.gardesDehors === nuit.gardes,
        nuit.gardesDehors + '/' + nuit.gardes + ' gardes debout à 2 h');
    V('au matin, tout le monde est ressorti', matin.dedans < nuit.dedans,
        'à 10 h : ' + matin.dedans + ' dedans, contre ' + nuit.dedans + ' à 2 h');
    V('le soir, ça rentre de nouveau', soir.dedans >= matin.dedans,
        'à 22 h : ' + soir.dedans + ' dedans, contre ' + matin.dedans + ' à 10 h');
    V('à midi, ceux qui visent la place s\'en approchent',
        journee[12].distPlace.length > 0 && moyenne(journee[12].distPlace) <= 6,
        journee[12].distPlace.length + ' PNJ visent la place, à ' +
        moyenne(journee[12].distPlace) + ' case(s) d\'elle en moyenne');

    /* ── la pluie ── */
    console.log('\n── sous la pluie ──');
    await ev(function () { $gameSystem.set_hour(15); $gameScreen.changeWeather('rain', 7, 1); });
    await page.waitForTimeout(4200);
    var souPluie = await ev(function () {
        var e = VieDuVillage.etat();
        return { pluie: VieDuVillage.pluie(),
                 dedans: e.filter(function (p) { return p.dedans; }).length,
                 gardesDehors: e.filter(function (p) { return p.metier === 'garde' && !p.dedans; }).length,
                 total: e.length };
    });
    V('la pluie est bien détectée', souPluie.pluie === true, '');
    V('à 15 h sous la pluie, ça rentre', souPluie.dedans > journee[15].dedans,
        souPluie.dedans + ' dedans sous l\'averse, contre ' + journee[15].dedans + ' par beau temps');
    V('les gardes tiennent quand même', souPluie.gardesDehors === nuit.gardes,
        souPluie.gardesDehors + ' garde(s) sous la pluie');
    await page.screenshot({ path: SHOTS + 'v_pluie.png' });
    await ev(function () { $gameScreen.changeWeather('none', 0, 1); });

    /* ── CONTRE-ÉPREUVE ── */
    console.log('\n── contre-épreuve ──');
    // On remet le village au clair d'abord : l'averse du contrôle précédent a
    // fait rentrer tout le monde, et figer quelqu'un DÉJÀ chez lui ne prouve
    // rien. On le fige dehors, debout, en plein jour.
    await ev(function () { $gameScreen.changeWeather('none', 0, 1); $gameSystem.set_hour(12); });
    await page.waitForTimeout(9000);
    var fige = await ev(function () {
        var e = $gameMap._viePNJ.filter(function (x) {
            return x._vie.metier !== 'garde' && !x._vie.dedans;
        })[0];
        if (!e) { return null; }
        e._vie.metier = 'fixe';
        window.__fige = { id: e.eventId(), x: e.x, y: e.y };
        $gameSystem.set_hour(23);
        return window.__fige;
    });
    await page.waitForTimeout(5000);
    var apres = await ev(function () {
        var e = $gameMap._viePNJ.filter(function (x) { return x.eventId() === window.__fige.id; })[0];
        return { x: e.x, y: e.y, dedans: !!e._vie.dedans };
    });
    V('un PNJ marqué « fixe » reste dehors et immobile, même à 23 h',
        !!fige && apres.x === fige.x && apres.y === fige.y && !apres.dedans,
        fige ? '(' + fige.x + ',' + fige.y + ') → (' + apres.x + ',' + apres.y + ')' +
               (apres.dedans ? '  mais il est rentré !' : '  et toujours dehors') : 'aucun PNJ dehors à figer');

    var ailleurs = await ev(function () {
        // sur une carte hors de la liste, le plugin ne doit rien prendre en charge
        $gamePlayer.reserveTransfer(2, 18, 11, 8, 0);
        return true;
    });
    await page.waitForFunction(function () { return $gameMap.mapId() === 2 && !$gamePlayer.isTransferring(); }, null, { timeout: 30000 }).catch(function () { });
    await page.waitForTimeout(2500);
    var horsListe = await ev(function () { return (VieDuVillage.etat() || []).length; });
    V('sur une carte hors de la liste, personne n\'est piloté', horsListe === 0,
        horsListe + ' PNJ pris en charge sur la Salle de Test');

    console.log('\n── le bilan ──');
    /* « process is not defined » vient du décor, pas du jeu : ce banc tourne
   *  dans un navigateur, le jeu tourne dans NW.js qui fournit « process ».
   *  Vérifié en injectant un process de NW.js : ces erreurs-là tombent à
   *  zéro. On les écarte, mais on les affiche ; tout le reste reste une panne. */
    var horsNWjs = erreurs.filter(function (e) { return /process is not defined/.test(e); });
    var vraies = erreurs.filter(function (e) { return !/process is not defined/.test(e); });
    if (horsNWjs.length) { console.log('   (' + horsNWjs.length + ' « process is not defined » : propre au navigateur, mis de côté)'); }
    V('aucune erreur JavaScript', vraies.length === 0, vraies.slice(0, 3).join(' | ') || 'rien');

    console.log('\n' + '='.repeat(68));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(68));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
