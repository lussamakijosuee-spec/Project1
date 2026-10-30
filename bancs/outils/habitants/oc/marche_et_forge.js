/*
 * LE MARCHÉ (carte 30) ET LA FORGE (carte 41), comme des OC — voir oc/ville.js
 * pour les champs. jeck, d'après JOKO (« voix de stentor, énergique, franche,
 * sans filtre ») ; sa roulette truquée reste telle quelle (la mécanique est à
 * JOKO).
 */
'use strict';
module.exports = {

/* ── jeck (30:15) — objets trouvés et roulette (presque) honnête ────────── */
'30:15': {
    oc: {
        age: '24 ans', allure: 'gilet à mille poches, un gant dépareillé à chaque main, une roulette sous le bras, une voix qui porte jusqu\'au Village de Pêche',
        caractere: 'voix de stentor, énergique, franche, sans filtre (JOKO) ; rit avant la fin de ses propres blagues',
        aime: 'les objets perdus qui ont une histoire, faire tourner sa roue, les gens qui rient fort, Colette (comme « une pote »)',
        deteste: 'les gens qui chuchotent, le silence, qu\'on lui demande « c\'est truqué ? » (oui)',
        reve: 'une boutique d\'objets trouvés avec un écriteau « TOUT A ÉTÉ À QUELQU\'UN »',
        secret: 'il rend en douce les objets précieux à leurs propriétaires ; il dit qu\'il les a « perdus »',
        peur: 'qu\'on le trouve pénible ; il crie plus fort quand il le pense',
        manie: 'il fait tourner sa roue d\'un coup de pouce en parlant, et l\'arrête du doigt sur le bon chiffre',
        phrase: 'Tout est à vendre, sauf la bonne humeur ! … Ah si, elle aussi.',
        liens: { Colette: '« une pote » ; elle le regarde bizarre, des fois, « elle doit faire des calculs »', Théo: 'le gamin des rues, son meilleur client et son meilleur fournisseur', Jacquot: 'le colporteur ; deux bonimenteurs qui se respectent' }
    },
    anniversaire: '8/8', anniv: ['C\'EST MON ANNIVERSAIRE ! La roue tourne GRATUITEMENT aujourd\'hui ! … Non. Mais elle tourne avec le sourire.'],
    lieux: {
        travail: ['~Il brandit un gant orphelin au-dessus de la foule.|QUI A PERDU UN GANT GAUCHE ? Personne ? ALORS IL EST À VENDRE !', 'HÉ ! La roue ! Elle tourne ! Elle tourne pour toi ! … Elle penche un peu, mais elle tourne !'],
        place: ['À midi, tout le monde passe au Marché ! Tout le monde perd un truc ! C\'est mon heure de pointe !'],
        repos: ['Le jour de repos, je fais le tour de la ville. Je ramasse. Les gens perdent plus de choses quand ils se reposent.']
    },
    avis: {
        Colette: ['Colette ? C\'est une pote ! Elle dit trois mots par jour, et c\'est toujours les bons. Moi j\'en dis trois mille. On s\'équilibre !'],
        'Théo': ['Le petit Théo me vend des « nouvelles ». Elles sont fausses. Je les achète quand même. Il a de l\'avenir.'],
        Jacquot: ['Jacquot vend n\'importe quoi. Moi, je vends ce que les gens ont perdu. C\'est pas pareil. Le mien a une histoire.']
    },
    aCote: { Colette: ['~Il fait de grands signes.|COLETTE ! SALUT ! … Elle a fermé son livre très fort. Elle doit être contente.'] },
    amitie: [
        [3, { bonjour: ['HÉ, TOI ! T\'as perdu quelque chose ? Non ? DOMMAGE !'] }],
        [6, { bonjour: ['\\P[1] ! MON CLIENT PRÉFÉRÉ ! Enfin, après Théo. Il achète des trucs qu\'il m\'a vendus.'], aurevoir: ['Ciao ! Perds des trucs, je les retrouverai !'] }],
        [10, { bonjour: ['~Il arrête sa roue d\'un doigt, juste pour toi.|Pour toi, elle est honnête. Rien que pour toi. Crois-moi.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'l\'objet trouvé', rdv: 'Passe demain au Marché, l\'après-midi ! J\'ai trouvé un truc ! Je sais pas à qui c\'est ! On va enquêter !', rappel: 'Demain après-midi ! L\'ENQUÊTE !', quand: { carte: 30, de: 13, a: 18 },
          gestes: ['~Il brandit une petite clé en cuivre, très fier.', 'Une clé ! Mais de quoi ? D\'une porte ? D\'un coffre ? D\'un CŒUR ?', ['bulle', 9], 'Il y a une fleur gravée dessus. Une fleur… Rose ! La fleuriste !',
              ['choix', ['On la lui rapporte', 'On la vend'], [['~Vous allez voir Rose. C\'était la clé de sa boîte à graines. Elle pleure presque. jeck crie de joie.', ['son', 'Applause1', 40], 'TU VOIS ?! C\'est ça, le vrai métier ! … Ne le dis à personne, j\'ai une réputation de vendeur.', ['ami', 1]],
                  ['~Il te regarde, puis il éclate de rire.', ['son', 'Laugh', 50], 'LA VENDRE ?! T\'es pire que moi ! … Non, on la rapporte. Mais j\'aime ton esprit.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la roue', rdv: 'Ce soir, après la fermeture du Marché, vers dix-huit heures ! Je te montre le secret de la roue. LE secret.', rappel: 'Ce soir ! Le secret de la roue ! Personne doit savoir !', quand: { carte: 30, de: 17, a: 21 },
          gestes: ['~Il retourne sa roue. Dessous, une petite cale en bois.', 'Voilà. Le grand secret. Une cale. Elle penche à gauche. Un degré et demi.', '~Il se gratte la tête.', 'Colette me l\'a dit hier. Elle a calculé. Comment elle a su ? Elle me regarde faire, je crois. Bizarre.', ['bulle', 2],
              ['choix', ['Elle te regarde souvent', 'Enlève la cale'], [['Souvent ? … Ah. Ah ! Tu crois que… ? Non. Non ! C\'est une pote ! … Hein ?', ['bulle', 1], ['ami', 1]], ['~Il enlève la cale. La roue tourne droit. Il la regarde longtemps.', 'C\'est bizarre. Elle est honnête. Je me sens tout nu.', ['ami', 1]]]]] },
        { palier: 10, titre: 'tout a été à quelqu\'un', gestes: ['~Il sort de sa poche un vieux bouton en os, tout simple.', 'C\'est le premier truc que j\'ai trouvé. J\'avais six ans. Personne l\'a jamais réclamé.', 'Alors il est à moi. Et maintenant, il est à toi. Comme ça, il aura été à deux personnes. C\'est mieux.', ['son', 'Item1'], ['ami', 1]] }
    ],
    cadeaux: { adore: [98, 101], aime: [103, 10, 45], deteste: [48, 3],
        dits: { adore: ['OH ! UN OBJET AVEC UNE HISTOIRE ! Je sais pas laquelle, mais je vais l\'inventer ! MERCI !'], aime: ['Merci ! Je le mets dans la poche numéro quarante-trois ! Celle des trucs bien !'],
            neutre: ['Hé, merci ! Je le revendrai ! … Non, je le garde. C\'est un cadeau.'], deteste: ['Du thé ?! Moi ?! Je suis pas Colette ! … Donne-le-lui, tiens. Elle aime ça. Non, garde-le.'], deja: ['Un par jour, l\'ami ! Sinon je vais devoir ouvrir une boutique de cadeaux !'], anniv: ['POUR MON ANNIVERSAIRE ! T\'ES LE MEILLEUR !'] } }
},

/* ── Gaudry (41:3) — le forgeron, père de Lise ────────────────────────── */
'41:3': {
    oc: {
        age: '50 ans', allure: 'tablier de cuir roussi, avant-bras couverts de petites brûlures, une barbe où l\'on trouve parfois de la limaille',
        caractere: 'grave, fier, inquiet pour sa fille ; parle métal ; ne sait pas dire « je suis fier », alors il dit « pas mal »',
        aime: 'le chant de l\'enclume, une lame qui sort droite, le pain d\'épices de Berthe, les clients qui entretiennent leur armure',
        deteste: 'les runes chantées sur ses lames, les soldats qui paient en promesses, qu\'on touche ses pinces',
        reve: 'forger la meilleure armure de sa vie — pour Lise, le jour où elle partira, en espérant qu\'elle ne parte pas',
        secret: 'il sait que Lise va au bar écouter les mercenaires ; il passe devant la fenêtre chaque soir pour vérifier qu\'elle va bien',
        peur: 'que Lise ait raison de partir',
        manie: 'il frappe trois coups sur l\'enclume avant de répondre',
        phrase: 'Une bonne lame, ça dure une vie.',
        liens: { Lise: 'sa fille ; elle a de bonnes mains, il ne le lui dit pas assez', Hélène: 'l\'armurière d\'à côté, sa concurrente préférée', 'Le vieux': 'il lui a forgé une lame, il y a longtemps ; aucun des deux n\'en parle' }
    },
    anniversaire: '10/10', anniv: ['Mon anniversaire. Lise m\'a forgé un fer à cheval. Tordu. Je l\'ai mis au-dessus de la porte. Ne le dis à personne.'],
    lieux: {
        travail: ['~Il frappe trois coups sur l\'enclume, puis relève la tête.|Oui ?', 'Le métal ne ment pas. Si tu le chauffes trop, il te le dit. Les gens, non.']
    },
    avis: {
        Lise: ['Ma fille a de bonnes mains. Trop bonnes. Avec des mains comme ça, on finit par vouloir partir.'],
        'Hélène': ['Hélène, à côté, vend des armures. Elle les vend bien. Elle les forge moins bien que moi. Ne lui répète pas. Elle le sait.'],
        'Le vieux': ['Le vieux du bar ? Je lui ai forgé une lame, autrefois. Elle doit encore tenir. Mes lames tiennent.']
    },
    amitie: [
        [3, { bonjour: ['~Trois coups sur l\'enclume.|Toi. Ton armure tient ? Montre.'] }],
        [6, { bonjour: ['\\P[1]. Tu entretiens ton équipement. Je le vois. C\'est rare.'], aurevoir: ['Prends soin de ton armure. Et de toi. Dans cet ordre, ça marche mieux.'] }],
        [10, { bonjour: ['~Il pose son marteau, essuie ses mains, et te serre l\'avant-bras.|Bienvenue à la forge.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'la trempe', rdv: 'Passe à la forge en fin de journée, après seize heures. Je trempe une lame. Ça se regarde une fois dans sa vie.', rappel: 'Fin de journée. La trempe. Ne sois pas en retard, le métal n\'attend pas.', quand: { carte: 41, de: 16, a: 20 },
          gestes: ['~Il sort une lame rouge du foyer avec ses pinces.', 'Regarde la couleur. Cerise. Pas orange : orange, c\'est trop. Pas rouge sombre : pas assez.', ['son', 'Fire1', 60], '~Il plonge la lame dans l\'eau. Un nuage de vapeur siffle jusqu\'au plafond.', ['son', 'Water1'], ['bulle', 1],
              ['choix', ['C\'est magnifique', 'Comment tu sais quand ?'], [['Magnifique… C\'est du métal. Mais oui. C\'est magnifique.', ['ami', 1]], ['Trente ans. Et la mère de Lise. Elle voyait la bonne couleur avant moi. Lise aussi. Elle a ses yeux.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la fenêtre du bar', rdv: 'Un soir, viens avec moi. Vers dix-neuf heures. Je fais un tour. Je passe devant le bar. Par hasard.', rappel: 'Ce soir. Un tour. Par hasard.', quand: { carte: 41, de: 18, a: 20 },
          gestes: ['~Il dénoue son tablier, le replie, le repose.', 'Lise est au bar. Elle croit que je ne sais pas. Je passe devant la fenêtre tous les soirs.', 'Elle écoute les mercenaires. Elle mime leurs combats avec sa lame tordue. Elle est… elle est douée.', ['bulle', 8],
              ['choix', ['Dis-le-lui', 'Elle le sait déjà'], [['Lui dire… « pas mal ». Je lui dirai « pas mal ». C\'est déjà beaucoup, chez nous.', ['ami', 1]], ['… Tu crois ? Alors pourquoi elle continue à forger avec moi, si elle sait qu\'elle peut partir ?', '~Il réfléchit longtemps.', '… Parce qu\'elle aime ça. Hm. Bien.', ['ami', 1]]]]] },
        { palier: 10, titre: 'le poinçon', gestes: ['~Il prend ton arme, la retourne, et frappe un petit poinçon sur la garde : une enclume.', 'C\'est ma marque. Je ne la mets que sur ce que je répare pour les gens qui comptent.', 'Elle ne te rendra pas plus fort. Elle dira à n\'importe quel forgeron que quelqu\'un tient à toi.', ['son', 'Hammer'], ['ami', 1]] }
    ],
    cadeaux: { adore: [97, 106], aime: [45, 46, 10, 86], deteste: [42, 8],
        dits: { adore: ['~Il soupèse l\'objet, le fait sonner du doigt.|… Ça, c\'est du matériau. D\'où tu sors ça ? … Merci. Je t\'en ferai quelque chose.'], aime: ['Bien. Utile. Merci.'],
            neutre: ['Hm. Merci.'], deteste: ['De la poudre de sorcier ? Dans ma forge ? Remporte ça.'], deja: ['Un, c\'est déjà trop. Garde ton or pour ton armure.'], anniv: ['Pour mon anniversaire… Lise t\'a dit. Hm. Merci.'] } }
}
};
