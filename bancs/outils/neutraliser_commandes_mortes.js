/*
 * LES COMMANDES DE PLUGIN QUE PERSONNE N'ÉCOUTE.
 *
 * JOKO : « 263 commandes de plugin que personne n'écoute […] enlève les ».
 *
 * COMMENT ON « ENLÈVE » SANS PERDRE
 * ─────────────────────────────────
 * Une commande de plugin sans répondant ne fait rien — sauf traîner dans
 * l'événement et faire croire qu'il se passe quelque chose. On la transforme
 * en COMMENTAIRE (code 108) en gardant son texte mot pour mot.
 *
 * Pourquoi un commentaire plutôt qu'une suppression sèche : la plupart de ces
 * commandes visent un plugin qui existe encore, simplement éteint ou resté
 * dans _ancien_projet/. Le jour où JOKO en rallume un, tout son câblage est
 * encore là, à sa place, dans le bon ordre — il suffit de rebasculer. Une
 * suppression, elle, ne se rattrape pas.
 *
 * Un registre complet est écrit dans bancs/outils/commandes_neutralisees.json :
 * carte, événement, page, ligne, texte exact. Le remettre est mécanique.
 *
 *   node bancs/outils/neutraliser_commandes_mortes.js            (essai à blanc)
 *   node bancs/outils/neutraliser_commandes_mortes.js --ecrire   (pour de vrai)
 *   node bancs/outils/neutraliser_commandes_mortes.js --remettre (tout annuler)
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var REGISTRE = path.join(__dirname, 'commandes_neutralisees.json');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var REMETTRE = process.argv.indexOf('--remettre') >= 0;

var PREFIXE = '[commande sans répondant] ';

function lireJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

/* ── qui répond aujourd'hui ── */
var plugTxt = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
var PLUGINS = JSON.parse(plugTxt.slice(plugTxt.indexOf('['), plugTxt.lastIndexOf(']') + 1));
var CODE_ACTIF = PLUGINS.filter(function (p) { return p.status && !/^▬/.test(p.name); })
    .map(function (p) {
        try { return fs.readFileSync(path.join(RACINE, 'js', 'plugins', p.name + '.js'), 'utf8'); }
        catch (e) { return ''; }
    }).join('\n');

function repond(nom) {
    if (!nom) { return false; }
    var n = nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('\\b' + n + '\\b').test(CODE_ACTIF);
}

/* ── les fichiers qui portent des événements ── */
function fichiers() {
    var out = [{ nom: 'CommonEvents.json', genre: 'ce' }, { nom: 'Troops.json', genre: 'troupe' }];
    fs.readdirSync(path.join(RACINE, 'data'))
        .filter(function (f) { return /^Map\d+\.json$/.test(f); }).sort()
        .forEach(function (f) { out.push({ nom: f, genre: 'carte' }); });
    return out;
}

/** Parcourt toutes les listes de commandes d'un fichier de données. */
function parcourir(donnee, genre, visite) {
    if (genre === 'ce') {
        donnee.forEach(function (e) { if (e && e.list) { visite(e.list, 'CE' + e.id + ' « ' + (e.name || '') + ' »', 1); } });
    } else if (genre === 'troupe') {
        donnee.forEach(function (t) {
            if (!t) { return; }
            (t.pages || []).forEach(function (p, i) {
                if (p.list) { visite(p.list, 'Troupe ' + t.id + ' « ' + (t.name || '') + ' »', i + 1); }
            });
        });
    } else {
        (donnee.events || []).forEach(function (e) {
            if (!e) { return; }
            (e.pages || []).forEach(function (p, i) {
                if (p.list) { visite(p.list, 'ev' + e.id + ' « ' + (e.name || '') + ' »', i + 1); }
            });
        });
    }
}

/* ── RECONSTRUIRE LE REGISTRE ──────────────────────────────────────────────
 * Le registre est la trace qui permet de tout remettre. S'il a été écrasé
 * (l'outil lancé deux fois de suite n'en garde que le dernier lot), on le
 * refait à partir du jeu lui-même : chaque commentaire neutralisé porte le
 * préfixe et le texte d'origine, donc tout est retrouvable. */
if (process.argv.indexOf('--registre') >= 0) {
    var refait = [];
    fichiers().forEach(function (f) {
        var donnee = lireJSON(path.join(RACINE, 'data', f.nom));
        var genre = f.genre;
        parcourir(donnee, genre, function (liste, ou, page) {
            liste.forEach(function (c, i) {
                if (c && c.code === 108 && String(c.parameters[0] || '').indexOf(PREFIXE) === 0) {
                    var texte = String(c.parameters[0]).slice(PREFIXE.length);
                    refait.push({ fichier: f.nom, ou: ou, page: page, ligne: i, texte: texte, commande: texte.split(' ')[0] || '(vide)' });
                }
            });
        });
    });
    fs.writeFileSync(REGISTRE, JSON.stringify({
        fait: new Date().toISOString().slice(0, 19),
        refait_depuis_le_jeu: true,
        prefixe: PREFIXE,
        entrees: refait
    }, null, 1), 'utf8');
    console.log('  registre refait : ' + refait.length + ' commande(s) retrouvée(s) dans le jeu.');
    process.exit(0);
}

