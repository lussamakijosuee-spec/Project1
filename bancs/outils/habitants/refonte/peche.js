/*
 * LA REFONTE — le Village de Pêche (carte 33), la plage
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-09 : « maintenant à la plage […] même pour les PNJ », puis, sur l'analyse
 * (docs/LA_PLAGE.md) : « Mer plutôt, oui », « bible, tout et développe ou détail au maximum ».
 * Le même gabarit que la Ville (refonte/ville.js, docs/PNJ_LA_BASE.md), posé PAR-DESSUS les fiches.
 *
 * La mer : la Bible met la mer à l'est (« Les navires d'Ilmarée longent les côtes de l'est ») et lie
 * Aurevel à Ilmarée par le commerce ; Aurevel nourrit « la moitié du continent » : son grain part par
 * la côte. Le village est « le village du donjon des eaux » : Edwin en part pour sa première faille,
 * « dans le groupe A, avec Vesper et Ludwig ; Aël est dans le groupe B », « encadrée par la garde
 * royale ». Les dates : la famine du roi Thibaut et la révolution « il y a un peu plus de vingt ans »,
 * le Quartier Noyé et le Héros « ces dernières années ». Les deux règles de la Chute « que chaque
 * garde apprend par cœur ». La Confrérie des Reliquaires : son sceau est « la preuve d'une inspection
 * dont quelqu'un répond, pas une garantie ».
 *
 * Une famille au cœur de la plage (« tout », P2) : Erwan, le pêcheur (l'événement 31 de JOKO, le
 * nom est un réglage), père de Jonas (la garde) et de Sora (les coquillages) — leurs fiches le
 * disaient déjà. Ses quêtes : les lucioles passent à Sora, le chant de la mer à Orin (les ✎).
 * Les fiches OC (oc/peche.js…) disaient « le lac » : passées à la mer ici, mot à mot (marin()).
 */
'use strict';
var D = require('../../recettes/dsl.js');
var H = require('../moteur.js');
var A = D.A, C = D.C, si = D.si, cat = D.cat;
function P(nom, t) { return H.parle(nom, t); }
function Q(id) { return "$gameSystem.questStatus('" + id + "')"; }
function quete(t) { return A.plugin('QUEST ' + t); }

/* ── le lac → la mer, dans les fiches OC (JOKO : « Mer plutôt, oui ») ── */
var OC = Object.assign({}, require('../oc/peche.js'), require('../oc/les_nouveaux.js'), require('../oc/les_autres_peche_manoir.js'), require('../oc/les_autres_voix.js'));
var MARIN = [
    ['même au bord du lac', 'même au bord de la mer'], ['au bord du lac', 'au bord de la mer'], ['file sur le lac', 'file sur la mer'],
    ['en regardant le lac', 'en regardant la mer'], ['dans le lac', 'dans la mer'], ['Raconte-lui le lac', 'Raconte-lui la mer'],
    ['Le lac. L\'après-midi.', 'La mer. L\'après-midi.'], ['Le lac. Les flammes sur l\'eau.', 'La mer. Les flammes sur l\'eau.'],
    ['"titre":"le lac"', '"titre":"la mer"'],
    ['Roul m\'a vendu un brochet « gros comme sa jambe ». C\'était une perche. Je l\'ai revendue « grosse comme sa jambe »', 'Roul m\'a vendu un bar « gros comme sa jambe ». C\'était un maquereau. Je l\'ai revendu « gros comme sa jambe »']
];
function marin(k, champs) {
    var o = OC[k] || {}, r = {};
    champs.forEach(function (c) {
        if (o[c] === undefined) return;
        var s = JSON.stringify(o[c]);
        MARIN.forEach(function (m) { s = s.split(m[0]).join(m[1]); });
        if (/\b(lac|brochet|perche)\b/i.test(s)) throw new Error('refonte/peche.js : « lac » reste dans ' + k + '.' + c + ' : ' + /.{0,40}\b(lac|brochet|perche)\b.{0,30}/i.exec(s)[0]);
        r[c] = JSON.parse(s);
    });
    return r;
}

