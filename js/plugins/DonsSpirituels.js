//=============================================================================
// DonsSpirituels.js — v1.0  ·  Le Don Spirituel : Arme, Objet ou Familier
// RPG Maker MV   ·   d'après le Codex des Trois Sources, chapitre 6
//   À charger APRÈS ObjetSpirituel, Errance et JadeEntitePlunging.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le Don Spirituel : 80% une ARME, 18% un OBJET, 2% un
 * FAMILIER. Jauge d'Endurance qui s'use à l'usage et se répare au repos —
 * une fois brisé, le Don marche encore mais tout ce qu'il apporte est divisé par deux.
 * @author JOKO
 *
 * @param usureParUsage
 * @text Usure — points perdus par action
 * @type number
 * @min 0
 * @default 1
 * @desc Endurance perdue à chaque action offensive employant le Don.
 *
 * @param endurBase
 * @text Endurance — base
 * @type number
 * @min 1
 * @default 40
 *
 * @param endurParNiveau
 * @text Endurance — gain par niveau
 * @type number
 * @min 0
 * @default 2
 * @desc « Plus tu es puissant, plus ton Don résiste » (Codex §6.2).
 *
 * @param endurParPalier
 * @text Endurance — gain par palier de l'Objet Spirituel
 * @type number
 * @min 0
 * @default 20
 * @desc Éclat → Forme → Résonance → Vérité : un Éclat casse vite, une Vérité presque jamais.
 *
 * @param maluxCasse
 * @text Don brisé — multiplicateur
 * @type number
 * @decimals 2
 * @default 0.50
 * @desc Ce que devient tout ce qu'apporte le Don une fois brisé. 0.50 = divisé par deux.
 *
 * @param ombreMax
 * @text Amulette de Ludwing — capacité de la jauge d'Ombre
 * @type number
 * @min 10
 * @default 100
 *
 * @param ombreParUsage
 * @text Amulette — Ombre gagnée par technique d'ombre
 * @type number
 * @min 1
 * @default 12
 *
 * @param ombreBlocage
 * @text Amulette — tours de blocage après l'explosion
 * @type number
 * @min 1
 * @default 4
 *
 * @param sangCoutPct
 * @text Masque de Vesper brisé — % des PV max payés par attaque de sang
 * @type number
 * @min 0
 * @default 8
 *
 * @param familierBonus
 * @text Familier — bonus passif (%)
 * @type number
 * @min 0
 * @default 10
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE DON SPIRITUEL                                    Codex, chapitre 6
 * ═══════════════════════════════════════════════════════════════════════════
 *  Le Don n'est pas remis : il APPARAÎT de lui-même, à la première fois que
 *  le marqué se sert vraiment de son âme. Trois formes :
 *
 *    ⚔️  L'ARME (80 %)      — aucun effet. Seulement sa résistance.
 *    🔮  L'OBJET (18 %)     — n'importe quelle forme, mais un effet ou un
 *                             talent, et une seconde jauge qui se paie cher.
 *    👤  LE FAMILIER (2 %)  — une créature née de l'âme, qui peut porter un
 *                             Trait à elle : son porteur en a alors DEUX.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  L'ENDURANCE — commune aux trois formes
 *  ─────────────────────────────────────────────────────────────────────────
 *  Elle s'use à l'usage et se restaure au repos (auberge, soin complet,
 *  commande DON reparer). À zéro le Don CASSE — mais reste utilisable :
 *  tout ce qu'il apporte est simplement divisé par deux.
 *  Le maximum monte avec le niveau : un Éclat casse vite, une Vérité non.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LES DONS DES QUATRE MARQUÉS
 *  ─────────────────────────────────────────────────────────────────────────
 *  ▶ VESPER — LE MASQUE  (objet)
 *      Tant qu'il tient, elle use de son sang SANS SE BLESSER.
 *      Brisé : chaque attaque de sang lui coûte sangCoutPct % de ses PV max,
 *      et sa régénération faiblit de moitié.
 *
 *  ▶ KORRAH — L'ARMURE VOLANTE  (familier)
 *      Des poings et un torse qui flottent sans corps. Il porte le Trait
 *      HIVER : elle manipule la glace sans formule — et le froid l'atteint
 *      elle aussi. Bonus passif permanent tant que le familier est entier.
 *
 *  ▶ LUDWING — L'AMULETTE  (objet)
 *      Elle absorbe les ombres et les lui rend maniables : c'est elle qui
 *      donne l'impression qu'il a deux Traits alors qu'il n'en a qu'un.
 *      Sa jauge d'Ombre se remplit à chaque technique d'ombre. Pleine, elle
 *      EXPLOSE : capacités d'ombre bloquées quelques tours, et absorption
 *      d'âmes deux fois moins efficace pendant ce temps.
 *
 *  ▶ AËL — L'ARC ET SES FLÈCHES  (arme)
 *      Aucun effet. Juste une arme qui ne cède pas — et c'est exactement
 *      la sécurité qu'il faut à MIRACLE, un Trait qui se matérialise en
 *      flèches (règle d'or : le Don répond au danger que le Trait fait courir).
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  RECONNAISSANCE DES TECHNIQUES
 *  ─────────────────────────────────────────────────────────────────────────
 *  Les techniques d'ombre  : types de compétence 11 à 18, ou note <Ombre>
 *  Les techniques de sang  : type de compétence 10,      ou note <Sang>
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  COMMANDES DE PLUGIN
 *  ─────────────────────────────────────────────────────────────────────────
 *    DON reparer            → répare les Dons de tout le groupe
 *    DON reparer 3          → répare celui de l'acteur 3
 *    DON casser 3           → brise celui de l'acteur 3 (scénario)
 *    DON afficher           → écran de lecture des Dons du groupe
 *
 *  SCRIPT :  window.Dons.de(actorId)        → {type, nom, endurance, max, casse}
 *            window.Dons.estCasse(actorId)  → true/false
 *            window.Dons.ombre(3)           → jauge d'Ombre de Ludwing
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('DonsSpirituels');
    var USURE      = parseInt(P['usureParUsage']  || 1);
    var END_BASE   = parseInt(P['endurBase']      || 40);
    var END_NIV    = parseInt(P['endurParNiveau'] || 2);
    var END_PAL    = parseInt(P['endurParPalier'] || 20);
    var MALUS      = parseFloat(P['maluxCasse']   || 0.5);
    var OMBRE_MAX  = parseInt(P['ombreMax']       || 100);
    var OMBRE_USE  = parseInt(P['ombreParUsage']  || 12);
    var OMBRE_BLOC = parseInt(P['ombreBlocage']   || 4);
    var SANG_PCT   = parseInt(P['sangCoutPct']    || 8);
    var FAM_BONUS  = parseInt(P['familierBonus']  || 10);

    // ── Le registre : qui est né avec quoi (Codex §6.3 à §6.5) ──────────────
    var DONS = {
        1: { type: 'objet',    nom: 'le Masque',          effet: 'sang'  },
        2: { type: 'familier', nom: "l'Armure Volante",   effet: 'hiver' },
        3: { type: 'objet',    nom: "l'Amulette",         effet: 'ombre' },
        4: { type: 'arme',     nom: "l'Arc et ses Flèches", effet: ''    }
    };
    var TYPE_NOM = { arme: 'Arme spirituelle', objet: 'Objet spirituel', familier: 'Familier' };

    //=========================================================================
    // ÉTAT PERSISTANT
    //=========================================================================
    function store() {
        if (!$gameSystem) return null;
        if (!$gameSystem._donsSpi) $gameSystem._donsSpi = {};
        return $gameSystem._donsSpi;
    }
    function fiche(id) {
        var s = store();
        if (!s || !DONS[id]) return null;
        if (!s[id]) s[id] = { end: null, ombre: 0, bloc: 0, apparu: false };
        return s[id];
    }
    function acteur(id) {
        try { return $gameActors ? $gameActors.actor(id) : null; } catch (e) { return null; }
    }
    // L'arme spirituelle réellement portée (chaîne 501-516, notée <Objet Spirituel>).
    function armeSpirituelle(id) {
        try {
            var a = acteur(id);
            if (!a || !a.weapons) return null;
            var w = a.weapons();
            for (var i = 0; i < w.length; i++) {
                if (w[i] && w[i].meta && w[i].meta['Objet Spirituel']) return w[i];
            }
        } catch (e) { }
        return null;
    }
    // Palier atteint : Éclat 1 → Forme 2 → Résonance 3 → Vérité 4.
    function palierDe(id) {
        var w = armeSpirituelle(id);
        var p = w && w.meta ? parseInt(w.meta['Palier']) : 0;
        return p > 0 ? p : 1;
    }
    // Le nom du Don est celui du Codex (le Masque, l'Amulette…) ; l'arme
    // spirituellement portée en est la forme actuelle, palier après palier.
    function nomDuDon(id) {
        return DONS[id] ? DONS[id].nom : '';
    }
    function nomArme(id) {
        var w = armeSpirituelle(id);
        return (w && w.name) ? w.name : '';
    }
    function enduranceMax(id) {
        var a = acteur(id);
        return END_BASE + (a ? a.level : 1) * END_NIV + (palierDe(id) - 1) * END_PAL;
    }
    function endurance(id) {
        var f = fiche(id);
        if (!f) return 0;
        if (f.end === null) f.end = enduranceMax(id);
        return Math.max(0, Math.min(f.end, enduranceMax(id)));
    }
    function estCasse(id) { return !!DONS[id] && endurance(id) <= 0; }

    function log(t) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', t); w.push('wait'); }
        else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t);
    }

    //=========================================================================
    // RECONNAISSANCE DES TECHNIQUES
    //=========================================================================
    function estOmbre(item) {
        if (!item) return false;
        if (item.meta && item.meta.Ombre) return true;
        return item.stypeId >= 11 && item.stypeId <= 18;
    }
    function estSang(item) {
        if (!item) return false;
        if (item.meta && item.meta.Sang) return true;
        return item.stypeId === 10;
    }
    function porteurDe(battler) {
        if (!battler || !battler.isActor || !battler.isActor()) return 0;
        var id = battler.actorId();
        return DONS[id] ? id : 0;
    }

    //=========================================================================
    // API
    //=========================================================================
    window.Dons = {
        de: function (id) {
            if (!DONS[id]) return null;
            return {
                type: DONS[id].type, typeNom: TYPE_NOM[DONS[id].type], nom: nomDuDon(id),
                arme: nomArme(id), palier: palierDe(id),
                endurance: endurance(id), max: enduranceMax(id), casse: estCasse(id)
            };
        },
        estCasse: estCasse,
        ombre: function (id) { var f = fiche(id); return f ? f.ombre : 0; },
        ombreBloquee: function (id) { var f = fiche(id); return !!(f && f.bloc > 0); },
        reparer: function (id) {
            var f = fiche(id);
            if (!f) return;
            var etait = estCasse(id);
            f.end = enduranceMax(id); f.ombre = 0; f.bloc = 0;
            if (etait) {
                var a = acteur(id);
                log('\\C[24]' + (a ? a.name() : '') + ' — ' + nomDuDon(id) + ' a retrouvé sa forme.\\C[0]');
            }
        },
        casser: function (id) { var f = fiche(id); if (f) { f.end = 0; annoncerCasse(id); } },
        // multiplicateur à appliquer à tout ce qu'apporte le Don
        facteur: function (id) { return estCasse(id) ? MALUS : 1; }
    };

    function annoncerCasse(id) {
        var a = acteur(id), d = DONS[id];
        if (!a || !d) return;
        if (d.effet === 'sang') {
            log('\\C[18]✖ ' + nomDuDon(id) + ' se fend. Désormais, son sang la blesse aussi.\\C[0]');
        } else if (d.type === 'familier') {
            log('\\C[18]✖ ' + nomDuDon(id) + ' se disloque. ' + a.name() + ' se retrouve seule.\\C[0]');
        } else {
            log('\\C[18]✖ ' + nomDuDon(id) + ' est brisé. Il sert encore — mais de moitié.\\C[0]');
        }
    }

    //=========================================================================
    // APPARITION — le Don sort à la première fois qu'on se sert de son âme
    //=========================================================================
    function faireApparaitre(id) {
        var f = fiche(id), d = DONS[id], a = acteur(id);
        if (!f || f.apparu || !d || !a) return;
        f.apparu = true;
        log('\\C[6]✦ ' + a.name() + ' — ' + nomDuDon(id) + ' apparaît. (' + TYPE_NOM[d.type] + ')\\C[0]');
    }

    //=========================================================================
    // USURE — le Don s'use à l'usage
    //=========================================================================
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        try {
            if (this._donUse) return;
            var id = porteurDe(this.subject());
            if (!id || !this.isDamage || !this.isDamage()) return;
            this._donUse = true;
            faireApparaitre(id);

            var f = fiche(id);
            var avant = endurance(id);
            if (avant > 0 && USURE > 0) {
                f.end = avant - USURE;
                if (f.end <= 0) { f.end = 0; annoncerCasse(id); }
            }
            // l'amulette de Ludwing se gorge d'ombre
            if (DONS[id].effet === 'ombre' && estOmbre(this.item())) gorgerOmbre(id);
            // le masque de Vesper : le prix du sang quand il est brisé
            if (DONS[id].effet === 'sang' && estSang(this.item())) prixDuSang(id);
        } catch (e) { /* ne jamais casser un combat */ }
    };

    //=========================================================================
    // DON BRISÉ — tout ce qu'il apporte est divisé par deux
    //=========================================================================
    var _dmg = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _dmg.call(this, target, critical);
        try {
            var id = porteurDe(this.subject());
            if (id && estCasse(id) && v > 0) v = Math.floor(v * MALUS);
        } catch (e) { }
        return v;
    };

    //=========================================================================
    // 🔮 L'AMULETTE DE LUDWING — la jauge d'Ombre, et l'explosion
    //=========================================================================
    function gorgerOmbre(id) {
        var f = fiche(id);
        if (f.bloc > 0) return;
        f.ombre = Math.min(OMBRE_MAX, f.ombre + OMBRE_USE);
        if (f.ombre >= OMBRE_MAX) exploser(id);
    }
    function exploser(id) {
        var f = fiche(id), a = acteur(id);
        f.ombre = 0;
        f.bloc = OMBRE_BLOC;
        log('\\C[2]✸ ' + nomDuDon(id) + " explose — l'ombre reflue.\\C[0]");
        if (a) log("\\C[8]" + a.name() + ' ne peut plus manier les ombres, et les âmes lui échappent.\\C[0]');
    }
    // capacités d'ombre bloquées le temps qu'il récupère
    var _sealed = Game_BattlerBase.prototype.isSkillTypeSealed;
    Game_BattlerBase.prototype.isSkillTypeSealed = function (stypeId) {
        try {
            var id = porteurDe(this);
            if (id && DONS[id].effet === 'ombre' && fiche(id).bloc > 0
                && stypeId >= 11 && stypeId <= 18) return true;
        } catch (e) { }
        return _sealed.call(this, stypeId);
    };
    // le blocage s'estompe tour après tour
    var _turnEnd = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function () {
        _turnEnd.call(this);
        try {
            var id = porteurDe(this);
            if (!id) return;
            var f = fiche(id);
            if (f.bloc > 0 && --f.bloc === 0) {
                log('\\C[24]' + nomDuDon(id) + ' se recompose. Les ombres reviennent.\\C[0]');
            }
        } catch (e) { }
    };

    //=========================================================================
    // 🩸 LE MASQUE DE VESPER — le sang sans blessure, tant qu'il tient
    //=========================================================================
    function prixDuSang(id) {
        if (!estCasse(id)) return;              // masque intact : aucun prix
        var a = acteur(id);
        if (!a || SANG_PCT <= 0) return;
        var perte = Math.max(1, Math.floor(a.mhp * SANG_PCT / 100));
        a.gainHp(-Math.min(perte, a.hp - 1));
        log('\\C[18]Le sang de ' + a.name() + ' ne lui obéit plus sans douleur. (−' + perte + ')\\C[0]');
    }
    // masque brisé : la régénération faiblit de moitié
    var _regen = Game_Battler.prototype.regenerateHp;
    Game_Battler.prototype.regenerateHp = function () {
        try {
            var id = porteurDe(this);
            if (id && DONS[id].effet === 'sang' && estCasse(id)) {
                var avant = this.hp;
                _regen.call(this);
                var gagne = this.hp - avant;
                if (gagne > 0) this.gainHp(-Math.floor(gagne * (1 - MALUS)));
                return;
            }
        } catch (e) { }
        _regen.call(this);
    };

    //=========================================================================
    // 👤 LE FAMILIER DE KORRAH — bonus passif tant qu'il est entier
    //=========================================================================
    var _paramRate = Game_Battler.prototype.paramRate;
    Game_Battler.prototype.paramRate = function (paramId) {
        var r = _paramRate.call(this, paramId);
        try {
            var id = porteurDe(this);
            if (id && DONS[id].type === 'familier' && !estCasse(id)
                && (paramId === 2 || paramId === 3 || paramId === 6)) {   // ATK, DEF, AGI
                r *= 1 + FAM_BONUS / 100;
            }
        } catch (e) { }
        return r;
    };

    //=========================================================================
    // LE REPOS RÉPARE
    //=========================================================================
    var _recover = Game_Actor.prototype.recoverAll;
    Game_Actor.prototype.recoverAll = function () {
        _recover.call(this);
        try { if (DONS[this.actorId()]) window.Dons.reparer(this.actorId()); } catch (e) { }
    };

    //=========================================================================
    // COMMANDES DE PLUGIN
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'DON') return;
        var sous = (args[0] || '').toLowerCase();
        var cible = parseInt(args[1] || 0);
        if (sous === 'reparer') {
            if (cible) window.Dons.reparer(cible);
            else Object.keys(DONS).forEach(function (k) { window.Dons.reparer(parseInt(k)); });
        } else if (sous === 'casser' && cible) {
            window.Dons.casser(cible);
        } else if (sous === 'afficher') {
            SceneManager.push(Scene_Dons);
        }
    };

    //=========================================================================
    // ÉCRAN DE LECTURE — « DON afficher »
    //=========================================================================
    function Scene_Dons() { this.initialize.apply(this, arguments); }
    Scene_Dons.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Dons.prototype.constructor = Scene_Dons;
    Scene_Dons.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._w = new Window_Base(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.addWindow(this._w);
        this.dessiner();
    };
    Scene_Dons.prototype.dessiner = function () {
        var w = this._w, y = 0, lh = w.lineHeight();
        w.changeTextColor(w.textColor(6));
        w.drawText('LES DONS SPIRITUELS', 0, y, w.contentsWidth(), 'center');
        w.resetTextColor(); y += lh * 1.5;
        $gameParty.members().forEach(function (a) {
            var d = window.Dons.de(a.actorId());
            if (!d) return;
            w.changeTextColor(w.textColor(d.casse ? 18 : 24));
            w.drawText(a.name() + ' — ' + d.nom + (d.arme ? '  (' + d.arme + ')' : ''), 8, y, 420);
            w.resetTextColor();
            w.drawText(d.typeNom + '  ·  palier ' + d.palier + '/4', 440, y, 220);
            y += lh;
            var pct = d.max > 0 ? d.endurance / d.max : 0;
            w.drawGauge(24, y, 360, pct, w.textColor(d.casse ? 18 : 24), w.textColor(0));
            w.drawText('Endurance ' + d.endurance + ' / ' + d.max + (d.casse ? '   ✖ BRISÉ (÷2)' : ''),
                       400, y, 320);
            y += lh;
            if (window.Dons.ombre(a.actorId()) > 0 || window.Dons.ombreBloquee(a.actorId())) {
                w.changeTextColor(w.textColor(2));
                w.drawText('    Ombre ' + window.Dons.ombre(a.actorId()) + ' / ' + OMBRE_MAX
                           + (window.Dons.ombreBloquee(a.actorId()) ? '   ✸ explosée' : ''), 24, y, 500);
                w.resetTextColor();
                y += lh;
            }
            y += lh * 0.4;
        });
        w.changeTextColor(w.textColor(8));
        w.drawText('Un Don brisé sert encore — mais de moitié. Le repos le répare.',
                   8, Graphics.boxHeight - lh * 3, w.contentsWidth());
        w.resetTextColor();
    };
    window.Scene_Dons = Scene_Dons;
})();
