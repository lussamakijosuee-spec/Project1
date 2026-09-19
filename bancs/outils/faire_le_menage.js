/*
 * ENLEVER LES PLUGINS QUI NE SERVIRONT JAMAIS
 * ---------------------------------------------------------------------------
 * JOKO : « si il y a plein de plugins qui servent à rien, enlève-les ».
 *
 * CE QUE ÇA NE FERA PAS : accélérer le jeu. Un fichier posé dans js/plugins/
 * sans être inscrit dans js/plugins.js n'est jamais chargé — il ne coûte pas
 * une milliseconde. Mesuré : 130 fichiers déposés, démarrage inchangé.
 *
 * CE QUE ÇA FERA : désencombrer la liste du gestionnaire de plugins de
 * l'éditeur, où il faut aujourd'hui faire défiler 279 lignes pour en trouver
 * une.
 *
 * CE QU'ON N'ENLÈVE PAS :
 *   · aucun plugin INSCRIT, allumé ou éteint. Une entrée de js/plugins.js
 *     porte ses réglages ; la retirer les perdrait, et n'apporte rien ;
 *   · aucun plugin qui attend seulement une décision de JOKO — les quinze
 *     écrans de menu, les invocations, les caméras, le combat redessiné.
 *     Ceux-là restent : ce sont des choix, pas des déchets.
 *
 * CE QU'ON ENLÈVE : les fichiers jamais inscrits dont on peut dire POURQUOI
 * ils ne serviront jamais dans CE jeu — et la raison est écrite à côté.
 * Tout est dans git : `git checkout HEAD~1 -- js/plugins/` les fait revenir.
 *
 *   node bancs/outils/faire_le_menage.js            (essai à blanc)
 *   node bancs/outils/faire_le_menage.js --ecrire
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var D = path.join(RACINE, 'js', 'plugins');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;

var CONDAMNES = [
    ['Ils abîmeraient le projet', [
        ['SRD_DataCompressor', 'réécrirait data/ dans un format compressé : l\'éditeur de RPG Maker et les 30 bancs de ce projet ne sauraient plus les lire'],
        ['SRD_AutoUpdater', 'appelle un serveur de mise à jour qui n\'existe pas'],
        ['SRD_PluginUpdater', 'va chercher en ligne des versions de plugins — même serveur absent'],
        ['SRD_RemoveTitleScreen', 'efface l\'écran-titre, sur lequel JOKO a monté MOG_TitleLayers, TitleParticles et TitleMagicCircles'],
        ['SRD_SkipTitleWithoutSave', 'saute ce même écran-titre dès qu\'il n\'y a pas de sauvegarde'],
        ['SRD_RemoveFadedContinue', 'retire le « Continuer » grisé — le titre de JOKO le gère déjà à sa façon']
    ]],
    ['Ils sont écrits pour l\'anglais', [
        ['SRD_TranslationEngine', 'outil de traduction multilingue ; le jeu est en français et le restera'],
        ['SRD_SpellCheck', 'correcteur orthographique à dictionnaire anglais']
    ]],
    ['Ils feraient entrer un autre jeu', [
        ['SRD_PKM_4MovesOnly', 'limiterait chaque héros à QUATRE compétences. Le jeu en compte 354'],
        ['SRD_PKM_TypeSystem', 'plaque le système de types Pokémon sur les éléments'],
        ['SRD_PKM_TypeDisplay', 'affiche ces types — sans le système, il n\'a rien à montrer'],
        ['SRD_PKM_MoveDeleter', 'écran pour oublier une compétence, pensé pour la limite de quatre'],
        ['SRD_PKM_TrainerName', 'saisie de nom façon dresseur Pokémon'],
        ['SRD_PKM_TrainerSprite', 'sprites de dresseur masculin / féminin'],
        ['SRD_Natures', 'les « natures » de Pokémon : une force et une faiblesse tirées au sort']
    ]],
    ['Il leur manque des images qui n\'existent pas', [
        ['SRD_CharacterCreator', 'réclame un dossier img/SumRndmDde/CharacterCreator de cheveux, d\'yeux et de vêtements — absent, et les héros de ce jeu ont déjà un visage'],
        ['SRD_CharacterCreatorEX', 'la version étendue du même'],
        ['SRD_CCEX_DynamicActors', 'extension du créateur de personnage'],
        ['SRD_CCEX_MessageFaces', 'extension du créateur de personnage']
    ]]
];

/* ── on ne touche à rien d'inscrit ── */
var brut = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
var liste = JSON.parse(brut.slice(brut.indexOf('['), brut.lastIndexOf(']') + 1));
var inscrits = {}; liste.forEach(function (p) { inscrits[p.name] = p; });

