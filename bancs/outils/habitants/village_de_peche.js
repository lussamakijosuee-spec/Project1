/*
 * LE VILLAGE DE PÊCHE (carte 33) — pêcheurs, ravaudeurs, la garde du port.
 * VieDuVillage y tournait déjà : ses gardes font leur ronde la nuit, les
 * villageois rentrent à 21 h. Grod, le Pêcheur, les âmes, les quêtes et le
 * personnage masqué (« tu la vois toi aussi ? ») ne sont pas touchés.
 */
'use strict';
var K = require('./_communs.js');
var P = K.P, A = K.A, C = K.C, si = K.si, cat = K.cat, H = K.H, paye = K.paye, boutique = K.boutique;
var fiches = [];
function F(f) { fiches.push(f); }
var LAC = {
    1: ['La glace du lac a cédé. Les barques ressortent.', 'Printemps. Le poisson remonte, et les dettes descendent un peu.'],
    2: ['Le lac est calme, l\'été. Trop calme. On n\'aime pas quand il est trop calme.', 'On pêche à l\'aube, on dort l\'après-midi, on répare le soir.'],
    3: ['Les tempêtes d\'automne. Une barque de moins chaque année.', 'L\'automne, les poissons sont gras et les pêcheurs maigres.'],
    4: ['On perce la glace pour pêcher. On perd parfois un seau. Parfois pire.', 'L\'hiver, le village sent la fumée et le poisson séché.']
};

F({ ev: 16, nom: 'Jonas', role: 'recrue de la garde, fils de pêcheur', voix: 'timide, sincère, se sent trahir son père.',
    premiere: 'Jonas. Recrue. Mon père voulait que je sois pêcheur. Je suis garde. On ne se parle plus beaucoup.',
    bonjourTous: ['Salut.', 'Garde Jonas, à… enfin, bonjour.'],
    saisons: LAC,
    discuter: ['La garde paie un peu mieux que la pêche. Et on ne se noie pas. En général.', 'Moi, c\'est l\'épée. Mon père, c\'était le harpon. On a tous une arme. On l\'utilise pas pareil.', K.DUR[1]],
    nouvelles: [K.LORD[5], K.LORD[4]],
    perso: { titre: 'Et ton père ?', paliers: [[1, 'Il pêche.'], [4, 'Il m\'a dit que je trahissais le lac. Je lui ai dit que le lac avait pris mon grand-père et mon oncle. Il n\'a rien répondu. Il est sorti pêcher.']] },
    aurevoir: ['Salut.', 'Si tu vois mon père… non, rien.'] });
F({ ev: 17, nom: 'Orin', role: 'ravaudeur de filets', voix: 'patient, taiseux, parle en nouant ses filets.',
    premiere: '~Il ne lève pas les yeux de son filet.|Orin. Je répare ce que le lac déchire.',
    bonjourTous: ['Hm.', '~Ses doigts nouent le fil sans s\'arrêter.|Bonjour.'],
    saisons: LAC,
    discuter: ['Un filet, c\'est des trous attachés ensemble. Mon travail, c\'est de garder les bons trous.', 'Les jeunes veulent des filets enchantés. Ça existe. Ça coûte un an de pêche. Moi je répare à la main.', 'Grod boit au lieu de pêcher. Je répare ses filets quand même. Il paie en bière. Je ne bois pas.'],
    nouvelles: [K.LORD[2]],
    perso: { titre: 'Vos mains ?', paliers: [[1, 'Elles savent faire une chose. C\'est assez.'], [4, 'Il me manque un doigt. Une corde, une tempête, un mauvais nœud. Depuis, mes nœuds sont parfaits.']] },
    aurevoir: ['Hm.', 'Bonne pêche.'] });
