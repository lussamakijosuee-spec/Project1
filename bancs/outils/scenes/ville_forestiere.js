/*
 * LA VILLE FORESTIÈRE (29) — les scènes. Les personnalités sont celles des
 * fiches et des commentaires de JOKO (Hilde et ses enfants, Kaze qui aide en
 * secret, Colette qu'on ne dérange pas en plein calcul, les gardes qui se
 * relèvent à 17 h). Les gardes du bar (Casimir, Merle) passent en ronde :
 * on les désigne « 46:30 », « 46:29 ».
 */
'use strict';
var M = require('../recettes/dsl.js').M;
module.exports = { carte: 29, nom: 'Ville Forestière', x: 0, y: 39, scenes: [
    { cle: 'hilde-elise', nom: 'Hilde rappelle Élise', qui: [28, 25], dist: 4, heures: [13, 21], attente: 60, gestes: [
        ['face', 28, 25], ['bulle', 28, 1], ['dit', 28, 'ÉLISE ! Pas si loin !'], ['dit', 25, 'Je suis pas loin, maman ! Je suis là !'], ['bulle', 26, 6, false], ['dit', 26, 'Elle est là. Je surveille.']] },
    { cle: 'hilde-tete', nom: 'Hilde compte les têtes', qui: [28, 26], dist: 4, heures: [13, 21], attente: 80, gestes: [
        ['tourne', 28, 26], ['dit', 28, 'Une… deux. Deux. Bien.'], ['dit', 26, 'Maman, on est toujours deux.'], ['dit', 28, 'Je recompte quand même.']] },
    { cle: 'enfants', nom: 'Élise et Tomas', qui: [25, 26], dist: 3, attente: 50, gestes: [
        ['face', 25, 26], ['hasard', [
            [['dit', 25, 'On part à l\'aventure ?'], ['dit', 26, 'On a dit après le goûter.'], ['dit', 25, 'Alors on goûte vite !']],
            [['dit', 25, 'Papa a dit que j\'avais une bonne garde !'], ['bulle', 26, 6], ['dit', 26, 'Papa dit ça à tout le monde.']],
            [['dit', 26, 'Il y a un têtard dans la rivière.'], ['dit', 25, 'Où ?! Je veux le voir !'], ['bulle', 26, 1], ['dit', 26, 'Non, non, j\'ai rien dit.']]]]] },
    { cle: 'kaze-mado', nom: 'Kaze aide Mado, en secret', qui: [40, 41], dist: 4, heures: [6, 13], attente: 90, gestes: [
        ['face', 40, 41], ['dit', 41, 'Ouf… ce panier pèse une âme.'], ['dit', 40, 'Donne.'], ['bulle', 41, 4], ['dit', 41, 'Kaze ! Tu vas me froisser les draps !'], ['dit', 40, '… Je ne froisse rien.'], ['dit', 41, 'Et tu le diras à personne, hein ?'], ['dit', 40, 'Dire quoi ?']] },
    { cle: 'kaze-fleur', nom: 'Kaze pense à la fleur', qui: [40], heures: [6, 13], attente: 150, gestes: [
        ['bulle', 40, 8], ['dit', 40, 'Une fleur rare… Dans deux semaines.'], ['bulle', 40, 9]] },
    { cle: 'midi', nom: 'Hilde et Kaze se croisent', qui: [28, 40], dist: 5, attente: 200, gestes: [
        ['face', 28, 40], ['dit', 40, 'Les petits ?'], ['dit', 28, 'Ils ont mangé. Tomas a eu peur d\'un têtard.'], ['bulle', 40, 4], ['dit', 40, 'Hm. Je prends l\'épicerie.'], ['dit', 28, 'Et ne fais pas crédit à tout le monde.'], ['dit', 40, '… Pas à tout le monde.']] },
    { cle: 'crieur', nom: 'Mathurin crie les nouvelles', qui: [53], vue: 16, heures: [8, 20], attente: 55, gestes: [
        ['son', 'Bell3', 70], ['bulle', 53, 1], ['si', 'window.Habitants && Habitants.admission()',
            [['dit', 53, 'OYEZ, OYEZ ! C\'est l\'Admission ! Examen au Hall de l\'Égide, puis le Champ d\'Épreuve !', 200]],
            [['hasard', [
                [['dit', 53, 'OYEZ, OYEZ ! Chaque faille demande son propre permis ! Arriver le premier ne donne AUCUN droit !', 200]],
                [['dit', 53, 'OYEZ ! Le Héros, Donovano, n\'est d\'aucune guilde ! Les guildes en pleurent !', 200]],
                [['dit', 53, 'OYEZ ! À l\'Académie Rubis, la Descente dans la Faille Captive ! Au temps ou à la profondeur !', 200]],
                [['dit', 53, 'OYEZ ! L\'heure qu\'il est ! Il est l\'heure ! … Voilà. Oyez quand même.', 180]]]]]],
        ['si', 'VieDuVillage.ensemble(53, 38, 7)', [['tourne', 38, 53], ['bulle', 38, 5], ['dit', 38, '… Tu m\'as fait perdre le fil. Trois pages.']]]] },
    { cle: 'colette-calcul', nom: 'Colette calcule', qui: [38], heures: [13, 18], attente: 70, gestes: [
        ['bulle', 38, 8], ['hasard', [
            [['dit', 38, 'Racine du flux… divisée par trois… non.']],
            [['dit', 38, 'L\'ombre répond à l\'eau. L\'eau ne répond à personne.']],
            [['dit', 38, '… Encore une erreur dans ce livre. Page quarante. Évidemment.']]]]] },
    { cle: 'colette-pepin', nom: 'Pépin tente sa chance avec Colette', qui: [42, 38], dist: 3, attente: 120, gestes: [
        ['face', 42, 38], ['dit', 42, 'Une pièce, mademoiselle ?'], ['bulle', 38, 8], ['dit', 38, 'Non. … Tiens. Ne parle pas.'], ['son', 'Coin', 60], ['bulle', 42, 4], ['dit', 42, 'Je ne dis rien. Merci.']] },
    { cle: 'pepin-mado', nom: 'Mado nourrit Pépin', qui: [41, 42], dist: 4, attente: 120, gestes: [
        ['face', 41, 42], ['dit', 42, 'Une pièce, bonne âme ?'], ['dit', 41, 'Tiens, du pain. C\'est mieux qu\'une pièce.'], ['bulle', 42, 4], ['dit', 42, 'C\'est vrai. Ça se mange.']] },
    { cle: 'releve-nord', nom: 'La relève de la porte nord', qui: [11, 12], dist: 6, heures: [17, 18], attente: 300, gestes: [
        ['face', 11, 12], ['dit', 11, 'T\'es en retard.'], ['dit', 12, 'J\'ai compté les pavés en venant. Cent quarante-deux.'], ['bulle', 11, 8], ['dit', 11, 'Va garder ta porte.'], ['dit', 12, 'C\'est la même porte !']] },
    { cle: 'releve-sud', nom: 'La relève de la porte sud', qui: [34, 35], dist: 6, heures: [17, 18], attente: 300, gestes: [
        ['face', 34, 35], ['dit', 34, 'Konrad ! Il reste de la saucisse !'], ['dit', 35, 'Hm.'], ['dit', 34, 'Je la garde, alors.'], ['dit', 35, '… Hm.']] },
    { cle: 'nord-jour', nom: 'Brunehaut à son poste', qui: [11], heures: [6, 17], attente: 120, gestes: [
        ['tourne', 11, 'joueur'], ['hasard', [[['dit', 11, 'Si tu restes planté là, c\'est moi qui m\'occupe de toi.']], [['dit', 11, 'Un qui sort. Un qui rentre. Je compte.']]]]] },
    { cle: 'mathis', nom: 'Mathis regarde la forêt', qui: [33], attente: 150, gestes: [
        ['bulle', 33, 1], ['dit', 33, 'Une lanterne qui bouge, là-bas… Non. Une luciole.']] },
    { cle: 'beran', nom: 'Béran fait sa ronde', qui: [36], heures: [7, 21], attente: 120, gestes: [
        ['bulle', 36, 8], ['hasard', [[['dit', 36, 'Trois guerres. Et toujours la même ronde.']], [['dit', 36, 'Rien à signaler. C\'est comme ça que je les aime, les journées.']]]]] },
    { cle: 'tobias', nom: 'Tobias et les lampes', qui: [39], heures: [17, 22], attente: 40, gestes: [
        ['son', 'Saint1', 50], ['bulle', 39, 9], ['hasard', [[['dit', 39, 'Allume-toi, ma belle.']], [['dit', 39, 'Celle-ci fatigue. Je la gronderai demain.']], [['dit', 39, 'Une de plus. La ville respire.']]]]] },
    { cle: 'fernand', nom: 'Fernand et ses genoux', qui: [29], attente: 150, gestes: [
        ['bulle', 29, 8], ['si', '$gameScreen.weatherType() !== "none"', [['dit', 29, 'Je l\'avais dit. Mes genoux l\'avaient dit.']], [['dit', 29, 'Pluie demain. Mes genoux ne mentent jamais.']]]] },
    { cle: 'ronde-casimir', nom: 'Casimir en ronde', qui: ['46:30'], heures: [7, 18], attente: 120, gestes: [
        ['bulle', '46:30', 1], ['dit', '46:30', 'Article quatre : la ronde se fait au pas. Au pas !']] },
    { cle: 'ronde-merle', nom: 'Merle finit sa ronde', qui: ['46:29'], heures: [14, 20], attente: 120, gestes: [
        ['bulle', '46:29', 8], ['dit', '46:29', 'Encore une rue, et c\'est la bière.']] }
]};
