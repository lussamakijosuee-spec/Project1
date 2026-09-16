/*
 * BANC — LE VISAGE DE CHAQUE ENNEMI, ET SA PLACE DANS L'ÉCRAN
 * ---------------------------------------------------------------------------
 * Un ennemi dont l'image n'existe pas ne lève AUCUNE erreur : MV affiche du
 * vide et le combat continue. 51 ennemis étaient dans ce cas, et 4 autres
 * pointaient sur une photo de 446×1102 sans couche alpha.
 *
 * ⚠ CE BANC S'EST TROMPÉ UNE FOIS, ET ÇA A COÛTÉ 298 PLACEMENTS.
 *
 * Il contrôlait « est-ce un sprite » — couche alpha, ≤ 900×900 — et concluait
 * que tout allait bien. Mais la bande visible du combat ne fait que 444 px de
 * haut : en dessous, c'est l'interface. Un sprite de 780 px posé à y=300 a
 * 478 px au-dessus de l'écran, et on n'en voit que les pieds. Le contrôle
 * mesurait le MOTIF (« ça ressemble à un sprite ») au lieu du SYMPTÔME
 * (« on le voit en entier »). C'est très exactement ce que §6 interdit.
 *
 * Il mesure maintenant ce que le joueur voit : pour chaque ennemi, à la place
 * la plus haute où une troupe le pose, le sprite — mis à l'échelle par son
 * `<Scale Sprite: n%>` — doit tenir entier dans la bande visible.
 *
 *   node bancs/8_visages_ennemis.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');

// La géométrie du combat, relevée dans le moteur qui tourne (sideview 816×624) :
// l'interface occupe tout ce qui est sous 444, et `Sprite_Enemy` s'ancre aux
// PIEDS (ancre 0.5, 1) — `y` est donc le bas du sprite, pas son haut.
var BANDE = 444;
var LARGEUR = 816;

function dim(nom) {
    try {
        var b = fs.readFileSync(path.join(RACINE, 'img/enemies', nom + '.png'));
        if (b.slice(1, 4).toString() !== 'PNG') { return null; }
        return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), couleur: b[25], o: b.length };
    } catch (e) { return null; }
}
/** Un sprite de combattant : couche alpha (type 6), et pas un fichier énorme. */
function estSprite(d) { return !!d && d.couleur === 6 && d.w <= 900 && d.h <= 900 && d.o <= 600000; }

/** L'échelle que `YEP_X_AnimatedSVEnemies` appliquera à cet ennemi. */
function echelle(e) {
    var m = /<\s*Scale Sprite\s*:\s*(\d+)\s*[%％]\s*>/i.exec(e.note || '');
    return m ? parseInt(m[1], 10) / 100 : 1;
}

/** Où les troupes posent chaque ennemi, au plus contraignant. */
function placements() {
    var T = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Troops.json'), 'utf8'));
    var p = {};
    T.forEach(function (t) {
        if (!t || !t.name) { return; }
        (t.members || []).forEach(function (m) {
            var o = p[m.enemyId] = p[m.enemyId] || { y: Infinity, demi: Infinity, n: 0 };
            o.y = Math.min(o.y, m.y);
            o.demi = Math.min(o.demi, m.x, LARGEUR - m.x);
            o.n++;
        });
    });
    return p;
}

function controles(E, POSE) {
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

    // ── Ce que le joueur voit vraiment ───────────────────────────────────────
    var coupes = [], deborde = [];
    reels.forEach(function (e) {
        var d = dim(e.battlerName);
        if (!d) { return; }
        var p = POSE[e.id];
        if (!p) { return; }                 // aucune troupe ne l'emploie encore
        var k = echelle(e);
        var haut = p.y - d.h * k;
        if (haut < 0) {
            coupes.push(e.name + ' (' + d.w + 'x' + d.h + ' à ' + Math.round(k * 100) + '% posé à y=' + p.y + ' → ' + Math.round(-haut) + 'px hors écran)');
        }
        if (d.w * k / 2 > p.demi) {
            deborde.push(e.name + ' (' + Math.round(d.w * k / 2 - p.demi) + 'px hors du bord)');
        }
    });
    r.push(['aucun ennemi n\'a la tête coupée par le haut de l\'écran', coupes.length === 0,
        coupes.length ? coupes.length + ' : ' + coupes.slice(0, 3).join(' · ') : 'tous tiennent dans les ' + BANDE + ' px visibles']);
    r.push(['aucun ennemi ne déborde d\'un côté de l\'écran', deborde.length === 0,
        deborde.length ? deborde.length + ' : ' + deborde.slice(0, 3).join(' · ') : 'tous tiennent dans les ' + LARGEUR + ' px de large']);

    return r;
}

var E = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Enemies.json'), 'utf8'));
var POSE = placements();
var ok = 0, ko = 0;
console.log('LE VISAGE DE CHAQUE ENNEMI, ET SA PLACE DANS L\'ÉCRAN\n');
console.log('1) Sur la vraie base');
controles(E, POSE).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

var SABOTAGES = [
    ['un ennemi pointé sur un fichier inexistant', function (b) { b.filter(function (e) { return e && e.name; })[0].battlerName = 'CeFichierNExistePas'; }, /existe sur le disque/],
    ['un ennemi remis sur la photo de 446×1102', function (b) { b.filter(function (e) { return e && e.name; })[0].battlerName = 'HIcnxzI'; }, /photo à la place/],
    ['tous les ennemis ramenés au même visage', function (b) { b.forEach(function (e) { if (e && e.name) { e.battlerName = 'Bat'; } }); }, /variété/],
    ['une mise à l\'échelle retirée à un géant', function (b) {
        // Le cas réel : un sprite trop haut sans son <Scale Sprite>.
        var g = b.filter(function (e) {
            if (!e || !e.name || !POSE[e.id]) { return false; }
            var d = dim(e.battlerName);
            return d && d.h > POSE[e.id].y;
        })[0];
        if (g) { g.note = (g.note || '').replace(/<Scale Sprite:[^>]*>/gi, ''); }
    }, /tête coupée/],
    ['un ennemi large repoussé contre le bord', function (b) {
        var g = b.filter(function (e) {
            if (!e || !e.name || !POSE[e.id]) { return false; }
            var d = dim(e.battlerName);
            return d && d.w * echelle(e) > 200;
        })[0];
        if (g) { POSE[g.id] = { y: POSE[g.id].y, demi: 10, n: POSE[g.id].n }; }
    }, /déborde d'un côté/]
];
console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
SABOTAGES.forEach(function (s) {
    var b = JSON.parse(JSON.stringify(E));
    var pose0 = JSON.parse(JSON.stringify(POSE));
    s[1](b);
    var vise = controles(b, POSE).filter(function (c) { return !c[1] && s[2].test(c[0]); });
    POSE = pose0;                        // le sabotage de placement ne déborde pas sur le suivant
    if (vise.length) { ok++; console.log('   ✓ ' + s[0] + '  →  « ' + vise[0][0] + ' » tombe'); }
    else { ko++; console.log('   ✗ ' + s[0] + '  →  son contrôle ne tombe PAS'); }
});

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
