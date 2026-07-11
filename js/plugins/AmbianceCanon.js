//=============================================================================
// AmbianceCanon.js — v1.0 · Sons des jauges · musique du gouffre · le Regard
//   · l'écran-titre qui se souvient · la porte des 20 Reprises
// RPG Maker MV · by JOKO · charger vers la fin (après CanonPlus).
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Battement de cœur à Corruption 70+, musique de combat du
 * gouffre, <Regard> révèle les Traits des boss, titre corrompu, porte Reprises.
 * @author JOKO
 * @param bgmGouffre
 * @text BGM de combat au bord du gouffre (jauge >= 70)
 * @default battle-dark
 * @param switchReprises
 * @text Interrupteur ouvert à 20 Reprises
 * @type switch
 * @default 99
 * @help <Regard> sur un skill : révèle le <TraitBoss> de la cible.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('AmbianceCanon');
    var BGM = String(P['bgmGouffre'] || 'battle-dark');
    var SW = parseInt(P['switchReprises'] || 99);
    function pire(){ var m=0; $gameParty.members().forEach(function(a){ var id=a.actorId();
        try{ m=Math.max(m, Corruption.niveau(id), Errance.niveau(id)); }catch(e){} }); return m; }
    // ── battement de cœur sur la carte (jauge >= 70) ──
    var _mapUpd = Scene_Map.prototype.update, _cd = 0;
    Scene_Map.prototype.update = function(){ _mapUpd.call(this);
        if(--_cd>0) return; _cd = 360;
        try{ if(pire()>=70) AudioManager.playSe({name:'HeartBeat-long_slow',volume:70,pitch:100,pan:0}); }catch(e){}
    };
    // ── la musique du gouffre en combat ──
    var _bstart = BattleManager.playBattleBgm;
    BattleManager.playBattleBgm = function(){
        try{ if(pire()>=70){ AudioManager.playBgm({name:BGM,volume:90,pitch:100,pan:0}); return; } }catch(e){}
        _bstart.call(this);
    };
    // ── le Regard : révéler le Trait d'un boss ──
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(t){ _apply.call(this,t);
        var it=this.item();
        if(it&&it.meta&&it.meta.Regard!==undefined&&t&&t.isEnemy&&t.isEnemy()){
            var e=t.enemy(), w=BattleManager._logWindow;
            var tb=e&&e.meta&&e.meta.TraitBoss?String(e.meta.TraitBoss).split('|')[0].trim():'';
            if(w){ w.push('addText', tb?('\\C[18]REGARD — sa marque porte : '+tb+'\\C[0]'):'REGARD — une marque ordinaire.'); w.push('wait'); }
            t._tbVu = true;
        }
    };
    // ── l'écran-titre qui se souvient (une chute = titre corrompu) ──
    try {
        var _fall = null;
        var _gover = Scene_Gameover.prototype.start;
        Scene_Gameover.prototype.start = function(){ _gover.call(this); try{ localStorage.setItem('codex_chute','1'); }catch(e){} };
        var _title = Scene_Title.prototype.start;
        Scene_Title.prototype.start = function(){ _title.call(this);
            try{ if(localStorage.getItem('codex_chute')==='1'){ $gameScreen&&$gameScreen.startTint&&0; this._backSprite1&&(this._backSprite1.opacity=170); document.title='… il en manque.'; } }catch(e){}
        };
    } catch(e){}
    // ── la porte des 20 Reprises ──
    var _mstart = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function(){ _mstart.call(this);
        try{ if(($gameSystem._reprises||0)>=20 && SW>0 && !$gameSwitches.value(SW)){ $gameSwitches.setValue(SW,true);
            $gameMessage.add('\\C[18]Quelque part, une porte vient de reconnaître ton pas.\\C[0]'); } }catch(e){}
    };
})();
