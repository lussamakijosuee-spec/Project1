//=============================================================================
// AvatarSpirituel.js — v2.0  ·  L'Avatar Spirituel agit de lui-même
// RPG Maker MV   ·   d'après le Codex des Trois Sources, chapitre 6.5
//   À charger APRÈS DonsSpirituels et TraitsAme.
//=============================================================================
/*:
 * @plugindesc v2.0 ■ L'AVATAR SPIRITUEL (2 %) n'est pas un bonus : c'est une créature.
 * Il joue son propre tour, choisit sa cible, et se met devant sa porteuse quand
 * elle est en danger. Trois ORDRES le pilotent en plein combat.
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
 * @text Avatar BRISÉ — il ne peut plus agir qu'un tour sur deux ?
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
 *  L'AVATAR SPIRITUEL QUI AGIT                                Codex, chapitre 6.5
 * ═══════════════════════════════════════════════════════════════════════════
 *  « L'Avatar est une créature issue directement de l'âme — pas une
 *    invocation, pas un pacte : une part de soi qui marche à côté de soi. »
 *
 *  Les 2 % ne reçoivent pas un objet : ils reçoivent QUELQU'UN. Ce plugin lui
 *  donne ce qui lui manquait — un tour à lui.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  IL JOUE SON PROPRE TOUR
 *  ─────────────────────────────────────────────────────────────────────────
 *  Quand sa porteuse a fini d'agir, l'Avatar agit à son tour. Ce n'est pas
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
 *  coup, l'Avatar en prend une part — et c'est SON Endurance qui la paie.
 *  Protéger l'use : un Avatar qui a beaucoup gardé finit par se disloquer.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LES TROIS POSTURES — ET ON LES DONNE EN PLEIN COMBAT
 *  ─────────────────────────────────────────────────────────────────────────
 *    ▶ LIBRE     (défaut) il frappe, intercepte un peu — et bascule tout seul
 *                en protection quand sa porteuse tombe sous seuilDetresse %.
 *    ▶ AGRESSIF  il frappe toujours, quoi qu'il arrive. Intercepte peu.
 *    ▶ GARDE     il ne frappe plus du tout. Il ne fait que se mettre devant,
 *                et encaisse presque la moitié de ce qui vise sa porteuse.
 *
 *  La posture ne se réglait que par commande d'événement : le joueur n'avait
 *  AUCUNE prise sur la seule créature autonome du jeu. Korrah connaît
 *  maintenant trois ORDRES, dès le niveau 1, sous « Spéciale » :
 *
 *      ✦ Avatar — Laisse-le faire   → posture LIBRE
 *      ✦ Avatar — Assaut            → posture AGRESSIF
 *      ✦ Avatar — Devant moi        → posture GARDE
 *
 *  Ils coûtent 0 mana, et le tour n'est pas perdu : donner l'ordre le fait
 *  agir DANS LA FOULÉE. On paie une action, on obtient une action.
 *  Toute compétence notée <AvatarPosture: libre|agressif|garde> fait ça.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  CE QU'IL COÛTE — la contrepartie des 2 %
 *  ─────────────────────────────────────────────────────────────────────────
 *   • Il occupe le slot ÂME (voir DonsSpirituels).
 *   • Chacune de ses frappes USE l'Endurance du Don, comme celles de sa
 *     porteuse : un Avatar actif brûle sa jauge DEUX FOIS PLUS VITE.
 *   • Chaque interception coûte usureInterception de plus.
 *   • BRISÉ, il agit un tour sur deux et tout ce qu'il fait est divisé par
 *     deux (dégâts comme interception). Il ne meurt pas : il fatigue.
 *   • ABSENT du slot Âme, il n'existe pas — et le Trait qu'il débloquait
 *     non plus.
 *
 *  ⚠️ IL NE PORTE PAS LE TRAIT À LA PLACE DE SA PORTEUSE. Les frappes de
 *     l'Avatar sont des frappes d'Avatar : elles n'ont pas l'élément
 *     GLACE et ne déclenchent pas le recul d'HIVER. Le froid reste le prix
 *     que Korrah paie elle-même — sinon l'Avatar deviendrait la faille
 *     qui annule la règle d'or.
 *
 *  ⚠️ ET C'EST SON SEUL DON. Korrah n'a pas d'arme spirituelle en plus :
 *     ses gantelets sont de l'acier ordinaire. On n'a qu'un Don, jamais deux.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  COMMANDES DE PLUGIN
 *  ─────────────────────────────────────────────────────────────────────────
 *    AVATAR posture 2 garde   → change la posture de l'Avatar de l'acteur 2
 *    AVATAR agir 2            → le fait agir immédiatement (scénario)
 *    AVATAR etat              → résumé dans le journal
 *    (FAMILIER … reste accepté : les anciens événements continuent de marcher)
 *
 *  SCRIPT :  window.Avatars.de(actorId)      → {nom, posture, actif, palier}
 *            window.Avatars.posture(2,'garde')
 *            window.Avatars.present(2)       → true si l'Avatar est là
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('AvatarSpirituel');
    var POSTURE_DEF = String(P['postureDefaut'] || 'libre');
    var DETRESSE    = parseInt(P['seuilDetresse']     || 40);
    var INT_LIBRE   = parseInt(P['interceptLibre']    || 20);
    var INT_GARDE   = parseInt(P['interceptGarde']    || 45);
    var USURE_INT   = parseInt(P['usureInterception'] || 2);
    var PAL_DEFER   = parseInt(P['palierDeferlante']  || 3);
    var BRISE_PAUSE = String(P['brisePause'] || 'true') === 'true';
    var LOG_ON      = String(P['montrerLog'] || 'true') === 'true';

    // ── Qui a un avatar, et de quoi il est capable ────────────────────────
    var AVATARS = {
        2: { nom: "l'Armure Volante", frappe: 469, deferlante: 470, garde: 471 }
    };
    var POSTURES = ['libre', 'agressif', 'garde'];

    //=========================================================================
    // OUTILS
    //=========================================================================
    function conf(id) { return AVATARS[id] || null; }
    function acteur(id) {
        try { return $gameActors ? $gameActors.actor(id) : null; } catch (e) { return null; }
    }
    function store() {
        if (!$gameSystem) return null;
        if (!$gameSystem._avatars) $gameSystem._avatars = {};
        return $gameSystem._avatars;
    }
    function etat(id) {
        var s = store();
        if (!s || !conf(id)) return null;
        if (!s[id]) s[id] = { posture: POSTURE_DEF, tours: 0, aAgi: false };
        return s[id];
    }
    /** Le avatar est-il là ? On demande à DonsSpirituels, seule source de vérité. */
    function present(id) {
        if (!conf(id)) return false;
        try {
            if (!window.Dons) return true;
            return window.Dons.aLaForme(id, 'avatar') && window.Dons.estPorte(id);
        } catch (e) { return false; }
    }
    /** Ce que vaut l'Avatar en ce moment : 0 absent · 0.5 brisé · 1 entier. */
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
    window.Avatars = {
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
    // Ancien nom de l'API, conservé pour ne rien casser.
    window.Familiers = window.Avatars;

    //=========================================================================
    // MANIABLE — TROIS ORDRES, DONNÉS EN COMBAT
    //=========================================================================
    // Une créature autonome que le joueur ne peut pas piloter, ce n'est pas de
    // la profondeur, c'est du hasard. Toute compétence portant
    // <AvatarPosture: libre|agressif|garde> change la posture ET fait agir
    // l'Avatar dans la foulée : le tour dépensé rapporte quand même un coup.
    function ordreDe(item) {
        if (!item || !item.meta) return '';
        var p = item.meta['AvatarPosture'];
        if (!p || p === true) return '';
        p = String(p).toLowerCase().trim();
        if (p === 'assaut') p = 'agressif';          // synonyme toléré
        return POSTURES.indexOf(p) >= 0 ? p : '';
    }

    var _applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function () {
        _applyGlobal.call(this);
        try {
            if (this._parAvatar) return;
            var s = this.subject(), id = porteurDe(s);
            if (!id) return;
            var ordre = ordreDe(this.item());
            if (!ordre) return;

            if (!present(id)) {
                log("\\C[7]Aucun Avatar ne répond — il n'est pas au slot Âme.\\C[0]");
                return;
            }
            window.Avatars.posture(id, ordre);
            // L'ordre ne coûte pas le tour : il agit tout de suite.
            s._avatarAgiCeTour = true;
            faireAgir(s, null);
        } catch (e) { /* ne jamais casser un combat */ }
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
        action._parAvatar = true;
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

    // Après chaque action de sa porteuse, l'Avatar prend la parole.
    var _endAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        try {
            var s = this._subject;
            if (porteurDe(s) && !s._avatarAgiCeTour) {
                s._avatarAgiCeTour = true;
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
        this._avatarAgiCeTour = false;
    };
    var _battleStart = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function () {
        if (_battleStart) _battleStart.call(this);
        this._avatarAgiCeTour = false;
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

        // protéger l'use : l'Avatar prend le coup dans son propre corps
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
        // FAMILIER reste accepté : les événements écrits avant le renommage
        // continuent de fonctionner tels quels.
        var mot = String(cmd).toUpperCase();
        if (mot !== 'AVATAR' && mot !== 'FAMILIER') return;
        var sous = (args[0] || '').toLowerCase();
        if (sous === 'posture') {
            window.Avatars.posture(parseInt(args[1] || 0), args[2]);
        } else if (sous === 'agir') {
            window.Avatars.agir(parseInt(args[1] || 0));
        } else if (sous === 'etat') {
            Object.keys(AVATARS).forEach(function (k) {
                var f = window.Avatars.de(parseInt(k));
                if (!f) return;
                log(f.nom + ' — ' + (f.present ? 'présent' : 'absent')
                    + ', posture ' + f.posture + ', palier ' + f.palier
                    + (f.brise ? ', BRISÉ (÷2)' : ''));
            });
        }
    };
})();
