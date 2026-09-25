/*
 * BANC NAVIGATEUR — L'AVATAR OBÉIT, ET IL APPREND
 * ---------------------------------------------------------------------------
 * JOKO : « les ordres que je donne à Avatar, eh ben, il n'y a pas d'ordre.
 * Si je veux donner un ordre pour qu'il protège quelqu'un, il va protéger
 * personne. Si je donne un ordre pour qu'il attaque, il va attaquer personne. »
 *
 * On ne lit pas le code : on JOUE des tours de combat entiers, et on compte
 * qui a frappé qui, et combien. Chaque coup porté pendant le banc est noté
 * (auteur, cible, dégâts) au moment où le moteur l'applique.
 *
 * Les contre-épreuves (§6) :
 *   · un ordre donné par Korrah ne doit PAS faire de dégâts de Korrah ;
 *   · sans l'aile, un coup sur l'allié le touche LUI, pas seiryu ;
 *   · Sauvage, il n'obéit pas toujours — mais il obéit parfois.
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

var vert = 0, rouge = 0;
function ok(nom, cond, detail) {
    if (cond) { vert++; console.log('   ✓ ' + nom + (detail ? '   ' + detail : '')); }
    else { rouge++; console.log('   ✗ ' + nom + (detail ? '   ' + detail : '')); }
}

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.split('\n')[0]); });

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen(); }, null, { timeout: 180000 });
    await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.evaluate(function () {
        [1, 2, 3, 4].forEach(function (id) { if (!$gameParty.members().some(function (m) { return m.actorId() === id; })) { $gameParty.addActor(id); } });
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        Seiryu.experience(Seiryu.seuils.dresse);                // ② DRESSÉ pour les ordres
        BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(3000);

    // Le carnet des coups, et de quoi jouer un tour entier.
    await page.evaluate(function () {
        window.__coups = [];
        var vrai = Game_Action.prototype.executeHpDamage;
        Game_Action.prototype.executeHpDamage = function (target, value) {
            var u = this.subject();
            window.__coups.push({ qui: u ? u.name() : '?', quiId: u && u.isActor() ? u.actorId() : -1,
                cible: target.name(), cibleId: target.isActor() ? target.actorId() : -1, v: value,
                skill: this.item() ? this.item().id : 0 });
            return vrai.call(this, target, value);
        };
        // Qui est VISÉ par un ennemi — après la substitution, avant le jet de
        // touche. Un coup raté compte quand même : c'est la redirection qu'on
        // mesure, pas la chance.
        window.__vises = [];
        var vraiApply = Game_Action.prototype.apply;
        Game_Action.prototype.apply = function (target) {
            var u = this.subject();
            if (u && u.isEnemy && u.isEnemy()) { window.__vises.push(target.isActor() ? target.actorId() : -1); }
            return vraiApply.call(this, target);
        };
        // Les ennemis ne doivent pas tuer le groupe pendant qu'on mesure : on
        // leur pose une action choisie à chaque tour (voir window.__ennemi).
        window.__ennemi = null;
        var mk = Game_Enemy.prototype.makeActions;
        Game_Enemy.prototype.makeActions = function () {
            mk.call(this);
            if (!window.__ennemi) { this.clearActions(); return; }  // ils ne font rien
            var a = new Game_Action(this); a.setSkill(window.__ennemi.skill); a.setTarget(window.__ennemi.cible);
            this._actions = [a];
        };
        // Des PV de sac de sable, pour que rien ne meure au milieu du banc.
        $gameTroop.members().forEach(function (e) { e._paramPlus[0] += 9999999; e.setHp(e.mhp); });
        window.__tour = function (ordreKorrah) {
            window.__coups.length = 0;
            window.__vises.length = 0;
            $gameParty.members().forEach(function (a) {
                a.clearActions();
                if (a.actorId() === 6) { a.makeActions(); return; }  // seiryu décide seul
                var act = new Game_Action(a);
                if (a.actorId() === 2 && ordreKorrah) { act.setSkill(ordreKorrah.skill); act.setTarget(ordreKorrah.cible); }
                else { act.setGuard(); }
                a._actions = [act];
            });
            // ⚠ Scene_Battle n'appelle BattleManager.update() QUE si aucune
            //   fenêtre de saisie n'est active. Lancer le tour pendant que la
            //   fenêtre de commande attend Vesper le gèle pour toujours — et
            //   endCommandSelection() ne suffit pas : BattleManager.actor()
            //   désigne encore Vesper, et la fenêtre se rouvre.
            var sc = SceneManager._scene;
            BattleManager.startTurn();
            BattleManager._actorIndex = -1;
            [sc._actorCommandWindow, sc._partyCommandWindow].forEach(function (w) { w.deactivate(); w.close(); });
            sc._statusWindow.deselect();
        };
    });
    async function jouer(ordre) {
        var t0 = await page.evaluate(function () { return $gameTroop.turnCount(); });
        await page.evaluate(function (o) { window.__tour(o); }, ordre);
        await page.waitForFunction(function (t) {
            return BattleManager._phase === 'input' && $gameTroop.turnCount() > t
                && !BattleManager.isBusy() && !$gameTemp._forceActionQueue;
        }, t0, { timeout: 120000 }).catch(function () { });
        await page.waitForTimeout(400);
        return page.evaluate(function () { var c = window.__coups.slice(); c.vises = window.__vises.slice(); return { coups: c, vises: window.__vises.slice() }; });
    }

    console.log('\n── LA DONNÉE ' + '─'.repeat(60));
    var d = await page.evaluate(function () {
        var k = $gameActors.actor(2);
        return {
            ids: [1255, 1256, 1257, 1258, 1263, 1264].map(function (i) { return { id: i, n: $dataSkills[i].name, t: $dataSkills[i].stypeId, appris: k.isLearnedSkill(i) }; }),
            present: Seiryu.present(), palier: Seiryu.palier()
        };
    });
    ok('seiryu est au combat, palier ② Dressé', d.present && d.palier === 2);
    ok('les six ordres sont dans la branche « avatar » de Korrah',
        d.ids.every(function (x) { return x.t === 21 && x.appris; }), d.ids.map(function (x) { return x.n.replace('Avatar — ', ''); }).join(' · '));

    console.log('\n── « VISE ÇA » — il attaque, et c\'est lui qui frappe ' + '─'.repeat(20));
    var c1 = (await jouer({ skill: 1255, cible: 0 })).coups;
    var seiryuFrappe = c1.filter(function (c) { return c.quiId === 6 && c.skill === 1249 && c.v > 0; });
    var korrahFrappe = c1.filter(function (c) { return c.quiId === 2 && c.v > 0; });
    ok('seiryu lance « Poings Enchaînés » sur l\'ennemi visé', seiryuFrappe.length > 0,
        seiryuFrappe.map(function (c) { return c.cible + ' −' + c.v; }).join(', '));
    ok('Korrah ne frappe pas elle-même (contre-épreuve)', korrahFrappe.length === 0);

    console.log('\n── « ÉTAU DE L\'ARMURE » lancée par Korrah = un ordre ' + '─'.repeat(19));
    var c2 = (await jouer({ skill: 1251, cible: 0 })).coups;
    var etauS = c2.filter(function (c) { return c.quiId === 6 && c.skill === 1251; });
    var etauK = c2.filter(function (c) { return c.quiId === 2 && c.skill === 1251; });
    ok('c\'est seiryu qui serre l\'étau', etauS.length > 0, etauS.map(function (c) { return '−' + c.v; }).join(', '));
    ok('pas Korrah', etauK.length === 0);

    console.log('\n── « PROTÈGE-LE » — il prend les coups à sa place ' + '─'.repeat(22));
    var ael = await page.evaluate(function () { return $gameParty.members().indexOf($gameActors.actor(4)); });
    // ⚠ On NE laisse PAS jouer le tour des ennemis : YEP_BattleAICore refait
    //   leur choix de cible au moment d'agir, et la première version de ce
    //   contrôle mesurait l'IA de la chauve-souris, pas l'aile. On passe par
    //   le chemin exact du moteur : BattleManager.invokeNormalAction, qui
    //   appelle applySubstitute puis apply sur la VRAIE cible.
    function viser() {
        return page.evaluate(function () {
            var e = $gameTroop.aliveMembers()[0], ael = $gameActors.actor(4), vises = [];
            for (var n = 0; n < 10; n++) {
                var act = new Game_Action(e); act.setAttack();
                act.setTarget($gameParty.members().indexOf(ael));
                BattleManager._subject = e; BattleManager._action = act;
                window.__vises.length = 0;
                BattleManager.invokeNormalAction(e, ael);
                vises = vises.concat(window.__vises);
            }
            ael.setHp(ael.mhp); $gameActors.actor(6).setHp($gameActors.actor(6).mhp);
            return vises;
        });
    }
    var sans = await viser();
    ok('sans l\'aile, les 10 coups visent Aël (contre-épreuve)', sans.filter(function (x) { return x === 4; }).length === 10,
        'Aël ' + sans.filter(function (x) { return x === 4; }).length + ' · seiryu ' + sans.filter(function (x) { return x === 6; }).length);
    await jouer({ skill: 1263, cible: ael });
    var aile = await page.evaluate(function () { return $gameActors.actor(4).isStateAffected(232); });
    ok('Aël passe sous l\'aile de seiryu', aile);
    var avec = await viser();
    ok('avec l\'aile, les 10 coups vont sur seiryu', avec.filter(function (x) { return x === 6; }).length === 10,
        'seiryu ' + avec.filter(function (x) { return x === 6; }).length + ' · Aël ' + avec.filter(function (x) { return x === 4; }).length);
    await page.evaluate(function () { $gameActors.actor(4).removeState(232); });

    console.log('\n── « SOIGNE-LE » ' + '─'.repeat(56));
    var s1 = await page.evaluate(function () { var a = $gameActors.actor(4); a.setHp(Math.floor(a.mhp * 0.5)); return a.hp; });
    await jouer({ skill: 1264, cible: ael });
    var s2 = await page.evaluate(function () { return $gameActors.actor(4).hp; });
    ok('seiryu soigne Aël', s2 > s1, s1 + ' → ' + s2 + ' PV');

    console.log('\n── LE BON ALLIÉ, MÊME QUAND UN AUTRE EST À TERRE ' + '─'.repeat(23));
    var idx = await page.evaluate(function () {
        var v = $gameActors.actor(1), a = $gameActors.actor(4);
        v.addState(v.deathStateId());                     // Vesper, en tête du groupe, tombe
        a.setHp(Math.floor(a.mhp * 0.1));                 // Aël est en urgence
        var s = $gameActors.actor(6); s.setMp(s.mmp);
        s.makeActions();
        var act = s.action(0);
        var t = act ? act.makeTargets() : [];
        var r = { skill: act ? act.item().id : 0, cible: t[0] ? t[0].name() : null };
        v.removeState(v.deathStateId()); v.setHp(v.mhp); a.setHp(a.mhp);
        return r;
    });
    ok('seiryu soigne Aël, pas un autre', idx.skill === 1259 && idx.cible === 'Aël', '#' + idx.skill + ' sur ' + idx.cible);

    console.log('\n── ① SAUVAGE : il obéit… parfois ' + '─'.repeat(40));
    var sauv = await page.evaluate(function () {
        Seiryu.experience(0);
        var k = $gameActors.actor(2), e = $gameTroop.members()[0], obeis = 0, N = 400;
        for (var i = 0; i < N; i++) {
            // ⚠ Chaque ordre suivi lui rapporte de l'expérience : sans remise à
            //   zéro, il passe Dressé au milieu de la mesure (première version :
            //   « 60 % » au lieu de 25). Le système apprend ; le banc doit figer.
            Seiryu.experience(0);
            $gameTemp._forceActionQueue = undefined;
            var act = new Game_Action(k); act.setSkill(1255); act.apply(e);
            if ($gameTemp._forceActionQueue && $gameTemp._forceActionQueue.list.length) { obeis++; }
        }
        $gameTemp._forceActionQueue = undefined;
        Seiryu.experience(0);
        // ⚠ 400 ordres en une image = ~700 lignes empilées dans le journal de
        //   combat, qui les rejoue ensuite une par une et gèle le tour suivant.
        //   En jeu, c'est un ordre par action : on vide la file.
        var w = SceneManager._scene._logWindow; w._methods = []; w._waitCount = 0; w.clear();
        return { taux: obeis / N, palier: Seiryu.palier() };
    });
    ok('palier ① Sauvage', sauv.palier === 1);
    ok('il obéit environ une fois sur quatre', sauv.taux > 0.15 && sauv.taux < 0.35, Math.round(sauv.taux * 100) + ' %');

    console.log('\n── ③ LIÉ : il se souvient, et il désobéit pour de bonnes raisons ' + '─'.repeat(8));
    var lie = await page.evaluate(function () {
        Seiryu.experience(Seiryu.seuils.lie);
        var m = Seiryu.memoire(), out = { palier: Seiryu.palier() };
        out.dangerConnu = Object.keys(m.danger).length;
        out.coupsConnus = Object.keys(m.efficacite).length;
        out.protections = m.protections[4] || 0;
        // urgence : Aël tombe, Korrah ordonne de frapper → il soigne
        var a = $gameActors.actor(4); a.setHp(Math.floor(a.mhp * 0.1));
        $gameTemp._forceActionQueue = undefined;
        var k = $gameActors.actor(2), act = new Game_Action(k); act.setSkill(1255); act.apply($gameTroop.members()[0]);
        var q = $gameTemp._forceActionQueue ? $gameTemp._forceActionQueue.list[0].parameters : null;
        out.refus = q ? q[2] : null;
        $gameTemp._forceActionQueue = undefined;
        a.setHp(a.mhp);
        var w = SceneManager._scene._logWindow; w._methods = []; w._waitCount = 0; w.clear();
        return out;
    });
    ok('palier ③ Lié', lie.palier === 3);
    ok('il a retenu qui fait mal au groupe', lie.dangerConnu > 0, lie.dangerConnu + ' type(s) d\'ennemi');
    ok('il a retenu ce que valent ses coups', lie.coupsConnus > 0, lie.coupsConnus + ' type(s) d\'ennemi');
    ok('il a retenu qui Korrah lui fait protéger', lie.protections >= 2, 'Aël : ' + lie.protections + ' ordres');
    ok('Aël en urgence : « pas maintenant » — il soigne au lieu de frapper', lie.refus === 1259, 'action forcée #' + lie.refus);

    console.log('\n── L\'EXPÉRIENCE MONTE EN JOUANT ' + '─'.repeat(41));
    var xp0 = await page.evaluate(function () { Seiryu.experience(10); return Seiryu.experience(); });
    await jouer(null);
    var xp1 = await page.evaluate(function () { return { xp: Seiryu.experience(), ph: BattleManager._phase, t: $gameTroop.turnCount() }; });
    ok('un tour vécu ensemble = de l\'expérience', xp1.xp > xp0, xp0 + ' → ' + xp1.xp + '  (phase ' + xp1.ph + ', tour ' + xp1.t + ')');

    // ⚠ Le bug trouvé par ce banc : l'écran de victoire de Yanfly rappelle
    //   processVictory à chaque image. +3 doit tomber UNE fois par combat.
    var vic = await page.evaluate(function () {
        var avant = Seiryu.experience();
        var vrai = BattleManager.processVictory;
        // on n'ouvre pas l'écran de victoire pour de vrai : on compte ce que
        // le greffon paie quand le moteur l'appelle en boucle
        var fin = Scene_Battle.prototype.terminate;
        for (var i = 0; i < 50; i++) { try { vrai.call(BattleManager); } catch (e) { } }
        return { avant: avant, apres: Seiryu.experience() };
    });
    ok('une victoire = +3, même si le moteur la rappelle 50 fois', vic.apres - vic.avant === 3,
        vic.avant + ' → ' + vic.apres);

    console.log('\n── LES ERREURS DU MOTEUR ' + '─'.repeat(48));
    ok('rien n\'a planté', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));

    console.log('\n' + '═'.repeat(74) + '\n   ' + vert + ' vert · ' + rouge + ' rouge\n' + '═'.repeat(74) + '\n');
    await nav.close();
    process.exit(rouge ? 1 : 0);
})();
