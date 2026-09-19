/*
 * BRANCHER LES PLUGINS QUI DORMENT SUR LE DISQUE
 * ---------------------------------------------------------------------------
 * JOKO a déposé 130 fichiers dans js/plugins/. Un fichier posé là ne fait
 * RIEN : RPG Maker ne charge que ce qui est inscrit dans js/plugins.js, et
 * dans l'ordre où c'est inscrit. Les 130 étaient donc invisibles pour le jeu.
 *
 * Cet outil les inscrit — mais pas n'importe lesquels et pas n'importe où :
 *
 *   · L'ORDRE COMPTE. Deux plugins qui réécrivent la même fonction : le
 *     dernier chargé gagne. C'est pour ça que tout arrive APRÈS les YEP et
 *     les MOG déjà en place, et qu'un plugin socle passe avant ceux qui en
 *     dépendent.
 *   · LES RÉGLAGES SONT EN FRANÇAIS. Un plugin livré avec « Loading… » et
 *     « Are you sure you want to quit? » afficherait de l'anglais dans un jeu
 *     français. Les textes visibles sont traduits ici.
 *   · RIEN N'EST SUPPRIMÉ. On ajoute des lignes à la fin de js/plugins.js ;
 *     l'existant n'est pas touché, pas réordonné, pas réécrit.
 *
 *   node bancs/outils/brancher_plugins.js              (essai à blanc)
 *   node bancs/outils/brancher_plugins.js --ecrire     (pour de vrai)
 *   node bancs/outils/brancher_plugins.js --eteindre   (tout remettre à false)
 *   node bancs/outils/brancher_plugins.js --retirer    (retirer les lignes ajoutées)
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var CIBLE = path.join(RACINE, 'js', 'plugins.js');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var ETEINDRE = process.argv.indexOf('--eteindre') >= 0;
var RETIRER = process.argv.indexOf('--retirer') >= 0;

/* ─────────────────────────────────────────────────────────────────────────
 * CE QU'ON BRANCHE, DANS L'ORDRE DE CHARGEMENT
 *
 * Chaque entrée : le nom du fichier, ce qu'il apporte au jeu de JOKO, et
 * ses réglages. Un réglage absent = le défaut du plugin.
 * ───────────────────────────────────────────────────────────────────────── */
