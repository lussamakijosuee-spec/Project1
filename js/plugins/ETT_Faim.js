//=============================================================================
// ETT_Faim.js
//=============================================================================
/*:
 * @plugindesc La faim du sang — la jauge de l'Empire du Corps, ses stades, et
 * le socle qu'on ne comble jamais.
 * @author L'Empire aux Trois Têtes
 *
 * @param --- La jauge ---
 * @default
 *
 * @param faimMax
 * @text Faim maximale
 * @desc Borne haute de la jauge. Au-delà, c'est la Mue.
 * @type number
 * @min 1
 * @default 100
 *
 * @param faimDepart
 * @text Faim au départ
 * @desc Valeur de la jauge pour un porteur qui vient de boire.
 * @type number
 * @min 0
 * @default 0
 *
 * @param varFaim
 * @text Variable — première faim
 * @desc Variable de l'acteur 1 ; les suivants prennent les variables d'après. Plage réservée 50-69. 0 = ne pas recopier.
 * @type number
 * @min 0
 * @default 50
 *
 * @param varSocle
 * @text Variable — premier socle
 * @desc Idem pour le socle. Plage réservée 50-69. 0 = ne pas recopier.
 * @type number
 * @min 0
 * @default 60
 *
 * @param --- Le socle ---
 * @default
 *
 * @param socleDepart
 * @text Socle au départ
 * @desc Faim minimale, celle qu'aucun repas ne comble. Elle ne redescend jamais.
 * @type number
 * @min 0
 * @default 0
 *
 * @param socleMax
 * @text Socle maximal
 * @desc Borne du socle, pour que la partie reste jouable.
 * @type number
 * @min 0
 * @default 70
 *
 * @param soclePourMauvais
 * @text Socle — mal se nourrir
 * @desc Socle gagné en consommant un aliment marqué <mauvais>.
 * @type number
 * @min 0
 * @default 2
 *
 * @param soclePourSurplus
 * @text Socle — se nourrir de trop
 * @desc Socle gagné par tranche de surplus (ce qu'on ingère au-delà de ce qui manquait).
 * @type number
 * @min 0
 * @default 1
 *
 * @param trancheSurplus
 * @text Taille d'une tranche de surplus
 * @desc Combien de surplus vaut une tranche.
 * @type number
 * @min 1
 * @default 10
 *
 * @param soclePourBranche
 * @text Socle — boire à la branche
 * @desc Le prix de la pureté. C'est la terreur des Libéralistes.
 * @type number
 * @min 0
 * @default 3
 *
 * @param --- La montée ---
 * @default
 *
 * @param pasParFaim
 * @text Pas pour +1 de faim
 * @desc Le groupe marche : tous les N pas, chaque porteur prend +1.
 * @type number
 * @min 1
 * @default 40
 *
 * @param faimParCombat
 * @text Faim par combat
 * @desc Gagnée à la fin de chaque combat.
 * @type number
 * @min 0
 * @default 3
 *
 * @param nuitFacteur
 * @text Facteur de nuit (x100)
 * @desc La nuit, tout descend plus vite. 200 = deux fois plus vite.
 * @type number
 * @min 100
 * @default 200
 *
 * @param interrupteurNuit
 * @text Interrupteur — il fait nuit
 * @desc ON = la nuit est tombée. Plage réservée 20-49. 0 = jamais la nuit.
 * @type number
 * @min 0
 * @default 20
 *
 * @param --- Les stades ---
 * @default
 *
 * @param seuilFremissement
 * @text Seuil — Le Frémissement
 * @desc Faim à partir de laquelle le sang s'éveille.
 * @type number
 * @min 0
 * @default 40
 *
 * @param seuilFievre
 * @text Seuil — La Fièvre
 * @desc Faim à partir de laquelle les chasseurs exécutent.
 * @type number
 * @min 0
 * @default 70
 *
 * @param etatCalme
 * @text État — Stade 1, Le Calme
 * @type state
 * @default 9
 *
 * @param etatFremissement
 * @text État — Stade 2, Le Frémissement
 * @type state
 * @default 10
 *
 * @param etatFievre
 * @text État — Stade 3, La Fièvre
 * @type state
 * @default 11
 *
 * @param etatMue
 * @text État — Stade 4, la Mue
 * @desc L'état du stade 4. Il N'EXISTE PAS encore en base : laisser 0 tant que JOKO ne l'a pas demandé.
 * @type number
 * @min 0
 * @default 0
 *
 * @param interrupteurMue
 * @text Interrupteur — la Mue
 * @desc Mis à ON quand un porteur atteint le maximum. À l'événement de faire le reste. 0 = aucun.
 * @type number
 * @min 0
 * @default 21
 *
 * @param --- L'Annone ---
 * @default
 *
 * @param annoneCible
 * @text Annone — faim visée
 * @desc La ration ramène à cette valeur, jamais en dessous du socle. Sous le seuil du Frémissement, sans marge : elle est calibrée pour être insuffisante.
 * @type number
 * @min 0
 * @default 35
 *
 * @param --- Article I (document de travail) ---
 * @default
 *
 * @param appliquerArticleI
 * @text Appliquer l'Article I
 * @desc « Nul ne boit au-dessus de son rang. » Vient d'un document NON VALIDÉ : laissé à Non par défaut.
 * @type boolean
 * @on Oui
 * @off Non
 * @default false
 *
 * @param cercleDepart
 * @text Cercle au départ
 * @desc 1 = le plus haut (branche et tronc sans plafond), 9 = le plus bas.
 * @type number
 * @min 1
 * @max 9
 * @default 8
 *
 * @param --- Messages ---
 * @default
 *
 * @param direLesStades
 * @text Annoncer les changements de stade
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ============================================================================
 *  CE QUE DIT LE LORE, ET CE QUE LE PLUGIN EN FAIT
 * ============================================================================
 *
 * « L'utilisateur a une faim de mana constante, une faim qui NE PEUT PAS être
 *   comblée. Même si tu ne la sens pas, elle reviendra toujours avec force un
 *   jour — et elle grandit de plus en plus si tu te nourris mal. »
 *
 * D'où deux nombres par porteur, et non un seul :
 *
 *   LA FAIM   ce qu'on ressent maintenant. Monte avec le temps, descend quand
 *             on mange.
 *   LE SOCLE  le plancher de la faim. Aucun repas ne descend en dessous.
 *             Il ne redescend JAMAIS. C'est la faim « qui ne peut pas être
 *             comblée », et c'est elle qui grandit quand on se nourrit mal.
 *
 * En fin de partie, le socle peut dépasser le seuil du Frémissement : le
 * porteur vit alors en permanence au stade 2, sans avoir rien fait de mal
 * ce jour-là. C'est voulu, et c'est tout le drame de l'Empire.
 *
 * ---------------------------------------------------------------------------
 *  CE QUI FAIT MONTER LA FAIM
 * ---------------------------------------------------------------------------
 *   - la marche (tous les N pas), deux fois plus vite la nuit ;
 *   - la fin d'un combat ;
 *   - toute compétence notée <faim: n> — « plus on puise profond, plus on
 *     réveille la faim ».
 *
 *  CE QUI FAIT MONTER LE SOCLE — les trois causes écrites dans le canon
 *   - consommer un aliment noté <mauvais>          (« se nourrir mal ») ;
 *   - manger au-delà de ce qui manquait            (« se nourrir trop ») ;
 *   - boire à la branche                           (le prix de la pureté).
 *
 * ---------------------------------------------------------------------------
 *  LES NOTETAGS
 * ---------------------------------------------------------------------------
 *  Sur un OBJET (ou une arme, ou une armure consommable) :
 *
 *    <nourrit: 40>            retire 40 de faim
 *    <purete: racine>         racine | puits | tronc | branche
 *    <mauvais>                monte le socle : c'est de la mauvaise nourriture
 *    <boost: 12>              applique l'état 12 en plus (certains monstres
 *                             « boostent, parce qu'ils portent une grosse
 *                             quantité de mana »)
 *    <origine: M>             N natif / M muté — lu par le Registre, pas ici
 *
 *  La PURETÉ décide de ce qui tient. Le sang des racines « comble la faim
 *  pendant quelques heures » : une part seulement du repas est durable, le
 *  reste revient au fil des pas.
 *
 *    racine   30 % durable, le reste revient sur 600 pas
 *    puits    50 % durable, sur 900 pas
 *    tronc    75 % durable, sur 1200 pas
 *    branche  100 % durable — mais + socle
 *
 *  Sur une COMPÉTENCE :
 *
 *    <faim: 5>                le lanceur puise, et se creuse
 *
 * ---------------------------------------------------------------------------
 *  COMMANDES DE PLUGIN
 * ---------------------------------------------------------------------------
 *    FAIM ajouter <acteur> <n>     monte la faim
 *    FAIM nourrir <acteur> <n>     la fait descendre (sans pureté)
 *    FAIM socle <acteur> <n>       monte le socle de n
 *    FAIM annone                   la distribution mensuelle, tout le groupe
 *    FAIM cercle <acteur> <1-9>    fixe le cercle du porteur
 *    FAIM etat                     affiche l'état du groupe dans la console
 *
 *  <acteur> = un id d'acteur, ou « groupe » pour tout le monde.
 *
 * ---------------------------------------------------------------------------
 *  SCRIPTS
 * ---------------------------------------------------------------------------
 *    ETT.Faim.valeur(1)            la faim de l'acteur 1
 *    ETT.Faim.socle(1)             son socle
 *    ETT.Faim.stade(1)             1, 2, 3 ou 4
 *    ETT.Faim.nomStade(1)          'Le Calme', 'Le Frémissement'…
 *    ETT.Faim.ajouter(1, 10)
 *    ETT.Faim.nourrir(1, 30, 'racine')
 *    ETT.Faim.annone()
 *    ETT.Faim.estNuit()
 *
 * ---------------------------------------------------------------------------
 *  CE QUI N'EST PAS ENCORE LÀ, ET POURQUOI
 * ---------------------------------------------------------------------------
 *  - Le STADE 4 (la Mue) n'a pas d'état en base : JOKO ne l'a pas demandé.
 *    Le paramètre etatMue est à 0 ; à la place, le plugin lève un
 *    interrupteur, et c'est à un événement de décider ce qui arrive.
 *  - L'ARTICLE I (« nul ne boit au-dessus de son rang ») vient d'un document
 *    de travail non validé. Il est à Non par défaut.
 *  - La faim ne monte pas encore sur l'élément « mana sombre » : cet élément
 *    n'a pas de code dans System.json (les codes 2 à 7 sont réservés vides).
 *    En attendant, on passe par le notetag <faim: n>.
 * ============================================================================
 */

