/*
 * BANC NAVIGATEUR — LE CONTRÔLE DES TAGS, DEMANDÉ AU MOTEUR
 * ---------------------------------------------------------------------------
 * JOKO : « répare tous les tags qui sont pas bons, les notes qui buggent […]
 * une réparation totale dans le sens où, quand tu fais une attaque, ça a du
 * sens. »
 *
 * CE BANC EXISTE PARCE QUE LIRE LE CODE SOURCE M'A TROMPÉ TROIS FOIS.
 *
 * Pour savoir si un tag est LU, j'ai d'abord cherché sa forme dans les 155
 * greffons. Trois échecs d'affilée, tous du même genre :
 *
 *   1. chercher « <Tag: » rate l'écriture de Yanfly, qui compile ses notetags
 *      en « <(?:AI LEVEL):[ ](\d+)> » — le nom y est coupé par un groupe non
 *      capturant. <AI Priority>, porté par 549 ennemis et parfaitement lu,
 *      était compté comme orphelin ;
 *   2. chercher le nom en clair rate « <CUSTOM[ ](.*)[ ]EFFECT> », qui a un
 *      JOKER au milieu. J'ai annoncé à JOKO que 29 états portaient du
 *      JavaScript mort. C'était faux : les 29 sont lus ;
 *   3. chercher partout dans le fichier compte le BANDEAU D'AIDE, où chaque
 *      greffon documente des tags qu'il n'implémente pas.
 *
 * Le moteur, lui, ne se trompe pas. Après le chargement, un tag lu a laissé une
 * TRACE dans l'objet : `customEffectEval` rempli, `aiPattern` compilé, `.meta`
 * garni. On ne lit plus le code : ON DEMANDE AU MOTEUR CE QU'IL A COMPRIS.
 *
 * Il n'est pas automatique : il lui faut Playwright et un serveur.
 *
 *   npx http-server -p 8899 -c-1 .        (dans un autre terminal, à la racine)
 *   node bancs/navigateur/les_tags_vus_par_le_moteur.js
 */

