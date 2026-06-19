//=============================================================================
// Pensees.js — v1.0  ·  Questions profondes (le jeu qui fait réfléchir)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Affiche une « Pensée » : une question morale/introspective
 * liée aux facettes des héros. Idéal au repos (Feu d'Âme).
 * @author JOKO
 *
 * @help
 *  Commande de plugin :
 *      PENSEE          → une question profonde au hasard
 *      PENSEE colere | exces | amour | confiance | soi   → un thème précis
 *  Édite la table PENSEES pour mettre tes propres mots.
 */
(function () {
    'use strict';

    var PENSEES = {
        colere: [
            'Ta colère te protège-t-elle… ou détruit-elle ce que tu voulais garder ?',
            'Frapper l\'autre apaise-t-il la blessure, ou ne fait-il que la déplacer ?',
            'La colère est souvent une peur qui a renoncé à demander de l\'aide.',
            'Contre qui es-tu vraiment en colère ? Es-tu sûr que ce soit l\'autre ?'
        ],
        exces: [
            'Quand on a le droit de tout faire, que choisit-on vraiment de faire ?',
            'La liberté sans limite, est-ce vivre… ou seulement fuir ?',
            'Le plaisir qui ne s\'arrête jamais finit par avoir le goût du vide.',
            'Tout se permettre, n\'est-ce pas s\'interdire de ressentir vraiment ?'
        ],
        amour: [
            'Peut-on aimer les autres sincèrement si on ne s\'aime pas soi-même ?',
            'Ton cœur est un trésor. À qui mérites-tu vraiment de le confier ?',
            'Être aimé n\'est pas un dû qu\'on arrache. C\'est un don qu\'on accueille.',
            'À force de tout donner aux autres, que reste-t-il pour toi ?'
        ],
        confiance: [
            'La confiance qui écrase les autres est-elle de la force, ou de la peur déguisée ?',
            'Douter de soi, n\'est-ce pas aussi une forme d\'humilité à apprivoiser ?',
            'Tu n\'as pas à être sûr de réussir pour avoir le droit d\'essayer.',
            'L\'arrogant et le timide ont la même blessure : ils ne se croient pas assez.'
        ],
        soi: [
            'Es-tu devenu quelqu\'un dont l\'enfant que tu étais serait fier ?',
            'Que serais-tu prêt à pardonner ? …À toi-même, d\'abord ?',
            'On ne se sépare pas vraiment des gens qu\'on aime. On apprend à les aimer de loin.',
            'Le pire monstre, c\'est de devenir ce qu\'on déteste sans même s\'en apercevoir.',
            'Se détester n\'a jamais réparé personne. Et toi non plus, tu mérites mieux.',
            'Avancer, ce n\'est pas oublier ce qu\'on a fait. C\'est refuser que ça nous arrête.',
            'Fuir dans un beau rêve, est-ce se protéger, ou se condamner à ne jamais vivre ?',
            'Le courage, ce n\'est pas l\'absence de honte. C\'est avancer avec elle.'
        ]
    };

    function pick(theme) {
        var pool = PENSEES[theme] || Object.keys(PENSEES).reduce(function (a, k) { return a.concat(PENSEES[k]); }, []);
        return pool[Math.floor(Math.random() * pool.length)];
    }

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'PENSEE') return;
        if ($gameMessage) {
            $gameMessage.add('\\C[8]✦ Pensée\\C[0]');
            $gameMessage.add('\\C[6]' + pick((args[0] || '').toLowerCase()) + '\\C[0]');
        }
    };
})();
