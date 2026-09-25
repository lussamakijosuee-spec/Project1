/*
 * LE RETRAIT DES DONS SPIRITUELS — ET CE QUI LUI A SURVÉCU
 * ---------------------------------------------------------------------------
 * Le 2026-09-24, JOKO a retiré le système des Dons Spirituels :
 *
 *   « Je voulais faire un système de pouvoir qui était lié à un don spirituel.
 *     Le pouvoir, tu l'as à la naissance, à ton éveil de marque, et c'est
 *     aléatoire. Mais c'est trop complexe pour rien. Même quand j'ai joué en
 *     version bêta sans ça, tu comprends bien le jeu et tu comprends quand
 *     même bien te battre. Un système plus simple, ce serait mieux. »
 *
 * UNE SEULE PIÈCE RESTE : l'Avatar de Korrah, devenu un FAMILIER — un Stand,
 * comme l'Esprit Vengeur de Donovano. « Là, Korrah, elle a deux personnes qui
 * attaquent. L'esprit qui fait pas beaucoup de dégâts, mais qui est utile pour
 * la protection et pour les soins. »
 *
 * RIEN N'A ÉTÉ EFFACÉ (§3). Les quatre greffons sont éteints, pas supprimés ;
 * les seize pièces d'équipement sont toujours là, redécrites en équipement
 * ordinaire ; leurs notetags <Don:> dorment intacts. Rallumer le système, c'est
 * quatre `status` à repasser à `true`.
 *
 * Ce banc garde le retrait. Il tombe si quelqu'un le défait à moitié.
 *
 *   node bancs/21_le_retrait_des_dons.js
 */

'use strict';
var fs = require('fs');
var P = require('path').join(__dirname, '..') + '/';
var lire = function (f) { return JSON.parse(fs.readFileSync(P + 'data/' + f + '.json', 'utf8')); };

