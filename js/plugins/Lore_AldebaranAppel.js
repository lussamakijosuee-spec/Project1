//=============================================================================
// Lore_AldebaranAppel.js — v1.0 · La Reine Oubliée : l'appel d'Aldébaran
//   « N'écoute pas la musique, détourne le regard. » — et le Pacte : elle
//   bénit d'une puissance démesurée, jamais sans consentement, contre un prix.
//=============================================================================
/*:
 * @plugindesc [Lore] Les Errants entendent Aldébaran (murmures sur la carte) ;
 * et la Reine peut bénir par PACTE : +puissance permanente, contre une vérité.
 * @author JOKO
 *
 * @param seuilAppel
 * @text Seuil d'Errance de l'appel
 * @type number
 * @min 1
 * @max 100
 * @default 70
 * @desc À partir de ce niveau d'Errance, un héros commence à entendre Aldébaran (murmures rares sur la carte).
 *
 * @param pacteBonus
 * @text Pacte — bonus permanent (% ATK/MAT)
 * @type number
 * @min 1
 * @default 20
 *
 * @param pactePrixSan
 * @text Pacte — prix en santé mentale
 * @type number
 * @min 0
 * @default 3
 * @desc La vérité qui ronge : jauge de santé mentale (window.Ame) perdue au Pacte.
 *
 * @param pactePrixErrance
 * @text Pacte — pas vers Elle (Errance)
 * @type number
 * @min 0
 * @default 10
 *
 * @help
 *  ▶ L'APPEL — quand l'Errance d'un héros dépasse le seuil, il entend Aldébaran :
 *    sur la carte, à intervalles rares, un murmure s'affiche et l'écran se
 *    givre un instant. Purement atmosphérique. « N'écoute pas la musique. »
 *
 *  ▶ LE PACTE — la Reine ne fait JAMAIS rien sans consentement : c'est donc à
 *    TOI de l'appeler depuis un événement, APRÈS un choix du joueur :
 *        REINE pacte <acteurId>
 *    Effet : +pacteBonus % d'ATK et MAT, PERMANENT (survit à la sauvegarde).
 *    Prix  : une vérité — santé mentale −pactePrixSan (window.Ame) et
 *            Errance +pactePrixErrance (un pas de plus vers Elle).
 *    « Elle ne ment jamais. C'est bien là le problème. »
 *
 *  ▶ L'OUBLI — outil de mise en scène (cutscene uniquement) :
 *        REINE oubli <acteurId>
 *    Retire le héros du groupe (il rejoint Aldébaran ; le monde l'oublie).
 *    Réversible par événement ($gameParty.addActor) si ton histoire le veut.
 *
 *  Script :  Aldebaran.aPacte(actorId)  → true si le héros a pactisé.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('Lore_AldebaranAppel');
    var SEUIL = parseInt(P['seuilAppel'] || 70);
    var BONUS = parseInt(P['pacteBonus'] || 20) / 100;
    var PRIX_SAN = parseInt(P['pactePrixSan'] || 3);
    var PRIX_ERR = parseInt(P['pactePrixErrance'] || 10);

    var MURMURES = [
        '…une musique, très loin. \\C[1]N\'écoute pas.\\C[0]',
        'Des étoiles noires, au bord du regard. \\C[1]Détourne les yeux.\\C[0]',
        '« Viens. Tu es presque des nôtres. »',
        'Quelqu\'un fredonne ton nom — un nom que le monde commence à oublier.',
        'Ce qui te paraît un ange n\'en est pas un.'
    ];

    function store() {
        if (!$gameSystem) return {};
        if (!$gameSystem._aldebaran) $gameSystem._aldebaran = { pactes: {} };
        return $gameSystem._aldebaran;
    }
    var Aldebaran = {
        aPacte: function (id) { return !!store().pactes[id]; },
        pacte: function (id) {
            var a = $gameActors && $gameActors.actor(id);
            if (!a || this.aPacte(id)) return false;
            store().pactes[id] = true;
            if (PRIX_SAN > 0 && window.Ame) { try { window.Ame.mauvais(id, PRIX_SAN); } catch (e) {} }
            if (PRIX_ERR > 0 && window.Errance) { try { window.Errance.add(id, PRIX_ERR); } catch (e) {} }
            if ($gameScreen) { $gameScreen.startTint([-30, -30, 10, 60], 30); $gameScreen.startFlash([255, 255, 255, 160], 40); }
            if ($gameMessage) {
                $gameMessage.add('\\C[21]La Reine sourit. Le don est accordé —\\C[0]');
                $gameMessage.add('\\C[21]et la vérité qui va avec.\\C[0] \\C[8]Elle ne ment jamais.\\C[0]');
            }
            return true;
        },
        oubli: function (id) {
            var a = $gameActors && $gameActors.actor(id);
            if (!a) return;
            if ($gameMessage) {
                $gameMessage.add('\\C[1]' + a.name() + ' rejoint les étoiles noires.\\C[0]');
                $gameMessage.add('\\C[8]Le monde, déjà, commence à l\'oublier.\\C[0]');
            }
            if ($gameParty) $gameParty.removeActor(id);
            if ($gameScreen) $gameScreen.startTint([-40, -40, -20, 0], 90);
        }
    };
    window.Aldebaran = Aldebaran;

    // Bénédiction permanente : +ATK/+MAT pour les pactisés.
    var _paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function (paramId) {
        var v = _paramPlus.call(this, paramId);
        if ((paramId === 2 || paramId === 4) && Aldebaran.aPacte(this.actorId())) {
            v += Math.floor(this.paramBase(paramId) * BONUS);
        }
        return v;
    };

    // L'appel : murmures rares sur la carte pour les héros trop errants.
    var _updMap = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _updMap.call(this);
        try {
            if (!window.Errance || !$gameParty || $gameMessage.isBusy()) return;
            this._aldT = (this._aldT || 0) + 1;
            if (this._aldT % 1800 !== 0) return;             // ~30 s entre deux chances
            var appele = $gameParty.members().some(function (m) {
                return window.Errance.niveau(m.actorId()) >= SEUIL;
            });
            if (!appele || Math.randomInt(100) >= 35) return; // rare, non-spam
            var msg = MURMURES[Math.randomInt(MURMURES.length)];
            $gameMessage.add(msg);
            if ($gameScreen) { $gameScreen.startTint([-20, -20, 20, 40], 45); $gameScreen.startTint([0, 0, 0, 0], 120); }
        } catch (e) {}
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'REINE') return;
        var sub = (args[0] || '').toLowerCase();
        var id = parseInt(args[1]) || 0;
        if (sub === 'pacte') Aldebaran.pacte(id);
        else if (sub === 'oubli') Aldebaran.oubli(id);
    };
})();
