/*
 * ANALYSE — ce que les combats joués disent, rang par rang
 * ---------------------------------------------------------------------------
 * Lit mesures_equipe.json (écrit par lequipe_a_chaque_niveau.js) et en tire,
 * pour chaque rang : tours pour gagner, victoires, puissance brute du groupe,
 * dégâts reçus par tour — et le multiplicateur qui amènerait chaque rang sur
 * sa cible.
 *
 *   node bancs/navigateur/analyser_equipe.js [mesures.json] [--json sortie.json]
 */
'use strict';
var fs = require('fs');
var path = require('path');
var fichier = process.argv[2] && !/^--/.test(process.argv[2]) ? process.argv[2] : path.join(__dirname, 'mesures_equipe.json');
var r = JSON.parse(fs.readFileSync(fichier, 'utf8'));

// Les cibles. Assez de tours pour que les mécaniques des héros comptent
// (Vesper : marquer puis absorber ; Aël : quatre actions pour un Miracle).
var CIBLE = {
    D: { tours: 2.5, recu: 0.06 }, C: { tours: 3, recu: 0.07 }, B: { tours: 3.5, recu: 0.08 },
    A: { tours: 4.5, recu: 0.09 }, S: { tours: 5, recu: 0.10 }, BOSS: { tours: 12, recu: 0.09 }
};
function med(l) { l = l.filter(function (x) { return isFinite(x); }).sort(function (a, b) { return a - b; }); return l.length ? l[Math.floor(l.length / 2)] : 0; }
function moy(l) { return l.length ? l.reduce(function (s, x) { return s + x; }, 0) / l.length : 0; }

function resume(combats) {
    if (!combats.length) { return null; }
    var brutParTour = combats.map(function (c) {
        var b = Object.keys(c.brut || {}).reduce(function (s, k) { return s + c.brut[k]; }, 0);
        return b / Math.max(1, c.tours);
    });
    return {
        n: combats.length,
        victoires: combats.filter(function (c) { return c.victoire; }).length / combats.length,
        tours: moy(combats.map(function (c) { return c.tours; })),
        pvEnnemis: med(combats.map(function (c) { return c.pvEnnemis; })),
        brutParTour: med(brutParTour),
        // combien de tours la troupe tiendrait-elle contre la puissance BRUTE ?
        toursBruts: med(combats.map(function (c, i) { return c.pvEnnemis / Math.max(1, brutParTour[i]); })),
        recuParTour: med(combats.map(function (c) { return c.recus / Math.max(1, c.pvGroupe) / Math.max(1, c.tours); })),
        pvRestants: moy(combats.map(function (c) { return c.pvRestants; })),
        premierKO: med(combats.filter(function (c) { return c.premierKO; }).map(function (c) { return c.premierKO; })),
        herosDAbord: moy(combats.map(function (c) { return c.herosDAbord; })),
        agiEnnemis: med(combats.map(function (c) { return c.ennemis ? c.ennemis.agi : 0; }))
    };
}

var parRang = {};
r.niveaux.forEach(function (n) {
    (parRang[n.rang] = parRang[n.rang] || []).push({ niveau: n.niveau, s: resume(n.combats) });
    if (n.boss && n.boss.length) { (parRang.BOSS = parRang.BOSS || []).push({ niveau: n.niveau, s: resume(n.boss) }); }
});

var conseil = {};
console.log('rang  niv  combats  victoires  tours   « tours bruts »  reçu/tour  PV restants  1er KO   héros d\'abord');
Object.keys(CIBLE).forEach(function (rg) {
    var l = parRang[rg] || [];
    l.forEach(function (x) {
        var s = x.s; if (!s) { return; }
        console.log(rg.padEnd(5) + String(x.niveau).padStart(3) + String(s.n).padStart(8) + (Math.round(s.victoires * 100) + ' %').padStart(10)
            + s.tours.toFixed(1).padStart(8) + s.toursBruts.toFixed(2).padStart(14) + (Math.round(s.recuParTour * 1000) / 10 + ' %').padStart(12)
            + (Math.round(s.pvRestants * 100) + ' %').padStart(12) + String(s.premierKO || '—').padStart(8) + (Math.round(s.herosDAbord * 100) + ' %').padStart(14));
    });
    // Le multiplicateur : sur la MÉDIANE des niveaux du rang.
    var tb = med(l.map(function (x) { return x.s ? x.s.toursBruts : NaN; }));
    var rc = med(l.map(function (x) { return x.s ? x.s.recuParTour : NaN; }));
    if (!tb) { return; }
    // Les PV : on vise les tours de la cible, contre la puissance BRUTE (un peu
    // gaspillée en coups de trop : on garde 15 % de marge).
    var pv = Math.max(0.5, Math.min(6, CIBLE[rg].tours / tb * 0.85));
    // La force : les dégâts reçus ne sont pas proportionnels à l'ATQ (les
    // formules soustraient la DÉF) — on corrige par la racine, et le banc
    // itère ensuite.
    var force = rc > 0 ? Math.max(0.6, Math.min(3, Math.sqrt(CIBLE[rg].recu / rc))) : 1;
    conseil[rg] = { pv: Math.round(pv * 100) / 100, force: Math.round(force * 100) / 100, toursBruts: tb, recu: rc };
});
console.log('\nMULTIPLICATEURS CONSEILLÉS (1re passe) :');
Object.keys(conseil).forEach(function (rg) {
    console.log('   ' + rg.padEnd(5) + ' PV ×' + conseil[rg].pv.toFixed(2) + '   force ×' + conseil[rg].force.toFixed(2)
        + '     (tours bruts ' + conseil[rg].toursBruts.toFixed(2) + ' → cible ' + CIBLE[rg].tours + ' · reçu ' + (Math.round(conseil[rg].recu * 1000) / 10) + ' % → cible ' + CIBLE[rg].recu * 100 + ' %)');
});
var i = process.argv.indexOf('--json');
if (i > 0) { fs.writeFileSync(process.argv[i + 1], JSON.stringify({ cible: CIBLE, conseil: conseil, parRang: parRang }, null, 1)); }
