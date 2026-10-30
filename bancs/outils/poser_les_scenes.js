/*
 * LA VIE DU VILLAGE — les interactions, en ÉVÉNEMENTS (JOKO, 2026-10-30)
 * ---------------------------------------------------------------------------
 * JOKO : « je préfère largement que ce soit un événement que ce soit un
 * plugin […] je parle des interactions », « des événements extrêmement longs,
 * c'est pas vraiment grave ».
 *
 * Chaque carte reçoit UN événement « 🏘 La vie — … » (processus parallèle,
 * sans image). Il tourne en boucle : toutes les une seconde et demie, chaque
 * scène a une chance sur deux d'être essayée ; si ses gens sont là, libres, près l'un de l'autre, à la
 * bonne heure, et que le joueur peut les voir, la scène se joue : ils
 * s'arrêtent, se tournent l'un vers l'autre, une bulle, une phrase au-dessus
 * de leur tête (GALV), un son. Puis chacun reprend sa journée.
 *
 * Tout est en commandes ordinaires : « Définir un déplacement », « Afficher
 * une bulle », « Afficher un message » (<c:…> de GALV), « Attendre », « Jouer
 * un son ». JOKO les change dans l'éditeur comme les siennes. Seuls quelques
 * appels aident : VieDuVillage.ensemble(…) dans les conditions, et VIE
 * arreter / reprendre (le PNJ ne repart pas au milieu de sa phrase). Un PNJ
 * de passage (une copie d'AlleesEtVenues) se désigne « carte:événement » :
 * VIE dire 42:6 150 BÉRÉNICE !
 *
 *   node bancs/outils/poser_les_scenes.js            → contrôle
 *   node bancs/outils/poser_les_scenes.js --ecrire   → écrit les cartes
 *
 * Un événement « 🏘 » que JOKO a retouché (il n'a plus la marque
 * « ◆ SCÈNES ») n'est jamais réécrit.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var D = require('./recettes/dsl.js');
var A = D.A, C = D.C, si = D.si, cat = D.cat;
var RACINE = path.join(__dirname, '..', '..');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var VAR_TIRAGE = 886;
var DOS = path.join(__dirname, 'scenes');
var LOTS = fs.readdirSync(DOS).filter(function (x) { return /\.js$/.test(x); }).sort().map(function (x) { return require(path.join(DOS, x)); });

function fichier(n) { return path.join(RACINE, 'data', 'Map' + String(n).padStart(3, '0') + '.json'); }
function estVisiteur(q) { return typeof q === 'string' && /^\d+:\d+$/.test(q); }
function couper(t, n) {
    var l = [], cur = '';
    String(t).split(' ').forEach(function (m) { if (cur && (cur + ' ' + m).length > n) { l.push(cur); cur = m; } else cur = cur ? cur + ' ' + m : m; });
    if (cur) l.push(cur);
    return l;
}
function q(x) { return typeof x === 'number' ? String(x) : "'" + x + "'"; }

/* ── les gestes d'une scène → des commandes ───────────────────────────── */
function geste(g) {
    var verbe = g[0];
    if (verbe === 'dit') {
        var qui = g[1], texte = g[2], duree = g[3] || Math.max(110, Math.min(260, 50 + texte.length * 3));
        var att = g[4] !== undefined ? g[4] : Math.round(duree * 0.7);
        var l;
        if (estVisiteur(qui)) l = A.plugin('VIE dire ' + qui + ' ' + duree + ' ' + couper(texte, 34).join('|'));
        else {
            var lignes = couper(texte, 34);
            l = [[101, 0, ['', 0, 0, 2]]].concat(lignes.map(function (x, i) { return [401, 0, [(i === 0 ? '<c:' + qui + ',' + duree + ',0>' : '') + x]]; }));
        }
        return att ? cat(l, A.attendre(att)) : l;
    }
    if (verbe === 'bulle') {
        if (estVisiteur(g[1])) return cat(A.plugin('VIE bulle ' + g[1] + ' ' + g[2]), A.attendre(g[3] || 40));
        return A.bulle(g[1], g[2], g[3] !== false);
    }
    if (verbe === 'tourne') {            // g[1] se tourne vers g[2] (un PNJ, ou 'joueur')
        if (estVisiteur(g[1]) || estVisiteur(g[2])) return A.plugin('VIE tourner ' + g[1] + ' ' + g[2]);
        var vers = g[2] === 'joueur' ? 'this.turnTowardPlayer()' : 'this.turnTowardCharacter($gameMap.event(' + g[2] + '))';
        return D.route(g[1], [D.M.js(vers)], { attendre: false });
    }
    if (verbe === 'face') {              // ils se font face
        return cat(geste(['tourne', g[1], g[2]]), geste(['tourne', g[2], g[1]]));
    }
    if (verbe === 'pas') {               // quelques pas : g[2] = liste de M.*
        return D.route(g[1], g[2], { attendre: true });
    }
    if (verbe === 'son') return A.se(g[1], g[2] || 70, g[3] || 100);
    if (verbe === 'attend') return A.attendre(g[1]);
    if (verbe === 'js') return A.js(g[1]);
    if (verbe === 'si') return si(C.js(g[1]), cat.apply(null, g[2].map(geste)), g[3] ? cat.apply(null, g[3].map(geste)) : null);
    if (verbe === 'hasard') {            // une branche parmi plusieurs
        var br = g[1], l2 = A.vrHasard(VAR_TIRAGE + 1, 1, br.length);
        function chaine(i) { return i === br.length - 1 ? cat.apply(null, br[i].map(geste)) : si(C.vr(VAR_TIRAGE + 1, '=', i + 1), cat.apply(null, br[i].map(geste)), chaine(i + 1)); }
        return cat(l2, chaine(0));
    }
    throw new Error('geste inconnu : ' + verbe);
}
function scene(s, i, carte) {
    var gens = s.qui.map(q).join(', ');
    var cond = [s.qui.length > 1 ? 'VieDuVillage.ensemble(' + gens + ', ' + (s.dist || 3) + ')' : 'VieDuVillage.libre(' + gens + ')',
        'VieDuVillage.prochePourVoir(' + q(s.qui[0]) + ', ' + (s.vue || 12) + ')'];
    if (s.heures) cond.push(s.heures[0] <= s.heures[1] ? '$gameSystem.hour() >= ' + s.heures[0] + ' && $gameSystem.hour() < ' + s.heures[1] : '($gameSystem.hour() >= ' + s.heures[0] + ' || $gameSystem.hour() < ' + s.heures[1] + ')');
    if (s.si) cond.push(s.si);
    cond.unshift('Math.random() < 0.5');                                                         // une fois sur deux : jamais la même ronde
    cond.push("VieDuVillage.pret('" + carte + '·' + s.cle + "', " + (s.attente || 90) + ')');      // en dernier : il note l'heure
    var corps = cat(A.plugin('VIE arreter ' + s.qui.join(' ')), cat.apply(null, s.gestes.map(geste)), A.plugin('VIE reprendre ' + s.qui.join(' ')), A.attendre(150));
    return cat(D.note('— ' + s.nom + (s.heures ? ' (' + s.heures[0] + ' h-' + s.heures[1] + ' h)' : '')), si(C.js(cond.join(' && ')), corps));
}
function liste(lot) {
    var n = lot.scenes.length;
    var l = cat(
        D.note('◆ SCÈNES · ' + lot.nom + ' — ' + n + ' scènes'),
        D.note('Les interactions de la carte, en événements (JOKO, 2026-10-30). Toutes les 90 images, chaque scène a une chance sur deux d\'être essayée ; elle ne se joue que si ses gens sont là, libres, proches, à la bonne heure, que le joueur peut la voir, et qu\'elle ne s\'est pas jouée depuis son attente (en minutes de jeu). Chaque scène est un bloc « Si » : à changer, copier, effacer comme n\'importe quel événement.'),
        D.note('Généré par bancs/outils/poser_les_scenes.js depuis bancs/outils/scenes/. Retire la ligne « ◆ SCÈNES » et l\'outil ne réécrira plus jamais cet événement.'),
        D.boucle(cat(
            A.attendre(90),
            si(C.js('!$gameMessage.isBusy() && !$gameMap.isEventRunning() && !!window.VieDuVillage'),
                cat.apply(null, lot.scenes.map(function (s, i) { return scene(s, i, lot.carte); })))
        ))
    );
    return l.map(function (c) { return { code: c[0], indent: c[1], parameters: c[2] }; }).concat([{ code: 0, indent: 0, parameters: [] }]);
}

