/*
 * BANC — LE VISAGE DE CHAQUE ENNEMI
 * ---------------------------------------------------------------------------
 * Un ennemi dont l'image n'existe pas ne lève AUCUNE erreur : MV affiche du
 * vide et le combat continue. 51 ennemis étaient dans ce cas, et 4 autres
 * pointaient sur une photo de 446×1102 sans couche alpha.
 *
 * Ce banc vérifie, pour chaque ennemi nommé, que son `battlerName` désigne un
 * fichier qui existe ET qui est un vrai sprite de combattant : couche alpha,
 * taille d'écran raisonnable. Contre-épreuve incluse.
 *
 *   node bancs/8_visages_ennemis.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');

function dim(nom) {
    try {
        var b = fs.readFileSync(path.join(RACINE, 'img/enemies', nom + '.png'));
        if (b.slice(1, 4).toString() !== 'PNG') { return null; }
        return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), couleur: b[25], o: b.length };
    } catch (e) { return null; }
}
/** Un sprite de combattant : couche alpha (type 6), et il tient dans l'écran. */
function estSprite(d) { return !!d && d.couleur === 6 && d.w <= 900 && d.h <= 900 && d.o <= 600000; }

function controles(E) {
    var reels = E.filter(function (e) { return e && e.name; });
    var r = [];

    var absents = reels.filter(function (e) { return !dim(e.battlerName); });
    r.push(['chaque ennemi a une image qui existe sur le disque', absents.length === 0,
        reels.length + ' ennemis · ' + absents.length + ' sans fichier' +
        (absents.length ? ' : ' + absents.slice(0, 3).map(function (e) { return e.name + ' → ' + e.battlerName; }).join(', ') : '')]);

    var photos = reels.filter(function (e) { var d = dim(e.battlerName); return d && !estSprite(d); });
    r.push(['aucun ennemi ne porte une photo à la place d\'un sprite', photos.length === 0,
        photos.length ? photos.slice(0, 3).map(function (e) { var d = dim(e.battlerName); return e.name + ' → ' + e.battlerName + ' (' + d.w + 'x' + d.h + ')'; }).join(', ') : 'tous sont de vrais sprites']);

    var img = {}; reels.forEach(function (e) { img[e.battlerName] = (img[e.battlerName] || 0) + 1; });
    var distincts = Object.keys(img).length;
    r.push(['la variété des visages ne régresse pas (au moins 200)', distincts >= 200,
        distincts + ' visages distincts pour ' + reels.length + ' ennemis']);

    return r;
}

var E = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Enemies.json'), 'utf8'));
var ok = 0, ko = 0;
console.log('LE VISAGE DE CHAQUE ENNEMI\n');
console.log('1) Sur la vraie base');
controles(E).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

var SABOTAGES = [
    ['un ennemi pointé sur un fichier inexistant', function (b) { b.filter(function (e) { return e && e.name; })[0].battlerName = 'CeFichierNExistePas'; }, /existe sur le disque/],
    ['un ennemi remis sur la photo de 446×1102', function (b) { b.filter(function (e) { return e && e.name; })[0].battlerName = 'HIcnxzI'; }, /photo à la place/],
    ['tous les ennemis ramenés au même visage', function (b) { b.forEach(function (e) { if (e && e.name) { e.battlerName = 'Bat'; } }); }, /variété/]
];
console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
SABOTAGES.forEach(function (s) {
    var b = JSON.parse(JSON.stringify(E));
    s[1](b);
    var vise = controles(b).filter(function (c) { return !c[1] && s[2].test(c[0]); });
    if (vise.length) { ok++; console.log('   ✓ ' + s[0] + '  →  « ' + vise[0][0] + ' » tombe'); }
    else { ko++; console.log('   ✗ ' + s[0] + '  →  son contrôle ne tombe PAS'); }
});

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
