/*
 * LES VOIX DE LA BIBLE — ceux qui ne disaient rien, et trois nouveaux venus.
 * JOKO, le 2026-10-30 : « pnj si en gros inspire toi des oc et créé en avec le
 * lore fournir de la bible dans le jeu mais reste logique ». Ses habitants
 * parlent par leurs événements (« pas plugin mais événements ») : ces fiches
 * passent par le même outil, dans le même format.
 *
 * Ce qu'ils savent vient de la Bible (docs/Les-Trois-Sources-la-Bible.docx) :
 * l'Admission et ses licences, la Chancellerie, les trois guildes, la Bourse,
 * la Confrérie et son sceau, les cristaux, les failles, l'Académie Rubis, le
 * Héros. Personne ne dit où l'on est : on parle de Haute-Taville comme d'une
 * capitale lointaine. Pas de prix (le jeu compte en G, la Bible en sols).
 *
 * Les sept « cliant » à chapeau rose (le même sprite, Actor3 n° 5) sont les
 * sœurs Brémont : sept, le même chapeau cousu par leur mère pour les
 * retrouver dans la foule. Chacune parle des autres.
 *
 *   node bancs/outils/poser_les_habitants.js --seulement les_voix_de_la_bible.js --ecrire
 */
'use strict';
var K = require('./_communs.js');
var fiches = [];
function F(f) { f.muet = true; fiches.push(f); }

/* ── le magasin d'armures (42) : trois Brémont qui sortent de l'Admission ── */
F({ carte: 42, ev: 6, nom: 'Odile', tags: ['<Va: 10-12 43 5,8 ; 19-22 44 6,16>'], role: 'Brémont, recrue toute neuve, cliente d\'Hélène', voix: 'enthousiaste, vantarde, parle de sa licence comme d\'un trophée.',
    premiere: 'Odile Brémont ! Licence d\'aventurière toute neuve. Provisoire, mais neuve. Je viens choisir l\'armure de mes exploits.',
    bonjourTous: ['Tu trouves que ce plastron me grandit ?', '~Elle s\'admire dans un bouclier poli.|Oh ! Bonjour.'],
    saisons: K.SAISON,
    discuter: ['À l\'Admission, on ne cherche pas le plus fort. On regarde qui suit les consignes, et qui sait se replier. J\'ai été excellente pour me replier.',
        'Ma licence est provisoire : du rang D, toujours en équipe. Le rang D, c\'est la routine à faible risque. La routine des futures légendes.',
        'Hélène refuse de me vendre l\'armure dorée. Elle dit qu\'elle arrête les regards, pas les flèches. Justement : je veux qu\'on me regarde.'],
    nouvelles: ['Pendant la semaine d\'Admission, les trois guildes recrutent. Le Voile-Soleil paie le mieux. La Veilleuse forme le mieux. Les Crocs crient le plus fort.',
        'Prune veut entrer à la Veilleuse, parce qu\'elle prend les sauvetages que personne ne veut. Prune aime sauver les gens. Surtout de moi.'],
    perso: { titre: 'Les sœurs Brémont ?', paliers: [[1, 'On est sept. Même chapeau, même nez, même mère épuisée. Sidonie et Prune sont ici avec moi.'],
        [4, 'Maman voulait des couturières. On a passé l\'Admission à trois le même jour. Elle a cousu nos chapeaux pour nous retrouver dans la foule.']] },
    aurevoir: ['Retiens bien mon nom : Odile Brémont. Tu le liras sur les affiches.', 'À plus ! Et dis à Hélène que l\'or, c\'est solide.'] });
