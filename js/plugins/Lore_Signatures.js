//=============================================================================
// Lore_Signatures.js — v1.0 · FUSION des 6 signatures d'armes/objets
//   Regroupe (sans changer le comportement) : Lore_PuitsAbime, Lore_FlammesMaudites,
//   Lore_NovaSainte, Lore_VagueSacree, Lore_ForteresseAme, Lore_ArcCreatif.
//   Notetag skill/objet : <Signature: abime|flammes|nova|vague|forteresse|arc>
//=============================================================================
/*:
 * @plugindesc [Lore] <Signature: x> — les 6 signatures fondues en un seul plugin (abime, flammes, nova, vague, forteresse, arc).
 * @author JOKO
 *
 * @param BurnState
 * @text État de Brûlure (flammes)
 * @type state
 * @default 18
 *
 * @help
 *  Un seul plugin pour les six signatures. Mets sur un skill (ou l'objet
 *  spirituel qui le lance) la note :  <Signature: nom>
 *
 *   • abime      Ombre(15)+Sombre(5)  → MDF-- (débuff appliqué 2×) 2 tours sur la cible.
 *   • flammes    Feu(8)+Négatif(4)    → dégâts ×1.5 + Brûlure (état BurnState) qui ignore la résistance.
 *   • nova       Lumière(14)+Pur(7)   → dégâts ×1.4, purge les états 5/6/8 des alliés, −3 corruption au lanceur.
 *   • vague      Eau(9)+Positif(3)    → soigne 20% PV à tous les alliés + DEF+ (2 tours).
 *   • forteresse Terre(11)+Spirituel(2)→ DEF++ (3 tours) + bouclier = 12% des PV max du lanceur.
 *   • arc        Foudre(12)+Originel(6)→ effet aléatoire : double frappe / paralysie (état 15) / crit garanti.
 *
 *  Remplace les 6 anciens plugins Lore_PuitsAbime/FlammesMaudites/NovaSainte/
 *  VagueSacree/ForteresseAme/ArcCreatif (fusion du 2026-07-17). Comportement
 *  identique — sauf l'« arc » double frappe, dont la récursion infinie d'origine
 *  a été corrigée en une seule frappe supplémentaire.
 */
(function () {
    'use strict';
    var BURN = Number(PluginManager.parameters('Lore_Signatures')['BurnState'] || 18);

    function sig(item) {
        if (!item || !item.meta || !item.meta.Signature) return '';
        return String(item.meta.Signature).toLowerCase();
    }
    function log(t) { var w = BattleManager._logWindow; if (w) w.push('addText', t); }

    // ── Multiplicateurs de dégâts (flammes ×1.5, nova ×1.4) ──
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (t, c) {
        var v = _mdv.call(this, t, c), s = sig(this.item());
        if (s === 'flammes') v = Math.round(v * 1.5);
        else if (s === 'nova') v = Math.round(v * 1.4);
        return v;
    };

    // ── Effets sur la cible (abime, flammes, arc) ──
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (t) {
        var s = sig(this.item());
        var isArc = (s === 'arc');
        if (isArc && this._loreArc === undefined) this._loreArc = Math.randomInt(3);
        if (isArc && this._loreArc === 2) this._loreCrit = true;

        _apply.call(this, t);

        if (s === 'abime' && t) {
            t.addDebuff(5, 2); t.addDebuff(5, 2);
            if ($gameScreen) $gameScreen.startTint([-60, -60, -40, 40], 18);
            log('\\C[26]🕳️ Puits d’Abîme — la garde magique de ' + t.name() + ' s’effondre.\\C[0]');
        }
        if (s === 'flammes' && t && t.result && t.result().hpDamage > 0) {
            if (BURN > 0) t.addState(BURN);
            if ($gameScreen) $gameScreen.startFlash([255, 90, 20, 90], 20);
            log('\\C[2]🔥 Flammes Maudites — la brûlure ignore toute résistance !\\C[0]');
        }
        if (isArc && t) {
            if (this._loreArc === 0 && !this._loreArcDoubled) {
                this._loreArcDoubled = true;           // garde anti-récursion (bug d'origine corrigé)
                _apply.call(this, t);                  // seconde frappe = double éclair
                log('\\C[23]⚡ Arc Créatif — l’éclair se dédouble !\\C[0]');
            } else if (this._loreArc === 1 && !this._loreArcLogged) {
                if (!t.isStateAffected(15)) t.addState(15);
                this._loreArcLogged = true;
                log('\\C[23]⚡ Arc Créatif — l’éclair fige ' + t.name() + ' !\\C[0]');
            }
        }
    };

    // ── Crit garanti pour l'arc (rôle 2) ──
    var _itemCri = Game_Action.prototype.itemCri;
    Game_Action.prototype.itemCri = function (t) { return this._loreCrit ? 1 : _itemCri.call(this, t); };

    // ── Effets globaux de zone (nova, vague, forteresse) ──
    var _applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function () {
        _applyGlobal.call(this);
        var s = sig(this.item());
        if (!s) return;

        if (s === 'nova') {
            var u = this.subject();
            if (u && u.isActor && u.isActor()) {
                if (window.Corruption) window.Corruption.add(u.actorId(), -3);
                if ($gameParty) $gameParty.aliveMembers().forEach(function (a) {
                    a.states().forEach(function (st) { if (st && st.id && !st.restriction && [5, 6, 8].indexOf(st.id) >= 0) a.removeState(st.id); });
                });
            }
            if ($gameScreen) $gameScreen.startFlash([255, 255, 220, 140], 26);
            log('\\C[0]✨ Nova Sainte — la lumière purifie les âmes.\\C[0]');
        }

        if (s === 'vague' && $gameParty && $gameParty.inBattle()) {
            $gameParty.aliveMembers().forEach(function (a) { a.gainHp(Math.floor(a.mhp * 0.2)); a.addBuff(3, 2); a.startDamagePopup(); });
            if ($gameScreen) $gameScreen.startTint([-20, 20, 60, 0], 20);
            log('\\C[23]🌊 Vague Sacrée — le groupe est baigné d’un bouclier cosmique.\\C[0]');
        }

        if (s === 'forteresse' && $gameParty && $gameParty.inBattle()) {
            var caster = this.subject();
            var shield = caster ? Math.floor(caster.mhp * 0.12) : 0;
            $gameParty.aliveMembers().forEach(function (a) { a.addBuff(3, 3); if (shield > 0) { a.gainHp(shield); a.startDamagePopup(); } });
            log('\\C[6]🛡️ Forteresse d’Âme — l’Objet Spirituel dresse un rempart.\\C[0]');
        }
    };
})();
