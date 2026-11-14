/*
 * LE CHANT — l'ennemi qui brise l'écran et chante (LeChant.js v1.0)
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-02 : « au bout d'un moment […] il va avoir une attaque, qui va
 * littéralement briser l'écran, et qui va te lancer un nouveau combat avec vos
 * PV à vous et ses PV à lui, où là, lui va faire un rythme de chant. Et après,
 * il va alterner entre les deux », puis : « Sous 70 % de ses PV », « Tous les
 * 3 tours (réglable) », « Je le crée moi-même » (une balise sur son ennemi).
 *
 * Aucune fiche n'est touchée : le banc pose <Chant:> et <Boss> en mémoire sur
 * l'Ogre (7), seul dans la troupe 1, et sert ses partitions par le réseau. En
 * boss, ScenesDeBoss lui remet son titre à chaque Scene_Battle.start : le retour
 * du chant ne doit pas le montrer (le troll de JOKO, ennemi 831, est un boss).
 *
 *   ① à 100 % : il ne chante pas ; contre-épreuve, un ennemi sans <Chant:> non plus ;
 *   ② sous 70 % : au début du tour, l'annonce, l'écran se fissure, part en
 *     éclats, puis le Theatrhythm s'ouvre ;
 *   ③ le chant : contre LUI, sur sa partition, avec le décor du combat ; ses
 *     PV et les vôtres tels quels (MOG ne soigne pas) ; 4 couloirs au plus ;
 *   ④ la partition finie : retour au combat, au même tour, en saisie ; il a
 *     ses PV du chant, l'équipe la part qui lui reste ; buffs, états, PT, TP
 *     de seiryu… gardés ; le combat n'a pas « recommencé » (pas de titre de
 *     boss, la musique de la carte retenue) ;
 *   ⑤ il alterne : 1 et 2 tours plus tard, non ; 3 tours, oui, sur sa 2e
 *     partition ;
 *   ⑥ tombé pendant le chant : vaincu, la victoire du combat suit ;
 *   ⑦ après, un Theatrhythm sur la carte soigne toujours (MOG comme avant).
 *
 *   node bancs/navigateur/le_chant.js
 */
