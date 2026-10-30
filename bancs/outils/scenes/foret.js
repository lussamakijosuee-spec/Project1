'use strict';
module.exports = { carte: 31, nom: 'Forêt', x: 0, y: 0, scenes: [
    { cle: 'gardes', nom: 'Anselme et Bastien', qui: [16, 15], dist: 8, attente: 90, gestes: [
        ['face', 16, 15], ['dit', 16, 'Rien à signaler ! … Si ? Non ! Rien !'], ['dit', 15, 'Note-le quand même. Rien, c\'est aussi quelque chose.']] },
    { cle: 'bastien', nom: 'Bastien a entendu un bruit', qui: [16], attente: 90, gestes: [
        ['bulle', 16, 1], ['dit', 16, 'Tu as entendu ? … C\'était un écureuil. Un gros.']] }
]};
