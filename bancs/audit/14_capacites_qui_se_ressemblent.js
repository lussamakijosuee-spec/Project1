/*
 * COMBIEN DE CAPACITÉS FONT LA MÊME CHOSE ?
 *
 * JOKO : « qu'ils n'aient pas trop de capacités inutiles, ou trop de capacités
 * qui se ressemblent, mais vraiment des capacités qui peuvent leur être utiles ».
 *
 * « Se ressembler » n'est pas une impression : deux compétences se ressemblent
 * quand, du point de vue du joueur en combat, choisir l'une ou l'autre revient
 * au même. On regroupe donc par CE QUE ÇA FAIT, pas par le nom :
 *
 *     portée (scope) · nature (dégât/soin/drain) · élément · forme de la formule
 *
 * La forme de la formule est la formule dont on a effacé les nombres :
 *     Math.floor(a.mat * 12 * 200 / (200 + b.mdf))   →   a.mat*N*N/(N+b.mdf)
 * Deux compétences de même forme ne diffèrent que par un multiplicateur : en
 * jeu, c'est la même touche, en plus fort. C'est ça, une redondance — et c'est
 * normal d'en avoir un peu (une montée en puissance), pas huit d'affilée.
 *
 * ⚠ Ce banc ne propose RIEN et ne supprime RIEN. La règle 3 du projet interdit
 *   de retirer quoi que ce soit ; une capacité en trop se renomme et se
 *   redécrit. Ce fichier sert à décider, pas à exécuter.
 *
 * Lancement :  node bancs/audit/14_capacites_qui_se_ressemblent.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var D = function (f) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', f), 'utf8')); };

var Actors = D('Actors.json');
var Classes = D('Classes.json');
var Skills = D('Skills.json');
var States = D('States.json');
var System = D('System.json');

var HEROS = [1, 2, 3, 4];
var PORTEE = {
    0: 'personne', 1: '1 ennemi', 2: 'tous ennemis', 3: '1 ennemi au hasard',
    4: '2 ennemis au hasard', 5: '3 ennemis au hasard', 6: '4 ennemis au hasard',
    7: '1 allié', 8: 'tous alliés', 9: '1 allié mort', 10: 'alliés morts',
    11: 'soi-même', 12: '1 allié (même mort)', 13: 'tous alliés (même morts)', 14: 'tout le monde'
};
var NATURE = { 0: 'aucun dégât', 1: 'dégâts PV', 2: 'dégâts PM', 3: 'soin PV', 4: 'soin PM', 5: 'drain PV', 6: 'drain PM' };

/** La forme d'une formule : les nombres effacés, les espaces tassés. */
function forme(f) {
    return String(f || '0')
        .replace(/Math\.floor|Math\.max|Math\.min|Math\.random/g, '')
        .replace(/\d+(\.\d+)?/g, 'N')
        .replace(/\s+/g, '')
        .replace(/\(+/g, '(').replace(/\)+/g, ')');
}

/** Les types de compétence qu'un trait ouvre vraiment pour ce héros. */
function typesOuverts(a) {
    var o = {};
    function lire(tr) { (tr || []).forEach(function (t) { if (t.code === 41) { o[t.dataId] = true; } }); }
    lire(a.traits);
    lire(Classes[a.classId].traits);
    ((a.note || '').match(/<Passive State:[^>]*>/gi) || []).forEach(function (l) {
        l.replace(/<Passive State:/i, '').replace('>', '').split(',').forEach(function (x) {
            var n = parseInt(x, 10);
            if (n > 0 && States[n]) { lire(States[n].traits); }
        });
    });
    return o;
}

/** Ce qu'une compétence pose comme états — deux « mêmes formules » qui posent
 *  des états différents ne se ressemblent pas vraiment. */
function etatsPoses(s) {
    return (s.effects || []).filter(function (e) { return e.code === 21; })
        .map(function (e) { return e.dataId; }).sort().join(',');
}

console.log('═'.repeat(78));
console.log('  LES CAPACITÉS QUI SE RESSEMBLENT');
console.log('═'.repeat(78));

var global = { total: 0, redondantes: 0 };

