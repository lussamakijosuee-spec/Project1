//=============================================================================
// JadeMemoire.js — v1.0  ·  La Mémoire de Jade (persistance hors-sauvegarde)
// RPG Maker MV   ·   by JOKO   (additif — ne modifie aucun autre plugin)
//=============================================================================
/*:
 * @target MV
 * @plugindesc v1.0 ■ Jade se SOUVIENT de tes parties precedentes (hors sauvegarde) :
 * accueil NG+, et le BOSS FINAL se renforce + te parle selon ton passe.
 * @author JOKO
 *
 * @param PerVictoryBonus
 * @text Bonus stats / victoire passee (%)
 * @type number
 * @desc Le boss <JadeMemoire> gagne ce % de stats par fois ou tu l'as deja vaincue.
 * @default 8
 *
 * @param BonusCap
 * @text Plafond du bonus (%)
 * @type number
 * @default 60
 *
 * @param RunsVarId
 * @text Variable ou ecrire le nb de parties
 * @type variable
 * @desc 0 = desactive. Pratique pour les Conditional Branch (NG+).
 * @default 0
 *
 * @help
 * ============================================================================
 *  LA MÉMOIRE DE JADE                                                  by JOKO
 * ============================================================================
 *  Stocke quelques infos PERSISTANTES, en dehors des fichiers de sauvegarde :
 *  fichier local (NW.js) + localStorage. Elles survivent donc à une nouvelle
 *  partie ET à la suppression des sauvegardes — c'est tout l'effet « méta ».
 *
 *  MÉMORISÉ : nb de parties lancées, game overs, fins obtenues, nombre de fois
 *  où Jade a été vaincue, dernier prénom joueur, drapeaux personnalisés.
 *
 *  BOSS FINAL
 *  ----------
 *  Mets le notetag <JadeMemoire> sur l'ennemi du combat final. Alors :
 *    • Ses stats montent selon le nombre de fois où tu l'as déjà vaincue.
 *    • À l'ouverture du combat, elle te parle de ton passé.
 *
 *  COMMANDES DE PLUGIN (Event ▸ Plugin Command)
 *  --------------------------------------------
 *    MEMOIRE greet                 ← ajoute la phrase d'accueil au message en cours
 *    MEMOIRE record_ending <id>    ← enregistre une fin obtenue (1..n)
 *    MEMOIRE defeat_jade           ← +1 au compteur « Jade vaincue »
 *    MEMOIRE flag <nom>            ← pose un drapeau persistant
 *    MEMOIRE store_runs <varId>    ← écrit le nb de parties dans une variable
 *    MEMOIRE store_kills <varId>   ← écrit le nb de victoires sur Jade
 *    MEMOIRE forget                ← efface toute la mémoire (debug / vrai reset)
 *
 *  SCRIPT (pour Conditional Branch ▸ Script ou Show Text via event) :
 *    JadeMemoire.runs()            nombre de parties lancées
 *    JadeMemoire.timesDefeated()   fois où Jade est tombée
 *    JadeMemoire.lastEnding()      id de la dernière fin obtenue
 *    JadeMemoire.hasEnding(id)     true si cette fin a déjà été vue
 *    JadeMemoire.greeting()        phrase d'accueil contextuelle
 * ============================================================================
 */
