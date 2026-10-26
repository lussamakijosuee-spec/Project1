/*
 * BANC — LA DANGEROSITÉ ET LES DOCTRINES DE COMBAT
 * ---------------------------------------------------------------------------
 * `YEP_BattleAICore` était chargé et ne faisait RIEN : aucun des 547 ennemis ne
 * portait de bloc `<AI Priority>`. Ils portent maintenant une doctrine par
 * famille, et une note de dangerosité de 1 à 10.
 *
 * Tout ce qui rate ici rate EN SILENCE. Yanfly ne lève pas d'erreur :
 *
 *   · une condition qu'il ne sait pas lire → `passAIConditions` rend `false`,
 *     et la ligne ne part jamais ;
 *   · un nom de compétence qu'il ne résout pas → `initialCheck` rend `false`,
 *     même chose ;
 *   · un nom porté par DEUX compétences → `Yanfly.SkillIdRef` garde la
 *     DERNIÈRE. Cinq ennemis écrivaient « Éclat Noir » en possédant l'id 11
 *     (×14 ATK) : Yanfly leur rendait l'id 1124 (×29 ATK). La ligne partait,
 *     au double des dégâts prévus ;
 *   · une compétence plus chère que la réserve de l'ennemi → sautée.
 *
 * On ne rejoue donc pas la logique qui a ÉCRIT les doctrines — on rejoue les
 * expressions régulières de `YEP_BattleAICore.js` lui-même, relues dans le
 * fichier du plugin. Mesurer le symptôme, pas le motif.
 *
 *   node bancs/9_doctrines.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');

var E = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Enemies.json'), 'utf8'));
var S = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Skills.json'), 'utf8'));

// ── La table de Yanfly, reconstruite à l'identique ────────────────────────────
// `DataManager.processCoreAINotetags2` : nom en MAJUSCULES → id, dernier gagne.
var REF = {}, HOMONYMES = {};
for (var n = 1; n < S.length; n++) {
    var o = S[n];
    if (!o || !o.name || !o.name.length) { continue; }
    var k = o.name.toUpperCase();
    (HOMONYMES[k] = HOMONYMES[k] || []).push(n);
    REF[k] = n;
}

// ── Le découpage d'une ligne, dans l'ordre de `isDecidedActionAI` ─────────────
function decoupe(l) {
    var m;
    if ((m = /[ ]*(.*):[ ](?:SKILL)[ ](\d+),[ ](.*)/i.exec(l))) { return { cond: m[1], id: +m[2], cible: m[3] }; }
    if ((m = /[ ]*(.*):[ ](?:SKILL)[ ](\d+)/i.exec(l)))          { return { cond: m[1], id: +m[2], cible: 'RANDOM' }; }
    if ((m = /[ ]*(.*):[ ](.*),[ ](.*)/i.exec(l)))               { return { cond: m[1], nom: m[2], cible: m[3] }; }
    if ((m = /[ ]*(.*):[ ](.*)/i.exec(l)))                        { return { cond: m[1], nom: m[2], cible: 'RANDOM' }; }
    return null;                                    // Yanfly abandonne la ligne
}

// ── La cascade de `AIManager.passAIConditions`, dans SON ordre ────────────────
// Elle finit par `return false` : une condition non reconnue ne passe jamais.
var CASCADE = [
    /ALWAYS/i, /ELEMENT[ ](.*)/i, /EVAL[ ](.*)/i,
    /(.*)[ ]ALIVE[ ]MEMBERS[ ](.*)/i, /(.*)[ ]DEAD[ ]MEMBERS[ ](.*)/i,
    /USER[ ](.*)[ ]PARAM[ ](.*)/i, /(.*)[ ]PARAM[ ](.*)/i,
    /(.*)[ ]PARTY[ ]LEVEL[ ](.*)/i, /RANDOM[ ](\d+)([%％])/i,
    /STATE[ ]===[ ](.*)/i, /STATE[ ]!==[ ](.*)/i, /SWITCH[ ](\d+)[ ](.*)/i,
    /TURN[ ](.*)/i, /VARIABLE[ ](\d+)[ ](.*)/i
];
function conditionLue(c) {
    // `passAllAIConditions` coupe sur `+++` : chaque morceau doit passer.
    return String(c).split('+++').every(function (part) {
        var p = part.trim();
        return CASCADE.some(function (r) { return r.test(p); });
    });
}
/** Une condition qui part quoi qu'il arrive : le repli de l'ennemi. */
function estIncondionnelle(c) { return /^ALWAYS$/i.test(String(c).trim()); }

