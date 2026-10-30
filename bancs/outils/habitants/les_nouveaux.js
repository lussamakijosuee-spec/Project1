/*
 * LES NOUVEAUX — neuf personnages inventés d'après la Bible, comme des OC
 * (JOKO, 2026-10-30 : « personnages du lore mais nouveau inspiré du lore »,
 * puis « Comme des oc »). La Bible compte déjà 95 personnages nommés et dit
 * que c'est trop ; ceux-ci sont des gens ordinaires (« La plupart des gens
 * n'ont ni don, ni manifestation, ni licence »), chacun né d'une phrase :
 *
 *   Barthélemy, le conteur     « réputée pour ses soirées de contes » — il
 *                              raconte la Genèse, le seul lore gardé (le mana)
 *   Petit-Louis                « le Corps attaqua l'Âme, l'Âme attaqua
 *                              l'Esprit, l'Esprit attaqua le Corps » : il en a
 *                              fait un jeu de mains
 *   Anouk et Timothée          « Les patrouilles d'élèves […] », « les
 *                              habitants aiment bien les élèves et détestent
 *                              leurs accidents ; l'académie paie chaque année
 *                              une taxe pour les dégâts »
 *   Évariste                   « l'apothicaire d'un alchimiste à la retraite »
 *   Pervenche                  « encres et parchemins de récit spirituel »,
 *                              « des parchemins jumeaux […] rare, cher »
 *   Ninon                      la Bourse des Lames Franches, ses coursiers
 *   Solange                    « des humeurs qui ne sont pas les leurs »
 *   Zéphyrin                   la Veillée du Retour et son marché de nuit
 *
 * Leurs fiches OC (goûts, liens, scènes d'amitié, cadeaux) sont dans
 * oc/les_nouveaux.js. Les événements ont été créés vides le 2026-10-30 :
 * « muet: true » les remplit la première fois.
 *
 *   node bancs/outils/poser_les_habitants.js --seulement les_nouveaux.js --ecrire
 */
'use strict';
var K = require('./_communs.js');
var P = K.P, A = K.A, C = K.C, si = K.si, cat = K.cat, H = K.H, D = K.D, boutique = K.boutique;
var fiches = [];
function F(f) { f.muet = true; fiches.push(f); }

