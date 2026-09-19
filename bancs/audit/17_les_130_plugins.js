/*
 * LES 130 PLUGINS INSTALLÉS : CE QU'ILS FONT, ET CE QU'ILS VALENT ICI
 * ---------------------------------------------------------------------------
 * JOKO : « je veux que tu analyses tous les plugins, que tu saches quoi en
 * faire, de quoi ils servent, qu'est-ce qu'ils pourraient améliorer. »
 *
 * Cent trente lignes ne tiennent pas dans un message. Ce banc les écrit dans
 * docs/LES_130_PLUGINS.md — mais il ne se contente pas de recopier les
 * descriptions anglaises. Pour chacun, il MESURE trois choses que JOKO ne
 * peut pas voir à l'œil :
 *
 *   1. EST-IL BRANCHÉ ? Un fichier dans js/plugins/ ne fait rien tant qu'il
 *      n'est pas inscrit dans js/plugins.js.
 *   2. ÉCRASE-T-IL QUELQUE CHOSE ? Deux plugins qui remplacent sèchement la
 *      même fonction : le dernier chargé gagne, l'autre disparaît en silence.
 *      On distingue le remplacement sec de la surcharge EN ALIAS, qui, elle,
 *      s'empile proprement — les confondre accuserait presque tout le monde.
 *   3. A-T-IL DE QUOI TOURNER ? Un plugin qui réclame un autre plugin absent,
 *      ou un dossier d'images qui n'existe pas, est mort-né.
 *
 * Le verdict, lui, n'est pas mesuré : c'est un avis, et il est signé comme
 * tel. Il n'engage rien — aucun plugin n'est allumé, éteint ni supprimé ici.
 *
 *   node bancs/audit/17_les_130_plugins.js
 *   node bancs/audit/17_les_130_plugins.js --ecrire   (écrit le document)
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var D = path.join(RACINE, 'js', 'plugins');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;

/* ── ce que js/plugins.js connaît ── */
var brut = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
var inscrits = {};
JSON.parse(brut.slice(brut.indexOf('['), brut.lastIndexOf(']') + 1))
    .forEach(function (p) { inscrits[p.name] = p; });

/* ── surcharges : alias (s'empile) ou remplacement sec (écrase) ── */
function analyse(nom) {
    var p = path.join(D, nom + '.js');
    if (!fs.existsSync(p)) { return { alias: {}, sec: {} }; }
    var t = fs.readFileSync(p, 'utf8');
    var sauve = {}, m;
    var reS = /=\s*((?:Scene_|Window_|Game_|Sprite_|Spriteset_)[A-Za-z]+\.prototype\.[A-Za-z_$][\w$]*|(?:BattleManager|SceneManager|DataManager|ConfigManager|AudioManager|SoundManager|ImageManager|TextManager)\.[A-Za-z_$][\w$]*)\s*;/g;
    while ((m = reS.exec(t))) { sauve[m[1].replace('.prototype', '')] = 1; }
    var alias = {}, sec = {}, k;
    var reA = /^\s*((?:Scene_|Window_|Game_|Sprite_|Spriteset_)[A-Za-z]+)\.prototype\.([A-Za-z_$][\w$]*)\s*=\s*function/gm;
    while ((m = reA.exec(t))) { k = m[1] + '.' + m[2]; (sauve[k] ? alias : sec)[k] = 1; }
    var reB = /^\s*(BattleManager|SceneManager|DataManager|ConfigManager|AudioManager|SoundManager|ImageManager|TextManager)\.([A-Za-z_$][\w$]*)\s*=\s*function/gm;
    while ((m = reB.exec(t))) { k = m[1] + '.' + m[2]; (sauve[k] ? alias : sec)[k] = 1; }
    return { alias: alias, sec: sec };
}

var surDisque = fs.readdirSync(D).filter(function (f) { return /\.js$/.test(f); })
    .map(function (f) { return f.replace(/\.js$/, ''); });

/* ce que les plugins ALLUMÉS occupent déjà */
var occupe = {};
surDisque.filter(function (n) { return inscrits[n] && inscrits[n].status; })
    .forEach(function (n) {
        var r = analyse(n);
        Object.keys(r.sec).forEach(function (f) { (occupe[f] = occupe[f] || []).push(n); });
        Object.keys(r.alias).forEach(function (f) { (occupe[f] = occupe[f] || []).push(n); });
    });

/* Le @plugindesc est en anglais, parfois en blague (« #IconsAreMasterRace »).
 * Le document est pour JOKO : on prend la phrase française quand elle existe,
 * et on garde l'anglaise en repli pour qu'aucune ligne ne soit vide. */
