//=============================================================================
// Lore_Factions.js — v1.0 · FUSION faction (couleur ennemie + réputation)
//   Regroupe (comportement identique) : Lore_FactionCouleur + Lore_FactionRepute.
//=============================================================================
/*:
 * @plugindesc [Lore] Factions fondues : teinte + libellé des ennemis <Faction: x>, et système de RÉPUTATION (commande REPUTE, API window.Reputation).
 * @author JOKO
 * @help
 *  • Ennemi <Faction: vultric|culte|etoiles|prisme> : légère teinte + libellé de faction au début du combat.
 *  • Réputation (culte/vultric/etoiles/affranchis) : REPUTE add <faction> <n> · REPUTE ecran · window.Reputation.get('culte').
 *  Remplace Lore_FactionCouleur + Lore_FactionRepute (fusion 2026-07-17).
 */
(function () {
    'use strict';

    // ── Couleur/libellé des ennemis par faction ──
    var DATA = {
        vultric: { n: 'Empire Vultric', c: [40, -20, 60, 20] },
        culte: { n: 'Culte des Âmes', c: [60, -10, 10, 10] },
        etoiles: { n: 'Royaume des Étoiles', c: [10, -20, 60, 20] },
        prisme: { n: 'Ordre du Prisme', c: [50, 20, 60, 0] }
    };
    function facOf(e) { try { var m = /<Faction:\s*([a-z]+)>/i.exec(e.enemy().note || ''); return m ? m[1].toLowerCase() : null; } catch (e) { return null; } }

    var _start = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _start.call(this);
        try {
            var seen = {};
            $gameTroop.members().forEach(function (e) {
                var f = facOf(e);
                if (f && DATA[f] && !seen[f]) { seen[f] = 1; if (this._logWindow) this._logWindow.push('addText', '\\C[8]⚑ Ennemis affiliés : ' + DATA[f].n + '\\C[0]'); }
            }, this);
        } catch (e) {}
    };
    if (typeof Sprite_Enemy !== 'undefined') {
        var _upd = Sprite_Enemy.prototype.update;
        Sprite_Enemy.prototype.update = function () {
            _upd.call(this);
            try {
                if (this._enemy && this._loreFac === undefined) this._loreFac = facOf(this._enemy) || null;
                if (this._loreFac && DATA[this._loreFac]) this.setBlendColor(DATA[this._loreFac].c);
            } catch (e) {}
        };
    }

    // ── Système de réputation (sauvegardé) ──
    var KEYS = { culte: 'Culte des Âmes', vultric: 'Empire Vultric', etoiles: 'Royaume des Étoiles', affranchis: 'Les Affranchis' };
    var COL = { culte: '#c74a7a', vultric: '#8a4ae0', etoiles: '#4a86d6', affranchis: '#6fd67b' };
    function store() { if (!$gameSystem._loreRep) $gameSystem._loreRep = { culte: 0, vultric: 0, etoiles: 0, affranchis: 0 }; return $gameSystem._loreRep; }
    window.Reputation = {
        get: function (k) { return store()[k] || 0; },
        add: function (k, n) { var s = store(); if (s[k] === undefined) return; s[k] = Math.max(-20, Math.min(20, s[k] + (Number(n) || 0))); },
        all: function () { return store(); }
    };

    function Wn() { this.initialize.apply(this, arguments); }
    Wn.prototype = Object.create(Window_Base.prototype); Wn.prototype.constructor = Wn;
    Wn.prototype.initialize = function () { Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight); this.refresh(); };
    Wn.prototype.refresh = function () {
        this.contents.clear(); this.changeTextColor(this.textColor(6)); this.drawText('❖ RÉPUTATION', 0, 0, this.contentsWidth(), 'center'); this.resetTextColor();
        var y = this.lineHeight() * 2, s = store();
        Object.keys(KEYS).forEach(function (k) {
            this.drawText(KEYS[k], 40, y, 240);
            var bx = 300, bw = Graphics.boxWidth - 420, v = s[k] || 0, r = (v + 20) / 40;
            this.contents.fillRect(bx, y + 10, bw, 18, 'rgba(0,0,0,.5)'); this.contents.fillRect(bx, y + 10, Math.floor(bw * r), 18, COL[k]);
            this.drawText((v > 0 ? '+' : '') + v, bx + bw + 12, y, 80); y += this.lineHeight() * 1.5;
        }, this);
    };
    function Sc() { this.initialize.apply(this, arguments); }
    Sc.prototype = Object.create(Scene_MenuBase.prototype); Sc.prototype.constructor = Sc;
    Sc.prototype.create = function () { Scene_MenuBase.prototype.create.call(this); this.addWindow(new Wn()); };
    Sc.prototype.update = function () { Scene_MenuBase.prototype.update.call(this); if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) this.popScene(); };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (c, a) {
        _pc.call(this, c, a);
        if (String(c).toUpperCase() === 'REPUTE') {
            var sub = String(a[0] || '').toLowerCase();
            if (sub === 'add') window.Reputation.add(String(a[1] || '').toLowerCase(), Number(a[2]) || 0);
            else if (sub === 'ecran') SceneManager.push(Sc);
        }
    };
})();
