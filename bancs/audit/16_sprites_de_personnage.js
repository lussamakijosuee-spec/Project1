/*
 * LES SPRITES DE PERSONNAGE SONT-ILS UTILISABLES ?
 *
 * JOKO : « quand je veux sélectionner pour les mettre en caractère, soit c'est
 * trop petit, soit c'est trop gros ».
 *
 * CE QUI SE PASSE VRAIMENT
 * ───────────────────────
 * RPG Maker MV ne lit aucune méta-donnée dans l'image : il déduit la taille
 * d'un personnage du NOM DU FICHIER et des dimensions de la planche.
 *
 *   · nom SANS « $ »  → la planche contient HUIT personnages, rangés 4 × 2.
 *                       Chacun fait 3 images de large et 4 de haut, donc
 *                       un personnage mesure  largeur / 12  ×  hauteur / 8.
 *   · nom AVEC « $ »  → la planche contient UN SEUL personnage,
 *                       donc  largeur / 3  ×  hauteur / 4.
 *   · le « ! » en tête ne change pas la taille : il enlève le décalage et
 *     l'ombre (pour les portes, les coffres, les objets posés au sol).
 *
 * D'où les deux accidents :
 *   · une planche d'UN personnage nommée sans « $ » est divisée par 12 et 8 :
 *     le sprite sort minuscule et découpé n'importe comment ;
 *   · une planche de HUIT personnages nommée avec « $ » est divisée par 3 et
 *     4 : le sprite sort énorme et déborde.
 *
 * Dans les deux cas, IL N'Y A PAS UN PIXEL À TOUCHER — c'est le nom qui ment.
 * Ce banc lit l'en-tête de chaque PNG (le bloc IHDR), en déduit ce que MV en
 * ferait, et dit lesquels demandent seulement d'être renommés.
 *
 * Il ne renomme rien. Pour appliquer :
 *     node bancs/outils/renommer_sprites.js --ecrire
 *
 * Lancement :  node bancs/audit/16_sprites_de_personnage.js
 *              node bancs/audit/16_sprites_de_personnage.js --tout
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var DOSSIER = path.join(RACINE, 'img', 'characters');
var TOUT = process.argv.indexOf('--tout') >= 0;

/** La taille d'un PNG, lue dans son en-tête. Pas de bibliothèque : les 8
 *  premiers octets sont la signature, puis le bloc IHDR porte largeur et
 *  hauteur en gros-boutiste sur 4 octets chacun. */
function taillePNG(chemin) {
    var fd = fs.openSync(chemin, 'r');
    var tampon = Buffer.alloc(33);
    var lus = fs.readSync(fd, tampon, 0, 33, 0);
    fs.closeSync(fd);
    if (lus < 33) { return null; }
    if (tampon.toString('hex', 0, 8) !== '89504e470d0a1a0a') { return null; }
    if (tampon.toString('ascii', 12, 16) !== 'IHDR') { return null; }
    return { l: tampon.readUInt32BE(16), h: tampon.readUInt32BE(20) };
}

/** Ce que MV ferait de cette planche, vu son nom et ses dimensions. */
function lecture(nom, t) {
    var solo = nom.indexOf('$') >= 0;
    var cases = solo ? { c: 3, r: 4 } : { c: 12, r: 8 };
    return {
        solo: solo,
        cadreL: t.l / cases.c,
        cadreH: t.h / cases.r,
        entier: (t.l % cases.c === 0) && (t.h % cases.r === 0)
    };
}

/** Un cadre « sain » : en nombres entiers, ni minuscule ni démesuré, ET à peu
 *  près aux proportions d'un être debout.
 *
 *  ⚠ Sans le rapport largeur/hauteur, ce contrôle disait « sain » à un cadre de
 *  192 × 16 : douze fois plus large que haut. Ce n'est pas un personnage, c'est
 *  une bande d'animation posée dans le mauvais dossier. On accepte du carré au
 *  deux-fois-plus-haut (un sprite de 48×96 est courant), pas une réglette.
 */
function sain(c) {
    if (!c.entier) { return false; }
    if (c.cadreL < 16 || c.cadreL > 256 || c.cadreH < 16 || c.cadreH > 256) { return false; }
    var rapport = c.cadreL / c.cadreH;
    return rapport >= 0.3 && rapport <= 2.0;
}

console.log('═'.repeat(76));
console.log('  LES SPRITES DE PERSONNAGE');
console.log('═'.repeat(76));

var fichiers = fs.readdirSync(DOSSIER);
var png = fichiers.filter(function (f) { return /\.png$/i.test(f); });
var autres = fichiers.filter(function (f) { return !/\.png$/i.test(f); });

var bons = [], aRenommer = [], douteux = [], illisibles = [];

png.forEach(function (f) {
    var t = taillePNG(path.join(DOSSIER, f));
    if (!t) { illisibles.push(f); return; }
    var nom = f.replace(/\.png$/i, '');
    var tel = lecture(nom, t);

    if (sain(tel)) { bons.push({ f: f, t: t, c: tel }); return; }

    // et si on lui mettait (ou retirait) le « $ » ?
    var autre = lecture(tel.solo ? nom.replace('$', '') : ('$' + nom), t);
    if (sain(autre)) {
        aRenommer.push({
            f: f, t: t,
            de: tel.solo ? 'planche solo ($)' : 'planche de 8',
            vers: tel.solo ? 'planche de 8' : 'planche solo ($)',
            avant: Math.round(tel.cadreL) + '×' + Math.round(tel.cadreH),
            apres: autre.cadreL + '×' + autre.cadreH,
            ajouter$: !tel.solo
        });
        return;
    }
    douteux.push({ f: f, t: t, c: tel, autre: autre });
});

