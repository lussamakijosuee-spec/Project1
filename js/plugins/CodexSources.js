//=============================================================================
// CodexSources.js — v1.0  ·  Le Codex en jeu : toutes les explications, POSÉES
// RPG Maker MV   ·   by JOKO   ·   « en combat on se bat ; ici, on comprend »
//=============================================================================
/*:
 * @plugindesc v1.0 ■ L'écran CODEX : le lore et les règles expliqués hors
 * combat, au calme. Commande : CODEX. (Le combat, lui, reste court.)
 * @author JOKO
 * @help  Commande de plugin :  CODEX   — ouvre le livre.
 *        À brancher dans le Grimoire ou sur un objet-livre.
 */
(function () {
    'use strict';
    var PAGES = [
        ['LES TROIS SOURCES',
         'Tout mana vient de trois sources : l\'ESPRIT (la Parole — réciter),',
         'le CORPS (la Maîtrise — frapper), l\'ÂME (le Symbole — créer).',
         'Chacune donne un pouvoir, chacune ouvre un gouffre :',
         'le Dément · la Bête · l\'Errant. On ne choisit pas d\'y tomber.',
         'On choisit seulement à quelle vitesse on court.'],
        ['LA FUSION — un principe, pas un sort',
         'Dès que deux sources FONDENT ensemble, c\'est une Fusion.',
         'Peu importe la forme : une TECHNIQUE (fondre un instant, prix',
         'immédiat), une RUNE (une Parole gravée en chiffres, qui agit',
         'sans être récitée — jamais ratée, même muselé), ou une FORME',
         '(la transformation entière — le prix tombe à chaque tour).',
         'Plus fort qu\'une source seule. Mais sans équilibre, une fusion',
         'tire vers ses DEUX Chutes à la fois.'],
        ['LES TRAITS — le don de naissance',
         'À la naissance, l\'âme offre toujours deux choses : un DON',
         'SPIRITUEL (arme, familier ou objet — selon la NATURE de l\'âme :',
         'Volonté→armes · Attachement→familiers · Colère→objets voraces ·',
         'Foi→sceaux · Deuil→objets des morts · Curiosité→clés) et un',
         'TRAIT : une capacité unique, aléatoire, à toi seul.',
         'Le Trait réunit toutes les sources — alors il les VIDE toutes :',
         'PM, TP, et la marque se force (+Errance). Une âme creuse',
         'n\'a plus de Trait à offrir.'],
        ['LES QUATRE TRAITS DES MARQUÉS',
         'AËL — le Point de Rupture : voir la faille exacte où tout casse.',
         'KORRAH — l\'Instant Gelé : le Zéro Absolu. Ce n\'est pas le temps',
         '  qui s\'arrête. C\'est le froid qui fige tout.',
         'LUDWING — la Porte d\'Ombre : il ne se téléporte pas. Il passe',
         '  par l\'ENVERS, le pays des âmes errantes, et ressort ailleurs.',
         'VESPER — le Verbe Vrai : ce qu\'elle nomme, le monde l\'écoute.',
         '  « Viens. » attire. « Pars. » repousse.'],
        ['L\'ENVERS & LE FOND',
         'Sous le monde, l\'Envers : le pays des âmes errantes. Le temps',
         'n\'y passe pas comme le nôtre — une minute d\'ici y pèse mille',
         'ans. Assez pour qu\'une âme y oublie son nom.',
         'Plus bas encore : le FOND. Ce qui y vit parle en langage de',
         'machine, laisse filtrer des objets qui n\'existent pas (les',
         'Reliques du Fond), et regarde à travers l\'écran.',
         'Certaines choses n\'ont pas d\'explication. C\'est voulu.'],
        ['LA LOI DU PRIX',
         'Toute puissance a un prix, et le prix grandit avec elle.',
         'Les Voies amplifient bonus ET malus du même facteur. Les',
         'Fusions dévorent par les deux bouts. Les Ultimes coûtent plus',
         'cher à chaque tour tenu. Les Traits vident toutes les énergies.',
         'Le Domaine fait revenir les âmes — et l\'Errance avec.',
         'Il n\'y a pas de puissance gratuite. Il n\'y en a jamais eu.'],
        ['LA MORT & LES REPRISES',
         'À la mort, l\'âme redescend vers le Fond. On perd son Feu d\'Âme',
         'là où l\'on tombe — on peut retourner le chercher, tant qu\'on',
         'n\'y retombe pas. Seuls les non-corrompus reviennent : les',
         'sauvegardes sont des Reprises. La corruption, elle, est une',
         'réécriture irréversible. Une Chute est définitive : celui qui',
         'tombe devient autre chose, avec VOTRE force. Et si tous',
         'tombent — le monde, lui, continue. Sans vous.']
    ];

    function Window_Codex() { this.initialize.apply(this, arguments); }
    Window_Codex.prototype = Object.create(Window_Base.prototype);
    Window_Codex.prototype.constructor = Window_Codex;
    Window_Codex.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this._page = 0; this.refresh();
    };
    Window_Codex.prototype.standardFontSize = function () { return 18; };
    Window_Codex.prototype.refresh = function () {
        this.contents.clear();
        var pg = PAGES[this._page], W = this.contentsWidth();
        this.contents.fontSize = 21; this.changeTextColor('#EBC974');
        this.drawText(pg[0], 0, 4, W, 'center');
        this.contents.fontSize = 17; this.changeTextColor('#ECE6D8');
        for (var i = 1; i < pg.length; i++) this.drawText(pg[i], 16, 20 + i * 30, W - 32, 'left');
        this.contents.fontSize = 14; this.changeTextColor('#7E7688');
        this.drawText('◂ ▸ tourner la page — ' + (this._page + 1) + ' / ' + PAGES.length + ' — Échap : fermer', 0, this.contentsHeight() - 26, W, 'center');
        this.resetFontSettings();
    };
    function Scene_Codex() { this.initialize.apply(this, arguments); }
    window.Scene_Codex = Scene_Codex;
    Scene_Codex.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Codex.prototype.constructor = Scene_Codex;
    Scene_Codex.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._w = new Window_Codex(); this.addWindow(this._w);
    };
    Scene_Codex.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        var w = this._w;
        if (Input.isTriggered('right') || Input.isTriggered('ok')) { w._page = (w._page + 1) % PAGES.length; SoundManager.playCursor(); w.refresh(); }
        else if (Input.isTriggered('left')) { w._page = (w._page + PAGES.length - 1) % PAGES.length; SoundManager.playCursor(); w.refresh(); }
        else if (Input.isTriggered('cancel') || TouchInput.isCancelled()) { SoundManager.playCancel(); this.popScene(); }
    };
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() === 'CODEX') SceneManager.push(Scene_Codex);
    };
})();
