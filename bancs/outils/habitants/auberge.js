/*
 * L'AUBERGE (carte 44) — l'aubergiste de JOKO, et les clients du vendredi.
 *
 * L'aubergiste est le modèle. Ses répliques, ses nouvelles, sa chambre et son
 * annonce (la dette de Grod) sont GARDÉES MOT POUR MOT : l'outil les reprend
 * dans la carte telle que JOKO l'a faite (instantané bancs/outils/habitants/
 * originaux.json). Ce qui change, à sa demande (2026-09-27) :
 *   · l'annonce est proposée en toute saison, de jour comme de nuit ;
 *   · pendant la quête (page 2) et après (page 3), la chambre et les
 *     nouvelles restent là ;
 *   · chaque saison apporte du neuf (remarques, nouvelles de saison).
 */
'use strict';
var D = require('../recettes/dsl.js');
var H = require('./moteur.js');
var A = D.A, C = D.C, si = D.si, cat = D.cat;
var V = H.V;
function P(nom, t) { return H.parle(nom, t); }

var AUB = 'Aubergiste';
function aubergiste(page) {
    var f = {
        ev: 5, page: page, nom: AUB, role: 'l\'aubergiste de JOKO — page ' + page + (page === 1 ? ' (avant l\'annonce)' : page === 2 ? ' (dette de Grod en cours)' : ' (Grod a repris son tabouret)'),
        voix: 'celle de JOKO : directe, un peu lasse, des rumeurs plein la tête. Ses répliques sont reprises telles quelles.',
        premiere: ['Bonjour !|Tu es nouveau ici, toi. Une chambre, un repas, des nouvelles : on a tout, sauf la patience.'],
        retour: ['Tiens ! Ça faisait un moment. Ta chambre n\'a pas bougé. Enfin, les draps si.'],
        bonjour: {
            1: [P(AUB, 'Bonjour !').concat(P(AUB, 'Qu\'est-ce que tu veux ? '))],
            2: [P(AUB, 'Bonjour !').concat(P(AUB, 'Qu\'est-ce que tu veux ? '))],
            3: [P(AUB, 'Bonsoir… il se fait tard.').concat(P(AUB, 'Qu\'est-ce que je te sers ?'))],
            4: [P(AUB, 'Bonsoir… il se fait tard.').concat(P(AUB, 'Qu\'est-ce que je te sers ?'))]
        },
        saisons: {
            1: ['Printemps. Les voyageurs reviennent, les chambres se remplissent. Et les draps se salissent.', 'Le printemps, j\'ouvre les fenêtres. Ça chasse l\'odeur de l\'hiver. Et celle de Grod.'],
            2: ['L\'été, les chambres du haut sont des fours. Je les loue quand même. Au même prix.', 'Il fait chaud. Les gens dorment mal et boivent bien. Ça se compense.'],
            3: ['L\'automne, les chasseurs rentrent. Ils ont des histoires et de la boue jusqu\'aux genoux.', 'La saison des récoltes : les fermiers paient en grain. Je fais du pain avec les dettes.'],
            4: ['Ferme vite, le froid entre ! L\'hiver, je chauffe toute la nuit. Le bois coûte plus cher que les chambres.', 'L\'hiver, personne ne voyage. Sauf les fous et les héros. Toi, t\'es lequel ?']
        },
        blesse: ['Tu tiens debout comment ? Monte à l\'étage, je t\'apporte de l\'eau chaude et des bandes.'],
        apresAccueil: page === 3 ? P(AUB, 'Il a repris son tabouret. Et sa chanson.') : null,
        discuter: [
            'Tenir une auberge, c\'est être la mère de gens qui ne te remercient jamais. Et qui partent sans payer.',
            'Les murs sont fins. J\'entends tout. Je ne répète rien. Enfin, presque rien.',
            'Le meilleur client ? Celui qui dort, paie et s\'en va. Le pire ? Grod.',
            'Il y a une chambre, au bout du couloir, que je ne loue jamais. Ne demande pas pourquoi. Il n\'y a pas de raison. C\'est juste comme ça.'
        ],
        nouvellesSaison: {
            1: ['Deux mariages ce printemps. Les deux familles veulent la grande salle le même jour. Je vais les laisser se battre et louer au gagnant.'],
            2: ['Un groupe de marchands a réservé tout l\'étage pour la fête d\'été. Ils ont payé d\'avance. Je me méfie des gens qui paient d\'avance.'],
            3: ['Les chasseurs disent que les loups descendent plus tôt cette année. Ils disent ça chaque année.'],
            4: ['La route du Village Montagnard est bloquée par la neige. J\'ai trois voyageurs coincés ici qui ne se supportent plus.']
        },
        perso: {
            titre: 'Et vous ?', paliers: [
                [1, 'Moi ? Je tiens l\'auberge. Ça suffit à remplir une vie.'],
                [4, 'C\'était l\'auberge de mes parents. J\'ai juré que je ne la reprendrais jamais. J\'avais dix-sept ans et beaucoup d\'idées.'],
                [8, '~Elle essuie le comptoir déjà propre.|Parfois je me dis que je partirai. Une chambre, n\'importe où, que quelqu\'un d\'autre me prépare. Juste une nuit.']
            ]
        },
        titreFin: 'Rien', aurevoir: [P(AUB, 'Comme tu veux.')]
    };
    f.options = [
        { titre: 'Des nouvelles', garder: 'nouvelles', saisonnieres: true },
        { titre: 'Une chambre', garder: 'chambre' }
    ];
    if (page === 1) f.options.push({ titre: 'L\'annonce', garder: 'annonce' });
    if (page === 2) f.options.push({ titre: 'Les bières de Grod', garder: 'livraison' });
    return f;
}

