//=============================================================================
// JadeRegard.js — v1.0  ·  « Le Regard de Jade » (Sanity Exploitation méta)
// RPG Maker MV   ·   by JOKO   (additif — ne modifie aucun autre plugin)
//=============================================================================
/*:
 * @target MV
 * @plugindesc v1.0 ■ Quand l'esprit d'un heros s'effondre, Jade exploite la faille
 * et TRAFIQUE le jeu (faux PV, glitch, fausse erreur, chuchotements). Faux & reversible.
 * @author JOKO
 *
 * @param GaugeVars
 * @text Variables des jauges mentales
 * @type string
 * @desc IDs des jauges de Maitrise (1..10), separes par des virgules.
 * @default 11,12,13,14
 *
 * @param DisableSwitchId
 * @text Switch de desactivation
 * @type switch
 * @desc Si ce switch est ON, plus aucun effet (zone de repit / cinematiques).
 * @default 0
 *
 * @param MasterChance
 * @text Intensite globale (%)
 * @type number
 * @min 0
 * @max 100
 * @desc Probabilite de base qu'un effet se declenche quand l'occasion se presente.
 * @default 100
 *
 * @param WhisperSe
 * @text SE des chuchotements
 * @type string
 * @default Darkness2
 *
 * @help
 * ============================================================================
 *  LE REGARD DE JADE — l'interface devient son terrain de jeu        by JOKO
 * ============================================================================
 *  Relie ta JAUGE MENTALE (Maitrise, plugin JadeEntitePlunging) à la peur du
 *  JOUEUR. Plus un héros sombre, plus Jade « passe par la faille » et trafique
 *  ce que tu vois — JAMAIS le combat lui-même. Tout est FAUX et se répare seul :
 *  aucun PV réel perdu, aucune sauvegarde touchée, aucun fichier écrit.
 *
 *  PALIERS (sur la PIRE jauge du groupe) :
 *    Phase >= 4 (Stable/Maîtrise) ... rien, le groupe tient.
 *    Phase 3 (Tension) ............... léger : chuchotements, grésillement.
 *    Phase 2 (Instable) .............. moyen : glitch RGB, secousse, faux PV.
 *    Phase 1 (Effondrement) .......... intense : fausse ERREUR FATALE,
 *                                      glitch du titre de la fenêtre.
 *
 *  Se déclenche tout seul sur la carte (avec un long délai aléatoire) et en
 *  combat (fin de tour). Coupe-le avec le « Switch de désactivation ».
 *
 *  SCRIPT / COMMANDES (pour scénariser un effet précis) :
 *    JadeRegard.whisper("texte")   chuchotement à l'écran
 *    JadeRegard.glitch()           grésillement RGB
 *    JadeRegard.fakeHp()           le HUD ment sur les PV (combat)
 *    JadeRegard.fakeError()        fausse erreur fatale (se répare)
 *    JadeRegard.titleGlitch()      glitch du titre de la fenêtre (NW.js)
 *  Plugin Command :  REGARD whisper <texte> | REGARD glitch | REGARD error
 * ============================================================================
 */
