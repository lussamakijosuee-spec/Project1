//=============================================================================
// Neyssa_Concentration.js — v1.2
// Plugin de Concentration pour Neyssa (RPG Maker MV)
// by JOKO
//=============================================================================

/*:
 * @plugindesc v1.2 ■ Système de Concentration de Neyssa
 * Quatre paliers mentaux pilotés par variable, avec compteurs par combat.
 * @author JOKO
 *
 * @param --- Identité ---
 * @default
 *
 * @param actorId
 * @text ID Acteur — Neyssa
 * @type actor
 * @default 2
 * @desc ID de Neyssa dans la base de données Acteurs.
 *
 * @param concVar
 * @text Variable de Concentration
 * @type variable
 * @default 12
 * @desc Valeur entière de 1 à 10. Pilote tous les effets du plugin.
 *
 * @param stamVar
 * @text Variable d'Endurance
 * @type variable
 * @default 11
 * @desc Variable secondaire (réservée pour usage futur ou conditionnel).
 *
 * @param --- Palier 9-10 : Hyper-Concentration ---
 * @default
 *
 * @param evasionLimit
 * @text Limite d'Esquives / Combat
 * @type number
 * @min 1
 * @default 3
 * @desc Nb max d'esquives réflexes par combat. Au-delà, les réflexes sont épuisés.
 *
 * @param evasionChance
 * @text Probabilité d'Esquive (%)
 * @type number
 * @min 1
 * @max 100
 * @default 50
 *
 * @param evasionDrain
 * @text Drain de Concentration / Esquive
 * @type number
 * @min 0
 * @default 1
 * @desc Points de concentration déduits à chaque esquive réussie (0 = aucun drain).
 *
 * @param evasionAnimId
 * @text ID Animation — Esquive
 * @type animation
 * @default 51
 *
 * @param --- Palier 4-8 : Concentration Normale ---
 * @default
 *
 * @param shockwaveLimit
 * @text Limite d'Ondes de Choc / Combat
 * @type number
 * @min 1
 * @default 2
 * @desc Nb max d'ondes de choc par combat. Au-delà, l'effet est muet.
 *
 * @param shockwaveRatio
 * @text Puissance Onde (% de l'ATK)
 * @type number
 * @min 1
 * @max 100
 * @default 10
 *
 * @param itemDropChance
 * @text Probabilité Objet qui Tombe (%)
 * @type number
 * @min 1
 * @max 100
 * @default 50
 * @desc S'applique également au palier 2-3.
 *
 * @param --- Palier 1 : Tête Ailleurs ---
 * @default
 *
 * @param failChance
 * @text Probabilité d'Échec Total (%)
 * @type number
 * @min 1
 * @max 100
 * @default 33
 *
 * @param failTpLoss
 * @text PT perdus en cas d'Échec
 * @type number
 * @min 0
 * @default 5
 *
 * @param failAnimId
 * @text ID Animation — Échec
 * @type animation
 * @default 5
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  NEYSSA CONCENTRATION SYSTEM — v1.2                           by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  PALIERS DE CONCENTRATION (Variable 12 par défaut)
 *  ──────────────────────────────────────────────────────────────────────────
 *  [ 9 – 10 ]  HYPER-CONCENTRATION
 *    → X% de chance d'esquiver un coup physique par pur réflexe
 *    → Limité à N esquives / combat — compteur affiché dans le log
 *    → Chaque esquive réussie draine D point(s) de concentration
 *
 *  [ 4 – 8 ]   CONCENTRATION NORMALE
 *    → Utiliser un objet : X% de chance qu'il tombe (effet annulé, objet perdu)
 *    → Attaque physique ratée : onde de choc sur tous les ennemis (10% ATK)
 *      Limitée à N ondes par combat
 *
 *  [ 2 – 3 ]   DISTRACTION
 *    → Objet qui tombe (même mécanique, sans aucun bonus défensif)
 *
 *  [ 1 ]       TÊTE AILLEURS
 *    → X% de chance d'échouer toute action offensive (dégâts annulés)
 *    → Perte de N PT en cas d'échec
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  LIMITATIONS PAR COMBAT
 *  ──────────────────────────────────────────────────────────────────────────
 *  Chaque mécanique spéciale est bridée par un compteur remis à zéro
 *  automatiquement à chaque nouveau combat. Quand la limite est atteinte,
 *  l'effet ne se déclenche plus jusqu'à la fin du combat.
 *
 *    Esquives réflexes  → paramètre "Limite d'Esquives / Combat"
 *    Ondes de choc      → paramètre "Limite d'Ondes de Choc / Combat"
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  COMMANDES PLUGIN
 *  ──────────────────────────────────────────────────────────────────────────
 *  NEYSSA_CONC reset_counters        Remet esquives et ondes à 0
 *  NEYSSA_CONC set_evasion <N>       Force le compteur d'esquives à N
 *  NEYSSA_CONC set_shockwave <N>     Force le compteur d'ondes à N
 *
 *  Exemples :
 *    NEYSSA_CONC set_evasion 0       → Neyssa retrouve tous ses réflexes
 *    NEYSSA_CONC set_shockwave 99    → Désactive les ondes pour ce combat
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    //=========================================================================
    // LECTURE DES PARAMÈTRES
    //=========================================================================

    var P = PluginManager.parameters('Neyssa_Concentration');

    var ACTOR_ID    = parseInt(P['actorId']        || 2);
    var CONC_VAR    = parseInt(P['concVar']         || 12);
    // var STAM_VAR = parseInt(P['stamVar']         || 11); // réservé

    var EVA_LIMIT   = parseInt(P['evasionLimit']    || 3);
    var EVA_CHANCE  = parseInt(P['evasionChance']   || 50) / 100;
    var EVA_DRAIN   = parseInt(P['evasionDrain']    || 1);
    var EVA_ANIM    = parseInt(P['evasionAnimId']   || 51);

    var SHOCK_LIMIT = parseInt(P['shockwaveLimit']  || 2);
    var SHOCK_RATIO = parseInt(P['shockwaveRatio']  || 10) / 100;

    var DROP_CHANCE = parseInt(P['itemDropChance']  || 50) / 100;

    var FAIL_CHANCE = parseInt(P['failChance']      || 33) / 100;
    var FAIL_TP     = parseInt(P['failTpLoss']      || 5);
    var FAIL_ANIM   = parseInt(P['failAnimId']      || 5);

    //=========================================================================
    // COMPTEURS PAR COMBAT
    //=========================================================================

    /**
     * _counters — c'est le cœur de la "limitation".
     * Chaque mécanique spéciale est bridée par ces deux valeurs,
     * automatiquement remises à zéro au début de chaque combat.
     *
     *   evasions   : nb d'esquives réflexes déjà utilisées ce combat
     *   shockwaves : nb d'ondes de choc déjà déclenchées ce combat
     */
    var _counters = {
        evasions:   0,
        shockwaves: 0
    };

    //=========================================================================
    // FONCTIONS UTILITAIRES
    //=========================================================================

    /** Lit la valeur actuelle de concentration. */
    function getConc() {
        return $gameVariables.value(CONC_VAR);
    }

    /** Écrit une nouvelle valeur de concentration (clampée entre 1 et 10). */
    function setConc(val) {
        $gameVariables.setValue(CONC_VAR, Math.max(1, Math.min(10, val)));
    }

    /**
     * Vérifie qu'un battler est bien Neyssa.
     * Défensif : ne plante pas si battler est null ou un ennemi.
     */
    function isNeyssa(battler) {
        return !!(
            battler &&
            battler.isActor &&
            battler.isActor() &&
            battler.actorId &&
            battler.actorId() === ACTOR_ID
        );
    }

    /** Ajoute une ligne dans le log de combat (sans planter si la scène n'est pas prête). */
    function battleLog(text) {
        var scene = SceneManager._scene;
        if (scene && scene._logWindow) {
            scene._logWindow.addText(text);
        }
    }

    /** Joue un effet sonore de bataille. */
    function playSE(name, vol, pitch) {
        AudioManager.playSe({
            name:   name,
            volume: (vol   !== undefined) ? vol   : 90,
            pitch:  (pitch !== undefined) ? pitch : 100,
            pan:    0
        });
    }

    //=========================================================================
    // RESET DES COMPTEURS À CHAQUE DÉBUT DE COMBAT
    //=========================================================================

    var _BM_startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _counters.evasions   = 0;
        _counters.shockwaves = 0;
        _BM_startBattle.call(this);
    };

    //=========================================================================
    // COMMANDES PLUGIN
    //=========================================================================

    var _GI_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _GI_pluginCommand.call(this, command, args);

        if (command !== 'NEYSSA_CONC') return;

        switch (args[0]) {
            case 'reset_counters':
                _counters.evasions   = 0;
                _counters.shockwaves = 0;
                break;
            case 'set_evasion':
                _counters.evasions   = Math.max(0, parseInt(args[1]) || 0);
                break;
            case 'set_shockwave':
                _counters.shockwaves = Math.max(0, parseInt(args[1]) || 0);
                break;
        }
    };

    //=========================================================================
    // HOOK PRINCIPAL — Game_Action.prototype.apply
    //
    // Point d'entrée unique pour :
    //   • L'esquive réflexe (palier 9-10) → court-circuit avant apply
    //   • Le marquage "objet tombé" (palier 2-8) → drapeau avant apply
    //   • L'onde de choc (palier 4-8) → vérification post-apply
    //=========================================================================

    var _GA_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        var c = getConc();

        // Réinitialise le drapeau "objet tombé" pour chaque nouvelle action
        this._neyssaItemDropped = false;

        // ─────────────────────────────────────────────────────────────────────
        // PALIER 9–10 ▶ HYPER-CONCENTRATION : Esquive par réflexe
        // ─────────────────────────────────────────────────────────────────────
        if (isNeyssa(target) && this.isPhysical() && c >= 9) {

            var limitOk = (_counters.evasions < EVA_LIMIT);
            var diceOk  = (Math.random() < EVA_CHANCE);

            if (limitOk && diceOk) {

                // Construit un résultat d'esquive propre, sans passer par le calcul
                var result = target.result();
                result.clear();
                result.used   = true;
                result.evaded = true;

                // Feedback audiovisuel
                target.startAnimation(EVA_ANIM);
                playSE('Evasion1', 100, 120);

                // Incrémentation du compteur + message avec nb restant
                _counters.evasions++;
                var evaRest = EVA_LIMIT - _counters.evasions;
                battleLog(
                    evaRest > 0
                        ? "L'Hyper-Concentration de Neyssa dévie le coup ! (" + evaRest + " réflexe(s) restant)"
                        : "L'Hyper-Concentration de Neyssa dévie le coup ! — Réflexes épuisés pour ce combat."
                );

                // Drain de concentration après l'esquive
                if (EVA_DRAIN > 0) {
                    setConc(c - EVA_DRAIN);
                }

                return; // ← Court-circuit total : l'attaque est annulée
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // PALIER 2–8 ▶ OBJET QUI TOMBE (pré-application)
        // L'objet est déjà consommé par le moteur avant d'arriver ici ;
        // on bloque uniquement ses effets via le drapeau _neyssaItemDropped.
        // ─────────────────────────────────────────────────────────────────────
        if (isNeyssa(this.subject()) && this.isItem() && c >= 2 && c <= 8) {

            if (Math.random() < DROP_CHANCE) {
                this._neyssaItemDropped = true; // bloquera applyItemEffect / applyItemUserEffect
                playSE('Shatter', 90, 100);
                battleLog(
                    c <= 3
                        ? "Distraction — l'objet échappe des mains de Neyssa ! (perdu)"
                        : "Maladresse — Neyssa fait tomber l'objet ! (perdu)"
                );
                // On laisse apply() se terminer normalement pour que result.used soit posé,
                // mais aucun effet ne sera appliqué grâce au drapeau.
            }
        }

        // ─── Application standard ────────────────────────────────────────────
        _GA_apply.call(this, target);

        // ─────────────────────────────────────────────────────────────────────
        // PALIER 4–8 ▶ ONDE DE CHOC sur attaque physique ratée
        // ─────────────────────────────────────────────────────────────────────
        var postResult = target.result();

        if (this.isPhysical() && c >= 4 && c <= 8 && !postResult.isHit()) {

            if (_counters.shockwaves < SHOCK_LIMIT) {
                var shock   = Math.max(1, Math.floor(this.subject().atk * SHOCK_RATIO));
                var enemies = $gameTroop.aliveMembers();

                enemies.forEach(function (en) {
                    en.gainHp(-shock);       // gainHp renseigne automatiquement en._result
                    en.startDamagePopup();   // lit en._result pour afficher les dégâts
                    en.clearResult();        // nettoie pour ne pas polluer l'affichage principal
                });

                $gameScreen.startShake(5, 5, 20);
                _counters.shockwaves++;

                var shockRest = SHOCK_LIMIT - _counters.shockwaves;
                battleLog(
                    shockRest > 0
                        ? "L'impact manqué fait trembler le sol ! Onde de choc : " + shock + " dégâts. (" + shockRest + " onde(s) restante(s))"
                        : "L'impact manqué fait trembler le sol ! Onde de choc : " + shock + " dégâts. — Ondes épuisées pour ce combat."
                );
            }
        }
    };

    //=========================================================================
    // HOOK — Game_Action.prototype.applyItemEffect
    // Bloque chaque effet individuel d'un objet si le drapeau est levé.
    //=========================================================================

    var _GA_applyItemEffect = Game_Action.prototype.applyItemEffect;
    Game_Action.prototype.applyItemEffect = function (target, effect) {
        if (this._neyssaItemDropped) return;
        _GA_applyItemEffect.call(this, target, effect);
    };

    //=========================================================================
    // HOOK — Game_Action.prototype.applyItemUserEffect
    // Bloque le gain de TP de l'utilisateur si l'objet est tombé.
    //=========================================================================

    var _GA_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function (target) {
        if (this._neyssaItemDropped) return;
        _GA_applyItemUserEffect.call(this, target);
    };

    //=========================================================================
    // HOOK — Game_Action.prototype.executeDamage
    // PALIER 1 ▶ TÊTE AILLEURS : annulation aléatoire des dégâts offensifs.
    //
    // On passe value = 0 à la méthode originale plutôt que de retourner
    // prématurément, pour rester compatible avec les plugins tiers qui
    // wrappent aussi executeDamage (ex : Yanfly Critical Control, etc.).
    //=========================================================================

    var _GA_executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        var c = getConc();

        if (isNeyssa(this.subject()) && c <= 1 && value > 0) {

            if (Math.random() < FAIL_CHANCE) {
                // Animation et son côté Neyssa (le sujet, pas la cible)
                this.subject().startAnimation(FAIL_ANIM);
                playSE('Buzzer1', 80, 100);

                // Pénalité en PT
                if (FAIL_TP > 0) {
                    this.subject().gainTp(-FAIL_TP);
                }

                battleLog("Neyssa a la tête ailleurs… Son action échoue complètement !");
                value = 0; // Les dégâts sont annulés
            }
        }

        _GA_executeDamage.call(this, target, value);
    };

})();
