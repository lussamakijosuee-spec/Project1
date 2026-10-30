/*
 * LA VILLE FORESTIÈRE (carte 29) — ses habitants.
 * Dehors, VieDuVillage les fait vivre (sortir le matin, travailler, flâner,
 * rentrer à 21 h). <Soiree: 14,32> : ils finissent la journée au bar (la
 * porte du bar, en 14,32). <Agenda: …> : ils vont ailleurs à certaines
 * heures. <Vie: fixe> : un garde qui suit la ronde que JOKO lui a tracée.
 */
'use strict';
var K = require('./_communs.js');
var P = K.P, A = K.A, C = K.C, si = K.si, cat = K.cat, H = K.H, paye = K.paye;
var BAR = '<Soiree: 14,32>';
var fiches = [];
function F(f) { fiches.push(f); }

/* ── les gardes ───────────────────────────────────────────────────────── */
F(K.garde(11, 'Brunehaut', { tags: ['<Va: 18-21 46 ; 21-6 40>'], role: 'garde de la porte nord', voix: 'sèche, sarcastique, dévisage les voyageurs.',
    premiere: 'Porte nord. Je suis Brunehaut. Si tu sors, c\'est la forêt. Si tu rentres, c\'est la ville. Si tu restes planté là, c\'est moi.',
    discuter: ['Je compte les gens qui sortent, et ceux qui rentrent. Le soir, il en manque toujours un ou deux.', 'Les chasseurs sortent à l\'aube et rentrent à la nuit. Ceux qui rentrent pas, on met leur nom sur une liste. La liste est longue.'],
    perso: { titre: 'Pourquoi garde ?', paliers: [[1, 'Parce que personne ne voulait de la porte nord.'], [4, 'Mon frère est sorti par cette porte il y a trois ans. Il n\'est pas rentré. Alors je la garde. Au cas où.']] } }));
F(K.garde(12, 'Oswin', { tags: ['<Va: 6-13 40 ; 13-17 46>'], role: 'jeune garde de la porte nord, s\'ennuie', voix: 'jeune, las, rêve d\'être muté au manoir.',
    premiere: 'Salut. Oswin. Tu veux passer ? Passe. Tu veux parler ? Par pitié, parle.',
    discuter: ['Au manoir, les gardes mangent de la viande tous les jours. Ici, on mange de la poussière.', 'J\'ai compté les pavés de la porte. Cent quarante-deux. Hier j\'en comptais cent quarante et un. Je crois que je deviens fou.'],
    perso: { titre: 'Le manoir ?', paliers: [[1, 'Je veux y être muté. Brunehaut dit que je suis trop bête. C\'est une qualité, pour garder des nobles.'], [4, 'J\'ai écrit trois demandes. Jehan, l\'écrivain du bar, les a écrites pour moi. On ne m\'a jamais répondu.']] } }));
F(K.garde(14, 'Arno', { role: 'recrue, vient de recevoir sa première lance', voix: 'nerveux, fier, parle trop vite.',
    premiere: 'Recrue Arno, à vos ordres ! Enfin… pas à vos ordres. À ceux du sergent. Mais bonjour !',
    discuter: ['J\'ai reçu ma lance le mois dernier. Une vraie, de la garde, avec mon nom gravé dessus. J\'en ai encore des frissons.', 'Le sergent dit qu\'une lance ne fait pas un soldat. Il a raison. Mais ça aide.'],
    perso: { titre: 'Ta lance ?', paliers: [[1, 'Une lance ! … Bon, comme presque toute la garde. Mais c\'est MA lance.'], [3, 'Au fond, j\'espérais une épée. Comme les grands. Le sergent dit qu\'on commence tous par la lance.'], [6, 'La nuit, parfois, je la sors juste pour la regarder. C\'est bête. C\'est la seule chose au monde qui soit vraiment à moi.']] } }));
F(K.garde(30, 'Sergent Doran', { role: 'sergent de la garde, suit la ronde que JOKO lui a tracée', voix: 'autoritaire, bourru, protège ses hommes.', tags: ['<Vie: fixe>'],
    premiere: 'Sergent Doran. Cette ville, c\'est ma ronde. Tu marches dedans, tu marches sous mes yeux.',
    discuter: ['J\'ai douze hommes pour une ville entière. Le lord en a quarante pour un manoir. Fais le calcul.', 'Mes gars sont payés en retard, mal nourris et mal équipés. Et ils tiennent. Je suis fier d\'eux. Le dis à personne.'],
    perso: { titre: 'Et le lord ?', paliers: [[1, 'Je sers la ville. Le lord paie. Ça s\'arrête là.'], [5, 'Le lord a ses nobles, et les nobles ont des idées. La dernière : repeindre la porte sud en doré. Avec quel argent ? Le nôtre.']] } }));
