/*
 * BANC — LES ULTIMES ET LES RENDEMENTS (le paquet commun, 2026-10-25)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-25 : « rework complètement toutes les capacités, spéciales et
 * ulti des personnages pour les rendre plus intéressantes et équilibrées », puis
 * « Oui tout » sur le paquet commun :
 *   A. chaque ultime frappe au moins ×1,3 la meilleure capacité de sa portée, à
 *      chaque niveau (le coefficient de la formule seul) — six ultimes frappaient
 *      moins fort qu'une capacité ordinaire ;
 *   B. les rendements (puissance par point de PT, de PM ou de % de PV, au niveau
 *      60) restent entre la moitié et le double de la médiane de leur monnaie ;
 *   C. les étiquettes : Tranche-Néant et Jugement de Soi sont à Vesper, ce qui se
 *      dit ULTIME est rangé en ultime, Dévoreur d'Âmes frappe en ratio.
 *
 * Hors de la règle, exprès : les formules « à caractère » (hasard, % de PV,
 * variable — §4), ce qu'un ennemi utilise, les techniques d'un état (Rage, Flow,
 * JACKPOT, ombres, Miracle), les combos, seiryu, les pièces des dons, et le Verbe
 * qui Défait (un ultime d'effet : les PM des ennemis à zéro, pour 32 PM).
 *
 * La puissance : la formule × ses coups, avec les stats de la classe au niveau
 * voulu, contre une défense de 100 ; ×0,75 si l'art est hors des affinités du
 * héros (LesTroisArts, chargé tel quel). Chaque contrôle a sa contre-épreuve.
 *
 *   node bancs/24_ultimes_et_rendements.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');
function lire(f) { return fs.readFileSync(path.join(RACINE, f), 'utf8'); }

var $plugins = eval(lire('js/plugins.js').replace(/^[\s\S]*?var \$plugins\s*=/, '(').replace(/;\s*$/, ')'));
global.PluginManager = { parameters: function (n) { var p = $plugins.find(function (x) { return x.name === n; }); return p ? p.parameters : {}; } };
global.DataManager = { isSkill: function (x) { return !!x && x._competence === true; } };
['Game_Action', 'Window_SkillList', 'Game_BattlerBase', 'Game_Actor'].forEach(function (k) { global[k] = function () {}; global[k].prototype = {}; });
eval(lire('js/plugins/LesTroisArts.js').replace('var LesTroisArts = LesTroisArts || {};', 'global.LesTroisArts = {};'));

var C = JSON.parse(lire('data/Classes.json'));
var ACTEURS = JSON.parse(lire('data/Actors.json'));
var E = JSON.parse(lire('data/Enemies.json'));
function base() {
    var S = JSON.parse(lire('data/Skills.json'));
    S.forEach(function (s) {
        if (!s) { return; }
        s._competence = true; s.meta = {};
        var re = /<([^<>:]+)(:?)([^>]*)>/g, m;
        while ((m = re.exec(s.note))) { s.meta[m[1]] = m[2] === ':' ? m[3] : true; }
    });
    return S;
}

var NOMS = { 1: 'Vesper', 2: 'Korrah', 3: 'ludwing', 4: 'Aël' };
var ENNEMI = {}; E.forEach(function (e) { if (e) { e.actions.forEach(function (a) { ENNEMI[a.skillId] = 1; }); } });
var TYPES_ETAT = [4, 5, 19, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 24, 25, 26];   // 24 : les arts de l'arme tenue
var PIECES = [71, 810, 438, 800, 818];
var ULTIMES_D_EFFET = [819];
var CARACTERE = /Math\.random|\$game|b\.(hp|mhp|mp|mmp)\b|a\.(hp|mp|mhp|mmp|tp)\b|a\._|\bv\[|\bs\[/;
var CIBLE = { def: 100, mdf: 100, mhp: 10000, hp: 10000, agi: 100, luk: 50, atk: 100, mat: 100, level: 60 };

function heros(c) { return { isActor: function () { return true; }, actorId: function () { return c; } }; }
function combo(s) { return s.meta['unison item actors'] !== undefined || s.meta.Combo !== undefined; }
function portee(sc) { return sc === 1 ? 'un' : sc === 2 ? 'tous' : (sc >= 3 && sc <= 6) ? 'hasard' : ''; }
function brut(s, c, L) {
    if (!s.damage || (s.damage.type !== 1 && s.damage.type !== 5)) { return 0; }
    var p = C[c].params;
    var a = { atk: p[2][L], mat: p[4][L], def: p[3][L], mdf: p[5][L], agi: p[6][L], luk: p[7][L], mhp: p[0][L], mmp: p[1][L], level: L }; // eslint-disable-line no-unused-vars
    var b = CIBLE; // eslint-disable-line no-unused-vars
    var coups = Math.max(1, s.repeats || 1) * (s.scope >= 3 && s.scope <= 6 ? s.scope - 2 : 1);
    try { var v = eval(s.damage.formula); return isNaN(v) ? 0 : Math.max(0, v) * coups; } catch (e) { return 0; }
}
function effectif(s, c, L) { return brut(s, c, L) * (LesTroisArts.horsAffinite(heros(c), s) ? 0.75 : 1); }
function prix(s) {
    var hp = /<HP Cost:\s*(\d+)%>/i.exec(s.note);
    if (hp) { return !s.mpCost && !s.tpCost ? { m: 'PV%', v: +hp[1] } : { m: 'mixte', v: 0 }; }
    if (s.tpCost && !s.mpCost) { return { m: 'PT', v: s.tpCost }; }
    if (s.mpCost && !s.tpCost) { return { m: 'PM', v: s.mpCost }; }
    return { m: 'mixte', v: 0 };
}
function kit(S, c) {
    var vus = {}, out = [];
    C[c].learnings.forEach(function (l) {
        var s = S[l.skillId];
        if (s && !vus[s.id] && s.id > 2) { vus[s.id] = 1; out.push({ s: s, niv: Math.max(1, l.level) }); }
    });
    // ce que l'acteur reçoit par ses traits (les Styles de Vesper, leur sang et leurs ultimes) : dès le niveau 1
    ACTEURS[c].traits.forEach(function (t) {
        var s = t.code === 43 ? S[t.dataId] : null;
        if (s && !vus[s.id]) { vus[s.id] = 1; out.push({ s: s, niv: 1 }); }
    });
    return out;
}

function controles(S) {
    var r = [];
    // A · les ultimes
    var faibles = [], nA = 0;
    [1, 2, 3, 4].forEach(function (c) {
        var K = kit(S, c);
        var caps = K.filter(function (x) {
            var s = x.s; return s.stypeId !== 3 && TYPES_ETAT.indexOf(s.stypeId) < 0 && !combo(s) && portee(s.scope) && !CARACTERE.test(s.damage.formula) && brut(s, c, 60) > 0;
        });
        K.filter(function (x) {
            var s = x.s; return s.stypeId === 3 && PIECES.indexOf(s.id) < 0 && ULTIMES_D_EFFET.indexOf(s.id) < 0 && portee(s.scope) && !CARACTERE.test(s.damage.formula) && brut(s, c, 60) > 0;
        }).forEach(function (u) {
            nA++;
            for (var L = u.niv; L <= 99; L++) {
                var best = 0, qui = null;
                caps.forEach(function (x) { if (x.niv <= L && portee(x.s.scope) === portee(u.s.scope)) { var p = effectif(x.s, c, L); if (p > best) { best = p; qui = x.s; } } });
                if (best && effectif(u.s, c, L) < 1.3 * best * 0.99) {
                    faibles.push(NOMS[c] + ' : ' + u.s.name + ' (niveau ' + L + ', ' + Math.round(effectif(u.s, c, L)) + ' contre ' + qui.name + ' ' + Math.round(best) + ')');
                    break;
                }
            }
        });
    });
    r.push(['A · chaque ultime frappe au moins ×1,3 la meilleure capacité de sa portée, à chaque niveau', faibles.length === 0,
        faibles.length ? faibles.slice(0, 3).join(' · ') : nA + ' ultimes tenus du niveau où ils s\'apprennent jusqu\'au 99']);

    // B · les rendements
    var hors = [], nB = 0;
    [1, 2, 3, 4].forEach(function (c) {
        var L = kit(S, c).filter(function (x) {
            var s = x.s, p = prix(s);
            return s.stypeId !== 3 && TYPES_ETAT.indexOf(s.stypeId) < 0 && !combo(s) && !ENNEMI[s.id] && PIECES.indexOf(s.id) < 0 &&
                portee(s.scope) && !CARACTERE.test(s.damage.formula) && brut(s, c, 60) > 0 && ['PT', 'PM', 'PV%'].indexOf(p.m) >= 0 && p.v > 0;
        });
        ['PT', 'PM', 'PV%'].forEach(function (m) {
            var G = L.filter(function (x) { return prix(x.s).m === m; }).map(function (x) { return { s: x.s, r: brut(x.s, c, 60) / prix(x.s).v }; });
            if (G.length < 3) { return; }
            var tri = G.map(function (g) { return g.r; }).sort(function (a, b) { return a - b; }), med = tri[Math.floor(tri.length / 2)];
            G.forEach(function (g) {
                nB++;
                var q = g.r / med;
                if (q < 0.49 || q > 2.01) { hors.push(NOMS[c] + ' : ' + g.s.name + ' ' + q.toFixed(2) + '× (' + m + ')'); }
            });
        });
    });
    r.push(['B · chaque rendement reste entre ×0,5 et ×2 de la médiane de sa monnaie (niveau 60)', hors.length === 0,
        hors.length ? hors.slice(0, 4).join(' · ') : nB + ' capacités dans la bande']);

    // C · les étiquettes
    var faux = [];
    [1, 2, 3, 4].forEach(function (c) {
        kit(S, c).forEach(function (x) {
            var s = x.s, d = String(s.description || '');
            if (/^ULTIME/.test(d) && s.stypeId !== 3) { faux.push(s.name + ' se dit ULTIME mais est rangée en ' + s.stypeId); }
            var de = /^ULTIME d(?:e |')([^.]+)\./.exec(d);
            if (de && !new RegExp(de[1].trim(), 'i').test(NOMS[c]) && C[c].learnings.length) {
                var aussi = [1, 2, 3, 4].some(function (k) { return new RegExp(de[1].trim(), 'i').test(NOMS[k]) && kit(S, k).some(function (y) { return y.s.id === s.id; }); });
                if (!aussi) { faux.push(s.name + ' se dit « ULTIME de ' + de[1] + ' » chez ' + NOMS[c]); }
            }
        });
    });
    r.push(['C · ce qui se dit ULTIME est un ultime, et à celui qui l\'a', faux.length === 0, faux.length ? faux.slice(0, 3).join(' · ') : 'Tranche-Néant et Jugement de Soi à Vesper ; Dévoreur d\'Âmes, Tout ou Rien, la Mue Souveraine en ultime']);
    r.push(['C · Dévoreur d\'Âmes frappe en ratio (plus de soustraction qui tombe à 0)', !/-\s*b\.mdf/.test(S[453].damage.formula) && /200 \/ \(200 \+ b\.mdf\)/.test(S[453].damage.formula), S[453].damage.formula]);

    // Ce qu'un ennemi utilise ne bouge pas (§4)
    r.push(['ce qu\'un ennemi utilise garde sa formule (Moisson des Âmes, Fils de Mana Pur)',
        S[141].damage.formula === 'Math.floor(((a.atk + a.mat) * 2) * 1.352 * 200 / (200 + b.mdf))' && S[106].damage.formula === 'a.mat * 1.5',
        S[141].damage.formula + ' · ' + S[106].damage.formula]);
    // Le Verbe qui Défait reste un ultime d'effet
    r.push(['le Verbe qui Défait reste un ultime d\'effet (32 PM, PM des ennemis à zéro)', S[819].mpCost === 32 && /a\.mat \* 3\.4 \*/.test(S[819].damage.formula), S[819].damage.formula]);
    return r;
}

