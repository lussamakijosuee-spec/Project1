/*
 * Les cartes d'ATELIER (<Atelier> dans leur note) : des panneaux de commandes
 * à copier, que le jeu n'emploie pas. Les bancs et le carnet les ignorent,
 * pour qu'une commande posée là ne passe jamais pour une commande du jeu.
 * Voir outils/poser_l_atelier.js.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var DATA = path.join(__dirname, '..', '..', 'data');
var cache = {};
exports.estAtelier = function (fichier) {
    var f = path.basename(fichier);
    if (!/^Map\d+\.json$/.test(f)) return false;
    if (cache[f] === undefined) {
        try { cache[f] = fs.readFileSync(path.join(DATA, f), 'utf8').indexOf('"note":"<Atelier>') >= 0; }
        catch (e) { cache[f] = false; }
    }
    return cache[f];
};
