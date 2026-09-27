/*
 * LES HABITANTS — pose les fiches de bancs/outils/habitants/ dans les cartes
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-09-27 : l'aubergiste « c'est celui qui a vraiment le meilleur,
 * en termes de complexité et de variété […] je veux que ce soit aussi
 * complexe, aussi complet, aussi situationnel : chaque saison un nouveau
 * truc, chaque dialogue un nouveau truc […] les gens, ils mènent leur vie. »
 * Choix de JOKO : le bar (46) + les clients de l'auberge (44) ; chacun sa
 * voix, réaliste ; petits faits locaux inventés permis ; l'aubergiste corrigé
 * (annonce en toute saison, chambre pendant la quête).
 *
 * Ce qui est GARDÉ de chaque événement : son image, ses conditions de page,
 * son déclencheur, son déplacement, ses commentaires (<Ame>, <Verite>,
 * <NPC:>, indicateurs — « Blah Blah Blah » devient un vrai murmure), ses
 * boutiques, sa quête. Ces morceaux sont repris depuis un instantané des
 * événements tels que JOKO les a faits : habitants/originaux.json (écrit au
 * premier passage, jamais réécrit). L'outil peut donc être relancé.
 *
 *   node bancs/outils/poser_les_habitants.js            → contrôle
 *   node bancs/outils/poser_les_habitants.js --ecrire   → écrit les cartes
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var DATA = path.join(RACINE, 'data');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var D = require('./recettes/dsl.js');
var H = require('./habitants/moteur.js');
var BAR = require('./habitants/bar.js');
var AUBERGE = require('./habitants/auberge.js');
var A = D.A, C = D.C, si = D.si, cat = D.cat;

var LOTS = [BAR, AUBERGE];
var FSNAP = path.join(__dirname, 'habitants', 'originaux.json');
function fichierCarte(n) { return path.join(DATA, 'Map' + String(n).padStart(3, '0') + '.json'); }
var cartes = {};
LOTS.forEach(function (lot) { cartes[lot.carte] = JSON.parse(fs.readFileSync(fichierCarte(lot.carte), 'utf8')); });

/* ── l'instantané des événements de JOKO ─────────────────────────────── */
var snap;
if (fs.existsSync(FSNAP)) snap = JSON.parse(fs.readFileSync(FSNAP, 'utf8'));
else {
    snap = {};
    LOTS.forEach(function (lot) {
        var ids = lot.fiches.map(function (f) { return f.ev; }).concat(lot.tableau ? [49] : []);
        ids.forEach(function (id) { var e = cartes[lot.carte].events[id]; if (e) snap[lot.carte + ':' + id] = JSON.parse(JSON.stringify(e)); });
    });
    fs.writeFileSync(FSNAP, JSON.stringify(snap, null, 1));
    console.log('   instantané des événements d\'origine écrit : ' + path.relative(RACINE, FSNAP));
}
function original(carte, ev) { var e = snap[carte + ':' + ev]; if (!e) throw new Error('pas d\'instantané pour ' + carte + ':' + ev); return e; }

