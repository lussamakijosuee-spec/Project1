//=============================================================================
// Lore_JadaChoix.js — v1.0 · « Tes choix ne t'appartiennent pas » : un choix
//   piégé où « Non » se dérobe. Commande : JADA choix <question>
//=============================================================================
/*:
 * @plugindesc [Lore 32/50] Commande JADA choix <question> : overlay avec Oui/Non, mais « Non » fuit le curseur puis devient « Oui ». 4e mur.
 * @author JOKO
 * @help Ex : JADA choix Veux-tu vraiment partir ?
 */
(function(){ 'use strict';
    function ask(q){ try{ var o=document.createElement('div');
        o.style.cssText='position:fixed;inset:0;background:rgba(10,0,15,.8);z-index:82;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;font-family:Georgia,serif;color:#eee;';
        var t=document.createElement('div'); t.textContent=q; t.style.cssText='font-size:26px;text-shadow:0 0 10px #a06;max-width:80%;text-align:center;'; o.appendChild(t);
        var row=document.createElement('div'); row.style.cssText='display:flex;gap:40px;position:relative;width:360px;height:60px;justify-content:center;align-items:center;'; o.appendChild(row);
        var oui=document.createElement('button'); oui.textContent='Oui'; oui.style.cssText='background:#7a1a3a;color:#fff;border:0;padding:12px 30px;border-radius:6px;font-size:18px;cursor:pointer;';
        var non=document.createElement('button'); non.textContent='Non'; non.style.cssText='background:#333;color:#ccc;border:0;padding:12px 30px;border-radius:6px;font-size:18px;cursor:pointer;position:absolute;left:220px;transition:all .18s;';
        row.appendChild(oui); row.appendChild(non);
        var flee=0; non.addEventListener('mouseenter',function(){ flee++; if(flee<4){ non.style.left=(Math.random()*260)+'px'; non.style.top=((Math.random()-0.5)*80)+'px'; } else { non.textContent='Oui'; non.style.background='#7a1a3a'; non.style.color='#fff'; } });
        var close=function(){ if(o.parentNode)o.parentNode.removeChild(o); };
        oui.addEventListener('click',close); non.addEventListener('click',close);
        document.body.appendChild(o);
    }catch(e){} }
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
        if(String(c).toUpperCase()==='JADA'&&String(a[0]||'').toLowerCase()==='choix') ask(a.slice(1).join(' ')||'Resteras-tu avec nous ?'); };
})();
