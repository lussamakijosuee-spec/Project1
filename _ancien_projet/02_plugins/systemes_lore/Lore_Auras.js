//=============================================================================
// Lore_Auras.js — v1.0 · FUSION des auras de combat (visuel)
//   Regroupe (comportement identique) : Lore_AuraCorruption + Lore_AuraSource.
//=============================================================================
/*:
 * @plugindesc [Lore] Auras de combat fondues : aura sombre pulsante si corruption > 0 (blend) + aura de source sous chaque héros (sprite dédié).
 * @author JOKO
 * @help
 *  Purement visuel. Deux mécanismes distincts, sans conflit :
 *   • Corruption : teinte (blend) sombre pulsante sur l'acteur, d'autant plus forte que window.Corruption est haute.
 *   • Source : halo doux au sol, couleur = <Mana:> (Corps=violet, Âme=cramoisi, Esprit=cyan, Pur=blanc) via un sprite enfant.
 *  Remplace Lore_AuraCorruption + Lore_AuraSource (fusion 2026-07-17).
 */
(function () {
    'use strict';
    if (typeof Sprite_Actor === 'undefined') return;

    function col(a) {
        try {
            var n = a.actor().note || ''; var m = /<Mana:\s*([a-zA-Zàé]+)>/i.exec(n); if (!m) return null;
            var s = m[1].toLowerCase();
            if (s.indexOf('neg') >= 0 || s.indexOf('somb') >= 0) return [176, 97, 224];
            if (s.indexOf('spir') >= 0 || s.indexOf('ame') >= 0) return [220, 60, 80];
            if (s.indexOf('pos') >= 0) return [90, 200, 230];
            if (s.indexOf('pur') >= 0) return [240, 240, 255];
            return null;
        } catch (e) { return null; }
    }

    // Aura de source : sprite enfant dédié (créé au setBattler)
    var _setB = Sprite_Actor.prototype.setBattler;
    Sprite_Actor.prototype.setBattler = function (battler) {
        _setB.call(this, battler);
        if (battler && this._loreAuraActor !== battler) {
            this._loreAuraActor = battler;
            this._loreAuraCol = col(battler);
            if (!this._loreAura) { this._loreAura = new Sprite(); this._loreAura.anchor.x = 0.5; this._loreAura.anchor.y = 0.5; this.addChildAt(this._loreAura, 0); }
            this._loreAuraReady = false;
        }
    };

    var _upd = Sprite_Actor.prototype.update;
    Sprite_Actor.prototype.update = function () {
        _upd.call(this);
        // 1) Aura de corruption (blend pulsant)
        try {
            var a = this._actor;
            if (a && window.Corruption) {
                var lv = window.Corruption.niveau(a.actorId());
                if (lv > 0) {
                    this._loreT = (this._loreT || 0) + 0.08; var p = (Math.sin(this._loreT) * 0.5 + 0.5); var i = Math.min(1, lv / 8);
                    var g = Math.floor(60 * i * p); this.setBlendColor([g, 0, Math.floor(g * 1.4), Math.floor(80 * i * p)]);
                } else if (this._loreT) { this.setBlendColor([0, 0, 0, 0]); this._loreT = 0; }
            }
        } catch (e) {}
        // 2) Aura de source (sprite enfant)
        try {
            if (this._loreAura && this._loreAuraCol) {
                if (!this._loreAuraReady) {
                    var c = this._loreAuraCol, b = new Bitmap(120, 50);
                    var grd = b._context.createRadialGradient(60, 25, 4, 60, 25, 58);
                    grd.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0.55)');
                    grd.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
                    b._context.fillStyle = grd; b._context.fillRect(0, 0, 120, 50); b._setDirty && b._setDirty();
                    this._loreAura.bitmap = b; this._loreAuraReady = true;
                }
                this._loreAT = (this._loreAT || 0) + 0.06; this._loreAura.y = 8;
                this._loreAura.opacity = 140 + Math.sin(this._loreAT) * 50;
                this._loreAura.scale.x = this._loreAura.scale.y = 1 + Math.sin(this._loreAT) * 0.06;
            }
        } catch (e) {}
    };
})();