/* ── Barthélemy : un conte par soir, dans l'ordre (les visites) ─────────── */
var CONTES = [
    ['Les trois sources', 'Approche. Au commencement, il y eut trois sources. La Mère, le Corps. Le Père, l\'Esprit. Et la Fille de la Rébellion, l\'Âme.|La Mère avait faim, le Père savait tout, et la Fille ne voulait obéir à personne. Trois façons d\'être vivant. Tout ce qui respire en a un peu des trois.'],
    ['Le triangle', 'Un jour, un homme les réunit au même endroit. Il convainquit le Père par la logique, attira la Mère par une offrande, et compta sur la fierté de la Fille.|Et elles s\'affrontèrent en triangle. Le Corps attaqua l\'Âme. L\'Âme attaqua l\'Esprit. L\'Esprit attaqua le Corps.|~Il marque une pause, très longue.|Aucune ne tomba. Seul l\'homme gagna.'],
    ['Le cercle et le livre', 'Pendant la bataille, l\'homme traçait. Un cercle immense, de mana spirituel. Et il façonnait un livre : une moitié de son âme, une moitié de sa chair, une moitié de son savoir.|Les enfants me demandent toujours : « et l\'autre moitié ? ». Je leur dis : c\'est pour ça qu\'on vit. Pour la trouver.'],
    ['Les quatre jours', 'Puis il récita la formule.|Le premier jour, le Livre absorba les trois sources. Le deuxième jour, il les contint. Le troisième jour, l\'homme les maîtrisa.|Et le quatrième jour, il devint lui-même une source. Les trois réunies. On l\'appela le Premier.'],
    ['Les trois arts', 'Ce que le Premier savait faire, on l\'apprend encore.|Le mana se calcule : c\'est la Parole, l\'art de l\'Esprit. Il se meut : ce sont les voies d\'art, l\'art du Corps. Il s\'écrit : c\'est l\'écrit, l\'art de l\'Âme.|Le corps vit maintenant, l\'esprit ce tour-ci, et l\'âme… l\'âme a tout son temps.'],
    ['Où est le Premier ?', 'Où est-il, maintenant, le Premier ? On dit qu\'il est dans le Livre. Ou parti dans un autre monde. On dit qu\'il reviendra.|C\'est pour ça qu\'une nuit par an, on veille. La Veillée du Retour. Pas pour le voir arriver. Pour qu\'il sache qu\'on attend encore.']
];
function conte() {
    return cat(A.se('Book1', 60), cat.apply(null, CONTES.map(function (c, i) {
        return si(C.js('$gameVariables.value(882) === ' + (i + 1)), cat(P('', '~« ' + c[0] + ' »'), P('Barthélemy', c[1])));
    })));
}
F({ carte: 46, ev: 52, nom: 'Barthélemy', role: 'le conteur, un conte de la Genèse chaque soir', voix: 'posée, chaleureuse, ménage ses silences ; « … et c\'est là que… »', horaire: '19-24',
    tags: ['<Va: 14-18 29 21,23>', '<Logis: 45 3,10>'], murmure: '… et c\'est là que…',
    premiere: '~Un vieil homme à la barbe grise lève son verre de lait chaud vers toi.|Barthélemy. Je raconte. Le soir, ici ; l\'après-midi, aux petits, sur la place de la ville. Assieds-toi, si tu as le temps. Les contes, ça se prend lentement.',
    bonjour: { 2: ['Les petits sont partis goûter. Il me reste un conte sur les bras. Tu le veux ?'], 3: ['Ah ! L\'heure des contes. Approche, approche.', '~Il tapote le banc à côté de lui.|Il y a de la place. Il y en a toujours.'], 4: ['Il est tard. Les meilleurs contes se racontent tard. Les plus courts, aussi.'] },
    bonjourTous: ['Bonsoir, bonsoir.'],
    saisons: { 1: ['Le printemps, je raconte la Mère. Tout pousse, tout a faim. C\'est sa saison.'], 2: ['L\'été, la Fille. On veut sortir, désobéir, courir dehors. Elle aurait aimé l\'été.'], 3: ['L\'automne, le Père. On rentre, on range, on réfléchit. Il aurait aimé l\'automne.'], 4: ['L\'hiver, le Premier. On veille. On attend que quelqu\'un revienne.'] },
    discuter: ['Je ne suis pas savant. Je raconte ce qu\'on m\'a raconté. En changeant les mots, mais jamais l\'histoire.', 'Un conte, c\'est comme une Parole : dit court et juste, il porte. Dit long et tremblant, il endort. Moi, j\'endors les enfants. C\'est aussi un métier.', 'Le barde cherche une note. Moi, je cherche le silence juste avant la fin. C\'est là que tout le monde se penche.'],
    nouvelles: ['Les petits de la ville préfèrent le triangle. Le Corps, l\'Âme, l\'Esprit. Ils en ont fait un jeu de mains. Petit-Louis gagne toujours. Il triche, je crois.'],
    perso: { titre: 'Pourquoi raconter ?', paliers: [[1, 'Parce qu\'on m\'a raconté, quand j\'étais petit. Il faut bien rendre.'], [4, 'J\'ai été colporteur toute ma vie. Sur les routes, on n\'a rien à donner. Alors je donnais des contes. Ça ne pèse rien, et ça ne s\'use pas.'], [8, '~Il te regarde par-dessus son verre.|Un jour, quelqu\'un racontera ton histoire à un enfant, sur une place. Fais en sorte qu\'elle finisse bien. Les enfants détestent les fins tristes. Moi aussi.']] },
    options: [{ titre: 'Un conte', cmds: cat(A.vrJs(882, '(Number($gameVariables.value(880)) % ' + CONTES.length + ') + 1'), conte()) }],
    aurevoir: ['Va, et reviens pour la suite.', 'Bonne nuit. Rêve de sources.'] });