var JadeMemoire = JadeMemoire || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('JadeMemoire');
    var PER_WIN  = parseInt(P['PerVictoryBonus'] || 8, 10) / 100;
    var CAP      = parseInt(P['BonusCap'] || 60, 10) / 100;
    var RUNS_VAR = parseInt(P['RunsVarId'] || 0, 10);

    var LS_KEY = 'JADE_MEMOIRE_V1';

    var DEFAULT = {
        version: 1,
        runs: 0,
        gameOvers: 0,
        endings: {},        // { "1": true, ... }
        lastEnding: 0,
        defeatedJade: 0,
        lastName: '',
        flags: {}
    };

    //------------------------------------------------------------------------
    // PERSISTANCE (fichier NW.js + localStorage, tolérante aux erreurs)
    //------------------------------------------------------------------------
    function gameFolder() {
        if (!Utils.isNwjs()) return null;
        try { return require('path').dirname(process.mainModule.filename); }
        catch (e) { return null; }
    }
    function filePath() {
        var folder = gameFolder();
        if (!folder) return null;
        try { return require('path').join(folder, 'save', 'jade_memoire.dat'); }
        catch (e) { return null; }
    }

    function readFile() {
        var fp = filePath();
        if (!fp) return null;
        try {
            var fs = require('fs');
            if (fs.existsSync(fp)) return JSON.parse(fs.readFileSync(fp, 'utf8'));
        } catch (e) {}
        return null;
    }
    function writeFile(obj) {
        var fp = filePath();
        if (!fp) return;
        try {
            var fs = require('fs');
            var dir = require('path').dirname(fp);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir);
            fs.writeFileSync(fp, JSON.stringify(obj), 'utf8');
        } catch (e) {}
    }
    function readLS() {
        try { var s = window.localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : null; }
        catch (e) { return null; }
    }
    function writeLS(obj) {
        try { window.localStorage.setItem(LS_KEY, JSON.stringify(obj)); } catch (e) {}
    }

    function mergeDefaults(d) {
        var out = JSON.parse(JSON.stringify(DEFAULT));
        if (d && typeof d === 'object') {
            Object.keys(out).forEach(function (k) {
                if (d[k] !== undefined && d[k] !== null) out[k] = d[k];
            });
        }
        return out;
    }

    JadeMemoire._data = null;
    JadeMemoire.load = function () {
        // Le fichier prime (survie maximale) ; sinon localStorage.
        var d = readFile() || readLS();
        JadeMemoire._data = mergeDefaults(d);
        return JadeMemoire._data;
    };
    JadeMemoire.save = function () {
        if (!JadeMemoire._data) return;
        writeFile(JadeMemoire._data);
        writeLS(JadeMemoire._data);
    };
    function data() {
        if (!JadeMemoire._data) JadeMemoire.load();
        return JadeMemoire._data;
    }

    //------------------------------------------------------------------------
    // API
    //------------------------------------------------------------------------
    JadeMemoire.get = function (k) { return data()[k]; };
    JadeMemoire.set = function (k, v) { data()[k] = v; JadeMemoire.save(); };
    JadeMemoire.inc = function (k, n) { var d = data(); d[k] = (Number(d[k]) || 0) + (n || 1); JadeMemoire.save(); return d[k]; };

    JadeMemoire.runs          = function () { return Number(data().runs) || 0; };
    JadeMemoire.timesDefeated = function () { return Number(data().defeatedJade) || 0; };
    JadeMemoire.lastEnding    = function () { return Number(data().lastEnding) || 0; };
    JadeMemoire.gameOvers     = function () { return Number(data().gameOvers) || 0; };
    JadeMemoire.hasEnding     = function (id) { return !!data().endings[String(id)]; };
    JadeMemoire.hasFlag       = function (name) { return !!data().flags[String(name)]; };

    JadeMemoire.recordEnding = function (id) {
        var d = data();
        d.endings[String(id)] = true;
        d.lastEnding = Number(id) || 0;
        JadeMemoire.save();
    };
    JadeMemoire.recordDefeatJade = function () { return JadeMemoire.inc('defeatedJade', 1); };
    JadeMemoire.setFlag = function (name) { data().flags[String(name)] = true; JadeMemoire.save(); };
    JadeMemoire.forget = function () { JadeMemoire._data = mergeDefaults(null); JadeMemoire.save(); };

    // Multiplicateur de stats du boss final selon le passé
    JadeMemoire.bossMult = function () {
        return 1 + Math.min(CAP, JadeMemoire.timesDefeated() * PER_WIN);
    };

    // Phrase d'accueil contextuelle (NG+)
    JadeMemoire.greeting = function () {
        var d = data();
        var name = d.lastName || '';
        if (d.runs <= 1) return null; // première partie : pas de souvenir
        if (d.defeatedJade > 0) {
            return 'Jade : « Tu reviens… ' + (name ? name + ', ' : '') +
                   'encore. Tu m\'as déjà détruite ' + d.defeatedJade +
                   ' fois. Cette fois, je me souviendrai de chaque coup. »';
        }
        if (d.lastEnding === 2) return 'Jade : « La dernière fois, tu les as laissés sombrer dans le carnage. Recommence, pour voir. »';
        if (d.lastEnding === 1) return 'Jade : « L\'harmonie, encore ? Tu crois vraiment pouvoir la garder cette fois ? »';
        if (d.gameOvers > 0)    return 'Jade : « Je t\'ai vu mourir. ' + d.gameOvers + ' fois. J\'ai compté. »';
        return 'Jade : « Encore une partie ' + (name ? name + ' ' : '') + '? Je n\'oublie jamais un visiteur. »';
    };

    //------------------------------------------------------------------------
    // HOOKS DE COMPTAGE
    //------------------------------------------------------------------------
    var _setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        _setupNewGame.call(this);
        JadeMemoire.inc('runs', 1);
        try {
            var name = ($gameParty && $gameParty.leader && $gameParty.leader()) ? $gameParty.leader().name() : '';
            if (name) { data().lastName = name; JadeMemoire.save(); }
        } catch (e) {}
        if (RUNS_VAR > 0 && $gameVariables) $gameVariables.setValue(RUNS_VAR, JadeMemoire.runs());
    };

    if (typeof Scene_Gameover !== 'undefined') {
        var _goStart = Scene_Gameover.prototype.start;
        Scene_Gameover.prototype.start = function () {
            _goStart.call(this);
            JadeMemoire.inc('gameOvers', 1);
        };
    }

    // Capture le prénom dès qu'une carte se charge (au cas où il change)
    var _onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        _onMapLoaded.call(this);
        try {
            var leader = $gameParty.leader();
            if (leader && leader.name() && data().lastName !== leader.name()) {
                data().lastName = leader.name();
                JadeMemoire.save();
            }
        } catch (e) {}
    };

    //------------------------------------------------------------------------
    // BOSS FINAL <JadeMemoire> : stats renforcées + paroles du passé
    //------------------------------------------------------------------------
    function hasMemTag(b) {
        return b && b.isEnemy && b.isEnemy() && b.enemy() && b.enemy().meta && b.enemy().meta.JadeMemoire;
    }

    var _enemyParam = Game_Enemy.prototype.param;
    Game_Enemy.prototype.param = function (paramId) {
        var base = _enemyParam.call(this, paramId);
        if (hasMemTag(this)) base = Math.floor(base * JadeMemoire.bossMult());
        return base;
    };

    var _startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _startBattle.call(this);
        var hasBoss = $gameTroop && $gameTroop.members().some(hasMemTag);
        if (!hasBoss) return;
        var w = BattleManager._logWindow;
        function say(t) { if (w) { w.push('addText', t); w.push('wait'); } }
        var kills = JadeMemoire.timesDefeated();
        if (kills > 0) {
            say('\\C[18]Jade : « ' + kills + ' morts. Je porte chacune d\'elles. »\\C[0]');
            say('\\C[18]Jade : « Tu m\'as appris à te haïr. Merci. »\\C[0]');
            say('\\C[2]★ Jade est plus FORTE — elle se souvient de toi. (+' +
                Math.round((JadeMemoire.bossMult() - 1) * 100) + '%)\\C[0]');
        } else if (JadeMemoire.runs() > 1) {
            say('\\C[18]Jade : « On se connaît, n\'est-ce pas ? Je sens ton odeur dans le code. »\\C[0]');
        }
    };

    //------------------------------------------------------------------------
    // COMMANDES DE PLUGIN
    //------------------------------------------------------------------------
    var _pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pluginCommand.call(this, command, args);
        if (String(command).toUpperCase() !== 'MEMOIRE') return;
        var sub = (args[0] || '').toLowerCase();
        switch (sub) {
            case 'greet':
                var g = JadeMemoire.greeting();
                if (g) $gameMessage.add(g);
                break;
            case 'record_ending':
                JadeMemoire.recordEnding(parseInt(args[1], 10) || 0);
                break;
            case 'defeat_jade':
                JadeMemoire.recordDefeatJade();
                break;
            case 'flag':
                if (args[1]) JadeMemoire.setFlag(args[1]);
                break;
            case 'store_runs':
                if (args[1] && $gameVariables) $gameVariables.setValue(parseInt(args[1], 10), JadeMemoire.runs());
                break;
            case 'store_kills':
                if (args[1] && $gameVariables) $gameVariables.setValue(parseInt(args[1], 10), JadeMemoire.timesDefeated());
                break;
            case 'forget':
                JadeMemoire.forget();
                break;
        }
    };

    // Charge la mémoire au lancement
    JadeMemoire.load();

})();