/* ── REMETTRE ── */
if (REMETTRE) {
    if (!fs.existsSync(REGISTRE)) { console.error('  aucun registre : rien à remettre.'); process.exit(1); }
    var reg = lireJSON(REGISTRE);
    var remis = 0;
    var parFichier = {};
    reg.entrees.forEach(function (x) { (parFichier[x.fichier] = parFichier[x.fichier] || []).push(x); });
    Object.keys(parFichier).forEach(function (f) {
        var chemin = path.join(RACINE, 'data', f);
        var brut = fs.readFileSync(chemin, 'utf8');
        var donnee = JSON.parse(brut);
        var genre = f === 'CommonEvents.json' ? 'ce' : (f === 'Troops.json' ? 'troupe' : 'carte');
        parcourir(donnee, genre, function (liste, ou, page) {
            parFichier[f].forEach(function (x) {
                if (x.ou !== ou || x.page !== page) { return; }
                var c = liste[x.ligne];
                if (c && c.code === 108 && c.parameters[0] === PREFIXE + x.texte) {
                    liste[x.ligne] = { code: 356, indent: c.indent, parameters: [x.texte] };
                    remis++;
                }
            });
        });
        ecrireFichier(chemin, brut, donnee);
    });
    console.log('  ' + remis + ' commande(s) remise(s) en place.');
    process.exit(0);
}

/* Les fichiers du projet n'ont pas tous la même mise en page :
 *   · les bases de données  →  une entrée par ligne :  [\n {…},\n {…}\n]
 *   · la plupart des cartes →  la même chose pour leur tableau d'événements
 *   · quelques cartes       →  du JSON compact, sans un seul saut de ligne
 * Réécrire une carte compacte avec la mise en page de l'autre ferait un diff
 * de quarante mille caractères pour trois commentaires. On reconnaît donc le
 * format en le REJOUANT sur le fichier tel quel : celui qui rend l'original
 * octet pour octet est le bon. Aucun ne marche → on ne touche pas au fichier.
 */
function mises_en_page(donnee) {
    if (Array.isArray(donnee)) {
        return [
            function (d) { return '[\n' + d.map(function (x) { return JSON.stringify(x); }).join(',\n') + '\n]'; },
            function (d) { return JSON.stringify(d); }
        ];
    }
    return [
        function (d) {
            var s = JSON.stringify(d);
            var i = s.indexOf(',"events":[');
            if (i < 0) { return null; }
            return s.slice(0, i) + '\n"events":[\n' +
                d.events.map(function (x) { return JSON.stringify(x); }).join(',\n') + '\n]\n}';
        },
        function (d) { return JSON.stringify(d); }
    ];
}

/** Trouve la mise en page qui rend `brut` à l'identique. null si aucune. */
function formatDe(brut, donnee) {
    var temoin = JSON.parse(brut);
    var essais = mises_en_page(temoin);
    for (var i = 0; i < essais.length; i++) {
        var r;
        try { r = essais[i](temoin); } catch (e) { continue; }
        if (r === brut) { return mises_en_page(donnee)[i]; }
    }
    return null;
}

function ecrireFichier(chemin, brut, donnee) {
    var forme = formatDe(brut, donnee);
    if (!forme) { return false; }
    var candidat = forme(donnee);
    JSON.parse(candidat);   // il doit se parser
    fs.writeFileSync(chemin, candidat, 'utf8');
    return true;
}

/* ── NEUTRALISER ── */
var entrees = [], parNom = {};   // entrees est filtré si un fichier est sauté

fichiers().forEach(function (f) {
    var chemin = path.join(RACINE, 'data', f.nom);
    var brut = fs.readFileSync(chemin, 'utf8');
    var donnee = JSON.parse(brut);
    var touche = false;

    parcourir(donnee, f.genre, function (liste, ou, page) {
        liste.forEach(function (c, i) {
            if (!c || c.code !== 356) { return; }
            var texte = String(c.parameters[0] || '');
            var nom = texte.split(' ')[0];
            if (repond(nom)) { return; }                 // quelqu'un écoute : on ne touche pas
            entrees.push({ fichier: f.nom, ou: ou, page: page, ligne: i, texte: texte, commande: nom || '(vide)' });
            parNom[nom || '(vide)'] = (parNom[nom || '(vide)'] || 0) + 1;
            if (ECRIRE) {
                liste[i] = { code: 108, indent: c.indent, parameters: [PREFIXE + texte] };
                touche = true;
            }
        });
    });

    if (ECRIRE && touche) {
        if (!ecrireFichier(chemin, brut, donnee)) {
            console.error('  ✘ ' + f.nom + ' : aucune mise en page connue ne rend l\'original — SAUTÉ.');
            // on retire du registre ce qu'on n'a pas écrit, sinon --remettre mentirait
            entrees = entrees.filter(function (x) { return x.fichier !== f.nom; });
        }
    }
});

console.log('═'.repeat(70));
console.log('  COMMANDES SANS RÉPONDANT  —  ' + entrees.length + ' appels, ' +
    Object.keys(parNom).length + ' commandes différentes');
console.log('═'.repeat(70));
Object.keys(parNom).sort(function (a, b) { return parNom[b] - parNom[a]; })
    .forEach(function (n) { console.log('   ' + String(parNom[n]).padStart(3) + ' × ' + n); });

if (ECRIRE) {
    fs.writeFileSync(REGISTRE, JSON.stringify({
        fait: new Date().toISOString().slice(0, 19),
        prefixe: PREFIXE,
        entrees: entrees
    }, null, 1), 'utf8');
    console.log('\n  ✔ neutralisées en commentaires. Registre : bancs/outils/commandes_neutralisees.json');
    console.log('    pour tout remettre :  node bancs/outils/neutraliser_commandes_mortes.js --remettre');
} else {
    console.log('\n  (essai à blanc — rien n\'a été écrit. Ajoute --ecrire.)');
}
