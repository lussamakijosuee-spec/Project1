/*
 * LES RECETTES — des centaines d'événements communs PRÊTS À L'EMPLOI
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-09-26 : « des événements communs déjà faits, vraiment déjà
 * faits avec déjà des commandes […] pour allumer des lampes quand il fait
 * nuit […] pour une porte […] au moins cinq cents, voire plus. » Puis :
 * « il faut que le programme puisse marcher. »
 *
 * Les recettes sont écrites dans bancs/outils/recettes/r*.js avec un petit
 * vocabulaire (recettes/dsl.js) qui produit de VRAIES commandes MV. Ici on
 * les pose dans data/CommonEvents.json, à partir de 1001 :
 *   · un séparateur « ▬▬ ✎ THÈME ▬▬ » avant chaque thème ;
 *   · un événement commun « ✎ Thème · Recette » par recette, déclencheur
 *     « Aucun » (sauf les systèmes qui doivent tourner seuls : parallèles,
 *     sur un interrupteur ✎ éteint au départ).
 * Les interrupteurs et variables 901+ qu'elles emploient sont nommés « ✎ … ».
 *
 * AVANT d'écrire, tout est contrôlé ; au moindre défaut, rien n'est écrit :
 *   · chaque son, musique, animation, objet, arme, armure, troupe, état,
 *     héros existe ;
 *   · chaque commande de plugin est écoutée par un plugin actif ;
 *   · chaque script et chaque condition se compile ;
 *   · chaque bloc (si, choix, boucle, combat) est bien refermé.
 * L'exécution réelle est vérifiée par bancs/navigateur/les_recettes.js.
 *
 *   node bancs/outils/poser_les_recettes.js           → contrôle
 *   node bancs/outils/poser_les_recettes.js --ecrire  → écrit
 */
'use strict';
var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var RACINE = path.join(__dirname, '..', '..');
var DATA = path.join(RACINE, 'data');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var DSL = require('./recettes/dsl.js');
var DEBUT = 1001;

var L = function (n) { return JSON.parse(fs.readFileSync(path.join(DATA, n + '.json'), 'utf8')); };
var ITEMS = L('Items'), WEAP = L('Weapons'), ARM = L('Armors'), TROOPS = L('Troops'), STATES = L('States'), ACTORS = L('Actors'), ANIMS = L('Animations'), SKILLS = L('Skills');

var themes = [];
fs.readdirSync(path.join(__dirname, 'recettes')).filter(function (f) { return /^r\d.*\.js$/.test(f); }).sort().forEach(function (f) {
    themes = themes.concat(require('./recettes/' + f));
});

/* ── les commandes de plugin écoutées (le carnet les lit dans le code) ─── */
cp.execSync('node ' + JSON.stringify(path.join(__dirname, 'carnet_des_plugins.js')) + ' --json', { stdio: 'ignore' });
var BRUT = path.join(__dirname, 'carnet_brut.json');
var ecoute = {};
JSON.parse(fs.readFileSync(BRUT, 'utf8')).forEach(function (p) { p.commandes.forEach(function (c) { ecoute[c.casse ? c.nom.toLowerCase() : c.nom] = c.casse ? 'i' : 'x'; }); });
fs.unlinkSync(BRUT);

function existeAudio(dossier, nom) {
    return !nom || ['.ogg', '.m4a'].some(function (e) { return fs.existsSync(path.join(RACINE, 'audio', dossier, nom + e)); });
}
function existeImage(dossier, nom) {
    return !nom || ['.png', '.jpg'].some(function (e) { return fs.existsSync(path.join(RACINE, 'img', dossier, nom + e)); });
}

var defauts = [], total = 0;
function controle(nom, liste) {
    function err(m) { defauts.push(nom + ' : ' + m); }
    var pile = [];
    liste.forEach(function (c, i) {
        var p = c.parameters, code = c.code;
        if (typeof code !== 'number' || c.indent < 0) err('commande mal formée à la ligne ' + i);
        if (code === 250 || code === 241 || code === 245 || code === 249 || code === 132) {
            var dos = { 250: 'se', 241: 'bgm', 245: 'bgs', 249: 'me', 132: 'bgm' }[code];
            if (!existeAudio(dos, p[0].name)) err('son absent : audio/' + dos + '/' + p[0].name);
        }
        if (code === 205) p[1].list.forEach(function (m) { if (m.code === 44 && !existeAudio('se', m.parameters[0].name)) err('son absent (déplacement) : ' + m.parameters[0].name); if (m.code === 41 && !existeImage('characters', m.parameters[0])) err('sprite absent : ' + m.parameters[0]); });
        if (code === 212 && !ANIMS[p[1]]) err('animation absente : ' + p[1]);
        if (code === 126 && !ITEMS[p[0]]) err('objet absent : ' + p[0]);
        if (code === 127 && !WEAP[p[0]]) err('arme absente : ' + p[0]);
        if (code === 128 && !ARM[p[0]]) err('armure absente : ' + p[0]);
        if (code === 301 && !TROOPS[p[1]]) err('troupe absente : ' + p[1]);
        if (code === 313 && !STATES[p[3]]) err('état absent : ' + p[3]);
        if ((code === 129 || code === 303 || code === 320 || code === 324) && !ACTORS[p[0]]) err('héros absent : ' + p[0]);
        if (code === 318 && !SKILLS[p[3]]) err('compétence absente : ' + p[3]);
        if (code === 302 || code === 605) { var t = [ITEMS, WEAP, ARM][p[0]]; if (!t[p[1]]) err('marchandise absente : ' + p[0] + '/' + p[1]); }
        if (code === 111 && p[0] === 8 && !ITEMS[p[1]]) err('condition sur un objet absent : ' + p[1]);
        if (code === 111 && p[0] === 9 && !WEAP[p[1]]) err('condition sur une arme absente : ' + p[1]);
        if (code === 356) {
            var mot = String(p[0]).trim().split(/\s+/)[0];
            if (ecoute[mot] !== 'x' && ecoute[mot.toLowerCase()] !== 'i') err('commande de plugin sans écoute : ' + p[0]);
        }
        if (code === 355) {
            var s = p[0], j = i + 1;
            while (liste[j] && liste[j].code === 655) { s += '\n' + liste[j].parameters[0]; j++; }
            try { new Function(s); } catch (e) { err('script invalide : ' + e.message + ' — ' + s.slice(0, 60)); }
        }
        if (code === 111 && p[0] === 12) { try { new Function('return (' + p[1] + ');'); } catch (e) { err('condition invalide : ' + p[1]); } }
        if (code === 122 && p[3] === 4) { try { new Function('return (' + p[4] + ');'); } catch (e) { err('formule invalide : ' + p[4]); } }
        // les blocs se ferment
        if (code === 111 || code === 102 || code === 112 || (code === 301 && (p[2] || p[3]))) pile.push(code);
        if (code === 412 || code === 404 || code === 413 || code === 604) pile.pop();
    });
    if (pile.length) err('bloc non refermé (' + pile.join(',') + ')');
    var der = liste[liste.length - 1];
    if (!der || der.code !== 0 || der.indent !== 0) err('liste mal terminée');
}

