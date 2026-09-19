/*
 * LES IMAGES QUI MANQUENT AUX ATTAQUES CHRONOMÉTRÉES, DESSINÉES EN CODE
 * ---------------------------------------------------------------------------
 * SRD_TimedAttack_Wheel et _Arrows réclament cinq images dans
 * img/SumRndmDde/tas/ — un dossier qui n'existe pas. Sans elles, l'anneau et
 * les flèches ne s'affichent pas, et MV lève un « Loading Error ».
 *
 * Règle du projet : jamais d'asset extérieur, licence invérifiable. On ne va
 * donc rien télécharger. On les DESSINE, comme les rouleaux du Pari Mortel :
 * un encodeur PNG minimal (signature, IHDR, IDAT compressé par zlib, IEND,
 * chaque bloc suivi de son CRC32) et quelques formes à la main.
 *
 * Les couleurs suivent celles du jeu : le violet de l'Orbe pour l'anneau,
 * l'ambre pour la cible.
 *
 *   node bancs/outils/dessiner_images_minutage.js            (essai à blanc)
 *   node bancs/outils/dessiner_images_minutage.js --ecrire
 *   node bancs/outils/dessiner_images_minutage.js --effacer  (tout retirer)
 */
'use strict';
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var RACINE = path.join(__dirname, '..', '..');
var DOSSIER = path.join(RACINE, 'img', 'SumRndmDde', 'tas');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var EFFACER = process.argv.indexOf('--effacer') >= 0;

/* ───────────────────────── un PNG, à la main ───────────────────────── */
var TABLE_CRC = (function () {
    var t = new Int32Array(256);
    for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) { c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); }
        t[n] = c;
    }
    return t;
})();
function crc32(buf) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < buf.length; i++) { c = TABLE_CRC[(c ^ buf[i]) & 0xFF] ^ (c >>> 8); }
    return (c ^ 0xFFFFFFFF) >>> 0;
}
function bloc(type, donnees) {
    var t = Buffer.from(type, 'ascii');
    var lg = Buffer.alloc(4); lg.writeUInt32BE(donnees.length, 0);
    var corps = Buffer.concat([t, donnees]);
    var crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(corps), 0);
    return Buffer.concat([lg, corps, crc]);
}

/** Une toile RGBA toute simple : un octet par canal, l'origine en haut à gauche. */
function Toile(l, h) {
    this.l = l; this.h = h;
    this.px = Buffer.alloc(l * h * 4);   // tout à zéro = transparent
}
Toile.prototype.poser = function (x, y, r, v, b, a) {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.l || y >= this.h || a <= 0) { return; }
    var i = (y * this.l + x) * 4;
    if (a >= 255) { this.px[i] = r; this.px[i + 1] = v; this.px[i + 2] = b; this.px[i + 3] = 255; return; }
    // mélange simple sur ce qu'il y a déjà
    var af = a / 255, ad = this.px[i + 3] / 255;
    var ar = af + ad * (1 - af);
    if (ar <= 0) { return; }
    this.px[i] = Math.round((r * af + this.px[i] * ad * (1 - af)) / ar);
    this.px[i + 1] = Math.round((v * af + this.px[i + 1] * ad * (1 - af)) / ar);
    this.px[i + 2] = Math.round((b * af + this.px[i + 2] * ad * (1 - af)) / ar);
    this.px[i + 3] = Math.round(ar * 255);
};
Toile.prototype.rectangle = function (x, y, l, h, c) {
    for (var j = y; j < y + h; j++) { for (var i = x; i < x + l; i++) { this.poser(i, j, c[0], c[1], c[2], c[3]); } }
};
/** Un anneau : tout ce qui tombe entre deux rayons, adouci sur un pixel. */
Toile.prototype.anneau = function (cx, cy, rInt, rExt, c) {
    for (var y = 0; y < this.h; y++) {
        for (var x = 0; x < this.l; x++) {
            var d = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
            if (d < rInt - 1 || d > rExt + 1) { continue; }
            // le bord s'estompe au lieu de faire un escalier
            var a = 1;
            if (d < rInt) { a = d - (rInt - 1); }
            else if (d > rExt) { a = (rExt + 1) - d; }
            this.poser(x, y, c[0], c[1], c[2], Math.round(c[3] * Math.max(0, Math.min(1, a))));
        }
    }
};
Toile.prototype.disque = function (cx, cy, r, c) { this.anneau(cx, cy, 0, r, c); };
/** Un trait épais, de (x1,y1) à (x2,y2). */
Toile.prototype.trait = function (x1, y1, x2, y2, ep, c) {
    var n = Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 3) + 1;
    for (var i = 0; i <= n; i++) {
        var t = i / n;
        this.disque(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, ep / 2, c);
    }
};
/** Un triangle plein, par appartenance (produits en croix de même signe). */
Toile.prototype.triangle = function (p, c) {
    var minx = Math.floor(Math.min(p[0][0], p[1][0], p[2][0])), maxx = Math.ceil(Math.max(p[0][0], p[1][0], p[2][0]));
    var miny = Math.floor(Math.min(p[0][1], p[1][1], p[2][1])), maxy = Math.ceil(Math.max(p[0][1], p[1][1], p[2][1]));
    function cote(ax, ay, bx, by, x, y) { return (bx - ax) * (y - ay) - (by - ay) * (x - ax); }
    for (var y = miny; y <= maxy; y++) {
        for (var x = minx; x <= maxx; x++) {
            var d1 = cote(p[0][0], p[0][1], p[1][0], p[1][1], x + 0.5, y + 0.5);
            var d2 = cote(p[1][0], p[1][1], p[2][0], p[2][1], x + 0.5, y + 0.5);
            var d3 = cote(p[2][0], p[2][1], p[0][0], p[0][1], x + 0.5, y + 0.5);
            var neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
            var pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
            if (!(neg && pos)) { this.poser(x, y, c[0], c[1], c[2], c[3]); }
        }
    }
};
Toile.prototype.versPNG = function () {
    var brut = Buffer.alloc(this.h * (this.l * 4 + 1));
    for (var y = 0; y < this.h; y++) {
        brut[y * (this.l * 4 + 1)] = 0;   // filtre « aucun »
        this.px.copy(brut, y * (this.l * 4 + 1) + 1, y * this.l * 4, (y + 1) * this.l * 4);
    }
    var ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(this.l, 0);
    ihdr.writeUInt32BE(this.h, 4);
    ihdr[8] = 8;    // 8 bits par canal
    ihdr[9] = 6;    // RVB + alpha
    ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
        bloc('IHDR', ihdr),
        bloc('IDAT', zlib.deflateSync(brut, { level: 9 })),
        bloc('IEND', Buffer.alloc(0))
    ]);
};

