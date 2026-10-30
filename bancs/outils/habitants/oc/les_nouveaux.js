/*
 * LES NOUVEAUX, leurs fiches OC — voir oc/ville.js pour les champs, et
 * les_nouveaux.js pour leurs mots de tous les jours et la phrase de la Bible
 * dont chacun est né.
 */
'use strict';
module.exports = {

/* ── Barthélemy (46:52) — le conteur ───────────────────────────────────── */
'46:52': {
    oc: {
        age: '71 ans', allure: 'barbe grise en pointe, manteau de colporteur aux poches recousues, un verre de lait chaud à la main',
        caractere: 'posé, chaleureux, malicieux ; raconte la Genèse sans jamais la changer, mais change tous les mots',
        aime: 'le silence juste avant la fin d\'un conte, le lait chaud, les enfants qui demandent « et après ? »',
        deteste: 'qu\'on raconte la fin à sa place, les fins tristes',
        reve: 'qu\'un enfant de la ville raconte un jour ses contes à sa place, en changeant les mots',
        secret: 'il ne sait pas lire ; tout ce qu\'il raconte, il l\'a entendu sur les routes',
        peur: 'oublier un conte en plein milieu',
        manie: 'il lève un doigt avant le moment important, et tout le monde se penche',
        phrase: '… et c\'est là que…',
        liens: { 'Petit-Louis': 'son meilleur public ; il triche à son jeu de mains, Barthélemy fait semblant de ne pas voir', Colin: 'le barde cherche une note, lui un silence ; ils se prêtent leurs publics', 'Zéphyrin': 'il le connaît depuis trente ans ; il n\'a pas vieilli (« c\'est le chapeau »)' }
    },
    anniversaire: '9/30', anniv: ['C\'est mon anniversaire. Je suis né la nuit de la Veillée. Ma mère disait que j\'étais arrivé en avance pour le Premier.'],
    lieux: {
        bar: ['~Autour de lui, trois tables se sont tournées sans le dire.|Ce soir, un conte court. Les longs, c\'est l\'hiver.'],
        ailleurs: ['~Assis sur le rebord du puits, des enfants à ses pieds.|… et c\'est là que… Ah, bonjour. On en était au triangle.']
    },
    avis: {
        'Petit-Louis': ['Petit-Louis gagne toujours à son jeu de mains. Il regarde les mains avant. Je ne dis rien : il faut bien qu\'un enfant gagne.'],
        Colin: ['Le barde chante la fin trop tôt. Je lui ai dit : garde-la. Il l\'a gardée. Il chante mieux.'],
        'Zéphyrin': ['Zéphyrin, le marchand de la Veillée, vient chaque année. Trente ans, et le même chapeau. Le chapeau, lui, a vieilli.']
    },
    aCote: { Colin: ['~Il fait signe au barde.|Une note pour commencer ? … Non, pas celle-là. Celle d\'avant.'] },
    amitie: [
        [3, { bonjour: ['Ah, mon auditeur ! Je t\'ai gardé une place.'] }],
        [6, { bonjour: ['\\P[1] ! Ce soir, je raconte pour toi. Les autres écouteront par-dessus ton épaule.'], aurevoir: ['Va vivre quelque chose. J\'aurai besoin d\'histoires neuves.'] }],
        [10, { bonjour: ['~Il lève son verre de lait chaud, très haut.|À celui dont je raconterai l\'histoire !'] }]
    ],
    scenes: [
        { palier: 3, titre: 'le silence', rdv: 'Ce soir, après vingt heures, assieds-toi près de moi. Je vais te montrer le secret d\'un conte. Ce n\'est pas un mot.', rappel: 'Ce soir. Le secret. Ce n\'est pas un mot.', quand: { carte: 46, de: 20, a: 24 },
          gestes: ['… et c\'est là que…', ['bulle', 8], '~Il lève un doigt. Il se tait. Toute la table se penche. Margot s\'arrête avec son plateau. Même le vieux tourne la tête.', ['attend', 60],
              '~Il baisse le doigt et sourit.|Voilà. Le secret, c\'est ce silence-là. Ce qu\'on dit après, ce n\'est presque rien. Ils l\'ont déjà entendu dans leur tête.',
              ['choix', ['Et la fin ?', 'Je garderai le secret'], [['La fin ? … Demain. Il faut toujours une fin demain.', ['ami', 1]], ['~Il hoche la tête.|Un conteur de plus. Le monde en a besoin.', ['ami', 1]]]]] },
        { palier: 6, titre: 'ton conte', rdv: 'Demain après-midi, sur la place de la ville, les petits m\'attendent. Viens. Cette fois, c\'est toi qui racontes.', rappel: 'Demain après-midi, la place. C\'est toi qui racontes !', quand: { carte: 29, de: 14, a: 18 },
          gestes: ['~Des enfants assis en rond, Élise au premier rang, Tomas au deuxième, Petit-Louis debout.', 'Les enfants, aujourd\'hui, ce n\'est pas moi. C\'est quelqu\'un qui est allé là-bas.', ['bulle', 1],
              ['choix', ['Raconter un combat', 'Raconter un voyage'], [['~Tu racontes un combat. Élise mime les coups, Tomas se cache derrière ses mains, Petit-Louis crie « et après ? ».', ['son', 'Applause1', 50], 'Pas mal. Tu as raconté la fin trop tôt. Mais pas mal.', ['ami', 1]],
                  ['~Tu racontes une route, une forêt, un ciel. Les enfants se taisent. Même Petit-Louis.', 'Tu vois ? Le silence. Tu l\'as trouvé tout seul.', ['ami', 1]]]]] },
        { palier: 10, titre: 'le dernier conte', gestes: ['~Il pose son verre.', 'Je connais six contes. Le septième, je ne l\'ai jamais entendu. C\'est celui qui finit bien pour tout le monde.', 'Je crois que c\'est le tien. Raconte-le-moi, un jour. Quand il sera fini.', ['ami', 1]] }
    ],
    cadeaux: { adore: [9, 7], aime: [44, 48, 46], deteste: [10, 47],
        dits: { adore: ['~Il serre l\'objet contre lui.|Ah… Ça, c\'est un début de conte. « Il était une fois quelqu\'un qui m\'apporta… » Merci.'], aime: ['Merci. Je le garde pour l\'hiver, quand les contes sont longs.'],
            neutre: ['Merci ! Je trouverai bien une histoire où le mettre.'], deteste: ['Non, non. Ça, ça fait trembler la voix. Garde-le.'], deja: ['Un cadeau par jour. Comme un conte : plus, ça se mélange.'], anniv: ['Pour mon anniversaire… Le soir de la Veillée, en plus. Tu as écouté mes contes.'] } }
},

/* ── Petit-Louis (29:59) ───────────────────────────────────────────────── */
'29:59': {
    oc: {
        age: '8 ans', allure: 'casquette verte à l\'envers, genoux verts d\'herbe, les poings toujours prêts pour une partie',
        caractere: 'malin, fanfaron, mauvais perdant ; compte les points sur ses doigts et invente des règles quand il perd',
        aime: 'gagner, les contes de Barthélemy (surtout le triangle), les radis de grand-père (crus)',
        deteste: 'perdre, la cuillère d\'Hector et Maude (elle les fait se disputer)',
        reve: 'devenir le champion de « Corps, Âme, Esprit » de tous les royaumes',
        secret: 'il joue pour que Tomas joue avec eux : Tomas n\'aime pas courir, mais les mains, si',
        peur: 'que grand-père Hector arrête de tricher : ça voudrait dire qu\'il est trop vieux',
        manie: 'il fait les trois gestes très vite, quand il réfléchit',
        phrase: 'Corps… Âme… ESPRIT !',
        liens: { 'Hector et Maude': 'ses grands-parents ; il cache la cuillère pour qu\'ils se disputent mieux', 'Élise': 'elle joue toujours le Corps', Tomas: 'il joue l\'Esprit parce que c\'est réfléchir', 'Barthélemy': 'le conteur, qui a donné les règles' }
    },
    anniversaire: '2/2', anniv: ['C\'EST MON ANNIVERSAIRE ! Grand-mère a fait une tarte. Grand-père a triché pour me laisser gagner. Je l\'ai vu. Je l\'aime.'],
    lieux: {
        place: ['À midi, sur la place, c\'est le grand tournoi ! Enfin, c\'est moi contre Élise. Elle joue le Corps. Je gagne.'],
        repos: ['Le jour de repos, grand-père joue avec moi toute la matinée. Il perd exprès. Il croit que je vois pas.']
    },
    avis: {
        'Élise': ['Élise joue toujours le Corps. TOUJOURS. Elle dit que c\'est parce que c\'est le plus fort. Le Corps perd contre l\'Esprit !'],
        Anouk: ['La grande en rouge, Anouk, elle m\'a vu tricher. Elle l\'a écrit dans son carnet. Elle a rien dit. Elle est sympa, pour une patrouille.'],
        'Zéphyrin': ['Le monsieur au chapeau rouge vient une nuit par an. Il m\'a donné un bocal parce que je m\'étais endormi. Cette année, je reste éveillé. Promis.'],
        Tomas: ['Tomas réfléchit trop longtemps. Le temps qu\'il choisisse, j\'ai joué deux fois.'],
        'Barthélemy': ['Le monsieur des contes dit que le triangle, c\'est l\'histoire du monde. Moi je dis que c\'est un jeu. On a raison tous les deux.']
    },
    aCote: { 'Élise': ['~Il serre déjà le poing.|Élise ! Revanche ! Tu joues le Corps ? … Tu joues TOUJOURS le Corps.'] },
    amitie: [
        [3, { bonjour: ['Toi ! Une partie ! Allez !'] }],
        [6, { bonjour: ['\\P[1] ! Mon rival ! J\'ai une nouvelle technique. Je te la montre pas.'], aurevoir: ['Entraîne-toi ! Tu perds trop !'] }],
        [10, { bonjour: ['~Il te tend la main, pas pour jouer : pour la serrer.|Bonjour, champion. Le deuxième champion. Après moi.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'le tournoi', rdv: 'Demain, après le déjeuner, sur la place ! Le grand tournoi ! Élise et Tomas seront là ! Tu viens ?', rappel: 'Le tournoi ! Demain après-midi ! T\'as intérêt à t\'entraîner !', quand: { carte: 29, de: 13, a: 18 },
          gestes: ['Mesdames et messieurs ! Le grand tournoi de Corps, Âme, Esprit !', ['son', 'Applause1', 40], ['dit', 'Élise', 'Je joue le Corps !'], ['dit', 'Tomas', 'Elle joue toujours le Corps.'], 'Et maintenant… le champion contre toi !', ['bulle', 1],
              ['choix', ['Jouer l\'Esprit', 'Jouer l\'Âme'], [['~Il a joué le Corps. L\'Esprit bat le Corps. Tu as gagné.', 'QUOI ?! … C\'est… c\'est la règle. C\'est le monsieur des contes qui l\'a dite. … Bien joué.', ['ami', 1]],
                  ['~Il a joué le Corps. Le Corps bat l\'Âme. Il saute de joie.', ['son', 'Laugh', 40], 'CHAMPION ! … Mais t\'as bien joué. Un peu.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la cuillère', rdv: 'Viens demain matin devant la maison de grand-père. Avant midi. J\'ai un secret. Il est en métal.', rappel: 'Demain matin ! Le secret en métal !', quand: { carte: 29, de: 8, a: 12 },
          gestes: ['~Il sort de sa poche une cuillère en bois, toute simple.', 'C\'est LA cuillère. Celle de la dispute de grand-père et grand-mère. Ils se disputent depuis trente ans pour elle.', 'Je la cache. Quand ils la cherchent, ils se disputent. Et après, ils rient. Ils rient toujours, après.', ['bulle', 4],
              ['choix', ['Rends-la-leur', 'Garde ton secret'], [['… D\'accord. Mais je la cacherai encore demain. Faut bien qu\'ils rient.', ['ami', 1]], ['~Il remet la cuillère dans sa poche, très sérieux.|C\'est notre secret. T\'es mon complice, maintenant.', ['ami', 1]]]]] },
        { palier: 10, titre: 'la vraie règle', gestes: ['~Il regarde ses mains, longtemps.', 'Tu sais, j\'ai jamais vraiment gagné contre toi. Je regardais tes mains avant.', 'La prochaine fois, je regarde pas. Promis. On jouera pour de vrai.', ['ami', 1]] }
    ],
    cadeaux: { adore: [103, 44], aime: [9, 7], deteste: [48, 8],
        dits: { adore: ['UN TRÉSOR ! Merci ! Je vais le montrer à grand-père ! Il va dire que c\'est de son temps !'], aime: ['Merci ! Je le mets avec mes trophées. J\'ai un caillou et une cuillère. Et ça.'],
            neutre: ['C\'est quoi ? … Merci quand même.'], deteste: ['Beurk. C\'est pour les vieux, ça. Donne-le à grand-mère.'], deja: ['Déjà un cadeau ! Grand-mère dit qu\'un, c\'est poli.'], anniv: ['ET C\'EST MON ANNIVERSAIRE ! T\'as gagné le tournoi des cadeaux !'] } }
},

/* ── Anouk (29:60) ─────────────────────────────────────────────────────── */
'29:60': {
    oc: {
        age: '15 ans', allure: 'uniforme rouge de Rubis repassé au pli près, chignon serré, un carnet de patrouille et trois crayons taillés',
        caractere: 'zélée, réglementaire, parle comme un rapport ; s\'adoucit dès qu\'on la prend au sérieux',
        aime: 'les carnets à jour, la devise de l\'académie, que tout soit à sa place, Timothée (en binôme, dit-elle)',
        deteste: 'le désordre, qu\'on se moque de la patrouille, les pigeons « suspects »',
        reve: 'entrer au Haut Cercle de sa promotion — par l\'évaluation éthique, pas par la force',
        secret: 'elle a une colonne « bien » dans son carnet, et le nom de Timothée y revient plus souvent que dans « dégâts »',
        peur: 'qu\'on la trouve ridicule',
        manie: 'elle note tout, même les compliments, avec la date',
        phrase: 'Je note.',
        liens: { 'Timothée': 'son binôme ; elle note ses dégâts et ses bonnes actions', Ysaline: 'la cinquième année de l\'auberge, qui la trouve trop sérieuse', 'Petit-Louis': 'il triche ; elle l\'a noté ; elle n\'a rien fait' }
    },
    anniversaire: '11/21', anniv: ['C\'est mon anniversaire. J\'ai quinze ans. Je l\'ai noté. Timothée m\'a offert un crayon. Il l\'a cassé en me le donnant.'],
    lieux: {
        travail: ['~Elle fait le tour de la place à pas comptés, le carnet ouvert.|Patrouille. Rien à signaler. Je signale quand même que rien n\'est à signaler.'],
        nuit: ['La patrouille de nuit, c\'est la garde. Nous, on rentre à l\'auberge. Je vérifie quand même les lanternes en passant.']
    },
    avis: {
        'Timothée': ['Timothée a encore renversé un étal au Marché. Je l\'ai noté. Puis il a ramassé toutes les pommes. Je l\'ai noté aussi. Dans l\'autre colonne.'],
        'Petit-Louis': ['Le petit Petit-Louis triche à son jeu de mains. Il regarde avant. Je l\'ai noté. Je n\'ai rien fait. Ce n\'est pas de la patrouille, c\'est de l\'enfance.']
    },
    amitie: [
        [3, { bonjour: ['Ah. Vous. … Toi. Rien à signaler ? Parfait.'] }],
        [6, { bonjour: ['\\P[1] ! Je t\'ai noté dans la colonne « bien ». Deux fois.'], aurevoir: ['Prudence. C\'est la règle. Et je t\'aime bien. Ce n\'est pas la règle.'] }],
        [10, { bonjour: ['~Elle ferme son carnet en te voyant.|Je ne note rien quand c\'est toi. C\'est une faveur.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'le carnet', rdv: 'Demain matin, pendant ma ronde. Avant midi. J\'ai besoin d\'un témoin pour un rapport.', rappel: 'Demain matin. Le rapport. Tu es témoin.', quand: { carte: 29, de: 8, a: 12 },
          gestes: ['~Elle ouvre son carnet. Deux colonnes : « dégâts » et « bien ».', 'Regarde. Le rapport de la saison. Timothée : quatre dégâts. Et ici… sept fois « bien ».', ['bulle', 6], 'Je dois remettre le rapport à l\'académie. Ils ne lisent que la première colonne.',
              ['choix', ['Mets la colonne « bien » en premier', 'Ils liront tout'], [['~Elle te regarde, les yeux ronds, puis recopie la page à l\'envers.|… C\'est réglementaire ? … Ce n\'est pas interdit. Je note.', ['ami', 1]], ['Tu crois ? … L\'évaluation éthique compte autant que la force. Alors oui. Ils liront tout.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la devise', rdv: 'Demain après-midi, viens. Sur la place. Je dois réciter la devise pour mon examen. Devant quelqu\'un.', rappel: 'Demain après-midi. La devise. Ne ris pas.', quand: { carte: 29, de: 13, a: 18 },
          gestes: ['~Elle se tient droite comme une lance, le menton levé.', '« Le pouvoir se gagne. Le nom se forge. Le mana est vivant. »', '~Sa voix tremble au dernier mot. Elle rougit.', ['bulle', 6], 'Le mana est vivant. Je… je le dis toujours trop vite. Je ne sais pas ce que ça veut dire.',
              ['choix', ['Ça veut dire qu\'il change', 'Personne ne sait'], [['Qu\'il change… Comme Timothée qui tombe moins. Comme moi qui note moins. … Oui. Je comprends.', ['ami', 1]], ['~Elle rit, pour la première fois.|Personne ? Alors je suis comme tout le monde. C\'est reposant.', ['ami', 1]]]]] },
        { palier: 10, titre: 'la colonne', gestes: ['~Elle déchire une page de son carnet et te la tend. En haut : « bien ». Dessous, ton nom, des dates, des petites croix.', 'Je ne peux pas la garder. Elle est trop longue. Ce n\'est plus un rapport, c\'est… autre chose.', 'Garde-la. Et ne la montre pas à Timothée. Il croirait que je suis gentille.', ['ami', 1]] }
    ],
    cadeaux: { adore: [94, 48], aime: [47, 44, 9], deteste: [10, 42],
        dits: { adore: ['~Elle examine l\'objet, le note, puis le serre contre son carnet.|… C\'est parfaitement adapté. Merci. Je note : « merci ».'], aime: ['Merci. Je le note dans la colonne « bien ».'],
            neutre: ['Merci. Je ne sais pas où le noter.'], deteste: ['De la bière ? À une élève en patrouille ? Je devrais te noter. … Garde-la.'], deja: ['Un cadeau par jour. Au-delà, ce serait de la corruption. Je devrais le noter.'], anniv: ['Pour mon anniversaire… Je note. En gros.'] } }
},

/* ── Timothée (30:28) ──────────────────────────────────────────────────── */
'30:28': {
    oc: {
        age: '15 ans', allure: 'uniforme rouge de Rubis avec une manche décousue, des genoux toujours écorchés, un sourire d\'excuse',
        caractere: 'maladroit, poli, gentil ; s\'excuse auprès des objets ; très bon en Parole de protection, très mauvais avec ses jambes',
        aime: 'les pommes de Bertrand, les barrières de Parole bien posées, Anouk (« elle est rigoureuse »)',
        deteste: 'les escaliers, les étals mal fixés, qu\'on rie quand il tombe (il rit aussi)',
        reve: 'protéger quelqu\'un pour de vrai, une fois, sans rien renverser',
        secret: 'c\'est lui qui a retrouvé la petite perdue au Marché ; il n\'en parle jamais, Anouk l\'a noté',
        peur: 'que l\'académie le renvoie à cause de la facture des dégâts',
        manie: 'il dit « pardon » aux paniers, aux tables et aux pigeons',
        phrase: 'Pardon ! Pardon.',
        liens: { Anouk: 'son binôme ; elle le note, il le sait, il l\'admire', Bertrand: 'le marchand de primeurs, qui lui donne une pomme chaque matin « pour qu\'il laisse les autres sur l\'étal »', Ysaline: 'la cinquième année qui lui apprend à tomber sans casser' }
    },
    anniversaire: '1/30', anniv: ['C\'est mon anniversaire ! Monsieur Bertrand m\'a offert un panier de pommes. Je l\'ai renversé. Il a ri. Moi aussi.'],
    lieux: {
        travail: ['~Il contourne un étal avec une prudence de funambule.|Pardon. Je passe. Je passe très lentement.', 'Le Marché, c\'est le pire endroit pour un maladroit. Et le meilleur pour apprendre.'],
        place: ['À midi, il y a trop de monde au Marché. Je me mets contre un mur. Les murs ne renversent rien.']
    },
    avis: {
        Anouk: ['Anouk note tout. Mes dégâts, je sais. Mais elle note aussi mes bonnes actions, je l\'ai vu. Elle est rigoureuse. Elle est… voilà.'],
        Bertrand: ['Monsieur Bertrand me donne une pomme chaque matin. Il dit que c\'est pour que je laisse les autres sur l\'étal. Ça marche à moitié.']
    },
    amitie: [
        [3, { bonjour: ['Bonjour ! Pardon. Bonjour. Je n\'ai rien cassé aujourd\'hui ! Pour l\'instant.'] }],
        [6, { bonjour: ['\\P[1] ! Je t\'ai vu arriver, j\'ai reculé, j\'ai renversé un seau. C\'était de joie.'], aurevoir: ['Fais attention ! … Je dis ça à moi aussi.'] }],
        [10, { bonjour: ['~Il marche vers toi sans rien renverser. Il en est très fier.|Tu as vu ? Rien ! Rien du tout !'] }]
    ],
    scenes: [
        { palier: 3, titre: 'la barrière', rdv: 'Passe demain au Marché, l\'après-midi. Je vais te montrer ce que je sais faire. Quelque chose qui ne tombe pas.', rappel: 'Demain après-midi. Quelque chose qui ne tombe pas !', quand: { carte: 30, de: 13, a: 18 },
          gestes: ['~Il ferme les yeux, murmure une Parole très courte.', ['son', 'Saint5', 50], '~Une barrière de lumière pâle se dresse devant l\'étal de Bertrand, parfaite, immobile.', ['bulle', 1], 'Tu vois ? Une barrière. Elle tient. Elle tient toujours. C\'est moi qui ne tiens pas.',
              ['choix', ['Elle est magnifique', 'Tu es doué'], [['~Il rougit si fort que la barrière clignote.|Merci ! … Oh non, elle… non, elle tient. Ouf.', ['ami', 1]], ['Doué… On ne m\'avait jamais dit ça. On m\'avait dit « encore toi ». C\'est mieux, doué.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la petite perdue', rdv: 'Demain matin, au Marché, avant midi. Je dois te raconter quelque chose. Ne le dis pas à Anouk. Elle le sait déjà.', rappel: 'Demain matin. Le Marché. Pas un mot à Anouk.', quand: { carte: 30, de: 8, a: 12 },
          gestes: ['~Il regarde l\'endroit où les allées se croisent.', 'Le mois dernier, une petite s\'est perdue là. Elle pleurait. Personne ne l\'entendait, avec le bruit.', 'Moi, je l\'ai entendue. Parce que j\'étais par terre. J\'avais encore trébuché.', ['bulle', 4],
              ['choix', ['Tomber, ça sert', 'Tu l\'as sauvée'], [['~Il éclate de rire.|Tomber, ça sert ! Je vais le dire à Anouk. Elle va le noter.', ['ami', 1]], ['Sauvée… Je l\'ai ramenée à sa mère. C\'est tout. … C\'est beaucoup, en fait. Merci de le dire.', ['ami', 1]]]]] },
        { palier: 10, titre: 'debout', gestes: ['~Il se tient très droit, sans rien toucher.', 'Tu sais ce que dit l\'académie ? Personne n\'est abandonné. Même ceux qui tombent.', 'Toi non plus, tu ne m\'as pas abandonné. Alors je te protégerai. Avec une barrière. Qui tient.', ['ami', 1]] }
    ],
    cadeaux: { adore: [44, 63], aime: [9, 47, 46], deteste: [38, 10],
        dits: { adore: ['~Il le prend à deux mains, très prudemment, et ne le laisse pas tomber.|Je ne l\'ai pas fait tomber ! Merci ! Merci deux fois !'], aime: ['Merci ! Je le range… là. Il est rangé. Il n\'est pas tombé.'],
            neutre: ['Oh, merci ! Pardon, c\'est quoi ?'], deteste: ['~Il recule d\'un pas, et heurte un panier.|Non ! Ça, je vais le faire exploser. Garde-le, pardon.'], deja: ['Déjà un cadeau ! Je n\'ai pas assez de mains. Ni d\'équilibre.'], anniv: ['Pour mon anniversaire ! Je vais le tenir à deux mains toute la journée.'] } }
},

/* ── Évariste (29:61) ──────────────────────────────────────────────────── */
'29:61': {
    oc: {
        age: '72 ans', allure: 'gilet taché de mille couleurs, des sourcils roussis par cinquante explosions, un journal qu\'il ne lit jamais',
        caractere: 'grincheux, drôle, précis ; parle aux fioles comme à des élèves ; tendre avec les apprentis maladroits',
        aime: 'les tisanes, les bons dosages, regarder les gens passer, déjeuner avec Aldebert le jeudi (pour se disputer)',
        deteste: 'les potions laissées au soleil, les apprentis qui ne mesurent pas, qu\'on dise que l\'alchimie, c\'est de la cuisine',
        reve: 'voir la petite Oriane réussir un élixir sans rien faire brûler',
        secret: 'il garde dans sa poche la première fiole qu\'il a ratée ; elle est encore tiède, cinquante ans après',
        peur: 'oublier une recette ; alors il les récite le matin, sur son banc',
        manie: 'il renifle l\'air et devine ce qui se prépare à trois rues',
        phrase: 'Mauvais dosage.',
        liens: { Oriane: 'l\'apprentie du Marché qui fait tout brûler ; elle vient lui demander pourquoi', Aldebert: 'son rival du jeudi, son meilleur ami du jeudi', Mireille: 'elle habite la même maison ; elle lui raconte tout, il ne retient rien' }
    },
    anniversaire: '6/12', anniv: ['Mon anniversaire. Soixante-douze. J\'ai fêté ça en ne faisant rien exploser. C\'est un exploit, à mon âge.'],
    lieux: {
        travail: ['~Il renifle l\'air.|Quelqu\'un fait un élixir de vigueur, rue du bas. Trop de racine. Ça va mousser. … Voilà, ça mousse.'],
        place: ['Midi. Les gens passent. Je les regarde. Personne n\'explose. C\'est reposant.'],
        repos: ['Le jour de repos, Aldebert vient s\'asseoir sur mon banc. On ne se parle pas. C\'est notre façon de se parler.']
    },
    avis: {
        Mireille: ['Mireille habite la même maison que moi. Elle me raconte tout. Je ne retiens rien. C\'est pour ça qu\'elle m\'aime bien.']
    },
    amitie: [
        [3, { bonjour: ['Ah, toi. Tu sens moins la sueur qu\'avant. Tu as changé de savon ?'] }],
        [6, { bonjour: ['\\P[1]. Assieds-toi. Le banc est assez large pour deux vieux. Ou un vieux et un idiot. Je plaisante.'], aurevoir: ['Bois de l\'eau. Et pas de potion au soleil.'] }],
        [10, { bonjour: ['~Il se pousse sur son banc pour te faire de la place, sans un mot.|… Bon. Bonjour.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'le nez', rdv: 'Demain matin, viens sur mon banc. Avant midi. Je vais t\'apprendre à sentir une potion ratée. Ça sauve des vies. Et des sourcils.', rappel: 'Demain matin. Le banc. Apporte ton nez.', quand: { carte: 29, de: 8, a: 12 },
          gestes: ['~Il sort trois fioles de son gilet et les débouche une à une.', 'Celle-là : réussie. Celle-là : trop de soufre. Celle-là… à toi.', ['bulle', 2],
              ['choix', ['Elle sent la menthe', 'Elle sent le brûlé'], [['La menthe ! C\'est une potion de soin, et elle est parfaite. Tu as du nez. Je ne l\'aurais pas parié.', ['ami', 1]], ['~Il renifle, fronce les sourcils, renifle encore.|… Tu as raison. Elle est ratée. C\'est la mienne. Ne le dis à personne.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la fiole tiède', rdv: 'Passe un soir, avant la nuit. Vers dix-huit heures, sur mon banc. Je vais te montrer ce que je ne montre à personne.', rappel: 'Ce soir, le banc. Ce que je ne montre à personne.', quand: { carte: 29, de: 17, a: 21 },
          gestes: ['~Il sort de sa poche une petite fiole fêlée, pleine d\'un liquide doré.', 'Ma première potion. Ratée. Elle devait soigner. Elle chauffe. Depuis cinquante ans, elle chauffe.', '~Il te la pose dans la main. Elle est tiède, comme une main.', ['bulle', 8],
              ['choix', ['Elle n\'est pas ratée', 'Pourquoi la garder ?'], [['… Pas ratée ? Elle ne soigne rien. Elle tient chaud. … C\'est peut-être pareil. Hm. Tu me fais réfléchir. À mon âge, c\'est impoli.', ['ami', 1]], ['Pour me souvenir que rater, ça peut durer cinquante ans et rester tiède. C\'est une bonne leçon pour Oriane.', ['ami', 1]]]]] },
        { palier: 10, titre: 'la recette', gestes: ['~Il te tend un papier plié, couvert d\'une écriture minuscule.', 'Ma meilleure recette. Une tisane. Elle ne fait rien de magique. Elle fait dormir les gens qui pensent trop.', 'Je ne l\'ai jamais donnée à personne. Aldebert la veut depuis vingt ans. Ne la lui donne pas.', ['ami', 1]] }
    ],
    cadeaux: { adore: [48, 3], aime: [53, 9, 73], deteste: [38, 35],
        dits: { adore: ['~Il renifle l\'objet, très longtemps.|… Bon dosage. Excellent dosage. Merci. Tu as du goût, pour un idiot. Je plaisante.'], aime: ['Hm. Bien. Utile.'],
            neutre: ['Merci. Je l\'analyserai.'], deteste: ['Une bombe ? À un vieil alchimiste ? J\'ai assez explosé dans ma vie. Remporte ça.'], deja: ['Un par jour. Au-delà, c\'est un surdosage.'], anniv: ['Pour mon anniversaire. Hm. Merci. Vraiment.'] } }
},

/* ── Pervenche (30:29) ─────────────────────────────────────────────────── */
'30:29': {
    oc: {
        age: '28 ans', allure: 'doigts bleus jusqu\'aux poignets, un tablier aux poches pleines de flacons, une plume dans les cheveux',
        caractere: 'douce, rêveuse ; parle des encres comme des parfums ; écrit à sa sœur tous les soirs',
        aime: 'le bleu pervenche, l\'odeur de l\'encre neuve, les belles écritures, les lettres de sa sœur',
        deteste: 'l\'encre qui bave, le vent qui emporte les pages, qu\'on écrive au crayon',
        reve: 'une paire de parchemins jumeaux, pour écrire à sa sœur le soir en même temps',
        secret: 'elle écrit aussi des poèmes, en encre invisible ; Jehan les a déjà lus sans le savoir',
        peur: 'que sa sœur arrête de répondre',
        manie: 'elle souffle sur tout ce qu\'elle vient d\'écrire, même sur une liste de courses',
        phrase: 'Tout commence par une encre.',
        liens: { Jehan: 'l\'écrivain public ; il trouve son encre « sans caractère » et revient chaque semaine', Colette: 'elle achète l\'encre la plus noire, sans un mot', 'Ninon': 'la coursière qui porte ses lettres à la côte' }
    },
    anniversaire: '3/24', anniv: ['C\'est mon anniversaire ! Ma sœur m\'a envoyé une lettre il y a un mois pour qu\'elle arrive aujourd\'hui. Elle est arrivée hier. C\'est presque parfait.'],
    lieux: {
        travail: ['~Elle aligne ses flacons par nuances, du bleu ciel au bleu de nuit.|Le bleu de nuit se vend le soir. Le bleu ciel, le matin. Les gens écrivent selon le ciel.']
    },
    avis: {
        'Ninon': ['Ninon porte mes lettres jusqu\'à la côte. Elle court si vite que l\'encre n\'a pas le temps de sécher. Ma sœur reçoit des lettres floues. Elle adore.']
    },
    amitie: [
        [3, { bonjour: ['Bonjour ! J\'ai une nouvelle nuance. Bleu « matin calme ». Tu veux sentir ?'] }],
        [6, { bonjour: ['\\P[1] ! J\'ai écrit ton nom en bleu pervenche, pour essayer une plume. C\'est très joli.'], aurevoir: ['Écris-moi ! Même trois mots.'] }],
        [10, { bonjour: ['~Elle te tend un flacon fermé d\'un ruban.|C\'est ta couleur. Je l\'ai mélangée exprès. Elle n\'a pas encore de nom.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'la nuance', rdv: 'Passe demain au Marché, le matin. Je mélange une encre neuve. Il me faut quelqu\'un pour la nommer.', rappel: 'Demain matin ! L\'encre neuve ! Réfléchis à un nom !', quand: { carte: 30, de: 8, a: 13 },
          gestes: ['~Elle verse un bleu dans un violet, remue, ajoute une goutte de vert.', ['son', 'Water1', 40], 'Voilà. Regarde la couleur quand elle sèche.', ['bulle', 3],
              ['choix', ['« Soir de Veillée »', '« Lac du matin »'], [['« Soir de Veillée »… Oh. Oui. C\'est exactement ça. Je l\'écris sur l\'étiquette.', ['ami', 1]], ['« Lac du matin »… Elle est un peu trop sombre pour le matin. Mais je garde le nom. Pour la prochaine.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la lettre à la sœur', rdv: 'Ce soir, avant que le Marché ferme, vers dix-sept heures. J\'écris à ma sœur. Tu veux ajouter un mot ?', rappel: 'Ce soir, la lettre à ma sœur. Pense à ton mot.', quand: { carte: 30, de: 16, a: 19 },
          gestes: ['~Elle écrit, souffle, écrit encore. Puis elle te tend la plume.', 'Ma sœur demande toujours : « Tu as des amis, là-bas ? ». Cette fois, je peux dire oui. Écris quelque chose.',
              ['choix', ['« Votre sœur va bien »', '« Elle parle de vous tout le temps »'], [['~Tu écris. Elle souffle sur ta phrase.|« Votre sœur va bien. » C\'est court. C\'est parfait. Elle va pleurer.', ['ami', 1]], ['~Elle rougit jusqu\'aux doigts, qui sont déjà bleus.|C\'est vrai, en plus. Bon. Je laisse. Elle va rire.', ['ami', 1]]]],
              'Ninon la portera demain. Avec un peu de chance, l\'encre aura séché.'] },
        { palier: 10, titre: 'le poème', gestes: ['~Elle passe une bougie sous une page blanche. Des mots bleus apparaissent, lentement.', 'De l\'encre invisible. J\'écris des poèmes, comme ça. Personne ne les voit.', 'Celui-là, il parle de quelqu\'un qui arrive au Marché avec de la poussière de route sur les bottes. Je te laisse deviner.', ['ami', 1]] }
    ],
    cadeaux: { adore: [94, 7], aime: [48, 44, 9], deteste: [41, 8],
        dits: { adore: ['~Ses yeux brillent.|Pour moi ? Je vais en faire une encre. Ou un poème. Ou les deux. Merci !'], aime: ['Merci ! C\'est doux. Comme une page neuve.'],
            neutre: ['Oh, merci ! Je trouverai sa couleur.'], deteste: ['~Elle le tient du bout des doigts.|Ça tache. Ça tache vraiment. Garde-le, je t\'en prie.'], deja: ['Un cadeau par jour ! Sinon je n\'aurai plus de place sur mon étal.'], anniv: ['Pour mon anniversaire ! Ma sœur va être jalouse. Je vais le lui écrire.'] } }
},

/* ── Ninon (30:30) ─────────────────────────────────────────────────────── */
'30:30': {
    oc: {
        age: '19 ans', allure: 'bonnet de coursière, sacoche de cuir plus grosse qu\'elle, des bottes usées jusqu\'à la corde',
        caractere: 'essoufflée, joyeuse, toujours en retard ; connaît tout le monde par son adresse ; ne s\'arrête jamais plus d\'une minute',
        aime: 'courir, les raccourcis, qu\'on lui offre à boire en passant, les lettres d\'amour (elle les reconnaît au poids)',
        deteste: 'les escaliers, les adresses mal écrites, qu\'on lui demande « c\'est pour moi ? » (elle ne peut pas dire)',
        reve: 'devenir aventurière, après avoir connu tous les chemins — comme ça, elle saura toujours rentrer',
        secret: 'Mireille ne reçoit jamais de lettres ; alors Ninon lui en écrit une, une fois par mois, sans signer',
        peur: 'perdre une lettre',
        manie: 'elle court sur place quand elle parle',
        phrase: 'Je suis en retard ! Je suis toujours en retard !',
        liens: { Mireille: 'elle l\'attend à chaque passage pour savoir qui reçoit quoi ; Ninon lui écrit en secret', Pervenche: 'ses lettres à la côte, encore humides', Jacquot: 'le colporteur, qui lui vend des lacets « magiques »' }
    },
    anniversaire: '5/27', anniv: ['C\'est mon anniversaire ! Je cours quand même ! Mais je cours en souriant !'],
    lieux: {
        travail: ['~Elle trie des lettres en marchant.|Une pour le Village de Pêche, deux pour la ville, une pour… qui écrit encore à son percepteur ?'],
        ailleurs: ['~Elle passe en courant, revient en arrière.|Salut ! Je livre ! Je repasse ! Peut-être !', 'Une lettre pour le Village de Pêche ! … Où est la maison bleue ? Elles sont toutes bleues !']
    },
    avis: {
        Mireille: ['Mireille m\'attend à chaque passage. Elle ne reçoit jamais de lettres. Elle veut juste savoir qui en reçoit. Je ne dis jamais rien. Ça la rend folle.'],
        'Clémence': ['La recrue Clémence me paie un café pour savoir ce qui arrive au tableau de la Bourse. Je lui dis. Elle note tout. Elle sera riche avant moi.'],
        Pervenche: ['Pervenche me confie ses lettres pour sa sœur. Elle souffle dessus avant. Je cours si vite que l\'encre est encore fraîche à l\'arrivée.']
    },
    amitie: [
        [3, { bonjour: ['Toi ! Rien pour toi aujourd\'hui ! … Je dis ça à tout le monde. Désolée.'] }],
        [6, { bonjour: ['\\P[1] ! Je connais ton adresse, maintenant. Enfin, toutes tes adresses. Tu bouges beaucoup.'], aurevoir: ['Je file ! Envoie-moi une lettre, je te l\'apporterai moi-même !'] }],
        [10, { bonjour: ['~Elle s\'arrête. Complètement. Pour toi.|Une minute entière. C\'est rare. Profites-en.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'la course', rdv: 'Demain matin, au Marché, avant neuf heures ! J\'ai une livraison urgente. Tu cours avec moi ?', rappel: 'Demain matin, avant neuf heures ! La course !', quand: { carte: 30, de: 6, a: 9 },
          gestes: ['Prêt ? On livre ça au Village de Pêche avant que l\'encre sèche !', ['bulle', 1], '~Elle te fourre une lettre dans la main et part en courant. Puis revient.', 'Attends. Tu cours vite ? Montre.',
              ['choix', ['Piquer un sprint', 'Trouver un raccourci'], [['~Tu cours. Elle court. Vous arrivez au bout du Marché en même temps, essoufflés et ravis.', ['son', 'Laugh', 40], 'T\'ES RAPIDE ! Bon. La lettre, je la livre. Toi, tu as gagné mon respect.', ['ami', 1]],
                  ['~Tu montres un passage entre deux étals. Elle s\'arrête net.|Un raccourci que je connaissais pas ? Moi ? … Tu es dangereux. J\'adore.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la lettre sans nom', rdv: 'Passe demain au Marché, en fin d\'après-midi, quand j\'ai fini ma tournée. J\'ai une lettre à écrire. Une lettre que je livrerai moi-même. Chut.', rappel: 'Demain, après ma tournée. La lettre. Chut, chut, chut.', quand: { carte: 30, de: 17, a: 20 },
          gestes: ['~Elle sort une feuille blanche et un bout de crayon.', 'Mireille ne reçoit jamais de lettres. Jamais. Elle attend quand même, à chaque passage.', 'Alors une fois par mois, je lui en écris une. Sans nom. Je lui dis qu\'il fait beau, que quelqu\'un pense à elle.', ['bulle', 4],
              ['choix', ['Écris-lui ce mois-ci', 'Je t\'aide à l\'écrire'], [['~Elle écrit trois lignes, plie la feuille, la glisse dans sa sacoche.', 'Elle va la lire à tout le bar. Elle va dire qu\'elle a un admirateur. Elle a raison.', ['ami', 1]], ['~Vous écrivez à deux. Tu ajoutes : « Vos histoires sont les meilleures. »', 'Ça, elle va l\'encadrer. Merci.', ['ami', 1]]]]] },
        { palier: 10, titre: 'tous les chemins', gestes: ['~Elle déplie une carte faite à la main, couverte de chemins, de raccourcis, de croix.', 'Tous les chemins que je connais. Il en manque encore. Ceux que tu prends, toi.', 'Quand tu reviens d\'un endroit nouveau, dis-moi par où. Je l\'ajoute. Comme ça, tu sauras toujours rentrer. Moi aussi.', ['ami', 1]] }
    ],
    cadeaux: { adore: [47, 9], aime: [44, 46, 10], deteste: [48, 102],
        dits: { adore: ['OH ! Merci ! Ça, ça fait courir ! Je le bois en marchant ! Je le bois en courant !'], aime: ['Merci ! Je le mets dans ma sacoche, entre deux lettres !'],
            neutre: ['Merci ! Je sais pas ce que c\'est, mais ça rentre dans la sacoche !'], deteste: ['Du thé ? Ça endort ! Je peux pas dormir, je suis en retard !'], deja: ['T\'as déjà donné ! Ma sacoche est pleine !'], anniv: ['POUR MON ANNIVERSAIRE ! Je vais le livrer… à moi-même !'] } }
},

/* ── Solange (33:45) ───────────────────────────────────────────────────── */
'33:45': {
    oc: {
        age: '33 ans', allure: 'cheveux bruns sous un foulard qui change de couleur avec son humeur, une aiguille de voilier toujours à la bouche',
        caractere: 'trois humeurs qui tournent (gaie, poétique, grognonne) ; drôle sans le vouloir ; dit « c\'est la faille » pour tout',
        aime: 'les voiles bien tendues, le vent d\'ouest, que Roul lui raconte ses poissons (les jours gais)',
        deteste: 'les mouettes (les jours grognons), qu\'Edwin dise que son mana est « normal »',
        reve: 'qu\'on lui reconnaisse une vraie imprégnation ; ce serait plus simple que d\'avoir un caractère',
        secret: 'la faille de la grotte est bien trop loin pour l\'imprégnation ; elle le sait très bien',
        peur: 'être d\'humeur grognonne le jour de la fête',
        manie: 'son foulard : rouge les jours gais, bleu les jours poétiques, gris les jours grognons',
        phrase: 'C\'est pas moi, c\'est la faille.',
        liens: { Edwin: 'ses lunettes disent que son mana est parfaitement normal ; elle ne le lui pardonne pas', Annick: 'qui dit qu\'elle est juste lunatique ; elle a raison, un jour sur trois', Roul: 'il lui raconte ses poissons ; les jours poétiques, elle les trouve beaux' }
    },
    anniversaire: '7/7', anniv: ['C\'est mon anniversaire ! J\'ai prié la faille pour être de bonne humeur. … Ça a marché. Enfin, peut-être. On verra cet après-midi.'],
    lieux: {
        travail: ['~Elle recoud une voile tendue entre deux poteaux.|Un point, deux points. Une voile, ça se recoud comme une humeur : un point à la fois.'],
        place: ['À midi, tout le monde se rassemble. Les jours gais, je les adore. Les jours grognons, je me mets derrière le puits.']
    },
    avis: {
        Edwin: ['Le garçon aux lunettes, Edwin, dit que mon mana est « parfaitement normal ». C\'est insultant. J\'ai une imprégnation. Je l\'ai décidé.'],
        Annick: ['Annick dit que je suis lunatique. Les jours gais, je lui donne raison. Les jours grognons, je lui donne des voiles à recoudre.'],
        Roul: ['Roul me raconte ses poissons. Les jours poétiques, je les trouve beaux. Les jours grognons, je les trouve petits. Ils sont petits.']
    },
    aCote: { Edwin: ['~Elle montre Edwin du doigt.|Toi ! Regarde-moi avec tes lunettes. Aujourd\'hui, je suis sûre que c\'est la faille.'] },
    amitie: [
        [3, { bonjour: ['Ah, toi. Aujourd\'hui, je suis… attends que je regarde mon foulard.'] }],
        [6, { bonjour: ['\\P[1] ! Toi, je t\'aime bien tous les jours. Même les gris. C\'est rare.'], aurevoir: ['À demain ! Je serai quelqu\'un d\'autre, mais je t\'aimerai bien quand même.'] }],
        [10, { bonjour: ['~Son foulard est rouge. Il est toujours rouge quand tu arrives.|Tiens. Encore un jour gai. C\'est toi, la faille.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'les trois foulards', rdv: 'Passe demain, l\'après-midi, à l\'atelier de voiles. Je vais t\'expliquer mes foulards. C\'est scientifique.', rappel: 'Demain après-midi. Les foulards. C\'est scientifique.', quand: { carte: 33, de: 13, a: 18 },
          gestes: ['~Elle sort trois foulards : un rouge, un bleu, un gris.', 'Rouge : je suis gaie. Bleu : je suis poétique. Gris : ne me parle pas. C\'est la faille qui choisit.', ['bulle', 9], '… Bon. En vrai, c\'est moi qui choisis le matin, en me levant. Mais c\'est la faille qui me fait choisir.',
              ['choix', ['Mets le rouge demain', 'Et un foulard vert ?'], [['Le rouge ? Demain ? … Je vais essayer. Si ça marche, c\'est toi la faille.', ['ami', 1]], ['Vert ? … Il n\'y a pas d\'humeur verte. … Ou alors une nouvelle. Une humeur verte. Je vais l\'inventer.', ['ami', 1]]]]] },
        { palier: 6, titre: 'les lunettes', rdv: 'Demain matin, viens. Avant midi. J\'ai demandé à Edwin de me regarder encore avec ses lunettes. Il me faut un témoin.', rappel: 'Demain matin ! Les lunettes d\'Edwin ! Témoin !', quand: { carte: 33, de: 8, a: 12 },
          gestes: [['dit', 'Edwin', '~Il ajuste ses lunettes, très sérieux.|Votre mana est… parfaitement normal. Positif, un peu de négatif quand vous êtes contrariée. C\'est… vous.'], ['bulle', 5],
              'Normal ! Il a dit normal ! Devant un témoin !', ['choix', ['C\'est mieux, d\'être soi', 'C\'est sûrement la faille'], [['~Elle se tait. Son foulard est bleu, ce matin.|… Soi. Trois humeurs, et c\'est soi. … C\'est presque beau. C\'est la faille qui me rend poète.', ['ami', 1]], ['MERCI ! Tu vois, Edwin ? Le témoin dit la faille ! … Il est parti. Il a raison, mais il est parti.', ['ami', 1]]]]] },
        { palier: 10, titre: 'la quatrième humeur', gestes: ['~Elle sort un quatrième foulard, jaune, tout neuf.', 'J\'ai inventé une humeur. Celle des jours où tu passes. Elle n\'a pas de nom.', 'Elle est jaune. Ce n\'est pas la faille. C\'est moi. Voilà. Je l\'ai dit.', ['ami', 1]] }
    ],
    cadeaux: { adore: [63, 7], aime: [9, 44, 48], deteste: [102, 8],
        dits: { adore: ['~Son foulard change de couleur, presque.|Oh ! Pour moi ? Aujourd\'hui est un jour rouge. Grâce à toi. Ou à la faille. Grâce à toi.'], aime: ['Merci. Je le prends. Même si je suis grise.'],
            neutre: ['Hm. Merci. Demain, je saurai si je l\'aime.'], deteste: ['Non. Aujourd\'hui, non. Ça sent la mouette. Garde-le.'], deja: ['Un par jour. Sinon je deviens d\'humeur gâtée. Ça n\'existe pas encore.'], anniv: ['Pour mon anniversaire ! C\'est décidé : aujourd\'hui est un jour rouge.'] } }
},

/* ── Zéphyrin (29:62) — le marchand de la Veillée ──────────────────────── */
'29:62': {
    oc: {
        age: '« l\'âge du chapeau »', allure: 'grand chapeau rouge, manteau constellé de petites poches qui brillent, des lucioles qui le suivent',
        caractere: 'mystérieux pour rire, clins d\'œil, chuchote ses prix comme des secrets ; tendre avec les enfants qui veillent',
        aime: 'la nuit de la Veillée, les lumières, les enfants qui luttent contre le sommeil, les contes de Barthélemy',
        deteste: 'qu\'on lui demande où il passe le reste de l\'année, le jour',
        reve: 'être là, avec de la lumière, la nuit où le Premier reviendra — comme son père le voulait',
        secret: 'le reste de l\'année, il fabrique ses bocaux dans un village tout à fait ordinaire, et il élève des poules',
        peur: 'une nuit de Veillée sous la pluie',
        manie: 'il soulève son chapeau pour saluer, et une luciole s\'en échappe à chaque fois',
        phrase: 'Gardez une lumière allumée.',
        liens: { 'Barthélemy': 'ils se connaissent depuis trente ans ; il dit que c\'est le chapeau qui l\'empêche de vieillir', 'Petit-Louis': 'il lui vend un bocal « pour la défaite » quand il s\'endort' }
    },
    lieux: {
        travail: ['~Il allume une à une les petites lumières de sa table.|Une pour ceux qui attendent. Une pour ceux qui reviennent. Et une pour ceux qui ont oublié de rentrer.']
    },
    avis: {
        'Barthélemy': ['Barthélemy raconte le Premier depuis trente ans. Moi, je vends la lumière pour qu\'il retrouve le chemin. On fait le même métier, en vérité.'],
        'Petit-Louis': ['Le petit Petit-Louis essaie de rester éveillé toute la Veillée. Il s\'endort à onze heures. Chaque année. Je lui offre un bocal. Chaque année.']
    },
    amitie: [
        [3, { bonjour: ['Ah, on se connaît, maintenant. Ça ne fait qu\'une nuit par an, mais on se connaît.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'la luciole', gestes: ['~Il soulève son chapeau. Une luciole s\'en échappe et se pose sur ton épaule.', ['son', 'Saint5', 50], 'Elle t\'a choisi. Elles choisissent toujours quelqu\'un qui revient.', 'À l\'année prochaine. Garde une lumière allumée.', ['ami', 1]] }
    ],
    cadeaux: { adore: [7, 9], aime: [44, 63], deteste: [62, 38],
        dits: { adore: ['~Il soulève son chapeau, deux lucioles s\'échappent.|Une lumière pour le marchand de lumière ! On ne m\'avait jamais fait ça. Merci.'], aime: ['Merci, merci. Je le garde pour l\'année prochaine.'],
            neutre: ['Hm ! Original. Merci.'], deteste: ['Une bombe ? La nuit de la Veillée ? Vous voulez réveiller le Premier en sursaut ? Gardez-la.'], deja: ['Un cadeau par Veillée, c\'est déjà un miracle.'] } }
}
};
