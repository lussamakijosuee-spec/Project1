/*
 * AUDIT — LES COMMANDES DE PLUGIN QUI TOMBENT DANS LE VIDE
 * ---------------------------------------------------------------------------
 * `Game_Interpreter.pluginCommand` propose la commande à tous les plugins
 * chargés. Si aucun ne la reconnaît, MV passe à la commande suivante. Aucune
 * erreur, aucun message : l'événement se déroule normalement et il ne se passe
 * simplement rien.
 *
 * C'est la panne la plus silencieuse du moteur, et la plus répandue ici : la
 * restauration du 2026-09-15 a gardé les données et les plugins tiers, mais pas
 * les systèmes. Les événements appellent toujours ce qui n'est plus chargé.
 *
 * ⚠ LA PREMIÈRE VERSION DE CET AUDIT A MENTI.
 *
 * Elle cherchait un motif de code précis (`command === 'X'`) pour savoir quel
 * fichier écoute quoi, et annonçait « 45 commandes n'ont de plugin nulle part ».
 * Faux : LivingNPC.js, PNJVivantsPlus.js, AmeStatusScene.js et une trentaine
 * d'autres dorment dans _ancien_projet et gèrent parfaitement ces mots — ils
 * les comparent autrement. On mesure maintenant le SYMPTÔME (« ce fichier gère
 * des commandes de plugin et contient ce mot ») plutôt qu'un style d'écriture.
 *
 *   node bancs/audit/11_commandes_de_plugin.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');

// ── 1 · ce que les événements appellent ────────────────────────────────────
var appels = {};
function noter(mot, ou, texte) {
    var k = mot.toUpperCase();
    appels[k] = appels[k] || { ou: {}, textes: {}, casses: {} };
    appels[k].ou[ou] = 1;
    appels[k].textes[texte] = 1;
    // ⚠ On garde l'orthographe EXACTE. La plupart des greffons comparent avec
    //   `command === 'theatrhythm'`, sans toucher à la casse : une majuscule
    //   de trop et la commande est morte. En ne gardant que la version en
    //   capitales, cet audit ne pouvait pas voir ce bug-là.
    appels[k].casses[mot] = (appels[k].casses[mot] || 0) + 1;
}
function scan(list, ou) {
    (list || []).forEach(function (c) {
        if (c.code !== 356) { return; }
        var t = String(c.parameters[0] || '').trim();
        if (t) { noter(t.split(/[\s:]+/)[0], ou, t); }
    });
}
require('../outils/atelier.js').sansCEAtelier(JSON.parse(fs.readFileSync(path.join(RACINE, 'data/CommonEvents.json'), 'utf8')))
    .forEach(function (c) { if (c && c.name !== undefined) { scan(c.list, 'EC' + c.id + ' « ' + c.name + ' »'); } });
fs.readdirSync(path.join(RACINE, 'data')).filter(function (f) { return /^Map\d+\.json$/.test(f) && !require('../outils/atelier.js').estAtelier(f); })
    .forEach(function (f) {
        var d = JSON.parse(fs.readFileSync(path.join(RACINE, 'data', f), 'utf8'));
        (d.events || []).forEach(function (ev) {
            if (!ev) { return; }
            (ev.pages || []).forEach(function (p) {
                scan(p.list, f.replace('.json', '') + ' ev' + ev.id + (ev.name ? ' « ' + ev.name + ' »' : ''));
            });
        });
    });

// ── 2 · tous les fichiers du dépôt qui gèrent des commandes de plugin ──────
var fichiers = [];
(function fouille(dir, prof) {
    if (prof > 5) { return; }
    var l;
    try { l = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    l.forEach(function (e) {
        var p = path.join(dir, e.name);
        if (e.isDirectory()) {
            if (!/^(node_modules|\.git|img|audio|data|bancs)$/.test(e.name)) { fouille(p, prof + 1); }
        } else if (/\.js$/.test(e.name)) { fichiers.push(p); }
    });
})(RACINE, 0);

var sources = {};
var gestionnaires = fichiers.filter(function (f) {
    var s;
    try { s = fs.readFileSync(f, 'utf8'); } catch (e) { return false; }
    if (s.indexOf('pluginCommand') < 0) { return false; }
    sources[f] = s;
    return true;
});

var actifs = JSON.parse(fs.readFileSync(path.join(RACINE, 'js/plugins.js'), 'utf8')
    .replace(/^[^\[]*/, '').replace(/;\s*$/, ''))
    .filter(function (p) { return p.status && !/^▬/.test(p.name); })
    .map(function (p) { return p.name; });

