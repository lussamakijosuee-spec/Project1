//=============================================================================
// ChroniqueMonde.js — v1.0 · La colonne vertébrale d'un monde qui se souvient
// RPG Maker MV · by JOKO / Claude · charger APRÈS Corruption/Errance/Ame.
//  Le socle « Skyrim/Kenshi » : nations, factions, destins, journal, fins.
//=============================================================================
/*:
 * @plugindesc [v1.0] Le monde SE SOUVIENT : états des nations, réputations de
 * factions, destins des PNJ, journal des conséquences, et un registre de FINS
 * (dont des fins secrètes). La base pour des missions qui changent le monde.
 * @author JOKO / Claude
 *
 * @param menuCommand
 * @text Entrée menu « Chronique » (vide = aucune)
 * @type string
 * @default Chronique
 *
 * @param eveilCorr
 * @text Éveil — corruption atteinte
 * @type number
 * @default 100
 * @desc La fin secrète « l'Éveil » exige d'avoir touché ce fond de la Bête.
 *
 * @param eveilErr
 * @text Éveil — errance atteinte
 * @type number
 * @default 100
 * @desc …ce fond de l'Errant.
 *
 * @param eveilPhase
 * @text Éveil — phase mentale atteinte (≤)
 * @type number
 * @default 1
 * @desc …et ce fond du Dément (phase mentale descendue jusqu'à cette valeur).
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA CHRONIQUE DU MONDE — pour que « chaque mission change le monde » tienne
 * ═══════════════════════════════════════════════════════════════════════════
 *  Un jeu vaste (façon Skyrim / Kenshi) meurt sous les interrupteurs éparpillés.
 *  Ce plugin centralise l'ÉTAT DU MONDE en un seul endroit lisible, que tes
 *  missions modifient par des commandes simples — et que le jeu peut consulter
 *  pour débloquer des fins.
 *
 *  ▸ 4 registres, tout dans la sauvegarde :
 *      • RÉGIONS/NATIONS : un état (texte libre) + une valeur 0-100 (stabilité,
 *        allégeance, prospérité… à toi de décider ce qu'elle mesure).
 *      • FACTIONS : une réputation (nombre, +/-).
 *      • DESTINS DE PNJ : un mot-clé (vivant/mort/sauvé/exilé/trahi/roi…).
 *      • FLAGS : des clés=valeurs libres pour tout le reste.
 *    + un JOURNAL horodaté (« ce que tes actes ont changé »).
 *
 *  ▸ LES FINS : un registre. Tu débloques une fin quand ses conditions sont
 *    remplies (à toi de le décider dans tes events, via la commande). Les fins
 *    SECRÈTES restent « ??? » à l'écran tant qu'elles ne sont pas atteintes.
 *    ▪ « l'Éveil » est FOURNIE et AUTOMATIQUE : elle se débloque d'elle-même
 *      dès que le groupe a touché les trois fonds (Bête + Errant + Dément).
 *      C'est ta fin secrète cachée au bout des trois Chutes.
 *
 *  ── COMMANDES (identifiants en un seul mot : utilise des _underscores_) ──
 *    CHRONIQUE region <Nom> etat <Texte_d_etat> [valeur]
 *    CHRONIQUE region <Nom> valeur <+n|-n>
 *    CHRONIQUE faction <Nom> <+n|-n>
 *    CHRONIQUE pnj <Nom> <destin>
 *    CHRONIQUE flag <cle> <valeur>
 *    CHRONIQUE note <texte libre du journal…>
 *    CHRONIQUE fin <id> "<Titre affiché>"        débloque une fin
 *    CHRONIQUE fin <id> secrete "<Titre>"         fin secrète (??? avant)
 *    CHRONIQUE ecran                               ouvre l'état du monde
 *
 *  ── SCRIPT ──
 *    Chronique.region('Nom')   → { etat, valeur } | null
 *    Chronique.faction('Nom')  → nombre
 *    Chronique.pnj('Nom')      → destin | null
 *    Chronique.flag('cle')     → valeur | undefined
 *    Chronique.finDebloquee(id)→ bool
 *    Chronique.records()       → { corr, err, phase } (les fonds touchés)
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('ChroniqueMonde');
    var MENU = String(P['menuCommand'] || 'Chronique');
    var EV_CORR = parseInt(P['eveilCorr'] || 100);
    var EV_ERR = parseInt(P['eveilErr'] || 100);
    var EV_PHASE = parseInt(P['eveilPhase'] || 1);

    function store() {
        if (!$gameSystem) return {};
        if (!$gameSystem._chronique) $gameSystem._chronique = {
            regions: {}, factions: {}, pnj: {}, flags: {}, journal: [],
            fins: { eveil: { titre: 'l\'Éveil', secrete: true, ok: false } },
            records: { corr: 0, err: 0, phase: 5 }
        };
        return $gameSystem._chronique;
    }
    function horodatage() {
        try { return $gameSystem.playtimeText ? $gameSystem.playtimeText() : ''; } catch (e) { return ''; }
    }
    function noteJournal(txt) {
        var s = store();
        s.journal.push({ t: horodatage(), txt: txt });
        if (s.journal.length > 200) s.journal.shift();
    }

    //--- API --------------------------------------------------------------------
    var Chronique = {
        region: function (nom) { return store().regions[nom] || null; },
        faction: function (nom) { return store().factions[nom] || 0; },
        pnj: function (nom) { return store().pnj[nom] || null; },
        flag: function (cle) { return store().flags[cle]; },
        finDebloquee: function (id) { var f = store().fins[id]; return !!(f && f.ok); },
        records: function () { return store().records; },

        setRegionEtat: function (nom, etat, valeur) {
            var s = store(); var r = s.regions[nom] || { etat: '', valeur: 50 };
            r.etat = etat; if (valeur != null && valeur !== '') r.valeur = Math.max(0, Math.min(100, parseInt(valeur)));
            s.regions[nom] = r; noteJournal(nom + ' : ' + etat);
        },
        addRegionValeur: function (nom, delta) {
            var s = store(); var r = s.regions[nom] || { etat: '—', valeur: 50 };
            r.valeur = Math.max(0, Math.min(100, r.valeur + delta)); s.regions[nom] = r;
        },
        addFaction: function (nom, delta) {
            var s = store(); s.factions[nom] = (s.factions[nom] || 0) + delta;
            noteJournal((delta >= 0 ? '↑' : '↓') + ' ' + nom + ' (' + s.factions[nom] + ')');
        },
        setPnj: function (nom, destin) { var s = store(); s.pnj[nom] = destin; noteJournal(nom + ' — ' + destin); },
        setFlag: function (cle, val) { store().flags[cle] = val; },
        debloquerFin: function (id, titre, secrete) {
            var s = store(); var f = s.fins[id] || {};
            f.titre = titre || f.titre || id; if (secrete != null) f.secrete = !!secrete;
            if (!f.ok) { f.ok = true; noteJournal('✶ Fin dévoilée : ' + f.titre); }
            s.fins[id] = f;
        },
        declarerFin: function (id, titre, secrete) { // enregistre sans débloquer
            var s = store(); if (!s.fins[id]) s.fins[id] = { titre: titre || id, secrete: !!secrete, ok: false };
        }
    };
    window.Chronique = Chronique;

    //--- « l'Éveil » : fin secrète auto au bout des 3 Chutes (pré-déclarée dans store) --
    function corrN(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function errN(id)  { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }
    function majRecords() {
        var s = store(), r = s.records;
        ($gameParty ? $gameParty.members() : []).forEach(function (a) {
            var id = a.actorId();
            r.corr = Math.max(r.corr, corrN(id));
            r.err = Math.max(r.err, errN(id));
            r.phase = Math.min(r.phase, phase(id));
        });
        if (!Chronique.finDebloquee('eveil') && r.corr >= EV_CORR && r.err >= EV_ERR && r.phase <= EV_PHASE) {
            Chronique.debloquerFin('eveil', 'l\'Éveil', true);
        }
    }
    var _incSteps = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function () { _incSteps.call(this); if (this.steps() % 10 === 0) { try { majRecords(); } catch (e) {} } };
    var _endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (r) { try { majRecords(); } catch (e) {} _endBattle.call(this, r); };

    //--- Écran « État du Monde » ------------------------------------------------
    function couleurValeur(v) { return v >= 66 ? '#5CC98A' : v >= 33 ? '#EBC974' : '#F0928E'; }

    function Window_Chronique() { this.initialize.apply(this, arguments); }
    Window_Chronique.prototype = Object.create(Window_Base.prototype);
    Window_Chronique.prototype.constructor = Window_Chronique;
    Window_Chronique.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this._page = 0; this.refresh();
    };
    Window_Chronique.prototype.setPage = function (p) { this._page = (p + 3) % 3; this.refresh(); };
    Window_Chronique.prototype.refresh = function () {
        this.contents.clear();
        var W = this.contentsWidth(), s = store();
        var titres = ['Nations & Factions', 'Destins & Journal', 'Fins'];
        this.contents.fontSize = 22; this.changeTextColor('#EBC974');
        this.drawText('— L\'ÉTAT DU MONDE — ' + titres[this._page], 0, 0, W, 'center');
        this.contents.fontSize = 13; this.changeTextColor('#7E7688');
        this.drawText('← → pour changer de page · Échap pour fermer', 0, 28, W, 'center');
        this.resetFontSettings();
        var y = 64;
        if (this._page === 0) {
            this.section('NATIONS', 8, y); y += 34;
            var rk = Object.keys(s.regions);
            if (!rk.length) { this.vide(y); y += 30; }
            rk.slice(0, 8).forEach(function (nom) {
                var r = s.regions[nom]; this.ligneRegion(nom, r, 20, y); y += 30;
            }, this);
            y += 16; this.section('FACTIONS', 8, y); y += 34;
            var fk = Object.keys(s.factions);
            if (!fk.length) { this.vide(y); y += 30; }
            fk.slice(0, 6).forEach(function (nom) {
                var v = s.factions[nom];
                this.changeTextColor('#ECE6D8'); this.drawText(nom, 20, y, 260);
                this.changeTextColor(v >= 0 ? '#5CC98A' : '#F0928E');
                this.drawText((v >= 0 ? '+' : '') + v, 20, y, W - 40, 'right'); y += 30;
            }, this);
        } else if (this._page === 1) {
            this.section('DESTINS', 8, y); y += 34;
            var pk = Object.keys(s.pnj);
            if (!pk.length) { this.vide(y); y += 30; }
            pk.slice(0, 7).forEach(function (nom) {
                this.changeTextColor('#ECE6D8'); this.drawText(nom, 20, y, 260);
                this.changeTextColor('#B6AE9C'); this.drawText(s.pnj[nom], 300, y, W - 320); y += 30;
            }, this);
            y += 16; this.section('JOURNAL (récent)', 8, y); y += 34;
            var j = s.journal.slice(-6).reverse();
            if (!j.length) { this.vide(y); y += 30; }
            j.forEach(function (e) {
                this.changeTextColor('#7E7688'); this.contents.fontSize = 13;
                this.drawText(e.t, 20, y + 3, 90);
                this.changeTextColor('#C8C8B8'); this.contents.fontSize = 15;
                this.drawText(e.txt, 116, y, W - 136); y += 28;
            }, this);
            this.resetFontSettings();
        } else {
            this.section('LES FINS DÉVOILÉES', 8, y); y += 34;
            var keys = Object.keys(s.fins);
            var vues = keys.filter(function (k) { return s.fins[k].ok || !s.fins[k].secrete; });
            if (!vues.length) { this.vide(y); y += 30; }
            vues.forEach(function (k) {
                var f = s.fins[k];
                var nom = (f.secrete && !f.ok) ? '??? (fin secrète)' : f.titre;
                this.changeTextColor(f.ok ? '#EBC974' : '#7E7688');
                this.drawText((f.ok ? '✶ ' : '· ') + nom, 20, y, W - 40); y += 30;
            }, this);
            var secretesCachees = keys.filter(function (k) { return s.fins[k].secrete && !s.fins[k].ok; }).length;
            if (secretesCachees > 0) {
                y += 10; this.changeTextColor('#7E7688'); this.contents.fontSize = 14;
                this.drawText('Le monde garde encore ' + secretesCachees + ' secret(s)…', 20, y, W - 40);
                this.resetFontSettings();
            }
        }
    };
    Window_Chronique.prototype.section = function (t, x, y) { this.changeTextColor('#9CC0F5'); this.contents.fontSize = 17; this.drawText('▸ ' + t, x, y, this.contentsWidth() - 2 * x); this.resetFontSettings(); };
    Window_Chronique.prototype.vide = function (y) { this.changeTextColor('#5a5a66'); this.contents.fontSize = 14; this.drawText('(rien encore)', 30, y, 300); this.resetFontSettings(); };
    Window_Chronique.prototype.ligneRegion = function (nom, r, x, y) {
        var W = this.contentsWidth();
        this.changeTextColor('#ECE6D8'); this.drawText(nom, x, y, 200);
        this.changeTextColor('#B6AE9C'); this.contents.fontSize = 15; this.drawText(r.etat, x + 200, y, 240); this.resetFontSettings();
        var bx = W - 150, bw = 130;
        if (window.LoreCanon) LoreCanon.bar(this.contents, bx, y + 6, bw, 10, r.valeur / 100, couleurValeur(r.valeur));
        else { this.contents.fillRect(bx, y + 6, bw, 10, 'rgba(0,0,0,0.5)'); this.contents.fillRect(bx + 1, y + 7, Math.floor((bw - 2) * r.valeur / 100), 8, couleurValeur(r.valeur)); }
    };

    function Scene_Chronique() { this.initialize.apply(this, arguments); }
    Scene_Chronique.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Chronique.prototype.constructor = Scene_Chronique;
    Scene_Chronique.prototype.create = function () { Scene_MenuBase.prototype.create.call(this); this._w = new Window_Chronique(); this.addWindow(this._w); };
    Scene_Chronique.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('right') || Input.isTriggered('pagedown')) { SoundManager.playCursor(); this._w.setPage(this._w._page + 1); }
        else if (Input.isTriggered('left') || Input.isTriggered('pageup')) { SoundManager.playCursor(); this._w.setPage(this._w._page - 1); }
        else if (Input.isTriggered('cancel') || TouchInput.isCancelled()) { SoundManager.playCancel(); this.popScene(); }
    };
    window.Scene_Chronique = Scene_Chronique;

    //--- Commandes --------------------------------------------------------------
    function joinFrom(args, i) { return args.slice(i).join(' ').replace(/^"|"$/g, ''); }
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'CHRONIQUE') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'region') {
            var nom = args[1], act = (args[2] || '').toLowerCase();
            if (act === 'etat') Chronique.setRegionEtat(nom, joinFrom(args, 3).replace(/\s*\d+$/, '').replace(/_/g, ' '), (joinFrom(args, 3).match(/(\d+)$/) || [])[1]);
            else if (act === 'valeur') Chronique.addRegionValeur(nom, parseInt(args[3]) || 0);
        } else if (sub === 'faction') {
            Chronique.addFaction(args[1], parseInt(args[2]) || 0);
        } else if (sub === 'pnj') {
            Chronique.setPnj(args[1], joinFrom(args, 2).replace(/_/g, ' '));
        } else if (sub === 'flag') {
            Chronique.setFlag(args[1], args[2]);
        } else if (sub === 'note') {
            noteJournal(joinFrom(args, 1).replace(/_/g, ' '));
        } else if (sub === 'fin') {
            var id = args[1];
            if ((args[2] || '').toLowerCase() === 'secrete') Chronique.debloquerFin(id, joinFrom(args, 3).replace(/_/g, ' '), true);
            else Chronique.debloquerFin(id, joinFrom(args, 2).replace(/_/g, ' '), false);
        } else if (sub === 'ecran' || sub === 'écran') {
            SceneManager.push(Scene_Chronique);
        }
    };

    if (MENU) {
        var _add = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () { _add.call(this); this.addCommand(MENU, 'chroniqueMonde', true); };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () { _cw.call(this); this._commandWindow.setHandler('chroniqueMonde', function () { SceneManager.push(Scene_Chronique); }); };
    }
})();
