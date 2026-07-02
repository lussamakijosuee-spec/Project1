//=============================================================================
// Lore_CodexAuto.js — v1.0 · Codex du Mana automatique : découvre les sources
//   rencontrées en combat. Commande : CODEXMANA
//=============================================================================
/*:
 * @plugindesc [Lore 47/50] Enregistre automatiquement les sources de Mana (Corps/Ame/Esprit/Pur) rencontrees au combat. CODEXMANA affiche les decouvertes.
 * @author JOKO
 * @help Se remplit tout seul quand une attaque d'une source touche le combat.
 */
(function(){ 'use strict';
    var SRC={corps:{els:[4,5,8,11,15],n:'CORPS — Mana Sombre/Négatif',c:2,d:'La puissance brute, au prix du corps.'},
        ame:{els:[2,14],n:'ÂME — Mana Spirituelle',c:21,d:'L’essence immortelle qui parle aux morts.'},
        esprit:{els:[3,6,9,10,12,13],n:'ESPRIT — Mana Originel/Positif',c:23,d:'L’intelligence qui prend forme.'},
        pur:{els:[7,16],n:'MANA PUR — transcende tout',c:18,d:'1/1000. Il défie la réalité.'}};
    function store(){ if(!$gameSystem._loreCodex)$gameSystem._loreCodex={}; return $gameSystem._loreCodex; }
    function srcOf(el){ for(var k in SRC){ if(SRC[k].els.indexOf(el)>=0)return k; } return null; }
    var _sa=BattleManager.startAction;
    BattleManager.startAction=function(){ try{ var s=this._subject,act=s&&s.currentAction&&s.currentAction();
        if(act&&act.item&&act.item()&&act.item().damage){ var k=srcOf(act.item().damage.elementId); if(k)store()[k]=true; } }catch(e){} _sa.call(this); };
    function Wn(){ this.initialize.apply(this,arguments); } Wn.prototype=Object.create(Window_Base.prototype); Wn.prototype.constructor=Wn;
    Wn.prototype.initialize=function(){ Window_Base.prototype.initialize.call(this,0,0,Graphics.boxWidth,Graphics.boxHeight); this.refresh(); };
    Wn.prototype.refresh=function(){ this.contents.clear(); this.changeTextColor(this.textColor(6)); this.drawText('❖ CODEX DU MANA',0,0,this.contentsWidth(),'center'); this.resetTextColor();
        var y=this.lineHeight()*2, s=store(); Object.keys(SRC).forEach(function(k){ var d=SRC[k], found=!!s[k];
            this.changeTextColor(this.textColor(found?d.c:7)); this.drawText(found?d.n:'??? (non découvert)',40,y,this.contentsWidth()-80);
            if(found){ this.contents.fontSize=18; this.changeTextColor(this.textColor(0)); this.drawText(d.d,60,y+this.lineHeight()*0.8,this.contentsWidth()-100); this.contents.fontSize=28; }
            this.resetTextColor(); y+=this.lineHeight()*2; },this); };
    function Sc(){ this.initialize.apply(this,arguments); } Sc.prototype=Object.create(Scene_MenuBase.prototype); Sc.prototype.constructor=Sc;
    Sc.prototype.create=function(){ Scene_MenuBase.prototype.create.call(this); this.addWindow(new Wn()); };
    Sc.prototype.update=function(){ Scene_MenuBase.prototype.update.call(this); if(Input.isTriggered('cancel')||Input.isTriggered('ok')||TouchInput.isCancelled())this.popScene(); };
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a); if(String(c).toUpperCase()==='CODEXMANA')SceneManager.push(Sc); };
})();
