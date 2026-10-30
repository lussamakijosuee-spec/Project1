/*
 * LES PERSONNAGES DE LA VILLE FORESTIÈRE, comme des OC (JOKO, 2026-10-30 :
 * « Développe les personnages vrai personnalité […] personnages du lore mais
 * nouveau inspiré du lore », puis « Comme des oc »).
 *
 * Une entrée par habitant (« carte:événement », « /2 » pour une page 2) : elle
 * s'ajoute à sa fiche du lot (ville_forestiere.js…) au moment de la pose.
 *   oc          sa fiche de personnage, écrite en tête de sa page (P1)
 *   lieux       ce qu'il dit selon où il est : travail, place, bar, repos,
 *               ailleurs (en visite), nuit (P2)
 *   avis        ce qu'il dit des autres, dans « Discuter » (P3)
 *   aCote       ce qu'il dit quand l'autre est juste à côté (P3)
 *   amitie      son ton, palier par palier d'affinité (P4)
 *   scenes      ses scènes d'amitié : un rendez-vous, puis la scène (P4)
 *   cadeaux     ce qu'il adore, aime, déteste (numéros d'objets) (P5)
 *   anniversaire « mois/jour », et ce qu'il dit ce jour-là (P6)
 * Les personnalités partent des commentaires de JOKO et de ce que les fiches
 * disaient déjà ; rien de sombre, rien de compliqué.
 */
