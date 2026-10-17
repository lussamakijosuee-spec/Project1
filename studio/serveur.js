// ════════════════════════════════════════════════════════════════════════════
//  LE STUDIO — les outils de JOKO pour RPG Maker MV, dans le navigateur
//  Lancement : double-clic sur STUDIO.bat (à la racine du projet)
//
//  Il LIT tout le projet (data/, img/, audio/) et Documents\RPG Maker, et
//  n'ÉCRIT qu'à trois endroits :
//    · data/CommonEvents.json — les événements communs 600 à 699 (les scènes)
//    · studio/scenes/          — la source de chaque scène, pour la rouvrir
//    · img/ et audio/          — un fichier copié depuis Documents\RPG Maker,
//                                quand tu cliques « Copier dans le jeu » (jamais
//                                par-dessus un fichier qui existe)
//  Avant chaque écriture : une copie de CommonEvents.json dans
//  Documents\RPG Maker\Sauvegardes du Studio. Et rien ne s'écrit tant que
//  RPG Maker est ouvert : en enregistrant, l'éditeur écraserait la scène.
// ════════════════════════════════════════════════════════════════════════════
'use strict';
var http = require('http');
var fs = require('fs');
var path = require('path');
var execFile = require('child_process').execFile;
var os = require('os');

var PORT = Number(process.env.STUDIO_PORT) || 8765;
var RACINE = path.resolve(__dirname, '..');            // le projet
var DATA = path.join(RACINE, 'data');
var PAGES = path.join(__dirname, 'pages');
var SCENES = path.join(__dirname, 'scenes');
var SAUVEGARDES = path.join(os.homedir(), 'Documents', 'RPG Maker', 'Sauvegardes du Studio');

var SEPARATEUR = 600;                                   // « ▬▬ 🎬 Studio de cinématiques ▬▬ »
var PREMIERE = 601, DERNIERE = 699;                     // les scènes

var TYPES = {
    '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff',
    '.woff2': 'font/woff2', '.webm': 'video/webm', '.mp4': 'video/mp4', '.txt': 'text/plain; charset=utf-8'
};

// ── lecture du projet ───────────────────────────────────────────────────────
function lireJSON(fichier) {
    return JSON.parse(fs.readFileSync(fichier, 'utf8').replace(/^﻿/, ''));
}
function nomsDe(dossier, extensions) {
    var d = path.join(RACINE, dossier);
    if (!fs.existsSync(d)) return [];
    var vus = {};
    fs.readdirSync(d).forEach(function (f) {
        var ext = path.extname(f).toLowerCase();
        if (extensions.indexOf(ext) >= 0) vus[f.slice(0, -ext.length)] = true;
    });
    return Object.keys(vus).sort(function (a, b) { return a.localeCompare(b, 'fr'); });
}
function evenementsCommuns() { return lireJSON(path.join(DATA, 'CommonEvents.json')); }

function projet() {
    var sys = lireJSON(path.join(DATA, 'System.json'));
    var acteurs = lireJSON(path.join(DATA, 'Actors.json')).filter(function (a) { return a && a.name; })
        .map(function (a) { return { id: a.id, nom: a.name, visage: a.faceName, indexVisage: a.faceIndex, perso: a.characterName, indexPerso: a.characterIndex }; });
    var anims = lireJSON(path.join(DATA, 'Animations.json')).filter(function (a) { return a && a.name; })
        .map(function (a) { return { id: a.id, nom: a.name }; });
    var cartes = lireJSON(path.join(DATA, 'MapInfos.json')).filter(Boolean)
        .map(function (m) { return { id: m.id, nom: m.name }; }).sort(function (a, b) { return a.id - b.id; });
    var ce = evenementsCommuns().filter(function (c) { return c && c.name; })
        .map(function (c) { return { id: c.id, nom: c.name }; });
    return {
        titre: sys.gameTitle,
        acteurs: acteurs,
        visages: nomsDe('img/faces', ['.png']),
        personnages: nomsDe('img/characters', ['.png']),
        images: nomsDe('img/pictures', ['.png']),
        sons: { bgm: nomsDe('audio/bgm', ['.ogg', '.m4a']), bgs: nomsDe('audio/bgs', ['.ogg', '.m4a']),
                me: nomsDe('audio/me', ['.ogg', '.m4a']), se: nomsDe('audio/se', ['.ogg', '.m4a']) },
        animations: anims,
        cartes: cartes,
        interrupteurs: sys.switches.map(function (n, i) { return { id: i, nom: n || '' }; }).slice(1),
        variables: sys.variables.map(function (n, i) { return { id: i, nom: n || '' }; }).slice(1),
        evenementsCommuns: ce,
        depart: { carte: sys.startMapId, x: sys.startX, y: sys.startY },
        lignesParMessage: 4,
        scenes: listeScenes(),
        plage: [PREMIERE, DERNIERE]
    };
}

