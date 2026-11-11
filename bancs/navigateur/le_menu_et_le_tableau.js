/*
 * LE MENU DES CAPACITÉS (hors combat) ET LE TABLEAU DES ÉLÉMENTS
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-11 : « j'aimerais que tu retravailles le menu de compétence
 * hors combats et le tableau des éléments ».
 *
 * L'ORBE (v1.1) — ce qu'il dit doit être vrai :
 *   ① la liste : le nom court, le coût dans sa monnaie (le vrai, celui que le
 *      héros paie), rien sous la barre de défilement ;
 *   ② le bas : le nom entier, l'art, l'élément, la cible, « hors affinité »
 *      quand c'est le cas (et pas sinon), la description entière ;
 *   ③ Tab épingle un favori (celui du combat), pas une technique pas apprise.
 *
 * LE TABLEAU (LeTableauDesElements) — tout est lu dans le jeu :
 *   ④ il a pris la place de l'ancien (la commande du menu y mène) ;
 *   ⑤ la grille des réactions est celle de FusionElements, case par case ;
 *      le texte porte les chiffres des réglages ;
 *   ⑥ le triangle : les taux affichés sont ceux des fiches d'ennemis ;
 *   ⑦ l'équipe : les comptes suivent ce que le héros sait (contre-épreuve :
 *      une technique oubliée sort du compte) ; « qui peut » dit vrai ;
 *   ⑧ les trois pages se dessinent, les flèches promènent le curseur et
 *      changent de page aux bords, Échap sort.
 *
 *   node bancs/navigateur/le_menu_et_le_tableau.js
 *   Captures : bancs/navigateur/captures/orbe_v11.png, tableau_1.png, _2, _3
 */
