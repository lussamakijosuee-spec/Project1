/*
 * UNE JOURNÉE ENTIÈRE — les habitants vivent comme dans Stardew Valley
 * ---------------------------------------------------------------------------
 * JOKO, 2026-10-30 : « il quitte pas la carte, il marche », « aller dans la
 * porte, sortir dehors, aller vers leur maison quand c'est l'heure », « les
 * gardes aller au bar à une certaine heure », « un village ultra vivant ».
 * On avance l'horloge, on laisse le jeu tourner, et on REGARDE :
 *
 *   H2 · on va vraiment quelque part (AlleesEtVenues)
 *     ① Colette et Mado passent la porte du bar le soir, et y sont (une copie, avec leurs répliques)
 *     ② Roul pêche au ponton du Village de Pêche le matin
 *     ③ les jumeaux Vannier traversent le Marché pour aller au bar (une copie en chemin)
 *     ④ les gardes du jour vont au bar après leur porte (Brunehaut, Rolf)
 *     ⑤ les six sœurs Brémont viennent chercher Bérénice à l'auberge
 *     ⑥ l'épicerie : Hilde le matin, Kaze l'après-midi (deux pages, 13 h)
 *     ⑦ personne ne reste coincé : chaque copie installée est à sa place
 *   H1 · dedans : le marchand bouge derrière son comptoir et revient quand on s'approche
 *   H3 · il se tourne vers toi ; il s'écarte ; « ! » sur qui a une quête
 *   H4/H5 · les scènes (des événements « 🏘 ») se jouent : des phrases flottent
 *   H6 · une quête finie se raconte (une fois par habitant) ; l'affinité monte d'un par jour
 *   H7 · l'Admission remplit la ville de recrues ; la Veillée garde dehors ; le dimanche, repos
 *   ⑧ ça ne rame pas : le temps passé dans la mise à jour de la carte reste petit
 *   ⑨ une scène dont la personne n'est plus là (retirée par JOKO, ou son numéro
 *     devenu une marque sans image) ne se joue jamais — et la marque à qui l'on
 *     rend une image, elle, la jouerait (VieDuVillage v2.3)
 *
 * LES CARTES SONT À JOKO (2026-11-09, « Réadapte-le. Développe-le, améliore-le ») :
 * chaque contrôle qui nomme quelqu'un regarde d'abord s'il est encore sur sa
 * carte (la règle de l'outil des habitants, bancs/outils/qui_est_la.js ; ce
 * qu'il a voulu tel quel compte comme là : ces gens vivent toujours). Absent,
 * le contrôle est sauté et le dit. Les recrues de l'Admission retirées, la
 * balise <Admission> est essayée en mémoire sur Fernand. Rien n'est écrit dans data/.
 *
 *   node bancs/navigateur/une_journee_entiere.js
 */
'use strict';
var fs = require('fs'), path = require('path');
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var RACINE = path.join(__dirname, '..', '..');
var Q = require(path.join(RACINE, 'bancs', 'outils', 'qui_est_la.js')), FICHES = Q.fiches();
// est-il encore sur sa carte ? (voulu tel quel : oui, il vit toujours — seule sa page est à JOKO)
function ici(k) {
    var m = k.split(':'), c = Q.carte(+m[0]);
    if (!c || !c.events[+m[1]]) return false;
    if (!FICHES[k]) return true;
    var e = Q.etat(FICHES[k]);
    return e.la || !!e.voulu;
}
function pourquoi(k) { var m = k.split(':'), c = Q.carte(+m[0]); if (!c || !c.events[+m[1]]) return 'retiré'; return FICHES[k] ? Q.etat(FICHES[k]).pourquoi : 'là'; }
function nom(k) { return FICHES[k] ? FICHES[k].nom : k; }

