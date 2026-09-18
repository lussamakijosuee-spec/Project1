/*
 * BANC — LES SÉQUENCES D'ACTION
 * ---------------------------------------------------------------------------
 * POURQUOI CE BANC EXISTE
 *
 * Une séquence d'action est du texte libre dans la note d'une compétence.
 * YEP la découpe ligne à ligne et, pour chaque ligne, cherche un nom de
 * commande qu'il connaît. S'il ne le trouve pas, IL PASSE À LA SUIVANTE —
 * sans erreur, sans log, sans rien. « shake screen » existe ; « screen
 * shake » ne fait rien du tout, et les deux se lisent pareil.
 *
 * C'est exactement le piège de `9_doctrines.js`, transposé : le banc ne
 * rejoue donc PAS une liste de commandes que j'aurais recopiée. Il relit le
 * vocabulaire dans les cinq plugins qui le définissent — BattleEngineCore,
 * les trois ActSeqPack et ElementCore — sous ses TROIS formes de reconnaissance :
 *
 *     actionName === 'X'                    (forme exacte)
 *     ['X', 'Y'].contains(actionName)       (synonymes — « CAMERA FOCUS »)
 *     actionName.match(/X (.*)/)            (commande à paramètre — « MOTION »)
 *
 * Une première version n'avait lu que la première forme : elle déclarait
 * « CAMERA FOCUS » inconnue alors que le moteur la comprend très bien, et
 * aurait fait réécrire des séquences parfaitement valides.
 *
 * ⚠ ET LES BLOCS. Le contenu d'une séquence ne tourne que s'il est DANS un
 * bloc (<setup action>, <whole action>, <target action>, <follow action>,
 * <finish action>). Une commande posée hors bloc est du texte mort. Le banc
 * vérifie aussi que chaque bloc ouvert est refermé.
 *
 *   node bancs/17_sequences_action.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');
var L = function (n) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', n + '.json'), 'utf8')); };

//===========================================================================
// 1 · Le vocabulaire, relu dans les plugins qui le définissent
//===========================================================================
var FICHIERS = ['YEP_BattleEngineCore', 'YEP_X_ActSeqPack1', 'YEP_X_ActSeqPack2',
    'YEP_X_ActSeqPack3', 'YEP_ElementCore'];

var VOCAB = (function () {
    var exacts = {}, motifs = [];
    FICHIERS.forEach(function (f) {
        var p = path.join(RACINE, 'js', 'plugins', f + '.js');
        if (!fs.existsSync(p)) return;
        var src = fs.readFileSync(p, 'utf8');
        // forme 1 : actionName === 'X'  ET  actionName.toUpperCase() === 'X'
        // (la seconde est la quatrième forme du plugin ; l'oublier faisait
        //  déclarer « END » inconnue alors que le moteur la comprend)
        (src.match(/actionName(?:\.toUpperCase\(\))?\s*===\s*'([^']+)'/g) || []).forEach(function (m) {
            exacts[m.replace(/.*'([^']+)'.*/, '$1').toUpperCase()] = f;
        });
        (src.match(/\[([^\]]*?)\]\.contains\(actionName\)/g) || []).forEach(function (m) {
            (m.match(/'([^']+)'/g) || []).forEach(function (x) {
                exacts[x.replace(/'/g, '').toUpperCase()] = f;
            });
        });
        // forme 3 : actionName.match(/X (.*)/)
        // ⚠ la capture garde le « / » final du littéral — le laisser exigeait
        // une barre oblique à la fin du nom de commande, et AUCUN motif ne
        // mordait plus. Le banc déclarait tout inconnu, en silence.
        (src.match(/actionName\.match\(\/([^\/]+)\//g) || []).forEach(function (m) {
            var corps = m.replace(/.*match\(\//, '').replace(/\/$/, '');
            try { motifs.push(new RegExp('^' + corps, 'i')); } catch (e) { /* motif illisible : ignoré */ }
        });
    });
    return { exacts: exacts, motifs: motifs };
})();

function reconnue(nom) {
    var N = nom.toUpperCase().trim();
    if (VOCAB.exacts[N]) return true;
    return VOCAB.motifs.some(function (r) { return r.test(N); });
}

//===========================================================================
// 2 · Découper une note comme YEP la découpe
//===========================================================================
var OUVRE = /<\s*(SETUP|WHOLE|TARGET|FOLLOW|FINISH)(?:\s+ACTION)?\s*>/i;
var FERME = /<\/\s*(SETUP|WHOLE|TARGET|FOLLOW|FINISH)(?:\s+ACTION)?\s*>/i;