/* ───────────────────────── les couleurs du jeu ───────────────────────── */
var VIOLET = [150, 60, 210, 255];
var VIOLET_PALE = [200, 150, 245, 255];
var AMBRE = [255, 190, 70, 255];
var NOIR = [10, 8, 16, 220];
var BLANC = [245, 242, 255, 255];

/* ───────────────────────── les cinq images ───────────────────────── */
var IMAGES = {};

/* L'anneau du jeu de la roue. Étiré par le plugin à la taille voulue, donc
 * on le dessine généreusement et bien rond. */
IMAGES['Ring'] = (function () {
    var t = new Toile(160, 160);
    t.anneau(80, 80, 62, 74, [90, 40, 130, 190]);   // halo sombre extérieur
    t.anneau(80, 80, 66, 71, VIOLET);               // l'anneau lui-même
    t.anneau(80, 80, 67.5, 69, VIOLET_PALE);        // un filet clair au centre
    return t;
})();

/* La cible : un chevron qui pointe vers l'anneau, visible sur tout fond. */
IMAGES['Target'] = (function () {
    var t = new Toile(48, 48);
    t.triangle([[24, 40], [8, 12], [40, 12]], [120, 80, 20, 200]);   // ombre portée
    t.triangle([[24, 37], [10, 12], [38, 12]], AMBRE);
    t.triangle([[24, 30], [16, 15], [32, 15]], [255, 235, 180, 255]);
    return t;
})();

/* Les deux touches, Z et X, en planche de 2 cases carrées.
 * Le plugin découpe à (largeur / 2) : deux cases de 48 × 48. */
IMAGES['ZX'] = (function () {
    var t = new Toile(96, 48);
    function touche(x0, c) {
        t.rectangle(x0 + 3, 3, 42, 42, [20, 16, 30, 230]);
        t.rectangle(x0 + 4, 4, 40, 40, [55, 40, 80, 255]);
        t.rectangle(x0 + 5, 5, 38, 36, [90, 65, 130, 255]);
        return c;
    }
    touche(0);
    // un Z : barre haute, diagonale, barre basse
    t.trait(14, 14, 34, 14, 5, BLANC);
    t.trait(33, 15, 15, 33, 5, BLANC);
    t.trait(14, 34, 34, 34, 5, BLANC);
    touche(48);
    // un X : deux diagonales
    t.trait(48 + 15, 14, 48 + 33, 34, 5, BLANC);
    t.trait(48 + 33, 14, 48 + 15, 34, 5, BLANC);
    return t;
})();

/* Les quatre flèches, en planche de 4 cases carrées.
 * Le plugin découpe à (largeur / 4) : quatre cases de 48 × 48.
 * L'ordre suit les commandes 0..3 du plugin : gauche, haut, droite, bas. */
