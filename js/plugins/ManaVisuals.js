//=============================================================================
// ManaVisuals.js — v1.0  ·  Visuel des compétences / affinités / éléments / stats
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Gros lifting visuel : noms de compétences colorés par leur
 * affinité de Mana, affinité affichée dans l'aide, et stats avec barres de profil.
 * @author JOKO
 *
 * @help
 *  • Chaque compétence est colorée selon son ÉLÉMENT (Sombre = violet, Feu =
 *    orange, etc.) — dans le menu ET en combat.
 *  • L'aide affiche l'affinité : 【MANA SOMBRE】 ...
 *  • L'écran de Statut affiche les paramètres avec une barre de profil.
 *  Aucune configuration. Lit les éléments de la Base de données.
 */
(function () {
    'use strict';

    // couleur par id d'élément (cf. tes 16 éléments)
    var COLORS = {
        1: '#bdbdbd', 2: '#cdb8ff', 3: '#ffd95a', 4: '#6fa8ff', 5: '#b061e0',
        6: '#f2f2f2', 7: '#5fd6c0', 8: '#ff6b4a', 9: '#4ec3ff', 10: '#7be07b',
        11: '#c79a5b', 12: '#ffe14a', 13: '#aef0ff', 14: '#fff3a0', 15: '#8a7fb0', 16: '#e0a0ff'
    };
    function elemOf(skill) {
        if (!skill || !skill.damage) return 0;
        var e = skill.damage.elementId;
        if (e === -1) return 1;       // attaque normale -> physique
        return (e > 0) ? e : 0;
    }
    function elemName(id) { return ($dataSystem && $dataSystem.elements[id] ? $dataSystem.elements[id].trim() : '').toUpperCase(); }

    //--- A) Nom de compétence coloré par affinité (menu + combat) ---
    var _drawItemName = Window_Base.prototype.drawItemName;
    Window_Base.prototype.drawItemName = function (item, x, y, width) {
        if (item && item.stypeId !== undefined && item.damage) {       // c'est une compétence
            var el = elemOf(item);
            if (el && COLORS[el]) {
                width = width || 312;
                var iw = Window_Base._iconWidth, ih = Window_Base._iconHeight;
                var iconY = y + (this.lineHeight() - ih) / 2;
                this.resetTextColor();
                this.drawIcon(item.iconIndex, x + 2, iconY);
                this.changeTextColor(COLORS[el]);
                this.drawText(item.name, x + iw + 4, y, width - iw - 4);
                this.resetTextColor();
                return;
            }
        }
        _drawItemName.call(this, item, x, y, width);
    };

    //--- B) Affinité dans l'aide ---
    var _updateHelp = Window_SkillList.prototype.updateHelp;
    Window_SkillList.prototype.updateHelp = function () {
        var s = this.item();
        if (s && this._helpWindow) {
            var el = elemOf(s);
            var tag = (el && elemName(el)) ? '【' + elemName(el) + '】  ' : '';
            this._helpWindow.setText(tag + (s.description || ''));
        } else {
            _updateHelp.call(this);
        }
    };

    //--- C) Statut : paramètres avec barre de profil ---
    if (typeof Window_Status !== 'undefined') {
        Window_Status.prototype.drawParameters = function (x, y) {
            var lh = this.lineHeight(), a = this._actor;
            var vals = []; for (var k = 0; k < 6; k++) vals.push(a.param(k + 2));
            var mx = Math.max.apply(null, vals) || 1;
            for (var i = 0; i < 6; i++) {
                var pid = i + 2, y2 = y + lh * i, val = vals[i];
                this.changeTextColor(this.systemColor());
                this.drawText(TextManager.param(pid), x, y2, 140);
                this.resetTextColor();
                this.drawText(val, x + 140, y2, 70, 'right');
                // barre de profil (relatif au plus haut param de l'acteur)
                var bw = 210, by = y2 + Math.floor(lh * 0.74);
                var ratio = val / mx;
                var col = ratio >= 0.85 ? '#5fd6a0' : ratio >= 0.5 ? '#ffd95a' : '#e08a5a';
                this.contents.fillRect(x, by, bw, 6, 'rgba(0,0,0,0.4)');
                this.contents.fillRect(x + 1, by + 1, Math.floor((bw - 2) * ratio), 4, col);
            }
        };
    }
})();
