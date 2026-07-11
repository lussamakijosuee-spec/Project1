//=============================================================================
// Lore_MiroirDono.js — v1.0 · Dono, le Loyal : surconcentré sur un seul être
//   aimé. Il frappe fort sa fixation… et néglige le reste. Miroir de Korrah.
//=============================================================================
/*:
 * @plugindesc [Lore 40/50] Ennemi <MiroirDono> : se fixe sur un heros (degats x1.5 contre lui, x0.6 contre les autres). Korrah concentree (phase>=4) peut briser sa fixation.
 * @author JOKO
 * @help Sa lecon : ne pas oublier l'amour de soi.
 */
(function(){ 'use strict';
    function isDono(e){ try{ return e&&e.isEnemy&&e.isEnemy()&&/<MiroirDono>/i.test(e.enemy().note||''); }catch(e){return false;} }
    var _mdv=Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue=function(target,critical){ var v=_mdv.call(this,target,critical);
        var u=this.subject(); if(!isDono(u)||!target||!target.isActor||!target.isActor())return v;
        if(u._loreFix===undefined||!$gameParty.battleMembers().some(function(a){return a.index()===u._loreFix;})){ var m=$gameParty.aliveMembers(); if(m.length)u._loreFix=m[Math.randomInt(m.length)].index(); }
        // Korrah concentree peut briser la fixation
        try{ if(typeof window.Ame!=='undefined'&&window.Ame.phase('neyssa')>=4&&Math.random()<0.4){ u._loreFix=-1; } }catch(e){}
        return Math.round(v*(target.index()===u._loreFix?1.5:0.6)); };
})();
