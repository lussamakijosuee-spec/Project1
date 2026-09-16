/*
 * LES DOCTRINES, DANS LE MOTEUR QUI TOURNE
 * ---------------------------------------------------------------------------
 * `bancs/9_doctrines.js` lit les fichiers et rejoue les expressions régulières
 * de `YEP_BattleAICore`. Il reste deux choses qu'aucune lecture ne peut dire :
 *
 *   1. que Yanfly LISE vraiment les blocs au chargement. Ses notetags sont
 *      analysés dans `DataManager.processCoreAINotetags1`, qui ne se plaint de
 *      rien : un bloc mal fermé donne un `aiPattern` vide, et l'ennemi retombe
 *      sur l'IA ordinaire de MV comme si de rien n'était ;
 *   2. que la cadence des boss choisisse la bonne compétence au bon tour.
 *
 * Ici on ouvre le jeu, on monte un vrai combat, et on demande au moteur
 * lui-même ce que le boss a décidé — tour par tour, et sur 200 tirages pour
 * la ligne qui dépend du hasard.
 *
 * Trois pièges rencontrés en l'écrivant, et qui font croire que l'IA est morte :
 *
 *   · `BattleManager.setup` rappelle `$gameTroop.setup(troopId)` : remplacer
 *     les ennemis AVANT, c'est les voir écrasés ;
 *   · sans `BattleManager.startBattle()`, `$gameParty.inBattle()` reste faux et
 *     `meetsSkillConditions` refuse TOUTE compétence en « combat seulement ».
 *     L'ennemi ne décidait rien, et ce n'était pas sa doctrine ;
 *   · `Game_Battler.turnCount()` rend `$gameTroop.turnCount()` en combat au
 *     tour : pousser `_turnCount` sur le combattant ne change rien.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/doctrines_en_combat.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

var ok = 0, ko = 0;
function verdict(titre, passe, detail) {
    if (passe) { ok++; console.log('   ✓ ' + titre + '  —  ' + detail); }
    else { ko++; console.log('   ✗ ' + titre + '  —  ' + detail); }
}

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message); });

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    await page.waitForTimeout(1500);
    // L'écran-titre avale parfois la première touche pendant son fondu.
    for (var essai = 0; essai < 20; essai++) {
        if (await page.evaluate(function () { return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded(); })) { break; }
        await page.keyboard.down('Enter'); await page.waitForTimeout(120); await page.keyboard.up('Enter');
        await page.waitForTimeout(1500);
    }
    await page.waitForTimeout(2500);

    var r = await page.evaluate(function () {
        var out = { lus: 0, sansPattern: 0, niveaux: [], boss: null, cadence: [], plein: {}, blesse: {}, erreurs: [] };

        for (var i = 1; i < $dataEnemies.length; i++) {
            var e = $dataEnemies[i];
            if (!e || !e.name) { continue; }
            if (e.aiPattern && e.aiPattern.length) { out.lus++; } else { out.sansPattern++; }
            var n = Math.round((e.aiLevel || 0) * 100);
            if (out.niveaux.indexOf(n) < 0) { out.niveaux.push(n); }
        }

        var boss = null;
        for (var i = 1; i < $dataEnemies.length; i++) {
            var e = $dataEnemies[i];
            if (e && e.name && /<\s*Boss\s*>/i.test(e.note || '') && e.aiPattern &&
                e.aiPattern.some(function (l) { return /TURN % 3 === 1/.test(l); })) { boss = e; break; }
        }
        if (!boss) { out.erreurs.push('aucun boss à cadence trouvé'); return out; }

        BattleManager.setup(1, false, true);
        $gameTroop._enemies = [new Game_Enemy(boss.id, 400, 300)];
        BattleManager.startBattle();
        BattleManager._phase = 'input';
        var g = $gameTroop.members()[0];
        g.recoverAll();

        var pattern = boss.aiPattern.slice();
        var annonce = null, coup = null;
        pattern.forEach(function (l) {
            var m = /TURN % 3 === (\d): Skill (\d+)/.exec(l);
            if (!m) { return; }
            if (m[1] === '1') { annonce = +m[2]; } else if (m[1] === '2') { coup = +m[2]; }
        });
        out.boss = { nom: boss.name, lignes: pattern, annonce: annonce && $dataSkills[annonce].name,
            coup: coup && $dataSkills[coup].name };

        // L'aiLevel saute une ligne au hasard : on l'écarte pour observer la
        // cadence elle-même, et non le tirage qui la voile.
        var vrai = Game_Enemy.prototype.aiLevel;
        Game_Enemy.prototype.aiLevel = function () { return 1.0; };

        function decide(tour, pv) {
            g.setHp(Math.floor(g.mhp * pv)); g._mp = g.mmp; g._tp = 0;
            $gameTroop._turnCount = tour;
            g.clearActions(); g.makeActions();
            var a = g.currentAction(), s = a && a.item();
            return s ? s.name : '(rien)';
        }
        for (var t = 0; t < 6; t++) { out.cadence.push([t + 1, decide(t, 1.0)]); }

        // La ligne de désespoir, mesurée dans les DEUX sens, sur le tour où la
        // cadence donne autre chose : elle doit apparaître sous 30 % de vie, et
        // jamais quand le boss est au complet.
        function echantillon(pv, n) {
            var c = {};
            for (var k = 0; k < n; k++) { var nom = decide(2, pv); c[nom] = (c[nom] || 0) + 1; }
            return c;
        }
        out.plein = echantillon(1.0, 200);
        out.blesse = echantillon(0.2, 200);
        Game_Enemy.prototype.aiLevel = vrai;
        return out;
    });

    console.log('LES DOCTRINES DANS LE MOTEUR QUI TOURNE\n');
    if (r.erreurs.length) { console.log('   ⚠ ' + r.erreurs.join(' | ')); }

    verdict('Yanfly a lu le bloc de CHAQUE ennemi', r.sansPattern === 0,
        r.lus + ' blocs relus par le moteur · ' + r.sansPattern + ' sans');
    verdict('les niveaux d\'IA sont relus et étagés', r.niveaux.length >= 5,
        r.niveaux.length + ' valeurs distinctes, de ' + Math.min.apply(null, r.niveaux) + ' à ' + Math.max.apply(null, r.niveaux));

    if (r.boss) {
        console.log('\n   ── ' + r.boss.nom);
        r.boss.lignes.forEach(function (l) { console.log('        ' + l); });
        console.log('\n   ── ce que le moteur décide vraiment, tour par tour');
        r.cadence.forEach(function (c) { console.log('        tour ' + c[0] + '  →  ' + c[1]); });
        console.log();

        // Trois temps : annonce, coup, autre chose. Puis ça recommence.
        var noms = r.cadence.map(function (c) { return c[1]; });
        verdict('le boss annonce au tour 1 et frappe au tour 2',
            noms[0] === r.boss.annonce && noms[1] === r.boss.coup,
            'tour 1 « ' + noms[0] +' » · tour 2 « ' + noms[1] + ' »');
        verdict('la cadence se répète à l\'identique au tour suivant',
            noms[3] === noms[0] && noms[4] === noms[1] && noms[5] === noms[2],
            'tours 4-6 = tours 1-3 : ' + noms.slice(3).join(' · '));
        verdict('le troisième temps n\'est ni l\'annonce ni le coup',
            noms[2] !== r.boss.annonce && noms[2] !== r.boss.coup,
            'tour 3 « ' + noms[2] + ' »');

        var cle = r.boss.coup;
        var sousSeuil = r.blesse[cle] || 0, auComplet = r.plein[cle] || 0;
        verdict('sous 30 % de vie, le coup revient hors du rythme',
            sousSeuil > 60 && sousSeuil < 140,
            sousSeuil + ' fois sur 200 au tour 3 (attendu ~100)');
        verdict('au complet, il ne sort JAMAIS hors du rythme (contre-épreuve)',
            auComplet === 0,
            auComplet + ' fois sur 200 · ' + JSON.stringify(r.plein));
    }

    if (erreurs.length) { console.log('\n   ⚠ ' + erreurs.length + ' erreur(s) JavaScript : ' + erreurs.slice(0, 3).join(' | ')); }
    console.log('\n' + '='.repeat(70));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(70));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
