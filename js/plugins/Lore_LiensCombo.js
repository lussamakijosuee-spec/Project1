//=============================================================================
// Lore_LiensCombo.js — v1.0 · Les Liens forts renforcent le groupe : un héros
//   au lien élevé donne un petit bonus offensif à l'équipe.
//=============================================================================
/*:
 * @plugindesc [Lore 38/50] Chaque niveau de Lien (window.Lien) d'un heros present ajoute +2% degats a toute l'equipe (plafond +20%). Le lien rend plus fort ensemble.
 * @author JOKO
 * @help Necessite LiensSocial (window.Lien). Neutre si absent.
 */
(function(){ 'use strict';
    function bonus(){ if(typeof window.Lien==='undefined'||!$gameParty)return 1; var sum=0;
        $gameParty.battleMembers().forEach(function(a){ sum+=window.Lien.niveau(a.actorId())||0; });
        return 1+Math.min(0.2, sum*0.02); }
    var _mdv=Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue=function(t,c){ var v=_mdv.call(this,t,c);
        if(this.subject()&&this.subject().isActor&&this.subject().isActor()&&$gameParty.inBattle()) v=Math.round(v*bonus());
        return v; };
})();
