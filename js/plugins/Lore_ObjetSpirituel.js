//=============================================================================
// Lore_ObjetSpirituel.js — v1.0 · L'Objet Spirituel évolue en 4 paliers avec le
//   niveau : Éclat(1) · Forme(15) · Résonance(35) · Vérité(60).
//=============================================================================
/*:
 * @plugindesc [Lore 19/50] 4 paliers de l'Objet Spirituel selon le niveau. Annonce l'evolution + aura. API : window.ObjetSpirituel.palier(actor).
 * @author JOKO
 * @help Manifestation physique de l'ame en surface. Aucune config.
 */
(function(){ 'use strict';
    var PAL=[{n:'Éclat',lv:1,c:'#bdbdbd'},{n:'Forme',lv:15,c:'#7be0c0'},{n:'Résonance',lv:35,c:'#b07cff'},{n:'Vérité',lv:60,c:'#ffe14a'}];
    function palierIndex(lv){ var i=0; for(var k=0;k<PAL.length;k++){ if(lv>=PAL[k].lv)i=k; } return i; }
    window.ObjetSpirituel={ palier:function(a){ return PAL[palierIndex(a?a.level:1)]; }, PAL:PAL };
    var _lvlUp=Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp=function(){ var before=palierIndex(this.level); _lvlUp.call(this); var after=palierIndex(this.level);
        if(after>before){ var p=PAL[after]; this._loreOSAnnounce=p;
            $gameMessage&&$gameMessage.add?null:null; } };
    var _dispLvl=Game_Actor.prototype.displayLevelUp;
    Game_Actor.prototype.displayLevelUp=function(newSkills){ _dispLvl.call(this,newSkills);
        if(this._loreOSAnnounce){ var p=this._loreOSAnnounce; this._loreOSAnnounce=null;
            $gameMessage.add('\\C[6]◈ L’Objet Spirituel de '+this.name()+' atteint le palier « '+p.n+' ».\\C[0]'); } };
})();
