//=============================================================================
// Lore_DilatationTemps.js — v1.0 · Dilatation temporelle : 1 min réelle ≈ 1000
//   ans dans l'Envers. Commande : TEMPS afficher
//=============================================================================
/*:
 * @plugindesc [Lore 43/50] Commande TEMPS afficher : montre les « annees » ecoulees dans l'Envers selon le temps de jeu (1 min = 1000 ans). Le temps de l'Envers ne passe pas comme le nôtre.
 * @author JOKO
 * @help TEMPS afficher · TEMPS var <id> (stocke les annees).
 */
(function(){ 'use strict';
    function years(){ var sec=($gameSystem&&$gameSystem.playtime)?$gameSystem.playtime():0; return Math.floor(sec/60*1000); }
    function fmt(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); }
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
        if(String(c).toUpperCase()!=='TEMPS')return; var sub=String(a[0]||'afficher').toLowerCase();
        if(sub==='var'&&a[1]){ $gameVariables.setValue(Number(a[1]),years()); }
        else { $gameMessage.add('\\C[6]⏳ Dans l\'Envers, '+fmt(years())+' ans se sont écoulés…\\C[0]'); $gameMessage.add('Assez pour qu\'une âme y oublie son nom.'); } };
})();
