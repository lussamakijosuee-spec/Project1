//=============================================================================
// FusionsEtendues.js — v1.0  ·  La Fusion généralisée : technique · rune · forme
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources (v6)
//   À charger APRÈS FusionMana, CorruptionAme, Errance, JadeEntitePlunging.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La FUSION est un principe, pas un sort : fondre deux
 * sources = fusion, qu'elle soit technique (instant), rune (gravée) ou forme.
 * @author JOKO
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA FUSION GÉNÉRALISÉE                                               by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Canon (Codex v6) : dès que l'âme, le mana originel ou le mana sombre
 *  FONDENT ensemble, c'est une Fusion. Trois formes :
 *
 *  ▶ LA TECHNIQUE  <FusionTech: chair|rasoir|songe>  (skills 821-823)
 *      Fondre deux sources UN INSTANT. Pas d'état à tenir : le prix tombe
 *      immédiatement (la moitié du prix/tour de la forme complète).
 *
 *  ▶ LA RUNE  <Rune>  (skills 824-826)
 *      Une Parole GRAVÉE en chiffres : elle agit sans être récitée.
 *      Jamais ratée. Utilisable même MUET (l'état 6 ne la scelle pas).
 *
 *  ▶ LA FORME (transformation) — FusionMana (états 195-197), inchangée.
 *
 *  Tout ce qui fond deux sources est une Fusion : c'est le même principe,
 *  à trois échelles — l'instant, la gravure, la chair.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var PRIX = {   // moitié du prix/tour des formes (FusionMana), payé UNE fois
        chair:  { corr: 2, err: 2, ment: 0 },
        rasoir: { corr: 2, err: 0, ment: 1 },
        songe:  { corr: 0, err: 2, ment: 1 }
    };

    // ── LA TECHNIQUE : prix immédiat au moment de l'impact ──
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        var it = this.item();
        if (!it || !it.meta || !it.meta.FusionTech || this._ftPaye) return;
        this._ftPaye = true;
        var k = String(it.meta.FusionTech).toLowerCase().trim();
        var pr = PRIX[k];
        var s = this.subject();
        if (!pr || !s || !s.isActor || !s.isActor()) return;
        var id = s.actorId();
        try { if (pr.corr && window.Corruption) window.Corruption.add(id, pr.corr); } catch (e) {}
        try { if (pr.err && window.Errance) window.Errance.add(id, pr.err); } catch (e) {}
        try { if (pr.ment && window.Ame) window.Ame.mauvais(id, pr.ment); } catch (e) {}
    };

    // ── LA RUNE : gravée, elle ne se récite pas — le Mutisme ne la scelle pas ──
    var _sealed = Game_BattlerBase.prototype.isSkillSealed;
    Game_BattlerBase.prototype.isSkillSealed = function (skillId) {
        var sk = $dataSkills[skillId];
        if (sk && sk.meta && sk.meta.Rune !== undefined) return false;
        return _sealed.call(this, skillId);
    };
    var _stypeSealed = Game_BattlerBase.prototype.isSkillTypeSealed;
    // (les runes échappent aussi au scellage de type via meta, géré au niveau canUse)
    var _canUse = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if (skill && skill.meta && skill.meta.Rune !== undefined) {
            return this.meetsUsableItemConditions(skill) &&
                   this.canPaySkillCost(skill) && !this.isSkillSealed(skill.id);
        }
        return _canUse.call(this, skill);
    };
    // jamais ratée : la gravure est exacte
    var _hit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function (target) {
        var it = this.item();
        if (it && it.meta && it.meta.Rune !== undefined) return 1;
        return _hit.call(this, target);
    };
})();
