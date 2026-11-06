/*
 * LA SOUVERAINE ÉCARLATE — le boss de fin (LAvatarDeLaFille.js v1.0, troupe 92)
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-06 : « une phase une avec la reine écarlate du lore avec ses
 * compétences et son combat et quand elle tombe a zéro elle parle un discours
 * […] puis une animation très stylé et le combat de l'avatar […] le dépassement
 * des concepts, ex: le chant, brisé les domaines comme royaume impérial ou monde
 * gelé elle brisé l'écran et affiche un fond en arrière de forêt perdu […] fait
 * bouger ou faussement crach ton jeu puis brisé l'écran même coup l'écran en deux
 * […] », puis « Elle parle légèrement puis meurt et oui fait tout ai max c'est la
 * boss de fin ».
 *
 * Joué dans le vrai jeu, par l'Arène de la carte 1 (l'événement de JOKO) :
 *   ① les fiches : la troupe 92, ses deux IA (niveau 100), les 4 compétences ;
 *   ② phase 1 : Immortel dès le tour 0 ; elle se bat avec SES compétences — et la
 *     contre-épreuve : l'IA de la Pondeuse d'avant est attrapée ;
 *   ③ la chute : à 0 % elle ne tombe pas, elle parle (4 messages), l'aigle de feu,
 *     l'image figée, puis l'avatar (824) à tous ses PV, Immortel, xevel,
 *     l'interrupteur 318, l'image qui vole en éclats ; le combat continue —
 *     contre-épreuve : sans Immortel, elle tombe et le combat finit ;
 *   ④ Tranche-Concept : l'écran en deux moitiés, les domaines tranchés (Royaume
 *     Impérial, Monde Gelé), la Forêt Perdue derrière, les dégâts APRÈS l'effet ;
 *     l'IA la choisit quand un domaine est ouvert, et seulement là ;
 *   ⑤ Briser l'Écran : des éclats, la Forêt Perdue ;
 *   ⑥ Le Jeu Plante : l'écran d'erreur de RPG Maker (texte, flou), la musique
 *     coupée, puis tout revient ; le jeu n'est pas arrêté ; une fois par combat ;
 *   ⑦ La Main sur le Jeu : l'image du jeu penche, puis se remet droite ;
 *   ⑧ le chant (LeChant) : sous 70 %, sur la Forêt Perdue, et retour ;
 *   ⑨ sa fin : elle parle, brûle, tombe en boss ; Cendreux avec elle ; victoire ;
 *   ⑩ aucune erreur de page.
 *
 *   node bancs/navigateur/la_souveraine_ecarlate.js
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
var CAPT = path.join(__dirname, 'captures');
var CHANT = { version: 1, musique: null, bpm: 120, decalage: 0, vitesse: 5, notes: [{ t: 0.5, c: 0, b: 0 }, { t: 1, c: 1, b: 1 }], vitesses: [] };

(async function () {
    var ok = 0, ko = 0, nav = null, erreurs = [];
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    try {
        if (!fs.existsSync(CAPT)) fs.mkdirSync(CAPT);
        await new Promise(function (r) { serveur.listen(0, '127.0.0.1', r); });
        nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
        var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
        page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
        // « Entrée » : sans carte graphique, le jeu tourne parfois à ~5 images par seconde, et une touche
        // pressée et relâchée entre deux images n'est jamais vue (MV lit l'état de la touche à chaque image) :
        // le message attendait pour toujours. On tourne la page du message comme le ferait la touche.
        async function avancer() {
            await page.evaluate(function () {
                var w = SceneManager._scene && SceneManager._scene._messageWindow;
                if (w && w.pause && w.isOpen()) { w.pause = false; if (!w._textState) w.terminateMessage(); }
            });
        }
        // ses partitions (« couplet_1, refrain, couplet_2 ») n'existent pas encore : le banc en sert une courte
        await page.route('**/data/rythmes/*.json', function (r) { r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CHANT) }); });
        await page.goto('http://127.0.0.1:' + serveur.address().port + '/index.html', { waitUntil: 'load' });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 300000 });

        // ═════ ① les fiches
        console.log('\n① Les fiches');
        var f = await page.evaluate(function () {
            var t = $dataTroops[92], cmds = [].concat.apply([], t.pages.map(function (p) { return p.list; }));
            var plug = cmds.filter(function (c) { return c.code === 356; }).map(function (c) { return c.parameters[0]; });
            var arene = $dataMapInfos[1] ? null : null;
            var balises = [[1328, 'TrancheConcept'], [1329, 'BriseEcran'], [1330, 'FauxPlantage'], [1331, 'MainSurLeJeu']].map(function (x) { var s = $dataSkills[x[0]]; return s && s.meta[x[1]] ? x[1] : '✗' + x[0]; });
            return {
                membres: t.members.map(function (m) { return m.enemyId; }), plug: plug,
                transforme: cmds.some(function (c) { return c.code === 336 && c.parameters[1] === 824; }),
                combatDansLeCombat: cmds.some(function (c) { return c.code === 301; }),
                ia830: $dataEnemies[830].aiLevel, ia824: $dataEnemies[824].aiLevel,
                motif830: $dataEnemies[830].aiPattern, motif824: $dataEnemies[824].aiPattern,
                balises: balises, meca: /MecaNombre/.test($dataEnemies[824].note),
                pv: [$dataEnemies[830].params[0], $dataEnemies[824].params[0]]
            };
        });
        V('la troupe 92 : la Reine (830) et Cendreux (470)', f.membres.join(',') === '830,470', f.membres.join(','));
        V('les pages : chute, revele, fin ; « Transformer » en 824 ; plus de « Combat » dans le combat', f.plug.join('|') === 'AVATAR chute|AVATAR revele|AVATAR fin' && f.transforme && !f.combatDansLeCombat, f.plug.join(' | '));
        V('IA au maximum : niveau 100 pour les deux', f.ia830 === 1 && f.ia824 === 1, f.ia830 + ' / ' + f.ia824);
        V('ses compétences de concept portent leur balise', f.balises.join(',') === 'TrancheConcept,BriseEcran,FauxPlantage,MainSurLeJeu', f.balises.join(', '));
        V('l\'avatar garde ce que JOKO lui a mis : « Petits en nombre » (MecaNombre), ses deux <Chant:>', f.meca);
        console.log('        PV : Reine ' + f.pv[0] + ', avatar ' + f.pv[1]);

        // ═════ ② la phase 1, par l'Arène de la carte 1
        console.log('\n② La phase 1 : l\'Arène');
        await page.evaluate(function () {
            DataManager.setupNewGame();
            $gameParty._actors = [1, 2, 3, 4, 6];
            $gamePlayer.reserveTransfer(1, 12, 10, 8, 0);
            SceneManager.goto(Scene_Map);
        });
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Map' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 180000 });
        await page.evaluate(function () {
            window.__j = [];
            var sm = Window_Message.prototype.startMessage;
            Window_Message.prototype.startMessage = function () { window.__j.push({ msg: $gameMessage.allText(), visage: $gameMessage.faceName() }); return sm.apply(this, arguments); };
            Game_Actor.prototype.isAutoBattle = function () { return true; };
            $gameMap.event(4).start();
        });
        // en combat auto, la phase « input » ne dure pas : on attend un moment calme (entre deux actions)
        var enSaisie = function () {
            var s = SceneManager._scene;
            return s && s.constructor.name === 'Scene_Battle' && SceneManager.isCurrentSceneStarted() && ['input', 'turn', 'turnEnd'].indexOf(BattleManager._phase) >= 0
                && !$gameTroop.isEventRunning() && !LAvatar.bloque() && !$gameMessage.isBusy();
        };
        await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Battle' && SceneManager.isCurrentSceneStarted() && $gameTroop._troopId === 92; }, null, { timeout: 180000 });
        // le tour 0 : la page « Immortel »
        await page.waitForFunction(function () { var q = $gameTroop.members()[0]; return q && q.isStateAffected(3); }, null, { timeout: 120000 }).catch(function () { });
        var r2 = await page.evaluate(function () {
            var q = $gameTroop.members()[0], vus = {};
            // sans renfort de magie, elle se renforce d'abord (Contre-Sort) ; renforcée, elle frappe
            q._buffs[4] = 0; q.makeActions(); var premier = q._actions[0] && q._actions[0].item() ? q._actions[0].item().id : 0;
            q._buffs[4] = 1;
            for (var i = 0; i < 40; i++) { q.makeActions(); var a = q._actions[0]; if (a && a.item()) vus[a.item().id] = 1; }
            q._buffs[4] = 0;
            var siens = $dataEnemies[830].actions.map(function (x) { return x.skillId; });
            // contre-épreuve : l'IA d'avant (celle de la Pondeuse)
            var avant = $dataEnemies[830].aiPattern;
            $dataEnemies[830].aiPattern = ['TURN % 3 === 1: Skill 1052, Random', 'ALWAYS: Skill 973, Random'];
            var vusAvant = {};
            for (var k = 0; k < 20; k++) { q.makeActions(); var b = q._actions[0]; if (b && b.item()) vusAvant[b.item().id] = 1; }
            $dataEnemies[830].aiPattern = avant; q.makeActions();
            return { immortel: q.isStateAffected(3), premier: premier, vus: Object.keys(vus).map(Number), siens: siens, vusAvant: Object.keys(vusAvant).map(Number), nom: q.name() };
        });
        V('dès le tour 0, elle est Immortelle (elle ne tombera pas avant d\'avoir parlé)', r2.immortel);
        V('IA : sans renfort, elle se renforce d\'abord (Contre-Sort, 156)', r2.premier === 156, String(r2.premier));
        V('IA : ensuite, plusieurs de SES compétences, aucune d\'ailleurs', r2.vus.length > 2 && r2.vus.every(function (i) { return r2.siens.indexOf(i) >= 0; }), r2.vus.join(', '));
        V('… contre-épreuve : l\'IA de la Pondeuse (Mandibules 973) est attrapée', r2.vusAvant.some(function (i) { return r2.siens.indexOf(i) < 0; }), r2.vusAvant.join(', '));

        // ═════ ③ la chute
        console.log('\n③ La chute');
        await page.waitForFunction(enSaisie, null, { timeout: 120000 });
        await page.evaluate(function () {
            window.__vu = { aigle: false, fige: false, noir: false };
            var q = $gameTroop.members()[0]; q.setHp(1);
            $gameParty.members().forEach(function (a) { a.recoverAll(); });
        });
        var fin = Date.now() + 600000, vu = null, photoAZero = false;
        while (Date.now() < fin) {
            await avancer();
            await page.waitForTimeout(300);
            vu = await page.evaluate(function () {
                var e = LAvatar._effets[0];
                if (e && e.aigle && e.aigle.parent) window.__vu.aigle = true;
                if (LAvatar._fige) window.__vu.fige = true;
                if (LAvatar._noir) window.__vu.noir = true;
                $gameParty.members().forEach(function (a) { if (a.hpRate() < 0.5) a.setHp(a.mhp); });
                var q = $gameTroop.members()[0];
                return { id: q.enemyId(), pv: q.hp, mhp: q.mhp, sw: $gameSwitches.value(318), fige: !!LAvatar._fige, bloque: LAvatar.bloque(), ev: $gameTroop.isEventRunning(), phase: BattleManager._phase, scene: SceneManager._scene.constructor.name };
            });
            if (vu.scene !== 'Scene_Battle') break;
            if (vu.id === 824 && vu.sw && !vu.fige && !vu.bloque && !vu.ev) break;
            if (!photoAZero && vu.id === 830 && vu.pv === 0) { photoAZero = true; await page.screenshot({ path: path.join(CAPT, 'souveraine_a_zero.png') }); }
        }
        var r3 = await page.evaluate(function () {
            var q = $gameTroop.members()[0], c = $gameTroop.members()[1];
            return { msgs: window.__j.slice(), vu: window.__vu, id: q.enemyId(), pv: q.hp, mhp: q.mhp, immortel: q.isStateAffected(3), mort: q.isDead(),
                musique: AudioManager._currentBgm && AudioManager._currentBgm.name, sw: $gameSwitches.value(318), fin: BattleManager._phase,
                cendreux: c ? (c.isAppeared() ? (c.isDead() ? 'tombé' : 'debout') : 'caché') : '?' };
        });
        await page.screenshot({ path: path.join(CAPT, 'souveraine_avatar.png') });
        var parle = r3.msgs.filter(function (m) { return m.msg.trim(); });
        V('à 0 %, elle parle : 3 messages à son visage, puis la Bible', parle.length >= 4 && parle.slice(0, 3).every(function (m) { return m.visage === 'F_Castle_02'; }) && /refuse de mourir/.test(parle[3].msg), parle.length + ' messages');
        V('l\'animation : le noir, l\'aigle de feu, l\'image figée', r3.vu.noir && r3.vu.aigle && r3.vu.fige, JSON.stringify(r3.vu));
        V('… puis l\'avatar (824), à tous ses PV, toujours Immortelle', r3.id === 824 && r3.pv === r3.mhp && r3.immortel && !r3.mort, r3.id + ' ' + r3.pv + '/' + r3.mhp);
        V('… la musique xevel, l\'interrupteur 318, l\'image brisée : le combat continue', r3.musique === 'xevel' && r3.sw && !LAvatar_fige_reste(vu) && vu.scene === 'Scene_Battle', r3.musique + ' · ' + r3.fin);
        console.log('        Cendreux : ' + r3.cendreux);
        function LAvatar_fige_reste(v) { return v && v.fige; }

        // contre-épreuve : sans Immortel, la Reine tombe et le combat finit (page « 0 % » trop tard)
        var r3b = await page.evaluate(function () {
            var g = new Game_Enemy(830, 0, 0);
            g.setHp(0);
            var mortSans = g.isDead();
            var h = new Game_Enemy(830, 0, 0); h.addState(3); h.setHp(0);
            return { sans: mortSans, avec: h.isDead() };
        });
        V('contre-épreuve : sans Immortel elle tombe à 0, avec elle reste debout', r3b.sans && !r3b.avec, 'sans ' + r3b.sans + ' · avec ' + r3b.avec);

        // ═════ les concepts : on la fait agir, ce tour-ci
        async function faireAgir(skillId, preparer) {
            await page.waitForFunction(enSaisie, null, { timeout: 180000 });
            await page.evaluate(function (a) {
                var q = $gameTroop.members()[0];
                q.setHp(q.mhp);
                $gameParty.members().forEach(function (m) { m.recoverAll(); });
                window.__pendant = {}; window.__fait = false; window.__qui = q;
                if (!window.__finAction) {
                    window.__finAction = true;
                    var ea = BattleManager.endAction;
                    BattleManager.endAction = function () { if (this._subject && this._subject === window.__qui) window.__fait = true; return ea.apply(this, arguments); };
                }
                if (a.preparer) eval(a.preparer);
                q.forceAction(a.id, -1);
                BattleManager.forceAction(q);
            }, { id: skillId, preparer: preparer || '' });
            var fin = Date.now() + 600000;
            while (Date.now() < fin) {
                var etat = await page.evaluate(function () {
                    var o = { bloque: LAvatar.bloque(), fait: window.__fait, pv: $gameParty.members().map(function (m) { return m.hp; }) };
                    if (o.bloque && !window.__pendant.pvDebut) window.__pendant.pvDebut = o.pv;
                    if (o.bloque) window.__pendant.pvPendant = o.pv;
                    if (!o.bloque && window.__pendant.pvDebut && !window.__pendant.pvFin) window.__pendant.pvFin = o.pv;
                    return o;
                });
                if (etat.fait) break;
                if (etat.bloque) break;
                await page.waitForTimeout(250);
            }
            while (Date.now() < fin) {
                var p = await page.evaluate(function () {
                    var e = LAvatar._effets[0], cv = Graphics._canvas;
                    var o = {
                        bloque: LAvatar.bloque(), t: e ? e.t : 0,
                        moities: !!(e && e.moities), eclats: !!(e && e.eclats && e.eclats.liste.length),
                        erreur: Graphics._errorPrinter ? Graphics._errorPrinter.innerHTML : '', flou: cv ? cv.style.filter : '',
                        penche: cv ? cv.style.transform : '', musique: AudioManager._currentBgm ? AudioManager._currentBgm.name : '', joue: !!(AudioManager._bgmBuffer && AudioManager._bgmBuffer.isPlaying()),
                        arrete: SceneManager._stopped === true,
                        pvHeros: $gameParty.members().map(function (m) { return m.hp; })
                    };
                    window.__pendant = window.__pendant || {};
                    ['moities', 'eclats'].forEach(function (k) { if (o[k]) window.__pendant[k] = true; });
                    if (/TypeError/.test(o.erreur)) { window.__pendant.erreur = o.erreur; window.__pendant.flou = o.flou; window.__pendant.musiqueCoupee = !o.musique; window.__pendant.arrete = o.arrete; }
                    if (o.penche && o.penche !== 'none') window.__pendant.penche = o.penche;
                    if (o.bloque) window.__pendant.pvPendant = o.pvHeros;
                    o.fait = window.__fait;
                    return o;
                });
                if (p.fait) break;
                await page.waitForTimeout(250);
            }
            // son action finie : les dégâts sont tombés
            var pvApres = await page.evaluate(function () { return $gameParty.members().map(function (m) { return m.hp; }); });
            await page.waitForFunction(enSaisie, null, { timeout: 180000 });
            return await page.evaluate(function (pvApres) {
                var sp = SceneManager._scene._spriteset;
                return { pendant: window.__pendant || {}, pvAvant: window.__pendant.pvDebut || [], pvApres: pvApres,
                    fond: [sp._back1Sprite.bitmap._url, sp._back2Sprite.bitmap._url], penche: Graphics._canvas.style.transform,
                    erreur: Graphics._errorPrinter.innerHTML, flou: Graphics._canvas.style.filter, musique: AudioManager._currentBgm && AudioManager._currentBgm.name };
            }, pvApres);
        }

        // ═════ ④ Tranche-Concept
        console.log('\n④ Tranche-Concept');
        var ia = await page.evaluate(function () {
            var q = $gameTroop.members()[0], lud = $gameActors.actor(3);
            var choix = function () { q.makeActions(); return q._actions[0] && q._actions[0].item() ? q._actions[0].item().id : 0; };
            var sans = choix();
            lud.addState(198);
            var avec = choix();
            lud.removeState(198);
            return { sans: sans, avec: avec };
        });
        V('l\'IA : un domaine ouvert (Royaume Impérial 198) → Tranche-Concept', ia.avec === 1328, String(ia.avec));
        V('l\'IA : aucun domaine → pas Tranche-Concept', ia.sans !== 1328, String(ia.sans));

        // le Monde Gelé posé sur elle l'immobilise : elle le tranche quand même, à la fin de l'action de Korrah
        await page.waitForFunction(enSaisie, null, { timeout: 180000 });
        var gel = await page.evaluate(function () {
            var q = $gameTroop.members()[0];
            q.setHp(q.mhp); q.addState(13);
            window.__qui = q; window.__fait = false;
            if (!window.__finAction) {
                window.__finAction = true;
                var ea = BattleManager.endAction;
                BattleManager.endAction = function () { if (this._subject && this._subject === window.__qui) window.__fait = true; return ea.apply(this, arguments); };
            }
            var immobile = !q.canMove();
            $gameActors.actor(2).onAllActionsEnd();              // Korrah vient de poser son Monde Gelé
            return { immobile: immobile, file: (BattleManager._forceActionQueue || []).length };
        });
        var gelFin = Date.now() + 300000, gelTranche = false;
        while (Date.now() < gelFin) {
            await avancer();
            await page.waitForTimeout(400);
            gelTranche = await page.evaluate(function () { return window.__fait && !$gameTroop.members()[0].isStateAffected(13); });
            if (gelTranche) break;
        }
        V('le Monde Gelé sur elle l\'immobilise…', gel.immobile);
        V('… elle le tranche quand même, sans attendre son tour (<BriseDomaines>)', gelTranche, 'file des actions forcées : ' + gel.file);
        var r4 = await faireAgir(1328, '$gameActors.actor(3).addState(198); $gameTroop.members()[0].addState(13); window.__domaines = true;');
        var dom = await page.evaluate(function () { return { lud: $gameActors.actor(3).isStateAffected(198), elle: $gameTroop.members()[0].isStateAffected(13) }; });
        await page.screenshot({ path: path.join(CAPT, 'souveraine_tranche.png') });
        V('l\'écran coupé en deux moitiés', r4.pendant.moities === true);
        V('les domaines tranchés : le Royaume de ludwing, le Monde Gelé', !dom.lud && !dom.elle, JSON.stringify(dom));
        V('derrière : la Forêt Perdue (Meadow / Forest)', /Meadow/.test(r4.fond[0]) && /Forest/.test(r4.fond[1]), r4.fond.join(' / '));
        V('les dégâts tombent après l\'effet, pas pendant', r4.pendant.pvPendant && r4.pendant.pvPendant.join() === r4.pvAvant.join() && r4.pvApres.some(function (h, i) { return h < r4.pvAvant[i]; }), 'avant ' + r4.pvAvant.join(',') + ' → après ' + r4.pvApres.join(','));

        // ═════ ⑤ Briser l'Écran (le fond remis à celui de la carte d'abord)
        console.log('\n⑤ Briser l\'Écran');
        await page.evaluate(function () { delete $gameTroop._avatarFond; var sp = SceneManager._scene._spriteset; sp._back1Sprite.bitmap = sp.battleback1Bitmap(); sp._back2Sprite.bitmap = sp.battleback2Bitmap(); });
        var r5 = await faireAgir(1329);
        V('l\'écran vole en éclats', r5.pendant.eclats === true);
        V('derrière : la Forêt Perdue', /Meadow/.test(r5.fond[0]) && /Forest/.test(r5.fond[1]), r5.fond.join(' / '));

        // ═════ ⑥ Le Jeu Plante
        console.log('\n⑥ Le Jeu Plante');
        var r6 = await faireAgir(1330);
        V('l\'écran d\'erreur de RPG Maker : « TypeError », le jeu flou', /TypeError/.test(r6.pendant.erreur || '') && /blur/.test(r6.pendant.flou || ''), (r6.pendant.erreur || '').replace(/<[^>]+>/g, ' ').trim());
        V('… la musique coupée pendant, le jeu jamais arrêté', r6.pendant.musiqueCoupee === true && r6.pendant.arrete === false);
        V('… puis tout revient : plus d\'erreur, plus de flou, la musique', r6.erreur === '' && !/blur/.test(r6.flou) && r6.musique === 'xevel', '« ' + r6.erreur + ' » · ' + r6.flou + ' · ' + r6.musique);
        var r6b = await page.evaluate(function () {
            var q = $gameTroop.members()[0]; q.setHp(Math.floor(q.mhp * 0.45));
            var vus = {};
            for (var i = 0; i < 25; i++) { q.makeActions(); var a = q._actions[0]; if (a && a.item()) vus[a.item().id] = 1; }
            q.setHp(q.mhp);
            return { unique: LAvatar.unique(q, 1330), vus: Object.keys(vus).map(Number) };
        });
        V('une fois par combat : sous 50 %, elle ne le refait plus', !r6b.unique && r6b.vus.indexOf(1330) < 0, r6b.vus.join(', '));

        // ═════ ⑦ La Main sur le Jeu
        console.log('\n⑦ La Main sur le Jeu');
        var r7 = await faireAgir(1331);
        V('l\'image du jeu penche et tangue pendant l\'effet', /rotate/.test(r7.pendant.penche || ''), r7.pendant.penche);
        V('… puis se remet droite', r7.penche === '', '« ' + r7.penche + ' »');

        // ═════ ⑧ le chant
        console.log('\n⑧ Le chant');
        await page.evaluate(function () { var q = $gameTroop.members()[0]; q.setHp(Math.floor(q.mhp * 0.6)); });
        var chant = await page.waitForFunction(function () { var s = SceneManager._scene; return s && /Theatr/.test(s.constructor.name); }, null, { timeout: 240000 }).then(function () { return true; }).catch(function () { return false; });
        if (!chant) { for (var e8 = 0; e8 < 8 && !chant; e8++) { await avancer(); await page.waitForTimeout(800); chant = await page.evaluate(function () { return /Theatr/.test(SceneManager._scene.constructor.name); }); } }
        V('sous 70 %, elle chante (le Theatrhythm de MOG)', chant);
        if (chant) {
            await page.waitForFunction(function () { var s = SceneManager._scene; return s && /Theatr/.test(s.constructor.name) && SceneManager.isCurrentSceneStarted() && s._sprite_buttons; }, null, { timeout: 180000 });
            await page.waitForTimeout(1500);
            await page.screenshot({ path: path.join(CAPT, 'souveraine_chant.png') });
            var fondChant = await page.evaluate(function () { var s = SceneManager._scene; return s._back1Sprite && s._back1Sprite.bitmap ? s._back1Sprite.bitmap._url : ''; });
            V('… sur la Forêt Perdue', /Meadow/.test(fondChant), fondChant);
            // on chante : l'horloge du banc (comme le_chant) — la partition finit
            await page.evaluate(function () { var s = SceneManager._scene; window.__t = 0; s.tempsPartition = function () { return window.__t; }; $gameSystem._theatrhythm_phase = 1; window.__t = 5; });
            await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Battle' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 300000 });
            var r8 = await page.evaluate(function () { var sp = SceneManager._scene._spriteset; return { fond: sp.battleback1Name() + ' / ' + sp.battleback2Name(), id: $gameTroop.members()[0].enemyId(), immortel: $gameTroop.members()[0].isStateAffected(3) }; });
            V('… retour au combat : toujours l\'avatar, Immortelle, sur la Forêt Perdue', r8.id === 824 && r8.immortel && /Meadow/.test(r8.fond), r8.fond);
        }

        // ═════ ⑨ sa fin
        console.log('\n⑨ Sa fin');
        await page.waitForFunction(enSaisie, null, { timeout: 300000 });
        await page.evaluate(function () {
            window.__j = [];
            var c = $gameTroop.members()[1]; if (c && !c.isAppeared()) c.appear();
            var q = $gameTroop.members()[0]; q.setHp(1);
            window.__finVue = false;
            var cp = Sprite_Enemy.prototype.startBossCollapse;
            Sprite_Enemy.prototype.startBossCollapse = function () { window.__finVue = true; return cp.apply(this, arguments); };
        });
        fin = Date.now() + 600000; var r9 = null;
        while (Date.now() < fin) {
            await avancer();
            await page.waitForTimeout(300);
            r9 = await page.evaluate(function () {
                $gameParty.members().forEach(function (a) { if (a.hpRate() < 0.5) a.setHp(a.mhp); });
                return { scene: SceneManager._scene.constructor.name, phase: BattleManager._phase };
            });
            if (r9.scene !== 'Scene_Battle' || r9.phase === 'battleEnd') break;
        }
        var r9b = await page.evaluate(function () {
            var q = $gameTroop.members()[0], c = $gameTroop.members()[1];
            return { msgs: window.__j.filter(function (m) { return m.msg.trim(); }).map(function (m) { return m.msg; }), morte: q.isDead(), cendreux: c ? c.isDead() || !c.isAppeared() : true,
                boss: window.__finVue, victoire: $gameTroop.isAllDead() && !$gameParty.isAllDead(), fige: !!LAvatar._fige };
        });
        V('à 0 %, l\'avatar parle un peu (2 messages)', r9b.msgs.length >= 2 && /tomber pour de bon/.test(r9b.msgs[0]), r9b.msgs.length + ' messages');
        V('… puis tombe, effondrée comme un boss ; Cendreux avec elle', r9b.morte && r9b.boss && r9b.cendreux);
        V('… la victoire', r9b.victoire, r9.scene + ' · ' + r9.phase);

        console.log('\n⑩ Les erreurs');
        V('aucune erreur de page', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
    } catch (e) {
        ko++; console.log('   ✗ le banc s\'est arrêté : ' + e.message.split('\n')[0]);
        if (erreurs.length) console.log('     erreurs : ' + erreurs.slice(0, 3).join(' | '));
    } finally {
        console.log('\n' + ok + ' OK, ' + ko + ' KO');
        if (nav) await nav.close();
        serveur.close();
        process.exit(ko ? 1 : 0);
    }
})();
