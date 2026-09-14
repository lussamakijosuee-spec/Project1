//=============================================================================
// Lore_Artefacts.js — v1.0 · La Clé (sortie) & le Masque (code source / Mana
//   Pur). Possession + effets. Commande : ARTEFACT cle|masque on|off
//=============================================================================
/*:
 * @plugindesc [Lore 37/50] Gere la possession de la Cle et du Masque. Le Masque renforce le Mana Pur/Semi-parfait (+25% degats). Scripts : Artefacts.aCle(), Artefacts.aMasque().
 * @author JOKO
 * @help ARTEFACT cle on · ARTEFACT masque on · ARTEFACT etat
 */
(function(){ 'use strict';
    window.Artefacts={ aCle:function(){ return !!$gameSystem._loreCle; }, aMasque:function(){ return !!$gameSystem._loreMasque; } };
    var _mdv=Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue=function(t,c){ var v=_mdv.call(this,t,c);
        var u=this.subject(), it=this.item();
        if(u&&u.isActor&&u.isActor()&&$gameSystem._loreMasque&&it&&it.damage&&[7,16].indexOf(it.damage.elementId)>=0) v=Math.round(v*1.25);
        return v; };
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
        if(String(c).toUpperCase()!=='ARTEFACT')return; var w=String(a[0]||'').toLowerCase(), on=String(a[1]||'on').toLowerCase()!=='off';
        if(w==='cle'){ $gameSystem._loreCle=on; $gameMessage.add(on?'\\C[6]🗝️ Vous détenez la Clé d’administrateur.\\C[0]':'La Clé vous échappe.'); }
        else if(w==='masque'){ $gameSystem._loreMasque=on; $gameMessage.add(on?'\\C[6]🎭 Vous portez le Masque : le code source frémit.\\C[0]':'Le Masque tombe.'); }
        else if(w==='etat'){ $gameMessage.add('Clé : '+($gameSystem._loreCle?'oui':'non')+' · Masque : '+($gameSystem._loreMasque?'oui':'non')); } };
})();
