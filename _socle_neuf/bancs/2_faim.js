/*
 * BANC 2 — la faim
 * ---------------------------------------------------------------------------
 * Rejoue LE VRAI CODE de js/plugins/ETT_Faim.js contre un moteur MV simulé :
 * mêmes globales, même DataManager.extractMetadata (espace après le « : »
 * compris), même chaîne Game_Action.apply.
 *
 *   node bancs/2_faim.js      (depuis la racine du projet)
 *
 * Un banc contre des stubs trop pauvres ne prouve rien — c'est comme ça qu'un
 * écran a déjà planté à l'ouverture, testé contre une fenêtre nue.
 *
 * Deux temps, comme le banc 1 :
 *   1. le comportement attendu, sur le vrai plugin ;
 *   2. la contre-épreuve — on casse un réglage ou une donnée, et le contrôle
 *      DOIT tomber. Un contrôle qui passe quand même ne mesure rien.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');
var RACINE = path.join(__dirname, '..');
var PLUGIN = path.join(RACINE, 'js', 'plugins', 'ETT_Faim.js');

// ═══════════════════════════════════════════════════════════════════════════
//  LE MOTEUR SIMULÉ
// ═══════════════════════════════════════════════════════════════════════════

function construireMoteur(parametres, etats, objets, competences) {
    var S = {};                       // le bac à sable
    S.console = { log: function () {} };

    //--- les données de base -------------------------------------------------
    // extractMetadata, à l'identique de MV : la valeur GARDE l'espace après
    // le « : ». C'est le piège qu'on veut que le plugin affronte pour de vrai.
    function extraire(objet) {
        var re = /<([^<>:]+)(:?)([^>]*)>/g;
        objet.meta = {};
        var m;
        while ((m = re.exec(objet.note || '')) !== null) {
            if (m[2] === ':') { objet.meta[m[1]] = m[3]; }
            else { objet.meta[m[1]] = true; }
        }
    }
    [etats, objets, competences].forEach(function (liste) {
        liste.forEach(function (o) { if (o) { extraire(o); } });
    });

    S.$dataStates  = etats;
    S.$dataItems   = objets;
    S.$dataWeapons = [null];
    S.$dataArmors  = [null];
    S.$dataSkills  = competences;

    //--- PluginManager -------------------------------------------------------
    S.PluginManager = {
        parameters: function (nom) {
            return nom === 'ETT_Faim' ? parametres : {};
        }
    };

    //--- DataManager ---------------------------------------------------------
    S.DataManager = { isDatabaseLoaded: function () { return true; } };

    //--- Game_System ---------------------------------------------------------
    function Game_System() { }
    Game_System.prototype.constructor = Game_System;
    S.Game_System = Game_System;

    //--- Game_Actor ----------------------------------------------------------
    function Game_Actor(id, nom) {
        this._actorId = id;
        this._nom = nom;
        this._etats = [];
        this.refreshCount = 0;
    }
    Game_Actor.prototype.actorId = function () { return this._actorId; };
    Game_Actor.prototype.name = function () { return this._nom; };
    Game_Actor.prototype.isActor = function () { return true; };
    Game_Actor.prototype.isStateAffected = function (id) { return this._etats.indexOf(id) >= 0; };
    Game_Actor.prototype.states = function () { return this._etats.slice(); };
    Game_Actor.prototype.refresh = function () {
        // MV rafraîchit l'acteur à chaque changement d'état. Si le plugin
        // rappelait sa propre mise à jour ici, on aurait une récursion : le
        // banc la déclenche exprès pour vérifier que la garde tient.
        this.refreshCount++;
        if (S.ETT && S.ETT.Faim && S.ETT.Faim.rafraichir) {
            S.ETT.Faim.rafraichir(this._actorId);
        }
    };
    Game_Actor.prototype.addState = function (id) {
        if (!this.isStateAffected(id)) { this._etats.push(id); this.refresh(); }
    };
    Game_Actor.prototype.removeState = function (id) {
        var i = this._etats.indexOf(id);
        if (i >= 0) { this._etats.splice(i, 1); this.refresh(); }
    };
    S.Game_Actor = Game_Actor;

    //--- Game_Party ----------------------------------------------------------
    function Game_Party() { this._membres = []; this._steps = 0; this._enCombat = false; }
    Game_Party.prototype.members = function () { return this._membres; };
    Game_Party.prototype.inBattle = function () { return this._enCombat; };
    Game_Party.prototype.increaseSteps = function () { this._steps++; };
    Game_Party.prototype.setupStartingMembers = function () { };
    S.Game_Party = Game_Party;

    //--- Game_Variables / Game_Switches -------------------------------------
    function Game_Variables() { this._data = {}; }
    Game_Variables.prototype.value = function (id) { return this._data[id] || 0; };
    Game_Variables.prototype.setValue = function (id, v) { this._data[id] = v; };
    S.Game_Variables = Game_Variables;

    function Game_Switches() { this._data = {}; }
    Game_Switches.prototype.value = function (id) { return !!this._data[id]; };
    Game_Switches.prototype.setValue = function (id, v) { this._data[id] = !!v; };
    S.Game_Switches = Game_Switches;

    //--- Game_Actors ---------------------------------------------------------
    function Game_Actors() { this._data = {}; }
    Game_Actors.prototype.actor = function (id) { return this._data[id] || null; };
    S.Game_Actors = Game_Actors;

    //--- Game_Action ---------------------------------------------------------
    function Game_Action(sujet, objet) { this._sujet = sujet; this._objet = objet; }
    Game_Action.prototype.subject = function () { return this._sujet; };
    Game_Action.prototype.item = function () { return this._objet; };
    Game_Action.prototype.apply = function () { /* le moteur applique les dégâts */ };
    S.Game_Action = Game_Action;

    //--- Game_Interpreter ----------------------------------------------------
    function Game_Interpreter() { }
    Game_Interpreter.prototype.pluginCommand = function () { };
    S.Game_Interpreter = Game_Interpreter;

    //--- BattleManager -------------------------------------------------------
    S.BattleManager = {
        _logWindow: null,
        startBattle: function () { },
        endBattle: function () { }
    };

    //--- les globales d'une partie ------------------------------------------
    S.$gameSystem    = new Game_System();
    S.$gameParty     = new Game_Party();
    S.$gameActors    = new Game_Actors();
    S.$gameVariables = new Game_Variables();
    S.$gameSwitches  = new Game_Switches();
    S.$gameMessage   = { isBusy: function () { return false; } };

    // On charge le plugin DANS ce monde-là.
    vm.createContext(S);
    vm.runInContext(fs.readFileSync(PLUGIN, 'utf8'), S, { filename: 'ETT_Faim.js' });
    S.DataManager.isDatabaseLoaded();   // déclenche la lecture des notetags

    return S;
}

