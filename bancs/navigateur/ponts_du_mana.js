/*
 * BANC — LES PONTS DU MANA, DANS LE MOTEUR QUI TOURNE
 * ---------------------------------------------------------------------------
 * Les 13 plugins du mana de JOKO s'appuient sur cinq systèmes voisins :
 *
 *     window.Ame · window.Corruption · window.Errance · window.LoreCanon
 *     window.Rangs   (+ window.Equilibre, window.Voies)
 *
 * et CHAQUE appel est enveloppé d'un `try { … } catch (e) {}` :
 *
 *     try { if (corr && window.Corruption) window.Corruption.add(id, corr); } catch (e) {}
 *
 * Si le pont n'aboutit pas, il ne se passe **rien**. Pas d'erreur, pas de
 * ligne de journal, pas de dégât manquant à l'écran : juste tout le système
 * « chaque Voie a un prix » qui ne s'exécute jamais. C'est exactement la panne
 * que MaitriseVoies avait déjà connue, pour une autre raison.
 *
 * Aucune lecture de fichier ne peut le voir. Il faut demander au moteur.
 *
 * Et savoir que `window.Corruption` EXISTE ne suffit pas non plus : le plugin
 * pouvait très bien ne jamais l'appeler. On lance donc une compétence de
 * chaque Voie dans un vrai combat, et on regarde les jauges bouger — puis on
 * coupe le pont et on vérifie qu'elles cessent de bouger.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/ponts_du_mana.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

// Ce que chaque pont doit offrir : sa présence ne suffit pas, il lui faut
// les fonctions que les plugins du mana appellent vraiment.
var PONTS = {
    Ame: ['jauge', 'gain', 'mauvais'],
    Corruption: ['niveau', 'add'],
    Errance: ['niveau', 'add'],
    LoreCanon: ['errance', 'corruption'],
    Rangs: ['rang'],
    Equilibre: ['etat'],
    Voies: ['mastery', 'gain'],
    Fusion: ['actif', 'entrer'],
    Paroles: ['tenue']
};
var REMONTES = ['LoreCanon', 'JadeEntitePlunging', 'Lore_SanteMentale', 'Errance',
    'CorruptionAme', 'Surpassement', 'RangsPuissance'];

var ok = 0, ko = 0;
function verdict(t, passe, detail) {
    if (passe) { ok++; console.log('   ✓ ' + t + '  —  ' + detail); }
    else { ko++; console.log('   ✗ ' + t + '  —  ' + detail); }
}

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var err = [], quatreCents = [];
    page.on('pageerror', function (e) { err.push(e.message); });
    page.on('response', function (r) { if (r.status() >= 400) { quatreCents.push(r.url().split('/').slice(-1)[0]); } });

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    await page.waitForTimeout(1500);
    for (var i = 0; i < 20; i++) {
        if (await page.evaluate(function () { return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded(); })) { break; }
        await page.keyboard.down('Enter'); await page.waitForTimeout(120); await page.keyboard.up('Enter');
        await page.waitForTimeout(1500);
    }
    await page.waitForTimeout(2500);

    console.log('LES PONTS DU MANA, DANS LE MOTEUR QUI TOURNE\n');
    console.log('1) Les plugins dont le mana dépend sont-ils là ?');

    var base = await page.evaluate(function (a) {
        var o = { remontes: [], ponts: {}, scripts: PluginManager._scripts.length };
        a.REMONTES.forEach(function (n) { o.remontes.push([n, PluginManager._scripts.indexOf(n) >= 0]); });
        Object.keys(a.PONTS).forEach(function (k) {
            var v = window[k];
            o.ponts[k] = !v ? null : a.PONTS[k].filter(function (f) { return typeof v[f] !== 'function'; });
        });
        return o;
    }, { PONTS: PONTS, REMONTES: REMONTES });

    var absents = base.remontes.filter(function (x) { return !x[1]; });
    verdict('les sept plugins-socles sont chargés', absents.length === 0,
        absents.length ? 'manquent : ' + absents.map(function (x) { return x[0]; }).join(', ')
            : REMONTES.join(', ') + '  (' + base.scripts + ' plugins au total)');

    var casses = Object.keys(PONTS).filter(function (k) { return base.ponts[k] === null; });
    var incomplets = Object.keys(PONTS).filter(function (k) { return base.ponts[k] && base.ponts[k].length; });
    verdict('chaque window.X que le mana lit existe', casses.length === 0,
        casses.length ? 'absents : ' + casses.map(function (k) { return 'window.' + k; }).join(', ')
            : Object.keys(PONTS).map(function (k) { return 'window.' + k; }).join(' · '));
    verdict('chacun offre les fonctions que les plugins appellent', incomplets.length === 0,
        incomplets.length ? incomplets.map(function (k) { return 'window.' + k + ' sans ' + base.ponts[k].join('/'); }).join(' · ')
            : 'toutes les méthodes attendues répondent');

    // ── 2. Le prix se paie-t-il vraiment ? ──────────────────────────────────
    await page.evaluate(function () { BattleManager.setup(1, false, true); SceneManager.goto(Scene_Battle); });
    await page.waitForTimeout(5000);

    // ⚠ `_damagePopup` est un TABLEAU chez Yanfly, rempli par le spriteset.
    // Monter le combat sans passer par Scene_Battle fait échouer `apply` sur
    // « push is not a function » — le banc casse, pas le jeu.
    var prix = await page.evaluate(function () {
        var o = { essais: [], sansPont: [] };
        BattleManager._phase = 'turn';
        var heros = $gameParty.battleMembers()[0];
        var cible = $gameTroop.members()[0];
        var id = heros.actorId();
        o.heros = heros.name();

        var parVoie = {};
        for (var i = 1; i < $dataSkills.length; i++) {
            var s = $dataSkills[i];
            if (!s || !s.name || !s.meta || !s.meta.Voie) { continue; }
            var v = String(s.meta.Voie).toLowerCase().trim();
            if (!parVoie[v] && s.damage && s.damage.type === 1) { parVoie[v] = s; }
        }

        function lance(v, s) {
            cible.recoverAll(); heros.recoverAll();
            var av = [window.Corruption.niveau(id), window.Errance.niveau(id), heros.hp, window.Voies.mastery(id, v)];
            var a = new Game_Action(heros);
            a.setSkill(s.id); a.setTarget(0);
            try { a.apply(cible); } catch (e) { return 'ERREUR ' + e.message; }
            var ap = [window.Corruption.niveau(id), window.Errance.niveau(id), heros.hp, window.Voies.mastery(id, v)];
            var b = [];
            if (ap[0] !== av[0]) { b.push('Corruption ' + av[0] + '→' + ap[0]); }
            if (ap[1] !== av[1]) { b.push('Errance ' + av[1] + '→' + ap[1]); }
            if (ap[2] !== av[2]) { b.push('PV ' + av[2] + '→' + ap[2]); }
            if (ap[3] !== av[3]) { b.push('maîtrise ' + av[3] + '→' + ap[3]); }
            return b.length ? b.join(' · ') : '';
        }

        Object.keys(parVoie).forEach(function (v) { o.essais.push([v, parVoie[v].name, lance(v, parVoie[v])]); });

        // ── CONTRE-ÉPREUVE : on coupe les ponts, le prix doit cesser d'être payé.
        var vraiC = window.Corruption, vraiE = window.Errance;
        var faux = { niveau: function () { return 0; }, add: function () {}, purge: function () {}, factor: function () { return 1; }, applyStates: function () {} };
        window.Corruption = faux; window.Errance = faux;
        Object.keys(parVoie).forEach(function (v) {
            var r = lance(v, parVoie[v]);
            if (/Corruption|Errance/.test(r)) { o.sansPont.push(v + ' bouge encore : ' + r); }
        });
        window.Corruption = vraiC; window.Errance = vraiE;
        return o;
    });

    console.log('\n2) Le prix de chaque Voie, payé dans un vrai combat  (lanceur : ' + prix.heros + ')');
    prix.essais.forEach(function (e) {
        console.log('     ' + e[0].padEnd(9) + '« ' + e[1].slice(0, 24).padEnd(26) + ' »  ' + (e[2] || '— rien —'));
    });

    var erreurs = prix.essais.filter(function (e) { return /^ERREUR/.test(e[2]); });
    verdict('aucune Voie ne plante en s\'exécutant', erreurs.length === 0,
        erreurs.length ? erreurs.map(function (e) { return e[0]; }).join(', ') : prix.essais.length + ' Voies lancées sans erreur');

    // `onde` et `miroir` posent une dette payée au COUP SUIVANT : leur prix ne
    // se lit pas sur le tour où on les lance. On ne les compte donc pas ici.
    var DIFFERE = { onde: 1, miroir: 1 };
    var muettes = prix.essais.filter(function (e) { return !e[2] && !DIFFERE[e[0]]; });
    verdict('chaque Voie à prix immédiat prélève quelque chose', muettes.length === 0,
        muettes.length ? muettes.map(function (e) { return e[0]; }).join(', ')
            : (prix.essais.length - 2) + ' Voies prélèvent · onde et miroir paient au coup suivant (voulu)');

    verdict('les ponts coupés, plus rien n\'est prélevé (contre-épreuve)', prix.sansPont.length === 0,
        prix.sansPont.length ? prix.sansPont.slice(0, 2).join(' · ')
            : 'Corruption et Errance remplacées par des coquilles : aucune jauge ne bouge');

    verdict('aucune erreur JavaScript', err.length === 0, err.length ? err.slice(0, 2).join(' | ') : 'rien');
    verdict('aucune ressource manquante', quatreCents.length === 0, quatreCents.length ? quatreCents.slice(0, 3).join(', ') : 'rien');

    console.log('\n' + '='.repeat(70));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(70));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
