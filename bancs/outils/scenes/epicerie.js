'use strict';
module.exports = { carte: 43, nom: 'Magasin d\'Objets', x: 0, y: 0, scenes: [
    { cle: 'agathe', nom: 'Agathe fait les sacs', qui: [4, 3], dist: 6, heures: [8, 20], attente: 70, gestes: [
        ['tourne', 4, 3], ['dit', 4, 'Corde : cochée. Trousse : cochée. Recharges : cochées.'], ['si', '$gameSystem.hour() < 13', [['dit', 3, 'Et une deuxième corde.']], [['dit', 3, '… Une corde de plus.']]]] },
    { cle: 'capucine', nom: 'Capucine et la lanterne', qui: [7], heures: [8, 20], attente: 90, gestes: [
        ['dit', 7, 'Une lanterne de famille, et c\'est moi qui la porte à recharger. Évidemment.']] },
    { cle: 'hilde', nom: 'L\'épicière compte', qui: [3], heures: [8, 20], attente: 70, gestes: [
        ['bulle', 3, 8], ['si', '$gameSystem.hour() < 13', [['dit', 3, '… vingt-deux, vingt-trois. Vingt-trois fioles.']], [['dit', 3, 'Hm. Vingt-trois. Recompté deux fois.']]]] },
    { cle: 'visite', nom: 'Les trois autres sœurs passent', qui: ['42:6', 4], dist: 8, heures: [10, 12], attente: 90, gestes: [
        ['face', '42:6', 4], ['dit', '42:6', 'Agathe ! On a trouvé l\'armure parfaite !'], ['dit', 4, 'Elle n\'est pas dans la liste.']] }
]};
