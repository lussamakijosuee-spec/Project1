/*
 * BANC — L'ÉCRIT, C'EST LE MANA SPIRITUEL (2026-10-25)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-25 : « ce système de marque s'applique que aux techniques
 * qui [coûtent] les PV, sauf que c'est pas ça. Non, ça s'applique que aux
 * techniques du mana spirituel. Pas ceux qui [coûtent] les PV. Tout ce qui est
 * mana spirituel, faut utiliser ces PV pour l'utiliser. Et il y a le système.
 * Parce que, par exemple, pour Vesper, une de ses attaques qui est clairement
 * physique [est] utilisée comme si c'était du mana spirituel. »
 *
 * L'attaque, c'était Saignée Continue (élément Physique, coup physique) : le
 * paquet des verbes l'avait rangée dans l'écrit (<Art: ecrit>, 7 % de PV). Elle
 * redevient un mouvement à 20 PT, et LesTroisArts refuse désormais l'écrit à
 * toute technique d'élément Physique ou de l'attaque (elementsJamaisEcrit).
 * Les techniques de l'âme de ludwing qui se payaient en PM passent en PV.
 *
 * Ce banc lit data/ et charge LesTroisArts tel quel ; il vérifie dans les deux
 * sens, et chaque contrôle tombe sur une base sabotée exprès :
 *   1. aucun écrit d'un héros n'est un coup physique ;
 *   2. Saignée Continue est un mouvement, à 20 PT, avec sa description de JOKO ;
 *   3. tout écrit d'un héros se paie en PV, et seulement en PV (sauf ce qu'un
 *      ennemi utilise, et Transfusion d'Âme Blanche, qui prend ses PV par son
 *      effet — une formule à caractère) ;
 *   4. dans l'autre sens : toute technique d'un héros au mana spirituel (élément
 *      2 ou 7) est un écrit, et un écrit spirituel le reste.
 *
 *   node bancs/25_lecrit_est_spirituel.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');
function lire(f) { return fs.readFileSync(path.join(RACINE, f), 'utf8'); }

var $plugins = eval(lire('js/plugins.js').replace(/^[\s\S]*?var \$plugins\s*=/, '(').replace(/;\s*$/, ')'));
global.PluginManager = { parameters: function (n) { var p = $plugins.find(function (x) { return x.name === n; }); return p ? p.parameters : {}; } };
global.DataManager = { isSkill: function (x) { return !!x && x._competence === true; } };
['Game_Action', 'Window_SkillList', 'Game_BattlerBase', 'Game_Actor'].forEach(function (k) { global[k] = function () {}; global[k].prototype = {}; });
eval(lire('js/plugins/LesTroisArts.js').replace('var LesTroisArts = LesTroisArts || {};', 'global.LesTroisArts = {};'));
// la même, chargée SANS la règle (elementsJamaisEcrit vide) : pour la contre-épreuve
var SANS_REGLE = (function () {
    var vrai = PluginManager.parameters;
    PluginManager.parameters = function (n) { var p = Object.assign({}, vrai(n)); if (n === 'LesTroisArts') { p.elementsJamaisEcrit = ''; } return p; };
    var LesTroisArts = {};
    eval(lire('js/plugins/LesTroisArts.js').replace('var LesTroisArts = LesTroisArts || {};', ''));
    PluginManager.parameters = vrai;
    return LesTroisArts;
})();

var C = JSON.parse(lire('data/Classes.json')), A = JSON.parse(lire('data/Actors.json')), E = JSON.parse(lire('data/Enemies.json'));
var ENNEMI = {}; E.forEach(function (e) { if (e) { e.actions.forEach(function (a) { ENNEMI[a.skillId] = 1; }); } });
var PAR_SON_EFFET = [105];   // Transfusion d'Âme Blanche : 50 % des PV de qui la lance (<Pre-Damage Eval>)
function base() {
    var S = JSON.parse(lire('data/Skills.json'));
    S.forEach(function (s) {
        if (!s) { return; }
        s._competence = true; s.meta = {};
        var re = /<([^<>:]+)(:?)([^>]*)>/g, m;
        while ((m = re.exec(s.note))) { s.meta[m[1]] = m[2] === ':' ? m[3] : true; }
    });
    return S;
}
function heros(S) {
    var vus = {};
    [1, 2, 3, 4].forEach(function (c) {
        C[c].learnings.forEach(function (l) { vus[l.skillId] = 1; });
        A[c].traits.forEach(function (t) { if (t.code === 43) { vus[t.dataId] = 1; } });
    });
    return Object.keys(vus).map(Number).map(function (id) { return S[id]; }).filter(function (s) { return s && s.id > 2; });
}
function elements(s) {
    var e = [s.damage.elementId];
    if (s.meta['Multiple Elements']) { String(s.meta['Multiple Elements']).split(',').forEach(function (x) { e.push(+x); }); }
    return e;
}

function controles(S, T) {
    T = T || LesTroisArts;
    var r = [], H = heros(S), ecrits = H.filter(function (s) { return T.art(s) === 'ecrit'; });
    // 1
    var physiques = ecrits.filter(function (s) { return s.damage.elementId === 1 || s.damage.elementId === -1; });
    r.push(['1 · aucun écrit d\'un héros n\'est un coup physique', physiques.length === 0,
        physiques.length ? physiques.map(function (s) { return s.id + ' ' + s.name; }).join(', ') : ecrits.length + ' écrits, tous d\'un autre élément']);
    // 2
    var sc = S[1134];
    r.push(['2 · Saignée Continue est un mouvement, à 20 PT, ni PV ni PM, avec sa description de JOKO',
        LesTroisArts.art(sc) === 'mouvement' && sc.tpCost === 20 && sc.mpCost === 0 && !/<HP Cost/i.test(sc.note) && sc.description === 'On ne frappe plus : on attend que ça fasse effet.',
        LesTroisArts.art(sc) + ' · ' + sc.tpCost + ' PT · ' + JSON.stringify(sc.description)]);
    // 3
    var mal = ecrits.filter(function (s) {
        if (ENNEMI[s.id] || PAR_SON_EFFET.indexOf(s.id) >= 0) { return false; }
        return !/<HP Cost:\s*\d+%>/i.test(s.note) || s.mpCost > 0 || s.tpCost > 0;
    });
    r.push(['3 · tout écrit d\'un héros se paie en PV, et seulement en PV', mal.length === 0,
        mal.length ? mal.slice(0, 4).map(function (s) { return s.id + ' ' + s.name + ' (' + s.mpCost + ' PM, ' + s.tpCost + ' PT)'; }).join(' · ') : 'les ' + ecrits.length + ' écrits (sauf Ce Qu\'il A Gardé, qu\'un ennemi utilise, et Transfusion, par son effet)']);
    // 4
    var horsSysteme = H.filter(function (s) { return elements(s).some(function (e) { return e === 2 || e === 7; }) && LesTroisArts.art(s) !== 'ecrit'; });
    r.push(['4 · toute technique d\'un héros au mana spirituel (élément 2 ou 7) est un écrit', horsSysteme.length === 0,
        horsSysteme.length ? horsSysteme.slice(0, 4).map(function (s) { return s.id + ' ' + s.name + ' (' + LesTroisArts.art(s) + ')'; }).join(' · ') : 'aucune hors du système']);
    return r;
}

var ok = 0, ko = 0;
function montre(c) { if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); } else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); } }
console.log('L\'ÉCRIT, C\'EST LE MANA SPIRITUEL\n');
console.log('1) Sur la vraie base');
controles(base()).forEach(montre);

console.log('\n2) La règle de LesTroisArts, dans les deux sens');
var B = base();
B[1134].note = '<Art: ecrit>\n' + B[1134].note;
montre(['une fiche physique marquée <Art: ecrit> (Saignée Continue comme avant) reste un mouvement', LesTroisArts.art(B[1134]) === 'mouvement', LesTroisArts.art(B[1134])]);
B[1134].meta.Art = ' ecrit';
montre(['… même quand la métadonnée est lue', LesTroisArts.art(B[1134]) === 'mouvement', LesTroisArts.art(B[1134])]);
montre(['contre-épreuve : un écrit spirituel le reste (Trait Spectral, Déflagration Spirituelle, Tracer le Cercle)',
    ['ecrit', 'ecrit', 'ecrit'].join() === [158, 133, 1114].map(function (id) { return LesTroisArts.art(B[id]); }).join(),
    [158, 133, 1114].map(function (id) { return B[id].name + ' ' + LesTroisArts.art(B[id]); }).join(' · ')]);

var SABOTAGES = [
    ['sans la règle de LesTroisArts, l\'ancienne Saignée Continue (<Art: ecrit>) redevient un écrit physique', function (S) { S[1134].meta.Art = ' ecrit'; return SANS_REGLE; }, /^1 ·/],
    ['Saignée Continue rendue à 7 % de PV', function (S) { S[1134].tpCost = 0; S[1134].note = '<HP Cost: 7%>\n' + S[1134].note; }, /^2 ·/],
    ['le Registre de ludwing rendu à 26 PM', function (S) { S[1165].mpCost = 26; S[1165].note = S[1165].note.replace(/<HP Cost: \d+%>\n?/, ''); }, /^3 ·/],
    ['une technique de l\'âme rangée dans la Parole (<Art: parole> sur Trait Spectral)', function (S) { S[158].meta.Art = 'parole'; }, /^4 ·/]
];
console.log('\n3) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
SABOTAGES.forEach(function (sb) {
    var S = base(), T = sb[1](S);
    var tombe = controles(S, T).filter(function (c) { return !c[1]; }).map(function (c) { return c[0]; });
    var sien = tombe.filter(function (c) { return sb[2].test(c); })[0];
    montre([sb[0], !!sien, sien ? '« ' + sien + ' » tombe' + (tombe.length > 1 ? ' (et ' + (tombe.length - 1) + ' autre)' : '') : 'tombés : ' + (tombe.join(' | ') || 'aucun')]);
});

console.log('\n' + '='.repeat(70) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(70));
process.exit(ko === 0 ? 0 : 1);
