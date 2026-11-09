/*
 * LES GENS DU VILLAGE — la refonte des PNJ (JOKO, 2026-11-09)
 * ---------------------------------------------------------------------------
 * JOKO : « beaucoup plus humains et beaucoup plus sentimentaux […] une histoire derrière par rapport au
 * lore », puis, sur l'analyse (docs/PNJ_LA_BASE.md) : « tout ou le meilleur ». On vérifie la refonte
 * (bancs/outils/habitants/refonte/) sur les vraies cartes, et dans le vrai jeu, dans les deux sens :
 *
 *   ① chacun a son histoire tirée du lore, ce qu'il sait, sa voix, un fil d'au moins cinq
 *     conversations, une question au joueur, ses étapes du village, ses jours de tristesse ;
 *   ② aucune réplique n'est dite par deux personnes (la « flèche dans le genou » de Skyrim) — et une
 *     réplique copiée exprès chez un autre est attrapée ;
 *   ③ qui sait quoi : un enfant ne se souvient ni de la famine, ni du roi Thibaut, ni de la révolution,
 *     ni de la guerre ; personne au village ne dit ce que la Bible garde secret (les Larmiers,
 *     l'Étang-Miroir, le Linceul, le Vœu de Cendre, Mélusine, les Sans-Retour) ni le rang de la faille
 *     — et deux phrases plantées exprès sont attrapées ;
 *   ④ le fil : « Discuter » donne la suite de la dernière fois, une conversation neuve par jour, pas
 *     deux ; l'amitié qu'il faut ; une conversation neuve rapproche ;
 *   ⑤ la question : la réponse est retenue, et il en reparle un autre jour (pas le jour même) ;
 *   ⑥ les ragots : un autre en parle, une fois ;
 *   ⑦ les étapes du village (variable 889) : chacun dit la nouvelle une fois, quand elle change ;
 *   ⑧ les jours de tristesse : le même tirage toute la journée, à peu près le réglage de la carte,
 *     et la ligne triste une fois ce jour-là ;
 *   ⑨ « il a du neuf » : la bulle sur qui a une conversation neuve, pas sur un inconnu, plus après ;
 *   ⑩ toutes les pages refaites se parlent jusqu'au bout, à chaque étape, à chaque amitié.
 *
 *   node bancs/navigateur/les_gens_du_village.js
 */
'use strict';
var fs = require('fs'), path = require('path');
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var RACINE = path.join(__dirname, '..', '..');
var Q = require(path.join(RACINE, 'bancs', 'outils', 'qui_est_la.js'));
var REF = Q.refonte(), FICHES = Q.fiches();
var OC = {};
fs.readdirSync(path.join(RACINE, 'bancs', 'outils', 'habitants', 'oc')).filter(function (f) { return /\.js$/.test(f); }).forEach(function (f) { Object.assign(OC, require(path.join(RACINE, 'bancs', 'outils', 'habitants', 'oc', f))); });
var ok = 0, ko = 0;
function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
console.log('LES GENS DU VILLAGE');

var refaits = Object.keys(REF).filter(function (k) { return FICHES[k] && Q.etat(FICHES[k]).la; });
function nom(k) { return FICHES[k] ? FICHES[k].nom : k; }

/* ── ① chacun a son histoire, sa voix, son fil, sa question, ses étapes, ses jours ── */
function aUneQuestion(r) {
    return (r.fil || []).some(function (x) { return x && x.gestes && JSON.stringify(x.gestes).indexOf('"retiens"') >= 0; });
}
var incomplets = refaits.filter(function (k) {
    var r = REF[k], o = r.oc || {};
    var etapes = r.etapes ? Object.keys(r.etapes).length : 0;
    return !(r.voix && o.vecu && o.savoir && (r.fil || []).length >= 5 && aUneQuestion(r) && etapes === 5 && (r.triste || []).length);
});
V('① chacun a son histoire, ce qu\'il sait, sa voix, un fil, une question, ses étapes, ses jours de tristesse', refaits.length >= 15 && !incomplets.length,
    refaits.length + ' habitants refaits' + (incomplets.length ? ' — incomplets : ' + incomplets.map(nom).join(', ') : ', tous complets'));

