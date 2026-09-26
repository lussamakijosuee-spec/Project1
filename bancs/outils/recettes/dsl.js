/*
 * LE VOCABULAIRE DES RECETTES — de vraies commandes d'événement RPG Maker MV.
 *
 * Chaque fonction rend une liste de [code, indentRelative, paramètres].
 * Les blocs (si, choix, boucle, combat…) ferment eux-mêmes leurs branches
 * comme l'éditeur le ferait. Rien ici n'écrit un commentaire à la place d'une
 * action : un commentaire n'est qu'une explication.
 */
'use strict';

function I(l, n) { return l.map(function (c) { return [c[0], c[1] + (n || 1), c[2]]; }); }
function cat() { var out = []; for (var i = 0; i < arguments.length; i++) { var a = arguments[i]; if (!a || !a.length) continue; out = out.concat(Array.isArray(a[0]) ? a : [a]); } return out; }
function seq(listes) { return cat.apply(null, listes); }
function fin(n) { return [0, n || 1, []]; }
function audio(name, volume, pitch) { return { name: name, volume: volume == null ? 90 : volume, pitch: pitch || 100, pan: 0 }; }

/* ── les interrupteurs et variables réservés à l'atelier (901…) ─────────── */
var SW = {}, VAR = {}, NOMS_SW = {}, NOMS_VAR = {};
function reserver(table, noms, id, cle, nom) { table[cle] = id; noms[id] = '✎ ' + nom; }
[['lampes', 'Lampes allumées'], ['lampesAuto', 'Lampes — système installé'], ['pont', 'Pont baissé'],
 ['levierA', 'Levier A'], ['levierB', 'Levier B'], ['levierC', 'Levier C'], ['enigme', 'Énigme résolue'],
 ['portail', 'Portail ouvert'], ['boss', 'Boss vaincu'], ['cloche', 'Cloche sonnée'], ['coffreFort', 'Coffre-fort ouvert'],
 ['cinema', 'Mode cinématique'], ['chrono', 'Défi chronométré en cours'], ['alarme', 'Alarme donnée'],
 ['cachette', 'Joueur caché'], ['meteoAuto', 'Météo aléatoire — installée'], ['ambianceAuto', 'Ambiance nocturne — installée'],
 ['marcheOuvert', 'Marché ouvert (jour)'], ['feuxCamp', 'Feu de camp allumé'], ['ascenseur', 'Ascenseur en haut'],
 ['eauBasse', 'Niveau d\'eau baissé'], ['torchePortee', 'Torche en main'], ['barriere', 'Barrière magique levée'],
 ['statue', 'Statue tournée'], ['pressionA', 'Dalle A enfoncée'], ['pressionB', 'Dalle B enfoncée'],
 ['sceau1', 'Sceau 1'], ['sceau2', 'Sceau 2'], ['sceau3', 'Sceau 3'], ['cristal', 'Cristal activé'],
 ['poursuite', 'Poursuite en cours'], ['suiveur', 'Quelqu\'un nous suit'], ['monture', 'À cheval'],
 ['festival', 'Fête au village'], ['couvreFeu', 'Couvre-feu'], ['gardeAverti', 'Garde averti'],
 ['recompense', 'Récompense prise'], ['lettreLue', 'Lettre lue'], ['secret', 'Passage secret trouvé'],
 ['orage', 'Orage (ambiance)'], ['piegeArme', 'Piège armé'], ['chemin', 'Chemin dégagé'],
 ['puits', 'Seau remonté'], ['horloge', 'Horloge remontée'], ['miroir', 'Miroir orienté'],
 ['faim', 'Faim — système installé'], ['campement', 'Campement monté'], ['prison', 'En prison']
].forEach(function (x, i) { reserver(SW, NOMS_SW, 901 + i, x[0], x[1]); });
[['destCarte', 'Destination · carte'], ['destX', 'Destination · X'], ['destY', 'Destination · Y'],
 ['tirage', 'Tirage au hasard'], ['reponse', 'Réponse (nombre saisi)'], ['objetChoisi', 'Objet choisi'],
 ['essais', 'Compteur d\'essais'], ['mise', 'Mise'], ['score', 'Score'], ['banque', 'Or à la banque'],
 ['reputation', 'Réputation'], ['sequence', 'Séquence des leviers'], ['code', 'Code saisi'],
 ['pas', 'Pas restants'], ['heure', 'Heure lue'], ['posX', 'Position X du joueur'], ['posY', 'Position Y du joueur'],
 ['region', 'Région sous le joueur'], ['affinite', 'Affinité'], ['minerai', 'Minerai'], ['bois', 'Bois'],
 ['poissons', 'Poissons'], ['plantes', 'Plantes'], ['faim', 'Faim'], ['jours', 'Jours passés'],
 ['dons', 'Dons au temple'], ['vies', 'Vies (défi)'], ['vagues', 'Vague (défense)'], ['temps', 'Temps restant'],
 ['cartesJoueur', 'Cartes · joueur'], ['cartesBanque', 'Cartes · banque'], ['de1', 'Dé 1'], ['de2', 'Dé 2'],
 ['etage', 'Étage'], ['cle', 'Clés trouvées'], ['fragments', 'Fragments'], ['taille', 'Taille de l\'équipe'],
 ['or', 'Or lu'], ['niveau', 'Niveau lu'], ['dir', 'Direction du joueur'], ['evX', 'X de l\'événement'], ['evY', 'Y de l\'événement'],
 ['distance', 'Distance au joueur'], ['pv', 'PV du chef (%)'], ['nuitsDormies', 'Nuits dormies'], ['dette', 'Dette'],
 ['marchandise', 'Marchandise livrée'], ['voix', 'Réplique tirée']
].forEach(function (x, i) { reserver(VAR, NOMS_VAR, 901 + i, x[0], x[1]); });