F(K.garde(31, 'Ida', { role: 'garde, rude, n\'aime pas les escortes de nobles', voix: 'franche, dure, un humour tranchant.',
    premiere: 'Ida. Garde. Si t\'as un problème, dis-le vite. Si t\'es le problème, dis-le aussi, ça ira plus vite.',
    discuter: ['La semaine dernière, j\'ai escorté une dame du manoir. Elle a pleuré parce que sa robe était mouillée. Moi j\'avais de la boue jusqu\'aux genoux.', 'Les femmes dans la garde ? On est quatre. On fait le travail de huit.'],
    perso: { titre: 'Pourquoi la garde ?', paliers: [[1, 'Parce que je frappe fort.'], [4, 'Mon père buvait. Il frappait aussi. Le jour où j\'ai frappé plus fort que lui, je suis partie. La garde, c\'était la seule maison qui voulait de moi.']] } }));
F(K.garde(32, 'Paulin', { role: 'garde, joueur, doit de l\'argent à Anselme', voix: 'rigolard, parieur, toujours une combine.',
    premiere: 'Paulin, garde de la ville. Tu joues aux dés ? Non ? Dommage, t\'avais une tête à perdre.',
    discuter: ['Anselme, du bar, me doit dix pièces. Je lui en dois vingt. On est quittes, à peu près.', 'Le sergent veut pas qu\'on joue en service. Alors on joue entre deux services. Il n\'y a pas de règle entre deux services.'],
    perso: { titre: 'Ta paie ?', paliers: [[1, 'Quelle paie ?'], [4, 'Je l\'ai perdue trois mois d\'avance. Ma femme ne le sait pas. Si tu la croises, parle-lui du temps qu\'il fait.']] } }));
F(K.garde(33, 'Mathis', { role: 'guetteur, en haut près de la porte nord', voix: 'rêveur, observateur, parle du ciel.',
    premiere: 'D\'ici, je vois toute la forêt. Et toi, maintenant.',
    discuter: ['Le soir, les lampes enchantées s\'allument une à une. D\'en haut, on dirait que la ville respire.', 'Les nuages viennent du nord. Quand ils sont gris-jaune, il neige le lendemain. Je me suis jamais trompé. Presque.'],
    perso: { titre: 'Qu\'est-ce que tu vois ?', paliers: [[1, 'Des arbres. Beaucoup d\'arbres.'], [4, 'Parfois, la nuit, une lanterne bouge dans la forêt. Des braconniers. Je fais semblant de rien voir. Le lendemain, il y a un lièvre devant la guérite.']] } }));
F(K.garde(34, 'Rolf', { tags: ['<Va: 18-21 46 ; 21-6 40>'], role: 'garde de la porte sud', voix: 'jovial, colossal, mange tout le temps.',
    premiere: 'Porte sud ! Rolf ! Tu veux un morceau de saucisse ? Non ? Plus pour moi.',
    discuter: ['Berthe, la cuisinière du bar, me garde les fonds de marmite. C\'est la femme de ma vie. Elle le sait pas.', 'On m\'a mis à la porte sud parce que je bouche le passage à moi tout seul. C\'est un compliment.'],
    perso: { titre: 'Tu manges tout le temps ?', paliers: [[1, 'Je grandis encore !'], [4, 'Quand j\'étais petit, on mangeait un jour sur deux. Depuis, je mange pour les deux jours.']] } }));
F(K.garde(35, 'Konrad', { tags: ['<Va: 6-13 40 ; 13-17 46>'], role: 'garde de la porte sud, taciturne', voix: 'lent, deux mots par phrase, regard lourd.',
    premiere: 'Konrad.', bonjour: { 1: ['Hm.'], 2: ['…'], 3: ['Soir.'], 4: ['Nuit.'] },
    discuter: ['Rolf parle. Moi, je regarde.', 'Trop de soldats du lord, ces temps-ci. Pas bon.'],
    perso: { titre: 'Tu parles peu.', paliers: [[1, 'Oui.'], [4, 'J\'ai beaucoup parlé, avant. Au mauvais homme. Il est mort. Depuis, je réfléchis.']] } }));
