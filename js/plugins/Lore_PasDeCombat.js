//=============================================================================
// Lore_PasDeCombat.js — v1.0 · Style de combat : le combattant fait un PAS vif
//   vers l'avant au moment d'agir (dynamisme sideview).
//=============================================================================
/*:
 * @plugindesc [Lore 49/50] Le lanceur d'une action avance d'un pas net puis revient (offset temporaire). Additif, non intrusif, compatible sideview.
 * @author JOKO
 * @help Purement visuel. N'interfere pas avec les sequences d'action YEP.
 */
(function(){ 'use strict';
    var _sa=BattleManager.startAction;
    BattleManager.startAction=function(){ _sa.call(this);
        try{ var subj=this._subject, ss=SceneManager._scene&&SceneManager._scene._spriteset; if(!subj||!ss||!ss.battlerSprites)return;
            var sprs=ss.battlerSprites(); for(var i=0;i<sprs.length;i++){ if(sprs[i]._battler===subj){ sprs[i]._loreHop=14; sprs[i]._loreHopDir=(subj.isActor&&subj.isActor())?-1:1; break; } }
        }catch(e){} };
    if(typeof Sprite_Battler!=='undefined'){ var _upd=Sprite_Battler.prototype.updatePosition||Sprite_Battler.prototype.update;
        var _u=Sprite_Battler.prototype.update;
        Sprite_Battler.prototype.update=function(){ _u.call(this);
            if(this._loreHop&&this._loreHop>0){ var t=this._loreHop; var off=Math.sin((14-t)/14*Math.PI)*18*(this._loreHopDir||-1); this.x+=Math.round(off); this._loreHop--; } };
    }
})();
