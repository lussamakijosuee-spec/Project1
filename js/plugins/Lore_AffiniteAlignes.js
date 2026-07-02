//=============================================================================
// Lore_AffiniteAlignes.js — v1.0 · LES ALIGNÉS (72%) : +20% dans la branche de
//   leur âme, -20% dans les autres. (Thylane/Neyssa/Tianna.)
//=============================================================================
/*:
 * @plugindesc [Lore 08/50] Acteur <Mana: x> SANS <Mana2> et SANS <Atone> : +20% degats dans sa source, -20% dans les autres sources (hors physique/pur).
 * @author JOKO
 * @help Source d'un element -> Corps(4,5,8,11,15) Ame(2,14) Esprit(3,6,9,10,12,13). Physique(1)/Pur(7,16) neutres.
 */
(function () {
    'use strict';
    function srcEl(el){ if([4,5,8,11,15].indexOf(el)>=0)return'corps'; if([2,14].indexOf(el)>=0)return'ame'; if([3,6,9,10,12,13].indexOf(el)>=0)return'esprit'; return null; }
    function affSrc(b){ try{ if(!b.actor)return null; var n=b.actor().note||''; if(/<Atone>/i.test(n)||/<Mana2:/i.test(n))return null; var m=/<Mana:\s*([a-zA-Zàé]+)>/i.exec(n); if(!m)return null; var s=m[1].toLowerCase();
        if(s.indexOf('neg')>=0||s.indexOf('somb')>=0)return'corps'; if(s.indexOf('spir')>=0||s.indexOf('ame')>=0)return'ame'; if(s.indexOf('pos')>=0)return'esprit'; return null; }catch(e){return null;} }
    var _mdv=Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue=function(target,critical){
        var v=_mdv.call(this,target,critical); var u=this.subject(); var a=affSrc(u); if(!a)return v;
        var it=this.item(); if(!it||!it.damage)return v; var es=srcEl(it.damage.elementId); if(!es)return v;
        return Math.round(v*(es===a?1.2:0.8));
    };
})();
