//=============================================================================
// PlongerLac.js — v1.0 · La lucidité que l'on commande (l'apex de l'Esprit)
// RPG Maker MV · by JOKO / Claude · charger APRÈS JadeEntitePlunging, LeRegard.
//=============================================================================
/*:
 * @plugindesc [v1.0] Plonge volontairement dans le Lac : descends d'un palier de
 * lucidité pour VOIR ce qui est caché (passages, ennemis, vérités) — mais chaque
 * plongée te rapproche du Dément. Le miroir de la Mue, pour l'Esprit.
 * @author JOKO / Claude
 *
 * @param touche
 * @text Touche « Plonger »
 * @type string
 * @default f
 * @desc Touche clavier qui plonge / remonte (défaut : f).
 *
 * @param switchLucide
 * @text Interrupteur « Lucide » (révélation)
 * @type switch
 * @default 0
 * @desc Mis à ON pendant la plongée. Câble tes passages/ennemis cachés dessus.
 *
 * @param pasLucide
 * @text Durée de la plongée (pas)
 * @type number
 * @default 30
 * @desc Nombre de pas où tu restes lucide avant de remonter tout seul.
 *
 * @param coutSAN
 * @text Coût en santé mentale
 * @type number
 * @default 1
 * @desc Points de santé mentale perdus à chaque plongée (on n'en remonte pas indemne).
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  PLONGER DANS LE LAC — « chaque palier donne plus de pouvoir, on n'en
 *  remonte pas indemne »
 * ═══════════════════════════════════════════════════════════════════════════
 *  La perception est un lac. Le manieur de l'Esprit peut y PLONGER à volonté :
 *  il voit alors ce que les autres ne voient pas — mais il paie en raison, et
 *  chaque plongée le rapproche du Dément. C'est l'équivalent, pour l'Esprit, de
 *  la Mue Maîtrisée pour le Corps : un risque-récompense que TU commandes.
 *
 *  ▶ PLONGER — touche F (ou commande PLONGER). Le chef descend d'un palier :
 *      • l'interrupteur « Lucide » passe ON (branche dessus tes passages
 *        secrets, ennemis invisibles, coffres cachés, dialogues du Regard…) ;
 *      • les événements notés <Cache> DEVIENNENT VISIBLES le temps de la plongée ;
 *      • le monde prend la teinte du Voile ;
 *      • tu perds un peu de santé mentale (Loi de la Noyade).
 *  ▶ REMONTER — automatique après N pas, ou touche F / commande REMONTER. La
 *    santé mentale NE revient PAS : descendre coûte pour de bon.
 *  ▶ DANGER — plonger alors que ton esprit est déjà bas peut te faire toucher le
 *    Fond (phase 1 = le Dément). À doser.
 *
 *  COMMANDES : PLONGER · REMONTER · PLONGER off/on
 *  SCRIPT :  PlongerLac.lucide() → bool · PlongerLac.palier() → 0..4
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('PlongerLac');
    var TOUCHE = String(P['touche'] || 'f').toLowerCase();
    var SW = parseInt(P['switchLucide'] || 0);
    var PAS = parseInt(P['pasLucide'] || 30);
    var COUT = parseInt(P['coutSAN'] || 1);

    var PALIERS = ['la Surface', 'le Voile', 'la Trame', 'le Mur', 'le Fond'];

    function jauge(id) { try { return window.Ame ? (Ame.jauge(id) || 7) : 7; } catch (e) { return 7; } }
    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }
    function malAme(id, n) { try { if (window.Ame) Ame.mauvais(id, n); } catch (e) {} }
    function leader() { return $gameParty && $gameParty.leader(); }
    function profondeur() { var l = leader(); return l ? Math.max(0, Math.min(4, 5 - phase(l.actorId()))) : 0; }

    var PlongerLac = {
        lucide: function () { return !!($gameSystem && $gameSystem._lucide); },
        palier: function () { return profondeur(); }
    };
    window.PlongerLac = PlongerLac;

    function setSwitch(v) { if (SW > 0) $gameSwitches.setValue(SW, v); }
    function actif() { return !($gameSystem && $gameSystem._plongerOff); }

    function plonger() {
        if (!leader() || PlongerLac.lucide()) return;
        if ($gameMessage.isBusy() || !$gamePlayer.canMove()) return;
        $gameSystem._lucide = true;
        $gameSystem._lucidePas = PAS;
        setSwitch(true);
        malAme(leader().actorId(), COUT);
        try { AudioManager.playSe({ name: 'Water1', volume: 60, pitch: 70, pan: 0 }); } catch (e) {}
        $gameScreen.startTint([-30, -20, 20, 60], 30);
        revelerCaches(true);
        var pal = PALIERS[Math.min(4, profondeur())];
        $gameMessage.add('\\C[1]Tu plonges. La perception s\'ouvre — ' + pal + '.\\C[0]');
        if (phase(leader().actorId()) <= 1) $gameMessage.add('\\C[8]Le Fond te regarde. Ne reste pas.\\C[0]');
    }
    function remonter(silencieux) {
        if (!PlongerLac.lucide()) return;
        $gameSystem._lucide = false; $gameSystem._lucidePas = 0;
        setSwitch(false);
        revelerCaches(false);
        $gameScreen.startTint([0, 0, 0, 0], 40);
        if (!silencieux) { try { AudioManager.playSe({ name: 'Water2', volume: 50, pitch: 110, pan: 0 }); } catch (e) {} }
    }

    //--- révéler les événements <Cache> -----------------------------------------
    function estCache(ev) {
        if (ev._cachePg === ev._pageIndex) return ev._cacheFlag;
        ev._cachePg = ev._pageIndex; ev._cacheFlag = false;
        var pg = ev.page && ev.page();
        if (pg) pg.list.forEach(function (c) { if ((c.code === 108 || c.code === 408) && /<Cache>/i.test(c.parameters[0])) ev._cacheFlag = true; });
        return ev._cacheFlag;
    }
    function revelerCaches(on) {
        try { $gameMap.events().forEach(function (ev) { if (estCache(ev)) { ev.setOpacity(on ? 255 : 0); ev.setThrough(!on); } }); } catch (e) {}
    }
    // garder les <Cache> masqués tant qu'on n'est pas lucide (à l'apparition)
    var _evUpdate = Game_Event.prototype.update;
    Game_Event.prototype.update = function () {
        _evUpdate.call(this);
        try {
            if (this._cacheChecked !== this._pageIndex) {
                this._cacheChecked = this._pageIndex;
                if (estCache(this)) { var on = PlongerLac.lucide(); this.setOpacity(on ? 255 : 0); this.setThrough(!on); }
            }
        } catch (e) {}
    };

    //--- remontée auto au fil des pas -------------------------------------------
    var _incSteps = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function () {
        _incSteps.call(this);
        if (PlongerLac.lucide()) {
            $gameSystem._lucidePas--;
            if ($gameSystem._lucidePas <= 0) { remonter(false); $gameMessage.add('\\C[8]Tu remontes à la surface. Le monde se referme.\\C[0]'); }
        }
    };

    //--- touche clavier ---------------------------------------------------------
    var _pressed = false;
    document.addEventListener('keydown', function (e) { if ((e.key || '').toLowerCase() === TOUCHE) _pressed = true; });
    var _sm = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _sm.call(this);
        if (_pressed) {
            _pressed = false;
            if (actif() && !$gameMessage.isBusy() && $gamePlayer.canMove() && !$gameMap.isEventRunning()) {
                if (PlongerLac.lucide()) remonter(false); else plonger();
            }
        }
    };

    //--- commandes --------------------------------------------------------------
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        var C = String(cmd).toUpperCase();
        if (C === 'PLONGER') {
            var sub = (args[0] || '').toLowerCase();
            if (sub === 'off') { if ($gameSystem) $gameSystem._plongerOff = true; }
            else if (sub === 'on') { if ($gameSystem) $gameSystem._plongerOff = false; }
            else plonger();
        } else if (C === 'REMONTER') remonter(false);
    };
})();
