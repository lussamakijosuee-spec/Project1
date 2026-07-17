//=============================================================================
// Lore_Affinites.js — v1.0 · FUSION des 4 plugins d'affinité
//   Regroupe (comportement identique) : Lore_AffiniteAlignes, Lore_AffiniteDuaux,
//   Lore_AffiniteAtones, Lore_AffiniteEvolue.
//=============================================================================
/*:
 * @plugindesc [Lore] Affinités fondues : Alignés (+20/-20%), Duaux (+10%), Atones (résiste/½ corruption), Évolue (SAN → Corps/Esprit).
 * @author JOKO
 * @help
 *  Un seul plugin pour toutes les règles d'affinité (notetags <Mana:> / <Mana2:> / <Atone>).
 *   • Aligné  : <Mana: x> seul → +20% dans sa source, -20% dans les autres.
 *   • Dual    : <Mana: x> ET <Mana2: y> → +10% dans ses deux sources.
 *   • Atone   : <Atone> → prend ×0.85 des éléments Négatif(4)/Sombre(5) ; corruption ÷2.
 *   • Évolue  : selon la Santé Mentale (window.Ame) → SAN basse +15% Corps, SAN haute +15% Esprit.
 *  Remplace les 4 plugins Lore_Affinite* (fusion 2026-07-17). Sources d'élément :
 *  Corps(4,5,8,11,15) · Âme(2,14) · Esprit(3,6,9,10,12,13) · Physique(1)/Pur(7,16) neutres.
 */
(function () {
    'use strict';

    function srcEl(el) {
        if ([4, 5, 8, 11, 15].indexOf(el) >= 0) return 'corps';
        if ([2, 14].indexOf(el) >= 0) return 'ame';
        if ([3, 6, 9, 10, 12, 13].indexOf(el) >= 0) return 'esprit';
        return null;
    }
    function toSrc(s) {
        s = String(s).toLowerCase();
        if (s.indexOf('neg') >= 0 || s.indexOf('somb') >= 0) return 'corps';
        if (s.indexOf('spir') >= 0 || s.indexOf('ame') >= 0) return 'ame';
        if (s.indexOf('pos') >= 0) return 'esprit';
        return null;
    }
    function noteOf(b) { try { return b && b.actor ? (b.actor().note || '') : ''; } catch (e) { return ''; } }

    // Aligné : <Mana:> seul (sans <Mana2>, sans <Atone>)
    function affSrc(b) {
        var n = noteOf(b); if (!n || /<Atone>/i.test(n) || /<Mana2:/i.test(n)) return null;
        var m = /<Mana:\s*([a-zA-Zàé]+)>/i.exec(n); return m ? toSrc(m[1]) : null;
    }
    // Dual : <Mana:> ET <Mana2:>
    function duaux(b) {
        var n = noteOf(b); var m1 = /<Mana:\s*([a-zA-Zàé]+)>/i.exec(n), m2 = /<Mana2:\s*([a-zA-Zàé]+)>/i.exec(n);
        return (m1 && m2) ? [toSrc(m1[1]), toSrc(m2[1])] : null;
    }
    // Évolue : n'utilise que Corps/Esprit
    function srcElCE(el) {
        if ([4, 5, 8, 11, 15].indexOf(el) >= 0) return 'corps';
        if ([3, 6, 9, 10, 12, 13].indexOf(el) >= 0) return 'esprit';
        return null;
    }

    // ── Multiplicateurs de dégâts (Aligné × Dual × Évolue, comme les 3 anciens hooks) ──
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _mdv.call(this, target, critical);
        var u = this.subject(); var it = this.item();
        if (!u || !it || !it.damage) return v;
        var es = srcEl(it.damage.elementId);

        // Aligné (exclusif du Dual)
        var a = affSrc(u);
        if (a && es) v = Math.round(v * (es === a ? 1.2 : 0.8));
        // Dual
        var d = duaux(u);
        if (d && es) v = Math.round(v * (d.indexOf(es) >= 0 ? 1.1 : 1.0));
        // Évolue (selon la SAN)
        if (u.isActor && u.isActor() && typeof window.Ame !== 'undefined') {
            var ph = window.Ame.phase(u.actorId());
            var ec = it.damage ? srcElCE(it.damage.elementId) : null;
            if (ph && ec) {
                var f = 1;
                if (ec === 'corps') f = ph <= 2 ? 1.15 : (ph >= 4 ? 0.9 : 1);
                if (ec === 'esprit') f = ph >= 4 ? 1.15 : (ph <= 2 ? 0.9 : 1);
                v = Math.round(v * f);
            }
        }
        return v;
    };

    // ── Atone : réduit les dégâts Négatif/Sombre reçus ──
    function atone(b) { try { var n = b && b.actor ? b.actor().note : (b && b.enemy ? b.enemy().note : ''); return /<Atone>/i.test(n || ''); } catch (e) { return false; } }
    var _ed = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        var it = this.item();
        if (value > 0 && it && it.damage && [4, 5].indexOf(it.damage.elementId) >= 0 && atone(target)) value = Math.floor(value * 0.85);
        _ed.call(this, target, value);
    };

    // ── Atone : corruption gagnée divisée par 2 (patch de window.Corruption) ──
    var hook = function () {
        if (window.Corruption && !window.Corruption._loreAtone) {
            window.Corruption._loreAtone = true;
            var _add = window.Corruption.add;
            window.Corruption.add = function (actorId, n) {
                var a = $gameActors && $gameActors.actor(actorId);
                if (a && /<Atone>/i.test(a.actor().note || '')) n = Math.ceil((Number(n) || 0) / 2);
                return _add.call(this, actorId, n);
            };
        }
    };
    var _sm = Scene_Map.prototype.onMapLoaded; Scene_Map.prototype.onMapLoaded = function () { _sm.call(this); hook(); };
    var _sb = Scene_Battle.prototype.start; Scene_Battle.prototype.start = function () { _sb.call(this); hook(); };
})();
