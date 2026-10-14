/*
 * ANALYSE — VESPER, STYLE PAR STYLE
 * ---------------------------------------------------------------------------
 * Lit un ou plusieurs fichiers écrits par lequipe_a_chaque_niveau.js (un par
 * VESPER_STYLE) et dit, niveau par niveau : sa part des dégâts (puissance
 * brute), combien de fois elle tombe, le temps passé dans chaque Style, la
 * Rage, le Flow, le Berserker, l'armure brisée, ce que ludwing a pris — et
 * ses coups qui font le travail.
 *
 *   VESPER_STYLE=lame SORTIE=lame.json node bancs/navigateur/lequipe_a_chaque_niveau.js
 *   node bancs/navigateur/analyser_vesper.js auto.json lame.json sang.json garde.json
 */
'use strict';
var fs = require('fs');
var fichiers = process.argv.slice(2);
if (!fichiers.length) { console.log('usage : node bancs/navigateur/analyser_vesper.js mesures.json [autres.json…]'); process.exit(1); }
var NOMS = {};
try { JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', '..', 'data', 'Skills.json'), 'utf8')).forEach(function (s) { if (s) { NOMS[s.id] = s.name; } }); } catch (e) { }
function pct(x) { return (x * 100).toFixed(0).padStart(3) + ' %'; }
function somme(o) { return Object.keys(o || {}).reduce(function (s, k) { return s + o[k]; }, 0); }

fichiers.forEach(function (f) {
    var r = JSON.parse(fs.readFileSync(f, 'utf8'));
    console.log('\n══ ' + f + ' · Vesper : ' + (r.styleVesper || 'auto') + ' ' + '═'.repeat(30));
    console.log('  niv  combats    vict.  tours  part brute   tombée   lame/sang/garde       rage flow bers. brisée  ludwing');
    r.niveaux.forEach(function (n) {
        [['', n.combats], ['boss', n.boss]].forEach(function (g) {
            var c = g[1]; if (!c || !c.length) { return; }
            var brutV = 0, brutT = 0, tombee = 0, st = { lame: 0, sang: 0, garde: 0 }, rage = 0, flow = 0, bers = 0, bris = 0, lud = 0, tours = 0, vict = 0;
            c.forEach(function (x) {
                brutV += (x.brut && x.brut[1]) || 0; brutT += somme(x.brut);
                var v = x.vesper || {};
                if (v.toursMorte > 0) { tombee++; }
                Object.keys(v.styles || {}).forEach(function (k) { st[k] = (st[k] || 0) + v.styles[k]; });
                rage += v.rage || 0; flow += v.flow || 0; bers += v.berserker || 0; bris += v.brisee || 0; lud += v.surLudwing || 0;
                tours += x.tours; vict += x.victoire ? 1 : 0;
            });
            var ts = st.lame + st.sang + st.garde || 1;
            console.log('  ' + String(n.niveau).padStart(3) + '  ' + (g[0] || n.rang).padEnd(4) + String(c.length).padStart(3)
                + '   ' + (vict + '/' + c.length).padStart(5) + '  ' + (tours / c.length).toFixed(1).padStart(5)
                + '    ' + pct(brutV / (brutT || 1)) + '     ' + (tombee + '/' + c.length).padStart(5)
                + '   ' + [st.lame, st.sang, st.garde].map(function (x) { return pct(x / ts).trim(); }).join(' / ').padEnd(20)
                + String(rage).padStart(5) + String(flow).padStart(5) + String(bers).padStart(6) + String(bris).padStart(7) + String(Math.round(lud)).padStart(9));
        });
    });
    // ses coups : qui, dans son kit, fait le travail (tous niveaux confondus)
    var coups = {};
    r.niveaux.forEach(function (n) {
        (n.combats || []).concat(n.boss || []).forEach(function (x) {
            Object.keys(x.parCoup || {}).forEach(function (k) {
                var p = k.split(':'); if (p[0] !== '1') { return; }
                coups[p[1]] = (coups[p[1]] || 0) + x.parCoup[k];
            });
        });
    });
    var tot = somme(coups) || 1;
    console.log('  ses coups : ' + Object.keys(coups).sort(function (a, b) { return coups[b] - coups[a]; }).slice(0, 10)
        .map(function (id) { return (NOMS[id] || '#' + id) + ' ' + pct(coups[id] / tot).trim(); }).join(' · '));
    if (r.erreurs && r.erreurs.length) { console.log('  ⚠ erreurs moteur : ' + r.erreurs.slice(0, 3).join(' | ')); }
});
