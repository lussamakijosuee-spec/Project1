//=============================================================================
// AuraPaliers.js — v1.0  ·  L'Aura & les Paliers (le mana qui déborde)
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ En combat, une AURA visible enveloppe chaque combattant :
 * couleur = affinité (Esprit bleu / Corps violet / Âme rose / équilibre or),
 * intensité = palier de puissance. Additif, aucun asset requis.
 * @author JOKO
 *
 * @param enabled
 * @text Activer l'aura
 * @type boolean
 * @default true
 *
 * @param baseOpacity
 * @text Opacité de base
 * @type number
 * @default 42
 *
 * @help
 *  « À mesure qu'un marqué s'élève, son mana déborde de sa peau : une aura
 *  visible enveloppe le corps, de la couleur de l'affinité, et s'intensifie
 *  par paliers. Voir l'aura d'un adversaire, c'est jauger d'un regard à quel
 *  palier il se bat. » — le Codex.
 *
 *  ▶ COULEUR : lue sur la note de l'Acteur/Ennemi :
 *      <Mana: positif>      → bleue  (Esprit)
 *      <Mana: negatif>      → violette (Corps)   (aussi : sombre)
 *      <Mana: spirituelle>  → rose   (Âme)       (aussi : ame)
 *      <Mana: pur>          → or
 *      deux tags <Mana:> + <Mana2:> → OR (équilibre, rare)
 *      aucun tag → pas d'aura (Sans-Marque).
 *  ▶ PALIER (intensité/taille) : niveau <20 = 1, <40 = 2, <60 = 3, 60+ = 4.
 *      Ennemis : <Aura: n> pour forcer le palier (défaut 2).
 *  ▶ Désactiver sur un battler précis : <NoAura>
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('AuraPaliers');
    var ON = String(P['enabled'] || 'true') === 'true';
    var BASE_OP = parseInt(P['baseOpacity'] || 42);
    if (!ON) return;

    var COLORS = {
        esprit: '#5E92E6', corps: '#9166E6', ame: '#E0726E', or: '#D8B254'
    };
    var _cache = {};

    function auraBitmap(color) {
        if (_cache[color]) return _cache[color];
        var b = new Bitmap(160, 160);
        var ctx = b._context;
        var g = ctx.createRadialGradient(80, 80, 8, 80, 80, 78);
        g.addColorStop(0, color);
        g.addColorStop(0.55, color + '88');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(80, 80, 78, 0, Math.PI * 2); ctx.fill();
        b._setDirty && b._setDirty();
        _cache[color] = b;
        return b;
    }

    function branchOf(str) {
        switch (String(str || '').toLowerCase().trim()) {
            case 'positif': case 'positive': case 'originel': return 'esprit';
            case 'negatif': case 'négative': case 'negative': case 'sombre': return 'corps';
            case 'spirituelle': case 'spirituel': case 'ame': case 'âme': return 'ame';
            case 'pur': case 'parfait': case 'semi-parfait': return 'or';
        }
        return null;
    }

    function auraInfo(battler) {
        if (!battler) return null;
        var data = battler.isActor && battler.isActor() ? battler.actor()
                 : battler.isEnemy && battler.isEnemy() ? battler.enemy() : null;
        if (!data || !data.meta || data.meta.NoAura) return null;
        var b1 = branchOf(data.meta.Mana);
        if (!b1) return null;
        var b2 = branchOf(data.meta.Mana2);
        var color = (b2 && b2 !== b1) ? COLORS.or : COLORS[b1];
        var palier;
        if (battler.isActor && battler.isActor()) {
            var lv = battler.level || 1;
            palier = lv < 20 ? 1 : lv < 40 ? 2 : lv < 60 ? 3 : 4;
        } else {
            palier = Math.max(1, Math.min(4, parseInt(data.meta.Aura || 2)));
        }
        return { color: color, palier: palier };
    }

    function updateAura(sprite) {
        var battler = sprite._battler;
        var info = battler && battler.isAlive && battler.isAlive() ? auraInfo(battler) : null;
        if (!info) {
            if (sprite._auraSprite) sprite._auraSprite.visible = false;
            return;
        }
        if (!sprite._auraSprite) {
            var s = new Sprite();
            s.anchor.x = 0.5; s.anchor.y = 0.5;
            s.blendMode = 1;   // additif
            sprite._auraSprite = s;
            sprite.addChildAt(s, 0);
        }
        var a = sprite._auraSprite;
        if (a._auraColor !== info.color) { a.bitmap = auraBitmap(info.color); a._auraColor = info.color; }
        a.visible = true;
        var t = Graphics.frameCount / 60;
        var pulse = 1 + 0.06 * Math.sin(t * 3.2);
        var sc = (0.65 + 0.22 * info.palier) * pulse;
        a.scale.x = sc; a.scale.y = sc * 0.72;                 // ovale au sol
        a.y = -18;
        a.opacity = Math.min(255, (BASE_OP + info.palier * 22) * (0.9 + 0.1 * Math.sin(t * 2.1)));
    }

    var _SA_update = Sprite_Actor.prototype.update;
    Sprite_Actor.prototype.update = function () {
        _SA_update.call(this);
        if (this._battler) updateAura(this);
    };
    var _SE_update = Sprite_Enemy.prototype.update;
    Sprite_Enemy.prototype.update = function () {
        _SE_update.call(this);
        if (this._battler) updateAura(this);
    };
})();
