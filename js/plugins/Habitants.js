//=============================================================================
// Habitants.js — v1.0  ·  Les gens vivent leur vie
// RPG Maker MV   ·   pour JOKO
//   À charger APRÈS MOG_TimeSystem (il lui demande l'heure et la saison).
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les habitants se souviennent de toi, ont des horaires
 * et changent de propos avec la saison et l'heure.
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
        ev._habHoraire = h ? [Number(h[1]), Number(h[2])] : null;
        ev._habSaisons = s ? s[1].split(',').map(Number) : null;
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
        _upd.call(this, sceneActive);
        var h = heure() + ':' + saison();
        if (this._habHeure !== h) { var avant = this._habHeure; this._habHeure = h; if (avant !== undefined) this.requestRefresh(); }
    };
})();