function tag(e, n) {
    var m = new RegExp('<\\s*' + n + '\\s*:\\s*([^>]+)>', 'i').exec(e.note || '');
    return m ? m[1].trim() : '';
}
function doctrine(e) {
    var p = /<AI Priority>([\s\S]*?)<\/AI Priority>/i.exec(e.note || '');
    return p ? p[1].split('\n').filter(function (l) { return l.trim(); }) : null;
}
/** La force brute d'un ennemi, pour juger si la dangerosité dit vrai. */
function force(e) {
    var p = e.params;
    return (p[0] || 1) * ((p[2] || 0) + (p[4] || 0) + (p[3] || 0) + (p[5] || 0) + 1);
}
function mediane(a) {
    if (!a.length) { return 0; }
    var t = a.slice().sort(function (x, y) { return x - y; });
    return t[Math.floor(t.length / 2)];
}

// Les Glitchs ne se replient pas : « Ça ne vient pas du monde. Ça vient de
// dessous. » Leur doctrine est faite de RANDOM seuls, c'est voulu — quand rien
// ne part, MV reprend la main avec la liste d'actions ordinaire.
var SANS_REPLI = { 'Les Glitchs': 1 };

function controles(E) {
    var reels = E.filter(function (e) { return e && e.name; });
    var r = [];

    // ── 1. La dangerosité ────────────────────────────────────────────────────
    var sansDanger = reels.filter(function (e) {
        var d = tag(e, 'Danger');
        return !d || !(+d >= 1 && +d <= 10);
    });
    r.push(['chaque ennemi porte une dangerosité de 1 à 10', sansDanger.length === 0,
        reels.length + ' ennemis · ' + sansDanger.length + ' sans note valable' +
        (sansDanger.length ? ' : ' + sansDanger.slice(0, 3).map(function (e) { return e.name; }).join(', ') : '')]);

    var paliers = {};
    reels.forEach(function (e) { var d = +tag(e, 'Danger'); if (d) { paliers[d] = (paliers[d] || 0) + 1; } });
    var vides = [];
    for (var i = 1; i <= 10; i++) { if (!paliers[i]) { vides.push(i); } }
    r.push(['les dix paliers de dangerosité sont tous peuplés', vides.length === 0,
        vides.length ? 'palier(s) vide(s) : ' + vides.join(', ')
            : Object.keys(paliers).sort(function (a, b) { return a - b; }).map(function (k) { return k + ':' + paliers[k]; }).join(' ')]);

    // La note doit suivre la force réelle, sinon elle ne veut rien dire.
    var parPalier = {};
    reels.forEach(function (e) { var d = +tag(e, 'Danger') || 0; (parPalier[d] = parPalier[d] || []).push(force(e)); });
    var inversions = [];
    for (var d = 2; d <= 10; d++) {
        if (!parPalier[d] || !parPalier[d - 1]) { continue; }
        if (mediane(parPalier[d]) < mediane(parPalier[d - 1])) { inversions.push(d - 1 + '→' + d); }
    }
    r.push(['la dangerosité suit la force réelle, palier après palier', inversions.length === 0,
        inversions.length ? 'inversion(s) : ' + inversions.join(', ')
            : 'force médiane croissante de 1 à 10']);

    var mauvaisNiveau = reels.filter(function (e) {
        var d = +tag(e, 'Danger'), a = tag(e, 'AI Level');
        return !a || !(+a >= 1 && +a <= 100) || (d && +a < 25);
    });
    r.push(['chaque ennemi porte un <AI Level> tenable (25-100)', mauvaisNiveau.length === 0,
        mauvaisNiveau.length + ' hors bornes' +
        (mauvaisNiveau.length ? ' : ' + mauvaisNiveau.slice(0, 3).map(function (e) { return e.name + ' → ' + tag(e, 'AI Level'); }).join(', ') : '')]);

    // ── 2. Les doctrines, lues comme Yanfly les lit ──────────────────────────
    var sansDoctrine = reels.filter(function (e) { return !doctrine(e); });
    r.push(['chaque ennemi porte un bloc <AI Priority>', sansDoctrine.length === 0,
        (reels.length - sansDoctrine.length) + ' / ' + reels.length + ' dotés']);

    var illisibles = [], condMortes = [], nomsMorts = [], ambigus = [], impayables = [], sansRepli = [];
    reels.forEach(function (e) {
        var lignes = doctrine(e);
        if (!lignes) { return; }
        var sien = (e.actions || []).map(function (a) { return a.skillId; });
        var fam = tag(e, 'Famille');
        var repli = false;
        lignes.forEach(function (l) {
            var d = decoupe(l);
            if (!d) { illisibles.push(e.name + ' : « ' + l.trim() + ' »'); return; }
            if (!conditionLue(d.cond)) { condMortes.push(e.name + ' : « ' + d.cond + ' »'); }
            else if (estIncondionnelle(d.cond)) { repli = true; }

            var id = d.id;
            if (id === undefined) {
                var cle = String(d.nom).toUpperCase();
                id = REF[cle];
                if (!id) { nomsMorts.push(e.name + ' : « ' + d.nom + ' »'); return; }
                // Le nom a un homonyme : Yanfly rendra le DERNIER, qui n'est
                // pas forcément celui que l'ennemi possède.
                if (HOMONYMES[cle].length > 1) {
                    var possede = HOMONYMES[cle].filter(function (x) { return sien.indexOf(x) >= 0; });
                    if (possede.length && possede.indexOf(id) < 0) {
                        ambigus.push(e.name + ' : « ' + d.nom + ' » → ' + id + ' au lieu de ' + possede[0]);
                    }
                }
            }
            var sk = S[id];
            if (!sk) { nomsMorts.push(e.name + ' : Skill ' + id + ' (inexistante)'); return; }
            if ((sk.mpCost || 0) > (e.params[1] || 0)) {
                impayables.push(e.name + ' : ' + sk.name + ' (' + sk.mpCost + ' PM, il en a ' + e.params[1] + ')');
            }
        });
        if (!repli && !SANS_REPLI[fam]) { sansRepli.push(e.name + (fam ? ' (' + fam + ')' : '')); }
    });

    function bilan(titre, liste, bon) {
        r.push([titre, liste.length === 0,
            liste.length ? liste.length + ' : ' + liste.slice(0, 3).join(' · ') : bon]);
    }
    bilan('chaque ligne se découpe comme Yanfly la découpe', illisibles, 'toutes les lignes passent les 4 motifs');
    bilan('chaque condition est une que Yanfly sait lire', condMortes, 'aucune condition muette');
    bilan('chaque compétence nommée existe vraiment', nomsMorts, 'tous les noms résolvent');
    bilan('aucun nom ambigu ne détourne la ligne vers un homonyme', ambigus, 'aucun détournement');
    bilan('chaque ennemi peut payer ce que sa doctrine lui fait lancer', impayables, 'toutes les réserves suffisent');
    bilan('chaque ennemi garde une ligne de repli inconditionnelle', sansRepli, 'tous repliables (hors Glitchs, voulu)');

    // Un boss qui n'a qu'une ligne se bat toujours pareil.
    var bossPlats = reels.filter(function (e) {
        if (!/<\s*Boss\s*>/i.test(e.note || '')) { return false; }
        var l = doctrine(e);
        return !l || l.length < 2;
    });
    r.push(['aucun boss ne se bat sur une seule ligne', bossPlats.length === 0,
        bossPlats.length ? bossPlats.slice(0, 3).map(function (e) { return e.name; }).join(', ') : 'tous les boss ont au moins deux temps']);

    return r;
}

