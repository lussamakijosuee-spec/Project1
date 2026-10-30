/*
 * LA SITUATION — en Aurevel, à la campagne, avec une faille à côté.
 * JOKO, le 2026-10-30 : « Ça se passe dans le royaume de Aurevel dans les
 * campagnes avec une faille à côté (c'est la zone grotte modifiée que j'ai
 * fait), utilise le lore pour la situation ».
 *
 * La faille est dans la Caverne de Pierre (carte 28) : de la grotte, on
 * traverse le Marécage (49) et la Forêt (31) jusqu'à la Ville Forestière (29),
 * puis le Marché (30) et le Village de Pêche (33). Ce que les habitants en
 * disent vient de la Bible, rien de plus :
 *   Aurevel : « Châteaux de pierre, terres agricoles fertiles, rivières, forêts
 *     et villes fortifiées », « Prospère, ordonnée, très politique et très
 *     patrouillée », « des terres agricoles qui nourrissent la moitié du
 *     continent », « Il exploite tout ce qu'il peut, encadré par la loi » ;
 *     Lothaire de Valcourt, après la famine du roi Thibaut ; l'Église du
 *     Retour « accepte les expéditions » ; la capitale, Haute-Taville.
 *   La faille : « Une faille est une porte […] Elle peut s'ouvrir dans un
 *     bâtiment, une grotte », « ce qui se trouve derrière n'a rien à voir avec
 *     la taille de l'entrée » ; le signalement, l'évaluation, le permis, les
 *     points de retour ; la Chute et les deux règles « que chaque garde
 *     apprend par cœur » ; ce qu'on en rapporte ; l'imprégnation : « Ceux qui
 *     vivent près d'une faille […] des nuits agitées, des humeurs qui ne sont
 *     pas les leurs » ; les Égarés ; la garde royale qui forme les élèves.
 * Ni le niveau de la faille, ni son rang, ni d'où vient le héros : c'est à
 * JOKO de le dire.
 *
 * Une entrée « carte:événement » : ses lignes s'AJOUTENT à la fiche (à
 * « Quoi de neuf ? » pour « nouvelles », à ce qu'il dit selon le lieu pour
 * « lieux »). Rien n'est retiré.
 */
