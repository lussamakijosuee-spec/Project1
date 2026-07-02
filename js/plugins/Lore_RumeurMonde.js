//=============================================================================
// Lore_RumeurMonde.js — v1.0 · Un monde vraiment vivant : des rumeurs de lore
//   traversent parfois l'esprit du joueur sur la carte.
//=============================================================================
/*:
 * @plugindesc [Lore 45/50] Rumeurs de lore affichees discretement en bas d'ecran de temps en temps sur la carte (worldbuilding). Desactivable via switch.
 * @author JOKO
 * @param SwitchOff @type switch @default 0
 * @help Enrichit l'immersion sans PNJ. Textes tires du lore.
 */
(function(){ 'use strict';
    var OFF=Number(PluginManager.parameters('Lore_RumeurMonde')['SwitchOff']||0);
    var R=['On dit que le Créateur a caché la Clé par amour du groupe.','Une âme n’est jamais détruite : elle retourne dans les codes sources.',
        'L’Empire Vultric enseigne : « La force se paie avec sa propre chair. »','Le Mana Positif faiblit quand l’esprit se brise.',
        'Un Élu du Prisme déforme la réalité rien qu’en existant.','Jada envoie des messages au monde réel pour attirer des joueurs.',
        'Le Culte des Sorcières des Étoiles a rendu la magie enseignable.','1 minute dehors, mille ans ici. Assez pour perdre la raison.'];
    function show(txt){ try{ var d=document.createElement('div');
        d.style.cssText='position:fixed;left:50%;bottom:6%;transform:translateX(-50%);color:rgba(220,220,240,0);font:italic 18px Georgia,serif;text-shadow:0 0 6px #000;pointer-events:none;z-index:44;transition:opacity 1s,color 1s;max-width:80%;text-align:center;';
        d.textContent='« '+txt+' »'; document.body.appendChild(d); requestAnimationFrame(function(){d.style.color='rgba(220,220,240,.9)';});
        setTimeout(function(){d.style.color='rgba(220,220,240,0)';},4000); setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d);},5200);
    }catch(e){} }
    var _upd=Scene_Map.prototype.update;
    Scene_Map.prototype.update=function(){ _upd.call(this);
        if(OFF&&$gameSwitches.value(OFF))return; this._loreRT=(this._loreRT||0)+1;
        if(this._loreRT>=1800){ this._loreRT=0; if(Math.random()<0.5)show(R[Math.randomInt(R.length)]); } };
})();
