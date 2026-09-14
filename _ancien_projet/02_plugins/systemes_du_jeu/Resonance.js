//=============================================================================
// Resonance.js — v1.0 · Deux âmes accordées (l'opération du Symbole)
// RPG Maker MV · by JOKO / Claude · charger APRÈS LiensSocial, Errance,
//  CorruptionAme, JadeEntitePlunging. Déclenché par COMPÉTENCE (notetags).
//=============================================================================
/*:
 * @plugindesc [v1.0] La Résonance : deux héros à Lien élevé se synchronisent en
 * combat — aura commune, PV partagés, une ultime duo. Mais près d'une Chute,
 * elle est instable et peut se briser en backlash.
 * @author JOKO / Claude
 *
 * @param seuilLien
 * @text Lien minimum
 * @type number
 * @min 1
 * @default 5
 * @desc Niveau de Lien requis, pour les DEUX héros, afin de résonner.
 *
 * @param aura
 * @text Aura (%)
 * @type number
 * @default 20
 * @desc Bonus ATK/DEF/MAT/MDF pour les deux résonants (défaut +20 %).
 *
 * @param partage
 * @text Dégâts partagés (%)
 * @type number
 * @min 0
 * @max 90
 * @default 35
 * @desc Part des dégâts subis par l'un qui est absorbée par l'autre.
 *
 * @param backlash
 * @text Backlash de rupture (% PV max)
 * @type number
 * @default 15
 * @desc Dégâts aux deux quand la résonance se brise près d'une Chute.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA RÉSONANCE — « chacun devient l'arme et l'armure de l'autre »
 * ═══════════════════════════════════════════════════════════════════════════
 *  Deux âmes peuvent se synchroniser : leurs manas s'accordent, leur puissance
 *  se décuple. Mais la moindre discorde la rompt — et la rupture se paie.
 *
 *  ▶ INSTALLER — sur des COMPÉTENCES :
 *      <Resonance>      skill « Résonner » (scope : un allié). Lie le lanceur
 *                       et sa cible s'ils ont TOUS DEUX Lien ≥ seuil.
 *      <ResonanceUlt>   ultime duo, utilisable SEULEMENT en résonance (sinon
 *                       grisée). À toi de la rendre puissante en base.
 *      <ResonanceFin>   (option) skill « Rompre » : arrête la résonance net.
 *
 *  ▶ EN RÉSONANCE (une paire à la fois) :
 *      • AURA : +stats aux deux.
 *      • PV PARTAGÉS : les dégâts subis par l'un sont en partie encaissés par
 *        l'autre (chacun devient l'armure de l'autre).
 *      • ULTIME DUO débloquée (<ResonanceUlt>).
 *
 *  ▶ INSTABILITÉ — à la fin de chaque tour, si l'un des deux est près d'une
 *    Chute (Corruption/Errance hautes ou santé mentale basse), la résonance
 *    risque de SE BRISER : les deux subissent un backlash et perdent l'aura.
 *    Deux âmes qui se défont ne peuvent plus s'accorder.
 *
 *  Fin : rupture, mort d'un partenaire, ou fin du combat.
 *  Script : Resonance.actif() → bool · Resonance.paire() → [idA,idB]|null
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('Resonance');
    var SEUIL = parseInt(P['seuilLien'] || 5);
    var AURA = parseInt(P['aura'] || 20) / 100;
    var PART = parseInt(P['partage'] || 35) / 100;
    var BACK = parseInt(P['backlash'] || 15) / 100;

    function lien(id) { try { return window.Lien ? Lien.niveau(id) : 0; } catch (e) { return 0; } }
    function corrN(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function errN(id)  { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }
    function wlog(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }

    function paire() { return ($gameSystem && $gameSystem._resonance) || null; }
    function estResonant(battler) {
        if (!battler || !battler.isActor || !battler.isActor()) return false;
        var p = paire(); return !!(p && (p.a === battler.actorId() || p.b === battler.actorId()));
    }
    function partenaireDe(battler) {
        var p = paire(); if (!p || !battler.isActor || !battler.isActor()) return null;
        var id = battler.actorId();
        var autre = p.a === id ? p.b : (p.b === id ? p.a : 0);
        return autre ? $gameActors.actor(autre) : null;
    }
    // pression de Chute d'un héros (0..1)
    function pression(id) {
        return Math.max(corrN(id) / 100, errN(id) / 100, (3 - phase(id)) / 2);
    }

    window.Resonance = {
        actif: function () { return !!paire(); },
        paire: function () { var p = paire(); return p ? [p.a, p.b] : null; }
    };

    //--- Nouer / rompre ---------------------------------------------------------
    function nouer(user, cible) {
        if (!user || !cible || user === cible) return;
        var ia = user.actorId(), ib = cible.actorId();
        if (lien(ia) < SEUIL || lien(ib) < SEUIL) {
            wlog('\\C[2]Les âmes de ' + user.name() + ' et ' + cible.name() + ' ne s\'accordent pas — leur Lien est trop faible.\\C[0]');
            return;
        }
        $gameSystem._resonance = { a: ia, b: ib };
        user.refresh(); cible.refresh();
        try { AudioManager.playSe({ name: 'Saint5', volume: 85, pitch: 110, pan: 0 }); } catch (e) {}
        $gameScreen.startFlash([180, 230, 255, 150], 40);
        wlog('\\C[23]' + user.name() + ' et ' + cible.name() + ' RÉSONNENT. Chacun l\'arme et l\'armure de l\'autre.\\C[0]');
    }
    function rompre(backlash) {
        var p = paire(); if (!p) return;
        var A = $gameActors.actor(p.a), B = $gameActors.actor(p.b);
        $gameSystem._resonance = null;
        if (A) A.refresh(); if (B) B.refresh();
        if (backlash) {
            [A, B].forEach(function (m) { if (m && m.isAlive()) { m.gainHp(-Math.floor(m.mhp * BACK)); m.startDamagePopup && m.startDamagePopup(); } });
            try { AudioManager.playSe({ name: 'Ice5', volume: 80, pitch: 90, pan: 0 }); } catch (e) {}
            wlog('\\C[2]La résonance SE BRISE — la discorde revient dans leur chair.\\C[0]');
        } else {
            wlog('\\C[8]La résonance se dénoue.\\C[0]');
        }
    }

    //--- Aura : +stats aux deux -------------------------------------------------
    var _paramRate = Game_Battler.prototype.paramRate;
    Game_Battler.prototype.paramRate = function (paramId) {
        var r = _paramRate.call(this, paramId);
        if (estResonant(this) && paramId >= 2 && paramId <= 5) r *= (1 + AURA);
        return r;
    };

    //--- PV partagés : l'autre encaisse une part --------------------------------
    var _execDmg = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        try {
            if (value > 0 && estResonant(target) && PART > 0) {
                var partner = partenaireDe(target);
                if (partner && partner.isAlive() && partner !== target) {
                    var part = Math.floor(value * PART);
                    if (part > 0) {
                        value -= part;
                        partner.gainHp(-part);
                        if (partner._result) { partner._result.hpAffected = true; partner._result.hpDamage = part; }
                        partner.startDamagePopup && partner.startDamagePopup();
                        wlog('\\C[23]' + partner.name() + ' encaisse pour ' + target.name() + '. (' + part + ')\\C[0]');
                    }
                }
            }
        } catch (e) {}
        _execDmg.call(this, target, value);
    };

    //--- Compétences : <Resonance> <ResonanceUlt> <ResonanceFin> ----------------
    var _aiue = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function (target) {
        _aiue.call(this, target);
        var it = this.item(), s = this.subject();
        if (!it || !it.meta || !s || !s.isActor || !s.isActor()) return;
        if (it.meta.Resonance !== undefined && target && target.isActor && target.isActor()) nouer(s, target);
        else if (it.meta.ResonanceFin !== undefined) rompre(false);
    };
    var _meets = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if (!_meets.call(this, skill)) return false;
        if (skill && skill.meta && skill.meta.ResonanceUlt !== undefined) {
            if (!estResonant(this)) return false;
        }
        return true;
    };

    //--- Instabilité : rupture possible en fin de tour --------------------------
    var _endTurn = BattleManager.endTurn;
    BattleManager.endTurn = function () {
        var p = paire();
        if (p) {
            var A = $gameActors.actor(p.a), B = $gameActors.actor(p.b);
            if (!A || !B || !A.isAlive() || !B.isAlive()) { rompre(false); }
            else {
                var pr = Math.max(pression(p.a), pression(p.b));
                if (pr > 0.4 && Math.random() < pr * 0.5) rompre(true);
                else if (pr > 0.4) wlog('\\C[8]La résonance tremble — une Chute tire sur le fil.\\C[0]');
            }
        }
        _endTurn.call(this);
    };

    //--- Nettoyage fin de combat ------------------------------------------------
    var _endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        if ($gameSystem) $gameSystem._resonance = null;
        _endBattle.call(this, result);
    };

    //--- Visuel : liseré clair sur les résonants --------------------------------
    if (typeof Sprite_Actor !== 'undefined') {
        var _upd = Sprite_Actor.prototype.update;
        Sprite_Actor.prototype.update = function () {
            _upd.call(this);
            try {
                if (this._actor && estResonant(this._actor)) {
                    this._resoT = (this._resoT || 0) + 0.08;
                    this.setBlendColor([120, 200, 255, Math.floor(40 + 40 * Math.abs(Math.sin(this._resoT)))]);
                } else if (this._resoT) { this.setBlendColor([0, 0, 0, 0]); this._resoT = 0; }
            } catch (e) {}
        };
    }
})();
