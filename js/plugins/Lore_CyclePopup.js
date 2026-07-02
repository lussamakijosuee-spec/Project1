//=============================================================================
// Lore_CyclePopup.js — v1.0 · Affiche « AVANTAGE ×1.5 » / « RÉSISTE ×0.5 »
//   quand le cycle Négatif▸Âme▸Positif joue (pierre-feuille-ciseaux du Mana).
//=============================================================================
/*:
 * @plugindesc [Lore 06/50] Popup flottant AVANTAGE/RESISTE selon le cycle des branches (Negatif>Spirituelle>Positif>Negatif).
 * @author JOKO
 * @help Purement visuel. Lit l'element de l'attaque et l'affinite <Mana:> de la cible.
 */
(function () {
    'use strict';
    function affOf(b){ try{ var n=b.actor?b.actor().note:(b.enemy?b.enemy().note:''); var m=/<Mana:\s*([a-zA-Zàé]+)>/i.exec(n||''); if(!m)return 0; var s=m[1].toLowerCase();
        if(s.indexOf('neg')>=0)return 4; if(s.indexOf('spir')>=0||s.indexOf('ame')>=0)return 2; if(s.indexOf('pos')>=0)return 3; return 0; }catch(e){return 0;} }
    function branchOf(it){ if(it.meta&&it.meta.Mana){ var s=String(it.meta.Mana).toLowerCase(); if(s.indexOf('neg')>=0)return 4; if(s.indexOf('spir')>=0||s.indexOf('ame')>=0)return 2; if(s.indexOf('pos')>=0)return 3; } var el=it.damage?it.damage.elementId:0; return [2,3,4].indexOf(el)>=0?el:0; }
    var BEATS={4:2,2:3,3:4};
    function tag(sp,txt,color){
        if(!sp) return; var s=new Sprite(); var b=new Bitmap(180,32); b.fontSize=22; b.textColor=color; b.outlineWidth=4;
        b.drawText(txt,0,0,180,32,'center'); s.bitmap=b; s.anchor.x=0.5; s.anchor.y=0.5; s.y=-70; s._loreTTL=48;
        sp.addChild(s); sp._loreCyc=sp._loreCyc||[]; sp._loreCyc.push(s);
    }
    var _apply=Game_Action.prototype.apply;
    Game_Action.prototype.apply=function(target){
        _apply.call(this,target); var it=this.item(); if(!it) return;
        var br=branchOf(it), af=affOf(target); if(!br||!af) return;
        var sp=null; try{ sp=target.battler?target.battler():null; if(!sp&&SceneManager._scene&&SceneManager._scene._spriteset) sp=SceneManager._scene._spriteset.findTargetSprite?SceneManager._scene._spriteset.findTargetSprite(target):null; }catch(e){}
        if(BEATS[br]===af) tag(sp,'AVANTAGE ×1.5','#ffe14a');
        else if(BEATS[af]===br) tag(sp,'RÉSISTE ×0.5','#7fb0ff');
    };
    var _upd=Sprite_Battler.prototype.update;
    Sprite_Battler.prototype.update=function(){ _upd.call(this);
        if(this._loreCyc){ for(var i=this._loreCyc.length-1;i>=0;i--){ var s=this._loreCyc[i]; s._loreTTL--; s.y-=0.6; s.opacity=Math.min(255,s._loreTTL*8);
            if(s._loreTTL<=0){ this.removeChild(s); this._loreCyc.splice(i,1); } } }
    };
})();
