/*:
 * @target MV
 * @plugindesc Boss Mahoraga v2 – Maître des Arts Martiaux Évolutif
 * @author MahoragaBoss Enhanced
 *
 * @param PureManaElementId
 * @text Éléments du Mana Pur
 * @type string
 * @default 7, 16
 * @desc Ces éléments infligent ×2 dégâts et augmentent la Rage. Le canon
 * donne DEUX éléments au Mana Pur : 7 (AME) et 16 (mana semi parfait).
 * L'ancienne valeur 5 désignait « Mana Sombre », replié sur 4 — plus aucune
 * compétence ne pointe dessus, la faiblesse ne se déclenchait donc jamais.
 *
 * @param CounterSkillIds_P1
 * @text Compétences Contre – Phase 1 (Arrogance)
 * @type string
 * @default 63, 37, 41
 * @desc Compétences de punition pendant la phase d'arrogance.
 *
 * @param CounterSkillIds_P2
 * @text Compétences Contre – Phase 2 (Engagement)
 * @type string
 * @default 63, 37, 41
 * @desc Compétences de punition quand Mahoraga s'investit.
 *
 * @param CounterSkillIds_P3
 * @text Compétences Contre – Phase 3 (Furie)
 * @type string
 * @default 63, 37, 41
 * @desc Compétences de punition en mode furie totale.
 *
 * @param AdaptationAnimId
 * @text Animation – Adaptation
 * @type number
 * @default 0
 *
 * @param PhaseAnimId
 * @text Animation – Transition de Phase
 * @type number
 * @default 0
 *
 * @param BerserkAnimId
 * @text Animation – Mode Berserk
 * @type number
 * @default 0
 *
 * @param AdaptSE
 * @text Son – Adaptation
 * @type string
 * @default devine-wheel-adapting
 *
 * @param ImmuneSE
 * @text Son – Immunité / Réduction
 * @type string
 * @default mahoraga-devine-wheel-adapting-sound
 *
 * @param PhaseSE
 * @text Son – Transition de Phase
 * @type string
 * @default
 *
 * @param BerserkSE
 * @text Son – Mode Berserk
 * @type string
 * @default
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    //  PARAMÈTRES
    // ═══════════════════════════════════════════════════════════════
    const P = PluginManager.parameters('MahoragaBoss');

    // Le Mana Pur porte DEUX éléments dans le canon (7 et 16) : on lit une
    // liste, pas un seul identifiant.
    const PURE_MANA = String(P['PureManaElementId'] || '7, 16')
        .split(',').map(function (s) { return Number(s.trim()); })
        .filter(function (n) { return n > 0; });
    function estManaPur(elemId) { return PURE_MANA.indexOf(elemId) >= 0; }
    const AN_ADAPT   = Number(P['AdaptationAnimId']  || 0);
    const AN_PHASE   = Number(P['PhaseAnimId']        || 0);
    const AN_BERSERK = Number(P['BerserkAnimId']      || 0);
    const SE_ADAPT   = String(P['AdaptSE']   || 'devine-wheel-adapting');
    const SE_IMMUNE  = String(P['ImmuneSE']  || 'mahoraga-devine-wheel-adapting-sound');
    const SE_PHASE   = String(P['PhaseSE']   || '');
    const SE_BERSERK = String(P['BerserkSE'] || '');

    function parseIds(key, def) {
        return (P[key] || def).split(',')
            .map(function (s) { return Number(s.trim()); })
            .filter(function (n) { return n > 0; });
    }

    // [0] = Phase 1, [1] = Phase 2, [2] = Phase 3
    const POOLS = [
        parseIds('CounterSkillIds_P1', '63,37,41'),
        parseIds('CounterSkillIds_P2', '63,37,41'),
        parseIds('CounterSkillIds_P3', '63,37,41'),
    ];

    // ═══════════════════════════════════════════════════════════════
    //  DIALOGUES  ← modifier ici pour changer les répliques en jeu
    // ═══════════════════════════════════════════════════════════════
    const DLG = {

        // ── Phase 1 : Arrogance totale ──────────────────────────────
        1: {
            phaseIn : "Mahoraga : « Tu oses me frapper ? Bien… montre-moi ce dont tu es capable. »",
            newSkill: "Mahoraga : « …Mémorisé. »",
            firstHit: "Mahoraga : « …Hmph. »",
            immune  : "Mahoraga : « Tu répètes la même erreur ? Décevant. »",
            counter : "Mahoraga : « Laisse-moi te montrer la différence entre nous. »",
            skip    : "Mahoraga : « …Ça ne mérite même pas ma réponse. »",
            predict : "",
            r25: "", r50: "", r75: "",
        },

        // ── Phase 2 : Le combat l'intéresse ────────────────────────
        2: {
            phaseIn : "Mahoraga : « …Intéressant. Il semblerait que je t'aie sous-estimé. »",
            newSkill: "Mahoraga : « Bonne technique. Mais elle ne fonctionnera plus. »",
            firstHit: "Mahoraga : « Bonne technique. Mais elle ne fonctionnera plus. »",
            immune  : "Mahoraga : « Tu croyais me surprendre avec ça ? »",
            counter : "Mahoraga : « Voilà… c'est ce que je veux voir. »",
            skip    : "",
            predict : "Mahoraga : « Je l'avais déjà anticipé. »",
            r25: "Mahoraga : « Mon sang commence à circuler. »",
            r50: "Mahoraga : « Ha… je sens l'adrénaline. »",
            r75: "",
        },

        // ── Phase 3 : Furie et amour du combat mêlés ────────────────
        3: {
            phaseIn : "Mahoraga : « …OUI. TU M'AS FORCÉ À ME BATTRE SÉRIEUSEMENT ! »",
            newSkill: "Mahoraga : « HA ! ENCORE UNE NOUVELLE TECHNIQUE ! »",
            firstHit: "Mahoraga : « HA ! ENCORE UNE NOUVELLE TECHNIQUE ! »",
            immune  : "Mahoraga : « INUTILE ! »",
            counter : "Mahoraga : « JE VIS POUR CES MOMENTS ! »",
            skip    : "",
            predict : "Mahoraga : « PRÉVISIBLE ! Tu n'as plus de surprises pour moi ! »",
            r25: "Mahoraga : « Le feu dans mes veines… MAGNIFIQUE ! »",
            r50: "Mahoraga : « Plus fort ! POUSSE-MOI ENCORE ! »",
            r75: "Mahoraga : « MON CORPS BRÛLE ! C'EST MERVEILLEUX ! »",
        },

        berserk : "Mahoraga : « TROP… TROP BIEN ! L'INSTINCT PREND LE DESSUS ! »",
        pureMana: "Mahoraga : « Gh… le Mana Pur. Je déteste… cette sensation. »",
    };

    // ═══════════════════════════════════════════════════════════════
    //  UTILITAIRES
    // ═══════════════════════════════════════════════════════════════
    function playSe(name) {
        if (name) AudioManager.playSe({ name: name, volume: 90, pitch: 100, pan: 0 });
    }
    function battleMsg(text) {
        if (text && BattleManager._logWindow) {
            BattleManager._logWindow.push('addText', text);
        }
    }
    function pickRnd(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    function playAnim(battler, id) {
        if (id > 0) battler.requestAnimation(id);
    }

    // ═══════════════════════════════════════════════════════════════
    //  isMahoraga sécurisé sur TOUS les battlers (évite les erreurs
    //  sur Game_Actor qui ne possède pas cette méthode)
    // ═══════════════════════════════════════════════════════════════
    Game_BattlerBase.prototype.isMahoraga = function () { return false; };

    // ═══════════════════════════════════════════════════════════════
    //  EXTENSIONS Game_Enemy
    // ═══════════════════════════════════════════════════════════════

    Game_Enemy.prototype.isMahoraga = function () {
        return !!(this.enemy() && this.enemy().meta.Mahoraga);
    };

    /** Phase actuelle (1 / 2 / 3) calculée sur les PV courants */
    Game_Enemy.prototype.mPhase = function () {
        var r = this.hpRate();
        return r > 0.66 ? 1 : r > 0.33 ? 2 : 3;
    };

    /** Pool de compétences de contre selon la phase */
    Game_Enemy.prototype.mPool = function () {
        return POOLS[this.mPhase() - 1];
    };

    /**
     * Multiplicateur de dégâts SORTANTS basé sur la Rage.
     *  0  → ×1.00   25 → ×1.25   50 → ×1.50   75 → ×1.75   100 → ×2.00
     */
    Game_Enemy.prototype.mRageMult = function () {
        var r = this._mRage || 0;
        if (r >= 100) return 2.00;
        if (r >= 75)  return 1.75;
        if (r >= 50)  return 1.50;
        if (r >= 25)  return 1.25;
        return 1.00;
    };

    /** Ajoute n points de Rage et déclenche les jalons de dialogue */
    Game_Enemy.prototype.mGainRage = function (n) {
        var prev = this._mRage || 0;
        this._mRage = Math.min(100, prev + n);
        var d = DLG[this.mPhase()];

        if (prev < 25 && this._mRage >= 25) battleMsg(d.r25);
        if (prev < 50 && this._mRage >= 50) battleMsg(d.r50);
        if (prev < 75 && this._mRage >= 75) battleMsg(d.r75);

        // Déclenchement du mode Berserk (une seule fois)
        if (!this._mBerserk && prev < 100 && this._mRage >= 100) {
            this._mBerserk = true;
            battleMsg(DLG.berserk);
            playAnim(this, AN_BERSERK);
            playSe(SE_BERSERK);
        }
    };

    /** Annonce la transition de phase si elle n'a pas encore été faite */
    Game_Enemy.prototype.mCheckPhase = function () {
        var p = this.mPhase();
        if (!this._mAnnounced[p]) {
            this._mAnnounced[p] = true;
            battleMsg(DLG[p].phaseIn);
            if (p > 1) { playAnim(this, AN_PHASE); playSe(SE_PHASE); }
        }
    };

    /**
     * Enregistre l'historique d'attaque d'un combattant et détecte
     * si le même skill a été utilisé 2 fois de suite.
     * @returns {boolean}
     */
    Game_Enemy.prototype.mDetectPattern = function (atkId, skillId) {
        if (!this._mHistory[atkId]) this._mHistory[atkId] = [];
        var h = this._mHistory[atkId];
        h.push(skillId);
        if (h.length > 4) h.shift();          // Garde seulement les 4 derniers
        var len = h.length;
        return len >= 2 && h[len - 1] === h[len - 2];
    };

    // ═══════════════════════════════════════════════════════════════
    //  1. SETUP – Initialisation de l'état interne Mahoraga
    // ═══════════════════════════════════════════════════════════════
    var _setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function (enemyId, x, y) {
        _setup.call(this, enemyId, x, y);
        if (this.isMahoraga()) {
            this._mSkills    = {};                        // skillId  → nb de coups reçus
            this._mStates    = [];                        // IDs des états déjà rencontrés
            this._mRage      = 0;                         // Jauge de Rage (0–100)
            this._mBerserk   = false;
            this._mAnnounced = { 1: false, 2: false, 3: false };
            this._mHistory   = {};                        // atkId → [derniers skillIds]
        }
    };

    // ═══════════════════════════════════════════════════════════════
    //  2. CALCUL DES DÉGÂTS – Cœur du système
    // ═══════════════════════════════════════════════════════════════
    var _mkDmg = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var dmg = _mkDmg.call(this, target, critical);
        var sub = this.subject();

        // ── Mahoraga ATTAQUE : ses dégâts sont amplifiés par la Rage ──
        if (sub.isEnemy() && sub.isMahoraga() && dmg > 0) {
            dmg = Math.floor(dmg * sub.mRageMult());
        }

        // ── Mahoraga est la CIBLE ────────────────────────────────────
        if (!target.isEnemy() || !target.isMahoraga() || dmg <= 0) return dmg;

        target.mCheckPhase();

        var phase   = target.mPhase();
        var skillId = this.item().id;
        var elemId  = this.item().damage.elementId;
        var atkId   = sub.actorId ? sub.actorId() : (sub.enemyId ? sub.enemyId() : 0);
        var d       = DLG[phase];

        // ┌─ FAIBLESSE : Mana Pur ────────────────────────────────────
        //   Dégâts ×2 + Rage +20 (la douleur l'énerve davantage)
        if (estManaPur(elemId)) {
            battleMsg(DLG.pureMana);
            target.mGainRage(20);
            return dmg * 2;
        }

        // ┌─ SUIVI DE PATRON (actif toutes phases, puni Phase 2+) ────
        var isPattern = (atkId > 0) && target.mDetectPattern(atkId, skillId);

        // ┌─ TECHNIQUE DÉJÀ ADAPTÉE ───────────────────────────────────
        var hits      = target._mSkills[skillId] || 0;
        // Arrogance Phase 1 : il faut 2 frappes pour qu'il daigne s'adapter
        var threshold = (phase === 1) ? 2 : 1;

        if (hits >= threshold) {

            if (phase >= 2 && isPattern) {
                // ─ PRÉDICTION : il anticipait ce pattern ──────────────
                //   Punition maximale −90%, contre renforcé
                battleMsg(d.predict);
                playSe(SE_IMMUNE);
                target.mGainRage(8);
                dmg = Math.max(1, Math.floor(dmg * 0.10));

            } else {
                // ─ IMMUNITÉ STANDARD −70% ─────────────────────────────
                dmg = Math.max(1, Math.floor(dmg * 0.30));
                playSe(SE_IMMUNE);
                battleMsg(d.immune);
                target.mGainRage(5);

                // Arrogance Phase 1 : 35% de chance de NE PAS contre-attaquer
                if (phase === 1 && Math.random() < 0.35) {
                    battleMsg(d.skip);
                    return dmg;
                }
            }

            // Planifie le contre (exécuté dans endAction)
            BattleManager._mCounter = {
                boss    : target,
                attacker: sub,
                skillId : pickRnd(target.mPool()) || 1,
            };
            return dmg;
        }

        // ┌─ NOUVELLE TECHNIQUE (adaptation en cours) ────────────────
        target._mSkills[skillId] = hits + 1;

        if (hits + 1 < threshold) {
            // Phase 1 : premier coup – trop arrogant pour réagir
            battleMsg(d.firstHit);
        } else {
            // Adaptation complète – dégâts à 100% + gain de Rage
            playSe(SE_ADAPT);
            playAnim(target, AN_ADAPT);
            battleMsg(d.newSkill);
            target.mGainRage(10);
        }

        return dmg; // 100% des dégâts sur une technique non encore adaptée
    };

    // ═══════════════════════════════════════════════════════════════
    //  3. ÉTATS – Adaptation / Immunité aux altérations
    // ═══════════════════════════════════════════════════════════════
    var _addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        if (this.isEnemy() && this.isMahoraga() && stateId > 3) {
            var phase = this.mPhase();

            if (this._mStates.indexOf(stateId) >= 0) {
                // Déjà rencontré → immunité totale
                playSe(SE_IMMUNE);
                battleMsg(DLG[phase].immune);
                return;
            }
            // Première rencontre → il le subit mais s'adapte
            this._mStates.push(stateId);
            playSe(SE_ADAPT);
            playAnim(this, AN_ADAPT);
            battleMsg(DLG[phase].newSkill);
            this.mGainRage(10);
        }
        _addState.call(this, stateId);
    };

    // ═══════════════════════════════════════════════════════════════
    //  4. CONTRE-ATTAQUE – Exécutée juste après l'action adverse
    // ═══════════════════════════════════════════════════════════════
    var _endAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        _endAction.call(this);

        if (!this._mCounter) return;
        var c = this._mCounter;
        this._mCounter = null;

        // Cible = l'attaquant original, ou un membre aléatoire s'il est K.O.
        var target = (c.attacker && c.attacker.isAlive()) ? c.attacker : null;
        if (!target) {
            var alive = $gameParty.aliveMembers();
            if (!alive.length) return;
            target = pickRnd(alive);
        }

        battleMsg(DLG[c.boss.mPhase()].counter);
        c.boss.forceAction(c.skillId, target.index());
        BattleManager.forceAction(c.boss);
    };

})();

//=============================================================================
// ▼ AMÉLIORATION ADDITIVE : KEV = RADAHN (armure gravitationnelle + météores)
//   Bloc autonome — ne modifie PAS la logique au-dessus. Cible <Radahn>.
//=============================================================================
(function () {
    'use strict';
    function isRadahn(b) {
        return b && b.isEnemy && b.isEnemy() && b.enemy() && b.enemy().meta && b.enemy().meta.Radahn;
    }
    // Armure gravitationnelle : il encaisse mieux tant qu'il est au-dessus de 50% PV.
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, crit) {
        var v = _mdv.call(this, target, crit);
        if (v > 0 && isRadahn(target) && target.hpRate() > 0.5) v = Math.floor(v * 0.75);
        return v;
    };
    // Phase météores : annonce quand il passe sous 30% PV.
    var _ma = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function () {
        if (isRadahn(this) && !this._radahnMeteor && this.hpRate() <= 0.30) {
            this._radahnMeteor = true;
            var sc = SceneManager._scene;
            if (sc && sc._logWindow) sc._logWindow.push('addText', "\\C[2]Kev s'élève dans le ciel… une PLUIE DE MÉTÉORES s'annonce !\\C[0]");
        }
        _ma.call(this);
    };
})();
