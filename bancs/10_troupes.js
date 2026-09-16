/*
 * BANC — LES TROUPES, LEURS PHASES DEUX ET LEURS RENFORTS
 * ---------------------------------------------------------------------------
 * Un événement de troupe mal formé ne lève RIEN non plus. MV lit la page,
 * n'y comprend rien, et le combat continue comme si elle n'existait pas :
 *
 *   · un `Enemy Appear` (code 335) qui vise un indice au-delà du dernier
 *     membre — `iterateEnemyIndex` ne trouve personne, et le renfort annoncé
 *     n'arrive jamais ;
 *   · un `Change Enemy State` (code 333) sur un état supprimé — `addState`
 *     sur `$dataStates[undefined]` ne fait rien ;
 *   · une page sans commande de fin (code 0) — l'interpréteur part au-delà
 *     de la liste ;
 *   · un `Show Text` (101) sans sa ligne (401) — une boîte vide s'ouvre et
 *     le joueur appuie sur une touche pour rien ;
 *   · un membre `hidden` qu'aucun `Appear` ne réveille : il est compté dans
 *     la troupe, il donne son butin, et on ne le voit jamais.
 *
 * Et le piège qui a coûté 298 placements : un renfort posé sans regarder la
 * taille de son sprite ressort de l'écran. On revérifie ici, pour les membres
 * qu'on vient d'ajouter comme pour les autres.
 *
 *   node bancs/10_troupes.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');

var BANDE = 444, LARGEUR = 816;   // la géométrie relevée dans le moteur

var T = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Troops.json'), 'utf8'));
var E = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Enemies.json'), 'utf8'));
var S = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/States.json'), 'utf8'));

function tag(e, n) {
    var m = new RegExp('<\\s*' + n + '\\s*:\\s*([^>]+)>', 'i').exec(e && e.note || '');
    return m ? m[1].trim() : '';
}
function echelle(e) {
    var m = /<\s*Scale Sprite\s*:\s*(\d+)\s*[%％]\s*>/i.exec(e && e.note || '');
    return m ? parseInt(m[1], 10) / 100 : 1;
}
var cacheDim = {};
function dim(n) {
    if (cacheDim[n] !== undefined) { return cacheDim[n]; }
    try {
        var b = fs.readFileSync(path.join(RACINE, 'img/enemies', n + '.png'));
        cacheDim[n] = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    } catch (e) { cacheDim[n] = null; }
    return cacheDim[n];
}

function controles(T) {
    var reels = T.filter(function (t) { return t && t.name; });
    var r = [];

    var viseFantome = [], etatMort = [], sansFin = [], boiteVide = [], dormeurs = [], horsEcran = [];

    reels.forEach(function (t) {
        var n = (t.members || []).length;
        var reveilles = {};

        (t.pages || []).forEach(function (p, ip) {
            var l = p.list || [];
            // ── la page se termine-t-elle ?
            if (!l.length || l[l.length - 1].code !== 0) {
                sansFin.push(t.name + ' page ' + ip);
            }
            l.forEach(function (cm, i) {
                if (cm.code === 335) {
                    var idx = cm.parameters[0];
                    if (idx >= n) { viseFantome.push(t.name + ' : Appear ' + idx + ' sur ' + n + ' membres'); }
                    else if (idx < 0) { for (var k = 0; k < n; k++) { reveilles[k] = 1; } }
                    else { reveilles[idx] = 1; }
                }
                if (cm.code === 333) {
                    var st = cm.parameters[2];
                    if (!S[st] || !S[st].name) { etatMort.push(t.name + ' : état ' + st + ' inexistant'); }
                    if (cm.parameters[0] >= n) { viseFantome.push(t.name + ' : état sur le membre ' + cm.parameters[0] + '/' + n); }
                }
                if (cm.code === 101) {
                    var suite = l[i + 1];
                    if (!suite || suite.code !== 401 || !String(suite.parameters[0]).trim()) {
                        boiteVide.push(t.name + ' page ' + ip);
                    }
                }
            });
        });

        (t.members || []).forEach(function (m, i) {
            // ── un dormeur que personne ne réveille
            if (m.hidden && !reveilles[i]) { dormeurs.push(t.name + ' : membre ' + i + ' (' + (E[m.enemyId] && E[m.enemyId].name) + ')'); }
            // ── et il doit tenir dans l'écran comme les autres
            var e = E[m.enemyId];
            var d = e && dim(e.battlerName);
            if (!d) { return; }
            var k = echelle(e);
            if (m.y - d.h * k < 0 || m.x - d.w * k / 2 < 0 || m.x + d.w * k / 2 > LARGEUR || m.y > BANDE) {
                horsEcran.push(t.name + ' : ' + e.name);
            }
        });
    });

    function bilan(titre, liste, bon) {
        r.push([titre, liste.length === 0, liste.length ? liste.length + ' : ' + liste.slice(0, 3).join(' · ') : bon]);
    }
    bilan('aucune commande ne vise un membre qui n\'existe pas', viseFantome, 'tous les indices sont dans la troupe');
    bilan('aucun événement ne pose un état supprimé', etatMort, 'tous les états visés existent');
    bilan('chaque page d\'événement se termine par un code 0', sansFin, 'toutes les pages se ferment');
    bilan('aucune boîte de dialogue ne s\'ouvre sur du vide', boiteVide, 'chaque Show Text a sa ligne');
    bilan('aucun renfort caché ne dort pour toujours', dormeurs, 'chaque membre caché a son Appear');
    bilan('aucun membre de troupe ne sort de l\'écran', horsEcran, 'tous tiennent dans ' + LARGEUR + '×' + BANDE);

    // ── la couverture : ce que le passage a réellement posé
    var avecPhase2 = reels.filter(function (t) {
        return (t.pages || []).some(function (p) {
            return (p.list || []).some(function (x) { return x.code === 108 && /^PHASE2-FAMILLE/.test(String(x.parameters[0])); });
        });
    });
    // Les 41 troupes « ◈ » sont exclues À DESSEIN : JOKO leur a écrit quatre
    // pages à la main (entrée, phase II, phase III, rappel de mécanique), et
    // `audit/6_bestiaire.js` vérifie qu'elles en gardent exactement quatre.
    // Leur poser une phase deux générique par-dessus doublerait son travail.
    var estBoss = function (t) { return t.name.indexOf('◈') === 0; };
    var aFamille = reels.filter(function (t) {
        return !estBoss(t) && (t.members || []).some(function (m) { return tag(E[m.enemyId], 'Famille'); });
    });
    r.push(['chaque troupe à famille (hors boss ◈) a sa phase deux', avecPhase2.length >= aFamille.length,
        avecPhase2.length + ' phases deux pour ' + aFamille.length + ' troupes à famille · ' +
        reels.filter(estBoss).length + ' boss laissés à JOKO']);

    var bossTouches = avecPhase2.filter(estBoss);
    r.push(['aucune troupe de boss ◈ n\'a reçu de phase deux générique', bossTouches.length === 0,
        bossTouches.length ? bossTouches.slice(0, 3).map(function (t) { return t.name; }).join(', ') : 'les 41 scripts de boss sont intacts']);

    // Une phase deux qui se déclencherait au premier tour n'est pas une phase
    // deux : elle doit attendre que l'ennemi soit entamé.
    var tropTot = [];
    avecPhase2.forEach(function (t) {
        (t.pages || []).forEach(function (p) {
            if (!(p.list || []).some(function (x) { return x.code === 108 && /^PHASE2-FAMILLE/.test(String(x.parameters[0])); })) { return; }
            var c = p.conditions || {};
            if (!c.enemyValid || c.enemyHp > 50 || p.span !== 0) {
                tropTot.push(t.name + ' (enemyValid=' + c.enemyValid + ' hp=' + c.enemyHp + ' span=' + p.span + ')');
            }
        });
    });
    bilan('chaque phase deux attend la mi-combat, et ne sort qu\'une fois', tropTot, 'toutes sur enemyHp ≤ 50 %, span 0');

    return r;
}

var ok = 0, ko = 0;
console.log('LES TROUPES, LEURS PHASES DEUX ET LEURS RENFORTS\n');
console.log('1) Sur la vraie base');
controles(T).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

/** La première troupe dotée d'une phase deux — cobaye des sabotages. */
function cobaye(b) {
    return b.filter(function (t) {
        return t && t.name && (t.pages || []).some(function (p) {
            return (p.list || []).some(function (x) { return x.code === 108 && /^PHASE2-FAMILLE/.test(String(x.parameters[0])); });
        });
    })[0];
}
function pageP2(t) {
    return (t.pages || []).filter(function (p) {
        return (p.list || []).some(function (x) { return x.code === 108 && /^PHASE2-FAMILLE/.test(String(x.parameters[0])); });
    })[0];
}

