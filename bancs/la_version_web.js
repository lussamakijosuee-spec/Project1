/*
 * LA VERSION WEB — ce que GitHub publie contient-il tout ce que le jeu demande ?
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-03 : « Met le jeu possible d'accéder par URL directement et qui se met à jour grâce
 * à github », puis « Un 2e dépôt, juste le jeu ». tools/version_web.js ne garde que ce que le jeu
 * cite (le jeu pèse 4 Go, GitHub Pages en prend 1) ; une image oubliée, et le jeu en ligne plante
 * (« Failed to load »). Ce banc construit la version web (ou relit une version déjà construite) et
 * vérifie, avec son propre relevé des données (pas celui de l'outil) :
 *
 *   ① chaque image et chaque son que les données demandent est là, AVEC LA MÊME CASSE (un serveur
 *     web la respecte, Windows non) — les sons en .ogg et en .m4a (Safari, iPhone) ;
 *   ② le son « Inn » (le fichier du projet s'appelle INN) est copié sous le nom cité ;
 *   ③ rien de privé : ni docs, ni bancs, ni studio, ni CLAUDE.md, ni les mp3 d'origine ;
 *   ④ GitHub l'accepte : moins de 1 Go, aucun fichier de plus de 100 Mo, .nojekyll, version.txt ;
 *   ⑤ index.html et chaque script qu'il charge, chaque plugin actif ;
 *   ⑥ js/casse_web.js, chargé en premier : un nom fabriqué par un plugin avec d'autres majuscules
 *     (« flame_0 » de MOG_EventIndicators pour Flame_0.png) prend le nom du vrai fichier ; un nom
 *     exact et un fichier absent sous toute casse ne bougent pas ;
 *   contre-épreuve : un fichier cité retiré exprès de la version est attrapé par ①.
 *
 *   node bancs/la_version_web.js              (construit dans un dossier temporaire : ~5 min)
 *   node bancs/la_version_web.js dist/web     (relit une version déjà construite)
 */
'use strict';
var fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
var RACINE = path.join(__dirname, '..');
var ok = 0, ko = 0;
function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }

var SORTIE = process.argv[2] ? path.resolve(process.argv[2]) : path.join(os.tmpdir(), 'version_web_banc');
if (!process.argv[2]) {
    console.log('Construction de la version web dans ' + SORTIE + ' …');
    try { console.log(cp.execFileSync(process.execPath, [path.join(RACINE, 'tools/version_web.js'), SORTIE], { cwd: RACINE }).toString().trim()); }
    catch (e) { console.log(String(e.stdout || e.message)); V('tools/version_web.js finit sans erreur', false); }
}

