//=============================================================================
// ObjetSpirituel.js — v1.0
// L'Objet Spirituel évolutif (arme de départ de chaque héros) — RPG Maker MV
// by JOKO
//=============================================================================

/*:
 * @plugindesc v1.0 ■ L'Objet Spirituel : l'arme de départ de chaque héros évolue
 * en 4 paliers (Éclat→Forme→Résonance→Vérité) selon le niveau ET l'âme.
 * @author JOKO
 *
 * @param lvForme
 * @text Niveau — Palier 2 (Forme)
 * @type number
 * @min 2
 * @default 15
 *
 * @param lvResonance
 * @text Niveau — Palier 3 (Résonance)
 * @type number
 * @min 3
 * @default 35
 *
 * @param lvVerite
 * @text Niveau — Palier 4 (Vérité)
 * @type number
 * @min 4
 * @default 60
 *
 * @param soulBonus
 * @text Bonus d'âme (SAN) ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Si Oui, l'Objet équipé gagne/perd de l'ATK & MAT selon la santé mentale du porteur (via JadeEntitePlunging).
 *
 * @param evoAnim
 * @text Animation d'évolution
 * @type animation
 * @default 51
 *
 * @param evoSE
 * @text Son d'évolution
 * @type string
 * @default Saint5
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'OBJET SPIRITUEL ÉVOLUTIF                                         by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'arme de départ de chaque héros EST son Objet Spirituel — la manifestation
 *  physique de son âme. Elle évolue toute seule avec le niveau :
 *
 *     Palier 1 · ÉCLAT      (dès le niveau 1)
 *     Palier 2 · FORME      (niveau lvForme)
 *     Palier 3 · RÉSONANCE  (niveau lvResonance)
 *     Palier 4 · VÉRITÉ     (niveau lvVerite)
 *
 *  Quand un héros atteint un palier, son arme est automatiquement remplacée
 *  par la version supérieure (armes 501–516 créées dans la base), avec son
 *  Mana d'attaque conservé. Un message l'annonce de retour sur la carte.
 *
 *  ▶ BONUS D'ÂME (option)
 *    Tant que l'Objet est équipé, il gagne de l'ATK & MAT si la santé mentale
 *    du porteur est haute, en perd si elle s'effondre (lecture via window.Ame
 *    de JadeEntitePlunging). L'âme nourrit littéralement l'arme.
 *
 *  ▶ COMMANDE PLUGIN
 *    OBJET check     Réévalue tous les héros (utile après un événement scénarisé)
 *
 *  Pré-requis : armes 501–516 présentes (déjà créées). Compatible saves :
 *  un héros déjà au-dessus du palier sera mis à niveau au prochain chargement.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('ObjetSpirituel');
    var LV_FORME = parseInt(P['lvForme']     || 15);
    var LV_RESO  = parseInt(P['lvResonance'] || 35);
    var LV_VERI  = parseInt(P['lvVerite']    || 60);
    var SOUL_ON  = String(P['soulBonus'] || 'true') === 'true';
    var EVO_ANIM = parseInt(P['evoAnim'] || 51);
    var EVO_SE   = String(P['evoSE'] || 'Saint5');

    // Chaînes d'évolution : actorId -> { ids:[4], names:[4] }
    var CHAINS = {
        // Chaque chaîne suit le Don du Codex : le Masque, le Familier,
        // l'Amulette, l'Arc (chapitre 6).
        1: { ids: [501, 502, 503, 504],
             names: ['Éclat de Sang', 'Masque Naissant', 'Masque Résonant', 'Vérité du Masque'] },
        2: { ids: [505, 506, 507, 508],
             names: ['Éclat Lucide', 'Poings Naissants', 'Armure Résonante', "Vérité de l'Armure Volante"] },
        3: { ids: [509, 510, 511, 512],
             names: ['Éclat des Âmes', 'Amulette Naissante', 'Amulette Résonante', "Vérité de l'Amulette"] },
        4: { ids: [513, 514, 515, 516],
             names: ['Éclat Stellaire', 'Arc Naissant', 'Arc Résonant', "Vérité de l'Arc"] }
    };

    var PALIER = ['Éclat', 'Forme', 'Résonance', 'Vérité'];

    // File d'annonces à afficher de retour sur la carte
    var _pendingEvo = [];

    //=========================================================================
    // OUTILS
    //=========================================================================

    function stageForLevel(level) {
        if (level >= LV_VERI) return 3;
        if (level >= LV_RESO) return 2;
        if (level >= LV_FORME) return 1;
        return 0;
    }

    function chainOf(actorId) {
        return CHAINS[actorId] || null;
    }

    /** Indice de palier de l'Objet actuellement détenu par l'acteur (-1 si aucun). */
    function ownedStage(actor, chain) {
        var best = -1;
        // équipé ?
        var weapons = actor.weapons();
        for (var i = 0; i < weapons.length; i++) {
            var idx = chain.ids.indexOf(weapons[i].id);
            if (idx > best) best = idx;
        }
        // en inventaire ?
        for (var s = 0; s < chain.ids.length; s++) {
            if ($gameParty.numItems($dataWeapons[chain.ids[s]]) > 0 && s > best) best = s;
        }
        return best;
    }

    /** Fait évoluer l'Objet d'un acteur vers le palier autorisé par son niveau. */
    function evolveActor(actor) {
        var chain = chainOf(actor.actorId());
        if (!chain) return;

        var target = stageForLevel(actor.level);
        var owned = ownedStage(actor, chain);
        if (owned < 0) return;           // le héros n'a plus son Objet (volontairement)
        if (owned >= target) return;     // déjà au bon palier

        var newWeapon = $dataWeapons[chain.ids[target]];
        if (!newWeapon) return;

        var wasEquipped = actor.weapons().some(function (w) {
            return chain.ids.indexOf(w.id) >= 0;
        });

        // 1) On donne la nouvelle arme, on l'équipe si l'ancienne l'était
        $gameParty.gainItem(newWeapon, 1);
        if (wasEquipped) actor.changeEquip(0, newWeapon);

        // 2) On purge toutes les versions inférieures (y compris celle rendue par changeEquip)
        for (var s = 0; s < target; s++) {
            var oldW = $dataWeapons[chain.ids[s]];
            var n = $gameParty.numItems(oldW);
            if (n > 0) $gameParty.loseItem(oldW, n, true);
        }

        _pendingEvo.push(
            actor.name() + ' — l\'Objet Spirituel s\'éveille : ' +
            '« ' + chain.names[target] + ' » (Palier ' + (target + 1) + '/4 · ' + PALIER[target] + ') !'
        );
    }

    function checkAllParty() {
        $gameParty.members().forEach(evolveActor);
    }

    //=========================================================================
    // ÉVOLUTION À LA MONTÉE DE NIVEAU
    //=========================================================================

    var _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function () {
        _Game_Actor_levelUp.call(this);
        evolveActor(this);
    };

    //=========================================================================
    // BONUS D'ÂME — l'ATK & MAT de l'Objet suivent la santé mentale
    //=========================================================================

    var SOUL_PHASE_BONUS = { 5: 8, 4: 4, 3: 0, 2: -4, 1: -8 };

    var _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function (paramId) {
        var value = _Game_Actor_paramPlus.call(this, paramId);
        if (SOUL_ON && (paramId === 2 || paramId === 4)) { // ATK ou MAT
            var chain = chainOf(this.actorId());
            if (chain && this.weapons().some(function (w) { return chain.ids.indexOf(w.id) >= 0; })) {
                if (typeof window.Ame !== 'undefined' && window.Ame) {
                    var phase = window.Ame.phase(this.actorId());
                    value += (SOUL_PHASE_BONUS[phase] || 0);
                }
            }
        }
        return value;
    };

    //=========================================================================
    // AFFICHAGE DES ANNONCES SUR LA CARTE + RATTRAPAGE DES SAUVEGARDES
    //=========================================================================

    var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        checkAllParty(); // rattrape les héros sous-évolués (saves existantes)
        _Scene_Map_onMapLoaded.call(this);
    };

    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        if (_pendingEvo.length > 0 &&
            !$gameMap.isEventRunning() && !$gameMessage.isBusy()) {
            AudioManager.playSe({ name: EVO_SE, volume: 90, pitch: 100, pan: 0 });
            $gameMessage.add('\\C[14]✦ ' + _pendingEvo.shift() + '\\C[0]');
        }
    };

    //=========================================================================
    // COMMANDE PLUGIN
    //=========================================================================

    var _GI_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _GI_pluginCommand.call(this, command, args);
        if (String(command).toUpperCase() === 'OBJET' &&
            (args[0] || '').toLowerCase() === 'check') {
            checkAllParty();
        }
    };

})();
