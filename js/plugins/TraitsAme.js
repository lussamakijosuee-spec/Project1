//=============================================================================
// TraitsAme.js — v1.0  ·  Les Traits d'Âme (le don de naissance)
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//   À charger APRÈS Errance, JadeEntitePlunging et MarqueVivante.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le TRAIT : le don unique que l'âme offre à la naissance.
 * Inné, imprévisible, activé par la Marque — et il empiète sur TOUTES les énergies.
 * @author JOKO
 *
 * @param drainPM
 * @text Prix — % des PM max drainés par usage
 * @type number
 * @default 20
 *
 * @param drainTP
 * @text Prix — TP drainés par usage
 * @type number
 * @default 20
 *
 * @param errancePar
 * @text Prix — Errance par usage (forcer la marque)
 * @type number
 * @default 2
 *
 * @param erranceForce
 * @text Prix — Errance si la marque n'est pas la tienne
 * @type number
 * @default 6
 *
 * @param etatEnvers
 * @text État « l'Envers » (bonus du Trait porte)
 * @type state
 * @default 204
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES TRAITS D'ÂME                                                    by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'Âme est la source la moins comprise du monde — la plus imprévisible.
 *  Elle peut être bonne, mauvaise, faire l'impossible. À la naissance, elle
 *  offre TOUJOURS deux choses :
 *    • un DON SPIRITUEL — une arme, un familier ou un objet spirituel ;
 *    • un TRAIT — une capacité unique, aléatoire, qui n'appartient qu'à toi.
 *  Tout le reste s'apprend. Le Trait, lui, EST là depuis le début — un mana
 *  pur primitif, instinctif, que personne ne contrôle vraiment. C'est la
 *  MARQUE (l'ADN de l'âme) qui l'active, et les objets spirituels en sont
 *  presque une extension.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LES QUATRE TRAITS (+ le modèle : le Kamui de Dono, DonoKamui.js)
 *  ─────────────────────────────────────────────────────────────────────────
 *  ▶ AËL — LE POINT DE RUPTURE  ·  <Trait: rupture>
 *      Il voit la faille exacte où tout casse. Ses frappes de Trait sont
 *      TOUJOURS critiques (l'Éclat Noir n'est pas de la chance).
 *      Don spirituel : son ARME — la lame qui trouve la faille.
 *
 *  ▶ KORRAH — L'INSTANT GELÉ  ·  <Trait: gel>
 *      Le Zéro Absolu : elle gèle l'air si fort que tout semble s'arrêter.
 *      Ce n'est PAS du contrôle du temps — c'est du froid. Ses Traits ne
 *      ratent jamais (la cible est déjà figée) et engourdissent (−AGI).
 *      Don spirituel : le SABLIER DE GIVRE — l'objet qui retient l'instant.
 *
 *  ▶ LUDWING — LA PORTE D'OMBRE  ·  <Trait: porte>
 *      Son âme est une porte sur l'ENVERS, le pays des âmes errantes. Il ne
 *      se téléporte pas : il passe de l'autre côté et ressort ailleurs.
 *      Après un Trait, il reste un pied dans l'Envers (esquive +50 %, 1 tour).
 *      Don spirituel : ses FAMILIERS — les âmes liées (ses invocations).
 *
 *  ▶ VESPER — LE VERBE VRAI  ·  <Trait: verbe>
 *      Ce qu'elle nomme, le monde l'écoute. « Viens. » attire. « Pars. »
 *      repousse. Ses Traits ne ratent jamais (le monde obéit).
 *      Don spirituel : le PREMIER MOT — l'objet gravé de sa première Parole.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LE PRIX (la vraie contrainte du Trait)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Le Trait réunit TOUTES les sources d'un coup — alors il empiète sur
 *  TOUTES les énergies en même temps :
 *   • chaque usage draine drainPM % des PM max ET drainTP TP (en plus du
 *     coût du skill) → après un Trait, ton prochain sort peut être hors
 *     de portée ;
 *   • forcer la marque use l'âme : +errancePar Errance par usage ;
 *   • utiliser le Trait d'un autre (marque étrangère) : prix doublé et
 *     +erranceForce Errance — cette marque n'est pas la tienne ;
 *   • Marque CREUSE (âme vidée, voir MarqueVivante) : le Trait NE RÉPOND
 *     PLUS — une âme éteinte n'a plus rien à offrir.
 *
 *  SCRIPT :  window.Traits.de(actorId)   → {cle, nom, don} ou null
 *            window.Traits.possede(actorId, 'gel') → true/false
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('TraitsAme');
    var D_PM = parseInt(P['drainPM'] || 20);
    var D_TP = parseInt(P['drainTP'] || 20);
    var ERR = parseInt(P['errancePar'] || 2);
    var ERR_F = parseInt(P['erranceForce'] || 6);
    var ENVERS = parseInt(P['etatEnvers'] || 204);

    // Le registre des Traits : qui est né avec quoi.
    var TRAITS = {
        rupture: { actor: 1, nom: 'le Point de Rupture', don: 'son arme — la lame qui trouve la faille' },
        gel:     { actor: 2, nom: 'l\'Instant Gelé',      don: 'le Sablier de Givre' },
        porte:   { actor: 3, nom: 'la Porte d\'Ombre',    don: 'ses familiers — les âmes liées' },
        verbe:   { actor: 4, nom: 'le Verbe Vrai',        don: 'le Premier Mot' }
    };

    function log(t) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', t); w.push('wait'); }
        else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t);
    }
    function traitDuSkill(item) {
        if (!item || !item.meta || !item.meta.Trait) return '';
        var k = String(item.meta.Trait).toLowerCase().trim();
        return TRAITS[k] ? k : '';
    }
    function marqueCreuse(id) {
        try { return window.Marque && window.Marque.etat(id) === 'creuse'; } catch (e) { return false; }
    }

    var Traits = {
        de: function (actorId) {
            for (var k in TRAITS) if (TRAITS[k].actor === actorId) {
                return { cle: k, nom: TRAITS[k].nom, don: TRAITS[k].don };
            }
            return null;
        },
        possede: function (actorId, cle) { return !!(TRAITS[cle] && TRAITS[cle].actor === actorId); }
    };
    window.Traits = Traits;

    //=========================================================================
    // MARQUE CREUSE : une âme éteinte n'a plus de Trait à offrir
    //=========================================================================
    var _can = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
        if (traitDuSkill(skill) && this.isActor && this.isActor() && marqueCreuse(this.actorId())) {
            return false;
        }
        return _can.call(this, skill);
    };

    //=========================================================================
    // BONUS DE TRAIT (uniquement pour le porteur légitime)
    //=========================================================================
    function proprio(action) {
        var k = traitDuSkill(action.item());
        if (!k) return '';
        var s = action.subject();
        return (s && s.isActor && s.isActor() && s.actorId() === TRAITS[k].actor) ? k : '';
    }
    // rupture : toujours critique (il frappe LA faille)
    var _cri = Game_Action.prototype.itemCri;
    Game_Action.prototype.itemCri = function (target) {
        if (proprio(this) === 'rupture') return 1;
        return _cri.call(this, target);
    };
    // gel & verbe : ne ratent jamais (la cible est figée / le monde obéit)
    var _hit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function (target) {
        var k = proprio(this);
        if (k === 'gel' || k === 'verbe') return 1;
        return _hit.call(this, target);
    };

    //=========================================================================
    // LE PRIX : le Trait empiète sur TOUTES les énergies + use la marque
    //=========================================================================
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        var k = traitDuSkill(this.item());
        if (!k || this._traitPaye) return;
        this._traitPaye = true;
        var s = this.subject();
        if (!s || !s.isActor || !s.isActor()) return;
        var id = s.actorId();
        var estSien = (TRAITS[k].actor === id);
        var mult = estSien ? 1 : 2;

        // toutes les énergies, en même temps
        var pm = Math.floor(s.mmp * D_PM / 100) * mult;
        if (pm > 0) s.gainMp(-Math.min(pm, s.mp));
        if (D_TP > 0) s.gainTp(-(D_TP * mult));

        // la marque, forcée
        try { if (window.Errance) window.Errance.add(id, estSien ? ERR : ERR_F); } catch (e) {}

        // gel : l'engourdissement du froid (−AGI, 2 tours)
        if (k === 'gel' && estSien && target && target.isAlive() && target.result && target.result().isHit()) {
            if (target.addDebuff) target.addDebuff(6, 2);
        }
        // porte : un pied encore dans l'Envers (esquive +50 %, 1 tour)
        if (k === 'porte' && estSien) { s.addState(ENVERS); }

        if (!estSien) {
            log('\\C[2]Marque étrangère — le Trait déchire ' + s.name() + '.\\C[0]');
        } else if (!s._traitVu) {
            s._traitVu = true;
            log('\\C[18]★ TRAIT — ' + TRAITS[k].nom + '\\C[0]');
        }
    };

    // le « déjà vu » du Trait retombe entre les combats
    var _setup = Game_Actor.prototype.onBattleStart;
    if (_setup) {
        Game_Actor.prototype.onBattleStart = function () {
            _setup.call(this);
            this._traitVu = false;
        };
    }
})();
