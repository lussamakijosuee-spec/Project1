/*
 * QUI EST LÀ ? — la règle d'identité de l'outil des habitants, pour l'outil et pour les bancs
 * ---------------------------------------------------------------------------
 * JOKO change ses cartes dans l'éditeur : il retire des PNJ, il reprend des
 * numéros pour d'autres (« FGFG », 2026-11-01 : 30:16 est devenu sa Fanchon,
 * 30:26 une marque « kaze »), il garde des pages telles qu'il les a laissées
 * (bancs/outils/voulu.js, 2026-11-09). poser_les_habitants.js ne réécrit que
 * l'événement qui est TOUJOURS la personne de la fiche ; les bancs du village
 * ne demandent qu'à elle ce que l'outil y a écrit. Une seule règle, ici :
 *
 *   qui est dans cette page ?  sa ligne « ◆ FICHE · Nom », sinon « ◆ HABITANT
 *   · Nom — … », sinon (page vide) le nom de l'événement ;
 *   est-ce lui ?               « ◆ HABITANT · Yvon — Edwin Bramble… » est bien
 *   Edwin ; une page vide nommée « EV012 », ou du nom de l'événement d'origine
 *   (habitants/originaux.json), aussi.
 *
 *   var Q = require('./qui_est_la.js');
 *   Q.etat({ carte: 29, ev: 28, nom: 'Hilde' })  → { la: true }
 *                                                 → { la: false, pourquoi: 'retiré par JOKO' | … }
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var VOULU = require('./voulu.js');

function norme(t) { return String(t || '').toLowerCase().replace(/\s+/g, ' ').trim(); }
function quiEst(e, page) {
    var p = e.pages[(page || 1) - 1]; if (!p) return null;
    var tete = p.list.filter(function (c) { return c.code === 108; }).map(function (c) { return String(c.parameters[0]); });
    var fi = tete.filter(function (t) { return /^◆ FICHE · /.test(t); })[0], ha = tete.filter(function (t) { return /^◆ HABITANT · /.test(t); })[0];
    if (fi) return { nom: fi.replace(/^◆ FICHE · /, '').split(' — ')[0].trim(), ligne: fi, sur: 'fiche' };
    if (ha) return { nom: ha.replace(/^◆ HABITANT · /, '').split(' — ')[0].trim(), ligne: ha, sur: 'en-tête' };
    var vide = p.list.every(function (c) { return c.code === 0 || c.code === 108 || c.code === 408; });
    return vide ? { nom: String(e.name || '').trim(), ligne: e.name, sur: 'nom', vide: true, id: e.id } : null;
}
// nomOrigine : le nom de l'événement dans l'instantané d'origine (habitants/originaux.json), s'il y en a un
function cestLui(q, nom, nomOrigine) {
    var n = norme(nom);
    if (q.sur !== 'nom') return norme(q.ligne).indexOf(n) >= 0;
    return norme(q.nom) === n || /^ev\d+$/i.test(q.nom) || (nomOrigine !== undefined && nomOrigine !== null && norme(nomOrigine) === norme(q.nom));
}

var cartes = {}, snap = null;
function carte(n) {
    if (cartes[n] !== undefined) return cartes[n];
    var f = path.join(RACINE, 'data', 'Map' + String(n).padStart(3, '0') + '.json');
    return (cartes[n] = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
}
function origine(k) {
    if (!snap) { var f = path.join(__dirname, 'habitants', 'originaux.json'); snap = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {}; }
    return snap[k] ? snap[k].name : undefined;
}
/* Ce que l'outil des habitants ferait de cette fiche, dans le même ordre que lui.
 *   f : { carte, ev, nom, page?, muet? } ; m (facultatif) : la carte déjà lue (un banc peut la changer en mémoire) */
function etat(f, m) {
    m = m || carte(f.carte);
    if (!m) return { la: false, pourquoi: 'la carte n\'existe plus' };
    var e = m.events[f.ev];
    if (!e) return { la: false, pourquoi: 'retiré par JOKO' };
    if (VOULU.est(f.carte, f.ev)) return { la: false, pourquoi: 'voulu tel quel', voulu: true };
    var page = f.page || 1, q = quiEst(e, page);
    if (q && !cestLui(q, f.nom, origine(f.carte + ':' + f.ev))) return { la: false, pourquoi: 'c\'est maintenant « ' + q.nom + ' »' };
    var p = e.pages[page - 1];
    if (!p) return { la: false, pourquoi: 'pas de page ' + page };
    var muette = f.muet && p.list.every(function (c) { return c.code === 0 || c.code === 108 || c.code === 408; });
    if (!muette && !p.list.some(function (c) { return c.code === 108 && /^◆ HABITANT ·/.test(c.parameters[0]); })) return { la: false, pourquoi: 'repris par JOKO' };
    return { la: true };
}
// toutes les fiches des lots (bancs/outils/habitants/*.js), par « carte:événement » (« /2 » pour une page 2)
function fiches() {
    var D = path.join(__dirname, 'habitants'), r = {};
    fs.readdirSync(D).filter(function (x) { return /\.js$/.test(x) && !/^(moteur|_)/.test(x); }).forEach(function (x) {
        var l = require(path.join(D, x));
        l.fiches.forEach(function (f) {
            var g = Object.assign({}, f, { carte: f.carte || l.carte });
            r[g.carte + ':' + g.ev + ((g.page || 1) > 1 ? '/' + g.page : '')] = g;
        });
    });
    return r;
}
// la refonte (habitants/refonte/*.js) : ce qui se pose par-dessus une fiche, par « carte:événement »
function refonte() {
    var D = path.join(__dirname, 'habitants', 'refonte'), r = {};
    if (fs.existsSync(D)) fs.readdirSync(D).filter(function (x) { return /\.js$/.test(x); }).forEach(function (x) { Object.assign(r, require(path.join(D, x))); });
    return r;
}
module.exports = { norme: norme, quiEst: quiEst, cestLui: cestLui, etat: etat, fiches: fiches, refonte: refonte, carte: carte, VOULU: VOULU };
