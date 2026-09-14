//=============================================================================
// JadeEchos.js — v1.0  ·  Échos du Groupe (banter mental dynamique)
// RPG Maker MV   ·   by JOKO   (additif — ne modifie aucun autre plugin)
//=============================================================================
/*:
 * @target MV
 * @plugindesc v1.0 ■ En combat, le groupe REAGIT en direct a l'etat mental de chacun
 * (jauges de Maitrise) : inquietude, taquineries de Lou, complicite si tout va bien.
 * @author JOKO
 *
 * @param ActorVarPairs
 * @text Paires acteur:variable
 * @type string
 * @desc Liste "idActeur=idVariable" separes par des virgules (jauge de Maitrise).
 * @default 1=11,2=12,3=13,4=14
 *
 * @param EchoChance
 * @text Chance d'echo / tour (%)
 * @type number
 * @min 0
 * @max 100
 * @default 40
 *
 * @param CooldownTurns
 * @text Tours de pause entre deux echos
 * @type number
 * @min 0
 * @default 1
 *
 * @help
 * ============================================================================
 *  ÉCHOS DU GROUPE                                                     by JOKO
 * ============================================================================
 *  À chaque fin de tour, un membre du groupe peut COMMENTER l'état mental d'un
 *  autre, selon les jauges de Maîtrise (plugin JadeEntitePlunging) :
 *    • Quelqu'un s'effondre → un allié s'inquiète (ou Lou en rajoute).
 *    • Lou taquine Aël quand elle perd son calme (rage-bait, cf. lore).
 *    • Tout le monde stable → réplique de complicité, rare et précieuse.
 *
 *  Aucune dépendance dure : lit window.Ame s'il existe, sinon les variables.
 *  Purement narratif (messages de combat) — ne change aucune mécanique.
 * ============================================================================
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('JadeEchos');
    var CHANCE   = parseInt(P['EchoChance'] || 40, 10) / 100;
    var COOLDOWN = parseInt(P['CooldownTurns'] || 1, 10);

    // Map acteur -> variable de jauge
    var VAR_BY_ACTOR = {};
    String(P['ActorVarPairs'] || '1=11,2=12,3=13,4=14').split(',').forEach(function (pair) {
        var kv = pair.split('=');
        var a = parseInt(kv[0], 10), v = parseInt(kv[1], 10);
        if (!isNaN(a) && !isNaN(v)) VAR_BY_ACTOR[a] = v;
    });

    // Identités connues (pour des répliques sur-mesure ; sinon générique)
    var LOU = 3, THYLANE = 1;

    function phaseFromValue(v) {
        if (v <= 1) return 1;
        if (v <= 3) return 2;
        if (v <= 5) return 3;
        if (v <= 8) return 4;
        return 5;
    }
    function phaseOf(actorId) {
        // Préfère l'API Ame si dispo (cohérence totale avec JadeEntitePlunging)
        if (window.Ame && typeof window.Ame.phase === 'function') {
            try { return window.Ame.phase(actorId); } catch (e) {}
        }
        var v = VAR_BY_ACTOR[actorId];
        if (!v || typeof $gameVariables === 'undefined') return 5;
        var val = $gameVariables.value(v);
        return val > 0 ? phaseFromValue(val) : 5;
    }

    function log(t) {
        var w = BattleManager._logWindow;
        if (w) { w.push('addText', t); w.push('wait'); }
    }
    function nameOf(actor) { return actor ? actor.name() : '?'; }

    // Membres présents avec leur phase
    function readGroup() {
        return $gameParty.aliveMembers()
            .filter(function (m) { return VAR_BY_ACTOR.hasOwnProperty(m.actorId()); })
            .map(function (m) { return { actor: m, id: m.actorId(), phase: phaseOf(m.actorId()) }; });
    }

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    // Construit une réplique contextuelle (ou null si rien à dire)
    function buildEcho(group) {
        if (group.length < 1) return null;

        var byPhase = group.slice().sort(function (a, b) { return a.phase - b.phase; });
        var worst = byPhase[0];
        var hasLou = group.find(function (g) { return g.id === LOU; });
        var hasThy = group.find(function (g) { return g.id === THYLANE; });

        // 1) Aël vacille + Lou présent → Lou la taquine (rage-bait, lore existant)
        if (hasThy && hasThy.phase <= 2 && hasLou && hasLou.phase >= 3 && hasLou.id !== hasThy.id) {
            return pick([
                nameOf(hasLou.actor) + ' : « Oooh, ' + nameOf(hasThy.actor) + ' va exploser ! Vas-y, frappe-MOI, pour voir. »',
                nameOf(hasLou.actor) + ' : « Respire, ' + nameOf(hasThy.actor) + '… ou pas. C\'est plus drôle quand tu craques. »'
            ]);
        }

        // 2) Quelqu'un s'effondre (phase 1) → un autre s'inquiète
        if (worst.phase === 1) {
            var helper = pick(group.filter(function (g) { return g.id !== worst.id && g.phase >= 3; }) || []);
            if (helper) {
                return pick([
                    nameOf(helper.actor) + ' : « ' + nameOf(worst.actor) + ', reste avec nous ! Ne l\'écoute pas ! »',
                    nameOf(helper.actor) + ' : « Je te tiens, ' + nameOf(worst.actor) + '. Jade ne t\'aura pas. »'
                ]);
            }
            return '\\C[2]Le regard de ' + nameOf(worst.actor) + ' se vide… l\'esprit cède.\\C[0]';
        }

        // 3) Deux membres ou plus instables → tension de groupe
        var shaky = group.filter(function (g) { return g.phase <= 2; });
        if (shaky.length >= 2) {
            return '\\C[18]L\'angoisse se propage dans le groupe — leurs mains tremblent à l\'unisson.\\C[0]';
        }

        // 4) Un seul en tension → petit mot d'un allié serein
        if (worst.phase <= 3) {
            var calm = group.find(function (g) { return g.id !== worst.id && g.phase >= 4; });
            if (calm) {
                return nameOf(calm.actor) + ' : « Tiens bon, ' + nameOf(worst.actor) + '. On finit ça ensemble. »';
            }
        }

        // 5) Tout le monde stable (>=4) → complicité (rare)
        if (group.every(function (g) { return g.phase >= 4; }) && group.length >= 2 && Math.random() < 0.4) {
            var a = pick(group), b = pick(group.filter(function (g) { return g.id !== a.id; }));
            if (b) return nameOf(a.actor) + ' : « On forme une sacrée équipe, ' + nameOf(b.actor) + '. »';
        }

        return null;
    }

    var _onTurnEnd = Game_Troop.prototype.onTurnEnd;
    Game_Troop.prototype.onTurnEnd = function () {
        _onTurnEnd.call(this);

        if (this._echoCooldown > 0) { this._echoCooldown--; return; }
        if (Math.random() >= CHANCE) return;

        var line = buildEcho(readGroup());
        if (line) {
            log(line);
            this._echoCooldown = COOLDOWN;
        }
    };

    var _setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function (troopId) {
        _setup.call(this, troopId);
        this._echoCooldown = 0;
    };

})();
