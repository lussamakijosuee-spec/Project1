/*
 * BANC — LA FORME DES DÉGÂTS, ET LES VOIES
 * ---------------------------------------------------------------------------
 * CLAUDE.md §7, deux pièges de MV, tous deux muets :
 *
 *   « une soustraction `a.atk * k - b.def * k` tombe à 0 contre la DÉF de fin
 *     de partie. Formule ratio : Math.floor(a.atk * K * 200 / (200 + b.def)) »
 *
 *   « une compétence dont le type n'est ouvert par aucun trait est apprise
 *     mais invisible dans tous les menus »
 *
 * Le premier ne lève rien : `Math.max(eval(formule), 0)` rend 0, le combat
 * continue, et le joueur croit que sa compétence est faible. 214 compétences
 * sur 252 faisaient EXACTEMENT 0 dégât contre un boss.
 *
 * Le second ne lève rien non plus : la compétence est apprise, elle existe,
 * elle ne s'affiche nulle part.
 *
 * ⚠ ET UN PIÈGE DANS LE PIÈGE. Un type de compétence n'est pas ouvert que par
 * une CLASSE : un état, une arme, une armure ou un acteur le peuvent aussi
 * (trait 41). Les types « ombre de épée … ombre de arme à feu » sont ouverts
 * par les armes d'Ombre et par les quatre paliers de l'Amulette de ludwing ;
 * « JACKPOT » par l'état JACKPOT ; « Arts Sereins » par « La Fureur Froide ».
 * Un contrôle qui ne regarderait que `Classes.json` déclarerait 27 compétences
 * invisibles — et les « corriger » casserait la montée de l'Amulette.
 * On lit donc les CINQ sources de traits.
 *
 *   node bancs/11_degats_et_voies.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');
var L = function (n) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', n + '.json'), 'utf8')); };

// Le profil de référence est celui du banc de JOKO (`audit/7_nouveau_lot.js`),
// et il s'applique aux DEUX combattants.
//
// ⚠ Une première version ne donnait à l'attaquant que son ATQ et sa MAG, en
// laissant sa DÉF et sa MDF à zéro. « Garde Sereine » — a.atk*3 + a.mdf*2 -
// b.def — perdait alors son terme `a.mdf*2` et paraissait faire 0 dégât.
// Le banc accusait un innocent : mesurer l'attaquant amputé, ce n'est pas
// mesurer le jeu.
var PROFIL = { hp: 3000, mhp: 3000, mp: 400, mmp: 400, tp: 50,
    atk: 180, def: 130, mat: 180, mdf: 130, agi: 110, luk: 80, level: 35 };
// La DÉF qu'on affronte vraiment, relevée sur le bestiaire : rang D → boss.
var COURBE = [16, 42, 95, 190, 346, 798];
var DEF_BOSS = 798;
// Une compétence n'est pas « saine » parce qu'elle rend 1 : « Garde Sereine »
// faisait 670 à la référence et 2 contre un boss. C'est un effondrement.
var PLANCHER = 0.05;

// Les neuf Voies de `MaitriseVoies.js` (var VOIES, ligne 327).
var VOIES = ['forge', 'onde', 'source', 'miroir', 'vide', 'eclair', 'domaine', 'flash', 'sang'];

function degats(f, def) {
    try {
        var a = Object.assign({}, PROFIL);
        var b = Object.assign({}, PROFIL, def === undefined ? {} : { def: def, mdf: def });
        var v = eval('(function(a,b){return ' + f + ';})')(a, b);
        return isFinite(v) ? Math.max(0, Math.floor(v)) : null;   // le Math.max de MV
    } catch (e) { return null; }
}
/** Une formule « à caractère » (§4) : son identité, pas son équilibre. */
function aCaractere(f) {
    return /mhp|mmp|Math\.random|\$game|\bv\[|turnCount|aliveMembers|deadMembers|\.hp\b|\.mp\b|\.tp\b|level/i.test(f);
}
function voie(o) {
    var m = /<\s*Voie\s*:\s*([^>]+)>/i.exec(o.note || '');
    return m ? m[1].trim().toLowerCase() : '';
}
function voieDefaut(o) {
    var m = /<\s*VoieDefaut\s*:\s*([^>]+)>/i.exec(o.note || '');
    return m ? m[1].trim().toLowerCase() : '';
}

/** Les types ouverts par N'IMPORTE QUEL porteur de trait 41, pas que les classes. */
function typesOuverts(base) {
    var o = {};
    ['Classes', 'States', 'Weapons', 'Armors', 'Actors'].forEach(function (k) {
        (base[k] || []).forEach(function (x) {
            if (!x || !x.name) { return; }
            (x.traits || []).forEach(function (t) { if (t.code === 41) { o[t.dataId] = true; } });
        });
    });
    return o;
}

function controles(base) {
    var S = base.Skills, E = base.Enemies, Sy = base.System;
    var r = [];
    var reels = S.filter(function (s) { return s && s.name; });

    // ── 1. Aucune compétence ne s'effondre contre la DÉF de fin de partie ────
    var effondrees = [], protegees = 0;
    reels.forEach(function (s) {
        var d = s.damage || {};
        if (d.type !== 1 && d.type !== 5) { return; }
        var f = String(d.formula || '').trim();
        if (!f || f === '0') { return; }
        if (aCaractere(f)) { protegees++; return; }        // §4 : on n'y touche pas
        var ref = degats(f), boss = degats(f, DEF_BOSS);
        if (ref === null || boss === null || !(ref > 0)) { return; }
        if (boss < ref * PLANCHER) { effondrees.push(s.name + ' (' + ref + ' → ' + boss + ')'); }
    });
    r.push(['aucune compétence ne s\'effondre contre la DÉF d\'un boss (' + DEF_BOSS + ')', effondrees.length === 0,
        effondrees.length ? effondrees.length + ' : ' + effondrees.slice(0, 4).join(' · ')
            : reels.length + ' compétences · garde au moins ' + (PLANCHER * 100) + ' % de son dégât de référence · ' +
              protegees + ' formules « à caractère » épargnées (§4)']);

    // Et les dégâts doivent DÉCROÎTRE quand la défense monte — jamais l'inverse.
    var incoherentes = [];
    reels.forEach(function (s) {
        var d = s.damage || {};
        if (d.type !== 1 && d.type !== 5) { return; }
        var f = String(d.formula || '').trim();
        if (!f || f === '0' || aCaractere(f)) { return; }
        var v = COURBE.map(function (x) { return degats(f, x); });
        if (v.some(function (x) { return x === null; })) { return; }
        for (var i = 1; i < v.length; i++) { if (v[i] > v[i - 1]) { incoherentes.push(s.name); return; } }
    });
    r.push(['les dégâts décroissent quand la défense monte', incoherentes.length === 0,
        incoherentes.length ? incoherentes.length + ' : ' + incoherentes.slice(0, 3).join(' · ') : 'monotone sur toute la courbe D → boss']);

    // ── 2. Aucune compétence invisible ───────────────────────────────────────
    var ouverts = typesOuverts(base);

    // Le type 7 « MANA semi-parfait » n'était ouvert par rien : « ✶ la Convergence »
    // et « Tranche des Trois Sources » étaient apprises par l'Équilibre (niv. 45 et 20)
    // et introuvables dans tous les menus. JOKO, 2026-09-26 : « corrige tout » —
    // l'Équilibre ouvre maintenant le type 7. Plus aucune exception ici.
    var invisibles = reels.filter(function (s) { return s.stypeId > 0 && !ouverts[s.stypeId]; });
    var enAttente = [];
    var parType = {};
    invisibles.forEach(function (s) { (parType[s.stypeId] = parType[s.stypeId] || []).push(s.name); });
    r.push(['aucune compétence n\'est enfermée dans un type que rien n\'ouvre', invisibles.length === 0,
        invisibles.length ? invisibles.length + ' dans : ' + Object.keys(parType).map(function (t) {
            return '« ' + (Sy.skillTypes[t] || t) + ' » (' + parType[t].join(', ') + ')';
        }).join(' · ')
            : 'tous les types employés sont ouverts par une classe, un état ou un équipement' +
              (enAttente.length ? '  ⏳ sauf ' + enAttente.length + ' en attente de JOKO : ' +
                  enAttente.map(function (s) { return s.name; }).join(', ') : '')]);

    // ── 3. Les Voies ─────────────────────────────────────────────────────────
    var voiesInconnues = [];
    reels.forEach(function (s) { var v = voie(s); if (v && VOIES.indexOf(v) < 0) { voiesInconnues.push(s.name + ' → ' + v); } });
    [].concat(E, base.Actors, base.Classes, base.States).forEach(function (o) {
        if (!o || !o.name) { return; }
        var v = voieDefaut(o);
        if (v && VOIES.indexOf(v) < 0) { voiesInconnues.push(o.name + ' → VoieDefaut ' + v); }
    });
    r.push(['toute Voie nommée est l\'une des neuf que le plugin connaît', voiesInconnues.length === 0,
        voiesInconnues.length ? voiesInconnues.slice(0, 3).join(' · ') : VOIES.join(' · ')]);

    var parVoie = {};
    reels.forEach(function (s) { var v = voie(s); if (v) { parVoie[v] = (parVoie[v] || 0) + 1; } });
    var maigres = VOIES.filter(function (v) { return (parVoie[v] || 0) < 8; });
    r.push(['chaque Voie garde au moins 8 techniques', maigres.length === 0,
        maigres.length ? maigres.map(function (v) { return v + ':' + (parVoie[v] || 0); }).join(' · ')
            : VOIES.map(function (v) { return v + ':' + parVoie[v]; }).join(' ')]);

    // Une compétence dont le TYPE nomme une Voie doit porter cette Voie :
    // sinon le plugin retombe sur la <VoieDefaut> du lanceur, et le type ment.
    var typeMent = [];
    reels.forEach(function (s) {
        var nom = String(Sy.skillTypes[s.stypeId] || '').toLowerCase();
        var v = VOIES.filter(function (x) { return nom.indexOf(x) >= 0; })[0];
        if (v && voie(s) !== v) { typeMent.push(s.name + ' (type « ' + Sy.skillTypes[s.stypeId] +' »)'); }
    });
    r.push(['une compétence rangée dans un type qui nomme une Voie la porte', typeMent.length === 0,
        typeMent.length ? typeMent.length + ' : ' + typeMent.slice(0, 3).join(' · ') : 'aucun type ne ment sur sa Voie']);

    // Les quatre héros gardent la leur — c'est le lore (§7).
    var heros = base.Actors.filter(function (a) { return a && a.name && a.id <= 4; });
    var sansVoie = heros.filter(function (a) { return !voieDefaut(a); });
    r.push(['les quatre héros gardent leur VoieDefaut', sansVoie.length === 0,
        sansVoie.length ? sansVoie.map(function (a) { return a.name; }).join(', ')
            : heros.map(function (a) { return a.name + ':' + voieDefaut(a); }).join(' · ')]);

    var ennemis = E.filter(function (e) { return e && e.name; });
    var avec = ennemis.filter(function (e) { return voieDefaut(e); });
    r.push(['les ennemis attaquent par une Voie (au moins 200)', avec.length >= 200,
        avec.length + ' / ' + ennemis.length + ' ennemis portent une VoieDefaut']);

    return r;
}

// ═════════════════════════════════════════════════════════════════════════════
var BASE = { Skills: L('Skills'), Enemies: L('Enemies'), System: L('System'),
    Classes: L('Classes'), States: L('States'), Weapons: L('Weapons'),
    Armors: L('Armors'), Actors: L('Actors') };

var ok = 0, ko = 0;
console.log('LA FORME DES DÉGÂTS, ET LES VOIES\n');
console.log('1) Sur la vraie base');
controles(BASE).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

function copie(b) {
    var o = {};
    Object.keys(b).forEach(function (k) { o[k] = JSON.parse(JSON.stringify(b[k])); });
    return o;
}
function premiereOffensive(b) {
    return b.Skills.filter(function (s) { return s && s.name && s.damage && s.damage.type === 1 && s.damage.formula && !aCaractere(s.damage.formula); })[0];
}

var SABOTAGES = [
    ['une soustraction remise en place', function (b) {
        premiereOffensive(b).damage.formula = 'a.atk * 4 - b.def * 2';
    }, /s.effondre contre la DÉF/],
    ['une formule qui monte avec la défense', function (b) {
        premiereOffensive(b).damage.formula = 'Math.floor(a.atk * 2 + b.def * 3)';
    }, /décroissent quand la défense monte/],
    ['une compétence rangée dans un type que rien n\'ouvre', function (b) {
        // Le type 25 n'a pas de nom et n'est ouvert par personne (le 6 est devenu
        // « hiver », ouvert par l'Avatar de Korrah ; le 24 est devenu « arts »,
        // ouvert par Vesper le 2026-10-14 — le sabotage ne mordait plus).
        premiereOffensive(b).stypeId = 25;
    }, /enfermée dans un type/],
    ['l\'Amulette privée de ses types d\'Ombre', function (b) {
        // Le vrai piège : si on ne lisait que Classes.json, ce sabotage passerait
        // inaperçu. Ici on retire le trait de TOUS les porteurs — le contrôle doit
        // voir les compétences d'Ombre devenir introuvables.
        ['Weapons', 'Armors', 'States', 'Actors'].forEach(function (k) {
            b[k].forEach(function (x) {
                if (!x || !x.name) { return; }
                x.traits = (x.traits || []).filter(function (t) { return !(t.code === 41 && t.dataId >= 11 && t.dataId <= 19); });
            });
        });
    }, /enfermée dans un type/],
    ['une Voie inventée', function (b) {
        var s = premiereOffensive(b);
        s.note = String(s.note || '') + '\n<Voie: tonnerre>';
    }, /l'une des neuf/],
    ['une Voie vidée de ses techniques', function (b) {
        b.Skills.forEach(function (s) { if (s && s.note) { s.note = s.note.replace(/<Voie:\s*sang\s*>/gi, ''); } });
    }, /au moins 8 techniques/],
    ['une compétence du type « sang » sans sa Voie', function (b) {
        var s = b.Skills.filter(function (x) { return x && x.name && x.stypeId === 10; })[0];
        if (s) { s.note = String(s.note || '').replace(/<Voie:[^>]*>/gi, ''); }
    }, /type qui nomme une Voie/],
    ['Vesper privé de sa VoieDefaut', function (b) {
        var v = b.Actors.filter(function (a) { return a && a.name && a.id <= 4; })[0];
        v.note = String(v.note || '').replace(/<VoieDefaut:[^>]*>/gi, '');
    }, /héros gardent leur VoieDefaut/],
    ['les ennemis privés de leur Voie', function (b) {
        b.Enemies.forEach(function (e) { if (e && e.note) { e.note = e.note.replace(/<VoieDefaut:[^>]*>/gi, ''); } });
    }, /ennemis attaquent par une Voie/]
];

console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
SABOTAGES.forEach(function (s) {
    var b = copie(BASE);
    s[1](b);
    var vise = controles(b).filter(function (c) { return !c[1] && s[2].test(c[0]); });
    if (vise.length) { ok++; console.log('   ✓ ' + s[0] + '  →  « ' + vise[0][0] + ' » tombe'); }
    else { ko++; console.log('   ✗ ' + s[0] + '  →  son contrôle ne tombe PAS'); }
});

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
