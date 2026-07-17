//=============================================================================
// Lore_MiroirKev.js — v1.0 · Kev, l'Empereur arrogant : écrase ceux qui doutent,
//   mais son arrogance l'aveugle face à qui a confiance. Miroir de Vesper.
//=============================================================================
/*:
 * @plugindesc [Lore 41/50] Ennemi <MiroirKev> : degats x1.4 contre un heros a faible SAN (doute), mais PREND x1.3 des heros a haute confiance (phase 5). L'arrogance a un prix.
 * @author JOKO
 * @help Le contre de Kev, c'est une Vesper qui s'affirme.
 */
(function(){ 'use strict';
    function isKev(e){ try{ return e&&e.isEnemy&&e.isEnemy()&&/<MiroirKev>/i.test(e.enemy().note||''); }catch(e){return false;} }
    function ph(a){ try{ return typeof window.Ame!=='undefined'?window.Ame.phase(a.actorId()):3; }catch(e){return 3;} }
    var _mdv=Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue=function(target,critical){ var v=_mdv.call(this,target,critical);
        var u=this.subject();
        if(isKev(u)&&target&&target.isActor&&target.isActor()){ var p=ph(target); if(p<=2)v=Math.round(v*1.4); }
        if(target&&isKev(target)&&u&&u.isActor&&u.isActor()){ if(ph(u)>=5){ v=Math.round(v*1.3); var w=BattleManager._logWindow; if(w&&Math.random()<0.3)w.push('addText','\\C[24]La confiance perce l’arrogance de Kev !\\C[0]'); } }
        return v; };
})();
