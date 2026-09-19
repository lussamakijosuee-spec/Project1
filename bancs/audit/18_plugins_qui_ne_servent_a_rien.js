/*
 * QUELS PLUGINS ALLUMÉS NE SERVENT À RIEN ?
 * ---------------------------------------------------------------------------
 * JOKO : « si il y a plein de plugins qui servent à rien, enlève-les ».
 *
 * AVANT D'EN ENLEVER UN SEUL, DEUX FAITS À POSER :
 *
 *   1. Un fichier posé dans js/plugins/ SANS être inscrit dans js/plugins.js
 *      ne coûte RIEN. Il n'est pas chargé, pas exécuté, il ne ralentit rien.
 *      Un lot de fichiers déposés sans être inscrits ne pèse pas une seule
 *      milliseconde : les effacer ne rend pas le jeu plus rapide d'un cheveu.
 *      Ça ne fait que désencombrer la liste du gestionnaire de plugins.
 *
 *   2. Ce qui coûte, c'est ce qui est ALLUMÉ. Et un plugin allumé peut être
 *      inutile de trois façons différentes, qui ne se soignent pas pareil :
 *        · il n'est appelé NULLE PART — aucune de ses commandes de plugin,
 *          aucune de ses balises n'apparaît dans data/ ;
 *        · il fait DOUBLE EMPLOI avec un autre plugin allumé ;
 *        · il COÛTE du temps de démarrage sans rien rendre.
 *
 * Ce banc mesure les trois. Il ne décide rien et ne touche à rien : il liste,
 * avec la preuve à côté. Pour agir, on éteint à la main dans js/plugins.js —
 * et on mesure ce que ça change avec bancs/outils/qui_ralentit.js.
 *
 *   node bancs/audit/18_plugins_qui_ne_servent_a_rien.js
 *   node bancs/audit/18_plugins_qui_ne_servent_a_rien.js --tout
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var D = path.join(RACINE, 'js', 'plugins');
var DATA = path.join(RACINE, 'data');
var TOUT = process.argv.indexOf('--tout') >= 0;

/* ── ce qui est inscrit et allumé ── */
var brut = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
var liste = JSON.parse(brut.slice(brut.indexOf('['), brut.lastIndexOf(']') + 1));
var actifs = liste.filter(function (p) { return p.status && !/^▬/.test(p.name); });
var eteints = liste.filter(function (p) { return !p.status && !/^▬/.test(p.name); });
var surDisque = fs.readdirSync(D).filter(function (f) { return /\.js$/.test(f); })
    .map(function (f) { return f.replace(/\.js$/, ''); });
var inscrits = {}; liste.forEach(function (p) { inscrits[p.name] = p; });

/* ── tout le contenu de data/, en un seul bloc de texte ── */
var toutData = fs.readdirSync(DATA).filter(function (f) { return /\.json$/.test(f); })
    .map(function (f) { return fs.readFileSync(path.join(DATA, f), 'utf8'); }).join('\n');
/* et le code des AUTRES plugins : un plugin peut être appelé par un plugin */
function codeDesAutres(nom) {
    return actifs.filter(function (p) { return p.name !== nom; })
        .map(function (p) {
            var f = path.join(D, p.name + '.js');
            return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
        }).join('\n');
}

