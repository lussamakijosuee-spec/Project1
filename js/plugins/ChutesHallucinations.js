//=============================================================================
// ChutesHallucinations.js — v1.0 · Voir ce qui n'existe pas
// RPG Maker MV   ·   à charger APRÈS ChutesProgression
//=============================================================================
/*:
 * @plugindesc [v1.0] Avant la Chute, on hallucine — de plus en plus. L'ERRANT
 * voit des âmes errantes / créatures d'ombre ; le DÉMENT voit un faux monde
 * enfantin (dessins, sourires, gens qui n'existent pas) qui vire au cauchemar.
 * @author JOKO / Claude
 *
 * @param courbe
 * @text Courbe de montée
 * @type number
 * @decimals 1
 * @min 1.0
 * @max 3.0
 * @desc Discret longtemps, puis de plus en plus fréquent près du seuil. 1 = linéaire.
 * @default 1.8
 *
 * @param plancher
 * @text Seuil d'apparition (%)
 * @type number
 * @min 0
 * @max 90
 * @desc En dessous de ce % de pression, aucune hallucination. Défaut 12 %.
 * @default 12
 *
 * @param maxSimultane
 * @text Apparitions simultanées max
 * @type number
 * @min 1
 * @max 10
 * @default 4
 *
 * @param sons
 * @text Sons feutrés
 * @type boolean
 * @on Oui
 * @off Non
 * @desc Chuchotements / rires étouffés que « lui seul » entend.
 * @default true
 *
 * @param errantActif
 * @text Hallucinations de l'Errant
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param dementActif
 * @text Hallucinations du Dément
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  VOIR CE QUI N'EXISTE PAS
 * ═══════════════════════════════════════════════════════════════════════════
 *  Plus un héros approche de sa Chute, plus il hallucine. Les apparitions sont
 *  de simples calques posés sur la carte (sous les fenêtres) : rien
 *  d'interactif, aucun effet sur le jeu, aucun conflit avec tes images
 *  ($gameScreen n'est pas touché, aucun ID d'image réservé).
 *
 *  ▶ L'ERRANT — l'Errance monte → il commence à voir des CRÉATURES : des âmes
 *    errantes, des silhouettes d'ombre, la Bête au loin, une flaque qui bouge.
 *    Elles surgissent au bord du regard, s'attardent, puis se dissolvent.
 *    Plus l'Errance est haute, plus elles sont nettes, proches et fréquentes.
 *
 *  ▶ LE DÉMENT — la phase mentale chute → il voit un FAUX MONDE ENFANTIN :
 *    des dessins au crayon, des sourires, des « amis » gribouillés, des mots
 *    tendres que lui seul entend (« reste avec nous », « on t'aime »…). C'est
 *    son illusion de bonheur. Mais à mesure qu'il sombre, les couleurs
 *    saignent, les sourires s'étirent trop, les mots se déforment : dessous le
 *    dessin d'enfant, c'est un cauchemar. Le bonheur pour lui ; l'horreur pour
 *    tous les autres.
 *
 *  Les images d'ombre utilisées existent déjà (img/pictures) ; le monde
 *  enfantin est DESSINÉ par le plugin, donc rien à ajouter.
 *
 *  COMMANDES :
 *      CHUTEHALL off / on     désactive / réactive les hallucinations
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('ChutesHallucinations');
    var COURBE   = Number(P['courbe']   || 1.8);
    var PLANCHER = Number(P['plancher'] || 12) / 100;
    var MAX_SIM  = Number(P['maxSimultane'] || 4);
    var SONS     = String(P['sons'] || 'true') === 'true';
    var ERR_ON   = String(P['errantActif'] || 'true') === 'true';
    var DEM_ON   = String(P['dementActif'] || 'true') === 'true';

    // -- lecture des jauges (mêmes sources que les plugins Chutes) ------------
    function jErr(id)  { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }

    function ressenti(p) {
        if (p <= PLANCHER) return 0;
        var n = (p - PLANCHER) / (1 - PLANCHER);
        return Math.pow(n.clamp(0, 1), COURBE);
    }
    // pressions max du groupe (0..1)
    function pErrant() {
        var m = 0;
        if ($gameParty) $gameParty.members().forEach(function (a) { m = Math.max(m, jErr(a.actorId()) / 100); });
        return ressenti(m.clamp(0, 1));
    }
    function pDement() {
        var m = 0;
        if ($gameParty) $gameParty.members().forEach(function (a) { m = Math.max(m, (5 - phase(a.actorId())) / 4); });
        return ressenti(m.clamp(0, 1));
    }
    function actif() { return !($gameSystem && $gameSystem._chuteHallOff); }

    function son(name, pitch, vol, pan) {
        if (!SONS) return;
        try { AudioManager.playSe({ name: name, pitch: pitch, volume: vol, pan: pan || 0 }); } catch (e) {}
    }
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    //=========================================================================
    // ERRANT — créatures d'ombre (images existantes)
    //=========================================================================
    var IMG_ERRANT = ['flaque_ombre', 'stick_rampant', 'stickman_regard', 'silhouette_bete', 'brume2', 'brume3'];

    function spawnErrant(scene, pr) {
        var name = pick(IMG_ERRANT);
        var bmp;
        try { bmp = ImageManager.loadPicture(name); } catch (e) { return; }
        var sp = new Sprite(bmp);
        sp.anchor.x = 0.5; sp.anchor.y = 0.5;
        // au bord du regard : biaisé vers les bords quand la pression est faible
        var edge = Math.random() < (0.75 - 0.45 * pr);
        var w = Graphics.width, h = Graphics.height;
        sp.x = edge ? (Math.random() < 0.5 ? rnd(20, w * 0.2) : rnd(w * 0.8, w - 20)) : rnd(w * 0.2, w * 0.8);
        sp.y = rnd(h * 0.35, h * 0.9);
        if (Math.random() < 0.5) sp.scale.x = -1; // se retourne parfois
        var sc = rnd(0.7, 1.05);
        sp.scale.x *= sc; sp.scale.y = sc;
        sp.opacity = 0;
        sp._hall = {
            kind: 'errant',
            t: 0,
            fadeIn: 22,
            hold: Math.round(rnd(45, 95)),
            fadeOut: 30,
            maxOp: Math.round(45 + 150 * pr),   // plus net quand l'Errance est haute
            drift: rnd(-0.25, 0.25),
            sway: rnd(0, Math.PI * 2)
        };
        scene._hallLayer.addChild(sp);
        scene._halls.push(sp);
        if (Math.random() < 0.4) son('Darkness2', Math.round(rnd(55, 80)), Math.round(40 + 40 * pr), sp.x < w / 2 ? -60 : 60);
    }

    //=========================================================================
    // DÉMENT — faux monde enfantin dessiné au crayon (mignon → cauchemar)
    //=========================================================================
    var MOTS_DOUX = [
        'tu veux jouer ?', 'reste avec nous', 'on t\'aime très fort',
        'tu es mon ami', 'regarde comme c\'est joli', 'personne ne part',
        'pour toujours', 'coucou c\'est moi', 'tout le monde sourit ici'
    ];
    var MOTS_NOIRS = [
        'RESTE', 'TU NE PARS PAS', 'SOURIS', 'POUR TOUJOURS',
        'ILS SONT LÀ', 'C\'EST TOI QUI SAIGNES'
    ];
    var PASTEL = ['#ffd447', '#ff9ec7', '#8fd3ff', '#b6f078', '#c8a2ff'];

    // interpolation de couleur hex vers rouge sang
    function versSang(hex, t) {
        var c = hex.replace('#', '');
        var r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
        var rr = Math.round(r + (170 - r) * t), gg = Math.round(g * (1 - t)), bb = Math.round(b * (1 - t));
        return 'rgb(' + rr + ',' + gg + ',' + bb + ')';
    }
    // trait de crayon : légèrement tremblé
    function crayonLigne(ctx, x1, y1, x2, y2, col, w) {
        ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
        ctx.beginPath();
        var seg = 6, jit = w * 0.6;
        for (var i = 0; i <= seg; i++) {
            var f = i / seg;
            var px = x1 + (x2 - x1) * f + rnd(-jit, jit);
            var py = y1 + (y2 - y1) * f + rnd(-jit, jit);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }
    function crayonCercle(ctx, cx, cy, r, col, w) {
        ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
        ctx.beginPath();
        var n = 26, jit = w * 0.5;
        for (var i = 0; i <= n; i++) {
            var a = (i / n) * Math.PI * 2;
            var rr = r + rnd(-jit, jit);
            var px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }
    function crayonArc(ctx, cx, cy, r, a0, a1, col, w) {
        ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
        ctx.beginPath();
        var n = 18, jit = w * 0.4;
        for (var i = 0; i <= n; i++) {
            var a = a0 + (a1 - a0) * (i / n);
            var rr = r + rnd(-jit, jit);
            var px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    // dessine un smiley d'enfant ; corruption 0 = mignon, 1 = cauchemar
    function dessinerSmiley(ctx, cx, cy, r, base, corr) {
        var trait = versSang(base, corr * 0.9);
        // visage
        crayonCercle(ctx, cx, cy, r, trait, 4 + corr * 2);
        // yeux : ronds mignons → creux vides
        var ey = cy - r * 0.25, ex = r * 0.38, er = r * (0.12 + corr * 0.05);
        ctx.fillStyle = versSang('#3a2a1a', corr);
        [-1, 1].forEach(function (s) {
            ctx.beginPath(); ctx.arc(cx + s * ex, ey, er, 0, Math.PI * 2); ctx.fill();
            if (corr > 0.6) { // larmes qui coulent
                crayonLigne(ctx, cx + s * ex, ey + er, cx + s * ex + rnd(-3, 3), ey + er + rnd(14, 34) * corr, versSang('#8a0d0d', 1), 2);
            }
        });
        // sourire : arc doux → grimace trop large
        var smileR = r * (0.5 + corr * 0.25);
        var span = 0.55 + corr * 0.7; // s'étire trop avec la folie
        crayonArc(ctx, cx, cy + r * 0.05, smileR, Math.PI * (0.5 - span), Math.PI * (0.5 + span), versSang('#c0121b', corr), 4 + corr * 3);
        if (corr > 0.7) { // dents griffonnées
            for (var k = -3; k <= 3; k++) {
                var a = Math.PI * 0.5 + k * 0.16 * span;
                var x1 = cx + Math.cos(a) * smileR, y1 = cy + r * 0.05 + Math.sin(a) * smileR;
                crayonLigne(ctx, x1, y1, x1, y1 - 8, versSang('#c0121b', 1), 2);
            }
        }
    }
    // petit bonhomme bâton « ami »
    function dessinerAmi(ctx, cx, cy, s, col, corr) {
        var c = versSang(col, corr * 0.8);
        crayonCercle(ctx, cx, cy - s * 1.2, s * 0.5, c, 3);           // tête
        crayonLigne(ctx, cx, cy - s * 0.7, cx, cy + s * 0.6, c, 3);   // corps
        crayonLigne(ctx, cx, cy - s * 0.4, cx - s * 0.7, cy + (corr > 0.6 ? -s * 0.4 : s * 0.1), c, 3); // bras (levés = trop content)
        crayonLigne(ctx, cx, cy - s * 0.4, cx + s * 0.7, cy + (corr > 0.6 ? -s * 0.4 : s * 0.1), c, 3);
        crayonLigne(ctx, cx, cy + s * 0.6, cx - s * 0.5, cy + s * 1.3, c, 3); // jambes
        crayonLigne(ctx, cx, cy + s * 0.6, cx + s * 0.5, cy + s * 1.3, c, 3);
    }

    function spawnDement(scene, pr) {
        var W = 300, H = 300;
        var bmp = new Bitmap(W, H);
        var ctx = bmp.context;
        var base = pick(PASTEL);
        var corr = pr; // 0..1

        var kind = Math.random();
        if (kind < 0.55) {
            // un grand sourire (parfois entouré d'amis)
            dessinerSmiley(ctx, W / 2, H * 0.42, 70, base, corr);
            if (Math.random() < 0.5 + corr * 0.4) {
                dessinerAmi(ctx, W * 0.2, H * 0.55, 26, pick(PASTEL), corr);
                dessinerAmi(ctx, W * 0.8, H * 0.55, 26, pick(PASTEL), corr);
            }
        } else {
            // une petite foule d'amis qui te fixent
            for (var i = 0; i < 3 + Math.round(corr * 3); i++) {
                dessinerAmi(ctx, rnd(40, W - 40), rnd(H * 0.3, H * 0.7), rnd(20, 34), pick(PASTEL), corr);
            }
        }
        // un mot tendre que lui seul entend
        var mot = corr > 0.6 && Math.random() < corr ? pick(MOTS_NOIRS) : pick(MOTS_DOUX);
        bmp.fontFace = 'GameFont';
        bmp.fontSize = corr > 0.6 ? 26 : 22;
        bmp.fontItalic = corr < 0.5;
        bmp.textColor = versSang('#ff6fae', corr);
        bmp.outlineColor = 'rgba(0,0,0,0.4)';
        bmp.outlineWidth = 4;
        bmp.drawText(mot, 0, H - 62, W, 40, 'center');
        if (bmp._setDirty) bmp._setDirty();

        var sp = new Sprite(bmp);
        sp.anchor.x = 0.5; sp.anchor.y = 0.5;
        sp.x = rnd(W * 0.35, Graphics.width - W * 0.35);
        sp.y = rnd(H * 0.35, Graphics.height - H * 0.3);
        var sc = rnd(0.7, 1.0 + corr * 0.25);
        sp.scale.x = sc; sp.scale.y = sc;
        sp.rotation = rnd(-0.12, 0.12) * (0.5 + corr);
        sp.opacity = 0;
        sp._hall = {
            kind: 'dement',
            t: 0,
            fadeIn: 18,
            hold: Math.round(rnd(60, 120)),
            fadeOut: 26,
            maxOp: Math.round(150 + 90 * corr),
            drift: rnd(-0.15, 0.15),
            sway: rnd(0, Math.PI * 2)
        };
        scene._hallLayer.addChild(sp);
        scene._halls.push(sp);
        // rire / voix étouffée, aiguë et fausse
        son('Darkness1', Math.round(rnd(120, 150) - corr * 30), Math.round(35 + 45 * corr), Math.round(rnd(-40, 40)));
    }

    //=========================================================================
    // Cycle de vie d'une apparition
    //=========================================================================
    function majApparition(sp) {
        var d = sp._hall;
        d.t++;
        var op;
        if (d.t < d.fadeIn) op = d.maxOp * (d.t / d.fadeIn);
        else if (d.t < d.fadeIn + d.hold) op = d.maxOp;
        else {
            var f = (d.t - d.fadeIn - d.hold) / d.fadeOut;
            op = d.maxOp * (1 - f);
        }
        sp.opacity = Math.max(0, Math.round(op));
        d.sway += 0.05;
        sp.x += d.drift;
        sp.y += Math.sin(d.sway) * 0.15;
        return d.t < d.fadeIn + d.hold + d.fadeOut;
    }

    //=========================================================================
    // Intégration carte
    //=========================================================================
    var _createWindowLayer = Scene_Map.prototype.createWindowLayer;
    Scene_Map.prototype.createWindowLayer = function () {
        this._hallLayer = new Sprite();
        this._halls = [];
        this.addChild(this._hallLayer);
        _createWindowLayer.call(this);
    };

    var _updMap = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _updMap.call(this);
        try { this._majHallucinations(); } catch (e) {}
    };

    Scene_Map.prototype._majHallucinations = function () {
        if (!this._hallLayer) return;
        // cycle des apparitions vivantes
        for (var i = this._halls.length - 1; i >= 0; i--) {
            var sp = this._halls[i];
            if (!majApparition(sp)) {
                if (sp.parent) sp.parent.removeChild(sp);
                this._halls.splice(i, 1); // bitmaps procéduraux libérés par le GC
            }
        }
        if (!actif() || $gameMessage.isBusy()) return;

        var pe = ERR_ON ? pErrant() : 0;
        var pd = DEM_ON ? pDement() : 0;
        var pr = Math.max(pe, pd);
        if (pr <= 0 || this._halls.length >= MAX_SIM) { this._hallCd = this._hallCd || 0; return; }

        // cadence : plus la pression est haute, plus c'est fréquent
        this._hallCd = (this._hallCd || Math.round(rnd(60, 120)));
        this._hallCd--;
        if (this._hallCd > 0) return;
        this._hallCd = Math.round(rnd(30, 150) * (1 - 0.75 * pr)) + 15;

        // choisir le type selon la pression dominante
        var total = pe + pd;
        var errant = total > 0 ? Math.random() < pe / total : false;
        if (errant && pe > 0) spawnErrant(this, pe);
        else if (pd > 0) spawnDement(this, pd);
        else if (pe > 0) spawnErrant(this, pe);
    };

    //=========================================================================
    // Commande
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'CHUTEHALL') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'off') { if ($gameSystem) $gameSystem._chuteHallOff = true; }
        else if (sub === 'on') { if ($gameSystem) $gameSystem._chuteHallOff = false; }
    };
})();
