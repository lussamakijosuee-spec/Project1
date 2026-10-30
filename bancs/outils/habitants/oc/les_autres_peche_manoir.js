/*
 * LES AUTRES HABITANTS DU VILLAGE DE PÊCHE (33) ET LES DOMESTIQUES DU MANOIR
 * (47), comme des OC — leur fiche (P1), ce qu'ils disent selon où ils sont
 * (P2), ce qu'ils disent des autres (P3). Les gardes du manoir ne sont pas
 * touchés. Voir oc/ville.js pour les champs.
 */
'use strict';
module.exports = {
/* ── le Village de Pêche ──────────────────────────────────────────────── */
'33:16': { // Jonas
    oc: { age: '18 ans', allure: 'uniforme de recrue de la garde un peu grand, des mains de pêcheur, un regard qui file vers la mer', caractere: 'timide, sincère ; se sent trahir son père, pêcheur, en montant la garde',
        aime: 'la mer à l\'aube, les histoires du capitaine Régis, le poisson grillé de sa mère', deteste: 'décevoir son père, les nuits de garde sans étoiles', reve: 'que son père vienne le voir monter la garde, une fois, et soit fier',
        secret: 'son père vient le regarder de loin tous les matins ; Jonas ne l\'a jamais vu, tout le village le sait', manie: 'il fait des nœuds de pêcheur avec la cordelette de son uniforme', phrase: 'Papa pêche. Moi, je monte la garde.',
        liens: { 'Régis': 'le vieux capitaine, qui lui raconte la garde d\'autrefois' } },
    lieux: { travail: ['~Il regarde la mer, la lance à la main.|De la garde, on voit les barques partir. Celle de papa est la troisième. Toujours la troisième.'] },
    avis: { 'Régis': ['Le capitaine Régis me raconte ses campagnes. Il exagère. Mais il me dit aussi que monter la garde, c\'est garder les barques qui rentrent. Ça m\'aide.'] }
},
'33:17': { // Orin
    oc: { age: '64 ans', allure: 'mains noueuses, un filet sur les genoux, une pipe éteinte', caractere: 'patient, taiseux ; parle en nouant ses filets, un nœud par phrase',
        aime: 'un filet sans trou, le bruit des vagues, les barques de Barnabé (solides)', deteste: 'les filets déchirés par les brochets de Roul (« gros comme sa jambe »)', reve: 'tisser un filet si fin qu\'il attraperait la lumière',
        secret: 'il cache un petit nœud en forme d\'étoile dans chaque filet qu\'il répare ; les pêcheurs croient que ça porte chance', manie: 'il fait un nœud à chaque fin de phrase', phrase: 'Un nœud. Puis un autre.',
        liens: { 'Barnabé': 'le charpentier de barques ; l\'un fait les barques, l\'autre les filets' } },
    lieux: { travail: ['~Il noue un filet, sans lever les yeux.|Trois trous ce matin. Les poissons apprennent. Moi aussi.'] },
    avis: { 'Barnabé': ['Barnabé jure comme un charretier quand il construit une barque. Ses barques ne coulent jamais. Je crois que ce sont les jurons qui les tiennent.'] }
},
'33:21': { // Barnabé
    oc: { age: '52 ans', allure: 'avant-bras couverts de sciure, un maillet à la ceinture, une barbe rousse où se perdent des copeaux', caractere: 'bourru, fier de son métier ; jure beaucoup, mais sans dire un vrai gros mot',
        aime: 'le bois de chêne, une barque qui glisse droit, les filets d\'Orin (qui vont avec ses barques)', deteste: 'le bois vert, les barques achetées ailleurs', reve: 'construire un navire, un vrai, pour longer la côte de l\'est',
        secret: 'il grave le nom de chaque enfant du village sous la coque d\'une barque ; il y a un « Sora » sous la plus récente', manie: 'il jure par les poissons : « Sacré hareng ! »', phrase: 'Sacré hareng !',
        liens: { Orin: 'le ravaudeur de filets ; l\'un fait les barques, l\'autre les filets' } },
    lieux: { travail: ['~Il frappe un clou d\'un coup sec.|Sacré hareng ! … Il est droit. Il est très droit. Je suis content.'] },
    avis: { Orin: ['Orin répare les filets sans un mot. Moi, je jure en faisant les barques. À nous deux, on fait un pêcheur complet.'] }
},
'33:23': { // Régis
    oc: { age: '76 ans', allure: 'vieux manteau d\'officier aux boutons ternis, un sabre de cérémonie, des médailles qu\'il frotte chaque matin', caractere: 'grandiloquent, nostalgique ; exagère ses campagnes, et plus il vieillit, plus elles grandissent',
        aime: 'raconter, son sabre « de légende », que Jonas l\'écoute', deteste: 'qu\'on dise « c\'était pas si grand », la retraite', reve: 'une dernière revue des troupes, même imaginaire',
        secret: 'son sabre « de légende » est un bon sabre ordinaire ; il le sait, depuis que l\'Essayeur l\'a examiné, et il préfère la légende', manie: 'il salue tout le monde comme des officiers', phrase: 'De mon temps, mon garçon…',
        liens: { Jonas: 'la recrue de la garde, qui l\'écoute', Gustave: 'l\'Essayeur de la Confrérie, qui examine son sabre tous les jours' } },
    lieux: { travail: ['~Il salue un pêcheur comme un général.|Repos, matelot ! … C\'est un pêcheur ? Bon. Repos quand même.'] },
    avis: { Jonas: ['La recrue Jonas monte la garde comme son père pêche : sans un mot, du matin au soir. C\'est un bon garçon. Je lui raconte mes campagnes. Il me croit. C\'est rare.'], Gustave: ['L\'Essayeur examine mon sabre tous les jours. Il dit « bien entretenu ». Il ne dit jamais « de légende ». Il est poli. Je l\'aime bien.'] }
},
/* ── les domestiques du manoir ────────────────────────────────────────── */
'47:13': { // Jeanne
    oc: { age: '34 ans', allure: 'tablier blanc, coiffe de servante, des pas rapides qui ne font aucun bruit', caractere: 'rapide, inquiète, chuchote ; au manoir depuis l\'enfance, elle en connaît chaque couloir',
        aime: 'les couloirs vides à l\'aube, la cuisine de Guillemette, le jardin d\'hiver où personne ne va', deteste: 'les sonnettes, les invités qui claquent des doigts', reve: 'un jour de congé au Marché, à acheter des choses pour elle',
        secret: 'elle connaît un passage dans le mur qui mène directement à la cuisine ; elle l\'emprunte pour voler une part de tarte à Guillemette, qui le sait', manie: 'elle époussette ce qu\'elle touche, même en parlant', phrase: 'Chut. On nous entend.',
        liens: { Guillemette: 'la cuisinière, qui lui garde une part de tarte' } },
    lieux: { travail: ['~Elle époussette un cadre, puis un autre.|Chut. Les invités dorment. Ou ils font semblant. Avec les nobles, on ne sait jamais.'] },
    avis: { Guillemette: ['Guillemette se moque des nobles en préparant leur dîner. Elle sale exprès la soupe du comte. Je ne dis rien. Je goûte.'] }
},
'47:14': { // Octave
    oc: { age: '31 ans', allure: 'livrée impeccable, cheveux plaqués, un sourire qui change selon qui le regarde', caractere: 'obséquieux devant, venimeux derrière ; ambitieux, mais drôle malgré lui',
        aime: 'les compliments des invités, les pourboires, imiter le majordome quand il a le dos tourné', deteste: 'Anatole (le majordome, qui le reprend sur tout), les taches sur sa livrée', reve: 'devenir majordome à la place d\'Anatole ; il répète déjà ses phrases',
        secret: 'il imite Anatole à la perfection ; même Anatole a ri, une fois, en le surprenant', manie: 'il s\'incline trop bas, et se relève trop vite', phrase: 'Monseigneur est trop bon.',
        liens: { Anatole: 'le majordome ; il le déteste, il l\'imite, il l\'admire' } },
    lieux: { travail: ['~Il s\'incline très bas, puis se relève en époussetant sa livrée.|Monseigneur est trop bon. … Il est parti ? Bon. Il est trop bête, aussi.'] },
    avis: { Anatole: ['Anatole me reprend sur tout. « Octave, la cuillère. » « Octave, le col. » Un jour, c\'est moi qui dirai « Octave, la cuillère ». À quelqu\'un d\'autre.'] }
},
'47:16': { // Guillemette
    oc: { age: '55 ans', allure: 'joues rouges, bras nus jusqu\'aux coudes, une cuillère en bois glissée dans le chignon', caractere: 'bourrue, généreuse ; se moque des nobles et nourrit tout le monde, nobles compris',
        aime: 'la cuisine qui fume, les domestiques qui reviennent pour une deuxième part, saler la soupe du comte (un peu)', deteste: 'les plats renvoyés, qu\'on entre dans sa cuisine sans y être invité (sauf Jeanne)', reve: 'ouvrir une auberge à elle, où les nobles feraient la queue',
        secret: 'elle garde une part de tarte pour Jeanne derrière la troisième étagère, chaque soir', manie: 'elle goûte tout, même ce qu\'elle ne cuisine pas', phrase: 'Les nobles mangent comme nous. Avec plus de fourchettes.',
        liens: { Jeanne: 'la servante qui passe par le mur pour voler sa tarte', 'Maître Wendel': 'le guérisseur, qui vient chercher ses bouillons pour les malades' } },
    lieux: { travail: ['~Elle goûte une sauce, fronce les sourcils, rajoute du sel.|Pour le comte. Il ne sait pas. Il dit que c\'est la meilleure de la région. Il a raison.'] },
    avis: { Jeanne: ['Jeanne passe par le mur pour voler ma tarte. Je le sais. Je lui en garde une part derrière la troisième étagère. Elle croit que c\'est la chance.'], 'Maître Wendel': ['Le guérisseur vient chercher mes bouillons pour ses malades. Il dit qu\'ils soignent mieux que ses potions. Je le savais.'] }
},
'47:26': { // Blanche
    oc: { age: '26 ans', allure: 'robe de chambrière sans un pli, des cheveux tirés, un sourire trop calme', caractere: 'trop polie, trop calme, comme ses lettres ; garde tout pour elle',
        aime: 'les draps bien pliés, les chevaux de Fabien (elle va les voir en cachette), les lettres de sa sœur', deteste: 'les invités qui ne disent pas merci, laisser voir ce qu\'elle pense', reve: 'parler aux gens comme elle parle aux chevaux : sans faire semblant',
        secret: 'elle va voir les chevaux de l\'écurie chaque soir et leur raconte sa journée ; Fabien fait semblant de dormir', manie: 'elle lisse son tablier, encore et encore', phrase: 'Tout va très bien, merci.',
        liens: { Fabien: 'le palefrenier, qui fait semblant de dormir quand elle parle aux chevaux' } },
    lieux: { travail: ['~Elle plie un drap en quatre, parfaitement.|Quarante draps. Tout va très bien, merci.'] },
    avis: { Fabien: ['Fabien, à l\'écurie, dort toujours quand je viens voir les chevaux. Il dort très mal : il sourit en dormant. Je crois qu\'il ne dort pas.'] }
},
'47:27': { // Fabien
    oc: { age: '23 ans', allure: 'chemise couverte de foin, des bottes qui sentent l\'écurie, des mains douces pour les chevaux', caractere: 'simple, gentil ; préfère les chevaux aux maîtres, et ne s\'en cache pas',
        aime: 'les chevaux (chacun a un nom), le foin frais, quand Blanche vient le soir', deteste: 'les invités qui cravachent, les écuries froides', reve: 'avoir un cheval à lui, un seul, et le monter jusqu\'à la mer',
        secret: 'il fait semblant de dormir quand Blanche vient parler aux chevaux ; il écoute tout, et il ne le répète jamais', manie: 'il siffle doucement quand quelqu\'un approche, comme pour un cheval', phrase: 'Doucement, doucement.',
        liens: { Blanche: 'la femme de chambre, qui vient parler aux chevaux le soir' } },
    lieux: { travail: ['~Il brosse un cheval en sifflant doucement.|Lui, c\'est Comète. Il n\'aime pas le comte. Moi non plus. On s\'entend bien.'] },
    avis: { Blanche: ['Blanche vient parler aux chevaux le soir. Elle leur dit ce qu\'elle ne dit à personne. Je dors. Enfin, je fais semblant. Les chevaux, eux, ne font pas semblant d\'écouter.'] }
},
'47:25': { // Maître Wendel
    oc: { age: '58 ans', allure: 'robe de guérisseur élimée, une sacoche de fioles qui tinte, des yeux cernés et doux', caractere: 'posé, épuisé ; soigne tout le monde au manoir, des comtes aux palefreniers',
        aime: 'un patient qui guérit, le bouillon de Guillemette, le thé à minuit', deteste: 'les nobles qui se disent malades pour être plaints, les remèdes miracles de Silas', reve: 'une semaine sans malade ; il ne saurait pas quoi faire',
        secret: 'le bouillon de Guillemette guérit mieux que la moitié de ses potions ; il le prescrit sous un nom savant', manie: 'il prend le pouls des gens en leur serrant la main', phrase: 'Respirez. Voilà. Encore.',
        liens: { Guillemette: 'la cuisinière, dont les bouillons soignent mieux que ses potions' } },
    lieux: { travail: ['~Il te prend le poignet en te serrant la main.|Hm. Bon pouls. Un peu rapide. Vous avez marché vite. Ou vous avez peur des guérisseurs.'] },
    avis: { Guillemette: ['Le bouillon de Guillemette guérit mieux que mes potions. Je le prescris sous le nom de « décoction de Guillemette ». Les nobles adorent. Ils croient que c\'est une plante.'] }
},
'47:32': { // Anatole
    oc: { age: '67 ans', allure: 'habit noir impeccable, des gants blancs, une colonne vertébrale qui n\'a jamais plié', caractere: 'impeccable, glacé ; loyal au manoir, à ses règles, et à un sens de l\'humour que personne n\'a jamais vu',
        aime: 'l\'argenterie qui brille, les couverts alignés au millimètre, les imitations d\'Octave (il ne le dira jamais)', deteste: 'les cuillères mal placées, les cols de travers, le désordre', reve: 'former un successeur digne ; il pense qu\'Octave pourrait l\'être',
        secret: 'il a ri, une fois, en surprenant Octave en train de l\'imiter ; il a fait semblant de tousser', manie: 'il redresse les objets d\'un millimètre en passant', phrase: 'Octave. La cuillère.',
        liens: { Octave: 'le valet ambitieux, qu\'il reprend sur tout et qu\'il forme sans le dire' } },
    lieux: { travail: ['~Il redresse une fourchette d\'un millimètre.|Voilà. Le manoir tient par les détails. Le reste, ce sont des murs.'] },
    avis: { Octave: ['Octave m\'imite quand j\'ai le dos tourné. Très bien, d\'ailleurs. Un valet qui observe à ce point fera un majordome. Je ne le lui dirai pas avant vingt ans.'] }
}
};
