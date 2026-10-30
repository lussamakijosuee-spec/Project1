/* LES BOUTIQUES — trois lots dans un fichier : la forge (41), les armures (42), l'épicerie (43). */
'use strict';
module.exports = { carte: 41, nom: 'Magasin d\'Armes', x: 0, y: 0, scenes: [
    { cle: 'forge', nom: 'Gaudry frappe l\'enclume', qui: [3], heures: [8, 20], attente: 25, gestes: [
        ['son', 'Hammer', 70], ['attend', 18], ['son', 'Hammer', 70], ['attend', 18], ['son', 'Hammer', 75],
        ['hasard', [[['dit', 3, 'Le fer chante quand il est prêt.']], [['dit', 3, 'Lise… encore au bar, je parie.']], []]]] },
    { cle: 'renaud', nom: 'Renaud compare tout', qui: [4, 3], dist: 8, heures: [8, 20], attente: 90, gestes: [
        ['tourne', 4, 3], ['dit', 4, 'Au marché, la même lame coûte deux pièces de moins !'], ['dit', 3, 'Alors va te battre avec celle du marché.']] }
]};
