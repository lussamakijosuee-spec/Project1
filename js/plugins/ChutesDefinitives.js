//=============================================================================
// ChutesDefinitives.js — v1.0  ·  Une Chute = une perte (Fear & Hunger)
// RPG Maker MV   ·   by JOKO   ·   à charger APRÈS ChutesCinematiques
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les Chutes sont DÉFINITIVES : la Bête et le Dément
 * quittent l'équipe et deviennent des ennemis avec la puissance du joueur ;
 * l'Errant disparaît (écran noir, mélodie, poème). Tous tombés = fin.
 * @author JOKO
 *
 * @param delaiCinematique
 * @text Délai avant la perte (frames)
 * @type number
 * @min 60
 * @default 300
 * @desc Laisse la cinématique de ChutesCinematiques se jouer avant d'exécuter la perte (300 ≈ 5 s).
 *
 * @param melodiePoeme
 * @text Mélodie du poème (ME)
 * @type string
 * @default Curse2
 *
 * @param mult
 * @text PV du monstre (× PV du héros)
 * @type number
 * @decimals 1
 * @default 7.0
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES CHUTES DÉFINITIVES                                              by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Quand un héros DU GROUPE chute, il est PERDU :
 *
 *  ▶ LA BÊTE (Corruption 100) — il quitte l'équipe et devient un monstre,
 *    avec la puissance du joueur MODIFIÉE façon bête (ATK ×2.2, DEF ×1.6,
 *    l'esprit s'éteint : MAT ×0.6) et ses meilleures techniques. L'ennemi
 *    « X, la Bête » de la base prend ses stats : le recroiser (rencontres
 *    201-204) = affronter SA puissance.
 *
 *  ▶ LE DÉMENT (phase mentale 1) — il devient fou, quitte l'équipe, et
 *    devient un ennemi qui GARDE ses capacités et son niveau (stats reprises
 *    telles quelles, ses propres skills en actions).
 *
 *  ▶ L'ERRANT (Errance 100) — il DISPARAÎT. L'écran devient noir, une
 *    mélodie joue, un poème s'écrit lentement… puis le jeu reprend, normal.
 *    La personne n'est plus là. Personne n'en parle. Personne ne se souvient.
 *
 *  ▶ FIN — s'il ne reste PLUS AUCUN héros debout (tous chutés), le monde
 *    continue sans vous : Game Over.
 *
 *  COMMANDES :
 *      CHUTEDEF off / on          désactive/réactive (cutscenes scriptées)
 *      CHUTEDEF forcer bete 2     force la chute définitive (mise en scène)
 *  SCRIPT :
 *      Chutes.perdu(2)            → '' | 'bete' | 'dement' | 'errant'
 *      Chutes.survivants()        → nombre de héros non chutés
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('ChutesDefinitives');
    var DELAI = parseInt(P['delaiCinematique'] || 300);
    var MELODIE = String(P['melodiePoeme'] || 'Curse2');
    var MULT = parseFloat(P['mult'] || 7.0);

    // héros × type → ennemi de la base (matrice des versions chutées)
    var ENNEMI = {
        bete:   { 1: 405, 2: 402, 3: 409, 4: 411 },
        errant: { 1: 406, 2: 418, 3: 403, 4: 412 },
        dement: { 1: 401, 2: 408, 3: 410, 4: 404 }
    };
    var SUFF = { bete: ', la Bête', errant: ', l\'Errant', dement: ', le Dément' };

    var POEME = [
        'Il y avait quelqu\'un, ici.',
        'Un nom que la marque a bu.',
        'Un rire que le sol a pris.',
        '',
        'Ne cherche pas. Ne pleure pas.',
        'On ne pleure pas ce qu\'on n\'a jamais eu.',
        '',
        'Les étoiles noires comptent leurs âmes.',
        'Une de plus, ce soir.',
        '',
        'Qui manque-t-il ?',
        'Personne.',
        'Il n\'a jamais manqué personne.'
    ];

    function store() {
        if (!$gameSystem) return {};
        if (!$gameSystem._chutesDef) $gameSystem._chutesDef = { perdu: {}, monstres: {}, off: false, enCours: {} };
        return $gameSystem._chutesDef;
    }
    function jCorr(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function jErr(id) { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }
    // Seuls les quatre marqués ont des jauges et une forme chutée : tout autre
    // héros (dont celui du joueur) n'a pas de jauge, donc une phase de 1 qui le
    // ferait tomber « Dément » dès le début de la partie.
    function estMarque(id) {
        return !!(ENNEMI.bete[id] && ENNEMI.errant[id] && ENNEMI.dement[id]);
    }
    function typeChute(id) {
        if (!estMarque(id)) return '';
        if (jCorr(id) >= 100) return 'bete';
        if (jErr(id) >= 100) return 'errant';
        if (phase(id) <= 1) return 'dement';
        return '';
    }

    var Chutes = {
        perdu: function (id) { return store().perdu[id] || ''; },
        survivants: function () {
            var n = 0;
            [1, 2, 3, 4].forEach(function (id) {
                if ($gameActors && $gameActors.actor(id) && !store().perdu[id]) n++;
            });
            return n;
        }
    };
    window.Chutes = Chutes;

    //=========================================================================
    // TRANSFERT — l'ennemi hérite de la puissance et des skills du héros
    //=========================================================================
    function construireMonstre(actor, type) {
        var m = MULT;
        var p = function (k) { return actor.param(k); };
        var params;
        if (type === 'bete') {
            params = [Math.round(p(0) * m * 1.2), p(1), Math.round(p(2) * 2.2), Math.round(p(3) * 1.6),
                      Math.round(p(4) * 0.6), Math.round(p(5) * 1.2), Math.round(p(6) * 1.4), p(7)];
        } else if (type === 'dement') {
            params = [Math.round(p(0) * m), Math.round(p(1) * 3), p(2), p(3),
                      Math.round(p(4) * 1.6), Math.round(p(5) * 1.4), p(6), p(7)];
        } else {
            params = [Math.round(p(0) * m), Math.round(p(1) * 2), Math.round(p(2) * 1.2), Math.round(p(3) * 0.8),
                      Math.round(p(4) * 1.4), Math.round(p(5) * 1.5), Math.round(p(6) * 1.1), p(7)];
        }
        // ses propres techniques : les plus offensives d'abord
        var skills = actor.skills().filter(function (s) { return s && s.damage; });
        skills.sort(function (a, b) { return (b.mpCost || 0) - (a.mpCost || 0); });
        var actions = [{ conditionParam1: 0, conditionParam2: 0, conditionType: 0, rating: 4, skillId: 1 }];
        skills.slice(0, 5).forEach(function (s, i) {
            actions.push({ conditionParam1: 0, conditionParam2: 0, conditionType: 0, rating: Math.max(3, 5 - Math.floor(i / 2)), skillId: s.id });
        });
        return {
            name: actor.name() + SUFF[type],
            params: params,
            actions: actions,
            exp: 1500 + actor.level * 120,
            gold: 500 + actor.level * 40
        };
    }
    function appliquerMonstres() {
        var s = store();
        Object.keys(s.monstres).forEach(function (eid) {
            var d = s.monstres[eid], e = $dataEnemies && $dataEnemies[eid];
            if (!e || !d) return;
            e.name = d.name; e.params = d.params; e.actions = d.actions;
            e.exp = d.exp; e.gold = d.gold;
        });
    }

    //=========================================================================
    // SÉQUENCES DE PERTE
    //=========================================================================
    var timeline = [];
    function apres(frames, fn) { timeline.push([frames, fn]); }
    function tick() {
        if (!timeline.length) return;
        var s = timeline[0];
        if (s[0] > 0) { s[0]--; return; }
        timeline.shift();
        try { s[1] && s[1](); } catch (e) {}
    }

    function verifierFin() {
        var vivants = $gameParty.members().filter(function (m) { return !store().perdu[m.actorId()]; });
        if (vivants.length > 0 && Chutes.survivants() > 0) return;
        // plus personne debout : le monde continue sans vous
        apres(30, function () {
            if ($gameMessage) {
                $gameMessage.add('\\C[8]Toutes les voies mènent au gouffre.\\C[0]');
                $gameMessage.add('\\C[8]Le monde, lui, continue. Sans vous.\\C[0]');
            }
        });
        apres(140, function () { SceneManager.goto(Scene_Gameover); });
    }

    function perdreBeteOuDement(id, type) {
        var a = $gameActors.actor(id); if (!a) return;
        var s = store();
        var eid = (ENNEMI[type] || {})[id];
        if (!eid) return;
        s.monstres[eid] = construireMonstre(a, type);
        appliquerMonstres();
        s.perdu[id] = type;
        var nom = a.name();
        if ($gameMessage) {
            if (type === 'bete') {
                $gameMessage.add('\\C[18]' + nom + ' n\'entend plus vos voix.\\C[0]');
                $gameMessage.add('\\C[18]Ce qui reste de lui quitte les vôtres — et rôde, quelque part.\\C[0]');
            } else {
                $gameMessage.add('\\C[1]' + nom + ' rit. Il rit encore en s\'éloignant.\\C[0]');
                $gameMessage.add('\\C[1]Il a tout compris, dit-il. Il n\'est plus des vôtres.\\C[0]');
            }
        }
        $gameParty.removeActor(id);
        if ($gamePlayer) $gamePlayer.refresh();
        verifierFin();
    }

    //--- l'Errant : écran noir, mélodie, poème, et personne ne se souvient ----
    var voile = null, poemeActif = false;
    function perdreErrant(id) {
        var a = $gameActors.actor(id); if (!a) return;
        var s = store();
        var eid = ENNEMI.errant[id];
        if (!eid) return;
        s.monstres[eid] = construireMonstre(a, 'errant');
        appliquerMonstres();
        poemeActif = true;
        try { AudioManager.fadeOutBgm(2); } catch (e) {}
        // le voile noir
        var sc = SceneManager._scene;
        voile = new Sprite(new Bitmap(Graphics.boxWidth, Graphics.boxHeight));
        voile.bitmap.fillAll('#000000');
        voile.opacity = 0;
        sc.addChild(voile);
        var t = 0;
        apres(1, function monte() {
            if (!voile) return;
            voile.opacity = Math.min(255, voile.opacity + 9);
            if (voile.opacity < 255) apres(1, monte);
            else {
                try { AudioManager.playMe({ name: MELODIE, volume: 90, pitch: 100, pan: 0 }); } catch (e) {}
                ecrirePoeme(0, id);
            }
        });
    }
    function ecrirePoeme(ligne, id) {
        if (!voile) return;
        if (ligne >= POEME.length) {
            apres(140, function () { effacerVoile(id); });
            return;
        }
        var b = voile.bitmap;
        b.fontSize = 21;
        b.fontItalic = true;
        b.textColor = '#d9d4e4';
        var y = 120 + ligne * 30;
        b.drawText(POEME[ligne], 0, y, Graphics.boxWidth, 30, 'center');
        apres(POEME[ligne] === '' ? 22 : 52, function () { ecrirePoeme(ligne + 1, id); });
    }
    function effacerVoile(id) {
        // la perte, silencieuse : il n'a jamais été là
        store().perdu[id] = 'errant';
        $gameParty.removeActor(id);
        if ($gamePlayer) $gamePlayer.refresh();
        apres(1, function descend() {
            if (!voile) return;
            voile.opacity -= 5;
            if (voile.opacity > 0) apres(1, descend);
            else {
                if (voile.parent) voile.parent.removeChild(voile);
                voile = null; poemeActif = false;
                try { if ($gameSystem.replayBgm) $gameSystem.replayBgm(); } catch (e) {}
                verifierFin();
            }
        });
    }

    //=========================================================================
    // SURVEILLANCE (sur la carte) + application des monstres au chargement
    //=========================================================================
    var _mapStart = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _mapStart.call(this);
        try { appliquerMonstres(); } catch (e) {}
    };
    var _updMap = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _updMap.call(this);
        try {
            tick();
            var s = store();
            if (s.off || poemeActif) return;
            this._cdT = (this._cdT || 0) + 1;
            if (this._cdT % 60 !== 0) return;
            $gameParty.members().forEach(function (m) {
                var id = m.actorId();
                if (s.perdu[id] || s.enCours[id]) return;
                var type = typeChute(id);
                if (!type) return;
                s.enCours[id] = true;
                // laisser la cinématique (ChutesCinematiques) se jouer d'abord
                apres(DELAI, function () {
                    delete s.enCours[id];
                    if (store().perdu[id]) return;
                    if (type === 'errant') perdreErrant(id);
                    else perdreBeteOuDement(id, type);
                });
            });
        } catch (e) {}
    };
    // figer le joueur pendant le poème
    var _canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function () {
        if (poemeActif) return false;
        return _canMove.call(this);
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'CHUTEDEF') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'off') store().off = true;
        else if (sub === 'on') store().off = false;
        else if (sub === 'forcer') {
            var type = String(args[1] || '').toLowerCase();
            var id = parseInt(args[2]) || 0;
            if (!id || !ENNEMI[type]) return;
            if (type === 'errant') perdreErrant(id);
            else perdreBeteOuDement(id, type);
        }
    };
})();
