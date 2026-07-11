//=============================================================================
// DebutMarques.js — v1.0 · Le début façon Fear & Hunger : choisis TON marqué
// RPG Maker MV · by JOKO · commande : DEBUT choisir (dans l'événement d'intro)
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Choisis un des 4 marqués avant de commencer. Les trois
 * autres vivent leur vie (DestinsParalleles). Discours d'entrée inclus.
 * @author JOKO
 * @help  DEBUT choisir  — ouvre la sélection (à mettre au tout début du jeu).
 *  ANTI-BOUCLE : une fois le choix fait, la commande ne refait RIEN
 *  (même en Démarrage automatique). DEBUT reset — pour re-choisir (test).
 *  Le choix : retire les 3 autres du groupe, santé mentale de tous à 8
 *  (normale — elle bougera selon les choix), et joue le discours du marqué.
 */
(function () {
    'use strict';
    var FICHES = {
        1: { titre: 'la Contre-Attaque', force: 'DPS agressive · contres · la plus forte physiquement',
             faille: 'sa COLÈRE (le rage-bait de ludwing…)',
             mots: ['On m\'a dit de rester calme.', 'Très bien. Je resterai calme.', '\\C[2]Jusqu\'à ce que quelqu\'un me chauffe.\\C[0]'] },
        2: { titre: 'le Roc', force: 'la plus résistante (corps ET esprit) · génie stratège',
             faille: 'la TÊTE EN L\'AIR (attaques visées ratées)',
             mots: ['Réfléchis, frappe, réfléchis encore.', 'Un bras de fer a déjà cassé une table. C\'était moi.', '\\C[23]…attends, j\'ai posé mes clés où ?\\C[0]'] },
        3: { titre: 'la Chance', force: 'le plus chanceux · sang-froid · rage-bait légendaire',
             faille: 'ses VANNES (et l\'absorption : le pouvoir contre les traumas)',
             mots: ['Restons calmes. Moi je le suis toujours.', 'Chaque âme absorbée me rend plus fort.', '\\C[8]Chacune emporte un peu de moi.\\C[0]'] },
        4: { titre: 'la Source', force: 'la plus grande réserve de mana · l\'ultime la plus rapide',
             faille: 'la CONFIANCE EN SOI (oser pour ELLE, pas que pour les autres)',
             mots: ['Je… je pense que je peux le faire.', 'Non. Pas « je pense ».', '\\C[14]Je PEUX le faire.\\C[0]'] }
    };
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'DEBUT') return;
        if ((args[0] || '').toLowerCase() === 'reset') { $gameSystem._debutFait = false; return; }
        if ($gameSystem && $gameSystem._debutFait) {
            // déjà choisi : on efface l'événement d'intro NOUS-MÊMES,
            // même s'il est en Démarrage automatique → le joueur peut bouger.
            if (this._eventId > 0) this.command214();
            return;
        }
        var itp = this;
        var noms = [1, 2, 3, 4].map(function (i) {
            var a = $gameActors.actor(i);
            return a.name() + ' — ' + FICHES[i].titre;
        });
        $gameMessage.setChoices(noms, 0, 0);
        $gameMessage.add('\\C[6]Quatre marques. Quatre chemins. Un seul se joue.\\C[0]');
        $gameMessage.setChoiceCallback(function (n) {
            $gameSystem._debutFait = true;
            var id = n + 1;
            [1, 2, 3, 4].forEach(function (i) {
                $gameVariables.setValue(10 + i, 8);              // santé mentale normale
                if (i !== id) $gameParty.removeActor(i);
                else if (!$gameParty.members().some(function (m) { return m.actorId() === i; })) $gameParty.addActor(i);
            });
            var a = $gameActors.actor(id), F = FICHES[id];
            $gameMessage.add('\\C[18]★ ' + a.name() + '\\C[0] — ' + F.titre);
            $gameMessage.add('\\C[23]Force :\\C[0] ' + F.force);
            $gameMessage.add('\\C[2]Gouffre :\\C[0] ' + F.faille);
            F.mots.forEach(function (m) { $gameMessage.add(m); });
            $gameMessage.add('\\C[8]Les trois autres vivront leur vie. Vous les recroiserez.\\C[0]');
        });
        this.setWaitMode('message');
    };
})();
