/*
 * BANC — LES AUTORUN QUI NE SE RELÂCHENT PAS
 * ---------------------------------------------------------------------------
 * LE DÉFAUT QU'IL ATTRAPE, ET POURQUOI IL EST LE PIRE DE TOUS
 *
 * Un événement commun en AUTORUN tourne tant que son interrupteur est allumé,
 * et il BLOQUE tout : le joueur ne marche plus, n'ouvre plus le menu, ne peut
 * plus sauvegarder ni fuir. Le seul moyen d'en sortir est que l'événement
 * éteigne lui-même son interrupteur.
 *
 * Rien ne le signale. Pas d'erreur, pas de log : l'écran se fige, simplement.
 * Et ça ne se voit pas à la lecture — il faut croiser TROIS fichiers :
 * l'événement (est-il en autorun ?), son contenu (éteint-il son interrupteur ?),
 * et tout le reste du jeu (cet interrupteur est-il allumé quelque part ?).
 *
 * Le cas réel : l'interrupteur 40 « combat » est allumé par le PNJ
 * d'entraînement (EC 58) et par Map036/ev26. PERSONNE ne l'éteint. EC 57
 * tourne en autorun dessus. Dès que le joueur acceptait l'entraînement, la
 * partie se figeait — définitivement.
 *
 * ⚠ ET LE CONTRÔLE INNOCENTE LES FAUX (§6). Un autorun dont l'interrupteur
 * n'est allumé NULLE PART ne peut pas geler quoi que ce soit : il dort. Le
 * dénoncer ferait du bruit pour rien — les cinq événements des Chutes sont
 * dans ce cas, et ils se relâchent correctement de toute façon. On mesure le
 * symptôme (« le jeu peut-il se figer ? »), pas le motif (« c'est un autorun »).
 *
 *   node bancs/15_autorun_sans_fin.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');
var L = function (n) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', n + '.json'), 'utf8')); };

var AUTORUN = 1, PARALLELE = 2;
var CTRL_SWITCH = 121;   // Contrôle d'interrupteurs : [début, fin, 0=ON / 1=OFF]

function cartes() {
    return fs.readdirSync(path.join(RACINE, 'data'))
        .filter(function (f) { return /^(Map\d+|BASE MAP|FULL MAP)\.json$/.test(f); });
}

// Tous les interrupteurs allumés quelque part dans le jeu, et où.
function releveDesAllumages(CE, mapsCache) {
    var allume = {};
    function scan(liste, ou) {
        (liste || []).forEach(function (c) {
            if (c.code !== CTRL_SWITCH || c.parameters[2] !== 0) return;
            for (var s = c.parameters[0]; s <= c.parameters[1]; s++) {
                (allume[s] = allume[s] || []).push(ou);
            }
        });
    }
    CE.forEach(function (c) { if (c) scan(c.list, 'EC' + c.id); });
    Object.keys(mapsCache).forEach(function (f) {
        (mapsCache[f].events || []).forEach(function (e) {
            if (!e) return;
            (e.pages || []).forEach(function (p) { scan(p.list, f.replace('.json', '') + '/ev' + e.id); });
        });
    });
    return allume;
}

// Un événement se relâche s'il éteint son propre interrupteur.
function seRelache(c) {
    var sw = c.switchId;
    return (c.list || []).some(function (x) {
        return x.code === CTRL_SWITCH && x.parameters[2] === 1 &&
            x.parameters[0] <= sw && x.parameters[1] >= sw;
    });
}

// Un garde-fou : il ne fait que borner des variables. Ce n'est jamais un
// autorun — c'est un parallèle. On le repère à son contenu, pas à son nom.
function estGardeFou(c) {
    var codes = (c.list || []).map(function (x) { return x.code; })
        .filter(function (k) { return k !== 0 && k !== 108 && k !== 412 && k !== 411; });
    if (!codes.length) return false;
    return codes.every(function (k) { return k === 111 || k === 122; });
}

function controles(monde) {
    var r = [], CE = monde.CE, allume = releveDesAllumages(CE, monde.maps);

    var gelants = [], gardeFousEnAutorun = [], dormeurs = 0;
    CE.forEach(function (c) {
        if (!c || c.trigger !== AUTORUN) return;
        if (seRelache(c)) return;
        if (!allume[c.switchId]) { dormeurs++; return; }   // jamais allumé : il dort
        gelants.push('EC' + c.id + ' ' + JSON.stringify(c.name) + ' (int ' + c.switchId +
            ', allumé par ' + allume[c.switchId].slice(0, 2).join(' et ') + ')');
    });
    CE.forEach(function (c) {
        if (!c || c.trigger !== AUTORUN) return;
        if (estGardeFou(c)) gardeFousEnAutorun.push('EC' + c.id + ' ' + JSON.stringify(c.name));
    });

    r.push(['aucun autorun atteignable ne peut figer la partie', gelants.length === 0,
        gelants.length ? gelants.slice(0, 3).join(' · ')
            : CE.filter(function (c) { return c && c.trigger === AUTORUN; }).length +
              ' autorun · ' + dormeurs + ' qui dorment (interrupteur jamais allumé)']);

    r.push(['aucun garde-fou de variable n\'est réglé en autorun', gardeFousEnAutorun.length === 0,
        gardeFousEnAutorun.length ? gardeFousEnAutorun.slice(0, 3).join(' · ')
            : 'les borneurs de variables sont tous en parallèle']);

    // Un parallèle qui ne s'éteint pas est normal (c'est son travail) ; on
    // vérifie seulement qu'aucun ne sert de scène bloquante déguisée.
    var paralleleAvecDialogue = [];
    CE.forEach(function (c) {
        if (!c || c.trigger !== PARALLELE) return;
        if ((c.list || []).some(function (x) { return x.code === 101; })) {
            paralleleAvecDialogue.push('EC' + c.id + ' ' + JSON.stringify(c.name));
        }
    });
    r.push(['aucun processus parallèle n\'ouvre une boîte de dialogue en boucle',
        paralleleAvecDialogue.length === 0,
        paralleleAvecDialogue.length ? paralleleAvecDialogue.slice(0, 3).join(' · ')
            : 'aucun parallèle ne parle']);

    return r;
}

//===========================================================================
var mapsCache = {};
cartes().forEach(function (f) {
    mapsCache[f] = JSON.parse(fs.readFileSync(path.join(RACINE, 'data', f), 'utf8'));
});
var BASE = { CE: L('CommonEvents'), maps: mapsCache };
var copie = function (o) { return JSON.parse(JSON.stringify(o)); };

var ok = 0, ko = 0;
console.log('\n1) Sur la vraie base');
controles(BASE).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

var SABOTAGES = [
    ['le relâchement retiré à l\'autorun de l\'interrupteur 40', function (b) {
        var c = b.CE.filter(function (x) { return x && x.trigger === AUTORUN && x.switchId === 40; })[0];
        if (c) c.list = c.list.filter(function (x) { return !(x.code === CTRL_SWITCH && x.parameters[2] === 1); });
    }, /figer la partie/],
    ['un garde-fou repassé en autorun', function (b) {
        var c = b.CE.filter(function (x) { return x && x.trigger === PARALLELE && estGardeFou(x); })[0];
        if (c) c.trigger = AUTORUN;
    }, /garde-fou de variable/],
    ['une boîte de dialogue glissée dans un parallèle', function (b) {
        var c = b.CE.filter(function (x) { return x && x.trigger === PARALLELE; })[0];
        if (c) c.list.unshift({ code: 101, indent: 0, parameters: ['', 0, 0, 2] });
    }, /boîte de dialogue en boucle/]
];

console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
SABOTAGES.forEach(function (s) {
    var b = { CE: copie(BASE.CE), maps: BASE.maps };
    s[1](b);
    var vise = controles(b).filter(function (c) { return !c[1] && s[2].test(c[0]); });
    if (vise.length) { ok++; console.log('   ✓ ' + s[0] + '  →  « ' + vise[0][0] + ' » tombe'); }
    else { ko++; console.log('   ✗ ' + s[0] + '  →  son contrôle ne tombe PAS'); }
});

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