F({ carte: 42, ev: 7, nom: 'Sidonie', tags: ['<Va: 10-12 43 9,8 ; 19-22 44 8,16>'], role: 'Brémont, recrue, a lu tout le règlement', voix: 'posée, pointilleuse, cite les règles de la Chancellerie par cœur.',
    premiere: 'Sidonie Brémont. Oui, la sœur d\'Odile. Non, je ne prendrai pas l\'armure dorée. Je prends celle qui couvre les reins.',
    bonjourTous: ['Bonjour. Tu as lu le livret de la Chancellerie ? Non ? Évidemment.', '~Elle vérifie les sangles d\'un plastron, une par une.|Bonjour.'],
    saisons: K.SAISON,
    discuter: ['Règle de la Chancellerie : chaque faille demande son propre permis. Arriver le premier ne donne aucun droit. Odile n\'a pas lu ce paragraphe.',
        'Une arme de rang A ne fait pas de toi une aventurière de rang A. C\'est écrit en gras dans le livret. Je l\'ai souligné aussi.',
        'Dans une faille, on pose des points de retour à mesure qu\'on avance. Une balise, c\'est un retour, pas une téléportation. Les gens confondent, et marchent longtemps.'],
    nouvelles: ['La Chancellerie cherche des évaluateurs. On y entre par concours, pas par le rang. J\'y pense sérieusement.',
        'Un aventurier bien préparé exploite une faiblesse précise. Le courage seul ne suffit pas. Je le répète à Odile tous les matins.'],
    aurevoir: ['Serre tes sangles. Vérifie-les deux fois.', 'Bonne route. Et lis le règlement.'] });
F({ carte: 42, ev: 8, nom: 'Prune', tags: ['<Va: 10-12 43 6,12 ; 19-22 44 9,15>'], role: 'Brémont, la plus jeune, recalée de l\'Admission', voix: 'joyeuse, généreuse, jamais découragée.',
    premiere: 'Prune ! La petite des sept. J\'ai raté l\'Admission, mais rien n\'est perdu : un échec, ça mène à une formation complémentaire.',
    bonjourTous: ['Coucou !', '~Elle essaie un casque trois tailles trop grand.|Coucou ! Je vois rien, mais coucou !'],
    saisons: K.SAISON,
    discuter: ['Au Champ d\'Épreuve, il fallait se replier. Moi, je suis retournée chercher le mannequin blessé. Ils ont dit que c\'était touchant. Et faux.',
        'À la Veilleuse, chaque capitaine prend quelques recrues sous son aile. Je veux une aile. Une grande.',
        'Hélène m\'a vendu un casque. Elle m\'a dit : je te protège la tête, toi tu protèges le reste. Moi, je protège surtout mes sœurs.'],
    nouvelles: ['On dit qu\'une rôdeuse de la Veilleuse dessine la carte de chaque région autour de la capitale. Je voudrais porter ses cartes. Même lourdes.'],
    aurevoir: ['Reviens entier ! Comme dit Hélène.', 'Salut ! Et si tu croises Odile, ne lui fais pas de compliment.'] });

/* ── le magasin d'objets (43) : trois Brémont qui font les sacs ─────────── */
F({ carte: 43, ev: 4, nom: 'Agathe', tags: ['<Va: 14-16 42 6,10 ; 19-22 44 6,14>'], role: 'Brémont, fait le sac d\'expédition de ses sœurs', voix: 'méthodique, coche des listes à voix haute.',
    premiere: 'Agathe Brémont, la troisième. Je fais le sac d\'expédition de mes sœurs. Corde, trousse, balise. Elles, elles font les exploits.',
    bonjourTous: ['Bonjour. Corde : oui. Trousse : oui. Toi : bonjour.', '~Elle coche une liste longue comme le bras.|Hm ? Bonjour.'],
    saisons: K.SAISON,
    discuter: ['Le sac d\'une recrue : une trousse de soins d\'urgence, de quoi recharger ses cristaux, une corde. Pascaline dit qu\'on prend toujours une corde.',
        'Soigner, ce n\'est pas réparer. Une trousse arrête un saignement ; elle ne recoud pas un nerf. Alors on prend la trousse, et on ne fait pas de bêtises.',
        'Les cristaux de mana font tourner les lanternes, les barrières, les outils. Et ils se rechargent. Et la recharge, elle se paie.'],
    nouvelles: ['Ce qu\'on rapporte des failles fait tourner tout le pays : des braises d\'âme, des cristaux, des matériaux vivants. Et des courbatures.'],
    aurevoir: ['N\'oublie pas ta corde.', 'Liste faite, sac fermé. À la prochaine.'] });
