//=============================================================================
// Allegement.js — v1.1  ·  Ce qu'on ne voit pas ne coûte rien
// RPG Maker MV   ·   pour JOKO
//   À charger EN DERNIER (après les MOG et les YEP qui touchent aux sprites).
//=============================================================================
/*:
 * @plugindesc v1.1 ■ Les événements loin de l'écran ne sont plus recalculés
 * ni dessinés à chaque image ; relire des pixels ne bloque plus le jeu.
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
 *  v1.1 (2026-10-02) — « les cinémas rament » : mesuré par une sonde qui
 *  joue chaque effet dans le moteur.
 *   · La 1re animation recolorée d'un combat bloquait le jeu jusqu'à 1 s,
 *     l'ouverture d'une fenêtre de message 0,6 s : MV relit les pixels d'un
 *     canevas que le navigateur garde sur la carte graphique. Les canevas
 *     sont maintenant déclarés « relus souvent » : 6,5 s de blocage → 0,2 s
 *     sur le même parcours.
 *   · D'une carte à l'autre, MV ne photographie plus l'écran (la photo ne
 *     sert qu'au fond des menus) : un changement de carte bloque 185 ms au
 *     lieu de 318.
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

    // ── Relire des pixels sans bloquer le jeu ─────────────────────────────
    // ⚠ 2026-10-02, mesuré (cinéma.js) : la 1re animation recolorée d'un
    //   combat (Bitmap.rotateHue) bloquait le jeu jusqu'à 1 s, l'ouverture de
    //   la fenêtre de message (Bitmap.adjustTone) 0,6 s. MV y relit les pixels
    //   d'un canevas 2D (getImageData) ; le navigateur garde ces canevas sur la
    //   carte graphique, et les relire impose un aller-retour très lent. Un
    //   canevas déclaré « relu souvent » reste en mémoire : la relecture devient
    //   une simple copie, et l'envoi vers WebGL est aussi direct.
    if (typeof HTMLCanvasElement !== 'undefined') {
        var _ctx = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, opts) {
            if (type === '2d' && !opts) return _ctx.call(this, type, { willReadFrequently: true });
            return _ctx.apply(this, arguments);
        };
    }

    // ── Changer de carte sans photographier l'écran ──────────────────────
    // MV photographie l'écran (et le floute) en quittant une carte : c'est le
    // fond des menus. D'une carte à l'autre, personne ne s'en sert, et la
    // photo relit tout l'écran depuis la carte graphique (readPixels).
    var _snap = SceneManager.snapForBackground;
    SceneManager.snapForBackground = function () {
        if (this._scene instanceof Scene_Map && this.isNextScene(Scene_Map)) return;
        _snap.call(this);
    };

    // ── MOG_VisualTimer au « Test de combat » de l'éditeur ───────────────
    // Le test de combat n'a pas de carte ($dataMap reste vide). La jauge du
    // minuteur demande où est le joueur à l'écran pour s'estomper sous lui ;
    // ça lit la carte, et le test plantait avant même de s'ouvrir.
    if (typeof TimerGauge !== 'undefined' && TimerGauge.prototype.isHudVisible) {
        var _hudVisible = TimerGauge.prototype.isHudVisible;
        TimerGauge.prototype.isHudVisible = function () { return $dataMap ? _hudVisible.call(this) : true; };
    }

    // ── Irina_AntiAudioDelay : ne pas précharger un son sans nom ──────────
    // Irina précharge les sons des commandes à venir, sans regarder si la
    // commande « Jouer un son » est restée sur « (Aucun) » : elle demandait
    // alors audio/se/.ogg (trouvé en combat, troupe 24). On saute ces vides.
    if (Game_Interpreter.prototype.loadAheadAudioCommands) {
        var _avance = Game_Interpreter.prototype.loadAheadAudioCommands;
        Game_Interpreter.prototype.loadAheadAudioCommands = function () {
            var cb = AudioManager.createBuffer;
            AudioManager.createBuffer = function (dossier, nom) { return nom ? cb.apply(this, arguments) : null; };
            try { return _avance.apply(this, arguments); } finally { AudioManager.createBuffer = cb; }
        };
    }

    Allegement.enVeille = function () {
        var s = SceneManager._scene && SceneManager._scene._spriteset;
        if (!s || !s._characterSprites) return 0;
        return s._characterSprites.filter(function (x) { return x._enVeille; }).length;
    };
})();
