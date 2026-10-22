/*
 * LES ATTAQUES COMBINÉES (DoubleX Unison Item + module CTB, corrigés pour le jeu)
 * ---------------------------------------------------------------------------
 * JOKO, 2026-10-18 : « Passe à DoubleX Unison avec son module CTB : intègre-le,
 * teste-le, et propose-moi des attaques combinées entre mes héros avant de les
 * créer. » Aucune compétence de la base n'est une attaque combinée : celles d'ici
 * sont créées EN MÉMOIRE.
 *
 * Le jeu se bat en TOUR PAR TOUR (« Default System » : dtb) ; le CTB n'existe que si
 * JOKO change de système (setBattleSys CTB). Les deux sont testés, le tour par tour
 * d'abord.
 *   ① une action normale ne change pas : le héros s'avance et frappe (l'original
 *     coupait ces mouvements pour TOUTES les actions) ; une compétence créée pendant
 *     la partie marche (l'original plantait) ; le combat automatique ne choisit
 *     jamais une attaque combinée
 *   ② les règles en tour par tour : le lanceur est AVANT son partenaire dans
 *     l'équipe ; partenaire tombé : non ; héros hors liste : non ; chacun paie son
 *     coût ; <unison item atk actors> mélange l'ATQ et rien d'autre ; « Vesper et
 *     Korrah » dans le journal
 *   ③ un vrai combat en tour par tour, saisi par les vraies fenêtres de commande et
 *     joué en accéléré : quand Vesper lance l'attaque combinée, Korrah ne reçoit PAS
 *     de commande et ne joue pas en plus (l'original la laissait jouer : Seiryu
 *     masquait sa réservation) ; les deux s'avancent ; au tour suivant, Korrah
 *     reprend la main (contre-épreuve) ; une sauvegarde d'avant ne bloque pas
 *   ④ en CTB : le partenaire doit jouer JUSTE après ; vrai combat, puis la version
 *     qui se prépare à deux (<async unison item>)
 *
 *   node bancs/navigateur/les_attaques_combinees.js
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
    // une section qui plante compte comme un échec, et le banc continue (contre-épreuve)
    async function sur(titre, corps) {
        try { return await corps(); } catch (e) {
            V(titre + ' : la section plante', false, String(e.message).split('\n')[0].slice(0, 160));
            try { await retour(); } catch (e2) { await page.reload(); }
            return null;
        }
    }
    // Attendre en images de jeu, pas en secondes : la logique avance à la main, et le banc
    // tient même quand le PC est occupé (le Chromium des bancs tombe alors à 1 ou 2 im/s).
    async function attendre(condJs) {
        for (var lot = 0; lot < 300; lot++) {
            var ok = await ev(function (condJs) {
                var c = new Function('return (' + condJs + ')();');
                for (var i = 0; i < 60; i++) {
                    if (c()) return true;
                    SceneManager.updateInputData(); SceneManager.changeScene(); SceneManager.updateScene();
                }
                return c();
            }, condJs);
            if (ok) return;
            await page.waitForTimeout(50);
        }
        throw new Error('jamais atteint : ' + condJs.slice(0, 120));
    }
    async function surLaCarte() {
        await attendre('function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }');
    }
    async function combat(troupe, systeme) {
        await ev(function (a) { $gameSystem.setBattleSystem(a.systeme || 'dtb'); BattleManager.setup(a.troupe, true, true); $gamePlayer.makeEncounterCount(); SceneManager.push(Scene_Battle); }, { troupe: troupe, systeme: systeme });
        await attendre('function () { return SceneManager._scene instanceof Scene_Battle && BattleManager._phase && BattleManager._phase !== "init" && !SceneManager.isSceneChanging(); }');
    }
    async function retour() {
        await ev(function () { $gameTroop._interpreter.clear(); $gameMessage.clear(); BattleManager.processAbort(); });
        await surLaCarte();
        await ev(function () { $gameSystem.setBattleSystem('dtb'); });
    }
    // Le combat se joue en accéléré : la logique du moteur, image par image, sans dessiner
    // (le Chromium des bancs dessine à quelques images par seconde). Les commandes passent
    // par les VRAIES fenêtres (Attaque, la compétence, la cible), comme un joueur.
    async function jouer(finJs, lots) {
        for (var lot = 0; lot < (lots || 80); lot++) {
            var fini = await ev(function (finJs) {
                var fin = new Function('return (' + finJs + ')();');
                for (var i = 0; i < 300 && !fin(); i++) { T.saisir(); SceneManager.updateInputData(); SceneManager.changeScene(); SceneManager.updateScene(); }
                return fin();
            }, finJs);
            if (fini) return true;
            await page.waitForTimeout(30);
        }
        return false;
    }

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 600000 });
    await ev(function () {
        DataManager.setupNewGame(); $gameSystem._meteo = { force: 'clair' }; $gamePlayer.reserveTransfer(29, 10, 10, 2, 0); SceneManager.goto(Scene_Map);
        window.T = {
            // brut : la compétence telle que MV la crée. Sinon, si le plugin n'a pas lu ses
            // listes (l'original : plantage), on les lui fait lire — pour que la contre-épreuve
            // sur l'original voie ses AUTRES défauts au lieu de s'arrêter au premier.
            skill: function (note, extra, brut) {
                var s = JSON.parse(JSON.stringify($dataSkills[1]));
                s.id = $dataSkills.length; s.name = 'Essai ' + s.id; s.note = note || ''; s.mpCost = 0; s.tpCost = 0; s.hitType = 0; s.successRate = 100; s.speed = 0;
                s.scope = 1; s.damage = { type: 1, elementId: 0, formula: '1', variance: 0, critical: false }; s.effects = []; s.stypeId = 1; s.animationId = 0;
                s.requiredWtypeId1 = 0; s.requiredWtypeId2 = 0; s.message1 = ' lance ' + s.name + ' !'; s.message2 = '';
                if (extra) Object.keys(extra).forEach(function (k) { s[k] = extra[k]; });
                DataManager.extractMetadata(s);
                if (!brut && !Array.isArray(s.meta.unisonItemActors)) DoubleX_RMMV.Unison_Item.DataManager.loadItemNotes(s);
                $dataSkills.push(s); return s.id;
            },
            // ce que chaque héros choisit : une compétence (id) ou 0 pour Attaque
            choix: function () { return 0; },
            saisis: [],
            saisir: function () {
                var sc = SceneManager._scene;
                if (!(sc instanceof Scene_Battle) || BattleManager._phase !== 'input' || !BattleManager.actor() || !sc._actorCommandWindow.active) return;
                var a = BattleManager.actor(), act = a.inputtingAction(), id = T.choix(a);
                T.saisis.push('T' + $gameTroop.turnCount() + ':' + a.name());
                sc._actorCommandWindow.deactivate();
                if (id) { act.setSkill(id); sc.onSelectAction(); } else { sc.commandAttack(); }
                if (sc._enemyWindow.active) { sc._enemyWindow.deactivate(); sc.onEnemyOk(); }
                if (sc._actorWindow.active) { sc._actorWindow.deactivate(); sc.onActorOk(); }
            }
        };
    });
    await surLaCarte();
    console.log('LES ATTAQUES COMBINÉES');

    var base = await ev(function () {
        return {
            plugins: ['DoubleX RMMV Unison Item Config v103a', 'DoubleX RMMV Unison Item Default v100g', 'DoubleX RMMV Unison Item YEP_X_BattleSysCTB v100c']
                .map(function (n) { return $plugins.some(function (p) { return p.name === n && p.status; }); }),
            dansLaBase: $dataSkills.concat($dataItems).filter(function (d) { return d && d.meta && d.meta.unisonItemActors && d.meta.unisonItemActors.length > 1; }).map(function (d) { return d.id; }),
            systeme: $gameSystem.getBattleSystem(),
            equipe: $gameParty.members().map(function (m) { return m.name(); }).join(', ')
        };
    });
    V('les trois plugins sont chargés (Config, Default, module CTB)', base.plugins.every(Boolean), JSON.stringify(base.plugins));
    // JOKO, 2026-10-18 : « Oui, crée les 6 duos avec les réglages par défaut » — 1303 à 1308, rien d'autre
    V('la base a les six duos de JOKO (1303 à 1308), et aucune autre attaque combinée', base.dansLaBase.join(',') === '1303,1304,1305,1306,1307,1308', base.dansLaBase.join(', '));
    V('le jeu se bat en tour par tour', base.systeme === 'dtb', base.systeme + ' · équipe ' + base.equipe);

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ① une action normale ne change pas ──');
    var un = await sur('①', async function () { await combat(1); var r = await ev(function () {
        var r = {}, V1 = $gameActors.actor(1), E = $gameTroop.members()[0];
        // un coup normal, joué par le journal de combat comme le moteur le fait
        var vus = [], pa = Game_Actor.prototype.performActionStart;
        Game_Actor.prototype.performActionStart = function () { vus.push(this.name()); return pa.apply(this, arguments); };
        var a = new Game_Action(V1); a.setAttack();
        SceneManager._scene._logWindow.performActionStart(V1, a);
        SceneManager._scene._logWindow.performAction(V1, a);
        Game_Actor.prototype.performActionStart = pa;
        r.mouvement = vus.join(',');
        // une compétence créée pendant la partie
        var id = T.skill('', null, true);
        r.listes = Array.isArray($dataSkills[id].meta.unisonItemActors);
        try { r.utilisable = V1.canUse($dataSkills[id]); var b = new Game_Action(V1); b.setSkill(id); b.apply(E); V1.useItem($dataSkills[id]); r.joue = true; } catch (e) { r.joue = 'plante : ' + e.message; }
        // le combat automatique ne choisit jamais une attaque combinée
        var u = T.skill('<unison item actors: 1, 2>');
        V1.learnSkill(u);
        try { var liste = V1.makeActionList().map(function (x) { return x.item() && x.item().id; }); r.autoPrend = liste.indexOf(u) >= 0; r.autoListe = liste.length; } catch (e) { r.autoPrend = 'plante : ' + e.message; }
        V1.forgetSkill(u);
        return r;
    }); await retour(); return r; });
    if (un) {
    V('un coup normal : le héros s\'avance et frappe (l\'original coupait ce mouvement pour toutes les actions)', un.mouvement === 'Vesper', un.mouvement || 'aucun mouvement');
    V('une compétence créée pendant la partie a ses listes et se joue', un.listes && un.utilisable === true && un.joue === true, JSON.stringify([un.listes, un.utilisable, un.joue]));
    V('le combat automatique ne choisit jamais une attaque combinée', un.autoPrend === false && un.autoListe > 0, un.autoListe + ' actions possibles, combinée prise : ' + un.autoPrend);
    }

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ② les règles (tour par tour) ──');
    var regles = await sur('②', async function () {
    await combat(1);
    // comme dans le jeu : les règles se lisent quand le joueur saisit (les héros ont alors leurs actions)
    await ev(function () { for (var i = 0; i < 3000 && BattleManager._phase !== 'input'; i++) { SceneManager.updateInputData(); SceneManager.changeScene(); SceneManager.updateScene(); } });
    var r = await ev(function () {
        var r = {}, V1 = $gameActors.actor(1), K = $gameActors.actor(2), L = $gameActors.actor(3), A = $gameActors.actor(4);
        var S = T.skill('<unison item actors: 1, 2>\n<unison item actor mp cost: 10, 20>\n<unison item atk actors: 1, 2>'), s = $dataSkills[S];
        $gameParty.members().forEach(function (m) { m.recoverAll(); });
        r.ordre = V1.index() + ' < ' + K.index() + ' · phase ' + BattleManager._phase;
        r.vesper = V1.canUse(s);
        r.korrah = K.canUse(s);            // Korrah est APRÈS Vesper dans l'équipe : non
        r.horsListe = L.canUse(s);
        K.addState(1); r.partenaireTombe = V1.canUse(s); K.removeState(1); K.recoverAll();
        // deux actions dont une réservée par une attaque combinée : elle n'en saisit qu'une ;
        // sans réservation, elle passe à la seconde (_ctBase : CombatTactique garde ses deux cases)
        K._actions = [new Game_Action(K), new Game_Action(K)]; K._ctBase = 2;
        K._actionInputIndex = 0; K._unisonItemNumInputs = 1;
        r.reservee = { saisit: K.canInput(), suivante: K.selectNextCommand(), index: K._actionInputIndex };
        K._actionInputIndex = 0; K._unisonItemNumInputs = 0;
        r.libre = { suivante: K.selectNextCommand(), index: K._actionInputIndex };
        K.clearActions(); K.makeActions();
        var mpV = V1.mp, mpK = K.mp; V1.useItem(s); r.coutV = mpV - V1.mp; r.coutK = mpK - K.mp;
        // les statistiques pendant le coup
        var atkV = V1.atk, atkK = K.atk, defV = V1.def, matV = V1.mat;
        V1._unisonItem = s; r.atk = V1.atk; r.def = V1.def; r.mat = V1.mat; V1._unisonItem = null;
        r.atkApres = V1.atk;
        r.moyenne = Math.round((atkV + atkK) / 2); r.defV = defV; r.matV = matV; r.atkV = atkV; r.atkK = atkK;
        // une seule statistique d'un autre héros : la MAG d'Aël quand Vesper lance
        var M = T.skill('<unison item actors: 1, 4>\n<unison item mat actors: 4>'), m = $dataSkills[M];
        V1._unisonItem = m; r.matAel = V1.mat; r.atkSansMelange = V1.atk; V1._unisonItem = null;
        r.matAelVrai = A.mat;
        // la règle par statistique
        var X = T.skill('<unison item actors: 1, 2>\n<unison item atk actors: 1, 2>\n<unison item atk rule: max>'), x = $dataSkills[X];
        V1._unisonItem = x; r.atkMax = V1.atk; V1._unisonItem = null;
        // le sens d'origine : <unison item param actors> mélange les huit
        var P = T.skill('<unison item actors: 1, 2>\n<unison item param actors: 1, 2>'), p = $dataSkills[P];
        V1._unisonItem = p; r.defParam = V1.def; V1._unisonItem = null; r.defK = K.def;
        // un vrai calcul de dégâts : l'ATQ mélangée est lue, puis tout redevient normal
        var D = T.skill('<unison item actors: 1, 2>\n<unison item atk actors: 1, 2>', { damage: { type: 1, elementId: 0, formula: 'a.atk', variance: 0, critical: false } });
        var act = new Game_Action(V1); act.setSkill(D);
        r.degats = act.makeDamageValue($gameTroop.members()[0], false);
        r.apresDegats = V1.atk;
        r.noms = DoubleX_RMMV.Unison_Item.Window_BattleLog.unisonActorNames([1, 2]);
        return r;
    });
    await retour(); return r; });
    if (regles) {
    V('Vesper (avant Korrah dans l\'équipe) peut la lancer', regles.vesper === true, 'rangs ' + regles.ordre);
    V('…Korrah, après Vesper dans l\'équipe, ne peut pas (règle de DoubleX en tour par tour)', regles.korrah === false);
    V('un héros qui n\'est pas dans la liste (ludwing) : non', regles.horsListe === false);
    V('le partenaire est tombé : non', regles.partenaireTombe === false);
    V('deux actions dont une réservée : elle saisit la première, pas la seconde', regles.reservee.saisit === true && regles.reservee.suivante === false && regles.reservee.index === 0, JSON.stringify(regles.reservee));
    V('…sans réservation, elle passe à la seconde (contre-épreuve)', regles.libre.suivante === true && regles.libre.index === 1, JSON.stringify(regles.libre));
    V('chacun paie son coût : Vesper 10 PM, Korrah 20 PM', regles.coutV === 10 && regles.coutK === 20, regles.coutV + ' / ' + regles.coutK);
    V('<unison item atk actors: 1, 2> : l\'ATQ est la moyenne des deux (entière), la DÉF et la MAG restent celles de Vesper',
        regles.atk === regles.moyenne && regles.def === regles.defV && regles.mat === regles.matV,
        'ATQ ' + regles.atkV + ' et ' + regles.atkK + ' → ' + regles.atk + ' · DÉF ' + regles.def + ' · MAG ' + regles.mat);
    V('<unison item mat actors: 4> : Vesper lance avec la MAG d\'Aël, son ATQ ne bouge pas', regles.matAel === regles.matAelVrai && regles.atkSansMelange === regles.atkV,
        'MAG ' + regles.matAel + ' (Aël ' + regles.matAelVrai + ') · ATQ ' + regles.atkSansMelange);
    V('<unison item atk rule: max> : la plus haute des deux', regles.atkMax === Math.max(regles.atkV, regles.atkK), String(regles.atkMax));
    V('<unison item param actors> garde son sens d\'origine (les huit mélangées)', regles.defParam === (regles.defV + regles.defK) / 2, 'DÉF ' + regles.defV + ' et ' + regles.defK + ' → ' + regles.defParam);
    V('un vrai calcul de dégâts (formule a.atk) lit l\'ATQ mélangée, puis l\'ATQ redevient celle de Vesper', regles.degats === regles.moyenne && regles.apresDegats === regles.atkV && regles.atkApres === regles.atkV,
        'dégâts ' + regles.degats + ' · ATQ après ' + regles.apresDegats);
    V('le journal dit « Vesper et Korrah »', regles.noms === 'Vesper et Korrah', regles.noms);
    }

    // ─────────────────────────────────────────────────────────────────────
    // les crochets d'observation, posés une fois
    await ev(function () {
        window.__u = { S: 0, lancees: [], mouvements: {}, actionsK: [], finsDeTour: [], enCours: false };
        var debut = BattleManager.startAction;
        BattleManager.startAction = function () {
            var u = window.__u, a = this._subject && this._subject.currentAction(), t = $gameTroop.turnCount();
            if (a && a.item() && a.item().id === u.S && DataManager.isSkill(a.item())) { u.lancees.push('T' + t + ' ' + this._subject.name()); u.enCours = true; }
            else if (this._subject === $gameActors.actor(2)) u.actionsK.push('T' + t + ' ' + (a && a.item() ? a.item().name : '?'));
            return debut.apply(this, arguments);
        };
        var pas = Game_Actor.prototype.performActionStart;
        Game_Actor.prototype.performActionStart = function () {
            var u = window.__u;
            if (u.enCours) u.mouvements[this.name()] = (u.mouvements[this.name()] || 0) + 1;
            return pas.apply(this, arguments);
        };
        var fin = BattleManager.endAction;
        BattleManager.endAction = function () { var r = fin.apply(this, arguments); window.__u.enCours = false; return r; };
        var finCTB = Game_Battler.prototype.endTurnAllCTB;
        Game_Battler.prototype.endTurnAllCTB = function () {
            if (window.__u.enCours && this.isActor()) window.__u.finsDeTour.push(this.name());
            return finCTB.apply(this, arguments);
        };
    });
    async function preparer(note, extra) {
        await ev(function (a) {
            var S = T.skill(a.note, a.extra);
            $gameActors.actor(1).learnSkill(S); $gameActors.actor(2).learnSkill(S);
            window.__u = { S: S, lancees: [], mouvements: {}, actionsK: [], finsDeTour: [], enCours: false };
            T.saisis = [];
        }, { note: note, extra: extra || null });
    }
    async function costauds() {
        await ev(function () {
            $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); });
            $gameParty.members().forEach(function (a) { a.addParam(0, 9999999); a.addParam(1, 9999); a.recoverAll(); });
            window.__u.debut = $gameTroop.turnCount();
        });
    }

    console.log('\n── ③ un vrai combat en tour par tour ──');
    var dtb = await sur('③', async function () {
    await preparer('<unison item actors: 1, 2>\n<unison item actor mp cost: 1, 1>');
    await combat(1);
    await costauds();
    // Vesper lance l'attaque combinée aux saisies paires (0, 2), attaque aux autres ; les
    // autres attaquent. Une sauvegarde d'avant : pas de compteur d'unison sur les héros.
    await ev(function () {
        $gameParty.members().forEach(function (m) { delete m._unisonItemNumInputs; });
        T.choix = function (a) { var t = $gameTroop.turnCount(); return (a.actorId() === 1 && t % 2 === 0 && a.canUse($dataSkills[window.__u.S])) ? window.__u.S : 0; };
    });
    await jouer('function () { return $gameTroop.turnCount() >= window.__u.debut + 4 || !$gameParty.inBattle(); }');
    var r = await ev(function () {
        var u = window.__u;
        return { lancees: u.lancees, mouvements: u.mouvements, actionsK: u.actionsK, saisis: T.saisis, tours: $gameTroop.turnCount() - u.debut, enCombat: $gameParty.inBattle(), phase: BattleManager._phase };
    });
    await ev(function () { T.choix = function () { return 0; }; });
    await retour(); return r; });
    if (dtb) {
    // turnCount vaut 0 pendant la première saisie : ce qui est saisi en « T0 » se joue au tour 1
    function saisisAu(n) { return dtb.saisis.filter(function (s) { return s.indexOf('T' + n + ':') === 0; }).map(function (s) { return s.split(':')[1]; }); }
    function auTour(liste, n) { return liste.filter(function (s) { return s.indexOf('T' + n + ' ') === 0; }); }
    var s0 = saisisAu(0), s1 = saisisAu(1), l1 = auTour(dtb.lancees, 1), k1 = auTour(dtb.actionsK, 1), k2 = auTour(dtb.actionsK, 2);
    V('le combat avance (quatre tours joués, aucun blocage)', dtb.tours >= 4, dtb.tours + ' tours · phase ' + dtb.phase + ' · ' + dtb.saisis.join(' '));
    V('une sauvegarde d\'avant (sans compteur d\'unison) laisse saisir', s0.length >= 3 && s0.indexOf('Vesper') >= 0, s0.join(', '));
    V('Vesper lance l\'attaque combinée — une seule fois dans le tour', l1.length === 1 && /Vesper/.test(l1[0]), dtb.lancees.join(' · ') || 'jamais');
    V('…Korrah ne reçoit PAS de commande ce tour-là (son action est prise par l\'attaque)', s0.indexOf('Korrah') < 0, 'commandes : ' + s0.join(', '));
    V('…et Korrah ne joue pas en plus', k1.length === 0, k1.join(' · ') || 'aucune action à elle');
    V('…les DEUX s\'avancent pour la lancer', (dtb.mouvements.Vesper || 0) >= 1 && (dtb.mouvements.Korrah || 0) >= 1, JSON.stringify(dtb.mouvements));
    V('au tour suivant (Vesper attaque), Korrah reprend la main et joue (contre-épreuve)', s1.indexOf('Korrah') >= 0 && k2.length >= 1, 'commandes ' + s1.join(', ') + ' · Korrah ' + k2.join(' · '));
    V('l\'attaque repart deux tours plus tard', dtb.lancees.length >= 2, dtb.lancees.join(' · '));
    }

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ④ en CTB (si JOKO change de système) ──');
    var ctb = await sur('④', async function () { await combat(1, 'ctb'); var r = await ev(function () {
        var r = {}, V1 = $gameActors.actor(1), K = $gameActors.actor(2), E = $gameTroop.members()[0];
        var s = $dataSkills[T.skill('<unison item actors: 1, 2>')];
        r.isCTB = BattleManager.isCTB();
        var vrai = BattleManager.ctbTurnOrder;
        function ordre(liste) { BattleManager.ctbTurnOrder = function () { return liste; }; }
        ordre([V1, K, E]); r.justeApres = V1.canUse(s);
        ordre([K, V1, E]); r.korrahAussi = K.canUse(s);
        ordre([V1, E, K]); r.pasJusteApres = V1.canUse(s);
        BattleManager.ctbTurnOrder = vrai;
        return r;
    }); await retour(); return r; });
    if (ctb) {
    V('le combat est bien en CTB', ctb.isCTB === true);
    V('le partenaire joue JUSTE après : utilisable — par l\'un comme par l\'autre', ctb.justeApres === true && ctb.korrahAussi === true, JSON.stringify([ctb.justeApres, ctb.korrahAussi]));
    V('…un ennemi entre les deux : non (contre-épreuve)', ctb.pasJusteApres === false);
    }

    async function vraiCombatCTB(async) {
        await preparer('<unison item actors: 1, 2>\n<unison item actor mp cost: 1, 1>' + (async ? '\n<async unison item>' : ''), async ? { speed: -200 } : null);
        await combat(1, 'ctb');
        await costauds();
        await ev(function () {
            // Vesper et Korrah rapides, les autres lents : ils jouent souvent l'un après l'autre
            $gameActors.actor(1)._paramPlus[6] = 5000; $gameActors.actor(2)._paramPlus[6] = 5000;
            [3, 4, 6].forEach(function (id) { var a = $gameActors.actor(id); if (a) a._paramPlus[6] = -9999; });
            $gameTroop.members().forEach(function (e) { e._paramPlus[6] = -9999; });
            T.choix = function (a) { return ((a.actorId() === 1 || a.actorId() === 2) && a.canUse($dataSkills[window.__u.S])) ? window.__u.S : 0; };
        });
        await jouer('function () { return window.__u.lancees.length >= 2 || $gameTroop.turnCount() >= window.__u.debut + 12 || !$gameParty.inBattle(); }');
        var r = await ev(function () { var u = window.__u; return { lancees: u.lancees, mouvements: u.mouvements, finsDeTour: u.finsDeTour.join(','), tours: $gameTroop.turnCount() - u.debut, saisis: T.saisis.slice(0, 12).join(' '), phase: BattleManager._phase }; });
        await ev(function () { T.choix = function () { return 0; }; [1, 2, 3, 4, 6].forEach(function (id) { var a = $gameActors.actor(id); if (a) a._paramPlus[6] = 0; }); });
        await retour();
        return r;
    }
    var sync = await sur('④ vrai combat', function () { return vraiCombatCTB(false); });
    if (sync) {
    V('vrai combat CTB : l\'attaque combinée part, et le combat continue', sync.lancees.length >= 1, sync.lancees.join(' · ') + ' · ' + sync.tours + ' tours · phase ' + sync.phase + ' · ' + sync.saisis);
    V('…les DEUX s\'avancent et finissent leur tour avec elle', (sync.mouvements.Vesper || 0) >= 1 && (sync.mouvements.Korrah || 0) >= 1 && /Vesper/.test(sync.finsDeTour) && /Korrah/.test(sync.finsDeTour),
        JSON.stringify(sync.mouvements) + ' · ' + sync.finsDeTour);
    }
    var as = await sur('④ version à deux', function () { return vraiCombatCTB(true); });
    if (as) {
    V('CTB, version qui se prépare à deux (<async unison item>) : elle part', as.lancees.length >= 1, as.lancees.join(' · ') + ' · ' + as.tours + ' tours · phase ' + as.phase + ' · ' + as.saisis);
    V('…les deux s\'avancent et finissent leur tour', (as.mouvements.Vesper || 0) >= 1 && (as.mouvements.Korrah || 0) >= 1 && /Vesper/.test(as.finsDeTour) && /Korrah/.test(as.finsDeTour),
        JSON.stringify(as.mouvements) + ' · ' + as.finsDeTour);
    }

    // ─────────────────────────────────────────────────────────────────────
    // JOKO, 2026-10-18 : « Oui, crée les 6 duos avec les réglages par défaut : menu Combo,
    // niveau 20, ×1,15, le premier des deux dans l'équipe lance. »
    console.log('\n── ⑤ les six duos de la base ──');
    var DUOS = [1303, 1304, 1305, 1306, 1307, 1308];
    var six = await sur('⑤', async function () {
        await combat(1);
        await attendre('function () { return BattleManager._phase === "input"; }');
        var r = await ev(function (DUOS) {
            var r = {}, M = function (id) { return $gameActors.actor(id); }, E = $gameTroop.members()[0];
            var heros = [1, 2, 3, 4].map(M);
            heros.forEach(function (h) { h.recoverAll(); h.setTp(100); });
            r.fiches = DUOS.map(function (id) {
                var s = $dataSkills[id], ids = s.meta.unisonItemActors;
                var a = new Game_Action(M(ids[0])); a.setSkill(id);
                return { id: id, type: s.stypeId, acteurs: ids.slice().sort().join('+'), apprendre: (s.meta.unisonItemActorLearn || []).join(','), elements: a.getItemElements().filter(function (x) { return x < 2 || x > 7; }).length };   // sans le mana de l'art (LesTroisArts, 2026-10-22)
            });
            r.typeNom = $dataSystem.skillTypes[25];
            r.connues = heros.map(function (h) {
                var les3 = DUOS.filter(function (id) { return $dataSkills[id].meta.unisonItemActors.indexOf(h.actorId()) >= 0; });
                return h.name() + ':' + les3.filter(function (id) { return h.isLearnedSkill(id); }).length + '/' + les3.length + (h.addedSkillTypes().indexOf(25) >= 0 ? ' menu' : ' SANS MENU');
            });
            var S6 = M(6); r.seiryu = S6 ? (S6.addedSkillTypes().indexOf(25) >= 0 || DUOS.some(function (id) { return S6.isLearnedSkill(id); })) : false;
            // qui lance quoi, dans l'ordre de l'équipe
            function lanceurs() { return DUOS.map(function (id) { return $dataSkills[id].name + ' : ' + $gameParty.members().filter(function (m) { return m.canUse($dataSkills[id]); }).map(function (m) { return m.name(); }).join('/'); }); }
            r.ordre = $gameParty.members().map(function (m) { return m.name(); }).join(', ');
            r.lanceurs = lanceurs();
            // contre-épreuve : Korrah passe devant Vesper — c'est elle qui lance Lame de Givre
            var iV = M(1).index(), iK = M(2).index();
            $gameParty.swapOrder(iV, iK);
            r.korrahDevant = $gameParty.members().filter(function (m) { return m.canUse($dataSkills[1303]); }).map(function (m) { return m.name(); }).join('/');
            $gameParty.swapOrder(iV, iK);
            // les deux doivent la connaître : Korrah l'oublie, Vesper ne peut plus la lancer
            M(2).forgetSkill(1303); r.oubli = M(1).canUse($dataSkills[1303]); M(2).learnSkill(1303); r.reapprise = M(1).canUse($dataSkills[1303]);
            // chacun paie son coût (La Lame et son Ombre : Vesper 30 PT, ludwing 42 PM)
            heros.forEach(function (h) { h.recoverAll(); h.setTp(100); });
            var tp = M(1).tp, mp = M(3).mp; M(1).useItem($dataSkills[1304]); r.couts = [tp - M(1).tp, mp - M(3).mp];
            // ce que chacun apporte : l'ATQ de Vesper et la MAG de Korrah ; la MAG moyenne de Korrah et ludwing
            M(1)._unisonItem = $dataSkills[1303]; r.lame = [M(1).atk, M(1).mat]; M(1)._unisonItem = null;
            r.lameAttendu = [M(1).atk, M(2).mat];
            M(3)._unisonItem = $dataSkills[1306]; r.nuit = M(3).mat; M(3)._unisonItem = null;
            r.nuitAttendu = Math.round((M(2).mat + M(3).mat) / 2);
            // les dégâts, contre l'ennemi de la troupe 1
            E.addParam(0, 9999999); E.recoverAll();
            r.degats = DUOS.map(function (id) { var a = new Game_Action(M($dataSkills[id].meta.unisonItemActors[0])); a.setSkill(id); return a.makeDamageValue(E, false); });
            // les deux éléments retirent deux points de bouclier (ennemi qui craint Physique ET Glace)
            var hit = Game_Action.prototype.itemHit, eva = Game_Action.prototype.itemEva;
            Game_Action.prototype.itemHit = function () { return 1; }; Game_Action.prototype.itemEva = function () { return 0; };
            var traits = $dataEnemies[E.enemyId()].traits, n0 = traits.length;
            traits.push({ code: 11, dataId: 1, value: 2 }, { code: 11, dataId: 13, value: 2 });
            r.bouclierMax = E._mSh; E._sh = E._mSh; var avant = E._sh;
            var a = new Game_Action(M(1)); a.setSkill(1303); a.apply(E);
            r.bouclier = avant + ' → ' + E._sh + (E.isStateAffected(1005) ? ' · brisé' : '');
            r.bouclierMoins = avant - E._sh;
            traits.splice(n0); E.removeState(1005);
            Game_Action.prototype.itemHit = hit; Game_Action.prototype.itemEva = eva;
            return r;
        }, DUOS);
        await retour();
        return r;
    });
    if (six) {
        var paires = six.fiches.map(function (f) { return f.acteurs; }).sort().join(' ');
        V('six duos, un par paire de héros (Vesper, Korrah, ludwing, Aël)', paires === '1+2 1+3 1+4 2+3 2+4 3+4', paires);
        V('tous dans le type 25 « Combo », les deux héros doivent la connaître, deux éléments chacun',
            six.typeNom === 'Combo' && six.fiches.every(function (f) { return f.type === 25 && f.apprendre === 'true,true' && f.elements === 2; }), JSON.stringify(six.fiches.map(function (f) { return f.id + ':' + f.type + '/' + f.apprendre + '/' + f.elements; })));
        V('dès la nouvelle partie (niveau 89), chaque héros connaît ses trois duos et voit le menu Combo', six.connues.every(function (c) { return /3\/3 menu$/.test(c); }), six.connues.join(' · '));
        V('seiryu n\'a ni le menu ni les duos (sa classe n\'est pas touchée)', six.seiryu === false);
        var attendus = ['Lame de Givre : Vesper', 'La Lame et son Ombre : Vesper', 'Feu Attisé : Vesper', "Nuit d'Hiver : ludwing", "Ciel d'Orage : Aël", 'Crépuscule : ludwing'];
        V('le premier des deux dans l\'équipe lance (' + six.ordre + ')', JSON.stringify(six.lanceurs) === JSON.stringify(attendus), six.lanceurs.join(' · '));
        V('…Korrah passée devant Vesper : c\'est elle qui lance Lame de Givre (contre-épreuve)', six.korrahDevant === 'Korrah', six.korrahDevant);
        V('Korrah l\'oublie : Vesper ne peut plus lancer Lame de Givre ; réapprise, de nouveau (l\'original lisait « t, t » comme « t, f »)', six.oubli === false && six.reapprise === true, JSON.stringify([six.oubli, six.reapprise]));
        V('chacun paie : Vesper 30 PT, ludwing 42 PM (La Lame et son Ombre)', six.couts[0] === 30 && six.couts[1] === 42, six.couts.join(' / '));
        V('Lame de Givre : l\'ATQ de Vesper et la MAG de Korrah', six.lame[0] === six.lameAttendu[0] && six.lame[1] === six.lameAttendu[1], six.lame.join(' / ') + ' (attendu ' + six.lameAttendu.join(' / ') + ')');
        V('Nuit d\'Hiver : la MAG moyenne de Korrah et ludwing', six.nuit === six.nuitAttendu, six.nuit + ' (attendu ' + six.nuitAttendu + ')');
        V('chaque duo fait des dégâts', six.degats.every(function (d) { return d > 0; }), six.degats.join(' · '));
        V('un ennemi qui craint les deux éléments perd deux points de bouclier d\'un coup', six.bouclierMoins === 2, 'bouclier ' + six.bouclier + ' (max ' + six.bouclierMax + ')');
    }
    var vrai = await sur('⑤ vrai combat', async function () {
        await ev(function () { window.__u = { S: 1303, lancees: [], mouvements: {}, actionsK: [], finsDeTour: [], enCours: false, textes: [] }; T.saisis = [];
            // le journal du jeu : le NOM de la compétence (YEP « Show Action Text » coupé, SimpleMsgSideView)
            if (!window.__journal) { window.__journal = true; ['addText', 'addItemNameText'].forEach(function (f) { var o = Window_BattleLog.prototype[f]; if (!o) return; Window_BattleLog.prototype[f] = function (t) { if (window.__u.textes && /Lame de Givre/.test(String(t))) window.__u.textes.push(String(t)); return o.apply(this, arguments); }; }); } });
        await combat(1);
        await costauds();
        await ev(function () {
            T.choix = function (a) { a.setTp(100); var t = $gameTroop.turnCount(); return (a.actorId() === 1 && t === 0 && a.canUse($dataSkills[1303])) ? 1303 : 0; };
            $gameActors.actor(2).setTp(100);
        });
        await jouer('function () { return $gameTroop.turnCount() >= window.__u.debut + 2 || !$gameParty.inBattle(); }');
        var r = await ev(function () { var u = window.__u; return { lancees: u.lancees, mouvements: u.mouvements, actionsK: u.actionsK, saisis: T.saisis, textes: u.textes }; });
        await ev(function () { T.choix = function () { return 0; }; });
        await retour();
        return r;
    });
    if (vrai) {
        var v0 = vrai.saisis.filter(function (s) { return s.indexOf('T0:') === 0; }).map(function (s) { return s.slice(3); });
        V('vrai combat : Vesper lance Lame de Givre, Korrah ne reçoit pas de commande et ne joue pas en plus',
            vrai.lancees.length === 1 && /Vesper/.test(vrai.lancees[0]) && v0.indexOf('Korrah') < 0 && vrai.actionsK.filter(function (s) { return s.indexOf('T1 ') === 0; }).length === 0,
            vrai.lancees.join(' · ') + ' · commandes ' + v0.join(', ') + ' · Korrah ' + (vrai.actionsK.join(' · ') || '—'));
        V('…les deux s\'avancent, et le nom « Lame de Givre » s\'affiche comme pour toute compétence', (vrai.mouvements.Vesper || 0) >= 1 && (vrai.mouvements.Korrah || 0) >= 1 && vrai.textes.length >= 1,
            JSON.stringify(vrai.mouvements) + ' · ' + (vrai.textes[0] || 'rien'));
    }

    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    console.log('\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