F(K.garde(36, 'Béran', { tags: ['<Vie: ronde>', '<Ronde: 20,11 ; 27,20 ; 20,27 ; 11,24>', '<Logis: 23,28>'], role: 'vétéran, trois doigts à la main gauche', voix: 'cynique, las, a vu trop de guerres de lords.',
    premiere: 'Béran. Vétéran, qu\'ils disent. Ça veut dire vieux et encore vivant.',
    discuter: ['J\'ai fait trois guerres pour trois lords. Aucun ne se souvient de mon nom. Moi je me souviens de celui de mes morts.', 'Tu vois cette main ? Trois doigts. Les deux autres sont restés dans une plaine dont je sais même plus le nom.'],
    perso: { titre: 'Les guerres ?', paliers: [[1, 'Laisse les guerres où elles sont.'], [4, 'On se battait pour des frontières que personne ne voyait. Les nobles dînaient pendant qu\'on creusait.'], [7, 'Si le lord repart en guerre, je pars dans la montagne. Je me le suis promis. Je tiendrai pas ma promesse. On la tient jamais.']] } }));
F(K.garde(37, 'Aude', { role: 'garde de nuit', voix: 'calme, attentive, aime la nuit.',
    premiere: 'Aude, de la garde de nuit. Enfin, je commence le soir. Le jour, je dors, et je rêve de la nuit.',
    discuter: ['La nuit, la ville est à nous : aux gardes, aux chats et aux voleurs.', 'Tobias allume les lampes enchantées à la tombée de la nuit. Je le suis, parfois. C\'est beau, une ville qui s\'allume.'],
    perso: { titre: 'Tu aimes la nuit ?', paliers: [[1, 'La nuit ne ment pas. Le jour, tout le monde fait semblant.'], [4, 'Je suis née la nuit, dans une grange. Ma mère disait que je n\'ai jamais voulu du soleil.']] } }));

/* ── les habitants ────────────────────────────────────────────────────── */
F({ ev: 25, nom: 'Élise', role: 'enfant de kaze', voix: 'vive, impatiente, rêve d\'ailleurs.',
    premiere: 'Bonjour ! Je suis Élise ! Tu viens de loin ? Plus loin que la forêt ? Je veux y aller.',
    bonjourTous: ['Salut !', '~Elle saute d\'un pavé à l\'autre.|Tu as vu ? Je ne touche pas les lignes !'],
    saisons: { 1: ['Au printemps, il y a des têtards dans la rivière. Tomas a peur des têtards.'], 2: ['L\'été, maman nous compte toutes les cinq minutes. On est deux. C\'est pas dur.'], 3: ['Les feuilles tombent ! Papa dit que c\'est pour faire des tas. Je saute dedans.'], 4: ['La neige ! Papa a fait un bonhomme avec une épée. Il a dit que c\'était pour nous protéger.'] },
    discuter: ['Quand je serai grande, je passerai l\'Admission. Avec une épée. Comme papa, mais en plus loin.', 'Papa a l\'air méchant. Il est pas méchant. Il me porte sur ses épaules et il fait semblant de pas s\'en rendre compte.', 'Tomas dit que la forêt est pleine de bêtes. Moi je dis que c\'est pour ça qu\'il faut y aller.'],
    nouvelles: ['Papa cherche une fleur pour l\'anniversaire de maman. C\'est un secret. Tu le dis pas, hein ?'],
    perso: { titre: 'Tu veux partir ?', paliers: [[1, 'Oui ! Voir la mer. Et des failles. Et la mer.'], [4, 'Mais pas trop longtemps. Sinon maman va s\'inquiéter, et Tomas aussi. Et papa ferait une soupe pour personne.']] },
    aurevoir: ['Salut ! Reviens raconter !', 'Bonne aventure !'] });
