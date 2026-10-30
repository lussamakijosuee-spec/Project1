'use strict';
module.exports = { carte: 31, nom: 'Forêt', x: 0, y: 0, scenes: [
    { cle: 'gardes', nom: 'Anselme et Bastien', qui: [16, 15], dist: 8, attente: 90, gestes: [
        ['face', 16, 15], ['dit', 16, 'Rien à signaler ! … Si ? Non ! Rien !'], ['dit', 15, 'Note-le quand même. Rien, c\'est aussi quelque chose.']] },
    { cle: 'bastien', nom: 'Bastien a entendu un bruit', qui: [16], attente: 90, gestes: [
        ['bulle', 16, 1], ['dit', 16, 'Tu as entendu ? … C\'était un écureuil. Un gros.']] },
    // la situation (2026-10-30) : le sentier mène au marécage, puis à la grotte et à sa faille
    { cle: 'gardes-faille', nom: 'Les gardes de la route et le vent de la grotte', qui: [15, 16], dist: 6, attente: 150, gestes: [
        ['face', 16, 15], ['dit', 16, 'Le vent vient de la grotte, ce soir.'], ['dit', 15, 'Alors on reste sur le sentier.'], ['bulle', 16, 6]] }
]};
