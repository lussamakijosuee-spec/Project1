/*
 * RÉPARER LES HORAIRES DE JOKO
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-09-27 : « j'ai essayé de le faire moi-même en faisant
 * interrupteur, et on les voit apparaître à ce moment-là. Mais je ne sais pas
 * si ça marche bien. »
 *
 * Mesuré : ça ne pouvait pas marcher.
 *   · Ses pages testent les interrupteurs 101 à 115 (« Sunrise (6am - 8am) »,
 *     « Day (9am - 14pm) »…, « Friday »). Ces noms viennent de la démo MOG ;
 *     dans CE projet, MOG_TimeSystem allume les interrupteurs 200 à 214
 *     (« TS · Lever du jour », « TS · Jour »…, « TS · Vendredi »). Rien, nulle
 *     part, n'allume 101-115 : ces pages ne s'ouvraient jamais.
 *   · Une page à deux conditions de moment (« Crépuscule » ET « Nuit ») ne
 *     peut jamais être vraie : MV lit « et », pas « ou ». On la coupe en une
 *     page par moment.
 *   · Une page SANS condition placée APRÈS des pages conditionnelles gagne
 *     toujours (MV prend la dernière page valide) : les pages d'avant ne
 *     s'affichaient jamais. On la remet en tête.
 *   · Un processus parallèle qui lance une animation sans attente la relance
 *     à chaque image. On ajoute une attente de 2 secondes.
 *
 * Idempotent. Les cartes d'atelier ne sont pas touchées. Les noms 101-115
 * sont gardés, précédés d'un avertissement (rien n'est supprimé).
 *
 *   node bancs/outils/reparer_les_horaires.js            → constat
 *   node bancs/outils/reparer_les_horaires.js --ecrire   → répare
 */
'use strict';
var fs = require('fs');
var path = require('path');
var DATA = path.join(__dirname, '..', '..', 'data');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var atelier = require('./atelier.js');

var CORRESP = {};
for (var i = 101; i <= 115; i++) CORRESP[i] = 200 + (i - 101);    // 101 Aube → 200 … 115 Samedi → 214
var PHASES = [200, 201, 202, 203, 204, 205];
var journal = [];
function noter(t) { journal.push(t); }
function sansCondition(c) { return !(c.switch1Valid || c.switch2Valid || c.variableValid || c.selfSwitchValid || c.itemValid || c.actorValid); }

