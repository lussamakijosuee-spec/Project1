//=============================================================================
// FamilierSpirituel.js — v1.0  ·  Le Familier agit de lui-même
// RPG Maker MV   ·   d'après le Codex des Trois Sources, chapitre 6.5
//   À charger APRÈS DonsSpirituels et TraitsAme.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le FAMILIER (2 %) n'est pas un bonus : c'est une créature.
 * Il joue son propre tour, choisit sa cible, et se met devant sa porteuse quand
 * elle est en danger. Une part de soi qui marche à côté de soi.
 * @author JOKO
 *
 * @param postureDefaut
 * @text Posture par défaut
 * @type select
 * @option libre
 * @option agressif
 * @option garde
 * @default libre
 * @desc libre = il décide seul · agressif = il frappe toujours · garde = il ne fait que protéger.
 *
 * @param seuilDetresse
 * @text Posture LIBRE — % de PV sous lequel il cesse de frapper pour protéger
 * @type number
 * @min 0
 * @max 100
 * @default 40
 *
 * @param interceptLibre
 * @text Interception — % des dégâts encaissés (posture libre / agressif)
 * @type number
 * @min 0
 * @max 100
 * @default 20
 *
 * @param interceptGarde
 * @text Interception — % des dégâts encaissés (posture garde)
 * @type number
 * @min 0
 * @max 100
 * @default 45
 *
 * @param usureInterception
 * @text Interception — Endurance dépensée par coup encaissé
 * @type number
 * @min 0
 * @default 2
 *
 * @param palierDeferlante
 * @text Palier à partir duquel il peut déferler sur tout le groupe
 * @type number
 * @min 1
 * @max 4
 * @default 3
 *
 * @param brisePause
 * @text Familier BRISÉ — il ne peut plus agir qu'un tour sur deux ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param montrerLog
 * @text Annoncer ses actions dans le journal de combat
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE FAMILIER QUI AGIT                                Codex, chapitre 6.5
 * ═══════════════════════════════════════════════════════════════════════════
 *  « Le Familier est une créature issue directement de l'âme — pas une
 *    invocation, pas un pacte : une part de soi qui marche à côté de soi. »
 *
 *  Les 2 % ne reçoivent pas un objet : ils reçoivent QUELQU'UN. Ce plugin lui
 *  donne ce qui lui manquait — un tour à lui.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  IL JOUE SON PROPRE TOUR
 *  ─────────────────────────────────────────────────────────────────────────
 *  Quand sa porteuse a fini d'agir, le Familier agit à son tour. Ce n'est pas
 *  une seconde action pour elle : c'est LUI qui frappe, avec ses compétences,
 *  son animation, sa cible. Elle n'a rien à dépenser.
 *
 *  Il choisit seul :
 *    • palier 1-2  → il frappe une cible ;
 *    • palier 3-4  → il alterne, et déferle sur tout le groupe un tour sur deux ;
 *    • s'il n'y a qu'un ennemi, il ne déferle jamais — il cogne.
 *  Sa cible : celle que sa porteuse vient de frapper (il finit le travail),
 *  sinon l'ennemi le plus bas en PV.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  IL SE MET DEVANT
 *  ─────────────────────────────────────────────────────────────────────────
 *  Un torse qui flotte sans corps, ça sert à ça. Quand sa porteuse encaisse un
 *  coup, le Familier en prend une part — et c'est SON Endurance qui la paie.
 *  Protéger l'use : un Familier qui a beaucoup gardé finit par se disloquer.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LES TROIS POSTURES                       (FAMILIER posture <acteur> <mot>)
 *  ─────────────────────────────────────────────────────────────────────────
 *    ▶ LIBRE     (défaut) il frappe, intercepte un peu — et bascule tout seul
 *                en protection quand sa porteuse tombe sous seuilDetresse %.
 *    ▶ AGRESSIF  il frappe toujours, quoi qu'il arrive. Intercepte peu.
 *    ▶ GARDE     il ne frappe plus du tout. Il ne fait que se mettre devant,
 *                et encaisse presque la moitié de ce qui vise sa porteuse.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  CE QU'IL COÛTE — la contrepartie des 2 %
 *  ─────────────────────────────────────────────────────────────────────────
 *   • Il occupe le slot ÂME (voir DonsSpirituels).
 *   • Chacune de ses frappes USE l'Endurance du Don, comme celles de sa
 *     porteuse : un Familier actif brûle sa jauge DEUX FOIS PLUS VITE.
 *   • Chaque interception coûte usureInterception de plus.
 *   • BRISÉ, il agit un tour sur deux et tout ce qu'il fait est divisé par
 *     deux (dégâts comme interception). Il ne meurt pas : il fatigue.
 *   • ABSENT du slot Âme, il n'existe pas — et le Trait qu'il débloquait
 *     non plus.
 *
 *  ⚠️ IL NE PORTE PAS LE TRAIT À LA PLACE DE SA PORTEUSE. Les frappes du
 *     Familier sont des frappes de Familier : elles n'ont pas l'élément
 *     GLACE et ne déclenchent pas le recul d'HIVER. Le froid reste le prix
 *     que Korrah paie elle-même — sinon le Familier deviendrait la faille
 *     qui annule la règle d'or.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  COMMANDES DE PLUGIN
 *  ─────────────────────────────────────────────────────────────────────────
 *    FAMILIER posture 2 garde   → change la posture du familier de l'acteur 2
 *    FAMILIER agir 2            → le fait agir immédiatement (scénario)
 *    FAMILIER etat              → résumé dans le journal
 *
 *  SCRIPT :  window.Familiers.de(actorId)      → {nom, posture, actif, palier}
 *            window.Familiers.posture(2,'garde')
 *            window.Familiers.present(2)       → true si le familier est là
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('FamilierSpirituel');
    var POSTURE_DEF = String(P['postureDefaut'] || 'libre');
    var DETRESSE    = parseInt(P['seuilDetresse']     || 40);
    var INT_LIBRE   = parseInt(P['interceptLibre']    || 20);
    var INT_GARDE   = parseInt(P['interceptGarde']    || 45);
    var USURE_INT   = parseInt(P['usureInterception'] || 2);
    var PAL_DEFER   = parseInt(P['palierDeferlante']  || 3);
    var BRISE_PAUSE = String(P['brisePause'] || 'true') === 'true';
    var LOG_ON      = String(P['montrerLog'] || 'true') === 'true';

    // ── Qui a un familier, et de quoi il est capable ────────────────────────
    var FAMILIERS = {
        2: { nom: "l'Armure Volante", frappe: 469, deferlante: 470, garde: 471 }
    };
    var POSTURES = ['libre', 'agressif', 'garde'];

    //=========================================================================
    // OUTILS
    //=========================================================================
    function conf(id) { return FAMILIERS[id] || null; }
    function acteur(id) {
        try { return $gameActors ? $gameActors.actor(id) : null; } catch (e) { return null; }
    }
    function store() {
        if (!$gameSystem) return null;
        if (!$gameSystem._familiers) $gameSystem._familiers = {};
        return $gameSystem._familiers;
    }
    function etat(id) {
        var s = store();
        if (!s || !conf(id)) return null;
        if (!s[id]) s[id] = { posture: POSTURE_DEF, tours: 0, aAgi: false };
        return s[id];
    }
    /** Le familier est-il là ? On demande à DonsSpirituels, seule source de vérité. */
    function present(id) {
        if (!conf(id)) return false;
        try {
            if (!window.Dons) return true;
            return window.Dons.aLaForme(id, 'familier') && window.Dons.estPorte(id);
        } catch (e) { return false; }
    }
    /** Ce que vaut le familier en ce moment : 0 absent · 0.5 brisé · 1 entier. */
    function facteur(id) {
        try { return window.Dons ? window.Dons.facteur(id) : 1; } catch (e) { return 1; }
    }
    function brise(id) {
        try { return !!(window.Dons && window.Dons.estCasse(id)); } catch (e) { return false; }
    }
    function palier(id) {
        try { return window.Dons ? window.Dons.palier(id) : 1; } catch (e) { return 1; }
    }
    function log(txt) {
        if (!LOG_ON) return;
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', txt); w.push('wait'); }
        else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(txt);
    }
    function porteurDe(battler) {
        if (!battler || !battler.isActor || !battler.isActor()) return 0;
        var id = battler.actorId();
        return conf(id) ? id : 0;
    }

    //=========================================================================
    // API
    //=========================================================================
    window.Familiers = {
        de: function (id) {
            var c = conf(id), e = etat(id);
            if (!c || !e) return null;
            return {
                nom: c.nom, posture: e.posture, present: present(id),
                actif: present(id) && !(BRISE_PAUSE && brise(id) && e.tours % 2 === 1),
                brise: brise(id), palier: palier(id), facteur: facteur(id)
            };
        },
        present: present,
        posture: function (id, mot) {
            var e = etat(id);
            if (!e) return '';
            mot = String(mot || '').toLowerCase().trim();
            if (POSTURES.indexOf(mot) >= 0) {
                e.posture = mot;
                var c = conf(id);
                log('\\C[23]' + c.nom + ' change de posture : ' + mot + '.\\C[0]');
            }
            return e.posture;
        },
        agir: function (id) { faireAgir(acteur(id), null); }
    };

    //=========================================================================
    // IL CHOISIT SA CIBLE ET SON GESTE
    //=========================================================================
    function ennemisVivants() {
        try { return $gameTroop.aliveMembers(); } catch (e) { return []; }
    }
    /** Sa cible : celle que sa porteuse vient de frapper, sinon la plus basse en PV. */
    function choisirCible(derniereCible) {
        var vivants = ennemisVivants();
        if (!vivants.length) return null;
        if (derniereCible && derniereCible.isEnemy && derniereCible.isEnemy() && derniereCible.isAlive()) {
            return derniereCible;
        }
        return vivants.reduce(function (a, b) { return b.hp < a.hp ? b : a; });
    }
    /** Son geste : il cogne, ou il déferle — jamais sur un ennemi isolé. */
    function choisirGeste(id) {
        var c = conf(id), e = etat(id);
        if (palier(id) >= PAL_DEFER && ennemisVivants().length > 1 && e.tours % 2 === 1) {
            return c.deferlante;
        }
        return c.frappe;
    }
    /** En posture LIBRE, il cesse de frapper quand sa porteuse est en danger. */
    function veutProteger(id) {
        var e = etat(id), a = acteur(id);
        if (!e || !a) return false;
        if (e.posture === 'garde')    return true;
        if (e.posture === 'agressif') return false;
        return a.mhp > 0 && (a.hp / a.mhp) * 100 <= DETRESSE;
    }

    //=========================================================================
    // IL JOUE SON TOUR
    //=========================================================================
    function faireAgir(porteur, derniereCible) {
        if (!porteur || !porteur.isActor || !porteur.isActor()) return;
        var id = porteur.actorId(), c = conf(id), e = etat(id);
        if (!c || !e || !present(id) || !porteur.isAlive()) return;

        e.tours++;
        // brisé, il ne s'en relève qu'un tour sur deux
        if (BRISE_PAUSE && brise(id) && e.tours % 2 === 1) {
            log('\\C[8]' + c.nom + ' se recompose péniblement — il ne suit pas.\\C[0]');
            return;
        }
        // il préfère se tenir devant elle
        if (veutProteger(id)) {
            log('\\C[23]✦ ' + c.nom + ' se place devant ' + porteur.name() + '.\\C[0]');
            montrer(porteur, [porteur], $dataSkills[c.garde].animationId);
            return;
        }
        var cible = choisirCible(derniereCible);
        if (!cible) return;

        var action = new Game_Action(porteur);
        action.setSkill(choisirGeste(id));
        action._parFamilier = true;
        // c'est LUI qui désigne : sans ça, MV taperait au hasard
        try {
            var i = $gameTroop.members().indexOf(cible);
            if (i >= 0) action.setTarget(i);
        } catch (e) { }
        var cibles = action.makeTargets().filter(function (t) { return t; });
        if (!cibles.length) return;

        log('\\C[23]✦ ' + c.nom + ' agit de lui-même.\\C[0]');
        montrer(porteur, cibles, action.item().animationId);
        cibles.forEach(function (t) {
            action.apply(t);
            var w = SceneManager._scene && SceneManager._scene._logWindow;
            if (w) w.displayActionResults(porteur, t);
        });
        action.applyGlobal();
    }

    function montrer(sujet, cibles, animId) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w && animId > 0) w.push('showAnimation', sujet, cibles.slice(), animId);
    }

    // Après chaque action de sa porteuse, le familier prend la parole.
    var _endAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        try {
            var s = this._subject;
            if (porteurDe(s) && !s._famAgiCeTour) {
                s._famAgiCeTour = true;
                var derniere = this._targets && this._targets.length ? this._targets[0] : null;
                faireAgir(s, derniere);
            }
        } catch (e) { /* ne jamais casser un combat */ }
        _endAction.call(this);
    };

    // Le drapeau retombe à chaque tour.
    var _turnStart = Game_Battler.prototype.onTurnStart;
    Game_Battler.prototype.onTurnStart = function () {
        if (_turnStart) _turnStart.call(this);
        this._famAgiCeTour = false;
    };
    var _battleStart = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function () {
        if (_battleStart) _battleStart.call(this);
        this._famAgiCeTour = false;
        var id = porteurDe(this), e = id ? etat(id) : null;
        if (e) e.tours = 0;
    };

    //=========================================================================
    // IL SE MET DEVANT — et c'est son Endurance qui paie
    //=========================================================================
    function interception(cible, degats) {
        var id = porteurDe(cible);
        if (!id || degats <= 0 || !present(id)) return degats;
        var e = etat(id);
        var pct = (e.posture === 'garde') ? INT_GARDE : INT_LIBRE;
        pct = Math.floor(pct * facteur(id));            // brisé : il n'encaisse plus que la moitié
        if (pct <= 0) return degats;

        var pris = Math.floor(degats * pct / 100);
        if (pris <= 0) return degats;

        // protéger l'use : le familier prend le coup dans son propre corps
        try {
            if (window.Dons && USURE_INT > 0) {
                var f = window.Dons.de(id);
                if (f && !f.casse) {
                    var reste = f.endurance - USURE_INT;
                    if (reste <= 0) window.Dons.casser(id);
                    else $gameSystem._donsSpi[id].end = reste;
                }
            }
        } catch (err) { }

        log('\\C[23]' + conf(id).nom + ' encaisse à sa place. (−' + pris + ')\\C[0]');
        return degats - pris;
    }

    var _exeHp = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        try { if (value > 0) value = interception(target, value); } catch (e) { }
        _exeHp.call(this, target, value);
    };

    //=========================================================================
    // COMMANDES DE PLUGIN
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'FAMILIER') return;
        var sous = (args[0] || '').toLowerCase();
        if (sous === 'posture') {
            window.Familiers.posture(parseInt(args[1] || 0), args[2]);
        } else if (sous === 'agir') {
            window.Familiers.agir(parseInt(args[1] || 0));
        } else if (sous === 'etat') {
            Object.keys(FAMILIERS).forEach(function (k) {
                var f = window.Familiers.de(parseInt(k));
                if (!f) return;
                log(f.nom + ' — ' + (f.present ? 'présent' : 'absent')
                    + ', posture ' + f.posture + ', palier ' + f.palier
                    + (f.brise ? ', BRISÉ (÷2)' : ''));
            });
        }
    };
})();
