//=============================================================================
// PactesAldebaran.js — v1.0 · Le pacte avec la Reine Oubliée
// RPG Maker MV · by JOKO / Claude · charger APRÈS Errance, CorruptionAme,
//  JadeEntitePlunging, LoreCanon. Additif, aucun conflit.
//=============================================================================
/*:
 * @plugindesc [v1.0] Prie la Reine Oubliée à ses sanctuaires : un pouvoir
 * démesuré contre un prix terrible (une vérité qui t'errance, ta raison, ou un
 * Oubli). Jamais sans consentement. Elle ne ment jamais.
 * @author JOKO / Claude
 *
 * @param soulVar
 * @text Variable du stock d'âmes
 * @type variable
 * @default 15
 *
 * @param donAmes
 * @text Âmes offertes (bénédiction)
 * @type number
 * @default 40
 * @desc Âmes données par « Les Âmes offertes ». Monte avec les pactes déjà faits.
 *
 * @param oubliSwitch
 * @text Interrupteur — un Oubli a été payé
 * @type switch
 * @default 0
 * @desc Mis à ON quand tu paies un Oubli. Câble-le pour effacer un PNJ / fermer du contenu.
 *
 * @param oubliVar
 * @text Variable — nombre d'Oublis payés
 * @type variable
 * @default 0
 * @desc (option) Incrémentée à chaque Oubli, pour piloter QUEL proche t'oublie.
 *
 * @param menuPactes
 * @text Entrée menu « Pactes » (vide = aucune)
 * @type string
 * @default
 * @desc Un écran listant les pactes scellés. Vide = pas d'entrée menu.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES PACTES D'ALDÉBARAN — la Déesse blanche, reine des étoiles noires
 * ═══════════════════════════════════════════════════════════════════════════
 *  À ses rares sanctuaires, la Reine Oubliée peut BÉNIR : accorder une
 *  puissance bien au-delà de ce qu'une marque permet. Mais :
 *    • jamais sans CONSENTEMENT — c'est sa seule loi (tu peux toujours refuser) ;
 *    • toujours un PRIX — et il est TOUJOURS dit d'avance, car elle ne ment
 *      jamais. Une vérité qu'on aurait préféré ne pas connaître.
 *
 *  ▶ OUVRIR UN SANCTUAIRE — dans un événement (autel, statue…) :
 *      PACTE
 *    Une scène s'ouvre : trois offres et le prix de chacune, plus « Refuser ».
 *
 *  ▶ LES OFFRES (le prix monte avec le nombre de pactes déjà scellés) :
 *    ① La Bénédiction — +stats PERMANENTES à tout le groupe (bénédiction
 *        d'Aldébaran, cumulable). PRIX : une vérité — l'Errance de tous monte.
 *    ② Les Âmes offertes — un afflux d'âmes (var stock). PRIX : ta raison —
 *        la santé mentale du chef baisse (un pas vers le Dément).
 *    ③ L'Allègement — efface COMPLÈTEMENT ta pire Chute (Corruption ou
 *        Errance du chef). PRIX : un OUBLI — un proche t'oubliera à jamais.
 *
 *  ▶ ELLE SE SOUVIENT — plus tu contractes, plus elle te connaît… et plus le
 *    prix enfle. Au-delà d'un certain nombre de pactes, elle te parle d'un
 *    endroit que tu croyais secret. (couche méta : les Reprises.)
 *
 *  COMMANDES :
 *      PACTE                    ouvre le sanctuaire (scène de pacte)
 *      PACTE oubli              force un Oubli (mise en scène scénarisée)
 *  SCRIPT :
 *      Pactes.nombre()          → nombre de pactes scellés
 *      Pactes.beni(actorId)     → niveau de bénédiction d'un héros
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('PactesAldebaran');
    var SOUL_VAR = parseInt(P['soulVar'] || 15);
    var DON_AMES = parseInt(P['donAmes'] || 40);
    var OUBLI_SW = parseInt(P['oubliSwitch'] || 0);
    var OUBLI_VAR = parseInt(P['oubliVar'] || 0);
    var MENU = String(P['menuPactes'] || '');

    var BLANC = '#e9e9f2', OR = '#d9c67a', BLEU = '#7f8cff', VIOLET = '#b07cff', ROUGE = '#d0642a';

    //--- État persistant --------------------------------------------------------
    function sys() { return $gameSystem || {}; }
    function nombre() { return (sys()._pactes || 0); }
    function beniStore() { if (!$gameSystem._beniAldebaran) $gameSystem._beniAldebaran = {}; return $gameSystem._beniAldebaran; }
    function beni(id) { return beniStore()[id] || 0; }

    var Pactes = { nombre: nombre, beni: beni };
    window.Pactes = Pactes;

    //--- Bénédiction : +stats permanentes (comme les Liens, sans dépendance) ----
    var _paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function (paramId) {
        var v = _paramPlus.call(this, paramId);
        var n = beni(this.actorId());
        if (n > 0) v += Math.floor(this.paramBase(paramId) * 0.08 * n); // +8 % du base par palier
        return v;
    };

    //--- Vérités-poison (le prix qu'on préfère ne pas connaître) -----------------
    var VERITES = [
        'Celui que tu pleures ne s\'est pas noyé. Il a sauté.',
        'La marque que tu portes n\'était pas la tienne au départ.',
        'On t\'a menti sur qui a donné le premier ordre. Ce n\'était pas l\'ennemi.',
        'Ta plus belle victoire, un autre l\'a payée de son nom.',
        'Le Premier n\'est pas parti. Il regarde. Il a toujours regardé.',
        'Aucun de tes choix, jusqu\'ici, n\'était le premier que tu faisais.'
    ];
    var VERITES_META = [
        'Tu es déjà venu ici. Plusieurs fois. Tu ne t\'en souviens pas — moi si.',
        'Quelqu\'un, ailleurs, décide de te faire recommencer. Tu l\'appelles la chance.',
        'Quand tu meurs, ce n\'est pas toi qui reviens. C\'est la main qui te rejoue.'
    ];
    function veriteDuJour() {
        if (nombre() >= 3 && Math.random() < 0.5) return VERITES_META[Math.floor(Math.random() * VERITES_META.length)];
        return VERITES[nombre() % VERITES.length];
    }

    //--- Prix chiffrés (montent avec le nombre de pactes) -----------------------
    function prixErrance() { return 8 + nombre() * 4; }        // +errance à tous
    function prixRaison()  { return 2 + Math.floor(nombre() / 2); } // -santé mentale du chef
    function donAmesActuel() { return DON_AMES + nombre() * 20; }

    //--- Application des offres --------------------------------------------------
    function leader() { return $gameParty && $gameParty.leader(); }

    function pireChute(id) {
        var c = 0, e = 0;
        try { c = window.Corruption ? Corruption.niveau(id) : 0; } catch (x) {}
        try { e = window.Errance ? Errance.niveau(id) : 0; } catch (x) {}
        if (c <= 0 && e <= 0) return null;
        return c >= e ? 'corruption' : 'errance';
    }

    function offreBenediction() {
        $gameParty.members().forEach(function (a) { beniStore()[a.actorId()] = beni(a.actorId()) + 1; a.refresh(); });
        var v = prixErrance();
        if (window.Errance) $gameParty.members().forEach(function (a) { Errance.add(a.actorId(), v); });
        $gameSystem._pactes = nombre() + 1;
        return {
            don: 'La lumière entre en vous. Vos gestes portent plus loin qu\'une marque ne le permet.',
            prix: '« ' + veriteDuJour() + ' »',
            note: 'La vérité tourne dans vos têtes. (Errance +' + v + ' à tous.)'
        };
    }
    function offreAmes() {
        var don = donAmesActuel();
        if ($gameVariables) $gameVariables.setValue(SOUL_VAR, ($gameVariables.value(SOUL_VAR) || 0) + don);
        var l = leader(); var perte = prixRaison();
        if (l && window.Ame) Ame.mauvais(l.actorId(), perte);
        $gameSystem._pactes = nombre() + 1;
        return {
            don: don + ' âmes affluent vers vous, comme attirées par le fond.',
            prix: '« ' + veriteDuJour() + ' »',
            note: (l ? l.name() : 'Le chef') + ' l\'entend, et quelque chose cède. (Santé mentale −' + perte + '.)'
        };
    }
    function offreAllegement() {
        var l = leader(); if (!l) return { don: '', prix: '', note: '' };
        var id = l.actorId(), quelle = pireChute(id);
        if (!quelle) {
            return { don: 'Rien ne pèse sur ' + l.name() + '. La Reine n\'a rien à alléger.', prix: '', note: '', refuseAuto: true };
        }
        var nom;
        if (quelle === 'corruption') { try { Corruption.purge(id, 100); } catch (x) {} nom = 'le sang de bête'; }
        else { try { Errance.purge(id, 100); } catch (x) {} nom = 'l\'Errance'; }
        if (OUBLI_SW > 0) $gameSwitches.setValue(OUBLI_SW, true);
        if (OUBLI_VAR > 0) $gameVariables.setValue(OUBLI_VAR, ($gameVariables.value(OUBLI_VAR) || 0) + 1);
        $gameSystem._pactes = nombre() + 1;
        $gameSystem._oublisPayes = (sys()._oublisPayes || 0) + 1;
        return {
            don: nom + ' quitte ' + l.name() + '. Entièrement. Comme si rien n\'avait jamais coulé là.',
            prix: 'Un OUBLI. Un être qui vous aime cessera de vous avoir connu.',
            note: 'Quelque part, un visage vient d\'oublier le vôtre. Vous ne saurez jamais lequel — pas tout de suite.'
        };
    }

    //=========================================================================
    // Scène du pacte
    //=========================================================================
    function Window_PacteList() { this.initialize.apply(this, arguments); }
    Window_PacteList.prototype = Object.create(Window_Command.prototype);
    Window_PacteList.prototype.constructor = Window_PacteList;
    Window_PacteList.prototype.initialize = function () {
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.y = Graphics.boxHeight - this.height;
    };
    Window_PacteList.prototype.windowWidth = function () { return 360; };
    Window_PacteList.prototype.numVisibleRows = function () { return 4; };
    Window_PacteList.prototype.makeCommandList = function () {
        this.addCommand('① La Bénédiction', 'beni');
        this.addCommand('② Les Âmes offertes', 'ames');
        this.addCommand('③ L\'Allègement', 'allege');
        this.addCommand('Refuser, et partir', 'refuser');
    };

    function Window_PacteInfo() { this.initialize.apply(this, arguments); }
    Window_PacteInfo.prototype = Object.create(Window_Base.prototype);
    Window_PacteInfo.prototype.constructor = Window_PacteInfo;
    Window_PacteInfo.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight - 4 * 36 - 36);
        this.opacity = 160; this._sel = 'beni'; this.refresh();
    };
    Window_PacteInfo.prototype.setSel = function (s) { if (this._sel !== s) { this._sel = s; this.refresh(); } };
    Window_PacteInfo.prototype.refresh = function () {
        this.contents.clear();
        var W = this.contentsWidth();
        this.changeTextColor(BLANC);
        this.drawText('LA REINE OUBLIÉE vous écoute.', 0, 0, W, 'center');
        this.changeTextColor('#8d8d9c');
        this.drawText('Pactes scellés : ' + nombre() + '  ·  elle ne ment jamais, et il y a toujours un prix.', 0, 34, W, 'center');
        this.resetTextColor();
        var y = 92, x = 24;
        function ligne(self, col, titre, corps, prix) {
            self.changeTextColor(col); self.drawText(titre, x, y, W - 2 * x); y += 32;
            self.changeTextColor('#c8c8d4'); self.drawTextEx('\\}' + corps + '\\{', x + 8, y); y += 30;
            self.changeTextColor(ROUGE); self.drawTextEx('\\}Prix : ' + prix + '\\{', x + 8, y); y += 40;
        }
        var l = leader(), pc = l ? pireChute(l.actorId()) : null;
        if (this._sel === 'beni')
            ligne(this, OR, 'La Bénédiction', 'Une puissance au-delà de ta marque : +stats permanentes à tout le groupe.', 'une vérité que tu aurais préféré ignorer (Errance +' + prixErrance() + ' à tous).');
        else if (this._sel === 'ames')
            ligne(this, BLEU, 'Les Âmes offertes', donAmesActuel() + ' âmes affluent vers toi.', 'ta raison — santé mentale du chef −' + prixRaison() + ' (un pas vers le Dément).');
        else if (this._sel === 'allege')
            ligne(this, VIOLET, 'L\'Allègement', pc ? ('efface entièrement ta pire Chute (' + (pc === 'corruption' ? 'le sang de bête' : 'l\'Errance') + ' du chef).') : 'rien ne pèse sur toi ; elle n\'a rien à alléger.', pc ? 'un OUBLI : un proche cessera de t\'avoir connu.' : '—');
        else {
            this.changeTextColor('#c8c8d4');
            this.drawTextEx('\\}Tu peux toujours partir. C\'est sa seule loi : jamais sans ton accord.\\{', x + 8, y);
        }
    };

    function Scene_Pacte() { this.initialize.apply(this, arguments); }
    Scene_Pacte.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Pacte.prototype.constructor = Scene_Pacte;
    Scene_Pacte.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._info = new Window_PacteInfo();
        this.addWindow(this._info);
        this._list = new Window_PacteList();
        this._list.setHandler('beni', this.choisir.bind(this, 'beni'));
        this._list.setHandler('ames', this.choisir.bind(this, 'ames'));
        this._list.setHandler('allege', this.choisir.bind(this, 'allege'));
        this._list.setHandler('refuser', this.refuser.bind(this));
        this._list.setHandler('cancel', this.refuser.bind(this));
        this.addWindow(this._list);
        this._resultat = null; this._attente = 0;
    };
    Scene_Pacte.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (this._list && this._list.active) this._info.setSel(this._list.currentSymbol());
        if (this._resultat && (Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isTriggered()) && this._attente > 12) this.popScene();
        if (this._resultat) this._attente++;
    };
    Scene_Pacte.prototype.choisir = function (type) {
        var res;
        if (type === 'beni') res = offreBenediction();
        else if (type === 'ames') res = offreAmes();
        else res = offreAllegement();
        if (res.refuseAuto) { this.refuser(res.don); return; }
        this.sceller(res);
    };
    Scene_Pacte.prototype.sceller = function (res) {
        try { AudioManager.playSe({ name: 'Saint5', pitch: 90, volume: 80, pan: 0 }); } catch (e) {}
        this._list.deactivate(); this._list.hide();
        this._resultat = res; this._attente = 0;
        var w = this._info; w.contents.clear();
        var W = w.contentsWidth();
        w.changeTextColor(BLANC); w.drawText('LE PACTE EST SCELLÉ.', 0, 0, W, 'center');
        w.changeTextColor('#c8c8d4'); w.drawTextEx('\\}' + res.don + '\\{', 16, 56);
        w.changeTextColor(ROUGE); w.drawText('— et le prix —', 0, 132, W, 'center');
        w.changeTextColor('#e0e0ea'); w.drawTextEx('\\}' + res.prix + '\\{', 16, 168);
        w.changeTextColor('#8d8d9c'); w.drawTextEx('\\}' + res.note + '\\{', 16, 236);
        w.changeTextColor(VIOLET); w.drawText('« Tu l\'as voulu. Je n\'ai fait que dire vrai. »', 0, 300, W, 'center');
        $gameScreen.startFlash([230, 230, 255, 120], 45);
    };
    Scene_Pacte.prototype.refuser = function (msg) {
        try { AudioManager.playSe({ name: 'Cancel2', pitch: 100, volume: 60, pan: 0 }); } catch (e) {}
        this._list.deactivate(); this._list.hide();
        this._resultat = { refuse: true }; this._attente = 0;
        var w = this._info; w.contents.clear();
        var W = w.contentsWidth();
        w.changeTextColor(BLANC);
        w.drawText(typeof msg === 'string' && msg ? msg : 'Vous détournez le regard.', 0, 60, W, 'center');
        w.changeTextColor('#8d8d9c');
        w.drawText('« Comme tu veux. J\'ai tout mon temps. »', 0, 120, W, 'center');
        w.resetTextColor();
    };
    window.Scene_Pacte = Scene_Pacte;

    //=========================================================================
    // Écran « Pactes scellés » (optionnel, menu)
    //=========================================================================
    function Scene_PacteCodex() { this.initialize.apply(this, arguments); }
    Scene_PacteCodex.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_PacteCodex.prototype.constructor = Scene_PacteCodex;
    Scene_PacteCodex.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        var w = new Window_Base(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        var c = w.contents, W = w.contentsWidth();
        w.changeTextColor(BLANC); w.drawText('— PACTES D\'ALDÉBARAN —', 0, 0, W, 'center');
        w.resetTextColor();
        w.drawText('Pactes scellés : ' + nombre(), 0, 60, W, 'center');
        w.drawText('Oublis payés : ' + (sys()._oublisPayes || 0), 0, 100, W, 'center');
        var y = 160;
        $gameParty.members().forEach(function (a) {
            var n = beni(a.actorId());
            w.changeTextColor(n > 0 ? OR : '#6a6a78');
            w.drawText(a.name() + ' — bénédiction ' + n, 40, y, W - 80); y += 36;
        });
        w.changeTextColor('#8d8d9c');
        w.drawText('« Ce que je t\'ai donné, je ne le reprends pas. Ce que tu m\'as donné non plus. »', 0, y + 20, W, 'center');
        this.addWindow(w);
        this._w = w;
    };
    Scene_PacteCodex.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) this.popScene();
    };

    //=========================================================================
    // Commandes + menu
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'PACTE') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'oubli') {
            if (OUBLI_SW > 0) $gameSwitches.setValue(OUBLI_SW, true);
            if (OUBLI_VAR > 0) $gameVariables.setValue(OUBLI_VAR, ($gameVariables.value(OUBLI_VAR) || 0) + 1);
            $gameSystem._oublisPayes = (sys()._oublisPayes || 0) + 1;
        } else {
            SceneManager.push(Scene_Pacte);
        }
    };

    if (MENU) {
        var _addOrig = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () { _addOrig.call(this); this.addCommand(MENU, 'pactesAld', true); };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () { _cw.call(this); this._commandWindow.setHandler('pactesAld', function () { SceneManager.push(Scene_PacteCodex); }); };
    }
})();