/* ⑨ les scènes dont quelqu'un n'est plus là : un numéro retiré, ou devenu une marque sans image */
function cibles(c) {
    var out = [], t, r;
    if (c.code === 205 || c.code === 213) { if (c.parameters[0] > 0) out.push(c.parameters[0]); return out; }
    if (c.code === 111 && c.parameters[0] === 12) t = c.parameters[1];
    else if (c.code === 355 || c.code === 655 || c.code === 356 || c.code === 401) t = c.parameters[0];
    if (!t) return out;
    var re = /VieDuVillage\.(la|libre|prochePourVoir|ensemble)\(([^)]*)\)/g;
    while ((r = re.exec(t))) {
        var a = r[2].split(',').map(function (x) { return x.trim(); });
        if (r[1] === 'ensemble') a = a.slice(0, -1); if (r[1] === 'prochePourVoir') a = a.slice(0, 1);
        a.forEach(function (x) { if (/^\d+$/.test(x)) out.push(+x); });
    }
    var re2 = /<c:(\d+),/g; while ((r = re2.exec(t))) if (+r[1] > 0) out.push(+r[1]);
    var v = /^VIE (arreter|reprendre|tourner|bulle|dire)\s+(\S+)(?:\s+(\S+))?/.exec(t);
    if (v) { if (/^\d+$/.test(v[2])) out.push(+v[2]); if (v[1] === 'tourner' && /^\d+$/.test(v[3] || '')) out.push(+v[3]); }
    return out;
}
var ORPHELINES = [];
[29, 30, 31, 33, 41, 42, 43, 44, 46].forEach(function (n) {
    var c = Q.carte(n); if (!c) return;
    c.events.forEach(function (e) {
        if (!e || !/^🏘/.test(e.name || '')) return;
        var l = e.pages[0].list;
        l.forEach(function (x, i) {
            if (x.code !== 108 || !/^— /.test(x.parameters[0]) || !l[i + 1] || l[i + 1].code !== 111) return;
            var fin = l.slice(i + 1).findIndex(function (y, j) { return j > 0 && y.code === 108 && /^— /.test(y.parameters[0]); });
            var corps = fin < 0 ? l.slice(i + 1) : l.slice(i + 1, i + 1 + fin), qui = {};
            corps.forEach(function (y) { cibles(y).forEach(function (id) { qui[id] = 1; }); });
            Object.keys(qui).forEach(function (id) {
                var ev = c.events[id], marque = ev && ev.pages.every(function (p) { return !p.image.characterName && !p.image.tileId; });
                if (!ev || marque) {
                    var h = /\$gameSystem\.hour\(\) >= (\d+)/.exec(l[i + 1].parameters[1]);
                    ORPHELINES.push({ carte: n, scene: x.parameters[0].replace(/^— /, ''), cond: l[i + 1].parameters[1], id: +id, marque: !!marque, nom: ev ? String(ev.name).trim() : null, h: h ? +h[1] : 12 });
                }
            });
        });
    });
});

