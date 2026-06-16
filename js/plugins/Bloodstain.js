//=============================================================================
// Bloodstain.js — v1.0  ·  Tache de Sang (récupération d'âmes, façon Souls)
// RPG Maker MV   ·   by JOKO   ·   complément de AmeSouls
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Quand tu meurs, tes âmes perdues restent là où tu es tombé.
 * Retourne les récupérer… ou perds-les à jamais si tu remeurs avant. (Souls)
 * @author JOKO
 *
 * @help
 *  Se branche tout seul sur AmeSouls. À la mort, une « Tache de Sang » lumineuse
 *  apparaît à l'endroit exact où l'équipe est tombée, contenant les âmes perdues.
 *  Reviens dessus pour les reprendre. Si tu meurs à nouveau avant, elles
 *  disparaissent pour toujours. Aucune configuration.
 */
(function () {
    'use strict';
    var AP = PluginManager.parameters('AmeSouls');
    var SOUL = parseInt((AP && AP['soulVar']) || 15);
    var LOSS = (parseInt((AP && AP['lossPct']) || 50)) / 100;

    function bs() { return $gameSystem ? $gameSystem._bloodstain : null; }

    // --- À la mort : mémoriser le lieu + les âmes perdues (avant qu'AmeSouls ne déduise) ---
    var _gover = Scene_Gameover.prototype.start;
    Scene_Gameover.prototype.start = function () {
        var ck = $gameSystem && $gameSystem._ameCheckpoint;
        if (ck && ck.mapId > 0 && $gameVariables && SOUL) {
            var lost = Math.floor($gameVariables.value(SOUL) * LOSS);
            $gameSystem._bloodstain = (lost > 0)
                ? { mapId: $gameMap.mapId(), x: $gamePlayer.x, y: $gamePlayer.y, souls: lost }
                : null;
        }
        _gover.call(this);   // AmeSouls : déduit les âmes + renvoie au Feu
    };

    // --- Ramassage : marcher sur la tache rend les âmes ---
    var _smUpd = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _smUpd.call(this);
        var b = bs();
        if (b && b.mapId === $gameMap.mapId() && !$gameMessage.isBusy()
            && $gamePlayer.x === b.x && $gamePlayer.y === b.y && !$gamePlayer.isMoving()) {
            if ($gameVariables) $gameVariables.setValue(SOUL, $gameVariables.value(SOUL) + b.souls);
            $gameMessage.add('\\C[2]✦ Tu récupères ' + b.souls + ' âmes perdues.\\C[0]');
            if (window.Succes) window.Succes.unlock(3);
            $gameSystem._bloodstain = null;
        }
    };

    //--- Marqueur lumineux sur la carte ---
    function Sprite_Bloodstain() { this.initialize.apply(this, arguments); }
    Sprite_Bloodstain.prototype = Object.create(Sprite.prototype);
    Sprite_Bloodstain.prototype.constructor = Sprite_Bloodstain;
    Sprite_Bloodstain.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this);
        this.anchor.x = 0.5; this.anchor.y = 0.5; this._phase = 0; this.z = 1;
        var b = new Bitmap(56, 56), c = 28;
        for (var r = 26; r > 0; r -= 2) {
            var a = Math.floor(120 * (1 - r / 26));
            b.drawCircle(c, c, r, 'rgba(120,255,180,' + (a / 255).toFixed(2) + ')');
        }
        b.drawCircle(c, c, 6, 'rgba(235,255,245,0.95)');
        this.bitmap = b;
    };
    Sprite_Bloodstain.prototype.place = function (tx, ty) {
        var tw = $gameMap.tileWidth(), th = $gameMap.tileHeight();
        this.x = Math.round($gameMap.adjustX(tx) * tw + tw / 2);
        this.y = Math.round($gameMap.adjustY(ty) * th + th / 2);
    };
    Sprite_Bloodstain.prototype.update = function () {
        Sprite.prototype.update.call(this);
        this._phase += 0.08;
        var s = 0.85 + Math.sin(this._phase) * 0.18;
        this.scale.x = this.scale.y = s;
        this.opacity = 180 + Math.round(Math.sin(this._phase) * 60);
    };

    var _ssUpd = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _ssUpd.call(this);
        var b = bs(), here = b && b.mapId === $gameMap.mapId();
        if (here) {
            if (!this._bloodSprite) { this._bloodSprite = new Sprite_Bloodstain(); this.addChild(this._bloodSprite); }
            this._bloodSprite.place(b.x, b.y);
        } else if (this._bloodSprite) {
            this.removeChild(this._bloodSprite); this._bloodSprite = null;
        }
    };
})();
