//=============================================================================
// CorruptionFX.js — v1.0  ·  Pont Corruption ↔ filtres écran (MOG_PixiFilters)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Quand la corruption de l'équipe monte, l'écran se ternit
 * (niveaux de gris) puis se brouille de bruit (méta-horreur). Auto. Requiert
 * MOG_PixiFilters.
 * @author JOKO
 *
 * @param grisAt
 * @text Seuil — Niveaux de gris
 * @type number
 * @default 50
 *
 * @param bruitAt
 * @text Seuil — Bruit (glitch)
 * @type number
 * @default 80
 *
 * @help
 *  Lit la corruption (CorruptionAme) du groupe et applique automatiquement un
 *  filtre d'écran via MOG_PixiFilters : 2 = niveaux de gris, 5 = bruit.
 *  L'effet se retire seul quand la corruption redescend. N'écrase pas un filtre
 *  posé par toi tant que la corruption reste sous le 1er seuil.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('CorruptionFX');
    var GRIS = parseInt(P['grisAt'] || 50);
    var BRUIT = parseInt(P['bruitAt'] || 80);
    var CHECK = 30; // frames entre deux vérifications

    function maxCorruption() {
        if (!$gameSystem || !$gameSystem._corruption || !$gameParty) return 0;
        var s = $gameSystem._corruption, m = 0;
        $gameParty.members().forEach(function (a) { var v = s[a.actorId()] || 0; if (v > m) m = v; });
        return m;
    }
    function desired(lv) { return lv >= BRUIT ? 5 : (lv >= GRIS ? 2 : -1); }

    var _upd = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _upd.call(this);
        if (!$gameSystem || !$gameSystem._pixiFilterData) { /* MOG_PixiFilters absent */ }
        if (this._cfxApplied === undefined) this._cfxApplied = -1;
        this._cfxT = (this._cfxT || 0) + 1;
        if (this._cfxT < CHECK) return;
        this._cfxT = 0;
        var want = desired(maxCorruption());
        if (want === this._cfxApplied) return;
        this._cfxApplied = want;
        if (want < 0) {
            if ($gameSystem.clearPixiFData) $gameSystem.clearPixiFData();
        } else {
            if ($gameSystem.clearPixiAnimation) $gameSystem.clearPixiAnimation();
            $gameSystem._pixiFilterData = [true, want];
        }
    };
})();
