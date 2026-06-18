//=============================================================================
// CorruptedUI.js — v1.0  ·  L'interface se corrompt (méta-horreur)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Quand la corruption de l'équipe monte, le texte des menus
 * se met à glitcher (lettres brouillées, scintillantes). Les chiffres restent
 * lisibles. Additif, se branche sur CorruptionAme.
 * @author JOKO
 *
 * @param seuil
 * @text Seuil de corruption
 * @type number
 * @default 55
 *
 * @param intensiteMax
 * @text Glitch max (% de lettres à 100 corruption)
 * @type number
 * @default 14
 *
 * @help
 *  À partir du seuil, une fraction des lettres du texte d'interface est
 *  remplacée par des symboles corrompus, ré-tirée à chaque rendu (scintillement).
 *  Plus la corruption est haute, plus ça déborde. Les chiffres sont épargnés
 *  (PV, dégâts restent lisibles). Aucune configuration.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('CorruptedUI');
    var SEUIL = parseInt(P['seuil'] || 55);
    var IMAX = (parseInt(P['intensiteMax'] || 14)) / 100;
    var GLITCH = '▓░▒#%&◊¤§∆ØƒΔ╳';

    function maxCorruption() {
        if (typeof $gameSystem === 'undefined' || !$gameSystem || !$gameSystem._corruption || typeof $gameParty === 'undefined' || !$gameParty) return 0;
        var s = $gameSystem._corruption, m = 0;
        $gameParty.members().forEach(function (a) { var v = s[a.actorId()] || 0; if (v > m) m = v; });
        return m;
    }

    function corrupt(text) {
        var c = maxCorruption();
        if (c < SEUIL || typeof text !== 'string' || !text.length) return text;
        var p = Math.min(IMAX, (c - SEUIL) / (100 - SEUIL) * IMAX);
        return text.replace(/[A-Za-zÀ-ÿ]/g, function (ch) {
            return Math.random() < p ? GLITCH[Math.floor(Math.random() * GLITCH.length)] : ch;
        });
    }

    var _drawText = Window_Base.prototype.drawText;
    Window_Base.prototype.drawText = function (text, x, y, maxWidth, align) {
        _drawText.call(this, corrupt(text), x, y, maxWidth, align);
    };
})();
