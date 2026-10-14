/*
 * CE QUE TOUT LE MONDE SAIT — le fonds commun des conversations.
 * Réponses de JOKO (2026-09-27) :
 *   · la magie est courante mais modeste (lampes enchantées, petits sorts,
 *     fioles). Les Dons Spirituels, cités ici d'abord, sont retirés du lore
 *     le 2026-10-14 : plus personne n'en parle ;
 *   · le peuple parle du lord et des nobles — la suite du lore viendra ;
 *   · le monde est dur mais ordinaire (misère, dettes, soldats qui se
 *     servent, morts au travail), dit sans complaisance ;
 *   · pas de croyances pour l'instant : personne ne prie, personne ne jure
 *     par un dieu.
 */
'use strict';
var D = require('../recettes/dsl.js');
var H = require('./moteur.js');
var A = D.A, C = D.C, si = D.si, cat = D.cat;

function P(nom, t) { return H.parle(nom, t); }
function paye(n, alors, sinon) { return si(C.or(n), cat(A.or(-n), alors), sinon); }
function boutique(liste, achatSeul) { return D.boutique(liste, achatSeul); }

var LORD = [
    'Le lord a doublé la taxe sur le sel. Pour recevoir ses nobles, qu\'on dit. Nous, on mangera fade.',
    'Des carrosses de nobles montent au manoir, au Village Montagnard. Personne ne sait combien de temps ils vont rester.',
    'Les soldats du lord ont pris le grain « pour l\'hiver ». Pour quel hiver ? Le leur.',
    'Le lord donne une fête. Les musiciens sont payés d\'avance. Les fournisseurs, eux, attendent encore.',
    'Au Village Montagnard, quatre soldats sont entrés en disant qu\'ils passaient. Ils sont restés.',
    'Le percepteur passe à la fin du mois. Cache tes poules.',
    'Une dame du manoir a acheté toute la soie du marché. Toute. Les couturières n\'ont plus rien à coudre.',
    'Le lord ? Je l\'ai vu une fois, de loin, sur un cheval blanc. Il avait l\'air d\'avoir froid. Nous aussi, on avait froid.'
];
var MAGIE = [
    'Ma lampe enchantée faiblit. Faudra la faire recharger au marché. Deux pièces, pour une lumière qui en vaut une.',
    'Mon fils a eu sa première hachette. Il voulait une épée. Ils veulent tous une épée.',
    'Un vrai mage de combat ? J\'en ai jamais vu un. Et j\'espère ne jamais en voir un en colère.',
    'Ma voisine a acheté un charme au marché. Elle ne dit pas ce que ça fait. Ça la rend insupportable.',
    'Les fioles du marché, c\'est de l\'eau, du miel et un mot bien placé. Parfois ça marche. Souvent, c\'est le miel.',
    'Mon grand-père allumait le feu d\'un claquement de doigts. Moi, j\'ai des allumettes. On a perdu quelque chose en route.'
];
var DUR = [
    'On a pendu un voleur de pain, sur la place. Il avait treize ans. Le boulanger a fermé une semaine, après. Par honte, ou par peur.',
    'Mon cousin est mort à la carrière. Une pierre. On a eu une semaine de paie en dédommagement. Une semaine, pour un homme.',
    'Les dettes, ici, ça se transmet. Mon père m\'a laissé les siennes. Je laisserai les miennes.',
    'Les soldats du lord ne paient pas à boire. Ils disent « au nom du lord ». Le lord ne paie pas non plus.'
];
var SAISON = {
    1: ['Enfin le printemps. On respire. On travaille aussi, mais on respire.', 'La boue jusqu\'aux chevilles. Le printemps, quoi.'],
    2: ['Quelle chaleur. Même l\'ombre transpire.', 'L\'été, on travaille du lever au coucher. Et le coucher vient tard.'],
    3: ['Les feuilles tombent, les prix montent. L\'automne.', 'Faut rentrer le bois avant les pluies. Et les pluies sont déjà là.'],
    4: ['Il gèle à pierre fendre. Ferme ton col.', 'L\'hiver, on compte les bûches et on compte les jours.']
};
var AUREVOIR = ['Bonne route.', 'À la prochaine.', 'Allez, va.', 'Porte-toi bien.'];

