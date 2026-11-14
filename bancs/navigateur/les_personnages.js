/*
 * LES PERSONNAGES — comme des OC (JOKO, 2026-10-30 : « Développe les
 * personnages vrai personnalité […] personnages du lore mais nouveau inspiré
 * du lore », puis « Comme des oc »)
 * ---------------------------------------------------------------------------
 * Les fiches de bancs/outils/habitants/oc/ s'ajoutent aux habitants : une
 * fiche de personnage en tête de page, ce qu'il dit selon où il est, ce qu'il
 * dit des autres, l'amitié par paliers et ses scènes, les cadeaux, son
 * anniversaire. On le vérifie dans le vrai jeu, dans les deux sens :
 *
 *   ① chaque fiche OC est écrite en tête de la page de son habitant, et les
 *     liens se répondent (si A parle de B, B parle de A) ;
 *   ② Hilde, à l'amitié 3, donne son rendez-vous (l'épicerie, le matin) ;
 *     en ville l'après-midi, rien ne se joue ; à l'épicerie le matin, la
 *     scène se joue, une seule fois, et l'amitié monte ;
 *   ③ Hilde à l'épicerie (<Est: 29:28>) est la même personne qu'en ville :
 *     même amitié — et Kaze, sur la page 2 du même événement, a la sienne ;
 *   ④ les cadeaux : adoré +2 et l'objet part ; un deuxième le même jour est
 *     refusé ; détesté, il est rendu et rien ne bouge ; son anniversaire, ×2 ;
 *   ⑤ « à côté » : Tomas près d'Élise est vu, loin d'elle non ;
 *   ⑥ « où il est » : au bar, Habitants.ici dit bar ; en ville, non ;
 *   ⑦ le crieur annonce l'anniversaire de Hilde le 12 avril, et pas le 13 ;
 *   ⑧ trop de choix : le menu de Margot passe par « Autre chose… » ;
 *   ⑨ toutes les pages des personnages se parlent jusqu'au bout, choix au
 *     hasard, cadeaux et scènes compris, sans une erreur ;
 *   ⑩ le jeu de Petit-Louis suit le triangle, et jamais à l'envers ;
 *   ⑪ Zéphyrin n'est là que la nuit de la Veillée ;
 *   ⑫ chaque rendez-vous d'amitié peut être tenu : à l'heure dite, sur la
 *     carte dite, la personne est là et visible (pas rentrée chez elle) ;
 *   ⑬ la situation (Aurevel, la faille de la grotte) est dans les pages, et
 *     personne ne dit plus qu'il n'y a pas de faille ici ;
 *   ⑭ ce que JOKO a voulu tel quel (bancs/outils/voulu.js) le reste : relancés,
 *     les deux outils n'y touchent pas — et sans la liste, ils y toucheraient ;
 *   ⑮ ses pages à lui (les 9 de la ville, sans leurs conversations) se parlent
 *     jusqu'au bout, sans une erreur.
 *
 * LES CARTES SONT À JOKO (2026-11-09, « Réadapte-le. Développe-le, améliore-le ») :
 * il retire des PNJ, reprend des numéros, garde des pages telles quelles. Le
 * banc ne demande donc qu'aux personnes ENCORE LÀ ce que l'outil y a écrit — la
 * règle de l'outil des habitants (bancs/outils/qui_est_la.js) —, et dit qui n'y
 * est plus. Ce qu'un absent portait (le jeu de Petit-Louis, la Veillée de
 * Zéphyrin, les anniversaires du crieur) se vérifie autrement : sa fiche jouée
 * telle que l'outil l'écrirait, ou la balise posée en mémoire sur quelqu'un
 * d'autre. Rien n'est écrit dans data/.
 *
 *   node bancs/navigateur/les_personnages.js
 */
'use strict';
var fs = require('fs'), path = require('path');
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var RACINE = path.join(__dirname, '..', '..');
var ok = 0, ko = 0;
function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }

/* ── ① sans navigateur : les fiches sont posées, les liens se répondent ── */
var DOS = path.join(RACINE, 'bancs', 'outils', 'habitants');
var OC = {};
fs.readdirSync(path.join(DOS, 'oc')).filter(function (f) { return /\.js$/.test(f); }).forEach(function (f) { Object.assign(OC, require(path.join(DOS, 'oc', f))); });
var Q = require(path.join(RACINE, 'bancs', 'outils', 'qui_est_la.js')), VOULU = Q.VOULU;
var FICHES = Q.fiches(), NOMS = {};
Object.keys(FICHES).forEach(function (k) { NOMS[k] = FICHES[k].nom; });
function carte(n) { return Q.carte(n); }
// qui est encore là, d'après la règle de l'outil (retiré, voulu tel quel, devenu quelqu'un d'autre, repris : pas là)
var ETATS = {};
function etat(k) { return ETATS[k] || (ETATS[k] = FICHES[k] ? Q.etat(FICHES[k]) : { la: false, pourquoi: 'aucune fiche' }); }
function estLa(k) { return etat(k).la; }
var sautes = [];
function SAUTE(t, d) { sautes.push(t); console.log('   · ' + t + '  —  ' + d); }
console.log('LES PERSONNAGES');
var parRaison = {};
Object.keys(OC).forEach(function (k) { if (!estLa(k)) (parRaison[etat(k).pourquoi] = parRaison[etat(k).pourquoi] || []).push(NOMS[k] + ' ' + k); });
console.log('   sur tes cartes : ' + Object.keys(OC).filter(estLa).length + ' personnages sur ' + Object.keys(OC).length + ' sont là');
Object.keys(parRaison).forEach(function (r) { console.log('     ⚑ ' + r + ' : ' + parRaison[r].join(', ')); });

