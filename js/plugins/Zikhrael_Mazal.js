//=============================================================================
// Zikhrael_Mazal.js
// Le moteur du Mystère des Sept Noms — Codex des Trois Sources
//=============================================================================

/*:
 * @plugindesc v1.0 Mystère des Sept Noms : variable Mazal, autel des noms,
 * bougies, Scribe Gris (mémoire globale), effacement du nom du héros.
 * @author JOKO & Claude
 *
 * @param Mazal Variable ID
 * @desc ID de la variable où le Mazal (1-100) est tiré à chaque nouvelle partie.
 * @default 41
 *
 * @param Auto Roll
 * @desc Tirer le Mazal automatiquement à chaque nouvelle partie. (true/false)
 * @default true
 *
 * @param Names
 * @desc Les sept noms et leurs interrupteurs-bougies. Format : NOM:IDinterrupteur, séparés par des virgules.
 * @default TEMIRA:21, KAVOR:22, OSHKA:23, SULITH:24, NEDRA:25, ILESSE:26, MAROTH:27
 *
 * @param Result Switch ID
 * @desc Interrupteur mis ON si le nom entré à l'autel est reconnu, OFF sinon.
 * @default 28
 *
 * @param Candle Count Variable ID
 * @desc Variable tenue à jour avec le nombre de bougies allumées (0-7). 0 pour désactiver.
 * @default 42
 *
 * @param Queen Name
 * @desc (Optionnel) Le huitième nom — le nom secret de la Reine. Laisser vide pour désactiver.
 * @default
 *
 * @param Queen Switch ID
 * @desc Interrupteur mis ON si le nom de la Reine est prononcé à l'autel. 0 pour désactiver.
 * @default 0
 *
 * @param Scribe Mazal Value
 * @desc Valeur du Mazal qui fait exister le Scribe Gris.
 * @default 7
 *
 * @param Scribe Switch ID
 * @desc Interrupteur-miroir du Scribe : ON si Mazal = valeur ci-dessus ET jamais vu (toutes parties confondues). 0 pour désactiver.
 * @default 30
 *
 * @param Scribe Global Key
 * @desc Clef de mémoire globale du Scribe. Une fois activée, il n'apparaît plus jamais, même en nouvelle partie.
 * @default scribe_vu
 *
 * @param Stele Mazal Value
 * @desc Valeur du Mazal qui fait exister la stèle blanche.
 * @default 77
 *
 * @param Stele Switch ID
 * @desc Interrupteur-miroir de la stèle blanche. 0 pour désactiver.
 * @default 31
 *
 * @help
 * ============================================================================
 * Zikhrael_Mazal.js — mode d'emploi
 * ============================================================================
 *
 * Ce plugin gère les quatre mécanismes cachés du mystère :
 *
 *  1. LE MAZAL : à chaque nouvelle partie, un nombre entre 1 et 100 est tiré
 *     dans la variable choisie. Il n'est jamais montré au joueur.
 *
 *  2. LES INTERRUPTEURS-MIROIRS : à chaque changement de carte, le plugin
 *     met à jour tout seul l'interrupteur du Scribe Gris et celui de la
 *     stèle blanche selon le Mazal. Tes événements n'ont donc besoin que
 *     d'une condition d'interrupteur classique sur leur page.
 *
 *  3. L'AUTEL : après une saisie de nom (Entrer un nom / Name Input
 *     Processing) sur un acteur fantôme, la commande CheckName compare le
 *     nom entré aux sept noms (majuscules, minuscules et accents ignorés),
 *     allume la bougie correspondante, met à jour le compteur de bougies,
 *     règle l'interrupteur de résultat, puis efface le nom de l'acteur.
 *     « L'autel efface ce qu'on lui donne. »
 *
 *  4. LA MÉMOIRE GLOBALE : les clefs globales (comme scribe_vu) sont
 *     écrites dans un fichier séparé (save/zikhrael.rpgsave, ou le
 *     localStorage en version navigateur). Elles survivent aux sauvegardes
 *     ET aux nouvelles parties. Pour réinitialiser en test : supprimer ce
 *     fichier.
 *
 * ----------------------------------------------------------------------------
 * COMMANDES DE PLUGIN (Commande de plugin / Plugin Command)
 * ----------------------------------------------------------------------------
 *
 *  Zikhrael CheckName 10      Vérifie le nom entré par l'acteur 10 (l'autel).
 *  Zikhrael ClearName 10      Vide le nom de l'acteur 10 (avant la saisie).
 *  Zikhrael EraseName 1       Renomme l'acteur 1 en « ??? » (la fin du don).
 *  Zikhrael GlobalOn scribe_vu    Active une clef de mémoire globale.
 *  Zikhrael GlobalOff scribe_vu   Désactive une clef (utile en test).
 *  Zikhrael MazalRoll         Retire le Mazal au hasard (test).
 *  Zikhrael MazalSet 7        Force le Mazal à une valeur (test).
 *
 * ----------------------------------------------------------------------------
 * CONDITIONS EN SCRIPT (Embranchement conditionnel > onglet 4 > Script)
 * ----------------------------------------------------------------------------
 *
 *  Zikhrael.mazal()               La valeur actuelle du Mazal.
 *  Zikhrael.mazalIs(77)           Vrai si le Mazal vaut exactement 77.
 *  Zikhrael.mazalMultipleOf(7)    Vrai si le Mazal est un multiple de 7
 *                                 (pour la musique aux notes inversées).
 *  Zikhrael.global('scribe_vu')   Vrai si la clef globale est active.
 *  Zikhrael.candles()             Nombre de bougies allumées (0-7).
 *
 * ----------------------------------------------------------------------------
 * NOTES
 * ----------------------------------------------------------------------------
 *
 *  - Garde les sept noms en lettres simples (sans accents) : le clavier de
 *    saisie par défaut de MV les rend faciles à taper, et le plugin ignore
 *    de toute façon la casse et les accents à la comparaison.
 *  - La variable compteur de bougies permet d'utiliser une simple condition
 *    de page « Variable >= 7 » sur l'événement de la porte.
 *  - Dans la console de test (F8), tape Zikhrael.mazal() pour connaître le
 *    tirage de la partie en cours.
 *
 * ============================================================================
 */

