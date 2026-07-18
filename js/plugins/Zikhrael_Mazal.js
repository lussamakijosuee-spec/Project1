//=============================================================================
// Zikhrael_Mazal.js
// Le moteur du Mystère des Sept Noms — Codex des Trois Sources
//=============================================================================

/*:
 * @plugindesc v1.2 Mystère des Sept Noms : variable Mazal, autel des noms,
 * les Sept Âmes visibles uniquement par le Regard, Scribe Gris (mémoire globale).
 * @author JOKO & Claude
 *
 * @param Mazal Variable ID
 * @desc ID de la variable où le Mazal (1-100) est tiré à chaque nouvelle partie.
 * @default 43
 *
 * @param Auto Roll
 * @desc Tirer le Mazal automatiquement à chaque nouvelle partie. (true/false)
 * @default true
 *
 * @param Names
 * @desc Les sept noms et leurs interrupteurs d'âmes. Format : NOM:IDinterrupteur, séparés par des virgules.
 * @default TEMIRA:44, KAVOR:45, OSHKA:46, SULITH:47, NEDRA:48, ILESSE:49, MAROTH:50
 *
 * @param Result Switch ID
 * @desc Interrupteur mis ON si le nom entré à l'autel est reconnu, OFF sinon.
 * @default 51
 *
 * @param Ames Count Variable ID
 * @desc Variable tenue à jour avec le nombre d'âmes nommées (0-7). 0 pour désactiver.
 * @default 44
 *
 * @param Vision Mode
 * @desc regard : les âmes n'apparaissent que pendant le Regard (touche R). lucidite : selon la variable de lucidité.
 * @default regard
 *
 * @param Regard Vision Duree
 * @desc Mode regard : durée (en secondes) pendant laquelle les âmes restent visibles après un Regard.
 * @default 8
 *
 * @param Regard Lucidite Min
 * @desc Mode regard : lucidité minimale (0-9, échelle LeRegard) pour que le Regard révèle les âmes. 0 = toujours.
 * @default 0
 *
 * @param Lucidite Variable ID
 * @desc Mode lucidite : ID de la variable lue comme lucidité (ici : 11 = jauge mentale de Thylane).
 * @default 11
 *
 * @param Lucidite Seuil
 * @desc Mode lucidite : seuil à partir duquel les âmes deviennent visibles.
 * @default 4
 *
 * @param Vision Inversee
 * @desc Mode lucidite : false = visibles si variable >= seuil. true = visibles si variable <= seuil (jauge basse = proche du Lac).
 * @default true
 *
 * @param Vision Switch ID
 * @desc Interrupteur-miroir de la vision : géré tout seul. Sert de condition de page aux âmes.
 * @default 54
 *
 * @param Esprit Opacite
 * @desc Opacité de base des événements marqués <ZK Esprit> dans leur champ Note (0-255). Un léger scintillement est ajouté.
 * @default 170
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
 * @default 52
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
 * @default 53
 *
 * @help
 * ============================================================================
 * Zikhrael_Mazal.js v1.2 — mode d'emploi
 * ============================================================================
 *
 * NOUVEAU EN v1.2 : le mode « regard ». Les Sept Âmes ne sont plus liées à
 * un seuil de lucidité permanent : elles n'apparaissent QUE lorsque le
 * joueur utilise LE REGARD (touche R, plugin LeRegard.js). Ouvrir le vitrail
 * du Regard ouvre aussi l'œil aux morts : l'interrupteur ZK Vision passe ON
 * pendant « Regard Vision Duree » secondes, puis l'œil se referme et les
 * âmes s'estompent. Charger ce plugin APRÈS LeRegard.js.
 *
 * Le plugin gère cinq mécanismes cachés :
 *
 *  1. LE MAZAL : à chaque nouvelle partie, un nombre entre 1 et 100 est tiré
 *     dans la variable choisie. Il n'est jamais montré au joueur.
 *
 *  2. LES INTERRUPTEURS-MIROIRS : à chaque changement de carte, le plugin
 *     met à jour tout seul l'interrupteur du Scribe Gris, celui de la stèle
 *     blanche, ET l'interrupteur de vision (ZK Vision).
 *     - Mode « regard » : ZK Vision suit l'usage du Regard (touche R).
 *     - Mode « lucidite » : ZK Vision suit la variable de lucidité, en
 *       direct, dès qu'elle change.
 *
 *  3. L'AUTEL : après une saisie de nom (Entrer le nom d'un héros) sur un
 *     acteur fantôme, la commande CheckName compare le nom entré aux sept
 *     noms (majuscules, minuscules et accents ignorés), active
 *     l'interrupteur d'âme correspondant, met à jour le compteur d'âmes,
 *     règle l'interrupteur de résultat, puis efface le nom de l'acteur.
 *     « L'autel efface ce qu'on lui donne. »
 *
 *  4. LES ESPRITS : écris <ZK Esprit> dans le champ Note d'un événement
 *     (la petite case en haut de l'éditeur d'événement) et il sera affiché
 *     en semi-transparence avec un lent scintillement spectral. L'effet se
 *     suspend pendant une route de déplacement forcée : tes fondus
 *     (« Opacité 0 ») restent possibles.
 *
 *  5. LA MÉMOIRE GLOBALE : les clefs globales (comme scribe_vu) sont
 *     écrites dans save/zikhrael.rpgsave (ou le localStorage en version
 *     navigateur). Elles survivent aux sauvegardes ET aux nouvelles
 *     parties. Pour réinitialiser en test : supprimer ce fichier.
 *
 * ----------------------------------------------------------------------------
 * COMMANDES DE PLUGIN (Commande de plugin / Plugin Command)
 * ----------------------------------------------------------------------------
 *
 *  Zikhrael CheckName 5       Vérifie le nom entré par l'acteur 5 (l'autel).
 *  Zikhrael ClearName 5       Vide le nom de l'acteur 5 (avant la saisie).
 *  Zikhrael EraseName 1       Renomme l'acteur 1 en « ??? » (la fin du don).
 *  Zikhrael VisionOn          Force l'ouverture de la vision (mise en scène).
 *  Zikhrael VisionOn 20       Idem, pour 20 secondes.
 *  Zikhrael VisionOff         Referme la vision immédiatement.
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
 *  Zikhrael.mazalMultipleOf(7)    Vrai si le Mazal est un multiple de 7.
 *  Zikhrael.voit()                Vrai si les âmes sont visibles maintenant.
 *  Zikhrael.visionRestante()      Secondes de vision restantes (mode regard).
 *  Zikhrael.ames()                Nombre d'âmes nommées (0-7).
 *  Zikhrael.global('scribe_vu')   Vrai si la clef globale est active.
 *
 * ----------------------------------------------------------------------------
 * NOTES
 * ----------------------------------------------------------------------------
 *
 *  - Ce plugin se charge APRÈS LeRegard.js (il lit le vitrail du Regard).
 *    Sans LeRegard, le mode « regard » reste fermé : utilise alors les
 *    commandes VisionOn / VisionOff ou repasse en mode « lucidite ».
 *  - « Regard Lucidite Min » ajoute une condition : le Regard ne révèle les
 *    âmes que si LeRegard.lucidite() atteint ce niveau (0-9). À 0, chaque
 *    Regard les révèle.
 *  - Garde les sept noms en lettres simples (sans accents) : le clavier de
 *    saisie par défaut de MV les rend faciles à taper, et le plugin ignore
 *    de toute façon la casse et les accents à la comparaison.
 *  - Dans la console de test (F8) : Zikhrael.mazal(), Zikhrael.voit(), etc.
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
    var pMazalVar     = Number(params['Mazal Variable ID'] || 43);
    var pAutoRoll     = String(params['Auto Roll'] || 'true').toLowerCase() === 'true';
    var pNames        = String(params['Names'] || '');
    var pResultSwitch = Number(params['Result Switch ID'] || 51);
    var pAmesVar      = Number(params['Ames Count Variable ID'] || 44);
    var pVisionMode   = String(params['Vision Mode'] || 'regard').trim().toLowerCase();
    var pRegardDuree  = Number(params['Regard Vision Duree'] || 8);
    var pRegardLucMin = Number(params['Regard Lucidite Min'] || 0);
    var pLucVar       = Number(params['Lucidite Variable ID'] || 11);
    var pLucSeuil     = Number(params['Lucidite Seuil'] || 4);
    var pVisionInv    = String(params['Vision Inversee'] || 'true').toLowerCase() === 'true';
    var pVisionSwitch = Number(params['Vision Switch ID'] || 54);
    var pEspritOpac   = Number(params['Esprit Opacite'] || 170);
    var pQueenName    = String(params['Queen Name'] || '').trim();
    var pQueenSwitch  = Number(params['Queen Switch ID'] || 0);
    var pScribeValue  = Number(params['Scribe Mazal Value'] || 7);
    var pScribeSwitch = Number(params['Scribe Switch ID'] || 52);
    var pScribeKey    = String(params['Scribe Global Key'] || 'scribe_vu').trim();
    var pSteleValue   = Number(params['Stele Mazal Value'] || 77);
    var pSteleSwitch  = Number(params['Stele Switch ID'] || 53);

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
    // La vision par le Regard — l'œil ouvert compte en frames.
    //-------------------------------------------------------------------------
    var visionFrames = 0;
    var lastVision = null;

    function regardOuvert() {
        var sc = SceneManager._scene;
        return !!(sc && sc._regard && sc._regard.visible && sc._regard._fade > 0);
    }

    function luciditeRegardOk() {
        if (pRegardLucMin <= 0) return true;
        try {
            if (window.LeRegard) return LeRegard.lucidite() >= pRegardLucMin;
        } catch (e) {}
        return true;
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

    Zikhrael.lucidite = function() {
        return $gameVariables ? $gameVariables.value(pLucVar) : 0;
    };

    Zikhrael.voit = function() {
        if (pVisionMode === 'regard') {
            return visionFrames > 0 && luciditeRegardOk();
        }
        var luc = Zikhrael.lucidite();
        return pVisionInv ? (luc <= pLucSeuil) : (luc >= pLucSeuil);
    };

    Zikhrael.visionRestante = function() {
        return Math.ceil(visionFrames / 60);
    };

    Zikhrael.global = function(key) {
        return !!loadGlobal()[String(key).trim()];
    };

    Zikhrael.setGlobal = function(key, value) {
        loadGlobal()[String(key).trim()] = !!value;
        saveGlobal();
    };

    Zikhrael.ames = function() {
        if (!$gameSwitches) return 0;
        return nameTable.reduce(function(count, entry) {
            return count + ($gameSwitches.value(entry.switchId) ? 1 : 0);
        }, 0);
    };

    // Alias de compatibilité avec la v1.0
    Zikhrael.candles = Zikhrael.ames;

    Zikhrael.roll = function() {
        if ($gameVariables) {
            $gameVariables.setValue(pMazalVar, Math.randomInt(100) + 1);
        }
    };

    //-------------------------------------------------------------------------
    // Miroirs : Scribe, stèle et vision réglés tout seuls.
    //-------------------------------------------------------------------------
    function updateAmesVar() {
        if (pAmesVar > 0 && $gameVariables) {
            $gameVariables.setValue(pAmesVar, Zikhrael.ames());
        }
    }

    function refreshVision() {
        if (pVisionSwitch > 0 && $gameSwitches) {
            var v = Zikhrael.voit();
            lastVision = v;
            $gameSwitches.setValue(pVisionSwitch, v);
        }
    }

    function refreshVisionIfChanged() {
        if (Zikhrael.voit() !== lastVision) refreshVision();
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
        refreshVision();
        updateAmesVar();
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
        updateAmesVar();

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
    // Rafraîchissement des miroirs à chaque carte.
    // Changer de carte referme l'œil : la vision ne suit pas le joueur.
    //-------------------------------------------------------------------------
    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        visionFrames = 0;
        refreshMirrors();
    };

    //-------------------------------------------------------------------------
    // Mode regard : ouvrir le vitrail du Regard (LeRegard.js) ouvre aussi
    // l'œil aux morts. La vision reste ouverte « Regard Vision Duree »
    // secondes après la fermeture du vitrail, puis les âmes s'estompent.
    // Le compte à rebours se suspend pendant qu'un événement se joue.
    //-------------------------------------------------------------------------
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (pVisionMode !== 'regard') return;
        if (regardOuvert()) {
            visionFrames = Math.max(1, Math.round(pRegardDuree * 60));
        } else if (visionFrames > 0 && $gameMap && !$gameMap.isEventRunning()) {
            visionFrames--;
        }
        refreshVisionIfChanged();
    };

    //-------------------------------------------------------------------------
    // Mode lucidite : si la variable de lucidité change en pleine carte,
    // l'interrupteur ZK Vision suit immédiatement.
    //-------------------------------------------------------------------------
    var _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
        _Game_Variables_setValue.call(this, variableId, value);
        if (variableId === pLucVar && pVisionMode !== 'regard') refreshVision();
    };

    //-------------------------------------------------------------------------
    // Les esprits : événements marqués <ZK Esprit> dans leur champ Note.
    // Semi-transparence et lent scintillement spectral, automatiques.
    // Suspendu pendant une route forcée : les fondus scriptés restent possibles.
    //-------------------------------------------------------------------------
    var _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        var note = (this.event() && this.event().note) || '';
        this._zkEsprit = /<ZK[ _]?Esprit>/i.test(note);
    };

    var _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_Event_update.call(this);
        if (this._zkEsprit && this._pageIndex >= 0 && !this._moveRouteForcing) {
            var t = Graphics.frameCount / 60;
            var breath = Math.sin(t * 1.6 + this._eventId * 2) * 35;
            this.setOpacity(Math.max(0, Math.min(255, Math.round(pEspritOpac + breath))));
        }
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

            case 'visionon':
                visionFrames = Math.max(1, Math.round(Number(args[1] || pRegardDuree) * 60));
                refreshVisionIfChanged();
                break;

            case 'visionoff':
                visionFrames = 0;
                refreshVisionIfChanged();
                break;

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
