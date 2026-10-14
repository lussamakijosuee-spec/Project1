/*
 * LE MARCHÉ (carte 30) — marchands, petits mages, crieur, une dame du manoir.
 * Les marchands (<NPC: marchand>) sont « sédentaires » pour VieDuVillage :
 * derrière l'étal de 7 h à 20 h, puis ils rentrent. Les gardes du marché
 * gardent la ronde que JOKO leur a tracée (<Vie: fixe>).
 */
'use strict';
var K = require('./_communs.js');
var P = K.P, A = K.A, C = K.C, si = K.si, cat = K.cat, H = K.H, paye = K.paye, boutique = K.boutique;
var fiches = [];
function F(f) { fiches.push(f); }

F({ ev: 6, nom: 'Bertrand', role: 'marchand de primeurs', voix: 'crieur, blagueur, vante ses légumes comme des bijoux.',
    premiere: 'Approchez ! Des pommes rouges comme des joues de jeune mariée ! … Bertrand, primeurs. Tu achètes ou tu admires ?',
    bonjour: { 1: ['On installe ! Les meilleures places partent à l\'aube.'], 2: ['Deux pour le prix d\'un, jusqu\'à ce que je change d\'avis !'], 3: ['Je remballe. Tout ce qui reste est à moitié prix. Enfin, aux trois quarts.'] }, bonjourTous: ['Bonjour !'],
    saisons: { 1: ['Radis, oseille, premières fraises. Le printemps a bon goût.'], 2: ['Tomates, pêches, melons. L\'été, je vends au kilo et je transpire au litre.'], 3: ['Pommes, courges, champignons. Et du cidre, sous le comptoir.'], 4: ['Choux. Des choux. Et encore des choux. L\'hiver est une saison de choux.'] },
    discuter: ['Les soldats du lord « goûtent » mes fruits. Un panier par jour. On appelle ça une taxe, quand c\'est eux.', 'Le secret d\'une belle pomme ? La cirer. Le secret d\'un bon marchand ? Ne pas le dire.', K.MAGIE[0]],
    nouvelles: [K.LORD[6], K.LORD[2], K.LORD[0]],
    perso: { titre: 'Les affaires ?', paliers: [[1, 'Ça roule !'], [4, 'Ça roulerait mieux sans les taxes. Je vends deux fois plus qu\'il y a dix ans. Je gagne deux fois moins.']] },
    options: [{ titre: 'Acheter', cmds: boutique([['objet', 44], ['objet', 9], ['objet', 46], ['objet', 45]]) }],
    aurevoir: ['Revenez ! Les pommes vous attendront !', 'Bonne journée !'] });
F({ ev: 7, nom: 'Mirabelle', role: 'mage de quartier : recharge les lampes enchantées, vend de petits sorts', voix: 'pétillante, affairée, parle vite de choses compliquées.',
    premiere: 'Mirabelle, magie du quotidien ! Lampes, serrures qui chantent, bouilloires qui ne débordent pas. Rien de grandiose. Tout d\'utile.',
    bonjourTous: ['Bonjour ! Une lampe à recharger ?', '~De petites étincelles tournent autour de ses doigts.|Oh, pardon. Bonjour.'],
    saisons: { 1: ['Le printemps, tout le monde veut un charme contre les moustiques. Ça ne marche pas. Je le vends quand même, avec un avertissement.'], 2: ['L\'été, je rafraîchis les caves. Deux pièces le sort. Les brasseurs m\'adorent.'], 3: ['L\'automne, les lampes. Toutes les lampes. Je dors quatre heures par nuit.'], 4: ['L\'hiver, je réchauffe des pierres. Une pierre chaude dans un lit, c\'est le vrai luxe.'] },
    discuter: ['La vraie magie, c\'est rare. Moi je fais de la magie de cuisine : un peu, souvent, bien.', K.MAGIE[2], 'Les nobles du manoir paient des mages de la capitale. Quand leurs sorts ratent, c\'est moi qu\'ils appellent. Par la porte de derrière.'],
    nouvelles: [K.LORD[1], K.MAGIE[3]],
    perso: { titre: 'Votre magie ?', paliers: [[1, 'Une baguette ? Non. Juste mes mains, et une dague pour couper les herbes.'], [4, 'Ma magie vient de ma mère, et de trente ans d\'erreurs. Le talent, c\'est le hasard. Le reste, c\'est du travail.']] },
    options: [
        { titre: 'Un Éther (40 G)', cmds: paye(40, cat(A.se('Magic1'), A.objet(15, 1), P('Mirabelle', 'Voilà. Garde-le au frais, et ne le secoue pas.')), P('Mirabelle', 'Quarante. La magie a un prix, même la petite.')) },
        { titre: 'Un charme de lumière (60 G)', cmds: paye(60, cat(A.se('Magic2'), A.objet(63, 1), P('Mirabelle', 'Tiens. Pour les nuits où tu ne veux pas être seul dans le noir.')), P('Mirabelle', 'Soixante pièces. Je ne fais pas crédit, même aux héros.')) }
    ],
    aurevoir: ['Que tes lampes brillent !', 'Reviens quand quelque chose grince !'] });
