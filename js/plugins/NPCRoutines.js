//=============================================================================
// NPCRoutines.js — v1.0  ·  PNJ vivants à routines (jour/nuit + fuite)
// RPG Maker MV   ·   by JOKO   ·   utilise LivingNPC (npcKey) + JourNuit (TEMPS)
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les PNJ vivent : ils vaquent le jour, se reposent la nuit,
 * et fuient un héros trop corrompu. Autonome, additif.
 * @author JOKO
 *
 * @param fleeCorruption
 * @text Seuil de corruption qui effraie
 * @type number
 * @default 70
 *
 * @help
 *  S'applique automatiquement aux événements marqués <NPC: clé> (LivingNPC),
 *  sauf les PNJ « fixes » (roi, reine, marchands, artisans). Aucun réglage.
 *  - Jour  : déambulation aléatoire (ils vaquent à leurs occupations).
 *  - Nuit  : ils s'immobilisent (ils se reposent).
 *  - Danger: si un héros dépasse le seuil de corruption et s'approche,
 *            ils s'écartent, nerveux.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('NPCRoutines');
    var FLEE = parseInt(P['fleeCorruption'] || 70);
    var CHECK = 24;
    // PNJ qui restent à leur poste (boutiques, cour, artisans)
    var STATIONARY = ['roi', 'reine', 'chambellan', 'marchand', 'muta', 'forgeron', 'guerisseur',
        'aubergiste', 'banquier', 'maitre_arme', 'selena', 'dame_elara', 'regis', 'quentin'];

    function isNight() { return ($gameSystem && $gameSystem.estNuit) ? $gameSystem.estNuit() : false; }
    function maxCorruption() {
        if (!$gameSystem || !$gameSystem._corruption || !$gameParty) return 0;
        var s = $gameSystem._corruption, m = 0;
        $gameParty.members().forEach(function (a) { var v = s[a.actorId()] || 0; if (v > m) m = v; });
        return m;
    }
    function routineKey(e) {
        if (!e.npcKey) return null;
        var k = e.npcKey();
        if (!k || STATIONARY.indexOf(k) >= 0) return null;
        return k;
    }

    var _upd = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _upd.call(this);
        if (!$gameMap || !$gamePlayer) return;
        this._rtT = (this._rtT || 0) + 1;
        if (this._rtT < CHECK) return;
        this._rtT = 0;
        if ($gameMessage.isBusy()) return;
        var night = isNight(), danger = maxCorruption() >= FLEE;
        $gameMap.events().forEach(function (e) {
            if (!routineKey(e) || e._erased) return;
            var dist = Math.abs(e.x - $gamePlayer.x) + Math.abs(e.y - $gamePlayer.y);
            if (danger && dist <= 5) {
                e._moveType = 0;
                if (!e.isMoving()) { e.setMoveSpeed(4); e.moveAwayFromCharacter($gamePlayer); }
            } else if (night) {
                e._moveType = 0;                       // repos
            } else {
                if (e._moveType !== 1) { e._moveType = 1; e.setMoveFrequency(3); e.setMoveSpeed(3); }
            }
        });
    };
})();