'use strict';
var { chromium } = require('playwright');
var http = require('http'), fs = require('fs'), path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.ttf': 'font/ttf', '.woff': 'font/woff', '.otf': 'font/otf' };
var serveur = http.createServer(function (req, res) {
    var f = path.join(RACINE, decodeURIComponent(req.url.split('?')[0]));
    if (f.indexOf(RACINE) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
});
var erreurs = [];
var CHANT = { version: 1, musique: null, bpm: 120, decalage: 0, vitesse: 5, notes: [{ t: 0.5, c: 0, b: 0 }, { t: 1, c: 1, b: 1 }, { t: 1.5, c: 2, b: 2 }], vitesses: [] };

(async function () {
    var ok = 0, ko = 0, nav = null;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    try {
        await new Promise(function (r) { serveur.listen(0, '127.0.0.1', r); });
        nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
        var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
        page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
        await page.route('**/data/rythmes/_chant_banc*.json', function (r) { r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CHANT) }); });
        await page.goto('http://127.0.0.1:' + serveur.address().port + '/index.html', { waitUntil: 'load' });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 180000 });

        // l'équipe, puis le combat contre l'Ogre seul (troupe 1, en mémoire)
        await page.evaluate(function () {
            DataManager.setupNewGame();
            $gameParty._actors = [1, 2, 3, 4, 6];
            $dataTroops[1].members = [{ enemyId: 7, x: 280, y: 380, hidden: false }];
            $dataTroops[1].pages = [{ conditions: { actorHp: 50, actorId: 1, actorValid: false, enemyHp: 50, enemyIndex: 0, enemyValid: false, switchId: 1, switchValid: false, turnA: 0, turnB: 0, turnEnding: false, turnValid: false }, list: [{ code: 0, indent: 0, parameters: [] }], span: 0 }];
            $gamePlayer.reserveTransfer(10, 5, 5, 2, 0);          // Mini Games : un décor de combat (Grassland / Forest)
            SceneManager.goto(Scene_Map);
        });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Map' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 120000 });
        var enSaisie = function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Battle' && SceneManager.isCurrentSceneStarted() && BattleManager._phase === 'input'; };

        // ① contre-épreuve : un ennemi sans <Chant:> à 60 % ne chante pas
        await page.evaluate(function () { BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle); });
        await page.waitForFunction(enSaisie, null, { timeout: 120000 });
        var r1 = await page.evaluate(function () {
            var o = $gameTroop.members()[0];
            o.setHp(Math.floor(o.mhp * 0.6));
            BattleManager.startInput();
            var sans = BattleManager._phase;
            o.enemy().meta.Chant = ' _chant_banc, _chant_banc_2';     // en mémoire seulement
            o.enemy().meta.Boss = true;                               // comme le troll de JOKO
            o.setHp(o.mhp);
            BattleManager.startInput();
            return { sans: sans, plein: BattleManager._phase, enCours: !!LeChant._enCours, membres: $gameParty.battleMembers().length };
        });
        console.log('\n① Avant le seuil');
        V('contre-épreuve : sans <Chant:>, à 60 % il ne chante pas', r1.sans === 'input');
        V('avec <Chant:>, à 100 % il ne chante pas encore', r1.plein === 'input' && !r1.enCours);

        // ② sous 70 % : l'écran se brise
        var r2 = await page.evaluate(function () {
            var o = $gameTroop.members()[0], v = $gameActors.actor(1), s = $gameActors.actor(6);
            // ce que le combat doit garder
            v.addBuff(2, 5); v.addState(13); v.setTp(42); v.setHp(Math.floor(v.mhp / 2));
            var sp = SceneManager._scene._spriteset;
            window.__avant = { fond: sp._back1Sprite.bitmap && sp._back1Sprite.bitmap._url, tour: $gameTroop.turnCount(), mapBgm: BattleManager._mapBgm, titres: window.MecaBoss && MecaBoss._bannieres ? MecaBoss._bannieres.length : 0, membres: $gameParty.battleMembers().length, seiryuTp: s.tp, recoverAll: Game_BattlerBase.prototype.recoverAll };
            o.setHp(Math.floor(o.mhp * 0.69));
            // chaque titre de boss montré à partir d'ici (le bandeau de ScenesDeBoss)
            var montrer = MecaBoss.Sprite_Bandeau.prototype.montrer; window.__titres = 0;
            MecaBoss.Sprite_Bandeau.prototype.montrer = function (b) { if (b && b.type === 'titre') window.__titres++; return montrer.call(this, b); };
            BattleManager.startInput();
            return { phase: BattleManager._phase, nom: LeChant._enCours && LeChant._enCours.nom, effet: !!(LeChant._enCours && LeChant._enCours.eclats && LeChant._enCours.eclats.parent === SceneManager._scene) };
        });
        console.log('\n② Sous 70 % : l\'écran se brise');
        V('au début du tour, à 69 % : il chante (phase « chant »), sa 1re partition', r2.phase === 'chant' && r2.nom === '_chant_banc', JSON.stringify(r2));
        V('l\'écran qui se brise est posé sur le combat', r2.effet);
        await page.waitForFunction(function () { var e = LeChant._enCours && LeChant._enCours.eclats; return e && e._eclats.length > 0; }, null, { timeout: 60000 }).catch(function () {});
        var r2b = await page.evaluate(function () { var e = LeChant._enCours.eclats; return { eclats: e._eclats.length, photo: !!e._photo }; });
        V('il part en éclats (des morceaux de la photo de l\'écran)', r2b.eclats >= 30 && r2b.photo, r2b.eclats + ' éclats');

        // ③ le chant
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Theatrhythm' && SceneManager.isCurrentSceneStarted() && s._sprite_buttons; }, null, { timeout: 120000 });
        var r3 = await page.evaluate(function () {
            var s = SceneManager._scene, o = $gameTroop.members()[0], v = $gameActors.actor(1);
            var pvMoyens = 0; s._battlers.forEach(function (a) { pvMoyens += a.hp; }); pvMoyens /= s._battlers.length;
            return {
                chant: !!s._chant, partition: s._partition && s._partition.nom, ennemi: s._enemy.name() === o.name(),
                pvEnnemi: [s._enemy_hp[0], o.hp, s._enemy_hp[1], o.mhp], vesper: [v.hp, v.mhp],
                equipe: [Math.round(s._party_hp[0]), Math.round(pvMoyens)], couloirs: s._battlers.length,
                fond: s._back1Sprite.bitmap && s._back1Sprite.bitmap._url, fondCombat: window.__avant.fond, membresEnCombat: window.__avant.membres
            };
        });
        console.log('\n③ Le chant');
        V('le Theatrhythm s\'ouvre contre LUI, sur sa partition', r3.chant && r3.partition === '_chant_banc' && r3.ennemi, JSON.stringify({ p: r3.partition, ennemi: r3.ennemi }));
        V('ses PV à lui : 69 %, pas ses PV pleins', r3.pvEnnemi[0] === r3.pvEnnemi[1] && r3.pvEnnemi[2] === r3.pvEnnemi[3] && r3.pvEnnemi[0] < r3.pvEnnemi[2], r3.pvEnnemi.join(' / '));
        V('vos PV à vous : MOG ne soigne pas (Vesper reste à moitié)', r3.vesper[0] === Math.floor(r3.vesper[1] / 2) && r3.equipe[0] === r3.equipe[1], 'Vesper ' + r3.vesper.join('/') + ' · équipe ' + r3.equipe.join(' = '));
        V('4 couloirs au plus (l\'équipe en combat : ' + r3.membresEnCombat + ')', r3.couloirs === Math.min(4, r3.membresEnCombat), r3.couloirs + ' couloirs');
        V('le décor du combat en cours (carte 10 : Grassland)', !!r3.fond && r3.fond === r3.fondCombat && /Grassland/.test(r3.fond), r3.fond + ' = ' + r3.fondCombat);

        // ses coups à chaque raté (v1.1, JOKO 2026-11-09 : « Nerf les dégâts de la reine phase 2 en musique ») :
        // un raté de MOG coûte ATQ + MAG − défense de l'équipe ; <Chant dégâts: n> n'en garde que n %.
        // L'ennemi frappe ici pour 1000 tout rond (son ATQ posé), puis l'Ogre reçoit la balise en mémoire.
        var r3b = await page.evaluate(function () {
            var s = SceneManager._scene, o = $gameTroop.members()[0], avant = s._party_hp[0], phase = $gameSystem._theatrhythm_phase, atk = s._enemy_atk;
            var depart = s._chant.force;                       // posée à l'ouverture du chant, d'après LUI
            $gameSystem._theatrhythm_phase = 1;
            s._enemy_atk = s._party_def + 1000;
            s.execute_damage(1); var plein = avant - s._party_hp[0]; s._party_hp[0] = avant;
            var meta = $dataEnemies[o.enemyId()].meta; meta['Chant dégâts'] = ' 30'; s._chant.force = LeChant.forceDe(o);
            s.execute_damage(1); var nerf = avant - s._party_hp[0]; s._party_hp[0] = avant;
            var garde = s._enemy_atk;
            delete meta['Chant dégâts']; s._chant.force = LeChant.forceDe(o);
            s._enemy_atk = atk; $gameSystem._theatrhythm_phase = phase;
            return { depart: depart, plein: plein, nerf: nerf, garde: garde === s._party_def + 1000, retour: s._chant.force, avatar: LeChant.forceDe(new Game_Enemy(824, 0, 0)), troll: LeChant.forceDe(new Game_Enemy(831, 0, 0)) };
        });
        V('sans <Chant dégâts:>, un raté coûte ce que MOG compte (ATQ + MAG − défense de l\'équipe)', r3b.depart === 1 && r3b.plein === 1000 && r3b.retour === 1, r3b.plein + ' sur 1000 · force posée à l\'ouverture : ' + r3b.depart);
        V('<Chant dégâts: 30> : un raté ne coûte plus que 30 %, et son ATQ n\'est pas touchée', r3b.nerf === 300 && r3b.garde, r3b.nerf + ' sur 1000');
        V('l\'avatar d\'Ardélia (824) porte <Chant dégâts: 30> ; le troll de JOKO (831) garde ses coups', r3b.avatar === 0.3 && r3b.troll === 1, 'avatar ×' + r3b.avatar + ' · troll ×' + r3b.troll);

        // on chante : l'horloge du banc ; il finit à 40 %, l'équipe à la moitié de ce qu'elle avait
        await page.evaluate(function () {
            var s = SceneManager._scene;
            window.__t = 0; s.tempsPartition = function () { return window.__t; };
            $gameSystem._theatrhythm_phase = 1;
            s._enemy_hp[0] = Math.floor(s._enemy_hp[1] * 0.4);
            s._party_hp[0] = s._party_hp[0] / 2;
            window.__t = 5;
        });
        await page.waitForFunction(enSaisie, null, { timeout: 120000 });
        var r4 = await page.evaluate(function () {
            var o = $gameTroop.members()[0], v = $gameActors.actor(1), s = $gameActors.actor(6), a = window.__avant;
            return {
                pvOgre: o.hp, attendu: Math.floor(o.mhp * 0.4), vesper: v.hp, vesperAttendu: Math.max(1, Math.round(Math.floor(v.mhp / 2) / 2)),
                buff: v._buffs[2], etat: v.isStateAffected(13), tp: v.tp, seiryuTp: s.tp === a.seiryuTp,
                tour: $gameTroop.turnCount() === a.tour, enCombat: $gameParty.inBattle(), mapBgm: BattleManager._mapBgm === a.mapBgm,
                titres: window.__titres + MecaBoss._bannieres.filter(function (b) { return b.type === 'titre'; }).length,
                membres: $gameParty.battleMembers().length, membresAvant: a.membres, enCours: LeChant._enCours,
                recoverAll: Game_BattlerBase.prototype.recoverAll === a.recoverAll, finTour: o._chant.finTour
            };
        });
        console.log('\n④ Retour au combat, chacun avec ce qui lui reste');
        V('la partition finie : retour au combat, au même tour, en saisie', r4.tour && r4.enCombat && r4.enCours === null);
        V('ses PV : ceux de la fin du chant (40 %)', r4.pvOgre === r4.attendu, r4.pvOgre + ' / attendu ' + r4.attendu);
        V('l\'équipe garde sa part : Vesper, à moitié, en perd la moitié', Math.abs(r4.vesper - r4.vesperAttendu) <= 1, r4.vesper + ' / attendu ' + r4.vesperAttendu);
        V('le combat continue : buff, état, PT de Vesper et PT de seiryu gardés', r4.buff === 1 && r4.etat && r4.tp === 42 && r4.seiryuTp, JSON.stringify({ buff: r4.buff, etat: r4.etat, tp: r4.tp }));
        V('il n\'a pas « recommencé » : pas de titre de boss, la musique de la carte retenue', r4.titres === 0 && r4.mapBgm, r4.titres + ' titre(s) de boss');
        V('l\'équipe de combat est de nouveau entière ; MOG retrouve son soin', r4.membres === r4.membresAvant && r4.recoverAll);

        // ⑤ il alterne : tous les 3 tours
        var r5 = await page.evaluate(function () {
            var o = $gameTroop.members()[0], fin = o._chant.finTour, out = [];
            [1, 2].forEach(function (n) { $gameTroop._turnCount = fin + n; BattleManager.startInput(); out.push(BattleManager._phase); });
            $gameTroop._turnCount = fin + 3; BattleManager.startInput();
            out.push(BattleManager._phase, LeChant._enCours && LeChant._enCours.nom);
            return out;
        });
        console.log('\n⑤ Il alterne');
        V('1 et 2 tours après : combat normal', r5[0] === 'input' && r5[1] === 'input', r5.slice(0, 2).join(', '));
        V('3 tours après : il rechante, sur sa 2e partition', r5[2] === 'chant' && r5[3] === '_chant_banc_2', r5.slice(2).join(' · '));

        // ⑥ tombé pendant le chant
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Theatrhythm' && SceneManager.isCurrentSceneStarted() && s._sprite_buttons; }, null, { timeout: 120000 });
        await page.evaluate(function () {
            var s = SceneManager._scene;
            s.tempsPartition = function () { return 0.2; };
            $gameSystem._theatrhythm_phase = 1;
            s._enemy_hp[0] = 1;
            s.execute_damage(0);
        });
        for (var k = 0; k < 60; k++) {
            var ou = await page.evaluate(function () { return SceneManager._scene.constructor.name; });
            if (ou !== 'Scene_Theatrhythm') break;
            await page.keyboard.press('Enter'); await page.waitForTimeout(1000);
        }
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Battle' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 120000 });
        await page.waitForTimeout(500);
        var r6 = await page.evaluate(function () { return { mort: $gameTroop.members()[0].isDead(), tous: $gameTroop.isAllDead(), victoire: BattleManager.isVictoryPhase() || BattleManager._phase === 'battleEnd' }; });
        console.log('\n⑥ Tombé pendant le chant');
        V('l\'Ogre tombé dans le chant est vaincu, la victoire du combat suit', r6.mort && r6.tous && r6.victoire, JSON.stringify(r6));

        // ⑦ sur la carte, MOG comme avant : il soigne en entrant
        for (var j = 0; j < 30; j++) {
            var sc = await page.evaluate(function () { return SceneManager._scene.constructor.name; });
            if (sc === 'Scene_Map') break;
            await page.keyboard.press('Enter'); await page.waitForTimeout(800);
        }
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Map' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 120000 });
        await page.evaluate(function () {
            var v = $gameActors.actor(1); v.setHp(1);
            $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['theatrhythm : 1 : 2'] }, { code: 0, indent: 0, parameters: [] }], 0);
        });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Theatrhythm' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 120000 });
        var r7 = await page.evaluate(function () { var v = $gameActors.actor(1); return { chant: !!SceneManager._scene._chant, pv: v.hp === v.mhp }; });
        console.log('\n⑦ Sur la carte, MOG comme avant');
        V('un Theatrhythm sur la carte n\'est pas un chant, et MOG soigne en entrant', !r7.chant && r7.pv, JSON.stringify(r7));
        V('aucune erreur dans la page', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
    } catch (e) {
        ko++; console.error(e); console.error('erreurs de la page :', erreurs.slice(0, 5));
    } finally {
        if (nav) await nav.close();
        serveur.close();
    }
    console.log('\n' + (ko ? '❌ ' + ko + ' échec(s), ' + ok + ' réussite(s)' : '✅ TOUT PASSE (' + ok + ' contrôles)'));
    process.exit(ko ? 1 : 0);
})();
