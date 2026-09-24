//=============================================================================
// AvatarDeKorrah.js
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le CORPS de l'Avatar de Korrah. seiryu se tient derrière
 * elle au combat, la suit, et bouge quand il frappe. Ne touche pas à ses règles.
 * @author pour JOKO
 *
 * @param acteurPorteuse
 * @text La porteuse
 * @desc L'identifiant de l'acteur dont l'Avatar suit les pas. Korrah = 2.
 * @type actor
 * @default 2
 *
 * @param acteurAvatar
 * @text Le corps de l'Avatar
 * @desc L'acteur qui sert de corps. seiryu = 6 (classe 5 « familié »).
 * @type actor
 * @default 6
 *
 * @param decalageX
 * @text Décalage horizontal
 * @desc Vers l'arrière de la porteuse. En vue de côté les héros regardent à
 * gauche : un nombre POSITIF le place derrière elle.
 * @default 78
 *
 * @param decalageY
 * @text Décalage vertical
 * @desc Négatif = plus haut. Il flotte, il ne marche pas.
 * @default -46
 *
 * @param echelle
 * @text Taille
 * @desc 1.0 = la taille de l'image. seiryu est dessiné en 192×192 par case.
 * @default 0.85
 *
 * @param opacite
 * @text Opacité au repos
 * @desc 0 à 255. Il n'est pas tout à fait de ce monde.
 * @default 215
 *
 * @param flottement
 * @text Amplitude du flottement
 * @desc En pixels. 0 pour l'immobiliser.
 * @default 5
 *
 * @help
 * ───────────────────────────────────────────────────────────────────────────
 * CE QUE FAIT CE GREFFON, ET CE QU'IL NE FAIT PAS
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Il ne donne à l'Avatar AUCUNE règle nouvelle. Les règles — quand il agit,
 * ce qu'il choisit, sa posture, son niveau — appartiennent toutes à
 * `AvatarSpirituel.js`, et rien ici ne les touche.
 *
 * Il ne lui donne qu'un CORPS :
 *
 *   · il se tient derrière Korrah, un peu plus haut, et flotte ;
 *   · il la suit — si elle s'avance pour frapper, il s'avance avec elle ;
 *   · il bouge quand il agit : l'action que l'Avatar joue porte déjà le
 *     drapeau `_parAvatar`, on s'y accroche sans rien réécrire ;
 *   · il n'est là que tant qu'elle l'est. Elle tombe, il s'efface.
 *
 * L'image est `img/sv_actors/seiryu.png`, déjà dans le projet — acteur 6
 * « seiryu », classe 5 « familié », noté « familié de korrah » par JOKO.
 * Aucun asset extérieur n'a été ajouté.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * DEUX PIÈGES DE MV RENCONTRÉS ICI
 * ───────────────────────────────────────────────────────────────────────────
 *
 * 1. `Sprite_Actor.setBattler()` appelle `setActorHome(battler.index())`.
 *    seiryu n'est pas dans l'équipe : son `index()` vaut -1, et MV le
 *    planterait en haut à gauche. On surcharge `setActorHome` pour le
 *    raccrocher à la porteuse à chaque image.
 *
 * 2. L'ordre d'ajout au champ de bataille EST l'ordre de dessin. On l'insère
 *    en position 0 : il passe DERRIÈRE tout le monde, y compris elle. C'est
 *    la place d'un Stand.
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('AvatarDeKorrah');
    var ID_PORTEUSE = parseInt(P['acteurPorteuse'] || 2, 10);
    var ID_AVATAR   = parseInt(P['acteurAvatar']   || 6, 10);
    var DX          = parseFloat(P['decalageX']  || 78);
    var DY          = parseFloat(P['decalageY']  || -46);
    var ECHELLE     = parseFloat(P['echelle']    || 0.85);
    var OPACITE     = parseInt(P['opacite']      || 215, 10);
    var FLOTTE      = parseFloat(P['flottement'] || 5);

    /** L'Avatar est-il là ? C'est AvatarSpirituel qui le dit, pas nous. */
    function present() {
        try {
            if (window.Avatars && typeof window.Avatars.present === 'function') {
                return window.Avatars.present(ID_PORTEUSE) === true;
            }
        } catch (e) { }
        // Sans le greffon des règles, on se rabat sur le seul fait qui compte :
        // il n'existe que tant qu'elle est debout.
        var a = $gameActors ? $gameActors.actor(ID_PORTEUSE) : null;
        return !!(a && a.isAlive() && $gameParty.members().indexOf(a) >= 0);
    }

    //=========================================================================
    // LE CORPS
    //=========================================================================
    function Sprite_AvatarKorrah() { this.initialize.apply(this, arguments); }
    Sprite_AvatarKorrah.prototype = Object.create(Sprite_Actor.prototype);
    Sprite_AvatarKorrah.prototype.constructor = Sprite_AvatarKorrah;

    Sprite_AvatarKorrah.prototype.initialize = function (porteuse) {
        this._porteuse = porteuse || null;
        this._phase = Math.random() * Math.PI * 2;   // pour que le flottement ne soit pas synchrone
        Sprite_Actor.prototype.initialize.call(this, $gameActors.actor(ID_AVATAR));
        this.scale.x = ECHELLE;
        this.scale.y = ECHELLE;
        this.opacity = 0;
    };

    // ⚠ Piège 1 : seiryu n'est pas dans l'équipe, son index() vaut -1.
    // On ne laisse pas MV calculer sa place : elle se lit sur la porteuse.
    Sprite_AvatarKorrah.prototype.setActorHome = function () {
        this.setHome(0, 0);
    };

    // Il ne s'avance jamais tout seul : il copie la position de sa porteuse.
    Sprite_AvatarKorrah.prototype.updateTargetPosition = function () { };

    Sprite_AvatarKorrah.prototype.suivre = function (spritePorteuse) {
        this._spritePorteuse = spritePorteuse || null;
    };

    Sprite_AvatarKorrah.prototype.update = function () {
        Sprite_Actor.prototype.update.call(this);
        this.collerALaPorteuse();
        this.fondreOuParaitre();
    };

    /** Il la suit — y compris quand elle s'avance pour frapper. */
    Sprite_AvatarKorrah.prototype.collerALaPorteuse = function () {
        var s = this._spritePorteuse;
        if (!s) { return; }
        this._phase += 0.045;
        this.x = this.borner(s.x + DX);
        this.y = s.y + DY + Math.sin(this._phase) * FLOTTE;
    };

    /**
     * En vue de côté, l'équipe est DÉJÀ collée au bord droit : un décalage
     * « derrière elle » pousse le corps hors de l'écran. Mesuré : avec
     * seiryu (192 px de case à l'échelle 0,85) et Korrah à x=704 sur 816,
     * il sortait de 48 px. On borne sur la largeur réelle de l'image plutôt
     * que de régler un nombre à la main qui casserait au premier changement
     * d'image ou de résolution.
     */
    Sprite_AvatarKorrah.prototype.borner = function (x) {
        var demi = 32;
        var bm = this._mainSprite ? this._mainSprite.bitmap : null;
        if (bm && bm.width) { demi = (bm.width / 9) * Math.abs(this.scale.x) / 2; }
        var marge = 6;
        return Math.max(demi + marge, Math.min(Graphics.width - demi - marge, x));
    };

    /** Elle tombe, il s'efface ; elle rouvre les yeux, il revient. */
    Sprite_AvatarKorrah.prototype.fondreOuParaitre = function () {
        var vise = present() ? OPACITE : 0;
        if (this.opacity < vise) { this.opacity = Math.min(vise, this.opacity + 10); }
        else if (this.opacity > vise) { this.opacity = Math.max(vise, this.opacity - 14); }
        this.visible = this.opacity > 0;
    };

    /** Il frappe : on lui demande un geste, MV s'occupe du reste. */
    Sprite_AvatarKorrah.prototype.jouerGeste = function (nom) {
        if (!this._actor) { return; }
        try { this._actor.requestMotion(nom || 'thrust'); } catch (e) { }
    };

    //=========================================================================
    // ON L'ACCROCHE AU CHAMP DE BATAILLE
    //=========================================================================
    var _creerActeurs = Spriteset_Battle.prototype.createActors;
    Spriteset_Battle.prototype.createActors = function () {
        _creerActeurs.call(this);
        if (!$gameSystem.isSideView()) { return; }          // sans vue de côté, pas de corps à montrer
        if (!$dataActors[ID_AVATAR] || !$dataActors[ID_AVATAR].battlerName) { return; }

        var porteuse = null;
        this._actorSprites.forEach(function (sp) {
            if (sp._actor && sp._actor.actorId && sp._actor.actorId() === ID_PORTEUSE) { porteuse = sp; }
        });

        this._avatarKorrah = new Sprite_AvatarKorrah();
        this._avatarKorrah.suivre(porteuse);
        // ⚠ Piège 2 : l'ordre d'ajout est l'ordre de dessin. En 0, il est DERRIÈRE.
        this._battleField.addChildAt(this._avatarKorrah, 0);
    };

    // La composition de l'équipe peut changer en plein combat (Formation,
    // un membre qui tombe) : on rattache le corps à sa porteuse à chaque image.
    var _majActeurs = Spriteset_Battle.prototype.updateActors;
    Spriteset_Battle.prototype.updateActors = function () {
        _majActeurs.call(this);
        if (!this._avatarKorrah) { return; }
        var porteuse = null;
        this._actorSprites.forEach(function (sp) {
            if (sp._actor && sp._actor.actorId && sp._actor.actorId() === ID_PORTEUSE) { porteuse = sp; }
        });
        this._avatarKorrah.suivre(porteuse);
    };

    //=========================================================================
    // IL BOUGE QUAND IL AGIT
    //=========================================================================
    // AvatarSpirituel marque déjà ses propres actions d'un `_parAvatar`.
    // On s'y accroche : aucune de ses règles n'est réécrite.
    var _appliquer = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        if (this._parAvatar) { geste(this.item()); }
        _appliquer.call(this, target);
    };

    function geste(item) {
        var sc = SceneManager._scene;
        if (!sc || !sc._spriteset || !sc._spriteset._avatarKorrah) { return; }
        // Une technique qui soigne ou qui garde n'a pas le même geste qu'un coup.
        var nom = 'thrust';
        if (item) {
            if (item.damage && item.damage.type >= 3 && item.damage.type <= 4) { nom = 'skill'; }
            else if (item.scope === 11 || item.scope === 0) { nom = 'guard'; }
            else if (/<\s*AvatarPosture\s*:\s*garde\s*>/i.test(item.note || '')) { nom = 'guard'; }
        }
        sc._spriteset._avatarKorrah.jouerGeste(nom);
    }

    //=========================================================================
    // DE QUOI LE MESURER SANS DEVINER
    //=========================================================================
    window.AvatarCorps = {
        sprite: function () {
            var sc = SceneManager._scene;
            return (sc && sc._spriteset) ? (sc._spriteset._avatarKorrah || null) : null;
        },
        present: present,
        reglages: function () {
            return { porteuse: ID_PORTEUSE, avatar: ID_AVATAR, dx: DX, dy: DY,
                     echelle: ECHELLE, opacite: OPACITE, flottement: FLOTTE };
        }
    };
})();