F({ ev: 26, nom: 'Tomas', role: 'enfant de kaze', voix: 'posé, casanier, , un peu inquiet.',
    premiere: 'Bonjour. Je suis Tomas. Élise t\'a déjà dit qu\'elle voulait partir ? Elle le dit à tout le monde.',
    bonjourTous: ['Bonjour.', '~Il suit sa sœur des yeux.|Pas trop loin, Élise…'],
    saisons: { 1: ['Au printemps, il pleut. Si on reste à l\'intérieur, on ne se mouille pas.'], 2: ['Il fait chaud. Je reste à l\'ombre. Élise, non.'], 3: ['L\'automne, papa rentre le bois. Je l\'aide à porter les petites bûches.'], 4: ['L\'hiver, on reste à la maison. C\'est ma saison préférée.'] },
    discuter: ['La maison, c\'est l\'épicerie. Il y a tout : des cordes, des potions, des bougies. Pourquoi partir ?', 'Papa dit qu\'il faut savoir tomber. Je sais tomber. Je préfère ne pas grimper.', 'Si Élise part à l\'aventure, je viendrai. Pour la ramener.'],
    nouvelles: ['Maman tient l\'épicerie le matin, papa l\'après-midi. À midi, ils se croisent et ils sourient. Je sais pas pourquoi ça les fait sourire.'],
    perso: { titre: 'Tu as peur ?', paliers: [[1, 'Un peu. Tout le temps.'], [4, 'Papa aussi a peur, je crois. Mais il le fait quand même. Il dit que c\'est ça, le courage.']] },
    aurevoir: ['Bonne journée. Fais attention.', 'Reviens, hein.'] });
F({ ev: 27, nom: 'Gaston', role: 'paysan, râle contre les taxes, finit ses journées au bar', voix: 'grognon, fataliste, drôle malgré lui.', tags: [BAR],
    premiere: 'Gaston. Paysan. Enfin, paysan pour le lord : je cultive, il récolte.',
    bonjour: { 1: ['Debout depuis quatre heures. Et toi, tu te promènes.'], 2: ['Hm. Encore une journée à nourrir des gens qui me méprisent.'], 3: ['Je vais au bar. Viens si tu veux. Tu paies si tu viens.'] }, bonjourTous: ['Quoi ?'],
    saisons: K.SAISON,
    discuter: ['Trois récoltes sur quatre vont au lord. La quatrième, les corbeaux. Moi, je mange ce qui tombe.', 'Mon arme ? Une serpe. Comme mon père. Une arme, qu\'ils disent. Moi je coupe du blé avec.', K.DUR[2]],
    nouvelles: [K.LORD[0], K.LORD[2], K.LORD[5]],
    perso: { titre: 'Votre ferme ?', paliers: [[1, 'Elle est au lord. J\'y habite, c\'est tout.'], [4, 'Ma femme est morte en couches, avec le petit. J\'ai continué à labourer le lendemain. Le lord ne donne pas de jour pour ça.']] },
    aurevoir: ['Ouais.', 'Va, va.'] });
F({ ev: 28, nom: 'Hilde', role: 'mère de 2 enfants, débordée, chaleureuse', voix: 'pressée, affectueuse, parle en surveillant ses enfants.', tags: ['<Agenda: 8-13 5,32>', '<Logis: 5,32>'],
    premiere: 'Bonjour ! Pardon, je surveille les petits. ÉLISE ! Pas si loin ! … Pardon. Hilde. Le matin, je tiens l\'épicerie ; l\'après-midi, c\'est Kaze.',
    bonjour: { 1: ['Je file à l\'épicerie. Kaze garde les petits jusqu\'à midi… enfin, il essaie.'], 2: ['Kaze a pris l\'épicerie. Moi, je reprends les enfants. On s\'échange le monde à midi.'], 3: ['L\'heure du bain. Personne ne veut. Tout le monde y passe.'] }, bonjourTous: ['Bonjour !', '~Elle compte deux têtes du regard.|Bonjour !'],
    saisons: { 1: ['Au printemps, Élise rentre couverte de boue et Tomas couvert d\'inquiétude.'], 2: ['L\'été, ils veulent nager dans la rivière. Je compte les têtes. Deux. Toujours deux. Je recompte.'], 3: ['L\'automne, les rhumes. Deux rhumes, un mouchoir, et Kaze qui les borde trois fois.'], 4: ['L\'hiver, ils restent à la maison. La maison, c\'est l\'épicerie. Ils jouent entre les fioles.'] },
    discuter: ['Le matin, l\'épicerie ; l\'après-midi, les enfants. Kaze fait l\'inverse. On se croise à midi, on se dit trois mots, et ça suffit.', 'Kaze a l\'air dur comme une lame. Il chante pour endormir Tomas. Faux. Ne lui dis pas que je te l\'ai dit.', 'Élise veut partir à l\'aventure. Tomas veut rester à la maison. Moi, je veux qu\'ils mangent leur soupe.'],
    nouvelles: ['Les recrues de l\'Admission achètent toutes la même chose : une trousse de soins, de quoi recharger leurs cristaux, et une corde. Je dis toujours de prendre une corde.', K.MAGIE[0]],
    perso: { titre: 'Et vous, Hilde ?', paliers: [[1, 'Moi ? Je n\'ai pas le temps d\'être moi.'], [3, 'Kaze croit que je ne sais pas, pour mon anniversaire. Il pose des questions sur les fleurs à tout le monde. Il est très mauvais pour les secrets.'], [6, 'Avant les enfants, je chantais. Le soir, au bar. Kaze venait tous les soirs et ne disait rien. Un jour, il a dit « encore ». C\'est tout. Ça m\'a suffi.']] },
    aurevoir: ['Bonne journée ! ÉLISE ! TOMAS ! On rentre !', 'À bientôt !'] });
