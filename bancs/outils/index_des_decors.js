/*
 * L'INDEX DES DÉCORS — data/DecorsIndex.json
 * ---------------------------------------------------------------------------
 * DecorsLibres.js lit cette liste pour remplir le panneau de l'éditeur quand
 * il n'a pas accès au disque (navigateur). Dans RPG Maker (NW.js), l'éditeur
 * relit img/doodads tout seul ; ce fichier sert de repli.
 * À relancer quand on ajoute des images dans img/doodads.
 *
 *   node bancs/outils/index_des_decors.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var D = path.join(RACINE, 'img', 'doodads');
var liste = [];
(function lire(dossier, rel) {
    fs.readdirSync(dossier).sort().forEach(function (f) {
        var p = path.join(dossier, f), r = rel ? rel + '/' + f : f;
        if (fs.statSync(p).isDirectory()) lire(p, r);
        else if (/\.png$/i.test(f)) liste.push(r.replace(/\.png$/i, ''));
    });
})(D, '');
fs.writeFileSync(path.join(RACINE, 'data', 'DecorsIndex.json'), JSON.stringify(liste));
console.log('data/DecorsIndex.json : ' + liste.length + ' décors');
