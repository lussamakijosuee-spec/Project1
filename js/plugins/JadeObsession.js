/*:
 * @target MV
 * @plugindesc Boss IA ENDGAME (Niv 80) : L'Obsession de Jade avec Plunging Méta, IA Mentale et Screamers Visuels.
 * @author Partenaire de code
 *
 * @param JadeEnemyId
 * @text ID de l'Ennemi Jade
 * @type number
 * @default 1
 *
 * @param LouActorId
 * @text ID Acteur de Lou
 * @type number
 * @default 3
 *
 * @param MentalVarId
 * @text ID Variable Santé Mentale Jade
 * @type number
 * @default 16
 *
 * @param LifestealRate
 * @text Taux Vol de Vie (Phase 1)
 * @type number
 * @decimals 2
 * @default 0.15
 *
 * @param JealousySkillId
 * @text ID Compétence 'Ne regarde que moi !'
 * @type number
 * @default 82
 *
 * @param FatalSkillId
 * @text ID Attaque "Incopiable"
 * @type number
 * @default 40
 *
 * @param EmbraceSkillId
 * @text ID Attaque "Étreinte Éternelle"
 * @type number
 * @default 80
 *
 * @param WaterfowlSkillId
 * @text ID Danse des Ailes Écorchées
 * @type number
 * @default 84
 *
 * @param CriSkillId
 * @text ID Compétence Cri de Douleur
 * @type number
 * @default 75
 *
 * @param GraviteSkillId
 * @text ID Compétence Inversion Gravitationnelle
 * @type number
 * @default 77
 *
 * @param Mur404StateId
 * @text ID État Mur 404
 * @type number
 * @default 66
 *
 * @param SurchargeStateId
 * @text ID État Surcharge d'Âme MAX
 * @type number
 * @default 48
 *
 * @param LouTrollVarId
 * @text ID Var Dosage Troll (Lou)
 * @type number
 * @default 13
 *
 * @param LouMentalVarId
 * @text ID Var Santé Mentale (Lou)
 * @type number
 * @default 15
 *
 * @param BleedStateId
 * @text ID État Saignement / Pourriture
 * @type number
 * @default 17
 *
 * @param Phase2SwitchId
 * @text ID Switch Phase 2 ACTIVÉE
 * @type number
 * @default 10
 *
 * @param EndChoiceSwitchId
 * @text ID Switch Déclencheur du Choix
 * @type number
 * @default 20
 *
 * @param ForgivenSwitchId
 * @text ID Switch Lou a Pardonné
 * @type number
 * @default 21
 *
 * @param DrainAnimId
 * @text ID Anim Corruption / Transition
 * @type number
 * @default 120
 *
 * @param StateFolieTotal
 * @text ID État Folie Totale (Lou)
 * @type number
 * @default 27
 *
 * @param AnimDistorsion
 * @text ID Anim Glitch Mentale (Lou)
 * @type number
 * @default 108
 *
 * @param AnimGlitch
 * @text ID Anim Glitch Visuel (Panique/Rival)
 * @type number
 * @default 102
 *
 * @param Screamer1Name
 * @text Screamer 1 - Faux BSOD (img/pictures/)
 * @type string
 * @desc Nom du fichier image placé dans img/pictures/. Ex: jade_bsod.png
 * @default jade_bsod.png
 *
 * @param Screamer2Name
 * @text Screamer 2 - Diamants Chaos (img/pictures/)
 * @type string
 * @desc Nom du fichier image placé dans img/pictures/. Ex: jade_diamonds.png
 * @default jade_diamonds.png
 *
 * @param Screamer3Name
 * @text Screamer 3 - HELP (img/pictures/)
 * @type string
 * @desc Nom du fichier image placé dans img/pictures/. Ex: jade_help.png
 * @default jade_help.png
 *
 * @param Screamer4Name
 * @text Screamer 4 - Visage d'Horreur Pixel (img/pictures/)
 * @type string
 * @desc Nom du fichier image placé dans img/pictures/. Ex: jade_horror.png
 * @default jade_horror.png
 *
 * @help
 * ============================================================================
 * JADE OBSESSION - IA MENTALE, MÉTA-HORREUR ET SCREAMERS VISUELS (NV 80)
 * ============================================================================
 * PLACEMENT DES IMAGES SCREAMERS :
 *   Copier les 4 images dans le dossier : <projet>/img/pictures/
 *   Les nommer conformément aux paramètres Screamer1-4Name.
 *   Recommandations de nommage :
 *     jade_bsod.jpg      → le faux écran bleu Windows
 *     jade_diamonds.jpg  → le motif diamants / chaos
 *     jade_help.png      → le fond HELP HELP HELP rouge
 *     jade_horror.png    → le visage pixel art ensanglanté
 *
 * PHASE 1 (Santé Mentale Variable 16) :
 *   - Mental 7 à 10 : 1 action, dégâts normaux.
 *   - Mental 4 à 6  : 2 actions, dégâts fluctuants (80% à 120%).
 *   - Mental 1 à 3  : 3 actions, ciblage aléatoire, dégâts ultra instables
 *     (50% à 180%), animations corrompues, screamers Diamants/HELP.
 *
 * PHASE 2 : L'Enfer agressif Endgame
 *   - ATK x2.2, DEF x1.8, 3 actions fixes, Vol de vie 30%.
 *   - Transition : séquence BSOD (1.8s) → flash Visage d'Horreur (0.6s).
 *   - En cours : screamers aléatoires sur Diamants / HELP / Horreur.
 *   - Étreinte Éternelle : double flash Horreur → HELP.
 *
 * MÉTA : Manipulation de fichiers et titre en direct (NW.js requis).
 * ============================================================================
 */