F({ ev: 8, nom: 'Gustave', role: 'fromager', voix: 'lent, gourmand, parle de fromage avec émotion.',
    premiere: 'Gustave. Fromages. Tu sens ça ? C\'est l\'odeur du bonheur. Ma femme dit que c\'est l\'odeur du divorce.',
    bonjourTous: ['Bonjour. Goûte.', '~Il te tend un bout de fromage sans demander.|Alors ?'],
    saisons: { 1: ['Fromage frais, au lait de printemps. Doux comme une promesse.'], 2: ['L\'été, les fromages coulent. Moi aussi.'], 3: ['L\'automne, les fromages d\'alpage descendent. Les meilleurs de l\'année.'], 4: ['L\'hiver, je vends les vieux. Plus ils sont vieux, plus ils sont chers. Comme les nobles.'] },
    discuter: ['Un fromage, c\'est du lait qui a eu de la patience.', 'Le manoir m\'a commandé cinquante meules pour la fête du lord. Payées à la livraison. On verra.', K.DUR[2]],
    nouvelles: [K.LORD[3], K.LORD[0]],
    perso: { titre: 'Votre femme ?', paliers: [[1, 'Elle m\'aime. Et elle déteste mes fromages.'], [4, 'On s\'est rencontrés ici, au marché. Elle vendait des pommes. Je lui ai offert un fromage. Elle me l\'a lancé à la figure. Le lendemain, elle est revenue.']] },
    aurevoir: ['Reviens goûter !', 'Hm, bonne journée.'] });
F({ ev: 10, nom: 'Rose', role: 'fleuriste', voix: 'douce, rêveuse, un peu triste.',
    premiere: 'Des fleurs ? Pour quelqu\'un ? … Pour toi, peut-être. On n\'offre jamais de fleurs à soi-même. C\'est dommage.',
    bonjourTous: ['Bonjour…', '~Elle arrange ses bouquets sans lever les yeux.|Bonjour.'],
    saisons: { 1: ['Le printemps, c\'est ma saison. Tout fleurit, même moi.'], 2: ['Les roses de l\'été. On les achète pour les mariages et pour les enterrements.'], 3: ['L\'automne, je vends des branches rouges et des fleurs séchées. C\'est beau aussi, ce qui meurt.'], 4: ['L\'hiver, pas de fleurs. Je vends des rubans. Et je compte les jours.'] },
    discuter: ['Les nobles achètent des fleurs pour leurs tables. Elles meurent en deux jours. Ils en rachètent. Je devrais être contente.', 'Un garçon vient chaque semaine acheter une rose. Toujours une seule. Je ne sais pas pour qui.'],
    nouvelles: [K.LORD[6]],
    perso: { titre: 'Pourquoi triste ?', paliers: [[1, 'Je ne suis pas triste. Je suis fleuriste.'], [4, 'Le garçon à la rose… un jour, il m\'en a laissé une. Sur mon étal. Il n\'est plus revenu. Il est parti avec les soldats du lord.']] },
    aurevoir: ['Au revoir…', 'Offre des fleurs à quelqu\'un. Avant qu\'il ne soit trop tard.'] });
