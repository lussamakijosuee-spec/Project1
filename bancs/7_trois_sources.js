/*
 * BANC — LES TROIS SOURCES
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-09-16 : « il y a que trois sources … le mana positif est lié
 * au MP, le mana sombre a sa propre barre, et l'âme à la vie. »
 *
 *     2 · mana spirituelle = l'ÂME    → PV  (<HP Cost: n%>, YEP_SkillCore)
 *     3 · mana positive    = l'ESPRIT → PM  (mpCost)
 *     4 · mana négative    = le CORPS → PT  (tpCost)
 *
 * Les éléments 5 et 6 sont repliés sur 4 et 3. Le Mana Pur (7 et 16) est
 * au-dessus des trois : il ne paie pas de prix imposé, et il transcende le
 * triangle.
 *
 * Ce banc lit `data/` et ne dépend d'aucun plugin. Chaque contrôle est rejoué
 * sur une base SABOTÉE exprès : il doit tomber. Un contrôle qui passe sur une
 * base cassée ne mesure rien.
 *
 *   node bancs/7_trois_sources.js
 */
'use strict';
var fs = require('fs');
var RACINE = require('path').join(__dirname, '..', 'data');

function lire(f) { return JSON.parse(fs.readFileSync(RACINE + '/' + f, 'utf8')); }

var SOURCES = { 2: "l'Âme", 3: "l'Esprit", 4: 'le Corps' };
var REPLIES = [5, 6];
var PUR = [7, 16];
var RE_HP = /<HP Cost:\s*([0-9]+)(%?)\s*>/i;

/** Les contrôles, écrits une fois et rejoués sur une base sabotée. */
function controles(base) {
    var S = base.skills, sys = base.system, E = base.enemies;
    var r = [];

    function paye(k) {
        return { pm: k.mpCost || 0, pt: k.tpCost || 0, pv: RE_HP.test(k.note || '') };
    }
    function deLaSource(e) {
        return S.filter(function (k) { return k && k.damage && k.damage.elementId === e; });
    }

    // 1 · plus une seule compétence sur les éléments repliés
    var restes = REPLIES.reduce(function (n, e) { return n + deLaSource(e).length; }, 0);
    r.push(['aucune compétence ne pointe plus sur un élément replié (5, 6)', restes === 0, restes + ' restante(s)']);

    // 2 · chaque source paie dans SA monnaie, et pas dans une autre
    [[2, 'pv', 'PV'], [3, 'pm', 'PM'], [4, 'pt', 'PT']].forEach(function (c) {
        var elem = c[0], champ = c[1];
        var liste = deLaSource(elem).filter(function (k) {
            var p = paye(k);
            return p.pm || p.pt || p.pv;                 // les gratuites sont hors sujet
        });
        var fautives = liste.filter(function (k) {
            var p = paye(k);
            if (champ === 'pv') { return !p.pv || p.pm > 0 || p.pt > 0; }
            if (champ === 'pm') { return !(p.pm > 0) || p.pt > 0 || p.pv; }
            return !(p.pt > 0) || p.pm > 0 || p.pv;
        });
        r.push([SOURCES[elem] + ' (élém ' + elem + ') se paie en ' + c[2] + ', et rien d\'autre',
            fautives.length === 0,
            liste.length + ' payantes · ' + fautives.length + ' hors monnaie' +
            (fautives.length ? ' : ' + fautives.slice(0, 3).map(function (k) { return k.id + ' ' + k.name; }).join(', ') : '')]);
    });

    // 3 · le pourcentage de vie reste dans la bande de JOKO (5 à 50 %)
    var horsBande = deLaSource(2).filter(function (k) {
        var m = RE_HP.exec(k.note || '');
        if (!m) { return false; }
        var n = Number(m[1]);
        return m[2] !== '%' || n < 5 || n > 50;
    });
    r.push(['le prix de la vie reste en pourcentage, entre 5 % et 50 %', horsBande.length === 0,
        horsBande.length ? horsBande.slice(0, 3).map(function (k) { return k.id + ' ' + k.name; }).join(', ') : 'bande respectée']);

    // 4 · le Mana Pur n'est pas une source : il garde ses compétences, et
    //     surtout la liberté de son prix.
    //
    //     ⚠ Ne PAS contrôler « aucun <HP Cost> sur le Mana Pur » : JOKO en a
    //     posé onze à la main (Dragon de la Nuit Sanglante, Tranche-Néant…).
    //     Un contrôle qui les dénonce accuse ses propres réglages. Ce qu'on
    //     mesure, c'est que la passe ne les a pas VIDÉS de leurs compétences.
    var compte = PUR.map(function (e) { return deLaSource(e).length; });
    // ⚠ Un PLANCHER, pas une égalité. Ce qu'on garde, c'est « la passe ne les a
    // pas vidés » — or une égalité stricte tombe aussi quand on AJOUTE une
    // compétence de Mana Pur, ce qui n'est pas un défaut. On mesure le
    // symptôme (on en a perdu), pas le nombre (il a bougé).
    //
    // ⚠ Et ce plancher était trop BAS : 36 quand il y en a 37. Le jeu pouvait
    // donc en perdre une sans que rien ne tombe — et c'est exactement ce qui se
    // passait : le sabotage « une compétence de Mana Pur repointée ailleurs »
    // ne faisait tomber aucun contrôle. Un contrôle avec du mou n'est pas un
    // contrôle. Le plancher vaut le compte RÉEL : §3 interdit de supprimer, donc
    // ce nombre ne peut que monter, et toute perte se voit immédiatement.
    var PLANCHER = [38, 11];   // 2026-09-26 : + Jugement des Défunts et Rappel des Âmes (ludwing, AME)
    r.push(['le Mana Pur (7, 16) garde ses compétences et son prix libre',
        compte[0] >= PLANCHER[0] && compte[1] >= PLANCHER[1],
        'élém 7 : ' + compte[0] + ' (plancher ' + PLANCHER[0] + ') · élém 16 : ' +
        compte[1] + ' (plancher ' + PLANCHER[1] + ')']);

    // 5 · les êtres de Mana Pur transcendent toujours le triangle
    var TRIANGLE = [2, 3, 4];
    var purs = E.filter(function (x) { return x && x.note && /<\s*Mana\s*:\s*pur\s*>/i.test(x.note); });
    // On mesure le SYMPTÔME, pas le motif (§6) : un taux d'élément à 1.0 est
    // inerte — il ne plie pas le triangle. Seule une valeur ≠ 1 le fait.
    var tombes = purs.filter(function (x) {
        return (x.traits || []).some(function (t) {
            return t.code === 11 && TRIANGLE.indexOf(t.dataId) >= 0 && t.value !== 1;
        });
    });
    r.push(['les êtres de Mana Pur échappent au triangle (canon §4)', tombes.length === 0,
        purs.length + ' êtres · ' + tombes.length + ' pris dans le cycle']);

    // 6 · les entrées repliées sont renommées, jamais vidées (§3)
    var vides = REPLIES.filter(function (e) { return !sys.elements[e] || !sys.elements[e].trim(); });
    r.push(['les éléments repliés sont renommés, pas supprimés', vides.length === 0,
        REPLIES.map(function (e) { return e + ' « ' + (sys.elements[e] || '') + ' »'; }).join(' · ')]);

    return r;
}

