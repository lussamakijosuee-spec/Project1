//=============================================================================
// VieDuVillage.js — v1.1  ·  Les PNJ ont une journée
// RPG Maker MV   ·   by JOKO
//   À charger APRÈS MOG_TimeSystem (il lui demande l'heure).
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les PNJ ont un poste, un logis, et des heures : ils
 * sortent le matin, travaillent, flânent le soir, et rentrent dormir.
 * @author JOKO
 *
 * @param actif
 * @text Faire vivre les PNJ ?
 * @type boolean
 * @default true
 *
 * @param cartes
 * @text Cartes concernées
 * @type string
 * @default 33
 * @desc Les numéros de carte, séparés par des virgules. Vide = toutes les cartes.
 *
 * @param pasParImage
 * @text Un PNJ examiné toutes les N images
 * @type number
 * @min 1
 * @default 6
 * @desc On ne recalcule qu'un PNJ à la fois : vingt-six chemins par image feraient ramer.
 *
 * @param portee
 * @text Portée de recherche de chemin
 * @type number
 * @min 8
 * @max 60
 * @default 30
 *
 * @param flanerie
 * @text Rayon de flânerie autour du but
 * @type number
 * @min 0
 * @default 2
 * @desc Une fois arrivé, le PNJ ne reste pas figé : il bouge un peu autour.
 *
 * @param rentrerSousLaPluie
 * @text Rentrer quand il pleut ?
 * @type boolean
 * @default true
 *
 * @param jourDeRepos
 * @text Jour de repos (0 = dimanche, 6 = samedi, -1 = aucun)
 * @type number
 * @min -1
 * @max 6
 * @default 0
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES PNJ ONT UNE JOURNÉE                                            by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Un PNJ n'est pas un meuble qui parle. Celui-ci a trois endroits et des
 *  heures :
 *
 *    SON POSTE  — là où il se tient le jour. C'est la case où JOKO l'a posé
 *                 dans l'éditeur : le plugin ne déplace personne, il prend la
 *                 position de départ comme poste. Rien n'est à régler.
 *    SON LOGIS  — la porte la plus proche de son poste. Le soir il y va, et
 *                 il entre : il disparaît jusqu'au matin.
 *    LA PLACE   — le centre du village, calculé sur l'ensemble des PNJ. C'est
 *                 là qu'on se retrouve à midi et le soir.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LES QUATRE FAÇONS DE VIVRE
 *  ─────────────────────────────────────────────────────────────────────────
 *   ▶ VILLAGEOIS (par défaut)
 *       6 h  il sort · 8 h-12 h au poste · 12 h la place · 13 h-18 h au poste
 *       18 h-21 h il flâne · 21 h il rentre et disparaît
 *   ▶ GARDE  (garde_ville, recrue, chevalier, veteran, capitaine)
 *       Il ne rentre jamais. Le jour il tient son poste, la nuit il fait sa
 *       ronde entre son poste et la place. Quelqu'un doit veiller.
 *   ▶ SÉDENTAIRE  (marchand, forgeron, aubergiste, guerisseur, banquier,
 *                  roi, reine, chambellan, maitre_arme)
 *       7 h-20 h derrière son comptoir, sans bouger. Puis il rentre.
 *       Sa boutique n'est pas un endroit qu'on quitte à midi.
 *   ▶ NOCTAMBULE  (ivrogne, mendiant, fossoyeur, voleur)
 *       Il vit à l'envers : la place le soir et la nuit, son logis le matin.
 *
 *  SON AGENDA (v1.1) — un COMMENTAIRE sur sa page :
 *      <Agenda: 12-14 20,15 ; 18-21 14,32>   de 12 h à 14 h il va en 20,15 ;
 *                    de 18 h à 21 h en 14,32. Si la case est une PORTE, il
 *                    entre et disparaît (il est « au bar »). Une sortie de
 *                    carte (un transfert) aussi : il part « au marché ».
 *      <Soiree: 14,32>   raccourci : de 18 h à 21 h, il va à cette porte.
 *      <Logis: 7,24>     sa porte à lui, au lieu de la plus proche.
 *
 *  Pour ranger un PNJ ailleurs, un COMMENTAIRE sur sa page :
 *      <Vie: garde>   <Vie: sedentaire>   <Vie: noctambule>   <Vie: villageois>
 *      <Vie: fixe>    il ne bouge plus du tout — pour les statues et les
 *                     PNJ d'histoire qu'on ne veut pas voir partir.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  CE QUI CHANGE LA JOURNÉE
 *  ─────────────────────────────────────────────────────────────────────────
 *   · LA PLUIE — sous l'averse ou la tempête, tout le monde sauf les gardes
 *     coupe court et rentre. Le village se vide, et ça se voit.
 *   · LE JOUR DE REPOS — le dimanche, personne ne travaille : on flâne, on
 *     traîne sur la place. Les gardes, eux, gardent.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  CE QUE LE PLUGIN NE TOUCHE PAS
 *  ─────────────────────────────────────────────────────────────────────────
 *  Aucune carte, aucun événement, aucune donnée n'est réécrite. Le plugin lit
 *  la position de départ et les portes, et pilote le déplacement en jeu. Un
 *  PNJ qu'on interpelle s'arrête et parle normalement ; dès que le dialogue
 *  est fini, il reprend sa journée.
 *
 *  SCRIPT :  VieDuVillage.etat()      → ce que chacun fait, là, maintenant
 *            VieDuVillage.heure()     → l'heure que le plugin emploie
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('VieDuVillage');
    // ⚠ Les booléens de PluginManager arrivent en TEXTE : String(false) vaut
    // « false », qui est truthy. On compare la chaîne.
    var ACTIF = String(P['actif'] || 'true') === 'true';
    var PLUIE = String(P['rentrerSousLaPluie'] || 'true') === 'true';
    var CARTES = String(P['cartes'] || '').split(',')
        .map(function (x) { return parseInt(x, 10); })
        .filter(function (x) { return x > 0; });
    var PAS = Math.max(1, parseInt(P['pasParImage'] || 6));
    var PORTEE = Math.max(8, parseInt(P['portee'] || 30));
    var FLANERIE = Math.max(0, parseInt(P['flanerie'] || 2));
    var REPOS = parseInt(P['jourDeRepos'] !== undefined ? P['jourDeRepos'] : 0);

    /* ── les façons de vivre ───────────────────────────────────────────── */
    var METIERS = {
        garde: ['garde_ville', 'garde', 'recrue', 'chevalier', 'veteran', 'capitaine', 'sentinelle'],
        sedentaire: ['marchand', 'muta', 'forgeron', 'guerisseur', 'aubergiste', 'banquier',
                     'maitre_arme', 'roi', 'reine', 'chambellan', 'selena', 'dame_elara',
                     'regis', 'quentin', 'tenancier', 'pretre'],
        noctambule: ['ivrogne', 'mendiant', 'fossoyeur', 'voleur', 'rodeur']
    };
    function metierDe(cle) {
        var c = String(cle || '').toLowerCase();
        var out = 'villageois';
        Object.keys(METIERS).forEach(function (m) {
            if (METIERS[m].indexOf(c) >= 0) { out = m; }
        });
        return out;
    }

    /** Où ce PNJ doit-il être à cette heure ? Rend un lieu et une humeur. */
    function ouAller(vie, h, repos, pluie) {
        if (vie.metier === 'fixe') { return { lieu: 'poste', dedans: false }; }

        if (vie.metier === 'garde') {
            // il ne rentre jamais, et la pluie ne l'excuse pas
            if (h >= 22 || h < 5) { return { lieu: 'place', dedans: false }; }   // la ronde
            return { lieu: 'poste', dedans: false };
        }

        // la pluie renvoie tout le monde chez soi, sauf en pleine nuit où ils
        // y sont déjà
        if (pluie && PLUIE) { return { lieu: 'logis', dedans: true }; }

        if (vie.metier === 'noctambule') {
            if (h >= 18 || h < 3) { return { lieu: 'place', dedans: false }; }
            if (h < 11) { return { lieu: 'logis', dedans: true }; }
            return { lieu: 'place', dedans: false };
        }

        if (h < 6 || h >= 21) { return { lieu: 'logis', dedans: true }; }
        if (h < 8) { return { lieu: 'poste', dedans: false }; }       // il sort, il marche

        if (repos) {
            // jour de repos : on ne travaille pas, on traîne
            return { lieu: h >= 18 ? 'place' : (h >= 10 ? 'place' : 'poste'), dedans: false };
        }

        if (vie.metier === 'sedentaire') {
            return { lieu: (h >= 7 && h < 20) ? 'poste' : 'logis', dedans: !(h >= 7 && h < 20) };
        }

        if (h === 12) { return { lieu: 'place', dedans: false }; }     // le repas
        if (h < 18) { return { lieu: 'poste', dedans: false };  }
        return { lieu: 'place', dedans: false };                       // la soirée
    }

    /* ── lire la carte : qui est un PNJ, où sont les portes ─────────────── */

    /** La clé <NPC: …> et la façon de vivre <Vie: …>, lues dans les
     *  commentaires de la page — c'est là que LivingNPC les attend aussi. */
    function marques(evenement) {
        var out = { cle: null, vie: null, agenda: [], logis: null };
        var page = evenement.page && evenement.page();
        if (!page || !page.list) { return out; }
        page.list.forEach(function (c) {
            if (!c || (c.code !== 108 && c.code !== 408)) { return; }
            var t = String(c.parameters[0] || '');
            var a = t.match(/<NPC:\s*([^>]+)>/i);
            if (a) { out.cle = a[1].trim(); }
            var b = t.match(/<Vie:\s*([^>]+)>/i);
            if (b) { out.vie = b[1].trim().toLowerCase(); }
            // <Agenda: 12-14 20,15 ; 18-21 14,32>  — à ces heures-là, il va là
            var g = t.match(/<Agenda:\s*([^>]+)>/i);
            if (g) {
                g[1].split(';').forEach(function (morceau) {
                    var r = morceau.match(/(\d+)\s*-\s*(\d+)\s+(\d+)\s*,\s*(\d+)/);
                    if (r) { out.agenda.push({ de: +r[1], a: +r[2], x: +r[3], y: +r[4] }); }
                });
            }
            // <Soiree: 14,32>  — de 18 h à 21 h, il va là (une porte : il entre)
            var so = t.match(/<Soir[ée]e:\s*(\d+)\s*,\s*(\d+)\s*>/i);
            if (so) { out.agenda.push({ de: 18, a: 21, x: +so[1], y: +so[2] }); }
            // <Logis: 7,24>  — sa porte à lui, au lieu de la plus proche
            var lg = t.match(/<Logis:\s*(\d+)\s*,\s*(\d+)\s*>/i);
            if (lg) { out.logis = { x: +lg[1], y: +lg[2] }; }
        });
        return out;
    }

    function estPorte(evenement) {
        var page = evenement.page && evenement.page();
        var nom = page && page.image ? String(page.image.characterName || '') : '';
        return /door/i.test(nom);
    }

    function recenser() {
        var pnj = [], portes = [];
        $gameMap.events().forEach(function (e) {
            if (!e || e._erased) { return; }
            if (estPorte(e)) { portes.push({ x: e.x, y: e.y }); return; }
            var m = marques(e);
            if (!m.cle && !m.vie) { return; }        // seuls les PNJ marqués vivent
            pnj.push({ ev: e, cle: m.cle, vieDite: m.vie, agenda: m.agenda, logisDit: m.logis });
        });
        if (!pnj.length) { return null; }

        // la place : le centre de gravité des postes
        var sx = 0, sy = 0;
        pnj.forEach(function (p) { sx += p.ev.x; sy += p.ev.y; });
        var place = { x: Math.round(sx / pnj.length), y: Math.round(sy / pnj.length) };

        pnj.forEach(function (p) {
            var poste = { x: p.ev.x, y: p.ev.y };
            // le logis : la porte la plus proche du poste. Sans porte sur la
            // carte, on rentre « chez soi » là où on était : le PNJ disparaît
            // sur place plutôt que de traverser le village pour rien.
            var logis = poste;
            var d = Infinity;
            portes.forEach(function (q) {
                var dd = Math.abs(q.x - poste.x) + Math.abs(q.y - poste.y);
                if (dd < d) { d = dd; logis = q; }
            });
            if (p.logisDit) { logis = p.logisDit; }
            p.ev._vie = {
                cle: p.cle, metier: p.vieDite || metierDe(p.cle),
                poste: poste, logis: logis, place: place,
                agenda: p.agenda || [], portes: portes,
                dedans: false, but: null
            };
        });
        return { pnj: pnj, portes: portes, place: place };
    }

    /* ── le pilote ─────────────────────────────────────────────────────── */

    function carteConcernee() {
        if (!$gameMap) { return false; }
        return CARTES.length === 0 || CARTES.indexOf($gameMap.mapId()) >= 0;
    }
    function heure() {
        return ($gameSystem && typeof $gameSystem.hour === 'function') ? $gameSystem.hour() : 12;
    }
    function jourDeRepos() {
        if (REPOS < 0) { return false; }
        return !!($gameSystem && typeof $gameSystem.day_week === 'function'
            && $gameSystem.day_week() === REPOS);
    }
    function ilPleut() {
        if (!$gameScreen) { return false; }
        var t = $gameScreen.weatherType();
        return t === 'rain' || t === 'storm';
    }

    /** Un pas vers (x,y). MV borne sa recherche de chemin très court par
     *  défaut (douze cases) : sur un village de quarante de côté, un PNJ
     *  n'aurait jamais trouvé sa porte. On élargit le temps du calcul. */
    // ⚠ 2026-09-30 : un PNJ bloqué (porte encombrée, joueur en travers)
    //   relançait une recherche de chemin toutes les six images, sans fin. La
    //   recherche de MV est lente : on attend un peu avant de réessayer, et
    //   pas plus de quatre recherches par image pour tout le village.
    function unPasVers(ev, x, y) {
        if (ev.isMoving()) { return; }
        if (ev.x === x && ev.y === y) { return; }
        if (ev._vieAttente > 0) { ev._vieAttente--; return; }
        if ($gameMap._vieBudget <= 0) { return; }
        $gameMap._vieBudget--;
        var d;
        if (window.Habitants && Habitants.directionVers) {
            // la carte des distances de Habitants : une lecture de tableau
            d = Habitants.directionVers(ev, x, y);
        } else {
            var ancien = ev.searchLimit;
            ev.searchLimit = function () { return PORTEE; };
            d = ev.findDirectionTo(x, y);
            ev.searchLimit = ancien;
        }
        if (d > 0) { ev.moveStraight(d); }
        else { ev.moveTowardCharacter({ x: x, y: y, isMoving: function () { return false; } }); }
        if (!ev.isMovementSucceeded()) { ev._vieAttente = 3 + Math.randomInt(5); }
    }

    function agendaDe(v, h) {
        var r = null;
        (v.agenda || []).forEach(function (a) {
            var dedans = a.de <= a.a ? (h >= a.de && h < a.a) : (h >= a.de || h < a.a);
            if (dedans) { r = a; }
        });
        return r;
    }

    function piloter(ev) {
        var v = ev._vie;
        if (!v || v.metier === 'fixe') { return; }

        // ⚠ Un PNJ à qui l'on parle ne s'en va pas au milieu de sa phrase.
        //   `EvenementsUtiles` pose ce sursis sur « NPC talk <nom> » ; il
        //   retombe de lui-même dès que l'événement se tait.
        if (ev._pauseConversation > 0) { return; }

        var but = ouAller(v, heure(), jourDeRepos(), ilPleut());
        var cible = v[but.lieu] || v.poste;
        v.but = but.lieu;
        // son agenda passe avant la journée type (sauf la pluie et la nuit
        // des gardes) : à telle heure, il va à tel endroit ; si c'est une
        // porte, il entre.
        var ag = agendaDe(v, heure());
        if (ag && !(ilPleut() && PLUIE && v.metier !== 'garde')) {
            // une porte, ou une sortie de carte (un transfert) : il y entre
            var porte = v.portes.some(function (q) { return q.x === ag.x && q.y === ag.y; }) ||
                $gameMap.eventsXy(ag.x, ag.y).some(function (e) { return e !== ev && e.event().pages.some(function (pg) { return pg.list.some(function (c) { return c.code === 201; }); }); });
            cible = { x: ag.x, y: ag.y };
            but = { lieu: 'agenda', dedans: porte };
            v.but = porte ? 'entre ' + ag.x + ',' + ag.y : 'agenda ' + ag.x + ',' + ag.y;
        }

        // ── entrer et sortir du logis ──
        // ⚠ On ne se tient JAMAIS sur la case d'une porte : la porte est un
        // événement, et deux événements ne partagent pas une case. Un PNJ qui
        // devait « arriver sur » sa porte n'y arrivait jamais, donc personne ne
        // rentrait jamais chez soi. Être devant sa porte, c'est être rentré.
        var surLePas = Math.abs(ev.x - cible.x) + Math.abs(ev.y - cible.y) <= 1;
        if (but.dedans && surLePas) {
            if (!v.dedans) {
                v.dedans = true;
                ev.setOpacity(0);
                ev.setThrough(true);
            }
            return;
        }
        if (v.dedans && !but.dedans) {
            v.dedans = false;
            ev.setOpacity(255);
            ev.setThrough(false);
        }
        if (v.dedans) { return; }      // il dort, on ne le dérange pas

        // ── arrivé : il flâne un peu, il ne se fige pas ──
        var dist = Math.abs(ev.x - cible.x) + Math.abs(ev.y - cible.y);
        if (dist === 0) {
            if (FLANERIE > 0 && !ev.isMoving() && Math.random() < 0.25) { ev.moveRandom(); }
            return;
        }
        if (dist <= FLANERIE && but.lieu !== 'logis') {
            if (!ev.isMoving() && Math.random() < 0.35) { ev.moveRandom(); }
            return;
        }
        unPasVers(ev, cible.x, cible.y);
    }

    /* ── l'accroche à la carte ──────────────────────────────────────────── */
    var _setup = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function () {
        _setup.call(this);
        // ⚠ Vider la LISTE, pas seulement le drapeau. Sans ça, en passant sur
        // une carte hors de la liste, le recensement ne repassait pas et
        // $gameMap._viePNJ gardait les PNJ du village précédent : le plugin
        // semblait piloter douze personnes sur une carte qui n'en a aucune.
        this._vieRecensee = false;
        this._viePNJ = [];
        this._vieIndex = 0;
    };

    var _maj = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _maj.call(this);
        if (!ACTIF || !$gameMap || !$gamePlayer) { return; }
        if (!carteConcernee()) { return; }
        if ($gameMessage.isBusy() || $gameMap.isEventRunning()) { return; }

        if (!$gameMap._vieRecensee) {
            $gameMap._vieRecensee = true;
            $gameMap._vieIndex = 0;
            var r = recenser();
            $gameMap._viePNJ = r ? r.pnj.map(function (p) { return p.ev; }) : [];
            // on coupe le déplacement automatique de MV : deux pilotes sur le
            // même PNJ se battraient pour le volant.
            ($gameMap._viePNJ || []).forEach(function (e) {
                // vitesse 4 = le pas normal. À 3 ils traînaient, et traverser
                // le village leur prenait une éternité.
                if (e._vie && e._vie.metier !== 'fixe') { e._moveType = 0; e.setMoveSpeed(4); }
            });
        }

        var liste = $gameMap._viePNJ || [];
        if (!liste.length) { return; }
        $gameMap._vieBudget = 4;
        this._vieT = (this._vieT || 0) + 1;
        if (this._vieT < PAS) { return; }
        this._vieT = 0;

        // On passe sur TOUS les PNJ, mais on ne calcule un chemin que pour ceux
        // qui ont fini leur pas — c'est là qu'est le coût, et un PNJ en train de
        // marcher n'a rien à décider.
        //
        // ⚠ La première version n'en pilotait qu'UN par tour de rôle : avec
        // douze PNJ, chacun ne recevait un pas que toutes les 1,2 seconde, donc
        // traverser le village lui prenait un quart de minute et personne
        // n'arrivait jamais nulle part. Le banc l'a vu tout de suite : cinq
        // villageois visaient leur logis à 22 h, aucun ne l'atteignait.
        liste.forEach(function (ev) {
            if (!ev || ev._erased) { return; }
            if (ev.isMoving()) { return; }
            piloter(ev);
        });
    };

    /* ── de quoi regarder ce qui se passe ──────────────────────────────── */
    window.VieDuVillage = {
        heure: heure,
        repos: jourDeRepos,
        pluie: ilPleut,
        etat: function () {
            if (!carteConcernee()) { return []; }
            return ($gameMap && $gameMap._viePNJ || []).map(function (e) {
                var v = e._vie || {};
                return {
                    id: e.eventId(), cle: v.cle, metier: v.metier,
                    x: e.x, y: e.y, but: v.but, dedans: !!v.dedans, agenda: v.agenda,
                    poste: v.poste, logis: v.logis, place: v.place
                };
            });
        }
    };
})();
