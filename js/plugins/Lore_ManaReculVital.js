//=============================================================================
// Lore_ManaReculVital.js — v2.0 · STUB de compatibilité
//   Le recul PV (« la vie contre la puissance ») est désormais géré, sans
//   doublon, par ManaAffinity.js (refonte « Trois Sources »).
//=============================================================================
/*:
 * @plugindesc [Lore 02/50] (CONSOLIDÉ) Le recul PV du Mana Sombre/Négatif est géré par ManaAffinity. Ce plugin ne fait plus rien : gardé pour compat.
 * @author JOKO
 * @help
 *  Historiquement, ce plugin appliquait le recul PV via le notetag
 *  <ReculVital: N>. Cette mécanique a été FUSIONNÉE dans ManaAffinity.js pour
 *  éviter le double comptage :
 *
 *    • ManaAffinity lit toujours <ReculVital: N> sur un skill (override du %),
 *      sinon applique le défaut selon l'élément (Sombre 5 / Négatif 4).
 *    • Un acteur <Atone> paie moitié moins.
 *
 *  Ce fichier est laissé volontairement INERTE (aucun hook) pour ne pas
 *  dupliquer le recul. Vous pouvez le désactiver dans le gestionnaire de
 *  plugins sans rien perdre.
 */
(function () {
    'use strict';
    // Intentionnellement vide : logique déplacée dans ManaAffinity.js.
})();
