/* LE VILLAGE DE PÊCHE (33) — Emma et Edwin, Annick et son fils, Sora et ses coquillages, Roul au ponton. */
'use strict';
module.exports = { carte: 33, nom: 'Village de Pêche', x: 0, y: 0, scenes: [
    { cle: 'emma-edwin', nom: 'Emma et Edwin', qui: [18, 22], dist: 4, attente: 60, gestes: [
        ['face', 18, 22], ['hasard', [
            [['dit', 22, 'Emma ! Tu savais que le Feu Infernal affaiblit les barrières au contact prolongé ?'], ['dit', 18, 'Je sais. C\'est le mien.'], ['bulle', 22, 6], ['dit', 22, '… Oui. Évidemment.']],
            [['dit', 18, 'L\'Encyclopédie. Abrège.'], ['dit', 22, 'Je n\'ai encore rien dit !'], ['dit', 18, 'C\'est pour ça.']],
            [['dit', 22, 'Pour la faille, j\'ai lu tous les rapports. Deux fois.'], ['dit', 18, 'Moi, je n\'ai pas besoin de lire. Je brûle.'], ['dit', 22, 'Ce n\'est pas une méthode !'], ['bulle', 18, 8]]]]] },
    { cle: 'annick-edwin', nom: 'Annick et son fils', qui: [24, 22], dist: 4, attente: 80, gestes: [
        ['face', 24, 22], ['dit', 24, 'Edwin ! Tu as mangé ?'], ['dit', 22, 'J\'ai lu un traité sur la digestion.'], ['bulle', 24, 5], ['dit', 24, 'C\'est pas pareil !']] },
    { cle: 'regis-annick', nom: 'Régis et ses campagnes', qui: [23, 24], dist: 5, attente: 110, gestes: [
        ['face', 23, 24], ['dit', 23, 'Une tempête de trois jours !'], ['dit', 24, 'Trois heures, Régis.'], ['dit', 23, 'Trois longues heures !']] },
    { cle: 'sora', nom: 'Sora ramasse des coquillages', qui: [19], attente: 45, gestes: [
        ['bulle', 19, 1], ['son', 'Item1', 50], ['hasard', [[['dit', 19, 'Un violet ! Enfin… un peu violet.']], [['dit', 19, 'Celui-là, c\'est pour papa !']], [['dit', 19, 'Cent treize !']]]]] },
    { cle: 'barnabe', nom: 'Barnabé et ses barques', qui: [21], heures: [7, 19], attente: 50, gestes: [
        ['son', 'Hammer', 55], ['attend', 20], ['son', 'Hammer', 55], ['dit', 21, 'Si elle coule, c\'est pas la barque. C\'est le pêcheur.']] },
    { cle: 'orin', nom: 'Orin ravaude ses filets', qui: [17], attente: 70, gestes: [
        ['bulle', 17, 8], ['dit', 17, 'Un nœud. Puis un autre.']] },
    { cle: 'gustave', nom: 'L\'Essayeur de la Confrérie', qui: [43], attente: 100, gestes: [
        ['bulle', 43, 1], ['dit', 43, 'Sceau de la Confrérie. Inspecté. Pas garanti. La nuance compte.']] },
    { cle: 'roul', nom: 'Roul pêche au ponton', qui: ['46:26'], heures: [5, 13], attente: 40, gestes: [
        ['son', 'Water1', 45], ['bulle', '46:26', 1], ['hasard', [[['dit', '46:26', 'Une touche ! … Non. Une algue.']], [['dit', '46:26', 'Celle-là, Tobin ne la croira jamais.']], [['son', 'Splash', 50], ['dit', '46:26', 'GROSSE comme ça ! … Elle est repartie.']]]]] },
    { cle: 'colette-plage', nom: 'Colette à la plage, le soir', qui: ['29:38'], heures: [18, 21], attente: 60, gestes: [
        ['bulle', '29:38', 8], ['dit', '29:38', '… La mer ne parle pas. Enfin.']] },
    { cle: 'jonas', nom: 'Jonas, recrue, fils de pêcheur', qui: [16], attente: 120, gestes: [
        ['bulle', 16, 8], ['dit', 16, 'Papa pêche. Moi, je monte la garde. On regarde tous les deux la mer.']] }
]};
