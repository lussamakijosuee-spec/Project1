/*
 * LE BAR (carte 46) — ses habitués.
 * JOKO, le 2026-09-27 : « les gens, ils mènent leur vie. Malgré les
 * événements dingues qui vont se passer […] les gens vivent. »
 * Ton choisi par JOKO : chacun sa voix, réaliste (comptoir, un peu noir façon
 * Kenshi, chaleur de taverne façon Skyrim). Petits faits locaux inventés
 * permis ; rien sur l'intrigue au-delà de ce que JOKO a déjà écrit.
 */
'use strict';
var D = require('../recettes/dsl.js');
var H = require('./moteur.js');
var A = D.A, C = D.C, si = D.si, cat = D.cat, choix = D.choix;
var V = H.V;
function P(nom, t) { return H.parle(nom, t); }
function paye(n, alors, sinon) { return si(C.or(n), cat(A.or(-n), alors), sinon); }
var SW_PIA_MOT = 886, SW_COLIN_LU = 887;
var NOMS_SW = { 886: '◆ Pia · son mot est porté à Colin', 887: '◆ Colin · a lu le mot de Pia' };

var fiches = [];
function F(ev, f) { f.ev = ev; fiches.push(f); }

/* ── Margot, la serveuse (ev 27) ───────────────────────────────────────── */
F(27, {
    nom: 'Margot', role: 'serveuse, au bar depuis quinze ans', voix: 'sèche, rapide, jamais méchante ; appelle tout le monde « mon grand ».',
    murmure: 'Chaud devant !',
    premiere: 'Nouveau ? Assieds-toi où tu veux, sauf au bout du comptoir, c\'est la place de l\'autre ivrogne. Tu bois quoi ?',
    retour: ['Tiens, un revenant. J\'ai failli donner ta chaise.', 'T\'étais passé où ? On a cru que les loups t\'avaient eu.'],
    bonjour: {
        1: ['On n\'est pas encore ouverts, mon grand. Enfin… pour toi, si.', '~Elle retourne les chaises posées sur les tables, une à une.|Si c\'est pour un café, il est pas prêt.'],
        2: ['Calme, l\'après-midi. Profite, ce soir c\'est la foire.', 'Tu veux quoi ? Fais vite, j\'ai trois tables qui attendent.'],
        3: ['Chaud devant ! … Ah, c\'est toi. Qu\'est-ce que je te sers ?', 'Plein à craquer ce soir. Si tu trouves une chaise, elle est à toi.'],
        4: ['On ferme bientôt. Enfin, on dit ça tous les soirs.', '~Elle bâille sans se cacher.|Dernière tournée, mon grand. Après, dehors.']
    },
    saisons: {
        1: ['Le printemps, ça veut dire que les gars sortent du trou et boivent le double.', 'Fais attention en rentrant, la rue est une rivière de boue.'],
        2: ['Il fait une chaleur… La bière tiédit avant d\'arriver aux tables.', 'L\'été, tout le monde a soif et personne n\'a de sous.'],
        3: ['Les chasseurs reviennent avec des histoires. Je crois la moitié d\'une.', 'Automne. Les pommes, le cidre, et les disputes pour le cidre.'],
        4: ['Ferme la porte derrière toi, on chauffe pas la rue !', 'L\'hiver, ils restent jusqu\'à la fermeture. Personne veut rentrer dans le froid.']
    },
    blesse: ['T\'as du sang sur la manche, mon grand. Assieds-toi avant de tomber.', 'Tu tiens debout comment, toi ? Va voir l\'aubergiste, elle a de quoi recoudre.'],
    discuter: [
        'Quinze ans que je porte des plateaux. J\'ai les bras d\'un bûcheron et le dos d\'une vieille.',
        'Les pourboires ? Ça dépend de la lune. Les soirs de paie, ils sont généreux. Le lendemain, ils se souviennent plus.',
        'Tu vois le gars au fond qui chante faux ? Il paie toujours. Alors il a le droit de chanter faux.',
        'Si quelqu\'un casse un verre, c\'est deux pièces. S\'il casse une chaise, c\'est la porte.',
        'Mon rêve ? Un jour de repos. Un seul. Assise. Sans que personne m\'appelle.',
        'Le patron ? Il compte les pièces, moi je compte les idiots. On a chacun notre métier.'
    ],
    nouvelles: [
        'Garrec raconte qu\'il a tué un loup de rang B à mains nues. La semaine dernière c\'était avec un bâton.',
        'Pia regarde encore le barde. Tout le monde le voit, sauf le barde.',
        'Les frères Vannier se sont encore battus. Pour savoir lequel est l\'aîné. Ils sont jumeaux.',
        'Silas vend des « élixirs » au coin du bar. Ne lui achète rien que tu pourrais regretter. C\'est-à-dire rien.',
        'Le vieux au comptoir ? Il paie en or ancien. D\'où il le sort, personne ose demander.'
    ],
    perso: {
        titre: 'Et toi, Margot ?', paliers: [
            [1, 'Moi ? Je sers. C\'est tout ce qu\'il y a à savoir.'],
            [3, 'J\'avais un mari. Il est parti vendre des moutons au Village Montagnard. Ça fait six ans. Les moutons devaient être têtus.'],
            [6, '~Elle pose son plateau, pour une fois.|Tu sais ce que je fais, le soir, quand tout le monde est parti ? Je m\'assieds à la table près de la fenêtre et je bois un verre toute seule. C\'est le meilleur moment de la journée.|… Va pas le répéter.']
        ]
    },
    options: [
        { titre: 'Commander', garder: 'boutique' },
        { titre: 'Offrir une tournée (50 G)', cmds: paye(50, cat(A.se('Coin'), A.bgs('City', 40), P('Margot', 'UNE TOURNÉE POUR LA SALLE, DE LA PART DE NOTRE AMI ICI !'), P('', '~Des chopes se lèvent. Quelqu\'un crie ton nom de travers.'), H.affinite(2), A.fonduBgs(3)), P('Margot', 'Avec quoi ? Tes yeux ?')) }
    ],
    aurevoir: ['C\'est ça. Et paie en partant.', 'Allez, file.', 'À plus, mon grand.']
});

/* ── Silas, le marchand louche (ev 31) ─────────────────────────────────── */
F(31, {
    nom: 'Silas', role: 'marchand de fioles, menteur de métier', voix: 'mielleuse, trop polie, compliments à tout bout de champ.', horaire: '18-4',
    avant: P('Silas', 'Bienvenue.'),
    premiere: 'Ah ! Un visage intelligent. Ça se voit tout de suite, vous savez. Vous, vous reconnaissez la qualité.',
    retour: ['Mon client préféré ! Je vous ai gardé quelque chose. Enfin… j\'y ai pensé très fort.'],
    bonjour: {
        3: ['Bonsoir, bonsoir. Vous avez l\'air fatigué. J\'ai exactement ce qu\'il vous faut.', 'Approchez. Non, plus près. Les murs ont des oreilles.'],
        4: ['À cette heure-ci, les prix baissent. Pour vous. Seulement pour vous.', 'Vous ne dormez pas ? Moi non plus. Le commerce ne dort jamais.'],
        1: ['Déjà debout ? Un vrai professionnel.'], 2: ['Je ne suis pas vraiment ouvert. Mais pour vous…']
    },
    saisons: {
        1: ['Le printemps réveille les maladies. Et les maladies réveillent les clients.'],
        2: ['Il fait chaud, les potions tournent. Pas les miennes, bien sûr.'],
        3: ['L\'automne, tout le monde a peur de l\'hiver. La peur, c\'est bon pour les affaires.'],
        4: ['Un petit remontant contre le froid ? Recette de famille. Ma famille est très grande.']
    },
    blesse: ['Oh, mais vous saignez ! Quelle chance… je veux dire, quel malheur. J\'ai un remède.'],
    discuter: [
        'Je suis dans le commerce depuis… toujours. Mon père vendait déjà des fioles. Ou des chevaux. Enfin, quelque chose.',
        'Les gens disent que je mens. C\'est faux. J\'embellis.',
        'Tout ce que je vends est garanti. La garantie dure jusqu\'à la porte.',
        'Vous voyez Nell, là-bas ? Ne l\'écoutez pas. Elle est jalouse de mon succès.'
    ],
    nouvelles: [
        'Il paraît que le lac chante, certaines nuits. J\'ai une fiole qui protège de ça. Non ? Tant pis.',
        'Des nobles au manoir du lord. Les nobles, ça achète. Il faudrait que je m\'y présente.',
        'On dit que des loups de rang B+ rôdent au nord. J\'ai de l\'onguent anti-loup. Très efficace. Jamais testé sur un loup.'
    ],
    perso: {
        titre: 'D\'où vous venez ?', paliers: [
            [1, 'D\'un peu partout. Surtout d\'ailleurs.'],
            [4, 'Du sud. Ou de l\'est. Ça dépend de qui me cherche.'],
            [8, '~Il cesse de sourire, une seconde.|J\'ai eu un étal, un vrai, une fois. Un incendie. Personne n\'a rien remboursé. Depuis, je ne rembourse personne.|… Bon ! Une fiole ?']
        ]
    },
    options: [
        { titre: 'Voir ce qu\'il vend', garder: 'boutique' },
        {
            titre: 'Une « affaire exceptionnelle » (100 G)', cmds: paye(100, cat(A.se('Shop1'), P('Silas', 'Excellent choix ! Ne l\'ouvrez pas avant d\'être rentré.'), A.vrHasard(V.tirage, 1, 3),
                si(C.vr(V.tirage, '=', 1), cat(A.objet(22, 1), P('', '~Dans le paquet : un vrai \\I[0]\\ni[22]. Silas a l\'air aussi surpris que toi.')), cat(A.objet(8, 1), P('', '~Dans le paquet : un \\ni[8]. Évidemment.')))), P('Silas', 'Ah. Revenez quand vous serez… plus solvable.'))
        }
    ],
    aurevoir: ['Revenez vite. Je serai peut-être encore là.', 'Et n\'oubliez pas : vous ne m\'avez jamais vu.']
});