var SECTIONS = [

    ['▬▬▬ ⑮ SRD · socle et confort ▬▬▬', [
        ['SRD_GameUpgrade',
            'Le socle de huit autres plugins SRD. Seul, il ajoute le contrôle de la fenêtre du jeu.',
            {}],
        ['SRD_PreloaderCore',
            'Charge les sons et les images AVANT que le jeu en ait besoin. C\'est le remède au petit gel quand une musique ou un décor apparaît pour la première fois : 70 images et 3 musiques de plus tirées au démarrage.',
            {
                'Loading Text': 'Chargement %1',
                'Complete Text': 'Prêt !',
                // mesuré : les fondus coûtent 410 ms et ne montrent qu'un
                // écran de chargement qui clignote. Sans eux, 3615 ms au lieu
                // de 4025. (Départ sans préchargeur : 1527 ms.)
                'Use Fade Transitions': 'false',
                'Gauge Main Color': 'rgba(150, 40, 200, 0.6)',
                /* ⚠ SON CACHE AUDIO CASSE LE COMBAT. Mesuré : avec le défaut
                 *   « bgm, bgs, me », lancer un combat meurt dans
                 *   Irina_AntiAudioDelay.playBattleBgm et on reste sur la
                 *   carte. Vidé, le combat s'ouvre — et les 102 images sont
                 *   préchargées pareil, pour le même temps de démarrage.
                 *   Le préchargement des musiques, lui, reste : c'est
                 *   « Preload BGM/ME », une autre affaire que le cache. */
                'Cache Audio': ''
                // ⚠ NE JAMAIS mettre « Preload BGM » sur « all » : mesuré,
                //   le jeu n'atteint plus son titre du tout (> 60 s).
            }],
        ['SRD_OptionsUpgrade',
            'Range les options en catégories au lieu d\'une seule liste qui déborde. JOKO en a beaucoup : clavier, tuiles animées, images par seconde.',
            {
                'Categories': 'Général, Son, Fenêtre',
                'Default Category': 'Général',
                'Reset Option Name': 'Tout remettre à zéro',
                'Category Window Cols': '4',
                /* ⚠ Renommer les catégories en français ne suffit PAS : chaque
                 *   option porte le nom de SA catégorie, en anglais. Mesuré —
                 *   avec les seules catégories traduites, six options
                 *   disparaissent de l'écran (course auto, se rappeler, et les
                 *   quatre volumes) : elles pointaient vers « General » et
                 *   « Volume » qui n'existaient plus. Il faut déplacer chaque
                 *   option nommément. */
                'Option 1 Category': 'Général',
                'Option 1 Description': 'Allumé, on court tout seul ; éteint, il faut tenir MAJ.',
                'Option 2 Category': 'Général',
                'Option 2 Description': 'Allumé, le curseur de combat retient où il en était.',
                'Option 3 Category': 'Son',
                'Option 3 Description': 'Le volume de la musique de fond.',
                'Option 4 Category': 'Son',
                'Option 4 Description': 'Le volume des sons d\'ambiance.',
                'Option 5 Category': 'Son',
                'Option 5 Description': 'Le volume des jingles (victoire, trésor).',
                'Option 6 Category': 'Son',
                'Option 6 Description': 'Le volume des bruitages.',
                'Option 7 Category': 'Fenêtre',
                'Option 8 Category': 'Fenêtre',
                'Option 9 Category': 'Fenêtre',
                'Option 10 Category': 'Fenêtre',
                'Option 11 Category': 'Fenêtre',
                'Option 11 Description': 'Passer du plein écran à la fenêtre.',
                // le volume général de SRD_MasterVolume, à côté des autres volumes
                'Option 12 Symbol': 'masterVolume',
                'Option 12 Category': 'Son',
                'Option 12 Description': 'Le volume de tout le jeu, au-dessus des autres.',
                'Window Red Text': 'Fenêtre · rouge',
                'Window Green Text': 'Fenêtre · vert',
                'Window Blue Text': 'Fenêtre · bleu'
            }],
        ['SRD_MasterVolume',
            'Un volume général, au-dessus de la musique et des bruitages. Il manquait.',
            { 'Option Name': 'Volume général' }],
        ['SRD_FullscreenToggleOption',
            'Le plein écran depuis les options, sans avoir à connaître F4.',
            { 'Option Name': 'Plein écran' }],
        ['SRD_QuitConfirmation',
            'Demande confirmation avant de quitter, et propose de sauvegarder. Évite de perdre une partie sur une fausse manœuvre.',
            {
                'Window Message': '"Quitter le jeu ?"',
                // les trois choix vivent dans un sous-objet, pas à la racine
                'Choice Names': '{"Yes Text":"Quitter","No Text":"Rester","Save Text":"Sauvegarder"}',
                'Disabled Scenes': '["Scene_Title"]'
            }],
    ]],

    ['▬▬▬ ⑯ SRD · les fenêtres et le texte ▬▬▬', [
        ['SRD_WindowFrameAntiStretch',
            'Le cadre des fenêtres se répète au lieu de s\'étirer. Sur une fenêtre large, le motif ne bave plus.',
            {}],
        ['SRD_WindowLayers',
            'Chaque fenêtre sur son propre plan. Avec autant de HUD à l\'écran (or, trésor, boussole, horloge), c\'est ce qui empêche une fenêtre de passer sous une autre.',
            {}],
        ['SRD_MenuBackgrounds',
            'Un fond et une transparence réglables pour chaque menu, au lieu de la carte floutée par défaut.',
            {}],
        ['SRD_CustomColors',
            'Les couleurs du texte (PV bas, PM, états, paramètres) réglables sans repeindre Window.png.',
            {}],
        ['SRD_IndividualSkinsForWindows',
            'Une apparence de fenêtre différente par menu. De quoi distinguer le combat du journal de quêtes.',
            {}],
        ['SRD_GoldWindowCustomizer',
            'La fenêtre d\'or : ce qu\'elle montre, où, et sous quelle forme.',
            {}],
        ['SRD_InMenuUsageUpgrade',
            'Quand on utilise un objet ou une compétence depuis le menu, la fenêtre de choix devient réglable.',
            {}],
        ['SRD_ShakingText',
            'Du texte qui tremble dans les boîtes de dialogue : \\shake[n]. Pour une voix qui craque, une menace, un boss qui parle.',
            {}],
        ['SRD_BlinkingFaces',
            'Les visages clignent des yeux pendant les dialogues. Éteint par défaut : il faut préparer les planches de visages.',
            { 'Use Default Blinking': 'false' }],
        ['SRD_AutoNameBox',
            'La boîte de nom se remplit toute seule d\'après le visage utilisé. Inerte tant qu\'aucune correspondance n\'est réglée.',
            {}],
    ]],

    ['▬▬▬ ⑰ SRD · le son, le temps, la mise en scène ▬▬▬', [
        ['SRD_AudioFader',
            'Les musiques montent et descendent en douceur au lieu de se couper net. Le Pari Mortel coupe et rend la musique : ça s\'entendra.',
            {}],
        ['SRD_TimerUpgrade',
            'Le chronomètre du jeu : sa position, son format, sa couleur, et surtout s\'il se met en pause tout seul. Le Pari Mortel compte une minute de temps réel — c\'est lui qui peut la montrer.',
            {
                'Timer Position': 'TOP',
                'Use Background': 'true',
                'Pause Color': '#FFFF00'
            }],
        ['SRD_BattleEndEvents',
            'Un événement commun à la fin d\'un combat, différent selon qu\'on a gagné, perdu ou fui.',
            {}],
        ['SRD_BattleBackScroll',
            'Les deux décors de combat peuvent défiler. Un ciel qui bouge derrière un boss, ça vit.',
            {}],
        ['SRD_WaitOptions',
            'Attendre autrement que par un nombre d\'images : jusqu\'à une touche, jusqu\'à la fin d\'un son, jusqu\'à une condition.',
            {}],
        ['SRD_VideoWait',
            'L\'événement attend tout seul la fin d\'une vidéo, au lieu de compter les images à la main.',
            {}],
    ]],

    ['▬▬▬ ⑱ SRD · des outils pour les événements ▬▬▬', [
        ['SRD_PluginComEvals',
            'Du JavaScript directement dans une commande de plugin. Une commande peut enfin lire une variable au lieu d\'un nombre écrit en dur.',
            {}],
        ['SRD_VariableRates',
            'Une variable qui monte ou descend toute seule dans le temps. De quoi faire une jauge qui se remplit sans événement parallèle.',
            {}],
        ['SRD_CollisionChecker',
            'Demander au jeu si une case est libre, depuis un événement. Utile pour poser quelque chose sans le poser dans un mur.',
            {}],
        ['SRD_RestrictMovementDirections',
            'Interdire une direction sous condition. Un couloir à sens unique, une falaise qu\'on ne remonte pas.',
            {}],
        ['SRD_RandomEncounterSwitches',
            'Couper ou rétablir les rencontres aléatoires par interrupteur, carte par carte.',
            {}],
        ['SRD_SequenceInput',
            'Lire une touche du joueur PENDANT une séquence d\'action Yanfly. C\'est la brique d\'un contre au bon moment.',
            {}],
        ['SRD_RepeatUpgrade',
            'Le « répéter » d\'une compétence devient réglable : intervalle, cible qui change, dégâts qui montent.',
            {}],
        ['SRD_ActorSelect',
            'Un écran pour choisir un héros depuis un événement. Pour « qui entre dans le Royaume ? ».',
            {}],
        ['SRD_PictureChoices',
            'Un choix par images au lieu de mots. Des portraits, des cartes, des symboles.',
            {}],
        ['SRD_SellShop',
            'Une boutique de rachat, avec des prix propres à elle.',
            {}],
        ['SRD_SwitchShop',
            'Une boutique qui vend des interrupteurs : un service, un passage, une information.',
            {}],
        ['SRD_NameInputUpgrade',
            'L\'écran de saisie de nom, en mieux : clavier, majuscules, longueur.',
            {}],
        ['SRD_MetronomeSkill',
            'Une compétence qui en déclenche une autre au hasard. Inerte tant qu\'aucune compétence ne porte la balise.',
            {}],
        ['SRD_SwipeInput',
            'Lire un glissement de doigt ou de souris. Pour une manœuvre qui se dessine.',
            {}],
    ]],

    ['▬▬▬ ⑲ SRD · les outils de JOKO (pas du joueur) ▬▬▬', [
        ['SRD_SuperToolsEngine',
            'Un éditeur dans le jeu, en mode test. C\'est aussi le socle du HUD Maker. Ne fait rien dans le jeu livré.',
            {}],
        ['SRD_Debug_SpeedUp',
            'Accélérer le jeu pendant un test, pour ne pas traverser le village à pied à chaque essai.',
            {}],
    ]],
];