// ═══════════════════════════════════════════════════════════════════════════
//  LE DÉCOR DE TEST
// ═══════════════════════════════════════════════════════════════════════════

var PARAMS_DEFAUT = {
    faimMax: '100', faimDepart: '0', varFaim: '50', varSocle: '60',
    socleDepart: '0', socleMax: '70', soclePourMauvais: '2',
    soclePourSurplus: '1', trancheSurplus: '10', soclePourBranche: '3',
    pasParFaim: '40', faimParCombat: '3', nuitFacteur: '200', interrupteurNuit: '20',
    seuilFremissement: '40', seuilFievre: '70',
    etatCalme: '9', etatFremissement: '10', etatFievre: '11',
    etatMue: '0', interrupteurMue: '21',
    annoneCible: '35',
    appliquerArticleI: 'false', cercleDepart: '8',
    direLesStades: 'false'
};

function etatsDeTest() {
    var e = [null];
    for (var i = 1; i <= 14; i++) { e[i] = { id: i, name: 'état ' + i, note: '' }; }
    e[9].name = 'Stade 1 — Le Calme';
    e[10].name = 'Stade 2 — Le Frémissement';
    e[11].name = 'Stade 3 — La Fièvre';
    return e;
}

function objetsDeTest() {
    return [null,
        { id: 1, name: 'Chair de monstre',      note: '<nourrit: 30>\n<purete: racine>\n<origine: M>' },
        { id: 2, name: 'Bouteille de racines',  note: '<nourrit: 25>\n<purete: racine>' },
        { id: 3, name: 'Verre de sang',         note: '<nourrit: 40>\n<purete: tronc>' },
        { id: 4, name: 'Sang de branche',       note: '<nourrit: 60>\n<purete: branche>' },
        { id: 5, name: 'Charogne',              note: '<nourrit: 20>\n<purete: racine>\n<mauvais>' },
        { id: 6, name: 'Chair nourrissante',    note: '<nourrit: 30>\n<purete: racine>\n<boost: 12>' },
        { id: 7, name: 'Potion ordinaire',      note: '' }
    ];
}

function competencesDeTest() {
    return [null,
        { id: 1, name: 'Frappe ordinaire', note: '' },
        { id: 2, name: 'Puiser au sombre', note: '<faim: 8>' }
    ];
}

// Le sabotage en cours, s'il y en a un. monde() le fusionne par-dessus tout,
// pour que les contrôles n'aient pas à le savoir.
var SABOTAGE = null;