var SABOTAGES = [
    ['un Appear qui vise un membre absent', function (b) {
        var p = pageP2(cobaye(b));
        p.list.splice(p.list.length - 1, 0, { code: 335, indent: 0, parameters: [99] });
    }, /membre qui n'existe pas/],
    ['un état supprimé posé par un événement', function (b) {
        var p = pageP2(cobaye(b));
        p.list.forEach(function (x) { if (x.code === 333) { x.parameters[2] = 9999; } });
    }, /état supprimé/],
    ['une page privée de sa commande de fin', function (b) {
        var p = pageP2(cobaye(b));
        p.list = p.list.filter(function (x) { return x.code !== 0; });
    }, /code 0/],
    ['une boîte de dialogue vidée de sa ligne', function (b) {
        var p = pageP2(cobaye(b));
        p.list = p.list.filter(function (x) { return x.code !== 401; });
    }, /sur du vide/],
    ['un renfort caché privé de son Appear', function (b) {
        var t = b.filter(function (x) {
            return x && x.name && (x.members || []).some(function (m) { return m.hidden; }) && pageP2(x);
        })[0];
        if (t) { pageP2(t).list = pageP2(t).list.filter(function (x) { return x.code !== 335; }); }
    }, /dort pour toujours/],
    ['un renfort posé trop haut pour son sprite', function (b) {
        var t = b.filter(function (x) { return x && x.name && (x.members || []).some(function (m) { return m.hidden; }); })[0];
        if (t) { t.members.filter(function (m) { return m.hidden; })[0].y = 10; }
    }, /sort de l'écran/],
    ['une phase deux qui partirait dès le premier tour', function (b) {
        pageP2(cobaye(b)).conditions.enemyValid = false;
    }, /attend la mi-combat/],
    ['une phase deux posée sur un boss ◈', function (b) {
        var boss = b.filter(function (t) { return t && t.name && t.name.indexOf('◈') === 0; })[0];
        var modele = pageP2(cobaye(b));
        if (boss && modele) { boss.pages.push(JSON.parse(JSON.stringify(modele))); }
    }, /boss ◈ n'a reçu/],
    ['toutes les phases deux retirées', function (b) {
        b.forEach(function (t) {
            if (!t || !t.name) { return; }
            t.pages = (t.pages || []).filter(function (p) {
                return !(p.list || []).some(function (x) { return x.code === 108 && /^PHASE2-FAMILLE/.test(String(x.parameters[0])); });
            });
        });
    }, /a sa phase deux/]
];

console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
SABOTAGES.forEach(function (s) {
    var b = JSON.parse(JSON.stringify(T));
    s[1](b);
    var vise = controles(b).filter(function (c) { return !c[1] && s[2].test(c[0]); });
    if (vise.length) { ok++; console.log('   ✓ ' + s[0] + '  →  « ' + vise[0][0] + ' » tombe'); }
    else { ko++; console.log('   ✗ ' + s[0] + '  →  son contrôle ne tombe PAS'); }
});

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