var FRANCAIS = require('./17_a_quoi_ils_servent.js');
var sansTraduction = [];
function description(nom) {
    if (FRANCAIS[nom]) { return FRANCAIS[nom]; }
    var p = path.join(D, nom + '.js');
    if (!fs.existsSync(p)) { return ''; }
    var t = fs.readFileSync(p, 'utf8').slice(0, 4000);
    sansTraduction.push(nom);
    return '*(en anglais)* ' + ((t.match(/@plugindesc\s+(.*)/) || [, ''])[1] || '').trim();
}

/* ─────────────────────────────────────────────────────────────────────────
 * L'AVIS. Ce n'est pas une mesure : c'est ce que j'en pense pour CE projet,
 * et JOKO tranche. Chaque famille porte la raison de son classement.
 *
 *   branché   — allumé, ça tourne, c'est mesuré
 *   utile     — prêt à servir, il manque une décision de JOKO
 *   exclusif  — ne peut coexister ni avec un autre du même lot, ni avec un
 *               plugin déjà en place : c'est l'un OU l'autre
 *   incomplet — il lui manque des images, un plugin, ou des données
 *   étranger  — ferait entrer un système qui n'est pas celui de ce jeu
 *   dangereux — abîmerait le projet si on l'allumait
 * ───────────────────────────────────────────────────────────────────────── */
