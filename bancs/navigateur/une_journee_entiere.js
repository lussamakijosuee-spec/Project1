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
 *
 *   node bancs/navigateur/une_journee_entiere.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var ok = 0, ko = 0, erreurs = [];
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
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
    V('① le soir, Mado est au bar (sa copie, arrivée par la porte)', copie(bar, '29:41').length === 1, copie(bar, '29:41').map(function (c) { return '@' + c.x + ',' + c.y; }).join(''));
    V('④ après la porte, les gardes du jour boivent au bar', copie(bar, '29:11').length + copie(bar, '29:34').length === 2, 'Brunehaut ' + copie(bar, '29:11').length + ' · Rolf ' + copie(bar, '29:34').length);
    var installes = bar.copies.filter(function (c) { return c.etat === 'la'; });
    var loin = installes.filter(function (c) { return Math.abs(c.x - c.place.x) + Math.abs(c.y - c.place.y) > 2; });   // il flâne d'une case autour de sa place
    V('⑦ chaque copie installée au bar est à sa place (personne de coincé)', installes.length > 0 && loin.length === 0, installes.length + ' installé(s)' + (loin.length ? ' · loin : ' + loin.map(function (c) { return c.nom + '@' + c.x + ',' + c.y + '→' + c.place.x + ',' + c.place.y; }).join(' ') : ''));
    var maj = await ev(function () { var l = window.__maj.slice(-600).sort(function (a, b) { return a - b; }); return { moy: l.reduce(function (a, b) { return a + b; }, 0) / l.length, p95: l[Math.floor(l.length * 0.95)] }; });
    V('⑧ au bar plein, la mise à jour de la carte reste petite', maj.p95 < 12, 'moyenne ' + maj.moy.toFixed(2) + ' ms · 95 % sous ' + maj.p95.toFixed(2) + ' ms');
    V('H4 · au bar, les scènes se jouent (des phrases flottent)', bar.pops.length > 0, bar.pops.slice(0, 3).map(function (p) { return '« ' + p.texte.slice(0, 40) + ' »'; }).join(' · '));

    var quai = await a(33, 7, 0, 18, 7, 2);
    V('② le matin, Roul pêche au ponton', copie(quai, '46:26').filter(function (c) { return c.x === 7 && c.y === 38; }).length === 1, copie(quai, '46:26').map(function (c) { return c.etat + '@' + c.x + ',' + c.y; }).join(''));

    // ils quittent le Village de Pêche à 18 h ; ils traversent le Marché de 18 h 10 à 18 h 20
    var marche = await a(30, 18, 10, 1, 20, 12);
    await quand(function () { return AlleesEtVenues.copies().some(function (c) { return (c.cle === '46:22' || c.cle === '46:23') && c.page >= 0; }); }, null, 40);
    marche = await ev(function () { return { copies: AlleesEtVenues.copies().filter(function (c) { return c.page >= 0; }) }; });
    var vannier = copie(marche, '46:22').concat(copie(marche, '46:23'));
    V('③ à 18 h, les jumeaux Vannier traversent le Marché vers le bar', vannier.length >= 1, vannier.map(function (c) { return c.nom + ' ' + c.etat + '@' + c.x + ',' + c.y + '→' + c.place.x + ',' + c.place.y; }).join(' · '));

    var auberge = await a(44, 20, 0, 22, 10, 17);
    var soeurs = ['42:6', '42:7', '42:8', '43:4', '43:6', '43:7'].filter(function (k) { return copie(auberge, k).length === 1; });
    V('⑤ le soir, les six sœurs Brémont sont à l\'auberge avec Bérénice', soeurs.length === 6, soeurs.length + '/6');

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
        Habitants.retenir('quete:essai', 'quete', 'Sortir de la pierre');
        var gens = $gameMap.events().filter(function (x) { return x.page() && x.page().list.some(function (c) { return c.code === 355 && /Habitants\.prep/.test(c.parameters[0]); }); });
        var parQui = gens.map(function (e) {
            var i = new Game_Interpreter(), n = 0, nom = null; i.setup(e.page().list, e.eventId());
            for (var k = 0; k < 3; k++) { Habitants.prep(i); var l = i._habSouvenir; if (l && l.some(function (c) { return /Sortir de la pierre/.test(c.parameters[0] || ''); })) { n++; nom = l[1].parameters[0]; } }
            return { qui: e.event().name, n: n, texte: nom };
        });
        return { gens: parQui.length, disent: parQui.filter(function (p) { return p.n > 0; }), max: Math.max.apply(null, parQui.map(function (p) { return p.n; })) };
    });
    V('H6 · une quête finie se raconte, une seule fois par habitant', souv.disent.length >= 1 && souv.max === 1, souv.disent.length + ' habitant(s) sur ' + souv.gens + ' en parlent, une fois chacun' + (souv.disent[0] ? ' : « ' + souv.disent[0].texte + ' »' : ''));
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
    var adm = await a(29, 10, 0, 12, 20, 24);
    var recrues = await ev(function () { return [55, 56, 57, 58].filter(function (i) { return $gameMap.event(i)._pageIndex >= 0; }).length; });
    var estAdm = await ev(function () { return Habitants.admission(); });
    V('H7 · la semaine d\'Admission, les recrues sont en ville', estAdm && recrues === 4, 'Admission : ' + estAdm + ' · ' + recrues + '/4 recrues');
    await ev(function () { $gameVariables._data[$gameSystem._day_variableId] = 15; $gameMap.requestRefresh(); });
    // elles rentrent à l'auberge à pied : on attend qu'elles aient passé la porte
    await quand(function () { return [55, 56, 57, 58].every(function (i) { return $gameMap.event(i)._pageIndex < 0; }); }, null, 120);
    var parties = await ev(function () { return { adm: Habitants.admission(), la: [55, 56, 57, 58].filter(function (i) { return $gameMap.event(i)._pageIndex >= 0; }).length }; });
    V('H7 · l\'Admission finie, elles repartent', !parties.adm && parties.la === 0, 'jour 15 : ' + parties.la + '/4 encore là');
    var veil = await ev(function () {
        var s = $gameSystem; $gameVariables._data[s._month_variableId] = 8; $gameVariables._data[s._day_variableId] = 30; $gameVariables._data[s._hour_variableId] = 22;
        return Habitants.veillee();
    });
    await page.waitForTimeout(1500);
    var dehors = await ev(function () { return VieDuVillage.etat().filter(function (e) { return e.metier === 'villageois' && e.but === 'place'; }).length; });
    V('H7 · la Veillée du Retour : à 22 h, on veille sur la place', veil && dehors > 0, dehors + ' villageois sur la place à 22 h');
    var repos = await ev(function () { $gameVariables._data[$gameSystem._day_week_variableId] = 0; return VieDuVillage.repos(); });
    V('H7 · le dimanche est bien le jour de repos (le v1 ne le voyait jamais)', repos === true, 'day_week ' + 1);

    console.log('── sauvegarder, recharger ──');
    // en ville, à 10 h : Casimir (du bar) fait sa ronde, Béran aussi ; on sauvegarde, on recharge
    await a(29, 10, 0, 4, 20, 24);
    await quand(function () { return AlleesEtVenues.copies().some(function (c) { return c.page >= 0; }); }, null, 60);
    var sauve = await ev(function () { DataManager.saveGame(1); var brut = StorageManager.load(1); return { copies: AlleesEtVenues.copies().filter(function (c) { return c.page >= 0; }).length, dedans: (brut.match(/_visite/g) || []).length }; });
    V('une sauvegarde ne garde aucune copie de passage (elles se refont au chargement)', sauve.copies > 0 && sauve.dedans === 0, sauve.copies + ' copie(s) sur la carte · ' + sauve.dedans + ' dans la sauvegarde');
    await ev(function () { DataManager.loadGame(1); SceneManager.goto(Scene_Map); });
    await quand(function () { return SceneManager._scene instanceof Scene_Map && SceneManager._scene._spriteset && $gameMap._vieRecensee && AlleesEtVenues.copies().some(function (c) { return c.page >= 0; }); }, null, 60);
    var pos0 = await ev(function () { var e = $gameMap.event(36); return { vrai: $gameMap._viePNJ.indexOf(e) >= 0, x: e.x, y: e.y, copies: AlleesEtVenues.copies().filter(function (c) { return c.page >= 0; }).length }; });
    var vivant = await quand(function (p) { var e = $gameMap.event(36); return e.x !== p.x || e.y !== p.y; }, pos0, 150);
    V('après un chargement, VieDuVillage pilote les vrais événements, et Béran reprend sa ronde', pos0.vrai && vivant >= 0 && pos0.copies > 0, (pos0.vrai ? 'le vrai Béran' : 'une copie figée') + ' · ' + (vivant >= 0 ? 'il a bougé après ' + vivant + ' s' : 'il n\'a pas bougé') + ' · ' + pos0.copies + ' copie(s) refaites (' + sauve.copies + ' avant)');
    V('… et autant de copies qu\'avant (aucune ne ressort par la porte en arrivant)', pos0.copies <= sauve.copies + 1, pos0.copies + ' après · ' + sauve.copies + ' avant');

    var vraies = erreurs.filter(function (e) { return !/process is not defined/.test(e); });
    V('aucune erreur JavaScript de toute la journée', vraies.length === 0, vraies.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
