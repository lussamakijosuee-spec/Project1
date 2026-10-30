/* L'AUBERGE (44) — les six sœurs Brémont viennent chercher Bérénice le soir ; elle se cache. */
'use strict';
module.exports = { carte: 44, nom: 'Auberge 1F', x: 0, y: 0, scenes: [
    { cle: 'berenice', nom: 'Les sœurs trouvent Bérénice', qui: ['42:6', 14], dist: 4, heures: [19, 22], attente: 80, gestes: [
        ['bulle', 14, 6], ['dit', 14, '… Je ne suis pas là.'], ['face', '42:6', 14], ['dit', '42:6', 'BÉRÉNICE !'],
        ['si', "VieDuVillage.la('42:8')", [['dit', '42:8', 'On t\'a trouvée ! Encore !']]],
        ['si', "VieDuVillage.la('43:7')", [['dit', '43:7', 'Elle se cache toujours au même endroit. C\'est pratique.']]],
        ['dit', 14, 'Chut ! … Bon. Asseyez-vous. Mais pas toutes sur moi.']] },
    { cle: 'soeurs', nom: 'Les sœurs se racontent la journée', qui: ['42:7', '43:4'], dist: 4, heures: [19, 22], attente: 90, gestes: [
        ['face', '42:7', '43:4'], ['dit', '42:7', 'Article quatre du règlement : toute recrue doit…'], ['dit', '43:4', 'Corde : cochée. Trousse : cochée. Sidonie : à faire taire.']] },
    { cle: 'rosalie', nom: 'Rosalie et le Héros', qui: ['43:6'], heures: [19, 22], attente: 100, gestes: [
        ['bulle', '43:6', 4], ['dit', '43:6', 'Et là, Donovano a levé la main, et la faille s\'est refermée…']] },
    { cle: 'leonie', nom: 'Léonie trie ses lettres', qui: [13], attente: 80, gestes: [
        ['son', 'Book1', 40], ['dit', 13, 'Une pile pour le nord, une pour le sud… et une pour personne.']] },
    { cle: 'ysaline', nom: 'Ysaline révise', qui: [15], attente: 80, gestes: [
        ['bulle', 15, 8], ['dit', 15, '« Le pouvoir se gagne. Le nom se forge. Le mana est vivant. » … Et moi, je suis fatiguée.']] },
    { cle: 'gaspard', nom: 'Gaspard et Edmée comptent', qui: [10, 11], dist: 3, attente: 90, gestes: [
        ['face', 10, 11], ['dit', 10, 'Douze balles de laine, à neuf…'], ['dit', 11, 'À huit. Tu arrondis encore vers le haut.']] }
]};
