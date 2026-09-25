//=============================================================================
// LaBibliothequeDAel.js — v1.0
// Aël : la Lecture et le Miracle, le Contrat, les Portes.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Aël, dans l'esprit de Béatrice : elle LIT l'ennemi tant
 * qu'elle dépense peu, et le Miracle lui donne la Flèche qui le touche. Le
 * Contrat fait payer son mana par un autre. Les Portes contrôlent le combat.
 * @author pour JOKO
 *
 * @param acteur
 * @text Aël (acteur)
 * @type actor
 * @default 4
 *
 * @param gainLecture
 * @text Lecture gagnée par action économe (%)
 * @type number
 * @default 25
 * @desc « C'est lent » : 25 % = quatre actions pour un Miracle.
 *
 * @param seuilPM
 * @text PM au-delà desquels elle « perd le fil »
 * @type number
 * @default 20
 * @desc Payer plus que ça DE SA POCHE efface toute la Lecture en cours.
 *
 * @param flechesIds
 * @text Flèches de Miracle (élément:compétence)
 * @default 29:1268,14:1269,3:1270,9:1271,12:1272
 * @desc Le Crépuscule d'abord : en cas d'égalité, c'est lui qu'elle trouve.
 *
 * @param etatContrat
 * @text État — Sous Contrat (l'allié)
 * @type state
 * @default 237
 *
 * @param etatContratForce
 * @text État — Lié de force (l'ennemi)
 * @type state
 * @default 238
 *
 * @param rangsImmunises
 * @text Rangs que la Porte ne ferme pas
 * @default S
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  AËL — « un personnage un peu à la Béatrice »                         JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Le canon (SYSTEME_DE_MANA, GAME_DESIGN §1.4) : « Miracle — développe de
 *  nouvelles techniques en temps réel. C'est lent. Elle doit économiser son
 *  mana : trop en dépenser lui fait perdre l'effet en cours de route. Ce
 *  qu'elle développe se matérialise en flèches. » Et contre un ennemi faible
 *  au mana positif — le Crépuscule en particulier.
 *
 *  A · LA LECTURE ET LE MIRACLE
 *     Chaque action où elle paie ≤ 20 PM de sa poche fait monter de 25 % la
 *     Lecture de l'ennemi qu'elle vise. Payer davantage : la Lecture tombe à
 *     zéro partout. À 100 % : MIRACLE. Elle cherche, parmi le Crépuscule, la
 *     Lumière, l'Esprit, l'Eau et la Foudre, ce qui blesse le plus cet ennemi,
 *     apprend la Flèche de Miracle de cet élément — pour toujours — et la tire
 *     aussitôt, gratuitement. S'il résiste à tout : elle ne trouve pas la
 *     faille, et recommence.
 *
 *  B · LE CONTRAT
 *     « Le Contrat » lie Aël à un allié : tant qu'il tient, c'est LUI qui paie
 *     ses PM (et il encaisse 15 % de moins, elle le couvre). Ce qu'il paie ne
 *     compte pas dans la Lecture : c'est comme ça qu'elle lance gros sans
 *     perdre le fil. Seule, elle force le Contrat sur un ennemi et puise dans
 *     SES PM à lui.
 *
 *  C · LES PORTES
 *     le Voile (précision −40 % à tous) · l'Oubli (ATQ/MAG −40 %) · le Gouffre
 *     (perce la moitié de la DÉF.M) · les Pieux de Cristal (ignorent toute
 *     défense, 30 % de cristalliser) · la Fermeture (retire un ennemi trois
 *     tours — pas un rang S, pas un boss à mécaniques, pas le dernier debout)
 *     · l'Allègement (un allié : AGI ×1,5, esquive +20 %).
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('LaBibliothequeDAel');
    var AEL = parseInt(P['acteur'] || 4, 10);
    var GAIN = parseFloat(P['gainLecture'] || 25) / 100;
    var SEUIL_PM = parseInt(P['seuilPM'] || 20, 10);
    var FLECHES = String(P['flechesIds'] || '29:1268,14:1269,3:1270,9:1271,12:1272').split(',')
        .map(function (x) { var t = x.split(':'); return { el: parseInt(t[0], 10), id: parseInt(t[1], 10) }; })
        .filter(function (x) { return x.el > 0 && x.id > 0; });
    var ETAT_CONTRAT = parseInt(P['etatContrat'] || 237, 10);
    var ETAT_FORCE = parseInt(P['etatContratForce'] || 238, 10);
    var IMMUNES = String(P['rangsImmunises'] || 'S').split(',').map(function (x) { return x.trim().toUpperCase(); });

    function estAel(b) { return !!(b && b.isActor && b.isActor() && b.actorId() === AEL); }
    function ael() { return $gameActors ? $gameActors.actor(AEL) : null; }
    function enCombat() { return !!($gameParty && $gameParty.inBattle()); }
    function journal(t) { var w = SceneManager._scene && SceneManager._scene._logWindow; if (w) { w.push('addText', t); } }
    function tag(it, nom) { return !!(it && it.meta && it.meta[nom] !== undefined); }

    // ═════════════════════════════════════════════════════════════════════
    // B · LE CONTRAT — qui paie ses PM
    // ═════════════════════════════════════════════════════════════════════
    function partenaire(a) {
        var c = a && a._contrat;
        if (!c || !enCombat()) { return null; }
        var b = c.acteur ? $gameActors.actor(c.acteur) : $gameTroop.members()[c.ennemi];
        if (!b || !b.isAlive()) { return null; }
        if (b.isActor() && $gameParty.battleMembers().indexOf(b) < 0) { return null; }
        return b;
    }
    function rompre(a) {
        var b = a && a._contrat ? (a._contrat.acteur ? $gameActors.actor(a._contrat.acteur) : $gameTroop.members()[a._contrat.ennemi]) : null;
        if (b) { b.removeState(ETAT_CONTRAT); b.removeState(ETAT_FORCE); }
        if (a) { a._contrat = null; }
    }

    var _peutPayer = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
        if (estAel(this)) {
            var b = partenaire(this);
            if (b && b.mp >= this.skillMpCost(skill) && this._tp >= this.skillTpCost(skill)) { return true; }
        }
        return _peutPayer.call(this, skill);
    };
    var _payer = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function (skill) {
        if (!estAel(this)) { return _payer.call(this, skill); }
        if (this._miracleGratuit) { this._miracleGratuit = false; this._pmDeSaPoche = 0; return; }
        var cout = this.skillMpCost(skill), b = partenaire(this);
        if (b && cout > 0 && b.mp >= cout) {
            b.gainMp(-cout);
            this._tp -= this.skillTpCost(skill);
            this._pmDeSaPoche = 0;
            return;
        }
        var avant = this._mp;
        _payer.call(this, skill);
        this._pmDeSaPoche = Math.max(0, avant - this._mp);
    };

    // ═════════════════════════════════════════════════════════════════════
    // A · LA LECTURE ET LE MIRACLE
    // ═════════════════════════════════════════════════════════════════════
    function lecture(e) { return (e && e._lectureAel) || 0; }
    function toutEffacer() { $gameTroop.members().forEach(function (e) { e._lectureAel = 0; }); }

    /** La meilleure Flèche contre cet ennemi — ou null s'il résiste à tout. */
    function flecheContre(e) {
        var best = null, taux = -1;
        FLECHES.forEach(function (f) {
            var r = e.elementRate(f.el);
            if (r > taux + 1e-9) { taux = r; best = f; }       // l'ordre du réglage départage : Crépuscule d'abord
        });
        return taux >= 1 ? { fleche: best, taux: taux } : null;
    }

    function miracle(a, e) {
        e._lectureAel = 0;
        var t = flecheContre(e);
        if (!t) { journal('\\C[8]📖 ' + a.name() + ' lit ' + e.name() + '… et ne trouve pas la faille.\\C[0]'); return; }
        var sk = $dataSkills[t.fleche.id];
        if (!sk) { return; }
        var neuve = !a.isLearnedSkill(sk.id);
        if (neuve) { a.learnSkill(sk.id); }
        journal('\\C[14]✦ MIRACLE — ' + a.name() + (neuve ? ' développe « ' : ' retrouve « ') + sk.name + ' »\\C[0]');
        a._miracleGratuit = true;
        BattleManager.queueForceAction(a, sk.id, e.index());
    }

    // La Lecture se joue au moment où elle agit (le coût vient d'être payé).
    var _useItem = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function (item) {
        var eraitGratuit = estAel(this) && this._miracleGratuit;
        if (estAel(this)) { this._pmDeSaPoche = 0; }
        _useItem.call(this, item);
        if (!estAel(this) || !enCombat() || eraitGratuit) { return; }
        if ((this._pmDeSaPoche || 0) > SEUIL_PM) {
            var enCours = $gameTroop.members().some(function (e) { return lecture(e) > 0; });
            toutEffacer();
            if (enCours) { journal('\\C[8]📖 ' + this.name() + ' dépense trop — elle perd le fil.\\C[0]'); }
            return;
        }
        var act = this.currentAction(), cible = null;
        if (act && act.isForOpponent() && act.isForOne()) {
            cible = $gameTroop.members()[act._targetIndex];
            if (cible && !cible.isAlive()) { cible = null; }
        }
        if (!cible) { cible = $gameTroop.members()[this._focusAel]; }
        if (!cible || !cible.isAlive()) { cible = $gameTroop.aliveMembers()[0]; }
        if (!cible) { return; }
        this._focusAel = $gameTroop.members().indexOf(cible);
        cible._lectureAel = Math.min(1, lecture(cible) + GAIN);
        if (cible._lectureAel >= 1 - 1e-9) { miracle(this, cible); }
    };

    // ═════════════════════════════════════════════════════════════════════
    // Les effets des Portes et des Contrats
    // ═════════════════════════════════════════════════════════════════════
    function estBoss(e) {
        var n = (e.enemy() && e.enemy().note) || '';
        var m = /<\s*Rang\s*:\s*([^>]*)>/i.exec(n);
        if (m && IMMUNES.indexOf(String(m[1]).trim().toUpperCase()) >= 0) { return true; }
        return /<\s*(Meca\w*|Phases)\s*:/i.test(n);
    }

    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        var u = this.subject(), it = this.item();
        if (!estAel(u) || !it || !enCombat() || !target) { return; }

        if (tag(it, 'Contrat') && target.isActor()) {
            if (target === u) { journal('\\C[8]Un Contrat se passe avec quelqu\'un d\'autre.\\C[0]'); return; }
            rompre(u);
            u._contrat = { acteur: target.actorId() };
            target.addState(ETAT_CONTRAT);
            journal('\\C[14]✦ ' + u.name() + ' passe un Contrat avec ' + target.name() + ' : c\'est lui qui paie.\\C[0]');
        }
        if (tag(it, 'ContratForce') && target.isEnemy()) {
            rompre(u);
            u._contrat = { ennemi: target.index() };
            target.addState(ETAT_FORCE);
            journal('\\C[14]✦ ' + u.name() + ' force un Contrat sur ' + target.name() + ' : elle puisera dans ses PM.\\C[0]');
        }
        if (tag(it, 'PorteFermee') && target.isEnemy() && target.isAlive()) {
            if (estBoss(target)) { journal('\\C[8]La Porte ne se ferme pas sur ' + target.name() + '.\\C[0]'); return; }
            if ($gameTroop.aliveMembers().length <= 1) { journal('\\C[8]La Porte ne se ferme pas sur le dernier debout.\\C[0]'); return; }
            var tours = parseInt(it.meta.PorteFermee, 10) || 3;
            target._porteRetour = $gameTroop.turnCount() + tours;
            target.hide();
            journal('\\C[14]✦ La Porte se referme sur ' + target.name() + ' — ' + tours + ' tours.\\C[0]');
        }
    };

    // Les exilés reviennent à la fin du tour où leur temps est écoulé.
    var _finTour = BattleManager.endTurn;
    BattleManager.endTurn = function () {
        _finTour.call(this);
        var t = $gameTroop.turnCount();
        $gameTroop.members().forEach(function (e) {
            if (e._porteRetour && t >= e._porteRetour) {
                e._porteRetour = 0;
                e.appear();
                journal(e.name() + ' revient de l\'autre côté de la Porte.');
            }
        });
    };

    // Fin de combat : on rompt, on efface.
    var _fin = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        var a = ael();
        if (a) { rompre(a); a._focusAel = 0; a._miracleGratuit = false; }
        return _fin.call(this, result);
    };

    // ═════════════════════════════════════════════════════════════════════
    // À l'écran : la Lecture et le Contrat
    // ═════════════════════════════════════════════════════════════════════
    function Window_Lecture() { this.initialize.apply(this, arguments); }
    Window_Lecture.prototype = Object.create(Window_Base.prototype);
    Window_Lecture.prototype.constructor = Window_Lecture;
    Window_Lecture.prototype.initialize = function (x, y) {
        Window_Base.prototype.initialize.call(this, x, y, 330, this.fittingHeight(1));
        this.opacity = 0; this._cle = ''; this.refresh();
    };
    Window_Lecture.prototype.refresh = function () {
        this.contents.clear();
        var a = ael();
        if (!a || $gameParty.battleMembers().indexOf(a) < 0) { return; }
        var e = $gameTroop.members()[a._focusAel || 0];
        var p = e && e.isAlive() ? lecture(e) : 0, la = this.contentsWidth();
        this.contents.fillRect(0, 8, la, 20, 'rgba(0,0,0,0.55)');
        this.contents.gradientFillRect(0, 8, Math.floor(la * p), 20, '#3a4a9a', '#c8b6ff', false);
        this.contents.fontSize = 17;
        this.contents.outlineColor = 'rgba(0,0,0,0.9)';
        this.changeTextColor('#ffffff');
        var b = partenaire(a);
        var t = '📖 ' + Math.round(p * 100) + ' %' + (e && e.isAlive() ? ' ' + e.name() : '') + (b ? ' · Contrat : ' + b.name() : '');
        this.drawText(t, 4, 2, la - 8, 'left');
        this.resetTextColor();
    };
    Window_Lecture.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        var a = ael(), cle = '';
        if (a) {
            var e = $gameTroop.members()[a._focusAel || 0];
            var b = partenaire(a);
            cle = (a._focusAel || 0) + '/' + lecture(e) + '/' + (b ? b.name() : '');
        }
        if (cle !== this._cle) { this._cle = cle; this.refresh(); }
    };
    var _fenetres = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function () {
        _fenetres.call(this);
        var sw = this._statusWindow;
        var y = sw ? sw.y - 56 : Graphics.boxHeight - 240;
        this._fenetreLecture = new Window_Lecture(300, y);
        this.addChild(this._fenetreLecture);
    };

    // ═════════════════════════════════════════════════════════════════════
    // De quoi le mesurer sans deviner
    // ═════════════════════════════════════════════════════════════════════
    window.BibliothequeAel = {
        lecture: lecture,
        flecheContre: function (e) { var t = flecheContre(e); return t ? { id: t.fleche.id, el: t.fleche.el, taux: t.taux } : null; },
        partenaire: function () { return partenaire(ael()); },
        estBoss: estBoss,
        fleches: FLECHES,
        seuilPM: SEUIL_PM
    };
})();
