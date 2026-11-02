//=============================================================================
// TheatrhythmPlus.js — v1.0  ·  Le Theatrhythm de MOG, en plus intéressant
// RPG Maker MV   ·   pour JOKO
//   À charger APRÈS MOG_Theatrhythm. Le fichier de MOG n'est pas touché.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le Theatrhythm de MOG tel quel, avec en plus : des notes
 * spéciales, l'attaque du héros après une série, l'ennemi qui s'énerve, et un
 * éditeur à grille pour écrire tes propres notes sur une musique.
 * @author pour JOKO
 *
 * @param critiques
 * @text Notes critiques (%)
 * @type number
 * @min 0
 * @max 100
 * @default 10
 * @desc Sans partition écrite : la chance qu'une note soit dorée (toujours un
 * coup critique). 0 = jamais.
 *
 * @param soins
 * @text Notes de soin (%)
 * @type number
 * @min 0
 * @max 100
 * @default 6
 * @desc Sans partition écrite : la chance qu'une note soit verte (touchée, elle
 * soigne le groupe).
 *
 * @param pieges
 * @text Notes pièges (%)
 * @type number
 * @min 0
 * @max 100
 * @default 6
 * @desc Sans partition écrite : la chance qu'une note soit rouge. Il ne faut PAS
 * la taper (la taper = un raté et l'ennemi frappe) ; la laisser passer ne coûte rien.
 *
 * @param soin
 * @text Soin d'une note verte (% des PV)
 * @type number
 * @min 0
 * @default 15
 *
 * @param animSoin
 * @text Animation du soin
 * @type animation
 * @default 246
 *
 * @param serie
 * @text Série pour l'attaque du héros
 * @type number
 * @min 0
 * @default 10
 * @desc Toutes les N notes réussies d'affilée, le héros de la rangée lance une
 * de ses compétences. 0 = jamais.
 *
 * @param forceSerie
 * @text Force de l'attaque du héros
 * @type number
 * @decimals 1
 * @min 0
 * @default 3.0
 * @desc Multiplie les dégâts d'une note normale.
 *
 * @param enerve
 * @text L'ennemi s'énerve ?
 * @type boolean
 * @default true
 * @desc Sous la moitié de ses PV, les notes vont plus vite ; sous le quart,
 * encore plus, et il frappe plus fort.
 *
 * @param vitesseEnerve
 * @text Vitesse quand il s'énerve
 * @type string
 * @default 1.25, 1.5
 * @desc Sous 50 %, puis sous 25 % de ses PV.
 *
 * @param forceEnerve
 * @text Sa force sous 25 %
 * @type number
 * @decimals 2
 * @default 1.20
 *
 * @param ennemiEssai
 * @text Ennemi pour essayer (éditeur)
 * @type enemy
 * @default 99
 *
 * @param vitesseEssai
 * @text Vitesse pour essayer (éditeur)
 * @type number
 * @min 1
 * @default 5
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE THEATRHYTHM, EN PLUS INTÉRESSANT
 * ═══════════════════════════════════════════════════════════════════════════
 *  Le mini-jeu de MOG ne change pas : mêmes images, mêmes touches, même
 *  commande (theatrhythm : Ennemi : Vitesse). Ce plugin ajoute :
 *
 *  LES NOTES SPÉCIALES (réglages en %)
 *    dorée  — toujours un coup critique
 *    verte  — touchée, elle soigne le groupe
 *    rouge  — un piège : ne pas la taper (la laisser passer ne coûte rien)
 *
 *  L'ATTAQUE DU HÉROS
 *    Toutes les 10 notes réussies d'affilée (réglage), le héros de la rangée
 *    lance une de ses compétences sur l'ennemi : son animation, son nom, et
 *    ×3 les dégâts. Pour choisir les compétences d'un héros, dans la Note de
 *    l'ACTEUR :   <Theatrhythm: 12, 15>
 *    Sans balise : une de ses compétences qui frappe un ennemi, au hasard.
 *
 *  L'ENNEMI QUI S'ÉNERVE
 *    Sous 50 % de ses PV, les notes accélèrent ; sous 25 %, encore, et il
 *    frappe plus fort.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  TES NOTES À TOI : l'éditeur à grille
 *  ─────────────────────────────────────────────────────────────────────────
 *    theatrhythm_editeur Battle1
 *  ouvre l'éditeur sur la musique Battle1. Tu poses les notes sur une grille
 *  calée sur le tempo (le « snap ») : quelle touche, quel héros, quel type.
 *  Enregistré dans theatrhythm/<musique>.json. Ensuite, chaque fois que le
 *  Theatrhythm se joue sur cette musique, ce sont TES notes qui arrivent, au
 *  temps de la musique. Sans fichier, le jeu reste celui de MOG (au hasard).
 *
 *  Pour jouer une musique précise au prochain Theatrhythm :
 *    theatrhythm_musique Battle1
 *    theatrhythm : 99 : 5
 *  (sinon, c'est la musique de combat du jeu)
 *
 *  Dans l'éditeur :
 *    Espace        lecture / pause
 *    ↑ ↓ molette   avancer / reculer d'un pas de grille (à l'arrêt)
 *    Pg↑ Pg↓       une mesure        Début / Fin
 *    A S Z X ← →   poser / enlever la note de cette touche au curseur
 *    5 et 8        poser ↑ et ↓ à l'arrêt (↑ ↓ servent à avancer)
 *    En lecture    les 8 touches de MOG enregistrent tes notes, calées
 *    Clic          poser / enlever · clic droit : enlever
 *    G             la grille : 1, 1/2, 1/3, 1/4 de temps
 *    R             le héros des nouvelles notes (au hasard, 1, 2, 3, 4)
 *    T             le type (normale, dorée, verte, rouge)
 *    Suppr         effacer la ligne du curseur
 *    B / Maj+B     tempo +0,1 / −0,1 (Ctrl : ±1)   O / Maj+O : décalage ±5 ms
 *    + −           zoom          H : le clic des notes
 *    Ctrl+Z Ctrl+Y annuler / rétablir     Ctrl+S : enregistrer
 *    Entrée        essayer (l'ennemi et la vitesse des réglages)
 *    Échap         quitter
 */

(function () {
    'use strict';
    if (typeof Scene_Theatrhythm === 'undefined' || typeof Sprite_TKeys === 'undefined') return;

    var P = PluginManager.parameters('TheatrhythmPlus');
    function num(k, d) { var v = P[k]; return v === undefined || v === '' ? d : Number(v); }
    var R = {
        critiques: num('critiques', 10) / 100, soins: num('soins', 6) / 100, pieges: num('pieges', 6) / 100,
        soin: num('soin', 15) / 100, animSoin: num('animSoin', 246),
        serie: num('serie', 10), forceSerie: num('forceSerie', 3),
        enerve: P.enerve !== 'false', vitesses: String(P.vitesseEnerve || '1.25, 1.5').split(',').map(Number),
        forceEnerve: num('forceEnerve', 1.2), ennemiEssai: num('ennemiEssai', 99), vitesseEssai: num('vitesseEssai', 5)
    };
    var TP = window.TheatrhythmPlus = { reglages: R, _partitions: {}, _sons: {} };

    // les types : 0 normale, 1 dorée (critique), 2 verte (soin), 3 rouge (piège)
    var TEINTES = [null, [255, 210, 60, 140], [60, 255, 120, 130], [255, 30, 30, 150]];
    TP.NOMS_TYPES = ['normale', 'dorée (critique)', 'verte (soin)', 'rouge (piège)'];
    TP.NOMS_TOUCHES = ['A', 'S', 'Z', 'X', '↑', '→', '←', '↓'];

    //=========================================================================
    // Les fichiers : theatrhythm/<musique>.json
    //=========================================================================
    var fs = null, chemin = null, racine = '';
    if (Utils.isNwjs()) { try { fs = require('fs'); chemin = require('path'); racine = chemin.dirname(process.mainModule.filename); } catch (e) { fs = null; } }
    function nomFichier(nom) { return String(nom).replace(/[\\/:*?"<>|]/g, '_'); }
    TP.lire = function (nom) {
        if (this._partitions[nom] !== undefined) return this._partitions[nom];
        var p = null;
        if (fs) {
            var f = chemin.join(racine, 'theatrhythm', nomFichier(nom) + '.json');
            try { if (fs.existsSync(f)) p = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { p = null; }
        } else {
            try {
                var x = new XMLHttpRequest();
                x.open('GET', 'theatrhythm/' + encodeURIComponent(nomFichier(nom)) + '.json', false);
                x.send(null);
                if (x.status === 200) p = JSON.parse(x.responseText);
            } catch (e) { p = null; }
        }
        if (p && (!p.notes || !p.notes.length)) p = null;
        this._partitions[nom] = p;
        return p;
    };
    TP.ecrire = function (nom, p) {
        var texte = JSON.stringify(p, null, 1);
        this._partitions[nom] = JSON.parse(texte);
        if (fs) {
            var d = chemin.join(racine, 'theatrhythm');
            if (!fs.existsSync(d)) fs.mkdirSync(d);
            fs.writeFileSync(chemin.join(d, nomFichier(nom) + '.json'), texte, 'utf8');
            return 'theatrhythm/' + nomFichier(nom) + '.json';
        }
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([texte], { type: 'application/json' }));
        a.download = nomFichier(nom) + '.json';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        return '';
    };

    //=========================================================================
    // La musique du mini-jeu
    //=========================================================================
    TP.musique = function () {
        if ($gameSystem._theatrhythmMusique) return { name: $gameSystem._theatrhythmMusique, volume: 90, pitch: 100, pan: 0 };
        return $gameSystem.battleBgm();
    };
    // « theatrhythm_musique Battle1 » : la prochaine partie se joue sur cette musique
    var _playBattleBgm = BattleManager.playBattleBgm;
    BattleManager.playBattleBgm = function () {
        if ($gameSystem._theatrhythm && $gameSystem._theatrhythmMusique) {
            AudioManager.playBgm(TP.musique());
            AudioManager.stopBgs();
            return;
        }
        _playBattleBgm.call(this);
    };
    var _terminer = Scene_Theatrhythm.prototype.terminate;
    Scene_Theatrhythm.prototype.terminate = function () {
        _terminer.call(this);
        if (!TP._essai) $gameSystem._theatrhythmMusique = null;
    };

    //=========================================================================
    // Les notes : spéciales au hasard, ou écrites par JOKO
    //=========================================================================
    var _creer = Sprite_TKeys.prototype.create_keys;
    Sprite_TKeys.prototype.create_keys = function () {
        _creer.call(this);
        this._keys_type = [];
        this._keys_t = [];
        var m = TP.musique();
        this._partition = m && m.name ? (TP._essai && TP._essai.musique === m.name ? TP._essai.p : TP.lire(m.name)) : null;
        if (this._partition) {
            // MOG n'a que 6 notes à l'écran : une partition écrite peut en vouloir plus
            for (var k = this._keys.length; k < 16; k++) {
                this._keys_c[k] = 0; this._keys_f[k] = false; this._keys_h[k] = 0; this._keys_r[k] = false; this._keys_s[k] = false;
                this._keys[k] = new Sprite(this._image);
                this._keys[k].x = this._limit[4]; this._keys[k].anchor.x = 0.5; this._keys[k].anchor.y = 0.5; this._keys[k].opacity = 0;
                this.addChild(this._keys[k]);
            }
            this._musique = m.name;
            this._prochaine = 0;
            this._tour = 0;
            this._notesP = this._partition.notes.slice().sort(function (a, b) { return a[0] - b[0]; });
        }
        for (var i = 0; i < this._keys.length; i++) {
            this._keys_type[i] = 0; this._keys_t[i] = null;
            if (this._partition) { this._keys_i[i] = 0; this._keys[i].opacity = 0; }
        }
    };

    function teinter(sprite, type) {
        sprite.setBlendColor(TEINTES[type] || [0, 0, 0, 0]);
    }

    var _refresh = Sprite_TKeys.prototype.refresh_keys;
    Sprite_TKeys.prototype.refresh_keys = function (i) {
        if (this._partition) { this.refresh_ecrite(i); return; }
        _refresh.call(this, i);
        // au hasard, comme MOG ; et parfois une note spéciale
        var r = Math.random(), type = 0;
        if (r < R.critiques) type = 1;
        else if (r < R.critiques + R.soins) type = 2;
        else if (r < R.critiques + R.soins + R.pieges) type = 3;
        this._keys_type[i] = type;
        teinter(this._keys[i], type);
    };

    // ── avec une partition : chaque note arrive à son temps
    Sprite_TKeys.prototype.x_critique = function () { return (this._limit[2] + this._limit[3]) / 2; };
    Sprite_TKeys.prototype.px_par_ms = function () { return this._keys_speed * 60 / 1000; };

    // Le temps de la musique, en ms depuis son début (les tours de boucle s'ajoutent)
    Sprite_TKeys.prototype.temps_musique = function () {
        var b = AudioManager._bgmBuffer, cur = AudioManager._currentBgm;
        if (!b || !b.isReady || !b.isReady() || !b.isPlaying() || !WebAudio._context) return null;
        if (!cur || cur.name !== this._musique) return null;
        var c = WebAudio._context, lat = (c.outputLatency || 0) + (c.baseLatency || 0);
        if (this._tampon !== b) {
            this._tampon = b; this._prochaine = 0; this._tour = 0;
            this._boucle = { debut: (b._loopStart || 0) * 1000, longueur: (b._loopLength || b._totalTime || 0) * 1000 };
        }
        return ((c.currentTime - b._startTime) * b._pitch - lat) * 1000;
    };
    // La prochaine note de la partition, au temps absolu (la musique boucle : la partition aussi)
    Sprite_TKeys.prototype.note_suivante = function () {
        var n = this._notesP, b = this._boucle;
        if (!n.length || !b) return null;
        for (var essai = 0; essai < 2; essai++) {
            // au tour suivant, seulement ce qui est dans la boucle de la musique
            if (this._tour > 0) while (this._prochaine < n.length && n[this._prochaine][0] < b.debut) this._prochaine++;
            var note = n[this._prochaine];
            if (note && note[0] < b.debut + b.longueur) {
                return { t: note[0] + this._tour * b.longueur, touche: note[1], rang: note[2], type: note[3] || 0 };
            }
            if (b.longueur < 1000) return null;
            this._tour++; this._prochaine = 0;
        }
        return null;
    };

    Sprite_TKeys.prototype.refresh_ecrite = function (i) {
        var k = this._keys[i];
        k.opacity = 0; k.scale.x = k.scale.y = 1;
        this._keys_t[i] = null;
        this._keys_f[i] = false; this._keys_s[i] = false; this._keys_r[i] = false;
        k.x = -this._cw * 3;   // garée hors de l'écran, à gauche, tant qu'il n'y a rien
        var t = this.temps_musique();
        if (t === null || $gameSystem._theatrhythm_phase !== 1) return;
        var horizon = t + (this.x_critique() + this._cw) / this.px_par_ms();
        var n = this.note_suivante();
        // une note déjà passée (le jeu a démarré après elle) est sautée
        while (n && n.t < t - 150) { this._prochaine++; n = this.note_suivante(); }
        if (!n || n.t > horizon) return;
        this._prochaine++;
        var rangs = this._batlers.length, rang = n.rang >= 0 && n.rang < rangs ? n.rang : Math.randomInt(rangs);
        this._keys_c[i] = n.touche;
        this._keys_h[i] = rang;
        this._keys_t[i] = n.t;
        this._keys_type[i] = n.type;
        this._keys_r[i] = true;
        k.setFrame(this._cw * n.touche, 0, this._cw, this._ch);
        k.y = this._positions[rang][1];
        teinter(k, n.type);
        this.placer_ecrite(i, t);
    };
    Sprite_TKeys.prototype.placer_ecrite = function (i, t) {
        this._keys[i].x = this.x_critique() - (this._keys_t[i] - t) * this.px_par_ms();
    };

    var _position = Sprite_TKeys.prototype.update_position;
    Sprite_TKeys.prototype.update_position = function (i) {
        if (!this._partition) { _position.call(this, i); return; }
        if (this._keys_t[i] === null) { this.refresh_ecrite(i); return; }
        var t = this.temps_musique();
        if (t === null) return;
        // comme MOG, mais la place vient du temps de la musique, pas d'un pas par image
        this.placer_ecrite(i, t);
        var k = this._keys[i];
        if (k.x > this._limit[1] && k.opacity > 0) {
            k.opacity -= 7;
            if (!this._keys_s[i] && this._keys_r[i]) this.slow_pressed(i);
        } else k.opacity += 25;
    };
    var _aRefaire = Sprite_TKeys.prototype.need_reset_key;
    Sprite_TKeys.prototype.need_reset_key = function (i) {
        if (this._partition && this._keys_t[i] === null) return false;   // libre : update_position la remplit
        return _aRefaire.call(this, i);
    };

    // ── ce que fait chaque type
    var _ok = Sprite_TKeys.prototype.execute_ok;
    Sprite_TKeys.prototype.execute_ok = function (i, key) {
        var type = this._keys_type[i];
        if (type === 3) {   // le piège tapé : un raté, et l'ennemi frappe
            if (!this._batlers[this._keys_h[i]]) return;
            $gameSystem._theatrhythm_key_data[0] = this._keys_h[i];
            $gameSystem._theatrhythm_key_data[1] = 0;
            this._keys_f[i] = true;
            this._keys_s[i] = true;
            return;
        }
        _ok.call(this, i, key);
        if (type === 1 && $gameSystem._theatrhythm_key_data[0] !== null) $gameSystem._theatrhythm_key_data[1] = 2;
        if (type === 2 && SceneManager._scene.soin_theatrhythm) SceneManager._scene.soin_theatrhythm(this._keys_h[i]);
    };
    // MOG cherche la note la plus proche pour montrer le raté : sans aucune note à gauche de la cible, il plantait
    var _rate = Sprite_TKeys.prototype.execute_miss;
    Sprite_TKeys.prototype.execute_miss = function (key, i) {
        if ($gameSystem._theatrhythm_key_data[0] != null) return;
        var lim = this._limit[1];
        if (!this._keys.some(function (k) { return k.x <= lim; })) { $gameSystem._theatrhythm_key_data[0] = 0; $gameSystem._theatrhythm_key_data[1] = 0; return; }
        _rate.call(this, key, i);
    };
    var _lent = Sprite_TKeys.prototype.slow_pressed;
    Sprite_TKeys.prototype.slow_pressed = function (i) {
        if (this._keys_type[i] === 3) { this._keys_s[i] = true; return; }   // un piège laissé passer : bien joué
        _lent.call(this, i);
    };

    //=========================================================================
    // La scène : le soin, l'attaque du héros, l'ennemi qui s'énerve
    //=========================================================================
    var _creerObjets = Scene_Theatrhythm.prototype.createDisplayObjects;
    Scene_Theatrhythm.prototype.createDisplayObjects = function () {
        _creerObjets.call(this);
        this._annonce = new Sprite(new Bitmap(Graphics.boxWidth, 60));
        this._annonce.y = Graphics.boxHeight / 2 - 120; this._annonce.opacity = 0;
        this._spriteHudBase.addChild(this._annonce);
        this._enerve = 0;
    };
    Scene_Theatrhythm.prototype.annoncer = function (texte, couleur) {
        var b = this._annonce.bitmap; b.clear();
        b.fontSize = 30; b.textColor = couleur || '#ffffff'; b.outlineColor = 'rgba(0,0,0,0.9)'; b.outlineWidth = 6;
        b.drawText(texte, 0, 8, b.width, 44, 'center');
        this._annonce.opacity = 255; this._annonceTemps = 70;
    };

    // Une partition qui le demande (« pvSelonChanson ») : l'ennemi tombe vers la fin de la chanson
    // si l'on réussit à peu près 80 % des notes — comme une chanson de FNF, pas trois coups et c'est fini
    var _parametres = Scene_Theatrhythm.prototype.set_battler_parameters;
    Scene_Theatrhythm.prototype.set_battler_parameters = function () {
        _parametres.call(this);
        var m = TP.musique(), p = m && m.name ? (TP._essai && TP._essai.musique === m.name ? TP._essai.p : TP.lire(m.name)) : null;
        if (!p || !p.pvSelonChanson) return;
        var coup = Math.max(this._party_atk - this._enemy_def, 1);
        var touchees = p.notes.filter(function (n) { return n[3] !== 3; }).length * (Number(p.pvSelonChanson) > 0 && p.pvSelonChanson !== true ? Number(p.pvSelonChanson) : 0.8);
        var serie = R.serie > 0 ? 1 + R.forceSerie / R.serie : 1;   // l'attaque du héros compte aussi
        var pv = Math.max(1, Math.floor(coup * touchees * serie));
        this._enemy_hp = [pv, pv];
        this._enemy_bp = Math.floor(((pv / 30) + this._enemy_atk + this._enemy_def) / 3) * Moghunter.theatrhythm_bp_base_value;
    };

    Scene_Theatrhythm.prototype.soin_theatrhythm = function (rang) {
        this._party_hp[0] = Math.min(this._party_hp[1], this._party_hp[0] + this._party_hp[1] * R.soin);
        var a = this._battlers[rang];
        if (a && R.animSoin > 0) a.startAnimation(R.animSoin, false, 0);
    };

    var _toucheEnnemi = Scene_Theatrhythm.prototype.execute_hit_enemy;
    Scene_Theatrhythm.prototype.execute_hit_enemy = function (pos, str) {
        _toucheEnnemi.call(this, pos, str);
        var chaine = $gameSystem._theatrhythm_chain_data[0];
        if (R.serie > 0 && chaine > 0 && chaine % R.serie === 0 && $gameSystem._theatrhythm_phase === 1) this.attaque_heros(pos);
    };
    TP.competences = function (acteur) {
        var m = /<Theatrhythm:\s*([\d,\s]+)>/i.exec(acteur.actor().note || '');
        if (m) return m[1].split(',').map(function (s) { return $dataSkills[Number(s)]; }).filter(Boolean);
        return acteur.skills().filter(function (s) { return s.damage && s.damage.type === 1 && s.scope >= 1 && s.scope <= 6; });
    };
    Scene_Theatrhythm.prototype.attaque_heros = function (pos) {
        var a = this._battlers[pos];
        if (!a) return;
        var liste = TP.competences(a), s = liste.length ? liste[Math.randomInt(liste.length)] : null;
        var anim = s && s.animationId > 0 ? s.animationId : a.attackAnimationId1();
        this._enemySprite._enemy.startAnimation(anim, false, 0);
        this._enemySprite._enemy.motion_shake();
        a.performAttack();
        var dmg = Math.floor(Math.max(this._party_atk - this._enemy_def, 1) * R.forceSerie);
        this._enemy_hp[0] -= dmg;
        this.refresh_damage(0, dmg);
        this.annoncer(a.name() + (s ? ' : ' + s.name : '') + ' !', '#ffd447');
        if (this._enemy_hp[0] <= 0) { this._enemy_hp[0] = 0; this._enemySprite._enemy.performCollapse(); this.battle_end(10); }
    };

    var _maj = Scene_Theatrhythm.prototype.update;
    Scene_Theatrhythm.prototype.update = function () {
        _maj.call(this);
        if (this._annonce) {
            if (this._annonceTemps > 0) this._annonceTemps--; else if (this._annonce.opacity > 0) this._annonce.opacity -= 8;
        }
        if (!R.enerve || $gameSystem._theatrhythm_phase !== 1 || !this._sprite_buttons || !this._enemy_hp) return;
        var k = this._sprite_buttons;
        if (k._vitesseBase === undefined) { k._vitesseBase = k._keys_speed; this._atkBase = this._enemy_atk; }
        var part = this._enemy_hp[0] / Math.max(1, this._enemy_hp[1]), stade = part < 0.25 ? 2 : part < 0.5 ? 1 : 0;
        if (stade > this._enerve) {
            this._enerve = stade;
            k._keys_speed = k._vitesseBase * (R.vitesses[stade - 1] || 1);
            if (stade === 2) this._enemy_atk = Math.floor(this._atkBase * R.forceEnerve);
            this.annoncer(this._enemySprite._enemy.name() + (stade === 2 ? ' devient furieux !' : ' s\'énerve !'), '#ff6060');
        }
    };

    //=========================================================================
    // L'éditeur à grille
    //=========================================================================
    function chargerSon(nom, rappel) {
        if (TP._sons[nom]) { rappel(null, TP._sons[nom]); return; }
        var ext = AudioManager.audioFileExt(), url = 'audio/bgm/' + encodeURIComponent(nom) + ext;
        if (Decrypter.hasEncryptedAudio) url = Decrypter.extToEncryptExt(url);
        var x = new XMLHttpRequest();
        x.open('GET', url); x.responseType = 'arraybuffer';
        x.onload = function () {
            if (x.status >= 400 || !x.response) { rappel('fichier introuvable : ' + url); return; }
            var t = x.response;
            if (Decrypter.hasEncryptedAudio) t = Decrypter.decryptArrayBuffer(t);
            WebAudio._context.decodeAudioData(t, function (b) { TP._sons = {}; TP._sons[nom] = b; rappel(null, b); }, function () { rappel('le son ne se décode pas'); });
        };
        x.onerror = function () { rappel('fichier introuvable : ' + url); };
        x.send();
    }

    // Le tempo et le premier temps (pour caler la grille ; B et O pour corriger)
    function tempo(b) {
        var sr = b.sampleRate, a = b.getChannelData(0), saut = 512, nf = Math.floor(b.length / saut), fr = sr / saut;
        var env = new Float32Array(nf), rms = new Float32Array(nf), avant = 0, f, i, j = 0, max = 0;
        for (f = 0; f < nf; f++) {
            var e = 0;
            for (i = 0; i < saut; i++, j++) e += a[j] * a[j];
            var l = Math.log(1e-7 + e);
            env[f] = f ? Math.max(0, l - avant) : 0; avant = l;
            rms[f] = Math.sqrt(e / saut); if (rms[f] > max) max = rms[f];
        }
        var moy = 0; for (f = 0; f < nf; f++) moy += env[f]; moy /= nf;
        var best = -1e9, lag = 40;
        for (var L = Math.floor(fr * 60 / 190); L <= Math.ceil(fr * 60 / 70); L++) {
            var s = 0;
            for (f = 0; f + L < nf; f++) s += (env[f] - moy) * (env[f + L] - moy);
            s = s / (nf - L) * Math.exp(-0.5 * Math.pow(Math.log2(60 * fr / L / 120) / 0.6, 2));
            if (s > best) { best = s; lag = L; }
        }
        var bpm = Math.round(60 * fr / lag * 10) / 10, per = 60 * fr / bpm, phase = 0, pb = -1;
        for (var p0 = 0; p0 < per; p0 += 0.5) { var t = 0; for (var q = p0; q < nf; q += per) t += env[Math.floor(q)]; if (t > pb) { pb = t; phase = p0; } }
        return { bpm: bpm, decalage: Math.round(phase / fr * 1000), rms: rms, max: max, fr: fr };
    }

    function Lecteur(b) { this.b = b; this.s = null; this.t0 = 0; this.pos = 0; this.joue = false; }
    Lecteur.prototype.jouer = function (depuis) {
        this.arreter();
        var c = WebAudio._context, s = c.createBufferSource(), g = c.createGain();
        s.buffer = this.b; g.gain.value = 0.9 * AudioManager._bgmVolume / 100;
        s.connect(g); g.connect(WebAudio._masterGainNode || c.destination);
        depuis = Math.max(0, Math.min(depuis, this.b.duration));
        s.start(0, depuis);
        this.s = s; this.g = g; this.t0 = c.currentTime - depuis; this.joue = true;
    };
    Lecteur.prototype.temps = function () {
        if (!this.joue) return this.pos;
        var c = WebAudio._context;
        return c.currentTime - this.t0 - (c.outputLatency || 0) - (c.baseLatency || 0);
    };
    Lecteur.prototype.pause = function () { if (this.joue) { this.pos = this.temps(); this.arreter(); } };
    Lecteur.prototype.arreter = function () {
        if (this.s) { try { this.s.stop(0); } catch (e) { /* déjà */ } this.s.disconnect(); this.g.disconnect(); }
        this.s = null; this.joue = false;
    };

    function Scene_TheatrhythmEditeur() { this.initialize.apply(this, arguments); }
    Scene_TheatrhythmEditeur.prototype = Object.create(Scene_Base.prototype);
    Scene_TheatrhythmEditeur.prototype.constructor = Scene_TheatrhythmEditeur;
    window.Scene_TheatrhythmEditeur = Scene_TheatrhythmEditeur;

    var GRILLES = [1, 2, 3, 4], ZOOMS = [0.15, 0.22, 0.32, 0.45, 0.65];
    var COL = 50, X0 = 46, YC = 210, LARGE = 512;
    // touches du clavier → touche de MOG (0 A, 1 S, 2 Z/ok, 3 X/annuler, 4 ↑, 5 →, 6 ←, 7 ↓)
    var LETTRES = { a: 0, s: 1, z: 2, x: 3, arrowright: 5, arrowleft: 6 }, FLECHES = { arrowup: 4, arrowdown: 7 };
    var CHIFFRES = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7 };

    Scene_TheatrhythmEditeur.prototype.initialize = function () { Scene_Base.prototype.initialize.call(this); };
    Scene_TheatrhythmEditeur.prototype.create = function () {
        Scene_Base.prototype.create.call(this);
        var e = TP._etatEditeur;
        this._musique = e ? e.musique : TP._musiqueEditeur;
        if (!e) { BattleManager.saveBgmAndBgs(); AudioManager.fadeOutBgm(1); AudioManager.stopBgs(); }
        this._frise = new Sprite(new Bitmap(LARGE, Graphics.boxHeight));
        this._infos = new Sprite(new Bitmap(Graphics.boxWidth - LARGE, Graphics.boxHeight));
        this._infos.x = LARGE;
        this.addChild(this._frise); this.addChild(this._infos);
        this._icones = ImageManager.loadTheatrhythm('Theatrhythm_A');
        this._message = ''; this._messageTemps = 0;
        this.ecrire('Écoute de la musique…');
        var self = this;
        setTimeout(function () {
            chargerSon(self._musique, function (err, b) {
                if (self._fini) return;
                if (err) { self._erreur = err; self.ecrire('Impossible d\'ouvrir « ' + self._musique + ' » : ' + err + ' — Échap'); return; }
                self.ouvrir(b);
            });
        }, 50);
    };
    Scene_TheatrhythmEditeur.prototype.ecrire = function (t) {
        var b = this._frise.bitmap; b.fillAll('#15101e');
        b.fontSize = 18; b.textColor = '#fff'; b.drawText(t, 0, 280, LARGE, 30, 'center');
    };
    Scene_TheatrhythmEditeur.prototype.ouvrir = function (b) {
        var e = TP._etatEditeur;
        this._lecteur = new Lecteur(b);
        this._an = tempo(b);
        if (e && e.carte) { BattleManager._mapBgm = e.carte.bgm; BattleManager._mapBgs = e.carte.bgs; AudioManager.stopBgm(); }
        if (e) {
            ['p', 'curseur', 'grille', 'zoom', 'rang', 'type', 'modifie', 'annuler', 'refaire', 'clic'].forEach(function (k) { this['_' + k] = e[k]; }, this);
        } else {
            var p = TP.lire(this._musique);
            this._p = p ? JSON.parse(JSON.stringify(p)) : { version: 1, musique: this._musique, bpm: this._an.bpm, decalage: this._an.decalage, notes: [] };
            this._curseur = 0; this._grille = 1; this._zoom = 2; this._rang = -1; this._type = 0;
            this._modifie = false; this._annuler = []; this._refaire = []; this._clic = true;
            if (!p) this.dire('Nouvelle partition : tempo trouvé ' + this._an.bpm + '. B et O pour corriger.');
        }
        TP._etatEditeur = null;
        this._tenu = {};
        this._pret = true;
    };
    Scene_TheatrhythmEditeur.prototype.start = function () {
        Scene_Base.prototype.start.call(this);
        this._bas = this.toucheBas.bind(this);
        document.addEventListener('keydown', this._bas, true);
        this.startFadeIn(this.fadeSpeed(), false);
    };
    Scene_TheatrhythmEditeur.prototype.terminate = function () {
        Scene_Base.prototype.terminate.call(this);
        this._fini = true;
        document.removeEventListener('keydown', this._bas, true);
        Input.clear();
        if (this._lecteur) this._lecteur.arreter();
    };

    // ── l'état
    Scene_TheatrhythmEditeur.prototype.pas = function () { return 60000 / this._p.bpm / GRILLES[this._grille]; };
    Scene_TheatrhythmEditeur.prototype.caler = function (t) { var d = this._p.decalage || 0, p = this.pas(); return Math.round(d + Math.round((t - d) / p) * p); };
    Scene_TheatrhythmEditeur.prototype.temps = function () { return this._lecteur.joue ? this._lecteur.temps() * 1000 : this._curseur; };
    Scene_TheatrhythmEditeur.prototype.duree = function () { return this._lecteur.b.duration * 1000; };
    Scene_TheatrhythmEditeur.prototype.dire = function (m) { this._message = m; this._messageTemps = 240; };
    Scene_TheatrhythmEditeur.prototype.memoriser = function () {
        this._annuler.push(JSON.stringify(this._p)); if (this._annuler.length > 60) this._annuler.shift();
        this._refaire = []; this._modifie = true;
    };
    Scene_TheatrhythmEditeur.prototype.restaurer = function (de, vers) {
        if (!de.length) return;
        vers.push(JSON.stringify(this._p)); this._p = JSON.parse(de.pop()); this._modifie = true;
    };
    Scene_TheatrhythmEditeur.prototype.noteA = function (t, touche) {
        var tol = Math.max(8, this.pas() / 3);
        for (var i = 0; i < this._p.notes.length; i++) { var n = this._p.notes[i]; if (n[1] === touche && Math.abs(n[0] - t) <= tol) return i; }
        return -1;
    };
    Scene_TheatrhythmEditeur.prototype.basculer = function (t, touche, garder) {
        if (t < 0) return;
        this.memoriser();
        var i = this.noteA(t, touche);
        if (i >= 0) { if (!garder) this._p.notes.splice(i, 1); return; }
        this._p.notes.push([Math.round(t), touche, this._rang, this._type]);
        this._p.notes.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    };

    // ── le clavier
    Scene_TheatrhythmEditeur.prototype.toucheBas = function (e) {
        var k = (e.key || '').toLowerCase(), maj = e.shiftKey, ctrl = e.ctrlKey || e.metaKey;
        var fin = function () { e.preventDefault(); e.stopPropagation(); };
        if (!this._pret) { if (k === 'escape') { fin(); this.quitter(true); } return; }
        if (e.repeat && !/^arrow|^page/.test(k)) { fin(); return; }
        var joue = this._lecteur.joue;
        if (!ctrl) {
            var touche = LETTRES[k] !== undefined ? LETTRES[k] : (joue ? FLECHES[k] : undefined);
            if (touche === undefined && !joue && CHIFFRES[k] !== undefined) touche = CHIFFRES[k];
            if (touche !== undefined) {
                fin();
                if (joue) this.basculer(this.caler(this._lecteur.temps() * 1000 - Math.max(0, performance.now() - e.timeStamp)), touche, true);
                else this.basculer(this._curseur, touche);
                return;
            }
        }
        if (ctrl && k === 'z') { fin(); this.restaurer(this._annuler, this._refaire); return; }
        if (ctrl && k === 'y') { fin(); this.restaurer(this._refaire, this._annuler); return; }
        if (ctrl && k === 's') { fin(); this.enregistrer(); return; }
        if (ctrl && k === 'b') { fin(); this.memoriser(); this._p.bpm = Math.max(30, Math.round((this._p.bpm + (maj ? -1 : 1)) * 10) / 10); return; }
        var fait = true;
        switch (k) {
            case ' ': this.lecture(); break;
            case 'arrowup': case 'arrowdown': this.deplacer((k === 'arrowdown' ? 1 : -1) * this.pas()); break;
            case 'pageup': case 'pagedown': this.deplacer((k === 'pagedown' ? 1 : -1) * 4 * 60000 / this._p.bpm); break;
            case 'home': this.deplacer(-1e9); break;
            case 'end': this.deplacer(1e9); break;
            case 'g': this._grille = (this._grille + 1) % GRILLES.length; this._curseur = this.caler(this._curseur); this.dire('Grille : 1/' + GRILLES[this._grille] + ' de temps'); break;
            case 'r': this._rang = this._rang >= 3 ? -1 : this._rang + 1; this.dire('Héros des nouvelles notes : ' + (this._rang < 0 ? 'au hasard' : this._rang + 1)); break;
            case 't': this._type = (this._type + 1) % 4; this.dire('Type des nouvelles notes : ' + TP.NOMS_TYPES[this._type]); break;
            case 'b': this.memoriser(); this._p.bpm = Math.max(30, Math.round((this._p.bpm + (maj ? -0.1 : 0.1)) * 10) / 10); break;
            case 'o': this.memoriser(); this._p.decalage = (this._p.decalage || 0) + (maj ? -5 : 5); break;
            case '+': case '=': this._zoom = Math.min(ZOOMS.length - 1, this._zoom + 1); break;
            case '-': this._zoom = Math.max(0, this._zoom - 1); break;
            case 'h': this._clic = !this._clic; this.dire('Clic des notes : ' + (this._clic ? 'oui' : 'non')); break;
            case 'delete': case 'backspace': this.effacerLigne(); break;
            case 'enter': this.essayer(); break;
            case 'escape': this.quitter(); break;
            default: fait = false;
        }
        if (fait) fin();
    };
    Scene_TheatrhythmEditeur.prototype.lecture = function () {
        if (this._lecteur.joue) { this._lecteur.pause(); this._curseur = this.caler(this._lecteur.pos * 1000); }
        else { this._lecteur.jouer(Math.max(0, this._curseur) / 1000); this._dernierClic = this._curseur; }
    };
    Scene_TheatrhythmEditeur.prototype.deplacer = function (dt) {
        if (this._lecteur.joue) { this._lecteur.jouer(Math.max(0, this.temps() + dt) / 1000); return; }
        this._curseur = this.caler(Math.max(0, Math.min(this.duree(), this._curseur + dt)));
    };
    Scene_TheatrhythmEditeur.prototype.effacerLigne = function () {
        var t = this._curseur, tol = Math.max(8, this.pas() / 3), avant = this._p.notes.length;
        this.memoriser();
        this._p.notes = this._p.notes.filter(function (n) { return Math.abs(n[0] - t) > tol; });
        if (this._p.notes.length === avant) { this._annuler.pop(); this.dire('Rien sur cette ligne'); }
    };
    Scene_TheatrhythmEditeur.prototype.enregistrer = function () {
        var p = JSON.parse(JSON.stringify(this._p));
        p.musique = this._musique; p.modifie = new Date().toISOString().slice(0, 10);
        try { var f = TP.ecrire(this._musique, p); this._modifie = false; this.dire(f ? 'Enregistré ✓ ' + f : 'Téléchargé ✓ (à mettre dans theatrhythm/)'); }
        catch (err) { this.dire('Échec : ' + err.message); }
    };
    Scene_TheatrhythmEditeur.prototype.etat = function () {
        var e = { musique: this._musique };
        ['p', 'curseur', 'grille', 'zoom', 'rang', 'type', 'modifie', 'annuler', 'refaire', 'clic'].forEach(function (k) { e[k] = this['_' + k]; }, this);
        return e;
    };
    // Essayer : le vrai Theatrhythm, sur cette musique, avec ces notes ; on revient ici après
    Scene_TheatrhythmEditeur.prototype.essayer = function () {
        if (!this._p.notes.length) { this.dire('Pose des notes avant d\'essayer'); return; }
        if (this._lecteur.joue) this.lecture();
        TP._etatEditeur = this.etat();
        // MOG met de côté la musique en cours (aucune) : on garde celle de la carte pour le retour
        TP._etatEditeur.carte = { bgm: BattleManager._mapBgm, bgs: BattleManager._mapBgs };
        TP._essai = { musique: this._musique, p: JSON.parse(JSON.stringify(this._p)), variable: $gameVariables.value(Moghunter.theatrhythm_variable_id), interrupteur: $gameSwitches.value(Moghunter.theatrhythm_result_switch_id) };
        $gameSystem._theatrhythmMusique = this._musique;
        $gameSystem._theatrhythm_data = [R.ennemiEssai, R.vitesseEssai];
        SceneManager.push(Scene_Theatrhythm);
    };
    Scene_TheatrhythmEditeur.prototype.quitter = function (force) {
        if (this._modifie && !force && (!this._confirme || performance.now() - this._confirme > 2500)) {
            this._confirme = performance.now();
            this.dire('Pas enregistré ! Échap encore pour quitter quand même, Ctrl+S pour enregistrer');
            return;
        }
        this._fini = true;
        if (this._lecteur) this._lecteur.arreter();
        BattleManager.replayBgmAndBgs();
        this.popScene();
    };

    // le retour d'un essai : les points et le résultat d'avant sont rendus
    var _pop = SceneManager.pop;
    SceneManager.pop = function () {
        if (this._scene instanceof Scene_Theatrhythm && TP._essai) {
            $gameVariables.setValue(Moghunter.theatrhythm_variable_id, TP._essai.variable);
            $gameSwitches.setValue(Moghunter.theatrhythm_result_switch_id, TP._essai.interrupteur);
            $gameSystem._theatrhythmMusique = null;
            TP._essai = null;
        }
        _pop.call(this);
    };

    // ── la souris
    Scene_TheatrhythmEditeur.prototype.souris = function () {
        var z = ZOOMS[this._zoom];
        if (TouchInput.wheelY && !this._lecteur.joue) this.deplacer((TouchInput.wheelY > 0 ? 1 : -1) * this.pas());
        var clic = TouchInput.isTriggered(), droit = TouchInput.isCancelled();
        if (!clic && !droit) return;
        var x = TouchInput.x, y = TouchInput.y, col = Math.floor((x - X0) / COL);
        if (col < 0 || col > 7) return;
        var t = this.caler(this.temps() + (y - YC) / z);
        if (droit) { var i = this.noteA(t, col); if (i >= 0) { this.memoriser(); this._p.notes.splice(i, 1); } return; }
        this.basculer(t, col);
    };

    Scene_TheatrhythmEditeur.prototype.update = function () {
        Scene_Base.prototype.update.call(this);
        if (!this._pret) return;
        if (this._lecteur.joue && this._lecteur.temps() * 1000 >= this.duree()) { this._lecteur.arreter(); this._lecteur.pos = 0; }
        this.souris();
        if (this._lecteur.joue && this._clic) {
            var t = this.temps(), avant = this._dernierClic;
            if (this._p.notes.some(function (n) { return n[0] > avant && n[0] <= t; })) SoundManager.playCursor();
            this._dernierClic = t;
        }
        if (this._messageTemps > 0) this._messageTemps--;
        this.dessiner();
    };

    // ── le dessin
    Scene_TheatrhythmEditeur.prototype.dessiner = function () {
        var b = this._frise.bitmap, h = b.height, z = ZOOMS[this._zoom], t = this.temps(), an = this._an;
        var battue = 60000 / this._p.bpm, d = this._p.decalage || 0, ic = this._icones, cw = ic.isReady() ? ic.width / 8 : 0;
        function y(tn) { return YC + (tn - t) * z; }
        var t0 = t - YC / z, t1 = t + (h - YC) / z, k;
        b.clear(); b.fillAll('#15101e');
        for (k = 0; k < 8; k++) b.fillRect(X0 + k * COL, 0, COL - 2, h, k % 2 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)');
        // la forme du son
        var xs = X0 + 8 * COL + 4, ws = LARGE - xs - 2;
        for (var py = 0; py < h; py += 2) {
            var f = Math.floor((t0 + py / z) / 1000 * an.fr);
            if (f >= 0 && f < an.rms.length) b.fillRect(xs, py, Math.max(1, an.rms[f] / an.max * ws), 2, 'rgba(160,140,255,0.55)');
        }
        // la grille (le snap)
        var pas = this.pas();
        for (var g = Math.ceil((t0 - d) / pas); g <= Math.floor((t1 - d) / pas); g++) {
            var tl = d + g * pas, nb = (tl - d) / battue, temps = Math.abs(nb - Math.round(nb)) < 0.001, mesure = temps && Math.round(nb) % 4 === 0;
            b.fillRect(X0, Math.round(y(tl)), 8 * COL, mesure ? 2 : 1, mesure ? 'rgba(255,255,255,0.45)' : temps ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)');
            if (mesure && tl >= 0) { b.fontSize = 12; b.textColor = '#999'; b.drawText(String(Math.round(nb) / 4 + 1), 0, y(tl) - 9, X0 - 4, 18, 'right'); }
        }
        // les en-têtes : les vraies touches de MOG
        var taille = 38;
        for (k = 0; k < 8 && cw; k++) b.blt(ic, k * cw, 0, cw, ic.height, X0 + k * COL + (COL - 2 - taille) / 2, 4, taille, taille);
        // les notes
        var couleurs = [null, '#ffd447', '#5dff8a', '#ff3b3b'];
        this._p.notes.forEach(function (n) {
            if (n[0] < t0 - 100 || n[0] > t1 + 100) return;
            var x = X0 + n[1] * COL + (COL - 2 - taille) / 2, yn = y(n[0]) - taille / 2;
            if (couleurs[n[3]]) b.fillRect(x - 3, yn - 3, taille + 6, taille + 6, couleurs[n[3]]);
            if (cw) b.blt(ic, n[1] * cw, 0, cw, ic.height, x, yn, taille, taille);
            b.fontSize = 13; b.textColor = '#ffffff'; b.outlineColor = '#000'; b.outlineWidth = 4;
            b.drawText(n[2] >= 0 ? String(n[2] + 1) : '?', x + taille - 12, yn + taille - 14, 14, 14, 'center');
        });
        b.fillRect(X0 - 6, YC - 1, 8 * COL + 12, 3, this._lecteur.joue ? '#ff5577' : '#ffffff');
        this.dessinerInfos();
    };
    Scene_TheatrhythmEditeur.prototype.dessinerInfos = function () {
        var b = this._infos.bitmap, w = b.width, y = 8, t = Math.max(0, this.temps());
        b.clear(); b.fillAll('#1e1830');
        function ligne(s, c, tl) { b.fontSize = tl || 15; b.textColor = c || '#fff'; b.outlineWidth = 3; b.drawText(s, 10, y, w - 20, (tl || 15) + 6); y += (tl || 15) + 6; }
        ligne('✎ ' + this._musique, '#ffd447', 17);
        ligne(this._modifie ? 'non enregistré' : 'enregistré', this._modifie ? '#ffb347' : '#9dffaf');
        var min = Math.floor(t / 60000), sec = (t % 60000) / 1000;
        ligne(min + ':' + (sec < 10 ? '0' : '') + sec.toFixed(2) + '   tempo ' + this._p.bpm + '   décalage ' + (this._p.decalage || 0));
        ligne('Grille 1/' + GRILLES[this._grille] + ' · ' + this._p.notes.length + ' notes');
        ligne('Héros : ' + (this._rang < 0 ? 'au hasard' : this._rang + 1) + ' · ' + TP.NOMS_TYPES[this._type], '#cfc6ff');
        y += 4;
        [['Espace', 'lecture / pause'], ['↑ ↓ molette', 'avancer d\'un pas'], ['Pg↑ Pg↓', 'une mesure'], ['A S Z X ← →', 'poser au curseur'],
            ['5 / 8', 'poser ↑ / ↓ (à l\'arrêt)'], ['En lecture', 'les 8 touches enregistrent'], ['Clic', 'poser / enlever'], ['G', 'grille'],
            ['R', 'héros'], ['T', 'type de note'], ['Suppr', 'effacer la ligne'], ['B / O', 'tempo / décalage'], ['+ −', 'zoom'], ['H', 'clic des notes'],
            ['Ctrl+Z Y', 'annuler / rétablir'], ['Ctrl+S', 'enregistrer'], ['Entrée', 'essayer'], ['Échap', 'quitter']
        ].forEach(function (l) {
            b.fontSize = 13; b.textColor = '#ffd447'; b.drawText(l[0], 10, y, 100, 18);
            b.textColor = '#ddd'; b.drawText(l[1], 112, y, w - 118, 18); y += 18;
        });
        if (this._messageTemps > 0) {
            b.fillRect(0, b.height - 54, w, 54, 'rgba(0,0,0,0.6)');
            var m = this._message, l1 = m, l2 = '';
            if (m.length > 36) { var c = m.lastIndexOf(' ', 36); l1 = m.slice(0, c); l2 = m.slice(c + 1); }
            b.fontSize = 14; b.textColor = '#fff';
            b.drawText(l1, 8, b.height - 50, w - 16, 22); b.drawText(l2, 8, b.height - 28, w - 16, 22);
        }
    };

    //=========================================================================
    // Les commandes
    //=========================================================================
    function nomDeMusique(args) { return args.join(' ').replace(/^:\s*/, '').trim(); }
    var _commande = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _commande.call(this, command, args);
        var c = (command || '').toLowerCase();
        if (c === 'theatrhythm_editeur') {
            TP._musiqueEditeur = nomDeMusique(args);
            if (TP._musiqueEditeur) SceneManager.push(Scene_TheatrhythmEditeur);
        } else if (c === 'theatrhythm_musique') {
            $gameSystem._theatrhythmMusique = nomDeMusique(args) || null;
        }
    };
    TP.editer = function (musique) { TP._musiqueEditeur = musique; SceneManager.push(Scene_TheatrhythmEditeur); };
})();