F({ carte: 43, ev: 6, nom: 'Rosalie', tags: ['<Va: 14-16 42 8,10 ; 19-22 44 8,14>'], role: 'Brémont, admiratrice du Héros', voix: 'rêveuse, exaltée, raconte les exploits comme si elle y était.',
    premiere: 'Rosalie, la cinquième Brémont ! Tu as entendu parler du Héros ? Donovano ? Celui du Quartier Noyé ?',
    bonjourTous: ['Bonjour ! Tu ressembles un peu à un héros. Un tout petit peu.', '~Elle serre contre elle une affiche roulée.|Oh, bonjour !'],
    saisons: K.SAISON,
    discuter: ['Quand la faille du Quartier Noyé a cédé, à Haute-Taville, il l\'a détruite à lui seul. Seul ! Aucun autre aventurier vivant n\'a fait ça.',
        'Personne ne sait d\'où il vient : il est sorti de nulle part. Moi aussi, je sors de nulle part. Enfin, de chez maman.',
        'Il n\'est ni capitaine ni noble, et il n\'est d\'aucune guilde. Le genre de personne qui n\'a pas besoin d\'affiche. Moi, j\'en ai trois.'],
    nouvelles: ['Le public connaît les exploits, pas les techniques. Alors j\'invente les techniques. Dans ma tête, il fait des saltos.'],
    aurevoir: ['Si tu le croises, dis-lui que Rosalie le salue !', 'À bientôt ! Vive le Héros !'] });
F({ carte: 43, ev: 7, nom: 'Capucine', tags: ['<Va: 14-16 42 11,10 ; 19-22 44 5,15>'], role: 'Brémont, vient faire recharger la lanterne familiale', voix: 'râleuse, pratique, l\'humour sec.',
    premiere: 'Capucine. Brémont, oui, la sixième. Ne me demande pas laquelle des sept est l\'aînée : on se dispute encore.',
    bonjourTous: ['Bonjour. Tu viens recharger quelque chose, toi aussi ?', '~Elle secoue une lanterne qui grésille.|Elle fatigue. Comme moi.'],
    saisons: K.SAISON,
    discuter: ['Une maison modeste n\'a qu\'une lanterne à cristal. La nôtre éclaire sept chapeaux. Elle fatigue.',
        'Les cristaux stellaires du Chapitre 2 rendent plus, et coûtent plus. J\'en ai rêvé une fois. Il coûtait cher, même en rêve.',
        'Près d\'une faille, les gens dorment mal, et ils ont des humeurs qui ne sont pas les leurs. Odile n\'a pas d\'excuse : elle est comme ça.'],
    nouvelles: ['L\'hiver, la Confrérie des Reliquaires tient sa grande vente. Des reliques avec leur sceau. Les faux sceaux, eux, se vendent toute l\'année.'],
    aurevoir: ['Ferme la porte, tu fais entrer le froid.', 'Salut. Si tu vois une lanterne pas chère, c\'est un piège.'] });

/* ── l'auberge (44) : la septième Brémont, une messagère, une élève de Rubis ── */
F({ carte: 44, ev: 14, nom: 'Bérénice', tags: ['<Va: 22-8 45 11,10>'], role: 'l\'aînée des Brémont, cachée à l\'auberge', voix: 'lasse, ironique, tendre avec ses sœurs.',
    premiere: 'Chut. Je suis Bérénice, l\'aînée des Brémont. Si tu croises une fille avec ce chapeau, tu ne m\'as pas vue.',
    bonjourTous: ['Chut.', '~Elle a posé son chapeau sous la table.|Tu ne m\'as pas vue.'],
    saisons: K.SAISON,
    discuter: ['Six sœurs, une licence provisoire, trois guildes à visiter et une seule chambre libre à l\'auberge. Je prends la chambre.',
        'Maman a cousu nos chapeaux pour qu\'on se retrouve dans la foule. Le problème, c\'est qu\'on se retrouve toujours.',
        'Moi, je n\'ai pas passé l\'Admission. Personne n\'est obligé de partir en expédition : c\'est dans la loi. Je l\'ai encadrée.'],
    nouvelles: ['Odile veut l\'armure dorée, Sidonie a lu le règlement, Prune veut sauver tout le monde, Agathe fait les sacs, Rosalie aime le Héros, Capucine râle. Et moi, je dors.'],
    aurevoir: ['Tu ne m\'as pas vue.', 'Bonne nuit. Même si c\'est le matin.'] });
