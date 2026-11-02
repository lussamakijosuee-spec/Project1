/*
 * LISTER LES MUSIQUES — rythme/musiques.json
 * ---------------------------------------------------------------------------
 * Sur le PC, LeRythme et LaBoiteAMusique lisent audio/bgm eux-mêmes. Dans un
 * navigateur (les bancs, une version web), ils ne peuvent pas lister un
 * dossier : ils lisent ce fichier. À relancer quand des musiques changent.
 *
 *   node bancs/outils/lister_les_musiques.js
 */
'use strict';
var fs = require('fs'), path = require('path');
var racine = path.join(__dirname, '..', '..');

var noms = {};
fs.readdirSync(path.join(racine, 'audio', 'bgm')).forEach(function (f) {
    var m = /^(.*)\.(ogg|m4a)$/i.exec(f);
    if (m) (noms[m[1]] = noms[m[1]] || []).push(m[2].toLowerCase());
});
var musiques = Object.keys(noms).sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase(), 'fr'); })
    .map(function (n) { return { nom: n, formats: noms[n].sort().reverse() }; });
var pochettes = fs.readdirSync(path.join(racine, 'img', 'musicbook')).filter(function (f) { return /\.png$/i.test(f); })
    .map(function (f) { return f.replace(/\.png$/i, ''); }).sort();

if (!fs.existsSync(path.join(racine, 'rythme'))) fs.mkdirSync(path.join(racine, 'rythme'));
fs.writeFileSync(path.join(racine, 'rythme', 'musiques.json'), JSON.stringify({ musiques: musiques, pochettes: pochettes }, null, 1));
var seulM4a = musiques.filter(function (m) { return m.formats.indexOf('ogg') < 0; }).length;
console.log(musiques.length + ' musiques (' + seulM4a + ' seulement en .m4a), ' + pochettes.length + ' pochettes → rythme/musiques.json');