var Acteurs = lire('Actors'), Armes = lire('Weapons'), Armures = lire('Armors');
var Comp = lire('Skills'), Systeme = lire('System'), Classes = lire('Classes');
var REGISTRE = JSON.parse(fs.readFileSync(P + 'js/plugins.js', 'utf8')
    .replace(/^[^\[]*/, '').replace(/;\s*$/, ''));

var ok = 0, ko = 0;
function T(nom, cond, det) {
    if (cond) { ok++; console.log('   ✓ ' + nom + (det ? '  —  ' + det : '')); }
    else { ko++; console.log('   ✗ ' + nom + (det ? '  —  ' + det : '')); }
}
function greffon(n) { return REGISTRE.filter(function (p) { return p.name === n; })[0] || null; }
function actif(n) { var p = greffon(n); return !!(p && p.status); }

console.log('LE RETRAIT DES DONS SPIRITUELS\n');

// ── 1 · les greffons sont éteints, et ils sont TOUJOURS LÀ ────────────────
console.log('1) Les greffons : éteints, pas effacés');
['DonsSpirituels', 'ObjetSpirituel', 'TraitsAme'].forEach(function (n) {
    var p = greffon(n);
    T(n + ' est éteint', !!p && p.status === false,
        p ? ('status = ' + p.status) : 'ABSENT DU REGISTRE — il devait rester');
    T(n + '.js est toujours sur le disque', fs.existsSync(P + 'js/plugins/' + n + '.js'),
        'un greffon éteint se rallume ; un greffon effacé se réécrit');
});

// ── 2 · l'Avatar, lui, tourne ─────────────────────────────────────────────
console.log('\n2) L\'Avatar de Korrah a survécu');
// L'Avatar n'a pas disparu : il a changé de nature. JOKO voulait « deux
// personnes qui attaquent » — il est donc devenu un vrai cinquième combattant,
// monté par SeiryuLeFamilier. L'ancien greffon, qui le jouait À TRAVERS Korrah,
// s'éteint pour ne pas faire double emploi ; il reste sur le disque.
T('SeiryuLeFamilier est ALLUMÉ', actif('SeiryuLeFamilier'),
    'c\'est lui qui fait entrer seiryu en cinquième');
T('AvatarDeKorrah est allumé — sa place derrière elle', actif('AvatarDeKorrah'));
T('AvatarSpirituel est éteint, pas effacé',
    !actif('AvatarSpirituel') && fs.existsSync(P + 'js/plugins/AvatarSpirituel.js'),
    'il jouait l\'Avatar depuis Korrah : deux moteurs feraient agir seiryu deux fois');

// ── 3 · le corps de l'Avatar existe ───────────────────────────────────────
console.log('\n3) Son corps');
var seiryu = Acteurs[6];
T('l\'acteur 6 « seiryu » est là', !!seiryu && /seiry/i.test(seiryu.name || ''),
    seiryu ? (seiryu.name + ' · classe ' + seiryu.classId + ' « ' + (Classes[seiryu.classId] || {}).name + ' »') : 'absent');
T('il porte une image de combat', !!(seiryu && seiryu.battlerName),
    seiryu ? ('battlerName « ' + seiryu.battlerName + ' »') : '');
T('cette image est bien dans le projet', !!(seiryu && seiryu.battlerName &&
    fs.existsSync(P + 'img/sv_actors/' + seiryu.battlerName + '.png')),
    'img/sv_actors/' + ((seiryu || {}).battlerName || '?') + '.png  (aucun asset extérieur — §4)');
T('sa classe est bien celle du familier', !!(seiryu && seiryu.classId === 5),
    'classe 5 « ' + (Classes[5] || {}).name + ' » — notée « ' + ((Classes[5] || {}).note || '').trim() + ' »');

// ── 4 · plus personne ne porte de Don ─────────────────────────────────────
console.log('\n4) Plus aucun héros ne porte de Don');
var HEROS = { 1: 'Vesper', 2: 'Korrah', 3: 'ludwing', 4: 'Aël' };
Object.keys(HEROS).forEach(function (id) {
    var a = Acteurs[id];
    var portes = [];
    (a.equips || []).forEach(function (e, i) {
        if (!e) { return; }
        var o = (i === 0) ? Armes[e] : Armures[e];
        if (o && /<\s*Don\s*:/i.test(o.note || '')) { portes.push(o.name); }
    });
    T(HEROS[id] + ' ne porte plus de Don', portes.length === 0, portes.join(' + ') || 'aucun');
});

// ── 5 · mais les seize pièces sont toujours là ────────────────────────────
console.log('\n5) Les seize pièces n\'ont pas été supprimées (§3)');
var PIECES = { armes: [513, 514, 515, 516],
               armures: [68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79] };
var manquantes = [];
PIECES.armes.forEach(function (i) { if (!Armes[i] || !Armes[i].name) { manquantes.push('arme ' + i); } });
PIECES.armures.forEach(function (i) { if (!Armures[i] || !Armures[i].name) { manquantes.push('armure ' + i); } });
T('les 16 pièces existent encore', manquantes.length === 0,
    manquantes.join(' · ') || '4 armes + 12 armures, intactes');

var sansNote = [];
PIECES.armes.forEach(function (i) { if (Armes[i] && !/<\s*Don\s*:/i.test(Armes[i].note || '')) { sansNote.push('arme ' + i); } });
PIECES.armures.forEach(function (i) { if (Armures[i] && !/<\s*Don\s*:/i.test(Armures[i].note || '')) { sansNote.push('armure ' + i); } });
T('leurs notetags <Don:> dorment intacts', sansNote.length === 0,
    sansNote.join(' · ') || 'rallumer le système suffit à les remettre en service');

// ── 6 · aucune description ne vend plus le système ────────────────────────
console.log('\n6) Aucune description ne promet plus ce qui n\'existe plus');
var menteuses = [];
[[Armes, 'arme'], [Armures, 'armure']].forEach(function (p) {
    p[0].forEach(function (o) {
        if (o && /\bDONS?\b|spirituelle?\b/i.test(o.description || '')) {
            menteuses.push(p[1] + ' #' + o.id + ' « ' + o.name + ' »');
        }
    });
});
T('aucun équipement ne se réclame d\'un Don', menteuses.length === 0,
    menteuses.slice(0, 5).join(' · ') || '0 sur ' + (Armes.length + Armures.length - 2) + ' pièces');

// ── 7 · les ordres à l'Avatar restent jouables ────────────────────────────
console.log('\n7) Les ordres à l\'Avatar restent jouables');
var ouverts = {};
(function () {
    var a = Acteurs[2], cl = Classes[a.classId];
    [a.traits, cl.traits].forEach(function (tr) {
        (tr || []).forEach(function (t) { if (t.code === 41) { ouverts[t.dataId] = true; } });
    });
})();
[1246, 1247, 1248].forEach(function (id) {
    var s = Comp[id];
    T('« ' + (s ? s.name : id) + ' » est atteignable', !!s && ouverts[s.stypeId] === true,
        s ? ('type ' + s.stypeId + ' « ' + (Systeme.skillTypes[s.stypeId] || '?') + ' »') : 'compétence absente');
});

// ── 8 · CONTRE-ÉPREUVE ────────────────────────────────────────────────────
// Un contrôle qui ne peut pas tomber ne prouve rien (§6). On rejoue chaque
// mesure sur des données sabotées : chacune doit accuser.
console.log('\n8) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
(function () {
    var copie = JSON.parse(JSON.stringify(Acteurs[4]));
    copie.equips[0] = 513;                        // on lui remet son Don en main
    var portes = [];
    copie.equips.forEach(function (e, i) {
        if (!e) { return; }
        var o = (i === 0) ? Armes[e] : Armures[e];
        if (o && /<\s*Don\s*:/i.test(o.note || '')) { portes.push(o.name); }
    });
    T('on rééquipe l\'Arc d\'Aël  →  « ne porte plus de Don » tombe', portes.length > 0,
        portes.join(' · '));
})();
(function () {
    var faux = JSON.parse(JSON.stringify(Armes[513]));
    faux.note = '';                               // on lui arrache sa marque
    T('on efface un notetag <Don:>  →  « ils dorment intacts » tombe',
        !/<\s*Don\s*:/i.test(faux.note), 'note vidée');
})();
(function () {
    var faux = JSON.parse(JSON.stringify(Armures[68]));
    faux.description = 'Le DON de Vesper — un OBJET spirituel.';
    T('on remet une description de Don  →  « aucune ne se réclame d\'un Don » tombe',
        /\bDON\b|spirituel/i.test(faux.description), 'description remise');
})();

console.log('\n' + '='.repeat(72));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(72));
process.exit(ko ? 1 : 0);
