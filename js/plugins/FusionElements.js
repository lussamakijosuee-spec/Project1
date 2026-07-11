//=============================================================================
// FusionElements.js — v1.0  ·  La Fusion des éléments (l'arbre par la somme)
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ « On crée de nouveaux éléments en additionnant deux
 * codes » : deux sorts fondamentaux lancés dans le même tour FUSIONNENT —
 * le second prend l'élément somme (Feu+Eau=Vapeur…) et frappe plus fort.
 * @author JOKO
 *
 * @param bonus
 * @text Bonus de fusion (×)
 * @type number
 * @decimals 2
 * @default 1.25
 * @desc Multiplicateur de dégâts du sort fusionné.
 *
 * @param switchId
 * @text Interrupteur requis (0 = toujours actif)
 * @type switch
 * @default 0
 * @desc Si > 0, la fusion ne marche que quand cet interrupteur est ON (ex. la « Porte de Fusion » de PortesProgression).
 *
 * @param showLog
 * @text Annoncer les fusions ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA FUSION DES ÉLÉMENTS                                              by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  « Terre(11) + Eau(9) = Plante(20) · Feu + Eau = Vapeur(17) · Feu + Terre =
 *   Lave(19) · Eau + Glace = Givre(22) · Terre + Foudre = Métal(23) ·
 *   Lumière + Ombre = Crépuscule(29). Tout l'arbre tient dans cette règle. »
 *
 *  ▶ COMMENT ÇA MARCHE (émergent, aucun tag requis) :
 *    Quand un héros lance un sort d'élément FONDAMENTAL (8-15), l'élément
 *    reste « en suspens » dans l'air jusqu'à la fin du tour. Si un héros
 *    (le même ou un allié) lance ENSUITE un sort fondamental dont le code
 *    s'additionne en un élément qui EXISTE dans la base (System.json),
 *    le second sort FUSIONNE :
 *       • il frappe avec l'ÉLÉMENT SOMME (résistances de la cible incluses) ;
 *       • ses dégâts sont multipliés par ×bonus ;
 *       • le journal l'annonce : « FUSION — Feu + Eau = Vapeur ! ».
 *    La fusion consomme l'élément en suspens. Un nouveau tour efface tout.
 *
 *  ▶ EXEMPLES DE JEU
 *    Tour 1 : Aël lance Feu (8) → « une chaleur reste en suspens… »
 *             Korrah lance un sort d'Eau (9) → 8+9=17 → FUSION : Vapeur !
 *    Les paires non déclarées dans la base (somme sans nom) ne fusionnent pas.
 *
 *  ▶ VERROUILLAGE (optionnel) : paramètre switchId — idéal avec la « Porte de
 *    Fusion » (PortesProgression l'allume quand 2 arts atteignent le niv 2).
 *
 *  Script :  Fusion.enSuspens()  → id de l'élément en suspens (0 si aucun).
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('FusionElements');
    var BONUS = parseFloat(P['bonus'] || 1.25);
    var SWITCH = parseInt(P['switchId'] || 0);
    var SHOW = String(P['showLog'] || 'true') === 'true';

    var FONDAMENTAUX_MIN = 8, FONDAMENTAUX_MAX = 15;

    var pending = { el: 0, turn: -1, name: '' };

    function log(t) {
        if (!SHOW) return;
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) w.addText(t);
    }
    function actif() { return SWITCH <= 0 || ($gameSwitches && $gameSwitches.value(SWITCH)); }
    function elName(id) {
        var n = $dataSystem && $dataSystem.elements && $dataSystem.elements[id];
        return n ? String(n).trim() : '';
    }
    function isFondamental(el) { return el >= FONDAMENTAUX_MIN && el <= FONDAMENTAUX_MAX; }
    function actionElement(action) {
        var it = action && action.item && action.item();
        return (it && it.damage && it.damage.elementId > 0) ? it.damage.elementId : 0;
    }
    function isSort(action) {
        var it = action && action.item && action.item();
        return !!(it && action.isSkill && action.isSkill() && (it.mpCost || 0) > 0);
    }

    window.Fusion = { enSuspens: function () { return pending.turn === curTurn() ? pending.el : 0; } };
    function curTurn() { return ($gameTroop && $gameTroop.turnCount) ? $gameTroop.turnCount() : 0; }

    // Décision de fusion : une fois par action, au moment de l'exécution.
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        if (this._fusionDecidee === undefined && $gameParty.inBattle()) {
            this._fusionDecidee = true;
            this._fusionEl = 0;
            var s = this.subject();
            var el = actionElement(this);
            if (actif() && s && s.isActor && s.isActor() && isSort(this) && isFondamental(el)) {
                var t = curTurn();
                if (pending.turn === t && pending.el > 0) {
                    var somme = pending.el + el;
                    var nom = elName(somme);
                    if (nom) {
                        this._fusionEl = somme;
                        log('\\C[17]✦ FUSION — ' + elName(pending.el) + ' + ' + elName(el) + ' = ' + nom + ' !\\C[0]');
                        if ($gameScreen) $gameScreen.startFlash([200, 220, 255, 130], 24);
                        pending.el = 0; pending.turn = -1;   // consommé
                    }
                }
                if (!this._fusionEl) {
                    pending.el = el; pending.turn = t;
                    log('\\C[16]' + elName(el) + ' reste en suspens dans l\'air…\\C[0]');
                }
            }
        }
        _apply.call(this, target);
    };

    // L'élément somme remplace l'élément du sort (résistances incluses).
    var _calcElem = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function (target) {
        if (this._fusionEl > 0) return target.elementRate(this._fusionEl);
        return _calcElem.call(this, target);
    };

    // Bonus de dégâts du sort fusionné.
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _mdv.call(this, target, critical);
        if (v > 0 && this._fusionEl > 0) v = Math.floor(v * BONUS);
        return v;
    };

    // Nettoyage entre combats.
    var _startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        pending.el = 0; pending.turn = -1;
        _startBattle.call(this);
    };
})();