/* ── Petit-Louis : le jeu des mains « Corps, Âme, Esprit » ─────────────── */
// La règle du jeu est celle du triangle des arts : le Corps bat l'Âme, l'Âme bat l'Esprit, l'Esprit bat le Corps.
var MAINS = ['Le Corps (le poing)', 'L\'Âme (la main sur le cœur)', 'L\'Esprit (un doigt sur la tempe)'], NOM_MAIN = ['le Corps', 'l\'Âme', 'l\'Esprit'];
function jeu() {
    function issue(toi) {
        // lui : 1 Corps, 2 Âme, 3 Esprit ; toi gagnes si toi = Corps et lui = Âme, toi = Âme et lui = Esprit, toi = Esprit et lui = Corps
        var gagne = { 1: 2, 2: 3, 3: 1 }[toi], perd = { 1: 3, 2: 1, 3: 2 }[toi];
        return si(C.vr(882, '=', toi), P('Petit-Louis', 'Égalité ! ' + NOM_MAIN[toi - 1].charAt(0).toUpperCase() + NOM_MAIN[toi - 1].slice(1) + ' contre ' + NOM_MAIN[toi - 1] + '. Encore !'),
            si(C.vr(882, '=', gagne), cat(A.se('Applause1', 40), P('Petit-Louis', '~Il regarde sa main, scandalisé.|' + NOM_MAIN[toi - 1].charAt(0).toUpperCase() + NOM_MAIN[toi - 1].slice(1) + ' bat ' + NOM_MAIN[gagne - 1] + '… T\'as gagné. C\'est pas juste. C\'est la règle, mais c\'est pas juste.')),
                cat(A.se('Laugh', 40), P('Petit-Louis', 'HA ! ' + NOM_MAIN[perd - 1].charAt(0).toUpperCase() + NOM_MAIN[perd - 1].slice(1) + ' bat ' + NOM_MAIN[toi - 1] + ' ! J\'ai gagné ! Grand-mère Maude dit que je gagne parce que je regarde les mains. C\'est faux. Un peu.'))));
    }
    return cat(P('Petit-Louis', 'Corps… Âme… ESPRIT !'), A.vrHasard(882, 1, 3), D.choix(MAINS, [issue(1), issue(2), issue(3)], { annuler: -1 }));
}
F({ carte: 29, ev: 59, nom: 'Petit-Louis', role: 'petit-fils d\'Hector et Maude, champion de « Corps, Âme, Esprit »', voix: 'malin, fanfaron, mauvais perdant, compte les points sur ses doigts.',
    tags: ['<Logis: 15,14>'],
    premiere: 'T\'es qui ? … Moi, c\'est Petit-Louis. Le petit-fils de grand-père Hector et de grand-mère Maude. Tu sais jouer à « Corps, Âme, Esprit » ? Non ? Je t\'apprends. Je gagne toujours.',
    bonjourTous: ['Salut ! Une partie ?', '~Il serre le poing, met la main sur son cœur, puis un doigt sur sa tempe, très vite.|Je m\'entraîne.'],
    saisons: { 1: ['Au printemps, grand-père Hector plante des radis. Ils poussent mal. Il dit que c\'est la Mère qui boude.'], 2: ['L\'été, on joue dehors jusqu\'à ce que grand-mère crie. Elle crie à huit heures. Pile.'], 3: ['L\'automne, Élise veut aller dans la forêt. Tomas veut pas. Moi je compte les points.'], 4: ['L\'hiver, on joue près du feu. Grand-père triche. Il dit que c\'est l\'âge.'] },
    discuter: ['Les règles : le Corps bat l\'Âme, l\'Âme bat l\'Esprit, l\'Esprit bat le Corps. Le monsieur des contes dit que c\'est comme ça depuis le début du monde.', 'Élise joue toujours le Corps. Toujours. Je gagne avec l\'Esprit. Elle a pas compris. Lui dis pas.', 'Tomas réfléchit trop. Il joue l\'Esprit parce que c\'est réfléchir. Alors je joue le Corps. Ça marche à chaque fois.'],
    nouvelles: ['Grand-père Hector et grand-mère Maude se sont disputés pour une cuillère. Je l\'ai cachée. Ils se disputent mieux quand je la cache.'],
    perso: { titre: 'Tu triches ?', paliers: [[1, 'Moi ? Jamais. … Un peu. Je regarde les mains avant.'], [4, 'En vrai, je joue pour que Tomas joue avec nous. Il aime pas courir. Mais les mains, si.']] },
    options: [{ titre: 'Jouer à « Corps, Âme, Esprit »', cmds: jeu() }],
    aurevoir: ['Reviens jouer ! Je te laisserai gagner. Non.', 'Salut !'] });

