//=============================================================================
// SafetyNet.js — v1.0 · Le filet de sécurité (anti-gel)
// RPG Maker MV   ·   à charger EN DERNIER (tout en bas de la liste)
//=============================================================================
/*:
 * @plugindesc [v1.0] Empêche qu'UN plugin qui plante gèle la frame ou fige un
 * combat. Attrape les erreurs des boucles de scène et de résolution d'action,
 * les journalise une fois, et laisse le jeu continuer. Ne change aucun effet.
 * @author Claude
 *
 * @param netScenes
 * @text Protéger les boucles de scène
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Un handler d'update qui lève une erreur ne fige plus la carte / le combat.
 *
 * @param netActions
 * @text Protéger la résolution d'action (combat)
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Une erreur dans un hook de dégâts ne fige plus le tour de combat.
 *
 * @param verbose
 * @text Journaliser dans la console
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Écrit chaque erreur inédite dans la console (F12) pour le dev. Jamais visible du joueur.
 *
 * @help
 * ════════════════════════════════════════════════════════════════════════
 *  SAFETY NET — le jeu ne gèle plus à cause d'un seul plugin
 * ════════════════════════════════════════════════════════════════════════
 *  Ton projet empile beaucoup de plugins qui se greffent sur la même boucle
 *  (28 sur l'update de la carte) et sur la résolution des dégâts (40+ sur
 *  Game_Action). Chacun est bien écrit, MAIS si un seul lève une erreur non
 *  gérée, RPG Maker fige la frame — le joueur voit un écran bloqué.
 *
 *  Ce plugin pose un filet AUTOUR de ces deux points chauds :
 *    • la boucle d'update des scènes (carte, combat, menus…),
 *    • la résolution d'une action de combat (Game_Action.apply).
 *
 *  En cas d'erreur : elle est journalisée UNE fois dans la console (F12) et le
 *  jeu continue au lieu de geler. Aucun effet de jeu n'est modifié ; c'est un
 *  pur garde-fou. Le joueur ne voit jamais rien.
 *
 *  IMPORTANT : à charger EN DERNIER (tout en bas de la liste des plugins) pour
 *  envelopper tous les autres. Désactivable par paramètre.
 * ════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('SafetyNet');
    var NET_SCENES  = String(P['netScenes']  || 'true') === 'true';
    var NET_ACTIONS = String(P['netActions'] || 'true') === 'true';
    var VERBOSE     = String(P['verbose']    || 'true') === 'true';

    // Journalise chaque signature d'erreur une seule fois (pas de spam par frame).
    var vus = {};
    function rapport(ctx, e) {
        if (!VERBOSE) return;
        var sig = ctx + ':' + ((e && e.message) || e);
        if (vus[sig]) return;
        vus[sig] = true;
        try {
            console.error('[SafetyNet] ' + ctx + ' — erreur interceptée (le jeu continue) :', e);
            if (e && e.stack) console.error(e.stack);
        } catch (x) {}
    }

    //=========================================================================
    // 1) Boucle des scènes — un update qui plante ne fige plus la frame
    //=========================================================================
    if (NET_SCENES && typeof SceneManager !== 'undefined' && SceneManager.updateScene) {
        var _updateScene = SceneManager.updateScene;
        SceneManager.updateScene = function () {
            try {
                _updateScene.call(this);
            } catch (e) {
                rapport('scene.update', e);
                // On laisse la frame se terminer proprement : pas de gel, pas d'écran bloqué.
            }
        };
    }

    //=========================================================================
    // 2) Résolution d'action de combat — un hook de dégâts qui plante
    //    n'interrompt plus le tour
    //=========================================================================
    if (NET_ACTIONS && typeof Game_Action !== 'undefined') {
        var _apply = Game_Action.prototype.apply;
        Game_Action.prototype.apply = function (target) {
            try {
                _apply.call(this, target);
            } catch (e) {
                rapport('Game_Action.apply', e);
                // L'action s'arrête là pour cette cible, mais le combat continue.
            }
        };
    }
})();
