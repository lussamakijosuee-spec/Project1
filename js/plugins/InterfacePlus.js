//=============================================================================
// InterfacePlus.js — v1.0  ·  Touches, images cliquables, menus maison
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, de Button Common Events, Picture Common
//   Events et Common Event Menu (Yanfly). Rien n'est branché par défaut.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Une touche lance un événement commun, une image
 * cliquable aussi, et un menu qui liste des événements communs.
 * @author JOKO
 *
 * @param touches
 * @text Touches → événements communs
 * @type note
 * @default ""
 * @desc Une par ligne : « M = 1050 » (la touche M lance l'événement commun 1050). Vide = aucune.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  TOUCHES, IMAGES CLIQUABLES, MENUS MAISON
 * ═══════════════════════════════════════════════════════════════════════════
 *  ── UNE TOUCHE, UN ÉVÉNEMENT COMMUN ───────────────────────────────────
 *  Dans les paramètres :   M = 1050      (une par ligne)
 *  Ou en jeu :
 *      TOUCHE M 1050      la touche M lance l'événement commun 1050
 *      TOUCHE M off       la touche M ne fait plus rien
 *  Sur la carte, quand rien d'autre ne se passe. Touches libres : les
 *  lettres sauf Q W X Z, et les chiffres 1 à 9 (les autres servent déjà).
 *  Pour une carte du monde, un journal, un pouvoir de terrain…
 *
 *  ── UNE IMAGE CLIQUABLE ───────────────────────────────────────────────
 *      IMAGE clic 3 1020     un clic sur l'image n°3 lance l'événement commun 1020
 *      IMAGE clic 3 off
 *  Avec « Afficher une image », de quoi faire tes propres écrans : une carte
 *  où l'on clique sur une ville, un inventaire en images, un code à taper.
 *  L'image grossit un peu quand la souris passe dessus.
 *
 *  ── UN MENU D'ÉVÉNEMENTS COMMUNS ──────────────────────────────────────
 *      MENU_EC 1001 1002 1005        ou     MENU_EC 1001-1010
 *  Une liste s'ouvre avec le NOM de ces événements communs ; le joueur en
 *  choisit un, il est joué, puis l'événement reprend. Échap : rien.
 *  Un commentaire <si: s[12]> dans l'événement commun : il n'apparaît dans
 *  le menu que si l'interrupteur 12 est ON (s[n], v[n], ou du JavaScript)
 *  — de quoi débloquer des destinations au fil du jeu. Le premier
 *  commentaire de l'événement commun sert d'aide.
 */
var InterfacePlus = window.InterfacePlus || {};
window.InterfacePlus = InterfacePlus;
(function () {
    'use strict';
    var P = PluginManager.parameters('InterfacePlus');

    //=========================================================================
    // Les touches
    //=========================================================================
    var DEFAUT = {};
    (function () {
        var brut = P.touches || '';
        try { brut = JSON.parse(brut); } catch (e) { }
        String(brut).split(/\r?\n/).forEach(function (l) {
            var m = /^\s*([A-Za-z0-9])\s*=\s*(\d+)/.exec(l);
            if (m) DEFAUT[m[1].toUpperCase()] = Number(m[2]);
        });
    })();
    var RESERVEES = { Q: 1, W: 1, X: 1, Z: 1 };
    function touches() {
        if (!$gameSystem._ipTouches) $gameSystem._ipTouches = JSON.parse(JSON.stringify(DEFAUT));
        return $gameSystem._ipTouches;
    }
    InterfacePlus.touches = function () { return touches(); };
    var enAttente = [];
    document.addEventListener('keydown', function (e) {
        if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
        var k = (e.key || '').toUpperCase();
        if (/^[A-Z0-9]$/.test(k) && !RESERVEES[k]) enAttente.push(k);
    });
    function peutLancer() {
        return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging() && !$gameMap.isEventRunning() &&
            !$gameMessage.isBusy() && !$gamePlayer.isTransferring() && !(window.ConfortDeLecture && ConfortDeLecture.ouvert());
    }
    InterfacePlus.appuyer = function (k) { enAttente.push(String(k).toUpperCase()); };

    //=========================================================================
    // Les images cliquables
    //=========================================================================
    function clics() { return ($gameSystem._ipClics = $gameSystem._ipClics || {}); }
    function spriteImage(scene, n) {
        var c = scene._spriteset && scene._spriteset._pictureContainer;
        if (!c) return null;
        for (var i = 0; i < c.children.length; i++) if (c.children[i]._pictureId === n) return c.children[i];
        return null;
    }
    function sousLaSouris(sp, x, y) {
        if (!sp || !sp.visible || sp.opacity <= 0 || !sp.bitmap || !sp.bitmap.isReady()) return false;
        var b = sp.getBounds();
        return x >= b.x && x < b.x + b.width && y >= b.y && y < b.y + b.height;
    }
    function imageCliquee(scene) {
        var C = clics(), x = TouchInput.x, y = TouchInput.y, trouve = null;
        Object.keys(C).sort(function (a, b) { return b - a; }).some(function (n) {   // la plus haute d'abord
            if (sousLaSouris(spriteImage(scene, Number(n)), x, y)) { trouve = Number(n); return true; }
            return false;
        });
        return trouve;
    }
    InterfacePlus.imageSous = function (x, y) {
        var s = SceneManager._scene, C = clics();
        for (var n in C) if (sousLaSouris(spriteImage(s, Number(n)), x, y)) return Number(n);
        return 0;
    };
    var _pmt = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function () {
        if (TouchInput.isTriggered() && Object.keys(clics()).length) {
            var n = imageCliquee(this);
            if (n) { $gameTemp.reserveCommonEvent(clics()[n]); SoundManager.playOk(); TouchInput.clear(); this._touchCount = 0; return; }
        }
        _pmt.call(this);
    };
    // le survol : l'image grossit un peu (et se rétablit)
    var _spu = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function () {
        _spu.call(this);
        if (!$gameSystem || !$gameSystem._ipClics || !$gameSystem._ipClics[this._pictureId]) return;
        var dessus = sousLaSouris(this, TouchInput.x, TouchInput.y);
        var k = dessus ? 1.06 : 1;
        this.scale.x *= k; this.scale.y *= k;
    };
    // un clic sur une image pendant un événement (un menu en images dans une
    // scène) : l'événement commun est joué tout de suite, par-dessus
    var _smu = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        if (TouchInput.isTriggered() && $gameMap.isEventRunning() && Object.keys(clics()).length && !$gameMessage.isBusy()) {
            var n = imageCliquee(this);
            if (n) { $gameMap._interpreter.setupChild($dataCommonEvents[clics()[n]].list, 0); SoundManager.playOk(); TouchInput.clear(); }
        }
        if (enAttente.length) {
            var k = enAttente.shift(), id = touches()[k];
            if (id && peutLancer() && $dataCommonEvents[id]) $gameTemp.reserveCommonEvent(id);
            if (!peutLancer()) enAttente.length = 0;
        }
        _smu.call(this);
    };

    //=========================================================================
    // Le menu d'événements communs
    //=========================================================================
    function nomPropre(c) {
        return String(c.name || '').replace(/^[✎\s]+/, '').replace(/^[^·]{1,30}·\s*/, '').trim() || ('Événement commun ' + c.id);
    }
    function aideDe(c) {
        var l = c.list || [];
        for (var i = 0; i < l.length; i++) {
            if (l[i].code === 108) {
                var t = [l[i].parameters[0]];
                for (var j = i + 1; l[j] && l[j].code === 408; j++) t.push(l[j].parameters[0]);
                return t.join(' ').replace(/^[═\s]+|[═\s]+$/g, '');
            }
            if (l[i].code !== 0) break;
        }
        return '';
    }
    // <si: s[12]> dans un commentaire de l'événement commun : il n'apparaît
    // dans le menu que si la condition est vraie (s[n], v[n], ou du JavaScript)
    // Les balises <nom: expression> d'un texte. L'expression peut contenir « > »
    // (v[3] >= 2) : elle va jusqu'au DERNIER « > » avant la balise suivante,
    // ou avant la fin du texte. ([^>]+ s'arrêtait au « > » de « >= » : la
    // condition devenait « v[3] », vraie dès que la variable n'était pas nulle.)
    function balises(texte, noms) {
        var re = new RegExp('<\\s*(' + noms + ')\\s*:', 'gi'), m, debuts = [], out = [];
        while ((m = re.exec(texte))) debuts.push({ i: m.index, apres: re.lastIndex, nom: m[1].toLowerCase() });
        debuts.forEach(function (d, k) {
            var bout = k + 1 < debuts.length ? debuts[k + 1].i : texte.length;
            var f = texte.lastIndexOf('>', bout - 1);
            if (f >= d.apres) out.push({ nom: d.nom, expr: texte.slice(d.apres, f).trim(), debut: d.i, fin: f + 1 });
        });
        return out;
    }
    function visibleDansLeMenu(c) {
        var ok = true;
        (c.list || []).forEach(function (x) {
            if (x.code !== 108 && x.code !== 408) return;
            balises(String(x.parameters[0] || ''), 'si').forEach(function (b) {
                var js = b.expr.replace(/\bs\[\s*(\d+)\s*\]/g, '$gameSwitches.value($1)').replace(/\bv\[\s*(\d+)\s*\]/g, '$gameVariables.value($1)');
                try { if (!(new Function('return (' + js + ');'))()) ok = false; } catch (e) { console.warn('[InterfacePlus] condition illisible : ' + b.expr); }
            });
        });
        return ok;
    }
    function Window_MenuEC() { this.initialize.apply(this, arguments); }
    Window_MenuEC.prototype = Object.create(Window_Command.prototype);
    Window_MenuEC.prototype.constructor = Window_MenuEC;
    Window_MenuEC.prototype.initialize = function (ids) {
        this._ids = ids;
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = Math.max(0, (Graphics.boxHeight - this.height) / 2 - 40);
    };
    Window_MenuEC.prototype.windowWidth = function () { return 420; };
    Window_MenuEC.prototype.numVisibleRows = function () { return Math.min(8, Math.max(1, this.maxItems())); };
    Window_MenuEC.prototype.makeCommandList = function () {
        (this._ids || []).forEach(function (id) {
            var c = $dataCommonEvents[id];
            if (!c) return;
            if (!visibleDansLeMenu(c)) return;
            this.addCommand(nomPropre(c), 'ec', true, id);
        }, this);
    };
    Window_MenuEC.prototype.updateHelp = function () {
        if (this._helpWindow) this._helpWindow.setText(this.currentExt() ? aideDe($dataCommonEvents[this.currentExt()]) : '');
    };

    InterfacePlus.ouvrirMenu = function (interp, ids) {
        var s = SceneManager._scene;
        if (!(s instanceof Scene_Map)) return;
        var w = new Window_MenuEC(ids);
        var h = new Window_Help(2);
        h.y = Graphics.boxHeight - h.height;
        w.setHelpWindow(h);
        s.addWindow(h); s.addWindow(w);
        interp._ipMenu = { w: w, h: h, choisi: null, fini: false };
        var fermer = function (id) {
            interp._ipMenu.choisi = id; interp._ipMenu.fini = true;
            w.close(); h.close(); w.deactivate();
        };
        w.setHandler('ec', function () { fermer(w.currentExt()); });
        w.setHandler('cancel', function () { fermer(null); });
        if (!w.maxItems()) fermer(null);
        else { w.select(0); w.activate(); }
        interp.setWaitMode('ipMenu');
    };
    var _uwm = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === 'ipMenu') {
            var m = this._ipMenu;
            if (m && !m.fini) return true;
            this._waitMode = '';
            if (m) {
                this._ipMenu = null;
                // le choix d'abord, la ligne suivante ensuite : on rend la main
                // une image, le temps que l'enfant démarre
                if (m.choisi && $dataCommonEvents[m.choisi]) { this.setupChild($dataCommonEvents[m.choisi].list, this._eventId); return true; }
            }
            return false;
        }
        return _uwm.call(this);
    };
    // le joueur ne marche pas, et le menu principal ne s'ouvre pas, pendant le menu
    var _canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function () {
        var it = $gameMap && $gameMap._interpreter;
        if (it && it._ipMenu && !it._ipMenu.fini) return false;
        return _canMove.call(this);
    };

    //=========================================================================
    // Les commandes
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pc.call(this, command, args);
        var c = String(command || '').toUpperCase();
        if (c === 'TOUCHE') {
            var k = String(args[0] || '').toUpperCase();
            if (!/^[A-Z0-9]$/.test(k) || RESERVEES[k]) return;
            if (/^off$/i.test(args[1])) delete touches()[k]; else touches()[k] = Number(args[1]) || 0;
        } else if (c === 'IMAGE' && String(args[0] || '').toLowerCase() === 'clic') {
            var n = Number(args[1]);
            if (/^off$/i.test(args[2])) delete clics()[n]; else clics()[n] = Number(args[2]) || 0;
        } else if (c === 'MENU_EC') {
            var ids = [];
            args.forEach(function (a) {
                var m = /^(\d+)-(\d+)$/.exec(a);
                if (m) { for (var i = Number(m[1]); i <= Number(m[2]); i++) ids.push(i); }
                else if (Number(a)) ids.push(Number(a));
            });
            InterfacePlus.ouvrirMenu(this, ids);
        }
    };
})();
