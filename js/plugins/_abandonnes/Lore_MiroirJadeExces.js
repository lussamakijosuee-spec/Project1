//=============================================================================
// Lore_MiroirJadeExces.js — v1.0 · La Marionnette (Jada/Elara) : l'excès sans
//   limite. Elle VOLE les renforts des héros. Miroir de Lou (retenue).
//=============================================================================
/*:
 * @plugindesc [Lore 42/50] Ennemi <MiroirJade> : en fin de tour, vole un buff a un heros (le retire et se l'octroie). Lou en retenue (phase>=4) resiste au vol.
 * @author JOKO
 * @help L'exces de liberte : tout prendre, sans limite.
 */
(function(){ 'use strict';
    function isJade(e){ try{ return e&&e.isEnemy&&e.isEnemy()&&/<MiroirJade>/i.test(e.enemy().note||''); }catch(e){return false;} }
    var _ote=Game_Enemy.prototype.onTurnEnd;
    Game_Enemy.prototype.onTurnEnd=function(){ _ote.call(this);
        try{ if(!isJade(this)||!this.isAlive()||!$gameParty)return;
            var targets=$gameParty.aliveMembers().filter(function(a){ for(var i=0;i<8;i++){ if(a.isBuffAffected(i))return true; } return false; });
            if(!targets.length)return; var v=targets[Math.randomInt(targets.length)];
            if(typeof window.Ame!=='undefined'&&window.Ame.phase('lou')>=4&&Math.random()<0.5){ var w0=BattleManager._logWindow; if(w0)w0.push('addText','\\C[23]La retenue de Lou déjoue le vol de la Marionnette.\\C[0]'); return; }
            for(var i=0;i<8;i++){ if(v.isBuffAffected(i)){ v.removeBuff(i); this.addBuff(i,2); break; } }
            var w=BattleManager._logWindow; if(w)w.push('addText','\\C[27]La Marionnette arrache la force de '+v.name()+' !\\C[0]');
        }catch(e){} };
})();