'use strict';
module.exports = {

/* ── Hilde (29:28) — l'épicière du matin, la mère qui compte deux têtes ── */
'29:28': {
    oc: {
        age: '34 ans', allure: 'tablier vert, chignon qui tient avec un crayon, toujours un mouchoir dans la manche',
        caractere: 'vive, organisée, chaleureuse ; fait trois choses à la fois et les réussit toutes ; s\'excuse de crier, puis recrie',
        aime: 'les listes rayées, le silence de six heures du matin, quand Kaze chante faux pour Tomas',
        deteste: 'les cordes mal enroulées, qu\'on lui dise de se reposer',
        reve: 'une heure par semaine pour chanter de nouveau, au bar, le jeudi',
        secret: 'elle sait tout de la fleur que Kaze cherche, et elle fait semblant de rien',
        peur: 'compter les têtes et n\'en trouver qu\'une',
        manie: 'elle compte à voix basse : les pièces, les fioles, les enfants',
        phrase: 'Deux. Toujours deux. Je recompte.',
        liens: { Kaze: 'son mari ; il dit trois mots, elle les entend tous', 'Élise et Tomas': 'ses enfants', Margot: 'son amie du temps où elle chantait', Mireille: 'la seule à qui elle ne dit rien' }
    },
    anniversaire: '4/12', anniv: ['C\'est mon anniversaire. Kaze croit que je ne le sais pas. Il a demandé à Mado où pousse le lilas. À Mado ! Toute la ville est au courant.'],
    lieux: {
        travail: ['~Elle note quelque chose sur un bout de papier, le froisse, le met dans sa poche.|Pardon. La liste des courses. La quatrième de la journée.', 'Élise est sur le muret. Tomas est sous le muret. Tout va bien.'],
        place: ['Midi. Kaze arrive, je repars. On se croise au milieu, trois mots, et c\'est la meilleure minute de ma journée.'],
        repos: ['Le jour de repos. L\'épicerie est fermée, et je compte quand même. Les nuages, cette fois.']
    },
    avis: {
        Kaze: ['Kaze a l\'air d\'une épée qu\'on aurait oubliée dans un coin. Mais c\'est lui qui borde les enfants. Trois fois.'],
        Mado: ['Mado lave le linge de toute la ville. Elle en sait plus que Mireille, mais elle, elle se tait. Enfin, presque.'],
        Mireille: ['Ce que tu dis à Mireille, toute la ville le sait avant midi. Avec des fautes.'],
        Margot: ['Margot me gardait une chaise près du feu, quand je chantais. Elle me la garde encore. Au cas où.']
    },
    aCote: { Kaze: ['~Elle jette un regard vers Kaze, qui détourne les yeux.|Il fait semblant de ne pas écouter. Il écoute tout.'] },
    amitie: [
        [3, { bonjour: ['Ah, c\'est toi ! Attends, je compte… deux. Bon. Bonjour !'], aurevoir: ['File ! Et prends une corde.'] }],
        [6, { bonjour: ['\\P[1] ! Les petits demandaient après toi. Enfin, Élise. Tomas demandait si tu allais bien.'], aurevoir: ['Reviens dîner un soir. Kaze fera une soupe. Il ne fait que des soupes.'] }],
        [10, { bonjour: ['~Elle te serre dans ses bras, vite, comme on range une fiole.|Bon. Voilà. Bonjour.'], aurevoir: ['Fais attention à toi. Tu fais partie des têtes que je compte, maintenant.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'la liste', rdv: 'Tu passes devant l\'épicerie demain matin ? Viens me voir avant midi. J\'ai besoin de quelqu\'un qui sait lire mon écriture. Personne ne sait.',
          rappel: 'N\'oublie pas : l\'épicerie, le matin. Ma liste t\'attend.', quand: { carte: 43, de: 8, a: 13 },
          gestes: ['Te voilà ! Regarde.', '~Elle déplie une liste aussi longue que son bras.', 'Cordes. Fioles. Bougies. « Ne pas oublier Tomas. » … Ça, c\'est pour moi.', ['bulle', 6],
              'Les recrues de l\'Admission arrivent toutes la même semaine. Elles achètent toutes la même chose. Alors je prépare des sacs tout faits.',
              ['choix', ['Je t\'aide à les préparer', 'Tu devrais te reposer'], [
                  ['~Vous remplissez douze sacs. Elle met une corde de plus dans chacun.', ['son', 'Item1'], 'Tu as de bonnes mains. Kaze dirait « hm ». Ça veut dire pareil.', ['ami', 1]],
                  ['~Elle te regarde comme si tu avais dit un gros mot.', 'Me reposer. Ha. Je me reposerai quand Élise aura trente ans. Allez, aide-moi plutôt.']]],
              'Merci. Je note ton nom sur ma liste. Dans la colonne « gens bien ».'] },
        { palier: 6, titre: 'la chanson', rdv: 'Ce soir, avant le dîner, vers dix-sept heures, viens me voir ici. J\'ai… quelque chose à te faire écouter.',
          rappel: 'Ce soir, avant le dîner. Ne le dis pas à Margot.', quand: { carte: 29, de: 17, a: 20 },
          gestes: ['~Elle vérifie que personne ne regarde. Personne ne regarde.', 'Les petits jouent plus loin. Kaze est à l\'épicerie. Je…', '~Elle chante. Doucement. Une vieille chanson de taverne, sur une barque qui revient toujours.', ['son', 'Saint5', 50],
              ['bulle', 3], '~Du côté de l\'épicerie, une porte s\'entrouvre. Quelqu\'un dit : « encore ».', 'C\'est Kaze. Il dit toujours ça.', 'Voilà. C\'était la première fois depuis Élise. Tu ne diras rien ?',
              ['choix', ['Tu devrais rechanter au bar', 'Je ne dirai rien'], [
                  ['Au bar… Le jeudi, peut-être. Une chanson. Une seule. … Deux.', ['ami', 1]],
                  ['Merci. Mais dis-le quand même à Margot. Elle sera contente.']]]] },
        { palier: 10, titre: 'la cinquième tête', gestes: ['~Elle compte, du bout du doigt : Kaze, Élise, Tomas, elle… puis toi.', 'Cinq. Ça fait cinq, maintenant. Je ne sais pas quand c\'est arrivé.',
              'Tu peux partir à l\'aventure. Mais tu reviens. C\'est la règle de la maison.', ['ami', 1]] }
    ],
    cadeaux: { adore: [7, 9], aime: [44, 47, 48], deteste: [8, 102],
        dits: { adore: ['Oh ! … Pour moi ? Pas pour les enfants ? Pour MOI ? … Je ne sais pas quoi dire. Si : merci.'], aime: ['C\'est gentil ! Je le range… là. Non, là. Merci !'],
            neutre: ['Merci ! Je le mettrai en rayon. Enfin, non, c\'est un cadeau. Je le garde.'], deteste: ['~Elle te le rend avec un sourire de vendeuse.|Garde-le, va. Je n\'aurais pas le courage de le vendre.'],
            deja: ['Tu m\'as déjà gâtée aujourd\'hui. Un de plus et Kaze va être jaloux. Enfin, il dira « hm ».'], anniv: ['Et pour mon anniversaire, en plus. Tu es pire que Kaze.'] } }
},

/* ── Kaze (29:40) — le mari de Hilde, l'épicier de l'après-midi ────────── */
'29:40': {
    oc: {
        age: '36 ans', allure: 'grand, sec, une cicatrice fine au menton, les manches toujours retroussées',
        caractere: 'laconique, précis, regard d\'acier ; un très bon citoyen (JOKO) ; fait le bien en cachette et nie tout',
        aime: 'les soupes, les nœuds bien faits, porter Élise sur ses épaules « sans s\'en rendre compte »',
        deteste: 'le gaspillage, qu\'on le remercie, les compliments sur sa voix',
        reve: 'trouver la fleur de Hilde (sa quête, à JOKO)',
        secret: 'il rentre le bois des voisins la nuit ; tout le monde le sait, personne ne le lui dit',
        peur: 'que Hilde arrête de chanter pour de bon',
        manie: 'il répond « hm » ; il y a six « hm » différents, Hilde les connaît tous',
        phrase: 'Hm.',
        liens: { Hilde: 'sa femme ; il lui a dit « encore », un soir, et c\'était tout', 'Élise et Tomas': 'ses enfants, à qui il apprend à tomber', Béran: 'ils se saluent comme deux anciens qui ne disent pas de quoi' }
    },
    anniversaire: '11/3', anniv: ['~Il a une fleur de papier à la boutonnière. Élise l\'a faite.|… On m\'a obligé.'],
    lieux: {
        travail: ['~Il enroule une corde. Le nœud final est parfait.|Hm.', 'Les recrues achètent des cordes. Je leur montre le nœud. Elles oublient. Je remontre.'],
        place: ['~Il regarde Hilde partir vers l\'épicerie. Il la regarde jusqu\'au bout de la rue.|… Quoi.']
    },
    avis: {
        Hilde: ['Hilde compte. Moi, je porte. Ça marche.'],
        Béran: ['Béran tient sa lance comme quelqu\'un qui a appris dehors. Moi aussi. On n\'en parle pas.'],
        Élise: ['Élise grimpera sur le toit de l\'épicerie avant l\'été. Je l\'attendrai en bas.'],
        Tomas: ['Tomas pose des questions. Bonnes questions. Je réponds « hm ». Il note.']
    },
    aCote: { Hilde: ['~Il baisse la voix d\'un cran.|Elle est là. … Pas un mot sur la fleur.'] },
    amitie: [
        [3, { bonjour: ['~Le « hm » est un peu plus long que d\'habitude.|Hm. Toi.'] }],
        [6, { bonjour: ['\\P[1]. … Tu as mangé ?'], aurevoir: ['Prends une corde. Je l\'ai déjà mise dans ton sac.'] }],
        [10, { bonjour: ['~Il pose ce qu\'il porte, et il sourit. Pour de vrai.|Ah. Te voilà.'], aurevoir: ['Rentre. On garde ta place à table.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'le nœud', rdv: 'Passe à l\'épicerie cet après-midi. … Ton sac est mal fait.', rappel: 'L\'épicerie. L\'après-midi. Ton sac.', quand: { carte: 43, de: 13, a: 20 },
          gestes: ['Donne.', '~Il vide ton sac sur le comptoir, sans demander, et le refait en silence.', ['son', 'Equip1'], 'Le lourd en bas. Le soin en haut. La corde sur le côté, toujours.',
              'Le nœud. Regarde.', ['bulle', 9], '~Il fait un nœud. Il le défait. Il le refait plus lentement, pour toi.',
              ['choix', ['Essayer le nœud', 'Regarder encore'], [['~Ton nœud est tordu. Il hoche la tête quand même.', 'Ça tiendra. Ça a tenu pour moi.', ['ami', 1]], ['~Il le refait une troisième fois. Il ne soupire pas. Il a l\'habitude, avec Tomas.']]],
              'Voilà. Maintenant, tu reviens.'] },
        { palier: 6, titre: 'tomber', rdv: 'Demain matin. La ville. Les petits ont une leçon. Viens.', rappel: 'Le matin. La leçon des petits.', quand: { carte: 29, de: 8, a: 13 },
          gestes: ['Élise. Tomas. Regardez.', '~Il se laisse tomber en arrière dans l\'herbe, d\'un coup, et roule. Il se relève sans un bruit.', ['son', 'Blow1', 60],
              ['dit', 'Élise', 'ENCORE !'], ['dit', 'Tomas', 'Pourquoi on apprend à tomber ?'], '… Pour oser monter.', ['bulle', 4],
              '~Il te regarde.|À toi.', ['choix', ['Tomber dans l\'herbe', 'Je regarde'], [['~Tu tombes. Mal. Élise rit si fort que Hilde sort de l\'épicerie.', 'Hm. Bien.', ['ami', 1]], ['Hm. La prochaine fois.']]]] },
        { palier: 10, titre: 'encore', gestes: ['~Il essuie le comptoir alors qu\'il est propre.', 'Hilde chantait au bar. Tous les soirs, j\'étais là. Je ne disais rien.', 'Un soir, elle a fini, et j\'ai dit « encore ». C\'est la phrase la plus longue de ma vie.',
              '… Tu fais partie de la maison. Voilà. C\'est dit.', ['ami', 1]] }
    ],
    cadeaux: { adore: [45, 46], aime: [47, 44, 9], deteste: [55, 8],
        dits: { adore: ['~Il regarde la nourriture, puis toi.|… Hm. (Hilde traduirait : « merci, vraiment ».)'], aime: ['Hm. Bien.'], neutre: ['Hm.'],
            deteste: ['~Il te le rend sans un mot. Ce « hm »-là veut dire non.'], deja: ['Déjà fait. Garde le reste pour toi.'], anniv: ['… Tu savais. Hilde t\'a dit. Hm.'] } }
},

/* ── Élise (29:25) — la fille qui saute les lignes des pavés ──────────── */
'29:25': {
    oc: {
        age: '9 ans', allure: 'genoux écorchés, une épée de bois passée dans la ceinture, deux tresses qui ne tiennent jamais',
        caractere: 'vive, impatiente, rêve d\'ailleurs ; demande « et après ? » à chaque fin d\'histoire',
        aime: 'les failles (sur les cartes), grimper, les histoires d\'aventuriers, la mer qu\'elle n\'a jamais vue',
        deteste: 'la soupe aux poireaux, qu\'on lui dise « quand tu seras grande »',
        reve: 'passer l\'Admission, avec une épée, comme papa mais en plus loin',
        secret: 'elle a peur des grosses araignées ; elle a demandé à Tomas de ne pas le dire',
        peur: 'que Tomas ne veuille jamais partir avec elle',
        manie: 'elle saute d\'un pavé à l\'autre sans toucher les lignes',
        phrase: 'Et après ?',
        liens: { Tomas: 'son frère ; elle part devant, il la ramène', Kaze: 'son papa, « l\'air méchant, pas méchant »', Béran: 'il lui a appris à tenir son épée de bois', Lise: 'son idole : une fille qui forge des épées' }
    },
    anniversaire: '6/21', anniv: ['C\'EST MON ANNIVERSAIRE ! J\'ai neuf ans ! Non, dix ! … Neuf. Mais dans ma tête, dix.'],
    lieux: {
        place: ['Sur la place, à midi, tout le monde vient. Même les gardes ! Je compte les épées. Il y en a onze. Douze avec la mienne.'],
        repos: ['C\'est le jour de repos ! Papa dort jusqu\'à sept heures. On a sauté sur son lit à six heures et demie.']
    },
    avis: {
        'Petit-Louis': ['Petit-Louis gagne toujours à Corps, Âme, Esprit. Il triche, j\'en suis sûre. Je joue le Corps parce que c\'est le plus fort. … Le Corps perd tout le temps.'],
        Tomas: ['Tomas dit que la forêt est pleine de bêtes. Moi je dis que c\'est pour ça qu\'il faut y aller. On est d\'accord sur le début.'],
        Béran: ['Béran a trois doigts à une main ! Il dit que c\'est pour compter plus vite jusqu\'à trois.'],
        Lise: ['Lise, la fille du forgeron, elle fait des VRAIES épées. Je veux être Lise. Mais en plus loin.']
    },
    aCote: { Tomas: ['~Elle tire la manche de son frère.|Dis-lui, toi ! Dis-lui qu\'on va partir !'] },
    amitie: [
        [3, { bonjour: ['Toi ! Raconte ! T\'as vu une faille ?'] }],
        [6, { bonjour: ['\\P[1] ! \\P[1] ! J\'ai appris un nouveau coup ! Regarde ! … Non, attends, je recommence.'], aurevoir: ['Ramène-moi une plume de monstre !'] }],
        [10, { bonjour: ['~Elle te fonce dessus et s\'accroche à ta jambe.|Je t\'ai attrapé ! T\'es mon prisonnier !'], aurevoir: ['Quand je serai aventurière, on fera équipe. C\'est promis. Craché.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'l\'épée de bois', rdv: 'Viens sur la place cet après-midi ! Je vais te montrer mon épée. C\'est Béran qui m\'a appris à la tenir.', rappel: 'Cet après-midi, la place ! T\'oublies pas, hein ?', quand: { carte: 29, de: 13, a: 18 },
          gestes: ['Regarde ! En garde !', '~Elle brandit son épée de bois à deux mains, très sérieuse.', ['son', 'Sword1', 60], 'HA ! … C\'était un monstre de rang S. Il est mort. Enfin, il est parti.',
              ['choix', ['Faire le monstre', 'Applaudir'], [['~Tu grognes. Elle te frappe le genou trois fois et crie victoire.', ['son', 'Applause1', 50], 'J\'AI GAGNÉ ! Tu es le meilleur monstre du monde.', ['ami', 1]], ['~Elle salue comme une chevalière.', ['son', 'Applause1', 40], 'Merci, merci. Je signe les autographes plus tard.']]]] },
        { palier: 6, titre: 'la carte', rdv: 'Demain matin, viens ! J\'ai dessiné une carte. Une vraie. Avec des failles dessus.', rappel: 'Le matin ! Ma carte !', quand: { carte: 29, de: 8, a: 12 },
          gestes: ['~Elle déplie un papier couvert de gribouillis et de flèches.', 'Là, c\'est la ville. Là, la forêt. Là, c\'est une faille. Je l\'ai inventée, mais elle est sûrement vraie.',
              'Et là, tout au bout, c\'est la mer. Papa dit qu\'il y a de l\'eau jusqu\'au ciel.', ['bulle', 9], 'Tu me dessines un truc que t\'as vu en vrai ?',
              ['choix', ['Dessiner une montagne', 'Dessiner un monstre'], [['Une montagne ! Je la mets à côté de ma faille. Comme ça, elles sont copines.', ['ami', 1]], ['~Elle regarde ton dessin, très longtemps.|… Il est moche. J\'adore.', ['ami', 1]]]]] },
        { palier: 10, titre: 'la promesse', gestes: ['~Elle te tend son petit doigt, très solennelle.', 'Tu promets qu\'un jour, tu m\'emmènes voir la mer ? Pas maintenant. Quand Tomas sera d\'accord.', '~Elle attend.',
              'Craché ? … Bon. Pas besoin de cracher. C\'est dégoûtant. Mais c\'est promis.', ['ami', 1]] }
    ],
    cadeaux: { adore: [103, 7], aime: [44, 86], deteste: [8, 48],
        dits: { adore: ['WAAAH ! C\'est un trésor ? C\'est un VRAI trésor ! Je le montre à Tomas !'], aime: ['Merci ! Je le cache dans ma cachette secrète. Derrière l\'épicerie. Chut.'],
            neutre: ['C\'est quoi ? … Merci quand même !'], deteste: ['Beurk ! Non merci. Donne-le à Tomas, il aime les trucs nuls.'], deja: ['T\'as déjà donné un cadeau ! Maman dit qu\'un c\'est poli, deux c\'est gâter.'], anniv: ['ET C\'EST MON ANNIVERSAIRE ! Ça compte double, c\'est la loi !'] } }
},

/* ── Tomas (29:26) — le frère prudent ──────────────────────────────────── */
'29:26': {
    oc: {
        age: '7 ans', allure: 'un bonnet même l\'été, un carnet trop grand pour lui, le regard qui cherche Élise',
        caractere: 'posé, casanier, un peu inquiet ; observe tout ; pose une question et attend VRAIMENT la réponse',
        aime: 'l\'hiver à la maison, ranger les fioles par couleur, les histoires qui finissent bien',
        deteste: 'les têtards, le bruit, quand Élise disparaît derrière un mur',
        reve: 'tenir l\'épicerie quand il sera grand ; avec une étagère « choses rares »',
        secret: 'il s\'entraîne en cachette à grimper, pour pouvoir suivre Élise le jour où elle partira',
        peur: 'un peu de tout, tout le temps (il le dit lui-même)',
        manie: 'il note dans son carnet ce que les gens répondent',
        phrase: 'Pourquoi ?',
        liens: { Élise: 'sa sœur ; il la ramène, toujours', Fernand: 'son ami : il lui apprend à lire les nuages', Kaze: 'son papa, qui a peur aussi, mais qui le fait quand même' }
    },
    anniversaire: '1/9', anniv: ['C\'est mon anniversaire. J\'ai sept ans. Élise a fait un gâteau. Il est… intéressant.'],
    lieux: {
        place: ['À midi, il y a trop de monde sur la place. Je reste près du puits. Le puits ne bouge pas.'],
        repos: ['Le jour de repos, on reste à la maison. C\'est mon jour préféré de la semaine. Élise dit que c\'est le pire. On a raison tous les deux.']
    },
    avis: {
        'Petit-Louis': ['Petit-Louis joue le Corps quand je joue l\'Esprit. Il devine. Je crois qu\'il regarde mes mains. Je l\'ai noté.'],
        Élise: ['Élise saute les lignes des pavés. Moi, je marche sur les lignes. Comme ça, on fait les deux.'],
        Fernand: ['Monsieur Fernand dit que ses genoux devinent la pluie. J\'ai noté. Ils ont raison sept fois sur dix.']
    },
    aCote: { Élise: ['~Il regarde sa sœur, puis toi.|Si elle te parle de partir, dis-lui « plus tard ». Ça marche, des fois.'] },
    amitie: [
        [3, { bonjour: ['Bonjour. Tu vas bien ? … Vraiment bien ?'] }],
        [6, { bonjour: ['\\P[1]. J\'ai écrit ton nom dans mon carnet. Page des gens gentils.'], aurevoir: ['Fais attention. Je te le dis parce que tu ne le fais pas.'] }],
        [10, { bonjour: ['~Il te prend la main, une seconde, puis la lâche.|Bonjour. Je suis content.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'le carnet', rdv: 'Tu reviens demain matin ? J\'ai une question. Une grande. Je dois la préparer.', rappel: 'Demain matin. Ma question est presque prête.', quand: { carte: 29, de: 8, a: 12 },
          gestes: ['~Il ouvre son carnet à une page où il est écrit, en très gros : QUESTION.', 'Est-ce que tu as peur, quand tu pars ?', ['bulle', 2],
              ['choix', ['Oui, un peu', 'Non, jamais'], [['~Il écrit « oui, un peu », et il souligne deux fois.', 'Papa aussi. Et il le fait quand même. Alors c\'est normal.', ['ami', 1]], ['~Il écrit « non », puis il te regarde longtemps.|… Je crois que tu mens. Je le note quand même.']]],
              'Merci. Je n\'ai plus que quarante-deux questions.'] },
        { palier: 6, titre: 'grimper', rdv: 'Cet après-midi. Derrière l\'épicerie. Viens seul. Enfin, sans Élise.', rappel: 'Derrière l\'épicerie, cet après-midi. C\'est un secret.', quand: { carte: 29, de: 13, a: 18 },
          gestes: ['~Il regarde autour de lui. Personne.', 'Je m\'entraîne à grimper. Pour pouvoir suivre Élise, le jour où elle partira. Elle part toujours.', ['pas', 'haut'], ['pas', 'bas'], '~Il monte d\'une marche. Il redescend. C\'est déjà beaucoup.',
              ['choix', ['Tu fais des progrès', 'Je te tiens la main'], [['Tu crois ? … Je le note.', ['ami', 1]], ['~Il monte deux marches, en te tenant la main. Puis trois.', 'Trois ! Ne le dis pas à Élise. Je veux la surprendre.', ['ami', 1]]]]] },
        { palier: 10, titre: 'la page', gestes: ['~Il déchire une page de son carnet et te la tend. Il y a un dessin : toi, Élise, lui, et une barque.', 'C\'est pour quand on ira voir la mer. Tous les trois. Plus tard.', 'Garde-la. Si tu as peur, regarde-la.', ['ami', 1]] }
    ],
    cadeaux: { adore: [48, 9], aime: [44, 103], deteste: [102, 38],
        dits: { adore: ['Oh. C\'est pour moi ? … Merci. Je le range à part. Étagère « choses rares ».'], aime: ['Merci. Je le note dans mon carnet.'], neutre: ['Merci. … C\'est pour quoi faire ?'],
            deteste: ['~Il recule d\'un pas.|Ça me fait peur. Tu peux le garder ?'], deja: ['Tu m\'as déjà donné quelque chose. C\'est noté.'], anniv: ['Pour mon anniversaire ? Je vais l\'écrire en grand.'] } }
},

/* ── Colette (29:38) — les livres de Parole d'ombre ───────────────────── */
'29:38': {
    oc: {
        age: '22 ans', allure: 'robe noire, doigts tachés d\'encre, un livre fermé sur un crayon, des yeux qui calculent',
        caractere: 'froide en surface, rouge jusqu\'aux oreilles dessous ; concise ; ne supporte pas qu\'on stagne (d\'après JOKO)',
        aime: 'les équations qui tombent juste, le silence de l\'hiver, les parfaits à la fraise (elle nie)',
        deteste: 'qu\'on parle longtemps, le vent qui tourne ses pages, qu\'on rie de son prénom',
        reve: 'écrire le livre de Parole d\'ombre que quelqu\'un lira jusqu\'au bout',
        secret: 'jeck ; « mathématiquement parfait » qu\'il la voie comme une amie (elle ment)',
        peur: 'devenir quelqu\'un qu\'on ne remarque pas',
        manie: 'elle griffonne des chiffres dans la marge pendant qu\'on lui parle',
        phrase: 'Abrège.',
        liens: { jeck: 'son « ami » ; bruyant, il triche mal, elle le regarde quand il ne regarde pas', Edwin: 'il veut lire ses livres ; il parle trop pour les finir', Mireille: 'elle invente des choses sur elle ; c\'est faux, et elle le sait' }
    },
    anniversaire: '12/19', anniv: ['… Oui. Aujourd\'hui. Ne chante pas. Ne fais rien. … D\'accord, tu peux rester.'],
    lieux: {
        travail: ['~Un livre ouvert devant elle, elle compte sur ses doigts, s\'arrête, recommence.|Trois pas d\'avance. Le quatrième, je le garde.'],
        bar: ['Le bar. Le bruit. … Je viens pour la table du fond. Pas pour la vue. La vue, c\'est un marchand de roulette.'],
        ailleurs: ['Le Village de Pêche. L\'eau et l\'ombre se répondent, ici. J\'écris mieux.']
    },
    avis: {
        jeck: ['jeck ? Il crie. Il triche. Il rit trop fort. … Je n\'ai rien d\'autre à en dire. Arrête de me regarder.'],
        Edwin: ['Edwin Bramble voulait lire mes livres. Il est revenu au bout de dix minutes avec quarante questions. Sur la première page.'],
        Mireille: ['Mireille raconte que j\'invoque des ombres la nuit. Je fais mes comptes. C\'est plus effrayant, pour certains.']
    },
    aCote: { jeck: ['~Elle referme son livre trop vite.|Ne dis rien. Il est là. Il ne doit pas savoir que je… que je calcule.'] },
    amitie: [
        [3, { bonjour: ['… Toi. Bien.'] }],
        [6, { bonjour: ['\\P[1]. Assieds-toi. Ne parle pas. Ou parle. Peu.'], aurevoir: ['Reviens. Ce n\'est pas une demande.'] }],
        [10, { bonjour: ['~Elle t\'a gardé une place. Elle fait comme si de rien n\'était.|J\'ai fini un chapitre. Tu es le premier à le savoir.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'l\'équation', rdv: 'Demain matin. Ici. J\'ai une Parole qui ne tombe pas juste. Tu es… une variable.', rappel: 'Le matin. Ma variable.', quand: { carte: 29, de: 9, a: 13 },
          gestes: ['Tu es là. Ponctuel. C\'est un début.', '~Elle tourne son livre vers toi. Des colonnes de chiffres, une ombre dessinée qui tourne en spirale.', 'Une Parole d\'ombre, c\'est une équation. Celle-ci tombe à côté. Dis un chiffre.',
              ['choix', ['Trois', 'Sept'], [['~Elle écrit « 3 », barre, réécrit.|… Ça marche. Ça marche ! Ne souris pas.', ['ami', 1]], ['Sept. Non. Trop. … Mais ça m\'a donné l\'idée. Bien.', ['ami', 1]]]],
              ['son', 'Book1'], 'Tu peux partir. Merci. Je l\'ai dit une fois. Ne me le fais pas répéter.'] },
        { palier: 6, titre: 'la roulette', rdv: 'Demain après-midi, ici. Viens. J\'ai calculé quelque chose. … Sur jeck. Ce n\'est pas pour ça.', rappel: 'Demain après-midi. Ici. Ce n\'est PAS pour jeck.', quand: { carte: 29, de: 13, a: 18 },
          gestes: ['~Elle est assise droite comme un trait, un cahier ouvert sur les genoux.', 'J\'ai calculé sa roulette. Elle penche à gauche. Un degré et demi.', 'Si je le lui dis, il saura que je le regarde. Si je ne dis rien, il continuera à tricher mal.', ['bulle', 8],
              ['choix', ['Dis-le-lui', 'Laisse-le tricher'], [['… Tu as raison. C\'est mathématiquement la meilleure solution. Demain. Peut-être. Je vais… recalculer.', ['ami', 1]], ['~Elle hoche la tête, soulagée.|Oui. Il triche mal. C\'est ce qu\'il a de mieux.']]]] },
        { palier: 10, titre: 'le premier lecteur', gestes: ['~Elle pose un cahier noir devant toi. Sur la couverture : « Ombres, tome un ».', 'Personne ne lit mes livres jusqu\'au bout. Toi, tu vas lire celui-là. C\'est un ordre.', '~Elle détourne les yeux, rouge jusqu\'aux oreilles.',
              'Et si tu le dis à jeck, je te jette hors de mon espace.', ['ami', 1]] }
    ],
    cadeaux: { adore: [94, 48], aime: [7, 73], deteste: [10, 98],
        dits: { adore: ['~Elle regarde l\'objet, puis toi, puis l\'objet.|… C\'est exact. C\'est exactement ce qu\'il fallait. Comment tu as calculé ça ?'], aime: ['Utile. Merci.'],
            neutre: ['… Je ne vois pas l\'équation. Merci quand même.'], deteste: ['Non. Ça, c\'est jeck. Rends-le-lui.'], deja: ['Un par jour. Au-delà, c\'est une suite divergente.'], anniv: ['… Tu savais la date. Tu as calculé ? … Bien.'] } }
},

/* ── Mado (29:41) — la lavandière qui lave tout, même les secrets ───────── */
'29:41': {
    oc: {
        age: '45 ans', allure: 'bras de déménageuse, mains rouges, un fichu à fleurs, un rire qu\'on entend de la porte nord',
        caractere: 'forte, franche, généreuse ; dit ce qu\'elle pense avant d\'y penser ; garde les secrets du linge (pas gratuitement)',
        aime: 'le soleil sur un drap blanc, le bar après le travail, les chansons à boire, gagner aux bras de fer',
        deteste: 'la pluie un jour de lessive, les nobles qui tachent leurs nappes de vin',
        reve: 'une lessiverie à elle, avec un toit, et un écriteau « ICI ON LAVE TOUT »',
        secret: 'elle demande chaque matin à Fernand s\'il va pleuvoir, et elle ne le croit jamais',
        peur: 'les araignées des greniers (elle les lave quand même)',
        manie: 'elle essore tout ce qu\'elle a dans les mains, même un mouchoir sec',
        phrase: 'Je lave tout !',
        liens: { Fernand: 'son baromètre ; elle le traite de vieux grincheux, il a toujours raison', Mireille: 'sa rivale en nouvelles ; Mado sait, Mireille raconte', Hilde: 'elle lui garde les beaux draps' }
    },
    anniversaire: '7/2', anniv: ['C\'EST MON ANNIVERSAIRE ! Ce soir, au bar, c\'est moi qui paie ! … Une tournée. Une petite.'],
    lieux: {
        travail: ['~Elle bat un drap sur une pierre, en rythme.|Un, deux ! Un, deux ! Ça défoule mieux que de crier sur mon mari.'],
        bar: ['Le bar ! Enfin ! Margot, la même chose ! … Elle sait ce que c\'est, la même chose. Moi, j\'ai oublié.'],
        repos: ['Le jour de repos, je lave pas. Je regarde la rivière couler et je me dis : t\'as de la chance, toi, t\'as rien à essorer.']
    },
    avis: {
        Fernand: ['Fernand dit qu\'il pleuvra. Il pleut. Fernand dit qu\'il fera beau. Il fait beau. Ce vieux grincheux m\'énerve à toujours avoir raison.'],
        Mireille: ['Mireille raconte ce qu\'elle croit savoir. Moi, je sais ce que je lave. C\'est plus fiable.'],
        Hilde: ['Hilde m\'a demandé où pousse le lilas. Pour Kaze, à tous les coups. Ce garçon est un mauvais menteur, il pose trop de questions.']
    },
    aCote: { Fernand: ['~Elle crie vers Fernand.|ALORS, IL VA PLEUVOIR ? … Il a dit « hein ». Ça veut dire oui.'] },
    amitie: [
        [3, { bonjour: ['Te revoilà ! T\'as du linge ? Non ? Viens quand même, je m\'ennuie.'] }],
        [6, { bonjour: ['\\P[1] ! Mon préféré ! Bon, après Hilde. Et après le soleil.'], aurevoir: ['Rentre propre !'] }],
        [10, { bonjour: ['~Elle te tape dans le dos à te décrocher une épaule.|VOILÀ MA LESSIVE PRÉFÉRÉE !'] }]
    ],
    scenes: [
        { palier: 3, titre: 'le drap', rdv: 'Passe demain à la rivière, le matin. J\'ai un drap du manoir qui fait trois fois ma taille. Il me faut quelqu\'un pour l\'autre bout.', rappel: 'Demain matin, le grand drap !', quand: { carte: 29, de: 8, a: 12 },
          gestes: ['Attrape ! L\'autre bout ! Tire !', '~Vous tordez le drap, chacun d\'un côté. L\'eau gicle partout.', ['son', 'Water1'], ['bulle', 1], 'Plus fort ! Plus fort ! … Pas si fort, tu vas le déchirer, le lord me pend !',
              ['choix', ['Tirer d\'un coup', 'Tirer doucement'], [['~Le drap claque. Mado part à la renverse dans l\'herbe et rit à en pleurer.', ['son', 'Laugh'], 'T\'ES UNE BRUTE ! J\'adore.', ['ami', 1]], ['Voilà. Comme ça. Tu ferais une bonne lavandière. C\'est le plus beau compliment que je fais.']]]] },
        { palier: 6, titre: 'le bras de fer', rdv: 'Ce soir, au bar. Bras de fer. Toi contre moi. Si tu gagnes, je lave ton linge un mois. Si je gagne, tu me paies un verre.', rappel: 'Ce soir, au bar ! Échauffe ton bras !', quand: { carte: 46, de: 19, a: 23 },
          gestes: ['~Elle pose son coude sur la table. La table grince.', 'Margot ! Arbitre !', ['dit', 'Margot', 'Je compte pas les doigts cassés, je préviens.'], ['son', 'Blow1'],
              ['choix', ['Donner tout', 'La laisser gagner'], [['~La table tremble. Les chopes sautent. Et… elle gagne. Évidemment.', 'HA ! Mais t\'as tenu ! Personne tient ! Un verre pour celle… celui… pour toi !', ['ami', 1]], ['~Elle gagne, puis elle te regarde, les yeux plissés.|Tu m\'as laissée gagner. … C\'est gentil. Mais la prochaine fois, je te casse le bras pour de vrai.', ['ami', 1]]]]] },
        { palier: 10, titre: 'l\'écriteau', gestes: ['~Elle sort un morceau de bois de son panier. Dessus, peint de travers : « ICI ON LAVE TOUT ».', 'Un jour, j\'aurai un toit pour le mettre. En attendant, je te le montre. T\'es la première personne.', 'Ris pas. … Bon, tu peux rire. Mais avec moi.', ['ami', 1]] }
    ],
    cadeaux: { adore: [10, 45], aime: [44, 46, 9], deteste: [42, 102],
        dits: { adore: ['OH ! Ça, c\'est un cadeau ! Pas une fleur, pas un poème : un truc qui se boit ou qui se mange !'], aime: ['Merci, mon grand ! Ça me fera ma pause.'],
            neutre: ['Hm ! Je sais pas ce que c\'est, mais je le laverai.'], deteste: ['Beurk ! Ça tache, ça ! Garde ça loin de mes draps !'], deja: ['Arrête, tu vas me gâter ! Un par jour, sinon je m\'habitue.'], anniv: ['ET POUR MON ANNIVERSAIRE ! Je t\'adore !'] } }
},

/* ── Fernand (29:29) — le vieux paysan qui dit le temps ────────────────── */
'29:29': {
    oc: {
        age: '78 ans', allure: 'chapeau de paille troué, une canne qui lui sert surtout à montrer le ciel, une oreille tendue',
        caractere: 'lent, sage, un peu sourd ; drôle sans le faire exprès ; répond à la question d\'avant',
        aime: 'les nuages, le pain trempé dans le lait, que Tomas note ce qu\'il dit',
        deteste: 'les mages qui « commandent » la pluie, qu\'on parle trop vite',
        reve: 'qu\'on écrive un jour un almanach avec ses prédictions ; Tomas s\'en occupe',
        secret: 'il entend très bien quand il veut ; il fait le sourd pour Mado',
        peur: 'un ciel sans un seul nuage : il ne sait plus quoi dire',
        manie: 'il lève un doigt mouillé au vent avant chaque phrase',
        phrase: 'Hein ? … Il pleuvra.',
        liens: { Mado: 'elle lui crie dessus chaque matin pour savoir le temps ; il adore ça', Tomas: 'son élève ; le seul qui l\'écoute', 'Le vieux': 'deux vieux qui ne parlent pas du passé' }
    },
    anniversaire: '3/1', anniv: ['Hein ? Mon anniversaire ? Soixante-dix… huit. Ou neuf. Il fera beau. Pour l\'occasion.'],
    lieux: {
        travail: ['~Il lève un doigt mouillé au vent.|Vent d\'ouest. Demain, les filles de la rivière se mouilleront les pieds.'],
        place: ['Midi ! Le soleil est au plus haut. Moi, je suis au plus bas. Je m\'assieds.'],
        repos: ['Le jour de repos ? Le ciel ne se repose pas, lui. Alors moi non plus.']
    },
    avis: {
        Mado: ['La lavandière me crie dessus tous les matins. Je fais semblant de pas entendre. C\'est le meilleur moment de ma journée.'],
        Tomas: ['Le petit Tomas écrit tout ce que je dis. Un jour, il saura plus de choses que moi. Il saura que je me trompe trois fois sur dix.'],
        'Le vieux': ['Le vieux du bar ? Il a des genoux comme les miens. Mais lui, ils lui disent pas le temps. Ils lui disent d\'autres choses.']
    },
    aCote: { Mado: ['~Il fait semblant d\'être sourd, avec un sourire en coin.|Hein ? … Quelqu\'un a parlé ?'] },
    amitie: [
        [3, { bonjour: ['Ah, c\'est toi. Je t\'entends bien, toi. Tu parles clair.'] }],
        [6, { bonjour: ['\\P[1] ! Assieds-toi, mon petit. Le ciel a des choses à raconter.'] }],
        [10, { bonjour: ['~Il soulève son chapeau, pour toi seulement.|Bonjour, bonjour. Il fera beau. Je l\'ai décidé.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'les nuages', rdv: 'Viens demain à l\'aube. Avant sept heures. C\'est là que le ciel dit la vérité.', rappel: 'L\'aube ! Avant sept heures ! … Hein ? Oui, c\'est ça.', quand: { carte: 29, de: 5, a: 8 },
          gestes: ['~Il est assis sur un banc, la canne pointée vers le ciel.', 'Regarde. Ceux-là, en écailles : la pluie arrive dans deux jours. Ceux-là, en coton : rien du tout. Ils font les beaux.', ['bulle', 9],
              ['choix', ['Et celui-là, en forme de poisson ?', 'Comment vous savez ?'], [['~Il plisse les yeux très longtemps.|… Celui-là, c\'est un poisson. Il pleuvra des poissons. Hé hé.', ['son', 'Laugh', 40], ['ami', 1]], ['Soixante ans à regarder en l\'air. Et mes genoux. Surtout mes genoux.', ['ami', 1]]]]] },
        { palier: 6, titre: 'l\'almanach', rdv: 'Cet après-midi, le petit Tomas me lit son carnet. Viens écouter. Ça me fait rire.', rappel: 'Cet après-midi. Tomas lit. Hein ? Oui.', quand: { carte: 29, de: 13, a: 18 },
          gestes: [['dit', 'Tomas', '« Mardi, monsieur Fernand a dit pluie. Il a plu. Jeudi, il a dit soleil. Il a plu. »'], '~Fernand se gratte le menton.', 'Jeudi, c\'était un mensonge pour faire plaisir à la lavandière.',
              ['dit', 'Tomas', 'Je le note ?'], 'Note, note. Un almanach honnête, c\'est un almanach qui a des taches.', ['ami', 1]] },
        { palier: 10, titre: 'la canne', gestes: ['~Il te tend sa canne, solennellement, puis la reprend aussitôt.', 'Non, je te la donne pas. J\'en ai besoin. Mais je voulais voir ta tête.', 'Écoute. Quand tu pars loin, regarde le ciel. Il est le même partout. Ça aide à revenir.', ['ami', 1]] }
    ],
    cadeaux: { adore: [9, 46], aime: [44, 47], deteste: [10, 37],
        dits: { adore: ['Hein ? Pour moi ? … Merci, mon petit. Ça, c\'est un vrai cadeau. Ça se mange.'], aime: ['C\'est gentil. Il fera beau, demain. Pour toi.'],
            neutre: ['Hein ? Merci… je crois.'], deteste: ['Non, non, non. Ça, c\'est pour les jeunes. Mes genoux n\'en veulent pas.'], deja: ['Hein ? Encore ? Garde-le pour demain, il pleuvra.'], anniv: ['Pour mon anniversaire, en plus ! Il fera beau toute la semaine. Promis.'] } }
},

/* ── Béran (29:36) — le vétéran aux trois doigts ───────────────────────── */
'29:36': {
    oc: {
        age: '58 ans', allure: 'armure rapiécée, trois doigts à la main gauche, une barbe grise qu\'il taille au couteau',
        caractere: 'cynique, las, a trop vu ; mais tendre avec les enfants, et il le cache mal',
        aime: 'le pain d\'épices, une ronde sans histoire, tailler des épées de bois pour les petits',
        deteste: 'les discours des lords, les trompettes, qu\'on l\'appelle « héros »',
        reve: 'une maison avec un potager et des tomates qui ne lui obéissent pas',
        secret: 'c\'est lui qui a taillé l\'épée de bois d\'Élise ; il a dit à Kaze qu\'elle l\'avait trouvée',
        peur: 'vieillir dans une caserne',
        manie: 'il compte sur ses trois doigts, et il dit « trois, c\'est assez »',
        phrase: 'Trois, c\'est assez.',
        liens: { 'Élise': 'il lui apprend à tenir son épée de bois ; elle l\'appelle « Trois-Doigts »', Kaze: 'ils se reconnaissent sans rien dire', 'Le vieux': 'il lui paie un verre une fois par mois, sans un mot' }
    },
    anniversaire: '10/27', anniv: ['Mon anniversaire. Cinquante-huit. Les lords m\'ont oublié. La petite Élise, non : elle m\'a dessiné une couronne. Je la porte.'],
    lieux: {
        travail: ['~Il passe en ronde, la lance sur l\'épaule.|Rien à signaler. Comme j\'aime.'],
        place: ['Midi. Les petits courent, les vieux s\'assoient, et moi je surveille les deux.'],
        nuit: ['La nuit, la ronde est plus calme. On entend les chouettes. Elles font la ronde aussi.']
    },
    avis: {
        'Élise': ['La petite Élise m\'appelle « Trois-Doigts ». Personne d\'autre n\'a le droit. Elle, si.'],
        Kaze: ['L\'épicier, Kaze. Il marche comme un soldat. Il porte des sacs de farine comme un soldat. Il fait des soupes comme un père. Les trois.'],
        'Le vieux': ['Le vieux du comptoir, je lui paie un verre une fois par mois. On ne parle pas. C\'est la meilleure conversation du mois.']
    },
    aCote: { 'Élise': ['~Il cache quelque chose derrière son dos : un petit bouclier de bois.|… Rien. Je n\'ai rien.'] },
    amitie: [
        [3, { bonjour: ['Toi. Encore vivant. C\'est bien.'] }],
        [6, { bonjour: ['\\P[1]. Tu tiens ton arme mieux qu\'avant. Je regarde, tu sais.'], aurevoir: ['Rentre. Trois fois rien, mais rentre.'] }],
        [10, { bonjour: ['~Il lève sa main à trois doigts, comme un salut.|Trois, c\'est assez. Et toi, ça fait quatre.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'le couteau', rdv: 'Passe cet après-midi, pendant ma ronde. J\'ai un bout de bois à tailler. Il me faut quelqu\'un pour tenir.', rappel: 'Cet après-midi. Le bout de bois.', quand: { carte: 29, de: 13, a: 18 },
          gestes: ['Tiens ça. Droit.', '~Il taille un morceau de bois avec un vieux couteau. Les copeaux tombent sur tes bottes.', ['son', 'Hammer', 40], 'C\'est un bouclier. Pour la petite. Son épée est toute seule, ça la rend triste.',
              ['choix', ['Tu es gentil, Béran', 'Tu tailles bien'], [['~Il grogne.|Je suis pas gentil. Je suis vieux. Ça ressemble.', ['ami', 1]], ['Trois doigts suffisent. On croit qu\'il en faut cinq. Il en faut trois.', ['ami', 1]]]],
              'Pas un mot à Kaze. Il croit qu\'elle l\'a trouvée.'] },
        { palier: 6, titre: 'les tomates', rdv: 'Demain matin, viens à ma maison. Le petit jardin derrière. Ne te moque pas.', rappel: 'Demain matin. Le jardin. Ne te moque pas.', quand: { carte: 29, de: 7, a: 12 },
          gestes: ['~Derrière sa maison, trois pieds de tomates penchent dans tous les sens.', 'Trois. J\'ai trois tomates. Elles me désobéissent toutes.', ['bulle', 6], 'Trente ans à obéir. Et maintenant, j\'ai des tomates qui n\'obéissent pas. C\'est bien. C\'est très bien.',
              ['choix', ['Je t\'aide à les tuteurer', 'Elles sont belles'], [['~Vous plantez des bâtons. Elles penchent quand même. Il rit, pour la première fois.', ['son', 'Laugh', 40], ['ami', 1]], ['Belles… Elles sont tordues. Comme moi. C\'est pour ça que je les aime.', ['ami', 1]]]]] },
        { palier: 10, titre: 'le salut', gestes: ['~Il se met droit, comme pour un lord. Puis il te salue, à toi.', 'J\'ai salué trois lords. Aucun ne le méritait. Toi, si.', 'Ne le dis à personne. On croirait que je deviens gentil.', ['ami', 1]] }
    ],
    cadeaux: { adore: [45, 10], aime: [46, 86, 44], deteste: [63, 60],
        dits: { adore: ['~Il regarde l\'objet longtemps.|… Personne ne m\'a rien donné depuis… merci. C\'est tout. Merci.'], aime: ['Utile. Bien.'],
            neutre: ['Hm. Merci, je crois.'], deteste: ['Non. Ça, c\'est pour les nobles. Garde-le.'], deja: ['Un, c\'est assez. Trois, c\'est trop.'], anniv: ['Pour mon anniversaire… Tu es pire que la petite.'] } }
}
};
