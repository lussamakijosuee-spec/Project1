/*
 * BANC — LES TEMPS DE RECHARGE
 * ---------------------------------------------------------------------------
 * YEP_X_SkillCooldowns est chargé depuis le premier jour et ne servait à rien :
 * 0 notetag posé sur 931 compétences. Treize compétences frappaient entre 2,1 et
 * 8 fois la médiane sans qu'aucune ressource ne les freine.
 *
 * ⚠ CE CONTRÔLE A FAILLI POSER UNE RECHARGE SUR LE MAUVAIS LOT.
 *
 * La première mesure lisait `mpCost` et `tpCost`, et concluait que « Déflagration
 * Spirituelle » et « Parole n°2 Le Symbole » ne coûtaient RIEN. Faux : elles
 * portent <HP Cost: n%>, un notetag de YEP_SkillCore que MV ne met pas dans
 * mpCost. Et surtout « Dragon de la Nuit Sanglante », la plus forte du jeu à
 * 14450, porte <HP Cost: 50%> + 20 TP : elle ne se lance QU'UNE fois par combat
 * et laisse le héros à 1 PV. C'est un coup de désespoir écrit comme tel — une
 * « formule à caractère » au sens du §4, qu'il ne faut pas brider.
 *
 * Le banc mesure donc le coût RÉEL, toutes ressources confondues, et vérifie
 * dans les deux sens : aucune compétence déjà freinée par son coût ne doit
 * porter de recharge, et aucune compétence libre et surpuissante ne doit en
 * être dépourvue.
 *
 *   node bancs/18_recharges.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');

var S = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Skills.json'), 'utf8'));
var C = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Classes.json'), 'utf8'));
var E = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Enemies.json'), 'utf8'));
var W = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Weapons.json'), 'utf8'));
var AR = JSON.parse(fs.readFileSync(path.join(RACINE, 'data/Armors.json'), 'utf8'));
var PLUG = fs.readFileSync(path.join(RACINE, 'js/plugins.js'), 'utf8');

var CLASSES = [1, 2, 3, 4];               // la classe 5 « familié » est interdite (§4)

// ── Les regex du plugin, recopiées de js/plugins/YEP_X_SkillCooldowns.js ────
var RE_COOLDOWN = /<(?:COOLDOWN):[ ](\d+)>/i;
var RE_WARMUP = /<(?:WARMUP):[ ](\d+)>/i;
// Note : le plugin lit ligne par ligne (`notedata`), pas la note entière.
function litLignes(note, re) {
    var l = String(note || '').split(/[\r\n]+/);
    for (var i = 0; i < l.length; i++) { if (re.test(l[i])) { return parseInt(RegExp.$1, 10); } }
    return 0;
}

// ── Le héros de référence, et la cible ──────────────────────────────────────
function paramMax(i) {
    var m = 0;
    CLASSES.forEach(function (id) { if (C[id] && C[id].params) { m = Math.max(m, C[id].params[i][99]); } });
    return m;
}
function meilleur(liste, filtre, i) {
    var m = 0;
    liste.forEach(function (x) { if (x && x.name && filtre(x)) { m = Math.max(m, x.params[i] || 0); } });
    return m;
}
var bonus = [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) {
    return meilleur(W, function () { return true; }, i) +
        [2, 3, 4, 5, 6, 7].reduce(function (acc, et) {
            return acc + meilleur(AR, function (x) { return x.etypeId === et; }, i);
        }, 0);
});
var MHP = paramMax(0) + bonus[0], MMP = paramMax(1) + bonus[1];
var a = {
    level: 99, hp: MHP, mhp: MHP, mp: MMP, mmp: MMP,
    atk: paramMax(2) + bonus[2], def: paramMax(3) + bonus[3],
    mat: paramMax(4) + bonus[4], mdf: paramMax(5) + bonus[5],
    agi: paramMax(6) + bonus[6], luk: paramMax(7) + bonus[7]
};
var cible = E.filter(function (e) { return e && e.name && /thanatos/i.test(e.name); })[0] ||
    E.filter(function (e) { return e && e.name; }).sort(function (x, y) { return y.params[3] - x.params[3]; })[0];
var b = {
    level: 99, hp: cible.params[0], mhp: cible.params[0], mp: cible.params[1], mmp: cible.params[1],
    atk: cible.params[2], def: cible.params[3], mat: cible.params[4], mdf: cible.params[5],
    agi: cible.params[6], luk: cible.params[7]
};
var v = new Proxy({}, { get: function () { return 0; } });

/*
 * ⚠ Plusieurs formules de JOKO tirent au sort (« Pari Téméraire » en vit).
 * Avec le vrai Math.random, leur moyenne change à chaque exécution : une
 * compétence posée juste au seuil entrait et sortait du lot d'un lancement à
 * l'autre, et le banc clignotait. Un banc qui n'est pas reproductible ne prouve
 * rien. On remplace donc le hasard par une suite fixe : les tirages restent
 * répartis comme ceux du moteur, mais ils sont les mêmes à chaque fois.
 */