/** Monte un monde jouable : 2 acteurs dans le groupe. */
function monde(surcharges) {
    var params = {};
    Object.keys(PARAMS_DEFAUT).forEach(function (k) { params[k] = PARAMS_DEFAUT[k]; });
    Object.keys(surcharges || {}).forEach(function (k) { params[k] = surcharges[k]; });

    var objets = objetsDeTest();
    var comps  = competencesDeTest();

    if (SABOTAGE) {
        Object.keys(SABOTAGE.params || {}).forEach(function (k) { params[k] = SABOTAGE.params[k]; });
        Object.keys(SABOTAGE.objets || {}).forEach(function (id) { objets[Number(id)].note = SABOTAGE.objets[id]; });
        Object.keys(SABOTAGE.competences || {}).forEach(function (id) { comps[Number(id)].note = SABOTAGE.competences[id]; });
    }

    var S = construireMoteur(params, etatsDeTest(), objets, comps);
    var v = new S.Game_Actor(1, 'Vesper');
    var k = new S.Game_Actor(4, 'Korrah');
    S.$gameActors._data[1] = v;
    S.$gameActors._data[4] = k;
    S.$gameParty._membres = [v, k];
    return S;
}

function marcher(S, n) {
    for (var i = 0; i < n; i++) { S.$gameParty.increaseSteps(); }
}

// ═══════════════════════════════════════════════════════════════════════════
//  LES CONTRÔLES
// ═══════════════════════════════════════════════════════════════════════════

var CONTROLES = [];
function controle(titre, fn) { CONTROLES.push({ titre: titre, fn: fn }); }

controle('le notetag garde l\'espace après le « : », et le plugin le trim()', function () {
    var S = monde();
    // Si le plugin ne faisait pas trim(), la pureté serait " racine" et
    // retomberait en silence sur la valeur par défaut — invisible.
    var brut = S.$dataItems[3].meta['purete'];
    if (brut.charAt(0) !== ' ') { return 'le moteur simulé ne reproduit pas le piège (pas d\'espace)'; }
    if (!S.$dataItems[3]._ettAliment) { return 'aliment non lu'; }
    if (S.$dataItems[3]._ettAliment.purete !== 'tronc') {
        return 'pureté lue « ' + S.$dataItems[3]._ettAliment.purete +' » au lieu de « tronc » : le trim() manque';
    }
    return null;
});

controle('la faim monte à la marche, tous les N pas', function () {
    var S = monde();
    marcher(S, 39);
    if (S.ETT.Faim.valeur(1) !== 0) { return 'elle a bougé avant 40 pas : ' + S.ETT.Faim.valeur(1); }
    marcher(S, 1);
    if (S.ETT.Faim.valeur(1) !== 1) { return 'au 40e pas, faim = ' + S.ETT.Faim.valeur(1) + ' au lieu de 1'; }
    marcher(S, 40);
    if (S.ETT.Faim.valeur(1) !== 2) { return 'au 80e pas, faim = ' + S.ETT.Faim.valeur(1) + ' au lieu de 2'; }
    return null;
});

controle('la nuit fait monter deux fois plus vite', function () {
    var jour = monde();
    jour.ETT.Faim.ajouter(1, 10);
    var nuit = monde();
    nuit.$gameSwitches.setValue(20, true);
    if (!nuit.ETT.Faim.estNuit()) { return 'l\'interrupteur de nuit n\'est pas lu'; }
    nuit.ETT.Faim.ajouter(1, 10);
    if (nuit.ETT.Faim.valeur(1) <= jour.ETT.Faim.valeur(1)) {
        return 'nuit ' + nuit.ETT.Faim.valeur(1) + ' ≤ jour ' + jour.ETT.Faim.valeur(1);
    }
    if (nuit.ETT.Faim.valeur(1) !== 20) {
        return 'la nuit donne ' + nuit.ETT.Faim.valeur(1) + ' au lieu de 20';
    }
    return null;
});

controle('nourrir ne descend JAMAIS sous le socle', function () {
    var S = monde();
    S.ETT.Faim.ajouter(1, 60);
    S.ETT.Faim.monterSocle(1, 25);
    S.ETT.Faim.nourrir(1, 999, 'branche');
    if (S.ETT.Faim.valeur(1) < S.ETT.Faim.socle(1)) {
        return 'faim ' + S.ETT.Faim.valeur(1) + ' sous le socle ' + S.ETT.Faim.socle(1);
    }
    if (S.ETT.Faim.valeur(1) !== S.ETT.Faim.socle(1)) {
        return 'un repas illimité devrait ramener pile au socle, on a ' + S.ETT.Faim.valeur(1);
    }
    return null;
});

