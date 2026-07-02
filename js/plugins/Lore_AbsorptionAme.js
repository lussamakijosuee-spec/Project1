//=============================================================================
// Lore_AbsorptionAme.js — v1.0 · Recueillir l'âme d'un boss : cinématique
//   d'absorption + gain d'âmes. Commande : AMEABSORB <nom>
//=============================================================================
/*:
 * @plugindesc [Lore 46/50] Commande AMEABSORB <nom> : cinematique DOM d'absorption d'ame de boss + gain d'ames (Var 15). Heriter de l'autorite/puissance.
 * @author JOKO
 * @param SoulVar @type variable @default 15
 * @param Gain @type number @default 5
 * @help Seuls les joueurs peuvent absorber l'ame d'un boss (cf. lore).
 */
(function(){ 'use strict';
    var P=PluginManager.parameters('Lore_AbsorptionAme'); var SV=Number(P['SoulVar']||15), G=Number(P['Gain']||5);
    function cine(nom){ try{ var o=document.createElement('div');
        o.style.cssText='position:fixed;inset:0;z-index:84;pointer-events:none;background:radial-gradient(circle at 50% 50%,rgba(180,120,255,.0),rgba(0,0,0,.85));opacity:0;transition:opacity .6s;display:flex;align-items:center;justify-content:center;';
        var t=document.createElement('div'); t.style.cssText='color:#e0c0ff;font:700 30px Georgia,serif;text-shadow:0 0 20px #a06cff;text-align:center;transform:scale(.8);transition:transform 1s;';
        t.innerHTML='◈ ÂME ABSORBÉE ◈<br><span style="font-size:22px;color:#fff;">'+ (nom||'un boss') +'</span>'; o.appendChild(t); document.body.appendChild(o);
        requestAnimationFrame(function(){o.style.opacity='1';t.style.transform='scale(1)';});
        setTimeout(function(){o.style.opacity='0';},2200); setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o);},3000);
        AudioManager.playSe({name:'Saint5',volume:90,pitch:90,pan:0});
    }catch(e){} }
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
        if(String(c).toUpperCase()==='AMEABSORB'){ if(SV>0)$gameVariables.setValue(SV,$gameVariables.value(SV)+G); cine(a.join(' ')); } };
})();
