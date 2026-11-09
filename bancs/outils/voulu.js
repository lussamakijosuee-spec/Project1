/*
 * CE QUE JOKO A VOULU — les outils ne le remettent pas
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-11-09, sur la liste montrée (la carte 29 telle que « FGFG »
 * l'a laissée) : « oui, c'est voulu […] Tout est voulu, là ».
 *
 * Ces événements restent comme il les a mis. poser_les_habitants.js et
 * poser_les_scenes.js ne les réécrivent jamais (même avec --ecrire), et les
 * bancs du village ne leur demandent plus ce que l'outil y écrivait (la fiche
 * de personnage, les anniversaires du crieur…) : ils vérifient seulement
 * que ses pages se parlent jusqu'au bout, sans une erreur.
 *
 * Les événements qu'il a RETIRÉS (Tobias 29:39, les 4 nouveaux 29:59-62, les
 * 4 recrues de l'Admission 29:55-58…) n'ont pas besoin d'être ici : un
 * événement qui n'existe plus, ou qui est devenu quelqu'un d'autre, n'est
 * jamais réécrit (la règle d'identité de l'outil des habitants).
 *
 * Rendre la main à l'outil sur l'un d'eux : le retirer de cette liste.
 * C'est à JOKO, pas aux outils.
 */
'use strict';
var VOULU = {
    quand: '2026-11-09',
    evenements: {
        // les 9 de la ville sans leurs conversations
        '29:33': 'Mathis',
        '29:34': 'Rolf',
        '29:35': 'Konrad',
        '29:36': 'Béran',
        '29:38': 'Colette',
        '29:40': 'Kaze',
        '29:41': 'Mado',
        '29:42': 'Pépin',
        '29:53': 'Mathurin',          // le crieur, sans les anniversaires
        // ses scènes de la ville (19, dont « Tobias et les lampes »)
        '29:54': '🏘 La vie — Ville Forestière'
    }
};
// pour un banc qui vérifie que la liste protège bien : VOULU_SAUF=29:33 fait comme si 29:33 n'y était pas
String(process.env.VOULU_SAUF || '').split(',').filter(Boolean).forEach(function (k) { delete VOULU.evenements[k.trim()]; });
VOULU.est = function (carte, ev) { return Object.prototype.hasOwnProperty.call(VOULU.evenements, carte + ':' + ev); };
module.exports = VOULU;