/* ── maître Ulric, le graveur (ev 11) ──────────────────────────────────── */
F(11, {
    nom: 'Ulric', role: 'graveur, vend aussi le nécessaire du voyageur', voix: 'lent, précis, parle comme il grave : peu de mots, bien choisis.', horaire: '8-20',
    premiere: 'Tu regardes mes mains ? Tout le monde regarde mes mains. Quarante ans de burin.',
    retour: ['Te revoilà. J\'ai gravé trois bagues depuis ta dernière visite. Le monde tourne.'],
    bonjour: {
        1: ['Le matin, la main est sûre. Parle bas.', '~Il souffle sur une plaque de cuivre.|Oui ?'],
        2: ['Entre. Ne touche à rien de brillant.', 'Tu veux graver ou acheter ?'],
        3: ['Je range. Fais vite.'], 4: ['Hm.']
    },
    saisons: {
        1: ['Le printemps, on me demande des alliances. Beaucoup d\'alliances. Et à l\'automne, on me demande de les effacer.'],
        2: ['La chaleur fait gonfler le bois des manches. Mauvaise saison pour graver.'],
        3: ['Automne : les gens pensent à leurs morts. On me commande des plaques.', 'L\'automne, les noms reviennent. Ceux des pierres tombales.'],
        4: ['Le froid rend le métal cassant. Et les gens bavards.']
    },
    discuter: [
        'Un nom gravé, ça reste. C\'est pour ça que les gens ont peur de le graver.',
        'J\'ai gravé l\'épée d\'un chevalier, un jour. Il est mort le lendemain. Il n\'y a pas de lien. Mais j\'y pense.',
        'Mon apprenti est parti se battre. Les jeunes veulent tous se battre. Personne ne veut apprendre à tenir un burin.',
        'Silas m\'a demandé de graver « garanti » sur ses fioles. J\'ai refusé. J\'ai une réputation.'
    ],
    nouvelles: ['Le forgeron cherche un apprenti. Lise voudrait, mais son père dit non.', 'On m\'a commandé une plaque pour le manoir du lord. Des armoiries. Ils ne lésinent pas.'],
    perso: {
        titre: 'Qui vous a appris ?', paliers: [
            [1, 'Mon père. Et son père avant lui.'],
            [4, 'J\'ai gravé mon premier nom à neuf ans. Celui de ma mère. Sur sa tombe.'],
            [7, 'Je n\'ai pas d\'enfant. Quand je partirai, la boutique fermera. Les noms que j\'ai gravés resteront. C\'est déjà ça.']
        ]
    },
    options: [
        { titre: 'Voir la marchandise', garder: 'boutique' },
        { titre: 'Faire graver ton nom (30 G)', cmds: paye(30, cat(A.se('Hammer'), A.attendre(30), A.se('Hammer'), P('Ulric', 'Voilà. \\N[1], gravé dans le cuivre. Ça tiendra plus longtemps que toi.'), H.affinite(1)), P('Ulric', 'Trente. Pas vingt-neuf.')) }
    ],
    aurevoir: ['Ferme doucement.', 'Hm. Bonne route.']
});

/* ── Colin, le barde (ev 12, page 2 — sa quête des rumeurs est gardée) ─ */
F(12, {
    page: 2, nom: 'Colin', role: 'barde, cherche le chant du lac', voix: 'rêveur, dramatique, rit de lui-même.',
    premiere: 'Une chanson, voyageur ? Les neuves sont fausses, les vieilles sont tristes.',
    bonjour: {
        1: ['~Il accorde son luth en fredonnant, les yeux mi-clos.|Le matin, les cordes sont froides. Comme le public.'],
        2: ['Je compose. Enfin, je regarde le plafond. C\'est la même chose.'],
        3: ['Ah, l\'heure où les gens écoutent ! Enfin, l\'heure où ils font semblant.', 'Une chanson pour toi ? Je prends les demandes. Je ne les exécute pas toujours.'],
        4: ['La nuit, je joue pour les derniers. Les derniers sont les meilleurs : ils pleurent.']
    },
    saisons: {
        1: ['Printemps. Toutes mes chansons parlent d\'amour. C\'est la saison qui veut ça.'],
        2: ['L\'été, les gens dansent. Même sur les chansons tristes. Surtout sur les chansons tristes.'],
        3: ['Automne. Je rejoue les chansons de départ. Il y a toujours quelqu\'un qui part.'],
        4: ['L\'hiver, je joue près du feu. Mes doigts refusent le reste du bar.']
    },
    discuter: [
        'Une nuit, au bord du lac, j\'ai entendu une note. Une seule. Très basse. Depuis, j\'essaie de la retrouver sur mon luth.',
        'On m\'a jeté une chope, une fois. J\'en ai fait une chanson. Elle marche bien.',
        'Margot dit que je chante faux. Margot a raison. Mais avec conviction.',
        'Le vieux au comptoir connaît de vieilles chansons de soldats. Il refuse de les chanter. Il les murmure quand il croit que personne n\'écoute.',
        'Les frères Vannier m\'ont demandé une chanson sur eux. Chacun veut être le héros.',
        'Une fille me regarde, le soir. Enfin, je crois qu\'elle regarde le mur derrière moi.'
    ],
    perso: {
        titre: 'Le chant du lac ?', paliers: [
            [1, 'Tu me prendrais pour un fou.'],
            [3, 'Une note. Pas humaine. Pas un animal non plus. Elle m\'a traversé comme du froid.'],
            [6, 'Je retourne au lac, certaines nuits. Je n\'ai plus rien entendu. Parfois, je me demande si je veux vraiment l\'entendre encore.']
        ]
    },
    options: [
        { titre: 'Une rumeur ?', si: C.js('$gameSystem.questStatus(\'rumeurs\')===\'active\''), garder: 'rumeurs' },
        { titre: 'Une chanson', garder: 'chanson' },
        {
            titre: 'Le mot de Pia', si: C.sw(SW_PIA_MOT), cmds: si(C.sw(SW_COLIN_LU, false), cat(P('', '~Tu lui tends le papier plié. Il le lit deux fois.'), P('Colin', 'Pia ? La fille du meunier ? Elle… elle écoute mes chansons ?|~Il rougit jusqu\'aux oreilles.|Dis-lui… dis-lui que la prochaine sera pour elle.'), A.sw(SW_COLIN_LU, true), H.affinite(2)),
                P('Colin', 'J\'ai écrit la chanson. Elle est nulle. Je la chanterai quand même.'))
        }
    ],
    aurevoir: ['Que la route te soit en mode majeur.', 'Reviens écouter. Ça m\'encourage.']
});

/* ── l'ivrogne, ancien rang S (ev 13) — <NPC: maitre_arme> gardé ────────── */
F(13, {
    nom: 'Le vieux', role: 'l\'ivrogne du comptoir — JOKO : « ancien rang S », âme en deuil', voix: 'grave, lent, cynique ; ne parle jamais du passé en face.',
    avant: [[356, 0, ['NPC talk maitre_arme']]],
    premiere: '~Il ne lève pas les yeux de son verre.|T\'es sur ma lumière.',
    retour: ['Encore toi.'],
    bonjour: {
        1: ['~Il est déjà là. Il est toujours déjà là.|Quoi.'], 2: ['Hm.', 'Assieds-toi ou pars. Mais reste pas debout.'],
        3: ['Tu bois ? Non ? Alors pourquoi t\'es là.'], 4: ['~Il fixe la porte comme s\'il attendait quelqu\'un qui ne viendra plus.']
    },
    saisons: {
        1: ['Le printemps. Les jeunes partent chasser du monstre. La moitié revient.'],
        2: ['Trop chaud pour se battre. Les gens se battent quand même.'],
        3: ['L\'automne… C\'est en automne que— rien. Laisse.'],
        4: ['L\'hiver, les vieilles blessures parlent. Les miennes crient.']
    },
    blesse: ['T\'as pris un coup à gauche. Tu protèges ton flanc comme un débutant. Corrige ça ou crève.'],
    discuter: [
        'Les rangs, c\'est des lettres. Les monstres savent pas lire.',
        'Un bon combattant, c\'est pas celui qui frappe fort. C\'est celui qui rentre.',
        'Tu tiens ton arme trop haut. Non, je te montrerai pas.',
        'Margot me sert sans que je demande. C\'est la seule qui me connaît encore.'
    ],
    nouvelles: ['Des loups de rang B+ au nord ? Un B+, ça se tue. C\'est la meute qui te tue.', 'Garrec raconte ses combats. Il en a vécu un tiers. Le reste, c\'est les miens.'],
    perso: {
        titre: 'Qui étiez-vous ?', paliers: [
            [1, 'Personne.'],
            [3, 'J\'avais une équipe. On était bons. Les meilleurs, qu\'ils disaient.'],
            [6, 'Quatre. On était quatre. Je suis le seul qui boit encore.'],
            [10, '~Il pose le verre, enfin.|On te donne une lettre, S, et tu crois que ça te protège. Ça protège rien. Ça te met juste en première ligne.|Va. Et rentre, surtout. Rentre.']
        ]
    },
    options: [{ titre: 'Lui payer un verre (10 G)', cmds: paye(10, cat(A.se('Coin'), P('Le vieux', '~Il hoche la tête, une fois.|… Merci.'), H.affinite(1)), P('Le vieux', 'Garde ton or. T\'en as pas.')) }],
    aurevoir: ['Rentre vivant.', '~Il ne répond pas.']
});