F({ ev: 29, nom: 'Fernand', tags: ['<Logis: 36,6>'], role: 'vieux paysan, prédit le temps', voix: 'lent, sage, un peu sourd.',
    premiere: 'Hein ? Bonjour ? Oui, bonjour. Fernand. Je dis le temps qu\'il fera. Gratuitement. C\'est pour ça qu\'on m\'écoute pas.',
    bonjourTous: ['Hein ?', 'Bonjour, bonjour.'],
    saisons: { 1: ['Il pleuvra trois jours. Puis il fera beau. Puis il pleuvra.'], 2: ['Orage demain. Mes genoux le disent. Mes genoux ne mentent jamais.'], 3: ['Hiver précoce. Les écureuils sont nerveux.'], 4: ['Encore un mois de gel. Peut-être deux. Rentre ton bois.'] },
    discuter: ['J\'ai vu passer quatre lords. Ils sont tous partis. Les champs sont restés.', 'Mes petits-enfants sont en ville. Ils viennent quand ils ont besoin d\'argent. Je n\'en ai pas. Alors ils ne viennent pas.'],
    nouvelles: [K.LORD[7]],
    perso: { titre: 'Vos genoux ?', paliers: [[1, 'Ils prédisent la pluie mieux que n\'importe quel mage.'], [4, 'Je suis tombé d\'un toit à vingt ans. Depuis, ils me disent le temps. C\'est le seul cadeau que le toit m\'a fait.']] },
    aurevoir: ['Hein ? Oui, au revoir.', 'Prends un manteau.'] });
F({ ev: 38, nom: 'Colette', role: 'vendeuse des livres de Parole d\'ombre', voix: '', tags: ['<Agenda: 13-18 15,34>', '<Soiree: 14,32>', '<Va: 18-21 33 32,30 1/3>'],
    premiere: '....bonjour',
    bonjourTous: ['....', '~Elle griffonne des chiffres dans la marge d\'un livre noir.|… Oui ?'],
    saisons: { 1: ['Le printemps. Les gens parlent plus. Je lis plus loin d\'eux.'], 2: ['L\'été, les parfaits à la fraise. … Je n\'ai rien dit.'], 3: ['L\'automne. Le vent tourne les pages à ma place. Je déteste ça.'], 4: ['L\'hiver. Le silence tient tout seul. Enfin.'] },
    discuter: ['Une Parole d\'ombre, c\'est une équation. Bien posée, elle tombe juste. Mal posée, elle tombe sur toi.', 'Je vends des livres de Parole d\'ombre. Personne ne les lit jusqu\'au bout. Moi si.', 'Tu parles. Beaucoup. … Abrège.', 'L\'eau et l\'ombre se répondent. J\'ai trois pas d\'avance, toujours. Le quatrième, je le retiens. Il ferait trop de dégâts.'],
    nouvelles: ['Le crieur crie. Les recrues crient. La ville entière crie. Je calcule quand même.', 'On parle de moi au bar. Ce qu\'on dit est faux. Ce qui est vrai, personne ne le sait.'],
    perso: { titre: 'Et jeck ?', paliers: [[1, '… Qui ? … Le marchand de roulette ? Il est bruyant. Il triche mal. … Pourquoi tu me demandes ça.'], [4, '~Elle ferme son livre un peu trop fort.|Il me voit comme une amie. C\'est très bien. C\'est parfait. C\'est mathématiquement parfait.'], [8, '~Elle détourne les yeux, rouge jusqu\'aux oreilles.|Tu reviens souvent. … Ce n\'est pas une question. Continue. Et deviens meilleur : je ne supporte pas qu\'on stagne près de moi.']] },
    options: [{ titre: 'Colette ?', cmds: P('Colette', 'Oui. Colette. C\'est mon prénom. … Si tu ris, je te jette hors de mon espace.') }],
    aurevoir: ['… Oui.', 'Va. Et sois concis, la prochaine fois.'] });
