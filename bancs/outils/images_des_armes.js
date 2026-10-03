/*
 * L'IMAGE DE CHAQUE ARME EN COMBAT — <Image d'arme: …> (CombatPlus)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-03 : « OUI » à « je peux les associer automatiquement par
 * type […] la couleur suivrait l'élément ou la rareté ».
 *
 * Les 512 images de img/weapons (pack de Yanfly) : <famille> <couleur>.png.
 *   · la FAMILLE vient du type d'arme (table TYPES) ;
 *   · la COULEUR vient du premier élément d'attaque qui n'est pas « Physique »
 *     (table ELEMENTS) ; sans élément, du rang de prix de l'arme dans son type
 *     (table RANGS : les moins chères en Base, les plus chères en Yellow).
 * Tout se règle dans les tables ci-dessous. Idempotent : relancer réécrit la
 * balise posée par cet outil ; une balise écrite à la main (sans le
 * commentaire « auto ») n'est jamais touchée.
 *
 *   node bancs/outils/images_des_armes.js            (montre ce qui changerait)
 *   node bancs/outils/images_des_armes.js --ecrire
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var FW = path.join(RACINE, 'data', 'Weapons.json');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;

// type d'arme (nom dans Système, sans espaces au bout) → famille d'images
var TYPES = {
    'Épée': 'Sword', 'Hache': 'Axe', 'Canne': 'Cane', 'Arc': 'Bow', 'Gant': 'Glove', 'fusil': 'Rifle',
    'Dague': 'Dagger', 'pompe': 'Shotgun', 'arme a feu': 'Gun', 'fouet': 'Whip', 'Arbalète': 'Crossbow',
    'Griffe': 'Claw', 'Lance': 'Spear',
    // pas précisés par JOKO : défauts réglables
    'OMBRE': 'Sword Dark', 'SANG': 'Sword Red'
};
// élément d'attaque → couleur
var ELEMENTS = {
    'mana spirituelle': 'Cyan', 'mana positive': 'Light', 'mana négative': 'Purple', 'Mana Sombre': 'Dark',
    'Mana Originel': 'Magenta', 'AME': 'Violet', 'FEU': 'Red', 'EAU': 'Blue', 'VENT': 'Lime', 'TERRE': 'Orange',
    'FOUDRE': 'Yellow', 'GLACE': 'Cyan', 'LUMIÈRE': 'Light', 'OMBRE': 'Dark', 'mana semi parfait': 'Pink',
    'Vapeur': 'Grey', 'Lave': 'Red', 'Plante': 'Green', 'Givre': 'Navy', 'Métal': 'Grey', 'Crépuscule': 'Violet'
};
// sans élément : rang de prix dans le type (du moins cher au plus cher)
var RANGS = ['Base', 'Grey', 'Light', 'Yellow'];

var S = JSON.parse(fs.readFileSync(path.join(RACINE, 'data', 'System.json'), 'utf8'));
var W = JSON.parse(fs.readFileSync(FW, 'utf8'));
var images = {};
fs.readdirSync(path.join(RACINE, 'img', 'weapons')).forEach(function (f) { images[f.replace(/\.png$/i, '')] = 1; });
var AUTO = /\n?<Image d'arme: [^>]*> ?<!-- auto -->/;

// les prix, par type, pour les rangs
var parType = {};
W.forEach(function (w) { if (w && w.name) (parType[w.wtypeId] = parType[w.wtypeId] || []).push(w.price); });
Object.keys(parType).forEach(function (k) { parType[k].sort(function (a, b) { return a - b; }); });

var changes = 0, garde = 0, sansImage = [], compte = {};
W.forEach(function (w) {
    if (!w || !w.name) return;
    if (/<(Image d'arme|Weapon Image)\s*:/i.test(w.note) && !AUTO.test(w.note)) { garde++; return; }
    var type = (S.weaponTypes[w.wtypeId] || '').trim();
    var fam = TYPES[type];
    if (!fam) { sansImage.push(w.id + ' ' + w.name + ' (type « ' + type + ' »)'); return; }
    var nom;
    if (/ [A-Z][a-z]+$/.test(fam) && images[fam]) nom = fam;           // une image fixe (« Sword Dark »)
    else {
        var el = w.traits.filter(function (t) { return t.code === 31; }).map(function (t) { return (S.elements[t.dataId] || '').trim(); })
            .filter(function (n) { return n && n !== 'Physique'; })[0];
        var coul = el && ELEMENTS[el];
        if (!coul) {
            var prix = parType[w.wtypeId], rang = prix.length > 1 ? prix.indexOf(w.price) / (prix.length - 1) : 0;
            coul = RANGS[Math.min(RANGS.length - 1, Math.floor(rang * RANGS.length))];
        }
        nom = fam + ' ' + coul;
        if (!images[nom]) nom = fam + ' Base';
    }
    if (!images[nom]) { sansImage.push(w.id + ' ' + w.name + ' (image « ' + nom + ' » absente)'); return; }
    var note = w.note.replace(AUTO, '');
    var neuve = note + (note && !/\n$/.test(note) ? '\n' : '') + "<Image d'arme: " + nom + '> <!-- auto -->';
    if (neuve !== w.note) { changes++; w.note = neuve; }
    compte[nom] = (compte[nom] || 0) + 1;
});

console.log('IMAGES DES ARMES — ' + changes + ' arme(s) à (re)nommer · ' + garde + ' gardée(s) à la main');
console.log('   ' + Object.keys(compte).sort().map(function (k) { return k + ' ×' + compte[k]; }).join(' · '));
if (sansImage.length) console.log('   ⚠ sans image : ' + sansImage.join(' | '));
if (ECRIRE && changes) {
    // le format de l'éditeur : une arme par ligne
    fs.writeFileSync(FW, '[\n' + W.map(function (x) { return JSON.stringify(x); }).join(',\n') + '\n]');
    console.log('   écrit data/Weapons.json');
} else if (!ECRIRE) console.log('   (ajoute --ecrire pour écrire)');
process.exit(sansImage.length ? 1 : 0);