/* ── extraire un morceau d'une liste MV → commandes du vocabulaire ───── */
function versDsl(liste, base) { return liste.map(function (c) { return [c.code, c.indent - base, JSON.parse(JSON.stringify(c.parameters))]; }); }
function enfants(liste, i) {
    var n = liste[i].indent, out = [];
    for (var j = i + 1; j < liste.length; j++) { if (liste[j].indent <= n) break; out.push(liste[j]); }
    if (out.length && out[out.length - 1].code === 0 && out[out.length - 1].indent === n + 1) out.pop();
    return versDsl(out, n + 1);
}
function sinon(liste, i) {                       // la branche « sinon » d'un 111
    var n = liste[i].indent;
    for (var j = i + 1; j < liste.length; j++) {
        if (liste[j].indent === n && liste[j].code === 411) return enfants(liste, j);
        if (liste[j].indent === n && liste[j].code === 412) return [];
    }
    return [];
}
function trouver(liste, test) { for (var i = 0; i < liste.length; i++) if (test(liste[i])) return i; return -1; }
function extraire(carte, ev, page, cle) {
    var l = original(carte, ev).pages[page - 1].list;
    if (cle === 'boutique') return versDsl(l.filter(function (c) { return c.code === 302 || c.code === 605; }).map(function (c) { return { code: c.code, indent: 0, parameters: c.parameters }; }), 0);
    if (cle === 'rumeurs' || cle === 'chanson') {
        var i = trouver(l, function (c) { return c.code === 111 && /rumeurs/.test(String(c.parameters[1])); });
        return cle === 'rumeurs' ? enfants(l, i) : sinon(l, i);
    }
    if (cle === 'livraison') return versDsl(l.filter(function (c, k) { return !(k === l.length - 1 && c.code === 0); }), 0);
    var libelle = { nouvelles: 'Des nouvelles', chambre: 'Une chambre', annonce: 'annonce ' }[cle];
    var p1 = original(carte, ev).pages[0].list;
    var k = trouver(p1, function (c) { return c.code === 402 && c.parameters[1] === libelle; });
    if (k < 0) throw new Error(carte + ':' + ev + ' — branche « ' + libelle + ' » introuvable');
    return enfants(p1, k);
}

/* ── les commentaires qu'on garde, et les murmures ───────────────────── */
var MARQUE = /^◆ HABITANT/;
function commentairesGardes(liste, murmure) {
    var out = [], dansNote = false;
    for (var i = 0; i < liste.length; i++) {
        var c = liste[i];
        if (c.code !== 108 && c.code !== 408) break;           // seulement l'en-tête de la page
        if (c.code === 108) dansNote = !MARQUE.test(c.parameters[0]);
        if (!dansNote) continue;
        var t = c.parameters[0];
        if (/^text_indicator\s*:\s*Blah Blah Blah\s*$/.test(t)) t = 'text_indicator : ' + (murmure || '…');
        out.push({ code: c.code, indent: 0, parameters: [t] });
    }
    return out;
}

