//=============================================================================
// PNJVivantsPlus.js — v1.0 · Les PNJ voient tes jauges, colportent les rumeurs,
//   chutent eux-mêmes, cachent l'Envers, gravent, se souviennent des Reprises.
// RPG Maker MV · by JOKO · charger APRÈS ViesParalleles et CanonPlus.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ 8 outils PNJ : réactions aux jauges, rumeurs des vies
 * parallèles, destins de PNJ, l'Envers caché, le Graveur, le PNJ du Fond, liens.
 * @author JOKO
 * @help
 *  COMMANDES (à poser dans n'importe quel événement PNJ) :
 *   PNJ react            — le PNJ commente l'état du chef (jauges/marque)
 *   PNJ rumeur           — raconte ce qu'un héros absent a fait (vies parallèles)
 *   PNJ fond             — le PNJ qui se souvient des Reprises (0/5/20)
 *   PNJ graveur          — le Graveur incarné (refuse si lucidité < 5)
 *   PNJ lire <clé>       — lire la marque d'un PNJ nommé (où en est SA chute)
 *   PNJ destin <clé> <n> — fait avancer la chute du PNJ <clé> de n (quêtes)
 *   PNJ soigner <clé> <n>— la fait reculer (quête réussie)
 *   PNJLIEN up <clé> [n] — renforce le lien avec un PNJ nommé
 *
 *  CONDITIONS (onglet 4 → Script, pour tes pages d'événement) :
 *   PNJ.peur()            le chef fait peur (Corruption>=70 ou marque gonflée)
 *   PNJ.voitEnvers()      le chef voit l'autre côté (Errance>=40 ou lucidité<=3)
 *   PNJ.destin('marc')    0-100 : la chute du PNJ 'marc'
 *   PNJ.perdu('marc')     true si le PNJ a chuté (>=100)
 *   PNJ.lien('marc')      niveau de lien avec le PNJ
 *
 *  NOTE D'ÉVÉNEMENT  <Envers>  : l'événement n'existe QUE pour ceux qui voient
 *  l'autre côté (invisible et intraversable sinon). Les âmes errantes en PNJ.
 *
 *  AUTOMATIQUE : les destins des PNJ nommés avancent de 1 tous les 120 pas
 *  (déclare-les une fois : PNJ destin marc 0). Le monde meurt aussi sans toi.
 */
(function () {
    'use strict';
    function chef() { return $gameParty.leader(); }
    function jc(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function je(id) { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function jm(id) { try { return window.Ame ? (Ame.jauge(id) || 10) : 10; } catch (e) { return 10; } }
    function marque(id) { try { return window.Marque ? Marque.etat(id) : 'pleine'; } catch (e) { return 'pleine'; } }
    function sys() { $gameSystem._pnjDestins = $gameSystem._pnjDestins || {}; $gameSystem._pnjLiens = $gameSystem._pnjLiens || {}; return $gameSystem; }

    var PNJ = {
        peur: function () { var a = chef(); if (!a) return false; return jc(a.actorId()) >= 70 || marque(a.actorId()) === 'gonflee'; },
        voitEnvers: function () { var a = chef(); if (!a) return false; return je(a.actorId()) >= 40 || jm(a.actorId()) <= 3; },
        destin: function (cle) { return (sys()._pnjDestins[cle] || 0); },
        perdu: function (cle) { return this.destin(cle) >= 100; },
        lien: function (cle) { return (sys()._pnjLiens[cle] || 0); }
    };
    window.PNJ = PNJ;

    //── PNJ react : la banque de réactions à l'état du chef ──
    function reaction() {
        var a = chef(); if (!a) return;
        var id = a.actorId(), c = jc(id), e = je(id), m = jm(id), mq = marque(id);
        if (mq === 'creuse') return '« …Il n\'y a personne derrière tes yeux, pas vrai ? »';
        if (mq === 'gonflee') return '« Je sais ce que tu portes. Toutes ces âmes… Ne t\'approche pas. »';
        if (c >= 70) return '« Tes veines… elles sont noires. Va-t\'en. VA-T\'EN ! »';
        if (c >= 40) return '« Tu trembles. Comme la bête du vieux moulin, avant. »';
        if (e >= 70) return '« On dirait que tu es à moitié parti, étranger. Quelle moitié je regarde ? »';
        if (m <= 2) return '« Tes yeux ne se posent nulle part. Le Lac t\'a gardé quelque chose, hein ? »';
        if (m >= 9 && c < 40 && e < 40) return '« Tu as bonne mine, voyageur. Ça devient rare. »';
        return '« Belle journée. Enfin… aussi belle que possible, par ici. »';
    }
    //── PNJ rumeur : les vies parallèles racontées par le monde ──
    function rumeur() {
        var vies = ($gameSystem._vies) || {};
        var cands = [];
        [1, 2, 3, 4].forEach(function (i) {
            var j = vies[i] || [];
            if (j.length && !$gameParty.members().some(function (mb) { return mb.actorId() === i; })) {
                cands.push('« On m\'a raconté que ' + $gameActors.actor(i).name() + ' ' + j[j.length - 1] + ' »');
            }
        });
        if (!cands.length) return '« Des nouvelles ? Non… les routes sont calmes. Trop calmes. »';
        return cands[Math.floor(Math.random() * cands.length)];
    }
    //── PNJ fond : celui qui se souvient des Reprises ──
    function fond() {
        var n = ($gameSystem._reprises || 0);
        if (n >= 20) return '\\C[18]« Tu es remonté ' + n + ' fois. Il te regarde faire, tu sais. Il trouve ça drôle. »\\C[0]';
        if (n >= 5) return '\\C[8]« Encore vous ? …Pardon. On ne s\'est jamais vus. Jamais. »\\C[0]';
        return '« Bienvenue, voyageur. Première fois par ici ? …Oui. Première fois. »';
    }
    //── PNJ graveur : incarné, avec ses conditions ──
    function graveur(itp) {
        var a = chef(); if (!a) return;
        if (window.Porteur && !Porteur.present()) { $gameMessage.add('\\C[8]LE GRAVEUR — « Ces âmes ne répondent qu\'à leur porteur. Reviens avec lui. »\\C[0]'); return; }
        if (jm(a.actorId()) < 5) {
            $gameMessage.add('\\C[8]LE GRAVEUR — « Les mains qui tremblent gravent des mots faux. »');
            $gameMessage.add('« Reviens quand ton esprit tiendra debout. » (lucidité 5 requise)\\C[0]');
            return;
        }
        $gameMessage.add('LE GRAVEUR — « Cinq âmes la gravure. Choisis ta Parole. »');
        $gameMessage.setChoices(['Rune d\'Entrave', 'Rune de Renvoi', 'Rune de Saignée', 'Partir'], 0, 3);
        $gameMessage.setChoiceCallback(function (n) {
            var MAP = { 0: 65, 1: 66, 2: 67 };
            if (MAP[n] === undefined) return;
            var souls = $gameVariables.value(15);
            if (souls >= 5) {
                $gameVariables.setValue(15, souls - 5);
                $gameParty.gainItem($dataItems[MAP[n]], 1);
                $gameMessage.add('\\C[23]Il grave sans un mot. La Parole devient chiffres.\\C[0] (−5 âmes)');
            } else {
                $gameMessage.add('\\C[8]« Pas d\'âmes, pas de gravure. C\'est la seule règle. »\\C[0]');
            }
        });
    }

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        var C = String(cmd).toUpperCase();
        if (C === 'PNJ') {
            var sub = (args[0] || '').toLowerCase();
            if (sub === 'react') $gameMessage.add(reaction());
            else if (sub === 'rumeur') $gameMessage.add(rumeur());
            else if (sub === 'fond') $gameMessage.add(fond());
            else if (sub === 'graveur') graveur(this);
            else if (sub === 'destin') { var k = args[1]; sys()._pnjDestins[k] = Math.max(0, Math.min(100, (sys()._pnjDestins[k] || 0) + (parseInt(args[2]) || 0))); }
            else if (sub === 'soigner') { var k2 = args[1]; sys()._pnjDestins[k2] = Math.max(0, (sys()._pnjDestins[k2] || 0) - (parseInt(args[2]) || 10)); }
            else if (sub === 'lire') {
                var k3 = args[1], d = PNJ.destin(k3);
                var t = d >= 100 ? 'CREUSE — il n\'y a plus personne à sauver.' :
                        d >= 70 ? 'AFFAMÉE — la chute est proche. Il reste peu de temps.' :
                        d >= 40 ? 'FÊLÉE — quelque chose le ronge, ça se voit à l\'œil nu.' :
                                  'PLEINE — une âme qui tient encore debout.';
                $gameMessage.add('\\C[6]REGARD — sa marque est ' + t + '\\C[0]');
            }
        }
        if (C === 'PNJLIEN' && (args[0] || '').toLowerCase() === 'up') {
            var k4 = args[1]; sys()._pnjLiens[k4] = (sys()._pnjLiens[k4] || 0) + (parseInt(args[2]) || 1);
        }
    };

    //── <Envers> : les événements que seuls les damnés voient ──
    var _evUpd = Game_Event.prototype.update;
    Game_Event.prototype.update = function () {
        _evUpd.call(this);
        try {
            var ev = this.event();
            if (ev && ev.note && ev.note.indexOf('<Envers>') >= 0) {
                var v = PNJ.voitEnvers();
                if (this._enversVisible !== v) {
                    this._enversVisible = v;
                    this.setOpacity(v ? 255 : 0);
                    this.setThrough(!v);
                }
            }
        } catch (e) {}
    };

    //── les destins des PNJ nommés avancent seuls (120 pas) ──
    var _steps = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function () {
        _steps.call(this);
        if (this.steps() % 120 !== 0) return;
        var d = sys()._pnjDestins;
        for (var k in d) { if (d[k] > 0 && d[k] < 100) d[k] = Math.min(100, d[k] + 1); }
    };
})();
