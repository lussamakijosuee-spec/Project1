//=============================================================================
// ParolesSysteme.js — v1.0  ·  Système de magie « Paroles » (Compendium)
// RPG Maker MV   ·   by JOKO   ·   additif — branche la lucidité sur la magie
//=============================================================================
/*:
 * @target MV
 * @plugindesc v1.0 ■ Magie par PAROLES : une parole longue frappe fort mais exige de
 * la concentration ; la SANTE MENTALE decide reussite / ratage / backlash.
 * @author JOKO
 *
 * @param EnableSwitchId
 * @text Switch d'activation (0 = toujours)
 * @type switch
 * @default 0
 *
 * @param ApplyToMagical
 * @text Appliquer a toute la magie (coups magiques)
 * @type boolean
 * @desc Si Oui, toute competence "magique" (hitType magique) devient une Parole. Sinon, seulement <Parole>.
 * @default true
 *
 * @param TreatUltAsOrigine
 * @text Ultimes = Mana Origine (fiables)
 * @type boolean
 * @desc Les competences de type "ult" sont des paroles ENREGISTREES : jamais de ratage/backlash.
 * @default true
 *
 * @param UltStypeId
 * @text ID du type de competence "ult"
 * @type number
 * @default 3
 *
 * @param DefaultL
 * @text Longueur de parole par defaut (L)
 * @type number
 * @min 1
 * @default 3
 *
 * @param TalentFormula
 * @text Formule du Talent (concentration de base)
 * @type string
 * @desc Evaluee avec a = lanceur. Defaut : la magie (MAT).
 * @default a.mat
 *
 * @param BacklashPct
 * @text Backlash (% PV max x L x manque)
 * @type number
 * @decimals 2
 * @default 6
 *
 * @param ShowLog
 * @text Messages de combat
 * @type boolean
 * @default true
 *
 * @help
 * ============================================================================
 *  SYSTÈME DE PAROLES — la lucidité gouverne la magie               by JOKO
 * ============================================================================
 *  Traduit le « Compendium des Paroles » en mécanique de combat :
 *
 *    Concentration disponible  Kd  = Talent × (santé mentale / 100)
 *    Concentration requise     Kr  = 8 · L^1.8           (L = longueur de parole)
 *    Précision                 Pr  = 1 − e^(−L/3)
 *    Réussite                      = Pr × min(1, Kd/Kr)
 *
 *  • Si la parole RÉUSSIT : le sort part normalement (la puissance reste celle
 *    de ta compétence — cette couche gère la FIABILITÉ, pas les dégâts bruts).
 *  • Si elle RATE : la parole se brise → aucun effet (raté) + BACKLASH : le
 *    lanceur se blesse, d'autant plus que la parole était longue et qu'il
 *    manquait de concentration.
 *
 *  La SANTÉ MENTALE est lue sur tes jauges existantes (window.Ame de
 *  JadeEntitePlunging, échelle 1–10 → 10–100 %). Les ennemis sont à pleine
 *  lucidité (paroles fiables) sauf jauge définie.
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  NOTETAGS (dans la Note d'une compétence)
 *  ──────────────────────────────────────────────────────────────────────────
 *    <Parole>           force la compétence à suivre le système de Paroles.
 *    <ParoleL: n>       fixe la longueur de parole L (sinon « par défaut »).
 *                       Repères du compendium : simple=3, double=4, ampli=4,
 *                       fusion=5, soin=3, enregistrée=1.
 *    <Parole: origine>  MANA ORIGINE : parole enregistrée, lancée sans réciter
 *                       → JAMAIS de ratage ni de backlash (contourne la lucidité).
 *    <NoParole>         exclut la compétence du système (ex. attaque physique).
 *
 *  Par défaut : toute compétence magique est une Parole (L par défaut), et les
 *  ultimes sont des paroles « origine » (fiables). Ajuste avec les paramètres.
 * ============================================================================
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('ParolesSysteme');
    var ENABLE_SW   = parseInt(P['EnableSwitchId'] || 0, 10);
    var APPLY_MAG   = String(P['ApplyToMagical'] || 'true') === 'true';
    var ULT_ORIGINE = String(P['TreatUltAsOrigine'] || 'true') === 'true';
    var ULT_STYPE   = parseInt(P['UltStypeId'] || 3, 10);
    var DEFAULT_L   = parseInt(P['DefaultL'] || 3, 10);
    var TALENT_F    = String(P['TalentFormula'] || 'a.mat');
    var BACKLASH    = parseFloat(P['BacklashPct'] || 6) / 100;
    var SHOW_LOG    = String(P['ShowLog'] || 'true') === 'true';

    function enabled() {
        if (ENABLE_SW > 0 && (!$gameSwitches || !$gameSwitches.value(ENABLE_SW))) return false;
        return true;
    }
    function log(t) {
        if (!SHOW_LOG) return;
        var w = BattleManager._logWindow;
        if (w) { w.push('addText', t); }
        else { var s = SceneManager._scene; if (s && s._logWindow) s._logWindow.addText(t); }
    }

    //========================================================================
    // SANTÉ MENTALE (lucidité) du lanceur → 0.15 .. 1.0
    //========================================================================
    function sanity(b) {
        if (!b || !b.isActor || !b.isActor()) return 1; // ennemis : pleine lucidité
        var g = 0;
        if (window.Ame && typeof window.Ame.jauge === 'function') {
            try { g = window.Ame.jauge(b.actorId()); } catch (e) {}
        }
        if (!g && typeof $gameVariables !== 'undefined' && $gameVariables) {
            g = $gameVariables.value(b.actorId() + 10); // jauges 11..14 par convention
        }
        if (!g) g = 7; // valeur « normale » par défaut
        return Math.max(0.15, Math.min(1, g / 10));
    }
    function talentOf(b) {
        try { return Math.max(1, Function('a', 'return (' + TALENT_F + ');')(b)); }
        catch (e) { return Math.max(1, b.mat || 1); }
    }

    //========================================================================
    // CLASSIFICATION D'UNE COMPÉTENCE
    //========================================================================
    function paroleInfo(item) {
        if (!item || item.itypeId !== undefined) return null; // pas une compétence (objet)
        if (item.meta && item.meta.NoParole) return null;
        var isParole = (item.meta && item.meta.Parole !== undefined) ||
                       (APPLY_MAG && item.hitType === 2); // 2 = magique
        if (!isParole) return null;

        // Mana origine : enregistrée → fiable
        var origine =
            (item.meta && String(item.meta.Parole).toLowerCase().trim() === 'origine') ||
            (ULT_ORIGINE && item.stypeId === ULT_STYPE);

        var L = DEFAULT_L;
        if (item.meta && item.meta.ParoleL) {
            var n = parseInt(item.meta.ParoleL, 10);
            if (!isNaN(n) && n > 0) L = n;
        }
        return { origine: origine, L: L };
    }

    //========================================================================
    // RÉSOLUTION (une fois par action)
    //========================================================================
    Game_Action.prototype._resolveParole = function () {
        var info = paroleInfo(this.item());
        if (!info) { this._paroleState = 'na'; return; }

        if (info.origine) { this._paroleState = 'ok'; return; } // contourne la lucidité

        var subj = this.subject();
        var L  = info.L;
        var Kd = talentOf(subj) * sanity(subj);
        var Kr = 8 * Math.pow(L, 1.8);
        var ratio = Kd / Kr;
        var precision = 1 - Math.exp(-L / 3);
        var success = precision * Math.min(1, ratio);

        if (Math.random() < success) {
            this._paroleState = 'ok';
            if (L >= 5) log('\\C[6]Parole tenue (L' + L + ') — la concentration porte le sort.\\C[0]');
        } else {
            this._paroleState = 'fail';
            // Backlash : proportionnel à la longueur et au manque de concentration
            var manque = Math.max(0.1, 1 - ratio);
            var dmg = Math.max(1, Math.floor(subj.mhp * BACKLASH * L * manque));
            subj.gainHp(-dmg);
            subj.startDamagePopup();
            if (subj.clearResult) { /* le popup lira le result courant */ }
            if ($gameScreen) $gameScreen.startFlash([180, 60, 200, 160], 24);
            AudioManager.playSe({ name: 'Buzzer2', volume: 80, pitch: 60, pan: 0 });
            log('\\C[18]' + subj.name() + ' perd le fil de sa parole (L' + L + ') — BACKLASH ! (-' + dmg + ' PV)\\C[0]');
            if (!subj.isAlive() && subj.performCollapse) subj.performCollapse();
        }
    };

    var _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        if (enabled() && this.isSkill && this.isSkill() && $gameParty && $gameParty.inBattle()) {
            if (this._paroleState === undefined) this._resolveParole();
            if (this._paroleState === 'fail') {
                var r = target ? target.result() : null;
                if (r) { r.clear(); r.used = true; r.missed = true; } // parole brisée : aucun effet
                return;
            }
        }
        _Game_Action_apply.call(this, target);
    };

})();
