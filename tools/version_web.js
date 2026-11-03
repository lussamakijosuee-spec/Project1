// node tools/version_web.js [dossier]  — la version web du jeu (par défaut dist/web)
// ⚠️ OUTIL DE TERMINAL — ne PAS l'ajouter au gestionnaire de plugins du jeu !
//
// JOKO, 2026-11-03 : « Met le jeu possible d'accéder par URL directement et qui se met à jour grâce
// à github », puis « Un 2e dépôt, juste le jeu ». GitHub (.github/workflows/jeu-en-ligne.yml) lance
// ce script à chaque push sur main et publie le dossier dans le dépôt public Project1-jeu.
//
// Le jeu pèse plus de 4 Go, GitHub Pages en prend 1 : la version web ne garde que ce que le jeu
// cite. Rien n'est modifié dans le projet, tout se fait dans le dossier de sortie :
//   - index.html, js/, data/, fonts/, icon/, movies/ : tels quels ;
//   - img/ : les grands dossiers génériques (characters, faces, enemies, tilesets…) ne gardent que
//     les images citées — par les données (n'importe quel texte, notes comprises) ou par une chaîne
//     d'un plugin actif ; les autres dossiers (system, menus, theatrhythm…) sont copiés en entier ;
//   - audio/ bgm, bgs, me, se : les sons cités, en .ogg et .m4a ; audio/_originaux_mp3 : non ;
//   - un nom cité avec d'autres majuscules que son fichier (« Inn » pour INN.ogg) : copié sous le nom
//     cité (Windows ne voit pas la différence, un serveur web si) ;
//   - un son sans .m4a (Safari, iPhone) : converti depuis le .ogg par ffmpeg, s'il est là ;
//   - js/casse_web.js, chargé en premier par index.html : un nom fabriqué par un plugin avec
//     d'autres majuscules (« flame_0 » pour Flame_0.png) est corrigé dans le navigateur ;
//   - .nojekyll (GitHub Pages sert alors les fichiers tels quels) et version.txt.
if (typeof PluginManager !== 'undefined') {
    console.warn('version_web.js est un outil de terminal, pas un plugin. Il ne fait rien en jeu.');
} else {
var fs = require('fs'), path = require('path'), cp = require('child_process');
var RACINE = path.join(__dirname, '..');
var SORTIE = path.resolve(RACINE, process.argv[2] || 'dist/web');
var MAX_SITE = 1024 * 1048576, MAX_FICHIER = 100 * 1048576;     // GitHub Pages : 1 Go ; git : 100 Mo par fichier

// les grands dossiers d'images où l'on trie ; les autres sont copiés en entier
var IMG_TRIES = ['characters', 'faces', 'sv_actors', 'enemies', 'sv_enemies', 'animations', 'tilesets',
    'titles1', 'titles2', 'parallaxes', 'battlebacks1', 'battlebacks2', 'pictures'];
var AUDIO = ['bgm', 'bgs', 'me', 'se'];
var EXT_AUDIO = ['.ogg', '.m4a'];

function lireData(f) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', f), 'utf8')); }
function sansExt(n) { return n.replace(/\.[^.]+$/, ''); }

// ── ce que le jeu cite ────────────────────────────────────────────────────────
// Tout texte des données et toute chaîne des plugins actifs, entier et découpé : un fichier est
// gardé si son nom (sans extension) y figure. Large exprès : une image de trop coûte quelques Ko,
// une image manquante fait planter le jeu (« Failed to load »).
var cites = new Set();
function citer(s) {
    if (typeof s !== 'string' || !s) { return; }
    cites.add(s);
    s.split(/[<>:,;|"'`\n\r\t=()\[\]{}\\\/]+/).forEach(function (t) {
        t = t.trim();
        if (!t) { return; }
        cites.add(t);
        if (/\.(png|jpe?g|ogg|m4a|webm|mp4|json)$/i.test(t)) { cites.add(sansExt(t)); }
        t.split(/\s+/).forEach(function (u) { if (u) { cites.add(u); } });
    });
}
function parcourir(o) {
    if (typeof o === 'string') { return citer(o); }
    if (Array.isArray(o)) { return o.forEach(parcourir); }
    if (o && typeof o === 'object') { Object.keys(o).forEach(function (k) { parcourir(o[k]); }); }
}
fs.readdirSync(path.join(RACINE, 'data')).filter(function (f) { return /\.json$/i.test(f); }).forEach(function (f) {
    parcourir(lireData(f));
});
var plugins = (new Function(fs.readFileSync(path.join(RACINE, 'js/plugins.js'), 'utf8') + '; return $plugins;'))();
plugins.filter(function (p) { return p.status; }).forEach(function (p) {
    parcourir(p.parameters);
    var f = path.join(RACINE, 'js/plugins', p.name + '.js');
    if (!fs.existsSync(f)) { return; }
    var src = fs.readFileSync(f, 'utf8');
    (src.match(/(["'`])(?:\\.|(?!\1)[^\\\n])*\1/g) || []).forEach(function (q) { citer(q.slice(1, -1)); });
});

// ── les références exactes des données (pour la casse et les .m4a) ───────────
var refs = [];
function ref(dossier, nom, ou) { if (nom) { refs.push({ dossier: dossier, nom: nom, ou: ou }); } }
function son(type, a, ou) { if (a && a.name) { ref('audio/' + type, a.name, ou); } }
function route(l, ou) {
    (l || []).forEach(function (m) {
        if (m.code === 41) { ref('img/characters', m.parameters[0], ou); }
        if (m.code === 44) { son('se', m.parameters[0], ou); }
    });
}
function commandes(liste, ou) {
    (liste || []).forEach(function (c, i) {
        var p = c.parameters || [], o = ou + ' l.' + (i + 1);
        switch (c.code) {
            case 101: ref('img/faces', p[0], o); break;
            case 132: case 241: son('bgm', p[0], o); break;
            case 140: son('bgm', p[1], o); break;
            case 133: case 139: case 249: son('me', p[0], o); break;
            case 245: son('bgs', p[0], o); break;
            case 250: son('se', p[0], o); break;
            case 231: ref('img/pictures', p[1], o); break;
            case 283: ref('img/battlebacks1', p[0], o); ref('img/battlebacks2', p[1], o); break;
            case 284: ref('img/parallaxes', p[0], o); break;
            case 322: ref('img/characters', p[1], o); ref('img/faces', p[3], o); ref('img/sv_actors', p[5], o); break;
            case 323: ref('img/characters', p[1], o); break;
            case 205: route(p[1] && p[1].list, o); break;
        }
    });
}
var SYS = lireData('System.json');
lireData('Actors.json').forEach(function (a) {
    if (!a) { return; }
    ref('img/characters', a.characterName, 'acteur ' + a.id); ref('img/faces', a.faceName, 'acteur ' + a.id); ref('img/sv_actors', a.battlerName, 'acteur ' + a.id);
});
lireData('Enemies.json').forEach(function (e) { if (e) { ref(SYS.optSideView ? 'img/sv_enemies' : 'img/enemies', e.battlerName, 'ennemi ' + e.id); } });
lireData('Animations.json').forEach(function (a) {
    if (!a) { return; }
    ref('img/animations', a.animation1Name, 'animation ' + a.id); ref('img/animations', a.animation2Name, 'animation ' + a.id);
    (a.timings || []).forEach(function (t) { son('se', t.se, 'animation ' + a.id); });
});
lireData('Tilesets.json').forEach(function (t) { if (t) { t.tilesetNames.forEach(function (n) { ref('img/tilesets', n, 'tileset ' + t.id); }); } });
ref('img/titles1', SYS.title1Name, 'système'); ref('img/titles2', SYS.title2Name, 'système');
son('bgm', SYS.titleBgm, 'système'); son('bgm', SYS.battleBgm, 'système');
['defeatMe', 'gameoverMe', 'victoryMe'].forEach(function (k) { son('me', SYS[k], 'système'); });
(SYS.sounds || []).forEach(function (s) { son('se', s, 'système'); });
['boat', 'ship', 'airship'].forEach(function (k) { if (SYS[k]) { ref('img/characters', SYS[k].characterName, 'système'); son('bgm', SYS[k].bgm, 'système'); } });
lireData('CommonEvents.json').forEach(function (ce) { if (ce) { commandes(ce.list, 'événement commun ' + ce.id); } });
lireData('Troops.json').forEach(function (t) { if (t) { t.pages.forEach(function (p, k) { commandes(p.list, 'troupe ' + t.id + ' p' + (k + 1)); }); } });
lireData('MapInfos.json').forEach(function (mi) {
    if (!mi) { return; }
    var f = 'Map' + String(mi.id).padStart(3, '0') + '.json';
    if (!fs.existsSync(path.join(RACINE, 'data', f))) { return; }
    var m = lireData(f), o = 'carte ' + mi.id;
    ref('img/parallaxes', m.parallaxName, o); ref('img/battlebacks1', m.battleback1Name, o); ref('img/battlebacks2', m.battleback2Name, o);
    son('bgm', m.bgm, o); son('bgs', m.bgs, o);
    (m.events || []).forEach(function (ev) {
        if (!ev) { return; }
        ev.pages.forEach(function (p, k) {
            var oo = o + ' év.' + ev.id + ' p' + (k + 1);
            ref('img/characters', p.image.characterName, oo); route(p.moveRoute && p.moveRoute.list, oo); commandes(p.list, oo);
        });
    });
});

// ── la copie ─────────────────────────────────────────────────────────────────
function vider(d) { if (fs.existsSync(d)) { fs.rmSync(d, { recursive: true, force: true }); } }
var nFichiers = 0, taille = 0, gros = [];
function copier(src, dst) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    var t = fs.statSync(dst).size;
    nFichiers++; taille += t;
    if (t > MAX_FICHIER) { gros.push(path.relative(SORTIE, dst)); }
}
function copierTout(rel) {
    var src = path.join(RACINE, rel);
    if (!fs.existsSync(src)) { return; }
    if (fs.statSync(src).isFile()) { return copier(src, path.join(SORTIE, rel)); }
    fs.readdirSync(src).forEach(function (n) { copierTout(path.join(rel, n)); });
}
vider(SORTIE);
fs.mkdirSync(SORTIE, { recursive: true });
['index.html', 'js', 'data', 'fonts', 'icon', 'movies'].forEach(copierTout);

var gardes = 0, laisses = 0;
fs.readdirSync(path.join(RACINE, 'img')).forEach(function (d) {
    var rel = path.join('img', d);
    if (!fs.statSync(path.join(RACINE, rel)).isDirectory()) { return copierTout(rel); }
    if (IMG_TRIES.indexOf(d) < 0) { return copierTout(rel); }
    fs.readdirSync(path.join(RACINE, rel)).forEach(function (n) {
        var f = path.join(rel, n);
        if (fs.statSync(path.join(RACINE, f)).isDirectory()) { return copierTout(f); }
        if (cites.has(sansExt(n))) { copier(path.join(RACINE, f), path.join(SORTIE, f)); gardes++; } else { laisses++; }
    });
});
AUDIO.forEach(function (d) {
    var rel = path.join('audio', d), src = path.join(RACINE, rel);
    if (!fs.existsSync(src)) { return; }
    fs.readdirSync(src).forEach(function (n) {
        if (EXT_AUDIO.indexOf(path.extname(n).toLowerCase()) < 0) { return; }
        if (cites.has(sansExt(n))) { copier(path.join(src, n), path.join(SORTIE, rel, n)); gardes++; } else { laisses++; }
    });
});

// ── la casse, puis les .m4a ─────────────────────────────────────────────────
var listes = {};
function contenu(base, dossier) {
    var cle = base + '|' + dossier;
    if (!listes[cle]) {
        var d = path.join(base, dossier), l = { exact: new Set(), min: {} };
        if (fs.existsSync(d)) { fs.readdirSync(d).forEach(function (n) { l.exact.add(n); l.min[n.toLowerCase()] = n; }); }
        listes[cle] = l;
    }
    return listes[cle];
}
var alias = [], manquants = [];
refs.forEach(function (r) {
    var exts = /^audio\//.test(r.dossier) ? EXT_AUDIO : ['.png'];
    exts.forEach(function (x) {
        var n = r.nom + x, l = contenu(SORTIE, r.dossier);
        if (l.exact.has(n)) { return; }
        // dans le projet : le fichier même (un oubli du tri), ou le même nom avec d'autres majuscules
        var s = contenu(RACINE, r.dossier), autre = s.exact.has(n) ? n : s.min[n.toLowerCase()];
        if (autre) {
            copier(path.join(RACINE, r.dossier, autre), path.join(SORTIE, r.dossier, n));
            l.exact.add(n);
            if (autre !== n) { alias.push(r.dossier + '/' + n + ' ← ' + autre); }
        } else if (x !== '.m4a') {
            manquants.push(r.dossier + '/' + n + '  (' + r.ou + ')');
        }
    });
});
var ffmpeg = null;
try { cp.execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); ffmpeg = 'ffmpeg'; } catch (e) { ffmpeg = null; }
var convertis = [], sansM4a = [];
AUDIO.forEach(function (d) {
    var dossier = path.join(SORTIE, 'audio', d);
    if (!fs.existsSync(dossier)) { return; }
    fs.readdirSync(dossier).filter(function (n) { return /\.ogg$/i.test(n); }).forEach(function (n) {
        var m4a = path.join(dossier, sansExt(n) + '.m4a');
        if (fs.existsSync(m4a)) { return; }
        if (!ffmpeg) { sansM4a.push('audio/' + d + '/' + n); return; }
        try {
            cp.execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', path.join(dossier, n), '-vn', '-c:a', 'aac', '-b:a', '128k', m4a], { stdio: 'ignore' });
            nFichiers++; taille += fs.statSync(m4a).size;
            convertis.push('audio/' + d + '/' + sansExt(n) + '.m4a');
        } catch (e) { sansM4a.push('audio/' + d + '/' + n + ' (ffmpeg : ' + e.message.split('\n')[0] + ')'); }
    });
});

// ── la casse, au chargement ──────────────────────────────────────────────────
// Un nom qu'un plugin fabrique (« flame_0 » pour Flame_0.png, MOG_EventIndicators) n'est dans aucune
// donnée : js/casse_web.js (tools/casse_web.js + la liste des fichiers de la version) corrige, dans le
// navigateur, toute adresse demandée avec d'autres majuscules. Chargé avant tout le reste.
var tous = [];
(function lister(d) {
    fs.readdirSync(d, { withFileTypes: true }).forEach(function (e) {
        var p = path.join(d, e.name);
        if (e.isDirectory()) { return lister(p); }
        tous.push(path.relative(SORTIE, p).split(path.sep).map(encodeURIComponent).join('/'));
    });
})(SORTIE);
var casse = fs.readFileSync(path.join(__dirname, 'casse_web.js'), 'utf8').replace('/*LISTE*/[]', JSON.stringify(tous));
fs.writeFileSync(path.join(SORTIE, 'js/casse_web.js'), casse);
nFichiers++; taille += Buffer.byteLength(casse);
var page = fs.readFileSync(path.join(SORTIE, 'index.html'), 'utf8');
fs.writeFileSync(path.join(SORTIE, 'index.html'), page.replace('<script', '<script type="text/javascript" src="js/casse_web.js"></script>\n        <script'));

// ── pour GitHub Pages ────────────────────────────────────────────────────────
fs.writeFileSync(path.join(SORTIE, '.nojekyll'), '');
var version = process.env.GITHUB_SHA || '';
if (!version) { try { version = cp.execSync('git rev-parse HEAD', { cwd: RACINE }).toString().trim(); } catch (e) { version = 'inconnue'; } }
fs.writeFileSync(path.join(SORTIE, 'version.txt'), 'commit ' + version + '\nconstruite le ' + new Date().toISOString() + '\n');

// ── le bilan ─────────────────────────────────────────────────────────────────
function Mo(x) { return (x / 1048576).toFixed(0) + ' Mo'; }
console.log('Version web : ' + path.relative(RACINE, SORTIE));
console.log('  ' + nFichiers + ' fichiers, ' + Mo(taille) + ' (images et sons : ' + gardes + ' cités gardés, ' + laisses + ' jamais cités laissés)');
if (alias.length) { console.log('  casse : ' + alias.length + ' copie(s) sous le nom cité — ' + alias.join(' · ')); }
if (convertis.length) { console.log('  .m4a créés pour Safari / iPhone : ' + convertis.length); }
var erreurs = 0;
if (sansM4a.length) { console.log('  ⚠ sans .m4a (ffmpeg absent ?) : ' + sansM4a.length + ' — ' + sansM4a.slice(0, 5).join(' · ')); }
if (manquants.length) { erreurs++; console.log('  ✗ introuvables : ' + manquants.length + '\n    ' + manquants.slice(0, 20).join('\n    ')); }
if (gros.length) { erreurs++; console.log('  ✗ plus de 100 Mo (git les refuse) : ' + gros.join(' · ')); }
if (taille > MAX_SITE) { erreurs++; console.log('  ✗ plus de 1 Go : GitHub Pages refusera le site'); }
console.log(erreurs ? '❌ version web incomplète' : '✅ version web prête');
process.exit(erreurs ? 1 : 0);
}