'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var err = [];
    page.on('pageerror', function (e) { err.push(e.message.split('\n')[0]); });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen(); }, null, { timeout: 180000 });

    var r = await page.evaluate(function () {
        var out = { customEffect: [], passives: [], ia: [], meta: {}, sansTrace: [] };

        // ── 1 · les <Custom … Effect> : YEP a-t-il rempli customEffectEval ?
        var CLEFS = ['addState','removeState','leaveState','turnStartState','turnEndState',
            'regenerateState','selectState','deselectState','reactState','respondState',
            'initiateState','confirmState','establishState','concludeState',
            'actionStartState','actionEndState','battle','victory','defeat','escape'];
        $dataStates.forEach(function (s) {
            if (!s || !s.note || !/<\s*Custom[^>]*Effect\s*>/i.test(s.note)) { return; }
            var demandes = (s.note.match(/<\s*Custom\s+([^>]*?)\s+Effect\s*>/gi) || [])
                .map(function (x) { return /<\s*Custom\s+([^>]*?)\s+Effect\s*>/i.exec(x)[1]; });
            var remplis = [];
            if (s.customEffectEval) {
                CLEFS.forEach(function (k) {
                    if (String(s.customEffectEval[k] || '').trim()) { remplis.push(k); }
                });
            }
            out.customEffect.push({
                id: s.id, nom: s.name, demandes: demandes,
                aLaStructure: !!s.customEffectEval,
                remplis: remplis,
                octets: remplis.reduce(function (n, k) { return n + s.customEffectEval[k].length; }, 0)
            });
        });

        // ── 2 · les <Custom Passive Condition> : YEP_AutoPassiveStates
        $dataStates.forEach(function (s) {
            if (!s || !s.note || !/Custom\s*Passive\s*Condition/i.test(s.note)) { return; }
            out.passives.push({ id: s.id, nom: s.name,
                condition: String(s.passiveCondition || s.customPassiveCondition || '').trim().length });
        });

        // ── 3 · les doctrines : YEP_BattleAICore a-t-il rempli aiPattern ?
        var sans = 0, avec = 0;
        $dataEnemies.forEach(function (e) {
            if (!e || !e.name) { return; }
            if (/<AI Priority>/i.test(e.note || '')) {
                if (e.aiPattern && e.aiPattern.length) { avec++; } else { sans++; out.ia.push(e.id + ' ' + e.name); }
            }
        });
        out.iaAvec = avec; out.iaSans = sans;

        // ── 4 · TOUS les tags : MV a-t-il rempli .meta ?
        var SRC = [[$dataActors,'acteur'],[$dataClasses,'classe'],[$dataSkills,'compétence'],
            [$dataItems,'objet'],[$dataWeapons,'arme'],[$dataArmors,'armure'],
            [$dataEnemies,'ennemi'],[$dataStates,'état']];
        SRC.forEach(function (p) {
            (p[0] || []).forEach(function (o) {
                if (!o || !o.note) { return; }
                var re = /<([^<>:\/][^<>:]*)(:?)([^>]*)>/g, m;
                while ((m = re.exec(o.note)) !== null) {
                    var nom = m[1].trim();
                    if (!/^[A-Za-zÀ-ÿ]/.test(nom)) { continue; }
                    var k = nom.toLowerCase();
                    if (!out.meta[k]) { out.meta[k] = { poses: 0, dansMeta: 0, exemple: null }; }
                    out.meta[k].poses++;
                    if (o.meta && o.meta[nom] !== undefined) { out.meta[k].dansMeta++; }
                    if (!out.meta[k].exemple) { out.meta[k].exemple = p[1] + ' #' + o.id + ' ' + String(o.name || '').trim().slice(0, 26); }
                }
            });
        });
        return out;
    });

    console.log('╔' + '═'.repeat(74) + '╗');
    console.log('║  CE QUE LE MOTEUR A RÉELLEMENT LU' + ' '.repeat(41) + '║');
    console.log('╚' + '═'.repeat(74) + '╝');

    console.log('\n── LES <Custom … Effect> ' + '─'.repeat(50));
    var vivants = r.customEffect.filter(function (c) { return c.remplis.length; });
    var morts = r.customEffect.filter(function (c) { return !c.remplis.length; });
    console.log('   ' + r.customEffect.length + ' états en portent · ' + vivants.length + ' ONT ÉTÉ LUS · ' + morts.length + ' non lus');
    console.log('   structure customEffectEval présente : ' + r.customEffect.filter(function (c) { return c.aLaStructure; }).length + '/' + r.customEffect.length);
    if (vivants.length) {
        console.log('\n   ✓ lus (quelques-uns) :');
        vivants.slice(0, 8).forEach(function (c) {
            console.log('        #' + String(c.id).padEnd(4) + String(c.nom).padEnd(26) + c.remplis.join(', ') + '   (' + c.octets + ' octets de code)');
        });
    }
    if (morts.length) {
        console.log('\n   ✗ NON LUS — leur code ne part jamais :');
        morts.forEach(function (c) {
            console.log('        #' + String(c.id).padEnd(4) + String(c.nom).padEnd(26) + 'demande : ' + c.demandes.join(', '));
        });
    }

    console.log('\n── LES <Custom Passive Condition> ' + '─'.repeat(41));
    var pv = r.passives.filter(function (p) { return p.condition > 0; });
    console.log('   ' + r.passives.length + ' états en portent · ' + pv.length + ' ont une condition compilée');

    console.log('\n── LES DOCTRINES <AI Priority> ' + '─'.repeat(44));
    console.log('   ' + r.iaAvec + ' ennemis dont le bloc a été COMPILÉ par YEP_BattleAICore');
    console.log('   ' + r.iaSans + ' dont le bloc n\'a PAS été compilé');
    if (r.ia.length) { r.ia.slice(0, 8).forEach(function (x) { console.log('        ' + x); }); }

    console.log('\n── TOUS LES TAGS : MV les a-t-il mis dans .meta ? ' + '─'.repeat(26));
    var cles = Object.keys(r.meta).sort(function (a, b) { return r.meta[b].poses - r.meta[a].poses; });
    var rates = cles.filter(function (k) { return r.meta[k].dansMeta === 0; });
    console.log('   ' + cles.length + ' tags distincts · ' + (cles.length - rates.length) + ' présents dans .meta · ' + rates.length + ' JAMAIS');
    if (rates.length) {
        console.log('\n   ✗ posés mais absents de .meta — MV ne les voit pas :');
        rates.slice(0, 25).forEach(function (k) {
            console.log('        <' + k + '>' + ' '.repeat(Math.max(1, 30 - k.length)) + String(r.meta[k].poses).padStart(4) + '   ex. ' + r.meta[k].exemple);
        });
        if (rates.length > 25) { console.log('        … +' + (rates.length - 25)); }
    }

    console.log('\n   erreurs JavaScript au chargement : ' + (err.length ? err.slice(0, 3).join(' | ') : 'aucune'));
    try { fs.writeFileSync(__dirname + '/audit_moteur.json', JSON.stringify(r, null, 1)); } catch (e) { }
    await nav.close();
})();