HEROS.forEach(function (id) {
    var a = Actors[id];
    var c = Classes[a.classId];
    var ouverts = typesOuverts(a);

    var vus = {}, liste = [];
    (c.learnings || []).forEach(function (l) {
        var s = Skills[l.skillId];
        if (!s || !s.name || !s.name.trim() || vus[l.skillId]) { return; }
        vus[l.skillId] = 1;
        liste.push({ s: s, nv: l.level, visible: !!ouverts[s.stypeId] });
    });

    // on regroupe
    var groupes = {};
    liste.forEach(function (n) {
        var s = n.s;
        var d = s.damage || {};
        var cle = [s.scope, d.type || 0, d.elementId || 0, forme(d.formula), etatsPoses(s)].join('|');
        (groupes[cle] = groupes[cle] || []).push(n);
    });

    var cles = Object.keys(groupes);
    var gros = cles.filter(function (k) { return groupes[k].length >= 2; })
        .sort(function (x, y) { return groupes[y].length - groupes[x].length; });
    var nbRedondantes = gros.reduce(function (t, k) { return t + groupes[k].length - 1; }, 0);

    global.total += liste.length;
    global.redondantes += nbRedondantes;

    console.log('\n' + '─'.repeat(78));
    console.log('  ' + a.name + ' — ' + c.name);
    console.log('─'.repeat(78));
    console.log('   ' + liste.length + ' capacités distinctes · ' + cles.length + ' façons de jouer différentes');
    console.log('   → ' + nbRedondantes + ' font double emploi (' +
        Math.round(nbRedondantes / liste.length * 100) + ' %) : même portée, même nature, même');
    console.log('     élément, même forme de formule, mêmes états. Seul le multiplicateur change.');
    var invisibles = liste.filter(function (n) { return !n.visible; }).length;
    if (invisibles) { console.log('   ⚠ ' + invisibles + ' ne sont visibles dans aucun menu.'); }

    console.log('\n   Les familles les plus chargées :');
    gros.slice(0, 5).forEach(function (k) {
        var g = groupes[k].sort(function (x, y) { return x.nv - y.nv; });
        var p = k.split('|');
        console.log('\n     ▸ ' + g.length + ' fois : ' + (PORTEE[p[0]] || ('portée ' + p[0])) +
            ' · ' + (NATURE[p[1]] || p[1]) +
            (p[2] !== '0' ? ' · ' + (System.elements[p[2]] || ('él' + p[2])) : ''));
        g.forEach(function (n) {
            var mult = String(n.s.damage.formula).match(/\*\s*([\d.]+)\s*\*/);
            console.log('        Nv' + String(n.nv).padStart(2) + '  #' + String(n.s.id).padStart(4) + '  ' +
                n.s.name.trim().padEnd(38) + (mult ? '×' + mult[1] : '') +
                (n.visible ? '' : '   (invisible)'));
        });
    });

    // ce qui ne fait rien du tout
    var creuses = liste.filter(function (n) {
        var s = n.s;
        var sansDegats = !s.damage || s.damage.type === 0 || String(s.damage.formula).trim() === '0';
        return sansDegats && (s.effects || []).length === 0;
    });
    if (creuses.length) {
        console.log('\n   ⚠ ' + creuses.length + ' capacité(s) sans dégâts NI effet — elles s\'exécutent et rien ne se passe :');
        creuses.slice(0, 8).forEach(function (n) {
            console.log('        #' + n.s.id + ' ' + n.s.name.trim() +
                '   note : ' + (n.s.note ? JSON.stringify(n.s.note.split('\n')[0]).slice(0, 52) : '(vide)'));
        });
        if (creuses.length > 8) { console.log('        … et ' + (creuses.length - 8) + ' autres'); }
    }
});

console.log('\n' + '═'.repeat(78));
console.log('  LE COMPTE');
console.log('═'.repeat(78));
console.log('  ' + global.total + ' capacités sur les quatre héros ;');
console.log('  ' + global.redondantes + ' font double emploi, soit ' +
    Math.round(global.redondantes / global.total * 100) + ' % ;');
console.log('  il reste ' + (global.total - global.redondantes) + ' façons de jouer réellement distinctes.');
console.log('');
console.log('  Rappel de la règle 3 : on ne supprime rien. Une capacité en double se');
console.log('  renomme et se redécrit — ou devient le palier supérieur de sa famille.');