var fiches = [aubergiste(1), aubergiste(2), aubergiste(3)];

/* ── les négociants du vendredi soir (ev 10 et 11 : coucher du soleil + vendredi) ── */
fiches.push({
    ev: 10, passage: true, nom: 'Gaspard', role: 'négociant en laine, vient chaque vendredi soir', voix: 'affable, compte tout, parle affaires même en mangeant.',
    murmure: 'Trois balles de laine, à ce prix-là…',
    premiere: 'Gaspard, laine et draps. Je passe tous les vendredis. Si vous avez des moutons, je suis votre ami. Sinon, je suis poli.',
    retour: ['Ah, la tête qui revient ! Les affaires ont été bonnes ? Les miennes, moyennes.'],
    bonjourTous: ['Bonsoir !', '~Il aligne des pièces en piles égales sur la table.|Bonsoir. Pardon, je compte.'],
    saisons: { 1: ['La tonte de printemps : la meilleure laine de l\'année. Et la plus chère.'], 2: ['L\'été, personne n\'achète de laine. Je vends des draps de lin. Je m\'adapte.'], 3: ['L\'automne, tout le monde pense à l\'hiver. Je fais ma fortune en automne.'], 4: ['L\'hiver, je ne voyage que le vendredi. Et encore. Edmée me force.'] },
    discuter: ['Le vendredi, c\'est le seul jour où l\'aubergiste me fait un prix. Elle dit que c\'est parce que je suis fidèle. C\'est parce que je paie.', 'Ma sœur Edmée tient les comptes. Moi, je tiens la conversation. Chacun son talent.', 'Un bon négociant ne vend jamais ce qu\'il a. Il vend ce que l\'autre croit qu\'il a.'],
    nouvelles: ['Les nobles du manoir ont commandé des draps brodés. Beaucoup. On dirait qu\'ils comptent rester.', 'Le prix de la laine monte. Le prix des moutons aussi. Seuls les bergers ne s\'enrichissent pas.'],
    perso: { titre: 'Et Edmée ?', paliers: [[1, 'Ma sœur. Mon associée. Ma conscience, dit-elle.'], [3, 'Sans elle, j\'aurais tout perdu trois fois. Avec elle, je n\'ai perdu que deux fois.']] },
    aurevoir: ['Bon vendredi !', 'À vendredi prochain. Même table.']
});
fiches.push({
    ev: 11, passage: true, nom: 'Edmée', role: 'sœur et comptable de Gaspard', voix: 'précise, pince-sans-rire, lève les yeux au ciel quand son frère parle.',
    murmure: '…et trois de retenue.',
    premiere: 'Edmée. Je fais les comptes de mon frère. C\'est un travail à plein temps.',
    bonjourTous: ['Bonsoir.', '~Elle griffonne dans un carnet sans lever les yeux.|Un instant. … Voilà. Bonsoir.'],
    saisons: { 1: ['Le printemps, il achète trop. Je l\'arrête.'], 2: ['L\'été, il vend trop peu. Je le pousse.'], 3: ['L\'automne, il a raison. Ne le lui dites pas.'], 4: ['L\'hiver, il veut rester au lit. Je le traîne jusqu\'ici. Le vendredi est sacré.'] },
    discuter: ['Gaspard dit qu\'il « sent » les affaires. Il sent surtout la laine mouillée.', 'Un carnet bien tenu vaut une épée. On le sous-estime tout autant.', 'Je voulais être scribe. Jehan, du bar, m\'a appris à lire. Il écrit mieux que moi. Je compte mieux que lui.'],
    nouvelles: ['L\'aubergiste augmente ses prix au printemps. Je l\'ai vu dans ses comptes. Non, je ne dirai pas comment.'],
    perso: { titre: 'Pourquoi le vendredi ?', paliers: [[1, 'C\'est jour de marché au Village Montagnard. On y va le samedi. On dort ici le vendredi.'], [4, 'Et parce que c\'est ici que nos parents s\'arrêtaient. On a gardé l\'habitude. On ne parle pas d\'eux, mais on garde la table.']] },
    aurevoir: ['Bonsoir.', 'Et ne lui prêtez rien.']
});

module.exports = { fiches: fiches, carte: 44 };
