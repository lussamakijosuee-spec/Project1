//=============================================================================
// Lore_FeuAmeRefuge.js — v1.0 · Le Feu d'Âme : refuge souls-like qui restaure
//   PV/PM ET la Santé Mentale. Commande : FEUAME repos
//=============================================================================
/*:
 * @plugindesc [Lore 24/50] Commande FEUAME repos : soigne tout le groupe (PV/PM) et restaure la Sante Mentale (+2 a chaque heros) avec une lueur de braise.
 * @author JOKO
 * @help Le Feu d'Ame est un refuge. Utilise window.Ame si present.
 */
(function(){ 'use strict';
    function glow(){ try{ var o=document.createElement('div'); o.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:55;background:radial-gradient(ellipse at 50% 70%,rgba(255,160,60,.35),transparent 60%);opacity:0;transition:opacity .6s;';
        document.body.appendChild(o); requestAnimationFrame(function(){o.style.opacity='1';}); setTimeout(function(){o.style.opacity='0';},1200); setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o);},1900); }catch(e){} }
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
        if(String(c).toUpperCase()==='FEUAME'&&String(a[0]||'').toLowerCase()==='repos'){
            $gameParty.members().forEach(function(m){ m.recoverAll(); if(window.Ame)window.Ame.bon(m.actorId(),2); });
            glow(); AudioManager.playSe({name:'Saint5',volume:80,pitch:100,pan:0});
            $gameMessage.add('\\C[17]🔥 Le Feu d’Âme réchauffe les âmes. Vous êtes apaisés.\\C[0]'); } };
})();