/* ── Mireille, la commère (ev 14 « PNJ rumeur ») ───────────────────────── */
F(14, {
    nom: 'Mireille', role: 'la commère, sait tout sur tout le monde (et se trompe une fois sur deux)', voix: 'volubile, chuchote fort, « tu sais pas la meilleure ».', horaire: '10-23',
    murmure: '…et tu sais pas la meilleure…',
    premiere: 'Toi, t\'es pas d\'ici. Je connais tout le monde, ici. Tout le monde. Assieds-toi, je vais te raconter qui est qui.',
    retour: ['Te revoilà ! Il s\'en est passé, des choses. Assieds-toi.'],
    bonjour: {
        1: ['Déjà là ? Moi aussi. On rate rien, nous deux.'], 2: ['Ah, toi ! Justement, j\'ai une histoire.', 'Tu sais pas la meilleure ?'],
        3: ['Le soir, c\'est là qu\'on apprend tout. Les langues se délient.'], 4: ['Je devrais rentrer… mais Hector et Maude se disputent, je veux voir la fin.']
    },
    saisons: {
        1: ['Printemps : trois mariages prévus. Je parie sur deux.'],
        2: ['L\'été, les gens sortent tard et font des bêtises. C\'est ma saison préférée.'],
        3: ['L\'automne, les couples se séparent. Personne sait pourquoi. Moi si.'],
        4: ['L\'hiver, tout le monde est enfermé chez soi. Alors ils viennent ici. Et ils parlent.']
    },
    discuter: [
        'Le boulanger met de la sciure dans son pain. Je l\'ai pas vu. Mais j\'en suis sûre.',
        'Ma voisine a un nouveau chapeau. Avec quel argent, je te le demande.',
        'Je dis jamais de mal des gens. Je dis la vérité. Si la vérité est méchante, c\'est pas ma faute.',
        'Tu vois Anselme ? Il doit de l\'argent à la moitié du bar. L\'autre moitié, c\'est parce qu\'ils le connaissent pas encore.',
        'Hector et Maude, trente ans de mariage. Trente ans de disputes. Le secret d\'un couple solide.'
    ],
    nouvelles: [
        'Pia, la fille du meunier, est amoureuse du barde. Elle rougit dès qu\'il accorde son luth.',
        'Garrec a pas de rang C. Il a un rang C-. Je le sais de source sûre.',
        'Il paraît que des nobles sont au manoir du lord. Ça cache quelque chose. Ça cache TOUJOURS quelque chose.',
        'Le vieux au comptoir… on dit qu\'il était très haut placé, autrefois. Très haut.',
        'Le lord a fait doubler la taxe sur le sel. Il paraît que c\'est pour recevoir ses nobles. Nous, on mangera fade.'
    ],
    nouvellesSaison: {
        1: ['Le fils du tanneur a demandé la main de la fille du charpentier. Le charpentier a dit non. Le fils insiste. À suivre.'],
        2: ['Quelqu\'un vole les poules du quartier est. On soupçonne un renard. Moi je soupçonne Théo.'],
        3: ['Les frères Vannier ont coupé le même arbre, chacun d\'un côté. Il est tombé sur la grange de l\'un des deux. Devine lequel.'],
        4: ['Le puits de la place a gelé. Trois personnes ont glissé. Dont le maire. J\'étais là. Magnifique.']
    },
    perso: {
        titre: 'Et vous, Mireille ?', paliers: [
            [1, 'Moi ? Oh, rien d\'intéressant. Parlons plutôt des autres.'],
            [4, 'Mon mari est mort il y a dix ans. La maison est très silencieuse. Ici, au moins, ça parle.'],
            [7, '~Elle baisse la voix, pour de vrai.|Tu sais pourquoi je raconte tout ? Parce que si j\'arrête, on m\'oubliera. C\'est bête, hein.']
        ]
    },
    options: [{
        titre: 'Un vrai secret (5 G)', cmds: paye(5, cat(A.se('Coin'), H.unParmi('Mireille', [
            'Silas vend du jus de pomme coloré. J\'ai goûté. C\'est même pas de la bonne pomme.',
            'Nell a été voleuse. Elle a arrêté. Enfin, elle vole plus que les méchants, maintenant.',
            'Margot a un faible pour le vieux du comptoir. Pas d\'amour. De la pitié. Enfin, un peu d\'amour.'
        ]), H.affinite(1)), P('Mireille', 'Les secrets, ça se paie, mon petit. Pas cher. Mais ça se paie.'))
    }],
    aurevoir: ['Reviens me raconter !', 'Et ce que je t\'ai dit, tu le répètes pas. Enfin, pas tout de suite.']
});

/* ── Baptiste, le charretier (ev 15) ───────────────────────────────────── */
F(15, {
    nom: 'Baptiste', role: 'charretier, fait la route entre les villages', voix: 'jovial, parle de ses bœufs comme de ses enfants.', horaire: '12-22',
    premiere: 'Salut l\'ami ! Baptiste, charretier. Si t\'as un colis, je le porte. Si t\'as une histoire, je l\'écoute.',
    retour: ['Tiens, le voyageur ! T\'as fait plus de route que moi, on dirait.'],
    bonjour: { 2: ['Je viens de décharger. J\'ai soif comme un bœuf. Et les bœufs, ça boit.'], 3: ['Journée finie. Les bœufs sont à l\'écurie, moi je suis au bar. Chacun sa paille.'], 4: ['Je devrais dormir, je repars à l\'aube. Encore une.'] },
    bonjourTous: ['Salut l\'ami.'],
    saisons: {
        1: ['Les chemins sont de la soupe. J\'ai laissé une roue dans une ornière hier. Elle y est encore.'],
        2: ['La route est sèche, ça roule. Mais la poussière… j\'en ai jusque dans les dents.'],
        3: ['C\'est la saison des récoltes : je charrie du grain du matin au soir. Mes bœufs me détestent.'],
        4: ['L\'hiver, la route du Village Montagnard est fermée. Je fais le tour. Deux jours de plus.']
    },
    discuter: [
        'Mes bœufs s\'appellent Paisible et Têtu. Devine lequel avance.',
        'Sur la route, j\'ai croisé des loups, des bandits et un percepteur. Le percepteur m\'a coûté le plus cher.',
        'Tout ce qui se boit, se mange ou se porte dans cette ville est passé sur ma charrette. Tout.',
        'Un jour, j\'ai transporté un cercueil. Il était lourd. Trop lourd. J\'ai pas posé de questions.'
    ],
    nouvelles: ['Le prix du grain a encore monté. On dit que c\'est les nobles qui achètent tout.', 'Au Village de Pêche, ils ont sorti un poisson grand comme un homme. Ils l\'ont vendu, et regretté : il était pas bon.'],
    perso: { titre: 'Toujours sur la route ?', paliers: [[1, 'Faut bien. La route, c\'est mon pain.'], [4, 'J\'ai une femme et deux gamins au Village Montagnard. Je les vois une semaine par mois. Ils grandissent sans moi.'], [7, 'L\'an prochain, j\'arrête. Je dis ça chaque année. Mais cette fois, j\'ai mis de l\'argent de côté. Un peu.']] },
    options: [{ titre: 'Des nouvelles de la route', cmds: H.selon(V.saison, { 1: ['Le gué au sud déborde. Passe par le pont, même si c\'est plus long.'], 2: ['Des marchands se sont fait détrousser près de la forêt. Voyage en groupe.'], 3: ['Les chasseurs posent des pièges partout. Regarde où tu mets les pieds.'], 4: ['Neige sur le col. Sans bonnes bottes, n\'y va pas.'] }, 'Baptiste') }],
    aurevoir: ['Bonne route, l\'ami !', 'Si tu vois Têtu, dis-lui d\'avancer.']
});