controle('le socle ne redescend jamais', function () {
    var S = monde();
    S.ETT.Faim.monterSocle(1, 20);
    var avant = S.ETT.Faim.socle(1);
    S.ETT.Faim.nourrir(1, 999, 'branche');
    S.ETT.Faim.annone();
    marcher(S, 500);
    if (S.ETT.Faim.socle(1) < avant) {
        return 'le socle est redescendu de ' + avant + ' à ' + S.ETT.Faim.socle(1);
    }
    return null;
});

controle('les trois causes écrites font monter le socle — et elles seules', function () {
    // 1 · se nourrir mal
    var a = monde();
    a.ETT.Faim.ajouter(1, 50);
    a.ETT.Faim.nourrir(1, 20, 'racine', true);
    if (a.ETT.Faim.socle(1) !== 2) { return '<mauvais> donne un socle de ' + a.ETT.Faim.socle(1) + ' au lieu de 2'; }

    // 2 · se nourrir trop : 30 de surplus = 3 tranches = +3
    var b = monde();
    b.ETT.Faim.ajouter(1, 10);
    b.ETT.Faim.nourrir(1, 40, 'racine');
    if (b.ETT.Faim.socle(1) !== 3) { return 'le surplus donne un socle de ' + b.ETT.Faim.socle(1) + ' au lieu de 3'; }

    // 3 · boire à la branche
    var c = monde();
    c.ETT.Faim.ajouter(1, 60);
    c.ETT.Faim.nourrir(1, 20, 'branche');
    if (c.ETT.Faim.socle(1) !== 3) { return 'la branche donne un socle de ' + c.ETT.Faim.socle(1) + ' au lieu de 3'; }

    // Le contrôle doit aussi INNOCENTER : un repas juste, à la racine,
    // sans surplus, ne doit rien coûter.
    var d = monde();
    d.ETT.Faim.ajouter(1, 50);
    d.ETT.Faim.nourrir(1, 50, 'racine');
    if (d.ETT.Faim.socle(1) !== 0) {
        return 'un repas juste a coûté ' + d.ETT.Faim.socle(1) + ' de socle : faux coupable';
    }
    return null;
});

controle('les stades suivent les seuils, à la borne près', function () {
    var attendu = [[0, 1], [39, 1], [40, 2], [69, 2], [70, 3], [99, 3], [100, 4]];
    for (var i = 0; i < attendu.length; i++) {
        var S = monde();
        S.ETT.Faim.ajouter(1, attendu[i][0]);
        var obtenu = S.ETT.Faim.stade(1);
        if (obtenu !== attendu[i][1]) {
            return 'faim ' + attendu[i][0] + ' → stade ' + obtenu + ' au lieu de ' + attendu[i][1];
        }
    }
    return null;
});

controle('un seul état de stade à la fois, et c\'est le bon', function () {
    var S = monde();
    var acteur = S.$gameActors.actor(1);
    var suite = [[0, 9], [45, 10], [75, 11]];
    for (var i = 0; i < suite.length; i++) {
        S.ETT.Faim.ajouter(1, i === 0 ? 0 : suite[i][0] - suite[i - 1][0]);
        S.ETT.Faim.rafraichir(1);
        var poses = acteur.states().filter(function (id) { return id === 9 || id === 10 || id === 11; });
        if (poses.length !== 1) { return 'à la faim ' + S.ETT.Faim.valeur(1) + ' : ' + poses.length + ' états de stade posés (' + poses.join(', ') + ')'; }
        if (poses[0] !== suite[i][1]) { return 'à la faim ' + S.ETT.Faim.valeur(1) + ' : état ' + poses[0] + ' au lieu de ' + suite[i][1]; }
    }
    return null;
});

controle('redescendre retire l\'état haut et repose le bon', function () {
    var S = monde();
    var acteur = S.$gameActors.actor(1);
    S.ETT.Faim.ajouter(1, 80);
    if (!acteur.isStateAffected(11)) { return 'la Fièvre n\'a pas été posée'; }
    S.ETT.Faim.nourrir(1, 80, 'branche');
    if (acteur.isStateAffected(11)) { return 'la Fièvre est restée après avoir mangé'; }
    if (!acteur.isStateAffected(9)) { return 'le Calme n\'a pas été reposé'; }
    return null;
});

controle('poser un état ne part pas en récursion', function () {
    var S = monde();
    var acteur = S.$gameActors.actor(1);
    // refresh() du moteur simulé rappelle la mise à jour du plugin : sans
    // garde, on empile jusqu'au débordement de pile.
    S.ETT.Faim.ajouter(1, 80);
    if (acteur.refreshCount > 20) {
        return 'refresh() appelé ' + acteur.refreshCount + ' fois : la garde ne tient pas';
    }
    return null;
});

