//=============================================================================
// Lore_CorruptionReecriture.js — v1.0 · La corruption n'est pas une mort : c'est
//   une RÉÉCRITURE. Seuils d'alerte + désaturation du monde.
//=============================================================================
/*:
 * @plugindesc [Lore 22/50] Si la corruption d'un heros depasse un seuil : avertissement + le monde se desature (aperçu de la reecriture). Lecture window.Corruption.
 * @author JOKO
 * @param Seuil @type number @default 6
 * @help Une ame corrompue ne revient jamais vraiment identique.
 */
(function(){ 'use strict';
    var SEUIL=Number(PluginManager.parameters('Lore_CorruptionReecriture')['Seuil']||6);
    function worst(){ if(!window.Corruption||!$gameParty)return 0; var m=0; $gameParty.members().forEach(function(a){ m=Math.max(m,window.Corruption.niveau(a.actorId())); }); return m; }
    var _upd=Scene_Map.prototype.update;
    Scene_Map.prototype.update=function(){ _upd.call(this);
        try{ var w=worst(); var want=(w>=SEUIL); if(want!==this._loreCorrOn){ this._loreCorrOn=want;
            if($gameScreen) $gameScreen.startTint(want?[-40,-40,-40,80]:[0,0,0,0],60);
            if(want&&$gameMessage&&!$gameMessage.isBusy()){ /* alerte discrete via variable, pas de spam */ } }
        }catch(e){} };
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
        if(String(c).toUpperCase()==='REECRITURE'){ var w=worst();
            $gameMessage.add(w>=SEUIL?'\\C[8]L’âme se réécrit dans les codes sources… (corruption '+w+')\\C[0]':'\\C[6]L’âme tient encore. (corruption '+w+')\\C[0]'); } };
})();
