//=============================================================================
// ObjetEveille.js — v1.0 · L'arme qui parle (l'Objet Spirituel éveillé)
// RPG Maker MV · by JOKO / Claude · charger APRÈS CorruptionAme, Errance,
//  JadeEntitePlunging, ObjetSpirituel.
//=============================================================================
/*:
 * @plugindesc [v1.0] L'Objet Spirituel prend une voix : il commente en combat,
 * réagit à ta Chute (il jubile pour la Bête, pleure l'Errant, s'inquiète du
 * Dément), et incarne l'Ancre — il crie ton nom quand tu t'oublies.
 * @author JOKO / Claude
 *
 * @param heros
 * @text Héros à l'arme éveillée
 * @type string
 * @default 1,2,3,4
 * @desc IDs d'acteurs dont l'Objet parle. (Une arme notée <Eveil> parle aussi.)
 *
 * @param bavardage
 * @text Fréquence des répliques (%)
 * @type number
 * @min 0
 * @max 100
 * @default 25
 * @desc Chance qu'une réplique sorte à un moment-clé (action, gros coup, victoire).
 *
 * @param ancreSeuil
 * @text Corruption — l'Ancre s'active
 * @type number
 * @min 0
 * @max 100
 * @default 85
 * @desc Au-dessus de cette corruption, l'arme crie ton nom pour te retenir (1×/combat).
 *
 * @param ancrePurge
 * @text L'Ancre calme (points)
 * @type number
 * @default 20
 * @desc Corruption retirée quand l'Ancre te rappelle à toi.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'OBJET SPIRITUEL ÉVEILLÉ — « pour que l'arme se souvienne du porteur »
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'arme de départ de chaque héros — son Objet Spirituel — n'est pas un outil :
 *  c'est un fragment d'âme. Éveillée, elle PARLE, et sa voix suit ta Chute :
 *      • la BÊTE monte   → elle jubile, elle a soif ;
 *      • l'ERRANT monte  → elle te supplie de rester, elle se souvient de ton nom ;
 *      • le DÉMENT monte → elle s'inquiète, elle jure qu'elle est réelle ;
 *      • l'âme calme     → elle t'encourage, sobrement.
 *
 *  ▶ L'ANCRE — au plus profond de la Bête (corruption très haute), l'arme CRIE
 *    ton nom, une fois par combat, et te rappelle à toi : un peu de corruption
 *    reflue (le lien avec l'Objet te retient un instant). C'est l'Ancre du codex.
 *
 *  ▶ QUI PARLE — par défaut les héros 1-4 (leur arme de départ EST l'Objet). Une
 *    arme notée <Eveil> parle aussi, quel que soit le porteur.
 *
 *  Purement additif : répliques dans le log de combat, aucun effet lourd hormis
 *  l'Ancre (qui ne fait que réduire une jauge déjà gérée ailleurs).
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('ObjetEveille');
    var HEROS = String(P['heros'] || '1,2,3,4').split(',').map(function (s) { return parseInt(s); }).filter(function (n) { return n > 0; });
    var BAV = parseInt(P['bavardage'] || 25) / 100;
    var ANCRE_SEUIL = parseInt(P['ancreSeuil'] || 85);
    var ANCRE_PURGE = parseInt(P['ancrePurge'] || 20);

    function corrN(id) { try { return window.Corruption ? Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function errN(id)  { try { return window.Errance ? Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function phase(id) { try { return window.Ame ? (Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }
    function wlog(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }

    function eveille(actor) {
        if (!actor || !actor.isActor || !actor.isActor()) return false;
        if (HEROS.indexOf(actor.actorId()) >= 0) return true;
        try { return actor.weapons().some(function (w) { return w && w.meta && w.meta.Eveil !== undefined; }); } catch (e) { return false; }
    }
    function voieDe(id) {
        var b = corrN(id) / 100, e = errN(id) / 100, f = (3 - phase(id)) / 2;
        var mx = Math.max(b, e, f);
        if (mx < 0.4) return 'calme';
        return b >= mx ? 'bete' : (e >= mx ? 'errant' : 'fond');
    }

    var VOIX = {
        bete: { col: '#d0402a', l: [
            'Oui… laisse-la sortir.', 'Je sens leur sang d\'ici.', 'Frappe. Encore. Encore.',
            'Tu es plus vrai quand tu chasses.', 'N\'aie pas honte de la faim.'
        ] },
        errant: { col: '#7f8cff', l: [
            'Ne pars pas. Reste avec moi.', 'Je me souviens de ton nom. Même si toi tu l\'oublies.',
            'Tu pèses moins qu\'hier… tiens bon.', 'Garde la main sur moi. Je te tiens au monde.'
        ] },
        fond: { col: '#b07cff', l: [
            'Ne les écoute pas.', 'Ce que tu vois n\'est pas là. Moi, si.',
            'Regarde-moi. Je suis réel.', 'Un coup à la fois. Respire.'
        ] },
        calme: { col: '#5fd6c0', l: [
            'Ensemble, alors.', 'Bien tenu.', 'Je suis avec toi.', 'Montre-leur qui tu es.'
        ] }
    };
    function parler(actor, forceVoie) {
        var voie = forceVoie || voieDe(actor.actorId());
        var v = VOIX[voie] || VOIX.calme;
        var mot = v.l[Math.floor(Math.random() * v.l.length)];
        wlog('\\C[8]' + actor.name() + ' — son arme :\\C[0] \\C[0]« ' + mot + ' »');
    }

    //--- l'Ancre : l'arme crie ton nom au bord de la Bête -----------------------
    function tenterAncre(actor) {
        if (!actor._ancreUsee && corrN(actor.actorId()) >= ANCRE_SEUIL) {
            actor._ancreUsee = true;
            try { AudioManager.playSe({ name: 'Saint3', volume: 80, pitch: 120, pan: 0 }); } catch (e) {}
            wlog('\\C[23]« ' + actor.name().toUpperCase() + " ! » — l'arme crie ton nom.\\C[0]");
            try { if (window.Corruption) Corruption.purge(actor.actorId(), ANCRE_PURGE); } catch (e) {}
            wlog('\\C[23]Tu reviens à toi. Un instant, le sang se tait. (Corruption −' + ANCRE_PURGE + ')\\C[0]');
            return true;
        }
        return false;
    }

    //--- déclencheurs -----------------------------------------------------------
    var _makeActions = Game_Actor.prototype.makeActions;
    Game_Actor.prototype.makeActions = function () {
        _makeActions.call(this);
        if (!$gameParty.inBattle() || !eveille(this)) return;
        if (tenterAncre(this)) return;                 // l'Ancre prime sur le bavardage
        if (Math.random() < BAV) parler(this);
    };
    var _execDmg = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _execDmg.call(this, target, value);
        try {
            if ($gameParty.inBattle() && value > 0 && target && eveille(target) &&
                value >= target.mhp * 0.25 && Math.random() < BAV) {
                parler(target, voieDe(target.actorId()));
            }
        } catch (e) {}
    };
    var _procVictory = BattleManager.processVictory;
    BattleManager.processVictory = function () {
        try {
            var vivants = $gameParty.battleMembers().filter(function (m) { return m.isAlive() && eveille(m); });
            if (vivants.length && Math.random() < BAV + 0.2) parler(vivants[Math.floor(Math.random() * vivants.length)], 'calme');
        } catch (e) {}
        _procVictory.call(this);
    };

    //--- reset de l'Ancre à chaque combat ---------------------------------------
    var _startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _startBattle.call(this);
        try { $gameParty.members().forEach(function (a) { a._ancreUsee = false; }); } catch (e) {}
    };
})();
