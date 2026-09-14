//=============================================================================
// PorteurDAmes.js — v1.0 · CANON : seul ludwing peut UTILISER les âmes.
//   Les autres les récoltent — et l'Errance pèse sur chaque tueur.
// RPG Maker MV · by JOKO · charger APRÈS InvocationAmes, Errance, CanonPlus.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les âmes : tout le monde les récolte (tuer = +1 Errance
 * pour le tueur), mais SEUL le porteur (ludwing) peut les dépenser.
 * @author JOKO
 * @param porteurId
 * @text Acteur porteur (le seul à utiliser les âmes)
 * @type actor
 * @default 3
 * @param errParMort
 * @text Errance pour le tueur, par mise à mort
 * @type number
 * @default 1
 * @help
 *  ▶ Tuer pèse sur l'âme : CHAQUE mise à mort donne +1 Errance au tueur
 *    (peu importe qui). Récolter des âmes n'est jamais gratuit.
 *  ▶ Seul le porteur dépense : les skills <Invocation: n> sont grisés pour
 *    tout autre acteur (« ces âmes ne répondent qu'à leur porteur »).
 *  ▶ Les services en âmes (Graveur…) exigent le porteur dans le groupe.
 *  ▶ Menu : une ligne « ✦ âmes » au-dessus de l'or.
 *  Script : Porteur.present() · Porteur.id()
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('PorteurDAmes');
    var PORTEUR = parseInt(P['porteurId'] || 3);
    var ERR_MORT = parseInt(P['errParMort'] || 1);
    var Porteur = {
        id: function () { return PORTEUR; },
        present: function () { return $gameParty.members().some(function (m) { return m.actorId() === PORTEUR; }); }
    };
    window.Porteur = Porteur;

    // ── seul le porteur utilise les âmes (Invocations grisées pour les autres) ──
    var _can = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
        if (skill && skill.meta && skill.meta.Invocation !== undefined &&
            this.isActor && this.isActor() && this.actorId() !== PORTEUR) {
            return false;
        }
        return _can.call(this, skill);
    };

    // ── tuer pèse : +1 Errance pour le tueur, chaque mise à mort ──
    var _exec = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        var vivait = target && target.isEnemy && target.isEnemy() && target.isAlive();
        _exec.call(this, target, value);
        if (vivait && target.isDead()) {
            var s = this.subject();
            if (s && s.isActor && s.isActor()) {
                try { if (window.Errance) Errance.add(s.actorId(), ERR_MORT); } catch (e) {}
            }
        }
    };

    // ── menu : les âmes au-dessus de l'or ──
    var _cgw = Scene_Menu.prototype.createGoldWindow;
    Scene_Menu.prototype.createGoldWindow = function () {
        _cgw.call(this);
        try {
            var w = this._goldWindow;
            var sw = new Window_Base(w.x, w.y - w.height, w.width, w.height);
            var n = $gameVariables.value(15);
            sw.contents.fontSize = 18;
            sw.changeTextColor('#B79CF5');
            var p = Porteur.present() ? '' : ' (porteur absent)';
            sw.drawText('✦ ' + n + p, 0, 0, sw.contentsWidth(), 'right');
            this.addWindow(sw);
        } catch (e) {}
    };
})();
