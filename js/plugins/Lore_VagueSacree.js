//=============================================================================
// Lore_VagueSacree.js — v1.0 · Eau + Mana Positif → soin de zone + bouclier
//   cosmique pour tous les alliés. Notetag : <Signature: vague>
//=============================================================================
/*:
 * @plugindesc [Lore 14/50] <Signature: vague> : apres le sort, soigne 20% PV a tous les allies et leur donne DEF+ (bouclier cosmique, 2 tours).
 * @author JOKO
 * @help Eau(9)+Positif(3). L'intelligence qui s'ecoule.
 */
(function(){ 'use strict';
    var _apply=Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal=function(){ _apply.call(this); var it=this.item();
        if(it&&it.meta&&/vague/i.test(it.meta.Signature||'')&&$gameParty&&$gameParty.inBattle()){
            $gameParty.aliveMembers().forEach(function(a){ a.gainHp(Math.floor(a.mhp*0.2)); a.addBuff(3,2); a.startDamagePopup(); });
            if($gameScreen)$gameScreen.startTint([-20,20,60,0],20);
            var w=BattleManager._logWindow; if(w)w.push('addText','\\C[23]🌊 Vague Sacrée — le groupe est baigné d’un bouclier cosmique.\\C[0]'); } };
})();