F({ ev: 11, nom: 'Tian', role: 'marchand d\'épices venu de loin', voix: 'cérémonieux, patient, proverbes étranges.',
    premiere: 'Bienvenue à l\'étal de Tian. Mes épices ont traversé plus de montagnes que la plupart des hommes.',
    bonjour: { 1: ['Le matin, les épices dorment. Il faut les réveiller doucement.'], 2: ['Approche, sens. Ne touche pas.'], 3: ['Je remballe. Le soir, les épices perdent leur âme.'] }, bonjourTous: ['Bienvenue.'],
    saisons: { 1: ['Au printemps, les routes du sud rouvrent. Mes caravanes arrivent.'], 2: ['L\'été, le poivre vaut de l\'or. Littéralement : le lord le paie en or.'], 3: ['L\'automne, on fait des provisions. Le sel, la cannelle. Le sel surtout.'], 4: ['L\'hiver, je suis coincé ici. Votre froid est une épice que je n\'aime pas.'] },
    discuter: ['Chez moi, on dit : « Le marchand qui parle trop vend peu, le marchand qui ne parle pas ne vend rien. »', 'La taxe sur le sel a doublé. Je vends mon sel moins cher que le lord. C\'est interdit. C\'est aussi très apprécié.', 'Votre magie de lampes me fascine. Chez moi, on s\'éclaire avec de l\'huile et de la patience.'],
    nouvelles: [K.LORD[0], K.LORD[7]],
    perso: { titre: 'Votre pays ?', paliers: [[1, 'Loin. Plus loin que ta carte.'], [4, 'J\'y ai une femme et une fille. Je leur envoie de l\'argent à chaque caravane. Je ne sais pas si l\'argent arrive. Je ne sais pas si elles m\'attendent encore.']] },
    aurevoir: ['Que ta route soit parfumée.', 'Reviens. Les épices se souviennent des visages.'] });
F({ ev: 12, nom: 'Oriane', role: 'apprentie enchanteresse de maître Aldebert', voix: 'enthousiaste, maladroite, fait tout brûler un peu.',
    premiere: 'Bonjour ! Oriane, apprentie ! … Attention, ne touche pas ce pot, il est peut-être en train d\'exploser. Non. Ça va.',
    bonjourTous: ['Bonjour !', '~Une odeur de brûlé flotte autour d\'elle.|Ce n\'est rien. Presque rien.'],
    saisons: { 1: ['J\'apprends les sorts de germination ! Maître Aldebert dit que je fais pousser surtout des mauvaises herbes.'], 2: ['L\'été, j\'ai fait geler une cruche d\'eau ! Et la table. Et la main du maître.'], 3: ['J\'enchante des lampes ! Enfin, j\'essaie. Il y en a une qui chante au lieu d\'éclairer.'], 4: ['L\'hiver, je m\'entraîne à faire des étincelles. Je ne sens plus mes sourcils.'] },
    discuter: ['Le maître dit que j\'ai du talent et aucune prudence. C\'est un bon début, non ?', 'Le maître m\'a confié un anneau ! Je ne sais pas encore ce qu\'il fait. Il chauffe quand je mens.', K.MAGIE[5]],
    nouvelles: [K.LORD[1], K.MAGIE[2]],
    perso: { titre: 'Pourquoi la magie ?', paliers: [[1, 'Parce que c\'est la plus belle chose du monde !'], [4, 'Mes parents voulaient que j\'épouse un marchand de laine. J\'ai fait brûler le contrat de mariage. Par accident. Enfin… presque par accident.']] },
    aurevoir: ['À bientôt ! Et éloigne-toi de ce pot.', 'Bonne journée !'] });
F({ ev: 13, nom: 'Aldebert', role: 'vieux mage réparateur d\'objets enchantés', voix: 'grincheux, érudit, méprise les amateurs et adore son apprentie.',
    premiere: 'Aldebert. Je répare ce que les autres enchantent mal. C\'est-à-dire presque tout.',
    bonjourTous: ['Hm. Encore un client.', '~Il examine une lampe à la loupe en marmonnant.|Qu\'y a-t-il ?'],
    saisons: { 1: ['Le printemps, les enchantements s\'agitent. Comme les bêtes.'], 2: ['La chaleur fait gonfler les pierres des lampes. Elles fêlent. Je répare.'], 3: ['Les nobles arrivent avec leurs bibelots magiques cassés. Je leur facture le double. Ils ne savent pas compter la magie.'], 4: ['L\'hiver, les runes gèlent. Oui, ça existe. Non, je ne l\'expliquerai pas.'] },
    discuter: ['La magie, c\'est comme la menuiserie : il y a les artisans et les bricoleurs. Mirabelle est une bonne artisane. Ne lui répète pas.', 'Oriane fera une grande enchanteresse. Si elle survit à son apprentissage. Et moi aussi.', K.MAGIE[3]],
    nouvelles: [K.LORD[7], 'Le manoir m\'a envoyé une lampe enchantée à réparer. En or. Pour éclairer un couloir. Un COULOIR.'],
    perso: { titre: 'Votre passé ?', paliers: [[1, 'J\'ai été jeune. C\'était une erreur.'], [4, 'J\'ai enseigné à la capitale, autrefois. On m\'a renvoyé pour avoir dit à un noble qu\'il n\'avait aucun talent. Il n\'en avait aucun.']] },
    aurevoir: ['Ne casse rien en partant.', 'Hm.'] });