/* ── conditions (paramètres de la commande 111) ─────────────────────────── */
var OPS = { '=': 0, '>=': 1, '<=': 2, '>': 3, '<': 4, '!=': 5 };
var C = {
    sw: function (id, on) { return [0, id, on === false ? 1 : 0]; },
    vr: function (id, op, val) { return [1, id, 0, val, OPS[op]]; },
    vrVar: function (id, op, id2) { return [1, id, 1, id2, OPS[op]]; },
    ss: function (ch, on) { return [2, ch, on === false ? 1 : 0]; },
    minuterie: function (sec, op) { return [3, op === '<=' ? 1 : 0, sec]; },
    acteur: function (id) { return [4, id, 0]; },
    face: function (dir) { return [6, -1, dir]; },
    or: function (n) { return [7, n, 0]; },
    objet: function (id) { return [8, id]; },
    arme: function (id) { return [9, id, false]; },
    touche: function (k) { return [11, k || 'ok']; },
    js: function (s) { return [12, s]; }
};

/* ── blocs ───────────────────────────────────────────────────────────────── */
function si(cond, alors, sinon) {
    var l = cat([[111, 0, cond]], I(alors || []), [fin()]);
    if (sinon) l = cat(l, [[411, 0, []]], I(sinon), [fin()]);
    return cat(l, [[412, 0, []]]);
}
function choix(labels, branches, opts) {
    opts = opts || {};
    var annul = opts.annuler === undefined ? -1 : opts.annuler;   // -1 interdit · -2 branche · n = choix n
    var l = [[102, 0, [labels, annul === 'branche' ? -2 : annul, opts.defaut || 0, 2, 0]]];
    labels.forEach(function (lab, i) { l = cat(l, [[402, 0, [i, lab]]], I(branches[i] || []), [fin()]); });
    if (annul === 'branche') l = cat(l, [[403, 0, [6, null]]], I(opts.siAnnule || []), [fin()]);
    return cat(l, [[404, 0, []]]);
}
function boucle(corps) { return cat([[112, 0, []]], I(corps), [fin()], [[413, 0, []]]); }
function sortirBoucle() { return [[113, 0, []]]; }
function combat(troupe, o) {
    o = o || {};
    var fuir = !!o.fuite, perdre = !!o.defaite;
    var l = [[301, 0, [0, troupe, fuir, perdre]]];
    if (fuir || perdre) {
        l = cat(l, [[601, 0, []]], I(o.victoire || []), [fin()]);
        if (fuir) l = cat(l, [[602, 0, []]], I(o.fuite === true ? [] : o.fuite), [fin()]);
        if (perdre) l = cat(l, [[603, 0, []]], I(o.defaite === true ? [] : o.defaite), [fin()]);
        l = cat(l, [[604, 0, []]]);
    }
    return l;
}
function boutique(marchandises, achatSeul) {
    var l = [];
    marchandises.forEach(function (m, i) {
        var type = m[0] === 'objet' ? 0 : m[0] === 'arme' ? 1 : 2;
        l.push(i === 0 ? [302, 0, [type, m[1], 0, 0, !!achatSeul]] : [605, 0, [type, m[1], 0, 0]]);
    });
    return l;
}

