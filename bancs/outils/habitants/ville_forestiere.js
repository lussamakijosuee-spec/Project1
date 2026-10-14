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
F(K.garde(11, 'Brunehaut', { role: 'garde de la porte nord', voix: 'sèche, sarcastique, dévisage les voyageurs.',
    premiere: 'Porte nord. Je suis Brunehaut. Si tu sors, c\'est la forêt. Si tu rentres, c\'est la ville. Si tu restes planté là, c\'est moi.',
    discuter: ['Je compte les gens qui sortent, et ceux qui rentrent. Le soir, il en manque toujours un ou deux.', 'Les chasseurs sortent à l\'aube et rentrent à la nuit. Ceux qui rentrent pas, on met leur nom sur une liste. La liste est longue.'],
    perso: { titre: 'Pourquoi garde ?', paliers: [[1, 'Parce que personne ne voulait de la porte nord.'], [4, 'Mon frère est sorti par cette porte il y a trois ans. Il n\'est pas rentré. Alors je la garde. Au cas où.']] } }));
F(K.garde(12, 'Oswin', { role: 'jeune garde de la porte nord, s\'ennuie', voix: 'jeune, las, rêve d\'être muté au manoir.',
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
F(K.garde(34, 'Rolf', { role: 'garde de la porte sud', voix: 'jovial, colossal, mange tout le temps.',
    premiere: 'Porte sud ! Rolf ! Tu veux un morceau de saucisse ? Non ? Plus pour moi.',
    discuter: ['Berthe, la cuisinière du bar, me garde les fonds de marmite. C\'est la femme de ma vie. Elle le sait pas.', 'On m\'a mis à la porte sud parce que je bouche le passage à moi tout seul. C\'est un compliment.'],
    perso: { titre: 'Tu manges tout le temps ?', paliers: [[1, 'Je grandis encore !'], [4, 'Quand j\'étais petit, on mangeait un jour sur deux. Depuis, je mange pour les deux jours.']] } }));
F(K.garde(35, 'Konrad', { role: 'garde de la porte sud, taciturne', voix: 'lent, deux mots par phrase, regard lourd.',
    premiere: 'Konrad.', bonjour: { 1: ['Hm.'], 2: ['…'], 3: ['Soir.'], 4: ['Nuit.'] },
    discuter: ['Rolf parle. Moi, je regarde.', 'Trop de soldats du lord, ces temps-ci. Pas bon.'],
    perso: { titre: 'Tu parles peu.', paliers: [[1, 'Oui.'], [4, 'J\'ai beaucoup parlé, avant. Au mauvais homme. Il est mort. Depuis, je réfléchis.']] } }));
F(K.garde(36, 'Béran', { role: 'vétéran, trois doigts à la main gauche', voix: 'cynique, las, a vu trop de guerres de lords.',
    premiere: 'Béran. Vétéran, qu\'ils disent. Ça veut dire vieux et encore vivant.',
    discuter: ['J\'ai fait trois guerres pour trois lords. Aucun ne se souvient de mon nom. Moi je me souviens de celui de mes morts.', 'Tu vois cette main ? Trois doigts. Les deux autres sont restés dans une plaine dont je sais même plus le nom.'],
    perso: { titre: 'Les guerres ?', paliers: [[1, 'Laisse les guerres où elles sont.'], [4, 'On se battait pour des frontières que personne ne voyait. Les nobles dînaient pendant qu\'on creusait.'], [7, 'Si le lord repart en guerre, je pars dans la montagne. Je me le suis promis. Je tiendrai pas ma promesse. On la tient jamais.']] } }));
F(K.garde(37, 'Aude', { role: 'garde de nuit', voix: 'calme, attentive, aime la nuit.',
    premiere: 'Aude, de la garde de nuit. Enfin, je commence le soir. Le jour, je dors, et je rêve de la nuit.',
    discuter: ['La nuit, la ville est à nous : aux gardes, aux chats et aux voleurs.', 'Tobias allume les lampes enchantées à la tombée de la nuit. Je le suis, parfois. C\'est beau, une ville qui s\'allume.'],
    perso: { titre: 'Tu aimes la nuit ?', paliers: [[1, 'La nuit ne ment pas. Le jour, tout le monde fait semblant.'], [4, 'Je suis née la nuit, dans une grange. Ma mère disait que je n\'ai jamais voulu du soleil.']] } }));

/* ── les habitants ────────────────────────────────────────────────────── */
F({ ev: 25, nom: 'Élise', role: 'jeune femme, se promène avec Tomas (la ronde tracée par JOKO)', voix: 'vive, impatiente, rêve d\'ailleurs.',
    premiere: 'Oh, bonjour ! On fait le tour de la ville. Encore. On fait toujours le tour de la ville.',
    bonjourTous: ['Bonjour !', '~Elle tire Tomas par la manche.|Viens, on continue !'],
    saisons: { 1: ['Au printemps, je veux partir. En été aussi. Et en automne. Et en hiver.'], 2: ['Il fait si beau ! Tomas dit qu\'il fera beau aussi demain, ici. C\'est ça le problème.'], 3: ['Les marchands repartent vers le sud. J\'aimerais monter dans une charrette.'], 4: ['L\'hiver, on fait le tour de la ville plus vite. Pour pas geler.'] },
    discuter: ['Tomas veut qu\'on se marie ici, qu\'on ait une maison ici, qu\'on meure ici. Moi, je veux voir la mer.', 'Tu as voyagé, toi ? Raconte. Non, attends, ne raconte pas, je vais être jalouse.', K.MAGIE[3]],
    nouvelles: [K.LORD[6], K.LORD[0]],
    perso: { titre: 'Et Tomas ?', paliers: [[1, 'Je l\'aime. C\'est bien le problème.'], [4, 'S\'il ne vient pas avec moi, je partirai quand même. Enfin… je crois. Tu partirais, toi ?']] },
    aurevoir: ['Bonne route ! Toi, au moins, tu en as une.', 'À bientôt !'] });
F({ ev: 26, nom: 'Tomas', role: 'jeune homme, se promène avec Élise', voix: 'posé, casanier, amoureux, un peu inquiet.',
    premiere: 'Bonjour. Tomas. Élise vous a déjà dit qu\'elle voulait partir ? Elle le dit à tout le monde.',
    bonjourTous: ['Bonjour.', '~Il suit Élise d\'un pas plus lent.|Doucement…'],
    saisons: { 1: ['Le printemps, je plante. Si on reste, on aura des pommes dans trois ans.'], 2: ['Il fait bon ici, non ? Pourquoi aller ailleurs ?'], 3: ['Je rentre le bois pour deux. Elle ne le sait pas encore.'], 4: ['L\'hiver, elle ne parle plus de partir. C\'est ma saison préférée.'] },
    discuter: ['Je suis tonnelier, comme mon père. On fait des tonneaux. Les tonneaux ne partent jamais nulle part, eux.', 'J\'ai une bague. Pour elle. Ça fait six mois que je la garde dans ma poche.'],
    nouvelles: [K.LORD[3], K.DUR[1]],
    perso: { titre: 'Et Élise ?', paliers: [[1, 'Elle est… tout.'], [4, 'Si elle part, je partirai avec elle. Je le sais. Mais je veux qu\'elle me le demande.']] },
    aurevoir: ['Bonne journée.', 'Si vous la voyez partir sans moi… dites-le-moi.'] });
F({ ev: 27, nom: 'Gaston', role: 'paysan, râle contre les taxes, finit ses journées au bar', voix: 'grognon, fataliste, drôle malgré lui.', tags: [BAR],
    premiere: 'Gaston. Paysan. Enfin, paysan pour le lord : je cultive, il récolte.',
    bonjour: { 1: ['Debout depuis quatre heures. Et toi, tu te promènes.'], 2: ['Hm. Encore une journée à nourrir des gens qui me méprisent.'], 3: ['Je vais au bar. Viens si tu veux. Tu paies si tu viens.'] }, bonjourTous: ['Quoi ?'],
    saisons: K.SAISON,
    discuter: ['Trois récoltes sur quatre vont au lord. La quatrième, les corbeaux. Moi, je mange ce qui tombe.', 'Mon arme ? Une serpe. Comme mon père. Une arme, qu\'ils disent. Moi je coupe du blé avec.', K.DUR[2]],
    nouvelles: [K.LORD[0], K.LORD[2], K.LORD[5]],
    perso: { titre: 'Votre ferme ?', paliers: [[1, 'Elle est au lord. J\'y habite, c\'est tout.'], [4, 'Ma femme est morte en couches, avec le petit. J\'ai continué à labourer le lendemain. Le lord ne donne pas de jour pour ça.']] },
    aurevoir: ['Ouais.', 'Va, va.'] });
F({ ev: 28, nom: 'Hilde', role: 'mère de quatre enfants, débordée', voix: 'pressée, affectueuse, parle en surveillant ses enfants.', tags: ['<Agenda: 9-11 0,24>'],
    premiere: 'Bonjour ! Pardon, je surveille les petits. JULES ! Lâche ce chat ! … Pardon. Bonjour.',
    bonjour: { 1: ['Je vais au marché, les petits ont mangé tout le pain.'], 2: ['Ils font la sieste. Enfin, deux sur quatre. C\'est déjà ça.'], 3: ['L\'heure du bain. Personne ne veut. Tout le monde y passe.'] }, bonjourTous: ['Bonjour !'],
    saisons: { 1: ['Au printemps, ils sortent tous et reviennent couverts de boue.'], 2: ['L\'été, ils nagent dans la rivière. Je compte les têtes toutes les cinq minutes.'], 3: ['L\'automne, les rhumes. Quatre rhumes. Un seul mouchoir.'], 4: ['L\'hiver, ils restent à la maison. Je deviens folle.'] },
    discuter: [K.MAGIE[1], 'Quatre enfants, un mari aux champs et une maison qui fuit. Et on me demande si je m\'ennuie.', 'Mon aînée veut être garde, comme Ida. Je lui ai dit non. Elle a dit « trop tard ».'],
    nouvelles: [K.LORD[1], K.MAGIE[0]],
    perso: { titre: 'Et vous, Hilde ?', paliers: [[1, 'Moi ? Je n\'ai pas le temps d\'être moi.'], [4, 'Avant les enfants, je chantais. Au bar, le soir. Colin me rappelle cette époque. Je ne le lui dirai jamais.']] },
    aurevoir: ['Bonne journée ! JULES ! POSE ÇA !', 'À bientôt !'] });
F({ ev: 29, nom: 'Fernand', role: 'vieux paysan, prédit le temps', voix: 'lent, sage, un peu sourd.',
    premiere: 'Hein ? Bonjour ? Oui, bonjour. Fernand. Je dis le temps qu\'il fera. Gratuitement. C\'est pour ça qu\'on m\'écoute pas.',
    bonjourTous: ['Hein ?', 'Bonjour, bonjour.'],
    saisons: { 1: ['Il pleuvra trois jours. Puis il fera beau. Puis il pleuvra.'], 2: ['Orage demain. Mes genoux le disent. Mes genoux ne mentent jamais.'], 3: ['Hiver précoce. Les écureuils sont nerveux.'], 4: ['Encore un mois de gel. Peut-être deux. Rentre ton bois.'] },
    discuter: ['J\'ai vu passer quatre lords. Ils sont tous partis. Les champs sont restés.', 'Mes petits-enfants sont en ville. Ils viennent quand ils ont besoin d\'argent. Je n\'en ai pas. Alors ils ne viennent pas.'],
    nouvelles: [K.LORD[7]],
    perso: { titre: 'Vos genoux ?', paliers: [[1, 'Ils prédisent la pluie mieux que n\'importe quel mage.'], [4, 'Je suis tombé d\'un toit à vingt ans. Depuis, ils me disent le temps. C\'est le seul cadeau que le toit m\'a fait.']] },
    aurevoir: ['Hein ? Oui, au revoir.', 'Prends un manteau.'] });
F({ ev: 38, nom: 'Colette', role: 'marchande d\'œufs, amie de Mireille', voix: 'bavarde, rieuse, chuchote en regardant autour.', tags: [BAR],
    premiere: 'Des œufs frais ! … Ah, pardon, tu n\'en veux pas. Colette. On se connaît pas, mais ça va venir.',
    bonjourTous: ['Bonjour, bonjour !', '~Elle rajuste son panier.|Tu sais la dernière ?'],
    saisons: { 1: ['Les poules pondent comme jamais. Les prix baissent. Je pleure.'], 2: ['La chaleur fait couver les poules. Plus d\'œufs, que des poussins.'], 3: ['L\'automne, les renards. J\'ai perdu trois poules cette semaine.'], 4: ['L\'hiver, un œuf vaut une pièce. Je suis riche un mois par an.'] },
    discuter: ['Mireille, au bar, dit que c\'est moi qui répands les rumeurs. C\'est faux. C\'est elle. Moi je les vérifie.', K.MAGIE[4], 'Mes poules ont des noms de nobles. La plus grosse s\'appelle Madame la Duchesse.'],
    nouvelles: [K.LORD[6], K.LORD[1], K.DUR[0]],
    perso: { titre: 'Des œufs, alors ?', paliers: [[1, 'Deux pièces la douzaine. Enfin, douze pour un ami. Tu n\'es pas encore un ami.'], [3, 'Tiens, prends-en un. Cadeau. Pour que tu reviennes.']] },
    options: [{ titre: 'Acheter des œufs (5 G)', cmds: paye(5, cat(A.se('Item1'), A.objet(44, 2), P('Colette', 'Voilà ! Enfin… des pommes. Les poules ont fait grève. Mais c\'est bon aussi.'), H.affinite(1)), P('Colette', 'Pas d\'or ? Pas d\'œufs. C\'est la loi des poules.')) }],
    aurevoir: ['Et répète pas ce que je t\'ai dit !', 'À bientôt !'] });
F({ ev: 39, nom: 'Tobias', role: 'allumeur des lampes enchantées de la ville', voix: 'doux, poétique, parle de la lumière comme d\'un être vivant.',
    premiere: 'Tobias. J\'allume les lampes. Enfin, je leur rappelle de s\'allumer. Elles sont enchantées, mais elles oublient.',
    bonjour: { 1: ['Je viens de les éteindre toutes. Elles dorment.'], 2: ['Je vérifie les pierres des lampes. Certaines faiblissent.'], 3: ['C\'est l\'heure ! Je fais ma tournée. Une par une.', '~Il tapote une lampe du bout des doigts. Elle s\'allume.'], 4: ['Toutes allumées. Maintenant, je veille.'] },
    saisons: { 1: ['Le printemps, les nuits raccourcissent. Mes lampes se reposent.'], 2: ['L\'été, les insectes tournent autour des lampes. Ils ne comprennent pas que ce n\'est pas le soleil.'], 3: ['L\'automne, j\'allume plus tôt chaque jour. Deux minutes. Je les compte.'], 4: ['L\'hiver, les lampes brûlent seize heures. Elles fatiguent, comme moi.'] },
    discuter: ['Une lampe enchantée dure dix ans. Après, la pierre devient grise. On la garde quand même. On ne jette pas une lumière.', 'Le lord a promis vingt lampes de plus pour la ville basse. Il y a trois ans. J\'attends.', K.MAGIE[5]],
    nouvelles: [K.LORD[3]],
    perso: { titre: 'Pourquoi les lampes ?', paliers: [[1, 'Quelqu\'un doit le faire.'], [4, 'Ma fille avait peur du noir. Elle n\'est plus là. Mais la ville, elle, n\'aura jamais peur du noir.']] },
    aurevoir: ['Que ta route soit éclairée.', 'Bonne nuit, ou bonne journée. Je confonds toujours.'] });
F({ ev: 40, nom: 'Kaze', role: 'bretteur de passage', voix: 'laconique, précis, regard d\'acier.',
    premiere: '~Il ne te regarde pas, mais tu sens qu\'il t\'a vu arriver depuis longtemps.|Kaze. De passage.',
    bonjourTous: ['…', 'Hm. Toi.'],
    saisons: { 1: ['La neige fond. Les routes rouvrent. Je repars bientôt.'], 2: ['Trop de monde, l\'été.'], 3: ['Le vent tourne.'], 4: ['On ne voyage pas l\'hiver. On attend.'] },
    discuter: ['Ma lame ne s\'use pas. Moi, si.', 'On m\'a proposé d\'entrer au service du lord. J\'ai refusé. Je ne sers pas ceux qui ne se battent pas eux-mêmes.', 'Tu tiens bien ton arme. Mieux que la plupart.'],
    nouvelles: [K.LORD[4]],
    perso: { titre: 'Pourquoi voyager ?', paliers: [[1, 'Parce que.'], [5, 'Je cherche quelqu\'un qui se bat mieux que moi. Pour apprendre. Ou pour finir.']] },
    aurevoir: ['Hm.', 'Garde ta garde haute.'] });
F({ ev: 41, nom: 'Mado', role: 'lavandière', voix: 'forte, franche, les mains rouges, rit fort.', tags: [BAR],
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
