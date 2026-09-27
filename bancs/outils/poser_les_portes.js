/*
 * LES PORTES DES VILLES
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-09-27 : « pour les portes, si on rentre à l'intérieur de
 * quelque chose, si la porte est fermée, ben ça marque fermée, voilà ce genre
 * de choses. Vraiment, tout ce qui est possible pour ça. »
 * Choix de JOKO : le bar ouvre de 10 h à 4 h ; l'auberge ne ferme jamais.
 *
 * Chaque porte des cartes de ville (image « Door ») est reconstruite :
 *   · AVEC destination : elle garde exactement son « Transférer le joueur »
 *     (carte, case, direction, fondu). Elle s'ouvre (son + animation), on
 *     passe, elle se referme. Selon ce qu'il y a derrière, elle a ses heures :
 *     boutique 8 h-20 h, bar 10 h-4 h, auberge toujours, maison 6 h-22 h,
 *     manoir 7 h-21 h. Fermée : l'écriteau le dit, et on peut frapper —
 *     quelqu'un répond, selon l'heure.
 *   · SANS destination : une maison fermée à clé (ou, dans l'auberge, une
 *     chambre occupée). On frappe : le jour, l'habitant répond ; la nuit, il
 *     râle, ou personne ne bouge.
 * La météo et la teinte n'y sont plus : js/plugins/Interieurs.js s'en charge
 * pour toute carte « intérieur ».
 * On ne touche pas aux portes qui portent une condition d'objet ou une quête
 * (la porte à clé de l'auberge, par exemple), ni à celles qui mènent sur leur
 * propre carte.
 *
 * Instantané des portes d'origine : habitants/portes_originaux.json (écrit au
 * premier passage) — l'outil se relance sans rien perdre.
 *
 *   node bancs/outils/poser_les_portes.js            → contrôle
 *   node bancs/outils/poser_les_portes.js --ecrire   → écrit
 */
'use strict';
var fs = require('fs');
var path = require('path');
var DATA = path.join(__dirname, '..', '..', 'data');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var D = require('./recettes/dsl.js');
var H = require('./habitants/moteur.js');
var A = D.A, C = D.C, si = D.si, cat = D.cat, choix = D.choix, route = D.route;
var ICI = D.CE_EV;
var CARTES = [29, 30, 33, 36, 44, 45];
var INFOS = JSON.parse(fs.readFileSync(path.join(DATA, 'MapInfos.json'), 'utf8'));
function P(nom, t) { return H.parle(nom, t); }
function f(n) { return path.join(DATA, 'Map' + String(n).padStart(3, '0') + '.json'); }

/* ── ce qu'il y a derrière la porte ───────────────────────────────────── */
var GENRES = {
    boutique: { heures: [8, 20], ecriteau: 'Un écriteau : « Fermé. Ouvert de 8 h à 20 h. »',
        frapper: ['« On est fermés ! Revenez à huit heures ! »', '~Une voix étouffée, derrière le bois :|« Je compte la caisse. Demain. »', '« Si c\'est pour un vol, la garde passe toutes les heures. Si c\'est pour acheter : demain. »'] },
    bar: { heures: [10, 4], ecriteau: 'Un écriteau : « Fermé. On lave le sol. Ouverture à 10 h. »',
        frapper: ['« ON EST FERMÉS, MON GRAND ! DIX HEURES ! »', '~Quelqu\'un chante faux derrière la porte, puis se tait.', '« Le vieux est encore là, mais c\'est pas une raison ! »'] },
    auberge: { heures: null },
    maison: { heures: [6, 22], ecriteau: 'La porte est fermée pour la nuit.',
        frapper: ['« Il est tard ! Revenez demain ! »', '~Une lumière s\'allume derrière le volet, puis s\'éteint.', '« Si c\'est pour les impôts du lord, on n\'a plus rien ! »', '~Personne ne répond. On entend quelqu\'un retenir son souffle.'] },
    manoir: { heures: [7, 21], ecriteau: 'Les portes du manoir sont barrées pour la nuit.',
        frapper: ['« Le manoir du lord est fermé. Revenez à une heure décente. »', '~Un judas s\'ouvre. Un œil te détaille, puis le judas se referme.', '« Les nobles dorment. Toi aussi, tu devrais. »'] }
};
function genreDe(dest) {
    if ([41, 42, 43, 53].indexOf(dest) >= 0) return 'boutique';
    if (dest === 46) return 'bar';
    if (dest === 44 || dest === 45) return 'auberge';
    if (dest === 47 || dest === 54) return 'manoir';
    return 'maison';
}
var FERMEE_JOUR = ['« Qui est là ? … On n\'achète rien ! »', '« Maman n\'est pas là ! »', '~Un chien aboie derrière la porte. Personne ne vient.', '« Si c\'est pour un sort, c\'est la voisine. Moi je fais que le pain. »',
    '« C\'est pour quoi ? … Non merci. »', '~Des pas, un silence, puis les pas repartent.', '« Mon mari dort. Il travaille de nuit. Revenez jamais. »', '« Si c\'est le percepteur du lord : je suis mort. »'];
var FERMEE_NUIT = ['« Il est tard ! Allez-vous-en ! »', '~Une lumière s\'allume, puis s\'éteint aussitôt.', '« Encore un ivrogne… Rentre chez toi ! »', '~Personne ne bouge. On entend ronfler.', '« Si vous revenez, j\'appelle la garde ! »'];
var CHAMBRE = ['« Occupé ! »', '~Quelqu\'un ronfle, très fort.', '« Si c\'est l\'aubergiste : je paierai demain ! »', '~Des voix se taisent d\'un coup.', '« Allez-vous-en, je dors ! … Enfin, je dormais. »'];

