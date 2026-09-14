//=============================================================================
// Lore_ObjetSpirituel.js — v1.1 · L'Objet Spirituel évolue en 4 paliers avec le
//   niveau : Éclat(1) · Forme(15) · Résonance(35) · Vérité(60).
//   (v1.1 : absorbe Lore_ObjetSpirituelMenu — la ligne de palier dans le Statut.)
//=============================================================================
/*:
 * @plugindesc [Lore] 4 paliers de l'Objet Spirituel selon le niveau (annonce + API window.ObjetSpirituel.palier) + ligne « Objet Spirituel » dans l'écran de Statut.
 * @author JOKO
 * @help Manifestation physique de l'ame en surface. Aucune config. (Fusion de
 *  Lore_ObjetSpirituel + Lore_ObjetSpirituelMenu, 2026-07-17.)
 */
(function () {
    'use strict';
    var PAL = [{ n: 'Éclat', lv: 1, c: '#bdbdbd' }, { n: 'Forme', lv: 15, c: '#7be0c0' }, { n: 'Résonance', lv: 35, c: '#b07cff' }, { n: 'Vérité', lv: 60, c: '#ffe14a' }];
    function palierIndex(lv) { var i = 0; for (var k = 0; k < PAL.length; k++) { if (lv >= PAL[k].lv) i = k; } return i; }
    window.ObjetSpirituel = { palier: function (a) { return PAL[palierIndex(a ? a.level : 1)]; }, PAL: PAL };

    // ── Annonce d'évolution au level-up ──
    var _lvlUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function () {
        var before = palierIndex(this.level); _lvlUp.call(this); var after = palierIndex(this.level);
        if (after > before) { this._loreOSAnnounce = PAL[after]; }
    };
    var _dispLvl = Game_Actor.prototype.displayLevelUp;
    Game_Actor.prototype.displayLevelUp = function (newSkills) {
        _dispLvl.call(this, newSkills);
        if (this._loreOSAnnounce) { var p = this._loreOSAnnounce; this._loreOSAnnounce = null; $gameMessage.add('\\C[6]◈ L’Objet Spirituel de ' + this.name() + ' atteint le palier « ' + p.n + ' ».\\C[0]'); }
    };

    // ── Ligne « Objet Spirituel » dans l'écran de Statut (ex-Lore_ObjetSpirituelMenu) ──
    if (typeof Window_Status !== 'undefined') {
        var _b1 = Window_Status.prototype.drawBlock1;
        Window_Status.prototype.drawBlock1 = function (y) {
            _b1.call(this, y);
            try {
                if (window.ObjetSpirituel && this._actor) {
                    var p = window.ObjetSpirituel.palier(this._actor); var lh = this.lineHeight();
                    this.changeTextColor(this.textColor(6)); this.contents.fontSize = 20;
                    this.drawText('◈ Objet Spirituel : ' + p.n, 96, y + lh * 3, 360);
                    this.contents.fontSize = 28; this.resetTextColor();
                }
            } catch (e) {}
        };
    }
})();
