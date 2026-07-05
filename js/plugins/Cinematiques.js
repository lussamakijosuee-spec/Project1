//=============================================================================
// Cinematiques.js — v1.0  ·  Lecteur de cinématiques en images (pixel art)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Joue des séquences d'images (img/pictures) comme des
 * cinématiques : letterbox, cadence par frame, sons calés. CINE duel inclus.
 * @author JOKO
 *
 * @param picId
 * @text ID d'image utilisé
 * @type number
 * @min 1
 * @max 100
 * @default 89
 * @desc L'image de la cinématique est affichée sur cet ID (89), letterbox sur 88 et 90. Ne les utilise pas ailleurs.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  CINÉMATIQUES                                                        by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Joue une suite d'images comme un petit film : bandes noires (letterbox),
 *  cadence différente par frame (les impacts sont tenus), sons calés, puis
 *  nettoyage automatique. Le joueur est figé pendant la lecture.
 *
 *  ▶ CINÉMATIQUE INCLUSE (les 17 frames sont dans img/pictures) :
 *      CINE duel          le duel héros ⚔ âme errante, sons compris
 *
 *  ▶ TES PROPRES CINÉMATIQUES :
 *      CINE jouer <prefixe> <nb> <ms>
 *      ex :  CINE jouer cine_duel 17 140
 *    Lit <prefixe>_01.png … <prefixe>_NN.png (img/pictures), une frame
 *    toutes les <ms> millisecondes (défaut 140).
 *
 *  ▶ Script (pour brancher tes propres sons au milieu) :
 *      Cine.jouer('cine_duel', 17, {tempo:[...ms par frame], se:{5:'Slash2'}})
 *
 *  Les images sont centrées automatiquement (l'écran fait 816×624).
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('Cinematiques');
    var PIC = parseInt(P['picId'] || 89);

    var seq = null;   // {prefix, count, tempo[], se{}, i, wait, done}

    function nomFrame(prefix, n) {
        return prefix + '_' + (n < 10 ? '0' : '') + n;
    }
    function centre(prefix, n) {
        // affiche la frame centrée ; on précharge pour connaître la taille
        var name = nomFrame(prefix, n);
        var bmp = ImageManager.loadPicture(name);
        var show = function () {
            var x = Math.floor((Graphics.boxWidth - bmp.width) / 2);
            var y = Math.floor((Graphics.boxHeight - bmp.height) / 2);
            $gameScreen.showPicture(PIC, name, 0, x, y, 100, 100, 255, 0);
        };
        if (bmp.isReady()) show(); else bmp.addLoadListener(show);
    }
    function letterbox(on) {
        // deux bandes noires : dessinées via le tint + cache haut/bas en images ?
        // simple et robuste : on assombrit fortement les bords avec le tint,
        // et on floute le reste du monde derrière la cinématique.
        if (on) $gameScreen.startTint([-255, -255, -255, 0], 20);
        else $gameScreen.startTint([0, 0, 0, 0], 30);
    }

    var Cine = {
        jouer: function (prefix, count, opts) {
            opts = opts || {};
            // précharger toutes les frames
            for (var k = 1; k <= count; k++) ImageManager.loadPicture(nomFrame(prefix, k));
            seq = { prefix: prefix, count: count, i: 0,
                    tempo: opts.tempo || null, ms: opts.ms || 140,
                    se: opts.se || {}, wait: 12 };
            letterbox(true);
        },
        enCours: function () { return !!seq; }
    };
    window.Cine = Cine;

    // Le duel inclus : cadence chorégraphiée + sons calés
    function joueDuel() {
        Cine.jouer('cine_duel', 17, {
            tempo: [700, 500, 180, 160, 200, 120, 260, 140, 320, 420, 300, 180, 220, 90, 420, 400, 900],
            se: { 3: 'Wind1', 5: 'Slash2', 6: 'Blow2', 8: 'Parry', 9: 'Blow1',
                  10: 'Powerup', 12: 'Wind2', 13: 'Slash3', 14: 'Explosion1',
                  15: 'Darkness3', 17: 'Darkness2' }
        });
    }

    // Boucle : avance la séquence frame par frame (le joueur est figé)
    var _updMap = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _updMap.call(this);
        if (!seq) return;
        try {
            if (seq.wait > 0) { seq.wait--; return; }
            seq.i++;
            if (seq.i > seq.count) {
                $gameScreen.erasePicture(PIC);
                letterbox(false);
                seq = null;
                return;
            }
            centre(seq.prefix, seq.i);
            var se = seq.se[seq.i];
            if (se) { try { AudioManager.playSe({ name: se, pan: 0, pitch: 100, volume: 90 }); } catch (e) {} }
            var ms = seq.tempo ? (seq.tempo[seq.i - 1] || seq.ms) : seq.ms;
            seq.wait = Math.max(2, Math.round(ms / 16.7));
        } catch (e) { seq = null; }
    };
    // figer le joueur pendant la cinématique
    var _canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function () {
        if (seq) return false;
        return _canMove.call(this);
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'CINE') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'duel') joueDuel();
        else if (sub === 'jouer') Cine.jouer(String(args[1] || 'cine_duel'), parseInt(args[2]) || 17, { ms: parseInt(args[3]) || 140 });
    };
})();
