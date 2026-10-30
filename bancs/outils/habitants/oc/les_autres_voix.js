/*
 * LES VOIX DE LA BIBLE (les sœurs Brémont, Léonie, Ysaline, les gardes de la
 * route, le crieur, la recruteuse, l'Essayeur) ET LES RECRUES DE L'ADMISSION,
 * comme des OC — leur fiche (P1), ce qu'ils disent selon où ils sont (P2), ce
 * qu'ils disent des autres (P3), et deux confidences pour ceux qui n'en
 * avaient pas. Voir oc/ville.js pour les champs.
 */
'use strict';
module.exports = {
/* ── les sœurs Brémont : sept, le même chapeau rose ───────────────────── */
'42:6': { // Odile
    oc: { age: '18 ans', allure: 'le chapeau rose des Brémont, une licence toute neuve accrochée au cou comme une médaille', caractere: 'enthousiaste, vantarde ; parle de sa licence comme d\'un titre de noblesse',
        aime: 'sa licence, les armures dorées, qu\'on lui demande « tu es aventurière ? »', deteste: 'l\'armure grise qu\'Hélène lui a vendue (elle la porte tous les jours)', reve: 'une armure dorée, et qu\'on l\'appelle « Odile la Brillante »',
        secret: 'l\'armure grise lui a déjà sauvé la mise une fois ; elle ne l\'avouera jamais à Hélène', manie: 'elle tapote sa licence en parlant', phrase: 'J\'ai ma licence, tu sais.',
        liens: { 'Hélène': 'l\'armurière qui lui a vendu la grise au lieu de la dorée', Sidonie: 'sa sœur, qui lui récite le règlement' } },
    lieux: { travail: ['~Elle admire une armure dorée en vitrine.|Un jour. Un jour, elle sera à moi. En attendant, la grise. Elle est… solide. Voilà.'] },
    avis: { 'Hélène': ['Hélène m\'a vendu l\'armure grise. Je voulais la dorée ! … La grise a arrêté un coup de croc la semaine dernière. Ne lui dis pas.'], Sidonie: ['Sidonie a lu tout le règlement de la Chancellerie. Elle me le récite quand je fais une bêtise. Elle me le récite souvent.'] }
},
'42:7': { // Sidonie
    oc: { age: '20 ans', allure: 'le chapeau rose des Brémont, le règlement de la Chancellerie sous le bras, corné à toutes les pages', caractere: 'posée, pointilleuse ; cite les règles de la Chancellerie comme d\'autres citent des poèmes',
        aime: 'les articles bien rédigés, les procédures, que ses sœurs l\'écoutent (rare)', deteste: 'les approximations, qu\'on dise « c\'est pareil »', reve: 'travailler à la Chancellerie, un jour, et écrire les règles',
        secret: 'elle a trouvé une faute dans le règlement, page cent douze ; elle n\'a jamais osé la signaler', manie: 'elle cite le numéro de l\'article avant de parler', phrase: 'Article quatre : une licence ne donne pas un rang.',
        liens: { Odile: 'sa sœur, qui fait des bêtises qu\'elle réglemente' } },
    lieux: { travail: ['~Elle tourne une page du règlement.|Chaque faille demande son propre permis. Arriver le premier ne donne aucun droit. C\'est écrit. Page quarante.'] },
    avis: { Odile: ['Odile se vante de sa licence. Article quatre : une licence donne le droit de travailler, pas un rang. Je le lui rappelle. Tous les jours.'] },
    perso: { titre: 'Le règlement ?', paliers: [[1, 'Je l\'ai lu trois fois. Il y a des choses très belles dedans. Si, si.'], [4, '~Elle baisse la voix.|Page cent douze, il y a une faute. Une vraie. Je n\'ose pas la signaler. Et si c\'était moi qui m\'étais trompée ?']] }
},
'42:8': { // Prune
    oc: { age: '16 ans', allure: 'le chapeau rose des Brémont, un peu de travers, des genoux toujours écorchés', caractere: 'joyeuse, généreuse, jamais découragée ; recalée de l\'Admission, elle repassera',
        aime: 'aider tout le monde, les bonbons au miel, ses sœurs (toutes les six)', deteste: 'qu\'on la console (« je ne suis pas triste ! »)', reve: 'réussir l\'Admission à la saison prochaine, et sauver quelqu\'un',
        secret: 'elle a raté l\'épreuve pratique parce qu\'elle s\'est arrêtée pour aider un autre candidat ; elle le referait', manie: 'elle propose son aide avant qu\'on ait fini de parler', phrase: 'Je peux t\'aider ?',
        liens: { Agathe: 'sa sœur, qui fait les sacs ; elle l\'aide à les porter' } },
    lieux: { travail: ['~Elle porte trois paquets qui ne sont pas à elle.|Ce n\'est pas lourd ! Enfin, si. Mais c\'est pour aider.'] },
    avis: { Agathe: ['Agathe fait les sacs de tout le monde. Je l\'aide à les porter. Elle dit que je mets les choses dans le mauvais ordre. Mais je les porte bien !'] },
    perso: { titre: 'Recalée ?', paliers: [[1, 'Oui ! Je repasse à la prochaine Admission. Ce n\'est pas grave.'], [4, 'À l\'épreuve, un garçon est tombé. Je me suis arrêtée pour l\'aider. J\'ai raté le temps. … Je le referais. Ne le dis pas à Sidonie, elle me citerait un article.']] }
},
'43:4': { // Agathe
    oc: { age: '22 ans', allure: 'le chapeau rose des Brémont, une liste dans chaque poche, un sac parfaitement rangé', caractere: 'méthodique, coche des listes à voix haute ; prépare les sacs de ses sœurs',
        aime: 'les listes, les sacs bien faits, la corde qu\'on oublie toujours (elle ne l\'oublie jamais)', deteste: 'le désordre, que Prune range « à sa façon »', reve: 'écrire la liste parfaite du sac d\'expédition, celle que toutes les recrues suivraient',
        secret: 'elle glisse un bonbon au miel au fond de chaque sac, pour le moral', manie: 'elle coche dans l\'air avec son doigt', phrase: 'Corde : oui. Trousse : oui. Bonbon : … oui.',
        liens: { Prune: 'sa sœur, qui porte les sacs dans le mauvais ordre' } },
    lieux: { travail: ['~Elle coche dans l\'air.|Trousse de soins : oui. Recharge de cristal : oui. Corde : oui. Bon sens : à vérifier.'] },
    avis: { Prune: ['Prune porte les sacs que je prépare. Elle remet tout dans le mauvais ordre. Mais elle les porte jusqu\'au bout. Ça compte plus que l\'ordre.'] },
    perso: { titre: 'Ta liste ?', paliers: [[1, 'La liste parfaite du sac d\'expédition. J\'en suis à la quarantième version.'], [4, 'À la fin de chaque liste, j\'écris « un bonbon ». Ce n\'est pas réglementaire. Mais une recrue qui a peur, ça la fait sourire. C\'est utile.']] }
},
'43:6': { // Rosalie
    oc: { age: '19 ans', allure: 'le chapeau rose des Brémont, avec une plume « comme celle du Héros », des yeux qui brillent dès qu\'on dit son nom', caractere: 'rêveuse, exaltée ; raconte les exploits du Héros comme si elle y était',
        aime: 'les récits du Héros, les affiches, les saltos (elle n\'en fait pas)', deteste: 'qu\'on dise que le Héros n\'existe pas vraiment, les fins sans exploit', reve: 'voir le Héros une fois, de loin, et lui faire un signe',
        secret: 'elle invente les techniques du Héros que personne ne connaît ; dans sa tête, il fait des saltos', manie: 'elle mime les combats du Héros avec un bâton', phrase: 'Et là, le Héros…',
        liens: { Capucine: 'sa sœur râleuse, qui soupire à chaque exploit' } },
    lieux: { travail: ['~Elle brandit un bâton.|Et là, le Héros détruit la faille ! Tout seul ! D\'un coup ! … Enfin, je crois. Je n\'y étais pas.'] },
    avis: { Capucine: ['Capucine soupire quand je raconte le Héros. Mais elle reste jusqu\'à la fin. Elle veut savoir comment ça finit. Elle le sait. Elle reste quand même.'] },
    perso: { titre: 'Le Héros ?', paliers: [[1, 'Le plus grand ! Il a détruit une faille tout seul !'], [4, 'En vrai, je ne sais rien de lui. Personne ne sait. Alors j\'invente. Dans ma tête, il est gentil. Il aide les gens à porter leurs sacs. Comme Prune.']] }
},
'43:7': { // Capucine
    oc: { age: '24 ans', allure: 'le chapeau rose des Brémont, enfoncé jusqu\'aux sourcils, une lanterne qui grésille à la main', caractere: 'râleuse, pratique, l\'humour sec ; la seule qui pense à recharger la lanterne familiale',
        aime: 'les choses qui marchent, le silence (rare chez les Brémont), les cristaux bien rechargés', deteste: 'les lanternes qui grésillent, les exploits inventés de Rosalie (elle les écoute jusqu\'au bout)', reve: 'une lanterne qui ne s\'éteint jamais. Et une chambre à elle',
        secret: 'elle connaît par cœur tous les exploits inventés de Rosalie, et elle lui en souffle quand elle oublie', manie: 'elle secoue sa lanterne quand elle soupire', phrase: 'Elle fatigue. Comme moi.',
        liens: { Rosalie: 'sa sœur rêveuse ; elle soupire et reste jusqu\'à la fin' } },
    lieux: { travail: ['~Elle secoue sa lanterne, qui grésille.|Encore. Sept sœurs, une lanterne, et c\'est toujours moi qui la recharge.'] },
    avis: { Rosalie: ['Rosalie raconte le Héros comme si elle y était. Elle n\'y était pas. Personne n\'y était. Mais elle raconte bien. … Ne lui dis pas.'] },
    perso: { titre: 'La lanterne ?', paliers: [[1, 'La lanterne de la famille. Elle grésille depuis que je suis née.'], [4, 'Maman l\'allumait pour nous compter, le soir, quand on rentrait. Sept chapeaux roses dans la lumière. Je la recharge pour ça. Pour que quelqu\'un compte.']] }
},
'44:14': { // Bérénice
    oc: { age: '27 ans', allure: 'le chapeau rose des Brémont, posé sur la table, jamais sur la tête ; un livre ouvert, jamais lu', caractere: 'lasse, ironique, tendre avec ses sœurs ; l\'aînée, cachée à l\'auberge',
        aime: 'une heure de calme, son livre (page trois depuis un mois), ses sœurs (de loin, un peu)', deteste: 'qu\'on la trouve, le bruit de six sœurs qui arrivent', reve: 'finir un livre. Un seul',
        secret: 'elle se cache toujours au même endroit ; elle veut qu\'on la trouve', manie: 'elle soupire avant que ses sœurs arrivent, comme si elle les entendait de loin', phrase: 'Elles me trouvent toujours.',
        liens: { 'Léonie': 'la messagère de l\'auberge, qui ne dit jamais où elle se cache', Odile: 'et les cinq autres' } },
    lieux: { travail: ['~Elle tourne une page, puis revient à la précédente.|Page trois. Depuis un mois. Elles arrivent toujours à la page trois.'] },
    avis: { 'Léonie': ['Léonie, la messagère, sait où je me cache. Elle ne dit rien à mes sœurs. C\'est la seule personne de la ville en qui j\'ai confiance.'] },
    perso: { titre: 'Pourquoi te cacher ?', paliers: [[1, 'Pour une heure de calme. Sept sœurs, tu comprends.'], [4, '~Elle referme son livre.|Je me cache toujours au même endroit. Elles le savent. Je le sais. C\'est notre jeu. Le jour où elles ne viendront plus me chercher, je serai… perdue.']] }
},
'44:13': { // Léonie
    oc: { age: '26 ans', allure: 'cape de messagère couleur de route, bottes poussiéreuses, une sacoche scellée aux armes de la couronne', caractere: 'rapide, toujours pressée ; sait tout ce qui se dit sur les routes royales et ne répète que l\'utile',
        aime: 'les routes royales bien entretenues, les relais où l\'on change de chevaux, une soupe chaude à l\'arrivée', deteste: 'les ponts cassés, qu\'on lui demande ce que contiennent les lettres', reve: 'faire toutes les routes royales entre les sept capitales, une fois',
        secret: 'elle sait où se cache Bérénice ; elle ne l\'a jamais dit à personne', manie: 'elle dénoue ses bottes en parlant, prête à repartir', phrase: 'Je repars à l\'aube.',
        liens: { 'Bérénice': 'l\'aînée des Brémont, dont elle garde la cachette' } },
    lieux: { travail: ['~Elle vide ses bottes de leurs cailloux.|Trois jours de route royale. Patrouillée, entretenue, et pleine de nids-de-poule quand même.'] },
    avis: { 'Bérénice': ['Bérénice se cache à l\'auberge pour lire. Je sais où. Je ne dis rien. Une messagère qui parle, ça ne fait pas long feu.'] },
    perso: { titre: 'Les routes ?', paliers: [[1, 'Les routes royales relient les capitales. Je les fais toutes, à cheval. Enfin, presque toutes.'], [4, 'Le soir, dans les relais, je regarde les cartes. Il y a des routes où je ne suis jamais allée. Un jour, j\'y porterai une lettre. Une lettre qu\'on attend.']] }
},
'44:15': { // Ysaline
    oc: { age: '17 ans', allure: 'uniforme rouge de Rubis porté avec négligence étudiée, un ruban d\'insigne de cinquième année, un sourire en coin', caractere: 'vive, un peu fière, se moque d\'elle-même ; protège les plus jeunes en les taquinant',
        aime: 'la Descente dans la Faille Captive, les jetons de cristal (qu\'on lui refuse ici), taquiner Anouk', deteste: 'qu\'on la prenne pour une noble (elle est roturière), les Paroles trop longues', reve: 'la sixième année, sa première faille sauvage, avec la garde royale',
        secret: 'c\'est elle qui a appris à Timothée à tomber sans rien casser ; ça marche une fois sur deux', manie: 'elle fait tourner un jeton de cristal sur ses doigts', phrase: 'Le pouvoir se gagne. Moi, je le gagne lentement.',
        liens: { Anouk: 'la quatrième année trop sérieuse ; elle la taquine, elle l\'admire', 'Timothée': 'elle lui apprend à tomber' } },
    lieux: { travail: ['~Elle fait tourner un jeton de cristal.|À l\'académie, on paie en jetons. Ici, on me rit au nez. C\'est rafraîchissant.'] },
    avis: { Anouk: ['Anouk, la petite quatrième année, note tout. Même mes remarques. Avec la date. Un jour, elle sera Premier Siège, et je dirai que je l\'ai connue.'], 'Timothée': ['Timothée tombe. Je lui apprends à tomber sans casser. Une fois sur deux, ça marche. Une fois sur deux, on casse un étal ensemble.'] }
},
/* ── les gardes de la route (la Forêt, 31) ────────────────────────────── */
'31:15': { // Anselme (le vieux garde de la route)
    oc: { age: '63 ans', allure: 'cape de laine, lance tenue comme un bâton de marche, des moustaches blanches en crocs', caractere: 'calme ; récite les règlements comme des proverbes ; veille sur le jeune Bastien',
        aime: 'les sentiers sans histoire, la pipe du soir, que Bastien pose des questions (il en pose trop)', deteste: 'les voyageurs qui quittent le sentier, la précipitation', reve: 'une dernière saison de garde, puis un banc au soleil',
        secret: 'il connaît chaque arbre du sentier ; il leur dit bonjour quand Bastien ne regarde pas', manie: 'il transforme chaque article du règlement en proverbe', phrase: 'Qui reste sur le sentier rentre pour dîner.',
        liens: { Bastien: 'le jeune garde nerveux qu\'il forme' } },
    lieux: { travail: ['~Il s\'appuie sur sa lance.|Qui reste sur le sentier rentre pour dîner. Qui le quitte… rentre plus tard. Avec des histoires.'] },
    avis: { Bastien: ['Le petit Bastien parle beaucoup. C\'est bien. Un garde qui parle reste éveillé. Un garde qui se tait, je le réveille.'] },
    perso: { titre: 'Toute une vie ici ?', paliers: [[1, 'Quarante ans sur ce sentier. Il n\'a pas changé. Moi si.'], [4, 'Je dis bonjour aux arbres quand Bastien ne regarde pas. Celui-là, le grand chêne, il était déjà vieux quand j\'étais jeune. On a vieilli ensemble. Il le fait mieux que moi.']] }
},
'31:16': { // Bastien
    oc: { age: '19 ans', allure: 'casque trop brillant, une lance qu\'il tient à deux mains, des yeux qui sursautent à chaque feuille', caractere: 'nerveux, bavard, plein de bonne volonté ; pose mille questions à Anselme',
        aime: 'les histoires d\'Anselme, son casque (il le polit le soir), les voyageurs qui lui disent merci', deteste: 'les bruits dans les buissons, rester seul la nuit', reve: 'devenir garde de la porte nord, en ville, comme Brunehaut',
        secret: 'il s\'entraîne à faire les proverbes d\'Anselme ; ils ne marchent pas encore', manie: 'il sursaute, puis fait comme si c\'était exprès', phrase: 'C\'est quoi, ce bruit ? … Rien. C\'était rien.',
        liens: { Anselme: 'le vieux garde qui le forme' } },
    lieux: { travail: ['~Il sursaute à cause d\'un oiseau.|Exprès ! J\'ai sursauté exprès. Pour être prêt. Anselme dit qu\'il faut toujours être prêt.'] },
    avis: { Anselme: ['Anselme a des proverbes pour tout. « Qui reste sur le sentier rentre pour dîner. » J\'ai essayé d\'en inventer un. « Qui… » J\'ai oublié la suite.'] },
    perso: { titre: 'Tu as peur ?', paliers: [[1, 'Peur ? Moi ? … Un peu. Des buissons. Ils bougent.'], [4, 'La première nuit, j\'ai cru voir un monstre. C\'était Anselme qui revenait avec la soupe. Il m\'en a donné la moitié. Depuis, j\'ai moins peur des buissons. Et plus faim.']] }
},
/* ── le crieur, la recruteuse, l'Essayeur ─────────────────────────────── */
'29:53': { // Mathurin (le crieur)
    oc: { age: '50 ans', allure: 'tricorne cabossé, une cloche à la main, une voix qui fait trembler les vitres', caractere: 'tonitruant, théâtral, ne sait pas parler bas ; annonce tout, même les anniversaires',
        aime: 'les grandes nouvelles, son réverbère, que tout le monde s\'arrête pour l\'écouter', deteste: 'les nouvelles sans rien dedans, chuchoter', reve: 'annoncer un jour une nouvelle si belle que toute la ville applaudisse',
        secret: 'il chuchote très bien, en fait ; il le fait pour parler à son chat, le soir', manie: 'il agite sa cloche avant chaque phrase, même au bar', phrase: 'OYEZ, OYEZ !',
        liens: { Tobias: 'l\'allumeur, dont la lampe clignote quand il crie' } },
    lieux: { travail: ['~Il agite sa cloche.|OYEZ ! Le Marché ouvre ! Le soleil se lève ! Les poules sont réveillées ! … Ce sont les nouvelles du jour.'] },
    avis: { Tobias: ['Tobias allume ma lampe chaque soir. Quand je crie trop fort, elle clignote. Il dit qu\'elle rit. Moi je crois qu\'elle sursaute. Comme tout le monde.'] },
    perso: { titre: 'Pourquoi crier ?', paliers: [[1, 'Parce que les nouvelles ne se crient pas toutes seules !'], [4, '~Il pose sa cloche, et parle tout bas, pour la première fois.|Avant moi, personne ne disait rien sur la place. Maintenant, les gens s\'arrêtent. Ils se regardent. Ils parlent. C\'est ça, une nouvelle.']] }
},
'30:26': { // Fanchon
    oc: { age: '35 ans', allure: 'manteau sombre de la Veilleuse, une lanterne brodée sur la poitrine, un sourire de grande sœur', caractere: 'chaleureuse, franche ; fière de sa lanterne ; ne promet que ce qu\'elle tient',
        aime: 'les recrues qui posent des questions, le mentorat, que chacun rentre vivant', deteste: 'le Voile-Soleil qui recrute avec de l\'or, les recrues qui partent seules', reve: 'que toutes les recrues qu\'elle a formées en forment d\'autres à leur tour',
        secret: 'elle a été recrue, une fois, et elle avait peur de tout ; sa mentore lui a donné sa lanterne', manie: 'elle touche la lanterne brodée sur sa poitrine quand elle parle de la guilde', phrase: 'À la Veilleuse, on rentre ensemble.',
        liens: { Aubin: 'la recrue qui hésite entre les trois guildes' } },
    lieux: { travail: ['~Elle tend un dépliant à une recrue.|La Veilleuse ne paie pas le mieux. Elle forme le mieux. Et elle ramène tout le monde. C\'est écrit sur la lanterne.'] },
    avis: { Aubin: ['La recrue Aubin hésite entre les trois guildes. Il hésite depuis le début de l\'Admission. Je lui ai dit : prends le temps. À la Veilleuse, on prend le temps.'] },
    perso: { titre: 'Ta lanterne ?', paliers: [[1, 'Celle de la Veilleuse. On en reçoit une quand on est formé.'], [4, 'Ma mentore m\'a donné la sienne, le jour où j\'ai formé ma première recrue. Elle m\'a dit : « Maintenant, c\'est toi qui éclaires. » J\'ai pleuré. Je pleure encore en le racontant. Pas fort.']] }
},
'33:43': { // Gustave (l'Essayeur de la Confrérie)
    oc: { age: '48 ans', allure: 'gants de cuir fin, une loupe à trois verres, un sceau de la Confrérie des Reliquaires pendu au cou', caractere: 'précis, cérémonieux ; très patient avec les gens pressés',
        aime: 'les reliques bien entretenues, les sceaux honnêtes, les vieilles armes qui ont une histoire', deteste: 'les faux sceaux, qu\'on répare une relique soi-même', reve: 'examiner une relique de Givrefer, une vraie, une fois',
        secret: 'il collectionne les faux sceaux qu\'il a démasqués ; il en a cent trois', manie: 'il examine tout à la loupe, même le pain', phrase: 'Ne réparez jamais une relique vous-même.',
        liens: { Régis: 'le vieux capitaine, qui lui fait examiner son sabre « de légende »' } },
    lieux: { travail: ['~Il examine une casserole à la loupe.|… Ce n\'est pas une relique. C\'est une casserole. Mais elle est bien entretenue. Bravo.'] },
    avis: { Régis: ['Le capitaine Régis me fait examiner son sabre tous les jours. « Un sabre de légende. » C\'est un bon sabre ordinaire. Je ne le lui dis pas. Il en a besoin.'] },
    perso: { titre: 'Les faux sceaux ?', paliers: [[1, 'Un commerce tenace. J\'en démasque un par semaine.'], [4, 'Je les garde. Cent trois. Certains sont si bien faits que je les trouve beaux. Un faussaire honnête serait un grand artiste. Ça n\'existe pas, un faussaire honnête.']] }
},
/* ── les recrues de l'Admission ───────────────────────────────────────── */
'29:55': { // Noé
    oc: { age: '17 ans', allure: 'sac neuf, bottes neuves, une liste de consignes écrite sur la main', caractere: 'nerveux, enthousiaste ; répète ses consignes à voix haute',
        aime: 'les consignes claires, l\'odeur du Champ d\'Épreuve, Ilda (qui rit de tout)', deteste: 'les surprises, oublier une consigne', reve: 'réussir le Champ d\'Épreuve du premier coup',
        secret: 'il a recopié ses consignes sur sa main, sur son bras, et dans sa botte gauche', manie: 'il récite ses consignes en marchant', phrase: 'Consigne trois : garder son calme. Je suis calme.',
        liens: { Ilda: 'l\'autre recrue, qui rit de tout ; il la trouve rassurante' } },
    lieux: { travail: ['~Il relit sa main.|Consigne un : écouter l\'évaluateur. Consigne deux : ne pas courir. Consigne trois : je ne me souviens plus. Ah si. Garder son calme.'] },
    avis: { Ilda: ['Ilda a passé le Hall de l\'Égide avec le hoquet. Elle a ri tout le long. Moi, je n\'ai pas ri. J\'avais trop peur. Elle a réussi. Moi aussi, mais moins bien.'] },
    perso: { titre: 'Le Champ d\'Épreuve ?', paliers: [[1, 'Les évaluations pratiques ! C\'est demain. Ou après-demain. Je ne sais plus.'], [4, 'Ma mère m\'a dit : « Si tu as peur, compte jusqu\'à trois. » J\'ai compté jusqu\'à mille, la nuit dernière. Je suis prêt. Je crois.']] }
},
'29:56': { // Ilda
    oc: { age: '18 ans', allure: 'cheveux en bataille, une écharpe de travers, un rire qui part avant elle', caractere: 'rieuse, franche, se moque d\'elle-même ; a passé le Hall de l\'Égide avec le hoquet',
        aime: 'rire, les épreuves (« c\'est comme un jeu »), Noé (qui a peur de tout, c\'est mignon)', deteste: 'le sérieux, les escaliers du Hall de l\'Égide (il y en a trop)', reve: 'entrer chez les Crocs, parce qu\'ils rient fort',
        secret: 'elle rit quand elle a peur ; elle a ri pendant toute l\'épreuve', manie: 'elle hoquette encore quand elle est émue', phrase: 'Hic ! … Pardon. C\'est l\'émotion.',
        liens: { Noé: 'la recrue nerveuse qui récite ses consignes' } },
    lieux: { travail: ['Hic ! … Pardon. J\'ai réussi le Hall de l\'Égide, j\'ai encore le hoquet. Ça fait trois jours. C\'est un record ?'] },
    avis: { Noé: ['Noé récite ses consignes en dormant. Je l\'ai entendu, à l\'auberge. « Consigne trois : garder son calme. » Il était très calme. Il dormait.'] },
    perso: { titre: 'Le hoquet ?', paliers: [[1, 'Depuis l\'épreuve ! Hic ! Il ne veut pas partir.'], [4, 'En vrai, je ris quand j\'ai peur. Et je hoquette quand je ris trop. Pendant l\'épreuve, j\'ai ri du début à la fin. L\'évaluateur a noté : « bonne humeur ». C\'était de la peur.']] }
},
'29:57': { // Aubin
    oc: { age: '19 ans', allure: 'trois dépliants de guildes dans une main, un crayon mâchouillé dans l\'autre', caractere: 'hésitant, réfléchi ; change d\'avis en parlant',
        aime: 'peser le pour et le contre, les listes à deux colonnes, la lanterne de la Veilleuse (il ne l\'a pas dit à Fanchon)', deteste: 'choisir, qu\'on lui dise « décide-toi »', reve: 'trouver la guilde où il n\'aura pas besoin d\'hésiter',
        secret: 'il a déjà choisi la Veilleuse depuis le premier jour ; il hésite pour continuer à parler à Fanchon', manie: 'il dit « d\'un autre côté » au milieu de chaque phrase', phrase: 'D\'un autre côté…',
        liens: { Fanchon: 'la recruteuse de la Veilleuse, qui lui dit de prendre le temps' } },
    lieux: { travail: ['~Il regarde ses trois dépliants.|Le Voile-Soleil paie mieux. D\'un autre côté, la Veilleuse forme mieux. D\'un autre côté, les Crocs… non. D\'un autre côté…'] },
    avis: { Fanchon: ['Fanchon, de la Veilleuse, me dit de prendre le temps. D\'un autre côté, l\'Admission finit dans trois jours. D\'un autre côté, elle a raison.'] },
    perso: { titre: 'Tu as choisi ?', paliers: [[1, 'Pas encore ! D\'un autre côté…'], [4, '~Il regarde le dépliant de la Veilleuse, très longtemps.|J\'ai choisi le premier jour. La Veilleuse. Mais si je le dis, Fanchon arrêtera de m\'expliquer la lanterne. Et j\'aime bien qu\'elle me l\'explique.']] }
},
'29:58': { // Clémence
    oc: { age: '20 ans', allure: 'carnet de comptes neuf, une plume rapide, une bourse vide qu\'elle tient comme si elle était pleine', caractere: 'sûre d\'elle, pressée ; compte déjà ses gains avant d\'avoir signé',
        aime: 'les contrats bien rédigés, les primes, la Bourse des Lames Franches (elle connaît le tableau par cœur)', deteste: 'attendre, les dépôts de garantie', reve: 'être la franc-lame la mieux payée de la ville, et rembourser la maison de ses parents',
        secret: 'elle a calculé ses gains de ses dix prochaines années ; il y a une ligne « une maison pour papa et maman »', manie: 'elle calcule à voix haute ce que coûte tout ce qu\'elle voit', phrase: 'Ça fait combien, ça ?',
        liens: { Ninon: 'la coursière de la Bourse, qui lui apporte les nouvelles du tableau' } },
    lieux: { travail: ['~Elle note un chiffre.|Une licence, cent. Un contrat de rang E, peu. Un contrat de rang D, un peu plus. Dans dix ans… je ne dis pas. Mais beaucoup.'] },
    avis: { Ninon: ['Ninon, la coursière, me dit ce qui arrive au tableau de la Bourse avant tout le monde. Je lui paie un café. C\'est mon meilleur investissement.'] },
    perso: { titre: 'Pourquoi la Bourse ?', paliers: [[1, 'Parce que les indépendants gardent leur paie. Pas de guilde qui prend sa part.'], [4, 'Dans mon carnet, il y a une ligne tout en bas : « Une maison pour papa et maman. » Le reste, c\'est pour y arriver. Ne le dis à personne, ça fait moins sérieux.']] }
}
};
