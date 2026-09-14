//=============================================================================
// Lore_ScoreFin.js — v1.0 · Moteur de Score de Fin : agrège âmes, SAN moyenne,
//   corruption, liens, faction et artefacts en un score + fin probable.
//=============================================================================
/*:
 * @plugindesc [Lore 36/50] Commande FINSCORE [varId] : calcule un score de fin (ames+SAN-corruption+liens+artefacts) et l'affiche. Stocke dans varId si fourni.
 * @author JOKO
 * @param SoulVar @type variable @default 15
 * @help Aide a piloter le systeme de fins multiples.
 */
(function(){ 'use strict';
    var SV=Number(PluginManager.parameters('Lore_ScoreFin')['SoulVar']||15);
    function avgSAN(){ if(typeof window.Ame==='undefined'||!$gameParty)return 3; var s=0,n=0; $gameParty.members().forEach(function(a){ var p=window.Ame.phase(a.actorId()); if(p){s+=p;n++;} }); return n?s/n:3; }
    function worstCorr(){ if(!window.Corruption||!$gameParty)return 0; var m=0; $gameParty.members().forEach(function(a){ m=Math.max(m,window.Corruption.niveau(a.actorId())); }); return m; }
    function compute(){ var souls=SV>0?$gameVariables.value(SV):0; var san=avgSAN(); var corr=worstCorr();
        var cle=$gameSystem._loreCle?1:0, masque=$gameSystem._loreMasque?1:0;
        var score=Math.round(souls*2 + san*10 - corr*8 + cle*25 + masque*15);
        var fin='🕊️ Paradis-Prison';
        if(cle&&san>=4&&corr<=2)fin='🗝️ La Clé (épargner Josu)';
        else if(corr>=8)fin='🩸 Corruption Totale';
        else if(san>=4.5&&corr===0&&cle&&masque)fin='🌟 Cycle Brisé (secrète)';
        return {score:score,fin:fin,souls:souls,san:san.toFixed(1),corr:corr,cle:cle,masque:masque}; }
    window.ScoreFin=compute;
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
        if(String(c).toUpperCase()==='FINSCORE'){ var r=compute(); if(a[0])$gameVariables.setValue(Number(a[0]),r.score);
            $gameMessage.add('\\C[6]❖ Score de fin : '+r.score+'\\C[0]');
            $gameMessage.add('Âmes '+r.souls+' · SAN '+r.san+' · Corruption '+r.corr+(r.cle?' · Clé':'')+(r.masque?' · Masque':''));
            $gameMessage.add('Fin probable : '+r.fin); } };
})();
