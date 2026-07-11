//=============================================================================
// ChutesBeteErrant.js — v1.0 · La Bête : le contrôle échappe. L'Errant : on
//   l'oublie pendant qu'il est encore là. (miroirs de ChuteDement)
// RPG Maker MV · by JOKO · charger APRÈS CorruptionAme, Errance, ChuteDement.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les 2 autres chutes vécues de l'intérieur : la laisse qui
 * casse (Bête, interrupteur 97) et l'effacement (Errant, interrupteur 96).
 * @author JOKO
 * @param switchBete
 * @text Interrupteur — la Bête lâchée (ton combat)
 * @type switch
 * @default 97
 * @param switchErrant
 * @text Interrupteur — l'Errant effacé (ta suite)
 * @type switch
 * @default 96
 * @help
 *  ▶ BETE chute <id> — la laisse casse : pendant 3 combats le héros est
 *    INCONTRÔLABLE (attaque seul, dégâts ×1.5 — « le bras part tout seul »),
 *    puis il hurle, quitte le groupe, interrupteur 97 → ton combat (matrice).
 *    AVANT : à Corruption ≥ 70, 15 % de chance par tour que son bras parte seul.
 *  ▶ ERRANT chute <id> — l'effacement : pendant 3 combats LES SOINS LE
 *    TRAVERSENT (« il n'est plus tout à fait là »), puis il n'est simplement
 *    PLUS LÀ. Pas d'adieu. Interrupteur 96. Et plus tard, quelqu'un demande :
 *    « …on était combien, déjà ? »
 *  ▶ <BeteTombee> (ennemis) : 20 %/tour, ses yeux redeviennent les siens —
 *    elle hésite et perd son action. L'humanité résiduelle est une mécanique.
 *  ▶ <ErrantTombe> (ennemis) : 25 % de vos coups LE TRAVERSENT.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('ChutesBeteErrant');
    var SWB = parseInt(P['switchBete'] || 97), SWE = parseInt(P['switchErrant'] || 96);
    function jc(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function st(k) { return ($gameSystem && $gameSystem[k]) || null; }
    function wlog(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        var C = String(cmd).toUpperCase(), id = parseInt(args[1]) || 1, a = $gameActors.actor(id);
        if (C === 'BETE' && (args[0] || '') === 'chute' && a) {
            $gameSystem._beteLachee = { id: id, combats: 0 };
            $gameScreen.startFlash([255, 40, 40, 200], 40);
            $gameMessage.add(a.name() + ' tombe à genoux. Quelque chose craque — pas un os.');
            $gameMessage.add('\\C[2]La laisse.\\C[0]');
        }
        if (C === 'ERRANT' && (args[0] || '') === 'chute' && a) {
            $gameSystem._errantEfface = { id: id, combats: 0 };
            $gameScreen.startTint([-40, -40, -40, 40], 60);
            $gameMessage.add(a.name() + ' regarde ses mains. On voit presque au travers.');
        }
    };

    // ── la Bête : incontrôlable (avant : le bras qui part seul à Corr>=70) ──
    var _ma = Game_Actor.prototype.makeActions;
    Game_Actor.prototype.makeActions = function () {
        _ma.call(this);
        try {
            var b = st('_beteLachee');
            var lache = b && b.id === this.actorId();
            if ((lache || (jc(this.actorId()) >= 70 && Math.random() < 0.15)) && this.numActions() > 0) {
                this.action(0).setAttack();
                this.action(0).setTarget(Math.floor(Math.random() * $gameTroop.aliveMembers().length));
                this.setAutoBattle && 0;
                wlog('\\C[2]Le bras de ' + this.name() + ' part tout seul.\\C[0]');
            }
        } catch (e) {}
    };
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (t, c) {
        var v = _mdv.call(this, t, c);
        var b = st('_beteLachee'), s = this.subject();
        if (b && s && s.isActor && s.isActor() && s.actorId() === b.id) return Math.floor(v * 1.5);
        // l'Errant : les soins le traversent
        var e = st('_errantEfface');
        if (e && v < 0 && t && t.isActor && t.isActor() && t.actorId() === e.id) {
            wlog('\\C[8]Le soin traverse ' + t.name() + ' — il n\'est plus tout à fait là.\\C[0]');
            return 0;
        }
        return v;
    };
    // ── fins des 3 combats ──
    var _eb = BattleManager.endBattle;
    BattleManager.endBattle = function (r) {
        _eb.call(this, r);
        var b = st('_beteLachee');
        if (b && ++b.combats >= 3) {
            var a = $gameActors.actor(b.id);
            $gameSystem._beteLachee = null;
            $gameMessage.add('\\C[18]' + a.name() + ' hurle. Ce n\'est plus une voix humaine.\\C[0]');
            $gameParty.removeActor(b.id);
            if (SWB > 0) $gameSwitches.setValue(SWB, true);
        }
        var e = st('_errantEfface');
        if (e && ++e.combats >= 3) {
            var a2 = $gameActors.actor(e.id);
            $gameSystem._errantEfface = null;
            $gameParty.removeActor(e.id);
            if (SWE > 0) $gameSwitches.setValue(SWE, true);
            $gameMessage.add('\\C[8]…on était combien, déjà ?\\C[0]');
        }
    };
    // ── les tombés en face ──
    var _ea = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function () {
        _ea.call(this);
        try {
            var e = this.enemy();
            if (e && e.meta && e.meta.BeteTombee !== undefined && Math.random() < 0.20 && this.numActions() > 0) {
                this.clearActions();
                wlog('\\C[23]Un instant, ses yeux redeviennent les siens. Elle hésite.\\C[0]');
            }
        } catch (er) {}
    };
    var _hit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function (t) {
        if (t && t.isEnemy && t.isEnemy()) {
            var e = t.enemy();
            if (e && e.meta && e.meta.ErrantTombe !== undefined && Math.random() < 0.25) {
                var w = BattleManager._logWindow;
                if (w) w.push('addText', '\\C[8]Le coup le traverse. Il n\'est qu\'à moitié là.\\C[0]');
                return 0;
            }
        }
        return _hit.call(this, t);
    };
})();
