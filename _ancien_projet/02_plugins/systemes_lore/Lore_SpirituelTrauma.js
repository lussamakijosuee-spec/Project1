//=============================================================================
// Lore_SpirituelTrauma.js — v1.0 · « Ne jamais écouter une âme trop longtemps » :
//   les sorts de Mana Spirituelle (2) risquent un contrecoup de Trauma.
//=============================================================================
/*:
 * @plugindesc [Lore 05/50] Skills element Mana Spirituelle(2) : risque (def 20%) d'infliger un Trauma au lanceur (state configurable) et -1 SAN.
 * @author JOKO
 * @param Chance
 * @type number @default 20
 * @param TraumaState
 * @type state @default 14
 * @help Le prix de parler aux ames. Ignore Lou si <Atone>. Utilise window.Ame.
 */
(function () {
    'use strict';
    var P=PluginManager.parameters('Lore_SpirituelTrauma');
    var CH=Number(P['Chance']||20), ST=Number(P['TraumaState']||14);
    var _apply=Game_Action.prototype.apply;
    Game_Action.prototype.apply=function(target){
        _apply.call(this,target);
        var it=this.item(); if(!it||!it.damage||it.damage.elementId!==2) return;
        var u=this.subject(); if(!u||!u.isActor||!u.isActor()) return;
        if(this._loreTraumaRolled) return; this._loreTraumaRolled=true;
        if(Math.randomInt(100)<CH){
            if(ST>0&&!u.isStateAffected(ST)) u.addState(ST);
            if(typeof window.Ame!=='undefined') window.Ame.mauvais(u.actorId(),1);
            var w=BattleManager._logWindow; if(w){ w.push('addText','\\C[8]'+u.name()+' entend les cauchemars de l’âme…\\C[0]'); }
        }
    };
})();
