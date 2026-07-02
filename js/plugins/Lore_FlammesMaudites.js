//=============================================================================
// Lore_FlammesMaudites.js — v1.0 · Feu + Mana Négatif → la brûlure IGNORE la
//   résistance au feu. Notetag skill : <Signature: flammes>
//=============================================================================
/*:
 * @plugindesc [Lore 13/50] <Signature: flammes> : +50% degats et applique une Brulure (state) qui ignore la resistance au feu.
 * @author JOKO
 * @param BurnState @type state @default 18
 * @help Feu(8)+Negatif(4). La colere qui prend forme.
 */
(function(){ 'use strict';
    var ST=Number(PluginManager.parameters('Lore_FlammesMaudites')['BurnState']||18);
    var _mdv=Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue=function(t,c){ var v=_mdv.call(this,t,c);
        var it=this.item(); if(it&&it.meta&&/flammes/i.test(it.meta.Signature||'')) v=Math.round(v*1.5); return v; };
    var _apply=Game_Action.prototype.apply;
    Game_Action.prototype.apply=function(t){ _apply.call(this,t); var it=this.item();
        if(it&&it.meta&&/flammes/i.test(it.meta.Signature||'')&&t&&t.result&&t.result().hpDamage>0){
            if(ST>0)t.addState(ST); if($gameScreen)$gameScreen.startFlash([255,90,20,90],20);
            var w=BattleManager._logWindow; if(w)w.push('addText','\\C[2]🔥 Flammes Maudites — la brûlure ignore toute résistance !\\C[0]'); } };
})();