/* ── ① sans navigateur : chaque personnage encore là a sa fiche ── */
function sansFicheDans(cles, lire) {
    return cles.filter(function (k) {
        var m = /^(\d+):(\d+)(?:\/(\d+))?$/.exec(k), e = lire(+m[1]).events[+m[2]], p = e && e.pages[(+m[3] || 1) - 1];
        return !p || !p.list.some(function (c) { return c.code === 108 && /^◆ FICHE · /.test(c.parameters[0]); });
    });
}
var laOC = Object.keys(OC).filter(estLa);
var sansFiche = sansFicheDans(laOC, carte);
// contre-épreuve : la ligne « ◆ FICHE » de Hilde ôtée (en mémoire) — elle est toujours Hilde, et sans fiche : attrapée
var c29 = JSON.parse(JSON.stringify(carte(29)));
c29.events[28].pages[0].list = c29.events[28].pages[0].list.filter(function (c) { return !(c.code === 108 && /^◆ FICHE · /.test(c.parameters[0])); });
var ficheAttrapee = Q.etat(FICHES['29:28'], c29).la && sansFicheDans(['29:28'], function (n) { return n === 29 ? c29 : carte(n); }).length === 1;
V('① chaque personnage encore là a sa fiche en tête de sa page', laOC.length >= 20 && !sansFiche.length && ficheAttrapee,
    laOC.length + ' personnages là' + (sansFiche.length ? ' — sans fiche : ' + sansFiche.join(', ') : ', tous avec leur fiche') + ' · une fiche ôtée exprès est attrapée');
// un prénom peut servir deux fois (deux Anselme, deux Gustave) : on cherche d'abord sur la même carte
function quiEst(nom, depuis) {
    var l = Object.keys(OC).filter(function (k) { return NOMS[k] === nom; });
    return l.filter(function (k) { return k.split(':')[0] === depuis.split(':')[0]; })[0] || l[0];
}
var seuls = [];
Object.keys(OC).forEach(function (k) {
    Object.keys(OC[k].avis || {}).forEach(function (b) {
        var o = OC[quiEst(b, k)]; if (!o) return;
        if (!Object.keys(o.avis || {}).concat(Object.keys((o.oc || {}).liens || {})).some(function (x) { return x.indexOf(NOMS[k]) >= 0; })) seuls.push(NOMS[k] + ' → ' + b);
    });
});
// contre-épreuve : un avis qu'on retire à Kaze doit être attrapé
var avisKaze = OC['29:40'].avis.Hilde; delete OC['29:40'].avis.Hilde;
var liensKaze = OC['29:40'].oc.liens.Hilde; delete OC['29:40'].oc.liens.Hilde;
var attrape = !Object.keys(OC['29:40'].avis).concat(Object.keys(OC['29:40'].oc.liens)).some(function (x) { return x.indexOf('Hilde') >= 0; });
OC['29:40'].avis.Hilde = avisKaze; OC['29:40'].oc.liens.Hilde = liensKaze;
V('① les liens se répondent (et un lien coupé exprès est attrapé)', !seuls.length && attrape, seuls.length ? 'sans retour : ' + seuls.join(', ') : 'tous les avis ont leur retour');

/* ── ⑬ la situation (JOKO : « en Aurevel, dans les campagnes, avec une faille à côté ») : elle est dans les pages,
 *    et plus personne ne dit qu'il n'y a pas de faille ici ─────────────────────────────────────────────────── */
var SIT = {}; fs.readdirSync(path.join(DOS, 'situation')).forEach(function (f) { Object.assign(SIT, require(path.join(DOS, 'situation', f))); });
function textes(liste) { return liste.filter(function (c) { return c.code === 401; }).map(function (c) { return c.parameters[0]; }).join(' '); }
var contredit = [];
var NIE = /(n'y a pas de faille (ici|près)|pas de faille près d'ici)/i;
function aSaSituation(k, lire) {
    var m = /^(\d+):(\d+)$/.exec(k), e = lire(+m[1]).events[+m[2]];
    if (!e) return false;
    var t = e.pages.map(function (p) { return textes(p.list); }).join(' ');
    var l = [].concat(SIT[k].nouvelles || []);
    return !l.length || t.indexOf(l[0].replace(/^~[^|]*\|/, '').split('|')[0].slice(0, 24)) >= 0;
}
var REF = Q.refonte();
// les habitants refaits (2026-11-09) disent la situation dans leurs propres mots (leurs « nouvelles », leurs étapes) : banc les_gens_du_village
var sitLa = Object.keys(SIT).filter(function (k) { return estLa(k) && !(REF[k] && REF[k].nouvelles); }), sansSituation = sitLa.filter(function (k) { return !aSaSituation(k, carte); });
var sitRefaits = Object.keys(SIT).filter(function (k) { return estLa(k) && REF[k] && REF[k].nouvelles; }).length;
// contre-épreuve : les lignes de Hilde vidées (en mémoire) — attrapée
var c29b = JSON.parse(JSON.stringify(carte(29)));
c29b.events[28].pages.forEach(function (p) { p.list.forEach(function (c) { if (c.code === 401) c.parameters[0] = '…'; }); });
var situationAttrapee = !!SIT['29:28'] && !aSaSituation('29:28', function (n) { return n === 29 ? c29b : carte(n); });
[29, 30, 31, 33, 41, 42, 43, 44, 46, 47].forEach(function (n) {
    carte(n).events.forEach(function (e) { if (e) e.pages.forEach(function (p) { var t = textes(p.list); if (NIE.test(t)) contredit.push(n + ':' + e.id + ' ' + e.name); }); });
});
var planteAttrape = NIE.test('Bon. Il n\'y a pas de faille ici. Mais il pourrait y en avoir une.');
V('⑬ la situation est dans les pages (Aurevel, la faille de la grotte), et personne ne dit plus qu\'il n\'y en a pas', sitLa.length >= 25 && !sansSituation.length && situationAttrapee && !contredit.length && planteAttrape,
    sitLa.length + ' habitants là en parlent' + (sansSituation.length ? ' — sans elle : ' + sansSituation.join(', ') : '') + ' (' + sitRefaits + ' refaits la disent à leur façon, ' + (Object.keys(SIT).length - sitLa.length - sitRefaits) + ' ne sont plus là) · ' +
    (contredit.length ? 'le nient encore : ' + contredit.join(', ') : 'aucun ne le nie') + ' · des lignes vidées exprès, et une phrase qui la nie, sont attrapées');

