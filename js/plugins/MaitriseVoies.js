//=============================================================================
// MaitriseVoies.js — v1.0
// Le CORPS — les 5 Voies de la Maîtrise (Forge · Onde · Source · Miroir · Vide)
// RPG Maker MV   ·   by JOKO
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Les 5 Voies de la Maîtrise (Corps) : Forge, Onde, Source,
 * Miroir, Vide — chacune avec son coup signature. Progresse par le combat.
 * @author JOKO
 *
 * @param forgeRate
 * @text Forge — bonus de dégâts (×)
 * @type number
 * @decimals 2
 * @default 1.50
 * @desc « Le Point Final » : les frappes Forge font ×forgeRate de dégâts.
 *
 * @param forgeWhiff
 * @text Forge — recul si l'attaque rate (% PV max)
 * @type number
 * @min 0
 * @default 12
 * @desc Tout ou rien : si une frappe Forge RATE, le lanceur perd ce % de ses PV max (l'élan gâché).
 *
 * @param ondeMult
 * @text Onde — force du Reflux (×)
 * @type number
 * @decimals 2
 * @default 2.00
 * @desc « Le Reflux » : après une technique Onde, la prochaine attaque reçue est contrée à ×ondeMult.
 *
 * @param sourceHealPct
 * @text Source — soin (% des dégâts infligés)
 * @type number
 * @min 0
 * @default 60
 * @desc « Le Reflux des chairs » : une technique Source rend au lanceur ce % des dégâts qu'elle inflige (min : sourceHealFlat).
 *
 * @param sourceHealFlat
 * @text Source — soin minimum (% PV max)
 * @type number
 * @min 0
 * @default 8
 * @desc Soin plancher d'une technique Source (même sans dégâts), en % des PV max du lanceur.
 *
 * @param miroirReduce
 * @text Miroir — réduction des dégâts reçus (%)
 * @type number
 * @min 0
 * @max 100
 * @default 30
 * @desc « Le Renvoi » : après une technique Miroir, la prochaine attaque reçue est atténuée de ce %…
 *
 * @param miroirReflect
 * @text Miroir — part renvoyée à l'agresseur (%)
 * @type number
 * @min 0
 * @default 100
 * @desc …et l'agresseur encaisse ce % des dégâts qu'il aurait infligés (il frappe sa propre image).
 *
 * @param videPierce
 * @text Vide — défense ignorée (%)
 * @type number
 * @min 0
 * @max 100
 * @default 40
 * @desc « L'Immobile » : le flux interne traverse ; les techniques Vide ignorent ce % de la défense/résistance de la cible.
 *
 * @param videCorruption
 * @text Vide — corruption ajoutée par usage
 * @type number
 * @min 0
 * @default 2
 * @desc L'aura disparaît… mauvais signe : chaque technique Vide enfonce le lanceur (jauge de la Bête, via window.Corruption).
 *
 * @param masteryPerUse
 * @text Maîtrise gagnée par usage
 * @type number
 * @min 0
 * @default 1
 * @desc « Progresse par le combat » : maîtrise gagnée dans une Voie à chaque technique lancée dans cette Voie.
 *
 * @param masteryScale
 * @text Bonus par point de maîtrise (%)
 * @type number
 * @decimals 2
 * @default 0.50
 * @desc Chaque point de maîtrise d'une Voie ajoute ce % à ses effets chiffrés (plafonné par masteryCap).
 *
 * @param masteryCap
 * @text Maîtrise maximale par Voie
 * @type number
 * @min 0
 * @default 40
 *
 * @param --- VOIES ANIME ---
 * @default
 *
 * @param eclairCrit
 * @text Éclair — bonus de critique
 * @type number
 * @decimals 2
 * @default 0.50
 * @desc « l'Instant Foudroyant » : + chance de critique, et la frappe ne rate jamais (ignore l'esquive).
 *
 * @param domaineRate
 * @text Domaine — dégâts (×)
 * @type number
 * @decimals 2
 * @default 1.30
 * @desc « le Territoire Scellé » : touche GARANTIE (aucune esquive) et dégâts ×domaineRate.
 *
 * @param domaineCorruption
 * @text Domaine — corruption ajoutée
 * @type number
 * @min 0
 * @default 3
 * @desc Ouvrir un Territoire puise profond dans la source : enfonce vers la Bête (via window.Corruption).
 *
 * @param flashChance
 * @text Flash — proba d'Éclat Noir (%)
 * @type number
 * @min 0
 * @max 100
 * @default 25
 * @desc « l'Éclat Noir » (Black Flash) : chance que la frappe se distorde en coup dévastateur.
 *
 * @param flashMult
 * @text Flash — dégâts sur Éclat Noir (×)
 * @type number
 * @decimals 2
 * @default 2.50
 *
 * @param sangSteal
 * @text Sang — vol de vie (% des dégâts)
 * @type number
 * @min 0
 * @default 45
 * @desc « l'Art du Sang » : le lanceur se soigne d'une part des dégâts infligés (drain).
 *
 * @param showLog
 * @text Messages de combat ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES 5 VOIES DE LA MAÎTRISE  (le Corps)                             by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  La Maîtrise ne se distingue pas par le tempérament, mais par la TECHNIQUE
 *  pure — une manière propre de mouvoir le flux du mana sombre. Cinq grandes
 *  voies se transmettent, chacune avec son coup signature.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  DÉCLARER LA VOIE D'UNE TECHNIQUE
 *  ─────────────────────────────────────────────────────────────────────────
 *  Dans la Note d'un skill :   <Voie: forge>   (ou onde / source / miroir / vide)
 *
 *  Un acteur/ennemi/classe peut aussi déclarer une voie PAR DÉFAUT, qui
 *  s'applique à ses techniques de Maîtrise non taguées :
 *      <VoieDefaut: onde>
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LES COUPS SIGNATURE
 *  ─────────────────────────────────────────────────────────────────────────
 *  ▶ FORGE — « le Point Final ». La puissance brute : ×forgeRate de dégâts.
 *      Mais c'est tout ou rien : si la frappe RATE, le lanceur se blesse
 *      (forgeWhiff % de ses PV max).
 *
 *  ▶ ONDE — « le Reflux ». On n'arrête pas la force, on la retourne : après
 *      une technique Onde, la PROCHAINE attaque subie est contrée à ×ondeMult.
 *
 *  ▶ SOURCE — « le Reflux des chairs ». La rare voie qui répare : la technique
 *      soigne le lanceur (sourceHealPct % des dégâts, plancher sourceHealFlat).
 *
 *  ▶ MIROIR — « le Renvoi ». Peu de gestes, justes : après une technique
 *      Miroir, la prochaine attaque subie est atténuée (miroirReduce %) et
 *      l'agresseur encaisse sa propre image (miroirReflect %).
 *
 *  ▶ VIDE — « l'Immobile ». La voie interne : le flux traverse la garde
 *      (ignore videPierce % de la défense). Mais l'aura disparaît — mauvais
 *      signe : chaque usage enfonce vers la Bête (+videCorruption).
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  VOIES INTERDITES / ÉTRANGÈRES  (inspiration anime)
 *  ─────────────────────────────────────────────────────────────────────────
 *  ▶ ÉCLAIR — « l'Instant Foudroyant ». Vitesse pure : + critique, et la frappe
 *      ne rate JAMAIS (ignore l'esquive).
 *  ▶ DOMAINE — « le Territoire Scellé ». On enferme la cible : touche GARANTIE
 *      et dégâts ×domaineRate — mais ouvrir un Territoire puise profond (+corruption).
 *  ▶ FLASH — « l'Éclat Noir ». Une frappe qui se distord : chance (flashChance)
 *      d'un coup dévastateur ×flashMult.
 *  ▶ SANG — « l'Art du Sang ». Drain : le lanceur se soigne d'une part des
 *      dégâts infligés (sangSteal %).
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  PROGRESSER PAR LE COMBAT
 *  ─────────────────────────────────────────────────────────────────────────
 *  Chaque technique lancée fait gagner de la MAÎTRISE dans sa Voie
 *  (masteryPerUse), ce qui renforce peu à peu ses effets (masteryScale %,
 *  plafonné à masteryCap). « Un duel est une leçon volée. »
 *
 *  Script :  Voies.mastery(actorId, 'forge')   → niveau de maîtrise
 *  Commande de plugin :  VOIES ecran           (aperçu rapide en message)
 *
 *  Dépendances : aucune obligatoire. S'intègre à ManaAffinity (prix du Corps)
 *  et CorruptionAme (la Bête) s'ils sont présents.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('MaitriseVoies');
    var N = function (k, d) { var v = parseFloat(P[k]); return isNaN(v) ? d : v; };
    var FORGE_RATE   = N('forgeRate', 1.5);
    var FORGE_WHIFF  = N('forgeWhiff', 12) / 100;
    var ONDE_MULT    = N('ondeMult', 2.0);
    var SRC_PCT      = N('sourceHealPct', 60) / 100;
    var SRC_FLAT     = N('sourceHealFlat', 8) / 100;
    var MIR_REDUCE   = N('miroirReduce', 30) / 100;
    var MIR_REFLECT  = N('miroirReflect', 100) / 100;
    var VIDE_PIERCE  = N('videPierce', 40) / 100;
    var VIDE_CORR    = N('videCorruption', 2);
    var MAST_USE     = N('masteryPerUse', 1);
    var MAST_SCALE   = N('masteryScale', 0.5) / 100;
    var MAST_CAP     = N('masteryCap', 40);
    var SHOW_LOG     = String(P['showLog'] || 'true') === 'true';

    // --- Voies inspirées d'anime (extensions) ---
    var ECLAIR_CRIT  = N('eclairCrit', 0.5);          // + chance de critique
    var DOM_RATE     = N('domaineRate', 1.30);        // × dégâts (touche garantie)
    var DOM_CORR     = N('domaineCorruption', 3);     // ouvrir un Territoire puise profond
    var FLASH_CHANCE = N('flashChance', 25) / 100;    // proba d'Éclat Noir
    var FLASH_MULT   = N('flashMult', 2.50);          // × dégâts sur Éclat Noir
    var SANG_STEAL   = N('sangSteal', 45) / 100;      // % des dégâts volés en PV

    // 5 voies canoniques + 4 voies anime.
    var VOIES = ['forge', 'onde', 'source', 'miroir', 'vide',
                 'eclair', 'domaine', 'flash', 'sang'];

    function log(text) {
        if (!SHOW_LOG) return;
        var s = SceneManager._scene;
        if (s && s._logWindow) s._logWindow.addText(text);
    }

    function normVoie(str) {
        if (!str) return '';
        var s = String(str).toLowerCase().trim();
        return VOIES.indexOf(s) >= 0 ? s : '';
    }

    //=========================================================================
    // MAÎTRISE (progression par le combat) — stockée dans $gameSystem
    //=========================================================================

    var Voies = {
        _store: function () {
            if (!$gameSystem) return {};
            if (!$gameSystem._voieMastery) $gameSystem._voieMastery = {};
            return $gameSystem._voieMastery;
        },
        mastery: function (actorId, voie) {
            var s = this._store()[actorId];
            return (s && s[normVoie(voie)]) || 0;
        },
        gain: function (actorId, voie, n) {
            voie = normVoie(voie); if (!voie || !actorId) return;
            var store = this._store();
            if (!store[actorId]) store[actorId] = {};
            var before = store[actorId][voie] || 0;
            store[actorId][voie] = Math.min(MAST_CAP, before + (n || MAST_USE));
        },
        // Facteur d'échelle (1 + maîtrise × scale) pour un battler acteur.
        scale: function (battler, voie) {
            if (!battler || !battler.isActor || !battler.isActor()) return 1;
            return 1 + this.mastery(battler.actorId(), voie) * MAST_SCALE;
        }
    };
    window.Voies = Voies;

    //=========================================================================
    // VOIE D'UNE ACTION : notetag skill <Voie:>, sinon <VoieDefaut:> du lanceur
    //=========================================================================

    function metasOf(battler) {
        var m = [];
        if (!battler) return m;
        if (battler.isEnemy && battler.isEnemy() && battler.enemy()) m.push(battler.enemy().meta);
        else if (battler.isActor && battler.isActor()) {
            if (battler.actor()) m.push(battler.actor().meta);
            if (battler.currentClass && battler.currentClass()) m.push(battler.currentClass().meta);
        }
        return m;
    }

    function actionVoie(action) {
        var item = action.item();
        if (item && item.meta && item.meta.Voie) {
            var v = normVoie(item.meta.Voie);
            if (v) return v;
        }
        var metas = metasOf(action.subject());
        for (var i = 0; i < metas.length; i++) {
            if (metas[i] && metas[i].VoieDefaut) {
                var d = normVoie(metas[i].VoieDefaut);
                if (d) return d;
            }
        }
        return '';
    }

    //=========================================================================
    // FORGE (dégâts ×) & VIDE (perce la défense) — multiplicateur de dégâts
    //=========================================================================

    var _makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var value = _makeDamageValue.call(this, target, critical);
        if (value <= 0) return value;
        var voie = actionVoie(this);
        if (!voie) return value;
        var subject = this.subject();

        if (voie === 'forge') {
            value = Math.floor(value * FORGE_RATE * Voies.scale(subject, 'forge'));
        } else if (voie === 'vide') {
            // Le flux interne traverse la garde : la frappe mord plus profond.
            // Bonus borné, proportionnel à la « défense ignorée ».
            var pierce = Math.min(0.95, VIDE_PIERCE * Voies.scale(subject, 'vide'));
            value = Math.floor(value * (1 + pierce * 0.5));
        } else if (voie === 'domaine') {
            // Le Territoire amplifie la sentence.
            value = Math.floor(value * DOM_RATE * Voies.scale(subject, 'domaine'));
        } else if (voie === 'flash') {
            // L'Éclat Noir : la frappe se distord parfois en coup dévastateur.
            var chance = Math.min(0.9, FLASH_CHANCE * Voies.scale(subject, 'flash'));
            if (Math.random() < chance) {
                this._voieFlash = true;
                value = Math.floor(value * FLASH_MULT);
            }
        }
        return value;
    };

    //=========================================================================
    // ÉCLAIR & DOMAINE — touche garantie (ignore l'esquive) ; ÉCLAIR — critique
    //=========================================================================

    var _itemHit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function (target) {
        var v = actionVoie(this);
        if (v === 'eclair' || v === 'domaine') return 1.0;   // ne rate jamais
        return _itemHit.call(this, target);
    };
    var _itemEva = Game_Action.prototype.itemEva;
    Game_Action.prototype.itemEva = function (target) {
        var v = actionVoie(this);
        if (v === 'eclair' || v === 'domaine') return 0;      // ignore l'esquive
        return _itemEva.call(this, target);
    };
    var _itemCri = Game_Action.prototype.itemCri;
    Game_Action.prototype.itemCri = function (target) {
        var base = _itemCri.call(this, target);
        if (actionVoie(this) === 'eclair') {
            return Math.min(1, base + ECLAIR_CRIT * Voies.scale(this.subject(), 'eclair'));
        }
        return base;
    };

    //=========================================================================
    // APPLICATION : signatures Onde / Source / Miroir / Vide-corruption + whiff
    //=========================================================================

    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        var voie = actionVoie(this);
        if (!voie) return;
        var subject = this.subject();
        if (!subject) return;
        var result = target && target.result ? target.result() : null;

        // Maîtrise : chaque usage fait progresser (acteurs).
        if (subject.isActor && subject.isActor()) Voies.gain(subject.actorId(), voie, MAST_USE);

        switch (voie) {
            case 'forge':
                // Tout ou rien : une frappe qui rate blesse le forgeron.
                if (result && result.used && result.missed || (result && result.evaded)) {
                    var self = Math.max(1, Math.floor(subject.mhp * FORGE_WHIFF));
                    subject.gainHp(-self); subject.startDamagePopup(); subject.clearResult();
                    log((subject.name ? subject.name() : 'Le lanceur') + ' rate le Point Final et se déchire (-' + self + ' PV).');
                    if (subject.isDead()) subject.performCollapse();
                }
                break;

            case 'onde':
                // Le Reflux : arme une contre-attaque sur la prochaine frappe subie.
                subject._voieReflux = ONDE_MULT * Voies.scale(subject, 'onde');
                log((subject.name ? subject.name() : 'Le lanceur') + ' épouse le flux : le Reflux est armé.');
                break;

            case 'miroir':
                // Le Renvoi : atténue la prochaine frappe et la renvoie à l'agresseur.
                subject._voieRenvoi = { reduce: Math.min(0.95, MIR_REDUCE * Voies.scale(subject, 'miroir')), reflect: MIR_REFLECT };
                log((subject.name ? subject.name() : 'Le lanceur') + ' se replie : le Renvoi est prêt.');
                break;

            case 'source':
                // Le Reflux des chairs : la Maîtrise qui répare.
                if (result && subject.isAlive()) {
                    var dmg = (result.hpDamage > 0) ? result.hpDamage : 0;
                    var heal = Math.max(Math.floor(subject.mhp * SRC_FLAT), Math.floor(dmg * SRC_PCT * Voies.scale(subject, 'source')));
                    if (heal > 0) {
                        subject.gainHp(heal); subject.startDamagePopup();
                        log((subject.name ? subject.name() : 'Le lanceur') + ' referme ses chairs (+' + heal + ' PV).');
                    }
                }
                break;

            case 'vide':
                // L'aura disparaît — mauvais signe : on s'enfonce vers la Bête.
                if (VIDE_CORR > 0 && subject.isActor && subject.isActor() && window.Corruption) {
                    try { window.Corruption.add(subject.actorId(), VIDE_CORR); } catch (e) {}
                }
                break;

            case 'domaine':
                // Ouvrir un Territoire puise profond dans la source.
                if (DOM_CORR > 0 && subject.isActor && subject.isActor() && window.Corruption) {
                    try { window.Corruption.add(subject.actorId(), DOM_CORR); } catch (e) {}
                }
                break;

            case 'flash':
                // L'Éclat Noir a-t-il jailli ? (drapeau posé dans makeDamageValue)
                if (this._voieFlash) {
                    this._voieFlash = false;
                    if ($gameScreen) $gameScreen.startFlash([20, 20, 40, 200], 20);
                    log('✦ ' + (subject.name ? subject.name() : 'Le lanceur') + ' — ÉCLAT NOIR ! La frappe se distord.');
                }
                break;

            case 'sang':
                // L'Art du Sang : drain — une part des dégâts revient en PV.
                if (result && subject.isAlive()) {
                    var dealt = (result.hpDamage > 0) ? result.hpDamage : 0;
                    var drain = Math.floor(dealt * SANG_STEAL * Voies.scale(subject, 'sang'));
                    if (drain > 0) {
                        subject.gainHp(drain); subject.startDamagePopup();
                        log((subject.name ? subject.name() : 'Le lanceur') + ' boit le sang de la blessure (+' + drain + ' PV).');
                    }
                }
                break;
        }
    };

    //=========================================================================
    // RÉACTIF — consommer Reflux (Onde) & Renvoi (Miroir) à la frappe suivante
    //   Hook bas niveau : quand un battler PORTEUR d'un flag subit des dégâts.
    //=========================================================================

    var _executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        // Miroir : atténuer AVANT d'appliquer, puis renvoyer à l'agresseur.
        var attacker = this.subject();
        var renvoi = target && target._voieRenvoi;
        if (value > 0 && renvoi && attacker && attacker !== target) {
            var reduced = Math.floor(value * (1 - renvoi.reduce));
            var back = Math.max(1, Math.floor(value * renvoi.reflect));
            target._voieRenvoi = null;
            _executeDamage.call(this, target, reduced);
            if (attacker.isAlive()) {
                attacker.gainHp(-back); attacker.startDamagePopup(); attacker.clearResult();
                log((target.name ? target.name() : 'La cible') + ' renvoie l\'attaque : ' +
                    (attacker.name ? attacker.name() : 'l\'agresseur') + ' frappe sa propre image (-' + back + ' PV).');
                if (attacker.isDead()) attacker.performCollapse();
            }
            return;
        }

        _executeDamage.call(this, target, value);

        // Onde : contrer la frappe subie.
        var reflux = target && target._voieReflux;
        if (value > 0 && reflux && attacker && attacker !== target && target.isAlive()) {
            target._voieReflux = null;
            var counter = Math.max(1, Math.floor(value * reflux));
            attacker.gainHp(-counter); attacker.startDamagePopup(); attacker.clearResult();
            log((target.name ? target.name() : 'La cible') + ' retourne la force : Reflux ! ' +
                (attacker.name ? attacker.name() : 'l\'agresseur') + ' encaisse -' + counter + ' PV.');
            if (attacker.isDead()) attacker.performCollapse();
        }
    };

    // Nettoyage des flags réactifs en fin de combat (évite les fuites).
    var _endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        $gameParty.members().concat($gameTroop.members()).forEach(function (b) {
            if (b) { b._voieReflux = null; b._voieRenvoi = null; }
        });
        _endBattle.call(this, result);
    };

    //=========================================================================
    // Commande de plugin : VOIES ecran  (aperçu maîtrise du groupe)
    //=========================================================================

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'VOIES') return;
        if ((args[0] || '').toLowerCase() === 'ecran') {
            var lines = [];
            $gameParty.members().forEach(function (a) {
                var parts = VOIES.map(function (v) {
                    var m = Voies.mastery(a.actorId(), v);
                    return m > 0 ? (v[0].toUpperCase() + v.slice(1) + ' ' + m) : null;
                }).filter(Boolean);
                lines.push('\\C[6]' + a.name() + '\\C[0] : ' + (parts.length ? parts.join(' · ') : 'aucune voie entamée'));
            });
            if ($gameMessage) $gameMessage.add(lines.join('\n') || 'Aucune Maîtrise.');
        }
    };

})();