/* ─────────────────────────────────────────────────────────────────────────
 * LES VALEURS PAR DÉFAUT, LUES DANS L'EN-TÊTE DU PLUGIN
 *
 * ⚠ Piège qui m'a coûté un démarrage entier. Inscrire un plugin avec
 *   « parameters: {} » n'est PAS la même chose que de l'inscrire depuis
 *   l'éditeur : l'éditeur y recopie toutes les valeurs @default. Un plugin
 *   qui fait
 *        params['Decrypter Ignore List'].forEach(…)
 *   compte là-dessus. Avec un objet vide il lit « undefined » et casse —
 *   et comme MV n'arrête pas le chargement pour autant, la panne remonte
 *   plus tard, ailleurs, sous un autre nom. C'est exactement ce qui a fait
 *   croire à une querelle entre GameUpgrade et PreloaderCore.
 *
 * On ne lit QUE le premier bloc de commentaire « /*: … ». Les blocs
 * « ~struct~ » qui suivent décrivent des sous-objets et ont leurs propres
 * @param : les mêler donnerait des réglages fantômes.
 * ───────────────────────────────────────────────────────────────────────── */
function defauts(nom) {
    var t = fs.readFileSync(path.join(RACINE, 'js', 'plugins', nom + '.js'), 'utf8');
    var debutBloc = t.indexOf('/*:');
    if (debutBloc < 0) { return {}; }
    var finBloc = t.indexOf('*/', debutBloc);
    var bloc = t.slice(debutBloc, finBloc < 0 ? t.length : finBloc);
    // le @help est de la prose : ce qui y ressemble à un @param n'en est pas un
    var help = bloc.search(/^\s*\*\s*@help\b/m);
    if (help > 0) { bloc = bloc.slice(0, help); }

    /* ⚠ Deuxième piège : @default n'est pas la dernière balise d'un @param.
     *   L'ordre courant est @param · @type · @dir · @desc · @default · @parent.
     *   Une première version oubliait la valeur dès qu'une balise suivait
     *   @default, et rendait « » là où l'en-tête disait ["system/Window.png"].
     *   On retient donc la VALEUR, pas le fait d'être en train de la lire. */
    var out = {}, courant = null, valeur = null, enCours = false;
    function poserCourant() {
        if (courant === null) { return; }
        var v = valeur === null ? '' : valeur.join('\n');
        out[courant] = v.replace(/\s+$/, '');   // les lignes vides de fin ne sont pas la valeur
    }
    bloc.split('\n').forEach(function (ligne) {
        var l = ligne.replace(/^\s*\*\s?/, '');
        var p = l.match(/^@param\s+(.*)$/);
        if (p) { poserCourant(); courant = p[1].trim(); valeur = null; enCours = false; return; }
        var d = l.match(/^@default\s?(.*)$/);
        if (d && courant !== null) { valeur = [d[1]]; enCours = true; return; }
        if (/^@/.test(l)) { enCours = false; return; }
        // une valeur @default peut tenir sur plusieurs lignes (type note)
        if (enCours && valeur) { valeur.push(l); }
    });
    poserCourant();
    return out;
}

