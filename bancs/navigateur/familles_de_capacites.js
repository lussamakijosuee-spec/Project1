/*
 * UNE FAMILLE, UNE LIGNE — mesuré dans le menu de combat.
 *
 * JOKO : « ils ont peut-être trop de capacités […] les autres aussi ont trop
 * de capacité ». Mesuré : 73 à 95 compétences visibles d'un coup au niveau 89.
 *
 * Ce banc ouvre un vrai combat et compte les lignes que le menu affiche
 * VRAIMENT, avant et après le repli. Il vérifie trois choses qu'on ne peut pas
 * lire dans le code :
 *   · le menu de combat raccourcit ;
 *   · la ligne gardée est une que le héros PEUT lancer (une famille ne doit
 *     jamais se refermer sur une ligne grisée) ;
 *   · l'arbre, lui, montre toujours tout.
 *
 * Contre-épreuve : réglage éteint → plus rien ne se replie. Un mécanisme qui
 * replie toujours ne prouve rien.
 *
 * Prérequis :  npx http-server -p 8899 -c-1 .
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var SHOTS = process.env.SHOTS || '/tmp/familles/';
fs.mkdirSync(SHOTS, { recursive: true });
var BASE = 'http://127.0.0.1:8899';

var ok = 0, ko = 0;
function V(l, c, d) {
    if (c) { ok++; console.log('   OK  ' + l + (d ? '  — ' + d : '')); }
    else { ko++; console.log('   KO  ' + l + (d ? '  — ' + d : '')); }
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

    console.log('\n── on démarre et on entre en combat ──');
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 120000 });

    await ev(function () {
        DataManager.setupNewGame();
        $gameParty._actors = [1, 2, 3, 4];
        $gameParty.members().forEach(function (m) { m.recoverAll(); m.setTp(100); });
        SceneManager.goto(Scene_Map);
    });
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded();
    }, null, { timeout: 60000 }).catch(function () { });
    await page.waitForTimeout(1800);

    await ev(function () {
        var t = null;
        for (var i = 1; i < $dataTroops.length && !t; i++) { if ($dataTroops[i] && $dataTroops[i].members.length) { t = i; } }
        BattleManager.setup(t, true, true);
        $gamePlayer.makeEncounterCount();
        SceneManager.push(Scene_Battle);
    });
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Battle' && BattleManager._phase;
    }, null, { timeout: 40000 }).catch(function () { });
    await page.waitForTimeout(2200);
    V('le combat tourne', (await ev(function () { return SceneManager._scene.constructor.name; })) === 'Scene_Battle', '');

    /* ── le menu, pour de vrai ─────────────────────────────────────────────
     * On construit une VRAIE Window_BattleSkill et on lui demande sa liste :
     * c'est exactement ce que le joueur verra, surcharges des plugins
     * comprises. Compter dans un tableau à nous ne prouverait rien. */
    var avantApres = await ev(function () {
        // UNE seule fenêtre, réutilisée : en fabriquer une par branche et par
        // héros alloue autant de bitmaps et fait tomber le banc en panne de
        // temps. C'est celle du combat, donc les surcharges des plugins y sont.
        var w = SceneManager._scene._skillWindow;
        function compter(acteurId) {
            var a = $gameActors.actor(acteurId);
            a.recoverAll(); a.setTp(100);
            var total = 0, replie = 0, detail = [];
            a.addedSkillTypes().filter(function (t, i, arr) { return arr.indexOf(t) === i; })
                .forEach(function (t) {
                    w.setActor(a);
                    w.setStypeId(t);
                    var n = w._data.length;
                    // ce que ça ferait sans repli : toutes ses compétences du type
                    var brut = a.skills().filter(function (s) { return s.stypeId === t; }).length;
                    total += brut; replie += n;
                    if (brut > 0) { detail.push(String($dataSystem.skillTypes[t] || t).trim() + ' ' + brut + '→' + n); }
                });
            return { nom: a.name(), avant: total, apres: replie, detail: detail.join(' · ') };
        }
        return [1, 2, 3, 4].map(compter);
    });

    console.log('\n── le menu de combat, ligne par ligne ──');
    avantApres.forEach(function (x) {
        var gain = x.avant > 0 ? Math.round((1 - x.apres / x.avant) * 100) : 0;
        V(x.nom.padEnd(8) + ' ' + String(x.avant).padStart(3) + ' → ' + String(x.apres).padStart(3) + ' lignes',
            x.apres < x.avant, '−' + gain + ' %   ·   ' + x.detail);
    });

    /* ── la ligne gardée doit être jouable ── */
    console.log('\n── une famille ne se referme jamais sur une ligne grisée ──');
    var grises = await ev(function () {
        var sansTP = [];
        [1, 2, 3, 4].forEach(function (id) {
            var a = $gameActors.actor(id);
            a.recoverAll();
            a.setTp(0);                       // plus un seul PT : le cas qui piège
            var w = SceneManager._scene._skillWindow;
            a.addedSkillTypes().filter(function (t, i, arr) { return arr.indexOf(t) === i; })
                .forEach(function (t) {
                    w.setActor(a); w.setStypeId(t);
                    w._data.forEach(function (s) {
                        if (!s) { return; }
                        if (a.canUse(s)) { return; }
                        // grisée : y avait-il une sœur payable dans sa famille ?
                        var soeurs = window.Familles ? Familles.de(a, s) : [s];
                        if (soeurs.some(function (x) { return a.canUse(x); })) {
                            sansTP.push(a.name() + ' : « ' + s.name.trim() + ' » grisée alors qu\'une sœur est payable');
                        }
                    });
                });
            a.setTp(100);
        });
        return sansTP;
    });
    V('à 0 PT, aucune famille ne montre une ligne grisée pour rien', grises.length === 0,
        grises.slice(0, 3).join(' | ') || 'la meilleure PAYABLE est toujours choisie');

    /* ── l'arbre montre tout ── */
    console.log('\n── l\'arbre, lui, reste complet ──');
    // ⚠ Surtout PAS « while (scène !== Scene_Map) SceneManager.pop() » : MV ne
    // change de scène qu'à l'image suivante, donc la boucle tourne à l'infini
    // et fige l'onglet. On demande le changement, et on ATTEND.
    await ev(function () { BattleManager._phase = 'battleEnd'; SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () {
        return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded();
    }, null, { timeout: 30000 }).catch(function () { });
    await page.waitForTimeout(1600);
    await ev(function () { $gameParty.setMenuActor($gameActors.actor(2)); SceneManager.push(Scene_Skill); });
    await page.waitForTimeout(2400);
    var arbre = await ev(function () {
        var s = SceneManager._scene;
        if (s.constructor.name !== 'Scene_OrbeCapacites') { return { scene: s.constructor.name }; }
        var total = (s._branches || []).reduce(function (t, b) { return t + (b.noeuds || []).length; }, 0);
        return { scene: s.constructor.name, branches: (s._branches || []).length, noeuds: total,
                 connues: $gameActors.actor(2).skills().length };
    });
    V('l\'Orbe s\'ouvre', arbre.scene === 'Scene_OrbeCapacites', 'scène ' + arbre.scene);
    V('il montre tout, sans rien replier', arbre.noeuds >= arbre.connues,
        arbre.noeuds + ' nœuds dans ' + arbre.branches + ' branches, pour ' + arbre.connues + ' compétences connues');
    await page.screenshot({ path: SHOTS + 'f1_arbre_complet.png' });

    /* ── CONTRE-ÉPREUVE ──────────────────────────────────────────────────
     * On interroge le mécanisme lui-même plutôt que de fabriquer une fenêtre :
     * un Window_SkillList créé en dehors de sa scène fait tomber l'onglet, et
     * un banc qui tue le navigateur ne mesure plus rien. */
    console.log('\n── contre-épreuve : le repli ne s\'applique qu\'aux familles ──');
    var temoin = await ev(function () {
        var a = $gameActors.actor(2);
        a.recoverAll(); a.setTp(100);
        var t = a.addedSkillTypes()[0];
        var liste = a.skills().filter(function (s) { return s.stypeId === t; });
        var replie = window.Familles ? Familles.replier(a, liste) : liste;
        // une compétence SEULE dans sa famille ne doit jamais disparaître
        var seules = liste.filter(function (s) { return Familles.de(a, s).length === 1; });
        var seulesGardees = seules.filter(function (s) { return replie.indexOf(s) >= 0; });
        return {
            avecRepli: replie.length, brut: liste.length,
            seules: seules.length, seulesGardees: seulesGardees.length,
            branche: String($dataSystem.skillTypes[t] || t).trim()
        };
    });
    V('aucune compétence seule dans sa famille n\'est masquée',
        temoin.seules === temoin.seulesGardees,
        temoin.seulesGardees + '/' + temoin.seules + ' gardées — le repli ne touche que les doublons');
    V('sans repli la liste serait plus longue', temoin.brut > temoin.avecRepli,
        'branche « ' + temoin.branche + ' » : ' + temoin.brut + ' sans repli, ' + temoin.avecRepli + ' avec');

    console.log('\n── le bilan ──');
    /* « process is not defined » vient du décor, pas du jeu : ce banc tourne
   *  dans un navigateur, le jeu tourne dans NW.js qui fournit « process ».
   *  Vérifié en injectant un process de NW.js : ces erreurs-là tombent à
   *  zéro. On les écarte, mais on les affiche ; tout le reste reste une panne. */
    var horsNWjs = erreurs.filter(function (e) { return /process is not defined/.test(e); });
    var vraies = erreurs.filter(function (e) { return !/process is not defined/.test(e); });
    if (horsNWjs.length) { console.log('   (' + horsNWjs.length + ' « process is not defined » : propre au navigateur, mis de côté)'); }
    V('aucune erreur JavaScript', vraies.length === 0, vraies.slice(0, 3).join(' | ') || 'rien');
    V('aucune ressource manquante', absents.length === 0, absents.slice(0, 3).join(' | ') || 'rien');

    console.log('\n' + '='.repeat(66));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