/* LE TEMPS QU'IL FAIT — ce qu'on en dit, selon le milieu (MeteoVivante,
 * 2026-10-02). Par mauvais temps, la remarque remplace celle de saison.
 * Une fiche peut avoir ses propres répliques : meteo: { pluie: [...], … }.
 * Dehors : on vit le temps. Dedans : on le voit entrer avec les clients. */
var METEO = {
    ville: {
        pluie: ['Encore la pluie. Les rues se changent en ruisseaux, et les ruisseaux en boue.', 'T\'as pas de capuche ? Moi non plus. On rentre vite, c\'est tout.'],
        orage: ['T\'as entendu ce coup-là ? J\'ai cru que le toit du voisin partait.', 'Par un temps pareil, même les chiens restent sous les porches.'],
        brouillard: ['Je vois pas le bout de la rue. Si quelqu\'un te parle sans visage, réponds pas.', 'Le brouillard du matin. Il colle aux vêtements comme une mauvaise nouvelle.'],
        neige: ['La neige tient. Les gamins sont contents, les vieux beaucoup moins.', 'Marche dans les traces des autres. Sous la neige, il y a des trous.'],
        tempete: ['On voit plus rien ! Rentre quelque part, et vite.', 'Le vent arrache les volets. J\'en ai déjà ramassé deux.']
    },
    marche: {
        pluie: ['La pluie fait fuir les clients. Et les clients qui restent veulent un rabais.', 'Mes étals prennent l\'eau. Je vends des fruits lavés, ce matin. Gratuitement lavés.'],
        orage: ['Un orage, et tout le monde remballe. Une journée perdue.', 'La toile de mon étal a pris le vent. Elle est sur le toit d\'en face, maintenant.'],
        brouillard: ['Avec ce brouillard, les voleurs ont la tâche facile. Je garde une main sur la caisse.', 'On ne voit pas la marchandise. Les gens achètent au toucher. Ils se plaignent après.'],
        neige: ['L\'hiver, je vends du bois, de la laine et des promesses de printemps.', 'La neige gâte les légumes. Et elle fait monter les prix. Ça, c\'est bon pour moi.'],
        tempete: ['Aujourd\'hui je ne vends rien. Je tiens mon étal pour qu\'il ne s\'envole pas.', 'Pas de marché par ce temps. Reviens quand on y verra.']
    },
    peche: {
        pluie: ['La pluie, ça ne gêne pas les poissons. Ça gêne les pêcheurs.', 'Les barques restent à quai. La mer est grise, le ciel aussi, et moi pareil.'],
        orage: ['Personne ne sort par un temps pareil. Ceux qui sortent, on les cherche le lendemain.', 'La mer cogne la jetée. Elle a faim, aujourd\'hui.'],
        brouillard: ['Brouillard sur l\'eau : on sonne la cloche du port pour que les barques retrouvent le quai.', 'Par ce brouillard, on rentre à l\'oreille : les vagues sur les rochers, c\'est la seule carte qui vaille.'],
        neige: ['La neige sur la mer, c\'est beau. Ça ne pêche pas, mais c\'est beau.', 'Les filets gèlent. On les casse en les dépliant.'],
        tempete: ['Tempête. Les barques sont attachées deux fois. Moi aussi, si je pouvais.', 'Le port ferme. Même les mouettes ont abandonné.']
    },
    montagne: {
        pluie: ['La pluie descend de la montagne. Elle emporte la terre des chemins avec elle.', 'Le torrent grossit. Personne ne traverse le gué aujourd\'hui.'],
        orage: ['Là-haut, l\'orage tape sur les crêtes. Ici, on compte entre l\'éclair et le bruit.', 'Un orage en montagne, ça se respecte. On se met à l\'abri et on se tait.'],
        brouillard: ['Le brouillard monte de la vallée. Les chèvres rentrent seules, elles savent.', 'Par brouillard, on ne prend pas le sentier du col. On le prend une fois, pas deux.'],
        neige: ['La neige, ici, c\'est la moitié de l\'année. On s\'y fait. Les genoux, eux, s\'y font pas.', 'Le col est fermé. Ceux qui sont de l\'autre côté y restent jusqu\'au dégel.'],
        tempete: ['Tempête de neige : on ferme les volets, on garde le feu, on attend. C\'est tout ce qu\'on peut faire.', 'Par une tempête comme ça, des gens se perdent à dix pas de chez eux. Reste près des murs.']
    },
    bar: {
        pluie: ['T\'es trempé. Viens près du feu, et ferme cette porte avant qu\'on prenne froid.', 'Quand il pleut, le bar se remplit. Les gens boivent pour sécher de l\'intérieur.'],
        orage: ['Avec l\'orage dehors, personne ne part. Bonne soirée pour les affaires, longue soirée pour moi.', 'Le tonnerre fait trembler les verres. Les clients, eux, tremblent quand je leur donne la note.'],
        brouillard: ['Le brouillard ramène des têtes qu\'on n\'a jamais vues. On ne pose pas de questions.', 'On dirait que la rue a disparu, derrière la fenêtre.'],
        neige: ['T\'as de la neige plein les épaules. Secoue-toi dehors, pas sur mon plancher.', 'L\'hiver, le vin chaud se vend mieux que la bière. Je fais les deux, je suis prévoyant.'],
        tempete: ['Personne ne sort ce soir. Je fais un prix pour ceux qui dorment sur les bancs.', 'Le vent siffle dans la cheminée. On dirait quelqu\'un qui chante faux. Comme Grod.']
    },
    auberge: {
        pluie: ['Tes bottes, sur le paillasson ! J\'ai lavé le sol ce matin.', 'Avec cette pluie, les chambres se remplissent. Les voyageurs arrivent mouillés et repartent secs. Moyennant finance.'],
        orage: ['Ce soir, personne ne reprend la route. Il me reste deux chambres, et elles sont chères.', 'L\'orage a réveillé tout l\'étage. Ils réclament du thé. À cette heure.'],
        brouillard: ['Les voyageurs se perdent dans le brouillard et finissent ici. Le brouillard, c\'est mon meilleur rabatteur.', 'Le cocher du matin n\'est pas parti. Il dit qu\'il voit pas ses chevaux.'],
        neige: ['La route est bloquée par la neige. Ceux qui sont ici vont rester. Ils ne se supportent déjà plus.', 'Le bois coûte plus cher que les chambres, l\'hiver. Je chauffe quand même.'],
        tempete: ['Tempête. Personne ne part, personne n\'arrive. On attend.', 'Le vent a cassé un carreau à l\'étage. Le client dit que c\'est pas lui. Je le crois. À moitié.']
    },
    boutique: {
        pluie: ['La pluie ? Bonne nouvelle : on vend des capes. Mauvaise : on n\'en a plus.', 'Essuie tes pieds avant de toucher à la marchandise.'],
        orage: ['Avec l\'orage, tu es mon seul client de la journée. Je te fais un prix. Un petit.', 'Si le tonnerre tombe sur la boutique, je te rends pas ta monnaie.'],
        brouillard: ['Le brouillard fait rentrer des gens qui cherchaient autre chose. Ils achètent quand même.', 'On n\'y voit rien dehors. Ici, au moins, on voit les prix.'],
        neige: ['L\'hiver, je vends des gants. Et des excuses quand je n\'en ai plus.', 'Ferme la porte, la neige rentre.'],
        tempete: ['Par une tempête pareille, je n\'aurais pas ouvert. Mais tu es là, alors autant vendre.', 'Le vent fait claquer l\'enseigne. Si elle tombe, elle est à toi, gratuite.']
    },
    manoir: {
        pluie: ['Il pleut. Les invités du lord se plaignent de la boue sur leurs bottes. Nous, on la nettoie.', 'Madame ne sortira pas aujourd\'hui. Quand il pleut, tout le manoir s\'ennuie, et l\'ennui se passe sur nous.'],
        orage: ['L\'orage a fait tomber un tableau dans la galerie. On ne dira pas qui l\'avait mal accroché.', 'Les invités veulent des bougies dans chaque pièce. Par orage, les nobles ont peur du noir.'],
        brouillard: ['Le brouillard cache le jardin. Le jardinier dit que c\'est le seul jour où personne ne critique ses haies.', 'On ne voit pas l\'allée, ce matin. Les carrosses attendent.'],
        neige: ['La neige, vue d\'ici, c\'est joli. Vue du village, c\'est du bois qu\'il faut couper.', 'Les cheminées brûlent jour et nuit. Les nobles ont chaud. Les domestiques portent le bois.'],
        tempete: ['Tempête. Les invités ne repartiront pas. Il faudra les nourrir jusqu\'à ce que ça passe.', 'Le vent hurle dans les couloirs. Les nobles disent que c\'est le manoir qui a de l\'âme. C\'est surtout qu\'il a des fenêtres mal fermées.']
    },
    garde: {
        pluie: ['Garde sous la pluie : l\'armure rouille, les pieds pourrissent, et la paie arrive pas plus vite.', 'Les gens rentrent chez eux. Nous, on reste. On est payés pour être mouillés.'],
        orage: ['Un orage, et le capitaine veut quand même la ronde. Il est au sec, lui.', 'Pas de lance levée sous l\'orage. Ça, c\'est la seule règle que je respecte vraiment.'],
        brouillard: ['Par ce brouillard, n\'importe qui peut passer la porte. Alors j\'arrête tout le monde. Même toi.', 'On voit à trois pas. Si tu vois quelqu\'un courir, c\'est pas forcément un voleur. Mais souvent.'],
        neige: ['La neige gèle les gants à la hampe. On garde la porte, et la porte nous garde froids.', 'Les traces dans la neige, c\'est pratique : on sait qui est sorti cette nuit.'],
        tempete: ['Tempête. On garde la porte fermée, et on fait semblant de surveiller.', 'Par ce vent, même les brigands restent chez eux. C\'est déjà ça.']
    }
};
var LIEU_DE_CARTE = { 29: 'ville', 30: 'marche', 33: 'peche', 36: 'montagne', 41: 'boutique', 42: 'boutique', 43: 'boutique', 44: 'auberge', 46: 'bar', 47: 'manoir' };