/* ── lecture ── */
var brut = fs.readFileSync(CIBLE, 'utf8');
var debut = brut.indexOf('[');
var fin = brut.lastIndexOf(']');
var entetes = brut.slice(0, debut);
var queue = brut.slice(fin + 1);
var liste = JSON.parse(brut.slice(debut, fin + 1));

/* ── RETIRER : enlever les lignes que cet outil a posées ── */
if (RETIRER) {
    var aRetirer = {};
    SECTIONS.forEach(function (s) {
        aRetirer[s[0]] = 1;
        s[1].forEach(function (p) { aRetirer[p[0]] = 1; });
    });
    var avant = liste.length;
    liste = liste.filter(function (p) { return !aRetirer[p.name]; });
    ecrire(liste);
    console.log('  ' + (avant - liste.length) + ' ligne(s) retirée(s) de js/plugins.js.');
    process.exit(0);
}

/* ── vérifications avant d'inscrire quoi que ce soit ── */
var deja = {};
liste.forEach(function (p) { deja[p.name] = p; });
var surDisque = {};
fs.readdirSync(path.join(RACINE, 'js', 'plugins'))
    .filter(function (f) { return /\.js$/.test(f); })
    .forEach(function (f) { surDisque[f.replace(/\.js$/, '')] = 1; });