F({ ev: 39, nom: 'Tobias', tags: ['<Vie: ronde>', '<Ronde: 20,25 ; 13,34 ; 12,15 ; 20,15 ; 11,6 ; 13,6 ; 35,8>'], role: 'allumeur des lampes enchantées de la ville', voix: 'doux, poétique, parle de la lumière comme d\'un être vivant.',
    premiere: 'Tobias. J\'allume les lampes. Enfin, je leur rappelle de s\'allumer. Elles sont enchantées, mais elles oublient.',
    bonjour: { 1: ['Je viens de les éteindre toutes. Elles dorment.'], 2: ['Je vérifie les pierres des lampes. Certaines faiblissent.'], 3: ['C\'est l\'heure ! Je fais ma tournée. Une par une.', '~Il tapote une lampe du bout des doigts. Elle s\'allume.'], 4: ['Toutes allumées. Maintenant, je veille.'] },
    saisons: { 1: ['Le printemps, les nuits raccourcissent. Mes lampes se reposent.'], 2: ['L\'été, les insectes tournent autour des lampes. Ils ne comprennent pas que ce n\'est pas le soleil.'], 3: ['L\'automne, j\'allume plus tôt chaque jour. Deux minutes. Je les compte.'], 4: ['L\'hiver, les lampes brûlent seize heures. Elles fatiguent, comme moi.'] },
    discuter: ['Une lampe enchantée dure dix ans. Après, la pierre devient grise. On la garde quand même. On ne jette pas une lumière.', 'Le lord a promis vingt lampes de plus pour la ville basse. Il y a trois ans. J\'attends.', K.MAGIE[5]],
    nouvelles: [K.LORD[3]],
    perso: { titre: 'Pourquoi les lampes ?', paliers: [[1, 'Quelqu\'un doit le faire.'], [4, 'Ma fille avait peur du noir. Elle n\'est plus là. Mais la ville, elle, n\'aura jamais peur du noir.']] },
    aurevoir: ['Que ta route soit éclairée.', 'Bonne nuit, ou bonne journée. Je confonds toujours.'] });
F({ ev: 40, nom: 'Kaze', role: 'travaille au magasin d\'objets et mari de hilde', voix: 'laconique, précis, regard d\'acier, mais un très bon citoyen', tags: ['<Agenda: 13-20 5,32>', '<Logis: 5,32>'],
    premiere: '~Il te jauge d\'un regard d\'acier.|Kaze. … L\'épicerie, l\'après-midi, c\'est moi. Si tu as besoin d\'une corde, je te la porte.',
    bonjourTous: ['Hm.', '~Il hoche la tête. Une fois. Mais il a posé ce qu\'il portait pour te répondre.|Toi.'],
    saisons: { 1: ['Le printemps. Les routes rouvrent. Les fleurs aussi.'], 2: ['Trop chaud pour les petits. Je leur ai fait de l\'ombre avec une toile.'], 3: ['Le vent tourne. Je rentre le bois des voisins. Ils ne savent pas que c\'est moi.'], 4: ['L\'hiver. On attend. Je fais des soupes.'] },
    discuter: ['… J\'aide. C\'est tout. Ne le répète pas.', 'Élise grimpe partout. Tomas s\'inquiète de tout. Je leur ai appris à tomber. À l\'une pour qu\'elle se relève, à l\'autre pour qu\'il ose.', 'Tu tiens bien ton arme. Mieux que la plupart.'],
    nouvelles: ['Les recrues passent à l\'épicerie avant la Forêt. Je leur mets une corde de plus dans le sac. Elles ne la paient pas. Elles reviennent.'],
    perso: { titre: 'Tu caches quelque chose.', paliers: [[1, '… Non.'], [3, 'L\'anniversaire de Hilde. Dans deux semaines. Il me faut une fleur. Pas une du marché.'], [5, 'Une fleur très rare. Elle ne pousse pas ici. Il faudrait partir, et je ne pars pas sans quelqu\'un pour garder l\'épicerie et les petits. … Tu as l\'air de quelqu\'un qui part.']] },
    aurevoir: ['Hm.', 'Garde ta garde haute. Et mange.'] });
