/*
 * BANC — LA FORGE
 * ---------------------------------------------------------------------------
 * YEP_X_ItemUpgradeSlots tourne avec « Default Slots = 3 » : chaque arme et
 * chaque armure du jeu annonce « Emplacements libres : 3 ». Il n'existait pas
 * un seul objet d'amélioration dans la base — le menu s'ouvrait sur rien.
 * En face, 24 matériaux tagués <Materiau> / <MateriauRare> tombaient déjà de
 * ~400 ennemis sans servir à quoi que ce soit.
 *
 * ⚠ CE PLUGIN ÉCHOUE EN SILENCE, À DEUX NIVEAUX.
 *
 * `processIUSEffect` est une chaîne de `if` ordonnée qui se termine sans
 * `else` : une ligne qu'aucun motif ne reconnaît est simplement ignorée. Et
 * même reconnue, elle passe ensuite dans un `switch (stat)` sans `default` :
 * écrire « ATTACK: +5 » au lieu de « ATK: +5 » se lit très bien, se parse très
 * bien, et ne fait rien du tout.
 *
 * Le banc rejoue donc les deux étages, et il lit les noms de statistique
 * acceptés DANS LE PLUGIN LUI-MÊME plutôt que dans une liste recopiée — une
 * copie se désynchronise, la source non.
 *
 *   node bancs/19_forge.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');

var I = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Items.json'), 'utf8'));
var W = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Weapons.json'), 'utf8'));
var AR = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Armors.json'), 'utf8'));
var E = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Enemies.json'), 'utf8'));
var SRC = fs.readFileSync(path.join(RACINE, 'js/plugins/YEP_X_ItemUpgradeSlots.js'), 'utf8');
var PLUG = fs.readFileSync(path.join(RACINE, 'js/plugins.js'), 'utf8');
var ARRONDI = fs.existsSync(path.join(RACINE, 'js/plugins/ForgeArrondie.js'));

// ── Les noms de statistique que le plugin accepte, lus dans sa propre source ──
function nomsAcceptes(nomFonction) {
    var i = SRC.indexOf('ItemManager.' + nomFonction + ' = function');
    if (i < 0) { return null; }
    var corps = SRC.slice(i, SRC.indexOf('\n};', i));
    var out = {}, m, re = /case\s+'([^']+)'/g;
    while ((m = re.exec(corps))) { out[m[1].toUpperCase()] = 1; }
    return out;
}
var STAT_PLAT = nomsAcceptes('effectIUSParamChange');
var STAT_PCT = nomsAcceptes('effectIUSParamRateChange');

// ── Le découpage du bloc, comme le plugin le fait (ligne par ligne) ──────────
function effets(obj) {
    var lignes = String(obj.note || '').split(/[\r\n]+/);
    var dedans = false, out = [];
    for (var i = 0; i < lignes.length; i++) {
        var l = lignes[i];
        if (/<\s*Upgrade Effect\s*>/i.test(l)) { dedans = true; out = []; continue; }
        if (/<\/\s*Upgrade Effect\s*>/i.test(l)) { dedans = false; continue; }
        if (dedans) { out.push(l); }
    }
    return out;
}

/**
 * Rejoue `processIUSEffect` : renvoie ce que la ligne fait VRAIMENT.
 * null = aucun motif ne la reconnaît (premier étage de silence).
 * {stat, inconnue:true} = motif reconnu, statistique refusée par le switch
 * (deuxième étage de silence).
 */
function lire(ligne) {
    var m;
    if (/BASE NAME:[ ](.*)/i.test(ligne)) { return { quoi: 'nom de base' }; }
    if (/EVAL:[ ](.*)/i.test(ligne)) { return { quoi: 'eval' }; }
    if (/ICON:[ ](\d+)/i.test(ligne)) { return { quoi: 'icône' }; }
    if (/PREFIX:[ ](.*)/i.test(ligne)) { return { quoi: 'préfixe' }; }
    if (/PRIORITY NAME:[ ](.*)/i.test(ligne)) { return { quoi: 'nom prioritaire' }; }
    if (/NAME:[ ](.*)/i.test(ligne)) { return { quoi: 'nom' }; }
    if ((m = /RANDOM[ ](.*):[ ](\d+)/i.exec(ligne))) {
        return verifie(m[1], 'aléatoire', STAT_PLAT, parseInt(m[2], 10));
    }
    if ((m = /RANDOM[ ](.*):[ ]([\+\-]\d+)/i.exec(ligne))) {
        return verifie(m[1], 'aléatoire', STAT_PLAT, parseInt(m[2], 10));
    }
    if (/RESET[ ](.*)/i.test(ligne)) { return { quoi: 'remise à zéro' }; }
    if (/TEXT COLOR:[ ](\d+)/i.test(ligne)) { return { quoi: 'couleur' }; }
    if ((m = /(.*):[ ]([\+\-]\d+)([%％])/i.exec(ligne))) {
        return verifie(m[1], 'pourcentage', STAT_PCT, parseInt(m[2], 10));
    }
    if ((m = /(.*):[ ]([\+\-]\d+)/i.exec(ligne))) {
        return verifie(m[1], 'plat', STAT_PLAT, parseInt(m[2], 10));
    }
    if (/SUFFIX:[ ](.*)/i.test(ligne)) { return { quoi: 'suffixe' }; }
    return null;                                   // ← premier étage de silence
}
function verifie(brut, quoi, table, valeur) {
    var stat = String(brut).toUpperCase().trim();
    if (!table || !table[stat]) { return { quoi: quoi, stat: stat, inconnue: true, valeur: valeur }; }
    return { quoi: quoi, stat: stat, valeur: valeur };
}