controle('la Mue lève l\'interrupteur, faute d\'état en base', function () {
    var S = monde();
    S.ETT.Faim.ajouter(1, 100);
    if (S.ETT.Faim.stade(1) !== 4) { return 'la faim au maximum ne donne pas le stade 4'; }
    if (!S.$gameSwitches.value(21)) { return 'l\'interrupteur de la Mue n\'a pas été levé'; }
    // Et surtout : pas de plantage parce que l'état 4 n'existe pas (param à 0).
    return null;
});

controle('manger nourrit la CIBLE, pas le lanceur', function () {
    var S = monde();
    S.ETT.Faim.ajouter(1, 60);
    S.ETT.Faim.ajouter(4, 60);
    var vesper = S.$gameActors.actor(1);
    var korrah = S.$gameActors.actor(4);
    // Korrah donne à manger à Vesper.
    var action = new S.Game_Action(korrah, S.$dataItems[3]);   // verre de sang, tronc, 40
    action.apply(vesper);
    if (S.ETT.Faim.valeur(1) !== 20) { return 'la cible est à ' + S.ETT.Faim.valeur(1) + ' au lieu de 20'; }
    if (S.ETT.Faim.valeur(4) !== 60) { return 'le lanceur a été nourri : ' + S.ETT.Faim.valeur(4); }
    return null;
});

controle('puiser creuse le LANCEUR, pas la cible', function () {
    var S = monde();
    var vesper = S.$gameActors.actor(1);
    var korrah = S.$gameActors.actor(4);
    var action = new S.Game_Action(korrah, S.$dataSkills[2]);   // <faim: 8>
    action.apply(vesper);
    if (S.ETT.Faim.valeur(4) !== 8) { return 'le lanceur est à ' + S.ETT.Faim.valeur(4) + ' au lieu de 8'; }
    if (S.ETT.Faim.valeur(1) !== 0) { return 'la cible a été creusée : ' + S.ETT.Faim.valeur(1); }
    return null;
});

controle('un objet sans <nourrit> ne touche à rien', function () {
    var S = monde();
    S.ETT.Faim.ajouter(1, 50);
    var vesper = S.$gameActors.actor(1);
    var action = new S.Game_Action(vesper, S.$dataItems[7]);   // potion ordinaire
    action.apply(vesper);
    if (S.ETT.Faim.valeur(1) !== 50) { return 'une potion ordinaire a nourri : ' + S.ETT.Faim.valeur(1); }
    return null;
});

controle('le <boost> pose son état, et seulement s\'il existe', function () {
    var S = monde();
    S.ETT.Faim.ajouter(1, 50);
    var vesper = S.$gameActors.actor(1);
    new S.Game_Action(vesper, S.$dataItems[6]).apply(vesper);   // <boost: 12>
    if (!vesper.isStateAffected(12)) { return 'l\'état de boost n\'a pas été posé'; }
    return null;
});

controle('la racine ne tient que sa part, et le reste REVIENT vraiment', function () {
    var S = monde();
    S.ETT.Faim.ajouter(1, 100 - 0);
    S.ETT.Faim.nourrir(1, 100, 'racine');       // 100 pris, 30 % durable
    var justeApres = S.ETT.Faim.valeur(1);
    if (justeApres !== 0) { return 'juste après le repas, faim = ' + justeApres + ' au lieu de 0'; }
    marcher(S, 600);
    var apres = S.ETT.Faim.valeur(1);
    // 70 reviennent sur 600 pas ; la marche en ajoute 600/40 = 15.
    if (apres < 65) { return 'après 600 pas, faim = ' + apres + ' : le repas n\'est pas revenu'; }
    return null;
});

controle('la branche tient tout — c\'est ce qu\'on paie en socle', function () {
    var S = monde();
    S.ETT.Faim.ajouter(1, 60);
    S.ETT.Faim.nourrir(1, 60, 'branche');
    marcher(S, 600);
    // Rien ne revient ; seule la marche a rempli : 600/40 = 15.
    if (S.ETT.Faim.valeur(1) > 20) {
        return 'après 600 pas, faim = ' + S.ETT.Faim.valeur(1) + ' : la branche n\'a pas tenu';
    }
    return null;
});