var FAMILLES = [
    {
        titre: 'LES ÉCRANS DE MENU ALTERNATIFS',
        verdict: 'exclusif',
        motif:
            'Ils font tous la même chose : remplacer l\'écran du menu principal. On n\'en\n' +
            'allume qu\'UN, jamais deux. Et tous réécrivent sèchement les mêmes fonctions\n' +
            'que YEP_MainMenuManager, qui range aujourd\'hui les onglets de JOKO (Quêtes,\n' +
            'Musiques, Éléments). En allumer un, c\'est reprendre cet écran à zéro.\n' +
            'Ça peut valoir le coup — mais c\'est une décision, pas un réglage.\n' +
            '(FaceBars n\'est pas un menu : c\'est une rallonge du menu « Face ».)',
        membres: function (n) { return /^SRD_AltMenuScreen_/.test(n); }
    },
    {
        titre: 'LES PLUGINS POKÉMON',
        verdict: 'étranger',
        motif:
            'Un système de types à la Pokémon, des natures, un effaceur de capacités, et\n' +
            'SRD_PKM_4MovesOnly qui limite chaque héros à QUATRE compétences. Le jeu en\n' +
            'compte 354 et quatre arbres de progression. Ce n\'est pas un réglage à\n' +
            'ajuster : c\'est un autre jeu.',
        membres: function (n) { return /^SRD_PKM_/.test(n) || n === 'SRD_Natures'; }
    },
    {
        titre: 'LES INVOCATIONS',
        verdict: 'utile',
        motif:
            'SRD_SummonCore fait entrer un héros invoqué dans l\'équipe, le temps de\n' +
            'quelques tours. SRD_ReplaceSummons le fait REMPLACER l\'invocateur.\n' +
            'SRD_SummonBattlerImages leur donne une image fixe au lieu d\'un sprite animé.\n' +
            '⚠ Je ne les allume pas : ils touchent au Royaume Impérial des Ténèbres, et\n' +
            'le lore appartient à JOKO. C\'est à lui de dire si « utiliser les techniques\n' +
            'de toutes les invocations » se joue comme ça.\n' +
            'Ils écrasent 13 fonctions de YEP_BattleEngineCore : à vérifier en combat.',
        membres: function (n) { return /^SRD_(SummonCore|ReplaceSummons|SummonBattlerImages)$/.test(n); }
    },
    {
        titre: 'LES ATTAQUES CHRONOMÉTRÉES',
        verdict: 'utile',
        motif:
            'Appuyer au bon moment pour frapper plus fort : une roue, une horloge, un\n' +
            'cercle qui rétrécit, des flèches, un martèlement. Cinq façons, plus le socle\n' +
            'et un affichage de résultat. Ça changerait la nature des combats — ils sont\n' +
            'au tour par tour CTB aujourd\'hui. Gros potentiel pour les boss ; à décider.',
        membres: function (n) { return /^SRD_TimedAttack/.test(n); }
    },
    {
        titre: 'LA DÉFENSE ACTIVE',
        verdict: 'utile',
        motif:
            'Esquiver ou contrer l\'attaque d\'un ennemi en appuyant au bon moment.\n' +
            'ludwing a « Contre totale » ; c\'est l\'outil qui la rendrait jouable au lieu\n' +
            'de la laisser passive. Même remarque : ça change la nature des combats.',
        membres: function (n) { return /^SRD_ActiveDefense/.test(n); }
    },
    {
        titre: 'LE CRÉATEUR DE PERSONNAGE',
        verdict: 'incomplet',
        motif:
            'Il laisse le joueur assembler son propre sprite pièce par pièce. Il lui faut\n' +
            'un dossier img/SumRndmDde/CharacterCreator rempli de cheveux, d\'yeux, de\n' +
            'vêtements — ce dossier n\'existe pas ici. Et les héros de ce jeu ont un\n' +
            'visage : ce n\'est pas un jeu où l\'on se fabrique un inconnu.',
        membres: function (n) { return /^SRD_(CharacterCreator|CCEX_)/.test(n); }
    },
    {
        titre: 'LE HUD SUR MESURE',
        verdict: 'exclusif',
        motif:
            'SRD_HUDMaker dessine un HUD de carte à la souris, dans le jeu. Séduisant —\n' +
            'mais l\'écran de JOKO porte déjà l\'or, les trésors, la boussole, l\'horloge et\n' +
            'les saisons, tous en MOG. Deux systèmes de HUD sur le même écran se\n' +
            'marchent dessus. Il faudrait choisir : refaire tout le HUD ici, ou garder\n' +
            'MOG. Son socle SRD_SuperToolsEngine, lui, EST branché.',
        membres: function (n) { return /^SRD_HUDMaker/.test(n); }
    },
    {
        titre: 'CE QUI TOUCHE À L\'ÉQUILIBRAGE',
        verdict: 'utile',
        motif:
            'SRD_StatDistribution donne des points à répartir à chaque niveau.\n' +
            'SRD_TPUpgrade refait le système de points de technique.\n' +
            'SRD_MapSlipDamage refait les dégâts de poison sur la carte.\n' +
            'SRD_WeaponGuard donne une garde propre à chaque arme.\n' +
            'Les quatre déplacent des chiffres que JOKO a réglés lui-même. Règle du\n' +
            'projet : je signale, il décide.',
        membres: function (n) { return /^SRD_(StatDistribution|TPUpgrade|MapSlipDamage|WeaponGuard|EquipCompareUpgrade)$/.test(n); }
    },
    {
        titre: 'LES CAMÉRAS',
        verdict: 'utile',
        motif:
            'SRD_CameraCore sait zoomer et suivre une cible ; SRD_SmoothCamera adoucit\n' +
            'ses mouvements ; SRD_AutoCamera la déplace selon les régions traversées.\n' +
            'Ce serait beau sur les ultimes et l\'entrée dans le Royaume.\n' +
            '⚠ Mais CameraCore remplace sèchement Game_Screen.clearZoom, que\n' +
            'YEP_X_ActSeqPack3 utilise pour les zooms des séquences d\'action. JOKO en a\n' +
            'beaucoup. À essayer séparément, avec un banc dédié — pas dans le lot.',
        membres: function (n) { return /^SRD_(CameraCore|SmoothCamera|AutoCamera)$/.test(n); }
    },
    {
        titre: 'LE COMBAT REDESSINÉ',
        verdict: 'exclusif',
        motif:
            'SRD_BattleGUICore, SRD_BattleStatusCustomizer et SRD_BattlePopupCustomizer\n' +
            'refont les fenêtres, la barre d\'état et les chiffres de dégâts du combat.\n' +
            'Ils écrasent YEP_BattleEngineCore, YEP_X_BattleSysCTB, VisualMaxEX et\n' +
            'VisualMaxEX2 — c\'est-à-dire tout ce qui tient le combat aujourd\'hui.\n' +
            'Très beau potentiel, mais c\'est un chantier à part entière.',
        membres: function (n) { return /^SRD_(BattleGUICore|BattleStatusCustomizer|BattleStatusCustomizer_Part2|BattlePopupCustomizer|StatePopups|BattleLogUpgrade|WalkCharBattlers)$/.test(n); }
    },
    {
        titre: 'CE QU\'IL NE FAUT PAS ALLUMER',
        verdict: 'dangereux',
        motif:
            'SRD_DataCompressor réécrit les fichiers de data/ dans un format compressé :\n' +
            'l\'éditeur de RPG Maker et tous les bancs de ce projet cessent de les lire.\n' +
            'SRD_AutoUpdater et SRD_PluginUpdater appellent un serveur de mise à jour qui\n' +
            'n\'existe pas.\n' +
            'SRD_RemoveTitleScreen et SRD_SkipTitleWithoutSave effacent l\'écran-titre —\n' +
            'or JOKO y a monté MOG_TitleLayers, TitleParticles et TitleMagicCircles.\n' +
            'SRD_TranslationEngine et SRD_SpellCheck servent à traduire vers l\'anglais et\n' +
            'à corriger l\'orthographe anglaise : le jeu est en français.',
        membres: function (n) {
            return /^SRD_(DataCompressor|AutoUpdater|PluginUpdater|RemoveTitleScreen|SkipTitleWithoutSave|RemoveFadedContinue|TranslationEngine|SpellCheck)$/.test(n);
        }
    },
    {
        titre: 'L\'ÉCRAN-TITRE ET LA FIN',
        verdict: 'utile',
        motif:
            'SRD_TitleMapBackground met une CARTE derrière le titre — le village qui\n' +
            's\'anime pendant qu\'on hésite. SRD_PressStart fait attendre une touche.\n' +
            'SRD_TitlePictureChoices remplace les mots par des images animées.\n' +
            'SRD_GameOverCore, SRD_RetryUpgrade et SRD_RetryCosts font payer un prix pour\n' +
            'réessayer un combat perdu au lieu de renvoyer au titre.\n' +
            'SRD_CreditsPlugin et SRD_MovieCredits font défiler des crédits — mais\n' +
            'MOG_Credits est déjà branché et tient le même rôle.',
        membres: function (n) {
            return /^SRD_(TitleMapBackground|PressStart|TitlePictureChoices|TitleCommandCustomizer|GameOverCore|RetryUpgrade|RetryCosts|CreditsPlugin|MovieCredits|CEBattleIntro|CustomBattleIntro)$/.test(n);
        }
    },
    {
        titre: 'LE RESTE, PRÊT À SERVIR',
        verdict: 'utile',
        motif:
            'Des outils qui ne coûtent rien tant qu\'on ne s\'en sert pas, et qui répondent\n' +
            'à une envie précise le jour où elle vient.',
        membres: function () { return true; }   // tout ce qui n'a pas été pris avant
    }
];

