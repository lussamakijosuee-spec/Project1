//=============================================================================
// Lore_SANTeinte.js — v1.0 · Le monde se teinte selon la pire Santé Mentale du
//   groupe (vignette immersive, non intrusive).
//=============================================================================
/*:
 * @plugindesc [Lore 25/50] Vignette DOM discrete sur la carte : plus la SAN du groupe est basse, plus le monde s'assombrit/vacille. N'utilise PAS startTint (zero conflit).
 * @author JOKO
 * @help Lecture window.Ame. Phase 5 = clair, phase 1 = sombre et rougeatre.
 */
(function(){ 'use strict';
    var el=null;
    function ensure(){ if(el)return el; el=document.createElement('div');
        el.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:40;opacity:0;transition:opacity .8s, box-shadow .8s;box-shadow:inset 0 0 0 rgba(0,0,0,0);'; document.body.appendChild(el); return el; }
    function worstPhase(){ if(typeof window.Ame==='undefined'||!$gameParty)return 5; var m=5;
        $gameParty.members().forEach(function(a){ var p=window.Ame.phase(a.actorId()); if(p)m=Math.min(m,p); }); return m; }
    var _upd=Scene_Map.prototype.update;
    Scene_Map.prototype.update=function(){ _upd.call(this);
        try{ var p=worstPhase(); if(p!==this._loreSanP){ this._loreSanP=p; var e=ensure();
            var i=(5-p)/4; // 0..1
            e.style.opacity=String(0.05+i*0.5);
            e.style.boxShadow='inset 0 0 '+Math.floor(60+i*180)+'px rgba('+Math.floor(40+i*120)+',0,'+Math.floor(30)+','+(0.4+i*0.4)+')'; }
        }catch(e){} };
    var _term=Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate=function(){ _term.call(this); if(el){ el.style.opacity='0'; } };
})();
