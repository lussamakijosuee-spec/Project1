//=============================================================================
// ParolesMagic.js — v1.0  ·  Le Système des Paroles (magie ↔ santé mentale)
// RPG Maker MV   ·   by JOKO   ·   d'après le Compendium des Paroles
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La magie est une « parole » : plus elle est complexe, plus
 * elle exige de LUCIDITÉ (santé mentale). Esprit brisé = la parole se rompt
 * (contrecoup). Esprit lucide = la parole frappe plus fort. Additif.
 * @author JOKO
 *
 * @param backlashPct
 * @text Contrecoup (% des PV max)
 * @type number
 * @default 6
 *
 * @help
 * ──────────────────────────────────────────────────────────────────────────
 *  D'après le « Compendium des Paroles ». Toute compétence à coût de PM est une
 *  PAROLE de longueur L (sa complexité). La réussite dépend de la lucidité du
 *  lanceur (sa Santé Mentale) :
 *      lucidité      = jauge mentale (var 11-14) × 10   (0-100)
 *      concentration = MAG × max(0.15, lucidité/100)
 *      requise       = 8 · L^1.8
 *      précision     = 1 − e^(−L/3)
 *      réussite      = précision × min(1, conc / requise)
 *  • Réussite ratée → la parole se BRISE : aucun effet + CONTRECOUP (PV + 1 de
 *    santé mentale perdus).
 *  • Lucidité ≥ 90 → la parole tient parfaitement (+15% de puissance) ;
 *    ≤ 30 → elle vacille (−15%).
 *  • Note de compétence  <Origine>  = mana origine : parole enregistrée, lancée
 *    sans récitation → JAMAIS de contrecoup (idéal quand la lucidité est basse).
 *  • Longueur : auto depuis le coût de PM, ou forcée par  <Parole: L>.
 * ──────────────────────────────────────────────────────────────────────────
 */
(function () {
    'use strict';
    var BL = (parseInt(PluginManager.parameters('ParolesMagic')['backlashPct'] || 6)) / 100;
    var MENTAL = { 1: 11, 2: 12, 3: 13, 4: 14 };   // actorId -> variable de Santé Mentale

    function log(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }
    function lucidite(actor) {
        var v = MENTAL[actor.actorId()];
        if (!v || !$gameVariables) return 80;
        return Math.max(0, Math.min(100, $gameVariables.value(v) * 10));
    }
    function lengthOf(skill) {
        if (skill.meta && skill.meta.Parole) return Math.max(1, parseInt(skill.meta.Parole));
        var mp = skill.mpCost || 0;
        return Math.min(8, Math.max(2, 2 + Math.floor(mp / 12)));
    }
    function isParole(action) {
        var s = action.subject();
        var it = action.item();
        return s && s.isActor && s.isActor() && action.isSkill && action.isSkill()
            && it && (it.mpCost || 0) > 0 && !(it.meta && it.meta.Origine) && $gameParty.inBattle();
    }
    function reussite(actor, skill) {
        // Adapté pour le jeu : la LUCIDITÉ requise croît avec la complexité (L).
        // Sort simple → fiable ; sort complexe → exige un esprit lucide.
        var L = lengthOf(skill);
        var req = Math.max(0, L - 2) * 14;          // lucidité requise : L2=0, L5=42, L8=84
        var lu = lucidite(actor);
        return req <= 0 ? 0.97 : Math.min(0.97, 0.97 * (lu / req));
    }

    // Décision de réussite + contrecoup (une fois par action)
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        if (this._paroleOK === undefined && isParole(this)) {
            var s = this.subject();
            this._paroleOK = Math.random() < reussite(s, this.item());
            if (!this._paroleOK) {
                var dmg = Math.max(1, Math.round(s.mhp * BL));
                s.gainHp(-dmg); if (s.startDamagePopup) s.startDamagePopup();
                var v = MENTAL[s.actorId()];
                if (v && $gameVariables) $gameVariables.setValue(v, Math.max(1, $gameVariables.value(v) - 1));
                log('\\C[8]La parole se brise dans l\'esprit de ' + s.name() + ' — contrecoup !\\C[0]');
            }
        }
        if (this._paroleOK === false) {
            var r = target.result(); r.clear(); r.used = true; r.missed = true;
            return;
        }
        _apply.call(this, target);
    };

    // Puissance modulée par la lucidité (la parole tient ou vacille)
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, crit) {
        var v = _mdv.call(this, target, crit);
        if (v > 0 && isParole(this)) {
            var lu = lucidite(this.subject());
            if (lu >= 90) v = Math.round(v * 1.15);
            else if (lu <= 30) v = Math.round(v * 0.85);
        }
        return v;
    };
})();
