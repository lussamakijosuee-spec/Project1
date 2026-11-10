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
 *   … --seulement les_voix_de_la_bible.js                → ne pose que ce lot
 *     (les autres habitants ne sont pas réécrits : JOKO a pu retoucher leurs
 *     pages dans l'éditeur)
 *   … --fiches 29:28,43:3                                  → ne pose que ces fiches
 *   … --ecarts                                             → montre, sans rien
 *     écrire, ce qui a été retouché à la main dans chaque page
 *   … --ecrire --sortie <dossier>                          → écrit les cartes
 *     dans ce dossier, pas dans data/ (les bancs regardent ce que l'outil
 *     ferait, sans rien toucher)
 *
 * CE QUE JOKO A VOULU (2026-11-09, bancs/outils/voulu.js) : les événements
 * qu'il veut tels qu'il les a laissés ne sont jamais réécrits.
 *
 * CE QUI EST À JOKO DANS UNE PAGE DÉJÀ POSÉE (2026-10-30). Il réécrit les
 * rôles et les voix dans l'en-tête (« ◆ HABITANT · Hilde — mère de 2
 * enfants… »), il ajoute ses notes (la personnalité de Colette, celle d'Emma,
 * d'Edwin…). L'outil garde cet en-tête TEL QUEL, ligne pour ligne, et garde
 * aussi les commentaires qu'il a ajoutés avant lui ; seules les balises de
 * l'outil (<Agenda:>, <Va:>, <Logis:>, <Ronde:>, <Est:>, <Vie:>, <Soiree:>)
 * suivent la fiche.
 *
 * Une carte retirée (le Village Montagnard, 36, le 2026-10-29) se dit et se
 * saute. Une fiche « muet: true » vise une page MUETTE (rien, ou seulement
 * des commentaires) : elle peut la remplir la première fois ; une page qui
 * parle sans la marque « ◆ HABITANT » reste à JOKO.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var DATA = path.join(RACINE, 'data');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var iSeul = process.argv.indexOf('--seulement'), SEULEMENT = iSeul >= 0 ? process.argv[iSeul + 1] : null;
var iFi = process.argv.indexOf('--fiches'), FICHES = iFi >= 0 ? String(process.argv[iFi + 1]).split(',') : null;
var ECARTS = process.argv.indexOf('--ecarts') >= 0;
var iSo = process.argv.indexOf('--sortie'), SORTIE = iSo >= 0 ? path.resolve(process.argv[iSo + 1]) : null;
var VOULU = require('./voulu.js');
var D = require('./recettes/dsl.js');
var H = require('./habitants/moteur.js');
var COMMUNS = require('./habitants/_communs.js');
var A = D.A, C = D.C, si = D.si, cat = D.cat;

// chaque fichier de habitants/ (sauf le moteur) est un lot : { carte, fiches, tableau?, NOMS_SW? }
var LOTS = fs.readdirSync(path.join(__dirname, 'habitants')).filter(function (x) { return /\.js$/.test(x) && x !== 'moteur.js' && x.charAt(0) !== '_'; }).sort()
    .filter(function (x) { return !SEULEMENT || x === SEULEMENT; })
    .map(function (x) { return require('./habitants/' + x); });
if (SEULEMENT && !LOTS.length) { console.log('   ✗ aucun lot « ' + SEULEMENT + ' » dans habitants/'); process.exit(1); }
var BAR = LOTS.filter(function (l) { return l.carte === 46; })[0];
// les personnages, comme des OC (2026-10-30) : habitants/oc/*.js, une entrée « carte:événement » (« /2 » : sa page 2)
// qui s'ajoute à la fiche ; une page <Est: 29:28> reçoit celle de 29:28 (c'est la même personne)
var DOS_OC = path.join(__dirname, 'habitants', 'oc'), OC = {};
if (fs.existsSync(DOS_OC)) fs.readdirSync(DOS_OC).filter(function (x) { return /\.js$/.test(x); }).sort().forEach(function (x) {
    var t = require(path.join(DOS_OC, x));
    Object.keys(t).forEach(function (k) { if (OC[k]) throw new Error('oc/' + x + ' : ' + k + ' a déjà sa fiche'); OC[k] = t[k]; });
});
function ocDe(f) {
    var k = f.carte + ':' + f.ev + ((f.page || 1) > 1 ? '/' + f.page : '');
    if (OC[k]) return OC[k];
    var est = (f.tags || []).map(function (t) { return /<Est:\s*(\d+:\d+)\s*>/i.exec(t); }).filter(Boolean)[0];
    return est ? OC[est[1]] || null : null;
}
// la situation (2026-10-30 : « en Aurevel, dans les campagnes, avec une faille à côté ») : habitants/situation/*.js,
// des lignes qui s'AJOUTENT à la fiche (nouvelles, lieux…), jamais à la place
var DOS_SIT = path.join(__dirname, 'habitants', 'situation'), SITUATION = {};
if (fs.existsSync(DOS_SIT)) fs.readdirSync(DOS_SIT).filter(function (x) { return /\.js$/.test(x); }).sort().forEach(function (x) {
    var t = require(path.join(DOS_SIT, x));
    Object.keys(t).forEach(function (k) { (SITUATION[k] = SITUATION[k] || []).push(t[k]); });
});
function situationDe(f) {
    var k = f.carte + ':' + f.ev + ((f.page || 1) > 1 ? '/' + f.page : '');
    if (SITUATION[k]) return SITUATION[k];
    var est = (f.tags || []).map(function (t) { return /<Est:\s*(\d+:\d+)\s*>/i.exec(t); }).filter(Boolean)[0];
    return est ? SITUATION[est[1]] || [] : [];
}
// la refonte (2026-11-09 ; JOKO : « beaucoup plus humains et beaucoup plus sentimentaux », docs/PNJ_LA_BASE.md) :
// habitants/refonte/*.js, une entrée « carte:événement » qui se pose PAR-DESSUS la fiche (lot + oc + situation) :
// ses clés remplacent celles de la fiche (« oc » champ par champ ; « options » s'ajoutent à celles qui gardent
// une boutique ou une quête de JOKO) ; une page <Est: 29:28> reçoit celle de 29:28
var DOS_REF = path.join(__dirname, 'habitants', 'refonte'), REFONTE = {};
if (fs.existsSync(DOS_REF)) fs.readdirSync(DOS_REF).filter(function (x) { return /\.js$/.test(x); }).sort().forEach(function (x) {
    var t = require(path.join(DOS_REF, x));
    Object.keys(t).forEach(function (k) { if (REFONTE[k]) throw new Error('refonte/' + x + ' : ' + k + ' est déjà refait'); REFONTE[k] = t[k]; });
});
function refonteDe(f) {
    var k = f.carte + ':' + f.ev + ((f.page || 1) > 1 ? '/' + f.page : '');
    if (REFONTE[k]) return REFONTE[k];
    var est = (f.tags || []).map(function (t) { return /<Est:\s*(\d+:\d+)\s*>/i.exec(t); }).filter(Boolean)[0];
    return est ? REFONTE[est[1]] || null : null;
}
var NOMS_DE = {};
LOTS.forEach(function (lot) { lot.fiches.forEach(function (f) { NOMS_DE[(f.carte || lot.carte) + ':' + f.ev + ((f.page || 1) > 1 ? '/' + f.page : '')] = f.nom; }); });
// le crieur annonce les anniversaires (P6) : ceux de toutes les fiches OC
var ANNIVERSAIRES = Object.keys(OC).filter(function (k) { return OC[k].anniversaire && NOMS_DE[k]; })
    .map(function (k) { return { md: OC[k].anniversaire, nom: NOMS_DE[k] }; });
var FSNAP = path.join(__dirname, 'habitants', 'originaux.json');
function fichierCarte(n) { return path.join(DATA, 'Map' + String(n).padStart(3, '0') + '.json'); }
function existe(n) { return fs.existsSync(fichierCarte(n)); }
var cartes = {};
function carteDe(n) { return cartes[n] || (cartes[n] = JSON.parse(fs.readFileSync(fichierCarte(n), 'utf8'))); }
LOTS.forEach(function (lot) { lot.fiches.forEach(function (f) { f.carte = f.carte || lot.carte; if (existe(f.carte)) { carteDe(f.carte); } }); });

/* ── l'instantané des événements de JOKO : chaque événement est photographié
 *    la PREMIÈRE fois qu'une fiche le vise, puis jamais réécrit ────────── */
var snap = fs.existsSync(FSNAP) ? JSON.parse(fs.readFileSync(FSNAP, 'utf8')) : {}, nouveauxClichés = 0;
LOTS.forEach(function (lot) {
    var ids = lot.fiches.map(function (f) { return [f.carte, f.ev]; }).concat(lot.tableau ? [[lot.carte, 49]] : []);
    ids.filter(function (x) { return existe(x[0]); }).forEach(function (x) { var k = x[0] + ':' + x[1], e = carteDe(x[0]).events[x[1]]; if (e && !snap[k]) { snap[k] = JSON.parse(JSON.stringify(e)); nouveauxClichés++; } });
});
if (nouveauxClichés) { fs.writeFileSync(FSNAP, JSON.stringify(snap, null, 1)); console.log('   instantané : ' + nouveauxClichés + ' événement(s) d\'origine photographié(s) dans ' + path.relative(RACINE, FSNAP)); }
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

/* ── l'en-tête de JOKO ─────────────────────────────────────────────────── */
var BALISE_OUTIL = /^<(Agenda|Soir[ée]e|Vie|Logis|Va|Ronde|Est)\b/i;
function enTete(liste) {                  // les commentaires de tête, coupés à la marque
    var avant = [], marque = [], i = 0;
    for (; i < liste.length && (liste[i].code === 108 || liste[i].code === 408); i++) {
        if (liste[i].code === 108 && MARQUE.test(liste[i].parameters[0])) break;
        avant.push(liste[i]);
    }
    for (; i < liste.length && (liste[i].code === 108 || liste[i].code === 408); i++) {
        if (liste[i].code === 108 && /^Généré par bancs\/outils/.test(liste[i].parameters[0])) break;
        marque.push(liste[i]);
    }
    return { avant: avant, marque: marque };
}
function memeTexte(a, b) { return a.code === b.code && String(a.parameters[0]) === String(b.parameters[0]); }

/* ── qui est dans cet événement ? (sa page : la ligne « ◆ FICHE », sinon « ◆ HABITANT », sinon son nom)
 *    La règle est dans qui_est_la.js : les bancs du village la lisent aussi. ── */
var Q = require('./qui_est_la.js');
var norme = Q.norme, quiEst = Q.quiEst;
function cestLui(q, f) { var orig = snap[f.carte + ':' + f.ev]; return Q.cestLui(q, f.nom, orig ? orig.name : undefined); }  // « ◆ HABITANT · Yvon — Edwin Bramble… » : c'est bien Edwin

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
var repris = [];
LOTS.forEach(function (lot) {
    lot.fiches.forEach(function (f) {
        if (FICHES && FICHES.indexOf(f.carte + ':' + f.ev) < 0) return;
        if (!existe(f.carte)) { repris.push('carte ' + f.carte + ' (' + f.nom + ') : la carte n\'existe plus'); return; }
        var m = carteDe(f.carte), e = m.events[f.ev];
        // ⚠ 2026-10-02 : JOKO a retiré Gaston (carte 29, év. 27) et repris deux
        //   habitants du bar (év. 28 « vesper », év. 48 « colidia »). Un
        //   événement retiré, ou une page qui ne porte plus la marque
        //   « ◆ HABITANT », est à JOKO : on ne la réécrit jamais, on le dit.
        if (!e) { repris.push('carte ' + f.carte + ' év. ' + f.ev + ' (' + f.nom + ') : retiré par JOKO'); return; }
        // ⚠ 2026-11-09 : ce qu'il a voulu tel quel (voulu.js) — même si c'est toujours cette personne
        if (VOULU.est(f.carte, f.ev)) { repris.push('carte ' + f.carte + ' év. ' + f.ev + ' (' + f.nom + ') : voulu tel quel par JOKO (' + VOULU.quand + '), pas réécrit'); return; }
        // ⚠ 2026-11-01 (« FGFG ») : JOKO réutilise des numéros — 30:16 est devenu sa Fanchon, 30:26 une marque « kaze »,
        //   46:49 une marque « colette ». On n'écrit que dans un événement qui est toujours CETTE personne.
        var qui = quiEst(e, f.page || 1);
        if (qui && !cestLui(qui, f)) { repris.push('carte ' + f.carte + ' év. ' + f.ev + ' (fiche ' + f.nom + ') : c\'est maintenant « ' + qui.nom + ' », pas réécrit'); return; }
        var page = f.page || 1, orig = original(f.carte, f.ev);
        if (!e.pages[page - 1]) { defauts.push(f.nom + ' : pas de page ' + page); return; }
        // une fiche « muet: true » vise une page qui n'avait encore rien à dire : elle peut la remplir la première fois
        var muette = f.muet && e.pages[page - 1].list.every(function (c) { return c.code === 0 || c.code === 108 || c.code === 408; });
        // ⚠ 2026-11-09 : « accord » — JOKO a dit de faire de SON événement un habitant (le Pêcheur, 33:31, « tout »).
        //   Seulement la première fois, et seulement s'il porte toujours son nom : ensuite, la page a sa marque « ◆ HABITANT ».
        var accord = f.accord && String(e.name || '').trim() === f.accord.nom;
        if (!muette && !accord && !e.pages[page - 1].list.some(function (c) { return c.code === 108 && /^◆ HABITANT ·/.test(c.parameters[0]); })) { repris.push('carte ' + f.carte + ' év. ' + f.ev + ' « ' + e.name + ' » (fiche ' + f.nom + ') : repris par JOKO, pas réécrit'); return; }
        var fiche = Object.assign({}, f);
        var oc = ocDe(f);
        if (oc) Object.keys(oc).forEach(function (k) {
            if (k === 'plus') Object.keys(oc.plus).forEach(function (j) { fiche[j] = [].concat(fiche[j] || [], oc.plus[j]); });
            else fiche[k] = oc[k];
        });
        situationDe(f).forEach(function (s) {
            Object.keys(s).forEach(function (j) {
                if (Array.isArray(s[j])) fiche[j] = [].concat(fiche[j] || [], s[j]);
                else { var o = fiche[j] = Object.assign({}, fiche[j] || {}); Object.keys(s[j]).forEach(function (l) { o[l] = [].concat(o[l] || [], s[j][l]); }); }
            });
        });
        var R = refonteDe(f);
        if (R) Object.keys(R).forEach(function (j) {
            if (j === 'oc') fiche.oc = Object.assign({}, fiche.oc || {}, R.oc);
            else if (j === 'options') fiche.options = (fiche.options || []).filter(function (o) { return o.garder; }).concat(R.options);
            else fiche[j] = R[j];
        });
        if (fiche.annonceAnniversaires && ANNIVERSAIRES.length) fiche.apresAccueil = cat(f.apresAccueil || [], cat.apply(null, ANNIVERSAIRES.map(function (a) {
            return si(C.js("Habitants.anniversaire('" + a.md + "')"), H.unParmi(f.nom, [].concat(f.annonceAnniversaires === true ? ['Oyez ! Aujourd\'hui, c\'est l\'anniversaire de %1 ! Un sourire, un mot gentil, ça ne coûte rien !'] : f.annonceAnniversaires).map(function (t) { return t.replace('%1', a.nom); })));
        })));
        // le temps qu'il fait : sa propre voix, sinon celle de son milieu
        if (!fiche.meteo && COMMUNS.LIEU_DE_CARTE[f.carte]) fiche.meteo = COMMUNS.METEO[COMMUNS.LIEU_DE_CARTE[f.carte]];
        fiche.options = (fiche.options || []).map(function (o) {
            if (!o.garder) return o;
            var cmds = extraire(f.carte, f.ev, o.page || page, o.garder);
            if (o.saisonnieres) cmds = si(C.js('Math.random() < 0.5'), H.selon(H.V.saison, f.nouvellesSaison, f.nom), cmds);
            return { titre: o.titre, si: o.si, cmds: cmds };
        });
        var liste;
        var tags = (f.tags || []).map(function (t) { return { code: 108, indent: 0, parameters: [t] }; });
        var gardes = orig.pages[page - 1] ? commentairesGardes(orig.pages[page - 1].list, f.murmure) : [];
        try { liste = gardes.concat(tags, versListe(H.compiler(fiche))); }
        catch (err) { defauts.push(f.nom + ' : ' + err.message); return; }
        // son visage (le Pêcheur de JOKO parlait avec « jkj ») : sur chaque boîte où c'est lui qui parle
        if (fiche.visage) liste.forEach(function (c, k) {
            var n = liste[k + 1];
            if (c.code === 101 && c.parameters[0] === '' && c.parameters[2] === 0 && n && n.code === 401 && String(n.parameters[0]).indexOf('\\n<' + fiche.nom + '>') === 0) {
                c.parameters[0] = fiche.visage[0]; c.parameters[1] = fiche.visage[1] || 0;
            }
        });
        // ce que JOKO a écrit dans la page posée : son en-tête, ses commentaires ajoutés
        var avant = enTete(e.pages[page - 1].list), neuf = enTete(liste);
        var ajouts = avant.avant.filter(function (c) {
            return !BALISE_OUTIL.test(String(c.parameters[0]).trim()) && !gardes.concat(tags).some(function (g) { return memeTexte(g, c); });
        });
        if (ajouts.length || (!muette && avant.marque.length)) {
            var reste = liste.slice(neuf.avant.length + neuf.marque.length);
            liste = neuf.avant.concat(ajouts, !muette && avant.marque.length ? avant.marque : neuf.marque, reste);
        }
        liste.push({ code: 0, indent: 0, parameters: [] });
        controle(f.nom, liste);
        if (ECARTS) {
            var txt = function (l) { return l.filter(function (c) { return [101, 401, 108, 408, 102, 402, 355, 111].indexOf(c.code) >= 0; }).map(function (c) { return c.code + ' ' + JSON.stringify(c.parameters); }); };
            var a = txt(e.pages[page - 1].list), b = txt(liste), sa = {}, sb = {};
            a.forEach(function (x) { sa[x] = 1; }); b.forEach(function (x) { sb[x] = 1; });
            var plus = a.filter(function (x) { return !sb[x]; }), moins = b.filter(function (x) { return !sa[x]; });
            if (plus.length || moins.length) {
                console.log('   ### ' + f.carte + ':' + f.ev + ' ' + f.nom + ' — retouché à la main : ' + plus.length + ' ligne(s) que la fiche n\'écrit pas');
                plus.forEach(function (x) { console.log('      page  ' + x.slice(0, 200)); });
                moins.forEach(function (x) { console.log('      fiche ' + x.slice(0, 200)); });
            }
            return;
        }
        e.pages[page - 1].list = liste;
        // les murmures des autres pages aussi
        e.pages.forEach(function (p, k) { if (k !== page - 1) p.list.forEach(function (c) { if (c.code === 108 && /^text_indicator\s*:\s*Blah Blah Blah\s*$/.test(c.parameters[0])) c.parameters[0] = 'text_indicator : ' + (f.murmure || '…'); }); });
        if (f.horaire || f.passage || f.note) {
            var note = String(orig.note || '').replace(/<Horaire:[^>]*>\s*/i, '').replace(/<Passage>\s*/i, '').replace(/<Admission>\s*/i, '');
            var tete = (f.horaire ? '<Horaire: ' + f.horaire + '>' : f.passage ? '<Passage>' : '') + (f.note ? (f.horaire || f.passage ? '\n' : '') + f.note : '');
            e.note = tete + (note ? '\n' + note : '');
        }
        if (!e.name || /^EV\d+$/.test(e.name)) e.name = f.nom;
        poses++;
    });
    // le tableau d'affichage du bar : seulement s'il est toujours là (le 2026-11-01, JOKO a fait du 46:49 une marque « colette »)
    var t49 = lot.tableau ? carteDe(lot.carte).events[49] : null;
    if (lot.tableau && t49 && !/tableau|^ev\d+$/i.test(String(t49.name).trim()) && !t49.pages[0].list.some(function (c) { return c.code === 108 && /^◆ HABITANT · le tableau/.test(c.parameters[0]); })) {
        repris.push('carte ' + lot.carte + ' év. 49 (le tableau d\'affichage) : c\'est maintenant « ' + String(t49.name).trim() + ' », pas réécrit');
    } else if (lot.tableau && !FICHES && !ECARTS) {
        var m = carteDe(lot.carte), t = m.events[49], tl = [];
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

var parCarte = {};
LOTS.forEach(function (lot) { lot.fiches.forEach(function (f) { parCarte[f.carte] = (parCarte[f.carte] || 0) + 1; }); });
console.log('   ' + poses + ' habitants posés (' + Object.keys(parCarte).map(function (k) { return 'carte ' + k + ' : ' + parCarte[k]; }).join(' · ') + ') · ' + lignes + ' lignes de dialogue');
if (repris.length) console.log('   ⚑ laissés à JOKO :\n     ' + repris.join('\n     '));
if (defauts.length) { console.log('   ✗ ' + defauts.length + ' défaut(s) :\n     ' + defauts.slice(0, 40).join('\n     ')); process.exit(1); }
console.log('   ✓ blocs refermés, scripts et conditions valides, sons présents, lignes à la bonne largeur');
if (!ECRIRE || ECARTS) process.exit(0);

// au format de l'éditeur (un événement par ligne) : les commits de JOKO
// restent lisibles, et un diff montre l'événement qui a changé
function formatCarte(m) {
    var props = Object.keys(m).filter(function (k) { return k !== 'data' && k !== 'events'; }).map(function (k) { return JSON.stringify(k) + ':' + JSON.stringify(m[k]); }).join(',');
    return '{\n' + props + ',\n"data":' + JSON.stringify(m.data) + ',\n"events":[\n' + m.events.map(function (e) { return JSON.stringify(e); }).join(',\n') + '\n]\n}';
}
var DEST = SORTIE || DATA;
if (SORTIE && !fs.existsSync(SORTIE)) fs.mkdirSync(SORTIE, { recursive: true });
Object.keys(cartes).forEach(function (n) { fs.writeFileSync(path.join(DEST, path.basename(fichierCarte(n))), formatCarte(cartes[n])); });
var FS = path.join(DATA, 'System.json');
var brut = fs.readFileSync(FS, 'utf8'), SYS = JSON.parse(brut);
function nommer(tab, noms) {
    Object.keys(noms).forEach(function (id) {
        if (tab[id] && !/^◆ /.test(tab[id])) { console.log('   ✗ ' + id + ' porte déjà le nom « ' + tab[id] + ' »'); process.exit(1); }
        tab[id] = noms[id];
    });
}
nommer(SYS.variables, H.NOMS_VAR);
LOTS.forEach(function (lot) { if (lot.NOMS_SW) nommer(SYS.switches, lot.NOMS_SW); });
fs.writeFileSync(path.join(DEST, 'System.json'), JSON.stringify(SYS) + (brut.endsWith('\n') ? '\n' : ''));
console.log('   écrit' + (SORTIE ? ' dans ' + SORTIE : '') + ' : cartes ' + Object.keys(cartes).join(', ') + ' ; variables 880–885 et interrupteurs ◆ nommés');