module.exports = {

/* ── Erwan (33:31) — le pêcheur ; Jonas et Sora sont ses enfants ─────────── */
'33:31': {
    voix: "Peu de mots, tous utiles. Il parle de la mer au présent et de lui à peine. « Ça mord, ça mord pas. » Il ne dit jamais qu'il est fier : il dit « il tient droit ». Il finit par une question qu'il ne pose pas.",
    oc: {
        age: '45 ans', allure: 'une vareuse délavée, les mains coupées de fil, un bonnet qu\'il ne quitte qu\'à l\'église — il n\'y va pas',
        caractere: 'taiseux, doux, têtu comme la marée ; il aime ses enfants en silence et croit que ça s\'entend',
        aime: 'la mer avant l\'aube, quand elle est à personne ; le coquillage du soir de Sora ; le dos droit de Jonas, de loin',
        deteste: 'les mots qui servent à rien, le vent d\'est, qu\'on appelle ses barques des bateaux de location',
        reve: 'que Jonas monte un matin dans la troisième barque, juste une fois, pour rien',
        secret: 'il passe par la tour de garde chaque matin avant de sortir, pour voir son fils ; Jonas ne l\'a jamais vu',
        peur: 'que Jonas croie qu\'il a honte de lui', manie: 'il regarde l\'horizon avant de répondre, même à « bonjour »',
        phrase: 'Ça mord, ou ça mord pas.',
        liens: { Jonas: 'son fils ; la lance au lieu de la rame ; il ne lui a jamais dit qu\'il le trouvait droit', Sora: 'sa fille ; le coquillage du soir, le vrai étonnement', Orin: 'il lui a appris les nœuds, la nuit, pendant la famine', Annick: 'elle lui achète sa pêche et lui dit qu\'il maigrit' },
        vecu: "Né au village. Il avait dix-huit ans dans les dernières années de famine du roi Thibaut : la nuit, il vidait les poissons d'Orin pour que les barques ressortent à l'aube ; la mer nourrissait ceux qui avaient une barque. Pêcheur depuis ses quinze ans, sur la troisième barque. Son fils est entré dans la garde l'an dernier ; sa fille a huit ans et cent coquillages.",
        savoir: "sait la mer à son bruit, le temps au vent d'ouest, chaque fond de la baie ; ignore tout des failles et ne veut pas savoir ; croit à tort que Jonas ne sait pas qu'il le regarde"
    },
    premiere: "~Il ne lève pas les yeux tout de suite. Il regarde la mer, puis toi.|Erwan. Je pêche. Si tu veux une canne, j'en ai une. Si tu veux parler, j'ai moins.",
    bonjour: {
        1: ["Mer d'huile. Ça va mordre. Ou pas.", "~Il revient de la barque, des écailles jusqu'aux coudes.|Bonjour. Je sens le poisson. Ça part pas."],
        2: ["Midi. Les poissons dorment, les pêcheurs aussi. Sauf moi.", "~Il reprise un hameçon, les yeux plissés.|Hm. Bonjour."],
        3: ["Le soir, le bar remonte. Faut être là.", "Bonsoir. Sora t'a montré son coquillage d'aujourd'hui ? Elle va."],
        4: ["Il est tard pour la plage. Moi je pars dans trois heures.", "La nuit, l'eau est noire. Ça fait rien. On sait où on met les pieds."]
    },
    saisons: {
        1: ["Le printemps, le maquereau revient. Il mord à tout. Même à un bouton."],
        2: ["L'été, la dorade et le rouget. Les gens de la capitale paient bien le rouget. Annick le sait."],
        3: ["L'automne, la mer se fâche un jour sur deux. Le hareng aime ça. Moi moins."],
        4: ["L'hiver, je sors quand même. Le hareng attend pas que j'aie chaud."]
    },
    discuter: [
        "Une canne, c'est simple : tu lances, tu attends, tu tires au bon moment. Le bon moment, c'est le seul truc qui s'apprend pas.",
        "Les bars viennent près du bord le soir et à l'aube. Le reste du temps, ils réfléchissent.",
        "La sole, elle est plate, elle reste au fond, et elle a les deux yeux du même côté. Elle voit tout ce qui vient d'en haut. Rien d'autre.",
        "Annick me prend tout. Elle dit que je maigris. Elle dit ça à tout le monde. Ça doit être vrai pour quelqu'un."
    ],
    fil: [
        "Le matin, avant tout le monde, la mer est à personne. C'est le seul moment où elle est à moi. Après, il y a Roul qui crie qu'il a pris le plus gros. Il a jamais pris le plus gros.",
        { ami: 2, t: "La troisième barque, c'est la mienne. Jonas sait laquelle. Il a toujours su. Petit, il la reconnaissait à son clapotis.|… Il te parle de moi ? Non. Laisse." },
        { ami: 3, gestes: [
            "~Il enroule une ligne autour de sa main, très lentement.",
            "Mon fils a pris la lance au lieu de la rame. Mon père pêchait. Le sien aussi. Lui, il garde la route.",
            "Toi. À sa place. T'aurais pris quoi ?",
            ['choix', ["La lance. Il a choisi.", "La rame. C'est sa famille."], [
                [['retiens', 'jonas', 'lance'], "~Il ne répond pas. Il regarde la tour, longtemps.", "… Il a choisi. Oui. C'est ce que je me dis le matin. Ça marche un jour sur deux.", ['ami', 1]],
                [['retiens', 'jonas', 'rame'], "La rame, c'est pas une famille. C'est un bout de bois.", "~Il lâche la ligne.", "La famille, c'est qu'il revienne le soir. Il revient. Ça suffit."]]]
        ] },
        { ami: 5, t: "Chaque matin, je passe par la tour. De loin. Il me voit pas. Il tient sa lance droit, le dos bien droit.|C'est moi qui lui ai appris à tenir une rame comme ça. Il s'en sert pour tenir une lance. C'est pareil.|C'est pareil, hein ?" },
        { ami: 7, t: "Sora me montre un coquillage tous les soirs. Je fais semblant d'être surpris, elle croit.|Je fais pas semblant. Elle en trouve un nouveau tous les soirs, depuis trois ans. Comment elle fait ? La mer en a pas tant que ça." },
        { ami: 9, gestes: [
            "Quand ils entreront dans la grotte, le fils d'Annick et les autres, Jonas gardera la route. Moi je pêcherai.",
            "On sera à cent pas l'un de l'autre. Comme tous les jours.",
            "~Il te regarde enfin, vraiment.",
            "Dis-lui, toi. Que je regarde. … Non. Dis-lui rien. Il le saura quand il aura un fils.",
            ['ami', 1]
        ] }
    ],
    souvenirs: [
        { cle: 'jonas', val: 'lance', lignes: ["Tu m'as dit qu'il avait choisi. Ce matin, à la tour, je me suis approché trois pas plus près. Trois. Il a rien vu."] },
        { cle: 'jonas', val: 'rame', lignes: ["Tu m'as parlé de la rame, l'autre jour. J'y ai repensé en ramant. C'est long, de ramer, pour penser."] }
    ],
    ragots: [
        { de: '33:16', cle: 'garde', val: 'fier', lignes: ["Jonas a dit à quelqu'un que je serais fier. Il l'a dit à toi, je crois. … Bon. Il a pas tort. Le dis pas."] },
        { de: '33:19', cadeau: true, lignes: ["Sora dit que tu lui as offert quelque chose. Elle en parle à table. Elle en parle même aux poissons."] }
    ],
    nouvelles: [
        "Les navires d'Ilmarée sont passés au large ce matin. Trois voiles blanches. Ils vont plus vite que nous. Ils vont aussi plus loin.",
        "Le vent tourne à l'ouest. Demain, ça mord."
    ],
    etapes: {
        0: ["La grotte, je connais pas. Moi je connais l'eau. Ce qui sort d'un trou dans la pierre, ça regarde pas la mer. J'espère."],
        1: ["La garde du roi est là. Jonas a eu un casque neuf. Il brille. On le voit depuis la barque. … C'est pratique, pour le trouver."],
        2: ["Les aventuriers m'achètent des poissons et me demandent des barques. Les barques sont pas à louer. C'est pas des chevaux."],
        3: ["Ils sont entrés. Jonas garde la route depuis l'aube. J'ai pas pêché ce matin. J'ai regardé la route. Ça mord pas, une route."],
        4: ["Ils sont revenus. Le fils d'Annick parle, il parle, il parle. Annick pleure en riant. Moi j'ai repris la mer. Ça mordait."]
    },
    triste: ["Ce matin, la mer était grise et j'avais pas envie de sortir. J'ai jamais pas envie. … Je suis sorti quand même. Faut bien.", "~Il est assis sur la barque retournée, les mains vides.|Rien. Ça mord pas. Moi non plus, aujourd'hui."],
    meteo: {
        pluie: ["La pluie, ça gêne pas les poissons. Moi, un peu. Je sors quand même."],
        orage: ["Personne en mer par ce temps. Même moi. Surtout moi : j'ai deux enfants."],
        tempete: ["~Il a tiré la barque haut sur le sable, et il la regarde comme on regarde un chien qui tremble.|Elle est solide. Moi aussi. On attend."],
        neige: ["La neige sur la mer, ça fond avant de toucher. Ça sert à rien. C'est beau."],
        brouillard: ["Brouillard. On sort pas. On entend les autres barques, on les voit pas. Ça fait des fantômes."]
    },
    options: [
        { titre: 'Pêcher', cmds: cat(
            P('Erwan', 'Tiens. Lance loin, attends, tire au bon moment. Le reste, la mer te le dira.'),
            A.js(['if (!$gameParty.hasItem($dataItems[110])) { $gameParty.gainItem($dataItems[110], 1); }',
                'if (!$gameParty.hasItem($dataItems[111])) { $gameParty.gainItem($dataItems[111], 1); }',
                '$gamePlayer._rodEquipped = 110; $gamePlayer._baitEquipped = 111;',
                'Plage.etang();', 'Galv.FISH.run();'].join('\n')), D.sortirBoucle()) },
        { titre: 'Voir mes prises', cmds: A.js('Galv.FISH.viewStats();') }
    ],
    aurevoir: ["Ça mord, ou ça mord pas.", "Va. Et si tu vois Jonas… non. Va."]
},

/* ── Jonas (33:16) — 18 ans, la lance au lieu de la rame ─────────────────── */
'33:16': {
    voix: "Timide et sincère. Des phrases qui s'arrêtent avant la fin. Il se reprend en « garde » quand il se sent jugé (« Garde Jonas, à vos ordres… enfin, bonjour »). « Papa » lui échappe, puis il dit « mon père ».",
    oc: {
        vecu: "Né au village trois ans après la révolution : il n'a connu que Lothaire. À treize ans, la légende du Héros du Quartier Noyé ; à dix-sept, il s'engage dans la garde, le premier de la famille à ne pas pêcher. Il a appris par cœur les deux règles de la Chute, comme tout garde.",
        savoir: "sait les nœuds, les marées, les deux règles de la Chute, les permis de la Chancellerie ; ignore ce qu'il y a derrière la faille, et ce que son père pense de lui ; croit à tort que son père a honte"
    },
    premiere: "~Il se redresse trop vite, la lance de travers.|Garde Jonas ! À vos… Enfin. Bonjour. Je suis de garde. Ça se voit pas toujours.",
    bonjour: {
        1: ["Relève de l'aube. J'ai vu les barques partir. … Je regarde pas. Je surveille. C'est différent."],
        2: ["Midi. On me remplace une heure. Je mange du poisson. Celui de mon père. Il le sait pas."],
        3: ["Garde du soir. La mer devient noire, et la route aussi. Je préfère la route."],
        4: ["La nuit, on entend la mer depuis la tour. Je compte les vagues. À trois cents, c'est la relève."]
    },
    saisons: {
        1: ["Au printemps, mon père repeint sa barque. En bleu. Elle a toujours été bleue. Il la repeint quand même."],
        2: ["L'été, la cuirasse chauffe. Les gamins se baignent. Moi je surveille qu'ils se noient pas. C'est presque pêcher."],
        3: ["L'automne, la garde double les rondes. Le capitaine dit que c'est à cause de la faille. Moi je crois que c'est à cause du vent."],
        4: ["L'hiver, sur la tour, on a les doigts qui tombent. Je mets les gants que ma mère a tricotés. Ils sentent le hareng."]
    },
    discuter: [
        "La garde paie un peu mieux que la pêche. Et on se mouille moins. En général.",
        "Moi, c'est la lance. Mon père, c'est la rame. On a tous un long bâton. On s'en sert pas pareil.",
        "Le capitaine Régis m'appelle « matelot ». Je suis pas matelot. Je le corrige pas. Il a l'air content.",
        "Sora me fait des grimaces quand je suis de garde. Je dois pas rire. Je tiens jusqu'à trois."
    ],
    fil: [
        "Tu veux connaître les deux règles de la Chute ? Tout garde les apprend par cœur. Un : tuer les créatures sorties ne referme pas la faille. Deux : refermer la faille ne fait pas disparaître celles qui sont sorties.|… Je les récite la nuit, pour pas m'endormir. Ça marche pas.",
        { ami: 2, t: "Mon père m'a dit, quand je suis parti à la garde : « Tiens ta lance comme une rame. » C'est la seule chose qu'il m'a dite. J'y pense à chaque relève." },
        { ami: 3, gestes: [
            "~Il regarde la mer par-dessus la palissade.",
            "Je peux te demander un truc ? Bête.",
            "Tu crois qu'on peut aimer la mer… et la quitter quand même ?",
            ['choix', ["Oui. Ça s'appelle grandir.", "Non. Elle te rappellera."], [
                [['retiens', 'mer', 'quitter'], "Grandir. … Ma mère dit ça aussi. Mais elle pleure en le disant.", "~Il sourit, un peu.", "Merci. Ça aide, quelqu'un qui le dit sans pleurer.", ['ami', 1]],
                [['retiens', 'mer', 'rappel'], "Elle me rappelle déjà. Tous les matins. Depuis la tour, je l'entends.", "~Il resserre sa main sur la lance.", "Mais je réponds pas. Pas encore."]]]
        ] },
        { ami: 5, t: "Tous les matins, je sais quand mon père sort. La troisième barque. Elle fait un clapotis plus lourd que les autres, parce qu'il charge trop de filets. Je l'entends partir.|Je me retourne jamais. Si je me retournais, il saurait que j'écoute." },
        { ami: 7, gestes: [
            "Tu sais pourquoi je suis entré dans la garde ? À cause du Héros. Celui du Quartier Noyé. Il a tenu tout seul, à la capitale. Tout le monde en parlait, j'avais treize ans.",
            "Moi je voulais tenir quelque chose. Une route, une porte. N'importe quoi qui tienne.",
            "Mon père, lui, il tient la mer depuis trente ans. Je crois que je l'avais pas vu.",
            ['choix', ["Il serait fier de toi.", "Dis-le-lui."], [
                [['retiens', 'garde', 'fier'], "~Il rougit jusqu'aux oreilles.", "… Tu crois ? Bon. Je… je retourne à ma garde.", ['ami', 1]],
                [['retiens', 'garde', 'dire'], "Lui dire quoi ? « Papa, tu tiens la mer » ? Il me regarderait comme une sole.", "~Il rit, enfin.", "… Peut-être. Un jour. Quand j'aurai un casque à moi."]]]
        ] },
        { ami: 9, t: "Hier, à l'aube, j'ai regardé la troisième barque partir. Je me suis retourné. Une fois.|Il y avait quelqu'un, en bas de la tour, qui repartait vers la plage. Il marchait comme mon père.|… C'était peut-être un autre pêcheur. Ils marchent tous pareil. Je crois." }
    ],
    souvenirs: [
        { cle: 'mer', val: 'quitter', lignes: ["Tu m'as dit « grandir ». Je me le répète à la relève. Ça fait un mot de plus que les deux règles."] },
        { cle: 'mer', val: 'rappel', lignes: ["Elle m'a rappelé, ce matin. Fort. Une grosse vague contre la tour. J'ai pas répondu. … Presque."] },
        { cle: 'garde', val: 'dire', lignes: ["J'ai failli lui dire, hier soir. Il réparait un filet. J'ai dit « bonne nuit ». C'est un début, non ?"] }
    ],
    ragots: [
        { de: '33:31', cle: 'jonas', val: 'lance', lignes: ["Mon père a dit à quelqu'un que j'avais choisi. Choisi ! Pas « trahi ». Choisi. … C'est toi qu'il a dit ça, hein ?"] }
    ],
    nouvelles: [
        "Un permis de la Chancellerie, c'est un papier avec un sceau. Je dois en vérifier dix par jour. J'ai jamais vu un vrai faux. Gustave dit que c'est le but.",
        "Des marchands d'Ilmarée ont accosté plus au sud. Ils vendent des lanternes à cristal. Mon père dit qu'une lanterne, ça fait fuir le poisson."
    ],
    etapes: {
        0: ["Une faille dans la grotte. Le capitaine de la garde dit qu'on attend les ordres. Moi je relis les deux règles. Ça occupe."],
        1: ["La garde royale est arrivée. La vraie, celle de la capitale. On m'a mis sur la tour de la plage. La TOUR. … Mon père peut me voir de la barque."],
        2: ["Les aventuriers passent tous par la route du nord. Je vérifie les permis. Il y en a un qui m'a demandé où était la mer. Il était devant."],
        3: ["Ils sont entrés. Le fils d'Annick était dans le premier groupe. Il m'a dit au revoir comme si j'étais son ami. … Je garde la route jusqu'à ce qu'ils sortent."],
        4: ["Ils sont sortis. Je les ai comptés en silence, comme les vagues. Après, j'ai pleuré derrière la tour. Garde Jonas. Pleure pas. … Pas devant."]
    },
    triste: ["Ce matin, j'ai compté les barques. Trois. Comme toujours. Je sais pas pourquoi ça m'a serré la gorge.", "~Il regarde la mer, la lance posée contre le mur.|C'est rien. C'est le sel. Le sel, ça pique les yeux."],
    meteo: {
        pluie: ["La pluie sur la tour, ça fait un bruit de tambour. On dirait qu'on part en guerre. On part pas."],
        orage: ["Par l'orage, la garde reste dehors. C'est le règlement. Le règlement a jamais été sur une tour."],
        tempete: ["Tempête. Mon père a rentré sa barque. Je l'ai vu. Je regardais pas. Je surveillais."],
        neige: ["La neige sur la plage, c'est rare. Sora fait un château de neige. Il fond. Elle recommence."],
        brouillard: ["Brouillard. Depuis la tour, je vois plus la mer. Je l'entends. C'est pire."]
    },
    perso: null,
    aurevoir: ["Garde Jonas, à vos… Au revoir.", "Si tu passes par la troisième barque… non. Rien. Au revoir."]
},

/* ── Orin (33:17) — 64 ans, les filets, la famine, le nœud-étoile ──────── */
'33:17': {
    voix: "Taiseux. Un nœud par phrase, et la phrase s'arrête au nœud. Il ne pose jamais de question, sauf une. Il dit « Un nœud. » quand il a fini de parler.",
    oc: {
        vecu: "Né au village. Pêcheur jusqu'à quarante ans. Sous le roi Thibaut, la famine : le grain partait en taxes, la mer nourrissait ceux qui avaient une barque, et il raccommodait les filets la nuit pour qu'elles ressortent à l'aube. Une tempête, un mauvais nœud, un doigt en moins ; depuis, il ne pêche plus. Il répare.",
        savoir: "sait chaque filet du village, chaque nœud, la mer à son bruit ; ignore les failles (« un trou de plus ») ; croit à tort que la mer ne chante que pour les vieux",
        deteste: 'les filets déchirés par les congres de Roul (« gros comme sa jambe »)'
    },
    premiere: "~Il ne lève pas les yeux de son filet.|Orin. Je répare ce que la mer déchire. Un nœud.",
    bonjour: {
        1: ["~Ses doigts nouent le fil sans s'arrêter.|Matin. Trois trous cette nuit. Un nœud.", "Bonjour. Le hareng est passé. Il a laissé ça.|~Il montre un trou, presque avec respect."],
        2: ["Midi. Les filets sèchent. Moi aussi.", "~Il a la pipe éteinte entre les dents.|Hm. Bonjour."],
        3: ["Le soir, la lumière est basse. On voit mieux les trous.", "Bonsoir. Erwan est rentré. Le filet aussi. Pas entier."],
        4: ["La nuit, je répare au bruit. Pas besoin de voir. Les doigts savent.", "Tu dors pas ? Moi non plus. Depuis la famine, je dors comme un filet : avec des trous."]
    },
    saisons: {
        1: ["Printemps. Les filets de l'hiver sont pourris. Tous. Je recommence. Un nœud."],
        2: ["L'été, le fil sèche trop vite. Il casse. Faut le mouiller avant de nouer. Comme les gens."],
        3: ["L'automne, les tempêtes. Les tempêtes, c'est mon métier. Je les attends."],
        4: ["L'hiver, mes doigts gèlent. Les neuf qui restent. Un nœud."]
    },
    discuter: [
        "Un filet, c'est des trous attachés ensemble. Mon travail, c'est de garder les bons trous.",
        "Les jeunes veulent des filets enchantés, à cristal. Ça existe. Ça coûte un an de pêche. Moi je répare à la main.",
        "Erwan noue mal depuis trente ans. Je lui ai appris. C'est de ma faute. Un nœud.",
        "Roul prend des congres. Les congres mangent les filets. Roul paie en histoires. Je ne mange pas d'histoires."
    ],
    fil: [
        "Sous le vieux roi, les percepteurs comptaient le grain. Pas les poissons. Alors c'est la mer qui a nourri le village. Ceux qui avaient une barque.|Les autres venaient au port avec des seaux. On remplissait les seaux. Un nœud.",
        { ami: 2, t: "La nuit, pendant la famine, je réparais les filets à la lanterne. Un garçon de dix-huit ans vidait les poissons à côté. Il s'endormait sur les seaux.|C'était Erwan. Il noue mal parce qu'il s'endormait. C'est pour ça. Un nœud." },
        { ami: 3, gestes: [
            "~Il lève les yeux pour la première fois.",
            "Une question. Une seule. Je n'en pose pas.",
            "Quand tu répares quelque chose. Tu le fais pour qu'il soit comme avant ? Ou mieux ?",
            ['choix', ["Comme avant.", "Mieux."], [
                [['retiens', 'reparer', 'avant'], "Comme avant.", "~Il hoche la tête, une fois.", "C'est ce que disent ceux qui ont perdu quelque chose. Un nœud.", ['ami', 1]],
                [['retiens', 'reparer', 'mieux'], "Mieux.", "~Il regarde sa main, celle où il manque un doigt.", "Moi aussi. Depuis le doigt, mes nœuds sont parfaits. Il fallait le doigt. Un nœud.", ['ami', 1]]]]
        ] },
        { ami: 5, t: "Dans chaque filet que je répare, je cache un nœud en forme d'étoile. Petit. On le voit pas si on le cherche pas.|Les pêcheurs disent que ça porte chance. Je ne leur ai jamais dit que c'était moi. La chance, ça marche mieux sans auteur." },
        { ami: 7, t: "Le doigt. Une tempête, il y a vingt-quatre ans. Une corde, un mauvais nœud — le mien. La barque est rentrée. Le doigt, non.|J'ai arrêté de pêcher. J'ai commencé à réparer. Il y a des choses qu'on comprend qu'avec un doigt en moins." },
        { ami: 9, t: "La mer chante, certaines nuits. Une note très basse. Je l'ai entendue trois fois dans ma vie. La nuit de la tempête. La nuit où Erwan a eu son fils. Et une autre.|L'autre, je la garde. Un nœud." }
    ],
    souvenirs: [
        { cle: 'reparer', val: 'avant', lignes: ["« Comme avant. » Tu as dit ça. J'ai réparé un filet comme avant, hier. Il a tenu. Ça arrive."] },
        { cle: 'reparer', val: 'mieux', lignes: ["« Mieux. » Tu as dit ça. J'ai fait deux étoiles dans le filet d'Erwan, hier. Mieux, c'est deux. Un nœud."] }
    ],
    ragots: [
        { de: '33:24', cle: 'lettres', val: 'garder', lignes: ["Annick lit, la nuit. Tu le sais, toi aussi. Je vois sa lanterne. Je dis rien. Un nœud."] }
    ],
    nouvelles: [
        "Le hareng est en avance cette année. Le hareng en avance, c'est un hiver long. Ou c'est le hareng.",
        "Colin, le chanteur du bar, est venu écouter la mer, la nuit. Il est reparti mouillé. Il dit qu'il a entendu. Je l'ai cru. Un nœud."
    ],
    etapes: {
        0: ["Une faille. Dans la grotte. Un trou de plus dans le monde. Je ne répare pas ceux-là."],
        1: ["Les soldats du roi m'ont demandé des cordes. J'en ai fait. Des bonnes. Je ne sais pas pour quoi. Je ne demande pas."],
        2: ["Les aventuriers veulent des filets pour rapporter ce qu'ils trouveront. Des filets à trésors. J'ai fait des filets à poissons, en plus grand. C'est pareil."],
        3: ["Ils sont entrés. J'ai mis une étoile dans le sac du fils d'Annick. Il ne le sait pas. Un nœud."],
        4: ["Ils sont revenus. Le sac du fils d'Annick était déchiré. L'étoile a tenu. Un nœud."]
    },
    triste: ["~Ses doigts se sont arrêtés au milieu d'un nœud.|… J'ai oublié la suite. Ça ne m'arrive pas. Reviens demain.", "Cette nuit, j'ai rêvé de la famine. Les seaux. Je ne rêve jamais. Un nœud. Deux."],
    meteo: {
        pluie: ["La pluie, c'est bon pour le fil. Il se tend. Je reste. Sous l'auvent, avec mes filets."],
        orage: ["L'orage. Demain, beaucoup de trous. Je prépare le fil."],
        tempete: ["Tempête. Je n'aime pas les tempêtes. J'y ai laissé un doigt. Un nœud."],
        neige: ["La neige ne déchire rien. Je l'aime bien, la neige."],
        brouillard: ["Brouillard. Les barques ne sortent pas. Pour une fois, je n'ai rien à réparer. Je ne sais pas quoi faire de mes mains."]
    },
    perso: null,
    options: [
        { titre: 'Le chant de la mer', si: C.js(Q('lac') + " !== 'done'"), cmds: si(C.js(Q('lac') + " === 'none'"),
            cat(P('Orin', "La mer chante. Pas le jour. La nuit, au bord, en bas du ponton, là où l'eau est noire. Va l'écouter. Et reviens me dire si tu es revenu pareil."),
                D.choix(['Oui', 'Plus tard'], [
                    cat(quete('add side lac "Le chant de la mer" "Colin, le chanteur du bar, jure que certaines nuits la mer chante une note très basse. Orin dit où l\'écouter : au bord, la nuit, en bas du ponton."'),
                        quete('de lac "Orin" "Village de Pêche"'), quete('obj lac "Écouter la mer, la nuit, au bord de l\'eau"'), quete('obj lac "Revenir voir Orin"'),
                        quete('prix lac "Note Tenue ×1"'), quete('prix lac "200 or"'), quete('track lac'),
                        P('Orin', 'La nuit. Le jour, elle se tait. Un nœud.')),
                    P('Orin', 'Elle attendra. Elle attend depuis toujours.')], { annuler: 1 })),
            si(C.js("$gameSystem.questObjDone('lac', 1)"),
                cat(P('Orin', "Une note. Très basse. Tu l'as entendue, ça se voit : tu marches plus doucement.|Garde ça. C'est elle, tenue. Un nœud."), A.objet(93, 1), A.or(200), quete('done lac'), H.affinite(1)),
                P('Orin', "Alors ? Tu as attendu la nuit ? Au bord. En bas du ponton. Pas avant."))) }
    ],
    aurevoir: ["Un nœud.", "Bonne pêche. Ou pas. Les deux réparent."]
},

/* ── Emma (33:18) — 18 ans, « la Princesse », le Feu Infernal ───────────── */
'33:18': Object.assign(marin('33:18', ['lieux', 'scenes', 'avis', 'aCote', 'amitie']), {
    voix: "Calme, acérée ; elle insulte sans jamais crier, en articulant pour qu'on saisisse chaque mot (JOKO). Des phrases courtes, des verdicts. Elle dit « On » quand elle parle d'elle. Elle ne remercie pas : elle constate.",
    oc: {
        age: '18 ans',
        allure: 'uniforme de Rubis impeccable même au bord de la mer, cheveux noirs tirés, une flamme rouge-noir qui lui court entre les doigts',
        secret: 'le contrecoup de lignée : ses mains tremblent quand elle pousse trop ; elle s\'entraîne seule au bord de la mer',
        vecu: "Née dans l'une des familles nobles les plus influentes de l'académie, héritière d'une lignée liée au « Feu Infernal ». Entrée à Rubis convaincue d'être au-dessus de tous ; six ans plus tard, l'une des duellistes les plus disciplinées de sa promotion (JOKO). Venue au village voir Edwin avant son expédition — elle dit que c'est pour s'entraîner.",
        savoir: "sait le Feu Infernal, les cercles, le classement de chaque élève de sixième année ; ignore ce que font les gens d'un village de pêche de leurs journées ; croit à tort que la discipline suffit à tout"
    },
    premiere: "~Elle ne se retourne pas. Une flamme s'éteint au-dessus de l'eau.|Emma Fieldensong. Sixième année. On ne te demande pas ton nom : tu vas le dire de toute façon.",
    bonjour: {
        1: ["Le matin, la mer est plate. Les cercles tiennent mieux. Tu me déranges, mais à une heure acceptable."],
        2: ["Midi. Ils mangent tous ensemble, ici. Sur le sable. Comme des mouettes. … On a déjà mangé."],
        3: ["Le soir, le Feu Infernal se voit mieux sur l'eau. Ce n'est pas pour qu'on le voie. C'est un constat."],
        4: ["Tu ne dors pas. On non plus. Inutile d'en faire un sujet."]
    },
    saisons: {
        1: ["Le printemps. Le vent de mer déforme mes cercles. On corrige. On corrige toujours."],
        2: ["L'été, le sable brûle presque autant que mes flammes. Presque."],
        3: ["L'automne. Les tempêtes éteignent tout, sauf ce qui ne s'éteint pas."],
        4: ["L'hiver, ma flamme fume sur la mer. Annick dit que c'est joli. On ne fait pas des flammes pour être jolie."]
    },
    discuter: [
        "Violet Ashdown m'appelle « princesse » pour me provoquer. Elle croit que ça marche. … Ça marche. On s'entraîne deux fois plus quand elle le dit.",
        "Celestia von Aurelia est deuxième au classement des duels. Derrière on. Elle dira le contraire. Elle se trompera.",
        "Le Feu Infernal affaiblit certaines barrières au contact prolongé. Prolongé. Les impatients ne le sauront jamais.",
        "Annick me donne des tartines. Je ne les lui demande pas. Je les mange. On ne refuse pas une tartine d'Annick : ce serait une erreur tactique."
    ],
    fil: [
        "Tu veux savoir pourquoi on est ici ? L'Encyclopédie part pour sa première faille. Il va parler pendant tout le trajet. Quelqu'un doit être là pour lui dire de se taire au bon moment.|… Ce n'est pas de l'amitié. C'est de la logistique.",
        { ami: 2, t: "Freya Winterbourne dit que le talent inné n'existe pas. Qu'il n'y a que le travail. Ça m'agace qu'elle ait raison à moitié.|L'autre moitié, c'est moi qui l'ai. La lignée. … On s'entraîne quand même. Au cas où elle aurait raison entièrement." },
        { ami: 3, gestes: [
            "~Elle allume une flamme sur son pouce, l'éteint, la rallume.",
            "Morwen Calder fait des flammes sans effort. Sans cercle. Sans rien. Comme on respire.",
            "Toi. Qu'est-ce qui vaut le plus : un don qu'on a, ou un don qu'on a gagné ?",
            ['choix', ["Celui qu'on a gagné.", "Celui qu'on a. Il faut juste l'accepter."], [
                [['retiens', 'don', 'gagne'], "~La flamme reste allumée, droite.", "… Bonne réponse. On le savait. On voulait l'entendre d'une bouche qui n'a pas de lignée.", ['ami', 1]],
                [['retiens', 'don', 'accepter'], "L'accepter.", "~La flamme vacille.", "C'est ce que Morwen dirait. … On y réfléchira. Pas maintenant. Plus tard. Seule."]]]
        ] },
        { ami: 5, t: "Quand on pousse trop, nos mains tremblent. La vision se rétrécit. Ça s'appelle un contrecoup de lignée. Les nobles ne le disent pas aux roturiers.|Voilà. Tu es le premier roturier à qui on le dit. N'en fais rien." },
        { ami: 7, t: "Naomi Briarley m'écrit toujours. Des lettres gentilles. Je lui ai répondu, la dernière fois. Trois lignes. Elle m'a répondu six pages.|On ne sait pas quoi faire de six pages gentilles. On les a gardées. Toutes." },
        { ami: 9, gestes: [
            "~Elle regarde la mer, les bras croisés, sans flamme.",
            "L'Encyclopédie part dans quelques jours. On ne part pas avec lui. Pas cette fois.",
            "S'il lui arrive quelque chose… on brûlera la grotte. Ce n'est pas une menace. C'est un plan.",
            "… Non. Ce n'est pas un plan. C'est de la peur. On n'a pas l'habitude. Ne le dis à personne.",
            ['ami', 1]
        ] }
    ],
    souvenirs: [
        { cle: 'don', val: 'gagne', lignes: ["« Celui qu'on a gagné. » On s'est entraînée trois heures de plus après ta réponse. Ce n'est pas un merci. C'est une conséquence."] },
        { cle: 'don', val: 'accepter', lignes: ["On a essayé de faire une flamme sans cercle, hier soir. Comme Morwen. Elle a tenu deux secondes. … Deux de plus que d'habitude."] }
    ],
    ragots: [
        { de: '33:22', cle: 'peur', val: 'information', lignes: ["L'Encyclopédie dit que tu lui as rendu sa phrase sur la peur. Il la répète à tout le monde. C'est insupportable. Merci."] }
    ],
    nouvelles: [
        "Une lettre de l'académie : le classement de la sixième année est publié. On est toujours devant Celestia. Ça a coûté un hiver. Ça valait un hiver.",
        "La garde royale encadre les premières failles des élèves. Les soldats sont polis avec nous. Trop. C'est qu'ils ont peur de nos parents."
    ],
    etapes: {
        0: ["Une faille de niveau un, à côté d'un village de pêche. L'académie a choisi l'endroit pour sa première sortie. Évidemment : rien n'arrive jamais ici."],
        1: ["La garde royale est arrivée. Un capitaine m'a saluée par mon nom de famille. On a corrigé : par le mien."],
        2: ["Des aventuriers partout. Ils regardent nos uniformes comme des vitrines. On ne se laisse pas regarder. On regarde en premier."],
        3: ["Ils sont entrés. L'Encyclopédie avait trois carnets. On lui en a pris un, pour qu'il soit moins lourd. On le lui rendra. On le lira peut-être d'abord."],
        4: ["Ils sont revenus. L'Encyclopédie a parlé pendant une heure sans respirer. On l'a laissé faire. Une heure entière. C'est un record de patience."]
    },
    triste: ["~Ses mains tremblent, sans flamme.|Ce n'est pas un contrecoup. On n'a rien poussé aujourd'hui. … C'est autre chose. Ça passera.", "Ce matin, on a rêvé de pluie. On ne rêve jamais. La mer est grise. On n'aime pas le gris."],
    meteo: {
        pluie: ["La pluie éteint les flammes ordinaires. Pas les nôtres. On en fait la démonstration à personne."],
        orage: ["L'orage. On s'entraîne quand même. La foudre ne vise pas les nobles. C'est statistiquement faux, mais on y croit."],
        tempete: ["Tempête. Même nous, on rentre. Ce n'est pas de la peur. C'est de la gestion du mana."],
        neige: ["La neige fond quand on passe. C'est pratique. Annick trouve ça « mignon ». On n'a jamais été mignonne."],
        brouillard: ["Le brouillard étouffe le feu. Il étouffe aussi la voix de l'Encyclopédie. Il y a des avantages à tout."]
    },
    perso: null,
    aurevoir: ["Tu peux partir. On t'y autorise.", "Va. Et tiens-toi droit : on regarde."]
}),

/* ── Sora (33:19) — 8 ans, les coquillages, papa, les bouteilles ───────── */
'33:19': Object.assign(marin('33:19', ['lieux', 'scenes', 'avis', 'aCote', 'amitie']), {
    voix: "Tout vite, tout en même temps, des questions sans attendre la réponse. Elle compte à voix haute et se trompe au même endroit. Elle dit « papa » cinq fois par phrase. Elle chuchote ses secrets très fort.",
    oc: {
        vecu: "Née il y a huit ans au village, bien après la révolution ; elle ne connaît que la mer, la troisième barque de papa, et le Héros, comme une histoire. Son grand frère Jonas est garde depuis l'an dernier.",
        savoir: "sait le nom de cent coquillages (elle les a nommés), le bruit de la barque de papa, l'heure à laquelle Jonas craque ; ignore ce qu'est une faille (« un trou avec des monstres ? ») ; croit à tort que le monsieur au masque est un dragon déguisé"
    },
    premiere: "~Elle se relève d'un bond, pleine de sable.|T'as vu celui-là ?! Non, celui-là ! Non, attends, c'est un caillou. Je m'appelle Sora. Toi aussi t'aimes les coquillages ?",
    bonjour: {
        1: ["Papa est parti avant le soleil ! Je l'ai vu de la fenêtre ! Après je me suis rendormie. Maman dit que ça compte pas."],
        2: ["Midi ! On mange sur le sable ! Moi je mange les miettes du château. Non, je rigole. Un peu."],
        3: ["Le soir, papa rentre ! Je lui garde un coquillage ! Celui d'aujourd'hui, il est… attends… il est PARTI. Ah non, il est là."],
        4: ["Je devrais dormir. Chut. Je regarde la mer. Elle fait pareil que le jour, mais en noir."]
    },
    saisons: {
        1: ["Au printemps, la mer ramène des coquillages tout neufs ! Enfin, ils sont vieux, mais ils sont neufs pour moi."],
        2: ["L'été je nage jusqu'au rocher ! Maman dit non. Alors je nage jusqu'à presque le rocher."],
        3: ["En automne, la mer est fâchée. Elle jette tout sur la plage. Même des coquillages violets ! Merci la mer fâchée !"],
        4: ["L'hiver, la mer est trop froide pour les pieds. Je ramasse avec des gants. C'est nul, les gants, on sent pas les coquillages."]
    },
    discuter: [
        "J'en ai cent-douze ! Enfin, cent-dix. J'en ai mangé deux. C'était pas des coquillages.",
        "Jonas fait semblant de pas me voir quand il est de garde. Moi je fais des grimaces. Il craque à trois. TOUJOURS à trois.",
        "Edwin dit que mon mana est « joyeux ». Je savais. Je sais même pas ce que c'est, le mana, mais je savais.",
        "Les mouettes volent les coquillages. Non, c'est pas vrai. Mais elles volent les tartines d'Annick. C'est pareil, c'est voler."
    ],
    fil: [
        "Tu veux voir mon château ? Non, attends, il est tombé. Tu veux voir l'endroit où il ÉTAIT ? C'est presque pareil.",
        { ami: 2, t: "Papa part avant le soleil. Moi je me réveille exprès pour voir la troisième barque. Elle fait PLOUF plus fort que les autres, parce que papa met trop de filets.|Après je me rendors. Mais je l'ai vue. Ça compte." },
        { ami: 3, gestes: [
            "~Elle tient un coquillage contre son oreille, très sérieuse.",
            "Si tu trouvais un coquillage magique… tu ferais quel vœu ?",
            "Moi je sais déjà. Mais je dis pas. Toi d'abord !",
            ['choix', ["Un dragon.", "Que ton papa rentre tôt."], [
                [['retiens', 'voeu', 'dragon'], "UN DRAGON ! C'était MON vœu ! T'as volé mon vœu !", "~Elle réfléchit.", "Bon. On le partage. Un dragon pour deux. Il aura deux maisons.", ['ami', 1]],
                [['retiens', 'voeu', 'papa'], "~Elle te regarde, la bouche ouverte.", "… C'était mon AUTRE vœu. Le secret. Comment tu savais ?", "Je le dis à personne. Toi non plus.", ['ami', 1]]]]
        ] },
        { ami: 5, t: "Le monsieur au masque, au bout du ponton, le soir… Il m'a dit mon nom. Je lui avais jamais dit. Papa dit que c'est quelqu'un de la capitale.|Moi je dis que c'est un dragon déguisé. Les dragons connaissent tous les noms. C'est connu." },
        { ami: 7, t: "Jonas, il a peur que papa soit fâché. Papa, il a peur que Jonas croie qu'il est fâché. Moi je sais qu'ils sont pas fâchés, ils sont juste pareils.|Mais si je leur dis, ils vont dire « Sora, va jouer ». Alors je joue. Et je regarde." },
        { ami: 9, t: "Tu sais quoi ? Je te dis un secret. Très fort, parce que c'est un secret.|J'ai un coquillage qui s'appelle « Papa ». C'est le plus beau. Il est toujours là quand je le cherche. Comme papa.|… Le monsieur au masque, il le savait. Je l'ai jamais dit à personne. Même pas à papa." }
    ],
    souvenirs: [
        { cle: 'voeu', val: 'dragon', lignes: ["Notre dragon, j'ai décidé, il s'appelle Bouillon. Parce qu'il fait des bulles quand il nage. Tu es d'accord ? Tu es d'accord."] },
        { cle: 'voeu', val: 'papa', lignes: ["Hier papa est rentré tôt ! TRÈS tôt ! C'est le vœu ! … Bon, c'est parce qu'il pleuvait. Mais c'est le vœu quand même."] }
    ],
    ragots: [
        { de: '33:16', cle: 'garde', val: 'fier', lignes: ["Jonas il a rougi jusqu'aux oreilles et il a dit « personne » quand j'ai demandé qui. C'était toi ! C'est toujours toi !"] },
        { de: '29:25', cle: 'tomas', val: 'viendra', lignes: ["Élise, celle de la Ville, elle dit que tu lui as dit que son frère la suivrait partout. Moi aussi j'ai un frère qui me suit. Enfin, qui me surveille. C'est pareil, hein ?"] }
    ],
    nouvelles: [
        "La mer a ramené une bouteille, une fois ! Avec rien dedans. Si un jour y a quelque chose dedans, je te le dis en premier ! Enfin, en deuxième. Après papa.",
        "Annick a crié sur une mouette. La mouette a crié aussi. Annick a gagné."
    ],
    etapes: {
        0: ["Y a un trou dans la grotte ! Avec des monstres ! … Jonas dit que je dois pas dire « monstres » devant les petits. Je suis pas petite. Mais d'accord."],
        1: ["Les soldats du roi sont là ! Jonas en est un ! Enfin, il l'était déjà. Mais maintenant il y en a des VRAIS autour de lui. Il est encore plus droit."],
        2: ["Plein de gens nouveaux ! Y en a un qui m'a acheté un coquillage ! Un vrai sol ! Je l'ai donné à papa. Il a fait semblant d'être surpris. Non. Il était VRAIMENT surpris."],
        3: ["Ils sont entrés dans le trou. Jonas garde la route. Papa pêche. Moi je garde la plage. Quelqu'un doit le faire."],
        4: ["Ils sont sortis ! Edwin m'a dit que derrière il y avait de l'eau aussi ! Une autre mer ! Je veux y aller. Papa dit « dans dix ans ». C'est long, dix ans."]
    },
    triste: ["~Elle est assise, les genoux contre elle, sans ramasser.|J'ai pas envie de coquillages aujourd'hui. C'est bizarre. J'ai toujours envie. … C'est la mer qui est grise, je crois.", "J'ai rêvé que papa rentrait pas. C'était un rêve. Il est rentré. Il est là-bas, regarde. … Je le regarde encore un peu."],
    meteo: {
        pluie: ["La pluie fait des petits trous dans le sable ! Des milliers ! Je peux pas tous les compter. J'essaie."],
        orage: ["L'orage, je me cache sous la barque retournée. C'est ma maison d'orage. Y a de la place pour deux. Viens."],
        tempete: ["Tempête ! Papa est rentré, Jonas est à la tour, maman tient la porte. Moi je tiens mon chapeau."],
        neige: ["De la NEIGE sur la PLAGE ! Je fais un château blanc ! Il fond ! Je recommence ! Il fond !"],
        brouillard: ["Brouillard ! On voit plus la mer ! Elle est toujours là ? Je vais vérifier. Je reviens."]
    },
    perso: null,
    options: [
        // la quête des lucioles (le ✎ « Fille du pêcheur » de l'atelier, rendue à la vraie fille du pêcheur)
        { titre: 'Les lucioles de papa', si: C.js(Q('lucioles') + " !== 'done'"), cmds: si(C.js(Q('lucioles') + " === 'none'"),
            cat(P('Sora', "Papa sort aussi la nuit, quand les bars viennent près du bord. Mais la nuit il voit plus le fil ! Il dit des gros mots aux étoiles.|Deux bocaux à lucioles ! Comme ça il voit le fil, et moi je vois papa, de la fenêtre !"),
                D.choix(['Oui', 'Plus tard'], [
                    cat(quete('add side lucioles "Des lucioles pour papa" "Erwan, le père de Sora, pêche aussi la nuit et ne voit plus le fil. Sora cherche deux Bocaux à Lucioles."'),
                        quete('de lucioles "Sora" "Village de Pêche"'), quete('obj lucioles "Rapporter 2 Bocaux à Lucioles à Sora"'),
                        quete('prix lucioles "Appât ×5"'), quete('prix lucioles "150 or"'), quete('track lucioles'),
                        P('Sora', "Deux ! On en trouve au Marché. Ou dans la grotte, mais la grotte c'est interdit. Au Marché, alors !")),
                    P('Sora', "Bon. Mais papa il a toujours pas de lumière, hein. Je dis ça.")], { annuler: 1 })),
            si(C.js('$gameParty.numItems($dataItems[7]) >= 2'),
                cat(A.objet(7, -2), A.objet(111, 5), A.or(150), quete('done lucioles'), H.affinite(1),
                    P('Sora', "DEUX ! Je les mets dans sa barque ce soir, en secret ! Il va croire que c'est la mer qui les a apportées !|Tiens, ses appâts. Il dit que les tiens sont trop gros. C'est pas méchant, c'est un pêcheur.")),
                P('Sora', "Deux bocaux à lucioles. Papa attend la nuit. Moi aussi. Mais moi je dors avant."))) },
        // les bouteilles d'Élise (la Ville Forestière), par la rivière
        { titre: 'La bouteille…', si: C.js('$gameParty.hasItem($dataItems[130])'), cmds: cat(
            A.js('Plage.lettre();'),
            P('Sora', "UNE BOUTEILLE ! AVEC QUELQUE CHOSE DEDANS ! Lis-la-moi ! Je sais lire mais lentement, et là je suis trop pressée !"),
            si(C.vr(898, '=', 0), cat(
                P('', "~« Bonjour à qui trouve. Je m'appelle Élise, j'ai neuf ans et demi, j'habite la Ville Forestière, et j'ai jeté cette bouteille dans la rivière parce que Tomas (c'est mon frère, il a sept ans, il note tout) dit que la rivière va à la mer. »|~« Si tu existes, réponds. Si tu existes pas, c'est que Tomas a tort, et ça me ferait plaisir aussi. »"),
                P('Sora', "J'EXISTE ! Écris ! Écris vite !|« Bonjour Élise. J'existe. Je m'appelle Sora, j'ai huit ans, j'habite la mer. Enfin, à côté. Ta bouteille est arrivée sur ma plage. J'ai cent douze coquillages. Ton frère a raison, désolée. »"))),
            si(C.vr(898, '=', 1), cat(
                P('', "~« Sora ! C'est comment, la mer ? Ici il y a des arbres, des arbres, une épicerie, encore des arbres, et une grotte où on a pas le droit d'aller, alors j'y pense tout le temps. Est-ce que tu as déjà vu un dragon ? Moi non, mais je sais à quoi ils ressemblent. »"),
                P('Sora', "Elle aime les dragons ! Écris !|« La mer c'est grand, ça fait du bruit la nuit et ça sent le sel. Les dragons, j'en ai jamais vu mais j'en veux un. Si tu en vois un dans ta grotte, envoie-le par la rivière. Il saura nager. »"))),
            si(C.vr(898, '=', 2), cat(
                P('', "~« Mon papa s'appelle Kaze. Il tient l'épicerie l'après-midi et il dit presque rien, mais il chante en rangeant les bocaux quand il croit que personne écoute. Et ton papa ? »"),
                P('Sora', "Mon papa ! Écris, écris !|« Mon papa pêche. Il part avant le soleil, dans la troisième barque. Il fait semblant d'être surpris quand je lui montre un coquillage. Mon frère est garde. Il fait semblant de pas me voir. Dans ma famille tout le monde fait semblant, mais c'est gentil. »"))),
            si(C.vr(898, '=', 3), cat(
                P('', "~« Sora, est-ce que tu as peur, des fois ? Moi j'ai fait un rêve d'eau, la nuit où la grotte s'est ouverte. Un lac tout gris avec la pluie dedans. J'en ai parlé à personne sauf à toi et à Fernand. Fernand c'est un vieux. Il dit le temps. »"),
                P('Sora', "~Elle ne crie plus. Elle réfléchit longtemps.|Écris doucement. « Moi j'ai peur du monsieur au masque au bout du ponton, mais un peu seulement. Il connaît mon nom. Ton rêve, je le garde, comme un coquillage. Je le mets avec Papa. (Papa c'est mon plus beau coquillage, c'est un secret, tu le dis à personne.) »"))),
            si(C.vr(898, '>=', 4), cat(
                P('', "~« Sora. Tomas dit que la rivière va à la mer, et que la mer va partout. Alors je t'envoie la rivière. C'est tout ce que j'ai. Un jour j'irai voir la mer. Tu me montreras Papa. Je dirai rien. Ta copine (c'est la première fois que j'écris ce mot), Élise. »|~Dans la bouteille, il y a aussi une feuille de la forêt, séchée, encore très verte."),
                P('Sora', "~Elle serre la feuille contre elle.|« Élise. Viens quand tu veux. Je te montrerai Papa, et le château, et le monsieur au masque, de loin. Je dessine un coquillage violet dans le coin. C'est le plus violet. Ta copine aussi, Sora. »"))),
            A.js('Plage.lettreLue();'), H.affinite(1),
            P('Sora', "Tu lui portes ? À la Ville Forestière ? Tu passes par la rivière, c'est tout droit. Enfin, c'est tout tordu, mais ça arrive.")) },
        // sa collection : tu lui donnes un coquillage, elle le nomme
        { titre: 'Un coquillage pour toi', si: C.js('Plage.aDesCoquillages()'), cmds: cat(
            A.js('Plage.donnerCoquillage();'), A.se('Item1', 80, 120),
            si(C.vr(896, '=', 127),
                cat(P('Sora', "~Elle ne dit rien pendant trois secondes, ce qui est un record.|… Un VRAI violet. Pas un « un peu violet ». Un VRAI.|Lui, il s'appelle comme toi. Voilà. C'est décidé. Il habite à côté de Papa."), H.affinite(2)),
                cat(H.affinite(1), si(C.vr(899, '=', 1), P('Sora', "Pour moi ?! Il s'appelle… Petit-Gris. Non. Monsieur Petit-Gris. Il est poli."),
                    si(C.vr(899, '=', 2), P('Sora', "Encore un ! Lui c'est Bulle. Parce qu'il fait des bulles. Il en fait pas. Mais il pourrait."),
                        si(C.vr(899, '=', 3), P('Sora', "Trois ! Celui-là s'appelle Mardi. Parce que c'est pas mardi. Ça le rend spécial."),
                            si(C.vr(899, '=', 5), cat(P('Sora', "CINQ ! Tu sais combien ça fait, cinq ? Ça fait une main ! Tiens, pour toi. C'est une pomme. Je l'ai pas mangée. Presque pas."), A.objet(44, 1)),
                                si(C.vr(899, '=', 8), P('Sora', "Huit, comme moi ! Lui c'est Le Pas-Content. Regarde sa forme : il est pas content. Je l'aime beaucoup."),
                                    si(C.vr(899, '=', 12), P('Sora', "~Elle aligne tous tes coquillages sur le sable, en rond.|Douze. C'est ta famille de coquillages. Elle habite ici. Tu peux venir la voir quand tu veux. C'est comme une maison, mais en coquillages."),
                                        H.unParmi('Sora', ["Merci ! Lui c'est… Tempête. Non, il est trop petit. Tempête-Junior.", "Ooooh. Lui, je le mets dans la poche du milieu. C'est la poche des importants.", "Il ressemble à Jonas quand il est de garde ! Tout droit ! Il s'appelle Garde-Jonas.", "Je le compte. Cent… cent… je recommence. Cent quatorze !"]))))))))),
            P('Sora', "~Elle compte ses poches, et se trompe au même endroit.")) }
    ],
    aurevoir: ["Reviens ! Je t'en garde un ! Le deuxième plus beau !", "Au revoir ! Si tu vois un dragon, dis-lui où j'habite !"]
}),

/* ── Edwin (33:22) — 18 ans, « l'Encyclopédie Vivante », il part d'ici ──── */
'33:22': Object.assign(marin('33:22', ['lieux', 'scenes', 'avis', 'aCote', 'amitie']), {
    voix: "Vite quand il est excité, et il l'est souvent ; des parenthèses dans les parenthèses ; il compte ses points sur ses doigts et il y en a toujours un de plus (JOKO). Patient avec qui ne sait pas. Il dit « Pose-la-moi ! ».",
    oc: {
        age: '18 ans',
        vecu: "Grandi au village, au-dessus du poisson d'Annick. Sa mémoire s'est révélée sur un grimoire de Parole retenu en une seule lecture ; entré à l'Académie Rubis, chétif et trop enthousiaste, il corrigeait des élèves deux fois plus âgés (JOKO). Six ans plus tard, filière de la Parole, il n'a jamais franchi de faille : les filières d'érudition ne descendent pas dans la Faille Captive. Sa première sera celle-ci.",
        savoir: "sait tout ce qu'il a lu — les rapports d'expédition, les règles de la Chute, la Chancellerie, l'histoire des sept royaumes ; ignore ce que ça fait, une faille, de l'intérieur ; croit à tort que sa mère ne sait pas lire"
    },
    premiere: "Oh ! Bonjour ! Edwin Bramble, sixième année à l'Académie Rubis, filière de la Parole — enfin, apprenti maître de Parole, la nuance compte, le règlement la précise à l'article… pardon.|Bonjour. Je suis né ici. Ça ne se voit pas, à cause des lunettes. Ça se sent, à cause du poisson.",
    bonjour: {
        1: ["Bonjour ! Le mana de la mer est plus clair le matin. Positif. Très doux. Je l'ai noté. Deux fois. Trois."],
        2: ["Midi ! Maman veut que je mange. J'ai lu un traité sur la digestion. Elle dit que ce n'est pas pareil. Elle a raison, statistiquement."],
        3: ["Bonsoir ! Le soir, le mana de la grotte remonte avec le vent. Je le vois d'ici. Ne le dis pas à maman."],
        4: ["Je ne dors pas. Ce n'est pas les livres. … Si. C'est les livres. Un peu."]
    },
    saisons: {
        1: ["Le printemps ! Le maquereau revient. Je sais exactement pourquoi. Tu veux savoir pourquoi ? C'est long. C'est très bien."],
        2: ["L'été, à Rubis, c'est les examens. Ici, c'est les rougets. Je préfère les rougets. Ne le répète pas au doyen."],
        3: ["L'automne, la mer est agitée. Le mana aussi. Les deux sont corrélés. Ou c'est moi qui suis agité. Les trois, peut-être."],
        4: ["L'hiver, je relis tout. Tout ce que j'ai lu. Ça prend l'hiver entier. C'est parfait."]
    },
    discuter: [
        "Mon héritage s'appelle « N'oublie jamais » : ce que j'ai lu, je le garde. Ça ne veut pas dire que je comprends tout. Ça veut dire que je peux comparer. Et comparer, c'est le début de comprendre.",
        "Ignorer quelque chose, ce n'est pas une faute. C'est une question à laquelle personne n'a encore répondu. Pose-la-moi !",
        "Mes lunettes me montrent la nature du mana : positif, négatif, spirituel. Le tien est… non, je te le dirai quand tu seras prêt. Ou maintenant. Tu es prêt ?",
        "Je suis du soutien : la Parole qui soigne, celle qui protège. Je n'ai pas la force brute des duellistes. Mais je sais ce qu'ils vont faire avant eux."
    ],
    fil: [
        "Tu savais qu'une expédition, c'est neuf étapes ? Le signalement, l'évaluation, le permis, l'équipe, l'entrée, l'exploration, le Nœud, l'extraction, le rapport.|Je les connais par cœur depuis la première année. Je n'en ai fait aucune. Bientôt, quatre ou cinq. Si tout va bien. Neuf, si tout va très bien.",
        { ami: 2, t: "Les filières d'érudition ne descendent jamais dans la Faille Captive. Les duellistes y vont dès la cinquième année. Moi, j'y suis allé… en lecture. Tous les rapports. Tous.|Je sais à quoi ressemblent cinquante zones. Je n'ai jamais senti l'odeur d'une seule." },
        { ami: 3, gestes: [
            "~Il enlève ses lunettes et les essuie, longtemps, sans raison.",
            "Je peux te poser une question ? Pour une fois que ce n'est pas moi qui réponds.",
            "Quand on a peur… il vaut mieux le savoir, ou ne pas le savoir ?",
            ['choix', ["Le savoir. La peur est une information.", "Ne pas le savoir. Ça laisse avancer."], [
                [['retiens', 'peur', 'information'], "~Il remet ses lunettes, et il sourit.", "« La peur est une information. » C'est… c'est ma phrase. Tu me la rends. Je la range avec les autres. Elle est plus légère, rendue.", ['ami', 1]],
                [['retiens', 'peur', 'avancer'], "Ne pas le savoir…", "~Il compte sur ses doigts, s'arrête à un.", "C'est la seule chose que je ne saurais pas faire. Ne pas savoir. Il faudra que j'apprenne. Avant la grotte.", ['ami', 1]]]]
        ] },
        { ami: 5, t: "Maman croit que je ne dors pas à cause des livres. Je ne dors pas à cause de la faille. Je range ma peur avec les autres informations, et elle déborde.|Et elle croit que je ne sais pas qu'elle lit mes carnets la nuit. Je laisse des phrases pour elle, en bas des pages. Elle ne les a pas encore trouvées." },
        { ami: 7, t: "Il paraît que derrière une faille, le monde ne ressemble pas à la taille de l'entrée. Une grotte peut ouvrir sur une plaine, un marais, une mer. Je l'ai lu cent fois.|Je ne l'ai jamais cru. Pas vraiment. On ne croit pas ce qu'on lit. On croit ce qu'on a vu une fois." },
        { ami: 9, gestes: [
            "~Il est assis sur le sable, les pieds dans l'eau, sans carnet.",
            "Quand je reviendrai, je vais tout raconter à maman. Tout. Pendant trois heures. Elle ne m'arrêtera pas, elle l'a promis.",
            "Et si je ne trouve pas les mots ? C'est la première fois que j'ai peur de ne pas trouver les mots.",
            ['choix', ["Tu les trouveras.", "Elle n'a pas besoin des mots."], [
                [['retiens', 'mots', 'trouver'], "~Il hoche la tête, trop vite, plusieurs fois.", "Oui. Oui. Je les trouverai. J'en ai beaucoup en réserve.", ['ami', 1]],
                [['retiens', 'mots', 'pas'], "~Il regarde vers la maison, où une lanterne est allumée.", "… Non. Elle a besoin que je rentre. Les mots, c'est pour moi.", ['ami', 1]]]]
        ] }
    ],
    souvenirs: [
        { cle: 'peur', val: 'information', lignes: ["J'ai noté ta phrase dans le carnet de la grotte. Page une. C'est la seule page sans formule."] },
        { cle: 'peur', val: 'avancer', lignes: ["Hier, j'ai essayé de ne pas savoir quelque chose. Une heure entière. J'ai tenu quatre minutes. C'est un début."] },
        { cle: 'mots', val: 'pas', lignes: ["Maman m'a demandé ce que tu m'avais dit. J'ai dit : rien. Elle a souri. Elle sait que c'est faux. Elle sait toujours."] }
    ],
    ragots: [
        { de: '33:18', cle: 'don', val: 'gagne', lignes: ["Emma s'est entraînée trois heures de plus après t'avoir parlé. Trois ! Elle dit que c'est « une conséquence ». J'ai noté le mot. C'est très Emma."] },
        { de: '33:24', cle: 'lettres', val: 'dire', lignes: ["Maman m'a dit qu'elle ne comprenait pas mes lettres. Elle a dit que quelqu'un lui avait dit de me le dire. … Je vais les réécrire. Plus court. Je vais essayer."] }
    ],
    nouvelles: [
        "Je suis rentré au village pour une expédition : plusieurs élèves, une faille sauvage, la garde royale qui nous encadre. C'est ma première fois. J'ai lu tout ce qui existe sur le sujet. Deux fois.",
        "Emma Fieldensong est ici aussi. Elle m'appelle « l'Encyclopédie ». Je crois que c'est un compliment. Je l'ai noté comme tel.",
        "Les navires d'Ilmarée qui passent au large transportent du grain d'Aurevel. La moitié du continent mange notre blé. Ça m'émeut, et je ne sais pas expliquer pourquoi."
    ],
    etapes: {
        0: ["La Chancellerie a déclaré la faille. Niveau un, provisoire. Les filières d'érudition n'ont jamais de première faille aussi proche de chez elles. Maman n'est pas contente que ce soit si proche. Moi non plus. Pour d'autres raisons."],
        1: ["La garde royale est là. C'est elle qui encadre les premières failles des élèves, c'est écrit dans le règlement, article… pardon. Jonas est fier comme une mouette. Ça lui va bien."],
        2: ["Les groupes sont affichés ! Groupe A : moi, avec \\N[1] et \\N[3]. \\N[4] est dans le groupe B. J'ai déjà lu leurs dossiers. Ne leur dis pas."],
        3: ["Nous entrons demain. J'ai préparé trois carnets, sept crayons, et une phrase pour maman. Je ne la lui dirai que si je reviens. Je veux dire : quand je reviendrai."],
        4: ["Je suis revenu. Ce n'est pas comme dans les rapports. Rien n'est comme dans les rapports. J'ai besoin de trois carnets neufs. Et de dormir. Et de raconter. Dans cet ordre-là, ou pas."]
    },
    triste: ["~Il a les lunettes sur le front, et les yeux rouges.|Rien. J'ai relu un rapport d'expédition. Une de celles qui ne sont pas revenues entières. Je n'aurais pas dû le relire. Je le relirai quand même.", "Ce matin, le mana de la mer était gris. Ça n'existe pas, un mana gris. Je l'ai vu quand même. Je ne l'ai pas noté."],
    meteo: {
        pluie: ["La pluie ne change pas la nature du mana, seulement sa densité apparente. … Je suis trempé. Ça, c'est une donnée."],
        orage: ["L'orage ! Le mana de la foudre est spectaculaire à travers mes lunettes. Maman dit de rentrer. Encore une minute. Deux."],
        tempete: ["Tempête. Je relis les chapitres sur les tempêtes, dans la cuisine. Maman dit que lire la tempête ne l'arrête pas. Elle a raison."],
        neige: ["La neige ! Chaque flocon est différent. Non, c'est faux, c'est un mythe. Mais j'aime bien le mythe."],
        brouillard: ["Brouillard. Mes lunettes voient le mana à travers. Les gens, non. Je me suis cogné contre Régis. Il m'a salué."]
    },
    perso: null,
    aurevoir: ["Au revoir ! Et si tu as une question, n'importe laquelle, vraiment n'importe laquelle…", "À bientôt ! J'ai encore trois choses à te dire. Quatre."]
}),

/* ── Régis (33:23) — 76 ans, la Mouette Grise, le grain par la côte ──────── */
'33:23': {
    voix: "Grandiloquent, nostalgique ; il salue tout le monde comme des officiers, « matelot » ; ses tempêtes grandissent chaque année. Quand il parle de la famine, il ne fait plus de phrases longues.",
    oc: {
        vecu: "Né au village. Capitaine de la Mouette Grise, un caboteur à grain, pendant trente ans : il portait le blé d'Aurevel le long de la côte de l'est, avec les convois d'Ilmarée. Sous le roi Thibaut, il a chargé le grain des taxes pendant que le village avait faim ; après la révolution, il a ramené du grain au port. À la retraite depuis dix ans. Il juge le concours de pêche.",
        savoir: "sait la côte de l'est, les vents, les convois d'Ilmarée, les règles de la mer ; ignore les failles, qu'il appelle « un récif dans la terre » ; croit à tort que plus personne ne se souvient de la famine"
    },
    premiere: "~Il se redresse, main sur le cœur.|Capitaine Régis, de la Mouette Grise ! En retraite, mais en uniforme. J'ai porté le grain d'Aurevel sur toute la côte de l'est, matelot. Toute. Enfin, la moitié. La bonne.",
    bonjour: {
        1: ["Mes respects, matelot ! La marée est bonne. Je n'ai pas de bateau, mais la marée est bonne."],
        2: ["Midi ! À bord, on mangeait à la cloche. Ici, on mange quand Annick crie. C'est presque pareil."],
        3: ["Le soir, sur la Mouette, on chantait. Je chante encore. Personne ne me le demande. Personne ne m'en empêche."],
        4: ["Quart de nuit, matelot ! Je ne dors plus depuis trente ans. Le quart, ça ne s'arrête jamais vraiment."]
    },
    saisons: {
        1: ["Le printemps, les convois repartaient vers l'est. On larguait à l'aube. Je larguerais encore. Je n'ai plus d'amarres."],
        2: ["L'été, le calme plat. Trois jours sans un souffle, une fois ! Ou trois heures. À mon âge, les heures sont longues."],
        3: ["L'automne, la saison du grain ! La Mouette s'enfonçait jusqu'au pont, tant elle était lourde. Ça, c'était un bateau qui travaillait."],
        4: ["L'hiver, on ne naviguait pas. On réparait. Comme Orin. Lui, il n'a jamais arrêté l'hiver."]
    },
    discuter: [
        "J'ai affronté une tempête de trois jours au large de la côte de l'est. Ou de trois heures. La mer ne tient pas de registre, moi si. Il a pris l'eau.",
        "Les navires d'Ilmarée sont plus rapides que la Mouette ne l'a jamais été. Ils ont du marbre jusque dans les cales. Nous, on avait du grain. Le grain, ça nourrit. Le marbre, essaie de le manger.",
        "Jonas m'écoute. C'est un bon garçon. Il fera un bon garde. Moins bon matelot, mais personne n'est parfait.",
        "Gustave a examiné mon sabre. Il a dit « bien entretenu ». Rien d'autre. Je préfère les légendes aux Essayeurs."
    ],
    fil: [
        "La Mouette Grise ! Un caboteur à grain, trente ans de côte. Elle partait d'ici, ventre plein, et suivait les convois d'Ilmarée vers l'est. On était les plus petits. On était les plus fiers.",
        { ami: 2, t: "Aurevel nourrit la moitié du continent, matelot. Ça se dit vite. Moi, je l'ai porté, ce blé. Sac par sac. Le dos s'en souvient mieux que la tête." },
        { ami: 3, gestes: [
            "~Il pose la main sur la garde de son sabre.",
            "Mon sabre est une légende. Tout le monde le sait. Enfin. Tout le monde le dit.",
            "Toi, matelot. Une belle légende… ça vaut mieux qu'une petite vérité ?",
            ['choix', ["La légende, capitaine.", "La vérité, même petite."], [
                [['retiens', 'sabre', 'legende'], "~Il se redresse de dix centimètres.", "La légende ! Bien répondu ! Tu feras un excellent second. Rompez !", ['ami', 1]],
                [['retiens', 'sabre', 'verite'], "~Il regarde son sabre, longtemps.", "… C'est un bon sabre. Ordinaire. Gustave l'a dit, et je le savais avant lui. Garde ça pour toi, matelot.", ['ami', 1]]]]
        ] },
        { ami: 5, t: "Sous le vieux roi… Je chargeais le grain des taxes. Le grain du roi. Le village avait faim, sur le quai, et je chargeais.|Orin remplissait les seaux avec ses poissons. Moi je remplissais les cales avec le blé. On se regardait. On ne s'est jamais rien dit.|… Voilà. Je n'en parle pas. Je viens d'en parler." },
        { ami: 7, t: "Après la révolution, le premier voyage, je l'ai fait dans l'autre sens. Du grain qui arrivait. Au port, les gens pleuraient sur les sacs.|C'est le seul jour où je n'ai pas exagéré. Il n'y avait rien à ajouter." },
        { ami: 9, t: "La Mouette a coulé à quai, un soir de fête, il y a dix ans. Pas en tempête. Trop de monde à bord, trop de bière. Je n'étais même pas dessus.|J'ai pris ma retraite le lendemain. Un capitaine sans bateau, ça s'appelle un vieux. Je préfère « capitaine ». Tu m'appelleras capitaine, matelot." }
    ],
    souvenirs: [
        { cle: 'sabre', val: 'legende', lignes: ["Mon second ! Te revoilà ! J'ai raconté à Jonas que tu avais choisi la légende. Il a dit « évidemment ». Bon garçon."] },
        { cle: 'sabre', val: 'verite', lignes: ["J'ai repensé à ta petite vérité. Je l'ai racontée à Gustave. Il a dit « enfin ». Je ne sais pas si c'était un compliment."] }
    ],
    ragots: [
        { de: '33:17', cle: 'reparer', val: 'avant', lignes: ["Orin dit que tu répares « comme avant ». C'est une réponse de vieux. Je l'aime bien. Nous sommes deux vieux à l'aimer."] }
    ],
    nouvelles: [
        "Trois voiles d'Ilmarée au large, ce matin. Des trois-mâts. Je les ai saluées. Elles n'ont pas répondu. Elles ne répondent jamais. Je salue quand même.",
        "Le concours de pêche ! Je suis le juge. C'est moi qui pèse. La balance est celle de la Mouette. Elle est juste. À peu près."
    ],
    etapes: {
        0: ["Une faille dans la grotte. Un récif dans la terre, voilà ce que c'est. On ne navigue pas sur un récif, matelot. On l'évite."],
        1: ["La garde royale ! J'ai passé leur rang en revue. Ils ne m'avaient rien demandé. Ils se sont mis au garde-à-vous quand même. Bonne troupe."],
        2: ["Des aventuriers sur la plage ! Ils m'ont demandé où était la grotte. Je leur ai montré le nord. C'est là. Je n'y suis jamais allé. Le nord, c'est pas la mer."],
        3: ["Ils sont entrés. J'ai mis mon uniforme. Je l'ai gardé toute la journée. On ne quitte pas l'uniforme pendant que l'équipage est en mer."],
        4: ["Ils sont rentrés ! Comme un convoi au port ! J'ai fait sonner la cloche de la Mouette. Je l'ai gardée, la cloche. Elle n'a pas coulé, elle."]
    },
    triste: ["~Il est assis, l'uniforme mal boutonné, sans rien dire.|… Pardon, matelot. Ce matin, j'ai pensé au quai. Sous le vieux roi. Ça revient, certains jours.", "Je n'ai pas exagéré une seule fois aujourd'hui. Pas une. Ce n'est pas un bon jour."],
    meteo: {
        pluie: ["Une petite pluie ! Sur la Mouette, on appelait ça du beau temps. Rompez !"],
        orage: ["L'orage ! Tous à vos postes ! … Il n'y a pas de postes. Je rentre."],
        tempete: ["La tempête ! Celle de trente-deux, c'était la vraie. Celle-ci, c'est une brise. Une grosse brise. Je rentre quand même, par discipline."],
        neige: ["La neige sur la mer ! On en voyait au large de l'est, les hivers où on naviguait trop tard. Magnifique. Dangereux. Magnifique."],
        brouillard: ["Brouillard ! Sur la Mouette, on sonnait la cloche toutes les minutes. Ici, personne ne sonne. Je fredonne."]
    },
    perso: null,
    options: [
        { titre: 'Le concours', si: C.js('Plage.concours(true)'), cmds: si(C.js('Plage.dejaPese()'),
            P('Régis', "Déjà pesé, matelot ! Une prise, une pesée. Le règlement, c'est le règlement. Je viens de l'inventer, mais c'est le règlement."),
            si(C.js('!Plage.concours()'),
                P('Régis', "La pesée se fait de huit heures à dix-sept heures, matelot ! Le concours a ses heures. Comme la marée."),
                si(C.js('Plage.prise() <= 0'),
                    P('Régis', "Rien pris aujourd'hui ? Le concours, c'est pour ceux qui pêchent ! Va voir Erwan, il te prêtera une canne. Il prête tout. Sauf sa barque."),
                    cat(P('Régis', "Pesée officielle ! Le plus lourd de la journée, sur la balance de la Mouette Grise. Elle est juste. À peu près."),
                        A.js('Plage.pesee();'),
                        P('Régis', "Roul : \\V[894] grammes. Tobin : \\V[895] grammes. Et toi, matelot : \\V[892] grammes !"),
                        si(C.vr(893, '=', 1), P('Régis', "PREMIER ! La bourse du premier, matelot ! … Roul fait une tête. Tobin aussi. C'est la même tête. Ils ne le savent pas."),
                            si(C.vr(893, '=', 2), P('Régis', "Deuxième ! La bourse du deuxième. Roul jure qu'il recommencera la pesée l'an prochain. Il jure ça tous les ans."),
                                P('Régis', "Troisième. La petite bourse. Ne fais pas cette tête : j'ai fini troisième six fois. Je compte celle-ci comme une victoire."))))))) }
    ],
    aurevoir: ["Bon vent, matelot !", "Rompez ! … Avec respect."]
},

/* ── Annick (33:24) — 46 ans, le poisson, Edwin, « Tu as mangé ? » ──────── */
'33:24': Object.assign(marin('33:24', ['lieux', 'scenes', 'avis', 'aCote', 'amitie']), {
    voix: "Bavarde, drôle, lucide : trois sujets par phrase et elle retombe toujours sur « Tu as mangé ? ». Fière de son fils et terrifiée pour lui dans la même phrase. Elle vide un poisson en parlant sans regarder ses mains.",
    oc: {
        vecu: "Née au village. Jeune fille sous la famine du roi Thibaut, elle a partagé des harengs à quatre ; depuis, elle demande à tout le monde s'il a mangé. Elle vend le poisson des barques au marché du port. Son fils Edwin est à l'Académie Rubis depuis six ans ; elle a appris à lire en cachette pour ses carnets.",
        savoir: "sait le prix de chaque poisson, les ragots du port, qui ment sur la taille de ses prises ; ignore tout du mana et de la Parole (« des mots, mais plus chers ») ; croit à tort qu'Edwin ne sait pas qu'elle lit ses carnets"
    },
    premiere: "~Elle écaille un poisson sans regarder.|Bonjour ! Annick. Le poisson, c'est moi. Le fils qui parle trop, c'est le mien. Tu as mangé ? Non. Ça se voit. Assieds-toi.",
    bonjour: {
        1: ["Le poisson du matin ! Frais comme un ragot ! Tu as mangé ?"],
        2: ["Midi ! Tout le monde mange sur le sable, et toi tu restes debout ? Assis. Tartine."],
        3: ["Le soir, je compte la caisse. Je me trompe toujours en ma faveur. C'est un don."],
        4: ["Il est tard. Edwin dort ? Non. Il lit. Il lit toujours. Moi aussi, d'ailleurs. … Je n'ai rien dit."]
    },
    saisons: {
        1: ["Le printemps, le maquereau ! Les gens de la Ville en veulent tous. Je le vends deux fois plus cher. Ils sont contents. Tout le monde est content."],
        2: ["L'été, les mouettes sont insupportables. Elles volent tout. Même les tartines. SURTOUT les tartines."],
        3: ["L'automne, le hareng. On le sale, on le fume, on le mange tout l'hiver. Quand j'étais jeune, on le mangeait tout l'hiver aussi. Mais à quatre, le même."],
        4: ["L'hiver, je fais de la soupe. Tout le village passe. Je ne sais pas comment ils savent. Ils savent."]
    },
    discuter: [
        "Erwan me vend sa pêche. Il ment pas sur la taille. C'est le seul. Ça me déstabilise.",
        "Roul m'a vendu un bar « gros comme sa jambe ». C'était un maquereau. Je l'ai revendu « gros comme ma jambe ». J'ai des petites jambes.",
        "Edwin m'écrit des lettres de six pages. Je comprends une ligne sur dix. La dixième, c'est toujours « tu me manques ». Ça suffit.",
        "La petite Sora vient chaque jour me montrer un coquillage. Je fais semblant d'être surprise. Comme son père. On fait tous semblant, ici. C'est notre façon d'être gentils."
    ],
    fil: [
        "Tu as mangé ? Non, vraiment, tu as mangé ? Tiens. Une tartine. Deux. Edwin mange pas, alors je nourris les autres. Ça me calme.",
        { ami: 2, t: "Quand j'avais dix-huit ans, sous le vieux roi, on se partageait un hareng à quatre. Ma mère coupait. Elle se gardait la queue. Elle disait qu'elle préférait la queue.|Depuis, je demande à tout le monde s'il a mangé. Ça agace. Ça m'est égal, que ça agace." },
        { ami: 3, gestes: [
            "~Elle s'essuie les mains sur son tablier, longtemps, comme pour gagner du temps.",
            "Je peux te dire un truc ? Edwin m'écrit des lettres. Longues. Pleines de mots de l'académie.",
            "Je comprends une ligne sur dix. Toi, tu crois qu'il faut lui dire ? Que je comprends pas ?",
            ['choix', ["Dis-lui. Il expliquera.", "Garde-le. C'est ton secret."], [
                [['retiens', 'lettres', 'dire'], "Il expliquera… Oui. Il adore expliquer. Ça va prendre trois heures.", "~Elle sourit, les yeux mouillés.", "C'est exactement ce que je veux. Trois heures. Merci.", ['ami', 1]],
                [['retiens', 'lettres', 'garder'], "~Elle hoche la tête, vite.", "Oui. Je le garde. Comme ça il continue d'écrire long. Si je lui dis, il va écrire court. Je veux pas court.", ['ami', 1]]]]
        ] },
        { ami: 5, t: "Il part bientôt, dans la grotte, avec la garde du roi et les autres élèves. Je lui fais des tartines contre. Ça sert à rien, des tartines contre une faille. Je le sais.|Je les fais quand même. Il les mange quand même. On est pareils, lui et moi. On sait que ça sert à rien, et on le fait." },
        { ami: 7, t: "La nuit, je lis ses carnets. Il écrit « mana » cent fois par page. Je sais pas ce que c'est, le mana.|Mais l'autre nuit, en bas d'une page, il y avait écrit, tout petit : « Maman, si tu lis ça, va dormir. » … Il sait. Il a toujours su. Je me suis pas couchée. Je l'ai relue jusqu'au matin." },
        { ami: 9, gestes: [
            "~Elle ferme son étal, et regarde vers le ponton.",
            "Le soir où ils partiront, je l'accompagnerai jusqu'au bout du ponton. Il va parler, parler. Moi je vais rien dire, pour une fois.",
            "Tu viendras ? Pas pour lui. Pour moi. Quelqu'un doit me dire « il va revenir », et je crois que je le croirai mieux de toi.",
            ['choix', ["Je viendrai. Il va revenir.", "Je viendrai."], [
                [['retiens', 'ponton', 'revenir'], "~Elle te serre la main, fort, avec des écailles.", "Il va revenir. Bon. Voilà. C'est dit. Maintenant, tu as mangé ?", ['ami', 1]],
                [['retiens', 'ponton', 'venir'], "~Elle hoche la tête.", "Ça suffit. Être là, ça suffit. Les mots, c'est Edwin qui les a tous.", ['ami', 1]]]]
        ] }
    ],
    souvenirs: [
        { cle: 'lettres', val: 'dire', lignes: ["Je lui ai dit ! Pour les lettres ! Il a pleuré, et il m'a tout expliqué. Trois heures. J'ai rien compris, et c'était parfait."] },
        { cle: 'lettres', val: 'garder', lignes: ["Il m'a écrit huit pages, cette fois. Huit ! J'ai gardé mon secret. Tu vois que ça marche."] },
        { cle: 'ponton', val: 'revenir', lignes: ["« Il va revenir. » Je me le répète en vidant les poissons. Un poisson, une fois. J'ai vidé quarante poissons ce matin."] }
    ],
    ragots: [
        { de: '33:22', cle: 'peur', val: 'information', lignes: ["Edwin dit que tu lui as rendu sa phrase sur la peur. Il me l'a dite au dîner. Moi aussi, j'ai peur. Je l'ai rangée avec les tartines."] },
        { de: '33:31', cle: 'jonas', val: 'lance', lignes: ["Erwan m'a dit que son fils avait « choisi ». Erwan, qui dit trois mots par semaine ! C'est toi, ça. Tiens, une tartine. C'est pour ça."] }
    ],
    nouvelles: [
        "Les gens de la capitale paient le rouget le double. Je leur vends le double. Ils disent merci. La capitale, c'est un drôle d'endroit.",
        "Régis organise le concours de pêche. Il pèse avec la balance de son bateau. Le bateau a coulé. La balance, non. Elle ment un peu. Comme Régis."
    ],
    etapes: {
        0: ["Une faille dans la grotte, et c'est là que mon fils va faire sa première. À une demi-journée de sa mère. L'académie aurait pu choisir plus loin. Elle a choisi ici. Je sais pas si je dois remercier ou crier."],
        1: ["Les soldats du roi sont là. Ils mangent beaucoup. Je les nourris. Ils protégeront mieux le ventre plein, c'est connu."],
        2: ["Des aventuriers partout. Ils m'achètent tout le poisson, cru, cuit, salé. J'ai monté les prix. Ils ont pas vu. Ils regardent la grotte, pas les prix."],
        3: ["Il est entré ce matin. Il m'a dit « à tout à l'heure ». À tout à l'heure ! Comme s'il allait au marché ! … Je vais sur le ponton. Je reviens. Non. Je reste."],
        4: ["Il est revenu. Il parle depuis ce matin. Il m'explique tout. Trois heures, il m'avait promis. Ça fait cinq. Je l'arrête pas. Je l'arrêterai jamais."]
    },
    triste: ["~Elle a arrêté d'écailler. Le couteau dans la main, immobile.|Rien. J'ai pensé à ma mère, et à la queue du hareng. Ça me prend, certains jours. Tu as mangé, toi ?", "Ce matin, j'ai mis trois bols. Pour Edwin, pour moi, et un pour quelqu'un. Je sais plus pour qui. C'est la grotte, je crois. Elle remue."],
    meteo: {
        pluie: ["La pluie ! Le poisson se vend mal sous la pluie. Les gens restent chez eux. Je leur apporte. C'est ça, le commerce."],
        orage: ["L'orage ! Edwin est dehors ? Il est dehors. Il regarde la foudre avec ses lunettes. EDWIN !"],
        tempete: ["Tempête. Les barques sont rentrées. Je compte les pêcheurs. Tous là. Bon. Je respire."],
        neige: ["La neige ! Le poisson se garde bien, par la neige. Moi aussi. Je me garde bien."],
        brouillard: ["Brouillard ! Je crie le prix du poisson plus fort. Les gens suivent ma voix. Ça marche mieux qu'une lanterne."]
    },
    perso: null,
    options: [
        { titre: 'Acheter du poisson', cmds: [[302, 0, [0, 45, 0, 0, false]], [605, 0, [0, 46, 0, 0]]] },
        { titre: 'Vendre ma pêche', si: C.js('Plage.aDuPoisson()'), cmds: cat(
            A.js('Plage.vendre();'), A.se('Coin', 80, 100),
            si(C.vr(890, '>=', 10),
                P('Annick', "\\V[890] poissons ! Tu as vidé la mer ou quoi ? \\V[891] pièces. Je te les prends au prix de la capitale, va. Ne le dis pas à Roul, il va pleurer."),
                P('Annick', "\\V[890] poisson(s), \\V[891] pièces. Au prix de la capitale. Pour toi. Les autres, je les vole un peu. Toi non. Tu as mangé ?"))) }
    ],
    aurevoir: ["Et reviens manger !", "File. Et mange quelque chose. N'importe quoi. Pas des livres."]
}),

/* ── Gustave (33:43) — 48 ans, l'Essayeur, ce que remontent les filets ────── */
'33:43': {
    voix: "Précis, cérémonieux, très patient avec les gens pressés. Il pèse chaque mot comme une relique. Il dit « inspecté » et jamais « garanti ».",
    oc: {
        vecu: "Essayeur de la Confrérie des Reliquaires depuis vingt ans, à la Halle aux Ossements de Haute-Taville. Envoyé ici parce qu'un pêcheur — Erwan — a remonté quelque chose dans ses filets. Il est resté : la faille déclarée, l'expédition viendra, et ce qu'elle rapportera devra être inspecté.",
        savoir: "sait lire un sceau de la Confrérie (le fabricant, le rang, la provenance, le comportement, l'entretien et les limites), reconnaître un faux, ce que rapportent les Chapitres ; ignore la mer, les poissons, tout ce qui ne se démonte pas ; croit à tort que le sabre de Régis l'ennuie"
    },
    premiere: "Gustave, Essayeur de la Confrérie des Reliquaires. Un pêcheur a remonté quelque chose dans ses filets ; je suis venu l'inspecter. Je suis resté. On ne quitte pas une côte qui rend des choses.",
    bonjour: {
        1: ["Bonjour. Vous n'avez rien trouvé dans vos filets, vous ?", "~Il polit une loupe à trois verres avec un soin infini.|Bonjour."],
        2: ["Midi. J'ai inspecté le pain d'Annick. Il est excellent. Ce n'est pas une relique. C'est mieux."],
        3: ["Le soir, la lumière rasante révèle les faux sceaux. C'est mon heure préférée."],
        4: ["Je ne dors pas. Je trie mes faux sceaux. J'en ai cent trois. Cent quatre, peut-être, demain."]
    },
    saisons: {
        1: ["Au printemps, la Halle aux Ossements déborde. Ici, rien. C'est reposant. C'est un peu ennuyeux. C'est surtout reposant."],
        2: ["L'été, les faussaires travaillent plus. La chaleur fait briller les faux. Personne ne sait pourquoi. Moi si."],
        3: ["L'automne, la Confrérie prépare la Vente d'Hiver. Je n'y serai pas. Je serai ici, à attendre ce que la mer rendra."],
        4: ["L'hiver, mes gants ne suffisent pas. Une relique froide se lit mal. Moi aussi."]
    },
    discuter: [
        "Le sceau de la Confrérie consigne le fabricant, le rang, la provenance, le comportement, l'entretien et les limites d'une relique. C'est la preuve d'une inspection dont quelqu'un répond. Pas une garantie.",
        "Ne réparez jamais une relique vous-même. Jamais. Une relique réparée par un amateur garde sa forme et perd sa nature.",
        "Régis me fait examiner son sabre tous les jours. Je dis « bien entretenu ». C'est vrai. C'est tout ce que je dis. Il a besoin du reste.",
        "Les faux sceaux sont un commerce tenace. J'en ai démasqué cent trois. Je les garde. Ils sont beaux, à leur façon. Le crime a du soin."
    ],
    fil: [
        "Vous voulez savoir ce qu'Erwan a remonté ? Une boucle de ceinturon. Ordinaire. Mais le métal ne venait pas d'ici. Ni d'Aurevel, ni d'Ilmarée.|J'ai écrit « provenance : inconnue » dans mon rapport. C'est la phrase que je déteste le plus écrire.",
        { ami: 2, t: "Mon père était forgeron de reliques. Il réparait ce qu'il n'aurait pas dû. Une fois, une relique a gardé sa forme et perdu sa nature, dans les mains d'un garde.|Depuis, je ne répare rien. J'inspecte. Je dis ce qui est. C'est moins beau. C'est plus sûr." },
        { ami: 3, gestes: [
            "~Il te tend deux sceaux de cire, identiques à l'œil nu.",
            "L'un est vrai. L'autre est faux. Je vous pose une question que je pose à mes apprentis.",
            "Un sceau honnête qui ne garantit rien, ou un faux qui promet tout. Lequel vous rassure ?",
            ['choix', ["Le vrai. Même s'il ne promet rien.", "Le faux. Au moins il promet."], [
                [['retiens', 'sceau', 'vrai'], "~Il range les deux sceaux, satisfait.", "Bonne réponse. Rare réponse. La plupart des gens veulent être rassurés plus qu'informés.", ['ami', 1]],
                [['retiens', 'sceau', 'faux'], "~Il soupire, sans reproche.", "C'est la réponse de tous mes clients. C'est pour ça que les faussaires mangent mieux que moi.", ['ami', 1]]]]
        ] },
        { ami: 5, t: "La Confrérie est née en même temps que les guildes et la Chancellerie, quand Aurevel a appris à vivre avec les failles. Elle a deux siècles. Elle a vu passer tout ce qu'on rapporte des Chapitres.|Et pourtant, chaque objet nouveau me fait trembler les mains. Comme le premier jour. C'est pour ça que je reste Essayeur, et pas Maître." },
        { ami: 7, t: "Le sabre de Régis. Je l'ai examiné cent fois. C'est un bon sabre, ordinaire, bien entretenu.|Mais la garde est usée à un endroit précis : là où on tient un sabre quand on a peur. Trente ans de peur, bien tenue. Ça, ce n'est pas ordinaire. Je ne lui ai jamais dit." },
        { ami: 9, t: "Quand l'expédition reviendra, j'aurai du travail. Des braises, des matériaux, des objets qui n'ont pas de nom. Je les inspecterai un par un.|Et pour chacun, j'écrirai qui en répond. C'est ça, mon métier. Que quelqu'un réponde. Le monde tient avec ça." }
    ],
    souvenirs: [
        { cle: 'sceau', val: 'vrai', lignes: ["J'ai raconté votre réponse à mon apprenti, par lettre. Il m'a répondu « et alors ? ». Il a encore beaucoup à apprendre."] },
        { cle: 'sceau', val: 'faux', lignes: ["J'ai repensé à votre réponse. Elle est humaine. Elle est fausse, mais humaine. Les deux ne s'excluent pas."] }
    ],
    ragots: [
        { de: '33:23', cle: 'sabre', val: 'verite', lignes: ["Régis m'a dit qu'il savait, pour son sabre. Il a dit que quelqu'un lui avait posé la question. … Merci. Je n'aurais jamais su comment."] }
    ],
    nouvelles: [
        "La Halle aux Ossements m'écrit : trois faux sceaux saisis à la capitale ce mois-ci. Bien faits. Trop bien faits. Je les verrai à mon retour.",
        "La garde royale m'a demandé d'inspecter ses lanternes à cristal. Ce ne sont pas des reliques. J'ai inspecté quand même. On ne refuse rien à la garde."
    ],
    etapes: {
        0: ["La Chancellerie a déclaré la faille. Niveau un, provisoire. Le mot « provisoire » est le plus honnête de tout leur vocabulaire."],
        1: ["La garde royale est arrivée avec ses reliques réglementaires. J'ai demandé à voir les sceaux. Ils étaient vrais. J'ai été presque déçu."],
        2: ["Des aventuriers, et leurs reliques. La moitié des sceaux sont vrais. L'autre moitié, je ne la nommerai pas devant les enfants."],
        3: ["Ils sont entrés. Mes mains tremblent déjà. Pas de peur. D'attente. Ce qu'ils rapporteront sera nouveau."],
        4: ["Ils sont revenus. J'ai ouvert ma sacoche, mes loupes, mes registres. Pour la première fois depuis des années, je ne sais pas par où commencer. C'est merveilleux."]
    },
    triste: ["~Il tient sa loupe sans regarder dedans.|Ce matin, j'ai inspecté une lettre de mon père. Je l'ai inspectée deux fois. Il n'y avait rien à trouver. Je l'ai inspectée une troisième."],
    meteo: {
        pluie: ["La pluie fait gonfler la cire des sceaux. C'est le meilleur moment pour démasquer un faux. J'aime la pluie, professionnellement."],
        orage: ["L'orage. La foudre et les reliques ne font pas bon ménage. Je range mes loupes. Toutes."],
        tempete: ["Tempête. La mer va rendre des choses. Demain, je serai sur la plage avant Sora. Pour une fois."],
        neige: ["La neige. Une relique froide se lit mal. Je lis quand même. Lentement."],
        brouillard: ["Le brouillard rend tout incertain. C'est l'état naturel des choses. Le brouillard a l'honnêteté de le montrer."]
    },
    perso: null,
    options: [
        { titre: 'Ce que la mer a rendu', si: C.js('$gameParty.hasItem($dataItems[108])'), cmds: cat(
            P('Gustave', "~Il prend le fil entre deux doigts gantés, sous la loupe à trois verres. Il ne dit rien pendant longtemps.|Pas de sceau. Pas de fabricant. Ce fil a été tissé — mais pas par une main que je connais, ni par une machine que la Confrérie a consignée."),
            P('Gustave', "Provenance : inconnue. Comportement : inconnu. Limites : inconnues.|Gardez-le. Et ne le réparez jamais vous-même. … Pardon. C'est un réflexe. On ne répare pas un fil. Mais on ne sait jamais."), H.affinite(1)) }
    ],
    aurevoir: ["Ne réparez jamais une relique vous-même.", "Au revoir. Et regardez vos filets, si vous en avez."]
},

/* ── Solange (33:45) — 33 ans, les voiles, trois humeurs ─────────────────── */
'33:45': {
    voix: "Change chaque jour : gaie, poétique ou grognonne (son foulard le dit : rouge, bleu, gris). « C'est pas moi, c'est la faille » pour tout. Drôle sans le vouloir, toujours sérieuse.",
    oc: {
        vecu: "Née au village une douzaine d'années avant la révolution ; enfant, à la fin des années maigres, elle cousait déjà les voiles avec sa grand-mère. Elle recoud les voiles de toutes les barques. Avant la faille, elle accusait le vent d'ouest ; maintenant, elle accuse la faille.",
        savoir: "sait chaque voile du port, le vent à l'odeur, l'humeur des autres avant eux ; ignore à peu près tout de l'imprégnation, mais en parle beaucoup ; croit à tort — et le sait — que la faille de la grotte, si loin, la change"
    },
    premiere: "~Elle a une aiguille entre les dents, et ne l'enlève pas pour parler.|Solange. Les voiles. Si je te réponds mal, c'est la faille. Si je te réponds bien, aussi. On s'habitue.",
    saisons: {
        1: ["Le printemps, toutes les voiles ont des trous de l'hiver. Moi aussi. On se recoud ensemble."],
        2: ["L'été, le vent d'ouest est doux. Je l'aime l'été. Le reste de l'année, on se dispute."],
        3: ["L'automne, les tempêtes déchirent tout. Je suis débordée. Je suis heureuse. C'est la même chose, chez moi."],
        4: ["L'hiver, je couds à la lanterne. Les points sont plus petits. Plus jolis. Personne ne les voit. Moi si."]
    },
    discuter: [
        "Une voile, ça se recoud comme une humeur : un point à la fois, et jamais pareil que la veille.",
        "Edwin dit que mon mana est « parfaitement normal ». Je ne lui pardonnerai jamais. Je lui ai quand même recousu sa sacoche.",
        "Roul me raconte ses poissons. Les jours gais, je les trouve beaux. Les jours gris, je les trouve petits. Ce sont les mêmes poissons.",
        "Ma grand-mère cousait les voiles avant moi. Elle disait que le vent est une personne. Je la crois les jours bleus."
    ],
    fil: [
        "Tu veux savoir pourquoi je dis « c'est la faille » ? Parce que avant, je disais « c'est le vent d'ouest », et le vent d'ouest ne s'est jamais défendu. La faille non plus. C'est pratique.",
        { ami: 2, t: "Ma grand-mère cousait les voiles à la fin des années maigres. On n'avait plus de toile neuve : elle recousait les vieilles, encore et encore. Elle disait : « Une voile, ça meurt pas. Ça change. »|Les jours bleus, je pense à elle. Les jours gris aussi, mais je le dis pas." },
        { ami: 3, gestes: [
            "~Son foulard est d'une couleur difficile à nommer, aujourd'hui.",
            "Toi qui vois tout le monde. Dis-moi la vérité.",
            "Tu crois que c'est la faille… ou que je suis juste comme ça ?",
            ['choix', ["C'est la faille, c'est sûr.", "C'est toi. Juste toi."], [
                [['retiens', 'humeur', 'faille'], "LA FAILLE ! Je le savais ! Je vais le dire à Edwin. Il va être furieux. C'est la faille aussi.", ['ami', 1]],
                [['retiens', 'humeur', 'toi'], "~Elle enlève l'aiguille de sa bouche, pour la première fois.", "… Juste moi. Trois humeurs, et c'est juste moi. … C'est moins grave que je croyais. C'est même plutôt bien.", ['ami', 1]]]]
        ] },
        { ami: 5, t: "La faille est à l'autre bout de la région. Bien trop loin pour l'imprégnation. Je le sais très bien.|Mais c'est plus facile d'avoir une faille qu'un caractère. Une faille, ça s'excuse. Un caractère, faut l'assumer." },
        { ami: 7, t: "J'ai peur d'être grise le jour de la fête. Tout le monde sera content, et moi je serai grise, au milieu, avec mon foulard gris.|… Tu viendras me voir, si je suis grise ? Juste pour que je sois grise à deux." },
        { ami: 9, t: "J'ai recousu une voile pour la garde royale, hier. Une voile de barque, pour leurs patrouilles le long de la côte. J'y ai cousu un point bleu, caché, dans un coin.|Pour qu'il y ait un peu de jour poétique dans leur garde. Ils ne le sauront jamais. C'est le meilleur genre de point." }
    ],
    souvenirs: [
        { cle: 'humeur', val: 'faille', lignes: ["J'ai dit à Edwin que quelqu'un m'avait confirmé, pour la faille. Il a sorti ses lunettes. Il a dit « toujours normal ». Je l'ai ignoré trois heures."] },
        { cle: 'humeur', val: 'toi', lignes: ["« Juste toi. » J'y ai pensé toute la journée. C'était une journée bleue. Je crois que c'est toi qui l'as rendue bleue."] }
    ],
    ragots: [
        { de: '33:22', cle: 'peur', val: 'avancer', lignes: ["Edwin a essayé de « ne pas savoir quelque chose » pendant une heure. Il a tenu quatre minutes. Je l'ai vu. C'était le plus beau moment de ma semaine."] }
    ],
    nouvelles: [
        "La garde royale m'a apporté trois voiles déchirées. Bien déchirées. On ne déchire pas une voile comme ça en patrouillant. Je pose pas de questions. Je couds.",
        "Les navires d'Ilmarée ont des voiles blanches, toutes neuves, jamais recousues. Ça me rend triste. Une voile sans couture, c'est une voile sans histoire."
    ],
    etapes: {
        0: ["Une faille ! Une vraie, déclarée ! Maintenant, j'ai une excuse officielle. Avec un sceau."],
        1: ["La garde royale est là. Ils ont des voiles réglementaires. Grises. Évidemment. Je les recouds en bleu, à l'intérieur."],
        2: ["Des aventuriers partout ! Ils ont des sacs à recoudre, des tentes à recoudre, des capes. Je suis débordée. Je suis gaie. Même un jour gris."],
        3: ["Ils sont entrés. J'ai mis mon foulard rouge, exprès, même si c'est un jour gris. Pour leur porter chance. C'est la faille qui me l'a dit."],
        4: ["Ils sont revenus. Leurs capes sont en lambeaux. Je les recoudrai toutes, une par une. Gratuitement. Ne le dis pas, ça ferait jaser."]
    },
    triste: ["~Son foulard est gris, et elle ne recoud rien.|C'est un jour gris. Pas un jour de faille. Un vrai jour gris, à moi. Ça arrive. Reviens demain, je serai peut-être bleue."],
    meteo: {
        pluie: ["La pluie mouille les voiles. Elles deviennent lourdes, comme moi les jours gris. On sèche ensemble."],
        orage: ["L'orage. Les voiles claquent. J'adore. C'est le seul bruit plus fort que mes humeurs."],
        tempete: ["Tempête ! Demain, toutes les voiles du port viendront me voir. Je prépare le fil. Et du thé."],
        neige: ["La neige sur les voiles, c'est un tissu de plus. Le plus beau, et il fond."],
        brouillard: ["Brouillard. Les voiles disparaissent. On croirait qu'elles naviguent toutes seules. C'est un jour bleu, le brouillard, même quand il est gris."]
    },
    aurevoir: ["C'est pas moi, c'est la faille. À demain.", "Va. Et si je suis grise demain, viens quand même."]
}

};
