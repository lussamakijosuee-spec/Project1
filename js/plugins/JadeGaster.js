//=============================================================================
// JadeGaster.js — v1.0  ·  GASTER : l'Entité Oubliée derrière Jade
// RPG Maker MV   ·   by JOKO   (additif — ne modifie aucun autre plugin)
//=============================================================================
/*:
 * @target MV
 * @plugindesc v1.0 ■ Boss secret "style Gaster" : entrée glitchée, Gaster Blasters,
 * phase-out (« il n'est pas là »), répliques en Wingdings/binaire. Nouveaux screamers FLUIDES.
 * @author JOKO
 *
 * @param GasterEnemyIds
 * @text IDs des ennemis Gaster
 * @type string
 * @desc Liste d'IDs d'ennemis (ex: 41,42). Optionnel : le notetag <Gaster> suffit aussi.
 * @default
 *
 * @param BlasterSkillId
 * @text ID Compétence Gaster Blaster
 * @type number
 * @desc Compétence forcée pour le tir de blaster (0 = dégâts directs en %, voir ci-dessous).
 * @default 0
 *
 * @param BlasterDamagePct
 * @text Dégâts Blaster (% PV max)
 * @type number
 * @desc Si aucune compétence : chaque héros vivant perd ce % de ses PV max au tir.
 * @default 35
 *
 * @param PhaseOutChance
 * @text Chance de Phase-Out (%)
 * @type number
 * @min 0
 * @max 100
 * @desc Chance qu'une attaque alliée le traverse : « [ Il n'est pas là. ] ».
 * @default 28
 *
 * @param TauntChance
 * @text Chance de réplique / tour (%)
 * @type number
 * @min 0
 * @max 100
 * @default 50
 *
 * @param BlasterSe
 * @text SE du Gaster Blaster
 * @type string
 * @default Laser2
 *
 * @param GlitchSe
 * @text SE de Phase-Out / Glitch
 * @type string
 * @default Darkness1
 *
 * @help
 * ============================================================================
 *  GASTER — L'ENTITÉ OUBLIÉE                                            by JOKO
 * ============================================================================
 *  Plugin 100% additif et autonome. Il ne touche NI JadeObsession, NI les
 *  pages de troupe. Aucune écriture de fichier, aucun crash : uniquement des
 *  effets visuels/audio en combat (overlays DOM + logique de combat).
 *
 *  ACTIVATION
 *  ----------
 *  Marque l'ennemi voulu de l'une de ces deux façons :
 *    • Notetag dans la zone "Note" de l'ennemi :   <Gaster>
 *    • OU son ID dans le paramètre « IDs des ennemis Gaster ».
 *
 *  CE QUE FAIT GASTER
 *  ------------------
 *   • ENTRÉE GLITCHÉE : à l'ouverture du combat, l'écran se déchire (glitch
 *     RGB fluide + flash) et une réplique cryptique s'affiche.
 *   • GASTER BLASTER : aux paliers 75% / 50% / 25% de PV, un faisceau blanc
 *     balaie l'écran (animation fluide) et frappe tout le groupe.
 *   • PHASE-OUT : chaque coup allié a une chance de le traverser
 *     (« [ Il n'est pas là. ] ») — il vacille hors de la réalité.
 *   • RÉPLIQUES : à chaque tour, paroles en clair, en binaire ou en Wingdings,
 *     parfois projetées à l'écran en glyphes flottants.
 *
 *  NOUVEAUX SCREAMERS FLUIDES (réutilisables ailleurs) :
 *     JadeGasterFX.blaster()    faisceau vertical balayant l'écran
 *     JadeGasterFX.glitch(ms)   flash glitch RGB
 *     JadeGasterFX.wingdings()  pluie de glyphes Wingdings en fondu
 * ============================================================================
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('JadeGaster');
    var ID_LIST    = String(P['GasterEnemyIds'] || '').split(',')
                        .map(function (s) { return parseInt(s, 10); })
                        .filter(function (n) { return !isNaN(n); });
    var BLAST_SKILL = parseInt(P['BlasterSkillId']  || 0, 10);
    var BLAST_PCT   = parseInt(P['BlasterDamagePct'] || 35, 10) / 100;
    var PHASE_OUT   = parseInt(P['PhaseOutChance']  || 28, 10) / 100;
    var TAUNT_PCT   = parseInt(P['TauntChance']     || 50, 10) / 100;
    var SE_BLAST    = String(P['BlasterSe'] || 'Laser2');
    var SE_GLITCH   = String(P['GlitchSe']  || 'Darkness1');

    //========================================================================
    // FX — SCREAMERS FLUIDES (overlays DOM animés en CSS, aucun asset requis)
    //========================================================================
    var JadeGasterFX = window.JadeGasterFX = {};
    JadeGasterFX._styleDone = false;

    JadeGasterFX._ensureStyle = function () {
        if (JadeGasterFX._styleDone) return;
        JadeGasterFX._styleDone = true;
        var style = document.createElement('style');
        style.id = 'jade-gaster-style';
        style.textContent =
            // --- Gaster Blaster : faisceau blanc qui s'ouvre, frappe, puis se referme ---
            '.gaster-beam{position:fixed;top:0;left:50%;width:0;height:100%;z-index:99998;' +
            'pointer-events:none;transform:translateX(-50%);' +
            'background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(180,230,255,.85) 18%,' +
            '#ffffff 50%,rgba(180,230,255,.85) 82%,rgba(255,255,255,0) 100%);' +
            'box-shadow:0 0 60px 30px rgba(150,220,255,.7);opacity:0;' +
            'animation:gasterBeam 640ms cubic-bezier(.2,.8,.2,1) forwards;}' +
            '@keyframes gasterBeam{' +
            '0%{width:0;opacity:0;}' +
            '12%{width:22vw;opacity:1;}' +
            '24%{width:7vw;opacity:1;}' +              // recul nerveux avant le tir
            '40%{width:100vw;opacity:1;}' +            // TIR : le faisceau emplit l'écran
            '78%{width:100vw;opacity:1;}' +
            '100%{width:0;opacity:0;}}' +
            // --- Glitch RGB plein écran ---
            '.gaster-glitch{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99997;' +
            'pointer-events:none;mix-blend-mode:screen;opacity:0;' +
            'background:repeating-linear-gradient(0deg,rgba(255,0,80,.12) 0 2px,' +
            'rgba(0,255,200,.12) 2px 4px,rgba(0,80,255,.12) 4px 6px);' +
            'animation:gasterGlitch 360ms steps(3,end) forwards;}' +
            '@keyframes gasterGlitch{' +
            '0%{opacity:0;transform:translate(0,0);}' +
            '20%{opacity:1;transform:translate(-8px,2px) skewX(6deg);}' +
            '45%{opacity:1;transform:translate(7px,-3px) skewX(-7deg);}' +
            '70%{opacity:1;transform:translate(-4px,4px) skewX(3deg);}' +
            '100%{opacity:0;transform:translate(0,0);}}' +
            // --- Glyphes Wingdings flottants ---
            '.gaster-wingdings{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99996;' +
            'pointer-events:none;display:flex;align-items:center;justify-content:center;' +
            'color:#dff;text-shadow:0 0 12px #6cf,0 0 4px #fff;opacity:0;' +
            'font-family:"Webdings","Wingdings",monospace;letter-spacing:.25em;' +
            'font-size:9vw;animation:gasterWing 1100ms ease-in-out forwards;}' +
            '@keyframes gasterWing{' +
            '0%{opacity:0;transform:scale(1.4);filter:blur(8px);}' +
            '25%{opacity:.92;transform:scale(1);filter:blur(0);}' +
            '70%{opacity:.92;transform:scale(1.02);}' +
            '100%{opacity:0;transform:scale(.96);filter:blur(6px);}}';
        document.head.appendChild(style);
    };

    // Crée un overlay éphémère qui s'auto-détruit après `life` ms
    JadeGasterFX._spawn = function (className, life, build) {
        if (typeof document === 'undefined' || !document.body) return null;
        JadeGasterFX._ensureStyle();
        var el = document.createElement('div');
        el.className = className;
        if (typeof build === 'function') build(el);
        document.body.appendChild(el);
        setTimeout(function () {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, life);
        return el;
    };

    JadeGasterFX.glitch = function (ms) {
        JadeGasterFX._spawn('gaster-glitch', ms || 380);
    };

    JadeGasterFX.beam = JadeGasterFX.blaster = function () {
        JadeGasterFX._spawn('gaster-beam', 700);
    };

    var WINGDINGS = ['✋︎ ✌︎ ❄︎ ☜︎ ☼︎', '☟︎ ☜︎ ☹︎ ☹︎ ◻︎', '👁 ⚙ ☠ ✦ ⌖', '✶ ◈ ✶ ◈ ✶'];
    JadeGasterFX.wingdings = function (glyphs) {
        JadeGasterFX._spawn('gaster-wingdings', 1100, function (el) {
            el.textContent = glyphs || WINGDINGS[Math.floor(Math.random() * WINGDINGS.length)];
        });
    };

    // Nettoyage de tout overlay résiduel
    JadeGasterFX.purge = function () {
        if (typeof document === 'undefined') return;
        ['.gaster-beam', '.gaster-glitch', '.gaster-wingdings'].forEach(function (sel) {
            var nodes = document.querySelectorAll(sel);
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].parentNode) nodes[i].parentNode.removeChild(nodes[i]);
            }
        });
    };

    //========================================================================
    // OUTILS
    //========================================================================
    function isGaster(b) {
        if (!b || !b.isEnemy || !b.isEnemy()) return false;
        var e = b.enemy();
        if (e && e.meta && e.meta.Gaster) return true;
        return ID_LIST.indexOf(b.enemyId()) >= 0;
    }
    function gasterMembers() {
        return $gameTroop ? $gameTroop.members().filter(isGaster) : [];
    }
    function gasterAlive() {
        return gasterMembers().filter(function (e) { return e.isAlive(); });
    }
    function lowestRate() {
        var a = gasterAlive();
        return a.length ? Math.min.apply(null, a.map(function (e) { return e.hpRate(); })) : -1;
    }
    function log(t) {
        var w = BattleManager._logWindow;
        if (w) { w.push('addText', t); w.push('wait'); }
    }
    function se(name, pitch) {
        if (name) AudioManager.playSe({ name: name, volume: 110, pitch: pitch || 100, pan: 0 });
    }

    var TAUNTS = [
        '\\C[8]GASTER : « [ Tu n\'étais pas censé me trouver. ] »\\C[0]',
        '\\C[8]GASTER : « Sombre. Plus sombre. Encore plus sombre. »\\C[0]',
        '\\C[8]GASTER : « 01000A 01000B... mon nom s\'efface du code. »\\C[0]',
        '\\C[8]GASTER : « Jade m\'a remplacé. Mais je suis toujours là. Entre les pixels. »\\C[0]',
        '\\C[8]GASTER : « [ Les fragments se rassemblent. ] »\\C[0]'
    ];

    //========================================================================
    // ENTRÉE GLITCHÉE
    //========================================================================
    var _startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _startBattle.call(this);
        this._gasterThresh = {};
        this._gasterActive = gasterMembers().length > 0;
        if (this._gasterActive) {
            JadeGasterFX.glitch(420);
            JadeGasterFX.wingdings();
            if ($gameScreen) {
                $gameScreen.startFlash([200, 230, 255, 200], 30);
                $gameScreen.startShake(7, 9, 30);
            }
            se(SE_GLITCH, 70);
            log('\\C[8]Une faille s\'ouvre dans le code… quelque chose d\'OUBLIÉ en sort.\\C[0]');
            log('\\C[8]GASTER : « [ Bonjour. Cela faisait… longtemps. ] »\\C[0]');
        }
    };

    //========================================================================
    // RÉPLIQUES + GASTER BLASTER AUX PALIERS
    //========================================================================
    var BLAST_MSG = {
        75: 'GASTER invoque un crâne de lumière… \\C[8>GASTER BLASTER !\\C[0',
        50: 'Le ciel se fend. \\C[8]DEUX crânes convergent — GASTER BLASTER !\\C[0]',
        25: 'GASTER : « [ Que tout redevienne néant. ] » — GASTER BLASTER !'
    };

    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        if (gasterMembers().length) {
            var r = lowestRate();
            this._gasterThresh = this._gasterThresh || {};
            [75, 50, 25].forEach(function (p) {
                if (r >= 0 && r <= p / 100 && !this._gasterThresh[p]) {
                    this._gasterThresh[p] = true;
                    log(BLAST_MSG[p]);
                    fireGasterBlaster();
                }
            }, this);

            if (Math.random() < TAUNT_PCT) {
                log(TAUNTS[Math.floor(Math.random() * TAUNTS.length)]);
                if (Math.random() < 0.5) JadeGasterFX.wingdings();
            }
        }
        _startTurn.call(this);
    };

    // Le tir : faisceau fluide + frappe de tout le groupe
    function fireGasterBlaster() {
        JadeGasterFX.beam();
        JadeGasterFX.glitch(300);
        if ($gameScreen) {
            $gameScreen.startFlash([255, 255, 255, 220], 24);
            $gameScreen.startShake(9, 9, 36);
        }
        se(SE_BLAST, 90);

        var blasterUser = gasterAlive()[0];

        $gameParty.aliveMembers().forEach(function (actor) {
            // Si une compétence dédiée est fournie ET un Gaster vivant : on la force proprement.
            if (BLAST_SKILL > 0 && blasterUser) {
                var action = new Game_Action(blasterUser);
                action.setSkill(BLAST_SKILL);
                action.apply(actor);
                actor.startDamagePopup();
                actor.clearResult();
            } else {
                // Sinon : dégâts directs en % des PV max (autonome, sans dépendance).
                var dmg = Math.max(1, Math.floor(actor.mhp * BLAST_PCT));
                var res = actor.result();
                res.clear();
                res.used = true;
                res.hpAffected = true;
                res.hpDamage = dmg;
                actor.gainHp(-dmg);
                actor.startDamagePopup();
                actor.performDamage();
            }
            if (!actor.isAlive()) actor.performCollapse();
        });
    }

    //========================================================================
    // PHASE-OUT : un coup allié peut le traverser (« il n'est pas là »)
    //========================================================================
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        var subject = this.subject();
        if (isGaster(target) && subject && subject.isActor() && subject.isActor() &&
            !target._gasterPhasedThisHit && Math.random() < PHASE_OUT) {

            var res = target.result();
            res.clear();
            res.used = true;
            res.missed = true; // l'attaque « manque » : il a vacillé hors de la réalité
            JadeGasterFX.glitch(260);
            se(SE_GLITCH, 120);
            log('\\C[8][ Il n\'est pas là. ]\\C[0]');
            return;
        }
        _apply.call(this, target);
    };

    //========================================================================
    // NETTOYAGE
    //========================================================================
    var _terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function () {
        JadeGasterFX.purge();
        _terminate.call(this);
    };

})();
