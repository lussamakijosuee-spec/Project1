/*
 * LE THEATRHYTHM ADAPTÉ — la copie de la démo de MOG, réglée pour le jeu
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-02 : « jeu a utiliser REGERDE ET LE GIT HUB CAR IL FAUT
 * L'Adapter », puis : « Interrupteur + variable, Textes en français, Le nom
 * au-dessus du PNJ ». Ses quatre PNJ (carte 1 : 2, 5, 30 ; carte 10 : 2) sont
 * la copie de l'événement 2 de la carte 11 de la démo. MOG_Theatrhythm.js lui-
 * même n'est pas touché.
 *
 *   ① « event_text : Theatrhythm » s'écrit au-dessus des trois PNJ de la carte
 *     1 (MOG_EventText), et pas au-dessus d'un autre (contre-épreuve) ;
 *   ② une partie sauvegardée avant MOG_EventText ne plante pas (le joueur sans
 *     _char_text) — contre-épreuve : l'original de MOG plante ;
 *   ③ le résultat va dans l'interrupteur 955, les points dans la variable 900 :
 *     « PHASE 2 » (10) et « BONUS » de HAKARI (5) ne bougent plus ;
 *   ④ les événements : la condition lit 955, plus un mot d'anglais (un « You
 *     Win » planté exprès est attrapé).
 *
 *   node bancs/navigateur/le_theatrhythm_adapte.js
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
var INTER = 955, VAR = 900;

(async function () {
    await new Promise(function (r) { serveur.listen(0, '127.0.0.1', r); });
    var nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var ok = 0, ko = 0;
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    await page.goto('http://127.0.0.1:' + serveur.address().port + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Title' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 180000 });

    // ① le nom au-dessus des PNJ de la carte 1
    await page.evaluate(function () {
        DataManager.setupNewGame();
        $gameParty._actors = [1, 2, 3, 4];
        $gamePlayer.reserveTransfer(1, 7, 7, 2, 0);
        SceneManager.goto(Scene_Map);
    });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Map' && SceneManager.isCurrentSceneStarted() && $gameMap.mapId() === 1; }, null, { timeout: 180000 });
    await page.waitForFunction(function () {
        var l = SceneManager._scene._spriteset._sprite_char_text || [];
        return l.filter(function (s) { return s._char_text; }).length >= 3;
    }, null, { timeout: 60000 }).catch(function () {});
    var r1 = await page.evaluate(function () {
        var l = SceneManager._scene._spriteset._sprite_char_text || [], out = {};
        l.forEach(function (s) {
            var c = s.character(), id = c && c._eventId;
            if (id) out[id] = { sprite: !!s._char_text, texte: c._char_text ? c._char_text[1] : null };
        });
        return out;
    });
    console.log('\n① « event_text : Theatrhythm » au-dessus des PNJ');
    [2, 5, 30].forEach(function (id) {
        var e = r1[id] || {};
        V('PNJ ' + id + ' de la carte 1 : « Theatrhythm » écrit au-dessus', e.sprite && e.texte === 'Theatrhythm', JSON.stringify(e));
    });
    V('contre-épreuve : le PNJ 3 (sans le commentaire) n\'a rien au-dessus', r1[3] && !r1[3].sprite, JSON.stringify(r1[3]));

    // ② une partie sauvegardée avant le plugin
    var r2 = await page.evaluate(async function () {
        var out = {};
        delete $gamePlayer._char_text;
        try { SceneManager._scene._spriteset.update(); out.passe = true; } catch (e) { out.passe = false; out.err = e.message; }
        out.repare = JSON.stringify($gamePlayer._char_text);
        // l'original de MOG, rejoué sur un joueur sans _char_text
        var src = await (await fetch('/jeu a utiliser/MOG_Master_MV/js/plugins/MOG_EventText.js')).text();
        var m = /Sprite_CharText\.prototype\.update = (function\(\) \{[\s\S]*?\n\};)/.exec(src);
        out.original = !!m;
        if (m) {
            var orig = eval('(' + m[1].replace(/;\s*$/, '') + ')');
            var s = SceneManager._scene._spriteset._sprite_char_text.filter(function (x) { return x.character() === $gamePlayer; })[0];
            delete $gamePlayer._char_text;
            try { orig.call(s); out.originalPlante = false; } catch (e) { out.originalPlante = true; }
            $gamePlayer._char_text = [false, ''];
        }
        return out;
    });
    console.log('\n② Une partie sauvegardée avant MOG_EventText');
    V('le joueur sans _char_text : la carte continue', r2.passe === true, r2.err || r2.repare);
    V('contre-épreuve : l\'original de MOG plante dans ce cas', r2.original && r2.originalPlante === true);

    // ②b arriver avec les PNJ du haut hors de l'écran (Allegement les endort : pas d'image)
    var errAvant = erreurs.length;
    await page.evaluate(function () { $gamePlayer.reserveTransfer(1, 7, 25, 2, 0); });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Map' && SceneManager.isCurrentSceneStarted() && $gamePlayer.y === 25; }, null, { timeout: 120000 });
    await page.waitForTimeout(1500);
    var r2b = await page.evaluate(async function () {
        var l = SceneManager._scene._spriteset._sprite_char_text, t = l.filter(function (x) { return x.character()._eventId === 5; })[0], out = {};
        out.dort = !!(t && t.sprite_char._enVeille); out.sansImage = !!(t && !t.sprite_char.bitmap); out.cache = !!(t && !t.visible);
        var src = await (await fetch('/jeu a utiliser/MOG_Master_MV/js/plugins/MOG_EventText.js')).text();
        var m = /Sprite_CharText\.prototype\.update = (function\(\) \{[\s\S]*?\n\};)/.exec(src);
        if (m && t) {
            var orig = eval('(' + m[1].replace(/;\s*$/, '') + ')'), garde = t.character()._char_text.slice();
            t.character()._char_text[0] = true;
            try { orig.call(t); out.originalPlante = false; } catch (e) { out.originalPlante = /height/.test(e.message); }
            t.character()._char_text = garde;
        }
        $gamePlayer.locate(7, 7);
        return out;
    });
    await page.waitForFunction(function () {
        var t = SceneManager._scene._spriteset._sprite_char_text.filter(function (x) { return x.character()._eventId === 5; })[0];
        return t && t._char_text && t.visible;
    }, null, { timeout: 30000 }).catch(function () {});
    var r2c = await page.evaluate(function () {
        var t = SceneManager._scene._spriteset._sprite_char_text.filter(function (x) { return x.character()._eventId === 5; })[0];
        return !!(t && t._char_text && t.visible && !t.sprite_char._enVeille);
    });
    console.log('\n②b Les PNJ hors de l\'écran (Allegement les endort)');
    V('arriver loin d\'eux : PNJ 5 endormi, sans image, son texte attend — pas de plantage', r2b.dort && r2b.sansImage && r2b.cache && erreurs.length === errAvant, JSON.stringify(r2b) + (erreurs.length > errAvant ? ' · ' + erreurs[erreurs.length - 1] : ''));
    V('contre-épreuve : l\'original de MOG plante sur ce PNJ (« height » de rien)', r2b.originalPlante === true);
    V('remonter vers lui : il se réveille, « Theatrhythm » s\'écrit au-dessus', r2c);

    // ③ le résultat et les points
    await page.evaluate(function () {
        $gameSwitches.setValue(10, true);
        $gameVariables.setValue(5, 2);
        $gameVariables.setValue(900, 0);
        $gameMap._interpreter.setup([{ code: 356, indent: 0, parameters: ['theatrhythm : 1 : 2'] }, { code: 0, indent: 0, parameters: [] }], 0);
    });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s.constructor.name === 'Scene_Theatrhythm' && SceneManager.isCurrentSceneStarted(); }, null, { timeout: 120000 });
    var r3 = await page.evaluate(function () {
        var s = SceneManager._scene, out = {};
        out.reglages = [Moghunter.theatrhythm_result_switch_id, Moghunter.theatrhythm_variable_id];
        $gameSystem._theatrhythm_phase = 1; s.battle_end(10);
        out.gagne = [$gameSwitches.value(955), $gameSwitches.value(10)];
        s._score[1] = 500; s.gain_rewards();
        out.points = [$gameVariables.value(900), $gameVariables.value(5)];
        $gameSystem._theatrhythm_phase = 1; s.battle_end(11);
        out.perdu = [$gameSwitches.value(955), $gameSwitches.value(10)];
        return out;
    });
    console.log('\n③ Le résultat et les points');
    V('MOG_Theatrhythm lit l\'interrupteur 955 et la variable 900', r3.reglages[0] === INTER && r3.reglages[1] === VAR, r3.reglages.join(', '));
    V('gagné : 955 allumé, « PHASE 2 » (10) n\'a pas bougé', r3.gagne[0] === true && r3.gagne[1] === true);
    V('les points vont dans 900, « BONUS » (5) de HAKARI n\'a pas bougé', r3.points[0] > 0 && r3.points[1] === 2, r3.points.join(' · '));
    V('perdu : 955 éteint, « PHASE 2 » (10) toujours là', r3.perdu[0] === false && r3.perdu[1] === true);

    // ④ les événements (les fichiers)
    console.log('\n④ Les quatre PNJ');
    var S = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/System.json'), 'utf8'));
    V('955 et 900 portent leur nom', /Theatrhythm/.test(S.switches[INTER]) && /Theatrhythm/.test(S.variables[VAR]), S.switches[INTER] + ' · ' + S.variables[VAR]);
    function evenements() {
        var l = [];
        [['data/Map001.json', [2, 5, 30]], ['data/Map010.json', [2]]].forEach(function (a) {
            var m = JSON.parse(fs.readFileSync(path.join(RACINE, a[0]), 'utf8'));
            a[1].forEach(function (id) { l.push({ ou: a[0].slice(5, 11) + ':' + id, ev: m.events[id] }); });
        });
        return l;
    }
    var ANGLAIS = /^(Level (Easy|Normal|Hard)( \(boss\))?|You Win|You Lose)$/;
    function fautes(l) {
        var f = [];
        l.forEach(function (x) {
            var liste = x.ev.pages[0].list;
            var cond = liste.filter(function (c) { return c.code === 111 && c.parameters[0] === 0; }).map(function (c) { return c.parameters[1]; });
            if (cond.join() !== String(INTER)) f.push(x.ou + ' condition ' + cond.join());
            liste.forEach(function (c) {
                var mots = c.code === 102 ? c.parameters[0] : (c.code === 402 ? [c.parameters[1]] : (c.code === 401 ? [c.parameters[0]] : []));
                mots.forEach(function (t) { if (ANGLAIS.test(t)) f.push(x.ou + ' « ' + t + ' »'); });
            });
        });
        return f;
    }
    var evs = evenements(), f = fautes(evs);
    V('les quatre lisent 955 et parlent français', f.length === 0, f.join(' · ') || evs.map(function (x) { return x.ou; }).join(', '));
    var plante = JSON.parse(JSON.stringify(evs));
    plante[0].ev.pages[0].list.filter(function (c) { return c.code === 401; })[0].parameters[0] = 'You Win';
    V('contre-épreuve : un « You Win » planté exprès est attrapé', fautes(plante).length === 1);

    V('aucune erreur dans la page', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
    console.log('\n' + (ko ? '❌ ' + ko + ' échec(s), ' + ok + ' réussite(s)' : '✅ TOUT PASSE (' + ok + ' contrôles)'));
    await nav.close(); serveur.close();
    process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); console.error('erreurs de la page :', erreurs.slice(0, 5)); serveur.close(); process.exit(1); });
