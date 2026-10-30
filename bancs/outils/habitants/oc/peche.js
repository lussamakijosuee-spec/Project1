/*
 * LES PERSONNAGES DU VILLAGE DE PÊCHE, comme des OC — voir oc/ville.js pour les
 * champs. Edwin Bramble est celui de la Bible (« l'Encyclopédie Vivante »,
 * le village du donjon des eaux, sa première faille) ; Emma Fieldensong, les
 * notes de JOKO (« la Princesse », le Feu Infernal, le contrecoup de lignée).
 */
'use strict';
module.exports = {

/* ── Emma Fieldensong (33:18) — sixième année, le Feu Infernal ─────────── */
'33:18': {
    oc: {
        age: '17 ans', allure: 'uniforme de Rubis impeccable même au bord du lac, cheveux noirs tirés, une flamme rouge-noir qui lui court entre les doigts',
        caractere: 'calme, acérée, insulte sans jamais crier ; fière ; ne lâche personne dans une vraie crise (JOKO)',
        aime: 'les classements, le thé très chaud, gagner un duel sans bouger d\'un pas, les lettres de Naomi (elle les garde)',
        deteste: 'qu\'on l\'aide, le désordre, qu\'on dise « talent » à la place de « travail »',
        reve: 'le Premier Siège de sa promotion — et qu\'on l\'appelle par son nom, pas « la Princesse »',
        secret: 'le contrecoup de lignée : ses mains tremblent quand elle pousse trop ; elle s\'entraîne seule au bord du lac',
        peur: 'perdre devant tout le monde',
        manie: 'elle allume et éteint une flamme sur son pouce quand elle réfléchit',
        phrase: 'Tu peux partir. Je t\'y autorise.',
        liens: { Edwin: 'son camarade ; elle l\'appelle « l\'Encyclopédie », il le note comme un compliment', Lise: 'la fille du forgeron la regarde comme une héroïne ; Emma fait semblant de ne pas aimer ça', Annick: 'la seule adulte qui lui donne des tartines sans demander' }
    },
    anniversaire: '8/14', anniv: ['Mon anniversaire, oui. Dix-sept ans. Ne fais pas de bruit. … Edwin a fait un gâteau. Il a expliqué la recette pendant une heure.'],
    lieux: {
        travail: ['~Elle s\'entraîne seule au bord de l\'eau. Une flamme part, file sur le lac, s\'éteint dans un sifflement.|Tu regardais ? Mauvaise habitude.'],
        place: ['Midi. Ils se rassemblent tous sur la place, comme des moineaux. Je reste à l\'ombre. Les moineaux me fatiguent.'],
        repos: ['Un jour de repos. Je m\'entraîne quand même. Le repos, c\'est pour ceux qui ont déjà gagné.']
    },
    avis: {
        Edwin: ['Edwin parle trop. Mais quand il se tait, c\'est qu\'il a vu quelque chose. C\'est là qu\'il faut l\'écouter.'],
        Annick: ['Madame Annick me donne des tartines. Je ne les demande pas. Je les mange. On ne parle pas de ça.'],
        Sora: ['La petite aux coquillages m\'a demandé si mon feu pouvait faire griller des poissons. … Oui. Ne lui dis pas.']
    },
    aCote: { Edwin: ['~Elle désigne Edwin du menton.|S\'il commence à expliquer quelque chose, pars. Tu me remercieras.'] },
    amitie: [
        [3, { bonjour: ['… Toi. Tu progresses. Lentement, mais tu progresses.'] }],
        [6, { bonjour: ['\\P[1]. Je t\'ai vu te battre. Tu as fait deux erreurs. Seulement deux. C\'est presque bien.'], aurevoir: ['Ne te fais pas tuer. Je n\'aurai personne à classer.'] }],
        [10, { bonjour: ['~Elle t\'attendait. Elle ne le dira jamais.|Enfin. Tu as mis le temps.'], aurevoir: ['Reviens. … Ce n\'est pas une autorisation. C\'est une demande.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'le lac', rdv: 'Demain, l\'après-midi, au bord du lac. Je m\'entraîne. Tu peux regarder. En silence.', rappel: 'Le lac. L\'après-midi. En silence.', quand: { carte: 33, de: 13, a: 18 },
          gestes: ['~Elle lève la main. Une flamme rouge-noir se forme, tremble, se resserre.', ['son', 'Fire1'], ['bulle', 8], 'Le Feu Infernal ne se maîtrise pas par le talent. Par la discipline. Regarde mes mains.',
              '~Elles tremblent un peu. Elle les cache aussitôt.', ['choix', ['Tu devrais te reposer', 'Encore une fois'], [
                  ['~Elle te fusille du regard.|… Peut-être. Ne le dis à personne. Surtout pas à Edwin.', ['ami', 1]],
                  ['~Elle sourit, presque.|Bien. Quelqu\'un qui comprend.', ['son', 'Fire1'], '~La flamme part droit, fine comme une aiguille, et s\'éteint sur l\'eau.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la lettre', rdv: 'Passe ce soir, avant la nuit. Sur la place. J\'ai… une lettre à faire lire.', rappel: 'Ce soir. La lettre. Viens seul.', quand: { carte: 33, de: 17, a: 21 },
          gestes: ['~Elle te tend une lettre pliée en quatre, très soigneusement.', 'Naomi Briarley m\'écrit. Encore. Des lettres gentilles. Elle demande si je vais bien.', 'Je ne sais pas répondre aux lettres gentilles. Les autres, oui.', ['bulle', 6],
              ['choix', ['Réponds-lui « oui, merci »', 'Raconte-lui le lac'], [['« Oui, merci. » … C\'est court. Elle va croire que je suis fâchée. … Tant pis. Je l\'écris.', ['ami', 1]], ['Le lac. Les flammes sur l\'eau. … Ce serait presque joli. D\'accord. Je lui raconte.', ['ami', 1]]]],
              'Ne parle pas de cette lettre. À personne.'] },
        { palier: 10, titre: 'ensemble', gestes: ['~Elle croise les bras, regarde ailleurs.', 'Si un jour on se bat ensemble… et que je pousse trop, et que mes mains tremblent…', '… tu me diras d\'arrêter. Je ne t\'écouterai pas. Mais dis-le quand même.',
              'Ne me remercie pas. Ce serait gênant.', ['ami', 1]] }
    ],
    cadeaux: { adore: [48, 35], aime: [47, 73, 7], deteste: [8, 36],
        dits: { adore: ['~Elle prend l\'objet, l\'examine.|… C\'est un bon choix. Exactement le bon. Tu as fait attention. Merci.'], aime: ['Acceptable. Merci.'],
            neutre: ['… Merci. Je suppose.'], deteste: ['Non. Je ne vais pas faire semblant. Garde-le.'], deja: ['Un cadeau par jour. Au-delà, ça devient de la flatterie.'], anniv: ['Pour mon anniversaire. Edwin t\'a dit la date, je parie. Il dit tout.'] } }
},

/* ── Edwin Bramble (33:22) — l'Encyclopédie Vivante ────────────────────── */
'33:22': {
    oc: {
        age: '17 ans', allure: 'lunettes rondes qui brillent quand il regarde le mana, trois carnets dans la sacoche, un crayon derrière chaque oreille',
        caractere: 'sérieux, enthousiaste, bavard, incapable d\'une explication courte ; patient avec ceux qui ne savent pas (la Bible)',
        aime: 'les grimoires, les questions qu\'on n\'a jamais posées, les tartines de sa mère, Korrah (il la trouve magnifique)',
        deteste: 'les duellistes qui foncent au corps à corps, qu\'on le coupe à la moitié d\'une phrase, les livres abîmés',
        reve: 'que sa première faille se passe bien ; puis écrire le manuel que personne n\'a écrit',
        secret: 'il ne dort pas à cause de la faille, pas à cause des livres ; il a peur, et il range sa peur avec les autres informations',
        peur: 'oublier quelque chose ; il n\'a jamais rien oublié, c\'est pour ça',
        manie: 'il compte sur ses doigts les points de son explication ; il y en a toujours un de plus',
        phrase: 'Pose-la-moi !',
        liens: { Annick: 'sa mère ; elle se souvient de tout ce qu\'il ne mange pas', Emma: 'sa camarade ; « l\'Encyclopédie », c\'est un compliment', Colette: 'ses livres de Parole d\'ombre le fascinent ; elle le chasse au bout de dix minutes', 'Félix et Aube': 'ses meilleurs amis, restés à l\'académie' }
    },
    anniversaire: '5/5', anniv: ['C\'est mon anniversaire ! Le cinq du cinq. C\'est une date très satisfaisante, mathématiquement. Maman a fait des tartines en forme de cinq.'],
    lieux: {
        travail: ['~Il note quelque chose en regardant le lac à travers ses lunettes.|Le mana de l\'eau est plus clair près du ponton. Positif. Très doux. Je l\'ai noté. Deux fois.'],
        place: ['La place, à midi ! Tout le monde est là, et leur mana aussi. C\'est comme une bibliothèque qui marche.'],
        repos: ['Le jour de repos, je relis mes notes. C\'est reposant. Pour moi. Maman n\'est pas d\'accord.']
    },
    avis: {
        Solange: ['Madame Solange croit avoir une imprégnation. Mes lunettes disent que son mana est parfaitement normal. Elle m\'a jeté une voile. Je l\'ai noté : « réaction normale ».'],
        Emma: ['Emma Fieldensong maîtrise son feu par la discipline. Elle a raison. Elle a raison très souvent. Je ne le lui dis pas : elle le sait.'],
        Annick: ['Maman parle à tout le village. Moi, je parle à tous les livres. On a le même métier, en fait.'],
        Colette: ['Colette, en ville, vend des livres de Parole d\'ombre. J\'en ai lu un. Elle m\'a demandé de partir à la page deux. J\'avais des questions.'],
        Sora: ['La petite Sora a un mana « joyeux ». C\'est le mot scientifique. Enfin, c\'est mon mot. Je l\'ai inventé pour elle.']
    },
    aCote: { Annick: ['~Il baisse la voix.|Maman est là. Si elle demande, j\'ai mangé.'], Emma: ['~Il se redresse, ajuste ses lunettes.|Emma. Bonjour. Je disais justement… rien. Je ne disais rien.'] },
    amitie: [
        [3, { bonjour: ['Te revoilà ! J\'ai une question pour toi. Non, trois. Non… on va commencer par une.'] }],
        [6, { bonjour: ['\\P[1] ! Ton mana a changé depuis la dernière fois. Plus stable. Tu t\'entraînes ? Raconte !'], aurevoir: ['Reviens ! J\'aurai lu deux nouveaux livres. Je te les résumerai. Longuement.'] }],
        [10, { bonjour: ['~Il te serre la main avec les deux mains, très fort.|Mon ami ! Je n\'ai rien à t\'expliquer aujourd\'hui. C\'est une première. Je suis juste content.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'les lunettes', rdv: 'Passe demain matin ! Je veux te montrer ce que voient mes lunettes. Enfin, te le décrire. Pendant… un moment.', rappel: 'Demain matin ! Les lunettes ! J\'ai préparé un plan en neuf points.', quand: { carte: 33, de: 8, a: 13 },
          gestes: ['~Il enlève ses lunettes et te les tend, très sérieux.', 'Mets-les. Tu ne verras rien : c\'est ma manifestation, pas la tienne. Mais tu sauras ce que ça fait de les porter.', ['bulle', 1],
              'Moi, je vois le mana. Le tien, par exemple. Il a une couleur. Non, pas une couleur. Une… direction.', ['choix', ['Dis-moi ce que tu vois', 'Rends-les-lui'], [
                  ['~Il te regarde par-dessus, par-dessous, de côté.|Tu as une source qui domine, et une autre qui pousse derrière. C\'est rare. C\'est beau. Je le note.', ['son', 'Book1'], ['ami', 1]],
                  ['Merci. Sans elles, je ne vois que des gens. C\'est bien aussi, les gens. Mais c\'est flou.']]]] },
        { palier: 6, titre: 'la faille', rdv: 'Ce soir, au ponton. Vers dix-neuf heures. Je… j\'ai besoin d\'en parler à quelqu\'un qui n\'est pas maman.', rappel: 'Ce soir, le ponton. Ne dis rien à maman.', quand: { carte: 33, de: 18, a: 22 },
          gestes: ['~Il est assis au bout du ponton, les pieds au-dessus de l\'eau, sans un carnet.', 'Ma première faille. Groupe A. Aël est dans le groupe B. J\'ai lu tous les rapports. Tous.', 'Je sais tout. Sauf ce que ça fait.', ['bulle', 8],
              ['choix', ['La peur est une information', 'Tu ne seras pas seul'], [
                  ['~Il sourit.|C\'est ma phrase. Tu me la rends. … Merci. Je la range avec les autres. Elle est plus légère, rendue.', ['ami', 1]],
                  ['… Non. Il y aura la garde royale, et Emma, qui dira que je parle trop. Et toi, peut-être. Ça fait beaucoup de monde pour une seule peur.', ['ami', 1]]]]] },
        { palier: 10, titre: 'le carnet', gestes: ['~Il sort un carnet neuf, à ton nom, écrit très proprement sur la couverture.', 'J\'ai commencé un carnet sur toi. Ce que tu dis, ce que tu aimes, ton mana qui change.', 'C\'est le seul carnet que je ne relirai jamais pour corriger. Il est juste, comme ça.', ['ami', 1]] }
    ],
    cadeaux: { adore: [100, 94], aime: [73, 48, 7], deteste: [102, 10],
        dits: { adore: ['~Ses lunettes s\'allument. Littéralement.|C\'est fascinant. C\'est FASCINANT. Je vais l\'étudier. Je vais t\'expliquer ce que j\'ai trouvé. Dans le détail.'], aime: ['Oh, merci ! Je connais trois usages pour ça. Quatre, en fait.'],
            neutre: ['Merci ! C\'est… je vais trouver à quoi ça sert. Je trouve toujours.'], deteste: ['~Il recule poliment.|Ah. Non. Je ne sais pas quoi en faire, et c\'est la première fois de ma vie. Garde-le, je t\'en prie.'], deja: ['Tu m\'as déjà offert quelque chose aujourd\'hui ! Je n\'ai pas fini de l\'étudier.'], anniv: ['Pour mon anniversaire ! Le cinq du cinq ! C\'est parfait.'] } }
},

/* ── Sora (33:19) — la petite aux coquillages ──────────────────────────── */
'33:19': {
    oc: {
        age: '8 ans', allure: 'les poches qui tintent de coquillages, un chapeau de paille trop grand, du sable partout',
        caractere: 'curieuse, vive, pose des questions sans attendre les réponses ; ne garde jamais un secret plus d\'une heure',
        aime: 'les coquillages violets, les dragons, nager jusqu\'au rocher (maman dit non), papa qui fait semblant d\'être surpris',
        deteste: 'qu\'on marche sur ses châteaux de sable, se coucher tôt',
        reve: 'une boîte à musique magique. Ou un dragon. Un dragon, ce serait le mieux',
        secret: 'elle a donné un nom à chaque coquillage ; le plus beau s\'appelle « Papa »',
        peur: 'le monsieur au masque, au bout de la plage — un peu',
        manie: 'elle compte ses coquillages à voix haute, et se trompe toujours au même endroit',
        phrase: 'T\'as vu celui-là ?!',
        liens: { Edwin: 'il lui a dit que son mana était « joyeux » ; elle le savait', Annick: 'la voisine qui la gronde et qui lui donne des biscuits', Emma: 'la grande qui fait du feu ; elle voudrait des poissons grillés' }
    },
    anniversaire: '7/18', anniv: ['C\'est mon anniversaire ! J\'ai huit ans ! Papa m\'a offert un coquillage. Le plus violet du MONDE.'],
    lieux: {
        travail: ['~Elle est à genoux dans le sable, très concentrée.|Chut ! Je cherche. Il y en a un qui brille, là-dessous.'],
        place: ['À midi, tout le monde vient sur la place ! Je montre mes coquillages. Personne veut les voir. Je les montre quand même.'],
        repos: ['Le jour de repos, papa pêche pas ! On construit un château. Un grand. Avec des tours.']
    },
    avis: {
        Edwin: ['Edwin, il sait TOUT. Je lui ai demandé combien il y a de coquillages dans le lac. Il a dit « plus que tu ne peux en porter ». C\'est pas un chiffre !'],
        Emma: ['La grande fille au feu, elle a l\'air méchante. Mais elle m\'a regardée faire mon château, et elle a pas marché dessus. C\'est gentil.'],
        Annick: ['Madame Annick dit que je parle autant qu\'elle. C\'est pas vrai. Elle parle plus. Beaucoup plus. Mais moi aussi.']
    },
    aCote: { Edwin: ['~Elle tire Edwin par la manche.|Edwin ! Edwin ! Il est joyeux, mon mana, aujourd\'hui ? Dis-lui !'] },
    amitie: [
        [3, { bonjour: ['Coucou ! J\'ai un nouveau coquillage ! Tu veux le voir ? Il est là ! Non, là !'] }],
        [6, { bonjour: ['\\P[1] ! J\'ai appelé un coquillage comme toi ! Il est un peu cassé, mais il est beau.'], aurevoir: ['Reviens ! Je t\'en garde un !'] }],
        [10, { bonjour: ['~Elle court vers toi en tenant son chapeau.|T\'es revenu ! T\'es mon meilleur ami de toute la plage !'] }]
    ],
    scenes: [
        { palier: 3, titre: 'le château', rdv: 'Tu viens demain ? Je construis un château. Le plus grand du monde. Il me faut un garde !', rappel: 'Demain ! Le château ! Tu seras le garde !', quand: { carte: 33, de: 9, a: 17 },
          gestes: ['Voilà le château ! Là, c\'est la tour. Là, c\'est la porte. Là, c\'est un crabe, il habite là.', ['son', 'Water2', 50], '~Une petite vague arrive.', ['bulle', 1], 'LA VAGUE ! Garde ! Défends le château !',
              ['choix', ['Faire un mur de sable', 'Crier sur la vague'], [['~Ton mur tient. Le château aussi. Le crabe s\'en va, vexé.', 'T\'ES LE MEILLEUR GARDE !', ['ami', 1]], ['~Tu cries sur la vague. Elle s\'en fiche. La tour s\'écroule. Sora rit si fort qu\'elle tombe assise.', ['son', 'Laugh', 50], 'On recommence ! On recommence !', ['ami', 1]]]]] },
        { palier: 6, titre: 'papa rentre', rdv: 'Ce soir, quand papa rentre de la pêche, viens ! Je lui montre le plus beau coquillage. Tu verras sa tête !', rappel: 'Ce soir ! Papa rentre ! Le plus beau coquillage !', quand: { carte: 33, de: 17, a: 21 },
          gestes: ['~Elle cache quelque chose dans son dos, toute tremblante d\'impatience.', 'Il arrive bientôt. Je vais lui montrer. Il va faire semblant d\'être surpris. À chaque fois.', 'Mais cette fois, il va être VRAIMENT surpris. Regarde.',
              '~Elle ouvre la main : un coquillage violet, parfaitement rond, qui brille.', ['son', 'Item1'], ['bulle', 4], 'Tu crois qu\'il va aimer ?',
              ['choix', ['Il va adorer', 'C\'est le plus beau que j\'ai vu'], [['Oui ! Je le sais ! … Mais c\'est bien que tu le dises.', ['ami', 1]], ['Le plus beau du MONDE ? Je le savais ! Je vais lui dire que tu l\'as dit !', ['ami', 1]]]]] },
        { palier: 10, titre: 'le coquillage', gestes: ['~Elle fouille dans toutes ses poches, puis en sort un coquillage, tout petit, un peu ébréché.', 'C\'est le premier que j\'ai trouvé. Quand j\'étais petite. Il s\'appelle « Le Premier ».', 'Je te le donne pas. Je te le prête. Pour toujours.', ['son', 'Item1'], ['ami', 1]] }
    ],
    cadeaux: { adore: [103, 7], aime: [44, 9, 96], deteste: [8, 102],
        dits: { adore: ['WAAAAH ! C\'EST UN TRÉSOR ! C\'est pour moi ? Pour MOI ? Je vais lui donner un nom !'], aime: ['Merci ! Je le mets avec mes coquillages ! Il sera bien, avec eux.'],
            neutre: ['C\'est quoi ? … Ça se mange ? Non ? Merci quand même !'], deteste: ['BEURK ! Ça sent pas bon ! Garde-le !'], deja: ['T\'as déjà donné un cadeau ! Maman dit qu\'il faut pas exagérer.'], anniv: ['ET C\'EST MON ANNIVERSAIRE ! C\'est le meilleur jour de l\'année !'] } }
},

/* ── Annick (33:24) — la femme de pêcheur, mère d'Edwin ─────────────────── */
'33:24': {
    oc: {
        age: '46 ans', allure: 'tablier taché d\'écailles, un seau à chaque main, un rire qui fait fuir les mouettes',
        caractere: 'bavarde, drôle, lucide ; fière de son fils et terrifiée pour lui, dans la même phrase',
        aime: 'les tartines, les ragots du port, revendre le poisson de Roul plus cher qu\'il ne croit, les lettres d\'Edwin (illisibles)',
        deteste: 'les mouettes, les gens qui ne finissent pas leur assiette, qu\'on parle de failles à table',
        reve: 'qu\'Edwin rentre de sa faille et lui explique tout, pendant trois heures, sans qu\'elle l\'arrête',
        secret: 'elle a appris à lire en cachette pour comprendre les carnets d\'Edwin ; elle n\'y comprend rien, elle les lit quand même',
        peur: 'la faille d\'Edwin (elle fait des tartines contre)',
        manie: 'elle vide les poissons en parlant, sans jamais regarder ses mains',
        phrase: 'Tu as mangé ?',
        liens: { Edwin: 'son fils ; il se souvient de tout ce qu\'il lit, elle de tout ce qu\'il ne mange pas', Roul: 'il lui vend sa pêche et ment sur la taille', Sora: 'la voisine qu\'elle gronde et qu\'elle gâte', Emma: 'la jeune noble trop maigre ; elle lui donne des tartines' }
    },
    anniversaire: '2/22', anniv: ['C\'est mon anniversaire ! Edwin m\'a écrit un poème. Douze pages. Avec des notes en bas de page. Je pleure, mais c\'est le sel.'],
    lieux: {
        travail: ['~Elle écaille un poisson d\'un geste vif.|Le poisson du matin ! Frais comme un ragot !', 'Roul m\'a vendu un brochet « gros comme sa jambe ». C\'était une perche. Je l\'ai revendue « grosse comme sa jambe ». On est quittes.'],
        place: ['À midi, la place ! Tout le village est là. C\'est là que je fais mon vrai travail : écouter.'],
        repos: ['Le jour de repos, je cuisine pour la semaine. Edwin mange quand il oublie de lire. Alors je cuisine beaucoup.']
    },
    avis: {
        Solange: ['Solange dit que c\'est la faille qui lui change l\'humeur. Il n\'y a pas de faille. Elle est lunatique, c\'est tout. Un jour sur trois, elle me donne raison.'],
        Edwin: ['Mon fils explique tout. Il m\'a expliqué comment faire une tartine. J\'en fais depuis trente ans. Il avait raison sur un point, c\'est ça le pire.'],
        Roul: ['Roul vient du bar pour pêcher ici. Il dit que nos poissons sont plus bêtes. Il les rate quand même.'],
        Emma: ['La petite Fieldensong ! Elle fait sa princesse, mais elle mange mes tartines comme une affamée. Je lui en mets deux.'],
        Sora: ['Sora a cent douze coquillages. Elle me les a tous présentés. Par leur nom.']
    },
    aCote: { Edwin: ['~Elle pince la joue d\'Edwin au passage.|Il a mangé ? Il a pas mangé. Regarde-moi ces bras.'] },
    amitie: [
        [3, { bonjour: ['Te revoilà ! T\'as mangé ? Non ? Ça se voit.'] }],
        [6, { bonjour: ['\\P[1] ! Viens là que je te regarde. Tu maigris. C\'est l\'aventure, ça. Ça nourrit pas.'], aurevoir: ['Et reviens manger !'] }],
        [10, { bonjour: ['~Elle te colle une tartine dans la main avant de dire bonjour.|Voilà. Maintenant, bonjour.'], aurevoir: ['Ramène-moi mon fils, un jour. Et toi avec.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'les tartines', rdv: 'Passe demain matin, à la maison ! Enfin, devant. Je fais les tartines d\'Edwin. Il m\'en faut un pour goûter.', rappel: 'Demain matin ! Les tartines ! Viens à jeun !', quand: { carte: 33, de: 7, a: 12 },
          gestes: ['Tiens. Goûte. Non, pas celle-là, c\'est celle d\'Edwin. Celle-là.', ['son', 'Item1'], '~La tartine est énorme, beurrée jusqu\'aux bords.', 'Alors ? Trop de beurre ? Il n\'y a jamais trop de beurre. C\'est une question, mais la réponse est non.',
              ['choix', ['C\'est délicieux', 'C\'est beaucoup de beurre'], [['VOILÀ ! Tu vois ! Edwin dit que c\'est « une densité excessive ». Je vais lui dire qu\'il a tort. Pour une fois.', ['ami', 1]], ['~Elle te regarde, scandalisée, puis éclate de rire.', ['son', 'Laugh', 50], 'Tu parles comme lui ! Allez, finis-la quand même.', ['ami', 1]]]]] },
        { palier: 6, titre: 'les carnets', rdv: 'Ce soir, avant le dîner, vers dix-huit heures. Edwin lira, il n\'entendra rien. J\'ai quelque chose à te montrer. Un secret de mère.', rappel: 'Ce soir, avant le dîner. Un secret.', quand: { carte: 33, de: 18, a: 21 },
          gestes: ['~Elle sort un des carnets d\'Edwin de son tablier, en regardant derrière elle.', 'J\'ai appris à lire. En cachette. Pour lire ses carnets.', '~Elle ouvre une page couverte de formules.', 'Je comprends rien. Mais je reconnais son écriture. Et ici, en bas, il a écrit « dire à maman que ». Il a pas fini.', ['bulle', 4],
              ['choix', ['Il voulait te dire merci', 'Demande-lui la fin'], [['… Tu crois ? … Bon. Je vais faire comme si c\'était ça. C\'est sûrement ça.', ['ami', 1]], ['Lui demander ? Il va m\'expliquer pendant trois heures. … C\'est exactement ce que je veux.', ['ami', 1]]]]] },
        { palier: 10, titre: 'à table', gestes: ['~Elle pose un bol sur la table de dehors, puis un deuxième, puis un troisième.', 'Un pour Edwin, un pour moi, un pour toi. Ta place est là, maintenant. C\'est comme ça.', 'Et ne dis pas non. Personne ne dit non à mes bols.', ['ami', 1]] }
    ],
    cadeaux: { adore: [44, 9], aime: [46, 47, 10], deteste: [8, 41],
        dits: { adore: ['OH ! Ça, c\'est un cadeau de quelqu\'un qui a été bien élevé ! Merci, mon petit !'], aime: ['Merci ! Je le mettrai dans le panier d\'Edwin. Il mangera peut-être.'],
            neutre: ['C\'est gentil ! Je trouverai bien à quoi ça sert. Sinon, Edwin trouvera.'], deteste: ['Remballe-moi ça ! Ça va dans la cuisine de personne !'], deja: ['Encore ? Tu vas me faire pleurer. C\'est le sel. Garde-le pour demain.'], anniv: ['Et pour mon anniversaire ! Mais t\'es un amour !'] } }
}
};
