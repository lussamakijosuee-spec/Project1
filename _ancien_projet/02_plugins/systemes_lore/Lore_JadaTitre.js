//=============================================================================
// Lore_JadaTitre.js — v1.0 · Jada brise le 4e mur : elle glitche le TITRE de la
//   fenêtre du navigateur/jeu. Commande : JADA titre <texte>
//=============================================================================
/*:
 * @plugindesc [Lore 31/50] Commande JADA titre <texte> : remplace brievement le titre de la fenetre par un message glitche, puis le restaure.
 * @author JOKO
 * @help Ex : JADA titre je te vois
 */
(function(){ 'use strict';
    var orig=null, timer=null;
    function glitchTitle(txt){ try{ if(orig===null)orig=document.title; if(timer)clearInterval(timer);
        var frames=['j͢e̸ ͟t̷e̶ ͢v̸o͟i̷s',txt,'▓▒░ '+txt+' ░▒▓',txt+'_',''+txt], i=0;
        timer=setInterval(function(){ document.title=frames[i%frames.length]; i++; if(i>18){ clearInterval(timer); timer=null; document.title=orig; } },140);
    }catch(e){} }
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
        if(String(c).toUpperCase()==='JADA'&&String(a[0]||'').toLowerCase()==='titre'){ glitchTitle(a.slice(1).join(' ')||'je te vois'); } };
})();
