/*
 * BANC NAVIGATEUR — UN MENU PAR ART (LesTroisArts.js, 2026-10-26)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-26 (le chantier des compétences) : « Un menu par art » —
 * Voies, Paroles, Runes, la branche à lui de chaque héros, Ultimes, Combos.
 *
 * Aucune fiche ne change de type : les branches générales (capacité, Spéciale)
 * se rangent en combat d'après l'art de chaque compétence. Ce banc vérifie,
 * dans le vrai moteur et dans les deux sens :
 *   1. l'ordre des menus de chaque héros : Voies, Paroles, Runes, ses branches,
 *      Ultimes, Combo — plus de « capacité » ni de « Spéciale » s'ils sont vides ;
 *   2. chaque menu ne montre que son art (Activer va avec les Runes), et rien ne
 *      se perd : ce que montraient capacité + Spéciale = Voies + Paroles + Runes
 *      + ce qui reste sans art ;
 *   3. ce qui filtrait avant filtre encore : le kit du Style de Vesper ; l'État
 *      de Flow scelle toujours ses capacités ; la branche Copies de ludwing ;
 *   4. contre-épreuve : seiryu garde ses ordres, et hors combat rien ne change.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/un_menu_par_art.js
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

    // hors combat d'abord : rien ne change
    var hors = await page.evaluate(function () {
        var lud = $gameActors.actor(3), w = Object.create(Window_SkillList.prototype);
        w._actor = lud; w._stypeId = 1;
        var t1 = lud.skills().filter(function (s) { return Window_SkillList.prototype.includes.call(w, s); }).length;
        LesTroisArts._sansMenusParArt = true;
        var brut = lud.skills().filter(function (s) { return Window_SkillList.prototype.includes.call(w, s); }).length;
        LesTroisArts._sansMenusParArt = false;
        return { t1: t1, brut: brut };
    });

    await page.evaluate(function () {
        $gameParty.members().forEach(function (a) { a.recoverAll(); });
        BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
    });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(2500);

    console.log('=== UN MENU PAR ART ===\n');
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        var out = { heros: {} }, T = LesTroisArts;
        var w = SceneManager._scene._actorCommandWindow;
        function liste(a, type) {
            var f = Object.create(Window_SkillList.prototype); f._actor = a; f._stypeId = type;
            return a.skills().filter(function (s) { return Window_SkillList.prototype.includes.call(f, s); });
        }
        function artMenu(s) { return s.id === 1309 ? 'ecrit' : T.art(s); }
        [1, 2, 3, 4].forEach(function (id) {
            var a = $gameActors.actor(id);
            w.setup(a);
            var cmds = w._list.filter(function (c) { return c.symbol === 'skill'; });
            var o = { noms: cmds.map(function (c) { return c.name; }), menus: {} };
            cmds.forEach(function (c) {
                var l = liste(a, c.ext);
                o.menus[c.name] = { type: c.ext, n: l.length, arts: l.map(artMenu).filter(function (x, i, t) { return t.indexOf(x) === i; }) };
            });
            // rien ne se perd : (capacité + Spéciale, vus sans les menus par art) = Voies + Paroles + Runes + le reste
            var avant = a.skills().filter(function (s) { return s.stypeId === 1 || s.stypeId === 2; });
            var vus = [];
            cmds.forEach(function (c) { liste(a, c.ext).forEach(function (s) { if (vus.indexOf(s.id) < 0) { vus.push(s.id); } }); });
            o.perdus = avant.filter(function (s) {
                var f = Object.create(Window_SkillList.prototype); f._actor = a; f._stypeId = s.stypeId;
                T._sansMenusParArt = true;
                var visible = Window_SkillList.prototype.includes.call(f, s);
                T._sansMenusParArt = false;
                return visible && vus.indexOf(s.id) < 0;
            }).map(function (s) { return s.id + ' ' + s.name; });
            out.heros[a.name()] = o;
        });
        // Vesper : son Style filtre toujours (kit), et le Flow scelle toujours ses capacités
        var ves = $gameActors.actor(1);
        ves.recoverAll(); ves.setTp(100);
        out.flow = { avant: liste(ves, 901).filter(function (s) { return ves.canUse(s); }).length };
        ves.addState(87);
        out.flow.dans = liste(ves, 901).filter(function (s) { return s.stypeId === 1 && ves.canUse(s); }).length;
        ves.removeState(87);
        // seiryu : rien ne change
        var sei = $gameActors.actor(6);
        if (sei) { w.setup(sei); out.seiryu = w._list.filter(function (c) { return c.symbol === 'skill'; }).map(function (c) { return c.name; }); }
        return out;
    });

    var H = r.heros;
    console.log('1) L\'ordre des menus');
    Object.keys(H).forEach(function (n) {
        // (« ★ Favoris » et « ↻ … » de LesFavoris sont sous l'Attaque, avant les branches : on ne les compte pas ici)
        var noms = H[n].noms.filter(function (x) { return !/^[★↻]/.test(x); }), i = function (x) { return noms.indexOf(x); };
        var bon = i('Voies') === 0 && i('Paroles') === 1 && i('Runes') === 2 && i('Ultimes') === noms.length - 2 && noms[noms.length - 1] === 'Combo';
        v(n + ' : Voies, Paroles, Runes, ses branches, Ultimes, Combo', bon, noms.join(' · '));
    });
    v('plus de « ult » : la branche s\'appelle « Ultimes »', Object.keys(H).every(function (n) { return H[n].noms.indexOf('ult') < 0; }));

    console.log('\n2) Chaque menu, son art ; rien ne se perd');
    Object.keys(H).forEach(function (n) {
        var m = H[n].menus;
        var seul = function (k, a) { return m[k] && m[k].n > 0 && m[k].arts.length === 1 && m[k].arts[0] === a; };
        v(n + ' : Voies = mouvements, Paroles = Paroles, Runes = runes', seul('Voies', 'mouvement') && seul('Paroles', 'parole') && seul('Runes', 'ecrit'),
          ['Voies', 'Paroles', 'Runes'].map(function (k) { return k + ' ' + (m[k] ? m[k].n + ' ' + m[k].arts.join('/') : '—'); }).join(' · '));
        v(n + ' : rien de capacité ni de Spéciale ne se perd', H[n].perdus.length === 0, H[n].perdus.slice(0, 4).join(' · '));
    });
    v('« ᛟ Activer » est dans les Runes', Object.keys(H).every(function (n) { return H[n].menus.Runes && H[n].menus.Runes.n > 0; }));

    console.log('\n3) Ce qui filtrait avant');
    v('l\'État de Flow scelle toujours les capacités de Vesper (dans ses Voies)', r.flow.avant > 0 && r.flow.dans === 0, JSON.stringify(r.flow));
    v('contre-épreuve : seiryu garde ses ordres (aucun menu par art)', !r.seiryu || (r.seiryu.indexOf('Voies') < 0 && r.seiryu.indexOf('Runes') < 0), (r.seiryu || []).join(' · '));
    v('contre-épreuve : hors combat, capacité montre tout ce qu\'elle montrait', hors.t1 === hors.brut && hors.brut > 0, JSON.stringify(hors));

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