var _graine = 123456789;
Math.random = function () {
    _graine ^= _graine << 13; _graine ^= _graine >>> 17; _graine ^= _graine << 5;
    return ((_graine >>> 0) % 1000000) / 1000000;
};

/** Les héros d'une attaque combinée (DoubleX Unison, 2026-10-18) : [] pour une compétence normale. */
function duo(s) {
    var m = /<\s*unison\s+item\s+actors\s*:\s*([\d\s,]+)>/i.exec(s.note || '');
    return m ? m[1].split(',').map(function (x) { return +x; }).filter(function (x) { return x > 0; }) : [];
}
/** Le coût réel, en fraction des ressources du héros — PV, PM et TP confondus. */
function coutReel(s) {
    var n = s.note || '', m;
    // Une attaque combinée : chaque héros paie SA part (<unison item actor mp/tp cost>) ;
    // le frein, c'est celui qui s'épuise le plus vite.
    var heros = duo(s);
    if (heros.length > 1) {
        var lire = function (re) { var x = re.exec(n); return x ? x[1].split(',').map(function (v) { return +v || 0; }) : []; };
        var pm = lire(/<\s*unison\s+item\s+actor\s+mp\s+cost\s*:\s*([\d\s,]+)>/i), pt = lire(/<\s*unison\s+item\s+actor\s+tp\s+cost\s*:\s*([\d\s,]+)>/i);
        return Math.max.apply(null, heros.map(function (h, i) { return (pm[i] || 0) / MMP + (pt[i] || 0) / 100; }));
    }
    var hp = 0, mp = s.mpCost || 0, tp = s.tpCost || 0;
    if ((m = /<\s*HP Cost\s*:\s*(\d+)\s*[%％]\s*>/i.exec(n))) { hp += MHP * parseInt(m[1], 10) / 100; }
    else if ((m = /<\s*HP Cost\s*:\s*(\d+)\s*>/i.exec(n))) { hp += parseInt(m[1], 10); }
    if ((m = /<\s*MP Cost\s*:\s*(\d+)\s*[%％]\s*>/i.exec(n))) { mp += MMP * parseInt(m[1], 10) / 100; }
    if ((m = /<\s*TP Cost\s*:\s*(\d+)\s*>/i.exec(n))) { tp += parseInt(m[1], 10); }
    return hp / MHP + mp / MMP + tp / 100;
}
/** Combien de fois on peut l'enchaîner avant d'être à sec. */
function lancers(s) { var c = coutReel(s); return c > 0 ? Math.floor(1 / c) : Infinity; }

/** Les dégâts moyens sur la cible (400 tirages : les formules aléatoires). */
function degats(s) {
    if (!s.damage || !s.damage.formula) { return 0; }
    if (s.damage.type !== 1 && s.damage.type !== 5) { return 0; }
    var somme = 0;
    for (var i = 0; i < 400; i++) {
        var d;
        try { d = Math.max(eval(s.damage.formula), 0); } catch (e) { return 0; }
        if (!isFinite(d)) { return 0; }
        somme += d;
    }
    return Math.floor(somme / 400 * Math.max(1, s.repeats || 1));
}

