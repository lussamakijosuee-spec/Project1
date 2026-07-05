//=============================================================================
// ChutesProgression.js — v1.0 · La Chute qui se voit venir (à l'écran)
// RPG Maker MV   ·   à charger APRÈS ChutesCinematiques / ChutesDefinitives
//=============================================================================
/*:
 * @plugindesc [v1.0] Les changements d'écran des Chutes sont PROGRESSIFS : au
 * lieu de surgir d'un coup au seuil, l'écran se dégrade en fonction de la
 * montée de Corruption / Errance / folie. Additif, non destructif.
 * @author JOKO / Claude
 *
 * @param courbe
 * @text Courbe de montée
 * @type number
 * @decimals 1
 * @min 1.0
 * @max 3.0
 * @desc Plus haut = l'effet reste discret longtemps puis s'intensifie vite près du seuil. 1 = linéaire.
 * @default 1.7
 *
 * @param plancher
 * @text Seuil de visibilité (%)
 * @type number
 * @min 0
 * @max 90
 * @desc En dessous de ce % de pression, aucun effet à l'écran. Défaut 8 %.
 * @default 8
 *
 * @param maxBete
 * @text Opacité max — la Bête (violet)
 * @type number
 * @min 0
 * @max 255
 * @desc Teinte violette maximale quand la Corruption approche 100.
 * @default 95
 *
 * @param maxErrant
 * @text Opacité max — l'Errant (vignette)
 * @type number
 * @min 0
 * @max 255
 * @desc Assombrissement des bords maximal quand l'Errance approche 100.
 * @default 150
 *
 * @param maxFond
 * @text Opacité max — le Fond (folie)
 * @type number
 * @min 0
 * @max 255
 * @desc Voile verdâtre malsain maximal quand la phase mentale tombe vers 1.
 * @default 80
 *
 * @param pouls
 * @text Pouls (battement)
 * @type boolean
 * @on Oui
 * @off Non
 * @desc L'écran « respire » de plus en plus fort à mesure que la Chute approche.
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA CHUTE QUI SE VOIT VENIR
 * ═══════════════════════════════════════════════════════════════════════════
 *  Les cinématiques de ChutesCinematiques se déclenchent au seuil (100 / phase
 *  1). Ce plugin comble le AVANT : plus un héros du groupe s'approche de sa
 *  Chute, plus l'écran se dégrade — en continu, en fonction de la jauge.
 *
 *    ▶ Corruption qui monte  → voile VIOLET qui s'épaissit.
 *    ▶ Errance qui monte     → les bords de l'écran se REFERMENT (vignette).
 *    ▶ Phase mentale qui chute → voile VERDÂTRE malsain, écran qui « respire ».
 *
 *  La pression prise en compte est la PLUS FORTE du groupe, par type ; les
 *  trois voiles peuvent se cumuler si plusieurs héros tombent différemment.
 *  Tout est lissé : même si une jauge saute d'un coup, l'écran glisse
 *  doucement vers son nouvel état (jamais de à-coup).
 *
 *  Quand un héros est finalement perdu (ChutesDefinitives le retire du groupe),
 *  sa pression disparaît : l'écran se calme tout seul. Le monde « respire »
 *  de nouveau, comme si de rien n'était.
 *
 *  N'écrit PAS dans la teinte d'écran ($gameScreen) : il pose ses propres
 *  calques, donc il n'entre jamais en conflit avec tes teintes d'événements.
 *
 *  COMMANDES :
 *      CHUTEPROG off / on     désactive / réactive le voile progressif
 *  SCRIPT :
 *      ChutesProg.pression()  → 0..1 (pression de Chute la plus forte)
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('ChutesProgression');
    var COURBE   = Number(P['courbe']   || 1.7);
    var PLANCHER = Number(P['plancher'] || 8) / 100;
    var MAX_BETE   = Number(P['maxBete']   || 95);
    var MAX_ERRANT = Number(P['maxErrant'] || 150);
    var MAX_FOND   = Number(P['maxFond']   || 80);
    var POULS = String(P['pouls'] || 'true') === 'true';

    // ---- lecture des jauges (mêmes sources que les autres plugins Chutes) ----
    function jCorr(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function jErr(id)  { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }

    // Transforme une pression brute 0..1 en pression ressentie (plancher + courbe)
    function ressenti(p) {
        if (p <= PLANCHER) return 0;
        var n = (p - PLANCHER) / (1 - PLANCHER); // 0..1 au-dessus du plancher
        return Math.pow(n.clamp(0, 1), COURBE);
    }

    // Pression max du groupe pour chaque type de Chute (0..1)
    function pressions() {
        var bete = 0, errant = 0, fond = 0;
        if ($gameParty) {
            $gameParty.members().forEach(function (m) {
                var id = m.actorId();
                bete   = Math.max(bete,   jCorr(id) / 100);
                errant = Math.max(errant, jErr(id) / 100);
                // démarre phase 2 : phase≥3 → 0, phase 2 → 0.5, phase 1 → 1
                fond   = Math.max(fond,   (3 - phase(id)) / 2);
            });
        }
        return {
            bete:   ressenti(bete.clamp(0, 1)),
            errant: ressenti(errant.clamp(0, 1)),
            fond:   ressenti(fond.clamp(0, 1))
        };
    }

    function actif() {
        return !($gameSystem && $gameSystem._chuteProgOff);
    }

    window.ChutesProg = {
        pression: function () {
            var p = pressions();
            return Math.max(p.bete, p.errant, p.fond);
        }
    };

    //=========================================================================
    // Fabrication des calques (une fois, réutilisés)
    //=========================================================================
    function bmpPlein(couleur) {
        var b = new Bitmap(Graphics.width, Graphics.height);
        b.fillAll(couleur);
        return b;
    }
    function bmpVignette() {
        var w = Graphics.width, h = Graphics.height;
        var b = new Bitmap(w, h);
        var ctx = b.context;
        var cx = w / 2, cy = h / 2;
        var inner = Math.min(w, h) * 0.28;
        var outer = Math.sqrt(cx * cx + cy * cy);
        var g = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(0.55, 'rgba(4,2,8,0.45)');
        g.addColorStop(1, 'rgba(2,0,4,1)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        if (b._setDirty) b._setDirty();
        return b;
    }

    var _bmp = { bete: null, errant: null, fond: null };
    function bmpDe(type) {
        if (_bmp[type]) return _bmp[type];
        if (type === 'bete')   _bmp.bete   = bmpPlein('#3a0f5e');       // violet profond
        if (type === 'errant') _bmp.errant = bmpVignette();            // bords qui se referment
        if (type === 'fond')   _bmp.fond   = bmpPlein('#132414');       // vert malsain
        return _bmp[type];
    }

    //=========================================================================
    // Contrôleur — opacités lissées (persistantes entre les cartes)
    //=========================================================================
    var cur = { bete: 0, errant: 0, fond: 0 }; // opacités affichées (0..255)
    var pulseT = 0;

    function cible(type, pr) {
        var maxA = type === 'bete' ? MAX_BETE : type === 'errant' ? MAX_ERRANT : MAX_FOND;
        var a = pr * maxA;
        if (POULS && pr > 0) {
            // battement de cœur : de plus en plus marqué avec la pression
            var amp = 0.10 + 0.14 * pr;
            var vitesse = 0.05 + 0.05 * pr;
            a *= (1 - amp) + amp * (0.5 + 0.5 * Math.sin(pulseT * vitesse));
        }
        return a;
    }

    function majControleur(sprites) {
        pulseT++;
        var pr = actif() ? pressions() : { bete: 0, errant: 0, fond: 0 };
        ['bete', 'errant', 'fond'].forEach(function (type) {
            var but = cible(type, pr[type]);
            // lissage : glisse doucement vers la cible (jamais d'à-coup)
            cur[type] += (but - cur[type]) * 0.10;
            if (cur[type] < 0.5) cur[type] = but < 0.5 ? 0 : cur[type];
            var sp = sprites[type];
            if (sp) sp.opacity = Math.round(cur[type].clamp(0, 255));
        });
    }

    //=========================================================================
    // Intégration à la carte : calques posés sous les fenêtres
    //=========================================================================
    var _createWindowLayer = Scene_Map.prototype.createWindowLayer;
    Scene_Map.prototype.createWindowLayer = function () {
        this._chuteProgSprites = {};
        try {
            ['bete', 'errant', 'fond'].forEach(function (type) {
                var sp = new Sprite(bmpDe(type));
                sp.opacity = Math.round(cur[type]); // continuité visuelle au changement de carte
                this._chuteProgSprites[type] = sp;
                this.addChild(sp);
            }, this);
        } catch (e) {
            this._chuteProgSprites = null;
        }
        _createWindowLayer.call(this);
    };

    var _updMap = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _updMap.call(this);
        try {
            if (this._chuteProgSprites) majControleur(this._chuteProgSprites);
        } catch (e) {}
    };

    //=========================================================================
    // Commande
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'CHUTEPROG') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'off') { if ($gameSystem) $gameSystem._chuteProgOff = true; }
        else if (sub === 'on') { if ($gameSystem) $gameSystem._chuteProgOff = false; }
    };
})();