controle('l\'Annone ramène à sa cible, et elle ne suffit pas', function () {
    var S = monde();
    S.ETT.Faim.ajouter(1, 90);
    S.ETT.Faim.annone();
    if (S.ETT.Faim.valeur(1) !== 35) { return 'après l\'Annone, faim = ' + S.ETT.Faim.valeur(1) + ' au lieu de 35'; }
    if (S.ETT.Faim.stade(1) !== 1) { return 'l\'Annone laisse au stade ' + S.ETT.Faim.stade(1) + ' au lieu du Calme'; }
    // « calibrée pour maintenir au Calme SANS EFFORT » : la marge doit être mince.
    if (35 < 40 - 10) { return 'la marge sous le Frémissement est trop confortable'; }
    return null;
});

controle('l\'Annone ne descend pas sous le socle', function () {
    var S = monde();
    S.ETT.Faim.monterSocle(1, 50);
    S.ETT.Faim.ajouter(1, 90);
    S.ETT.Faim.annone();
    if (S.ETT.Faim.valeur(1) < 50) { return 'l\'Annone est passée sous le socle : ' + S.ETT.Faim.valeur(1); }
    if (S.ETT.Faim.stade(1) !== 2) { return 'un socle de 50 devrait laisser au Frémissement, on a le stade ' + S.ETT.Faim.stade(1); }
    return null;
});

controle('les variables réservées sont bien recopiées', function () {
    var S = monde();
    S.ETT.Faim.ajouter(1, 42);
    S.ETT.Faim.monterSocle(4, 7);
    if (S.$gameVariables.value(50) !== 42) { return 'variable 50 = ' + S.$gameVariables.value(50) + ' au lieu de 42'; }
    if (S.$gameVariables.value(63) !== 7) { return 'variable 63 = ' + S.$gameVariables.value(63) + ' au lieu de 7'; }
    // et tout reste dans la plage réservée 50-69
    var utilisees = Object.keys(S.$gameVariables._data).map(Number);
    var hors = utilisees.filter(function (id) { return id < 50 || id > 69; });
    if (hors.length) { return 'variables hors de la plage réservée : ' + hors.join(', '); }
    return null;
});

controle('l\'Article I refuse — et laisse passer quand le rang suffit', function () {
    // Le contrôle doit attraper le vrai coupable ET innocenter le faux.
    var bas = monde({ appliquerArticleI: 'true', cercleDepart: '8' });
    bas.ETT.Faim.ajouter(1, 60);
    var r1 = bas.ETT.Faim.nourrir(1, 40, 'branche');
    if (!r1.refuse) { return 'un porteur du 8e cercle a bu à la branche'; }
    if (bas.ETT.Faim.valeur(1) !== 60) { return 'un repas refusé a quand même nourri'; }

    var haut = monde({ appliquerArticleI: 'true', cercleDepart: '1' });
    haut.ETT.Faim.ajouter(1, 60);
    var r2 = haut.ETT.Faim.nourrir(1, 40, 'branche');
    if (r2.refuse) { return 'le premier cercle s\'est vu refuser la branche : faux coupable'; }

    var eteint = monde({ appliquerArticleI: 'false', cercleDepart: '9' });
    eteint.ETT.Faim.ajouter(1, 60);
    if (eteint.ETT.Faim.nourrir(1, 40, 'branche').refuse) {
        return 'l\'Article I s\'applique alors qu\'il est éteint';
    }
    return null;
});

controle('la faim reste bornée entre le socle et le maximum', function () {
    var S = monde();
    S.ETT.Faim.ajouter(1, 9999);
    if (S.ETT.Faim.valeur(1) !== 100) { return 'la faim dépasse le maximum : ' + S.ETT.Faim.valeur(1); }
    S.ETT.Faim.monterSocle(1, 9999);
    if (S.ETT.Faim.socle(1) > 70) { return 'le socle dépasse son plafond : ' + S.ETT.Faim.socle(1); }
    return null;
});

controle('une partie sauvegardée AVANT le plugin se charge sans planter', function () {
    var S = monde();
    // Une vieille sauvegarde n'a pas _ettFaim du tout.
    delete S.$gameSystem._ettFaim;
    delete S.$gameSystem._ettFaimPas;
    var v;
    try {
        v = S.ETT.Faim.valeur(1);
        marcher(S, 45);
        S.ETT.Faim.annone();
    } catch (err) {
        return 'plantage : ' + err.message;
    }
    if (v !== 0) { return 'la faim initiale vaut ' + v + ' au lieu de 0'; }
    return null;
});

