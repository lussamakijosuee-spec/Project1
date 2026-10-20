/*
 * BANC NAVIGATEUR — LE LIVRE D'AËL (LaBibliothequeDAel.js v2.0, raccord CielDAel)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-19 : « Oui, écris tout comme listé : le livre de 3 pages,
 * la Parole lue (sans incantation, sans son prix), le Miracle derrière
 * l'interrupteur 27, Contrats et Portes gardés hors de la boucle, la ligne
 * dans les 8 ultimes. »
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. les réglages et les données (interrupteur 27, les 8 descriptions) ;
 *   2. le livre : une compétence de 1 à 20 PM écrit une page — pas l'Attaque,
 *      pas la Garde, rien de gratuit, pas un objet, pas plus de 20 PM (sans
 *      rien effacer) ; 3 pages au plus ; c'est le PRIX qui compte, pas qui
 *      paie (le Contrat) ; une Porte pas chère écrit ; l'écran le montre ;
 *   3. le Miracle éteint (interrupteur 27) : pas de Lecture, pas de branche ;
 *   4. le Miracle allumé : la Lecture, « elle perd le fil », la page du Miracle ;
 *   5. le livre est vide à chaque combat ;
 *   6. la Parole lue, dans un vrai combat laissé tourner : Celle Qu'on Ne Dit
 *      Qu'une Fois part tout de suite, sans Surcharge, au plein prix en PM ;
 *      Éclat de Conviction sans PV ni Doute — et sans livre, tout comme avant.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/le_livre_dael.js
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

    console.log('=== LE LIVRE D\'AËL ===\n');

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
            delete SceneManager._scene.update;      // la scène doit tourner pour se fermer (son fondu)
            BattleManager.endBattle(2); $gameParty.onBattleEnd(); $gameTroop.onBattleEnd();
            SceneManager.goto(Scene_Map);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(800);
    }

    // ── 1 · réglages et données ────────────────────────────────────────
    console.log('1) Les réglages et les données');
    var d = await page.evaluate(function () {
        var p = PluginManager.parameters('LaBibliothequeDAel');
        var lignes = [457, 819, 477, 820, 478, 1185, 479].filter(function (id) {
            return /\nLue dans son livre : part tout de suite, sans son prix\.$/.test($dataSkills[id].description);
        }).length;
        return { pages: p.pages, seuil: p.seuilPM, inter: p.interrupteurMiracle, nomInter: $dataSystem.switches[27],
                 lignes: lignes, l818: $dataSkills[818].description.split('\n').pop(), max: BibliothequeAel.pagesMax };
    });
    v('3 pages, petite Parole ≤ 20 PM, interrupteur 27', d.pages === '3' && d.seuil === '20' && d.inter === '27' && d.max === 3, JSON.stringify(d).slice(0, 120));
    v('l\'interrupteur 27 s\'appelle « Miracle d\'Aël »', d.nomInter === 'Miracle d\'Aël', d.nomInter);
    v('la ligne dans 7 ultimes…', d.lignes === 7, d.lignes + ' / 7');
    v('…et la Parole Originelle, qui garde son prix de lucidité : « part tout de suite »', d.l818 === 'Lue dans son livre : part tout de suite.', d.l818);

    await ouvrirCombat();
    await page.evaluate(function () {
        var SC = SceneManager._scene;
        window.__vraieMaj = SC.update;
        SC.update = function () { };
        window.__a = function () { return $gameActors.actor(4); };
        window.__agir = function (id, cible) {
            var a = __a(), act = new Game_Action(a); act.setSkill(id);
            act.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible));
            a._actions = [act];
            a.useItem(act.item()); act.apply(cible);
            return BibliothequeAel.pages();
        };
        $gameParty.members().forEach(function (x) { x.setMp(x.mmp); });
        $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); });
        $gameSwitches.setValue(27, false);
    });

    // ── 2 · le livre ───────────────────────────────────────────────────
    console.log('\n2) Le livre');
    var l = await page.evaluate(function () {
        var a = __a(), e = $gameTroop.members()[0], k = $gameActors.actor(2), r = {};
        r.depart = BibliothequeAel.pages();
        r.rayon = __agir(166, e);                  // Rayon Stellaire, 10 PM
        r.attaque = __agir(1, e);                  // l'Attaque
        r.garde = __agir(2, a);                    // la Garde
        r.gratuit = __agir(12, k);                 // Encouragement, 0 PM
        r.etau = __agir(1118, e);                  // Étau, 40 PM : rien, et rien d'effacé
        r.comete = __agir(170, e);                 // Comète, 20 PM tout juste
        r.couts = { rayon: a.skillMpCost($dataSkills[166]), etau: a.skillMpCost($dataSkills[1118]), comete: a.skillMpCost($dataSkills[170]) };
        r.ecran2 = SceneManager._scene._fenetreLecture.texte();
        r.voile = __agir(1273, e);                 // Porte — le Voile, 12 PM : une Porte écrit
        r.plein = __agir(166, e);                  // déjà plein : reste à 3
        r.ecran3 = SceneManager._scene._fenetreLecture.texte();
        // un objet n'écrit rien
        a._livreAel = 0;
        var obj = $dataItems.filter(function (i) { return i && i.name && i.occasion !== 3 && i.scope === 7; })[0];
        $gameParty.gainItem(obj, 1); a.useItem(obj); r.objet = BibliothequeAel.pages(); r.nomObjet = obj.name;
        // le Contrat : c'est le prix de la Parole qui compte, pas qui paie
        __agir(1279, k);
        r.partenaire = BibliothequeAel.partenaire() ? BibliothequeAel.partenaire().name() : null;
        var mpK = k.mp, mpA = a.mp;
        r.fermeture = __agir(1277, $gameTroop.members()[1] || e);   // 30 PM payés par Korrah
        r.paye = { korrah: mpK - k.mp, ael: mpA - a.mp };
        r.voileContrat = __agir(1273, e);          // 12 PM payés par Korrah : la Parole est petite
        $gameTroop.members().forEach(function (x) { x.appear(); x._porteRetour = 0; });
        k.removeState(237); a._contrat = null;
        return r;
    });
    v('le combat commence livre vide', l.depart === 0, String(l.depart));
    v('Rayon Stellaire (10 PM) écrit une page', l.rayon === 1, l.rayon + ' · coûts ' + JSON.stringify(l.couts));
    v('contre-épreuve : l\'Attaque, la Garde et une Parole gratuite n\'écrivent rien', l.attaque === 1 && l.garde === 1 && l.gratuit === 1);
    v('contre-épreuve : Étau (40 PM) n\'écrit rien, et n\'efface rien', l.etau === 1);
    v('Comète (20 PM tout juste) écrit', l.comete === 2);
    v('à l\'écran : 📖 ■■□', l.ecran2.indexOf('📖 ■■□') === 0, l.ecran2);
    v('une Porte pas chère écrit comme une petite Parole', l.voile === 3);
    v('trois pages au plus', l.plein === 3);
    v('à l\'écran : 📖 ■■■', l.ecran3.indexOf('📖 ■■■') === 0, l.ecran3);
    v('contre-épreuve : un objet n\'écrit rien', l.objet === 0, l.nomObjet);
    v('le Contrat lie Korrah, et paie toujours', l.partenaire === 'Korrah' && l.paye.ael === 0 && l.paye.korrah === 30, JSON.stringify(l.paye));
    v('…mais une Parole de 30 PM qu\'elle ne paie pas n\'écrit rien', l.fermeture === 0);
    v('…et une de 12 PM écrit, qui que ce soit qui paie', l.voileContrat === 1);

    // ── 3 · le Miracle éteint ──────────────────────────────────────────
    console.log('\n3) Le Miracle, tant que l\'histoire ne l\'a pas donné');
    var m0 = await page.evaluate(function () {
        var a = __a(), e = $gameTroop.members()[0], r = {};
        [1268, 1269, 1270, 1271, 1272].forEach(function (i) { a.forgetSkill(i); });
        $gameTemp._forceActionQueue = undefined; e._lectureAel = 0;
        r.ouvert = BibliothequeAel.miracleOuvert();
        r.types = a.addedSkillTypes();
        r.yinYang = a.isLearnedSkill(40);
        for (var i = 0; i < 4; i++) { __agir(166, e); }
        r.lecture = BibliothequeAel.lecture(e);
        r.appris = [1268, 1269, 1270, 1271, 1272].some(function (i) { return a.isLearnedSkill(i); });
        r.force = !!$gameTemp._forceActionQueue;
        e._lectureAel = 0.5; a._focusAel = 0;
        r.ecran = SceneManager._scene._fenetreLecture.texte();
        e._lectureAel = 0;
        return r;
    });
    v('interrupteur 27 éteint : le Miracle est fermé', m0.ouvert === false);
    v('la branche « miracle » est cachée, « portes » et « ult » restent', m0.types.indexOf(20) < 0 && m0.types.indexOf(23) >= 0 && m0.types.indexOf(3) >= 0, JSON.stringify(m0.types));
    v('…sans rien désapprendre (Yin et Yang du Mana est toujours sue)', m0.yinYang);
    v('quatre petites Paroles : pas de Lecture, pas de Miracle', m0.lecture === 0 && !m0.appris && !m0.force);
    v('l\'écran ne montre pas de Lecture', m0.ecran.indexOf('%') < 0, m0.ecran);

    // ── 4 · le Miracle allumé ──────────────────────────────────────────
    console.log('\n4) Le Miracle, après l\'événement');
    var m1 = await page.evaluate(function () {
        var a = __a(), e = $gameTroop.members()[0], r = {};
        $gameSwitches.setValue(27, true);
        r.types = a.addedSkillTypes().indexOf(20) >= 0;
        e._lectureAel = 0;
        __agir(166, e); r.l1 = BibliothequeAel.lecture(e);
        r.ecran = SceneManager._scene._fenetreLecture.texte();
        __agir(1118, e); r.l2 = BibliothequeAel.lecture(e);      // Étau, 40 PM : elle perd le fil
        $gameTemp._forceActionQueue = undefined;
        for (var i = 0; i < 4; i++) { __agir(166, e); }
        var t = BibliothequeAel.flecheContre(e);
        var q = $gameTemp._forceActionQueue ? $gameTemp._forceActionQueue.list[0].parameters : null;
        r.miracle = { appris: t ? a.isLearnedSkill(t.id) : null, nom: t ? $dataSkills[t.id].name : '(résiste à tout)', tire: q ? q[2] : null, attendu: t ? t.id : null };
        $gameTemp._forceActionQueue = undefined; a._miracleGratuit = false;
        [1268, 1269, 1270, 1271, 1272].forEach(function (i) { a.forgetSkill(i); });
        $gameSwitches.setValue(27, false);
        return r;
    });
    v('la branche « miracle » apparaît', m1.types);
    v('une petite Parole lit l\'ennemi : +25 %', Math.abs(m1.l1 - 0.25) < 1e-9, m1.ecran);
    v('une Parole de plus de 20 PM : elle perd le fil', m1.l2 === 0);
    v('quatre petites Paroles : la page du Miracle s\'écrit et part sur lui', m1.miracle.appris === true && m1.miracle.tire === m1.miracle.attendu, m1.miracle.nom);

    // ── 5 · le livre se vide à chaque combat ───────────────────────────
    console.log('\n5) Un combat neuf, un livre vide');
    await fermerCombat();
    var vide = await page.evaluate(function () {
        var a = __a(); a._livreAel = 2;
        BattleManager.setup(1, true, true);
        var n = BibliothequeAel.pages();
        BattleManager.endBattle(2); $gameParty.onBattleEnd(); $gameTroop.onBattleEnd();
        return n;
    });
    v('un livre entamé ne passe pas au combat suivant', vide === 0, String(vide));

    // ── 6 · la Parole lue, dans un vrai combat ─────────────────────────
    console.log('\n6) La Parole lue, dans un vrai combat laissé tourner');
    await page.evaluate(function () {
        Game_Actor.prototype.isAutoBattle = function () { return true; };
        var mk = Game_Actor.prototype.makeAutoBattleActions;
        Game_Actor.prototype.makeAutoBattleActions = function () {
            if (!window.__parole) { return mk.apply(this, arguments); }
            this.clearActions();
            var act = new Game_Action(this);
            if (this.actorId() === 4) { act.setSkill(window.__parole); act.setTarget(0); } else { act.setGuard(); }
            this.setAction(0, act);
        };
        // un témoin posé APRÈS LaBibliothequeDAel : il passe le premier
        var sa = BattleManager.startAction;
        BattleManager.startAction = function () {
            var s = this._subject;
            if (s && s.isActor() && s.actorId() === 4 && !window.__mesure) {
                if (window.__livrePlein) { s._livreAel = 3; }
                window.__mesure = { hp0: s.hp, mp0: s.mp, mhp: s.mhp, cout: s.skillMpCost($dataSkills[window.__parole]), coutPV: s.skillHpCost($dataSkills[window.__parole]),
                    ennemis0: $gameTroop.members().reduce(function (t, e) { return t + e.hp; }, 0), tour: $gameTroop.turnCount() };
            }
            return sa.apply(this, arguments);
        };
        var ea = BattleManager.endAction;
        BattleManager.endAction = function () {
            var s = this._subject;
            if (s && s.isActor() && s.actorId() === 4 && window.__mesure && !window.__mesure.fin) {
                window.__mesure.fin = { hp: s.hp, mp: s.mp, ennemis: $gameTroop.members().reduce(function (t, e) { return t + e.hp; }, 0),
                    lumiere: window.__lumiere || 0,
                    incante: !!s._incantation, etat227: s.isStateAffected(227), surcharge: s.isStateAffected(218),
                    doute: s.isStateAffected(193), pages: BibliothequeAel.pages(), tour: $gameTroop.turnCount() };
            }
            return ea.apply(this, arguments);
        };
        window.__journal = [];
        // ElementsVivants : une Parole de Lumière soigne une fois sur quatre l'allié le plus blessé —
        // Aël, qui vient de payer ses PV. Ce soin passe par addText ; on le compte pour juger le prix.
        var addText = Window_BattleLog.prototype.addText;
        Window_BattleLog.prototype.addText = function (t) {
            var m = /La Lumière révèle et répare Aël \(\+(\d+) PV\)/.exec(String(t));
            if (m && window.__mesure && !window.__mesure.fin) { window.__lumiere = (window.__lumiere || 0) + Number(m[1]); }
            return addText.apply(this, arguments);
        };
        // on écoute la file du journal (push), pas son affichage : il peut être encore en attente
        var push = Window_BattleLog.prototype.push;
        Window_BattleLog.prototype.push = function (nom, t) {
            if (nom === 'addText') { window.__journal.push(String(t).replace(/\\C\[\d+\]/g, '')); }
            return push.apply(this, arguments);
        };
    });

    async function essai(parole, plein) {
        await page.evaluate(function (o) { window.__parole = o.p; window.__livrePlein = o.plein; window.__mesure = null; window.__journal = []; window.__lumiere = 0; }, { p: parole, plein: plein });
        await ouvrirCombat();
        await page.evaluate(function () {
            $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); });
            $gameParty.members().forEach(function (a) { if (a.actorId() !== 6) { a.addParam(0, 9999999); } a.recoverAll(); });
            // la rupture (un coup ≥ 15 % de ses PV) ne doit pas fausser la contre-épreuve
            $gameTroop.members().forEach(function (e) { e.addParam(2, -e.atk + 1); e.addParam(4, -e.mat + 1); });
        });
        try {
            await page.waitForFunction(function () {
                var a = $gameActors.actor(4), m = window.__mesure;
                return (m && m.fin) || (m && a._incantation && $gameTroop.turnCount() > m.tour) || !$gameParty.inBattle();
            }, null, { timeout: 300000, polling: 300 });
        } catch (e) { }
        var r = await page.evaluate(function () {
            var a = $gameActors.actor(4);
            return { m: window.__mesure, incante: !!a._incantation || !!a._incantationRompue, etat227: a.isStateAffected(227),
                     journal: window.__journal.filter(function (t) { return /livre|commence|tient|achève/.test(t); }).slice(0, 4) };
        });
        await fermerCombat();
        return r;
    }

    var A = await essai(479, true);
    var fa = A.m && A.m.fin;
    v('livre plein : Celle Qu\'on Ne Dit Qu\'une Fois part au premier tour', !!fa && fa.tour === A.m.tour && fa.ennemis < A.m.ennemis0,
        fa ? 'tour ' + fa.tour + ', −' + (A.m.ennemis0 - fa.ennemis) + ' PV ennemis' : 'pas partie');
    v('…sans incantation', !!fa && !fa.incante && !fa.etat227);
    v('…sans Surcharge', !!fa && !fa.surcharge);
    v('…au plein prix en PM', !!fa && A.m.mp0 - fa.mp === A.m.cout, fa ? (A.m.mp0 - fa.mp) + ' / ' + A.m.cout + ' PM' : '');
    v('…et le livre se vide', !!fa && fa.pages === 0);
    v('le journal le dit au joueur', A.journal.some(function (t) { return /lit « [^»]*Celle Qu'on Ne Dit Qu'une Fois » dans son livre/.test(t); }), A.journal.join(' | '));

    var B = await essai(479, false);
    v('contre-épreuve, sans livre : elle l\'annonce et l\'incante, comme avant', B.incante && !(B.m && B.m.fin), B.journal.join(' | '));

    var C = await essai(457, true);
    var fc = C.m && C.m.fin;
    v('livre plein : Éclat de Conviction ne lui coûte pas de PV', !!fc && fc.hp === C.m.hp0, fc ? (C.m.hp0 - fc.hp) + ' PV' : 'pas parti');
    v('…ni Doute Paralysant', !!fc && !fc.doute);

    var D = await essai(457, false);
    var fd = D.m && D.m.fin;
    var perdu = fd ? D.m.hp0 - fd.hp + fd.lumiere : -1;
    v('contre-épreuve, sans livre : son prix en PV et Doute Paralysant, comme avant', !!fd && perdu > 0 && perdu === D.m.coutPV && fd.doute,
        perdu + ' PV payés pour un prix de ' + (D.m && D.m.coutPV) + (fd && fd.lumiere ? ' (puis ' + fd.lumiere + ' rendus par la Lumière)' : '') +
        ' · Doute ' + (fd && fd.doute));

    console.log('');
    v('aucune erreur JavaScript', err.length === 0, err.slice(0, 3).join(' | ') || 'rien');
    console.log('\n' + '='.repeat(72) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(72));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
