//=============================================================================
// Lore_FactionCouleur.js — v1.0 · Les ennemis affichent la couleur de leur
//   faction. Notetag ennemi : <Faction: vultric|culte|etoiles|prisme>
//=============================================================================
/*:
 * @plugindesc [Lore 35/50] Ennemi <Faction: x> : teinte legere + libelle de faction dans le journal au debut du combat. Lisibilite/lore.
 * @author JOKO
 * @help Factions : vultric(sombre), culte(spirituel), etoiles(negatif), prisme(pur).
 */
(function(){ 'use strict';
    var DATA={vultric:{n:'Empire Vultric',c:[40,-20,60,20]},culte:{n:'Culte des Âmes',c:[60,-10,10,10]},etoiles:{n:'Royaume des Étoiles',c:[10,-20,60,20]},prisme:{n:'Ordre du Prisme',c:[50,20,60,0]}};
    function facOf(e){ try{ var m=/<Faction:\s*([a-z]+)>/i.exec(e.enemy().note||''); return m?m[1].toLowerCase():null; }catch(e){return null;} }
    var _start=BattleManager.startBattle;
    BattleManager.startBattle=function(){ _start.call(this);
        try{ var seen={}; $gameTroop.members().forEach(function(e){ var f=facOf(e); if(f&&DATA[f]&&!seen[f]){ seen[f]=1;
            if(this._logWindow)this._logWindow.push('addText','\\C[8]⚑ Ennemis affiliés : '+DATA[f].n+'\\C[0]'); } },this);
        }catch(e){} };
    if(typeof Sprite_Enemy!=='undefined'){ var _upd=Sprite_Enemy.prototype.update;
        Sprite_Enemy.prototype.update=function(){ _upd.call(this);
            try{ if(this._enemy&&this._loreFac===undefined)this._loreFac=facOf(this._enemy)||null;
                if(this._loreFac&&DATA[this._loreFac]){ var b=this.getBlendColor?this.getBlendColor():null; this.setBlendColor(DATA[this._loreFac].c); }
            }catch(e){} }; }
})();
