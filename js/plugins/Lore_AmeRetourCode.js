//=============================================================================
// Lore_AmeRetourCode.js — v1.0 · À la mort, « l'âme se replie vers les codes
//   sources » : glitch + coût en âmes (souls-like).
//=============================================================================
/*:
 * @plugindesc [Lore 21/50] Mort d'un heros en combat : distorsion « retour au code » + perte d'ame(s) (Var 15). Souls-like.
 * @author JOKO
 * @param SoulVar @type variable @default 15
 * @param Cost @type number @default 1
 * @help L'ame n'est jamais detruite, elle retourne dans les codes sources.
 */
(function(){ 'use strict';
    var P=PluginManager.parameters('Lore_AmeRetourCode');
    var SV=Number(P['SoulVar']||15), CO=Number(P['Cost']||1);
    var _col=Game_Actor.prototype.performCollapse;
    Game_Actor.prototype.performCollapse=function(){ _col.call(this);
        try{ if(SV>0){ var v=Math.max(0,$gameVariables.value(SV)-CO); $gameVariables.setValue(SV,v); }
            if($gameScreen){ $gameScreen.startFlash([120,0,160,120],24); $gameScreen.startShake(4,4,18); }
            var w=BattleManager._logWindow; if(w)w.push('addText','\\C[10]◈ L’âme de '+this.name()+' se replie vers les codes sources…\\C[0]');
        }catch(e){} };
})();