/* ── Anouk et Timothée : la patrouille d'élèves de l'Académie Rubis ───── */
F({ carte: 29, ev: 60, nom: 'Anouk', role: 'élève de quatrième année de l\'Académie Rubis, en patrouille', voix: 'zélée, règlementaire, parle comme un rapport ; s\'adoucit quand on la prend au sérieux.',
    tags: ['<Vie: ronde>', '<Ronde: 19,11 ; 27,20 ; 20,27 ; 11,24>', '<Logis: 45 11,10>'],
    premiere: '~Une élève en uniforme rouge te barre la route, un carnet à la main.|Anouk, quatrième année, Académie Rubis, patrouille d\'élèves. Rien à signaler ? Parfait. Je note : « Rien à signaler. » Merci de votre coopération.',
    bonjourTous: ['Patrouille. Rien à signaler ?', '~Elle note quelque chose, très vite.|Pardon. Un pigeon. Il avait l\'air suspect.'],
    saisons: { 1: ['Le printemps : saison de l\'Admission. Beaucoup de recrues, beaucoup de bêtises. Je note tout.'], 2: ['L\'été, Timothée a cassé deux étals. Deux. Je les ai notés. L\'académie paiera.'], 3: ['L\'automne, les sixièmes années partent en faille. Nous, on patrouille. Un jour, ce sera nous.'], 4: ['L\'hiver, les rues glissent. Timothée aussi.'] },
    discuter: ['La patrouille, ça sert à apprendre la retenue. On ne frappe pas d\'abord. On regarde, on parle, on note. Surtout on note.', 'À l\'académie, on dit : « Le pouvoir se gagne. Le nom se forge. Le mana est vivant. » Moi, j\'ajoute : « Et le carnet est à jour. »', 'Les habitants aiment bien les élèves. Ils détestent leurs accidents. L\'académie paie une taxe pour les dégâts. Timothée la fait monter tout seul.'],
    nouvelles: ['Ysaline, de cinquième année, dort à l\'auberge. Elle dit que je suis trop sérieuse. J\'ai noté sa remarque. Avec la date.'],
    perso: { titre: 'Et Timothée ?', paliers: [[1, 'Mon binôme. Il patrouille le Marché. Il s\'excuse auprès des tables qu\'il renverse.'], [4, 'Il est maladroit. Mais quand une petite s\'est perdue au Marché, c\'est lui qui l\'a retrouvée. Je l\'ai noté. Dans la colonne « bien ».']] },
    aurevoir: ['Circulez. Gentiment.', 'Bonne journée. Je ne note rien sur vous. Pour l\'instant.'] });
