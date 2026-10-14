/*
 * LES BOUTIQUES DE LA VILLE FORESTIÈRE (cartes 41, 42, 43).
 * Leurs portes ouvrent de 8 h à 20 h (outils/poser_les_portes.js) ; les
 * marchands ont les mêmes heures (<Horaire: 8-20>) : à 20 h, ils sortent par
 * la porte. Leurs boutiques sont GARDÉES telles que JOKO les a remplies.
 * Les deux clients de la forge (événements 4 et 6, page « TS · Jour ») sont
 * ceux que JOKO avait posés : ils entrent par la porte au lieu d'apparaître.
 */
'use strict';
var K = require('./_communs.js');
var P = K.P, A = K.A, C = K.C, si = K.si, cat = K.cat, H = K.H, paye = K.paye;
var fiches = [];
function F(f) { fiches.push(f); }

F({ carte: 41, ev: 3, nom: 'Gaudry', role: 'forgeron-armurier, père de Lise (la fille du bar)', voix: 'grave, fier, inquiet pour sa fille, parle métal.', horaire: '8-20',
    avant: [[356, 0, ['NPC talk forgeron']]],
    premiere: 'Gaudry. Forgeron. Si ça coupe, si ça protège, ça sort d\'ici. Le reste, va voir ailleurs.',
    bonjour: { 1: ['La forge chauffe. Reviens dans une heure, ou achète maintenant.'], 2: ['~Il frappe l\'enclume, trois coups, puis relève la tête.|Oui ?'], 3: ['Je ferme bientôt. Fais vite.'] }, bonjourTous: ['Oui ?'],
    saisons: { 1: ['Le printemps, les recrues viennent acheter leur première armure. Je leur vends la plus solide. Ils veulent la plus brillante.'], 2: ['L\'été, la forge est un enfer. Je travaille la nuit, quand je peux.'], 3: ['L\'automne, les soldats du lord passent commande. Cent pointes de lance. Payées à la saison prochaine. Peut-être.'], 4: ['L\'hiver, je répare. Les armures brisées racontent toutes la même histoire.'] },
    blesse: 'Tu saignes sur mon comptoir. Montre ton armure. … Elle t\'a sauvé la vie. Et toi tu l\'as mal attachée.',
    discuter: ['Une bonne lame, ça dure une vie. Une armure, non. C\'est pour ça que les forgerons ont toujours du travail.', 'Les enchanteurs du marché veulent graver des runes sur mes lames. Une bonne lame n\'a pas besoin qu\'on lui chante des chansons.', 'Les soldats du lord ne paient qu\'avec des promesses. J\'ai un tonneau plein de promesses. Il ne pèse rien.'],
    nouvelles: [K.LORD[2], K.LORD[3]],
    perso: { titre: 'Et Lise ?', paliers: [[1, 'Ma fille ? Elle travaille avec moi. Elle a de bonnes mains.'], [4, 'Elle veut partir à l\'aventure. Comme sa mère. Sa mère n\'est jamais revenue. Je lui ai dit non. Elle y va quand même, au bar, écouter les mercenaires. Je le sais.'], [7, '~Il pose son marteau.|Si elle part un jour… Je lui forgerai la meilleure armure de ma vie. Et je ne dormirai plus jamais.']] },
    options: [{ titre: 'Voir la marchandise', garder: 'boutique' }],
    aurevoir: ['Prends soin de ton armure. Elle prend soin de toi.', 'Hm. Reviens.'] });
F({ carte: 41, ev: 4, nom: 'Renaud', role: 'mercenaire client de la forge, le jour', voix: 'bavard, compare tout, marchande mal.', passage: true,
    premiere: 'Tu viens acheter aussi ? Prends pas le plastron du fond, je l\'ai vu en premier.',
    bonjourTous: ['Salut.', '~Il soupèse une épée, la repose, la reprend.|Hm ? Salut.'],
    saisons: K.SAISON,
    discuter: ['Gaudry fait les meilleures armures de la région. Et les plus chères. Il appelle ça « la qualité ». J\'appelle ça « ma paie du mois ».', 'Moi, je me bats à la masse. Je n\'ai besoin d\'aucune épée. Je viens quand même regarder les épées. On a le droit de rêver.'],
    nouvelles: [K.LORD[2], 'Le tableau du bar a des contrats. Des petits. Les gros, les soldats du lord les prennent et ne les finissent pas.'],
    aurevoir: ['Salut.', 'Et pas touche au plastron.'] });