var ETT = ETT || {};
ETT.Faim = ETT.Faim || {};
ETT.Faim.version = '1.0.0';

(function () {
    'use strict';

    var p = PluginManager.parameters('ETT_Faim');
    var nb = function (cle, defaut) {
        var v = Number(p[cle]);
        return isNaN(v) ? defaut : v;
    };
    var bl = function (cle, defaut) {
        if (p[cle] === undefined || p[cle] === '') { return defaut; }
        return String(p[cle]) === 'true';
    };

    var FAIM_MAX       = nb('faimMax', 100);
    var FAIM_DEPART    = nb('faimDepart', 0);
    var VAR_FAIM       = nb('varFaim', 50);
    var VAR_SOCLE      = nb('varSocle', 60);

    var SOCLE_DEPART   = nb('socleDepart', 0);
    var SOCLE_MAX      = nb('socleMax', 70);
    var SOCLE_MAUVAIS  = nb('soclePourMauvais', 2);
    var SOCLE_SURPLUS  = nb('soclePourSurplus', 1);
    var TRANCHE        = nb('trancheSurplus', 10);
    var SOCLE_BRANCHE  = nb('soclePourBranche', 3);

    var PAS_PAR_FAIM   = nb('pasParFaim', 40);
    var FAIM_COMBAT    = nb('faimParCombat', 3);
    var NUIT_FACTEUR   = nb('nuitFacteur', 200) / 100;
    var SW_NUIT        = nb('interrupteurNuit', 20);

    var SEUIL_FREM     = nb('seuilFremissement', 40);
    var SEUIL_FIEVRE   = nb('seuilFievre', 70);
    var ETAT_CALME     = nb('etatCalme', 9);
    var ETAT_FREM      = nb('etatFremissement', 10);
    var ETAT_FIEVRE    = nb('etatFievre', 11);
    var ETAT_MUE       = nb('etatMue', 0);
    var SW_MUE         = nb('interrupteurMue', 21);

    var ANNONE_CIBLE   = nb('annoneCible', 35);

    var ARTICLE_I      = bl('appliquerArticleI', false);
    var CERCLE_DEPART  = nb('cercleDepart', 8);

    var DIRE_STADES    = bl('direLesStades', true);

    // La pureté : ce qui tient, et sur combien de pas le reste revient.
    // Le sang des racines « comble la faim pendant quelques heures ».
    var PURETES = {
        racine:  { durable: 0.30, pas: 600,  cercle: 9, socle: 0 },
        puits:   { durable: 0.50, pas: 900,  cercle: 5, socle: 0 },
        tronc:   { durable: 0.75, pas: 1200, cercle: 3, socle: 0 },
        branche: { durable: 1.00, pas: 0,    cercle: 1, socle: SOCLE_BRANCHE }
    };
    var PURETE_DEFAUT = 'racine';

    var STADES = [null, 'Le Calme', 'Le Frémissement', 'La Fièvre', 'la Mue'];

    //-----------------------------------------------------------------------
    //  Lecture des notetags — une seule fois, au chargement de la base
    //-----------------------------------------------------------------------

    // Piège MV : la métadonnée garde l'espace après le « : ». trim() partout.
    function meta(objet, cle) {
        if (!objet || !objet.meta) { return null; }
        var v = objet.meta[cle];
        if (v === undefined) { return null; }
        return v === true ? true : String(v).trim();
    }

    var _ETT_Faim_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!_ETT_Faim_DataManager_isDatabaseLoaded.call(this)) { return false; }
        if (!ETT.Faim._baseLue) {
            ETT.Faim._baseLue = true;
            [$dataItems, $dataWeapons, $dataArmors].forEach(function (liste) {
                lireAliments(liste);
            });
            lireCompetences($dataSkills);
        }
        return true;
    };

    function lireAliments(liste) {
        if (!liste) { return; }
        for (var i = 1; i < liste.length; i++) {
            var o = liste[i];
            if (!o) { continue; }
            var n = meta(o, 'nourrit');
            if (n === null) { continue; }
            var purete = meta(o, 'purete');
            purete = purete && PURETES[purete] ? purete : PURETE_DEFAUT;
            o._ettAliment = {
                nourrit: Number(n) || 0,
                purete:  purete,
                mauvais: meta(o, 'mauvais') !== null,
                boost:   Number(meta(o, 'boost')) || 0
            };
        }
    }

    function lireCompetences(liste) {
        if (!liste) { return; }
        for (var i = 1; i < liste.length; i++) {
            var o = liste[i];
            if (!o) { continue; }
            var f = meta(o, 'faim');
            if (f !== null) { o._ettFaimCout = Number(f) || 0; }
        }
    }

    //-----------------------------------------------------------------------
    //  Le stockage — sur $gameSystem, donc sauvegardé
    //-----------------------------------------------------------------------

    // Jamais supposer qu'une propriété existe : on la crée à la LECTURE, pas
    // seulement à initialize(). Sinon une partie sauvegardée avant ce plugin
    // plante au chargement.
    Game_System.prototype.ettFaimDossier = function (actorId) {
        if (!this._ettFaim) { this._ettFaim = {}; }
        if (!this._ettFaim[actorId]) {
            this._ettFaim[actorId] = {
                faim:   FAIM_DEPART,
                socle:  SOCLE_DEPART,
                cercle: CERCLE_DEPART,
                stade:  0,
                tmpReste: 0,   // ce qui n'était pas durable et qui va revenir
                tmpPas:   0    // sur combien de pas
            };
        }
        return this._ettFaim[actorId];
    };

    Game_System.prototype.ettFaimPas = function () {
        if (this._ettFaimPas === undefined) { this._ettFaimPas = 0; }
        return this._ettFaimPas;
    };

    //-----------------------------------------------------------------------
    //  L'API
    //-----------------------------------------------------------------------

    function borne(v, mini, maxi) {
        return Math.max(mini, Math.min(maxi, v));
    }

    function dossier(actorId) {
        return $gameSystem.ettFaimDossier(actorId);
    }

    ETT.Faim.valeur = function (actorId) {
        return dossier(actorId).faim;
    };

    ETT.Faim.socle = function (actorId) {
        return dossier(actorId).socle;
    };

    ETT.Faim.cercle = function (actorId) {
        return dossier(actorId).cercle;
    };

    ETT.Faim.max = function () {
        return FAIM_MAX;
    };

    ETT.Faim.estNuit = function () {
        return SW_NUIT > 0 && $gameSwitches && $gameSwitches.value(SW_NUIT);
    };

    ETT.Faim.stade = function (actorId) {
        var f = dossier(actorId).faim;
        if (f >= FAIM_MAX)     { return 4; }
        if (f >= SEUIL_FIEVRE) { return 3; }
        if (f >= SEUIL_FREM)   { return 2; }
        return 1;
    };

    ETT.Faim.nomStade = function (actorId) {
        return STADES[ETT.Faim.stade(actorId)];
    };

    /** Monte la faim. La nuit, tout descend plus vite. */
    ETT.Faim.ajouter = function (actorId, n, ignorerNuit) {
        if (!(n > 0)) { return; }
        var d = dossier(actorId);
        var gain = n;
        if (!ignorerNuit && ETT.Faim.estNuit()) {
            gain = Math.ceil(gain * NUIT_FACTEUR);
        }
        d.faim = borne(d.faim + gain, d.socle, FAIM_MAX);
        ETT.Faim.rafraichir(actorId);
    };

    /** Monte le socle — la faim qu'aucun repas ne comblera plus. */
    ETT.Faim.monterSocle = function (actorId, n) {
        if (!(n > 0)) { return; }
        var d = dossier(actorId);
        d.socle = borne(d.socle + n, 0, Math.min(SOCLE_MAX, FAIM_MAX));
        if (d.faim < d.socle) { d.faim = d.socle; }
        ETT.Faim.rafraichir(actorId);
    };

    /**
     * Nourrit un porteur.
     * Retourne { pris, surplus, refuse } — « pris » est ce qui a servi.
     */
    ETT.Faim.nourrir = function (actorId, n, purete, mauvais) {
        var d = dossier(actorId);
        var res = { pris: 0, surplus: 0, refuse: false };
        if (!(n > 0)) { return res; }

        var cle = purete && PURETES[purete] ? purete : PURETE_DEFAUT;
        var P = PURETES[cle];

        // Article I — « Nul ne boit au-dessus de son rang. »
        if (ARTICLE_I && d.cercle > P.cercle) {
            res.refuse = true;
            return res;
        }

        // Ce qui manquait réellement, socle compris : on ne descend jamais
        // sous le socle, quoi qu'on avale.
        var manquait = Math.max(0, d.faim - d.socle);
        res.pris    = Math.min(n, manquait);
        res.surplus = n - res.pris;

        // La part durable reste enlevée ; le reste revient au fil des pas.
        var durable = Math.floor(res.pris * P.durable);
        var revient = res.pris - durable;

        d.faim = borne(d.faim - res.pris, d.socle, FAIM_MAX);
        if (revient > 0 && P.pas > 0) {
            d.tmpReste += revient;
            d.tmpPas = Math.max(d.tmpPas, P.pas);
        }

        // Les trois causes écrites de la montée du socle.
        if (mauvais)            { ETT.Faim.monterSocle(actorId, SOCLE_MAUVAIS); }
        if (P.socle > 0)        { ETT.Faim.monterSocle(actorId, P.socle); }
        if (res.surplus > 0 && TRANCHE > 0) {
            var tranches = Math.floor(res.surplus / TRANCHE);
            if (tranches > 0) { ETT.Faim.monterSocle(actorId, tranches * SOCLE_SURPLUS); }
        }

        ETT.Faim.rafraichir(actorId);
        return res;
    };

    /** L'Annone : gratuite, de droit — et calibrée pour ne pas suffire. */
    ETT.Faim.annone = function () {
        if (!$gameParty) { return; }
        $gameParty.members().forEach(function (acteur) {
            var d = dossier(acteur.actorId());
            var cible = Math.max(ANNONE_CIBLE, d.socle);
            if (d.faim > cible) {
                d.faim = cible;
                ETT.Faim.rafraichir(acteur.actorId());
            }
        });
    };

    ETT.Faim.fixerCercle = function (actorId, n) {
        dossier(actorId).cercle = borne(Math.floor(n), 1, 9);
    };

    //-----------------------------------------------------------------------
    //  Les stades : un seul état à la fois, le plus haut atteint
    //-----------------------------------------------------------------------

    var _enRafraichissement = false;

    ETT.Faim.etatDuStade = function (stade) {
        switch (stade) {
            case 1: return ETAT_CALME;
            case 2: return ETAT_FREM;
            case 3: return ETAT_FIEVRE;
            case 4: return ETAT_MUE;
        }
        return 0;
    };

    ETT.Faim.rafraichir = function (actorId) {
        // Poser un état appelle refresh(), qui pourrait rappeler ici : garde.
        if (_enRafraichissement) { return; }
        var acteur = $gameActors ? $gameActors.actor(actorId) : null;
        if (!acteur) { return; }

        var d = dossier(actorId);
        var stade = ETT.Faim.stade(actorId);
        var ancien = d.stade;

        _enRafraichissement = true;
        try {
            for (var s = 1; s <= 4; s++) {
                var id = ETT.Faim.etatDuStade(s);
                if (!id || !$dataStates || !$dataStates[id]) { continue; }
                if (s === stade) {
                    if (!acteur.isStateAffected(id)) { acteur.addState(id); }
                } else if (acteur.isStateAffected(id)) {
                    acteur.removeState(id);
                }
            }
        } finally {
            _enRafraichissement = false;
        }

        if (stade !== ancien) {
            d.stade = stade;
            if (stade === 4 && SW_MUE > 0 && $gameSwitches) {
                $gameSwitches.setValue(SW_MUE, true);
            }
            if (DIRE_STADES && ancien !== 0 && $gameMessage && !$gameMessage.isBusy()) {
                // On ne parle qu'au changement, jamais en boucle.
                var texte = stade > ancien
                    ? acteur.name() + ' — ' + STADES[stade] + '.'
                    : acteur.name() + ' revient au ' + STADES[stade] + '.';
                if ($gameParty && $gameParty.inBattle() && typeof BattleManager !== 'undefined' &&
                    BattleManager._logWindow && BattleManager._logWindow.push) {
                    BattleManager._logWindow.push('addText', texte);
                }
            }
        }

        ETT.Faim.recopierVariables(actorId);
    };

    /** Recopie dans les variables, pour que les événements lisent sans script. */
    ETT.Faim.recopierVariables = function (actorId) {
        if (!$gameVariables) { return; }
        var d = dossier(actorId);
        var rang = actorId - 1;
        if (VAR_FAIM > 0)  { $gameVariables.setValue(VAR_FAIM + rang, d.faim); }
        if (VAR_SOCLE > 0) { $gameVariables.setValue(VAR_SOCLE + rang, d.socle); }
    };

    ETT.Faim.rafraichirGroupe = function () {
        if (!$gameParty) { return; }
        $gameParty.members().forEach(function (a) { ETT.Faim.rafraichir(a.actorId()); });
    };

    //-----------------------------------------------------------------------
    //  La marche — et le retour de ce qui n'était pas durable
    //-----------------------------------------------------------------------

    var _ETT_Faim_Game_Party_increaseSteps = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function () {
        _ETT_Faim_Game_Party_increaseSteps.call(this);
        if (PAS_PAR_FAIM <= 0) { return; }

        $gameSystem._ettFaimPas = $gameSystem.ettFaimPas() + 1;

        // Le rassasiement temporaire s'use à chaque pas.
        this.members().forEach(function (acteur) {
            var d = dossier(acteur.actorId());
            if (d.tmpReste > 0 && d.tmpPas > 0) {
                var parPas = d.tmpReste / d.tmpPas;
                d._tmpAccu = (d._tmpAccu || 0) + parPas;
                d.tmpPas -= 1;
                if (d._tmpAccu >= 1) {
                    var rendu = Math.floor(d._tmpAccu);
                    d._tmpAccu -= rendu;
                    rendu = Math.min(rendu, d.tmpReste);
                    d.tmpReste -= rendu;
                    d.faim = borne(d.faim + rendu, d.socle, FAIM_MAX);
                    ETT.Faim.rafraichir(acteur.actorId());
                }
                if (d.tmpPas <= 0) {
                    // Le repas a fini de se dissiper : tout le reste revient.
                    if (d.tmpReste > 0) {
                        d.faim = borne(d.faim + d.tmpReste, d.socle, FAIM_MAX);
                        ETT.Faim.rafraichir(acteur.actorId());
                    }
                    d.tmpReste = 0;
                    d._tmpAccu = 0;
                }
            }
        });

        if ($gameSystem._ettFaimPas >= PAS_PAR_FAIM) {
            $gameSystem._ettFaimPas = 0;
            this.members().forEach(function (acteur) {
                ETT.Faim.ajouter(acteur.actorId(), 1);
            });
        }
    };

    //-----------------------------------------------------------------------
    //  Le combat
    //-----------------------------------------------------------------------

    var _ETT_Faim_BattleManager_startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _ETT_Faim_BattleManager_startBattle.call(this);
        ETT.Faim.rafraichirGroupe();
    };

    var _ETT_Faim_BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        if (FAIM_COMBAT > 0 && $gameParty) {
            $gameParty.members().forEach(function (acteur) {
                ETT.Faim.ajouter(acteur.actorId(), FAIM_COMBAT);
            });
        }
        _ETT_Faim_BattleManager_endBattle.call(this, result);
    };

    //-----------------------------------------------------------------------
    //  Manger, et puiser
    //-----------------------------------------------------------------------

    // Game_Action.apply couvre les deux chemins : l'objet utilisé au menu
    // (Scene_ItemBase.applyItem) ET l'action jouée en combat.
    var _ETT_Faim_Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _ETT_Faim_Game_Action_apply.call(this, target);

        var objet = this.item();
        if (!objet) { return; }

        // L'aliment nourrit sa CIBLE.
        if (objet._ettAliment && target && target.isActor && target.isActor()) {
            var a = objet._ettAliment;
            var r = ETT.Faim.nourrir(target.actorId(), a.nourrit, a.purete, a.mauvais);
            if (!r.refuse && a.boost > 0 && $dataStates && $dataStates[a.boost]) {
                target.addState(a.boost);
            }
        }

        // La compétence qui puise creuse son LANCEUR.
        if (objet._ettFaimCout > 0) {
            var lanceur = this.subject();
            if (lanceur && lanceur.isActor && lanceur.isActor()) {
                ETT.Faim.ajouter(lanceur.actorId(), objet._ettFaimCout);
            }
        }
    };

    //-----------------------------------------------------------------------
    //  Commandes de plugin
    //-----------------------------------------------------------------------

    function cibles(argument) {
        var mot = String(argument || '').toLowerCase();
        if (mot === 'groupe' || mot === 'tous') {
            if (!$gameParty) { return []; }
            return $gameParty.members().map(function (a) { return a.actorId(); });
        }
        var id = Number(argument);
        return id > 0 ? [id] : [];
    }

    var _ETT_Faim_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _ETT_Faim_Game_Interpreter_pluginCommand.call(this, command, args);
        if (command !== 'FAIM') { return; }

        var sousVerbe = String(args[0] || '').toLowerCase();
        var liste, n;

        switch (sousVerbe) {
            case 'ajouter':
                liste = cibles(args[1]);
                n = Number(args[2]) || 0;
                liste.forEach(function (id) { ETT.Faim.ajouter(id, n); });
                break;
            case 'nourrir':
                liste = cibles(args[1]);
                n = Number(args[2]) || 0;
                liste.forEach(function (id) { ETT.Faim.nourrir(id, n, args[3]); });
                break;
            case 'socle':
                liste = cibles(args[1]);
                n = Number(args[2]) || 0;
                liste.forEach(function (id) { ETT.Faim.monterSocle(id, n); });
                break;
            case 'annone':
                ETT.Faim.annone();
                break;
            case 'cercle':
                liste = cibles(args[1]);
                n = Number(args[2]) || 0;
                liste.forEach(function (id) { ETT.Faim.fixerCercle(id, n); });
                break;
            case 'etat':
                if ($gameParty) {
                    $gameParty.members().forEach(function (a) {
                        var id = a.actorId();
                        console.log(a.name() + ' — faim ' + ETT.Faim.valeur(id) + '/' + FAIM_MAX +
                            ' · socle ' + ETT.Faim.socle(id) +
                            ' · stade ' + ETT.Faim.stade(id) + ' (' + ETT.Faim.nomStade(id) + ')' +
                            ' · cercle ' + ETT.Faim.cercle(id));
                    });
                }
                break;
            default:
                // Une commande inconnue ne plante pas : on sort en silence.
                break;
        }
    };

    //-----------------------------------------------------------------------
    //  Mise en place au démarrage d'une partie
    //-----------------------------------------------------------------------

    var _ETT_Faim_Game_Party_setupStartingMembers = Game_Party.prototype.setupStartingMembers;
    Game_Party.prototype.setupStartingMembers = function () {
        _ETT_Faim_Game_Party_setupStartingMembers.call(this);
        ETT.Faim.rafraichirGroupe();
    };

    // Pour les bancs d'essai : la table de pureté, en lecture.
    ETT.Faim.puretes = PURETES;

})();
