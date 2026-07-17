//=============================================================================
// Lore_SoinsSAN.js — v1.0 · « Un esprit brisé soigne mal » : les SOINS des
//   héros faiblissent quand leur Santé Mentale (SAN) chute.
//=============================================================================
/*:
 * @plugindesc [Lore 03/50] Les soins (HP recover) d'un acteur sont reduits quand sa Sante Mentale (Ame) est basse. Phase 5=100%, phase1~55%.
 * @author JOKO
 * @help Aucune config. Utilise window.Ame (phases 1-5). Ne touche pas aux ennemis.
 */
(function () {
    'use strict';
    function sanFactor(b){
        if(!b||!b.isActor||!b.isActor()) return 1;
        if(typeof window.Ame==='undefined') return 1;
        var ph=window.Ame.phase(b.actorId()); if(!ph) return 1;
        return 0.55 + (ph-1)*0.1125; // ph1=0.55 ... ph5=1.0
    }
    var _rec = Game_Action.prototype.itemEffectRecoverHp;
    Game_Action.prototype.itemEffectRecoverHp = function(target, effect){
        var f=sanFactor(this.subject());
        if(f<1){ var e2={code:effect.code,dataId:effect.dataId,value1:effect.value1*f,value2:effect.value2*f};
            return _rec.call(this,target,e2); }
        _rec.call(this,target,effect);
    };
})();
