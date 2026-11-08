/*
 * BANC NAVIGATEUR — LES FICHES ET LES TROUPES NEUVES DU REWORK DES ENNEMIS (2026-11-08)
 * ---------------------------------------------------------------------------
 * JOKO : « Fait tout les ennemis même créer des troupes aussi ». Les fiches 834 et suivantes (les peuples du Chapitre 1
 * qui en manquaient, les 9 boss de la Bible, les bêtes et les Égarés du dehors) et les troupes 833 et suivantes (une par
 * région de la Bible, et Aurevel). Pour chaque troupe : le combat s'ouvre, ses images se chargent, chaque créature a son
 * monde, son peuple quand elle en a un, son nom propre au Chapitre 1 ; un tour se joue sans erreur.
 * Et dans les deux sens : une fiche à qui l'on retire sa balise <Peuple:> perd son trait (contre-épreuve).
 *
 *   node <scratchpad>/serveur_bancs.js . 8899
 *   node bancs/navigateur/les_troupes_du_chapitre1.js
 */
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var PREMIERE = 833, DERNIERE = 871, FICHE1 = 834, FICHEN = 872;

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var err = [];
    page.on('pageerror', function (e) { err.push(e.message.split('\n')[0]); });
    page.on('console', function (m) { if (m.type() === 'error' && !/Failed to load|net::ERR/.test(m.text())) { err.push('CONSOLE ' + m.text().slice(0, 150)); } });
    var ok = 0, ko = 0;
    var v = function (t, c, d) { if (c) { ok++; console.log('   OK  ' + t + (d ? '  — ' + d : '')); } else { ko++; console.log('   KO  ' + t + (d ? '  — ' + d : '')); } };

    await page.goto(BASE + '/index.html', { waitUntil: 'load', timeout: 120000 });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen(); }, null, { timeout: 180000 });
    await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);

    console.log('=== LES FICHES ET LES TROUPES NEUVES ===\n');
    // les fiches : leurs balises, leurs images, leurs compétences
    var f = await page.evaluate(function (a) {
        var out = { manques: [], images: [], comp: [], peuples: {} };
        for (var i = a[0]; i <= a[1]; i++) {
            var d = $dataEnemies[i]; if (!d || !d.name) { out.manques.push(i); continue; }
            if (!d.meta.Monde) { out.manques.push(i + ' sans monde'); }
            if (d.meta.Peuple) { out.peuples[d.meta.Peuple.trim()] = (out.peuples[d.meta.Peuple.trim()] || 0) + 1; }
            d.actions.forEach(function (x) { if (!$dataSkills[x.skillId] || !$dataSkills[x.skillId].name) { out.comp.push(i + ':' + x.skillId); } });
            out.images.push(d.battlerName);
        }
        return out;
    }, [FICHE1, FICHEN]);
    v('les ' + (FICHEN - FICHE1 + 1) + ' fiches neuves existent, chacune avec son monde', !f.manques.length, f.manques.join(', '));
    v('toutes leurs compétences existent', !f.comp.length, f.comp.join(', '));
    v('les peuples du Chapitre 1 qui manquaient ont maintenant des fiches (trolls, arbres…)', f.peuples.trolls >= 2 && f.peuples.arbres >= 1 && f.peuples.pleureuses >= 3, JSON.stringify(f.peuples));
    var images = await page.evaluate(function (l) {
        return new Promise(function (res) {
            var bm = l.map(function (n) { return ImageManager.loadSvEnemy(n, 0); }), t = 0;
            (function attendre() { if (bm.every(function (b) { return b.isReady(); }) || t++ > 300) { res(l.filter(function (n, i) { return !bm[i].isReady() || bm[i].width < 8; })); } else { setTimeout(attendre, 100); } })();
        });
    }, f.images);
    v('toutes leurs images se chargent', !images.length, images.join(', '));

    // une vraie scène de combat, une fois : son journal et son décor servent ensuite à chaque troupe
    // (BattleManager.setup remet le journal à vide ; la fin d'une action en a besoin)
    await page.evaluate(function (t) { $gameParty.members().forEach(function (a) { a.recoverAll(); }); BattleManager.setup(t, true, true); SceneManager.push(Scene_Battle); }, PREMIERE);
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging() && BattleManager.isInputting(); }, null, { timeout: 300000 });
    await page.evaluate(function () {
        window.__journal = BattleManager._logWindow; window.__decor = BattleManager._spriteset;
        SceneManager._scene.update = function () { };
    });
    // les troupes : chacune s'ouvre, chacun a son peuple et son nom, un tour se joue
    var lignes = [], fautes = [];
    for (var t = PREMIERE; t <= DERNIERE; t++) {
        var r = await page.evaluate(function (t) {
            try {
                $dataMap.meta['Chapitre 1'] = true;
                BattleManager.setup(t, true, true);
                BattleManager._logWindow = window.__journal; BattleManager._spriteset = window.__decor; BattleManager._phase = 'turn';
                // en combat, ce sont les sprites qui créent la liste des chiffres de dégâts (YEP, isDamagePopupRequested) ; ici, pas de sprite
                $gameTroop.members().concat($gameParty.members()).forEach(function (b) { b.clearDamagePopup(); });
                LesPeuples.debutDeCombat();
                var m = $gameTroop.members(), o = { nom: $dataTroops[t].name, membres: [] };
                m.forEach(function (e) { o.membres.push({ nom: e.name(), fiche: e.enemy().name, peuple: LesPeuples.peuple(e), monde: (e.enemy().meta.Monde || '').trim(), parlable: Parler.parlable(e), personnage: !!e.enemy().meta.Personnage }); });
                // un tour : les débuts et fins de tour des peuples, et chacun agit sur un héros
                $gameTroop._turnCount = 3; LesPeuples.debutDeTour();
                m.forEach(function (e) { e.makeActions(); var a = e.currentAction(); if (a && a.item()) { var c = a.makeTargets(); if (c[0]) { c[0].clearResult(); a.apply(c[0]); } } });
                BattleManager._subject = $gameParty.members()[0]; BattleManager.endAction(); BattleManager._subject = null;
                LesPeuples.finDeTour();
                return o;
            } catch (x) { return { erreur: String(x).slice(0, 120) + ' @ ' + String(x.stack || '').split('\n').slice(1, 6).map(function (l) { return l.trim().replace(/https?:\/\/[^/]+\//, ''); }).join(' / ') }; }
        }, t);
        if (r.erreur) { fautes.push(t + ' : ' + r.erreur); continue; }
        lignes.push(String(t).padStart(4) + ' ' + r.nom + ' — ' + r.membres.map(function (x) { return x.nom + (x.peuple ? ' [' + x.peuple + ']' : '') + (x.parlable ? ' 💬' : ''); }).join(', '));
        r.membres.forEach(function (x) {
            if (!x.monde) { fautes.push(t + ' ' + x.nom + ' sans monde'); }
            // un personnage garde son nom ; une créature dont la fiche porte le nom de son peuple en reçoit un à elle
            if (x.personnage && x.nom.indexOf(x.fiche) !== 0) { fautes.push(t + ' ' + x.fiche + ' a perdu son nom : ' + x.nom); }
            if (!x.personnage && x.peuple && x.peuple !== 'humains' && /^(Gelée|Gobelin|Orque|Pleureuse|Loup-Frisson|Rêveur|Os-Têtu|Braise|Vouivre|Troll)/.test(x.fiche) && !/\(/.test(x.nom)) { fautes.push(t + ' ' + x.fiche + ' sans nom propre'); }
        });
    }
    console.log(lignes.join('\n') + '\n');
    v('les ' + (DERNIERE - PREMIERE + 1) + ' troupes s\'ouvrent et jouent un tour sans erreur', !fautes.length, fautes.slice(0, 6).join(' | '));

    // contre-épreuve : sans sa balise <Peuple:>, une Gelée neuve n'a plus d'humeur
    var ce = await page.evaluate(function () {
        BattleManager.setup(833, true, true);
        var e = $gameTroop.members()[0], d = JSON.parse(JSON.stringify(e.enemy())); e.enemy = function () { return d; };
        var avec = LesPeuples.peuple(e);
        delete d.meta.Peuple; d.name = 'Chose';
        return { avec: avec, sans: LesPeuples.peuple(e) };
    });
    v('contre-épreuve : sans sa balise ni un nom de peuple, plus de peuple', ce.avec === 'gelees' && !ce.sans, JSON.stringify(ce));
    v('aucune erreur dans le jeu', err.length === 0, err.slice(0, 4).join(' | '));
    console.log('\n' + ok + ' OK, ' + ko + ' KO');
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
