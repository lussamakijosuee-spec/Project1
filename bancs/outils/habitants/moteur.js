/*
 * LE MOTEUR DES HABITANTS — une fiche de personnage → de vraies commandes MV
 * ---------------------------------------------------------------------------
 * Modèle : l'aubergiste de JOKO (Auberge 1F, événement 5) — la saison, le
 * moment du jour, un menu, des nouvelles au hasard, une annonce de quête.
 * Ici, chaque habitant reçoit la même mécanique, en plus fin :
 *
 *   Habitants.prep(this)            mémoire : visites, jours d'absence,
 *                                   moment, saison, affinité (js/plugins/Habitants.js)
 *   1re rencontre / retour après 7 jours / bonjour selon le moment
 *   une remarque de saison (une parmi plusieurs)
 *   une remarque si le chef d'équipe est blessé
 *   un menu qui revient après chaque sujet, jusqu'à « Au revoir » :
 *     Discuter · Quoi de neuf ? · son sujet à lui (qui s'ouvre avec les
 *     visites) · ce qu'il vend ou propose
 *
 * Tout est en commandes d'événement ordinaires : JOKO les modifie dans
 * l'éditeur comme les siennes. Les conditions lisent des variables nommées
 * « ◆ Habitants · … » (880–885).
 */
'use strict';
var D = require('../recettes/dsl.js');
var A = D.A, C = D.C, si = D.si, cat = D.cat, boucle = D.boucle;
var V = { visites: 880, jours: 881, tirage: 882, moment: 883, saison: 884, affinite: 885 };
var NOMS_VAR = { 880: '◆ Habitants · visites (ce PNJ)', 881: '◆ Habitants · jours depuis', 882: '◆ Habitants · tirage',
    883: '◆ Habitants · moment (1 matin…4 nuit)', 884: '◆ Habitants · saison (1…4)', 885: '◆ Habitants · affinité (ce PNJ)' };
var LARGEUR = 46;

/* ── le texte ─────────────────────────────────────────────────────────── */
function couper(texte) {
    var lignes = [];
    String(texte).split('\n').forEach(function (para) {
        var l = '';
        para.split(' ').forEach(function (m) {
            if (l && (l + ' ' + m).length > LARGEUR) { lignes.push(l); l = m; } else l = l ? l + ' ' + m : m;
        });
        lignes.push(l);
    });
    return lignes;
}
/* « texte » : une réplique. « | » sépare deux boîtes. « ~ » en tête : une
 * didascalie (ce qu'on voit), sans nom. */