(async function () {
    var nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var ok = 0, ko = 0, erreurs = [], sautes = [];
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    // un contrôle qui nomme des gens : s'ils ne sont plus sur leur carte, il est sauté (et le dit)
    function absents(l) { return l.filter(function (k) { return !ici(k); }); }
    function SAUTE(t, l) { sautes.push(t); console.log('   · ' + t + '  —  ' + absents(l).map(function (k) { return nom(k) + ' (' + k + ') : ' + pourquoi(k); }).join(' · ')); }
    function VI(l, t, c, d) { if (absents(l).length) SAUTE(t, l); else V(t, c(), d && d()); }
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    var ev = function (f, a) { return page.evaluate(f, a); };
    // ⚠ Sans carte graphique, Chromium dessine le jeu à ~10 images par seconde : on n'attend
    //   pas des secondes, on attend que la chose arrive (et on dit combien de temps ça a pris)
    async function quand(f, a, max) {
        var t0 = Date.now();
        try { await page.waitForFunction(f, a, { timeout: (max || 60) * 1000, polling: 500 }); return Math.round((Date.now() - t0) / 1000); }
        catch (e) { return -1; }
    }

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title'; }, null, { timeout: 120000 });
    await ev(function () {
        DataManager.setupNewGame();
        $gameSystem._meteo = { cle: '', type: 'clair', force: 'clair' };      // beau temps : sous la pluie, on rentre
        if (window.Meteo && Meteo.figer) Meteo.figer('clair');
        SceneManager.goto(Scene_Map);
        window.__pops = [];
        var _c = Scene_Map.prototype.createCaptionWindow;
        Scene_Map.prototype.createCaptionWindow = function (t, d, txt) { window.__pops.push({ carte: $gameMap.mapId(), qui: t, texte: txt.join(' ') }); return _c.apply(this, arguments); };
        // la mesure : le temps passé à mettre la carte à jour
        window.__maj = [];
        var _u = Scene_Map.prototype.update;
        Scene_Map.prototype.update = function () { var t = performance.now(); _u.call(this); window.__maj.push(performance.now() - t); if (window.__maj.length > 4000) window.__maj.shift(); };
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && window.AlleesEtVenues && AlleesEtVenues.pret(); }, null, { timeout: 60000 });

    // aller sur une carte à une heure donnée, et laisser vivre
    async function a(carte, h, m, secondes, x, y) {
        await ev(function (p) {
            var s = $gameSystem; $gameVariables._data[s._hour_variableId] = p.h; $gameVariables._data[s._min_variableId] = p.m;
            $gameScreen.changeWeather('none', 0, 0); window.__pops = [];
            if ($gameMap.mapId() !== p.carte) $gamePlayer.reserveTransfer(p.carte, p.x, p.y, 2, 0); else { $gamePlayer.locate(p.x, p.y); $gameMap.requestRefresh(); }
        }, { carte: carte, h: h, m: m || 0, x: x, y: y });
        await page.waitForFunction(function (i) { return $gameMap.mapId() === i && SceneManager._scene instanceof Scene_Map && SceneManager._scene._spriteset && !$gamePlayer.isTransferring(); }, carte, { timeout: 30000 });
        await page.waitForTimeout(secondes * 1000);
        return ev(function () {
            return {
                copies: AlleesEtVenues.copies().filter(function (c) { return c.page >= 0; }),
                vie: VieDuVillage.etat(),
                pops: window.__pops.slice()
            };
        });
    }
    function copie(r, nomOuCle) { return r.copies.filter(function (c) { return c.cle === nomOuCle || c.nom.trim() === nomOuCle; }); }

    console.log('UNE JOURNÉE ENTIÈRE');
    console.log('── H2 · on va vraiment quelque part ──');
    var bar = await a(46, 19, 5, 22, 20, 36);
    await quand(function () { return window.__pops.length > 0; }, null, 60);
    bar.pops = await ev(function () { return window.__pops.slice(); });
    VI(['29:41'], '① le soir, Mado est au bar (sa copie, arrivée par la porte)', function () { return copie(bar, '29:41').length === 1; }, function () { return copie(bar, '29:41').map(function (c) { return '@' + c.x + ',' + c.y; }).join(''); });
    VI(['29:11', '29:34'], '④ après la porte, les gardes du jour boivent au bar', function () { return copie(bar, '29:11').length + copie(bar, '29:34').length === 2; }, function () { return 'Brunehaut ' + copie(bar, '29:11').length + ' · Rolf ' + copie(bar, '29:34').length; });
    var installes = bar.copies.filter(function (c) { return c.etat === 'la'; });
    var loin = installes.filter(function (c) { return Math.abs(c.x - c.place.x) + Math.abs(c.y - c.place.y) > 2; });   // il flâne d'une case autour de sa place
    V('⑦ chaque copie installée au bar est à sa place (personne de coincé)', installes.length > 0 && loin.length === 0, installes.length + ' installé(s)' + (loin.length ? ' · loin : ' + loin.map(function (c) { return c.nom + '@' + c.x + ',' + c.y + '→' + c.place.x + ',' + c.place.y; }).join(' ') : ''));
    var maj = await ev(function () { var l = window.__maj.slice(-600).sort(function (a, b) { return a - b; }); return { moy: l.reduce(function (a, b) { return a + b; }, 0) / l.length, p95: l[Math.floor(l.length * 0.95)] }; });
    V('⑧ au bar plein, la mise à jour de la carte reste petite', maj.p95 < 12, 'moyenne ' + maj.moy.toFixed(2) + ' ms · 95 % sous ' + maj.p95.toFixed(2) + ' ms');
    V('H4 · au bar, les scènes se jouent (des phrases flottent)', bar.pops.length > 0, bar.pops.slice(0, 3).map(function (p) { return '« ' + p.texte.slice(0, 40) + ' »'; }).join(' · '));

    var quai = await a(33, 7, 0, 18, 7, 2);
    VI(['46:26'], '② le matin, Roul pêche au ponton', function () { return copie(quai, '46:26').filter(function (c) { return c.x === 7 && c.y === 38; }).length === 1; }, function () { return copie(quai, '46:26').map(function (c) { return c.etat + '@' + c.x + ',' + c.y; }).join(''); });

    // ils quittent le Village de Pêche à 18 h ; ils traversent le Marché de 18 h 10 à 18 h 20
    var marche = await a(30, 18, 10, 1, 20, 12);
    await quand(function () { return AlleesEtVenues.copies().some(function (c) { return (c.cle === '46:22' || c.cle === '46:23') && c.page >= 0; }); }, null, 40);
    marche = await ev(function () { return { copies: AlleesEtVenues.copies().filter(function (c) { return c.page >= 0; }) }; });
    var vannier = copie(marche, '46:22').concat(copie(marche, '46:23'));
    VI(['46:22', '46:23'], '③ à 18 h, les jumeaux Vannier traversent le Marché vers le bar', function () { return vannier.length >= 1; }, function () { return vannier.map(function (c) { return c.nom + ' ' + c.etat + '@' + c.x + ',' + c.y + '→' + c.place.x + ',' + c.place.y; }).join(' · '); });

    var auberge = await a(44, 20, 0, 22, 10, 17);
    var soeurs = ['42:6', '42:7', '42:8', '43:4', '43:6', '43:7'].filter(function (k) { return copie(auberge, k).length === 1; });
    VI(['42:6', '42:7', '42:8', '43:4', '43:6', '43:7'], '⑤ le soir, les six sœurs Brémont sont à l\'auberge avec Bérénice', function () { return soeurs.length === 6; }, function () { return soeurs.length + '/6'; });

    var epicerie9 = await a(43, 9, 0, 3, 6, 13);
    var p9 = await ev(function () { return $gameMap.event(3)._pageIndex; });
    var epicerie15 = await a(43, 15, 0, 3, 6, 13);
    var p15 = await ev(function () { return { page: $gameMap.event(3)._pageIndex, image: $gameMap.event(3).characterName() }; });
    V('⑥ l\'épicerie : Hilde le matin, Kaze l\'après-midi', p9 === 0 && p15.page === 1 && p15.image === 'everyday_NPC', 'à 9 h page ' + (p9 + 1) + ' · à 15 h page ' + (p15.page + 1) + ' (' + p15.image + ')');

    console.log('── H1 · dedans ──');
    var comptoir = await ev(function () { var e = $gameMap.event(3); return { metier: e._vie && e._vie.metier, poste: e._vie && e._vie.poste }; });
    V('H1 · l\'épicier est un marchand de comptoir', comptoir.metier === 'comptoir', comptoir.metier);
    // devant le comptoir (le marchand en (8,6), le comptoir dessous) : c'est là qu'on lui parle
    await ev(function (p) { $gamePlayer.locate(p.x, p.y + 2); $gamePlayer.setDirection(8); }, comptoir.poste);
    await quand(function (p) { var e = $gameMap.event(3); return e.x === p.x && e.y === p.y; }, comptoir.poste, 40);
    var revient = await ev(function () { var e = $gameMap.event(3); return { x: e.x, y: e.y, d: e.direction() }; });
    V('H1 · le joueur approche : il revient à sa place, face au comptoir', revient.x === comptoir.poste.x && revient.y === comptoir.poste.y, '@' + revient.x + ',' + revient.y);

    console.log('── H3 · ils te voient ──');
    var ville = await a(29, 10, 0, 6, 20, 24);
    if (absents(['29:53']).length) { SAUTE('H3 · il se tourne vers toi, il s\'écarte (Mathurin, à son réverbère)', ['29:53']); }
    else {
    var tourne = await ev(function () {
        var e = $gameMap.event(53);                       // Mathurin, à son réverbère
        $gamePlayer.locate(e.x, e.y + 2); $gamePlayer.setDirection(8);
        return { x: e.x, y: e.y };
    });
    await quand(function () { return $gameMap.event(53).direction() === 2; }, null, 60);   // s'il crie l'heure, il finit d'abord
    var dir = await ev(function () { return $gameMap.event(53).direction(); });
    V('H3 · il se tourne vers toi quand tu passes à côté', dir === 2, 'Mathurin regarde ' + ({ 2: 'en bas (vers toi)', 4: 'à gauche', 6: 'à droite', 8: 'en haut' })[dir]);
    var pousse = await ev(function () {
        var e = $gameMap.event(53);                        // Mathurin, à son réverbère : il ne bouge pas de lui-même (Brunehaut est dans le pilier de sa porte : elle n'a nulle part où aller)
        var x = e.x, y = e.y;
        $gamePlayer.locate(x, y + 1); $gamePlayer.setDirection(8);
        e._vieScene = 0;
        window.__avant = { x: x, y: y };
        // le joueur pousse vers le haut, longtemps (la touche, comme Input la lit à chaque image)
        window.__pousse = true;
        if (!Input.__pousse) { Input.__pousse = true; var _u = Input.update; Input.update = function () { _u.call(this); if (window.__pousse) this._dir4 = 8; }; }
        return window.__avant;
    });
    await quand(function (p) { var e = $gameMap.event(53); return e.x !== p.x || e.y !== p.y; }, pousse, 40);
    var apres = await ev(function () { window.__pousse = false; var e = $gameMap.event(53); return { x: e.x, y: e.y }; });
    V('H3 · tu lui fonces dessus : il s\'écarte', apres.x !== pousse.x || apres.y !== pousse.y, '(' + pousse.x + ',' + pousse.y + ') → (' + apres.x + ',' + apres.y + ')');
    }
    var aub = await a(44, 10, 0, 1, 11, 13);
    var bulle = await ev(function () { var e = $gameMap.event(5); $gamePlayer.locate(e.x, e.y + 3); window.__b = 0; var _r = e.requestBalloon; e.requestBalloon = function (id) { if (id === 1) window.__b++; return _r.apply(this, arguments); }; return $gameSystem.questStatus('biere'); });
    await quand(function () { return window.__b > 0; }, null, 40);
    var vu = await ev(function () { return window.__b; });
    V('H3 · « ! » au-dessus de l\'aubergiste, qui a une quête pour toi', vu > 0, 'quête « biere » : ' + bulle + ' · ' + vu + ' « ! »');

    console.log('── H4 · H5 · les scènes de la ville ──');
    var vivante = await a(29, 14, 0, 1, 20, 26);
    await quand(function () { return window.__pops.length > 0; }, null, 90);
    vivante.pops = await ev(function () { return window.__pops.slice(); });
    V('H4 · en ville, les scènes se jouent', vivante.pops.length >= 1, vivante.pops.length + ' phrase(s) : ' + vivante.pops.slice(0, 3).map(function (p) { return '« ' + p.texte.slice(0, 34) + ' »'; }).join(' · '));
    var scenes = await ev(function () { return $gameMap.events().filter(function (e) { return /^🏘/.test(e.event().name); }).map(function (e) { return e.event().name + ' ' + e._interpreter && e._interpreter.isRunning(); }); });
    V('H4 · l\'événement « 🏘 La vie » tourne en parallèle', scenes.length === 1, scenes.join(''));
    var forge = await a(41, 11, 0, 25, 10, 11);
    var marteau = await ev(function () { return $gameMap.event(7) && $gameMap.event(7).event().name; });
    V('H5 · la forge : son événement de scènes est là', /🏘/.test(marteau || ''), marteau);

    console.log('── H6 · ils se souviennent ──');
    var souv = await ev(function () {
        // le hasard fixé (60 % de chances d'en parler : 0 sur 4, une fois sur quarante) : chacun doit en parler, une seule fois
        var hasard = Math.random; Math.random = function () { return 0.1; };
        Habitants.retenir('quete:essai', 'quete', 'Sortir de la pierre');
        var gens = $gameMap.events().filter(function (x) { return x.page() && x.page().list.some(function (c) { return c.code === 355 && /Habitants\.prep/.test(c.parameters[0]); }); });
        var parQui = gens.map(function (e) {
            var i = new Game_Interpreter(), n = 0, nom = null; i.setup(e.page().list, e.eventId());
            for (var k = 0; k < 3; k++) { Habitants.prep(i); var l = i._habSouvenir;
                // la phrase est coupée en lignes de 46 signes : « Sortir de la / pierre » peut tomber sur deux lignes, on lit la phrase entière
                var t = l ? l.filter(function (c) { return c.code === 401; }).map(function (c) { return c.parameters[0]; }).join(' ') : '';
                if (/Sortir de la pierre/.test(t)) { n++; nom = l[1].parameters[0]; } }
            return { qui: e.event().name, n: n, texte: nom };
        });
        Math.random = hasard;
        return { gens: parQui.length, disent: parQui.filter(function (p) { return p.n > 0; }), max: Math.max.apply(null, parQui.map(function (p) { return p.n; })) };
    });
    V('H6 · une quête finie se raconte, une seule fois par habitant', souv.gens > 0 && souv.disent.length === souv.gens && souv.max === 1, souv.disent.length + ' habitant(s) sur ' + souv.gens + ' en parlent, une fois chacun' + (souv.disent[0] ? ' : « ' + souv.disent[0].texte + ' »' : ''));
    var aff = await ev(function () {
        var e = $gameMap.events().filter(function (x) { return x.page() && x.page().list.some(function (c) { return c.code === 355 && /Habitants\.prep/.test(c.parameters[0]); }); })[1];
        var i = new Game_Interpreter(); i.setup(e.page().list, e.eventId());
        Habitants.prep(i); var a1 = $gameVariables.value(885);
        Habitants.prep(i); var a2 = $gameVariables.value(885);
        $gameVariables._data[$gameSystem._day_variableId] += 1;
        Habitants.prep(i); var a3 = $gameVariables.value(885);
        return [a1, a2, a3];
    });
    V('H6 · l\'affinité monte d\'un par jour où l\'on se parle (pas à chaque visite)', aff[1] === aff[0] && aff[2] === aff[0] + 1, aff.join(' → '));

    console.log('── H7 · le calendrier de la Bible ──');
    var adm = await a(29, 10, 0, 1, 20, 24);
    // les recrues (<Admission> dans leur Note) ; JOKO les a retirées (2026-11-09, voulu) : la balise est essayée en mémoire sur Fernand
    var R = await ev(function () {
        var ids = $gameMap.events().filter(function (e) { return /<Admission>/i.test(e.event().note || ''); }).map(function (e) { return e.eventId(); });
        if (ids.length) return { ids: ids, plantee: false };
        var f = $gameMap.event(29); if (!f) return { ids: [], plantee: true };
        var d = f.event(); window.__noteFernand = d.note;
        d.note = (d.note ? d.note + '\n' : '') + '<Admission>'; f._habHoraire = undefined; $gameMap.requestRefresh();
        return { ids: [29], plantee: true, nom: String(d.name).trim() };
    });
    await page.waitForTimeout(11000);
    var recrues = await ev(function (ids) { return ids.filter(function (i) { return $gameMap.event(i)._pageIndex >= 0; }).length; }, R.ids);
    var estAdm = await ev(function () { return Habitants.admission(); });
    var quiAdm = R.plantee ? '<Admission> posée en mémoire sur ' + (R.nom || '?') + ' (les 4 recrues : retirées par JOKO)' : R.ids.length + ' recrue(s)';
    V('H7 · la semaine d\'Admission, les recrues sont en ville', estAdm && R.ids.length > 0 && recrues === R.ids.length, 'Admission : ' + estAdm + ' · ' + recrues + '/' + R.ids.length + ' · ' + quiAdm);
    await ev(function () { $gameVariables._data[$gameSystem._day_variableId] = 15; $gameMap.requestRefresh(); });
    // elles rentrent à pied : on attend qu'elles aient passé la porte
    await quand(function (ids) { return ids.every(function (i) { return $gameMap.event(i)._pageIndex < 0; }); }, R.ids, 120);
    var parties = await ev(function (ids) { return { adm: Habitants.admission(), la: ids.filter(function (i) { return $gameMap.event(i)._pageIndex >= 0; }).length }; }, R.ids);
    V('H7 · l\'Admission finie, elles repartent (à pied, par la porte)', !parties.adm && R.ids.length > 0 && parties.la === 0, 'jour 15 : ' + parties.la + '/' + R.ids.length + ' encore là');
    if (R.plantee) {
        // contre-épreuve : la balise retirée, le même jour 15, il est de nouveau là (c'est bien elle qui le faisait partir)
        var sans = await ev(function () { var f = $gameMap.event(29); if (!f) return null; f.event().note = window.__noteFernand; f._habHoraire = undefined; $gameMap.requestRefresh(); return Habitants.present(f); });
        V('H7 · contre-épreuve : sans la balise <Admission>, ' + (R.nom || 'il') + ' reste en ville le jour 15', sans === true, 'présent : ' + sans);
    }
    var veil = await ev(function () {
        var s = $gameSystem; $gameVariables._data[s._month_variableId] = 8; $gameVariables._data[s._day_variableId] = 30; $gameVariables._data[s._hour_variableId] = 22;
        return Habitants.veillee();
    });
    await page.waitForTimeout(1500);
    var dehors = await ev(function () { return VieDuVillage.etat().filter(function (e) { return e.metier === 'villageois' && e.but === 'place'; }).length; });
    V('H7 · la Veillée du Retour : à 22 h, on veille sur la place', veil && dehors > 0, dehors + ' villageois sur la place à 22 h');
    var repos = await ev(function () { $gameVariables._data[$gameSystem._day_week_variableId] = 0; return VieDuVillage.repos(); });
    V('H7 · le dimanche est bien le jour de repos (le v1 ne le voyait jamais)', repos === true, 'day_week ' + 1);

    console.log('── ⑨ les scènes de ceux qui ne sont plus là ──');
    // chaque scène qui nomme un absent (ou une marque sans image) : sa condition, à son heure, le joueur à côté, le hasard à 0 — jamais vraie
    var parCarteO = {}; ORPHELINES.forEach(function (o) { (parCarteO[o.carte] = parCarteO[o.carte] || []).push(o); });
    var jouees = [], essayees = 0, contre = null;
    for (var co of Object.keys(parCarteO)) {
        await a(+co, parCarteO[co][0].h, 30, 1, 20, 20);
        var rr = await ev(function (l) {
            var hasard = Math.random, res = { jouees: [], n: 0, contre: null };
            Math.random = function () { return 0; };
            l.forEach(function (o) {
                $gameVariables._data[$gameSystem._hour_variableId] = o.h;
                var e = $gameMap.event(o.id);
                if (e) $gamePlayer.locate(e.x, e.y + 1);
                res.n++;
                var v = false; try { v = !!eval(o.cond); } catch (err) { v = 'erreur : ' + err.message; }
                if (v) res.jouees.push(o.scene + ' → ' + v);
                // contre-épreuve : la marque à qui l'on rend une image (en mémoire, le temps d'un calcul) — la scène serait jouée
                if (o.marque && e && !res.contre) {
                    e.setImage('People1', 0);
                    try { res.contre = { scene: o.scene, jouee: !!eval(o.cond) }; } catch (err) { res.contre = { scene: o.scene, jouee: 'erreur : ' + err.message }; }
                    e.setImage('', 0);
                }
            });
            Math.random = hasard;
            return res;
        }, parCarteO[co]);
        jouees = jouees.concat(rr.jouees); essayees += rr.n; if (rr.contre) contre = rr.contre;
    }
    V('⑨ une scène dont la personne n\'est plus là ne se joue jamais (retirée, ou son numéro devenu une marque sans image)', !jouees.length && (!ORPHELINES.some(function (o) { return o.marque; }) || (contre && contre.jouee === true)),
        essayees + ' scène(s) : ' + ORPHELINES.map(function (o) { return '« ' + o.scene + ' » (' + o.carte + ':' + o.id + (o.marque ? ', la marque « ' + o.nom + ' »' : ', retiré') + ')'; }).join(', ') +
        (jouees.length ? ' — ✗ jouée : ' + jouees.join(' | ') : ' — aucune ne se joue') + (contre ? ' · la marque avec une image la jouerait : ' + contre.jouee : ''));

    console.log('── sauvegarder, recharger ──');
    // en ville, à 10 h : Casimir (du bar) fait sa ronde, Béran aussi ; on sauvegarde, on recharge
    await a(29, 10, 0, 4, 20, 24);
    await quand(function () { return AlleesEtVenues.copies().some(function (c) { return c.page >= 0; }); }, null, 60);
    var sauve = await ev(function () { DataManager.saveGame(1); var brut = StorageManager.load(1); return { copies: AlleesEtVenues.copies().filter(function (c) { return c.page >= 0; }).length, dedans: (brut.match(/_visite/g) || []).length }; });
    V('une sauvegarde ne garde aucune copie de passage (elles se refont au chargement)', sauve.copies > 0 && sauve.dedans === 0, sauve.copies + ' copie(s) sur la carte · ' + sauve.dedans + ' dans la sauvegarde');
    await ev(function () { DataManager.loadGame(1); SceneManager.goto(Scene_Map); });
    await quand(function () { return SceneManager._scene instanceof Scene_Map && SceneManager._scene._spriteset && $gameMap._vieRecensee && AlleesEtVenues.copies().some(function (c) { return c.page >= 0; }); }, null, 60);
    var pos0 = await ev(function () { var e = $gameMap.event(36), copies = AlleesEtVenues.copies().filter(function (c) { return c.page >= 0; }).length; if (!e) return { absent: true, copies: copies }; return { vrai: $gameMap._viePNJ.indexOf(e) >= 0, x: e.x, y: e.y, copies: copies }; });
    var vivant = pos0.absent ? -1 : await quand(function (p) { var e = $gameMap.event(36); return e.x !== p.x || e.y !== p.y; }, pos0, 150);
    VI(['29:36'], 'après un chargement, VieDuVillage pilote les vrais événements, et Béran reprend sa ronde', function () { return pos0.vrai && vivant >= 0 && pos0.copies > 0; }, function () { return (pos0.vrai ? 'le vrai Béran' : 'une copie figée') + ' · ' + (vivant >= 0 ? 'il a bougé après ' + vivant + ' s' : 'il n\'a pas bougé') + ' · ' + pos0.copies + ' copie(s) refaites (' + sauve.copies + ' avant)'; });
    V('… et autant de copies qu\'avant (aucune ne ressort par la porte en arrivant)', pos0.copies <= sauve.copies + 1, pos0.copies + ' après · ' + sauve.copies + ' avant');

    var vraies = erreurs.filter(function (e) { return !/process is not defined/.test(e); });
    V('aucune erreur JavaScript de toute la journée', vraies.length === 0, vraies.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)' + (sautes.length ? ' · ' + sautes.length + ' sauté(s) : la personne n\'est plus sur sa carte' : '') + '\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