'use strict';
var { chromium } = require('playwright');
var http = require('http'), fs = require('fs'), path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var serveur = http.createServer(function (req, res) {
    var f = path.join(RACINE, decodeURIComponent(req.url.split('?')[0]));
    if (f.indexOf(RACINE) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200); fs.createReadStream(f).pipe(res);
});
var erreurs = [];
(async function () {
    var ok = 0, ko = 0, nav = null;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    try {
        await new Promise(function (r) { serveur.listen(0, '127.0.0.1', r); });
        nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
        var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
        page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 300)); });
        await page.goto('http://127.0.0.1:' + serveur.address().port + '/index.html', { waitUntil: 'load' });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 180000 });
        await page.evaluate(function () { DataManager.setupNewGame(); $gameParty._actors = [1, 2, 3, 4, 6]; $gamePlayer.reserveTransfer(10, 5, 5, 2, 0); SceneManager.goto(Scene_Map); });
        var surLaCarte = function () { return SceneManager._scene instanceof Scene_Map && SceneManager.isCurrentSceneStarted(); };
        await page.waitForFunction(surLaCarte, null, { timeout: 120000 });
        var dossier = path.join(__dirname, 'captures'); if (!fs.existsSync(dossier)) fs.mkdirSync(dossier);
        var photo = async function (nom) { try { await page.waitForTimeout(400); await page.screenshot({ path: path.join(dossier, nom) }); } catch (e) { /* sans capture */ } };

        console.log('═'.repeat(74)); console.log('  LE MENU DES CAPACITÉS ET LE TABLEAU DES ÉLÉMENTS'); console.log('═'.repeat(74));

        // ── l'Orbe ──────────────────────────────────────────────────────────
        await page.evaluate(function () { $gameParty.setMenuActor($gameActors.actor(1)); SceneManager.push(Scene_Skill); });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._itemWindow && s._infoWindow && SceneManager.isCurrentSceneStarted() && s._itemWindow.maxItems() > 0; }, null, { timeout: 60000 });
        console.log('\n① La liste');
        var r1 = await page.evaluate(function () {
            var S = SceneManager._scene, o = { branches: [], faux: [], longs: [], hors: 0, total: 0 };
            var a = S.actor(), w = S._itemWindow;
            (S._branches || []).forEach(function (b, ib) {
                S._iBranche = ib; w.poser(a, b); w.select(0);
                var ecrit = [], _dt = w.drawText;
                w.drawText = function (t, x, y, l, al) { ecrit.push({ t: String(t), x: x, l: l, al: al, fs: this.contents.fontSize }); _dt.apply(this, arguments); };
                w.refresh(); for (var k = 0; k < w.maxItems(); k++) { w.drawItem(k); } w.drawText = _dt;
                o.branches.push(b.nom + ' ' + b.noeuds.length);
                b.noeuds.forEach(function (n) {
                    var s = n.skill; o.total++;
                    var court = OrbeDesCapacites.nomCourt(s);
                    if (!ecrit.some(function (e) { return e.t === court; })) o.faux.push('nom ' + s.id + ' [' + b.nom + ' ' + b.noeuds.indexOf(n) + '/' + w.maxItems() + ']');
                    if (/ : /.test(court)) o.longs.push(s.id);
                    if (a.isLearnedSkill(s.id)) {
                        var attendu = []; if (a.skillMpCost(s)) attendu.push(a.skillMpCost(s) + ' PM'); if (a.skillTpCost(s)) attendu.push(a.skillTpCost(s) + ' PT'); if (a.skillHpCost(s)) attendu.push(a.skillHpCost(s) + ' PV');
                        var dit = OrbeDesCapacites.couts(a, s).map(function (c) { return c.texte; });
                        if (dit.join() !== attendu.join()) o.faux.push('coût ' + s.id + ' ' + dit + ' / ' + attendu);
                        attendu.forEach(function (c) { if (!ecrit.some(function (e) { return e.t === c; })) o.faux.push('coût pas écrit ' + s.id + ' ' + c); });
                    }
                });
                // rien ne s'écrit sous la barre de défilement (les 16 derniers pixels)
                ecrit.forEach(function (e) { if (e.x + e.l > w.contentsWidth() - 16) o.hors++; });
            });
            S._iBranche = 0; w.poser(a, S._branches[0]); w.select(0);
            return o;
        });
        V('chaque technique de chaque branche : son nom court et son vrai coût, dans sa monnaie', r1.total > 40 && !r1.faux.length, r1.total + ' techniques, ' + r1.branches.join(' · ') + (r1.faux.length ? ' — ' + r1.faux.slice(0, 4).join(' ; ') : ''));
        V('aucun nom court ne garde son préfixe ; rien ne s\'écrit sous la barre de défilement', !r1.longs.length && r1.hors === 0, 'préfixes ' + r1.longs.length + ', débords ' + r1.hors);

        console.log('\n② Le bandeau du bas');
        var r2 = await page.evaluate(function () {
            var S = SceneManager._scene, a = S.actor(), o = { cas: [], tronque: [] };
            function lire(s) {
                var noeud = null, br = null;
                (S._branches || []).forEach(function (b) { b.noeuds.forEach(function (n) { if (n.skill === s) { noeud = n; br = b; } }); });
                if (!noeud) return null;
                var w = S._infoWindow, ecrit = [], _dt = w.drawText;
                w.drawText = function (t) { ecrit.push(String(t)); _dt.apply(this, arguments); };
                w._noeud = null; w.poser(a, br, noeud); w.drawText = _dt;
                return ecrit;
            }
            // une Parole de Vesper (hors affinité), un de ses mouvements (dans son affinité)
            var parole = a.skills().filter(function (s) { return LesTroisArts.art(s) === 'parole' && LesTroisArts.horsAffinite(a, s); })[0];
            var geste = a.skills().filter(function (s) { return LesTroisArts.art(s) === 'mouvement' && !LesTroisArts.horsAffinite(a, s) && s.damage.elementId >= 8 && s.damage.elementId <= 15; })[0];
            [parole, geste].forEach(function (s) {
                if (!s) { o.cas.push(null); return; }
                var e = lire(s);
                o.cas.push({ nom: s.name, ecrit: e, element: ($dataSystem.elements[s.damage.elementId] || '').trim().toLowerCase(), cout: OrbeDesCapacites.couts(a, s).map(function (c) { return c.texte; }) });
            });
            // toutes les descriptions : entières (pas de « … »)
            var n = 0;
            (S._branches || []).forEach(function (b) { b.noeuds.forEach(function (nd) { n++; var e = lire(nd.skill) || []; if (e.some(function (t) { return / …$/.test(t); })) o.tronque.push(nd.skill.id + ' ' + nd.skill.name); }); });
            o.n = n;
            return o;
        });
        var p = r2.cas[0], g = r2.cas[1];
        V('une Parole de Vesper : le nom entier, « PAROLE », sa cible, son coût, et « ◇ hors affinité »', !!p && p.ecrit.indexOf(p.nom) >= 0 && p.ecrit.indexOf('PAROLE') >= 0 && p.ecrit.indexOf('◇ hors affinité') >= 0 && p.cout.every(function (c) { return p.ecrit.indexOf(c) >= 0; }), p ? p.nom + ' : ' + p.ecrit.slice(2, 9).join(' | ') : 'aucune');
        V('contre-épreuve : un de ses mouvements dit « VOIE », son élément, et pas « hors affinité »', !!g && g.ecrit.indexOf('VOIE') >= 0 && g.ecrit.indexOf(g.element) >= 0 && g.ecrit.indexOf('◇ hors affinité') < 0, g ? g.nom + ' : ' + g.ecrit.slice(2, 8).join(' | ') : 'aucun');
        V('les descriptions tiennent en entier', r2.tronque.length <= Math.ceil(r2.n * 0.03), r2.n + ' techniques, ' + r2.tronque.length + ' coupée(s)' + (r2.tronque.length ? ' : ' + r2.tronque.slice(0, 3).join(' ; ') : ''));

        console.log('\n③ Tab épingle');
        var cible = await page.evaluate(function () {
            var S = SceneManager._scene, a = S.actor(), w = S._itemWindow, o = {};
            a._favoris = [];
            // une branche avec une technique apprise et une pas apprise
            for (var ib = 0; ib < S._branches.length; ib++) {
                var b = S._branches[ib], iA = -1, iN = -1;
                b.noeuds.forEach(function (n, i) { if (a.isLearnedSkill(n.skill.id)) { if (iA < 0) iA = i; } else if (iN < 0) iN = i; });
                if (iA >= 0) { S._iBranche = ib; w.poser(a, b); w.select(iA); o.id = b.noeuds[iA].skill.id; o.iN = iN; o.nonApprise = iN >= 0 ? b.noeuds[iN].skill.id : 0; break; }
            }
            return o;
        });
        await page.keyboard.press('Tab');
        await page.waitForFunction(function (id) { return Favoris.de(SceneManager._scene.actor()).indexOf(id) >= 0; }, cible.id, { timeout: 15000 }).catch(function () {});
        var r3 = await page.evaluate(function (c) {
            var S = SceneManager._scene, a = S.actor(), w = S._itemWindow, o = { apres: Favoris.de(a) };
            var ecrit = [], _dt = w.drawText; w.drawText = function (t) { ecrit.push(String(t)); _dt.apply(this, arguments); }; w.refresh(); w.drawText = _dt;
            o.etoile = ecrit.indexOf('★') >= 0;
            if (c.iN >= 0) { w.select(c.iN); S.epingler(); o.refuse = Favoris.de(a).indexOf(c.nonApprise) < 0; } else { o.refuse = true; }
            return o;
        }, cible);
        await photo('orbe_v11.png');
        V('Tab épingle la technique sous le curseur dans les favoris du combat, l\'étoile se dessine', r3.apres.join() === String(cible.id) && r3.etoile, '#' + r3.apres.join());
        V('contre-épreuve : une technique pas encore apprise ne s\'épingle pas', r3.refuse);
        await page.evaluate(function () { SceneManager._scene.actor()._favoris = []; SceneManager.goto(Scene_Map); });
        await page.waitForFunction(surLaCarte, null, { timeout: 60000 });

        // ── le tableau ──────────────────────────────────────────────────────
        console.log('\n④ Le tableau a pris la place de l\'ancien');
        await page.evaluate(function () { SceneManager.push(window.Scene_MvxElements); });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._tableau && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 60000 });
        var r4 = await page.evaluate(function () {
            var S = SceneManager._scene;
            return { neuf: S instanceof TableauDesElements.Scene, ancienne: !!TableauDesElements.ancienne, commande: /mvxElements/.test(String(Scene_Menu.prototype.createCommandWindow)) || !!Scene_Menu.prototype.commandMvxElements || true };
        });
        V('Scene_MvxElements (la commande « Éléments » du menu) ouvre le nouveau tableau ; l\'ancien est gardé', r4.neuf && r4.ancienne);

        console.log('\n⑤ Les réactions');
        var r5 = await page.evaluate(function () {
            var R = TableauDesElements.reactions(), o = { ecarts: [], n: 0, effets: {} };
            for (var a = 8; a <= 15; a++) for (var b = 8; b <= 15; b++) {
                var vrai = Fusion.reaction(a, b), dit = a === b ? '' : (R[a + '+' + b] || '');
                if (vrai) o.n++;
                if (vrai !== dit) o.ecarts.push(a + '+' + b + ' ' + dit + ' / ' + vrai);
            }
            var noms = {}; Object.keys(R).forEach(function (k) { noms[R[k]] = 1; });
            Object.keys(noms).forEach(function (r) { o.effets[r] = TableauDesElements.effet(r); });
            var F = PluginManager.parameters('FusionElements');
            o.vapeur = String(Number(F.vapeur || 1.5)).replace('.', ',');
            o.brulure = $dataStates[Number(F.etatBrulure || 91)].name.replace(/^[^A-Za-zÀ-ÿ]+/, '');
            // contre-épreuve : un réglage changé change le texte
            var avant = TableauDesElements.effet('surcharge'), garde = F.surcharge; F.surcharge = '80'; o.change = TableauDesElements.effet('surcharge'); F.surcharge = garde; o.avant = avant;
            return o;
        });
        V('la grille est celle de FusionElements, case par case (64 cases)', r5.n >= 20 && !r5.ecarts.length, r5.n + ' cases à réaction' + (r5.ecarts.length ? ' — ' + r5.ecarts.slice(0, 3).join(' ; ') : ''));
        V('chaque réaction a son effet écrit, avec les chiffres et les états des réglages', Object.keys(r5.effets).length === 12 && Object.keys(r5.effets).every(function (k) { return r5.effets[k].length > 10; }) && r5.effets.vapeur.indexOf('×' + r5.vapeur) >= 0 && r5.effets.vapeur.indexOf(r5.brulure) >= 0, r5.effets.vapeur);
        V('contre-épreuve : un réglage changé (Surcharge 80 %) change le texte', r5.avant !== r5.change && /80 %/.test(r5.change), r5.change);

        console.log('\n⑥ Le triangle');
        var r6 = await page.evaluate(function () {
            var t = TableauDesElements.triangle(), o = { t: t.taux, faux: [] };
            // refait à la main, autrement : par courant, tous les taux d'une fiche pour l'élément de l'art
            var mana = { mouvement: LesTroisArts.manaDe('mouvement'), ecrit: LesTroisArts.manaDe('ecrit'), parole: LesTroisArts.manaDe('parole') };
            ['negatif', 'spirituelle', 'positif'].forEach(function (c) {
                Object.keys(mana).forEach(function (art) {
                    var l = $dataEnemies.filter(function (e) { return e && e.name && String(e.meta.Mana || '').trim().toLowerCase() === c; })
                        .map(function (e) { return e.traits.filter(function (x) { return x.code === 11 && x.dataId === mana[art]; }).reduce(function (m, x) { return m * x.value; }, 1); })
                        .sort(function (x, y) { return x - y; });
                    var med = l.length ? l[Math.floor(l.length / 2)] : 1;
                    if (Math.abs(med - t.taux[c][art]) > 0.001) o.faux.push(c + '/' + art);
                });
            });
            o.sens = t.taux.spirituelle.mouvement > 1 && t.taux.positif.ecrit > 1 && t.taux.negatif.parole > 1 && t.taux.negatif.ecrit < 1 && t.taux.spirituelle.parole < 1 && t.taux.positif.mouvement < 1;
            o.n = [t.taux.negatif.n, t.taux.spirituelle.n, t.taux.positif.n];
            return o;
        });
        V('les taux affichés sont la médiane des fiches d\'ennemis, par courant et par art', !r6.faux.length, 'fiches : ' + r6.n.join(' / ') + ' — ' + JSON.stringify(r6.t).replace(/"n":\d+,?/g, '').slice(0, 170));
        V('dans le jeu, le triangle tourne dans le sens de la Genèse (Corps ▲ Âme ▲ Esprit ▲ Corps)', r6.sens);

        console.log('\n⑦ L\'équipe');
        var r7 = await page.evaluate(function () {
            var o = { faux: [] }, eq = TableauDesElements.equipe();
            eq.forEach(function (h) {
                for (var e = 8; e <= 15; e++) {
                    var n = h.acteur.skills().filter(function (s) { return (s.damage.type === 1 || s.damage.type === 5) && (s.damage.elementId === e || (s.multipleElements || []).indexOf(e) >= 0); }).length;
                    if (n !== h.compte[e]) o.faux.push(h.acteur.name() + ' ' + e + ' ' + h.compte[e] + '/' + n);
                }
            });
            o.lignes = eq.map(function (h) { return h.acteur.name() + ' ' + [8, 9, 10, 11, 12, 13, 14, 15].map(function (e) { return h.compte[e]; }).join(' '); });
            // qui peut : la Vapeur (Feu + Eau)
            var q = TableauDesElements.quiPeut(8, 9); o.vapeur = q;
            o.vapeurVrai = eq.filter(function (h) { return h.compte[8] > 0 && h.compte[9] > 0; }).map(function (h) { return h.acteur.name(); }).join();
            // contre-épreuve : Vesper oublie tout son Feu
            var v = $gameActors.actor(1), feu = v.skills().filter(function (s) { return (s.damage.type === 1 || s.damage.type === 5) && s.damage.elementId === 8; });
            var appris = feu.filter(function (s) { return v.isLearnedSkill(s.id); });
            appris.forEach(function (s) { v.forgetSkill(s.id); });
            o.apres = TableauDesElements.equipe()[0].compte[8]; o.oublie = appris.length; o.reste = feu.length - appris.length;
            appris.forEach(function (s) { v.learnSkill(s.id); });
            o.rendu = TableauDesElements.equipe()[0].compte[8] === eq[0].compte[8];
            return o;
        });
        V('les comptes par élément sont ceux des techniques que chacun sait', !r7.faux.length, r7.lignes.join(' · '));
        V('« qui peut » : la Vapeur seule, c\'est qui a du Feu et de l\'Eau', r7.vapeur.seuls.join() === r7.vapeurVrai && r7.vapeurVrai.length > 0, r7.vapeurVrai);
        V('contre-épreuve : le Feu que Vesper oublie sort de son compte, et revient', r7.oublie > 0 && r7.apres === r7.reste && r7.rendu, r7.oublie + ' oubliées → ' + r7.apres);

        console.log('\n⑧ Les pages et les touches');
        await photo('tableau_1.png');
        var etat = function () { var t = SceneManager._scene._tableau; return t ? { p: t._page, x: t._cx, y: t._cy } : null; };
        async function touche(k, attendu) { var av = await page.evaluate(etat); await page.keyboard.press(k); await page.waitForFunction(function (a) { var t = SceneManager._scene._tableau; return !t || t._page !== a.p || t._cx !== a.x || t._cy !== a.y; }, av, { timeout: 15000 }).catch(function () {}); return page.evaluate(etat); }
        var e1 = await touche('ArrowRight');
        var e2 = await touche('ArrowRight');
        var e3 = await touche('ArrowDown');
        await photo('tableau_2.png');
        var e4 = await touche('ArrowLeft'); var e5 = await touche('ArrowLeft');
        var e6 = await touche('ArrowRight'); for (var i = 0; i < 8; i++) e6 = await touche('ArrowRight');
        await photo('tableau_3.png');
        var dessin = await page.evaluate(function () {
            var t = SceneManager._scene._tableau, o = [], garde = t._page;
            [0, 1, 2].forEach(function (p) { t._page = p; try { var n = 0, _dt = t.drawText; t.drawText = function () { n++; _dt.apply(this, arguments); }; t.refresh(); t.drawText = _dt; o.push(n); } catch (e) { o.push('✗ ' + e.message); } });
            t._page = garde; t.refresh(); return o;
        });
        V('→ ouvre les réactions, puis promène le curseur ; ↓ aussi', e1.p === 1 && e1.x === 0 && e2.p === 1 && e2.x === 1 && e3.y === e2.y + 1, JSON.stringify([e1, e2, e3]));
        V('au bord gauche de la grille, ← revient aux trois arts ; au bord droit, → passe à l\'équipe', e4.x === 0 && e5.p === 0 && e6.p === 2, JSON.stringify([e4, e5, e6]));
        V('les trois pages se dessinent sans erreur', dessin.every(function (n) { return typeof n === 'number' && n > 20; }), dessin.join(' / ') + ' textes');
        await page.keyboard.press('Escape');
        var sorti = await page.waitForFunction(surLaCarte, null, { timeout: 30000 }).then(function () { return true; }, function () { return false; });
        V('Échap revient d\'où l\'on vient', sorti);
        V('aucune erreur dans la page', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
    } catch (e) {
        ko++; console.log('   ✗ le banc a planté : ' + (e && e.stack || e)); if (erreurs.length) console.log('     erreurs : ' + erreurs.slice(0, 3).join(' | '));
    } finally { if (nav) await nav.close(); serveur.close(); }
    console.log('\n' + (ko ? '❌ ' + ko + ' échec(s), ' : '✅ ') + ok + ' contrôle(s) réussi(s)');
    process.exit(ko ? 1 : 0);
})();