/* ── messages ────────────────────────────────────────────────────────────── */
function dire(texte, o) {
    o = o || {};
    var lignes = String(texte).split('\n');
    if (o.nom) lignes[0] = '\\n<' + o.nom + '>' + lignes[0];
    var l = [];
    for (var i = 0; i < lignes.length; i += 4) {
        l.push([101, 0, [o.visage || '', o.idx || 0, o.fond == null ? 0 : o.fond, o.pos == null ? 2 : o.pos]]);
        lignes.slice(i, i + 4).forEach(function (x) { l.push([401, 0, [x]]); });
    }
    return l;
}
function narrer(texte) { return dire(texte, { fond: 1, pos: 1 }); }
function defilant(texte, vitesse) {
    return cat([[105, 0, [vitesse || 2, false]]], String(texte).split('\n').map(function (x) { return [405, 0, [x]]; }));
}
function note(texte) {
    var mots = String(texte).split(' '), l = [], ligne = '';
    mots.forEach(function (m) { if ((ligne + ' ' + m).trim().length > 62 && ligne) { l.push(ligne); ligne = m; } else ligne = (ligne ? ligne + ' ' : '') + m; });
    l.push(ligne);
    return cat([[108, 0, [l[0]]]], l.slice(1).map(function (x) { return [408, 0, [x]]; }));
}

