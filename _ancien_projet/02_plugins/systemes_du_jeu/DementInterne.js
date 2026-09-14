//=============================================================================
// DementInterne.js — v1.0 · « Il croit rester » : le complément du Dément
// RPG Maker MV · by JOKO / Claude · charger APRÈS Codex_Chutes, TheatreDement,
//  ChutesHallucinations. Ajoute les 2 pièces manquantes du design Dément :
//   ① les COMBATS-HALLUCINATIONS (« Il n'y avait rien »)
//   ② le Dément tombé qui PARLE avec vos mots + son Verbe tordu « Viens »
//=============================================================================
/*:
 * @plugindesc [v1.0] Complète le Dément : combats-hallucinations sans butin ni
 * corps (« Il n'y avait rien »), et le Dément tombé qui parle avec les répliques
 * du groupe et tord son Verbe (« Viens » attire un allié dans sa ligne).
 * @author JOKO / Claude
 *
 * @param autoHalluc
 * @text Combats-hallucinations auto (%)
 * @type number
 * @min 0
 * @max 100
 * @default 25
 * @desc À phase mentale 1 (Effondrement), chance par pas de déclencher un faux combat.
 *
 * @param pasMin
 * @text Pas entre deux hallucinations
 * @type number
 * @default 35
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE DÉMENT, DE L'INTÉRIEUR — les 2 pièces qui manquaient
 * ═══════════════════════════════════════════════════════════════════════════
 *  Le reste du Dément est déjà géré ailleurs : « il croit rester », frappe le
 *  vide, PNJ qui l'ignorent, trahison après 3 combats, faux Game Over, tombé qui
 *  copie vos skills et lit vos Reprises → Codex_Chutes. PV/menus qui mentent →
 *  TheatreDement. Distorsion & 4e mur → LeMur. Ce plugin ajoute le reste.
 *
 *  ① COMBATS-HALLUCINATIONS — à phase mentale 1, un ennemi surgit… on le bat…
 *     et il ne reste NI butin, NI corps, NI expérience : « Il n'y avait rien. »
 *     Le doute total : ce combat a-t-il seulement eu lieu ? Auto (rare) ou par
 *     commande. Le vrai groupe ne risque rien (dégâts réels, mais gains annulés).
 *
 *  ② LE DÉMENT TOMBÉ (ennemis notés <DementTombe>) :
 *     • il PARLE avec les répliques du groupe, recyclées de travers ;
 *     • son Verbe se tord : « Viens. » attire un allié au hasard dans sa ligne
 *       (il cible cet allié à son prochain coup).
 *
 *  COMMANDES :
 *      HALLUCO [troopId]     déclenche un combat-hallucination (troupe de la
 *                            carte si omis). Aucune récompense au bout.
 *      DEMENTINT off/on
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('DementInterne');
    var AUTO = parseInt(P['autoHalluc'] || 25);
    var PAS_MIN = parseInt(P['pasMin'] || 35);

    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }
    function leader() { return $gameParty && $gameParty.leader(); }
    function phaseChef() { var l = leader(); return l ? phase(l.actorId()) : 5; }
    function actif() { return !($gameSystem && $gameSystem._dementIntOff); }
    function wlog(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }

    //=========================================================================
    // ① COMBATS-HALLUCINATIONS
    //=========================================================================
    function troupeCarte() {
        try {
            var list = $gameMap.encounterList();
            if (list && list.length) {
                var c = list.filter(function (x) { return x && x.troopId > 0; });
                if (c.length) return c[Math.floor(Math.random() * c.length)].troopId;
            }
        } catch (e) {}
        return 0;
    }
    function lancerHalluc(troopId) {
        troopId = troopId || troupeCarte();
        if (!troopId) return false;
        if (SceneManager.isSceneChanging() || $gameMessage.isBusy() || !$gamePlayer.canMove()) return false;
        $gameSystem._halluCombat = true;
        BattleManager.setup(troopId, true, false);
        $gamePlayer.makeEncounterCount();
        try { AudioManager.playSe({ name: 'Darkness2', volume: 50, pitch: 80, pan: 0 }); } catch (e) {}
        SceneManager.push(Scene_Battle);
        return true;
    }
    // intro discrète
    var _startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _startBattle.call(this);
        if ($gameSystem && $gameSystem._halluCombat) wlog('\\C[8]Quelque chose est là. …n\'est-ce pas ?\\C[0]');
    };
    // victoire : aucun gain, et le doute
    var _makeRewards = BattleManager.makeRewards;
    BattleManager.makeRewards = function () {
        _makeRewards.call(this);
        if ($gameSystem && $gameSystem._halluCombat) {
            this._rewards.gold = 0; this._rewards.exp = 0; this._rewards.items = [];
        }
    };
    var _displayRewards = BattleManager.displayRewards;
    BattleManager.displayRewards = function () {
        if ($gameSystem && $gameSystem._halluCombat) {
            $gameMessage.add('\\C[8]…il ne reste rien.\\C[0]');
            $gameMessage.add('\\C[8]Ni corps, ni butin. Il n\'y avait rien.\\C[0]');
            return;
        }
        _displayRewards.call(this);
    };
    var _endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (r) { $gameSystem && ($gameSystem._halluCombat = false); _endBattle.call(this, r); };

    // auto à phase 1 (Effondrement)
    var _incSteps = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function () {
        _incSteps.call(this);
        try {
            if (!actif() || AUTO <= 0 || phaseChef() > 1) { $gameSystem._halluPas = 0; return; }
            if (!$gamePlayer.canMove() || $gameMap.isEventRunning()) return;
            $gameSystem._halluPas = ($gameSystem._halluPas || 0) + 1;
            if ($gameSystem._halluPas < PAS_MIN) return;
            if (Math.random() < AUTO / 100) { $gameSystem._halluPas = 0; lancerHalluc(0); }
        } catch (e) {}
    };

    //=========================================================================
    // ② LE DÉMENT TOMBÉ : vos mots, et le Verbe tordu « Viens »
    //=========================================================================
    var REPLIQUES = [
        'Reste avec nous. On y est presque.', 'Fais-moi confiance, comme avant.',
        'Tu te souviens ? On avait promis.', 'Ce n\'est pas grave. Je te pardonne.',
        'Encore un pas. Juste un.', 'Je savais que tu viendrais.'
    ];
    function estDementTombe(enemy) {
        var e = enemy && enemy.enemy && enemy.enemy();
        return !!(e && e.meta && e.meta.DementTombe !== undefined);
    }
    var _makeActions = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function () {
        _makeActions.call(this);
        try {
            if (!estDementTombe(this) || this.numActions() <= 0) return;
            var r = Math.random();
            if (r < 0.35) {
                // le Verbe tordu : « Viens » attire un allié dans sa ligne
                var vivants = $gameParty.aliveMembers();
                if (vivants.length) {
                    var cible = vivants[Math.floor(Math.random() * vivants.length)];
                    this.action(0).setAttack();
                    this.action(0).setTarget(cible.index());
                    wlog('\\C[18]« Viens. »\\C[0]');
                    wlog('\\C[8]' + cible.name() + ' fait un pas — sans savoir pourquoi.\\C[0]');
                }
            } else if (r < 0.6) {
                // il parle avec vos mots
                wlog('\\C[8]' + REPLIQUES[Math.floor(Math.random() * REPLIQUES.length)] + '\\C[0]');
            }
        } catch (e) {}
    };

    //=========================================================================
    // Commandes
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        var C = String(cmd).toUpperCase();
        if (C === 'HALLUCO') lancerHalluc(parseInt(args[0]) || 0);
        else if (C === 'DEMENTINT') {
            var sub = (args[0] || '').toLowerCase();
            if (sub === 'off') { if ($gameSystem) $gameSystem._dementIntOff = true; }
            else if (sub === 'on') { if ($gameSystem) $gameSystem._dementIntOff = false; }
        }
    };
})();
