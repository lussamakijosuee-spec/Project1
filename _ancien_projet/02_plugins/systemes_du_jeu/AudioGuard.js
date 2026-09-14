//=============================================================================
// AudioGuard.js — v1.0  ·  Ignore les sons au nom vide (anti "Failed to load")
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Empêche l'erreur « Failed to load: audio/se/.ogg » : un
 * son (SE/ME) sans fichier sélectionné est simplement ignoré au lieu de planter.
 * @author JOKO
 *
 * @help
 *  Si un événement « Jouer SE/ME » est laissé sans fichier (nom vide), RPG Maker
 *  tente de charger « audio/se/.ogg » et affiche une erreur de chargement.
 *  Ce plugin rend ces appels inoffensifs (ils ne jouent rien). Aucun réglage.
 *  À charger en DERNIER pour bien intercepter.
 */
(function () {
    'use strict';
    function hasName(o) { return o && o.name && String(o.name).length > 0; }

    var _playSe = AudioManager.playSe;
    AudioManager.playSe = function (se) { if (hasName(se)) _playSe.call(this, se); };

    var _playMe = AudioManager.playMe;
    AudioManager.playMe = function (me) { if (hasName(me)) _playMe.call(this, me); };

    var _playStaticSe = AudioManager.playStaticSe;
    if (_playStaticSe) {
        AudioManager.playStaticSe = function (se) { if (hasName(se)) _playStaticSe.call(this, se); };
    }
})();
