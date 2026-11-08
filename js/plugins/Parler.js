//=============================================================================
// Parler.js — au Chapitre 1, un adversaire est quelqu'un : on peut lui parler
//=============================================================================
/*:
 * @plugindesc v1.0 Parler : au Chapitre 1, un ennemi qui baisse sa garde s'écoute (six approches, la bonne selon son peuple)
 * @author Claude, pour JOKO
 *
 * @param baliseCarte
 * @text Balise de la carte
 * @desc Une carte du Chapitre 1 porte cette balise dans sa note : <Chapitre 1>. Ailleurs, Parler n'existe pas.
 * @default Chapitre 1
 *
 * @param nomCommande
 * @text Nom de la commande
 * @default 💬 Parler
 *
 * @param seuilGarde
 * @text Seuil de la garde (%)
 * @desc Sous ce pourcentage de PV, il baisse sa garde (comme quand son bouclier est brisé).
 * @type number
 * @default 30
 *
 * @param seuilFuite
 * @text Seuil de la fuite (%)
 * @desc Apaisé sous ce pourcentage de PV, il s'enfuit au lieu de se calmer : ni récompense, ni réputation.
 * @type number
 * @default 10
 *
 * @param reponsesParRang
 * @text Bonnes réponses par rang
 * @desc Combien de bonnes approches pour l'apaiser. Un boss ne s'apaise jamais par Parler.
 * @default D: 1, C: 2, B: 3, A: 4, S: 5, aucun: 1
 *
 * @param colere
 * @text Colère d'un refus
 * @desc Chaque mauvaise approche : ses coups font tant de plus, jusqu'à la fin du combat (0.1 = +10 %).
 * @default 0.1
 *
 * @param chanceCadeau
 * @text Chance d'un cadeau (%)
 * @desc Apaisé, il laisse un objet de sa liste de butin une fois sur…
 * @type number
 * @default 25
 *
 * @param expEpargne
 * @text Expérience d'un épargné
 * @desc La part de son expérience qu'il rapporte (1 = toute). Son or, jamais.
 * @default 1
 *
 * @param prixMinimum
 * @text Prix minimum d'un cadeau
 * @desc « Offrir » coûte l'or qu'il porte, au moins ce prix.
 * @type number
 * @default 10
 *
 * @param grosCoup
 * @text Gros coup (%)
 * @desc « Impressionner » marche si un héros lui a porté, ce tour ou le précédent, un coup d'au moins ce % de ses PV max.
 * @type number
 * @default 15
 *
 * @param frapperSeSait
 * @text Frapper qui a baissé sa garde se sait
 * @desc La première fois qu'on le frappe garde baissée : la réputation de son peuple et l'évaluation éthique baissent.
 * @type boolean
 * @default true
 *
 * @param variableEthique
 * @text Variable de l'évaluation éthique
 * @desc 0 : gardée par le plugin (Parler.ethique()). Sinon, le numéro d'une variable.
 * @type variable
 * @default 0
 *
 * @param peuples
 * @text Les peuples
 * @type note
 * @desc Une ligne par peuple : clé | nom | les noms d'ennemis qui en sont | les approches qui marchent | l'indice (de la Bible)
 * @default "gelees | Gelées | slime, gelée | avouer | Leur offrir une émotion sincère.\ngobelins | Gobelins | gobelin, goblin | plaisanter | Une meilleure blague que la leur.\norques | Orques | orc, orque | ecouter | Écouter leur colère jusqu'au bout.\nfarfadets | Farfadets | farfadet, lutin | plaisanter | Les faire rire.\ntrolls | Trolls Rancuniers | troll | ecouter | Comprendre leur rancœur.\npleureuses | Pleureuses | harpie, pleureuse | offrir, ecouter | Rendre un objet, ou écouter un chant entier.\nloups | Loups-Frisson | loup | plaisanter | Un loup-frisson qui entend rire recule.\nmurmures | Murmures | chauve-souris, murmure | avouer | Échanger un secret.\npetitsrefus | Petits Refus | diablotin, petit refus | contraire | Leur demander le contraire de ce qu'on veut.\nenvies | Envies | mimic, mimique, envie | offrir, avouer | Payer, ou avouer ce qu'on désire vraiment.\nmirages | Mirages | mirage | avouer | Leur dire ce qu'on désire vraiment.\nvouivres | Vouivres et Orgueils | wyverne, vouivre, dragon | impressionner | Les flatter ne marche jamais : il faut les impressionner."
 *
 * @help
 * ============================================================================
 * Parler (2026-11-08)
 * ============================================================================
 * La Bible de JOKO, « Le Chapitre 1 dans le jeu » : « Au Chapitre 1, chaque
 * adversaire est quelqu'un. En combat, la commande Parler s'ajoute à
 * Attaquer. » Et, tranché avec le jeu : « Parler ne remplace pas le combat :
 * la commande s'ouvre quand l'adversaire baisse sa garde, à la Brisure de son
 * bouclier ou sous un seuil de PV. » JOKO : « Par carte » — aucune fiche
 * d'ennemi n'est touchée.
 *
 * Où : seulement sur une carte dont la note porte <Chapitre 1>.
 * Qui : un ennemi dont le nom est dans la liste d'un peuple (réglage), ou qui
 *   porte <Peuple: clé> ; jamais un boss (<Meca…:>, <Phases:>, <Boss>), ni un
 *   ennemi <SansParler>. Un peuple sans approche (les Rêveurs, les Rancœurs,
 *   les Statues, les Arbres-Mémoire, les morts : la Bible les règle par une
 *   quête) n'a pas Parler.
 * Quand : la commande est grisée tant qu'aucun d'eux ne baisse sa garde
 *   (brisé, ou sous seuilGarde % de PV) ; « 🕊 Il baisse sa garde ».
 * Comment : six approches — 😄 Plaisanter, 👂 Écouter, 🎁 Offrir (son or),
 *   💬 Avouer, ⚔ Impressionner (après un gros coup), 🔄 Demander le contraire.
 *   La bonne : « 💬 Il t'écoute · 1/2 » ; la mauvaise : « 😠 Il refuse », il
 *   frappe plus fort, et l'indice de son peuple s'affiche.
 * Apaisé : il se calme et s'en va (réputation de son peuple +1, son
 *   expérience, parfois un cadeau) ; sous seuilFuite %, il s'enfuit.
 * Le frapper garde baissée « fonctionne, et se sait » : réputation −1 et
 *   évaluation éthique −1, une fois par ennemi.
 *
 * Pour un banc : window.Parler (peuple, gardeBaissee, parlable, reputation,
 * ethique, APPROCHES, skillDe).
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('Parler');
    var BALISE = String(P.baliseCarte || 'Chapitre 1').trim();
    var NOM = String(P.nomCommande || '💬 Parler');
    var SEUIL_GARDE = Number(P.seuilGarde || 30) / 100;
    var SEUIL_FUITE = Number(P.seuilFuite || 10) / 100;
    var COLERE = Number(P.colere || 0.1);
    var CADEAU = Number(P.chanceCadeau || 25) / 100;
    var EXP = P.expEpargne === undefined ? 1 : Number(P.expEpargne);
    var PRIX_MIN = Number(P.prixMinimum || 10);
    var GROS = Number(P.grosCoup || 15) / 100;
    var SE_SAIT = String(P.frapperSeSait || 'true') === 'true';
    var VAR_ETHIQUE = Number(P.variableEthique || 0);

    var REPONSES = {};
    String(P.reponsesParRang || 'D: 1, C: 2, B: 3, A: 4, S: 5, aucun: 1').split(',').forEach(function (s) {
        var m = s.split(':'); if (m.length === 2) { REPONSES[m[0].trim().toUpperCase()] = Number(m[1]) || 1; }
    });

    var APPROCHES = [
        { cle: 'plaisanter', nom: '😄 Plaisanter', icone: 84, aide: 'Faire rire. Une blague, un pari, un défi drôle.' },
        { cle: 'ecouter', nom: '👂 Écouter', icone: 81, aide: 'Le laisser dire ce qu\'il a sur le cœur, jusqu\'au bout.' },
        { cle: 'offrir', nom: '🎁 Offrir', icone: 313, aide: 'Lui donner de l\'or : ce qu\'il porte lui-même.' },
        { cle: 'avouer', nom: '💬 Avouer', icone: 4, aide: 'Dire quelque chose de vrai : un désir, un secret, ce qu\'on ressent.' },
        { cle: 'impressionner', nom: '⚔ Impressionner', icone: 77, aide: 'Lui montrer de quoi on est capable. Il faut l\'avoir frappé fort juste avant.' },
        { cle: 'contraire', nom: '🔄 Le contraire', icone: 5, aide: 'Lui demander exactement le contraire de ce qu\'on veut.' }
    ];
    var PAR_CLE = {};
    APPROCHES.forEach(function (a) { PAR_CLE[a.cle] = a; });

    // --- les peuples ---------------------------------------------------------
    var PEUPLES = {};
    var PEUPLES_DEFAUT = [
        'gelees | Gelées | slime, gelée | avouer | Leur offrir une émotion sincère.',
        'gobelins | Gobelins | gobelin, goblin | plaisanter | Une meilleure blague que la leur.',
        'orques | Orques | orc, orque | ecouter | Écouter leur colère jusqu\'au bout.',
        'farfadets | Farfadets | farfadet, lutin | plaisanter | Les faire rire.',
        'trolls | Trolls Rancuniers | troll | ecouter | Comprendre leur rancœur.',
        'pleureuses | Pleureuses | harpie, pleureuse | offrir, ecouter | Rendre un objet, ou écouter un chant entier.',
        'loups | Loups-Frisson | loup | plaisanter | Un loup-frisson qui entend rire recule.',
        'murmures | Murmures | chauve-souris, murmure | avouer | Échanger un secret.',
        'petitsrefus | Petits Refus | diablotin, petit refus | contraire | Leur demander le contraire de ce qu\'on veut.',
        'envies | Envies | mimic, mimique, envie | offrir, avouer | Payer, ou avouer ce qu\'on désire vraiment.',
        'mirages | Mirages | mirage | avouer | Leur dire ce qu\'on désire vraiment.',
        'vouivres | Vouivres et Orgueils | wyverne, vouivre, dragon | impressionner | Les flatter ne marche jamais : il faut les impressionner.'
    ].join('\n');
    (function () {
        var txt = String(P.peuples || PEUPLES_DEFAUT);
        try { if (/^\s*"/.test(txt)) { txt = JSON.parse(txt); } } catch (x) { }
        txt.split(/\r?\n/).forEach(function (l) {
            var c = l.split('|').map(function (s) { return s.trim(); });
            if (c.length < 4 || !c[0]) { return; }
            PEUPLES[c[0]] = {
                cle: c[0], nom: c[1],
                mots: c[2].split(',').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean),
                approches: c[3].split(',').map(function (s) { return s.trim().toLowerCase(); }).filter(function (s) { return PAR_CLE[s]; }),
                indice: c[4] || ''
            };
        });
    })();
    // un mot entier : « orc » est dans « Orc », pas dans « Sorcier »
    function contientMot(nom, mot) {
        var i = nom.indexOf(mot);
        while (i >= 0) {
            var av = i ? nom.charAt(i - 1) : ' ';
            if (!/[a-zà-öø-ÿ]/.test(av)) { return true; }
            i = nom.indexOf(mot, i + 1);
        }
        return false;
    }

    function surChapitre1() { return !!($dataMap && $dataMap.meta && $dataMap.meta[BALISE]); }
    function note(e) { return (e && e.enemy && e.enemy() && e.enemy().note) || ''; }
    function estBoss(e) {
        var n = note(e);
        return /<\s*(Meca\w*|Phases)\s*:/i.test(n) || /<\s*Boss\s*>/i.test(n);
    }
    function peuple(e) {
        if (!e || !e.isEnemy || !e.isEnemy()) { return null; }
        var d = e.enemy(), m = d.meta || {};
        if (m.SansParler) { return null; }
        if (m.Peuple) { return PEUPLES[String(m.Peuple).trim().toLowerCase()] || null; }
        var nom = String(d.name || '').toLowerCase();
        for (var k in PEUPLES) {
            if (PEUPLES[k].mots.some(function (mot) { return contientMot(nom, mot); })) { return PEUPLES[k]; }
        }
        return null;
    }
    function parlable(e) {
        if (!surChapitre1() || !e || !e.isAlive() || estBoss(e)) { return false; }
        var p = peuple(e);
        return !!(p && p.approches.length);
    }
    function brise(e) { return !!(e.etatDeBrise && e.isStateAffected(e.etatDeBrise())); }
    function gardeBaissee(e) { return parlable(e) && (brise(e) || e.hpRate() <= SEUIL_GARDE); }
    function rang(e) {
        var r = window.EquilibreDesCombats ? EquilibreDesCombats.rangDe(e) : null;
        if (!r) { var m = /<\s*Rang\s*:\s*([^>]*)>/i.exec(note(e)); r = m ? m[1].trim().toUpperCase() : null; }
        return r || 'AUCUN';
    }
    function besoin(e) { return REPONSES[rang(e)] || REPONSES.AUCUN || 1; }
    function tour() { return $gameTroop.turnCount(); }
    function annonce(b, t, c) { if (window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, t, c); } }

    // --- réputation, éthique -------------------------------------------------
    function reputations() { return ($gameSystem._reputationPeuples = $gameSystem._reputationPeuples || {}); }
    function reputation(cle, delta) {
        var r = reputations();
        if (delta) { r[cle] = (r[cle] || 0) + delta; }
        return r[cle] || 0;
    }
    function ethique(delta) {
        if (VAR_ETHIQUE > 0) {
            if (delta) { $gameVariables.setValue(VAR_ETHIQUE, $gameVariables.value(VAR_ETHIQUE) + delta); }
            return $gameVariables.value(VAR_ETHIQUE);
        }
        if (delta) { $gameSystem._ethique = ($gameSystem._ethique || 0) + delta; }
        return $gameSystem._ethique || 0;
    }

    // --- les six approches : des compétences créées en mémoire ----------------
    // RPG Maker peut rester ouvert : rien n'est écrit dans Skills.json. Elles sont ajoutées au chargement,
    // avant que les plugins de Yanfly lisent la base, comme si elles y étaient.
    var SKILL = {};
    var _onLoad = DataManager.onLoad;
    DataManager.onLoad = function (object) {
        _onLoad.call(this, object);
        if (object === window.$dataSkills && object && !object._parlerAjoute) {
            object._parlerAjoute = true;
            var base = object[1];
            APPROCHES.forEach(function (a) {
                var s = JSON.parse(JSON.stringify(base));
                s.id = object.length;
                s.name = a.nom; s.iconIndex = a.icone; s.description = a.aide;
                s.stypeId = 0; s.mpCost = 0; s.tpCost = 0; s.tpGain = 0;
                s.scope = 1; s.occasion = 1; s.speed = 0; s.successRate = 100; s.repeats = 1;
                s.hitType = 0; s.animationId = 0; s.requiredWtypeId1 = 0; s.requiredWtypeId2 = 0;
                s.damage = { type: 0, elementId: 0, formula: '0', variance: 0, critical: false };
                s.effects = []; s.message1 = ''; s.message2 = '';
                s.note = '<Art: aucun>\n<Parler: ' + a.cle + '>';
                s.meta = {};
                DataManager.extractMetadata(s);
                object.push(s);
                SKILL[a.cle] = s.id;
            });
        }
    };
    function approcheDe(item) {
        if (!item || !DataManager.isSkill(item) || !item.meta || !item.meta.Parler) { return null; }
        return String(item.meta.Parler).trim();
    }

    // --- la commande --------------------------------------------------------
    function ennemisParlables() { return $gameTroop.aliveMembers().filter(parlable); }
    function unEnnemiEcoute() { return ennemisParlables().some(gardeBaissee); }

    var _cmdAttaque = Window_ActorCommand.prototype.addAttackCommand;
    Window_ActorCommand.prototype.addAttackCommand = function () {
        _cmdAttaque.call(this);
        if (this._actor && $gameParty.inBattle() && ennemisParlables().length) {
            this.addCommand(NOM, 'parler', unEnnemiEcoute());
        }
    };

    function Window_Parler() { this.initialize.apply(this, arguments); }
    Window_Parler.prototype = Object.create(Window_Command.prototype);
    Window_Parler.prototype.constructor = Window_Parler;
    Window_Parler.prototype.initialize = function (x, y, w) {
        this._largeur = w;
        Window_Command.prototype.initialize.call(this, x, y);
        this.openness = 255; this.hide(); this.deactivate();
    };
    Window_Parler.prototype.windowWidth = function () { return this._largeur || 480; };
    Window_Parler.prototype.maxCols = function () { return 2; };
    Window_Parler.prototype.numVisibleRows = function () { return 3; };
    Window_Parler.prototype.makeCommandList = function () {
        var or = $gameParty.gold();
        APPROCHES.forEach(function (a) {
            this.addCommand(a.nom, a.cle, a.cle !== 'offrir' || or >= PRIX_MIN);
        }, this);
    };
    Window_Parler.prototype.updateHelp = function () {
        var a = APPROCHES[this.index()];
        if (this._helpWindow && a) { this._helpWindow.setText(a.aide); }
    };
    window.Window_Parler = Window_Parler;

    var _creer = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function () {
        _creer.call(this);
        this._actorCommandWindow.setHandler('parler', this.commandeParler.bind(this));
    };
    var _fenetres = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function () {
        _fenetres.call(this);
        var ref = this._skillWindow;
        var w = new Window_Parler(ref ? ref.x : 0, ref ? ref.y : Graphics.boxHeight - 180, ref ? ref.width : Graphics.boxWidth);
        if (this._helpWindow) { w.setHelpWindow(this._helpWindow); }
        w.setHandler('ok', this.parlerApprocheOk.bind(this));
        w.setHandler('cancel', this.parlerAnnuler.bind(this));
        this._parlerWindow = w;
        this.addWindow(w);
    };
    Scene_Battle.prototype.commandeParler = function () {
        var w = this._parlerWindow;
        w.refresh(); w.select(0); w.show(); w.activate();
        if (this._helpWindow) { this._helpWindow.show(); }
    };
    Scene_Battle.prototype.parlerAnnuler = function () {
        this._parlerWindow.hide(); this._parlerWindow.deactivate();
        if (this._helpWindow) { this._helpWindow.hide(); }
        this._actorCommandWindow.activate();
    };
    Scene_Battle.prototype.parlerApprocheOk = function () {
        var cle = this._parlerWindow.currentSymbol(), act = BattleManager.inputtingAction();
        if (!act || !SKILL[cle]) { this.parlerAnnuler(); return; }
        act.setSkill(SKILL[cle]);
        // jamais deux fenêtres de saisie actives : la liste se cache et ne se réactive pas
        this._parlerWindow.deactivate(); this._parlerWindow.hide();
        this.selectEnemySelection();
    };
    // on ne parle qu'à qui a baissé sa garde
    var _enemyOk = Scene_Battle.prototype.onEnemyOk;
    Scene_Battle.prototype.onEnemyOk = function () {
        var act = BattleManager.inputtingAction();
        if (act && approcheDe(act.item())) {
            var e = this._enemyWindow.enemy();
            if (!e || !gardeBaissee(e)) {
                SoundManager.playBuzzer();
                if (e) { annonce(e, parlable(e) ? '🛡 Il ne baisse pas sa garde' : 'Il ne t\'écoutera pas', '#c0c0c0'); }
                this._enemyWindow.activate();
                return;
            }
        }
        _enemyOk.call(this);
    };
    var _enemyCancel = Scene_Battle.prototype.onEnemyCancel;
    Scene_Battle.prototype.onEnemyCancel = function () {
        var act = BattleManager.inputtingAction();
        if (act && approcheDe(act.item()) && this._actorCommandWindow.currentSymbol() === 'parler') {
            this._enemyWindow.hide(); this._enemyWindow.deactivate();
            this._parlerWindow.show(); this._parlerWindow.activate();
            if (this._helpWindow) { this._helpWindow.show(); }
            return;
        }
        _enemyCancel.call(this);
    };

    // --- ce que fait la parole ------------------------------------------------
    function etat(e) { return (e._parler = e._parler || { bon: 0, colere: 0 }); }
    function verifierGarde(e) {
        if (!e || !e.isEnemy || !e.isEnemy() || !parlable(e)) { return; }
        var g = gardeBaissee(e);
        if (g && !e._gardeAnnoncee) { annonce(e, '🕊 Il baisse sa garde', '#a8e6ff'); }
        e._gardeAnnoncee = g;
    }

    function parler(heros, e, cle) {
        var p = peuple(e), s = etat(e);
        if (!p || !gardeBaissee(e)) { annonce(e, '🛡 Il ne t\'écoute plus', '#c0c0c0'); return; }
        if (cle === 'offrir') {
            var prix = Math.max(PRIX_MIN, e.gold());
            if ($gameParty.gold() < prix) { annonce(heros, 'Pas assez d\'or (' + prix + ')', '#c0c0c0'); return; }
            $gameParty.loseGold(prix);
            annonce(heros, '🎁 −' + prix + ' ' + TextManager.currencyUnit, '#ffe08a');
        }
        var juste = p.approches.indexOf(cle) >= 0;
        if (juste && cle === 'impressionner' && !(e._parlerGrosCoup !== undefined && tour() - e._parlerGrosCoup <= 1)) {
            annonce(e, '⚔ Ça ne l\'impressionne pas', '#ff9a7a');
            juste = false;
        } else if (!juste) {
            annonce(e, '😠 Il refuse', '#ff7a7a');
        }
        if (!juste) {
            s.colere++;
            if (p.indice) { annonce(e, p.nom + ' : ' + p.indice, '#d8c8ff'); }
            return;
        }
        s.bon++;
        var n = besoin(e);
        if (s.bon < n) { annonce(e, '💬 Il t\'écoute · ' + s.bon + '/' + n, '#a8ffb0'); return; }
        apaiser(e, p);
    }

    function apaiser(e, p) {
        if (e.hpRate() <= SEUIL_FUITE) {
            annonce(e, '🏃 Il s\'enfuit', '#c0c0c0');
            e._parlerParti = 'fuite';
        } else {
            reputation(p.cle, 1);
            e._parlerParti = 'calme';
            var dons = (e.enemy().dropItems || []).filter(function (d) { return d.kind > 0 && d.dataId > 0; });
            var objet = null;
            if (dons.length && Math.random() < CADEAU) {
                var d = dons[Math.floor(Math.random() * dons.length)];
                objet = e.itemObject(d.kind, d.dataId);
            }
            if (objet) {
                e._parlerCadeau = objet;
                annonce(e, '🎁 Il te laisse : ' + objet.name, '#ffe08a');
            } else {
                annonce(e, '🕊 Il se calme et s\'en va', '#a8e6ff');
            }
        }
        e.escape();
    }

    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        var cle = approcheDe(this.item());
        if (cle && target && target.isEnemy() && this.subject().isActor()) {
            target.clearResult();
            target.result().used = true; target.result().success = true;
            parler(this.subject(), target, cle);
            return;
        }
        var avant = target && target.isEnemy && target.isEnemy() && gardeBaissee(target);
        _apply.call(this, target);
        if (target && target.isEnemy && target.isEnemy()) {
            // le frapper garde baissée « fonctionne, et se sait »
            if (SE_SAIT && avant && this.subject().isActor() && target.result().hpDamage > 0 && !target._parlerSeSait) {
                var p = peuple(target);
                target._parlerSeSait = true;
                if (p) { reputation(p.cle, -1); }
                ethique(-1);
                annonce(target, '⚠ Il avait baissé sa garde', '#ffb070');
            }
            if (avant) { target._gardeAnnoncee = true; }   // déjà baissée : pas de « 🕊 » après coup
            verifierGarde(target);
        }
    };

    // « Impressionner » : un gros coup d'un héros, ce tour ou le précédent
    var _hp = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        if (target && target.isEnemy() && this.subject().isActor() && value >= target.mhp * GROS) {
            target._parlerGrosCoup = tour();
        }
        _hp.call(this, target, value);
    };

    // un refus le met en colère : ses coups font plus mal
    var _degats = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _degats.call(this, target, critical);
        var s = this.subject();
        if (s && s.isEnemy() && s._parler && s._parler.colere && v > 0) { v = Math.round(v * (1 + COLERE * s._parler.colere)); }
        return v;
    };

    // l'expérience des épargnés (jamais leur or), et leurs cadeaux
    var _exp = Game_Troop.prototype.expTotal;
    Game_Troop.prototype.expTotal = function () {
        var v = _exp.call(this);
        this.members().forEach(function (e) { if (e._parlerParti === 'calme') { v += Math.round(e.exp() * EXP); } });
        return v;
    };
    var _butin = Game_Troop.prototype.makeDropItems;
    Game_Troop.prototype.makeDropItems = function () {
        var l = _butin.call(this);
        this.members().forEach(function (e) { if (e._parlerCadeau) { l.push(e._parlerCadeau); } });
        return l;
    };

    var _debutTour = BattleManager.startInput;
    BattleManager.startInput = function () {
        $gameTroop.members().forEach(verifierGarde);
        _debutTour.call(this);
    };

    window.Parler = {
        APPROCHES: APPROCHES, PEUPLES: PEUPLES,
        peuple: peuple, parlable: parlable, gardeBaissee: gardeBaissee, besoin: besoin,
        reputation: reputation, ethique: ethique, surChapitre1: surChapitre1,
        skillDe: function (cle) { return SKILL[cle]; }
    };
})();