/** L'indice de params touché, pour la simulation. */
var IDX = {
    HP: 0, MAXHP: 0, 'MAX HP': 0, MP: 1, MAXMP: 1, 'MAX MP': 1, SP: 1, MAXSP: 1, 'MAX SP': 1,
    ATK: 2, STR: 2, DEF: 3, MAT: 4, INT: 4, SPI: 4, MDF: 5, RES: 5, AGI: 6, SPD: 6, LUK: 7
};

function controles(base) {
    var r = [];
    var materiaux = base.filter(function (x) {
        return x && x.name && /<\s*Materiau(Rare)?\s*[:>]/i.test(x.note || '');
    });
    var forge = base.filter(function (x) { return x && x.name && effets(x).length > 0; });

    // 1 · tout ce qui se dit matériau sert vraiment à quelque chose
    var inertes = materiaux.filter(function (x) { return effets(x).length === 0; });
    r.push(['chaque matériau tagué <Materiau> sert à la forge', inertes.length === 0,
        materiaux.length + ' matériaux · ' + inertes.length + ' encore inertes' +
        (inertes.length ? ' : ' + inertes.slice(0, 3).map(function (x) { return x.name; }).join(', ') : '')]);

    // 2 · PREMIER ÉTAGE — aucune ligne ignorée par la chaîne de `if`
    var muettes = [];
    forge.forEach(function (x) {
        effets(x).forEach(function (l) {
            if (!l.trim()) { return; }
            if (lire(l) === null) { muettes.push(x.name + ' → « ' + l.trim() + ' »'); }
        });
    });
    r.push(['aucune ligne d\'effet n\'est ignorée par la chaîne de motifs', muettes.length === 0,
        muettes.length ? muettes.slice(0, 3).join(' · ') : 'toutes les lignes sont reconnues']);

    // 3 · DEUXIÈME ÉTAGE — aucune statistique refusée par le switch
    var refusees = [];
    forge.forEach(function (x) {
        effets(x).forEach(function (l) {
            if (!l.trim()) { return; }
            var e = lire(l);
            if (e && e.inconnue) { refusees.push(x.name + ' → « ' + l.trim() + ' » (stat ' + e.stat + ')'); }
        });
    });
    r.push(['aucune statistique n\'est refusée par le switch du plugin', refusees.length === 0,
        refusees.length ? refusees.slice(0, 3).join(' · ')
            : 'les ' + Object.keys(STAT_PLAT).length + ' noms acceptés sont lus dans le plugin même']);

    // 4 · le bloc est bien fermé — sinon il avale le reste de la note
    var malFermes = base.filter(function (x) {
        if (!x || !x.note) { return false; }
        var o = (x.note.match(/<\s*Upgrade Effect\s*>/gi) || []).length;
        var f = (x.note.match(/<\/\s*Upgrade Effect\s*>/gi) || []).length;
        return o !== f;
    });
    r.push(['chaque bloc <Upgrade Effect> est refermé', malFermes.length === 0,
        malFermes.length ? malFermes.map(function (x) { return x.name; }).join(', ')
            : forge.length + ' blocs équilibrés']);

    // 5 · la forge a de quoi tourner : les matériaux tombent vraiment
    var lache = {};
    E.forEach(function (e) {
        if (!e || !e.name) { return; }
        (e.dropItems || []).forEach(function (d) { if (d.kind === 1 && d.dataId > 0) { lache[d.dataId] = 1; } });
    });
    var communs = materiaux.filter(function (x) { return /<\s*Materiau\s*:/i.test(x.note); });
    var sansSource = communs.filter(function (x) { return !lache[x.id]; });
    r.push(['chaque matériau de famille a au moins une source dans le bestiaire',
        sansSource.length === 0,
        communs.length + ' matériaux de famille · ' + sansSource.length + ' que personne ne lâche' +
        (sansSource.length ? ' : ' + sansSource.map(function (x) { return x.name; }).join(', ') : '')]);

    // 6 · SIMULATION — une vraie amélioration sur une vraie arme
    //     On prend l'arme médiane du jeu et on lui applique un matériau plat
    //     puis un matériau en pourcentage, comme le ferait Scene_Item.
    var armes = W.filter(function (x) { return x && x.name && x.name.trim() && x.params[2] > 0; })
        .sort(function (a, b) { return a.params[2] - b.params[2]; });
    var arme = armes[Math.floor(armes.length / 2)];
    var croc = base[86], coeur = base[104];
    var sim = JSON.parse(JSON.stringify(arme));
    var avantATK = sim.params[2];
    [croc, coeur].forEach(function (mat) {
        effets(mat).forEach(function (l) {
            var e = lire(l);
            if (!e || e.inconnue || IDX[e.stat] === undefined) { return; }
            var i = IDX[e.stat];
            if (e.quoi === 'pourcentage') { sim.params[i] += e.valeur * 0.01 * arme.params[i]; }
            else if (e.quoi === 'plat') { sim.params[i] += e.valeur; }
        });
    });
    if (ARRONDI) { sim.params = sim.params.map(function (v) { return Math.round(v); }); }

    r.push(['une amélioration se voit sur la statistique visée',
        sim.params[2] > avantATK,
        arme.name + ' : ATK ' + avantATK + ' → ' + sim.params[2] +
        ' (Croc Ébréché + Cœur de Boss)']);

    r.push(['les statistiques restent des nombres entiers',
        sim.params.every(function (v) { return Number.isInteger(v); }),
        ARRONDI ? 'ForgeArrondie est chargé — ' + sim.params.join('/')
            : 'ForgeArrondie est ABSENT : le plugin laisse des décimales (' + sim.params.join('/') + ')']);

    // 7 · une amélioration ne doit pas faire exploser l'échelle de l'équipement
    var maxATK = Math.max.apply(null, W.filter(function (x) { return x && x.name; })
        .map(function (x) { return x.params[2]; }));
    r.push(['trois améliorations ne dépassent pas la meilleure arme du jeu',
        sim.params[2] <= maxATK,
        'arme médiane améliorée : ' + sim.params[2] + ' · meilleure arme du jeu : ' + maxATK]);

    // 8 · le libellé du menu est en français, comme le reste du jeu
    var cmd = (/"Upgrade Command"\s*:\s*"([^"]*)"/.exec(PLUG) || [, ''])[1];
    r.push(['la commande d\'amélioration est traduite', /Améliorer/i.test(cmd),
        '« ' + cmd + ' »']);

    return r;
}