/* ── ⑭ ce que JOKO a voulu tel quel le reste : les deux outils relancés (dans un dossier à part, rien dans data/)
 *    n'y touchent pas — et sans la liste (VOULU_SAUF), ils y toucheraient : la liste protège pour de vrai ── */
var cp = require('child_process'), os = require('os');
var TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'voulu-'));
function lancer(outil, dossier, env) {
    cp.execFileSync(process.execPath, [path.join(RACINE, 'bancs', 'outils', outil), '--ecrire', '--sortie', dossier], { env: Object.assign({}, process.env, env || {}), stdio: 'pipe', cwd: RACINE });
    return dossier;
}
function changes(dossier) {   // les « carte:événement » que l'outil écrirait autrement qu'ils ne sont
    var l = [];
    fs.readdirSync(dossier).filter(function (f) { return /^Map\d+\.json$/.test(f); }).forEach(function (f) {
        var n = +f.slice(3, 6), a = carte(n), b = JSON.parse(fs.readFileSync(path.join(dossier, f), 'utf8'));
        for (var i = 0; i < Math.max(a.events.length, b.events.length); i++) if (JSON.stringify(a.events[i]) !== JSON.stringify(b.events[i])) l.push(n + ':' + i);
    });
    return l;
}
var outils = changes(lancer('poser_les_habitants.js', path.join(TMP, 'h'))).concat(changes(lancer('poser_les_scenes.js', path.join(TMP, 's'))));
var vouluTouche = outils.filter(function (k) { var m = k.split(':'); return VOULU.est(+m[0], +m[1]); });
// la contre-épreuve : sans la liste, un événement voulu serait réécrit (un habitant s'il en reste un de voulu, et les scènes)
var vouluHab = Object.keys(VOULU.evenements).filter(function (k) { return FICHES[k]; })[0];
var vouluScn = Object.keys(VOULU.evenements).filter(function (k) { var m = k.split(':'), e = carte(+m[0]).events[+m[1]]; return e && /^🏘/.test(e.name || ''); })[0];
var sansListe = (vouluHab ? changes(lancer('poser_les_habitants.js', path.join(TMP, 'h2'), { VOULU_SAUF: vouluHab })) : [])
    .concat(vouluScn ? changes(lancer('poser_les_scenes.js', path.join(TMP, 's2'), { VOULU_SAUF: vouluScn })) : []);
var protege = (!vouluHab || sansListe.indexOf(vouluHab) >= 0) && (!vouluScn || sansListe.indexOf(vouluScn) >= 0) && !!(vouluHab || vouluScn);
fs.rmSync(TMP, { recursive: true, force: true });
V('⑭ ce que tu as voulu tel quel le reste : relancés, les outils n\'y touchent pas (et sans la liste, ils y toucheraient)', !vouluTouche.length && protege,
    Object.keys(VOULU.evenements).length + ' événements voulus' + (vouluTouche.length ? ' — touchés : ' + vouluTouche.join(', ') : ', aucun touché') + ' · sans la liste : ' + (protege ? [vouluHab, vouluScn].filter(Boolean).map(function (k) { return VOULU.evenements[k]; }).join(' et ') + ' seraient réécrits' : '✗ rien ne changerait — la contre-épreuve ne prouve rien'));
var autres = outils.filter(function (k) { return vouluTouche.indexOf(k) < 0; });
if (autres.length) console.log('     ⚑ relancés, les outils réécriraient aussi : ' + autres.map(function (k) { var m = k.split(':'), e = carte(+m[0]).events[+m[1]]; return k + ' ' + (e ? String(e.name).trim() : '(nouveau)'); }).join(', ') + ' — à JOKO (ce qu\'ils y changeraient : node bancs/outils/poser_les_habitants.js --ecarts, node bancs/outils/poser_les_scenes.js)');

