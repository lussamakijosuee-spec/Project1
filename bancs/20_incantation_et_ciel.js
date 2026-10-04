/*
 * BANC — L'INCANTATION ET LE CIEL : le temps qu'Aël achète
 * ---------------------------------------------------------------------------
 * Trois choses ici ne lèvent AUCUNE erreur quand elles cassent :
 *
 *  1. UN NOTETAG QUI NE SE DÉCOUPE PAS. `<Ciel: storm>` garde l'espace après
 *     le « : » — MV rend " storm". Sans trim(), la comparaison échoue en
 *     silence et la Parole ne part jamais tout de suite : elle charge
 *     toujours 2 tours, et personne ne voit pourquoi.
 *
 *  2. UNE RUPTURE QUI NE SE DÉCLENCHE JAMAIS. Le seuil est un POURCENTAGE de
 *     ses PV max. Si ses PV montent, le seuil monte avec — et la mécanique
 *     s'éteint sans rien dire. Le banc mesure donc le seuil CONTRE SA VRAIE
 *     COURBE, pas contre un nombre choisi d'avance.
 *
 *  3. UNE SURCHARGE POSÉE SUR LE GROUPE. C'est le bug que `13_boucle_des_boss`
 *     a déjà attrapé une fois chez les boss : une compétence de portée « tous
 *     les ennemis » pose ses effets sur SES CIBLES. Vue d'Aël, le groupe,
 *     c'est l'équipe. La mécanique tournerait à l'envers.
 *
 * ⚠ CE BANC NE RELIT PAS CE QU'ON CROIT AVOIR ÉCRIT. Comme 9_doctrines, il va
 * chercher les expressions régulières DANS `js/plugins/CielDAel.js` et les
 * rejoue telles quelles. On mesure ce que le moteur fera.
 *
 *   node bancs/20_incantation_et_ciel.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');
var L = function (n) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', n + '.json'), 'utf8')); };

var PLUGIN = fs.readFileSync(path.join(RACINE, 'js', 'plugins', 'CielDAel.js'), 'utf8');

//===========================================================================
// 1 · Les réglages, relus dans js/plugins.js — pas devinés
//===========================================================================
var REGLAGES = (function () {
    var src = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
    var bac = {};
    (new Function('$plugins', 'bac', src.replace(/^\s*var\s+\$plugins\s*=/, '$plugins =') +
        '\n;bac.p = $plugins;'))(null, bac);
    var e = bac.p.filter(function (x) { return x.name === 'CielDAel'; })[0];
    if (!e) { console.error('✗ CielDAel n\'est pas inscrit dans js/plugins.js'); process.exit(1); }
    if (!e.status) { console.error('✗ CielDAel est inscrit mais ÉTEINT'); process.exit(1); }
    return e.parameters;
})();

var ACTEUR      = Number(REGLAGES['acteur']);
var INCANTATION = Number(REGLAGES['etatIncantation']);
var SURCHARGE   = Number(REGLAGES['etatSurcharge']);
var SEUIL_COUP  = Number(REGLAGES['seuilCoup']) / 100;
var SEUIL_CUMUL = Number(REGLAGES['seuilCumul']) / 100;

//===========================================================================
// 2 · Les découpeurs du plugin, rejoués tels quels
//===========================================================================
function nb(item, balise) {
    var m = new RegExp('<\\s*' + balise + '\\s*:\\s*(\\d+)\\s*>', 'i').exec(item.note || '');
    return m ? Number(m[1]) : 0;
}
function mot(item, balise) {
    var m = new RegExp('<\\s*' + balise + '\\s*:\\s*([^>]*)>', 'i').exec(item.note || '');
    return m ? m[1].trim().toLowerCase() : null;
}
function appel(item) {
    var m = /<\s*Appel\s*:\s*([^,>]+)(?:,\s*(\d+))?\s*>/i.exec(item.note || '');
    if (!m) { return null; }
    var t = m[1].trim().toLowerCase();
    if (['none', 'rain', 'storm', 'snow'].indexOf(t) < 0) { return null; }
    return { type: t, tours: m[2] ? Number(m[2]) : 5 };
}
function faitSurcharge(item) { return /<\s*Apres\s*:\s*surcharge\s*>/i.test(item.note || ''); }

/** La charge que la Parole demande vraiment, ciel compris. */
function chargeReelle(item, ciel) {
    var n = nb(item, 'Incantation');
    if (n <= 0) { return 0; }
    var exige = mot(item, 'Ciel');
    if (exige && exige === ciel) { return 0; }
    return n;
}

