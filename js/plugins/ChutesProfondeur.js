//=============================================================================
// ChutesProfondeur.js — v1.0 · Les chutes approfondies : la Bête se nourrit
//  (Bloodborne), l'Errant se creuse (Hollowing), et le Déchiré d'Aël (les 3).
// RPG Maker MV · by JOKO · charger APRÈS ChuteDement et ChutesBeteErrant.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Profondeur canon des chutes : paliers vécus AVANT, la
 * Bête qui se nourrit, l'Errant que l'XP traverse, et le Déchiré (Aël).
 * @author JOKO
 * @param switchDechire
 * @text Interrupteur — le Déchiré (ton combat, ennemi 407)
 * @type switch
 * @default 95
 * @help
 *  ▶ LA BÊTE, plus profonde (sang de bête, Bloodborne/Garou) :
 *    Corr 40+ : sur la carte, parfois « il s'arrête. Il renifle l'air. »
 *    Corr 70+ : après une victoire, « il faut le tirer en arrière du cadavre. »
 *    Laisse cassée (BETE chute) : chaque coup LE NOURRIT (+12 % en PV)
 *    et LA FUITE EST IMPOSSIBLE — la Bête ne recule pas.
 *  ▶ L'ERRANT, plus profond (le Creux) :
 *    Err 40+ : dans le combat, son nom s'écrit parfois « …… ».
 *    Err 70+ : il ne gagne plus d'XP — « l'expérience le traverse aussi. »
 *  ▶ LE DÉCHIRÉ — la chute d'Aël, l'Équilibre :  DECHIRE chute <id>
 *    3 combats d'ALTERNANCE : chaque tour il devient une chute au hasard —
 *    frappe le vide (dément) · bras seul ×1.5 (bête) · soins le traversent
 *    (errant). Puis : « Je n'arrive plus… à choisir. » → interrupteur 95.
 *    <DechireTombe> (ennemi 407) : le boss CYCLE les trois héritages par tour.
 *    DECHIRE ancrage <id> : SEULE l'équipe complète le retient — les 3 autres
 *    présents ET tenant leur source (Korrah corr<40, ludwing err<40,
 *    Vesper lucidité>=8). L'Équilibre ne tient que si tout le monde tient.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('ChutesProfondeur');
    var SWD = parseInt(P['switchDechire'] || 95);
    function jc(i){try{return Corruption.niveau(i);}catch(e){return 0;}}
    function je(i){try{return Errance.niveau(i);}catch(e){return 0;}}
    function jm(i){try{return Ame.jauge(i)||10;}catch(e){return 10;}}
    function wlog(t){var w=BattleManager._logWindow;if(w){w.push('addText',t);w.push('wait');}}

    //── la Bête : renifle (carte), le cadavre (victoire), se nourrit, ne fuit pas ──
    var _u=Scene_Map.prototype.update,_c=0;
    Scene_Map.prototype.update=function(){_u.call(this);if(--_c>0)return;_c=900;
        try{$gameParty.members().forEach(function(m){
            if(jc(m.actorId())>=40&&Math.random()<0.3&&!$gameMessage.isBusy())
                $gameMessage.add('\\C[8]'+m.name()+' s\'arrête. Renifle l\'air. Reprend sa route.\\C[0]');
        });}catch(e){}};
    var _pv=BattleManager.processVictory;
    BattleManager.processVictory=function(){
        try{$gameParty.battleMembers().forEach(function(m){
            if(jc(m.actorId())>=70&&Math.random()<0.4)
                $gameMessage.add('\\C[2]Il faut tirer '+m.name()+' en arrière du cadavre.\\C[0]');
        });}catch(e){}
        _pv.call(this);};
    var _mdv=Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue=function(t,c){
        var v=_mdv.call(this,t,c),s=this.subject(),b=$gameSystem&&$gameSystem._beteLachee;
        if(b&&s&&s.isActor&&s.isActor()&&s.actorId()===b.id&&v>0){s.gainHp(Math.floor(v*0.12));}
        // le Déchiré : l'alternance
        var d=$gameSystem&&$gameSystem._dechire;
        if(d&&s&&s.isActor&&s.isActor()&&s.actorId()===d.id){
            var r=Math.random();
            if(r<0.33&&v>0){wlog('\\C[8]'+s.name()+' frappe le vide.\\C[0]');return 0;}
            if(r<0.66&&v>0){wlog('\\C[2]Son bras ne lui répond plus.\\C[0]');return Math.floor(v*1.5);}
        }
        if(d&&v<0&&t&&t.isActor&&t.isActor()&&t.actorId()===d.id&&Math.random()<0.5){
            wlog('\\C[8]Le soin ne trouve pas Aël.\\C[0]');return 0;}
        return v;};
    var _esc=BattleManager.canEscape;
    BattleManager.canEscape=function(){
        if($gameSystem&&$gameSystem._beteLachee)return false;
        return _esc.call(this);};
    //── l'Errant : le nom qui se creuse, l'XP qui traverse ──
    var _gx=Game_Actor.prototype.gainExp;
    Game_Actor.prototype.gainExp=function(exp){
        if(je(this.actorId())>=70&&exp>0){wlog('\\C[8]L\'expérience traverse '+this.name()+' aussi.\\C[0]');return;}
        _gx.call(this,exp);};
    var _nm=Game_Actor.prototype.name;
    Game_Actor.prototype.name=function(){
        var n=_nm.call(this);
        if($gameParty.inBattle()&&je(this.actorId())>=40&&Math.random()<0.08)return '……';
        return n;};
    //── le Déchiré : chute, trahison, ancrage à quatre ──
    var _pc=Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand=function(cmd,args){_pc.call(this,cmd,args);
        if(String(cmd).toUpperCase()!=='DECHIRE')return;
        var sub=(args[0]||'').toLowerCase(),id=parseInt(args[1])||1,a=$gameActors.actor(id);
        if(sub==='chute'&&a){$gameSystem._dechire={id:id,combats:0};
            $gameScreen.startFlash([216,192,96,220],50);
            $gameMessage.add(a.name()+' vacille. Les trois gouffres tirent en même temps.');}
        if(sub==='ancrage'&&a){
            var ok=[2,3,4].every(function(i){return $gameParty.members().some(function(m){return m.actorId()===i;});})
                && jc(2)<40 && je(3)<40 && jm(4)>=8;
            if(ok){try{Corruption.purge(id,15);Errance.purge(id,15);Ame.bon(id,2);}catch(e){}
                $gameSystem._dechire=null;
                $gameMessage.add('\\C[23]Trois mains le tiennent — une par gouffre. Le centre tient.\\C[0]');}
            else $gameMessage.add('\\C[2]Il faudrait tirer dans les trois directions à la fois. Il glisse.\\C[0]');}};
    var _eb=BattleManager.endBattle;
    BattleManager.endBattle=function(r){_eb.call(this,r);
        var d=$gameSystem&&$gameSystem._dechire;
        if(d&&++d.combats>=3){var a=$gameActors.actor(d.id);
            $gameSystem._dechire=null;
            $gameMessage.add('\\C[18]'+a.name()+' : « Je n\'arrive plus… à choisir. »\\C[0]');
            $gameParty.removeActor(d.id);
            if(SWD>0)$gameSwitches.setValue(SWD,true);}};
    //── le boss Déchiré (407) : il cycle les trois héritages ──
    var _ea=Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions=function(){_ea.call(this);
        try{var e=this.enemy();
            if(!e||!e.meta||e.meta.DechireTombe===undefined)return;
            this._cycle=((this._cycle||0)%3)+1;
            if(this._cycle===1&&this.numActions()>0){
                var pool=[];$gameParty.battleMembers().forEach(function(m){m.skills().forEach(function(sk){if(sk.mpCost<60)pool.push(sk.id);});});
                if(pool.length){this.action(0).setSkill(pool[Math.floor(Math.random()*pool.length)]);
                    wlog('\\C[2]Il se souvient de vos gestes.\\C[0]');}}
            if(this._cycle===2){this.clearActions();wlog('\\C[23]Un battement — c\'est encore Aël. Il hésite.\\C[0]');}
        }catch(er){}};
    var _hit=Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit=function(t){
        if(t&&t.isEnemy&&t.isEnemy()){var e=t.enemy();
            if(e&&e.meta&&e.meta.DechireTombe!==undefined&&t._cycle===3&&Math.random()<0.4){
                wlog('\\C[8]Le coup traverse ce qui reste de lui.\\C[0]');return 0;}}
        return _hit.call(this,t);};
    //── LES FORMES PARTIELLES : la bête affleure avant de sortir ──
    var TEINTES = { 1:[40,140,60], 2:[170,130,20], 3:[130,130,150], 4:[110,60,130] };
    function teinteDe(a){
        if(!a) return null;
        var id=a.actorId(), c=jc(id);
        if(c<40) return null;
        try{ if(window.Fusion&&Fusion.actif(id)) return null; }catch(e){}
        var t=TEINTES[id]||[120,40,40], f=(c>=70)?1:0.4;
        return [Math.floor(t[0]*f),Math.floor(t[1]*f),Math.floor(t[2]*f),Math.floor((c>=70?70:28))];
    }
    if(typeof Sprite_Actor!=='undefined'){
        var _sau=Sprite_Actor.prototype.update;
        Sprite_Actor.prototype.update=function(){_sau.call(this);
            try{var b=teinteDe(this._actor);
                if(b){this._fpT=(this._fpT||0)+0.07;var pl=Math.sin(this._fpT)*0.3+0.7;
                    this.setBlendColor([b[0],b[1],b[2],Math.floor(b[3]*pl)]);}
                else if(this._fpT){this.setBlendColor([0,0,0,0]);this._fpT=0;}
            }catch(e){}};
    }
    var _scu=Sprite_Character.prototype.update;
    Sprite_Character.prototype.update=function(){_scu.call(this);
        try{var ch=this._character,a=null;
            if(ch===$gamePlayer)a=$gameParty.leader();
            else if(ch&&ch.actor&&typeof ch.actor==='function')a=ch.actor();
            if(!a)return;
            var b=teinteDe(a);
            if(b){this._fpT=(this._fpT||0)+0.05;var pl=Math.sin(this._fpT)*0.3+0.7;
                this.setBlendColor([b[0],b[1],b[2],Math.floor(b[3]*pl)]);}
            else if(this._fpT){this.setBlendColor([0,0,0,0]);this._fpT=0;}
        }catch(e){}};
})();
