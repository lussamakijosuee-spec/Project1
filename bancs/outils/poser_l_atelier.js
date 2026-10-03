/*
 * L'ATELIER — le carnet des plugins, en vrais événements à copier
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-09-26 : « fais ce que tu as fait dans le carnet mais dans les
 * événements […] tous les événements préparés avec toutes les commandes […]
 * limite tu prends toute la place s'il le faut […] j'aurais juste à copier
 * coller ».
 *
 * Deux cartes, jamais reliées au monde (aucun transfert n'y mène) :
 *
 *   068 « ✎ ATELIER · Situations »  — un panneau par situation du carnet, rangé
 *        par thème (une rangée = un thème). Dans chaque panneau, les VRAIES
 *        commandes d'événement : commande de plugin, script, embranchement,
 *        contrôle d'interrupteur, afficher une image, choix, message…
 *        Ce qui va dans une case Note est écrit en commentaire, prêt à copier.
 *
 *   069 « ✎ ATELIER · Tous les plugins » — un panneau par plugin actif, dans
 *        l'ordre de chargement, avec TOUTES ses commandes et leurs variantes,
 *        tes propres lignes quand tu t'en sers déjà, ses balises et ses scripts.
 *
 * Copier : dans l'éditeur, clic droit sur le panneau → Copier, puis Coller
 * sur ta carte. Ou ouvrir le panneau et copier seulement les lignes voulues.
 *
 * Les deux cartes portent <Atelier> dans leur note : les bancs et le carnet
 * les ignorent, pour qu'une commande posée ici ne passe jamais pour une
 * commande que le jeu emploie vraiment.
 *
 * Idempotent : relancer réécrit les deux cartes à neuf.
 *   node bancs/outils/poser_l_atelier.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var RACINE = path.join(__dirname, '..', '..');
var DATA = path.join(RACINE, 'data');

var SITUATIONS = require('./carnet_situations.js');
cp.execSync('node ' + JSON.stringify(path.join(__dirname, 'carnet_des_plugins.js')) + ' --json', { stdio: 'ignore' });
var BRUT = path.join(__dirname, 'carnet_brut.json');
var PLUGINS = JSON.parse(fs.readFileSync(BRUT, 'utf8'));
fs.unlinkSync(BRUT);
var ACTEURS = JSON.parse(fs.readFileSync(path.join(DATA, 'Actors.json'), 'utf8'));

var CARTE_SITU = 68, CARTE_PLUG = 69;
var SPRITE = '!$Bulletin01_PixelScaled';
var COLONNES = 12;

/* ── les commandes d'événement ────────────────────────────────────────── */
function cmd(code, indent, params) { return { code: code, indent: indent, parameters: params }; }
function coupe(texte, largeur) {
    var out = [];
    String(texte).split('\n').forEach(function (para) {
        var mots = para.split(' '), l = '';
        mots.forEach(function (m) {
            if ((l + ' ' + m).trim().length > largeur && l) { out.push(l); l = m; }
            else l = (l ? l + ' ' : '') + m;
        });
        out.push(l);
    });
    return out;
}
function commentaire(liste, indent, texte) {
    var l = coupe(texte, 64);
    liste.push(cmd(108, indent, [l[0]]));
    l.slice(1).forEach(function (x) { liste.push(cmd(408, indent, [x])); });
}
function script(liste, indent, texte) {
    var l = String(texte).split('\n');
    liste.push(cmd(355, indent, [l[0]]));
    l.slice(1).forEach(function (x) { liste.push(cmd(655, indent, [x])); });
}
function message(liste, indent, texte) {
    liste.push(cmd(101, indent, ['', 0, 0, 2]));
    coupe(texte, 60).slice(0, 4).forEach(function (x) { liste.push(cmd(401, indent, [x])); });
}
function idActeur(nom) {
    var a = ACTEURS.filter(function (x) { return x && x.name.trim().toLowerCase() === nom.trim().toLowerCase(); })[0];
    return a ? a.id : 0;
}
// une expression qui rend vrai/faux : c'est une condition
function estCondition(t) { return /===|!==|>=|<=|[^=!<>]==[^=]|\bquestDone\(|\bquestObjDone\(|\bhasMap\(|\breadyForNextLevel\(|\banyReadyForLevel\(/.test(t); }

/* Une ligne du carnet → des commandes d'événement */
function traduire(liste, l, suite) {
    var t = l.texte;
    if (l.genre === 'commande') {
        if (l.ou) commentaire(liste, 0, '↓ ' + l.ou);
        liste.push(cmd(356, 0, [t]));
    } else if (l.genre === 'script') {
        if (estCondition(t)) {
            commentaire(liste, 0, '↓ Embranchement conditionnel, onglet 4 « Script »' + (l.ou ? ' — ' + l.ou : ''));
            liste.push(cmd(111, 0, [12, t]));
            commentaire(liste, 1, 'Ce qui se passe si c\'est VRAI');
            liste.push(cmd(0, 1, []));
            liste.push(cmd(411, 0, []));
            commentaire(liste, 1, 'Ce qui se passe sinon');
            liste.push(cmd(0, 1, []));
            liste.push(cmd(412, 0, []));
        } else {
            if (l.ou) commentaire(liste, 0, '↓ ' + l.ou);
            script(liste, 0, t);
        }
    } else if (l.genre === 'note') {
        commentaire(liste, 0, '✎ À COLLER DANS UNE NOTE' + (l.ou ? ' (' + l.ou + ')' : '') + ' — pas dans un événement :');
        commentaire(liste, 0, t);
    } else if (l.genre === 'commentaire') {
        commentaire(liste, 0, '↓ Ce commentaire se met tel quel dans la page de l\'événement' + (l.ou ? ' — ' + l.ou : ''));
        commentaire(liste, 0, t);
    } else if (l.genre === 'message') {
        if (l.ou) commentaire(liste, 0, '↓ ' + l.ou);
        message(liste, 0, t);
    } else if (l.genre === 'mv') {
        var m;
        if ((m = /Contrôle d'interrupteur : (\d+)[^=]*= (ON|OFF)/.exec(t))) {
            liste.push(cmd(121, 0, [Number(m[1]), Number(m[1]), m[2] === 'ON' ? 0 : 1]));
        } else if ((m = /Afficher une image : n°(\d+), « (.+?) », opacité (\d+)/.exec(t))) {
            commentaire(liste, 0, '↓ Choisis ton image du lore dans cette commande (img/pictures)');
            liste.push(cmd(231, 0, [Number(m[1]), '', 0, 0, 0, 0, 100, 100, Number(m[3]), 0]));
        } else if ((m = /Déplacer une image : n°(\d+), opacité (\d+), (\d+) images/.exec(t))) {
            liste.push(cmd(232, 0, [Number(m[1]), 0, 0, 0, 0, 0, 100, 100, Number(m[2]), 0, Number(m[3]), true]));
        } else if ((m = /Effacer l'image : n°(\d+)/.exec(t))) {
            liste.push(cmd(235, 0, [Number(m[1])]));
        } else if ((m = /^Étiquette : (.+)$/.exec(t))) {
            liste.push(cmd(118, 0, [m[1].trim()]));
        } else if ((m = /Afficher une bulle : événement (\d+), « ! »/.exec(t))) {
            liste.push(cmd(213, 0, [Number(m[1]), 1, true]));
        } else if ((m = /Définir un déplacement : événement (\d+), vers le joueur \(sans attendre\)/.exec(t))) {
            // trois pas vers le joueur, « passer si impossible » décoché : c'est
            // justement le cas que le garde-fou d'OutilsDeScene rattrape
            var pas = { code: 10, indent: null, parameters: [] };
            liste.push(cmd(205, 0, [Number(m[1]), { list: [pas, pas, pas, { code: 0, parameters: [] }], repeat: false, skippable: false, wait: false }]));
            liste.push(cmd(505, 0, [pas])); liste.push(cmd(505, 0, [pas])); liste.push(cmd(505, 0, [pas]));
        } else if (/Faire trembler l'écran/.test(t)) {
            liste.push(cmd(225, 0, [5, 5, 30, false]));
        } else if ((m = /Afficher un choix : (.+)$/.exec(t))) {
            var noms = m[1].split('/').map(function (x) { return x.trim(); });
            var ids = noms.map(idActeur);
            liste.push(cmd(102, 0, [noms, -1, 0, 2, 0]));
            noms.forEach(function (n, i) {
                liste.push(cmd(402, 0, [i, n]));
                ids.forEach(function (autre, j) { if (j !== i && autre) liste.push(cmd(129, 1, [autre, 1, false])); });
                if (ids[i]) liste.push(cmd(129, 1, [ids[i], 0, true]));
                commentaire(liste, 1, 'Transférer le joueur : choisis la carte de départ de ' + n);
                liste.push(cmd(0, 1, []));
            });
            liste.push(cmd(404, 0, []));
            suite.sauter = /Pour chaque choix|Transférer le joueur/;
        } else {
            commentaire(liste, 0, 'Éditeur MV : ' + t);
        }
    }
}

function blocDeChoix(liste, bloc) {
    var notes = bloc.filter(function (l) { return l.ou; });
    notes.forEach(function (l) { commentaire(liste, 0, '↓ « ' + l.texte.replace(/\s*<[^>]*>/g, '') + ' » : ' + l.ou); });
    // six au plus par commande : MV n'en accepte pas davantage (DialoguesPlus recolle les blocs)
    for (var d = 0; d < bloc.length; d += 6) {
        var noms = bloc.slice(d, d + 6).map(function (l) { return l.texte; });
        liste.push(cmd(102, 0, [noms, -1, 0, 2, 0]));
        noms.forEach(function (n, i) {
            liste.push(cmd(402, 0, [i, n]));
            commentaire(liste, 1, 'Ce qui se passe si on prend « ' + n.replace(/\s*<[^>]*>/g, '') + ' »');
            liste.push(cmd(0, 1, []));
        });
        liste.push(cmd(404, 0, []));
    }
}

/* ── une page, un événement ───────────────────────────────────────────── */
function page(liste) {
    liste.push(cmd(0, 0, []));
    return {
        conditions: { actorId: 1, actorValid: false, itemId: 1, itemValid: false, selfSwitchCh: 'A', selfSwitchValid: false,
            switch1Id: 1, switch1Valid: false, switch2Id: 1, switch2Valid: false, variableId: 1, variableValid: false, variableValue: 0 },
        directionFix: true, image: { characterIndex: 0, characterName: SPRITE, direction: 2, pattern: 1, tileId: 0 },
        list: liste, moveFrequency: 3, moveRoute: { list: [{ code: 0, parameters: [] }], repeat: true, skippable: false, wait: false },
        moveSpeed: 3, moveType: 0, priorityType: 1, stepAnime: false, through: false, trigger: 0, walkAnime: false
    };
}
function evenement(id, nom, x, y, liste) {
    return { id: id, name: nom.slice(0, 60), note: '', pages: [page(liste)], x: x, y: y };
}

/* ── la carte ─────────────────────────────────────────────────────────── */
var MODELE = JSON.parse(fs.readFileSync(path.join(DATA, 'Map037.json'), 'utf8'));
var SOL = 3200;   // le sol le plus courant de la Maison 1 (même tileset)
function carte(nom, largeur, hauteur, evs) {
    var m = JSON.parse(JSON.stringify(MODELE));
    m.displayName = '';
    m.note = '<Atelier>\n<Disable Time System>\nclear_all_weathers\n' + nom + ' — des panneaux à copier dans l\'éditeur. Aucun transfert ne mène ici.';
    m.width = largeur; m.height = hauteur;
    m.autoplayBgm = false; m.autoplayBgs = false; m.encounterList = []; m.specifyBattleback = false;
    m.data = new Array(largeur * hauteur * 6).fill(0);
    for (var i = 0; i < largeur * hauteur; i++) m.data[i] = SOL;
    m.events = [null].concat(evs);
    return m;
}
function ecrire(id, nom, objet) {
    fs.writeFileSync(path.join(DATA, 'Map' + String(id).padStart(3, '0') + '.json'), JSON.stringify(objet));
    var infos = JSON.parse(fs.readFileSync(path.join(DATA, 'MapInfos.json'), 'utf8'));
    var ordre = infos.reduce(function (o, x) { return x && x.id !== id ? Math.max(o, x.order) : o; }, 0);
    var ancien = infos[id];
    infos[id] = { id: id, expanded: false, name: nom, order: ancien ? ancien.order : ordre + 1, parentId: 0, scrollX: 0, scrollY: 0 };
    fs.writeFileSync(path.join(DATA, 'MapInfos.json'), '[\n' + infos.map(function (x) { return JSON.stringify(x); }).join(',\n') + '\n]');
}

/* ── 068 : les situations ─────────────────────────────────────────────── */
var evs = [], id = 0, rangee = 0, total = 0, ceSitu = [];
SITUATIONS.forEach(function (th) {
    th.situations.forEach(function (s, col) {
        var liste = [];
        commentaire(liste, 0, '══ ' + th.theme.toUpperCase() + ' ══');
        commentaire(liste, 0, s.titre);
        if (s.texte) commentaire(liste, 0, s.texte);
        var suite = { sauter: null };
        var lignes = s.lignes || [];
        for (var k = 0; k < lignes.length; k++) {
            var l = lignes[k];
            if (l.genre === 'choix') {   // les choix qui se suivent forment UN bloc « Afficher des choix »
                var bloc = [];
                while (k < lignes.length && lignes[k].genre === 'choix') bloc.push(lignes[k++]);
                k--;
                blocDeChoix(liste, bloc);
                continue;
            }
            if (suite.sauter && l.genre === 'mv' && suite.sauter.test(l.texte)) continue;
            traduire(liste, l, suite);
        }
        if (!(s.lignes || []).length) commentaire(liste, 0, '(aide seulement — rien à copier)');
        id++; total += liste.length;
        ceSitu.push({ theme: th.theme, titre: s.titre, liste: liste });
        evs.push(evenement(id, th.theme.split(/[ ,]/)[0] + ' · ' + s.titre, 2 + (col % COLONNES) * 2, 2 + rangee * 2 + Math.floor(col / COLONNES) * 2, liste));
    });
    rangee += 1 + Math.floor((th.situations.length - 1) / COLONNES);
});
var h1 = 4 + rangee * 2;
ecrire(CARTE_SITU, '✎ ATELIER · Situations', carte('Situations du carnet', 2 + COLONNES * 2 + 1, h1, evs));
console.log('   carte ' + CARTE_SITU + ' : ' + evs.length + ' panneaux, ' + total + ' commandes');

/* ── 069 : tous les plugins ───────────────────────────────────────────── */
function appelPropre(t) { return /^[\$A-Za-z_][\w$]*(?:\.[\w$]+)+\s*\([^;]*\)\s*;?\s*(?:\/\/.*)?$/.test(t) && !/[a-z]+,[a-z]+,|\.\.\./.test(t); }
var evs2 = [], total2 = 0;
PLUGINS.forEach(function (p, i) {
    var liste = [];
    commentaire(liste, 0, '══ ' + p.nom + ' ══');
    commentaire(liste, 0, p.resume || p.desc);
    if (p.commandes.length) {
        commentaire(liste, 0, '── COMMANDES DE PLUGIN ── les MOTS EN MAJUSCULES ou « x » sont à remplacer');
        p.commandes.forEach(function (c) {
            if (c.syntaxes.length) {
                c.syntaxes.forEach(function (s) {
                    if (s.glose) commentaire(liste, 0, '↓ ' + s.glose);
                    liste.push(cmd(356, 0, [s.ex]));
                });
            } else if (!c.tiennes.length) liste.push(cmd(356, 0, [c.nom]));
            if (c.tiennes.length) {
                commentaire(liste, 0, '↓ ' + c.nom + ' : tes lignes, telles qu\'elles marchent déjà dans le jeu');
                c.tiennes.forEach(function (x) { liste.push(cmd(356, 0, [x])); });
            }
        });
        if (p.sousCommandes.length) commentaire(liste, 0, 'Mots reconnus après la commande : ' + p.sousCommandes.join(', '));
    }
    if (p.scripts.length) {
        commentaire(liste, 0, '── SCRIPTS ── commande « Script », ou condition « Script »');
        p.scripts.forEach(function (s) {
            if (appelPropre(s)) script(liste, 0, s);
            else commentaire(liste, 0, 'SCRIPT : ' + s);
        });
    }
    if (p.balises.length) {
        commentaire(liste, 0, '── NOTES ET COMMENTAIRES ── dans la case Note, ou en commentaire d\'événement');
        var groupe = null;
        p.balises.forEach(function (b) {
            var g = (b.cible ? b.cible + ' · ' : '') + (b.titre || '');
            if (g && g !== groupe) { groupe = g; commentaire(liste, 0, '▸ ' + g); }
            commentaire(liste, 0, b.ligne);
        });
    }
    if (p.balisesCode.length) commentaire(liste, 0, 'Mots-clés lus dans les notes : ' + p.balisesCode.join(', '));
    if (p.interrupteurs.length) {
        commentaire(liste, 0, '── INTERRUPTEURS ET VARIABLES ──');
        p.interrupteurs.forEach(function (x) { commentaire(liste, 0, x.genre + ' ' + x.num + (x.nom ? ' « ' + x.nom + ' »' : '') + ' : ' + x.role); });
    }
    if (!p.commandes.length && !p.scripts.length && !p.balises.length) commentaire(liste, 0, 'Rien à taper : ce plugin se règle seulement dans le Gestionnaire de plugins.');
    total2 += liste.length;
    evs2.push(evenement(i + 1, p.nom, 2 + (i % COLONNES) * 2, 2 + Math.floor(i / COLONNES) * 2, liste));
});
var h2 = 4 + Math.ceil(PLUGINS.length / COLONNES) * 2;
ecrire(CARTE_PLUG, '✎ ATELIER · Tous les plugins', carte('Tous les plugins actifs', 2 + COLONNES * 2 + 1, h2, evs2));
console.log('   carte ' + CARTE_PLUG + ' : ' + evs2.length + ' panneaux, ' + total2 + ' commandes');

/* ── contrôle : chaque commande de plugin posée ici est écoutée, à cette
 *    orthographe exacte, par un plugin actif ─────────────────────────── */
var ecoute = {};
PLUGINS.forEach(function (p) { p.commandes.forEach(function (c) { ecoute[c.casse ? c.nom.toLowerCase() : c.nom] = c.casse ? 'i' : 'x'; }); });
var sourdes = [];
[evs, evs2].forEach(function (lot) {
    lot.forEach(function (e) {
        e.pages[0].list.forEach(function (c) {
            if (c.code !== 356) return;
            var mot = c.parameters[0].trim().split(/\s+/)[0];
            if (ecoute[mot] !== 'x' && ecoute[mot.toLowerCase()] !== 'i') sourdes.push(e.name + ' : ' + c.parameters[0]);
        });
    });
});
if (sourdes.length) {
    console.log('   ✗ ' + sourdes.length + ' commande(s) que personne n\'écoute :\n     ' + sourdes.slice(0, 12).join('\n     '));
    process.exit(1);
}
console.log('   ✓ chaque commande de plugin posée est écoutée par un plugin actif, à cette orthographe');

/* ── les ÉVÉNEMENTS COMMUNS : le même carnet, dans la base de données ───
 * JOKO : « Je parle des événements communs. Tout ce que tu as fait dans le
 * carnet. » Rangés loin des siens (il s'arrête à 234) :
 *   701…  les situations, un séparateur « ▬▬ ✎ thème ▬▬ » avant chaque thème
 *   801…  un événement commun par plugin actif (plus loin si les situations
 *         débordent : elles ne sont jamais écrasées)
 * Déclencheur « Aucun » : ils ne tournent jamais seuls. On peut les appeler
 * (« Événement commun »), ou copier leurs lignes.
 * On ne réécrit QUE des cases vides ou déjà à l'atelier (« ✎ » / « ▬▬ ✎ »). */
var CE_SITU = 701, CE_PLUG = 801, CE_FIN = 999;
var FCE = path.join(DATA, 'CommonEvents.json');
var CE = JSON.parse(fs.readFileSync(FCE, 'utf8'));
var atelier = require('./atelier.js');
function libre(n) { var c = CE[n]; return !c || atelier.estCEAtelier(c) || (!c.name && (!c.list || c.list.length <= 1)); }
for (var n = CE_SITU; n <= CE_FIN; n++) {
    if (!libre(n)) { console.log('   ✗ l\'événement commun ' + n + ' « ' + CE[n].name + ' » n\'est pas à l\'atelier : on n\'y touche pas.'); process.exit(1); }
}
while (CE.length <= CE_FIN) CE.push(null);
for (n = CE_SITU; n <= CE_FIN; n++) CE[n] = { id: n, list: [cmd(0, 0, [])], name: '', switchId: 1, trigger: 0 };
var poses = {};
function poser(n, nom, liste) {
    if (n > CE_FIN) { console.log('   ✗ plus de place après ' + CE_FIN); process.exit(1); }
    // deux panneaux sur le même numéro : le second effacerait le premier sans un mot
    if (poses[n]) { console.log('   ✗ l\'événement commun ' + n + ' serait écrit deux fois (« ' + poses[n] + ' » puis « ' + nom + ' »)'); process.exit(1); }
    poses[n] = nom;
    CE[n] = { id: n, list: JSON.parse(JSON.stringify(liste)), name: nom, switchId: 1, trigger: 0 };
}
var k = CE_SITU, themeVu = null;
ceSitu.forEach(function (x) {
    if (x.theme !== themeVu) {
        themeVu = x.theme;
        var tete = [];
        commentaire(tete, 0, 'Séparateur : les événements communs qui suivent sont les situations « ' + x.theme + ' » du carnet des plugins.');
        tete.push(cmd(0, 0, []));
        poser(k++, '▬▬ ✎ ' + x.theme.toUpperCase() + ' ▬▬', tete);
    }
    poser(k++, '✎ ' + x.titre, x.liste);
});
var finSitu = k - 1;
k = Math.max(CE_PLUG, Math.ceil((finSitu + 2) / 10) * 10 + 1);   // après les situations, sur une dizaine ronde
var debutPlug = k;
poser(k++, '▬▬ ✎ TOUS LES PLUGINS ACTIFS ▬▬', (function () { var t = []; commentaire(t, 0, 'Un événement commun par plugin actif, dans l\'ordre de chargement : toutes ses commandes, scripts, balises et interrupteurs.'); t.push(cmd(0, 0, [])); return t; })());
evs2.forEach(function (e) { poser(k++, '✎ ' + e.name, e.pages[0].list); });
fs.writeFileSync(FCE, '[\n' + CE.map(function (x) { return JSON.stringify(x); }).join(',\n') + '\n]');
console.log('   événements communs ' + CE_SITU + '–' + finSitu + ' : situations · ' + debutPlug + '–' + (k - 1) + ' : plugins');
