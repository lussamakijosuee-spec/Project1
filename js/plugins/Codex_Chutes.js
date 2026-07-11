//=============================================================================
// Codex_Chutes.js — v2.0 · LES QUATRE CHUTES UNIFIÉES (mécanique + visuel)
//  Remplace ChuteDement + ChutesBeteErrant + ChutesProfondeur (à décocher !)
// RPG Maker MV · by JOKO · charger APRÈS JadeEntitePlunging, CorruptionAme,
//  Errance, ChutesDefinitives. UN SEUL hook par méthode : zéro entrechoc.
//=============================================================================
/*:
 * @plugindesc v2.0 ■ Les 4 chutes en UN plugin : Dément (il croit rester),
 * Bête (la laisse), Errant (l effacement), Déchiré (Aël) + tout le visuel.
 * @author JOKO
 * @param switchTrahison
 * @text Interrupteur — trahison du Dément
 * @type switch
 * @default 98
 * @param switchBete
 * @text Interrupteur — la Bête lâchée
 * @type switch
 * @default 97
 * @param switchErrant
 * @text Interrupteur — l Errant effacé
 * @type switch
 * @default 96
 * @param switchDechire
 * @text Interrupteur — le Déchiré
 * @type switch
 * @default 95
 * @help Commandes : DEMENT chute/ancrage <id> · BETE chute <id> ·
 *  ERRANT chute <id> · DECHIRE chute/ancrage <id>.
 *  Notes ennemis : <DementTombe> <BeteTombee> <ErrantTombe> <DechireTombe>.
 *  Tout le détail : docs/GUIDE_DEVELOPPEUR.md (sections chutes).
 */
