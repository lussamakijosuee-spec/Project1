//=============================================================================
// MecaniquesDeBoss.js — v1.0
// RPG Maker MV
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Douze mécaniques de boss, déclarées par notetag. Chacune
 * rend littéral un nom de compétence que JOKO avait déjà écrit.
 * @author JOKO
 *
 * @param journal
 * @text Écrire dans le journal de combat
 * @type boolean
 * @on oui
 * @off non
 * @default true
 * @desc Une mécanique que le joueur ne voit pas est une mécanique qui n'existe pas.
 *
 * @param etatCharge
 * @text État « ⚡ Charge »
 * @type state
 * @default 207
 *
 * @param etatSurcharge
 * @text État « ✷ Surcharge »
 * @type state
 * @default 218
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  DOUZE MÉCANIQUES, UNE PAR BOSS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Aucune n'est inventée : chacune rend littéral un nom de compétence déjà
 *  écrit dans la base. Karkinos possède « Il Se Rétracte » — alors il se
 *  rétracte. Reprise 21 possède « Vingt-et-Unième Reprise » — alors il revient.
 *
 *  Toutes se posent par notetag sur l'ENNEMI, et ne font rien sans lui.
 *
 * ───────────────────────────────────────────────────────────────────────────
 *  <MecaDime: n>                              THANATOS · « Dîme d'Âme »
 *      Il marque un héros. Le compte tombe en n tours : le marqué perd la
 *      moitié de ses PV max. Mettre le boss en ✷ Surcharge efface la marque —
 *      c'est la fenêtre de riposte qui sauve le marqué.
 *
 *  <MecaMaree>                                LEVIATHAN · « L'Eau se Retire »
 *      Quand l'eau se retire (⚡ Charge), plus rien ne couvre : sa frappe ne
 *      peut ni rater ni être esquivée, et la Garde ne la réduit plus.
 *
 *  <MecaGueules: n>                     FORME DE VIE ULTIME · « Les Cinq Gueules »
 *      Sa frappe part une fois par gueule encore ouverte. Il en perd une à
 *      chaque palier de PV (80 %, 60 %, 40 %, 20 %) : cinq souffles au début,
 *      un seul à la fin.
 *
 *  <MecaCarapace: pct>                        KARKINOS · « Il Se Rétracte »
 *      Rétracté (⚡ Charge), il ne prend que pct % des dégâts PHYSIQUES. La
 *      magie passe : c'est le contre.
 *
 *  <MecaCompteARebours: n>                    LE COMPTEUR · « Zéro »
 *      Il compte à voix haute. À zéro, tout le groupe perd une part de ses PV
 *      courants, puis le compte repart.
 *
 *  <MecaPonte: enemyId, max>                  LA PONDEUSE · « Elle Pond »
 *      Quand elle pond (⚡ Charge), un membre caché de sa troupe éclot. Jamais
 *      plus de max vivants à la fois.
 *
 *  <MecaNombre: bonus>                  LE DERNIER DES PETITS · « Petits en Nombre »
 *      Il est le dernier. Plus il est blessé, plus il frappe comme s'ils
 *      étaient tous là : jusqu'à +bonus %, proportionnel aux PV perdus.
 *
 *  <MecaChaleur: max>                     GOLIATH-ZÉRO · « Surchauffe Critique »
 *      Chaque action le chauffe. À max, il disjoncte : il se blesse lui-même
 *      et tombe en ✷ Surcharge. Le pousser à agir vite, c'est le faire fondre.
 *
 *  <MecaRecompile>                        LE NON-DÉFINI · « Il Se Recompile »
 *      À chaque palier de PV, ses forces et ses faiblesses élémentaires sont
 *      retirées au sort. Ce qui marchait ne marche plus : il faut resonder.
 *
 *  <MecaReprises: n>                      REPRISE 21 · « Vingt-et-Unième Reprise »
 *      Il revient n fois, à chaque fois avec moins de PV. La dernière reprise
 *      est la bonne.
 *
 *  <MecaRetournement>                          RUKKHA · « Elle Se Retourne »
 *      Tête rentrée (⚡ Charge), elle ne prend qu'un tiers des dégâts. Quand
 *      elle se retourne (✷ Surcharge), elle est sur le dos : double dégâts.
 *
 *  <MecaNom>                              NOM EFFACÉ · « Il Prend Ton Nom »
 *      Sa frappe prend le nom d'un héros. Privé de son nom, il ne fait plus
 *      que la moitié de ses dégâts, jusqu'à ce que le boss tombe en Surcharge.
 * ───────────────────────────────────────────────────────────────────────────
 *
 *  ⚠ MV garde l'espace après les deux-points : « <MecaDime: 3> » donne « 3 ».
 *     Tout est lu avec trim().
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('MecaniquesDeBoss');
    var JOURNAL = String(P['journal'] || 'true') !== 'false';
    var CHARGE = Number(P['etatCharge'] || 207);
    var SURCHARGE = Number(P['etatSurcharge'] || 218);

    //-----------------------------------------------------------------------
    // Lecture des notetags — une seule fois par ennemi, mise en cache
    //-----------------------------------------------------------------------
    function meca(battler, nom) {
        if (!battler || !battler.isEnemy || !battler.isEnemy()) return null;
        var e = battler.enemy();
        if (!e) return null;
        if (!e._meca) e._meca = {};
        if (e._meca[nom] === undefined) {
            var m = new RegExp('<\\s*' + nom + '\\s*(?::([^>]*))?>', 'i').exec(e.note || '');
            if (!m) e._meca[nom] = false;
            else if (m[1] === undefined) e._meca[nom] = [];
            else e._meca[nom] = m[1].split(',').map(function (x) { return parseFloat(x.trim()); });
        }
        return e._meca[nom] === false ? null : e._meca[nom];
    }
    function arg(battler, nom, i, defaut) {
        var a = meca(battler, nom);
        if (!a) return null;
        var v = a[i];
        return (v === undefined || isNaN(v)) ? defaut : v;
    }

    function dire(texte) {
        if (!JOURNAL) return;
        var w = BattleManager._logWindow;
        if (w && w.push) { w.push('addText', texte); w.push('wait'); }
    }

    function boss(nom) {
        if (!$gameTroop) return null;
        return $gameTroop.members().filter(function (m) { return m.isAlive() && meca(m, nom); })[0] || null;
    }
    function herosVivants() {
        return $gameParty && $gameParty.aliveMembers ? $gameParty.aliveMembers() : [];
    }
    function auHasard(liste) { return liste.length ? liste[Math.floor(Math.random() * liste.length)] : null; }

    //=======================================================================
    // Le battement : tout ce qui se compte, se compte au début du tour
    //=======================================================================
    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        try { battementDesMecaniques(); } catch (e) { console.error('MecaniquesDeBoss :', e); }
        _startTurn.call(this);
    };

    function battementDesMecaniques() {
        if (!$gameTroop) return;

        // ——— THANATOS · la Dîme
        var th = boss('MecaDime');
        if (th) {
            if (th._dimeCible && th._dimeCible.isAlive()) {
                th._dimeTours--;
                if (th._dimeTours <= 0) {
                    dire('\\C[2]Le compte est bon. ' + th._dimeCible.name() + ' paie la Dîme.\\C[0]');
                    th._dimeCible.gainHp(-Math.floor(th._dimeCible.mhp * 0.5));
                    th._dimeCible.refresh();
                    th._dimeCible = null;
                } else {
                    dire('La Dîme de ' + th._dimeCible.name() + ' tombe dans ' + th._dimeTours + '.');
                }
            } else if (th.isStateAffected(CHARGE)) {
                var v = auHasard(herosVivants());
                if (v) {
                    th._dimeCible = v;
                    th._dimeTours = arg(th, 'MecaDime', 0, 3);
                    dire('\\C[2]' + th.name() + ' inscrit ' + v.name() + ' sur son registre.\\C[0]');
                }
            }
        }

        // ——— LE COMPTEUR · le compte à rebours
        var co = boss('MecaCompteARebours');
        if (co) {
            var total = arg(co, 'MecaCompteARebours', 0, 5);
            if (co._compte === undefined) co._compte = total;
            co._compte--;
            if (co._compte <= 0) {
                dire('\\C[18]★ ZÉRO.\\C[0]');
                herosVivants().forEach(function (h) {
                    h.gainHp(-Math.floor(h.hp * 0.45));
                    h.refresh();
                });
                co._compte = total;
            } else {
                dire(co.name() + ' compte… ' + co._compte);
            }
        }

        // ——— GOLIATH-ZÉRO · la chaleur
        var go = boss('MecaChaleur');
        if (go) {
            var max = arg(go, 'MecaChaleur', 0, 6);
            go._chaleur = (go._chaleur || 0) + 1;
            if (go._chaleur >= max) {
                dire('\\C[18]★ SURCHAUFFE ! ' + go.name() + ' disjoncte.\\C[0]');
                go.gainHp(-Math.floor(go.mhp * 0.06));
                go.addState(SURCHARGE);
                go.refresh();
                go._chaleur = 0;
            } else if (go._chaleur >= max - 2) {
                dire(go.name() + ' chauffe dangereusement…');
            }
        }

        // ——— LE NON-DÉFINI · la recompilation
        var nd = boss('MecaRecompile');
        if (nd) {
            var palier = Math.ceil(nd.hpRate() * 5);
            if (nd._palierRecompile === undefined) nd._palierRecompile = palier;
            if (palier < nd._palierRecompile) {
                nd._palierRecompile = palier;
                recompiler(nd);
                dire('\\C[14]★ ' + nd.name() + ' se recompile. Ce que tu savais ne vaut plus.\\C[0]');
            }
        }

        // ——— LA PONDEUSE · la ponte
        var po = boss('MecaPonte');
        if (po && po.isStateAffected(CHARGE)) {
            var maxVivants = arg(po, 'MecaPonte', 1, 3);
            var couvee = $gameTroop.members().filter(function (m) {
                return m !== po && !meca(m, 'MecaPonte');
            });
            var debout = couvee.filter(function (m) { return m.isAlive() && m.isAppeared(); }).length;
            var dort = couvee.filter(function (m) { return !m.isAppeared(); })[0];
            if (dort && debout < maxVivants) {
                dort.appear();
                $gameTroop.makeUniqueNames();
                dire('\\C[14]Un œuf éclot : ' + dort.name() + ' !\\C[0]');
            }
        }
    }

    // Le Non-Défini : ses taux d'élément sont retirés au sort à chaque palier.
    // On ne touche pas à ses traits (partagés par toute la base) : on pose une
    // table d'exception sur LE combattant, lue par elementRate.
    function recompiler(b) {
        var table = {};
        // éléments 1 à 16 : deux faiblesses, deux résistances, tirées au sort
        var pool = [];
        for (var i = 1; i <= 16; i++) pool.push(i);
        for (var k = pool.length - 1; k > 0; k--) {
            var j = Math.floor(Math.random() * (k + 1));
            var t = pool[k]; pool[k] = pool[j]; pool[j] = t;
        }
        table[pool[0]] = 1.8; table[pool[1]] = 1.5;
        table[pool[2]] = 0.4; table[pool[3]] = 0.5;
        b._tableRecompile = table;
    }

    var _elementRate = Game_BattlerBase.prototype.elementRate;
    Game_BattlerBase.prototype.elementRate = function (elementId) {
        if (this._tableRecompile && this._tableRecompile[elementId] !== undefined) {
            return this._tableRecompile[elementId];
        }
        return _elementRate.call(this, elementId);
    };

    //=======================================================================
    // Les dégâts SUBIS par le boss
    //=======================================================================
    var _executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        if (value > 0) {
            // KARKINOS · rétracté, le physique glisse sur la carapace
            if (meca(target, 'MecaCarapace') && target.isStateAffected(CHARGE) && this.isPhysical()) {
                var pct = arg(target, 'MecaCarapace', 0, 20) / 100;
                if (value > 1) dire('La carapace de ' + target.name() + ' encaisse. (la magie, elle, passe)');
                value = Math.max(1, Math.floor(value * pct));
            }
            // RUKKHA · tête rentrée, puis sur le dos
            if (meca(target, 'MecaRetournement')) {
                if (target.isStateAffected(CHARGE)) value = Math.max(1, Math.floor(value / 3));
                else if (target.isStateAffected(SURCHARGE)) value = Math.floor(value * 2);
            }
        }
        _executeDamage.call(this, target, value);
    };

    //=======================================================================
    // Les dégâts INFLIGÉS
    //=======================================================================
    var _makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _makeDamageValue.call(this, target, critical);
        var s = this.subject();
        // LE DERNIER DES PETITS · plus il est seul et blessé, plus il frappe
        if (v > 0 && meca(s, 'MecaNombre')) {
            var bonus = arg(s, 'MecaNombre', 0, 120) / 100;
            v = Math.floor(v * (1 + bonus * (1 - s.hpRate())));
        }
        // NOM EFFACÉ · un héros privé de son nom frappe à moitié
        if (v > 0 && s && s._nomPris) v = Math.floor(v * 0.5);
        return v;
    };

    // LEVIATHAN · quand l'eau s'est retirée, plus rien ne couvre
    var _itemHit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function (target) {
        var s = this.subject();
        if (meca(s, 'MecaMaree') && s.isStateAffected(CHARGE)) return 1;
        return _itemHit.call(this, target);
    };
    var _itemEva = Game_Action.prototype.itemEva;
    Game_Action.prototype.itemEva = function (target) {
        var s = this.subject();
        if (meca(s, 'MecaMaree') && s.isStateAffected(CHARGE)) return 0;
        return _itemEva.call(this, target);
    };

    // LA FORME DE VIE ULTIME · une frappe par gueule encore ouverte
    var _numRepeats = Game_Action.prototype.numRepeats;
    Game_Action.prototype.numRepeats = function () {
        var n = _numRepeats.call(this);
        var s = this.subject();
        if (meca(s, 'MecaGueules') && this.item() && /<\s*Apres\s*:\s*surcharge\s*>/i.test(this.item().note || '')) {
            var total = arg(s, 'MecaGueules', 0, 5);
            // une gueule se ferme à chaque cinquième de PV perdu
            var ouvertes = Math.max(1, Math.ceil(s.hpRate() * total));
            n = n * ouvertes;
        }
        return n;
    };

    //=======================================================================
    // NOM EFFACÉ · la frappe prend un nom ; la Surcharge le rend
    //=======================================================================
    var _applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function () {
        _applyGlobal.call(this);
        var s = this.subject();
        if (!meca(s, 'MecaNom')) return;
        if (!this.item() || !/<\s*Apres\s*:\s*surcharge\s*>/i.test(this.item().note || '')) return;
        var v = auHasard(herosVivants());
        if (v) {
            herosVivants().forEach(function (h) { h._nomPris = false; });
            v._nomPris = true;
            dire('\\C[2]' + s.name() + ' prend le nom de ' + v.name() + '. Il ne se reconnaît plus.\\C[0]');
        }
    };

    var _addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        _addState.call(this, stateId);
        if (stateId === SURCHARGE) {
            // la fenêtre de riposte efface la Dîme et rend les noms
            if (meca(this, 'MecaDime') && this._dimeCible) {
                dire('\\C[14]Le registre de ' + this.name() + ' tombe. La Dîme est effacée.\\C[0]');
                this._dimeCible = null;
            }
            if (meca(this, 'MecaNom')) {
                herosVivants().forEach(function (h) {
                    if (h._nomPris) { h._nomPris = false; dire('\\C[14]' + h.name() + ' retrouve son nom.\\C[0]'); }
                });
            }
        }
    };

    //=======================================================================
    // REPRISE 21 · il revient, avec moins à chaque fois
    //=======================================================================
    var _die = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function () {
        var n = arg(this, 'MecaReprises', 0, 0);
        if (n && (this._reprises || 0) < n) {
            this._reprises = (this._reprises || 0) + 1;
            var part = 1 - this._reprises / (n + 1);
            _die.call(this);
            this.clearStates();
            this.setHp(Math.max(1, Math.floor(this.mhp * part)));
            this.refresh();
            dire('\\C[14]★ Reprise n°' + (this._reprises + 1) + '. ' + this.name() + ' recommence.\\C[0]');
            return;
        }
        _die.call(this);
    };

    //=======================================================================
    // Remise à zéro en début de combat : rien ne doit traîner d'un combat
    // à l'autre (les Game_Enemy sont recréés, les héros non).
    //=======================================================================
    var _onBattleStart = Game_Party.prototype.onBattleStart;
    Game_Party.prototype.onBattleStart = function () {
        _onBattleStart.call(this);
        this.members().forEach(function (h) { h._nomPris = false; });
    };
    var _onBattleEnd = Game_Party.prototype.onBattleEnd;
    Game_Party.prototype.onBattleEnd = function () {
        _onBattleEnd.call(this);
        this.members().forEach(function (h) { h._nomPris = false; });
    };
})();
