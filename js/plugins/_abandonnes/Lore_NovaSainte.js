//=============================================================================
// Lore_NovaSainte.js — v1.0 · Lumière + Mana Pur → purifie la corruption d'âme
//   + dégâts massifs non-élémentaux. Notetag : <Signature: nova>
//=============================================================================
/*:
 * @plugindesc [Lore 16/50] <Signature: nova> : +40% degats non-elementaux, purge les etats negatifs des allies et REDUIT la corruption du lanceur.
 * @author JOKO
 * @help Lumiere(14)+Pur(7). Ce qui ramene l'ame a sa source.
 */
(function(){ 'use strict';
    var _mdv=Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue=function(t,c){ var v=_mdv.call(this,t,c);
        var it=this.item(); if(it&&it.meta&&/nova/i.test(it.meta.Signature||'')) v=Math.round(v*1.4); return v; };
    var _apply=Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal=function(){ _apply.call(this); var it=this.item();
        if(it&&it.meta&&/nova/i.test(it.meta.Signature||'')){
            var u=this.subject();
            if(u&&u.isActor&&u.isActor()){ if(window.Corruption)window.Corruption.add(u.actorId(),-3);
                if($gameParty)$gameParty.aliveMembers().forEach(function(a){ a.states().forEach(function(s){ if(s&&s.id&&!s.restriction&&[5,6,8].indexOf(s.id)>=0)a.removeState(s.id); }); }); }
            if($gameScreen)$gameScreen.startFlash([255,255,220,140],26);
            var w=BattleManager._logWindow; if(w)w.push('addText','\\C[0]✨ Nova Sainte — la lumière purifie les âmes.\\C[0]'); } };
})();
