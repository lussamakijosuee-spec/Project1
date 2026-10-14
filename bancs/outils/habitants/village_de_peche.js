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
F({ ev: 18, nom: 'Maëlle', role: 'lit le vent avec un charme de coquillages', voix: 'lente, attentive, parle au vent autant qu\'aux gens.',
    premiere: 'Tu entends ? Non ? Le vent tourne à l\'ouest. Demain, pas de barque. Maëlle. Je dis le vent aux pêcheurs.',
    bonjourTous: ['~Elle tient un collier de coquillages qui tintent.|Écoute…', 'Bonjour. Le vent est bon, aujourd\'hui.'],
    saisons: { 1: ['Le vent du printemps est menteur. Il promet et il reprend.'], 2: ['L\'été, le vent dort. Les coquillages aussi.'], 3: ['L\'automne, le vent crie. Je dis aux barques de rester. Certaines ne m\'écoutent pas.'], 4: ['L\'hiver, le vent est froid et honnête. Il dit exactement ce qu\'il va faire.'] },
    discuter: ['Ce n\'est pas de la grande magie. Juste un charme que ma grand-mère m\'a appris. Les coquillages tintent quand l\'orage vient.', 'Les pêcheurs rient de moi. Puis ils viennent me voir avant de sortir.', K.MAGIE[5]],
    nouvelles: ['Le lac est plus profond qu\'avant, disent les vieux. Le vent, lui, ne dit rien là-dessus. C\'est ça qui m\'inquiète.', K.LORD[6]],
    perso: { titre: 'Le charme ?', paliers: [[1, 'Des coquillages et un nœud. Rien de plus.'], [4, 'Il n\'a pas tinté, la nuit où mon mari est sorti. Ou alors je ne l\'ai pas entendu. Je dormais. Je ne dors plus beaucoup, depuis.']] },
    aurevoir: ['Que le vent te soit doux.', 'Écoute le vent, en partant.'] });
F({ ev: 19, nom: 'Sora', role: 'petite fille qui ramasse des coquillages', voix: 'curieuse, vive, pose des questions sans attendre les réponses.',
    premiere: 'T\'as vu ce coquillage ? Il est violet ! Enfin, un peu violet. Tu veux le voir ? Non ? Je m\'appelle Sora !',
    bonjourTous: ['Coucou !', '~Elle a les poches pleines de coquillages qui tintent.|Salut !'],
    saisons: { 1: ['Au printemps, la plage est pleine de trésors ! Enfin, de coquillages.'], 2: ['L\'été, je nage jusqu\'au rocher. Maman dit non. Je nage quand même.'], 3: ['L\'automne, les vagues ramènent des choses bizarres. Une botte, une fois. Sans le pied.'], 4: ['L\'hiver, le lac gèle au bord. Je glisse. Maman dit non.'] },
    discuter: ['Quand je serai grande, je veux une boîte à musique magique. Ou un dragon ! Un dragon, ce serait le mieux.', 'Maëlle m\'apprend à écouter le vent. Il dit rien, le vent. Mais je fais semblant.', 'Tu savais que les poissons dorment les yeux ouverts ? Moi j\'ai essayé. Ça pique.'],
    nouvelles: ['Le monsieur au masque, au bout de la plage, il parle tout seul. Maman dit de pas y aller. Alors j\'y vais pas. Presque.'],
    perso: { titre: 'Tes coquillages ?', paliers: [[1, 'J\'en ai cent-douze ! Enfin, cent-dix. J\'en ai mangé deux. C\'était pas des coquillages.'], [3, 'Je les garde pour papa. Il reviendra de la pêche un jour, et je lui montrerai. Ça fait longtemps qu\'il pêche.']] },
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
F({ ev: 22, nom: 'Yvon', role: 'vendeur de poisson', voix: 'gouailleur, crie ses prix, rit de tout.',
    premiere: 'Du frais ! Du frais ! Pêché ce matin ! … Ou hier. Mais il avait l\'air frais hier aussi ! Yvon, poissonnier !',
    bonjourTous: ['Du frais !', 'Salut, toi ! T\'as faim ?'],
    saisons: LAC,
    discuter: ['Un poisson, faut le vendre avant qu\'il se mette à parler. Parce que là, il dit des choses pas belles.', 'Les soldats du lord viennent chercher du poisson « pour la garnison ». Gratis. Ils ont bon appétit, la garnison.', K.MAGIE[0]],
    nouvelles: [K.LORD[2], K.LORD[3]],
    perso: { titre: 'Toujours content ?', paliers: [[1, 'Faut bien ! Les tristes vendent rien.'], [4, 'Le soir, je compte ce qui reste. Souvent, c\'est plus que ce que j\'ai vendu. Alors je le mange. On est gros, dans ma famille. Et fauchés.']] },
    options: [{ titre: 'Acheter du poisson', cmds: boutique([['objet', 45], ['objet', 46]]) }],
    aurevoir: ['Reviens pour le frais !', 'Salut !'] });
F({ ev: 23, nom: 'Régis', role: 'vieux capitaine à la retraite', voix: 'grandiloquent, nostalgique, exagère ses campagnes.',
    premiere: 'Capitaine Régis, en retraite ! J\'ai commandé des navires sur des mers que tu ne verras jamais. Enfin, un navire. Sur un lac. Mais un grand lac.',
    bonjourTous: ['Mes respects !', '~Il se redresse, main sur le cœur.|Capitaine Régis, présent !'],
    saisons: LAC,
    discuter: ['J\'ai affronté une tempête de trois jours. Ou de trois heures. À mon âge, les heures sont longues.', 'Les jeunes n\'ont plus de respect pour les anciens. Les anciens n\'en ont jamais eu pour les jeunes. C\'est l\'équilibre.', 'Le lord m\'a décoré, autrefois. Un autre lord. Celui-ci ne décore que ses nobles.'],
    nouvelles: [K.LORD[7], K.LORD[1]],
    perso: { titre: 'Votre navire ?', paliers: [[1, 'La Mouette Grise ! Le plus beau bâtiment du lac !'], [4, 'Il a coulé. Pas en tempête. À quai, un soir de fête. Trop de bière, trop de nobles à bord. Je n\'étais même pas dessus. C\'est ça le pire.']] },
    aurevoir: ['Bon vent !', 'Rompez !'] });
F({ ev: 24, nom: 'Annick', role: 'femme de pêcheur, langue bien pendue', voix: 'bavarde, drôle, lucide.',
    premiere: 'Annick. Femme de pêcheur. Ça veut dire : femme qui attend. Mais moi, j\'attends en parlant.',
    bonjourTous: ['Salut, toi !', '~Elle vide un seau de poissons en discutant.|Bonjour !'],
    saisons: LAC,
    discuter: ['Mon mari dit que les poissons l\'écoutent. Moi je dis qu\'ils se moquent de lui.', 'Grod doit trois mois de bière à l\'auberge de la Ville Forestière. Il le raconte comme une victoire.', K.MAGIE[3], K.DUR[0]],
    nouvelles: [K.LORD[6], K.LORD[2], 'La fille du vieux pêcheur cherche des Bocaux à Lucioles pour son père. Il voit plus son fil, la nuit.'],
    perso: { titre: 'Votre mari ?', paliers: [[1, 'Il est sur le lac. Il est toujours sur le lac.'], [4, 'Chaque fois qu\'il sort, je range sa chemise propre sur la chaise. Pour qu\'il ait une raison de rentrer. C\'est bête. Ça marche depuis vingt ans.']] },
    aurevoir: ['Salut !', 'Et si tu vois mon mari, dis-lui de rentrer manger.'] });
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
