//=============================================================================
// ChuteDement.js — v1.0 · La chute du Dément : il ne part pas. Il croit rester.
// RPG Maker MV · by JOKO · charger APRÈS JadeEntitePlunging, ChutesDefinitives.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le Dément vécu de l'intérieur : le spectre dans l'équipe,
 * les sens qui mentent, le faux Game Over, la trahison, l'ancrage.
 * @author JOKO
 * @param switchTrahison
 * @text Interrupteur allumé à la trahison (pour ton combat)
 * @type switch
 * @default 98
 * @help
 *  ▶ DEMENT chute <id> — déclenche la chute « il croit rester » : le héros
 *    reste dans le groupe mais FRAPPE LE VIDE (dégâts 0). Au bout de 3
 *    combats, il se retourne : messages, il quitte le groupe, l'interrupteur
 *    (98) s'allume — branche dessus ton combat contre sa version démente
 *    (ennemis 410/415/419/421 de la matrice).
 *  ▶ AUTOMATIQUE — les sens mentent selon la santé mentale du chef :
 *    phase ≤3 : sons fantômes rares · phase ≤2 : « … » dans le combat ·
 *    phase 1 : UNE fois, le faux Game Over (« …tu es encore là. »).
 *  ▶ <DementTombe> (note d'ennemi, posé sur 410/415/419/421) : il COPIE une
 *    technique du groupe par tour et lit tes Reprises à voix haute.
 *  ▶ DEMENT ancrage <id> — la seule porte : chaque allié LUCIDE (jauge ≥ 8)
 *    l'ancre de +1 (max +3). Une équipe qui a sombré regarde son ami partir.
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('ChuteDement');
    var SW = parseInt(P['switchTrahison'] || 98);
    function jm(id) { try { return window.Ame ? (Ame.jauge(id) || 10) : 10; } catch (e) { return 10; } }
    function spectre() { return ($gameSystem && $gameSystem._dementSpectre) || null; }

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'DEMENT') return;
        var sub = (args[0] || '').toLowerCase(), id = parseInt(args[1]) || 1;
        var a = $gameActors.actor(id);
        if (sub === 'chute' && a) {
            $gameSystem._dementSpectre = { id: id, combats: 0 };
            $gameScreen.startFlash([200, 200, 255, 200], 40);
            $gameMessage.add(a.name() + ' rit. Longtemps. Trop longtemps.');
            $gameMessage.add('\\C[8]Puis tout redevient normal. Vraiment ?\\C[0]');
        }
        if (sub === 'ancrage' && a) {
            var n = 0;
            $gameParty.members().forEach(function (m) {
                if (m.actorId() !== id && jm(m.actorId()) >= 8 && n < 3) {
                    n++; $gameMessage.add(m.name() + ' le retient. « Reste avec nous. »');
                }
            });
            if (n > 0) { try { Ame.bon(id, n); } catch (e) {} $gameMessage.add('\\C[23]Ancré. (+' + n + ' lucidité)\\C[0]'); }
            else $gameMessage.add('\\C[2]Personne n\'est assez lucide pour le retenir. Il glisse.\\C[0]');
        }
    };

    // ── le spectre frappe le vide ──
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _mdv.call(this, target, critical);
        var sp = spectre(), s = this.subject();
        if (sp && s && s.isActor && s.isActor() && s.actorId() === sp.id && v > 0) {
            var w = BattleManager._logWindow;
            if (w && Math.random() < 0.5) { w.push('addText', '\\C[8]' + s.name() + ' frappe le vide.\\C[0]'); }
            return 0;
        }
        return v;
    };
    // ── 3 combats, puis la trahison ──
    var _eb = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        _eb.call(this, result);
        var sp = spectre();
        if (sp) {
            sp.combats++;
            if (sp.combats >= 3) {
                var a = $gameActors.actor(sp.id);
                $gameSystem._dementSpectre = null;
                $gameMessage.add('\\C[18]' + a.name() + ' s\'arrête. Se tourne vers vous.\\C[0]');
                $gameMessage.add('« Depuis quand… vous me regardez comme ça ? »');
                $gameMessage.add('\\C[2]Ce que vous escortiez n\'était déjà plus votre ami.\\C[0]');
                $gameParty.removeActor(sp.id);
                if (SW > 0) $gameSwitches.setValue(SW, true);
            }
        }
    };
    // ── les sens qui mentent + le faux Game Over ──
    var _upd = Scene_Map.prototype.update, _cd = 0;
    Scene_Map.prototype.update = function () {
        _upd.call(this);
        if (--_cd > 0) return; _cd = 600;
        try {
            var l = $gameParty.leader(); if (!l) return;
            var m = jm(l.actorId());
            if (m <= 3 && Math.random() < 0.35) AudioManager.playSe({ name: 'Miss', volume: 40, pitch: 60, pan: Math.random() < 0.5 ? -70 : 70 });
            if (m <= 1 && !$gameSystem._fauxGO && !$gameMessage.isBusy()) {
                $gameSystem._fauxGO = true;
                $gameScreen.startFadeOut(30);
                $gameMessage.add('\\C[8]— FIN —\\C[0]');
                $gameMessage.add('\\C[8]. . .\\C[0]');
                $gameMessage.add('\\C[18]…tu es encore là.\\C[0]');
                $gameScreen.startFadeIn(60);
            }
        } catch (e) {}
    };
    // ── le Dément tombé : il copie les vôtres, il lit tes Reprises ──
    var _act = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function () {
        _act.call(this);
        try {
            var e = this.enemy();
            if (!e || !e.meta || e.meta.DementTombe === undefined) return;
            if (!this._ditReprises) {
                this._ditReprises = true;
                var w = BattleManager._logWindow, n = ($gameSystem._reprises || 0);
                if (w && n > 0) { w.push('addText', '\\C[8]« Il t\'a regardé remonter ' + n + ' fois. Moi aussi, maintenant. »\\C[0]'); }
            }
            if (Math.random() < 0.35 && this.numActions() > 0) {
                var pool = [];
                $gameParty.battleMembers().forEach(function (m) { m.skills().forEach(function (sk) { if (sk.stypeId > 0 && sk.mpCost < 60) pool.push(sk.id); }); });
                if (pool.length) {
                    var sid = pool[Math.floor(Math.random() * pool.length)];
                    this.action(0).setSkill(sid);
                    var w2 = BattleManager._logWindow;
                    if (w2) w2.push('addText', '\\C[2]Il connaît vos gestes. Il était des vôtres.\\C[0]');
                }
            }
        } catch (e2) {}
    };
})();
