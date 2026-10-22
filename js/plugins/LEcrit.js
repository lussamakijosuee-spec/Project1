//=============================================================================
// LEcrit.js — v1.0
// L'Écrit, l'art de l'Âme (mana spirituel) : écrire d'abord, activer ensuite.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ L'Écrit (mana spirituel) : une technique de l'âme ne part pas,
 * elle S'ÉCRIT sur sa cible. « Activer » fait partir tous tes écrits d'un coup,
 * plus forts. Leur force vient de la VOLONTÉ : PV bas, alliés tombés.
 * @author pour JOKO
 *
 * @param === L'ÉCRIT ===
 * @default
 *
 * @param etatEcrit
 * @text État de l'écrit
 * @type state
 * @default 257
 * @desc Son icône est l'écrit ; son chiffre, combien d'écrits attendent sur cette cible.
 *
 * @param ecritsMax
 * @text Écrits en attente au plus, par héros
 * @type number
 * @min 1
 * @default 3
 * @desc Au-delà, ses techniques de l'âme sont grisées : il faut d'abord activer.
 *
 * @param bonusEcrit
 * @text Un écrit activé : dégâts et soins ×
 * @default 1.25
 * @desc Ce qu'on a préparé frappe plus fort que ce qu'on lance.
 *
 * @param dejaEcrits
 * @text Types déjà écrits (partent tout de suite)
 * @default 8, 9, 26
 * @desc Les dons : 8 invocation, 9 âme, 26 copies — les runes du collier de ludwing sont déjà tracées.
 *
 * @param competenceActiver
 * @text La compétence « Activer »
 * @type skill
 * @default 1309
 *
 * @param acteursExclus
 * @text Ceux qui n'écrivent pas
 * @default 6
 * @desc seiryu (6).
 *
 * @param === LA VOLONTÉ ===
 * @default
 *
 * @param parPVManquant
 * @text Volonté : + par PV manquant (1 = +100 % à 0 PV)
 * @default 0.5
 *
 * @param parAllieTombe
 * @text Volonté : + par allié tombé
 * @default 0.25
 *
 * @param volonteMax
 * @text Volonté au plus ×
 * @default 1.75
 *
 * @help
 * ============================================================================
 *  L'ÉCRIT — l'âme qui prépare                                   pour JOKO
 * ============================================================================
 *  JOKO, le 2026-10-22 : « Spirituelle c'est plus comme les symboles le fait
 *  de écrire ou préparer des écrits le système de Full Metal Alchemist » ;
 *  « B pour l'écrit » (c'est toi qui l'actives) ; « Oui la volonté, l'âme,
 *  la détermination ». La Genèse : « l'écriture des âmes […] créer des
 *  parchemins magiques avec son énergie spirituelle, ou ses PV ».
 *
 *  EST UN ÉCRIT : une compétence de héros dont l'art est l'écrit
 *  (LesTroisArts). Elle se paie en PV, tout de suite.
 *
 *  ÉCRIRE — elle ne part pas : elle s'écrit sur sa cible (ennemi, allié,
 *  soi). L'écrit reste affiché (ᛟ, avec leur nombre). 3 en attente au plus
 *  par héros.
 *
 *  ACTIVER — la compétence « ᛟ Activer » (instantanée : on joue encore son
 *  tour) fait partir TOUS ses écrits d'un coup, dans l'ordre où ils ont été
 *  écrits, ×1,25. Une cible tombée emporte ses écrits ; un soin écrit sur un
 *  allié attend le bon moment ; une réanimation écrite attend qu'il tombe.
 *
 *  DÉJÀ ÉCRITS — les dons (invocations, âme, copies) partent tout de suite :
 *  les runes du collier de ludwing sont déjà tracées. Une fiche qui porte
 *  <DejaEcrit> aussi (Aspiration des Âmes Damnées, son collier). La Parole lue
 *  d'Aël aussi (son livre). Les attaques à plusieurs (<Combo>, unisson) aussi.
 *
 *  LA VOLONTÉ — tout ce qui est de l'âme frappe et soigne plus fort quand ça
 *  va mal : +50 % à 0 PV (au prorata), +25 % par allié tombé, ×1,75 au plus.
 *  Écrire coûte des PV : payer rapproche de sa volonté.
 *
 *  Les ennemis n'écrivent pas. Tous les chiffres sont des réglages.
 * ============================================================================
 */

