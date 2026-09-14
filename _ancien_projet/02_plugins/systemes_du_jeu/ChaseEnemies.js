//=============================================================================
// ChaseEnemies.js — v1.0  ·  Ennemis autonomes sur la carte (vue + poursuite)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Mobs visibles sur la carte : ils errent, te repèrent à vue,
 * te poursuivent, et déclenchent le combat au contact. (vibe Sekiro/Souls)
 * @author JOKO
 *
 * @param vision
 * @text Portée de vue (cases)
 * @type number
 * @default 6
 *
 * @param giveUp
 * @text Abandon après (cases hors de vue)
 * @type number
 * @default 9
 *
 * @help
 * ──────────────────────────────────────────────────────────────────────────
 *  Sur un événement de carte, ajoute un COMMENTAIRE :  <Chase: 3>
 *  (3 = ID de la Troupe à combattre au contact.)
 *  • Image = un sprite de monstre ; déclencheur « Touche action » ou « Sans »,
 *    priorité « Comme les personnages », mouvement « Fixe » (le plugin gère).
 *  • Comportement : erre → te voit (≤ portée) → fonce sur toi (« ! ») →
 *    contact = COMBAT. Si tu lui échappes, il abandonne et reprend sa ronde.
 *  L'événement disparaît après le combat (mob vaincu/dépassé).
 * ──────────────────────────────────────────────────────────────────────────
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('ChaseEnemies');
    var VISION = parseInt(P['vision'] || 6);
    var GIVEUP = parseInt(P['giveUp'] || 9);
    var TICK = 8;

    Game_Event.prototype.chaseTroop = function () {
        if (this._chasePage === this._pageIndex) return this._chaseTroopId || 0;
        this._chasePage = this._pageIndex; this._chaseTroopId = 0;
        var page = this.page();
        if (page) page.list.forEach(function (c) {
            if (c.code === 108 || c.code === 408) {
                var m = /<Chase:\s*(\d+)>/i.exec(c.parameters[0]);
                if (m) this._chaseTroopId = parseInt(m[1]);
            }
        }, this);
        return this._chaseTroopId;
    };

    function dist(e) { return Math.abs(e.x - $gamePlayer.x) + Math.abs(e.y - $gamePlayer.y); }

    function startMobBattle(e, troopId) {
        if (SceneManager.isSceneChanging() || $gameMessage.isBusy() || !$gamePlayer.canMove()) return false;
        if ($gameParty.members().length === 0) return false;
        var preemptive = false, surprise = (e.direction() === $gamePlayer.direction()); // le mob t'a pris de dos
        BattleManager.setup(troopId, true, false);
        BattleManager._preemptive = preemptive;
        BattleManager._surprise = surprise && Math.randomInt(100) < 50;
        $gamePlayer.makeEncounterCount();
        $gameMap.eraseEvent(e.eventId());
        SceneManager.push(Scene_Battle);
        return true;
    }

    var _upd = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _upd.call(this);
        if (!$gameMap || !$gamePlayer) return;
        this._chaseT = (this._chaseT || 0) + 1;
        if (this._chaseT < TICK) return;
        this._chaseT = 0;
        if ($gameMessage.isBusy() || !$gamePlayer.canMove() || SceneManager.isSceneChanging()) return;

        $gameMap.events().forEach(function (e) {
            var troop = e.chaseTroop ? e.chaseTroop() : 0;
            if (!troop || e._erased) return;
            var d = dist(e);
            if (d <= 1) { startMobBattle(e, troop); return; }
            if (d <= VISION) {                                  // REPÉRÉ → poursuite
                if (!e._chaseActive) { e._chaseActive = true; $gameTemp.requestBalloon(e, 1); }
                e._moveType = 0;
                if (!e.isMoving()) { e.setMoveSpeed(4); e.moveTowardCharacter($gamePlayer); }
            } else if (e._chaseActive && d > GIVEUP) {          // PERDU DE VUE → abandon
                e._chaseActive = false; $gameTemp.requestBalloon(e, 6); // goutte/soupir
                e._moveType = 1; e.setMoveSpeed(3); e.setMoveFrequency(3);
            } else if (!e._chaseActive) {                       // RONDE
                if (e._moveType !== 1) { e._moveType = 1; e.setMoveSpeed(3); e.setMoveFrequency(3); }
            }
        });
    };
})();