'use strict';
module.exports = {
/* ── la Ville Forestière, la plus proche de la forêt ─────────────────── */
'29:11': { nouvelles: ['Par cette porte, la forêt. Après la forêt, le marécage. Après le marécage, la grotte. Et dans la grotte, la faille. Ceux qui ont un permis, je les compte deux fois : à l\'aller, et au retour.'] },  // Brunehaut
'29:12': { nouvelles: ['La garde royale passe surveiller la grotte. Elle a de meilleurs uniformes que nous. Elle garde une faille. Moi, une porte. Je suis jaloux, mais je dors mieux.'] },  // Oswin
'29:33': { nouvelles: ['D\'ici, par temps clair, on voit la forêt jusqu\'au marécage. Les nuits sans lune, il y a une lueur, du côté de la grotte. Je la note. Je la regarde. Je ne l\'aime pas.'] },  // Mathis
'29:34': { nouvelles: ['On a appris les deux règles par cœur. Un : tuer ce qui sort d\'une faille ne la referme pas. Deux : la refermer ne fait pas disparaître ce qui est sorti. Trois : on mange avant. Ça, c\'est ma règle.'] },  // Rolf
'29:35': { nouvelles: ['~Il regarde vers la forêt, longtemps.|La grotte. … On veille.'] },  // Konrad
'29:36': { nouvelles: ['J\'ai servi sous le roi Thibaut. La famine. Puis la révolution, et Lothaire. Depuis, Aurevel mange. On a une faille au bout du marécage et des champs plein la vue. On mange, et on surveille.'] },  // Béran
'29:29': { nouvelles: ['Quand le vent vient de la grotte, je dors mal, et je me réveille de mauvaise humeur. Une humeur qui n\'est pas la mienne. L\'imprégnation, ils appellent ça. Moi j\'appelle ça le vent de l\'est.', 'J\'ai connu le temps du roi Thibaut. On avait faim. Aujourd\'hui, on râle contre les taxes du lord. C\'est mieux, d\'avoir assez à manger pour râler.'] },  // Fernand
'29:41': { nouvelles: ['Les draps que j\'étends côté forêt sentent bizarre, certains jours. Fernand dit que c\'est le vent de la grotte. Moi je dis que c\'est le marécage. On a sûrement raison tous les deux.'] },  // Mado
'29:28': { nouvelles: ['Ceux qui vont vers la grotte achètent tous une corde. Dans une faille, on pose des points de retour à mesure qu\'on avance. Une corde, c\'est le premier point de retour. Je dis toujours de prendre une corde.'] },  // Hilde
'29:40': { nouvelles: ['La grotte. Les petits n\'y vont pas. … Toi, si tu y vas, prends deux cordes. Et reviens.'] },  // Kaze
'29:25': { nouvelles: ['Il y a une faille dans la grotte ! Une VRAIE ! Papa dit qu\'il faut un permis de la Chancellerie. Je vais demander un permis. J\'ai neuf ans, mais j\'écris bien.'] },  // Élise
'29:26': { nouvelles: ['Il y a une faille dans la grotte, après le marécage. Je n\'irai jamais. Élise, si. Alors j\'irai aussi, pour la ramener. Mais pas maintenant. Plus tard. Beaucoup plus tard.'] },  // Tomas
'29:38': { nouvelles: ['La faille de la grotte. Une porte. Ce qu\'il y a derrière n\'a rien à voir avec la taille de l\'entrée. … C\'est la seule équation que je n\'aime pas : elle n\'a pas de fin.'] },  // Colette
'29:39': { nouvelles: ['La lampe de la porte nord regarde la forêt. Je la fais briller un peu plus fort que les autres. Pour ceux qui reviennent du marécage, de nuit. Qu\'ils voient la ville avant de la toucher.'] },  // Tobias
'29:42': { nouvelles: ['J\'ai taillé la pierre de toute la région. La grotte, au bout du marécage, je n\'y suis jamais entré. Il y a une faille, dedans. Ça, ce n\'est pas une pierre que je sais tailler.'] },  // Pépin
'29:53': { nouvelles: ['OYEZ ! Avis de la Chancellerie des Failles ! La faille de la grotte ne s\'entre qu\'avec un permis ! Arriver le premier ne donne aucun droit ! Le crier non plus, j\'ai essayé !', 'OYEZ ! Le roi Lothaire veille sur Aurevel, la Chancellerie veille sur les failles, la garde royale veille sur les routes ! Et moi, je veille sur les nouvelles !'] },  // Mathurin
'29:59': { nouvelles: ['Grand-père Hector dit que la faille de la grotte, c\'est une porte vers un autre monde. Grand-mère Maude dit que c\'est une porte vers les ennuis. Moi je dis : les deux. Je gagne toujours.'] },  // Petit-Louis
'29:60': { nouvelles: ['Nous sommes ici avec la garde royale. Elle forme les élèves aux expéditions. Nous, quatrième année, on patrouille autour, et on regarde la faille de loin. Je note de loin.'] },  // Anouk
'29:61': { nouvelles: ['Ce qu\'on rapporte des failles fait tourner tout le pays : des braises d\'âme, des cristaux, des matériaux vivants. Si quelqu\'un rapporte quelque chose de la grotte, apportez-le-moi. Je veux le renifler.'] },  // Évariste
'29:62': { nouvelles: ['Une faille au bout du marécage, et la nuit de la Veillée en plus. Les gens d\'ici achètent deux fois plus de lumières que ceux de la capitale. Je les comprends.'] },  // Zéphyrin
/* ── le bar ───────────────────────────────────────────────────────────── */
'46:52': { nouvelles: ['Ici, avec une faille au bout du marécage, les gens ne veulent pas le conte de l\'ouverture du Livre. Ils veulent celui du Premier. Celui qui finit bien.'] },  // Barthélemy
'46:14': { nouvelles: ['Tu sais pas la meilleure ? La Chancellerie envoie quelqu\'un pour la grotte. Un évaluateur. Ou deux. Ou une armée. Je ne sais plus. Mais il vient, c\'est sûr. Enfin, presque.'] },  // Mireille
'46:27': { nouvelles: ['Ceux qui reviennent de la grotte, je les reconnais. Ils commandent la soupe avant la bière. Ils ont froid, de l\'intérieur. Je leur sers les deux, mon grand.'] },  // Margot
'46:13': { nouvelles: ['Une faille, c\'est une porte. Ce qu\'il y a derrière n\'a rien à voir avec la taille de l\'entrée. Celle de la grotte est petite. Ne te fie pas à ça.'] },  // Le vieux
'46:19': { nouvelles: ['La grotte ? J\'y suis allé. Enfin, jusqu\'à l\'entrée. Enfin, jusqu\'au marécage. C\'est déjà beaucoup, le marécage. Il y avait un crapaud. Rang B, au moins.'] },  // Garrec
'46:18': { nouvelles: ['Il y a une FAILLE dans la grotte ! Ce qu\'on rapporte des failles, ça se forge ! Papa dit qu\'il faut le sceau de la Confrérie avant d\'y toucher. Moi je veux juste en VOIR un.'] },  // Lise
'41:3': { nouvelles: ['Les matériaux des failles se forgent mal quand on ne sait pas ce que c\'est. Si un jour on me rapporte quelque chose de la grotte, je veux le sceau de la Confrérie avec. Et je veux savoir d\'où il vient.'] },  // Gaudry
'46:31': { nouvelles: ['Un élixir contre l\'imprégnation, très cher ? Pour dormir comme un enfant à côté d\'une faille ! … C\'est de la camomille. Mais de la très bonne camomille.'] },  // Silas
'46:38': { nouvelles: ['Quand une faille est à côté, les Égarés viennent : rackets, vols de cristaux, bagarres. Rien de bien méchant, mais tiens ta bourse. Moi, je tiens la tienne. Pour te la rendre.'] },  // Nell
'46:37': { nouvelles: ['Ceux qui rentrent du marécage, je les nourris d\'abord. On parle après. Une faille, ça creuse l\'estomac. Mange.'] },  // Berthe
'46:17': { nouvelles: ['De mon temps, il n\'y avait pas de faille dans la grotte. … Si. Il y en avait sûrement une. Mais personne ne le savait. C\'était mieux.'] },  // Odon
'46:32': { nouvelles: ['J\'écris beaucoup de lettres, avec la faille à côté. « Je vais bien, ne t\'inquiète pas, je rentre bientôt. » Ceux qui partent vers la grotte écrivent tous la même. Je la connais par cœur.'] },  // Jehan
'46:36': { nouvelles: ['DERNIÈRE NOUVELLE ! Un monstre est sorti de la grotte ! … Non. Mais il POURRAIT. Une pièce, et je te dis lequel.'] },  // Théo
'46:30': { nouvelles: ['Le règlement, en cas de Chute : évacuer les habitants, tenir les routes, attendre l\'équipe qui ira détruire le Nœud. Je l\'ai appris par cœur. J\'espère ne jamais m\'en servir.'] },  // Casimir
'46:29': { nouvelles: ['La nuit, les chiens aboient vers la forêt. Vers la grotte. Ils sentent quelque chose. Moi aussi : la fatigue.'] },  // Merle
'46:26': { nouvelles: ['Les jours où le vent vient de la grotte, le lac est plat. Plat. Pas un poisson. Tobin dit que c\'est l\'imprégnation. Tobin dit n\'importe quoi. … C\'est l\'imprégnation.'] },  // Roul
/* ── le Marché ────────────────────────────────────────────────────────── */
'30:26': { nouvelles: ['La Veilleuse prend les missions de sauvetage que les autres refusent. Avec une faille au bout du marécage, il en faut, des gens qui retournent chercher les autres. C\'est écrit sur la lanterne.'] },  // Fanchon
'30:6': { nouvelles: ['Aurevel nourrit la moitié du continent ! Et cette moitié mange MES carottes ! Faille ou pas faille, les radis poussent !'] },  // Bertrand
'30:7': { nouvelles: ['Les cristaux viennent des failles, ou d\'Ilmarée qui les revend à tout le monde. Moi, je les recharge. Avec une faille à côté, tout le monde veut sa lanterne pleine. J\'ai du travail !'] },  // Mirabelle
'30:17': { nouvelles: ['Une amulette contre les Chutes ! … Non. Ça n\'existe pas. Mais elle est jolie, ET CE N\'EST PAS TOUT !'] },  // Jacquot
'30:11': { nouvelles: ['Chez moi, on dit : « Qui vit près d\'une porte apprend à écouter. » Ici, vous vivez près d\'une faille. Vous écoutez très bien le vent.'] },  // Tian
'30:23': { nouvelles: ['Ma carte s\'arrête à la grotte. Au-delà, c\'est une faille : une porte vers une région d\'un des Chapitres. Je ne dessine pas ce qui change. Je dessine jusqu\'à la porte, et je m\'excuse.'] },  // Lucien
'30:14': { nouvelles: ['~Elle ferme les yeux.|Je vois… je vois que personne n\'entrera dans la grotte sans permis. … Celle-là, je ne la vends pas. Elle est trop facile.'] },  // Selma
'30:30': { nouvelles: ['Le tableau de la Bourse a des contrats pour la grotte : escortes, portage jusqu\'au marécage. Le dépôt est cher. Moi, je porte les permis. C\'est lourd, pour du papier.'] },  // Ninon
'30:28': { nouvelles: ['La garde royale nous apprend les points de retour : dans une faille, on en pose à mesure qu\'on avance. Je suis très bon pour les poser. Moins pour les retrouver.'] },  // Timothée
'30:15': { nouvelles: ['Ceux qui reviennent du marécage perdent TOUT ! Des gants, des boussoles, une chaussure ! Je retrouve tout ! Sauf leur courage : ça, ils le gardent.'] },  // jeck
'30:18': { nouvelles: ['Avec la faille à côté, le Marché est plus nerveux. Les gens se disputent pour une courge comme si c\'était la dernière. Je fais semblant de siffler. Ça les calme.'] },  // Firmin
/* ── le Village de Pêche, le plus loin de la grotte ──────────────────── */
'33:24': { nouvelles: ['Edwin dit que le vent de la grotte porte un mana qui n\'est pas d\'ici. Moi je dis que le vent de la grotte porte surtout de la boue. On a raison tous les deux, mais moi je lave.'] },  // Annick
'33:22': { nouvelles: ['Mes lunettes voient le mana : sa source, et la forme qu\'il va prendre. Certains jours, le vent qui vient de la grotte porte un mana qui ne vient pas de ce monde-ci. Je l\'ai noté. Trois fois.'] },  // Edwin
'33:18': { nouvelles: ['Une faille au bout du marécage, et des villages de pêcheurs de ce côté. Si elle cède un jour, je serai là. Je ne le dis pas pour être aimable.'] },  // Emma
'33:23': { nouvelles: ['De mon temps, une faille, on la gardait avec vingt hommes et un tambour ! Aujourd\'hui, il faut un permis de la Chancellerie. … Le tambour, c\'était moi.'] },  // Régis
'33:16': { nouvelles: ['La garde surveille le chemin du marécage. Papa dit que les poissons sentent la faille : ils mordent moins quand le vent vient de là-bas.'] },  // Jonas
'33:19': { nouvelles: ['Il paraît qu\'il y a une faille dans la grotte ! Edwin dit que c\'est une porte vers un autre monde. Je veux y trouver des coquillages d\'un autre monde ! Maman dit non.'] },  // Sora
'33:43': { nouvelles: ['Avec une faille dans la région, je verrai passer des matériaux d\'un autre monde. Qu\'on me les apporte avant de les forger. Le sceau de la Confrérie, c\'est la preuve qu\'un Essayeur en répond.'] },  // Gustave (l'Essayeur)
'33:45': { nouvelles: ['La faille est dans la grotte, de l\'autre côté du marécage et de la forêt. Edwin dit que c\'est bien trop loin pour l\'imprégnation. Moi je dis que le vent tourne.'] },  // Solange
/* ── l'auberge et la route ────────────────────────────────────────────── */
'44:10': { nouvelles: ['Avec la faille à côté, les aventuriers m\'achètent de la laine pour les nuits dans le marécage. Un bon marécage, c\'est bon pour les affaires.'] },  // Gaspard
'44:13': { nouvelles: ['Sur les routes royales, on dit qu\'Aurevel exploite tout ce qu\'il peut. Ici, vous avez une faille, des champs et un lac. Vous exploitez les trois. Et vous êtes les mieux nourris du pays.'] },  // Léonie
'44:15': { nouvelles: ['À l\'académie, on n\'a que la Faille Captive, et on la connaît par cœur. Celle de la grotte n\'est pas captive. C\'est très différent. Je dirais que c\'est mieux. Mes professeurs diraient le contraire.'] },  // Ysaline
'31:15': { nouvelles: ['Au bout du sentier, le marécage. Au bout du marécage, la grotte. Dans la grotte, la faille. Qui s\'arrête au sentier rentre pour dîner. Qui va plus loin rentre avec un permis, ou ne rentre pas.'] },  // Anselme (garde de la route)
'31:16': { nouvelles: ['Anselme dit que la faille de la grotte est une porte. Moi je dis que la porte est loin. Anselme dit : « pas assez ». Il a toujours le dernier mot. C\'est l\'âge.'] }  // Bastien
};