F({ ev: 14, nom: 'Selma', role: 'diseuse de bonne aventure (charlatane, et elle le sait)', voix: 'mystérieuse en surface, pragmatique dessous.',
    premiere: '~Elle te fixe avec intensité.|Je vois… je vois… que tu as une bourse. C\'est déjà beaucoup.',
    bonjourTous: ['Approche, voyageur…', 'Les cartes t\'attendaient.'],
    saisons: { 1: ['Le printemps, les jeunes filles viennent demander leur avenir. Je leur dis toujours « un bel inconnu ». Il y en a toujours un.'], 2: ['L\'été, je lis les lignes de la main. Elles sont plus visibles, avec le soleil.'], 3: ['L\'automne, les gens ont peur. La peur, c\'est bon pour les affaires.'], 4: ['L\'hiver, je prédis le printemps. Je ne me trompe jamais.'] },
    discuter: ['Je ne vois pas l\'avenir. Je vois les gens. C\'est plus utile.', 'Un noble m\'a demandé s\'il vivrait vieux. Je lui ai dit oui. Il m\'a payé en or. J\'espère pour lui que j\'ai raison.'],
    nouvelles: [K.LORD[7], K.LORD[1]],
    perso: { titre: 'Vous voyez vraiment ?', paliers: [[1, 'Bien sûr. Dix pièces.'], [4, 'Non. Mais parfois, je sens des choses. Une fois sur cent. Je ne sais jamais laquelle.']] },
    options: [{ titre: 'Se faire lire l\'avenir (10 G)', cmds: paye(10, cat(A.se('Magic3'), A.attendre(30), H.unParmi('Selma', ['Je vois… une route. Longue. Tu la prendras. Évidemment, tu es voyageur.', 'Je vois… quelqu\'un qui t\'attend. Ou qui ne t\'attend plus. Les cartes sont floues.', 'Je vois… une grande épreuve. Tu la surmonteras. Ou pas. Dans ce cas, tu ne reviendras pas me le reprocher.', '~Elle pâlit, et range ses cartes très vite.|Rien. Je ne vois rien. Reprends ton or.'])), P('Selma', 'L\'avenir ne se lit pas à crédit.')) }],
    aurevoir: ['Que les cartes te soient favorables.', 'Reviens… je le sais déjà.'] });
F({ ev: 15, nom: 'Hugo', role: 'crieur public : annonce les décrets du lord', voix: 'voix de stentor, solennelle, puis normale quand il cesse de crier.',
    premiere: 'OYEZ, OYEZ ! … Ah, c\'est qu\'une personne. Bonjour. Hugo, crieur. Je lis ce qu\'on me donne à lire.',
    bonjourTous: ['OYEZ ! … Pardon, l\'habitude.', 'Bonjour. Pas de décret aujourd\'hui. Pour l\'instant.'],
    saisons: { 1: ['Au printemps, on annonce les foires. Et les nouvelles taxes des foires.'], 2: ['L\'été, les décrets du lord pleuvent. Il s\'ennuie, l\'été.'], 3: ['L\'automne, on annonce les réquisitions de grain. Personne n\'applaudit.'], 4: ['L\'hiver, j\'annonce le couvre-feu. Les gens rentrent avant la fin de ma phrase.'] },
    discuter: ['Je ne fais que lire. Quand les gens me lancent des légumes, je leur rappelle que je ne fais que lire. Ils visent mieux.', 'Mon père était crieur. Il a perdu sa voix à force de crier les guerres. Moi, je crie les taxes. On progresse.'],
    nouvelles: K.LORD,
    perso: { titre: 'Le dernier décret ?', paliers: [[1, 'OYEZ ! Par ordre du lord, la taxe sur le sel est doublée pour la saison. … Voilà. Ne me frappe pas.'], [3, 'OYEZ ! Par ordre du lord, chaque charrette entrant en ville paiera un droit de passage pour la fête du lord. … Oui. Pour la fête. Non, vous n\'êtes pas invités.'], [6, '~Il baisse le parchemin.|Entre nous ? Je ne sais pas lire. On me fait apprendre par cœur. Un jour, je me tromperai, et j\'annoncerai la baisse des taxes. Pour voir.']] },
    aurevoir: ['OYEZ ! Au revoir !', 'Va en paix. Et paie tes taxes.'] });
