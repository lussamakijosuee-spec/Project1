//=============================================================================
// TheatreDement.js — v1.0 · Le jeu ment au fou (ne crois plus ton interface)
// RPG Maker MV · by JOKO / Claude · charger APRÈS JadeEntitePlunging.
//  Purement TROMPE-L'ŒIL : les VRAIS chiffres du jeu ne changent jamais.
//=============================================================================
/*:
 * @plugindesc [v1.0] Quand l'esprit sombre, l'interface MENT : faux PV, faux
 * dégâts, noms d'alliés qui deviennent des inconnus, or truqué, répliques d'un
 * combattant qui n'existe pas. Les vraies valeurs, elles, ne bougent pas.
 * @author JOKO / Claude
 *
 * @param seuilPhase
 * @text Phase mentale ≤ … pour mentir
 * @type number
 * @min 1
 * @max 5
 * @default 3
 * @desc Le théâtre commence quand la santé mentale du chef tombe à cette phase (3 = Tension).
 *
 * @param intensite
 * @text Intensité (%)
 * @type number
 * @min 0
 * @max 100
 * @default 100
 * @desc Multiplie la fréquence des mensonges. 0 = aucun.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE THÉÂTRE DU DÉMENT — « il ne ment jamais ; c'est le monde qui ment »
 * ═══════════════════════════════════════════════════════════════════════════
 *  Le Dément ne voit pas seulement des choses : le jeu lui-même se met à MENTIR.
 *  Plus le chef de groupe s'enfonce (phase mentale basse), plus l'interface
 *  déraille — mais UNIQUEMENT à l'affichage. Aucune vraie valeur n'est touchée :
 *  tes PV, ton or, tes dégâts réels restent exacts. C'est ta confiance qu'on vise.
 *
 *  CE QUI MENT (fréquence à l'échelle de la profondeur, jamais permanent) :
 *    • les CHIFFRES DE PV/PM affichés se brouillent parfois (█▓?%) ;
 *    • le NOM d'un allié devient soudain celui d'un inconnu ;
 *    • l'OR affiché est faux l'espace d'un instant ;
 *    • en combat, le journal annonce des choses qui n'arrivent pas
 *      (« un cinquième combattant frappe », « 9999 dégâts », « …il est là »).
 *
 *  Rien à installer, rien à régler côté données. Se coupe tout seul dès que
 *  l'esprit remonte. Commande : THEATRE off / on.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('TheatreDement');
    var SEUIL = parseInt(P['seuilPhase'] || 3);
    var INTENS = parseInt(P['intensite'] || 100) / 100;

    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }
    function leader() { return $gameParty && $gameParty.leader(); }
    // profondeur 0..(SEUIL) : 0 si au-dessus du seuil, grandit en sombrant
    function profondeur() {
        var l = leader(); if (!l) return 0;
        var p = phase(l.actorId());
        if (p > SEUIL) return 0;
        return (SEUIL - p) + 1;              // phase=SEUIL → 1 … phase=1 → SEUIL
    }
    function actif() { return INTENS > 0 && !($gameSystem && $gameSystem._theatreOff) && profondeur() > 0; }
    function chance(base) { return actif() && Math.random() < base * INTENS * profondeur(); }

    var GLYPHES = ['█', '▓', '?', '#', '%', 'X', '¿', '‽'];
    function brouiller(s) {
        return String(s).split('').map(function (ch) {
            return ch !== ' ' && Math.random() < 0.6 ? GLYPHES[Math.floor(Math.random() * GLYPHES.length)] : ch;
        }).join('');
    }
    var INCONNUS = ['?????', 'Personne', 'Toi', 'Le Cinquième', 'un visage', 'MOI', 'celui du Lac'];

    //--- PV / PM affichés ---------------------------------------------------------
    var _dcam = Window_Base.prototype.drawCurrentAndMax;
    Window_Base.prototype.drawCurrentAndMax = function (current, max, x, y, width, color1, color2) {
        if (chance(0.05)) {
            var faux = brouiller(String(Math.floor(Math.random() * (max + 1))));
            return _dcam.call(this, faux, max, x, y, width, color1, color2);
        }
        return _dcam.call(this, current, max, x, y, width, color1, color2);
    };

    //--- nom d'allié → inconnu ----------------------------------------------------
    var _dan = Window_Base.prototype.drawActorName;
    Window_Base.prototype.drawActorName = function (actor, x, y, width) {
        if (chance(0.04)) {
            var old = actor.name;
            actor.name = function () { return INCONNUS[Math.floor(Math.random() * INCONNUS.length)]; };
            _dan.call(this, actor, x, y, width);
            actor.name = old;
            return;
        }
        return _dan.call(this, actor, x, y, width);
    };

    //--- or truqué ----------------------------------------------------------------
    var _dcv = Window_Base.prototype.drawCurrencyValue;
    Window_Base.prototype.drawCurrencyValue = function (value, unit, x, y, width) {
        if (chance(0.07)) {
            var faux = brouiller(String(value)) ;
            this.resetTextColor();
            this.drawText(faux, x, y, width - this.textWidth(unit) - 6, 'right');
            this.changeTextColor(this.systemColor());
            this.drawText(unit, x, y, width, 'right');
            this.resetTextColor();
            return;
        }
        return _dcv.call(this, value, unit, x, y, width);
    };

    //--- journal de combat : des choses qui n'arrivent pas ------------------------
    var FAUX_LOG = [
        '\\C[8]Un cinquième combattant frappe.\\C[0]',
        '\\C[8]9999 dégâts.\\C[0]',
        '\\C[8]…il est là. Derrière la rangée.\\C[0]',
        '\\C[8]' + '?????' + ' rejoint le combat.\\C[0]',
        '\\C[8]Vous vous frappez vous-même. (Vraiment ?)\\C[0]',
        '\\C[8]L\'ennemi murmure ton vrai nom.\\C[0]'
    ];
    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        _startTurn.call(this);
        try {
            if (chance(0.18) && this._logWindow) {
                this._logWindow.push('addText', FAUX_LOG[Math.floor(Math.random() * FAUX_LOG.length)]);
                this._logWindow.push('wait');
            }
        } catch (e) {}
    };

    //--- commande -----------------------------------------------------------------
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'THEATRE') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'off') { if ($gameSystem) $gameSystem._theatreOff = true; }
        else if (sub === 'on') { if ($gameSystem) $gameSystem._theatreOff = false; }
    };
})();
