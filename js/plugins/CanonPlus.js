//=============================================================================
// CanonPlus.js — v1.0 · Purge tragique · Graveur de runes · Traits des boss
//                      · Fiche du marqué · les Reprises qui s'accumulent
// RPG Maker MV · by JOKO · charger APRÈS CorruptionAme, Errance,
//   JadeEntitePlunging, TraitsAme, MarqueVivante (et avant GrimoireHub).
//=============================================================================
/*:
 * @plugindesc v1.0 ■ 5 systèmes canon : PURGE (transvaser, jamais effacer),
 * GRAVEUR (âmes→runes), Traits des boss, FICHE du marqué, Reprises comptées.
 * @author JOKO
 * @help
 *  ▶ PURGE — on ne se lave jamais gratuitement, on TRANSVASE :
 *      PURGE bete <id>    −30 Corruption … +10 Errance (le mal se déplace)
 *      PURGE errant <id>  −30 Errance … −2 lucidité (plonger dans le Lac)
 *      PURGE dement <id>  +3 lucidité … +10 Corruption (calmer l'esprit épuise le corps)
 *  ▶ GRAVEUR — GRAVER entrave|renvoi|saignee  : 5 âmes (var 15) → 1 rune
 *      gravée (items 65-67). Refus si pas assez d'âmes.
 *  ▶ TRAITS DES BOSS — note d'ennemi <TraitBoss: Nom|type> :
 *      gel (10% fige l'attaquant) · faim (vole 10% des dégâts infligés) ·
 *      rupture (+15% crit) · renvoi (10% contre) · regard (ne rate jamais).
 *      Le nom s'annonce au premier coup reçu. Déjà posé sur Dio, Muta,
 *      Kevératus, Régis, la Reine, Celui qui est Tombé.
 *  ▶ FICHE — commande FICHE : l'identité complète de chaque marqué
 *      (Trait, don, nature d'âme, marque, jauges). ◂ ▸ pour changer de héros.
 *  ▶ REPRISES — chaque chargement de sauvegarde est compté. À 5, 10, 20…
 *      Celui qui est Tombé laisse des traces. (script: $gameSystem._reprises)
 */