/**
 * ⚠ ON NE CHERCHE PAS LE MOT DANS TOUT LE FICHIER.
 *
 * `FamillesDeCapacites.js` lit un paramètre nommé `marque` : `P['marque']`.
 * Un `<Marque>` cité n'importe où suffisait donc à faire croire que la
 * commande MARQUE trouvait preneur — alors qu'aucun greffon ne la traite.
 *
 * Les paramètres se lisent en haut du fichier ; la commande se traite en bas,
 * dans le `pluginCommand`. On ne regarde donc que ce qui vient APRÈS la
 * première mention de `pluginCommand` : l'endroit où l'on compare des noms
 * de commande, et nulle part ailleurs.
 */
function zoneDeDispatch(f) {
    var s = sources[f] || '';
    var i = s.indexOf('pluginCommand');
    return i < 0 ? '' : s.slice(i);
}
function repondants(mot, exact) {
    var sur = mot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp("['\"]" + sur + "['\"]", exact ? '' : 'i');
    /* Deux autres façons d'écouter, qu'on accusait à tort (2026-09-26) :
     *   · une table d'aiguillage — Galv.pCmd[command](args), avec
     *     Galv.pCmd.JUMPACTION = function… (GALV : JUMPACTION, VISRANGE,
     *     AIVISIBLE) ;
     *   · une expression — e.match(/FlushAudioCache/i) (Irina),
     *     line.match(/Picture (\d+) Frame/i) (YEP_PictureSpritesheets). */
    var table = new RegExp('pCmd(?:\\.' + sur + '\\b|\\[[\'"]' + sur + '[\'"]\\])\\s*=(?!=)', exact ? '' : 'i');
    var expr = new RegExp('\\.match\\(\\s*\\/\\^?' + sur + '\\b', 'i');
    return gestionnaires.filter(function (f) {
        var z = zoneDeDispatch(f);
        return re.test(z) || table.test(sources[f]) || expr.test(z);
    }).map(function (f) { return path.relative(RACINE, f); });
}
function estActif(f) {
    return f.indexOf('js/plugins/') === 0 && actifs.indexOf(path.basename(f, '.js')) >= 0;
}

/**
 * Quelqu'un rattrape-t-il l'orthographe ?
 *
 * Beaucoup de greffons comparent `command === 'theatrhythm'` — caractère par
 * caractère : une majuscule de trop et la commande est morte. Mais un greffon
 * peut aussi servir de RELAIS : il reconnaît le mot quelle que soit la casse
 * et rappelle l'orthographe attendue.
 *
 * On reconnaît un relais à une signature nette : le même fichier actif porte
 * le mot en MAJUSCULES *et* en minuscules, tous deux entre guillemets. C'est
 * précis — ça ne se produit pas par hasard — et ça se vérifie sans deviner
 * comment le code est écrit.
 *
 * ⚠ Ce contrôle-ci reste statique. L'épreuve qui tranche est dans le moteur :
 *   bancs/navigateur/les_commandes_qui_repondent.js
 */
function unRelaisRattrape(mot) {
    var bas = mot.toLowerCase(), haut = mot.toUpperCase();
    if (bas === haut) { return false; }
    return gestionnaires.some(function (f) {
        var rel = path.relative(RACINE, f);
        if (!estActif(rel)) { return false; }
        var s = zoneDeDispatch(f);
        // la commande passée en majuscules avant d'être comparée :
        //   String(cmd).toUpperCase() !== 'VOIES'  — toute casse passe
        if (new RegExp("toUpperCase\\(\\)\\s*[!=]==?\\s*['\"]" + haut + "['\"]").test(s) ||
            new RegExp("toLowerCase\\(\\)\\s*[!=]==?\\s*['\"]" + bas + "['\"]").test(s)) { return true; }
        return new RegExp("['\"]" + bas + "['\"]").test(s)
            && new RegExp("['\"]" + haut + "['\"]").test(s);
    });
}

