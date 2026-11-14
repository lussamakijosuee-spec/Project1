/* LE BAR (46) — Colin chante (« ♪ »), Pia rougit, Margot sert, les jumeaux se contredisent ; les gardes de la ville
 * viennent après leur service (« 29:34 » Rolf, « 29:11 » Brunehaut), Colette et Mado le soir. */
'use strict';
module.exports = { carte: 46, nom: 'BAR', x: 0, y: 0, scenes: [
    { cle: 'colin', nom: 'Colin chante (♪)', qui: [12], vue: 16, attente: 25, gestes: [
        ['bulle', 12, 3], ['hasard', [[['dit', 12, '♪ La mer chante la nuit, et personne ne l\'entend… ♪']], [['dit', 12, '♪ Une barque, une lanterne, et le fond qui m\'appelle… ♪']], [['dit', 12, '♪ … et c\'est là que le refrain m\'échappe. Encore. ♪']]]],
        ['si', 'VieDuVillage.la(21)', [['bulle', 21, 4]]], ['son', 'Applause1', 35]] },
    { cle: 'margot', nom: 'Margot sert', qui: [27], vue: 14, attente: 40, gestes: [
        ['hasard', [[['dit', 27, 'Une bière pour la quatre ! Pousse-toi, mon grand.']], [['dit', 27, 'Qui a commandé la soupe ? Personne ? Berthe, ils l\'ont commandée !']], [['dit', 27, 'Quinze ans que je porte ces plateaux. Ils pèsent pareil.']]]]] },
    { cle: 'mireille', nom: 'Mireille et le vieux couple', qui: [14, 24, 25], dist: 6, attente: 90, gestes: [
        ['tourne', 14, 24], ['dit', 14, 'Vous savez la dernière ?'], ['dit', 25, 'Non. Et on ne veut pas.'], ['dit', 24, 'Moi, je veux !'], ['bulle', 25, 5]] },
    { cle: 'hector-maude', nom: 'Hector taquine Maude', qui: [24, 25], dist: 3, attente: 90, gestes: [
        ['face', 24, 25], ['dit', 24, 'Tu es toujours aussi belle qu\'au premier jour.'], ['dit', 25, 'Au premier jour, tu étais ivre.'], ['dit', 24, 'Et je te trouvais déjà belle !'], ['bulle', 25, 4]] },
    { cle: 'jumeaux', nom: 'Les jumeaux Vannier', qui: [22, 23], dist: 3, attente: 60, gestes: [
        ['face', 22, 23], ['dit', 22, 'C\'est moi l\'aîné.'], ['dit', 23, 'Non, c\'est moi.'], ['dit', 22, 'De trois minutes !'], ['dit', 23, 'Moi aussi, de trois minutes !']] },
    { cle: 'garrec-anselme', nom: 'Anselme cherche un joueur', qui: [20, 19], dist: 4, attente: 90, gestes: [
        ['face', 20, 19], ['son', 'Switch1', 40], ['dit', 20, 'Un petit dé, Garrec ?'], ['dit', 19, 'Je joue pas contre un homme qui doit de l\'argent à la moitié de la salle !'], ['dit', 20, 'La moitié seulement !']] },
    { cle: 'lise-garrec', nom: 'Lise questionne Garrec', qui: [18, 19], dist: 4, attente: 100, gestes: [
        ['face', 18, 19], ['dit', 18, 'C\'est vrai que vous êtes rang B ?'], ['dit', 19, 'Presque ! … C.'], ['bulle', 18, 1], ['dit', 18, 'Ça compte quand même !']] },
    { cle: 'berthe', nom: 'Berthe nourrit tout le monde', qui: [37, 15], dist: 4, attente: 70, gestes: [
        ['face', 37, 15], ['dit', 37, 'Baptiste. Mange.'], ['dit', 15, 'J\'ai mangé !'], ['dit', 37, 'Mange encore.']] },
    { cle: 'nell-odon', nom: 'Nell surveille Odon', qui: [38, 17], dist: 4, attente: 100, gestes: [
        ['face', 38, 17], ['dit', 38, 'Odon, tu triches.'], ['dit', 17, 'Je joue seul !'], ['dit', 38, 'Justement.']] },
    { cle: 'vieux', nom: 'Le vieux du comptoir', qui: [13], attente: 150, gestes: [
        ['bulle', 13, 8], ['dit', 13, '… Une autre.']] },
    { cle: 'gardes', nom: 'Casimir et Merle à la relève', qui: [30, 29], dist: 8, heures: [20, 22], attente: 120, gestes: [
        ['face', 30, 29], ['dit', 30, 'Article douze : le garde de nuit prend la relève.'], ['dit', 29, 'Va te coucher, Casimir.']] },
    { cle: 'rolf-berthe', nom: 'Rolf et les fonds de marmite', qui: ['29:34', 37], dist: 10, heures: [18, 21], attente: 90, gestes: [
        ['face', '29:34', 37], ['dit', '29:34', 'Berthe ! Les fonds de marmite !'], ['bulle', 37, 4], ['dit', 37, 'Je te les gardais, Rolf. Assieds-toi.']] },
    { cle: 'brunehaut', nom: 'Brunehaut après la porte', qui: ['29:11'], heures: [18, 21], attente: 120, gestes: [
        ['dit', '29:11', 'Douze heures de porte nord. Une bière, et qu\'on ne me parle pas.']] },
    { cle: 'oswin', nom: 'Oswin avant sa nuit', qui: ['29:12'], heures: [13, 17], attente: 120, gestes: [
        ['dit', '29:12', 'Encore une nuit à compter les pavés…']] },
    { cle: 'colette', nom: 'Colette et le parfait à la fraise', qui: ['29:38'], heures: [18, 21], attente: 90, gestes: [
        ['bulle', '29:38', 4], ['dit', '29:38', '… Un parfait à la fraise. Ne dis rien.']] },
    { cle: 'mado', nom: 'Mado au bar', qui: ['29:41'], heures: [18, 21], attente: 90, gestes: [
        ['dit', '29:41', 'Une bière ! Et que quelqu\'un rie avec moi, j\'ai lavé toute la journée !']] },
    // les nouveaux (2026-10-30, comme des OC) : Barthélemy le conteur (52)
    { cle: 'conte', nom: 'Barthélemy raconte, la salle se penche', qui: [52], heures: [20, 24], vue: 14, attente: 60, gestes: [
        ['bulle', 52, 8], ['hasard', [[['dit', 52, '… et c\'est là que le Corps attaqua l\'Âme…']], [['dit', 52, '… le quatrième jour, il devint lui-même une source…']], [['dit', 52, '… la Mère, le Père, et la Fille, qui n\'obéissait à personne…']]]],
        ['si', 'VieDuVillage.la(18)', [['bulle', 18, 1], ['dit', 18, 'Et après ?!']]], ['si', 'VieDuVillage.la(12)', [['dit', 12, '♪ (une seule note, très basse)']]], ['attend', 40], ['dit', 52, 'Demain. Il faut toujours une fin demain.']] },
    { cle: 'conte-colin', nom: 'Le conteur et le barde', qui: [52, 12], dist: 6, heures: [19, 23], attente: 120, gestes: [
        ['face', 52, 12], ['dit', 52, 'Garde la fin, mon garçon. Ne la chante pas trop tôt.'], ['dit', 12, 'Et si personne n\'attend la fin ?'], ['dit', 52, 'Alors chante pour celui qui attend.'], ['bulle', 12, 9]] }
]};
