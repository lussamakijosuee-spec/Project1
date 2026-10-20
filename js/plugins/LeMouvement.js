//=============================================================================
// LeMouvement.js — v1.0
// Le Mouvement, l'art du Corps (mana négatif) : la posture, le flux, le geste juste.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le Mouvement (mana négatif) : chaque technique met le héros
 * dans la POSTURE de sa Voie ; enchaîner une autre Voie fait monter le FLUX ;
 * à 3, le GESTE JUSTE ; un gros coup brise le flux. Dans le flux, on frappe en premier.
 * @author pour JOKO
 *
 * @param === LES POSTURES ===
 * @default
 *
 * @param etatsPosture
 * @text États des postures (Voie:état)
 * @default forge:248, onde:249, source:250, miroir:251, vide:252, eclair:253, domaine:254, flash:255, sang:256
 * @desc Un état par Voie. Son icône est la posture ; son chiffre, le flux.
 *
 * @param elementsCorps
 * @text Éléments du corps
 * @default 4, 5
 * @desc Mana négatif (4) — et 5, « Mana Sombre », qui est la même chose (JOKO). Une technique de ces éléments est un mouvement.
 *
 * @param typesExclus
 * @text Types de compétence qui ne sont pas ses mouvements
 * @default 21
 * @desc 21 avatar : c'est seiryu qui bouge, pas Korrah — elle garde sa posture, sans faire monter le flux.
 *
 * @param neutres
 * @text Compétences qui gardent la posture
 * @default 2
 * @desc 2 = la Garde : on reste en posture, sans faire monter le flux.
 *
 * @param acteursExclus
 * @text Ceux qui n'ont pas de posture
 * @default 6
 * @desc seiryu (6).
 *
 * @param === LE FLUX ===
 * @default
 *
 * @param fluxGeste
 * @text Flux du geste juste
 * @type number
 * @min 2
 * @default 3
 *
 * @param bonusEnchaine
 * @text Enchaîner une autre Voie : dégâts ×
 * @default 1.15
 *
 * @param bonusGeste
 * @text Le geste juste : dégâts ×
 * @default 1.5
 *
 * @param malusRepete
 * @text Répéter la même technique : dégâts ×
 * @default 0.85
 * @desc Et le flux retombe à 0.
 *
 * @param === LE GESTE FAUX ===
 * @default
 *
 * @param seuilBrise
 * @text Un coup de (% des PV max) brise le flux
 * @type number
 * @default 15
 *
 * @param === EN PREMIER ===
 * @default
 *
 * @param premierDesFlux
 * @text Dans le flux dès (0 = jamais en premier)
 * @type number
 * @default 1
 * @desc Un héros dont le flux atteint ce chiffre et qui lance un mouvement agit avant tout le monde.
 *
 * @help
 * ============================================================================
 *  LE MOUVEMENT — le corps qui enchaîne                          pour JOKO
 * ============================================================================
 *  JOKO, le 2026-10-20 : « Mana sombre, c'est plus corporel, mouvement,
 *  fluidité, et maîtrise. » ; « D'abord, fais les mouvements. »
 *
 *  EST UN MOUVEMENT : une compétence de héros qui prend une Voie
 *  (MaitriseVoies, <Voie:> écrite ou Voie par défaut — jamais une Parole ni
 *  une technique de l'âme) et qui est physique, ou porte <Voie:>, ou est au
 *  mana négatif. L'Attaque en est un, dans la Voie du héros.
 *
 *  LA POSTURE — après un mouvement, le héros est dans la posture de sa Voie :
 *  une icône sur lui, avec le flux en chiffre. Celle d'Onde et celle de Miroir
 *  répondent pendant le tour ennemi (Reflux, Renvoi — MaitriseVoies).
 *
 *  LE FLUX — enchaîner un mouvement d'une AUTRE Voie : flux +1, dégâts ×1,15.
 *  Même Voie, autre technique : rien ne bouge. La même technique deux fois
 *  de suite : ×0,85, et le flux retombe. Au flux 3 : LE GESTE JUSTE, ×1,5,
 *  puis le flux repart de 0.
 *
 *  LE GESTE FAUX — un coup de 15 % des PV max, ou un état qui immobilise,
 *  brise le flux et la posture. Une Parole, une technique de l'âme ou un
 *  objet aussi : le corps s'arrête. La Garde garde la posture.
 *
 *  EN PREMIER — dans le flux (dès 1), un mouvement part avant tout le monde.
 *  C'est l'inverse des longues Paroles, qui partent en dernier.
 *
 *  Tout s'annonce au-dessus du héros (le journal de combat est muet ici).
 *  Les ennemis ne changent pas. Aucune fiche n'est modifiée.
 * ============================================================================
 */

var LeMouvement = LeMouvement || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('LeMouvement');
    var nombre = function (k, d) { var v = parseFloat(P[k]); return isNaN(v) ? d : v; };
    var liste = function (k, d) {
        return String(P[k] === undefined ? d : P[k]).split(',')
            .map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x); });
    };

    var POSTURES = {};
    String(P['etatsPosture'] || 'forge:248, onde:249, source:250, miroir:251, vide:252, eclair:253, domaine:254, flash:255, sang:256')
        .split(',').forEach(function (x) {
            var m = /^\s*([a-zéè]+)\s*:\s*(\d+)\s*$/i.exec(x);
            if (m) { POSTURES[m[1].toLowerCase()] = Number(m[2]); }
        });
    var ETATS = Object.keys(POSTURES).map(function (v) { return POSTURES[v]; });
    var CORPS      = liste('elementsCorps', '4, 5');
    var TYPES_EXCL = liste('typesExclus', '21');
    var NEUTRES    = liste('neutres', '2');
    var EXCLUS     = liste('acteursExclus', '6');
    var GESTE      = nombre('fluxGeste', 3);
    var BONUS      = nombre('bonusEnchaine', 1.15);
    var BONUS_GESTE = nombre('bonusGeste', 1.5);
    var MALUS      = nombre('malusRepete', 0.85);
    var SEUIL      = nombre('seuilBrise', 15) / 100;
    var PREMIER    = nombre('premierDesFlux', 1);

    var NOMS = { forge: 'Forge', onde: 'Onde', source: 'Source', miroir: 'Miroir', vide: 'Vide',
                 eclair: 'Éclair', domaine: 'Domaine', flash: 'Flash', sang: 'Sang' };
    var COULEURS = { forge: '#ffb070', onde: '#7ec8ff', source: '#8affa0', miroir: '#c8f0ff', vide: '#b8b8d0',
                     eclair: '#ffe066', domaine: '#d0a0ff', flash: '#c9a0ff', sang: '#ff6a6a' };

    function enCombat() { return $gameParty && $gameParty.inBattle(); }
    function heros(b) { return !!(b && b.isActor && b.isActor() && EXCLUS.indexOf(b.actorId()) < 0); }
    function annonce(b, texte, couleur) {
        if (window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur); }
    }
    function chiffre(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }

    /** La Voie de ce mouvement, ou « » si l'action n'en est pas un. */
    function voieDuMouvement(action) {
        if (!action || !window.Voies || !Voies.voieDe) { return ''; }
        var b = action.subject(), it = action.item();
        if (!heros(b) || !it || !DataManager.isSkill(it)) { return ''; }
        if (TYPES_EXCL.indexOf(it.stypeId) >= 0) { return ''; }
        var v = Voies.voieDe(action);
        if (!v || !POSTURES[v]) { return ''; }
        var ecrite = it.meta && it.meta.Voie !== undefined;
        var corps = !!it.damage && CORPS.indexOf(it.damage.elementId) >= 0;
        return (ecrite || it.hitType === 1 || corps) ? v : '';
    }
    // La Garde garde la posture ; un ordre à seiryu aussi (type 21 : c'est lui qui bouge, elle ne s'arrête pas).
    function neutre(action) {
        var it = action && action.item();
        return !!(it && DataManager.isSkill(it) && (NEUTRES.indexOf(it.id) >= 0 || TYPES_EXCL.indexOf(it.stypeId) >= 0));
    }

    //=========================================================================
    // La posture à l'écran : une icône, le flux en chiffre
    //=========================================================================
    function afficher(b) {
        ETATS.forEach(function (id) {
            if (id !== POSTURES[b._mvtVoie] && b.isStateAffected(id)) { b.eraseState(id); b.removeStateCounter(id); }
        });
        var id = POSTURES[b._mvtVoie];
        if (id) {
            if (!b.isStateAffected(id)) { b.addNewState(id); b.resetStateCounts(id); }
            if (b._mvtFlux > 0) { b.setStateCounter(id, b._mvtFlux); } else { b.removeStateCounter(id); b.refresh(); }
        } else {
            b.refresh();
        }
        if (enCombat() && BattleManager.refreshStatus) { BattleManager.refreshStatus(); }
    }
    function lacher(b, texte) {
        if (!b || !b._mvtVoie) { return; }
        var avait = b._mvtFlux > 0;
        b._mvtVoie = ''; b._mvtFlux = 0; b._mvtDernier = 0;
        afficher(b);
        if (texte && avait) { annonce(b, texte, '#ff8080'); }
    }
    function remettre(b) { b._mvtVoie = ''; b._mvtFlux = 0; b._mvtDernier = 0; }

    //=========================================================================
    // Au départ de l'action : le flux bouge, la puissance est fixée
    //=========================================================================
    function decider(b, action) {
        var v = voieDuMouvement(action);
        if (!v) {
            if (!neutre(action)) { lacher(b, '✗ Flux rompu'); }
            return;
        }
        var id = action.item().id, avant = b._mvtVoie, mult = 1, texte, couleur = COULEURS[v];
        if (!avant) {
            b._mvtFlux = 0;
            texte = '◆ Posture : ' + NOMS[v];
        } else if (b._mvtDernier === id) {
            mult = MALUS; b._mvtFlux = 0;
            texte = '↺ Répété ×' + chiffre(MALUS); couleur = '#b0b0b0';
        } else if (v !== avant) {
            b._mvtFlux++;
            if (b._mvtFlux >= GESTE) {
                mult = BONUS_GESTE; b._mvtFlux = 0;
                texte = '✦ GESTE JUSTE ×' + chiffre(BONUS_GESTE); couleur = '#ffd84a';
                if ($gameScreen) { $gameScreen.startFlash([255, 230, 140, 140], 18); }
            } else {
                mult = BONUS;
                // court : les héros sont au bord droit de l'écran, une annonce longue y est coupée
                texte = '◆ ' + NOMS[v] + ' · flux ' + b._mvtFlux;
            }
        } else {
            texte = '◆ ' + NOMS[v] + (b._mvtFlux > 0 ? ' · flux ' + b._mvtFlux : '');
        }
        b._mvtVoie = v; b._mvtDernier = id;
        action._mvtMult = mult;
        annonce(b, texte, couleur);
    }

    var _debut = BattleManager.startAction;
    BattleManager.startAction = function () {
        var b = this._subject, a = b && b.currentAction && b.currentAction();
        if (heros(b) && a && a.item()) { decider(b, a); }
        _debut.call(this);
    };

    // La posture se pose quand le geste est fini (l'icône apparaît à ce moment-là).
    var _fin = BattleManager.endAction;
    BattleManager.endAction = function () {
        var b = this._subject;
        if (heros(b) && b._mvtVoie && b.isAlive()) { afficher(b); }
        _fin.call(this);
    };

    var _valeur = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeur.call(this, target, critical);
        if (this._mvtMult && this._mvtMult !== 1 && v !== 0) { v = Math.round(v * this._mvtMult); }
        return v;
    };

    //=========================================================================
    // Le geste faux : un gros coup, un état qui immobilise
    //=========================================================================
    var _degats = Game_Battler.prototype.onDamage;
    Game_Battler.prototype.onDamage = function (value) {
        _degats.call(this, value);
        if (heros(this) && this._mvtVoie && enCombat() && value >= (this.mhp || 1) * SEUIL) {
            var avait = this._mvtFlux > 0;
            lacher(this, '✗ Geste faux : flux brisé');
            if (!avait) { annonce(this, '✗ Posture perdue', '#ff8080'); }
        }
    };
    var _etat = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        _etat.call(this, stateId);
        var st = $dataStates[stateId];
        if (heros(this) && this._mvtVoie && enCombat() && st && st.restriction >= 4 && this.isStateAffected(stateId)) {
            lacher(this, '✗ Flux brisé');
        }
    };

    //=========================================================================
    // En premier : dans le flux, le mouvement part avant tout le monde
    //=========================================================================
    function dansLeFlux(b) {
        if (PREMIER <= 0 || !heros(b) || !(b._mvtFlux >= PREMIER)) { return false; }
        return !!voieDuMouvement(b.currentAction && b.currentAction());
    }
    var _ordres = BattleManager.makeActionOrders;
    BattleManager.makeActionOrders = function () {
        _ordres.call(this);
        var avant = [], reste = [];
        (this._actionBattlers || []).forEach(function (b) { (dansLeFlux(b) ? avant : reste).push(b); });
        this._actionBattlers = avant.concat(reste);
    };

    //=========================================================================
    // Un combat neuf, un corps au repos
    //=========================================================================
    // Sur Game_Actor : LeFroidConfie y pose déjà son début de combat (qui ne passerait pas par Game_Battler).
    var _debutCombat = Game_Actor.prototype.onBattleStart;
    Game_Actor.prototype.onBattleStart = function () {
        _debutCombat.call(this);
        remettre(this);
    };
    var _finCombat = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function () {
        _finCombat.call(this);
        remettre(this);
    };

    LeMouvement.voie = voieDuMouvement;
    LeMouvement.postures = POSTURES;
    LeMouvement.flux = function (b) { return b ? (b._mvtFlux || 0) : 0; };
    LeMouvement.posture = function (b) { return b ? (b._mvtVoie || '') : ''; };
})();
