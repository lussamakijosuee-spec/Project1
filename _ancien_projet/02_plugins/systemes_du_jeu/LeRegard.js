//=============================================================================
// LeRegard.js — v1.0 · Lire les âmes (l'opération du Symbole)
// RPG Maker MV · by JOKO / Claude · charger APRÈS JadeEntitePlunging, Errance,
//  CorruptionAme, LoreCanon. Additif, aucun conflit (un seul hook Scene_Map).
//=============================================================================
/*:
 * @plugindesc [v1.0] Le Regard : lis l'âme de tout PNJ/ennemi — sa nature, sa
 * marque, une vérité cachée. Détecte les menteurs et les âmes errantes
 * déguisées. Plus tu es lucide (proche du Lac), plus tu vois profond.
 * @author JOKO / Claude
 *
 * @param touche
 * @text Touche du Regard
 * @type string
 * @default r
 * @desc Touche clavier qui déclenche le Regard sur le PNJ en face (défaut : r).
 *
 * @param seuilVerite
 * @text Lucidité — voir la vérité
 * @type number
 * @min 0
 * @max 9
 * @default 3
 * @desc Lucidité (0-9) requise pour entendre la vérité chuchotée d'une âme.
 *
 * @param seuilMensonge
 * @text Lucidité — démasquer menteurs & errants
 * @type number
 * @min 0
 * @max 9
 * @default 5
 * @desc Lucidité pour voir qui ment et repérer une âme errante déguisée.
 *
 * @param seuilMur
 * @text Lucidité — les vérités du Mur
 * @type number
 * @min 0
 * @max 9
 * @default 7
 * @desc Lucidité pour lire ce qui se cache au plus profond (méta / interdit).
 *
 * @param sons
 * @text Sons du Regard
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE REGARD — la discipline reine des clans de l'Est
 * ═══════════════════════════════════════════════════════════════════════════
 *  Lire une âme, c'est voir sa nature, sa masse, sa santé, l'état de sa marque.
 *  Le Regard dit qui ment, qui faiblit, qui se brise. Ici, il te sert à
 *  ENQUÊTER : repère les menteurs, débusque les âmes errantes déguisées en
 *  vivants, et arrache aux gens des vérités qu'ils n'avoueraient jamais.
 *
 *  ▶ COMMENT — sur la carte, place-toi FACE à un PNJ (ou un ennemi de carte)
 *    et appuie sur la touche du Regard (défaut : R). L'âme s'ouvre à toi.
 *
 *  ▶ CE QUE TU VOIS dépend de ta LUCIDITÉ — c'est-à-dire de la profondeur du
 *    Lac où descend le chef de groupe. Plus sa santé mentale est basse (plus il
 *    est proche du Dément), plus il voit loin. La folie a ce prix, et ce don.
 *      • Toujours          : la NATURE de l'âme + l'état de sa MARQUE.
 *      • Lucidité ≥ 3      : la VÉRITÉ chuchotée (ce que l'être tait).
 *      • Lucidité ≥ 5      : les MENTEURS (leurs mots trahissent leur âme) et
 *                            les ÂMES ERRANTES déguisées en vivants.
 *      • Lucidité ≥ 7      : les vérités du MUR — ce qu'il ne faut pas savoir.
 *
 *  ▶ MARQUER TES PNJ — dans les commentaires d'une page d'événement :
 *      <Ame: colère>        nature : volonte|attachement|colere|foi|deuil|curiosite
 *      <Marque: fêlée>      état : pleine|felee|affamee|gonflee|creuse (déf. pleine)
 *      <Verite: il a menti au tribunal pour sauver son frère>
 *      <Menteur>            ses paroles ne collent pas à son âme
 *      <AmeErrante>         ce n'est pas un vivant (prédateur d'essence déguisé)
 *      <Mur: il sait qu'il est un personnage. Il attend la prochaine Reprise.>
 *    Rien de tout ça n'est obligatoire : sans <Ame>, l'être est « illisible ».
 *
 *  ▶ ENNEMIS — notetag <Ame: x> / <Marque: x> / <Verite: ...> sur l'ennemi ;
 *    lisible sur un ennemi de carte (ChaseEnemies) comme un PNJ.
 *
 *  COMMANDES :
 *      REGARD                 lit le PNJ en face (comme la touche)
 *      REGARD event <id>      lit un événement précis (mise en scène)
 *  SCRIPT :
 *      LeRegard.lucidite()    → 0..9 (profondeur du chef dans le Lac)
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('LeRegard');
    var TOUCHE = String(P['touche'] || 'r').toLowerCase();
    var S_VERITE = Number(P['seuilVerite'] || 3);
    var S_MENSONGE = Number(P['seuilMensonge'] || 5);
    var S_MUR = Number(P['seuilMur'] || 7);
    var SONS = String(P['sons'] || 'true') === 'true';

    //--- Lucidité du chef = profondeur dans le Lac (santé mentale basse) --------
    function jauge(id) { try { return window.Ame ? (Ame.jauge(id) || 7) : 7; } catch (e) { return 7; } }
    function lucidite() {
        var l = $gameParty && $gameParty.leader();
        if (!l) return 3;
        // jauge 1 (Dément) → lucidité 9 ; jauge 10 (stable) → lucidité 0
        return Math.max(0, Math.min(9, 10 - jauge(l.actorId())));
    }
    window.LeRegard = { lucidite: lucidite };

    function son(name, pitch, vol) {
        if (!SONS) return;
        try { AudioManager.playSe({ name: name, pitch: pitch || 100, volume: vol == null ? 70 : vol, pan: 0 }); } catch (e) {}
    }

    //--- Natures d'âme (codex : ce que l'âme matérialise) -----------------------
    var NATURES = {
        volonte:     { nom: 'Volonté',     col: '#e0b24a', desc: 'lames, outils de conquête.' },
        attachement: { nom: 'Attachement', col: '#5fb0e0', desc: 'gardiens, familiers, boucliers.' },
        colere:      { nom: 'Colère',      col: '#d0402a', desc: 'objets cruels, voraces, instables.' },
        foi:         { nom: 'Foi',         col: '#e6d38a', desc: 'sceaux, reliques, masques rituels.' },
        deuil:       { nom: 'Deuil',       col: '#8a7fd0', desc: 'échos, présences, objets des morts.' },
        curiosite:   { nom: 'Curiosité',   col: '#5fd6b0', desc: 'clés, lentilles, objets qui révèlent.' }
    };
    function natureInfo(k) {
        k = String(k || '').toLowerCase().replace(/[éè]/g, 'e');
        return NATURES[k] || null;
    }
    //--- États de marque (codex) ------------------------------------------------
    var MARQUES = {
        pleine:  { nom: 'Pleine',  col: '#7fd07f', sens: 'âme saine, en croissance.' },
        felee:   { nom: 'Fêlée',   col: '#e0a24a', sens: 'trauma ; elle matérialise mal.' },
        affamee: { nom: 'Affamée', col: '#c0632a', sens: 'âme qui s\'épuise — en danger.' },
        gonflee: { nom: 'Gonflée', col: '#9b6fd8', sens: 'nourrie d\'autres âmes — la voie de l\'Errant.' },
        creuse:  { nom: 'Creuse',  col: '#6a6a78', sens: 'âme vidée ; un corps sans feu.' }
    };
    function marqueInfo(k) {
        k = String(k || 'pleine').toLowerCase().replace(/[éè]/g, 'e');
        return MARQUES[k] || MARQUES.pleine;
    }

    //--- Extraction des données d'âme d'un événement ----------------------------
    function litCommentaires(ev) {
        var out = { ame: null, marque: 'pleine', verite: null, menteur: false, errante: false, mur: null };
        if (!ev || !ev.page || !ev.page()) return out;
        var txt = '';
        ev.page().list.forEach(function (c) {
            if (c.code === 108 || c.code === 408) txt += c.parameters[0] + '\n';
        });
        var m;
        if ((m = /<Ame:\s*([^>]+)>/i.exec(txt))) out.ame = m[1].trim();
        if ((m = /<Marque:\s*([^>]+)>/i.exec(txt))) out.marque = m[1].trim();
        if ((m = /<Verite:\s*([^>]+)>/i.exec(txt))) out.verite = m[1].trim();
        if ((m = /<Mur:\s*([^>]+)>/i.exec(txt))) out.mur = m[1].trim();
        if (/<Menteur>/i.test(txt)) out.menteur = true;
        if (/<AmeErrante>/i.test(txt)) out.errante = true;
        return out;
    }

    //--- Événement en face du joueur --------------------------------------------
    function eventEnFace() {
        if (!$gamePlayer || !$gameMap) return null;
        var d = $gamePlayer.direction();
        var x = $gameMap.roundXWithDirection($gamePlayer.x, d);
        var y = $gameMap.roundYWithDirection($gamePlayer.y, d);
        var evs = $gameMap.eventsXy(x, y);
        // tolère aussi un PNJ « traversable » : cherche sur la case exacte
        if (!evs.length) evs = $gameMap.eventsXy(x, y);
        return evs.length ? evs[0] : null;
    }

    //=========================================================================
    // Fenêtre du Regard — un vitrail d'âme qui s'ouvre
    //=========================================================================
    function Window_Regard() { this.initialize.apply(this, arguments); }
    Window_Regard.prototype = Object.create(Window_Base.prototype);
    Window_Regard.prototype.constructor = Window_Regard;

    Window_Regard.prototype.initialize = function () {
        var w = Math.min(560, Graphics.boxWidth - 40);
        var h = 320;
        var x = (Graphics.boxWidth - w) / 2, y = (Graphics.boxHeight - h) / 2;
        Window_Base.prototype.initialize.call(this, x, y, w, h);
        this.opacity = 0; this.contentsOpacity = 0;
        this._fade = 1; this._life = 0; this._data = null; this._nom = '';
        this.hide();
    };
    Window_Regard.prototype.standardPadding = function () { return 20; };

    Window_Regard.prototype.montrer = function (data, nom) {
        this._data = data; this._nom = nom || 'Cette âme';
        this._fade = 1; this._life = 0;
        this.show(); this.refresh();
    };
    Window_Regard.prototype.fermer = function () { this._fade = -1; };

    Window_Regard.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if (!this.visible) return;
        if (this._fade > 0) {
            this.opacity = Math.min(220, this.opacity + 24);
            this.contentsOpacity = Math.min(255, this.contentsOpacity + 28);
            this._life++;
            if (Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isTriggered()) {
                if (this._life > 12) this.fermer();
            }
        } else {
            this.opacity -= 24; this.contentsOpacity -= 28;
            if (this.opacity <= 0) { this.hide(); this._data = null; }
        }
    };

    // petit sigil procédural coloré par la nature
    Window_Regard.prototype.dessinerSigil = function (cx, cy, r, col, marqueCol, etat) {
        var ctx = this.contents.context;
        ctx.save();
        ctx.globalAlpha = 0.9;
        // halo
        var g = ctx.createRadialGradient(cx, cy, 1, cx, cy, r * 1.6);
        g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.6, 0, Math.PI * 2); ctx.fill();
        // anneau de la marque (pointillé si fêlée, rétracté si affamée/creuse)
        ctx.strokeStyle = marqueCol; ctx.lineWidth = 3;
        var rr = r * (etat === 'affamee' || etat === 'creuse' ? 0.62 : 1);
        var n = 40, casse = (etat === 'felee' || etat === 'creuse');
        ctx.beginPath();
        for (var i = 0; i <= n; i++) {
            var a = (i / n) * Math.PI * 2;
            if (casse && (i % 7 === 0)) { ctx.stroke(); ctx.beginPath(); continue; }
            var wob = etat === 'gonflee' ? (1 + 0.14 * Math.sin(a * 3)) : 1;
            var px = cx + Math.cos(a) * rr * wob, py = cy + Math.sin(a) * rr * wob;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        // cœur de l'âme
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.28, 0, Math.PI * 2); ctx.fill();
        if (this.contents._setDirty) this.contents._setDirty();
        ctx.restore();
    };

    Window_Regard.prototype.refresh = function () {
        this.contents.clear();
        var d = this._data, lu = lucidite(), W = this.contentsWidth();
        this.changeTextColor('#c9b7ff');
        this.drawText('◈ LE REGARD', 0, 0, W, 'left');
        this.changeTextColor('#8d8d9c');
        this.drawText('lucidité ' + lu + '/9', 0, 0, W, 'right');
        this.resetTextColor();

        // âme illisible ?
        if (!d || !d.ame || !natureInfo(d.ame)) {
            this.changeTextColor('#8d8d9c');
            this.drawText(this._nom, 0, 60, W, 'center');
            this.drawText('— âme close, illisible —', 0, 100, W, 'center');
            this.resetTextColor();
            return;
        }
        var nat = natureInfo(d.ame), mq = marqueInfo(d.marque);
        this.dessinerSigil(70, 130, 46, nat.col, mq.col, String(d.marque || 'pleine').toLowerCase().replace(/[éè]/g, 'e'));

        var x = 150, y = 44, lh = 32;
        this.changeTextColor('#e8e8f0'); this.drawText(this._nom, x, y, W - x - 8); y += lh + 4;
        this.changeTextColor(nat.col); this.drawText('Nature : ' + nat.nom, x, y, W - x - 8); y += lh;
        this.changeTextColor('#a9a9b8'); this.drawTextEx('\\}' + nat.desc + '\\{', x + 12, y); y += lh;
        this.changeTextColor(mq.col); this.drawText('Marque : ' + mq.nom, x, y, W - x - 8); y += 28;
        this.changeTextColor('#a9a9b8'); this.drawTextEx('\\}' + mq.sens + '\\{', x + 12, y); y += 34;

        // niveaux de lecture selon la lucidité
        var full = this.contentsWidth();
        if (d.errante && lu >= S_MENSONGE) {
            this.changeTextColor('#7f8cff');
            this.drawText('⚠ Ce n\'est pas un vivant. Une âme errante, déguisée.', 0, y, full); y += 30;
        }
        if (d.menteur && lu >= S_MENSONGE) {
            this.changeTextColor('#d0642a');
            this.drawText('✕ Ses mots ne collent pas à son âme. Il ment.', 0, y, full); y += 30;
        }
        if (d.verite) {
            if (lu >= S_VERITE) {
                this.changeTextColor('#cfe6ea');
                this.drawTextEx('\\}« ' + d.verite + ' »\\{', 8, y); y += 30;
            } else {
                this.changeTextColor('#6a6a78');
                this.drawText('— quelque chose se tait, trop profond pour toi —', 0, y, full); y += 30;
            }
        }
        if (d.mur && lu >= S_MUR) {
            this.changeTextColor('#b07cff');
            this.drawTextEx('\\}⊘ ' + d.mur + '\\{', 8, y); y += 30;
        }
    };

    //=========================================================================
    // Intégration carte
    //=========================================================================
    var _createDisp = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function () {
        _createDisp.call(this);
        this._regard = new Window_Regard();
        this.addWindow(this._regard);
    };

    function lireEvent(scene, ev) {
        if (!scene || !scene._regard) return false;
        if (!ev) {
            son('Buzzer', 80, 40);
            scene._regard.montrer(null, 'Rien à lire ici.');
            return false;
        }
        var data = litCommentaires(ev);
        var nom = data.ame && natureInfo(data.ame) ? 'Une âme' : 'Cette présence';
        // le nom réel peut venir d'un <Nom: ...> optionnel
        var txt = '';
        if (ev.page()) ev.page().list.forEach(function (c) { if (c.code === 108 || c.code === 408) txt += c.parameters[0] + '\n'; });
        var mn = /<Nom:\s*([^>]+)>/i.exec(txt);
        if (mn) nom = mn[1].trim();
        son(data.errante && lucidite() >= S_MENSONGE ? 'Darkness2' : 'Saint3', data.errante ? 70 : 120, 55);
        if (data.errante && lucidite() >= S_MENSONGE) $gameScreen.startFlash([80, 90, 200, 90], 30);
        scene._regard.montrer(data, nom);
        return true;
    }

    // touche clavier dédiée (indépendante de la config YEP)
    var _pressed = false;
    document.addEventListener('keydown', function (e) {
        if ((e.key || '').toLowerCase() === TOUCHE) _pressed = true;
    });
    var _upd = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _upd.call(this);
        try {
            if (_pressed) {
                _pressed = false;
                if (this._regard && !this._regard.visible &&
                    !$gameMessage.isBusy() && $gamePlayer.canMove() && !$gameMap.isEventRunning()) {
                    lireEvent(this, eventEnFace());
                }
            }
        } catch (er) {}
    };
    // bloque le déplacement tant que le vitrail est ouvert
    var _canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function () {
        var sc = SceneManager._scene;
        if (sc && sc._regard && sc._regard.visible && sc._regard._fade > 0) return false;
        return _canMove.call(this);
    };

    //=========================================================================
    // Commande
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'REGARD') return;
        var sc = SceneManager._scene;
        if (!(sc instanceof Scene_Map)) return;
        if ((args[0] || '').toLowerCase() === 'event') {
            var ev = $gameMap.event(parseInt(args[1]));
            lireEvent(sc, ev);
        } else {
            lireEvent(sc, eventEnFace());
        }
    };
})();
