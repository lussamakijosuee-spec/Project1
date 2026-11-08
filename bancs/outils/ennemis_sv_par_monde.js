/*
 * OUTIL — LES IMAGES D'ENNEMIS (img/sv_enemies) RANGÉES PAR MONDE, D'APRÈS LEUR NOM (2026-11-08)
 * ---------------------------------------------------------------------------
 * JOKO : « Regarde le fichier ennemis sv et du coup avec les nom quesqui peut être dans le chapitre 1 ou
 * extérieur ». Ce n'est qu'une lecture des NOMS de fichiers, rangés par la Bible :
 *   - Chapitre 1 (l'Âme) : les peuples du « royaume des monstres » (Gelées, Gobelins, Orques, Farfadets, Trolls,
 *     Pleureuses, Loups-Frisson, Murmures, Petits Refus, Envies, Rêveurs, Rancœurs, Mirages, Statues de serment,
 *     Arbres-Mémoire, Vouivres et Orgueils, les morts qui refusent) ;
 *   - Chapitre 2 (l'Esprit) : neige, nuit, étoiles, savoir, elfes, nains, et « les mécanismes et les sentinelles
 *     qui apprennent » ;
 *   - Chapitre 3 (le Corps) : la chair, le sang, la faim, les prédateurs, « pas d'ogres ni de goinfres » au Ch. 1 ;
 *   - des humains : le monde extérieur est humain — mais le Chapitre 1 a aussi les siens (les inhumains) ;
 *   - des bêtes : la Bible dit qu'au Chapitre 1 « même les loups pensent », sans dire lesquelles : à JOKO ;
 *   - des dieux, titans, anges : à JOKO ;
 *   - illisible : un nom qui ne dit rien (chiffres, « removebg »…).
 *
 *   node bancs/outils/ennemis_sv_par_monde.js            → le résumé
 *   node bancs/outils/ennemis_sv_par_monde.js --ecrire   → aussi docs/ENNEMIS_SV_PAR_MONDE.md
 */
var fs = require('fs'), path = require('path');
var racine = path.join(__dirname, '..', '..');
var dossier = path.join(racine, 'img', 'sv_enemies');
var fichiers = fs.readdirSync(dossier).filter(function (f) { return /\.png$/i.test(f); }).map(function (f) { return f.replace(/\.png$/i, ''); });

// les images déjà portées par une fiche d'ennemi
var enemies = JSON.parse(fs.readFileSync(path.join(racine, 'data', 'Enemies.json'), 'utf8'));
var porte = {};
enemies.forEach(function (e) { if (e && e.battlerName) { (porte[e.battlerName.toLowerCase()] = porte[e.battlerName.toLowerCase()] || []).push(e.id); } });