function carte(id) {
    var f = path.join(DATA, 'Map' + String(id).padStart(3, '0') + '.json');
    if (!fs.existsSync(f)) return null;
    var m = lireJSON(f);
    var infos = lireJSON(path.join(DATA, 'MapInfos.json'))[id] || {};
    return {
        id: id, nom: infos.name || '', affiche: m.displayName || '', largeur: m.width, hauteur: m.height,
        evenements: (m.events || []).filter(Boolean).map(function (e) {
            var p = e.pages && e.pages[0];
            return { id: e.id, nom: e.name, x: e.x, y: e.y,
                     image: p ? { perso: p.image.characterName, index: p.image.characterIndex, direction: p.image.direction, motif: p.image.pattern } : null };
        })
    };
}

function listeScenes() {
    if (!fs.existsSync(SCENES)) return [];
    return fs.readdirSync(SCENES).filter(function (f) { return /^\d+\.json$/.test(f); }).map(function (f) {
        try { var s = lireJSON(path.join(SCENES, f)); return { id: s.ce, nom: s.nom, etapes: (s.etapes || []).length }; }
        catch (e) { return null; }
    }).filter(Boolean).sort(function (a, b) { return a.id - b.id; });
}

// ── RPG Maker est-il ouvert ? ───────────────────────────────────────────────
function editeurOuvert(rappel) {
    if (process.platform !== 'win32') return rappel(false);
    execFile('tasklist', ['/FI', 'IMAGENAME eq RPGMV.exe', '/NH'], { windowsHide: true }, function (err, sortie) {
        rappel(!err && /RPGMV\.exe/i.test(String(sortie)));
    });
}

// ── écriture d'une scène ────────────────────────────────────────────────────
function ecrireCE(tableau, eol) {
    // le format de l'éditeur : un événement commun par ligne. Les fins de ligne
    // sont celles du fichier (git les met en CRLF sur un PC Windows).
    eol = eol || '\n';
    return '[' + eol + tableau.map(function (x) { return JSON.stringify(x); }).join(',' + eol) + eol + ']';
}
function vide(id) { return { id: id, list: [{ code: 0, indent: 0, parameters: [] }], name: '', switchId: 1, trigger: 0 }; }
function estLibre(c) { return !c || (!c.name && (!c.list || c.list.length <= 1)); }

