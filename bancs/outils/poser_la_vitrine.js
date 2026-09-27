/*
 * LA VITRINE — toutes les recettes, posées en VRAIS événements sur une carte
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-09-27 : « une gigantesque map où il y a tous les événements
 * communs, mais placés sur la map, pour que je puisse juste prendre et les
 * poser […] pas simplifié, mais que je peux modifier rapidement […] juste un
 * event comme ça, je copie, je copie, je copie. »
 *
 * Chaque recette de bancs/outils/recettes/r*.js devient un événement de carte
 * COMPLET, qui se suffit à lui-même une fois copié :
 *   · ses commandes sont DANS l'événement (pas un appel d'événement commun) ;
 *   · il a son image (porte, coffre, flamme, PNJ, animal, meuble…) prise
 *     dans les sprites et le tileset du projet ;
 *   · son déclencheur (Action, Contact, Processus parallèle…) et sa priorité ;
 *   · sa page 2 quand la recette allume l'interrupteur local A (coffre
 *     ouvert, porte ouverte, torche allumée…), ou quand la recette le dit
 *     (lampe de rue : page 2 sur « Lampes allumées ») ;
 *   · une porte mène à un « Transférer le joueur » direct (double-clic,
 *     on choisit la case), au lieu des trois variables de l'événement commun.
 *
 * Carte 70, « ✎ ATELIER · Recettes à copier » : un thème par bande, un
 * panneau au début de chaque bande, un tapis bleu sous chaque événement.
 * Les démarrages automatiques n'y tournent que si l'on allume le levier de
 * l'entrée (interrupteur ✎ 950) — sur ta carte, décoche cette condition.
 *
 *   node bancs/outils/poser_la_vitrine.js           → contrôle
 *   node bancs/outils/poser_la_vitrine.js --ecrire  → écrit la carte 70
 * Le banc bancs/navigateur/la_vitrine.js exécute chaque événement de la carte.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var DATA = path.join(RACINE, 'data');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var D = require('./recettes/dsl.js');
var CARTE = 70, NOM_CARTE = '✎ ATELIER · Recettes à copier';
var COLONNES = 30;
var ARRIVEE = { x: 1, y: 2 };          // là où mènent les portes de la vitrine

var themes = [];
fs.readdirSync(path.join(__dirname, 'recettes')).filter(function (f) { return /^r\d.*\.js$/.test(f); }).sort().forEach(function (f) {
    themes = themes.concat(require('./recettes/' + f));
});

/* ── les images ───────────────────────────────────────────────────────── */
function ch(nom, idx, dir) { return { characterName: nom, characterIndex: idx || 0, direction: dir || 2, pattern: 1, tileId: 0 }; }
function tuile(id) { return { characterName: '', characterIndex: 0, direction: 2, pattern: 0, tileId: id }; }
function B(n) { return tuile(n); }
function Cc(n) { return tuile(256 + n); }
var RIEN = { characterName: '', characterIndex: 0, direction: 2, pattern: 0, tileId: 0 };
var FICHE = B(162);                      // la feuille épinglée : une recette « outil »
var GENS = ['People1', 'People2', 'People3', 'People4'];
function pnj(nom) {
    var h = 0; for (var i = 0; i < nom.length; i++) h = (h * 31 + nom.charCodeAt(i)) >>> 0;
    return ch(GENS[h % 4], (h >> 3) % 8);
}
var GARDE = ch('People4', 5), MECHANT = ch('Evil', 0), CHIEN = ch('Nature', 0), CHAT = ch('Nature', 1), POULE = ch('Nature', 2), CHEVAL = ch('Nature', 3);
var PORTE = ch('!Door1', 0), GRILLE = ch('!Door1', 7), CERCLE = ch('!Door2', 4), CRISTAL = ch('!Crystal', 0), COFFRE = ch('!Chest', 0);
var FLAMME = ch('!Flame', 0), BOUGIE = ch('!Flame', 1), FEU = ch('!Flame', 4), FEU_BLEU = ch('!Flame', 5), ECLAT = ch('!Flame', 6);
var LEVIER = ch('!Switch1', 0), DALLE = ch('!Switch1', 4), BOUTON = ch('!Switch2', 0), ROCHER = ch('!Other1', 0), PIQUES = ch('!Other1', 4), SOCLE = ch('!Other1', 6);
var MOUTON = ch('$Animal04_PixelScaled', 0), VACHE = ch('$Animal06_PixelScaled', 0), COQ = ch('$Bird01_PixelScaled', 0);
var MONSTRES = [ch('Monster', 0), ch('Monster', 1), ch('Monster', 2), ch('Monster', 3), ch('Monster', 4), ch('Monster', 5)];