// l'ordre compte : le premier qui correspond gagne (« Eldritch Slime » est de la chair avant d'être une gelée)
var REGLES = [
    ['illisible', /^(actor\d|objects |particles|.*temple--mv|.*removebg|.*preview|\d|[a-z0-9]{6,9}$)/i, null],
    ['divins', /deity|deva|djinn|summon /i, null],
    ['ch2', /drow|technomancer|astronaut|cosmic|glyph|clockwork|automaton|cyber|mecha|robot|machine|tank |tank$|airship|zeppel|cannon|post-modern|irongiant|iron ?gazer|drill|gunblin|\belf|elves|dwarf|dwarves|\bice\b|icei|frost|snow|yeti|glacier|winter|library|book|scholar|astral|celestial|lunar|zodiac|star\b|arcane|crystal|gemstone/i, null],
    ['ch3', /ogre|orkgre|behemoth|abomination|eldritch|flesh|blood|bloddy|feral|gluttony|hydra|t-rex|minotaur|insect|\bants?\b|mantis|centipede|worm|\btick\b|roach|scorpion|scorbloom|crocodile|croco|shark|piran|cannibal|hound|cerberus|chimera|manticore|sabretooth|werebear|scarbear|tentacle|lurker|beast|garm|nuckelavee|stein|parasand|death worm|aberration|flayer|body|head|vampir|torture|toxic|venom|wererat|weretiger/i, null],
    ['ch1', /slime|jelly|jellyfish|goblin|gobknight|gobcav|\borc\b|\borcs?\b|kobold|\bimp|devil|harpy|wolf|\bbat\b|bat\d|\bbats?\b|mimic|troll|shroom|mushroom|spora|mandrake|wisp|kindred|elemental|spirit|ghost|spectre|specter|banshee|wraith|phantom|skelet|skull|skeledan|bone|zombie|mumm|ghoul|dullahan|lich|undead|revenant|reaper|golem|statue|gargoyle|tree|dryad|willow|sprout|flower|plant|wyvern|wyrm|drake|dragon|fairy|pixie|redcap|puppet|mirage|lamia|naga|harpie|succubus|banshee|imp\b|oculus|gazer|seven sins|sahuagin|mermaid|errant/i, null],
    ['humains', /knight|bandit|rogue|assas+in|\bmage\b|^mage|captain|pirate|soldier|general|guard|robber|thief|fanatic|cultist|priest|priestess|samurai|archer|warrior|sorceress|witch|doctor|swordsman|huntress|nobleman|blacksmith|dancer|disciple|summoner|inventor|onna|egypt (archer|axe|knight|mage|chariot)|chariot|fallen great|fallen winged|fallen dragon knight|rabbit warriors|monk|cleric|noble|king|queen|hunter|druid|squire|hero|agent|tribal|ranger|bard|jester|maid|gravekeeper/i, null],
    ['divins', /\bgods?\b|goddess|titan|angel|archangel|demon|darklord|evilgod|hell king|khronos|hades|thanatos|jupiter|novus|innova|valhalla|originator|the fallen|reaper nihilo|twin gods|sun goddess|allspirit|tiamat|zeograth|radulac|death$|^death|reddeath|throne/i, null],
    ['peuples', /lizardman|snakeman|satyr|centaur|gorgon|gnoll|frogman|tengu|mer|mer_|siren|nymph|giant|gnome|halfling|naga|owlman/i, null],
    ['objets', /food|veggie|fruit|object|coin|key|candle|furniture|teacup|xmas|holiday|music|art|art_|ring_|doll|balloon|junk|bomb|match|cookie|sword_|armour|cloud|pumpkin/i, null],
    ['betes', /./, null]
];
var NOMS = {
    ch1: 'Chapitre 1 — les peuples du royaume des monstres',
    ch2: 'Chapitre 2 — neige, savoir, elfes, nains, machines',
    ch3: 'Chapitre 3 — la chair, le sang, la faim, les prédateurs',
    humains: 'Des humains — le monde extérieur, ou les inhumains du Chapitre 1',
    peuples: 'D\'autres peuples (lézards, satyres, sirènes, centaures…) — pas dans la Bible : à toi',
    objets: 'Des objets animés (nourriture, pièces, bougies, jouets…) — des Envies du Chapitre 1 ? à toi',
    betes: 'Des bêtes — Chapitre 1 si elles pensent, Chapitre 3 si ce sont des prédateurs : à toi',
    divins: 'Dieux, titans, anges, démons — à toi',
    illisible: 'Nom illisible — l\'image seule le dira'
};
var groupes = {};
fichiers.forEach(function (f) {
    var nom = f.replace(/^Z_Net_/, '').replace(/[_]+/g, ' ');
    for (var i = 0; i < REGLES.length; i++) {
        if (REGLES[i][1].test(nom)) { (groupes[REGLES[i][0]] = groupes[REGLES[i][0]] || []).push(f); return; }
    }
});

var ordre = ['ch1', 'humains', 'ch2', 'ch3', 'peuples', 'objets', 'betes', 'divins', 'illisible'];
console.log(fichiers.length + ' images dans img/sv_enemies');
ordre.forEach(function (k) {
    var l = groupes[k] || [];
    var portees = l.filter(function (f) { return porte[f.toLowerCase()]; }).length;
    console.log('  ' + String(l.length).padStart(5) + '  ' + NOMS[k] + '  (déjà sur une fiche : ' + portees + ')');
});

if (process.argv.indexOf('--ecrire') > 0) {
    var md = ['# Les images d\'ennemis, rangées par monde', '',
        '_Fait le 2026-11-08 par `bancs/outils/ennemis_sv_par_monde.js`, d\'après les **noms** des fichiers de `img/sv_enemies` seulement. '
        + 'C\'est une première lecture, pas une décision : une image peut changer de monde d\'un mot de JOKO. '
        + '« ★ » : l\'image est déjà portée par une fiche d\'ennemi (son numéro entre parenthèses)._', ''];
    ordre.forEach(function (k) {
        var l = (groupes[k] || []).slice().sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
        md.push('## ' + NOMS[k] + ' — ' + l.length, '');
        md.push(l.map(function (f) { var p = porte[f.toLowerCase()]; return p ? '★ ' + f + ' (' + p.slice(0, 4).join(', ') + ')' : f; }).join(' · '), '');
    });
    fs.writeFileSync(path.join(racine, 'docs', 'ENNEMIS_SV_PAR_MONDE.md'), md.join('\n'));
    console.log('écrit : docs/ENNEMIS_SV_PAR_MONDE.md');
}
