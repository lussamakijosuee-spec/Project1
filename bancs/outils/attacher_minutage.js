/*
 * ATTACHER UN MINUTAGE (OU UNE ESQUIVE) À DES COMPÉTENCES NOMMÉES
 * ---------------------------------------------------------------------------
 * Les dix plugins sont branchés et vérifiés en combat. Mais ils ne se
 * déclenchent que sur une compétence qui porte la balise, et les notes des
 * compétences appartiennent à JOKO. Cet outil ne décide donc RIEN : on lui
 * donne des noms, il pose.
 *
 * DEUX CHOSES, PAS UNE. Mesuré au banc :
 *   · la balise seule fait apparaître le jeu d'adresse, mais réussir ou
 *     rater donne EXACTEMENT le même coup — 1140 contre 1140 ;
 *   · c'est la FORMULE qui décide, en lisant $gameTemp.tas_power :
 *     (formule) * $gameTemp.tas_power → 1140 si parfait, 285 si raté.
 * Toucher aux formules est une décision de JOKO, pas la mienne : l'outil ne
 * le fait que si on le lui demande avec --formule.
 *
 *   node bancs/outils/attacher_minutage.js --liste
 *       montre les six façons et ce que chacune demande au joueur
 *
 *   node bancs/outils/attacher_minutage.js --facon=wheel "Lotus des ténèbres" "Contre totale"
 *       essai à blanc : dit ce qui serait posé, ne touche à rien
 *
 *   node bancs/outils/attacher_minutage.js --facon=wheel --formule --ecrire "Lotus des ténèbres"
 *       pose la balise ET fait lire le minutage par la formule
 *
 *   node bancs/outils/attacher_minutage.js --esquive=jump --ecrire "Attaque"
 *       pose une esquive sur une compétence (celle de l'ennemi qu'on esquive)
 *
 *   node bancs/outils/attacher_minutage.js --retirer --ecrire
 *       retire tout ce que cet outil a posé, formules comprises
 *
 * Rien n'est supprimé, jamais : on ajoute une balise à la note, et la note
 * d'origine est conservée dans le registre pour pouvoir tout défaire.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var SKILLS = path.join(RACINE, 'data', 'Skills.json');
var REGISTRE = path.join(__dirname, 'minutages_poses.json');

var args = process.argv.slice(2);
var ECRIRE = args.indexOf('--ecrire') >= 0;
var RETIRER = args.indexOf('--retirer') >= 0;
var LISTE = args.indexOf('--liste') >= 0;
var FORMULE = args.indexOf('--formule') >= 0;
var facon = (args.filter(function (a) { return /^--facon=/.test(a); })[0] || '').split('=')[1];
var esquive = (args.filter(function (a) { return /^--esquive=/.test(a); })[0] || '').split('=')[1];
var TYPE = (args.filter(function (a) { return /^--type=/.test(a); })[0] || '').split('=')[1];
/* --par-portee : au lieu d'une seule façon pour tout le lot, la forme de la
 * compétence choisit son jeu d'adresse. Une compétence qui vise UN ennemi
 * demande de viser juste ; une qui les frappe TOUS demande de tout donner. */
var PAR_PORTEE = args.indexOf('--par-portee') >= 0;
/* --seulement-degats : laisse de côté les compétences dont la formule ne fait
 * aucun dégât. Le minutage n'y changerait rien, autant ne pas les toucher. */
var SEULEMENT_DEGATS = args.indexOf('--seulement-degats') >= 0;
var noms = args.filter(function (a) { return !/^--/.test(a); });

var FACONS = {
    'default': 'Un curseur glisse ; il faut l\'arrêter sur la cible. La plus simple.',
    'wheel': 'Un anneau autour du héros ; des touches tournent, il faut appuyer au bon passage.',
    'circle': 'Un cercle rétrécit ; il faut l\'arrêter quand il touche la cible.',
    'clock': 'Une aiguille tourne ; il faut l\'arrêter dans la zone.',
    'mash': 'Marteler une touche pendant cinq secondes pour remplir la jauge.',
    'arrows': 'Taper une suite de flèches dans l\'ordre et dans le temps.'
};
var ESQUIVES = {
    'jump': 'Sauter par-dessus l\'attaque au bon moment.',
    'charge': 'Charger d\'abord, puis se dégager — la plus proche d\'une parade.'
};