function reparerListe(liste, ou) {
    (liste || []).forEach(function (c) {
        if (c.code === 111 && c.parameters[0] === 0 && CORRESP[c.parameters[1]]) { noter(ou + ' : condition ' + c.parameters[1] + ' → ' + CORRESP[c.parameters[1]]); c.parameters[1] = CORRESP[c.parameters[1]]; }
        if (c.code === 121 && CORRESP[c.parameters[0]] && c.parameters[0] === c.parameters[1]) { noter(ou + ' : contrôle ' + c.parameters[0] + ' → ' + CORRESP[c.parameters[0]]); c.parameters[0] = c.parameters[1] = CORRESP[c.parameters[0]]; }
    });
}
function reparerEvenement(e, ou) {
    var avant = JSON.stringify(e);
    e.pages.forEach(function (p, k) {
        var c = p.conditions;
        if (c.switch1Valid && CORRESP[c.switch1Id]) { noter(ou + ' p' + (k + 1) + ' : interrupteur ' + c.switch1Id + ' → ' + CORRESP[c.switch1Id]); c.switch1Id = CORRESP[c.switch1Id]; }
        if (c.switch2Valid && CORRESP[c.switch2Id]) { noter(ou + ' p' + (k + 1) + ' : interrupteur ' + c.switch2Id + ' → ' + CORRESP[c.switch2Id]); c.switch2Id = CORRESP[c.switch2Id]; }
        reparerListe(p.list, ou + ' p' + (k + 1));
    });
    // « Crépuscule ET Nuit » → une page « Crépuscule », une page « Nuit »
    var pages = [];
    e.pages.forEach(function (p, k) {
        var c = p.conditions;
        if (c.switch1Valid && c.switch2Valid && PHASES.indexOf(c.switch1Id) >= 0 && PHASES.indexOf(c.switch2Id) >= 0 && c.switch1Id !== c.switch2Id) {
            noter(ou + ' p' + (k + 1) + ' : « ' + c.switch1Id + ' ET ' + c.switch2Id + ' » (jamais vrai) → deux pages, ' + c.switch1Id + ' OU ' + c.switch2Id);
            var a = JSON.parse(JSON.stringify(p)), b = JSON.parse(JSON.stringify(p));
            a.conditions.switch2Valid = false; b.conditions.switch1Id = c.switch2Id; b.conditions.switch2Valid = false;
            pages.push(a, b);
        } else pages.push(p);
    });
    // une page sans condition derrière des pages conditionnelles : remise en tête
    var libres = pages.filter(function (p) { return sansCondition(p.conditions); });
    var condi = pages.filter(function (p) { return !sansCondition(p.conditions); });
    var mal = pages.some(function (p, k) { return k > 0 && sansCondition(p.conditions) && pages.slice(0, k).some(function (q) { return !sansCondition(q.conditions); }); });
    if (mal && condi.every(function (p) { return (p.conditions.switch1Valid && PHASES.concat([206, 207]).indexOf(p.conditions.switch1Id) >= 0); })) {
        noter(ou + ' : la page sans condition passait après les pages de moment (elle gagnait toujours) → remise en tête');
        pages = libres.concat(condi);
    }
    // un processus parallèle qui relance une animation à chaque image
    pages.forEach(function (p, k) {
        if (p.trigger === 4 && p.list.some(function (x) { return x.code === 212; }) && !p.list.some(function (x) { return x.code === 230; })) {
            noter(ou + ' p' + (k + 1) + ' : animation relancée à chaque image → attente de 2 s ajoutée');
            p.list.splice(p.list.length - 1, 0, { code: 230, indent: 0, parameters: [120] });
        }
    });
    e.pages = pages;
    return JSON.stringify(e) !== avant;
}

var modifies = [];
fs.readdirSync(DATA).filter(function (f) { return /^Map\d+\.json$/.test(f) && !atelier.estAtelier(f); }).forEach(function (f) {
    var m = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')), change = false;
    m.events.forEach(function (e) { if (e && reparerEvenement(e, f.replace('.json', '') + ' év.' + e.id + ' « ' + e.name + ' »')) change = true; });
    if (change) modifies.push([f, m]);
});
var FCE = path.join(DATA, 'CommonEvents.json'), CE = JSON.parse(fs.readFileSync(FCE, 'utf8')), ceChange = false;
CE.forEach(function (c) {
    if (!c || atelier.estCEAtelier(c)) return;
    var avant = JSON.stringify(c);
    if (c.trigger && CORRESP[c.switchId]) { noter('événement commun ' + c.id + ' : interrupteur ' + c.switchId + ' → ' + CORRESP[c.switchId]); c.switchId = CORRESP[c.switchId]; }
    reparerListe(c.list, 'événement commun ' + c.id);
    if (JSON.stringify(c) !== avant) ceChange = true;
});

console.log('   ' + journal.length + ' réparation(s) :');
journal.forEach(function (t) { console.log('     · ' + t); });
if (!ECRIRE) process.exit(0);
modifies.forEach(function (x) { fs.writeFileSync(path.join(DATA, x[0]), JSON.stringify(x[1])); });
if (ceChange) fs.writeFileSync(FCE, '[\n' + CE.map(function (x) { return JSON.stringify(x); }).join(',\n') + '\n]');
var FS = path.join(DATA, 'System.json'), brut = fs.readFileSync(FS, 'utf8'), SYS = JSON.parse(brut);
for (var n = 101; n <= 115; n++) {
    if (SYS.switches[n] && !/^✗ /.test(SYS.switches[n])) SYS.switches[n] = '✗ jamais allumé → ' + CORRESP[n] + ' · ' + SYS.switches[n];
}
fs.writeFileSync(FS, JSON.stringify(SYS) + (brut.endsWith('\n') ? '\n' : ''));
console.log('   écrit : ' + modifies.map(function (x) { return x[0]; }).join(', ') + (ceChange ? ', CommonEvents.json' : '') + ' ; noms 101-115 marqués « ✗ jamais allumé → 2xx »');
