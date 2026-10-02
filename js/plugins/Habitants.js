//=============================================================================
// Habitants.js — v1.2  ·  Les gens vivent leur vie
// RPG Maker MV   ·   pour JOKO
//   À charger APRÈS MOG_TimeSystem (il lui demande l'heure et la saison).
//=============================================================================
/*:
 * @plugindesc v1.1 ■ Les habitants se souviennent de toi, ont des horaires,
 * arrivent et repartent à pied par la porte, et changent de propos avec la
 * saison et l'heure.
 * @author JOKO
 *
 * @param varVisites
 * @text Variable : visites à ce PNJ
 * @type variable
 * @default 880
 *
 * @param varJours
 * @text Variable : jours depuis la dernière visite
 * @type variable
 * @default 881
 *
 * @param varTirage
 * @text Variable : tirage au hasard
 * @type variable
 * @default 882
 *
 * @param varMoment
 * @text Variable : moment du jour (1 matin · 2 après-midi · 3 soir · 4 nuit)
 * @type variable
 * @default 883
 *
 * @param varSaison
 * @text Variable : saison (1 printemps · 2 été · 3 automne · 4 hiver)
 * @type variable
 * @default 884
 *
 * @param varAffinite
 * @text Variable : affinité avec ce PNJ
 * @type variable
 * @default 885
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES GENS VIVENT LEUR VIE
 * ═══════════════════════════════════════════════════════════════════════════
 *  1. LA MÉMOIRE — en tête d'un dialogue, une ligne de Script :
 *         Habitants.prep(this);
 *     remplit, pour CE PNJ (carte + numéro d'événement) :
 *       · Visites          : 1 la première fois, puis 2, 3…
 *       · Jours depuis     : jours de jeu depuis la visite précédente
 *       · Moment           : 1 matin (5-11 h) · 2 après-midi (12-17 h)
 *                            3 soir (18-21 h) · 4 nuit (22-4 h)
 *       · Saison           : 1 printemps · 2 été · 3 automne · 4 hiver
 *       · Affinité         : ce que tu as construit avec lui
 *     Les conditions de l'événement lisent ces variables : tout se règle
 *     dans l'éditeur, sans script.
 *         Habitants.affinite(this, 2);   ajoute 2 d'affinité à ce PNJ
 *
 *  2. LES HORAIRES — dans la Note de l'événement :
 *         <Horaire: 17-2>        présent de 17 h à 2 h (passe minuit)
 *         <Saisons: 1,2,3>       absent l'hiver
 *     Hors de ses heures, le PNJ n'a plus de page : il n'est pas là. Il
 *     revient tout seul quand l'heure tourne, même si l'on reste sur la carte.
 *
 *  3. LE PASSAGE — un PNJ qui a <Horaire:> ou <Saisons:> (ou <Passage> dans
 *     sa Note, pour ceux dont la page dépend d'un interrupteur de moment
 *     « TS · … ») ne clignote pas :
 *       · quand son heure finit, il MARCHE jusqu'à la sortie la plus proche
 *         (l'événement qui transfère le joueur), puis il n'est plus là ;
 *       · quand son heure vient, il ENTRE par cette sortie et marche jusqu'à
 *         sa place, puis reprend son orientation.
 *     Bloqué plus de huit secondes, il passe quand même (il « se
 *     téléporte »). On ne part pas au milieu d'une phrase : le PNJ à qui l'on
 *     parle attend la fin du dialogue.
 *         <Sortie: 20,39>        une autre sortie que la plus proche
 *
 *  Commandes de plugin : aucune.
 */
