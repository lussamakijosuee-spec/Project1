//=============================================================================
// ContagionAme.js — v1.0 · La Chute se propage (gère ton groupe)
// RPG Maker MV · by JOKO / Claude · charger APRÈS CorruptionAme, Errance.
//=============================================================================
/*:
 * @plugindesc [v1.0] La Chute est contagieuse : un héros enfoncé dans sa
 * corruption/errance tire lentement ses COÉQUIPIERS ACTIFS vers le bas. Mettre
 * le corrompu au banc (formation) stoppe la propagation. Les <Atone> résistent.
 * @author JOKO / Claude
 *
 * @param seuil
 * @text Seuil de contagion
 * @type number
 * @min 0
 * @max 100
 * @default 60
 * @desc Un héros propage sa Chute quand sa jauge dépasse ce seuil.
 *
 * @param taux
 * @text Propagation par cycle
 * @type number
 * @default 1
 * @desc Points de Chute transmis aux coéquipiers actifs à chaque cycle.
 *
 * @param pas
 * @text Pas par cycle
 * @type number
 * @default 25
 * @desc Nombre de pas entre deux cycles de contagion.
 *
 * @param errance
 * @text Contagion de l'Errance aussi
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param enCombat
 * @text Contagion en combat (fin de tour)
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param messages
 * @text Avertir à la propagation
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA CONTAGION DE L'ÂME — la Chute déteint
 * ═══════════════════════════════════════════════════════════════════════════
 *  Rester au contact d'un héros qui sombre n'est pas sans risque : sa Bête, son
 *  Errance déteignent lentement sur ceux qui combattent à ses côtés.
 *
 *  ▶ QUI PROPAGE — un membre ACTIF (dans l'équipe de combat) dont la corruption
 *    ou l'errance dépasse le seuil. Il tire les AUTRES membres actifs vers le
 *    bas (jamais au-dessus de son propre niveau).
 *  ▶ COMMENT S'EN PROTÉGER — le mettre au BANC (formation) : un héros hors de
 *    l'équipe de combat ne propage rien et n'attrape rien. Isoler devient une
 *    vraie décision. Les héros <Atone> (note d'acteur/classe) ne captent que la
 *    moitié — l'âme atone résiste à la contamination.
 *  ▶ QUAND — tous les N pas sur la carte, et (option) en fin de tour au combat.
 *
 *  Ne fait que MONTER des jauges déjà gérées ailleurs : zéro double peine, se
 *  purge par les moyens habituels (Feu d'Âme, Sanctuaire, Pactes…).
 *
 *  COMMANDE :  CONTAGION off / on
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('ContagionAme');
    var SEUIL = parseInt(P['seuil'] || 60);
    var TAUX = parseInt(P['taux'] || 1);
    var PAS = parseInt(P['pas'] || 25);
    var ERR_ON = String(P['errance'] || 'true') === 'true';
    var COMBAT = String(P['enCombat'] || 'true') === 'true';
    var MSG = String(P['messages'] || 'true') === 'true';

    function corrN(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function errN(id)  { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function addCorr(id, n) { try { if (window.Corruption) Corruption.add(id, n); } catch (e) {} }
    function addErr(id, n) { try { if (window.Errance) Errance.add(id, n); } catch (e) {} }
    function actif() { return !($gameSystem && $gameSystem._contagionOff); }

    function estAtone(actor) {
        try {
            var n = (actor.actor() ? actor.actor().note : '') + ' ' + (actor.currentClass() ? actor.currentClass().note : '');
            return /<Atone>/i.test(n);
        } catch (e) { return false; }
    }
    function membresActifs() {
        try { return $gameParty.inBattle() ? $gameParty.battleMembers() : $gameParty.battleMembers(); }
        catch (e) { return $gameParty ? $gameParty.members() : []; }
    }

    // un cycle de contagion sur une jauge donnée
    function propager(getter, adder, nomJauge) {
        var membres = membresActifs();
        if (!membres || membres.length < 2) return null;
        // source = le plus atteint au-dessus du seuil
        var src = null, srcVal = 0;
        membres.forEach(function (m) { var v = getter(m.actorId()); if (v >= SEUIL && v > srcVal) { srcVal = v; src = m; } });
        if (!src) return null;
        var infectes = [];
        membres.forEach(function (m) {
            if (m === src) return;
            var cur = getter(m.actorId());
            if (cur >= srcVal) return;                 // pas au-dessus de la source
            var q = estAtone(m) ? Math.max(1, Math.floor(TAUX / 2)) : TAUX;
            adder(m.actorId(), q);
            infectes.push(m.name());
        });
        return infectes.length ? { src: src.name(), infectes: infectes, jauge: nomJauge } : null;
    }

    function cycle() {
        if (!actif()) return;
        var r1 = propager(corrN, addCorr, 'la Bête');
        var r2 = ERR_ON ? propager(errN, addErr, 'l\'Errance') : null;
        if (MSG && (r1 || r2) && Math.random() < 0.5) {
            var r = r1 || r2;
            var txt = '\\C[8]' + r.jauge + ' de ' + r.src + ' déteint sur ' + r.infectes.slice(0, 2).join(', ') + '…\\C[0]';
            if ($gameParty.inBattle()) { var w = BattleManager._logWindow; if (w) { w.push('addText', txt); w.push('wait'); } }
            else if (!$gameMessage.isBusy()) $gameMessage.add(txt);
        }
    }

    //--- carte : tous les N pas -------------------------------------------------
    var _incSteps = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function () {
        _incSteps.call(this);
        if (this.steps() % PAS === 0) { try { cycle(); } catch (e) {} }
    };

    //--- combat : fin de tour ---------------------------------------------------
    if (COMBAT) {
        var _endTurn = BattleManager.endTurn;
        BattleManager.endTurn = function () {
            try { cycle(); } catch (e) {}
            _endTurn.call(this);
        };
    }

    //--- commande ---------------------------------------------------------------
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'CONTAGION') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'off') { if ($gameSystem) $gameSystem._contagionOff = true; }
        else if (sub === 'on') { if ($gameSystem) $gameSystem._contagionOff = false; }
    };
})();