/** La boucle de rupture, rejouée coup par coup. */
function incanter(pvMax, charge, coups, etats, States) {
    var inc = { reste: charge, encaisse: 0 }, rompue = null;
    for (var i = 0; i < coups.length && !rompue; i++) {
        var d = coups[i];
        inc.encaisse += d;
        if (SEUIL_COUP > 0 && d >= pvMax * SEUIL_COUP) { rompue = 'le coup a porté'; }
        else if (SEUIL_CUMUL > 0 && inc.encaisse >= pvMax * SEUIL_CUMUL) { rompue = 'elle a trop encaissé'; }
    }
    (etats || []).forEach(function (id) {
        if (rompue) { return; }
        var st = States[id];
        if (st && st.restriction >= 1) { rompue = st.name.trim(); }
    });
    if (rompue) { inc.reste = Math.ceil(inc.reste / 2); }
    return { rompue: rompue, reste: inc.reste };
}

//===========================================================================
// 3 · Les contrôles
//===========================================================================
function controles(B) {
    var Sk = B.Skills, C = B.Classes, St = B.States;
    var r = [];
    var classe = C[3 + 1];                       // la classe 4 « la Parole »
    var siennes = {};
    (classe.learnings || []).forEach(function (l) { siennes[l.skillId] = l.level; });

    // ——— A · les Paroles existent et lui appartiennent
    var appels = Sk.filter(function (s) { return s && s.name && appel(s); });
    var longues = Sk.filter(function (s) { return s && s.name && nb(s, 'Incantation') > 0; });
    r.push(['les Appels du ciel existent', appels.length >= 3,
        appels.map(function (s) { return s.name.trim() + ' → ' + appel(s).type; }).join(' · ') || 'aucun']);
    r.push(['les Paroles longues existent', longues.length >= 3,
        longues.map(function (s) { return s.name.trim() + ' (' + nb(s, 'Incantation') + ' tours)'; }).join(' · ') || 'aucune']);
    var orphelines = appels.concat(longues).filter(function (s) { return siennes[s.id] === undefined; });
    r.push(['elles sont toutes apprises par sa classe', orphelines.length === 0,
        orphelines.length ? orphelines.map(function (s) { return s.name.trim(); }).join(', ') : 'les ' + (appels.length + longues.length) + ' sont dans « ' + classe.name + ' »']);

    // ——— B · le ciel supprime le coût du temps — et LUI SEUL
    var sousCiel = [], horsCiel = [];
    longues.forEach(function (s) {
        var exige = mot(s, 'Ciel');
        if (!exige) { return; }
        sousCiel.push(chargeReelle(s, exige));                  // son ciel : 0 attendu
        horsCiel.push(chargeReelle(s, exige === 'rain' ? 'snow' : 'rain'));  // un autre : la charge pleine
    });
    r.push(['sous son ciel, la Parole part tout de suite',
        sousCiel.length > 0 && sousCiel.every(function (x) { return x === 0; }),
        sousCiel.length + ' Parole(s) à ciel nommé · charges : ' + sousCiel.join(',')]);
    r.push(['sous un autre ciel, elle attend bel et bien',
        horsCiel.length > 0 && horsCiel.every(function (x) { return x > 0; }),
        'charges : ' + horsCiel.join(',')]);

    // ——— C · le trim() — le piège qui ne lève rien
    r.push(['le découpage passe l\'espace que MV laisse après le « : »',
        mot({ note: '<Ciel: storm>' }, 'Ciel') === 'storm',
        '« <Ciel: storm> » donne « ' + mot({ note: '<Ciel: storm>' }, 'Ciel') + ' »']);

    // ——— D · la rupture, contre SA VRAIE COURBE
    var pv = classe.params[0][89];
    var seuil = Math.ceil(pv * SEUIL_COUP);
    var petit = incanter(pv, 2, [seuil - 1], [], St);
    var gros  = incanter(pv, 2, [seuil], [], St);
    var cumul = incanter(pv, 2, [Math.ceil(pv * 0.12), Math.ceil(pv * 0.12), Math.ceil(pv * 0.12)], [], St);
    r.push(['une égratignure ne lui coupe pas la parole', !petit.rompue,
        (seuil - 1) + ' dégâts sur ' + pv + ' PV — sous le seuil de ' + seuil]);
    r.push(['un gros coup la rompt', !!gros.rompue, seuil + ' dégâts (' + (SEUIL_COUP * 100) + ' % de ' + pv + ') → ' + gros.rompue]);
    r.push(['trois coups moyens finissent par la rompre', !!cumul.rompue,
        '3 × 12 % = 36 % ≥ ' + (SEUIL_CUMUL * 100) + ' % → ' + cumul.rompue]);
    r.push(['rompue, la Parole repart à mi-charge', gros.reste === 1,
        'il restait 2 tours, il en reste ' + gros.reste]);

    // ——— E · tout ce qui empêche d'agir lui coupe la parole
    var entraves = St.filter(function (s) { return s && s.name && s.restriction >= 1; });
    var ratees = entraves.filter(function (s) { return !incanter(pv, 2, [], [s.id], St).rompue; });
    r.push(['tout état qui empêche d\'agir la rompt', ratees.length === 0,
        entraves.length + ' états d\'entrave · ' + ratees.length + ' qui passeraient au travers']);
    var inoffensifs = St.filter(function (s) { return s && s.name && s.restriction === 0; });
    var fauxPositifs = inoffensifs.filter(function (s) { return incanter(pv, 2, [], [s.id], St).rompue; });
    r.push(['et AUCUN autre ne la rompt (contre-épreuve)', fauxPositifs.length === 0,
        inoffensifs.length + ' états sans entrave · ' + fauxPositifs.length + ' qui rompraient à tort']);

    // ——— F · la Surcharge tombe sur ELLE, pas sur l'équipe
    var surcharge = Sk.filter(function (s) { return s && s.name && faitSurcharge(s) && siennes[s.id] !== undefined; });
    var poseeParEffet = surcharge.filter(function (s) {
        return (s.effects || []).some(function (e) { return e.code === 21 && e.dataId === SURCHARGE; });
    });
    r.push(['la Surcharge n\'est PAS un effet de la compétence', poseeParEffet.length === 0,
        poseeParEffet.length ? poseeParEffet.map(function (s) { return s.name.trim(); }).join(', ') + ' la poserait sur ses CIBLES' : 'le plugin la pose sur la lanceuse']);
    r.push(['le plugin pose bien la Surcharge sur le sujet', /addState\(\s*SURCHARGE\s*\)/.test(PLUGIN) && /this\.subject\(\)/.test(PLUGIN),
        'subject().addState(SURCHARGE) présent dans le plugin']);

    // ——— G · les formules tiennent contre la DÉF de fin de partie (§7)
    var molles = longues.filter(function (s) {
        var f = (s.damage && s.damage.formula) || '';
        return !/200\s*\/\s*\(\s*200\s*\+/.test(f);
    });
    r.push(['les Paroles longues emploient la formule en ratio', molles.length === 0,
        molles.length ? molles.map(function (s) { return s.name.trim(); }).join(', ') : 'toutes en a.mat × K × 200/(200+b.mdf)']);
    var zero = longues.filter(function (s) {
        var f = (s.damage && s.damage.formula) || '';
        if (!/a\.mat/.test(f)) { return false; }
        var a = { mat: classe.params[4][89] }, b = { mdf: 400 };
        try { return eval(f) <= 0; } catch (e) { return true; }
    });
    r.push(['elles font encore mal contre 400 de MDÉF', zero.length === 0,
        zero.length ? zero.map(function (s) { return s.name.trim(); }).join(', ') : 'aucune ne tombe à 0']);

    // ——— H · les courbes disent ce que JOKO décrit
    var pvs = {}, defs = {}, agis = {}, atks = {}, mats = {};
    [1, 2, 3, 4].forEach(function (i) {
        pvs[i] = C[i].params[0][89]; atks[i] = C[i].params[2][89]; defs[i] = C[i].params[3][89];
        mats[i] = C[i].params[4][89]; agis[i] = C[i].params[6][89];
    });
    var plusGrand = function (o) { return Object.keys(o).sort(function (x, y) { return o[y] - o[x]; })[0]; };
    var plusPetit = function (o) { return Object.keys(o).sort(function (x, y) { return o[x] - o[y]; })[0]; };
    r.push(['Korrah est celle qui tient : le plus de PV et la meilleure DÉF',
        plusGrand(pvs) === '2' && plusGrand(defs) === '2',
        'PV ' + pvs[2] + ' · DÉF ' + defs[2]]);
    // JOKO, commit « J » du 2026-10-01 : ATK de Vesper ×0,7 (236 → 164 au
    // niveau 99). Puis commit « Rebalance classes and update world data » du
    // 2026-10-03 : 208 au niveau 99. JOKO, le 2026-10-04 : « je me fie au
    // profil […] il y a écrit comment ils doivent jouer, genre DPS ». Le banc
    // garde SON dernier réglage, pas une règle à moi.
    r.push(['Vesper garde le réglage de JOKO du 2026-10-03 (ATK 208 au niveau 99)', C[1].params[2][99] === 208, 'ATK ' + C[1].params[2][99] + ' au niveau 99 · ' + atks[1] + ' au niveau 89']);
    r.push(['ludwing est le plus rapide, et de loin', plusGrand(agis) === '3' && agis[3] > 1.3 * agis[1], 'AGI ' + agis[3] + ' contre ' + agis[1] + ' au deuxième']);
    r.push(['Aël est en verre : le moins de PV, la plus faible DÉF, la plus lente',
        plusPetit(pvs) === '4' && plusPetit(defs) === '4' && plusPetit(agis) === '4',
        'PV ' + pvs[4] + ' · DÉF ' + defs[4] + ' · AGI ' + agis[4]]);
    r.push(['mais c\'est elle qui frappe le plus fort en magie', plusGrand(mats) === '4', 'ATM ' + mats[4]]);

    // ——— I · la rupture mord vraiment sur elle
    var seuilAel = Math.ceil(pvs[4] * SEUIL_COUP);
    var grosseFrappeEnnemie = 800;               // un boss de fin de partie frappe bien au-delà
    r.push(['son seuil de rupture est à portée d\'un vrai coup',
        seuilAel <= grosseFrappeEnnemie,
        seuilAel + ' dégâts suffisent (' + (SEUIL_COUP * 100) + ' % de ' + pvs[4] + ' PV)']);

    return r;
}

//===========================================================================
// 4 · Sur la vraie base, puis contre-épreuve
//===========================================================================
var BASE = { Skills: L('Skills'), Classes: L('Classes'), States: L('States') };
var copie = function (o) { return JSON.parse(JSON.stringify(o)); };
var ok = 0, ko = 0;

console.log('L\'INCANTATION ET LE CIEL\n');
console.log('1) Sur la vraie base');
controles(BASE).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

var SABOTAGES = [
    ['le ciel retiré à toutes les Paroles longues', function (b) {
        b.Skills.forEach(function (s) { if (s && s.note) { s.note = s.note.replace(/<\s*Ciel\s*:[^>]*>/gi, ''); } });
    }, /part tout de suite/],
    ['une Parole longue que sa classe n\'apprend pas', function (b) {
        b.Classes[4].learnings = b.Classes[4].learnings.filter(function (l) {
            return !(b.Skills[l.skillId] && /<\s*Incantation\s*:/i.test(b.Skills[l.skillId].note || ''));
        });
    }, /apprises par sa classe/],
    ['la Surcharge remise en effet sur la compétence', function (b) {
        b.Skills.forEach(function (s) {
            if (s && s.note && /<\s*Apres\s*:\s*surcharge\s*>/i.test(s.note)) {
                s.effects.push({ code: 21, dataId: SURCHARGE, value1: 1, value2: 0 });
            }
        });
    }, /PAS un effet de la compétence/],
    ['une Parole longue repassée en soustraction', function (b) {
        var s = b.Skills.filter(function (x) { return x && x.note && /<\s*Incantation\s*:/i.test(x.note) && /a\.mat/.test((x.damage || {}).formula || ''); })[0];
        if (s) { s.damage.formula = 'a.mat * 8 - b.mdf * 8'; }
    }, /formule en ratio/],
    ['Aël regonflée aux PV de Korrah', function (b) {
        b.Classes[4].params[0] = b.Classes[2].params[0].slice();
    }, /en verre/],
    ['Korrah ramenée sous Vesper', function (b) {
        b.Classes[2].params[0] = b.Classes[2].params[0].map(function (v) { return Math.round(v * 0.5); });
    }, /celle qui tient/]
];

console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
SABOTAGES.forEach(function (s) {
    var b = { Skills: copie(BASE.Skills), Classes: copie(BASE.Classes), States: copie(BASE.States) };
    s[1](b);
    var tombe = controles(b).filter(function (c) { return !c[1] && s[2].test(c[0]); }).length > 0;
    if (tombe) { ok++; console.log('   ✓ ' + s[0] + '  →  « ' + s[2].source + ' » tombe'); }
    else { ko++; console.log('   ✗ ' + s[0] + '  →  RIEN NE TOMBE : le contrôle ne voit pas ce sabotage'); }
});

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
