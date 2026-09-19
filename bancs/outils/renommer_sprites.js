/*
 * RENDRE UTILISABLES LES SPRITES QUE MV DÉCOUPE DE TRAVERS.
 *
 * JOKO : « soit c'est trop petit, soit c'est trop gros ».
 *
 * RPG Maker déduit la taille d'un personnage du NOM du fichier :
 *   · sans « $ » → la planche contient huit personnages (4 × 2), donc un
 *     personnage mesure largeur/12 × hauteur/8 ;
 *   · avec « $ » → elle n'en contient qu'un, donc largeur/3 × hauteur/4.
 * Une planche d'un seul personnage nommée sans « $ » est divisée par douze :
 * le sprite sort minuscule et découpé n'importe où. Le pixel est bon ; c'est
 * le nom qui ment.
 *
 * Cet outil ajoute (ou retire) le « $ » sur les planches où l'autre découpage
 * tombe juste, et RÉÉCRIT TOUTES LES RÉFÉRENCES dans data/ — un fichier
 * renommé sans ses références serait un « Loading Error » de plus.
 *
 *   node bancs/outils/renommer_sprites.js             (essai à blanc)
 *   node bancs/outils/renommer_sprites.js --ecrire    (pour de vrai)
 *   node bancs/outils/renommer_sprites.js --remettre  (tout annuler)
 *
 * Le registre est dans bancs/outils/sprites_renommes.json.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var DOSSIER = path.join(RACINE, 'img', 'characters');
var REGISTRE = path.join(__dirname, 'sprites_renommes.json');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var REMETTRE = process.argv.indexOf('--remettre') >= 0;

function taillePNG(chemin) {
    var fd = fs.openSync(chemin, 'r');
    var t = Buffer.alloc(33);
    var lus = fs.readSync(fd, t, 0, 33, 0);
    fs.closeSync(fd);
    if (lus < 33 || t.toString('hex', 0, 8) !== '89504e470d0a1a0a' || t.toString('ascii', 12, 16) !== 'IHDR') { return null; }
    return { l: t.readUInt32BE(16), h: t.readUInt32BE(20) };
}
function lecture(nom, t) {
    var solo = nom.indexOf('$') >= 0;
    var c = solo ? 3 : 12, r = solo ? 4 : 8;
    return { solo: solo, cadreL: t.l / c, cadreH: t.h / r, entier: (t.l % c === 0) && (t.h % r === 0) };
}
function sain(c) {
    if (!c.entier) { return false; }
    if (c.cadreL < 16 || c.cadreL > 256 || c.cadreH < 16 || c.cadreH > 256) { return false; }
    var rp = c.cadreL / c.cadreH;
    return rp >= 0.3 && rp <= 2.0;
}

/** Toutes les références à un nom de planche, dans data/. On ne touche qu'aux
 *  champs « characterName » : un nom de planche peut ressembler à autre chose
 *  ailleurs, et réécrire à l'aveugle abîmerait des textes. */
