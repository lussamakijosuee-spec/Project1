/*
 * ÉCRIRE LES SEMAINES — trois semaines de Theatrhythm, comme les mods de FNF
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-02 : « Fait moi des exemples de combat comme whitty, dabi et mat
 * pour song ». Trois adversaires, trois chansons chacun, de plus en plus durs,
 * sur des musiques DU JEU (aucune musique ajoutée). Chaque note tombe sur une
 * attaque réelle de la musique (mesurée), et le style vient du personnage :
 *
 *   WHITTY — la bombe : des flèches, des rafales qui roulent (← ↓ ↑ →), des
 *            bombes (notes rouges) qui arrivent dans la 2e et la 3e chanson.
 *   MATT   — le boxeur : les poings A S Z X en enchaînements (le 1-2, le
 *            crochet), les esquives ← →, l'uppercut doré, les scies à
 *            éviter dans Target Practice.
 *   DABI   — les flammes bleues : à contretemps, tout le clavier, des
 *            flammes (rouges) de plus en plus nombreuses, des murs de feu.
 *
 * Écrit theatrhythm/<musique>.json (lu par TheatrhythmPlus). Les événements
 * communs qui les lancent sont posés par poser_les_semaines.js.
 *
 *   node bancs/outils/ecrire_les_semaines.js
 */
'use strict';
var fs = require('fs'), path = require('path');
var RACINE = path.join(__dirname, '..', '..');

// [adversaire, n°, titre, musique, ennemi, vitesse, style]
var SEMAINES = require('./semaines.json');

// touches de MOG : 0 A, 1 S, 2 Z, 3 X, 4 ↑, 5 →, 6 ←, 7 ↓
var G = 6, B = 7, H = 4, D = 5, A = 0, S = 1, Z = 2, X = 3;