(function () {
    'use strict';
    function log(t) { if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t); }

    //── PURGE : transvaser, jamais effacer ──
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        var C = String(cmd).toUpperCase();
        if (C === 'PURGE') {
            var sub = (args[0] || '').toLowerCase(), id = parseInt(args[1]) || 1;
            try {
                if (sub === 'bete' && window.Corruption) {
                    window.Corruption.purge(id, 30);
                    if (window.Errance) window.Errance.add(id, 10);
                    log('\\C[23]La Bête reflue…\\C[0] \\C[2]mais le mal se déplace (+10 Errance).\\C[0]');
                } else if (sub === 'errant' && window.Errance) {
                    window.Errance.purge(id, 30);
                    if (window.Ame) window.Ame.mauvais(id, 2);
                    log('\\C[23]L\'Errance reflue…\\C[0] \\C[2]mais le Lac garde sa part (−2 lucidité).\\C[0]');
                } else if (sub === 'dement' && window.Ame) {
                    window.Ame.bon(id, 3);
                    if (window.Corruption) window.Corruption.add(id, 10);
                    log('\\C[23]L\'esprit s\'apaise…\\C[0] \\C[2]mais le corps paie (+10 Corruption).\\C[0]');
                }
            } catch (e) {}
        }
        if (C === 'GRAVER') {
            var quoi = (args[0] || '').toLowerCase();
            var MAP = { entrave: 65, renvoi: 66, saignee: 67 };
            var itemId = MAP[quoi];
            if (itemId && $gameVariables) {
                var souls = $gameVariables.value(15);
                if (souls >= 5) {
                    $gameVariables.setValue(15, souls - 5);
                    $gameParty.gainItem($dataItems[itemId], 1);
                    log('\\C[23]Le Graveur inscrit la Parole en chiffres.\\C[0] (−5 âmes → ' + $dataItems[itemId].name + ')');
                } else {
                    log('\\C[8]« Pas d\'âmes, pas de gravure. » (5 âmes requises)\\C[0]');
                }
            }
        }
        if (C === 'FICHE') SceneManager.push(Scene_FicheMarque);
    };

    //── TRAITS DES BOSS ──
    function traitBoss(b) {
        if (!b || !b.isEnemy || !b.isEnemy()) return null;
        var e = b.enemy();
        if (!e || !e.meta || !e.meta.TraitBoss) return null;
        var parts = String(e.meta.TraitBoss).split('|');
        return { nom: (parts[0] || '').trim(), type: (parts[1] || '').trim().toLowerCase() };
    }
    var _execDmg = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _execDmg.call(this, target, value);
        var s = this.subject();
        // le boss encaisse : annonce + gel/renvoi
        var tb = traitBoss(target);
        if (tb && value > 0) {
            if (!target._tbVu) {
                target._tbVu = true;
                var w = BattleManager._logWindow;
                if (w) { w.push('addText', '\\C[18]★ TRAIT — ' + tb.nom + '\\C[0]'); w.push('wait'); }
            }
            if (tb.type === 'gel' && Math.random() < 0.10 && s && s.isAlive()) s.addState(15);
            if (tb.type === 'renvoi' && Math.random() < 0.10 && s && s.isAlive() && s !== target) {
                s.gainHp(-Math.floor(value * 0.5)); s.startDamagePopup();
            }
        }
        // le boss frappe : faim
        var sb = traitBoss(s);
        if (sb && sb.type === 'faim' && value > 0 && s.isAlive()) {
            s.gainHp(Math.floor(value * 0.10)); s.startDamagePopup();
        }
    };
    var _cri = Game_Action.prototype.itemCri;
    Game_Action.prototype.itemCri = function (target) {
        var sb = traitBoss(this.subject());
        var r = _cri.call(this, target);
        if (sb && sb.type === 'rupture') return Math.min(1, r + 0.15);
        return r;
    };
    var _hit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function (target) {
        var sb = traitBoss(this.subject());
        if (sb && sb.type === 'regard') return 1;
        return _hit.call(this, target);
    };

    //── FICHE DU MARQUÉ ──
    var NATURES = { 1: 'Volonté (matérialise des armes)', 2: 'Attachement (boucliers, familiers)', 3: 'Deuil (objets liés aux morts)', 4: 'Foi (sceaux, masques)' };
    function Window_Fiche() { this.initialize.apply(this, arguments); }
    Window_Fiche.prototype = Object.create(Window_Base.prototype);
    Window_Fiche.prototype.constructor = Window_Fiche;
    Window_Fiche.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this._idx = 0; this.refresh();
    };
    Window_Fiche.prototype.refresh = function () {
        this.contents.clear();
        var members = $gameParty.members();
        if (!members.length) return;
        this._idx = ((this._idx % members.length) + members.length) % members.length;
        var a = members[this._idx], id = a.actorId(), W = this.contentsWidth(), y = 4;
        function line(w, t, size, col) { w.contents.fontSize = size; w.changeTextColor(col); }
        this.contents.fontSize = 22; this.changeTextColor('#EBC974');
        this.drawText(a.name() + ' — ' + (a.nickname() || ''), 0, y, W, 'center'); y += 40;
        var t = null; try { t = window.Traits && window.Traits.de(id); } catch (e) {}
        this.contents.fontSize = 17; this.changeTextColor('#ECE6D8');
        this.drawText('TRAIT : ' + (t ? t.nom : '—'), 16, y, W, 'left'); y += 30;
        this.drawText('Don spirituel : ' + (t ? t.don : '—'), 16, y, W, 'left'); y += 30;
        this.drawText('Nature d\'âme : ' + (NATURES[id] || 'inconnue'), 16, y, W, 'left'); y += 30;
        var me = ''; try { me = window.Marque ? window.Marque.info(id).nom : ''; } catch (e) {}
        this.drawText('Marque : ' + me, 16, y, W, 'left'); y += 30;
        var rg = ''; try { if (window.Rangs) { var d = window.Rangs.details(id); rg = d ? d.rang : ''; } } catch (e) {}
        if (rg) { this.drawText('Rang : ' + rg, 16, y, W, 'left'); y += 30; }
        var c = 0, e2 = 0, m2 = 10;
        try { c = window.Corruption ? window.Corruption.niveau(id) : 0; } catch (e) {}
        try { e2 = window.Errance ? window.Errance.niveau(id) : 0; } catch (e) {}
        try { m2 = window.Ame ? window.Ame.jauge(id) : 10; } catch (e) {}
        y += 6;
        this.changeTextColor('#B455E8'); this.drawText('la Bête : ' + c + ' / 100', 16, y, W, 'left'); y += 28;
        this.changeTextColor('#E85555'); this.drawText('l\'Errant : ' + e2 + ' / 100', 16, y, W, 'left'); y += 28;
        this.changeTextColor('#55A8E8'); this.drawText('l\'esprit : ' + m2 + ' / 10', 16, y, W, 'left'); y += 28;
        this.contents.fontSize = 14; this.changeTextColor('#7E7688');
        this.drawText('◂ ▸ changer de marqué — Échap : fermer', 0, this.contentsHeight() - 26, W, 'center');
        this.resetFontSettings();
    };
    function Scene_FicheMarque() { this.initialize.apply(this, arguments); }
    window.Scene_FicheMarque = Scene_FicheMarque;
    Scene_FicheMarque.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_FicheMarque.prototype.constructor = Scene_FicheMarque;
    Scene_FicheMarque.prototype.create = function () { Scene_MenuBase.prototype.create.call(this); this._w = new Window_Fiche(); this.addWindow(this._w); };
    Scene_FicheMarque.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('right') || Input.isTriggered('ok')) { this._w._idx++; SoundManager.playCursor(); this._w.refresh(); }
        else if (Input.isTriggered('left')) { this._w._idx--; SoundManager.playCursor(); this._w.refresh(); }
        else if (Input.isTriggered('cancel') || TouchInput.isCancelled()) { SoundManager.playCancel(); this.popScene(); }
    };

    //── LES REPRISES QUI S'ACCUMULENT ──
    var _load = DataManager.loadGame;
    DataManager.loadGame = function (savefileId) {
        var ok = _load.call(this, savefileId);
        if (ok && $gameSystem) {
            $gameSystem._reprises = ($gameSystem._reprises || 0) + 1;
            $gameSystem._repriseDire = true;
        }
        return ok;
    };
    var _mapStart = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _mapStart.call(this);
        try {
            if ($gameSystem && $gameSystem._repriseDire) {
                $gameSystem._repriseDire = false;
                var n = $gameSystem._reprises || 0;
                if (n === 5) $gameMessage.add('\\C[8]… encore toi.\\C[0]');
                else if (n === 10) $gameMessage.add('\\C[8]Dix fois. Il compte, tu sais.\\C[0]');
                else if (n === 20) { $gameMessage.add('\\C[18]CELUI QUI EST TOMBÉ te regarde remonter.\\C[0]'); try { document.title = '… encore toi.'; } catch (e) {} }
                else if (n > 20 && n % 10 === 0) $gameMessage.add('\\C[8]' + n + '. Le Fond s\'en souvient.\\C[0]');
            }
        } catch (e) {}
    };
})();
