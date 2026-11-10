/* LE VILLAGE DE PÊCHE (33) — Emma et Edwin, Annick et son fils, Sora et ses coquillages, Roul au ponton ;
 * et depuis 2026-11-09, la plage : Erwan, le père, le concours, la veille du départ, Orin sous la pluie. */
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
        ['bulle', 16, 8], ['dit', 16, 'Papa pêche. Moi, je monte la garde. On regarde tous les deux la mer.']] },
    // les nouveaux (2026-10-30, comme des OC)
    { cle: 'solange-edwin', nom: 'Solange veut une imprégnation', qui: [45, 22], dist: 5, attente: 150, gestes: [
        ['face', 45, 22], ['dit', 45, 'Regarde-moi avec tes lunettes ! C\'est la faille, avoue !'], ['dit', 22, 'Votre mana est… parfaitement normal.'], ['bulle', 45, 5], ['dit', 45, 'C\'EST LA FAILLE QUI TE FAIT DIRE ÇA.']] },
    { cle: 'solange', nom: 'Solange et son humeur', qui: [45], attente: 100, gestes: [
        ['si', 'Habitants.jour() % 3 === 0', [['dit', 45, 'Quelle belle journée ! Même les mouettes sont belles !']], [['si', 'Habitants.jour() % 3 === 1', [['dit', 45, 'La mer est une page blanche…']], [['dit', 45, 'Tout m\'énerve. C\'est la faille.']]]]]] },
    { cle: 'ninon-peche', nom: 'Ninon cherche la maison bleue', qui: ['30:30'], heures: [12, 14], attente: 60, gestes: [
        ['dit', '30:30', 'Une lettre pour la maison bleue ! … Elles sont TOUTES bleues !']] },
    // la plage (2026-11-09 ; JOKO : « Mer plutôt », « tout et développe au maximum ») — docs/LA_PLAGE.md
    { cle: 'erwan-sora', nom: 'Sora montre son coquillage à papa', qui: [31, 19], dist: 4, heures: [17, 20], attente: 240, gestes: [
        ['face', 19, 31], ['dit', 19, 'Papa ! Regarde celui-là !'], ['bulle', 31, 1], ['dit', 31, '… Celui-là, je l\'avais jamais vu.'],
        ['dit', 19, 'Tu dis ça à chaque fois !'], ['dit', 31, 'C\'est vrai à chaque fois.']] },
    { cle: 'erwan-jonas', nom: 'Erwan regarde son fils, de loin', qui: [31, 16], dist: 14, heures: [7, 9], attente: 600, gestes: [
        ['tourne', 31, 16], ['bulle', 31, 8], ['attend', 40], ['dit', 31, '… Il tient droit.', 150, 100]] },
    { cle: 'concours', nom: 'Régis annonce le concours', qui: [23], si: 'Plage.concours()', attente: 90, gestes: [
        ['bulle', 23, 1], ['dit', 23, 'CONCOURS DE PÊCHE ! Pesée chez le capitaine jusqu\'à dix-sept heures ! Le plus lourd gagne !']] },
    { cle: 'concours-roul', nom: 'Roul, le jour du concours', qui: ['46:26'], si: 'Plage.concours()', heures: [8, 13], attente: 60, gestes: [
        ['son', 'Water1', 45], ['dit', '46:26', 'Cette fois, c\'est la bonne. Tobin peut rentrer chez lui. Tobin peut rentrer chez sa MÈRE.']] },
    { cle: 'veille-depart', nom: 'La veille du départ, Edwin et sa mère', qui: [22, 24], dist: 4, si: '$gameVariables.value(889) === 2', heures: [18, 21], attente: 300, gestes: [
        ['face', 24, 22], ['dit', 24, 'Demain, ou après-demain ?'], ['dit', 22, 'Le règlement dit… Je ne sais pas, maman. C\'est la première fois que je ne sais pas.'],
        ['bulle', 24, 8], ['dit', 24, 'Tu as mangé ?'], ['dit', 22, 'Oui.'], ['dit', 24, 'Menteur.'], ['bulle', 22, 4]] },
    { cle: 'annick-attend', nom: 'Annick attend, le soir', qui: [24], si: '$gameVariables.value(889) === 3', heures: [18, 21], attente: 180, gestes: [
        ['bulle', 24, 8], ['dit', 24, 'Ils sont encore dedans. Bon. Je compte les vagues. Comme Jonas.']] },
    { cle: 'retour', nom: 'Edwin raconte, sa mère écoute', qui: [22, 24], dist: 4, si: '$gameVariables.value(889) === 4', attente: 200, gestes: [
        ['face', 22, 24], ['dit', 22, '… et donc, là-dedans, maman, le mana ne se comporte pas du tout comme dans les rapports, il…'], ['bulle', 24, 4], ['dit', 24, 'Encore. Raconte encore.']] },
    { cle: 'orin-pluie', nom: 'Orin sous la pluie', qui: [17], si: "$gameScreen.weatherType() === 'rain' || $gameScreen.weatherType() === 'storm'", attente: 120, gestes: [
        ['bulle', 17, 8], ['dit', 17, 'La pluie tend le fil. Les autres sont rentrés. Moi, je reste. Un nœud.']] },
    // la situation (2026-10-30)
    { cle: 'edwin-vent', nom: 'Edwin regarde le vent de la grotte', qui: [22], attente: 200, gestes: [
        ['bulle', 22, 1], ['dit', 22, 'Le vent vient de la grotte… Ce mana-là n\'est pas d\'ici. Je le note.']] }
]};
