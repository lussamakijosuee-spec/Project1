//=============================================================================
// LaBoiteAMusique.js — v1.0  ·  Toutes les musiques du jeu dans la Music Box
// RPG Maker MV   ·   pour JOKO
//   À charger APRÈS MOG_Music_Book et LeRythme.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La Music Box de MOG connaît toutes les musiques du jeu
 * (plus seulement dix), se débloque à l'écoute, et lance le jeu de rythme.
 * @author pour JOKO
 *
 * @param toutOuvert
 * @text Tout est débloqué ?
 * @type boolean
 * @default false
 * @desc Non : une musique apparaît quand on l'a entendue en jeu. Oui : toutes
 * sont écoutables dès le début (pour essayer).
 *
 * @param rythme
 * @text Maj lance le jeu de rythme ?
 * @type boolean
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA BOÎTE À MUSIQUE
 * ═══════════════════════════════════════════════════════════════════════════
 *  MOG_Music_Book ne connaissait que les dix musiques écrites dans son
 *  fichier. Ici, la liste est celle du dossier audio/bgm : toutes les
 *  musiques du jeu, rangées par nom. Chacune reste « ???? » tant qu'on ne l'a
 *  pas entendue quelque part dans le jeu (carte, combat, événement…).
 *
 *  Une sauvegarde d'avant garde ce qu'elle avait déjà entendu.
 *
 *  Dans la boîte :
 *    Entrée       écouter
 *    Maj          jouer cette musique au jeu de rythme
 *    ← →          dix musiques plus loin, plus haut
 *    Tab          seulement les musiques entendues / toutes
 *  Sous chaque titre : la partition (★ de JOKO ou auto) et le record.
 *
 *  Une pochette : img/musicbook/<nom de la musique>.png, comme avant. Sans
 *  pochette, un disque est dessiné à son nom.
 *
 *  Le titre affiché vient du nom du fichier (« Battle-Conflict_loop » →
 *  « Battle Conflict loop ») ; les titres que MOG avait écrits restent.
 *
 *  Commande de module : boite_a_musique   (comme music_book)
 *  En script : $gameSystem.boiteEntendre('Battle1') la débloque.
 */