/** Ce qu'un plugin offre au jeu : ses commandes de plugin et ses balises. */
function cequilOffre(nom) {
    var f = path.join(D, nom + '.js');
    if (!fs.existsSync(f)) { return { commandes: [], balises: [] }; }
    var t = fs.readFileSync(f, 'utf8');
    var cmd = {}, bal = {}, m;

    /* Les commandes de plugin : on les reconnaît aux comparaisons faites sur
     * le premier mot de la commande, dans pluginCommand. */
    var re1 = /command(?:\.toUpperCase\(\)|\.toLowerCase\(\))?\s*===?\s*['"]([A-Za-z_][\w]*)['"]/g;
    while ((m = re1.exec(t))) { cmd[m[1]] = 1; }
    var re2 = /case\s+['"]([A-Za-z_][\w]{2,})['"]\s*:/g;
    while ((m = re2.exec(t))) { cmd[m[1]] = 1; }

    /* Les balises de note : <Quelque Chose>. On ne garde que celles écrites
     * en toutes lettres dans une expression régulière du plugin. */
    var re3 = /<\s*\\?s\*([A-Za-z][A-Za-z \\s*]{2,40}?)\s*\\?s\*[:>]/g;
    while ((m = re3.exec(t))) {
        var b = m[1].replace(/\\s\*/g, ' ').replace(/\s+/g, ' ').trim();
        if (b.length > 2) { bal[b] = 1; }
    }
    var re4 = /['"]<\s*([A-Za-z][A-Za-z ]{2,30}?)\s*[:>]/g;
    while ((m = re4.exec(t))) { bal[m[1].trim()] = 1; }

    return { commandes: Object.keys(cmd), balises: Object.keys(bal) };
}

/** Une chaîne est-elle employée quelque part dans data/ ? */
function employeDansData(mot) {
    if (!mot || mot.length < 3) { return false; }
    // insensible à la casse et aux espaces multiples, comme MV lit ses balises
    var motif = mot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*');
    return new RegExp('<\\s*' + motif + '\\s*[:>]', 'i').test(toutData)
        || new RegExp('"' + motif + '(\\s|"|\\\\)', 'i').test(toutData);
}

console.log('═'.repeat(76));
console.log('  LES PLUGINS QUI NE SERVENT À RIEN');
console.log('═'.repeat(76));
console.log('');
console.log('   sur le disque            : ' + surDisque.length);
console.log('   inscrits et ALLUMÉS      : ' + actifs.length + '   ← les seuls qui coûtent quelque chose');
console.log('   inscrits mais éteints    : ' + eteints.length);
console.log('   jamais inscrits          : ' + surDisque.filter(function (n) { return !inscrits[n]; }).length +
    '   ← ne coûtent RIEN, pas même une milliseconde');
console.log('');
console.log('   ⚠ Effacer un fichier non inscrit n\'accélère rien : il n\'est pas chargé.');
console.log('     Ça ne désencombre que la liste du gestionnaire de plugins.');

/* ── 1. les allumés que personne n'appelle ── */
console.log('\n' + '─'.repeat(76));
console.log('  ① ALLUMÉS, MAIS APPELÉS NULLE PART');
console.log('─'.repeat(76));
console.log('   Ni leurs commandes de plugin ni leurs balises n\'apparaissent dans data/.');
console.log('');
console.log('   ⚠ ET CE N\'EST PAS UNE ACCUSATION. La plupart des plugins n\'ont pas besoin');
console.log('     qu\'on les appelle : ils agissent dès qu\'ils sont chargés. Irina_Anti');
console.log('     AudioDelay supprime un retard de son, MOG_CharacterShadow dessine les');
console.log('     ombres, Olivia_AntiPlayerStress rattrape les plantages. Leur commande de');
console.log('     plugin n\'est qu\'un interrupteur facultatif ; ne jamais s\'en servir est');
console.log('     normal. Cette liste dit seulement « personne ne lui parle », PAS « il ne');
console.log('     sert à rien » — la différence est tout le sujet.\n');

var muets = [], parles = [];
actifs.forEach(function (p) {
    var o = cequilOffre(p.name);
    if (!o.commandes.length && !o.balises.length) {
        // rien à offrir : il agit tout seul, on ne peut rien en dire ici
        return;
    }
    var employees = o.commandes.filter(function (c) {
        return new RegExp('"' + c + '(\\s|")', 'i').test(toutData);
    }).concat(o.balises.filter(employeDansData));
    if (employees.length) { parles.push({ n: p.name, quoi: employees.slice(0, 3) }); return; }
    // personne dans data/ — et dans le code des autres plugins ?
    var autres = codeDesAutres(p.name);
    var vuAilleurs = o.commandes.concat(o.balises).some(function (x) {
        return new RegExp('[\'"<]\\s*' + x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(autres);
    });
    muets.push({ n: p.name, offre: o.commandes.concat(o.balises).slice(0, 4), vuAilleurs: vuAilleurs });
});

var vraimentMuets = muets.filter(function (x) { return !x.vuAilleurs; });
console.log('   ' + parles.length + ' plugin(s) sont bel et bien employés dans data/.');
console.log('   ' + muets.length + ' n\'y apparaissent pas, dont ' + vraimentMuets.length +
    ' que même les autres plugins n\'appellent pas.\n');
vraimentMuets.slice(0, TOUT ? 999 : 18).forEach(function (x) {
    console.log('      ' + x.n.padEnd(34) + 'offre : ' + x.offre.join(', ').slice(0, 38));
});
if (!TOUT && vraimentMuets.length > 18) { console.log('      … et ' + (vraimentMuets.length - 18) + ' autres (--tout)'); }

/* ── 2. doubles emplois ── */
console.log('\n' + '─'.repeat(76));
console.log('  ② DEUX PLUGINS ALLUMÉS QUI SE MARCHENT DESSUS');
console.log('─'.repeat(76));
/* ⚠ Première version : une table écrite à la main qui groupait les plugins
 *   par SUJET (« le chronomètre », « les crédits »). Elle accusait à tort
 *   VisualMaxEX et VisualMaxEX2, qui sont deux plugins de JOKO faits pour
 *   aller ensemble, et Aries002_SystemCustomiser qui ne touche même pas aux
 *   options. Deviner le sujet ne vaut rien : on mesure le RECOUVREMENT RÉEL —
 *   deux plugins qui remplacent SÈCHEMENT la même fonction du moteur. Là, le
 *   dernier chargé gagne et l'autre disparaît sans bruit. */
function remplacementsSecs(nom) {
    var f = path.join(D, nom + '.js');
    if (!fs.existsSync(f)) { return {}; }
    var t = fs.readFileSync(f, 'utf8'), m, sauve = {}, sec = {};
    var reS = /=\s*((?:Scene_|Window_|Game_|Sprite_|Spriteset_)[A-Za-z]+\.prototype\.[A-Za-z_$][\w$]*)\s*;/g;
    while ((m = reS.exec(t))) { sauve[m[1].replace('.prototype', '')] = 1; }
    var re = /^\s*((?:Scene_|Window_|Game_|Sprite_|Spriteset_)[A-Za-z]+)\.prototype\.([A-Za-z_$][\w$]*)\s*=\s*function/gm;
    while ((m = re.exec(t))) {
        var k = m[1] + '.' + m[2];
        // pluginCommand se surcharge par nature : tout le monde y touche
        if (/pluginCommand$/.test(k)) { continue; }
        // on garde le CORPS, pour pouvoir dire si deux plugins écrivent la
        // même chose (un doublon inoffensif) ou deux choses différentes
        // (un vrai écrasement)
        if (!sauve[k]) { sec[k] = corpsDe(t, m.index); }
    }
    return sec;
}
/** Le texte d'une fonction, des accolades ouvrantes à leur fermeture,
 *  débarrassé des espaces : deux copies identiques doivent se reconnaître. */
function corpsDe(t, depuis) {
    var i = t.indexOf('{', depuis);
    if (i < 0) { return ''; }
    var n = 0, j = i;
    for (; j < t.length && j < i + 20000; j++) {
        if (t[j] === '{') { n++; }
        else if (t[j] === '}') { n--; if (n === 0) { break; } }
    }
    return t.slice(i, j + 1).replace(/\s+/g, '');
}
var ordre = {}; liste.forEach(function (p, i) { ordre[p.name] = i; });
var secs = {};
actifs.forEach(function (p) { secs[p.name] = remplacementsSecs(p.name); });

var paires = [];
for (var i = 0; i < actifs.length; i++) {
    for (var j = i + 1; j < actifs.length; j++) {
        var A = actifs[i].name, B = actifs[j].name;
        /* ⚠ Deux plugins peuvent réécrire la même fonction AVEC LE MÊME CODE :
         *   c'est le cas de toute la famille MOG, où chaque plugin embarque sa
         *   copie des mêmes fonctions d'aide (screen_realX, createHudField…).
         *   Le dernier écrase le précédent par un texte identique : rien n'est
         *   perdu. Les compter comme des conflits, c'était accuser huit paires
         *   innocentes. On ne garde que les réécritures DIFFÉRENTES. */
        var communes = Object.keys(secs[A]).filter(function (k) {
            return secs[B][k] !== undefined && secs[B][k] !== secs[A][k];
        });
        if (communes.length >= 2) {
            var perdant = ordre[A] < ordre[B] ? A : B;
            var gagnant = perdant === A ? B : A;
            paires.push({ gagnant: gagnant, perdant: perdant, n: communes.length, quoi: communes.slice(0, 4) });
        }
    }
}
paires.sort(function (a, b) { return b.n - a.n; });
if (!paires.length) {
    console.log('   Aucune paire ne se marche dessus.');
} else {
    console.log('   ' + paires.length + ' paire(s). Le plugin chargé EN DERNIER gagne ; celui d\'avant');
    console.log('   perd ces fonctions-là sans que rien ne le signale.\n');
    paires.slice(0, TOUT ? 999 : 10).forEach(function (p) {
        console.log('      ' + String(p.n).padStart(2) + ' fonction(s) : ' + p.gagnant + '  écrase  ' + p.perdant);
        console.log('              ' + p.quoi.join(' · '));
    });
    if (!TOUT && paires.length > 10) { console.log('      … et ' + (paires.length - 10) + ' autres (--tout)'); }
}

/* ── 3. ce qui est inscrit mais éteint : ni utile ni coûteux ── */
console.log('\n' + '─'.repeat(76));
console.log('  ③ INSCRITS MAIS ÉTEINTS — ni utiles ni coûteux');
console.log('─'.repeat(76));
console.log('   Ils encombrent la liste de l\'éditeur, rien de plus. Les retirer de');
console.log('   js/plugins.js ne change rien au jeu.\n');
eteints.forEach(function (p) {
    var raison = !fs.existsSync(path.join(D, p.name + '.js')) ? '  ⚠ le fichier n\'existe même pas' : '';
    console.log('      ' + p.name.padEnd(34) + raison);
});

/* ── 4. les inscrits dont le FICHIER manque ── */
var fantomes = actifs.filter(function (p) { return !fs.existsSync(path.join(D, p.name + '.js')); });
if (fantomes.length) {
    console.log('\n' + '─'.repeat(76));
    console.log('  ④ ALLUMÉS MAIS SANS FICHIER — ' + fantomes.length);
    console.log('─'.repeat(76));
    console.log('   MV réclame ces fichiers au démarrage et ne les trouve pas.\n');
    fantomes.forEach(function (p) { console.log('      ' + p.name); });
}

console.log('\n' + '═'.repeat(76));
console.log('  CE QU\'ON PEUT ENLEVER SANS RIEN PERDRE');
console.log('═'.repeat(76));
console.log('   · ' + eteints.length + ' entrée(s) éteinte(s) dans js/plugins.js — aucun effet sur le jeu ;');
console.log('   · ' + surDisque.filter(function (n) { return !inscrits[n]; }).length +
    ' fichier(s) jamais inscrit(s) — aucun effet non plus, mais la liste');
console.log('     du gestionnaire de plugins s\'allège d\'autant.');
console.log('');
console.log('   CE QU\'ON NE PEUT PAS ENLEVER EN ESPÉRANT GAGNER DE LA VITESSE :');
console.log('   les ' + actifs.length + ' allumés font tous quelque chose. Pour savoir lesquels coûtent');
console.log('   vraiment du temps, c\'est une autre mesure :');
console.log('       node bancs/outils/qui_ralentit.js');
console.log('═'.repeat(76));