function references(nom) {
    var out = [];
    var motif = '"characterName":"' + nom.replace(/[\\"]/g, '\\$&') + '"';
    fs.readdirSync(path.join(RACINE, 'data'))
        .filter(function (f) { return /\.json$/.test(f); })
        .forEach(function (f) {
            var t = fs.readFileSync(path.join(RACINE, 'data', f), 'utf8');
            var n = t.split(motif).length - 1;
            if (n > 0) { out.push({ fichier: f, nombre: n, motif: motif }); }
        });
    return out;
}

function renommerReferences(ancien, nouveau) {
    var touches = 0;
    var de = '"characterName":"' + ancien.replace(/[\\"]/g, '\\$&') + '"';
    var vers = '"characterName":"' + nouveau.replace(/[\\"]/g, '\\$&') + '"';
    fs.readdirSync(path.join(RACINE, 'data'))
        .filter(function (f) { return /\.json$/.test(f); })
        .forEach(function (f) {
            var p = path.join(RACINE, 'data', f);
            var t = fs.readFileSync(p, 'utf8');
            if (t.indexOf(de) < 0) { return; }
            var apres = t.split(de).join(vers);
            JSON.parse(apres);                 // il doit toujours se parser
            fs.writeFileSync(p, apres, 'utf8');
            touches++;
        });
    return touches;
}

/* ── REMETTRE ── */
if (REMETTRE) {
    if (!fs.existsSync(REGISTRE)) { console.error('  aucun registre : rien à remettre.'); process.exit(1); }
    var reg = JSON.parse(fs.readFileSync(REGISTRE, 'utf8'));
    var remis = 0;
    reg.entrees.slice().reverse().forEach(function (x) {
        var de = path.join(DOSSIER, x.nouveau + '.png');
        var vers = path.join(DOSSIER, x.ancien + '.png');
        if (!fs.existsSync(de)) { return; }
        fs.renameSync(de, vers);
        renommerReferences(x.nouveau, x.ancien);
        remis++;
    });
    console.log('  ' + remis + ' sprite(s) remis à leur ancien nom.');
    process.exit(0);
}

/* ── TROUVER ── */
var aFaire = [];
fs.readdirSync(DOSSIER).filter(function (f) { return /\.png$/i.test(f); }).forEach(function (f) {
    var t = taillePNG(path.join(DOSSIER, f));
    if (!t) { return; }
    var nom = f.replace(/\.png$/i, '');
    var tel = lecture(nom, t);
    if (sain(tel)) { return; }
    var autreNom = tel.solo ? nom.replace('$', '') : ('$' + nom);
    if (!sain(lecture(autreNom, t))) { return; }
    if (fs.existsSync(path.join(DOSSIER, autreNom + '.png'))) {
        console.log('  ⚠ « ' + autreNom + '.png » existe déjà — « ' + f + ' » est laissé tranquille.');
        return;
    }
    var c = lecture(autreNom, t);
    aFaire.push({
        ancien: nom, nouveau: autreNom,
        taille: t.l + '×' + t.h,
        avant: Math.round(tel.cadreL) + '×' + Math.round(tel.cadreH),
        apres: c.cadreL + '×' + c.cadreH,
        refs: references(nom)
    });
});

console.log('═'.repeat(72));
console.log('  ' + aFaire.length + ' sprite(s) à renommer');
console.log('═'.repeat(72));
aFaire.forEach(function (x) {
    var r = x.refs.reduce(function (s, y) { return s + y.nombre; }, 0);
    console.log('   ' + x.ancien.padEnd(40) + x.taille.padEnd(11) +
        'cadre ' + x.avant + ' → ' + x.apres +
        (r ? '   · ' + r + ' référence(s) à suivre' : ''));
});

if (!ECRIRE) {
    var total = aFaire.reduce(function (s, x) { return s + x.refs.reduce(function (a, y) { return a + y.nombre; }, 0); }, 0);
    console.log('\n  ' + total + ' référence(s) dans data/ suivraient le renommage.');
    console.log('  (essai à blanc — rien n\'a été touché. Ajoute --ecrire.)');
    process.exit(0);
}

/* ── FAIRE ── */
var faits = [];
aFaire.forEach(function (x) {
    fs.renameSync(path.join(DOSSIER, x.ancien + '.png'), path.join(DOSSIER, x.nouveau + '.png'));
    var n = renommerReferences(x.ancien, x.nouveau);
    faits.push({ ancien: x.ancien, nouveau: x.nouveau, fichiersTouches: n });
});
fs.writeFileSync(REGISTRE, JSON.stringify({
    fait: new Date().toISOString().slice(0, 19),
    entrees: faits
}, null, 1), 'utf8');
console.log('\n  ✔ ' + faits.length + ' sprite(s) renommé(s), références suivies.');
console.log('    registre : bancs/outils/sprites_renommes.json');
console.log('    pour tout annuler : node bancs/outils/renommer_sprites.js --remettre');