(function () {
    'use strict';
    if (!window.Rythme || typeof Scene_Music_Book === 'undefined') return;

    var P = PluginManager.parameters('LaBoiteAMusique');
    var toutOuvert = P.toutOuvert === 'true', avecRythme = P.rythme !== 'false';

    //=========================================================================
    // La liste : toutes les musiques, les titres de MOG gardés
    //=========================================================================
    var anciens = {};
    (Moghunter.musicbook_titles || []).forEach(function (t) { anciens[t[0]] = t; });
    var liste = Rythme.musiques();
    if (liste.length) {
        Moghunter.musicbook_titles = liste.map(function (m) { return anciens[m.nom] || [m.nom, Rythme.titre(m.nom), '']; });
    }

    // La liste d'une sauvegarde est remise à jour, sans rien perdre de ce qui était entendu
    Game_System.prototype.boiteAJour = function () {
        var titres = Moghunter.musicbook_titles, l = this._music_list;
        var aJour = l && l.length === titres.length && l.every(function (e, i) { return e[1] === titres[i][0]; });
        if (!aJour) {
            var entendues = {};
            (l || []).forEach(function (e) { if (e[0]) entendues[e[1]] = true; });
            this.make_music_list();
            this._music_list.forEach(function (e) { if (entendues[e[1]]) e[0] = true; });
        }
        if (toutOuvert) this._music_list.forEach(function (e) { e[0] = true; });
    };
    Game_System.prototype.boiteEntendre = function (nom) {
        if (!this._music_list) return;
        this._music_list.forEach(function (e) { if (e[1] === nom) e[0] = true; });
    };

    var _creerCarte = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function () {
        _creerCarte.call(this);
        $gameSystem.boiteAJour();
    };

    // Jouer une musique au jeu de rythme, c'est l'avoir entendue
    var _jouer = Rythme.jouer;
    Rythme.jouer = function (musique) {
        if ($gameSystem) $gameSystem.boiteEntendre(musique);
        return _jouer.apply(this, arguments);
    };

    //=========================================================================
    // La scène de MOG
    //=========================================================================
    var _init = Scene_Music_Book.prototype.initialize;
    Scene_Music_Book.prototype.initialize = function () {
        $gameSystem.boiteAJour();
        _init.call(this);
        // au retour du jeu de rythme : la musique de la carte reste celle d'avant la boîte
        if (Rythme._bgmCarte) {
            BattleManager._mapBgm = Rythme._bgmCarte.bgm; BattleManager._mapBgs = Rythme._bgmCarte.bgs;
            Rythme._bgmCarte = null;
            if (Rythme._boiteFiltre) this.filtrer(true);
            this._w_music_list.select(Math.min(Rythme._boiteIndex || 0, this._w_music_list.maxItems() - 1));
        }
        this._helpWindow.setText_rv(this.aide());
    };

    Scene_Music_Book.prototype.aide = function () {
        return 'Entrée : écouter' + (avecRythme ? '  ·  Maj : jeu de rythme' : '') + '  ·  ← → : par dix  ·  Tab : ' + (this._filtre ? 'toutes' : 'seulement les entendues');
    };

    // La musique choisie se lit dans la fenêtre (la liste peut être filtrée)
    Scene_Music_Book.prototype.music = function () {
        var w = this._w_music_list;
        if (!w || !w._data) return null;
        return w._data[w._index] || null;
    };

    Scene_Music_Book.prototype.filtrer = function (oui) {
        var w = this._w_music_list;
        this._filtre = oui;
        w._data = oui ? $gameSystem._music_list.filter(function (e) { return e[0]; }) : $gameSystem._music_list;
        if (!w._data.length) w._data = $gameSystem._music_list;
        w.refresh(); w.select(0); w._ismoved = true;
        this._playing_index = -1;
        this._helpWindow.setText_rv(this.aide());
    };

    // Ce qu'on dit sous une musique
    Scene_Music_Book.prototype.infos = function (e) {
        var nom = e[1], morceaux = [e[2] || Rythme.titre(nom)];
        if (e[3]) morceaux.push(e[3]);
        if (!Rythme.lisible(nom)) { morceaux.push('format ' + ((Rythme.musique(nom) || {}).formats || []).join('/') + ' non lu ici'); return morceaux.join(' - '); }
        morceaux.push(Rythme.aSaPartition(nom) ? '★ partition de JOKO' : 'partition auto');
        var r = Rythme.meilleurRecord(nom);
        if (r) morceaux.push('record ' + r.rang + ' ' + r.score + ' (' + Rythme.NOMS_DIFF[r.diff] + ')');
        return morceaux.join(' - ');
    };

    var _refreshMusic = Scene_Music_Book.prototype.refresh_music;
    Scene_Music_Book.prototype.refresh_music = function () {
        var e = this.music();
        if (e && e[0] && !Rythme.lisible(e[1])) {
            // un .m4a que ce moteur ne sait pas lire : on ne le lance pas (MV planterait)
            this._number_refresh = 0;
            this.nodata_effect();
            this._helpWindow.setText_rv(this.infos(e));
            return;
        }
        var avant = this._playing_index;
        _refreshMusic.call(this);
        if (e && e[0] && avant !== this._w_music_list._index) this._helpWindow.setText_rv(this.infos(e));
    };

    // Une pochette dessinée quand il n'y en a pas
    var _pochettes = {};
    function disque(nom, titre) {
        if (_pochettes[nom]) return _pochettes[nom];
        var t = 300, b = new Bitmap(t, t), ctx = b._context, c = t / 2, h = 0;
        for (var i = 0; i < nom.length; i++) h = (h * 31 + nom.charCodeAt(i)) % 360;
        ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(c, c, c - 4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
        for (var r = 40; r < c - 8; r += 6) { ctx.beginPath(); ctx.arc(c, c, r, 0, Math.PI * 2); ctx.stroke(); }
        var g = ctx.createLinearGradient(0, 0, t, t);
        g.addColorStop(0, 'hsl(' + h + ',75%,55%)'); g.addColorStop(1, 'hsl(' + ((h + 60) % 360) + ',75%,35%)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c, c, 62, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(c, c, 7, 0, Math.PI * 2); ctx.fill();
        b._setDirty();
        b.fontSize = 15; b.textColor = '#ffffff'; b.outlineColor = 'rgba(0,0,0,0.7)'; b.outlineWidth = 3;
        var mots = String(titre).split(' '), lignes = [''], j = 0;
        mots.forEach(function (m) { if ((lignes[j] + ' ' + m).length > 14 && lignes[j]) { lignes[++j] = m; } else lignes[j] = (lignes[j] ? lignes[j] + ' ' : '') + m; });
        lignes = lignes.slice(0, 3);
        lignes.forEach(function (l, k) { b.drawText(l, c - 60, c - 30 + k * 18 - (lignes.length - 1) * 9 + 12, 120, 18, 'center'); });
        _pochettes[nom] = b;
        return b;
    }
    var _refreshCover = Scene_Music_Book.prototype.refresh_cover;
    Scene_Music_Book.prototype.refresh_cover = function () {
        var e = this.music();
        if (!e || Rythme.aUnePochette(e[1])) { _refreshCover.call(this); return; }
        this._cover_fade = false;
        this._cover.bitmap = disque(e[1], e[2] || Rythme.titre(e[1]));
        this._cover.opacity = 0;
        this._cover.scale.x = this._cover.scale.y = 1.5;
        this._cover.x = Graphics.width / 2;
        this._cover.y = Graphics.height / 2 - 40;
    };
    // le disque tourne pendant qu'il joue
    var _update = Scene_Music_Book.prototype.update;
    Scene_Music_Book.prototype.update = function () {
        _update.call(this);
        var e = this.music();
        if (this._cover && this._cover.bitmap && e && _pochettes[e[1]] === this._cover.bitmap && !this._cover_fade) {
            this._cover.anchor.x = this._cover.anchor.y = 0.5;
            this._cover.rotation += 0.01;
        } else if (this._cover) this._cover.rotation = 0;
        if (Input.isTriggered('tab')) { SoundManager.playCursor(); this.filtrer(!this._filtre); return; }
        if (avecRythme && Input.isTriggered('shift') && e) {
            if (!e[0] || !Rythme.lisible(e[1])) { SoundManager.playBuzzer(); return; }
            SoundManager.playOk();
            Rythme._bgmCarte = { bgm: BattleManager._mapBgm, bgs: BattleManager._mapBgs };
            Rythme._boiteIndex = this._w_music_list.index(); Rythme._boiteFiltre = !!this._filtre;
            Rythme._depuisBoite = true;
            AudioManager.stopBgm();
            Rythme.jouer(e[1]);
        }
    };

    // Depuis la boîte, la musique de la carte est déjà de côté
    var _entrer = Rythme.entrer, _sortir = Rythme.sortir;
    Rythme.entrer = function () {
        if (this._depuisBoite) { this._depuisBoite = false; this._mise = 'boite'; AudioManager.stopBgm(); AudioManager.stopBgs(); return; }
        _entrer.call(this);
    };
    Rythme.sortir = function () {
        if (this._mise === 'boite') { this._mise = false; return; }
        _sortir.call(this);
    };

    //=========================================================================
    // La liste à l'écran
    //=========================================================================
    Window_MusicList.prototype.drawItem = function (i) {
        var e = this._data[i];
        if (!e) return;
        var ouvert = e[0], rect = this.itemRect(i), titre = '????';
        this.changePaintOpacity(ouvert);
        if (ouvert) {
            titre = e[2] || Rythme.titre(e[1]);
            if (!Rythme.lisible(e[1])) titre = '🔇 ' + titre;
            else {
                if (Rythme.aSaPartition(e[1])) titre = '★ ' + titre;
                var r = Rythme.meilleurRecord(e[1]);
                if (r) titre += '   [' + r.rang + ']';
            }
        }
        this.drawText(titre, rect.x, rect.y, this.width - 60, 'center');
        this.changePaintOpacity(true);
    };
    Window_MusicList.prototype.cursorRight = function () {
        this.select(Math.min(this.maxItems() - 1, this.index() + 10)); this._ismoved = true;
    };
    Window_MusicList.prototype.cursorLeft = function () {
        this.select(Math.max(0, this.index() - 10)); this._ismoved = true;
    };

    var _commande = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _commande.call(this, command, args);
        if ((command || '').toLowerCase() === 'boite_a_musique') $gameSystem.music_book();
    };
})();
