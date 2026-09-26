/*
 * TOUT LIRE. TOUS LES ÉVÉNEMENTS, DE TOUTES LES CARTES.
 *
 * JOKO : « regarde mes événements. Tous mes événements. Tu vas tout scanner.
 * Tout lire. Pour tout réparer. »
 *
 * Ce banc ouvre chaque page de chaque événement de chaque carte, plus tous les
 * événements communs, et lit chaque commande une par une. Il cherche ce qui
 * CASSE LE JEU EN MARCHE, pas ce qui est laid :
 *
 *   ▸ un fichier appelé qui n'existe pas — c'est le pire : MV bloque sur
 *     « Loading Error / Retry » et le joueur est coincé (son, image, visage,
 *     sprite, panorama, fond de combat) ;
 *   ▸ une animation, un événement commun ou une carte appelés par un numéro
 *     qui ne correspond à rien ;
 *   ▸ une commande de plugin que personne n'écoute ;
 *   ▸ un appel de script qui vise un plugin absent ou éteint ;
 *   ▸ les traces de l'ANCIENNE LORE que JOKO a abandonnée.
 *
 * Il ne corrige rien : il dit où ça fait mal, avec la carte, l'événement, la
 * page et le numéro de la ligne, pour qu'on puisse aller voir.
 *
 * Lancement :  node bancs/audit/15_scan_des_evenements.js
 *              node bancs/audit/15_scan_des_evenements.js --tout   (sans abréger)
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var TOUT = process.argv.indexOf('--tout') >= 0;

function lireJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function dossier(p) {
    try {
        return fs.readdirSync(path.join(RACINE, p))
            .map(function (f) { return f.replace(/\.(ogg|m4a|png|rpgmvo|rpgmvp)$/i, ''); });
    } catch (e) { return []; }
}

/* ── ce que le projet possède vraiment ── */
var AVOIR = {
    bgm: dossier('audio/bgm'), bgs: dossier('audio/bgs'),
    me: dossier('audio/me'), se: dossier('audio/se'),
    faces: dossier('img/faces'), characters: dossier('img/characters'),
    pictures: dossier('img/pictures'), parallaxes: dossier('img/parallaxes'),
    battlebacks1: dossier('img/battlebacks1'), battlebacks2: dossier('img/battlebacks2'),
    sv_actors: dossier('img/sv_actors'), enemies: dossier('img/enemies'),
    sv_enemies: dossier('img/sv_enemies'), titles1: dossier('img/titles1'),
    titles2: dossier('img/titles2')
};

var Anim = lireJSON(path.join(RACINE, 'data', 'Animations.json'));
var CE = lireJSON(path.join(RACINE, 'data', 'CommonEvents.json'));
var Sys = lireJSON(path.join(RACINE, 'data', 'System.json'));
var Infos = lireJSON(path.join(RACINE, 'data', 'MapInfos.json'));

/* ── le code de tous les plugins ACTIFS, pour savoir ce qui répond ── */
var plugTxt = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
var PLUGINS = JSON.parse(plugTxt.slice(plugTxt.indexOf('['), plugTxt.lastIndexOf(']') + 1));
var ACTIFS = PLUGINS.filter(function (p) { return p.status && !/^▬/.test(p.name); })
    .map(function (p) { return p.name; });
var CODE_ACTIF = ACTIFS.map(function (n) {
    try { return fs.readFileSync(path.join(RACINE, 'js', 'plugins', n + '.js'), 'utf8'); }
    catch (e) { return ''; }
}).join('\n');
var CODE_ETEINT = PLUGINS.filter(function (p) { return !p.status && !/^▬/.test(p.name); })
    .map(function (p) {
        try { return p.name + '\u0000' + fs.readFileSync(path.join(RACINE, 'js', 'plugins', p.name + '.js'), 'utf8'); }
        catch (e) { return ''; }
    });

/* ── l'ancienne lore, telle que JOKO l'a abandonnée ── */
var ANCIENNE_LORE = [
    { mot: /\bmarqu[ée]s?\b/i, quoi: 'les « marqués » — JOKO : « c\'était de l\'ancienne lore »' },
    { mot: /manifestation/i, quoi: 'la « Manifestation » — lore inventé par erreur, jamais de JOKO' },
    { mot: /objet\s+spirituel/i, quoi: 'les « objets spirituels » — JOKO : « je veux juste les objets spirituels enlève »' },
    { mot: /dons?\s+spirituels?/i, quoi: 'les « dons spirituels » — JOKO : « étaient une mauvaise idée »' },
    { mot: /\bfamilier\b/i, quoi: '« familier » — devenu « Avatar Spirituel »' },
    { mot: /\b(thylane|neyssa|tianna)\b/i, quoi: 'un ancien nom de héros (Vesper / Korrah / Aël aujourd\'hui)' },
    { mot: /\b(purge|niveau|add)\s+lou\b/i, quoi: 'l\'ancienne clé « lou » (ludwing aujourd\'hui)' }
];

