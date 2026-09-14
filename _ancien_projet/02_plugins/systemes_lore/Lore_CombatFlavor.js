//=============================================================================
// Lore_CombatFlavor.js — v1.0 · FUSION des petits effets de combat (saveur)
//   Regroupe (comportement identique) : Lore_ManaSourceTag, Lore_RoueElements,
//   Lore_LiensCombo, Lore_FlashElement, Lore_PasDeCombat.
//=============================================================================
/*:
 * @plugindesc [Lore] Saveur de combat fondue : annonce de Source, « FAIBLESSE ! » (Roue), bonus de Liens, flash élémentaire sur gros coup, pas vers l'avant.
 * @author JOKO
 * @help
 *  Petits effets de journal/visuel de combat, réunis en un plugin :
 *   • Source    : annonce Corps/Âme/Esprit/Pur du sort au début de l'action.
 *   • Roue      : « FAIBLESSE ! » quand l'élément bat le <RoueElem:> de la cible.
 *   • Liens     : +2% dégâts d'équipe par niveau de Lien présent (plafond +20%, via window.Lien).
 *   • Flash     : l'écran flashe de la couleur de l'élément quand un coup ≥ 25% des PV max.
 *   • Pas       : le lanceur avance d'un pas net puis revient (sideview).
 *  Remplace 5 plugins Lore_* (fusion 2026-07-17).
 */
(function () {
    'use strict';

    // ── 1) Annonce de Source (ManaSourceTag) & 5) Pas de combat — via startAction ──
    var CORPS = [4, 5, 8, 11, 15], AME = [2, 14], ESPRIT = [3, 6, 9, 10, 12, 13], PUR = [7, 16];
    function srcOf(el) {
        if (PUR.indexOf(el) >= 0) return { n: 'MANA PUR', c: 18, r: 'transcende le cycle' };
        if (CORPS.indexOf(el) >= 0) return { n: 'CORPS', c: 2, r: 'la puissance brute, au prix du corps' };
        if (AME.indexOf(el) >= 0) return { n: 'ÂME', c: 21, r: 'l’essence immortelle' };
        if (ESPRIT.indexOf(el) >= 0) return { n: 'ESPRIT', c: 23, r: 'l’intelligence qui prend forme' };
        return null;
    }
    var _sa = BattleManager.startAction;
    BattleManager.startAction = function () {
        // annonce de source
        try {
            var subj = this._subject, act = subj && subj.currentAction && subj.currentAction();
            if (act && act.item && act.item()) {
                var it = act.item(), el = it.damage ? it.damage.elementId : 0;
                if (it.meta && it.meta.Mana) {
                    var m = String(it.meta.Mana).toLowerCase();
                    if (m.indexOf('neg') >= 0) el = 4; else if (m.indexOf('spir') >= 0 || m.indexOf('ame') >= 0) el = 2;
                    else if (m.indexOf('pos') >= 0) el = 3; else if (m.indexOf('somb') >= 0) el = 5; else if (m.indexOf('pur') >= 0) el = 7;
                }
                var s = srcOf(el);
                if (s && this._logWindow) this._logWindow.push('addText', '\\C[' + s.c + ']◈ Source : ' + s.n + ' — ' + s.r + '\\C[0]');
            }
        } catch (e) {}
        _sa.call(this);
        // pas vers l'avant
        try {
            var sb = this._subject, ss = SceneManager._scene && SceneManager._scene._spriteset;
            if (sb && ss && ss.battlerSprites) {
                var sprs = ss.battlerSprites();
                for (var i = 0; i < sprs.length; i++) { if (sprs[i]._battler === sb) { sprs[i]._loreHop = 14; sprs[i]._loreHopDir = (sb.isActor && sb.isActor()) ? -1 : 1; break; } }
            }
        } catch (e) {}
    };
    if (typeof Sprite_Battler !== 'undefined') {
        var _uB = Sprite_Battler.prototype.update;
        Sprite_Battler.prototype.update = function () {
            _uB.call(this);
            if (this._loreHop && this._loreHop > 0) { var t = this._loreHop; var off = Math.sin((14 - t) / 14 * Math.PI) * 18 * (this._loreHopDir || -1); this.x += Math.round(off); this._loreHop--; }
        };
    }

    // ── 3) Bonus de Liens — via makeDamageValue ──
    function lienBonus() {
        if (typeof window.Lien === 'undefined' || !$gameParty) return 1;
        var sum = 0; $gameParty.battleMembers().forEach(function (a) { sum += window.Lien.niveau(a.actorId()) || 0; });
        return 1 + Math.min(0.2, sum * 0.02);
    }
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (t, c) {
        var v = _mdv.call(this, t, c);
        var u = this.subject();
        if (u && u.isActor && u.isActor() && $gameParty.inBattle()) v = Math.round(v * lienBonus());
        return v;
    };

    // ── 2) Roue des éléments & 4) Flash élémentaire — via apply ──
    var WHEEL = { 8: 9, 9: 12, 12: 11, 11: 10, 10: 13, 13: 8, 15: 14, 14: 15 };
    var WNAME = { 8: 'Feu', 9: 'Eau', 10: 'Vent', 11: 'Terre', 12: 'Foudre', 13: 'Glace', 14: 'Lumière', 15: 'Ombre' };
    function defElem(b) { try { var n = b.enemy ? b.enemy().note : (b.actor ? b.actor().note : ''); var m = /<RoueElem:\s*(\d+)>/i.exec(n || ''); return m ? Number(m[1]) : 0; } catch (e) { return 0; } }
    var FCOL = { 1: [180, 180, 180], 2: [200, 120, 255], 3: [255, 215, 90], 4: [110, 168, 255], 5: [176, 97, 224], 6: [240, 240, 240], 7: [120, 220, 255], 8: [255, 90, 50], 9: [80, 190, 255], 10: [120, 220, 120], 11: [199, 154, 91], 12: [255, 225, 74], 13: [174, 240, 255], 14: [255, 243, 160], 15: [138, 127, 176], 16: [224, 160, 255] };
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        var it = this.item(); if (!it || !it.damage) return;
        // Roue
        try {
            var atk = it.damage.elementId, de = defElem(target);
            if (atk && de && WHEEL[atk] === de) {
                var w = BattleManager._logWindow;
                if (w) w.push('addText', '\\C[17]⚡ FAIBLESSE ! ' + (WNAME[atk] || '') + ' brise ' + (WNAME[de] || '') + ' !\\C[0]');
                if ($gameScreen) $gameScreen.startFlash([255, 230, 120, 80], 18);
            }
        } catch (e) {}
        // Flash élémentaire (gros coup)
        try {
            var res = target && target.result ? target.result() : null; if (!res || res.hpDamage <= 0) return;
            if (res.hpDamage >= target.mhp * 0.25) {
                var el = it.damage.elementId;
                if (el === -1) { var ae = this.subject().attackElements(); el = ae.length ? ae[0] : 0; }
                var col = FCOL[el]; if (col && $gameScreen) $gameScreen.startFlash([col[0], col[1], col[2], 110], 22);
            }
        } catch (e) {}
    };
})();
