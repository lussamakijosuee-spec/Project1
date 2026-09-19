/*
 * LES PALIERS DES JAUGES D'ESPRIT — un état, un seul, à chaque cran.
 *
 * Chaque héros a sa jauge (variables 11 à 14) et cinq bandes d'état, posées par
 * des « Custom Passive Condition » de YEP_AutoPassiveStates. Deux défauts ont
 * été mesurés le 2026-09-19 et corrigés :
 *   · à 0, ludwing et Aël n'avaient RIEN, là où Vesper et Korrah avaient leur
 *     pire état — la jauge à zéro ne voulait rien dire pour la moitié du groupe ;
 *   · aux crans 2 et 6, DEUX états se posaient en même temps, parce que les
 *     bandes se chevauchaient d'un cran.
 *
 * Le banc évalue les conditions pour de vrai (le même code que le moteur
 * exécute) sur chaque valeur de 0 à 10, et compte.
 *
 * Il se termine par une CONTRE-ÉPREUVE : on recrée volontairement l'ancien
 * chevauchement en mémoire, et le contrôle doit l'attraper. Un contrôle qui ne
 * sait pas dire non ne sait rien dire.
 *
 * Lancement :  node bancs/audit/13_paliers_des_jauges.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var States = JSON.parse(fs.readFileSync(path.join(RACINE, 'data', 'States.json'), 'utf8'));
var System = JSON.parse(fs.readFileSync(path.join(RACINE, 'data', 'System.json'), 'utf8'));

var HEROS = [
    { nom: 'Vesper', v: 11 },
    { nom: 'Korrah', v: 12 },
    { nom: 'ludwing', v: 13 },
    { nom: 'Aël', v: 14 }
];

var ok = 0, ko = 0;
function V(libelle, condition, detail) {
    if (condition) { ok++; console.log('  ✔ ' + libelle + (detail ? '   ' + detail : '')); }
    else { ko++; console.log('  ✘ ' + libelle + (detail ? '   ' + detail : '')); }
}

/** Les états conditionnés par une variable de jauge, avec leur condition. */
function etatsDe(variable, source) {
    var out = [];
    (source || States).forEach(function (s) {
        if (!s || !s.name || !s.name.trim()) { return; }
        var m = (s.note || '').match(/condition\s*=\s*(.+)/);
        if (!m) { return; }
        var cond = m[1].trim();
        if (cond.indexOf('$gameVariables.value(' + variable + ')') < 0) { return; }
        out.push({ id: s.id, nom: s.name.trim(), cond: cond, traits: (s.traits || []).length });
    });
    return out;
}

/** On exécute la condition comme le moteur le ferait, avec la jauge à n. */
function sApplique(cond, variable, n) {
    var faux = { value: function (id) { return id === variable ? n : 0; } };
    try {
        return !!(new Function('$gameVariables', 'return (' + cond.replace(/;\s*$/, '') + ');'))(faux);
    } catch (e) {
        return null;   // condition illisible : c'est un défaut en soi
    }
}

console.log('═'.repeat(74));
console.log('  LES PALIERS DES JAUGES D\'ESPRIT');
console.log('═'.repeat(74));

/* ── le tableau, cran par cran ── */
var tableau = {};
HEROS.forEach(function (h) {
    var liste = etatsDe(h.v);
    tableau[h.nom] = [];
    for (var n = 0; n <= 10; n++) {
        tableau[h.nom][n] = liste.filter(function (e) { return sApplique(e.cond, h.v, n) === true; });
    }
});

console.log('\n cran │ ' + HEROS.map(function (h) { return h.nom.padEnd(24); }).join('│'));
console.log('──────┼' + HEROS.map(function () { return '─'.repeat(25); }).join('┼'));
for (var n = 0; n <= 10; n++) {
    var ligne = ' ' + String(n).padStart(3) + '  │ ';
    ligne += HEROS.map(function (h) {
        var l = tableau[h.nom][n];
        return (l.length ? l.map(function (e) { return e.nom; }).join(' + ') : '— rien —').slice(0, 23).padEnd(24);
    }).join('│');
    console.log(ligne);
}

/* ── les deux règles ── */
console.log('\n── un cran ne laisse jamais le héros sans état ──');
HEROS.forEach(function (h) {
    var vides = [];
    for (var n = 0; n <= 10; n++) { if (!tableau[h.nom][n].length) { vides.push(n); } }
    V(h.nom.padEnd(8) + ' : tous les crans sont couverts', vides.length === 0,
        vides.length ? 'rien aux crans ' + vides.join(', ') : '0 → 10 sans trou');
});

