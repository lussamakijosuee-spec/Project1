//=============================================================================
// TS_ParolePower.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La Parole (Esprit) : les sorts a PM frappent plus fort quand la lucidite est haute, plus faible si brisee.
 * @author JOKO
 */
(function(){'use strict';

var _mdv=Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue=function(t,c){ var v=_mdv.call(this,t,c); var it=this.item&&this.item(), s=this.subject();
  if(v>0&&it&&(it.mpCost||0)>0&&s&&s.isActor&&s.isActor()&&window.TS){ var lu=TS.lucidite(s);
    if(lu>=85) v=Math.round(v*1.15); else if(lu<=30) v=Math.round(v*0.85); } return v; };

})();
