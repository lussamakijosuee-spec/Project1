/*
 * EXPLORATIONPLUS ET ECONOMIEPLUS, DANS LE VRAI MOTEUR
 * ---------------------------------------------------------------------------
 * Les événements, régions, notes et recettes d'essai sont posés EN MÉMOIRE
 * (rien dans data/, rien dans les cartes).
 *   ① l'attaque surprise, en VRAIS déplacements : le joueur fonce dans le
 *     dos d'un ennemi → avantage ; un ennemi fonce dans le dos du joueur →
 *     surprise ; face à face → rien ; <Pas de surprise>, un boss, un
 *     événement à la touche OK → rien ; à la touche OK avec <Surprise> → oui
 *   ② la furtivité : le poursuivant ne repère plus le joueur (sauf collé),
 *     le joueur est transparent ; minuteur ; objet ; état <Furtif>
 *   ③ les sols dangereux, en marchant : 10 % des PV max, état, immunité,
 *     région sans danger (contre-épreuve)
 *   ④ l'artisanat : l'entrée du menu n'existe qu'avec une recette ; il faut
 *     tout ; fabriquer consomme et donne ; armes « indépendantes » ; l'écran
 *     s'ouvre, par atelier
 *   ⑤ les autres monnaies : la boutique compte en objets / en variable, l'or
 *     ne bouge pas ; la boutique suivante revient à l'or
 *
 *   node bancs/navigateur/lexploration_et_leconomie.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    var ev = function (f, a) { return page.evaluate(f, a); };
    async function surLaCarte() {
        await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }, null, { timeout: 60000 });
        await page.waitForTimeout(300);
    }
    async function images(n) { var f0 = await ev(function () { return Graphics.frameCount; }); await page.waitForFunction(function (f) { return Graphics.frameCount >= f; }, f0 + n, { timeout: 60000 }); }

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    await ev(function () { DataManager.setupNewGame(); $gameSystem._meteo = { force: 'clair' }; $gamePlayer.reserveTransfer(29, 10, 10, 2, 0); SceneManager.goto(Scene_Map); });
    await surLaCarte();
    await ev(function () {
        window.T = {
            cmd: function (t) { var i = new Game_Interpreter(); i._params = [t]; var a = t.split(' '); i.pluginCommand(a.shift(), a); },
            // un coin de carte où l'on peut faire trois pas en ligne
            coin: function () {
                for (var y = 3; y < $gameMap.height() - 3; y++) for (var x = 3; x < $gameMap.width() - 3; x++) {
                    var dx = 0, dy = 1, okk = true;
                    for (var k = -1; k <= 1 && okk; k++) { var px = x + dx * k, py = y + dy * k; if (!$gameMap.isPassable(px, py, 2) || !$gameMap.isPassable(px, py, 8) || $gameMap.eventsXy(px, py).length) okk = false; }
                    if (okk && !$gameMap.eventsXy(x, y + 2).length && !$gameMap.eventsXy(x, y - 2).length) return { x: x, y: y };
                }
                return null;
            },
            evenement: function (x, y, dir, trigger, liste, commentaire) {
                var id = $dataMap.events.length;
                var l = [];
                if (commentaire) l.push({ code: 108, indent: 0, parameters: [commentaire] });
                l = l.concat(liste, [{ code: 0, indent: 0, parameters: [] }]);
                var page = { conditions: { actorId: 1, actorValid: false, itemId: 1, itemValid: false, selfSwitchCh: 'A', selfSwitchValid: false, switch1Id: 1, switch1Valid: false, switch2Id: 1, switch2Valid: false, variableId: 1, variableValid: false, variableValue: 0 },
                    directionFix: false, image: { characterIndex: 0, characterName: '', direction: dir, pattern: 1, tileId: 0 }, list: l, moveFrequency: 3,
                    moveRoute: { list: [{ code: 0, parameters: [] }], repeat: true, skippable: false, wait: false }, moveSpeed: 4, moveType: 0, priorityType: 1, stepAnime: false, through: false, trigger: trigger, walkAnime: true };
                $dataMap.events[id] = { id: id, name: 'essai', note: '', pages: [page], x: x, y: y, meta: {} };
                var e = new Game_Event($gameMap.mapId(), id); $gameMap._events[id] = e;
                return id;
            }
        };
    });
    console.log('EXPLORATIONPLUS ET ECONOMIEPLUS');

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ① l\'attaque surprise ──');
    var coin = await ev(function () { return T.coin(); });
    // cas : { qui : 'joueur' (le joueur avance) | 'ennemi' (l'ennemi avance) | 'ok' (touche OK) }
    async function cas(o) {
        await ev(function (a) {
            var c = a.coin;
            $gamePlayer.locate(c.x, c.y); $gamePlayer.setDirection(a.dirJoueur);
            var ex = c.x, ey = a.devant ? c.y + 1 : c.y - 1;
            window.__ev = T.evenement(ex, ey, a.dirEnnemi, a.trigger, [{ code: 301, indent: 0, parameters: [0, a.troupe || 2, true, true] }], a.commentaire || '');
            $gameMap.event(window.__ev).setDirection(a.dirEnnemi);
            if (a.qui === 'joueur') $gamePlayer.moveStraight(2);
            else if (a.qui === 'ennemi') $gameMap.event(window.__ev).moveStraight(2);
            else $gamePlayer.checkEventTriggerThere([0, 1, 2]);
        }, Object.assign({ coin: coin }, o));
        var lance = await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 20000 }).then(function () { return true; }, function () { return false; });
        var r = await ev(function () { return { pre: BattleManager._preemptive, sur: BattleManager._surprise, combat: SceneManager._scene instanceof Scene_Battle }; });
        r.lance = lance;
        // la carte est relue au retour du combat : l'événement d'essai doit disparaître avant
        await ev(function () { $gameMap._interpreter.clear(); delete $gameMap._events[window.__ev]; $gameMap._events.length = Math.min($gameMap._events.length, $dataMap.events.length - 1); });
        if (lance) {
            await ev(function () { $gameTroop._interpreter.clear(); $gameMessage.clear(); BattleManager.processAbort(); });
            await surLaCarte();
        }
        return r;
    }
    if (!coin) V('un coin de carte libre pour l\'essai', false, 'aucun');
    else {
        var dos = await cas({ qui: 'joueur', devant: true, dirJoueur: 2, dirEnnemi: 2, trigger: 1 });
        V('le joueur fonce dans le DOS de l\'ennemi → attaque préventive', dos.lance && dos.pre && !dos.sur, JSON.stringify(dos));
        var surpris = await cas({ qui: 'ennemi', devant: false, dirJoueur: 2, dirEnnemi: 2, trigger: 2 });
        V('l\'ennemi fonce dans le dos du joueur → surprise', surpris.lance && surpris.sur && !surpris.pre, JSON.stringify(surpris));
        var face = await cas({ qui: 'joueur', devant: true, dirJoueur: 2, dirEnnemi: 8, trigger: 1 });
        V('contre-épreuve : face à face → combat normal', face.lance && !face.pre && !face.sur, JSON.stringify(face));
        var interdit = await cas({ qui: 'joueur', devant: true, dirJoueur: 2, dirEnnemi: 2, trigger: 1, commentaire: '<Pas de surprise>' });
        V('<Pas de surprise> → combat normal', interdit.lance && !interdit.pre && !interdit.sur, JSON.stringify(interdit));
        var boss = await cas({ qui: 'joueur', devant: true, dirJoueur: 2, dirEnnemi: 2, trigger: 1, troupe: 519 });
        V('un boss pris de dos → combat normal', boss.lance && !boss.pre && !boss.sur, JSON.stringify(boss));
        var bouton = await cas({ qui: 'ok', devant: true, dirJoueur: 2, dirEnnemi: 2, trigger: 0 });
        V('un événement à la touche OK (un PNJ qui lance un combat) → normal', bouton.lance && !bouton.pre && !bouton.sur, JSON.stringify(bouton));
        var bouton2 = await cas({ qui: 'ok', devant: true, dirJoueur: 2, dirEnnemi: 2, trigger: 0, commentaire: '<Surprise>' });
        V('… avec <Surprise> → attaque préventive', bouton2.lance && bouton2.pre, JSON.stringify(bouton2));
    }

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ② la furtivité ──');
    var f = await ev(function (c) {
        var r = {};
        $gamePlayer.locate(c.x, c.y);
        var id = T.evenement(c.x, c.y - 2, 2, 0, [], '');
        var e = $gameMap.event(id); e._chaseRange = 5; e._seePlayer = true; e.setDirection(2);
        r.normal = e.chaseConditions(2);
        T.cmd('FURTIVITE on'); r.furtif = [$gamePlayer.estFurtif(), e.chaseConditions(2), e.chaseConditions(1)];
        window.__e = id;
        return r;
    }, coin);
    await images(3);
    var f2 = await ev(function () {
        var r = { op: $gamePlayer.opacity() };
        T.cmd('FURTIVITE off'); r.apres = $gameMap.event(window.__e).chaseConditions(2);
        return r;
    });
    await images(3);
    var f3 = await ev(function () {
        var r = { op: $gamePlayer.opacity() };
        T.cmd('FURTIVITE 1'); r.minuteur = $gamePlayer.estFurtif();
        return r;
    });
    await images(70);
    var f4 = await ev(function () {
        var r = { fini: $gamePlayer.estFurtif() };
        var it = JSON.parse(JSON.stringify($dataItems[1])); it.id = $dataItems.length; it.note = '<Furtivité: 30>'; $dataItems.push(it);
        $gameParty.leader().useItem(it); r.objet = $gamePlayer.estFurtif(); $gameSystem.furtivite(false);
        var st = JSON.parse(JSON.stringify($dataStates[2])); st.id = $dataStates.length; st.note = '<Furtif>'; st.traits = []; st.restriction = 0; $dataStates.push(st);
        $gameParty.leader().addState(st.id); r.etat = $gamePlayer.estFurtif(); $gameParty.leader().removeState(st.id); r.sansEtat = $gamePlayer.estFurtif();
        delete $gameMap._events[window.__e]; $gameMap._events.length = Math.min($gameMap._events.length, $dataMap.events.length - 1);
        return r;
    });
    V('sans furtivité, le poursuivant à 2 cases repère le joueur', f.normal === true, '');
    V('FURTIVITE on : à 2 cases il ne le voit plus… collé (1 case), si', f.furtif[0] && !f.furtif[1] && f.furtif[2], JSON.stringify(f.furtif));
    V('le joueur devient transparent (130), puis redevient opaque', f2.op === 130 && f3.op === 255, f2.op + ' → ' + f3.op);
    V('FURTIVITE off : repéré à nouveau', f2.apres === true, '');
    V('FURTIVITE 1 : une seconde, puis fini', f3.minuteur && !f4.fini, JSON.stringify([f3.minuteur, f4.fini]));
    V('objet <Furtivité: 30> utilisé → furtif ; état <Furtif> → furtif, retiré → plus', f4.objet && f4.etat && !f4.sansEtat, JSON.stringify(f4));

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ③ les sols dangereux ──');
    async function pas(dir) { await ev(function (d) { $gamePlayer.moveStraight(d); }, dir); await page.waitForFunction(function () { return !$gamePlayer.isMoving(); }, null, { timeout: 10000 }); }
    var sol0 = await ev(function (c) {
        var w = $dataMap.width, h = $dataMap.height;
        function region(x, y, r) { $dataMap.data[(5 * h + y) * w + x] = r; }
        window.__noteCarte = $dataMap.note;
        $dataMap.note += '\n<Sol dangereux 5: 10%>\n<Sol dangereux 6: 3 état 5>';
        region(c.x, c.y + 1, 5); region(c.x, c.y - 1, 6);
        $gamePlayer.locate(c.x, c.y);
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        var st = JSON.parse(JSON.stringify($dataStates[2])); st.id = $dataStates.length; st.note = '<Immunité sol: 5>'; st.traits = []; st.restriction = 0; $dataStates.push(st);
        $gameParty.members()[1].addState(st.id);
        window.__imm = st.id;
        return $gameParty.members().map(function (a) { return [a.name(), a.hp, a.mhp]; });
    }, coin);
    await pas(2);
    var sol1 = await ev(function () { return { pv: $gameParty.members().map(function (a) { return a.hp; }), flash: $gameScreen._flashDuration > 0, region: $gameMap.regionId($gamePlayer.x, $gamePlayer.y) }; });
    var attendu = sol0.map(function (a, i) { return i === 1 ? a[1] : a[1] - Math.max(1, Math.floor(a[2] * 0.1)); });
    V('un pas sur la région 5 (10 %) : chacun perd 10 % de ses PV max, l\'écran rougit', sol1.region === 5 && sol1.pv.every(function (p, i) { return i === 1 || p === attendu[i]; }) && sol1.flash, JSON.stringify(sol1.pv) + ' attendu ' + JSON.stringify(attendu));
    V('<Immunité sol: 5> : ' + sol0[1][0] + ' ne perd rien', sol1.pv[1] === sol0[1][1], sol1.pv[1] + ' / ' + sol0[1][1]);
    await pas(8);
    var sol2 = await ev(function () { return { pv: $gameParty.members().map(function (a) { return a.hp; }), region: $gameMap.regionId($gamePlayer.x, $gamePlayer.y) }; });
    V('contre-épreuve : un pas hors des régions, personne ne perd rien', sol2.region !== 5 && sol2.region !== 6 && sol2.pv.join() === sol1.pv.join(), JSON.stringify(sol2));
    await pas(8);
    var sol3 = await ev(function () {
        var r = { pv: $gameParty.members().map(function (a) { return a.hp; }), etat: $gameParty.members().map(function (a) { return a.isStateAffected(5); }), region: $gameMap.regionId($gamePlayer.x, $gamePlayer.y) };
        $gameParty.members()[1].removeState(window.__imm);
        $gameParty.members().forEach(function (a) { a.removeState(5); a.recoverAll(); });
        return r;
    });
    V('région 6 (« 3 état 5 ») : 3 PV chacun et l\'état 5, l\'immunité « 5 » ne protège pas ici', sol3.region === 6 && sol3.pv.every(function (p, i) { return p === sol2.pv[i] - 3; }) && sol3.etat.every(Boolean), JSON.stringify(sol3));
    await ev(function (c) { var w = $dataMap.width, h = $dataMap.height; $dataMap.data[(5 * h + c.y + 1) * w + c.x] = 0; $dataMap.data[(5 * h + c.y - 1) * w + c.x] = 0; $dataMap.note = window.__noteCarte; }, coin);

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ④ l\'artisanat ──');
    var art = await ev(function () {
        var r = {};
        function menu() { return new Window_MenuCommand(0, 0)._list.map(function (c) { return c.name; }); }
        r.menuAvant = menu().indexOf('Artisanat') >= 0;
        window.__notes = [$dataItems[11].note, $dataItems[3].note, $dataItems[4].note];
        $dataItems[11].note += '\n<Recette: o1 x2, o2>\n<Recette or: 10>';
        $dataItems[4].note += '\n<Recette: o8>\n<Recette quantité: 3>\n<Recette atelier: forge>';
        EconomiePlus.oublierCache();
        r.menuApres = menu().indexOf('Artisanat') >= 0;
        var rec = EconomiePlus.recettes().filter(function (x) { return x.resultat.id === 11; })[0];
        [1, 2, 11].forEach(function (i) { $gameParty.loseItem($dataItems[i], 99); });
        $gameParty.gainItem($dataItems[1], 1); $gameParty.gainItem($dataItems[2], 1); $gameParty.gainGold(1000);
        r.manque = EconomiePlus.peutFabriquer(rec);
        $gameParty.gainItem($dataItems[1], 1);
        var or0 = $gameParty.gold();
        r.peut = EconomiePlus.peutFabriquer(rec);
        r.fait = EconomiePlus.fabriquer(rec);
        r.apres = [$gameParty.numItems($dataItems[1]), $gameParty.numItems($dataItems[2]), $gameParty.numItems($dataItems[11]), or0 - $gameParty.gold()];
        r.encore = EconomiePlus.fabriquer(rec);
        var q = EconomiePlus.recettes().filter(function (x) { return x.resultat.id === 4; })[0];
        $gameParty.loseItem($dataItems[4], 99); $gameParty.gainItem($dataItems[8], 1); EconomiePlus.fabriquer(q); r.quantite = $gameParty.numItems($dataItems[4]);
        // une arme en ingrédient : les armes possédées sont « indépendantes »
        $dataItems[3].note += '\n<Recette: w1>'; EconomiePlus.oublierCache();
        var ra = EconomiePlus.recettes().filter(function (x) { return x.resultat.id === 3; })[0];
        var nbW = function () { return EconomiePlus.possedes($dataWeapons[1]); };
        var w0 = nbW(); $gameParty.gainItem($dataWeapons[1], 1); r.arme = [w0, nbW()];
        var n3 = $gameParty.numItems($dataItems[3]); EconomiePlus.fabriquer(ra); r.arme.push(nbW(), $gameParty.numItems($dataItems[3]) - n3);
        r.visibles = EconomiePlus.visibles('').length; r.forge = EconomiePlus.visibles('forge').map(function (x) { return x.resultat.id; });
        $gameParty.gainItem($dataItems[1], 2); $gameParty.gainItem($dataItems[2], 1);
        T.cmd('ARTISANAT ouvrir');
        return r;
    });
    V('sans recette, pas d\'entrée « Artisanat » dans le menu ; avec, elle apparaît', !art.menuAvant && art.menuApres, JSON.stringify([art.menuAvant, art.menuApres]));
    V('il manque une Potion Rouge → impossible', art.manque === false, '');
    V('tout y est → fabriqué : −2 Potions Rouges, −1 Eau Magique, −10 or, +1 Potion Supérieure', art.peut && art.fait && art.apres.join() === '0,0,1,10', JSON.stringify(art.apres));
    V('plus d\'ingrédients → plus possible', art.encore === false, '');
    V('<Recette quantité: 3> → 3 d\'un coup', art.quantite === 3, art.quantite);
    V('une arme en ingrédient (exemplaire « indépendant » de YEP) : comptée, puis consommée', art.arme[1] === art.arme[0] + 1 && art.arme[2] === art.arme[0] && art.arme[3] === 1, JSON.stringify(art.arme));
    V('<Recette atelier: forge> : seule à la forge', art.forge.join() === '4' && art.visibles >= 3, JSON.stringify(art));
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Artisanat && !SceneManager.isSceneChanging(); }, null, { timeout: 20000 });
    await page.waitForTimeout(500);
    var ecran = await ev(function () {
        var s = SceneManager._scene, l = s._liste;
        var i = l._liste.map(function (x) { return x.resultat.id; }).indexOf(11);
        l.select(i);
        var n0 = $gameParty.numItems($dataItems[11]);
        s.surOk();
        return { lignes: l._liste.length, fait: $gameParty.numItems($dataItems[11]) - n0, aide: s._helpWindow._text.slice(0, 40) };
    });
    await page.screenshot({ path: __dirname + '/captures/artisanat.png' });
    V('ARTISANAT ouvrir : l\'écran liste les recettes ; OK fabrique (capture : captures/artisanat.png)', ecran.lignes >= 3 && ecran.fait === 1, JSON.stringify(ecran));
    await ev(function () { SceneManager.pop(); });
    await surLaCarte();
    await ev(function () { T.cmd('ARTISANAT ouvrir forge'); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Artisanat && !SceneManager.isSceneChanging(); }, null, { timeout: 20000 });
    var forge = await ev(function () { return SceneManager._scene._liste._liste.map(function (x) { return x.resultat.id; }); });
    V('ARTISANAT ouvrir forge : seulement la recette de la forge', forge.join() === '4', JSON.stringify(forge));
    await ev(function () { SceneManager.pop(); });
    await surLaCarte();
    await ev(function () { $dataItems[11].note = window.__notes[0]; $dataItems[3].note = window.__notes[1]; $dataItems[4].note = window.__notes[2]; EconomiePlus.oublierCache(); });

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ⑤ les autres monnaies ──');
    async function boutique(avant, prix) {
        await ev(function (a) {
            var l = a.avant.map(function (t) { return { code: 356, indent: 0, parameters: [t] }; });
            l.push({ code: 302, indent: 0, parameters: [0, 1, 1, a.prix, false] }, { code: 0, indent: 0, parameters: [] });
            $gameMap._interpreter.setup(l, 0);
        }, { avant: avant, prix: prix });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Shop && !SceneManager.isSceneChanging(); }, null, { timeout: 20000 });
        await page.waitForTimeout(300);
    }
    await ev(function () { $gameParty.loseItem($dataItems[9], 99); $gameParty.gainItem($dataItems[9], 10); $gameParty.loseItem($dataItems[1], 99); });
    await boutique(['MONNAIE objet 9'], 3);
    var m1 = await ev(function () {
        var s = SceneManager._scene, or0 = $gameParty.gold();
        var r = { solde: s.money(), unite: s.currencyUnit(), achatSeul: s._purchaseOnly };
        s._item = $dataItems[1]; s.doBuy(2);
        r.apres = [$gameParty.numItems($dataItems[9]), $gameParty.numItems($dataItems[1]), $gameParty.gold() - or0];
        s._goldWindow.refresh(); r.fenetre = s._goldWindow.value();
        return r;
    });
    await page.screenshot({ path: __dirname + '/captures/boutique_monnaie.png' });
    V('MONNAIE objet 9 : la boutique compte en « Lait du Ranch » (10), vente fermée', m1.solde === 10 && m1.unite === 'Lait du Ranch' && m1.achatSeul, JSON.stringify(m1));
    V('2 Potions à 3 : −6 Laits, +2 Potions, l\'or ne bouge pas', m1.apres.join() === '4,2,0' && m1.fenetre === 4, JSON.stringify(m1.apres));
    await ev(function () { SceneManager.pop(); });
    await surLaCarte();
    await boutique([], 3);
    var m2 = await ev(function () { var s = SceneManager._scene; return { unite: s.currencyUnit(), attendu: TextManager.currencyUnit, solde: s.money(), or: $gameParty.gold(), achatSeul: s._purchaseOnly }; });
    V('contre-épreuve : la boutique suivante revient à l\'or (et on peut y vendre)', m2.unite === m2.attendu && m2.solde === m2.or && !m2.achatSeul, JSON.stringify(m2));
    await ev(function () { SceneManager.pop(); });
    await surLaCarte();
    await ev(function () { $gameVariables.setValue(12, 50); });
    await boutique(['MONNAIE variable 12 Jetons d\'arène'], 5);
    var m3 = await ev(function () { var s = SceneManager._scene, r = { unite: s.currencyUnit(), solde: s.money() }; s._item = $dataItems[1]; s.doBuy(3); r.apres = $gameVariables.value(12); return r; });
    V('MONNAIE variable 12 Jetons d\'arène : 50 jetons, 3 × 5 → 35', m3.unite === 'Jetons d\'arène' && m3.solde === 50 && m3.apres === 35, JSON.stringify(m3));
    await ev(function () { SceneManager.pop(); });
    await surLaCarte();

    console.log('\n── le bilan ──');
    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