F({ ev: 18, nom: 'Emma', role: 'Emma Fieldensong, sixième année à l\'Académie, « la Princesse »', voix: 'calme, acérée, insulte sans jamais crier.', tags: ['<Logis: 45>'],
    premiere: '~Elle te toise, de la tête aux bottes.|Emma Fieldensong. Sixième année. Tu n\'as pas besoin de te présenter : je vois déjà ce que tu vaux.',
    bonjourTous: ['… Encore toi.', '~Une flamme rouge-noir lui court entre les doigts, puis s\'éteint.|Oui ?'],
    saisons: { 1: ['Le printemps. Les nouvelles recrues. Indisciplinées. Bruyantes. Je les classe déjà.'], 2: ['La chaleur ne me gêne pas. Je suis la chaleur.'], 3: ['L\'automne. La saison des classements. Je n\'ai pas l\'intention de descendre.'], 4: ['L\'hiver. Le froid ralentit les autres. Pas moi.'] },
    discuter: ['Le Feu Infernal ne se maîtrise pas par le talent. Il se maîtrise par la discipline. Le talent, c\'est ce que disent ceux qui n\'en ont pas.', 'Edwin parle trop. Mais il a raison trop souvent pour que je le lui dise.', 'Première faille sauvage, encadrée par la garde royale. On me surveille. C\'est la garde qui devrait s\'inquiéter.', 'Celestia von Aurelia ? Je ne parle pas d\'elle. … Elle a perdu son dernier duel. Contre moi. Je n\'en parle pas.'],
    nouvelles: ['On dit que je suis arrogante. On dit aussi que je gagne. Les deux sont vrais, et l\'un explique l\'autre.', 'Naomi Briarley m\'a écrit. Une lettre gentille. Je ne sais pas quoi en faire. Je l\'ai gardée.'],
    perso: { titre: 'Ta lignée ?', paliers: [[1, 'Le Feu Infernal. Des flammes rouge-noir, plus chaudes que les tiennes. Ne touche pas.'], [4, 'Si je pousse trop, le corps chauffe. Les mains tremblent, la vue se resserre. On appelle ça le contrecoup de lignée. Je n\'en parle à personne. … Toi, tu n\'es personne.'], [7, 'Dans une vraie crise, je ne lâche personne. L\'échec me blesse plus que l\'aide. Si un jour on se bat ensemble… ne me remercie pas. Ce serait gênant.']] },
    aurevoir: ['Ne traîne pas.', 'Tu peux partir. Je t\'y autorise.'] });
F({ ev: 19, nom: 'Sora', role: 'petite fille qui ramasse des coquillages, fille du pêcheur', voix: 'curieuse, vive, pose des questions sans attendre les réponses.',
    premiere: 'T\'as vu ce coquillage ? Il est violet ! Enfin, un peu violet. Tu veux le voir ? Non ? Je m\'appelle Sora !',
    bonjourTous: ['Coucou !', '~Elle a les poches pleines de coquillages qui tintent.|Salut !'],
    saisons: { 1: ['Au printemps, la plage est pleine de trésors ! Enfin, de coquillages.'], 2: ['L\'été, je nage jusqu\'au rocher. Maman dit non. Je nage quand même.'], 3: ['L\'automne, les vagues ramènent des choses bizarres. Une botte, une fois. Sans le pied.'], 4: ['L\'hiver, le lac gèle au bord. Je glisse. Maman dit non.'] },
    discuter: ['Quand je serai grande, je veux une boîte à musique magique. Ou un dragon ! Un dragon, ce serait le mieux.', 'Mon papa est pêcheur. Il dit que les coquillages, c\'est la mer qui écrit. Moi, je les lis !', 'Tu savais que les poissons dorment les yeux ouverts ? Moi j\'ai essayé. Ça pique.'],
    nouvelles: ['Le monsieur au masque, au bout de la plage, il parle tout seul. Maman dit de pas y aller. Alors j\'y vais pas. Presque.', 'Edwin, le fils d\'Annick, il porte des lunettes qui voient le mana. Il m\'a dit que le mien était « joyeux ». Je le savais.'],
    perso: { titre: 'Tes coquillages ?', paliers: [[1, 'J\'en ai cent-douze ! Enfin, cent-dix. J\'en ai mangé deux. C\'était pas des coquillages.'], [3, 'Je les garde pour papa. Quand il rentre de la pêche, je lui montre le plus beau. Il fait semblant d\'être surpris. À chaque fois.']] },
    options: [{ titre: 'Accepter un coquillage', cmds: cat(A.se('Item1'), P('Sora', 'Tiens ! C\'est le plus violet. Enfin, le deuxième plus violet. Le premier, c\'est pour papa.'), H.affinite(1)) }],
    aurevoir: ['Salut ! Reviens voir mes coquillages !', 'Bye !'] });
F({ ev: 21, nom: 'Barnabé', role: 'charpentier de barques', voix: 'bourru, fier de son métier, jure beaucoup (sans dieux).',
    premiere: 'Barnabé. Je fais les barques. Si elle coule, c\'est pas la barque, c\'est le pêcheur.',
    bonjourTous: ['Salut.', '~Il rabote une planche en sifflant faux.|Quoi ?'],
    saisons: { 1: ['Le printemps, tout le monde veut sa barque réparée pour hier.'], 2: ['L\'été, le bois sèche bien. C\'est le moment de construire.'], 3: ['Les tempêtes m\'amènent du travail. C\'est pas une bonne nouvelle, même si ça paie.'], 4: ['L\'hiver, je fais des cercueils. Le bois est le même. Le client, non.'] },
    discuter: ['Une bonne barque, c\'est trente ans. Un bon pêcheur, souvent moins.', 'Le lord veut une barque d\'apparat pour ses nobles. Dorée. Sur NOTRE lac. Qu\'ils se noient avec, tiens.', K.DUR[2]],
    nouvelles: [K.LORD[3], K.LORD[0]],
    perso: { titre: 'Votre plus belle barque ?', paliers: [[1, 'Celle que je finirai demain.'], [4, 'Celle de mon fils. Il l\'a prise un matin de tempête. On a retrouvé la barque. Intacte. Elle est toujours dans mon atelier. Je la vendrai jamais.']] },
    aurevoir: ['Salut.', 'Et apprends à nager.'] });
