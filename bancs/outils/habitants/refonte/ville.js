/*
 * LA REFONTE — la Ville Forestière (carte 29) et l'épicerie (43:3, la même Hilde, le même Kaze)
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-09 : « Développe-les pour qu'ils soient beaucoup plus humains et beaucoup plus
 * sentimentaux […] qu'ils aient une histoire derrière par rapport au lore », puis, sur l'analyse
 * (docs/PNJ_LA_BASE.md) : « oui » (la capitale à une demi-journée, un seul village, les 9 aussi),
 * « tout ou le meilleur » (les mécaniques), « la village puis le marché puis la pêche ».
 *
 * Chaque entrée se pose PAR-DESSUS la fiche existante (le lot, la fiche OC, la situation) : ce qui
 * est écrit ici remplace, le reste (les scènes d'amitié, les cadeaux, les lieux, les avis, les
 * anniversaires, les boutiques et les quêtes de JOKO) reste. Le gabarit, la table « qui sait quoi »
 * et la liste de contrôle sont dans docs/PNJ_LA_BASE.md.
 *
 * Les faits du lore viennent de la Bible : la famine du roi Thibaut et la révolution « il y a un peu
 * plus de vingt ans », la Guerre de la Marche « il y a une trentaine d'années », la Grande Chute
 * « il y a une douzaine d'années », le Héros et le Quartier Noyé « ces dernières années », la route
 * royale reconstruite par Lothaire, les deux règles de la Chute, les braises qui font l'encre du
 * récit spirituel ; et de Notion : derrière la faille, les Larmiers, la Tristesse — ce que personne
 * au village ne sait, mais que certains rêvent.
 *
 * Les étapes du village (variable 889, JOKO la fait avancer) : 0 la faille déclarée · 1 la garde
 * royale s'installe · 2 les aventuriers arrivent · 3 la première expédition est entrée · 4 elle est
 * revenue. Personne n'y dit combien sont revenus : c'est à JOKO.
 */
