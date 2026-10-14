/*
 * BANC NAVIGATEUR — LES INTERACTIONS
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-14 : « il y a des attaques qui peuvent interagir entre
 * eux […] en fonction de ce qu'il utilise, ça peut faire une interaction.
 * Genre la personne répond à un tel message, ou réagit d'une telle manière. »
 * Choix : A2, B1 + B2 + B3 + B4, C1 (le tableau, dans le gestionnaire de plugins).
 *
 * LesInteractions.js, joué dans le vrai moteur, chaque règle avec sa
 * contre-épreuve (§6) :
 *   · le tableau se lit tel que l'éditeur l'écrit ; la Vanne y est ;
 *   · B1 les répliques (%1, %2, une au hasard), B2 Colère / PT / état,
 *     B3 esquive et riposte (sur le lanceur, pas sur un ennemi), B4 l'action
 *     en retour et la copie (dans le presse-papier de ludwing) ;
 *   · la première ligne qui correspond, « n'importe qui », pas sur soi-même ;
 *   · DEUX VRAIS COMBATS : la riposte de Vesper, et la contre-attaque de son
 *     Flow, ne lui coûtent plus son tour — et avec le forceAction de MV,
 *     elle le perdait (la contre-épreuve montre que le banc voit le défaut).
 *
 *   npx http-server -p 8899 -c-1 -s .        (dans un autre terminal, à la racine)
 *   node bancs/navigateur/les_interactions.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var vert = 0, rouge = 0;
function ok(nom, cond, detail) {
    var d = detail !== undefined && detail !== '' ? '   ' + detail : '';
    if (cond) { vert++; console.log('   ✓ ' + nom + d); } else { rouge++; console.log('   ✗ ' + nom + d); }
}

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.split('\n')[0]); });
    page.on('console', function (m) { if (m.type() === 'error' && !/Failed to load|net::ERR/.test(m.text())) { erreurs.push('CONSOLE ' + m.text().slice(0, 160)); } });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen(); }, null, { timeout: 180000 });
    await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);

    async function ouvrirCombat() {
        await page.evaluate(function () {
            [1, 2, 3, 4].forEach(function (id) { if (!$gameParty.members().some(function (m) { return m.actorId() === id; })) { $gameParty.addActor(id); } });
            $gameParty.members().forEach(function (a) { a.recoverAll(); });
            BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(2500);
    }
    async function fermerCombat() {
        await page.evaluate(function () {
            if (window.__vraieMaj) { SceneManager._scene.update = window.__vraieMaj; window.__vraieMaj = null; }
            BattleManager.endBattle(2); $gameParty.onBattleEnd(); $gameTroop.onBattleEnd();
            SceneManager.goto(Scene_Map);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(800);
    }
    await ouvrirCombat();

    // Le moteur figé : on joue les coups à la main.
    await page.evaluate(function () {
        var SC = SceneManager._scene;
        window.__vraieMaj = SC.update;
        SC.update = function () { };
        Game_Action.prototype.itemHit = function () { return 1; };
        window.V = $gameActors.actor(1); window.K = $gameActors.actor(2); window.L = $gameActors.actor(3); window.A = $gameActors.actor(4);
        window.E = $gameTroop.members()[0];
        window.__lignes = [];
        var push = Window_BattleLog.prototype.push;
        Window_BattleLog.prototype.push = function (m, t) { if (m === 'addText') { window.__lignes.push(String(t).replace(/\\C\[\d+\]/g, '')); } return push.apply(this, arguments); };
        window.__jouer = function (sujet, skillId, cible) {
            var act = new Game_Action(sujet); act.setSkill(skillId);
            act.setTarget(cible.isActor() ? $gameParty.members().indexOf(cible) : cible.index());
            BattleManager._subject = sujet; BattleManager._action = act;
            cible.clearResult(); act.apply(cible);
            BattleManager._subject = null; BattleManager._action = null;
            return act;
        };
        window.__file = function () { var q = $gameTemp._forceActionQueue; return q ? q.list.map(function (c) { return c.parameters.join(':'); }) : []; };
        window.__vider = function () {
            $gameParty.members().forEach(function (m) {
                m.recoverAll(); m.setTp(0); m._interactionsEnAttente = []; m._viseAllies = []; m._garderSesActions = 0; m._actionsGardees = null;
                m._louCopiedSkills = []; m.clearResult();
            });
            V._colere = 0; PacteDeSang.changerStyle('garde'); PacteDeSang.poser(0);
            $gameTemp._forceActionQueue = undefined; window.__lignes = [];
        };
        window.__table = Interactions.table.slice();        // la vraie, pour la remettre
        window.__ligne = function (o) {                      // une ligne écrite comme l'éditeur l'écrit
            var r = { nom: 'banc', lanceur: '0', competence: '0', cible: '0', repliqueLanceur: '""', repliqueCible: '""', colere: '0', pt: '0',
                etat: '0', esquive: '0', riposte: '0', retour: '0', retourSur: 'lanceur', copie: 'false' };
            Object.keys(o).forEach(function (k) { r[k] = /^replique/.test(k) ? JSON.stringify(o[k]) : String(o[k]); });
            return Interactions.lire(JSON.stringify(r));
        };
        window.__poserTable = function (l) { Interactions.table.length = 0; l.forEach(function (x) { Interactions.table.push(x); }); };
        __vider();
    });

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n══ LE TABLEAU ' + '═'.repeat(60));
    var ta = await page.evaluate(function () {
        var t = Interactions.table, v = t[0] || {};
        return { n: t.length, v: { lanceur: v.lanceur, competence: v.competence, cible: v.cible, dit: v.dit, colere: v.colere, riposte: v.riposte } };
    });
    ok('le tableau du gestionnaire de plugins se lit', ta.n >= 1, ta.n + ' ligne(s)');
    ok('la Vanne y est : ludwing → Vanne à Vesper → Vesper', ta.v.lanceur === 3 && ta.v.competence === 1302 && ta.v.cible === 1);
    ok('…+50 de Colère, riposte à coup sûr (« il se prend un coup »)', ta.v.colere === 50 && ta.v.riposte === 1);

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n══ LA VANNE : B1 RÉPLIQUE · B2 COLÈRE · B3 RIPOSTE ' + '═'.repeat(23));
    var va = await page.evaluate(function () {
        var out = {};
        __vider();
        __jouer(L, 1302, V);
        out.colere = StylesVesper.colere();
        out.lignes = __lignes.slice();
        out.enAttente = (L._interactionsEnAttente || []).length;
        out.fileAvant = __file().length;                          // rien ne part pendant le coup
        L.onAllActionsEnd();                                      // ludwing a fini
        out.file = __file();
        out.garde = V._garderSesActions;
        out.vise = V._viseAllies && V._viseAllies[0] === L;
        // la riposte, forcée comme le fait MV — elle vise ludwing, pas un ennemi
        var prevue = new Game_Action(V); prevue.setAttack(); prevue.setTarget(0);
        V._actions = [prevue];
        V.forceAction(V.attackSkillId(), $gameParty.members().indexOf(L));
        out.actionsPendant = V._actions.length;
        out.gardees = V._actionsGardees && V._actionsGardees[0] === prevue;
        out.cibleRiposte = V.currentAction().makeTargets().map(function (x) { return x.name(); }).join(',');
        // contre-épreuve : son attaque ordinaire vise un ennemi
        var ordinaire = new Game_Action(V); ordinaire.setAttack(); ordinaire.setTarget(0);
        out.cibleOrdinaire = ordinaire.makeTargets().map(function (x) { return x.isEnemy() ? 'ennemi' : x.name(); }).join(',');
        V.clearActions(); V._actionsGardees = null; $gameTemp._forceActionQueue = undefined;
        // contre-épreuve : la même Vanne sur Korrah — aucune ligne ne correspond
        __vider();
        __jouer(L, 1302, K);
        out.korrah = { colere: StylesVesper.colere(), lignes: __lignes.length, attente: (L._interactionsEnAttente || []).length };
        return out;
    });
    ok('Vesper : +50 de Colère (Garde)', va.colere === 50, '+' + va.colere);
    ok('B1 : ludwing dit sa réplique, %2 devient le nom de la cible', va.lignes.some(function (l) { return /ludwing : « Vesper, t'as vu ta tête/.test(l); }),
        va.lignes.join(' / '));
    ok('B3 : la riposte attend que ludwing ait fini (rien pendant le coup)', va.enAttente === 1 && va.fileAvant === 0);
    ok('…puis part : Vesper, son attaque, sur ludwing', va.file.length === 1 && /^1:1:1:/.test(va.file[0]) && va.vise, va.file.join(' '));
    ok('la riposte touche ludwing, pas un ennemi', va.cibleRiposte === 'ludwing', va.cibleRiposte);
    ok('…alors que son attaque ordinaire vise un ennemi (contre-épreuve)', va.cibleOrdinaire === 'ennemi', va.cibleOrdinaire);
    ok('forcée, elle garde l\'action qu\'elle avait prévue', va.garde === 1 && va.gardees && va.actionsPendant === 1);
    ok('la Vanne sur Korrah : rien (aucune ligne ne correspond — contre-épreuve)', va.korrah.colere === 0 && va.korrah.lignes === 0 && va.korrah.attente === 0,
        JSON.stringify(va.korrah));

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n══ B2 · B3 ESQUIVE · B4 RETOUR ET COPIE ' + '═'.repeat(34));
    var b = await page.evaluate(function () {
        var out = {}, SOIN = 1226;                         // Pansement Rapide : un soin sur un allié, sans aléa
        // B2 : PT et état
        __vider();
        __poserTable([__ligne({ lanceur: 2, competence: SOIN, cible: 3, pt: 30, etat: 14, repliqueCible: 'Merci %1.' })]);
        L.setHp(Math.floor(L.mhp / 2)); var hp0 = L.hp;
        __jouer(K, SOIN, L);
        out.b2 = { soin: L.hp - hp0, tp: L.tp, etat: L.isStateAffected(14), lignes: __lignes.slice() };
        // B3 : esquive à coup sûr — le soin ne passe pas, l'état non plus, la réplique si
        __vider();
        __poserTable([__ligne({ lanceur: 2, competence: SOIN, cible: 3, etat: 14, esquive: 100, repliqueCible: 'Raté, %1 !' })]);
        L.setHp(Math.floor(L.mhp / 2)); var hp1 = L.hp;
        __jouer(K, SOIN, L);
        out.esquive = { soin: L.hp - hp1, evade: L.result().evaded, etat: L.isStateAffected(14), lignes: __lignes.slice() };
        // B4 : action en retour, sur le lanceur
        __vider();
        __poserTable([__ligne({ lanceur: 2, competence: SOIN, cible: 3, retour: SOIN, retourSur: 'lanceur' })]);
        __jouer(K, SOIN, L); K.onAllActionsEnd();
        out.retour = { file: __file(), vise: L._viseAllies && L._viseAllies[0] === K };
        // …sur sa cible normale
        __vider();
        __poserTable([__ligne({ lanceur: 2, competence: SOIN, cible: 3, retour: 1, retourSur: 'normale' })]);
        __jouer(K, SOIN, L); K.onAllActionsEnd();
        out.retourNormal = { file: __file(), vise: (L._viseAllies || []).length };
        // B4 : la copie — une technique de Korrah dans le presse-papier de ludwing
        __vider();
        __poserTable([__ligne({ lanceur: 3, competence: 1302, cible: 2, copie: 'true' })]);
        __jouer(L, 1302, K);
        var c = (L._louCopiedSkills || []).slice();
        out.copie = { n: c.length, deKorrah: c.every(function (id) { return K.skills().some(function (s) { return s.id === id; }); }),
                      offensive: c.every(function (id) { return $dataSkills[id].damage.type === 1 || $dataSkills[id].damage.type === 5; }),
                      lignes: __lignes.slice() };
        for (var i = 0; i < 6; i++) { __jouer(L, 1302, K); }
        out.copiePlafond = (L._louCopiedSkills || []).length;
        // contre-épreuve : sans « copie », rien dans le presse-papier
        __vider();
        __poserTable([__ligne({ lanceur: 3, competence: 1302, cible: 2 })]);
        __jouer(L, 1302, K);
        out.sansCopie = (L._louCopiedSkills || []).length;
        // la première ligne qui correspond ; « n'importe qui » ; pas sur soi-même
        __vider();
        __poserTable([__ligne({ lanceur: 3, competence: 1302, cible: 1, repliqueLanceur: 'précise' }),
                      __ligne({ competence: 1302, repliqueLanceur: 'générique' })]);
        __jouer(L, 1302, V); var l1 = __lignes.slice(); __lignes = [];
        __jouer(K, 1302, A); var l2 = __lignes.slice(); __lignes = [];
        __jouer(L, 1302, L); var l3 = __lignes.slice();
        out.ordre = { precise: l1.join('|'), generique: l2.join('|'), soi: l3.length };
        // une au hasard parmi plusieurs
        __vider();
        __poserTable([__ligne({ lanceur: 3, competence: 1302, cible: 1, repliqueLanceur: 'un\ndeux\ntrois' })]);
        var vues = {};
        for (var j = 0; j < 60; j++) { __lignes = []; __jouer(L, 1302, V); vues[__lignes[0]] = 1; L._interactionsEnAttente = []; }
        out.variantes = Object.keys(vues).length;
        __poserTable(window.__table);
        return out;
    });
    ok('B2 : le soin passe, PT +30, l\'état posé, la cible répond', b.b2.soin > 0 && b.b2.tp >= 30 && b.b2.etat && b.b2.lignes.some(function (l) { return /ludwing : « Merci Korrah\./.test(l); }),
        '+' + b.b2.soin + ' PV · ' + b.b2.tp + ' PT · ' + b.b2.lignes.join(' / '));
    ok('B3 : esquive — ni soin ni état, « esquivé » à l\'écran', b.esquive.soin === 0 && b.esquive.evade && !b.esquive.etat, '+' + b.esquive.soin + ' PV');
    ok('…et elle se moque quand même', b.esquive.lignes.some(function (l) { return /Raté, Korrah !/.test(l); }), b.esquive.lignes.join(' / '));
    ok('B4 : l\'action en retour part sur le lanceur', b.retour.file.length === 1 && /^1:3:1226:/.test(b.retour.file[0]) && b.retour.vise, b.retour.file.join(' '));
    ok('…ou sur sa cible normale', b.retourNormal.file.length === 1 && /^1:3:1:-1$/.test(b.retourNormal.file[0]) && b.retourNormal.vise === 0, b.retourNormal.file.join(' '));
    ok('B4 : ludwing copie une technique offensive de Korrah', b.copie.n === 1 && b.copie.deKorrah && b.copie.offensive, b.copie.lignes.join(' / '));
    ok('…le presse-papier garde ses 4 places', b.copiePlafond === 4, b.copiePlafond + ' copies');
    ok('sans « copie », rien (contre-épreuve)', b.sansCopie === 0);
    ok('la ligne précise passe avant la générique', b.ordre.precise === 'ludwing : « précise »', b.ordre.precise);
    ok('« n\'importe qui → n\'importe quel allié »', b.ordre.generique === 'Korrah : « générique »', b.ordre.generique);
    ok('…mais pas sur soi-même', b.ordre.soi === 0);
    ok('plusieurs répliques : une au hasard', b.variantes === 3, b.variantes + ' sur 3 vues');

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n══ DEUX VRAIS COMBATS : PERSONNE NE PERD SON TOUR ' + '═'.repeat(24));
    await fermerCombat();
    // Tout le monde se bat seul ; ludwing lance sa Vanne sur Vesper. ludwing joue
    // en premier, Vesper en dernier : la riposte tombe AVANT son tour à elle.
    async function tour(garder, flow) {
        await page.evaluate(function (o) {
            window.__o = o;
            if (!window.__autoPose) {
                window.__autoPose = true;
                Game_Actor.prototype.isAutoBattle = function () { return true; };
                var auto = Game_Actor.prototype.makeAutoBattleActions;
                Game_Actor.prototype.makeAutoBattleActions = function () {
                    if (this.actorId() === 3 && !window.__o.flow) {
                        for (var i = 0; i < this.numActions(); i++) { this.action(i).setSkill(1302); this.action(i).setTarget($gameParty.members().indexOf($gameActors.actor(1))); }
                        this.setActionState('waiting'); return;
                    }
                    if (this.actorId() === 1) {                     // Vesper : son attaque, sur l'ennemi
                        // (dans le Flow, l'état 87 de JOKO scelle l'Attaque, type 1 : elle frappe en Art Serein)
                        for (var j = 0; j < this.numActions(); j++) {
                            if (window.__o.flow) { this.action(j).setSkill(128); } else { this.action(j).setAttack(); }
                            this.action(j).setTarget(0);
                        }
                        this.setActionState('waiting'); return;
                    }
                    return auto.call(this);
                };
                window.__vrai = Game_Battler.prototype.forceAction;
            }
            Game_Battler.prototype.forceAction = o.garder ? window.__vrai : Interactions.forceActionMV;
        }, { garder: garder, flow: flow });
        await ouvrirCombat();
        await page.evaluate(function () {
            var o = window.__o;
            $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); e._paramPlus[6] = o.flow ? 9999 : 0; });
            $gameParty.members().forEach(function (a) { a.addParam(0, 9999999); a.addParam(1, 9999); a.recoverAll(); });
            var V = $gameActors.actor(1), L = $gameActors.actor(3);
            V._paramPlus[6] = -9999; L._paramPlus[6] = o.flow ? -5000 : 9999;
            PacteDeSang.changerStyle(o.flow ? 'lame' : 'garde');
            if (o.flow) {
                V.clearResult(); V.addState(87);                        // le Flow : deux actions par tour
                var eva = Game_Action.prototype.itemEva;                // elle esquive tout…
                Game_Action.prototype.itemEva = function (t) { return t === V ? 1 : 0; };
                window.__evaVraie = eva;
                // …et c'est elle qu'on vise, quoi que l'IA des ennemis choisisse (sinon le banc
                // dépend de leurs choix : un tour sans coup sur elle, c'est un tour sans contre)
                window.__cibleVraie = Game_Action.prototype.makeTargets;
                Game_Action.prototype.makeTargets = function () {
                    var s = this.subject();
                    if (s && s.isEnemy() && V.isAlive()) { return this.repeatTargets([V]); }
                    return window.__cibleVraie.call(this);
                };
            }
            // la Vanne fait +50 (deux si ludwing agit deux fois) : sans ça, la Rage enverrait ses
            // coups sur ludwing — le banc mesure le tour qu'elle garde, pas la Rage
            if (!window.__debutActionVrai) {
                window.__debutActionVrai = BattleManager.startAction;
                BattleManager.startAction = function () {
                    var V1 = $gameActors.actor(1);
                    if (this._subject === V1) { V1._colere = 0; if (V1.isStateAffected(1001)) { V1.clearResult(); V1.eraseState(1001); } }
                    return window.__debutActionVrai.apply(this, arguments);
                };
            }
            window.__coups = [];
            var vrai = Game_Action.prototype.apply;
            if (!window.__applyVrai) { window.__applyVrai = vrai; }
            Game_Action.prototype.apply = function (cible) {
                var s = this.subject();
                if (s && s.isActor() && s.actorId() === 1) { window.__coups.push({ t: $gameTroop.turnCount(), sur: cible.isEnemy() ? 'ennemi' : cible.name(), quoi: this.item() ? this.item().id : 0, forcee: !!this._forcing }); }
                return window.__applyVrai.call(this, cible);
            };
            window.__debut = $gameTroop.turnCount();
        });
        try {
            await page.waitForFunction(function () { return $gameTroop.turnCount() >= window.__debut + 3 || !$gameParty.inBattle(); }, null, { timeout: 300000, polling: 300 });
        } catch (e) { }
        var r = await page.evaluate(function () {
            Game_Action.prototype.apply = window.__applyVrai;
            if (window.__evaVraie) { Game_Action.prototype.itemEva = window.__evaVraie; window.__evaVraie = null; }
            if (window.__cibleVraie) { Game_Action.prototype.makeTargets = window.__cibleVraie; window.__cibleVraie = null; }
            // seuls les tours commencés APRÈS la mise en place comptent, et seulement ceux qui sont finis
            var d = window.__debut, fin = $gameTroop.turnCount();
            var c = window.__coups.filter(function (x) { return x.t > d && x.t < fin; });
            return { coups: c, tours: Math.max(0, fin - d - 1),
                     etat: 'tour ' + fin + ' (début ' + d + ') · en combat ' + $gameParty.inBattle() + ' · phase ' + BattleManager._phase
                         + ' · sujet ' + (BattleManager._subject ? BattleManager._subject.name() : '—') + ' · évènement ' + $gameTroop.isEventRunning(),
                     detail: window.__coups.map(function (x) { return 'T' + x.t + ':' + (x.forcee ? 'forcée ' : '') + x.quoi + '→' + x.sur; }).join(' ') };
        });
        await fermerCombat();
        return r;
    }
    var avec = await tour(true, false);
    var riposte = avec.coups.filter(function (c) { return c.sur === 'ludwing' && c.forcee; }).length;
    var siens = avec.coups.filter(function (c) { return c.sur === 'ennemi' && !c.forcee; }).length;
    ok('la Vanne : Vesper rend le coup à ludwing…', riposte >= 1, riposte + ' riposte(s) en ' + avec.tours + ' tours');
    ok('…ET joue son tour à elle (son attaque sur l\'ennemi)', siens >= avec.tours && avec.tours >= 1, siens + ' attaque(s) à elle'
        + (siens >= avec.tours && avec.tours >= 1 ? '' : ' · ' + avec.etat + ' · ' + avec.detail));
    var sans = await tour(false, false);
    var siensMV = sans.coups.filter(function (c) { return c.sur === 'ennemi' && !c.forcee; }).length;
    var ripMV = sans.coups.filter(function (c) { return c.sur === 'ludwing' && c.forcee; }).length;
    ok('contre-épreuve : avec le forceAction de MV, elle riposte mais perd son tour', ripMV >= 1 && siensMV < sans.tours,
        ripMV + ' riposte(s) · ' + siensMV + ' attaque(s) à elle en ' + sans.tours + ' tours');

    var fl = await tour(true, true);
    var contres = fl.coups.filter(function (c) { return c.quoi === 131 && c.forcee; }).length;
    var siensF = fl.coups.filter(function (c) { return c.sur === 'ennemi' && !c.forcee; }).length;
    ok('le Flow : elle esquive, contre-attaque…', contres >= 1, contres + ' contre(s) en ' + fl.tours + ' tours' + (contres >= 1 ? '' : ' · ' + fl.etat + ' · ' + fl.detail));
    ok('…ET joue ses deux actions à elle', siensF >= 2 * fl.tours && fl.tours >= 1, siensF + ' action(s) à elle');
    var flMV = await tour(false, true);
    var siensFMV = flMV.coups.filter(function (c) { return c.sur === 'ennemi' && !c.forcee; }).length;
    ok('contre-épreuve : avec le forceAction de MV, la contre du Flow lui mangeait ses actions', siensFMV < 2 * flMV.tours,
        siensFMV + ' action(s) à elle en ' + flMV.tours + ' tours');

    // ═════════════════════════════════════════════════════════════════════
    console.log('\n── LES ERREURS DU MOTEUR ' + '─'.repeat(48));
    ok('rien n\'a planté', erreurs.length === 0, erreurs.slice(0, 5).join(' | '));
    console.log('\n' + '═'.repeat(74) + '\n   ' + vert + ' vert · ' + rouge + ' rouge\n' + '═'.repeat(74));
    await nav.close();
    process.exit(rouge ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