controle('la commande FAIM répond, et une commande inconnue ne plante pas', function () {
    var S = monde();
    var interprete = new S.Game_Interpreter();
    interprete.pluginCommand('FAIM', ['ajouter', '1', '50']);
    if (S.ETT.Faim.valeur(1) !== 50) { return 'FAIM ajouter n\'a rien fait : ' + S.ETT.Faim.valeur(1); }
    interprete.pluginCommand('FAIM', ['nourrir', 'groupe', '20', 'tronc']);
    if (S.ETT.Faim.valeur(1) !== 30) { return 'FAIM nourrir groupe : ' + S.ETT.Faim.valeur(1) + ' au lieu de 30'; }
    try {
        interprete.pluginCommand('FAIM', ['zzz']);
        interprete.pluginCommand('FAIM', []);
        interprete.pluginCommand('AUTRECHOSE', ['ajouter', '1', '10']);
    } catch (err) {
        return 'une commande inconnue plante : ' + err.message;
    }
    if (S.ETT.Faim.valeur(1) !== 30) { return 'une commande inconnue a modifié la faim'; }
    return null;
});

controle('le combat creuse tout le groupe', function () {
    var S = monde();
    S.BattleManager.endBattle(0);
    if (S.ETT.Faim.valeur(1) !== 3) { return 'après un combat, Vesper est à ' + S.ETT.Faim.valeur(1) + ' au lieu de 3'; }
    if (S.ETT.Faim.valeur(4) !== 3) { return 'après un combat, Korrah est à ' + S.ETT.Faim.valeur(4) + ' au lieu de 3'; }
    return null;
});

// ═══════════════════════════════════════════════════════════════════════════
//  LES CONTRE-ÉPREUVES
// ═══════════════════════════════════════════════════════════════════════════
// On ne sabote pas le plugin (il est la chose à protéger) : on sabote le
// RÉGLAGE ou la DONNÉE, et le contrôle visé doit tomber.

var SABOTAGES = [
    ['la faim monte à la marche, tous les N pas',
     'pasParFaim mis à 1 : elle montera à chaque pas',
     { params: { pasParFaim: '1' } }],

    ['la nuit fait monter deux fois plus vite',
     'facteur de nuit ramené à 100 : la nuit ne change plus rien',
     { params: { nuitFacteur: '100' } }],

    ['les trois causes écrites font monter le socle — et elles seules',
     'le socle du mauvais repas mis à 0',
     { params: { soclePourMauvais: '0' } }],

    ['les stades suivent les seuils, à la borne près',
     'seuil du Frémissement déplacé à 50',
     { params: { seuilFremissement: '50' } }],

    ['un seul état de stade à la fois, et c\'est le bon',
     'le Frémissement et la Fièvre pointent vers le même état',
     { params: { etatFievre: '10' } }],

    ['redescendre retire l\'état haut et repose le bon',
     'le Calme pointe vers l\'état de la Fièvre',
     { params: { etatCalme: '11' } }],

    ['la Mue lève l\'interrupteur, faute d\'état en base',
     'interrupteur de Mue mis à 0',
     { params: { interrupteurMue: '0' } }],

    ['la racine ne tient que sa part, et le reste REVIENT vraiment',
     'la marche coupée : plus rien ne peut revenir',
     { params: { pasParFaim: '0' } }],

    ['l\'Annone ramène à sa cible, et elle ne suffit pas',
     'Annone portée à 10 : elle suffirait largement',
     { params: { annoneCible: '10' } }],

    ['les variables réservées sont bien recopiées',
     'recopie déplacée hors de la plage réservée',
     { params: { varFaim: '5' } }],

    ['l\'Article I refuse — et laisse passer quand le rang suffit',
     'Article I éteint alors que le contrôle attend un refus',
     { params: { appliquerArticleI: 'false' } }],

    ['la faim reste bornée entre le socle et le maximum',
     'socle maximal poussé au-delà de la jauge',
     { params: { socleMax: '9999' } }],

    ['le combat creuse tout le groupe',
     'faim par combat mise à 0',
     { params: { faimParCombat: '0' } }],

    // — sabotages de DONNÉE : on casse le notetag, pas le réglage —
    ['le notetag garde l\'espace après le « : », et le plugin le trim()',
     'l\'espace retiré du notetag : le piège MV ne se produit plus',
     { objets: { 3: '<nourrit: 40>\n<purete:tronc>' } }],

    ['manger nourrit la CIBLE, pas le lanceur',
     '<nourrit> retiré du verre de sang',
     { objets: { 3: '<purete: tronc>' } }],

    ['puiser creuse le LANCEUR, pas la cible',
     '<faim> retiré de la compétence',
     { competences: { 2: '' } }],

    ['un objet sans <nourrit> ne touche à rien',
     '<nourrit> ajouté à la potion ordinaire',
     { objets: { 7: '<nourrit: 30>' } }],

    ['le <boost> pose son état, et seulement s\'il existe',
     '<boost> retiré de la chair nourrissante',
     { objets: { 6: '<nourrit: 30>\n<purete: racine>' } }]
];

