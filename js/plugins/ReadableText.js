//=============================================================================
// ReadableText.js — v1.0  ·  Lisibilité : aide plus grande + retour à la ligne
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ « Tout voir » : la fenêtre d'aide passe à 3 lignes et fait
 * un retour à la ligne automatique (descriptions jamais coupées).
 * @author JOKO
 *
 * @param lignes
 * @text Lignes de la fenêtre d'aide
 * @type number
 * @default 3
 *
 * @help
 *  Aucune configuration. Les descriptions de compétences/objets (et l'affinité
 *  ajoutée par ManaVisuals) s'affichent en entier, sans débordement à droite.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('ReadableText');
    var LINES = Math.max(2, parseInt(P['lignes'] || 3));

    // Fenêtre d'aide plus haute
    var _init = Window_Help.prototype.initialize;
    Window_Help.prototype.initialize = function (numLines) {
        _init.call(this, numLines || LINES);
    };

    function measure(win, s) { return win.textWidth(String(s).replace(/\\[A-Za-z]\[\d+\]/g, '')); }

    function wrap(win, text) {
        if (!text) return '';
        var maxW = win.contentsWidth();
        return String(text).split('\n').map(function (seg) {
            var words = seg.split(' '), lines = [], cur = '';
            for (var i = 0; i < words.length; i++) {
                var test = cur ? cur + ' ' + words[i] : words[i];
                if (measure(win, test) <= maxW) cur = test;
                else { if (cur) lines.push(cur); cur = words[i]; }
            }
            if (cur) lines.push(cur);
            return lines.join('\n');
        }).join('\n');
    }

    // Retour à la ligne automatique de l'aide
    var _setText = Window_Help.prototype.setText;
    Window_Help.prototype.setText = function (text) {
        var wrapped = wrap(this, text);
        if (this._text !== wrapped) { this._text = wrapped; this.refresh(); }
        else { _setText.call(this, wrapped); }
    };
})();
