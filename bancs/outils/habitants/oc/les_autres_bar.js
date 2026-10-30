/*
 * LES AUTRES HABITANTS DU BAR (46) ET DE L'AUBERGE (44), comme des OC —
 * leur fiche (P1), ce qu'ils disent selon où ils sont (P2), ce qu'ils disent
 * des autres (P3). Pas de scènes d'amitié ni de cadeaux : c'est le premier
 * cercle qui les a (oc/bar.js, oc/ville.js…). Voir oc/ville.js pour les champs.
 */
'use strict';
module.exports = {
'46:31': { // Silas
    oc: { age: '44 ans', allure: 'gilet de velours violet, une fiole à chaque doigt, un sourire qui arrive avant lui', caractere: 'mielleux, trop poli, menteur de métier ; vend du rêve en bouteille et y croit à moitié',
        aime: 'les clients qui veulent croire, le velours, compter ses fioles', deteste: 'Nell, qui le démasque ; les questions précises', reve: 'vendre une fois une vraie potion miracle, rien que pour voir l\'effet',
        secret: 'ses « élixirs » sont du jus de pomme coloré ; il en boit un par soir, pour le courage', manie: 'il appelle tout le monde « très cher » et fait tinter ses fioles', phrase: 'Pour vous, très cher, un prix d\'ami.',
        liens: { Nell: 'l\'ancienne pickpocket, qui prévient ses clients', Mireille: 'elle a goûté ses élixirs ; « même pas de la bonne pomme »' } },
    lieux: { bar: ['~Il fait tinter trois fioles.|Un élixir de vigueur, très cher ? De sagesse ? D\'amour ? J\'ai les trois. Ce sont les mêmes, mais avec des étiquettes différentes.'] },
    avis: { Nell: ['Nell, au fond, prévient mes clients. C\'est très mauvais pour les affaires. Et très honnête. Je ne sais pas lequel des deux m\'agace le plus.'] }
},
'46:11': { // Ulric
    oc: { age: '57 ans', allure: 'tablier de cuir, loupe sur le front, des mains couvertes de fines rayures', caractere: 'lent, précis ; parle comme il grave : peu de mots, bien placés',
        aime: 'le silence de l\'atelier, une lettre bien gravée, les voyageurs qui reviennent chercher leur nom', deteste: 'qu\'on le presse, les fautes d\'orthographe sur une commande', reve: 'graver un jour une chose qui dure plus que lui',
        secret: 'il grave le nom de chaque client sur le fond de ses gourdes, à l\'intérieur, là où personne ne regarde', manie: 'il souffle sur ce qu\'il vient de graver', phrase: 'Un trait. Puis un autre.',
        liens: { Baptiste: 'le charretier, qui lui achète tout le nécessaire de route', Margot: 'il a gravé une chope à ton nom pour elle' } },
    lieux: { bar: ['~Il grave une boucle de ceinture, sans lever les yeux.|… Corde, gourde, briquet. Le reste, c\'est la route qui le donne.'] },
    avis: { Baptiste: ['Baptiste. Il use une gourde par saison. Il parle à ses bœufs dedans. Je ne pose pas de questions.'] }
},
'46:15': { // Baptiste
    oc: { age: '48 ans', allure: 'chapeau à larges bords, fouet enroulé à l\'épaule, une odeur de foin', caractere: 'jovial, bavard ; parle de ses bœufs comme de ses enfants',
        aime: 'Brindille et Caillou, ses deux bœufs ; la soupe de Berthe ; les routes royales bien entretenues', deteste: 'les ornières, qu\'on dise que ses bœufs sont lents (ils sont lents)', reve: 'une charrette neuve, avec un toit, pour que Brindille et Caillou aient de l\'ombre',
        secret: 'il chante pour ses bœufs, la nuit, sur la route, et il chante très bien', manie: 'il compte les distances en « soupes » : « c\'est à trois soupes d\'ici »', phrase: 'Brindille a encore boudé ce matin.',
        liens: { Berthe: 'elle le nourrit de force ; il se laisse faire', Ulric: 'qui lui vend gourdes et cordes' } },
    lieux: { bar: ['Ah ! Une soupe, et Brindille et Caillou dorment devant. On repart à l\'aube. On repart toujours à l\'aube.'] },
    avis: { Berthe: ['Berthe me dit « mange » trois fois par repas. J\'ai pris du ventre. Brindille aussi : elle mange mes restes.'], Ulric: ['Ulric m\'a vendu une gourde. Il a gravé mon nom au fond. Je l\'ai découvert en la nettoyant. J\'ai failli pleurer. C\'était le savon.'] }
},
'46:17': { // Odon
    oc: { age: '74 ans', allure: 'cardigan troué aux coudes, un jeu de cartes cornées, une pipe qu\'il n\'allume jamais', caractere: 'râleur, « de mon temps », mauvais perdant ; joue seul et triche quand même',
        aime: 'sa table du coin, ses cartes, qu\'on le laisse gagner contre lui-même', deteste: 'que Nell regarde son jeu, les jeunes qui disent « c\'était mieux avant » (c\'est sa phrase)', reve: 'battre Nell une fois, à la loyale',
        secret: 'il apprend un tour de cartes à Petit-Louis en cachette', manie: 'il bat les cartes en parlant, de plus en plus vite quand il ment', phrase: 'De mon temps…',
        liens: { Nell: 'elle surveille son jeu ; il fait semblant d\'être furieux', Pia: 'elle habite sous le même toit ; elle range ses cartes' } },
    lieux: { bar: ['~Il retourne une carte, la regarde, la remet.|Elle n\'était pas bonne. De mon temps, les cartes étaient meilleures.'] },
    avis: { Nell: ['Nell dit que je triche. Je joue seul ! Contre qui je tricherais ? … Contre moi. Bon. Je suis très difficile à battre.'] }
},
'46:19': { // Garrec
    oc: { age: '35 ans', allure: 'cuirasse cabossée, une cicatrice qu\'il raconte différemment chaque soir, un rire de tonneau', caractere: 'fort, fanfaron, gentil au fond ; rang C qui dit B ; promet beaucoup, oublie autant',
        aime: 'les histoires de combat (surtout les siennes, surtout celles des autres), la bière, être écouté', deteste: 'qu\'on vérifie ses histoires, les dés d\'Anselme', reve: 'passer rang B pour de vrai, et que le vieux le regarde une fois',
        secret: 'il note les promesses qu\'il fait à Lise sur un papier, pour ne plus les oublier ; il a perdu le papier', manie: 'il gonfle le torse avant chaque mensonge', phrase: 'C\'était un rang B. Au moins.',
        liens: { Lise: 'il lui a promis de lui apprendre à se battre ; il oublie, elle rappelle', 'Le vieux': 'il raconte ses combats ; le vieux le laisse faire', Anselme: 'il refuse ses dés, et joue quand même' } },
    lieux: { bar: ['~Il écarte les bras.|… et là, le loup, je le prends à la gorge, comme ça ! Enfin, à peu près comme ça. Il était grand.'] },
    avis: { Lise: ['La petite Lise me rappelle tous les soirs ma promesse. Je vais lui apprendre. Demain. Je l\'écris. Où est mon papier ?'], 'Le vieux': ['Le vieux au comptoir… On dit qu\'il était rang S. Je lui ai pris quelques histoires. Il ne m\'a rien dit. Je crois qu\'il m\'en a donné.'], Anselme: ['Anselme me propose ses dés tous les soirs. Je refuse tous les soirs. Je perds tous les soirs. Comment je fais ?'] }
},
'46:20': { // Anselme (le joueur de dés)
    oc: { age: '31 ans', allure: 'chapeau incliné, un dé qui roule entre ses doigts, un sourire de quelqu\'un qui doit de l\'argent', caractere: 'charmeur, nerveux ; toujours « sûr de gagner cette fois »',
        aime: 'le bruit d\'un dé sur une table, les soirs de paie, Garrec (le meilleur perdant de la salle)', deteste: 'qu\'on lui rappelle ses dettes, les dés pipés (il les reconnaît, c\'est une question d\'honneur)', reve: 'rembourser tout le monde le même soir, et voir leurs têtes',
        secret: 'il a un carnet où il note toutes ses dettes, au sol près ; il compte les rembourser, vraiment', manie: 'il souffle sur son dé avant chaque lancer, même quand il ne joue pas', phrase: 'Cette fois, c\'est la bonne.',
        liens: { Garrec: 'son meilleur adversaire ; il refuse, puis joue', Paulin: 'un garde qui lui doit de l\'argent ; c\'est le seul' } },
    lieux: { bar: ['~Le dé roule sur le comptoir. Il le rattrape avant qu\'il s\'arrête.|Je ne joue pas. Je m\'entraîne. C\'est différent.'] },
    avis: { Garrec: ['Garrec dit qu\'il ne joue pas avec moi. Puis il joue. Puis il perd. Puis il dit qu\'il ne joue plus. C\'est mon client préféré.'] }
},
'46:21': { // Pia
    oc: { age: '19 ans', allure: 'robe farinée, tresse châtain, des joues qui rougissent avant elle', caractere: 'timide, phrases qui s\'arrêtent au milieu ; amoureuse en secret du barde',
        aime: 'les chansons de Colin (même fausses), le moulin le matin, ranger les cartes d\'Odon', deteste: 'qu\'on la regarde quand Colin chante, parler devant plus de deux personnes', reve: 'que Colin chante une chanson en la regardant, elle, et pas le mur',
        secret: 'elle connaît toutes les chansons de Colin par cœur, les fausses notes comprises', manie: 'elle tortille sa tresse quand elle ment', phrase: 'Je… non, rien.',
        liens: { Colin: 'le barde ; elle le regarde, il regarde le mur', Odon: 'elle range ses cartes, sous le même toit' } },
    lieux: { bar: ['~Elle fixe le barde, puis détourne les yeux très vite.|Je… je suis là pour la soupe. Juste la soupe.'] },
    avis: { Colin: ['Colin chante faux. Je… j\'aime bien. Il chante faux avec tout son cœur. Les autres chantent juste avec rien.'] }
},
'46:22': { // Aimé Vannier
    oc: { age: '40 ans', allure: 'chemise à carreaux rouges, hache sur l\'épaule, la barbe exactement comme celle de son frère', caractere: 'bourru, contredit son frère sur tout ; ne supporte pas qu\'on les confonde',
        aime: 'abattre un chêne en un coup de moins que Basile, la bière, avoir raison', deteste: 'Basile quand il a raison, qu\'on dise « les jumeaux »', reve: 'savoir enfin qui est l\'aîné (la sage-femme est morte de rire, à l\'époque, et n\'a rien noté)',
        secret: 'il porte une écharpe rouge sous sa chemise pour que les gens les distinguent ; Basile porte la même', manie: 'il dit « non » avant que Basile ait fini sa phrase', phrase: 'Non, c\'est moi l\'aîné.',
        liens: { Basile: 'son jumeau ; ils se disputent sur tout, ils ne se quittent jamais' } },
    lieux: { bar: ['Basile dit qu\'il a coupé douze arbres aujourd\'hui. J\'en ai coupé treize. Le treizième, c\'était le sien.'] },
    avis: { 'Basile Vannier': ['Basile ? Il est né trois minutes après moi. Il dit le contraire. Il a toujours été en retard.'] }
},
'46:23': { // Basile Vannier
    oc: { age: '40 ans', allure: 'chemise à carreaux rouges, hache sur l\'épaule, la barbe exactement comme celle de son frère', caractere: 'bourru, contredit son frère sur tout ; tendre quand personne ne regarde',
        aime: 'les arbres qui tombent du bon côté, la bière, avoir raison', deteste: 'Aimé quand il a raison, qu\'on les confonde', reve: 'une chanson du barde où il est le héros — seul',
        secret: 'il laisse gagner Aimé au bras de fer une fois par mois, pour qu\'il garde le moral', manie: 'il dit « si » avant qu\'Aimé ait fini sa phrase', phrase: 'Si, c\'est moi l\'aîné.',
        liens: { 'Aimé Vannier': 'son jumeau ; ils se disputent sur tout, ils ne se quittent jamais' } },
    lieux: { bar: ['Aimé dit qu\'il a coupé treize arbres. Le treizième est tombé sur sa propre grange. Il ne le compte pas. Moi si.'] },
    avis: { 'Aimé Vannier': ['Aimé ? Il est né trois minutes après moi. Il dit le contraire. Il a toujours été jaloux.'] }
},
'46:24': { // Hector
    oc: { age: '70 ans', allure: 'gilet à boutons dorés, moustache en guidon, un rire qui fait trembler les chopes', caractere: 'blagueur, bon vivant ; taquine sa femme, l\'adore depuis trente ans',
        aime: 'Maude, les radis de son jardin (ratés), tricher à Corps, Âme, Esprit pour laisser gagner Petit-Louis', deteste: 'la cuillère qui disparaît, se coucher avant minuit', reve: 'fêter quarante ans de mariage au bar, avec tout le monde, et que Maude rie',
        secret: 'c\'est lui qui a appris à Petit-Louis à cacher la cuillère', manie: 'il appelle Maude « ma reine » et elle lève les yeux au ciel', phrase: 'Tu es toujours aussi belle qu\'au premier jour.',
        liens: { Maude: 'sa femme, sa reine, sa meilleure ennemie', 'Petit-Louis': 'son petit-fils, son complice', Mireille: 'elle raconte leurs disputes à tout le bar ; il adore' } },
    lieux: { bar: ['~Il lève sa chope vers Maude.|À ma reine ! … Elle ne trinque pas. Elle n\'a jamais trinqué. Trente ans. Je ne désespère pas.'] },
    avis: { Maude: ['Maude dit que j\'étais ivre le jour de notre rencontre. C\'est faux. J\'étais amoureux. Ça ressemble.'], Mireille: ['Mireille raconte nos disputes à tout le bar. Ça nous fait de la publicité. Trente ans de mariage, et toujours à l\'affiche !'] }
},
'46:25': { // Maude
    oc: { age: '68 ans', allure: 'châle gris impeccable, chignon serré, un regard qui pèse les gens', caractere: 'lucide, piques sèches, tendresse cachée ; dit non à tout, puis fait oui',
        aime: 'que Hector ait tort, le thé sans sucre, son petit-fils (elle ne le dira pas)', deteste: 'les cuillères qui disparaissent, les compliments d\'Hector (elle les garde tous)', reve: 'un jour de calme. Elle s\'ennuierait au bout d\'une heure',
        secret: 'elle garde une boîte avec tous les petits mots qu\'Hector lui a écrits en trente ans', manie: 'elle soupire avant de répondre, et sourit après', phrase: 'Au premier jour, tu étais ivre.',
        liens: { Hector: 'son mari ; trente ans de disputes, le secret d\'un couple solide', 'Petit-Louis': 'son petit-fils, qui triche et cache la cuillère' } },
    lieux: { bar: ['~Elle soupire.|Hector va chanter. Il chante toujours à la troisième chope. On est à la deuxième. Il me reste une minute de paix.'] },
    avis: { Hector: ['Hector me dit que je suis belle tous les soirs. Je réponds qu\'il est ivre. C\'est notre façon de dire bonsoir.'], 'Petit-Louis': ['Mon petit-fils cache ma cuillère. Je le sais. Je fais semblant de chercher. Hector aussi. On se dispute pour lui faire plaisir.'] }
},
'46:29': { // Merle
    oc: { age: '42 ans', allure: 'cape de garde de nuit, cernes jusqu\'aux joues, une lanterne éteinte à la ceinture', caractere: 'fatigué, pragmatique, humour de caserne ; dort debout, mais toujours d\'un œil',
        aime: 'la première bière après la ronde, les nuits sans histoire, se moquer gentiment de Casimir', deteste: 'le règlement récité, les chats qui renversent les poubelles à trois heures du matin', reve: 'une nuit de sommeil complète. Une seule. Pour voir',
        secret: 'il connaît chaque chat de la ville par son nom', manie: 'il bâille au milieu de ses phrases', phrase: 'Va te coucher, Casimir.',
        liens: { Casimir: 'le garde de jour, qui lui récite le règlement à la relève' } },
    lieux: { bar: ['~Il bâille.|Fin de ronde. Rien à signaler. Sauf un chat. Il s\'appelle Pruneau. Il m\'a regardé de travers.'], travail: ['Encore une rue, et c\'est la bière. Il y a toujours une rue de plus.'] },
    avis: { Casimir: ['Casimir me récite l\'article douze à chaque relève. Je le connais par cœur. Lui aussi. On le dit ensemble, maintenant.'] }
},
'46:30': { // Casimir
    oc: { age: '24 ans', allure: 'uniforme repassé, boutons qui brillent, un petit livre du règlement dans la poche de poitrine', caractere: 'réglementaire, un peu naïf ; cite le règlement, croit en tout ce qu\'il dit',
        aime: 'son uniforme, l\'article douze, que tout soit à sa place', deteste: 'qu\'on rie de son uniforme, les nuits (il a peur du noir, un peu)', reve: 'devenir sergent, et écrire un article treize',
        secret: 'il a peur du noir ; c\'est pour ça qu\'il est garde de jour', manie: 'il redresse son col quand il parle', phrase: 'Article douze : le garde de nuit prend la relève.',
        liens: { Merle: 'le garde de nuit ; il lui récite le règlement, Merle le lui récite en retour' } },
    lieux: { bar: ['Le règlement ne dit rien sur le bar. Alors je suis le règlement de Margot : on paie en partant.'], travail: ['~Il redresse son col.|Ronde de jour. Tout est conforme. J\'ai vérifié deux fois.'] },
    avis: { Merle: ['Merle dit « va te coucher, Casimir » à chaque relève. Ce n\'est pas dans le règlement. Je l\'ai cherché. Je l\'ajouterai peut-être.'] }
},
'46:32': { // Jehan
    oc: { age: '52 ans', allure: 'plume derrière l\'oreille, lunettes rondes, une écritoire de voyage toujours ouverte', caractere: 'poli, cultivé, un brin mélancolique ; écrit les lettres des autres et jamais les siennes',
        aime: 'les belles phrases, l\'encre noire, les lettres d\'amour qu\'on lui dicte en rougissant', deteste: 'l\'encre « sans caractère », qu\'on lui demande de mentir dans une lettre', reve: 'écrire une lettre à quelqu\'un, pour lui, une seule fois',
        secret: 'il a lu sans le savoir les poèmes à l\'encre invisible de Pervenche ; il les a trouvés très beaux, sur du papier « vide »', manie: 'il corrige les fautes d\'orthographe dans les conversations, à voix basse', phrase: 'Dites-moi, et j\'écris.',
        liens: { Pervenche: 'il achète son encre noire et lui dit qu\'elle manque de caractère ; il revient chaque semaine', Mireille: 'elle voudrait qu\'il écrive ses Mémoires' } },
    lieux: { bar: ['~Il écrit une lettre sous la dictée d\'un bûcheron qui rougit.|« Et ton sourire est comme… » Comme quoi, monsieur ? … Une hache ? Je mets « comme l\'aube ».'] },
    avis: { Pervenche: ['La marchande d\'encres, Pervenche. Son encre noire manque de caractère. J\'en rachète chaque semaine. Pour vérifier. Elle manque toujours de caractère. Je reviendrai.'] }
},
'46:36': { // Théo
    oc: { age: '11 ans', allure: 'casquette trop grande, pieds nus, une sacoche pleine de papiers griffonnés', caractere: 'effronté, rapide, commerçant-né ; invente les nouvelles qu\'il vend',
        aime: 'vendre, les pièces qui sonnent, jeck (son meilleur client et son modèle)', deteste: 'qu\'on lui demande si c\'est vrai, se laver', reve: 'avoir une boutique à côté de celle de jeck, et lui faire concurrence',
        secret: 'il donne la moitié de ce qu\'il gagne à Berthe, pour la soupe des autres gamins', manie: 'il crie « DERNIÈRE NOUVELLE » même pour dire bonjour', phrase: 'DERNIÈRE NOUVELLE !',
        liens: { jeck: 'son modèle ; il lui vend des nouvelles fausses, jeck les achète', Berthe: 'elle le nourrit ; il le lui rend en secret' } },
    lieux: { bar: ['DERNIÈRE NOUVELLE ! Un dragon a mangé le pain du boulanger ! … Bon, c\'était un chien. Mais c\'était un grand chien. Une pièce, et je te dis lequel.'] },
    avis: { jeck: ['jeck m\'achète mes nouvelles. Il sait qu\'elles sont fausses. Il les achète quand même. Il dit que c\'est un investissement. Je sais pas ce que ça veut dire, mais ça paie.'] }
},
'46:37': { // Berthe
    oc: { age: '59 ans', allure: 'tablier immense, une louche comme sceptre, des bras qui ont nourri trois générations', caractere: 'maternelle, autoritaire ; « mange » est sa réponse à tout',
        aime: 'les assiettes vides, que Baptiste reprenne de la soupe, les fonds de marmite pour Rolf', deteste: 'qu\'on dise « je n\'ai pas faim », le gaspillage', reve: 'que personne dans la ville ne se couche le ventre vide. Elle y travaille',
        secret: 'elle garde une marmite de côté pour Pépin et les gamins des rues, chaque soir', manie: 'elle remplit ton assiette pendant que tu dis non', phrase: 'Mange.',
        liens: { Baptiste: 'le charretier qu\'elle nourrit de force', 'Pépin': 'elle lui garde du pain, sans un mot', 'Théo': 'le gamin qui lui donne la moitié de ses pièces ; elle les garde pour lui' } },
    lieux: { bar: ['~Elle pose une assiette devant toi sans que tu aies rien demandé.|Mange. Tu me remercieras quand tu auras fini.'] },
    avis: { Baptiste: ['Baptiste dit qu\'il a mangé. Il ment. Personne ne mange assez, sur la route. Mange, Baptiste.'], 'Pépin': ['Pépin dort contre le mur du manoir. Je lui garde du pain tous les soirs. Il dit merci comme un prince.'] }
},
'46:38': { // Nell
    oc: { age: '29 ans', allure: 'gilet sombre à mille poches (vides, maintenant), un sourire de travers, des doigts trop agiles', caractere: 'moqueuse, maligne ; ancienne pickpocket rangée (presque) ; prévient les gens contre les arnaques',
        aime: 'démasquer Silas, regarder le jeu d\'Odon, les gens honnêtes (elle les trouve reposants)', deteste: 'les arnaques aux pauvres, qu\'on lui rappelle son ancien métier', reve: 'ouvrir une école pour apprendre aux gens à ne pas se faire voler',
        secret: 'elle vole encore, un peu : les escrocs, et elle rend aux volés', manie: 'elle te rend ta bourse en te disant bonjour (tu ne l\'avais pas sentie partir)', phrase: 'Tiens, tu as fait tomber ça.',
        liens: { Silas: 'le vendeur d\'élixirs ; elle prévient ses clients', Odon: 'elle surveille son jeu de cartes ; il triche, seul' } },
    lieux: { bar: ['~Elle pose ta bourse sur la table.|Tu l\'avais laissée dépasser. Ici, ça ne pardonne pas. Sauf moi. Moi, je pardonne.'] },
    avis: { Silas: ['Silas vend du jus de pomme coloré. Je préviens ses clients. Il me déteste. Il me dit « très chère » quand même. C\'est presque touchant.'], Odon: ['Odon triche en jouant seul. Je le regarde faire. C\'est le seul tricheur de la ville qui ne vole personne. Je le respecte.'] }
},
'44:10': { // Gaspard
    oc: { age: '55 ans', allure: 'manteau de laine (évidemment), un carnet de comptes toujours ouvert, des joues roses de marchand content', caractere: 'affable, compte tout ; parle affaires même en mangeant',
        aime: 'le vendredi soir à l\'auberge, une bonne affaire, que sa sœur Edmée soit d\'accord avec lui (rare)', deteste: 'les mites, les mauvais payeurs', reve: 'vendre de la laine jusqu\'à la mer de l\'est',
        secret: 'il tricote, le soir, dans sa chambre ; des écharpes qu\'il ne vend jamais', manie: 'il touche le tissu des vêtements des gens en leur parlant', phrase: 'Belle laine, ça. Pas la mienne, mais belle.',
        liens: { 'Edmée': 'sa sœur et sa comptable ; elle lève les yeux au ciel, il fait les bonnes affaires' } },
    lieux: { travail: ['~Il caresse la manche de ton manteau.|Laine des collines. Bon fil. Mal teinte. Je te ferais un meilleur prix.'] },
    avis: { 'Edmée': ['Edmée tient mes comptes. Elle dit que je fais de mauvaises affaires. Elle se trompe : je fais de bonnes affaires avec des gens qu\'elle n\'aime pas.'] }
},
'44:11': { // Edmée
    oc: { age: '52 ans', allure: 'robe grise sans un pli, lunettes au bout du nez, un boulier dans son sac', caractere: 'précise, pince-sans-rire ; lève les yeux au ciel quand son frère parle affaires',
        aime: 'les comptes justes, le silence du vendredi après le dîner, avoir raison (souvent)', deteste: 'les « bonnes affaires » de Gaspard, les ratures', reve: 'que Gaspard fasse une seule affaire sans la consulter, et qu\'elle soit bonne. Pour voir',
        secret: 'elle porte les écharpes que Gaspard tricote ; elle ne lui a jamais dit qu\'elle savait qui les faisait', manie: 'elle compte à voix basse quand quelqu\'un parle trop', phrase: 'Gaspard. Non.',
        liens: { Gaspard: 'son frère ; elle tient ses comptes et ses rêves' } },
    lieux: { travail: ['~Elle fait glisser trois perles de son boulier.|Gaspard a encore vendu à perte. Mais avec le sourire. Je note le sourire dans les pertes.'] },
    avis: { Gaspard: ['Mon frère vend de la laine à des gens qui n\'en veulent pas, à des prix qu\'ils ne peuvent pas payer. Et ils reviennent. Je ne comprends pas. Je compte.'] }
}
};