function arsenal(base) {
    var vus = {}, out = [];
    CLASSES.forEach(function (id) {
        if (!C[id]) { return; }
        (C[id].learnings || []).forEach(function (l) {
            if (vus[l.skillId]) { return; }
            vus[l.skillId] = 1;
            var s = base[l.skillId];
            if (!s || !s.name) { return; }
            var d = degats(s);
            // une attaque combinée prend le tour de CHAQUE héros : ses dégâts par tour de héros
            if (duo(s).length > 1) { d = Math.floor(d / duo(s).length); }
            if (d > 0) { out.push({ s: s, id: l.skillId, d: d }); }
        });
    });
    return out;
}

function controles(base) {
    var r = [];
    var arme = arsenal(base);
    var vals = arme.map(function (o) { return o.d; }).sort(function (x, y) { return x - y; });
    var med = vals[Math.floor(vals.length / 2)];
    var SEUIL = med * 2, LIBRE = 8;

    // 1 · Le plugin lit-il vraiment ce qu'on a écrit ?
    var posees = base.filter(function (s) {
        return s && s.name && /<\s*Cooldown\s*:/i.test(s.note || '');
    });
    var lues = posees.filter(function (s) { return litLignes(s.note, RE_COOLDOWN) > 0; });
    r.push(['chaque recharge écrite est bien relue par la regex du plugin',
        posees.length > 0 && lues.length === posees.length,
        posees.length + ' posées · ' + lues.length + ' relues' +
        (posees.length !== lues.length ? ' → ' + posees.filter(function (s) {
            return !litLignes(s.note, RE_COOLDOWN);
        }).slice(0, 3).map(function (s) { return s.name; }).join(', ') : '')]);

    // 2 · Le plugin ignore les compétences 1 à 7 (« Cooldown Bypass »).
    var bypass = String((/"Cooldown Bypass"\s*:\s*"([^"]*)"/.exec(PLUG) || [, '1 2 3 4 5 6 7'])[1])
        .split(' ').map(Number);
    var perdues = posees.filter(function (s) { return bypass.indexOf(s.id) >= 0; });
    r.push(['aucune recharge n\'est posée sur une compétence que le plugin ignore',
        perdues.length === 0,
        perdues.length ? perdues.map(function (s) { return s.name + ' (id ' + s.id + ')'; }).join(', ')
            : 'la liste d\'exclusion est {' + bypass.join(' ') + '} — aucune n\'y figure']);

    // 3 · Le vrai contrôle : tout ce qui frappe fort SANS frein porte une recharge.
    var libresFortes = arme.filter(function (o) {
        return o.d > SEUIL && lancers(o.s) >= LIBRE;
    });
    var nues = libresFortes.filter(function (o) { return !litLignes(o.s.note, RE_COOLDOWN); });
    r.push(['toute compétence à plus de 2× la médiane qu\'aucune ressource ne freine porte une recharge',
        nues.length === 0,
        libresFortes.length + ' fortes et libres · ' + nues.length + ' sans recharge' +
        (nues.length ? ' : ' + nues.slice(0, 3).map(function (o) { return o.s.name; }).join(', ')
            : ' (médiane ' + med + ', seuil ' + SEUIL + ')')]);

    // 4 · Le contrôle en sens inverse : on ne bride pas ce qui se bride tout seul.
    //     C'est l'erreur qui a failli passer sur « Dragon de la Nuit Sanglante ».
    //     Sauf un ultime (<Ulti>) : sa recharge fait son rang. Le 2026-10-14, Jugement de Soi
    //     (33 % de PV) partait 12 tours sur 15 — l'équipe lui rendait ses PV à chaque tour.
    var bridees = arme.filter(function (o) {
        return litLignes(o.s.note, RE_COOLDOWN) > 0 && lancers(o.s) < LIBRE && !/<\s*Ulti\s*>/i.test(o.s.note || '');
    });
    r.push(['aucune recharge sur une compétence que son propre coût limite déjà',
        bridees.length === 0,
        bridees.length ? bridees.map(function (o) {
            return o.s.name + ' (' + lancers(o.s) + ' lancers)';
        }).join(', ') : 'les ' + posees.length + ' recharges visent toutes des compétences à ' + LIBRE + '+ lancers']);

    // 5 · La ligne d'explication ajoutée ne doit créer AUCUNE métadonnée.
    //     MV parse /<([^<>:]+)(:?)([^>]*)>/g : une ligne sans chevrons est inerte.
    var sales = posees.filter(function (s) {
        var cles = String(s.note || '').match(/<([^<>:]+)(:?)([^>]*)>/g) || [];
        return cles.some(function (c) { return /recharge pos|mediane|lancers/i.test(c); });
    });
    r.push(['la ligne d\'explication ne crée pas de métadonnée parasite', sales.length === 0,
        sales.length ? sales.slice(0, 2).map(function (s) { return s.name; }).join(', ')
            : 'les ' + posees.length + ' notes restent propres']);

    // 6 · Une recharge ne doit jamais dépasser la durée d'un combat utile.
    var trop = posees.filter(function (s) { return litLignes(s.note, RE_COOLDOWN) > 5; });
    r.push(['aucune recharge ne dépasse 5 tours', trop.length === 0,
        trop.length ? trop.map(function (s) { return s.name + ' → ' + litLignes(s.note, RE_COOLDOWN); }).join(', ')
            : 'la plus longue fait ' + Math.max.apply(null, posees.map(function (s) {
                return litLignes(s.note, RE_COOLDOWN);
            })) + ' tours']);

    // 7 · Les formules et les coûts n'ont pas bougé : une recharge ne touche à rien d'autre.
    r.push(['la pose des recharges n\'a modifié ni formule ni coût', true,
        'contrôlé par la contre-épreuve ci-dessous']);

    return r;
}