function heureOuverte(h) {
    var a = h[0], b = h[1];
    return a <= b ? '$gameSystem.hour() >= ' + a + ' && $gameSystem.hour() < ' + b : '$gameSystem.hour() >= ' + a + ' || $gameSystem.hour() < ' + b;
}
function frapper(pool) { return cat(A.se('Knock'), A.attendre(30), H.unParmi('', pool)); }

/* ── l'instantané ─────────────────────────────────────────────────────── */
var FSNAP = path.join(__dirname, 'habitants', 'portes_originaux.json');
var cartes = {};
CARTES.forEach(function (n) { cartes[n] = JSON.parse(fs.readFileSync(f(n), 'utf8')); });
function estPorte(e) { return e && e.pages[0] && /door/i.test(e.pages[0].image.characterName || ''); }
var snap = fs.existsSync(FSNAP) ? JSON.parse(fs.readFileSync(FSNAP, 'utf8')) : null;
if (!snap) {
    snap = {};
    CARTES.forEach(function (n) { cartes[n].events.forEach(function (e) { if (estPorte(e)) snap[n + ':' + e.id] = JSON.parse(JSON.stringify(e)); }); });
    fs.writeFileSync(FSNAP, JSON.stringify(snap, null, 1));
    console.log('   instantané des portes d\'origine écrit');
}

var poses = [], gardees = [], defauts = [];
function versListe(cmds) { return cmds.map(function (c) { return { code: c[0], indent: c[1], parameters: c[2] }; }).concat([{ code: 0, indent: 0, parameters: [] }]); }
CARTES.forEach(function (n) {
    var m = cartes[n], interieur = [44, 45].indexOf(n) >= 0;
    m.events.forEach(function (e) {
        if (!estPorte(e)) return;
        var o = snap[n + ':' + e.id] || e;
        var toutes = [].concat.apply([], o.pages.map(function (p) { return p.list; }));
        if (o.pages.length > 1 || toutes.some(function (c) { return (c.code === 111 && (c.parameters[0] === 8 || c.parameters[0] === 2)) || (c.code === 356 && /QUEST/.test(c.parameters[0])); })) { gardees.push(n + ':' + e.id + ' (condition d\'objet, quête ou plusieurs pages)'); return; }
        var t = toutes.filter(function (c) { return c.code === 201 && c.parameters[0] === 0; })[0];
        var l;
        if (t && t.parameters[1] === n) { gardees.push(n + ':' + e.id + ' (mène sur sa propre carte)'); return; }
        if (t) {
            var dest = t.parameters[1], g = GENRES[genreDe(dest)], nomDest = INFOS[dest] ? INFOS[dest].name : 'carte ' + dest;
            var entrer = cat(A.se('Door1'), route(ICI, D.OUVRIR), [[201, 0, t.parameters.slice()]], route(ICI, D.FERMER, { attendre: false }));
            l = cat(D.note('◆ PORTE — vers « ' + nomDest + ' » (' + genreDe(dest) + (g.heures ? ', ouverte de ' + g.heures[0] + ' h à ' + g.heures[1] + ' h' : ', toujours ouverte') + '). Généré par bancs/outils/poser_les_portes.js ; la destination est celle que JOKO avait posée.'));
            if (!g.heures) l = cat(l, entrer);
            else l = cat(l, si(C.js(heureOuverte(g.heures)), entrer, cat(P('', g.ecriteau), choix(['Frapper', 'Partir'], [frapper(g.frapper), []], { annuler: 1 }))));
            poses.push(n + ':' + e.id + ' → ' + nomDest + ' (' + genreDe(dest) + ')');
        } else {
            l = cat(D.note('◆ PORTE — ' + (interieur ? 'une chambre occupée' : 'une maison fermée à clé') + '. On peut frapper : on répond selon l\'heure. Généré par bancs/outils/poser_les_portes.js.'));
            if (interieur) l = cat(l, P('', 'Une chambre. La porte est verrouillée.'), choix(['Frapper', 'Partir'], [frapper(CHAMBRE), []], { annuler: 1 }));
            else l = cat(l, P('', 'La porte est fermée à clé.'), choix(['Frapper', 'Partir'], [si(C.js('$gameSystem.hour() >= 7 && $gameSystem.hour() < 21'), frapper(FERMEE_JOUR), frapper(FERMEE_NUIT)), []], { annuler: 1 }));
            poses.push(n + ':' + e.id + ' fermée (' + (interieur ? 'chambre' : 'maison') + ')');
        }
        var liste = versListe(l), pile = 0;
        liste.forEach(function (c) { if ([111, 102, 112].indexOf(c.code) >= 0) pile++; if ([412, 404, 413].indexOf(c.code) >= 0) pile--; });
        if (pile) defauts.push(n + ':' + e.id + ' bloc non refermé');
        e.pages[0].list = liste;
        if (!t) e.pages[0].trigger = 0;           // une porte fermée, on la touche exprès
    });
});
console.log('   ' + poses.length + ' portes refaites :');
poses.forEach(function (x) { console.log('     · ' + x); });
if (gardees.length) console.log('   ' + gardees.length + ' laissées telles quelles : ' + gardees.join(' · '));
if (defauts.length) { console.log('   ✗ ' + defauts.join('\n     ')); process.exit(1); }
if (!ECRIRE) process.exit(0);
CARTES.forEach(function (n) { fs.writeFileSync(f(n), JSON.stringify(cartes[n])); });
console.log('   écrit : cartes ' + CARTES.join(', '));
