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
 * « ◆ SCÈNES ») n'est jamais réécrit, ni celui qu'il a voulu tel quel
 * (bancs/outils/voulu.js, 2026-11-09 : la Ville Forestière).
 *
 *   node bancs/outils/poser_les_scenes.js --ecrire --cartes 33   → seulement ces cartes
 *   node bancs/outils/poser_les_scenes.js --ecrire --sortie <dossier>
 *     → écrit dans ce dossier, pas dans data/ (pour les bancs)
 */
'use strict';
var fs = require('fs');
var path = require('path');
var D = require('./recettes/dsl.js');
var A = D.A, C = D.C, si = D.si, cat = D.cat;
var RACINE = path.join(__dirname, '..', '..');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var iSo = process.argv.indexOf('--sortie'), SORTIE = iSo >= 0 ? path.resolve(process.argv[iSo + 1]) : null;
var VOULU = require('./voulu.js');
var VAR_TIRAGE = 886;
var DOS = path.join(__dirname, 'scenes');
var LOTS = fs.readdirSync(DOS).filter(function (x) { return /\.js$/.test(x); }).sort().map(function (x) { return require(path.join(DOS, x)); });
// --cartes 33 : ne pose que ces cartes (2026-11-09 : la plage, sans toucher au Marché que JOKO a fait)
var iCa = process.argv.indexOf('--cartes'), CARTES_SEULES = iCa >= 0 ? String(process.argv[iCa + 1]).split(',').map(Number) : null;
if (CARTES_SEULES) LOTS = LOTS.filter(function (l) { return CARTES_SEULES.indexOf(l.carte) >= 0; });

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
// qui est dans chaque événement, d'après les fiches des habitants : une scène dont quelqu'un a été retiré par JOKO, ou dont
// le numéro sert maintenant à quelqu'un d'autre (2026-11-01, « FGFG » : 30:26 est une marque « kaze »), ne se pose pas
var NOMS = {};
(function () {
    var D = path.join(__dirname, 'habitants');
    fs.readdirSync(D).filter(function (x) { return /\.js$/.test(x) && !/^(moteur|_)/.test(x); }).forEach(function (x) {
        var l = require(path.join(D, x));
        l.fiches.forEach(function (f) { var k = (f.carte || l.carte) + ':' + f.ev; if (!NOMS[k]) NOMS[k] = f.nom; });
    });
})();
function norme(t) { return String(t || '').toLowerCase().replace(/\s+/g, ' ').trim(); }
function present(m, carte, q) {
    // une copie de passage « 29:41 » : son original doit exister ; un numéro : l'événement, toujours la même personne
    var c = carte, id = q;
    if (estVisiteur(q)) { c = +q.split(':')[0]; id = +q.split(':')[1]; }
    var mm = c === carte ? m : (fs.existsSync(fichier(c)) ? JSON.parse(fs.readFileSync(fichier(c), 'utf8')) : null);
    var e = mm && mm.events[id];
    if (!e) return 'retiré';
    var nom = NOMS[c + ':' + id];
    if (!nom) return null;
    var tete = e.pages.map(function (p) { return p.list.filter(function (x) { return x.code === 108 && /^◆ (FICHE|HABITANT) · /.test(x.parameters[0]); }).map(function (x) { return x.parameters[0]; }).join(' '); }).join(' ');
    if (tete ? norme(tete).indexOf(norme(nom)) < 0 : norme(e.name) !== norme(nom)) return 'c\'est maintenant « ' + String(e.name).trim() + ' »';
    return null;
}
LOTS.forEach(function (lot) {
    if (!fs.existsSync(fichier(lot.carte))) { console.log('   ⚑ carte ' + lot.carte + ' : n\'existe plus'); return; }
    var m = ecrites[lot.carte] || JSON.parse(fs.readFileSync(fichier(lot.carte), 'utf8'));
    lot = Object.assign({}, lot, { scenes: lot.scenes.map(function (sc) {
        // ses gens, et tous ceux que ses gestes nomment ; une ligne dans un « si » qui nomme un absent tombe seule
        function noms(g) {
            var l = [];
            if (['dit', 'bulle', 'pas', 'tourne', 'face'].indexOf(g[0]) >= 0) [g[1], g[0] === 'tourne' || g[0] === 'face' ? g[2] : null].forEach(function (q) { if (typeof q === 'number' || estVisiteur(q)) l.push(q); });
            return l;
        }
        function tous(l, acc) {
            (l || []).forEach(function (g) {
                if (!Array.isArray(g)) return;
                noms(g).forEach(function (q) { acc.push(q); });
                if (g[0] === 'si') { tous(g[2], acc); tous(g[3], acc); var v = /VieDuVillage\.la\((\d+)\)/.exec(g[1]); if (v) acc.push(+v[1]); }
                if (g[0] === 'hasard') g[1].forEach(function (x) { tous(x, acc); });
            });
            return acc;
        }
        function absent(q) { var r = present(m, lot.carte, q); return r ? q + ' ' + r : null; }
        function elaguer(l) {
            return (l || []).map(function (g) {
                if (!Array.isArray(g)) return g;
                if (g[0] === 'si') {
                    if (tous([g], []).some(absent)) { console.log('   ⚑ ' + lot.nom + ' · « ' + sc.nom + ' » : une ligne qui nomme un absent tombe'); return null; }
                    return [g[0], g[1], elaguer(g[2]), g[3] ? elaguer(g[3]) : g[3]];
                }
                if (g[0] === 'hasard') return [g[0], g[1].map(elaguer)];
                return g;
            }).filter(function (g) { return g !== null; });
        }
        // ce qui est hors d'un « si » doit être là ; ce qui est dans un « si » tombe avec sa ligne
        var gens = sc.qui.slice();
        sc.gestes.forEach(function (g) { if (Array.isArray(g) && g[0] !== 'si') tous([g], []).forEach(function (q) { if (gens.indexOf(q) < 0) gens.push(q); }); });
        var raison = gens.map(absent).filter(Boolean)[0];
        if (raison) { console.log('   ⚑ ' + lot.nom + ' · « ' + sc.nom + ' » : ' + raison + ', pas posée'); return null; }
        return Object.assign({}, sc, { gestes: elaguer(sc.gestes) });
    }).filter(Boolean) });
    var l = liste(lot);
    controle(lot.nom, l, m);
    var e = m.events.filter(function (x) { return x && /^🏘/.test(x.name || ''); })[0];
    if (e && !e.pages[0].list.some(function (c) { return c.code === 108 && /^◆ SCÈNES/.test(c.parameters[0]); })) { console.log('   ⚑ ' + lot.nom + ' : retouché par JOKO, pas réécrit'); return; }
    if (e && VOULU.est(lot.carte, e.id)) { console.log('   ⚑ ' + lot.nom + ' : voulu tel quel par JOKO (' + VOULU.quand + '), pas réécrit'); return; }
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
var DEST = SORTIE || path.join(RACINE, 'data');
if (SORTIE && !fs.existsSync(SORTIE)) fs.mkdirSync(SORTIE, { recursive: true });
Object.keys(ecrites).forEach(function (n) { fs.writeFileSync(path.join(DEST, path.basename(fichier(n))), formatCarte(ecrites[n])); });
var FS = path.join(RACINE, 'data', 'System.json'), brut = fs.readFileSync(FS, 'utf8'), SYS = JSON.parse(brut);
[[VAR_TIRAGE, '◆ Scènes · tirage'], [VAR_TIRAGE + 1, '◆ Scènes · variante']].forEach(function (v) {
    if (SYS.variables[v[0]] && !/^◆ /.test(SYS.variables[v[0]])) { console.log('   ✗ la variable ' + v[0] + ' porte déjà le nom « ' + SYS.variables[v[0]] + ' »'); process.exit(1); }
    SYS.variables[v[0]] = v[1];
});
fs.writeFileSync(path.join(DEST, 'System.json'), JSON.stringify(SYS) + (brut.endsWith('\n') ? '\n' : ''));
console.log('   écrit' + (SORTIE ? ' dans ' + SORTIE : '') + ' : cartes ' + Object.keys(ecrites).join(', ') + ' ; variables ' + VAR_TIRAGE + '–' + (VAR_TIRAGE + 1));
