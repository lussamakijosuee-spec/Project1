//=============================================================================
// Lore_JoueurPNJ.js — v1.0 · Seuls les JOUEURS peuvent absorber l'âme d'un boss.
//   Distingue joueurs et PNJ. Notetags : <Joueur> / <PNJ> ; boss : <AmeBoss>
//=============================================================================
/*:
 * @plugindesc [Lore 44/50] API joueurs/PNJ. Un boss <AmeBoss> vaincu ne libere son ame que si un <Joueur> est dans l'equipe (sinon message : un PNJ ne peut pas finir le jeu).
 * @author JOKO
 * @help Scripts : Lignage.estJoueur(actor). Par defaut, les heros sont des Joueurs.
 */
(function(){ 'use strict';
    window.Lignage={ estJoueur:function(a){ try{ var n=a.actor().note||''; if(/<PNJ>/i.test(n))return false; return true; }catch(e){return true;} } };
    var _pv=BattleManager.processVictory;
    BattleManager.processVictory=function(){
        try{ var boss=$gameTroop.deadMembers().some(function(e){ return /<AmeBoss>/i.test(e.enemy().note||''); }) || $gameTroop.members().some(function(e){ return /<AmeBoss>/i.test(e.enemy().note||''); });
            if(boss){ var hasPlayer=$gameParty.members().some(function(a){ return window.Lignage.estJoueur(a); });
                if(this._logWindow)this._logWindow.push('addText', hasPlayer?'\\C[6]◈ Une âme de boss se libère — un Joueur peut la recueillir.\\C[0]':'\\C[8]Aucun Joueur ici : l’âme retourne au code. Un PNJ ne peut pas finir le jeu.\\C[0]'); }
        }catch(e){}
        _pv.call(this); };
})();
