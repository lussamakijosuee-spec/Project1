//=============================================================================
// ManaAffinity.js — v1.0
// Affinités & Cycle de Mana en combat (RPG Maker MV)
// by JOKO
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Rend le lore du Mana JOUABLE : cycle ×1.5/×0.5
 * (Négatif>Âme>Positif), recul PV du Négatif/Sombre, Mana Pur perce-résistances.
 * @author JOKO
 *
 * @param advRate
 * @text Multiplicateur avantage
 * @type number
 * @decimals 2
 * @default 1.50
 *
 * @param disRate
 * @text Multiplicateur désavantage
 * @type number
 * @decimals 2
 * @default 0.50
 *
 * @param recoilNegatif
 * @text Recul PV — Mana Négatif (%)
 * @type number
 * @min 0
 * @default 15
 * @desc % des dégâts infligés que l'utilisateur du Mana Négatif (élém 4) se prend en retour.
 *
 * @param recoilSombre
 * @text Recul PV — Mana Sombre (%)
 * @type number
 * @min 0
 * @default 25
 * @desc % des dégâts infligés que l'utilisateur du Mana Sombre (élém 5) se prend en retour.
 *
 * @param positifSanFactor
 * @text Mana Positif affaibli par la SAN ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Si Oui, le Mana Positif (élém 3) faiblit quand la santé mentale du lanceur baisse (via JadeEntitePlunging).
 *
 * @param showLog
 * @text Messages de combat ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param --- IDs ÉLÉMENTS ---
 * @default
 *
 * @param elSpirituelle
 * @text Élément — Spirituelle (Âme)
 * @type number
 * @default 2
 *
 * @param elPositif
 * @text Élément — Positif
 * @type number
 * @default 3
 *
 * @param elNegatif
 * @text Élément — Négatif
 * @type number
 * @default 4
 *
 * @param elSombre
 * @text Élément — Sombre
 * @type number
 * @default 5
 *
 * @param elPur
 * @text Élément — Pur / Parfait
 * @type number
 * @default 7
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  AFFINITÉS & CYCLE DE MANA                                          by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Traduit la « bible du Mana » en mécaniques de combat réelles.
 *
 *  ▶ LE CYCLE (comme Pokémon)
 *      Mana NÉGATIF (4)  bat  SPIRITUELLE/ÂME (2)
 *      SPIRITUELLE (2)   bat  POSITIF (3)
 *      POSITIF (3)       bat  NÉGATIF (4)
 *    • Frapper la branche avantagée → ×1.5 (advRate)
 *    • Frapper la branche désavantagée → ×0.5 (disRate)
 *    La « branche » d'une attaque = l'élément du skill (ou notetag <Mana: ...>).
 *    La « branche » d'une cible = son AFFINITÉ (notetag, voir plus bas).
 *
 *  ▶ COÛTS DU CORPS
 *    Utiliser le Mana Négatif (élém 4) ou Sombre (élém 5) blesse le lanceur :
 *    il subit en retour un % des dégâts infligés (recoilNegatif / recoilSombre).
 *
 *  ▶ MANA POSITIF & SANTÉ MENTALE
 *    Le Mana Positif (élém 3) faiblit quand la santé mentale du lanceur baisse
 *    (lecture de la phase via JadeEntitePlunging / window.Ame).
 *
 *  ▶ MANA PUR (élém 7)
 *    Transcende tout : il IGNORE les résistances/faiblesses élémentaires de la
 *    cible (taux d'élément forcé à 100 %) et n'est pas concerné par le cycle.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  DÉFINIR L'AFFINITÉ D'UN PERSONNAGE / ENNEMI
 *  ─────────────────────────────────────────────────────────────────────────
 *  Dans la case Note d'un Acteur, d'une Classe ou d'un Ennemi :
 *
 *      <Mana: negatif>      (ou: positif / spirituelle / ame / sombre / pur)
 *
 *  Exemple : une nécromancienne <Mana: spirituelle> prendra ×1.5 d'une
 *  attaque Mana Négatif, et ×0.5 d'une attaque Mana Positif.
 *
 *  Forcer la branche d'un skill (sinon = son élément) :
 *      <Mana: positif>   dans la Note du skill.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('ManaAffinity');
    var ADV      = parseFloat(P['advRate']      || 1.5);
    var DIS      = parseFloat(P['disRate']      || 0.5);
    var REC_NEG  = parseInt(P['recoilNegatif']  || 15) / 100;
    var REC_SOM  = parseInt(P['recoilSombre']   || 25) / 100;
    var POS_SAN  = String(P['positifSanFactor'] || 'true') === 'true';
    var SHOW_LOG = String(P['showLog']          || 'true') === 'true';

    var EL_SPI = parseInt(P['elSpirituelle'] || 2);
    var EL_POS = parseInt(P['elPositif']     || 3);
    var EL_NEG = parseInt(P['elNegatif']     || 4);
    var EL_SOM = parseInt(P['elSombre']      || 5);
    var EL_PUR = parseInt(P['elPur']         || 7);

    // Qui bat qui (attaquant : cible)
    var BEATS = {};
    BEATS[EL_NEG] = EL_SPI;
    BEATS[EL_SPI] = EL_POS;
    BEATS[EL_POS] = EL_NEG;

    //=========================================================================
    // OUTILS
    //=========================================================================

    function battleLog(text) {
        if (!SHOW_LOG) return;
        var s = SceneManager._scene;
        if (s && s._logWindow) s._logWindow.addText(text);
    }

    function branchFromString(str) {
        switch (String(str).toLowerCase().trim()) {
            case 'spirituelle': case 'ame': case 'âme': return EL_SPI;
            case 'positif':     case 'positive':         return EL_POS;
            case 'negatif':     case 'négatif': case 'negative': return EL_NEG;
            case 'sombre':                                return EL_SOM;
            case 'pur':         case 'parfait':           return EL_PUR;
            default:
                var n = parseInt(str);
                return isNaN(n) ? 0 : n;
        }
    }

    /** Branche de l'attaque : notetag <Mana: ...> sinon élément du skill. */
    function actionBranch(action) {
        var item = action.item();
        if (!item) return 0;
        if (item.meta && item.meta.Mana) return branchFromString(item.meta.Mana);
        var eid = item.damage ? item.damage.elementId : 0;
        return (eid > 0) ? eid : 0;
    }

    /** Affinité d'un battler via notetag (acteur, classe, ou ennemi). */
    function affinityOf(battler) {
        if (!battler) return 0;
        var metas = [];
        if (battler.isEnemy && battler.isEnemy() && battler.enemy()) {
            metas.push(battler.enemy().meta);
        } else if (battler.isActor && battler.isActor()) {
            if (battler.actor()) metas.push(battler.actor().meta);
            if (battler.currentClass && battler.currentClass()) metas.push(battler.currentClass().meta);
        }
        for (var i = 0; i < metas.length; i++) {
            if (metas[i] && metas[i].Mana) return branchFromString(metas[i].Mana);
        }
        return 0;
    }

    function cycleFactor(atkBranch, defBranch) {
        if (!atkBranch || !defBranch) return 1;
        if (BEATS[atkBranch] === defBranch) return ADV; // avantage
        if (BEATS[defBranch] === atkBranch) return DIS; // désavantage
        return 1;
    }

    /** Facteur de Mana Positif selon la santé mentale du lanceur (via Ame). */
    function positifSanFactor(subject) {
        if (!POS_SAN) return 1;
        if (typeof window.Ame === 'undefined' || !window.Ame) return 1;
        if (!(subject && subject.isActor && subject.isActor())) return 1;
        var phase = window.Ame.phase(subject.actorId());
        if (!phase) return 1;
        // phase 5/4 = 1.0 ; 3 = 0.85 ; 2 = 0.70 ; 1 = 0.55
        return ({ 5: 1.0, 4: 1.0, 3: 0.85, 2: 0.70, 1: 0.55 })[phase] || 1;
    }

    //=========================================================================
    // MANA PUR — ignore les résistances élémentaires de la cible
    //=========================================================================

    var _GA_calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function (target) {
        if (actionBranch(this) === EL_PUR) return 1; // ni résisté, ni amplifié
        return _GA_calcElementRate.call(this, target);
    };

    //=========================================================================
    // CYCLE + POSITIF/SAN — multiplicateur de dégâts
    //=========================================================================

    var _GA_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var value = _GA_makeDamageValue.call(this, target, critical);
        if (value === 0) return value;

        var atk = actionBranch(this);
        var subject = this.subject();

        // Cycle d'avantages (uniquement entre les 3 branches secondaires)
        if (atk === EL_NEG || atk === EL_SPI || atk === EL_POS) {
            var f = cycleFactor(atk, affinityOf(target));
            if (f !== 1) {
                value = Math.floor(value * f);
                this._manaCycleFlag = (f > 1) ? 'sup' : 'inf';
            }
        }

        // Mana Positif affaibli par la santé mentale
        if (atk === EL_POS) {
            var pf = positifSanFactor(subject);
            if (pf < 1) value = Math.floor(value * pf);
        }

        return value;
    };

    // Message « super efficace / peu efficace » (une fois par action)
    var _GA_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        this._manaCycleFlag = null;
        _GA_apply.call(this, target);
        if (this._manaCycleFlag === 'sup') {
            battleLog('Affinité de Mana : c\'est super efficace !');
        } else if (this._manaCycleFlag === 'inf') {
            battleLog('Affinité de Mana : le coup est atténué…');
        }
        this._manaCycleFlag = null;
    };

    //=========================================================================
    // COÛTS DU CORPS — recul PV du Mana Négatif / Sombre
    //=========================================================================

    var _GA_executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _GA_executeDamage.call(this, target, value);

        if (value > 0) {
            var atk = actionBranch(this);
            var rate = (atk === EL_NEG) ? REC_NEG : (atk === EL_SOM ? REC_SOM : 0);
            if (rate > 0) {
                var subject = this.subject();
                if (subject && subject.isAlive()) {
                    var recoil = Math.max(1, Math.floor(value * rate));
                    subject.gainHp(-recoil);
                    subject.startDamagePopup();
                    subject.clearResult();
                    battleLog((subject.name ? subject.name() : 'Le lanceur') +
                              ' brûle son corps pour le Mana ' +
                              (atk === EL_SOM ? 'Sombre' : 'Négatif') +
                              ' (-' + recoil + ' PV).');
                    if (subject.isDead()) subject.performCollapse();
                }
            }
        }
    };

})();