function enregistrer(demande) {
    var scene = demande.scene, liste = demande.liste;
    if (!scene || !Array.isArray(liste) || !liste.length || liste[liste.length - 1].code !== 0)
        throw new Error('Scène mal formée : la liste de commandes doit finir par la commande 0.');
    var nom = String(scene.nom || '').trim();
    if (!nom) throw new Error('Donne un nom à la scène.');

    var fichier = path.join(DATA, 'CommonEvents.json');
    var brut = fs.readFileSync(fichier, 'utf8');
    var ce = JSON.parse(brut.replace(/^﻿/, ''));
    // garde-fou : on ne réécrit que si l'on sait reproduire le fichier à l'octet près
    var bom = brut.charCodeAt(0) === 0xFEFF ? '﻿' : '';
    var eol = brut.indexOf('\r\n') >= 0 ? '\r\n' : '\n';
    var fin = /\r?\n$/.test(brut) ? eol : '';
    if (bom + ecrireCE(ce, eol) + fin !== brut)
        throw new Error('CommonEvents.json n\'a pas le format attendu : rien n\'est écrit. Ouvre et enregistre le projet dans RPG Maker, puis réessaie.');

    var id = Number(scene.ce) || 0;
    if (id) {
        if (id < PREMIERE || id > DERNIERE) throw new Error('Une scène vit entre ' + PREMIERE + ' et ' + DERNIERE + '.');
        var deja = ce[id];
        if (!estLibre(deja) && !/^🎬 /.test(deja.name || ''))
            throw new Error('L\'événement commun ' + id + ' « ' + deja.name + ' » n\'est pas une scène du Studio : il n\'est pas touché.');
    } else {
        for (var n = PREMIERE; n <= DERNIERE; n++) if (estLibre(ce[n])) { id = n; break; }
        if (!id) throw new Error('Les 99 places (' + PREMIERE + '–' + DERNIERE + ') sont prises.');
    }
    while (ce.length <= DERNIERE) ce.push(vide(ce.length));
    if (estLibre(ce[SEPARATEUR])) ce[SEPARATEUR] = { id: SEPARATEUR, list: [{ code: 0, indent: 0, parameters: [] }], name: '▬▬ 🎬 Studio de cinématiques ▬▬', switchId: 1, trigger: 0 };

    // la sauvegarde d'abord
    fs.mkdirSync(SAUVEGARDES, { recursive: true });
    var horo = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
    fs.writeFileSync(path.join(SAUVEGARDES, 'CommonEvents_' + horo + '.json'), brut);

    ce[id] = { id: id, list: liste, name: '🎬 ' + nom, switchId: 1, trigger: 0 };
    fs.writeFileSync(fichier, bom + ecrireCE(ce, eol) + fin);

    scene.ce = id;
    fs.mkdirSync(SCENES, { recursive: true });
    fs.writeFileSync(path.join(SCENES, id + '.json'), JSON.stringify(scene, null, 2) + '\n');
    return { ce: id, nom: '🎬 ' + nom };
}

// ── les ressources : ce que le jeu a, ce qu'il utilise, ce qui attend ───────
// « Utilisé » = le nom du fichier est cité quelque part dans data/ ou dans les
// plugins. C'est une estimation par le nom : un fichier cité seulement dans un
// script calculé (« 'Actor' + n ») passera pour inutilisé.
var BIBLIO = path.join(os.homedir(), 'Documents', 'RPG Maker');
var DOSSIERS_BIBLIO = ['1 Graphismes', '2 Musiques et sons', '3 Systèmes et plugins', '5 Packs communautaires 2018'];
var EXT_IMAGES = ['.png', '.jpg'], EXT_SONS = ['.ogg', '.m4a', '.mp3', '.wav'];
var cacheRessources = null;

