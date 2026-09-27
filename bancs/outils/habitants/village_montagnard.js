/*
 * LE VILLAGE MONTAGNARD (carte 36) — le village sous le manoir du lord.
 * Les soldats y sont entrés « en passant », et y sont restés (la quête du
 * Milicien, écrite plus tôt). La foule de la scène (interrupteur 40), les
 * personnages d'histoire, le fossoyeur, la tisserande et le Milicien ne sont
 * pas touchés.
 */
'use strict';
var K = require('./_communs.js');
var P = K.P, A = K.A, C = K.C, si = K.si, cat = K.cat, H = K.H, paye = K.paye;
var fiches = [];
function F(f) { fiches.push(f); }
var MONT = {
    1: ['La neige fond sur les pentes. Les torrents grondent. On dort mal, au printemps.'],
    2: ['L\'été, on monte les bêtes aux alpages. Le village se vide à moitié.'],
    3: ['Les bêtes redescendent. Le froid aussi.'],
    4: ['Le col est fermé. Jusqu\'au dégel, on ne voit personne. Sauf les soldats.']
};

F(K.garde(9, 'Hald', { role: 'sentinelle devant le manoir, suit la ronde tracée par JOKO', tags: ['<Vie: fixe>'], voix: 'raide, loyal au lord, mal à l\'aise avec les villageois.',
    premiere: 'Halte. Le manoir du lord. On n\'entre pas sans raison. Tu as une raison ? … Bon. Circule.',
    saisons: MONT,
    discuter: ['Les villageois nous regardent de travers. Je comprends. Je ferais pareil.', 'On nous a dit de surveiller la route. De qui ? De quoi ? On ne nous dit pas.'],
    nouvelles: ['Le lord reçoit beaucoup, cette saison. On garde une porte que seuls les nobles franchissent.'],
    perso: { titre: 'Tu es d\'ici ?', paliers: [[1, 'De la plaine.'], [4, 'On m\'a envoyé ici « pour une semaine ». Ça fait quatre mois. Ma femme ne sait même pas où je suis.']] } }));
F(K.garde(10, 'Brisa', { role: 'sentinelle devant le manoir, suit la ronde tracée par JOKO', tags: ['<Vie: fixe>'], voix: 'cynique, lucide, rit jaune.',
    premiere: 'Sentinelle Brisa. Je garde le manoir. Ou je garde les villageois dehors. Ça dépend du point de vue.',
    saisons: MONT,
    discuter: ['Les soldats en ville boivent sans payer. Je le signale. Le rapport se perd. Toujours.', 'Les nobles arrivent en carrosse, repartent en carrosse. Entre les deux, on n\'entend que de la musique.'],
    nouvelles: [K.LORD[4], K.LORD[7]],
    perso: { titre: 'Et toi ?', paliers: [[1, 'Moi, je fais mon temps.'], [4, 'Je suis née au village. Mon père a vendu nos chèvres pour payer la taxe. Et me voilà, à garder la porte de celui qui l\'a levée.']] } }));
F({ ev: 24, nom: 'Sire Aubry', role: 'chevalier au service du lord', voix: 'noble, las, fier, honnête malgré tout.',
    premiere: 'Sire Aubry, chevalier du lord. Vous pouvez m\'appeler « sire ». Tout le monde le fait. Personne ne le pense.',
    bonjourTous: ['Voyageur.', '~Il ajuste son gant sans te regarder.|Oui ?'],
    saisons: { 1: ['Le printemps : tournois. On se bat pour rien devant des gens qui n\'ont jamais tenu une épée.'], 2: ['L\'été, j\'escorte les carrosses des nobles. Je mange leur poussière avec dignité.'], 3: ['La chasse du lord. On rabat le gibier. Je suis chevalier, je rabats du gibier.'], 4: ['L\'hiver, au manoir, on joue aux échecs. Je perds exprès contre les invités. C\'est de la diplomatie.'] },
    discuter: ['Mon Don est une épée. Une vraie lame de chevalier. Elle mérite de meilleures batailles que celles qu\'on me donne.', 'Les soldats en ville ne sont pas sous mes ordres. Ils boivent sans payer. Si c\'était mes hommes, ils paieraient.', 'Un chevalier jure de protéger les faibles. J\'escorte les riches. Je n\'ai pas encore trouvé comment concilier les deux.'],
    nouvelles: ['Le lord prépare une grande fête. Tournoi, banquet, feux. J\'ai été désigné pour perdre élégamment contre un baron.', K.LORD[1]],
    perso: { titre: 'Votre serment ?', paliers: [[1, 'Je sers le lord.'], [4, 'J\'ai juré de servir le lord. Pas ses invités. Mais les invités ont des exigences, et le lord leur dit oui.'], [7, '~Il baisse la voix.|J\'ai été fait chevalier pour avoir tenu un pont, seul, contre des bandits. Aujourd\'hui je tiens des portes de salon. Je me demande parfois ce qu\'est devenu le garçon du pont.']] },
    aurevoir: ['Allez en paix.', 'Et tenez-vous loin des soldats.'] });
