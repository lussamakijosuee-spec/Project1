//=============================================================================
// ChasseursAme.js — v1.0 · Le monde t'envoie du monde (tu es traqué)
// RPG Maker MV · by JOKO / Claude · charger APRÈS CorruptionAme, Errance,
//  JadeEntitePlunging, MondeTeLit. Additif.
//=============================================================================
/*:
 * @plugindesc [v1.0] La suite du « Monde te Lit » : à corruption/errance hautes,
 * les factions t'ENVOIENT des chasseurs — embuscades renforcées sur la carte,
 * qui te renvoient à ta Chute. L'Ordre pour les corrompus, les cultes pour la Bête…
 * @author JOKO / Claude
 *
 * @param seuil
 * @text Pression minimale (%)
 * @type number
 * @min 0
 * @max 100
 * @default 45
 * @desc Sous ce % de Chute (corruption/errance/mental), personne ne te traque.
 *
 * @param pasMin
 * @text Pas entre deux traques
 * @type number
 * @default 40
 * @desc Nombre minimum de pas avant qu'une nouvelle embuscade soit possible.
 *
 * @param chance
 * @text Chance par pas (%) au max
 * @type number
 * @default 6
 * @desc Probabilité par pas d'être embusqué, à pression maximale (mise à l'échelle).
 *
 * @param boost
 * @text Renfort des chasseurs (%)
 * @type number
 * @default 35
 * @desc Bonus de stats des ennemis d'une embuscade (ils sont plus dangereux).
 *
 * @param troupeBete
 * @text Troupe — cultes de la Bête (0 = rencontre carte)
 * @type number
 * @default 0
 * @desc Troupe spécifique quand la Bête domine. 0 = pioche dans les rencontres de la carte.
 *
 * @param troupeErrant
 * @text Troupe — traqueurs de l'Errant (0 = carte)
 * @type number
 * @default 0
 *
 * @param troupeDement
 * @text Troupe — inquisiteurs / lucides (0 = carte)
 * @type number
 * @default 0
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES CHASSEURS — ton âme se voit, et on vient te chercher
 * ═══════════════════════════════════════════════════════════════════════════
 *  Prolonge « Le Monde te Lit » : quand ta Chute est visible, le monde n'a plus
 *  peur en silence — il ENVOIE des gens. Sur la carte, au fil de tes pas, une
 *  embuscade peut éclater, renforcée, avec une réplique qui te renvoie à ta voie :
 *      • la BÊTE domine   → les cultes viennent réclamer la bête (ou l'abattre) ;
 *      • l'ERRANT domine  → des traqueurs cherchent à te lier avant l'effacement ;
 *      • le DÉMENT domine → l'Ordre dépêche des inquisiteurs contre l'hérétique.
 *
 *  ▶ CLÉ-EN-MAIN — pas besoin de créer des troupes : par défaut, l'embuscade
 *    pioche dans les rencontres de la carte courante, mais les ennemis sont
 *    RENFORCÉS (+stats) et te prennent par surprise. Tu peux assigner une troupe
 *    précise par voie (paramètres) pour des chasseurs sur mesure.
 *
 *  ▶ OÙ — jamais sur une carte notée <SafeZone> (refuges). Jamais pendant un
 *    événement ou un message. Un délai minimal en pas sépare deux traques.
 *
 *  COMMANDES :
 *      CHASSE off / on          coupe / rallume la traque
 *      CHASSE force [voie]      déclenche une embuscade maintenant (bete|errant|fond)
 *  SCRIPT :
 *      Chasseurs.pression()  → 0..1 (à quel point on te traque)
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('ChasseursAme');
    var SEUIL = parseInt(P['seuil'] || 45) / 100;
    var PAS_MIN = parseInt(P['pasMin'] || 40);
    var CHANCE = parseInt(P['chance'] || 6) / 100;
    var BOOST = parseInt(P['boost'] || 35) / 100;
    var TR = { bete: parseInt(P['troupeBete'] || 0), errant: parseInt(P['troupeErrant'] || 0), fond: parseInt(P['troupeDement'] || 0) };

    function corrN(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function errN(id)  { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }

    // voie de Chute dominante du groupe + pression 0..1
    function dominante() {
        var b = 0, e = 0, f = 0;
        ($gameParty ? $gameParty.members() : []).forEach(function (a) {
            var id = a.actorId();
            b = Math.max(b, corrN(id) / 100); e = Math.max(e, errN(id) / 100); f = Math.max(f, (3 - phase(id)) / 2);
        });
        var mx = Math.max(b, e, f);
        var voie = mx <= 0 ? null : (b >= mx ? 'bete' : (e >= mx ? 'errant' : 'fond'));
        return { voie: voie, pr: mx.clamp(0, 1) };
    }
    window.Chasseurs = { pression: function () { return dominante().pr; } };

    var FACTIONS = {
        bete:   { qui: 'Un culte de la Bête', intro: 'Ils te reconnaissent comme un des leurs — ou comme un trophée.' },
        errant: { qui: 'Des traqueurs d\'âmes', intro: 'Ils veulent te lier avant que tu ne t\'effaces tout à fait.' },
        fond:   { qui: 'Les inquisiteurs de l\'Ordre', intro: 'Ils ont senti l\'hérésie dans ton regard. Ils ne discutent pas.' }
    };

    function actif() { return !($gameSystem && $gameSystem._chasseOff); }
    function safeZone() {
        try { return $dataMap && $dataMap.meta && $dataMap.meta.SafeZone !== undefined; } catch (e) { return false; }
    }

    function troupeChoisie(voie) {
        if (TR[voie] > 0) return TR[voie];
        // pioche dans les rencontres de la carte
        try {
            var list = $gameMap.encounterList();
            if (list && list.length) {
                var cand = list.filter(function (x) { return x && x.troopId > 0; });
                if (cand.length) return cand[Math.floor(Math.random() * cand.length)].troopId;
            }
            var id = $gameMap.encounterStep && $gamePlayer.makeEncounterTroopId ? $gamePlayer.makeEncounterTroopId() : 0;
            if (id > 0) return id;
        } catch (e) {}
        return 0;
    }

    function lancerEmbuscade(voie) {
        if (!voie) { var d = dominante(); voie = d.voie || 'fond'; }
        var troopId = troupeChoisie(voie);
        if (!troopId) return false;
        if (SceneManager.isSceneChanging() || $gameMessage.isBusy() || !$gamePlayer.canMove()) return false;
        $gameSystem._chasse = { voie: voie };
        $gameSystem._chassePas = 0;
        BattleManager.setup(troopId, true, false);   // fuite possible, pas de défaite auto
        BattleManager._surprise = true;               // ils t'ont pris par surprise
        BattleManager._preemptive = false;
        $gamePlayer.makeEncounterCount();
        try { AudioManager.playSe({ name: 'Bell3', volume: 60, pitch: 70, pan: 0 }); } catch (e) {}
        SceneManager.push(Scene_Battle);
        return true;
    }

    //--- intro + renfort des chasseurs au début du combat -----------------------
    var _startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _startBattle.call(this);
        var c = $gameSystem && $gameSystem._chasse;
        if (c) {
            var F = FACTIONS[c.voie] || FACTIONS.fond;
            var w = this._logWindow;
            if (w) {
                w.push('addText', '\\C[2]' + F.qui + ' vous a suivi.\\C[0]'); w.push('wait');
                w.push('addText', '\\C[8]' + F.intro + '\\C[0]'); w.push('wait');
            }
        }
    };
    var _boostBase = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function (paramId) {
        var v = _boostBase.call(this, paramId);
        if ($gameParty.inBattle() && $gameSystem && $gameSystem._chasse) v = Math.floor(v * (1 + BOOST));
        return v;
    };
    var _endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        if ($gameSystem) $gameSystem._chasse = null;
        _endBattle.call(this, result);
    };

    //--- déclenchement au fil des pas -------------------------------------------
    var _incSteps = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function () {
        _incSteps.call(this);
        try {
            if (!actif() || safeZone() || !$gamePlayer.canMove() || $gameMap.isEventRunning()) return;
            $gameSystem._chassePas = ($gameSystem._chassePas || 0) + 1;
            if ($gameSystem._chassePas < PAS_MIN) return;
            var d = dominante();
            if (!d.voie || d.pr < SEUIL) return;
            // chance à l'échelle de la pression au-delà du seuil
            var f = (d.pr - SEUIL) / (1 - SEUIL);
            if (Math.random() < CHANCE * f) lancerEmbuscade(d.voie);
        } catch (e) {}
    };

    //--- commandes --------------------------------------------------------------
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'CHASSE') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'off') { if ($gameSystem) $gameSystem._chasseOff = true; }
        else if (sub === 'on') { if ($gameSystem) $gameSystem._chasseOff = false; }
        else if (sub === 'force') lancerEmbuscade((args[1] || '').toLowerCase() || null);
    };
})();
