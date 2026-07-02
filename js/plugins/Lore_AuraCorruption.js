//=============================================================================
// Lore_AuraCorruption.js — v1.0 · Les héros corrompus dégagent une aura sombre
//   pulsante au combat.
//=============================================================================
/*:
 * @plugindesc [Lore 23/50] Aura sombre pulsante sur les acteurs dont la corruption > 0 (Sprite_Actor). Purement visuel. Lecture window.Corruption.
 * @author JOKO
 * @help Plus la corruption est haute, plus l'aura est intense.
 */
(function(){ 'use strict';
    if(typeof Sprite_Actor==='undefined')return;
    var _upd=Sprite_Actor.prototype.update;
    Sprite_Actor.prototype.update=function(){ _upd.call(this);
        try{ var a=this._actor; if(!a||!window.Corruption)return; var lv=window.Corruption.niveau(a.actorId());
            if(lv>0){ this._loreT=(this._loreT||0)+0.08; var p=(Math.sin(this._loreT)*0.5+0.5); var i=Math.min(1,lv/8);
                var g=Math.floor(60*i*p); this.setBlendColor([g,0,Math.floor(g*1.4),Math.floor(80*i*p)]); }
            else if(this._loreT){ this.setBlendColor([0,0,0,0]); this._loreT=0; }
        }catch(e){} };
})();