var ok = 0, ko = 0;
function montre(c) { if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); } else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); } }
console.log('LES ULTIMES ET LES RENDEMENTS\n');
console.log('1) Sur la vraie base');
controles(base()).forEach(montre);

var SABOTAGES = [
    ['Instant Absolu rendu à son ancienne formule (×7,6)', function (S) { S[449].damage.formula = 'Math.floor(a.mat * 7.6 * 200 / (200 + b.mdf))'; }, /^A ·/],
    ['Syllabe de la Fin rendue à ×14 (hors affinité d\'Aël, elle tombe sous la barre)', function (S) { S[820].damage.formula = 'Math.floor(a.mat * 14 * 200 / (200 + b.mdf))'; }, /^A ·/],
    ['Brise-Garde rendue à son ancien ×8,7 (×2,7 la médiane)', function (S) { S[144].damage.formula = 'Math.floor(a.atk * 8.7 * 200 / (200 + b.def))'; }, /^B ·/],
    ['Fracas Sismique rendu à son ancien ×7,9 (×0,3)', function (S) { S[149].damage.formula = 'Math.floor(a.atk * 7.9 * 200 / (200 + b.def))'; }, /^B ·/],
    ['Dévoreur d\'Âmes rangé de nouveau en Spéciale', function (S) { S[453].stypeId = 2; }, /^C · ce qui se dit ULTIME/],
    ['Tranche-Néant redit « ULTIME d\'Aël »', function (S) { S[445].description = S[445].description.replace('ULTIME de Vesper.', "ULTIME d'Aël."); }, /^C · ce qui se dit ULTIME/],
    ['Dévoreur d\'Âmes rendu à sa soustraction', function (S) { S[453].damage.formula = 'a.atk*4 + a.mat*3 - b.mdf'; }, /^C · Dévoreur/]
];
console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
SABOTAGES.forEach(function (sb) {
    var S = base(); sb[1](S);
    var tombe = controles(S).filter(function (c) { return !c[1]; }).map(function (c) { return c[0]; });
    var sien = tombe.filter(function (c) { return sb[2].test(c); })[0];
    montre([sb[0], !!sien, sien ? '« ' + sien + ' » tombe' + (tombe.length > 1 ? ' (et ' + (tombe.length - 1) + ' autre)' : '') : 'tombés : ' + (tombe.join(' | ') || 'aucun')]);
});

console.log('\n' + '='.repeat(70) + '\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)\n' + '='.repeat(70));
process.exit(ko === 0 ? 0 : 1);
