/*
 * POSER LES SEMAINES — les événements communs qui lancent les combats en chanson
 * ---------------------------------------------------------------------------
 * Pour chaque chanson de semaines.json : un événement commun « 🎵 Whitty 1 ·
 * Lo-Fight » (la musique, puis le Theatrhythm contre l'ennemi, à sa vitesse).
 * Pour chaque adversaire : « 🎵 Semaine Whitty », les trois à la suite ; perdu
 * (l'interrupteur de résultat du Theatrhythm éteint), la semaine s'arrête.
 *
 * Aucun événement de carte n'est posé : JOKO appelle ces événements communs
 * où il veut. Les événements posés portent la ligne « ◆ SEMAINE » : relancer
 * l'outil ne réécrit qu'eux. Refuse d'écrire si RPG Maker est ouvert.
 *
 *   node bancs/outils/poser_les_semaines.js
 */
'use strict';
var fs = require('fs'), path = require('path'), cp = require('child_process');
var RACINE = path.join(__dirname, '..', '..');
var SEMAINES = require('./semaines.json');

try {
    var taches = cp.execSync('tasklist', { encoding: 'utf8' });
    if (/RPGMV\.exe/i.test(taches)) { console.error('RPG Maker est ouvert : rien n\'est écrit (il réécrirait data/ à sa sauvegarde).'); process.exit(1); }
} catch (e) { /* pas Windows */ }

var fCE = path.join(RACINE, 'data', 'CommonEvents.json');
var ce = JSON.parse(fs.readFileSync(fCE, 'utf8'));
var ennemis = JSON.parse(fs.readFileSync(path.join(RACINE, 'data', 'Enemies.json'), 'utf8'));
var plugins = JSON.parse(/var \$plugins =\s*(\[[\s\S]*\]);?\s*$/.exec(fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8'))[1]);
var mog = plugins.filter(function (p) { return p.name === 'MOG_Theatrhythm'; })[0];
var interrupteur = Number(mog.parameters['Result Switch ID'] || 10);

function marque(e) { return e && e.list.some(function (c) { return c.code === 408 && /◆ SEMAINE/.test(c.parameters[0]); }); }
function cmd(code, indent, p) { return { code: code, indent: indent, parameters: p }; }
function commentaire(lignes, indent) { return lignes.map(function (l, i) { return cmd(i ? 408 : 108, indent || 0, [l]); }); }
function message(lignes, indent) { return [cmd(101, indent, ['', 0, 0, 2])].concat(lignes.map(function (l) { return cmd(401, indent, [l]); })); }

// Les places : celles qu'on a déjà posées, sinon à la suite de la liste
var places = {};
ce.forEach(function (e) { if (marque(e)) places[e.name.replace(/^🎵\s*/, '').split(' · ')[0].trim()] = e.id; });
function place(cle) {
    if (places[cle]) return places[cle];
    var id = ce.length;
    ce.push(null);
    places[cle] = id;
    return id;
}

var parAdversaire = {};
SEMAINES.forEach(function (c) {
    var cle = c.adversaire + ' ' + c.niveau, id = place(cle), en = ennemis[c.ennemi];
    var p = JSON.parse(fs.readFileSync(path.join(RACINE, 'theatrhythm', c.musique + '.json'), 'utf8'));
    var list = commentaire([
        '🎵 ' + c.adversaire + ' ' + c.niveau + ' · ' + c.titre + ' — sur « ' + c.musique + ' »',
        '◆ SEMAINE (posé par bancs/outils/poser_les_semaines.js : relancer l\'outil réécrit cet événement)',
        'Contre ' + en.name + ' (ennemi ' + c.ennemi + '), vitesse ' + c.vitesse + ' · ' + p.notes.length + ' notes',
        'La partition : theatrhythm/' + c.musique + '.json — à retoucher avec « theatrhythm_editeur ' + c.musique + ' »',
        'Gagné : interrupteur ' + interrupteur + ' allumé (réglage de MOG_Theatrhythm).'
    ]).concat([
        cmd(356, 0, ['theatrhythm_musique ' + c.musique]),
        cmd(356, 0, ['theatrhythm : ' + c.ennemi + ' : ' + c.vitesse]),
        cmd(0, 0, [])
    ]);
    ce[id] = { id: id, list: list, name: '🎵 ' + cle + ' · ' + c.titre, switchId: 1, trigger: 0 };
    (parAdversaire[c.adversaire] = parAdversaire[c.adversaire] || []).push({ id: id, c: c });
});

Object.keys(parAdversaire).forEach(function (adv) {
    var id = place('Semaine ' + adv), chansons = parAdversaire[adv];
    var list = commentaire([
        '🎵 Semaine ' + adv + ' — les trois chansons à la suite, comme une semaine de FNF',
        '◆ SEMAINE (posé par bancs/outils/poser_les_semaines.js : relancer l\'outil réécrit cet événement)',
        'Perdu à une chanson (interrupteur ' + interrupteur + ' éteint) : la semaine s\'arrête là.'
    ]);
    chansons.forEach(function (x, i) {
        list.push(cmd(117, 0, [x.id]));
        list.push(cmd(111, 0, [0, interrupteur, 1]));   // perdu ?
        list = list.concat(message(['\\C[2]Perdu…\\C[0] La semaine ' + adv + ' s\'arrête à « ' + x.c.titre + ' ».'], 1));
        list.push(cmd(115, 1, []));
        list.push(cmd(0, 1, []));
        list.push(cmd(412, 0, []));
        if (i < chansons.length - 1) list = list.concat(message(['« ' + x.c.titre + ' » : gagné ! Prochaine chanson : « ' + chansons[i + 1].c.titre + ' ».'], 0));
    });
    list = list.concat(message(['\\C[17]Semaine ' + adv + ' terminée !\\C[0]'], 0));
    list.push(cmd(0, 0, []));
    ce[id] = { id: id, list: list, name: '🎵 Semaine ' + adv, switchId: 1, trigger: 0 };
});

fs.writeFileSync(fCE, JSON.stringify(ce));
ce.forEach(function (e) { if (marque(e)) console.log(e.id + '  ' + e.name); });