// ── le relevé des données, indépendant de l'outil ───────────────────────────
function lire(f) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', f), 'utf8')); }
var refs = [];
function ref(d, n, ou) { if (n) { refs.push({ d: d, n: n, ou: ou }); } }
function son(t, a, ou) { if (a && a.name) { ref('audio/' + t, a.name, ou); } }
function route(l, ou) { (l || []).forEach(function (m) { if (m.code === 41) { ref('img/characters', m.parameters[0], ou); } if (m.code === 44) { son('se', m.parameters[0], ou); } }); }
function commandes(l, ou) {
    (l || []).forEach(function (c, i) {
        var p = c.parameters || [], o = ou + ' l.' + (i + 1);
        if (c.code === 101) { ref('img/faces', p[0], o); }
        if (c.code === 132 || c.code === 241) { son('bgm', p[0], o); }
        if (c.code === 140) { son('bgm', p[1], o); }
        if (c.code === 133 || c.code === 139 || c.code === 249) { son('me', p[0], o); }
        if (c.code === 245) { son('bgs', p[0], o); }
        if (c.code === 250) { son('se', p[0], o); }
        if (c.code === 231) { ref('img/pictures', p[1], o); }
        if (c.code === 283) { ref('img/battlebacks1', p[0], o); ref('img/battlebacks2', p[1], o); }
        if (c.code === 284) { ref('img/parallaxes', p[0], o); }
        if (c.code === 322) { ref('img/characters', p[1], o); ref('img/faces', p[3], o); ref('img/sv_actors', p[5], o); }
        if (c.code === 323) { ref('img/characters', p[1], o); }
        if (c.code === 205) { route(p[1] && p[1].list, o); }
    });
}
var S = lire('System.json');
lire('Actors.json').forEach(function (a) { if (a) { ref('img/characters', a.characterName, 'acteur ' + a.id); ref('img/faces', a.faceName, 'acteur ' + a.id); ref('img/sv_actors', a.battlerName, 'acteur ' + a.id); } });
lire('Enemies.json').forEach(function (e) { if (e) { ref(S.optSideView ? 'img/sv_enemies' : 'img/enemies', e.battlerName, 'ennemi ' + e.id); } });
lire('Animations.json').forEach(function (a) { if (a) { ref('img/animations', a.animation1Name, 'animation ' + a.id); ref('img/animations', a.animation2Name, 'animation ' + a.id); (a.timings || []).forEach(function (t) { son('se', t.se, 'animation ' + a.id); }); } });
lire('Tilesets.json').forEach(function (t) { if (t) { t.tilesetNames.forEach(function (n) { ref('img/tilesets', n, 'tileset ' + t.id); }); } });
ref('img/titles1', S.title1Name, 'système'); ref('img/titles2', S.title2Name, 'système');
son('bgm', S.titleBgm, 'système'); son('bgm', S.battleBgm, 'système');
['defeatMe', 'gameoverMe', 'victoryMe'].forEach(function (k) { son('me', S[k], 'système'); });
(S.sounds || []).forEach(function (s) { son('se', s, 'système'); });
['boat', 'ship', 'airship'].forEach(function (k) { if (S[k]) { ref('img/characters', S[k].characterName, 'système'); son('bgm', S[k].bgm, 'système'); } });
// ce que MV charge sans que les données le citent
['Window', 'IconSet', 'Balloon', 'Shadow1', 'Shadow2', 'Damage', 'States', 'Weapons1', 'Weapons2', 'Weapons3', 'ButtonSet', 'Loading', 'GameOver'].forEach(function (n) { ref('img/system', n, 'MV'); });
lire('CommonEvents.json').forEach(function (ce) { if (ce) { commandes(ce.list, 'événement commun ' + ce.id); } });
lire('Troops.json').forEach(function (t) { if (t) { t.pages.forEach(function (p, k) { commandes(p.list, 'troupe ' + t.id + ' p' + (k + 1)); }); } });
lire('MapInfos.json').forEach(function (mi) {
    if (!mi) { return; }
    var f = 'Map' + String(mi.id).padStart(3, '0') + '.json';
    if (!fs.existsSync(path.join(RACINE, 'data', f))) { return; }
    var m = lire(f), o = 'carte ' + mi.id;
    ref('img/parallaxes', m.parallaxName, o); ref('img/battlebacks1', m.battleback1Name, o); ref('img/battlebacks2', m.battleback2Name, o);
    son('bgm', m.bgm, o); son('bgs', m.bgs, o);
    (m.events || []).forEach(function (ev) { if (ev) { ev.pages.forEach(function (p, k) { var oo = o + ' év.' + ev.id + ' p' + (k + 1); ref('img/characters', p.image.characterName, oo); route(p.moveRoute && p.moveRoute.list, oo); commandes(p.list, oo); }); } });
});

var dossiers = {};
function present(rel) {
    var d = path.dirname(rel), n = path.basename(rel);
    if (!dossiers[d]) { try { dossiers[d] = new Set(fs.readdirSync(path.join(SORTIE, d))); } catch (e) { dossiers[d] = new Set(); } }
    return dossiers[d].has(n);
}
function absents() {
    dossiers = {};
    var l = [], vus = new Set();
    refs.forEach(function (r) {
        (/^audio\//.test(r.d) ? ['.ogg', '.m4a'] : ['.png']).forEach(function (x) {
            var rel = r.d + '/' + r.n + x;
            if (vus.has(rel)) { return; }
            vus.add(rel);
            if (!present(rel)) { l.push(rel + '  (' + r.ou + ')'); }
        });
    });
    return l;
}

console.log('\n① Tout ce que les données demandent, avec la même casse (' + refs.length + ' références)');
var a = absents();
V('chaque image et chaque son cité est dans la version web, en .ogg et .m4a pour les sons', a.length === 0, a.length + ' absent(s)' + (a.length ? ' : ' + a.slice(0, 5).join(' · ') : ''));

console.log('\n② La casse');
var projetMe = fs.readdirSync(path.join(RACINE, 'audio/me'));
V('le projet n\'a que INN.ogg, la version web a aussi Inn.ogg et Inn.m4a (le nom cité)', projetMe.indexOf('Inn.ogg') < 0 && present('audio/me/Inn.ogg') && present('audio/me/Inn.m4a'));

console.log('\n③ Rien de privé');
var prives = ['docs', 'bancs', 'studio', 'tools', 'CLAUDE.md', 'audio/_originaux_mp3', 'databackup', 'node_modules', 'save', '.git'].filter(function (p) { return fs.existsSync(path.join(SORTIE, p)); });
V('ni docs, ni bancs, ni studio, ni outils, ni CLAUDE.md, ni les mp3 d\'origine, ni sauvegardes', prives.length === 0, prives.join(', '));

console.log('\n④ GitHub l\'accepte');
var taille = 0, n = 0, gros = [];
(function compter(d) { fs.readdirSync(d, { withFileTypes: true }).forEach(function (e) { var p = path.join(d, e.name); if (e.isDirectory()) { return compter(p); } var t = fs.statSync(p).size; taille += t; n++; if (t > 100 * 1048576) { gros.push(path.relative(SORTIE, p)); } }); })(SORTIE);
V('moins de 1 Go (la limite de GitHub Pages)', taille < 1024 * 1048576, (taille / 1048576).toFixed(0) + ' Mo, ' + n + ' fichiers');
V('aucun fichier de plus de 100 Mo (git les refuse)', gros.length === 0, gros.join(' · '));
V('.nojekyll (Pages sert tout tel quel) et version.txt', present('.nojekyll') && present('version.txt'));

