/* LE MARCHÉ (30) — les marchands crient, l'apprentie fait tout brûler, jeck fait tourner sa roulette. */
'use strict';
module.exports = { carte: 30, nom: 'Marché', x: 0, y: 0, scenes: [
    { cle: 'bertrand', nom: 'Bertrand vante ses légumes', qui: [6], heures: [8, 20], attente: 45, gestes: [
        ['bulle', 6, 1], ['hasard', [[['dit', 6, 'Des carottes ! Des carottes comme des lingots !']], [['dit', 6, 'Mes tomates rougissent quand on les regarde !']], [['dit', 6, 'Un chou ! Un chou royal ! Le roi n\'en a pas, de chou pareil !']]]]] },
    { cle: 'oriane', nom: 'Oriane fait tout brûler', qui: [12, 13], dist: 3, heures: [8, 20], attente: 90, gestes: [
        ['face', 12, 13], ['son', 'Fire1', 50], ['bulle', 12, 6], ['dit', 12, 'Oups.'], ['bulle', 13, 5], ['dit', 13, 'ORIANE ! Pas sur la table !'], ['dit', 12, 'Elle n\'a presque pas brûlé, maître !']] },
    { cle: 'selma', nom: 'Selma lit la main d\'Oriane', qui: [14, 12], dist: 3, heures: [8, 20], attente: 120, gestes: [
        ['face', 14, 12], ['dit', 14, 'Je vois… un grand incendie.'], ['dit', 12, 'C\'est déjà arrivé ce matin.'], ['dit', 14, 'Alors je vois juste. Deux pièces.']] },
    { cle: 'jeck', nom: 'jeck et sa roulette', qui: [15], heures: [8, 20], attente: 50, gestes: [
        ['son', 'Switch2', 60], ['bulle', 15, 1], ['hasard', [[['dit', 15, 'Faites vos jeux ! … Perdu ! Encore !']], [['dit', 15, 'Elle penche à gauche ? Non ! C\'est la Terre qui penche !']], [['dit', 15, 'Objets trouvés ! Une botte ! Un gant ! Une dignité !']]]]] },
    { cle: 'jacquot', nom: 'Jacquot bonimente', qui: [17], heures: [8, 20], attente: 60, gestes: [
        ['dit', 17, 'Tout ce qu\'il vous faut, et surtout ce qu\'il ne vous faut pas !']] },
    { cle: 'fanchon', nom: 'Fanchon recrute pour la Veilleuse', qui: [26], heures: [8, 20], attente: 70, gestes: [
        ['bulle', 26, 1], ['si', 'window.Habitants && Habitants.admission()',
            [['dit', 26, 'C\'est l\'Admission ! La Veilleuse recrute : une lanterne, un rôle, une équipe !', 200]],
            [['dit', 26, 'La Veilleuse ! On ne laisse personne derrière. Jamais.']]]] },
    { cle: 'tian', nom: 'Tian et ses proverbes', qui: [11], heures: [8, 20], attente: 90, gestes: [
        ['hasard', [[['dit', 11, 'Le poivre ne ment pas. Le marchand, si. Un peu.']], [['dit', 11, 'Qui goûte avant d\'acheter achète deux fois.']]]]] },
    { cle: 'rose-gustave', nom: 'Rose et Gustave', qui: [10, 8], dist: 4, heures: [8, 20], attente: 120, gestes: [
        ['face', 10, 8], ['dit', 8, 'Rose, sens ce fromage. Sens-le.'], ['bulle', 10, 6], ['dit', 10, 'Mes fleurs vont faner, Gustave.'], ['dit', 8, 'Elles faneront heureuses.']] },
    { cle: 'mirabelle', nom: 'Mirabelle recharge une lampe', qui: [7], heures: [8, 20], attente: 80, gestes: [
        ['son', 'Saint1', 50], ['bulle', 7, 9], ['dit', 7, 'Et voilà ! Dix ans de lumière. Enfin, neuf.']] },
    { cle: 'lucien', nom: 'Lucien et la carte du monde', qui: [23], heures: [8, 20], attente: 120, gestes: [
        ['bulle', 23, 8], ['dit', 23, 'Ce fleuve n\'est pas au bon endroit. Pardon. Le fleuve est bien. C\'est moi.']] },
    { cle: 'madeleine', nom: 'Madeleine tranche', qui: [20], heures: [8, 20], attente: 90, gestes: [
        ['son', 'Slash1', 50], ['dit', 20, 'Suivant !']] }
]};
