/*
 * LE MANOIR DU LORD (carte 47) — sentinelles et domestiques.
 * NON TOUCHÉS (peut-être des personnages d'histoire, à confirmer par JOKO) :
 *   · l'événement 8 (Actor3, au fond, en 20,11) — le lord lui-même ?
 *   · l'événement 19 (2_DF_Actor, en 20,15) ;
 *   · l'atelier d'alchimie (événements 28 et 29).
 * Le guérisseur garde son soin (la commande de JOKO, reprise telle quelle).
 * JOKO (2026-09-27) : sur le lord, « juste des ragots vagues » — les
 * banquets, les invités, les taxes, le travail ; aucun mystère inventé.
 */
'use strict';
var K = require('./_communs.js');
var P = K.P, A = K.A, C = K.C, si = K.si, cat = K.cat, H = K.H, paye = K.paye;
var fiches = [];
function F(f) { fiches.push(f); }
var MANOIR_SAISON = {
    1: ['Au printemps, on aère les salons. Les nobles se plaignent des courants d\'air.'],
    2: ['L\'été, les mages rafraîchissent les grandes salles. Nous, on transpire dans les cuisines.'],
    3: ['La chasse du lord. Des nobles partout, de la boue partout.'],
    4: ['L\'hiver, on chauffe quarante cheminées. Et nos chambres restent froides.']
};
var MANOIR_BRUITS = [
    'Le lord a la goutte. Trop de banquets. C\'est un secret. Tout le monde le connaît.',
    'Les invités changent de robe trois fois par jour. Nous, on lave trois fois par jour.',
    'Des nobles arrivent chaque semaine pour la fête. On manque de chambres. Le valet dort dans le placard à balais.',
    'Une comtesse a fait renvoyer une servante parce qu\'elle avait « un regard insolent ». Elle avait un œil qui louchait.'
];

function sentinelle(ev, nom, o) {
    return K.garde(ev, nom, Object.assign({ role: 'sentinelle du manoir', voix: 'raide, formelle, craint ses supérieurs.',
        premiere: 'Sentinelle ' + nom + '. Vous êtes dans la demeure du lord. Vous parlez bas et vous ne touchez à rien.',
        bonjour: { 1: ['Relève du matin. Tout est en ordre.'], 2: ['Circulez. Doucement.'], 3: ['Les invités dînent. Silence dans les couloirs.'], 4: ['Personne ne circule la nuit. Sauf vous, apparemment.'] },
        saisons: MANOIR_SAISON, nouvelles: [MANOIR_BRUITS[1]] }, o));
}
F(sentinelle(9, 'Oudin', { role: 'portier du manoir', discuter: ['Je vérifie qui entre. Pas qui sort. On ne m\'a jamais demandé de vérifier qui sort.'],
    perso: { titre: 'Depuis longtemps ici ?', paliers: [[1, 'Six ans.'], [4, 'Avant, le lord me disait bonjour en passant. Il connaissait mon nom. Maintenant, il a trop d\'invités pour se souvenir des portiers.']] } }));
F(sentinelle(10, 'Mathurin', { role: 'portier du manoir', discuter: ['Les carrosses arrivent pleins de malles. Trois malles pour une dame. Une pour son chien.'],
    perso: { titre: 'Et toi ?', paliers: [[1, 'Je garde la porte.'], [4, 'Ma femme veut que je quitte le service. Elle dit que je rentre en parlant comme un noble. « Plaît-il », j\'ai dit. Elle m\'a lancé une louche.']] } }));
