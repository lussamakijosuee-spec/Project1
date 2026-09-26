/*
 * OUTIL — la teinte de base de chaque feuille d'animation
 * ---------------------------------------------------------------------------
 * Le champ « hue » d'une animation MV ne POSE pas une couleur : il fait
 * TOURNER celle de la feuille (0-360°). Une feuille jaune (Hit1, 51°) tournée
 * de 210° devient violette, pas bleue ; une feuille cyan (Cure1, 184°)
 * tournée de 210° devient orange. Pour obtenir une couleur voulue, il faut
 * donc connaître la teinte de départ : rotation = voulue − départ.
 *
 * Ce script ouvre le jeu dans Chromium, charge chaque feuille sur un canvas
 * et mesure sa teinte moyenne (pixels opaques et saturés). Le résultat va
 * dans teintes_des_feuilles.json, que l'outil animer_les_competences.js et
 * le banc 22 lisent.
 *
 *   npx http-server -p 8899 -c-1 .            (à la racine, dans un autre terminal)
 *   node bancs/outils/mesurer_teintes.js      (toutes les feuilles de la grille et du catalogue)
 *   node bancs/outils/mesurer_teintes.js Hit1 Fire1   (quelques-unes, affichées seulement)
 */
'use strict';
var fs = require('fs');
var path = require('path');
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var SORTIE = path.join(__dirname, 'teintes_des_feuilles.json');
var A = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'Animations.json'), 'utf8'));

var demandees = process.argv.slice(2);
var feuilles = demandees.length ? demandees : (function () {
    var s = {};
    A.forEach(function (a) {
        if (!a) { return; }
        var grille = (a.id >= 158 && a.id <= 339) || (a.id >= 361 && a.id <= 551) || (a.id >= 96 && a.id <= 104) || (a.id >= 1 && a.id <= 124);
        if (!grille) { return; }
        [a.animation1Name, a.animation2Name].forEach(function (n) { if (n) { s[n] = true; } });
    });
    return Object.keys(s).sort();
})();

(async function () {
    var nav = await chromium.launch({ args: ['--no-sandbox'] });
    var page = await nav.newPage();
    await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    var res = await page.evaluate(async function (liste) {
        var out = {};
        for (var i = 0; i < liste.length; i++) {
            var f = liste[i];
            var img = new Image(); img.src = '/img/animations/' + f + '.png';
            await new Promise(function (r) { img.onload = r; img.onerror = r; });
            if (!img.width) { out[f] = null; continue; }
            var c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
            var ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
            var d = ctx.getImageData(0, 0, c.width, c.height).data, sx = 0, sy = 0, n = 0, tot = 0;
            for (var p = 0; p < d.length; p += 16) {
                var r = d[p] / 255, g = d[p + 1] / 255, b = d[p + 2] / 255;
                if (d[p + 3] < 128) { continue; }
                var mx = Math.max(r, g, b), mn = Math.min(r, g, b), s = mx ? (mx - mn) / mx : 0; tot++;
                if (s < 0.25 || mx < 0.3) { continue; }
                var h; if (mx === r) { h = ((g - b) / (mx - mn)) % 6; } else if (mx === g) { h = (b - r) / (mx - mn) + 2; } else { h = (r - g) / (mx - mn) + 4; }
                h = (h * 60 + 360) % 360; sx += Math.cos(h * Math.PI / 180); sy += Math.sin(h * Math.PI / 180); n++;
            }
            // teinte : -1 si la feuille est grise ou blanche (la rotation n'y change rien) ; part : la part de pixels colorés
            out[f] = { teinte: n ? Math.round((Math.atan2(sy, sx) * 180 / Math.PI + 360) % 360) : -1, part: tot ? +(n / tot).toFixed(2) : 0 };
        }
        return out;
    }, feuilles);
    await nav.close();
    Object.keys(res).forEach(function (k) { console.log('  ' + k.padEnd(18) + (res[k] ? 'teinte ' + String(res[k].teinte).padStart(4) + '°  colorée à ' + Math.round(res[k].part * 100) + ' %' : 'ABSENTE')); });
    if (!demandees.length) {
        fs.writeFileSync(SORTIE, JSON.stringify(res, null, 1), 'utf8');
        console.log('\n  ' + Object.keys(res).length + ' feuilles mesurées → ' + path.relative(process.cwd(), SORTIE));
    }
})();