var ok = 0, ko = 0;
console.log('LA FORGE\n');
console.log('1) Sur la vraie base');
controles(I).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

var SABOTAGES = [
    ['un matériau rendu à son état inerte', function (b) {
        b[86].note = String(b[86].note).replace(/<Upgrade Effect>[\s\S]*?<\/Upgrade Effect>/i, '');
    }, /sert à la forge/],
    ['« ATK » écrit « ATTACK » — le motif passe, le switch refuse', function (b) {
        b[86].note = String(b[86].note).replace(/ATK:/i, 'ATTACK:');
    }, /refusée par le switch/],
    ['un effet écrit sans les deux-points', function (b) {
        b[99].note = String(b[99].note).replace(/ATK:[ ]\+6/i, 'ATK +6');
    }, /ignorée par la chaîne de motifs/],
    ['un bloc <Upgrade Effect> laissé ouvert', function (b) {
        b[104].note = String(b[104].note).replace(/<\/Upgrade Effect>/i, '');
    }, /refermé/],
    ['un matériau en pourcentage porté à +900 %', function (b) {
        b[104].note = String(b[104].note).replace(/ATK:[ ]\+\d+%/i, 'ATK: +900%');
    }, /ne dépassent pas la meilleure arme/]
];
console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
SABOTAGES.forEach(function (s) {
    var b = JSON.parse(JSON.stringify(I));
    s[1](b);
    var vise = controles(b).filter(function (c) { return !c[1] && s[2].test(c[0]); });
    if (vise.length) { ok++; console.log('   ✓ ' + s[0] + '  →  « ' + vise[0][0] + ' » tombe'); }
    else { ko++; console.log('   ✗ ' + s[0] + '  →  son contrôle ne tombe PAS'); }
});

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
