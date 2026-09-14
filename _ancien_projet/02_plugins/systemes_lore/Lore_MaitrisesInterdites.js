//=============================================================================
// Lore_MaitrisesInterdites.js — v1.0 · Les Maîtrises interdites (Corps)
//   « Elles puisent trop profond dans la source — le sang d'Ombrefauve :
//   puissance immédiate, mais elles précipitent la Bête. »
//=============================================================================
/*:
 * @plugindesc [Lore] <Interdit> sur un skill : dégâts fortement amplifiés,
 * mais chaque usage précipite la Bête (grosse corruption). Additif.
 * @author JOKO
 *
 * @param multDefaut
 * @text Amplification par défaut (×)
 * @type number
 * @decimals 2
 * @default 1.60
 * @desc <Interdit> sans valeur = dégâts ×multDefaut. <Interdit: 2> = ×2, etc.
 *
 * @param corruption
 * @text Corruption par usage
 * @type number
 * @min 0
 * @default 8
 * @desc Chaque usage puise dans le sang d'Ombrefauve (jauge de la Bête, window.Corruption).
 *
 * @help
 *  Sur la Note d'un skill de Maîtrise :
 *      <Interdit>          dégâts ×multDefaut, corruption +corruption par usage
 *      <Interdit: 2.2>     amplification personnalisée
 *
 *  Cumulable avec une <Voie: ...> (une Voie interdite existe dans le lore).
 *  Le journal l'annonce : on reconnaît un art interdit au premier geste.
 *  Sans window.Corruption, l'amplification marche mais rien ne précipite la
 *  Bête (le plugin reste inoffensif).
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('Lore_MaitrisesInterdites');
    var MULT = parseFloat(P['multDefaut'] || 1.6);
    var CORR = parseInt(P['corruption'] || 8);

    function interditMult(action) {
        var it = action && action.item && action.item();
        if (!it || !it.meta || it.meta.Interdit === undefined) return 0;
        var v = parseFloat(it.meta.Interdit);
        return isNaN(v) || v <= 0 ? MULT : v;
    }

    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var value = _mdv.call(this, target, critical);
        var m = interditMult(this);
        if (value > 0 && m > 0) value = Math.floor(value * m);
        return value;
    };

    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        if (interditMult(this) <= 0) return;
        var s = this.subject();
        if (!s) return;
        if (this._interditAnnonce) return;   // une fois par action multi-cibles
        this._interditAnnonce = true;
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) w.addText('\\C[18]' + (s.name ? s.name() : 'Le lanceur') + ' puise trop profond — un art interdit.\\C[0]');
        if (s.isActor && s.isActor() && CORR > 0 && window.Corruption) {
            try { window.Corruption.add(s.actorId(), CORR); } catch (e) {}
        }
        if ($gameScreen) $gameScreen.startFlash([90, 0, 130, 90], 16);
    };
})();
