//=============================================================================
// LesTroisArts.js — v1.1
// Les trois arts du Premier : chaque compétence de héros en est un, et c'est
// son art qui donne son mana. Le triangle joue à chaque coup.
//=============================================================================
/*:
 * @plugindesc v1.1 ■ Les trois arts : chaque compétence de héros est une PAROLE
 * (positif), un MOUVEMENT (négatif) ou un ÉCRIT (spirituel) — et c'est l'art qui
 * donne son mana : le triangle joue à chaque coup. Un art hors de ses affinités
 * coûte plus et rend moins.
 * @author pour JOKO
 *
 * @param === LES ARTS ===
 * @default
 *
 * @param manaParole
 * @text Mana de la Parole
 * @type number
 * @default 3
 *
 * @param manaMouvement
 * @text Mana du Mouvement
 * @type number
 * @default 4
 *
 * @param manaEcrit
 * @text Mana de l'Écrit
 * @type number
 * @default 2
 *
 * @param elementsMana
 * @text Les éléments de mana
 * @default 2, 3, 4, 5, 6, 7
 * @desc Sur une compétence de héros, ils sont remplacés par celui de son art. 5 = 4, 6 = 3, 7 = 2 (JOKO).
 *
 * @param === CE QUI N'EST AUCUN ART ===
 * @default
 *
 * @param typesSansArt
 * @text Types sans art
 * @default 21, 22, 23
 * @desc 21 les ordres à seiryu (c'est lui qui agit), 22 les Styles de Vesper, 23 les Contrats et Portes d'Aël.
 *
 * @param sansArt
 * @text Compétences sans art
 * @default 2, 6, 461, 480
 * @desc La Garde, Fuir, revelation, VUE.
 *
 * @param acteursExclus
 * @text Ceux qui n'ont pas d'art
 * @default 6
 * @desc seiryu (6).
 *
 * @param === LES RÈGLES ===
 * @default
 *
 * @param typesEcrit
 * @text Types de l'écrit
 * @default 8, 9
 * @desc 8 invocation, 9 âme.
 *
 * @param typesCorps
 * @text Types du mouvement
 * @default 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 24
 * @desc BERSEK, sang, les ombres d'armes, Arts Sereins, arts.
 *
 * @param === LES AFFINITÉS ===
 * @default
 *
 * @param affinites
 * @text Les affinités des héros
 * @default 1: spirituel + négatif; 2: négatif + positif; 3: négatif + spirituel; 4: positif
 * @desc acteur: ses manas (positif = Parole, négatif = mouvement, spirituel = écrit). Un héros absent n'a pas la règle.
 *
 * @param coutHorsAffinite
 * @text Coût hors affinité
 * @default 1.5
 * @desc Multiplie le coût (PM, PT ou PV) d'un art hors de ses affinités. Jamais plus que la jauge pleine.
 *
 * @param forceHorsAffinite
 * @text Force hors affinité
 * @default 0.75
 * @desc Multiplie ses dégâts et ses soins.
 *
 * @param horsRegle
 * @text Compétences hors de la règle
 * @default 1, 71, 810, 438
 * @desc L'Attaque, et les pièces des dons : Royaume Impérial, Ténèbres Impériales, Change.
 *
 * @param typesHorsRegle
 * @text Types hors de la règle
 * @default 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26
 * @desc Les types des dons (le don est la seconde affinité) et 25, les attaques à plusieurs (chacun paie le sien).
 *
 * @param annonceHorsAffinite
 * @text Annoncer hors affinité
 * @type boolean
 * @default true
 * @desc Au-dessus du héros, quand il lance un art hors de ses affinités.
 *
 * @param === À L'ÉCRAN ===
 * @default
 *
 * @param annonceTriangle
 * @text Annoncer le triangle
 * @type boolean
 * @default true
 * @desc Au-dessus de l'ennemi : ▲ quand l'art le bat, ▼ quand il lui résiste.
 *
 * @help
 * ============================================================================
 *  LES TROIS ARTS                                                pour JOKO
 * ============================================================================
 *  La Genèse : le Premier donne aux hommes les mathématiques du mana (la
 *  PAROLE, l'Esprit), les voies d'art des mouvements (le MOUVEMENT, le Corps)
 *  et l'écriture des âmes (l'ÉCRIT, l'Âme). « Le corps attaqua l'âme, l'âme
 *  attaqua l'esprit et l'esprit attaqua le corps. »
 *
 *  JOKO, le 2026-10-20 : « Pour les paroles, tu peux utiliser que le mana
 *  positif. Et pour les mouvements, tu peux utiliser que le mana sombre. Et
 *  pour le spirituel […] que le mana spirituel. » ; le 2026-10-22 : le
 *  spirituel, « le fait d'écrire ou préparer des écrits », comme Fullmetal
 *  Alchemist ; « Oui pour les runes ».
 *
 *  L'ART D'UNE COMPÉTENCE DE HÉROS, dans cet ordre :
 *   1. <Art: parole>, <Art: mouvement>, <Art: ecrit> ou <Art: aucun> écrit
 *      sur la fiche ;
 *   2. aucun art : les types et compétences des paramètres ;
 *   3. une rune (son nom le dit) : l'écrit ;
 *   4. les 40 Paroles des échelles (1186-1225) : la Parole ;
 *   5. « Parole n°X » : n°2 et 7 l'écrit, n°4 et 5 le mouvement, les autres
 *      la Parole (le mot de passe dit le mana) ;
 *   6. types 8 et 9, éléments 2 et 7 : l'écrit ;
 *   7. <Voie:>, éléments 4 et 5, coup physique, types du corps, frappe
 *      physique : le mouvement ;
 *   8. <Parole> sur la fiche, un sort magique, un soin : la Parole ;
 *  sinon, aucun art (le soutien sans mana).
 *
 *  LE TRIANGLE — sur une compétence de héros, les éléments de mana sont
 *  remplacés par celui de son art : un mouvement de Feu frappe en Feu ET en
 *  négatif. Le Feu reste sa couleur, la roue des éléments joue toujours. Les
 *  dégâts comme la brisure des boucliers (AstfglSCB) le lisent.
 *
 *  LES AFFINITÉS (la Bible ; JOKO, le 2026-10-24 : « L'affinité unique oui
 *  c'est tout ») — chaque personne naît avec une seule affinité, et son don en
 *  ajoute une seconde. Un art hors de ses affinités « coûte plus et rend
 *  moins » : coût ×1,5 dans sa monnaie (jamais plus que la jauge pleine),
 *  dégâts et soins ×0,75. Vesper : spirituel + négatif (son sang) ; Korrah :
 *  négatif + positif (l'Hiver de seiryu) ; ludwing : négatif + spirituel (ses
 *  âmes) ; Aël : positif seul. Hors de la règle : l'Attaque, les techniques
 *  des dons (le don EST la seconde affinité), les attaques à plusieurs ;
 *  seiryu et les ennemis ne l'ont pas.
 *
 *  À L'ÉCRAN — l'aide d'une compétence dit son art : 【PAROLE · FEU】, et
 *  【PAROLE · FEU · hors affinité】 quand il l'est ; le coût affiché est le
 *  vrai ; au-dessus du héros : « ◇ Hors affinité ».
 *  Au-dessus de l'ennemi : ▲ Corps ×2 quand l'art le bat, ▼ quand il résiste.
 *
 *  LaParole, LeMouvement, MaitriseVoies et L'Écrit demandent tous l'art ici :
 *  une seule règle. Les ennemis ne changent pas. Aucune fiche n'est modifiée.
 *
 *  Script : LesTroisArts.art(compétence)  → 'parole' | 'mouvement' | 'ecrit' | ''
 *           LesTroisArts.mana(action)     → l'élément de mana de l'action (0 si aucun)
 *           LesTroisArts.affinites(héros) → ses arts, ex. ['ecrit', 'mouvement']
 *           LesTroisArts.horsAffinite(héros, compétence) → true / false
 *           LesTroisArts._sansAffinites = true coupe la règle (pour un banc).
 * ============================================================================
 */