(async function () {
    var nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 160)); });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title'; }, null, { timeout: 120000 });
    await page.evaluate(function () {
        DataManager.setupNewGame();
        $gameSystem._meteo = { cle: '', type: 'clair', force: 'clair' };
        SceneManager.goto(Scene_Map);
        SceneManager.push = function () {}; SceneManager.prepareNextScene = function () {};
        // parler à une page : les messages sont lus, les choix pris par « choisir », l'objet donné par « objet »
        window.parler = function (ev, pg, o) {
            o = o || {};
            var it = new Game_Interpreter(); it.setup(pg.list, ev.eventId()); var n = 0, textes = [], menus = 0;
            while (it.isRunning() && n < 6000) {
                if ($gameMessage.isBusy()) {
                    textes.push($gameMessage._texts.join(' '));
                    if ($gameMessage.isItemChoice()) $gameVariables.setValue($gameMessage.itemChoiceVariableId(), o.objet || 0);
                    if ($gameMessage.isChoice()) {
                        var l = $gameMessage.choices(), k = o.choisir ? o.choisir(l, menus++) : Math.floor(Math.random() * l.length);
                        textes.push('[' + l[k] + ']'); $gameMessage.onChoice(k);
                    }
                    $gameMessage.clear();
                }
                // une bulle finit quand son sprite l'a jouée (MV garde _balloonId jusque-là) : ici, sans dessin, on la finit nous-mêmes
                it.update(); $gameMap.events().forEach(function (e) { e.update(); if (e.isBalloonPlaying()) { e._balloonId = 0; e.endBalloon(); } }); $gameScreen.update(); n++;
            }
            return { fini: !it.isRunning(), texte: textes.join(' | ') };
        };
        // aller au menu, prendre un choix nommé, puis « Au revoir »
        window.viser = function (titre) {
            var fait = false;
            return function (l) {
                var i = l.indexOf(titre);
                if (!fait && i >= 0) { fait = true; return i; }
                var fin = l.indexOf('Au revoir'); if (fin >= 0) return fin;
                return 0;
            };
        };
        window.memoire = function (k) { return ($gameSystem._habitants || {})[k] || {}; };
        window.pageHabitant = function (ev, n) { return ev.event().pages[(n || 1) - 1]; };
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && window.AlleesEtVenues && AlleesEtVenues.pret(); }, null, { timeout: 60000 });
    async function aller(c, h, x, y) {
        await page.evaluate(function (p) { $gameSystem.set_hour(p.h); $gameSystem.set_minute(0); $gamePlayer.reserveTransfer(p.c, p.x, p.y, 2, 0); }, { c: c, h: h, x: x, y: y });
        await page.waitForFunction(function (c) { return $gameMap.mapId() === c && !$gamePlayer.isTransferring() && SceneManager._scene._spriteset; }, c, { timeout: 30000 });
        await page.waitForTimeout(500);
    }

    /* ② ③ le rendez-vous de Hilde, puis sa scène à l'épicerie */
    if (!estLa('29:28')) SAUTE('② ③ ④ Hilde : le rendez-vous, la même Hilde, les cadeaux', 'Hilde (29:28) : ' + etat('29:28').pourquoi);
    else {
    await aller(29, 15, 20, 24);
    var r2 = await page.evaluate(function () {
        $gameSystem._habitants = {};
        $gameSystem._habitants['29:28'] = { visites: 5, jour: -1, affinite: 2, v13: true };
        var h = $gameMap.event(28), r = {};
        r.promesse = parler(h, pageHabitant(h), { choisir: viser('Au revoir') }).texte;
        r.etat1 = (memoire('29:28').scenes || [])[0];
        r.aff1 = memoire('29:28').affinite;
        r.encore = parler(h, pageHabitant(h), { choisir: viser('Au revoir') }).texte;   // en ville, l'après-midi : rien ne se joue
        r.etat1b = (memoire('29:28').scenes || [])[0];
        r.cles = Object.keys($gameSystem._habitants); r.map = $gameMap.mapId(); r.pg = h._pageIndex; r.nom = h.event().name;
        return r;
    });
    if (r2.etat1 !== 1) console.log('      (diagnostic) ' + JSON.stringify({ cles: r2.cles, carte: r2.map, page: r2.pg, nom: r2.nom, aff: r2.aff1, texte: r2.promesse.slice(0, 300) }));
    V('② à l\'amitié 3, Hilde donne son rendez-vous — et ne le rappelle pas dans la même phrase', r2.etat1 === 1 && /épicerie demain matin/.test(r2.promesse) && !/N'oublie pas : l'épicerie/.test(r2.promesse), 'scène 1 : ' + r2.etat1 + ' (1 = promise) · « ' + (r2.promesse.match(/Tu passes devant[^|]*/) || ['?'])[0].slice(0, 60) + '… »');
    V('② contre-épreuve : en ville, l\'après-midi, la scène ne se joue pas', r2.etat1b === 1 && !/Te voilà ! Regarde/.test(r2.encore), 'toujours promise');
    await aller(43, 9, 8, 8);
    var r3 = await page.evaluate(function () {
        var e = $gameMap.event(3); e.refresh();
        var r = { pageActive: e._pageIndex, avant: memoire('29:28').affinite };
        var t = parler(e, e.page(), { choisir: function (l) { return 0; } });
        r.texte = t.texte; r.etat = (memoire('29:28').scenes || [])[0]; r.apres = memoire('29:28').affinite;
        r.cle43 = !!($gameSystem._habitants || {})['43:3'];
        var t2 = parler(e, e.page(), { choisir: viser('Au revoir') });
        r.deux = /Te voilà ! Regarde/.test(t2.texte);
        // Kaze, page 2 du même événement : sa propre amitié
        $gameSystem.set_hour(15); e.refresh();
        r.pageKaze = e._pageIndex;
        parler(e, e.page(), { choisir: viser('Au revoir') });
        r.kaze = !!($gameSystem._habitants || {})['29:40'];
        return r;
    });
    V('② à l\'épicerie, le matin, sa scène se joue — une seule fois', r3.etat === 2 && /Te voilà ! Regarde/.test(r3.texte) && !r3.deux, 'scène 1 : ' + r3.etat + ' (2 = vue) · amitié ' + r3.avant + ' → ' + r3.apres + (r3.deux ? ' · ✗ rejouée' : ''));
    V('③ Hilde à l\'épicerie est la Hilde de la ville (même amitié), Kaze a la sienne', !r3.cle43 && r3.pageActive === 0 && r3.pageKaze === 1 && r3.kaze, 'aucune mémoire « 43:3 » ; Kaze (page 2) écrit dans « 29:40 »');

    /* ④ les cadeaux */
    await aller(29, 15, 20, 24);
    var r4 = await page.evaluate(function () {
        var h = $gameMap.event(28), r = {};
        function a() { return memoire('29:28').affinite; }
        $gameSystem.add_day(1);
        $gameParty.gainItem($dataItems[7], 2); $gameParty.gainItem($dataItems[8], 1);
        var a0 = a();
        r.adore = parler(h, pageHabitant(h), { choisir: viser('Offrir…'), objet: 7 }).texte;
        r.gainAdore = a() - a0 - 1;                                   // −1 : le premier mot du jour
        r.bocaux = $gameParty.numItems($dataItems[7]);
        var a1 = a();
        r.deja = parler(h, pageHabitant(h), { choisir: viser('Offrir…'), objet: 7 }).texte;
        r.gainDeja = a() - a1; r.bocaux2 = $gameParty.numItems($dataItems[7]);
        $gameSystem.add_day(1);
        var a2 = a();
        r.deteste = parler(h, pageHabitant(h), { choisir: viser('Offrir…'), objet: 8 }).texte;
        r.gainDeteste = a() - a2 - 1; r.plats = $gameParty.numItems($dataItems[8]);
        $gameSystem.add_day(1); $gameSystem.set_month(4); $gameSystem.set_day(12);
        var a3 = a();
        r.anniv = parler(h, pageHabitant(h), { choisir: viser('Offrir…'), objet: 7 }).texte;
        r.gainAnniv = a() - a3 - 1;
        return r;
    });
    V('④ un objet adoré : +2, et il part', r4.gainAdore === 2 && r4.bocaux === 1, '+' + r4.gainAdore + ' · bocaux à lucioles : 2 → ' + r4.bocaux);
    V('④ un deuxième cadeau le même jour est refusé', r4.gainDeja === 0 && r4.bocaux2 === 1 && /déjà gâtée/.test(r4.deja), '+' + r4.gainDeja + ', l\'objet reste');
    V('④ un objet détesté est rendu, rien ne bouge', r4.gainDeteste === 0 && r4.plats === 1 && /Garde-le/.test(r4.deteste), '+' + r4.gainDeteste + ' · plat douteux rendu');
    V('④ le jour de son anniversaire, un cadeau compte double', r4.gainAnniv === 4 && /anniversaire/.test(r4.anniv), '12 avril : +' + r4.gainAnniv);
    }

    /* ⑤ à côté · ⑥ où il est */
    if (!estLa('29:25') || !estLa('29:26')) await aller(29, 15, 20, 24);
    var r5 = await page.evaluate(function () {
        if (!$gameMap.event(25) || !$gameMap.event(26)) return { absents: true, villeBar: Habitants.ici((function () { var i = new Game_Interpreter(); i.setup([], 10); return i; })(), 'bar') };
        // Élise et Tomas : l'après-midi, ils sont toujours dehors (Kaze, lui, entre à l'épicerie à 13 h)
        var h = $gameMap.event(25), k = $gameMap.event(26), it = new Game_Interpreter(); it.setup([], 25);
        var r = {};
        k.locate(h.x + 1, h.y); r.pres = Habitants.aCote(it, 'Tomas');
        k.locate(h.x + 12, h.y + 12); r.loin = Habitants.aCote(it, 'Tomas');
        r.villeBar = Habitants.ici(it, 'bar');
        return r;
    });
    if (!estLa('29:25') || !estLa('29:26')) SAUTE('⑤ « à côté » : Tomas près d\'Élise', 'Élise : ' + (etat('29:25').pourquoi || 'là') + ' · Tomas : ' + (etat('29:26').pourquoi || 'là'));
    else V('⑤ « à côté » : Tomas près d\'Élise est vu, loin d\'elle non', r5.pres === true && r5.loin === false, 'à une case : ' + r5.pres + ' · à 24 cases : ' + r5.loin);
    await aller(46, 20, 20, 30);
    var r6 = await page.evaluate(function () { var it = new Game_Interpreter(); it.setup([], 27); return { bar: Habitants.ici(it, 'bar'), travail: Habitants.ici(it, 'travail') }; });
    V('⑥ au bar, on est « au bar » (et pas « au travail ») ; en ville, non', r6.bar === true && r6.travail === false && r5.villeBar === false, 'bar : ' + r6.bar + ' · en ville : ' + r5.villeBar);

    /* ⑧ trop de choix : « Autre chose… » */
    if (!estLa('46:27')) SAUTE('⑧ Margot : « Autre chose… »', 'Margot (46:27) : ' + etat('46:27').pourquoi);
    else {
    var r8 = await page.evaluate(function () {
        var m = $gameMap.event(27), l = [];
        parler(m, pageHabitant(m), { choisir: function (c, n) { if (n === 0) l = c; return c.indexOf('Au revoir'); } });
        return l;
    });
    V('⑧ Margot : au-delà de six choix, les derniers passent dans « Autre chose… »', r8.length <= 6 && r8.indexOf('Autre chose…') >= 0, r8.join(' · '));
    }

    /* ⑦ les anniversaires : le crieur que l'outil a posé les annonce ; s'il n'y en a plus (JOKO, 2026-11-09 : « le crieur
     *    sans les anniversaires », voulu), le jour se sait quand même (Habitants.anniversaire), et son crieur à lui
     *    parle jusqu'au bout, le 12 comme le 13 */
    var crieurs = Object.keys(FICHES).filter(function (k) { return FICHES[k].annonceAnniversaires; });
    function annonce(k) { return REF[k] && REF[k].annonceAnniversaires !== undefined ? !!REF[k].annonceAnniversaires : !!FICHES[k].annonceAnniversaires; }
    var crieursLa = crieurs.filter(function (k) { return estLa(k) && annonce(k); });
    var annonces = [];
    for (var kc of crieursLa) {
        var mc = kc.split(':');
        await aller(+mc[0], 10, 20, 24);
        annonces.push(await page.evaluate(function (id) {
            var m = $gameMap.event(id), r = {};
            $gameSystem.set_month(4); $gameSystem.set_day(12);
            r.le12 = parler(m, m.page() || pageHabitant(m), { choisir: viser('Au revoir') }).texte;
            $gameSystem.set_day(13);
            r.le13 = parler(m, m.page() || pageHabitant(m), { choisir: viser('Au revoir') }).texte;
            return r;
        }, +mc[1]));
    }
    annonces.forEach(function (r7, i) {
        V('⑦ ' + NOMS[crieursLa[i]] + ' annonce l\'anniversaire de Hilde le 12 avril, et pas le 13', /Hilde/.test(r7.le12) && !/anniversaire de Hilde|Hilde a un an/.test(r7.le13), (r7.le12.match(/[^|]*Hilde[^|]*/) || ['?'])[0].trim().slice(0, 70));
    });
    await aller(29, 10, 20, 24);
    var r7b = await page.evaluate(function (ids) {
        var r = { jour: [], crieurs: [] };
        [[4, 12], [4, 13]].forEach(function (d) { $gameSystem.set_month(d[0]); $gameSystem.set_day(d[1]); r.jour.push(Habitants.anniversaire('4/12')); });
        // les crieurs qui ne sont plus ceux de l'outil (le sien, tel qu'il l'a laissé) : ils parlent jusqu'au bout, les deux jours
        ids.forEach(function (id) {
            var m = $gameMap.event(id); if (!m || !m.page()) return;
            [12, 13].forEach(function (j) { $gameSystem.set_month(4); $gameSystem.set_day(j); var t = parler(m, m.page(), { choisir: viser('Au revoir') }); r.crieurs.push({ id: id, fini: t.fini, annonce: /anniversaire de Hilde/.test(t.texte) }); });
        });
        return r;
    }, crieurs.filter(function (k) { return !annonce(k) && +k.split(':')[0] === 29; }).map(function (k) { return +k.split(':')[1]; }));
    V('⑦ le jour d\'un anniversaire se sait : le 12 avril pour Hilde, et pas le 13', r7b.jour[0] === true && r7b.jour[1] === false, '12/4 : ' + r7b.jour[0] + ' · 13/4 : ' + r7b.jour[1]);
    if (!crieursLa.length) {
        var crieursJOKO = crieurs.filter(function (k) { return !annonce(k); });
        V('⑦ ton crieur, tel que tu l\'as laissé (sans les anniversaires), parle jusqu\'au bout le 12 comme le 13', r7b.crieurs.length > 0 && r7b.crieurs.every(function (c) { return c.fini; }),
            crieursJOKO.map(function (k) { return NOMS[k] + ' (' + (etat(k).pourquoi || 'refait, sans les anniversaires') + ')'; }).join(', ') + ' · ' + r7b.crieurs.filter(function (c) { return c.annonce; }).length + ' annonce(s), comme tu l\'as voulu');
    }

    /* ⑩ le jeu de Petit-Louis suit le triangle · ⑪ Zéphyrin, la nuit de la Veillée seulement.
     *    Retirés de la carte (JOKO) : le jeu se joue tel que l'outil l'écrirait (sa fiche), sur quelqu'un d'autre ;
     *    la balise <Veillee> se pose en mémoire sur le tableau d'affichage (et se retire après). */
    await aller(29, 12, 20, 24);
    var pl = Object.keys(FICHES).filter(function (k) { return FICHES[k].nom === 'Petit-Louis'; })[0];
    var jeuPL = null;
    if (!estLa(pl)) {
        var opt = (FICHES[pl].options || []).filter(function (o) { return /Corps, Âme, Esprit/.test(o.titre) && o.cmds; })[0];
        jeuPL = opt ? opt.cmds.map(function (c) { return { code: c[0], indent: c[1], parameters: c[2] }; }).concat([{ code: 0, indent: 0, parameters: [] }]) : [];
    }
    var zk = Object.keys(FICHES).filter(function (k) { return FICHES[k].nom === 'Zéphyrin'; })[0];
    var r10 = await page.evaluate(function (p) {
        var regle = { 'le Corps': 'l\'Âme', 'l\'Âme': 'l\'Esprit', 'l\'Esprit': 'le Corps' }, vus = {}, faux = [];
        var e = p.jeu ? $gameMap.event(25) : $gameMap.event(p.pl), pg = p.jeu ? { list: JSON.parse(JSON.stringify(p.jeu)) } : pageHabitant(e);
        for (var i = 0; i < 60; i++) {
            var main = i % 3, t = parler(e, pg, { choisir: function (l, n) { if (l.length === 3 && /Corps/.test(l[0])) return main; if (n === 0 && !p.jeu) return l.indexOf('Jouer à « Corps, Âme, Esprit »'); return l.indexOf('Au revoir'); } }).texte;
            var m = /(Le Corps|L'Âme|L'Esprit) bat (le Corps|l'Âme|l'Esprit)/.exec(t);
            if (/Égalité/.test(t)) vus.egalite = 1;
            if (m) { var a = m[1].charAt(0).toLowerCase() + m[1].slice(1); if (regle[a] !== m[2]) faux.push(m[0]); vus[/T'as gagné/.test(t) ? 'gagne' : 'perd'] = 1; }
        }
        // contre-épreuve : une phrase à l'envers (« l'Âme bat le Corps ») doit être attrapée par le même contrôle
        var mm = /(Le Corps|L'Âme|L'Esprit) bat (le Corps|l'Âme|l'Esprit)/.exec('HA ! L\'Âme bat le Corps !');
        var envers = !!mm && regle[mm[1].charAt(0).toLowerCase() + mm[1].slice(1)] !== mm[2];
        var r = {};
        if (p.zLa) {
            var z = $gameMap.event(p.z);
            $gameSystem.set_month(9); $gameSystem.set_day(30); $gameSystem.set_hour(20); r.veillee = Habitants.present(z);
            $gameSystem.set_day(29); r.veille = Habitants.present(z); r.sans = false;
        } else {
            // la balise <Veillee> posée en mémoire sur le tableau d'affichage (là à toute heure), puis retirée
            var t = $gameMap.event(10), d = t.event(), avant = d.note;
            d.note = (avant ? avant + '\n' : '') + '<Veillee>'; t._habHoraire = undefined;
            $gameSystem.set_month(9); $gameSystem.set_day(30); $gameSystem.set_hour(20); r.veillee = Habitants.present(t);
            $gameSystem.set_day(29); r.veille = Habitants.present(t);
            d.note = avant; t._habHoraire = undefined;
            r.sans = Habitants.present(t);                           // contre-épreuve : sans la balise, il est là le 29 aussi
        }
        return { vus: vus, faux: faux, envers: envers, z: r };
    }, { pl: pl ? +pl.split(':')[1] : 0, jeu: jeuPL, z: zk ? +zk.split(':')[1] : 0, zLa: !!zk && estLa(zk) });
    V('⑩ Petit-Louis : « Corps, Âme, Esprit » suit le triangle (le Corps bat l\'Âme, l\'Âme l\'Esprit, l\'Esprit le Corps)' + (jeuPL ? ' — retiré de la carte : son jeu tel que l\'outil l\'écrirait' : ''), (!jeuPL || jeuPL.length > 1) && r10.vus.gagne && r10.vus.perd && r10.vus.egalite && !r10.faux.length && r10.envers, '60 parties : gagnées, perdues, égalités ; ' + (r10.faux.length ? 'à l\'envers : ' + r10.faux.slice(0, 2).join(', ') : 'aucune à l\'envers, et une phrase à l\'envers exprès est attrapée'));
    if (zk && estLa(zk)) V('⑪ Zéphyrin, le marchand de la Veillée : là le 30 septembre au soir, pas la veille', r10.z.veillee === true && r10.z.veille === false, 'le 30/9 à 20 h : ' + r10.z.veillee + ' · le 29/9 : ' + r10.z.veille);
    else V('⑪ <Veillee> : là le 30 septembre au soir, pas la veille — Zéphyrin retiré, la balise essayée sur le tableau d\'affichage', r10.z.veillee === true && r10.z.veille === false && r10.z.sans === true, 'le 30/9 à 20 h : ' + r10.z.veillee + ' · le 29/9 : ' + r10.z.veille + ' · sans la balise, le 29 : ' + r10.z.sans);

    /* ⑨ toutes les pages des personnages, au hasard */
    var tous = { fini: 0, total: 0, erreurs: [] };
    var parCarte = {};
    laOC.forEach(function (k) { var m = /^(\d+):(\d+)(?:\/(\d+))?$/.exec(k); (parCarte[m[1]] = parCarte[m[1]] || []).push([+m[2], +m[3] || 1]); });
    for (var c of Object.keys(parCarte)) {
        await aller(+c, 12, 10, 10);
        var r9 = await page.evaluate(function (liste) {
            var res = { fini: 0, total: 0, erreurs: [] };
            [1, 3, 6, 10].forEach(function (aff) {
                [9, 15, 21, 1].forEach(function (h) {
                    $gameSystem.set_hour(h);
                    liste.forEach(function (x) {
                        var e = $gameMap.event(x[0]); if (!e) return;
                        var pg = e.event().pages[x[1] - 1];
                        // l'amitié au palier voulu, les scènes promises : on va jusqu'au rendez-vous
                        var k = $gameMap.mapId() + ':' + x[0];
                        $gameSystem._habitants[k] = { visites: 3, jour: -1, affinite: aff - 1, v13: true, scenes: aff >= 6 ? [1, 1, 0] : [] };
                        [7, 44, 9, 8, 10, 0].forEach(function (o) { $gameParty.gainItem($dataItems[o || 44], 1); });
                        res.total++;
                        try { var t = parler(e, pg, { objet: [7, 44, 8, 10, 103, 0][Math.floor(Math.random() * 6)] }); if (t.fini) res.fini++; else res.erreurs.push(e.event().name + ' : ne finit pas'); }
                        catch (err) { res.erreurs.push(e.event().name + ' : ' + err.message); }
                    });
                });
            });
            return res;
        }, parCarte[c]);
        tous.fini += r9.fini; tous.total += r9.total; tous.erreurs = tous.erreurs.concat(r9.erreurs);
    }
    V('⑨ toutes les pages des personnages se parlent jusqu\'au bout (4 amitiés × 4 heures)', tous.total > 0 && tous.fini === tous.total && !tous.erreurs.length, tous.fini + '/' + tous.total + (tous.erreurs.length ? ' — ' + tous.erreurs.slice(0, 3).join(' | ') : ''));

    /* ⑮ ses pages à lui : ce qu'il a voulu tel quel (les 9 de la ville) se parle aussi jusqu'au bout, à toute heure, choix au hasard */
    var siens = Object.keys(VOULU.evenements).filter(function (k) { var m = k.split(':'), e = carte(+m[0]).events[+m[1]]; return e && !/^🏘/.test(e.name || ''); });
    var sienParCarte = {}; siens.forEach(function (k) { var m = k.split(':'); (sienParCarte[m[0]] = sienParCarte[m[0]] || []).push(+m[1]); });
    var r15 = { fini: 0, total: 0, erreurs: [] };
    for (var cs of Object.keys(sienParCarte)) {
        await aller(+cs, 12, 10, 10);
        var r15c = await page.evaluate(function (ids) {
            var res = { fini: 0, total: 0, erreurs: [] };
            [9, 15, 21, 1].forEach(function (h) {
                $gameSystem.set_hour(h);
                ids.forEach(function (id) {
                    var e = $gameMap.event(id); if (!e) return;
                    e.event().pages.forEach(function (pg) {
                        if (!pg.list.some(function (c) { return c.code === 101; })) return;
                        for (var n = 0; n < 3; n++) {
                            res.total++;
                            try { var t = parler(e, pg, {}); if (t.fini) res.fini++; else res.erreurs.push(e.event().name + ' : ne finit pas'); }
                            catch (err) { res.erreurs.push(e.event().name + ' : ' + err.message); }
                        }
                    });
                });
            });
            return res;
        }, sienParCarte[cs]);
        r15.fini += r15c.fini; r15.total += r15c.total; r15.erreurs = r15.erreurs.concat(r15c.erreurs);
    }
    V('⑮ tes pages telles que tu les as laissées se parlent jusqu\'au bout (' + siens.map(function (k) { return VOULU.evenements[k]; }).join(', ') + ')', siens.length === 0 || (r15.total > 0 && r15.fini === r15.total && !r15.erreurs.length),
        siens.length ? r15.fini + '/' + r15.total + ' conversations (4 heures, choix au hasard)' + (r15.erreurs.length ? ' — ' + r15.erreurs.slice(0, 3).join(' | ') : '') : 'rien de voulu tel quel');

    /* ⑫ chaque rendez-vous peut être tenu : à l'heure dite, sur la carte dite, la personne est là, visible */
    var rdv = [], horsCarte = 0;
    Object.keys(OC).forEach(function (k) {
        if (/\/\d+$/.test(k)) return;                 // une page 2 (Colin) : elle n'est là que quand JOKO l'allume
        if (!estLa(k)) { horsCarte += (OC[k].scenes || []).filter(function (sc) { return sc.quand; }).length; return; }
        (OC[k].scenes || []).forEach(function (sc, i) {
            if (!sc.quand) return;
            var h = (sc.quand.a - sc.quand.de === 1 ? sc.quand.de : sc.quand.de + 1) % 24;
            rdv.push({ k: k, nom: NOMS[k], i: i, carte: sc.quand.carte, h: h });
        });
    });
    var groupes = {}; rdv.forEach(function (r) { var g = r.carte + '@' + r.h; (groupes[g] = groupes[g] || []).push(r); });
    var manques = [];
    for (var g of Object.keys(groupes)) {
        var r0 = groupes[g][0], autre = r0.carte === 29 ? 30 : 29;
        await aller(autre, r0.h, 20, 20);                   // comme le joueur : il arrive d'une autre carte
        await page.evaluate(function (p) { $gameSystem.set_hour(p.h); $gameSystem.set_minute(20); $gamePlayer.reserveTransfer(p.c, 1, 1, 2, 0); }, { h: r0.h, c: r0.carte });
        await page.waitForFunction(function (c) { return $gameMap.mapId() === c && !$gamePlayer.isTransferring() && SceneManager._scene._spriteset; }, r0.carte, { timeout: 30000 });
        await page.waitForTimeout(2500);
        var vus = await page.evaluate(function (l) {
            return l.map(function (r) {
                return $gameMap.events().some(function (e) { return Habitants.nomDe(e) === r.nom && !e._erased && e._pageIndex >= 0 && e.opacity() > 0 && !(e._vie && e._vie.dedans) && !e._habDepart; });
            });
        }, groupes[g]);
        groupes[g].forEach(function (r, i) { if (!vus[i]) manques.push(r.nom + ' scène ' + (r.i + 1) + ' (carte ' + r.carte + ', ' + r.h + ' h)'); });
    }
    V('⑫ chaque rendez-vous d\'amitié peut être tenu (la personne est là, à l\'heure dite)', rdv.length >= 20 && rdv.length + horsCarte > 40 && !manques.length, rdv.length + ' rendez-vous' + (manques.length ? ' — impossibles : ' + manques.join(', ') : ', tous tenables') + (horsCarte ? ' (' + horsCarte + ' de gens qui ne sont plus sur tes cartes, pas comptés)' : ''));

    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 2).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)' + (sautes.length ? ' · ' + sautes.length + ' sauté(s) : la personne n\'est plus sur tes cartes' : '') + '\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