F({ carte: 30, ev: 28, nom: 'Timothée', role: 'élève de quatrième année de l\'Académie Rubis, patrouille le Marché', voix: 'maladroit, poli, s\'excuse tout le temps, même auprès des objets.',
    tags: ['<Vie: ronde>', '<Ronde: 12,18 ; 15,13 ; 10,13 ; 17,9>', '<Logis: 45 11,10>'],
    premiere: '~Un élève en uniforme rouge trébuche sur rien, se rattrape à un étal, et l\'étal tient. Miracle.|Pardon ! Pardon. Timothée, quatrième année, patrouille d\'élèves. Je… je patrouille. Pardon.',
    bonjourTous: ['Bonjour ! Pardon. Bonjour.', '~Il heurte un panier, le redresse, s\'excuse auprès du panier.|Désolé.'],
    saisons: { 1: ['Le printemps, il y a de la boue partout. Je l\'ai vérifiée personnellement. Avec le dos.'], 2: ['L\'été, les étals sont pleins. Je marche au milieu de l\'allée. Très au milieu.'], 3: ['L\'automne, les pommes roulent. Elles roulent vers moi. Toujours.'], 4: ['L\'hiver, je glisse. Anouk dit que c\'est un talent. Je crois que c\'est méchant.'] },
    discuter: ['Anouk patrouille la ville. Moi, le Marché. On nous a séparés après l\'histoire du chariot de pommes. Ce n\'était pas entièrement ma faute.', 'Je suis bon en Parole de protection. Une barrière, je sais faire. C\'est juste que mes jambes ne sont pas au courant.', 'Monsieur Bertrand me donne une pomme chaque matin. Il dit que c\'est pour que je les laisse sur l\'étal.'],
    nouvelles: ['L\'académie a reçu la facture des dégâts de la saison. Il y a mon nom dessus. Quatre fois. Le directeur a ri. Je crois qu\'il a ri.'],
    perso: { titre: 'Pourquoi Rubis ?', paliers: [[1, 'Parce que ma mère y était. Et qu\'on n\'y abandonne personne. Même ceux qui tombent.'], [4, 'En deuxième année, j\'étais au Bas Cercle. Maintenant, au Cercle du Milieu. Je tombe moins. Enfin, moins haut.']] },
    aurevoir: ['Bonne journée ! Attention à la… pardon, c\'était moi.', 'Au revoir ! Pardon.'] });

/* ── Évariste : l'alchimiste à la retraite ─────────────────────────────── */
F({ carte: 29, ev: 61, nom: 'Évariste', role: 'alchimiste à la retraite, sur son banc', voix: 'grincheux, drôle, précis ; parle aux fioles comme à des élèves.',
    tags: ['<Vie: sedentaire>', '<Logis: 38>'],
    premiere: '~Un vieil homme en gilet taché de mille couleurs ne lève pas les yeux de son journal.|Évariste. J\'avais une boutique d\'alchimie, « Essence et Braise ». Je l\'ai laissée à mon neveu. Il la fait brûler, j\'imagine. Moi, je m\'assieds.',
    bonjourTous: ['Hm. Bonjour.', '~Il renifle l\'air.|Quelqu\'un a raté un élixir, au Marché. Je le sens d\'ici. Mauvais dosage.'],
    saisons: { 1: ['Le printemps : les herbes repoussent. Les apprentis ramassent les mauvaises. J\'adore le printemps.'], 2: ['L\'été, les potions tournent. Ne laissez jamais une potion au soleil. Ni un apprenti.'], 3: ['L\'automne, la saison des champignons. Et des empoisonnements. C\'est lié.'], 4: ['L\'hiver, je fais des tisanes. C\'est de l\'alchimie de vieux.'] },
    discuter: ['Une potion, c\'est une Parole qu\'on met en bouteille. Trop forte, elle explose. Trop faible, elle soigne un rhume. Personne ne veut soigner un rhume.', 'La petite Oriane, au Marché, fait tout brûler. Elle vient me demander pourquoi. Je lui dis. Elle refait brûler. Elle progresse.', 'Le vieil Aldebert répare les objets enchantés. Il dit que l\'alchimie, c\'est de la cuisine. Je lui dis que la réparation, c\'est du rafistolage. On déjeune ensemble le jeudi.'],
    nouvelles: ['Une trousse de soins d\'urgence, une recharge de cristal, une corde : c\'est ce qu\'achètent les recrues. Je leur dis d\'ajouter un antidote. Elles rient. Elles reviennent.'],
    perso: { titre: 'Pourquoi la retraite ?', paliers: [[1, 'J\'ai fait exploser mon atelier une fois de trop. Mon neveu a dit : « Oncle, assieds-toi. » Je me suis assis.'], [4, 'En vrai, j\'aime regarder les gens. Quarante ans dans une arrière-boutique, à regarder des fioles. Maintenant, je regarde les gens. Ils explosent moins.']] },
    aurevoir: ['Va. Et bois de l\'eau.', 'Hm. Bonne journée.'] });

