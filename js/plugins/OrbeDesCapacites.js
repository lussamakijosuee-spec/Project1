//=============================================================================
// OrbeDesCapacites.js — v1.0
// L'Orbe des Capacités — l'écran des compétences, en arbre
// RPG Maker MV
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Remplace l'écran des compétences par un ORBE : le héros
 * au centre, ses voies en branches, ses compétences en nœuds.
 *
 * @param Rayon de l'orbe
 * @type number
 * @min 40
 * @max 120
 * @desc Rayon du disque central, en pixels.
 * @default 74
 *
 * @param Rayon des branches
 * @type number
 * @min 90
 * @max 200
 * @desc Distance du centre à laquelle les branches se posent.
 * @default 148
 *
 * @param Titre
 * @desc Ce qui s'écrit en haut de l'écran.
 * @default L'ORBE DES CAPACITÉS
 *
 * @help
 * ============================================================================
 *  Ce que c'est
 * ============================================================================
 *
 * L'écran des compétences de Yanfly listait des lignes. Celui-ci montre la
 * FORME d'un héros : son orbe au centre, une branche par type de compétence
 * autour, et les compétences de la branche choisie en nœuds, du plus tôt
 * appris au plus tard.
 *
 * Il REMPLACE Scene_Skill : tout ce qui envoyait vers l'ancien écran arrive
 * ici, le menu comme les appels de script. Rien n'est retiré du projet —
 * YEP_SkillCore continue de faire son travail sur les coûts, les cooldowns et
 * les évaluations ; c'est seulement l'affichage qui change.
 *
 * ============================================================================
 *  Comment on s'en sert
 * ============================================================================
 *
 *   ← →            changer de branche
 *   ↑ ↓            monter et descendre dans les nœuds
 *   Entrée         employer la compétence (hors combat, si elle le permet)
 *   Q / W          passer d'un héros à l'autre
 *   Échap          sortir
 *
 * ============================================================================
 *  Ce que montre un nœud
 * ============================================================================
 *
 * Un nœud plein = compétence apprise. Un nœud creux = elle viendra, et le
 * niveau où elle s'apprend est écrit à côté. Un nœud grisé = apprise, mais
 * impossible à employer maintenant (PM ou PT insuffisants, ou elle ne sert
 * qu'au combat).
 *
 * Les nœuds sont rangés par niveau d'apprentissage : le plus proche du centre
 * est le plus ancien. C'est la lecture des données de JOKO, pas une nouvelle
 * progression — rien n'est modifié dans les classes.
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('OrbeDesCapacites');
    var R_ORBE = Number(P['Rayon de l\'orbe'] || 74);
    var R_BRANCHE = Number(P['Rayon des branches'] || 148);
    var TITRE = String(P['Titre'] || 'L\'ORBE DES CAPACITÉS');

    // Le cadre : l'orbe occupe la moitié gauche, la liste des nœuds la droite.
    var H_TITRE = 72;
    var H_INFO = 168;
    var L_LISTE = 384;

    //=========================================================================
    // Une couleur stable par branche — même type, même teinte, toujours.
    //=========================================================================
    function teinte(stypeId) {
        var h = (stypeId * 47) % 360;
        return hsl(h, 70, 60);
    }
    function hsl(h, s, l) {
        s /= 100; l /= 100;
        var c = (1 - Math.abs(2 * l - 1)) * s;
        var x = c * (1 - Math.abs((h / 60) % 2 - 1));
        var m = l - c / 2, r = 0, g = 0, b = 0;
        if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; }
        else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; }
        else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
        return 'rgb(' + Math.round((r + m) * 255) + ',' + Math.round((g + m) * 255) + ',' + Math.round((b + m) * 255) + ')';
    }

    //=========================================================================
    // Ce que le héros sait, rangé en branches
    //=========================================================================
    // On réunit DEUX sources : les apprentissages de la classe (ils portent le
    // niveau, donc la place du nœud sur la branche) et les compétences que le
    // héros connaît vraiment (un trait, un équipement ou un événement peut lui
    // en avoir donné d'autres). Aucune donnée n'est réécrite : on lit.
    function branchesDe(acteur) {
        if (!acteur) { return []; }
        var vus = {}, parType = {};
        var classe = acteur.currentClass();
        (classe.learnings || []).forEach(function (l) {
            var s = $dataSkills[l.skillId];
            if (!s || !s.name) { return; }
            if (vus[s.id]) { return; }
            vus[s.id] = true;
            (parType[s.stypeId] = parType[s.stypeId] || []).push({ skill: s, niveau: l.level });
        });
        acteur.skills().forEach(function (s) {
            if (!s || !s.name || vus[s.id]) { return; }
            vus[s.id] = true;
            (parType[s.stypeId] = parType[s.stypeId] || []).push({ skill: s, niveau: 0 });
        });
        var types = acteur.addedSkillTypes().slice();
        var out = [];
        Object.keys(parType).map(Number).forEach(function (t) {
            var noeuds = parType[t].sort(function (a, b) {
                return (a.niveau - b.niveau) || (a.skill.id - b.skill.id);
            });
            out.push({
                stypeId: t,
                nom: $dataSystem.skillTypes[t] || ('Type ' + t),
                ouverte: types.indexOf(t) >= 0,   // un type qu'aucun trait n'ouvre reste invisible en combat
                couleur: teinte(t),
                noeuds: noeuds
            });
        });
        // les branches ouvertes d'abord, puis les plus fournies
        out.sort(function (a, b) {
            if (a.ouverte !== b.ouverte) { return a.ouverte ? -1 : 1; }
            return b.noeuds.length - a.noeuds.length;
        });
        return out;
    }

    //=========================================================================
    // Le dessin de l'orbe
    //=========================================================================
    function Sprite_Orbe() { this.initialize.apply(this, arguments); }
    Sprite_Orbe.prototype = Object.create(Sprite.prototype);
    Sprite_Orbe.prototype.constructor = Sprite_Orbe;

    Sprite_Orbe.prototype.initialize = function (x, y, largeur, hauteur) {
        Sprite.prototype.initialize.call(this, new Bitmap(largeur, hauteur));
        this.x = x; this.y = y;
        this._cx = Math.floor(largeur / 2);
        this._cy = Math.floor(hauteur / 2);
        this._acteur = null;
        this._branches = [];
        this._iBranche = 0;
        this._iNoeud = 0;
        this._pouls = 0;
    };

    Sprite_Orbe.prototype.poser = function (acteur, branches, iBranche, iNoeud) {
        var change = this._acteur !== acteur || this._iBranche !== iBranche || this._iNoeud !== iNoeud
            || this._branches.length !== branches.length;
        this._acteur = acteur;
        this._branches = branches;
        this._iBranche = iBranche;
        this._iNoeud = iNoeud;
        if (change) { this.redessiner(); }
    };

    Sprite_Orbe.prototype.update = function () {
        Sprite.prototype.update.call(this);
        this._pouls = (this._pouls + 1) % 120;
        if (this._pouls % 12 === 0) { this.redessiner(); }   // le halo respire
    };

    /** Une ligne, en pointillés de lumière : MV ne sait pas tracer de trait. */
    Sprite_Orbe.prototype.trait = function (x1, y1, x2, y2, couleur, pas, taille) {
        var d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        var n = Math.max(1, Math.floor(d / (pas || 7)));
        for (var i = 1; i < n; i++) {
            var t = i / n;
            this.bitmap.drawCircle(Math.round(x1 + (x2 - x1) * t), Math.round(y1 + (y2 - y1) * t),
                taille || 2, couleur);
        }
    };

    Sprite_Orbe.prototype.redessiner = function () {
        var b = this.bitmap;
        b.clear();
        if (!this._acteur) { return; }
        var cx = this._cx, cy = this._cy;
        var souffle = 1 + Math.sin(this._pouls / 120 * Math.PI * 2) * 0.04;

        // ── le halo, puis le disque central
        b.paintOpacity = 40;
        b.drawCircle(cx, cy, Math.round(R_ORBE * 1.45 * souffle), '#7fd8ff');
        b.paintOpacity = 90;
        b.drawCircle(cx, cy, Math.round(R_ORBE * 1.15), '#2b3d55');
        b.paintOpacity = 255;
        b.drawCircle(cx, cy, R_ORBE, '#10161f');

        // ── le visage du héros dans l'orbe
        var face = ImageManager.loadFace(this._acteur.faceName());
        if (face.width > 0) {
            var t = Window_Base._faceWidth;
            var sx = this._acteur.faceIndex() % 4 * t;
            var sy = Math.floor(this._acteur.faceIndex() / 4) * Window_Base._faceHeight;
            var d = R_ORBE * 2 - 12;
            b.blt(face, sx, sy, t, Window_Base._faceHeight, cx - d / 2, cy - d / 2, d, d);
        }
        b.paintOpacity = 120;
        b.drawCircle(cx, cy, R_ORBE, '#000000');
        b.paintOpacity = 255;

        // ── les branches autour
        var n = this._branches.length;
        if (n === 0) { return; }
        for (var i = 0; i < n; i++) {
            var br = this._branches[i];
            var a = (i / n) * Math.PI * 2 - Math.PI / 2;
            var bx = cx + Math.cos(a) * R_BRANCHE;
            var by = cy + Math.sin(a) * R_BRANCHE;
            var choisie = (i === this._iBranche);
            b.paintOpacity = choisie ? 255 : 110;
            this.trait(cx + Math.cos(a) * (R_ORBE + 6), cy + Math.sin(a) * (R_ORBE + 6), bx, by,
                br.couleur, choisie ? 6 : 9, choisie ? 3 : 2);
            b.drawCircle(Math.round(bx), Math.round(by), choisie ? 13 : 8,
                br.ouverte ? br.couleur : '#556070');
            if (choisie) {
                b.paintOpacity = 255;
                b.drawCircle(Math.round(bx), Math.round(by), 6, '#ffffff');
            }
            b.paintOpacity = choisie ? 255 : 150;
            b.fontSize = choisie ? 20 : 16;
            b.textColor = choisie ? '#ffffff' : '#b9c4d2';
            var lx = Math.round(bx - 70), ly = Math.round(by + (Math.sin(a) >= 0 ? 14 : -38));
            b.drawText(br.nom, lx, ly, 140, 24, 'center');
            b.paintOpacity = 255;
        }

        // ── les nœuds de la branche choisie, en éventail vers l'extérieur
        var br2 = this._branches[this._iBranche];
        if (!br2) { return; }
        var a2 = (this._iBranche / n) * Math.PI * 2 - Math.PI / 2;
        var total = br2.noeuds.length;
        var montres = Math.min(total, 14);
        var debut = Math.max(0, Math.min(this._iNoeud - Math.floor(montres / 2), total - montres));
        for (var k = 0; k < montres; k++) {
            var idx = debut + k;
            var noeud = br2.noeuds[idx];
            var appris = this._acteur.isLearnedSkill(noeud.skill.id);
            var etale = (k - (montres - 1) / 2) * 0.10;
            var rr = R_BRANCHE + 34 + k * 9;
            var nx = cx + Math.cos(a2 + etale) * rr;
            var ny = cy + Math.sin(a2 + etale) * rr;
            var actif = (idx === this._iNoeud);
            b.paintOpacity = actif ? 255 : (appris ? 170 : 80);
            b.drawCircle(Math.round(nx), Math.round(ny), actif ? 8 : 5,
                appris ? br2.couleur : '#46505e');
            if (actif) { b.drawCircle(Math.round(nx), Math.round(ny), 3, '#ffffff'); }
            b.paintOpacity = 255;
        }
    };

    //=========================================================================
    // La liste des nœuds de la branche choisie
    //=========================================================================
    function Window_Noeuds() { this.initialize.apply(this, arguments); }
    Window_Noeuds.prototype = Object.create(Window_Selectable.prototype);
    Window_Noeuds.prototype.constructor = Window_Noeuds;

    Window_Noeuds.prototype.initialize = function (x, y, largeur, hauteur) {
        // Les champs AVANT l'initialisation du parent : Window_Selectable
        // appelle maxItems() pendant qu'il s'initialise (et MOG_Scrollbar et
        // MOG_CursorBorder appellent select() par-dessus). Une liste posée
        // après, c'est la fenêtre qui tombe à l'ouverture.
        this._acteur = null;
        this._branche = null;
        this._donnees = [];
        Window_Selectable.prototype.initialize.call(this, x, y, largeur, hauteur);
    };

    Window_Noeuds.prototype.poser = function (acteur, branche) {
        if (this._acteur === acteur && this._branche === branche) { return; }
        this._acteur = acteur;
        this._branche = branche;
        this.refresh();
        this.resetScroll();
    };

    // Même raison : on répond 0 tant que la liste n'existe pas.
    Window_Noeuds.prototype.maxItems = function () { return this._donnees ? this._donnees.length : 0; };
    Window_Noeuds.prototype.item = function () {
        var d = (this._donnees || [])[this.index()];
        return d ? d.skill : null;
    };
    Window_Noeuds.prototype.noeud = function () { return (this._donnees || [])[this.index()] || null; };

    Window_Noeuds.prototype.isCurrentItemEnabled = function () { return this.estEmployable(this.noeud()); };

    Window_Noeuds.prototype.estEmployable = function (noeud) {
        if (!noeud || !this._acteur) { return false; }
        return this._acteur.isLearnedSkill(noeud.skill.id) && this._acteur.canUse(noeud.skill);
    };

    Window_Noeuds.prototype.makeItemList = function () {
        this._donnees = this._branche ? this._branche.noeuds.slice() : [];
    };

    Window_Noeuds.prototype.refresh = function () {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };

    Window_Noeuds.prototype.drawItem = function (index) {
        var noeud = this._donnees[index];
        if (!noeud) { return; }
        var s = noeud.skill;
        var r = this.itemRect(index);
        var appris = this._acteur.isLearnedSkill(s.id);
        var employable = this.estEmployable(noeud);

        // la tige qui relie les nœuds : on lit la branche de haut en bas
        var couleur = this._branche ? this._branche.couleur : '#ffffff';
        this.contents.paintOpacity = appris ? 200 : 90;
        if (index > 0) { this.contents.fillRect(r.x + 11, r.y, 2, 8, couleur); }
        if (index < this._donnees.length - 1) {
            this.contents.fillRect(r.x + 11, r.y + r.height - 10, 2, 12, couleur);
        }
        this.contents.drawCircle(r.x + 12, r.y + Math.floor(r.height / 2), appris ? 7 : 5,
            appris ? couleur : '#4b5666');
        this.contents.paintOpacity = 255;

        this.changePaintOpacity(employable);
        this.drawItem_icone(s, r.x + 26, r.y);
        this.contents.fontSize = 20;
        this.drawText(s.name, r.x + 62, r.y, r.width - 62 - 96);
        // à droite : le coût, ou le niveau où le nœud s'ouvre
        this.contents.fontSize = 18;
        if (!appris && noeud.niveau > 0) {
            this.changeTextColor(this.textColor(7));
            this.drawText('Nv ' + noeud.niveau, r.x + r.width - 92, r.y, 92, 'right');
        } else {
            this.changeTextColor(this.textColor(0));
            this.drawText(this.coutTexte(s), r.x + r.width - 92, r.y, 92, 'right');
        }
        this.resetTextColor();
        this.contents.fontSize = this.standardFontSize();
        this.changePaintOpacity(true);
    };

    Window_Noeuds.prototype.drawItem_icone = function (s, x, y) {
        if (s.iconIndex > 0) { this.drawIcon(s.iconIndex, x, y + 2); }
    };

    Window_Noeuds.prototype.coutTexte = function (s) {
        var pm = this._acteur ? this._acteur.skillMpCost(s) : s.mpCost;
        var pt = this._acteur ? this._acteur.skillTpCost(s) : s.tpCost;
        var bouts = [];
        if (pm) { bouts.push(pm + ' PM'); }
        if (pt) { bouts.push(pt + ' PT'); }
        return bouts.join(' ') || '—';
    };

    Window_Noeuds.prototype.itemHeight = function () { return this.lineHeight() + 6; };

    Window_Noeuds.prototype.updateHelp = function () {
        if (this._helpWindow) { this._helpWindow.poser(this._acteur, this._branche, this.noeud()); }
    };

    //=========================================================================
    // Le bandeau du bas : ce que fait la compétence
    //=========================================================================
    function Window_Noeud_Info() { this.initialize.apply(this, arguments); }
    Window_Noeud_Info.prototype = Object.create(Window_Base.prototype);
    Window_Noeud_Info.prototype.constructor = Window_Noeud_Info;

    Window_Noeud_Info.prototype.initialize = function (x, y, largeur, hauteur) {
        Window_Base.prototype.initialize.call(this, x, y, largeur, hauteur);
        this._acteur = null; this._branche = null; this._noeud = null;
    };

    Window_Noeud_Info.prototype.poser = function (acteur, branche, noeud) {
        if (this._acteur === acteur && this._branche === branche && this._noeud === noeud) { return; }
        this._acteur = acteur; this._branche = branche; this._noeud = noeud;
        this.refresh();
    };

    /** Coupe un texte aux espaces pour qu'il tienne, et rend au plus n lignes. */
    Window_Noeud_Info.prototype.replier = function (texte, largeur, n) {
        var mots = String(texte).split(' ');
        var lignes = [], courante = '';
        for (var i = 0; i < mots.length; i++) {
            var essai = courante ? courante + ' ' + mots[i] : mots[i];
            if (this.textWidth(essai) > largeur && courante) {
                lignes.push(courante);
                courante = mots[i];
                if (lignes.length === n) { break; }
            } else {
                courante = essai;
            }
        }
        if (lignes.length < n && courante) { lignes.push(courante); }
        // si ça ne tient toujours pas, la dernière ligne finit par un signe clair
        if (lignes.length === n) {
            var reste = mots.slice(lignes.join(' ').split(' ').length).join(' ');
            if (reste) { lignes[n - 1] = lignes[n - 1] + ' …'; }
        }
        return lignes;
    };

    Window_Noeud_Info.prototype.refresh = function () {
        this.contents.clear();
        if (!this._noeud) { return; }
        var s = this._noeud.skill;
        var l = this.lineHeight();
        var appris = this._acteur && this._acteur.isLearnedSkill(s.id);

        this.changeTextColor(this.textColor(this._branche && this._branche.ouverte ? 0 : 7));
        this.contents.fontSize = 24;
        this.drawText(s.name, 0, 0, this.contentsWidth() - 240);
        this.resetTextColor();
        this.contents.fontSize = 18;

        var etat = appris
            ? (this._acteur.canUse(s) ? 'employable maintenant' : 'apprise — pas maintenant')
            : (this._noeud.niveau > 0 ? 'elle vient au niveau ' + this._noeud.niveau : 'pas encore apprise');
        this.changeTextColor(this.textColor(appris ? 24 : 7));
        this.drawText(etat, this.contentsWidth() - 240, 0, 240, 'right');
        this.resetTextColor();

        this.contents.fontSize = this.standardFontSize();
        // drawTextEx ne borne rien : une description longue sortait de la
        // fenêtre et se coupait au milieu d'un mot. On la replie sur deux
        // lignes, aux espaces, sans en perdre un morceau en silence.
        var lignes = this.replier(String(s.description || '').replace(/\n/g, ' '), this.contentsWidth() - 8, 2);
        lignes.forEach(function (texte, i) { this.drawTextEx(texte, 0, l * (i + 1)); }, this);

        // la branche à laquelle il appartient, et son avertissement s'il est fermé
        this.contents.fontSize = 18;
        this.changeTextColor(this.textColor(7));
        var pied = this._branche ? ('branche « ' + this._branche.nom + ' »') : '';
        if (this._branche && !this._branche.ouverte) {
            pied += '  —  aucun trait n\'ouvre ce type : invisible en combat';
        }
        this.drawText(pied, 0, l * 3, this.contentsWidth());
        this.resetTextColor();
        this.contents.fontSize = this.standardFontSize();
    };

    //=========================================================================
    // Le bandeau du haut
    //=========================================================================
    function Window_Orbe_Titre() { this.initialize.apply(this, arguments); }
    Window_Orbe_Titre.prototype = Object.create(Window_Base.prototype);
    Window_Orbe_Titre.prototype.constructor = Window_Orbe_Titre;

    Window_Orbe_Titre.prototype.initialize = function (x, y, largeur, hauteur) {
        Window_Base.prototype.initialize.call(this, x, y, largeur, hauteur);
        this._acteur = null; this._branche = null;
    };

    Window_Orbe_Titre.prototype.poser = function (acteur, branche, iBranche, nBranches) {
        this._acteur = acteur; this._branche = branche;
        this._i = iBranche; this._n = nBranches;
        this.refresh();
    };

    Window_Orbe_Titre.prototype.refresh = function () {
        this.contents.clear();
        if (!this._acteur) { return; }
        this.contents.fontSize = 22;
        this.changeTextColor(this.textColor(14));
        this.drawText(TITRE, 0, 0, 340);
        this.resetTextColor();
        this.contents.fontSize = this.standardFontSize();
        var t = this._acteur.name() + '   ' + this._acteur.currentClass().name + '   Nv' + this._acteur.level;
        this.drawText(t, 340, 0, this.contentsWidth() - 340 - 120, 'left');
        this.contents.fontSize = 18;
        this.changeTextColor(this.textColor(7));
        this.drawText((this._i + 1) + '/' + this._n, this.contentsWidth() - 120, 0, 120, 'right');
        this.resetTextColor();
        this.contents.fontSize = this.standardFontSize();
    };

    //=========================================================================
    // La scène
    //=========================================================================
    function Scene_OrbeCapacites() { this.initialize.apply(this, arguments); }
    Scene_OrbeCapacites.prototype = Object.create(Scene_ItemBase.prototype);
    Scene_OrbeCapacites.prototype.constructor = Scene_OrbeCapacites;

    Scene_OrbeCapacites.prototype.initialize = function () {
        Scene_ItemBase.prototype.initialize.call(this);
        this._iBranche = 0;
    };

    // La carte floutée derrière l'écran écrase les points de lumière de
    // l'orbe. On pose un voile sombre par-dessus : le fond reste reconnaissable,
    // les branches redeviennent lisibles.
    Scene_OrbeCapacites.prototype.createBackground = function () {
        Scene_ItemBase.prototype.createBackground.call(this);
        this._voile = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this._voile.bitmap.fillAll('rgba(6, 10, 18, 1)');
        this._voile.opacity = 205;
        this.addChild(this._voile);
    };

    Scene_OrbeCapacites.prototype.create = function () {
        Scene_ItemBase.prototype.create.call(this);
        this._titreWindow = new Window_Orbe_Titre(0, 0, Graphics.boxWidth, H_TITRE);
        this.addWindow(this._titreWindow);

        var hMilieu = Graphics.boxHeight - H_TITRE - H_INFO;
        this._orbe = new Sprite_Orbe(0, H_TITRE, Graphics.boxWidth - L_LISTE, hMilieu);
        this.addChild(this._orbe);

        this._infoWindow = new Window_Noeud_Info(0, H_TITRE + hMilieu, Graphics.boxWidth, H_INFO);
        this.addWindow(this._infoWindow);

        this._itemWindow = new Window_Noeuds(Graphics.boxWidth - L_LISTE, H_TITRE, L_LISTE, hMilieu);
        this._itemWindow.setHelpWindow(this._infoWindow);
        this._itemWindow.setHandler('ok', this.surOk.bind(this));
        this._itemWindow.setHandler('cancel', this.popScene.bind(this));
        this._itemWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._itemWindow.setHandler('pageup', this.previousActor.bind(this));
        this.addWindow(this._itemWindow);

        this.createActorWindow();
    };

    Scene_OrbeCapacites.prototype.start = function () {
        Scene_ItemBase.prototype.start.call(this);
        this.refreshActor();
        this._itemWindow.activate();
        this._itemWindow.select(0);
    };

    Scene_OrbeCapacites.prototype.refreshActor = function () {
        var acteur = this.actor();
        this._branches = branchesDe(acteur);
        if (this._iBranche >= this._branches.length) { this._iBranche = 0; }
        this.rafraichir();
    };

    Scene_OrbeCapacites.prototype.onActorChange = function () {
        this._iBranche = 0;
        this.refreshActor();
        this._itemWindow.select(0);
        this._itemWindow.activate();
    };

    Scene_OrbeCapacites.prototype.brancheCourante = function () {
        return this._branches ? this._branches[this._iBranche] : null;
    };

    Scene_OrbeCapacites.prototype.rafraichir = function () {
        var br = this.brancheCourante();
        this._itemWindow.poser(this.actor(), br);
        this._titreWindow.poser(this.actor(), br, this._iBranche, Math.max(1, (this._branches || []).length));
        this._infoWindow.poser(this.actor(), br, this._itemWindow.noeud());
        this._orbe.poser(this.actor(), this._branches || [], this._iBranche, this._itemWindow.index());
    };

    Scene_OrbeCapacites.prototype.update = function () {
        Scene_ItemBase.prototype.update.call(this);
        if (this._itemWindow.active) {
            if (Input.isRepeated('right')) { this.changerBranche(1); }
            else if (Input.isRepeated('left')) { this.changerBranche(-1); }
        }
        this.rafraichir();
    };

    Scene_OrbeCapacites.prototype.changerBranche = function (sens) {
        var n = (this._branches || []).length;
        if (n <= 1) { return; }
        this._iBranche = (this._iBranche + sens + n) % n;
        SoundManager.playCursor();
        this._itemWindow.poser(this.actor(), this.brancheCourante());
        this._itemWindow.select(0);
        this.rafraichir();
    };

    // ── employer une compétence, exactement comme l'ancien écran le faisait ──
    Scene_OrbeCapacites.prototype.surOk = function () {
        this.actor().setLastMenuSkill(this.item());
        this.determineItem();
    };
    Scene_OrbeCapacites.prototype.item = function () { return this._itemWindow.item(); };
    Scene_OrbeCapacites.prototype.user = function () { return this.actor(); };
    Scene_OrbeCapacites.prototype.isCursorLeft = function () { return false; };
    Scene_OrbeCapacites.prototype.playSeForItem = function () { SoundManager.playUseSkill(); };
    Scene_OrbeCapacites.prototype.useItem = function () {
        Scene_ItemBase.prototype.useItem.call(this);
        this._itemWindow.refresh();
        this.rafraichir();
    };
    Scene_OrbeCapacites.prototype.onActorOk = function () {
        Scene_ItemBase.prototype.onActorOk ? Scene_ItemBase.prototype.onActorOk.call(this) : null;
    };
    Scene_OrbeCapacites.prototype.onItemOk = function () { };
    Scene_OrbeCapacites.prototype.activateItemWindow = function () {
        this._itemWindow.refresh();
        this._itemWindow.activate();
    };

    //=========================================================================
    // On prend la place de l'ancien écran
    //=========================================================================
    // Tout ce qui pousse Scene_Skill — le menu de Yanfly, un appel de script,
    // une commande d'événement — arrive désormais ici. L'ancienne classe reste
    // en mémoire sous son nom d'origine : rien n'est supprimé.
    window.Scene_OrbeCapacites = Scene_OrbeCapacites;
    window.Scene_Skill_Yanfly = window.Scene_Skill;
    window.Scene_Skill = Scene_OrbeCapacites;
})();