F(sentinelle(11, 'Ancel', { discuter: ['On garde l\'escalier. Personne ne monte sans y être invité. Même pas les nobles. Surtout pas les nobles.'] }));
F(sentinelle(12, 'Berthold', { discuter: ['La musique des banquets dure jusqu\'à quatre heures du matin. Moi, je me lève à cinq.'] }));
F(sentinelle(15, 'Guérin', { discuter: ['Je suis là depuis l\'aube. Je serai là jusqu\'à l\'aube. La moitié de la garde escorte les invités ; l\'autre moitié fait le double.'] }));
F(sentinelle(17, 'Lysandre', { role: 'garde personnel d\'un comte invité', voix: 'glacial, méprisant, parfaitement poli.', discuter: ['Je sers le comte. Pas le lord. Pas vous. Continuez votre chemin.'],
    premiere: '~Il ne bouge pas un muscle.|Vous êtes attendu ? Non. Alors vous êtes toléré.', perso: { titre: 'Ton comte ?', paliers: [[1, 'Ce ne sont pas vos affaires.'], [5, 'Il joue aux cartes toute la nuit et il perd. Je le raccompagne à sa chambre. C\'est ça, garder un noble.']] } }));
F(sentinelle(18, 'Morvan', { role: 'garde personnel d\'une baronne invitée', voix: 'lent, massif, peu bavard.', discuter: ['La baronne a peur des souris. Je suis payé pour la protéger des souris.'],
    premiere: 'Vous parlez au garde de la baronne. Choisissez vos mots. Elle écoute aux portes.', perso: { titre: 'Qui êtes-vous ?', paliers: [[1, 'Quelqu\'un de payé.'], [5, 'J\'étais mercenaire. Rang B. Chasser les souris d\'une baronne paie trois fois mieux que chasser les loups. J\'ai honte, et j\'ai un toit.']] } }));

F({ ev: 13, nom: 'Jeanne', role: 'servante, travaille ici depuis l\'enfance', voix: 'rapide, inquiète, chuchote.',
    premiere: 'Oh ! Pardon. Jeanne, servante. Vous… vous ne devriez pas traîner ici. Enfin, si vous êtes invité, bien sûr. Vous êtes invité ?',
    bonjourTous: ['Bonjour… pardon.', '~Elle serre un plateau contre elle.|Oui ?'],
    saisons: MANOIR_SAISON,
    discuter: ['Je suis née au manoir. Ma mère servait déjà. Je n\'ai jamais dormi ailleurs.', MANOIR_BRUITS[0], 'On m\'a appris à ne rien voir et tout faire. Je suis très douée.'],
    nouvelles: [MANOIR_BRUITS[2], MANOIR_BRUITS[3]],
    perso: { titre: 'Tout va bien ?', paliers: [[1, 'Oui, oui. Très bien.'], [4, '~Elle regarde derrière elle.|Les invités sont exigeants. On court de l\'aube à minuit. Personne n\'a plus le temps de rire en cuisine. Ça me manque, le rire.']] },
    aurevoir: ['Je dois y aller. Pardon.', 'Ne dites pas que je vous ai parlé.'] });
F({ ev: 14, nom: 'Octave', role: 'valet, ambitieux et servile', voix: 'obséquieux devant, venimeux derrière.',
    premiere: 'Octave, valet de chambre. Si Monsieur ou Madame a besoin de quoi que ce soit… ou de savoir quoi que ce soit… cela peut s\'arranger.',
    bonjourTous: ['Mes hommages.', '~Il s\'incline un peu trop bas.|À votre service.'],
    saisons: MANOIR_SAISON,
    discuter: ['Les nobles laissent tomber des pièces. Je les ramasse. Pour les leur rendre, évidemment.', 'Jeanne a peur de son ombre. Moi, je lui fais de l\'ombre. C\'est ainsi qu\'on monte, ici.'],
    nouvelles: [MANOIR_BRUITS[3], 'Dame Véra, une de nos invitées, va au marché sans escorte. Scandaleux. Elle y parle aux gens. Encore plus scandaleux.'],
    perso: { titre: 'Un secret, contre de l\'or ?', paliers: [[1, 'Oh, je ne vends rien. Je rends service.'], [3, 'Vingt pièces, et je vous dis quelle comtesse rend visite à quel baron, la nuit. … Non ? Tant pis. Moi, je le saurai toujours.']] },
    aurevoir: ['Vos désirs sont des ordres.', 'Revenez quand vous aurez de l\'or. Ou de l\'influence.'] });
