//=============================================================================
// TS_Stances.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les 5 Voies de la Maitrise (Corps) : commande STANCE forge|onde|source|miroir|vide → bonus de stats.
 * @author JOKO
 */
(function(){'use strict';

var S={ forge:{atk:1.3,def:0.9,agi:1.0,t:'Forge — puissance brute'},
        onde:{atk:1.05,def:1.05,agi:1.1,t:'Onde — epouser la force'},
        source:{atk:0.85,def:1.15,agi:0.95,t:'Source — reparer les chairs'},
        miroir:{atk:0.95,def:1.3,agi:0.9,t:'Miroir — renvoyer le coup'},
        vide:{atk:1.15,def:1.0,agi:1.25,t:'Vide — l\'interne'} };
function store(){ $gameSystem._tsStance=$gameSystem._tsStance||{}; return $gameSystem._tsStance; }
window.TS=window.TS||{}; TS.stance=function(id){ return store()[id]; };
var _pr=Game_Actor.prototype.paramRate;
Game_Actor.prototype.paramRate=function(p){ var r=_pr.call(this,p); var s=S[store()[this.actorId()]];
  if(s){ if(p===2)r*=s.atk; if(p===3)r*=s.def; if(p===6)r*=s.agi; } return r; };
var _pc=Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand=function(c,a){ _pc.call(this,c,a);
  if(String(c).toUpperCase()!=='STANCE')return; var id=parseInt(a[1]||1)||1, k=(a[0]||'').toLowerCase();
  if(!k||k==='off'){ delete store()[id]; } else if(S[k]){ store()[id]=k;
    if($gameMessage) $gameMessage.add('\C[6]'+$gameActors.actor(id).name()+' adopte la Voie de la '+S[k].t+'.\C[0]'); } };

})();