F({ carte: 44, ev: 13, nom: 'Léonie', tags: ['<Va: 6-18 49 1/3 2j ; 22-6 45 3,10>'], role: 'messagère des routes royales', voix: 'rapide, toujours pressée, sait tout ce qui se dit sur la route.',
    premiere: 'Léonie, messagère. Je porte les lettres d\'un relais à l\'autre. Si tu en as une, j\'en ai déjà quarante : une de plus ne pèse rien.',
    bonjourTous: ['Salut ! Je repars dans une heure. Peut-être deux.', '~Elle trie des lettres en trois piles.|Salut !'],
    saisons: K.SAISON,
    discuter: ['Les routes royales relient les capitales. On change de chevaux aux relais, et les relais font auberge. Je dors plus ici que chez moi.',
        'Les plus riches s\'écrivent sur des parchemins jumeaux : ce qu\'on écrit sur l\'un apparaît sur l\'autre, tant que l\'encre tient. Moi, je suis le parchemin des autres.',
        'Je ne lis pas les lettres que je porte. Mais je reconnais les lettres d\'amour : elles sont toujours trop épaisses.'],
    nouvelles: ['Au début de chaque saison, la Chancellerie ouvre une Admission. Tout le monde écrit chez soi : « j\'ai réussi », ou « je recommence ». Les deux pèsent pareil.',
        'Les navires d\'Ilmarée longent les côtes de l\'est. Leurs messagers vont plus vite que moi. Je ne leur parle plus.'],
    aurevoir: ['J\'ai une lettre en retard. Elles le sont toutes.', 'Bonne route ! Et écris à tes parents.'] });
F({ carte: 44, ev: 15, nom: 'Ysaline', tags: ['<Va: 22-7 45 11,10>'], role: 'élève de cinquième année de l\'Académie Rubis, rentrée pour la saison', voix: 'vive, un peu fière, se moque d\'elle-même.',
    premiere: 'Ysaline, cinquième année à l\'Académie Rubis. Je rentre chez moi pour la saison. Enfin, je rentre lentement.',
    bonjourTous: ['Salut ! Tu n\'aurais pas vu passer une sixième année ? Non ? Tant mieux.', '~Elle révise un grimoire, la langue entre les dents.|Hm ? Salut.'],
    saisons: K.SAISON,
    discuter: ['Au-dessus des portes de l\'académie : « Le pouvoir se gagne. Le nom se forge. Le mana est vivant. » On la récite avant les examens. Ça n\'aide pas.',
        'Cette année, j\'ai fait ma première Descente dans la Faille Captive. Une course, au temps ou à la profondeur. J\'ai choisi le temps : remonter vite.',
        'Le classement compte aussi l\'éthique. Gagner en cassant tout autour, ça fait reculer. Brynja Holt casse très peu. Elle n\'en a pas besoin.',
        'En sixième, il y a Félix Aubrac. Il retient le prénom de tout le monde. Il a retenu le mien. Je ne m\'en remets pas.'],
    nouvelles: ['À l\'académie, on nous paie en jetons de cristal. Ils ne valent qu\'en Basse-Brume, au pied des falaises. Ici, on me les refuse avec un sourire.',
        'La nuit, les six tours de l\'académie luisent d\'un rouge sourd : c\'est de là que vient le nom. Ici, la nuit est noire. Je dors mieux.'],
    perso: { titre: 'L\'académie ?', paliers: [[1, 'Des héritiers nobles, des prodiges roturiers, et tout ce qu\'il y a entre les deux. Moi, je suis entre les deux.'],
        [4, 'Un duel de rubis, c\'est sérieux : on salue, on se bat, on se relève, on se resalue. J\'ai perdu les trois derniers. Je salue très bien.']] },
    aurevoir: ['Le mana est vivant. Moi, je suis fatiguée.', 'Bonne route ! Et ne provoque jamais une sixième année en duel.'] });

