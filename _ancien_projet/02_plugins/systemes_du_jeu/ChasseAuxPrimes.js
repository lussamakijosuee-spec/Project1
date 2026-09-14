//=============================================================================
// ChasseAuxPrimes.js — v1.0  ·  Le Tableau de Chasse
// RPG Maker MV   ·   by JOKO
//   À charger avec les autres systèmes de menu, avant SafetyNet.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Un tableau de chasse : le joueur choisit une famille du
 * bestiaire et un rang, et va chercher le combat lui-même. Rend les 270 troupes
 * et les 41 boss atteignables sans toucher au level design des cartes.
 * @author JOKO
 *
 * @param commandeMenu
 * @text Nom de la commande dans le menu
 * @type string
 * @default LE TABLEAU DE CHASSE
 *
 * @param dansLeMenu
 * @text Ajouter la commande au menu principal ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param interrupteurAcces
 * @text Interrupteur d'accès (0 = toujours ouvert)
 * @type switch
 * @default 0
 * @desc Tant que cet interrupteur est OFF, le tableau reste fermé. 0 = pas de condition.
 *
 * @param niveauxConseilles
 * @text Niveaux conseillés par rang
 * @type string
 * @default D:1,C:12,B:28,A:45,S:60
 * @desc Purement indicatif : rien n'est interdit, le joueur décide.
 *
 * @param primeParRang
 * @text Prime versée par rang (or)
 * @type string
 * @default D:80,C:400,B:1600,A:5000,S:14000
 *
 * @param primeBoss
 * @text Prime versée pour un boss (or)
 * @type number
 * @min 0
 * @default 40000
 *
 * @param bonusPremiere
 * @text Multiplicateur pour la PREMIÈRE victoire sur une entrée
 * @type number
 * @decimals 1
 * @default 3.0
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE TABLEAU DE CHASSE
 * ═══════════════════════════════════════════════════════════════════════════
 *  Le bestiaire compte 401 ennemis répartis en 18 familles, et 311 troupes
 *  ont été créées pour les faire vivre. Le problème : ce jeu n'utilise pas de
 *  rencontres aléatoires — les combats sont posés à la main sur les cartes,
 *  avec des mobs visibles (ChaseEnemies). Placer 270 troupes de force sur tes
 *  cartes aurait été décider du level design à ta place.
 *
 *  Ce plugin fait autrement : il donne au joueur un ENDROIT où aller chercher
 *  le combat. Un tableau de chasse, comme une guilde de chasseurs.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  CE QUE LE JOUEUR Y TROUVE
 *  ─────────────────────────────────────────────────────────────────────────
 *   ▶ LES FAMILLES — les 18 familles du bestiaire. On en choisit une, puis un
 *     rang (D à S), puis une formation (patrouille de 2, groupe de 3, nuée de
 *     4). Le combat démarre sur place.
 *   ▶ LES PRIMES — chaque victoire paie. La PREMIÈRE victoire sur une entrée
 *     paie le triple : on est récompensé pour explorer le bestiaire, pas pour
 *     farmer la même ligne.
 *   ▶ LES CONTRATS DE BOSS — les 41 boss, listés à part. Ils ne se débloquent
 *     qu'une fois la famille correspondante nettoyée à son rang le plus haut.
 *   ▶ LE SUIVI — le tableau se souvient de ce qui a été battu, et affiche la
 *     progression famille par famille.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  RIEN N'EST IMPOSÉ
 *  ─────────────────────────────────────────────────────────────────────────
 *  Les niveaux affichés sont CONSEILLÉS, jamais bloquants : si le joueur veut
 *  aller chercher du rang S au niveau 12, c'est son droit et son problème.
 *  Le tableau prévient, il n'interdit pas.
 *
 *  Aucune carte n'est modifiée. Aucun événement n'est posé. Si tu préfères
 *  plus tard placer ces troupes toi-même sur tes cartes, ce plugin ne te gêne
 *  en rien : désactive-le, tout le reste continue de fonctionner.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  COMMANDES DE PLUGIN
 *  ─────────────────────────────────────────────────────────────────────────
 *    PRIMES ouvrir          → ouvre le tableau de chasse
 *    PRIMES debloquer boss  → débloque tous les contrats de boss
 *    PRIMES etat            → résumé de la progression dans un message
 *
 *  SCRIPT :  window.Primes.familles()        → la liste des familles
 *            window.Primes.progression(fam)  → {battus, total}
 *            window.Primes.bossDispo()       → les contrats de boss ouverts
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('ChasseAuxPrimes');
    var CMD_MENU = String(P['commandeMenu'] || 'LE TABLEAU DE CHASSE');
    var DANS_MENU = String(P['dansLeMenu'] || 'true') === 'true';
    var SW_ACCES = parseInt(P['interrupteurAcces'] || 0);
    var BONUS_1RE = parseFloat(P['bonusPremiere'] || 3.0);
    var PRIME_BOSS = parseInt(P['primeBoss'] || 40000);

    function tableParam(txt, defaut) {
        var t = {};
        String(txt || defaut).split(',').forEach(function (p) {
            var kv = p.split(':');
            if (kv.length === 2) t[kv[0].trim()] = parseInt(kv[1]);
        });
        return t;
    }
    var NIVEAUX = tableParam(P['niveauxConseilles'], 'D:1,C:12,B:28,A:45,S:60');
    var PRIMES = tableParam(P['primeParRang'], 'D:80,C:400,B:1600,A:5000,S:14000');
    var RANGS = ['D', 'C', 'B', 'A', 'S'];

    //=========================================================================
    // LECTURE DU BESTIAIRE — rien n'est codé en dur, tout est lu dans la base
    //=========================================================================
    var _cache = null;
    function bestiaire() {
        if (_cache) return _cache;
        var fam = {}, boss = [];
        for (var i = 1; i < $dataTroops.length; i++) {
            var t = $dataTroops[i];
            if (!t || !t.name) continue;
            // troupes de bestiaire :  « <Famille> — <formation> (<Rang>) »
            var m = t.name.match(/^(.+?)\s+—\s+(.+?)\s+\(([DCBAS])\)$/);
            if (m) {
                var f = m[1];
                if (!fam[f]) fam[f] = {};
                if (!fam[f][m[3]]) fam[f][m[3]] = [];
                fam[f][m[3]].push({ id: i, nom: m[2], rang: m[3] });
                continue;
            }
            // contrats de boss :  « ◈ <nom> »
            if (t.name.charAt(0) === '◈' && t.members && t.members.length) {
                var e = $dataEnemies[t.members[0].enemyId];
                boss.push({ id: i, nom: t.name.slice(1).trim(),
                            famille: (e && e.meta && e.meta['Famille']) || '',
                            ennemi: e ? e.name : '' });
            }
        }
        _cache = { familles: fam, boss: boss };
        return _cache;
    }

    //=========================================================================
    // MÉMOIRE
    //=========================================================================
    function memoire() {
        if (!$gameSystem) return null;
        if (!$gameSystem._primes) $gameSystem._primes = { battus: {}, bossOuverts: false, gagne: 0 };
        return $gameSystem._primes;
    }
    function estBattu(troopId) { var m = memoire(); return !!(m && m.battus[troopId]); }
    function marquer(troopId) { var m = memoire(); if (m) m.battus[troopId] = true; }

    function progression(fam) {
        var b = bestiaire().familles[fam] || {}, total = 0, battus = 0;
        RANGS.forEach(function (r) {
            (b[r] || []).forEach(function (e) { total++; if (estBattu(e.id)) battus++; });
        });
        return { battus: battus, total: total };
    }
    /** Un contrat de boss s'ouvre quand la famille est nettoyée au rang S. */
    function bossOuvert(bo) {
        var m = memoire();
        if (m && m.bossOuverts) return true;
        var b = bestiaire().familles[bo.famille];
        if (!b || !b.S) return false;
        return b.S.every(function (e) { return estBattu(e.id); });
    }

    window.Primes = {
        familles: function () { return Object.keys(bestiaire().familles).sort(); },
        progression: progression,
        bossDispo: function () { return bestiaire().boss.filter(bossOuvert); },
        ouvrir: function () { SceneManager.push(Scene_Primes); }
    };

    //=========================================================================
    // LE COMBAT ET LA PRIME
    //=========================================================================
    var _enCours = null;
    function lancer(entree, estBoss) {
        if (!entree || !$dataTroops[entree.id]) return;
        // on ne part pas au combat avec une équipe à terre
        if (!$gameParty.members().length || $gameParty.isAllDead()) {
            SoundManager.playBuzzer();
            return;
        }
        _enCours = { troop: entree.id, rang: entree.rang, boss: !!estBoss,
                     premiere: !estBattu(entree.id) };
        try {
            BattleManager.setup(entree.id, true, false);
            BattleManager.setEventCallback(function () { });
            $gamePlayer.makeEncounterCount();
            SceneManager.push(Scene_Battle);
        } catch (e) {
            _enCours = null;
            SoundManager.playBuzzer();
        }
    }
    var _processVictory = BattleManager.processVictory;
    BattleManager.processVictory = function () {
        try {
            if (_enCours) {
                var base = _enCours.boss ? PRIME_BOSS : (PRIMES[_enCours.rang] || 100);
                var prime = Math.floor(base * (_enCours.premiere ? BONUS_1RE : 1));
                marquer(_enCours.troop);
                var m = memoire(); if (m) m.gagne += prime;
                $gameParty.gainGold(prime);
                $gameMessage.add('\\C[14]✦ Prime versée : ' + prime + ' or'
                    + (_enCours.premiere ? '  \\C[6](première victoire — triplée)' : '') + '\\C[0]');
                _enCours = null;
            }
        } catch (e) { _enCours = null; }
        _processVictory.call(this);
    };
    var _processDefeat = BattleManager.processDefeat;
    BattleManager.processDefeat = function () { _enCours = null; _processDefeat.call(this); };

    //=========================================================================
    // L'ÉCRAN
    //=========================================================================
    function Scene_Primes() { this.initialize.apply(this, arguments); }
    Scene_Primes.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Primes.prototype.constructor = Scene_Primes;
    Scene_Primes.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._niveau = 'familles';   // familles → rangs → formations
        this._famille = null; this._rang = null;
        this._aide = new Window_Base(0, 0, Graphics.boxWidth, this.fittingH(2));
        this.addWindow(this._aide);
        this._liste = new Window_PrimesListe(0, this._aide.height,
            Graphics.boxWidth, Graphics.boxHeight - this._aide.height);
        this._liste.setHandler('ok', this.onOk.bind(this));
        this._liste.setHandler('cancel', this.onCancel.bind(this));
        this.addWindow(this._liste);
        this.rafraichir();
    };
    Scene_Primes.prototype.fittingH = function (n) {
        return n * 36 + 36;
    };
    // au retour d'un combat, le tableau doit montrer le contrat qu'on vient de remplir
    Scene_Primes.prototype.start = function () {
        Scene_MenuBase.prototype.start.call(this);
        if (this._liste) this.rafraichir();
    };
    Scene_Primes.prototype.rafraichir = function () {
        var m = memoire();
        this._aide.contents.clear();
        this._aide.changeTextColor(this._aide.textColor(14));
        this._aide.drawText('LE TABLEAU DE CHASSE', 8, 0, 400);
        this._aide.resetTextColor();
        this._aide.drawText('Primes gagnées : ' + (m ? m.gagne : 0) + ' or', 420, 0, 340, 'right');
        var s = { familles: 'Choisis une famille à chasser.',
                  rangs: this._famille + ' — choisis un rang. Le niveau conseillé est indicatif.',
                  formations: this._famille + ' rang ' + this._rang + ' — choisis une formation.' }[this._niveau];
        this._aide.changeTextColor(this._aide.textColor(8));
        this._aide.drawText(s, 8, 36, Graphics.boxWidth - 16);
        this._aide.resetTextColor();
        this._liste.dresser(this._niveau, this._famille, this._rang);
        this._liste.activate();
        this._liste.select(0);
    };
    Scene_Primes.prototype.onOk = function () {
        var e = this._liste.item();
        if (!e) { this._liste.activate(); return; }
        if (this._niveau === 'familles') {
            if (e.boss) { lancer(e.entree, true); return; }
            this._famille = e.cle; this._niveau = 'rangs';
        } else if (this._niveau === 'rangs') {
            this._rang = e.cle; this._niveau = 'formations';
        } else {
            lancer(e.entree, false); return;
        }
        this.rafraichir();
    };
    Scene_Primes.prototype.onCancel = function () {
        if (this._niveau === 'formations') { this._niveau = 'rangs'; this.rafraichir(); }
        else if (this._niveau === 'rangs') { this._niveau = 'familles'; this.rafraichir(); }
        else this.popScene();
    };

    function Window_PrimesListe() { this.initialize.apply(this, arguments); }
    Window_PrimesListe.prototype = Object.create(Window_Selectable.prototype);
    Window_PrimesListe.prototype.constructor = Window_PrimesListe;
    Window_PrimesListe.prototype.initialize = function (x, y, w, h) {
        // AVANT l'initialisation parente : MOG_Scrollbar, MOG_CursorBorder et
        // YEP_X_BattleSysCTB surchargent select(), qui est appelé pendant cette
        // initialisation. maxItems() serait interrogé sur un _data inexistant.
        this._data = [];
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
    };
    Window_PrimesListe.prototype.maxItems = function () {
        return this._data ? this._data.length : 0;
    };
    Window_PrimesListe.prototype.item = function () {
        return this._data ? this._data[this.index()] : null;
    };
    Window_PrimesListe.prototype.dresser = function (niveau, famille, rang) {
        var b = bestiaire(), d = [];
        if (niveau === 'familles') {
            Object.keys(b.familles).sort().forEach(function (f) {
                var p = progression(f);
                d.push({ cle: f, texte: f, sous: p.battus + ' / ' + p.total + ' contrats remplis',
                         fini: p.battus >= p.total });
            });
            b.boss.forEach(function (bo) {
                var ok = bossOuvert(bo);
                d.push({ cle: bo.nom, texte: '◈ ' + bo.nom, boss: true, entree: bo, verrou: !ok,
                         sous: ok ? 'contrat ouvert' : 'nettoie ' + bo.famille + ' au rang S pour l\'ouvrir' });
            });
        } else if (niveau === 'rangs') {
            var fam = b.familles[famille] || {};
            RANGS.forEach(function (r) {
                if (!fam[r]) return;
                var n = fam[r].filter(function (e) { return estBattu(e.id); }).length;
                d.push({ cle: r, texte: 'Rang ' + r,
                         sous: 'niveau conseillé ' + (NIVEAUX[r] || '?') + '  ·  prime ' +
                               (PRIMES[r] || '?') + ' or  ·  ' + n + '/' + fam[r].length + ' faits' });
            });
        } else {
            var f2 = b.familles[famille] || {};
            (f2[rang] || []).forEach(function (e) {
                d.push({ cle: e.nom, texte: e.nom, entree: e,
                         sous: estBattu(e.id) ? 'déjà remporté' : 'jamais tenté — prime triplée' });
            });
        }
        this._data = d;
        this.refresh();
    };
    Window_PrimesListe.prototype.isCurrentItemEnabled = function () {
        var e = this.item();
        return !!e && !e.verrou;
    };
    Window_PrimesListe.prototype.drawItem = function (index) {
        var e = this._data[index], r = this.itemRectForText(index);
        if (!e) return;
        this.changePaintOpacity(!e.verrou);
        this.changeTextColor(this.textColor(e.verrou ? 7 : (e.fini ? 24 : (e.boss ? 2 : 0))));
        this.drawText(e.texte, r.x, r.y, r.width * 0.45);
        this.changeTextColor(this.textColor(8));
        this.drawText(e.sous, r.x + r.width * 0.45, r.y, r.width * 0.55);
        this.resetTextColor();
        this.changePaintOpacity(true);
    };
    window.Scene_Primes = Scene_Primes;

    //=========================================================================
    // ENTRÉE DANS LE MENU
    //=========================================================================
    if (DANS_MENU) {
        var _addOriginal = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            _addOriginal.call(this);
            var ouvert = SW_ACCES === 0 || $gameSwitches.value(SW_ACCES);
            this.addCommand(CMD_MENU, 'primes', ouvert);
        };
        var _createCommand = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _createCommand.call(this);
            this._commandWindow.setHandler('primes', function () {
                SceneManager.push(Scene_Primes);
            });
        };
    }

    //=========================================================================
    // COMMANDES DE PLUGIN
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'PRIMES') return;
        var sous = (args[0] || '').toLowerCase();
        if (sous === 'ouvrir') SceneManager.push(Scene_Primes);
        else if (sous === 'debloquer') { var m = memoire(); if (m) m.bossOuverts = true; }
        else if (sous === 'etat') {
            var t = 0, f = 0;
            window.Primes.familles().forEach(function (n) {
                var p = progression(n); t += p.total; f += p.battus;
            });
            $gameMessage.add('Tableau de chasse : ' + f + ' / ' + t + ' contrats remplis.');
            $gameMessage.add('Contrats de boss ouverts : ' + window.Primes.bossDispo().length + '.');
        }
    };
})();