/* ── Odon, le vieux joueur de cartes (ev 17) ───────────────────────────── */
F(17, {
    nom: 'Odon', role: 'vieux retraité, joue aux cartes seul', voix: 'râleur, « de mon temps », mauvais perdant.', horaire: '9-24',
    premiere: 'Tu joues ? Non ? Alors pousse-toi, tu me caches les cartes.',
    bonjour: { 1: ['Le matin, les cartes sont honnêtes. Après, elles trichent.'], 2: ['Hm. Encore perdu contre moi-même.'], 3: ['Trop de bruit, le soir. De mon temps, on buvait en silence.'], 4: ['Je rentre bientôt. Ma femme m\'attend. Enfin, elle dort.'] },
    saisons: { 1: ['Le printemps, ça me fait éternuer.'], 2: ['Trop chaud. De mon temps, les étés étaient moins chauds.'], 3: ['Mes genoux sentent la pluie avant le ciel.'], 4: ['De mon temps, l\'hiver durait six mois. Les jeunes savent pas ce que c\'est, le froid.'] },
    discuter: [
        'De mon temps, une bière coûtait une pièce. Et elle était meilleure.',
        'Je joue seul parce que les autres trichent. Moi aussi, mais au moins je le sais.',
        'J\'ai soixante-dix ans. J\'ai enterré tous mes amis. Ça laisse du temps pour les cartes.',
        'Les jeunes, aujourd\'hui, ils veulent tous des rangs. De mon temps, on voulait juste manger.'
    ],
    nouvelles: ['Paraît que le lord fait des fêtes. De mon temps, les lords faisaient la guerre. C\'était plus honnête.'],
    perso: { titre: 'Une partie, alors ?', paliers: [[1, 'Toi ? Tu sais même pas tenir un jeu.'], [3, 'Bon. Assieds-toi. Mais je distribue.'], [6, 'T\'es pas si mauvais. Pour un jeune.']] },
    options: [{ titre: 'Jouer aux cartes (10 G)', cmds: paye(10, cat(A.se('Book1'), A.attendre(30), si(C.js('Math.random() < 0.45'), cat(A.or(20), A.se('Coin'), P('Odon', 'Quoi ?! Tu as triché. Je le sais. Je peux pas le prouver, mais je le sais.')), P('Odon', 'Ha ! Et voilà. L\'expérience, gamin.'))), P('Odon', 'Pas d\'argent, pas de cartes.')) }],
    aurevoir: ['C\'est ça, va.', 'Hm.']
});

/* ── Lise, l'apprentie qui rêve de partir (ev 18) ──────────────────────── */
F(18, {
    nom: 'Lise', role: 'fille du forgeron, rêve d\'aventure', voix: 'enthousiaste, pose trop de questions, parle vite.', horaire: '18-23',
    murmure: 'Un jour, je partirai…',
    premiere: 'T\'es un aventurier ?! Un vrai ? T\'as déjà tué un monstre ? C\'était comment ? Raconte !',
    retour: ['Tu es revenu ! Alors ? Alors ?! Tu as vu quoi ?'],
    bonjour: { 3: ['Papa croit que je suis chez ma tante. Chut.', 'J\'ai fini à la forge. J\'ai les mains noires, regarde !'], 4: ['Je devrais être couchée. Mais ici, au moins, il se passe des choses.'] },
    bonjourTous: ['Salut !'],
    saisons: { 1: ['Le printemps, c\'est la saison des départs. Tout le monde part. Sauf moi.'], 2: ['L\'été à la forge, c\'est l\'enfer. Littéralement.'], 3: ['Les chasseurs sont revenus. L\'un d\'eux avait une cicatrice ÉNORME. J\'en veux une.'], 4: ['L\'hiver, la forge est l\'endroit le plus chaud de la ville. Au moins ça.'] },
    blesse: ['Oh ! Tu saignes ! C\'est… c\'est vrai, alors, l\'aventure. Ça fait mal ?'],
    discuter: ['Papa dit qu\'une forgeronne, c\'est déjà bien assez d\'aventure. Il a jamais rien vu, papa.', 'J\'ai forgé ma première lame. Elle est tordue. Mais elle coupe.', 'Garrec m\'a promis de m\'apprendre à me battre. Il a oublié. Il oublie tout, Garrec.', 'Quand je partirai, je prendrai un nom. Un vrai nom d\'aventurière. « Lise l\'Enclume ». Non ?'],
    nouvelles: ['Le vieux au comptoir, il paraît qu\'il était rang S ! S ! Il veut pas me parler. Il dit que je suis trop bête pour mourir intelligemment.'],
    perso: { titre: 'Pourquoi partir ?', paliers: [[1, 'Pour voir ! Pour faire quelque chose ! Pour qu\'on se souvienne de moi !'], [3, 'Maman est partie, elle aussi, quand j\'étais petite. Elle n\'est pas revenue. Je veux savoir ce qu\'il y a de si beau, dehors.'], [6, '~Elle regarde ses mains noires de suie.|Tu crois que je suis bête ? … Tu peux le dire. Papa le dit.']] },
    options: [{ titre: 'Lui raconter un combat', cmds: cat(P('', '~Tu lui racontes ton dernier combat. Elle ne respire plus.'), P('Lise', 'Et après ? Et après ?! … Wow.'), H.affinite(1)) }],
    aurevoir: ['Reviens me raconter !', 'Emmène-moi, un jour ! … Non ? Un jour.']
});

/* ── Garrec, mercenaire vantard (ev 19) ────────────────────────────────── */
F(19, {
    nom: 'Garrec', role: 'mercenaire de rang C (il dit B)', voix: 'fort, fanfaron, gentil au fond, ment sur ses exploits.', horaire: '16-3',
    premiere: 'Garrec. Rang B. … Bon, C. Presque B. Tu veux une histoire ? J\'en ai des centaines.',
    retour: ['Ah, mon rival ! Tu as tué combien de monstres depuis ? Moi, trente. Ou trois.'],
    bonjour: { 2: ['Je m\'échauffe. Pour ce soir. Bras de fer.'], 3: ['Ce soir, je paie une tournée ! … Enfin, si quelqu\'un me prête.'], 4: ['Encore une ! Encore une… Où est ma chope ?'] },
    bonjourTous: ['Salut, collègue.'],
    saisons: { 1: ['Le printemps, les contrats reviennent. Faut que je me bouge.'], 2: ['L\'été, les monstres sont gros et paresseux. Comme moi.'], 3: ['Automne : saison des loups. J\'en ai tué un de rang B. Enfin, j\'ai vu quelqu\'un le tuer.'], 4: ['L\'hiver, pas de contrat. Alors je raconte.'] },
    blesse: ['Joli coup que t\'as pris. J\'en ai eu un pire. Ici. Non, là. Enfin, quelque part.'],
    discuter: ['Une fois, j\'ai combattu un ours à mains nues. L\'ours dormait. Mais quand même.', 'Les rangs, c\'est de la politique. Je mérite le A. Ils le savent. Ils sont jaloux.', 'Lise veut que je lui apprenne à se battre. J\'ai promis. Faut juste que je me rappelle comment on fait.', 'Mon épée s\'appelle Vérité. Parce qu\'elle fait mal.'],
    nouvelles: ['Des loups de rang B+ au nord, voire A. Je pourrais m\'en charger. Mais je vais laisser leur chance aux jeunes.', 'Le tableau du bar a de nouveaux contrats. Des petits. Pas pour moi.'],
    perso: { titre: 'Le rang C, alors ?', paliers: [[1, 'B. Presque B. Moralement B.'], [4, 'J\'ai raté l\'examen trois fois. Trois. La troisième, je m\'étais cassé le bras. Enfin… je l\'ai dit.'], [7, '~Il repose sa chope.|La vérité ? J\'ai peur. Chaque contrat, j\'ai peur. Alors je raconte des histoires. Tant que je raconte, j\'ai pas peur.']] },
    options: [{ titre: 'Bras de fer (20 G)', cmds: paye(20, cat(A.se('Blow1'), A.trembler(2, 5, 20, true), si(C.js('$gameParty.leader().atk + Math.randomInt(20) >= 45'), cat(A.or(40), A.se('Applause1'), P('Garrec', 'Aïe ! AÏE ! Bon. Bon ! J\'avais une crampe. Revanche demain.'), H.affinite(1)), P('Garrec', 'HA ! Force de rang B ! … Presque B.'))), P('Garrec', 'Vingt pièces ou rien. Je me bats pas gratuitement, moi.')) }],
    aurevoir: ['Reste en vie, collègue !', 'Et dis-le si on te demande : Garrec, rang B.']
});

/* ── Anselme, le joueur endetté (ev 20) ────────────────────────────────── */
F(20, {
    nom: 'Anselme', role: 'joueur de dés, doit de l\'argent à tout le monde', voix: 'charmeur, nerveux, toujours « sûr de gagner cette fois ».', horaire: '19-4',
    premiere: 'Toi, t\'as une tête de chanceux. Tu veux doubler ta mise ? Je suis sûr de gagner, cette fois.',
    retour: ['Ah ! Mon porte-bonheur est de retour !'],
    bonjour: { 3: ['Chut. Si Margot demande, je suis pas là. Je lui dois trois soirées.'], 4: ['La nuit, les dés sont plus généreux. C\'est connu.', 'Encore une partie, et je rembourse tout le monde.'] },
    bonjourTous: ['Salut, l\'ami.'],
    saisons: { 1: ['Nouvelle saison, nouvelle chance !'], 2: ['L\'été, les gens ont de l\'argent. Enfin, ils en avaient.'], 3: ['L\'automne, les récoltes sont payées. Les paysans jouent. J\'adore l\'automne.'], 4: ['L\'hiver… j\'ai vendu mon manteau. Pour une mise. J\'ai perdu. J\'ai froid.'] },
    discuter: ['J\'ai un système. Infaillible. Il marche une fois sur trois.', 'Je dois de l\'argent à Garrec, à Margot, au boulanger et à un type dont je connais pas le nom. Lui, il me fait peur.', 'Un jour, j\'ai gagné cent pièces. Je les ai rejouées tout de suite. Pour gagner deux cents.', 'Ma mère voulait que je sois notaire. J\'aurais fait un très mauvais notaire. Je fais un très mauvais joueur. Au moins, je m\'amuse.'],
    nouvelles: ['Le type en noir au fond cherche Anselme. Si on te demande, Anselme est mort.'],
    perso: { titre: 'Et ta dette ?', paliers: [[1, 'Quelle dette ?'], [3, 'Cent vingt pièces. Enfin, cent quarante avec les intérêts. Enfin… je compte plus.'], [6, '~Il fait rouler un dé entre ses doigts.|Je sais que j\'arrêterai pas. Je le sais. C\'est ça le pire.']] },
    options: [{ titre: 'Jouer aux dés (20 G)', cmds: paye(20, cat(A.se('Book2'), A.vrHasard(V.tirage, 2, 12), P('', '~Les dés roulent : \\V[882].'), si(C.vr(V.tirage, '>=', 8), cat(A.or(40), P('Anselme', 'Non… non ! Encore ! Double ou rien !')), P('Anselme', 'Ha ! Tu vois ? Le système !'))), P('Anselme', 'Pas d\'argent ? Moi non plus. On est pareils.')) }],
    aurevoir: ['Si tu vois le type en noir, j\'suis pas là.', 'Reviens avec de l\'or !']
});