/* ── Pervenche : encres et parchemins ──────────────────────────────────── */
F({ carte: 30, ev: 29, nom: 'Pervenche', role: 'marchande d\'encres et de parchemins', voix: 'douce, rêveuse, parle des encres comme des parfums ; les doigts toujours bleus.',
    tags: ['<Vie: sedentaire>', '<Logis: 45 3,10>'],
    premiere: '~Une jeune femme aux doigts tachés de bleu range des flacons d\'encre par nuances.|Pervenche, comme la fleur, comme l\'encre. Je vends de quoi écrire. Les lettres, les contrats, les récits. Tout commence par une encre.',
    bonjourTous: ['Bonjour ! Tu as quelque chose à écrire ?', '~Elle souffle sur une page pour la sécher.|Pardon, une seconde. Voilà. Bonjour.'],
    saisons: { 1: ['Le printemps, on écrit des lettres d\'amour. Je vends le double d\'encre rose. Je ne pose pas de questions.'], 2: ['L\'été, l\'encre sèche trop vite. Les poètes sont furieux. Moi aussi.'], 3: ['L\'automne, on écrit des lettres d\'adieu, de départ, de « je reviens ». Je vends de l\'encre qui tient.'], 4: ['L\'hiver, l\'encre gèle dans les flacons. Je les garde contre moi. On dirait que je couve des œufs bleus.'] },
    discuter: ['Une encre de récit spirituel, c\'est une encre qui retient ce qu\'on écrit. Les écrits du mana, les runes. Je n\'en vends pas : il faut un permis. J\'en rêve, c\'est tout.', 'Jehan, l\'écrivain public, achète mon encre noire. Il dit qu\'elle « manque de caractère ». Il revient chaque semaine.', 'Les parchemins jumeaux : deux feuilles liées, ce qu\'on écrit sur l\'une apparaît sur l\'autre. C\'est rare, c\'est cher, c\'est comme ça que les rois s\'écrivent.'],
    nouvelles: ['Ma sœur est partie vivre au bord de la mer, à l\'est, là où passent les navires. On s\'écrit. Les lettres mettent un mois. Je compte les jours en flacons.'],
    perso: { titre: 'Les parchemins jumeaux ?', paliers: [[1, 'Un rêve d\'encrière. N\'y fais pas attention.'], [4, 'Si j\'en avais deux, j\'en enverrais un à ma sœur. On s\'écrirait le soir, en même temps. Comme quand on partageait la chambre.']] },
    aurevoir: ['Écris-moi, un jour ! Avec une belle encre.', 'Au revoir ! Garde les mains propres. Moi, c\'est trop tard.'] });

