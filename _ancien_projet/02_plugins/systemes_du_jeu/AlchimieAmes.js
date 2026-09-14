//=============================================================================
// AlchimieAmes.js — v1.0  ·  Alchimie / Craft (combine des objets)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Alchimie : combine des objets pour en créer de meilleurs.
 * Recettes définies par NOM d'objet (robuste). Ouvre avec ALCHIMIE.
 * @author JOKO
 *
 * @help
 *  Ouvre l'atelier depuis un événement :
 *      Plugin Command :  ALCHIMIE
 *  L'écran liste les recettes ; celles dont tu as les ingrédients sont
 *  actives. Crafter consomme les ingrédients et donne le résultat.
 *  Les recettes sont dans le tableau RECIPES (par nom d'objet — adapte-les).
 */
(function () {
    'use strict';
    // {nom, ing:[[nomObjet, qté], ...], result:nomObjet, qté}
    var RECIPES = [
        { nom: 'Potion Supérieure', ing: [['Potion rouge', 3]], res: 'Potion Supérieure', q: 1 },
        { nom: 'Méga Potion', ing: [['Potion Supérieure', 2]], res: 'Méga Potion', q: 1 },
        { nom: 'Éther', ing: [['Eau Magique', 2]], res: 'Éther', q: 1 },
        { nom: 'Élixir', ing: [['Méga Potion', 1], ['Méga Éther', 1]], res: 'Élixir', q: 1 },
        { nom: 'Plume de Phénix', ing: [['Potion Divine', 1], ['Herbe Dissipatrice', 1]], res: 'Plume de Phénix', q: 1 },
        { nom: 'Bombe Incendiaire', ing: [['Fiole de Feu', 3]], res: 'Bombe Incendiaire', q: 1 }
    ];

    var _byName = null;
    function itemByName(n) {
        if (!_byName) {
            _byName = {};
            $dataItems.forEach(function (it) { if (it && it.name) _byName[it.name] = it; });
        }
        return _byName[n] || null;
    }
    function validRecipes() {
        return RECIPES.filter(function (r) {
            if (!itemByName(r.res)) return false;
            return r.ing.every(function (g) { return !!itemByName(g[0]); });
        });
    }
    function canCraft(r) {
        return r.ing.every(function (g) { return $gameParty.numItems(itemByName(g[0])) >= g[1]; });
    }
    function craft(r) {
        r.ing.forEach(function (g) { $gameParty.loseItem(itemByName(g[0]), g[1]); });
        $gameParty.gainItem(itemByName(r.res), r.q);
    }

    function Window_Alchimie() { this.initialize.apply(this, arguments); }
    Window_Alchimie.prototype = Object.create(Window_Command.prototype);
    Window_Alchimie.prototype.constructor = Window_Alchimie;
    Window_Alchimie.prototype.initialize = function () { Window_Command.prototype.initialize.call(this, 0, 72); };
    Window_Alchimie.prototype.windowWidth = function () { return Graphics.boxWidth; };
    Window_Alchimie.prototype.makeCommandList = function () {
        validRecipes().forEach(function (r, i) {
            var ing = r.ing.map(function (g) { return g[1] + 'x ' + g[0]; }).join(' + ');
            this.addCommand(r.res + '   ◄  ' + ing, 'r' + i, canCraft(r));
        }, this);
    };

    function Scene_Alchimie() { this.initialize.apply(this, arguments); }
    window.Scene_Alchimie = Scene_Alchimie;
    Scene_Alchimie.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Alchimie.prototype.constructor = Scene_Alchimie;
    Scene_Alchimie.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._title = new Window_Help(1); this._title.setText('\\C[14]ALCHIMIE\\C[0] — combine tes objets pour en créer de meilleurs.');
        this.addWindow(this._title);
        this._win = new Window_Alchimie();
        this._win.setHandler('cancel', this.popScene.bind(this));
        var list = validRecipes();
        list.forEach(function (r, i) { this._win.setHandler('r' + i, this.onCraft.bind(this)); }, this);
        this.addWindow(this._win);
    };
    Scene_Alchimie.prototype.onCraft = function () {
        var i = parseInt(this._win.currentSymbol().substr(1));
        var r = validRecipes()[i];
        if (r && canCraft(r)) { craft(r); SoundManager.playUseItem(); this._win.refresh(); }
        else SoundManager.playBuzzer();
        this._win.activate();
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() === 'ALCHIMIE') SceneManager.push(Scene_Alchimie);
    };
})();
