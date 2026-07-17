//=============================================================================
// Lore_SANReposMarche.js — v1.0 · Le calme restaure l'esprit : marcher dans une
//   zone sûre (<SafeZone>) régénère lentement la Santé Mentale.
//=============================================================================
/*:
 * @plugindesc [Lore 29/50] Sur une carte notee <SafeZone>, chaque N pas restaure +1 SAN a tout le groupe. Le repos guerit l'esprit.
 * @author JOKO
 * @param Pas @type number @default 20
 * @help Ajoute <SafeZone> dans la Note de la carte (camps, refuges...).
 */
(function(){ 'use strict';
    var STEP=Number(PluginManager.parameters('Lore_SANReposMarche')['Pas']||20);
    function safe(){ try{ return $dataMap&&$dataMap.note&&/<SafeZone>/i.test($dataMap.note); }catch(e){return false;} }
    var _inc=Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps=function(){ _inc.call(this);
        if(safe()&&typeof window.Ame!=='undefined'){ this._loreSafe=(this._loreSafe||0)+1;
            if(this._loreSafe>=STEP){ this._loreSafe=0; this.members().forEach(function(a){ window.Ame.bon(a.actorId(),1); }); } } };
})();
