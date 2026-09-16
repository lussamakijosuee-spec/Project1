/*
 * CHEVAUCHEMENTS — trouver les textes qui se dessinent l'un sur l'autre
 * ---------------------------------------------------------------------------
 * Deux plugins qui écrivent au même endroit ne lèvent AUCUNE erreur : le second
 * passe simplement par-dessus le premier, et on lit « Af<Lame Écarlate>de Fer ».
 * Aucun contrôle de données ne voit ça. Il faut regarder le dessin lui-même.
 *
 * Ce banc détourne `Window_Base.prototype.drawText` et `drawTextEx` pour noter
 * chaque rectangle écrit, fenêtre par fenêtre, puis signale ceux qui se
 * recouvrent. Il ouvre les écrans un par un et rend la liste.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/chevauchements.js
 */
'use strict';
var { chromium } = require('playwright');
var path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var SHOTS = path.join(__dirname, 'captures') + path.sep;
require('fs').mkdirSync(SHOTS, { recursive: true });

// Le mouchard, injecté dans la page : il enregistre ce que chaque fenêtre écrit.
var MOUCHARD = function () {
    window.__tracés = [];
    var mesure = function (w, t, x, y, largeur, align) {
        var l = Math.min(w.textWidth ? w.textWidth(String(t)) : String(t).length * 12, largeur || 9999);
        var gx = x;
        if (align === 'center') { gx = x + ((largeur || 0) - l) / 2; }
        else if (align === 'right') { gx = x + (largeur || 0) - l; }
        // La hauteur d'un texte, c'est son CORPS — pas le lineHeight de la
        // fenêtre. Un panneau dessiné en corps 20 tous les 24 px ne se
        // chevauche pas, mais mesuré à 36 px de haut il semble le faire.
        var corps = (w.contents && w.contents.fontSize) || 28;
        return { x: gx, y: y + Math.round((36 - corps) / 2), w: l, h: corps };
    };
    var noter = function (w, texte, r) {
        if (!texte || !String(texte).trim()) { return; }
        window.__tracés.push({
            fen: w.constructor.name, texte: String(texte).slice(0, 40),
            x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.w), h: Math.round(r.h),
            fx: Math.round(w.x || 0), fy: Math.round(w.y || 0)
        });
    };
    var dt = Window_Base.prototype.drawText;
    Window_Base.prototype.drawText = function (texte, x, y, largeur, align) {
        try { noter(this, texte, mesure(this, texte, x, y, largeur, align)); } catch (e) {}
        return dt.apply(this, arguments);
    };
    var di = Window_Base.prototype.drawIcon;
    Window_Base.prototype.drawIcon = function (index, x, y) {
        try { noter(this, '[icône ' + index + ']', { x: x, y: y, w: 32, h: 32 }); } catch (e) {}
        return di.apply(this, arguments);
    };
};

/**
 * Deux rectangles de la MÊME fenêtre qui se recouvrent nettement.
 *
 * ⚠ Une fenêtre se redessine : le même texte au même endroit revient des
 * dizaines de fois. Les compter deux à deux donnait 71 313 « chevauchements »
 * qui n'étaient que des redessins. On dédoublonne d'abord.
 */