var Habitants = window.Habitants || {};
window.Habitants = Habitants;
(function () {
    'use strict';
    var P = PluginManager.parameters('Habitants');
    var V = {
        visites: Number(P.varVisites || 880), jours: Number(P.varJours || 881), tirage: Number(P.varTirage || 882),
        moment: Number(P.varMoment || 883), saison: Number(P.varSaison || 884), affinite: Number(P.varAffinite || 885)
    };
    Habitants.V = V;

    function heure() { return $gameSystem.hour ? $gameSystem.hour() : 12; }
    function jour() { return $gameSystem.day ? $gameSystem.day() : 1; }
    function saison() { var s = $gameSystem.season ? $gameSystem.season() : 1; return s >= 1 && s <= 4 ? s : 1; }
    function moment(h) { return h >= 5 && h < 12 ? 1 : h >= 12 && h < 18 ? 2 : h >= 18 && h < 22 ? 3 : 4; }
    function memoire() { return ($gameSystem._habitants = $gameSystem._habitants || {}); }
    function cle(i) { return (i._mapId || $gameMap.mapId()) + ':' + i._eventId; }

    Habitants.prep = function (interp) {
        var m = memoire(), k = cle(interp), f = m[k] = m[k] || { visites: 0, jour: null, affinite: 0 };
        var j = jour();
        $gameVariables.setValue(V.jours, f.jour === null ? 0 : Math.max(0, j - f.jour));
        f.visites++; f.jour = j;
        $gameVariables.setValue(V.visites, f.visites);
        $gameVariables.setValue(V.moment, moment(heure()));
        $gameVariables.setValue(V.saison, saison());
        $gameVariables.setValue(V.affinite, f.affinite);
    };
    Habitants.affinite = function (interp, n) {
        var m = memoire(), k = cle(interp), f = m[k] = m[k] || { visites: 0, jour: null, affinite: 0 };
        f.affinite += n;
        $gameVariables.setValue(V.affinite, f.affinite);
    };

    /* ── les horaires ───────────────────────────────────────────────────── */
    function lire(ev) {
        if (ev._habHoraire !== undefined) return;
        var n = (ev.event() && ev.event().note) || '';
        var h = n.match(/<Horaire:\s*(\d+)\s*-\s*(\d+)\s*>/i), s = n.match(/<Saisons:\s*([\d,\s]+)>/i);
        var so = n.match(/<Sortie:\s*(\d+)\s*,\s*(\d+)\s*>/i);
        ev._habHoraire = h ? [Number(h[1]), Number(h[2])] : null;
        ev._habSaisons = s ? s[1].split(',').map(Number) : null;
        ev._habPassage = !!(h || s || /<Passage>/i.test(n));
        ev._habSortieDite = so ? { x: Number(so[1]), y: Number(so[2]) } : null;
    }
    Habitants.present = function (ev) {
        lire(ev);
        if (ev._habSaisons && ev._habSaisons.indexOf(saison()) < 0) return false;
        if (!ev._habHoraire) return true;
        var a = ev._habHoraire[0], b = ev._habHoraire[1], h = heure();
        return a <= b ? h >= a && h < b : h >= a || h < b;
    };
    var _page = Game_Event.prototype.findProperPageIndex;
    Game_Event.prototype.findProperPageIndex = function () {
        if (!Habitants.present(this)) return -1;
        return _page.call(this);
    };
    var _upd = Game_Map.prototype.update;
    Game_Map.prototype.update = function (sceneActive) {
        this._habBudget = BUDGET;
        _upd.call(this, sceneActive);
        this._habPret = true;
        var h = heure() + ':' + saison();
        if (this._habHeure !== h) { var avant = this._habHeure; this._habHeure = h; if (avant !== undefined) this.requestRefresh(); }
    };
    var _setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function (mapId) {
        this._habPret = false; this._habSorties = null; this._habDistances = null;
        _setup.call(this, mapId);
    };

    /* ── le passage : on arrive par la porte, on repart par la porte ─────── */
    // Les sorties de la carte : chaque événement qui transfère le joueur.
    function sorties() {
        if ($gameMap._habSorties) return $gameMap._habSorties;
        var l = [];
        $gameMap.events().forEach(function (e) {
            var transfere = e.event().pages.some(function (p) { return p.list.some(function (c) { return c.code === 201; }); });
            if (transfere) l.push(e);
        });
        return ($gameMap._habSorties = l);
    }
    function passable(x, y) {
        return $gameMap.isValid(x, y) && [2, 4, 6, 8].some(function (d) { return $gameMap.isPassable(x, y, d); });
    }
    // La case de sortie la plus proche de la place du PNJ : la case de la porte
    // si on peut s'y tenir, sinon la case devant.
    function sortieDe(ev) {
        lire(ev);
        if (ev._habSortieDite) return ev._habSortieDite;
        var maison = { x: ev.event().x, y: ev.event().y }, best = null, d = Infinity;
        sorties().forEach(function (s) {
            var dd = Math.abs(s.x - maison.x) + Math.abs(s.y - maison.y);
            if (dd < d) { d = dd; best = s; }
        });
        if (!best) return null;
        if (!best.isNormalPriority() || best._pageIndex < 0) return { x: best.x, y: best.y };
        var c = null, dc = Infinity;
        [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function (o) {
            var x = best.x + o[0], y = best.y + o[1];
            if (!passable(x, y)) return;
            var dd = Math.abs(x - maison.x) + Math.abs(y - maison.y);
            if (dd < dc) { dc = dd; c = { x: x, y: y }; }
        });
        return c || { x: best.x, y: best.y };
    }
    // ⚠ La recherche de chemin de MV est lente (listes parcourues en entier).
    //   Mesuré le 2026-09-30 : au bar, à 10 h, huit habitués entraient ensemble,
    //   se bloquaient à la porte, et relançaient chacun une recherche toutes les
    //   deux images — 3 433 recherches en 12 s, des images de 50 ms : le jeu
    //   « ramait parfois ». Désormais : trois recherches par image au plus pour
    //   toute la carte, une attente quand on est bloqué, puis un pas de côté,
    //   et les arrivées sont étalées sur quelques secondes.
    var BUDGET = 3;

    /* Le chemin : une carte des distances (parcours en largeur) calculée UNE
     * fois par destination et par carte, sur les cases praticables. Chacun
     * descend ensuite la pente case par case : une lecture de tableau au lieu
     * d'une recherche A* de MV (jusqu'à 40 ms quand la cible est bloquée).
     * Le décor-événement (réverbère, tonneau, étal : un événement fixe, qui
     * bloque) est dans la carte : on le contourne. Les personnages, eux, n'y
     * sont pas — ils bougent : on prend une case libre qui rapproche, sinon on
     * attend puis on fait un pas de côté. */
    var DX = { 2: 0, 4: -1, 6: 1, 8: 0 }, DY = { 2: 1, 4: 0, 6: 0, 8: -1 };
    // les événements fixes qui bloquent, comme une liste de cases « i,j,… »
    function decor() {
        var w = $gameMap.width(), pilotes = $gameMap._viePNJ || [], l = [];
        $gameMap.events().forEach(function (e) {
            if (!e.isNormalPriority() || e.isThrough() || e._moveType !== 0) return;
            if (e._habDepart || e._habArrivee || e._habDelai !== undefined || pilotes.indexOf(e) >= 0) return;
            var m = e.event().meta || {};
            if (m.Horaire || m.Passage || m.Saisons) return;
            l.push(e.y * w + e.x);
        });
        return l.sort(function (a, b) { return a - b; }).join(',');
    }
    var _mapRefresh = Game_Map.prototype.refresh;
    Game_Map.prototype.refresh = function () {
        _mapRefresh.call(this);
        this._habDecorAJour = false;           // une page a pu changer : on relira le décor
    };
    function distances(x, y) {
        if (!$gameMap._habDecorAJour) {
            var s = decor();
            if (s !== $gameMap._habDecor) {
                $gameMap._habDecor = s; $gameMap._habDistances = null;
                var b = $gameMap._habBloque = {};
                if (s) s.split(',').forEach(function (i) { b[i] = true; });
            }
            $gameMap._habDecorAJour = true;
        }
        var bloque = $gameMap._habBloque || {};
        var cache = $gameMap._habDistances || ($gameMap._habDistances = {});
        var k = x + ',' + y;
        if (cache[k]) return cache[k];
        var w = $gameMap.width(), h = $gameMap.height(), n = w * h;
        var dist = new Int32Array(n); for (var i = 0; i < n; i++) dist[i] = -1;
        var file = new Int32Array(n), tete = 0, queue = 0;
        var cible = y * w + x;
        dist[cible] = 0; file[queue++] = cible;
        while (tete < queue) {
            var c = file[tete++], cx = c % w, cy = (c - cx) / w;
            [2, 4, 6, 8].forEach(function (d) {
                // un voisin qui peut marcher VERS c
                var nx = cx - DX[d], ny = cy - DY[d];
                if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
                var v = ny * w + nx;
                if (dist[v] >= 0 || bloque[v]) return;
                // la destination peut être une porte dans un mur : on s'arrête devant
                if (!$gameMap.isPassable(nx, ny, d) || (c !== cible && !$gameMap.isPassable(cx, cy, 10 - d))) return;
                dist[v] = dist[c] + 1; file[queue++] = v;
            });
        }
        return (cache[k] = dist);
    }
    function directionVers(ev, x, y) {
        var dist = distances(x, y), w = $gameMap.width(), ici = dist[ev.y * w + ev.x];
        if (ici < 0) ici = 1e9;
        var libre = 0, bl = ici, occupe = 0, bo = ici;
        [2, 4, 6, 8].forEach(function (d) {
            var nx = ev.x + DX[d], ny = ev.y + DY[d];
            if (!$gameMap.isValid(nx, ny)) return;
            var v = dist[ny * w + nx];
            if (v < 0 || v >= ici) return;
            // une case qui rapproche et où personne ne se tient, d'abord
            if (ev.canPass(ev.x, ev.y, d)) { if (v < bl) { bl = v; libre = d; } }
            else if (v < bo) { bo = v; occupe = d; }
        });
        return libre || occupe;
    }
    Habitants.directionVers = directionVers;

    function pasVers(ev, b) {
        if ($gameMap._habBudget <= 0) return;
        $gameMap._habBudget--;
        var d = directionVers(ev, b.x, b.y);
        if (d > 0) {
            ev.moveStraight(d);
            if (ev.isMovementSucceeded()) { b.bloque = 0; return; }
        }
        b.bloque = (b.bloque || 0) + 1;
        if (b.bloque >= 3) { ev.moveRandom(); b.bloque = 0; }
        b.attente = 12 + Math.randomInt(24);
    }
    function onLuiParle(ev) {
        return $gameMap._interpreter && $gameMap._interpreter.isRunning() && $gameMap._interpreter.eventId() === ev.eventId();
    }
    var LIMITE = 60 * 8;        // huit secondes de marche au plus, puis il « passe » quand même

    var _refresh = Game_Event.prototype.refresh;
    Game_Event.prototype.refresh = function () {
        lire(this);
        if (!this._habPassage || !$gameMap._habPret || this._erased) return _refresh.call(this);
        if (this._habDepart) return;                       // il est en route vers la sortie : on le laisse finir
        var ancien = this._pageIndex, nouveau = this.findProperPageIndex();
        if (ancien >= 0 && nouveau < 0) {
            var s = sortieDe(this);
            if (s) { this._habDepart = { x: s.x, y: s.y, t: 0 }; this._habArrivee = null; this._habMove = this._moveType; this._moveType = 0; return; }
        }
        if (ancien < 0 && nouveau >= 0 && !this._habEntre) {
            // il n'entre pas tout de suite : chacun à son tour, sur ~3 s
            if (this._habDelai === undefined) this._habDelai = Math.randomInt(180);
            return;
        }
        this._habEntre = false;
        _refresh.call(this);
        if (ancien < 0 && this._pageIndex >= 0) {
            var e = sortieDe(this);
            if (e && (e.x !== this.x || e.y !== this.y)) {
                this.locate(e.x, e.y);
                this._habArrivee = { x: this.event().x, y: this.event().y, t: 0, dir: this.page().image.direction || 2 };
                this._habMove = this._moveType; this._moveType = 0;
            }
        }
    };
    var _updEv = Game_Event.prototype.update;
    Game_Event.prototype.update = function () {
        _updEv.call(this);
        if (this._habDelai !== undefined) {
            if (this._habDelai-- <= 0) { this._habDelai = undefined; this._habEntre = true; this.refresh(); }
            return;
        }
        var b = this._habDepart || this._habArrivee;
        if (!b || onLuiParle(this) || $gameMessage.isBusy()) return;
        // pendant une scène (OutilsDeScene, mode cinématique), il s'arrête sur place
        if (window.OutilsDeScene && OutilsDeScene.figeAussi(this)) return;
        b.t += 1;                                  // en temps réel, même pendant les pas
        if (this.isMoving() && b.t <= LIMITE) return;
        // partir : être à côté de la sortie suffit (le joueur se tient souvent devant la porte)
        var arrive = this._habDepart ? Math.abs(this.x - b.x) + Math.abs(this.y - b.y) <= 1 : (this.x === b.x && this.y === b.y);
        if (arrive || b.t > LIMITE) {
            this._moveType = this._habMove;
            if (this._habDepart) { this._habDepart = null; _refresh.call(this); }
            else { if (!arrive) this.locate(b.x, b.y); this.setDirection(b.dir); this._habArrivee = null; }
            return;
        }
        if (b.attente > 0) { b.attente--; return; }
        pasVers(this, b);
    };
    // ce que fait chacun, pour les bancs
    Habitants.etat = function () {
        return $gameMap.events().filter(function (e) { lire(e); return e._habPassage; }).map(function (e) {
            return { id: e.eventId(), nom: e.event().name, page: e._pageIndex, x: e.x, y: e.y, depart: !!e._habDepart, arrivee: !!e._habArrivee };
        });
    };
})();