function marcher(dossier, rappel) {
    var pile = [dossier];
    while (pile.length) {
        var d = pile.pop(), entrees;
        try { entrees = fs.readdirSync(d, { withFileTypes: true }); } catch (e) { continue; }
        entrees.forEach(function (x) {
            var abs = path.join(d, x.name);
            if (x.isDirectory()) pile.push(abs); else if (x.isFile()) rappel(abs);
        });
    }
}
function jetonsCites() {
    var tok = new Set();
    function ajouter(s) { s = String(s).trim(); if (s) tok.add(s.toLowerCase()); }
    var fichiers = fs.readdirSync(DATA).filter(function (f) { return /\.json$/i.test(f) && f !== 'DecorsIndex.json'; })
        .map(function (f) { return path.join(DATA, f); })
        .concat([path.join(RACINE, 'js', 'plugins.js')])
        .concat(fs.readdirSync(path.join(RACINE, 'js', 'plugins')).filter(function (f) { return /\.js$/i.test(f); })
            .map(function (f) { return path.join(RACINE, 'js', 'plugins', f); }));
    fichiers.forEach(function (f) {
        var t = fs.readFileSync(f, 'utf8'), m;
        var guillemets = /"((?:[^"\\]|\\.)*)"/g;
        while ((m = guillemets.exec(t))) {
            var s = m[1].replace(/\\\\/g, '\\').replace(/\\"/g, '"').replace(/\\n/g, '\n');
            ajouter(s);
            s.split(/[<>:,;=|\n\r\t\[\]\\"']+/).forEach(function (p) {
                ajouter(p); var q = p.replace(/^.*\//, ''); ajouter(q); ajouter(q.replace(/\.(png|ogg|m4a|jpg)$/i, ''));
            });
        }
        var apostrophes = /'([^'\n]{1,120})'/g;
        while ((m = apostrophes.exec(t))) { ajouter(m[1]); ajouter(m[1].replace(/^.*\//, '')); }
    });
    return tok;
}
function categorieProposee(rel, ext) {
    var p = rel.toLowerCase().replace(/\\/g, '/');
    var mv = p.match(/(?:^|\/)(img|audio)\/([a-z_0-9]+)\//);
    if (mv) return mv[1] + '/' + mv[2];
    if (EXT_SONS.indexOf(ext) >= 0) {
        if (/bgs|ambien|ambiance|environ/.test(p)) return 'audio/bgs';
        if (/(^|\/)me(\/|_)|jingle|fanfare|victory|victoire/.test(p)) return 'audio/me';
        if (/bgm|music|musique|theme|battle/.test(p)) return 'audio/bgm';
        return 'audio/se';
    }
    var nom = p.replace(/^.*\//, '');
    if (/sv_?actor|sideview actor|sv actors/.test(p)) return 'img/sv_actors';
    if (/sv_?enem/.test(p)) return 'img/sv_enemies';
    if (/face/.test(p)) return 'img/faces';
    if (/^[$!]/.test(nom) || /charact|chara|walk|sprite/.test(p)) return 'img/characters';
    if (/battlebacks?_?2|bb2/.test(p)) return 'img/battlebacks2';
    if (/battleback|bb1/.test(p)) return 'img/battlebacks1';
    if (/enem|battler|monster|monstre|boss/.test(p)) return 'img/enemies';
    if (/tileset|tiles/.test(p)) return 'img/tilesets';
    if (/parallax|background|fond/.test(p)) return 'img/parallaxes';
    if (/animation|(^|\/)fx|effect|hitspark/.test(p)) return 'img/animations';
    if (/title/.test(p)) return 'img/titles1';
    if (/window|cursor|system/.test(p)) return 'img/system';
    return 'img/pictures';
}
function ressources(rafraichir) {
    if (cacheRessources && !rafraichir) return cacheRessources;
    var tok = jetonsCites(), jeu = [], vus = {}, nomsDuJeu = new Set(), categories = [];
    ['img', 'audio'].forEach(function (base) {
        fs.readdirSync(path.join(RACINE, base), { withFileTypes: true }).filter(function (d) { return d.isDirectory(); }).forEach(function (d) {
            var cat = base + '/' + d.name;
            if (cat === 'audio/_originaux_mp3') return;
            categories.push(cat);
            var racineCat = path.join(RACINE, base, d.name);
            marcher(racineCat, function (abs) {
                var ext = path.extname(abs).toLowerCase();
                if (['.png', '.jpg', '.ogg', '.m4a'].indexOf(ext) < 0) return;
                var nom = path.relative(racineCat, abs).split(path.sep).join('/').replace(/\.[^.]+$/, '');
                var cle = cat + '|' + nom;
                nomsDuJeu.add(path.basename(nom).toLowerCase());
                if (vus[cle]) { vus[cle].x.push(ext); return; }
                var court = path.basename(nom), nu = court.replace(/^[$!]+/, '');
                var item = { c: cat, n: nom, x: [ext], t: fs.statSync(abs).size,
                             u: tok.has(nom.toLowerCase()) || tok.has(court.toLowerCase()) || tok.has(nu.toLowerCase()) };
                vus[cle] = item; jeu.push(item);
            });
        });
    });
    var biblio = [];
    DOSSIERS_BIBLIO.forEach(function (dossier) {
        var r = path.join(BIBLIO, dossier);
        if (!fs.existsSync(r)) return;
        marcher(r, function (abs) {
            var ext = path.extname(abs).toLowerCase();
            if (EXT_IMAGES.indexOf(ext) < 0 && EXT_SONS.indexOf(ext) < 0) return;
            var rel = path.relative(BIBLIO, abs).split(path.sep).join('/');
            biblio.push({ p: rel, x: ext, t: fs.statSync(abs).size, d: nomsDuJeu.has(path.basename(abs, path.extname(abs)).toLowerCase()), g: categorieProposee(rel, ext) });
        });
    });
    cacheRessources = { jeu: jeu, bibliotheque: biblio, categories: categories.sort(), dossiers: DOSSIERS_BIBLIO, calcule: new Date().toISOString() };
    return cacheRessources;
}
function copier(demande) {
    var rel = String(demande.p || ''), cat = String(demande.c || '');
    var src = path.resolve(BIBLIO, rel);
    if (src.indexOf(BIBLIO + path.sep) !== 0 || !fs.existsSync(src)) throw new Error('Fichier introuvable dans Documents\\RPG Maker.');
    if (!/^(img|audio)\/[A-Za-z0-9_]+$/.test(cat) || !fs.existsSync(path.join(RACINE, cat))) throw new Error('Dossier du jeu inconnu : ' + cat);
    var ext = path.extname(src).toLowerCase(), image = cat.indexOf('img/') === 0;
    if (image && ext !== '.png') throw new Error('RPG Maker MV ne lit que les .png pour les images.');
    if (!image && ['.ogg', '.m4a'].indexOf(ext) < 0) throw new Error('RPG Maker MV ne lit pas les ' + ext + ' : il faut le convertir en .ogg d\'abord.');
    var copies = [];
    var aCopier = [src];
    if (!image) {      // le .ogg et le .m4a du même son voyagent ensemble
        var jumeau = src.slice(0, -ext.length) + (ext === '.ogg' ? '.m4a' : '.ogg');
        if (fs.existsSync(jumeau)) aCopier.push(jumeau);
    }
    aCopier.forEach(function (f) {
        if (fs.existsSync(path.join(RACINE, cat, path.basename(f)))) throw new Error('« ' + path.basename(f) + ' » existe déjà dans ' + cat + ' : rien n\'est remplacé.');
    });
    aCopier.forEach(function (f) {
        fs.copyFileSync(f, path.join(RACINE, cat, path.basename(f)), fs.constants.COPYFILE_EXCL);
        copies.push(cat + '/' + path.basename(f));
    });
    cacheRessources = null;
    return { copies: copies };
}

// ── le serveur ──────────────────────────────────────────────────────────────
function envoyerJSON(res, code, objet) {
    var corps = Buffer.from(JSON.stringify(objet));
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': corps.length, 'Cache-Control': 'no-store' });
    res.end(corps);
}
function servirFichier(res, base, relatif) {
    var f = path.resolve(base, '.' + path.sep + relatif);
    if (f.indexOf(base) !== 0) { res.writeHead(403); return res.end(); }
    fs.stat(f, function (err, st) {
        if (err || !st.isFile()) { res.writeHead(404); return res.end(); }
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': 'no-store' });
        fs.createReadStream(f).pipe(res);
    });
}
function lireCorps(req, rappel) {
    var morceaux = [];
    req.on('data', function (m) { morceaux.push(m); });
    req.on('end', function () {
        try { rappel(null, JSON.parse(Buffer.concat(morceaux).toString('utf8') || '{}')); }
        catch (e) { rappel(e); }
    });
}

var serveur = http.createServer(function (req, res) {
    var url = new URL(req.url, 'http://localhost');
    var chemin = decodeURIComponent(url.pathname);
    try {
        if (chemin === '/') return servirFichier(res, PAGES, 'accueil.html');
        if (chemin === '/cinematiques') return servirFichier(res, PAGES, 'cinematiques.html');
        if (chemin === '/ressources') return servirFichier(res, PAGES, 'ressources.html');
        if (chemin.indexOf('/pages/') === 0) return servirFichier(res, PAGES, chemin.slice(7));
        if (chemin.indexOf('/jeu/') === 0) return servirFichier(res, RACINE, chemin.slice(5));
        if (chemin.indexOf('/bibliotheque/') === 0) return servirFichier(res, BIBLIO, chemin.slice(14));

        if (chemin === '/api/ressources') return envoyerJSON(res, 200, ressources(url.searchParams.get('rafraichir') === '1'));
        if (chemin === '/api/copier' && req.method === 'POST') {
            return lireCorps(req, function (err, demande) {
                if (err) return envoyerJSON(res, 400, { erreur: 'Demande illisible.' });
                try { envoyerJSON(res, 200, copier(demande)); }
                catch (e) { envoyerJSON(res, 400, { erreur: e.message }); }
            });
        }

        if (chemin === '/api/projet') return envoyerJSON(res, 200, projet());
        if (chemin === '/api/carte') {
            var c = carte(Number(url.searchParams.get('id')));
            return c ? envoyerJSON(res, 200, c) : envoyerJSON(res, 404, { erreur: 'Carte introuvable.' });
        }
        if (chemin === '/api/scene') {
            var f = path.join(SCENES, Number(url.searchParams.get('id')) + '.json');
            return fs.existsSync(f) ? envoyerJSON(res, 200, lireJSON(f)) : envoyerJSON(res, 404, { erreur: 'Scène introuvable.' });
        }
        if (chemin === '/api/editeur') return editeurOuvert(function (o) { envoyerJSON(res, 200, { ouvert: o }); });
        if (chemin === '/api/enregistrer' && req.method === 'POST') {
            return lireCorps(req, function (err, demande) {
                if (err) return envoyerJSON(res, 400, { erreur: 'Demande illisible.' });
                editeurOuvert(function (ouvert) {
                    if (ouvert) return envoyerJSON(res, 409, { erreur: 'RPG Maker est ouvert : ferme-le d\'abord. Sinon, en enregistrant le projet, il écraserait la scène.' });
                    try { envoyerJSON(res, 200, enregistrer(demande)); }
                    catch (e) { envoyerJSON(res, 400, { erreur: e.message }); }
                });
            });
        }
        res.writeHead(404); res.end();
    } catch (e) {
        envoyerJSON(res, 500, { erreur: e.message });
    }
});

if (require.main === module) {
serveur.on('error', function (e) {
    if (e.code === 'EADDRINUSE') {
        console.log('Le Studio tourne déjà : ouvre http://localhost:' + PORT + '/');
        process.exit(0);
    }
    throw e;
});
serveur.listen(PORT, '127.0.0.1', function () {
    console.log('Studio prêt : http://localhost:' + PORT + '/');
    console.log('Laisse cette fenêtre ouverte tant que tu utilises le Studio.');
});
}

module.exports = { enregistrer: enregistrer, ecrireCE: ecrireCE, projet: projet, carte: carte, ressources: ressources, copier: copier, categorieProposee: categorieProposee };