function collisions(traces) {
    var out = [], vus = {};
    traces = traces.filter(function (t) {
        var cle = t.fen + '|' + t.fx + '|' + t.fy + '|' + t.texte + '|' + t.x + '|' + t.y;
        if (vus[cle]) { return false; }
        vus[cle] = 1; return true;
    });
    for (var i = 0; i < traces.length; i++) {
        for (var j = i + 1; j < traces.length; j++) {
            var a = traces[i], b = traces[j];
            if (a.fen !== b.fen || a.fx !== b.fx || a.fy !== b.fy) { continue; }
            var ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
            var oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
            if (ox > 12 && oy > 8) {                       // un vrai recouvrement, pas un frôlement
                out.push({ fen: a.fen, a: a.texte, b: b.texte, ox: ox, oy: oy,
                    ra: a.x + ',' + a.y + ' ' + a.w + 'x' + a.h, rb: b.x + ',' + b.y + ' ' + b.w + 'x' + b.h });
            }
        }
    }
    return out;
}

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message); });

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    await page.keyboard.down('Enter'); await page.waitForTimeout(150); await page.keyboard.up('Enter');
    await page.waitForFunction(function () { return SceneManager._scene.constructor.name === 'Scene_Map' && DataManager.isMapLoaded(); }, null, { timeout: 60000 }).catch(function () {});
    await page.waitForTimeout(2500);
    for (var i = 0; i < 25; i++) {
        if (!(await page.evaluate(function () { return $gameMap.isEventRunning() || $gameMessage.isBusy(); }))) { break; }
        await page.keyboard.down('Enter'); await page.waitForTimeout(70); await page.keyboard.up('Enter'); await page.waitForTimeout(70);
    }
    await page.evaluate(MOUCHARD);

    // On passe par le MENU, comme un joueur : sinon le fond de scène est celui
    // de l'écran precedent, et on accuse un décor qui n'existe pas en jeu.
    var ECRANS = [
        ['Scene_Menu', 'menu'], ['Scene_Status', 'statut'], ['Scene_Skill', 'competences'],
        ['Scene_Equip', 'equipement'], ['Scene_Item', 'objets']
    ];
    var total = 0, tousDetails = [];
    for (var k = 0; k < ECRANS.length; k++) {
        var nom = ECRANS[k][0];
        await page.evaluate(function (n) {
            // MV prend un instantané de l'écran en changeant de scène, et les
            // écrans de menu s'en servent comme fond. Sauter de scène avec
            // `goto` le laisse périmé : on capturait le fond de l'ÉCRAN-TITRE
            // derrière le statut, et on aurait accusé le jeu d'un défaut qui
            // n'existe qu'ici. On prend donc l'instantané nous-mêmes.
            SceneManager.snapForBackground();
            $gameParty.setMenuActor($gameParty.members()[0]);
            SceneManager.goto(window[n]);
            window.__tracés = [];
        }, nom);
        await page.waitForTimeout(1800);
        // Une seule passe de dessin : on vide, on force UN refresh, on lit.
        var traces = await page.evaluate(function () {
            window.__tracés = [];
            var s = SceneManager._scene;
            (function creuse(o, p) {
                if (!o || p > 3) { return; }
                if (typeof o.refresh === 'function' && o.contents) { try { o.refresh(); } catch (e) {} }
                if (o.children) { o.children.forEach(function (c) { creuse(c, p + 1); }); }
            })(s, 0);
            return window.__tracés;
        });
        var c = collisions(traces);
        console.log('── ' + nom + '   ' + traces.length + ' textes dessinés · ' + c.length + ' chevauchement(s)');
        c.slice(0, 8).forEach(function (x) {
            console.log('     ✗ [' + x.fen + '] « ' + x.a + ' » (' + x.ra + ')');
            console.log('                 recouvre « ' + x.b + ' » (' + x.rb + ')  sur ' + x.ox + '×' + x.oy + ' px');
        });
        if (c.length > 8) { console.log('     … et ' + (c.length - 8) + ' autre(s)'); }
        total += c.length;
        tousDetails.push([nom, c.length]);
        await page.screenshot({ path: SHOTS + 'chv_' + ECRANS[k][1] + '.png' });
    }

    console.log('\n' + '='.repeat(70));
    console.log('  ' + total + ' chevauchement(s) au total   ·   ' + tousDetails.map(function (d) { return d[0].replace('Scene_', '') + ' ' + d[1]; }).join(' · '));
    if (erreurs.length) { console.log('  ⚠ ' + erreurs.length + ' erreur(s) JavaScript : ' + erreurs.slice(0, 2).join(' | ')); }
    console.log('='.repeat(70));
    await nav.close();
    process.exit(total ? 1 : 0);
})();