/* ── Ninon : coursière de la Bourse des Lames Franches ─────────────────── */
F({ carte: 30, ev: 30, nom: 'Ninon', role: 'coursière débutante de la Bourse des Lames Franches', voix: 'essoufflée, rapide, toujours en retard ; connaît tout le monde par son adresse.',
    tags: ['<Va: 9-11 29 27,20 ; 12-14 33 5,23 ; 15-17 29 11,24>', '<Logis: 45 11,10>'],
    premiere: '~Une jeune fille arrive en courant, s\'arrête, repart, revient.|Ninon ! Coursière ! La Bourse des Lames Franches ! J\'ai six lettres, deux colis et un retard ! Enchantée ! Je repars !',
    bonjourTous: ['Salut ! Je peux pas rester ! … Bon, une minute.', '~Elle reprend son souffle, les mains sur les genoux.|Coucou.'],
    saisons: { 1: ['L\'Admission ! Toutes les recrues écrivent chez elles ! J\'ai cent lettres ! Cent !'], 2: ['L\'été, je cours en sueur. Les lettres aussi. Elles arrivent un peu… humides.'], 3: ['L\'automne, le vent m\'arrache les enveloppes. J\'ai couru après une lettre jusqu\'au lac.'], 4: ['L\'hiver, je glisse, mais vite. C\'est un style.'] },
    discuter: ['La Bourse, c\'est pas une guilde : c\'est des comptoirs pour les indépendants. Des contrats, des coéquipiers, des places dans les chariots. Et des lettres. Les lettres, c\'est moi.', 'Je suis rang E. Le plus bas. Mais je connais les adresses de tout le monde. Ça, c\'est un rang aussi. Non ?', 'Mireille m\'attend à chaque passage. Elle reçoit jamais de lettres. Elle veut juste savoir qui en reçoit.'],
    nouvelles: ['Au tableau de la Bourse, chaque mission dit ses dangers, sa paie, son dépôt et un contact. Et tout en bas, en petit : « Ninon livre. » C\'est moi qui l\'ai écrit.'],
    perso: { titre: 'Pourquoi courir ?', paliers: [[1, 'Parce que les gens attendent ! Une lettre en retard, c\'est un cœur qui attend.'], [4, 'Je voudrais être aventurière, un jour. Mais d\'abord, je veux connaître tous les chemins. Comme ça, je saurai toujours rentrer.']] },
    aurevoir: ['Je file ! Je suis en retard ! Je suis toujours en retard !', 'Salut ! Écris des lettres, ça me fait du travail !'] });

/* ── Solange : « c'est pas moi, c'est la faille » ──────────────────────── */
var HUMEUR = 'Habitants.jour() % 3';
F({ carte: 33, ev: 45, nom: 'Solange', role: 'raccommodeuse de voiles, une humeur différente chaque jour', voix: 'change chaque jour : gaie, poétique ou grognonne ; « c\'est pas moi, c\'est la faille ».',
    tags: ['<Logis: 5,22>'],
    premiere: '~Une femme raccommode une voile, fredonne, s\'arrête, soupire, recommence.|Solange. Je recouds les voiles. Et si je suis bizarre aujourd\'hui, c\'est pas moi : c\'est la faille. On vit près d\'une faille, ça vous change l\'humeur. Tout le monde le sait.',
    bonjourTous: ['Bonjour.'],
    apresAccueil: si(C.js(HUMEUR + ' === 0'), P('Solange', '~Elle rayonne.|Quelle belle journée ! Les voiles sont belles, les mouettes sont belles, même Roul est beau ! … C\'est la faille, sûrement.'),
        si(C.js(HUMEUR + ' === 1'), P('Solange', '~Elle regarde le lac, très loin.|Le lac est une page que personne n\'a encore écrite. Et nous sommes l\'encre. … Pardon. C\'est la faille. Elle me rend poète, certains jours.'),
            P('Solange', '~Elle plante son aiguille un peu fort.|Quoi. Non. Rien. Tout m\'énerve. Les voiles, le vent, les mouettes. C\'est la faille. Ça passera demain.'))),
    saisons: { 1: ['Le printemps, les voiles se déchirent au premier coup de vent. Moi aussi. C\'est la faille.'], 2: ['L\'été, je couds dehors. Je suis de bonne humeur deux jours sur trois. Le troisième, c\'est la faille.'], 3: ['L\'automne, les tempêtes. Mes voiles tiennent. Mon humeur, pas toujours.'], 4: ['L\'hiver, je recouds au coin du feu. Le feu ne m\'énerve jamais. C\'est bien le seul.'] },
    discuter: ['Le garçon aux lunettes, Edwin, m\'a regardée avec ses verres. Il a dit que mon mana était « parfaitement normal ». Il ne connaît rien aux failles.', 'Annick dit que je suis juste lunatique. Annick parle trop. … Aujourd\'hui, je trouve qu\'elle parle trop. Demain, je l\'adorerai.', 'Une voile bien cousue, ça tient le vent. Une humeur, non. Alors je couds.'],
    nouvelles: ['Ceux qui vivent près d\'une faille connaissent l\'imprégnation : des nuits agitées, des humeurs qui ne sont pas les leurs. Bon. Il n\'y a pas de faille ici. Mais il pourrait y en avoir une.'],
    perso: { titre: 'Et si ce n\'était pas la faille ?', paliers: [[1, 'Ce n\'est pas moi. C\'est la faille.'], [4, '~Elle pose sa voile.|Bon. D\'accord. C\'est moi. J\'ai trois humeurs, et elles tournent. C\'est plus facile de dire « la faille ». Tu ne le diras pas à Edwin ?']] },
    aurevoir: ['À demain. Demain, je serai quelqu\'un d\'autre.', 'Au revoir. Si je suis désagréable, c\'est la faille.'] });

