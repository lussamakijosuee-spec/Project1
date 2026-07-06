//=============================================================================
// FusionMana.js — v1.0  ·  La Fusion des Mana (deux sources fondues en une)
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//   À charger APRÈS CorruptionAme et Errance.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La FUSION : verser une source dans une autre (Âme→Corps).
 * Puissance décuplée, mais chaque tour tire vers DEUX Chutes à la fois.
 * @author JOKO
 *
 * @param etatFusion
 * @text État de Fusion (Chair d'Âme)
 * @type state
 * @default 195
 *
 * @param soulVar
 * @text Variable du stock d'âmes
 * @type variable
 * @default 15
 *
 * @param coutAme
 * @text Coût d'entrée (âmes du stock)
 * @type number
 * @min 0
 * @default 4
 * @desc Âmes consommées pour entrer en Fusion. Si le stock est insuffisant, elle s'arrache l'âme (grosse Errance).
 *
 * @param erranceSansAme
 * @text Errance si pas d'âmes
 * @type number
 * @min 0
 * @default 18
 *
 * @param corruptionTour
 * @text Corps — corruption par tour
 * @type number
 * @min 0
 * @default 4
 *
 * @param erranceTour
 * @text Âme — errance par tour
 * @type number
 * @min 0
 * @default 3
 *
 * @param escalade
 * @text Le prix grandit chaque tour ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Chaque tour de Fusion ajoute +1 aux deux prix : plus tu restes fusionné, plus tu brûles vite aux deux bouts.
 *
 * @param acteurRequis
 * @text Réservé à l'acteur (0 = tous)
 * @type number
 * @default 0
 * @desc Si > 0, seul cet acteur (Thylane) peut entrer en Fusion. 0 = quiconque possède la technique.
 *
 * @param animationEntree
 * @text Animation d'entrée
 * @type animation
 * @default 401
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA FUSION DES MANA                                                  by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Le Mana Semi-Parfait ÉQUILIBRE les trois sources (la voie sûre, au centre).
 *  La FUSION fait l'inverse : elle en fond DEUX l'une dans l'autre — un
 *  raccourci violent, plus puissant qu'une source seule, mais qui, faute
 *  d'équilibre, ne stabilise pas : il tire vers les DEUX Chutes concernées.
 *
 *  ▶ « LA CHAIR D'ÂME » (Âme → Corps) — la technique de Thylane :
 *    elle verse son âme dans son corps et se taille une chair de mana négatif.
 *      Gain  : état « Chair d'Âme » (ATK ×1.45, DEF ×1.30, +12 % crit, robuste).
 *      Entrée: consomme coutAme âmes (var soulVar) ; sinon elle s'arrache
 *              l'âme (+erranceSansAme d'Errance d'un coup).
 *      Prix  : CHAQUE TOUR, +corruptionTour (vers la Bête) ET +erranceTour
 *              (vers l'Errant). Avec l'escalade, le prix monte tour après tour.
 *    → Fusionner longtemps = risquer DEUX chutes en même temps (et avec
 *      ChutesDefinitives, la perte est définitive). Une arme à double tranchant.
 *
 *  DÉCLENCHER : une compétence avec la note  <FusionChair>  (le skill 807
 *  « ⟡ Fusion — la Chair d'Âme » l'a déjà). Ou : commande  FUSION chair <id>.
 *  ARRÊTER : la Fusion tombe en fin de combat ; ou  FUSION fin <id>.
 *
 *  SCRIPT :  window.Fusion.actif(actorId)  → true si l'acteur est fusionné.
 *
 *  (Les autres paires — Corps→Esprit, Esprit→Âme — s'ajoutent sur ce moteur ;
 *   demande-les si tu veux les deux autres Fusions.)
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('FusionMana');
    var ETAT = parseInt(P['etatFusion'] || 195);
    var SOUL_VAR = parseInt(P['soulVar'] || 15);
    var COUT = parseInt(P['coutAme'] || 4);
    var ERR_SANS = parseInt(P['erranceSansAme'] || 18);
    var CORR_T = parseInt(P['corruptionTour'] || 4);
    var ERR_T = parseInt(P['erranceTour'] || 3);
    var ESCALADE = String(P['escalade'] || 'true') === 'true';
    var ACTEUR = parseInt(P['acteurRequis'] || 0);
    var ANIM = parseInt(P['animationEntree'] || 401);

    function log(t) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', t); w.push('wait'); }
        else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t);
    }

    var Fusion = {
        actif: function (id) {
            var a = $gameActors && $gameActors.actor(id);
            return !!(a && a.isStateAffected(ETAT));
        },
        entrer: function (actor) {
            if (!actor || !actor.isActor()) return;
            if (ACTEUR > 0 && actor.actorId() !== ACTEUR) {
                log('\\C[8]' + actor.name() + ' ne connaît pas cette Fusion.\\C[0]');
                return;
            }
            if (actor.isStateAffected(ETAT)) return;
            // prix d'entrée : les âmes, ou l'âme elle-même
            var souls = $gameVariables ? $gameVariables.value(SOUL_VAR) : 0;
            if (souls >= COUT) {
                if (COUT > 0 && $gameVariables) $gameVariables.setValue(SOUL_VAR, souls - COUT);
            } else if (window.Errance) {
                try { window.Errance.add(actor.actorId(), ERR_SANS); } catch (e) {}
                log('\\C[2]Pas d\'âmes à brûler — ' + actor.name() + ' s\'arrache la sienne.\\C[0]');
            }
            actor.addState(ETAT);
            actor._fusionTours = 0;
            if (ANIM > 0 && $gameParty.inBattle()) actor.startAnimation(ANIM);
            if ($gameScreen) $gameScreen.startFlash([176, 112, 224, 200], 24);
            log('\\C[18]★ ' + actor.name() + ' verse son âme dans sa chair — FUSION.\\C[0]');
        },
        finir: function (actor) {
            if (actor && actor.isStateAffected(ETAT)) {
                actor.removeState(ETAT);
                log('\\C[6]La Fusion reflue. ' + actor.name() + ' redevient un seul être.\\C[0]');
            }
        }
    };
    window.Fusion = Fusion;

    // Déclenchement par la note <FusionChair>
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        var it = this.item();
        if (it && it.meta && it.meta.FusionChair) {
            var s = this.subject();
            if (s && s.isActor && s.isActor() && !this._fusionFaite) {
                this._fusionFaite = true;
                Fusion.entrer(s);
            }
        }
    };

    // Le prix, chaque tour
    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        $gameParty.battleMembers().forEach(function (a) {
            if (!a.isStateAffected(ETAT)) return;
            a._fusionTours = (a._fusionTours || 0) + 1;
            var bonus = ESCALADE ? (a._fusionTours - 1) : 0;
            var corr = CORR_T + bonus, err = ERR_T + bonus;
            try { if (corr > 0 && window.Corruption) window.Corruption.add(a.actorId(), corr); } catch (e) {}
            try { if (err > 0 && window.Errance) window.Errance.add(a.actorId(), err); } catch (e) {}
            if (a._fusionTours >= 2) {
                log('\\C[8]La Fusion dévore ' + a.name() + ' des deux côtés… (+' + corr + ' Bête, +' + err + ' Errant)\\C[0]');
            }
        });
        _startTurn.call(this);
    };

    // Aura pourpre (Corps violet + Âme rose fondus) tant que la Fusion tient
    if (typeof Sprite_Actor !== 'undefined') {
        var _upd = Sprite_Actor.prototype.update;
        Sprite_Actor.prototype.update = function () {
            _upd.call(this);
            try {
                var a = this._actor;
                if (a && a.isStateAffected(ETAT)) {
                    this._fusT = (this._fusT || 0) + 0.12;
                    var p = Math.sin(this._fusT) * 0.5 + 0.5;
                    this.setBlendColor([Math.floor(120 * p), 0, Math.floor(150 * p), Math.floor(120 * p)]);
                } else if (this._fusT) {
                    this.setBlendColor([0, 0, 0, 0]); this._fusT = 0;
                }
            } catch (e) {}
        };
    }

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'FUSION') return;
        var sub = (args[0] || '').toLowerCase();
        var id = parseInt(args[1]) || 0;
        var a = $gameActors && $gameActors.actor(id);
        if (sub === 'chair') Fusion.entrer(a);
        else if (sub === 'fin') Fusion.finir(a);
    };
})();
