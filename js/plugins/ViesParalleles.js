//=============================================================================
// ViesParalleles.js — v1.0 · La mini-IA de personnalité : les absents VIVENT
// RPG Maker MV · by JOKO · charger APRÈS DestinsParalleles, CorruptionAme,
//   Errance, JadeEntitePlunging. Commande : VIES journal <id>
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Chaque héros absent agit selon SA personnalité (IA à
 * poids) : Aël se bat, Korrah s'entraîne, ludwing parie/absorbe, Vesper aide.
 * @author JOKO
 * @help Tous les 90 pas, chaque absent fait UN choix pondéré par son
 * caractère. Conséquences réelles (jauges, XP, âmes) + journal consultable :
 *   VIES journal <id>   — « qu'a-t-il fait pendant mon absence ? »
 * Recruté, son humeur du moment se lit dans son journal. (Fear & Hunger :
 * le monde n'attend pas le joueur.)
 */
(function () {
    'use strict';
    var PAS = 90;
    // L'IA : actions pondérées par personnalité. [poids, texte, effet]
    var IA = {
        1: [ [4,'a encore cherché la bagarre — et l\'a gagnée.', function(a){a.gainExp(40); try{Corruption.add(1,2);}catch(e){}}],
             [3,'s\'est fait provoquer. A tenu. De justesse.', function(a){ try{Ame.mauvais(1,1);}catch(e){} }],
             [2,'a protégé quelqu\'un sans qu\'on lui demande.', function(a){ try{Ame.bon(1,1);}catch(e){} a.gainExp(20);}],
             [1,'a EXPLOSÉ de colère. Quelque chose s\'est cassé.', function(a){ try{Corruption.add(1,6);}catch(e){} a.gainExp(60);}] ],
        2: [ [4,'s\'est entraînée à l\'aube. Comme chaque jour.', function(a){a.gainExp(35); a.addParam(3,1);}],
             [3,'a philosophé avec un inconnu. Il en est ressorti changé.', function(a){ try{Ame.bon(2,1);}catch(e){} }],
             [2,'a perdu ses affaires. Encore. (tête en l\'air…)', function(a){}],
             [1,'a gagné un bras de fer. La table n\'a pas survécu.', function(a){a.gainExp(50); a.addParam(2,1);}] ],
        3: [ [4,'a parié. A gagné, évidemment. (le plus chanceux)', function(a){$gameParty.gainGold(150); a.gainExp(25);}],
             [3,'a vanné quelqu\'un d\'important. Ça a failli mal finir.', function(a){ try{Errance.add(3,2);}catch(e){} }],
             [2,'a absorbé une âme errante. Plus fort. Plus lourd.', function(a){$gameVariables.setValue(15,$gameVariables.value(15)+1); try{Ame.mauvais(3,1);}catch(e){} a.gainExp(45);}],
             [1,'est resté calme face à une provocation. Sang-froid.', function(a){ try{Ame.bon(3,1);}catch(e){} }] ],
        4: [ [4,'a soigné des inconnus toute la journée. Pour eux.', function(a){a.gainExp(35); try{Ame.bon(4,1);}catch(e){} }],
             [3,'a voulu dire non. N\'a pas osé. (confiance…)', function(a){ try{Ame.mauvais(4,1);}catch(e){} }],
             [2,'a lancé SON ultime pour sauver un village. La meilleure.', function(a){a.gainExp(70); a.addParam(4,1);}],
             [1,'a fait quelque chose pour ELLE, pour une fois.', function(a){ try{Ame.bon(4,2);}catch(e){} }] ]
    };
    function tire(id) { var t=IA[id],s=0,i; for(i=0;i<t.length;i++)s+=t[i][0]; var r=Math.random()*s; for(i=0;i<t.length;i++){ r-=t[i][0]; if(r<=0) return t[i]; } return t[0]; }
    function absents(){ var p=$gameParty.members().map(function(m){return m.actorId();}); return [1,2,3,4].filter(function(i){ if(p.indexOf(i)>=0) return false; try{ if(window.Chutes && Chutes.perdu && Chutes.perdu(i)) return false; }catch(e){} return true; }); }
    var _steps = Party_increaseSteps();
    function Party_increaseSteps(){ return Game_Party.prototype.increaseSteps; }
    Game_Party.prototype.increaseSteps = function(){
        _steps.call(this);
        if (this.steps() % PAS !== 0) return;
        var sys=$gameSystem; if(!sys) return;
        sys._vies = sys._vies || {1:[],2:[],3:[],4:[]};
        absents().forEach(function(id){
            var a=$gameActors.actor(id); if(!a) return;
            var act=tire(id);
            try{ act[2](a); }catch(e){}
            var j=sys._vies[id]; j.push(act[1]); if(j.length>6) j.shift();
        });
    };
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(cmd,args){
        _pc.call(this,cmd,args);
        if(String(cmd).toUpperCase()!=='VIES') return;
        if((args[0]||'').toLowerCase()==='journal'){
            var id=parseInt(args[1])||1, a=$gameActors.actor(id);
            var j=($gameSystem._vies&&$gameSystem._vies[id])||[];
            $gameMessage.add('\\C[6]— La vie de '+a.name()+', pendant ton absence —\\C[0]');
            if(!j.length) $gameMessage.add('Rien de notable. Pour l\'instant.');
            j.forEach(function(l){ $gameMessage.add('· '+a.name()+' '+l); });
        }
    };
})();
