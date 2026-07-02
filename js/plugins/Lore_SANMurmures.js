//=============================================================================
// Lore_SANMurmures.js — v1.0 · Quand la SAN du groupe est basse, des murmures
//   traversent l'écran sur la carte.
//=============================================================================
/*:
 * @plugindesc [Lore 27/50] Murmures flottants aleatoires sur la carte, d'autant plus frequents que la SAN du groupe est basse. Ambiance.
 * @author JOKO
 * @help Lecture window.Ame. Textes courts et fugaces.
 */
(function(){ 'use strict';
    var LINES=['…tu ne sortiras pas…','…reste avec nous…','…ce monde est faux…','…ton âme est si belle…','…encore une partie…','…personne ne revient…'];
    function worstPhase(){ if(typeof window.Ame==='undefined'||!$gameParty)return 5; var m=5; $gameParty.members().forEach(function(a){ var p=window.Ame.phase(a.actorId()); if(p)m=Math.min(m,p); }); return m; }
    function whisper(txt){ try{ var d=document.createElement('div');
        d.style.cssText='position:fixed;left:'+(10+Math.random()*60)+'%;top:'+(20+Math.random()*50)+'%;color:rgba(200,180,220,.0);font:italic 20px Georgia,serif;pointer-events:none;z-index:45;text-shadow:0 0 8px #000;transition:opacity 1.2s;';
        d.textContent=txt; document.body.appendChild(d); requestAnimationFrame(function(){d.style.color='rgba(200,180,220,.85)';});
        setTimeout(function(){d.style.color='rgba(200,180,220,0)';},1800); setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d);},3200);
    }catch(e){} }
    var _upd=Scene_Map.prototype.update;
    Scene_Map.prototype.update=function(){ _upd.call(this);
        var p=worstPhase(); if(p>=4)return; this._loreWT=(this._loreWT||0)+1;
        var period=Math.max(180, 900-(4-p)*180); // plus bas = plus frequent
        if(this._loreWT>=period){ this._loreWT=0; if(Math.random()<0.7) whisper(LINES[Math.randomInt(LINES.length)]); } };
})();