// ═══════════ module: ChuteDement ═══════════
(function () {
    'use strict';
    var P = PluginManager.parameters('ChuteDement');
    var SW = parseInt(P['switchTrahison'] || 98);
    function jm(id) { try { return window.Ame ? (Ame.jauge(id) || 10) : 10; } catch (e) { return 10; } }
    function spectre() { return ($gameSystem && $gameSystem._dementSpectre) || null; }

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'DEMENT') return;
        var sub = (args[0] || '').toLowerCase(), id = parseInt(args[1]) || 1;
        var a = $gameActors.actor(id);
        if (sub === 'chute' && a) {
            $gameSystem._dementSpectre = { id: id, combats: 0 };
            $gameScreen.startFlash([200, 200, 255, 200], 40);
            $gameMessage.add(a.name() + ' rit. Longtemps. Trop longtemps.');
            $gameMessage.add('\\C[8]Puis tout redevient normal. Vraiment ?\\C[0]');
        }
        if (sub === 'ancrage' && a) {
            var n = 0;
            $gameParty.members().forEach(function (m) {
                if (m.actorId() !== id && jm(m.actorId()) >= 8 && n < 3) {
                    n++; $gameMessage.add(m.name() + ' le retient. « Reste avec nous. »');
                }
            });
            if (n > 0) { try { Ame.bon(id, n); } catch (e) {} $gameMessage.add('\\C[23]Ancré. (+' + n + ' lucidité)\\C[0]'); }
            else $gameMessage.add('\\C[2]Personne n\'est assez lucide pour le retenir. Il glisse.\\C[0]');
        }
    };

    // ── le spectre frappe le vide ──
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _mdv.call(this, target, critical);
        var sp = spectre(), s = this.subject();
        if (sp && s && s.isActor && s.isActor() && s.actorId() === sp.id && v > 0) {
            var w = BattleManager._logWindow;
            if (w && Math.random() < 0.5) { w.push('addText', '\\C[8]' + s.name() + ' frappe le vide.\\C[0]'); }
            return 0;
        }
        return v;
    };
    // ── 3 combats, puis la trahison ──
    var _eb = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        _eb.call(this, result);
        var sp = spectre();
        if (sp) {
            sp.combats++;
            if (sp.combats >= 3) {
                var a = $gameActors.actor(sp.id);
                $gameSystem._dementSpectre = null;
                $gameMessage.add('\\C[18]' + a.name() + ' s\'arrête. Se tourne vers vous.\\C[0]');
                $gameMessage.add('« Depuis quand… vous me regardez comme ça ? »');
                $gameMessage.add('\\C[2]Ce que vous escortiez n\'était déjà plus votre ami.\\C[0]');
                $gameParty.removeActor(sp.id);
                if (SW > 0) $gameSwitches.setValue(SW, true);
            }
        }
    };
    // ── les sens qui mentent + le faux Game Over ──
    var _upd = Scene_Map.prototype.update, _cd = 0;
    Scene_Map.prototype.update = function () {
        _upd.call(this);
        if (--_cd > 0) return; _cd = 600;
        try {
            var l = $gameParty.leader(); if (!l) return;
            var m = jm(l.actorId());
            if (m <= 3 && Math.random() < 0.35) AudioManager.playSe({ name: 'Miss', volume: 40, pitch: 60, pan: Math.random() < 0.5 ? -70 : 70 });
            if (m <= 1 && !$gameSystem._fauxGO && !$gameMessage.isBusy()) {
                $gameSystem._fauxGO = true;
                $gameScreen.startFadeOut(30);
                $gameMessage.add('\\C[8]— FIN —\\C[0]');
                $gameMessage.add('\\C[8]. . .\\C[0]');
                $gameMessage.add('\\C[18]…tu es encore là.\\C[0]');
                $gameScreen.startFadeIn(60);
            }
        } catch (e) {}
    };
    // ── le Dément tombé : il copie les vôtres, il lit tes Reprises ──
    var _act = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function () {
        _act.call(this);
        try {
            var e = this.enemy();
            if (!e || !e.meta || e.meta.DementTombe === undefined) return;
            if (!this._ditReprises) {
                this._ditReprises = true;
                var w = BattleManager._logWindow, n = ($gameSystem._reprises || 0);
                if (w && n > 0) { w.push('addText', '\\C[8]« Il t\'a regardé remonter ' + n + ' fois. Moi aussi, maintenant. »\\C[0]'); }
            }
            if (Math.random() < 0.35 && this.numActions() > 0) {
                var pool = [];
                $gameParty.battleMembers().forEach(function (m) { m.skills().forEach(function (sk) { if (sk.stypeId > 0 && sk.mpCost < 60) pool.push(sk.id); }); });
                if (pool.length) {
                    var sid = pool[Math.floor(Math.random() * pool.length)];
                    this.action(0).setSkill(sid);
                    var w2 = BattleManager._logWindow;
                    if (w2) w2.push('addText', '\\C[2]Il connaît vos gestes. Il était des vôtres.\\C[0]');
                }
            }
        } catch (e2) {}
    };
})();
// ═══════════ module: ChutesBeteErrant ═══════════
(function () {
    'use strict';
    var P = PluginManager.parameters('ChutesBeteErrant');
    var SWB = parseInt(P['switchBete'] || 97), SWE = parseInt(P['switchErrant'] || 96);
    function jc(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function st(k) { return ($gameSystem && $gameSystem[k]) || null; }
    function wlog(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        var C = String(cmd).toUpperCase(), id = parseInt(args[1]) || 1, a = $gameActors.actor(id);
        if (C === 'BETE' && (args[0] || '') === 'chute' && a) {
            $gameSystem._beteLachee = { id: id, combats: 0 };
            $gameScreen.startFlash([255, 40, 40, 200], 40);
            $gameMessage.add(a.name() + ' tombe à genoux. Quelque chose craque — pas un os.');
            $gameMessage.add('\\C[2]La laisse.\\C[0]');
            // canon : le sang de bête prend les traits de SA bête (Ombrefauves)
            var FORMES = {
                1: 'Des écailles percent sa peau. Un DRAGON dort dans son sang.',
                2: 'Ses épaules s\'élargissent — l\'OURS. Et ses yeux… des yeux d\'AIGLE.',
                3: 'Ses crocs poussent. Le LOUP-GAROU hurle avant lui.',
                4: 'Sa forme n\'a pas encore de nom. C\'est pire.'
            };
            if (FORMES[id]) $gameMessage.add('\\C[18]' + FORMES[id] + '\\C[0]');
        }
        if (C === 'ERRANT' && (args[0] || '') === 'chute' && a) {
            $gameSystem._errantEfface = { id: id, combats: 0 };
            $gameScreen.startTint([-40, -40, -40, 40], 60);
            $gameMessage.add(a.name() + ' regarde ses mains. On voit presque au travers.');
        }
    };

    // ── la Bête : incontrôlable (avant : le bras qui part seul à Corr>=70) ──
    var _ma = Game_Actor.prototype.makeActions;
    Game_Actor.prototype.makeActions = function () {
        _ma.call(this);
        try {
            var b = st('_beteLachee');
            var lache = b && b.id === this.actorId();
            if ((lache || (jc(this.actorId()) >= 70 && Math.random() < 0.15)) && this.numActions() > 0) {
                this.action(0).setAttack();
                this.action(0).setTarget(Math.floor(Math.random() * $gameTroop.aliveMembers().length));
                this.setAutoBattle && 0;
                wlog('\\C[2]Le bras de ' + this.name() + ' part tout seul.\\C[0]');
            }
        } catch (e) {}
    };
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (t, c) {
        var v = _mdv.call(this, t, c);
        var b = st('_beteLachee'), s = this.subject();
        if (b && s && s.isActor && s.isActor() && s.actorId() === b.id) return Math.floor(v * 1.5);
        // l'Errant : les soins le traversent
        var e = st('_errantEfface');
        if (e && v < 0 && t && t.isActor && t.isActor() && t.actorId() === e.id) {
            wlog('\\C[8]Le soin traverse ' + t.name() + ' — il n\'est plus tout à fait là.\\C[0]');
            return 0;
        }
        return v;
    };
    // ── fins des 3 combats ──
    var _eb = BattleManager.endBattle;
    BattleManager.endBattle = function (r) {
        _eb.call(this, r);
        var b = st('_beteLachee');
        if (b && ++b.combats >= 3) {
            var a = $gameActors.actor(b.id);
            $gameSystem._beteLachee = null;
            $gameMessage.add('\\C[18]' + a.name() + ' hurle. Ce n\'est plus une voix humaine.\\C[0]');
            $gameParty.removeActor(b.id);
            if (SWB > 0) $gameSwitches.setValue(SWB, true);
        }
        var e = st('_errantEfface');
        if (e && ++e.combats >= 3) {
            var a2 = $gameActors.actor(e.id);
            $gameSystem._errantEfface = null;
            $gameParty.removeActor(e.id);
            if (SWE > 0) $gameSwitches.setValue(SWE, true);
            $gameMessage.add('\\C[8]…on était combien, déjà ?\\C[0]');
        }
    };
    // ── les tombés en face ──
    var _ea = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function () {
        _ea.call(this);
        try {
            var e = this.enemy();
            if (e && e.meta && e.meta.BeteTombee !== undefined && Math.random() < 0.20 && this.numActions() > 0) {
                this.clearActions();
                wlog('\\C[23]Un instant, ses yeux redeviennent les siens. Elle hésite.\\C[0]');
            }
        } catch (er) {}
    };
    var _hit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function (t) {
        if (t && t.isEnemy && t.isEnemy()) {
            var e = t.enemy();
            if (e && e.meta && e.meta.ErrantTombe !== undefined && Math.random() < 0.25) {
                var w = BattleManager._logWindow;
                if (w) w.push('addText', '\\C[8]Le coup le traverse. Il n\'est qu\'à moitié là.\\C[0]');
                return 0;
            }
        }
        return _hit.call(this, t);
    };
})();
// ═══════════ module: ChutesProfondeur ═══════════
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
        var id=a.actorId(), c=jc(id), S=$gameSystem||{};
        // LE VISUEL DES CHUTES EN COURS (prioritaire sur les formes partielles)
        if(S._beteLachee&&S._beteLachee.id===id)   return [200,20,20,120];   // la laisse cassée : rouge sang
        if(S._dementSpectre&&S._dementSpectre.id===id) return [180,200,255,90]; // le spectre : bleu pâle
        if(S._errantEfface&&S._errantEfface.id===id)   return [40,40,60,60];    // l'effacement : gris d'ombre
        if(S._dechire&&S._dechire.id===id){
            var ph=Math.floor(Date.now()/700)%3;   // le Déchiré : les 3 teintes qui clignotent
            return [[200,20,20,110],[180,200,255,110],[110,60,130,110]][ph];
        }
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
            var ef=$gameSystem&&$gameSystem._errantEfface;
            this.opacity=(ef&&ef.id===a.actorId())?150:255;
            if(b){this._fpT=(this._fpT||0)+0.05;var pl=Math.sin(this._fpT)*0.3+0.7;
                this.setBlendColor([b[0],b[1],b[2],Math.floor(b[3]*pl)]);}
            else if(this._fpT){this.setBlendColor([0,0,0,0]);this._fpT=0;}
        }catch(e){}};
})();