F({ carte: 41, ev: 6, nom: 'Clarisse', role: 'chasseuse, cliente de la forge, le jour', voix: 'froide, efficace, n\'aime pas perdre son temps.', passage: true,
    premiere: 'Clarisse. Chasseuse. Je fais réparer mon arc. Toi, tu fais quoi, à part me regarder ?',
    bonjourTous: ['Oui ?', '~Elle teste la tension d\'une corde neuve.|Hm.'],
    saisons: { 1: ['Le printemps, on ne chasse pas les femelles. Règle de chasseur. Les soldats du lord ne la connaissent pas.'], 2: ['L\'été, le gibier monte en altitude. Moi aussi.'], 3: ['L\'automne, la saison des vrais chasseurs.'], 4: ['L\'hiver, on suit les traces dans la neige. Le gibier ne peut pas se cacher. Nous non plus.'] },
    discuter: ['Un arc, ça se respecte. Ça ne pardonne pas l\'impatience.', 'Les nobles du manoir organisent des chasses. Ils tirent sur tout ce qui bouge. Même les rabatteurs, une fois.'],
    nouvelles: [K.LORD[1]],
    aurevoir: ['Hm.', 'Bonne chasse.'] });
F({ carte: 42, ev: 5, nom: 'Hélène', role: 'armurière, tient le magasin d\'armures', voix: 'pratique, maternelle avec les recrues, sévère avec les nobles.', horaire: '8-20',
    premiere: 'Hélène. Armures, boucliers, casques. Je te protège la tête, toi tu te protèges le reste.',
    bonjourTous: ['Bonjour. Tu viens t\'équiper ?', '~Elle ajuste les sangles d\'un plastron sur un mannequin.|Bonjour.'],
    saisons: K.SAISON,
    blesse: 'Tu reviens abîmé. L\'armure était trop légère, ou tu étais trop confiant ?',
    discuter: ['Une armure, faut qu\'elle aille à ton corps. Pas à ta vanité.', 'Les nobles achètent des armures dorées. Elles arrêtent les regards. Pas les flèches.', 'Je vends aux recrues à prix coûtant. Les recrues mortes ne reviennent pas acheter.'],
    nouvelles: [K.LORD[4], K.LORD[2]],
    perso: { titre: 'Pourquoi armurière ?', paliers: [[1, 'Parce que je voulais que les gens rentrent chez eux.'], [4, 'Mon frère est parti à la guerre du lord d\'avant, avec une armure de cuir mal cousue. Je couds bien, maintenant.']] },
    options: [{ titre: 'Voir la marchandise', garder: 'boutique' }],
    aurevoir: ['Rentre entier.', 'Bonne route. Et serre tes sangles.'] });
F({ carte: 43, ev: 3, nom: 'Pascaline', role: 'épicière, tient le magasin d\'objets', voix: 'vive, organisée, compte tout de tête.', horaire: '8-20',
    avant: [[356, 0, ['NPC talk marchand']]],
    premiere: 'Pascaline, épicerie ! Potions, rations, cordes, lampes : si ça sert en voyage, je l\'ai. Si je ne l\'ai pas, ça ne sert pas.',
    bonjourTous: ['Bonjour !', '~Elle compte des fioles à voix basse.|… vingt-trois. Bonjour !'],
    saisons: { 1: ['Le printemps, je vends des cordes et des bottes. Les voyageurs repartent.'], 2: ['L\'été, les potions contre la fièvre partent comme des petits pains.'], 3: ['L\'automne, les provisions. Tout le monde a peur de manquer.'], 4: ['L\'hiver, les lampes enchantées. On en recharge dix par jour au marché.'] },
    discuter: ['Mes potions viennent de l\'apothicaire d\'à côté. Elles marchent. Celles de Silas, au bar, je ne dirai rien. Enfin, si : non.', K.MAGIE[0], 'Le manoir a commandé trois caisses de bougies. Des bougies ! Avec toutes leurs lampes enchantées. Il y a des pièces où ils ne veulent pas de magie, paraît-il.'],
    nouvelles: [K.LORD[0], K.LORD[6]],
    perso: { titre: 'Les affaires ?', paliers: [[1, 'Ça va, ça vient.'], [4, 'Je fais crédit à des familles qui ne pourront jamais payer. Mon mari dit que je suis folle. Je dis qu\'un village sans crédit, c\'est un cimetière.']] },
    options: [{ titre: 'Voir la marchandise', garder: 'boutique' }],
    aurevoir: ['Bonne route ! Et prends une corde. On prend toujours une corde.', 'À bientôt !'] });

module.exports = { carte: 41, fiches: fiches };
