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
 * @param resonance
 * @text Résonance : + par autre écrit qui part avec lui
 * @default 0.15
 * @desc Trois écrits activés ensemble : chacun ×1,3 en plus. Préparer plus, c'est frapper plus fort.
 *
 * @param === LUDWING : LE PIÈGE ET LA CHANCE ===
 * @default
 *
 * @param acteursPiege
 * @text Ceux dont les écrits sont des pièges
 * @default 3
 * @desc ludwing (3) — « maître du rage-bait », le stratège qui pense de l'arrière : ses écrits sur un ennemi partent tout seuls quand cet ennemi le frappe.
 *
 * @param acteursChance
 * @text Ceux qui ont de la chance
 * @default 3
 * @desc ludwing (3) — « le plus CHANCEUX du groupe, littéralement ».
 *
 * @param chanceGarde
 * @text Chance qu'un écrit parti reste écrit (%)
 * @type number
 * @default 25
 *
 * @param rempart
 * @text <Rempart> : le prochain coup reçu par l'allié ×
 * @default 0.5
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
 *  LA RÉSONANCE — des écrits qui partent ensemble se répondent : chacun
 *  +15 % par autre écrit parti avec lui (trois ensemble : ×1,3 chacun).
 *
 *  LUDWING, LE PIÈGE ET LA CHANCE (JOKO, « rendre les vraiment intéressant
 *  et original » ; son profil : « maître du rage-bait », « le plus CHANCEUX du
 *  groupe, littéralement ») — ses écrits sur un ennemi partent TOUT SEULS
 *  quand cet ennemi le frappe (ᛟ Piège !) : il écrit, il provoque (Vannes),
 *  il attend. Et chaque écrit qui part a 1 chance sur 4 de rester écrit (🍀).
 *
 *  LES VERBES DE L'ÉCRIT (2026-10-22, « Oui rework tout ») — une balise, une
 *  ligne de description ; chacun vient du nom que JOKO a donné à la capacité :
 *   <Cercle>   — tant que cet écrit attend sur une cible, ses autres écrits sur
 *                elle ne coûtent pas de PV (« À partir d'ici, c'est chez toi ») ;
 *   <Referme>  — quand il part, tous ses autres écrits partent avec lui
 *                (« Rien n'échappe ») ;
 *   <Sceau: n> — quand il part, n % de chances que l'ennemi perde sa prochaine
 *                action (pas un boss : rang S, <Phases>, <Meca…>) ;
 *   <Pret>     — écrit sur un allié : jusqu'à la fin du tour suivant, qui frappe
 *                cet allié referme les pièges de ludwing comme s'il le frappait ;
 *   <Symbole>  — compte pour deux dans la résonance ;
 *   <Appat>    — (n'importe quel art) les ennemis touchés frappent celui qui les
 *                a provoqués, jusqu'à la fin du tour suivant (Vannes) ;
 *   <Rempart>  — écrit sur un allié : quand il part, le prochain coup que cet
 *                allié reçoit est divisé par deux (« un mur qu'on ne voit pas,
 *                et qui tient ») — on l'active juste avant le gros coup.
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
    var RESO    = nombre('resonance', 0.15);
    var PIEGE   = liste('acteursPiege', '3');
    var CHANCEUX = liste('acteursChance', '3');
    var CHANCE  = nombre('chanceGarde', 25) / 100;
    var REMPART = nombre('rempart', 0.5);

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
        var it = this.item(), u = this.subject();
        if (enCombat() && it && it.id === ACTIVER && target === u) { activer(u); }
        if (enCombat() && balise(it, 'Appat') && heros(u) && target && target.isEnemy() && target.isAlive() && target.result().isHit()) {
            target._appat = { acteur: u.actorId(), jusque: tour() + 1 };
            annonce(target, '◉ Appâté', '#e080ff');
        }
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
    function valide(b, m) {
        if (!$dataSkills[m.competence] || !m.cible) { return false; }
        var a = new Game_Action(b); a.setSkill(m.competence);
        return a.testApply(m.cible);
    }
    function declencher(b, m, reso) {
        var sk = $dataSkills[m.competence], c = m.cible;
        if (!sk || !c) { return false; }
        var a = new Game_Action(b);
        a.setSkill(sk.id);
        a._ecritActive = true;
        a._resonance = reso || 1;
        a._volonte = volonte(b);              // annoncée une fois pour toute l'activation (activer)
        if (!a.testApply(c)) { return false; }
        var anim = sk.animationId < 0 ? b.attackAnimationId1() : sk.animationId;
        if (anim > 0) { c.startAnimation(anim, false, 0); }
        c.clearResult();
        a.apply(c);
        var touche = c.result().isHit();
        c.startDamagePopup();
        if (c.isDead()) { c.performCollapse(); }
        a.applyGlobal();
        // <Sceau: n> : n % de chances qu'il perde sa prochaine action (pas un boss)
        if (balise(sk, 'Sceau') && touche && c.isEnemy() && c.isAlive() && !estBoss(c) &&
            Math.random() * 100 < (parseInt(sk.meta.Sceau, 10) || 100)) { sceller(c); }
        // <Rempart> : écrit sur un allié, il tient le prochain coup (÷2)
        if (balise(sk, 'Rempart') && c.isActor() && c.isAlive()) {
            c._rempart = true;
            annonce(c, 'ᛟ Rempart', '#e080ff');
        }
        // <Pret> : l'allié porte un morceau de son ombre — qui le frappe referme ses pièges
        if (balise(sk, 'Pret') && c.isActor() && c.isAlive()) {
            c._ombreDe = { acteur: b.actorId(), jusque: tour() + 1 };
            annonce(c, 'ᛟ Ombre prêtée', '#e080ff');
        }
        return true;
    }
    function balise(it, nom) { return !!(it && it.meta && it.meta[nom] !== undefined); }
    function tour() { return $gameTroop ? $gameTroop.turnCount() : 0; }
    function estBoss(e) {
        var n = (e.enemy() && e.enemy().note) || '';
        return /<\s*Rang\s*:\s*S\s*>/i.test(n) || /<\s*(Meca\w*|Phases)\s*:/i.test(n);
    }
    function sceller(c) {
        var l = BattleManager._actionBattlers || [], i = l.indexOf(c);
        if (i >= 0) { l.splice(i, 1); c.clearActions(); } else { c._scelle = tour() + 1; }
        annonce(c, 'ᛟ Scellé : il perd son tour', '#e080ff');
    }
    var _ordres = BattleManager.makeActionOrders;
    BattleManager.makeActionOrders = function () {
        _ordres.call(this);
        var t = tour();
        this._actionBattlers = (this._actionBattlers || []).filter(function (b) {
            if (b && b._scelle && b._scelle === t) { b._scelle = 0; b.clearActions(); return false; }
            return true;
        });
    };

    // <Cercle> : tant qu'il attend sur une cible, ses autres écrits sur elle ne coûtent pas de PV.
    function cibleDe(a) {
        if (!a.isForOpponent() || !a.isForOne() || !(a._targetIndex >= 0)) { return null; }
        return $gameTroop.members()[a._targetIndex] || null;
    }
    function dansLeCercle(b, c) {
        return ecritsDe(b).some(function (m) { return m.cible === c && balise($dataSkills[m.competence], 'Cercle'); });
    }
    var _payer = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function (skill) {
        var a = enCombat() && heros(this) && this.currentAction ? this.currentAction() : null;
        var c = a && a.item() === skill && doitEcrire(a) ? cibleDe(a) : null;
        this._cercleGratuit = !!(c && dansLeCercle(this, c));
        if (this._cercleGratuit) { annonce(this, 'ᛟ Dans le cercle : gratuit', '#e080ff'); }
        _payer.call(this, skill);
        this._cercleGratuit = false;
    };
    var _coutPV = Game_BattlerBase.prototype.skillHpCost;
    if (_coutPV) {
        Game_BattlerBase.prototype.skillHpCost = function (skill) { return this._cercleGratuit ? 0 : _coutPV.call(this, skill); };
    }

    // <Appat> (Vannes) : les ennemis touchés frappent celui qui les a provoqués, jusqu'à la fin du tour suivant.
    var _cibles = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function () {
        var s = this.subject(), ap = s && s._appat;
        if (enCombat() && ap && s.isEnemy() && tour() <= ap.jusque && this.isForOpponent() && this.isForOne()) {
            var h = $gameActors.actor(ap.acteur);
            if (h && h.isAlive() && $gameParty.battleMembers().indexOf(h) >= 0) { return [h]; }
        }
        return _cibles.call(this);
    };
    /** Fait partir ces écrits de b, ensemble (la résonance) ; la chance de ludwing en garde. */
    function partir(b, liste) {
        // <Symbole> compte double dans la résonance
        var n = liste.filter(function (m) { return valide(b, m); })
            .reduce(function (t, m) { return t + (balise($dataSkills[m.competence], 'Symbole') ? 2 : 1); }, 0);
        var reso = 1 + RESO * Math.max(0, n - 1), partis = 0, restent = [], referme = false;
        liste.forEach(function (m) {
            if (declencher(b, m, reso)) {
                partis++;
                if (balise($dataSkills[m.competence], 'Referme')) { referme = true; }
                if (CHANCEUX.indexOf(b.actorId()) >= 0 && m.cible.isAlive() && Math.random() < CHANCE) { restent.push(m); }
            }
        });
        // <Referme> : quand il part, tous ses autres écrits partent avec lui
        if (referme && !b._refermant && ecritsDe(b).length) {
            b._refermant = true;
            var reste = ecritsDe(b).slice(); b._ecrits = [];
            annonce(b, 'ᛟ Tout se referme', '#e080ff');
            partis += partir(b, reste);
            b._refermant = false;
        }
        restent.forEach(function (m) { b._ecrits.push(m); annonce(m.cible, '🍀 Toujours écrit', '#a0ffa0'); });
        liste.forEach(function (m) { montrer(m.cible); });
        if (partis > 1) { annonce(b, 'ᛟ Résonance ×' + chiffre(reso), '#ff9ad8'); }
        return partis;
    }
    function activer(b) {
        var tous = ecritsDe(b).slice();
        b._ecrits = [];
        var partis = partir(b, tous);
        if (partis) {
            var v = volonte(b);
            annonce(b, 'ᛟ Activé ×' + partis, '#ff9ad8');
            if (v >= 1.05) { annonce(b, 'ᛟ Volonté ×' + chiffre(v), '#ff9ad8'); }
            if ($gameScreen) { $gameScreen.startFlash([255, 150, 230, 110], 18); }
        }
    }

    // ludwing : l'ennemi qui le frappe referme le piège qu'il a écrit sur lui.
    var _debutAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        _debutAction.call(this);
        var s = this._subject;
        if (s && s.isEnemy && s.isEnemy() && enCombat()) {
            var vises = this._allTargets || this._targets || [];
            var t = tour();
            s._piegeVise = $gameParty.battleMembers().filter(function (a) {
                if (PIEGE.indexOf(a.actorId()) < 0) { return false; }
                if (vises.indexOf(a) >= 0) { return true; }
                // <Pret> : frapper l'allié qui porte son ombre, c'est le frapper lui
                return vises.some(function (v) { return v && v._ombreDe && v._ombreDe.acteur === a.actorId() && t <= v._ombreDe.jusque; });
            });
        }
    };
    var _finAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        var s = this._subject;
        if (s && s._piegeVise && s._piegeVise.length) {
            var porteurs = s._piegeVise;
            s._piegeVise = null;
            porteurs.forEach(function (a) {
                if (!a.isAlive() || !s.isAlive()) { return; }
                var siens = ecritsDe(a).filter(function (m) { return m.cible === s; });
                if (!siens.length) { return; }
                a._ecrits = ecritsDe(a).filter(function (m) { return m.cible !== s; });
                annonce(s, 'ᛟ Piège !', '#e080ff');
                partir(a, siens);
            });
        }
        _finAction.call(this);
    };

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

    // L'aide dit ce qui attend : sur Activer, ce qui va partir et sur qui ; sur un écrit grisé, pourquoi.
    // La première ligne de la description reste ; la seconde est remplacée, le temps du combat.
    var _aide = Window_SkillList.prototype.updateHelp;
    Window_SkillList.prototype.updateHelp = function () {
        _aide.call(this);
        var s = this.item(), a = this._actor, h = this._helpWindow;
        if (!s || !h || !enCombat() || !heros(a)) { return; }
        var liste = ecritsDe(a), ligne = '';
        if (s.id === ACTIVER && liste.length) {
            // les mêmes écrits se comptent (« Trait Spectral ×2 ») ; on dit sur qui tant que la ligne tient
            var groupes = [];
            liste.forEach(function (m) {
                var nom = ($dataSkills[m.competence] || {}).name || '?', qui = m.cible && m.cible.name ? m.cible.name() : '?';
                var g = groupes.filter(function (x) { return x.nom === nom; })[0];
                if (!g) { g = { nom: nom, n: 0, qui: [] }; groupes.push(g); }
                g.n++; if (g.qui.indexOf(qui) < 0) { g.qui.push(qui); }
            });
            var noms = groupes.map(function (g) { return g.nom + (g.n > 1 ? ' ×' + g.n : ''); });
            var avecCibles = groupes.map(function (g, i) { return noms[i] + ' → ' + g.qui.join(', '); });
            var essais = ['ᛟ En attente : ' + avecCibles.join(' · '), 'ᛟ En attente : ' + noms.join(' · ')];
            ligne = essais.filter(function (t) { return h.textWidth(t) <= h.contentsWidth() - 8; })[0] || '';
            if (!ligne) {
                ligne = 'ᛟ ' + liste.length + ' en attente : ';
                for (var i = 0; i < noms.length; i++) {
                    var t = ligne + (i ? ', ' : '') + noms[i];
                    if (h.textWidth(t + '…') > h.contentsWidth() - 8) { ligne += '…'; break; }
                    ligne = t;
                }
            }
        } else if (liste.length >= MAX && !this.isEnabled(s)) {
            var act = new Game_Action(a); act.setSkill(s.id);
            if (doitEcrire(act)) { ligne = 'ᛟ ' + liste.length + ' écrits attendent déjà : active-les d\'abord.'; }
        }
        if (ligne) { h.setText(String(h._text || '').split('\n')[0] + '\n' + ligne); }
    };

    // Dès qu'un héros a des écrits en attente, « ᛟ Activer · n » se met juste sous l'Attaque : on touche le
    // cercle sans aller le chercher dans les capacités (il y reste aussi). Même chemin qu'une capacité choisie.
    var _cmdAttaque = Window_ActorCommand.prototype.addAttackCommand;
    Window_ActorCommand.prototype.addAttackCommand = function () {
        _cmdAttaque.call(this);
        var a = this._actor, sk = $dataSkills[ACTIVER];
        if (sk && enCombat() && heros(a) && ecritsDe(a).length && a.isLearnedSkill(ACTIVER)) {
            this.addCommand(sk.name + ' · ' + ecritsDe(a).length, 'ecritActiver', a.canUse(sk));
        }
    };
    var _fenetreOrdres = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function () {
        _fenetreOrdres.call(this);
        this._actorCommandWindow.setHandler('ecritActiver', this.commandeActiver.bind(this));
    };
    Scene_Battle.prototype.commandeActiver = function () {
        var a = BattleManager.actor(), act = BattleManager.inputtingAction();
        if (!a || !act) { this._actorCommandWindow.activate(); return; }
        act.setSkill(ACTIVER);
        a.setLastBattleSkill($dataSkills[ACTIVER]);
        // d'une seule touche : Activer vise toujours qui l'a écrit, pas de cible à confirmer
        // (YEP, « Select Help Window », ferait choisir le héros lui-même)
        this.selectNextCommand();
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
            var k = this._volonte * (this._ecritActive ? BONUS * (this._resonance || 1) : 1);
            if (k !== 1) { v = Math.round(v * k); }
        }
        // Le rempart d'un allié tient le prochain coup qu'on lui porte
        if (v > 0 && target && target._rempart && target.isActor && target.isActor() && enCombat() && !this.isRecover()) {
            target._rempart = false;
            v = Math.round(v * REMPART);
            annonce(target, 'ᛟ Le rempart tient', '#e080ff');
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
