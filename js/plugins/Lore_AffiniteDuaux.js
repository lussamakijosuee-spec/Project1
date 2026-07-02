//=============================================================================
// Lore_AffiniteDuaux.js — v1.0 · LES DUAUX (15%) : +10% dans DEUX branches,
//   neutre dans la troisième. (Lou : Âme + Esprit.)
//=============================================================================
/*:
 * @plugindesc [Lore 09/50] Acteur avec <Mana: x> ET <Mana2: y> : +10% degats dans ses deux sources, neutre ailleurs.
 * @author JOKO
 * @help Adaptabilite tactique des Duaux, au prix d'une maitrise moins profonde (pas de +20%).
 */
(function () {
    'use strict';
    function srcEl(el){ if([4,5,8,11,15].indexOf(el)>=0)return'corps'; if([2,14].indexOf(el)>=0)return'ame'; if([3,6,9,10,12,13].indexOf(el)>=0)return'esprit'; return null; }
    function toSrc(s){ s=String(s).toLowerCase(); if(s.indexOf('neg')>=0||s.indexOf('somb')>=0)return'corps'; if(s.indexOf('spir')>=0||s.indexOf('ame')>=0)return'ame'; if(s.indexOf('pos')>=0)return'esprit'; return null; }
    function duaux(b){ try{ if(!b.actor)return null; var n=b.actor().note||''; var m1=/<Mana:\s*([a-zA-Zàé]+)>/i.exec(n), m2=/<Mana2:\s*([a-zA-Zàé]+)>/i.exec(n); if(!m1||!m2)return null; return [toSrc(m1[1]),toSrc(m2[1])]; }catch(e){return null;} }
    var _mdv=Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue=function(target,critical){
        var v=_mdv.call(this,target,critical); var d=duaux(this.subject()); if(!d)return v;
        var it=this.item(); if(!it||!it.damage)return v; var es=srcEl(it.damage.elementId); if(!es)return v;
        return Math.round(v*(d.indexOf(es)>=0?1.1:1.0));
    };
})();
