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

    var POSTURES = ['libre', 'agressif', 'garde'];

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
        return $gameSystem._seiryu;
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
                techniques: a ? a.skills().map(function (s) { return s.name; }) : []
            };
        }
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
    function blesses(seuil) {
        return $gameParty.aliveMembers().filter(function (m) {
            return m.actorId() !== FAMILIER && m.hp / m.mhp <= seuil;
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

    function choisir(a) {
        var p = posture();
        var urgents = blesses(SEUIL_URGENCE);
        var faibles = blesses(p === 'garde' ? 0.95 : SEUIL_SOIN);

        // L'urgence passe avant tout, quelle que soit la posture.
        var soinUn = utilisables(a, SOIN_UN);
        if (urgents.length && soinUn.length) {
            return poser(a, soinUn[0], $gameParty.aliveMembers().indexOf(urgents[0]));
        }
        // Plusieurs blessés d'un coup : le souffle long vaut mieux qu'un soin.
        var soinTous = utilisables(a, SOIN_TOUS);
        if (faibles.length >= 3 && soinTous.length) { return poser(a, soinTous[0]); }
        if (faibles.length && soinUn.length && p !== 'agressif') {
            return poser(a, soinUn[0], $gameParty.aliveMembers().indexOf(faibles[0]));
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
                return poser(a, soinUn[0], $gameParty.aliveMembers().indexOf(faibles[0]));
            }
            return poser(a, 471, 0);   // Torse Gardien : il se tient, c'est tout
        }
        // Sinon il frappe, du plus fort qu'il puisse payer.
        var coups = utilisables(a, COUPS);
        if (coups.length) {
            var vivants = $gameTroop.aliveMembers();
            var cible = 0;
            if (vivants.length) {
                // il vise le plus bas en PV : il finit le travail plutôt que de l'entamer
                var bas = vivants.slice().sort(function (x, y) { return x.hp - y.hp; })[0];
                cible = Math.max(0, $gameTroop.members().indexOf(bas));
            }
            return poser(a, coups[0], cible);
        }
        return null;
    }

    var _makeActions = Game_Actor.prototype.makeActions;
    Game_Actor.prototype.makeActions = function () {
        _makeActions.call(this);
        if (this.actorId() !== FAMILIER) { return; }
        if (!this.canMove()) { return; }
        try { choisir(this); } catch (e) { /* jamais bloquer un tour de combat */ }
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
