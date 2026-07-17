//=============================================================================
// Lore_SANPanique.js — v1.0 · Un héros à l'esprit effondré (phase 1) voit sa
//   fenêtre de commandes TREMBLER — la panique le gagne.
//=============================================================================
/*:
 * @plugindesc [Lore 26/50] En combat, si l'acteur actif a une SAN phase 1, sa fenetre de commandes tremble et un murmure s'affiche. Non punitif, atmospherique.
 * @author JOKO
 * @help Lecture window.Ame.
 */
(function(){ 'use strict';
    if(typeof Window_ActorCommand==='undefined')return;
    var _setup=Window_ActorCommand.prototype.setup;
    Window_ActorCommand.prototype.setup=function(actor){ _setup.call(this,actor);
        this._lorePanic=(actor&&typeof window.Ame!=='undefined'&&window.Ame.phase(actor.actorId())===1);
        if(this._lorePanic){ var w=BattleManager._logWindow; if(w)w.push('addText','\\C[8]'+actor.name()+' tremble… l’esprit au bord de la rupture.\\C[0]'); } };
    var _upd=Window_ActorCommand.prototype.update;
    Window_ActorCommand.prototype.update=function(){ _upd.call(this);
        if(this._lorePanic&&this.active){ this._loreJ=(this._loreJ||0)+1; this.x+=Math.round(Math.sin(this._loreJ*0.6)*2); } };
})();