/* ── Zéphyrin : le marchand de la Veillée ──────────────────────────────── */
F({ carte: 29, ev: 62, nom: 'Zéphyrin', role: 'marchand de la Veillée du Retour, une nuit par an', voix: 'mystérieux pour rire, clins d\'œil, chuchote ses prix comme des secrets.',
    note: '<Veillee>',
    premiere: '~Un homme au grand chapeau rouge déplie une table pleine de petites lumières.|Zéphyrin, pour vous servir. Une nuit par an, la nuit de la Veillée. Le reste de l\'année ? Ailleurs. On ne demande pas où.',
    bonjourTous: ['Bonsoir, bonsoir. Approchez. Rien d\'interdit. Juste… pas déclaré.', '~Il fait tourner un bocal plein de lucioles.|La Veillée, ça se fête avec de la lumière.'],
    discuter: ['À la capitale, la nuit de la Veillée, la Basse-Brume tient un immense marché de nuit. On y vend des objets de failles que la Chancellerie préférerait ne pas voir. Moi, je vends des lucioles. C\'est plus calme.', 'Pourquoi une seule nuit ? Parce que c\'est la nuit où l\'on attend le Premier. Les gens qui attendent achètent des lumières. Pour qu\'il trouve le chemin.', 'Le conteur, Barthélemy, me connaît depuis trente ans. Il dit que je n\'ai pas vieilli. Je dis que c\'est le chapeau.'],
    nouvelles: ['Cette nuit, on veille sur la place jusqu\'à deux heures. Les enfants essaient de rester réveillés. Ils perdent tous. Je leur vends un bocal pour la défaite.'],
    perso: { titre: 'Qui êtes-vous ?', paliers: [[1, 'Un marchand. Un chapeau. Une nuit.'], [3, 'Je viens chaque année depuis que j\'ai l\'âge de porter une table. Mon père venait avant moi. Il disait : « Le Premier reviendra une nuit de Veillée. Il faut qu\'il y ait de la lumière. » Alors je viens.']] },
    options: [{ titre: 'Voir les lumières', cmds: boutique([['objet', 7], ['objet', 63], ['objet', 73], ['objet', 96], ['objet', 103]]) }],
    aurevoir: ['Bonne Veillée. Et à l\'année prochaine. Ou jamais. On ne sait pas.', '~Il soulève son chapeau.|Gardez une lumière allumée.'] });

module.exports = { carte: 29, fiches: fiches };
