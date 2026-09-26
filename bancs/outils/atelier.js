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

/* Les événements communs d'ATELIER : nommés « ✎ … » ou « ▬▬ ✎ … ». */
exports.estCEAtelier = function (ce) {
    return !!(ce && typeof ce.name === 'string' && /^(?:✎|▬▬ ✎)/.test(ce.name));
};
/** La liste des événements communs, ceux de l'atelier remis à vide. */
exports.sansCEAtelier = function (liste) {
    // une case d'atelier redevient la case vide qu'elle était avant
    var l = (liste || []).slice();
    // les recettes (1001+) sont au bout de la liste : elles s'en vont
    while (l.length > 1 && exports.estCEAtelier(l[l.length - 1])) l.pop();
    return l.map(function (ce) {
        return exports.estCEAtelier(ce) ? { id: ce.id, list: [{ code: 0, indent: 0, parameters: [] }], name: '', switchId: 1, trigger: 0 } : ce;
    });
};
/** Le texte d'un fichier de data/, sans ce qui appartient à l'atelier. */
exports.texte = function (fichier) {
    var f = path.basename(fichier);
    if (exports.estAtelier(f)) return '';
    var t = fs.readFileSync(path.join(DATA, f), 'utf8');
    if (f === 'CommonEvents.json') {
        var l = JSON.parse(t);
        if (l.some(exports.estCEAtelier)) t = '[\n' + exports.sansCEAtelier(l).map(function (x) { return JSON.stringify(x); }).join(',\n') + '\n]';
    }
    return t;
};
