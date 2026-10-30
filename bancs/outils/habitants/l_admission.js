/*
 * L'ADMISSION (H7, 2026-10-30) — quatre recrues qui remplissent la Ville
 * Forestière les premiers jours de chaque saison (Habitants v1.3 :
 * <Admission> dans la Note, réglage « joursAdmission »). La Bible : « Quatre
 * fois par an, au début de chaque saison, la Chancellerie ouvre une Admission.
 * Les candidats passent un examen d'identité et de santé au Hall de l'Égide,
 * puis une mise en situation au Champ d'Épreuve […] Le but n'est pas de
 * désigner le plus fort, mais de savoir quel travail chacun peut faire sans
 * mourir. » ; « Une licence provisoire peut limiter les rôles ou les niveaux
 * de menace. Un échec mène à une formation complémentaire, pas à
 * l'exclusion. » ; les trois guildes (le Voile-Soleil, la Veilleuse, les
 * Crocs), la Bourse des Lames Franches. Elles dorment à l'auberge.
 */
'use strict';
var K = require('./_communs.js');
var fiches = [];
function F(f) { fiches.push(f); }
var CH = '<Logis: 45 3,10>';
F({ carte: 29, ev: 55, muet: true, nom: 'Noé', role: 'recrue de l\'Admission, passe le Champ d\'Épreuve demain', voix: 'nerveux, enthousiaste, répète ses consignes.', tags: [CH],
    premiere: 'Noé ! Recrue ! Enfin, candidat. Demain, c\'est le Champ d\'Épreuve. Suivre les consignes, gérer l\'incertitude, communiquer, se replier. Je répète. Suivre les consignes…',
    bonjourTous: ['Suivre les consignes ! … Bonjour.', '~Il compte sur ses doigts.|Gérer l\'incertitude… Salut !'],
    discuter: ['Ils ne cherchent pas le plus fort, au Champ d\'Épreuve. Ils cherchent quel travail on peut faire sans mourir. Moi, je veux un travail où je ne meurs pas.', 'Se replier, c\'est noté aussi. Je suis très bon pour me replier. Mon père dit que c\'est mon meilleur talent.'],
    nouvelles: ['La Veilleuse prend ses recrues sous l\'aile d\'un capitaine. J\'aimerais une aile. Une grande.'],
    aurevoir: ['Suivre les consignes ! … Au revoir.', 'Souhaite-moi bonne chance !'] });
F({ carte: 29, ev: 56, muet: true, nom: 'Ilda', role: 'recrue, a passé le Hall de l\'Égide avec le hoquet', voix: 'rieuse, franche, se moque d\'elle-même.',  tags: [CH],
    premiere: 'Ilda. Examen d\'identité et de santé au Hall de l\'Égide : réussi. Avec le hoquet. Le médecin a écrit « hoquet » sur mon dossier.',
    bonjourTous: ['Salut ! … Hic. Non, c\'est fini. Je plaisante.', 'Coucou !'],
    discuter: ['Si j\'échoue, c\'est une formation complémentaire. Pas l\'exclusion. Alors j\'échoue tranquille.', 'Réussir donne accès au travail, pas à un rang. Ma tante croit que je reviendrai rang S. Je reviendrai « licence provisoire ».'],
    nouvelles: ['Les trois guildes tiennent leurs salons cette semaine. Le Voile-Soleil a les plus belles tentes. Les Crocs ont les plus beaux crocs.'],
    aurevoir: ['Bonne route ! Et bois de l\'eau, pour le hoquet.', 'Salut !'] });
F({ carte: 29, ev: 57, muet: true, nom: 'Aubin', role: 'recrue, hésite entre les trois guildes', voix: 'hésitant, réfléchi, change d\'avis en parlant.',  tags: [CH],
    premiere: 'Aubin. Je passe l\'Admission. Après, une guilde. Laquelle ? Le Voile-Soleil. Non. La Veilleuse. Ou les Crocs. Je ne sais pas.',
    bonjourTous: ['Bonjour. … Ou plutôt bonsoir ? Non, bonjour.', '~Il regarde trois prospectus à la fois.|Salut.'],
    discuter: ['La Veilleuse, c\'est le mentorat et le sauvetage : chacun rentre vivant. Le Voile-Soleil paie mieux. Les Crocs… ont des crocs.', 'La Bourse des Lames Franches propose des contrats indépendants. Pas de guilde, pas de capitaine. Pas de copains non plus.'],
    nouvelles: ['Fanchon, au Marché, recrute pour la Veilleuse. Elle m\'a donné une lanterne. Je crois que c\'est un signe.'],
    aurevoir: ['Au revoir ! … Ou à tout à l\'heure.', 'Je déciderai demain.'] });
F({ carte: 29, ev: 58, muet: true, nom: 'Clémence', role: 'recrue, veut des contrats de la Bourse des Lames Franches', voix: 'sûre d\'elle, pressée, compte déjà ses gains.',  tags: [CH],
    premiere: 'Clémence. Pas de guilde pour moi : la Bourse des Lames Franches. Des contrats, une lame, et personne pour me dire de rentrer avant la nuit.',
    bonjourTous: ['Salut. Tu cherches une lame franche ?', '~Elle astique une épée encore toute neuve.|Hm ?'],
    discuter: ['Une licence provisoire limite les rôles et les niveaux de menace. Je commencerai petite. Pour un temps.', 'Une arme de rang A ne fait pas un aventurier de rang A. On me l\'a dit trois fois au Hall. Je l\'ai entendu à la troisième.'],
    nouvelles: ['Chaque faille demande son propre permis. Arriver le premier ne donne aucun droit. Mathurin le crie toutes les heures. Je le sais par cœur.'],
    aurevoir: ['À la prochaine. Je serai plus riche.', 'Salut.'] });
module.exports = { carte: 29, fiches: fiches };
