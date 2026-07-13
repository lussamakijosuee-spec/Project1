//=============================================================================
// RevesFeuAme.js — v1.0 · Ce qu'on voit en dormant près des braises
// RPG Maker MV · by JOKO / Claude · charger APRÈS Errance, CorruptionAme,
//  JadeEntitePlunging, ChutesNoyau, AmeSouls / Lore_FeuAmeRefuge.
//=============================================================================
/*:
 * @plugindesc [v1.0] Au repos, tu rêves. Le héros dont la Chute est la plus
 * proche fait un rêve surréaliste — chasse, rive de l'oubli, monde d'enfant —
 * et un CHOIX qui apaise ou attise sa Chute, révèle du lore, le fait grandir.
 * @author JOKO / Claude
 *
 * @param soulVar
 * @text Variable du stock d'âmes
 * @type variable
 * @default 15
 *
 * @param autoRepos
 * @text Rêver au repos (%)
 * @type number
 * @min 0
 * @max 100
 * @default 70
 * @desc Chance de rêver après FEUAME repos / FEU repos (0 = jamais, commande REVE seule).
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES RÊVES DU FEU D'ÂME
 * ═══════════════════════════════════════════════════════════════════════════
 *  Se reposer aux braises, c'est baisser la garde de l'esprit. Le héros dont la
 *  Chute pèse le plus rêve — et son rêve lui ressemble :
 *      • la BÊTE rêve d'une chasse sans fin ;
 *      • l'ERRANT rêve d'une rive où on l'oublie ;
 *      • le DÉMENT rêve d'un monde d'enfant qui saigne ;
 *      • l'âme en paix rêve de ceux qu'elle aime.
 *  Chaque rêve offre un CHOIX : céder (gagner, mais s'enfoncer) ou résister
 *  (s'apaiser, mais renoncer). Les conséquences touchent ses jauges de Chute.
 *
 *  ▶ DÉCLENCHEMENT — automatique après « FEUAME repos » ou « FEU repos »
 *    (probabilité réglable), ou à la demande :
 *        REVE                 le héros le plus proche de sa Chute rêve
 *        REVE <actorId>       force le rêve d'un héros précis
 *
 *  Autonome : si aucune Chute ne pèse, c'est un rêve doux (petit répit).
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('RevesFeuAme');
    var SOUL_VAR = parseInt(P['soulVar'] || 15);
    var AUTO = parseInt(P['autoRepos'] || 70);

    function corrN(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function errN(id)  { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }
    function addSouls(n) { if ($gameVariables) $gameVariables.setValue(SOUL_VAR, ($gameVariables.value(SOUL_VAR) || 0) + n); }
    function purgeCorr(id, n) { try { if (window.Corruption) Corruption.purge(id, n); } catch (e) {} }
    function purgeErr(id, n) { try { if (window.Errance) Errance.purge(id, n); } catch (e) {} }
    function addCorr(id, n) { try { if (window.Corruption) Corruption.add(id, n); } catch (e) {} }
    function addErr(id, n) { try { if (window.Errance) Errance.add(id, n); } catch (e) {} }
    function bonAme(id, n) { try { if (window.Ame) Ame.bon(id, n); } catch (e) {} }
    function malAme(id, n) { try { if (window.Ame) Ame.mauvais(id, n); } catch (e) {} }

    // Héros + voie dont la Chute pèse le plus
    function dormeur() {
        var best = null, bestVoie = 'paix', bestPr = 0;
        ($gameParty ? $gameParty.members() : []).forEach(function (a) {
            var id = a.actorId();
            var b = corrN(id) / 100, e = errN(id) / 100, f = (3 - phase(id)) / 2;
            var mx = Math.max(b, e, f);
            if (mx > bestPr) {
                bestPr = mx; best = a;
                bestVoie = (b >= mx ? 'bete' : (e >= mx ? 'errant' : 'fond'));
            }
        });
        if (!best) best = $gameParty && $gameParty.leader();
        return { actor: best, voie: bestPr > 0.15 ? bestVoie : 'paix', pr: bestPr };
    }

    //--- Contenu des rêves ------------------------------------------------------
    // chaque rêve : lignes + 2 choix {texte, effet(actor)}
    function scenarioReve(voie, actor) {
        var nom = actor ? actor.name() : 'Le dormeur';
        if (voie === 'bete') return {
            lignes: [
                '\\C[2]' + nom + ' rêve.\\C[0]',
                'Une plaine sans lune. Une odeur de sang chaud, quelque part.',
                'La meute court à ses côtés. C\'est si simple, de courir.',
                'Une voix, en lui : « Lâche. Cours avec nous. »'
            ],
            choix: [
                { t: 'Courir avec la meute', fn: function (a) {
                    addCorr(a.actorId(), 6); addSouls(8);
                    return '\\C[2]Il court. Le réveil a un goût de fer — et ses muscles sont plus vifs. (+8 âmes, la Bête monte.)\\C[0]'; } },
                { t: 'S\'arrêter, rentrer', fn: function (a) {
                    purgeCorr(a.actorId(), 12);
                    return '\\C[23]Il s\'arrête. La meute disparaît. Au réveil, le sang est plus calme. (Corruption apaisée.)\\C[0]'; } }
            ]
        };
        if (voie === 'errant') return {
            lignes: [
                '\\C[8]' + nom + ' rêve.\\C[0]',
                'Une rive pâle, sous des étoiles noires. De l\'eau qui ne mouille pas.',
                'Des silhouettes assises regardent au loin. L\'une se tourne :',
                '« Assieds-toi. Ici, plus personne n\'a de nom à porter. »'
            ],
            choix: [
                { t: 'Écouter la musique', fn: function (a) {
                    addErr(a.actorId(), 6); addSouls(10);
                    return '\\C[8]Il s\'assoit. C\'est si léger, d\'oublier. (+10 âmes, l\'Errance monte.)\\C[0]'; } },
                { t: 'Se rappeler son nom', fn: function (a) {
                    purgeErr(a.actorId(), 12);
                    return '\\C[23]Il dit son nom, tout haut. La rive s\'efface. Il pèse à nouveau son poids. (Errance apaisée.)\\C[0]'; } }
            ]
        };
        if (voie === 'fond') return {
            lignes: [
                '\\C[1]' + nom + ' rêve.\\C[0]',
                'Un pré de crayons de couleur. Des amis dessinés lui sourient.',
                'Trop de dents dans les sourires. Le rouge coule hors des traits.',
                'Un enfant chuchote : « Reste jouer. Dehors, ils mentent tous. »'
            ],
            choix: [
                { t: 'Rester jouer', fn: function (a) {
                    malAme(a.actorId(), 2);
                    return '\\C[1]Il reste. Il apprend une chose vraie que personne ne dirait — et la paie. (Santé mentale −2.)\\C[0]'; } },
                { t: 'Se réveiller', fn: function (a) {
                    bonAme(a.actorId(), 2);
                    return '\\C[23]Il ferme les yeux dans le rêve, et les rouvre dehors. L\'air est froid, réel. (Santé mentale +2.)\\C[0]'; } }
            ]
        };
        // paix
        return {
            lignes: [
                nom + ' rêve.',
                'Un feu, des visages connus, des rires bas. Rien à fuir.',
                'Au réveil, il a la sensation rare d\'être, simplement, à sa place.'
            ],
            choix: [
                { t: 'Savourer', fn: function (a) { bonAme(a.actorId(), 1); addSouls(3); return '\\C[23]Le repos fut vrai. (Santé mentale +1, +3 âmes.)\\C[0]'; } },
                { t: 'Se lever', fn: function (a) { return 'Il se lève, apaisé. La route attend.'; } }
            ]
        };
    }

    //--- Jouer le rêve (messages + choix) ---------------------------------------
    function jouerReve(actor, voie) {
        if (!actor) return;
        if ($gameMessage.isBusy()) return;
        var sc = scenarioReve(voie, actor);
        try { AudioManager.playSe({ name: voie === 'bete' ? 'Blow1' : voie === 'errant' ? 'Bell3' : voie === 'fond' ? 'Darkness1' : 'Saint3', volume: 45, pitch: voie === 'fond' ? 70 : 90, pan: 0 }); } catch (e) {}
        $gameScreen.startTint([-60, -60, -30, 60], 40);
        sc.lignes.forEach(function (l) { $gameMessage.add(l); });
        $gameMessage.setChoices([sc.choix[0].t, sc.choix[1].t], 0, -1);
        $gameMessage.setChoiceBackground(0);
        $gameMessage.setChoicePositionType(2);
        $gameMessage.setChoiceCallback(function (n) {
            var res = sc.choix[n < 0 ? 1 : n].fn(actor);
            $gameScreen.startTint([0, 0, 0, 0], 40);
            if (res) $gameMessage.add(res);
        });
    }

    //--- API + auto au repos ----------------------------------------------------
    function rever(actorId) {
        if (actorId) {
            var a = $gameActors.actor(actorId);
            if (!a) return;
            var id = a.actorId();
            var b = corrN(id) / 100, e = errN(id) / 100, f = (3 - phase(id)) / 2, mx = Math.max(b, e, f);
            var voie = mx <= 0.15 ? 'paix' : (b >= mx ? 'bete' : (e >= mx ? 'errant' : 'fond'));
            jouerReve(a, voie);
        } else {
            var d = dormeur();
            jouerReve(d.actor, d.voie);
        }
    }

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        var C = String(cmd).toUpperCase();
        if (C === 'REVE') {
            rever(parseInt(args[0]) || 0);
        } else if ((C === 'FEUAME' || C === 'FEU') && String(args[0] || '').toLowerCase() === 'repos') {
            // rêve automatique après le repos (probabilité réglable)
            if (AUTO > 0 && Math.randomInt(100) < AUTO) {
                var self = this;
                // léger différé : laisse le repos afficher ses messages d'abord
                var d = dormeur();
                if (d.actor) rever(d.actor.actorId());
            }
        }
    };
})();
