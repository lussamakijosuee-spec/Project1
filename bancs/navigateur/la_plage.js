/*
 * LA PLAGE — le Village de Pêche, dans le vrai jeu (JOKO, 2026-11-09 : « Mer plutôt », le ponton
 * « tu le vois que le soir », « tout et développe au maximum » ; docs/LA_PLAGE.md)
 * ---------------------------------------------------------------------------
 *   ① la pêche selon l'heure, la saison et le temps (et la contre-épreuve : pas de Patriarche par beau temps) ;
 *   ② la caisse du fond (le Fil du Fond) : une partie sur dix, plus trois à six par étang ;
 *   ③ Annick achète la pêche, pas le Patriarche — par sa vraie page ;
 *   ④ le concours : le jour dit, la pesée contre Roul et Tobin, une fois — et pas un autre jour ;
 *   ⑤ ce que la mer ramène : chaque matin, une à trois choses ; ramassée, elle disparaît ; la même toute la journée ;
 *   ⑥ les bouteilles d'Élise et de Sora, jusqu'au bout, par leurs vraies pages ;
 *   ⑦ la collection de Sora ;
 *   ⑧ le masqué du ponton : le jour, personne ; le soir, une chose neuve par soir, la première de JOKO ; à
 *     chaque héros la sienne (Vesper, puis ludwing en tête : une autre) ;
 *   ⑨ Erwan, le Pêcheur, est enfin visible, avec sa pêche et son visage ;
 *   ⑩ midi sur le sable (et la contre-épreuve : sans la case du repas, ils retournent sur le pré) ;
 *   ⑪ Orin reste sous la pluie, Annick rentre ;
 *   ⑫ plus de « lac » à la plage ni au bar (et une phrase plantée exprès est attrapée) ;
 *   ⑬ les quêtes des ✎ : les lucioles chez Sora, jusqu'au bout ; le chant de la mer chez Orin ;
 *   ⑭ toutes les pages de la plage se parlent jusqu'au bout ; aucune erreur.
 *
 *   node bancs/navigateur/la_plage.js            (un serveur sur 8899 : npx http-server -p 8899 -c-1 .)
 */
'use strict';
var fs = require('fs'), path = require('path');
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var RACINE = path.join(__dirname, '..', '..');
var ok = 0, ko = 0;
function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
console.log('LA PLAGE');

/* ⑫ plus de « lac » (sur les cartes, hors du rêve d'Élise et de Théo, qui est derrière la faille) */
function lacs(cartes, plante) {
    var r = [];
    cartes.forEach(function (n) {
        var m = JSON.parse(fs.readFileSync(path.join(RACINE, 'data', 'Map' + String(n).padStart(3, '0') + '.json'), 'utf8'));
        if (plante && n === 33) m.events[24].pages[0].list.splice(3, 0, { code: 401, indent: 0, parameters: ['Le lac est calme ce matin.'] });
        m.events.forEach(function (e) {
            if (!e) return;
            // le « lac tout gris » d'Élise est son rêve de la faille (l'étang de derrière), pas la plage : il reste
            e.pages.forEach(function (p) { p.list.forEach(function (c) { var t = String(c.parameters[0]); if (c.code === 401 && /\blac\b/i.test(t) && !/lac tout gris/.test(t)) r.push(n + ':' + e.id + ' « ' + t + ' »'); }); });
        });
    });
    return r;
}
// à JOKO, pas à l'outil : la rumeur de Colin et la quête du couteau de Tobin (ses quêtes d'origine, rendues mot pour mot)
var A_JOKO = /le lac CHANTE|entends le lac chanter|« Lac du matin »/;     // et « Lac du matin », une encre de Pervenche (un nom)
var restes = lacs([33, 46, 30, 44]).filter(function (t) { return !A_JOKO.test(t); }), attrape = lacs([33], true).length > lacs([33]).length;
V('⑫ plus de « lac » à la plage, au bar, au Marché, à l\'auberge (et une phrase plantée est attrapée)', !restes.length && attrape, (restes.length ? restes.slice(0, 3).join(' · ') : 'aucun · la phrase plantée chez Annick est attrapée') + ' · deux phrases de JOKO gardées (la rumeur de Colin, le couteau de Tobin)');

