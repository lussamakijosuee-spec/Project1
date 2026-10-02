/*
 * BANC NAVIGATEUR — LE ROYAUME IMPÉRIAL, DANS UN VRAI COMBAT
 * ---------------------------------------------------------------------------
 * JOKO : « Royaume Impérial est un domaine qui s'active pendant un certain
 * temps, deux minutes, où à chaque fois que quelqu'un meurt, il revient à la
 * vie. […] Il n'y a pas d'autre effet. […] Une âme est déplacée pour ramener
 * la personne à la vie. […] Une compétence qui utilise littéralement tous ses
 * MP. Et un effet fatigue. »
 *
 * Chaque phrase devient une mesure dans le moteur :
 *
 *   « deux minutes »          → 7 200 images de combat, pas un tour
 *   « il revient à la vie »   → un héros à 0 PV ne porte pas l'état de mort
 *   « une âme est déplacée »  → la variable 15 baisse d'autant
 *   « pas d'autre effet »     → l'état 231 n'a aucun trait
 *   « tous ses MP »           → PM à 0 après le lancer
 *   « récupérer des MP »      → la compétence est grisée tant qu'ils manquent
 *   « un effet fatigue »      → l'état 190 se pose à la fermeture
 *
 * Et les contre-épreuves (§6) : sans âmes, la mort est une vraie mort ; hors
 * du domaine, la mort est une vraie mort.
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
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 180000 });

    // Un combat réel : troupe 1, ludwing dans le groupe. On passe par la carte,
    // comme un joueur (et comme seiryu_cinquieme.js).
    await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    // ⚠ Lancer le combat dans la foulée de l'arrivée sur la carte le bloque :
    //   la carte est encore « occupée » (fondu d'entrée) et le changement de
    //   scène attend indéfiniment. On laisse la carte respirer.
    await page.waitForTimeout(1500);
    await page.evaluate(function () {
        [1, 2, 3, 4].forEach(function (id) { if (!$gameParty.members().some(function (m) { return m.actorId() === id; })) { $gameParty.addActor(id); } });
        BattleManager.setup(1, true, true);
        SceneManager.push(Scene_Battle);
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);

    console.log('\n── LA DONNÉE ' + '─'.repeat(60));
    var d = await page.evaluate(function () {
        var s = $dataSkills[71], e = $dataStates[231];
        return {
            nom: s.name, tag: s.meta.DomaineRoyal !== undefined, effets: s.effects,
            etatNom: e.name, etatTraits: e.traits.length,
            afterEvalVivant: s.note.split(/[\r\n]+/).some(function (l) { return /<(?:AFTER EVAL)>/i.test(l); })
        };
    });
    ok('la compétence 71 est Royaume Impérial, et porte <DomaineRoyal>', /^Royaume Impérial/.test(d.nom) && d.tag);
    ok('elle pose l\'état 231', d.effets.length === 1 && d.effets[0].code === 21 && d.effets[0].dataId === 231);
    ok('l\'état 231 n\'a AUCUN trait — « pas d\'autre effet »', d.etatTraits === 0, d.etatNom);
    ok('l\'ancienne résurrection gratuite ne s\'exécute plus', !d.afterEvalVivant);

    console.log('\n── TOUS LES PM ' + '─'.repeat(58));
    var pm = await page.evaluate(function () {
        var l = $gameActors.actor(3), s = $dataSkills[71], out = {};
        l.setMp(l.mmp);
        out.mmp = l.mmp; out.coutPlein = l.skillMpCost(s); out.lancablePlein = l.canUse(s);
        l.setMp(Math.floor(l.mmp * 0.6));
        out.coutPartiel = l.skillMpCost(s); out.lancablePartiel = l.canUse(s);
        l.setMp(0);
        out.lancableVide = l.canUse(s);
        l.setMp(l.mmp);
        return out;
    });
    ok('le coût est tout ce qui reste', pm.coutPlein === pm.mmp, pm.coutPlein + ' / ' + pm.mmp + ' PM');
    ok('PM pleins → lançable', pm.lancablePlein);
    ok('PM à 60 % → grisé, il faut récupérer', !pm.lancablePartiel, 'coût affiché ' + pm.coutPartiel);
    ok('PM à 0 → grisé', !pm.lancableVide);

    console.log('\n── LE LANCER ' + '─'.repeat(60));
    var l1 = await page.evaluate(function () {
        var l = $gameActors.actor(3);
        $gameVariables.setValue(15, 3);
        var k = $gameActors.actor(2);
        k.setHp(0); k.refresh();                     // Korrah tombe AVANT le domaine
        var avantMort = k.isDead();
        var act = new Game_Action(l); act.setSkill(71);
        l.useItem($dataSkills[71]);                  // paie le coût
        act.apply(l);                                // l'effet (portée : soi)
        return {
            pmApres: l.mp, etat: l.isStateAffected(231), actif: Royaume.actif(),
            restant: Royaume.restant(), korrahAvant: avantMort, korrahApres: k.isDead(),
            korrahPV: k.hp, ames: $gameVariables.value(15)
        };
    });
    ok('les PM tombent à 0', l1.pmApres === 0, l1.pmApres + ' PM');
    ok('ludwing porte le Royaume', l1.etat && l1.actif);
    ok('deux minutes au compteur', l1.restant === 120, l1.restant + ' s');
    ok('Korrah, déjà tombée, se relève au déploiement', l1.korrahAvant && !l1.korrahApres, l1.korrahPV + ' PV');
    ok('et une âme a payé', l1.ames === 2, '3 → ' + l1.ames);

    console.log('\n── TOUTE MORT EST RENDUE ' + '─'.repeat(48));
    var m = await page.evaluate(function () {
        var a = $gameActors.actor(4), v = $gameActors.actor(1), out = {};
        a.setHp(0); a.refresh();                     // par les dégâts
        out.ael = { mort: a.isDead(), pv: a.hp, mhp: a.mhp };
        out.ames1 = $gameVariables.value(15);
        v.addState(v.deathStateId());                // par la commande « état de mort »
        out.vesper = { mort: v.isDead(), pv: v.hp };
        out.ames2 = $gameVariables.value(15);
        // plus d'âme : la mort reprend ses droits
        var k = $gameActors.actor(2);
        k.setHp(0); k.refresh();
        out.korrahSansAme = k.isDead();
        out.ames3 = $gameVariables.value(15);
        // on la relève à la main pour la suite
        k.removeState(k.deathStateId()); k.setHp(k.mhp);
        return out;
    });
    ok('Aël tombe par les dégâts → revient à 30 % (le nerf)', !m.ael.mort && m.ael.pv === Math.floor(m.ael.mhp * 0.30),
        m.ael.pv + ' / ' + m.ael.mhp + ' PV');
    ok('une âme de moins', m.ames1 === 1, m.ames1 + ' en réserve');
    ok('Vesper tombe par la commande d\'état → revient', !m.vesper.mort, m.vesper.pv + ' PV');
    ok('une âme de moins', m.ames2 === 0, m.ames2 + ' en réserve');
    ok('sans âme, la mort est une vraie mort (contre-épreuve)', m.korrahSansAme && m.ames3 === 0);

    console.log('\n── LE TEMPS ' + '─'.repeat(61));
    // On laisse vraiment tourner le combat quelques secondes : le compteur
    // doit descendre en TEMPS, pendant que personne ne joue de tour.
    var t0 = await page.evaluate(function () { return { r: Royaume.restant(), tour: $gameTroop.turnCount() }; });
    await page.waitForTimeout(4000);
    var t1 = await page.evaluate(function () { return { r: Royaume.restant(), tour: $gameTroop.turnCount(), fen: !!(SceneManager._scene._fenetreRoyaume && SceneManager._scene._fenetreRoyaume.visible) }; });
    ok('le compteur descend sans qu\'aucun tour passe', t1.r < t0.r && t1.tour === t0.tour,
        t0.r + ' s → ' + t1.r + ' s, tour ' + t0.tour + ' → ' + t1.tour);
    ok('le compte à rebours est à l\'écran', t1.fen);
    await page.screenshot({ path: (process.env.CAPTURES || '/tmp') + '/royaume.png' });

    var f = await page.evaluate(function () {
        var l = $gameActors.actor(3);
        $gameSystem._royaume.images = 1;             // on avance à la dernière image
        Royaume.battre();
        return { actif: Royaume.actif(), etat: l.isStateAffected(231), fatigue: l.isStateAffected(190), relancable: l.canUse($dataSkills[71]) };
    });
    ok('les deux minutes tombent → le domaine se ferme', !f.actif && !f.etat);
    ok('ludwing est épuisé (état 190)', f.fatigue);
    ok('et ne peut pas relancer sans PM', !f.relancable);

    var h = await page.evaluate(function () {
        var a = $gameActors.actor(4);
        $gameVariables.setValue(15, 10);
        a.setHp(0); a.refresh();
        return { mort: a.isDead(), ames: $gameVariables.value(15) };
    });
    ok('hors du domaine, la mort est une vraie mort (contre-épreuve)', h.mort && h.ames === 10);

    console.log('\n── LES ERREURS DU MOTEUR ' + '─'.repeat(48));
    ok('rien n\'a planté', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));

    console.log('\n' + '═'.repeat(74) + '\n   ' + vert + ' vert · ' + rouge + ' rouge\n' + '═'.repeat(74) + '\n');
    await nav.close();
    process.exit(rouge ? 1 : 0);
})();
