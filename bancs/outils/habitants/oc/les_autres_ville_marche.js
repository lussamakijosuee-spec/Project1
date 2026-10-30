/*
 * LES AUTRES HABITANTS DE LA VILLE (29), DU MARCHÉ (30) ET DES BOUTIQUES
 * (41-43), comme des OC — leur fiche (P1), ce qu'ils disent selon où ils sont
 * (P2), ce qu'ils disent des autres (P3). Voir oc/ville.js pour les champs.
 */
'use strict';
module.exports = {
/* ── la ville : les gardes, l'allumeur, Pépin ─────────────────────────── */
'29:11': { // Brunehaut
    oc: { age: '38 ans', allure: 'cotte de mailles ternie, une lance qu\'elle tient comme un balai, un regard qui pèse les voyageurs', caractere: 'sèche, sarcastique ; compte ceux qui sortent et ceux qui rentrent',
        aime: 'que le compte tombe juste le soir, le thé brûlant de la caserne, faire peur à Oswin pour rire', deteste: 'les voyageurs qui ne disent pas bonjour, la pluie sur la porte nord', reve: 'une journée où tout le monde rentre, sans exception',
        secret: 'elle garde une lanterne allumée à la fenêtre de la caserne, toute la nuit, « pour ceux qui cherchent la porte »', manie: 'elle compte à voix basse les gens qui passent', phrase: 'Si tu restes planté là, c\'est moi.',
        liens: { Oswin: 'le jeune garde de la porte nord, qui s\'ennuie ; elle le secoue' } },
    lieux: { travail: ['~Elle te compte du regard.|Un de plus qui rentre. Bien. Le compte est bon.'], bar: ['Fin de garde. Le compte est bon, aujourd\'hui. Ça mérite une bière.'] },
    avis: { Oswin: ['Oswin rêve d\'être muté au manoir. Au manoir, il garderait une porte que personne ne prend. Ici, au moins, il voit passer la forêt.'] }
},
'29:12': { // Oswin
    oc: { age: '20 ans', allure: 'casque trop grand, une plume coincée dedans, des bâillements d\'école', caractere: 'jeune, las, rêve d\'être muté au manoir ; s\'ennuie, mais ne quitte jamais sa porte',
        aime: 'les rumeurs du manoir, compter les nuages avec Mathis, le pain chaud de la relève', deteste: 'les nuits de garde sans rien, que Brunehaut le surprenne en train de dormir', reve: 'garder la porte d\'une salle de bal, une fois, en uniforme d\'apparat',
        secret: 'il s\'entraîne à saluer comme un garde de manoir, seul, la nuit', manie: 'il redresse son casque, qui retombe aussitôt', phrase: 'Il ne se passe jamais rien ici.',
        liens: { Brunehaut: 'elle le secoue ; il l\'admire', Mathis: 'le guetteur, avec qui il compte les nuages' } },
    lieux: { travail: ['~Il redresse son casque, qui retombe.|Rien. Toujours rien. La forêt est là. Elle bouge pas. Moi non plus.'], bar: ['Le bar, après la garde de nuit. Ici, il se passe des choses. Enfin, des disputes.'] },
    avis: { Brunehaut: ['Brunehaut compte tout le monde. Même moi, quand je reviens de la relève. Je crois qu\'elle m\'aime bien. Elle me compte deux fois.'], Mathis: ['Mathis, là-haut, regarde le ciel. Il m\'apprend les nuages. Celui-là, c\'est un mouton. Tous les nuages sont des moutons, pour Mathis.'] }
},
'29:33': { // Mathis
    oc: { age: '27 ans', allure: 'longue-vue en cuivre, cape grise, des yeux qui regardent toujours plus loin que toi', caractere: 'rêveur, observateur ; parle du ciel ; voit tout ce qui arrive avant tout le monde',
        aime: 'les étoiles filantes, les oiseaux migrateurs, que quelqu\'un monte lui tenir compagnie', deteste: 'le brouillard (« on ne voit rien, à quoi je sers ? »)', reve: 'dessiner une carte du ciel entière, avec un nom pour chaque étoile qui n\'en a pas',
        secret: 'il a donné des noms d\'habitants aux étoiles ; il y a une étoile Brunehaut, une étoile Oswin, une étoile Berthe', manie: 'il pointe le ciel du doigt au milieu des phrases', phrase: 'Regarde, là-haut.',
        liens: { Oswin: 'il lui apprend les nuages' } },
    lieux: { travail: ['~Il baisse sa longue-vue.|Un chariot sur la route du sud. Baptiste, sûrement. Ses bœufs ont l\'air de bouder.'], nuit: ['La nuit, je compte les étoiles. Il y en a toujours une de plus que la veille. Je crois qu\'elles s\'amusent.'] },
    avis: { Oswin: ['Oswin s\'ennuie à la porte. Je lui montre les nuages. Il dit qu\'ils ressemblent tous à des moutons. Il a raison, mais il ne regarde pas assez longtemps.'] }
},
'29:34': { // Rolf
    oc: { age: '33 ans', allure: 'colossal, un casque qui ne ferme plus, des miettes dans la barbe', caractere: 'jovial, colossal ; mange tout le temps ; protège les petits sans y penser',
        aime: 'les fonds de marmite de Berthe, soulever les enfants à bout de bras, la sieste debout', deteste: 'les rations de caserne, qu\'on le fasse courir', reve: 'un concours de mangeurs de tartes. Il gagnerait. Il en est sûr',
        secret: 'il partage son pain avec les chiens errants de la porte sud ; ils le suivent jusqu\'au bar', manie: 'il a toujours quelque chose à grignoter dans la main', phrase: 'Il reste à manger ?',
        liens: { Konrad: 'son binôme de la porte sud ; deux mots par jour, ça lui suffit', Berthe: 'elle lui garde les fonds de marmite' } },
    lieux: { travail: ['~Il croque une pomme en surveillant la route.|Porte sud ! Rien à signaler, sauf que j\'ai faim.'], bar: ['Berthe ! Les fonds de marmite ! … Elle me les garde. C\'est l\'amour, ça.'] },
    avis: { Konrad: ['Konrad dit deux mots par jour. Le premier, c\'est « oui ». Le deuxième, c\'est « non ». Je l\'adore. On s\'entend très bien.'] }
},
'29:35': { // Konrad
    oc: { age: '45 ans', allure: 'barbe noire, épaules carrées, un regard lourd qui fait reculer les chiens', caractere: 'lent, taciturne, deux mots par phrase ; fiable comme un mur',
        aime: 'le silence, la porte sud à l\'aube, Rolf (qui parle pour deux)', deteste: 'les questions, le vent qui siffle', reve: 'une cabane au bord du lac, sans voisins. Avec Rolf, peut-être',
        secret: 'il sculpte de petits animaux en bois pendant sa garde de nuit et les laisse sur les fenêtres des enfants', manie: 'il hoche la tête au lieu de répondre', phrase: 'Hm. Oui.',
        liens: { Rolf: 'son binôme, qui mange et parle pour deux' } },
    lieux: { travail: ['~Il hoche la tête. Une fois.|Porte sud.'], nuit: ['~Il taille un petit morceau de bois, sans lever les yeux.|… Pour les petits.'] },
    avis: { Rolf: ['Rolf. … Bon garde. Mange trop.'] }
},
'29:39': { // Tobias
    oc: { age: '61 ans', allure: 'longue perche à crochet, gants troués, un manteau qui sent la cire et la pierre chaude', caractere: 'doux, poétique ; parle de la lumière comme d\'un être vivant',
        aime: 'l\'heure où la ville s\'allume, les lampes qui « oublient » puis se souviennent, laisser Pépin dormir près d\'une lampe tiède', deteste: 'les pierres grises qu\'on jette, les nuits sans lune où les lampes travaillent trop', reve: 'les vingt lampes promises pour la ville basse ; il en a déjà choisi les places',
        secret: 'il donne un petit nom à chaque lampe, et il leur dit bonne nuit', manie: 'il tapote les lampes du bout des doigts avant de les allumer', phrase: 'Que ta route soit éclairée.',
        liens: { Mirabelle: 'la mage du Marché, qui recharge ses pierres', 'Pépin': 'il le laisse dormir près d\'une lampe tiède', Mathurin: 'le crieur, sous la lampe de la grand-rue' } },
    lieux: { travail: ['~Il tapote une lampe. Elle s\'allume, comme si elle se réveillait.|Bonsoir, toi. Tu as bien dormi ?'], nuit: ['Toutes allumées. Maintenant, je veille avec elles.'] },
    avis: { Mirabelle: ['Mirabelle, au Marché, recharge mes pierres. Elle parle vite, elle rit fort, et les lampes brillent mieux après. Je crois qu\'elles l\'aiment bien.'], 'Pépin': ['Pépin dort contre la lampe du coin. Elle chauffe un peu. Je l\'allume un peu plus tôt pour lui. C\'est mon secret.'], Mathurin: ['Le crieur crie sous ma lampe de la grand-rue. Elle clignote quand il crie trop fort. Je crois qu\'elle rit.'] }
},
'29:42': { // Pépin
    oc: { age: '66 ans', allure: 'manteau rapiécé, mains de carrier, un sourire qui ne demande rien', caractere: 'humble, ironique, sans apitoiement ; trente ans à tailler la pierre, et des histoires plein les poches',
        aime: 'le pain de Berthe, la lampe tiède de Tobias, raconter les pierres de la ville (il en a taillé la moitié)', deteste: 'la pitié, les porches pris', reve: 'tailler une dernière pierre, une belle, pour la fontaine de la place',
        secret: 'il reconnaît chaque pierre qu\'il a taillée ; il les salue en passant', manie: 'il tapote les murs comme on tapote l\'épaule d\'un ami', phrase: 'C\'est gratuit, et ça vaut à peu près pareil.',
        liens: { Berthe: 'elle lui garde du pain', Tobias: 'il lui laisse la lampe tiède' } },
    lieux: { travail: ['~Il tapote un mur.|Celle-là, je l\'ai taillée il y a vingt ans. Elle tient. Moi aussi, à peu près.'], nuit: ['La lampe de Tobias est tiède, ce soir. C\'est la meilleure chambre de la ville.'] },
    avis: { Berthe: ['Berthe, du bar, me garde du pain. Elle dit « mange ». Je mange. On ne discute pas avec Berthe.'], Tobias: ['Tobias allume ma lampe un peu plus tôt, l\'hiver. Il croit que je ne le vois pas. Je le vois. Je dis merci à la lampe.'] }
},
/* ── le Marché ────────────────────────────────────────────────────────── */
'30:6': { // Bertrand
    oc: { age: '47 ans', allure: 'tablier vert, moustache en balai, une voix qui vend des carottes à l\'autre bout du Marché', caractere: 'crieur, blagueur ; vante ses légumes comme des bijoux',
        aime: 'une belle courge, crier les prix, le gamin de Rubis qui renverse ses pommes (il le dit pas)', deteste: 'la grêle, qu\'on tâte les tomates', reve: 'une courge si grosse qu\'il faudrait deux charrettes',
        secret: 'il donne une pomme chaque matin à Timothée, « pour qu\'il laisse les autres sur l\'étal » ; en vrai, il l\'aime bien', manie: 'il lance une pomme en l\'air et la rattrape en parlant', phrase: 'Des carottes comme des lingots !',
        liens: { Timothée: 'l\'élève maladroit de la patrouille ; une pomme chaque matin' } },
    lieux: { travail: ['DES CAROTTES COMME DES LINGOTS ! DES RADIS COMME DES RUBIS ! … Les rubis, c\'est l\'académie, je sais. Mais ça rime.'] },
    avis: { Timothée: ['Le petit de l\'académie, Timothée, renverse ma caisse de pommes une fois par semaine. Il ramasse tout, il s\'excuse auprès de chaque pomme. Je lui en donne une. Il en renverse une autre.'] }
},
'30:7': { // Mirabelle
    oc: { age: '30 ans', allure: 'robe étoilée, chapeau pointu de travers, des doigts qui scintillent de poussière de cristal', caractere: 'pétillante, affairée ; parle vite de choses compliquées et rit de ses propres explications',
        aime: 'un cristal bien rechargé, les lampes de Tobias, expliquer le mana à qui ne demande rien', deteste: 'les cristaux fêlés, qu\'on dise « magie » au lieu de « Parole »', reve: 'recharger les lanternes de toute une ville en une seule nuit',
        secret: 'elle a raté son examen de Rubis deux fois ; elle recharge mieux que la plupart des diplômés', manie: 'elle claque des doigts, et une petite étincelle part à chaque fois', phrase: 'Positif, négatif, spirituel ! C\'est simple !',
        liens: { Tobias: 'l\'allumeur, dont elle recharge les pierres' } },
    lieux: { travail: ['~Elle tient un cristal entre deux doigts, il s\'allume.|Voilà ! Rechargé ! Une lanterne, une barrière, un outil : tout marche aux cristaux. Et les cristaux, ça marche à moi !'] },
    avis: { Tobias: ['Tobias parle à ses lampes. Elles brillent mieux après. Je ne sais pas si c\'est la Parole ou la gentillesse. Peut-être que c\'est pareil.'] }
},
'30:8': { // Gustave (le fromager)
    oc: { age: '56 ans', allure: 'ventre rond, tablier blanc taché de crème, un couteau à fromage comme un sceptre', caractere: 'lent, gourmand ; parle de fromage avec émotion, et de tout le reste avec indifférence',
        aime: 'un fromage qui a « du caractère », les meules qui mûrissent, la bouchère d\'en face (sa voisine, son amie)', deteste: 'les fromages pressés, qu\'on dise « ça sent »', reve: 'un fromage si bon qu\'on le servirait à la table d\'un roi',
        secret: 'il parle à ses meules, la nuit, pour les faire mûrir', manie: 'il fait goûter un petit morceau à tout le monde, de force', phrase: 'Goûte. Ferme les yeux. Goûte.',
        liens: { Madeleine: 'la bouchère d\'en face ; ils se passent leurs clients' } },
    lieux: { travail: ['~Il te tend un morceau de fromage au bout de son couteau.|Goûte. Ferme les yeux. … Tu sens ? C\'est l\'automne. Celui d\'il y a deux ans.'] },
    avis: { Madeleine: ['Madeleine, la bouchère, me passe ses clients quand ils veulent du fromage avec la viande. Je lui passe les miens quand ils veulent de la viande avec le fromage. C\'est un équilibre.'] }
},
'30:10': { // Rose
    oc: { age: '25 ans', allure: 'couronne de fleurs fanées, tablier plein de graines, des mains vertes', caractere: 'douce, rêveuse, un peu triste ; parle aux fleurs, et les fleurs ont l\'air d\'écouter',
        aime: 'le lilas au printemps, les épices de Tian (elle dit qu\'elles sentent les fleurs d\'ailleurs), sa boîte à graines', deteste: 'les fleurs coupées trop tôt, qu\'on lui demande des fleurs « qui durent »', reve: 'un jardin à elle, avec toutes les fleurs qui ne poussent pas ici',
        secret: 'Kaze lui a demandé où pousse une fleur rare ; elle cherche dans tous ses livres, sans le lui dire', manie: 'elle respire chaque fleur avant de la vendre, et parfois ne la vend pas', phrase: 'Celle-là, elle n\'est pas à vendre. Elle est trop heureuse ici.',
        liens: { Tian: 'le marchand d\'épices ; leurs étals sentent la même chose, de loin', jeck: 'il lui a rapporté sa clé perdue' } },
    lieux: { travail: ['~Elle arrose un pot de violettes en leur parlant tout bas.|… et demain, il fera beau. Fernand l\'a dit.'] },
    avis: { Tian: ['Tian vend des épices venues de loin. Quand le vent souffle de son étal, mes fleurs se redressent. Je crois qu\'elles ont le mal du pays, elles aussi.'] }
},
'30:11': { // Tian
    oc: { age: '50 ans', allure: 'longue robe brodée, un bonnet rond, des sacs d\'épices qui colorent l\'air autour de lui', caractere: 'cérémonieux, patient ; parle par proverbes étranges qu\'il invente parfois',
        aime: 'le thé du soir, les fleurs de Rose (elles sentent son pays), les clients qui demandent d\'où vient une épice', deteste: 'la précipitation, les épices mal moulues', reve: 'ramener Rose voir les champs de safran de chez lui ; il n\'ose pas le dire',
        secret: 'la moitié de ses proverbes, il les invente le matin même', manie: 'il s\'incline légèrement avant de répondre', phrase: 'Le poivre ne se presse pas. Le client non plus.',
        liens: { Rose: 'la fleuriste ; ses fleurs sentent son pays' } },
    lieux: { travail: ['~Il s\'incline.|Chez moi, on dit : « L\'épice qui voyage arrive plus forte. » Celle-ci a beaucoup voyagé. Elle est très forte.'] },
    avis: { Rose: ['Mademoiselle Rose a des fleurs qui sentent mon pays. Chez moi, on dit : « Celui qui sent sa maison n\'est jamais tout à fait loin. » … Je viens de l\'inventer.'] }
},
'30:12': { // Oriane
    oc: { age: '18 ans', allure: 'robe d\'apprentie roussie aux manches, sourcils à moitié brûlés, un grimoire trop gros', caractere: 'enthousiaste, maladroite ; fait tout brûler un peu, et recommence avec le sourire',
        aime: 'les runes qui brillent, les explications d\'Évariste, que maître Aldebert dise « hm, pas mal »', deteste: 'les seaux d\'eau (on lui en jette souvent), qu\'on l\'appelle « l\'incendiaire »', reve: 'réussir un enchantement sans rien faire fumer',
        secret: 'elle va voir l\'alchimiste Évariste en cachette ; Aldebert le sait et fait semblant d\'être vexé', manie: 'elle souffle sur ses doigts après chaque sort', phrase: 'Oups. Non, c\'est bon, c\'est presque bon !',
        liens: { Aldebert: 'son maître grincheux', 'Évariste': 'l\'alchimiste du banc, qui lui explique pourquoi ça brûle' } },
    lieux: { travail: ['~Une petite fumée monte de son grimoire.|C\'est normal ! Enfin, c\'est fréquent. Ce qui est presque pareil.'] },
    avis: { Aldebert: ['Maître Aldebert dit que je suis « catastrophique avec du potentiel ». Je l\'ai écrit sur mon grimoire. Il a brûlé. Le grimoire, pas maître Aldebert.'], 'Évariste': ['Le vieil Évariste, sur son banc, m\'explique pourquoi tout brûle. Je l\'écoute. Puis je rentre, et ça brûle. Mais moins !'] }
},
'30:13': { // Aldebert
    oc: { age: '70 ans', allure: 'barbe en pointe, lunettes cerclées d\'or, une sacoche d\'outils minuscules', caractere: 'grincheux, érudit ; méprise les amateurs et adore son apprentie (sans le dire)',
        aime: 'un objet enchanté qui remarche, le jeudi (déjeuner avec Évariste pour se disputer), le silence', deteste: 'l\'alchimie (« de la cuisine »), les seaux d\'eau sur ses établis', reve: 'qu\'Oriane devienne meilleure que lui ; il la pousse pour ça',
        secret: 'il garde dans un tiroir tous les objets qu\'Oriane a brûlés, avec une étiquette et une date', manie: 'il dit « hm » sur trois tons différents', phrase: 'Hm. Pas mal. Recommence.',
        liens: { Oriane: 'son apprentie ; il la gronde, il la garde', 'Évariste': 'son rival du jeudi, son meilleur ami du jeudi' } },
    lieux: { travail: ['~Il visse une pièce minuscule dans une boîte à musique.|Elle chantera de nouveau. Les objets veulent toujours remarcher. C\'est les gens qui abandonnent.'] },
    avis: { Oriane: ['Mon apprentie fait tout brûler. Mais elle brûle mieux qu\'avant. C\'est un progrès. Ne lui répète pas.'], 'Évariste': ['Évariste dit que la réparation, c\'est du rafistolage. Il me l\'a dit au déjeuner. Le jeudi. Comme tous les jeudis depuis vingt ans.'] }
},
'30:14': { // Selma
    oc: { age: '39 ans', allure: 'foulards superposés, bracelets qui tintent, une boule de verre qui est en fait un bocal retourné', caractere: 'mystérieuse en surface, pragmatique dessous ; charlatane, et elle le sait',
        aime: 'lire les gens (pas les cartes), les clients qui reviennent dire « vous aviez raison »', deteste: 'les vrais devins (ils lui font de la concurrence), Jacquot quand il vend des « porte-bonheur » à ses clients', reve: 'prédire une chose vraie, une fois, et qu\'elle arrive',
        secret: 'elle ne prédit que des choses gentilles ; « les gens ont assez d\'avenir triste, ils n\'ont pas besoin de le payer »', manie: 'elle ferme les yeux et dit « je vois… » avant chaque phrase, même pour l\'heure', phrase: 'Je vois… une rencontre.',
        liens: { Jacquot: 'le colporteur ; deux bonimenteurs qui se respectent', Lucien: 'le cartographe ; elle lit l\'avenir, lui les chemins' } },
    lieux: { travail: ['~Elle ferme les yeux.|Je vois… quelqu\'un qui a besoin d\'une bonne nouvelle. Ça tombe bien, j\'en vends.'] },
    avis: { Jacquot: ['Jacquot vend des porte-bonheur à mes clients. Je leur prédis de la chance. On fait le même métier en deux étapes.'], Lucien: ['Lucien, le cartographe, me dit qu\'on ne peut pas prédire les chemins, seulement les dessiner. Je lui dis que c\'est pareil, mais avec moins d\'encre.'] }
},
'30:17': { // Jacquot
    oc: { age: '45 ans', allure: 'veste à mille boutons dépareillés, un sac à dos qui déborde, une voix de foire', caractere: 'bonimenteur, rapide, sympathique ; vend de tout, et surtout n\'importe quoi',
        aime: 'convaincre, les lacets « magiques » (des lacets), les clients qui rient en achetant', deteste: 'les sceptiques, la pluie sur son étal', reve: 'vendre quelque chose à Edmée, la comptable de l\'auberge ; personne n\'y est arrivé',
        secret: 'il vérifie que tout ce qu\'il vend marche, au moins un peu ; il a des principes', manie: 'il dit « et ce n\'est pas tout ! » même quand c\'est tout', phrase: 'Et ce n\'est pas tout !',
        liens: { jeck: 'le marchand d\'objets trouvés ; deux crieurs qui se respectent', Selma: 'la diseuse ; ils se renvoient les clients' } },
    lieux: { travail: ['UN LACET ! Qui tient ! Qui serre ! Qui ne se défait jamais ! … Sauf si on tire dessus. ET CE N\'EST PAS TOUT !'] },
    avis: { jeck: ['jeck vend ce que les gens ont perdu. Moi, ce qu\'ils n\'ont jamais eu. On ne se fait pas concurrence. On se fait des clins d\'œil.'], Selma: ['Selma prédit de la chance à ses clients. Je leur vends un porte-bonheur. Ils repartent heureux. Je ne vois pas où est le mal.'] }
},
'30:18': { // Firmin
    oc: { age: '44 ans', allure: 'uniforme de garde du Marché, un sifflet autour du cou, des poches pleines de fruits « confisqués »', caractere: 'fatigué, pragmatique ; humour de garde ; arbitre les disputes d\'étal mieux qu\'un juge',
        aime: 'les marchés calmes, les fruits trop mûrs qu\'on lui donne, Nestor (son binôme)', deteste: 'les disputes de prix, les pickpockets', reve: 'une journée de Marché sans un seul coup de sifflet',
        secret: 'il ne siffle jamais vraiment : il fait semblant, et ça suffit', manie: 'il porte le sifflet à ses lèvres, puis le repose', phrase: 'Allons, allons.',
        liens: { Nestor: 'son binôme du Marché' } },
    lieux: { travail: ['~Il porte son sifflet à ses lèvres, puis le repose.|Allons, allons. Ce n\'est qu\'une courge.'] },
    avis: { Nestor: ['Nestor fait la ronde du nord, moi celle du sud. On se croise au milieu, on se dit « rien », et on repart. C\'est le meilleur collègue que j\'aie eu.'] },
    perso: { titre: 'Le sifflet ?', paliers: [[1, 'Je ne siffle jamais. Le sifflet suffit.'], [4, 'Une fois, j\'ai vraiment sifflé. Tout le Marché s\'est arrêté, même les poules. Depuis, je fais semblant. C\'est plus poli.']] }
},
'30:19': { // Nestor
    oc: { age: '39 ans', allure: 'uniforme de garde du Marché, une moustache dont il est fier, un carnet de « disputes du jour »', caractere: 'fatigué, pragmatique ; note les disputes et leurs solutions, pour le jour où quelqu\'un en aura besoin',
        aime: 'sa moustache, les étals bien alignés, Firmin (qui ne siffle jamais)', deteste: 'les étals de travers, les chiens qui volent les saucisses de Madeleine', reve: 'écrire un livre des disputes de marché, avec les solutions',
        secret: 'il a déjà trois cents disputes dans son carnet ; la plus fréquente, c\'est « qui était là le premier »', manie: 'il lisse sa moustache avant de trancher', phrase: 'Qui était là le premier ?',
        liens: { Firmin: 'son binôme du Marché' } },
    lieux: { travail: ['~Il lisse sa moustache.|Qui était là le premier ? … Vous deux ? En même temps ? Bon. Je note : « en même temps ».'] },
    avis: { Firmin: ['Firmin ne siffle jamais. Il fait semblant. Ça marche. J\'ai essayé de siffler pour de vrai une fois. Ça ne marche pas.'] },
    perso: { titre: 'Ton carnet ?', paliers: [[1, 'Les disputes du jour. Et leurs solutions.'], [4, 'La plus belle : deux marchands qui se disputaient la même place, tous les jours, pendant un an. Ils se sont mariés. Je l\'ai notée en rouge.']] }
},
'30:20': { // Madeleine
    oc: { age: '50 ans', allure: 'tablier blanc impeccable, avant-bras puissants, un hachoir qu\'elle manie comme une plume', caractere: 'solide, directe ; tranche la conversation comme la viande',
        aime: 'un travail propre, le fromage de Gustave (avec du pain), les clients qui savent ce qu\'ils veulent', deteste: 'les hésitants, les chiens voleurs de saucisses', reve: 'une boutique avec une vraie chambre froide aux cristaux',
        secret: 'elle garde les os pour les chiens errants qu\'elle chasse en criant', manie: 'elle dit « suivant » même quand il n\'y a personne', phrase: 'Suivant !',
        liens: { Gustave: 'le fromager d\'en face ; ils se passent leurs clients' } },
    lieux: { travail: ['~Elle abat son hachoir, net.|Suivant ! … Ah, c\'est toi. Tu veux quoi ? Décide. Vite. Voilà.'] },
    avis: { Gustave: ['Gustave parle à ses fromages. Moi je ne parle pas à ma viande. Mais je le comprends. Un peu. Le mardi.'] }
},
'30:23': { // Lucien
    oc: { age: '34 ans', allure: 'lunettes rafistolées, rouleaux de cartes sous chaque bras, des doigts noirs d\'encre', caractere: 'méticuleux, passionné ; s\'excuse beaucoup ; dessine les chemins comme on écrit des lettres d\'amour',
        aime: 'une carte juste, les voyageurs qui lui racontent leurs routes, l\'odeur du papier neuf', deteste: 'les cartes fausses, les rivières qui changent de lit', reve: 'cartographer chaque région autour de la ville — et un jour, une faille',
        secret: 'il a dessiné une carte de la ville où chaque maison porte le nom de qui y habite ; il la garde pour lui', manie: 'il mesure les distances en pas, même dans une conversation', phrase: 'Pardon, vous pourriez me dire par où vous êtes passé ?',
        liens: { Selma: 'la diseuse ; elle lit l\'avenir, lui les chemins' } },
    lieux: { travail: ['~Il se penche sur la grande carte du monde, une loupe à la main.|Pardon. Ici, il manque une colline. Je le sais, j\'ai marché dessus.'] },
    avis: { Selma: ['Selma, la diseuse, me dit qu\'on ne peut pas dessiner l\'avenir. Je lui ai montré ma carte. Elle a dit : « Je vois… des chemins. » Je crois qu\'elle a triché.'] }
},
/* ── les boutiques ────────────────────────────────────────────────────── */
'41:4': { // Renaud
    oc: { age: '29 ans', allure: 'armure de cuir trop neuve, une épée qu\'il n\'a jamais tirée, un sourire de vendeur raté', caractere: 'bavard, compare tout ; marchande mal et le sait',
        aime: 'comparer les lames, les conseils de Gaudry, la chasseuse Clarisse (il essaie de l\'impressionner)', deteste: 'payer le prix affiché, que Clarisse le corrige', reve: 'un contrat de la Bourse avec une vraie prime',
        secret: 'il marchande exprès mal pour rester plus longtemps à la forge, au chaud', manie: 'il soupèse chaque objet, même les clous', phrase: 'Et celle-là, elle coupe mieux ?',
        liens: { Clarisse: 'la chasseuse de la forge ; elle le corrige, il insiste' } },
    lieux: { travail: ['~Il soupèse deux épées identiques.|Celle-là est plus légère. Non. Celle-là. … Elles sont pareilles ? Vous êtes sûr ?'] },
    avis: { Clarisse: ['Clarisse vient chercher ses pointes de flèches sans dire un mot. Elle sait ce qu\'elle veut. Moi, je sais ce que je compare. C\'est presque pareil.'] },
    perso: { titre: 'Un contrat ?', paliers: [[1, 'Bientôt ! Dès que j\'aurai la bonne épée.'], [4, 'En vrai, j\'ai peur de partir. Alors je compare les épées. Tant que je compare, je ne pars pas. Ne le dis pas à Clarisse.']] }
},
'41:6': { // Clarisse
    oc: { age: '32 ans', allure: 'cape de chasseuse couleur de feuilles mortes, un arc court, des yeux qui ne clignent pas', caractere: 'froide, efficace ; n\'aime pas perdre son temps ; drôle en trois mots',
        aime: 'les pointes de flèches bien affûtées, le silence de la forêt, que Renaud se taise (rare)', deteste: 'les bavards, le bruit dans les bois', reve: 'une cabane de chasse au fond de la forêt, loin de tout le monde',
        secret: 'elle a appris à Renaud à tenir son épée sans qu\'il s\'en rende compte, en le corrigeant « par hasard »', manie: 'elle compte ses flèches en entrant et en sortant', phrase: 'Trop long.',
        liens: { Renaud: 'le mercenaire bavard de la forge ; il compare, elle tranche' } },
    lieux: { travail: ['~Elle pose six pointes de flèches sur le comptoir.|Affûtées. Pour demain. Merci.'] },
    avis: { Renaud: ['Renaud compare tout. Les épées, les clous, les flèches. Il a de bonnes mains. Il ne le sait pas. Je ne le lui dirai pas : il parlerait plus.'] },
    perso: { titre: 'La forêt ?', paliers: [[1, 'Calme. Si on se tait.'], [4, 'Il y a une clairière, au sud, où les cerfs viennent boire au lever du jour. Je n\'y chasse jamais. J\'y vais pour les regarder. Ne le dis à personne.']] }
},
'42:5': { // Hélène
    oc: { age: '46 ans', allure: 'cheveux courts gris, tablier de cuir, une aiguille à rivets coincée derrière l\'oreille', caractere: 'pratique, maternelle avec les recrues, sévère avec les vantards',
        aime: 'une armure bien ajustée, les recrues qui écoutent, se disputer avec Gaudry sur la meilleure trempe', deteste: 'les armures dorées « pour la frime », les sangles mal serrées', reve: 'que chaque recrue qu\'elle équipe revienne lui montrer ses bosses',
        secret: 'elle renforce en douce les armures des recrues trop pauvres, sans changer le prix', manie: 'elle tire sur les sangles des gens pour vérifier, sans demander', phrase: 'Serre-moi ça. Plus fort.',
        liens: { Gaudry: 'le forgeron d\'à côté ; sa concurrence préférée', Odile: 'la Brémont qui veut l\'armure dorée' } },
    lieux: { travail: ['~Elle tire sur la sangle de ton armure.|Mal serrée. Voilà. Maintenant, si tu tombes, tu tombes en entier.'] },
    avis: { Gaudry: ['Gaudry dit qu\'il forge mieux que moi. Il a raison. Mais j\'ajuste mieux que lui. Une armure mal ajustée, c\'est une belle pièce de métal qui ne sert à rien.'], Odile: ['La petite Brémont veut l\'armure dorée. Je lui ai vendu la grise. Elle boude. Elle reviendra me remercier.'] }
}
};
