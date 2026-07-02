//=============================================================================
// Lore_ForteresseAme.js — v1.0 · Terre + Mana Spirituel → bouclier lié aux PV
//   de l'Objet Spirituel (le porteur). Notetag : <Signature: forteresse>
//=============================================================================
/*:
 * @plugindesc [Lore 18/50] <Signature: forteresse> : donne a tous les allies DEF++ (3 tours) et un renfort de PV egal a 12% des PV max du lanceur (Objet Spirituel).
 * @author JOKO
 * @help Terre(11)+Spirituel(2). Un corps solide devient une muraille.
 */
(function(){ 'use strict';
    var _apply=Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal=function(){ _apply.call(this); var it=this.item();
        if(it&&it.meta&&/forteresse/i.test(it.meta.Signature||'')&&$gameParty&&$gameParty.inBattle()){
            var u=this.subject(); var shield=u?Math.floor(u.mhp*0.12):0;
            $gameParty.aliveMembers().forEach(function(a){ a.addBuff(3,3); if(shield>0){ a.gainHp(shield); a.startDamagePopup(); } });
            var w=BattleManager._logWindow; if(w)w.push('addText','\\C[6]🛡️ Forteresse d’Âme — l’Objet Spirituel dresse un rempart.\\C[0]'); } };
})();