/* ── Pia, la fille du meunier, amoureuse du barde (ev 21) ──────────────── */
F(21, {
    nom: 'Pia', role: 'fille du meunier, amoureuse en secret de Colin le barde', voix: 'timide, phrases qui s\'arrêtent au milieu.', horaire: '17-22', saisons: undefined,
    premiere: 'Oh ! Pardon, je… je regardais pas, je veux dire, je regardais… la musique.',
    bonjour: { 3: ['~Elle ne quitte pas le barde des yeux.|Hm ? Oh, bonsoir.', 'Il va jouer, tu crois ? Enfin… je m\'en fiche. Je demande.'], 4: ['Je devrais rentrer. Papa va… Encore une chanson.'] },
    bonjourTous: ['Oh. Bonjour.'],
    discuter: ['Le moulin tourne du matin au soir. Moi aussi.', 'J\'aime bien les chansons tristes. Elles disent ce qu\'on n\'ose pas.', 'Papa veut me marier au fils du boulanger. Il sent la farine. Moi aussi, remarque.'],
    nouvelles: ['Mireille raconte que je… que je regarde quelqu\'un. C\'est faux ! … C\'est vrai.'],
    perso: { titre: 'Colin ?', paliers: [[1, 'Qui ? Le barde ? Je… je le connais à peine. Enfin. Il s\'appelle Colin. Il a vingt-trois ans. Il aime les pommes. Je… sais rien.'], [3, 'Il cherche un chant, au bord du lac. Il y va la nuit. J\'ai peur pour lui, parfois.'], [5, 'J\'ai écrit un mot. Je le lui donnerai jamais. Tu… tu pourrais ? Non. Si. Non…']] },
    options: [{
        titre: 'Porter son mot à Colin', si: C.vr(V.visites, '>=', 5), cmds: si(C.sw(SW_PIA_MOT, false), cat(P('Pia', 'Tu… tu ferais ça ? Tiens. Ne le lis pas. Ne le lis PAS.'), A.sw(SW_PIA_MOT, true), A.se('Book2'), H.affinite(2)),
            si(C.sw(SW_COLIN_LU), cat(P('Pia', 'Il a dit QUOI ? Une chanson… pour moi ?|~Elle cache son visage dans ses mains.'), H.affinite(1)), P('Pia', 'Tu lui as donné ? … Pas encore ? Oh, je vais mourir.')))
    }],
    aurevoir: ['Bonne soirée…', 'Tu diras rien, hein ?']
});
fiches[fiches.length - 1].saisons = { 1: ['Les cerisiers sont en fleurs, au bord du lac. Il y va, parfois. Enfin, je crois.'], 2: ['L\'été, il joue dehors. Tout le monde danse. Moi je regarde.'], 3: ['L\'automne, le moulin tourne jour et nuit. Je viens moins. Ça me manque. Enfin… la musique.'], 4: ['Il a les doigts rouges de froid quand il joue. Je lui tricoterais bien des mitaines. Enfin… quelqu\'un devrait.'] };

/* ── les frères Vannier, bûcherons jumeaux (ev 22 et 23) ────────────────── */
F(22, {
    nom: 'Aimé Vannier', role: 'bûcheron, jumeau « aîné »', voix: 'bourru, contredit son frère sur tout.', horaire: '18-23',
    premiere: 'Aimé Vannier. L\'aîné. L\'autre, c\'est Basile. Le cadet. De quatre minutes.',
    bonjourTous: ['Salut.', '~Il pose sa hache contre la table.|Longue journée.'],
    saisons: { 1: ['Le bois de printemps est plein de sève. Il brûle mal.'], 2: ['Trop chaud pour couper. On coupe quand même.'], 3: ['L\'automne, tout le monde veut du bois. On travaille double.'], 4: ['Le gel fend les troncs. Au moins, ça nous aide.'] },
    discuter: ['Basile dit que c\'est lui l\'aîné. Basile ment.', 'Un bon bûcheron écoute l\'arbre avant de le couper. Basile, il écoute rien.', 'On a coupé le même chêne, lui d\'un côté, moi de l\'autre. Il est tombé sur sa grange à lui. Justice.'],
    nouvelles: ['On a vu des traces bizarres, en forêt. Pas des loups. Basile dit des loups.'],
    perso: { titre: 'Et Basile ?', paliers: [[1, 'Quoi, Basile ?'], [3, 'On s\'engueule depuis qu\'on est nés. Maman disait qu\'on s\'était battus dans son ventre.'], [6, 'S\'il lui arrivait quelque chose… Bah. Il lui arrivera rien. Je suis là.']] },
    options: [{ titre: 'Qui est l\'aîné ?', cmds: P('Aimé Vannier', 'Moi. Évidemment. Demande à Basile, il te dira le contraire, et il mentira.') }],
    aurevoir: ['Salut.', 'Et crois pas Basile.']
});
F(23, {
    nom: 'Basile Vannier', role: 'bûcheron, jumeau « aîné » (lui aussi)', voix: 'bourru, contredit son frère sur tout.', horaire: '18-23',
    premiere: 'Basile Vannier. L\'aîné. L\'autre, c\'est Aimé. Le cadet. De quatre minutes.',
    bonjourTous: ['Salut.', '~Il se masse l\'épaule.|Aimé a encore traîné. J\'ai tout fait.'],
    saisons: { 1: ['Printemps. La forêt se réveille. Aimé aussi, enfin, vers midi.'], 2: ['L\'été, les moustiques. Ils aiment Aimé. C\'est bien les seuls.'], 3: ['Automne. On coupe, on fend, on livre. Aimé compte.'], 4: ['L\'hiver, on vend le bois trois fois plus cher. C\'est la saison que j\'aime.'] },
    discuter: ['Aimé dit que c\'est lui l\'aîné. Aimé ment.', 'Couper un arbre, c\'est simple : tu frappes jusqu\'à ce qu\'il tombe. Aimé fait des histoires.', 'Le chêne ? Il est tombé sur MA grange parce qu\'Aimé a coupé du mauvais côté.'],
    nouvelles: ['Des traces de loups en forêt. Aimé dit que c\'est autre chose. Aimé voit des fantômes partout.'],
    perso: { titre: 'Et Aimé ?', paliers: [[1, 'Quoi, Aimé ?'], [3, 'Il ronfle. Depuis trente ans, il ronfle. Je dors dans la grange. La grange écrasée.'], [6, 'Quand il s\'est coupé le pied l\'an dernier, je l\'ai porté jusqu\'ici. Deux heures. Lui dis pas.']] },
    options: [{ titre: 'Qui est l\'aîné ?', cmds: P('Basile Vannier', 'Moi. Évidemment. Demande à Aimé, il te dira le contraire, et il mentira.') }],
    aurevoir: ['Salut.', 'Et crois pas Aimé.']
});

