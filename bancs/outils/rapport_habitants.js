/*
 * Le rapport des habitants — docs/HABITANTS.md, régénéré depuis les fiches
 * (bancs/outils/habitants/*.js) : qui, où, quand, ce qu'il propose.
 *   node bancs/outils/rapport_habitants.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var INFOS = JSON.parse(fs.readFileSync(path.join(RACINE, 'data', 'MapInfos.json'), 'utf8'));
var dossier = path.join(__dirname, 'habitants');
var lots = fs.readdirSync(dossier).filter(function (x) { return /\.js$/.test(x) && x !== 'moteur.js' && x.charAt(0) !== '_'; }).sort().map(function (x) { return require(path.join(dossier, x)); });
var parCarte = {};
lots.forEach(function (l) { l.fiches.forEach(function (f) { var c = f.carte || l.carte; (parCarte[c] = parCarte[c] || []).push(f); }); if (l.tableau) (parCarte[l.carte] = parCarte[l.carte] || []).push({ ev: 49, nom: 'Tableau d\'affichage', role: 'affiches de saison', tableau: true }); });
function quand(f) {
    var t = [];
    if (f.horaire) t.push(f.horaire.replace('-', ' h – ') + ' h');
    (f.tags || []).forEach(function (x) {
        if (/Soiree/.test(x)) t.push('le soir au bar');
        if (/Agenda/.test(x)) t.push('agenda ' + x.replace(/<Agenda:\s*|>/g, ''));
        if (/fixe/.test(x)) t.push('garde la ronde de JOKO');
        if (/noctambule/.test(x)) t.push('vit la nuit');
    });
    if (f.passage) t.push('entre et sort par la porte (interrupteur de moment)');
    return t.join(' · ') || '—';
}
function propose(f) {
    var t = [];
    if (f.perso) t.push('« ' + f.perso.titre + ' » (' + f.perso.paliers.length + ' paliers)');
    (f.options || []).forEach(function (o) { t.push(o.titre + (o.si ? ' *(sous condition)*' : '')); });
    return t.join(' · ') || '—';
}
var lignes = [];
var total = 0;
Object.keys(parCarte).map(Number).sort(function (a, b) { return a - b; }).forEach(function (c) {
    var l = parCarte[c].slice().sort(function (a, b) { return a.ev - b.ev; });
    total += l.length;
    lignes.push('\n### ' + (INFOS[c] ? INFOS[c].name : 'Carte ' + c) + ' — carte ' + c + ' (' + l.length + ')\n');
    lignes.push('| év. | Qui | Sa voix | Quand | Ce qu\'il propose |');
    lignes.push('|---|---|---|---|---|');
    l.forEach(function (f) {
        lignes.push('| ' + f.ev + (f.page ? ' p' + f.page : '') + ' | **' + f.nom + '** — ' + (f.role || '') + ' | ' + (f.voix || '—') + ' | ' + quand(f) + ' | ' + propose(f) + ' |');
    });
});
var gabarit = fs.readFileSync(path.join(dossier, '_rapport.md'), 'utf8');
var sortie = gabarit.replace('{{TOTAL}}', String(total)).replace('{{PERSONNAGES}}', lignes.join('\n'));
fs.writeFileSync(path.join(RACINE, 'docs', 'HABITANTS.md'), sortie);
console.log('   docs/HABITANTS.md : ' + total + ' personnages');