console.log('═'.repeat(76));
console.log('  LE MÉNAGE');
console.log('═'.repeat(76));
console.log('');
console.log('   ⚠ Ça n\'accélérera PAS le jeu : ces fichiers ne sont pas chargés, ils ne');
console.log('     coûtent rien. Ça allège la liste du gestionnaire de plugins, où il faut');
console.log('     aujourd\'hui faire défiler ' + fs.readdirSync(D).filter(function (f) { return /\.js$/.test(f); }).length + ' lignes.');
console.log('');

var aEffacer = [], refuses = [], absents = [];
CONDAMNES.forEach(function (groupe) {
    console.log('─'.repeat(76));
    console.log('  ' + groupe[0]);
    console.log('─'.repeat(76));
    groupe[1].forEach(function (c) {
        var nom = c[0], pourquoi = c[1];
        var f = path.join(D, nom + '.js');
        if (!fs.existsSync(f)) { absents.push(nom); console.log('   (déjà parti)  ' + nom); return; }
        /* ⚠ Le garde-fou qui compte : si le plugin est INSCRIT dans
         *   js/plugins.js, on n'y touche pas, même s'il est éteint. Une
         *   entrée porte ses réglages, et l'effacer casserait le démarrage
         *   si elle est allumée. */
        if (inscrits[nom]) {
            refuses.push(nom + ' (inscrit' + (inscrits[nom].status ? ' ET ALLUMÉ' : ', éteint') + ')');
            console.log('   ✘ gardé : ' + nom + ' — il est inscrit dans js/plugins.js');
            return;
        }
        var ko = Math.round(fs.statSync(f).size / 1024);
        aEffacer.push({ nom: nom, f: f, ko: ko });
        console.log('   ' + nom.padEnd(30) + String(ko).padStart(4) + ' Ko');
        console.log('        ' + pourquoi);
    });
    console.log('');
});

console.log('═'.repeat(76));
console.log('   à effacer : ' + aEffacer.length + ' fichier(s), ' +
    aEffacer.reduce(function (s, x) { return s + x.ko; }, 0) + ' Ko');
if (refuses.length) { console.log('   gardés car inscrits : ' + refuses.join(' · ')); }
if (absents.length) { console.log('   déjà absents : ' + absents.length); }
console.log('');
console.log('   CE QUI RESTE, ET POURQUOI :');
var restants = fs.readdirSync(D).filter(function (f) { return /\.js$/.test(f); })
    .map(function (f) { return f.replace(/\.js$/, ''); })
    .filter(function (n) { return !inscrits[n] && !aEffacer.some(function (x) { return x.nom === n; }); });
console.log('   ' + restants.length + ' fichier(s) non inscrits sont GARDÉS : ce sont des choix en attente');
console.log('   (les quinze écrans de menu, les invocations, les caméras, le combat');
console.log('   redessiné, l\'écran-titre). Aucun n\'est du déchet — ils attendent un mot.');
console.log('═'.repeat(76));

if (!ECRIRE) {
    console.log('\n  (essai à blanc — rien n\'a été touché. Ajoute --ecrire.)');
    process.exit(0);
}
if (!aEffacer.length) { console.log('\n  rien à faire.'); process.exit(0); }

aEffacer.forEach(function (x) { fs.unlinkSync(x.f); });
console.log('\n  ✔ ' + aEffacer.length + ' fichier(s) effacé(s).');
console.log('    Ils sont dans git : « git checkout HEAD -- js/plugins/ » avant de committer,');
console.log('    ou « git checkout <commit précédent> -- js/plugins/ » après.');
console.log('═'.repeat(76));
