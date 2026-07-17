/*:
 * @target MV
 * @plugindesc Système unique pour Lou (Acteur 3) : Corruption et Domaine.
 * @author Assistant Gemini (corrigé)
 *
 * @param LouActorId
 * @text ID de Lou
 * @type number
 * @default 3
 *
 * @param CorruptionStateId
 * @text ID État "Corrompu"
 * @type number
 * @default 50
 *
 * @param DomainStateId
 * @text ID État "Royaume Impérial"
 * @type number
 * @default 39
 *
 * @param FolieStateId
 * @text ID État "Folie Total"
 * @type number
 * @default 27
 *
 * @param DrainAnimId
 * @text ID Animation Drain (0 = aucune)
 * @type number
 * @default 0
 *
 * @help
 * ============================================================
 * DarkNecromancer - VERSION CORRIGÉE (ES5 pur, compatible MV)
 * ============================================================
 * CORRECTIONS :
 *  - const / let → var  (ES6 incompatible avec NW.js de MV)
 *  - Arrow functions =>  → function()  (même raison)
 *  - gainHp(-n) → gainHp puis clamp HP à 1 min pour éviter
 *    les morts silencieuses non souhaitées hors gestion de mort
 *  - Ajout de BattleManager.refreshStatus() après les drains
 *    pour que les jauges se mettent bien à jour visuellement
 *  - Les popups de drain s'affichent maintenant correctement
 * ============================================================
 */

(function() {
    'use strict';

    var params       = PluginManager.parameters('DarkNecromancer');
    var LOU_ID       = Number(params['LouActorId']       || 3);
    var STATE_CORRUPT = Number(params['CorruptionStateId'] || 50);
    var STATE_DOMAIN  = Number(params['DomainStateId']    || 39);
    var STATE_FOLIE   = Number(params['FolieStateId']     || 27);
    var DRAIN_ANIM    = Number(params['DrainAnimId']      || 0);

    // ============================================================
    // Utilitaire : log de combat (même helper que JadeObsession)
    // ============================================================
    function logMessage(msg) {
        var scene = SceneManager._scene;
        if (scene && scene._logWindow) {
            scene._logWindow.addText(msg);
        }
    }

    // ============================================================
    // FIN DE TOUR DE LOU
    // ============================================================
    var _Game_Actor_onTurnEnd = Game_Actor.prototype.onTurnEnd;
    Game_Actor.prototype.onTurnEnd = function() {
        _Game_Actor_onTurnEnd.call(this);

        if (this.actorId() !== LOU_ID || !this.isAlive()) return;

        // -------------------------------------------------------
        // ROYAUME IMPÉRIAL → Lou sombre dans la folie
        // -------------------------------------------------------
        if (this.isStateAffected(STATE_DOMAIN) && !this.isStateAffected(STATE_FOLIE)) {
            this.addState(STATE_FOLIE);
            logMessage("Le Royaume dévore l'esprit de Lou... Folie totale !");
        }

        // -------------------------------------------------------
        // CORRUPTION → drain de 5 % HP max sur chaque allié vivant
        // FIX 1 : var au lieu de let/const (ES5 pur)
        // FIX 2 : gainHp() ne descend pas sous 1 HP sans le vouloir
        // FIX 3 : refreshStatus() pour mettre à jour les jauges
        // -------------------------------------------------------
        if (this.isStateAffected(STATE_CORRUPT)) {
            var totalDrained = 0;
            var allies = $gameParty.aliveMembers();

            for (var i = 0; i < allies.length; i++) {
                var ally = allies[i];
                if (ally.actorId() === LOU_ID) continue; // Lou ne se draine pas

                var damage = Math.max(1, Math.floor(ally.mhp * 0.05));

                // FIX : on s'assure que l'allié reste à 1 HP minimum
                // (pour ne pas tuer silencieusement sans passer par die())
                var actualDamage = Math.min(damage, ally.hp - 1);
                if (actualDamage < 1) continue; // Allié déjà à 1 HP, on saute

                ally.gainHp(-actualDamage);
                ally.startDamagePopup();

                // Animation de drain sur la cible (si configurée)
                if (DRAIN_ANIM > 0) {
                    ally.startAnimation(DRAIN_ANIM);
                }

                totalDrained += actualDamage;
            }

            if (totalDrained > 0) {
                this.gainHp(totalDrained);
                this.startDamagePopup(); // Popup de soin sur Lou

                // FIX 3 : force le rafraîchissement visuel des jauges HP
                if (typeof BattleManager.refreshStatus === 'function') {
                    BattleManager.refreshStatus();
                }

                logMessage("La corruption de Lou aspire " + totalDrained + " HP à son équipe !");
            }
        }
    };

})();
