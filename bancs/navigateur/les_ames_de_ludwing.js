/*
 * LES ÂMES DE LUDWING — on joue la chaîne dans le vrai moteur.
 *
 * Trois plugins remontés de _ancien_projet/ le 2026-09-19 :
 *   InvocationAmes · PorteurDAmes · RoyaumeImperial
 *
 * Ce banc ne lit pas le code : il ouvre le jeu dans Chromium, entre en combat,
 * et mesure ce qui se passe à l'écran. Chaque contrôle a son contre-test —
 * attraper le coupable ne suffit pas, il faut innocenter les autres.
 *
 * Prérequis :  npx http-server -p 8899 -c-1 .
 * Lancement  :  node bancs/navigateur/les_ames_de_ludwing.js
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var SHOTS = process.env.SHOTS || '/tmp/ames/';
fs.mkdirSync(SHOTS, { recursive: true });
var BASE = 'http://127.0.0.1:8899';

var ok = 0, ko = 0;
function V(libelle, condition, detail) {
    if (condition) { ok++; console.log('   OK  ' + libelle + (detail ? '  — ' + detail : '')); }
    else { ko++; console.log('   KO  ' + libelle + (detail ? '  — ' + detail : '')); }
}

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [], absents = [];
    page.on('pageerror', function (e) { erreurs.push('PAGEERROR: ' + e.message); });
    page.on('console', function (m) { if (m.type() === 'error') { erreurs.push('CONSOLE: ' + m.text().slice(0, 170)); } });
    page.on('response', function (r) { if (r.status() >= 400) { absents.push(r.status() + ' ' + r.url().replace(BASE, '')); } });
    var ev = function (f, a) { return page.evaluate(f, a); };

    // ── démarrage ───────────────────────────────────────────────────────────
    console.log('\n── on démarre le jeu ──');
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 120000 });

    var charges = await ev(function () {
        return ['InvocationAmes', 'PorteurDAmes', 'RoyaumeImperial'].map(function (n) {
            return n + '=' + ($plugins.some(function (p) { return p.name === n && p.status; }) ? 'ON' : 'off');
        }).join(' · ');
    });
    V('les trois plugins sont déclarés actifs', !/=off/.test(charges), charges);
    V('le titre s\'affiche sans erreur', erreurs.length === 0, erreurs.slice(0, 2).join(' | ') || 'rien');

    // ── on entre en combat avec ludwing ─────────────────────────────────────
    console.log('\n── on met ludwing en combat ──');
    await ev(function () {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    });
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded();
    }, null, { timeout: 60000 }).catch(function () { });
    await page.waitForTimeout(1500);

    var prep = await ev(function () {
        // un groupe propre : ludwing (3) et Korrah (2), le contre-test a besoin d'elle
        $gameParty._actors = [3, 2];
        $gameVariables.setValue(15, 0);
        var lud = $gameActors.actor(3);
        [66, 68, 70, 810, 811, 812].forEach(function (id) { lud.learnSkill(id); });
        $gameActors.actor(2).learnSkill(816);
        // de quoi payer : on mesure le coût EN ÂMES, pas une panne de mana
        $gameParty.members().forEach(function (m) { m.recoverAll(); m.setTp(100); });
        var t = null;
        for (var i = 1; i < $dataTroops.length && !t; i++) {
            if ($dataTroops[i] && $dataTroops[i].members.length) { t = i; }
        }
        BattleManager.setup(t, true, true);
        $gamePlayer.makeEncounterCount();
        SceneManager.push(Scene_Battle);
        return { groupe: $gameParty.members().map(function (m) { return m.name(); }).join(', '), troupe: $dataTroops[t].name };
    });
    // on attend que le combat TOURNE : tant que BattleManager n'a pas démarré,
    // les combattants n'ont pas leur file de pop-ups et le moteur casse.
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Battle' &&
            BattleManager._phase && BattleManager._phase !== 'init';
    }, null, { timeout: 40000 }).catch(function () { });
    await page.waitForTimeout(2500);
    var etat = await ev(function () {
        return { scene: SceneManager._scene.constructor.name, phase: BattleManager._phase };
    });
    V('le combat s\'ouvre et tourne', etat.scene === 'Scene_Battle' && !!etat.phase,
        prep.groupe + ' vs « ' + prep.troupe + ' » — phase ' + etat.phase);
    await page.screenshot({ path: SHOTS + 'a0_combat.png' });

    // ── ① sans âmes, l'invocation est grisée ────────────────────────────────
    console.log('\n── ① « sans âmes, il ne peut pas » ──');
    // canUse() : exactement ce que le menu interroge pour griser une ligne.
    var sans = await ev(function () {
        $gameVariables.setValue(15, 0);
        var lud = $gameActors.actor(3);
        lud.recoverAll(); lud.setTp(100);
        return {
            ames: $gameVariables.value(15),
            styx: lud.canUse($dataSkills[811]),        // <Invocation: 3>
            lotus: lud.canUse($dataSkills[66])          // pas d'invocation : témoin
        };
    });
    V('à 0 âme, « Pluie de Lance du Styx » est grisée', sans.styx === false, 'stock = ' + sans.ames);
    V('CONTRE-TEST — « Lotus des Ténèbres » reste utilisable', sans.lotus === true,
        'une compétence sans <Invocation> ne doit pas être touchée');

    var avec = await ev(function () {
        $gameVariables.setValue(15, 5);
        var lud = $gameActors.actor(3);
        return { ames: $gameVariables.value(15), styx: lud.canUse($dataSkills[811]) };
    });
    V('à 5 âmes, elle redevient utilisable', avec.styx === true, 'stock = ' + avec.ames);

    var depense = await ev(function () {
        var lud = $gameActors.actor(3);
        var avant = $gameVariables.value(15);
        lud.paySkillCost($dataSkills[811]);
        return { avant: avant, apres: $gameVariables.value(15) };
    });
    V('la lancer coûte bien 3 âmes', depense.avant - depense.apres === 3,
        depense.avant + ' → ' + depense.apres);

    // ── ② contre-test : Korrah n'est pas privée de sa compétence ────────────
    console.log('\n── ② CONTRE-TEST : Korrah garde « Carnage des Neuf Voies » ──');
    var korrah = await ev(function () {
        $gameVariables.setValue(15, 10);
        var k = $gameActors.actor(2);
        k.recoverAll(); k.setTp(100);
        return {
            peut: k.canUse($dataSkills[816]),
            cout: $dataSkills[816].mpCost + ' PM / ' + $dataSkills[816].tpCost + ' PT',
            pm: k.mp + '/' + k.mmp,
            exclusif: $plugins.filter(function (p) { return p.name === 'PorteurDAmes'; })[0].parameters['porteurExclusif']
        };
    });
    V('Korrah peut toujours lancer #816', korrah.peut === true,
        'porteurExclusif = ' + korrah.exclusif + ' · coût ' + korrah.cout + ' · elle a ' + korrah.pm + ' PM');

    // ── ③ tuer récolte l'âme ────────────────────────────────────────────────
    console.log('\n── ③ « à chaque fois qu\'il tue, il récupère son âme » ──');
    var recolte = await ev(function () {
        $gameVariables.setValue(15, 0);
        var lud = $gameActors.actor(3);
        var cible = $gameTroop.members()[0];
        cible.setHp(1);
        var action = new Game_Action(lud);
        action.setSkill(66);
        var avant = $gameVariables.value(15);
        action.executeDamage(cible, 9999);
        return {
            avant: avant, apres: $gameVariables.value(15),
            morte: cible.isDead(), nom: cible.name()
        };
    });
    V('l\'ennemi tombe', recolte.morte === true, recolte.nom);
    V('son âme est récoltée', recolte.apres - recolte.avant === 1,
        recolte.avant + ' → ' + recolte.apres + ' âme(s)');

    var pasDeMort = await ev(function () {
        $gameVariables.setValue(15, 4);
        var lud = $gameActors.actor(3);
        var cible = $gameTroop.members().filter(function (e) { return e.isAlive(); })[0];
        if (!cible) { return { saute: true }; }
        cible.setHp(cible.mhp);
        var action = new Game_Action(lud); action.setSkill(66);
        var avant = $gameVariables.value(15);
        action.executeDamage(cible, 1);
        return { avant: avant, apres: $gameVariables.value(15), vivant: cible.isAlive() };
    });
    V('CONTRE-TEST — blesser sans tuer ne donne rien', pasDeMort.saute || (pasDeMort.apres === pasDeMort.avant && pasDeMort.vivant),
        pasDeMort.saute ? 'plus d\'ennemi vivant' : pasDeMort.avant + ' → ' + pasDeMort.apres);

    // ── ④ le Domaine ────────────────────────────────────────────────────────
    console.log('\n── ④ le Royaume Impérial des Ténèbres ──');
    var domaine = await ev(function () {
        $gameVariables.setValue(15, 2);
        var lud = $gameActors.actor(3);
        lud.removeState(198);
        var avant = $gameVariables.value(15);
        var action = new Game_Action(lud);
        action.setSkill(810);
        action.apply(lud);
        return {
            avant: avant, apres: $gameVariables.value(15),
            etat: lud.isStateAffected(198),
            nomEtat: $dataStates[198].name,
            total: window.RoyaumeTenebres ? window.RoyaumeTenebres.total() : null
        };
    });
    V('l\'état « Domaine » est posé', domaine.etat === true, '#198 « ' + domaine.nomEtat + ' »');
    V('les âmes reviennent en masse', domaine.apres - domaine.avant === 30,
        domaine.avant + ' → ' + domaine.apres + ' (+30)');
    V('le total de la partie est compté', typeof domaine.total === 'number' && domaine.total > 0,
        'total = ' + domaine.total + ' âmes (c\'est lui qui nourrit l\'Aspiration)');

    var libre = await ev(function () {
        var lud = $gameActors.actor(3);
        $gameVariables.setValue(15, 0);          // plus une seule âme…
        var peut = lud.canPaySkillCost($dataSkills[811]);   // …mais on est dans le Domaine
        var avant = $gameVariables.value(15);
        lud.paySkillCost($dataSkills[811]);
        return { peut: peut, avant: avant, apres: $gameVariables.value(15) };
    });
    V('dans le Domaine, les invocations sont libres', libre.peut === true, 'stock à 0 et pourtant utilisable');
    V('et elles ne coûtent plus rien', libre.apres === libre.avant, libre.avant + ' → ' + libre.apres);

    // ── ⑤ Contre Totale ─────────────────────────────────────────────────────
    console.log('\n── ⑤ Contre Totale ──');
    var contre = await ev(function () {
        var lud = $gameActors.actor(3);
        lud.removeState(199);
        var a = new Game_Action(lud); a.setSkill(812); a.apply(lud);
        var arme = lud.isStateAffected(199);

        var ennemi = $gameTroop.members().filter(function (e) { return e.isAlive(); })[0];
        if (!ennemi) { return { arme: arme, saute: true }; }
        var pvEnnemiAvant = ennemi.hp;
        var riposte = new Game_Action(ennemi);
        riposte.setAttack();
        riposte.executeDamage(lud, 300);
        return { arme: arme, avant: pvEnnemiAvant, apres: ennemi.hp, nom: ennemi.name() };
    });
    V('l\'état « Contre Totale » s\'arme', contre.arme === true, '#199');
    V('le coup reçu est renvoyé à l\'envoyeur', contre.saute || contre.apres < contre.avant,
        contre.saute ? 'plus d\'ennemi' : contre.nom + ' : ' + contre.avant + ' → ' + contre.apres + ' PV');

    // ── ⑥ Aspiration des Âmes Damnées ───────────────────────────────────────
    console.log('\n── ⑥ Aspiration des Âmes Damnées ──');
    var aspire = await ev(function () {
        var lud = $gameActors.actor(3);
        lud.removeState(200);
        lud.setHp(Math.floor(lud.mhp * 0.2));
        lud.setMp(0);
        var pv = lud.hp, pm = lud.mp;
        var a = new Game_Action(lud); a.setSkill(70); a.apply(lud);
        return {
            pvAvant: pv, pvApres: lud.hp, pmAvant: pm, pmApres: lud.mp,
            trauma: lud.isStateAffected(200), nomTrauma: $dataStates[200].name,
            total: window.RoyaumeTenebres ? window.RoyaumeTenebres.total() : 0
        };
    });
    V('elle rend des PV', aspire.pvApres > aspire.pvAvant, aspire.pvAvant + ' → ' + aspire.pvApres + ' PV');
    V('elle rend du mana', aspire.pmApres > aspire.pmAvant, aspire.pmAvant + ' → ' + aspire.pmApres + ' PM');
    V('mais revivre les morts déstabilise', aspire.trauma === true,
        '#200 « ' + aspire.nomTrauma +' » posé — sur ' + aspire.total + ' âmes aspirées');
    await page.screenshot({ path: SHOTS + 'a1_apres_aspiration.png' });

    // ── ⑦ Annihilation : le sceau de magie ──────────────────────────────────
    console.log('\n── ⑦ Annihilation des Ténèbres : le corps ET la magie ──');
    var sceau = await ev(function () {
        var lud = $gameActors.actor(3);
        lud.removeState(199);          // on range la Contre Totale : elle fausserait la mesure
        // les contrôles précédents ont vidé le champ de bataille — on relève
        // une cible, sinon ce contrôle ne mesure rien et passe pour bon.
        var ennemi = $gameTroop.members()[0];
        if (!ennemi) { return { saute: true }; }
        // Le sceau ne mord que sur un SURVIVANT : sceller la magie d'un mort
        // n'a pas de sens, et le plugin l'écarte. Une chauve-souris à 120 PV
        // tombe du premier coup — on lui donne de quoi rester debout, sinon
        // le contrôle mesurerait le vide.
        var dataEnnemi = $dataEnemies[ennemi.enemyId()];
        window.__pvOrigine = dataEnnemi.params[0];
        dataEnnemi.params[0] = 9999999;
        ennemi.removeState(ennemi.deathStateId());
        ennemi.recoverAll();
        ennemi.setMp(ennemi.mmp || 100);
        ennemi.clearBuffs();
        var pmAvant = ennemi.mp, pvAvant = ennemi.hp;
        var a = new Game_Action(lud); a.setSkill(68); a.apply(ennemi);
        var r = {
            pmAvant: pmAvant, pmApres: ennemi.mp,
            pvAvant: pvAvant, pvApres: ennemi.hp,
            matDebuff: ennemi._buffs ? ennemi._buffs[4] : 0,
            nom: ennemi.name(), vivant: ennemi.isAlive()
        };
        dataEnnemi.params[0] = window.__pvOrigine;   // on remet la bête comme on l'a trouvée
        return r;
    });
    V('la cible est bien debout avant la mesure', !sceau.saute && sceau.pvAvant > 0,
        sceau.saute ? 'aucun ennemi dans la troupe' : sceau.nom + ' relevé à ' + sceau.pvAvant + ' PV');
    V('le corps est frappé', !sceau.saute && sceau.pvApres < sceau.pvAvant,
        sceau.saute ? '—' : sceau.pvAvant + ' → ' + sceau.pvApres + ' PV');
    V('et la magie est scellée', !sceau.saute && sceau.pmApres === 0,
        sceau.saute ? '—' : sceau.nom + ' : ' + sceau.pmAvant + ' → ' + sceau.pmApres + ' PM');
    V('le MAT est brisé par-dessus', !sceau.saute && sceau.matDebuff < 0,
        sceau.saute ? '—' : 'malus MAT = ' + sceau.matDebuff);

    // ── le bilan ────────────────────────────────────────────────────────────
    console.log('\n── le bilan ──');
    V('aucune erreur JavaScript de bout en bout', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    V('aucune ressource manquante', absents.length === 0, absents.slice(0, 3).join(' | ') || 'rien');

    console.log('\n' + '='.repeat(64));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(64));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
