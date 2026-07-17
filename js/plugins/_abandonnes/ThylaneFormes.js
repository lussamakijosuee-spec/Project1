//=============================================================================
// AëlFormes.js — v1.0  ·  Les trois formes de Aël :
//   Berserk (rage aveugle) · Art Serein (corps sans émotion) · Semi (mélange)
// RPG Maker MV   ·   by JOKO   ·   charger APRÈS YEP_BattleEngineCore & ParolesSysteme
//=============================================================================
/*:
 * @target MV
 * @plugindesc v1.0 ■ Formes de Aël : Berserk frappe ses alliés si on l'arrête ;
 * l'Art Serein abandonne la defense des allies ; le Semi ne tient qu'a l'esprit normal.
 * @author JOKO
 *
 * @param ActorId
 * @text Acteur concerné (Aël)
 * @type actor
 * @default 1
 *
 * @param SanityVar
 * @text Variable de santé mentale (1–10)
 * @type variable
 * @default 11
 *
 * @param BerserkState
 * @text État Berserk
 * @type state
 * @default 12
 *
 * @param SereinState
 * @text État Art Serein
 * @type state
 * @default 205
 *
 * @param SemiState
 * @text État Semi-Transformation
 * @type state
 * @default 206
 *
 * @param SemiMin
 * @text Semi — santé mentale minimale
 * @type number
 * @default 6
 *
 * @param SemiMax
 * @text Semi — santé mentale maximale
 * @type number
 * @default 8
 *
 * @param SereinAllyExtra
 * @text Art Serein — surcoût de dégâts subis par les alliés
 * @desc Les alliés (hors Aël) subissent +X% de dégâts tant qu'elle est en Art Serein. 0.25 = +25%.
 * @default 0.25
 *
 * @param BerserkLashChance
 * @text Berserk — chance de bousculer un allié en fin de tour (%)
 * @type number
 * @default 20
 *
 * @help
 * ============================================================================
 *  AëlFormes — cohérence des trois formes                            JOKO
 * ============================================================================
 *  Les états/compétences sont déjà en base. Ce plugin garantit l'IDENTITÉ et
 *  les DÉFAUTS de chaque forme, ainsi que l'exclusivité (une seule à la fois).
 *
 *  • BERSERK (rage aveugle, santé mentale basse) :
 *      – Si un allié essaie de l'ARRÊTER (soin, buff, réveil, dissipation de
 *        l'état), elle se RETOURNE et frappe violemment cet allié.
 *      – En fin de tour, faible chance qu'elle BOUSCULE un allié au hasard.
 *      – (Le contrecoup en PV est géré par l'état lui-même.)
 *
 *  • ART SEREIN (corps sans émotion, santé mentale haute) :
 *      – Le corps n'agit QUE pour éliminer l'adversaire. Il ne protège plus
 *        personne : les alliés subissent +25% de dégâts tant que la forme dure.
 *
 *  • SEMI (mélange parfait, santé mentale NORMALE 6–8) :
 *      – Tous les atouts, aucun défaut de combat… mais la forme se BRISE dès
 *        que la santé mentale quitte la zone normale (trop haute ou trop basse).
 *
 *  Exclusivité : entrer dans une forme retire automatiquement les deux autres.
 * ============================================================================
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('AëlFormes');
    var ACTOR_ID    = Number(P['ActorId'] || 1);
    var SAN_VAR     = Number(P['SanityVar'] || 11);
    var ST_BERSERK  = Number(P['BerserkState'] || 12);
    var ST_SEREIN   = Number(P['SereinState'] || 205);
    var ST_SEMI     = Number(P['SemiState'] || 206);
    var SEMI_MIN    = Number(P['SemiMin'] || 6);
    var SEMI_MAX    = Number(P['SemiMax'] || 8);
    var SEREIN_X    = parseFloat(P['SereinAllyExtra'] || 0.25) || 0;
    var LASH_PCT    = Number(P['BerserkLashChance'] || 20);

    var FORMS = [ST_BERSERK, ST_SEREIN, ST_SEMI];

    function isAël(b) { return b && b.isActor && b.isActor() && b.actorId && b.actorId() === ACTOR_ID; }
    function thylane()    { return $gameActors ? $gameActors.actor(ACTOR_ID) : null; }
    function sanity()     { return $gameVariables ? $gameVariables.value(SAN_VAR) : 7; }
    function inBattle()   { return !!($gameParty && $gameParty.inBattle()); }
    function log(msg) {
        var w = (SceneManager._scene && SceneManager._scene._logWindow) || BattleManager._logWindow;
        if (w) { w.push('addText', msg); w.push('wait'); }
    }
    function otherLivingAllies(excl) {
        if (!$gameParty) return [];
        return $gameParty.aliveMembers().filter(function (a) { return a !== excl; });
    }

    //========================================================================
    // 1) EXCLUSIVITÉ DES FORMES — entrer dans l'une retire les autres
    //========================================================================
    var _addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        if (isAël(this) && FORMS.indexOf(stateId) >= 0) {
            FORMS.forEach(function (s) {
                if (s !== stateId && this.isStateAffected(s)) this.removeState(s);
            }, this);
        }
        _addState.call(this, stateId);
    };

    //========================================================================
    // 2) BERSERK — « si on l'arrête, elle frappe ses amis »
    //    Détecte une action AMICALE ciblant Aël enragée et la fait se
    //    retourner contre un allié.
    //========================================================================
    function helpfulAction(action) {
        if (!action || !action.item || !action.item()) return false;
        if (!action.isForFriend()) return false;
        // soin PV/PM, dissipation d'état, réveil, ou buff
        if (action.isRecover && action.isRecover()) return true;
        if (action.isHpRecover && action.isHpRecover()) return true;
        if (action.isMpRecover && action.isMpRecover()) return true;
        var effs = action.item().effects || [];
        return effs.some(function (e) {
            return e.code === 22 /*remove state*/ || e.code === 31 /*add buff*/ ||
                   e.code === 11 /*recover HP*/  || e.code === 12 /*recover MP*/ ||
                   e.code === 13 /*recover TP*/;
        });
    }

    function berserkRetaliate(subject) {
        var thy = thylane();
        if (!thy || !thy.isStateAffected(ST_BERSERK) || thy.isDead()) return;
        // Cible privilégiée : celui qui a tenté de l'arrêter ; sinon un allié au hasard.
        var pool = otherLivingAllies(thy);
        if (!pool.length) return;
        var victim = (subject && pool.indexOf(subject) >= 0) ? subject
                    : pool[Math.randomInt(pool.length)];
        var dmg = Math.max(1, Math.floor(thy.atk * 1.4));
        $gameScreen.startFlash([255, 40, 40, 150], 18);
        $gameScreen.startShake(5, 5, 18);
        thy.startAnimation(11);
        victim.gainHp(-dmg);
        victim.startDamagePopup();
        AudioManager.playSe({ name: 'Blow3', volume: 90, pitch: 90, pan: 0 });
        log('« N’APPROCHE PAS ! » ' + thy.name() + ' se retourne et frappe ' + victim.name() + ' !');
        if (victim.isDead()) victim.performCollapse();
    }

    var _GA_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _GA_apply.call(this, target);
        if (!inBattle()) return;
        var subj = this.subject();
        if (isAël(target) && target.isStateAffected(ST_BERSERK) &&
            subj && subj.isActor && subj.isActor() && subj !== target &&
            helpfulAction(this)) {
            // On laisse l'effet amical se résoudre, puis Aël riposte.
            berserkRetaliate(subj);
        }
    };

    // Bousculade aléatoire en fin de tour (rage qui déborde)
    var _onTurnEnd = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function () {
        _onTurnEnd.call(this);
        if (!inBattle()) return;
        if (isAël(this) && this.isStateAffected(ST_BERSERK) && this.isAlive()) {
            if (Math.randomInt(100) < LASH_PCT) {
                var pool = otherLivingAllies(this);
                if (pool.length) {
                    var v = pool[Math.randomInt(pool.length)];
                    var d = Math.max(1, Math.floor(this.atk * 0.6));
                    v.gainHp(-d); v.startDamagePopup();
                    $gameScreen.startShake(3, 3, 10);
                    AudioManager.playSe({ name: 'Blow1', volume: 70, pitch: 100, pan: 0 });
                    log(this.name() + ' bouscule ' + v.name() + ' dans sa fureur.');
                    if (v.isDead()) v.performCollapse();
                }
            }
        }
        // SEMI — vérifie que l'esprit reste normal, sinon la forme se brise
        if (isAël(this) && this.isStateAffected(ST_SEMI)) {
            var j = sanity();
            if (j < SEMI_MIN || j > SEMI_MAX) {
                this.removeState(ST_SEMI);
                $gameScreen.startFlash([180, 220, 220, 120], 24);
                AudioManager.playSe({ name: 'Collapse1', volume: 80, pitch: 110, pan: 0 });
                log('La Semi-Transformation se brise — l’esprit de ' + this.name() + ' vacille hors de l’équilibre.');
            }
        }
    };

    //========================================================================
    // 3) ART SEREIN — « sans protéger ses amis » : les alliés encaissent plus
    //========================================================================
    if (SEREIN_X > 0) {
        var _execDmg = Game_Action.prototype.executeDamage;
        Game_Action.prototype.executeDamage = function (target, value) {
            if (value > 0 && target && target.isActor && target.isActor() &&
                target.actorId() !== ACTOR_ID) {
                var subj = this.subject();
                if (subj && subj.isEnemy && subj.isEnemy()) {
                    var thy = thylane();
                    if (thy && thy.isStateAffected(ST_SEREIN) && thy.isAlive()) {
                        value = Math.floor(value * (1 + SEREIN_X));
                    }
                }
            }
            _execDmg.call(this, target, value);
        };
    }

})();