/* Pour chaque thème : [motif du nom, image] dans l'ordre ; le premier qui va
 * gagne. « PNJ » = un habitant tiré de People1-4 ; « SOL » = rien (l'événement
 * est au sol, invisible en jeu, comme on le pose vraiment). */
var PNJ = 'PNJ', SOL = 'SOL';
var REGLES = [
    [/^Portes/, [[/Grande porte/, ch('!BigDoor1', 0)], [/prison/i, GRILLE], [/téléporteur|Portail qui/, CERCLE], [/Échelle/, B(13)],
        [/Escalier|Trappe|se referme/, SOL], [/Toquer/, PORTE], [/secrète/, B(70)], [/ronces/, Cc(86)], [/garde/i, GARDE], [/./, PORTE]]],
    [/^Coffres/, [[/Tonneau/, B(209)], [/Caisse/, B(224)], [/^Pot/, B(200)], [/Étagère/, B(70)], [/Armoire/, B(58)], [/Tiroir/, B(56)],
        [/Coffre-fort/, ch('!Chest', 1)], [/rare|après le boss/, ch('!Chest', 2)], [/Sac/, Cc(97)], [/brillant/, ECLAT], [/Objet posé/, Cc(99)],
        [/stockage/, ch('!Chest', 6)], [/./, COFFRE]]],
    [/^Lumières/, [[/Lampes — installer|système qui suit|Toutes les lampes|Grotte|Sortie de la grotte|Prendre une torche|Éclair|Lucioles/, FICHE],
        [/Lampe de rue|Torche murale — l'allumer|allumer ou éteindre/, RIEN], [/Torche murale — l'éteindre/, FLAMME], [/Brasier|Feu de camp/, FEU],
        [/Bougie|Lampe à huile/, BOUGIE], [/Lanterne|Phare/, ECLAT], [/Cristal/, CRISTAL], [/./, FLAMME]]],
    [/^L'heure/, [[/Dormir|sieste|réveiller/, B(88)], [/Horloge|Cadran/, B(168)], [/Calendrier/, Cc(76)], [/PNJ/, PNJ], [/Couvre-feu/, GARDE], [/./, FICHE]]],
    [/^Météo/, [[/./, FICHE]]],
    [/^PNJ/, [[/./, PNJ]]],
    [/^Boutiques/, [[/Sauvegarde — cristal/, CRISTAL], [/lit \+ soin/, B(88)], [/Feu d'Âme/, FEU_BLEU], [/Source/, B(216)], [/Statue/, Cc(177)],
        [/Descendre de cheval/, FICHE], [/Écurie/, CHEVAL], [/Banque — les intérêts/, FICHE], [/./, PNJ]]],
    [/^Voyages/, [[/^Transfert|Bord de la carte|Chute|Glisser|Tapis|Tremplin|Nager|Tourbillon|Sauter/, SOL], [/Cristal|Point de passage/, CRISTAL],
        [/Portail/, CERCLE], [/Bateau/, ch('Vehicle', 0)], [/Grimper/, Cc(122)], [/Ascenseur/, BOUTON], [/Entrée de donjon/, ch('!BigDoor1', 0)], [/./, FICHE]]],
    [/^Énigmes/, [[/Levier|Leviers/, LEVIER], [/Dalle|dalles|Plaques/, DALLE], [/Rocher/, ROCHER], [/Statue/, Cc(177)], [/Miroir/, B(169)],
        [/Cloche/, BOUTON], [/Orgue/, B(126)], [/Pont|Niveau d'eau|Horloge/, ch('!Switch1', 1)], [/Puits/, B(216)], [/Sceau/, SOCLE],
        [/Barrière/, ch('!Door2', 5)], [/Fragment/, Cc(58)], [/Interrupteur caché|Bibliothèque/, B(70)], [/balance/, Cc(111)],
        [/Symboles|Mémoire/, B(170)], [/Serrure/, PORTE], [/Couloir|Toutes les plaques/, SOL], [/Énigme/, ch('Evil', 3)], [/./, FICHE]]],
    [/^Pièges/, [[/Piques/, PIQUES], [/Trappe|Sol qui|Glace/, SOL], [/Rocher/, ROCHER], [/statue/i, Cc(177)], [/Fleur/, Cc(84)], [/Alarme/, BOUTON],
        [/Mimique/, ECLAT], [/Piège désamorcé/, PIQUES], [/Explosion|Plafond/, FICHE], [/./, SOL]]],
    [/^Récolte/, [[/Plante|Buisson|Champignon/, Cc(86)], [/Arbre/, ch('$Tree_XP_01', 0)], [/Filon — minerai rare/, B(215)], [/Filon/, B(207)],
        [/Pêche/, Cc(122)], [/Puits/, B(216)], [/Vache/, VACHE], [/Poule/, POULE], [/Artisanat — forger/, B(133)], [/Cuisine|Artisanat/, B(132)],
        [/Alambic/, Cc(101)], [/ordures/, B(210)], [/Ruche/, B(242)], [/Graine/, Cc(120)], [/stockage/, ch('!Chest', 6)], [/fragment/, Cc(58)],
        [/animal/, CHIEN], [/Vendre/, PNJ], [/./, FICHE]]],
    [/^Combats/, [[/Boss|Boss rush/, MECHANT], [/Gardien|Duel/, GARDE], [/PNJ qui se rend/, ch('Evil', 1)], [/Ennemi|Embuscade|Monstre|Arène|Défense|entraînement|Theatrhythm/, 'MONSTRE'],
        [/./, FICHE]]],
    [/^Quêtes/, [[/Tableau/, B(164)], [/Journal|suivre à l'écran|Réputation/, FICHE], [/Escorte/, pnj('escorte')], [/minutée — échec|exploration|chasse/, FICHE], [/./, PNJ]]],
    [/^Cinématiques/, [[/personnage/i, PNJ], [/./, FICHE]]],
    [/^Images/, [[/./, FICHE]]],
    [/^Musique/, [[/Boîte à musique/, Cc(118)], [/./, FICHE]]],
    [/^Jeux/, [[/Machine à sous/, Cc(222)], [/Course — arrivée/, SOL], [/Cache-cache/, pnj('enfant')], [/Tableau|Remettre/, FICHE], [/./, PNJ]]],
    [/^Équipe/, [[/./, FICHE]]],
    [/^Objets/, [[/PNJ/, PNJ], [/./, FICHE]]],
    [/^Défis/, [[/Collecte chronométrée/, ECLAT], [/Donjon — étage/, SOL], [/./, FICHE]]],
    [/^Discrétion/, [[/buisson/, Cc(86)], [/Garde|garde/, GARDE], [/prison/, GRILLE], [/Pickpocket/, PNJ], [/Chiens/, CHIEN], [/./, FICHE]]],
    [/^Animaux/, [[/Chat/, CHAT], [/Chien|Loup|errant|apprivoisé/, CHIEN], [/Poule|Oiseaux|Corbeau/, POULE], [/Vache/, VACHE], [/Mouton/, MOUTON], [/Cheval/, CHEVAL],
        [/Grenouille/, ch('Monster', 1)], [/./, CHIEN]]],
    [/^La vie du village/, [[/Puits/, B(216)], [/Panneau|Affiche/, B(162)], [/Tableau|Journal/, B(164)], [/Porte/, PORTE], [/Lit/, B(88)],
        [/Cheminée/, B(137)], [/Cuisine/, B(132)], [/autel/, Cc(193)], [/tombe/, Cc(216)], [/collecte/, Cc(97)], [/Marchand|PNJ/, PNJ],
        [/Marché/, SOL], [/./, FICHE]]],
    [/^Les systèmes/, [[/Feu d'Âme|Renaître/, FEU_BLEU], [/Forge/, B(133)], [/Marchand/, PNJ], [/./, FICHE]]],
    [/^Menus/, [[/./, FICHE]]],
    [/^Décor/, [[/Piano/, B(110)], [/Miroir/, B(169)], [/Tableau/, B(172)], [/Fenêtre/, B(16)], [/Chaise/, B(104)], [/Lit/, B(88)], [/Baignoire|Fontaine/, B(216)],
        [/Cuisinière/, B(132)], [/Vase/, B(200)], [/Horloge/, B(168)], [/Tapis/, SOL], [/Lustre/, Cc(122)], [/Rideaux/, B(152)], [/Bureau/, Cc(74)],
        [/jouets/, ch('!Chest', 6)], [/Bougeoir/, BOUGIE], [/Placard/, B(58)], [/Carte murale/, B(164)], [/farine/, B(248)], [/bière/, B(209)],
        [/Statue/, Cc(177)], [/Machine/, ch('!Switch2', 1)], [/Cadre/, B(180)], [/./, FICHE]]],
    [/^Donjons/, [[/Petite clé/, ECLAT], [/Porte du boss/, ch('!BigDoor1', 0)], [/Porte/, PORTE], [/Grille/, GRILLE], [/Salle close|Éboulement|sens unique|Plateforme/, SOL],
        [/Coffre/, COFFRE], [/Carte du donjon/, Cc(76)], [/Torche de la salle/, RIEN], [/Interrupteur de couleur/, BOUTON], [/Bloc rouge/, ch('!Door2', 0)],
        [/Repos/, FEU_BLEU], [/Pierre de retour/, CRISTAL], [/Levier|Raccourci/, LEVIER], [/Récompense/, ch('!Chest', 2)], [/Autel/, Cc(193)],
        [/Mur fragile/, B(239)], [/./, FICHE]]],
    [/^Horreur/, [[/miroir/, ch('Evil', 6)], [/Poupée/, Cc(116)], [/ombre/, ch('Evil', 7)], [/Statue/, Cc(177)], [/Boîte à musique/, Cc(118)], [/Couloir/, SOL], [/./, FICHE]]],
    [/^Véhicules/, [[/Barque|Radeau/, ch('Vehicle', 0)], [/Navire/, ch('Vehicle', 1)], [/Dirigeable/, ch('Vehicle', 2)], [/Chariot|Diligence/, ch('Vehicle', 5)],
        [/Téléphérique|Ascenseur/, BOUTON], [/Pont-levis/, ch('!Switch1', 1)], [/Monture/, CHEVAL], [/Passeur|Quai/, PNJ], [/./, FICHE]]],
    [/^Dialogues/, [[/./, PNJ]]],
    [/^Pouvoirs/, [[/rocher|Déplacer/, ROCHER], [/torche/, RIEN], [/pensées/, PNJ], [/./, FICHE]]],
    [/^Tutoriels/, [[/Première entrée/, SOL], [/./, FICHE]]],
    [/^Ferme/, [[/Plante|Serre/, Cc(86)], [/poules/, POULE], [/mouton/, MOUTON], [/coq/, COQ], [/Chien/, CHIEN], [/Boîte aux lettres/, Cc(81)], [/Laver/, B(216)],
        [/Moulin|Grenier/, B(242)], [/Four/, B(133)], [/Clôture/, B(224)], [/bilan/, FICHE], [/./, PNJ]]],
    [/^Événements de carte/, [[/Zone|Déclencheur invisible|Sortie bloquée|Porte automatique|Dalle/, SOL], [/levier/, LEVIER], [/Suit le joueur|Patrouille/, PNJ],
        [/Revient chaque jour|une fois par partie/i, ECLAT], [/./, FICHE]]],
    [/^Argent/, [[/Pickpocket|Péage|Enchères|Pourboire|Prix|Banque|Salaire/, PNJ], [/Coffre de la guilde/, ch('!Chest', 1)], [/maison/, PORTE], [/./, FICHE]]],
    [/^Utilitaires/, [[/./, FICHE]]]
];
function imageDe(theme, r, n) {
    var regles = null;
    REGLES.forEach(function (x) { if (!regles && x[0].test(theme)) regles = x[1]; });
    var img = FICHE;
    if (regles) for (var i = 0; i < regles.length; i++) if (regles[i][0].test(r.nom)) { img = regles[i][1]; break; }
    if (r.vitrine && r.vitrine.image) img = r.vitrine.image;          // une recette peut dire son image
    if (img === PNJ) return pnj(r.nom);
    if (img === 'MONSTRE') return MONSTRES[n % MONSTRES.length];
    if (img === SOL) return RIEN;
    return JSON.parse(JSON.stringify(img));
}
function estPersonnage(img) { return img.characterName && !/^!/.test(img.characterName) && !/^\$Tree/.test(img.characterName); }

/* ── les commandes : l'événement commun, rendu autonome ───────────────── */
function versListe(cmds) { return cmds.map(function (c) { return { code: c[0], indent: c[1], parameters: JSON.parse(JSON.stringify(c[2])) }; }); }
function note(liste, indent, texte) { D.note(texte).forEach(function (c) { liste.push({ code: c[0], indent: indent, parameters: c[2] }); }); }
/* dest() + transfertVar() → un seul « Transférer le joueur », direct */
function transfertDirect(l) {
    var groupes = [], vars = [];
    l.forEach(function (c, i) {
        if (c.code === 108 && /^↓ DESTINATION/.test(c.parameters[0]) && l[i + 3] &&
            [1, 2, 3].every(function (k) { var v = l[i + k]; return v.code === 122 && v.parameters[3] === 0 && v.parameters[0] === [0, D.VAR.destCarte, D.VAR.destX, D.VAR.destY][k]; })) groupes.push(i);
        if (c.code === 201 && c.parameters[0] === 1) vars.push(i);
    });
    if (groupes.length !== 1 || vars.length !== 1) return l;
    var t = l[vars[0]];
    var direct = { code: 201, indent: t.indent, parameters: [0, CARTE, ARRIVEE.x, ARRIVEE.y, t.parameters[4], t.parameters[5]] };
    var avant = [];
    note(avant, t.indent, '↓ DESTINATION : double-clique « Transférer le joueur » et choisis la carte et la case.');
    var out = [];
    l.forEach(function (c, i) {
        if (i >= groupes[0] && i <= groupes[0] + 3) return;
        if (i === vars[0]) { out = out.concat(avant); out.push(direct); return; }
        out.push(c);
    });
    return out;
}
/* un transfert « exemple » vers la carte 1 (6, 8) mène à l'entrée de la vitrine */
function transfertsExemple(l) {
    var out = [];
    l.forEach(function (c) {
        var p = c.parameters;
        if (c.code === 201 && p[0] === 0 && p[1] === 1 && p[2] === 6 && p[3] === 8) {
            note(out, c.indent, '↓ DESTINATION : double-clique « Transférer le joueur » et choisis la carte et la case.');
            out.push({ code: 201, indent: c.indent, parameters: [0, CARTE, ARRIVEE.x, ARRIVEE.y, p[4], p[5]] });
        } else out.push(c);
    });
    return out;
}
function utilise(l, code, test) { return l.some(function (c) { return c.code === code && (!test || test(c.parameters)); }); }

/* ── les pages ────────────────────────────────────────────────────────── */
function conditions() {
    return { actorId: 1, actorValid: false, itemId: 1, itemValid: false, selfSwitchCh: 'A', selfSwitchValid: false,
        switch1Id: 1, switch1Valid: false, switch2Id: 1, switch2Valid: false, variableId: 1, variableValid: false, variableValue: 0 };
}
function page(img, trigger, liste, o) {
    o = o || {};
    var perso = estPersonnage(img), sol = !img.characterName && !img.tileId;
    var anime = /^!(Flame|Door2|Crystal)$/.test(img.characterName);
    var p = {
        conditions: conditions(), directionFix: !perso, image: img, list: liste.concat([{ code: 0, indent: 0, parameters: [] }]),
        moveFrequency: 3, moveRoute: { list: [{ code: 0, parameters: [] }], repeat: true, skippable: false, wait: false },
        moveSpeed: 3, moveType: 0, priorityType: (sol || img === DALLE || /^!Other1$/.test(img.characterName) && img.characterIndex === 4) && trigger !== 0 ? 0 : 1,
        stepAnime: anime, through: false, trigger: trigger, walkAnime: true
    };
    Object.keys(o).forEach(function (k) { if (k !== 'cond') p[k] = o[k]; });
    if (o.cond) Object.keys(o.cond).forEach(function (k) { p.conditions[k] = o.cond[k]; });
    return p;
}

/* ── une recette → un (ou deux) événements ────────────────────────────── */
var PAR = /processus parallèle|Processus parallèle/;
function declencheur(r) {
    var t = r.nom + ' | ' + (r.aide || '');
    if (r.vitrine && r.vitrine.trigger != null) return r.vitrine.trigger;
    if (r.declencheur) return { 1: 3, 2: 4 }[r.declencheur.type];      // événement commun → événement de carte
    if (/Démarrage automatique/.test(t)) return 3;
    if (PAR.test(t) && !/d'échec|\+ processus/.test(t)) return 4;
    if (/au contact/.test(r.nom)) return 2;
    if (/Contact/.test(r.aide || '')) return 1;
    return 0;
}
var avertis = [];
function evenements(theme, r, n) {
    var img = imageDe(theme, r, n);
    var trig = declencheur(r);
    if (/^Voyages/.test(theme) && /^Transfert/.test(r.nom)) trig = 1;
    var l = transfertsExemple(transfertDirect(versListe(r.cmds)));
    var tete = [];
    note(tete, 0, '══ ' + theme.toUpperCase() + ' · ' + r.nom + ' ══');
    if (r.aide) note(tete, 0, r.aide);
    var cond = {};
    if (r.declencheur) cond = { switch1Valid: true, switch1Id: r.declencheur.sw };
    if (/Quête minutée — échec/.test(r.nom)) cond = { switch1Valid: true, switch1Id: D.SW.chrono };
    if (trig === 3 && !r.declencheur) {
        cond = { switch1Valid: true, switch1Id: D.SW.vitrine };
        note(tete, 0, 'SUR TA CARTE : décoche la condition « ✎ Vitrine » de cette page. Ici, elle empêche le démarrage automatique de bloquer la vitrine.');
    }
    if (/VieDuVillage/.test(r.nom)) tete.push({ code: 108, indent: 0, parameters: ['<NPC: forgeron>'] });
    var nom = r.nom;
    if (/^Plaques/.test(r.nom)) nom = 'plaque — ' + r.nom;          // « Toutes les plaques allumées ? » les compte par leur nom
    var p1 = page(img, trig, tete.concat(l), { cond: cond });
    var pages = [p1];

    // la page 2 : l'interrupteur local A, allumé par la recette et jamais relu par elle
    var allumeA = utilise(l, 123, function (p) { return p[0] === 'A' && p[1] === 0; });
    var eteintA = utilise(l, 123, function (p) { return p[0] === 'A' && p[1] === 1; });
    var litA = utilise(l, 111, function (p) { return p[0] === 2 && p[1] === 'A'; });
    var efface = utilise(l, 214) || JSON.stringify(l).indexOf('"code":42,"indent":null,"parameters":[0]') >= 0;
    var ouvre = JSON.stringify(l).indexOf('"code":19,') >= 0 && JSON.stringify(l).indexOf('"code":37,') >= 0;
    if (/ramasser/i.test(r.nom)) efface = true;                       // ramassé : il n'est plus là
    var allume = JSON.stringify(l).indexOf('"code":41,"indent":null,"parameters":["!Flame"') >= 0;
    if (allume && allumeA && !eteintA) litA = false;                  // une torche allumée reste allumée (page 2)
    if (/Piques qui sortent/.test(r.nom)) {
        var p2l = []; note(p2l, 0, 'Page 2 : les piques sont sorties (interrupteur local A). Elles rentrent au bout d\'une seconde.');
        p2l.push({ code: 230, indent: 0, parameters: [60] }, { code: 123, indent: 0, parameters: ['A', 1] });
        pages.push(page(ch('!Other1', 4, 8), 4, p2l, { cond: { selfSwitchValid: true, selfSwitchCh: 'A' }, priorityType: 0 }));
    } else if (/^Lampe de rue/.test(r.nom)) {
        var lr = []; note(lr, 0, 'Page 2 : la lampe allumée, tant que « ✎ Lampes allumées » est ON (le système de l\'heure le fait).');
        pages.push(page(FLAMME, 0, lr, { cond: { switch1Valid: true, switch1Id: D.SW.lampes } }));
    } else if (allumeA && !eteintA && !litA) {
        var i2 = efface ? RIEN : JSON.parse(JSON.stringify(img)), o2 = {};
        if (efface) o2.through = true;
        else if (ouvre) { i2.direction = 8; if (!/^!Chest/.test(img.characterName)) o2.through = true; }
        if (allume) { i2 = JSON.parse(JSON.stringify(FLAMME)); }
        if (trig === 3) i2 = JSON.parse(JSON.stringify(RIEN));           // la scène est jouée : plus rien
        if (/^Plaques/.test(r.nom)) i2.direction = 8;
        var l2 = []; note(l2, 0, 'Page 2 : c\'est fait (interrupteur local A allumé par la page 1). Rien à refaire.');
        if (/^Portes/.test(theme) && !efface && !ouvre) {           // la porte est gagnée : elle devient une porte simple
            note(l2, 0, 'La porte s\'ouvre maintenant sans condition.');
            l2 = l2.concat(transfertDirect(versListe(D.cat(D.note('↓ DESTINATION : change ces trois nombres (carte, X, Y).'), D.A.vr(D.VAR.destCarte, 1), D.A.vr(D.VAR.destX, 6), D.A.vr(D.VAR.destY, 8),
                D.A.se('Door1'), D.route(D.CE_EV, D.OUVRIR), D.A.transfertVar(0), D.route(D.CE_EV, D.FERMER, { attendre: false })))));
        }
        o2.cond = { selfSwitchValid: true, selfSwitchCh: 'A' };
        pages.push(page(i2, 0, l2, o2));
        if (/^!Flame/.test(i2.characterName)) pages[1].stepAnime = true;
    }
    var evs = [{ name: nom, note: '', pages: pages }];
    if (/^Porte double/.test(r.nom)) {
        var b = []; note(b, 0, 'Le 2e battant de la porte double : il doit avoir le numéro de l\'événement précédent + 1. Il ne fait rien lui-même.');
        evs.push({ name: 'Porte double — 2e battant', note: '', pages: [page(JSON.parse(JSON.stringify(PORTE)), 0, b, {})] });
    }
    return evs;
}

/* ── la carte ─────────────────────────────────────────────────────────── */
function sol(kind) { return 2816 + kind * 48; }
var PLANCHER = sol(8), BANDES = [sol(9), sol(1)], TAPIS = sol(18), TAPIS_PANNEAU = sol(26);
var W = 3 + COLONNES * 2;
var evs = [null], cases = [], y = 1, total = 0, parTheme = [];
function poser(e, x, yy, tapis) { e.id = evs.length; e.x = x; e.y = yy; evs.push(e); cases.push([x, yy, tapis]); }

// l'entrée : le mode d'emploi et le levier des démarrages automatiques
var mode = [];
note(mode, 0, 'Mode d\'emploi de la vitrine.');
D.narrer('VITRINE DES RECETTES\nChaque événement de cette carte est complet : image, déclencheur,\npages, commandes. Clic droit → Copier, puis Coller sur ta carte.').forEach(function (c) { mode.push({ code: c[0], indent: 0, parameters: c[2] }); });
D.narrer('Les portes mènent ici même : double-clique « Transférer le joueur »\npour choisir la vraie destination. Les interrupteurs et variables\n« ✎ » (901 et suivants) sont partagés : renomme-les si tu veux.').forEach(function (c) { mode.push({ code: c[0], indent: 0, parameters: c[2] }); });
poser({ name: '▬ MODE D\'EMPLOI ▬', note: '', pages: [page(B(164), 0, mode, {})] }, 1, 1, TAPIS_PANNEAU);
var lev = [];
note(lev, 0, 'Allume / éteint « ✎ Vitrine » : les démarrages automatiques de la vitrine ne tournent que si c\'est allumé.');
lev = lev.concat(versListe(D.si(D.C.sw(D.SW.vitrine), D.cat(D.A.sw(D.SW.vitrine, false), D.A.se('Switch1'), D.dire('Démarrages automatiques de la vitrine : ARRÊTÉS.')),
    D.cat(D.A.sw(D.SW.vitrine, true), D.A.se('Switch1'), D.dire('Démarrages automatiques de la vitrine : EN MARCHE.')))));
poser({ name: '▬ LEVIER · démarrages auto de la vitrine ▬', note: '', pages: [page(LEVIER, 0, lev, {})] }, 3, 1, TAPIS_PANNEAU);
y = 4;

themes.forEach(function (th, t) {
    var y0 = y, n = 0, col = 0, ligne = y;
    var pan = [];
    note(pan, 0, 'Panneau de la bande « ' + th.theme + ' ».');
    D.narrer(th.theme.toUpperCase() + '\n' + th.recettes.length + ' recettes sur cette bande, de gauche à droite.').forEach(function (c) { pan.push({ code: c[0], indent: 0, parameters: c[2] }); });
    poser({ name: '▬ ' + th.theme.toUpperCase() + ' ▬', note: '', pages: [page(B(162), 0, pan, {})] }, 1, y, TAPIS_PANNEAU);
    th.recettes.forEach(function (r) {
        evenements(th.theme, r, n++).forEach(function (e) {
            if (col === COLONNES) { col = 0; ligne += 2; }
            poser(e, 3 + col * 2, ligne, TAPIS);
            col++;
        });
        total++;
    });
    parTheme.push({ theme: th.theme, y0: y0, y1: ligne, bande: BANDES[t % 2] });
    y = ligne + 3;
});
var H = y;

var MODELE = JSON.parse(fs.readFileSync(path.join(DATA, 'Map037.json'), 'utf8'));
var m = JSON.parse(JSON.stringify(MODELE));
m.displayName = '';
m.note = '<Atelier>\n<Disable Time System>\nclear_all_weathers\nVitrine des recettes — des événements complets à copier dans l\'éditeur. Aucun transfert du jeu ne mène ici.';
m.width = W; m.height = H;
m.autoplayBgm = false; m.autoplayBgs = false; m.encounterList = []; m.specifyBattleback = false; m.disableDashing = false;
m.data = new Array(W * H * 6).fill(0);
for (var i = 0; i < W * H; i++) m.data[i] = PLANCHER;
parTheme.forEach(function (b) {
    for (var yy = b.y0; yy <= b.y1; yy += 2) for (var x = 0; x < W; x++) m.data[yy * W + x] = b.bande;
});
cases.forEach(function (c) { m.data[c[1] * W + c[0]] = c[2]; });
m.events = evs;

/* ── contrôles ────────────────────────────────────────────────────────── */
var defauts = [];
var existe = {};
function image(nom) { if (existe[nom] === undefined) existe[nom] = fs.existsSync(path.join(RACINE, 'img', 'characters', nom + '.png')); return existe[nom]; }
evs.forEach(function (e) {
    if (!e) return;
    e.pages.forEach(function (p, k) {
        if (p.image.characterName && !image(p.image.characterName)) defauts.push(e.name + ' p' + (k + 1) + ' : sprite absent ' + p.image.characterName);
        var pile = 0;
        p.list.forEach(function (c) {
            if (c.code === 111 || c.code === 102 || c.code === 112 || (c.code === 301 && (c.parameters[2] || c.parameters[3]))) pile++;
            if (c.code === 412 || c.code === 404 || c.code === 413 || c.code === 604) pile--;
        });
        if (pile) defauts.push(e.name + ' p' + (k + 1) + ' : bloc non refermé');
        var der = p.list[p.list.length - 1];
        if (der.code !== 0 || der.indent !== 0) defauts.push(e.name + ' : liste mal terminée');
    });
});
var stats = { pages2: 0, parallele: 0, contact: 0, auto: 0, transfertsDirects: 0 };
evs.forEach(function (e) {
    if (!e) return;
    if (e.pages.length > 1) stats.pages2++;
    var t = e.pages[0].trigger;
    if (t === 4) stats.parallele++; if (t === 1 || t === 2) stats.contact++; if (t === 3) stats.auto++;
    if (e.pages[0].list.some(function (c) { return c.code === 201 && c.parameters[0] === 0 && c.parameters[1] === CARTE; })) stats.transfertsDirects++;
});
console.log('   ' + themes.length + ' thèmes · ' + total + ' recettes → ' + (evs.length - 1) + ' événements sur la carte ' + CARTE + ' (' + W + ' × ' + H + ')');
console.log('   ' + stats.pages2 + ' avec une page 2 · ' + stats.parallele + ' en processus parallèle · ' + stats.contact + ' au contact · ' + stats.auto + ' en démarrage auto · ' + stats.transfertsDirects + ' portes en transfert direct');
if (evs.length - 1 > 999) defauts.push('plus de 999 événements sur la carte');
if (defauts.length) { console.log('   ✗ ' + defauts.length + ' défaut(s) :\n     ' + defauts.slice(0, 30).join('\n     ')); process.exit(1); }
console.log('   ✓ sprites présents, blocs refermés, listes bien terminées');
if (process.argv.indexOf("--liste") >= 0) evs.forEach(function (e) { if (e && (e.pages.length > 1 || e.pages[0].trigger)) console.log("     " + e.id + " t" + e.pages[0].trigger + " p" + e.pages.length + " " + (e.pages[1] ? JSON.stringify(e.pages[1].image.characterName || e.pages[1].image.tileId) + " " : "") + e.name); });
if (!ECRIRE) process.exit(0);

var FMAP = path.join(DATA, 'Map' + String(CARTE).padStart(3, '0') + '.json');
if (fs.existsSync(FMAP) && fs.readFileSync(FMAP, 'utf8').indexOf('"note":"<Atelier>') < 0) { console.log('   ✗ la carte ' + CARTE + ' existe et n\'est pas à l\'atelier : on n\'y touche pas.'); process.exit(1); }
fs.writeFileSync(FMAP, JSON.stringify(m));
var infos = JSON.parse(fs.readFileSync(path.join(DATA, 'MapInfos.json'), 'utf8'));
if (infos[CARTE] && infos[CARTE].name !== NOM_CARTE) { console.log('   ✗ MapInfos ' + CARTE + ' porte déjà « ' + infos[CARTE].name + ' »'); process.exit(1); }
var ordre = infos.reduce(function (o, x) { return x && x.id !== CARTE ? Math.max(o, x.order) : o; }, 0);
while (infos.length <= CARTE) infos.push(null);
infos[CARTE] = { id: CARTE, expanded: false, name: NOM_CARTE, order: infos[CARTE] ? infos[CARTE].order : ordre + 1, parentId: 0, scrollX: 0, scrollY: 0 };
fs.writeFileSync(path.join(DATA, 'MapInfos.json'), '[\n' + infos.map(function (x) { return JSON.stringify(x); }).join(',\n') + '\n]');
console.log('   écrit : ' + path.relative(RACINE, FMAP) + ' et MapInfos');