/* ── Hector et Maude, trente ans de mariage (ev 24 et 25) ──────────────── */
F(24, {
    nom: 'Hector', role: 'vieux mari, bon vivant', voix: 'blagueur, taquine sa femme, l\'adore.', horaire: '11-21',
    premiere: 'Bonjour, jeune homme ! Ou jeune dame, j\'ai plus mes yeux. Hector. Et la dame qui soupire, c\'est Maude. Trente ans.',
    bonjourTous: ['Ah, bonjour !', '~Il lève son verre vers toi.|À la tienne !'],
    saisons: { 1: ['Le printemps ! Maude veut repeindre la maison. Chaque printemps. Elle est bleue depuis trente ans.'], 2: ['L\'été, on va pêcher. Enfin, moi je pêche, Maude critique.'], 3: ['L\'automne, c\'est notre anniversaire. Trente et un ans. Elle m\'a pas encore tué.'], 4: ['L\'hiver, Maude me tricote des chaussettes. Elles sont trop petites. Chaque année.'] },
    discuter: ['Le secret d\'un mariage heureux ? Dire « oui, ma chérie », et faire ce qu\'on veut quand même.', 'J\'étais tonnelier. Maintenant je bois ce qu\'il y a dans les tonneaux. La boucle est bouclée.', 'Maude dit que je ronfle. C\'est faux. Je respire avec enthousiasme.'],
    nouvelles: ['Les jeunes d\'aujourd\'hui se marient pour un rien. Et se séparent pour moins encore.'],
    perso: { titre: 'Trente ans ?', paliers: [[1, 'Trente ans. Et elle râle toujours autant. C\'est rassurant.'], [4, 'Je l\'ai rencontrée ici même. Elle m\'a renversé une bière dessus. Exprès. J\'ai compris que c\'était la bonne.'], [7, '~Il regarde Maude, un peu trop longtemps.|Si elle part avant moi… non. Elle partira pas avant moi. Elle aurait trop peur que je mange mal.']] },
    aurevoir: ['Bonne journée !', 'Et marie-toi, ça rend fou mais c\'est bien.']
});
F(25, {
    nom: 'Maude', role: 'vieille épouse, lucide', voix: 'soupirs, piques sèches, tendresse cachée.', horaire: '11-21',
    premiere: 'Ne l\'écoutez pas, il raconte n\'importe quoi. Maude. Enchantée. Enfin, fatiguée.',
    bonjourTous: ['Bonjour.', '~Elle soupire en regardant Hector.|Il vous a déjà raconté la bière ? Il la raconte à tout le monde.'],
    saisons: { 1: ['Je veux repeindre la maison en jaune. Il dit qu\'on verra. Ça fait trente ans qu\'on verra.'], 2: ['Il m\'emmène pêcher. Il ne prend rien. Mais il est content. Alors moi aussi, un peu.'], 3: ['Notre anniversaire approche. Il va oublier. Il oublie toujours. Et il se rattrape toujours.'], 4: ['Je lui tricote des chaussettes. Trop petites, exprès. Sinon il ne sort plus de chez nous.'] },
    discuter: ['Trente ans. On s\'est disputés tous les jours. Et on s\'est réconciliés tous les soirs.', 'Il ronfle. Comme un ours. Je dors avec de la laine dans les oreilles depuis trente ans.', 'La bière ? Oui, je la lui ai renversée exprès. Il était beau. Et il ne me regardait pas.'],
    nouvelles: ['Mireille raconte partout que le boulanger met de la sciure. Le boulanger est son frère. Ils sont brouillés depuis vingt ans.'],
    perso: { titre: 'Et vous, Maude ?', paliers: [[1, 'Moi ? Je veille sur lui. Quelqu\'un doit le faire.'], [4, 'On n\'a pas eu d\'enfant. On aurait voulu. Alors on s\'est eus l\'un l\'autre. Ce n\'est pas si mal.'], [7, 'S\'il part avant moi… je repeindrai la maison en jaune. Et je pleurerai tous les jours dans une maison jaune.']] },
    aurevoir: ['Au revoir. Et ne lui payez pas à boire.', 'Bonne journée.']
});

/* ── Roul, pêcheur rival de Tobin (ev 26) ──────────────────────────────── */
F(26, {
    nom: 'Roul', role: 'pêcheur, rival de Tobin', voix: 'grincheux, jaloux, exagère ses prises.', horaire: '14-22',
    premiere: 'Roul. Pêcheur. Le meilleur. Si on te parle de Tobin, c\'est le deuxième meilleur. Et encore.',
    bonjourTous: ['Salut.', 'Ça sent le poisson ? C\'est moi. C\'est l\'odeur du succès.'],
    saisons: { 1: ['Le printemps, les truites remontent. Je les attends. Tobin dort encore.'], 2: ['L\'été, le lac est chaud, les poissons descendent. Faut aller les chercher.'], 3: ['Automne. Les brochets. Gros comme ma jambe. Enfin, comme mon bras.'], 4: ['L\'hiver, on perce la glace. Tobin y va pas. Il a peur de passer au travers.'] },
    discuter: ['Hier, j\'ai pris un poisson de cette taille. Non, plus grand. Il s\'est échappé. Mais il était là.', 'Tobin a perdu son couteau. Il a pleuré. Pour un couteau !', 'Le lac, la nuit… Il y a des choses qu\'on n\'entend pas deux fois. Je pêche plus la nuit.'],
    nouvelles: ['Au Village de Pêche, ils disent que le lac est plus profond qu\'avant. Un lac, ça se creuse pas tout seul.'],
    perso: { titre: 'Tobin et vous ?', paliers: [[1, 'On se parle pas.'], [3, 'On était amis, gamins. Son père nous emmenait sur la barque. Puis son père est mort au lac. Tobin a gardé le couteau. Moi j\'ai gardé… rien.'], [6, 'Je le déteste pas. C\'est juste que… quand je le vois, je revois la barque. Et ça fait mal.']] },
    options: [{ titre: 'Parier sur la prochaine prise', cmds: P('Roul', 'Sur moi ou sur Tobin ? … Sur moi. Évidemment. Garde ton or, je parie pas contre moi-même.') }],
    aurevoir: ['Et dis à Tobin que je le salue pas.', 'Hm.']
});

/* ── Ysolde, l'herboriste (ev 28) ──────────────────────────────────────── */
F(28, {
    nom: 'Ysolde', role: 'herboriste, boit une tisane au bar', voix: 'calme, douce, parle des plantes comme des gens.', horaire: '8-18',
    premiere: 'Tu as les yeux cernés. Tu dors mal ? J\'ai une plante pour ça. J\'ai une plante pour presque tout.',
    bonjourTous: ['Bonjour. Assieds-toi, tu respires trop vite.', '~Elle souffle sur sa tisane.|Bonjour.'],
    saisons: { 1: ['La camomille sort. Et les orties. Les orties, c\'est comme les gens : ça pique, mais ça soigne.'], 2: ['L\'été, je cueille à l\'aube, avant que le soleil brûle les feuilles.'], 3: ['Les champignons. Deux sur trois te nourrissent. Le troisième t\'enterre.'], 4: ['L\'hiver, je vis sur mes réserves. Et je soigne les rhumes. Beaucoup de rhumes.'] },
    blesse: ['Montre-moi cette blessure. … Nettoie-la. Ce soir. Sinon, dans trois jours, tu me reviendras en pire.'],
    discuter: ['La plante qui soigne et celle qui tue poussent souvent côte à côte. Il faut apprendre à regarder.', 'Je ne bois pas d\'alcool. Mais j\'aime le bruit du bar. On y entend les gens vivre.', 'Les médecins de la ville se moquent de moi. Puis ils viennent m\'acheter des herbes, la nuit.'],
    nouvelles: ['Beaucoup de fièvres, ce mois-ci. Pas grave. Mais je surveille.'],
    perso: { titre: 'Vous avez appris où ?', paliers: [[1, 'Dans la forêt. En goûtant. Parfois de travers.'], [4, 'Ma grand-mère. Elle soignait tout le village. On l\'a traitée de sorcière. Puis on est venu la chercher quand les enfants tombaient malades.'], [7, 'Un jour, je n\'ai pas pu sauver un enfant. Il y a douze ans. J\'y pense à chaque tisane.']] },
    options: [{ titre: 'Une tisane (15 G)', cmds: paye(15, cat(A.se('Heal1'), A.js('$gameParty.members().forEach(function(a){ a.removeState(91); a.removeState(94); a.gainHp(Math.floor(a.mhp * 0.2)); });'), P('Ysolde', 'Bois lentement. Ça réchauffe le ventre et ça calme la tête.')), P('Ysolde', 'Reviens quand tu pourras. La plante attendra.')) }],
    aurevoir: ['Prends soin de toi.', 'Dors, surtout.']
});

/* ── Merle et Casimir, gardes de la ville (ev 29 et 30) ────────────────── */
F(29, {
    nom: 'Merle', role: 'garde de nuit, en fin de ronde', voix: 'fatigué, pragmatique, humour de caserne.', horaire: '20-2',
    premiere: 'Garde de nuit. Merle. Si tu fais pas de bêtises, on sera pas amenés à se connaître mieux.',
    bonjourTous: ['Repos. Enfin, presque.', '~Il enlève son casque et se gratte la tête.|Soirée tranquille. Pour l\'instant.'],
    saisons: { 1: ['Le printemps, les ivrognes sortent. Et les voleurs aussi. Même combat.'], 2: ['L\'été, les nuits sont courtes. Mes rondes aussi. J\'aime l\'été.'], 3: ['L\'automne, on double les patrouilles au nord. Les loups.'], 4: ['L\'hiver, garder une porte dans le vent, c\'est la pire punition qui soit.'] },
    discuter: ['Mon travail, c\'est de rester éveillé pendant que les autres dorment. Et de pas être payé pour ça.', 'Casimir fait les rondes de jour. Il dit que c\'est plus dur. Il a jamais vu la ville à trois heures du matin.', 'On a arrêté Anselme trois fois. Pour dettes. Il nous doit de l\'argent aussi, maintenant.'],
    nouvelles: ['Des loups de rang B+ au nord, peut-être un A. Le capitaine veut pas de civils là-bas. Toi non plus.', 'Des carrosses de nobles vont au manoir du lord. On nous dit de pas regarder. Alors on regarde.'],
    perso: { titre: 'Pourquoi garde ?', paliers: [[1, 'Il fallait un salaire.'], [4, 'Mon père était garde. Il est mort à la porte nord. Je garde la porte sud. Je ne suis pas idiot.'], [7, 'Un jour, je partirai à la mer. J\'ai jamais vu la mer. Je garderai plus rien du tout.']] },
    aurevoir: ['Circule.', 'Et reste dans les rues éclairées.']
});
F(30, {
    nom: 'Casimir', role: 'garde de jour, fier de son uniforme', voix: 'réglementaire, un peu naïf, cite le règlement.', horaire: '12-20',
    premiere: 'Garde Casimir, de la garde de jour. Article trois : tout étranger est prié de se présenter. Voilà, c\'est fait.',
    bonjourTous: ['Citoyen.', 'Bonjour ! Enfin, bonne relève. Enfin… bonjour.'],
    saisons: { 1: ['Article douze : interdit de laisser ses cochons dans la rue. Personne respecte l\'article douze au printemps.'], 2: ['L\'été, l\'armure chauffe. Mais une armure, c\'est l\'honneur.'], 3: ['L\'automne, fête des récoltes. On arrête beaucoup de gens joyeux.'], 4: ['L\'hiver, j\'ai trouvé un homme endormi dans la neige. Il vit. Grâce au règlement : article quarante, la ronde des porches.'] },
    discuter: ['Le règlement a cent douze articles. Je les connais tous. Merle en connaît deux. « Repos » et « solde ».', 'Mon rêve, c\'est d\'être sergent. Il faut une recommandation. Et une bonne action. Je cherche.', 'On m\'a pris mon épée pendant que je dormais, une fois. En service. Je n\'en parle pas.'],
    nouvelles: ['Le capitaine renforce le nord. Les loups. Article quinze : les civils n\'ont rien à y faire.'],
    perso: { titre: 'Pourquoi garde ?', paliers: [[1, 'Pour servir ! Et la solde.'], [4, 'J\'étais le plus petit de ma famille. Le plus moqué. En armure, on se moque moins.'], [7, 'Merle se moque de mon règlement. Mais quand il y a un problème, c\'est à moi qu\'il demande quel article. On est une bonne équipe.']] },
    aurevoir: ['Article un : bonne journée, citoyen.', 'Circulez ! Gentiment.']
});

