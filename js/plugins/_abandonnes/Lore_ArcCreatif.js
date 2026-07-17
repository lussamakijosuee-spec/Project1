//=============================================================================
// Lore_ArcCreatif.js — v1.0 · Foudre + Mana Originel → le lanceur DÉFINIT
//   librement la forme du sort (bonus aléatoire). Notetag : <Signature: arc>
//=============================================================================
/*:
 * @plugindesc [Lore 17/50] <Signature: arc> : chaque lancer choisit librement une forme -> effet bonus aleatoire (2e frappe, paralysie, ou crit garanti).
 * @author JOKO
 * @help Foudre(12)+Originel(6). Le joueur dessine son eclair.
 */
(function(){ 'use strict';
    var _apply=Game_Action.prototype.apply;
    Game_Action.prototype.apply=function(t){
        var it=this.item(); var arc=it&&it.meta&&/arc/i.test(it.meta.Signature||'');
        if(arc&&this._loreArc===undefined) this._loreArc=Math.randomInt(3);
        if(arc&&this._loreArc===2){ this._loreCrit=true; }
        _apply.call(this,t);
        if(arc&&t){ var w=BattleManager._logWindow;
            if(this._loreArc===0){ this.apply(t); if(w&&!this._loreArcLogged){ w.push('addText','\\C[23]⚡ Arc Créatif — l’éclair se dédouble !\\C[0]'); this._loreArcLogged=true; } }
            else if(this._loreArc===1){ if(!t.isStateAffected(15))t.addState(15); if(w&&!this._loreArcLogged){ w.push('addText','\\C[23]⚡ Arc Créatif — l’éclair fige '+t.name()+' !\\C[0]'); this._loreArcLogged=true; } }
        }
    };
    var _itemCri=Game_Action.prototype.itemCri;
    Game_Action.prototype.itemCri=function(t){ if(this._loreCrit)return 1; return _itemCri.call(this,t); };
})();
