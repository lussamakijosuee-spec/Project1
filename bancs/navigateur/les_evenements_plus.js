/*
 * EVENEMENTSPLUS, DANS LE VRAI MOTEUR (carte 29, Ville Forestière)
 * ---------------------------------------------------------------------------
 *   ① <Modèle: 70, n> : l'événement prend les pages de la recette n de la
 *     vitrine ; sans la balise, il garde les siennes (contre-épreuve)
 *   ② MODELE changer / off, gardé dans $gameSystem
 *   ③ MODELE poser : une copie apparaît, avec son image, sur la bonne case
 *   ④ APPEL : la page d'un autre événement est jouée, puis la suite
 *   ⑤ LOCALE : chaque événement a ses nombres (l'autre reste à 0)
 *   ⑥ <Étiquette: …> : invisible de loin, visible de près
 *   ⑦ <Taille: 3x2> : touché sur toute sa surface, pas au-delà
 *   ⑧ <Glissant: r> : un pas sur la glace mène jusqu'au mur ; sans la
 *     balise, un seul pas (contre-épreuve)
 *   ⑨ <Pas: son> : un son à chaque pas
 *   ⑩ <si: …> en commentaire de page : la page compte quand c'est vrai et
 *     plus quand c'est faux (variable, interrupteur local, variable locale
 *     via LOCALE) ; une condition illisible ferme sa page sans planter
 *   ⑪ <Clic> : un clic sur l'événement le lance sur place ; sans la balise,
 *     le joueur part marcher (contre-épreuve)
 *   ⑫ <Décalage: 0, -12> : l'image monte de 12 px, la case ne bouge pas ;
 *     sans la balise, rien ne bouge
 *   ⑬ <Région: 9> : un pas sur la région 9 lance l'événement ; un pas
 *     ailleurs, ou la touche OK sur place, non
 *   ⑭ CHRONO pause / reprendre / ajouter / retirer
 *
 *   node bancs/navigateur/les_evenements_plus.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    var ev = function (f, a) { return page.evaluate(f, a); };
    async function commande(texte, evId) {
        await ev(function (a) { $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: [a.t] }, { code: 0, indent: 0, parameters: [] }], a.e || 0); }, { t: texte, e: evId });
        await page.waitForTimeout(300);
    }

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    await ev(function () { DataManager.setupNewGame(); $gameSystem._meteo = { force: 'clair' }; $gamePlayer.reserveTransfer(29, 10, 10, 2, 0); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1200);
    console.log('EVENEMENTSPLUS');

    // un événement de la ville, et une recette de la vitrine qui a une image
    var base = await ev(function () {
        var e = $gameMap.events().filter(function (e) { return e.characterName() && !/<Mod/i.test(e.event().note); })[2];
        var v = EvenementsPlus.modeles[70], r = null;
        for (var i = 1; i < v.events.length && !r; i++) { var x = v.events[i]; if (x && x.pages[0].image.characterName && x.pages[0].image.characterName !== e.characterName() && x.pages[0].list.length > 3 && !/▬/.test(x.name)) r = x; }
        return { id: e.eventId(), image: e.characterName(), recette: r.id, imageRecette: r.pages[0].image.characterName, nbPages: r.pages.length, nom: r.name };
    });

    console.log('\n── ① modèles ──');
    var m1 = await ev(function (b) {
        var d = $dataMap.events[b.id], e = $gameMap.event(b.id), avant = e.event().pages;
        d.note += '\n<Modèle: 70, ' + b.recette + '>';
        e._epNoteLue = null; e._pageIndex = -2; e.refresh();
        var apres = e.event().pages;
        return { meme: apres === EvenementsPlus.modeles[70].events[b.recette].pages, image: e.characterName(), change: apres !== avant };
    }, base);
    V('<Modèle: 70, ' + base.recette + '> : l\'événement ' + base.id + ' prend les pages de « ' + base.nom + ' »', m1.meme && m1.image === base.imageRecette, 'mêmes pages : ' + m1.meme + ' · image ' + base.image + ' → ' + m1.image);
    var m2 = await ev(function (b) {
        var d = $dataMap.events[b.id], e = $gameMap.event(b.id);
        d.note = d.note.replace(/\n<Modèle:[^>]*>/, ''); e._epNoteLue = null; e._epCle = null; e._pageIndex = -2; e.refresh();
        return { image: e.characterName(), siennes: e.event().pages === d.pages };
    }, base);
    V('contre-épreuve : balise retirée, il reprend ses propres pages', m2.siennes && m2.image === base.image, 'image ' + m2.image);

    console.log('\n── ② MODELE changer ──');
    await commande('MODELE changer ' + base.id + ' 70 ' + base.recette);
    var c1 = await ev(function (b) { var e = $gameMap.event(b.id); return { avec: e.characterName(), garde: !!$gameSystem._epMorphes[$gameMap.mapId() + ':' + b.id] }; }, base);
    await commande('MODELE changer ' + base.id + ' off');
    c1.sans = await ev(function (b) { return $gameMap.event(b.id).characterName(); }, base);
    V('MODELE changer : il devient le modèle, gardé dans la sauvegarde ; off le rend', c1.avec === base.imageRecette && c1.garde && c1.sans === base.image, c1.sans + ' → ' + c1.avec + ' → ' + c1.sans);

    console.log('\n── ③ MODELE poser ──');
    var n0 = await ev(function () { return $gameMap.events().length; });
    await commande('MODELE poser 70 ' + base.recette + ' 12 9');
    var p1 = await ev(function (n) {
        var ici = $gameMap.eventsXy(12, 9).filter(function (e) { return e.eventId() >= $dataMap.events.length - 1; });
        var sprite = SceneManager._scene._spriteset._characterSprites.some(function (s) { return ici[0] && s._character === ici[0]; });
        return { avant: n, apres: $gameMap.events().length, ici: ici.length, image: ici[0] && ici[0].characterName(), sprite: sprite };
    }, n0);
    V('une copie apparaît en 12,9, avec son image et son sprite', p1.apres === p1.avant + 1 && p1.ici === 1 && p1.image === base.imageRecette && p1.sprite, p1.avant + ' → ' + p1.apres + ' événements');

    console.log('\n── ④ APPEL ──');
    var a1 = await ev(function (b) {
        var cible = $gameMap.events().filter(function (e) { return e.eventId() !== b.id; })[0];
        window.__ordre = [];
        $dataMap.events[cible.eventId()].pages.push({ conditions: cible.event().pages[0].conditions, directionFix: false, image: cible.event().pages[0].image, list: [{ code: 355, indent: 0, parameters: ['window.__ordre.push("appelé")'] }, { code: 0, indent: 0, parameters: [] }], moveFrequency: 3, moveRoute: { list: [{ code: 0 }], repeat: true, skippable: false, wait: false }, moveSpeed: 3, moveType: 0, priorityType: 1, stepAnime: false, through: false, trigger: 0, walkAnime: true });
        var n = $dataMap.events[cible.eventId()].pages.length;
        $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['APPEL ' + cible.eventId() + ' ' + n] }, { code: 355, indent: 0, parameters: ['window.__ordre.push("après")'] }, { code: 0, indent: 0, parameters: [] }], b.id);
        return cible.eventId();
    }, base);
    await page.waitForTimeout(500);
    var a2 = await ev(function () { return window.__ordre.join(' → '); });
    V('APPEL joue la page de l\'événement ' + a1 + ', puis reprend la suite', a2 === 'appelé → après', a2);

    console.log('\n── ⑤ LOCALE ──');
    await ev(function (b) {
        $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['LOCALE visites + 1'] }, { code: 356, indent: 0, parameters: ['LOCALE visites + 1'] },
            { code: 355, indent: 0, parameters: ['window.__lv = [this.locale("visites"), this.locale("visites", null, 999)]'] }, { code: 0, indent: 0, parameters: [] }], b.id);
    }, base);
    await page.waitForTimeout(400);
    var l1 = await ev(function () { return window.__lv; });
    V('« LOCALE visites + 1 » deux fois : 2 pour cet événement, 0 pour un autre', l1 && l1[0] === 2 && l1[1] === 0, JSON.stringify(l1));

    console.log('\n── ⑥ étiquettes ──');
    var cibleE = await ev(function (b) {
        var e = $gameMap.event(b.id); $dataMap.events[b.id].note += '\n<Étiquette: Forgeron>'; e._epNoteLue = null; e._epEtiq = undefined;
        $gamePlayer.locate(Math.max(0, e.x - 10), e.y); return { x: e.x, y: e.y };
    }, base);
    await page.waitForTimeout(800);
    var loin = await ev(function (b) { var s = SceneManager._scene._spriteset._characterSprites.filter(function (s) { return s._character === $gameMap.event(b.id); })[0]; return s && s._epEtiq ? s._epEtiq.opacity : -1; }, base);
    await ev(function (c) { $gamePlayer.locate(c.x, c.y + 1); }, cibleE);
    await page.waitForTimeout(800);
    var pres = await ev(function (b) { var s = SceneManager._scene._spriteset._characterSprites.filter(function (s) { return s._character === $gameMap.event(b.id); })[0]; return s && s._epEtiq ? { o: s._epEtiq.opacity, t: s._epEtiq._texte } : null; }, base);
    V('<Étiquette: Forgeron> : invisible à 10 cases, visible à côté', loin <= 0 && pres && pres.o >= 200 && pres.t === 'Forgeron', 'opacité de loin ' + loin + ', de près ' + (pres && pres.o));

    console.log('\n── ⑦ gros événements ──');
    var t1 = await ev(function (b) {
        var e = $gameMap.event(b.id); $dataMap.events[b.id].note += '\n<Taille: 3x2>'; e._epNoteLue = null; e._epTaille = undefined;
        return { centre: e.pos(e.x, e.y), gauche: e.pos(e.x - 1, e.y), haut: e.pos(e.x + 1, e.y - 1), dehors: e.pos(e.x + 2, e.y), dessous: e.pos(e.x, e.y + 1) };
    }, base);
    V('<Taille: 3x2> : occupe 3×2 cases au-dessus de ses pieds, pas une de plus', t1.centre && t1.gauche && t1.haut && !t1.dehors && !t1.dessous, JSON.stringify(t1));

    console.log('\n── ⑧ sols glissants ──');
    async function glisser(avecNote) {
        return ev(function (avec) {
            // un couloir libre de 6 cases, région 7
            var w = $gameMap.width(), h = $gameMap.height(), c = null;
            for (var y = 2; y < h - 2 && !c; y++) for (var x = 2; x < w - 9 && !c; x++) {
                var ok = true;
                for (var k = 0; k < 7 && ok; k++) if (!$gameMap.isPassable(x + k, y, 6) || !$gameMap.isPassable(x + k + 1, y, 4) || $gameMap.eventsXy(x + k, y).length || $gameMap.eventsXy(x + k + 1, y).length) ok = false;
                if (ok && (!$gameMap.isPassable(x + 7, y, 6) || true)) c = { x: x, y: y };
            }
            for (var k = 0; k < 6; k++) $dataMap.data[(5 * h + c.y) * w + c.x + k] = 7;
            $dataMap.note = avec ? '<Glissant: 7>' : '';
            $gameMap._epGlisseCarte = null;
            $gamePlayer.locate(c.x, c.y); $gamePlayer.setDirection(6);
            window.__depart = c;
            return c;
        }, avecNote);
    }
    var g0 = await glisser(true);
    await page.keyboard.down('ArrowRight'); await page.waitForTimeout(120); await page.keyboard.up('ArrowRight');
    await page.waitForTimeout(2500);
    var g1 = await ev(function () { return $gamePlayer.x - window.__depart.x; });
    var g2d = await glisser(false);
    await page.keyboard.down('ArrowRight'); await page.waitForTimeout(120); await page.keyboard.up('ArrowRight');
    await page.waitForTimeout(1500);
    var g2 = await ev(function () { return $gamePlayer.x - window.__depart.x; });
    V('<Glissant: 7> : un appui, et le joueur glisse sur toute la glace', g1 >= 5, g1 + ' cases parcourues');
    V('contre-épreuve : sans la balise, un seul pas', g2 === 1, g2 + ' case(s)');

    console.log('\n── ⑨ bruits de pas ──');
    var p9 = await ev(function () {
        $dataMap.note = '<Pas: Cursor1>'; window.__sons = [];
        var _se = AudioManager.playSe; AudioManager.playSe = function (s) { window.__sons.push(s.name); _se.call(this, s); };
        $gamePlayer.increaseSteps(); $gamePlayer.increaseSteps();
        $dataMap.note = ''; $gamePlayer.increaseSteps();
        AudioManager.playSe = _se;
        return window.__sons;
    });
    V('<Pas: Cursor1> : un son par pas ; sans la balise, aucun', p9.filter(function (s) { return s === 'Cursor1'; }).length === 2, JSON.stringify(p9));

    console.log('\n── ⑩ conditions de page <si: …> ──');
    var idSi = await ev(function (b) {
        var modele = $dataMap.events[b.id].pages[0];
        function pageAvec(cond) {
            var p = JSON.parse(JSON.stringify(modele));
            ['switch1Valid', 'switch2Valid', 'variableValid', 'selfSwitchValid', 'itemValid', 'actorValid'].forEach(function (k) { p.conditions[k] = false; });
            p.list = (cond ? [{ code: 108, indent: 0, parameters: [cond] }] : []).concat([{ code: 0, indent: 0, parameters: [] }]);
            return p;
        }
        var id = Math.max($dataMap.events.length, $gameMap._events.length);
        $dataMap.events[id] = { id: id, name: 'essai <si>', note: '', meta: {}, x: 2, y: 2,
            pages: [pageAvec(''), pageAvec('<si: v[40] >= 5 && !ss[B]>'), pageAvec('<si: lv[visites] >= 3>'), pageAvec('<si: (( illisible>')] };
        $gameMap._events[id] = new Game_Event($gameMap.mapId(), id);
        $gameVariables.setValue(40, 0);
        return id;
    }, base);
    async function pageSi() { await page.waitForTimeout(150); return ev(function (id) { return $gameMap.event(id).findProperPageIndex() + 1; }, idSi); }
    var p0 = await pageSi();
    await ev(function () { $gameVariables.setValue(40, 5); });
    var p1 = await pageSi();
    await ev(function (id) { $gameSelfSwitches.setValue([$gameMap.mapId(), id, 'B'], true); }, idSi);
    var p1b = await pageSi();
    await ev(function (id) { $gameSelfSwitches.setValue([$gameMap.mapId(), id, 'B'], false); }, idSi);
    V('<si: v[40] >= 5 && !ss[B]> : page 1 à v40 = 0, page 2 à v40 = 5, page 1 si l\'interrupteur local B s\'allume', p0 === 1 && p1 === 2 && p1b === 1, 'pages ' + [p0, p1, p1b].join(' → '));
    await commande('LOCALE visites + 1', idSi); await commande('LOCALE visites + 1', idSi);
    var p2 = await pageSi();
    await commande('LOCALE visites + 1', idSi);
    var p3 = await pageSi();
    V('<si: lv[visites] >= 3> : à 2 visites toujours la page 2, à la 3e la page 3', p2 === 2 && p3 === 3, 'pages ' + p2 + ' → ' + p3);
    await ev(function () { $gameVariables.setValue(40, 2); });
    await commande('LOCALE visites = 0', idSi);
    var p4 = await pageSi();
    V('contre-épreuve : visites remises à 0 et v40 à 2, retour à la page 1 ; la page illisible (4) ne s\'ouvre jamais', p4 === 1 && [p0, p1, p1b, p2, p3, p4].indexOf(4) < 0, 'page ' + p4);

    // un événement d'essai posé sur la carte (meta : GALV_ActionIndicators la lit)
    async function poserEssai(note, x, y, marque) {
        return ev(function (a) {
            var p = JSON.parse(JSON.stringify($dataMap.events[a.base].pages[0]));
            ['switch1Valid', 'switch2Valid', 'variableValid', 'selfSwitchValid', 'itemValid', 'actorValid'].forEach(function (k) { p.conditions[k] = false; });
            p.trigger = 0; p.priorityType = 1;
            p.list = [{ code: 355, indent: 0, parameters: ['window.__ess = (window.__ess || []).concat("' + a.marque + '")'] }, { code: 0, indent: 0, parameters: [] }];
            var id = Math.max($dataMap.events.length, $gameMap._events.length);
            var d = { id: id, name: 'essai', note: a.note, x: a.x, y: a.y, pages: [p] };
            DataManager.extractMetadata(d);
            $dataMap.events[id] = d;
            var e = new Game_Event($gameMap.mapId(), id); $gameMap._events[id] = e;
            var sc = SceneManager._scene._spriteset, sp = new Sprite_Character(e);
            sc._characterSprites.push(sp); sc._tilemap.addChild(sp);
            return id;
        }, { base: base.id, note: note, x: x, y: y, marque: marque });
    }
    // des cases libres près du joueur
    var cases = await ev(function () {
        var px = $gamePlayer.x, py = $gamePlayer.y, l = [];
        for (var dy = -3; dy <= 3; dy++) for (var dx = -5; dx <= 5; dx++) {
            var x = px + dx, y = py + dy;
            if ((dx || dy) && $gameMap.isValid(x, y) && !$gameMap.eventsXy(x, y).length && $gameMap.isPassable(x, y, 2)) l.push([x, y]);
        }
        return { joueur: [px, py], libres: l };
    });

    console.log('\n── ⑪ <Clic> ──');
    await ev(function () { window.__ess = []; $gameTemp.clearDestination(); });
    var loin = cases.libres.filter(function (c) { return Math.abs(c[0] - cases.joueur[0]) + Math.abs(c[1] - cases.joueur[1]) >= 3; });
    var idClic = await poserEssai('<Clic>', loin[0][0], loin[0][1], 'clic');
    var idSans = await poserEssai('', loin[1][0], loin[1][1], 'sans');
    await page.waitForTimeout(400);
    async function cliquer(id) {
        var pt = await ev(function (id) { var e = $gameMap.event(id); return { x: e.screenX(), y: e.screenY() - 20 }; }, id);
        // un vrai clic tient le bouton quelques images : MV ne pose sa destination
        // que si le bouton est encore enfoncé quand il lit la souris
        // on regarde JUSTE après : sans <Clic>, MV fait marcher le joueur jusqu'à
        // l'événement et le lance à l'arrivée — c'est le comportement normal
        await page.mouse.move(pt.x, pt.y); await page.mouse.down(); await page.waitForTimeout(120); await page.mouse.up();
        await page.waitForTimeout(60);
        var r = await ev(function () { return { ess: (window.__ess || []).slice(), dest: $gameTemp.isDestinationValid() }; });
        await page.waitForTimeout(1500);
        return r;
    }
    var k1 = await cliquer(idClic);
    await ev(function () { $gameTemp.clearDestination(); $gamePlayer.locate($gamePlayer.x, $gamePlayer.y); });
    await ev(function () { window.__ess = []; });
    var k2 = await cliquer(idSans);
    await ev(function () { $gameTemp.clearDestination(); });
    V('<Clic> : un clic dessus le lance sur place, sans faire marcher le joueur', k1.ess.join() === 'clic' && !k1.dest, JSON.stringify(k1));
    V('contre-épreuve : sans la balise, le clic fait d\'abord marcher le joueur (rien de lancé sur le coup)', k2.ess.length === 0 && k2.dest, JSON.stringify(k2));

    console.log('\n── ⑫ <Décalage: 0, -12> ──');
    var idDec = await poserEssai('<Décalage: 0, -12>', loin[2][0], loin[2][1], 'dec');
    var dec = await ev(function (a) {
        function m(id) { var e = $gameMap.event(id); return { x: e.screenX() - Game_CharacterBase.prototype.screenX.call(e), y: e.screenY() - Game_CharacterBase.prototype.screenY.call(e), cx: e.x, cy: e.y }; }
        return { avec: m(a.d), sans: m(a.s) };
    }, { d: idDec, s: idSans });
    V('<Décalage: 0, -12> : l\'image monte de 12 px, la case reste la même', dec.avec.x === 0 && dec.avec.y === -12 && dec.avec.cx === loin[2][0] && dec.avec.cy === loin[2][1], JSON.stringify(dec.avec));
    V('contre-épreuve : sans la balise, aucun décalage', dec.sans.x === 0 && dec.sans.y === 0, JSON.stringify(dec.sans));

    console.log('\n── ⑬ <Région: 9> ──');
    var pas = await ev(function () {
        var px = $gamePlayer.x, py = $gamePlayer.y, dirs = [[6, 1, 0], [4, -1, 0], [2, 0, 1], [8, 0, -1]], bons = [];
        dirs.forEach(function (d) { if ($gamePlayer.canPass(px, py, d[0]) && !$gameMap.eventsXy(px + d[1], py + d[2]).length) bons.push(d); });
        return { px: px, py: py, bons: bons };
    });
    await poserEssai('<Région: 9>', loin[3][0], loin[3][1], 'region');
    await ev(function (a) {
        window.__ess = [];
        var d = a.bons[0], w = $dataMap.width, h = $dataMap.height;
        window.__caseR = (5 * h + (a.py + d[2])) * w + (a.px + d[1]); window.__avantR = $dataMap.data[window.__caseR];
        $dataMap.data[window.__caseR] = 9;
        if (a.bons[1]) { window.__caseN = [a.px + a.bons[1][1], a.py + a.bons[1][2], a.bons[1][0]]; }
    }, pas);
    // d'abord un pas AILLEURS (contre-épreuve), retour, puis le pas sur la région
    var r0 = null;
    if (pas.bons[1]) {
        await ev(function () { $gamePlayer.moveStraight(window.__caseN[2]); });
        await page.waitForTimeout(700);
        r0 = await ev(function () { return (window.__ess || []).slice(); });
        await ev(function (a) { $gamePlayer.locate(a.px, a.py); }, pas);
        await page.waitForTimeout(300);
    }
    await ev(function (a) { $gamePlayer.moveStraight(a.bons[0][0]); }, pas);
    await page.waitForTimeout(900);
    var r1 = await ev(function () { return { ess: (window.__ess || []).slice(), region: $gamePlayer.regionId() }; });
    await ev(function () { window.__ess = []; $gamePlayer.checkEventTriggerHere([0]); });
    await page.waitForTimeout(500);
    var r2 = await ev(function () { return (window.__ess || []).slice(); });
    await ev(function () { $dataMap.data[window.__caseR] = window.__avantR; });
    V('<Région: 9> : un pas sur la région lance l\'événement', r1.region === 9 && r1.ess.join() === 'region', JSON.stringify(r1));
    V('contre-épreuve : un pas ailleurs ne lance rien, la touche OK sur place non plus', (r0 === null || r0.length === 0) && r2.length === 0, 'ailleurs ' + JSON.stringify(r0) + ' · OK ' + JSON.stringify(r2));

    console.log('\n── ⑭ CHRONO ──');
    await ev(function () { $gameTimer.start(60 * 60); });
    await commande('CHRONO pause');
    var t0 = await ev(function () { return { f: $gameTimer._frames, w: $gameTimer.isWorking() }; });
    await page.waitForTimeout(600);
    var t1 = await ev(function () { return $gameTimer._frames; });
    await commande('CHRONO reprendre');
    var t2 = await ev(function () { return $gameTimer.isWorking(); });
    await commande('CHRONO pause');
    var f3 = await ev(function () { return $gameTimer._frames; });
    await commande('CHRONO ajouter 30');
    var f4 = await ev(function () { return $gameTimer._frames; });
    await commande('CHRONO retirer 10');
    var f5 = await ev(function () { return $gameTimer._frames; });
    await ev(function () { $gameTimer.stop(); });
    V('CHRONO pause arrête sans remettre à 0, reprendre relance', !t0.w && t0.f === t1 && t1 > 3000 && t2, 'pause à ' + t0.f + ' images, toujours ' + t1 + ' après 0,6 s · reprise : ' + t2);
    V('CHRONO ajouter 30 / retirer 10 : +1800 puis −600 images', f4 - f3 === 1800 && f4 - f5 === 600, f3 + ' → ' + f4 + ' → ' + f5);

    console.log('\n── le bilan ──');
    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