/* ── actions ─────────────────────────────────────────────────────────────── */
var A = {
    sw: function (id, on) { return [[121, 0, [id, id, on === false ? 1 : 0]]]; },
    vr: function (id, val) { return [[122, 0, [id, id, 0, 0, val]]]; },
    vrAjout: function (id, val) { return [[122, 0, [id, id, 1, 0, val]]]; },
    vrRetrait: function (id, val) { return [[122, 0, [id, id, 2, 0, val]]]; },
    vrHasard: function (id, a, b) { return [[122, 0, [id, id, 0, 2, a, b]]]; },
    vrJs: function (id, s) { return [[122, 0, [id, id, 0, 4, s]]]; },
    vrJeu: function (id, type, p1, p2) { return [[122, 0, [id, id, 0, 3, type, p1, p2 || 0]]]; },
    ss: function (ch, on) { return [[123, 0, [ch, on === false ? 1 : 0]]]; },
    minuterie: function (sec) { return [[124, 0, [0, sec]]]; },
    stopMinuterie: function () { return [[124, 0, [1]]]; },
    or: function (n) { return [[125, 0, [n >= 0 ? 0 : 1, 0, Math.abs(n)]]]; },
    objet: function (id, n) { return [[126, 0, [id, n >= 0 ? 0 : 1, 0, Math.abs(n)]]]; },
    arme: function (id, n) { return [[127, 0, [id, n >= 0 ? 0 : 1, 0, Math.abs(n), false]]]; },
    armure: function (id, n) { return [[128, 0, [id, n >= 0 ? 0 : 1, 0, Math.abs(n), false]]]; },
    equipe: function (id, entre) { return [[129, 0, [id, entre === false ? 1 : 0, false]]]; },
    sauvegardeAcces: function (on) { return [[134, 0, [on ? 1 : 0]]]; },
    menuAcces: function (on) { return [[135, 0, [on ? 1 : 0]]]; },
    rencontres: function (on) { return [[136, 0, [on ? 1 : 0]]]; },
    formationAcces: function (on) { return [[137, 0, [on ? 1 : 0]]]; },
    transfert: function (carte, x, y, dir, fondu) { return [[201, 0, [0, carte, x, y, dir || 0, fondu == null ? 0 : fondu]]]; },
    transfertVar: function (fondu) { return [[201, 0, [1, VAR.destCarte, VAR.destX, VAR.destY, 0, fondu == null ? 0 : fondu]]]; },
    placer: function (ev, x, y, dir) { return [[203, 0, [ev, 0, x, y, dir || 0]]]; },
    placerJoueurIci: function () { return [[203, 0, [0, 2, -1, 0, 0]]]; },
    defiler: function (dir, dist, vit) { return [[204, 0, [dir, dist, vit || 4]]]; },
    transparent: function (on) { return [[211, 0, [on ? 0 : 1]]]; },
    anim: function (qui, id, att) { return [[212, 0, [qui, id, !!att]]]; },
    bulle: function (qui, id, att) { return [[213, 0, [qui, id, att !== false]]]; },
    effacer: function () { return [[214, 0, []]]; },
    suiveurs: function (on) { return [[216, 0, [on ? 0 : 1]]]; },
    rassembler: function () { return [[217, 0, []]]; },
    fonduNoir: function () { return [[221, 0, []]]; },
    fonduRetour: function () { return [[222, 0, []]]; },
    teinte: function (ton, duree, att) { return [[223, 0, [ton, duree || 60, att !== false]]]; },
    flash: function (coul, duree, att) { return [[224, 0, [coul, duree || 8, !!att]]]; },
    trembler: function (force, vit, duree, att) { return [[225, 0, [force || 5, vit || 5, duree || 30, !!att]]]; },
    attendre: function (n) { return [[230, 0, [n]]]; },
    image: function (id, nom, x, y, op, o) {
        o = o || {};
        return [[231, 0, [id, nom, o.centre ? 1 : 0, 0, x || 0, y || 0, o.zoom || 100, o.zoom || 100, op == null ? 255 : op, o.melange || 0]]];
    },
    bougerImage: function (id, x, y, op, duree, att, o) {
        o = o || {};
        return [[232, 0, [id, 0, o.centre ? 1 : 0, 0, x || 0, y || 0, o.zoom || 100, o.zoom || 100, op == null ? 255 : op, 0, duree || 60, att !== false]]];
    },
    tournerImage: function (id, vit) { return [[233, 0, [id, vit]]]; },
    teinteImage: function (id, ton, duree) { return [[234, 0, [id, ton, duree || 60, false]]]; },
    effacerImage: function (id) { return [[235, 0, [id]]]; },
    meteoMV: function (type, force, duree) { return [[236, 0, [type, force == null ? 5 : force, duree || 60, false]]]; },
    bgm: function (nom, vol, pitch) { return [[241, 0, [audio(nom, vol, pitch)]]]; },
    fonduBgm: function (sec) { return [[242, 0, [sec || 2]]]; },
    garderBgm: function () { return [[243, 0, []]]; },
    reprendreBgm: function () { return [[244, 0, []]]; },
    bgs: function (nom, vol, pitch) { return [[245, 0, [audio(nom, vol, pitch)]]]; },
    fonduBgs: function (sec) { return [[246, 0, [sec || 2]]]; },
    me: function (nom, vol) { return [[249, 0, [audio(nom, vol)]]]; },
    se: function (nom, vol, pitch) { return [[250, 0, [audio(nom, vol, pitch)]]]; },
    stopSe: function () { return [[251, 0, []]]; },
    nomCarte: function (on) { return [[281, 0, [on ? 0 : 1]]]; },
    lieu: function (varId, type, x, y) { return [[285, 0, [varId, type, 0, x, y]]]; },
    nombre: function (varId, chiffres) { return [[103, 0, [varId, chiffres || 1]]]; },
    choisirObjet: function (varId, type) { return [[104, 0, [varId, type || 1]]]; },
    nomSaisie: function (acteur, max) { return [[303, 0, [acteur, max || 8]]]; },
    pv: function (n, mortPossible, acteur) { return [[311, 0, [0, acteur || 0, n >= 0 ? 0 : 1, 0, Math.abs(n), !!mortPossible]]]; },
    pm: function (n, acteur) { return [[312, 0, [0, acteur || 0, n >= 0 ? 0 : 1, 0, Math.abs(n)]]]; },
    etat: function (id, ajoute, acteur) { return [[313, 0, [0, acteur || 0, ajoute === false ? 1 : 0, id]]]; },
    soigner: function (acteur) { return [[314, 0, [0, acteur || 0]]]; },
    xp: function (n, acteur) { return [[315, 0, [0, acteur || 0, n >= 0 ? 0 : 1, 0, Math.abs(n), true]]]; },
    niveau: function (n, acteur) { return [[316, 0, [0, acteur || 0, n >= 0 ? 0 : 1, 0, Math.abs(n), true]]]; },
    stat: function (param, n, acteur) { return [[317, 0, [0, acteur || 0, param, n >= 0 ? 0 : 1, 0, Math.abs(n)]]]; },
    apprendre: function (acteur, comp) { return [[318, 0, [0, acteur, 0, comp]]]; },
    nomActeur: function (id, nom) { return [[320, 0, [id, nom]]]; },
    surnom: function (id, nom) { return [[324, 0, [id, nom]]]; },
    menu: function () { return [[351, 0, []]]; },
    sauver: function () { return [[352, 0, []]]; },
    gameOver: function () { return [[353, 0, []]]; },
    titre: function () { return [[354, 0, []]]; },
    ec: function (id) { return [[117, 0, [id]]]; },
    etiquette: function (n) { return [[118, 0, [n]]]; },
    sauter: function (n) { return [[119, 0, [n]]]; },
    stop: function () { return [[115, 0, []]]; },
    plugin: function (t) { return [[356, 0, [t]]]; },
    js: function (s) {
        var l = String(s).split('\n');
        return cat([[355, 0, [l[0]]]], l.slice(1).map(function (x) { return [655, 0, [x]]; }));
    }
};

