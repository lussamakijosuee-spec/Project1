//=============================================================================
// Lore_SANEcran.js — v1.0 · Écran de Santé Mentale : commande SAN afficher →
//   liste chaque héros avec sa phase et une jauge colorée.
//=============================================================================
/*:
 * @plugindesc [Lore 28/50] Commande SAN afficher : petite scene listant la Sante Mentale (phase 1-5) de chaque heros avec jauge coloree. Self-contained.
 * @author JOKO
 * @help Lecture window.Ame.
 */
(function(){ 'use strict';
    var COL=['#7a1a1a','#b0562a','#c7a24a','#5fa8d6','#5fd6c0'];
    var NAM=['Effondrement','Instable','Tension','Stable','Maîtrise'];
    function W(){ this.initialize.apply(this,arguments); }
    W.prototype=Object.create(Window_Base.prototype); W.prototype.constructor=W;
    W.prototype.initialize=function(){ Window_Base.prototype.initialize.call(this,0,0,Graphics.boxWidth,Graphics.boxHeight); this.refresh(); };
    W.prototype.refresh=function(){ this.contents.clear(); this.changeTextColor(this.textColor(6));
        this.drawText('❖ SANTÉ MENTALE DE L’ÂME',0,0,this.contentsWidth(),'center'); this.resetTextColor();
        var y=this.lineHeight()*2, m=$gameParty?$gameParty.members():[];
        for(var i=0;i<m.length;i++){ var a=m[i]; var ph=(typeof window.Ame!=='undefined')?window.Ame.phase(a.actorId()):3; if(!ph)ph=3;
            var mi=window.LoreCanon?LoreCanon.mental(ph):{nom:NAM[ph-1],couleur:COL[ph-1]};
            this.drawText(a.name(),40,y,180); var bx=240,bw=Graphics.boxWidth-320;
            if(window.LoreCanon){ LoreCanon.bar(this.contents,bx,y+8,bw,20,ph/5,mi.couleur); }
            else { this.contents.fillRect(bx,y+8,bw,20,'rgba(0,0,0,.5)'); this.contents.fillRect(bx,y+8,Math.floor(bw*ph/5),20,COL[ph-1]); }
            this.changeTextColor(mi.couleur); this.drawText(mi.nom,bx+bw+12,y,200); this.resetTextColor(); y+=this.lineHeight()*1.6; } };
    function S(){ this.initialize.apply(this,arguments); }
    S.prototype=Object.create(Scene_MenuBase.prototype); S.prototype.constructor=S;
    S.prototype.create=function(){ Scene_MenuBase.prototype.create.call(this); this._w=new W(); this.addWindow(this._w); };
    S.prototype.update=function(){ Scene_MenuBase.prototype.update.call(this); if(Input.isTriggered('cancel')||Input.isTriggered('ok')||TouchInput.isCancelled())this.popScene(); };
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
        if(String(c).toUpperCase()==='SAN'&&String(a[0]||'').toLowerCase()==='afficher') SceneManager.push(S); };
    window.Scene_LoreSAN=S;
})();