// ═════════════════════════════════════════════════════════════════════════════
var ok = 0, ko = 0;
console.log('LA DANGEROSITÉ ET LES DOCTRINES DE COMBAT\n');
console.log('1) Sur la vraie base');
controles(E).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

/** Le premier ennemi doté d'une doctrine — cobaye des sabotages. */
function cobaye(b) {
    return b.filter(function (e) { return e && e.name && doctrine(e); })[0];
}
function remplaceDoctrine(e, lignes) {
    e.note = e.note.replace(/<AI Priority>[\s\S]*?<\/AI Priority>/i,
        '<AI Priority>\n' + lignes.join('\n') + '\n</AI Priority>');
}

var SABOTAGES = [
    ['une dangerosité à 42', function (b) { cobaye(b).note = cobaye(b).note.replace(/<Danger:[^>]*>/i, '<Danger: 42>'); }, /dangerosité de 1 à 10/],
    ['le palier 9 vidé sur le 8', function (b) {
        b.forEach(function (e) { if (e && e.name) { e.note = e.note.replace(/<Danger:\s*9\s*>/i, '<Danger: 8>'); } });
    }, /dix paliers/],
    ['les paliers 1 et 10 échangés', function (b) {
        b.forEach(function (e) {
            if (!e || !e.name) { return; }
            e.note = e.note.replace(/<Danger:\s*1\s*>/i, '<Danger: >').replace(/<Danger:\s*10\s*>/i, '<Danger: 1>').replace('<Danger: >', '<Danger: 10>');
        });
    }, /suit la force réelle/],
    ['un <AI Level> à 3', function (b) { cobaye(b).note = cobaye(b).note.replace(/<AI Level:[^>]*>/i, '<AI Level: 3>'); }, /AI Level/],
    ['un ennemi privé de sa doctrine', function (b) { cobaye(b).note = cobaye(b).note.replace(/<AI Priority>[\s\S]*?<\/AI Priority>/i, ''); }, /porte un bloc/],
    ['les deux-points sans espace après', function (b) { remplaceDoctrine(cobaye(b), ['ALWAYS:Attaque, Lowest HP%']); }, /se découpe comme Yanfly/],
    ['une condition inventée', function (b) { remplaceDoctrine(cobaye(b), ['QUAND IL PLEUT: Attaque, Lowest HP%']); }, /condition est une que Yanfly/],
    ['une compétence qui n\'existe pas', function (b) { remplaceDoctrine(cobaye(b), ['ALWAYS: Cette Compétence Est Fictive, Lowest HP%']); }, /compétence nommée existe/],
    ['un nom rendu ambigu', function (b) {
        // On rend le nom de la compétence de l'ennemi homonyme d'une autre,
        // plus loin dans la liste : Yanfly rendra celle de la fin.
        var e = cobaye(b);
        var sien = e.actions[0] && e.actions[0].skillId;
        if (!sien) { return; }
        remplaceDoctrine(e, ['ALWAYS: ' + S[sien].name + ', Lowest HP%']);
        for (var i = S.length - 1; i > sien; i--) { if (S[i] && S[i].name) { S[i].name = S[sien].name; break; } }
        // La table se reconstruit à la lecture : on la refait ici aussi.
        REF = {}; HOMONYMES = {};
        for (var x = 1; x < S.length; x++) {
            var s = S[x];
            if (!s || !s.name || !s.name.length) { continue; }
            var c = s.name.toUpperCase();
            (HOMONYMES[c] = HOMONYMES[c] || []).push(x);
            REF[c] = x;
        }
    }, /nom ambigu/],
    ['une compétence trop chère pour l\'ennemi', function (b) {
        var e = cobaye(b);
        e.params[1] = 0;
        var cher = S.filter(function (s) { return s && s.name && s.name.indexOf(':') < 0 && (s.mpCost || 0) > 0 && (HOMONYMES[s.name.toUpperCase()] || []).length === 1; })[0];
        remplaceDoctrine(e, ['ALWAYS: ' + cher.name + ', Lowest HP%']);
    }, /peut payer/],
    ['le repli retiré à tout le monde', function (b) {
        b.forEach(function (e) {
            if (!e || !e.name) { return; }
            var l = doctrine(e);
            if (l) { remplaceDoctrine(e, l.filter(function (x) { return !/^\s*ALWAYS\s*:/i.test(x); })); }
        });
    }, /ligne de repli/],
    ['un boss ramené à une seule ligne', function (b) {
        var boss = b.filter(function (e) { return e && e.name && /<\s*Boss\s*>/i.test(e.note || '') && doctrine(e); })[0];
        if (boss) { remplaceDoctrine(boss, [doctrine(boss)[0]]); }
    }, /boss ne se bat/]
];

console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
var REF0 = REF, HOM0 = HOMONYMES;
var NOMS0 = S.map(function (s) { return s && s.name; });
SABOTAGES.forEach(function (s) {
    var b = JSON.parse(JSON.stringify(E));
    REF = REF0; HOMONYMES = HOM0;
    s[1](b);
    var vise = controles(b).filter(function (c) { return !c[1] && s[2].test(c[0]); });
    if (vise.length) { ok++; console.log('   ✓ ' + s[0] + '  →  « ' + vise[0][0] + ' » tombe'); }
    else { ko++; console.log('   ✗ ' + s[0] + '  →  son contrôle ne tombe PAS'); }
    // On remet la table et les noms d'aplomb pour le sabotage suivant.
    S.forEach(function (x, i) { if (x && NOMS0[i]) { x.name = NOMS0[i]; } });
    REF = REF0; HOMONYMES = HOM0;
});

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