/* ── Jehan, l'écrivain public (ev 32) ──────────────────────────────────── */
F(32, {
    nom: 'Jehan', role: 'écrivain public, écrit les lettres des autres', voix: 'poli, cultivé, un brin mélancolique.', horaire: '9-17',
    premiere: 'Jehan, écrivain public. J\'écris ce que les gens n\'osent pas dire. Contre une modeste somme.',
    bonjourTous: ['Bonjour. Une lettre à écrire ?', '~Il essuie sa plume.|Bien le bonjour.'],
    saisons: { 1: ['Le printemps : des lettres d\'amour. Toutes pareilles. Je les écris toutes différentes.'], 2: ['L\'été, des lettres de voyage. « Je vais bien, envoyez de l\'argent. »'], 3: ['L\'automne, les lettres de condoléances. Ce sont les plus difficiles, et les plus sincères.'], 4: ['L\'hiver, les gens écrivent à ceux qui sont loin. L\'encre gèle. Les sentiments, non.'] },
    discuter: ['J\'ai écrit la déclaration d\'Hector à Maude, il y a trente ans. Elle ne l\'a jamais su. Ne dites rien.', 'Les gens me confient leurs secrets pour que je les écrive. Je les écris. Puis je les oublie. C\'est le métier.', 'On m\'a demandé une lettre de menace, une fois. J\'ai refusé. Puis j\'ai corrigé ses fautes.'],
    nouvelles: ['Une femme m\'a fait écrire à son fils parti chasser le loup au nord. Troisième lettre sans réponse.'],
    perso: { titre: 'Et vos lettres à vous ?', paliers: [[1, 'Je n\'écris pour personne.'], [4, 'J\'ai écrit cent lettres à quelqu\'un. Je n\'en ai envoyé aucune.'], [7, 'Elle s\'est mariée. Avec un homme qui ne sait pas écrire. Je lui ai rédigé ses vœux.']] },
    options: [{ titre: 'Faire écrire une lettre (10 G)', cmds: paye(10, cat(A.se('Book1'), P('Jehan', 'À qui ? … Non, ne me dites pas. Dites-moi ce que vous ressentez. Je trouverai les mots.'), P('', '~Sa plume court sur le papier. C\'est plus beau que ce que tu aurais écrit.'), H.affinite(1)), P('Jehan', 'Dix pièces. L\'encre coûte cher.')) }],
    aurevoir: ['Portez-vous bien.', 'Et écrivez à ceux que vous aimez. Même mal.']
});

/* ── Théo, le gamin qui n'a rien à faire là (ev 36) ────────────────────── */
F(36, {
    nom: 'Théo', role: 'gamin des rues, vend des « nouvelles »', voix: 'effronté, rapide, commerçant-né.', horaire: '8-19',
    premiere: 'Hé ! T\'as une pièce ? J\'ai des nouvelles. Des vraies. Presque vraies.',
    bonjourTous: ['Hé !', 'Chut, Margot me cherche.'],
    saisons: { 1: ['Le printemps, je vole des cerises. Pas volé. Emprunté. À l\'arbre.'], 2: ['L\'été, je dors dehors. C\'est comme une maison, mais sans toit.'], 3: ['Les pommes tombent. Le verger du vieux Odon. Il court pas vite.'], 4: ['L\'hiver, Berthe me laisse dormir près du four. Dis-le à personne.'] },
    discuter: ['J\'ai pas de parents. J\'ai une ville. C\'est plus grand.', 'Les poules du quartier est ? C\'est pas moi. C\'est… un renard. Un renard qui me ressemble.', 'Quand je serai grand, je serai garde. Ou voleur. Ça dépendra qui paie.'],
    nouvelles: ['Silas coupe ses potions à l\'eau du puits. Je l\'ai vu.', 'Le type en noir cherche Anselme. Il a un couteau.'],
    perso: { titre: 'Où tu dors ?', paliers: [[1, 'Partout. Nulle part. Ça te regarde ?'], [3, 'Dans le grenier de Berthe, l\'hiver. Dans le moulin, l\'été. Pia me donne du pain.'], [6, '~Il détourne les yeux.|Ma mère venait ici. Je l\'attends. Elle va revenir, un jour. Hein ?']] },
    options: [{ titre: 'Une nouvelle (1 G)', cmds: paye(1, cat(A.se('Coin'), H.unParmi('Théo', ['Le vieux au comptoir pleure quand il croit que personne regarde.', 'Garrec a peur du noir. Il dort avec une bougie.', 'Nell a rendu une bourse à un marchand. Rendu ! Je comprends pas.', 'Pia écrit des mots qu\'elle déchire.']), H.affinite(1)), P('Théo', 'Rien ? T\'es plus pauvre que moi.')) }],
    aurevoir: ['Salut !', 'Si Margot demande, t\'as rien vu.']
});

/* ── Berthe, la cuisinière (ev 37) ─────────────────────────────────────── */
F(37, {
    nom: 'Berthe', role: 'cuisinière du bar, nourrit tout le monde', voix: 'maternelle, autoritaire, « mange ».', horaire: '6-23',
    premiere: 'T\'as pas mangé, toi. Ça se voit. Assieds-toi. Mange.',
    bonjour: { 1: ['Le pain sort du four. Tiens, goûte. Non, c\'est pas une question.'], 2: ['Le ragoût mijote. Encore une heure.'], 3: ['C\'est le coup de feu ! Pousse-toi, pousse-toi !'], 4: ['Je nettoie. Il reste un fond de soupe, si tu veux.'] },
    saisons: { 1: ['Soupe d\'orties et d\'ail sauvage. Ysolde me les cueille. Elle cuisine pas, elle, mais elle sait où ça pousse.'], 2: ['Salade, fromage frais, tomates. L\'été, la cuisine se fait toute seule.'], 3: ['Ragoût de gibier et tarte aux pommes. L\'automne, c\'est ma saison.'], 4: ['Potée, lard, choux. L\'hiver, faut tenir au corps.'] },
    blesse: ['Mais dans quel état tu es ! Mange d\'abord, tu saigneras après.'],
    discuter: ['Je nourris ce bar depuis vingt ans. La moitié de ces ivrognes seraient morts sans ma soupe.', 'Théo dort près de mon four l\'hiver. Je fais semblant de pas le voir. Il fait semblant de pas voler de pain.', 'Le vieux au comptoir mange jamais. Je lui pose une assiette quand même. Elle revient vide, le matin.'],
    nouvelles: ['La viande a pris deux pièces. Les nobles du manoir achètent tout le gibier.'],
    perso: { titre: 'Votre recette secrète ?', paliers: [[1, 'Secrète. C\'est dans le mot.'], [4, 'Du thym. Beaucoup de thym. Et de la patience.'], [7, 'Ma mère cuisinait pour une caserne. Elle disait : « Un soldat qui a bien mangé rentre plus souvent. » Je nourris tout le monde comme s\'ils partaient demain.']] },
    options: [{ titre: 'Le plat du jour (20 G)', cmds: paye(20, cat(A.se('Item1'), A.objet(45, 1), H.selon(V.saison, { 1: ['Soupe d\'orties. Et un morceau de viande pour la route.'], 2: ['Du fromage frais et de la viande froide. Mange à l\'ombre.'], 3: ['Ragoût de gibier. Je t\'en ai mis un morceau à emporter.'], 4: ['Potée brûlante. Et du lard pour la route.'] }, 'Berthe'), H.affinite(1)), P('Berthe', 'Pas d\'argent ? … Tiens, un quignon. Et va-t\'en avant que je change d\'avis.')) }],
    aurevoir: ['Et mange, hein !', 'Reviens avant d\'avoir faim, pas après.']
});

