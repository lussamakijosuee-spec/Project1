//=============================================================================
// Lore_RealiteGlitch.js — v1.0 · Le monde est numérique : distorsion de réalité
//   sur commande (GLITCH [ms]) et automatiquement si la corruption est extrême.
//=============================================================================
/*:
 * @plugindesc [Lore 33/50] Commande GLITCH [ms] : deforme l'ecran (retour de code). Se declenche aussi tout seul quand la corruption d'un heros est tres haute.
 * @author JOKO
 * @param SeuilAuto @type number @default 8
 * @help Les codes sources vacillent.
 */
(function(){ 'use strict';
    var SEUIL=Number(PluginManager.parameters('Lore_RealiteGlitch')['SeuilAuto']||8);
    function glitch(ms){ try{ if(!document.getElementById('loreGlKF')){ var s=document.createElement('style'); s.id='loreGlKF';
        s.textContent='@keyframes loreGl{0%{clip-path:inset(0 0 0 0);transform:translate(0)}20%{clip-path:inset(20% 0 40% 0);transform:translate(-8px)}40%{clip-path:inset(60% 0 10% 0);transform:translate(6px)}60%{clip-path:inset(10% 0 70% 0);transform:translate(-4px)}100%{clip-path:inset(0 0 0 0);transform:translate(0)}}'; document.head.appendChild(s); }
        var o=document.createElement('div'); o.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:62;background:repeating-linear-gradient(0deg,rgba(255,0,80,.08),rgba(0,255,200,.08) 3px);mix-blend-mode:screen;animation:loreGl .18s steps(2) infinite;';
        document.body.appendChild(o); setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o);}, ms||600);
    }catch(e){} }
    window.LoreGlitch=glitch;
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
        if(String(c).toUpperCase()==='GLITCH') glitch(Number(a[0])||600); };
    var _upd=Scene_Map.prototype.update;
    Scene_Map.prototype.update=function(){ _upd.call(this);
        try{ if(!window.Corruption||!$gameParty)return; this._loreGT=(this._loreGT||0)+1; if(this._loreGT<240)return; this._loreGT=0;
            var mx=0; $gameParty.members().forEach(function(x){ mx=Math.max(mx,window.Corruption.niveau(x.actorId())); });
            if(mx>=SEUIL&&Math.random()<0.5) glitch(500);
        }catch(e){} };
})();
