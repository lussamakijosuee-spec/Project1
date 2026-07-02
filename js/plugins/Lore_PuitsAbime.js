//=============================================================================
// Lore_PuitsAbime.js — v1.0 · Ombre + Mana Sombre → réduit à 0 la résistance
//   magique ennemie (MDF-) 2 tours. Notetag : <Signature: abime>
//=============================================================================
/*:
 * @plugindesc [Lore 15/50] <Signature: abime> : applique un fort malus de Defense Magique (MDF--) 2 tours a la cible. Les desirs qu'on n'ose pas nommer.
 * @author JOKO
 * @help Ombre(15)+Sombre(5).
 */
(function(){ 'use strict';
    var _apply=Game_Action.prototype.apply;
    Game_Action.prototype.apply=function(t){ _apply.call(this,t); var it=this.item();
        if(it&&it.meta&&/abime/i.test(it.meta.Signature||'')&&t){
            t.addDebuff(5,2); t.addDebuff(5,2);
            if($gameScreen)$gameScreen.startTint([-60,-60,-40,40],18);
            var w=BattleManager._logWindow; if(w)w.push('addText','\\C[26]🕳️ Puits d’Abîme — la garde magique de '+t.name()+' s’effondre.\\C[0]'); } };
})();