var LesTroisArts = LesTroisArts || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('LesTroisArts');
    var nombre = function (k, d) { var v = parseInt(P[k], 10); return isNaN(v) ? d : v; };
    var decimal = function (k, d) { var v = parseFloat(String(P[k]).replace(',', '.')); return isNaN(v) ? d : v; };
    var liste = function (k, d) {
        return String(P[k] === undefined ? d : P[k]).split(',')
            .map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x); });
    };

    var MANA = { parole: nombre('manaParole', 3), mouvement: nombre('manaMouvement', 4), ecrit: nombre('manaEcrit', 2) };
    var MANAS       = liste('elementsMana', '2, 3, 4, 5, 6, 7');
    var TYPES_SANS  = liste('typesSansArt', '21, 22, 23');
    var SANS        = liste('sansArt', '2, 6, 461, 480');
    var EXCLUS      = liste('acteursExclus', '6');
    var TYPES_ECRIT = liste('typesEcrit', '8, 9');
    var TYPES_CORPS = liste('typesCorps', '5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 24');
    var ANNONCE     = String(P['annonceTriangle'] || 'true') !== 'false';
    var COUT_HORS   = decimal('coutHorsAffinite', 1.5);
    var FORCE_HORS  = decimal('forceHorsAffinite', 0.75);
    var HORS_REGLE  = liste('horsRegle', '1, 71, 810, 438');
    var TYPES_HORS  = liste('typesHorsRegle', '4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26');
    var ANNONCE_HORS = String(P['annonceHorsAffinite'] || 'true') !== 'false';

    var MOT_ECRIT = [2, 7], MOT_CORPS = [4, 5];
    var NOMS    = { parole: 'PAROLE', mouvement: 'MOUVEMENT', ecrit: 'ÉCRIT' };
    var SOURCES = { parole: 'Esprit', mouvement: 'Corps', ecrit: 'Âme' };

    function heros(b) { return !!(b && b.isActor && b.isActor() && EXCLUS.indexOf(b.actorId()) < 0); }
    function annonce(b, texte, couleur) {
        if (window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur); }
    }
    function chiffre(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }

    function elements(item) {
        var e = [];
        if (item.damage && item.damage.elementId) { e.push(item.damage.elementId); }
        (item.multipleElements || []).forEach(function (x) { if (e.indexOf(x) < 0) { e.push(x); } });
        return e;
    }
    function soin(item) {
        if (item.damage && (item.damage.type === 3 || item.damage.type === 4)) { return true; }
        return (item.effects || []).some(function (e) { return e.code === 11 || e.code === 12; });
    }

    /** L'art d'une compétence : 'parole', 'mouvement', 'ecrit', ou '' (aucun). */
    function art(item) {
        if (!item || !DataManager.isSkill(item)) { return ''; }
        var m = item.meta || {};
        if (m.Art !== undefined) {
            var t = String(m.Art).trim().toLowerCase().replace('é', 'e');
            return MANA[t] ? t : '';
        }
        if (TYPES_SANS.indexOf(item.stypeId) >= 0 || SANS.indexOf(item.id) >= 0) { return ''; }
        if (/rune/i.test(item.name || '')) { return 'ecrit'; }
        if (item.id >= 1186 && item.id <= 1225) { return 'parole'; }
        var mot = /^Parole n°\s*(\d+)/.exec(item.name || '');
        if (mot) {
            var n = +mot[1];
            return MOT_ECRIT.indexOf(n) >= 0 ? 'ecrit' : (MOT_CORPS.indexOf(n) >= 0 ? 'mouvement' : 'parole');
        }
        var els = elements(item);
        if (TYPES_ECRIT.indexOf(item.stypeId) >= 0 || els.some(function (e) { return MOT_ECRIT.indexOf(e) >= 0; })) { return 'ecrit'; }
        var frappe = !!item.damage && item.damage.type > 0;
        if (m.Voie !== undefined || els.some(function (e) { return MOT_CORPS.indexOf(e) >= 0; }) || item.hitType === 1 ||
            TYPES_CORPS.indexOf(item.stypeId) >= 0 || (frappe && (item.damage.elementId === -1 || els.indexOf(1) >= 0))) {
            return 'mouvement';
        }
        if ((m.Parole !== undefined && !m.NoParole) || item.hitType === 2 || soin(item)) { return 'parole'; }
        return '';
    }

    /** L'élément de mana d'une action de héros (0 s'il n'en a pas). */
    function mana(action) {
        if (!action || !action.isSkill || !action.isSkill() || !heros(action.subject())) { return 0; }
        var a = art(action.item());
        return a ? MANA[a] : 0;
    }

    // Le triangle : sur une compétence de héros, le mana est celui de son art.
    var _elements = Game_Action.prototype.getItemElements;
    if (_elements) {
        Game_Action.prototype.getItemElements = function () {
            var els = _elements.call(this);
            var e = mana(this);
            if (!e) { return els; }
            els = els.filter(function (x) { return MANAS.indexOf(x) < 0; });
            els.push(e);
            return els;
        };
    }

    // ▲ / ▼ au-dessus de l'ennemi, une fois par cible et par action.
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        if (ANNONCE_HORS && !this._horsVu && horsDe(this)) {
            this._horsVu = true;
            annonce(this.subject(), '◇ Hors affinité', '#b8b8c8');
        }
        if (!ANNONCE || !target || !target.isEnemy || !target.isEnemy()) { return; }
        var e = mana(this), r = target.result();
        if (!e || !r || !r.isHit() || r.hpDamage <= 0) { return; }
        this._artVu = this._artVu || [];
        if (this._artVu.indexOf(target) >= 0) { return; }
        this._artVu.push(target);
        var taux = target.elementRate(e), source = SOURCES[art(this.item())];
        if (taux > 1) { annonce(target, '▲ ' + source + ' ×' + chiffre(taux), '#8dffa8'); }
        else if (taux < 1) { annonce(target, '▼ ' + source + ' ×' + chiffre(taux), '#ffa08d'); }
    };

    // L'aide d'une compétence dit son art (et sa couleur d'élément, s'il en a une).
    var _aide = Window_SkillList.prototype.updateHelp;
    Window_SkillList.prototype.updateHelp = function () {
        var s = this.item(), a = s && this._actor && heros(this._actor) ? art(s) : '';
        if (!a || !this._helpWindow) { _aide.call(this); return; }
        var el = s.damage ? s.damage.elementId : 0;
        var nom = el > 0 && MANAS.indexOf(el) < 0 && $dataSystem.elements[el] ? ' · ' + $dataSystem.elements[el].trim().toUpperCase() : '';
        var hors = horsAffinite(this._actor, s) ? ' · hors affinité' : '';
        this._helpWindow.setText('【' + NOMS[a] + nom + hors + '】  ' + (s.description || ''));
    };

    //=========================================================================
    // Les affinités : un art hors des siennes coûte plus et rend moins
    //=========================================================================
    var DE_MANA = { positif: 'parole', negatif: 'mouvement', spirituel: 'ecrit', parole: 'parole', mouvement: 'mouvement', ecrit: 'ecrit' };
    var AFFINITES = {};
    String(P['affinites'] === undefined ? '1: spirituel + négatif; 2: négatif + positif; 3: négatif + spirituel; 4: positif' : P['affinites'])
        .split(';').forEach(function (bloc) {
            var m = /^\s*(\d+)\s*:(.*)$/.exec(bloc);
            if (!m) { return; }
            AFFINITES[+m[1]] = m[2].split(/[+,]/).map(function (x) {
                return DE_MANA[x.trim().toLowerCase().replace(/é/g, 'e')];
            }).filter(Boolean);
        });

    function affinites(b) { return heros(b) ? (AFFINITES[b.actorId()] || []).slice() : []; }
    function plusieurs(item) { return !!(item.meta && (item.meta.Combo !== undefined || item.meta['unison item actors'] !== undefined)); }

    /** Vrai si ce héros lance cette compétence hors de ses affinités. */
    function horsAffinite(b, item) {
        if (LesTroisArts._sansAffinites || !heros(b) || !item || !DataManager.isSkill(item)) { return false; }
        if (HORS_REGLE.indexOf(item.id) >= 0 || TYPES_HORS.indexOf(item.stypeId) >= 0 || plusieurs(item)) { return false; }
        var aff = AFFINITES[b.actorId()], a = art(item);
        return !!(a && aff && aff.length && aff.indexOf(a) < 0);
    }

    // Le coût : ×1,5 dans sa monnaie — jamais plus que la jauge pleine, sinon l'art ne partirait plus jamais.
    function cout(b, skill, c, max) {
        if (c <= 0 || !horsAffinite(b, skill)) { return c; }
        var plus = Math.ceil(c * COUT_HORS);
        return c <= max ? Math.min(plus, max) : plus;
    }
    var _coutPM = Game_BattlerBase.prototype.skillMpCost;
    Game_BattlerBase.prototype.skillMpCost = function (skill) { return cout(this, skill, _coutPM.call(this, skill), this.mmp); };
    var _coutPT = Game_BattlerBase.prototype.skillTpCost;
    Game_BattlerBase.prototype.skillTpCost = function (skill) { return cout(this, skill, _coutPT.call(this, skill), this.maxTp()); };
    var _coutPV = Game_BattlerBase.prototype.skillHpCost;
    if (_coutPV) {
        Game_BattlerBase.prototype.skillHpCost = function (skill) { return cout(this, skill, _coutPV.call(this, skill), this.mhp - 1); };
    }

    // Ce qu'il rend : dégâts et soins ×0,75.
    function horsDe(action) { return action.isSkill() && horsAffinite(action.subject(), action.item()); }
    var _valeur = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeur.call(this, target, critical);
        return v !== 0 && horsDe(this) ? Math.round(v * FORCE_HORS) : v;
    };
    ['itemEffectRecoverHp', 'itemEffectRecoverMp'].forEach(function (f) {
        var _soin = Game_Action.prototype[f];
        Game_Action.prototype[f] = function (target, effect) {
            if (!horsDe(this)) { return _soin.call(this, target, effect); }
            var moins = { code: effect.code, dataId: effect.dataId, value1: effect.value1 * FORCE_HORS, value2: effect.value2 * FORCE_HORS };
            return _soin.call(this, target, moins);
        };
    });

    LesTroisArts.art = art;
    LesTroisArts.mana = mana;
    LesTroisArts.manaDe = function (a) { return MANA[a] || 0; };
    LesTroisArts.heros = heros;
    LesTroisArts.affinites = affinites;
    LesTroisArts.horsAffinite = horsAffinite;
})();