// ⚠ Une compétence ne porte pas QUE des séquences. Elle peut porter un
// <Custom Requirement> de YEP_SkillCore, un <After Eval>, un <target action>…
// et ces blocs-là contiennent du JavaScript, pas des commandes de séquence.
// Une première version prenait « var ames = $gameParty.deadMembers(); » pour
// une commande inconnue et accusait un innocent (§6). On suit donc une PILE de
// tous les blocs ouverts, et on ne lit comme commande que ce qui se trouve
// directement dans un bloc d'ACTION.
var TOUT_OUVRE = /^<\s*([^\/<>][^<>]*?)\s*>$/;
var TOUT_FERME = /^<\/\s*([^<>]+?)\s*>$/;

function estBlocAction(nom) {
    return /^(SETUP|WHOLE|TARGET|FOLLOW|FINISH)(\s+ACTION)?$/i.test(nom.trim());
}

function analyse(note) {
    var pile = [], lignes = [], horsBloc = [], mal = [];
    (note || '').split(/\r?\n/).forEach(function (brut) {
        var l = brut.trim();
        if (!l) return;

        var f = TOUT_FERME.exec(l);
        if (f) {
            var attendu = pile[pile.length - 1];
            if (!attendu) { mal.push('fermeture sans ouverture : ' + l); return; }
            if (attendu.replace(/\s+action$/i, '').toUpperCase() !==
                f[1].replace(/\s+action$/i, '').toUpperCase()) {
                mal.push('« ' + l +' » ne ferme pas <' + attendu + '>');
            }
            pile.pop(); return;
        }
        var o = TOUT_OUVRE.exec(l);
        if (o) { pile.push(o[1]); return; }

        if (/^<.*>$/.test(l)) return;            // notetag sur une seule ligne
        if (/^\/\//.test(l)) return;             // commentaire de séquence

        var courant = pile[pile.length - 1];
        if (!courant) {
            // hors de tout bloc : seul un notetag isolé est légitime ici
            horsBloc.push(l); return;
        }
        if (!estBlocAction(courant)) return;     // JavaScript d'un autre notetag

        // YEP coupe le nom de la commande au premier « : »
        lignes.push(l.split(':')[0].trim());
    });
    pile.filter(estBlocAction).forEach(function (b) { mal.push('bloc <' + b + '> jamais refermé'); });
    return { lignes: lignes, ouverts: pile, horsBloc: horsBloc, mal: mal };
}

//===========================================================================
// 3 · Les contrôles
//===========================================================================
function controles(monde) {
    var r = [], S = monde.Skills;

    r.push(['le vocabulaire se relit bien dans les plugins',
        Object.keys(VOCAB.exacts).length > 50 && VOCAB.motifs.length > 20,
        Object.keys(VOCAB.exacts).length + ' commandes exactes · ' + VOCAB.motifs.length + ' à paramètre']);

    var avecSeq = S.filter(function (s) {
        return s && s.name && OUVRE.test(s.note || '');
    });

    var inconnues = [], horsBloc = [], malFormes = [];
    avecSeq.forEach(function (s) {
        var a = analyse(s.note);
        a.lignes.forEach(function (nom) {
            if (!reconnue(nom)) inconnues.push(s.name + ' → « ' + nom + ' »');
        });
        a.horsBloc.forEach(function (l) { horsBloc.push(s.name + ' → « ' + l + ' »'); });
        a.mal.forEach(function (l) { malFormes.push(s.name + ' → ' + l); });
    });

    r.push(['chaque commande de séquence est une que le moteur connaît',
        inconnues.length === 0,
        inconnues.length ? inconnues.slice(0, 3).join(' · ')
            : avecSeq.length + ' compétences mises en scène, toutes les lignes reconnues']);

    r.push(['aucune commande ne traîne hors d\'un bloc', horsBloc.length === 0,
        horsBloc.length ? horsBloc.slice(0, 3).join(' · ') : 'tout est dans un bloc']);

    r.push(['chaque bloc ouvert est refermé', malFormes.length === 0,
        malFormes.length ? malFormes.slice(0, 3).join(' · ') : 'aucun bloc bancal']);

    // la boucle des boss doit être VUE, pas seulement lue dans le journal
    var tele = S.filter(function (s) { return s && /<\s*Telegraphe\s*>/i.test(s.note || ''); });
    var frappes = S.filter(function (s) { return s && /<\s*Apres\s*:\s*surcharge\s*>/i.test(s.note || ''); });
    var teleNues = tele.filter(function (s) { return !OUVRE.test(s.note || ''); });
    var frappesNues = frappes.filter(function (s) { return !OUVRE.test(s.note || ''); });

    r.push(['chaque mise en garde se voit à l\'écran', teleNues.length === 0,
        tele.length + ' mises en garde · ' + teleNues.length + ' sans mise en scène']);
    r.push(['chaque frappe se voit à l\'écran', frappesNues.length === 0,
        frappes.length + ' frappes · ' + frappesNues.length + ' sans mise en scène']);

    // les sons et les animations cités doivent exister
    var sonsKo = [], aniKo = [];
    var A = monde.Animations;
    avecSeq.forEach(function (s) {
        (s.note || '').split(/\r?\n/).forEach(function (brut) {
            var l = brut.trim();
            var m = /^(?:se|sfx|sound)\s*:\s*([^,]+)/i.exec(l);
            if (m) {
                var nom = m[1].trim();
                if (!fs.existsSync(path.join(RACINE, 'audio', 'se', nom + '.ogg'))) sonsKo.push(s.name + ' → ' + nom);
            }
            var a = /^animation\s*:\s*(\d+)/i.exec(l);
            if (a && !A[parseInt(a[1], 10)]) aniKo.push(s.name + ' → animation ' + a[1]);
        });
    });
    r.push(['chaque son cité par une séquence existe', sonsKo.length === 0,
        sonsKo.length ? sonsKo.slice(0, 3).join(' · ') : 'tous les sons cités sont sur le disque']);
    r.push(['chaque animation citée existe', aniKo.length === 0,
        aniKo.length ? aniKo.slice(0, 3).join(' · ') : 'toutes les animations citées existent']);

    return r;
}

//===========================================================================
var BASE = { Skills: L('Skills'), Animations: L('Animations') };
var copie = function (o) { return JSON.parse(JSON.stringify(o)); };

var ok = 0, ko = 0;
console.log('\n1) Sur la vraie base, contre le vocabulaire des plugins');
controles(BASE).forEach(function (c) {
    if (c[1]) { ok++; console.log('   ✓ ' + c[0] + '  —  ' + c[2]); }
    else { ko++; console.log('   ✗ ' + c[0] + '  —  ' + c[2]); }
});

var SABOTAGES = [
    ['« shake screen » écrit « screen shake »', function (b) {
        var s = b.Skills.filter(function (x) { return x && /shake screen/i.test(x.note || ''); })[0];
        if (s) s.note = s.note.replace(/shake screen/i, 'screen shake');
    }, /commande de séquence est une que le moteur connaît/],
    ['une commande sortie de son bloc', function (b) {
        var s = b.Skills.filter(function (x) { return x && OUVRE.test(x.note || ''); })[0];
        if (s) s.note = 'wait: 30\n' + s.note;
    }, /hors d'un bloc/],
    // ⚠ le sabotage doit viser une compétence qui a VRAIMENT un
    // </finish action> à retirer : la première qui porte une séquence n'en a
    // pas forcément, et le contrôle passait alors à vide au lieu de tomber.
    ['un bloc jamais refermé', function (b) {
        var s = b.Skills.filter(function (x) { return x && /<\/\s*finish action\s*>/i.test(x.note || ''); })[0];
        if (s) s.note = s.note.replace(/<\/\s*finish action\s*>/i, '');
    }, /bloc ouvert est refermé/],
    ['une mise en garde privée de sa mise en scène', function (b) {
        var s = b.Skills.filter(function (x) { return x && /<\s*Telegraphe\s*>/i.test(x.note || ''); })[0];
        if (s) s.note = '<Telegraphe>';
    }, /mise en garde se voit/],
    ['un son inventé dans une séquence', function (b) {
        var s = b.Skills.filter(function (x) { return x && OUVRE.test(x.note || ''); })[0];
        if (s) s.note = s.note.replace(/se:\s*\w+/i, 'se: CeSonNExistePas');
    }, /son cité par une séquence existe/]
];

console.log('\n2) Contre-épreuve — chaque sabotage doit faire tomber SON contrôle');
SABOTAGES.forEach(function (s) {
    var b = { Skills: copie(BASE.Skills), Animations: BASE.Animations };
    s[1](b);
    var vise = controles(b).filter(function (c) { return !c[1] && s[2].test(c[0]); });
    if (vise.length) { ok++; console.log('   ✓ ' + s[0] + '  →  « ' + vise[0][0] + ' » tombe'); }
    else { ko++; console.log('   ✗ ' + s[0] + '  →  son contrôle ne tombe PAS'); }
});

console.log('\n' + '='.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('='.repeat(70));
process.exit(ko ? 1 : 0);
