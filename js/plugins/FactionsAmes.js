//=============================================================================
// FactionsAmes.js — v1.0  ·  Les Factions (allégeance + bonus)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Rejoins une faction (Sorcières des Étoiles / Empire Vultric
 * / Voix de l'Âme) : bonus de stats permanent à toute l'équipe + variable de scénario.
 * @author JOKO
 *
 * @param factionVar
 * @text Variable de faction
 * @type variable
 * @default 19
 * @desc 0=aucune, 1=Étoiles, 2=Vultric, 3=Voix. Pour brancher ton histoire.
 *
 * @help
 *  Dans un événement :
 *      FACTION join etoiles     (Sorcières des Étoiles  → +Magie/+Déf.Mag)
 *      FACTION join vultric     (Empire Vultric         → +Attaque/+PV)
 *      FACTION join voix        (Voix de l'Âme          → +PM/+Agilité)
 *      FACTION quit
 *  Le choix est stocké dans la variable (paramètre) pour brancher le scénario.
 *  Script : $gameSystem.faction()
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('FactionsAmes');
    var FVAR = parseInt(P['factionVar'] || 19);
    var NAMES = { 1: 'Sorcières des Étoiles', 2: 'Empire Vultric', 3: 'Voix de l\'Âme' };
    // bonus par faction : paramId -> bonus plat
    var BONUS = {
        1: { 4: 18, 5: 14 },           // Étoiles : MAT, MDF
        2: { 2: 16, 0: 200 },          // Vultric : ATK, MHP
        3: { 1: 60, 6: 14 }            // Voix : MMP, AGI
    };
    var KEY = { etoiles: 1, vultric: 2, voix: 3 };

    Game_System.prototype.faction = function () { return this._faction || 0; };

    function join(f) {
        if (!$gameSystem) return;
        $gameSystem._faction = f;
        if ($gameVariables) $gameVariables.setValue(FVAR, f);
        $gameParty.members().forEach(function (a) { a.refresh(); });
        if (f && $gameMessage) $gameMessage.add('\\C[14]Tu rejoins : ' + NAMES[f] + '.\\C[0]');
    }

    var _pp = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function (pid) {
        var v = _pp.call(this, pid);
        var f = (typeof $gameSystem !== 'undefined' && $gameSystem) ? $gameSystem.faction() : 0;
        if (f && BONUS[f] && BONUS[f][pid]) v += BONUS[f][pid];
        return v;
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'FACTION') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'join') join(KEY[(args[1] || '').toLowerCase()] || 0);
        else if (sub === 'quit') join(0);
    };
})();
