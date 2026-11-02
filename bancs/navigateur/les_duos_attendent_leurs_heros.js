/*
 * LES DUOS ATTENDENT LEURS HÉROS — et les notes disent vrai
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-02 : « réglé les problèmes des note dans les capacités ou les
 * ennemis », puis, sur la liste mesurée : « Les trois ».
 *
 *   ① une attaque à plusieurs (<Combo: 1,3>) se lance quand ses héros sont là,
 *     au combat et debout ;
 *   ② un héros absent de l'équipe, ou tombé : grisée, et l'aide dit qui manque ;
 *   ③ contre-épreuves : une capacité ordinaire n'est pas touchée, ni les six
 *     duos de DoubleX (leur <Combo:> n'a pas de numéros), ni un ennemi ;
 *   ④ Aube Ardente (<Combo: 4,1>), que Korrah apprend : il lui faut Aël ET Vesper ;
 *   ⑤ les notes disent vrai : chaque duo nomme les héros de sa <Combo:>, et
 *     chaque <Mana:> dit un des courants (une valeur fausse, plantée exprès, est
 *     attrapée).
 *
 *   node bancs/navigateur/les_duos_attendent_leurs_heros.js
 *   (le banc lance son propre petit serveur)
 */
'use strict';
var { chromium } = require('playwright');
var http = require('http'), fs = require('fs'), path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.ttf': 'font/ttf', '.woff': 'font/woff', '.otf': 'font/otf' };
var serveur = http.createServer(function (req, res) {
    var f = path.join(RACINE, decodeURIComponent(req.url.split('?')[0]));
    if (f.indexOf(RACINE) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
});
var erreurs = [];

(async function () {
    await new Promise(function (r) { serveur.listen(0, '127.0.0.1', r); });
    var nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    await page.goto('http://127.0.0.1:' + serveur.address().port + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title'; }, null, { timeout: 180000 });

    var r = await page.evaluate(function () {
        DataManager.setupNewGame();
        var out = {}, P = $gameParty;
        var vesper = $gameActors.actor(1), korrah = $gameActors.actor(2), ludwing = $gameActors.actor(3), ael = $gameActors.actor(4);
        [1, 2, 3, 4].forEach(function (id) { if (P._actors.indexOf(id) < 0) P.addActor(id); });
        P._inBattle = true;
        function pret(a) { a.recoverAll(); a._tp = a.maxTp(); a.clearStates(); }
        [vesper, korrah, ludwing, ael].forEach(pret);
        var fureur = $dataSkills[413], aube = $dataSkills[416];
        function peut(a, s) { return a.meetsUsableItemConditions(s); }
        // ① tout le monde est là
        out.ensemble = peut(vesper, fureur);
        out.manquantsEnsemble = LesTroisArts.manquants(fureur).length;
        // ② ludwing hors de l'équipe, puis tombé
        P.removeActor(3);
        out.sansLui = peut(vesper, fureur);
        // l'aide le dit
        var aide = new Window_Help(2), liste = new Window_SkillList(0, 0, 400, 200);
        liste.setHelpWindow(aide); liste.setActor(vesper);
        liste._data = [fureur]; liste.select(0); liste.updateHelp();
        out.aide = aide._text;
        P.addActor(3); pret(ludwing);
        ludwing.addState(ludwing.deathStateId());
        out.tombe = peut(vesper, fureur);
        ludwing.removeState(ludwing.deathStateId()); pret(ludwing);
        out.debout = peut(vesper, fureur);
        // ③ contre-épreuves
        var ordinaire = vesper.skills().filter(function (s) { return !(s.meta && s.meta.Combo) && s.damage && s.damage.type === 1 && vesper.meetsUsableItemConditions(s); })[0];
        P.removeActor(3);
        out.ordinaire = ordinaire ? [ordinaire.name, peut(vesper, ordinaire)] : null;
        out.doublex = LesTroisArts.manquants($dataSkills[1303]).length;
        var ennemi = new Game_Enemy(1, 0, 0);
        out.ennemi = ennemi.meetsUsableItemConditions(fureur) === Game_BattlerBase.prototype.meetsUsableItemConditions.call(ennemi, fureur);
        P.addActor(3); pret(ludwing);
        // ④ Aube Ardente, chez Korrah : Aël et Vesper
        out.aubeTous = peut(korrah, aube);
        P.removeActor(4);
        out.aubeSansAel = peut(korrah, aube);
        out.aubeManque = LesTroisArts.manquants(aube).map(function (id) { return $gameActors.actor(id).name(); }).join(',');
        P.addActor(4);
        // hors combat : dans l'équipe suffit (pas de « membres au combat »)
        P._inBattle = false;
        out.horsCombat = LesTroisArts.manquants(fureur).length;
        return out;
    });
    console.log('\n① Les héros sont là');
    V('Vesper lance Fureur Spectrale avec ludwing au combat', r.ensemble === true && r.manquantsEnsemble === 0);
    console.log('\n② Un héros manque');
    V('ludwing hors de l\'équipe : grisée', r.sansLui === false);
    V('… et l\'aide dit qui manque', /Il manque : ludwing/.test(r.aide || ''), String(r.aide).split('\n')[1]);
    V('ludwing tombé : grisée', r.tombe === false);
    V('ludwing relevé : de nouveau utilisable', r.debout === true);
    console.log('\n③ Contre-épreuves');
    V('une capacité ordinaire de Vesper reste utilisable sans ludwing', r.ordinaire && r.ordinaire[1] === true, r.ordinaire && r.ordinaire[0]);
    V('les six duos de DoubleX gardent leur propre règle', r.doublex === 0);
    V('un ennemi n\'est pas touché', r.ennemi === true);
    console.log('\n④ Aube Ardente, que Korrah apprend');
    V('avec Aël et Vesper : utilisable', r.aubeTous === true);
    V('sans Aël : grisée, Aël manque', r.aubeSansAel === false && r.aubeManque === 'Aël', r.aubeManque);
    V('hors combat, l\'équipe suffit', r.horsCombat === 0);

    // ⑤ les notes disent vrai (les fichiers)
    console.log('\n⑤ Les notes disent vrai');
    var S = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Skills.json'), 'utf8'));
    var E = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Enemies.json'), 'utf8'));
    var A = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Actors.json'), 'utf8'));
    function nomsFaux(liste) {
        var faux = [];
        liste.forEach(function (s) {
            if (!s) return;
            var m = /<Combo\s*:\s*([\d,\s]+)>/i.exec(s.note || '');
            var d = /^([^:—]+?)\s*:/.exec(s.description || '');
            if (!m || !d || !/&/.test(d[1])) return;
            var attendus = m[1].split(',').map(function (x) { return A[Number(x)].name.trim().toLowerCase(); }).sort();
            var dits = d[1].split(/\s*&\s*/).map(function (x) { return x.trim().toLowerCase(); }).sort();
            if (JSON.stringify(attendus) !== JSON.stringify(dits)) faux.push(s.id + ' ' + d[1]);
        });
        return faux;
    }
    var COURANTS = ['positif', 'negatif', 'spirituel', 'spirituelle', 'pur'];
    function manasFaux(listes) {
        var faux = [];
        listes.forEach(function (l) { l.forEach(function (o) { var m = o && /<Mana\s*:\s*([^>]*)>/i.exec(o.note || ''); if (m && COURANTS.indexOf(m[1].trim().toLowerCase()) < 0) faux.push(o.id + ' ' + m[1].trim()); }); });
        return faux;
    }
    var nf = nomsFaux(S), mf = manasFaux([S, E]);
    V('chaque duo nomme les héros de sa <Combo:>', nf.length === 0, nf.join(' · '));
    V('chaque <Mana:> dit un courant (positif, negatif, spirituel, pur)', mf.length === 0, mf.join(' · '));
    // contre-épreuves : une description fausse et un <Mana: sombre> plantés exprès sont attrapés
    var S2 = JSON.parse(JSON.stringify(S)); S2[413].description = S2[413].description.replace('Vesper & ludwing', 'Aël & ludwing');
    var E2 = JSON.parse(JSON.stringify(E)); E2[453].note = E2[453].note.replace('<Mana: negatif>', '<Mana: sombre>');
    V('contre-épreuve : un duo qui nomme le mauvais héros est attrapé', nomsFaux(S2).length === 1);
    V('contre-épreuve : un <Mana: sombre> est attrapé', manasFaux([S, E2]).length === 1);

    V('aucune erreur dans la page', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
    console.log('\n' + (ko ? '❌ ' + ko + ' échec(s), ' + ok + ' réussite(s)' : '✅ TOUT PASSE (' + ok + ' contrôles)'));
    await nav.close(); serveur.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); console.error('erreurs de la page :', erreurs.slice(0, 5)); serveur.close(); process.exit(1); });