var JadeRegard = JadeRegard || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('JadeRegard');
    var GAUGE_VARS = String(P['GaugeVars'] || '11,12,13,14').split(',')
                        .map(function (s) { return parseInt(s, 10); })
                        .filter(function (n) { return !isNaN(n) && n > 0; });
    var OFF_SWITCH = parseInt(P['DisableSwitchId'] || 0, 10);
    var MASTER     = parseInt(P['MasterChance'] || 100, 10) / 100;
    var SE_WHISPER = String(P['WhisperSe'] || 'Darkness2');

    //========================================================================
    // ÉTAT MENTAL : phase 1..5 de la PIRE jauge du groupe
    //========================================================================
    function phaseFromValue(v) {
        if (v <= 1) return 1;
        if (v <= 3) return 2;
        if (v <= 5) return 3;
        if (v <= 8) return 4;
        return 5;
    }
    function worstPhase() {
        if (typeof $gameVariables === 'undefined' || !$gameVariables) return 5;
        var worst = 5;
        GAUGE_VARS.forEach(function (id) {
            var v = $gameVariables.value(id);
            if (v > 0) worst = Math.min(worst, phaseFromValue(v)); // 0 = non initialisée → ignorée
        });
        return worst;
    }
    function enabled() {
        if (OFF_SWITCH > 0 && $gameSwitches && $gameSwitches.value(OFF_SWITCH)) return false;
        return true;
    }

    //========================================================================
    // FX DOM — overlays fluides, asset-free, auto-réparés
    //========================================================================
    JadeRegard._styleDone = false;
    JadeRegard._ensureStyle = function () {
        if (JadeRegard._styleDone || typeof document === 'undefined') return;
        JadeRegard._styleDone = true;
        var st = document.createElement('style');
        st.id = 'jade-regard-style';
        st.textContent =
            // Chuchotement
            '.jr-whisper{position:fixed;left:0;width:100%;text-align:center;z-index:99980;' +
            'pointer-events:none;color:#e8d8ff;font-family:Georgia,serif;font-style:italic;' +
            'text-shadow:0 0 10px #b07cff,0 0 3px #000;font-size:4.4vw;opacity:0;' +
            'animation:jrWhisper 2600ms ease-in-out forwards;}' +
            '@keyframes jrWhisper{0%{opacity:0;letter-spacing:.6em;filter:blur(6px);}' +
            '18%{opacity:.9;letter-spacing:.12em;filter:blur(0);}' +
            '78%{opacity:.9;}100%{opacity:0;letter-spacing:.5em;filter:blur(5px);}}' +
            // Grésillement RGB / scanlines
            '.jr-glitch{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99981;' +
            'pointer-events:none;mix-blend-mode:screen;opacity:0;' +
            'background:repeating-linear-gradient(0deg,rgba(255,0,90,.10) 0 2px,' +
            'rgba(0,255,180,.10) 2px 4px,rgba(60,90,255,.10) 4px 6px);' +
            'animation:jrGlitch 520ms steps(4,end) forwards;}' +
            '@keyframes jrGlitch{0%{opacity:0;transform:translate(0,0);}' +
            '25%{opacity:1;transform:translate(-9px,2px) skewX(7deg);}' +
            '55%{opacity:1;transform:translate(8px,-3px) skewX(-8deg);}' +
            '80%{opacity:.8;transform:translate(-3px,3px);}100%{opacity:0;}}' +
            // Fausse erreur fatale
            '.jr-error{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99990;' +
            'pointer-events:none;background:#000;color:#bfff00;opacity:0;' +
            'font-family:Consolas,"Courier New",monospace;font-size:15px;line-height:1.5;' +
            'padding:6vh 6vw;box-sizing:border-box;white-space:pre-wrap;' +
            'animation:jrError 1700ms ease-in forwards;}' +
            '@keyframes jrError{0%{opacity:0;}6%{opacity:1;}88%{opacity:1;}100%{opacity:0;}}';
        document.head.appendChild(st);
    };
    JadeRegard._spawn = function (cls, life, build) {
        if (typeof document === 'undefined' || !document.body) return;
        JadeRegard._ensureStyle();
        var el = document.createElement('div');
        el.className = cls;
        if (typeof build === 'function') build(el);
        document.body.appendChild(el);
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, life);
    };

    var WHISPERS = [
        'aime-moi.', 'je te vois.', 'reste encore.', 'ne pars pas.',
        'ce n\'est pas un jeu.', 'tu m\'entends ?', 'derrière toi.', 'encore une partie…'
    ];
    JadeRegard.whisper = function (text) {
        JadeRegard._spawn('jr-whisper', 2700, function (el) {
            el.textContent = text || WHISPERS[Math.floor(Math.random() * WHISPERS.length)];
            el.style.top = (15 + Math.floor(Math.random() * 60)) + '%';
        });
        if (SE_WHISPER) AudioManager.playSe({ name: SE_WHISPER, volume: 70, pitch: 60 + Math.floor(Math.random() * 20), pan: 0 });
    };
    JadeRegard.glitch = function () {
        JadeRegard._spawn('jr-glitch', 560);
        if ($gameScreen) { $gameScreen.startShake(4, 6, 14); }
    };
    JadeRegard.fakeError = function () {
        var name = 'utilisateur';
        try { if (Utils.isNwjs()) name = require('os').userInfo().username || name; } catch (e) {}
        var txt =
            'ERREUR FATALE — RUPTURE DE CONFINEMENT\n' +
            '  at Jade.regarder (' + name + ')\n' +
            '  at Soul.exploiter (mental_effondre)\n' +
            '  at World.reecrire (0x4A414445)\n\n' +
            '> ELLE EST SORTIE DU CODE.\n' +
            '> ELLE TE REGARDE, ' + String(name).toUpperCase() + '.\n\n' +
            'Récupération du processus…';
        JadeRegard._spawn('jr-error', 1750, function (el) { el.textContent = txt; });
        if ($gameScreen) { $gameScreen.startFlash([0, 0, 0, 255], 8); $gameScreen.startShake(5, 7, 20); }
        AudioManager.playSe({ name: 'Buzzer1', volume: 90, pitch: 40, pan: 0 });
    };
    JadeRegard.titleGlitch = function () {
        if (typeof document === 'undefined') return;
        if (!JadeRegard._origTitle) JadeRegard._origTitle = document.title;
        if (JadeRegard._titleIv) clearInterval(JadeRegard._titleIv);
        var frames = ['J A D E', 'aime-moi', '01001010', document.title], i = 0;
        JadeRegard._titleIv = setInterval(function () {
            document.title = frames[i % frames.length]; i++;
        }, 90);
        setTimeout(function () {
            clearInterval(JadeRegard._titleIv); JadeRegard._titleIv = null;
            if (JadeRegard._origTitle) document.title = JadeRegard._origTitle;
        }, 800);
    };

    // Le HUD ment : on fausse l'affichage des PV un court instant, sans toucher aux vrais PV
    JadeRegard.fakeHp = function () {
        if (!$gameParty || !$gameParty.inBattle()) return;
        if (JadeRegard._hpLie) return; // déjà en cours
        JadeRegard._hpLie = true;
        if ($gameScreen) $gameScreen.startFlash([180, 0, 0, 150], 18);
        AudioManager.playSe({ name: 'Damage3', volume: 80, pitch: 70, pan: 0 });
        setTimeout(function () { JadeRegard._hpLie = false; }, 900);
    };

    // Hook d'affichage : pendant le mensonge, le HUD montre 1 PV (puis revient seul)
    var _drawActorHp = Window_Base.prototype.drawActorHp;
    Window_Base.prototype.drawActorHp = function (actor, x, y, width) {
        if (JadeRegard._hpLie && actor && actor.isAlive()) {
            var realHp = actor._hp;
            actor._hp = 1;
            _drawActorHp.call(this, actor, x, y, width);
            actor._hp = realHp;
            return;
        }
        _drawActorHp.call(this, actor, x, y, width);
    };

    //========================================================================
    // DÉCLENCHEUR PAR PALIER
    //========================================================================
    // Pools d'effets autorisés selon la pire phase (3=léger, 2=moyen, 1=intense)
    function rollEffect(phase) {
        if (!enabled()) return;
        if (Math.random() > MASTER) return;

        var pool = [];
        if (phase <= 3) pool.push('whisper', 'glitch');
        if (phase <= 2) pool.push('glitch', 'fakeHp', 'whisper');
        if (phase <= 1) pool.push('fakeError', 'titleGlitch', 'glitch', 'whisper');
        if (!pool.length) return;

        var fx = pool[Math.floor(Math.random() * pool.length)];
        switch (fx) {
            case 'whisper':     JadeRegard.whisper(); break;
            case 'glitch':      JadeRegard.glitch(); break;
            case 'fakeHp':      JadeRegard.fakeHp(); break;
            case 'fakeError':   JadeRegard.fakeError(); break;
            case 'titleGlitch': JadeRegard.titleGlitch(); break;
        }
    }

    //========================================================================
    // SUR LA CARTE — délai aléatoire entre deux manifestations
    //========================================================================
    var FPS = 60;
    function resetMapTimer() {
        // 25 à 70 s, raccourci quand l'esprit est très bas
        JadeRegard._mapTimer = (25 + Math.floor(Math.random() * 45)) * FPS;
    }
    resetMapTimer();

    var _mapUpdate = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _mapUpdate.call(this);
        if (!enabled() || ($gameMessage && $gameMessage.isBusy())) return;
        var phase = worstPhase();
        if (phase >= 4) return; // groupe stable : pas de regard
        // l'effondrement accélère la fréquence
        var speed = (phase === 1) ? 3 : (phase === 2 ? 2 : 1);
        JadeRegard._mapTimer -= speed;
        if (JadeRegard._mapTimer <= 0) {
            rollEffect(phase);
            resetMapTimer();
        }
    };

    //========================================================================
    // EN COMBAT — chance en fin de tour
    //========================================================================
    var _turnEnd = Game_Troop.prototype.onTurnEnd;
    Game_Troop.prototype.onTurnEnd = function () {
        _turnEnd.call(this);
        if (!enabled()) return;
        var phase = worstPhase();
        if (phase >= 4) return;
        var chance = (phase === 1) ? 0.55 : (phase === 2 ? 0.35 : 0.18);
        if (Math.random() < chance) rollEffect(phase);
    };

    // Nettoyage défensif des overlays/titre en quittant un combat
    var _terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function () {
        JadeRegard._hpLie = false;
        if (typeof document !== 'undefined') {
            ['.jr-whisper', '.jr-glitch', '.jr-error'].forEach(function (sel) {
                var n = document.querySelectorAll(sel);
                for (var i = 0; i < n.length; i++) if (n[i].parentNode) n[i].parentNode.removeChild(n[i]);
            });
        }
        _terminate.call(this);
    };

    //========================================================================
    // COMMANDES DE PLUGIN
    //========================================================================
    var _pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pluginCommand.call(this, command, args);
        if (String(command).toUpperCase() !== 'REGARD') return;
        var sub = (args[0] || '').toLowerCase();
        switch (sub) {
            case 'whisper': JadeRegard.whisper(args.slice(1).join(' ')); break;
            case 'glitch':  JadeRegard.glitch(); break;
            case 'error':   JadeRegard.fakeError(); break;
            case 'title':   JadeRegard.titleGlitch(); break;
            case 'hp':      JadeRegard.fakeHp(); break;
        }
    };

})();