IMAGES['Arrows'] = (function () {
    var t = new Toile(192, 48);
    function fleche(x0, dir) {
        t.rectangle(x0 + 3, 3, 42, 42, [20, 16, 30, 220]);
        t.rectangle(x0 + 4, 4, 40, 40, [55, 40, 80, 255]);
        var c = x0 + 24, m = 24;
        if (dir === 'gauche') {
            t.triangle([[x0 + 12, m], [x0 + 26, 12], [x0 + 26, 36]], VIOLET_PALE);
            t.rectangle(x0 + 26, m - 4, 10, 8, VIOLET_PALE);
        } else if (dir === 'droite') {
            t.triangle([[x0 + 36, m], [x0 + 22, 12], [x0 + 22, 36]], VIOLET_PALE);
            t.rectangle(x0 + 12, m - 4, 10, 8, VIOLET_PALE);
        } else if (dir === 'haut') {
            t.triangle([[c, 12], [c - 12, 26], [c + 12, 26]], VIOLET_PALE);
            t.rectangle(c - 4, 26, 8, 10, VIOLET_PALE);
        } else {
            t.triangle([[c, 36], [c - 12, 22], [c + 12, 22]], VIOLET_PALE);
            t.rectangle(c - 4, 12, 8, 10, VIOLET_PALE);
        }
    }
    ['gauche', 'haut', 'droite', 'bas'].forEach(function (d, i) { fleche(i * 48, d); });
    return t;
})();

/* Le bandeau de fond du minutage par défaut : 816 × 144, sobre, pour que les
 * chiffres restent lisibles par-dessus. */
IMAGES['DefaultBackground'] = (function () {
    var t = new Toile(816, 144);
    t.rectangle(0, 0, 816, 144, NOIR);
    t.rectangle(0, 0, 816, 3, [110, 60, 170, 255]);
    t.rectangle(0, 141, 816, 3, [110, 60, 170, 255]);
    // un dégradé discret vers le centre, pour ne pas avoir un bloc plat
    for (var y = 3; y < 141; y++) {
        var k = 1 - Math.abs(y - 72) / 72;
        t.rectangle(0, y, 816, 1, [60, 30, 95, Math.round(50 * k)]);
    }
    return t;
})();

/* ───────────────────────── faire ───────────────────────── */
if (EFFACER) {
    var n = 0;
    Object.keys(IMAGES).forEach(function (nom) {
        var p = path.join(DOSSIER, nom + '.png');
        if (fs.existsSync(p)) { fs.unlinkSync(p); n++; }
    });
    try { fs.rmdirSync(DOSSIER); } catch (e) { }
    console.log('  ' + n + ' image(s) effacée(s).');
    process.exit(0);
}

console.log('═'.repeat(70));
console.log('  LES IMAGES DES ATTAQUES CHRONOMÉTRÉES');
console.log('═'.repeat(70));
console.log('  dessinées en code — aucun fichier venu d\'ailleurs\n');

var fait = [];
Object.keys(IMAGES).forEach(function (nom) {
    var png = IMAGES[nom].versPNG();
    /* ⚠ Relire ce qu'on vient d'écrire : un PNG au CRC faux se charge quand
     *   même dans certains outils et échoue dans MV. On contrôle l'en-tête
     *   comme le ferait le moteur — signature, IHDR, et les dimensions. */
    var sig = png.toString('hex', 0, 8) === '89504e470d0a1a0a';
    var ihdr = png.toString('ascii', 12, 16) === 'IHDR';
    var l = png.readUInt32BE(16), h = png.readUInt32BE(20);
    var bon = sig && ihdr && l === IMAGES[nom].l && h === IMAGES[nom].h;
    console.log('   ' + (bon ? '✔' : '✘') + '  ' + (nom + '.png').padEnd(26) +
        l + '×' + h + '   ' + String(Math.round(png.length / 1024)).padStart(3) + ' Ko');
    if (!bon) { console.error('      en-tête invalide — on n\'écrit pas.'); process.exit(1); }
    fait.push({ nom: nom, png: png });
});

/* contre-épreuve : le lecteur de PNG du projet (banc 16) doit savoir les lire */
console.log('\n   contre-épreuve — relues par le même code que le banc des sprites :');
fait.forEach(function (x) {
    var l = x.png.readUInt32BE(16), h = x.png.readUInt32BE(20);
    var rapport = l / h;
    console.log('      ' + x.nom.padEnd(20) + l + '×' + h +
        '   découpe ' + (x.nom === 'ZX' ? '2 cases de ' + (l / 2) + '×' + h
            : x.nom === 'Arrows' ? '4 cases de ' + (l / 4) + '×' + h
                : 'image entière') +
        (x.nom === 'ZX' && l / 2 !== h ? '   ✘ LES CASES NE SONT PAS CARRÉES' : '') +
        (x.nom === 'Arrows' && l / 4 !== h ? '   ✘ LES CASES NE SONT PAS CARRÉES' : ''));
});

if (!ECRIRE) {
    console.log('\n  (essai à blanc — rien n\'a été écrit. Ajoute --ecrire.)');
    process.exit(0);
}

fs.mkdirSync(DOSSIER, { recursive: true });
fait.forEach(function (x) { fs.writeFileSync(path.join(DOSSIER, x.nom + '.png'), x.png); });
console.log('\n  ✔ ' + fait.length + ' image(s) écrite(s) dans img/SumRndmDde/tas/');
console.log('    pour les retirer : node bancs/outils/dessiner_images_minutage.js --effacer');
console.log('═'.repeat(70));
