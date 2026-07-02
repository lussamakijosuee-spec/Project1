//=============================================================================
// Lore_AuraSource.js — v1.0 · Chaque héros dégage l'aura de sa source d'âme
//   (Corps/Âme/Esprit) au combat. Lecture <Mana:>.
//=============================================================================
/*:
 * @plugindesc [Lore 50/50] Aura douce sous chaque acteur, couleur = sa source (Corps=violet, Ame=cramoisi, Esprit=cyan, Pur=blanc). Sprite dedie (zero conflit de blend).
 * @author JOKO
 * @help Lecture du notetag <Mana:>. Purement visuel et permanent en combat.
 */
(function(){ 'use strict';
    function col(a){ try{ var n=a.actor().note||''; var m=/<Mana:\s*([a-zA-Zàé]+)>/i.exec(n); if(!m)return null; var s=m[1].toLowerCase();
        if(s.indexOf('neg')>=0||s.indexOf('somb')>=0)return[176,97,224]; if(s.indexOf('spir')>=0||s.indexOf('ame')>=0)return[220,60,80]; if(s.indexOf('pos')>=0)return[90,200,230]; if(s.indexOf('pur')>=0)return[240,240,255]; return null; }catch(e){return null;} }
    if(typeof Sprite_Actor==='undefined')return;
    var _setB=Sprite_Actor.prototype.setBattler;
    Sprite_Actor.prototype.setBattler=function(battler){ _setB.call(this,battler);
        if(battler&&this._loreAuraActor!==battler){ this._loreAuraActor=battler; this._loreAuraCol=col(battler); if(!this._loreAura){ this._loreAura=new Sprite(); this._loreAura.anchor.x=0.5; this._loreAura.anchor.y=0.5; this.addChildAt(this._loreAura,0); } this._loreAuraReady=false; } };
    var _upd=Sprite_Actor.prototype.update;
    Sprite_Actor.prototype.update=function(){ _upd.call(this);
        try{ if(!this._loreAura||!this._loreAuraCol)return;
            if(!this._loreAuraReady){ var c=this._loreAuraCol, b=new Bitmap(120,50); var g=b._context.createRadialGradient(60,25,4,60,25,58);
                g.addColorStop(0,'rgba('+c[0]+','+c[1]+','+c[2]+',0.55)'); g.addColorStop(1,'rgba('+c[0]+','+c[1]+','+c[2]+',0)'); b._context.fillStyle=g; b._context.fillRect(0,0,120,50); b._setDirty&&b._setDirty();
                this._loreAura.bitmap=b; this._loreAuraReady=true; }
            this._loreAT=(this._loreAT||0)+0.06; this._loreAura.y=8; this._loreAura.opacity=140+Math.sin(this._loreAT)*50; this._loreAura.scale.x=this._loreAura.scale.y=1+Math.sin(this._loreAT)*0.06;
        }catch(e){} };
})();
