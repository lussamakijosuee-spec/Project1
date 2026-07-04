//=============================================================================
// Lore_CampsLumiereOmbre.js — v1.0 · Lumière ⇄ Ombre, la seule opposition
//   « Seuls Lumière et Ombre s'opposent franchement — faibles l'une à l'autre —
//   parce que c'est lisible et que ça compte dans l'histoire. »
//=============================================================================
/*:
 * @plugindesc [Lore] <Camp: lumiere|ombre> sur un acteur/classe/ennemi : la
 * Lumière (14) blesse l'Ombre ×1.5 et vice-versa ; le même camp résiste ×0.5.
 * @author JOKO
 *
 * @param multOppose
 * @text Camp opposé (×)
 * @type number
 * @decimals 2
 * @default 1.50
 *
 * @param multMeme
 * @text Même camp (×)
 * @type number
 * @decimals 2
 * @default 0.50
 *
 * @param showLog
 * @text Annoncer l'opposition ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 *  La SEULE opposition élémentaire du lore (pas de roue, pas de cycle) :
 *
 *  ▶ Note d'un acteur, d'une classe ou d'un ennemi :
 *      <Camp: lumiere>      (être de Lumière — élément 14)
 *      <Camp: ombre>        (être d'Ombre — élément 15)
 *
 *  ▶ Effets sur les dégâts :
 *      sort de Lumière (14) sur un <Camp: ombre>    → ×1.5
 *      sort d'Ombre (15) sur un <Camp: lumiere>     → ×1.5
 *      sort de Lumière sur un <Camp: lumiere>       → ×0.5
 *      sort d'Ombre sur un <Camp: ombre>            → ×0.5
 *    Les autres éléments ne sont PAS concernés. Le Crépuscule (29) non plus :
 *    il est déjà les deux. Le Mana Pur perce tout (géré ailleurs).
 *
 *  Rappel du Codex : « Un élément n'a pas de valeur morale. L'Ombre n'est pas
 *  le mal, la Lumière n'est pas le bien : ce sont des outils. »
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('Lore_CampsLumiereOmbre');
    var OPP = parseFloat(P['multOppose'] || 1.5);
    var MEME = parseFloat(P['multMeme'] || 0.5);
    var SHOW = String(P['showLog'] || 'true') === 'true';

    var EL_LUM = 14, EL_OMB = 15;

    function log(t) {
        if (!SHOW) return;
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) w.addText(t);
    }
    function campOf(battler) {
        try {
            var notes = [];
            if (battler.isEnemy && battler.isEnemy() && battler.enemy()) notes.push(battler.enemy().note);
            else if (battler.isActor && battler.isActor()) {
                if (battler.actor()) notes.push(battler.actor().note);
                if (battler.currentClass && battler.currentClass()) notes.push(battler.currentClass().note);
            }
            for (var i = 0; i < notes.length; i++) {
                var m = /<Camp:\s*(lumi[eè]re|ombre)\s*>/i.exec(notes[i] || '');
                if (m) return /omb/i.test(m[1]) ? 'ombre' : 'lumiere';
            }
        } catch (e) {}
        return '';
    }

    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _mdv.call(this, target, critical);
        if (v <= 0) return v;
        var it = this.item();
        var el = (it && it.damage) ? it.damage.elementId : 0;
        if (el !== EL_LUM && el !== EL_OMB) return v;
        var camp = campOf(target);
        if (!camp) return v;
        var attaque = (el === EL_LUM) ? 'lumiere' : 'ombre';
        if (attaque !== camp) {
            v = Math.floor(v * OPP);
            if (!this._campAnnonce) { this._campAnnonce = true; log('\\C[14]' + (el === EL_LUM ? 'La Lumière déchire l\'Ombre.' : 'L\'Ombre dévore la Lumière.') + '\\C[0]'); }
        } else {
            v = Math.floor(v * MEME);
            if (!this._campAnnonce) { this._campAnnonce = true; log('\\C[8]Le même camp — le coup s\'éteint à moitié.\\C[0]'); }
        }
        return v;
    };
})();