F({ ev: 16, nom: 'Guillemette', role: 'cuisinière du manoir', voix: 'bourrue, généreuse, se moque des nobles.',
    premiere: 'Tu viens de la ville ? Assieds-toi deux minutes. Guillemette. Je nourris cinquante nobles qui ne savent pas faire cuire un œuf.',
    bonjourTous: ['Toi ! T\'as faim ?', '~Elle s\'essuie les mains sur son tablier.|Oui ?'],
    saisons: { 1: ['Le printemps : les nobles veulent des asperges. Il en pousse trois dans tout le pays.'], 2: ['Glaces, sorbets, fruits frais. Les mages refroidissent, moi je sue.'], 3: ['Gibier, gibier, gibier. La chasse du lord ramène tout ce qui court.'], 4: ['Les fêtes d\'hiver. Trois jours de banquet. Trois nuits sans dormir.'] },
    discuter: ['Les nobles mangent le quart de ce qu\'on sert. Le reste, on le donne aux chiens. Et aux villageois, quand le majordome ne regarde pas.', 'Berthe, du bar de la Ville Forestière, a appris avec moi. Elle cuisine mieux que moi. Ne lui dis pas.', MANOIR_BRUITS[0]],
    nouvelles: [MANOIR_BRUITS[2], K.LORD[3]],
    perso: { titre: 'Les restes ?', paliers: [[1, 'Chut.'], [4, 'Je fais passer un panier par la porte des cuisines, chaque soir. Pour les familles du village, celles à qui les soldats ont tout pris. Si le majordome le savait…']] },
    options: [{ titre: 'Accepter un reste', cmds: cat(A.se('Item1'), A.objet(45, 1), P('Guillemette', 'Tiens. C\'est du faisan. Un noble n\'y a pas touché. Il a dit que la sauce était « vulgaire ».'), H.affinite(1)) }],
    aurevoir: ['Et mange, hein !', 'File par la cuisine, c\'est plus discret.'] });
F({ ev: 26, nom: 'Blanche', role: 'femme de chambre — la sœur de Lila, la bergère du village', voix: 'trop polie, trop calme, comme ses lettres.',
    premiere: 'Blanche, femme de chambre. Enchantée. Tout va très bien, ici. Merci de le demander.',
    bonjourTous: ['Bonjour. Tout va très bien.', '~Elle plie un drap avec une précision parfaite.|Bonjour.'],
    saisons: MANOIR_SAISON,
    discuter: ['Je change quarante draps par jour. Les invités dorment dans la soie. Moi, dans la laine qui gratte.', 'Ma sœur Lila garde les moutons au village. Je lui écris une fois par saison. Je lui dis que tout va très bien.'],
    nouvelles: [MANOIR_BRUITS[1]],
    perso: { titre: 'Et Lila ?', paliers: [[1, 'Elle va bien, je crois.'], [3, '~Son sourire tremble une seconde.|Si vous la voyez… dites-lui que je vais bien. Dites-le avec les mots de tous les jours. Elle comprendra.'], [6, 'Le majordome veut que nos lettres soient « dignes de la maison ». Alors j\'écris comme une dame. Lila doit détester ça. Moi aussi.']] },
    aurevoir: ['Bonne journée. Tout va très bien.', 'Au revoir.'] });
F({ ev: 27, nom: 'Fabien', role: 'palefrenier, s\'occupe des chevaux des invités', voix: 'simple, gentil, préfère les chevaux aux maîtres.',
    premiere: 'Fabien, les écuries. Tu sens le cheval ? C\'est moi. Enfin, c\'est eux, mais ça reste sur moi.',
    bonjourTous: ['Salut !', '~Il a de la paille dans les cheveux.|Hm ? Salut.'],
    saisons: MANOIR_SAISON,
    discuter: ['Les chevaux des nobles mangent mieux que moi. Avoine de premier choix. Je goûte, des fois.', 'Un baron a voulu monter le poulain du lord. Le poulain l\'a mis par terre. J\'ai mis une semaine à arrêter de rire.'],
    nouvelles: [MANOIR_BRUITS[2], K.LORD[1]],
    perso: { titre: 'Les chevaux ?', paliers: [[1, 'Ils sont plus honnêtes que les gens.'], [4, 'J\'ai un poulain, à moi. Né l\'an dernier. S\'il fallait partir d\'ici en vitesse, je sais sur qui je monterais.']] },
    aurevoir: ['Salut !', 'Si tu as un cheval, je te le brosse gratis.'] });
