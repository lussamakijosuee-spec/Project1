//=============================================================================
// DialogueWrap.js — v1.0  ·  Retour à la ligne automatique des dialogues
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ « Tout voir » : toutes les bulles de dialogue (événements
 * compris) reviennent à la ligne au lieu de déborder à droite.
 * @author JOKO
 *
 * @help
 *  Aucune configuration. Seules les lignes trop larges sont coupées proprement ;
 *  les répliques déjà bien formatées ne changent pas.
 */
(function () {
    'use strict';

    function cleanWidth(win, s) {
        var clean = String(s).replace(/\\[A-Za-z]\[\d+\]/g, '').replace(/\\[.|!{}><^$]/g, '');
        return win.textWidth(clean);
    }
    function maxWidth(win) {
        return win.contents ? win.contentsWidth() : (win.width - 36);
    }

    function wrap(win, text) {
        if (!text) return text;
        var maxW = maxWidth(win);
        return String(text).split('\n').map(function (seg) {
            if (cleanWidth(win, seg) <= maxW) return seg;          // déjà bon : on ne touche pas
            var words = seg.split(' '), lines = [], cur = '';
            for (var i = 0; i < words.length; i++) {
                var t = cur ? cur + ' ' + words[i] : words[i];
                if (cleanWidth(win, t) <= maxW || !cur) cur = t;
                else { lines.push(cur); cur = words[i]; }
            }
            if (cur) lines.push(cur);
            return lines.join('\n');
        }).join('\n');
    }

    var _cec = Window_Message.prototype.convertEscapeCharacters;
    Window_Message.prototype.convertEscapeCharacters = function (text) {
        return wrap(this, _cec.call(this, text));
    };
})();