console.log('\n⑤ Le jeu démarre');
var html = fs.existsSync(path.join(SORTIE, 'index.html')) ? fs.readFileSync(path.join(SORTIE, 'index.html'), 'utf8') : '';
var scripts = (html.match(/src="([^"]+)"/g) || []).map(function (s) { return s.slice(5, -1); });
var manquentJs = scripts.filter(function (s) { return !present(s); });
V('index.html et chacun des ' + scripts.length + ' scripts qu\'il charge', html && scripts.length > 5 && manquentJs.length === 0, manquentJs.join(' · '));
var plugins = (new Function(fs.readFileSync(path.join(RACINE, 'js/plugins.js'), 'utf8') + '; return $plugins;'))();
var sansPlugin = plugins.filter(function (p) { return p.status && !present('js/plugins/' + p.name + '.js'); }).map(function (p) { return p.name; });
V('chaque plugin actif', sansPlugin.length === 0, sansPlugin.join(' · '));

console.log('\n⑥ La casse au chargement (js/casse_web.js)');
V('index.html charge js/casse_web.js avant tout le reste', scripts[0] === 'js/casse_web.js' && present('js/casse_web.js'), scripts[0]);
var vm = require('vm'), ctx = vm.createContext({});
ctx.window = ctx;
['HTMLImageElement', 'HTMLMediaElement', 'HTMLScriptElement'].forEach(function (k) {
    ctx[k] = function () { };
    Object.defineProperty(ctx[k].prototype, 'src', { get: function () { return this._s; }, set: function (v) { this._s = v; }, configurable: true });
});
ctx.XMLHttpRequest = function () { };
ctx.XMLHttpRequest.prototype.open = function (m, u) { this._u = u; };
vm.runInContext(fs.readFileSync(path.join(SORTIE, 'js/casse_web.js'), 'utf8'), ctx);
function demander(C, url) { var o = new ctx[C](); if (C === 'XMLHttpRequest') { o.open('GET', url); return o._u; } o.src = url; return o._s; }
// un son dont le nom a des majuscules, et un personnage en « $ » (MV l'encode : %24)
var sonMaj = fs.readdirSync(path.join(SORTIE, 'audio/se')).filter(function (n) { return /[A-Z]/.test(n) && n.toLowerCase() !== n; })[0];
var dollar = fs.readdirSync(path.join(SORTIE, 'img/characters')).filter(function (n) { return n[0] === '$' && /[A-Z]/.test(n); })[0];
V('MOG_EventIndicators demande « flame_0 » : l\'image prend le nom de Flame_0.png (absent tel quel de la version)',
    !present('img/eventindicators/flame_0.png') && demander('HTMLImageElement', 'img/eventindicators/flame_0.png') === 'img/eventindicators/Flame_0.png');
V('un son demandé en minuscules (XMLHttpRequest, comme WebAudio) prend le nom du fichier', !!sonMaj && demander('XMLHttpRequest', 'audio/se/' + encodeURIComponent(sonMaj.toLowerCase())) === 'audio/se/' + encodeURIComponent(sonMaj), sonMaj);
V('un nom encodé par MV (« %24 » pour « $ ») aussi', !!dollar && demander('HTMLImageElement', 'img/characters/' + encodeURIComponent(dollar.toLowerCase())) === 'img/characters/' + encodeURIComponent(dollar), dollar);
V('une donnée (data/actors.json → Actors.json) et un script', demander('XMLHttpRequest', 'data/actors.json') === 'data/Actors.json' && demander('HTMLScriptElement', 'js/plugins/mog_eventtext.js') === 'js/plugins/MOG_EventText.js');
V('contre-épreuve : un nom exact ne bouge pas, un fichier absent sous toute casse non plus (il ne cache rien)',
    demander('HTMLImageElement', 'img/eventindicators/Flame_0.png') === 'img/eventindicators/Flame_0.png' && demander('HTMLImageElement', 'img/pictures/NExistePas_123.png') === 'img/pictures/NExistePas_123.png');

console.log('\nContre-épreuve');
var cible = 'audio/me/Inn.ogg', garde = path.join(os.tmpdir(), 'version_web_banc_Inn.ogg');
fs.renameSync(path.join(SORTIE, cible), garde);
try { var b = absents(); V('un son cité retiré exprès de la version est attrapé par ①', b.some(function (x) { return x.indexOf(cible) === 0; }), b.length + ' absent(s)'); }
finally { fs.renameSync(garde, path.join(SORTIE, cible)); }

console.log('\n' + (ko ? '❌ ' + ko + ' échec(s), ' + ok + ' réussite(s)' : '✅ TOUT PASSE (' + ok + ' contrôles)'));
process.exit(ko ? 1 : 0);
