/*:
 * @plugindesc v1.1.0 Système de Jackpot "Pari Mortel" optimisé pour Lou (Compatible YEP_X_BattleSysCTB).
 * @author Ton Partenaire de Code
 *
 * @param Actor ID
 * @desc L'ID du personnage qui lance le sort (Lou = 3).
 * @default 3
 *
 * @param Jackpot State ID
 * @desc L'ID de l'état "Jackpot" à appliquer.
 * @default 11
 *
 * @param Jackpot BGM
 * @desc Le nom de la musique jouée pendant le jackpot.
 * @default jackpotsong
 *
 * @help
 * ============================================================================
 * Explication
 * ============================================================================
 * Ce plugin gère toute la logique du pari (Probabilités, HP/MP, Musique).
 * Il intègre désormais un correctif pour YEP_X_BattleSysCTB : le timer
 * se met en pause lorsque le joueur choisit une action !
 *
 * Commande de Plugin à utiliser dans l'Évènement Commun :
 * HakariJackpot Start
 */

(function() {
    var parameters = PluginManager.parameters('LOU_HakariJackpot');
    var actorId = Number(parameters['Actor ID'] || 3);
    var jackpotStateId = Number(parameters['Jackpot State ID'] || 11);
    var jackpotBgmName = String(parameters['Jackpot BGM'] || 'jackpotsong');

    var hakariBonus = 1;
    var savedBgm = null;
    var isJackpotActive = false;

    // --- COMMANDE DE PLUGIN ---
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'HakariJackpot' && args[0] === 'Start') {
            this.executeHakariGamble();
        }
    };

    // --- LOGIQUE DU PARI ---
    Game_Interpreter.prototype.executeHakariGamble = function() {
        var actor = $gameActors.actor(actorId);
        if (!actor) return;

        if (!savedBgm) savedBgm = AudioManager.saveBgm();

        AudioManager.playSe({ name: "Machine", volume: 90, pitch: 100, pan: 0 });
        
        var tirage = Math.floor(Math.random() * 15) + 1;

        if (tirage <= hakariBonus) {
            this.triggerJackpotWin(actor);
        } else {
            this.triggerJackpotFail(actor);
        }
    };

    Game_Interpreter.prototype.triggerJackpotWin = function(actor) {
        $gameScreen.startFlash([255, 215, 0, 170], 60); 
        $gameScreen.startShake(9, 9, 60); 

        hakariBonus = 2; // Réinitialise les chances
        isJackpotActive = true;
        $gameSwitches.setValue(6, true);
        
        $gameMessage.add("\\c[14][ 7 | 7 | 7 ] !\\c[0]");
        $gameMessage.add("JACKPOOOOOOOOOT !");

        actor.addState(jackpotStateId);
        AudioManager.playMe({ name: "jackpot-hakari", volume: 90, pitch: 100, pan: 0 });
        AudioManager.playBgm({ name: jackpotBgmName, volume: 90, pitch: 100, pan: 0 });

        // 2 min 11 sec = 131 secondes
        $gameTimer.start(131 * 60); 
    };

    Game_Interpreter.prototype.triggerJackpotFail = function(actor) {
        var num1 = Math.floor(Math.random() * 6) + 1;
        var num2 = Math.floor(Math.random() * 6) + 1;
        var num3 = Math.floor(Math.random() * 6) + 1;

        AudioManager.playSe({ name: "Buzzer1", volume: 90, pitch: 100, pan: 0 });
        $gameMessage.add("[ " + num1 + " | " + num2 + " | " + num3 + " ] ...");
        $gameMessage.add("Pas de chance, on relance ?");

        $gameMessage.setChoices(["Oui (-50MP, -300HP)", "Non"], 0, 1);
        $gameMessage.setBackground(1); 
        $gameMessage.setPositionType(1); 

        var interpreter = this;
        $gameMessage.setChoiceCallback(function(n) {
            if (n === 0) {
                if (actor.hp > 10) {
                    actor.gainMp(-50);
                    actor.gainHp(-300);
                    actor.startDamagePopup();
                    $gameScreen.startFlash([255, 255, 255, 170], 30);
                    hakariBonus += 1;
                    
                    setTimeout(function() {
                        interpreter.executeHakariGamble();
                    }, 500);
                } else {
                    AudioManager.playSe({ name: "Buzzer2", volume: 90, pitch: 100, pan: 0 });
                    $gameMessage.add("Plus assez de vie pour parier...");
                }
            } else {
                $gameMessage.add("Le destin en a décidé autrement.");
            }
        });
        
        this.setWaitMode('message');
    };

    // --- GESTION DU TIMER (COMPATIBILITÉ YANFLY CTB) ---
    var _Game_Timer_update = Game_Timer.prototype.update;
    Game_Timer.prototype.update = function(sceneActive) {
        // En combat CTB, on ne met à jour le temps que si la fenêtre de commande n'est PAS active.
        if ($gameParty.inBattle() && SceneManager._scene instanceof Scene_Battle) {
            // Scene_Battle.isAnyInputWindowActive() vérifie si le joueur est dans un menu de choix
            if (SceneManager._scene.isAnyInputWindowActive()) {
                return; // PAUSE DU TIMER PENDANT LA SÉLECTION D'ATTAQUE
            }
        }
        _Game_Timer_update.call(this, sceneActive);
    };

    // Vérification de la fin du Timer
    var _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        
        if (isJackpotActive && $gameTimer.frames() === 0) {
            endJackpot();
        }
    };

    // Fin du combat : couper le timer si le boss meurt avant la fin
    var _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        if (isJackpotActive) endJackpot();
        _Scene_Battle_terminate.call(this);
    };

    function endJackpot() {
        isJackpotActive = false;
        $gameSwitches.setValue(6, false);
        $gameTimer.stop();
        
        var actor = $gameActors.actor(actorId);
        if (actor) {
            actor.removeState(jackpotStateId);
        }
        if (savedBgm) {
            AudioManager.replayBgm(savedBgm);
            savedBgm = null;
        }
        $gameScreen.startFlash([0, 0, 0, 170], 60);
    }

})();