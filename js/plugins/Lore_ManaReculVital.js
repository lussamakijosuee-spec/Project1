//=============================================================================
// Lore_ManaReculVital.js — v1.0 · « La vie contre la puissance » : Mana Sombre /
//   Négatif ronge les PV du lanceur. Notetag skill : <ReculVital: 15>
//=============================================================================
/*:
 * @plugindesc [Lore 02/50] Skills <ReculVital: N> : le lanceur perd N% des degats infliges en PV (recul du Corps). Atones : moitie.
 * @author JOKO
 * @help Sur un skill : <ReculVital: 15>  → le lanceur encaisse 15% des degats
 * qu'il inflige. Un acteur <Atone> (aucune affinite) subit la MOITIE du recul.
 */
(function () {
    'use strict';
    function atone(b){ try{ var n=b.actor?b.actor().note:(b.enemy?b.enemy().note:''); return /<Atone>/i.test(n||''); }catch(e){ return false; } }
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target){
        _apply.call(this, target);
        var it=this.item();
        if(!it||!it.meta||it.meta.ReculVital===undefined) return;
        var res=target&&target.result?target.result():null;
        if(!res||res.hpDamage<=0) return;
        var pct=Number(it.meta.ReculVital)||0; if(pct<=0) return;
        var u=this.subject(); if(!u) return;
        var cost=Math.floor(res.hpDamage*pct/100); if(atone(u)) cost=Math.floor(cost/2);
        if(cost>0){ u.gainHp(-cost); u.startDamagePopup();
            if($gameScreen) $gameScreen.startFlash([120,0,0,60],12); }
    };
})();
