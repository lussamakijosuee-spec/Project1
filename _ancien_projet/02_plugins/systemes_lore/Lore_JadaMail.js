//=============================================================================
// Lore_JadaMail.js — v1.0 · L'Invocation : Jada envoie un « e-mail » du monde
//   réel. Commande : JADA mail
//=============================================================================
/*:
 * @plugindesc [Lore 30/50] Commande JADA mail : affiche une fausse fenetre d'e-mail (invitation a entrer dans Battle World). Meta-horreur, 4e mur.
 * @author JOKO
 * @help Overlay DOM style boite mail. Se ferme au clic.
 */
(function(){ 'use strict';
    function showMail(){ try{ var o=document.createElement('div');
        o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:80;display:flex;align-items:center;justify-content:center;font-family:Segoe UI,Arial,sans-serif;';
        var card=document.createElement('div');
        card.style.cssText='width:min(560px,86%);background:#f4f4f6;color:#111;border-radius:10px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.6);animation:loreMailIn .3s ease;';
        card.innerHTML='<div style="background:#c0392b;color:#fff;padding:12px 16px;font-weight:700;">✉ Nouveau message — Expéditeur : <i>jada@battle.world</i></div>'+
            '<div style="padding:18px 20px;line-height:1.5;">Bonjour,<br><br>Tu as été <b>sélectionné(e)</b> pour rejoindre un monde où tout est possible.<br>Une seule partie. Juste une.<br><br><b>Battle World</b> t’attend. Clique, et viens jouer avec nous.<br><br><span style="color:#888">— On ne revient pas toujours. Mais on s’amuse tellement.</span><br><br><button id="loreMailBtn" style="background:#c0392b;color:#fff;border:0;padding:10px 22px;border-radius:6px;font-size:16px;cursor:pointer;">Entrer</button></div>';
        o.appendChild(card); document.body.appendChild(o);
        if(!document.getElementById('loreMailKF')){ var s=document.createElement('style'); s.id='loreMailKF'; s.textContent='@keyframes loreMailIn{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}'; document.head.appendChild(s); }
        var close=function(){ if(o.parentNode)o.parentNode.removeChild(o); };
        o.addEventListener('click',close); document.getElementById('loreMailBtn').addEventListener('click',close);
    }catch(e){} }
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
        if(String(c).toUpperCase()==='JADA'&&String(a[0]||'').toLowerCase()==='mail') showMail(); };
})();