'use strict';
module.exports = {

/* ── Fernand (29:29) — 78 ans, le ciel et Berthe ─────────────────────────── */
'29:29': {
    voix: "Lent. Des phrases qui digressent et reviennent ; il répond souvent à la question d'avant. « Hein ? », « mon petit ». Il laisse tomber le « ne ». Il ne dit jamais qu'il tient à quelqu'un : il dit « prends un manteau ».",
    oc: {
        vecu: "Né au village, jamais vécu ailleurs. La famine du roi Thibaut à cinquante ans passés (l'année des glands, le pain amer de Berthe) ; la révolution à cinquante-six ans ; Berthe, sa femme, partie il y a six hivers.",
        savoir: "sait le ciel, la terre, chaque famille du village depuis trois générations ; ignore tout des failles, sauf qu'on en a peur ; croit à tort que la grotte se refermera à la première gelée"
    },
    premiere: "~Il lève un doigt mouillé, le regarde longtemps.|Hein ? Ah. Bonjour. Fernand. Je dis le temps qu'il fera. Gratuitement. C'est pour ça qu'on m'écoute pas.",
    bonjour: {
        1: ["Matin. Le genou gauche dit pluie vers le soir. Le droit dit rien. Il boude depuis l'hiver."],
        2: ["~Il est assis, les deux mains sur sa canne.|Midi passé ? J'ai pas vu passer midi. Ça m'arrive, maintenant."],
        3: ["Le soir, le ciel raconte la journée de demain. Faut juste l'écouter. Et pas parler en même temps."],
        4: ["Tu dors pas, toi non plus ? … Moi, c'est l'âge. Toi, c'est quoi ?"]
    },
    saisons: {
        1: ["Le printemps, ça ment. Ça te met du soleil le matin et de la grêle à midi. Comme les jeunes."],
        2: ["Orage demain. Les vaches se couchent du côté du bois. Les vaches savent, elles. Personne leur demande."],
        3: ["L'automne, Berthe faisait les confitures. Moi je léchais la cuillère. C'était mon travail. Le seul qu'elle me laissait."],
        4: ["Encore un mois de gel. Peut-être deux. Rentre ton bois. Enfin, t'as pas de bois. Rentre quelque chose."]
    },
    discuter: [
        "Tomas m'a demandé pourquoi les nuages sont gris par en dessous. J'ai dit : parce qu'ils sont lourds. Il a écrit « lourds ». Maintenant, faut que ce soit vrai.",
        "J'ai vu passer quatre familles au manoir, et deux rois sur le trône. Les champs ont pas bougé. Les champs, ça règne plus longtemps.",
        "Mado vient me crier dessus tous les matins pour savoir s'il va pleuvoir. Je fais le sourd. Faut bien que quelqu'un s'amuse.",
        "Les jeunes parlent vite. Moi je réponds lentement. Quand j'ai fini, ils ont oublié la question. Ça règle beaucoup de choses."
    ],
    fil: [
        "Hein ? Le temps ? … Ah non, tu me demandais comment je vais. Pareil que le ciel, mon petit : ça dépend de l'heure. Le genou gauche tirait ce matin. Pluie sur la forêt ce soir, tu verras.",
        { ami: 2, t: "Tu veux savoir comment on lit le ciel ? On regarde les hirondelles. Basses, il pleut. Hautes, il pleut pas. Au milieu… on regarde autre chose. Les vaches. Ou Mado." },
        { ami: 3, t: "Tu sais pourquoi je regarde le ciel ? À cause de Berthe. Elle voulait savoir quand étendre le linge, et moi je voulais qu'elle me regarde. Alors j'ai appris les nuages.|Quarante ans à lui dire « pas aujourd'hui, demain ». Elle étendait quand même. Et quand ça tombait, elle rentrait les draps en riant.|~Il regarde ses mains.|Elle est partie il y a six hivers. Doucement, un matin de beau temps. Celui-là, je l'avais pas vu venir." },
        { ami: 5, t: "Du temps du roi Thibaut, le grain partait en taxes avant d'être mûr. L'année des glands, Berthe a fait du pain avec ce qu'elle ramassait dans le bois. Amer comme une dispute.|On l'a mangé en se regardant, et on a ri. Je sais plus de quoi.|Mes petits-enfants savent pas ce que c'est, le pain aux glands. C'est bien. Faut pas qu'ils sachent." },
        { ami: 7, t: "Le roi d'aujourd'hui, on en dit ce qu'on veut. Qu'il a trahi son oncle pour prendre la couronne. Ça, c'est des histoires de château. Moi je sais une chose : depuis lui, le grain reste dans les greniers." },
        { ami: 9, gestes: [
            "Depuis la grotte, certains matins, j'ai un chagrin qui est pas à moi. Je me réveille les yeux mouillés, et je sais pas pour qui.",
            "Et les nuages, ces matins-là, je les lis plus. Les jeunes appellent ça l'imprégnation. Moi, j'ai peur que ce soit juste… que je m'en vais.",
            "~Il lève un doigt mouillé au vent. Longtemps.",
            "… Vent d'ouest. Pluie demain soir. Tu vois ? Je l'ai encore. … Dis. Je l'ai encore ?",
            ['choix', ["Tu l'as encore, Fernand.", "Et si c'était la grotte ?"], [
                [['retiens', 'ciel', 'encore'], "~Il hoche la tête, plusieurs fois, comme on enfonce un piquet.", "Bon. Bon. Alors je continue. Tomas a encore des pages vides.", ['ami', 1]],
                [['retiens', 'ciel', 'grotte'], "La grotte. Hein.", "~Il réfléchit, la bouche tordue.", "Alors c'est pas moi qui m'en vais. C'est elle qui vient. … Ça me plaît mieux.", ['ami', 1]]]]
        ] }
    ],
    souvenirs: [
        { cle: 'ciel', val: 'encore', lignes: ["Ah, c'est toi qui m'as dit que je l'avais encore. Il a plu, hier soir. Comme j'avais dit."] },
        { cle: 'ciel', val: 'grotte', lignes: ["Ce matin, le chagrin est venu. Je lui ai dit : c'est pas à moi, ça, c'est à la grotte. Il est reparti. Un peu."] }
    ],
    nouvelles: [
        "Un monsieur de la Chancellerie a promené une baguette qui bourdonne au-dessus de mon champ. Il a dit « niveau un ». Mon champ a jamais eu de niveau.",
        "Les jeunes vont voir la grotte le soir, en douce. Je les vois passer. Je dis rien. À leur âge, j'allais voir les filles du moulin. C'était plus dangereux."
    ],
    etapes: {
        0: ["La grotte, c'était une grotte. On y mettait les fromages au frais. Maintenant c'est une porte, à ce qu'ils disent. Les fromages, on les mettra où ?"],
        1: ["Des soldats du roi sur le chemin de la grotte. Ils disent bonjour. Les soldats d'avant, ils disaient pas bonjour. Ça change, un pays."],
        2: ["Il en arrive tous les jours, des aventuriers. Ils passent par mon champ. Tous. Le chemin, c'est à gauche. Personne regarde à gauche."],
        3: ["Ils sont entrés ce matin, les jeunes. Il va pleuvoir, là-dedans. Je le sens d'ici. Mes genoux le sentent d'ici."],
        4: ["Ils sont revenus mouillés. Je l'avais dit. Personne m'écoute, mais je l'avais dit. Tomas l'avait écrit, d'ailleurs. Avant."]
    },
    triste: [
        "~Il a les yeux rouges, et il regarde le chemin de la grotte.|C'est rien. C'est le vent. Le vent qui vient de là-bas, il a un goût de pluie qui pleure. Va, va. Ça passera avant midi.",
        "Ce matin, j'ai mis deux bols sur la table. Comme avant. Ça m'était plus arrivé depuis des années. … C'est la grotte, je crois. Elle remue les vieilles choses."
    ],
    aurevoir: ["Prends un manteau.", "Hein ? Oui, au revoir. Pluie ce soir, hein. Je dis ça, je dis rien."]
},

/* ── Tomas (29:26) — 7 ans, le carnet ────────────────────────────────────── */
'29:26': {
    voix: "Lent, sérieux, il pèse chaque mot. Il pose une question et attend VRAIMENT la réponse, puis il la note. Des phrases courtes, sans chute : il ne fait jamais exprès d'être drôle. Il dit « je crois ».",
    oc: {
        vecu: "Né il y a sept ans au village : après la Grande Chute, après le Héros. Il n'a connu que la paix. La grotte est la première chose dont il a vraiment peur.",
        savoir: "sait les nuages (Fernand), le nom des fioles de l'épicerie, ce que les gens lui ont répondu (c'est écrit) ; ignore la faim, la guerre, ce qu'est un rang ; croit à tort que la Chancellerie est une dame"
    },
    premiere: "~Il te regarde longtemps avant de parler.|Bonjour. Je m'appelle Tomas. Est-ce que je peux te poser une question ? … Pas maintenant. Quand je l'aurai choisie.",
    fil: [
        "Je peux te poser ma question, maintenant ? … Pourquoi les grands disent « ne t'inquiète pas » ? Ça ne marche jamais. Je l'ai noté : ça ne marche jamais.",
        { ami: 2, t: "Papa m'a dit, une fois : « Moi aussi j'avais peur. Je le faisais quand même. » Je ne sais pas ce qu'il faisait. Il n'a pas dit la suite. Je n'ai pas osé demander. Je l'ai noté sans la suite." },
        { ami: 3, gestes: [
            "J'ai une vraie question. Pour mon carnet.",
            "~Il ouvre son carnet à une page vide, et attend, le crayon levé.",
            "Tu as peur, toi, des fois ?",
            ['choix', ["Oui. Souvent.", "Non. Jamais."], [
                [['retiens', 'peur', 'oui'], "~Il écrit, très appliqué, en tirant la langue.", "« Souvent. » … Merci. C'est la première grande personne qui dit oui. Je vais le souligner.", ['ami', 1]],
                [['retiens', 'peur', 'non'], "~Il écrit, puis s'arrête.", "« Jamais. » Je l'écris. Mais je mets un point d'interrogation à côté. Pas pour toi. Pour les grandes personnes en général."]]]
        ] },
        { ami: 5, t: "La nuit où la grotte s'est ouverte, Élise a pleuré dans son lit. Elle ne pleure jamais. Elle a dit que c'était un rêve d'eau. Moi j'ai fait semblant de dormir. Je n'ai pas noté. Il y a des choses qu'on ne note pas." },
        { ami: 7, t: "Je m'entraîne à grimper. En cachette, derrière l'épicerie. Comme ça, quand Élise partira, je pourrai la suivre. Pour la ramener. … Tu ne le dis pas. Je l'ai noté : tu ne le dis pas." },
        { ami: 9, t: "J'ai relu tout mon carnet hier. Il y a beaucoup de « pourquoi ». Il y a moins de « parce que ». Fernand dit qu'une vie, c'est comme ça. … Je crois que j'aime bien quand même." }
    ],
    souvenirs: [
        { cle: 'peur', val: 'oui', lignes: ["Je l'ai souligné deux fois, ton « souvent ». Maman a demandé pourquoi. Je n'ai pas dit."] },
        { cle: 'peur', val: 'non', lignes: ["J'ai toujours le point d'interrogation, pour toi. Il est petit. Je peux l'effacer, si tu veux."] }
    ],
    ragots: [
        { de: '29:29', cle: 'ciel', val: 'encore', lignes: ["Fernand dit que tu lui as dit qu'il l'avait encore. Le ciel. Il me l'a répété trois fois. Je l'ai écrit trois fois."] }
    ],
    nouvelles: [
        "Le monsieur de la Chancellerie avait un appareil qui bourdonne. Il l'a pointé vers la grotte. Ça a bourdonné plus fort. Je n'ai pas aimé ce bruit.",
        "Élise veut voir la grotte. Je lui ai dit que c'était interdit. Elle a dit « justement ». Je ne comprends pas « justement »."
    ],
    etapes: {
        0: ["Il y a une porte dans la grotte. Pas une porte en bois. Une porte vers ailleurs. Je ne veux pas savoir où. Élise veut. C'est ça, le problème."],
        1: ["Des soldats du roi sont arrivés. Ils ont des vraies épées. Papa les a regardés longtemps. Puis il a dit « hm ». Pas le « hm » content."],
        2: ["Il y a beaucoup de gens nouveaux. Je ne connais pas leurs noms. Je ne peux pas les compter. Je n'aime pas quand je ne peux pas compter."],
        3: ["Ils sont entrés. J'ai compté ceux qui entraient. Je compterai ceux qui sortent."],
        4: ["Ils sont revenus. J'ai recompté trois fois. Après, j'ai rangé le carnet et j'ai dormi tout l'après-midi. Je ne savais pas que compter, ça fatiguait autant."]
    },
    triste: ["~Il a les yeux mouillés, et il a l'air surpris.|Je ne sais pas pourquoi je pleure. Il n'y a pas de raison. J'ai cherché. … Fernand dit que c'est la grotte. Je préfère que ce soit la grotte."],
    aurevoir: ["Au revoir. Tu reviendras ? … Je note « peut-être ».", "Au revoir. Fais attention aux têtards."]
},

/* ── Élise (29:25) — 9 ans, la grotte et Trois-Doigts ───────────────────── */
'29:25': {
    voix: "Vite, sans respirer, des phrases qui s'enchaînent avec « et », des mots de grand mal placés (« la Chancelière »). Elle demande « et après ? ». Elle fanfaronne, puis avoue tout d'un coup.",
    oc: {
        vecu: "Née il y a neuf ans au village. Elle avait cinq ans quand le crieur a annoncé le Héros : c'est sa légende à elle. Ni famine ni guerre : elle n'a connu que des histoires.",
        savoir: "sait le Héros, les guildes « de nom », tenir une épée de bois (Trois-Doigts) ; ignore ce qu'est un rang, ce qu'il y a derrière la faille, l'âge de la licence ; croit à tort qu'on demande un permis par lettre à « la Chancelière »"
    },
    premiere: "T'es qui ? T'es une aventurière ? Un aventurier ? T'as une vraie épée ? Moi j'ai une épée en bois mais c'est presque pareil, Trois-Doigts dit que c'est la main qui compte, pas le bois. Je m'appelle Élise.",
    fil: [
        "Tu sais quoi ? J'ai écrit à la Chancelière. Pour avoir un permis. Pour la grotte. J'ai écrit bien, presque sans faute. J'attends la réponse. Ça fait quatre jours. Et après ?",
        { ami: 2, t: "Le Héros, il a fermé une faille tout seul. TOUT SEUL. C'était à la capitale, dans un quartier qui s'est noyé. Moi j'étais petite. Maman a pleuré en écoutant le crieur, mais c'était des pleurs contents. Ça existe." },
        { ami: 3, t: "Je vais te dire un secret mais tu le dis pas. J'ai peur des grosses araignées. Pas des petites, les petites c'est rien. Les grosses. Les aventuriers ils en ont pas peur, hein ? … Hein ?" },
        { ami: 5, t: "La nuit où la grotte s'est ouverte, j'ai pleuré. Pour rien ! J'ai rêvé d'un lac tout gris, avec la pluie dedans, et le lac il était triste, je sais pas comment je savais, il était triste c'est tout. Tomas a fait semblant de dormir. Il fait mal semblant." },
        { ami: 7, gestes: [
            "Dis. Si un jour je pars, Tomas, il viendra ?",
            ['choix', ["Il viendra. Pour te ramener.", "Il faudrait lui demander."], [
                [['retiens', 'tomas', 'viendra'], "~Elle sourit, très fort, puis se reprend.", "Pour me ramener, pfff. … Bon. Ça compte quand même.", ['ami', 1]],
                [['retiens', 'tomas', 'demander'], "Lui demander ? … J'ai jamais pensé à lui demander. Je pars toujours devant.", "~Elle regarde du côté de son frère, longtemps.", "Je vais lui demander. Pas tout de suite. Demain. Peut-être.", ['ami', 1]]]]
        ] },
        { ami: 9, t: "Trois-Doigts m'a dit qu'il a laissé ses deux doigts loin, dans une guerre, contre des gens qui sortaient des failles. Je lui ai demandé s'ils étaient méchants. Il a pas répondu tout de suite. Il a dit : « Ils criaient des noms. » C'est tout. Je sais pas ce que ça veut dire, mais ça m'a fait drôle." }
    ],
    souvenirs: [
        { cle: 'tomas', val: 'viendra', lignes: ["Tomas il a dit oui ! Enfin il a dit « je crois ». Chez Tomas, c'est oui."] },
        { cle: 'tomas', val: 'demander', lignes: ["J'ai demandé à Tomas. Il a dit « où ? ». J'ai dit « loin ». Il a dit « d'accord, mais avec un bonnet ». C'est oui, ça ?"] }
    ],
    ragots: [
        { de: '29:26', cle: 'peur', val: 'oui', lignes: ["Tomas il a écrit que t'as peur souvent. Moi non ! … Un peu. Les araignées. Tu sais déjà."] }
    ],
    nouvelles: [
        "Y a un monsieur de la Chancellerie qui a mis un panneau devant le chemin du marécage. « Défense d'approcher sans permis. » J'ai lu le panneau. Il dit pas « défense de regarder ».",
        "Théo il dit que derrière la grotte y a un lac qui pleure. Théo il sait tout. Enfin, il dit qu'il sait tout. C'est pas pareil, maman dit."
    ],
    etapes: {
        0: ["Y a une faille dans la grotte ! Une vraie ! Niveau un ! Je sais pas ce que ça veut dire mais c'est le premier niveau, donc c'est pour les débutants, donc c'est pour moi."],
        1: ["Les soldats du roi sont là ! Ils ont des capes ! Un monsieur m'a laissée toucher son épée. Enfin, le fourreau. Enfin, il a dit « non », mais il a souri."],
        2: ["Y a des aventuriers partout ! Des vrais ! Y en a un qui a une hache plus grande que Tomas ! J'ai mesuré ! Enfin, j'ai pas mesuré, mais c'était sûr."],
        3: ["ILS SONT ENTRÉS. Dans la faille. Je les ai vus partir, et après la grotte elle a rien fait, elle les a juste… pris. Et après ? Hein ? Et après ?"],
        4: ["Ils sont revenus et ils sentaient la pluie. La pluie ! Alors c'était vrai, le lac. Mon lac. Je l'ai rêvé avant tout le monde !"]
    },
    triste: ["~Elle est assise sur le muret, toute seule, sans sauter.|Je suis pas triste. C'est mes yeux qui font n'importe quoi. … Tu restes un peu ? Juste un peu. Tu dis rien, c'est bien."],
    aurevoir: ["Salut ! Si tu vas dans la grotte, tu me racontes ! Tout ! Même les araignées !", "Et après ? … Bon, salut."]
},

/* ── Hilde (29:28, et l'épicerie le matin) — 34 ans, compter les têtes ──── */
'29:28': {
    voix: "Pressée, des phrases coupées par ses enfants (« ÉLISE ! »), elle s'excuse et recommence. Elle compte à voix basse. Elle dit « bon » pour changer de sujet quand ça devient trop vrai.",
    oc: {
        vecu: "Née au village il y a trente-quatre ans. Les années maigres du roi Thibaut entre six et treize ans : sa mère comptait les haricots, les bougies, et les têtes autour de la table, chaque soir. Elle a gardé l'habitude. Elle chantait au bar le jeudi, avant Élise ; Kaze venait tous les jeudis.",
        savoir: "sait ce qu'achètent ceux qui partent (cordes, fioles, balises), ce que coûte chaque chose, ce que vaut une soirée tranquille ; ignore ce qu'il y a derrière la faille, et ce que Kaze a fait avant elle ; croit à tort qu'Élise ne sait pas lire les panneaux"
    },
    perso: null,
    fil: [
        "Tu veux savoir pourquoi je compte tout le temps ? … Ma mère comptait. Les haricots, les bougies, et nous, autour de la table, chaque soir. C'était les années du roi Thibaut. On n'avait pas grand-chose, alors on comptait ce qu'on avait.",
        { ami: 2, t: "On était cinq, plus deux cousins qu'on avait pris l'hiver le plus dur. Sept. Ma mère disait « sept » et elle souriait. Tant que ça faisait sept, la journée était bonne. … Bon. Je recompte les miens. Deux. Bien." },
        { ami: 3, t: "Avant les enfants, je chantais. Le jeudi, au bar. Margot me gardait une chaise près du feu. Et il y avait un grand type, au fond, qui ne disait rien. Tous les jeudis.|Un soir, il a dit « encore ». C'était Kaze. C'est tout. Ça m'a suffi." },
        { ami: 5, t: "Kaze ne parle jamais d'avant moi. Il a des cicatrices qu'il appelle « des bêtises ». Béran le salue comme un soldat salue un soldat. Je ne demande pas. Un jour il racontera, ou il ne racontera pas. Je l'aime dans les deux cas." },
        { ami: 7, t: "La grotte me fait peur pour une seule raison, et elle s'appelle Élise. Tomas, je sais où il est : derrière moi. Élise, je sais où elle va : devant.|Si tu la vois sur le chemin du marécage, ramène-la. Par l'oreille." },
        { ami: 9, t: "Kaze croit que je ne sais pas, pour mon anniversaire. Il pose des questions sur les fleurs à tout le monde. Une fleur rare, d'après Mado. Il est très mauvais pour les secrets.|Ne lui dis pas que je sais. Il est si content d'avoir un secret." },
        { ami: 11, gestes: [
            "~Elle compte, du bout des doigts, sans s'en rendre compte. Puis elle s'arrête, et te regarde.",
            "Dis-moi une chose. Toi, quand tu pars quelque part, il y a quelqu'un qui compte les têtes, pour toi ?",
            ['choix', ["Oui. Quelqu'un m'attend.", "Non. Personne ne compte."], [
                [['retiens', 'compte', 'oui'], "Bien. Bon. … Alors fais attention à toi, pour cette personne-là. Et un peu pour moi.", ['ami', 1]],
                [['retiens', 'compte', 'non'], "~Elle pose son crayon.", "Alors maintenant, si. … Ne discute pas. C'est moi qui compte, ici.", ['ami', 1]]]]
        ] }
    ],
    souvenirs: [
        { cle: 'compte', val: 'non', lignes: ["Je t'ai compté, hier soir. Avec les petits et Kaze. Ça faisait cinq. C'est un bon chiffre, cinq."] },
        { cle: 'compte', val: 'oui', lignes: ["Tu as donné de tes nouvelles à ta personne ? … Ne me regarde pas comme ça. Je demande, c'est tout."] }
    ],
    ragots: [
        { de: '29:40', cle: 'chant', val: 'lui', lignes: ["Kaze m'a demandé si je voulais rechanter. Lui. Avec des mots. Plusieurs. … Je ne sais pas ce que tu lui as dit. Jeudi. Peut-être jeudi."] },
        { de: '29:40', cle: 'chant', val: 'moi', lignes: ["Il paraît que tu veux m'entendre chanter. C'est Kaze qui t'envoie, hein ? Il se croit discret. … Je vais y réfléchir. Ne le dis pas à Margot."] },
        { de: '29:40', cadeau: true, lignes: ["Kaze a souri, hier soir. Vraiment souri. Il a dit que tu lui avais fait un cadeau. Merci. Il ne sourit pas assez."] }
    ],
    nouvelles: [
        "Je vends plus de cordes en une semaine qu'en un an. Des gens que je ne connais pas, qui paient bien et ne disent pas merci. Je compte l'argent le soir. Ça me fait moins plaisir que je croyais.",
        "Ceux qui partent achètent tous la même chose : une corde, des fioles, des bougies. Je leur dis de prendre deux cordes. Une pour aller, une pour revenir. Ils rient. Ils en prennent deux."
    ],
    etapes: {
        0: ["L'évaluateur de la Chancellerie a dormi à l'auberge. Il m'a acheté une fiole et il m'a demandé si les enfants dormaient bien, depuis la grotte. Comme ça. Je n'ai pas aimé qu'il demande."],
        1: ["La garde royale s'installe près du marécage. Je suis contente. Je suis contente, mais je compte les enfants deux fois plus."],
        2: ["Les guildes ont planté des fanions sur la place, comme pour une fête. Ce n'est pas une fête. Mais ça y ressemble, et je n'arrive pas à leur en vouloir."],
        3: ["Ils sont entrés ce matin. J'ai ouvert l'épicerie quand même. Personne n'est venu. Tout le monde regardait la grotte."],
        4: ["Ils sont revenus. Je leur ai donné du pain chaud sans les faire payer. Kaze a dit « hm ». Le « hm » d'accord."]
    },
    triste: ["~Elle a les yeux rouges, et rit d'elle-même.|Ne fais pas attention. Je pleure en rangeant les bougies depuis ce matin. Les bougies ! … C'est la grotte. Tout le monde a ses jours. Aujourd'hui, c'est le mien. Bon."]
},

/* ── Kaze (29:40, et l'épicerie l'après-midi) — 36 ans, « hm » ──────────── */
'29:40': {
    voix: "Trois mots, rarement quatre. « Hm », six sortes. Quand il parle plus, c'est que ça compte. Il ne dit jamais ce qu'il fait de bien : il change de sujet vers une soupe.",
    oc: {
        vecu: "On ne sait pas d'où il vient avant le bar, un jeudi, et Hilde qui chantait : il ne le dit pas. Béran le salue comme on salue un ancien ; Hilde ne demande pas. (À JOKO.)",
        savoir: "sait les nœuds, les soupes, se taire — et plus qu'il ne dit sur les armes ; ignore où pousse la fleur qu'il cherche ; croit à tort que personne ne sait qu'il rentre le bois des voisins"
    },
    premiere: "~Il te regarde. Longtemps. Puis il hoche la tête, une fois.|Kaze. … L'épicerie, c'est l'après-midi. Le matin, c'est Hilde.",
    fil: [
        "Tu as mangé ? … J'ai fait trop de soupe. J'en fais toujours trop. Hilde dit que c'est une maladie.",
        { ami: 2, t: "Les nœuds. Un nœud bien fait, ça tient. Un nœud mal fait, ça lâche au mauvais moment. Les gens, pareil.|~Il prend un bout de corde sur le comptoir.|Le nœud de chaise. Regarde. Pour la grotte. Au cas où." },
        { ami: 3, t: "Élise part devant. Toujours. Je lui apprends à tomber. Pas à se battre : à tomber. Celui qui sait tomber se relève. Le reste, elle l'apprendra bien assez tôt." },
        { ami: 5, t: "Béran et moi, on ne parle pas d'avant. On se salue. Ça suffit. … Tu poses des questions. C'est bien. Je ne réponds pas. C'est bien aussi." },
        { ami: 7, t: "Hilde chantait. Le jeudi. J'allais au bar pour l'entendre, et je faisais semblant d'y aller pour la bière. Un soir, j'ai dit « encore ». Une fois.|Elle ne chante plus. Je voudrais qu'elle rechante. C'est tout ce que je veux." },
        { ami: 9, gestes: [
            "~Il vérifie que Hilde n'est pas dans les parages.",
            "Le jeudi. Au bar. Si je lui demande de rechanter, elle dira non. Elle dit toujours non, d'abord.",
            "Toi. Tu lui demanderais ?",
            ['choix', ["Je lui demanderai.", "Demande-lui, toi. Elle attend ça."], [
                [['retiens', 'chant', 'moi'], "Hm.", "~Un « hm » que tu n'avais jamais entendu. Presque un merci.", ['ami', 1]],
                [['retiens', 'chant', 'lui'], "~Il te regarde, figé. Puis il se frotte la nuque.", "… Moi. Avec des mots. … Bon. Plusieurs mots. Je vais m'entraîner.", ['ami', 1]]]]
        ] }
    ],
    souvenirs: [
        { cle: 'chant', val: 'lui', lignes: ["~Il fait un signe de tête, à peine.|Je lui ai demandé. Avec des mots. Elle a dit « peut-être ». C'est beaucoup."] },
        { cle: 'chant', val: 'moi', lignes: ["Hm. Tu lui as demandé ? … Pas encore. Prends ton temps. Elle aussi."] }
    ],
    ragots: [
        { de: '29:28', cadeau: true, lignes: ["Hilde. Elle a souri toute la journée, hier. À cause de toi, d'après elle. … Merci."] }
    ],
    nouvelles: [
        "Les aventuriers achètent des cordes. Je leur montre le nœud. La moitié ne regarde pas. Hm. Le mauvais « hm ».",
        "Élise a écrit à la Chancellerie. Pour un permis. … J'ai posté la lettre. Elle ne recevra jamais de réponse. Mais elle l'a écrite."
    ],
    etapes: {
        0: ["Une porte dans la grotte. On ferme les nôtres à clé, maintenant. Avant, non."],
        1: ["La garde royale. … Ils tiennent bien leurs lances. Hm. Le bon « hm »."],
        2: ["Trop de monde. Pas assez de soupe. Je fais plus de soupe."],
        3: ["Ils sont entrés. J'ai fait une grande soupe. Pour quand ils sortiront."],
        4: ["~Il remplit des bols, un par un, sans un mot.|Ils sont sortis. Mange."]
    },
    triste: ["~Il épluche des légumes, les yeux brillants, la mâchoire serrée.|Les oignons. … Il n'y a pas d'oignons. … Ça passera."],
    aurevoir: ["Hm. Reviens.", "Mange quelque chose avant de partir."]
},

/* ── Béran (29:36) — 58 ans, vingt ans de Marche ─────────────────────────── */
'29:36': {
    voix: "Sec, des phrases qui coupent ; il s'adoucit dès qu'il y a un enfant. Il compte sur ses trois doigts. Il dit « la guerre » comme on dit « la pluie ». Il déteste les grands mots.",
    oc: {
        vecu: "Né au village il y a cinquante-huit ans. Vingt-huit ans quand la Guerre de la Marche a commencé : vingt ans dans les légions, à tenir la ligne contre ce qui sortait des failles. Il y a laissé deux doigts, une nuit de Chute, près d'un moulin. Revenu au village pour des rondes sans histoire.",
        savoir: "sait les Chutes de l'intérieur, les deux règles par cœur, ce que veut dire « tenir la ligne », que ceux d'en face criaient des noms ; ignore pourquoi ils se battaient (il s'est interdit de le demander) ; croit à tort qu'une faille de niveau un, ce n'est « pas grand-chose »",
        deteste: "les discours, les trompettes, qu'on l'appelle « héros »"
    },
    perso: null,
    premiere: "~Il te jauge de haut en bas, et s'arrête sur tes mains.|Béran. Je fais la ronde. Si tu cherches un héros, il n'y en a pas ici. Si tu cherches ton chemin, c'est à gauche.",
    discuter: [
        "Une ronde sans histoire, c'est la meilleure ronde. Les jeunes croient que c'est de l'ennui. C'est de la chance.",
        "La petite de Hilde m'appelle Trois-Doigts. Les sergents m'appelaient pire. Je préfère la petite.",
        "J'ai un potager. Les tomates ne m'obéissent pas. Je leur parle comme à des recrues. Elles poussent quand même. Les recrues aussi, finalement."
    ],
    fil: [
        "Mes rondes, je les fais à l'envers de celles des autres. Si quelque chose arrive, on le voit de deux côtés. Habitude. On garde des habitudes, après.",
        { ami: 2, t: "La Marche. Vingt ans. Une faille s'ouvrait, des fois deux la même nuit, et il en sortait de tout. Tu tiens. Tu tiens encore. Après, tu rentres, et tu tiens une ronde. C'est plus facile. C'est pas plus simple." },
        { ami: 3, t: "Mes deux doigts, je les ai laissés une nuit de Chute, près d'un moulin. La douleur, je m'en souviens plus. Le moulin, si. Il tournait encore. Personne pour l'arrêter." },
        { ami: 5, t: "Les deux règles, tu les connais ? Tuer ce qui sort ne ferme pas la faille. Fermer la faille n'efface pas ce qui est sorti. … Moi, j'en ai appris une troisième : ce qui sort, ça a peur aussi." },
        { ami: 7, t: "Ceux d'en face, on les appelait des démons. C'est pratique, un mot comme ça. Mais ils criaient des noms, en se battant. Des noms. Comme nous, quand on appelait nos gars.|Je me suis interdit d'y penser pendant vingt ans. Maintenant j'ai que ça à faire." },
        { ami: 9, gestes: [
            "La petite veut aller dans la grotte. Elle a son épée de bois. Je l'ai taillée, l'épée. Personne ne le sait.",
            "Dis-moi. Je lui apprends à se battre, ou je lui apprends à pas y aller ?",
            ['choix', ["Apprends-lui à revenir.", "Apprends-lui à ne pas y aller."], [
                [['retiens', 'petite', 'revenir'], "~Il compte sur ses trois doigts, lentement.", "Revenir. … Oui. C'est ce que la Marche m'a appris, au fond. Le reste, c'était du bruit.", ['ami', 1]],
                [['retiens', 'petite', 'rester'], "~Il rit, un vrai rire, court.", "Pas y aller. Elle ? Tu la connais pas. … Non. Toi, tu la connais. C'est moi qui fais semblant.", ['ami', 1]]]]
        ] }
    ],
    souvenirs: [
        { cle: 'petite', val: 'revenir', lignes: ["J'ai commencé avec la petite. Leçon un : regarder derrière soi. Elle déteste. C'est bon signe."] },
        { cle: 'petite', val: 'rester', lignes: ["Je lui ai dit de pas y aller. Elle a dit « d'accord ». Elle ment aussi mal que son père. Je continue les leçons."] }
    ],
    nouvelles: [
        "La Chancellerie a dit « niveau un ». Au front, on disait ça des failles qu'on fermait en une nuit. Et des fois on disait ça, et on se trompait. … Ça va aller. Probablement.",
        "J'ai montré à Oswin comment on tient une lance quand on a peur. On la tient pareil. Il croyait qu'il y avait une autre façon."
    ],
    etapes: {
        0: ["Une faille dans la grotte. J'ai vingt ans de Marche dans les jambes, et ça m'a quand même retourné. Pas de peur. De… voisinage."],
        1: ["La garde royale s'installe. Des gamins bien droits. Leur sergent sait ce qu'il fait : ça se voit à comment il place ses sentinelles."],
        2: ["Les guildes arrivent, avec leurs fanions. À la Marche, personne avait de fanion. Ça se voit, qui a déjà vu une Chute et qui en a jamais vu."],
        3: ["Ils sont entrés. J'ai fait trois fois ma ronde au lieu d'une. On fait ce qu'on peut, avec trois doigts."],
        4: ["Ils sont revenus. Bien. … Je vais m'asseoir un moment. Ça me fait ça chaque fois que quelqu'un revient. Depuis vingt ans."]
    },
    triste: ["~Il est assis sur une borne, la main gauche serrée dans la droite.|Pas aujourd'hui. Aujourd'hui, je me souviens de noms. … Va. Demain je serai désagréable, comme d'habitude."],
    aurevoir: ["Regarde derrière toi, de temps en temps.", "Trois, c'est assez. File."]
},

/* ── Colette (29:38) — 22 ans, la Parole d'ombre (la personnalité est celle de JOKO) ── */
'29:38': {
    voix: "Concise. Des phrases sèches, souvent sans verbe. Elle corrige les autres. Quand quelque chose la touche, elle parle plus vite, se trompe de mot, puis se dit « Abrège. » à elle-même.",
    oc: {
        vecu: "Née il y a vingt-deux ans à Haute-Taville, au-dessus d'une échoppe d'encres de la Basse-Brume. Refusée à l'examen de l'Académie Rubis à douze ans (« contrôle insuffisant » : elle vérifiait ses calculs, elle était trop lente). Elle a appris la Parole seule, dans les livres. Venue au village il y a quatre ans, pour le silence.",
        savoir: "sait la Parole, les équations du mana, ce qu'on enseigne à Rubis (par les livres), la Basse-Brume ; ignore comment on se fait des amis (« il n'y a pas d'équation ») ; croit à tort que personne ne remarque qu'elle regarde jeck"
    },
    fil: [
        "Tu n'as pas compris ce que je viens de dire. Ce n'est pas grave. Presque personne ne comprend. Ceux qui comprennent ne viennent pas jusqu'ici. … C'était un compliment. Pour toi. Toi, tu es là.",
        { ami: 2, t: "J'ai passé l'examen de l'Académie Rubis. À douze ans. « Contrôle insuffisant. » Je vérifiais mes calculs : j'étais trop lente.|Ils avaient raison. Une Parole juste qui arrive trop tard, c'est une Parole fausse. J'ai appris la vitesse. Seule." },
        { ami: 3, t: "Je suis née en Basse-Brume. Au-dessus d'une échoppe d'encres. L'odeur de l'encre, c'est l'odeur de ma mère. … Pourquoi je te dis ça. Abrège, Colette." },
        { ami: 5, t: "Je suis venue ici pour le silence. Il y avait le silence. Maintenant il y a une faille, des guildes, un crieur, et jeck. … Le silence était surfait." },
        { ami: 7, t: "La faille. J'ai fait le calcul : une porte dont l'intérieur n'a rien à voir avec l'entrée. L'équation n'a pas de fin. C'est la seule que je n'aime pas.|C'est aussi la seule qui m'empêche de dormir. Les deux sont peut-être liés." },
        { ami: 9, gestes: [
            "~Elle ferme son livre, le pose à plat, met la main dessus.",
            "Question. Une seule. Réponds sans réfléchir : un calcul exact qui arrive trop tard, ou un calcul faux qui arrive à temps ?",
            ['choix', ["Le faux, à temps.", "L'exact, même trop tard."], [
                [['retiens', 'calcul', 'temps'], "~Elle te fixe, longtemps.", "C'est ce que Rubis m'a dit, à douze ans. … Je l'ai détesté. Je ne te déteste pas. Ce n'est pas cohérent. Je vais y réfléchir.", ['ami', 1]],
                [['retiens', 'calcul', 'exact'], "~Elle détourne les yeux, rouge jusqu'aux oreilles.", "… C'est la mauvaise réponse. C'est la mienne. Ne le répète à personne. Surtout pas à jeck.", ['ami', 1]]]]
        ] }
    ],
    souvenirs: [
        { cle: 'calcul', val: 'exact', lignes: ["Personne d'autre n'a donné la mauvaise réponse. Ma réponse. … Assieds-toi. Ne parle pas. Juste, assieds-toi."] },
        { cle: 'calcul', val: 'temps', lignes: ["J'ai réfléchi. Tu avais raison, et c'est insupportable. Bonjour."] }
    ],
    nouvelles: [
        "Les recrues me demandent des livres de Parole « pour débutants ». Il n'y a pas de Parole pour débutants. Il y a des débutants qui parlent.",
        "Un élève de Rubis a acheté mon traité d'ombre. Il l'a lu jusqu'à la page douze. C'est un record. Je l'ai noté."
    ],
    etapes: {
        0: ["La Chancellerie a dit « niveau un ». Ils ne disent jamais ce que vaut un niveau un. Je l'ai calculé. Ne me demande pas le résultat."],
        1: ["La garde royale. Ils marchent au pas. Le pas, c'est une équation simple. Ça m'apaise. Je n'en dirai pas plus."],
        2: ["Les guildes recrutent sur la place. La Veilleuse prend les débutants, le Voile-Soleil prend les riches, les Crocs prennent n'importe qui. jeck voulait s'inscrire chez les Crocs. Je l'en ai… dissuadé."],
        3: ["Ils sont entrés. J'ai relu trois fois la même page. Je n'ai rien retenu. Ça ne m'arrive jamais."],
        4: ["Ils sont revenus. Les braises qu'on rapporte de là-bas font l'encre du récit spirituel. Ma mère vendait cette encre. Je ne m'étais jamais demandé d'où elle venait."]
    },
    triste: ["~Elle ne lit pas. Elle regarde la même ligne depuis longtemps.|Aujourd'hui, les chiffres ne tiennent pas. Ça arrive. Ça arrive aux autres. … Ça m'arrive. Reste. Ne dis rien. C'est un ordre. S'il te plaît."]
},

/* ── Mado (29:41) — 45 ans, la lavandière ─────────────────────────────────── */
'29:41': {
    voix: "Forte, franche, elle rit avant la fin de ses phrases. Elle tutoie tout le monde dès le premier mot. Elle parle avec les mains, et ses mains sont rouges.",
    oc: {
        vecu: "Née au village il y a quarante-cinq ans, l'aînée de six. Les années maigres du roi Thibaut, à seize ans, elle lavait le linge du manoir pour une miche par jour, et elle a appris à rire fort pour qu'on l'entende par-dessus les petits. Elle les a élevés ; ils sont partis à la ville. Elle est restée avec le linge.",
        savoir: "sait les secrets du linge (une tache dit tout), qui dort où, qui se blesse à quoi ; ignore les failles et la magie (« de l'eau et du savon, voilà ma Parole ») ; croit à tort que Fernand se trompe toujours"
    },
    premiere: "~Elle essore un drap à bout de bras, et l'eau gicle partout.|Ah, une nouvelle tête ! Mado. Je lave tout ! Le linge, les enfants, les menteurs. T'as une tache, là. Non, là. Je rigole.",
    discuter: [
        "Je lave le linge du manoir une fois par mois. Les nobles tachent leurs draps comme tout le monde. Crois-moi.",
        "Mon mari dit que je parle trop fort. Je lui ai répondu. Assez fort.",
        "Le savon, je le fais moi-même, avec de la cendre et de la graisse. Ça sent pas bon. Ça lave tout. Comme moi."
    ],
    fil: [
        "Fernand ? Je lui demande le temps tous les matins. Il fait le sourd. Je crie. Il fait encore le sourd. Après, il dit « pluie ». Et il pleut. Ce vieux grincheux a toujours raison. Je le déteste. Je l'adore.",
        { ami: 2, t: "J'étais l'aînée de six. Les années maigres, à seize ans, je lavais le linge du manoir pour une miche par jour. Six bouches.|Alors j'ai appris à rire fort : quand tu ris, les petits croient que ça va. Et des fois, à force, ça va." },
        { ami: 3, t: "Ils sont tous partis à la ville, mes frères et sœurs. Ils m'écrivent pour la Veillée. Je réponds avec Jehan, l'écrivain public du bar. Il fait des fautes exprès pour me faire rire. Je le sais. Je ris quand même." },
        { ami: 5, t: "Un drap, ça dit tout. Du vin : une fête. De la cire : quelqu'un qui lit la nuit. Du sang : je pose pas de questions, je frotte. Je garde les secrets du linge. Pas gratuitement. Mais je les garde." },
        { ami: 7, t: "Mon rêve ? Une lessiverie à moi. Avec un toit, pour pas pleurer sur un drap qui reprend la pluie. Et un écriteau : « ICI ON LAVE TOUT ». … Ris pas. Bon, ris. Moi je ris." },
        { ami: 9, gestes: [
            "~Elle s'arrête de frotter, les mains dans l'eau.",
            "Dis-moi franchement. Ceux qui partent dans la grotte, s'ils reviennent pleins de boue, qui va laver tout ça ?",
            ['choix', ["Toi. Et ils paieront bien.", "Personne ne lave mieux que toi."], [
                [['retiens', 'lessive', 'argent'], "~Elle éclate de rire et éclabousse tout.", "Payer ! Ha ! … Payer. Une lessiverie avec un toit. Tu viens de me mettre une idée dans la tête, et elle va plus en sortir.", ['ami', 1]],
                [['retiens', 'lessive', 'fierte'], "~Elle rougit, fort, d'un coup.", "Personne, hein ? … Va, va. Tu vas me faire pleurer dans mon eau propre.", ['ami', 1]]]]
        ] }
    ],
    souvenirs: [
        { cle: 'lessive', val: 'argent', lignes: ["J'ai fait mes comptes ! Si la moitié de ceux qui entrent ressort crottée, j'ai un toit avant l'hiver. Ha !"] },
        { cle: 'lessive', val: 'fierte', lignes: ["Personne lave mieux que moi. Je l'ai dit à Mireille. Elle l'a répété à tout le village. Pour une fois qu'elle répète un truc vrai."] }
    ],
    ragots: [
        { de: '29:29', cle: 'ciel', val: 'grotte', lignes: ["Fernand m'a dit que ses chagrins du matin, c'est la grotte, pas lui. Il paraît que c'est toi qui lui as dit ça. Il chante, depuis. Faux. Mais il chante."] },
        { de: '29:28', cadeau: true, lignes: ["Il paraît que t'as fait un cadeau à Hilde ! Elle a ri toute seule en rangeant ses bougies. Moi, je l'ai vue. Moi, je vois tout."] }
    ],
    nouvelles: [
        "La Chancellerie a envoyé un monsieur avec une baguette qui bourdonne. Il a bourdonné devant mon baquet. Mon baquet ! Je lui ai dit : c'est de l'eau sale, monsieur, c'est pas une faille.",
        "Les draps que j'étends côté forêt sentent la pluie, même quand il fait beau. Fernand dit que c'est le vent de la grotte. Moi je dis que c'est le marécage. On a sûrement raison tous les deux."
    ],
    etapes: {
        0: ["Une faille ! Chez nous ! Le jour où ça s'est su, j'ai lavé tout le linge du village deux fois. Quand j'ai peur, je frotte."],
        1: ["La garde royale m'a donné ses chemises à laver. Bien coupées. Bien tachées. Les soldats du roi suent comme tout le monde."],
        2: ["Des aventuriers plein le village ! Ils paient d'avance et ils déchirent tout. J'adore les gens qui déchirent tout."],
        3: ["Ils sont entrés ce matin. J'ai pas frotté. J'ai attendu. C'est la première fois de ma vie que je reste les mains sèches."],
        4: ["Ils sont revenus ! Avec une boue grise qui sent la pluie et qui part pas. Elle part pas ! Trois jours que je frotte. Je l'aurai."]
    },
    triste: ["~Elle étend un drap blanc et le regarde longtemps, sans rire.|Ma mère pliait les draps comme ça. En trois. Je l'avais oublié, et ce matin, ça m'est revenu. … C'est la grotte, ils disent. Elle remue la vase. Allez. Aide-moi à plier."]
},

/* ── Pépin (29:42) — 66 ans, les pierres de la ville ─────────────────────── */
'29:42': {
    voix: "Doux, ironique, jamais plaintif. Il parle des pierres comme de vieux amis. Il remercie pour tout, même pour un refus.",
    oc: {
        vecu: "Né au village il y a soixante-six ans. Trente ans carrier : la moitié des pierres de la ville, et les bornes de la route royale quand le roi Lothaire a fait refaire les routes. Ses mains ont dit non il y a cinq hivers. Il vit de petits riens, et il en est fier.",
        savoir: "sait chaque pierre de la ville, qui l'a taillée et quand, la route royale borne par borne ; ignore tout ce qui ne se taille pas ; croit à tort que personne ne l'a vu saluer les murs",
        caractere: "humble, ironique, sans apitoiement ; trente ans à tailler la pierre, et des histoires plein les poches"
    },
    perso: null,
    premiere: "~Il ôte un chapeau qui n'a plus vraiment de forme.|Pépin. Je mendie un peu, je raconte beaucoup. Les deux sont gratuits, et ça vaut à peu près pareil.",
    discuter: [
        "Ce mur-là, je l'ai monté à vingt ans. Il est plus droit que moi. C'est normal : lui, il a pas porté de pierres.",
        "Berthe me garde du pain. Je lui garde des histoires. On ne sait plus qui doit à qui. C'est la meilleure façon d'être amis.",
        "On me donne une pièce, je dis merci. On me donne rien, je dis merci quand même. Ça les fait réfléchir. C'est mon seul impôt."
    ],
    fil: [
        "Tu vois la fontaine ? La margelle, c'est moi. Il y a une fêlure à gauche. Elle était là avant moi. Je l'ai gardée. Une pierre sans fêlure, ça n'a rien à raconter.",
        { ami: 2, t: "Du temps du roi Thibaut, la carrière payait en grain. Quand le grain venait pas, on taillait quand même. On se disait : une pierre bien taillée, ça dure plus longtemps qu'un roi. On avait raison. Regarde." },
        { ami: 3, t: "Après la révolution, le roi Lothaire a fait refaire les routes. Les bornes de la route royale, jusqu'au deuxième relais, c'est moi. Deux cent onze bornes. Quand je marchais jusqu'à la ville, je leur disais bonjour. À toutes." },
        { ami: 5, t: "Mes mains ont dit non, il y a cinq hivers. D'abord la gauche, puis la droite, par solidarité. Je leur en veux pas. Elles ont assez travaillé. Maintenant, c'est moi qui les porte." },
        { ami: 7, t: "La grotte, je l'ai sondée, jeune, pour voir si la pierre valait quelque chose. Elle valait rien. Une pierre tendre, qui pleure quand il fait humide.|Elle pleurait déjà, tu vois. Bien avant la faille." },
        { ami: 9, gestes: [
            "J'ai un dernier rêve. Tailler une pierre, une belle, pour la fontaine. Mes mains ne veulent plus.",
            "~Il regarde tes mains, longtemps.",
            "Toi, tu as des mains. Tu me prêterais les tiennes, un jour ? Je dirais où frapper.",
            ['choix', ["Un jour, oui.", "Tes mains savent encore. Je tiendrai l'outil."], [
                [['retiens', 'pierre', 'oui'], "Un jour. C'est un bon jour, un jour. Il arrive toujours, à condition de pas le presser.", ['ami', 1]],
                [['retiens', 'pierre', 'outil'], "~Il rit, doucement, et ses yeux brillent.", "Tu tiendras l'outil… Alors je taillerai encore une fois. Avec tes mains et ma tête. Une pierre à deux. C'est les meilleures.", ['ami', 1]]]]
        ] }
    ],
    souvenirs: [
        { cle: 'pierre', val: 'outil', lignes: ["J'ai trouvé la pierre. Elle attend derrière la fontaine. Elle est patiente. Moi aussi, maintenant."] }
    ],
    nouvelles: [
        "Ceux qui vont vers la grotte me donnent plus qu'avant. On donne beaucoup, quand on a peur. Je suis pas fier de m'en réjouir. Je m'en réjouis un peu.",
        "J'ai montré à un aventurier où passer pour pas piétiner le champ de Fernand. Il m'a donné une pièce. Fernand m'en doit la moitié."
    ],
    etapes: {
        0: ["Une porte dans la grotte. J'ai taillé dans cette colline toute ma vie. Elle m'avait jamais dit qu'elle avait une porte."],
        1: ["La garde royale monte la route. Ils marchent sur mes bornes. Je leur ai pas dit. Ça me fait plaisir quand même."],
        2: ["Beaucoup de monde, beaucoup de pas sur mes pavés. Les pavés tiendront. Je les ai bien faits."],
        3: ["Ils sont entrés. J'ai tapoté la margelle de la fontaine. Pour la chance. Ça marche pas, mais ça fait du bien à l'épaule."],
        4: ["Ils sont revenus. Ce jour-là, j'ai pas tendu la main. On mendie pas à des gens qui reviennent de si loin."]
    },
    triste: ["~Il a la main posée à plat sur un mur, les yeux fermés.|Les pierres se souviennent pas. Moi si. C'est ça, le problème, les jours comme aujourd'hui. … Va. Je te dirai merci demain. Deux fois."]
},

/* ── Mathurin (29:53) — 50 ans, le crieur, venu d'Ostrevent ──────────────── */
'29:53': {
    voix: "Tonitruant, théâtral, des « OYEZ » et des majuscules ; mais quand il parle de lui, il baisse la voix, et c'est là qu'on l'écoute vraiment.",
    annonceAnniversaires: false,                 // JOKO, 2026-11-09 : le crieur sans les anniversaires (voulu)
    oc: {
        vecu: "Né il y a cinquante ans à Ostrel, l'ancienne capitale d'Ostrevent. Il y était cordonnier. La nuit de la Grande Chute, il y a douze ans, personne n'a crié l'alerte à temps dans sa rue. Réfugié, arrivé au village avec un sac et un chat. Depuis, il crie les nouvelles : que personne ici ne soit jamais pris sans savoir.",
        savoir: "sait ce qu'est une Chute vue de l'intérieur (il ne le raconte presque jamais), les avis de la Chancellerie mot pour mot, la route d'Ostrevent ; ignore ce que devient Nouvel-Ostrel ; croit à tort qu'on oublie, avec le temps",
        caractere: "tonitruant, théâtral, ne sait pas parler bas en public ; annonce tout, surtout ce qui pourrait sauver quelqu'un"
    },
    premiere: "~Il agite sa cloche juste à côté de ton oreille.|OYEZ, OYEZ ! Un nouveau visage dans la grand-rue ! C'est noté ! … Mathurin, crieur. Je crie, tu écoutes, et tout le monde est content.",
    discuter: [
        "OYEZ ! La boulangère a brûlé ses pains de six heures ! … Ce n'est pas une grande nouvelle. Mais quelqu'un devait le dire.",
        "Mon chat s'appelle Avis. C'est le seul qui m'écoute jusqu'au bout. Il n'a pas le choix : il dort.",
        "Je crie l'heure, le temps, les objets perdus, les mariages, les avis de la Chancellerie. Les gens disent que je crie trop. Les gens n'ont jamais manqué une nouvelle."
    ],
    fil: [
        "OYEZ ! … Non. À toi, je vais le dire normalement. Les gens croient que je ne sais pas parler bas. Je sais. Je ne veux pas, c'est tout.",
        { ami: 2, t: "Je ne suis pas d'ici, tu sais. Ça s'entend, à certains mots. Je suis d'Ostrel. L'ancienne capitale d'Ostrevent. J'étais cordonnier. Des bottes qui ne prenaient pas l'eau. Les meilleures de la rue, à ce qu'on disait." },
        { ami: 3, t: "~Il pose sa cloche. Il ne la pose jamais.|Il y a douze ans, la Grande Chute. Dans ma rue, personne n'a crié. On a su trop tard, tous ensemble, par le bruit.|Je ne te raconte pas la suite. La suite, c'est un sac, un chat, et une route." },
        { ami: 5, t: "Quand je suis arrivé ici, la ville m'a donné ce réverbère, et une cloche dont personne ne voulait. Fernand m'a dit : « Ici, on crie quand il y a quelque chose à dire. » J'ai répondu : « Alors il y aura toujours quelque chose à dire. » Il a dit « hein ? ». On est amis depuis." },
        { ami: 7, t: "Le soir, je parle tout bas à Avis. C'est le seul à qui je dis les nouvelles d'Ostrevent, celles que je ne crie pas. Les cousins qui écrivent de Nouvel-Ostrel. Les noms de ma rue. Lui, il ronronne. C'est une bonne réponse." },
        { ami: 9, gestes: [
            "Depuis la faille, je crie plus fort. Les gens trouvent ça agaçant. Je le sais.",
            "Dis-moi. Je dois crier moins fort, ou plus fort ?",
            ['choix', ["Plus fort. Qu'ils sachent.", "Moins fort. Ils t'écoutent déjà."], [
                [['retiens', 'crier', 'fort'], "~Il reprend sa cloche, très doucement.", "Plus fort. … Merci. Personne ne m'avait jamais dit ça. Ils disaient tous « plus bas ».", ['ami', 1]],
                [['retiens', 'crier', 'doux'], "~Il te regarde, surpris, puis sourit sous sa moustache.", "Ils m'écoutent déjà… Peut-être bien. Je vais essayer un OYEZ un peu moins grand. Pour voir. Juste un.", ['ami', 1]]]]
        ] }
    ],
    souvenirs: [
        { cle: 'crier', val: 'fort', lignes: ["~Il te fait un clin d'œil, puis il sonne sa cloche de toutes ses forces, pour toi.|OYEZ ! … Celui-là, c'était pour toi."] },
        { cle: 'crier', val: 'doux', lignes: ["J'ai fait un OYEZ moyen, ce matin. Personne n'a râlé. Deux personnes se sont arrêtées. Ça marche, ton truc."] }
    ],
    ragots: [
        { de: '29:29', cle: 'ciel', val: 'encore', lignes: ["OYEZ ! Fernand l'a encore ! Le ciel ! Il me l'a fait crier ce matin ! … Il paraît que c'est toi qui le lui as dit. Bien. Une nouvelle qui méritait la cloche."] }
    ],
    nouvelles: [
        "Avis de la Chancellerie, je te le récite : « Défense d'approcher de la grotte sans permis. Tout signe étrange se déclare. » Les signes étranges, je les crie aussi. Gratuitement.",
        "On m'a demandé de crier les recrutements des guildes. J'ai crié la Veilleuse plus fort que les autres. Ils ramènent leurs gens. Ça compte, pour moi."
    ],
    etapes: {
        0: ["OYEZ ! « Par décision de la Chancellerie des Failles, la grotte est déclarée faille de niveau un ! » … Je l'ai crié cent fois. Ma voix tremblait, la première. Personne n'a remarqué. Tant mieux."],
        1: ["OYEZ ! La garde royale s'installe ! Les deux règles de la Chute sont affichées au poste ! … Elles sont vraies, les deux. Je le sais mieux que personne."],
        2: ["OYEZ ! Les guildes recrutent sur la place ! Les francs-lames, voyez le tableau ! … J'ai jamais autant crié. Je dors comme une pierre."],
        3: ["OYEZ ! Ils sont entrés ! … Ce jour-là, j'ai crié l'heure toutes les heures. Pour que quelqu'un, quelque part, sache toujours quelle heure il est."],
        4: ["OYEZ, OYEZ ! ILS SONT REVENUS !|~Il sonne sa cloche jusqu'à ce que toute la grand-rue se retourne. Il pleure un peu, sans se cacher."]
    },
    triste: ["~Il tient sa cloche sans la sonner.|Pas de nouvelles aujourd'hui. … Si. Une. Il pleut peut-être à Ostrel. Je ne sais pas pourquoi j'y pense. La grotte, sans doute. Elle a une voix de pluie."],
    aurevoir: ["Va ! Et si tu vois quelque chose, tu me le dis. Je le crierai.", "Au revoir ! … Pardon. Au revoir. Comme ça. Normalement."]
},

/* ── Brunehaut (29:11) — 38 ans, la porte nord et la lanterne ────────────── */
'29:11': {
    voix: "Sèche, des phrases courtes comme des consignes ; elle compte à voix basse au milieu. Le sarcasme d'abord, la tendresse ensuite, jamais dans la même phrase.",
    oc: {
        vecu: "Née au village il y a trente-huit ans, fille du garde de la porte nord. Pendant les années maigres du roi Thibaut, son père gardait une lanterne allumée pour ceux qui marchaient la nuit vers la ville, à la recherche de pain. Elle a pris sa porte, et sa lanterne.",
        savoir: "sait qui entre, qui sort et combien, les deux règles de la Chute, reconnaître un menteur à sa démarche ; ignore la Parole, les guildes (« des fanions ») ; croit à tort qu'Oswin ne l'admire pas"
    },
    perso: null,
    discuter: [
        "Tu restes planté là ? … Bien. Je te compte.",
        "Les voyageurs qui ne disent pas bonjour, je les compte deux fois. Pour me venger. Ça ne sert à rien. Ça me fait du bien.",
        "Oswin s'est endormi debout, cette nuit. Debout ! Il ne sait rien faire, mais ça, il le fait bien."
    ],
    fil: [
        "Je compte ceux qui sortent et ceux qui rentrent. Le soir, il faut que ça tombe juste. Quand ça tombe juste, je dors. … Tu fais partie du compte, maintenant. Rentre avant la nuit, que je dorme.",
        { ami: 2, t: "Mon père gardait cette porte avant moi. Les années maigres, du temps du roi Thibaut, des gens marchaient la nuit vers la ville pour du pain. Il gardait une lanterne allumée. « Pour ceux qui cherchent la porte », il disait." },
        { ami: 3, t: "La lanterne à la fenêtre de la caserne, c'est la sienne. Elle brûle toute la nuit. Plus personne ne cherche de pain. Je la laisse quand même. On ne sait jamais qui cherche une porte." },
        { ami: 5, t: "Oswin croit que je le surveille parce qu'il dort. Je le surveille parce qu'il a vingt ans et qu'il veut être ailleurs. À vingt ans, je voulais être ailleurs. Mon père m'a surveillée. Ça a marché : je suis ici." },
        { ami: 7, t: "Depuis la grotte, il y a des nuits où le compte tombe juste, et où je ne dors pas quand même. Je me réveille avec une tristesse qui n'a rien à faire là. Je la compte aussi. Une. Elle repart au matin." },
        { ami: 9, gestes: [
            "~Elle regarde la lanterne de la caserne, au loin.",
            "Toi. Quand tu partiras dans la grotte. Tu veux que je la laisse allumée ?",
            ['choix', ["Oui. Laisse-la.", "Non. Dors, pour une fois."], [
                [['retiens', 'lanterne', 'allumee'], "Bien. … Je dirai à Oswin de remettre de l'huile. Il va râler. Il le fera.", ['ami', 1]],
                [['retiens', 'lanterne', 'dors'], "~Elle te dévisage, puis elle a un petit rire, très bref.", "Dormir. … Mon père n'y est jamais arrivé. Je vais peut-être essayer. Une nuit. Pour voir comment c'est.", ['ami', 1]]]]
        ] }
    ],
    souvenirs: [
        { cle: 'lanterne', val: 'allumee', lignes: ["Elle est allumée. Tu peux vérifier. … Ne vérifie pas. Je l'ai dit, elle est allumée."] },
        { cle: 'lanterne', val: 'dors', lignes: ["J'ai dormi. Toute une nuit. Oswin a tenu la porte. Il n'a rien cassé. On verra pour la deuxième nuit."] }
    ],
    nouvelles: [
        "Il passe plus de monde par ma porte en un jour qu'en un mois. Des étrangers, des recrues, des colporteurs. Je n'arrive plus à finir le compte, le soir. Ça m'énerve. Je ne dors pas.",
        "Un évaluateur de la Chancellerie a voulu passer sans montrer ses papiers. Je l'ai arrêté. Il était vexé. Ses papiers étaient en règle. J'étais contente quand même."
    ],
    etapes: {
        0: ["Une faille, à quelques heures de ma porte. Mon père gardait cette porte contre la faim. Moi, je vais la garder contre quoi ?"],
        1: ["La garde royale s'installe. Ils m'ont expliqué les deux règles de la Chute. Je les connaissais. Je les ai écoutées quand même. Ça leur faisait plaisir."],
        2: ["Cinquante-trois entrées aujourd'hui. Cinquante-trois ! Le compte ne tombe plus jamais juste. Je vais devoir apprendre à dormir quand même."],
        3: ["Ils sont entrés. J'ai noté le nombre. Je le relis toutes les heures."],
        4: ["Ils sont revenus. J'ai recompté. Je ne te dis pas le chiffre. Je te dis seulement que cette nuit, je vais dormir. Un peu."]
    },
    triste: ["~Elle compte les passants à voix basse, et s'arrête au milieu.|Je ne sais plus où j'en suis. Ça ne m'arrive jamais. … C'est la grotte. Elle me fait perdre le compte. Reste à côté, que j'aie quelqu'un à compter."],
    aurevoir: ["Avant la nuit.", "Je te compte. Rentre."]
},

/* ── Oswin (29:12) — 20 ans, la porte nord, le manoir ────────────────────── */
'29:12': {
    voix: "Las, traînant, il soupire au milieu des phrases ; il s'emballe d'un coup quand il parle du manoir ou de la garde royale, puis se reprend, gêné.",
    oc: {
        vecu: "Né il y a vingt ans au village, juste avant la révolution : il n'a connu que la paix. Entré dans la garde de la ville parce que son oncle y était. Il s'ennuyait depuis deux ans ; depuis la faille, il ne s'ennuie plus, et il a découvert qu'il préférait s'ennuyer.",
        savoir: "sait les rumeurs du manoir, les uniformes, les grades ; ignore ce qu'est une vraie Chute (il croit que c'est comme dans les chansons) ; croit à tort que Brunehaut le méprise"
    },
    discuter: [
        "Au manoir, les gardes mangent de la viande tous les jours. Ici, on mange de la poussière.",
        "J'ai compté les pavés de la porte. Cent quarante-deux. Hier, j'en comptais cent quarante et un. Je crois que je deviens fou.",
        "~Il redresse son casque, qui retombe aussitôt.|Il est trop grand. Le casque. Pas moi. Enfin, moi aussi, peut-être.",
        "La relève apporte du pain chaud à six heures. C'est le meilleur moment de la garde. Le deuxième meilleur, c'est la relève elle-même."
    ],
    fil: [
        "Il ne se passe jamais rien ici. … Enfin, il ne se passait jamais rien. Maintenant il se passe des choses, et je regrette un peu le rien.",
        { ami: 2, t: "Je suis entré dans la garde parce que mon oncle y était. Il disait : « C'est tranquille, petit. » Il est mort de vieillesse, dans son lit, à quatre-vingts ans. C'était vrai, que c'était tranquille." },
        { ami: 3, t: "Les nuits de garde, Mathis me montre les étoiles. Il leur donne des noms. Il y en a une qui s'appelle Oswin. Elle est petite et elle clignote. Il dit que c'est un hasard." },
        { ami: 5, t: "Béran m'a montré comment on tient une lance quand on a peur. Comme d'habitude, en fait. Il n'y a pas d'autre façon. J'étais un peu déçu. Et un peu rassuré." },
        { ami: 7, t: "Brunehaut me secoue tout le temps. Mais l'hiver dernier, j'ai eu la fièvre, et elle a fait mes gardes trois nuits de suite. Elle a dit qu'elle n'avait rien d'autre à faire. Elle a toujours quelque chose d'autre à faire." },
        { ami: 9, gestes: [
            "Dis… Tu crois que je suis fait pour la garde, ou pour le manoir ?",
            ['choix', ["Pour la garde. Tu tiens ta porte.", "Pour le manoir. Va saluer."], [
                [['retiens', 'oswin', 'garde'], "~Il redresse son casque. Pour une fois, il ne retombe pas.", "Je tiens ma porte. … Je tiens ma porte. Je vais le dire à Brunehaut. Non. Je vais juste la tenir.", ['ami', 1]],
                [['retiens', 'oswin', 'manoir'], "~Il rougit jusque sous son casque.", "Saluer… Je vais réécrire au majordome, Anatole. Il va me trouver ridicule. Tant pis. J'aurai essayé.", ['ami', 1]]]]
        ] }
    ],
    ragots: [
        { de: '29:11', cle: 'lanterne', val: 'dors', lignes: ["Brunehaut m'a laissé tenir la porte seul, toute une nuit ! Elle a dit « tu n'as rien cassé ». … C'est le plus beau compliment de ma vie. Il paraît que c'est toi qui lui as dit de dormir. Merci."] }
    ],
    nouvelles: [
        "La garde royale recrute parmi les meilleurs élèves de l'Académie, il paraît. Moi, je ne suis pas élève. Je suis Oswin. Ce n'est pas pareil.",
        "Les gens du manoir demandent si la faille va gâcher leur saison des bals. Moi aussi, je m'inquiète un peu. Je voulais y aller, une fois, à un bal."
    ],
    etapes: {
        0: ["Une faille ! Ici ! … Je l'ai dit cent fois, qu'il ne se passait jamais rien. Je ne le dirai plus."],
        1: ["La garde royale est là. Des uniformes impeccables. Je redresse mon casque toutes les minutes. Il retombe toutes les minutes."],
        2: ["Un franc-lame m'a demandé le chemin. Je lui ai montré le mauvais. Puis j'ai couru le rattraper. On a ri. Il m'a donné une pièce."],
        3: ["Ils sont entrés. Je n'ai pas dormi de la nuit. Pour une fois, ce n'était pas l'ennui."],
        4: ["Ils sont revenus ! J'ai salué. Le salut du manoir. Personne n'a compris. Je m'en fiche, c'était un beau salut."]
    },
    triste: ["~Il regarde ses bottes.|Je pense à mon oncle, aujourd'hui. Pour rien. « C'est tranquille, petit. » … La grotte rend les gens bizarres, dit Brunehaut. Je suis bizarre, aujourd'hui."],
    aurevoir: ["Bonne… bonne route. C'est comme ça qu'on dit au manoir, je crois.", "Je ne bouge pas. Enfin, je ne peux pas bouger. C'est mon travail."]
},

/* ── Mathis (29:33) — 27 ans, le guetteur ────────────────────────────────── */
'29:33': {
    voix: "Rêveur, lent ; il s'interrompt pour montrer le ciel, et parle des gens d'en bas comme d'étoiles. Il demande aux autres ce qu'ils voient, eux.",
    oc: {
        vecu: "Né il y a vingt-sept ans au village. Tout petit, à la fin des années maigres, il montait sur les toits pour ne plus sentir sa faim : là-haut, on regarde, on oublie le ventre. Il n'est jamais vraiment redescendu : il est guetteur.",
        savoir: "sait les étoiles (avec les noms qu'il leur donne), les oiseaux, tout ce qui bouge sur la route avant tout le monde ; ignore ce qui se passe en bas, dans les maisons ; croit à tort que personne ne monte le voir parce qu'on ne l'aime pas"
    },
    discuter: [
        "Le soir, les lanternes s'allument une à une. D'en haut, on dirait que la ville respire.",
        "Les nuages qui viennent du nord, gris-jaune : il neige le lendemain. Je ne me suis jamais trompé. Presque.",
        "Le brouillard, je déteste. On ne voit rien. Dans le brouillard, je deviens une oreille. Je suis une mauvaise oreille."
    ],
    fil: [
        "Regarde, là-haut. Non, plus à gauche. Cette étoile-là n'avait pas de nom. Maintenant elle s'appelle Berthe. Parce qu'elle est ronde et qu'elle réchauffe. Berthe ne le sait pas.",
        { ami: 2, t: "Je vois tout arriver avant tout le monde. Les orages, les charrettes, les ennuis. Je les vois, et après je dois attendre qu'ils arrivent. C'est le plus dur, dans mon métier : attendre ce qu'on voit déjà." },
        { ami: 3, t: "Tout petit, à la fin des années maigres, j'avais faim. Je montais sur les toits. Là-haut, on regarde, et on oublie son ventre. Je crois que je ne suis jamais vraiment redescendu." },
        { ami: 5, t: "La nuit où la grotte s'est ouverte, les oiseaux se sont tus. Tous. Même les chouettes. J'ai attendu le matin en me demandant si j'étais devenu sourd. Non. C'était le monde qui écoutait quelque chose." },
        { ami: 7, t: "J'ai donné une étoile à chaque personne du village. Il y a une étoile Brunehaut, une étoile Oswin… Il y en a une pour toi aussi. Je ne te dirai pas laquelle. Il faut que tu la cherches." },
        { ami: 9, gestes: [
            "Personne ne monte jamais me voir, ici. Je crois que c'est la hauteur. Ou moi.",
            ['choix', ["C'est la hauteur.", "Je monterai, moi."], [
                [['retiens', 'monter', 'hauteur'], "~Il rit, soulagé.", "La hauteur ! Bien sûr. Je vais leur faire une échelle plus douce. Ou un panier, avec une corde. Hilde vend des cordes.", ['ami', 1]],
                [['retiens', 'monter', 'oui'], "~Il te regarde, puis regarde le ciel, très vite, comme pour cacher ses yeux.", "Tu monteras. … Alors je te montrerai ton étoile. Elle est à gauche de celle de Berthe. Zut. Je viens de te le dire.", ['ami', 1]]]]
        ] }
    ],
    souvenirs: [
        { cle: 'monter', val: 'oui', lignes: ["Tu vas monter, alors. Je garde une place, en haut. À gauche de Berthe."] }
    ],
    nouvelles: [
        "De là-haut, on voit le marécage, puis la forêt, puis la tache sombre de la grotte. Avant, je ne la regardais jamais. Maintenant, je ne regarde plus qu'elle.",
        "Les oiseaux migrateurs font un détour au-dessus de la grotte. Un grand détour. Fernand dit que c'est l'hiver. Moi je crois qu'ils entendent quelque chose qu'on n'entend pas."
    ],
    etapes: {
        0: ["Je l'ai vue, la nuit où elle s'est ouverte. Une lueur, entre les arbres, au-dessus du marécage. J'ai cru à une étoile filante tombée dans la grotte. Je n'ai rien dit. Qui m'aurait cru ?"],
        1: ["Il y a une lumière, le soir, près de la grotte, maintenant. Le poste de la garde royale. On dirait une étoile qui ne sait pas remonter. Je l'ai appelée « la Patiente »."],
        2: ["Je vois les recrues arriver par la route. Des files de petits points. Chaque point, c'est quelqu'un qui a dit au revoir à quelqu'un. D'ici, ça fait beaucoup d'au revoir."],
        3: ["Ils sont entrés. D'ici, je n'ai rien vu. La grotte les a pris, c'est tout. Je n'aime pas quand je ne vois pas."],
        4: ["Je les ai vus revenir avant tout le monde ! Des petits points sur le chemin ! J'ai crié. Personne n'a entendu, c'est trop haut. Alors j'ai crié pour moi."]
    },
    triste: ["~Il ne regarde pas le ciel. Il regarde ses mains.|Aujourd'hui je n'arrive pas à lever la tête. Elle est lourde. Comme si quelqu'un, très loin, pleurait par-dessus mon épaule. … Ça passera. Le ciel attend. Il est patient."]
},

/* ── Rolf (29:34) — 33 ans, la porte sud, la faim d'avant ────────────────── */
'29:34': {
    voix: "Jovial, une voix de tonneau ; il parle la bouche pleine et rit de ses propres blagues. Il appelle tout le monde « l'ami ».",
    oc: {
        vecu: "Né il y a trente-trois ans au village. Il avait douze ans à la fin des années maigres du roi Thibaut : il se souvient de la faim, la vraie, celle qui empêche de dormir. Depuis la révolution, il mange. Il a toujours quelque chose dans la main. Ce n'est pas de la gourmandise. C'est de la mémoire.",
        savoir: "sait où manger à toute heure, voir tout de suite qui a faim, porter un enfant d'un seul bras ; ignore la peur des failles (« ça se mange, ce qui en sort ? ») ; croit à tort que personne n'a vu qu'il nourrit les chiens de la porte sud"
    },
    perso: null,
    discuter: [
        "Berthe me garde les fonds de marmite. C'est le meilleur de la marmite, les fonds. Les gens le savent pas. Tant mieux, ça en fait plus pour moi.",
        "~Il soulève un enfant qui passait, le pose sur ses épaules, et continue de parler.|Où j'en étais ? Ah oui. La tarte.",
        "Konrad m'a dit « oui » ce matin. Rien d'autre. Juste « oui ». Je me demande encore à quoi."
    ],
    fil: [
        "Tiens, une galette. J'en ai toujours une de trop. Prends ! … Tu prends pas ? Bon. Je la mange. Mais c'était à toi.",
        { ami: 2, t: "Konrad parle deux mots par jour. Moi, j'en parle deux mille. Ensemble, ça fait une moyenne correcte. C'est pour ça qu'on garde la même porte." },
        { ami: 3, t: "Tu veux savoir pourquoi je mange tout le temps ? … J'avais douze ans, les dernières années du roi Thibaut. On avait faim. Pas faim comme avant le dîner. Faim la nuit.|Depuis, si j'ai rien dans la main, ma main s'inquiète." },
        { ami: 5, t: "Les chiens de la porte sud, je leur donne mon pain. Personne le sait. … Tout le monde le sait ? Ah. Bon. C'est vrai qu'ils me suivent jusqu'au bar. C'est voyant." },
        { ami: 7, t: "Mon rêve, c'est un concours de mangeurs de tartes. Je gagnerais. Et avec le prix, je ferais une tarte pour chaque gamin du village. Comme ça, plus personne aurait faim la nuit. Même pour rire." },
        { ami: 9, gestes: [
            "~Il te tend la moitié de son pain, sans rien dire, pour une fois.",
            "Dis-moi. Si un jour ça sort de la grotte, et que ça a faim… on lui donne à manger, ou on se bat ?",
            ['choix', ["On donne à manger d'abord.", "On se bat. Tu tiens ta porte."], [
                [['retiens', 'faim', 'manger'], "~Il rit si fort que Konrad se retourne.", "Je savais que t'étais quelqu'un de bien ! On donne à manger d'abord. Après, on verra. Le ventre plein, tout le monde réfléchit mieux.", ['ami', 1]],
                [['retiens', 'faim', 'porte'], "~Il hoche la tête, sérieux, pour une fois.", "Je tiens ma porte. … Mais je garderai une galette dans la poche. Au cas où. On sait jamais, avec la faim.", ['ami', 1]]]]
        ] }
    ],
    nouvelles: [
        "Les aventuriers mangent comme des moineaux. Ils ont peur, ça coupe l'appétit. Moi la peur, ça me creuse. On est pas faits pareil.",
        "Berthe fait deux marmites, maintenant. Elle dit que les gens mangent plus quand ils ont peur. Moi je mange pareil. Je mange déjà le maximum."
    ],
    etapes: {
        0: ["Une faille, à ce qu'il paraît. Konrad a dit « hm ». J'ai dit « on mange quoi, ce soir ? ». Chacun fait comme il peut."],
        1: ["La garde royale est là ! Ils mangent des rations sèches devant leur poste. J'ai eu pitié. Je leur ai apporté du ragoût de Berthe. Ils m'aiment, maintenant."],
        2: ["Les francs-lames arrivent par ma porte. Je leur demande d'où ils viennent, et s'ils ont mangé. La moitié ment à la deuxième question."],
        3: ["Ils sont entrés. J'ai pas faim. … C'est la première fois de ma vie que je dis ça. Ça me fait peur."],
        4: ["Ils sont revenus ! On mange ! Tout le monde ! J'invite ! … Enfin, Berthe invite. Moi je goûte."]
    },
    triste: ["~Il tient une galette dans la main, sans la manger.|J'ai pas faim, aujourd'hui. Ça me rappelle l'autre faim. Celle de petit. Elles se ressemblent, à l'envers. … La grotte, dit Konrad. Il a dit trois mots aujourd'hui, pour me dire ça."],
    aurevoir: ["Mange quelque chose, l'ami !", "File, et reviens avec l'appétit !"]
},

/* ── Konrad (29:35) — 45 ans, la porte sud, les animaux de bois ──────────── */
'29:35': {
    voix: "Deux mots par phrase, rarement trois. Puis, une fois de temps en temps, une phrase entière, longue, sortie d'un coup, et il se tait pour le reste de la journée.",
    oc: {
        vecu: "Né il y a quarante-cinq ans, fils d'un tailleur de cuillères. Pendant les années maigres du roi Thibaut, son père taillait des cuillères contre du pain ; il a appris en le regardant. Il avait vingt-quatre ans à la révolution : il était sur la place quand la nouvelle est arrivée.",
        savoir: "sait le bois, le silence, ce qui se passe la nuit à la porte sud ; ignore ce que les autres pensent de lui ; croit à tort que les enfants ne savent pas d'où viennent les animaux de bois sur leurs fenêtres"
    },
    perso: null,
    discuter: ["Hm.", "~Il hoche la tête, lentement, sans rien dire.", "Le vent siffle. N'aime pas.", "Rolf parle. Moi, je regarde. Ça marche."],
    fil: [
        "… Oui. Bonjour.",
        { ami: 2, t: "~Il sort un petit morceau de bois de sa poche, et le tourne entre ses doigts.|Mon père. Des cuillères. Les années maigres. Une cuillère, une miche. J'ai regardé. J'ai appris." },
        { ami: 3, t: "~Il pose un petit renard de bois dans ta main, puis le reprend.|Pas fini. … Bientôt." },
        { ami: 5, t: "Les animaux sur les fenêtres. … Les enfants dorment mal. Depuis la grotte. Un hibou, ça veille. Voilà." },
        { ami: 7, t: "La révolution. J'avais vingt-quatre ans. J'étais sur la place quand la nouvelle est arrivée : le roi Thibaut n'était plus roi. Personne n'a crié. On s'est regardés. Puis un vieux a dit : « Alors on mange, l'hiver prochain ? » Et tout le monde a pleuré. … Voilà. C'est dit." },
        { ami: 9, gestes: [
            "~Il te tend un couteau à bois, et un petit morceau de tilleul.",
            "Essaie.",
            "~Tu tailles. Ça ne ressemble à rien.",
            "… C'est quoi ?",
            ['choix', ["Un renard.", "Je ne sais pas encore."], [
                [['retiens', 'bois', 'renard'], "~Il regarde le morceau, longtemps, très sérieusement.", "Hm. … Oui. Un renard. Un renard qui a eu une dure journée.", ['ami', 1]],
                [['retiens', 'bois', 'attendre'], "~Il sourit. C'est la première fois que tu le vois sourire.", "Bien. Le bois sait. Toi, tu écoutes. C'est le début.", ['ami', 1]]]]
        ] }
    ],
    nouvelles: ["Grotte. Pas aimé. Le bruit, la nuit. Comme de l'eau.", "Rolf mange plus. Il a peur. Moi, je taille plus. Pareil."],
    etapes: {
        0: ["Faille. … Les enfants dorment mal. Je taille plus de hiboux."],
        1: ["Garde royale. Bien tenue. Hm."],
        2: ["Trop de monde. Pas assez de silence."],
        3: ["Entrés. … Je taille un hibou. Pour leur retour."],
        4: ["~Il pose un petit hibou de bois sur le muret, sans un mot, et retourne à sa porte."]
    },
    triste: ["~Il ne taille pas. Le couteau est posé à côté de lui.|… Mon père. Aujourd'hui. Sais pas pourquoi. … Assieds-toi. Pas besoin de parler."],
    aurevoir: ["Va.", "~Il lève la main. C'est un au revoir."]
}

};


