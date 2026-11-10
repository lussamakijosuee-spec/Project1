/*
 * LES PERSONNAGES DU BAR (carte 46), comme des OC — voir oc/ville.js pour les
 * champs. Le vieux est celui de JOKO : « ancien rang S », âme en deuil ; on
 * ne lui ajoute rien de sombre, seulement ce qui le fait sourire.
 */
'use strict';
module.exports = {

/* ── Margot (46:27) — la serveuse, quinze ans de plateaux ───────────────── */
'46:27': {
    oc: {
        age: '41 ans', allure: 'trois chopes dans chaque main, un torchon sur l\'épaule, un crayon planté dans les cheveux',
        caractere: 'sèche, rapide, jamais méchante ; appelle tout le monde « mon grand » ; voit tout, ne dit que l\'utile',
        aime: 'la table près de la fenêtre après la fermeture, un verre seule, les clients qui ramènent leur chope',
        deteste: 'les verres cassés, les mains sur le comptoir mouillé, qu\'on lui siffle',
        reve: 'un jour de repos. Un seul. Assise. Sans que personne l\'appelle',
        secret: 'elle connaît la commande de chacun par cœur, et elle sert le vieux sans qu\'il demande depuis dix ans',
        peur: 'que le bar devienne calme ; elle ne saurait plus quoi faire de ses mains',
        manie: 'elle essuie le comptoir quand elle réfléchit, même propre',
        phrase: 'Allez, mon grand.',
        liens: { 'Le vieux': 'elle le sert sans qu\'il demande ; c\'est la seule qui le connaît encore', Colin: 'il chante faux, il paie, il a le droit', Hilde: 'elle lui garde une chaise près du feu depuis qu\'elle chantait', Mireille: 'elle lui ressert de l\'eau pour la faire parler moins fort' }
    },
    anniversaire: '9/9', anniv: ['C\'est mon anniversaire, mon grand. Ici, ça veut dire que je sers quand même. Mais avec un sourire. Un petit.'],
    lieux: {
        bar: ['~Elle file entre les tables, un plateau dans chaque main, sans rien renverser.|Chaud devant ! … Toi, tu bouges pas. Ta chope arrive.'],
        repos: ['Le jour de repos ? C\'est le jour où ils boivent le plus. Moi, je me repose à la fermeture. Cinq minutes. À la fenêtre.']
    },
    avis: {
        Roul: ['Roul écarte les mains un peu plus chaque soir. Je lui pose sa bière avant qu\'il ait fini. Ça l\'arrête au milieu du poisson.'],
        'Le vieux': ['Le vieux au bout du comptoir ? Dix ans que je le sers. Il dit « merci » une fois par an. Je les compte.'],
        Colin: ['Le barde chante faux. Mais il chante pour la salle, pas pour lui. Ça, ça s\'entend même quand c\'est faux.'],
        Mireille: ['Mireille boit de l\'eau et parle comme si c\'était du vin. Je lui en ressers. Ça la calme. Un peu.'],
        Hilde: ['Hilde chantait ici, avant les petits. Je lui garde une chaise. Elle reviendra. Je le sais.']
    },
    aCote: { 'Le vieux': ['~Elle pose un verre devant le vieux, sans un mot, et continue.|Lui, il commande pas. Il attend que je sache.'] },
    amitie: [
        [3, { bonjour: ['Ah, toi. Ta place est libre. Je l\'ai gardée. Par hasard.'] }],
        [6, { bonjour: ['\\P[1] ! Assieds-toi, je t\'apporte ce que tu prends d\'habitude. … Oui, je sais ce que tu prends.'], aurevoir: ['À demain, mon grand. Je garde ta chaise.'] }],
        [10, { bonjour: ['~Elle pose son plateau. Elle ne pose jamais son plateau.|Toi. Bonsoir. Pour de vrai.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'le plateau', rdv: 'Ce soir, c\'est la foire. Si tu passes après vingt heures, je te mets au travail. Tu verras ce que c\'est, la vraie bagarre.', rappel: 'Ce soir, après vingt heures. Tu portes un plateau.', quand: { carte: 46, de: 20, a: 24 },
          gestes: ['Tiens. Trois chopes. Table du fond. Ne regarde pas les chopes, regarde où tu marches.', ['son', 'Equip1'], '~Tu traverses la salle, le plateau tremble, quelqu\'un recule sa chaise au mauvais moment.', ['bulle', 1],
              ['choix', ['Garder l\'équilibre', 'Tout poser vite'], [['~Rien ne tombe. Une table entière applaudit.', ['son', 'Applause1', 40], 'Pas mal, mon grand. Quinze ans, et j\'ai jamais eu d\'applaudissements, moi.', ['ami', 1]],
                  ['~Tu poses les chopes en catastrophe. Une se renverse sur Garrec, qui ne dit rien parce que c\'est toi.', 'Bon. Un verre renversé, c\'est deux pièces. Je te les fais pas. Cette fois.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la fenêtre', rdv: 'Reste après la fermeture, un soir. Vers minuit. Je te montrerai le meilleur moment de la journée.', rappel: 'Après la fermeture. La table près de la fenêtre.', quand: { carte: 46, de: 23, a: 3 },
          gestes: ['~La salle est vide. Les chaises sont sur les tables. Elle s\'assied à la table près de la fenêtre, avec deux verres.', 'Voilà. C\'est ça, le meilleur moment. Personne qui appelle. La mer, là-bas, qui fait rien.', ['bulle', 8],
              ['choix', ['Trinquer en silence', 'Pourquoi tu restes ici ?'], [['~Vous trinquez. Elle ne dit rien pendant une longue minute. C\'est un cadeau.', ['ami', 1]], ['Pourquoi… Parce qu\'ici, tout le monde rentre chez soi un peu moins seul. Même moi. Allez, bois.', ['ami', 1]]]]] },
        { palier: 10, titre: 'la chope', gestes: ['~Elle sort de sous le comptoir une chope en étain, gravée à ton nom, de travers.', 'C\'est Ulric qui l\'a gravée. Elle reste ici. Elle est à toi. Personne d\'autre ne boit dedans.', 'Même pas le vieux. Et lui, il a le droit à tout.', ['ami', 1]] }
    ],
    cadeaux: { adore: [47, 7], aime: [44, 9, 48], deteste: [10, 8],
        dits: { adore: ['~Elle reste une seconde sans bouger. C\'est long, pour elle.|… Pour moi ? Pas pour la salle ? Merci, mon grand.'], aime: ['C\'est gentil. Je le garde pour la fermeture.'],
            neutre: ['Merci. Je mets ça derrière le comptoir.'], deteste: ['De la bière ? Pour moi ? J\'en sers huit cents par jour, mon grand. Garde-la.'], deja: ['Arrête, tu vas me faire croire que t\'es amoureux. Un par jour, ça suffit.'], anniv: ['Et pour mon anniversaire, en plus. Ne dis rien à la salle. Ils chanteraient.'] } }
},

/* ── Le vieux (46:13) — l'ivrogne du comptoir, l'ancien rang S ──────────── */
'46:13': {
    oc: {
        age: 'soixante ans passés (il ne dit pas)', allure: 'manteau usé aux coudes, une cicatrice qui lui ferme presque un œil, des mains qui ne tremblent pas',
        caractere: 'grave, lent, cynique ; ne parle jamais du passé en face ; fait attention aux jeunes sans le montrer',
        aime: 'sa place au bout du comptoir, la lumière qui tombe dessus, que Margot sache sans qu\'il demande',
        deteste: 'qu\'on raconte ses combats à sa place (Garrec), qu\'on dise que les rangs protègent',
        reve: 'qu\'un jour, plus personne n\'ait besoin d\'être rang S',
        secret: 'il apprend à Lise à tenir une arme, en lui disant qu\'il ne lui apprendra jamais rien',
        peur: 'qu\'un jeune parte trop tôt',
        manie: 'il tourne son verre d\'un quart de tour avant chaque gorgée',
        phrase: 'Rentre. Surtout, rentre.',
        liens: { Margot: 'la seule qui le connaît encore', Lise: 'elle le harcèle de questions ; il la trouve « trop bête pour mourir intelligemment », et il la protège', Garrec: 'il raconte ses combats ; un tiers seulement sont à lui', 'Béran': 'un verre par mois, sans un mot' }
    },
    lieux: {
        bar: ['~Il tourne son verre d\'un quart de tour, puis boit.|T\'es encore sur ma lumière.'],
        nuit: ['~Il est le dernier. Il est toujours le dernier.|Va dormir. Moi, je dors pas. Depuis longtemps.']
    },
    avis: {
        Colin: ['Le barde écoute quand je murmure. Il croit que je sais pas. … Je murmure un peu plus fort, pour lui.'],
        Gaudry: ['Le forgeron m\'a forgé une lame, autrefois. Elle tient encore. Comme lui. Comme moi, à peu près.'],
        Fernand: ['Le vieux paysan qui dit le temps. Ses genoux parlent de la pluie, les miens d\'autre chose. On se comprend. On en parle pas.'],
        Margot: ['Margot me sert sans que je demande. Dix ans. Faudrait que je lui dise merci. Je le dirai. Un jour.'],
        Lise: ['La petite du forgeron pose des questions. Des bonnes. Je réponds pas. Elle revient. C\'est comme ça qu\'on apprend.'],
        Garrec: ['Garrec a vécu un tiers de ce qu\'il raconte. Le reste, c\'est à moi. Je lui laisse. Il en a plus besoin que moi.']
    },
    aCote: { Lise: ['~Il grogne sans tourner la tête.|Elle va encore me demander comment on tient une épée. Elle le sait. Elle veut juste que je le dise.'] },
    amitie: [
        [3, { bonjour: ['~Il lève les yeux de son verre. C\'est rare.|Toi.'] }],
        [6, { bonjour: ['\\P[1]. Assieds-toi. Pas trop près. Là. Bien.'], aurevoir: ['Rentre.'] }],
        [10, { bonjour: ['~Il pousse un tabouret vers toi du bout du pied.|Assieds-toi, petit.'], aurevoir: ['Rentre, petit. On a besoin de toi entier.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'la garde', rdv: 'Ce soir, quand la salle se vide. Après vingt-deux heures. Je te montrerai une chose. Une seule.', rappel: 'Ce soir. Tard. Une chose.', quand: { carte: 46, de: 22, a: 3 },
          gestes: ['~Il se lève de son tabouret. La salle, presque vide, se tait d\'un coup.', 'Ton arme. Trop haute. Je te l\'ai dit.', '~Il pose deux doigts sur ton poignet et le baisse d\'un pouce.', ['bulle', 8], 'Là. Tu verras mieux. Et tu rentreras.',
              ['choix', ['Merci', 'Montre-m\'en plus'], [['~Il se rassied sans répondre. Mais il a hoché la tête.', ['ami', 1]], ['Une chose, j\'ai dit. … Reviens demain. Peut-être une autre.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la chanson', rdv: 'Si tu restes tard un soir, après minuit, je chanterai peut-être. Le barde dit que je connais des chansons. Le barde parle trop.', rappel: 'Après minuit. Peut-être.', quand: { carte: 46, de: 0, a: 4 },
          gestes: ['~La salle est vide. Margot range au fond. Le vieux fixe la porte.', '~Il murmure une vieille chanson de route, une chanson d\'équipe, qui parle d\'un feu de camp et de quatre voix.', ['son', 'Saint5', 40],
              '~Il s\'arrête au milieu.', 'Le reste, c\'était les autres qui le chantaient.', ['choix', ['Le fredonner avec lui', 'Rester en silence'], [['~Tu fredonnes la fin, sans les mots. Il ferme les yeux. Il sourit, très peu.', 'Pas mal. Faux. Mais pas mal.', ['ami', 1]], ['~Vous restez en silence. Il tourne son verre d\'un quart de tour.', '… Merci.', ['ami', 1]]]]] },
        { palier: 10, titre: 'le nom', gestes: ['~Il te regarde longtemps, pour la première fois en face.', 'On m\'appelait autrement, avant. Ça n\'a plus d\'importance.', 'Ici, je suis « le vieux ». C\'est un bon nom. Il m\'a été donné par des gens qui m\'aiment bien.', 'Toi aussi, tu peux m\'appeler comme ça.', ['ami', 1]] }
    ],
    cadeaux: { adore: [10, 45], aime: [47, 46], deteste: [63, 13],
        dits: { adore: ['~Il regarde l\'objet. Il tourne son verre d\'un quart de tour.|… Merci.'], aime: ['Hm. Ça ira.'],
            neutre: ['~Il hausse une épaule.|Pose ça là.'], deteste: ['Garde ça. Les remèdes, j\'en ai bu assez pour trois vies.'], deja: ['Assez. Garde ton or. T\'en as pas.'] } }
},

/* ── Mireille (46:14) — la commère du bar ──────────────────────────────── */
'46:14': {
    oc: {
        age: '63 ans', allure: 'chapeau à plumes défraîchi, châle à franges, une broche pour chaque jour de la semaine',
        caractere: 'volubile, chuchote fort ; sait tout sur tout le monde, se trompe une fois sur deux, ne dit jamais de mal (« c\'est la vérité »)',
        aime: 'une bonne histoire, les disputes d\'Hector et Maude, être la première à savoir, le thé avec trois sucres',
        deteste: 'qu\'on lui dise « je le savais déjà », le silence de sa maison',
        reve: 'qu\'on écrive un jour « Les Mémoires de Mireille » ; elle a déjà le titre et trois mille pages dans la tête',
        secret: 'elle invente une moitié de ses histoires pour que les gens restent lui parler',
        peur: 'qu\'on l\'oublie si elle se tait',
        manie: 'elle commence chaque phrase par « tu sais pas la meilleure »',
        phrase: 'Tu sais pas la meilleure ?',
        liens: { Mado: 'sa rivale : Mado lave, Mireille raconte', Margot: 'elle lui ressert de l\'eau pour qu\'elle parle moins fort', 'Hector et Maude': 'son feuilleton préféré', Colette: 'elle raconte qu\'elle invoque des ombres ; c\'est faux, elle le sait' }
    },
    anniversaire: '4/1', anniv: ['C\'est mon anniversaire ! Le premier avril ! Personne ne me croit jamais. C\'est la seule fois où je dis la vérité.'],
    lieux: {
        bar: ['~Elle se penche vers toi et chuchote si fort que la table d\'à côté se penche aussi.|Tu sais pas la meilleure ?'],
        repos: ['Le jour de repos, tout le monde est en ville. Tout le monde ! Je ne sais plus où donner de l\'oreille.']
    },
    avis: {
        'Évariste': ['Le vieil Évariste habite ma maison. Je lui raconte tout, il ne retient rien. C\'est le meilleur public du monde : je peux tout lui raconter deux fois.'],
        Ninon: ['La petite coursière, Ninon, ne me dit jamais qui reçoit quoi. Jamais ! … Et une fois par mois, quelqu\'un m\'écrit sans signer. Je ne sais pas qui. Je cherche.'],
        Hilde: ['Hilde, de l\'épicerie, ne me dit jamais rien. Jamais ! C\'est très suspect. Ou très sage. Je n\'ai pas encore décidé.'],
        Mado: ['Mado dit qu\'elle sait des choses. Elle lave des draps, oui. Moi, j\'écoute. C\'est plus propre.'],
        Colette: ['La petite Colette, en noir, avec ses livres… On dit qu\'elle parle aux ombres. Bon. C\'est moi qui le dis. Mais on le dit.'],
        Margot: ['Margot me ressert de l\'eau. Elle croit que je ne vois pas son manège. Je vois tout. C\'est mon métier.'],
        Hector: ['Hector et Maude se sont encore disputés. Pour une cuillère. Trente ans de mariage, et une cuillère. C\'est merveilleux.']
    },
    aCote: { Mado: ['~Elle plisse les yeux vers Mado.|Ne lui répète rien. Elle le dirait à ses draps.'] },
    amitie: [
        [3, { bonjour: ['Toi ! Assieds-toi, j\'en ai une bonne. Une vraie, cette fois. Enfin, presque.'] }],
        [6, { bonjour: ['\\P[1], mon trésor ! Tu sais que tout le monde parle de toi ? Bon. C\'est moi qui parle de toi. Mais en bien !'], aurevoir: ['Reviens vite ! Je te garde la suite !'] }],
        [10, { bonjour: ['~Elle te prend les deux mains.|Toi, je ne raconte jamais rien sur toi. Jamais. C\'est la plus grande preuve d\'amour que je puisse faire.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'la meilleure', rdv: 'Passe demain après-midi. J\'en ai une si bonne que je dois te la raconter en personne, sans témoins.', rappel: 'Demain après-midi ! La meilleure ! Sans témoins !', quand: { carte: 46, de: 13, a: 18 },
          gestes: ['~Elle vérifie à gauche, à droite, sous la table.', 'Tu sais pas la meilleure ? Le barde… a écrit une chanson. Pour quelqu\'un. Il l\'a cachée dans son luth.', ['bulle', 1], 'Je ne sais pas pour qui. Mais j\'ai une idée. J\'ai TOUJOURS une idée.',
              ['choix', ['Pour qui ?', 'Ce n\'est pas tes affaires'], [['~Elle se penche, ravie.|Pour la petite Pia, du moulin ! … Ou pour Margot. Ou pour la mer. Il est bizarre, ce garçon.', ['ami', 1]],
                  ['~Elle te regarde, offensée, puis éclate de rire.', ['son', 'Laugh', 40], 'Pas mes affaires ! Tout est mes affaires ! … Mais tu as raison. Je ne le dirai qu\'à trois personnes.', ['ami', 1]]]]] },
        { palier: 6, titre: 'les mémoires', rdv: 'Un soir, viens. Vers dix-neuf heures. Je vais te lire le début de mes Mémoires. Je n\'ai rien écrit. Je vais te les dire.', rappel: 'Ce soir, mes Mémoires ! Tu seras le premier lecteur. Enfin, auditeur.', quand: { carte: 46, de: 18, a: 22 },
          gestes: ['~Elle se redresse, croise les mains, très solennelle.', '« Les Mémoires de Mireille. Chapitre un. Ce jour-là, le boulanger avait mis de la sciure dans son pain. Je ne l\'avais pas vu. Mais j\'en étais sûre. »', ['bulle', 3],
              'Tu crois que ça se vendrait ?', ['choix', ['Je l\'achèterais', 'Écris-le vraiment'], [['~Elle rougit sous son chapeau.|Tu l\'achèterais… Oh, mon trésor. Je te le dédicacerai. Avec des fautes.', ['ami', 1]], ['L\'écrire… Jehan pourrait l\'écrire. Je lui dicterais. Il écrit bien, Jehan. Il ne parle pas. On se compléterait.', ['ami', 1]]]]] },
        { palier: 10, titre: 'la vérité', gestes: ['~Elle baisse la voix. Pour de vrai, cette fois.', 'Tu sais pourquoi j\'invente ? Pour que les gens restent. Une bonne histoire, et ils s\'assoient.', 'Avec toi, je n\'ai pas besoin d\'inventer. Tu restes quand même. C\'est reposant.', ['ami', 1]] }
    ],
    cadeaux: { adore: [48, 7], aime: [9, 44, 63], deteste: [10, 102],
        dits: { adore: ['Oh ! Oh, oh, oh ! Pour moi ? Tout le bar va le savoir ! … C\'est moi qui vais le dire.'], aime: ['Merci, mon trésor ! Je raconterai que tu es généreux. C\'est vrai, en plus.'],
            neutre: ['Merci ! C\'est… original. J\'en ferai une histoire.'], deteste: ['De la bière ? Moi ? Je bois de l\'eau, mon petit, et ça me suffit pour parler.'], deja: ['Encore ? On va jaser ! … Enfin, je vais jaser.'], anniv: ['Pour mon anniversaire ! Tu m\'as crue ! Tu es le seul !'] } }
},

/* ── Colin (46:12, page 2) — le barde qui cherche le chant de la mer ───────── */
'46:12/2': {
    oc: {
        age: '26 ans', allure: 'luth rapiécé, chapeau à plume trop longue, une chemise jaune qui se voit de la forêt',
        caractere: 'rêveur, dramatique, rit de lui-même ; chante faux avec conviction',
        aime: 'les derniers clients de la nuit, une note juste, la mer à l\'aube, qu\'on lui demande une chanson (même s\'il ne la joue pas)',
        deteste: 'les chopes lancées (il en a fait une chanson), qu\'on lui dise de chanter « quelque chose de connu »',
        reve: 'retrouver la note de la mer et en faire la chanson que tout le monde fredonne sans savoir d\'où elle vient',
        secret: 'il sait que Pia le regarde ; il fait semblant de regarder le mur, parce qu\'il a peur de chanter faux pour elle',
        peur: 'qu\'on l\'écoute vraiment',
        manie: 'il accorde son luth au milieu d\'une phrase',
        phrase: 'Les neuves sont fausses, les vieilles sont tristes.',
        liens: { Pia: 'elle le regarde ; il le sait ; il n\'ose pas', Margot: 'elle dit qu\'il chante faux ; elle a raison', 'Le vieux': 'il connaît de vieilles chansons d\'équipe, qu\'il ne chante jamais', 'Aimé et Basile': 'les jumeaux veulent chacun être le héros de sa chanson' }
    },
    anniversaire: '6/1', anniv: ['C\'est mon anniversaire ! J\'ai écrit une chanson sur moi. Elle est longue. Elle est triste. Elle est fausse. C\'est la meilleure.'],
    lieux: {
        bar: ['~Il accorde son luth, s\'arrête, recommence.|Le la est fâché ce soir. Je lui parle doucement.'],
        nuit: ['La nuit, je joue pour les derniers. Ce sont les meilleurs : ils pleurent. Ou ils dorment. C\'est pareil, pour l\'artiste.']
    },
    avis: {
        'Barthélemy': ['Le conteur m\'a dit de garder la fin. J\'ai gardé la fin. Les gens se penchent, maintenant. Je ne sais pas comment il fait, avec un verre de lait.'],
        Pia: ['Il y a une fille qui me regarde, le soir. Enfin, je crois qu\'elle regarde le mur. Le mur est très beau.'],
        Margot: ['Margot dit que je chante faux. Elle a raison. Mais elle ne m\'a jamais demandé d\'arrêter. C\'est un compliment, chez Margot.'],
        'Le vieux': ['Le vieux murmure des chansons de route quand il croit qu\'on n\'écoute pas. J\'écoute. Je ne les vole pas. Je les garde.']
    },
    aCote: { Pia: ['~Il s\'arrête de jouer au milieu d\'un accord, puis reprend, plus fort, plus faux.|… Je ne suis pas troublé. C\'est le luth.'] },
    amitie: [
        [3, { bonjour: ['Ah ! Mon public ! Mon unique, mon fidèle public !'] }],
        [6, { bonjour: ['\\P[1] ! J\'ai écrit un couplet sur toi. Il rime avec « courageux ». Enfin, il rimera.'], aurevoir: ['Que ta route soit en mode majeur, mon ami !'] }],
        [10, { bonjour: ['~Il joue trois notes en te voyant entrer. Ce sont les tiennes.|Ton thème. Je l\'ai fini. Il est juste. Pour une fois.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'la demande', rdv: 'Ce soir, viens au bar après vingt heures. Je te jouerai la chanson de ton choix. Enfin, celle que je connais.', rappel: 'Ce soir ! Une chanson ! Choisis bien. Il y en a deux.', quand: { carte: 46, de: 20, a: 24 },
          gestes: ['Alors ! Que veux-tu entendre ?', ['choix', ['Une chanson gaie', 'Une chanson triste'], [
                  ['~Il joue une chanson à boire. Mado tape sur la table, les jumeaux Vannier chantent chacun leur version.', ['son', 'Applause1', 50], 'Tu vois ? Faux, mais ensemble. C\'est ça, une chanson gaie.', ['ami', 1]],
                  ['~Il joue lentement. Une chanson de barque qui revient. Le bar se tait. Même Garrec.', ['son', 'Saint5', 40], 'Tu vois ? Une chanson triste, c\'est une chanson qui finit bien, mais trop tard.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la mer', rdv: 'Une nuit, viens avec moi écouter la mer. Je pars du bar vers minuit. Si tu es là, je t\'emmène.', rappel: 'Minuit. La mer. Apporte tes oreilles.', quand: { carte: 46, de: 0, a: 4 },
          gestes: ['~Il range son luth, très doucement, comme un enfant qu\'on couche.', 'Ce soir, je n\'irai pas à la mer. Je vais te raconter, plutôt. C\'est moins froid.', 'Une note, une seule, très basse. Elle m\'a traversé comme du froid. Et puis plus rien.', ['bulle', 8],
              ['choix', ['Joue-la-moi', 'Tu la retrouveras'], [['~Il pince une corde grave. Ce n\'est pas la bonne. Il le sait. Il sourit quand même.', '… Presque. Avec toi pour écouter, c\'est presque.', ['ami', 1]], ['Tu crois ? … Tu es le premier à ne pas me prendre pour un fou. Je te mettrai dans la chanson.', ['ami', 1]]]]] },
        { palier: 10, titre: 'ton thème', gestes: ['~Il joue trois notes, puis cinq, puis une petite mélodie qui grimpe et qui revient.', ['son', 'Saint5', 50], 'C\'est toi. Enfin, ta chanson. Elle part, elle revient. Comme toi.', 'Elle est juste. C\'est la première que j\'écris juste. Il fallait quelqu\'un qui revienne.', ['ami', 1]] }
    ],
    cadeaux: { adore: [93, 10], aime: [47, 44, 7], deteste: [8, 102],
        dits: { adore: ['~Il serre l\'objet contre son cœur, très théâtral.|Un cadeau ! Pour un artiste ! Je vais en faire une chanson ! … Elle sera fausse, mais sincère.'], aime: ['Merci ! L\'inspiration a besoin de nourriture. Et de toi.'],
            neutre: ['Oh. Merci. C\'est… je l\'utiliserai dans une métaphore.'], deteste: ['~Il recule d\'un pas dramatique.|Non ! Ça, c\'est la mort de la musique. Garde-le.'], deja: ['Un cadeau par jour, sinon je vais croire que je suis célèbre.'], anniv: ['Pour mon anniversaire ! J\'en ferai le refrain !'] } }
},

/* ── Lise (46:18) — la fille du forgeron qui rêve d'aventure ────────────── */
'46:18': {
    oc: {
        age: '16 ans', allure: 'mains noires de suie, cheveux roux attachés avec un fil de fer, une lame tordue à la ceinture',
        caractere: 'enthousiaste, pose trop de questions, parle vite ; a de bonnes mains et ne le croit pas',
        aime: 'les cicatrices des chasseurs, les histoires de combat, la forge la nuit, Emma Fieldensong (elle ne le dira pas à Emma)',
        deteste: 'qu\'on lui dise qu\'elle est trop jeune, les lames droites « sans caractère »',
        reve: 'passer l\'Admission et s\'appeler « Lise l\'Enclume » ; Garrec dit que c\'est un bon nom, il ment peut-être',
        secret: 'le vieux lui apprend à tenir une arme, en disant qu\'il ne lui apprendra jamais rien',
        peur: 'que son père ait raison',
        manie: 'elle mime les combats qu\'on lui raconte, avec sa lame tordue',
        phrase: 'Et après ? Et après ?!',
        liens: { Gaudry: 'son père ; il dit non, il lui forgera la meilleure armure de sa vie', 'Le vieux': 'son maître qui dit qu\'il n\'est pas son maître', Garrec: 'il lui a promis de lui apprendre à se battre ; il a oublié', Emma: 'son idole aux flammes rouge-noir' }
    },
    anniversaire: '3/17', anniv: ['C\'est mon anniversaire ! Seize ans ! Encore deux ans et je passe l\'Admission ! Enfin… si papa signe.'],
    lieux: {
        bar: ['Papa croit que je suis chez ma tante. Ma tante croit que je suis à la forge. La forge, elle, sait que je suis ici.'],
        nuit: ['Je devrais être couchée. Mais c\'est la nuit que les vieux racontent les vraies histoires.']
    },
    avis: {
        'Élise': ['La petite Élise me suit avec son épée de bois. Je lui ai montré comment on tient un marteau. Elle a voulu le garder. Elle a neuf ans. Je l\'aime bien.'],
        Gaudry: ['Papa dit qu\'une forgeronne, c\'est déjà bien assez d\'aventure. Il a forgé l\'épée d\'un rang A une fois. Il en parle tous les soirs. C\'est SON aventure.'],
        'Le vieux': ['Le vieux au comptoir, il était rang S ! S ! Il m\'a baissé le poignet d\'un pouce, hier, sans rien dire. Je tiens mieux ma lame. C\'est une leçon, ça, non ?'],
        Emma: ['Au Village de Pêche, il y a une fille de l\'Académie qui fait du feu NOIR. Rouge et noir. Je veux une lame qui fait ça.'],
        Garrec: ['Garrec a promis de m\'apprendre à me battre. Il a oublié. Je lui rappelle tous les soirs. Il a oublié tous les soirs.']
    },
    aCote: { 'Le vieux': ['~Elle chuchote, les yeux brillants.|Il est là ! Regarde comment il tient son verre. Comme une garde. Tu vois ?'] },
    amitie: [
        [3, { bonjour: ['Te revoilà ! T\'as un nouveau combat ? Raconte ! Dans l\'ordre !'] }],
        [6, { bonjour: ['\\P[1] ! J\'ai forgé une lame droite ! Enfin, moins tordue ! Regarde !'], aurevoir: ['Emmène-moi la prochaine fois ! … Non ? La suivante !'] }],
        [10, { bonjour: ['~Elle te tend une lame, à deux mains, toute fière.|C\'est pour toi. C\'est la première qui n\'est pas tordue.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'la lame tordue', rdv: 'Viens au bar ce soir, avant vingt-deux heures. Je te montre ma lame. Ne dis rien à papa.', rappel: 'Ce soir, au bar ! Ma lame ! Chut !', quand: { carte: 46, de: 18, a: 22 },
          gestes: ['~Elle pose sa lame tordue sur la table, comme un trésor.', 'Elle est tordue. Mais elle coupe. Regarde.', ['son', 'Sword1'], '~Elle tranche une pomme. Les deux moitiés partent dans des directions opposées.', ['bulle', 6],
              ['choix', ['Elle a du caractère', 'Ton père t\'aiderait'], [['DU CARACTÈRE ! C\'est exactement ça ! Les lames droites n\'ont pas de caractère !', ['ami', 1]], ['~Elle regarde ses mains noires.|… Peut-être. S\'il arrêtait de dire non. Je vais lui montrer. Un jour.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la leçon', rdv: 'Ce soir, tard, après vingt-deux heures. Le vieux va peut-être me montrer quelque chose. Viens, j\'ai besoin d\'un témoin.', rappel: 'Ce soir, tard ! Le vieux ! Un témoin !', quand: { carte: 46, de: 21, a: 23 },
          gestes: ['~Elle se tient devant le comptoir, sa lame à la main, très droite.', ['dit', 'Le vieux', 'Trop haut.'], '~Elle baisse le poignet d\'un pouce.', ['dit', 'Le vieux', '… Mieux.'], ['bulle', 4],
              '~Elle se retourne vers toi, rouge de bonheur, et articule sans un bruit : « IL M\'A APPRIS ».', ['choix', ['Applaudir en silence', 'Lui faire un clin d\'œil'], [['~Tu applaudis sans un bruit. Elle saute sur place, sans un bruit non plus.', ['ami', 1]], ['~Elle te répond par un clin d\'œil raté, les deux yeux fermés.', ['ami', 1]]]]] },
        { palier: 10, titre: 'la lame droite', gestes: ['~Elle pose sur la table une lame droite, propre, brillante.', 'Papa m\'a aidée. Il a dit « pas mal ». Il n\'a jamais dit « pas mal » de sa vie.', 'Elle est pour toi. Si tu la casses, je t\'en fais une autre. Si tu la gardes, je deviens forgeronne pour de vrai.', ['ami', 1]] }
    ],
    cadeaux: { adore: [86, 104], aime: [45, 47, 97], deteste: [8, 48],
        dits: { adore: ['C\'EST UN MATÉRIAU DE MONSTRE ! Un vrai ! Je vais le forger ! Papa va hurler ! MERCI !'], aime: ['Merci ! Je le garde dans mon coffre aux trésors. Enfin, mon seau.'],
            neutre: ['Oh, merci ! C\'est pour quoi faire ? Je trouverai !'], deteste: ['Du thé ? Je suis pas une vieille ! Garde ça pour Mireille.'], deja: ['Encore ?! T\'es trop gentil. Garde-le pour la prochaine aventure !'], anniv: ['Pour mon anniversaire ! C\'est le meilleur des seize !'] } }
},

/* ── Roul (46:26) — le pêcheur, rival de Tobin ─────────────────────────── */
'46:26': {
    oc: {
        age: '39 ans', allure: 'bottes de pêcheur jusqu\'aux cuisses, un chapeau de toile, une odeur de poisson qu\'il appelle « l\'odeur du succès »',
        caractere: 'grincheux, jaloux, exagère ses prises ; au fond, il garde une place dans sa barque pour Tobin',
        aime: 'les bars, l\'aube sur la mer, gagner contre Tobin, raconter la même prise de plus en plus grosse',
        deteste: 'Tobin (il dit), les mouettes, qu\'on mesure ses poissons',
        reve: 'prendre le Patriarche, celui dont on parle, et le relâcher devant Tobin',
        secret: 'il a gardé la deuxième rame de la barque de leur enfance ; elle est chez lui, au-dessus de la porte',
        peur: 'que Tobin pêche mieux que lui (c\'est le cas, un peu)',
        manie: 'chaque fois qu\'il raconte sa prise, ses mains s\'écartent un peu plus',
        phrase: 'Il était là. Je l\'ai vu.',
        liens: { Tobin: 'son rival ; ils étaient amis gamins', Annick: 'elle lui achète sa pêche et la revend plus cher', Margot: 'elle lui sert sa bière sans écouter la taille du poisson' }
    },
    anniversaire: '5/19', anniv: ['C\'est mon anniversaire. J\'ai pris un poisson pour l\'occasion. Grand comme ça. Non. Comme ÇA.'],
    lieux: {
        bar: ['~Il écarte les mains.|Grand comme ça. … Non. Comme ça.', 'Au bar, on écoute mes histoires. En mer, les poissons les écoutent pas. C\'est pour ça que je viens ici le soir.'],
        ailleurs: ['~Il lance sa ligne, l\'œil sur le bouchon.|Chut. Il mord. Non. Il mord pas. Il réfléchit.', 'Le matin, la mer est à moi. Tobin dort. Les poissons aussi. Moi, je suis là.']
    },
    avis: {
        Solange: ['Solange, aux voiles, m\'écoute raconter mes poissons. Les jours bleus, elle dit qu\'ils sont beaux. Les jours gris, qu\'ils sont petits. Je viens les jours bleus.'],
        Tobin: ['Tobin ? Le deuxième meilleur pêcheur. Et encore. … Il a retrouvé son couteau, il paraît. Tant mieux. Il pleurait pour rien.'],
        Annick: ['Annick m\'achète ma pêche. Elle dit que mes bars sont des maquereaux. C\'est un maquereau qui se prenait pour un bar. C\'est pareil.'],
        Margot: ['Margot me sert sans écouter la taille de mon poisson. C\'est la seule. C\'est reposant.']
    },
    aCote: { Tobin: ['~Il se détourne exprès.|Je le vois pas. Il est pas là. Il existe pas.'] },
    amitie: [
        [3, { bonjour: ['Toi. T\'as vu ma prise d\'hier ? Non ? Elle était grande. Crois-moi.'] }],
        [6, { bonjour: ['\\P[1] ! Viens pêcher, un matin. Tu tiendras la ligne. Tu la tiendras mal. Mais tu la tiendras.'], aurevoir: ['Et dis bonjour à la mer.'] }],
        [10, { bonjour: ['~Il te fait de la place sur son banc, sans un mot.|Assieds-toi. Ça mord, aujourd\'hui.'] }]
    ],
    scenes: [
        { palier: 3, titre: 'la ligne', rdv: 'Demain matin, au Village de Pêche, au bout du ponton. Avant midi. Je te montre comment on pêche vraiment.', rappel: 'Demain matin, le ponton ! Apporte de la patience.', quand: { carte: 33, de: 5, a: 13 },
          gestes: ['~Il te tend sa canne sans te regarder.', 'Tiens. Lance. Pas là. Là. … Bon, là, ça ira.', ['son', 'Water2', 60], '~Le bouchon flotte. Rien. Rien. Puis il plonge.', ['bulle', 1], 'TIRE ! Doucement ! Doucement j\'ai dit !',
              ['choix', ['Tirer fort', 'Tirer doucement'], [['~Le poisson s\'envole, tourne en l\'air et retombe dans l\'eau avec un « plouf » moqueur.', ['son', 'Splash'], 'Il était grand. Comme ça. On dira qu\'il était comme ça.', ['ami', 1]],
                  ['~Un petit poisson brillant sort de l\'eau, gigote dans ta main.', ['son', 'Item1'], '… Pas mal. Pour un débutant. On le relâche. On dira qu\'il était énorme.', ['ami', 1]]]]] },
        { palier: 6, titre: 'la rame', rdv: 'Passe au bar, un soir. Vers vingt heures. J\'ai quelque chose à te raconter. C\'est pas une histoire de poisson.', rappel: 'Ce soir, au bar. Pas une histoire de poisson.', quand: { carte: 46, de: 19, a: 22 },
          gestes: ['~Il tourne sa chope entre ses mains, sans boire.', 'Gamins, Tobin et moi, on avait une barque. Une rame chacun. On ramait de travers. On tournait en rond.', 'J\'ai gardé ma rame. Elle est chez moi. Au-dessus de la porte.', ['bulle', 8],
              ['choix', ['Tu devrais la lui montrer', 'Il a gardé la sienne ?'], [['… Peut-être. Un jour. Quand il pêchera moins bien que moi. … Donc jamais. Ou demain.', ['ami', 1]], ['Je sais pas. … J\'aimerais bien. Tu lui demandes ? Non. Me regarde pas comme ça. … Bon, demande-lui.', ['ami', 1]]]]] },
        { palier: 10, titre: 'la vraie taille', gestes: ['~Il écarte les mains, puis les rapproche. Beaucoup.', 'Le poisson d\'hier. Il faisait ça. Vraiment ça.', 'C\'est la première fois que je dis la vraie taille à quelqu\'un. Garde-le pour toi. J\'ai une réputation.', ['ami', 1]] }
    ],
    cadeaux: { adore: [45, 47], aime: [10, 46, 44], deteste: [36, 102],
        dits: { adore: ['~Il regarde l\'objet, regarde la mer, te regarde.|… Ça, c\'est un cadeau de pêcheur. Merci. Vraiment.'], aime: ['Merci. Ça ira avec mes histoires.'],
            neutre: ['Hm. Merci. Ça mord pas, mais merci.'], deteste: ['Non. Ça fait fuir les poissons. Garde-le.'], deja: ['T\'as déjà donné. La mer aussi, elle donne une fois par jour. Pas plus.'], anniv: ['Pour mon anniversaire ? … Bon. Tobin m\'a rien offert. Toi, si. Note-le.'] } }
}
};