/* ── la Forêt (31) : deux gardes de la route ─────────────────────────────── */
var VEILLE = { 1: ['Le matin, la forêt est calme. Ça ne veut rien dire.'], 2: ['Rien à signaler. Je le note quand même.'], 3: ['Le soir, les bêtes sortent. Nous, on reste.'], 4: ['La nuit, on garde la lanterne basse et l\'oreille haute.'] };
F({ carte: 31, ev: 15, nom: 'Anselme', tags: ['<Ronde: 11,26 ; 11,20 ; 11,13 ; 11,20>'], role: 'vieux garde de la route', voix: 'calme, récite les règlements comme des proverbes.', meteo: K.METEO.garde,
    premiere: 'Garde Anselme, patrouille de la route. On surveille la forêt. La forêt, elle, nous surveille aussi.',
    bonjour: VEILLE, bonjourTous: ['Halte. … Bon, passe.'],
    saisons: K.SAISON,
    blesse: 'Tu saignes. La ville est au bout du chemin : va voir quelqu\'un avant de tomber dans mon sentier.',
    discuter: ['Deux règles que chaque garde apprend par cœur. Un : tuer les créatures sorties ne referme pas une faille. Deux : la refermer ne fait pas disparaître celles qui sont sorties.',
        'Les loups, les araignées géantes, les sangliers : des bêtes ordinaires. Elles n\'ont jamais vu de faille. Elles mordent quand même.',
        'Bastien sursaute à chaque feuille. Je lui dis qu\'un garde qui ne sursaute jamais, c\'est un garde qui n\'a rien entendu.'],
    nouvelles: ['Quand une Chute arrive, c\'est la garde royale qui tient les routes et fait évacuer. Les aventuriers, eux, entrent détruire le Nœud. Chacun son métier.'],
    aurevoir: ['Reste sur le chemin.', 'Bonne route. Et regarde où tu marches.'] });
F({ carte: 31, ev: 16, nom: 'Bastien', tags: ['<Ronde: 15,26 ; 14,23 ; 10,23 ; 14,23>'], role: 'jeune garde de la route', voix: 'nerveux, bavard, plein de bonne volonté.', meteo: K.METEO.garde,
    premiere: 'Bastien. Garde. Débutant. Si tu entends un bruit dans les fourrés, c\'est sûrement un lapin. Sûrement.',
    bonjour: VEILLE, bonjourTous: ['Ah ! … Ah, c\'est toi. Bonjour.'],
    saisons: K.SAISON,
    discuter: ['Une faille peut s\'ouvrir dans un bâtiment, une grotte, une forêt, en plein champ. En plein champ ! Depuis, je regarde où je marche.',
        'Anselme dit que je sursaute trop. Moi, je dis qu\'il ne sursaute pas assez. On fait une bonne équipe.'],
    nouvelles: ['Les élèves de l\'Académie Rubis partent pour leur première faille encadrés par la garde royale. La garde royale ! Moi, j\'encadre ce sentier.'],
    aurevoir: ['Fais attention aux lapins.', 'Bonne route ! Enfin, prudente.'] });

/* ── trois nouveaux venus ─────────────────────────────────────────────────── */
F({ carte: 29, ev: 53, nom: 'Mathurin', tags: ['<Vie: sedentaire>'], role: 'crieur des nouvelles, au réverbère de la grand-rue', voix: 'tonitruant, théâtral, ne sait pas parler bas.',
    premiere: 'Oyez, oyez ! Mathurin, crieur ! Ce que le royaume sait, je le crie. Ce qu\'il ne sait pas, je le crie plus fort.',
    bonjourTous: ['OYEZ ! … Ah, c\'est toi. Oyez quand même.', '~Il s\'éclaircit la voix, très longuement.|Oyez !'],
    saisons: { 1: ['Le printemps s\'ouvre sur une Admission ! Licences neuves, guildes qui recrutent, et des recrues qui se croient déjà rang S !'],
        2: ['L\'été, l\'Admission recommence ! À chaque saison la sienne ! Tu as raté la dernière ? Il y en a une autre. Oyez !'],
        3: ['L\'automne, une Admission de plus ! Les recalés recommencent, les licenciés repartent, et moi je crie !'],
        4: ['L\'hiver, la Confrérie des Reliquaires tient sa Vente d\'Hiver ! Des reliques avec leur sceau ! Le sceau, c\'est une inspection, pas une garantie !'] },
    discuter: ['Le Jour du Serment Brisé, on fait la fête de la Reine Pure en Isembre, on porte le deuil à la Sainte-Veille. Ici, on se contente d\'y penser ! PENSEZ-Y !',
        'La nuit où, dit-on, le Premier a disparu, la Basse-Brume de Haute-Taville tient un marché de nuit ! La Veillée du Retour ! On y voit des choses étranges !',
        'Un crieur, ça crie. Un crieur qui chuchote, c\'est un espion. Je ne suis pas un espion. JE SUIS UN CRIEUR !'],
    nouvelles: ['À l\'Académie Rubis, la Descente dans la Faille Captive ! Une course, au temps ou à la profondeur ! Les élèves remontent, et ils sont fiers !',
        'Le Héros, Donovano, n\'est d\'aucune guilde ! Aucune ! Les guildes en pleurent, paraît-il ! Oyez !',
        'Avis de la Chancellerie : chaque faille demande son propre permis ! Arriver le premier ne donne aucun droit ! Fin de l\'avis !'],
    aurevoir: ['Va, et répète ce que je t\'ai dit !', 'OYEZ ! … Au revoir.'] });