(async function () {
    var nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = []; page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 160)); });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title'; }, null, { timeout: 120000 });
    await page.evaluate(function () {
        DataManager.setupNewGame();
        $gameSystem._meteo = { cle: '', type: 'clair', force: 'clair' };
        SceneManager.goto(Scene_Map);
        // une page, jouée à la main ; les choix pris par leur libellé (ou le n°)
        window.parler = function (ev, pg, o) {
            o = o || {};
            var it = new Game_Interpreter(); it.setup(pg.list, ev.eventId()); var n = 0, textes = [], menus = 0, faces = [];
            while (it.isRunning() && n < 8000) {
                if ($gameMessage.isBusy()) {
                    textes.push($gameMessage._texts.join(' ')); faces.push($gameMessage.faceName());
                    if ($gameMessage.isItemChoice()) $gameVariables.setValue($gameMessage.itemChoiceVariableId(), o.objet || 0);
                    if ($gameMessage.isChoice()) {
                        var l = $gameMessage.choices(), k = o.choisir ? o.choisir(l, menus++) : 0;
                        if (k < 0) k = 0;
                        textes.push('[' + l[k] + ']'); $gameMessage.onChoice(k);
                    }
                    $gameMessage.clear();
                }
                it.update(); $gameMap.events().forEach(function (e) { e.update(); if (e.isBalloonPlaying()) { e._balloonId = 0; e.endBalloon(); } }); $gameScreen.update(); n++;
            }
            // le texte lisible : sans les codes, sans le nom, une phrase coupée entre deux boîtes recollée
            var net = textes.join(' ').replace(/\\n<[^>]*>/g, ' ').replace(/\\[A-Za-z]+\[[^\]]*\]/g, '').replace(/\s+/g, ' ');
            return { fini: !it.isRunning(), texte: textes.join(' | '), net: net, faces: faces };
        };
        // dans les menus : ces libellés, dans l'ordre (le premier présent gagne), sinon « Au revoir »
        window.prendre = function (libelles) {
            var faits = {};
            return function (l) {
                for (var i = 0; i < libelles.length; i++) {
                    var x = libelles[i], k = l.indexOf(x);
                    if (k >= 0 && !faits[x]) { faits[x] = 1; return k; }
                    if (k < 0 && l.indexOf('Autre chose…') >= 0 && !faits[x] && !faits['ac' + x]) { faits['ac' + x] = 1; return l.indexOf('Autre chose…'); }
                }
                var r = l.indexOf('Au revoir'); return r >= 0 ? r : l.indexOf('Retour') >= 0 ? l.indexOf('Retour') : 0;
            };
        };
        window.ev = function (id) { return $gameMap.event(id); };
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && window.AlleesEtVenues && AlleesEtVenues.pret(); }, null, { timeout: 60000 });
    async function aller(h, mois, jour) {
        await page.evaluate(function (p) {
            if (p.mois) $gameSystem.set_month(p.mois); if (p.jour) $gameSystem.set_day(p.jour);
            $gameSystem.set_hour(p.h); $gameSystem.set_minute(0); $gamePlayer.requestMapReload(); $gamePlayer.reserveTransfer(p.c || 33, 20, 12, 2, 0);
        }, { h: h, mois: mois, jour: jour });
        await page.waitForFunction(function () { return $gameMap.mapId() === 33 && !$gamePlayer.isTransferring() && SceneManager._scene._spriteset && $gameMap._vieRecensee; }, null, { timeout: 60000 });
        await page.evaluate(function () { $gamePlayer.setThrough(true); });
    }

    /* ① la pêche */
    var peche = await page.evaluate(function () {
        function qui(h, saison, pluie) {
            $gameVariables._data[$gameSystem._season_variableId] = saison - 1;      // MOG compte la saison à part
            $gameSystem.set_hour(h); $gameSystem.set_minute(0);
            $gameScreen.changeWeather(pluie ? 'rain' : 'none', pluie ? 5 : 0, 0);
            return Plage.qui().map(function (f) { return f.id; });
        }
        var r = { matinPrintemps: qui(7, 1, false), nuit: qui(23, 1, false), aubeHiverPluie: qui(5, 4, true), aubeHiverSec: qui(5, 4, false), aubeEteSec: qui(5, 2, false) };
        $gameScreen.changeWeather('none', 0, 0);
        Plage.etang(); r.etang = $gameSystem.fishing.hole.fish.slice();
        return r;
    });
    V('① la pêche suit l\'heure, la saison et le temps', peche.matinPrintemps.indexOf(4) >= 0 && peche.matinPrintemps.indexOf(5) >= 0 && peche.nuit.indexOf(11) >= 0 && peche.nuit.indexOf(4) < 0 && peche.aubeHiverPluie.indexOf(12) >= 0 && peche.aubeHiverSec.indexOf(12) < 0 && peche.aubeEteSec.indexOf(12) < 0,
        'printemps 7 h : ' + peche.matinPrintemps.join(',') + ' · 23 h : ' + peche.nuit.join(',') + ' (le congre, pas la sardine) · aube d\'hiver sous la pluie : ' + peche.aubeHiverPluie.join(',') + ' (le Patriarche) · sans la pluie : ' + peche.aubeHiverSec.join(',') + ' (pas de Patriarche)');

    /* ② la caisse du fond */
    var caisse = await page.evaluate(function () {
        $gameSystem.set_hour(10); var avec = 0, verts = 0, N = 2000;
        for (var i = 0; i < N; i++) { Plage.etang(); var f = $gameSystem.fishing.hole.fish; if (f.indexOf(13) >= 0) avec++; if (f.indexOf(1) >= 0) verts++; }
        return { part: avec / N, verts: verts };
    });
    V('② la caisse du fond (le Fil du Fond) : une partie sur dix, et plus aucun poisson vert de matériau', caisse.part > 0.07 && caisse.part < 0.13 && caisse.verts === 0,
        Math.round(caisse.part * 1000) / 10 + ' % des étangs (10 % réglés ; avant : 3 à 6 Fils du Fond par étang) · étangs avec l\'ancien poisson vert : ' + caisse.verts);

    await aller(10, 1, 3);
    /* ⑨ Erwan */
    var erwan = await page.evaluate(function () {
        var e = ev(31), p = e.page();
        var r = { page: e._pageIndex, image: e.characterName(), op: e.opacity(), vie: e._vie && e._vie.metier };
        var l = p.list.map(function (c) { return c.code === 355 || c.code === 655 ? c.parameters[0] : ''; }).join('\n');
        r.peche = /Plage\.etang\(\)/.test(l) && /Galv\.FISH\.run\(\)/.test(l) && /viewStats/.test(l);
        var t = parler(e, p, { choisir: prendre([]) });
        r.fini = t.fini; r.visage = t.faces.indexOf('jkj') >= 0; r.texte = t.texte.slice(0, 90);
        return r;
    });
    V('⑨ Erwan, le Pêcheur, est enfin visible, avec sa pêche et son visage', erwan.page === 0 && erwan.image === 'jj' && erwan.op > 0 && erwan.peche && erwan.visage && erwan.fini && erwan.vie === 'sedentaire',
        'page ' + (erwan.page + 1) + ', image « ' + erwan.image + ' », ' + erwan.vie + ' · Pêcher → Plage.etang() puis Galv · visage jkj : ' + erwan.visage + ' · « ' + erwan.texte + '… »');

    /* ③ Annick achète */
    var annick = await page.evaluate(function () {
        $gameParty.gainItem($dataItems[117], 3); $gameParty.gainItem($dataItems[125], 1);
        var or0 = $gameParty.gold(), e = ev(24), t = parler(e, e.page(), { choisir: prendre(['Vendre ma pêche']) });
        return { gagne: $gameParty.gold() - or0, sardines: $gameParty.numItems($dataItems[117]), patriarche: $gameParty.numItems($dataItems[125]), texte: t.texte, fini: t.fini, v891: $gameVariables.value(891), v890: $gameVariables.value(890) };
    });
    V('③ Annick achète la pêche (au prix de la capitale), pas le Patriarche', annick.gagne === 36 && annick.sardines === 0 && annick.patriarche === 1 && annick.v891 === 36 && annick.v890 === 3 && /pièces/.test(annick.texte) && annick.fini,
        '3 sardines → ' + annick.gagne + ' pièces (12 × 3) · le Patriarche gardé : ' + annick.patriarche);

    /* ④ le concours */
    var concours = await page.evaluate(function () {
        var r = {};
        $gameSystem._season_interval[0] = 0; $gameSystem.set_day(3); $gameSystem.set_hour(10);
        r.pasLeJour = Plage.concours(true);
        var e = ev(23); r.optionPasLeJour = /Le concours/.test(parler(e, e.page(), { choisir: prendre(['Le concours']) }).texte);
        $gameSystem._season_interval[0] = 1; $gameSystem.set_day(15); $gameSystem.set_hour(10);
        r.leJour = Plage.concours();
        Galv.FISH.addRecords(11, 120, 7.5);                       // un congre de 7,5 kg
        var or0 = $gameParty.gold();
        r.premier = parler(e, e.page(), { choisir: prendre(['Le concours']) }).texte;
        r.gain = $gameParty.gold() - or0; r.rang = $gameVariables.value(893); r.poids = $gameVariables.value(892);
        r.deux = parler(e, e.page(), { choisir: prendre(['Le concours']) }).texte;
        r.gain2 = $gameParty.gold() - or0 - r.gain;
        return r;
    });
    V('④ le concours : le jour dit, la pesée contre Roul et Tobin, une seule fois', !concours.pasLeJour && !concours.optionPasLeJour && concours.leJour && concours.rang === 1 && concours.gain === 300 && concours.poids === 7500 && /grammes/.test(concours.premier) && /Déjà pesé/.test(concours.deux) && concours.gain2 === 0,
        'le 15 du 2e mois de la saison · un congre de 7,5 kg : rang ' + concours.rang + ', ' + concours.gain + ' pièces · la 2e pesée : « déjà pesé » · un autre jour : pas d\'option');

    /* ⑤ ce que la mer ramène */
    await aller(8, 4, 1);
    var mer = await page.evaluate(function () {
        function poses() { return $gameMap.events().filter(function (e) { return /^🌊/.test(e.event().name) && e._pageIndex === 1; }).map(function (e) { return e.eventId(); }); }
        var r = { avant: poses(), etat: JSON.stringify(Plage.etat().trouvailles) };
        var pas = r.avant.filter(function (id) { return Plage._mem().tPoses[id] !== 130; })[0] || r.avant[0];
        var e = ev(pas); var t = parler(e, e.page());
        $gameMap.refresh();
        r.objet = $gameVariables.value(896); r.texte = t.texte.slice(0, 80); r.apres = poses(); r.encore = $gameParty.numItems($dataItems[r.objet]);
        return r;
    });
    await aller(14, 4, 1);
    var memeJour = await page.evaluate(function () { return $gameMap.events().filter(function (e) { return /^🌊/.test(e.event().name) && e._pageIndex === 1; }).map(function (e) { return e.eventId(); }); });
    await aller(8, 4, 2);
    var lendemain = await page.evaluate(function () { return $gameMap.events().filter(function (e) { return /^🌊/.test(e.event().name) && e._pageIndex === 1; }).length; });
    V('⑤ ce que la mer ramène : chaque matin 1 à 3 choses, ramassée elle part, la même toute la journée', mer.avant.length >= 1 && mer.avant.length <= 3 && mer.objet > 0 && mer.encore === 1 && mer.apres.length === mer.avant.length - 1 && JSON.stringify(memeJour) === JSON.stringify(mer.apres) && lendemain >= 1,
        mer.avant.length + ' ce matin · ramassé : objet ' + mer.objet + ' (« ' + mer.texte + '… ») · à 14 h, les mêmes : ' + memeJour.join(',') + ' · le lendemain : ' + lendemain);

    /* ⑥ les bouteilles d'Élise et de Sora, jusqu'au bout */
    var bouteilles = [], finies = false;
    for (var tour = 0; tour < 7 && !finies; tour++) {
        await aller(9, 5, 3 + tour * 2);
        var r6 = await page.evaluate(function () {
            var b = $gameMap.events().filter(function (e) { return /^🌊/.test(e.event().name) && e._pageIndex === 1 && Plage._mem().tPoses[e.eventId()] === 130; })[0];
            if (!b && !$gameParty.hasItem($dataItems[130])) return { pasDeBouteille: true, etat: JSON.stringify(Plage._mem().lettres) };
            if (b) parler(b, b.page());
            var s = ev(19), t = parler(s, s.page(), { choisir: prendre(['La bouteille…']) });
            return { n: Plage.lettre(), a131: $gameParty.hasItem($dataItems[131]), a130: $gameParty.hasItem($dataItems[130]), texte: t.net };
        });
        if (r6.pasDeBouteille) { finies = true; bouteilles.push(r6); break; }
        // chez Élise, à la Ville Forestière
        await page.evaluate(function () { $gamePlayer.requestMapReload(); $gamePlayer.reserveTransfer(29, 20, 24, 2, 0); });
        await page.waitForFunction(function () { return $gameMap.mapId() === 29 && !$gamePlayer.isTransferring() && $gameMap._vieRecensee; }, null, { timeout: 60000 });
        r6.elise = await page.evaluate(function () { var e = ev(25), t = parler(e, e.page(), { choisir: prendre(['Une lettre de Sora']) }); return { texte: t.texte, n: Plage._mem().lettres.n, ou: Plage._mem().lettres.ou, a131: $gameParty.hasItem($dataItems[131]) }; });
        bouteilles.push(r6);
    }
    // un tour où Sora joue sa scène d'amitié (son rendez-vous passe avant le menu) : la bouteille attend le tour suivant
    var echanges = bouteilles.filter(function (b) { return b.elise && b.a131; });
    var mots = ['J\'EXISTE', 'Il saura nager', 'tout le monde fait semblant', 'Je le mets avec Papa', 'Ta copine aussi, Sora'];
    var chaqueLettre = echanges.length === 5 && echanges.every(function (b, i) { return b.texte.indexOf(mots[i]) >= 0 && b.a131 && !b.a130 && b.elise.n === i + 1 && !b.elise.a131; });
    if (!chaqueLettre) console.log('      (détail) ' + bouteilles.map(function (b) { return JSON.stringify({ n: b.n, a131: b.a131, a130: b.a130, elise: b.elise && { n: b.elise.n, ou: b.elise.ou }, t: (b.texte || '').slice(-140) }); }).join('\n      '));
    V('⑥ les bouteilles : Élise écrit, la mer apporte, Sora répond, on porte la réponse — cinq fois, puis plus rien', chaqueLettre && echanges[4].elise.ou === 'fini' && finies,
        echanges.length + ' échanges · ' + echanges.map(function (b, i) { return (i + 1) + ' « ' + mots[i] + ' » ' + (b.texte.indexOf(mots[i]) >= 0 ? '✓' : '✗'); }).join(' · ') + ' · après la 5e : ' + (finies ? 'plus de bouteille' : 'encore une'));

    /* ⑦ la collection de Sora */
    await aller(10, 6, 1);
    var sora = await page.evaluate(function () {
        var avant = $gameParty.numItems($dataItems[126]) + $gameParty.numItems($dataItems[127]);
        $gameParty.gainItem($dataItems[127], 1); $gameParty.gainItem($dataItems[126], 1);
        var s = ev(19), a = parler(s, s.page(), { choisir: prendre(['Un coquillage pour toi']) }).net;
        var b = parler(s, s.page(), { choisir: prendre(['Un coquillage pour toi']) }).net;
        return { violet: /VRAI violet/.test(a), petitGris: /Petit-Gris|Bulle/.test(b), n: $gameVariables.value(899), reste: $gameParty.numItems($dataItems[126]) + $gameParty.numItems($dataItems[127]), avant: avant, b: b.slice(-160) };
    });
    V('⑦ la collection de Sora : elle nomme ce que tu lui donnes, le violet d\'abord', sora.violet && sora.petitGris && sora.n === 2 && sora.reste === sora.avant, 'violet : ' + sora.violet + ' · le suivant nommé : ' + sora.petitGris + ' · ' + sora.n + ' coquillages donnés · il en reste ' + sora.reste + ' (avant : ' + sora.avant + ')' + (sora.petitGris ? '' : ' · « ' + sora.b + ' »'));

    /* ⑧ le masqué du ponton */
    await aller(12, 6, 2);
    var midi = await page.evaluate(function () { var e = ev(20); return { page: e._pageIndex, image: e.characterName() }; });
    await aller(19, 6, 2);
    var masque = await page.evaluate(function () {
        var e = ev(20), r = { page: e._pageIndex, image: e.characterName() };
        $gameParty._actors = [1, 3, 4, 2];
        r.soir1 = parler(e, e.page()).texte; r.soir1bis = parler(e, e.page()).texte;
        var d = Plage._mem().dono;
        function soirSuivant() { d.jour = d.jour - 1; }
        soirSuivant(); r.soir2 = parler(e, e.page()).texte;
        soirSuivant(); r.soir3 = parler(e, e.page()).texte;
        soirSuivant(); r.vesper = parler(e, e.page()).texte;
        d.n = 3; soirSuivant(); $gameParty._actors = [3, 1, 4, 2]; $gamePlayer.refresh();
        r.ludwing = parler(e, e.page()).texte;
        return r;
    });
    V('⑧ le masqué : le jour, personne ; le soir, la phrase de JOKO, puis une chose neuve par soir ; à chaque héros la sienne',
        midi.page === 0 && !midi.image && masque.page === 1 && masque.image === 'dono mmasque' && /tu la vois toi aussi \?/.test(masque.soir1) && !/tu la vois/.test(masque.soir1bis) && /Le niveau dit le Chapitre/.test(masque.soir2) && /ciel est par terre/.test(masque.soir3) && /voies d'art/.test(masque.vesper) && /runes de ton collier/.test(masque.ludwing),
        'midi : page ' + (midi.page + 1) + ' sans image · 19 h : « dono mmasque » · soir 1 : « ' + masque.soir1.slice(0, 40) + '… » · même soir : « ' + masque.soir1bis.slice(0, 40) + ' » · Vesper en tête : « voies d\'art » ; ludwing : « runes de ton collier »');

    /* ⑩ midi sur le sable */
    await page.evaluate(function () { $gameParty._actors = [1, 3, 4, 2]; $gamePlayer.refresh(); });
    await aller(11, 6, 5);
    async function poser(h) {
        await page.evaluate(function (h) { $gameSystem.set_hour(h); $gameSystem.set_minute(0); window.__n0 = Graphics.frameCount; window.__calme = 0; }, h);
        // ils ont fini d'y aller : personne ne bouge depuis deux secondes de jeu (120 images)
        await page.waitForFunction(function () {
            $gameSystem.set_minute(0);
            var bouge = $gameMap.events().some(function (e) { return e._vie && e.isMoving(); });
            window.__calme = bouge ? 0 : window.__calme + 1;
            return Graphics.frameCount - window.__n0 > 900 && window.__calme > 8;
        }, null, { timeout: 240000, polling: 250 }).catch(function () {});
    }
    function compter() {
        return page.evaluate(function () {
            var gens = $gameMap.events().filter(function (e) { return e._vie && !e._visite && e.opacity() > 0 && e._vie.metier !== 'garde' && e._vie.metier !== 'sedentaire'; });
            var milieu = gens[0] && gens[0]._vie.milieu, repas = gens[0] && gens[0]._vie.milieuRepas;
            function pres(c, d) { return c ? gens.filter(function (e) { return Math.abs(e.x - c.x) + Math.abs(e.y - c.y) <= d; }).length : 0; }
            return { place: pres(milieu, 4), sable: pres(repas, 6), n: gens.length, milieu: milieu, repas: repas };
        });
    }
    await poser(12);
    var repas = await compter();
    await page.evaluate(function () { $gameMap.events().forEach(function (e) { if (e._vie) e._vie.repas = null; }); });
    await poser(12);
    var sansRepas = await compter();
    V('⑩ midi sur le sable, plus serrés sur la place (contre-épreuve : sans la case du repas, ils y retournent)', repas.sable >= Math.min(5, repas.n - 1) && repas.place <= 2 && sansRepas.place >= 4,
        'à midi : ' + repas.sable + ' sur ' + repas.n + ' sur le sable (autour de ' + (repas.repas && repas.repas.x + ',' + repas.repas.y) + '), ' + repas.place + ' sur la place · sans le repas : ' + sansRepas.place + ' sur la place (' + (sansRepas.milieu && sansRepas.milieu.x + ',' + sansRepas.milieu.y) + ')');

    /* ⑪ Orin sous la pluie */
    await aller(10, 6, 6);
    await page.evaluate(function () { $gameScreen.changeWeather('rain', 5, 0); window.__n0 = Graphics.frameCount; });
    await page.waitForFunction(function () { var a = ev(24); return Graphics.frameCount - window.__n0 > 300 && a._vie && a._vie.dedans; }, null, { timeout: 180000, polling: 500 }).catch(function () {});
    var pluie = await page.evaluate(function () { var o = ev(17), a = ev(24); return { orin: !(o._vie && o._vie.dedans) && o.opacity() > 0, annick: !!(a._vie && a._vie.dedans) }; });
    await page.evaluate(function () { $gameScreen.changeWeather('none', 0, 0); });
    V('⑪ sous la pluie, Orin reste sous l\'auvent ; Annick rentre', pluie.orin && pluie.annick, 'Orin dehors : ' + pluie.orin + ' · Annick rentrée : ' + pluie.annick);

    /* ⑬ les quêtes des ✎ */
    var quetes = await page.evaluate(function () {
        var r = { ancien: $gameMap.events().filter(function (e) { return /^✎ (Fille|Vieux) du pêcheur|^✎ (Fille|Vieux) pêcheur/.test(e.event().name); }).length };
        var s = ev(19), o0 = $gameParty.gold();
        var a = parler(s, s.page(), { choisir: prendre(['Les lucioles de papa', 'Oui']) }).texte;
        r.active = $gameSystem.questStatus('lucioles');
        $gameParty.gainItem($dataItems[7], 2);
        var b = parler(s, s.page(), { choisir: prendre(['Les lucioles de papa']) }).texte;
        r.finie = $gameSystem.questStatus('lucioles'); r.appats = $gameParty.numItems($dataItems[111]); r.or = $gameParty.gold() - o0; r.b = b.slice(0, 300); r.bocaux = $gameParty.numItems($dataItems[7]);
        var o = ev(17), c = parler(o, o.page(), { choisir: prendre(['Le chant de la mer', 'Oui']) }).texte;
        r.chant = $gameSystem.questStatus('lac'); r.chantTexte = /La mer chante/.test(c);
        var rive = $gameMap.events().filter(function (e) { return e.event().name === '✎ Rive'; })[0];
        r.rive = rive && rive.event().pages[0].list.some(function (x) { return x.code === 401 && /de sous la mer/.test(x.parameters[0]); });
        return r;
    });
    V('⑬ les quêtes des ✎ : les lucioles chez Sora jusqu\'au bout, le chant de la mer chez Orin', quetes.ancien === 0 && quetes.active === 'active' && quetes.finie === 'done' && quetes.or === 150 && quetes.chant === 'active' && quetes.chantTexte && quetes.rive,
        'les ✎ : ' + quetes.ancien + ' · lucioles : ' + quetes.active + ' → ' + quetes.finie + ' (+' + quetes.or + ' pièces) · le chant : ' + quetes.chant + ' · la rive : « de sous la mer »' + (quetes.finie !== 'done' ? ' · [bocaux ' + quetes.bocaux + '] « ' + quetes.b + ' »' : ''));

    /* ⑭ toutes les pages de la plage, jusqu'au bout */
    var pages = await page.evaluate(function () {
        var ids = [16, 17, 18, 19, 22, 23, 24, 31, 43, 45], pas = [];
        [0, 2, 4].forEach(function (etape) {
            $gameVariables.setValue(889, etape);
            ids.forEach(function (id) {
                var e = ev(id); if (!e || e._pageIndex < 0) return;
                for (var k = 0; k < 3; k++) {
                    var t = parler(e, e.page(), { choisir: function (l, i) {
                        var ok = l.map(function (x, k) { return k; }).filter(function (k) { return !/^(Acheter du poisson|Pêcher|Voir mes prises)$/.test(l[k]); });
                        return i < 6 ? ok[Math.floor(Math.random() * ok.length)] : Math.max(0, l.indexOf('Au revoir'));
                    } });
                    if (!t.fini) pas.push(e.event().name + ' (étape ' + etape + ')');
                }
            });
        });
        $gameVariables.setValue(889, 0);
        return { pas: pas, n: ids.length * 9 };
    });
    V('⑭ toutes les pages de la plage se parlent jusqu\'au bout, à chaque étape', !pages.pas.length, pages.n + ' conversations' + (pages.pas.length ? ' · bloquées : ' + pages.pas.slice(0, 3).join(', ') : ''));
    V('aucune erreur JavaScript', !erreurs.length, erreurs.slice(0, 2).join(' | ') || 'rien');

    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
