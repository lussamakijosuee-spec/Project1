//=============================================================================
// Lore_MiroirJosu.js — v1.0 · Josu, le Dieu Fou : plus on le frappe, plus il
//   s'amuse (et devient dangereux). Miroir de Thylane (colère ⇄ joie).
//=============================================================================
/*:
 * @plugindesc [Lore 39/50] Ennemi <MiroirJosu> : chaque coup encaisse le rend plus fort (ATK+). Si Thylane est SEREINE (phase>=4), sa colere maitrisee tempere la joie de Josu.
 * @author JOKO
 * @help Le contre naturel de Josu, c'est une Thylane equilibree.
 */
(function(){ 'use strict';
    function isJosu(e){ try{ return e&&e.isEnemy&&e.isEnemy()&&/<MiroirJosu>/i.test(e.enemy().note||''); }catch(e){return false;} }
    function thyCalm(){ try{ return typeof window.Ame!=='undefined'&&window.Ame.calme('thylane'); }catch(e){return false;} }
    var _ed=Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage=function(target,value){ _ed.call(this,target,value);
        if(value>0&&isJosu(target)&&target.isAlive()){
            if(thyCalm()&&Math.random()<0.6){ var w=BattleManager._logWindow; if(w&&Math.random()<0.3)w.push('addText','\\C[23]Thylane garde son calme — la joie de Josu retombe.\\C[0]'); return; }
            target.addBuff(2,2); if(Math.random()<0.35){ var w2=BattleManager._logWindow; if(w2)w2.push('addText','\\C[2]Josu : « Encore ! Plus tu frappes, plus je m’amuse ! »\\C[0]'); if($gameScreen)$gameScreen.startFlash([255,180,0,60],14); } } };
})();