function base() {
    return { skills: lire('Skills.json'), system: lire('System.json'), enemies: lire('Enemies.json') };
}

var ok = 0, ko = 0;
console.log('LES TROIS SOURCES\n');
console.log('1) Sur la vraie base — tout doit passer');
controles(base()).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

// ── contre-épreuve : chaque contrôle doit tomber quand on sabote ce qu'il vise
var SABOTAGES = [
    ['une compétence repointée sur l\'élément 5', function (b) { b.skills[1].damage.elementId = 5; }, /élément replié/],
    ['l\'Âme payée en PM', function (b) { var k = b.skills.filter(function (x) { return x && x.damage && x.damage.elementId === 2 && RE_HP.test(x.note || ''); })[0]; k.mpCost = 10; }, /l'Âme \(élém 2\)/],
    ['l\'Esprit payé en PT', function (b) { var k = b.skills.filter(function (x) { return x && x.damage && x.damage.elementId === 3 && x.mpCost > 0; })[0]; k.tpCost = 5; }, /l'Esprit \(élém 3\)/],
    ['le Corps payé en PM', function (b) { var k = b.skills.filter(function (x) { return x && x.damage && x.damage.elementId === 4 && x.tpCost > 0; })[0]; k.mpCost = 5; }, /le Corps \(élém 4\)/],
    ['un prix de vie à 80 %', function (b) { var k = b.skills.filter(function (x) { return x && x.damage && x.damage.elementId === 2 && RE_HP.test(x.note || ''); })[0]; k.note = k.note.replace(RE_HP, '<HP Cost: 80%>'); }, /pourcentage/],
    ['une compétence de Mana Pur repointée ailleurs', function (b) { var k = b.skills.filter(function (x) { return x && x.damage && x.damage.elementId === 7; })[0]; k.damage.elementId = 4; }, /Mana Pur \(7, 16\)/],
    ['un être de Mana Pur pris dans le triangle', function (b) { var e = b.enemies.filter(function (x) { return x && x.note && /<\s*Mana\s*:\s*pur\s*>/i.test(x.note); })[0]; e.traits.push({ code: 11, dataId: 3, value: 0.5 }); }, /échappent au triangle/],
    ['un élément replié vidé de son nom', function (b) { b.system.elements[5] = ''; }, /renommés, pas supprimés/]
];

// Un sabotage doit faire tomber LE contrôle qu'il vise — pas n'importe lequel.
// Sans ça, un contrôle déjà cassé fait « réussir » toutes les contre-épreuves.
console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
var muets = 0;
SABOTAGES.forEach(function (s) {
    var b = base();
    s[1](b);
    var tombes = controles(b).filter(function (c) { return !c[1]; });
    var vise = s[2] ? tombes.filter(function (c) { return s[2].test(c[0]); }) : tombes;
    if (vise.length) { ok++; console.log('   ✓ ' + s[0] + '  →  « ' + vise[0][0] + ' » tombe'); }
    else {
        ko++; muets++;
        console.log('   ✗ ' + s[0] + '  →  son contrôle ne tombe PAS' +
            (tombes.length ? ' (seuls tombent : ' + tombes.map(function (c) { return c[0]; }).join(' ; ') + ')' : ' — il ne mesure rien'));
    }
});

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)' + (muets ? '  — dont ' + muets + ' sabotage(s) non détecté(s)' : ''));
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