// Contrôles sans levier extérieur : ce sont des INVARIANTS du code du plugin.
// Aucun réglage ni aucune donnée ne peut les faire tomber — c'est justement ce
// qui en fait des garde-fous. Ils doivent être déclarés ici, un par un, avec
// leur raison : un contrôle qui n'est ni saboté ni déclaré fait échouer le banc.
var SANS_LEVIER = {
    'nourrir ne descend JAMAIS sous le socle':
        'borne() dans le plugin — aucun paramètre ne l\'ouvre',
    'le socle ne redescend jamais':
        'monterSocle() n\'additionne que du positif',
    'poser un état ne part pas en récursion':
        'la garde _enRafraichissement — un drapeau interne, sans réglage',
    'l\'Annone ne descend pas sous le socle':
        'Math.max(cible, socle) — aucun réglage ne le contourne',
    'la branche tient tout — c\'est ce qu\'on paie en socle':
        'la table des puretés est en dur dans le plugin, à dessein',
    'une partie sauvegardée AVANT le plugin se charge sans planter':
        'initialisation défensive à la lecture — il n\'y a rien à régler',
    'la commande FAIM répond, et une commande inconnue ne plante pas':
        'le switch/default du plugin — aucun paramètre ne le pilote'
};

// ═══════════════════════════════════════════════════════════════════════════
//  EXÉCUTION
// ═══════════════════════════════════════════════════════════════════════════

function lancer() {
    var echecs = 0, muets = 0;

    console.log('BANC 2 — la faim');
    console.log('(le vrai js/plugins/ETT_Faim.js, rejoué sur un moteur MV simulé)\n');

    console.log('1) Le comportement attendu — tout doit passer');
    console.log('   ' + new Array(72).join('-'));
    CONTROLES.forEach(function (c) {
        var r;
        try { r = c.fn(); } catch (err) { r = 'exception : ' + err.message; }
        if (r) { echecs++; console.log('   ✗ ' + c.titre + '\n       → ' + r); }
        else { console.log('   ✓ ' + c.titre); }
    });

    console.log('\n2) Contre-épreuve — le contrôle doit TOMBER quand on casse ce qu\'il vise');
    console.log('   ' + new Array(72).join('-'));
    SABOTAGES.forEach(function (s) {
        var titre = s[0], quoi = s[1], degats = s[2];
        var c = null;
        CONTROLES.forEach(function (x) { if (x.titre === titre) { c = x; } });
        if (!c) { muets++; console.log('   ✗ sabotage orphelin : « ' + titre + ' »'); return; }

        var r;
        SABOTAGE = degats;
        try { r = c.fn(); } catch (err) { r = 'exception'; } finally { SABOTAGE = null; }

        if (r) { console.log('   ✓ ' + titre + '\n       (' + quoi + ')'); }
        else {
            muets++;
            console.log('   ✗ ' + titre + '\n       (' + quoi + ')' +
                        '\n       → le contrôle passe QUAND MÊME : il ne mesure rien');
        }
    });

    console.log('\n3) Invariants déclarés — sans levier extérieur, et c\'est assumé');
    console.log('   ' + new Array(72).join('-'));
    Object.keys(SANS_LEVIER).forEach(function (titre) {
        console.log('   · ' + titre + '\n       ' + SANS_LEVIER[titre]);
    });

    // Un contrôle qui n'est ni saboté ni déclaré invariant est un contrôle dont
    // personne n'a vérifié qu'il mesure quelque chose. Le banc le refuse.
    var orphelins = CONTROLES.filter(function (c) {
        return !SABOTAGES.some(function (s) { return s[0] === c.titre; }) &&
               !(c.titre in SANS_LEVIER);
    });
    if (orphelins.length) {
        muets += orphelins.length;
        console.log('\n   ✗ contrôles ni sabotés ni déclarés invariants :');
        orphelins.forEach(function (c) { console.log('       · ' + c.titre); });
    }

    console.log('\n' + new Array(75).join('='));
    console.log(CONTROLES.length + ' contrôles · ' + SABOTAGES.length + ' contre-épreuves · ' +
                Object.keys(SANS_LEVIER).length + ' invariants déclarés');
    if (echecs === 0 && muets === 0) {
        console.log('✅ BANC PASSÉ');
        process.exit(0);
    }
    console.log('❌ BANC ÉCHOUÉ — ' + echecs + ' contrôle(s) en échec, ' + muets + ' qui ne mesurent rien');
    process.exit(1);
}

lancer();