F({ ev: 22, nom: 'Edwin', role: 'Edwin Bramble, sixième année à l\'Académie Rubis, « l\'Encyclopédie Vivante »', voix: 'enthousiaste, bavard, incapable de faire court.', tags: ['<Logis: 11,20>'],
    premiere: 'Oh ! Bonjour ! Edwin Bramble, sixième année à l\'Académie Rubis, filière de la Parole — enfin, apprenti maître de Parole, pas encore maître, la nuance compte, c\'est d\'ailleurs une nuance que le règlement de l\'académie précise à l\'article… pardon.|Bonjour.',
    bonjourTous: ['Bonjour ! Tu savais que… non, rien. Enfin, si. Plus tard.', '~Il remonte ses lunettes. Derrière, ses yeux suivent le mana autour de toi.|Oh. Ton mana est intéressant, aujourd\'hui.'],
    apresAccueil: cat(
        si(C.acteur(2), P('Edwin', '~Il te regarde, puis il regarde Korrah, et il oublie de respirer.|Korrah ! Bonjour. Tu… ta posture est… excellente. Je veux dire : bonjour.')),
        si(C.acteur(4), P('Edwin', 'Aël ! On était à la même académie ! Tu te souviens de moi ? Non ? C\'est normal : je corrigeais tout le monde, on m\'évitait.'))),
    saisons: { 1: ['Au printemps, l\'eau du village a un mana plus clair. Je l\'ai noté. Dans trois carnets.'], 2: ['L\'été, maman veut que je mange dehors. Je lis dehors. C\'est presque pareil.'], 3: ['L\'automne, c\'est la saison des expéditions. La mienne approche. Ma première faille. Je ne suis pas nerveux : je suis informé.'], 4: ['L\'hiver, je relis mes notes de première année. Je me corrige. Avec bienveillance.'] },
    discuter: ['Mon héritage s\'appelle « N\'oublie jamais » : ce que j\'ai lu, je le garde. Ça ne veut pas dire que je comprends tout. Ça veut dire que je peux comparer. Et comparer, c\'est le début de comprendre.', 'Ignorer quelque chose, ce n\'est pas une faute. C\'est une question à laquelle personne n\'a encore répondu. Pose-la-moi !', 'Mes lunettes me montrent la nature du mana : le positif, le négatif, le spirituel. Le tien est… non, je te le dirai quand tu seras prêt. Ou maintenant. Tu es prêt ?', 'Je suis du soutien : la Parole qui soigne, celle qui protège. Je n\'ai pas la force brute d\'Astrid. Mais je sais ce qu\'elle va faire avant elle.'],
    nouvelles: ['Je suis rentré au village pour une expédition : plusieurs élèves, une faille sauvage, la garde royale qui nous encadre. C\'est ma première fois. J\'ai lu tout ce qui existe sur le sujet. Deux fois.', 'Emma Fieldensong est ici aussi. Elle m\'appelle « l\'Encyclopédie ». Je crois que c\'est un compliment. Je l\'ai noté comme tel.'],
    perso: { titre: 'Ta première faille ?', paliers: [[1, 'J\'ai tout lu. Les cartes, les rapports, les dossiers des expéditions. Je sais tout. Sauf ce que ça fait.'], [4, 'Maman croit que je ne dors pas à cause des livres. Je ne dors pas à cause de la faille. … Ne lui dis pas.'], [6, 'Si j\'ai peur ? Oui. Mais la peur, c\'est une information. Je la range avec les autres, et j\'avance.']] },
    aurevoir: ['Au revoir ! Et si tu as une question, n\'importe laquelle, vraiment n\'importe laquelle…', 'À bientôt ! J\'ai encore trois choses à te dire. Quatre.'] });
