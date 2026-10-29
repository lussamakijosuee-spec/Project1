/*
 * BANC NAVIGATEUR — L'ÉQUIPE COMPLÈTE, À CHAQUE NIVEAU
 * ---------------------------------------------------------------------------
 * JOKO : « montre ce que ça donne quand ils sont tous ensemble en combat, à
 * chaque niveau, dégâts, vitesse — et adapte les combats en fonction. »
 *
 * Ce banc ne lit aucune formule : il JOUE des combats dans le moteur.
 *
 *   · les vraies troupes du jeu, rangées par le rang de leur ennemi le plus
 *     fort (D, C, B, A, S) ; les boss à mécaniques à part ;
 *   · l'IA réelle des ennemis (YEP_BattleAICore choisit au moment d'agir) ;
 *   · le vrai chemin du moteur : BattleManager.startTurn (qui fait battre
 *     les mécaniques de boss), invokeAction (substitution, contre, reflet),
 *     les actions forcées (ordres à seiryu, Flèches du Miracle), endTurn
 *     (états, recharges, retour des Portes) ;
 *   · seul ce qui est visuel est sauté : animations, attentes, popups.
 *
 * Les héros jouent comme un joueur raisonnable — pas un joueur parfait :
 *   · Vesper (depuis le 2026-10-14, LesStylesDeVesper) : en Sang elle marque,
 *     absorbe, converge et rend le sang ; en Garde elle relâche l'Arme de Sang
 *     avant que l'armure cède ; sous 20 % elle entre dans le Flow (Lame, deux
 *     actions par tour) ; en Rage elle passe en Sang pour le Berserker.
 *     VESPER_STYLE=lame|sang|garde fige le Style qu'elle préfère (auto sinon) ;
 *   · Aël passe un Contrat, voile un groupe, ferme une Porte sur le plus
 *     dangereux, puis lance ses Paroles aux frais de son partenaire — et tire
 *     la Flèche que le Miracle lui a donnée ;
 *   · Korrah et ludwing frappent avec ce qui fait le plus mal, soignent qui
 *     tombe ; seiryu décide seul (son palier du Lien suit la campagne) ;
 *   · personne ne lance ce que l'écran déconseille : magie sur un 🪞 Reflet,
 *     Parole dont l'aide annonce la tenue sous 50 %, coup qui laisserait le
 *     lanceur sous 30 % de ses PV, cible dont « le Renvoi est prêt ».
 * Les pages de la troupe (PHASE II, PHASE III, Posture de Fer…) sont jouées là
 * où MV les joue : avant le premier tour, entre deux actions, en fin de tour.
 *
 * L'équipement suit la progression : à chaque niveau, le meilleur de ce que le
 * Marchand vend au palier correspondant.
 *
 * Les niveaux conseillés par rang viennent du projet (ChasseAuxPrimes) :
 *   D : 1 · C : 12 · B : 28 · A : 45 · S : 60.
 *
 *   ETT_URL=http://127.0.0.1:8899 node bancs/navigateur/lequipe_a_chaque_niveau.js
 *   → écrit bancs/navigateur/mesures_equipe.json
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var SORTIE = process.env.SORTIE || path.join(__dirname, 'mesures_equipe.json');
var PAR_TROUPE = parseInt(process.env.PAR_TROUPE || '2', 10);
var TROUPES = parseInt(process.env.TROUPES || '8', 10);

/** Les troupes que le jeu pose : rencontres des cartes, « Traitement du combat » direct des événements et des événements communs. */
function troupesDuJeu() {
    var data = path.join(__dirname, '..', '..', 'data'), vus = {};
    function lire(f) { return JSON.parse(fs.readFileSync(path.join(data, f), 'utf8')); }
    function scan(list) { (list || []).forEach(function (c) { if (c.code === 301 && c.parameters[0] === 0) { vus[c.parameters[1]] = 1; } }); }
    lire('MapInfos.json').forEach(function (m) {
        var f = m && 'Map' + String(m.id).padStart(3, '0') + '.json';
        if (!f || !fs.existsSync(path.join(data, f))) { return; }
        var M = lire(f);
        (M.encounterList || []).forEach(function (e) { vus[e.troopId] = 1; });
        (M.events || []).forEach(function (ev) { if (ev) { ev.pages.forEach(function (p) { scan(p.list); }); } });
    });
    lire('CommonEvents.json').forEach(function (ce) { if (ce) { scan(ce.list); } });
    return Object.keys(vus).map(Number);
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
    await page.evaluate(function (seul) {
        [1, 2, 3, 4].forEach(function (id) { if (!$gameParty.members().some(function (m) { return m.actorId() === id; })) { $gameParty.addActor(id); } });
        // SEUL=n : un seul héros, comme au début du jeu (DebutMarques n'en donne qu'un) ; seiryu entre avec Korrah
        if (seul) { [1, 2, 3, 4, 6].forEach(function (id) { if (id !== seul) { $gameParty.removeActor(id); } }); }
        BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
    }, parseInt(process.env.SEUL || '0', 10));
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 180000 });
    await page.waitForTimeout(2500);

    // ═════════════════════════════════════════════════════════════════════
    // Le simulateur, installé une fois dans la page
    // ═════════════════════════════════════════════════════════════════════
    await page.evaluate(function () {
        var SC = SceneManager._scene;
        // Plus rien ne se dessine : le moteur n'attend plus personne. Ce que
        // cette ligne saute est VISUEL, rien d'autre.
        SC.update = function () { };
        Window_BattleLog.prototype.push = function () { };

        var NIV_RANG = { D: 1, C: 12, B: 28, A: 45, S: 60 };
        function rangDe(e) { var m = /<\s*Rang\s*:\s*([^>]*)>/i.exec((e && e.note) || ''); return m ? String(m[1]).trim().toUpperCase() : null; }
        function estBossData(e) { return !!e && /<\s*(Meca\w*|Phases)\s*:/i.test(e.note || ''); }
        var ORDRE = ['D', 'C', 'B', 'A', 'S'];

        // ── les troupes, rangées ─────────────────────────────────────────
        var parRang = { D: [], C: [], B: [], A: [], S: [], BOSS: [] };
        $dataTroops.forEach(function (t) {
            if (!t || !t.members || !t.members.length) { return; }
            var es = t.members.map(function (m) { return $dataEnemies[m.enemyId]; }).filter(function (e) { return e && e.name; });
            if (es.length !== t.members.length || !es.length) { return; }
            if (es.some(estBossData)) {
                var rb = es.map(rangDe).filter(Boolean).sort(function (x, y) { return ORDRE.indexOf(y) - ORDRE.indexOf(x); })[0] || 'S';
                parRang.BOSS.push({ id: t.id, rang: rb, niveau: NIV_RANG[rb] || 60 });
                return;
            }
            var r = es.map(rangDe).filter(Boolean);
            if (!r.length) { return; }
            var max = r.sort(function (x, y) { return ORDRE.indexOf(y) - ORDRE.indexOf(x); })[0];
            parRang[max].push(t.id);
        });

        // ── le niveau ─────────────────────────────────────────────────────
        // ⚠ changeLevel() ne redescend PAS ici : un greffon de montée manuelle
        //   retient le niveau (mesuré : EXP à 0, niveau toujours 89). On pose
        //   le niveau et l'EXP à la main, puis on relit la classe — sinon un
        //   héros « niveau 1 » garderait ses 90 compétences.
        function poserNiveau(a, niv) {
            a._level = niv;
            a._exp[a._classId] = a.expForLevel(niv);
            a.initSkills();
            a.refresh();
        }

        // ── l'équipement du palier ───────────────────────────────────────
        var PLAFONDS = [700, 1600, 3200, 5200, 8000, 11500, Infinity];
        /** Frappe-t-il surtout avec MAG ? On compte, dans SES compétences, qui
         *  des deux la formule appelle — on ne devine pas sur le nom. */
        function estMage(a) {
            var m = 0, p = 0;
            a.skills().forEach(function (s) {
                var f = String(s.damage.formula || '');
                if (s.damage.type !== 1) { return; }
                if (/a\.mat/.test(f)) { m++; }
                if (/a\.atk/.test(f)) { p++; }
            });
            return m > p;
        }
        function equiper(a, niv) {
            var cap = PLAFONDS[Math.min(6, Math.floor(niv / 14))];
            var slots = a.equipSlots();
            for (var i = 0; i < slots.length; i++) {
                var et = slots[i];
                if (et > 5) { a.changeEquip(i, null); continue; }        // talisement, Âme : le Don est parti
                var liste = (et === 1 ? $dataWeapons : $dataArmors).filter(function (o) {
                    return o && o.name && o.etypeId === et && o.price > 0 && o.price <= cap && a.canEquip(o);
                });
                // En fin de partie, le joueur a aussi ce que JOKO a posé comme
                // équipement de départ (butins de boss, armes d'histoire).
                if (niv >= 80) {
                    var depart = $dataActors[a.actorId()].equips[i];
                    var o0 = depart ? (et === 1 ? $dataWeapons[depart] : $dataArmors[depart]) : null;
                    if (o0 && o0.etypeId === et && a.canEquip(o0)) { liste.push(o0); }
                }
                var best = null, sc = -1, mag = estMage(a);
                liste.forEach(function (o) {
                    var p = o.params;
                    // l'arme sert la stat qui frappe ; le reste, la survie
                    var s = (et === 1 ? (mag ? p[4] * 3 + p[2] : p[2] * 3 + p[4]) : (p[3] + p[5] + p[0] / 10)) + p[6] * 0.5;
                    if (s > sc) { sc = s; best = o; }
                });
                a._equips[i].setObject(best);
            }
            a.refresh();
        }

        // ── choisir, pour un héros ───────────────────────────────────────
        function degatsEstimes(a, skillId, cible) {
            var act = new Game_Action(a); act.setSkill(skillId);
            var v = 0;
            try { v = act.makeDamageValue(cible, false); } catch (e) { v = 0; }
            if (!(v > 0)) { return 0; }
            var s = $dataSkills[skillId];
            if ([2, 8, 10].indexOf(s.scope) >= 0 || s.scope === 2) { v *= Math.min(3, $gameTroop.aliveMembers().length); }
            return v * (s.repeats || 1);
        }
        /** Un joueur ne choisit que ce que son menu de combat affiche : les types
         *  de compétence ouverts (et non scellés), plus l'Attaque. La première
         *  version laissait ludwing lancer une technique de Jackpot hors Jackpot. */
        function dansLeMenu(a, s) {
            if (s.id === a.attackSkillId() || s.id === a.guardSkillId()) { return true; }
            return a.addedSkillTypes().indexOf(s.stypeId) >= 0 && !a.isSkillTypeSealed(s.stypeId);
        }
        function cibleFocus() {
            var v = $gameTroop.aliveMembers();
            // « le Renvoi est prêt » s'affiche au journal : on frappe ailleurs si on peut
            var sur = v.filter(function (e) { return !e._voieRenvoi; });
            return (sur.length ? sur : v).slice().sort(function (x, y) { return (x.hp / x.mhp) - (y.hp / y.mhp); })[0];
        }
        function poser(a, skillId, cible) {
            var act = new Game_Action(a); act.setSkill(skillId);
            if (cible) { act.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible)); }
            else { act.setTarget(-1); }
            a._actions = [act];
        }
        function soinSiBesoin(a) {
            var blesse = $gameParty.aliveMembers().filter(function (m) {
                return m.actorId() !== 6 && m.hp / m.mhp < 0.35 && !(window.PacteDeSang && !PacteDeSang.soignable(m));
            }).sort(function (x, y) { return x.hp / x.mhp - y.hp / y.mhp; })[0];
            if (!blesse) { return false; }
            var soins = a.skills().filter(function (s) {
                return a.canUse(s) && dansLeMenu(a, s) && s.damage.type === 3 && (s.scope === 7 || s.scope === 8) && s.occasion !== 3;
            }).sort(function (x, y) { return y.mpCost - x.mpCost; });
            if (!soins.length) { return false; }
            poser(a, soins[0].id, blesse);
            return true;
        }
        /** Ce que le coup coûte au lanceur : son coût en PV (<HP Cost:>) et
         *  le recul de ManaAffinity (Sombre 25 %, Négatif 15 %, ou
         *  <ReculVital:>) sur les dégâts qu'il fera. Mesuré au niveau 1 :
         *  ludwing perdait 400 PV sur 400 en un seul sort — un joueur, lui,
         *  voit sa barre fondre et ne relance pas. */
        function prixDuCorps(a, s, degats) {
            var pv = a.skillHpCost ? a.skillHpCost(s) : 0;
            var taux = 0, el = s.damage.elementId;
            if (s.meta && s.meta.ReculVital !== undefined) { taux = (Number(s.meta.ReculVital) || 0) / 100; }
            else if (el === 5) { taux = 0.25; }
            else if (el === 4) { taux = 0.15; }
            return pv + degats * taux;
        }
        /** La chance qu'une Parole tienne (ParolesSysteme : talent = MAG,
         *  lucidité 1 depuis que JOKO a retiré la santé mentale). L'aide du
         *  menu l'affiche au joueur : il la voit avant de lancer. */
        function tenue(a, s) {
            if (s.meta && s.meta.NoParole) { return 1; }
            var tag = s.meta && s.meta.Parole !== undefined;
            if (!tag && s.hitType !== 2) { return 1; }
            if ((tag && String(s.meta.Parole).trim().toLowerCase() === 'origine') || s.stypeId === 3) { return 1; }
            var L = s.meta && s.meta.ParoleL ? (parseInt(s.meta.ParoleL, 10) || 3) : 3;
            return Math.min(1, Math.max(1, a.mat) / (8 * Math.pow(L, 1.8))) * Math.min(1, 5 / (0.8 * L));
        }
        function meilleurCoup(a, cible, exclure) {
            var best = a.attackSkillId(), val = a.canUse($dataSkills[best]) ? degatsEstimes(a, best, cible) : -1;
            a.skills().forEach(function (s) {
                if (!a.canUse(s) || s.occasion === 3 || s.occasion === 2) { return; }
                if (!dansLeMenu(a, s)) { return; }
                if (s.damage.type !== 1 && s.damage.type !== 5) { return; }
                if (s.scope === 0 || s.scope >= 7) { return; }
                if (exclure && exclure(s)) { return; }
                // 🪞 Reflet affiché sur la cible : on n'y envoie pas de magie
                if (s.hitType === 2 && cible && cible.mrf > 0) { return; }
                var t = tenue(a, s);
                if (t < 0.5) { return; }                       // l'aide dit « risqué » : il n'insiste pas
                var v = degatsEstimes(a, s.id, cible) * t;
                // pas un coup qui le laisse sous 30 % de ses PV
                if (a.hp - prixDuCorps(a, s, v) < a.mhp * 0.3) { return; }
                if (v > val) { val = v; best = s.id; }
            });
            return best;
        }
        function generique(a) {
            if (soinSiBesoin(a)) { return; }
            var c = cibleFocus(); if (!c) { return; }
            poser(a, meilleurCoup(a, c), c);
        }
        /** Vesper et ses trois Styles. Un joueur saisit toutes ses actions d'un
         *  coup : dans le Flow, deux — la première version n'en posait qu'une. */
        function vesper(a) {
            var n = Math.max(1, a.makeActionTimes()), faites = [];
            for (var i = 0; i < n; i++) { a._actions = []; vesperUne(a); if (a._actions[0]) { faites.push(a._actions[0]); } }
            a._actions = faites;
        }
        var ULTIS_VESPER = [1138, 1140, 1143, 813, 26, 126, 1301];
        /** ludwing lui lance sa Vanne quand elle est en Sang : la Rage, puis le
         *  Berserker — ce qu'un joueur fait exprès. Pas en Lame ni en Garde. */
        function vanneUtile(l) {
            var v = $gameActors.actor(1), SV = window.StylesVesper;
            if (!SV || !v || !v.isAlive() || $gameParty.battleMembers().indexOf(v) < 0) { return false; }
            var pref = window.__styleVesper || 'auto';
            if (pref !== 'auto' && pref !== 'sang') { return false; }
            return SV.style() === 'sang' && SV.colere() >= 25 && l.canUse($dataSkills[1302]);
        }
        function vesperUne(a) {
            var c = cibleFocus(); if (!c) { return; }
            var P = window.PacteDeSang, SV = window.StylesVesper, E = SV.etats, hp = a.hp / a.mhp;
            var pref = window.__styleVesper || 'auto';
            var verrou = a.isStateAffected(E.flow) || a.isStateAffected(E.berserker);
            if (!verrou) {
                // les ultimes qui la sauvent : en Rage, le Berserker ; sous 20 %, le Flow
                if (a.isStateAffected(E.rage) && (pref === 'auto' || pref === 'sang')) {
                    P.changerStyle('saignee');
                    if (a.canUse($dataSkills[26])) { poser(a, 26, a); return; }
                }
                if (hp <= 0.2 && (pref === 'auto' || pref === 'lame')) {
                    P.changerStyle('lame');
                    if (a.canUse($dataSkills[126])) { poser(a, 126, a); return; }
                }
                // auto : la Garde quand elle faiblit, le Sang contre un groupe (ou Masque prêt), la Lame contre un seul
                var nb = $gameTroop.aliveMembers().length;
                var s = pref === 'auto' ? (hp < 0.45 ? 'garde' : (nb >= 2 || P.pct() >= 0.30 ? 'saignee' : 'lame')) : (pref === 'sang' ? 'saignee' : pref);
                P.changerStyle(s);
            }
            var st = SV.style();
            // 🛡 l'Arme de Sang : assez encaissé, ou l'armure va céder
            if (st === 'garde' && a.canUse($dataSkills[1301]) && (SV.sangEncaisse() >= a.mhp * 0.5 || a.mp < a.mmp * 0.25)) { poser(a, 1301, c); return; }
            if (st === 'sang') {
                if (!a.isStateAffected(E.berserker) && a.canUse($dataSkills[1143]) && ((hp < 0.40 && P.pct() > 0) || hp < 0.25)) { poser(a, 1143, c); return; }
                if (a.isStateAffected(E.convergence) && a.canUse($dataSkills[1299])) { poser(a, 1299, c); return; }
                if (!c.isStateAffected(P.dette) && P.pct() < 1.0) {
                    if ($gameTroop.aliveMembers().length >= 2 && a.canUse($dataSkills[1140])) { poser(a, 1140, c); return; }
                    if (a.canUse($dataSkills[1138])) { poser(a, 1138, c); return; }
                }
                // ✶ la Convergence, quand le Sang Perçant suivra (24 PT)
                if (!a.isStateAffected(E.convergence) && a.tp >= 24 && a.canUse($dataSkills[813])) { poser(a, 813, a); return; }
            }
            poser(a, meilleurCoup(a, c, function (s) { return ULTIS_VESPER.indexOf(s.id) >= 0; }), c);
        }
        function ael(a) {
            var B = window.BibliothequeAel;
            if (soinSiBesoin(a)) { return; }
            var c = $gameTroop.members()[a._focusAel] || cibleFocus();
            if (!c || !c.isAlive()) { c = cibleFocus(); }
            if (!c) { return; }
            // le Contrat, une fois, avec celui qui a le plus de PM
            if (!B.partenaire() && a.canUse($dataSkills[1279])) {
                var p = $gameParty.aliveMembers().filter(function (m) { return m !== a && m.actorId() !== 6; })
                    .sort(function (x, y) { return y.mp - x.mp; })[0];
                if (p && p.mp > 200) { poser(a, 1279, p); return; }
            }
            if (!B.partenaire() && $gameParty.aliveMembers().length === 1 && a.canUse($dataSkills[1280])) { poser(a, 1280, c); return; }
            // la Flèche du Miracle, si elle la connaît contre celui-là
            var f = B.flecheContre(c);
            if (f && a.isLearnedSkill(f.id) && a.canUse($dataSkills[f.id]) && B.partenaire()) { poser(a, f.id, c); return; }
            // la Fermeture, quand ils sont nombreux
            if ($gameTroop.aliveMembers().length >= 3 && a.canUse($dataSkills[1277]) && B.partenaire()) {
                var cible = $gameTroop.aliveMembers().filter(function (e) { return !B.estBoss(e); })
                    .sort(function (x, y) { return y.atk - x.atk; })[0];
                if (cible && cible !== c) { poser(a, 1277, cible); return; }
            }
            // le Voile, une fois, contre un groupe
            if ($gameTroop.aliveMembers().length >= 3 && !$gameTroop.aliveMembers().some(function (e) { return e.isStateAffected(239); })
                && a.canUse($dataSkills[1273])) { poser(a, 1273, c); return; }
            // Puis ses Paroles — ce qu'un joueur lance vraiment. La première
            // version de ce banc ne lui laissait que les Portes : elle
            // paraissait dix fois plus faible qu'elle ne l'est.
            // Économe : ce que le partenaire paie, ou ≤ seuil de sa poche —
            // sinon la Lecture tombe. Si rien d'économe ne sert, le plus fort.
            var p = B.partenaire();
            var econome = function (s) { var cout = a.skillMpCost(s); return cout <= B.seuilPM || (p && p.mp >= cout); };
            var coup = meilleurCoup(a, c, function (s) { return !econome(s); });
            if (coup === a.attackSkillId()) { coup = meilleurCoup(a, c); }
            poser(a, coup, c);
        }

        // ── un tour ──────────────────────────────────────────────────────
        var carnet = null;
        var vraiDegats = Game_Action.prototype.executeHpDamage;
        Game_Action.prototype.executeHpDamage = function (target, value) {
            if (carnet && value > 0) {
                var u = this.subject();
                if (u && u.isActor() && target.isEnemy()) {
                    var k = u.actorId();
                    carnet.degats[k] = (carnet.degats[k] || 0) + Math.min(value, target.hp);
                    // la puissance BRUTE : sans l'écrêtage « il n'avait plus que X PV ».
                    // Un combat fini en un tour cache la vraie force du groupe.
                    carnet.brut[k] = (carnet.brut[k] || 0) + value;
                    // et par compétence : qui, dans son kit, fait le travail ?
                    var it = this.item(), cle = k + ':' + (it ? it.id : 0);
                    carnet.parCoup[cle] = (carnet.parCoup[cle] || 0) + Math.min(value, target.hp);
                }
                if (u && u.isEnemy() && target.isActor()) { carnet.recus += Math.min(value, target.hp); }
                // 💢 ce que Vesper, en Rage, met sur ludwing
                if (u && u.isActor() && u.actorId() === 1 && target.isActor() && target.actorId() === 3) { carnet.vesper.surLudwing += Math.min(value, target.hp); }
            }
            return vraiDegats.call(this, target, value);
        };

        window.__trace = null;
        // En diagnostic : chaque PV qu'un héros perd, et qui agissait à ce moment-là.
        var process_pile = true;
        var vraiGainHp = Game_Battler.prototype.gainHp;
        Game_Battler.prototype.gainHp = function (v) {
            var avant = this._hp;
            vraiGainHp.call(this, v);
            // ce qu'un héros se prend PAR SA PROPRE action (recul, renvoi, reflet, Parole brisée)
            if (carnet && this.isActor() && this._hp < avant && BattleManager._subject === this) {
                carnet.soiMeme[this.actorId()] = (carnet.soiMeme[this.actorId()] || 0) + (avant - this._hp);
            }
            if (window.__trace && this.isActor() && this._hp < avant) {
                var s = BattleManager._subject, it = BattleManager._action && BattleManager._action.item();
                var d = '      ' + this.name() + ' −' + (avant - this._hp) + ' PV  ← ' + (s ? s.name() : '?') + (it ? ' / ' + it.name : '');
                // le coup vient de lui-même : d'où, dans le code ?
                if (s === this && process_pile) {
                    d += '   [' + (new Error().stack.split('\n').slice(2, 6).map(function (l) { var m = /plugins\/(\w+)\.js:(\d+)/.exec(l) || /(rpg_\w+)\.js:(\d+)/.exec(l); return m ? m[1] + ':' + m[2] : ''; }).filter(Boolean).join(' < ')) + ']';
                }
                window.__trace.push(d);
            }
        };
        function jouerAction(sujet, action) {
            if (window.__trace && sujet.isActor()) {
                window.__trace.push(sujet.name() + ' : ' + (action && action.item() ? action.item().name : '—')
                    + (sujet.isAlive() ? '' : ' [mort]') + (sujet.canMove() ? '' : ' [immobile]')
                    + (action && action.item() && !action.isValid() ? ' [invalide]' : ''));
            }
            if (!action || !sujet.isAlive() || !sujet.canMove()) { return; }
            action.prepare();
            if (!action.isValid()) { return; }
            BattleManager._subject = sujet; BattleManager._action = action;
            var cibles = action.makeTargets();
            sujet.useItem(action.item());
            action.applyGlobal();
            if (carnet && sujet.isActor()) { carnet.actions[sujet.actorId()] = (carnet.actions[sujet.actorId()] || 0) + 1; }
            cibles.forEach(function (t) { if (t && (t.isAlive() || action.isForDeadFriend())) { BattleManager.invokeAction(sujet, t); } });
            sujet.onAllActionsEnd();
            BattleManager._subject = null; BattleManager._action = null;
            viderForcees();
        }
        function viderForcees() {
            var q = $gameTemp._forceActionQueue;
            $gameTemp._forceActionQueue = undefined;
            if (!q || !q.list) { return; }
            q.list.forEach(function (c) {
                if (!c || c.code !== 339) { return; }
                var p = c.parameters;
                var b = p[0] === 1 ? $gameActors.actor(p[1]) : $gameTroop.members()[p[1]];
                if (!b || !b.isAlive()) { return; }
                var a = new Game_Action(b, true); a.setSkill(p[2]); a.setTarget(p[3]);
                jouerAction(b, a);
            });
        }
        function fini() { return $gameTroop.isAllDead() || $gameParty.isAllDead(); }

        /** Les pages de la troupe — PHASE II à 60 %, PHASE III à 25 %, la
         *  Posture de Fer, la Rage… MV les joue dans updateEventMain : avant
         *  la première saisie, entre deux actions, en fin de tour. La première
         *  version du banc les sautait : les boss n'avaient pas de phases.
         *  Les messages sont lus d'un coup (rien à afficher ici). */
        function evenements() {
            var tr = $gameTroop;
            for (var page = 0; page < 20 && !fini(); page++) {
                if (!tr.isEventRunning()) { tr.setupBattleEvent(); }
                if (!tr.isEventRunning()) { break; }
                for (var k = 0; k < 2000 && tr.isEventRunning(); k++) {
                    $gameMessage.clear();
                    tr._interpreter._waitCount = 0;
                    tr._interpreter.update();
                }
                $gameMessage.clear();
                viderForcees();
            }
        }

        function unTour(t) {
            // les héros décident (seiryu : son IA à lui)
            $gameParty.aliveMembers().forEach(function (a) {
                a.clearActions();
                if (!a.canMove()) { return; }
                if (a.actorId() === 6) { a.makeActions(); return; }
                if (a.actorId() === 1) { vesper(a); }
                else if (a.actorId() === 3 && vanneUtile(a)) { poser(a, 1302, $gameActors.actor(1)); }
                else if (a.actorId() === 4) { ael(a); }
                else { generique(a); }
            });
            $gameTroop.makeActions();                   // comme startInput : les ennemis préparent
            BattleManager.startTurn();                  // mécaniques de boss, ordre des tours
            // ⚠ YEP_BattleEngineCore termine startTurn par getNextSubject() :
            //   le plus RAPIDE sort de la file et devient « le sujet en cours ».
            //   La première version du banc ne lisait que la file — ludwing
            //   (AGI 439, le plus vif) n'agissait jamais. On le remet devant.
            var ordre = (BattleManager._subject ? [BattleManager._subject] : []).concat(BattleManager._actionBattlers);
            BattleManager._subject = null;

            var premierHeros = null, premierEnnemi = null;
            ordre.forEach(function (b, i) {
                if (fini() || !b || !b.isAlive()) { return; }
                if (b.isEnemy()) { b.setAIPattern(); if (premierEnnemi === null) { premierEnnemi = i; } }
                else if (premierHeros === null) { premierHeros = i; }
                var acts = b._actions.slice();
                acts.forEach(function (a) { if (!fini()) { jouerAction(b, a); evenements(); } });
                b.clearActions();
            });
            if (carnet && premierHeros !== null && premierEnnemi !== null) { carnet.herosDAbord += premierHeros < premierEnnemi ? 1 : 0; carnet.toursVus++; }
            BattleManager._actionBattlers = [];
            if (!fini()) { BattleManager.endTurn(); evenements(); }
            // Vesper, tour par tour : son Style, ses états
            var v1 = $gameActors.actor(1);
            if (carnet && v1 && window.StylesVesper && $gameParty.battleMembers().indexOf(v1) >= 0) {
                var cv = carnet.vesper, SE = StylesVesper.etats;
                if (v1.isAlive()) { cv.styles[StylesVesper.style()] = (cv.styles[StylesVesper.style()] || 0) + 1; } else { cv.toursMorte++; }
                if (v1.isStateAffected(SE.rage)) { cv.rage++; }
                if (v1.isStateAffected(SE.flow)) { cv.flow++; }
                if (v1.isStateAffected(SE.berserker)) { cv.berserker++; }
                if (v1.isStateAffected(SE.brisee)) { cv.brisee++; }
            }
            if (window.__trace) {
                window.__trace.push('— fin du tour ' + t + ' · ennemis ' + $gameTroop.members().map(function (e) { return e.hp + '/' + e.mhp + (e.isHidden() ? ' (caché)' : ''); }).join(', ')
                    + ' · héros ' + $gameParty.members().map(function (m) { return m.name() + ' ' + m.hp + (m.states().length ? ' [' + m.states().map(function (s) { return s.name; }).join(',') + ']' : '') + (m.canMove() ? '' : ' (immobile)'); }).join(' / '));
            }
        }

        // ── un combat ────────────────────────────────────────────────────
        window.__simuler = function (troopId, niv, palierLien) {
            BattleManager.setup(troopId, false, true);
            BattleManager.setLogWindow(SC._logWindow); BattleManager.setStatusWindow(SC._statusWindow);
            BattleManager.setSpriteset(SC._spriteset);
            $gameParty.members().forEach(function (a) {
                if (a.actorId() !== 6) {
                    // ⚠ changeLevel ne fait pas OUBLIER : redescendu au niveau 1,
                    //   un héros garderait ses 90 compétences. initSkills relit
                    //   la classe au niveau voulu.
                    poserNiveau(a, niv); equiper(a, niv);
                }
                a.recoverAll();
                a._pacte = 0; a._reserve = 0; a._contrat = null; a._focusAel = 0;
            });
            var s = $gameActors.actor(6);
            if (s) { poserNiveau(s, niv); s.recoverAll(); }
            if (window.Seiryu) { Seiryu.experience(palierLien === 3 ? Seiryu.seuils.lie : (palierLien === 2 ? Seiryu.seuils.dresse : 0)); }
            // les Flèches du Miracle s'apprennent en jouant : on repart de zéro
            [1268, 1269, 1270, 1271, 1272].forEach(function (i) { var a = $gameActors.actor(4); if (a) { a.forgetSkill(i); } });
            $gameParty.onBattleStart(); $gameTroop.onBattleStart();
            // ⚠ YEP_BattleEngineCore ne crée la file des popups qu'au premier
            //   passage d'un sprite. Sans affichage, on la crée nous-mêmes.
            $gameParty.members().concat($gameTroop.members()).forEach(function (b) { b.clearDamagePopup(); });
            $gameTemp._forceActionQueue = undefined;
            carnet = { degats: {}, brut: {}, actions: {}, recus: 0, soiMeme: {}, parCoup: {}, herosDAbord: 0, toursVus: 0,
                       vesper: { styles: {}, rage: 0, flow: 0, berserker: 0, brisee: 0, toursMorte: 0, surLudwing: 0 } };
            var pvGroupe = $gameParty.members().filter(function (m) { return m.actorId() !== 6; }).reduce(function (n, m) { return n + m.mhp; }, 0);
            var mediane = function (l) { l = l.slice().sort(function (x, y) { return x - y; }); return l.length ? l[Math.floor(l.length / 2)] : 0; };
            var ennemis = { nombre: $gameTroop.members().length,
                pv: $gameTroop.members().reduce(function (n, e) { return n + e.mhp; }, 0),
                atq: mediane($gameTroop.members().map(function (e) { return Math.max(e.atk, e.mat); })),
                agi: mediane($gameTroop.members().map(function (e) { return e.agi; })) };
            var t = 0, premierKO = null;
            var pvEnnemis = $gameTroop.members().reduce(function (n, e) { return n + e.mhp; }, 0);
            evenements();                                    // les pages « tour 0 » : l'entrée du boss
            while (!fini() && t < 40) {
                t++;
                unTour(t);
                if (premierKO === null && $gameParty.members().some(function (m) { return m.actorId() !== 6 && m.isDead(); })) { premierKO = t; }
            }
            var r = {
                troupe: troopId, niveau: niv, tours: t, victoire: $gameTroop.isAllDead() && !$gameParty.isAllDead(),
                premierKO: premierKO, pvEnnemis: pvEnnemis,
                pvRestants: $gameParty.members().filter(function (m) { return m.actorId() !== 6; })
                    .reduce(function (n, m) { return n + m.hp / m.mhp; }, 0) / 4,
                degats: carnet.degats, brut: carnet.brut, actions: carnet.actions, recus: carnet.recus, soiMeme: carnet.soiMeme, parCoup: carnet.parCoup,
                pvGroupe: pvGroupe, ennemis: ennemis,
                herosDAbord: carnet.toursVus ? carnet.herosDAbord / carnet.toursVus : 0,
                // seiryu : ses chutes, les tours où Korrah n'avait pas l'Hiver, ses soins
                seiryu: window.Seiryu && Seiryu.bilan ? Seiryu.bilan() : null,
                // Vesper : tours par Style, Rage / Flow / Berserker / armure brisée, ce que ludwing a pris
                vesper: carnet.vesper,
                // les réactions élémentaires de FusionElements v2.0 (Vapeur, Fonte…), dans ce combat
                reactions: window.Fusion && Fusion.compte ? Fusion.compte() : null
            };
            // on vide ce que les sprites n'afficheront jamais
            $gameParty.members().concat($gameTroop.members()).forEach(function (b) { b.clearDamagePopup(); b.clearAnimations && b.clearAnimations(); });
            carnet = null;
            return r;
        };
        window.__profil = function (niv) {
            return $gameParty.members().filter(function (a) { return a.actorId() !== 6; }).map(function (a) {
                poserNiveau(a, niv); equiper(a, niv); a.recoverAll();
                return { id: a.actorId(), nom: a.name(), pv: a.mhp, pm: a.mmp, atq: a.atk, mag: a.mat, def: a.def, mdf: a.mdf, agi: a.agi,
                    arme: a.weapons()[0] ? a.weapons()[0].name : '—', competences: a.skills().length };
            });
        };
        /** Ce qu'un héros peut lancer, et ce que ça ferait, contre le 1er
         *  ennemi d'une troupe — pour vérifier qu'une politique de jeu ne
         *  passe pas à côté du meilleur coup. */
        window.__sonde = function (acteur, niv, troupe) {
            $gameParty.members().forEach(function (a) { poserNiveau(a, niv); equiper(a, niv); a.recoverAll(); });
            $gameTroop.setup(troupe);
            var a = $gameActors.actor(acteur), e = $gameTroop.aliveMembers()[0];
            return a.skills().filter(function (s) { return dansLeMenu(a, s) && s.damage.type === 1 && s.occasion !== 3; })
                .map(function (s) { return { id: s.id, nom: s.name, stype: s.stypeId, pm: a.skillMpCost(s), estime: Math.round(degatsEstimes(a, s.id, e)), formule: s.damage.formula }; })
                .sort(function (x, y) { return y.estime - x.estime; });
        };
        window.__parRang = parRang;
        window.__rangDe = rangDe;
    });

    // ═════════════════════════════════════════════════════════════════════
    // Le plan de mesure
    // ═════════════════════════════════════════════════════════════════════
    // MULT=« D:5.2,1;C:3.9,1;… » : essayer un réglage d'EquilibreDesCombats
    // sans toucher à plugins.js (rang:pv,force).
    if (process.env.MULT) {
        var essai = process.env.MULT.split(';').filter(Boolean).map(function (x) {
            var t = x.split(':'), v = t[1].split(',').map(Number); return [t[0].trim().toUpperCase(), v[0], v[1]];
        });
        await page.evaluate(function (l) { l.forEach(function (x) { window.EquilibreDesCombats.regler(x[0], x[1], x[2]); }); }, essai);
        console.log('réglage essayé :', process.env.MULT);
    }
    // SANS_INSTINCTS=1 : les ennemis sans leur instinct (LesInstincts, 2026-10-26), pour mesurer ce qu'il change
    if (process.env.SANS_INSTINCTS) {
        await page.evaluate(function () { if (window.LesInstincts) { LesInstincts._eteint = true; } });
        console.log('ennemis sans instinct');
    }
    // VRAIES=1 : seulement les troupes que le jeu pose vraiment (rencontres des cartes, combats des événements
    // et des événements communs) — « mesurer chaque rencontre » (JOKO, 2026-10-26)
    if (process.env.VRAIES) {
        var vraies = troupesDuJeu();
        await page.evaluate(function (l) {
            var P = window.__parRang;
            Object.keys(P).forEach(function (k) { P[k] = P[k].filter(function (x) { return l.indexOf(typeof x === 'object' ? x.id : x) >= 0; }); });
        }, vraies);
        console.log('seulement les troupes du jeu :', vraies.length);
    }
    if (process.env.SEUL) { console.log('un seul héros :', process.env.SEUL); }
    var reglage = await page.evaluate(function () { return window.EquilibreDesCombats ? JSON.parse(JSON.stringify(window.EquilibreDesCombats.mult)) : null; });
    if (process.env.VESPER_STYLE) {
        await page.evaluate(function (s) { window.__styleVesper = s; }, process.env.VESPER_STYLE);
        console.log('Vesper joue en :', process.env.VESPER_STYLE);
    }

    // Mode diagnostic : DIAG=troupe,niveau → un seul combat, commenté coup par coup.
    if (process.env.DIAG) {
        var d = process.env.DIAG.split(',').map(Number);
        var tr = await page.evaluate(function (a) {
            window.__trace = [];
            var r = window.__simuler(a[0], a[1], a[1] >= 45 ? 3 : 2);
            r.trace = window.__trace; window.__trace = null; return r;
        }, d);
        tr.trace.forEach(function (l) { console.log('   ' + l); });
        console.log(JSON.stringify({ tours: tr.tours, victoire: tr.victoire, degats: tr.degats, actions: tr.actions }));
        await nav.close(); return;
    }
    // Mode sonde : SONDE=acteur,niveau,troupe → ses coups, du plus fort au plus faible.
    if (process.env.SONDE) {
        var so = process.env.SONDE.split(',').map(Number);
        var l = await page.evaluate(function (a) { return window.__sonde(a[0], a[1], a[2]); }, so);
        l.forEach(function (s) { console.log(String(s.estime).padStart(7) + '  #' + s.id + ' ' + s.nom + '  (type ' + s.stype + ', ' + s.pm + ' PM)  ' + s.formule); });
        await nav.close(); return;
    }
    var NIVEAUX = process.env.NIVEAUX ? process.env.NIVEAUX.split(',').map(Number) : [1, 6, 12, 20, 28, 36, 45, 52, 60, 70, 80, 89, 99];
    function rangPour(n) { return n >= 60 ? 'S' : n >= 45 ? 'A' : n >= 28 ? 'B' : n >= 12 ? 'C' : 'D'; }
    function lienPour(n) { return n >= 45 ? 3 : n >= 20 ? 2 : 1; }
    var pools = await page.evaluate(function () { var o = {}; Object.keys(window.__parRang).forEach(function (k) { o[k] = window.__parRang[k].length; }); o.bossParRang = {}; window.__parRang.BOSS.forEach(function (b) { o.bossParRang[b.rang] = (o.bossParRang[b.rang] || 0) + 1; }); return o; });
    console.log('troupes par rang :', JSON.stringify(pools));

    function echantillon(liste, n, graine) {
        var out = [], l = liste.slice(), s = graine;
        while (out.length < n && l.length) { s = (s * 9301 + 49297) % 233280; out.push(l.splice(Math.floor(s / 233280 * l.length), 1)[0]); }
        return out;
    }
    var listes = await page.evaluate(function () { return window.__parRang; });

    var resultats = { date: new Date().toISOString(), reglage: reglage, styleVesper: process.env.VESPER_STYLE || 'auto', niveaux: [] };
    for (var i = 0; i < NIVEAUX.length; i++) {
        var n = NIVEAUX[i], rang = rangPour(n);
        var profil = await page.evaluate(function (x) { return window.__profil(x); }, n);
        var combats = [];
        var troupes = echantillon(listes[rang] || [], TROUPES, 7 + n);
        for (var j = 0; j < troupes.length; j++) {
            for (var k = 0; k < PAR_TROUPE; k++) {
                combats.push(await page.evaluate(function (a) { return window.__simuler(a[0], a[1], a[2]); }, [troupes[j], n, lienPour(n)]));
            }
        }
        var boss = [];
        var bossDuNiveau = (listes.BOSS || []).filter(function (x) { return x.niveau <= n; }).map(function (x) { return x.id; });
        if (bossDuNiveau.length) {
            var tb = echantillon(bossDuNiveau, Math.max(3, Math.floor(TROUPES / 2)), 11 + n);
            for (var b = 0; b < tb.length; b++) {
                boss.push(await page.evaluate(function (a) { return window.__simuler(a[0], a[1], a[2]); }, [tb[b], n, lienPour(n)]));
            }
        }
        resultats.niveaux.push({ niveau: n, rang: rang, lien: lienPour(n), profil: profil, combats: combats, boss: boss });
        var v = combats.filter(function (c) { return c.victoire; }).length;
        var tMoy = combats.reduce(function (s, c) { return s + c.tours; }, 0) / (combats.length || 1);
        var bv = boss.filter(function (c) { return c.victoire; }).length;
        var bt = boss.reduce(function (s, c) { return s + c.tours; }, 0) / (boss.length || 1);
        console.log('niveau ' + String(n).padStart(2) + ' · rang ' + rang + ' · ' + combats.length + ' combats, ' + v + ' victoires, ' + tMoy.toFixed(1) + ' tours'
            + (boss.length ? '   |   boss : ' + bv + '/' + boss.length + ', ' + bt.toFixed(1) + ' tours' : '')
            + (function () {
                var nr = combats.concat(boss).reduce(function (s, c) { return s + Object.keys(c.reactions || {}).reduce(function (x, k) { return x + c.reactions[k]; }, 0); }, 0);
                return nr ? '   |   ' + nr + ' réactions' : '';
            })());
    }
    resultats.erreurs = erreurs.slice(0, 20);
    fs.writeFileSync(SORTIE, JSON.stringify(resultats, null, 1));
    console.log('\n→ ' + SORTIE + '   (erreurs moteur : ' + erreurs.length + ')');
    await nav.close();
})();