/* ── Nell, ancienne voleuse (ev 38) ────────────────────────────────────── */
F(38, {
    nom: 'Nell', role: 'ancienne pickpocket, rangée (presque)', voix: 'moqueuse, maligne, prévient contre les arnaques.', horaire: '17-3',
    premiere: 'T\'as la bourse qui pend, là. Range-la. Je dis ça pour toi. J\'ai arrêté, moi.',
    bonjourTous: ['Salut, cible.', '~Elle fait tourner une pièce entre ses doigts.|Détends-toi. Je t\'ai rien pris. Aujourd\'hui.'],
    saisons: { 1: ['Le printemps, les foires. J\'y vais plus. Trop de tentations.'], 2: ['L\'été, les poches sont légères et les gens distraits. Paradis perdu.'], 3: ['L\'automne, les paysans vendent leurs récoltes. Ils rentrent riches. Pas longtemps, avec Anselme dans le coin.'], 4: ['L\'hiver, les manteaux épais. Poches profondes. Je dis ça comme ça.'] },
    discuter: ['Silas te vend de l\'eau colorée. Moi je volais, au moins c\'était honnête.', 'J\'ai rendu une bourse à un marchand, une fois. Il a appelé la garde. Plus jamais je rends quoi que ce soit.', 'Merle m\'a arrêtée trois fois. Maintenant on boit ensemble. La vie est bizarre.'],
    nouvelles: ['Le type en noir au fond, c\'est un recouvreur. Il cherche Anselme. Il va le trouver.', 'Les nobles du manoir ont des bijoux qui valent la ville entière. Je dis ça sans arrière-pensée.'],
    perso: { titre: 'Pourquoi avoir arrêté ?', paliers: [[1, 'Qui te dit que j\'ai arrêté ?'], [4, 'J\'ai volé une vieille, un jour. Elle m\'a rattrapée. Elle m\'a donné du pain. J\'ai plus pu.'], [7, 'Cette vieille, c\'était la grand-mère d\'Ysolde. Ysolde le sait pas. Je lui achète des tisanes que je bois pas.']] },
    options: [{ titre: 'Des conseils', cmds: H.unParmi('Nell', ['Au marché, tiens ta bourse devant toi. Pas derrière. Jamais derrière.', 'Quelqu\'un te bouscule et s\'excuse trop ? Vérifie tes poches.', 'Chez Silas, tout ce qui brille est faux. Tout ce qui brille pas aussi.']) }],
    aurevoir: ['Garde ta bourse.', 'À plus, cible.']
});

/* ── le voyageur de passage — un autre à chaque saison (ev 48) ──────────── */
F(48, {
    nom: 'Voyageur', role: 'de passage : jamais le même selon la saison', voix: 'change avec la saison — un marchand, une pèlerine, un conteur, une chasseuse.',
    premiere: 'Oh, bonjour. Je ne fais que passer. Comme tout le monde, au fond.',
    bonjourTous: ['Bonjour, bonjour.'],
    saisons: {
        1: ['Je vends des graines venues de loin. Plantez-les, et vous verrez des fleurs que personne ici ne connaît.', 'Printemps. Je remonte vers le nord avec les oies.'],
        2: ['Je suis pèlerine. Je marche jusqu\'à ce que mes pieds me disent d\'arrêter. Ils ne disent jamais rien.', 'L\'été, les routes sont pleines de gens comme moi.'],
        3: ['Je suis conteur. Une histoire contre un repas. Celle d\'aujourd\'hui parle d\'un loup qui voulait être chien.', 'L\'automne, les gens écoutent mieux. Ils sentent que l\'hiver arrive.'],
        4: ['Chasseuse de fourrures. L\'hiver, c\'est le moment. Les bêtes sont belles et les gens ont froid.', 'Je repars demain, s\'il ne neige pas. Il neigera.']
    },
    discuter: ['Chaque ville a son bar, et chaque bar a son vieux qui ne parle pas. Ici aussi, je vois.', 'On m\'a volé mon cheval au dernier village. Il est revenu tout seul. Les chevaux ont plus de morale que les gens.', 'Je ne reste jamais. Rester, c\'est commencer à avoir des choses à perdre.'],
    nouvelles: ['Sur la route, les soldats du lord font payer un droit de passage. Pour la fête du lord. On paie la fête et on n\'y va pas.', 'Les nobles se déplacent beaucoup, en ce moment. Quand les nobles bougent, les pauvres feraient bien de rester chez eux.'],
    perso: { titre: 'D\'où venez-vous ?', paliers: [[1, 'De la route.'], [3, 'D\'un village qui n\'existe plus. Une crue. Je suis parti ce jour-là et je ne me suis plus arrêté.']] },
    aurevoir: ['Bonne route. Peut-être à la prochaine saison.', 'Adieu. Ou au revoir, on ne sait jamais.']
});

/* ── la foule des soirs « parle » (ev 39, 40, 42, 43, 44, 45 — interrupteur 18) ── */
var FOULE = [
    [39, 'Tanneur', 'L\'odeur ? C\'est le métier. On s\'habitue. Enfin, moi.', ['Les peaux sèchent mal quand il pleut. Et il pleut toujours.', 'Mon fils veut épouser la fille du charpentier. Le charpentier ne veut pas. Mon fils non plus, en fait. C\'est la fille qui veut.']],
    [40, 'Cliente', 'Encore une journée de faite. Plus qu\'une vie entière.', ['Mon mari est au Village de Pêche. Pour le travail, qu\'il dit.', 'J\'ai vendu trois poules ce matin. Il m\'en reste deux. Et un coq qui se prend pour un roi.']],
    [42, 'Charpentier', 'Non. Ma fille n\'épousera pas le fils du tanneur. Même s\'il sent moins mauvais.', ['Le toit de la mairie fuit depuis dix ans. On m\'a jamais payé pour le réparer, alors il fuit.', 'Ma fille dit que c\'est de l\'amour. À son âge, j\'appelais ça de l\'ennui.']],
    [43, 'Meunier', 'Tu as vu ma fille ? Pia ? Elle devait être au moulin.', ['Le blé est cher, la farine est chère, et c\'est moi qu\'on accuse.', 'Pia rêve tout le temps. Sa mère rêvait aussi. Elle est partie avec un musicien.']],
    [44, 'Habitué', 'Tu sais ce qui est bien, ici ? Personne ne te demande qui tu es.', ['Je viens depuis vingt ans. J\'ai jamais su le nom du patron.', 'Un jour, j\'arrêterai de boire. Mais pas un jour de fête.']],
    [45, 'Colporteuse', 'Rubans, aiguilles, savon parfumé ! … Non ? Tant pis.', ['Je fais tous les villages. Ici, c\'est là qu\'on m\'achète le moins, mais qu\'on me paie le mieux à boire.', 'Le savon parfumé ? À la lavande. Enfin, à quelque chose de violet.']]
];
FOULE.forEach(function (f) {
    F(f[0], {
        nom: f[1], role: 'la foule des soirs de fête (interrupteur 18 « parle »)', voix: 'un habitant comme un autre, avec sa vie.',
        premiere: f[2], bonjourTous: [f[2], 'Hm ? Salut.', '~Il lève sa chope vers toi.|Santé !'],
        saisons: { 1: ['Enfin le printemps. On respire.'], 2: ['Quelle chaleur. Encore une.'], 3: ['L\'automne. Ça sent la fin de quelque chose.'], 4: ['Ferme la porte, par pitié !'] },
        discuter: f[3], nouvelles: ['On dit que des nobles sont au manoir du lord. Qu\'ils y restent.', 'Des loups au nord. Il y a toujours des loups au nord.'],
        aurevoir: ['Salut.', 'Bonne soirée.']
    });
});

/* ── le tableau d'affichage (ev 49) ────────────────────────────────────── */
var TABLEAU = {
    special: 'tableau',
    lignes: {
        1: ['~Une affiche : « PERDU : chien jaune, répond au nom de Têtu. Non, ce n\'est pas le bœuf. S\'adresser à Baptiste. »', '~« Mariage de Rosalie et du fils du tanneur, fin du printemps. Le charpentier est prié de ne pas venir armé. »', '~« Cours de lecture, les soirs de pluie, chez Jehan. Gratuit pour les enfants. Théo, ça veut dire toi. »'],
        2: ['~« Concours de pêche au lac. Roul et Tobin sont inscrits. La garde sera présente. »', '~« Recherche bras pour la moisson. Payé en grain et en bière. »', '~« Nuit de danse sur la place. Colin chantera. Margot demande qu\'on ne lui jette rien. »'],
        3: ['~« Fête des récoltes : tarte aux pommes géante. Berthe cuisine, Théo est prié de ne pas toucher. »', '~« AVIS DE LA GARDE : loups au nord. Aucun civil au-delà du vieux pont. Article quinze. — Casimir »', '~« Vends hache, peu servie. — Aimé Vannier » Dessous, d\'une autre main : « C\'est la mienne. — Basile »'],
        4: ['~« Le puits de la place est gelé. Prendre l\'eau à la fontaine du marché. »', '~« Collecte de couvertures pour les sans-logis. Déposer chez Berthe. »', '~« Anselme, rends l\'argent. — Tout le monde »']
    },
    toujours: ['~Une vieille affiche à moitié arrachée : « …rang B+, voire A… récompense… »', '~Quelqu\'un a gravé dans le bois : « Margot sers-moi » et, dessous, « non ».']
};

module.exports = { fiches: fiches, tableau: TABLEAU, NOMS_SW: NOMS_SW, carte: 46 };
