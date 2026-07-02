//=============================================================================
// Lore_PrismeReel.js — v1.0 · LES ÉLUS DU PRISME : lancer du Mana Semi-Parfait
//   (16) ou Pur (7) DÉFORME la réalité (glitch écran bref).
//=============================================================================
/*:
 * @plugindesc [Lore 12/50] Utiliser un skill element Mana semi-parfait(16) ou Parfait(7) provoque une distorsion visuelle de la realite (glitch CSS).
 * @author JOKO
 * @help Plus la magie est absolue, plus le monde vacille. Purement visuel, non bloquant.
 */
(function () {
    'use strict';
    function glitch(ms){
        try{ var c=document.getElementById('UpperCanvas')||document.querySelector('canvas'); if(!c)return;
            var o=document.createElement('div'); o.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:60;mix-blend-mode:difference;background:linear-gradient(90deg,rgba(224,160,255,.25),rgba(95,214,192,.2));animation:lorePrisme .12s steps(2) infinite;';
            if(!document.getElementById('lorePrismeKF')){ var s=document.createElement('style'); s.id='lorePrismeKF'; s.textContent='@keyframes lorePrisme{0%{transform:translate(0,0)}50%{transform:translate(-4px,2px)}100%{transform:translate(3px,-3px)}}'; document.head.appendChild(s); }
            document.body.appendChild(o); setTimeout(function(){ if(o.parentNode)o.parentNode.removeChild(o); }, ms||420);
        }catch(e){}
    }
    var _sa=BattleManager.startAction;
    BattleManager.startAction=function(){
        try{ var subj=this._subject, act=subj&&subj.currentAction&&subj.currentAction();
            if(act&&act.item&&act.item()&&act.item().damage&&[7,16].indexOf(act.item().damage.elementId)>=0) glitch(460);
        }catch(e){}
        _sa.call(this);
    };
})();