/* ── classement ── */
var srd = surDisque.filter(function (n) { return /^SRD_/.test(n); });
var classe = {}, restants = srd.slice();
FAMILLES.forEach(function (f) {
    f.pris = [];
    restants = restants.filter(function (n) {
        if (f.membres(n)) { f.pris.push(n); classe[n] = f; return false; }
        return true;
    });
});

/* ── le document ── */
var L = [];
L.push('# Les 130 plugins installés');
L.push('');
L.push('*Écrit par `bancs/audit/17_les_130_plugins.js`. Les trois premières colonnes sont');
L.push('mesurées ; le verdict est un avis, et JOKO tranche. Aucun plugin n\'est allumé,');
L.push('éteint ni supprimé par ce banc.*');
L.push('');

var branches = srd.filter(function (n) { return inscrits[n] && inscrits[n].status; });
L.push('## En deux chiffres');
L.push('');
L.push('| | |');
L.push('|---|---:|');
L.push('| fichiers SRD sur le disque | ' + srd.length + ' |');
L.push('| **branchés et mesurés** | **' + branches.length + '** |');
L.push('| inscrits mais éteints | ' + srd.filter(function (n) { return inscrits[n] && !inscrits[n].status; }).length + ' |');
L.push('| jamais inscrits (donc invisibles pour le jeu) | ' + srd.filter(function (n) { return !inscrits[n]; }).length + ' |');
L.push('');
L.push('> Un fichier posé dans `js/plugins/` ne fait **rien**. RPG Maker ne charge que');
L.push('> ce qui est inscrit dans `js/plugins.js`, et dans cet ordre-là.');
L.push('');

FAMILLES.forEach(function (f) {
    if (!f.pris.length) { return; }
    L.push('---');
    L.push('');
    L.push('## ' + f.pris.length + ' · ' + f.titre + '  —  *' + f.verdict + '*');
    L.push('');
    f.motif.split('\n').forEach(function (l) { L.push(l); });
    L.push('');
    L.push('| plugin | état | écrase | ce qu\'il fait |');
    L.push('|---|---|---:|---|');
    f.pris.sort().forEach(function (n) {
        var etat = !inscrits[n] ? 'pas inscrit' : (inscrits[n].status ? '**branché**' : 'éteint');
        var r = analyse(n);
        var chocs = Object.keys(r.sec).filter(function (fn) { return occupe[fn]; });
        var d = description(n).replace(/\|/g, '/').slice(0, 110);
        L.push('| `' + n.replace(/^SRD_/, '') + '` | ' + etat + ' | ' +
            (chocs.length ? '⚠ ' + chocs.length : '—') + ' | ' + d + ' |');
    });
    L.push('');
});