F({ carte: 30, ev: 26, nom: 'Fanchon', tags: ['<Logis: 45 3,10>'], role: 'recruteuse de la Veilleuse', voix: 'chaleureuse, franche, fière de sa lanterne.',
    premiere: 'Fanchon, de la Veilleuse : tu vois la lanterne brodée ? C\'est nous. On cherche des recrues qui veulent apprendre. Et rentrer vivantes.',
    bonjourTous: ['Bonjour ! Tu as l\'air de quelqu\'un qui aime être formé.', '~Elle époussette la lanterne brodée de sa cape.|Bonjour !'],
    saisons: K.SAISON,
    discuter: ['À la Veilleuse, on entre en acceptant d\'être formé, et de former à son tour. Chaque capitaine prend quelques recrues sous son aile.',
        'Nous, on prend les sauvetages que les autres refusent. Ça paie moins que le Voile-Soleil. Mais chacun des nôtres rentre chez lui.',
        'La guilde garde en commun le Glas, une relique de sauvetage. On espère toujours ne pas avoir à le sonner.'],
    nouvelles: ['Le Voile-Soleil recrute les plus prometteurs, et les paie le mieux. Les Crocs prennent tout le monde, facilement. C\'est y rester qui est difficile.',
        'Si tu n\'as pas de guilde, la Bourse des Lames Franches a des contrats pour les indépendants. Avec une licence, et la promesse de respecter ses arbitrages.'],
    aurevoir: ['Que ta lanterne ne s\'éteigne pas.', 'Reviens nous voir. Et rentre vivant.'] });
F({ carte: 33, ev: 43, nom: 'Gustave', tags: ['<Logis: 45 11,10>'], role: 'Essayeur de la Confrérie des Reliquaires, en tournée', voix: 'précis, cérémonieux, très patient avec les gens pressés.',
    premiere: 'Gustave, Essayeur de la Confrérie des Reliquaires. Un pêcheur a remonté une relique dans ses filets. Je viens l\'inspecter.',
    bonjourTous: ['Bonjour. Vous n\'avez rien trouvé dans vos filets, vous ?', '~Il polit une loupe avec un soin infini.|Bonjour.'],
    saisons: K.SAISON,
    discuter: ['Le sceau de la Confrérie consigne le fabricant, le rang, la provenance, l\'entretien et les limites d\'une relique. C\'est une inspection dont quelqu\'un répond. Pas une garantie.',
        'La relique du pêcheur ? Je l\'ai inspectée avec la plus grande rigueur. C\'est une casserole. Une belle casserole. Sans sceau.',
        'Deux siècles, c\'est peu pour des matériaux venus d\'un autre monde. Nous apprenons encore. Lentement, et avec des gants.'],
    nouvelles: ['Les faux sceaux sont un commerce tenace. Si un sceau a l\'air trop neuf pour la relique, c\'est que la relique est plus vieille que son honnêteté.'],
    aurevoir: ['Ne réparez jamais une relique vous-même.', 'Au revoir. Et méfiez-vous des casseroles brillantes.'] });

module.exports = { carte: 29, fiches: fiches };