/* ── déplacements (« Définir un déplacement ») ──────────────────────────── */
var M = {
    bas: [1], gauche: [2], droite: [3], haut: [4], hasard: [9], versJoueur: [10], fuirJoueur: [11],
    avant: [12], arriere: [13], tBas: [16], tGauche: [17], tDroite: [18], tHaut: [19], tDemi: [22],
    tVersJoueur: [25], tDos: [26], traverserOn: [37], traverserOff: [38], fixeOn: [35], fixeOff: [36],
    marcheOn: [31], marcheOff: [32], pasOn: [33], pasOff: [34], transparentOn: [39], transparentOff: [40],
    saut: function (x, y) { return [14, [x, y]]; }, att: function (n) { return [15, [n]]; },
    image: function (nom, idx) { return [41, [nom, idx || 0]]; }, opacite: function (v) { return [42, [v]]; },
    vitesse: function (v) { return [29, [v]]; }, freq: function (v) { return [30, [v]]; },
    son: function (nom, vol) { return [44, [audio(nom, vol)]]; }, js: function (s) { return [45, [s]]; },
    swOn: function (id) { return [27, [id]]; }, swOff: function (id) { return [28, [id]]; }
};
function route(qui, pas, o) {
    o = o || {};
    var liste = pas.map(function (p) { return { code: p[0], indent: null, parameters: p[1] || [] }; });
    liste.push({ code: 0, parameters: [] });
    var l = [[205, 0, [qui, { list: liste, repeat: !!o.repeter, skippable: o.passer !== false, wait: o.attendre !== false }]]];
    pas.forEach(function (p) { l.push([505, 0, [{ code: p[0], indent: null, parameters: p[1] || [] }]]); });
    return l;
}
var CE_EV = 0, JOUEUR = -1;
// portes et coffres RTP : les directions de la feuille font les images d'ouverture
var OUVRIR = [M.fixeOff, M.tGauche, M.att(3), M.tDroite, M.att(3), M.tHaut, M.traverserOn];
var FERMER = [M.traverserOff, M.tDroite, M.att(3), M.tGauche, M.att(3), M.tBas];

module.exports = { I: I, cat: cat, seq: seq, SW: SW, VAR: VAR, NOMS_SW: NOMS_SW, NOMS_VAR: NOMS_VAR, C: C, A: A, M: M,
    si: si, choix: choix, boucle: boucle, sortirBoucle: sortirBoucle, combat: combat, boutique: boutique,
    dire: dire, narrer: narrer, defilant: defilant, note: note, route: route, CE_EV: CE_EV, JOUEUR: JOUEUR,
    OUVRIR: OUVRIR, FERMER: FERMER, audio: audio };
