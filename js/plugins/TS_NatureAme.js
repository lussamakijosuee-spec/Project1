//=============================================================================
// TS_NatureAme.js  ·  by JOKO  ·  Le Monde des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Note d'acteur <Nature: volonte|attachement|colere|foi|deuil|curiosite> : un trait passif de l'ame.
 * @author JOKO
 */
(function(){'use strict';

var N={volonte:{p:2,v:1.08,t:'Volonte — l\'arme'},attachement:{p:3,v:1.12,t:'Attachement — le gardien'},
 colere:{p:2,v:1.15,t:'Colere — l\'objet vorace'},foi:{p:5,v:1.12,t:'Foi — le sceau'},
 deuil:{p:7,v:1.15,t:'Deuil — l\'echo'},curiosite:{p:6,v:1.12,t:'Curiosite — la lentille'}};
var _pr=Game_Actor.prototype.paramRate;
Game_Actor.prototype.paramRate=function(p){ var r=_pr.call(this,p); var m=this.actor().meta;
  if(m&&m.Nature){ var n=N[String(m.Nature).toLowerCase().trim()]; if(n&&n.p===p) r*=n.v; } return r; };

})();