/* ── contrôle et pose ─────────────────────────────────────────────────── */
var defauts = [], poses = [];
function controle(nom, l, carte) {
    var pile = 0;
    l.forEach(function (c, i) {
        if (c.code === 111 || c.code === 112) pile++;
        if (c.code === 412 || c.code === 413) pile--;
        if (c.code === 111 && c.parameters[0] === 12) { try { new Function('return (' + c.parameters[1] + ');'); } catch (e) { defauts.push(nom + ' : condition invalide ' + c.parameters[1]); } }
        if (c.code === 250 && !['.ogg', '.m4a'].some(function (x) { return fs.existsSync(path.join(RACINE, 'audio', 'se', c.parameters[0].name + x)); })) defauts.push(nom + ' : son absent ' + c.parameters[0].name);
        if (c.code === 205 && c.parameters[0] > 0 && !carte.events[c.parameters[0]]) defauts.push(nom + ' : pas d\'événement ' + c.parameters[0]);
        if (c.code === 213 && c.parameters[0] > 0 && !carte.events[c.parameters[0]]) defauts.push(nom + ' : pas d\'événement ' + c.parameters[0]);
        if (c.code === 401) { var m = /^<c:(\d+),/.exec(c.parameters[0]); if (m && !carte.events[+m[1]]) defauts.push(nom + ' : pas d\'événement ' + m[1]); }
    });
    if (pile) defauts.push(nom + ' : bloc non refermé');
}
function formatCarte(m) {
    var props = Object.keys(m).filter(function (k) { return k !== 'data' && k !== 'events'; }).map(function (k) { return JSON.stringify(k) + ':' + JSON.stringify(m[k]); }).join(',');
    return '{\n' + props + ',\n"data":' + JSON.stringify(m.data) + ',\n"events":[\n' + m.events.map(function (e) { return JSON.stringify(e); }).join(',\n') + '\n]\n}';
}
var ecrites = {};
LOTS.forEach(function (lot) {
    if (!fs.existsSync(fichier(lot.carte))) { console.log('   ⚑ carte ' + lot.carte + ' : n\'existe plus'); return; }
    var m = ecrites[lot.carte] || JSON.parse(fs.readFileSync(fichier(lot.carte), 'utf8'));
    var l = liste(lot);
    controle(lot.nom, l, m);
    var e = m.events.filter(function (x) { return x && /^🏘/.test(x.name || ''); })[0];
    if (e && !e.pages[0].list.some(function (c) { return c.code === 108 && /^◆ SCÈNES/.test(c.parameters[0]); })) { console.log('   ⚑ ' + lot.nom + ' : retouché par JOKO, pas réécrit'); return; }
    if (!e) {
        e = { id: m.events.length, name: '🏘 La vie — ' + lot.nom, note: '', x: lot.x || 0, y: lot.y || 0, pages: [] };
        m.events.push(e);
    }
    e.pages = [{ conditions: { actorId: 1, actorValid: false, itemId: 1, itemValid: false, selfSwitchCh: 'A', selfSwitchValid: false, switch1Id: 1, switch1Valid: false, switch2Id: 1, switch2Valid: false, variableId: 1, variableValid: false, variableValue: 0 },
        directionFix: false, image: { tileId: 0, characterName: '', direction: 2, pattern: 0, characterIndex: 0 }, list: l,
        moveFrequency: 3, moveRoute: { list: [{ code: 0, parameters: [] }], repeat: true, skippable: false, wait: false }, moveSpeed: 3, moveType: 0,
        priorityType: 0, stepAnime: false, through: true, trigger: 4, walkAnime: true }];
    ecrites[lot.carte] = m;
    poses.push(lot.nom + ' (carte ' + lot.carte + ', év. ' + e.id + ', ' + lot.scenes.length + ' scènes, ' + l.length + ' commandes)');
});
console.log('   ' + poses.length + ' cartes :\n     ' + poses.join('\n     '));
if (defauts.length) { console.log('   ✗ ' + defauts.length + ' défaut(s) :\n     ' + defauts.join('\n     ')); process.exit(1); }
console.log('   ✓ blocs refermés, conditions valides, sons présents, chaque PNJ nommé existe sur sa carte');
if (!ECRIRE) process.exit(0);
Object.keys(ecrites).forEach(function (n) { fs.writeFileSync(fichier(n), formatCarte(ecrites[n])); });
var FS = path.join(RACINE, 'data', 'System.json'), brut = fs.readFileSync(FS, 'utf8'), SYS = JSON.parse(brut);
[[VAR_TIRAGE, '◆ Scènes · tirage'], [VAR_TIRAGE + 1, '◆ Scènes · variante']].forEach(function (v) {
    if (SYS.variables[v[0]] && !/^◆ /.test(SYS.variables[v[0]])) { console.log('   ✗ la variable ' + v[0] + ' porte déjà le nom « ' + SYS.variables[v[0]] + ' »'); process.exit(1); }
    SYS.variables[v[0]] = v[1];
});
fs.writeFileSync(FS, JSON.stringify(SYS) + (brut.endsWith('\n') ? '\n' : ''));
console.log('   écrit : cartes ' + Object.keys(ecrites).join(', ') + ' ; variables ' + VAR_TIRAGE + '–' + (VAR_TIRAGE + 1));
