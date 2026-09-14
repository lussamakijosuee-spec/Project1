//=============================================================================
// MueMaitrisee.js — v1.0 · Chevaucher la Bête (l'apex du Corps)
// RPG Maker MV · by JOKO / Claude · charger APRÈS CorruptionAme, Codex_Chutes.
//  Déclenché par COMPÉTENCE (notetags) → robuste avec YEP_BattleEngineCore.
//=============================================================================
/*:
 * @plugindesc [v1.0] Maîtriser la Mue : transforme-toi en Bête à volonté en
 * combat — puissance décuplée, mais un compteur de contrôle descend. À zéro,
 * la Bête prend le dessus (elle frappe tes alliés). Doser, s'arrêter à temps.
 * @author JOKO / Claude
 *
 * @param seuil
 * @text Corruption minimale
 * @type number
 * @min 0
 * @max 100
 * @default 40
 * @desc Corruption requise pour déclencher la Mue (défaut 40 = Frémissement).
 *
 * @param toursBase
 * @text Contrôle de base (tours)
 * @type number
 * @min 1
 * @default 3
 * @desc Nombre de tours de contrôle. +1 par tranche de 20 de corruption au-delà du seuil.
 *
 * @param boostAtk
 * @text Bonus ATK/AGI (%)
 * @type number
 * @default 60
 * @desc Bonus de force et vitesse pendant la Mue (défaut +60 %).
 *
 * @param degatsBonus
 * @text Dégâts infligés (%)
 * @type number
 * @default 40
 * @desc Bonus de dégâts infligés pendant la Mue (défaut +40 %).
 *
 * @param regen
 * @text Régénération / tour (%)
 * @type number
 * @default 8
 * @desc PV régénérés en début de tour pendant la Mue (% des PV max).
 *
 * @param coutCorruption
 * @text Corruption / tour de Mue
 * @type number
 * @default 4
 * @desc Corruption gagnée à chaque tour passé transformé (le sang monte).
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA MUE MAÎTRISÉE — « non pas subir la Mue, mais la commander »
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'apex du Corps (Kevératus) : déclencher la Bête, la doser, l'arrêter, et
 *  ressortir humain. Un risque-récompense grisant.
 *
 *  ▶ INSTALLER — sur des COMPÉTENCES (base de données) :
 *      <Mue>        skill « Déchaîner » : transforme le lanceur (scope : soi).
 *                   Grisée si sa corruption < seuil.
 *      <MueFin>     skill « Reprendre forme » : revient humain immédiatement,
 *                   tant que le contrôle tient (scope : soi).
 *      <MueSkill>   (option) marque une compétence BESTIALE utilisable
 *                   seulement pendant la Mue (sinon grisée).
 *
 *  ▶ PENDANT LA MUE :
 *      • +ATK/+AGI, +dégâts infligés, régénération en début de tour.
 *      • un COMPTEUR DE CONTRÔLE descend de 1 à chaque tour du héros.
 *      • la corruption monte (le sang réclame plus).
 *      • « Reprendre forme » (<MueFin>) pour ressortir humain à temps.
 *
 *  ▶ À CONTRÔLE ZÉRO — la Bête prend le dessus pour le RESTE du combat :
 *      le héros agit seul, frappe la cible la plus proche (alliée comprise).
 *      Elle se calme à la fin du combat (pas de perte définitive : c'est une
 *      Mue maîtrisée qui a dérapé, pas la Chute).
 *
 *  COMMANDES :
 *      MUE forcer <actorId>     transforme (mise en scène)
 *      MUE fin <actorId>        revient humain
 *  SCRIPT :
 *      Mue.actif(actorId) → bool · Mue.controle(actorId) → tours restants
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('MueMaitrisee');
    var SEUIL = parseInt(P['seuil'] || 40);
    var TOURS = parseInt(P['toursBase'] || 3);
    var BOOST = parseInt(P['boostAtk'] || 60) / 100;
    var DEG = parseInt(P['degatsBonus'] || 40) / 100;
    var REGEN = parseInt(P['regen'] || 8) / 100;
    var COUT = parseInt(P['coutCorruption'] || 4);

    function corr(id) { try { return window.Corruption ? Corruption.niveau(id) : 100; } catch (e) { return 100; } }
    function addCorr(id, n) { try { if (window.Corruption) Corruption.add(id, n); } catch (e) {} }
    function wlog(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }

    var Mue = {
        actif: function (id) { var a = $gameActors && $gameActors.actor(id); return !!(a && a._mueActif); },
        controle: function (id) { var a = $gameActors && $gameActors.actor(id); return a && a._mueActif ? a._mueControle : 0; }
    };
    window.Mue = Mue;

    //--- Transformation ---------------------------------------------------------
    function toursDe(id) { return TOURS + Math.floor(Math.max(0, corr(id) - SEUIL) / 20); }

    function transformer(actor) {
        if (!actor || actor._mueActif) return false;
        actor._mueActif = true;
        actor._mueBerserk = false;
        actor._mueControle = toursDe(actor.actorId());
        actor.refresh();
        try { AudioManager.playSe({ name: 'Blow3', volume: 90, pitch: 70, pan: 0 }); } catch (e) {}
        if ($gameParty.inBattle()) {
            $gameScreen.startFlash([180, 20, 20, 160], 40);
            wlog('\\C[2]' + actor.name() + ' déchaîne la Mue. Le sang répond.\\C[0]');
            wlog('\\C[8]Contrôle : ' + actor._mueControle + ' tours.\\C[0]');
        }
        return true;
    }
    function revenir(actor, force) {
        if (!actor || !actor._mueActif) return;
        if (actor._mueBerserk && !force) return; // trop tard : la Bête tient
        actor._mueActif = false; actor._mueBerserk = false; actor._mueControle = 0;
        actor.refresh();
        if ($gameParty.inBattle()) wlog('\\C[23]' + actor.name() + ' reprend forme. Humain — de justesse.\\C[0]');
    }
    function basculerBerserk(actor) {
        actor._mueBerserk = true;
        try { AudioManager.playSe({ name: 'Collapse3', volume: 90, pitch: 60, pan: 0 }); } catch (e) {}
        $gameScreen.startFlash([220, 0, 0, 200], 50);
        wlog('\\C[2]Le contrôle lâche. La Bête prend ' + actor.name() + '.\\C[0]');
        wlog('\\C[8]Plus personne ne la commande.\\C[0]');
    }

    //--- Stats pendant la Mue ---------------------------------------------------
    var _paramRate = Game_Battler.prototype.paramRate;
    Game_Battler.prototype.paramRate = function (paramId) {
        var r = _paramRate.call(this, paramId);
        if (this._mueActif && (paramId === 2 || paramId === 6)) r *= (1 + BOOST); // ATK, AGI
        return r;
    };
    // dégâts infligés +
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _mdv.call(this, target, critical);
        var s = this.subject();
        if (v > 0 && s && s.isActor && s.isActor() && s._mueActif) v = Math.floor(v * (1 + DEG));
        return v;
    };

    //--- Compétences : <Mue> <MueFin> <MueSkill> --------------------------------
    var _aiue = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function (target) {
        _aiue.call(this, target);
        var it = this.item(), s = this.subject();
        if (!it || !it.meta) return;
        if (it.meta.Mue !== undefined && s && s.isActor && s.isActor()) transformer(s);
        else if (it.meta.MueFin !== undefined && s && s.isActor && s.isActor()) revenir(s, true);
    };
    // conditions : <Mue> grisée sous le seuil ; <MueSkill> hors Mue ; <MueFin> hors Mue
    var _meets = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if (!_meets.call(this, skill)) return false;
        if (!skill || !skill.meta) return true;
        if (!(this.isActor && this.isActor())) return true;
        var id = this.actorId();
        if (skill.meta.Mue !== undefined && (this._mueActif || corr(id) < SEUIL)) return false;
        if (skill.meta.MueFin !== undefined && !this._mueActif) return false;
        if (skill.meta.MueSkill !== undefined && !this._mueActif) return false;
        return true;
    };

    //--- Berserk : la Bête agit seule -------------------------------------------
    var _makeActions = Game_Actor.prototype.makeActions;
    Game_Actor.prototype.makeActions = function () {
        _makeActions.call(this);
        if (this._mueActif && this._mueBerserk && this.numActions() > 0) {
            var cibles = [];
            $gameParty.aliveMembers().forEach(function (m) { if (m !== this) cibles.push(['party', m]); }, this);
            $gameTroop.aliveMembers().forEach(function (m) { cibles.push(['troop', m]); });
            if (cibles.length) {
                var pick = cibles[Math.floor(Math.random() * cibles.length)];
                this.action(0).setAttack();
                this.action(0).setTarget(pick[1].index());
                if (pick[0] === 'party') this.action(0)._forceFriend = true;
                wlog('\\C[2]' + this.name() + ' frappe ce qui bouge.\\C[0]');
            }
        }
    };
    // permettre à l'attaque berserk de viser un allié
    var _targetsForOpponents = Game_Action.prototype.targetsForOpponents;
    Game_Action.prototype.targetsForOpponents = function () {
        if (this._forceFriend) {
            var u = this.friendsUnit(); var t = u.members()[this._targetIndex];
            return t ? [t] : [];
        }
        return _targetsForOpponents.call(this);
    };

    //--- Décompte du contrôle + régénération, au tour du héros ------------------
    var _onTurnEnd = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function () {
        _onTurnEnd.call(this);
        if (this.isActor && this.isActor() && this._mueActif && !this._mueBerserk) {
            addCorr(this.actorId(), COUT);
            this._mueControle--;
            if (this._mueControle <= 0) basculerBerserk(this);
            else if (this._mueControle <= 1) wlog('\\C[8]Le contrôle de ' + this.name() + ' vacille… (1 tour)\\C[0]');
        }
    };
    var _onTurnStart = Game_Battler.prototype.onTurnStart;
    if (_onTurnStart) {
        Game_Battler.prototype.onTurnStart = function () {
            _onTurnStart.call(this);
            if (this._mueActif && this.isAlive() && REGEN > 0) this.gainHp(Math.floor(this.mhp * REGEN));
        };
    }
    // repli si onTurnStart n'existe pas : régén au début d'action
    var _onAllActionsEnd = Game_Battler.prototype.onAllActionsEnd;

    //--- Nettoyage en fin de combat ---------------------------------------------
    var _endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        $gameParty.members().forEach(function (a) { if (a._mueActif) { a._mueActif = false; a._mueBerserk = false; a._mueControle = 0; a.refresh(); } });
        _endBattle.call(this, result);
    };

    //--- Visuel : rougeoiement pendant la Mue -----------------------------------
    if (typeof Sprite_Actor !== 'undefined') {
        var _upd = Sprite_Actor.prototype.update;
        Sprite_Actor.prototype.update = function () {
            _upd.call(this);
            try {
                if (this._actor && this._actor._mueActif) {
                    this._mueT = (this._mueT || 0) + (this._actor._mueBerserk ? 0.18 : 0.09);
                    var base = this._actor._mueBerserk ? 200 : 120;
                    this.setBlendColor([base, 20, 20, Math.floor(60 + 50 * Math.abs(Math.sin(this._mueT)))]);
                } else if (this._mueT) { this.setBlendColor([0, 0, 0, 0]); this._mueT = 0; }
            } catch (e) {}
        };
    }

    //--- Commandes --------------------------------------------------------------
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'MUE') return;
        var sub = (args[0] || '').toLowerCase(), a = $gameActors.actor(parseInt(args[1]) || 1);
        if (sub === 'forcer') transformer(a);
        else if (sub === 'fin') revenir(a, true);
    };
})();
