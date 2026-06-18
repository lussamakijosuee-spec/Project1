//=============================================================================
// SoulMessages.js — v1.0  ·  Messages d'Âmes (notes au sol façon Souls + méta)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ En explorant, tu découvres des messages laissés par d'autres
 * joueurs piégés : conseils, mensonges, appels à l'aide glaçants. (Souls + méta)
 * @author JOKO
 *
 * @param everyMin
 * @text Pas minimum entre 2 messages
 * @type number
 * @default 28
 *
 * @param everyMax
 * @text Pas maximum entre 2 messages
 * @type number
 * @default 60
 *
 * @help
 *  Aucune configuration. Un message flottant apparaît de temps en temps là où tu
 *  marches, comme une note gravée. Édite la table MESSAGES pour les tiens.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('SoulMessages');
    var MIN = parseInt(P['everyMin'] || 28), MAX = parseInt(P['everyMax'] || 60);

    var MESSAGES = [
        // utiles
        'Piège, droit devant…', 'Sombre faible, ici.', 'Essaie de parer.',
        'Trésor, plus loin.', 'Repos tout proche.', 'Vise sa garde.',
        // trompeurs
        'Aucun danger. Promis.', 'Ennemi inoffensif devant.', 'Saute, ici. Confiance.',
        // cryptiques / lore
        'Les âmes pèsent lourd, ici.', 'J\'ai vu son visage dans l\'eau.',
        'Ne crois pas la mage de la cour.', 'Le sourire ment.',
        // méta-horreur : joueurs piégés
        'Au secours. Coincé depuis 4 ans.', 'Si tu lis ça, tu es déjà à elle.',
        'Ne finis pas le jeu. Ne LA laisse pas sortir.', 'Déconnecte-toi. MAINTENANT.',
        'Elle t\'écrit aussi, n\'est-ce pas ?', 'On ne ressort jamais.',
        'J\'étais comme toi. Souriant. Curieux.'
    ];

    function pick() { return MESSAGES[Math.floor(Math.random() * MESSAGES.length)]; }
    function reroll() { $gameSystem._soulMsgNext = MIN + Math.floor(Math.random() * (MAX - MIN + 1)); $gameSystem._soulMsgCnt = 0; }

    var _steps = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function () {
        _steps.call(this);
        if (!$gameSystem) return;
        if ($gameSystem._soulMsgNext == null) reroll();
        $gameSystem._soulMsgCnt = ($gameSystem._soulMsgCnt || 0) + 1;
        if ($gameSystem._soulMsgCnt >= $gameSystem._soulMsgNext) {
            $gameTemp._soulMsgPending = pick();
            reroll();
        }
    };

    //--- Sprite flottant ---
    function Sprite_SoulMsg() { this.initialize.apply(this, arguments); }
    Sprite_SoulMsg.prototype = Object.create(Sprite.prototype);
    Sprite_SoulMsg.prototype.constructor = Sprite_SoulMsg;
    Sprite_SoulMsg.prototype.initialize = function (text) {
        Sprite.prototype.initialize.call(this);
        this.anchor.x = 0.5; this.anchor.y = 1; this._life = 160; this._rise = 0; this.opacity = 0; this.z = 8;
        this._px = $gamePlayer.screenX(); this._py = $gamePlayer.screenY() - 28;
        var b = new Bitmap(360, 36);
        b.fontSize = 19; b.fontItalic = true; b.outlineWidth = 5; b.outlineColor = 'rgba(0,0,0,0.9)'; b.textColor = '#cfe6d8';
        b.drawText(text, 0, 0, 360, 36, 'center');
        this.bitmap = b; this.x = this._px; this.y = this._py;
    };
    Sprite_SoulMsg.prototype.update = function () {
        Sprite.prototype.update.call(this);
        this._life--; this._rise += 0.18;
        if (this._life > 142) this.opacity += 16;
        else if (this._life < 34) this.opacity -= 8;
        else this.opacity = 230;
        this.x = this._px; this.y = this._py - Math.floor(this._rise);
        return this._life > 0;
    };

    var _ssUpd = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _ssUpd.call(this);
        this._soulMsgs = this._soulMsgs || [];
        for (var i = this._soulMsgs.length - 1; i >= 0; i--) {
            if (!this._soulMsgs[i].update()) { this.removeChild(this._soulMsgs[i]); this._soulMsgs.splice(i, 1); }
        }
        if ($gameTemp && $gameTemp._soulMsgPending && !$gameMessage.isBusy() && (SceneManager._scene instanceof Scene_Map)) {
            var s = new Sprite_SoulMsg($gameTemp._soulMsgPending);
            this.addChild(s); this._soulMsgs.push(s);
            $gameTemp._soulMsgPending = null;
        }
    };
})();
