/*
 * BANC NAVIGATEUR — CE QUI SE VOIT (2026-10-23)
 * ---------------------------------------------------------------------------
 * JOKO, après avoir joué : « j'ai rien senti de différence […] vraiment zéro
 * diff ». En vue de côté, le journal de combat est MUET (SimpleMsgSideView ne
 * garde aucune ligne) : tout ce que les systèmes des héros y écrivaient — le
 * froid de seiryu, ses ordres, les âmes du Registre, le livre d'Aël, le Pacte,
 * la Rage — ne se voyait jamais. Ils flottent maintenant au-dessus de qui le
 * fait (CombatTactique.annoncer), et le journal reste.
 *
 * Ce banc vérifie, dans les deux sens, sur le vrai moteur :
 *   · Korrah confie son froid → « ❄ Confié » sur seiryu ; une Attaque, non ;
 *   · la ligne de seiryu (le cinquième, hors de la fenêtre de statut) : sa vie
 *     et son froid ; tombé, combien de tours avant qu'il se reforme ; elle ne
 *     s'écrit ni sur le livre d'Aël ni hors de l'écran ;
 *   · seiryu se dissipe → au-dessus de lui, et « ❄ Plus d'Hiver » sur Korrah ;
 *   · ludwing copie → « ✦ Copié » ; le livre d'Aël plein → « 📖 Livre plein »
 *     (pas à deux pages) ; la Rage de Vesper → « 💢 RAGE ! » (pas à 50) ;
 *   · une annonce longue au-dessus d'un héros reste dans l'écran.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   cmd /c start "" /b /wait /low /affinity 3 node bancs/navigateur/ce_qui_se_voit.js
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
    await page.evaluate(function () {
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(2500);

    console.log('=== CE QUI SE VOIT ===\n');
    var r = await page.evaluate(function () {
        var vus = [], an = CombatTactique.annoncer, o = {};
        CombatTactique.annoncer = function (b, t) { vus.push((b && b.name ? b.name() : '?') + ' : ' + t); return an.apply(this, arguments); };
        function depuis(n) { return vus.slice(n); }
        var ves = $gameActors.actor(1), kor = $gameActors.actor(2), lud = $gameActors.actor(3), ael = $gameActors.actor(4), sei = $gameActors.actor(6);
        o.seiryuLa = $gameParty.battleMembers().indexOf(sei) >= 0 && sei.isAlive();

        // 1 · le froid confié
        var hiver = kor.skills().filter(function (s) { return s.stypeId === 6 && kor.skillMpCost(s) > 0; })[0];
        kor.setMp(kor.mmp); FroidConfie.poser(0);
        var n = vus.length; kor.paySkillCost(hiver); o.confie = depuis(n);
        n = vus.length; kor.paySkillCost($dataSkills[1]); o.confieContre = depuis(n);
        o.hiver = hiver ? hiver.name : null;

        // 2 · la ligne de seiryu
        o.ligne = FroidConfie.ligneSeiryu();
        var sc = SceneManager._scene, fs = sc._fenetreSeiryu, fl = sc._fenetreLecture;
        var bande = function (w) { return w ? [w.x + w.padding, w.y + w.padding + 8, w.x + w.width - w.padding, w.y + w.padding + 30] : null; };
        var inter = function (a, b) { return !!(a && b) && a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]; };
        o.fenetre = { existe: !!fs, surLeLivre: inter(bande(fs), bande(fl)), surLePacte: inter(bande(fs), bande(sc._fenetrePacte)),
                      dansEcran: !!fs && fs.x + fs.width <= Graphics.boxWidth,
                      cache: !!fs && fs.visibleDansLeStatut() };

        // 3 · ludwing copie
        var copie = [1186, 1187, 1188, 1190].filter(function (id) { return !lud.isLearnedSkill(id) && Registre.copies().indexOf(id) < 0; })[0];
        n = vus.length; Registre.copier(copie); o.copie = depuis(n);

        // 4 · le livre d'Aël : trois petites Paroles
        var petite = ael.skills().filter(function (s) { var c = ael.skillMpCost(s); return c >= 1 && c <= 20 && s.stypeId !== 3; })[0];
        ael._livreAel = 0; ael.setMp(ael.mmp);
        ael.useItem(petite); ael.useItem(petite);
        o.livre2 = vus.filter(function (t) { return /Livre plein/.test(t); }).length;
        ael.useItem(petite);
        o.livre3 = vus.filter(function (t) { return /Livre plein/.test(t); }).length;
        o.petite = petite ? petite.name : null;

        // 5 · la Rage de Vesper
        n = vus.length; StylesVesper.poserColere(50); o.rage50 = depuis(n);
        n = vus.length; StylesVesper.poserColere(100); o.rage = depuis(n);

        // 6 · seiryu se dissipe (en dernier : sans lui, pas d'Hiver)
        n = vus.length; sei.addState(sei.deathStateId()); o.dissipe = depuis(n);
        o.ligneTombe = FroidConfie.ligneSeiryu();
        return o;
    });
    console.log('1) Le froid confié');
    v('seiryu est dans le combat', r.seiryuLa);
    v('Korrah lance « ' + r.hiver + ' » : « ❄ Confié +n · x/100 » flotte au-dessus de seiryu', r.confie.some(function (t) { return /^seiryu : ❄ Confié \+\d+ · \d+\/100$/.test(t); }), r.confie.join(' | '));
    v('…contre-épreuve : une Attaque ne confie rien', !r.confieContre.some(function (t) { return /Confié/.test(t); }), r.confieContre.join(' | ') || 'rien');
    console.log('\n2) La ligne de seiryu');
    v('sa vie et son froid : « seiryu · … PV · ❄ n »', /^seiryu · \d+ PV · ❄ \d+$/.test(r.ligne), r.ligne);
    v('la fenêtre existe, tient dans l\'écran, ne s\'écrit ni sur le livre ni sur le Pacte', r.fenetre.existe && r.fenetre.dansEcran && !r.fenetre.surLeLivre && !r.fenetre.surLePacte, JSON.stringify(r.fenetre));
    v('…et elle parle parce que sa rangée de statut est hors de la fenêtre', r.fenetre.cache === false);
    console.log('\n3) Les autres');
    v('ludwing copie : « ✦ Copié : … »', r.copie.some(function (t) { return /^ludwing : ✦ Copié : /.test(t); }), r.copie.join(' | '));
    v('le livre d\'Aël, trois pages de « ' + r.petite + ' » : « 📖 Livre plein »', r.livre3 === 1);
    v('…contre-épreuve : à deux pages, rien', r.livre2 === 0);
    v('la Colère de Vesper à 100 : « 💢 RAGE ! »', r.rage.some(function (t) { return /^Vesper : 💢 RAGE !$/.test(t); }), r.rage.join(' | '));
    v('…contre-épreuve : à 50, rien', r.rage50.length === 0, r.rage50.join(' | ') || 'rien');
    v('seiryu se dissipe : au-dessus de lui, et « ❄ Plus d\'Hiver » sur Korrah', r.dissipe.some(function (t) { return /^seiryu : ✦ Se dissipe · \d t\.$/.test(t); }) && r.dissipe.some(function (t) { return /^Korrah : ❄ Plus d'Hiver$/.test(t); }), r.dissipe.join(' | '));
    v('…et sa ligne dit quand il se reforme', /se reforme · \d t\.$/.test(r.ligneTombe), r.ligneTombe);

    console.log('\n4) Une annonce longue au bord droit');
    await page.evaluate(function () {
        // le héros le plus à droite de l'écran
        var sp = SceneManager._scene._spriteset._actorSprites.filter(function (x) { return x._battler; })
            .sort(function (a, b) { return b.x - a.x; })[0];
        window.__auBord = sp._battler;
        CombatTactique.annoncer(sp._battler, '✦ Une annonce assez longue pour déborder du bord droit', '#ffffff');
    });
    await page.waitForTimeout(400);
    var bord = await page.evaluate(function () {
        var ss = SceneManager._scene._spriteset, s = (ss._ctAnnonces || []).filter(function (x) { return /assez longue/.test(x.texte); })[0];
        if (!s) { return null; }
        var w = Math.min(320, s.bitmap.measureTextWidth(s.texte));
        var sp = ss._actorSprites.filter(function (x) { return x._battler === window.__auBord; })[0];
        return { droite: Math.round(s.x + w / 2), avant: Math.round(sp.x + w / 2), ecran: Graphics.boxWidth };
    });
    v('elle reste dans l\'écran', !!bord && bord.droite <= bord.ecran, JSON.stringify(bord));
    v('…contre-épreuve : centrée sur lui comme avant, elle débordait', !!bord && bord.avant > bord.ecran);

    console.log('\n5) Le menu de combat : une famille, une ligne — mais un verbe, un art, Activer, chacun la sienne');
    var menu = await page.evaluate(function () {
        var o = { manquent: [], avantCache: [], tailles: {} };
        // la clé d'AVANT (FamillesDeCapacites v1.0) et sa force, refaites ici pour la contre-épreuve
        function etats(s) { return (s.effects || []).filter(function (e) { return e.code === 21 || e.code === 22; }).map(function (e) { return e.code + ':' + e.dataId; }).sort().join(','); }
        function vieille(s) { if (s.meta && s.meta.HorsFamille !== undefined) { return 'seul:' + s.id; } var d = s.damage || {}; return [s.stypeId, s.scope, d.type || 0, d.elementId || 0, etats(s)].join('|'); }
        function niveau(a, id) { var l = $dataClasses[a.currentClass().id].learnings.filter(function (x) { return x.skillId === id; }); return l.length ? Math.max.apply(null, l.map(function (x) { return x.level; })) : 0; }
        function facteur(s) { var m = String((s.damage || {}).formula || '').match(/\*\s*([\d.]+)/g); return m ? m.reduce(function (t, x) { return t + parseFloat(x.replace('*', '')); }, 0) : 0; }
        function vieuxRepli(a, liste) {
            var g = {}; liste.forEach(function (s) { (g[vieille(s)] = g[vieille(s)] || []).push(s); });
            return Object.keys(g).map(function (k) {
                var x = g[k].slice().sort(function (p, q) { return (niveau(a, q.id) * 1000 + facteur(q)) - (niveau(a, p.id) * 1000 + facteur(p)); });
                return x.filter(function (s) { return a.canUse(s); })[0] || x[0];
            });
        }
        var VERBE = /<(Ouvre|Finit|Reprise|Sur|Entre|Grace|Immobile|Accumule|EclatNoir|Riposte|ApresRiposte|Lecture|Lache|Premier|NeufVoies|ToutOuRien|Leurre|Rythme|Reste|Assez|MotJuste|Suspend|Viens|Pars|Nomme|Avec|Encourage|Devant|Cercle|Referme|Sceau|Pret|Symbole|Appat|Rempart)[:>]/;
        var lud = $gameActors.actor(3), e = $gameTroop.members()[0];
        lud._ecrits = [{ cible: e, competence: 158 }];
        [1, 2, 3, 4].forEach(function (id) {
            var a = $gameActors.actor(id);
            a.setMp(a.mmp); a.setTp(a.maxTp());
            var w = new Window_SkillList(0, 0, 400, 300); w.setActor(a);
            var vues = [], brut = 0, vieux = 0;
            a.addedSkillTypes().concat([1]).filter(function (t, i, l) { return l.indexOf(t) === i; }).forEach(function (t) {
                w.setStypeId(t); w.refresh();
                vues = vues.concat(w._data.filter(Boolean));
                var tout = a.skills().filter(function (s) { return w.includes(s); });
                brut += tout.length; vieux += vieuxRepli(a, tout).length;
                // chaque capacité à verbe (ou Activer) a sa ligne, sauf une jumelle exacte (même clé neuve) déjà montrée
                tout.filter(function (s) { return VERBE.test(s.note) || s.id === 1309; }).forEach(function (s) {
                    if (w._data.indexOf(s) >= 0) { return; }
                    var jumelle = w._data.some(function (x) { return x && Familles.de(a, s).indexOf(x) >= 0; });
                    if (!jumelle) { o.manquent.push(a.name() + ' ' + s.id); }
                });
                vieuxRepli(a, tout).length;
                tout.filter(function (s) { return VERBE.test(s.note) || s.id === 1309; }).forEach(function (s) {
                    if (vieuxRepli(a, tout).indexOf(s) < 0) { o.avantCache.push(a.name() + ' ' + s.id); }
                });
            });
            o.tailles[a.name()] = { tout: brut, avant: vieux, maintenant: vues.length };
            if (id === 3) { o.activer = vues.some(function (s) { return s.id === 1309; }); }
        });
        lud._ecrits = [];
        return o;
    });
    v('« ᛟ Activer » a sa ligne dans les capacités de ludwing (avec un écrit en attente)', menu.activer === true);
    v('chaque capacité à verbe a sa ligne dans le menu de combat', menu.manquent.length === 0, menu.manquent.slice(0, 8).join(', '));
    v('…contre-épreuve : avec la clé d\'avant, ' + menu.avantCache.length + ' d\'entre elles (ou Activer) étaient repliées sous une autre', menu.avantCache.length > 0, menu.avantCache.slice(0, 8).join(', '));
    console.log('      lignes par héros (toutes / repliées avant / maintenant) : ' + Object.keys(menu.tailles).map(function (k) { var t = menu.tailles[k]; return k + ' ' + t.tout + '/' + t.avant + '/' + t.maintenant; }).join(' · '));

    console.log('\n6) La réplique du tableau des interactions (celui de JOKO)');
    var vanne = await page.evaluate(function () {
        var vus = [], an = CombatTactique.annoncer, o = {};
        CombatTactique.annoncer = function (b, t) { vus.push((b && b.name ? b.name() : '?') + ' : ' + t); return an.apply(this, arguments); };
        var lud = $gameActors.actor(3), ves = $gameActors.actor(1), kor = $gameActors.actor(2), m = $gameParty.members();
        var ligne = Interactions.table.filter(function (l) { return l.competence === 1302 && l.cible === 1; })[0];
        o.texte = ligne ? ligne.dit[0] : null;
        function lancer(cible) {
            var act = new Game_Action(lud); act.setSkill(1302); act.setTarget(m.indexOf(cible));
            cible.clearResult(); act.apply(cible);
        }
        var n = vus.length; lancer(ves); o.surVesper = vus.slice(n);
        n = vus.length; lancer(kor); o.surKorrah = vus.slice(n);
        CombatTactique.annoncer = an;
        return o;
    });
    var attendu = vanne.texte ? '« ' + vanne.texte.replace(/%2/g, 'Vesper') + ' »' : null;
    var dit = vanne.surVesper.filter(function (t) { return /^ludwing : /.test(t); }).map(function (t) { return t.replace(/^ludwing : /, ''); }).reverse().join(' ');
    v('la Vanne de ludwing sur Vesper : sa réplique flotte au-dessus de lui, telle qu\'écrite', !!attendu && dit === attendu, dit + ' / attendu ' + attendu);
    v('…contre-épreuve : sur Korrah (pas dans le tableau), il ne dit rien', !vanne.surKorrah.some(function (t) { return /^ludwing : «/.test(t); }), vanne.surKorrah.join(' | ') || 'rien');

    console.log('\n7) Les boss, les ennemis et les dons (JOKO : « OUI A TOUT ») ; la fenêtre des capacités');
    var bd = await page.evaluate(function () {
        var MB = MecaBoss, o = {};
        MB._bannieres = [];
        MB.bandeauDuJournal('\\C[2]Le masque de Dono tombe. « …Tu m\'obliges à être sérieux. »\\C[0]');
        o.long = JSON.parse(JSON.stringify(MB._bannieres[0] || null));
        o.rouge = SceneManager._scene._logWindow.textColor(2);
        MB._bannieres = [];
        MB.bandeauDuJournal('Le Kamui revient.');
        o.court = JSON.parse(JSON.stringify(MB._bannieres[0] || null));
        // le même instant : le bandeau du plugin remplace sa ligne de journal
        MB._bannieres = [];
        MB.bandeauDuJournal('\\C[14]★ Dono se dépasse : il atteint enfin le MANA PARFAIT !\\C[0]');
        MB.banniere('★ MANA PARFAIT', 'Dono se dépasse.', '#ffe066');
        o.memeInstant = MB._bannieres.map(function (b) { return b.type + ':' + b.titre; });
        // MB.dire (MecaniquesDeBossSuite) écrit au journal ET en bandeau
        MB._bannieres = [];
        MB.dire('\\C[2]Quelque chose répond dans le noir.\\C[0]');
        o.dire = MB._bannieres.map(function (b) { return b.titre; });
        // un autre instant : les deux restent
        MB._bannieres = [];
        MB.bandeauDuJournal('Une ligne d\'avant.');
        Graphics.frameCount++;
        MB.banniere('UN BANDEAU', '', '#ffffff');
        o.autreInstant = MB._bannieres.length;
        MB._bannieres = [];
        // la fenêtre des capacités
        var s = SceneManager._scene, w = s._skillWindow, aide = s._helpWindow;
        o.fenetre = { h: w.height, y: w.y, neuf: w.fittingHeight(9), quatre: w.fittingHeight(4), bas: w.y + w.height, ecran: Graphics.boxHeight,
                      sousAide: w.y >= aide.y + aide.height, lignes: w.maxPageRows ? w.maxPageRows() : 0 };
        return o;
    });
    // les lignes du bas (Pacte, Colère, livre, phrase, seiryu) s'effacent tant qu'elle est ouverte, et reviennent :
    // on laisse tourner les vraies images du jeu
    var cles = ['_fenetrePacte', '_fenetreColere', '_fenetreLecture', '_fenetrePhrase', '_fenetreSeiryu'];
    await page.evaluate(function () { var w = SceneManager._scene._skillWindow; w.setActor($gameActors.actor(3)); w.setStypeId(1); w.show(); w.openness = 255; });   // comme le jeu : un héros d'abord
    await page.waitForTimeout(300);
    bd.ouverte = await page.evaluate(function (c) { var s = SceneManager._scene; return c.map(function (k) { return s[k] ? s[k].visible : null; }); }, cles);
    await page.evaluate(function () { var w = SceneManager._scene._skillWindow; w.hide(); w.openness = 0; });
    await page.waitForTimeout(300);
    bd.fermee = await page.evaluate(function (c) { var s = SceneManager._scene; return c.map(function (k) { return s[k] ? s[k].visible : null; }); }, cles);
    v('une ligne de boss longue : coupée à sa pause, dans la couleur de son \\C[2]', !!bd.long && bd.long.titre === 'Le masque de Dono tombe.' && bd.long.sous === '« …Tu m\'obliges à être sérieux. »' && bd.long.couleur === bd.rouge && bd.long.type === 'journal', JSON.stringify(bd.long));
    v('…une courte reste entière', !!bd.court && bd.court.titre === 'Le Kamui revient.' && bd.court.sous === '');
    v('le plugin pose son propre bandeau au même instant : pas de doublon', JSON.stringify(bd.memeInstant) === JSON.stringify(['bandeau:★ MANA PARFAIT']), JSON.stringify(bd.memeInstant));
    v('…contre-épreuve : à un autre instant, les deux restent', bd.autreInstant === 2);
    v('MecaBoss.dire (les mécaniques de boss) passe aussi en bandeau', JSON.stringify(bd.dire) === JSON.stringify(['Quelque chose répond dans le noir.']), JSON.stringify(bd.dire));
    v('la fenêtre des capacités montre 9 lignes (4 avant), posée en bas, sous l\'aide', bd.fenetre.h === bd.fenetre.neuf && bd.fenetre.h > bd.fenetre.quatre && bd.fenetre.bas === bd.fenetre.ecran && bd.fenetre.sousAide && bd.fenetre.lignes === 9, JSON.stringify(bd.fenetre));
    v('…ouverte, les lignes du Pacte, de la Colère, du livre, de la phrase et de seiryu ne s\'écrivent pas dessus', bd.ouverte.every(function (x) { return x === false; }), JSON.stringify(bd.ouverte));
    v('…fermée, elles reviennent', bd.fermee.every(function (x) { return x === true; }), JSON.stringify(bd.fermee));

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
