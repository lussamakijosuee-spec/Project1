/*
 * BANC — MAHORAGA v3, KEVÉRATUS VULTRIC : SES RÉGLAGES ET SES FICHES
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-03 : rework de Mahoraga, « plus intéressant et plus simple
 * aussi car au final noyé de concept c'est pas bon » — Kevératus Vultric, la
 * Roue des trois arts, la Bête à 50 %, un jeu d'attaques neuf. Le combat se
 * joue dans navigateur/la_roue_de_keveratus.js ; ici, ce qui peut casser SANS
 * UN MOT avant même que le combat commence :
 *
 *  · le plugin n'est pas chargé (le boss se battrait comme un ennemi ordinaire) ;
 *  · la Roue mal réglée : un cran qui ne baisse pas, un premier cran qui n'est
 *    pas plein, la Bête hors de 1-99 % ;
 *  · sa Réponse ou le Traqué pointent sur une fiche vide ;
 *  · un son réglé n'existe pas dans audio/se ;
 *  · personne ne porte <Mahoraga>, ou ses attaques ont perdu leur rythme : la
 *    Chasse, la mise en garde (<Telegraphe>) et la frappe qui l'attend (état
 *    ⚡ Charge 207, <Apres: surcharge>).
 *
 * Et chaque sabotage, plus bas, doit faire tomber SON contrôle.
 *
 *   node bancs/16_mahoraga.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');
var L = function (n) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', n + '.json'), 'utf8')); };

// ── le plugin, tel que js/plugins.js le règle ───────────────────────────────
var ENTREE = (function () {
    var src = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
    var bac = {};
    (new Function('$plugins', 'bac', src.replace(/^\s*var\s+\$plugins\s*=/, '$plugins =') +
        '\n;bac.p = $plugins;'))(null, bac);
    return bac.p.filter(function (x) { return x.name === 'MahoragaBoss'; })[0];
})();

function nombres(s) { return String(s || '').split(',').map(function (x) { return Number(x.trim()); }); }
function sonExiste(n) { return !n || ['.ogg', '.m4a'].some(function (e) { return fs.existsSync(path.join(RACINE, 'audio', 'se', n + e)); }); }

function controles(P, S, St, E) {
    var c = [];
    var crans = nombres(P.crans || '1, 0.7, 0.4, 0.1'), bete = nombres(P.cransBete || '1, 0.5, 0.1');
    function roueJuste(l) { return l.length >= 2 && l[0] === 1 && l.every(function (x, i) { return isFinite(x) && x >= 0 && (i === 0 || x < l[i - 1]); }); }
    c.push(['la Roue : ×1 d\'abord, puis chaque cran baisse', roueJuste(crans), crans.join(' → ')]);
    c.push(['la Roue de la Bête aussi, et elle s\'adapte plus vite', roueJuste(bete) && bete.length <= crans.length, bete.join(' → ')]);
    var seuil = Number(P.seuilBete || 50);
    c.push(['la Bête arrive entre 1 et 99 % de ses PV', seuil >= 1 && seuil <= 99, seuil + ' %']);
    var rep = S[Number(P.reponse || 1325)];
    c.push(['sa Réponse est une vraie attaque', !!(rep && rep.name && rep.damage && rep.damage.type === 1 && rep.scope === 1), rep ? rep.id + ' ' + rep.name : 'aucune']);
    var tr = St[Number(P.traque || 278)];
    c.push(['le Traqué existe et attire les coups (TGR)', !!(tr && tr.name && tr.traits.some(function (t) { return t.code === 23 && t.dataId === 0 && t.value > 1; })), tr ? tr.name : 'aucun']);
    var sons = ['sonRoue', 'sonAdapte', 'sonBete'].filter(function (k) { return !sonExiste(P[k]); });
    c.push(['chaque son réglé existe dans audio/se', sons.length === 0, sons.length ? 'manquent : ' + sons.map(function (k) { return P[k]; }).join(', ') : 'tous sur le disque']);
    var porteurs = E.filter(function (e) { return e && /<Mahoraga>/i.test(e.note || ''); });
    c.push(['au moins un ennemi porte <Mahoraga>', porteurs.length > 0, porteurs.map(function (e) { return e.id + ' ' + e.name; }).join(', ')]);
    porteurs.forEach(function (e) {
        var acts = e.actions.map(function (a) { return S[a.skillId]; });
        var chasse = acts.some(function (s) { return s && s.meta !== undefined ? s.meta.Chasse : /<Chasse>/.test(s && s.note || ''); });
        var tele = acts.some(function (s) { return s && /<Telegraphe>/i.test(s.note || ''); });
        var frappe = e.actions.some(function (a) { var s = S[a.skillId]; return s && /<Apres\s*:\s*surcharge>/i.test(s.note || '') && a.conditionType === 4 && a.conditionParam1 === 207; });
        c.push([e.name + ' : chaque attaque existe', acts.every(function (s) { return s && s.name; }), e.actions.map(function (a) { return a.skillId; }).join(', ')]);
        c.push([e.name + ' : il chasse, il s\'annonce, et la frappe attend sa ⚡ Charge', chasse && tele && frappe, [chasse ? 'Chasse' : '—', tele ? 'Telegraphe' : '—', frappe ? 'frappe sur Charge' : '—'].join(' · ')]);
    });
    return c;
}

var ok = 0, ko = 0;
function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }

console.log('\n1) Le plugin et la vraie base');
V('MahoragaBoss est inscrit et allumé', !!(ENTREE && ENTREE.status));
var P = ENTREE ? ENTREE.parameters : {}, S = L('Skills'), St = L('States'), E = L('Enemies');
var vrais = controles(P, S, St, E);
vrais.forEach(function (x) { V(x[0], x[1], x[2]); });
var radahn = E.filter(function (e) { return e && /<Radahn>/i.test(e.note || ''); });
console.log('   · le bloc <Radahn> (Kev, la pluie de météores) ' + (radahn.length ? 'a son porteur : ' + radahn.map(function (e) { return e.name; }).join(', ') : 'n\'a plus de porteur (JOKO a retiré la balise) : il dort'));

// ── contre-épreuves : chaque sabotage fait tomber SON contrôle ──────────────
console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
function copie(x) { return JSON.parse(JSON.stringify(x)); }
function tombe(nom, P2, S2, St2, E2, motif) {
    var l = controles(P2, S2, St2, E2);
    var cible = l.filter(function (x) { return x[0].indexOf(motif) >= 0; })[0];
    V(nom + '  →  « ' + motif + ' » tombe', cible && !cible[1]);
}
var P1 = copie(P); P1.crans = '1, 0.7, 0.9, 0.1';
tombe('un cran qui remonte', P1, S, St, E, 'chaque cran baisse');
var P2 = copie(P); P2.reponse = '9999';
tombe('la Réponse sur une fiche vide', P2, S, St, E, 'sa Réponse');
var P3 = copie(P); P3.sonAdapte = 'nexiste_pas';
tombe('un son qui n\'existe pas', P3, S, St, E, 'chaque son réglé');
var E4 = copie(E); E4.forEach(function (e) { if (e) e.note = (e.note || '').replace(/<Mahoraga>/ig, ''); });
tombe('<Mahoraga> retiré à tous', P, S, St, E4, 'au moins un ennemi');
var E5 = copie(E), porteur = E5.filter(function (e) { return e && /<Mahoraga>/i.test(e.note || ''); })[0];
if (porteur) {
    porteur.actions.forEach(function (a) { if (a.conditionType === 4) a.conditionType = 0; });
    tombe('sa frappe qui n\'attend plus sa Charge', P, S, St, E5, 'la frappe attend');
}

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