console.log('\n  ' + png.length + ' planches PNG lues.');
console.log('  ' + bons.length + ' se découpent proprement telles quelles.');
console.log('  ' + aRenommer.length + ' n\'ont qu\'un NOM à changer — pas un pixel à toucher.');
console.log('  ' + douteux.length + ' ne tombent juste dans aucun des deux découpages.');
if (illisibles.length) { console.log('  ' + illisibles.length + ' ne sont pas des PNG valides.'); }

if (aRenommer.length) {
    console.log('\n' + '─'.repeat(76));
    console.log('  À RENOMMER — le nom ment sur le contenu');
    console.log('─'.repeat(76));
    var vers$ = aRenommer.filter(function (x) { return x.ajouter$; });
    var sans$ = aRenommer.filter(function (x) { return !x.ajouter$; });

    if (vers$.length) {
        console.log('\n   ▸ ' + vers$.length + ' planche(s) d\'UN SEUL personnage nommées comme des planches de huit.');
        console.log('     MV les divise par 12 et 8 : le sprite sort minuscule et découpé de travers.');
        console.log('     Il suffit d\'ajouter « $ » devant le nom.\n');
        vers$.slice(0, TOUT ? 9999 : 12).forEach(function (x) {
            console.log('       ' + x.f.padEnd(42) + x.t.l + '×' + x.t.h +
                '   cadre ' + x.avant + ' → ' + x.apres);
        });
        if (!TOUT && vers$.length > 12) { console.log('       … et ' + (vers$.length - 12) + ' autres (--tout)'); }
    }
    if (sans$.length) {
        console.log('\n   ▸ ' + sans$.length + ' planche(s) de HUIT personnages nommées avec « $ ».');
        console.log('     MV les divise par 3 et 4 : le sprite sort énorme et déborde.');
        console.log('     Il suffit de retirer le « $ ».\n');
        sans$.slice(0, TOUT ? 9999 : 12).forEach(function (x) {
            console.log('       ' + x.f.padEnd(42) + x.t.l + '×' + x.t.h +
                '   cadre ' + x.avant + ' → ' + x.apres);
        });
        if (!TOUT && sans$.length > 12) { console.log('       … et ' + (sans$.length - 12) + ' autres (--tout)'); }
    }
}

if (douteux.length) {
    console.log('\n' + '─'.repeat(76));
    console.log('  NI L\'UN NI L\'AUTRE — à regarder à la main');
    console.log('─'.repeat(76));
    console.log('   Ces planches ne tombent juste ni en 12×8 ni en 3×4. Renommer n\'y ferait');
    console.log('   rien : il faudrait les recadrer, et ça, c\'est toucher à l\'image.\n');
    douteux.slice(0, TOUT ? 9999 : 14).forEach(function (x) {
        console.log('       ' + x.f.padEnd(42) + x.t.l + '×' + x.t.h +
            '   en 12×8 : ' + (x.c.cadreL).toFixed(1) + '×' + (x.c.cadreH).toFixed(1) +
            '   en 3×4 : ' + (x.t.l / 3).toFixed(1) + '×' + (x.t.h / 4).toFixed(1));
    });
    if (!TOUT && douteux.length > 14) { console.log('       … et ' + (douteux.length - 14) + ' autres (--tout)'); }
}

if (autres.length) {
    console.log('\n' + '─'.repeat(76));
    console.log('  CE QUE MV NE CHARGERA JAMAIS — ' + autres.length + ' fichier(s)');
    console.log('─'.repeat(76));
    console.log('   img/characters/ ne se lit qu\'en PNG. Ces fichiers sont invisibles pour');
    console.log('   l\'éditeur comme pour le jeu — ils occupent la place, rien de plus.\n');
    var parExt = {};
    autres.forEach(function (f) {
        var e = (f.match(/\.([^.]+)$/) || [, '(sans extension)'])[1].toLowerCase();
        (parExt[e] = parExt[e] || []).push(f);
    });
    Object.keys(parExt).sort().forEach(function (e) {
        console.log('       .' + e.padEnd(6) + parExt[e].length + '  ·  ' +
            parExt[e].slice(0, 3).join(' · ') + (parExt[e].length > 3 ? ' …' : ''));
    });
}

/* ── les tailles qu'on trouve, pour voir la cohérence d'ensemble ── */
console.log('\n' + '─'.repeat(76));
console.log('  LES TAILLES DE PERSONNAGE QU\'ON TROUVE (planches saines)');
console.log('─'.repeat(76));
var tailles = {};
bons.forEach(function (x) {
    var k = x.c.cadreL + '×' + x.c.cadreH;
    tailles[k] = (tailles[k] || 0) + 1;
});
Object.keys(tailles).sort(function (a, b) { return tailles[b] - tailles[a]; })
    .slice(0, 12).forEach(function (k) {
        console.log('       ' + k.padEnd(12) + tailles[k] + ' planche(s)');
    });

console.log('\n' + '═'.repeat(76));
console.log('  ' + aRenommer.length + ' sprite(s) redeviennent utilisables rien qu\'en les renommant.');
console.log('  Pour le faire :  node bancs/outils/renommer_sprites.js --ecrire');
console.log('═'.repeat(76));