/* ── leurs mots à eux, partout : la météo, l'accueil des gardes, leurs saisons, une blessure ─────────────
 * (avant, tous les gardes disaient « Relève du matin. Café froid, pieds gelés. », et toute la ville
 * « Encore la pluie. Les rues se changent en ruisseaux » : la flèche dans le genou de Skyrim) */
var PLUS = {
    '29:29': { meteo: {
        orage: ["Je l'avais dit, l'orage. Hier soir. À Mado. Elle a ri. Elle rit moins, là."],
        tempete: ["Ce vent-là, il arrache les tuiles et les mauvaises idées. Les tuiles, on les remet."],
        pluie: ["Pluie. Je l'avais pas dit, celle-là. … Si, je l'avais dit. Personne m'écoute, c'est tout."],
        neige: ["La neige, c'est la terre qui dort. Laisse-la dormir. Marche doucement."],
        brouillard: ["Le brouillard, c'est le ciel qui descend voir comment on va. Il est poli. Il reste pas."] } },
    '29:26': { meteo: {
        orage: ["Je compte entre l'éclair et le tonnerre. Quatre. Fernand dit que ça veut dire loin. J'espère qu'il a raison."],
        tempete: ["Le vent fait un bruit de quelqu'un qui appelle. Ce n'est personne. J'ai vérifié deux fois."],
        pluie: ["Il pleut. Élise est sortie quand même. Je l'attends derrière la porte. Avec une serviette."],
        neige: ["J'ai compté les flocons sur ma manche. J'en suis à quarante. Ils fondent avant que j'aie fini."],
        brouillard: ["Je ne vois pas Élise. Je ne vois pas Élise. … Ah. Si. Bon."] } },
    '29:25': { meteo: {
        orage: ["L'ORAGE ! T'as vu l'éclair ? Il était rose ! Bon, blanc. Mais un peu rose !"],
        tempete: ["Le vent il m'a presque fait voler ! Presque ! Si je mets une cape, je vole, tu crois ?"],
        pluie: ["La pluie c'est trop bien, toutes les flaques deviennent des lacs. Des lacs ! Comme dans mon rêve."],
        neige: ["J'ai fait une aventurière en neige. Avec une épée. Tomas a fait un bonhomme avec un bonnet. Évidemment."],
        brouillard: ["Dans le brouillard on dirait qu'on est dans une faille ! Bouh ! … T'as eu peur ? Un peu ?"] } },
    '29:28': { meteo: {
        orage: ["L'orage ! Où sont les petits ? Un, deux… Bon. Ils sont sous l'auvent. Bon."],
        tempete: ["Avec ce vent, l'enseigne de l'épicerie va finir chez Fernand. Il dira qu'il l'avait prévu."],
        pluie: ["La pluie : les enfants rentrent, la boutique se remplit de bottes mouillées. J'aime bien, au fond."],
        neige: ["La neige ! Des gants pour Tomas, des chaussettes pour Élise, et du temps pour moi. Il manque le temps."],
        brouillard: ["Par ce brouillard, je compte à voix haute. Si un enfant ne répond pas, je crie. Ils répondent toujours."] } },
    '29:40': { meteo: {
        orage: ["Orage. Rentre."],
        tempete: ["~Il vérifie les volets, un par un, sans un mot.|Tiendront."],
        pluie: ["Pluie. Cape au crochet. Prends-la. Rends-la."],
        neige: ["Neige. Soupe chaude. Assieds-toi."],
        brouillard: ["Brouillard. Reste près des murs."] } },
    '29:36': {
        bonjour: { 1: ["Ronde du matin. Les rues sont à moi jusqu'à ce que la boulangère ouvre."], 2: ["Midi. Je mange debout. Vieille habitude : on mangeait pas assis, là-bas."], 3: ["Le soir, je repasse devant chaque porte. Je sais qui est rentré. Je dis rien. Je sais."], 4: ["La nuit, c'est la ronde des vieux. On dort pas, alors on marche."] },
        saisons: { 1: ["Le printemps, je replante les tomates. Elles meurent. Je replante. On a ça en commun, elles et moi."], 2: ["L'été, l'armure, je la porte plus. Un vieux gilet suffit, pour une ronde sans histoire."], 3: ["L'automne, je taille des épées de bois pour l'hiver. Les gamins s'ennuient, l'hiver."], 4: ["L'hiver, ma main gauche gèle plus vite que la droite. Elle a moins de doigts à réchauffer, pourtant."] },
        blesse: ["T'as pris un coup. Assieds-toi là. Non, là. Je regarde. … Ça ira. J'en ai vu des pires. Sur moi."],
        meteo: {
            orage: ["Un orage, c'est rien. À la Marche, on aurait payé pour un orage. Ça couvre les autres bruits."],
            tempete: ["Tempête. Les jeunes se cachent. Les vieux aussi, mais ils appellent ça de l'expérience."],
            pluie: ["Ma main gauche me fait mal quand il pleut. Les doigts qui sont plus là. Ils ont de la mémoire, eux."],
            neige: ["La neige, c'est la seule chose qui rend une ronde silencieuse. J'aime ça. Ne le répète pas."],
            brouillard: ["Brouillard. Les jeunes voient des monstres partout. Moi, je vois Konrad. C'est pareil, de loin."] } },
    '29:11': {
        bonjour: { 1: ["Matin. Quatorze sortis, deux rentrés. Je compte."], 2: ["Midi. La porte est calme. Ne la dérange pas."], 3: ["Le soir. Il faut que ça tombe juste. Ne m'embrouille pas."], 4: ["La nuit, je compte les bruits. Il y en a toujours un de trop."] },
        saisons: { 1: ["Le printemps, les routes rouvrent. Le compte grossit. Je râle, mais je compte."], 2: ["L'été, ils rentrent tard. Je les compte à la lanterne."], 3: ["L'automne, la nuit tombe tôt. La lanterne a plus de travail."], 4: ["L'hiver, personne ne sort. Le compte tombe juste tous les soirs. C'est ma saison."] },
        blesse: ["Tu saignes. Le guérisseur, c'est à droite. Je t'attends pour le compte."],
        meteo: {
            orage: ["Orage. Je ferme la porte à moitié. L'autre moitié, c'est pour ceux qui courent."],
            tempete: ["Tempête. Personne ne sort. Si quelqu'un sort, je le compte deux fois : une pour le vent."],
            pluie: ["Pluie. Ils marchent vite, je compte vite. Ça s'équilibre."],
            neige: ["La neige garde les traces. Je compte les pas. Elle compte avec moi."],
            brouillard: ["Brouillard. Je ne vois rien, alors je compte les voix. Dis bonjour, que je te compte."] } },
    '29:12': {
        bonjour: { 1: ["Le pain chaud de la relève est arrivé. … Il est déjà mangé. Pas par moi. Enfin, un peu."], 2: ["Midi. Rien à signaler. Comme d'habitude. Enfin, comme avant."], 3: ["Le soir, Brunehaut compte. Moi, je regarde si elle compte bien. Elle compte bien."], 4: ["~Il sursaute.|Je ne dormais pas ! Je… surveillais l'intérieur de mes paupières."] },
        saisons: { 1: ["Le printemps, les bals recommencent au manoir. J'entends la musique d'ici, si le vent tourne."], 2: ["L'été, le casque chauffe. Il retombe quand même. Il retombe chaud."], 3: ["L'automne, je balaie les feuilles devant la porte. Ce n'est pas mon travail. Il faut bien s'occuper."], 4: ["L'hiver, la garde de nuit dure cent ans. Mathis dit que c'est à cause des étoiles. Je crois que c'est le froid."] },
        blesse: ["Tu es blessé ? Je… je vais chercher Brunehaut. Non. Je reste. Assieds-toi. Je suis garde. Je gère."],
        meteo: {
            orage: ["Un orage ! Brunehaut dit de ne pas lever ma lance. Je ne la lève pas. Je la tiens très bas."],
            tempete: ["Le vent a pris mon casque. Il est quelque part vers le marché. J'irai le chercher après. Ou jamais."],
            pluie: ["La pluie coule dans mon casque et ressort par le col. C'est presque un système."],
            neige: ["Il neige. Je fais des pas en rond pour ne pas geler. Brunehaut dit que c'est une ronde. J'ai inventé une ronde."],
            brouillard: ["Dans le brouillard, chaque buisson est un ennemi. J'ai menacé trois buissons ce matin. Ils n'ont rien dit."] } },
    '29:33': {
        bonjour: { 1: ["L'aube. Le ciel change de couleur toutes les deux minutes. Je les compte. Il y en a neuf."], 2: ["Midi, pas d'étoiles. Je regarde les oiseaux, alors. Ils sont moins bien rangés."], 3: ["Le soir, la première étoile, c'est toujours Berthe. Elle arrive tôt. Comme la vraie."], 4: ["La nuit, c'est mon travail et mon plaisir. Je suis payé pour regarder le ciel. Personne ne l'a encore remarqué."] },
        saisons: { 1: ["Le printemps, les hirondelles reviennent. Je les compte. Il en manque toujours une. Je l'attends."], 2: ["L'été, les étoiles filantes. J'ai fait des vœux pour tout le village. Pour toi aussi."], 3: ["L'automne, les nuits s'allongent. J'ai plus de ciel. C'est ma saison."], 4: ["L'hiver, l'air est clair. On voit des étoiles qui n'ont pas de nom. Je leur en trouve."] },
        blesse: ["Tu es blessé. Je l'ai vu d'en haut, avant que tu arrives. Va voir quelqu'un. Je te regarde y aller."],
        meteo: {
            orage: ["L'orage ! D'en haut, c'est magnifique, et terrifiant. Les deux en même temps, comme les belles choses."],
            tempete: ["Le vent fait trembler ma tour. Je m'accroche. Je regarde quand même."],
            pluie: ["La pluie, c'est le ciel qui descend. J'aimerais qu'il remonte avec moi."],
            neige: ["La neige tombe en silence. D'en haut, le village a l'air de dormir sous un drap."],
            brouillard: ["Le brouillard. Je ne vois rien, alors j'écoute. Le village a des bruits de cuisine, le matin."] } },
    '29:34': {
        bonjour: { 1: ["Le matin ! Le pain de la relève ! … Il en reste ? Il en reste pas. Bon."], 2: ["Midi, l'ami ! L'heure sacrée ! Tu as mangé ? Moi, deux fois."], 3: ["Le soir, je pense au bar. Au ragoût. Le soir, je pense, quoi."], 4: ["La nuit, j'ai faim. C'est normal, c'est la nuit. Le jour aussi, remarque."] },
        saisons: { 1: ["Le printemps, les premières fraises ! Berthe en fait des tartes. Je le sais, j'ai le nez."], 2: ["L'été, les cerises ! Je les mange avec les noyaux. Konrad dit que c'est dangereux. Il a fait une phrase entière, ce jour-là."], 3: ["L'automne, les châtaignes. On les grille à la porte sud. Les chiens adorent. Moi aussi."], 4: ["L'hiver, la soupe. Toute la journée. La plus belle saison, l'hiver, si on y pense avec le ventre."] },
        blesse: ["T'es blessé, l'ami ! Assieds-toi. Mange ça. Si, si. Ça soigne pas, mais ça console."],
        meteo: {
            orage: ["L'orage ! Les chiens se cachent sous moi. J'ai l'habitude. Je fais un bon toit."],
            tempete: ["Ce vent, il emporte les galettes ! J'en ai perdu une. Je la pleure encore."],
            pluie: ["La pluie ! On rentre au poste, on fait chauffer quelque chose. C'est la règle. Ma règle."],
            neige: ["La neige ! Les gamins font des bonshommes, moi je fais des réserves. Chacun son art."],
            brouillard: ["Brouillard ! Je vois rien, mais je sens le pain de la boulangère. Le nez, ça trompe jamais."] } },
    '29:35': {
        saisons: { 1: ["Printemps. Tilleul tendre. Bon pour tailler."], 2: ["Été. Trop de bruit. Les cigales."], 3: ["Automne. Les feuilles tombent. Je les écoute."], 4: ["Hiver. Longues nuits. Beaucoup de hiboux."] },
        blesse: ["Blessé. Assieds-toi.|~Il te tend un tissu propre, sans un mot."],
        meteo: {
            orage: ["Orage. Les chiens. Sous Rolf."],
            tempete: ["Vent. N'aime pas. Siffle."],
            pluie: ["Pluie. Bois gonflé. Pas taillé."],
            neige: ["Neige. Silence. Bien."],
            brouillard: ["Brouillard. Écoute. Ça suffit."] } },
    '29:38': { meteo: {
        orage: ["L'orage. Trois secondes entre l'éclair et le tonnerre : un kilomètre. Ne bouge pas, je calcule le prochain."],
        tempete: ["Le vent tourne mes pages. Je le déteste. Il fait exprès."],
        pluie: ["La pluie. L'encre coule si on lit dehors. Je lis dedans. Tu peux entrer. Une minute."],
        neige: ["La neige. Le silence tient tout seul. Enfin."],
        brouillard: ["Le brouillard. Personne ne me voit. C'est reposant. Toi, tu me vois. C'est… acceptable."] } },
    '29:41': { meteo: {
        orage: ["L'ORAGE ! Mes draps ! Aide-moi, vite ! … Trop tard. Bon. Je relave. Je relave toujours."],
        tempete: ["Ce vent m'a pris un drap ! Il est sur le toit de Fernand. Fernand dit qu'il l'avait prévu. Il prévoit tout, ce vieux."],
        pluie: ["La pluie, un jour de lessive. Je pleure pas. C'est la pluie qui pleure sur mes draps."],
        neige: ["La neige ! Les draps gèlent sur le fil, raides comme des planches. On dirait des portes. Ha !"],
        brouillard: ["Brouillard. Le linge sèche pas. Moi non plus : j'ai les cheveux comme une éponge."] } },
    '29:42': { meteo: {
        orage: ["L'orage. Les pierres boivent. Elles ont soif, depuis le temps."],
        tempete: ["Ce vent essaie de décoller les pierres. Il y arrivera pas. Je les ai bien posées."],
        pluie: ["Sous la pluie, les pierres changent de couleur. Elles ont l'air plus jeunes. Elles ont de la chance."],
        neige: ["La neige couvre mes pavés. Ils dorment. Je les réveille en marchant. Doucement."],
        brouillard: ["Dans le brouillard, je reconnais les murs à la main. Bonjour, toi. Bonjour, toi."] } },
    '29:53': { meteo: {
        orage: ["OYEZ ! ORAGE ! RENTREZ VOS POULES ! … C'est une nouvelle importante. Pour les poules."],
        tempete: ["OYEZ ! TEMPÊTE ! … Ma voix ne porte pas contre le vent. Pour une fois, il crie plus fort que moi."],
        pluie: ["OYEZ ! Il pleut ! … Tout le monde le savait. Mais il fallait que quelqu'un le dise."],
        neige: ["OYEZ ! LA NEIGE EST LÀ ! Les enfants, dehors ! Les parents, à la fenêtre !"],
        brouillard: ["OYEZ ! Brouillard sur la grand-rue ! Suivez ma voix ! … C'est pour ça qu'il faut un crieur."] } }
};
Object.keys(PLUS).forEach(function (k) { Object.assign(module.exports[k], PLUS[k]); });
