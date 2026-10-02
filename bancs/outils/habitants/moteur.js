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

/* ── la fiche → la liste ──────────────────────────────────────────────── */
function compiler(p) {
    var nom = p.nom, l = [];
    l = l.concat(D.note('◆ HABITANT · ' + p.nom + (p.role ? ' — ' + p.role : '')));
    if (p.voix) l = l.concat(D.note('Sa voix : ' + p.voix));
    l = l.concat(D.note('Généré par bancs/outils/poser_les_habitants.js depuis bancs/outils/habitants/. Modifiable ici comme n\'importe quel événement ; relancer l\'outil réécrit cette page.'));
    l = l.concat(A.js('Habitants.prep(this);'));
    if (p.avant) l = l.concat(p.avant);

    // l'accueil
    var bonjour = selon(V.moment, p.bonjour || {}, nom, p.bonjourTous);
    var accueil = bonjour;
    if (p.retour) accueil = si(C.vr(V.jours, '>=', 7), unParmi(nom, p.retour), bonjour);
    if (p.premiere) accueil = si(C.vr(V.visites, '=', 1), element(nom, p.premiere), accueil);
    l = l.concat(accueil);
    if (p.blesse) l = l.concat(si(C.js('$gameParty.leader() && $gameParty.leader().hpRate() < 0.4'), unParmi(nom, [].concat(p.blesse))));
    // la remarque du jour : par mauvais temps, le temps qu'il fait (MeteoVivante) ;
    // sinon, à partir de la 2e visite, la saison
    var remSaison = p.saisons ? si(C.vr(V.visites, '>', 1), selon(V.saison, p.saisons, nom)) : [];
    if (p.meteo) {
        var types = ['orage', 'tempete', 'pluie', 'neige', 'brouillard'].filter(function (t) { return p.meteo[t] && p.meteo[t].length; });
        var chaine = function (i) {
            if (i >= types.length) return remSaison;
            return si(C.js("window.Meteo && Meteo.est('" + types[i] + "')"), unParmi(nom, p.meteo[types[i]]), chaine(i + 1));
        };
        l = l.concat(chaine(0));
    } else l = l.concat(remSaison);
    if (p.apresAccueil) l = l.concat(p.apresAccueil);

    // le menu
    var options = [];
    if (p.discuter) options.push({ titre: p.titreDiscuter || 'Discuter', cmds: p.discuterMoment ? si(C.js('Math.random() < 0.5'), selon(V.moment, p.discuterMoment, nom, p.discuter), unParmi(nom, p.discuter)) : unParmi(nom, p.discuter) });
    if (p.nouvelles) options.push({ titre: p.titreNouvelles || 'Quoi de neuf ?', cmds: p.nouvellesSaison ? si(C.js('Math.random() < 0.5'), selon(V.saison, p.nouvellesSaison, nom, p.nouvelles), unParmi(nom, p.nouvelles)) : unParmi(nom, p.nouvelles) });
    if (p.perso) options.push({ titre: p.perso.titre, cmds: paliers(p.perso.sur === 'affinite' ? V.affinite : V.visites, p.perso.paliers, nom) });
    (p.options || []).forEach(function (o) { options.push(o); });
    var fin = { titre: p.titreFin || 'Au revoir', cmds: cat(unParmi(nom, p.aurevoir || ['…']), D.sortirBoucle()) };
    var conditionnelles = options.filter(function (o) { return o.si; });
    if (conditionnelles.length > 3) throw new Error(nom + ' : au plus 3 options conditionnelles par menu');
    function menu(actives) {
        var liste = options.filter(function (o) { return !o.si || actives.indexOf(o) >= 0; }).concat([fin]);
        if (liste.length > 6) throw new Error(nom + ' : plus de 6 choix dans le menu');
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

module.exports = { V: V, NOMS_VAR: NOMS_VAR, parle: parle, unParmi: unParmi, selon: selon, paliers: paliers, affinite: affinite, compiler: compiler, couper: couper };
