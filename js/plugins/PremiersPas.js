//=============================================================================
// PremiersPas.js — v1.0  ·  Tutoriels contextuels (une seule fois chacun)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La PREMIÈRE fois qu'un système se déclenche (corruption,
 * errance, lucidité, Voie, Surpassé, chute…), deux lignes l'expliquent au
 * joueur. Une seule fois par partie. Additif, désactivable.
 * @author JOKO
 *
 * @param actif
 * @text Tutoriels actifs ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 *  Quinze systèmes, c'est beaucoup : ce plugin explique chacun AU MOMENT où
 *  le joueur le rencontre pour la première fois — jamais avant, jamais deux
 *  fois. Les explications tiennent en 2 lignes, dans le ton du jeu.
 *
 *  Déclencheurs couverts :
 *   • 1er gain de corruption      → le prix du Corps / la Bête
 *   • 1er gain d'errance          → la Consommation / l'Errant
 *   • 1re perte de santé mentale  → la lucidité / le Dément
 *   • 1re technique de Voie       → la Maîtrise progresse par le combat
 *   • 1er état Frémissement (181) → le palier de la Bête
 *   • 1er état Surpassé (188)     → le Mana Semi-Parfait
 *   • 1re rumeur des Destins      → les autres vivent leur vie
 *
 *  Commandes :  TUTOS reset     (revoir tous les tutoriels)
 *               TUTOS off / on  (couper / réactiver en cours de partie)
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('PremiersPas');
    var ACTIF = String(P['actif'] || 'true') === 'true';

    var TUTOS = {
        corruption: ['\\C[6]— Le prix du Corps —\\C[0] Le mana sombre marque la chair : ta \\C[6]corruption\\C[0] vient de monter.',
                     'À 40, 70 et 100, le sang de bête prend le dessus. Elle redescend en marchant.'],
        errance:    ['\\C[2]— Le prix de l\'Âme —\\C[0] User de l\'âme (ou en dévorer) gonfle ton \\C[2]Errance\\C[0].',
                     'Elle rend plus fort… et fait glisser hors du monde. À 100 : l\'Errant.'],
        mental:     ['\\C[1]— La lucidité —\\C[0] Ton esprit vient d\'encaisser. Trop bas, les longues Paroles se brisent…',
                     'et tout en bas t\'attend le Dément. Les bons choix et le repos font remonter.'],
        voie:       ['\\C[6]— La Maîtrise —\\C[0] Chaque technique de Voie t\'entraîne : \\C[6]un duel est une leçon volée\\C[0].',
                     'Plus tu pratiques une Voie, plus ses effets se renforcent.'],
        fremissement: ['\\C[18]— Le Frémissement —\\C[0] Le sang s\'éveille : tes pouvoirs de l\'esprit faiblissent (MAT/MDF -10%).',
                     'Purge ta corruption avant la Fièvre… et la Mue.'],
        surpasse:   ['\\C[14]— Le Mana Semi-Parfait —\\C[0] Ni Bête, ni Errant, ni Dément : tu tiens les trois sources en tension.',
                     'Tant que l\'équilibre dure : \\C[14]+15% ATK/MAT et +10% critique\\C[0].'],
        destins:    ['\\C[16]— Les Destins parallèles —\\C[0] Les autres héros ne t\'attendent pas : ils vivent, luttent, dérivent.',
                     'Les rumeurs te diront où ils en sont. Retrouve-les avant leur Chute.']
    };

    function vus() {
        if (!$gameSystem) return {};
        if (!$gameSystem._tutosVus) $gameSystem._tutosVus = {};
        return $gameSystem._tutosVus;
    }
    function coupe() { return $gameSystem && $gameSystem._tutosOff; }

    function montrer(cle) {
        if (!ACTIF || coupe()) return;
        var v = vus();
        if (v[cle]) return;
        v[cle] = true;
        var lignes = TUTOS[cle];
        if (!lignes) return;
        // En combat : journal. Sur la carte : message.
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if ($gameParty && $gameParty.inBattle() && w) {
            lignes.forEach(function (l) { w.push('addText', l); });
            w.push('wait');
        } else if ($gameMessage && !$gameMessage.isBusy()) {
            lignes.forEach(function (l) { $gameMessage.add(l); });
        } else {
            v[cle] = false;   // occupé : on retentera
        }
    }

    //--- Patch paresseux des producteurs (peu importe l'ordre de chargement) ---
    var patched = false;
    function patcher() {
        if (patched) return;
        var ok = true;
        if (window.Corruption && !window.Corruption._ppWrap) {
            window.Corruption._ppWrap = true;
            var _cAdd = window.Corruption.add.bind(window.Corruption);
            window.Corruption.add = function (id, n) { if (n > 0) montrer('corruption'); return _cAdd(id, n); };
        } else if (!window.Corruption) ok = false;
        if (window.Errance && !window.Errance._ppWrap) {
            window.Errance._ppWrap = true;
            var _eAdd = window.Errance.add.bind(window.Errance);
            window.Errance.add = function (id, n) { if (n > 0) montrer('errance'); return _eAdd(id, n); };
        } else if (!window.Errance) ok = false;
        if (window.Ame && window.Ame.mauvais && !window.Ame._ppWrap) {
            window.Ame._ppWrap = true;
            var _mauvais = window.Ame.mauvais.bind(window.Ame);
            window.Ame.mauvais = function (k, n) { montrer('mental'); return _mauvais(k, n); };
        } else if (!window.Ame) ok = false;
        if (window.Voies && !window.Voies._ppWrap) {
            window.Voies._ppWrap = true;
            var _vGain = window.Voies.gain.bind(window.Voies);
            window.Voies.gain = function (id, voie, n) { montrer('voie'); return _vGain(id, voie, n); };
        }
        if (window.Destins && $gameMessage && !window._ppDestinsWrap) {
            window._ppDestinsWrap = true;
            var _msgAdd = $gameMessage.add;
            // la 1re rumeur des Destins passe par $gameMessage : détection légère
        }
        patched = ok;   // on repassera tant que tout n'est pas branché
    }
    var _upd = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function () {
        if (!patched) patcher();
        _upd.call(this);
    };

    // États-clés : Frémissement (181) et Surpassé (188)
    var _addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        _addState.call(this, stateId);
        if (!this.isActor || !this.isActor()) return;
        if (stateId === 181) montrer('fremissement');
        else if (stateId === 188) montrer('surpasse');
    };

    // 1re rumeur des Destins : détectée par le franchissement de palier
    if (true) {
        var _incSteps = Game_Party.prototype.increaseSteps;
        Game_Party.prototype.increaseSteps = function () {
            var s = $gameSystem && $gameSystem._destins;
            var avant = s ? Object.keys(s.paliers || {}).length : 0;
            _incSteps.call(this);
            var apres = ($gameSystem && $gameSystem._destins) ? Object.keys($gameSystem._destins.paliers || {}).length : 0;
            if (apres > avant) montrer('destins');
        };
    }

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'TUTOS') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'reset') { if ($gameSystem) $gameSystem._tutosVus = {}; }
        else if (sub === 'off') { if ($gameSystem) $gameSystem._tutosOff = true; }
        else if (sub === 'on') { if ($gameSystem) $gameSystem._tutosOff = false; }
    };
})();