/* un garde : un fonds de caserne, et ce qui n'appartient qu'à lui */
function garde(ev, nom, o) {
    return Object.assign({
        ev: ev, nom: nom, role: o.role || 'garde', voix: o.voix || 'garde de la ville : fatigué, pragmatique, humour de caserne.',
        premiere: o.premiere || 'Garde ' + nom + '. Circule, et fais pas de bêtises.',
        bonjour: o.bonjour || {
            1: ['Relève du matin. Café froid, pieds gelés.', 'Salut. Tu tombes au mauvais moment : je viens de prendre mon poste.'],
            2: ['Tout est calme. Pour l\'instant.', 'Circule, citoyen.'],
            3: ['Le soir, les ivrognes sortent. Et les voleurs aussi. Même combat.', 'On change bientôt de garde. Vivement.'],
            4: ['À cette heure-ci, t\'as rien à faire dehors. Moi non plus, mais on me paie.', 'Ouvre l\'œil. La nuit, les ombres ont des couteaux.']
        },
        saisons: o.saisons || { 1: ['Le printemps, les routes rouvrent. Plus de voyageurs, plus d\'ennuis.'], 2: ['L\'été, l\'armure est un four.'], 3: ['L\'automne, on double les rondes au nord.'], 4: ['L\'hiver, garder une porte dans le vent, c\'est la pire punition qui soit.'] },
        blesse: 'T\'es blessé. Va voir un guérisseur avant de tomber dans ma rue, j\'ai pas envie de remplir un rapport.',
        discuter: (o.discuter || []).concat([
            'La ronde, c\'est marcher en rond. Le nom dit tout.',
            'On nous paie en retard depuis que le lord reçoit ses nobles.',
            'Une lance, comme la moitié de la garde. L\'autre moitié a des épées. Le sergent dit que c\'est pour faire joli dans les rangs.'
        ]),
        nouvelles: (o.nouvelles || []).concat([LORD[2], LORD[5], LORD[4]]),
        perso: o.perso,
        options: o.options,
        tags: o.tags,
        aurevoir: o.aurevoir || ['Circule.', 'Reste dans les rues éclairées.', 'Et pas de bêtises.'],
        meteo: o.meteo || METEO.garde
    }, o.extra || {});
}

module.exports = { METEO: METEO, LIEU_DE_CARTE: LIEU_DE_CARTE, P: P, paye: paye, boutique: boutique, garde: garde, LORD: LORD, MAGIE: MAGIE, DUR: DUR, SAISON: SAISON, AUREVOIR: AUREVOIR, A: A, C: C, si: si, cat: cat, H: H, D: D };
