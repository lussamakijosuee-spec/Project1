/*
 * LE BOUCLIER ET LA BRISURE (AstfglSCB, corrigé pour le jeu), DANS LE VRAI MOTEUR
 * ---------------------------------------------------------------------------
 * JOKO, 2026-10-18 : « intègre-le dans le jeu, teste-le avec les bancs, les images
 * par seconde et un vrai combat, et propose-moi les réglages des boucliers avant de
 * toucher aux ennemis ». Aucun ennemi de data/ n'a de bouclier : tout ce qui en a un
 * ici le reçoit EN MÉMOIRE (balise <mSh>, faiblesse, état de brisure d'essai).
 *   ① sans bouclier, rien ne change : ni bouclier, ni brisure, ni faiblesse notée, et
 *     le nom s'affiche comme avec Yanfly (même ligne, aucune icône) — contre-épreuve :
 *     le même ennemi avec <mSh> affiche « [2] » et ses faiblesses
 *   ② une faiblesse use le bouclier ; un élément qui n'en est pas une, un coup raté :
 *     rien ; deux faiblesses d'un coup : −2 ; <shImpact: 2> : −2 ; à 0 : l'état de
 *     brisure ; brisé, plus rien ne bouge ; l'état parti, le bouclier est plein
 *   ③ la faiblesse touchée est découverte ; une sauvegarde sans le plugin se charge
 *     (avant la correction : Astfgl = undefined, le combat suivant plantait) ; une
 *     nouvelle partie repart de zéro
 *   ④ un vrai combat : les héros frappent la faiblesse, l'ennemi est brisé, il perd
 *     son tour, le bouclier revient, il est brisé à nouveau
 *   ⑤ les réglages de JOKO (2026-10-18) : « boucliers par rang (D 2, C 3, B 4, A 5,
 *     S 6, boss 8), l'état Brisé (perd son tour, +50 % de dégâts), l'affichage avec
 *     icônes » — la règle par rang (sans rang : aucun ; <mSh> écrit passe avant),
 *     l'état 1005 tel qu'il doit être, ×1,5 sur les dégâts et pas sur les soins, le
 *     nom entier et le chiffre qui suit le combat ; puis un vrai combat sur les VRAIES
 *     données (troupe 1, rang D, état 1005) : rien n'est posé en mémoire côté ennemi
 *
 *   node bancs/navigateur/le_bouclier_et_la_brise.js
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
        await page.waitForTimeout(400);
    }
    async function combat(troupe) {
        await ev(function (t) { BattleManager.setup(t, true, true); $gamePlayer.makeEncounterCount(); SceneManager.push(Scene_Battle); }, troupe);
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && BattleManager._phase && BattleManager._phase !== 'init' && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(300);
    }
    async function retour() {
        await ev(function () { $gameTroop._interpreter.clear(); $gameMessage.clear(); BattleManager.processAbort(); });
        await surLaCarte();
    }

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    await ev(function () {
        DataManager.setupNewGame(); $gameSystem._meteo = { force: 'clair' }; $gamePlayer.reserveTransfer(29, 10, 10, 2, 0); SceneManager.goto(Scene_Map);
        window.T = {
            skill: function (note, extra) {
                var s = JSON.parse(JSON.stringify($dataSkills[1]));
                s.id = $dataSkills.length; s.name = 'Essai ' + s.id; s.note = note || ''; s.mpCost = 0; s.tpCost = 0; s.hitType = 0; s.successRate = 100;
                s.scope = 1; s.damage = { type: 1, elementId: 0, formula: '1', variance: 0, critical: false }; s.effects = []; s.stypeId = 1; s.animationId = 0;
                if (extra) Object.keys(extra).forEach(function (k) { s[k] = extra[k]; });
                DataManager.extractMetadata(s);
                // YEP_ElementCore lit <Multiple Elements> au chargement de la base : une
                // compétence créée après doit recevoir sa liste à la main
                var m = /<Multiple Elements:\s*([\d,\s]+)>/i.exec(s.note); s.multipleElements = m ? m[1].split(',').map(Number) : [];
                $dataSkills.push(s); return s.id;
            },
            etat: function (extra) {
                var s = JSON.parse(JSON.stringify($dataStates[2]));
                // l'état 2 du jeu part à l'immobilisation (removeByRestriction) : la brisure
                // immobilise, elle s'enlèverait à l'instant où elle est posée
                s.removeByRestriction = false; s.removeByDamage = false; s.removeByWalking = false; s.chanceByDamage = 0;
                s.id = $dataStates.length; s.name = 'Brisé (essai)'; s.note = ''; s.traits = []; s.restriction = 0; s.autoRemovalTiming = 0; s.removeAtBattleEnd = true;
                s.message1 = ''; s.message2 = ''; s.message3 = ''; s.message4 = ''; s.iconIndex = 0;
                if (extra) Object.keys(extra).forEach(function (k) { s[k] = extra[k]; });
                DataManager.extractMetadata(s); $dataStates.push(s); return s.id;
            },
            frapper: function (sujet, cible, id) { var a = new Game_Action(sujet); a.setSkill(id); a.apply(cible); return cible.result(); },
            // donne un bouclier à un ennemi de la base, en mémoire, et rend ce qu'il avait
            bouclier: function (id, n, brise, faibles) {
                var d = $dataEnemies[id];
                window.__avant = window.__avant || {};
                if (!window.__avant[id]) window.__avant[id] = { meta: JSON.parse(JSON.stringify(d.meta)), traits: JSON.parse(JSON.stringify(d.traits)) };
                d.meta.mSh = 'num = ' + n; if (brise) d.meta.DBS = String(brise);
                (faibles || []).forEach(function (el) { d.traits.push({ code: 11, dataId: el, value: 2 }); });
            },
            rendre: function (id) { var a = window.__avant && window.__avant[id]; if (a) { $dataEnemies[id].meta = a.meta; $dataEnemies[id].traits = a.traits; delete window.__avant[id]; } },
            // ce que la fenêtre du nom dessine (texte, ligne, icônes)
            dessin: function (E) {
                var w = new Window_EnemyVisualSelect(); w._battler = E; w._showEnemyName = true;
                w.updateWindowSize(); var traits = [];
                var dt = w.drawText, di = w.drawIcon;
                w.drawText = function (t, x, y) { traits.push({ texte: String(t), y: y }); return dt.apply(this, arguments); };
                w.drawIcon = function (i, x, y) { traits.push({ icone: i, y: y }); return di.apply(this, arguments); };
                w.refresh();
                return { traits: traits, ligneYanfly: w.contents.height - w.lineHeight(), largeur: w.width };
            }
        };
    });
    await surLaCarte();
    console.log('LE BOUCLIER ET LA BRISURE');

    var TROUPE = 2;
    var base = await ev(function (t) {
        var ids = $dataTroops[t].members.map(function (m) { return m.enemyId; });
        var sansBouclier = $dataEnemies.filter(function (e) { return e && e.meta && e.meta.mSh; }).length;
        // Depuis le rework des ennemis (2026-10-27), le Slime a un rang (D), donc un bouclier : le banc le lui
        // retire en mémoire, pour garder un ennemi sans rang — la règle « sans rang, aucun bouclier ».
        ids.forEach(function (id) { var e = $dataEnemies[id]; e.note = e.note.replace(/<\s*Rang\s*:[^>]*>\s*/gi, ''); delete e.meta.Rang; });
        return { ids: ids, nom: $dataEnemies[ids[0]].name, avecBalise: sansBouclier, plugin: $plugins.some(function (p) { return p.name === 'AstfglSCB' && p.status; }) };
    }, TROUPE);
    V('le plugin est chargé (AstfglSCB, actif)', base.plugin);
    V('aucune fiche d\'ennemi n\'est touchée : pas une balise <mSh> (la règle par rang fait tout)', base.avecBalise === 0, base.avecBalise + ' balise(s) <mSh>');

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ① sans bouclier, rien ne change ──');
    await combat(TROUPE);
    var un = await ev(function () {
        var A = $gameParty.members()[0], E = $gameTroop.members()[0], r = {};
        var faible = 0; for (var i = 1; i < $dataSystem.elements.length; i++) { if (E.elementRate(i) > 1) { faible = i; break; } }
        if (!faible) { $dataEnemies[E.enemyId()].traits.push({ code: 11, dataId: 8, value: 2 }); faible = 8; r.faibleAjoutee = true; }
        r.faible = faible;
        // La marque de l'âme (LeSpirituel, état 257) n'est pas l'affaire du bouclier : un coup d'un héros au
        // mana spirituel l'écrit, bouclier ou pas. On compte tout le reste.
        var horsMarque = function () { return E.states().filter(function (s) { return s.id !== 257; }); };
        var etatsAvant = horsMarque().map(function (s) { return s.id; });
        var coup = T.skill('', { damage: { type: 1, elementId: faible, formula: '1', variance: 0, critical: false } });
        for (var k = 0; k < 5; k++) T.frapper(A, E, coup);
        var nouveaux = horsMarque().filter(function (s) { return etatsAvant.indexOf(s.id) < 0; });
        r.etatsPoses = nouveaux.length;
        r.etatsNoms = nouveaux.map(function (s) { return s.id + ' ' + s.name; }).join(', ');
        r.marque = E.isStateAffected(257);
        r.affichage = E.checkShieldDisplay();
        r.decouverte = (Astfgl.enemies.disWeak[E.enemyId()] || [])[faible] || 0;
        r.dessin = T.dessin(E);
        if (r.faibleAjoutee) $dataEnemies[E.enemyId()].traits.pop();
        return r;
    });
    V('un ennemi sans bouclier : « none »', un.affichage === 'none', un.affichage);
    V('5 coups sur sa faiblesse : aucun état posé, pas de brisure', un.etatsPoses === 0,
        un.etatsPoses + ' état(s)' + (un.etatsNoms ? ' : ' + un.etatsNoms : '') + ' · faiblesse ' + un.faible + (un.marque ? ' (marque de l\'âme écrite, hors bouclier)' : ''));
    V('…et sa faiblesse n\'est pas notée (le plugin ne le regarde pas)', un.decouverte === 0, String(un.decouverte));
    var textes = un.dessin.traits.filter(function (x) { return x.texte !== undefined; }), icones = un.dessin.traits.filter(function (x) { return x.icone !== undefined; });
    V('son nom s\'affiche comme avec Yanfly : sans crochets, sur la même ligne, sans icône',
        textes.length === 1 && textes[0].texte.indexOf('[') < 0 && textes[0].y === un.dessin.ligneYanfly && icones.length === 0,
        JSON.stringify(textes) + ' · ligne Yanfly ' + un.dessin.ligneYanfly + ' · ' + icones.length + ' icône(s)');
    await retour();

    // contre-épreuve : le même ennemi, avec un bouclier (en combat : la fenêtre du nom a
    // besoin du sprite de l'ennemi)
    await ev(function (ids) { T.bouclier(ids[0], 2, 0, [8]); }, base.ids);
    await combat(TROUPE);
    var ce = await ev(function (ids) {
        var E = $gameTroop.members()[0];
        var r = { sh: E._sh, max: E._mSh, affichage: E.checkShieldDisplay() };
        Astfgl.enemies.disWeak[ids[0]][8] = 1;
        r.dessin = T.dessin(E);
        Astfgl.enemies.disWeak[ids[0]][8] = 0;
        return r;
    }, base.ids);
    await retour();
    await ev(function (ids) { T.rendre(ids[0]); }, base.ids);
    var t2 = ce.dessin.traits.filter(function (x) { return x.texte !== undefined; }), i2 = ce.dessin.traits.filter(function (x) { return x.icone !== undefined; });
    V('contre-épreuve : avec <mSh: num = 2>, il a 2 boucliers', ce.sh === 2 && ce.max === 2 && ce.affichage === true, JSON.stringify([ce.sh, ce.max, ce.affichage]));
    // réglage de JOKO : le bouclier en icône (128) avec son chiffre, le nom à côté ; sous le
    // nom, chaque faiblesse : son icône si elle est découverte (feu = 64), « ? » (93) sinon
    var icones2 = i2.map(function (x) { return x.icone; });
    V('…son bouclier s\'affiche (icône 128 et « 2 »), la faiblesse découverte a son icône (feu 64), les autres « ? » (93)',
        t2.some(function (x) { return x.texte === '2'; }) && t2.some(function (x) { return x.texte.indexOf(base.nom) === 0; }) && icones2[0] === 128 && icones2.indexOf(64) > 0 && icones2.every(function (x) { return x > 0; }),
        JSON.stringify(t2) + ' · icônes ' + JSON.stringify(icones2));

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ② les règles du bouclier ──');
    var regles = await ev(function (ids) {
        var brise = T.etat({ restriction: 4, autoRemovalTiming: 2, minTurns: 1, maxTurns: 1 });
        T.bouclier(ids[0], 3, brise, [8, 13]);
        var A = $gameActors.actor(1), E = new Game_Enemy(ids[0], 0, 0), r = { brise: brise };
        A.setHp(A.mhp);
        var nonFaible = 0; for (var i = 1; i < $dataSystem.elements.length; i++) { if (i !== 8 && i !== 13 && E.elementRate(i) <= 1) { nonFaible = i; break; } }
        function sk(el, extra, note) { var o = { damage: { type: 1, elementId: el, formula: '1', variance: 0, critical: false } }; if (extra) Object.keys(extra).forEach(function (k) { o[k] = extra[k]; }); return T.skill(note || '', o); }
        var feu = sk(8), autre = sk(nonFaible), rate = sk(8, { successRate: 0 }), double = sk(8, null, '<Multiple Elements: 8, 13>'), fort = sk(8, null, '<shImpact: 2>');
        r.depart = E._sh;
        T.frapper(A, E, feu); r.apresFeu = E._sh;
        T.frapper(A, E, autre); r.apresAutre = E._sh; r.nonFaible = nonFaible + ' (×' + E.elementRate(nonFaible) + ')';
        T.frapper(A, E, rate); r.apresRate = E._sh;
        E._sh = 3; T.frapper(A, E, double); r.apresDouble = E._sh;
        E._sh = 3; T.frapper(A, E, fort); r.apresFort = E._sh;
        E._sh = 1; T.frapper(A, E, feu); r.aZero = E._sh; r.brisé = E.isStateAffected(brise); r.peutAgir = E.canMove();
        T.frapper(A, E, feu); r.briseEncore = E._sh;
        E.removeState(brise); r.recharge = E._sh; r.plusBrise = !E.isStateAffected(brise);
        r.decouverte = Astfgl.enemies.disWeak[ids[0]][8] === 1 && Astfgl.enemies.disWeak[ids[0]][13] === 1;
        T.rendre(ids[0]);
        return r;
    }, base.ids);
    V('départ : 3 boucliers', regles.depart === 3, regles.depart);
    V('un coup de feu (faiblesse) : 3 → 2', regles.apresFeu === 2, regles.apresFeu);
    V('un élément qui n\'est pas une faiblesse : rien', regles.apresAutre === 2, regles.apresAutre + ' · élément ' + regles.nonFaible);
    V('un coup raté : rien', regles.apresRate === 2, regles.apresRate);
    V('deux faiblesses d\'un coup (feu + glace) : −2', regles.apresDouble === 1, regles.apresDouble);
    V('<shImpact: 2> : −2', regles.apresFort === 1, regles.apresFort);
    V('à 0 : l\'état de brisure est posé, il ne peut plus agir', regles.aZero === 0 && regles.brisé && !regles.peutAgir, JSON.stringify([regles.aZero, regles.brisé, regles.peutAgir]));
    V('brisé, frapper encore ne change rien', regles.briseEncore === 0, regles.briseEncore);
    V('l\'état parti, le bouclier est plein (3)', regles.recharge === 3 && regles.plusBrise, regles.recharge);

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ③ faiblesses découvertes et sauvegardes ──');
    V('les faiblesses touchées sont découvertes (feu, glace)', regles.decouverte);
    var sv = await ev(function (ids) {
        var r = {};
        Astfgl.enemies.disWeak[ids[0]][8] = 1;
        var avec = JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents()));
        r.sauve = !!(avec.astfgl && avec.astfgl.enemies) && Object.keys(avec.astfgl).join(',');
        Astfgl.enemies.disWeak[ids[0]][8] = 0;
        DataManager.extractSaveContents(avec); r.relue = Astfgl.enemies.disWeak[ids[0]][8];
        var vieille = JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents())); delete vieille.astfgl;
        DataManager.extractSaveContents(vieille);
        r.vieilleOk = !!(window.Astfgl && Astfgl.enemies && Array.isArray(Astfgl.enemies.disWeak));
        try { T.bouclier(ids[0], 2, 0, [8]); var E = new Game_Enemy(ids[0], 0, 0); var f = T.skill('', { damage: { type: 1, elementId: 8, formula: '1', variance: 0, critical: false } }); T.frapper($gameActors.actor(1), E, f); r.combatApres = E._sh; } catch (e) { r.combatApres = 'plante : ' + e.message; }
        T.rendre(ids[0]);
        Astfgl.enemies.disWeak[ids[0]] = Astfgl.enemies.disWeak[ids[0]] || []; Astfgl.enemies.disWeak[ids[0]][8] = 1;
        DataManager.setupNewGame(); r.nouvelle = Astfgl.enemies.disWeak.length;
        $gamePlayer.reserveTransfer(29, 10, 10, 2, 0); SceneManager.goto(Scene_Map);
        return r;
    }, base.ids);
    await surLaCarte();
    V('la sauvegarde garde les faiblesses découvertes (et rien d\'autre)', sv.sauve === 'enemies' && sv.relue === 1, sv.sauve + ' · relue ' + sv.relue);
    V('une sauvegarde faite sans le plugin se charge…', sv.vieilleOk);
    V('…et le combat suivant ne plante pas', sv.combatApres === 1, String(sv.combatApres));
    V('une nouvelle partie repart sans faiblesses découvertes', sv.nouvelle === 0, sv.nouvelle);

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ④ un vrai combat ──');
    var prep = await ev(function (ids) {
        var brise = T.etat({ restriction: 4, autoRemovalTiming: 2, minTurns: 1, maxTurns: 1 });
        T.bouclier(ids[0], 2, brise, [8]);
        var feu = T.skill('', { damage: { type: 1, elementId: 8, formula: '1', variance: 0, critical: false } });
        window.__vb = { brise: brise, feu: feu, cassures: 0, recharges: 0, agitBrise: 0, toursPerdus: 0, actionsCible: 0, journal: [] };
        if (!window.__autoBouclier) {
            window.__autoBouclier = true;
            Game_Actor.prototype.isAutoBattle = function () { return true; };
            Game_Actor.prototype.makeAutoBattleActions = function () {
                for (var i = 0; i < this.numActions(); i++) { this.action(i).setSkill(window.__vb.feu); this.action(i).setTarget(0); }
                this.setActionState('waiting');
            };
            var debut = BattleManager.startAction;
            BattleManager.startAction = function () {
                var s = this._subject, E = $gameTroop.members()[0];
                if (s === E) { window.__vb.actionsCible++; if (E.isStateAffected(window.__vb.brise)) window.__vb.agitBrise++; }
                return debut.apply(this, arguments);
            };
            var ajout = Game_Battler.prototype.addState;
            Game_Battler.prototype.addState = function (id) {
                var avant = this.isStateAffected(id); ajout.apply(this, arguments);
                if (this === $gameTroop.members()[0] && id === window.__vb.brise && !avant && this.isStateAffected(id)) { window.__vb.cassures++; window.__vb.journal.push('T' + $gameTroop.turnCount() + ' brisé'); }
            };
            var retrait = Game_Battler.prototype.removeState;
            Game_Battler.prototype.removeState = function (id) {
                var avant = this.isStateAffected(id); retrait.apply(this, arguments);
                if (this === $gameTroop.members()[0] && id === window.__vb.brise && avant) { window.__vb.journal.push('T' + $gameTroop.turnCount() + ' rechargé à ' + this._sh); if (this._sh === this._mSh) window.__vb.recharges++; }
            };
            // un tour sans agir pendant la brisure, compté à la fin de son tour
            var finTour = Game_Battler.prototype.onTurnEnd;
            Game_Battler.prototype.onTurnEnd = function () {
                if (this === $gameTroop.members()[0] && this.isStateAffected(window.__vb.brise)) window.__vb.toursPerdus++;
                return finTour.apply(this, arguments);
            };
        }
        return { brise: brise };
    }, base.ids);
    await combat(TROUPE);
    await ev(function () {
        $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); });
        $gameParty.members().forEach(function (a) { a.addParam(0, 9999999); a.recoverAll(); });
        window.__vb.debut = $gameTroop.turnCount();
        window.__vb.shDepart = $gameTroop.members()[0]._sh;
    });
    // Le combat se joue en accéléré : la logique du moteur, image par image, sans dessiner
    // l'écran (le Chromium des bancs dessine à quelques images par seconde, et un tour avec
    // les séquences d'action de Yanfly prend alors plusieurs minutes). Rien n'est sauté :
    // ce sont les mêmes images que le jeu jouerait.
    for (var lot = 0; lot < 60; lot++) {
        var fini = await ev(function () {
            var v = window.__vb;
            function fin() { return (v.cassures >= 2 && v.recharges >= 1) || $gameTroop.turnCount() >= v.debut + 8 || !$gameParty.inBattle(); }
            for (var i = 0; i < 600 && !fin(); i++) { SceneManager.updateInputData(); SceneManager.changeScene(); SceneManager.updateScene(); }
            return fin();
        });
        if (fini) break;
    }
    var vrai = await ev(function () { var v = window.__vb, E = $gameTroop.members()[0]; return { depart: v.shDepart, cassures: v.cassures, recharges: v.recharges, agitBrise: v.agitBrise, toursPerdus: v.toursPerdus, actions: v.actionsCible, tours: $gameTroop.turnCount() - v.debut, journal: v.journal.join(' · '),
        etat: 'en combat ' + $gameParty.inBattle() + ' · phase ' + BattleManager._phase + ' · sujet ' + (BattleManager._subject ? BattleManager._subject.name() : '—') + ' · ennemi ' + (E ? E.hp + ' PV, bouclier ' + E._sh + ', états ' + E.states().map(function (s) { return s.id; }).join('/') : '?') + ' · héros vivants ' + $gameParty.aliveMembers().length + ' · évènement ' + $gameTroop.isEventRunning() + ' · message ' + $gameMessage.isBusy() }; });
    if (!(vrai.cassures >= 2 && vrai.recharges >= 1)) console.log('   (état du combat à l\'arrêt : ' + vrai.etat + ')');
    await retour();
    await ev(function (ids) { T.rendre(ids[0]); }, base.ids);
    V('il entre en combat avec 2 boucliers', vrai.depart === 2, vrai.depart);
    V('les héros frappent sa faiblesse : il est brisé', vrai.cassures >= 1, vrai.cassures + ' fois · ' + vrai.journal);
    V('brisé, il perd son tour (aucune action pendant la brisure)', vrai.agitBrise === 0 && vrai.toursPerdus >= 1, vrai.toursPerdus + ' tour(s) perdu(s), ' + vrai.agitBrise + ' action(s) brisé');
    V('la brisure passe : bouclier plein, et il est brisé à nouveau', vrai.recharges >= 1 && vrai.cassures >= 2, vrai.recharges + ' recharge(s), ' + vrai.cassures + ' brisure(s) en ' + vrai.tours + ' tours');

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ⑤ les réglages de JOKO ──');
    var reg = await ev(function () {
        var r = { rangs: {} }, rangDe = EquilibreDesCombats.rangDe;
        ['D', 'C', 'B', 'A', 'S', 'BOSS', null].forEach(function (k) {
            var d = $dataEnemies.find(function (e) { return e && e.name && rangDe(e) === k; });
            var E = new Game_Enemy(d.id, 0, 0);
            r.rangs[k || 'sans rang'] = E.checkShieldDisplay() === 'none' ? 'aucun' : E._mSh;
        });
        // un <mSh> écrit sur la fiche passe avant la règle
        var s = $dataEnemies.find(function (e) { return e && e.name && rangDe(e) === 'S'; });
        T.bouclier(s.id, 1); r.ecrit = new Game_Enemy(s.id, 0, 0)._mSh; T.rendre(s.id);
        var st = $dataStates[1005];
        r.etat = { nom: st.name, restriction: st.restriction, fin: st.autoRemovalTiming, tours: st.minTurns + '-' + st.maxTurns, coups: st.removeByDamage, immobilise: st.removeByRestriction, finCombat: st.removeAtBattleEnd };
        var p = PluginManager.parameters('AstfglSCB'); r.param = { etat: p.defaultState, mode: p.mode, icone: p.baseIcon, inconnue: p.defautWeaknessIcon, degats: p.degatsBrise };
        // ×1,5 : le même coup avant et pendant la brisure, sur un vrai ennemi de rang D
        var dD = $dataEnemies.find(function (e) { return e && e.name && rangDe(e) === 'D'; });
        var E = new Game_Enemy(dD.id, 0, 0); E.addParam(0, 9999999); E.recoverAll();
        var faible = 0; for (var i = 1; i < $dataSystem.elements.length; i++) { if (E.elementRate(i) > 1) { faible = i; break; } }
        var A = $gameActors.actor(1);
        var coup = T.skill('', { damage: { type: 1, elementId: faible, formula: '100', variance: 0, critical: false } });
        var soin = T.skill('', { damage: { type: 3, elementId: faible, formula: '100', variance: 0, critical: false } });
        T.frapper(A, E, coup); r.avant = E.result().hpDamage; T.frapper(A, E, soin); r.soinAvant = E.result().hpDamage;
        var n = 0; while (E._sh > 0 && n++ < 20) T.frapper(A, E, coup);
        r.brisePar1005 = E.isStateAffected(1005);
        T.frapper(A, E, coup); r.pendant = E.result().hpDamage; T.frapper(A, E, soin); r.soinPendant = E.result().hpDamage;
        return r;
    });
    V('boucliers par rang : D 2, C 3, B 4, A 5, S 6, boss 8 ; sans rang : aucun',
        JSON.stringify(reg.rangs) === JSON.stringify({ D: 2, C: 3, B: 4, A: 5, S: 6, BOSS: 8, 'sans rang': 'aucun' }), JSON.stringify(reg.rangs));
    V('un <mSh> écrit sur la fiche passe avant la règle', reg.ecrit === 1, reg.ecrit);
    V('l\'état 1005 « Brisé » : immobilise, 1 tour en fin de tour, ne part ni aux coups ni à l\'immobilisation',
        reg.etat.restriction === 4 && reg.etat.fin === 2 && reg.etat.tours === '1-1' && !reg.etat.coups && !reg.etat.immobilise && reg.etat.finCombat, JSON.stringify(reg.etat));
    V('le plugin pose l\'état 1005, bouclier en icône (128), « ? » = 93, ×1,5', reg.param.etat === '1005' && reg.param.mode === '1' && reg.param.icone === '128' && reg.param.inconnue === '93' && reg.param.degats === '1.5', JSON.stringify(reg.param));
    V('brisé, il prend ×1,5 sur le même coup', reg.brisePar1005 && reg.pendant === Math.round(reg.avant * 1.5), reg.avant + ' → ' + reg.pendant);
    V('…mais un soin reste un soin, sans bonus', reg.soinAvant < 0 && reg.soinPendant === reg.soinAvant, reg.soinAvant + ' → ' + reg.soinPendant);

    // l'affichage, sur un vrai ennemi de rang D en combat (troupe 1)
    await combat(1);
    var aff = await ev(function () {
        var E = $gameTroop.members()[0], A = $gameActors.actor(1), r = {};
        var w = new Window_EnemyVisualSelect(); w.setBattler(E); w._showEnemyName = true;
        var traits = []; var dt = w.drawText;
        w.drawText = function (t, x, y, l) { traits.push({ t: String(t), x: x, l: l }); return dt.apply(this, arguments); };
        w.update();
        var nom = traits.find(function (x) { return x.t === E.name(); });
        r.nomEntier = !!nom && w.textWidth(E.name()) <= nom.l - nom.x; r.chiffreAvant = (traits.find(function (x) { return /^\d+$/.test(x.t); }) || {}).t;
        var faible = 0; for (var i = 1; i < $dataSystem.elements.length; i++) { if (E.elementRate(i) > 1) { faible = i; break; } }
        var coup = T.skill('', { damage: { type: 1, elementId: faible, formula: '1', variance: 0, critical: false } });
        traits.length = 0; T.frapper(A, E, coup); w.update();
        r.chiffreApres = (traits.find(function (x) { return /^\d+$/.test(x.t); }) || {}).t; r.sh = E._sh;
        return r;
    });
    await retour();
    V('le nom est entier, malgré l\'icône du bouclier devant', aff.nomEntier);
    V('le chiffre du bouclier suit le combat (la fenêtre se redessine)', aff.chiffreAvant === '2' && aff.chiffreApres === '1' && aff.sh === 1, aff.chiffreAvant + ' → ' + aff.chiffreApres);

    // un vrai combat sur les VRAIES données : troupe 1 (rang D), état 1005, rien en mémoire côté ennemi
    await ev(function () {
        var d = $dataEnemies[$dataTroops[1].members[0].enemyId], E = new Game_Enemy(d.id, 0, 0), faible = 0;
        for (var i = 1; i < $dataSystem.elements.length; i++) { if (E.elementRate(i) > 1) { faible = i; break; } }
        window.__vb = { brise: 1005, feu: T.skill('', { damage: { type: 1, elementId: faible, formula: '1', variance: 0, critical: false } }), cassures: 0, recharges: 0, agitBrise: 0, toursPerdus: 0, actionsCible: 0, journal: [] };
    });
    await combat(1);
    await ev(function () {
        $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); });
        $gameParty.members().forEach(function (a) { a.addParam(0, 9999999); a.recoverAll(); });
        window.__vb.debut = $gameTroop.turnCount(); window.__vb.shDepart = $gameTroop.members()[0]._sh;
    });
    for (var lot2 = 0; lot2 < 60; lot2++) {
        var fini2 = await ev(function () {
            var v = window.__vb;
            function fin() { return (v.cassures >= 2 && v.recharges >= 1) || $gameTroop.turnCount() >= v.debut + 8 || !$gameParty.inBattle(); }
            for (var i = 0; i < 600 && !fin(); i++) { SceneManager.updateInputData(); SceneManager.changeScene(); SceneManager.updateScene(); }
            return fin();
        });
        if (fini2) break;
    }
    var reel = await ev(function () { var v = window.__vb; return { depart: v.shDepart, cassures: v.cassures, recharges: v.recharges, agitBrise: v.agitBrise, toursPerdus: v.toursPerdus, tours: $gameTroop.turnCount() - v.debut, journal: v.journal.join(' · ') }; });
    await retour();
    V('vrai combat, vraies données : la chauve-souris (rang D) entre avec 2 boucliers', reel.depart === 2, reel.depart);
    V('…elle est brisée par l\'état 1005 et perd son tour', reel.cassures >= 1 && reel.agitBrise === 0 && reel.toursPerdus >= 1, reel.cassures + ' brisure(s), ' + reel.toursPerdus + ' tour(s) perdu(s), ' + reel.agitBrise + ' action(s) brisée · ' + reel.journal);
    V('…puis son bouclier revient et elle est brisée à nouveau', reel.recharges >= 1 && reel.cassures >= 2, reel.recharges + ' recharge(s) en ' + reel.tours + ' tours');

    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    console.log('\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