/* ── ② aucune réplique n'est dite par deux personnes ── */
// la personne d'une page : son <Est:> (Hilde à l'épicerie est Hilde), sinon carte:événement
function personneDe(carteId, e, p) {
    var est = p.list.map(function (c) { return c.code === 108 ? /<Est:\s*(\d+:\d+)\s*>/.exec(String(c.parameters[0])) : null; }).filter(Boolean)[0];
    return est ? est[1] : carteId + ':' + e.id;
}
function boites(liste) {   // le texte de chaque boîte de message, sans le nom ni les codes
    var r = [], cur = null;
    liste.forEach(function (c) {
        if (c.code === 101) { if (cur) r.push(cur); cur = ''; }
        else if (c.code === 401 && cur !== null) cur += ' ' + String(c.parameters[0]);
        else if (cur !== null && c.code !== 401) { r.push(cur); cur = null; }
    });
    if (cur) r.push(cur);
    return r.map(function (t) { return t.replace(/\\n<[^>]*>/g, '').replace(/\\[A-Za-z]+\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim(); }).filter(function (t) { return t.length >= 18; });
}
function partagees(cartesLues) {
    var qui = {};
    Object.keys(cartesLues).forEach(function (cid) {
        cartesLues[cid].events.forEach(function (e) {
            if (!e) return;
            e.pages.forEach(function (p) {
                var per = personneDe(cid, e, p);
                if (!REF[per]) return;
                boites(p.list).forEach(function (t) { (qui[t] = qui[t] || {})[per] = 1; });
            });
        });
    });
    return Object.keys(qui).filter(function (t) { return Object.keys(qui[t]).length > 1; }).map(function (t) { return '« ' + t.slice(0, 50) + '… » (' + Object.keys(qui[t]).map(nom).join(', ') + ')'; });
}
var CARTES = { 29: Q.carte(29), 43: Q.carte(43) };
var doublons = partagees(CARTES);
// contre-épreuve : la première conversation de Fernand copiée chez Tomas (en mémoire)
var copie = JSON.parse(JSON.stringify(CARTES)), lf = copie[29].events[29].pages[0].list;
var i0 = lf.findIndex(function (c) { return c.code === 108 && /— fil 1\//.test(String(c.parameters[0])); });
var bout = lf.slice(i0 + 1, lf.findIndex(function (c, j) { return j > i0 && c.code === 355; }));
copie[29].events[26].pages[0].list = copie[29].events[26].pages[0].list.slice(0, -1).concat(bout, [{ code: 0, indent: 0, parameters: [] }]);
var attrapeDoublon = partagees(copie).some(function (t) { return /Fernand/.test(t) && /Tomas/.test(t); });
V('② aucune réplique n\'est dite par deux personnes (et une copiée exprès est attrapée)', !doublons.length && attrapeDoublon,
    doublons.length ? 'en double : ' + doublons.slice(0, 4).join(' · ') : 'chacun parle avec ses mots · la copie plantée chez Tomas est attrapée');

/* ── ③ qui sait quoi ── */
var SECRETS = /Larmiers|Étang-Miroir|Linceul|Vœu de Cendre|Mélusine|Sans-Retour|faille de rang|rang [DCBAS] (de|pour) la faille/i;
var SOUVENIRS_ANCIENS = /Thibaut|famine|années maigres|révolution|Grande Chute|la Marche|la guerre/i;
function ageDe(k) { var a = ((REF[k].oc || {}).age || ((OC[k] || {}).oc || {}).age || ''); var m = /(\d+)/.exec(a); return m ? +m[1] : 99; }
function lignesDe(k) {   // tout ce qu'il dit, dans la refonte
    var r = REF[k], l = [];
    function prendre(x) {
        if (!x) return;
        if (typeof x === 'string') { if (x.charAt(0) !== '~') l.push(x); return; }
        if (Array.isArray(x)) { x.forEach(prendre); return; }
        if (x.t) prendre(x.t);
        if (x.gestes) prendre(x.gestes);
        if (x.lignes) prendre(x.lignes);
        if (typeof x === 'object' && !x.t && !x.gestes && !x.lignes) Object.keys(x).forEach(function (j) { prendre(x[j]); });
    }
    ['premiere', 'discuter', 'fil', 'nouvelles', 'etapes', 'triste', 'souvenirs', 'ragots', 'aurevoir', 'bonjour', 'saisons'].forEach(function (j) { prendre(r[j]); });
    return l.join(' | ').split('|').map(function (t) { return t.trim(); }).filter(function (t) { return t && t.charAt(0) !== '~'; });
}
function fautes(k, lignes) {
    var f = [];
    lignes.forEach(function (t) {
        if (SECRETS.test(t)) f.push(nom(k) + ' : « ' + t.slice(0, 60) + '… »');
        if (ageDe(k) < 15 && SOUVENIRS_ANCIENS.test(t)) f.push(nom(k) + ' (' + ageDe(k) + ' ans) : « ' + t.slice(0, 60) + '… »');
    });
    return f;
}
var savoirFaux = [];
refaits.forEach(function (k) { savoirFaux = savoirFaux.concat(fautes(k, lignesDe(k))); });
var enfant = refaits.filter(function (k) { return ageDe(k) < 15; })[0], vieux = refaits.filter(function (k) { return ageDe(k) >= 60; })[0];
var planteEnfant = fautes(enfant, ['Du temps du roi Thibaut, on avait faim, je m\'en souviens.']).length === 1;
var planteSecret = fautes(vieux, ['Derrière la grotte, ce sont les Larmiers. Je le sais.']).length === 1;
// et dans l'autre sens : un vieux peut se souvenir de la famine
var vieuxSouvient = fautes(vieux, ['Du temps du roi Thibaut, on avait faim.']).length === 0;
V('③ qui sait quoi : ni souvenir trop vieux chez un enfant, ni secret de la Bible dans une bouche du village', !savoirFaux.length && planteEnfant && planteSecret && vieuxSouvient,
    (savoirFaux.length ? 'fautes : ' + savoirFaux.slice(0, 3).join(' · ') : 'aucune faute') + ' · plantées exprès : la famine chez ' + nom(enfant) + ', les Larmiers chez ' + nom(vieux) + ' — attrapées ; la famine chez ' + nom(vieux) + ' — permise');

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
        window.parler = function (ev, pg, o) {
            o = o || {};
            var it = new Game_Interpreter(); it.setup(pg.list, ev.eventId()); var n = 0, textes = [], menus = 0;
            while (it.isRunning() && n < 8000) {
                if ($gameMessage.isBusy()) {
                    textes.push($gameMessage._texts.join(' '));
                    if ($gameMessage.isItemChoice()) $gameVariables.setValue($gameMessage.itemChoiceVariableId(), o.objet || 0);
                    if ($gameMessage.isChoice()) {
                        var l = $gameMessage.choices(), k = o.choisir ? o.choisir(l, menus++) : Math.floor(Math.random() * l.length);
                        if (k < 0) k = 0;
                        textes.push('[' + l[k] + ']'); $gameMessage.onChoice(k);
                    }
                    $gameMessage.clear();
                }
                it.update(); $gameMap.events().forEach(function (e) { e.update(); if (e.isBalloonPlaying()) { e._balloonId = 0; e.endBalloon(); } }); $gameScreen.update(); n++;
            }
            return { fini: !it.isRunning(), texte: textes.join(' | ') };
        };
        // aller au menu, prendre « Discuter », puis « Au revoir » ; dans une question, la réponse n° rep
        window.discuter = function (rep) {
            var fait = false;
            return function (l) {
                if (!fait && l.indexOf('Discuter') >= 0) { fait = true; return l.indexOf('Discuter'); }
                if (l.indexOf('Au revoir') >= 0) return l.indexOf('Au revoir');
                return rep || 0;
            };
        };
        window.saluer = function () { return function (l) { var i = l.indexOf('Au revoir'); return i >= 0 ? i : 0; }; };
        window.mem = function (k) { return ($gameSystem._habitants || {})[k] || {}; };
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && window.AlleesEtVenues && AlleesEtVenues.pret(); }, null, { timeout: 60000 });
    async function aller(c, h, x, y) {
        await page.evaluate(function (p) { $gameSystem.set_hour(p.h); $gameSystem.set_minute(0); $gamePlayer.reserveTransfer(p.c, p.x, p.y, 2, 0); }, { c: c, h: h, x: x, y: y });
        await page.waitForFunction(function (c) { return $gameMap.mapId() === c && !$gamePlayer.isTransferring() && SceneManager._scene._spriteset; }, c, { timeout: 30000 });
        await page.waitForTimeout(500);
    }
    await aller(29, 10, 20, 24);
    var jourTotal = await page.evaluate(function () { return typeof $gameSystem.total_days === 'function'; });

    /* ④ le fil · ⑤ la question · ⑥ le ragot · ⑦ les étapes · ⑨ la bulle */
    var r = await page.evaluate(function () {
        var H = window.Habitants, f = $gameMap.event(29), t = $gameMap.event(26), r = {};
        function avancer() { var j = H.jour(); $gameSystem.add_day(1); return H.jour() !== j; }
        var aCote = H.aCote; H.aCote = function () { return false; };     // personne à côté : l'accueil ne parle que de lui
        $gameSystem._habitants = {};
        $gameVariables.setValue(889, 0);
        // ⑨ un inconnu : pas de bulle
        r.inconnu = H.aDuNeuf(f);
        // ④ premier jour : la première conversation du fil, puis plus rien de neuf ce jour-là
        var a = parler(f, f.page(), { choisir: discuter(0) });
        r.fil1 = mem('29:29').fil; r.texte1 = a.texte;
        r.neufApres = H.aDuNeuf(f);
        var b = parler(f, f.page(), { choisir: discuter(0) });
        r.fil1bis = mem('29:29').fil; r.texte1bis = b.texte;
        // le lendemain, sans l'amitié qu'il faut (2), pas de suite
        r.avance = avancer();
        var aff = mem('29:29').affinite;
        r.affAvant = aff;
        // ⑨ le lendemain, on le connaît, la suite est là si l'amitié y est
        mem('29:29').affinite = 5; r.neufLendemain = H.aDuNeuf(f);
        var c = parler(f, f.page(), { choisir: discuter(0) });
        r.fil2 = mem('29:29').fil; r.texte2 = c.texte; r.affApres = mem('29:29').affinite;
        // ⑤ la question : on va jusqu'à elle (le sixième pas), réponse 0 (« Tu l'as encore »)
        var m = mem('29:29'); m.fil = 5; m.filJour = -1; m.affinite = 12;
        var d = parler(f, f.page(), { choisir: discuter(0) });
        r.question = d.texte; r.rep = (mem('29:29').rep || {}).ciel;
        // le jour même : il n'en reparle pas
        var hasard = Math.random; Math.random = function () { return 0; };
        r.memeJour = parler(f, f.page(), { choisir: saluer() }).texte;
        avancer();
        r.lendemainTexte = parler(f, f.page(), { choisir: saluer() }).texte;
        // ⑥ le ragot : Tomas en parle, une fois
        $gameSystem._habitants['29:26'] = { visites: 3, jour: -1, affinite: 2, v13: true };
        t = $gameMap.event(26);
        r.carteRagot = $gameMap.mapId(); r.tomas = !!t;
        if (!t) return r;
        r.ragot1 = parler(t, t.page(), { choisir: saluer() }).texte;
        r.ragot2 = parler(t, t.page(), { choisir: saluer() }).texte;
        // ⑦ l'étape 1 : Fernand le dit une fois ; le dire est retenu
        $gameVariables.setValue(889, 1);
        r.neufEtape = H.aDuNeuf(f) || false;
        r.etape1 = parler(f, f.page(), { choisir: saluer() }).texte;
        r.etape1bis = parler(f, f.page(), { choisir: saluer() }).texte;
        Math.random = hasard;
        $gameVariables.setValue(889, 0);
        H.aCote = aCote;
        return r;
    });
    if (!r.tomas) console.log('      (diagnostic) au moment du ragot : carte ' + r.carteRagot + ', Tomas ' + r.tomas);
    // ⑨ la bulle, posée par le plugin quand le joueur est à côté — comme dans le jeu : quand aucun événement ne tourne
    await page.evaluate(function () { var f = $gameMap.event(29), m = mem('29:29'); m.fil = 1; m.filJour = -1; m.affinite = 20; $gamePlayer.locate(f.x, f.y + 2); });
    var libre = await page.waitForFunction(function () { return !$gameMap.isEventRunning() && !$gameMessage.isBusy(); }, null, { timeout: 30000 }).then(function () { return true; }, function () { return false; });
    r.bulles = await page.evaluate(function () {
        var f = $gameMap.event(29), n = 0, _r = f.requestBalloon;
        f.requestBalloon = function (id) { if (id === 8) n++; return _r.apply(this, arguments); };
        f._habNeufT = 0; f._balloonId = 0; f._balloonPlaying = false;
        Habitants._signesNeuf();
        f.requestBalloon = _r;
        return n;
    });
    if (!libre) console.log('      (diagnostic) un événement de la carte 29 ne finit jamais de démarrer : la bulle attendrait toujours');
    V('④ le fil : la conversation neuve, une par jour — pas deux le même jour, et pas sans l\'amitié qu\'il faut', r.fil1 === 1 && r.fil1bis === 1 && /Pareil que le ciel/.test(r.texte1) && !/hirondelles/.test(r.texte1bis) && r.fil2 === 2 && /hirondelles/.test(r.texte2),
        'jour 1 : « ' + ((r.texte1.match(/Pareil que le ciel[^|]*/) || ['?'])[0].slice(0, 40)) + '… » · le même jour : rien de neuf · le lendemain : « ' + ((r.texte2.match(/On regarde les hirondelles[^|]*/) || ['?'])[0].slice(0, 30)) + '… »');
    V('④ une conversation neuve rapproche (comme un cadeau aimé)', r.affApres - 5 >= 2, 'amitié 5 → ' + r.affApres + ' (+1 le premier mot du jour, +1 la conversation)');
    V('⑤ la question : la réponse est retenue, il en reparle un autre jour, pas le jour même', r.rep === 'encore' && /Je l'ai encore/.test(r.question) && !/c'est toi qui m'as dit/.test(r.memeJour) && /c'est toi qui m'as dit que je l'avais encore/.test(r.lendemainTexte),
        'réponse : « ' + r.rep + ' » · le jour même : rien · le lendemain : « Ah, c\'est toi qui m\'as dit… »');
    V('⑥ un ragot : Tomas le répète, une fois', /Fernand dit que tu lui as dit/.test(r.ragot1) && !/Fernand dit que tu lui as dit/.test(r.ragot2), 'la 1re fois : oui · la 2e : non');
    V('⑦ l\'étape du village : la nouvelle est dite une fois, quand elle change', /soldats du roi sur le chemin/.test(r.etape1) && !/soldats du roi sur le chemin/.test(r.etape1bis) && r.neufEtape,
        'étape 1 : « Des soldats du roi… » · la fois d\'après : rien · la bulle l\'annonçait');
    V('⑨ « il a du neuf » : pas sur un inconnu, oui quand une conversation l\'attend, plus une fois dite', r.inconnu === false && r.neufLendemain === true && r.neufApres === false && r.bulles === 1,
        'inconnu : ' + r.inconnu + ' · le lendemain : ' + r.neufLendemain + ' · après la conversation : ' + r.neufApres + ' · bulle « … » posée : ' + r.bulles);

    /* ⑧ les jours de tristesse */
    var t8 = await page.evaluate(function () {
        var H = window.Habitants, n = 0, total = 300, stable = true, peche = 0;
        for (var j = 1; j <= total; j++) { var a = H.tristeCle('29:29', j); if (a !== H.tristeCle('29:29', j)) stable = false; if (a) n++; if (H.tristeCle('33:24', j)) peche++; }
        // un jour triste (on avance le calendrier jusqu'au prochain) : la ligne une fois
        var f = $gameMap.event(29), r = { taux: n / total, peche: peche / total, stable: stable }, essais = 0;
        while (!H.tristeCle('29:29') && essais++ < 400) $gameSystem.add_day(1);
        if (H.tristeCle('29:29')) {
            var hasard = Math.random; Math.random = function () { return 0.99; };
            var m = mem('29:29'); m.tristeJour = -1;
            r.t1 = parler(f, f.page(), { choisir: saluer() }).texte; r.t2 = parler(f, f.page(), { choisir: saluer() }).texte;
            Math.random = hasard;
        }
        return r;
    });
    V('⑧ les jours de tristesse : un tirage par jour, à peu près le réglage (15 % en ville, 8 % à la pêche), la ligne une fois', t8.stable && t8.taux > 0.07 && t8.taux < 0.25 && t8.peche < t8.taux && /(goût de pluie qui pleure|deux bols)/.test(t8.t1 || '') && !/(goût de pluie qui pleure|deux bols)/.test(t8.t2 || ''),
        'ville : ' + Math.round(t8.taux * 100) + ' % des jours · pêche : ' + Math.round(t8.peche * 100) + ' % · le jour triste, la ligne une fois');

    /* ⑩ toutes les pages refaites, à chaque étape, à chaque amitié */
    var parCarte = {};
    refaits.forEach(function (k) { var m = k.split(':'); (parCarte[m[0]] = parCarte[m[0]] || []).push(+m[1]); });
    parCarte[43] = [3];
    var tous = { fini: 0, total: 0, erreurs: [] };
    for (var c of Object.keys(parCarte)) {
        await aller(+c, 10, 8, 8);
        var r10 = await page.evaluate(function (ids) {
            var res = { fini: 0, total: 0, erreurs: [] };
            [0, 1, 2, 3, 4].forEach(function (et) {
                $gameVariables.setValue(889, et);
                [1, 5, 10].forEach(function (aff) {
                    [9, 15, 21].forEach(function (h) {
                        $gameSystem.set_hour(h);
                        ids.forEach(function (id) {
                            var e = $gameMap.event(id); if (!e) return;
                            e.refresh();
                            e.event().pages.forEach(function (pg, i) {
                                var k = $gameMap.mapId() + ':' + id;
                                $gameSystem._habitants = $gameSystem._habitants || {};
                                $gameSystem._habitants[k] = { visites: 3, jour: -1, affinite: aff, v13: true, fil: Math.floor(Math.random() * 7), filJour: -1, etapeDite: -1 };
                                res.total++;
                                try { var t = parler(e, pg, {}); if (t.fini) res.fini++; else res.erreurs.push(e.event().name + ' : ne finit pas'); }
                                catch (err) { res.erreurs.push(e.event().name + ' : ' + err.message); }
                            });
                        });
                    });
                });
            });
            $gameVariables.setValue(889, 0);
            return res;
        }, parCarte[c]);
        tous.fini += r10.fini; tous.total += r10.total; tous.erreurs = tous.erreurs.concat(r10.erreurs);
    }
    V('⑩ toutes les pages refaites se parlent jusqu\'au bout (5 étapes × 3 amitiés × 3 heures, choix au hasard)', tous.total > 0 && tous.fini === tous.total && !tous.erreurs.length,
        tous.fini + '/' + tous.total + (tous.erreurs.length ? ' — ' + tous.erreurs.slice(0, 3).join(' | ') : ''));

    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 2).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
