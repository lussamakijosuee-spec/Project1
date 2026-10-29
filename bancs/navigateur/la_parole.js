/*
 * BANC NAVIGATEUR — LA PAROLE (LaParole.js, ParolesSysteme « HerosSansRatage »)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-20 : « Pour les paroles, tu peux utiliser que le mana
 * positif » ; « Commence par la Parole : la phrase commune, les degrés, les
 * longues en fin de tour, mes 6 fusions par les Paroles de Fusion. »
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. qui est une Parole (mana positif seulement) et les degrés des échelles ;
 *      l'ancienne fusion par la somme (FusionElements v1.0) ne joue plus —
 *      depuis le 2026-10-29, FusionElements v2.0 fait les réactions sur la
 *      cible, pas de fusion dans l'air ; seules les 6 fusions de JOKO existent ;
 *   2. un héros ne rate plus en silence — un ennemi, si ;
 *   3. la phrase commune : posée, affichée, tenue jusqu'à la fin du tour suivant ;
 *   4. la Double : deux éléments si un autre est en suspens — pas sinon ;
 *   5. la Fusion : l'une des 6 paires, ×1,5 — pas une autre paire, pas une Simple ;
 *   6. le dernier degré ne se redit pas au tour suivant ; l'aide le dit ;
 *   7. un vrai combat : la Fusion de ludwing part en DERNIER et fond la Lumière
 *      d'Aël en Crépuscule ; brisée par un gros coup, elle part à moitié.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/la_parole.js
 */