F({ ev: 23, nom: 'Régis', role: 'vieux capitaine à la retraite', voix: 'grandiloquent, nostalgique, exagère ses campagnes.',
    premiere: 'Capitaine Régis, en retraite ! J\'ai commandé des navires sur des mers que tu ne verras jamais. Enfin, un navire. Sur un lac. Mais un grand lac.',
    bonjourTous: ['Mes respects !', '~Il se redresse, main sur le cœur.|Capitaine Régis, présent !'],
    saisons: LAC,
    discuter: ['J\'ai affronté une tempête de trois jours. Ou de trois heures. À mon âge, les heures sont longues.', 'Les jeunes n\'ont plus de respect pour les anciens. Les anciens n\'en ont jamais eu pour les jeunes. C\'est l\'équilibre.', 'Le lord m\'a décoré, autrefois. Un autre lord. Celui-ci ne décore que ses nobles.'],
    nouvelles: [K.LORD[7], K.LORD[1]],
    perso: { titre: 'Votre navire ?', paliers: [[1, 'La Mouette Grise ! Le plus beau bâtiment du lac !'], [4, 'Il a coulé. Pas en tempête. À quai, un soir de fête. Trop de bière, trop de nobles à bord. Je n\'étais même pas dessus. C\'est ça le pire.']] },
    aurevoir: ['Bon vent !', 'Rompez !'] });
F({ ev: 24, nom: 'Annick', role: 'femme de pêcheur, langue bien pendue, mère d\'Edwin', voix: 'bavarde, drôle, lucide.', tags: ['<Logis: 11,20>'],
    premiere: 'Annick. Femme de pêcheur. Ça veut dire : femme qui attend. Mais moi, j\'attends en parlant.',
    bonjourTous: ['Salut, toi !', '~Elle vide un seau de poissons en discutant.|Bonjour !'],
    saisons: LAC,
    discuter: ['Mon mari dit que les poissons l\'écoutent. Moi, je dis qu\'ils se moquent de lui.', 'Mon fils, Edwin, est à l\'Académie Rubis. Il parle comme un livre ouvert. Un gros livre. Avec des notes en bas de page.', 'Edwin est rentré pour une expédition dans une faille. Sa première. Je lui fais des tartines. C\'est tout ce que je sais faire contre une faille.', K.MAGIE[3]],
    nouvelles: [K.LORD[6], K.LORD[2], 'La fille du vieux pêcheur cherche des Bocaux à Lucioles pour son père. Il voit plus son fil, la nuit.'],
    perso: { titre: 'Et Edwin ?', paliers: [[1, 'Il se souvient de tout ce qu\'il lit. Moi, je me souviens de tout ce qu\'il ne mange pas.'], [4, 'Petit, il corrigeait le curé, le maire et le percepteur. Le même jour. On a su ce jour-là qu\'il irait loin. Ou qu\'il partirait vite.']] },
    options: [{ titre: 'Acheter du poisson', cmds: boutique([['objet', 45], ['objet', 46]]) }],
    aurevoir: ['Salut !', 'Et si tu vois mon fils, dis-lui de rentrer manger.'] });
[[25, 'Hervé', 'ancien pêcheur passé garde, regrette le lac'], [26, 'Gwen', 'garde, fille de la meunière du port'], [27, 'Ewen', 'garde, jeune et hâbleur'],
 [28, 'Morgane', 'garde, experte en nœuds et en bagarres'], [29, 'Loïc', 'garde, poète raté']].forEach(function (g, i) {
    var perso = [
        { titre: 'Le lac te manque ?', paliers: [[1, 'Tous les jours.'], [4, 'J\'ai rendu mon harpon le jour où mon frère s\'est noyé. J\'ai pris une lance. On ne pêche rien, avec une lance.']] },
        { titre: 'Ta mère ?', paliers: [[1, 'Elle mout le grain du port. Elle me trouve trop maigre pour être garde.'], [4, 'Elle veut que je me marie. Je veux qu\'elle arrête de vouloir. On est coincées.']] },
        { titre: 'Tes exploits ?', paliers: [[1, 'J\'en ai des tas ! Enfin, j\'en aurai.'], [4, 'Le seul combat que j\'ai mené, c\'était contre un ivrogne. Il a gagné.']] },
        { titre: 'Les nœuds ?', paliers: [[1, 'Je sais faire trente nœuds. Aucun ne se défait.'], [4, 'Mon père m\'a appris les nœuds avant de m\'apprendre à marcher. Il disait qu\'une femme qui sait nouer ne se fait jamais attacher.']] },
        { titre: 'Tes poèmes ?', paliers: [[1, 'Ils sont nuls. Tu veux en entendre un ?'], [3, '« Ô lac, ô lac, tu prends et ne rends pas, / comme le percepteur du lord, ô lac. » … Tu vois. Nul.']] }
    ][i];
    F(K.garde(g[0], g[1], { role: g[2] + ' (garde du port)', voix: 'garde du port : sent le sel et la fatigue.', premiere: 'Garde du port. ' + g[1] + '. Ici, on surveille les barques et les ivrognes. Surtout les ivrognes.',
        saisons: LAC, discuter: ['Le port la nuit, c\'est des bruits d\'eau et des bruits de pas. Faut savoir lesquels sont normaux.'], perso: perso }));
});

module.exports = { carte: 33, fiches: fiches };