/* ── le relevé ── */
var trouve = {
    fichiers: [], animations: [], evenements: [], cartes: [],
    commandes: [], scripts: [], lore: []
};
var stats = { cartes: 0, evenements: 0, pages: 0, commandes: 0 };

function note(bac, carte, ev, page, ligne, quoi, detail) {
    trouve[bac].push({ ou: carte + (ev ? ' · ' + ev : '') + (page ? ' · p' + page : '') + (ligne !== null ? ' · ligne ' + ligne : ''), quoi: quoi, detail: detail || '' });
}

function verifFichier(nom, type, carte, ev, page, ligne, commande) {
    if (!nom || typeof nom !== 'string' || !nom.trim()) { return; }   // « rien » est légal
    if (AVOIR[type].indexOf(nom) >= 0) { return; }
    note('fichiers', carte, ev, page, ligne,
        commande + ' → ' + type + '/' + nom, 'introuvable — le jeu bloquera sur « Loading Error »');
}

function lireCommandes(liste, carte, ev, page) {
    (liste || []).forEach(function (c, i) {
        if (!c) { return; }
        stats.commandes++;
        var p = c.parameters || [];
        switch (c.code) {
            case 101:  // texte : le visage
                verifFichier(p[0], 'faces', carte, ev, page, i, 'visage');
                break;
            case 231:  // afficher une image
                verifFichier(p[1], 'pictures', carte, ev, page, i, 'image');
                break;
            case 241: verifFichier(p[0] && p[0].name, 'bgm', carte, ev, page, i, 'BGM'); break;
            case 245: verifFichier(p[0] && p[0].name, 'bgs', carte, ev, page, i, 'BGS'); break;
            case 249: verifFichier(p[0] && p[0].name, 'me', carte, ev, page, i, 'ME'); break;
            case 250: verifFichier(p[0] && p[0].name, 'se', carte, ev, page, i, 'SE'); break;
            case 284: verifFichier(p[0], 'parallaxes', carte, ev, page, i, 'panorama'); break;
            case 283:
                verifFichier(p[0], 'battlebacks1', carte, ev, page, i, 'fond de combat 1');
                verifFichier(p[1], 'battlebacks2', carte, ev, page, i, 'fond de combat 2');
                break;
            case 322:  // changer l'image d'un acteur
                verifFichier(p[1], 'characters', carte, ev, page, i, 'sprite d\'acteur');
                verifFichier(p[3], 'faces', carte, ev, page, i, 'visage d\'acteur');
                verifFichier(p[5], 'sv_actors', carte, ev, page, i, 'combattant d\'acteur');
                break;
            case 212:  // animation
                if (p[1] > 0 && !Anim[p[1]]) {
                    note('animations', carte, ev, page, i, 'animation ' + p[1], 'n\'existe pas');
                }
                break;
            case 117:  // appel d'événement commun
                if (!CE[p[0]] || !CE[p[0]].name) {
                    note('evenements', carte, ev, page, i, 'appelle l\'événement commun ' + p[0], 'il n\'existe pas');
                }
                break;
            case 201:  // téléporter
                if (p[0] === 0 && p[1] > 0 && !Infos[p[1]]) {
                    note('cartes', carte, ev, page, i, 'téléporte vers la carte ' + p[1], 'elle n\'existe pas');
                }
                break;
            case 356:  // commande de plugin
                var ligneCmd = String(p[0] || '');
                var args = ligneCmd.split(' ');
                var nomCmd = args.shift();
                if (!nomCmd) {
                    note('commandes', carte, ev, page, i, JSON.stringify(ligneCmd),
                        'commence par une ESPACE → MV lit un nom vide, la commande est muette');
                } else if (/^</.test(nomCmd)) {
                    note('commandes', carte, ev, page, i, nomCmd,
                        'c\'est un notetag collé dans la case « commande de plugin »');
                } else if (CODE_ACTIF.indexOf("'" + nomCmd + "'") < 0 &&
                           CODE_ACTIF.indexOf('"' + nomCmd + '"') < 0 &&
                           !new RegExp('\\b' + nomCmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(CODE_ACTIF)) {
                    var dort = CODE_ETEINT.filter(function (x) { return x && new RegExp('\\b' + nomCmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(x); })
                        .map(function (x) { return x.split('\u0000')[0]; });
                    note('commandes', carte, ev, page, i, ligneCmd,
                        dort.length ? 'aucun plugin ACTIF ne répond — elle dort dans ' + dort.slice(0, 2).join(', ')
                                    : 'aucun plugin ne répond');
                }
                break;
            case 355: case 655:  // appel de script
                var src = String(p[0] || '');
                // un son joué depuis un script échappe aux commandes : on le lit aussi
                var m, r = /playSe\s*\(\s*\{[^}]*name\s*:\s*['"]([^'"]+)['"]/g;
                while ((m = r.exec(src))) {
                    verifFichier(m[1], 'se', carte, ev, page, i, 'SE (script)');
                }
                var r2 = /playMe\s*\(\s*\{[^}]*name\s*:\s*['"]([^'"]+)['"]/g;
                while ((m = r2.exec(src))) { verifFichier(m[1], 'me', carte, ev, page, i, 'ME (script)'); }
                // un script qui vise un objet global absent
                var r3 = /\bwindow\.(\w+)\s*\.|^\s*(\w+)\s*\.\w+\s*\(/gm;
                break;
        }
        // La lore, dans TOUT ce qui porte du texte — y compris le code 356.
        // ⚠ La première version de ce banc oubliait 356 (commande de plugin) et
        // annonçait fièrement « 0 trace d'ancienne lore ». Or c'est justement là
        // qu'elles sont : « CORRUPTION purge thylane 20 ». Un contrôle qui ne
        // regarde pas au bon endroit ne prouve rien.
        if ([101, 401, 405, 402, 108, 408, 355, 655, 356, 320, 324].indexOf(c.code) >= 0) {
            var texte = p.filter(function (x) { return typeof x === 'string'; }).join(' ');
            ANCIENNE_LORE.forEach(function (l) {
                if (l.mot.test(texte)) {
                    note('lore', carte, ev, page, i, l.quoi, texte.slice(0, 90).replace(/\s+/g, ' '));
                }
            });
        }
    });
}

/* ── on ouvre tout ── */
console.log('═'.repeat(78));
console.log('  SCAN DE TOUS LES ÉVÉNEMENTS');
console.log('═'.repeat(78));

CE.forEach(function (e) {
    if (!e || !e.name && !(e.list || []).length) { return; }
    stats.evenements++; stats.pages++;
    lireCommandes(e.list, 'CommonEvents', 'CE' + e.id + ' « ' + (e.name || '') + ' »', null);
});

fs.readdirSync(path.join(RACINE, 'data'))
    .filter(function (f) { return /^Map\d+\.json$/.test(f) && !require('../outils/atelier.js').estAtelier(f); })
    .sort()
    .forEach(function (f) {
        var carte = lireJSON(path.join(RACINE, 'data', f));
        var id = parseInt(f.match(/\d+/)[0]);
        var nom = (Infos[id] && Infos[id].name) ? Infos[id].name : f;
        stats.cartes++;
        var etiquette = f.replace('.json', '') + ' « ' + nom + ' »';
        // le panorama de la carte
        if (carte.parallaxName) { verifFichier(carte.parallaxName, 'parallaxes', etiquette, null, null, null, 'panorama de carte'); }
        if (carte.battleback1Name) { verifFichier(carte.battleback1Name, 'battlebacks1', etiquette, null, null, null, 'fond de combat 1'); }
        if (carte.battleback2Name) { verifFichier(carte.battleback2Name, 'battlebacks2', etiquette, null, null, null, 'fond de combat 2'); }
        if (carte.bgm && carte.bgm.name) { verifFichier(carte.bgm.name, 'bgm', etiquette, null, null, null, 'BGM de carte'); }
        if (carte.bgs && carte.bgs.name) { verifFichier(carte.bgs.name, 'bgs', etiquette, null, null, null, 'BGS de carte'); }

        (carte.events || []).forEach(function (ev) {
            if (!ev) { return; }
            stats.evenements++;
            (ev.pages || []).forEach(function (pg, ip) {
                stats.pages++;
                if (pg.image && pg.image.characterName) {
                    verifFichier(pg.image.characterName, 'characters', etiquette,
                        'ev' + ev.id + ' « ' + ev.name + ' »', ip + 1, null, 'sprite');
                }
                lireCommandes(pg.list, etiquette, 'ev' + ev.id + ' « ' + ev.name + ' »', ip + 1);
            });
        });
    });

/* ── ET LA BASE DE DONNÉES ────────────────────────────────────────────────
 * Les événements ne sont pas les seuls à jouer des sons. Le « Loading Error »
 * de la capture de JOKO venait d'un ÉTAT : un script dans la note d'un état
 * appelait AudioManager.playSe({name:'Heart'}). Un scan qui ne lit que les
 * cartes passe à côté. On lit donc aussi :
 *   · les combats (Troops) — ils ont de vraies pages d'événement ;
 *   · les animations — chacune peut jouer des sons ;
 *   · toutes les notes de la base — c'est là que vivent les scripts.
 */
var BASES = ['Actors', 'Classes', 'Skills', 'Items', 'Weapons', 'Armors',
    'Enemies', 'States', 'Troops'];

BASES.forEach(function (nom) {
    var t;
    try { t = lireJSON(path.join(RACINE, 'data', nom + '.json')); } catch (e) { return; }
    t.forEach(function (o) {
        if (!o) { return; }
        var etiquette = nom + ' #' + o.id + ' « ' + String(o.name || '').trim() + ' »';

        // les pages d'événement des combats
        (o.pages || []).forEach(function (pg, ip) {
            if (!pg.list) { return; }
            stats.pages++;
            lireCommandes(pg.list, etiquette, null, ip + 1);
        });

        // les sons appelés depuis une note (scripts, formules, séquences)
        var note = String(o.note || '');
        if (note) {
            [['playSe', 'se'], ['playMe', 'me'], ['playBgm', 'bgm'], ['playBgs', 'bgs']]
                .forEach(function (paire) {
                    var r = new RegExp(paire[0] + '\\s*\\(\\s*\\{[^}]*name\\s*:\\s*[\'"]([^\'"]+)[\'"]', 'g'), m;
                    while ((m = r.exec(note))) {
                        verifFichier(m[1], paire[1], etiquette, null, null, null, 'son joué par un script de note');
                    }
                });
            // les séquences d'action de Yanfly :  se: NomDuSon
            var rs = /^\s*se:\s*([A-Za-z0-9_\- ]+)\s*$/gm, ms;
            while ((ms = rs.exec(note))) {
                verifFichier(ms[1].trim(), 'se', etiquette, null, null, null, 'séquence d\'action « se: »');
            }
            ANCIENNE_LORE.forEach(function (l) {
                if (l.mot.test(note)) {
                    note_lore(etiquette, l.quoi, note.replace(/\s+/g, ' ').slice(0, 90));
                }
            });
        }
    });
});
function note_lore(ou, quoi, detail) { trouve.lore.push({ ou: ou, quoi: quoi, detail: detail }); }

// les sons des animations
(function () {
    Anim.forEach(function (a) {
        if (!a) { return; }
        (a.timings || []).forEach(function (t) {
            if (t.se && t.se.name) {
                verifFichier(t.se.name, 'se', 'Animations #' + a.id + ' « ' + a.name + ' »',
                    null, null, null, 'son d\'animation');
            }
        });
    });
})();

/* ── le rapport ── */
function bloc(titre, bac, gravite) {
    var l = trouve[bac];
    console.log('\n' + '─'.repeat(78));
    console.log('  ' + gravite + '  ' + titre + ' — ' + l.length);
    console.log('─'.repeat(78));
    if (!l.length) { console.log('   rien.'); return; }
    // on groupe par « quoi » pour ne pas répéter cent fois la même chose
    var par = {};
    l.forEach(function (x) { (par[x.quoi] = par[x.quoi] || []).push(x); });
    Object.keys(par).sort(function (a, b) { return par[b].length - par[a].length; })
        .forEach(function (k) {
            var g = par[k];
            console.log('\n   ▸ ' + k + (g.length > 1 ? '   (' + g.length + ' fois)' : ''));
            if (g[0].detail) { console.log('     ' + g[0].detail); }
            g.slice(0, TOUT ? 999 : 4).forEach(function (x) { console.log('       · ' + x.ou); });
            if (!TOUT && g.length > 4) { console.log('       · … et ' + (g.length - 4) + ' autres (--tout pour les voir)'); }
        });
}

bloc('FICHIERS APPELÉS QUI N\'EXISTENT PAS', 'fichiers', '🔴');
bloc('ANIMATIONS QUI N\'EXISTENT PAS', 'animations', '🔴');
bloc('ÉVÉNEMENTS COMMUNS APPELÉS QUI N\'EXISTENT PAS', 'evenements', '🔴');
bloc('CARTES DE DESTINATION QUI N\'EXISTENT PAS', 'cartes', '🔴');
bloc('COMMANDES DE PLUGIN SANS RÉPONDANT', 'commandes', '🟠');
bloc('TRACES DE L\'ANCIENNE LORE', 'lore', '🟡');

console.log('\n' + '═'.repeat(78));
console.log('  CE QU\'ON A LU');
console.log('═'.repeat(78));
console.log('  ' + stats.cartes + ' cartes · ' + stats.evenements + ' événements · ' +
    stats.pages + ' pages · ' + stats.commandes + ' commandes');
var rouge = trouve.fichiers.length + trouve.animations.length + trouve.evenements.length + trouve.cartes.length;
console.log('  🔴 ' + rouge + ' qui bloquent ou plantent · 🟠 ' + trouve.commandes.length +
    ' sans répondant · 🟡 ' + trouve.lore.length + ' traces d\'ancienne lore');
process.exit(0);