function parle(nom, texte) {
    var out = [];
    String(texte).split('|').forEach(function (boite) {
        boite = boite.trim();
        var narr = boite.charAt(0) === '~';
        if (narr) boite = boite.slice(1).trim();
        var l = couper(boite);
        for (var i = 0; i < l.length; i += 4) {
            var bloc = l.slice(i, i + 4);
            if (!narr && nom) bloc[0] = '\\n<' + nom + '>' + bloc[0];
            out.push([101, 0, ['', 0, narr ? 1 : 0, 2]]);
            bloc.forEach(function (x) { out.push([401, 0, [narr ? '\\C[8]' + x + '\\C[0]' : x]]); });
        }
    });
    return out;
}
/* un élément : texte, ou liste de commandes toute prête */
function element(nom, x) {
    if (Array.isArray(x) && typeof x[0] === 'string') return cat.apply(null, x.map(function (t) { return parle(nom, t); }));
    return Array.isArray(x) ? x : parle(nom, x);
}
/* un parmi plusieurs, au hasard */
function unParmi(nom, pool) {
    pool = (pool || []).filter(function (x) { return x != null; });
    if (!pool.length) return [];
    if (pool.length === 1) return element(nom, pool[0]);
    var l = A.vrHasard(V.tirage, 1, pool.length);
    function chaine(i) { return i === pool.length - 1 ? element(nom, pool[i]) : si(C.vr(V.tirage, '=', i + 1), element(nom, pool[i]), chaine(i + 1)); }
    return cat(l, chaine(0));
}
/* selon la valeur d'une variable (1…n) */
function selon(varId, table, nom, parDefaut) {
    var cles = Object.keys(table).map(Number).sort();
    function chaine(i) {
        if (i >= cles.length) return parDefaut ? unParmi(nom, parDefaut) : [];
        return si(C.vr(varId, '=', cles[i]), unParmi(nom, table[cles[i]]), chaine(i + 1));
    }
    return chaine(0);
}
/* paliers : [[seuil, pool], …] du plus haut au plus bas, sur une variable */
function paliers(varId, liste, nom) {
    var tri = liste.slice().sort(function (a, b) { return b[0] - a[0]; });
    function chaine(i) {
        if (i === tri.length - 1) return unParmi(nom, [].concat(tri[i][1]));
        return si(C.vr(varId, '>=', tri[i][0]), unParmi(nom, [].concat(tri[i][1])), chaine(i + 1));
    }
    return chaine(0);
}
function affinite(n) { return A.js('Habitants.affinite(this, ' + n + ');'); }
function q(x) { return "'" + String(x).replace(/'/g, "\\'") + "'"; }
var V_CADEAU = 888;
NOMS_VAR[V_CADEAU] = '◆ Habitants · cadeau (objet choisi)';
var OBJETS = null;
function nomObjet(id) {
    if (!OBJETS) { try { OBJETS = require('../../../data/Items.json'); } catch (e) { OBJETS = []; } }
    return OBJETS[id] && OBJETS[id].name ? OBJETS[id].name : '#' + id;
}
var MOIS = ['', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/* ── P1 · la fiche du personnage, comme un OC : en tête de sa page ─────── */
function ficheOC(p) {
    var o = p.oc; if (!o) return [];
    var champs = [['Âge', o.age], ['Allure', o.allure], ['Caractère', o.caractere], ['Aime', o.aime], ['Déteste', o.deteste],
        ['Son rêve', o.reve], ['Son secret', o.secret], ['Sa peur', o.peur], ['Ses manies', o.manie], ['Sa phrase', o.phrase && '« ' + o.phrase + ' »']];
    if (o.liens) champs.push(['Ses liens', Object.keys(o.liens).map(function (k) { return k + ' : ' + o.liens[k]; }).join(' · ')]);
    if (p.anniversaire) { var x = p.anniversaire.split('/').map(Number); champs.push(['Anniversaire', x[1] + ' ' + MOIS[x[0]]]); }
    if (p.cadeaux) champs.push(['Cadeaux', ['adore', 'aime', 'deteste'].filter(function (g) { return (p.cadeaux[g] || []).length; })
        .map(function (g) { return { adore: 'adore', aime: 'aime', deteste: 'déteste' }[g] + ' ' + p.cadeaux[g].map(nomObjet).join(', '); }).join(' ; ')]);
    var lignes = ['◆ FICHE · ' + p.nom + ' — son personnage (bancs/outils/habitants/, champ « oc »)'];
    champs.filter(function (c) { return c[1]; }).forEach(function (c) {
        var mots = (c[0] + ' : ' + c[1]).split(' '), l = '';
        mots.forEach(function (m) { if (l && (l + ' ' + m).length > 62) { lignes.push(l); l = '   ' + m; } else l = l ? l + ' ' + m : m; });
        lignes.push(l);
    });
    return [[108, 0, [lignes[0]]]].concat(lignes.slice(1).map(function (x) { return [408, 0, [x]]; }));
}

/* ── P4 · une scène d'amitié : des répliques, des gestes, un choix ─────── */
function jouer(nom, gestes) {
    return cat.apply(null, gestes.map(function (g) {
        if (typeof g === 'string') return parle(nom, g);
        var v = g[0];
        if (v === 'dit') return parle(g[1], g[2]);                         // un autre qui parle (s'il est là)
        if (v === 'bulle') return A.bulle(0, g[1], true);
        if (v === 'pas') return D.route(0, (typeof g[1] === 'string' ? g[1].split(' ') : g[1]).map(function (m) {   // 'gauche gauche tHaut'
            if (typeof m !== 'string') return m;
            if (!D.M[m]) throw new Error(nom + ' : pas inconnu « ' + m + ' »');
            return typeof D.M[m] === 'function' ? D.M[m]() : D.M[m];
        }), { attendre: true });
        if (v === 'tourne') return D.route(0, [g[1] === 'joueur' || !g[1] ? D.M.tVersJoueur : D.M[g[1]]], { attendre: true });
        if (v === 'son') return A.se(g[1], g[2] || 80, g[3] || 100);
        if (v === 'attend') return A.attendre(g[1]);
        if (v === 'noir') return A.fonduNoir();
        if (v === 'jour') return A.fonduRetour();
        if (v === 'ami') return affinite(g[1]);
        if (v === 'js') return A.js(g[1]);
        if (v === 'choix') return D.choix(g[1], g[2].map(function (b) { return jouer(nom, b); }), { annuler: -1 });
        throw new Error(nom + ' : geste inconnu « ' + v + ' »');
    }));
}
function scenesAuRendezVous(p) {
    return cat.apply(null, (p.scenes || []).map(function (sc, i) {
        if (!sc.quand) return [];
        var w = sc.quand;
        return si(C.js('Habitants.scene(this, ' + i + ') === 1 && Habitants.rdv(' + w.carte + ', ' + w.de + ', ' + w.a + ')'),
            cat(D.note('— scène d\'amitié ' + (i + 1) + ' : ' + (sc.titre || '')), jouer(p.nom, sc.gestes), A.js('Habitants.vue(this, ' + i + ');'), A.stop()));
    }));
}
function scenesProposees(p) {
    var sc = p.scenes || []; if (!sc.length) return [];
    var paliers = '[' + sc.map(function (x) { return x.palier; }).join(', ') + ']';
    var l = [];
    sc.forEach(function (x, i) {
        var faire = x.quand ? cat(unParmi(p.nom, [].concat(x.rdv)), A.js('Habitants.promettre(this, ' + i + ');'))
            : cat(D.note('— scène d\'amitié ' + (i + 1) + ' : ' + (x.titre || '')), jouer(p.nom, x.gestes), A.js('Habitants.vue(this, ' + i + ');'));
        l = l.concat(si(C.js('Habitants.prochaine(this, ' + paliers + ') === ' + i), faire));
        if (x.quand && x.rappel) l = l.concat(si(C.js('Habitants.scene(this, ' + i + ') === 1 && Math.random() < 0.5'), unParmi(p.nom, [].concat(x.rappel))));
    });
    return l;
}

/* ── P2 · ce qu'il dit selon où il est ─────────────────────────────────── */
var LIEUX = ['bar', 'place', 'repos', 'ailleurs', 'nuit', 'travail'];
function selonLieu(p, sinonCmds) {
    var lx = p.lieux || {}, cles = LIEUX.filter(function (k) { return lx[k] && lx[k].length; });
    function chaine(i) {
        if (i >= cles.length) return sinonCmds;
        return si(C.js("Habitants.ici(this, '" + cles[i] + "') && Math.random() < 0.7"), unParmi(p.nom, lx[cles[i]]), chaine(i + 1));
    }
    return chaine(0);
}
/* ── P4 · le ton de l'amitié : au-dessus d'un palier, une autre façon de dire bonjour ── */
function selonAmitie(p, cle, sinonCmds) {
    var t = (p.amitie || []).filter(function (x) { return x[1][cle] && x[1][cle].length; }).sort(function (a, b) { return b[0] - a[0]; });
    function chaine(i) {
        if (i >= t.length) return sinonCmds;
        return si(C.js('$gameVariables.value(' + V.affinite + ') >= ' + t[i][0] + ' && Math.random() < 0.65'), unParmi(p.nom, t[i][1][cle]), chaine(i + 1));
    }
    return chaine(0);
}
/* ── P3 · les autres : quand l'un d'eux est juste à côté ─────────────── */
function aCote(p, sinonCmds) {
    var noms = Object.keys(p.aCote || {});
    function chaine(i) {
        if (i >= noms.length) return sinonCmds;
        return si(C.js('Habitants.aCote(this, ' + q(noms[i]) + ') && Math.random() < 0.6'), unParmi(p.nom, [].concat(p.aCote[noms[i]])), chaine(i + 1));
    }
    return chaine(0);
}
/* ── P5 · offrir un objet ──────────────────────────────────────────────── */
function offrir(p) {
    var c = p.cadeaux, d = c.dits || {}, anniv = p.anniversaire ? "Habitants.anniversaire('" + p.anniversaire + "')" : 'false';
    function liste(g) { return '[' + (c[g] || []).join(', ') + ']'; }
    function reagir(g) {
        return cat(unParmi(p.nom, [].concat(d[g] || ['…'])), p.anniversaire && g !== 'deteste' ? si(C.js(anniv), unParmi(p.nom, [].concat(d.anniv || ['~Pour son anniversaire : ça compte double.']))) : [],
            A.js("Habitants.offrir(this, '" + g + "', " + anniv + ');'));
    }
    var v = '$gameVariables.value(' + V_CADEAU + ')';
    return si(C.js('Habitants.offert(this)'), unParmi(p.nom, [].concat(d.deja || ['Tu m\'as déjà fait un cadeau aujourd\'hui.'])),
        cat(A.vr(V_CADEAU, 0), A.choisirObjet(V_CADEAU, 1),
            si(C.js(v + ' > 0'),
                si(C.js(liste('adore') + '.indexOf(' + v + ') >= 0'), reagir('adore'),
                    si(C.js(liste('deteste') + '.indexOf(' + v + ') >= 0'), reagir('deteste'),
                        si(C.js(liste('aime') + '.indexOf(' + v + ') >= 0'), reagir('aime'), reagir('neutre')))))));
}

/* ── la fiche → la liste ──────────────────────────────────────────────── */
function compiler(p) {
    var nom = p.nom, l = [];
    l = l.concat(D.note('◆ HABITANT · ' + p.nom + (p.role ? ' — ' + p.role : '')));
    if (p.voix) l = l.concat(D.note('Sa voix : ' + p.voix));
    l = l.concat(D.note('Généré par bancs/outils/poser_les_habitants.js depuis bancs/outils/habitants/. Modifiable ici comme n\'importe quel événement ; relancer l\'outil réécrit cette page.'));
    l = l.concat(ficheOC(p));
    l = l.concat(A.js('Habitants.prep(this);'));
    if (p.avant) l = l.concat(p.avant);
    // P4 : au rendez-vous qu'il t'a donné, sa scène se joue
    l = l.concat(scenesAuRendezVous(p));

    // l'accueil : la première fois > son anniversaire > quelqu'un à côté > le retour > bonjour (selon l'amitié, puis le moment)
    var bonjour = selonAmitie(p, 'bonjour', selon(V.moment, p.bonjour || {}, nom, p.bonjourTous));
    var accueil = aCote(p, bonjour);
    if (p.retour) accueil = si(C.vr(V.jours, '>=', 7), unParmi(nom, p.retour), accueil);
    if (p.anniversaire && p.anniv) accueil = si(C.js("Habitants.anniversaire('" + p.anniversaire + "')"), unParmi(nom, [].concat(p.anniv)), accueil);
    if (p.premiere) accueil = si(C.vr(V.visites, '=', 1), element(nom, p.premiere), accueil);
    l = l.concat(accueil);
    if (p.blesse) l = l.concat(si(C.js('$gameParty.leader() && $gameParty.leader().hpRate() < 0.4'), unParmi(nom, [].concat(p.blesse))));
    // la remarque du jour : par mauvais temps, le temps qu'il fait (MeteoVivante) ;
    // sinon, à partir de la 2e visite, la saison
    var remSaison = p.saisons ? si(C.vr(V.visites, '>', 1), selon(V.saison, p.saisons, nom)) : [];
    remSaison = selonLieu(p, remSaison);              // P2 : là où il est passe avant la saison
    if (p.meteo) {
        var types = ['orage', 'tempete', 'pluie', 'neige', 'brouillard'].filter(function (t) { return p.meteo[t] && p.meteo[t].length; });
        var chaine = function (i) {
            if (i >= types.length) return remSaison;
            return si(C.js("window.Meteo && Meteo.est('" + types[i] + "')"), unParmi(nom, p.meteo[types[i]]), chaine(i + 1));
        };
        l = l.concat(chaine(0));
    } else l = l.concat(remSaison);
    if (p.apresAccueil) l = l.concat(p.apresAccueil);
    // P4 : quand l'amitié a monté, il propose sa scène (un rendez-vous), ou il la rappelle
    l = l.concat(scenesProposees(p));

    // le menu
    var options = [];
    if (p.discuter) {
        var parler = p.discuterMoment ? si(C.js('Math.random() < 0.5'), selon(V.moment, p.discuterMoment, nom, p.discuter), unParmi(nom, p.discuter)) : unParmi(nom, p.discuter);
        // P3 : une fois sur trois, il parle de quelqu'un d'autre
        var avis = Object.keys(p.avis || {}).reduce(function (a, k) { return a.concat(p.avis[k]); }, []);
        if (avis.length) parler = si(C.js('Math.random() < 0.35'), unParmi(nom, avis), parler);
        options.push({ titre: p.titreDiscuter || 'Discuter', cmds: parler });
    }
    if (p.nouvelles) options.push({ titre: p.titreNouvelles || 'Quoi de neuf ?', cmds: p.nouvellesSaison ? si(C.js('Math.random() < 0.5'), selon(V.saison, p.nouvellesSaison, nom, p.nouvelles), unParmi(nom, p.nouvelles)) : unParmi(nom, p.nouvelles) });
    // ses confidences s'ouvrent avec l'AFFINITÉ (Habitants v1.3 : +1 chaque jour où l'on se parle), plus seulement les visites
    if (p.perso) options.push({ titre: p.perso.titre, cmds: paliers(p.perso.sur === 'visites' ? V.visites : V.affinite, p.perso.paliers, nom) });
    (p.options || []).forEach(function (o) { options.push(o); });
    if (p.cadeaux) options.push({ titre: p.titreOffrir || 'Offrir…', cmds: offrir(p) });
    var fin = { titre: p.titreFin || 'Au revoir', cmds: cat(selonAmitie(p, 'aurevoir', unParmi(nom, p.aurevoir || ['…'])), D.sortirBoucle()) };
    var conditionnelles = options.filter(function (o) { return o.si; });
    if (conditionnelles.length > 3) throw new Error(nom + ' : au plus 3 options conditionnelles par menu');
    function menu(actives) {
        var liste = options.filter(function (o) { return !o.si || actives.indexOf(o) >= 0; }).concat([fin]);
        if (liste.length > 6) {
            // trop de choix : les derniers passent dans « Autre chose… » (Annuler y revient au menu)
            var dessous = liste.slice(4, -1);
            if (dessous.length > 5) throw new Error(nom + ' : trop de choix, même avec « Autre chose… »');
            liste = liste.slice(0, 4).concat([{ titre: 'Autre chose…', cmds: D.choix(dessous.map(function (o) { return o.titre; }).concat(['Retour']), dessous.map(function (o) { return o.cmds; }).concat([[]]), { annuler: dessous.length }) }, fin]);
        }
        return D.choix(liste.map(function (o) { return o.titre; }), liste.map(function (o) { return o.cmds; }), { annuler: liste.length - 1 });
    }
    // chaque option conditionnelle : une branche « si » (le menu MV ne cache pas un choix tout seul)
    function variantes(i, actives) {
        if (i === conditionnelles.length) return menu(actives);
        return si(conditionnelles[i].si, variantes(i + 1, actives.concat([conditionnelles[i]])), variantes(i + 1, actives));
    }
    var m = variantes(0, []);
    l = l.concat(boucle(m));
    return l;
}

module.exports = { V: V, V_CADEAU: V_CADEAU, NOMS_VAR: NOMS_VAR, nomObjet: nomObjet, parle: parle, unParmi: unParmi, selon: selon, paliers: paliers, affinite: affinite, compiler: compiler, couper: couper };