function versListe(cmds) {
    return cmds.map(function (c) { return { code: c[0], indent: c[1], parameters: c[2] }; }).concat([{ code: 0, indent: 0, parameters: [] }]);
}
function entete(theme, r) {
    var l = [];
    DSL.note('══ ' + theme.toUpperCase() + ' · ' + r.nom + ' ══').forEach(function (c) { l.push(c); });
    if (r.aide) DSL.note(r.aide).forEach(function (c) { l.push(c); });
    DSL.note(r.declencheur ? 'Tourne tout seul (processus parallèle) quand l\'interrupteur ' + r.declencheur.sw + ' est allumé.' : 'Déclencheur « Aucun » : appelle-le depuis un événement (« Événement commun »), ou copie ses lignes.').forEach(function (c) { l.push(c); });
    return l;
}

var nouveaux = [];
themes.forEach(function (th) {
    var sep = versListe(DSL.note('Séparateur : les événements communs qui suivent sont les recettes « ' + th.theme + ' ».'));
    nouveaux.push({ name: '▬▬ ✎ ' + th.theme.toUpperCase() + ' ▬▬', list: sep, trigger: 0, switchId: 1 });
    th.recettes.forEach(function (r) {
        var liste = versListe(entete(th.theme, r).concat(r.cmds));
        controle(th.theme + ' · ' + r.nom, liste);
        total++;
        nouveaux.push({ name: '✎ ' + th.theme.split(/[ ,]/)[0] + ' · ' + r.nom, list: liste,
            trigger: r.declencheur ? r.declencheur.type : 0, switchId: r.declencheur ? r.declencheur.sw : 1 });
    });
});

console.log('   ' + themes.length + ' thèmes · ' + total + ' recettes · ' + nouveaux.length + ' événements communs (' + DEBUT + '–' + (DEBUT + nouveaux.length - 1) + ')');
if (defauts.length) {
    console.log('   ✗ ' + defauts.length + ' défaut(s) :\n     ' + defauts.slice(0, 40).join('\n     '));
    process.exit(1);
}
console.log('   ✓ sons, animations, objets, troupes, états, héros, commandes de plugin, scripts, blocs : tout existe et tout se ferme');

if (!ECRIRE) process.exit(0);

/* ── écrire : événements communs ─────────────────────────────────────── */
var atelier = require('./atelier.js');
var FCE = path.join(DATA, 'CommonEvents.json');
var CE = JSON.parse(fs.readFileSync(FCE, 'utf8'));
var FIN = DEBUT + nouveaux.length - 1;
for (var n = DEBUT; n < CE.length; n++) {
    var c = CE[n];
    if (c && !atelier.estCEAtelier(c) && (c.name || (c.list && c.list.length > 1))) { console.log('   ✗ l\'événement commun ' + n + ' « ' + c.name + ' » n\'est pas à l\'atelier.'); process.exit(1); }
}
CE.length = DEBUT;                       // on repart des recettes (idempotent)
nouveaux.forEach(function (x, i) { CE.push({ id: DEBUT + i, list: x.list, name: x.name, switchId: x.switchId, trigger: x.trigger }); });
fs.writeFileSync(FCE, '[\n' + CE.map(function (x) { return JSON.stringify(x); }).join(',\n') + '\n]');

/* ── écrire : les noms des interrupteurs et variables ✎ ───────────────── */
var FS = path.join(DATA, 'System.json');
var brut = fs.readFileSync(FS, 'utf8'), SYS = JSON.parse(brut);
function nommer(tab, noms) {
    Object.keys(noms).forEach(function (id) {
        id = Number(id);
        while (tab.length <= id) tab.push('');
        if (tab[id] && !/^✎ /.test(tab[id])) { console.log('   ✗ ' + id + ' porte déjà le nom « ' + tab[id] + ' »'); process.exit(1); }
        tab[id] = noms[id];
    });
}
nommer(SYS.switches, DSL.NOMS_SW);
nommer(SYS.variables, DSL.NOMS_VAR);
fs.writeFileSync(FS, JSON.stringify(SYS) + (brut.endsWith('\n') ? '\n' : ''));
console.log('   écrit : événements communs ' + DEBUT + '–' + FIN + ' · ' + Object.keys(DSL.NOMS_SW).length + ' interrupteurs et ' + Object.keys(DSL.NOMS_VAR).length + ' variables ✎ nommés');
