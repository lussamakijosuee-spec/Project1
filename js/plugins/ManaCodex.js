//=============================================================================
// ManaCodex.js — v1.0
// Codex du Système de Mana — consultable en jeu (RPG Maker MV)
// by JOKO
//=============================================================================

/*:
 * @plugindesc v2.0 ■ Codex du Système de Mana (lisible en jeu, multi-pages)
 * Sources, Marque & Aura, les 3 Arts, les 5 Voies, les 3 Chutes, Éléments…
 * @author JOKO
 *
 * @param menuCommand
 * @text Texte commande Menu
 * @type string
 * @default Codex du Mana
 * @desc Libellé ajouté au menu principal (vide = ne pas ajouter).
 *
 * @param showInMenu
 * @text Ajouter au Menu ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  CODEX DU MANA                                                       by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Un livre consultable en jeu qui explique tout le système de Mana.
 *  Pages : les 3 Sources, la Marque & l'Aura, les 3 Arts, les 5 Voies de la
 *  Maîtrise, le Symbole, la Parole & le Lac, les 3 Chutes, l'Équilibre, les
 *  Éléments, les Rangs, le Premier, les Âges, les Royaumes.
 *  (Refonte « Trois Sources » : plus de cycle pierre-feuille-ciseaux.)
 *
 *  OUVRIR :
 *   • Plugin Command :  MANA codex
 *   • Script (event) :  SceneManager.push(Scene_ManaCodex)
 *   • Menu principal :  entrée ajoutée automatiquement (si activé)
 *
 *  NAVIGATION : ◄ ► (gauche/droite) pour tourner les pages, Échap pour fermer.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('ManaCodex');
    var MENU_TEXT = String(P['menuCommand'] || 'Codex du Mana');
    var SHOW_MENU = String(P['showInMenu'] || 'true') === 'true';

    // \C[n] = couleur, \} = texte plus petit. Lignes courtes pour tenir à l'écran.
    var PAGES = [
        { title: '① Les 3 Sources', lines: [
            'D\'où viennent l\'Esprit, le Corps et l\'Âme ?',
            '\\C[8]Personne ne le sait.\\C[0] Le monde est ainsi fait.',
            '',
            '\\C[1]ESPRIT\\C[0] → la pensée → l\'art de la \\C[1]Parole\\C[0]',
            '\\C[6]CORPS\\C[0]  → le mouvement → la \\C[6]Maîtrise\\C[0]',
            '\\C[2]ÂME\\C[0]   → le sentiment → le \\C[2]Symbole\\C[0]',
            '',
            'Les toucher à nu (Mana Pur) relève du mythe :',
            'on passe par des branches apprivoisées.'
        ] },
        { title: '② La Marque & l\'Aura', lines: [
            'L\'humanité est née SANS affinité. Le Premier lui',
            'donna la \\C[14]MARQUE\\C[0] (l\'ADN de l\'âme) : un noyau au',
            'cœur, bleu (Esprit), violet (Corps) ou rose (Âme),',
            'qui s\'étend sur le corps en runes ou tatouages.',
            '',
            'Quand le mana déborde : une \\C[17]AURA\\C[0] visible, de la',
            'couleur de l\'affinité, qui monte par \\C[17]paliers\\C[0].',
            'Voir une aura, c\'est jauger un adversaire.'
        ] },
        { title: '③ Les 3 Arts', lines: [
            '\\C[1]LA PAROLE\\C[0] (Esprit) — on récite : mot + élément',
            '  + sort. Précise, lente. Prix : la \\C[1]lucidité\\C[0].',
            '\\C[6]LA MAÎTRISE\\C[0] (Corps) — art martial instantané :',
            '  renforcer sa chair, projeter le mana sombre.',
            '  Prix : l\'\\C[6]humanité\\C[0] (recul PV).',
            '\\C[2]LE SYMBOLE\\C[0] (Âme) — on crée depuis l\'âme :',
            '  matérialiser, résonner, lire… et frapper l\'âme.',
            '  Prix : l\'\\C[2]essence\\C[0].'
        ] },
        { title: '④ La Maîtrise — les 5 Voies', lines: [
            '\\C[6]FORGE\\C[0]  — la puissance brute. « Le Point Final ».',
            '\\C[6]ONDE\\C[0]   — épouser la force et la retourner.',
            '\\C[6]SOURCE\\C[0] — le flux lent qui répare les chairs.',
            '\\C[6]MIROIR\\C[0] — peu de gestes ; renvoyer l\'attaque.',
            '\\C[6]VIDE\\C[0]   — l\'interne : l\'aura disparaît… mauvais signe.',
            '',
            'La Maîtrise \\C[17]progresse par le combat\\C[0] : chaque duel',
            'est une leçon volée. Mais à trop boire le combat…'
        ] },
        { title: '⑤ Le Symbole — 4 opérations', lines: [
            '\\C[2]MATÉRIALISER\\C[0] — sentiment + désir + croyance :',
            '  un objet/familier naît de ton âme. Unique.',
            '\\C[2]RÉSONANCE\\C[0] — accorder deux âmes : force décuplée.',
            '\\C[2]LECTURE\\C[0] — le Regard : lire nature, santé, mensonge.',
            '\\C[2]FRAPPE D\'ÂME\\C[0] — heurter l\'âme sous la chair :',
            '  aucune armure n\'arrête ce coup. <FrappeAme>',
            '',
            '\\C[18]✕ CONSOMMATION\\C[0] — dévorer les âmes. Interdite.',
            '  Elle fonctionne. C\'est bien le problème. (→ Errance)'
        ] },
        { title: '⑥ La Parole & le Lac', lines: [
            'La \\C[1]lucidité\\C[0] (0-100) sert à tenir les longues',
            'Paroles… et à VOIR. Descente par seuils :',
            '',
            '0 \\C[1]Surface\\C[0] — le monde ordinaire.',
            '1 \\C[1]Le voile\\C[0] — âmes errantes, marques, sang.',
            '2 \\C[1]La trame\\C[0] — le code sous les choses.',
            '3 \\C[8]Le Mur\\C[0] — ce qui regarde du dehors…',
            '4 \\C[8]Le Fond\\C[0] — tout, d\'un coup. La folie.',
            '',
            'Trop bas : les sorts ratent. Trop haut : le Dément.'
        ] },
        { title: '⑦ Les 3 Chutes', lines: [
            'Trop pencher vers une voie appelle son gouffre :',
            '',
            '\\C[6]LA BÊTE\\C[0] (Corps) — le sang d\'Ombrefauve prend',
            '  tout : Calme → Frémissement → Fièvre → la Mue.',
            '  Pas une rage : un souvenir. Le dieu mort se lève.',
            '\\C[2]L\'ERRANT\\C[0] (Âme) — trop donner ou trop dévorer :',
            '  Ancré → Décharné → Gonflé d\'âmes → l\'Errant.',
            '  Deux routes, une porte : hors du monde.',
            '\\C[1]LE DÉMENT\\C[0] (Esprit) — voir toute vérité,',
            '  perdre la raison. La lucidité totale est la folie.'
        ] },
        { title: '⑦bis Les Lois des Chutes', lines: [
            '\\C[6]LOI DU SANG\\C[0] — le sang appelle le sang.',
            'La NUIT, la corruption descend plus vite (×1.5).',
            'À Fièvre, les bêtes te reconnaissent : elles',
            'détournent les crocs. Tu es des leurs, presque.',
            '\\C[6]L\'ANCRE\\C[0] : l\'Objet Spirituel, gravé de son nom,',
            'suspend la griffe UN battement. Jamais deux.',
            '',
            '\\C[2]LOI DES AMARRES\\C[0] — une âme ne tient au monde',
            'que par ses attaches. Chaque \\C[23]Lien\\C[0] amarre (-6 %',
            'd\'errance gagnée par niveau). À la dérive : les',
            'petits oublis, puis la musique d\'Aldébaran…',
            'Seuls ceux qui te connaissent peuvent te retenir.'
        ] },
        { title: '⑧ L\'Équilibre', lines: [
            'Au centre des trois : le \\C[17]MANA SEMI-PARFAIT\\C[0].',
            'Ni Bête, ni Errant, ni Dément — tout faire',
            'sans basculer. (état « Surpassé » : +stats, +crit)',
            '',
            'Rare non par chance : parce que c\'est une TENSION',
            'à tenir à chaque instant, contre la pente.',
            '',
            '« Le maître n\'est pas celui qui pousse le plus loin',
            'une source, mais celui qui sait toujours revenir. »'
        ] },
        { title: '⑨ Les Éléments', lines: [
            'Huit fondamentaux : Feu 8 · Eau 9 · Vent 10 ·',
            'Terre 11 · Foudre 12 · Glace 13 · Lumière 14 · Ombre 15.',
            '',
            '\\C[17]CRÉER\\C[0] : élément + élément = nouvel élément.',
            'Terre(11)+Eau(9) = \\C[17]20 Plante\\C[0] · Feu+Eau = 17 Vapeur ·',
            'Feu+Terre = 19 Lave · Lumière+Ombre = 29 Crépuscule.',
            '',
            'Pas de roue des éléments : seuls \\C[14]Lumière\\C[0] ⇄ \\C[8]Ombre\\C[0]',
            's\'opposent. Un élément n\'a pas de morale.'
        ] },
        { title: '⑩ Les Rangs (D → S)', lines: [
            'L\'échelle de l\'Ordre d\'Or, reprise partout :',
            '',
            '\\C[8]D\\C[0] l\'Étincelle — marque à peine éveillée.',
            '\\C[8]C\\C[0] l\'Adepte — une source tenue en main.',
            '\\C[8]B\\C[0] le Maître — un art complet, l\'aura qui monte.',
            '\\C[8]A\\C[0] le Champion — renverse une bataille seul.',
            '\\C[14]S\\C[0] la Légende — le sommet mortel.',
            '',
            'Au-delà : \\C[17]l\'ASTRE\\C[0] — on ne classe pas un dieu.',
            'Quand un rapport dit « Astre », il dit : fuyez.'
        ] },
        { title: '⑪ Le Premier', lines: [
            'Le \\C[14]Dieu sans marque\\C[0]. Nul ne sait d\'où il vint.',
            'Il maniait les trois sources à nu — et \\C[14]voyait tout\\C[0]',
            '(son symbole : l\'ŒIL). Il donna la marque aux hommes,',
            'fonda l\'Ordre d\'Or… et l\'humanité, enfin puissante,',
            'extermina ou asservit les races anciennes.',
            '',
            'Puis, un jour, sans un mot — \\C[8]il partit\\C[0].',
            'Depuis, tout tourne autour d\'un \\C[14]trône vide\\C[0].'
        ] },
        { title: '⑫ Les Quatre Âges', lines: [
            '\\C[8]I\\C[0]  Le Monde sans marque — les races anciennes.',
            '\\C[8]II\\C[0] L\'Âge du Dieu — le Premier, la marque,',
            '   la gloire et le génocide. Puis le départ.',
            '\\C[8]III\\C[0] L\'Âge du Trône — la guerre civile devenue',
            '   mondiale. Un siècle lunaire de feu (~50 ans).',
            '\\C[8]IV\\C[0] L\'Âge des Cendres — Vultric + les Mages',
            '   imposent à l\'Ordre le \\C[17]Traité des Cendres\\C[0].',
            '   Depuis 40 ans : une paix extrêmement fragile.'
        ] },
        { title: '⑬ Les Quatre Royaumes', lines: [
            '\\C[14]ORDRE D\'OR\\C[0] — le royaume du dieu absent. Fier,',
            '  pieux, coupable. Champion : \\C[14]Donovano\\C[0], le Second.',
            '\\C[6]VULTRIC\\C[0] — la force et la fraternité. Champion :',
            '  l\'Empereur \\C[6]Kevératus\\C[0], la Divinité du Corps.',
            '\\C[1]MAGES DES ÉTOILES\\C[0] — le savoir… et un secret.',
            '  Championne : \\C[1]Jade\\C[0], la Sorcière de l\'Avidité.',
            '\\C[2]EMPIRE DE L\'EST\\C[0] — l\'âme, les clans, les morts.',
            '  Championne : \\C[2]Sève\\C[0], la Liseuse des Sangs.'
        ] },
        { title: '⑭ Les Terres Brisées', lines: [
            'Entre les royaumes : le no man\'s land laissé par',
            'la Guerre du Trône. Sans loi, sans maître. Le réel',
            'y est instable par endroits.',
            '',
            'On y trouve : des fuyards, des cultes, des',
            '\\C[8]Sans-Marque\\C[0], des \\C[8]Maudits\\C[0] (pénitents difformes),',
            'et les derniers \\C[6]Ombrefauves\\C[0] tapis dans les ruines.',
            '',
            'Beaucoup de routes commencent ici.'
        ] },
        { title: '⑮ Aldebéran & la Reine', lines: [
            'Où vont les âmes errantes ? Les cultes répondent',
            'd\'un mot qu\'on ne devrait pas dire : \\C[8]Aldebéran\\C[0].',
            'Un royaume hors du monde, par-delà les étoiles',
            'noires, où règne la \\C[8]Reine Oubliée\\C[0].',
            '',
            'Elle peut bénir — jamais sans consentement —',
            'et \\C[8]ne ment jamais\\C[0]. C\'est bien le problème.',
            'Y entrer efface ton nom de toutes les mémoires.',
            '',
            '\\C[18]N\'écoute pas la musique. Détourne le regard.\\C[0]'
        ] },
        { title: '⑯ Reprises & Oubli', lines: [
            'Rumeur des plus profonds lucides :',
            '',
            '\\C[1]LA REPRISE\\C[0] — un être tombe, et le monde revient',
            'en arrière, comme si rien n\'avait eu lieu. Nul ne',
            's\'en souvient… sauf ceux qui ont touché le Mur.',
            '',
            '\\C[8]L\'OUBLI\\C[0] — des êtres ont existé, puis ont été',
            'effacés du monde ET des mémoires. Il n\'en reste',
            'qu\'une trace au fond du Lac.',
            '',
            'On ne sait ni qui décide, ni pourquoi.'
        ] }
    ];

    //=========================================================================
    // WINDOW
    //=========================================================================

    function Window_ManaCodex() { this.initialize.apply(this, arguments); }
    Window_ManaCodex.prototype = Object.create(Window_Base.prototype);
    Window_ManaCodex.prototype.constructor = Window_ManaCodex;

    Window_ManaCodex.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this._page = 0;
        this.refresh();
    };

    Window_ManaCodex.prototype.setPage = function (i) {
        var n = PAGES.length;
        this._page = ((i % n) + n) % n; // wrap circulaire
        SoundManager.playCursor();
        this.refresh();
    };

    Window_ManaCodex.prototype.nextPage = function () { this.setPage(this._page + 1); };
    Window_ManaCodex.prototype.prevPage = function () { this.setPage(this._page - 1); };

    Window_ManaCodex.prototype.refresh = function () {
        this.contents.clear();
        var page = PAGES[this._page];
        var w = this.contentsWidth();

        // En-tête
        this.changeTextColor(this.systemColor());
        this.drawText('— CODEX DU MANA —', 0, 0, w, 'center');
        this.resetTextColor();

        this.drawText(page.title, 0, this.lineHeight() * 1.2, w, 'left');

        // Séparateur
        var sepY = Math.floor(this.lineHeight() * 2.4);
        this.contents.fillRect(0, sepY, w, 2, this.systemColor());

        // Corps
        var y = this.lineHeight() * 2.8;
        for (var i = 0; i < page.lines.length; i++) {
            this.drawTextEx(page.lines[i], 8, y);
            y += this.lineHeight();
        }

        // Pied de page
        var footY = this.contentsHeight() - this.lineHeight();
        this.changeTextColor(this.systemColor());
        this.drawText('◄  Page ' + (this._page + 1) + ' / ' + PAGES.length +
                      '  ►        (Échap : fermer)', 0, footY, w, 'center');
        this.resetTextColor();
    };

    //=========================================================================
    // SCENE
    //=========================================================================

    function Scene_ManaCodex() { this.initialize.apply(this, arguments); }
    window.Scene_ManaCodex = Scene_ManaCodex;
    Scene_ManaCodex.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_ManaCodex.prototype.constructor = Scene_ManaCodex;

    Scene_ManaCodex.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._codex = new Window_ManaCodex();
        this.addWindow(this._codex);
    };

    Scene_ManaCodex.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isRepeated('right') || Input.isRepeated('down') ||
            Input.isTriggered('pagedown')) {
            this._codex.nextPage();
        } else if (Input.isRepeated('left') || Input.isRepeated('up') ||
                   Input.isTriggered('pageup')) {
            this._codex.prevPage();
        } else if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
            SoundManager.playCancel();
            this.popScene();
        }
    };

    //=========================================================================
    // COMMANDE PLUGIN + MENU
    //=========================================================================

    var _GI_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _GI_pluginCommand.call(this, command, args);
        if (String(command).toUpperCase() === 'MANA' &&
            (args[0] || '').toLowerCase() === 'codex') {
            SceneManager.push(Scene_ManaCodex);
        }
    };

    if (SHOW_MENU && MENU_TEXT.length > 0) {
        var _SM_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _SM_createCommandWindow.call(this);
            this._commandWindow.setHandler('manaCodex', this.commandManaCodex.bind(this));
        };
        Scene_Menu.prototype.commandManaCodex = function () {
            SceneManager.push(Scene_ManaCodex);
        };
        var _WMC_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            _WMC_addOriginalCommands.call(this);
            this.addCommand(MENU_TEXT, 'manaCodex', true);
        };
    }

})();