function hasard(graine) {
    var h = 2166136261;
    for (var i = 0; i < graine.length; i++) { h ^= graine.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () { h += 0x6D2B79F5; var t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// Choisir les instants : sur la grille, là où la musique attaque vraiment
// niveaux : 4 = seulement les temps, 2 = les croches, 1 = les doubles-croches
function instants(m, o) {
    var res = [], dernier = -1e9;
    m.grille.forEach(function (c, g) {
        var t = c[0], rel = c[1], abs = c[2], vol = c[4];
        var niveau = g % 4 === 0 ? 'temps' : g % 2 === 0 ? 'croche' : 'double';
        if (o.pas === 4 && niveau !== 'temps') return;
        if (o.pas === 2 && niveau === 'double') return;
        var force = rel * (niveau === 'temps' ? 1.15 : 1) * (o.contretemps && niveau !== 'temps' ? 1.25 : 1);
        if (force < o.seuil[niveau] || abs < o.absolu || vol < 0.06) return;
        if (t - dernier < o.ecart) return;
        res.push({ g: g, t: t, bande: c[3], force: force, niveau: niveau });
        dernier = t;
    });
    return res;
}

function phrase(g) { return Math.floor(g / 64); }   // quatre mesures
function mesure(g) { return Math.floor(g / 16); }

// Une place libre pour une note rouge : un contretemps sans rien à côté. Dans un passage
// trop dense, la note la plus faible d'un contretemps de la mesure devient rouge (elle reste sur le rythme).
function placerPieges(m, notes, chaqueMesures, rnd, touches, murs) {
    var pieges = [], nbMesures = Math.ceil(m.grille.length / 16);
    for (var me = 1; me < nbMesures; me += chaqueMesures) {
        var avant = pieges.length;
        placerUn(me);
        if (pieges.length === avant) {
            var faibles = notes.filter(function (n) { return mesure(n.g) === me && n.g % 4 !== 0 && n.type === 0; })
                .sort(function (a, b) { return a.force - b.force; });
            if (faibles.length) { faibles[0].type = 3; if (murs && me % 4 === 3 && faibles[1]) faibles[1].type = 3; }
        }
    }
    return pieges;
    function placerUn(me) {
        for (var essai = 0; essai < 12; essai++) {
            var g = me * 16 + 2 + 4 * Math.floor(rnd() * 4) + (rnd() < 0.3 ? 1 : 0);
            var c = m.grille[g];
            if (!c || c[4] < 0.1) continue;
            var libre = notes.concat(pieges).every(function (n) { return Math.abs(n.t - c[0]) > 140; });
            if (!libre) continue;
            pieges.push({ g: g, t: c[0], touche: touches[Math.floor(rnd() * touches.length)], type: 3 });
            // un mur de feu : une deuxième flamme une croche plus tard, sur une autre touche
            if (murs && (me % 4 === 3)) {
                var c2 = m.grille[g + 2];
                if (c2 && notes.every(function (n) { return Math.abs(n.t - c2[0]) > 140; })) {
                    var autre = touches.filter(function (t) { return t !== pieges[pieges.length - 1].touche; });
                    pieges.push({ g: g + 2, t: c2[0], touche: autre[Math.floor(rnd() * autre.length)], type: 3 });
                }
            }
            break;
        }
    }
}

// Des notes trop proches sur la même rangée se chevauchent : on les étage
function etager(notes, vitesse) {
    var largeur = 64 / (vitesse * 0.06);   // le temps que met une note à avancer de sa largeur
    for (var i = 1; i < notes.length; i++) {
        var p = notes[i - 1], n = notes[i];
        if (n.t - p.t < largeur && n.rang === p.rang) n.rang = ((p.rang < 0 ? 0 : p.rang) + 1) % 4;
    }
}

var STYLES = {
    // ── WHITTY ──────────────────────────────────────────────────────────
    whitty: function (m, c, rnd) {
        var n = c.niveau, o = [
            { pas: 2, seuil: { temps: 1.2, croche: 1.55, double: 9 }, absolu: 0.5, ecart: 220 },
            { pas: 1, seuil: { temps: 1.1, croche: 1.35, double: 1.9 }, absolu: 0.45, ecart: 150 },
            { pas: 1, seuil: { temps: 1.0, croche: 1.2, double: 1.45 }, absolu: 0.4, ecart: 105 }][n - 1];
        var choisis = instants(m, o), notes = [], alterne = 0;
        var paires = [[G, B], [B, H], [H, D]];
        choisis.forEach(function (x, i) {
            var paire = paires[x.bande], touche = paire[alterne++ % 2];
            var rang = n === 1 ? mesure(x.g) % 4 : n === 2 ? Math.floor(x.g / 8) % 4 : -1;
            notes.push({ g: x.g, t: x.t, touche: touche, rang: rang, type: 0, force: x.force });
        });
        // les rafales : quatre doubles-croches de suite roulent sur les flèches
        if (n >= 2) {
            for (var i = 0; i + 3 < notes.length; i++) {
                if (notes[i + 3].g - notes[i].g === 3) {
                    var sens = rnd() < 0.5 ? [G, B, H, D] : [D, H, B, G];
                    for (var k = 0; k < 4; k++) { notes[i + k].touche = sens[k]; notes[i + k].rang = k; }
                    i += 3;
                }
            }
        }
        dorer(notes, n === 3);
        if (n === 3) soigner(notes, 16);
        var pieges = n === 1 ? [] : placerPieges(m, notes, n === 2 ? 8 : 2, rnd, [G, B, H, D], false);
        return notes.concat(pieges);
    },
    // ── MATT ────────────────────────────────────────────────────────────
    matt: function (m, c, rnd) {
        var n = c.niveau, o = [
            { pas: 2, seuil: { temps: 1.15, croche: 1.6, double: 9 }, absolu: 0.45, ecart: 250 },
            { pas: 2, seuil: { temps: 1.05, croche: 1.3, double: 9 }, absolu: 0.4, ecart: 170 },
            { pas: 1, seuil: { temps: 1.0, croche: 1.2, double: 1.6 }, absolu: 0.4, ecart: 120 }][n - 1];
        var choisis = instants(m, o), notes = [], combo = [A, S, A, Z], k = 0, derniereMesure = -1;
        choisis.forEach(function (x, i) {
            if (mesure(x.g) !== derniereMesure) { derniereMesure = mesure(x.g); k = 0; }
            var touche;
            // une attaque faible sur un contretemps : on esquive
            if (n >= 2 && x.niveau !== 'temps' && x.force < o.seuil[x.niveau] + 0.25) touche = (k % 2) ? D : G;
            // le même son deux fois de suite, à une croche : le même poing (un « jack »)
            else if (n >= 2 && notes.length && x.g - notes[notes.length - 1].g === 2 && notes[notes.length - 1].bande === x.bande && notes[notes.length - 1].touche <= Z) touche = notes[notes.length - 1].touche;
            else touche = x.bande === 0 && x.force > 1.8 ? Z : combo[k % (n === 1 ? 2 : 4)];
            k++;
            var rang = n === 1 ? Math.floor(mesure(x.g) / 2) % 4 : n === 2 ? mesure(x.g) % 4 : Math.floor(x.g / 4) % 4;
            notes.push({ g: x.g, t: x.t, touche: touche, rang: rang, type: 0, bande: x.bande, force: x.force });
        });
        // l'uppercut : la première note de chaque phrase, dorée, sur X
        var vues = {};
        notes.forEach(function (x) { var p = phrase(x.g); if (!vues[p]) { vues[p] = true; x.touche = X; x.type = 1; } });
        if (n >= 2) soigner(notes, 16);
        // Target Practice : les scies, toutes les deux mesures
        var pieges = n === 3 ? placerPieges(m, notes, 2, rnd, [G, D, B, H], false) : [];
        return notes.concat(pieges);
    },
    // ── DABI ────────────────────────────────────────────────────────────
    dabi: function (m, c, rnd) {
        var n = c.niveau, o = [
            { pas: 2, seuil: { temps: 1.25, croche: 1.35, double: 9 }, absolu: 0.5, ecart: 230, contretemps: true },
            { pas: 1, seuil: { temps: 1.15, croche: 1.25, double: 1.8 }, absolu: 0.45, ecart: 160, contretemps: true },
            { pas: 1, seuil: { temps: 1.05, croche: 1.15, double: 1.5 }, absolu: 0.4, ecart: 120, contretemps: true }][n - 1];
        var choisis = instants(m, o), notes = [], alterne = 0;
        var groupes = [[G, B], [A, S], [H, D, Z, X]];
        choisis.forEach(function (x) {
            var gr = groupes[x.bande], touche = gr[alterne++ % gr.length];
            notes.push({ g: x.g, t: x.t, touche: touche, rang: -1, type: 0, force: x.force });
        });
        dorer(notes, false);
        soigner(notes, 16);
        var pieges = placerPieges(m, notes, [4, 2, 1][n - 1], rnd, [G, B, H, D, A, S, Z, X], n === 3);
        return notes.concat(pieges);
    }
};
// la première note de chaque phrase est dorée ; en 3e chanson, aussi la plus forte
function dorer(notes, plusForte) {
    var vues = {}, fortes = {};
    notes.forEach(function (x) {
        var p = phrase(x.g);
        if (!vues[p]) { vues[p] = true; x.type = 1; }
        if (plusForte && (!fortes[p] || x.force > fortes[p].force)) fortes[p] = x;
    });
    Object.keys(fortes).forEach(function (p) { fortes[p].type = 1; });
}
// une note verte toutes les N mesures
function soigner(notes, chaque) {
    var dernier = -1e9;
    notes.forEach(function (x) { if (x.type === 0 && mesure(x.g) - dernier >= chaque) { x.type = 2; dernier = mesure(x.g); } });
}

function ecrire(m, c) {
    var rnd = hasard(c.musique + '|' + c.style + '|' + c.niveau);
    var notes = STYLES[c.style](m, c, rnd).sort(function (a, b) { return a.t - b.t; });
    etager(notes, c.vitesse);
    var p = {
        version: 1, musique: c.musique, titre: c.adversaire + ' ' + c.niveau + ' · ' + c.titre, auteur: 'exemple écrit pour JOKO (ecrire_les_semaines.js)',
        bpm: m.bpm, decalage: m.decalage, pvSelonChanson: 0.8,
        notes: notes.map(function (x) { return [x.t, x.touche, x.rang, x.type]; })
    };
    var dossier = path.join(RACINE, 'theatrhythm');
    if (!fs.existsSync(dossier)) fs.mkdirSync(dossier);
    fs.writeFileSync(path.join(dossier, c.musique.replace(/[\\/:*?"<>|]/g, '_') + '.json'), JSON.stringify(p, null, 1));
    var compte = [0, 1, 2, 3].map(function (t) { return notes.filter(function (x) { return x.type === t; }).length; });
    return p.titre + ' — ' + c.musique + ' (' + m.bpm + ' t/min, ' + Math.round(m.duree / 1000) + ' s) : ' + notes.length + ' notes, ' +
        (notes.length / (m.duree / 1000)).toFixed(1) + '/s · dorées ' + compte[1] + ' · vertes ' + compte[2] + ' · rouges ' + compte[3];
}

if (require.main === module) {
    var musiques = SEMAINES.map(function (c) { return c.musique; });
    require('./mesurer_les_musiques').mesurer(musiques).then(function (mesures) {
        mesures.forEach(function (m, i) {
            if (m.erreur) { console.log(SEMAINES[i].musique + ' : ' + m.erreur); return; }
            console.log(ecrire(m, SEMAINES[i]));
        });
    });
}
module.exports = { ecrire: ecrire, STYLES: STYLES };
