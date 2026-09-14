//=============================================================================
// MondeTeLit.js — v1.0 · Le monde lit ton âme (réputation d'âme)
// RPG Maker MV · by JOKO / Claude · charger APRÈS CorruptionAme, Errance,
//  MarqueVivante, NPCRoutines. Additif, non intrusif.
//=============================================================================
/*:
 * @plugindesc [v1.0] Le miroir du Regard : les PNJ lucides te LISENT en retour.
 * Ta corruption, ton errance, l'état de ta marque deviennent visibles — méfiance,
 * peur, marchands qui gonflent leurs prix, curieux des cultes.
 * @author JOKO / Claude
 *
 * @param seuilMefiance
 * @text Corruption — méfiance
 * @type number
 * @min 0
 * @max 100
 * @default 35
 * @desc Corruption à partir de laquelle les PNJ se méfient (petits reculs, gêne).
 *
 * @param seuilPeur
 * @text Corruption — peur
 * @type number
 * @min 0
 * @max 100
 * @default 70
 * @desc Corruption à partir de laquelle ils ont peur (on s'écarte, on chuchote).
 *
 * @param seuilErrance
 * @text Errance — « on ne te voit plus »
 * @type number
 * @min 0
 * @max 100
 * @default 70
 * @desc Errance à partir de laquelle les gens peinent à te percevoir / se souvenir.
 *
 * @param prixMax
 * @text Surcoût marchand max (%)
 * @type number
 * @min 0
 * @max 200
 * @default 50
 * @desc À corruption 100, les marchands gonflent leurs prix d'achat de ce %.
 *
 * @param reactions
 * @text Réactions sur la carte
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE MONDE TE LIT — le pendant du Regard
 * ═══════════════════════════════════════════════════════════════════════════
 *  Maintenant que TU lis les âmes, les lucides te lisent aussi. Ce que tu es se
 *  voit — et le monde te traite en conséquence.
 *
 *  ▶ SUR LA CARTE — les PNJ (événements au niveau des personnages) réagissent
 *    au chef quand tu passes près d'eux :
 *      • corruption ≥ méfiance : gêne, petit recul (bulle de sueur) ;
 *      • corruption ≥ peur     : ils s'écartent, chuchotent, les enfants fuient ;
 *      • errance ≥ seuil       : ils te cherchent des yeux sans te trouver
 *                                 (« … c'était qui ? »), comme si tu t'effaçais.
 *    Marque un PNJ <NoRead> pour qu'il n'y réagisse jamais (statues, bornes…).
 *
 *  ▶ CHEZ LES MARCHANDS — un cœur corrompu inspire la méfiance : les prix
 *    d'ACHAT montent avec la corruption de l'équipe (jusqu'au surcoût max).
 *
 *  Aucune dépendance dure : tout se dégrade proprement si un système manque.
 *  (Se marie avec NPCRoutines, qui fait carrément FUIR les très corrompus.)
 *
 *  SCRIPT :
 *      MondeLit.reputation()  → texte : comment le monde te lit là, maintenant
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('MondeTeLit');
    var S_MEF = parseInt(P['seuilMefiance'] || 35);
    var S_PEUR = parseInt(P['seuilPeur'] || 70);
    var S_ERR = parseInt(P['seuilErrance'] || 70);
    var PRIX_MAX = parseInt(P['prixMax'] || 50) / 100;
    var REACT = String(P['reactions'] || 'true') === 'true';

    function maxCorr() { var m = 0; try { if ($gameParty) $gameParty.members().forEach(function (a) { m = Math.max(m, window.Corruption ? Corruption.niveau(a.actorId()) : 0); }); } catch (e) {} return m; }
    function maxErr() { var m = 0; try { if ($gameParty) $gameParty.members().forEach(function (a) { m = Math.max(m, window.Errance ? Errance.niveau(a.actorId()) : 0); }); } catch (e) {} return m; }

    window.MondeLit = {
        reputation: function () {
            var c = maxCorr(), e = maxErr();
            if (e >= S_ERR) return 'Le monde te distingue mal — tu t\'effaces.';
            if (c >= S_PEUR) return 'On te craint. On s\'écarte de ton ombre.';
            if (c >= S_MEF) return 'On se méfie de toi. Quelque chose cloche, ça se sent.';
            return 'Le monde te voit comme un des siens.';
        }
    };

    //=========================================================================
    // Réactions des PNJ sur la carte
    //=========================================================================
    function estPNJ(ev) {
        if (!ev || ev._erased || !ev.page || !ev.page()) return false;
        if (ev.isThrough && ev.isThrough()) return false;
        if (ev.priorityType && ev.priorityType() !== 1) return false; // niveau des personnages
        // <NoRead> = jamais de réaction
        var txt = '';
        ev.page().list.forEach(function (c) { if (c.code === 108 || c.code === 408) txt += c.parameters[0]; });
        if (/<NoRead>/i.test(txt)) return false;
        return true;
    }
    function dist(ev) { return Math.abs(ev.x - $gamePlayer.x) + Math.abs(ev.y - $gamePlayer.y); }

    // petite réplique flottante au-dessus d'un PNJ
    function chuchoter(ev, txt, col) {
        var sc = SceneManager._scene;
        if (!sc || !sc._spriteset) return;
        var W = 220, H = 40, bmp = new Bitmap(W, H);
        bmp.fontFace = 'GameFont'; bmp.fontSize = 18; bmp.fontItalic = true;
        bmp.textColor = col || '#c8c8d4'; bmp.outlineColor = 'rgba(0,0,0,0.6)'; bmp.outlineWidth = 3;
        bmp.drawText(txt, 0, 0, W, H, 'center');
        if (bmp._setDirty) bmp._setDirty();
        var sp = new Sprite(bmp);
        sp.anchor.x = 0.5; sp.anchor.y = 1; sp.opacity = 0; sp.z = 9;
        sp._mtl = { t: 0, ev: ev };
        sc._spriteset.addChild(sp);
        (sc._mtlFloats = sc._mtlFloats || []).push(sp);
    }
    function majFloats(sc) {
        if (!sc._mtlFloats) return;
        for (var i = sc._mtlFloats.length - 1; i >= 0; i--) {
            var sp = sc._mtlFloats[i], d = sp._mtl; d.t++;
            var ev = d.ev;
            if (ev && $gameMap && sc._spriteset) {
                sp.x = ev.screenX(); sp.y = ev.screenY() - 44 - d.t * 0.3;
            }
            sp.opacity = d.t < 16 ? d.t * 16 : (d.t > 70 ? Math.max(0, 255 - (d.t - 70) * 12) : 255);
            if (d.t > 92) { if (sp.parent) sp.parent.removeChild(sp); sc._mtlFloats.splice(i, 1); }
        }
    }

    var MEFIANCE = ['…', 'hmm.', 'qui va là ?'];
    var PEUR = ['écartez-vous…', 'ne le regarde pas.', 'ça sent la Bête.', 'protégez les petits.'];
    var EFFACE = ['… c\'était qui ?', 'j\'ai cru voir quelqu\'un.', 'il y avait quelqu\'un, non ?'];

    var _upd = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _upd.call(this);
        try {
            majFloats(this);
            if (!REACT || $gameMessage.isBusy() || !$gamePlayer.canMove()) return;
            this._mtlCd = (this._mtlCd || 90);
            if (--this._mtlCd > 0) return;
            this._mtlCd = 70 + Math.floor(Math.random() * 90);

            var c = maxCorr(), e = maxErr();
            if (c < S_MEF && e < S_ERR) return;
            // un PNJ proche, au hasard
            var proches = $gameMap.events().filter(function (ev) { return estPNJ(ev) && dist(ev) <= 4; });
            if (!proches.length) return;
            var ev = proches[Math.floor(Math.random() * proches.length)];

            if (e >= S_ERR && Math.random() < 0.5) {
                ev.requestBalloon ? $gameTemp.requestBalloon(ev, 8) : 0;  // « … »
                if (Math.random() < 0.6) chuchoter(ev, EFFACE[Math.floor(Math.random() * EFFACE.length)], '#9aa0c8');
            } else if (c >= S_PEUR) {
                $gameTemp.requestBalloon(ev, 1);                          // « ! »
                // le PNJ recule d'un pas, à l'opposé du joueur
                if (ev.setDirection && !ev.isMoving()) { ev.moveAwayFromCharacter($gamePlayer); }
                if (Math.random() < 0.7) chuchoter(ev, PEUR[Math.floor(Math.random() * PEUR.length)], '#e0846a');
            } else if (c >= S_MEF) {
                $gameTemp.requestBalloon(ev, 6);                          // sueur
                if (Math.random() < 0.5) chuchoter(ev, MEFIANCE[Math.floor(Math.random() * MEFIANCE.length)], '#c8c8a0');
            }
        } catch (er) {}
    };

    //=========================================================================
    // Marchands : la méfiance gonfle les prix d'achat
    //=========================================================================
    function facteurPrix() { return 1 + (maxCorr() / 100) * PRIX_MAX; }
    if (typeof Window_ShopBuy !== 'undefined') {
        var _price = Window_ShopBuy.prototype.price;
        Window_ShopBuy.prototype.price = function (item) {
            var base = _price.call(this, item);
            var f = facteurPrix();
            return f > 1 ? Math.floor(base * f) : base;
        };
    }
    // un mot du marchand à l'ouverture si la corruption est haute
    var _shopStart = Scene_Shop.prototype.start;
    Scene_Shop.prototype.start = function () {
        _shopStart.call(this);
        try {
            if (maxCorr() >= S_PEUR && this._helpWindow) this._helpWindow.setText('« Pour vous… ce sera plus cher. Ne le prenez pas mal. »');
            else if (maxErr() >= S_ERR && this._helpWindow) this._helpWindow.setText('« On se connaît ?… non. Pardon. Que vouliez-vous ? »');
        } catch (e) {}
    };
})();