F({ ev: 16, nom: 'Dame Véra', role: 'dame noble du manoir, fait ses emplettes', voix: 'hautaine, polie, curieuse malgré elle du peuple.',
    premiere: 'Oh. Un voyageur. Vous… vous parlez aux gens comme moi ? Comme c\'est rafraîchissant. Dame Véra. Vous pouvez me saluer.',
    bonjourTous: ['Bonjour, bonjour.', '~Elle tient un mouchoir parfumé sous son nez.|Ah, c\'est vous.'],
    saisons: { 1: ['Le printemps au manoir est d\'un ennui… On s\'y regarde dans les yeux en attendant la fête.'], 2: ['La chaleur ici est insupportable. Au manoir, on a des mages pour rafraîchir les salons.'], 3: ['L\'automne, la chasse du lord. Je déteste la chasse. J\'adore les robes de chasse.'], 4: ['L\'hiver, on joue aux cartes pendant des semaines. J\'ai perdu un collier la semaine dernière. Au jeu.'] },
    discuter: ['Le marché est si… vivant. Tout le monde crie. Au manoir, personne ne crie. On sourit en se détestant.', 'On m\'a dit que les gens d\'ici paient des taxes. Beaucoup ? … Oh. Je ne savais pas.', 'Mes gardes m\'attendent là-bas. Ils trouvent que je parle trop aux gens. Je trouve qu\'ils ne parlent pas assez.'],
    nouvelles: ['Au manoir, on attend la fête du lord. Trois semaines de préparatifs pour une soirée. Et on se plaindra du vin.', 'La baronne a encore changé de chambre. La troisième cette semaine. Elle dit que les murs la regardent. Ce sont des tableaux.'],
    perso: { titre: 'Pourquoi venir au marché ?', paliers: [[1, 'Pour acheter, voyons.'], [4, 'Pour voir des gens qui ne jouent pas un rôle. Au manoir, même les chiens font semblant.'], [7, '~Elle baisse la voix.|Ma famille veut me marier à un cousin du lord. Il collectionne les papillons morts. Je viens ici respirer avant de dire oui.']] },
    aurevoir: ['Au revoir. Ce fut… plaisant.', 'Allez. Ne dites à personne que j\'ai ri.'] });
F({ ev: 17, nom: 'Jacquot', role: 'colporteur, vend de tout et surtout n\'importe quoi', voix: 'bonimenteur, rapide, sympathique.',
    premiere: 'Jacquot, colporteur ! Rubans, aiguilles, boutons, et un clou qui a appartenu à un chevalier ! … Enfin, à son cheval.',
    bonjourTous: ['Hé ! Approche !', 'Pour toi, prix d\'ami, et j\'ai beaucoup d\'amis.'],
    saisons: K.SAISON,
    discuter: ['Je fais tous les villages. Partout pareil : on râle contre le lord et on achète des rubans.', 'Silas, du bar, me fait concurrence. Lui ment. Moi, j\'exagère. C\'est pas pareil.', K.MAGIE[4]],
    nouvelles: [K.LORD[4], K.LORD[3], K.LORD[1]],
    perso: { titre: 'Toujours sur la route ?', paliers: [[1, 'Toujours ! La route, c\'est chez moi.'], [4, 'J\'avais une échoppe, avant. Les soldats du lord l\'ont « réquisitionnée ». Maintenant c\'est leur poste de garde. Je passe devant tous les jours.']] },
    options: [{ titre: 'Voir sa marchandise', cmds: boutique([['objet', 46], ['objet', 3], ['objet', 7], ['objet', 54]]) }],
    aurevoir: ['Reviens, j\'aurai autre chose ! Ou la même chose, mais présentée autrement.', 'Salut !'] });
F(K.garde(18, 'Firmin', { role: 'garde du marché, suit la ronde tracée par JOKO', tags: ['<Vie: fixe>'], premiere: 'Garde du marché. Firmin. Ici, on vole moins qu\'ailleurs. Parce que je regarde.',
    discuter: ['Les voleurs du marché, je les connais tous. Ils me connaissent aussi. On se salue.', 'Les soldats du lord se servent chez les marchands. Moi, je n\'ai pas le droit de les arrêter. Alors je regarde ailleurs. Je déteste regarder ailleurs.'] }));