F({ ev: 41, nom: 'Mado', role: 'lavandière', voix: 'forte, franche, les mains rouges, rit fort.', tags: ['<Soiree: 14,32>', '<Logis: 7,18>'],
    premiere: 'Mado, lavandière ! Si t\'as du linge sale, t\'es au bon endroit. Si t\'as des secrets sales, aussi : je lave tout.',
    bonjourTous: ['Salut, toi !', '~Elle essore un drap avec une force alarmante.|Ouf. Bonjour.'],
    saisons: { 1: ['La rivière est glacée au printemps. Mes mains aussi.'], 2: ['L\'été, le linge sèche en une heure. Je fais le double de travail pour le même prix.'], 3: ['Les feuilles dans la rivière, ça tache. Qui a inventé l\'automne ?'], 4: ['L\'hiver, je casse la glace pour laver. Personne ne me paie pour casser la glace.'] },
    discuter: ['Je lave le linge du manoir, une fois par mois. Les nobles tachent leurs draps comme tout le monde. Crois-moi.', K.DUR[3], 'Mon mari dit que je parle trop fort. Je lui ai répondu. Assez fort.'],
    nouvelles: [K.LORD[6], K.LORD[3]],
    perso: { titre: 'Le linge du manoir ?', paliers: [[1, 'Je dirai rien. Enfin, pas gratuitement.'], [4, 'Des draps de soie, des nappes brodées… et après la dernière fête, assez de vin renversé sur les nappes pour saouler tout le village. J\'ai essoré. On a trinqué.']] },
    aurevoir: ['Salut !', 'Et lave tes affaires, ça sent jusqu\'ici !'] });
F({ ev: 42, nom: 'Pépin', role: 'mendiant, ancien carrier', voix: 'humble, ironique, sans apitoiement.', tags: ['<Vie: noctambule>'],
    premiere: 'Une pièce pour un vieux carrier ? … Non ? Alors une minute pour l\'écouter. C\'est gratuit, et ça vaut à peu près pareil.',
    bonjourTous: ['Bonjour, bonne âme.', '~Il te tend sa main, puis la retire en souriant.|Je plaisante. À moitié.'],
    saisons: { 1: ['Le printemps, on dort dehors sans mourir. C\'est une bonne saison.'], 2: ['L\'été, les gens donnent plus. Ils ont chaud au cœur, ou alors c\'est le soleil.'], 3: ['L\'automne, faut trouver un porche avant l\'hiver. Les meilleurs sont déjà pris.'], 4: ['L\'hiver… Si tu me vois plus au printemps, tu sauras.'] },
    discuter: [K.DUR[1], 'J\'ai taillé les pierres du manoir du lord. Trente ans. Aujourd\'hui, je dors contre ses murs, et on me chasse.', 'On me donne du pain, parfois. Berthe, du bar. Et Tobias, qui me laisse dormir près d\'une lampe. Elle chauffe un peu.'],
    nouvelles: [K.LORD[5], K.LORD[2]],
    perso: { titre: 'Qu\'est-il arrivé ?', paliers: [[1, 'La vie. Elle arrive à tout le monde.'], [4, 'Une pierre m\'a broyé la jambe. Plus de travail, plus de paie, plus de maison. En trois semaines. Ça va vite, la chute.']] },
    options: [{ titre: 'Lui donner 5 G', cmds: paye(5, cat(A.se('Coin'), P('Pépin', '~Il regarde la pièce longtemps.|Merci. Vraiment. Ce soir, je mange chaud.'), H.affinite(2)), P('Pépin', 'T\'en as pas non plus, hein ? On est deux, alors.')) }],
    aurevoir: ['Que la route te soit douce.', 'Merci de m\'avoir parlé. Ça, personne ne le fait.'] });

module.exports = { carte: 29, fiches: fiches };