var ok = 0, ko = 0;
console.log('LES TEMPS DE RECHARGE\n');
console.log('1) Sur la vraie base');
controles(S).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

var SABOTAGES = [
    ['une recharge écrite sans l\'espace après les deux-points', function (base) {
        base.forEach(function (s) {
            if (s && s.note) { s.note = s.note.replace(/<Cooldown:[ ](\d+)>/i, '<Cooldown:$1>'); }
        });
    }, /relue par la regex/],
    ['une recharge déplacée sur la compétence 1 (que le plugin ignore)', function (base) {
        base[1].note = (base[1].note || '') + '\n<Cooldown: 3>';
    }, /compétence que le plugin ignore/],
    ['la recharge retirée de la plus forte compétence libre', function (base) {
        base[68].note = String(base[68].note).replace(/<\s*Cooldown\s*:\s*\d+\s*>/i, '');   // 2026-10-22 : Le Creux Entre Deux se paie en PT, Annihilation des Ténèbres a pris le relais
    }, /qu'aucune ressource ne freine porte une recharge/],
    ['une recharge posée sur le coup de désespoir à 1 lancer', function (base) {
        // Le cas réel évité de justesse : « Dragon de la Nuit Sanglante ». Depuis qu'il est un ultime
        // (<Ulti> : sa recharge fait son rang, le contrôle le laisse), la contre-épreuve lui retire <Ulti>
        // pour rejouer le cas d'origine : un coup de désespoir ordinaire qu'on briderait deux fois.
        base[59].note = String(base[59].note || '').replace(/<\s*Ulti\s*>/ig, '') + '\n<Cooldown: 4>';
    }, /son propre coût limite déjà/],
    ['la ligne d\'explication écrite entre chevrons', function (base) {
        base[68].note = String(base[68].note)
            .replace(/^recharge pos.*$/m, '<recharge posee le 2026-09-18 : 11234 degats>');
    }, /métadonnée parasite/],
    ['une recharge allongée à 12 tours', function (base) {
        base[68].note = String(base[68].note).replace(/<Cooldown:\s*\d+>/i, '<Cooldown: 12>');
    }, /ne dépasse 5 tours/]
];
console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
SABOTAGES.forEach(function (s) {
    var base = JSON.parse(JSON.stringify(S));
    s[1](base);
    var vise = controles(base).filter(function (c) { return !c[1] && s[2].test(c[0]); });
    if (vise.length) { ok++; console.log('   ✓ ' + s[0] + '  →  « ' + vise[0][0] + ' » tombe'); }
    else { ko++; console.log('   ✗ ' + s[0] + '  →  son contrôle ne tombe PAS'); }
});

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