F({ ev: 25, nom: 'Maître Wendel', role: 'guérisseur du manoir (il soigne, comme JOKO l\'avait posé)', voix: 'posé, épuisé, soupçonne des choses.',
    avant: [[356, 0, ['NPC talk guerisseur']]],
    premiere: 'Wendel, guérisseur de la maison du lord. Si vous saignez, asseyez-vous. Si vous ne saignez pas, asseyez-vous quand même, vous avez l\'air épuisé.',
    bonjourTous: ['Asseyez-vous.', '~Il écrase des herbes dans un mortier.|Oui ? Blessé ?'],
    saisons: { 1: ['Le printemps, les fièvres. Tout le manoir tousse.'], 2: ['L\'été, les nobles s\'évanouissent de chaleur dans leurs corsets. Je les délace. C\'est tout mon art.'], 3: ['La chasse du lord : entorses, chutes de cheval, un rabatteur blessé par une flèche noble.'], 4: ['L\'hiver, les engelures des domestiques. Les nobles ne gèlent jamais. Ils ont des mages.'] },
    blesse: 'Montrez-moi ça. … Vous avez de la chance. Un doigt plus à gauche et je ne pouvais plus rien.',
    discuter: ['Je soigne les nobles et les domestiques. Les nobles paient. Les domestiques remercient. Je préfère les remerciements.', 'L\'herboriste du village me vend des herbes de sommeil. Les invités dorment mal. Trop de vin, trop de dettes de jeu.', 'Je n\'ai pas de sort de soin. J\'ai des herbes, des mains, et beaucoup de nuits blanches.'],
    nouvelles: [MANOIR_BRUITS[0], 'Un invité s\'est cassé la jambe en dansant sur une table. Il m\'a remercié en me donnant une bague. Fausse.'],
    perso: { titre: 'Le lord est malade ?', paliers: [[1, 'Je ne parle pas de mes patients.'], [4, 'La goutte. Je lui dis de moins manger. Il me dit de moins parler. Nous avons chacun raison, et aucun de nous n\'obéit.']] },
    options: [{ titre: 'Se faire soigner', cmds: cat(A.se('Heal3'), [[311, 0, [0, 0, 0, 0, 9999, false]]], P('Maître Wendel', 'Voilà. Reposez-vous. Et ne revenez pas trop vite.')) }],
    aurevoir: ['Prenez soin de vous. Personne ne le fera à votre place.', 'Allez.'] });
F({ ev: 32, nom: 'Anatole', role: 'majordome du manoir', voix: 'impeccable, glacé, loyal au lord d\'avant l\'hiver.',
    avant: [[213, 0, [31, 3, false]]],
    premiere: 'Anatole, majordome de cette maison depuis trente et un ans. Vous désirez ?',
    bonjourTous: ['Vous désirez ?', '~Il vérifie l\'alignement d\'une fourchette au millimètre.|Oui ?'],
    saisons: MANOIR_SAISON,
    discuter: ['Trente et un ans de service. J\'ai servi le père du lord, puis le lord. Je connais chaque pierre de cette maison.', 'Les invités de cette saison boivent le vin des grandes années comme de la piquette. J\'en ai pleuré. Discrètement.'],
    nouvelles: [MANOIR_BRUITS[2], MANOIR_BRUITS[3]],
    perso: { titre: 'Et le lord ?', paliers: [[1, 'Le lord se porte bien.'], [4, 'Son père connaissait le nom de chaque domestique. Lui connaît le nom de chacun de ses chevaux. Chaque génération a ses priorités.'], [8, '~Il pose la fourchette.|Je lui montais son thé chaque matin, quand il était enfant. Il me racontait ses rêves. Aujourd\'hui, il me demande l\'état de la cave. On vieillit tous. Lui plus vite.']] },
    aurevoir: ['Monsieur.', 'Je vous raccompagne. En pensée.'] });

module.exports = { carte: 47, fiches: fiches };
