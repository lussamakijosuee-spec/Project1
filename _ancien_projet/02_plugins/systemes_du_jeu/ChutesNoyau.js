//=============================================================================
// ChutesNoyau.js — v1.0 · Le cerveau partagé des Chutes
// RPG Maker MV   ·   à charger AVANT les plugins Chutes* (après Ame/Errance/Corruption)
//=============================================================================
/*:
 * @plugindesc [v1.0] Source unique de la « pression de Chute ». Tous les plugins
 * Chutes* lisent ICI, pour rester parfaitement synchronisés et cohérents au
 * lore. Aucun effet de jeu, aucune écriture — que de la lecture.
 * @author Claude
 *
 * @help
 * ════════════════════════════════════════════════════════════════════════
 *  CHUTES NOYAU — un seul cerveau pour toute l'ambiance des Chutes
 * ════════════════════════════════════════════════════════════════════════
 *  Avant, chaque plugin d'ambiance recalculait la « pression » dans son coin
 *  (santé mentale, Errance, Corruption). Même formule, mais dupliquée : le jour
 *  où l'une dérive, les effets se désynchronisent. Ce noyau centralise TOUT :
 *  les plugins Chutes* le consultent, donc ils réagissent toujours ensemble.
 *
 *  Les seuils suivent le lore (définis par Errance.js / CorruptionAme.js /
 *  window.Ame) :
 *    • Mental  : rien phases 5-4-3 → commence phase 2 → plein phase 1.
 *    • Errant  : rien < 40 (Ancré) → commence 40 (Décharné) → plein 100.
 *    • Bête    : rien < 40 (Calme) → commence 40 (Frémissement) → plein 100.
 *
 *  Chaque plugin garde un REPLI : si ChutesNoyau est absent, il recalcule
 *  localement (rien ne casse, l'ordre de chargement devient tolérant).
 *
 *  API (0..1) :
 *    ChutesNoyau.mentalActeur(id) / errantActeur(id) / beteActeur(id)
 *    ChutesNoyau.mental() / errant() / bete()        (max du groupe)
 *    ChutesNoyau.dominante()   → { voie:'fond'|'errant'|'bete', pr }
 *    ChutesNoyau.ressenti(p, plancherPct, courbe)    (plancher + courbe)
 * ════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    // Lectures sûres — mêmes sources que partout ailleurs.
    function phase(id) { try { return window.Ame ? (window.Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }
    function errance(id) { try { return window.Errance ? (window.Errance.niveau(id) || 0) : 0; } catch (e) { return 0; } }
    function corruption(id) { try { return window.Corruption ? (window.Corruption.niveau(id) || 0) : 0; } catch (e) { return 0; } }

    // Pressions brutes par acteur (0..1), selon les paliers du lore.
    function mentalActeur(id) { return clamp01((3 - phase(id)) / 2); }       // phase 3→0, 2→.5, 1→1
    function errantActeur(id) { return clamp01((errance(id) - 40) / 60); }   // 40→0 … 100→1
    function beteActeur(id)   { return clamp01((corruption(id) - 40) / 60); }

    function maxGroupe(fn) {
        var m = 0;
        if ($gameParty) $gameParty.members().forEach(function (a) { m = Math.max(m, fn(a.actorId())); });
        return m;
    }

    var ChutesNoyau = {
        VERSION: '1.0',

        phase: phase, errance: errance, corruption: corruption,

        mentalActeur: mentalActeur,
        errantActeur: errantActeur,
        beteActeur: beteActeur,

        mental: function () { return maxGroupe(mentalActeur); },
        errant: function () { return maxGroupe(errantActeur); },
        bete:   function () { return maxGroupe(beteActeur); },

        // Voie de Chute la plus forte du groupe.
        dominante: function () {
            var f = this.mental(), e = this.errant(), b = this.bete();
            var mx = Math.max(f, e, b);
            if (mx <= 0) return null;
            return { voie: f === mx ? 'fond' : (e === mx ? 'errant' : 'bete'), pr: mx };
        },

        // Plancher (en %) + courbe : discret longtemps, intense près du seuil.
        ressenti: function (p, plancherPct, courbe) {
            var pl = (plancherPct || 0) / 100;
            p = clamp01(p);
            if (p <= pl) return 0;
            return Math.pow(clamp01((p - pl) / (1 - pl)), courbe || 1);
        }
    };

    window.ChutesNoyau = ChutesNoyau;
})();