F({ ev: 25, nom: 'Léon', role: 'chevrier', voix: 'rude, terre à terre, préfère les chèvres aux gens.',
    premiere: 'Léon. Chevrier. Mes chèvres sont plus aimables que moi. C\'est pas difficile.',
    bonjourTous: ['Hm.', '~Il sent fort la chèvre, et il le sait.|Quoi ?'],
    saisons: MONT,
    discuter: ['Les soldats m\'ont pris deux chèvres « pour la troupe ». Elles avaient des noms. Ils ne le savaient pas.', 'Une chèvre, ça grimpe partout, ça mange tout, et ça n\'obéit à personne. C\'est l\'animal le plus libre du monde. Je les envie.', K.DUR[2]],
    nouvelles: [K.LORD[4], K.LORD[2]],
    perso: { titre: 'Vos chèvres ?', paliers: [[1, 'Vingt-trois. Vingt-et-une, maintenant.'], [4, 'La plus vieille s\'appelle Madame. Elle a douze ans. Elle a enterré ma femme avec moi. Enfin, elle était là. Elle a mangé les fleurs.']] },
    aurevoir: ['Hm.', 'Va.'] });
F({ ev: 27, nom: 'Lila', role: 'bergère, jeune, farouche', voix: 'méfiante, directe, s\'adoucit avec le temps.',
    premiere: 'Tu es avec les soldats ? Non ? Tant mieux. Lila. Bergère.',
    bonjourTous: ['Salut.', '~Elle garde une main sur son bâton.|Oui ?'],
    saisons: MONT,
    discuter: ['Un soldat a voulu m\'aider à porter un agneau. J\'ai compris ce qu\'il voulait. Mon bâton aussi.', 'Mon Don ? Un bâton, justement. Une arme, qu\'ils disent. Pour moi c\'est un bâton de berger. Il n\'a jamais cassé.'],
    nouvelles: [K.LORD[4], 'Les soldats dorment dans nos bergeries. Les moutons dehors, les soldats dedans. Les moutons ont perdu au change.'],
    perso: { titre: 'Pourquoi méfiante ?', paliers: [[1, 'Parce que.'], [4, 'Ma sœur est partie servir au manoir. Elle écrit une fois par saison. Sa dernière lettre était… trop polie. Elle n\'écrit jamais poliment.']] },
    aurevoir: ['Salut.', 'Fais attention aux soldats.'] });
F({ ev: 35, nom: 'Soren', role: 'jeune homme qui rêve d\'entrer au manoir', voix: 'naïf, ambitieux, admire les nobles.',
    premiere: 'Soren ! Tu viens du manoir ? Non ? Dommage. J\'y entrerai, un jour. Comme valet. Puis intendant. Puis… on verra.',
    bonjourTous: ['Bonjour !', 'Tu as vu les carrosses ? Magnifiques.'],
    saisons: MONT,
    discuter: ['Les nobles ont des vêtements qui ne se salissent jamais. Enchantés, qu\'on dit. Imagine.', 'Mon père dit que les nobles sont des parasites. Mon père élève des moutons. Il ne comprend pas l\'ambition.'],
    nouvelles: [K.LORD[1], K.LORD[3]],
    perso: { titre: 'Pourquoi le manoir ?', paliers: [[1, 'Pour ne plus sentir le mouton !'], [4, 'Lila dit que sa sœur y est malheureuse. Je ne la crois pas. Je ne veux pas la croire.']] },
    aurevoir: ['À bientôt ! Peut-être au manoir !', 'Bonne journée !'] });
F({ ev: 36, nom: 'Mei', role: 'herboriste des montagnes', voix: 'calme, précise, un peu mystérieuse.',
    premiere: 'Mei. Je cueille ce qui pousse là où personne ne monte.',
    bonjourTous: ['Bonjour.', '~Elle trie des herbes dans un panier.|Hm ? Bonjour.'],
    saisons: { 1: ['Les premières fleurs des cimes. Elles soignent la fièvre et la mélancolie. Enfin, la fièvre.'], 2: ['L\'été, je dors là-haut, avec les herbes. Il fait bon, sous les étoiles.'], 3: ['L\'automne, les racines. Il faut creuser. Les racines ne se donnent pas.'], 4: ['L\'hiver, je sèche, je broie, je mélange. La montagne dort, moi pas.'] },
    discuter: ['Une herbe, c\'est une petite magie qui ne demande rien. Pas de Don, pas de formule. Juste savoir où regarder.', 'Les soldats m\'achètent des herbes contre la fatigue. Ils marchent beaucoup, dans ces montagnes. Ils ont surtout des ampoules.', K.MAGIE[4]],
    nouvelles: [K.LORD[7], 'Le guérisseur du manoir m\'a commandé des herbes de sommeil. Les nobles dorment mal. Trop de vin.'],
    perso: { titre: 'Vous vivez seule ?', paliers: [[1, 'Avec la montagne.'], [4, 'Ma famille venait de loin, de l\'autre côté du col. Ils sont retournés là-bas. Moi je suis restée. La montagne m\'a gardée.']] },
    options: [{ titre: 'Acheter des herbes', cmds: K.boutique([['objet', 3], ['objet', 59]]) }],
    aurevoir: ['Que la montagne te garde.', 'Bonne route.'] });

module.exports = { carte: 36, fiches: fiches };