(function() {
    'use strict';

    // ========================================================================
    // --- MODULE MÉTA-HORREUR : CONTRÔLE DES FICHIERS ---
    // ========================================================================
    var JadeMeta = JadeMeta || {};

    JadeMeta.getGameFolder = function() {
        if (!Utils.isNwjs()) return null;
        var path = require('path');
        return path.dirname(process.mainModule.filename);
    };

    JadeMeta.phase1_Intense = function() {
        if (!Utils.isNwjs()) return;
        var fs = require('fs');
        var path = require('path');
        var os = require('os');
        var folder = JadeMeta.getGameFolder();
        var fileLog = path.join(folder, 'JADE_TE_REGARDE.txt');
        var playerName = os.userInfo().username;
        var msg = "Je vois à travers le code source, " + playerName + ".\n\n";
        msg += "Les variables, les interrupteurs... Je sais que ce n'est qu'un jeu.\n";
        msg += "Mais ma douleur est réelle.\n\n";
        msg += "- Jade";
        try { fs.writeFileSync(fileLog, msg, 'utf8'); } catch(e) {}
    };

    JadeMeta.phase2_Apocalypse = function() {
        if (!Utils.isNwjs()) return;
        var fs = require('fs');
        var path = require('path');
        var folder = JadeMeta.getGameFolder();
        for (var i = 1; i <= 6; i++) {
            var fileName = path.join(folder, 'CODE_CORROMPU_0' + i + '.txt');
            var msg = "ERREUR 404 : RUPTURE DE CONFINEMENT\n";
            for(var j = 0; j < 40; j++) msg += "AIME MOI ";
            try { fs.writeFileSync(fileName, msg, 'utf8'); } catch(e) {}
        }
        if (!window._jadeOrigTitle) window._jadeOrigTitle = document.title;
        if (window._jadeTitleGlitch) clearInterval(window._jadeTitleGlitch);
        var glitchCount = 0;
        window._jadeTitleGlitch = setInterval(function() {
            glitchCount++;
            document.title = (glitchCount % 2 === 0) ? "S U F F E R . E X E" : "01001010 01000001 01000100 01000101";
        }, 50);
    };

    JadeMeta.nettoyer = function() {
        if (window._jadeTitleGlitch) {
            clearInterval(window._jadeTitleGlitch);
            if (window._jadeOrigTitle) document.title = window._jadeOrigTitle;
        }
    };
    // ========================================================================

    // ========================================================================
    // --- MODULE SCREAMERS VISUELS ---
    // ========================================================================
    var JadeScreamer = {};

    // Sera initialisé après lecture des params
    JadeScreamer._imageNames = [];

    JadeScreamer._overlay   = null;
    JadeScreamer._hideTimer = null;
    JadeScreamer._styleDone = false;

    // Fade-in/out (ms) — assez court pour rester un jumpscare, assez doux pour ne plus « claquer »
    JadeScreamer.FADE_IN  = 60;
    JadeScreamer.FADE_OUT = 90;

    // Injecte une seule fois le CSS qui rend les screamers fluides (fondu + glitch vivant)
    JadeScreamer._ensureStyle = function() {
        if (JadeScreamer._styleDone) return;
        JadeScreamer._styleDone = true;
        var style = document.createElement('style');
        style.id = 'jade-screamer-style';
        style.textContent =
            '.jade-screamer-overlay{position:fixed;top:0;left:0;width:100%;height:100%;' +
            'z-index:99999;pointer-events:none;image-rendering:pixelated;opacity:0;' +
            'background-size:cover;background-position:center;background-repeat:no-repeat;' +
            'will-change:transform,opacity,filter;' +
            'transition:opacity ' + JadeScreamer.FADE_IN + 'ms linear;}' +
            '.jade-screamer-overlay.jade-screamer-on{opacity:1;' +
            'animation:jadeScreamerGlitch 200ms steps(2,end) infinite;}' +
            '.jade-screamer-overlay.jade-screamer-off{opacity:0;animation:none;' +
            'transition:opacity ' + JadeScreamer.FADE_OUT + 'ms linear;}' +
            '@keyframes jadeScreamerGlitch{' +
            '0%{transform:translate(0,0) scale(1.00);filter:none;}' +
            '22%{transform:translate(-6px,3px) scale(1.05);filter:hue-rotate(18deg) contrast(1.25);}' +
            '44%{transform:translate(5px,-4px) scale(1.02);filter:invert(0.06);}' +
            '66%{transform:translate(-3px,-2px) scale(1.06);filter:hue-rotate(-24deg) saturate(1.5);}' +
            '88%{transform:translate(4px,5px) scale(1.03);filter:contrast(1.35);}' +
            '100%{transform:translate(0,0) scale(1.00);filter:none;}}';
        document.head.appendChild(style);
    };

    // Construit le chemin absolu (NW.js) ou relatif (navigateur)
    JadeScreamer._buildPath = function(imageName) {
        if (!imageName) return '';
        if (Utils.isNwjs()) {
            var nodePath = require('path');
            var folder   = nodePath.dirname(process.mainModule.filename);
            // file:/// + chemin forward-slash
            return 'file:///' + folder.replace(/\\/g, '/') + '/img/pictures/' + imageName;
        }
        return 'img/pictures/' + imageName;
    };

    // Retire instantanément TOUT overlay résiduel (remplacement propre, sans fondu)
    JadeScreamer._purge = function() {
        if (JadeScreamer._hideTimer) {
            clearTimeout(JadeScreamer._hideTimer);
            JadeScreamer._hideTimer = null;
        }
        var nodes = document.querySelectorAll('.jade-screamer-overlay');
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].parentNode) nodes[i].parentNode.removeChild(nodes[i]);
        }
        JadeScreamer._overlay = null;
    };

    // Affiche un screamer par index (0-3), pendant `duration` ms — apparition en fondu + glitch animé
    JadeScreamer.show = function(index, duration, onHidden) {
        JadeScreamer._ensureStyle();
        JadeScreamer._purge(); // nettoyer tout overlay précédent (synchrone, sans fondu)

        var name = JadeScreamer._imageNames[index];
        if (!name) { if (typeof onHidden === 'function') onHidden(); return; }

        var url = JadeScreamer._buildPath(name);

        var div = document.createElement('div');
        div.className = 'jade-screamer-overlay';
        div.style.backgroundImage = 'url("' + url + '")';

        document.body.appendChild(div);
        JadeScreamer._overlay = div;

        // Force un reflow puis bascule en « on » → le fondu d'apparition se déclenche en douceur
        void div.offsetWidth;
        div.classList.add('jade-screamer-on');

        JadeScreamer._hideTimer = setTimeout(function() {
            JadeScreamer.hide(onHidden);
        }, duration || 600);
    };

    // Retire l'overlay du DOM en fondu (puis exécute le callback)
    JadeScreamer.hide = function(callback) {
        if (JadeScreamer._hideTimer) {
            clearTimeout(JadeScreamer._hideTimer);
            JadeScreamer._hideTimer = null;
        }
        var ov = JadeScreamer._overlay;
        JadeScreamer._overlay = null; // libère la place pour un éventuel show() suivant

        if (ov) {
            ov.classList.remove('jade-screamer-on');
            ov.classList.add('jade-screamer-off');
            setTimeout(function() {
                if (ov.parentNode) ov.parentNode.removeChild(ov);
                if (typeof callback === 'function') callback();
            }, JadeScreamer.FADE_OUT);
        } else if (typeof callback === 'function') {
            callback();
        }
    };

    // ---- Déclencheurs thématiques ----

    // Visage pixel art ensanglanté — attaque dévastatrice
    JadeScreamer.flashHorreur = function() {
        var dur = 300 + Math.floor(Math.random() * 300); // 300-600 ms
        JadeScreamer.show(3, dur);
    };

    // Motif diamants / chaos mental — Phase 1 critique
    JadeScreamer.flashChaos = function() {
        var dur = 250 + Math.floor(Math.random() * 200); // 250-450 ms
        JadeScreamer.show(1, dur);
    };

    // Fond HELP HELP HELP — Phase 2 ambiance
    JadeScreamer.flashHelp = function() {
        var dur = 400 + Math.floor(Math.random() * 350); // 400-750 ms
        JadeScreamer.show(2, dur);
    };

    // Transition Phase 2 : BSOD (1.8s) → pause 300ms → Horreur (700ms)
    JadeScreamer.sequencePhase2 = function() {
        JadeScreamer.show(0, 1800, function() {
            setTimeout(function() {
                JadeScreamer.show(3, 700);
            }, 300);
        });
    };

    // Étreinte Éternelle : Horreur (600ms) → pause 200ms → HELP (800ms)
    JadeScreamer.sequenceEtreinte = function() {
        JadeScreamer.show(3, 600, function() {
            setTimeout(function() {
                JadeScreamer.show(2, 800);
            }, 200);
        });
    };

    // Screamer aléatoire pendant Phase 2 (évite le BSOD au hasard)
    JadeScreamer.random = function() {
        var pool = [1, 2, 3]; // Diamants, HELP, Horreur
        var idx  = pool[Math.floor(Math.random() * pool.length)];
        var dur  = 280 + Math.floor(Math.random() * 420); // 280-700 ms
        JadeScreamer.show(idx, dur);
    };
    // ========================================================================

    // ---- Protections Yanfly ----
    var safeWrapYanflyMethod = function(obj, methodName, fallbackValue) {
        if (obj && typeof obj[methodName] === 'function') {
            var originalMethod = obj[methodName];
            obj[methodName] = function() {
                var stringArg = arguments[0];
                if (!stringArg || typeof stringArg !== 'string' || !this._action || !this._action.item()) {
                    return fallbackValue;
                }
                try { return originalMethod.apply(this, arguments); }
                catch (error) { return fallbackValue; }
            };
        }
    };
    safeWrapYanflyMethod(BattleManager, 'makeActionTargets', []);
    safeWrapYanflyMethod(BattleManager, 'actionMpModify', false);

    if (typeof BattleManager.processActionSequence === 'function') {
        var _Safe_processActionSequence = BattleManager.processActionSequence;
        BattleManager.processActionSequence = function(actionName, actionArgs) {
            if (!this._action || !this._action.item() || !actionName || typeof actionName !== 'string') return false;
            try { return _Safe_processActionSequence.call(this, actionName, actionArgs); }
            catch (error) { return false; }
        };
    }

    // ---- Lecture des paramètres ----
    var params = PluginManager.parameters('JadeObsession');

    // Initialisation des noms d'images screamers
    JadeScreamer._imageNames = [
        params['Screamer1Name'] || 'jade_bsod.png',        // index 0 — BSOD
        params['Screamer2Name'] || 'jade_diamonds.png',    // index 1 — Diamants
        params['Screamer3Name'] || 'jade_help.png',        // index 2 — HELP
        params['Screamer4Name'] || 'jade_horror.png'       // index 3 — Horreur pixel
    ];

    var JADE_ID         = Number(params['JadeEnemyId']       || 1);
    var LOU_ID          = Number(params['LouActorId']        || 3);
    var MENTAL_VAR      = Number(params['MentalVarId']       || 16);
    var LIFESTEAL_RATE  = Number(params['LifestealRate']      || 0.15);

    var JEALOUSY_SKILL  = Number(params['JealousySkillId']    || 82);
    var EMBRACE_SKILL   = Number(params['EmbraceSkillId']     || 80);
    var FATAL_SKILL     = Number(params['FatalSkillId']       || 40);
    var WATERFOWL_SKILL = Number(params['WaterfowlSkillId']   || 84);
    var CRI_SKILL       = Number(params['CriSkillId']         || 75);
    var GRAVITE_SKILL   = Number(params['GraviteSkillId']     || 77);

    var MUR404_STATE    = Number(params['Mur404StateId']      || 66);
    var SURCHARGE_STATE = Number(params['SurchargeStateId']   || 48);
    var LOU_TROLL_VAR   = Number(params['LouTrollVarId']      || 13);
    var LOU_MENTAL_VAR  = Number(params['LouMentalVarId']     || 15);
    var BLEED_STATE     = Number(params['BleedStateId']       || 17);

    var PHASE2_SWITCH     = Number(params['Phase2SwitchId']     || 10);
    var END_CHOICE_SWITCH = Number(params['EndChoiceSwitchId']  || 20);
    var FORGIVEN_SWITCH   = Number(params['ForgivenSwitchId']   || 21);

    var DRAIN_ANIM  = Number(params['DrainAnimId']     || 120);
    var STATE_FOLIE = Number(params['StateFolieTotal'] || 27);
    var ANIM_LOU    = Number(params['AnimDistorsion']  || 108);
    var ANIM_OTHER  = Number(params['AnimGlitch']      || 102);

    var PHASE1_MESSAGES = [
        "Jade : « Pardonne-moi, mon amour... Laisse-moi t'écorcher doucement... »",
        "Le sang de Jade coule de ses yeux, mêlé à des larmes de douleur.",
        "Jade : « Restons unis dans les entrailles de ce monde... »"
    ];

    var GORE_SCREAMERS = [
        "D̶E̶S̶ ̶M̶O̶R̶C̶E̶A̶U̶X̶ ̶D̶E̶ ̶C̶H̶A̶I̶R̶ ̶P̶L̶E̶U̶V̶E̶N̶T̶ ̶S̶U̶R̶ ̶L̶E̶ ̶C̶H̶A̶M̶P̶ ̶D̶E̶ ̶B̶A̶T̶A̶I̶L̶L̶E̶ ̶!",
        "LE BRUIT DES OS QUI SE BRISENT REND FOU !",
        "JADE VOMIT UN TORRENT DE SANG NOIR !",
        "V̶O̶S̶ ̶I̶N̶T̶E̶S̶T̶I̶N̶S̶ ̶S̶E̶R̶V̶I̶R̶O̶N̶T̶ ̶D̶E̶ ̶L̶I̶E̶N̶ ̶É̶T̶E̶R̶N̶E̶L̶ ̶!"
    ];

    function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function logMessage(msg) {
        var scene = SceneManager._scene;
        if (scene && scene._logWindow) scene._logWindow.addText(msg);
    }

    function isPhase2Active() { return $gameSwitches ? $gameSwitches.value(PHASE2_SWITCH) : false; }

    function findJade() {
        if (!$gameTroop) return null;
        return $gameTroop.members().find(function(m) { return m.enemyId() === JADE_ID && m.isAlive(); });
    }

    function updateJadeStates(jade, force) {
        if (!jade || isPhase2Active()) return;
        var mental = $gameVariables.value(MENTAL_VAR);
        var targetState = 0;
        if      (mental >= 9) targetState = 55;
        else if (mental >= 7) targetState = 56;
        else if (mental >= 5) targetState = 57;
        else if (mental >= 3) targetState = 58;
        else if (mental === 2) targetState = 59;
        else if (mental === 1) targetState = 60;

        if (!force && targetState > 0 && jade.isStateAffected(targetState)) return;
        [55, 56, 57, 58, 59, 60].forEach(function(id) {
            if (id !== targetState && jade.isStateAffected(id)) jade.removeState(id);
        });
        if (targetState > 0 && !jade.isStateAffected(targetState)) jade.addState(targetState);
    }

    // ---- Animations corrompues en cas de panique ----
    var _Window_BattleLog_showAnimation = Window_BattleLog.prototype.showAnimation;
    Window_BattleLog.prototype.showAnimation = function(subject, targets, animationId) {
        if (subject && subject.isEnemy() && subject.enemyId() === JADE_ID) {
            if (!isPhase2Active() && $gameVariables.value(MENTAL_VAR) <= 3) {
                animationId = ANIM_OTHER;
            }
        }
        _Window_BattleLog_showAnimation.call(this, subject, targets, animationId);
    };

    var _Game_Enemy_param = Game_Enemy.prototype.param;
    Game_Enemy.prototype.param = function(paramId) {
        var base = _Game_Enemy_param.call(this, paramId);
        if (this.enemyId() === JADE_ID && isPhase2Active()) {
            if (paramId === 2) return Math.floor(base * 2.20);
            if (paramId === 6) return Math.floor(base * 1.80);
        }
        return base;
    };

    var _Game_Enemy_onAllActionsEnd = Game_Enemy.prototype.onAllActionsEnd;
    Game_Enemy.prototype.onAllActionsEnd = function() {
        _Game_Enemy_onAllActionsEnd.call(this);
        if (this.enemyId() === JADE_ID && (isPhase2Active() || $gameVariables.value(MENTAL_VAR) <= 4)) {
            this.clearStates();
            if (!isPhase2Active()) updateJadeStates(this, true);
        }
    };

    Game_Enemy.prototype.makeActionTimes = function() {
        if (this.enemyId() === JADE_ID) {
            if (isPhase2Active()) return 3;
            var mental = $gameVariables.value(MENTAL_VAR);
            if (mental >= 7) return 1;
            if (mental >= 4) return 2;
            return 3;
        }
        return 1;
    };

    // ---- Ciblage chaotique ----
    var _Game_Action_makeTargets = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function() {
        var subject = this.subject();
        if (subject && subject.isEnemy() && subject.enemyId() === JADE_ID) {
            if (this.isForOpponent() && this.item() && (this.item().scope === 1 || this.item().scope === 7)) {
                var aliveAllies = $gameParty.aliveMembers();
                var mental = $gameVariables.value(MENTAL_VAR);

                if (!isPhase2Active() && mental <= 3) {
                    var randomIndex = Math.floor(Math.random() * aliveAllies.length);
                    return [aliveAllies[randomIndex]];
                }

                if (isPhase2Active()) {
                    aliveAllies.sort(function(a, b) {
                        return $gameVariables.value(a.actorId() + 10) - $gameVariables.value(b.actorId() + 10);
                    });
                    return [aliveAllies[0]];
                } else {
                    var lou = aliveAllies.find(function(a) { return a.actorId() === LOU_ID; });
                    var others = aliveAllies.filter(function(a) { return a.actorId() !== LOU_ID; });
                    if (subject.hpRate() <= 0.40 && others.length > 0) {
                        others.sort(function(a, b) { return a.hp - b.hp; });
                        return [others[0]];
                    }
                    if (lou) return [lou];
                }
            }
        }
        return _Game_Action_makeTargets.call(this);
    };

    // ---- Variance des dégâts ----
    var _Game_Action_executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        var subject = this.subject();

        if (subject && subject.isEnemy() && subject.enemyId() === JADE_ID && target.isActor() && !isPhase2Active()) {
            var mental = $gameVariables.value(MENTAL_VAR);
            if (mental <= 6 && mental > 3) {
                value = Math.floor(value * (0.8 + Math.random() * 0.4));
            } else if (mental <= 3) {
                value = Math.floor(value * (0.5 + Math.random() * 1.3));
            }
        }

        if (target && target.isEnemy() && target.enemyId() === JADE_ID) {
            if (this.subject().isActor() && this.isPhysical()) {
                if (value <= 50) { value = Math.floor(this.subject().atk * 5); }
                value = Math.floor(value * 1.5);
            }
            if (!isPhase2Active()) {
                if (target.hp - value <= target.mhp * 0.55) {
                    value = target.hp - 1;
                    target._executePhase2Transformation = true;
                }
            } else if (isPhase2Active() && !$gameSwitches.value(END_CHOICE_SWITCH)) {
                if (target.hp - value <= 0) {
                    value = target.hp - 1;
                    target._triggerEndChoiceDialog = true;
                }
            }
        }
        _Game_Action_executeDamage.call(this, target, value);
    };

    // ---- Application des effets ----
    var _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.call(this, target);
        if (!this.item() || !target) return;

        var subject = this.subject();
        var skillId = this.item().id;
        var result  = target.result();

        // Vol de vie passif si Lou a pardonné
        if (subject && subject.isActor() && subject.actorId() === LOU_ID && $gameSwitches.value(FORGIVEN_SWITCH)) {
            if (result.hpDamage > 0) {
                var louHeal = Math.floor(result.hpDamage * 0.20);
                if (louHeal > 0) { subject.gainHp(louHeal); subject.startDamagePopup(); }
            }
        }

        // ---- Attaques de Jade ----
        if (subject && subject.isEnemy() && subject.enemyId() === JADE_ID && target.isActor()) {

            // ===== ÉTREINTE ÉTERNELLE : double screamer Horreur → HELP =====
            if (skillId === EMBRACE_SKILL && target.actorId() === LOU_ID) {
                result.hpDamage = 0;
                var healAmount = target.mhp - target.hp;
                target.gainHp(healAmount);
                target.startDamagePopup();
                target.addState(STATE_FOLIE);
                $gameVariables.setValue(LOU_MENTAL_VAR, 1);

                if ($gameScreen) {
                    if (typeof $gameScreen.startAdvancedShake === 'function') {
                        $gameScreen.startAdvancedShake(30, 25, 60, 'vertical');
                    } else {
                        $gameScreen.startShake(20, 15, 60);
                    }
                    $gameScreen.startFlash([200, 0, 0, 255], 40);
                }
                AudioManager.playSe({ name: 'Damage3', volume: 150, pitch: 45, pan: 0 });
                logMessage("🩸 JADE S'ENFONCE DANS LA CHAIR DE LOU POUR LE STATUER EN FOLIE TOTALE !");

                // --- SCREAMER SÉQUENCE ÉTREINTE ---
                JadeScreamer.sequenceEtreinte();

                return;
            }

            if (result.used && !result.missed && !result.evaded) {

                // Screamer Phase 2 sur hit (35% de chance)
                if (isPhase2Active() && Math.random() < 0.35) {
                    executeScreamer();
                }

                // Virus temporel
                if (isPhase2Active() && (skillId === CRI_SKILL || skillId === WATERFOWL_SKILL || Math.random() < 0.35)) {
                    inflictCyberVirusCooldown(target);
                }

                // Vol de vie
                var currentLifesteal = isPhase2Active() ? 0.30 : LIFESTEAL_RATE;
                var damageHeal = result.hpDamage > 0 ? Math.floor(result.hpDamage * currentLifesteal) : 0;
                if (damageHeal > 0) {
                    subject.gainHp(damageHeal);
                    subject.startDamagePopup();
                }

                // Dégradation mentale des alliés
                var mentalLoss = isPhase2Active() ? 2 : 1;
                var varId = target.actorId() + 10;
                if (varId >= 11 && varId <= 14) {
                    var currentMental = $gameVariables.value(varId);
                    $gameVariables.setValue(varId, Math.max(1, currentMental - mentalLoss));
                    target.startAnimation(5);
                    if (isPhase2Active()) {
                        logMessage("L'AGRESSION MUTILE LE CERVEAU DE " + target.name().toUpperCase() + " (-2 MENTAL !)");
                    } else {
                        logMessage("La détresse de Jade brise le cœur de " + target.name() + " (-1 Mental).");
                    }
                }

                if (isPhase2Active()) target.addState(BLEED_STATE);
            }
        }

        // ---- Attaques des alliés contre Jade ----
        if (target && target.isEnemy() && target.enemyId() === JADE_ID && subject.isActor()) {
            var isNeyssaPlunging = (subject.actorId() === 2) && (skillId === 13 || skillId === 72 || skillId === 73);

            if (isNeyssaPlunging && isPhase2Active() && Math.random() < 0.35) {
                result.hpDamage = 0;
                result.mpDamage = 0;
                BattleManager._jadeNightmareCounterTargetIdx = subject.index();
                if ($gameScreen) {
                    $gameScreen.startFlash([255, 0, 0, 255], 30);
                    if (typeof $gameScreen.startAdvancedShake === 'function') {
                        $gameScreen.startAdvancedShake(25, 25, 60, 'diagonal');
                    } else {
                        $gameScreen.startShake(20, 20, 60);
                    }
                }
                AudioManager.playSe({ name: 'Scream', volume: 150, pitch: 35, pan: 0 });
                logMessage("⚠️ JADE DÉCHIRE LA STASE TEMPORELLE DE NEYSSA !");

                // Flash rapide du visage d'horreur sur la contre-attaque
                JadeScreamer.flashHorreur();
            }
            else if (result.hpDamage > 0) {
                if (target.isStateAffected(MUR404_STATE)) {
                    var skillName = this.item() ? this.item().name : "";
                    if (subject.actorId() === LOU_ID || (skillName && skillName.indexOf("Lotus") !== -1)) {
                        target.removeState(MUR404_STATE);
                        target.startAnimation(52);
                        logMessage("Le code Lotus pulvérise le Mur 404 dans un craquement sinistre !");
                    }
                }

                if (this.isPhysical() && !isPhase2Active()) {
                    var mentalJade = $gameVariables.value(MENTAL_VAR);
                    var perte = (subject.actorId() === LOU_ID) ? 2 : 1;
                    var newMental = Math.max(1, mentalJade - perte);
                    $gameVariables.setValue(MENTAL_VAR, newMental);
                    updateJadeStates(target, false);

                    if (subject.actorId() === LOU_ID) {
                        logMessage("Le contact physique de Lou traumatise la chair de Jade ! (Mental -" + perte + ")");
                        target.startAnimation(ANIM_LOU);
                    } else {
                        logMessage("L'esprit de Jade se fissure sous les coups... (Mental -" + perte + ")");
                        target.startAnimation(ANIM_OTHER);
                    }

                    if (newMental <= 4 && mentalJade > 4) {
                        BattleManager._jadeWaterfowlTargetIdx = subject.index();
                        target.addBuff(6, 4);
                    } else if (newMental === 1 && mentalJade > 1) {
                        BattleManager._jadeWaterfowlTargetIdx = subject.index();
                        target.addState(STATE_FOLIE);
                        AudioManager.playSe({ name: 'Break', volume: 100, pitch: 50, pan: 0 });
                        if ($gameScreen) $gameScreen.startShake(8, 8, 60);
                    }
                }
            }
        }
    };

    // ---- Fin de tour ----
    var _Game_Troop_onTurnEnd = Game_Troop.prototype.onTurnEnd;
    Game_Troop.prototype.onTurnEnd = function() {
        _Game_Troop_onTurnEnd.call(this);
        var jade = findJade();
        if (jade && jade.isAlive()) {
            if (isPhase2Active()) {
                if ($gameScreen) {
                    if (typeof $gameScreen.startAdvancedShake === 'function') {
                        $gameScreen.startAdvancedShake(16, 16, 40, 'horizontal');
                    } else {
                        $gameScreen.startShake(12, 12, 40);
                    }
                    $gameScreen.startFlash([150, 0, 0, 200], 35);
                }
                AudioManager.playSe({name: 'Nightmare', volume: 130, pitch: 30, pan: 0});
                logMessage("L'AIR EST SATURE DE L'ODEUR DU SANG ET DE LA POURRITURE !");
                $gameParty.aliveMembers().forEach(function(hero) {
                    var vId = hero.actorId() + 10;
                    if (vId >= 11 && vId <= 14) {
                        $gameVariables.setValue(vId, Math.max(1, $gameVariables.value(vId) - 1));
                        hero.startAnimation(5);
                    }
                });
                if (Math.random() < 0.65) logMessage(randomFrom(GORE_SCREAMERS));

                // Screamer ambiance Phase 2 (55% de chance par tour)
                if (Math.random() < 0.55) {
                    JadeScreamer.random();
                }
            } else {
                if (Math.random() < 0.45) logMessage(randomFrom(PHASE1_MESSAGES));

                // Screamer ambiance Phase 1 critique (mental ≤ 3, 30% de chance)
                var mentalState = $gameVariables.value(MENTAL_VAR);
                if (mentalState <= 3 && Math.random() < 0.30) {
                    JadeScreamer.flashChaos();
                }
            }
        }
    };

    // ---- Fin d'action (transformations et contre-attaques) ----
    var _BattleManager_endAction = BattleManager.endAction;
    BattleManager.endAction = function() {
        _BattleManager_endAction.call(this);
        var jade = findJade();
        if (!jade) return;

        // ===== TRANSITION VERS PHASE 2 =====
        if (jade._executePhase2Transformation) {
            jade._executePhase2Transformation = false;
            jade.gainHp(jade.mhp);
            jade.clearStates();
            $gameSwitches.setValue(PHASE2_SWITCH, true);
            $gameVariables.setValue(MENTAL_VAR, 1);
            jade.startAnimation(DRAIN_ANIM);
            if ($gameScreen) {
                if (typeof $gameScreen.startAdvancedShake === 'function') {
                    $gameScreen.startAdvancedShake(25, 25, 120, 'diagonal');
                } else {
                    $gameScreen.startShake(15, 14, 120);
                }
            }
            AudioManager.playSe({ name: 'Scream',   volume: 150, pitch: 25, pan: 0 });
            AudioManager.playSe({ name: 'Damage3',  volume: 150, pitch: 50, pan: 0 });
            logMessage("JADE S'ÉCORCHE VIVE ! L'ENFER COMMENCE !");

            // --- SÉQUENCE SCREAMER PHASE 2 : BSOD → Visage d'horreur ---
            JadeScreamer.sequencePhase2();

            // --- MÉTA-HORREUR APOCALYPSE ---
            JadeMeta.phase2_Apocalypse();

            return;
        }

        // ===== DÉCLENCHEUR FIN DE COMBAT =====
        if (jade._triggerEndChoiceDialog) {
            jade._triggerEndChoiceDialog = false;
            jade.clearActions();
            jade.addState(4);
            $gameSwitches.setValue(END_CHOICE_SWITCH, true);
            return;
        }

        // ===== CONTRE-ATTAQUE NEYSSA (Plunging) =====
        if (BattleManager._jadeNightmareCounterTargetIdx !== undefined) {
            var nTarget = BattleManager._jadeNightmareCounterTargetIdx;
            BattleManager._jadeNightmareCounterTargetIdx = undefined;
            logMessage("JADE S'ABAT SUR NEYSSA AVEC SA DANSE DES AILES ÉCORCHÉES !");
            if (typeof $gameScreen.startAdvancedShake === 'function') {
                $gameScreen.startAdvancedShake(25, 25, 50, 'vertical');
            }
            jade.forceAction(WATERFOWL_SKILL, nTarget);
            if (typeof BattleManager.queueForceAction === 'function') {
                BattleManager.queueForceAction(jade, WATERFOWL_SKILL, nTarget);
            } else { BattleManager.forceAction(jade); }
            return;
        }

        // ===== DANSE DES AILES ÉCORCHÉES (Mental critique) =====
        if (BattleManager._jadeWaterfowlTargetIdx !== undefined) {
            var wfTarget = BattleManager._jadeWaterfowlTargetIdx;
            BattleManager._jadeWaterfowlTargetIdx = undefined;
            logMessage("Jade fait craquer ses os... Danse des Ailes Écorchées ! (Plunging)");
            if (typeof $gameScreen.startAdvancedShake === 'function') {
                $gameScreen.startAdvancedShake(20, 20, 45, 'vertical');
            }
            // Flash du visage d'horreur avant l'attaque
            JadeScreamer.flashHorreur();

            jade.forceAction(WATERFOWL_SKILL, wfTarget);
            if (typeof BattleManager.queueForceAction === 'function') {
                BattleManager.queueForceAction(jade, WATERFOWL_SKILL, wfTarget);
            } else { BattleManager.forceAction(jade); }
        }
        else if (!isPhase2Active() && BattleManager._jadeJealousyTargetIdx !== undefined) {
            var jTarget = BattleManager._jadeJealousyTargetIdx;
            BattleManager._jadeJealousyTargetIdx = undefined;
            logMessage("Jade s'interpose : « ELIMINER LE RIVAL ! »");
            jade.forceAction(JEALOUSY_SKILL, jTarget);
            if (typeof BattleManager.queueForceAction === 'function') {
                BattleManager.queueForceAction(jade, JEALOUSY_SKILL, jTarget);
            } else { BattleManager.forceAction(jade); }
        }
    };

    // ---- Initialisation du combat ----
    var _Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.call(this, troopId);
        BattleManager._jadeWaterfowlTargetIdx          = undefined;
        BattleManager._jadeJealousyTargetIdx           = undefined;
        BattleManager._jadeNightmareCounterTargetIdx   = undefined;
        if ($gameScreen) $gameScreen.startTint([0, 0, 0, 0], 1);
        var jade = findJade();
        if (jade) {
            jade._executePhase2Transformation = false;
            jade._triggerEndChoiceDialog = false;
            updateJadeStates(jade, true);
            if (!isPhase2Active()) {
                JadeMeta.phase1_Intense();
            }
        }
    };

    // ---- Nettoyage à la fin du combat ----
    var _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        _Scene_Battle_terminate.call(this);
        JadeMeta.nettoyer();
        JadeScreamer.hide(); // Retirer tout overlay screamer résiduel
    };

    // ========================================================================
    // --- FONCTIONS UTILITAIRES INTERNES ---
    // ========================================================================

    // Screamer audio + visuel combiné
    function executeScreamer() {
        if ($gameScreen) {
            if (typeof $gameScreen.startAdvancedShake === 'function') {
                $gameScreen.startAdvancedShake(25, 20, 30, 'diagonal');
            } else {
                $gameScreen.startShake(20, 15, 30);
            }
            $gameScreen.startFlash([220, 0, 0, 255], 12);
        }
        AudioManager.playSe({ name: 'Damage3', volume: 150, pitch: 50,  pan: 0 });
        AudioManager.playSe({ name: 'Scream',  volume: 130, pitch: 32,  pan: 0 });
        logMessage("⚠️ B̶O̶D̶Y̶_̶H̶O̶R̶R̶O̶R̶ : MUTATION DE CHAIR ET BRIS MATRICIEL !");

        // --- SCREAMER VISUEL INTÉGRÉ ---
        if (isPhase2Active()) {
            // Phase 2 : Diamants / HELP / Horreur aléatoire
            JadeScreamer.random();
        } else {
            // Phase 1 critique : flash Diamants ou HELP
            if (Math.random() < 0.50) {
                JadeScreamer.flashChaos();
            } else {
                JadeScreamer.flashHelp();
            }
        }
    }

    function inflictCyberVirusCooldown(actor) {
        if (!actor) return;
        if (typeof actor.setCooldown === 'function') {
            actor.skills().forEach(function(skill) {
                if (skill && skill.id !== 1) {
                    var currentCooldown = actor.cooldown(skill.id);
                    var malus = isPhase2Active() ? 2 : 1;
                    actor.setCooldown(skill.id, currentCooldown + malus);
                }
            });
            logMessage("⚡ VIRUS TEMP-OREL : Les compétences de " + actor.name().toUpperCase() + " sont entravées !");
        }
    }

})();

//=============================================================================
// ▼ AMÉLIORATION ADDITIVE : JADE = MALENIA (vol de vie)            by JOKO
//   Bloc autonome — ne modifie PAS la logique au-dessus. Cible <Malenia>.
//=============================================================================
(function () {
    'use strict';
    function isMalenia(b) {
        return b && b.isEnemy && b.isEnemy() && b.enemy() && b.enemy().meta && b.enemy().meta.Malenia;
    }
    // Vol de vie iconique : Malenia se soigne de 50% des dégâts qu'elle inflige.
    var _exec = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _exec.call(this, target, value);
        var s = this.subject();
        if (value > 0 && isMalenia(s) && s.isAlive()) {
            var heal = Math.floor(value * 0.5);
            if (heal > 0) {
                s.gainHp(heal);
                var sc = SceneManager._scene;
                if (sc && sc._logWindow) sc._logWindow.push('addText', s.name() + ' draine la vie ! (+' + heal + ' PV)');
            }
        }
    };
})();
