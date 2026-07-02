//=============================================================================
// Lore_ManaSourceTag.js — v1.0 · Annonce la SOURCE (Corps/Âme/Esprit/Pur) d'un
//   sort au combat, selon le lore des 3 Sources Primordiales.
//=============================================================================
/*:
 * @plugindesc [Lore 01/50] Journal de combat : nomme la Source (Corps/Ame/Esprit/Pur) et son role dans le cycle.
 * @author JOKO
 * @help Lit l'element du skill (ou <Mana: ...>) et annonce sa source primordiale.
 * Aucune config. Purement visuel/narratif.
 */
(function () {
    'use strict';
    var CORPS=[4,5,8,11,15], AME=[2,14], ESPRIT=[3,6,9,10,12,13], PUR=[7,16];
    function srcOf(el){
        if(PUR.indexOf(el)>=0) return {n:'MANA PUR', c:18, r:'transcende le cycle'};
        if(CORPS.indexOf(el)>=0) return {n:'CORPS', c:2, r:'la puissance brute, au prix du corps'};
        if(AME.indexOf(el)>=0) return {n:'ÂME', c:21, r:'l’essence immortelle'};
        if(ESPRIT.indexOf(el)>=0) return {n:'ESPRIT', c:23, r:'l’intelligence qui prend forme'};
        return null;
    }
    var _sa = BattleManager.startAction;
    BattleManager.startAction = function(){
        try{
            var subj=this._subject, act=subj&&subj.currentAction&&subj.currentAction();
            if(act&&act.item&&act.item()){
                var it=act.item(), el=it.damage?it.damage.elementId:0;
                if(it.meta&&it.meta.Mana){ var m=String(it.meta.Mana).toLowerCase();
                    if(m.indexOf('neg')>=0)el=4; else if(m.indexOf('spir')>=0||m.indexOf('ame')>=0)el=2;
                    else if(m.indexOf('pos')>=0)el=3; else if(m.indexOf('somb')>=0)el=5; else if(m.indexOf('pur')>=0)el=7; }
                var s=srcOf(el);
                if(s&&this._logWindow){ this._logWindow.push('addText','\\C['+s.c+']◈ Source : '+s.n+' — '+s.r+'\\C[0]'); }
            }
        }catch(e){}
        _sa.call(this);
    };
})();
