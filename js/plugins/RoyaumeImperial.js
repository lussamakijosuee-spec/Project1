//=============================================================================
// RoyaumeImperial.js — v1.0  ·  Le Royaume Impérial des Ténèbres (Domaine)
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//   À charger APRÈS InvocationAmes, Errance et JadeEntitePlunging.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le Domaine de ludwing : toutes les âmes reviennent, toutes
 * les invocations sont libres, stats décuplées — et l'arsenal des Ténèbres.
 * @author JOKO
 *
 * @param etatDomaine
 * @text État — le Domaine
 * @type state
 * @default 198
 *
 * @param etatContre
 * @text État — Contre Totale
 * @type state
 * @default 199
 *
 * @param etatTrauma
 * @text État — Traumatisé (déstabilisé)
 * @type state
 * @default 200
 *
 * @param soulVar
 * @text Variable du stock d'âmes
 * @type variable
 * @default 15
 *
 * @param surgeDomaine
 * @text Âmes qui reviennent (entrée du Domaine)
 * @type number
 * @default 30
 * @desc En déployant le Domaine, toutes les âmes reviennent : le stock (var 15) grimpe d'un coup.
 *
 * @param aspirationParAme
 * @text Aspiration — régen par âme (toute l'aventure)
 * @type number
 * @default 6
 * @desc PV/PM rendus par âme aspirée (mise à l'échelle sur le TOTAL d'âmes récoltées dans la partie).
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE ROYAUME IMPÉRIAL DES TÉNÈBRES                                    by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'expansion de domaine de ludwing (le Symbole). Le skill 810 le déploie :
 *
 *  ▶ TOUTES LES ÂMES REVIENNENT : le stock d'âmes (var 15) déborde
 *    (surgeDomaine) — ce qui, fidèle au lore, fait aussi monter l'Errance.
 *  ▶ TOUTES LES INVOCATIONS SONT LIBRES : tant que le Domaine tient, les
 *    compétences <Invocation: n> ne coûtent plus d'âmes et ne sont jamais grisées.
 *  ▶ STATS DÉCUPLÉES : l'état « Domaine » (198) — MAT ×1.6, MDF ×1.4, ATK ×1.3.
 *
 *  L'ARSENAL (skills, tous utilisables dans le Domaine) :
 *   • Lotus des Ténèbres (66) — attaque unique dévastatrice. (déjà en base)
 *   • Pluie de Lance du Styx (811) — pluie d'ombre sur TOUS les ennemis.
 *   • Annihilation des Ténèbres (68) — zone : détruit le corps ET la magie
 *       (<SceauMagie> : PM de la cible réduits à 0 + MAT brisé).
 *   • Contre Totale (812) — <ContreTotale> : tout ce qui te frappe ce tour est
 *       renvoyé à l'envoyeur.
 *   • Aspiration des Âmes Damnées (70) — <AspirationDamnees> : tu aspires les
 *       âmes de tous ceux que tu as tués dans l'aventure ; régénère PV + PM +
 *       SANTÉ MENTALE proportionnellement au TOTAL d'âmes récoltées — mais
 *       revivre les traumas te DÉSTABILISE (état « Traumatisé », 200).
 *
 *  Compteur d'âmes de toute la partie : window.RoyaumeTenebres.total().
 *  Commandes : DOMAINE ouvrir <id>  ·  DOMAINE fermer <id>.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('RoyaumeImperial');
    var DOMAINE = parseInt(P['etatDomaine'] || 198);
    var CONTRE = parseInt(P['etatContre'] || 199);
    var TRAUMA = parseInt(P['etatTrauma'] || 200);
    var SOUL_VAR = parseInt(P['soulVar'] || 15);
    var SURGE = parseInt(P['surgeDomaine'] || 30);
    var ASP = parseInt(P['aspirationParAme'] || 6);

    function log(t) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', t); w.push('wait'); }
        else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t);
    }

    //=========================================================================
    // Compteur d'âmes de TOUTE l'aventure (pour l'Aspiration)
    //=========================================================================
    var RoyaumeTenebres = {
        total: function () { return ($gameSystem && $gameSystem._amesTotal) || 0; },
        domaineActif: function (id) {
            var a = $gameActors && $gameActors.actor(id);
            return !!(a && a.isStateAffected(DOMAINE));
        }
    };
    window.RoyaumeTenebres = RoyaumeTenebres;

    var _setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function (variableId, value) {
        var before = (variableId === SOUL_VAR) ? this.value(variableId) : 0;
        _setValue.call(this, variableId, value);
        if (variableId === SOUL_VAR) {
            var delta = this.value(variableId) - before;
            if (delta > 0 && $gameSystem) $gameSystem._amesTotal = (($gameSystem._amesTotal) || 0) + delta;
        }
    };

    //=========================================================================
    // INVOCATIONS LIBRES dans le Domaine (bypass du coût en âmes)
    //=========================================================================
    function estInvocation(skill) { return !!(skill && skill.meta && skill.meta.Invocation); }
    function enDomaine(b) { return b && b.isActor && b.isActor() && b.isStateAffected(DOMAINE); }

    var _can = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
        if (enDomaine(this) && estInvocation(skill)) {
            return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
        }
        return _can.call(this, skill);
    };
    var _pay = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function (skill) {
        if (enDomaine(this) && estInvocation(skill) && $gameVariables) {
            var keep = $gameVariables.value(SOUL_VAR);
            _pay.call(this, skill);
            // les âmes reviennent : on annule la dépense (écriture directe, sans
            // relancer les hooks d'Errance/total)
            if ($gameVariables._data) $gameVariables._data[SOUL_VAR] = keep;
            return;
        }
        _pay.call(this, skill);
    };

    //=========================================================================
    // DÉPLOIEMENT DU DOMAINE  <RoyaumeImperial>
    //=========================================================================
    var RT = {
        ouvrir: function (actor) {
            if (!actor || !actor.isActor()) return;
            var id = actor.actorId();
            if ($gameScreen) { $gameScreen.startTint([-90, -90, -50, 130], 40); $gameScreen.startFlash([90, 0, 130, 220], 40); }
            if (SURGE > 0 && $gameVariables) {
                $gameVariables.setValue(SOUL_VAR, $gameVariables.value(SOUL_VAR) + SURGE);
            }
            actor.addState(DOMAINE);
            log('\\C[18]★ ' + actor.name() + ' déploie le ROYAUME IMPÉRIAL DES TÉNÈBRES.\\C[0]');
            log('\\C[8]Les âmes reviennent. Toutes. Ici, il est le maître.\\C[0]');
        },
        fermer: function (actor) {
            if (actor && actor.isStateAffected(DOMAINE)) {
                actor.removeState(DOMAINE);
                log('\\C[6]Le Domaine se referme.\\C[0]');
            }
        }
    };

    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        var it = this.item();
        if (!it || !it.meta) return;
        var s = this.subject();

        // Déployer le Domaine
        if (it.meta.RoyaumeImperial !== undefined && s && s.isActor && s.isActor() && !this._domFait) {
            this._domFait = true;
            RT.ouvrir(s);
        }

        // Annihilation : sceller la magie de la cible
        if (it.meta.SceauMagie !== undefined && target && target.isAlive()) {
            var r = target.result();
            if (r && (r.hpDamage > 0 || r.used)) {
                if (target.setMp) target.setMp(0);
                if (target.addDebuff) target.addDebuff(4, 3);   // MAT brisé (3 tours)
            }
        }

        // Aspiration des Âmes Damnées : régen sur le total d'âmes de la partie
        if (it.meta.AspirationDamnees !== undefined && s && s.isAlive()) {
            var total = RoyaumeTenebres.total();
            var soin = Math.min(s.mhp, ASP * total);
            var mana = Math.min(s.mmp, Math.floor(ASP * total * 0.6));
            if (soin > 0) { s.gainHp(soin); }
            if (mana > 0) { s.gainMp(mana); }
            s.startDamagePopup();
            // santé mentale restaurée…
            if (s.isActor && s.isActor() && window.Ame) {
                try { window.Ame.bon(s.actorId(), Math.max(1, Math.floor(total / 15))); } catch (e) {}
            }
            // …mais revivre les traumas déstabilise
            if (s.addState) s.addState(TRAUMA);
            log('\\C[2]' + (s.name ? s.name() : '') + ' aspire les âmes des damnés (' + total + ' âmes) — et revit chacune de leurs morts.\\C[0]');
        }

        // Contre Totale : armer la garde absolue
        if (it.meta.ContreTotale !== undefined && s && s.isActor && s.isActor()) {
            s.addState(CONTRE);
            s._contreTotale = true;
        }
    };

    //=========================================================================
    // CONTRE TOTALE — renvoie toute frappe subie ce tour
    //=========================================================================
    var _execDmg = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _execDmg.call(this, target, value);
        if (value > 0 && target && target.isStateAffected(CONTRE)) {
            var attacker = this.subject();
            if (attacker && attacker !== target && attacker.isAlive()) {
                attacker.gainHp(-value);
                attacker.startDamagePopup(); attacker.clearResult();
                log('\\C[16]CONTRE TOTALE — le coup revient à l\'envoyeur (-' + value + ' PV).\\C[0]');
                if (attacker.isDead()) attacker.performCollapse();
            }
        }
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'DOMAINE') return;
        var sub = (args[0] || '').toLowerCase();
        var a = $gameActors && $gameActors.actor(parseInt(args[1]) || 0);
        if (sub === 'ouvrir') RT.ouvrir(a);
        else if (sub === 'fermer') RT.fermer(a);
    };
})();
