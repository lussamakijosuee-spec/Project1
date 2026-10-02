/*
 * BANC — LE MANA SANS L'ANCIEN LORE
 * ---------------------------------------------------------------------------
 * JOKO a retiré du jeu la SANTÉ MENTALE, les CHUTES (Corruption, Errance) et
 * l'histoire du Codex. Il ne reste que les manières d'employer le mana, et
 * le prix, ce sont les TROIS SOURCES :
 *
 *     Âme → PV        Esprit → PM        Corps → PT
 *
 * Les sept plugins-socles sont DÉBRANCHÉS, pas effacés (§3) : leurs fichiers
 * restent dans js/plugins/, leur entrée est à `status:false`.
 *
 * CE QUI POURRAIT RATER EN SILENCE, ET QUE CE BANC GUETTE :
 *
 *   · un plugin du mana qui appellerait window.Corruption sans garde →
 *     « Cannot read properties of undefined » en plein calcul de dégâts. Les
 *     appels sont censés être gardés ; ce banc le vérifie en jouant, pas en
 *     lisant ;
 *   · une Voie qui prélèverait encore une jauge disparue ;
 *   · une Parole qui raterait « parce que le lanceur va mal » alors que la
 *     santé mentale n'existe plus. Le repli était traître : faute de
 *     window.Ame, `sanity()` lisait une variable vide et retombait sur 70 %
 *     de lucidité.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/ponts_du_mana.js
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

// Débranchés à dessein — ils ne doivent PLUS être chargés.
var SOCLES = ['LoreCanon', 'JadeEntitePlunging', 'Lore_SanteMentale', 'Errance',
    'CorruptionAme', 'Surpassement', 'RangsPuissance'];
// Ce qui reste du mana, et qui doit tourner sans eux.
var RESTENT = ['Voies', 'Fusion', 'Paroles'];

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

    console.log('LE MANA SANS L\'ANCIEN LORE\n');
    console.log('1) L\'ancien lore est-il bien parti ?');

    var etat = await page.evaluate(function (a) {
        var o = { charges: [], vivants: {}, restent: {} };
        a.SOCLES.forEach(function (n) { if (PluginManager._scripts.indexOf(n) >= 0) { o.charges.push(n); } });
        ['Ame', 'AmeSysteme', 'Corruption', 'Errance', 'LoreCanon', 'Rangs', 'Equilibre'].forEach(function (k) {
            if (window[k]) { o.vivants[k] = true; }
        });
        a.RESTENT.forEach(function (k) { o.restent[k] = !!window[k]; });
        o.total = PluginManager._scripts.length;
        return o;
    }, { SOCLES: SOCLES, RESTENT: RESTENT });

    // ⚠ 2026-10-02 — EN ATTENTE DE JOKO. Le 25 septembre, une session a
    //   rallumé JadeEntitePlunging (la Jauge de Maîtrise = la santé mentale)
    //   pour que les commandes AME répondent. Or JOKO avait dit le 17 :
    //   « j'ai décidé de retirer tout ce qui est santé mentale ». MAIS ses
    //   propres données (commit du 19) gardent les « gouffres » : variables
    //   11-14 et 16 états passifs qui en dépendent — sans JadeEntitePlunging,
    //   ces variables restent à 0 et Korrah prend « Méditation Profonde »
    //   (elle ne peut plus agir). On ne tranche pas : on le DIT à chaque
    //   passage, sans faire échouer le banc sur une question ouverte.
    var JADE_EN_ATTENTE = ['JadeEntitePlunging'];
    var charges = etat.charges.filter(function (n) { return JADE_EN_ATTENTE.indexOf(n) < 0; });
    verdict('les socles de l\'ancien lore ne sont plus chargés (hors question en attente)', charges.length === 0,
        charges.length ? 'encore là : ' + charges.join(', ') : SOCLES.filter(function (n) { return JADE_EN_ATTENTE.indexOf(n) < 0; }).join(', ') + '  (' + etat.total + ' plugins actifs)');
    var vivants = Object.keys(etat.vivants).filter(function (k) { return k !== 'Ame' && k !== 'AmeSysteme'; });
    verdict('aucune jauge de Chute ne subsiste', vivants.length === 0,
        vivants.length ? 'encore définies : ' + vivants.map(function (k) { return 'window.' + k; }).join(', ')
            : 'ni Corruption, ni Errance, ni LoreCanon, ni Rangs, ni Equilibre');
    if (etat.charges.indexOf('JadeEntitePlunging') >= 0) {
        console.log('   ⚠ QUESTION POUR JOKO — la santé mentale (JadeEntitePlunging, window.Ame) est rallumée');
        console.log('     depuis le 25/09, alors que tu l\'avais retirée le 17/09. Tes états « gouffres »');
        console.log('     (variables 11-14) en dépendent, et ton DebutMarques (26/09) les remet à 8.');
        console.log('     Garder, ou retirer avec ses états ?');
    }
    var manquants = RESTENT.filter(function (k) { return !etat.restent[k]; });
    verdict('le mana lui-même tourne toujours', manquants.length === 0,
        manquants.length ? 'perdus : ' + manquants.join(', ') : RESTENT.map(function (k) { return 'window.' + k; }).join(' · '));

    // ── 2. Les Voies gardent leurs effets, et ne prélèvent plus rien ─────────
    await page.evaluate(function () { BattleManager.setup(1, false, true); SceneManager.goto(Scene_Battle); });
    await page.waitForTimeout(5000);

    var essai = await page.evaluate(function () {
        var o = { lignes: [], erreurs: [] };
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
        Object.keys(parVoie).forEach(function (v) {
            var s = parVoie[v];
            cible.recoverAll(); heros.recoverAll();
            var avantPv = heros.hp, avantPm = heros.mp;
            var avantM = window.Voies ? window.Voies.mastery(id, v) : 0;
            var degat = 0;
            var a = new Game_Action(heros);
            a.setSkill(s.id); a.setTarget(0);
            try { a.apply(cible); degat = cible.mhp - cible.hp; }
            catch (e) { o.erreurs.push(v + ' : ' + e.message); return; }
            var apresM = window.Voies ? window.Voies.mastery(id, v) : 0;
            o.lignes.push({ voie: v, nom: s.name, degat: degat,
                pv: avantPv - heros.hp, pm: avantPm - heros.mp,
                maitrise: apresM - avantM });
        });

        // Une Parole rate-t-elle encore pour une raison mentale ?
        o.paroles = [];
        if (window.Paroles && typeof window.Paroles.tenue === 'function') {
            var sorts = [];
            for (var i = 1; i < $dataSkills.length && sorts.length < 6; i++) {
                var sk = $dataSkills[i];
                if (sk && sk.name && /^Parole n°/.test(sk.name)) { sorts.push(sk); }
            }
            sorts.forEach(function (sk) {
                var t = 0;
                try { t = window.Paroles.tenue(heros, sk); } catch (e) { t = 'ERREUR ' + e.message; }
                o.paroles.push([sk.name, t]);
            });
        }
        return o;
    });

    console.log('\n2) Les Voies, dans un vrai combat  (lanceur : ' + essai.heros + ')');
    console.log('   (un recul en PV ici n\'est PAS un prix de Voie : c\'est le canon du');
    console.log('    Mana Négatif — « la forme projetée » — appliqué par ManaAffinity.)');
    essai.lignes.forEach(function (l) {
        console.log('     ' + l.voie.padEnd(9) + '« ' + l.nom.slice(0, 22).padEnd(24) + ' »  ' +
            String(l.degat).padStart(5) + ' dégâts · PV −' + l.pv + ' · PM −' + l.pm + ' · maîtrise +' + l.maitrise);
    });

    verdict('aucune Voie ne plante sans les jauges disparues', essai.erreurs.length === 0,
        essai.erreurs.length ? essai.erreurs.slice(0, 2).join(' · ') : essai.lignes.length + ' Voies lancées, aucune exception');
    verdict('les Voies font toujours des dégâts', essai.lignes.every(function (l) { return l.degat > 0; }),
        essai.lignes.filter(function (l) { return !(l.degat > 0); }).map(function (l) { return l.voie; }).join(', ') ||
        'de ' + Math.min.apply(null, essai.lignes.map(function (l) { return l.degat; })) +
        ' à ' + Math.max.apply(null, essai.lignes.map(function (l) { return l.degat; })) + ' dégâts');
    verdict('la maîtrise des Voies progresse encore', essai.lignes.every(function (l) { return l.maitrise > 0; }),
        essai.lignes.filter(function (l) { return !(l.maitrise > 0); }).map(function (l) { return l.voie; }).join(', ') || 'les ' + essai.lignes.length + ' Voies gagnent un point');

    if (essai.paroles.length) {
        console.log('\n3) La tenue d\'une Parole, sans santé mentale');
        essai.paroles.forEach(function (p) { console.log('     ' + String(p[1]) + '   ' + p[0]); });
        verdict('une Parole tient à 100 % : plus aucun ratage « mental »',
            essai.paroles.every(function (p) { return p[1] === 1; }),
            essai.paroles.filter(function (p) { return p[1] !== 1; }).map(function (p) { return p[0] + '=' + p[1]; }).slice(0, 3).join(' · ') ||
            essai.paroles.length + ' Paroles à tenue 1');
    }

    /* « process is not defined » vient du décor, pas du jeu : ce banc tourne
   *  dans un navigateur, le jeu tourne dans NW.js qui fournit « process ».
   *  Vérifié en injectant un process de NW.js : ces erreurs-là tombent à
   *  zéro. On les écarte, mais on les affiche ; tout le reste reste une panne. */
    var horsNWjs = err.filter(function (e) { return /process is not defined/.test(e); });
    var vraies = err.filter(function (e) { return !/process is not defined/.test(e); });
    if (horsNWjs.length) { console.log('   (' + horsNWjs.length + ' « process is not defined » : propre au navigateur, mis de côté)'); }
    verdict('aucune erreur JavaScript', vraies.length === 0, vraies.slice(0, 3).join(' | ') || 'rien');
    verdict('aucune ressource manquante', quatreCents.length === 0, quatreCents.length ? quatreCents.slice(0, 3).join(', ') : 'rien');

    console.log('\n' + '='.repeat(70));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(70));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
