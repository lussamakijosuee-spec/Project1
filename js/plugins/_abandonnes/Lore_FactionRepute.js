//=============================================================================
// Lore_FactionRepute.js — v1.0 · Réputation auprès des 4 voies (Culte des Âmes,
//   Empire Vultric, Royaume des Étoiles/Jada, Affranchis).
//=============================================================================
/*:
 * @plugindesc [Lore 34/50] Reputation multi-factions stockee dans la sauvegarde. Commandes : REPUTE add <faction> <n> · REPUTE ecran. Scripts : Reputation.get('culte').
 * @author JOKO
 * @help Factions : culte, vultric, etoiles, affranchis.
 */
(function(){ 'use strict';
    var KEYS={culte:'Culte des Âmes',vultric:'Empire Vultric',etoiles:'Royaume des Étoiles',affranchis:'Les Affranchis'};
    var COL={culte:'#c74a7a',vultric:'#8a4ae0',etoiles:'#4a86d6',affranchis:'#6fd67b'};
    function store(){ if(!$gameSystem._loreRep)$gameSystem._loreRep={culte:0,vultric:0,etoiles:0,affranchis:0}; return $gameSystem._loreRep; }
    window.Reputation={ get:function(k){ return store()[k]||0; }, add:function(k,n){ var s=store(); if(s[k]===undefined)return; s[k]=Math.max(-20,Math.min(20,s[k]+(Number(n)||0))); }, all:function(){ return store(); } };
    function Wn(){ this.initialize.apply(this,arguments); } Wn.prototype=Object.create(Window_Base.prototype); Wn.prototype.constructor=Wn;
    Wn.prototype.initialize=function(){ Window_Base.prototype.initialize.call(this,0,0,Graphics.boxWidth,Graphics.boxHeight); this.refresh(); };
    Wn.prototype.refresh=function(){ this.contents.clear(); this.changeTextColor(this.textColor(6)); this.drawText('❖ RÉPUTATION',0,0,this.contentsWidth(),'center'); this.resetTextColor();
        var y=this.lineHeight()*2, s=store(); Object.keys(KEYS).forEach(function(k){ this.drawText(KEYS[k],40,y,240);
            var bx=300,bw=Graphics.boxWidth-420,v=s[k]||0,r=(v+20)/40; this.contents.fillRect(bx,y+10,bw,18,'rgba(0,0,0,.5)'); this.contents.fillRect(bx,y+10,Math.floor(bw*r),18,COL[k]);
            this.drawText((v>0?'+':'')+v,bx+bw+12,y,80); y+=this.lineHeight()*1.5; },this); };
    function Sc(){ this.initialize.apply(this,arguments); } Sc.prototype=Object.create(Scene_MenuBase.prototype); Sc.prototype.constructor=Sc;
    Sc.prototype.create=function(){ Scene_MenuBase.prototype.create.call(this); this.addWindow(new Wn()); };
    Sc.prototype.update=function(){ Scene_MenuBase.prototype.update.call(this); if(Input.isTriggered('cancel')||Input.isTriggered('ok')||TouchInput.isCancelled())this.popScene(); };
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
        if(String(c).toUpperCase()==='REPUTE'){ var sub=String(a[0]||'').toLowerCase();
            if(sub==='add')window.Reputation.add(String(a[1]||'').toLowerCase(),Number(a[2])||0);
            else if(sub==='ecran')SceneManager.push(Sc); } };
})();