console.log('\n── un cran ne pose jamais deux états AGISSANTS à la fois ──');
// On compte les états qui PORTENT DES TRAITS. Un état sans trait ne modifie
// rien : c'est un badge (la bande normale, « Résonance Passive » au maximum).
// Deux badges ne se marchent pas dessus — deux jeux de traits, si. Mesurer le
// nombre de lignes au lieu du nombre d'effets accuserait un innocent.
HEROS.forEach(function (h) {
    var doubles = [];
    for (var n = 0; n <= 10; n++) {
        var agissants = tableau[h.nom][n].filter(function (e) { return e.traits > 0; });
        if (agissants.length > 1) { doubles.push(n + ' (' + agissants.map(function (e) { return e.nom; }).join(' + ') + ')'); }
    }
    V(h.nom.padEnd(8) + ' : un seul état agissant par cran', doubles.length === 0,
        doubles.length ? 'deux états au cran ' + doubles.join(' · ') : 'aucun chevauchement');
});

console.log('\n── les badges (états sans trait) posés par-dessus ──');
HEROS.forEach(function (h) {
    var badges = [];
    for (var n = 0; n <= 10; n++) {
        tableau[h.nom][n].forEach(function (e) {
            if (e.traits === 0 && tableau[h.nom][n].some(function (x) { return x.traits > 0; })) {
                badges.push('cran ' + n + ' : « ' + e.nom +' »');
            }
        });
    }
    console.log('    ' + h.nom.padEnd(8) + ' ' + (badges.join(' · ') || 'aucun'));
});

console.log('\n── toutes les conditions sont lisibles par le moteur ──');
HEROS.forEach(function (h) {
    var cassees = etatsDe(h.v).filter(function (e) { return sApplique(e.cond, h.v, 5) === null; });
    V(h.nom.padEnd(8) + ' : aucune condition illisible', cassees.length === 0,
        cassees.map(function (e) { return '#' + e.id; }).join(', ') || 'toutes s\'évaluent');
});

/* ── CONTRE-ÉPREUVE ── */
console.log('\n── contre-épreuve : le contrôle sait-il dire NON ? ──');
var copie = JSON.parse(JSON.stringify(States));
// on remet l'ancien défaut : la bande basse de ludwing repart de 0 à 2,
// ce qui la fait chevaucher « Insupportable » (2-3) au cran 2.
var cible = copie[37];
cible.note = cible.note.replace('$gameVariables.value(13) <= 1;', '$gameVariables.value(13) <= 2;');
var listeCassee = etatsDe(13, copie);
var doublesRetrouves = [];
for (var k = 0; k <= 10; k++) {
    // exactement le prédicat de la règle ci-dessus : les états AGISSANTS
    var l = listeCassee.filter(function (e) { return e.traits > 0 && sApplique(e.cond, 13, k) === true; });
    if (l.length > 1) { doublesRetrouves.push(k); }
}
V('un chevauchement volontaire est bien attrapé', doublesRetrouves.length > 0,
    doublesRetrouves.length ? 'repéré au cran ' + doublesRetrouves.join(', ') : 'le contrôle n\'a rien vu — il ne vaut rien');

// et le contraire : la donnée vraie, elle, doit rester innocentée
var listeVraie = etatsDe(13);
var doublesVrais = 0;
for (var q = 0; q <= 10; q++) {
    if (listeVraie.filter(function (e) { return e.traits > 0 && sApplique(e.cond, 13, q) === true; }).length > 1) { doublesVrais++; }
}
V('et la donnée réelle reste innocentée', doublesVrais === 0,
    doublesVrais ? doublesVrais + ' chevauchement(s) réel(s)' : 'aucun faux positif');

/* ── ce qu'on ne corrige pas, et pourquoi ── */
console.log('\n── pour mémoire (ce n\'est pas un défaut) ──');
var sansTraits = [];
HEROS.forEach(function (h) {
    etatsDe(h.v).forEach(function (e) { if (e.traits === 0) { sansTraits.push('#' + e.id + ' « ' + e.nom + ' »'); } });
});
console.log('  Les états de la bande normale n\'ont aucun trait : ' + (sansTraits.join(' · ') || 'aucun'));
console.log('  C\'est cohérent — être normal ne donne rien. Leur icône est à 0, donc');
console.log('  ils ne s\'affichent pas non plus : si JOKO veut que la bande normale se');
console.log('  voie, il suffit de leur poser une icône. Aucun trait n\'a été inventé.');

console.log('\n' + '═'.repeat(74));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('═'.repeat(74));
process.exit(ko ? 1 : 0);