if (LISTE) {
    console.log('═'.repeat(74));
    console.log('  LES SIX FAÇONS DE MINUTER');
    console.log('═'.repeat(74));
    Object.keys(FACONS).forEach(function (f) { console.log('   --facon=' + f.padEnd(12) + FACONS[f]); });
    console.log('\n  LES DEUX ESQUIVES  (à poser sur la compétence de l\'ENNEMI qu\'on esquive)');
    Object.keys(ESQUIVES).forEach(function (f) { console.log('   --esquive=' + f.padEnd(10) + ESQUIVES[f]); });
    console.log('\n  ⚠ Sans --formule, le jeu d\'adresse s\'affiche mais ne change RIEN aux');
    console.log('    dégâts : mesuré 1140 qu\'on réussisse ou qu\'on rate. Avec --formule,');
    console.log('    la formule devient (formule) * $gameTemp.tas_power : 1140 si parfait,');
    console.log('    285 si raté. C\'est ce réglage qui fait la différence.');
    console.log('═'.repeat(74));
    process.exit(0);
}

/* ── lecture, en gardant la MISE EN PAGE du fichier ── */
var brut = fs.readFileSync(SKILLS, 'utf8');
var skills = JSON.parse(brut);

/** Réécrit data/Skills.json en respectant sa forme : une entrée par ligne,
 *  crochets seuls sur leur ligne. Contrôle de fidélité avant d'écrire. */
function ecrireSkills(liste) {
    var sortie = '[\n' + liste.map(function (s) {
        return s === null ? 'null' : JSON.stringify(s);
    }).join(',\n') + '\n]';
    /* ⚠ Garde-fou du projet : on relit ce qu'on s'apprête à écrire et on
     *   compare entrée par entrée. Une seule entrée perdue ou déplacée dans
     *   Skills.json, et des compétences disparaissent du jeu. */
    var relu = JSON.parse(sortie);
    if (relu.length !== liste.length) {
        throw new Error('relecture : ' + relu.length + ' entrées au lieu de ' + liste.length);
    }
    for (var i = 0; i < liste.length; i++) {
        if (JSON.stringify(relu[i]) !== JSON.stringify(liste[i])) {
            throw new Error('l\'entrée ' + i + ' ne se relit pas à l\'identique');
        }
    }
    fs.writeFileSync(SKILLS, sortie, 'utf8');
}

/* ── RETIRER ── */
if (RETIRER) {
    if (!fs.existsSync(REGISTRE)) { console.error('  aucun registre : rien n\'a été posé par cet outil.'); process.exit(1); }
    var reg = JSON.parse(fs.readFileSync(REGISTRE, 'utf8'));
    var remis = 0;
    reg.entrees.forEach(function (e) {
        var s = skills[e.id];
        if (!s) { return; }
        s.note = e.noteAvant;
        if (e.formuleAvant !== undefined) { s.damage.formula = e.formuleAvant; }
        remis++;
        console.log('   remis : ' + s.name);
    });
    if (!ECRIRE) { console.log('\n  ' + remis + ' à remettre. (essai à blanc — ajoute --ecrire.)'); process.exit(0); }
    ecrireSkills(skills);
    fs.unlinkSync(REGISTRE);
    console.log('\n  ✔ ' + remis + ' compétence(s) remise(s) comme avant.');
    process.exit(0);
}

if (facon && !FACONS[facon]) {
    console.error('  façon inconnue : « ' + facon +' ». Les six sont : ' + Object.keys(FACONS).join(', '));
    process.exit(1);
}
if (esquive && !ESQUIVES[esquive]) {
    console.error('  esquive inconnue : « ' + esquive + ' ». Les deux sont : ' + Object.keys(ESQUIVES).join(', '));
    process.exit(1);
}
if (!noms.length && !TYPE) {
    console.error('  donne au moins un nom de compétence entre guillemets, ou --type=3 pour tout un onglet.');
    process.exit(1);
}
if (facon && PAR_PORTEE) {
    console.error('  choisis : --facon=… OU --par-portee, pas les deux.');
    process.exit(1);
}
if (!facon && !esquive && !PAR_PORTEE) {
    console.error('  dis quoi poser : --facon=wheel, --par-portee, ou --esquive=jump.');
    process.exit(1);
}

/** La forme de la compétence choisit son jeu d'adresse.
 *  (portées de MV : 1 = un ennemi · 2 = tous · 3-6 = aléatoires · 7+ = alliés) */
function faconPourPortee(s) {
    if (s.scope === 1) { return 'circle'; }      // une cible : viser juste
    if (s.scope === 2) { return 'mash'; }        // tous : tout donner
    if (s.scope >= 3 && s.scope <= 6) { return 'arrows'; }  // plusieurs coups : une suite
    return 'wheel';                              // le reste : l'anneau
}