var LEcrit = LEcrit || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('LEcrit');
    var nombre = function (k, d) { var v = parseFloat(P[k]); return isNaN(v) ? d : v; };
    var liste = function (k, d) {
        return String(P[k] === undefined ? d : P[k]).split(',')
            .map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x); });
    };
    var ETAT    = nombre('etatEcrit', 257);
    var MAX     = nombre('ecritsMax', 3);
    var BONUS   = nombre('bonusEcrit', 1.25);
    var DEJA    = liste('dejaEcrits', '8, 9, 26');
    var ACTIVER = nombre('competenceActiver', 1309);
    var EXCLUS  = liste('acteursExclus', '6');
    var PAR_PV  = nombre('parPVManquant', 0.5);
    var PAR_KO  = nombre('parAllieTombe', 0.25);
    var VOL_MAX = nombre('volonteMax', 1.75);

    function enCombat() { return !!($gameParty && $gameParty.inBattle()); }
    function heros(b) { return !!(b && b.isActor && b.isActor() && EXCLUS.indexOf(b.actorId()) < 0); }
    function annonce(b, texte, couleur) {
        if (window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur); }
    }
    function chiffre(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }

    /** Une technique de l'âme, lancée par un héros. */
    function estEcrit(action) {
        var it = action && action.item();
        if (!it || !DataManager.isSkill(it) || !heros(action.subject())) { return false; }
        return !!(window.LesTroisArts && LesTroisArts.art(it) === 'ecrit');
    }
    function aPlusieurs(it) {
        return !!(it.meta && (it.meta.Combo !== undefined || it.meta['unison item actors'] !== undefined));
    }
    /** Cette action s'écrit au lieu de partir. */
    function doitEcrire(action) {
        if (!enCombat() || action._ecritActive || !estEcrit(action)) { return false; }
        var it = action.item(), b = action.subject();
        if (DEJA.indexOf(it.stypeId) >= 0 || aPlusieurs(it) || (it.meta && it.meta.DejaEcrit !== undefined)) { return false; }
        return !(b.paroleLue && b.paroleLue(it));
    }

    //=========================================================================
    // Les écrits : gardés par qui les a écrits, montrés sur la cible
    //=========================================================================
    function ecritsDe(b) { return (b && b._ecrits) || []; }
    function surCible(c) {
        var n = 0;
        $gameParty.members().forEach(function (a) { ecritsDe(a).forEach(function (m) { if (m.cible === c) { n++; } }); });
        return n;
    }
    function montrer(c) {
        if (!c) { return; }
        var n = surCible(c);
        if (n > 0) {
            if (!c.isStateAffected(ETAT)) { c.addNewState(ETAT); }
            c.resetStateCounts(ETAT);
            if (c.setStateCounter) { c.setStateCounter(ETAT, n); }
        } else if (c.isStateAffected(ETAT)) {
            c.eraseState(ETAT);
            if (c.removeStateCounter) { c.removeStateCounter(ETAT); }
            c.refresh();
        }
    }

    function ecrire(action, cible) {
        var b = action.subject();
        b._ecrits = ecritsDe(b).slice();
        b._ecrits.push({ cible: cible, competence: action.item().id });
        cible.clearResult();
        cible.result().used = true;          // touché, sans rien : pas de « raté » à l'écran
        montrer(cible);
        annonce(cible, 'ᛟ Écrit', '#e080ff');
    }

    var _appliquer = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        if (target && doitEcrire(this)) { ecrire(this, target); return; }
        _appliquer.call(this, target);
        var it = this.item();
        if (enCombat() && it && it.id === ACTIVER && target === this.subject()) { activer(this.subject()); }
    };
    // Les événements communs d'un écrit attendent son activation.
    var _global = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function () {
        if (doitEcrire(this)) { return; }
        _global.call(this);
    };

    //=========================================================================
    // Activer : tous ses écrits partent, dans l'ordre
    //=========================================================================
    function declencher(b, m) {
        var sk = $dataSkills[m.competence], c = m.cible;
        if (!sk || !c) { return false; }
        var a = new Game_Action(b);
        a.setSkill(sk.id);
        a._ecritActive = true;
        a._volonte = volonte(b);              // annoncée une fois pour toute l'activation (activer)
        if (!a.testApply(c)) { return false; }
        var anim = sk.animationId < 0 ? b.attackAnimationId1() : sk.animationId;
        if (anim > 0) { c.startAnimation(anim, false, 0); }
        c.clearResult();
        a.apply(c);
        c.startDamagePopup();
        if (c.isDead()) { c.performCollapse(); }
        a.applyGlobal();
        return true;
    }
    function activer(b) {
        var tous = ecritsDe(b).slice();
        b._ecrits = [];
        var partis = 0;
        tous.forEach(function (m) { if (declencher(b, m)) { partis++; } montrer(m.cible); });
        if (partis) {
            var v = volonte(b);
            annonce(b, 'ᛟ Activé ×' + partis, '#ff9ad8');
            if (v >= 1.05) { annonce(b, 'ᛟ Volonté ×' + chiffre(v), '#ff9ad8'); }
            if ($gameScreen) { $gameScreen.startFlash([255, 150, 230, 110], 18); }
        }
    }

    // Activer n'existe qu'avec des écrits ; au-delà de 3 en attente, on n'écrit plus.
    var _conditions = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if (!_conditions.call(this, skill)) { return false; }
        if (!enCombat() || !heros(this)) { return true; }
        if (skill.id === ACTIVER) { return ecritsDe(this).length > 0; }
        if (ecritsDe(this).length >= MAX) {
            var a = new Game_Action(this); a.setSkill(skill.id);
            if (doitEcrire(a)) { return false; }
        }
        return true;
    };

    // Un ennemi tombé emporte ce qui était écrit sur lui.
    // Sur Game_Enemy : LouCopySystem, DonoBoss, DonoKamui et EvenementsUtiles y posent déjà leur mort.
    var _mourir = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function () {
        var e = this;
        if (enCombat()) {
            $gameParty.members().forEach(function (a) {
                if (a._ecrits) { a._ecrits = a._ecrits.filter(function (m) { return m.cible !== e; }); }
            });
        }
        _mourir.call(this);
    };

    //=========================================================================
    // La volonté
    //=========================================================================
    function volonte(b) {
        if (!b || !b.mhp) { return 1; }
        var tombes = $gameParty.battleMembers().filter(function (a) { return a !== b && a.isDead(); }).length;
        var v = 1 + PAR_PV * (1 - b.hp / b.mhp) + PAR_KO * tombes;
        return Math.min(VOL_MAX, Math.max(1, v));
    }

    var _valeur = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeur.call(this, target, critical);
        if (v !== 0 && estEcrit(this)) {
            if (this._volonte === undefined) {
                this._volonte = volonte(this.subject());
                if (this._volonte >= 1.05) { annonce(this.subject(), 'ᛟ Volonté ×' + chiffre(this._volonte), '#ff9ad8'); }
            }
            var k = this._volonte * (this._ecritActive ? BONUS : 1);
            if (k !== 1) { v = Math.round(v * k); }
        }
        return v;
    };

    // Rien ne reste d'un combat à l'autre.
    // Sur Game_Actor : LeFroidConfie y pose déjà son début de combat.
    var _debut = Game_Actor.prototype.onBattleStart;
    Game_Actor.prototype.onBattleStart = function () {
        _debut.call(this);
        this._ecrits = [];
        // Activer s'apprend au niveau 1 : un héros d'une partie commencée avant l'a quand même.
        if (heros(this) && $dataSkills[ACTIVER] && !this.isLearnedSkill(ACTIVER)) { this.learnSkill(ACTIVER); }
    };
    var _fin = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        $gameParty.members().forEach(function (a) { a._ecrits = []; });
        return _fin.call(this, result);
    };

    LEcrit.estEcrit = estEcrit;
    LEcrit.doitEcrire = doitEcrire;
    LEcrit.ecrits = function (b) { return ecritsDe(b).slice(); };
    LEcrit.surCible = surCible;
    LEcrit.activer = activer;
    LEcrit.volonte = volonte;
    LEcrit.ACTIVER = ACTIVER;
})();