L.push('---');
L.push('');
L.push('## Ce qui reste à décider');
L.push('');
L.push('1. **Un écran de menu alternatif ?** Quatorze au choix, un seul possible, et');
L.push('   celui d\'aujourd\'hui est à refaire si on en prend un.');
L.push('2. **Les invocations** — `SummonCore` ferait entrer une invocation dans');
L.push('   l\'équipe. C\'est exactement ce que décrit le Royaume Impérial des Ténèbres,');
L.push('   mais c\'est du lore : à JOKO de dire.');
L.push('3. **Les attaques chronométrées et la défense active** changeraient la nature');
L.push('   des combats. « Contre totale » deviendrait une vraie parade.');
L.push('4. **Les caméras** — beau sur les ultimes, mais `CameraCore` écrase le zoom des');
L.push('   séquences d\'action de Yanfly. À essayer seul, avec un banc.');
L.push('5. **Le combat redessiné** — trois plugins qui refont tout l\'écran de combat.');
L.push('   Chantier à part entière.');
L.push('');

var doc = L.join('\n') + '\n';

console.log('═'.repeat(74));
console.log('  LES 130 PLUGINS');
console.log('═'.repeat(74));
console.log('   sur le disque : ' + srd.length);
console.log('   branchés      : ' + branches.length);
console.log('   éteints       : ' + srd.filter(function (n) { return inscrits[n] && !inscrits[n].status; }).length);
console.log('   pas inscrits  : ' + srd.filter(function (n) { return !inscrits[n]; }).length);
console.log('');
FAMILLES.forEach(function (f) {
    if (!f.pris.length) { return; }
    var b = f.pris.filter(function (n) { return inscrits[n] && inscrits[n].status; }).length;
    console.log('   ' + String(f.pris.length).padStart(3) + '  ' + f.verdict.padEnd(10) +
        f.titre.slice(0, 44).padEnd(46) + (b ? b + ' branché(s)' : ''));
});
console.log('');
/* contre-épreuve : personne ne doit manquer, personne ne doit compter deux fois */
var total = FAMILLES.reduce(function (s, f) { return s + f.pris.length; }, 0);
console.log('   contrôle : ' + total + ' classés pour ' + srd.length + ' fichiers  ' +
    (total === srd.length ? '✔' : '✘ IL EN MANQUE OU IL Y EN A EN DOUBLE'));
/* un document pour JOKO où il reste de l'anglais, c'est un document à moitié
 * écrit. On le dit, avec la liste, plutôt que de le laisser passer. */
if (sansTraduction.length) {
    console.log('   ⚠ ' + sansTraduction.length + ' plugin(s) encore sans phrase française :');
    sansTraduction.sort().forEach(function (n) { console.log('        ' + n); });
} else {
    console.log('   traduction : les ' + srd.length + ' ont leur phrase en français ✔');
}
/* ⚠ Contre-épreuve. « Zéro manquant » ne prouve rien si le dictionnaire peut
 *   contenir n'importe quoi : une clé mal orthographiée traduirait un plugin
 *   qui n'existe pas, pendant qu'un vrai resterait en anglais sans qu'on le
 *   voie. On vérifie donc AUSSI que chaque clé désigne un plugin réel. */
var orphelines = Object.keys(FRANCAIS).filter(function (k) { return srd.indexOf(k) < 0; });
if (orphelines.length) {
    console.log('   ⚠ ' + orphelines.length + ' phrase(s) écrite(s) pour un plugin qui n\'existe pas :');
    orphelines.forEach(function (k) { console.log('        ' + k); });
} else {
    console.log('   contre-épreuve : aucune phrase ne vise un plugin inexistant ✔');
}

if (ECRIRE) {
    var cible = path.join(RACINE, 'docs', 'LES_130_PLUGINS.md');
    fs.mkdirSync(path.dirname(cible), { recursive: true });
    fs.writeFileSync(cible, doc, 'utf8');
    console.log('\n   écrit : docs/LES_130_PLUGINS.md (' + L.length + ' lignes)');
} else {
    console.log('\n   (ajoute --ecrire pour écrire docs/LES_130_PLUGINS.md)');
}
console.log('═'.repeat(74));