/* ── trouver les compétences nommées ── */
var parNom = {};
skills.forEach(function (s) { if (s && s.name) { (parNom[s.name] = parNom[s.name] || []).push(s); } });

var cibles = [], introuvables = [], ambigus = [], sansDegats = [];
if (TYPE) {
    var t = Number(TYPE);
    skills.forEach(function (s) { if (s && s.stypeId === t) { cibles.push(s); } });
}
noms.forEach(function (n) {
    var t = parNom[n];
    if (!t) {
        // une recherche indulgente : sans accents ni casse
        var plat = function (x) { return x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
        var proches = skills.filter(function (s) { return s && s.name && plat(s.name) === plat(n); });
        if (proches.length) { t = proches; }
    }
    if (!t) { introuvables.push(n); return; }
    if (t.length > 1) { ambigus.push({ nom: n, ids: t.map(function (s) { return s.id; }) }); }
    t.forEach(function (s) { cibles.push(s); });
});

/* ⚠ Une compétence dont la formule ne fait aucun dégât ne tirera RIEN du
 *   minutage : la multiplier par la puissance donne toujours zéro. On la met
 *   de côté au lieu de la toucher pour rien — et on dit lesquelles. */
if (SEULEMENT_DEGATS) {
    cibles = cibles.filter(function (s) {
        var f = String(s.damage.formula).trim();
        var inerte = (s.damage.type === 0) || f === '' || f === '0';
        if (inerte) { sansDegats.push(s); }
        return !inerte;
    });
}

console.log('═'.repeat(74));
console.log('  ATTACHER ' + (PAR_PORTEE ? 'UN MINUTAGE CHOISI PAR LA PORTÉE'
    : facon ? 'LE MINUTAGE « ' + facon + ' »' : 'L\'ESQUIVE « ' + esquive + ' »'));
console.log('═'.repeat(74));
if (facon) { console.log('  ' + FACONS[facon]); }
if (esquive) { console.log('  ' + ESQUIVES[esquive]); }
if (PAR_PORTEE) {
    console.log('  un ennemi → circle (viser juste) · tous → mash (tout donner)');
    console.log('  plusieurs coups → arrows (une suite) · le reste → wheel (l\'anneau)');
}
if (TYPE) {
    var nomType = (require(path.join(RACINE, 'data', 'System.json')).skillTypes || [])[Number(TYPE)];
    console.log('  onglet visé : n°' + TYPE + ' « ' + nomType + ' »');
}
console.log('');
if (sansDegats.length) {
    console.log('  ' + sansDegats.length + ' laissée(s) de côté, elles ne font aucun dégât :');
    sansDegats.forEach(function (s) { console.log('       n°' + String(s.id).padStart(4) + '  ' + s.name); });
    console.log('     Pour celles-là, le minutage devrait agir autrement qu\'en multipliant');
    console.log('     des dégâts — dis-moi ce qu\'il doit faire.\n');
}

if (introuvables.length) {
    console.log('  ✘ ' + introuvables.length + ' nom(s) introuvable(s) — rien ne sera posé pour eux :');
    introuvables.forEach(function (n) { console.log('       « ' + n + ' »'); });
    console.log('');
}
if (ambigus.length) {
    console.log('  ⚠ ' + ambigus.length + ' nom(s) porté(s) par plusieurs compétences — toutes seront touchées :');
    ambigus.forEach(function (a) { console.log('       « ' + a.nom + ' » → n°' + a.ids.join(', n°')); });
    console.log('');
}

/* ── poser ── */
var BALISE_MIN = function (f) { return '<Timed Attack: ' + f + '>\n<End Timed Attack>'; };
var BALISE_ESQ = function (f) { return '<Active Defense: ' + f + '>\n<End Active Defense>'; };
var MARQUE = '$gameTemp.tas_power';

var poses = [], deja = [];
cibles.forEach(function (s) {
    if (/<\s*Timed\s*Attack\s*:/i.test(s.note) || /<\s*Active\s*Defense\s*:/i.test(s.note)) {
        deja.push(s.name);
        return;
    }
    var noteAvant = s.note;
    var formuleAvant;
    var saFacon = PAR_PORTEE ? faconPourPortee(s) : facon;
    var nouvelleNote = (s.note ? s.note.replace(/\s*$/, '') + '\n' : '') +
        (saFacon ? BALISE_MIN(saFacon) : BALISE_ESQ(esquive));
    var nouvelleFormule;
    var formuleInerte = false;
    if (FORMULE && saFacon) {
        if (s.damage.formula.indexOf(MARQUE) >= 0) {
            nouvelleFormule = s.damage.formula;    // déjà fait, on n'empile pas
        } else {
            /* ⚠ Multiplier une formule qui vaut déjà zéro (ou rien) ne change
             *   rien du tout : la compétence ne fait pas de dégâts, elle pose
             *   un état ou déclenche un effet. Le dire, plutôt que de laisser
             *   croire que le minutage compte pour elle. */
            var f = String(s.damage.formula).trim();
            formuleInerte = (f === '' || f === '0' || s.damage.type === 0);
            formuleAvant = s.damage.formula;
            nouvelleFormule = '(' + s.damage.formula + ') * ' + MARQUE;
        }
    }
    poses.push({
        id: s.id, nom: s.name, s: s, facon: saFacon,
        noteAvant: noteAvant, nouvelleNote: nouvelleNote,
        formuleAvant: formuleAvant, nouvelleFormule: nouvelleFormule,
        formuleInerte: formuleInerte
    });
});

if (deja.length) {
    console.log('  ' + deja.length + ' portai(en)t déjà une balise — laissée(s) tranquille(s) : ' + deja.join(' · '));
    console.log('');
}
console.log('  ' + poses.length + ' compétence(s) à toucher :\n');
poses.forEach(function (p) {
    console.log('   n°' + String(p.id).padStart(4) + '  ' + p.nom.padEnd(34) + (p.facon ? '→ ' + p.facon : '→ esquive ' + esquive));
    if (p.nouvelleFormule) {
        console.log('            formule : ' + p.formuleAvant);
        console.log('                   →  ' + p.nouvelleFormule);
        if (p.formuleInerte) {
            console.log('            ⚠ cette formule ne fait aucun dégât : la multiplier ne changera');
            console.log('              rien. Le minutage restera un décor pour cette compétence.');
        }
    }
});
var inertes = poses.filter(function (p) { return p.formuleInerte; });
if (inertes.length) {
    console.log('\n  ⚠ ' + inertes.length + ' compétence(s) sans dégâts : ' +
        inertes.map(function (p) { return p.nom; }).join(' · '));
    console.log('    Pour elles, le minutage devra agir autrement (une condition dans');
    console.log('    l\'effet, une séquence d\'action) — dis-moi ce qu\'il doit faire.');
}
if (!FORMULE && facon && poses.length) {
    console.log('\n  ⚠ Sans --formule, le jeu d\'adresse s\'affichera mais réussir ou rater');
    console.log('    donnera le même coup. Mesuré au banc : 1140 contre 1140.');
}

/* ── la règle du projet : au-delà de dix entrées, on propose et on attend ── */
if (poses.length > 10) {
    console.log('\n  ⚠ ' + poses.length + ' compétences, c\'est une modification en masse de data/.');
    console.log('    Règle du projet : je signale, JOKO décide. Relance en confirmant.');
    if (ECRIRE && args.indexOf('--je-confirme') < 0) {
        console.log('    (ajoute --je-confirme pour passer outre)');
        process.exit(1);
    }
}

if (!ECRIRE) {
    console.log('\n  (essai à blanc — rien n\'a été touché. Ajoute --ecrire.)');
    process.exit(0);
}
if (!poses.length) { console.log('\n  rien à faire.'); process.exit(0); }

poses.forEach(function (p) {
    p.s.note = p.nouvelleNote;
    if (p.nouvelleFormule) { p.s.damage.formula = p.nouvelleFormule; }
});
ecrireSkills(skills);

var ancien = fs.existsSync(REGISTRE) ? JSON.parse(fs.readFileSync(REGISTRE, 'utf8')).entrees : [];
fs.writeFileSync(REGISTRE, JSON.stringify({
    fait: new Date().toISOString().slice(0, 19),
    entrees: ancien.concat(poses.map(function (p) {
        return { id: p.id, nom: p.nom, noteAvant: p.noteAvant, formuleAvant: p.formuleAvant };
    }))
}, null, 1), 'utf8');

console.log('\n  ✔ ' + poses.length + ' compétence(s) touchée(s).');
console.log('    registre : bancs/outils/minutages_poses.json');
console.log('    pour tout défaire : node bancs/outils/attacher_minutage.js --retirer --ecrire');
console.log('    ⚠ relance les bancs avant de committer : node bancs/11_degats_et_voies.js');
console.log('═'.repeat(74));