var nouvelles = [], sautes = [], inconnus = [];
SECTIONS.forEach(function (sec) {
    var titre = sec[0], plugins = sec[1];
    var duBloc = [];
    plugins.forEach(function (p) {
        var nom = p[0], pourquoi = p[1], reglages = p[2];
        if (!surDisque[nom]) { sautes.push(nom + '  (aucun fichier sur le disque)'); return; }
        if (deja[nom]) { sautes.push(nom + '  (déjà inscrit — on n\'y touche pas)'); return; }
        // les défauts du plugin d'abord, nos réglages français par-dessus
        var base = defauts(nom);
        Object.keys(reglages).forEach(function (k) {
            if (!(k in base)) { inconnus.push(nom + ' → « ' + k +' »'); }
            base[k] = reglages[k];
        });
        duBloc.push({ name: nom, status: !ETEINDRE, description: pourquoi, parameters: base });
    });
    if (duBloc.length) {
        nouvelles.push({ name: titre, status: false, description: '', parameters: {} });
        duBloc.forEach(function (x) { nouvelles.push(x); });
    }
});

console.log('═'.repeat(74));
console.log('  BRANCHER LES PLUGINS');
console.log('═'.repeat(74));
console.log('   déjà inscrits      : ' + liste.length);
console.log('   à inscrire         : ' + nouvelles.filter(function (x) { return !/^▬/.test(x.name); }).length +
    ' (+' + nouvelles.filter(function (x) { return /^▬/.test(x.name); }).length + ' séparateurs)');
if (sautes.length) {
    console.log('   sautés             : ' + sautes.length);
    sautes.forEach(function (s) { console.log('        ' + s); });
}
/* un réglage français posé sur un nom que le plugin ne connaît pas ne fera
 * rien du tout, en silence. Mieux vaut le savoir tout de suite. */
if (inconnus.length) {
    console.log('   ⚠ réglages posés sur un nom inconnu du plugin : ' + inconnus.length);
    inconnus.forEach(function (s) { console.log('        ' + s); });
}
console.log('');
nouvelles.forEach(function (x) {
    if (/^▬/.test(x.name)) { console.log('   ' + x.name); }
    else { console.log('      ' + (x.status ? 'ON ' : 'off') + '  ' + x.name); }
});

function ecrire(l) {
    var corps = '[\n' + l.map(function (p) { return JSON.stringify(p); }).join(',\n') + '\n]';
    var sortie = entetes + corps + queue;
    // il doit se relire : c'est du JSON dans du JavaScript, une virgule en
    // trop et le jeu ne démarre pas du tout.
    var relu = JSON.parse(sortie.slice(sortie.indexOf('['), sortie.lastIndexOf(']') + 1));
    if (relu.length !== l.length) { throw new Error('relecture : ' + relu.length + ' ≠ ' + l.length); }
    fs.writeFileSync(CIBLE, sortie, 'utf8');
}

if (!ECRIRE && !ETEINDRE) {
    console.log('\n  (essai à blanc — rien n\'a été touché. Ajoute --ecrire.)');
    process.exit(0);
}

var fusion = liste.concat(nouvelles);
ecrire(fusion);
console.log('\n  ✔ js/plugins.js : ' + liste.length + ' → ' + fusion.length + ' lignes.');
console.log('    pour tout retirer : node bancs/outils/brancher_plugins.js --retirer');
