//=============================================================================
// EvenementsPlus.js — v1.0  ·  Des événements qui se réutilisent
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, de Event Copier, Event Morpher, Event
//   Spawner, Call Event, Self Switches & Variables, Event Mini Label, Event
//   Hitbox Resize, Slippery Tiles et Footstep Sounds (Yanfly).
//   Rien ne change tant qu'on n'emploie pas une balise ou une commande.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Modèles d'événements, appeler un autre événement,
 * variables locales, étiquettes au-dessus des PNJ, gros événements, sols glissants, bruits de pas.
 * @author JOKO
 *
 * @param cartesModeles
 * @text Cartes de modèles
 * @default 70
 * @desc Numéros des cartes où piocher les modèles, séparés par des virgules. 70 = la vitrine des recettes.
 *
 * @param distanceEtiquette
 * @text Distance d'affichage des étiquettes (cases)
 * @type number
 * @min 1
 * @default 4
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  DES ÉVÉNEMENTS QUI SE RÉUTILISENT
 * ═══════════════════════════════════════════════════════════════════════════
 *  ── MODÈLES (une fois écrit, partout) ─────────────────────────────────
 *  Dans la NOTE d'un événement :   <Modèle: 70, 123>
 *  → il prend les pages (image, commandes, conditions) de l'événement 123 de
 *  la carte 70. La vitrine (carte 70) est pleine de recettes prêtes : un
 *  coffre, une porte, un marchand… Corrige le modèle : tous ses exemplaires
 *  changent. Pour avoir ta propre carte de modèles, ajoute son numéro au
 *  paramètre « Cartes de modèles ».
 *
 *      MODELE changer 5 70 123     l'événement 5 devient le modèle 123 (gardé
 *                                  dans la sauvegarde) · MODELE changer 5 off
 *      MODELE poser 70 123 12 8    pose une copie du modèle en 12,8 (jusqu'au
 *                                  prochain changement de carte)
 *
 *  ── APPELER UN AUTRE ÉVÉNEMENT ─────────────────────────────────────────
 *      APPEL 7          joue la page active de l'événement 7, puis revient
 *      APPEL 7 2        joue sa page 2
 *      APPEL 7 2 70     la page 2 de l'événement 7 de la carte 70 (modèle)
 *  Comme un événement commun, mais écrit sur la carte, à côté du reste.
 *
 *  ── VARIABLES LOCALES (propres à un événement) ────────────────────────
 *      LOCALE visites + 1          LOCALE humeur = 3        LOCALE x - 2
 *  Condition (Script) :  this.locale('visites') >= 3
 *  Texte : \lv[visites]. Chaque événement a les siennes, comme les
 *  interrupteurs locaux, mais avec des nombres et autant qu'on veut.
 *
 *  ── ÉTIQUETTES AU-DESSUS DES PNJ ──────────────────────────────────────
 *  Note de l'événement, ou commentaire dans la page active :
 *      <Étiquette: Forgeron>        <Étiquette: \c[6]Auberge>
 *  Le nom apparaît quand le joueur s'approche (4 cases) et s'efface quand il
 *  s'éloigne. Un commentaire suit la page : il peut changer avec elle.
 *
 *  ── GROS ÉVÉNEMENTS ───────────────────────────────────────────────────
 *  Note :  <Taille: 3x2>  → l'événement occupe 3 cases de large et 2 de haut
 *  (centré en bas, comme son image) : on le touche et il bloque partout.
 *  Pour un dragon, un chariot, un portail.
 *
 *  ── SOLS GLISSANTS ────────────────────────────────────────────────────
 *  Note de la CARTE :  <Glissant: 5>  (ou <Glissant: 5, 6>) → sur les cases
 *  de région 5, le joueur glisse jusqu'à heurter quelque chose. Pour la glace.
 *
 *  ── BRUITS DE PAS ─────────────────────────────────────────────────────
 *  Note de la CARTE :  <Pas: Step1>  → un son à chaque pas du joueur.
 *  Par région :  <Pas région 3: Sand>  (le sable sur la région 3).
 *  Volume réglé sur les « Sons » du menu Options.
 */
