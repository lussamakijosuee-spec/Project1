//=============================================================================
// JosuSignature.js — v1.0  ·  Josu, le Dieu Fou — L'Édit du Créateur (le Masque)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Josu (<Josu>) « édite » le combat avec le Masque (méta) :
 * il réécrit ses blessures, glitche l'écran, efface ton mana. Mais il ne VEUT
 * pas gagner : à bas PV il baisse sa garde pour qu'on l'achève. Additif.
 * @author JOKO
 *
 * @help
 *  Détecte l'ennemi marqué <Josu> dans sa Note (le boss final, ennemi 76).
 *  • Chaque tour, il édite le combat (le Masque) : effet méta aléatoire.
 *  • Ses coups (Mana Pur) frappent fort et percent.
 *  • À 25% PV, LE REFUS : il cesse de se défendre, se blesse lui-même et subit
 *    +40% de dégâts — sa mort est sa seule libération.
 */
(function () {
    'use strict';

    function isJosu(b) { return b && b.isEnemy && b.isEnemy() && b.enemy() && b.enemy().meta && b.enemy().meta.Josu; }
    function getJosu() { return $gameTroop ? $gameTroop.aliveMembers().filter(isJosu)[0] : null; }
    function log(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }

    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        var j = getJosu();
        if (j) {
            // LE REFUS — à bas PV, il s'abandonne
            if (j.hpRate() <= 0.25 && !j._josuDespair) {
                j._josuDespair = true;
                $gameScreen.startTint([20, -20, -10, 40], 60);
                log('\\C[8]Le masque de ' + j.name() + ' se fendille.\\C[0]');
                log('\\C[8]« Finis-en. S\'il te plaît. C\'est tout ce que je demande. »\\C[0]');
            }
            if (j._josuDespair) {
                j.gainHp(-Math.floor(j.mhp * 0.04));               // il ne se défend plus
                if (j.startDamagePopup) j.startDamagePopup();
                log(j.name() + ' baisse les bras. Il ne pare plus rien.');
            } else {
                edit(j);                                            // sinon : il édite le combat
            }
        }
        _startTurn.call(this);
    };

    // L'Édit du Créateur — effet méta aléatoire
    function edit(j) {
        var r = Math.randomInt(100);
        if (r < 34) {                                               // réécrit ses blessures
            var h = Math.floor(j.mhp * 0.07);
            j.gainHp(h); if (j.startDamagePopup) j.startDamagePopup();
            log('\\C[6]' + j.name() + ' réécrit ses blessures. « Pas encore. »\\C[0]');
        } else if (r < 67) {                                        // glitch de l'écran
            $gameScreen.startFlash([180, 60, 220, 140], 24);
            $gameScreen.startShake(4, 6, 24);
            log('\\C[6]L\'écran se déchire. ' + j.name() + ' touche au code source.\\C[0]');
        } else {                                                    // efface le mana d'un héros
            var alive = $gameParty.aliveMembers();
            if (alive.length) {
                var t = alive[Math.randomInt(alive.length)];
                t.setMp(0); if (t.startDamagePopup) t.startDamagePopup();
                log('\\C[6]« Tais-toi un instant. » Le mana de ' + t.name() + ' est effacé.\\C[0]');
            }
        }
    }

    // Coups divins (Mana Pur) + vulnérabilité du Refus
    var _exec = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        var s = this.subject();
        if (value > 0 && isJosu(s)) value = Math.round(value * 1.18);          // puissance divine
        if (value > 0 && isJosu(target) && target._josuDespair) value = Math.round(value * 1.4); // il s'abandonne
        _exec.call(this, target, value);
    };
})();
