//=============================================================================
// SeiryuLeFamilier.js
//=============================================================================
/*:
 * @plugindesc v1.0 ■ seiryu entre au combat comme CINQUIÈME COMBATTANT : ses
 * propres PV, son propre tour, ses propres coups. Il protège et il soigne.
 * @author pour JOKO
 *
 * @param acteurPorteuse
 * @text La porteuse
 * @desc Korrah = 2. Sans elle au combat, seiryu n'entre pas.
 * @type actor
 * @default 2
 *
 * @param acteurFamilier
 * @text Le familier
 * @desc seiryu = 6, classe 5 « familié ».
 * @type actor
 * @default 6
 *
 * @param postureDefaut
 * @text Sa posture par défaut
 * @desc Ce qu'il fait quand Korrah ne lui a rien dit.
 * @type select
 * @option libre
 * @option agressif
 * @option garde
 * @default libre
 *
 * @param seuilSoin
 * @text Sous quel pourcentage de PV il soigne
 * @desc En posture LIBRE. 0,40 = il soigne un allié tombé sous 40 % de sa vie.
 * @default 0.40
 *
 * @param seuilUrgence
 * @text Le seuil d'urgence
 * @desc Même en posture AGRESSIVE, sous ce seuil il lâche son coup pour soigner.
 * @default 0.25
 *
 * @param tombeAvecElle
 * @text Il tombe avec elle ?
 * @desc Korrah à terre, seiryu s'éteint. Recommandé : sans ça, le groupe peut
 * être entièrement à terre sans que le combat se termine.
 * @type boolean
 * @default true
 *
 * @param === LE LIEN (v2) ===
 * @default
 *
 * @param palierDresse
 * @text Expérience pour passer « Dressé »
 * @type number
 * @default 60
 * @desc +1 par tour de combat où il agit, +1 par ordre suivi, +3 par victoire.
 * ≈ une dizaine de combats.
 *
 * @param palierLie
 * @text Expérience pour passer « Lié »
 * @type number
 * @default 200
 * @desc ≈ une trentaine de combats ensemble.
 *
 * @param obeissanceSauvage
 * @text Obéissance quand il est Sauvage (0 à 1)
 * @default 0.25
 * @desc Au début il est incontrôlable : un ordre sur quatre, pas plus.
 *
 * @param etatAile
 * @text État — « Sous l'aile » (protection ciblée)
 * @type state
 * @default 232
 *
 * @param toursAile
 * @text Tours de protection ciblée
 * @type number
 * @default 3
 *
 * @help
 * ───────────────────────────────────────────────────────────────────────────
 * DEUX PERSONNES QUI ATTAQUENT
 * ───────────────────────────────────────────────────────────────────────────
 *
 * JOKO : « Korrah, elle a deux personnes qui attaquent. L'esprit qui fait pas
 * beaucoup de dégâts, mais qui est utile pour la protection et pour les soins,
 * pour protéger ses alliés ou elle-même. »
 *
 * Avant ce greffon, l'Avatar n'était pas quelqu'un : c'était une action de
 * plus, jouée depuis Korrah, avec une image posée derrière elle. Il n'avait ni
 * PV, ni tour, ni existence. On ne pouvait pas le viser, et il ne pouvait pas
 * tomber.
 *
 * Maintenant seiryu entre pour de bon :
 *
 *   · il a ses propres statistiques — celles de la classe 5 « familié », que
 *     JOKO avait déjà écrites : 70 % des PV de Korrah, 54 % de sa défense, et
 *     exactement sa vitesse. Fragile, et rapide ;
 *   · il a son propre tour dans l'ordre ;
 *   · on peut le viser, et il peut tomber ;
 *   · il n'est JAMAIS piloté à la main : il décide seul, selon sa posture.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * LES TROIS ORDRES
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Korrah les lance depuis sa branche « avatar ». Ils ne coûtent rien.
 *
 *   « Laisse-le faire »  <AvatarPosture: libre>     il juge tout seul
 *   « Assaut »           <AvatarPosture: agressif>  il frappe, sauf urgence
 *   « Devant moi »       <AvatarPosture: garde>     il ne frappe plus du tout
 *
 * ───────────────────────────────────────────────────────────────────────────
 * v2 — LES ORDRES QUI MARCHENT, ET LE LIEN QUI GRANDIT
 * ───────────────────────────────────────────────────────────────────────────
 *
 * JOKO : « les ordres que je donne à Avatar, eh ben, il n'y a pas d'ordre.
 * Si je veux donner un ordre pour qu'il protège quelqu'un, il va protéger
 * personne. […] Au début, il est incontrôlable, voire complètement stupide.
 * Et plus le niveau augmente, plus il va évoluer avec nous […] se souvenir de
 * comment jouer, comment bien jouer, comment s'adapter, comme une IA
 * assistante. »
 *
 * LES ORDRES — Korrah dépense son tour, seiryu agit AUSSITÔT :
 *
 *   <AvatarOrdre: X>   seiryu lance la compétence X sur la cible de Korrah
 *                      (« Vise ça », « Étau », « Unisson », « Rends-le »,
 *                      « Soigne-le »).
 *   <Avatar>           une technique de l'Avatar lancée PAR KORRAH n'est plus
 *                      frappée par elle : c'est un ordre, et c'est seiryu qui
 *                      frappe (« Saisie », « Étau », « Déferlante »…).
 *   <AvatarProtege>    « Protège-le » : seiryu prend pour lui tous les coups
 *                      ciblés sur CET allié, pendant `toursAile` tours.
 *   <AvatarPosture: …> les trois postures, inchangées.
 *
 * LE LIEN — trois paliers, portés par l'expérience de combat ENSEMBLE (pas
 * par le niveau : les héros commencent au niveau 89, il n'y aurait pas de
 * « début ») :
 *
 *   ① SAUVAGE   il obéit une fois sur quatre, et fait n'importe quoi seul :
 *               une technique au hasard, une cible au hasard.
 *   ② DRESSÉ    contrôle total : chaque ordre est suivi, tout de suite. Seul,
 *               il suit sa posture, simplement.
 *   ③ LIÉ       il pense. Seul, il joue avec ce qu'il a RETENU ; et il peut
 *               désobéir pour de bonnes raisons (« pas maintenant — Aël tombe »).
 *
 * CE QU'IL RETIENT (sauvegardé avec la partie, d'un combat à l'autre) :
 *   · quel type d'ennemi a fait le plus mal au groupe  → il le vise d'abord ;
 *   · quelle de ses techniques frappe le mieux chaque type d'ennemi → il la
 *     choisit ;
 *   · quel allié Korrah lui demande le plus souvent de protéger ou de soigner
 *     → à blessure égale, c'est lui qu'il soigne en premier.
 *
 * Ce n'est pas un réseau de neurones : ce sont trois mémoires, et des règles
 * qui s'en servent. Mais elles se remplissent en jouant, et elles changent
 * vraiment ce qu'il fait.
 *
 * Commandes :  SEIRYU experience <n>  ·  SEIRYU palier <1|2|3>  ·  SEIRYU oublier
 *
 * ───────────────────────────────────────────────────────────────────────────
 * CE QU'IL SAIT FAIRE
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Son répertoire est celui de la classe 5, qui s'ouvre à ses niveaux 25, 50
 * et 85 — les paliers qu'AvatarSpirituel avait fixés. Comme son niveau suit
 * celui de Korrah, il grandit avec elle.
 *
 * Mesuré : ses coups les plus forts font ~110 dégâts là où les héros en font
 * 2 000 à 3 200. Il ne tuera rien. Ce n'est pas un défaut — c'est ce que JOKO
 * a demandé. Sa valeur est ailleurs : il soigne, il couvre, et il encaisse à
 * la place de qui faiblit.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * TROIS PIÈGES DE MV RENCONTRÉS ICI
 * ───────────────────────────────────────────────────────────────────────────
 *
 * 1. `maxBattleMembers()` vaut 4. Un cinquième combattant n'entre pas sans
 *    qu'on l'élargisse — et seulement tant que seiryu est là, pour ne pas
 *    changer le groupe du joueur.
 *
 * 2. Un acteur ajouté à `$gameParty` reste dans le MENU. seiryu n'y a rien à
 *    faire : on l'ajoute à l'ouverture du combat et on le retire à sa
 *    fermeture, y compris si le combat tourne mal.
 *
 * 3. Si seiryu survit alors que tout le groupe est à terre, MV ne déclare pas
 *    la défaite : `$gameParty.isAllDead()` le compte comme un vivant. Il
 *    s'éteint donc avec sa porteuse — ce qui est aussi ce que dit le lore.
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('SeiryuLeFamilier');
    var PORTEUSE = parseInt(P['acteurPorteuse'] || 2, 10);
    var FAMILIER = parseInt(P['acteurFamilier'] || 6, 10);
    var POSTURE_DEF = String(P['postureDefaut'] || 'libre');
    var SEUIL_SOIN = parseFloat(P['seuilSoin'] || 0.40);
    var SEUIL_URGENCE = parseFloat(P['seuilUrgence'] || 0.25);
    var TOMBE_AVEC = String(P['tombeAvecElle'] || 'true') === 'true';
    var PALIER_DRESSE = parseInt(P['palierDresse'] || 60, 10);
    var PALIER_LIE = parseInt(P['palierLie'] || 200, 10);
    var OBEIT_SAUVAGE = parseFloat(P['obeissanceSauvage'] === undefined || P['obeissanceSauvage'] === '' ? 0.25 : P['obeissanceSauvage']);
    var ETAT_AILE = parseInt(P['etatAile'] || 232, 10);
    var TOURS_AILE = parseInt(P['toursAile'] || 3, 10);

    var POSTURES = ['libre', 'agressif', 'garde'];
    var NOMS_PALIER = { 1: 'Sauvage', 2: 'Dressé', 3: 'Lié' };

    //=========================================================================
    // OUTILS
    //=========================================================================
    function lui() { return $gameActors ? $gameActors.actor(FAMILIER) : null; }
    function elle() {
        if (!$gameParty) { return null; }
        var t = $gameParty.members().filter(function (a) { return a.actorId() === PORTEUSE; });
        return t[0] || null;
    }
    /** Consciente = vivante ET capable d'agir. C'est la règle d'AvatarSpirituel. */
    function consciente(a) {
        if (!a || !a.isAlive()) { return false; }
        try { if (a.restriction && a.restriction() === 4) { return false; } } catch (e) { }
        return true;
    }
    function memoire() {
        if (!$gameSystem) { return null; }
        if (!$gameSystem._seiryu) { $gameSystem._seiryu = { posture: POSTURE_DEF }; }
        var m = $gameSystem._seiryu;
        // Les anciennes sauvegardes n'ont que la posture : on complète sans rien perdre.
        if (m.experience === undefined) { m.experience = 0; }
        if (!m.danger) { m.danger = {}; }            // enemyId → dégâts faits au groupe
        if (!m.efficacite) { m.efficacite = {}; }    // enemyId → { skillId: [total, n] }
        if (!m.protections) { m.protections = {}; }  // actorId → ordres « protège / soigne »
        return m;
    }
    function palier() {
        var m = memoire(), e = m ? m.experience : 0;
        if (e >= PALIER_LIE) { return 3; }
        if (e >= PALIER_DRESSE) { return 2; }
        return 1;
    }
    function gagner(n, raison) {
        var m = memoire(); if (!m) { return; }
        var avant = palier();
        m.experience += n;
        var apres = palier();
        if (apres > avant) {
            journal('\\C[23]✦ seiryu devient ' + NOMS_PALIER[apres].toUpperCase() + '.\\C[0]');
        }
    }
    function posture() { var m = memoire(); return m ? m.posture : POSTURE_DEF; }
    function journal(txt) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', txt); w.push('wait'); }
    }

    window.Seiryu = {
        posture: function (p) {
            var m = memoire();
            if (m && POSTURES.indexOf(String(p)) >= 0) { m.posture = String(p); }
            return m ? m.posture : null;
        },
        acteur: lui,
        present: function () {
            return !!(lui() && $gameParty && $gameParty.battleMembers().indexOf(lui()) >= 0);
        },
        etat: function () {
            var a = lui();
            return {
                posture: posture(),
                present: window.Seiryu.present(),
                pv: a ? (a.hp + '/' + a.mhp) : null,
                niveau: a ? a._level : null,
                palier: palier(),
                nomPalier: NOMS_PALIER[palier()],
                experience: memoire() ? memoire().experience : 0,
                techniques: a ? a.skills().map(function (s) { return s.name; }) : []
            };
        },
        palier: palier,
        experience: function (n) {
            var m = memoire();
            if (m && n !== undefined) { m.experience = Math.max(0, Number(n) || 0); }
            return m ? m.experience : 0;
        },
        memoire: memoire,
        seuils: { dresse: PALIER_DRESSE, lie: PALIER_LIE }
    };

    //=========================================================================
    // IL ENTRE, ET IL SORT
    //=========================================================================
    // ⚠ Piège 1 : le groupe de combat s'arrête à 4. On l'élargit UNIQUEMENT
    // tant que seiryu est dedans — le groupe du joueur, lui, ne change pas.
    var _max = Game_Party.prototype.maxBattleMembers;
    Game_Party.prototype.maxBattleMembers = function () {
        var n = _max.call(this);
        if (this._seiryuEntre) { return n + 1; }
        return n;
    };

    function faireEntrer() {
        var k = elle(), s = lui();
        if (!k || !s || !$gameParty) { return false; }
        if ($gameParty._seiryuEntre) { return true; }

        // Il grandit avec elle : son niveau suit le sien, et son répertoire
        // se relit dessus — sans quoi il entrerait au niveau 1, sans rien savoir.
        var n = Math.max(1, k._level || 1);
        if (s._level !== n) {
            s._level = n;
            s.initSkills();
        }
        s.recoverAll();

        $gameParty._seiryuEntre = true;
        $gameParty.addActor(FAMILIER);
        return true;
    }

    function faireSortir() {
        if (!$gameParty || !$gameParty._seiryuEntre) { return; }
        $gameParty._seiryuEntre = false;
        $gameParty.removeActor(FAMILIER);
    }

    var _setup = BattleManager.setup;
    BattleManager.setup = function (troopId, canEscape, canLose) {
        // ⚠ Piège 2 : on l'ajoute pour le combat, et pour le combat seulement.
        var k = elle();
        if (k && consciente(k)) { faireEntrer(); }
        _setup.call(this, troopId, canEscape, canLose);
    };

    var _termine = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        _termine.call(this, result);
        faireSortir();
    };
    // Ceinture et bretelles : une fuite, un game over ou un retour brutal à la
    // carte ne doivent pas le laisser traîner dans le menu.
    var _quitte = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        if (!$gameParty.inBattle()) { faireSortir(); }
        _quitte.call(this);
    };

    //=========================================================================
    // IL NE SE PILOTE PAS
    //=========================================================================
    var _canInput = Game_Actor.prototype.canInput;
    Game_Actor.prototype.canInput = function () {
        if (this.actorId() === FAMILIER) { return false; }
        return _canInput.call(this);
    };
    var _isAuto = Game_Actor.prototype.isAutoBattle;
    Game_Actor.prototype.isAutoBattle = function () {
        if (this.actorId() === FAMILIER) { return true; }
        return _isAuto.call(this);
    };

    //=========================================================================
    // IL DÉCIDE
    //=========================================================================
    function utilisables(a, ids) {
        return ids.filter(function (id) {
            var s = $dataSkills[id];
            return s && a.isLearnedSkill(id) && a.canUse(s);
        });
    }
    // ⚠ Vesper ne se soigne pas en combat (LePacteDeSang, règle d'Arlecchino) :
    //   un soin sur elle rembourse sa Dette et ne rend rien. Il ne la choisit
    //   donc jamais comme blessée à soigner — sinon il gaspille son tour.
    function soignable(m) {
        try { return !(window.PacteDeSang && window.PacteDeSang.soignable && !window.PacteDeSang.soignable(m)); }
        catch (e) { return true; }
    }
    function blesses(seuil) {
        return $gameParty.aliveMembers().filter(function (m) {
            return m.actorId() !== FAMILIER && m.hp / m.mhp <= seuil && soignable(m);
        }).sort(function (x, y) { return (x.hp / x.mhp) - (y.hp / y.mhp); });
    }
    function poser(a, idSkill, cibleIndex) {
        var act = new Game_Action(a);
        act.setSkill(idSkill);
        if (cibleIndex !== undefined && cibleIndex !== null) { act.setTarget(cibleIndex); }
        a.setAction(0, act);
        return act;
    }

    /** Les identifiants de son répertoire, rangés par usage. */
    var SOIN_UN = [1259], SOIN_TOUS = [1260];
    var COUVRIR = [1261], GARDE_GROUPE = [1262, 471, 1252];
    var COUPS = [1253, 1254, 1251, 1250, 469, 470, 1249];

    // ⚠ L'index d'un allié se compte dans `members()`, pas dans
    //   `aliveMembers()` : MV vise `members()[index]`. La v1 comptait dans les
    //   vivants — dès qu'un héros était à terre devant, seiryu soignait le
    //   mauvais.
    function indexAllie(m) { return $gameParty.members().indexOf(m); }

    /** Palier ③ : à blessure égale, l'allié qu'on lui demande le plus souvent. */
    function trierBlesses(liste) {
        if (palier() < 3) { return liste; }
        var pref = memoire().protections;
        return liste.slice().sort(function (x, y) {
            var dx = x.hp / x.mhp, dy = y.hp / y.mhp;
            if (Math.abs(dx - dy) > 0.10) { return dx - dy; }
            return (pref[y.actorId()] || 0) - (pref[x.actorId()] || 0);
        });
    }

    /** L'ennemi à viser. ② au hasard ; ③ celui dont il a appris qu'il fait mal. */
    function cibleEnnemie() {
        var vivants = $gameTroop.aliveMembers();
        if (!vivants.length) { return 0; }
        var choix;
        if (palier() >= 3) {
            var danger = memoire().danger;
            choix = vivants.slice().sort(function (x, y) {
                var d = (danger[y.enemyId()] || 0) - (danger[x.enemyId()] || 0);
                return d !== 0 ? d : x.hp - y.hp;      // à danger égal, il finit le travail
            })[0];
        } else {
            choix = vivants[Math.floor(Math.random() * vivants.length)];
        }
        return Math.max(0, $gameTroop.members().indexOf(choix));
    }

    /** ③ : la technique qui, de mémoire, frappe le mieux CE type d'ennemi. */
    function meilleurCoup(coups, idxEnnemi) {
        if (palier() < 3 || coups.length < 2) { return coups[0]; }
        var e = $gameTroop.members()[idxEnnemi];
        var appris = e ? memoire().efficacite[e.enemyId()] : null;
        if (!appris) { return coups[0]; }
        var meilleur = coups[0], score = -1;
        coups.forEach(function (id) {
            var r = appris[id];
            if (r && r[1] >= 2 && r[0] / r[1] > score) { score = r[0] / r[1]; meilleur = id; }
        });
        return meilleur;
    }

    //  ① SAUVAGE — « incontrôlable, voire complètement stupide »
    function choisirSauvage(a) {
        var tout = a.skills().filter(function (s) { return a.canUse(s) && s.occasion !== 3; });
        if (!tout.length) { return null; }
        var s = tout[Math.floor(Math.random() * tout.length)];
        var act = poser(a, s.id);
        act.setTarget(-1);                  // n'importe qui
        return act;
    }

    function choisir(a) {
        if (palier() === 1) { return choisirSauvage(a); }
        var p = posture();
        var urgents = trierBlesses(blesses(SEUIL_URGENCE));
        var faibles = trierBlesses(blesses(p === 'garde' ? 0.95 : SEUIL_SOIN));

        // L'urgence passe avant tout, quelle que soit la posture.
        var soinUn = utilisables(a, SOIN_UN);
        if (urgents.length && soinUn.length) {
            return poser(a, soinUn[0], indexAllie(urgents[0]));
        }
        // Plusieurs blessés d'un coup : le souffle long vaut mieux qu'un soin.
        var soinTous = utilisables(a, SOIN_TOUS);
        if (faibles.length >= 3 && soinTous.length) { return poser(a, soinTous[0]); }
        if (faibles.length && soinUn.length && p !== 'agressif') {
            return poser(a, soinUn[0], indexAllie(faibles[0]));
        }
        // Se mettre devant : une seule fois, tant que l'état tient.
        var couvrir = utilisables(a, COUVRIR);
        if (couvrir.length && !a.isStateAffected(228) && (p === 'garde' || faibles.length)) {
            return poser(a, couvrir[0]);
        }
        // La garde de groupe, si personne ne la porte encore.
        var gg = utilisables(a, GARDE_GROUPE);
        if (gg.length && p === 'garde') {
            var deja = $gameParty.aliveMembers().some(function (m) { return m.isStateAffected(229); });
            if (!deja) { return poser(a, gg[0]); }
        }
        // En garde, il ne frappe pas. Jamais.
        if (p === 'garde') {
            if (soinUn.length && faibles.length) {
                return poser(a, soinUn[0], indexAllie(faibles[0]));
            }
            return poser(a, 471, 0);   // Torse Gardien : il se tient, c'est tout
        }
        // Sinon il frappe, du plus fort qu'il puisse payer — ou, Lié, de celui
        // qu'il sait marcher contre CET ennemi.
        var coups = utilisables(a, COUPS);
        if (coups.length) {
            var cible = cibleEnnemie();
            return poser(a, meilleurCoup(coups, cible), cible);
        }
        return null;
    }

    var _makeActions = Game_Actor.prototype.makeActions;
    Game_Actor.prototype.makeActions = function () {
        _makeActions.call(this);
        if (this.actorId() !== FAMILIER) { return; }
        if (!this.canMove()) { return; }
        // Un tour vécu ensemble = un point d'expérience (une fois par tour).
        var t = $gameTroop ? $gameTroop.turnCount() : 0;
        var m = memoire();
        if (m && m._dernierTour !== t + ':' + ($gameTroop ? $gameTroop._troopId : 0)) {
            m._dernierTour = t + ':' + ($gameTroop ? $gameTroop._troopId : 0);
            gagner(1);
        }
        try { choisir(this); } catch (e) { /* jamais bloquer un tour de combat */ }
    };

    //=========================================================================
    // CE QU'IL RETIENT
    //=========================================================================
    var _degatsPV = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        _degatsPV.call(this, target, value);
        if (!(value > 0) || !$gameParty || !$gameParty.inBattle()) { return; }
        var u = this.subject(), m = memoire();
        if (!u || !m || !target) { return; }
        try {
            // qui fait mal au groupe
            if (u.isEnemy() && target.isActor()) {
                var k = u.enemyId();
                m.danger[k] = (m.danger[k] || 0) + value;
            }
            // ce que ses coups valent contre qui
            if (u.isActor() && u.actorId() === FAMILIER && target.isEnemy() && this.isSkill()) {
                var e = target.enemyId(), sk = this.item().id;
                if (!m.efficacite[e]) { m.efficacite[e] = {}; }
                var r = m.efficacite[e][sk] || [0, 0];
                m.efficacite[e][sk] = [r[0] + value, r[1] + 1];
            }
        } catch (x) { }
    };

    // ⚠ UNE FOIS PAR COMBAT. YEP_VictoryAftermath rappelle processVictory à
    //   CHAQUE IMAGE tant que l'écran de victoire attend le joueur : la
    //   première version donnait +3 par image, et seiryu passait « Lié »
    //   après une seule victoire. Trouvé par bancs/navigateur/lavatar_obeit.js.
    var _victoire = BattleManager.processVictory;
    BattleManager.processVictory = function () {
        if ($gameParty._seiryuEntre && !this._seiryuVictoirePayee) {
            this._seiryuVictoirePayee = true;
            gagner(3);
        }
        _victoire.call(this);
    };
    var _setupV = BattleManager.setup;
    BattleManager.setup = function (troopId, canEscape, canLose) {
        this._seiryuVictoirePayee = false;
        _setupV.call(this, troopId, canEscape, canLose);
    };

    // Au début du combat, on dit où il en est.
    var _debut = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _debut.call(this);
        if ($gameParty._seiryuEntre && memoire()) {
            var p = palier(), m = memoire();
            var prochain = p === 1 ? PALIER_DRESSE : (p === 2 ? PALIER_LIE : null);
            journal('\\C[23]✦ seiryu — ' + NOMS_PALIER[p]
                + (prochain ? ' (' + m.experience + '/' + prochain + ')' : '') + '\\C[0]');
        }
    };

    //=========================================================================
    // LES ORDRES — Korrah dépense son tour, seiryu agit aussitôt
    //=========================================================================
    /** Ce que Korrah ordonne avec cette action — ou null si ce n'est pas un ordre. */
    function ordreDe(action) {
        var u = action.subject(), it = action.item();
        if (!u || !u.isActor || !u.isActor() || u.actorId() !== PORTEUSE || !it || !action.isSkill()) { return null; }
        var n = it.note || '';
        if (/<\s*AvatarProtege\s*>/i.test(n)) { return { protege: true }; }
        var m = /<\s*AvatarOrdre\s*:\s*([^>]*)>/i.exec(n);
        if (m) { return { skill: parseInt(String(m[1]).trim(), 10) }; }
        // Une technique de l'Avatar lancée par Korrah : c'est lui qui frappe.
        if (it.meta && it.meta.Avatar !== undefined && !/<\s*AvatarPosture/i.test(n)) { return { skill: it.id }; }
        return null;
    }

    function estPourAllies(skill) { return skill && skill.scope >= 7 && skill.scope <= 11; }
    function estSoin(skill) { return skill && (skill.damage.type === 3 || skill.damage.type === 4); }

    function obeit() {
        var p = palier();
        if (p === 1 && Math.random() >= OBEIT_SAUVAGE) {
            journal('\\C[8]✦ seiryu n\'écoute pas.\\C[0]');
            return false;
        }
        return true;
    }

    function donnerOrdre(ordre, cible) {
        var s = lui();
        if (!s || !window.Seiryu.present() || !s.isAlive() || !s.canMove()) {
            journal('\\C[8]✦ seiryu ne peut pas répondre.\\C[0]');
            return;
        }
        if (!obeit()) { return; }

        // « Protège-le »
        if (ordre.protege) {
            if (!cible || !cible.isActor || !cible.isActor() || cible === s) { return; }
            cible.addState(ETAT_AILE);
            if (cible.isStateAffected(ETAT_AILE)) {
                cible._stateTurns[ETAT_AILE] = TOURS_AILE;
                memoire().protections[cible.actorId()] = (memoire().protections[cible.actorId()] || 0) + 1;
                journal('\\C[23]✦ seiryu se place au-dessus de ' + cible.name() + '.\\C[0]');
                gagner(1);
            }
            return;
        }

        var skill = $dataSkills[ordre.skill];
        if (!skill) { return; }

        // ③ LIÉ : il peut refuser un coup quand quelqu'un est en train de tomber.
        if (palier() === 3 && !estSoin(skill)) {
            var urgents = trierBlesses(blesses(SEUIL_URGENCE));
            var soin = utilisables(s, SOIN_UN);
            if (urgents.length && soin.length) {
                journal('\\C[23]✦ seiryu : « pas maintenant — ' + urgents[0].name() + ' tombe. »\\C[0]');
                BattleManager.queueForceAction(s, soin[0], indexAllie(urgents[0]));
                return;
            }
        }

        if (!s.isLearnedSkill(skill.id) || !s.canUse(skill)) {
            journal('\\C[8]✦ seiryu ne sait pas encore faire ça — ou n\'a plus de quoi.\\C[0]');
            return;
        }
        var idx = -1;                                   // au hasard, faute de mieux
        if (cible && estPourAllies(skill) && cible.isActor && cible.isActor()) { idx = indexAllie(cible); }
        else if (cible && !estPourAllies(skill) && cible.isEnemy && cible.isEnemy()) { idx = cible.index(); }
        if (estPourAllies(skill) && cible && cible.isActor && cible.isActor()) {
            memoire().protections[cible.actorId()] = (memoire().protections[cible.actorId()] || 0) + 1;
        }
        BattleManager.queueForceAction(s, skill.id, idx);
        gagner(1);
    }

    // Korrah ne frappe pas avec un ordre : elle commande. On ne laisse donc
    // PAS passer l'effet de sa propre action sur la cible.
    var _applyOrdre = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        var ordre = ordreDe(this);
        if (!ordre) { return _applyOrdre.call(this, target); }
        if (!this._ordreDonne) {
            this._ordreDonne = true;
            try { donnerOrdre(ordre, target); } catch (e) { }
        }
    };

    // « Protège-le » : tout coup CIBLÉ sur l'allié sous son aile, c'est lui qui
    // le prend — pas seulement quand l'allié est au bord de la mort, comme le
    // « Substitut » de MV.
    var _substitut = BattleManager.applySubstitute;
    BattleManager.applySubstitute = function (target) {
        var s = lui(), act = this._action;
        if (target && target.isActor && target.isActor() && target.isStateAffected(ETAT_AILE)
            && s && s !== target && s.isAlive() && s.canMove() && window.Seiryu.present()
            && act && act.subject() && act.subject().isEnemy && act.subject().isEnemy() && act.isForOne()) {
            if (this._logWindow) { this._logWindow.displaySubstitute(s, target); }
            return s;
        }
        return _substitut.call(this, target);
    };

    var _pcS = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pcS.call(this, command, args);
        if (String(command).toUpperCase() !== 'SEIRYU') { return; }
        var sub = String(args[0] || '').toLowerCase(), m = memoire();
        if (!m) { return; }
        if (sub === 'experience') { m.experience = Math.max(0, parseInt(args[1], 10) || 0); }
        else if (sub === 'palier') {
            var p = parseInt(args[1], 10);
            m.experience = p >= 3 ? PALIER_LIE : (p === 2 ? PALIER_DRESSE : 0);
        } else if (sub === 'oublier') { m.danger = {}; m.efficacite = {}; m.protections = {}; }
    };

    //=========================================================================
    // LES TROIS ORDRES
    //=========================================================================
    // Korrah lance l'ordre ; c'est la posture de seiryu qui change.
    var _applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function () {
        _applyGlobal.call(this);
        var it = this.item();
        if (!it || !it.note) { return; }
        var m = /<\s*AvatarPosture\s*:\s*([^>]*)>/i.exec(it.note);
        // ⚠ Les métadonnées de MV gardent l'espace après le « : » (§7).
        if (!m) { return; }
        var p = String(m[1]).trim().toLowerCase();
        if (POSTURES.indexOf(p) < 0) { return; }
        window.Seiryu.posture(p);
        var dit = { libre: 'juge tout seul', agressif: 'frappe', garde: 'ne frappe plus — il couvre' };
        journal('\\C[23]✦ ' + (lui() ? lui().name() : 'seiryu') + ' ' + dit[p] + '.\\C[0]');
    };

    //=========================================================================
    // IL S'ÉTEINT AVEC ELLE
    //=========================================================================
    // ⚠ Piège 3 : s'il survit au groupe entier, MV ne déclare pas la défaite.
    function verifierLeLien() {
        if (!TOMBE_AVEC || !$gameParty || !$gameParty.inBattle()) { return; }
        var s = lui(), k = elle();
        if (!s || !k || !$gameParty._seiryuEntre) { return; }
        if (!consciente(k) && s.isAlive()) {
            journal('\\C[8]' + s.name() + " s'éteint avec elle.\\C[0]");
            s.addState(s.deathStateId());
        } else if (consciente(k) && s.isDead()) {
            // elle rouvre les yeux : il revient, mais pas à pleine vie
            s.removeState(s.deathStateId());
            s.setHp(Math.max(1, Math.floor(s.mhp * 0.25)));
            journal('\\C[23]✦ ' + s.name() + ' revient avec elle.\\C[0]');
        }
    }
    var _finTour = BattleManager.endTurn;
    BattleManager.endTurn = function () {
        try { verifierLeLien(); } catch (e) { }
        _finTour.call(this);
    };
    var _finAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        try { verifierLeLien(); } catch (e) { }
        _finAction.call(this);
    };
})();