F(K.garde(19, 'Nestor', { role: 'garde du marché, suit la ronde tracée par JOKO', tags: ['<Vie: fixe>'], premiere: 'Nestor, garde. Tu achètes, tu paies, tu pars. Et tout le monde reste ami.',
    discuter: ['J\'ai attrapé un gamin qui volait des pommes. Je l\'ai relâché. Il m\'a volé ma bourse en partant. Respect.', 'Bertrand me donne une pomme par jour pour que je surveille son étal. C\'est ce qu\'on appelle un salaire, ici.'] }));
F({ ev: 20, nom: 'Madeleine', role: 'bouchère', voix: 'solide, directe, tranche la conversation comme la viande.',
    premiere: 'Madeleine, boucherie. Tu veux quoi ? Parle, j\'ai un couteau à la main et peu de patience.',
    bonjourTous: ['Quoi ?', '~Elle abat son couperet sur le billot.|Oui ?'],
    saisons: { 1: ['L\'agneau de printemps. Tendre. Les enfants pleurent. Les parents mangent.'], 2: ['L\'été, la viande tourne vite. Achète le matin.'], 3: ['L\'automne, on tue le cochon. Tout le quartier aide. Tout le quartier mange.'], 4: ['L\'hiver, le lard, le salé, les saucisses. Ça tient au corps.'] },
    discuter: ['Le manoir m\'a pris trois bœufs pour la fête du lord. Payés la moitié du prix. « L\'honneur de servir le lord. » L\'honneur ne se mange pas.', 'Mon mari est parti avec les soldats. Depuis, la boucherie, c\'est moi. Personne ne s\'en plaint. Pas devant moi.', K.DUR[3]],
    nouvelles: [K.LORD[2], K.LORD[3]],
    perso: { titre: 'Votre mari ?', paliers: [[1, 'Parti.'], [4, 'Enrôlé de force, il y a deux ans. Il écrivait. Il n\'écrit plus. Je garde son tablier accroché. Je le décrocherai pas.']] },
    options: [{ titre: 'Acheter de la viande', cmds: boutique([['objet', 45], ['objet', 46]]) }],
    aurevoir: ['Suivant !', 'Va.'] });
F({ ev: 23, nom: 'Lucien', role: 'cartographe, près de la carte du monde', voix: 'méticuleux, passionné, s\'excuse beaucoup.',
    premiere: 'Oh ! Bonjour ! Lucien, cartographe. Pardon, je mesurais l\'ombre du clocher. Pour une carte. Elles sont toutes fausses, vous savez.',
    bonjourTous: ['Bonjour ! Pardon.', '~Il déroule une carte, la regarde, la réenroule.|Bonjour.'],
    saisons: { 1: ['Au printemps, les rivières changent de lit. Mes cartes aussi.'], 2: ['L\'été, je pars relever les chemins. Je reviens avec des coups de soleil et des erreurs.'], 3: ['L\'automne, je recopie. Des nuits entières. Mes yeux s\'usent plus vite que mes plumes.'], 4: ['L\'hiver, les routes du col disparaissent sous la neige. Sur mes cartes, elles sont toujours là. Mensonge utile.'] },
    discuter: ['Une carte, c\'est un mensonge poli. On dessine ce qu\'on sait et on devine le reste.', 'Le lord m\'a commandé une carte de ses terres. Il m\'a demandé de les dessiner plus grandes.', 'Les soldats m\'ont confisqué une carte de la forêt. Pour la chasse du lord, qu\'ils disent. Je l\'avais mal dessinée. Ils vont se perdre.'],
    nouvelles: [K.LORD[4], 'On me demande souvent la route du manoir. De plus en plus de gens bien habillés. Et de charrettes de vin.'],
    perso: { titre: 'Vos voyages ?', paliers: [[1, 'Je voyage sur le papier, surtout.'], [4, 'J\'ai marché jusqu\'au bout de la carte, une fois. Là où j\'avais écrit « terres inconnues ». Il y avait un village. Ils m\'ont demandé pourquoi je les avais oubliés.']] },
    aurevoir: ['Bonne route ! Et méfiez-vous des cartes. Même des miennes.', 'Pardon. Au revoir.'] });

module.exports = { carte: 30, fiches: fiches };