// ── 3 · confrontation ──────────────────────────────────────────────────────
var mots = Object.keys(appels);
var vivantes = [], recuperables = [], perdues = [], casses = [];
mots.forEach(function (w) {
    var rep = repondants(w, false);
    var actif = rep.some(estActif);
    var n = Object.keys(appels[w].ou).length;
    if (actif) {
        vivantes.push(w);
        // Vivante à la casse près — mais l'est-elle telle qu'elle est écrite ?
        // On reprend chaque orthographe réellement posée dans les événements.
        Object.keys(appels[w].casses).forEach(function (orth) {
            if (repondants(orth, true).some(estActif)) { return; }
            if (unRelaisRattrape(orth)) { return; }
            casses.push({ w: orth, n: appels[w].casses[orth], attendu: (repondants(w, false)[0] || '') });
        });
        return;
    }
    var dort = rep.filter(function (f) { return actifs.indexOf(path.basename(f, '.js')) < 0; });
    if (dort.length) { recuperables.push({ w: w, n: n, f: dort[0] }); }
    else { perdues.push({ w: w, n: n, t: Object.keys(appels[w].textes)[0] }); }
});
recuperables.sort(function (a, b) { return b.n - a.n; });
perdues.sort(function (a, b) { return b.n - a.n; });

var appelsMorts = recuperables.concat(perdues).reduce(function (s, x) {
    return s + Object.keys(appels[x.w].textes).length;
}, 0);
var endroitsMorts = recuperables.concat(perdues).reduce(function (s, x) {
    return s + Object.keys(appels[x.w].ou).length;
}, 0);

console.log('LES COMMANDES DE PLUGIN QUI TOMBENT DANS LE VIDE\n');
console.log('  ' + mots.length + ' commandes distinctes appelées par les événements');
console.log('  ' + vivantes.length + ' écoutées par un plugin chargé');
console.log('  ' + (recuperables.length + perdues.length) + ' sans personne à l\'écoute, dans ' +
    endroitsMorts + ' endroit(s)\n');

var parFichier = {};
recuperables.forEach(function (x) { (parFichier[x.f] = parFichier[x.f] || []).push(x); });
var ordre = Object.keys(parFichier).sort(function (a, b) {
    var sa = parFichier[a].reduce(function (s, x) { return s + x.n; }, 0);
    var sb = parFichier[b].reduce(function (s, x) { return s + x.n; }, 0);
    return sb - sa;
});

console.log('── LE PLUGIN DORT DANS LE DÉPÔT — ' + recuperables.length + ' commandes, ' +
    ordre.length + ' fichiers ──');
ordre.forEach(function (f) {
    console.log('   ' + f);
    console.log('      ' + parFichier[f].map(function (x) { return x.w + ' ×' + x.n; }).join(', '));
});

console.log('\n── AUCUN FICHIER DU DÉPÔT NE RÉPOND — ' + perdues.length + ' ──');
perdues.forEach(function (x) {
    console.log('   ' + x.w + ' ×' + x.n + '   « ' + x.t + ' »');
});
if (perdues.length) {
    console.log('\n   (une commande de la forme <Quelque chose: valeur> n\'est pas une commande :');
    console.log('    c\'est un notetag collé dans la mauvaise case de l\'éditeur.)');
}

console.log('\n── VIVANTE, MAIS PAS À CETTE ORTHOGRAPHE — ' + casses.length + ' ──');
if (!casses.length) {
    console.log('   (aucune : toutes les commandes sont écrites comme le greffon les attend)');
} else {
    casses.forEach(function (x) {
        console.log('   « ' + x.w + ' » ×' + x.n + '   un greffon actif connaît ce mot, mais pas');
        console.log('       avec ces majuscules-là. MV compare caractère par caractère :');
        console.log('       la commande ne part pas.');
    });
}

console.log('\n' + '='.repeat(70));
console.log('  ' + (endroitsMorts + casses.length) + ' endroit(s) appellent quelque chose qui ne répond pas');
console.log('     dont ' + endroitsMorts + ' sans aucun greffon, et ' + casses.length + ' à cause de la casse');
console.log('='.repeat(70));
process.exit((endroitsMorts + casses.length) ? 1 : 0);
