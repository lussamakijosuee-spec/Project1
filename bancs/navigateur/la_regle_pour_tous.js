/*
 * BANC NAVIGATEUR — LA RÈGLE POUR TOUS (MaitriseVoies « reglePourTous »)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-20 : « Les dons ne t'écartent pas du système. Les dons te
 * rajoutent une carte en plus avec le système. » ; « si elle veut lancer une
 * attaque de sang, là, elle n'a pas besoin de dire la formule, oui, mais elle
 * doit toujours faire le mouvement. »
 *
 * Avant, la Voie par défaut d'un héros (<VoieDefaut:> sur sa fiche) se collait
 * à TOUT ce qu'il lançait, Paroles comprises : les Paroles d'Aël armaient le
 * Renvoi (Miroir), celles de Korrah sortaient l'Éclat Noir (Flash, ×2,5),
 * ludwing s'y soignait (Source), Vesper y buvait le sang (Sang).
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. les réglages ;
 *   2. une Parole de chaque héros ne prend plus sa Voie : ni maîtrise, ni effet
 *      — et Korrah ne sort aucun Éclat Noir en 200 Paroles ;
 *   3. contre-épreuve : l'Attaque de chacun la garde, effet compris — l'Éclat
 *      Noir de Korrah sort environ une fois sur quatre ;
 *   4. une technique de l'âme de ludwing (mana spirituel) ne prend pas la Source ;
 *   5. une Voie écrite reste la sienne : Ouvrir (<Voie: sang>) boit toujours ;
 *   6. un objet (Potion Rouge) n'arme pas le Renvoi d'Aël ;
 *   7. les ennemis ne changent pas : la Parole d'un ennemi garde sa Voie par défaut.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/la_regle_pour_tous.js
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

    console.log('=== LA RÈGLE POUR TOUS ===\n');

    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var journal = [];
        var addText = Window_BattleLog.prototype.addText;
        Window_BattleLog.prototype.addText = function (t) { journal.push(String(t)); return addText.apply(this, arguments); };
        var e = $gameTroop.members()[0];
        e.addParam(0, 9999999); e.recoverAll();
        var VOIE = { 1: 'sang', 2: 'flash', 3: 'source', 4: 'miroir' };
        // Vesper en Sang : en Lame, ses mouvements prennent la Voie de l'arme tenue (LesStylesDeVesper, 2026-10-26)
        PacteDeSang.changerStyle('saignee');
        var SIGNE = { sang: /boit le sang/, flash: /ÉCLAT NOIR/, source: /referme ses chairs/, miroir: /Renvoi est prêt/ };
        var out = { reglages: $plugins.filter(function (p) { return p.name === 'MaitriseVoies'; })[0].parameters };

        // n lancers de « id » par le héros « aid » : combien prennent sa Voie, combien en montrent l'effet
        function lancer(aid, id, n, objet) {
            var h = $gameActors.actor(aid), voie = VOIE[aid], o = { maitrise: 0, effet: 0, n: n };
            for (var i = 0; i < n; i++) {
                h.recoverAll(); h.setHp(Math.floor(h.mhp / 2)); h.setMp(h.mmp); h.setTp(100);
                h._voieRenvoi = null; h._voieReflux = null;
                e.recoverAll(); journal.length = 0; $gameSystem._voieMastery = {};
                var a = new Game_Action(h);
                if (objet) { a.setItem(id); a.setTarget($gameParty.members().indexOf(h)); }
                else { a.setSkill(id); a.setTarget(0); }
                var cible = objet ? h : e;
                cible.clearResult(); a.apply(cible);
                if (Voies.mastery(aid, voie) > 0) { o.maitrise++; }
                if (journal.some(function (t) { return SIGNE[voie].test(t); })) { o.effet++; }
            }
            return o;
        }
        function paroleDe(aid) {
            return $gameActors.actor(aid).skills().filter(function (s) {
                return !(s.meta && s.meta.Voie !== undefined) && LaParole.estParole(s) &&
                       s.damage.type === 1 && s.scope === 1 && !LaParole.estLongue(s);
            })[0];
        }

        out.heros = {};
        [1, 2, 3, 4].forEach(function (aid) {
            var p = paroleDe(aid), n = aid === 2 ? 200 : 5;
            out.heros[aid] = {
                nom: $gameActors.actor(aid).name(), voie: VOIE[aid], parole: p ? p.name : null,
                surParole: p ? lancer(aid, p.id, n) : null,
                surAttaque: lancer(aid, 1, n)
            };
        });
        out.ame = { nom: $dataSkills[466].name, r: lancer(3, 466, 5) };          // Aspiration d'Âme : type ame, mana spirituel
        out.ecrite = { nom: $dataSkills[1130].name, r: lancer(1, 1130, 5) };     // Ouvrir : <Voie: sang>
        out.objet = { nom: $dataItems[1].name, r: lancer(4, 1, 5, true) };       // Potion Rouge sur Aël

        // Les ennemis : une Parole d'ennemi garde la Voie par défaut de sa fiche.
        var data = $dataEnemies[e.enemyId()], avant = data.meta.VoieDefaut;
        data.meta.VoieDefaut = 'miroir';
        e._voieRenvoi = null;
        var ael = $gameActors.actor(4); ael.recoverAll();
        var ea = new Game_Action(e); ea.setSkill(1186); ea.setTarget($gameParty.members().indexOf(ael));
        ael.clearResult(); ea.apply(ael);
        out.ennemi = { arme: !!e._voieRenvoi, parole: $dataSkills[1186].name };
        e._voieRenvoi = null;
        if (avant === undefined) { delete data.meta.VoieDefaut; } else { data.meta.VoieDefaut = avant; }
        return out;
    });

    console.log('1) Les réglages');
    v('reglePourTous : oui', r.reglages.reglePourTous === 'true', r.reglages.reglePourTous);
    v('techniques de l\'âme : types 8, 9 · éléments 2 et 7 (JOKO : « mana spirituel » seulement)', r.reglages.typesAme === '8, 9' && r.reglages.elementsAme === '2, 7',
      r.reglages.typesAme + ' · ' + r.reglages.elementsAme);

    console.log('\n2) Une Parole ne prend plus la Voie du héros');
    [1, 2, 3, 4].forEach(function (aid) {
        var h = r.heros[aid], p = h.surParole;
        v(h.nom + ' — « ' + h.parole + ' » : ni maîtrise de ' + h.voie + ', ni son effet',
          p && p.maitrise === 0 && p.effet === 0, p ? p.maitrise + ' maîtrise, ' + p.effet + ' effet sur ' + p.n : 'aucune Parole trouvée');
    });

    console.log('\n3) Contre-épreuve : l\'Attaque la garde');
    [1, 2, 3, 4].forEach(function (aid) {
        var h = r.heros[aid], a = h.surAttaque;
        if (aid === 2) {
            var part = a.effet / a.n;
            v(h.nom + ' — l\'Attaque sort l\'Éclat Noir environ une fois sur quatre', a.maitrise === a.n && part > 0.15 && part < 0.35,
              a.effet + ' sur ' + a.n + ' (' + Math.round(part * 100) + ' %)');
        } else {
            v(h.nom + ' — l\'Attaque prend ' + h.voie + ' et son effet', a.maitrise === a.n && a.effet >= a.n - 1,
              a.maitrise + ' maîtrise, ' + a.effet + ' effet sur ' + a.n);
        }
    });

    console.log('\n4-6) L\'âme, la Voie écrite, l\'objet');
    v('ludwing — « ' + r.ame.nom + ' » (l\'âme) ne prend pas la Source', r.ame.r.maitrise === 0 && r.ame.r.effet === 0,
      r.ame.r.maitrise + ' maîtrise, ' + r.ame.r.effet + ' soin de Source');
    v('Vesper — « ' + r.ecrite.nom + ' » (<Voie: sang> écrite) boit toujours', r.ecrite.r.maitrise === 5 && r.ecrite.r.effet >= 4,
      r.ecrite.r.maitrise + ' maîtrise, ' + r.ecrite.r.effet + ' sur 5');
    v('Aël — une « ' + r.objet.nom + ' » n\'arme pas le Renvoi', r.objet.r.maitrise === 0 && r.objet.r.effet === 0,
      r.objet.r.maitrise + ' maîtrise, ' + r.objet.r.effet + ' Renvoi');

    console.log('\n7) Les ennemis ne changent pas');
    v('la « ' + r.ennemi.parole + ' » d\'un ennemi (Voie par défaut : miroir) arme toujours son Renvoi', r.ennemi.arme);

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
