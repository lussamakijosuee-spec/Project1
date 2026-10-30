'use strict';
module.exports = { carte: 42, nom: 'Magasin d’Armures', x: 0, y: 0, scenes: [
    { cle: 'odile', nom: 'Odile veut l\'armure dorée', qui: [6, 5], dist: 6, heures: [8, 20], attente: 80, gestes: [
        ['tourne', 6, 5], ['dit', 6, 'Celle-là ! La dorée !'], ['dit', 5, 'Tu ne la porterais pas jusqu\'à la porte, ma grande.'], ['bulle', 6, 6]] },
    { cle: 'sidonie', nom: 'Sidonie cite le règlement', qui: [7], heures: [8, 20], attente: 90, gestes: [
        ['dit', 7, 'Une licence provisoire peut limiter les rôles et les niveaux de menace. C\'est écrit.']] },
    { cle: 'prune', nom: 'Prune ne se décourage jamais', qui: [8], heures: [8, 20], attente: 90, gestes: [
        ['bulle', 8, 3], ['dit', 8, 'Recalée ? Formation complémentaire ! Ça veut dire que j\'apprends plus que les autres !']] },
    { cle: 'visite', nom: 'Les trois autres sœurs passent', qui: ['43:6', 6], dist: 8, heures: [14, 16], attente: 90, gestes: [
        ['face', '43:6', 6], ['dit', '43:6', 'Odile ! Tu as encore regardé l\'armure dorée ?'], ['dit', 6, 'Je l\'ai juste saluée.']] }
]};