var EvenementsPlus = window.EvenementsPlus || {};
window.EvenementsPlus = EvenementsPlus;
(function () {
    'use strict';
    var P = PluginManager.parameters('EvenementsPlus');
    var CARTES = String(P.cartesModeles || '70').split(/[,\s]+/).map(Number).filter(function (n) { return n > 0; });
    var DIST = Math.max(1, Number(P.distanceEtiquette || 4));

    //=========================================================================
    // Les cartes de modèles, chargées au démarrage
    //=========================================================================
    var MODELES = {};
    EvenementsPlus.modeles = MODELES;
    CARTES.forEach(function (id) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/Map' + String(id).padStart(3, '0') + '.json');
        xhr.overrideMimeType('application/json');
        xhr.onload = function () {
            if (xhr.status >= 400) return;
            try {
                var m = JSON.parse(xhr.responseText);
                // comme MV au chargement d'une carte : la « meta » des notes
                // (GALV_ActionIndicators et d'autres la lisent dès la création)
                DataManager.extractMetadata(m);
                (m.events || []).forEach(function (e) { if (e) DataManager.extractMetadata(e); });
                MODELES[id] = m;
            } catch (e) { }
        };
        xhr.send();
    });
    EvenementsPlus.pret = function () { return CARTES.every(function (id) { return !!MODELES[id]; }); };
    var _isReady = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function () { return _isReady.call(this) && (EvenementsPlus.pret() || Date.now() - (this._epT0 || (this._epT0 = Date.now())) > 8000); };

    function modele(carte, id) {
        var m = carte === $gameMap.mapId() ? $dataMap : MODELES[carte];
        return m && m.events && m.events[id] ? m.events[id] : null;
    }
    function lireModele(note) {
        var m = /<Mod[eè]le\s*:\s*(\d+)\s*,\s*(\d+)\s*>/i.exec(note || '');
        return m ? { carte: Number(m[1]), id: Number(m[2]) } : null;
    }
    function morphes() { return ($gameSystem._epMorphes = $gameSystem._epMorphes || {}); }

    // l'événement tel que le jeu le voit : ses pages, ou celles de son modèle
    var _event = Game_Event.prototype.event;
    Game_Event.prototype.event = function () {
        var e = _event.call(this);
        if (!e) return e;
        // appelé des dizaines de fois par image : la note n'est lue qu'une fois
        if (this._epNoteLue !== e) { this._epNoteLue = e; this._epRef = lireModele(e.note); this._epCleMorphe = this._mapId + ':' + this._eventId; }
        var f = $gameSystem && $gameSystem._epMorphes && $gameSystem._epMorphes[this._epCleMorphe];
        var ref = f || this._epRef;
        if (!ref) return e;
        var cle = ref.carte + ':' + ref.id;
        if (this._epCle !== cle) {
            var t = modele(ref.carte, ref.id);
            if (!t) return e;
            this._epCle = cle;
            this._epCopie = { id: e.id, name: e.name, note: e.note + '\n' + (t.note || ''), x: e.x, y: e.y, meta: e.meta || {}, pages: t.pages };
        }
        return this._epCopie;
    };

    //=========================================================================
    // Les variables locales
    //=========================================================================
    function locales() { return ($gameSystem._epLocales = $gameSystem._epLocales || {}); }
    Game_Interpreter.prototype.locale = function (nom, carte, ev) {
        var v = locales()[(carte || this._mapId) + ':' + (ev || this._eventId) + ':' + nom];
        return v === undefined ? 0 : v;
    };
    var _convLV = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function (text) {
        text = String(text).replace(/\\lv\[([^\]]+)\]/gi, function (a, n) {
            var it = $gameMap._interpreter;
            return it ? it.locale(n.trim()) : 0;
        });
        return _convLV.call(this, text);
    };

    //=========================================================================
    // Les commandes
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pc.call(this, command, args);
        var c = String(command || '').toUpperCase();
        if (c === 'APPEL') {
            var ev = Number(args[0]) || this._eventId, page = Number(args[1]) || 0, carte = Number(args[2]) || 0;
            var liste = null;
            if (carte && carte !== $gameMap.mapId()) {
                var t = modele(carte, ev);
                if (t) liste = (t.pages[(page || 1) - 1] || t.pages[0]).list;
            } else {
                var e = $gameMap.event(ev);
                if (e) liste = page ? (e.event().pages[page - 1] || {}).list : (e.page() ? e.page().list : null);
            }
            if (liste) this.setupChild(liste, this._eventId);
            else console.warn('[EvenementsPlus] APPEL : rien à jouer pour ' + args.join(' '));
        } else if (c === 'LOCALE') {
            var nom = String(args[0] || ''), op = String(args[1] || '='), val = Number(args[2]) || 0;
            var k = this._mapId + ':' + this._eventId + ':' + nom, L = locales(), v = L[k] || 0;
            L[k] = op === '+' ? v + val : op === '-' ? v - val : op === '*' ? v * val : val;
        } else if (c === 'MODELE' || c === 'MODÈLE') {
            var sous = String(args[0] || '').toLowerCase();
            if (sous === 'changer') {
                var id = Number(args[1]), cle = $gameMap.mapId() + ':' + id;
                if (/^off$/i.test(args[2])) delete morphes()[cle];
                else morphes()[cle] = { carte: Number(args[2]), id: Number(args[3]) };
                var cible = $gameMap.event(id);
                // MV ne refait la page que si son numéro change : on l'y oblige
                if (cible) { cible._epCle = null; cible._pageIndex = -2; cible.refresh(); }
            } else if (sous === 'poser') {
                EvenementsPlus.poser(Number(args[1]), Number(args[2]), Number(args[3]), Number(args[4]));
            }
        }
    };

    // une copie posée sur la carte (Event Spawner)
    EvenementsPlus.poser = function (carte, idModele, x, y) {
        var t = modele(carte, idModele);
        if (!t) return null;
        var id = Math.max($dataMap.events.length, $gameMap._events.length);
        var data = JSON.parse(JSON.stringify(t));
        data.id = id; data.x = x; data.y = y;
        $dataMap.events[id] = data;
        var ev = new Game_Event($gameMap.mapId(), id);
        $gameMap._events[id] = ev;
        var s = SceneManager._scene;
        if (s instanceof Scene_Map && s._spriteset) {
            var sp = new Sprite_Character(ev);
            s._spriteset._characterSprites.push(sp);
            s._spriteset._tilemap.addChild(sp);
        }
        return ev;
    };

    //=========================================================================
    // Les étiquettes
    //=========================================================================
    function etiquetteDe(ev) {
        var p = ev.page && ev.page();
        if (p) {
            for (var i = 0; i < p.list.length; i++) {
                var c = p.list[i];
                if (c.code !== 108 && c.code !== 408) { if (i > 0) break; else continue; }
                var m = /<[ÉE]tiquette\s*:\s*([^>]+)>/i.exec(c.parameters[0]);
                if (m) return m[1].trim();
            }
        }
        var n = /<[ÉE]tiquette\s*:\s*([^>]+)>/i.exec((ev.event() && ev.event().note) || '');
        return n ? n[1].trim() : '';
    }
    var _scu = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function () {
        _scu.call(this);
        var c = this._character;
        if (!(c instanceof Game_Event)) return;
        if (c._epEtiq === undefined || c._epEtiqPage !== c._pageIndex) { c._epEtiqPage = c._pageIndex; c._epEtiq = etiquetteDe(c); }
        if (!c._epEtiq) { if (this._epEtiq) this._epEtiq.visible = false; return; }
        if (!this._epEtiq) {
            this._epEtiq = new Sprite(new Bitmap(240, 28));
            this._epEtiq.anchor.x = 0.5; this._epEtiq.anchor.y = 1; this._epEtiq.opacity = 0;
            this.addChild(this._epEtiq);
        }
        var e = this._epEtiq;
        if (e._texte !== c._epEtiq) {
            e._texte = c._epEtiq;
            var w = new Window_Base(0, 0, 1, 1);   // pour les codes (\c, \i)
            e.bitmap.clear();
            var b = e.bitmap; b.fontSize = 18; b.outlineWidth = 4;
            var brut = w.convertEscapeCharacters(c._epEtiq), couleur = '#ffffff', m = /\x1bC\[(\d+)\]/i.exec(brut);
            if (m) couleur = w.textColor(Number(m[1]));
            b.textColor = couleur;
            b.drawText(brut.replace(/\x1b[A-Z]+\[\d+\]/gi, ''), 0, 0, 240, 28, 'center');
        }
        var d = Math.abs($gamePlayer.x - c.x) + Math.abs($gamePlayer.y - c.y);
        var but = (d <= DIST && !c.isTransparent() && !c._erased) ? 255 : 0;
        e.opacity += but > e.opacity ? 24 : (but < e.opacity ? -24 : 0);
        e.visible = e.opacity > 0;
        e.y = -(this.patternHeight ? this.patternHeight() : 48);
    };

    //=========================================================================
    // Les gros événements
    //=========================================================================
    function taille(ev) {
        if (ev._epTaille === undefined) {
            var m = /<Taille\s*:\s*(\d+)\s*x\s*(\d+)\s*>/i.exec((ev.event() && ev.event().note) || '');
            ev._epTaille = m ? { l: Number(m[1]), h: Number(m[2]) } : null;
        }
        return ev._epTaille;
    }
    var _pos = Game_Event.prototype.pos;
    Game_Event.prototype.pos = function (x, y) {
        var t = taille(this);
        if (!t) return _pos.call(this, x, y);
        var g = this.x - Math.floor((t.l - 1) / 2);
        return x >= g && x < g + t.l && y <= this.y && y > this.y - t.h;
    };

    //=========================================================================
    // Les sols glissants et les bruits de pas (notes de la carte)
    //=========================================================================
    function noteCarte() { return ($dataMap && $dataMap.note) || ''; }
    function regionsGlissantes() {
        if ($gameMap._epGlisseCarte !== $gameMap.mapId()) {
            $gameMap._epGlisseCarte = $gameMap.mapId();
            var m = /<Glissant\s*:\s*([\d,\s]+)>/i.exec(noteCarte());
            $gameMap._epGlisse = m ? m[1].split(',').map(Number) : [];
        }
        return $gameMap._epGlisse;
    }
    EvenementsPlus.glissant = function (x, y) {
        var r = regionsGlissantes();
        return r.length > 0 && r.indexOf($gameMap.regionId(x, y)) >= 0;
    };
    var _unm = Game_Player.prototype.updateNonmoving;
    Game_Player.prototype.updateNonmoving = function (wasMoving) {
        if (wasMoving && EvenementsPlus.glissant(this.x, this.y) && !$gameMap.isEventRunning() && !this.isMoveRouteForcing()) {
            this.moveStraight(this.direction());
            if (this.isMovementSucceeded()) { this._epGlisse = true; return; }
        }
        this._epGlisse = false;
        _unm.call(this, wasMoving);
    };
    var _anime = Game_Player.prototype.updateAnimation;
    Game_Player.prototype.updateAnimation = function () {
        if (this._epGlisse) { this._pattern = 1; this._animationCount = 0; return; }   // on glisse, on ne marche pas
        _anime.call(this);
    };

    function sonDesPas(x, y) {
        var n = noteCarte(), r = $gameMap.regionId(x, y);
        var m = new RegExp('<Pas r[ée]gion ' + r + '\\s*:\\s*([^>]+)>', 'i').exec(n) || /<Pas\s*:\s*([^>]+)>/i.exec(n);
        return m ? m[1].trim() : '';
    }
    var _inc = Game_Player.prototype.increaseSteps;
    Game_Player.prototype.increaseSteps = function () {
        _inc.call(this);
        if (this._epGlisse) return;
        var s = sonDesPas(this.x, this.y);
        if (s) AudioManager.playSe({ name: s, volume: 35, pitch: 90 + Math.randomInt(21), pan: 0 });
    };
})();
