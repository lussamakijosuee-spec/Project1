//=============================================================================
// EtatMental.js — v1.0  ·  Les variables mentales des quatre héros
//   À charger dans les CORRECTIFS, avant SafetyNet.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Donne une valeur de départ aux variables mentales des
 * quatre héros. Sans ça elles valent 0, hors de l'échelle 1-10, et Korrah se
 * retrouve paralysée dès le premier combat.
 * @author JOKO
 *
 * @param depart
 * @text Valeur de départ (1 à 10)
 * @type number
 * @min 1
 * @max 10
 * @default 7
 * @desc 7 place les quatre héros dans leur bande « normale » (6-8).
 *
 * @param varVesper
 * @text Vesper — maîtrise de soi
 * @type variable
 * @default 11
 *
 * @param varKorrah
 * @text Korrah — concentration
 * @type variable
 * @default 12
 *
 * @param varLudwing
 * @text ludwing — LOU
 * @type variable
 * @default 13
 *
 * @param varAel
 * @text Aël — tianaa
 * @type variable
 * @default 14
 *
 * @param reparerSaves
 * @text Réparer aussi les sauvegardes existantes ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Au chargement, une variable restée à 0 (hors échelle) est remise à la valeur de départ.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  POURQUOI CE PLUGIN EXISTE
 * ═══════════════════════════════════════════════════════════════════════════
 *  Les quatre héros ont chacun une variable d'état mental, sur une échelle de
 *  1 à 10 (Neyssa_Concentration : « Valeur entière de 1 à 10 »). Leurs états
 *  passifs s'y accrochent :
 *
 *      Vesper  · variable 11 · Sérénité 9+ · NORMALTHY 6-8 · Folie ≤ 2
 *      Korrah  · variable 12 · Génie 9+    · normal 6-8    · Méditation ≤ 2
 *      ludwing · variable 13 · Maître 9+   · Agaçant 4-6   · Insupportable 2-3
 *      Aël     · variable 14 · Confiance 9+· normal 6-8    · Blocage ≤ 1
 *
 *  Or RPG Maker démarre TOUTES les variables à **0**, ce qui est hors de
 *  l'échelle. Conséquence mesurée en lançant le jeu :
 *
 *    • Korrah reçoit l'état #25 « Méditation Profonde » (restriction 4)
 *      dès la nouvelle partie → ELLE NE PEUT PAS AGIR, jamais, dans aucun
 *      combat ;
 *    • Vesper reçoit « Folie Destructrice » d'entrée ;
 *    • ludwing et Aël n'ont AUCUN état mental, leurs bandes commençant plus
 *      haut.
 *
 *  Ce plugin pose simplement la valeur de départ. Il ne touche à rien d'autre :
 *  ni aux états, ni aux conditions, ni aux cartes, ni aux événements.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  COMMANDE DE PLUGIN
 *  ─────────────────────────────────────────────────────────────────────────
 *    MENTAL init            remet les quatre variables à la valeur de départ
 *    MENTAL etat            affiche les quatre valeurs
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('EtatMental');
    var DEPART = parseInt(P['depart'] || 7);
    var VARS = [
        { v: parseInt(P['varVesper']  || 11), qui: 'Vesper',  quoi: 'maîtrise de soi' },
        { v: parseInt(P['varKorrah']  || 12), qui: 'Korrah',  quoi: 'concentration' },
        { v: parseInt(P['varLudwing'] || 13), qui: 'ludwing', quoi: 'LOU' },
        { v: parseInt(P['varAel']     || 14), qui: 'Aël',     quoi: 'tianaa' }
    ];
    var REPARER = String(P['reparerSaves'] || 'true') === 'true';

    /** Pose la valeur de départ. force = true : même si la variable a déjà une valeur. */
    function poser(force) {
        if (!$gameVariables) return;
        var bouge = false;
        VARS.forEach(function (e) {
            var actuel = $gameVariables.value(e.v);
            // 0 (ou hors échelle) = jamais initialisée : c'est ça qu'on répare.
            if (force || !(actuel >= 1 && actuel <= 10)) {
                $gameVariables.setValue(e.v, DEPART);
                bouge = true;
            }
        });
        if (bouge) rafraichir();
    }

    /**
     * YEP_AutoPassiveStates met les états passifs EN CACHE (_passiveStatesRaw),
     * calculé une seule fois et vidé uniquement par refresh(). Les acteurs sont
     * créés AVANT qu'on pose les variables : sans ce rafraîchissement, ils
     * gardent les états calculés quand les variables valaient encore 0 — et
     * Korrah reste paralysée malgré la correction.
     */
    function rafraichir() {
        try {
            if ($gameActors && $gameActors._data) {
                $gameActors._data.forEach(function (a) { if (a && a.refresh) a.refresh(); });
            }
        } catch (e) { }
    }

    // ── nouvelle partie ─────────────────────────────────────────────────────
    var _setup = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        _setup.call(this);
        try { poser(true); } catch (e) { }
    };

    // ── sauvegarde existante : on ne répare que ce qui est hors échelle ─────
    var _extract = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _extract.call(this, contents);
        if (REPARER) { try { poser(false); } catch (e) { } }
    };

    // ── commande de plugin ──────────────────────────────────────────────────
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'MENTAL') return;
        var sous = (args[0] || '').toLowerCase();
        if (sous === 'init') {
            poser(true);
        } else if (sous === 'etat') {
            VARS.forEach(function (e) {
                var t = e.qui + ' — ' + e.quoi + ' (variable ' + e.v + ') : ' + $gameVariables.value(e.v);
                if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t);
            });
        }
    };
})();