var Imported = Imported || {};
Imported.Zikhrael_Mazal = true;

var Zikhrael = Zikhrael || {};

(function() {
    'use strict';

    //-------------------------------------------------------------------------
    // Paramètres
    //-------------------------------------------------------------------------
    var params        = PluginManager.parameters('Zikhrael_Mazal');
    var pMazalVar     = Number(params['Mazal Variable ID'] || 41);
    var pAutoRoll     = String(params['Auto Roll'] || 'true').toLowerCase() === 'true';
    var pNames        = String(params['Names'] || '');
    var pResultSwitch = Number(params['Result Switch ID'] || 28);
    var pCandleVar    = Number(params['Candle Count Variable ID'] || 42);
    var pQueenName    = String(params['Queen Name'] || '').trim();
    var pQueenSwitch  = Number(params['Queen Switch ID'] || 0);
    var pScribeValue  = Number(params['Scribe Mazal Value'] || 7);
    var pScribeSwitch = Number(params['Scribe Switch ID'] || 30);
    var pScribeKey    = String(params['Scribe Global Key'] || 'scribe_vu').trim();
    var pSteleValue   = Number(params['Stele Mazal Value'] || 77);
    var pSteleSwitch  = Number(params['Stele Switch ID'] || 31);

    //-------------------------------------------------------------------------
    // Normalisation : minuscules, sans accents, sans espaces parasites.
    // « Témira », « TEMIRA » et « temira » sont le même nom.
    //-------------------------------------------------------------------------
    function normalize(str) {
        str = String(str || '').trim().toLowerCase();
        try {
            str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        } catch (e) {
            // Environnement sans String.normalize : on compare tel quel.
        }
        return str;
    }

    //-------------------------------------------------------------------------
    // Table des sept noms  (format param : "NOM:IDinterrupteur, NOM:ID, ...")
    //-------------------------------------------------------------------------
    var nameTable = [];
    pNames.split(',').forEach(function(pair) {
        var parts = pair.split(':');
        if (parts.length >= 2) {
            var n = normalize(parts[0]);
            var s = Number(String(parts[1]).trim());
            if (n && s > 0) nameTable.push({ name: n, switchId: s });
        }
    });

    //-------------------------------------------------------------------------
    // Mémoire globale — survit aux sauvegardes et aux nouvelles parties.
    // Local (jeu exporté / playtest) : save/zikhrael.rpgsave
    // Navigateur : clef localStorage "RPG Zikhrael"
    //-------------------------------------------------------------------------
    var globalData = null;

    function globalFilePath() {
        return StorageManager.localFileDirectoryPath() + 'zikhrael.rpgsave';
    }

    function loadGlobal() {
        if (globalData) return globalData;
        globalData = {};
        try {
            if (StorageManager.isLocalMode()) {
                var fs = require('fs');
                if (fs.existsSync(globalFilePath())) {
                    globalData = JSON.parse(fs.readFileSync(globalFilePath(), 'utf8')) || {};
                }
            } else {
                var raw = localStorage.getItem('RPG Zikhrael');
                if (raw) globalData = JSON.parse(raw) || {};
            }
        } catch (e) {
            globalData = {};
        }
        return globalData;
    }

    function saveGlobal() {
        try {
            if (StorageManager.isLocalMode()) {
                var fs = require('fs');
                var dir = StorageManager.localFileDirectoryPath();
                if (!fs.existsSync(dir)) fs.mkdirSync(dir);
                fs.writeFileSync(globalFilePath(), JSON.stringify(globalData || {}));
            } else {
                localStorage.setItem('RPG Zikhrael', JSON.stringify(globalData || {}));
            }
        } catch (e) {
            // Échec silencieux : le mystère ne doit jamais faire planter le jeu.
        }
    }

    //-------------------------------------------------------------------------
    // API publique — utilisable dans les Embranchements conditionnels (Script)
    //-------------------------------------------------------------------------
    Zikhrael.mazal = function() {
        return $gameVariables ? $gameVariables.value(pMazalVar) : 0;
    };

    Zikhrael.mazalIs = function(n) {
        return Zikhrael.mazal() === Number(n);
    };

    Zikhrael.mazalMultipleOf = function(n) {
        var m = Zikhrael.mazal();
        return m > 0 && Number(n) > 0 && m % Number(n) === 0;
    };

    Zikhrael.global = function(key) {
        return !!loadGlobal()[String(key).trim()];
    };

    Zikhrael.setGlobal = function(key, value) {
        loadGlobal()[String(key).trim()] = !!value;
        saveGlobal();
    };

    Zikhrael.candles = function() {
        if (!$gameSwitches) return 0;
        return nameTable.reduce(function(count, entry) {
            return count + ($gameSwitches.value(entry.switchId) ? 1 : 0);
        }, 0);
    };

    Zikhrael.roll = function() {
        if ($gameVariables) {
            $gameVariables.setValue(pMazalVar, Math.randomInt(100) + 1);
        }
    };

    //-------------------------------------------------------------------------
    // Miroirs : le plugin règle tout seul les interrupteurs du Scribe et de
    // la stèle à chaque chargement de carte. Les pages d'événements n'ont
    // plus qu'à poser une condition d'interrupteur ordinaire.
    //-------------------------------------------------------------------------
    function updateCandleVar() {
        if (pCandleVar > 0 && $gameVariables) {
            $gameVariables.setValue(pCandleVar, Zikhrael.candles());
        }
    }

    function refreshMirrors() {
        if (!$gameSwitches) return;
        if (pScribeSwitch > 0) {
            var scribeOn = Zikhrael.mazalIs(pScribeValue) && !Zikhrael.global(pScribeKey);
            $gameSwitches.setValue(pScribeSwitch, scribeOn);
        }
        if (pSteleSwitch > 0) {
            $gameSwitches.setValue(pSteleSwitch, Zikhrael.mazalIs(pSteleValue));
        }
        updateCandleVar();
    }

    //-------------------------------------------------------------------------
    // L'autel : vérification du nom entré
    //-------------------------------------------------------------------------
    function checkName(actorId) {
        var actor = $gameActors ? $gameActors.actor(actorId) : null;
        if (!actor) return;

        var entered = normalize(actor.name());
        var found = false;

        if (entered) {
            nameTable.forEach(function(entry) {
                if (entry.name === entered) {
                    $gameSwitches.setValue(entry.switchId, true);
                    found = true;
                }
            });
            if (!found && pQueenName && pQueenSwitch > 0 &&
                normalize(pQueenName) === entered) {
                $gameSwitches.setValue(pQueenSwitch, true);
                found = true;
            }
        }

        if (pResultSwitch > 0) $gameSwitches.setValue(pResultSwitch, found);
        updateCandleVar();

        // L'autel efface ce qu'on lui donne.
        actor.setName('');
    }

    //-------------------------------------------------------------------------
    // Tirage automatique du Mazal en nouvelle partie
    //-------------------------------------------------------------------------
    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        if (pAutoRoll) Zikhrael.roll();
    };

    //-------------------------------------------------------------------------
    // Rafraîchissement des miroirs à chaque carte
    //-------------------------------------------------------------------------
    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        refreshMirrors();
    };

    //-------------------------------------------------------------------------
    // Commandes de plugin
    //-------------------------------------------------------------------------
    var _GI_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _GI_pluginCommand.call(this, command, args);
        if (String(command).toLowerCase() !== 'zikhrael') return;

        var sub = String(args[0] || '').toLowerCase();
        switch (sub) {

            case 'checkname':
                checkName(Number(args[1] || 0));
                break;

            case 'clearname': {
                var ghost = $gameActors.actor(Number(args[1] || 0));
                if (ghost) ghost.setName('');
                break;
            }

            case 'erasename': {
                var hero = $gameActors.actor(Number(args[1] || 1));
                if (hero) hero.setName('???');
                break;
            }

            case 'globalon':
                Zikhrael.setGlobal(String(args[1] || ''), true);
                refreshMirrors();
                break;

            case 'globaloff':
                Zikhrael.setGlobal(String(args[1] || ''), false);
                refreshMirrors();
                break;

            case 'mazalroll':
                Zikhrael.roll();
                refreshMirrors();
                break;

            case 'mazalset':
                $gameVariables.setValue(pMazalVar, Number(args[1] || 0));
                refreshMirrors();
                break;
        }
    };

})();

//=============================================================================
// Hilla, yachida, zakharat.
//=============================================================================