/* ── poser ────────────────────────────────────────────────────────────── */
var defauts = [], poses = 0, lignes = 0;
function versListe(cmds) { return cmds.map(function (c) { return { code: c[0], indent: c[1], parameters: c[2] }; }); }
function controle(nom, liste) {
    var pile = 0;
    liste.forEach(function (c, i) {
        if (typeof c.code !== 'number' || !(c.indent >= 0)) defauts.push(nom + ' : commande mal formée ligne ' + i + ' ' + JSON.stringify(c).slice(0, 120));
        if (c.code === 111 || c.code === 102 || c.code === 112 || (c.code === 301 && (c.parameters[2] || c.parameters[3]))) pile++;
        if (c.code === 412 || c.code === 404 || c.code === 413 || c.code === 604) pile--;
        if (c.code === 355) { try { new Function(c.parameters[0]); } catch (e) { defauts.push(nom + ' : script invalide ' + c.parameters[0]); } }
        if (c.code === 111 && c.parameters[0] === 12) { try { new Function('return (' + c.parameters[1] + ');'); } catch (e) { defauts.push(nom + ' : condition invalide'); } }
        if (c.code === 102 && c.parameters[0].length > 6) defauts.push(nom + ' : plus de 6 choix');
        if (c.code === 401 && c.parameters[0].replace(/\\[A-Za-z]+\[[^\]]*\]|\\n<[^>]*>|\\[{}]/g, '').length > 56) defauts.push(nom + ' : ligne trop longue « ' + c.parameters[0] + ' »');
        if (c.code === 250 || c.code === 249 || c.code === 245) {
            var dos = { 250: 'se', 249: 'me', 245: 'bgs' }[c.code];
            if (!['.ogg', '.m4a'].some(function (x) { return fs.existsSync(path.join(RACINE, 'audio', dos, c.parameters[0].name + x)); })) defauts.push(nom + ' : son absent ' + c.parameters[0].name);
        }
        if (c.code === 401) lignes++;
    });
    if (pile) defauts.push(nom + ' : bloc non refermé');
}
LOTS.forEach(function (lot) {
    var m = cartes[lot.carte];
    lot.fiches.forEach(function (f) {
        var e = m.events[f.ev];
        if (!e) { defauts.push('carte ' + lot.carte + ' : événement ' + f.ev + ' absent'); return; }
        var page = f.page || 1, orig = original(lot.carte, f.ev);
        if (!e.pages[page - 1]) { defauts.push(f.nom + ' : pas de page ' + page); return; }
        var fiche = Object.assign({}, f);
        fiche.options = (f.options || []).map(function (o) {
            if (!o.garder) return o;
            var cmds = extraire(lot.carte, f.ev, page, o.garder);
            if (o.saisonnieres) cmds = si(C.js('Math.random() < 0.5'), H.selon(H.V.saison, f.nouvellesSaison, f.nom), cmds);
            return { titre: o.titre, si: o.si, cmds: cmds };
        });
        var liste;
        try { liste = commentairesGardes(orig.pages[page - 1].list, f.murmure).concat(versListe(H.compiler(fiche))); }
        catch (err) { defauts.push(f.nom + ' : ' + err.message); return; }
        liste.push({ code: 0, indent: 0, parameters: [] });
        controle(f.nom, liste);
        e.pages[page - 1].list = liste;
        // les murmures des autres pages aussi
        e.pages.forEach(function (p, k) { if (k !== page - 1) p.list.forEach(function (c) { if (c.code === 108 && /^text_indicator\s*:\s*Blah Blah Blah\s*$/.test(c.parameters[0])) c.parameters[0] = 'text_indicator : ' + (f.murmure || '…'); }); });
        if (f.horaire) {
            var note = String(orig.note || '').replace(/<Horaire:[^>]*>\s*/i, '');
            e.note = ('<Horaire: ' + f.horaire + '>' + (note ? '\n' + note : ''));
        }
        if (!e.name || /^EV\d+$/.test(e.name)) e.name = f.nom;
        poses++;
    });
    if (lot.tableau) {
        var t = m.events[49], tl = [];
        tl = tl.concat(D.note('◆ HABITANT · le tableau d\'affichage du bar — une affiche de saison, puis une vieille.'));
        tl = tl.concat(A.js('Habitants.prep(this);'), A.se('Book2'));
        tl = tl.concat(H.selon(H.V.saison, lot.tableau.lignes, ''), H.unParmi('', lot.tableau.toujours));
        var liste = commentairesGardes(original(lot.carte, 49).pages[0].list).concat(versListe(tl));
        liste.push({ code: 0, indent: 0, parameters: [] });
        controle('tableau', liste);
        t.pages[0].list = liste;
        if (!t.name || /^EV\d+$/.test(t.name)) t.name = 'Tableau d\'affichage';
        poses++;
    }
});

console.log('   ' + poses + ' habitants posés (carte 46 : bar · carte 44 : auberge) · ' + lignes + ' lignes de dialogue');
if (defauts.length) { console.log('   ✗ ' + defauts.length + ' défaut(s) :\n     ' + defauts.slice(0, 40).join('\n     ')); process.exit(1); }
console.log('   ✓ blocs refermés, scripts et conditions valides, sons présents, lignes à la bonne largeur');
if (!ECRIRE) process.exit(0);

LOTS.forEach(function (lot) { fs.writeFileSync(fichierCarte(lot.carte), JSON.stringify(cartes[lot.carte])); });
var FS = path.join(DATA, 'System.json');
var brut = fs.readFileSync(FS, 'utf8'), SYS = JSON.parse(brut);
function nommer(tab, noms) {
    Object.keys(noms).forEach(function (id) {
        if (tab[id] && !/^◆ /.test(tab[id])) { console.log('   ✗ ' + id + ' porte déjà le nom « ' + tab[id] + ' »'); process.exit(1); }
        tab[id] = noms[id];
    });
}
nommer(SYS.variables, H.NOMS_VAR);
nommer(SYS.switches, BAR.NOMS_SW);
fs.writeFileSync(FS, JSON.stringify(SYS) + (brut.endsWith('\n') ? '\n' : ''));
console.log('   écrit : cartes 44 et 46, variables 880–885 et interrupteurs 886–887 nommés « ◆ … »');
