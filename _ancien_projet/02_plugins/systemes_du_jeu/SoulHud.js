//=============================================================================
// SoulHud.js — v1.0  ·  HUD Âmes & Corruption (sur la carte)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Affiche en permanence sur la carte : tes Âmes et la
 * Corruption de l'équipe (barre colorée). Dessiné en procédural, aucun asset.
 * @author JOKO
 *
 * @param soulVar
 * @text Variable — Âmes
 * @type variable
 * @default 15
 *
 * @param coin
 * @text Position
 * @type select
 * @option Haut-gauche
 * @value tl
 * @option Bas-gauche
 * @value bl
 * @default bl
 *
 * @help
 *  S'affiche tout seul sur la carte. Le HUD se cache pendant les messages.
 *  Désactivable via l'interrupteur : script $gameSystem._soulHudOff = true.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('SoulHud');
    var SOUL = parseInt(P['soulVar'] || 15);
    var COIN = String(P['coin'] || 'bl');

    function maxCorruption() {
        if (!$gameSystem || !$gameSystem._corruption || !$gameParty) return 0;
        var s = $gameSystem._corruption, m = 0;
        $gameParty.members().forEach(function (a) { var v = s[a.actorId()] || 0; if (v > m) m = v; });
        return m;
    }

    function Window_SoulHud() { this.initialize.apply(this, arguments); }
    Window_SoulHud.prototype = Object.create(Window_Base.prototype);
    Window_SoulHud.prototype.constructor = Window_SoulHud;
    Window_SoulHud.prototype.initialize = function () {
        var w = 234, h = this.fittingHeight(2);
        var x = 4, y = (COIN === 'tl') ? 4 : Graphics.boxHeight - h - 4;
        Window_Base.prototype.initialize.call(this, x, y, w, h);
        this.opacity = 150; this._sig = null;
    };
    Window_SoulHud.prototype.refresh = function () {
        this.contents.clear();
        var W = this.contentsWidth(), lh = this.lineHeight();
        // Âmes
        var souls = $gameVariables ? $gameVariables.value(SOUL) : 0;
        this.changeTextColor(this.textColor(14));
        this.drawText('✦', 0, 0, 24);
        this.resetTextColor();
        this.drawText('Âmes', 26, 0, 80);
        this.drawText(String(souls), 0, 0, W - 4, 'right');
        // Corruption (barre)
        var c = maxCorruption();
        var col = c >= 100 ? '#8e44ad' : c >= 70 ? '#c0392b' : c >= 40 ? '#e67e22' : '#2ecc71';
        this.changeTextColor(this.textColor(8));
        this.drawText('Corruption', 0, lh, 110);
        this.resetTextColor();
        this.drawText(c + '%', 0, lh, W - 4, 'right');
        var by = lh + Math.floor(lh * 0.72), bw = W;
        if (window.LoreCanon) { LoreCanon.bar(this.contents, 0, by, bw, 8, Math.min(c, 100) / 100, col); }
        else {
            this.contents.fillRect(0, by, bw, 8, 'rgba(0,0,0,0.5)');
            this.contents.fillRect(1, by + 1, Math.floor((bw - 2) * Math.min(c, 100) / 100), 6, col);
        }
    };
    Window_SoulHud.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        var off = $gameSystem && $gameSystem._soulHudOff;
        this.visible = !off && !$gameMessage.isBusy();
        var souls = $gameVariables ? $gameVariables.value(SOUL) : 0;
        var sig = souls + '/' + maxCorruption();
        if (sig !== this._sig) { this._sig = sig; this.refresh(); }
    };

    var _createAll = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function () {
        _createAll.call(this);
        this._soulHud = new Window_SoulHud();
        this.addWindow(this._soulHud);
    };
})();