var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var err = [];
    page.on('pageerror', function (e) { err.push(e.message.split('\n')[0]); });
    page.on('console', function (m) { if (m.type() === 'error' && !/Failed to load|net::ERR/.test(m.text())) { err.push('CONSOLE ' + m.text().slice(0, 150)); } });
    var ok = 0, ko = 0;
    var v = function (t, c, d) { if (c) { ok++; console.log('   OK  ' + t + (d ? '  — ' + d : '')); } else { ko++; console.log('   KO  ' + t + (d ? '  — ' + d : '')); } };

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen(); }, null, { timeout: 180000 });
    await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);

    console.log('=== LA PAROLE ===\n');

    async function ouvrirCombat() {
        await page.evaluate(function () {
            $gameParty.members().forEach(function (a) { a.recoverAll(); });
            BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(2500);
    }
    async function fermerCombat() {
        await page.evaluate(function () {
            delete SceneManager._scene.update;
            BattleManager.endBattle(2); $gameParty.onBattleEnd(); $gameTroop.onBattleEnd();
            SceneManager.goto(Scene_Map);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(800);
    }

    // ── 1 · qui est une Parole ─────────────────────────────────────────
    console.log('1) Qui est une Parole, et les degrés');
    var q = await page.evaluate(function () {
        var L = LaParole, r = {};
        var fe = $plugins.filter(function (p) { return p.name === 'FusionElements'; })[0];
        r.fusionElements = fe.status;
        r.fusionV2 = /^v2/.test(fe.description) && !!(window.Fusion && Fusion.reaction) && Fusion.enSuspens() === 0;
        r.degres = [1186, 1187, 1188, 1189, 1190, 1213, 1224].map(function (id) { return L.degre($dataSkills[id]); });
        r.paroles = { braise: L.estParole($dataSkills[1186]), rayon: L.estParole($dataSkills[166]), glace: L.estParole($dataSkills[1211]) };
        r.pasParoles = { encouragement: L.estParole($dataSkills[12]), failleNeg: L.estParole($dataSkills[153]), registre: L.estParole($dataSkills[1165]),
                         traitFoudroyant: L.estParole($dataSkills[1107]), attaque: L.estParole($dataSkills[1]) };
        r.longues = [1188, 1189, 1190].map(function (id) { return L.estLongue($dataSkills[id]); });
        r.fusions = { vapeur: L.fusionDe(8, 9), lave: L.fusionDe(11, 8), plante: L.fusionDe(9, 11), givre: L.fusionDe(13, 9), metal: L.fusionDe(12, 11), crepuscule: L.fusionDe(15, 14) };
        r.accidents = { feuFeu: L.fusionDe(8, 8), ventGlace: L.fusionDe(10, 13), feuLumiere: L.fusionDe(8, 14), ventFeu: L.fusionDe(10, 8) };
        return r;
    });
    v('l\'ancienne fusion par la somme ne joue plus (FusionElements éteint, ou sa v2.0 des réactions)', q.fusionElements === false || q.fusionV2);
    v('les degrés : simple, double, amplifiée, fusion, dernier', q.degres.slice(0, 5).join(',') === 'simple,double,amplifiee,fusion,dernier', q.degres.join(','));
    v('…aussi pour l\'échelle de Glace (Aiguille) et d\'Ombre (Nuit)', q.degres[5] === 'amplifiee' && q.degres[6] === 'fusion');
    v('Paroles : Feu — Braise, Rayon Stellaire (n°14), Glace — Givre', q.paroles.braise && q.paroles.rayon && q.paroles.glace);
    v('contre-épreuve : pas des Paroles — n°2, n°4, n°7, une Voie, l\'Attaque', !q.pasParoles.encouragement && !q.pasParoles.failleNeg && !q.pasParoles.registre && !q.pasParoles.traitFoudroyant && !q.pasParoles.attaque, JSON.stringify(q.pasParoles));
    v('longues : la Fusion et le dernier degré, pas l\'Amplifiée', !q.longues[0] && q.longues[1] && q.longues[2]);
    v('les 6 fusions de JOKO', q.fusions.vapeur === 17 && q.fusions.lave === 19 && q.fusions.plante === 20 && q.fusions.givre === 22 && q.fusions.metal === 23 && q.fusions.crepuscule === 29, JSON.stringify(q.fusions));
    v('contre-épreuve : plus d\'accidents (Feu+Feu, Vent+Glace, Feu+Lumière, Vent+Feu)', !q.accidents.feuFeu && !q.accidents.ventGlace && !q.accidents.feuLumiere && !q.accidents.ventFeu);

    await ouvrirCombat();
    await page.evaluate(function () {
        var SC = SceneManager._scene;
        SC.update = function () { };
        window.__agir = function (sujet, id, cible) {
            var act = new Game_Action(sujet); act.setSkill(id);
            act.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible));
            sujet._actions = [act];
            sujet.useItem(act.item()); cible.clearResult(); act.apply(cible);
            return act;
        };
        window.__journal = [];
        var push = Window_BattleLog.prototype.push;
        Window_BattleLog.prototype.push = function (nom, t) {
            if (nom === 'addText') { window.__journal.push(String(t).replace(/\\C\[\d+\]/g, '')); }
            return push.apply(this, arguments);
        };
        $gameParty.members().forEach(function (x) { x.setMp(x.mmp); });
        $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); });
        window.__alea = Math.random; Math.random = function () { return 0.5; };
    });

    // ── 2 · le ratage caché ────────────────────────────────────────────
    console.log('\n2) Plus de ratage caché pour les héros');
    var r2 = await page.evaluate(function () {
        var a = $gameActors.actor(4), e = $gameTroop.members()[0], r = {};
        var mat = a.mat; a.addParam(4, -mat + 1);
        var act = new Game_Action(a); act.setSkill(1219);          // Lumière — Aube, longue (L5)
        r.tenueCalculee = Paroles.tenue(a, $dataSkills[1219]);
        Math.random = function () { return 0.99; };
        act._resolveParole(); r.heros = act._paroleState;
        var ea = new Game_Action(e); ea.setSkill(1219);
        e.addParam(4, -e.mat + 1);
        ea._resolveParole(); r.ennemi = ea._paroleState;
        Math.random = function () { return 0.5; };
        a.addParam(4, mat - 1); e.recoverAll();
        return r;
    });
    v('un héros sans MAG, Parole L5 : elle tient quand même', r2.heros === 'ok', 'tenue calculée ' + Math.round(r2.tenueCalculee * 100) + ' %');
    v('contre-épreuve : un ennemi, lui, peut toujours rater', r2.ennemi === 'fail', r2.ennemi);

    // ── 3 · la phrase commune ──────────────────────────────────────────
    console.log('\n3) La phrase commune');
    var r3 = await page.evaluate(function () {
        var ves = $gameActors.actor(1), e = $gameTroop.members()[0], r = {};
        LaParole.poser(0);
        __agir(ves, 1186, e);                                      // Feu — Braise
        r.phrase = LaParole.phrase();
        r.ecran = SceneManager._scene._fenetrePhrase.texte();
        var t0 = $gameTroop._turnCount;
        $gameTroop._turnCount = t0 + 1; r.tourSuivant = !!LaParole.phrase();
        $gameTroop._turnCount = t0 + 2; r.apres = LaParole.phrase();
        $gameTroop._turnCount = t0;
        // une compétence qui n'est pas une Parole ne dit rien
        LaParole.poser(0); __agir($gameActors.actor(2), 1107, e); r.voie = LaParole.phrase();   // Trait Foudroyant (Voie)
        // seiryu ne récite pas : sa glace ne touche pas à la phrase
        LaParole.poser(14, 'Aël'); __agir($gameActors.actor(6), 1211, e); r.seiryu = LaParole.phrase(); LaParole.poser(0);
        return r;
    });
    v('Feu — Braise laisse Feu en suspens', r3.phrase && r3.phrase.el === 8 && r3.phrase.par === 'Vesper', JSON.stringify(r3.phrase));
    v('…à l\'écran', /En suspens : Feu \(Vesper\)/.test(r3.ecran), r3.ecran);
    v('…il tient au tour suivant', r3.tourSuivant);
    v('…et plus après', r3.apres === null);
    v('contre-épreuve : une capacité de Voie (Trait Foudroyant) ne dit rien', r3.voie === null);
    v('contre-épreuve : seiryu ne récite pas — Lumière reste en suspens', r3.seiryu && r3.seiryu.el === 14, JSON.stringify(r3.seiryu));

    // ── 4 · la Double ──────────────────────────────────────────────────
    // Depuis le 2026-10-22, LesTroisArts ajoute à toute Parole de héros son mana (le positif, 3) :
    // la phrase se lit sur les éléments fondamentaux, sans les manas (contrôlé dans les_trois_arts.js).
    await page.evaluate(function () { window.__sansMana = function (x) { return x < 2 || x > 7; }; });
    console.log('\n4) La Double : deux éléments');
    var r4 = await page.evaluate(function () {
        var ael = $gameActors.actor(4), e = $gameTroop.members()[0], r = {};
        LaParole.poser(8, 'Vesper'); __journal.length = 0;
        var act = __agir(ael, 1197, e);                            // Vent — Rafale (double)
        r.elements = act.getItemElements().filter(__sansMana); r.phrase = LaParole.phrase();
        r.journal = __journal.filter(function (t) { return /Double/.test(t); })[0] || '';
        LaParole.poser(10, 'Aël');
        act = __agir(ael, 1197, e);                                // même élément : rien
        r.meme = act.getItemElements().filter(__sansMana); r.phraseMeme = LaParole.phrase();
        LaParole.poser(0);
        act = __agir(ael, 1197, e);                                // rien en suspens
        r.vide = act.getItemElements().filter(__sansMana);
        return r;
    });
    v('avec Feu en suspens, Vent — Rafale frappe Vent ET Feu', JSON.stringify(r4.elements) === '[10,8]', JSON.stringify(r4.elements));
    v('…la phrase est complétée (refermée)', r4.phrase === null);
    v('…le journal le dit', /Double — Vent et Feu/.test(r4.journal), r4.journal);
    v('contre-épreuve : avec Vent en suspens, un seul élément', JSON.stringify(r4.meme) === '[10]' && r4.phraseMeme && r4.phraseMeme.el === 10);
    v('contre-épreuve : rien en suspens, un seul élément', JSON.stringify(r4.vide) === '[10]');

    // ── 5 · la Fusion ──────────────────────────────────────────────────
    console.log('\n5) La Fusion : les 6 paires');
    var r5 = await page.evaluate(function () {
        var lud = $gameActors.actor(3), ves = $gameActors.actor(1), e = $gameTroop.members()[0], r = {};
        // la valeur sans rien, pour le ×1,5
        LaParole.poser(0);
        var base = new Game_Action(lud); base.setSkill(1224); base._paroleDecidee = true;
        var v0 = base.makeDamageValue(e, false), t0 = e.elementRate(15);
        LaParole.poser(14, 'Aël'); __journal.length = 0;
        var act = __agir(lud, 1224, e);                            // Ombre — Nuit (fusion)
        r.elements = act.getItemElements().filter(__sansMana); r.mult = act._paroleMult; r.phrase = LaParole.phrase();
        var v1 = act.makeDamageValue(e, false), t1 = e.elementRate(29);
        r.ratio = (v1 / v0) / (t1 / t0);
        r.journal = __journal.filter(function (t) { return /FUSION/.test(t); })[0] || '';
        // une autre paire : rien
        LaParole.poser(10, 'Aël');
        act = __agir(lud, 1224, e); r.autre = act.getItemElements().filter(__sansMana); r.autrePhrase = LaParole.phrase();
        // une Simple ne fusionne pas, même avec la bonne paire
        LaParole.poser(9, 'Vesper');
        act = __agir(ves, 1186, e); r.simple = act.getItemElements().filter(__sansMana); r.simplePhrase = LaParole.phrase();
        LaParole.poser(0);
        return r;
    });
    v('Lumière en suspens + Ombre — Nuit (Fusion) = Crépuscule', JSON.stringify(r5.elements) === '[29]', JSON.stringify(r5.elements));
    v('…×1,5 (le taux du Crépuscule mis à part)', Math.abs(r5.mult - 1.5) < 1e-9 && Math.abs(r5.ratio - 1.5) < 0.02, 'mult ' + r5.mult + ' · ratio ' + r5.ratio.toFixed(3));
    v('…la phrase est complétée, le journal le dit', r5.phrase === null && /FUSION — Lumière \+ Ombre = Crépuscule/.test(r5.journal), r5.journal);
    v('contre-épreuve : Vent + Ombre n\'est pas une fusion — Ombre seule, et Ombre reste en suspens', JSON.stringify(r5.autre) === '[15]' && r5.autrePhrase && r5.autrePhrase.el === 15);
    v('contre-épreuve : une Simple (Feu — Braise) sur Eau ne fusionne pas', JSON.stringify(r5.simple) === '[8]' && r5.simplePhrase.el === 8);

    // ── 6 · le dernier degré ───────────────────────────────────────────
    console.log('\n6) Le dernier degré, et l\'aide');
    var r6 = await page.evaluate(function () {
        var ves = $gameActors.actor(1), lud = $gameActors.actor(3), e = $gameTroop.members()[0], r = {};
        // (les Paroles de Feu de Vesper ne se disent qu'en Style Garde : on prend celles de ludwing)
        lud._dernierDit = null; lud.setMp(lud.mmp);
        r.avant = lud.meetsSkillConditions($dataSkills[1225]);
        __agir(lud, 1225, e);                                      // Ombre — Fond (dernier degré)
        lud.setMp(lud.mmp);
        r.memeTour = lud.meetsSkillConditions($dataSkills[1225]);
        r.autre = lud.meetsSkillConditions($dataSkills[1221]);     // Ombre — Voile
        r.aideBloquee = LaParole.ligneAide(lud, $dataSkills[1225]);
        $gameTroop._turnCount += 1; r.ensuite = lud.meetsSkillConditions($dataSkills[1225]); $gameTroop._turnCount -= 1;
        lud._dernierDit = null;
        LaParole.poser(14, 'Aël');
        r.aideFusion = LaParole.ligneAide(lud, $dataSkills[1224]);
        LaParole.poser(0);
        // La ligne « ✦ En suspens » ne s'écrit sur rien : ni le Pacte, ni la Colère de Vesper, ni le livre d'Aël
        var sc = SceneManager._scene, fp = sc._fenetrePhrase;
        var bande = function (w) { return w ? [w.x + w.padding, w.y + w.padding + 8, w.x + w.width - w.padding, w.y + w.padding + 30] : null; };
        var inter = function (a, b) { return !!(a && b) && a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]; };
        var autour = function () { var p = bande(fp); return [sc._fenetrePacte, sc._fenetreColere, sc._fenetreLecture].map(function (w) { return inter(p, bande(w)); }); };
        r.fenetres = { existent: !!(fp && sc._fenetrePacte && sc._fenetreColere && sc._fenetreLecture), sur: autour(), dansEcran: fp.x + fp.width <= Graphics.boxWidth };
        var x0 = fp.x, y0 = fp.y; fp.x = sc._fenetrePacte.x; fp.y = sc._fenetrePacte.y;   // contre-épreuve : là où elle était avant
        r.fenetres.avant = autour(); fp.x = x0; fp.y = y0;
        return r;
    });
    v('Ombre — Fond (dernier degré) ne se redit pas au tour suivant', r6.avant === true && r6.memeTour === false, r6.aideBloquee.replace(/\\C\[\d+\]/g, ''));
    v('contre-épreuve : Ombre — Voile reste libre, et Fond revient après', r6.autre === true && r6.ensuite === true, JSON.stringify({ voile: r6.autre, ensuite: r6.ensuite }));
    v('l\'aide d\'une Fusion dit ce qu\'elle fera', /Fusion : avec Lumière en suspens → Crépuscule ×1\.5\. Longue/.test(r6.aideFusion), r6.aideFusion.replace(/\\C\[\d+\]/g, ''));
    v('« ✦ En suspens » ne s\'écrit ni sur le Pacte, ni sur la Colère, ni sur le livre, et tient dans l\'écran', r6.fenetres.existent && r6.fenetres.sur.every(function (x) { return !x; }) && r6.fenetres.dansEcran, JSON.stringify(r6.fenetres));
    v('…contre-épreuve : à son ancienne place, elle tombait sur le Pacte', r6.fenetres.avant[0] === true);

    await page.evaluate(function () { Math.random = window.__alea; });
    await fermerCombat();

    // ── 7 · un vrai combat ─────────────────────────────────────────────
    console.log('\n7) Un vrai combat, laissé tourner');
    await page.evaluate(function () {
        Game_Actor.prototype.isAutoBattle = function () { return true; };
        var mk = Game_Actor.prototype.makeAutoBattleActions;
        Game_Actor.prototype.makeAutoBattleActions = function () {
            if (this.actorId() === 6) { return mk.apply(this, arguments); }
            this.clearActions();
            var act = new Game_Action(this);
            if (this.actorId() === 3) { act.setSkill(1224); act.setTarget(0); }          // ludwing : Ombre — Nuit (fusion, longue)
            else if (this.actorId() === 4) { act.setSkill(1216); act.setTarget(0); }     // Aël : Lumière — Lueur (simple)
            else { act.setGuard(); }
            this.setAction(0, act);
        };
        window.__ordre = [];
        var sa = BattleManager.startAction;
        BattleManager.startAction = function () {
            var s = this._subject;
            if ($gameTroop.turnCount() === 1 && s) {
                window.__ordre.push(s.isActor() ? s.name() : 'ennemi');
                if (s.isActor() && s.actorId() === 3) { window.__etat227 = SceneManager._scene._fenetrePhrase.texte(); }
            }
            return sa.apply(this, arguments);
        };
        var ap = Game_Action.prototype.apply;
        Game_Action.prototype.apply = function (target) {
            var r = ap.apply(this, arguments);
            var s = this.subject();
            if (s && s.isActor && s.isActor() && s.actorId() === 3 && this.item() && this.item().id === 1224 && !window.__lud) {
                window.__lud = { elements: this.getItemElements().filter(__sansMana), mult: this._paroleMult };
            }
            return r;
        };
        var st = BattleManager.startTurn;
        BattleManager.startTurn = function () {
            var res = st.apply(this, arguments);
            if (window.__coup && $gameTroop.turnCount() === 1) {
                var l = $gameActors.actor(3), act = new Game_Action($gameTroop.members()[0]); act.setAttack();
                l.clearResult(); act.executeDamage(l, Math.ceil(l.mhp * 0.2));
            }
            return res;
        };
        var ea = BattleManager.endAction;
        BattleManager.endAction = function () {
            var s = this._subject, r = ea.apply(this, arguments);
            if (s && s.isActor() && s.actorId() === 3 && !window.__fin) { window.__fin = { ecran: SceneManager._scene._fenetrePhrase.texte(), fragile: s.isStateAffected(227) }; }
            return r;
        };
        window.__journal = [];
    });
    async function essai(coup) {
        await page.evaluate(function (c) { window.__coup = c; window.__lud = null; window.__fin = null; window.__ordre = []; window.__journal = []; window.__etat227 = null; }, coup);
        await ouvrirCombat();
        await page.evaluate(function () {
            $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); e.addParam(2, -e.atk + 1); e.addParam(4, -e.mat + 1); });
            $gameParty.members().forEach(function (a) { a.recoverAll(); });
        });
        try {
            await page.waitForFunction(function () { return !!window.__fin || !$gameParty.inBattle(); }, null, { timeout: 300000, polling: 300 });
        } catch (e) { }
        var r = await page.evaluate(function () {
            return { ordre: window.__ordre, lud: window.__lud, fin: window.__fin, etat227: window.__etat227,
                     journal: window.__journal.filter(function (t) { return /commence|FUSION|perd le fil/.test(t); }) };
        });
        await fermerCombat();
        return r;
    }
    var A = await essai(false);
    v('ludwing, qui tient une Fusion, joue en DERNIER au tour 1', A.ordre.length > 1 && A.ordre[A.ordre.length - 1] === 'ludwing', A.ordre.join(' → '));
    v('…il l\'annonce au début du tour, et l\'écran montre 🌀 ludwing', /🌀 ludwing/.test(A.etat227 || '') && A.journal.some(function (t) { return /ludwing commence « .*Nuit »/.test(t); }), (A.etat227 || '') + ' | ' + (A.journal[0] || ''));
    v('…et sa Nuit fond la Lumière d\'Aël en Crépuscule, ×1,5', !!A.lud && JSON.stringify(A.lud.elements) === '[29]' && A.lud.mult === 1.5, JSON.stringify(A.lud));
    v('…le 🌀 disparaît quand elle est partie, sans état qui fragilise (227)', !!A.fin && !/🌀 ludwing/.test(A.fin.ecran) && A.fin.fragile === false, A.fin ? A.fin.ecran : '');
    var B = await essai(true);
    v('un coup de 20 % de ses PV : elle se brise, et part à moitié', !!B.lud && Math.abs(B.lud.mult - 0.75) < 1e-9 && B.journal.some(function (t) { return /perd le fil/.test(t); }),
        (B.lud ? 'mult ' + B.lud.mult + ' (0,5 × 1,5)' : 'pas partie') + ' · ' + B.journal.filter(function (t) { return /perd le fil/.test(t); }).join(''));

    console.log('');
    v('aucune erreur JavaScript', err.length === 0, err.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(72) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(72));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
