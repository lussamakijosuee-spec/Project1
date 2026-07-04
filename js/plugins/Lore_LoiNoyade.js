//=============================================================================
// Lore_LoiNoyade.js — v1.0 · La Loi de la Noyade (Esprit / le Lac)
//   « Passé une certaine profondeur, la descente devient irréversible — et
//   l'on ne paie plus seulement en raison, mais en âme. »
//=============================================================================
/*:
 * @plugindesc [Lore] Loi de la Noyade : chaque Effondrement (phase 1) laisse une
 * cicatrice — la santé mentale ne remonte plus jamais tout en haut, et l'âme paie.
 * @author JOKO
 *
 * @param planchersMin
 * @text Plafond minimal de la jauge
 * @type number
 * @min 2
 * @default 4
 * @desc La jauge maximale ne descend jamais sous cette valeur (sinon soft-lock).
 *
 * @param prixErrance
 * @text Prix « en âme » par Noyade
 * @type number
 * @min 0
 * @default 5
 * @desc Errance gagnée à chaque Noyade (on ne paie plus seulement en raison, mais en âme).
 *
 * @help
 *  Lit la jauge de santé mentale (window.Ame, 1-10). Quand un héros touche
 *  l'EFFONDREMENT (phase 1), c'est une NOYADE :
 *   • une cicatrice s'installe : sa jauge ne pourra plus JAMAIS remonter
 *     au-dessus de (max − nombre de noyades) — le Lac garde ce qu'il prend ;
 *   • il paie « en âme » : +prixErrance d'Errance (plugin Errance).
 *
 *  Script :  LoiNoyade.noyades(actorId)  → nombre de noyades subies.
 *  Purge narrative (rare, ex. bénédiction) : commande  NOYADE pardonne <id>
 *  Aucune dépendance dure ; sans window.Ame le plugin dort.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('Lore_LoiNoyade');
    var MIN_CAP = parseInt(P['planchersMin'] || 4);
    var PRIX = parseInt(P['prixErrance'] || 5);

    function store() {
        if (!$gameSystem) return {};
        if (!$gameSystem._noyades) $gameSystem._noyades = {};
        return $gameSystem._noyades;
    }
    var LoiNoyade = {
        noyades: function (id) { return store()[id] || 0; },
        pardonne: function (id) { var s = store(); if (s[id] > 0) s[id]--; }
    };
    window.LoiNoyade = LoiNoyade;

    var patched = false;
    function patchAme() {
        if (patched || !window.Ame || !window.Ame.setJauge) return;
        patched = true;
        var GAUGE_MAX = 10;

        // Même résolution de clé que window.Ame (prénom ou id).
        function resolveId(key) {
            if (typeof key === 'number') return key;
            var k = String(key).toLowerCase().trim();
            var map = window.Ame.ACTOR || {};
            if (map.hasOwnProperty(k)) return map[k];
            var n = parseInt(k);
            return isNaN(n) ? 0 : n;
        }

        var _set = window.Ame.setJauge;
        window.Ame.setJauge = function (key, value) {
            var res = _set.call(this, key, value);
            var actorId = resolveId(key);
            if (!actorId) return res;
            var phase = this.phase(key);

            var s = store();

            // 1) NOYADE : on vient de toucher l'Effondrement.
            if (phase === 1 && !s['dive' + actorId]) {
                s['dive' + actorId] = true;
                s[actorId] = (s[actorId] || 0) + 1;
                var a = $gameActors && $gameActors.actor(actorId);
                var w = SceneManager._scene && SceneManager._scene._logWindow;
                var msg = '\\C[1]Le Lac garde ce qu\'il prend. ' + (a ? a.name() : '') + ' ne remontera plus tout à fait.\\C[0]';
                if (w) { w.push('addText', msg); w.push('wait'); }
                else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(msg);
                if (PRIX > 0 && window.Errance) { try { window.Errance.add(actorId, PRIX); } catch (e) {} }
            }
            if (phase > 1) s['dive' + actorId] = false;   // remonté : la prochaine chute recomptera

            // 2) CICATRICE : la jauge ne dépasse plus (max − noyades).
            var cap = Math.max(MIN_CAP, GAUGE_MAX - (s[actorId] || 0));
            if (this.jauge(key) > cap) _set.call(this, key, cap);
            return res;
        };
    }

    // Patch paresseux : dès qu'une scène tourne (window.Ame chargé après nous ou avant).
    var _update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function () {
        if (!patched) patchAme();
        _update.call(this);
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'NOYADE') return;
        if ((args[0] || '').toLowerCase() === 'pardonne') LoiNoyade.pardonne(parseInt(args[1]) || 0);
    };
})();
