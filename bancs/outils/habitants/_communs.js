/*
 * CE QUE TOUT LE MONDE SAIT — le fonds commun des conversations.
 * Réponses de JOKO (2026-09-27) :
 *   · la magie est courante mais modeste (lampes enchantées, petits sorts,
 *     fioles), et tout le monde connaît les Dons Spirituels (une arme pour
 *     presque tous, un objet parfois, un Avatar très rarement) ;
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
    'Mon fils a reçu son Don : une arme, comme presque tout le monde. Une hachette. Il voulait un Avatar. Ils veulent tous un Avatar.',
    'Un Avatar ? Deux sur cent, qu\'on dit. J\'en ai jamais vu un. Et j\'espère ne jamais en voir un en colère.',
    'Ma voisine a reçu un objet, pas une arme. Elle ne dit pas ce que ça fait. Ça la rend insupportable.',
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
            'Mon Don ? Une lance. Comme la moitié de la garde. L\'autre moitié a des épées. Personne n\'a d\'Avatar, sinon on ne serait pas gardes.'
        ]),
        nouvelles: (o.nouvelles || []).concat([LORD[2], LORD[5], LORD[4]]),
        perso: o.perso,
        options: o.options,
        tags: o.tags,
        aurevoir: o.aurevoir || ['Circule.', 'Reste dans les rues éclairées.', 'Et pas de bêtises.']
    }, o.extra || {});
}

module.exports = { P: P, paye: paye, boutique: boutique, garde: garde, LORD: LORD, MAGIE: MAGIE, DUR: DUR, SAISON: SAISON, AUREVOIR: AUREVOIR, A: A, C: C, si: si, cat: cat, H: H, D: D };
