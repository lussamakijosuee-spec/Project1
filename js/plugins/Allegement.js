//=============================================================================
// Allegement.js — v1.0  ·  Ce qu'on ne voit pas ne coûte rien
// RPG Maker MV   ·   pour JOKO
//   À charger EN DERNIER (après les MOG et les YEP qui touchent aux sprites).
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les événements loin de l'écran ne sont plus recalculés
 * ni dessinés à chaque image (eux, leur ombre, leur poussière).
 * @author JOKO
 *
 * @param marge
 * @text Marge autour de l'écran (pixels)
 * @type number
 * @min 48
 * @default 144
 * @desc Un événement plus loin que ça hors de l'écran est mis en veille.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  CE QU'ON NE VOIT PAS NE COÛTE RIEN
 * ═══════════════════════════════════════════════════════════════════════════
 *  JOKO : « corrige les lag ». Mesuré (bancs/navigateur/ca_rame_en_ville.js) :
 *  le coût d'une image grandit avec le NOMBRE d'événements, parce que chaque
 *  sprite d'événement — et son ombre (MOG_CharacterShadow), sa poussière
 *  (MOG_CharDustTrail), son mouvement (MOG_CharacterMotion) — est recalculé
 *  et redessiné à chaque image, même quand il est à l'autre bout de la carte.
 *
 *  Ce plugin met en veille le SPRITE (l'image affichée) d'un événement qui est
 *  loin de l'écran. L'événement lui-même continue de vivre : il marche, ses
 *  processus parallèles tournent, ses pages changent, VieDuVillage et
 *  Habitants le pilotent. Dès qu'il revient près de l'écran, son sprite se
 *  réveille. Un événement qui joue une animation ou une bulle n'est jamais
 *  mis en veille.
 *
 *  SCRIPT :  Allegement.enVeille()   → combien de sprites dorment, là
 */
var Allegement = window.Allegement || {};
window.Allegement = Allegement;
(function () {
    'use strict';
    var P = PluginManager.parameters('Allegement');
    var MARGE = Math.max(48, Number(P.marge || 144));

    function horsEcran(sprite) {
        var c = sprite._character;
        if (!c || !(c instanceof Game_Event)) return false;
        if (c.isAnimationPlaying() || c.isBalloonPlaying()) return false;
        if ((sprite._animationSprites && sprite._animationSprites.length) || sprite._balloonSprite) return false;
        var m = MARGE + (sprite.width || 0), x = c.screenX(), y = c.screenY();
        return x < -m || x > Graphics.width + m || y < -m || y > Graphics.height + m + (sprite.height || 0);
    }

    var _maj = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function () {
        if (horsEcran(this)) {
            this._enVeille = true;
            this.visible = false;
            return;
        }
        this._enVeille = false;
        _maj.call(this);
    };

    // l'ombre et la poussière suivent leur personnage
    function suivre(Classe) {
        if (typeof Classe === 'undefined') return;
        var _u = Classe.prototype.update;
        Classe.prototype.update = function () {
            if (this._spriteCharacter && this._spriteCharacter._enVeille) { this.visible = false; return; }
            _u.call(this);
        };
    }
    if (typeof CharShadowSprite !== 'undefined') suivre(CharShadowSprite);
    if (typeof CharDustTrailSprites !== 'undefined') suivre(CharDustTrailSprites);

    Allegement.enVeille = function () {
        var s = SceneManager._scene && SceneManager._scene._spriteset;
        if (!s || !s._characterSprites) return 0;
        return s._characterSprites.filter(function (x) { return x._enVeille; }).length;
    };
})();
