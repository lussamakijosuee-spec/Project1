/*
 * COMBATTACTIQUE ET MAÎTRISE, DANS LE VRAI MOTEUR
 * ---------------------------------------------------------------------------
 * Les compétences et états d'essai sont créés EN MÉMOIRE (rien dans data/).
 *   ① limite : +3 en frappant, +4 en encaissant, +15 quand un héros tombe ;
 *     <Coût limite> bloque puis paie ; <Gain limite> ; commandes ; la jauge
 *     ne s'affiche que si un héros connaît une compétence qui la coûte
 *   ② barrière : absorbe avant les PV, s'épuise, <Perce-barrière>, 30 %,
 *     plafond, durée en tours, barrière de départ ; le bleu se VOIT sur la
 *     jauge de PV (pixels), et pas sans barrière (contre-épreuve)
 *   ③ provocation : les coups à cible unique vont au provocateur ; sans
 *     elle, ils se répartissent ; « magique » ne détourne pas un coup
 *     physique ; un ennemi qui provoque est le seul visable
 *   ④ overkill : coup qui dépasse de 50 % → bonus ; coup juste → rien
 *   ⑤ instantané : le héros rechoisit ; une compétence normale passe au
 *     suivant ; revenir en arrière retire l'action en plus
 *   ⑥ usages limités, ⑦ vol, ⑧ difficulté
 *   ⑨ maîtrise : 5 usages → ★1, +4 % ; l'Attaque ne compte pas ;
 *     <Sans maîtrise> ; ⑩ statistiques
 *
 *   node bancs/navigateur/le_combat_tactique.js
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
        await ev(function (t) { BattleManager.setup(t, true, true); $gamePlayer.makeEncounterCount(); SceneManager.push(Scene_Battle); }, troupe || 2);
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && BattleManager._phase === 'input' && BattleManager.actor() && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
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
        // les pièces d'essai, en mémoire seulement
        window.T = {
            skill: function (note, extra) {
                var s = JSON.parse(JSON.stringify($dataSkills[1]));
                s.id = $dataSkills.length; s.name = 'Essai ' + s.id; s.note = note || ''; s.mpCost = 0; s.tpCost = 0; s.hitType = 0; s.successRate = 100;
                s.scope = 1; s.damage = { type: 1, elementId: 0, formula: '50', variance: 0, critical: false }; s.effects = []; s.stypeId = 1;
                if (extra) Object.keys(extra).forEach(function (k) { s[k] = extra[k]; });
                DataManager.extractMetadata(s); $dataSkills.push(s); return s.id;
            },
            etat: function (note) {
                var s = JSON.parse(JSON.stringify($dataStates[2]));
                s.id = $dataStates.length; s.name = 'Essai'; s.note = note || ''; s.traits = []; s.restriction = 0; s.autoRemovalTiming = 0; s.removeAtBattleEnd = false;
                DataManager.extractMetadata(s); $dataStates.push(s); return s.id;
            },
            cmd: function (t) { var i = new Game_Interpreter(); i._params = [t]; var a = t.split(' '); i.pluginCommand(a.shift(), a); },
            frapper: function (sujet, cible, id) { var a = new Game_Action(sujet); a.setSkill(id); a.apply(cible); return cible.result(); }
        };
    });
    await surLaCarte();
    console.log('COMBATTACTIQUE ET MAÎTRISE');

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ① la jauge de limite ──');
    await combat();
    var lim = await ev(function () {
        var A = $gameParty.members()[0], B = $gameParty.members()[1], E = $gameTroop.members()[0], r = {};
        var coup = T.skill('', { damage: { type: 1, elementId: 0, formula: '5', variance: 0, critical: false } });
        $gameParty.fixerLimite(0);
        T.frapper(A, E, coup); r.frappe = $gameParty.limite();
        var c2 = T.skill('', { damage: { type: 1, elementId: 0, formula: '5', variance: 0, critical: false } });
        T.frapper(E, B, c2); r.encaisse = $gameParty.limite() - r.frappe;
        var tue = T.skill('', { damage: { type: 1, elementId: 0, formula: '999999', variance: 0, critical: false } });
        B.setHp(1); var av = $gameParty.limite(); T.frapper(E, B, tue); r.chute = $gameParty.limite() - av; B.revive(); B.setHp(B.mhp);
        var ulti = T.skill('<Coût limite: 50>');
        $gameParty.fixerLimite(10); r.bloque = !A.canUse($dataSkills[ulti]);
        $gameParty.fixerLimite(60); r.peut = A.canUse($dataSkills[ulti]); A.paySkillCost($dataSkills[ulti]); r.reste = $gameParty.limite();
        r.ennemiLibre = E.canPaySkillCost($dataSkills[ulti]);
        var charge = T.skill('<Gain limite: 12>'); $gameParty.fixerLimite(0); A.useItem($dataSkills[charge]); r.gain = $gameParty.limite();
        r.jaugeAvant = SceneManager._scene._jaugeLimite.visible;
        A.learnSkill(ulti); r.jaugeAuto = CombatTactique.jaugeVisible(); A.forgetSkill(ulti);
        r.ulti = ulti;
        return r;
    });
    V('un héros frappe : +3', lim.frappe === 3, lim.frappe);
    V('un héros encaisse : +4', lim.encaisse === 4, lim.encaisse);
    V('un héros tombe : +4 (encaisse) +15 (chute)', lim.chute === 19, lim.chute);
    V('<Coût limite: 50> : bloqué à 10, utilisable à 60, il en reste 10', lim.bloque && lim.peut && lim.reste === 10, JSON.stringify([lim.bloque, lim.peut, lim.reste]));
    V('les ennemis ne paient pas la jauge des héros', lim.ennemiLibre, '');
    V('<Gain limite: 12> : la jauge monte de 12', lim.gain === 12, lim.gain);
    V('jauge cachée tant qu\'aucun héros n\'a de compétence qui la coûte ; visible sinon', lim.jaugeAvant === false && lim.jaugeAuto === true, JSON.stringify([lim.jaugeAvant, lim.jaugeAuto]));
    var cmd = await ev(function () {
        var out = [];
        function c(t) { T.cmd(t); out.push($gameParty.limite()); }
        c('LIMITE vide'); c('LIMITE +20'); c('LIMITE -5'); c('LIMITE =50'); c('LIMITE plein'); c('LIMITE +30');
        return out;
    });
    V('commandes : vide, +20, -5, =50, plein, et jamais au-dessus de 100', cmd.join() === '0,20,15,50,100,100', cmd.join(' → '));
    await retour();
    var garde = await ev(function () { return $gameParty.limite(); });
    await combat();
    var garde2 = await ev(function () { return $gameParty.limite(); });
    V('la jauge est gardée d\'un combat à l\'autre', garde === 100 && garde2 === 100, garde + ' → ' + garde2);

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ② la barrière ──');
    var bar = await ev(function () {
        var A = $gameParty.members()[0], E = $gameTroop.members()[0], r = {};
        A.setHp(A.mhp);
        var bouclier = T.skill('<Barrière: 100>', { damage: { type: 0, elementId: 0, formula: '0', variance: 0, critical: false }, scope: 11 });
        var c50 = T.skill('', { damage: { type: 1, elementId: 0, formula: '50', variance: 0, critical: false } });
        var c80 = T.skill('', { damage: { type: 1, elementId: 0, formula: '80', variance: 0, critical: false } });
        var perce = T.skill('<Perce-barrière>', { damage: { type: 1, elementId: 0, formula: '40', variance: 0, critical: false } });
        T.frapper(A, A, bouclier); r.donne = A.barriere();
        var hp0 = A.hp; T.frapper(E, A, c50); r.apres50 = [A.hp - hp0, A.barriere()];
        hp0 = A.hp; var res = T.frapper(E, A, c80); r.apres80 = [hp0 - A.hp, A.barriere(), res.hpDamage];
        T.frapper(A, A, bouclier); hp0 = A.hp; T.frapper(E, A, perce); r.perce = [hp0 - A.hp, A.barriere()];
        A.fixerBarriere(0);
        var pc = T.skill('<Barrière: 30%>', { damage: { type: 0, elementId: 0, formula: '0', variance: 0, critical: false }, scope: 11 });
        T.frapper(A, A, pc); r.pc = [A.barriere(), Math.floor(A.mhp * 0.3)];
        A.fixerBarriere(0);
        var enorme = T.skill('<Barrière: 9999999>', { damage: { type: 0, elementId: 0, formula: '0', variance: 0, critical: false }, scope: 11 });
        T.frapper(A, A, enorme); r.plafond = [A.barriere(), A.mhp];
        A.fixerBarriere(0);
        var court = T.skill('<Barrière: 100>\n<Barrière tours: 1>', { damage: { type: 0, elementId: 0, formula: '0', variance: 0, critical: false }, scope: 11 });
        T.frapper(A, A, court); r.tour = [A.barriere()]; A.onTurnEnd(); r.tour.push(A.barriere());
        // les pixels : la jauge de PV, avec et sans barrière
        var w = new Window_Base(0, 0, 400, 120);
        function bleu() {
            w.contents.clear(); w.drawActorHp(A, 0, 0, 300);
            // la ligne la plus « bleu clair » de la colonne (la jauge peut être d'un autre plugin)
            var mieux = [0, 0, 0];
            for (var y = w.lineHeight() - 14; y < w.lineHeight(); y++) { var p = w.contents._context.getImageData(20, y, 1, 1).data; if (p[3] > 200 && p[2] - p[0] > mieux[2] - mieux[0]) mieux = [p[0], p[1], p[2]]; }
            return mieux;
        }
        A.setHp(A.mhp); A.fixerBarriere(0); r.pixSans = bleu();
        A.fixerBarriere(Math.floor(A.mhp / 2)); r.pixAvec = bleu();
        A.fixerBarriere(0);
        // la barrière de départ (note du héros, en mémoire)
        var note = $dataActors[A.actorId()].note; $dataActors[A.actorId()].note = note + '\n<Barrière de départ: 77>';
        A.onBattleStart(); r.depart = A.barriere();
        $dataActors[A.actorId()].note = note; A.onBattleStart(); r.departSans = A.barriere();
        return r;
    });
    V('<Barrière: 100> : 100 points de barrière', bar.donne === 100, bar.donne);
    V('un coup de 50 : PV intacts, barrière 50', bar.apres50[0] === 0 && bar.apres50[1] === 50, JSON.stringify(bar.apres50));
    V('un coup de 80 : 30 passent, barrière à 0', bar.apres80[0] === 30 && bar.apres80[1] === 0 && bar.apres80[2] === 30, JSON.stringify(bar.apres80));
    V('<Perce-barrière> : les 40 passent, la barrière reste', bar.perce[0] === 40 && bar.perce[1] === 100, JSON.stringify(bar.perce));
    V('<Barrière: 30%> : 30 % des PV max de la cible', bar.pc[0] === bar.pc[1], JSON.stringify(bar.pc));
    V('plafond : jamais plus que les PV max', bar.plafond[0] === bar.plafond[1], JSON.stringify(bar.plafond));
    V('<Barrière tours: 1> : effacée à la fin du tour', bar.tour[0] === 100 && bar.tour[1] === 0, JSON.stringify(bar.tour));
    V('le bleu se voit sur la jauge de PV… et pas sans barrière', bar.pixAvec[2] > 180 && bar.pixAvec[1] > 150 && bar.pixAvec[2] - bar.pixAvec[0] > 60 && !(bar.pixSans[2] > 180 && bar.pixSans[1] > 150 && bar.pixSans[2] - bar.pixSans[0] > 60), JSON.stringify(bar.pixAvec) + ' / sans ' + JSON.stringify(bar.pixSans));
    V('<Barrière de départ: 77> sur le héros → 77 au début du combat ; sans la note, 0', bar.depart === 77 && bar.departSans === 0, bar.depart + ' / ' + bar.departSans);

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ③ la provocation ──');
    var prov = await ev(function () {
        var E = $gameTroop.members()[0], m = $gameParty.members(), r = {};
        var coup = T.skill('', { damage: { type: 1, elementId: 0, formula: '1', variance: 0, critical: false }, hitType: 1 });
        var sort = T.skill('', { damage: { type: 1, elementId: 0, formula: '1', variance: 0, critical: false }, hitType: 2 });
        function cibles(id, n) {
            var c = {};
            for (var i = 0; i < n; i++) { var a = new Game_Action(E); a.setSkill(id); a.setTarget(-1); a.decideRandomTarget(); var t = a.makeTargets()[0]; c[t.name()] = (c[t.name()] || 0) + 1; }
            return c;
        }
        r.sans = cibles(coup, 60);
        var p = T.etat('<Provocation>'); m[1].addState(p);
        r.avec = cibles(coup, 60); r.qui = m[1].name();
        m[1].removeState(p);
        var pm = T.etat('<Provocation: magique>'); m[1].addState(pm);
        r.magPhys = cibles(coup, 60); r.magMag = cibles(sort, 30);
        m[1].removeState(pm);
        // un ennemi qui provoque : le seul que la fenêtre de visée propose
        var pe = T.etat('<Provocation>');
        var w = new Window_BattleEnemy(0, 0);
        if (!BattleManager.inputtingAction()) BattleManager.actor().makeActions();
        BattleManager.inputtingAction().setAttack();
        w.refresh(); r.visablesSans = w._enemies.length;
        $gameTroop.members()[1].addState(pe);
        w.refresh(); r.visablesAvec = w._enemies.map(function (e) { return e.index(); });
        $gameTroop.members()[1].removeState(pe);
        return r;
    });
    V('sans provocation, les coups se répartissent', Object.keys(prov.sans).length >= 2, JSON.stringify(prov.sans));
    V('avec <Provocation>, les 60 coups vont à ' + prov.qui, prov.avec[prov.qui] === 60, JSON.stringify(prov.avec));
    V('<Provocation: magique> ne détourne pas les coups physiques… mais les sorts, oui', Object.keys(prov.magPhys).length >= 2 && prov.magMag[prov.qui] === 30, JSON.stringify(prov.magPhys) + ' / ' + JSON.stringify(prov.magMag));
    V('un ennemi qui provoque : le seul visable (2 → 1)', prov.visablesSans === 2 && prov.visablesAvec.length === 1 && prov.visablesAvec[0] === 1, prov.visablesSans + ' → ' + JSON.stringify(prov.visablesAvec));

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ④ l\'overkill ──');
    var ok4 = await ev(function () {
        var A = $gameParty.members()[0], E = $gameTroop.members()[0], F = $gameTroop.members()[1], r = {};
        var exp0 = E.exp(), gold0 = E.gold();
        var gros = T.skill('', { damage: { type: 1, elementId: 0, formula: '' + (E.mhp * 2), variance: 0, critical: false } });
        E.setHp(10); T.frapper(A, E, gros); r.ok = [E._ctOverkill === true, E.exp(), exp0, E.gold(), gold0];
        var juste = T.skill('', { damage: { type: 1, elementId: 0, formula: '10', variance: 0, critical: false } });
        F.setHp(10); T.frapper(A, F, juste); r.juste = [F.isDead(), !!F._ctOverkill, F.exp()];
        var annonces = SceneManager._scene._spriteset;
        return r;
    });
    V('coup qui dépasse de 2× les PV max : OVERKILL, EXP et or ×1,5', ok4.ok[0] && ok4.ok[1] === Math.floor(ok4.ok[2] * 1.5) && ok4.ok[3] === Math.floor(ok4.ok[4] * 1.5), JSON.stringify(ok4.ok));
    V('contre-épreuve : achevé pile → pas d\'overkill, EXP normale', ok4.juste[0] && !ok4.juste[1], JSON.stringify(ok4.juste));
    await page.waitForTimeout(300);
    var ann = await ev(function () { return (SceneManager._scene._spriteset._ctAnnonces || []).map(function (s) { return s.texte; }); });
    V('« OVERKILL ! » flotte au-dessus de l\'ennemi', ann.indexOf('OVERKILL !') >= 0, JSON.stringify(ann.slice(0, 6)));
    await retour();

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ⑤ les compétences instantanées ──');
    await combat();
    var ins = await ev(function () {
        var r = {}, A = BattleManager.actor();
        var vite = T.skill('<Instantané>'), lent = T.skill('');
        r.base = A._actions.length;
        A.inputtingAction().setSkill(vite);
        BattleManager.selectNextCommand();
        r.apresVite = { meme: BattleManager.actor() === A, actions: A._actions.length, index: A._actionInputIndex };
        // il revient en arrière et choisit autre chose : l'action en plus disparaît
        BattleManager.selectPreviousCommand();
        A.inputtingAction().setSkill(lent);
        BattleManager.selectNextCommand();
        r.apresLent = { meme: BattleManager.actor() === A, actions: A._actions.length };
        var a1 = new Game_Action(A); a1.setSkill(vite); var a2 = new Game_Action(A); a2.setSkill(lent);
        r.vitesse = [a1.speed(), a2.speed()];
        return r;
    });
    V('<Instantané> : le même héros choisit encore (1 action → 2)', ins.apresVite.meme && ins.apresVite.actions === ins.base + 1 && ins.apresVite.index === 1, JSON.stringify(ins.apresVite));
    V('contre-épreuve : revenu en arrière, une compétence normale → plus d\'action en plus, on passe au suivant', !ins.apresLent.meme && ins.apresLent.actions === ins.base, JSON.stringify(ins.apresLent));
    V('l\'instantanée passe en premier', ins.vitesse[0] > ins.vitesse[1] + 1000, JSON.stringify(ins.vitesse));

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ⑥ les usages limités ──');
    var us = await ev(function () {
        var A = $gameParty.members()[0], r = {};
        var une = T.skill('<Usages: 1>'); A.learnSkill(une);
        r.avant = A.canUse($dataSkills[une]); A.useItem($dataSkills[une]); r.apres = A.canUse($dataSkills[une]);
        var w = new Window_SkillList(0, 0, 500, 300); w.setActor(A); w.refresh();
        r.id = une;
        return r;
    });
    V('<Usages: 1> : utilisable, puis plus du tout ce combat', us.avant && !us.apres, JSON.stringify(us));
    await retour();
    var us2 = await ev(function (id) { var A = $gameParty.members()[0]; return A.usagesRestants($dataSkills[id]); }, us.id);
    await combat();
    var us3 = await ev(function (id) { var A = $gameParty.members()[0]; return A.canUse($dataSkills[id]); }, us.id);
    V('le combat suivant, elle revient', us2 === 1 && us3, us2 + ' / ' + us3);

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ⑦ le vol ──');
    var vol = await ev(function () {
        var A = $gameParty.members()[0], E = $gameTroop.members()[0], F = $gameTroop.members()[1], r = {};
        var voler = T.skill('<Voler: +100%>', { damage: { type: 0, elementId: 0, formula: '0', variance: 0, critical: false } });
        var or0 = $gameParty.gold();
        T.frapper(A, E, voler); r.or = $gameParty.gold() - or0; r.attendu = Math.max(1, Math.floor(E.gold() * 0.5));
        or0 = $gameParty.gold(); T.frapper(A, E, voler); r.deux = $gameParty.gold() - or0;
        var note = $dataEnemies[F.enemyId()].note; $dataEnemies[F.enemyId()].note = note + '\n<Vol: o1 100%>';
        var n0 = $gameParty.numItems($dataItems[1]); T.frapper(A, F, voler); r.objet = $gameParty.numItems($dataItems[1]) - n0;
        $dataEnemies[F.enemyId()].note = note;
        return r;
    });
    V('le Slime n\'a pas de butin : on vole la moitié de son or', vol.or === vol.attendu, vol.or + ' / ' + vol.attendu);
    V('un ennemi ne se fait voler qu\'une fois', vol.deux === 0, vol.deux);
    V('<Vol: o1 100%> : on vole une Potion Rouge', vol.objet === 1, vol.objet);
    await page.waitForTimeout(300);
    var ann2 = await ev(function () { return (SceneManager._scene._spriteset._ctAnnonces || []).map(function (s) { return s.texte; }); });
    V('« Volé : … » et « Plus rien à voler » s\'affichent', ann2.some(function (t) { return /^Volé : /.test(t); }) && ann2.indexOf('Plus rien à voler') >= 0, JSON.stringify(ann2));
    await retour();

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ⑧ la difficulté ──');
    var dif = await ev(function () {
        var r = {};
        [1, 0, 2].forEach(function (d) { ConfigManager.difficulte = d; var e = new Game_Enemy(6, 0, 0); r[d] = [e.mhp, e.atk, e.def]; });
        ConfigManager.difficulte = 1;
        var w = new Window_Options(); var i = w.findSymbol('difficulte'); r.ligne = i >= 0 ? w.commandName(i) + ' : ' + w.statusText(i) : null;
        w.select(i); w.cursorRight(); r.droite = w.statusText(i); w.cursorRight(); r.butee = w.statusText(i);
        r.sauve = ConfigManager.makeData().difficulte; ConfigManager.difficulte = 1;
        T.cmd('DIFFICULTE facile'); r.cmd = ConfigManager.difficulte; T.cmd('DIFFICULTE normal');
        return r;
    });
    V('Normal ne change rien ; Facile : PV ×0,75, attaque ×0,8 ; Difficile ×1,3 et ×1,2 ; la défense ne bouge pas', dif[0][0] === Math.round(dif[1][0] * 0.75) && dif[2][0] === Math.round(dif[1][0] * 1.3) && dif[0][1] === Math.round(dif[1][1] * 0.8) && dif[2][1] === Math.round(dif[1][1] * 1.2) && dif[0][2] === dif[1][2], JSON.stringify(dif));
    V('l\'option « Difficulté » est dans le menu, bornée à Difficile, et sauvée', dif.ligne === 'Difficulté : Normal' && dif.droite === 'Difficile' && dif.butee === 'Difficile' && dif.sauve === 2, dif.ligne + ' → ' + dif.droite + ' → ' + dif.butee);
    V('DIFFICULTE facile', dif.cmd === 0, dif.cmd);

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ⑨ la maîtrise ──');
    await combat();
    var ma = await ev(function () {
        var A = $gameParty.members()[0], E = $gameTroop.members()[0], r = {};
        var feu = T.skill('', { damage: { type: 1, elementId: 0, formula: '100', variance: 0, critical: false } });
        var sans = T.skill('<Sans maîtrise>');
        function dmg(id) { var a = new Game_Action(A); a.setSkill(id); return a.makeDamageValue(E, false); }
        r.d0 = dmg(feu);
        for (var i = 0; i < 4; i++) A.useItem($dataSkills[feu]);
        r.n4 = A.niveauMaitrise(feu);
        A.useItem($dataSkills[feu]); r.n5 = A.niveauMaitrise(feu); r.d1 = dmg(feu);
        A.useItem($dataSkills[1]); A.useItem($dataSkills[1]); r.attaque = A.usagesMaitrise(1);
        for (i = 0; i < 6; i++) A.useItem($dataSkills[sans]); r.sans = A.niveauMaitrise(sans);
        A.learnSkill(feu);
        var w = new Window_SkillList(0, 0, 500, 400); w.setActor(A); w.setStypeId(1); w.refresh();
        r.dansListe = w._data.indexOf($dataSkills[feu]) >= 0;
        A.forgetSkill(feu);
        T.cmd('MAITRISE ' + A.actorId() + ' ' + feu + ' +100'); r.max = A.niveauMaitrise(feu);
        T.cmd('MAITRISE ' + A.actorId() + ' ' + feu + ' =0'); r.zero = A.niveauMaitrise(feu);
        r.st = JSON.parse(JSON.stringify(A.statsCombat()));
        return r;
    });
    V('4 usages : ★0 ; le 5e : ★1', ma.n4 === 0 && ma.n5 === 1, ma.n4 + ' → ' + ma.n5);
    V('★1 : +4 % de dégâts (100 → 104)', ma.d0 > 0 && ma.d1 === Math.round(ma.d0 * 1.04), ma.d0 + ' → ' + ma.d1);
    V('l\'Attaque ne compte pas ; <Sans maîtrise> non plus', ma.attaque === 0 && ma.sans === 0, JSON.stringify([ma.attaque, ma.sans]));
    V('MAITRISE +100 → ★5 ; =0 → ★0', ma.max === 5 && ma.zero === 0, ma.max + ' / ' + ma.zero);
    await page.waitForTimeout(300);
    var ann3 = await ev(function () { return (SceneManager._scene._spriteset._ctAnnonces || []).map(function (s) { return s.texte; }); });
    V('« Maîtrise ★1 — … » flotte au-dessus du héros', ann3.some(function (t) { return /^Maîtrise ★1/.test(t); }), JSON.stringify(ann3));

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n── ⑩ les statistiques ──');
    var st = await ev(function () {
        var A = $gameParty.members()[0], B = $gameParty.members()[1], E = $gameTroop.members()[0], r = {};
        var s0 = JSON.parse(JSON.stringify(A.statsCombat()));
        var c = T.skill('', { damage: { type: 1, elementId: 0, formula: '7', variance: 0, critical: false } });
        T.frapper(A, E, c);
        // un soin sans art : un soin est une Parole (LesTroisArts), et la Parole est hors des affinités de Vesper (×0,75)
        var soin = T.skill('<Art: aucun>', { damage: { type: 3, elementId: 0, formula: '20', variance: 0, critical: false }, scope: 7 });
        B.setHp(B.mhp - 50); T.frapper(A, B, soin);
        var tue = T.skill('', { damage: { type: 1, elementId: 0, formula: '999999', variance: 0, critical: false } });
        T.frapper(A, E, tue);
        var s1 = A.statsCombat();
        r.d = [s1.degats - s0.degats, s1.soins - s0.soins, s1.vaincus - s0.vaincus, s1.plusGros];
        r.g0 = JSON.parse(JSON.stringify($gameSystem.statsCombat()));
        return r;
    });
    V('dégâts +7 puis le coup fatal, soins +20, 1 vaincu', st.d[0] >= 7 && st.d[1] === 20 && st.d[2] === 1 && st.d[3] >= 7, JSON.stringify(st.d));
    await ev(function () { $gameTroop.members().forEach(function (e) { e.setHp(0); }); BattleManager.checkBattleEnd(); });
    var g1;
    for (var z = 0; z < 60 && !(await ev(function () { return SceneManager._scene instanceof Scene_Map; })); z++) { await page.keyboard.press('Enter'); await page.waitForTimeout(250); }
    await surLaCarte();
    g1 = await ev(function () { return JSON.parse(JSON.stringify($gameSystem.statsCombat())); });
    V('la victoire compte UNE fois, écran de victoire passé : combats +1, victoires +1', g1.victoires === st.g0.victoires + 1 && g1.combats === st.g0.combats + 1, JSON.stringify(st.g0) + ' → ' + JSON.stringify(g1));
    var fuite = await ev(function () { BattleManager.setup(2, true, true); BattleManager._escaped = true; BattleManager.endBattle(1); var a = JSON.parse(JSON.stringify($gameSystem.statsCombat())); BattleManager.setup(2, true, true); BattleManager._escaped = false; BattleManager.endBattle(1); var b = $gameSystem.statsCombat(); return [a.fuites, a.combats, b.fuites, b.combats]; });
    await page.waitForTimeout(500);
    V('une fuite compte ; un combat interrompu (sans fuite), non', fuite[0] === g1.fuites + 1 && fuite[2] === fuite[0] && fuite[3] === fuite[1], JSON.stringify(fuite));
    var menu = await ev(function () { var w = new Window_MenuCommand(0, 0); return w._list.map(function (c) { return c.name; }); });
    V('l\'entrée « Statistiques » est dans le menu', menu.indexOf('Statistiques') >= 0, menu.join(', '));
    await ev(function () { SceneManager.push(Scene_Statistiques); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Statistiques && !SceneManager.isSceneChanging(); }, null, { timeout: 30000 });
    await page.waitForTimeout(400);
    var page2 = await ev(function () { var f = SceneManager._scene._fenetre; return { ok: !!f, nb: $gameParty.allMembers().length }; });
    await page.screenshot({ path: __dirname + '/captures/statistiques.png' });
    V('l\'écran « Statistiques » s\'ouvre (capture : captures/statistiques.png)', page2.ok, JSON.stringify(page2));
    await page.keyboard.press('Escape');
    await surLaCarte();

    console.log('\n── le bilan ──');
    V('aucune erreur JavaScript', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(66) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
