//=============================================================================
// Lore_AffiniteAtones.js — v1.0 · LES ATONES (12%) : aucun bonus, mais réduits
//   malus : moins de corruption, et la rage du Négatif/Sombre les blesse moins.
//=============================================================================
/*:
 * @plugindesc [Lore 10/50] Acteur/ennemi <Atone> : prend x0.85 des elements Negatif(4)/Sombre(5), et sa corruption gagnee est divisee par 2.
 * @author JOKO
 * @help S'appuie sur window.Corruption si present. Aucun bonus offensif (les Atones apprennent a la dure).
 */
(function () {
    'use strict';
    function atone(b){ try{ var n=b&&b.actor?b.actor().note:(b&&b.enemy?b.enemy().note:''); return /<Atone>/i.test(n||''); }catch(e){return false;} }
    var _ed=Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage=function(target,value){
        var it=this.item();
        if(value>0&&it&&it.damage&&[4,5].indexOf(it.damage.elementId)>=0&&atone(target)) value=Math.floor(value*0.85);
        _ed.call(this,target,value);
    };
    if(typeof window!=='undefined'){
        var hook=function(){ if(window.Corruption&&!window.Corruption._loreAtone){ window.Corruption._loreAtone=true;
            var _add=window.Corruption.add; window.Corruption.add=function(actorId,n){ var a=$gameActors&&$gameActors.actor(actorId);
                if(a&&/<Atone>/i.test(a.actor().note||'')) n=Math.ceil((Number(n)||0)/2); return _add.call(this,actorId,n); }; } };
        var _sm=Scene_Map.prototype.onMapLoaded; Scene_Map.prototype.onMapLoaded=function(){ _sm.call(this); hook(); };
        var _sb=Scene_Battle.prototype.start; Scene_Battle.prototype.start=function(){ _sb.call(this); hook(); };
    }
})();
