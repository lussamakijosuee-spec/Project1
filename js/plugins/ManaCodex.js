//=============================================================================
// ManaCodex.js — v1.0
// Codex du Système de Mana — consultable en jeu (RPG Maker MV)
// by JOKO
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Codex du Système de Mana (lisible en jeu, multi-pages)
 * Sources primordiales, branches, cycle, éléments, âme vs esprit, affinités.
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
 *  Pages : Sources, Branches, Cycle, Mana Pur, Éléments, Âme/Esprit,
 *  Objet Spirituel, Affinités.
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
        {
            title: '① Les 3 Sources Primordiales',
            lines: [
                'Tout être est un triptyque. Chaque facette est un',
                'puits de magie brut, presque impossible à puiser seul :',
                '',
                '\\C[2]• LE CORPS  →  Mana Sombre\\C[0]  (émotions/désirs enfouis)',
                '\\C[2]• L\'ÂME    →  Mana Spirituelle\\C[0]  (essence immortelle)',
                '\\C[2]• L\'ESPRIT →  Mana Originel\\C[0]  (mental & santé mentale)',
                '',
                'Puiser une source DIRECTEMENT est mortel : on a donc',
                'créé des branches secondaires plus maniables.'
            ]
        },
        {
            title: '② Les 3 Branches Secondaires',
            lines: [
                '\\C[6]MANA NÉGATIF\\C[0] (issu du Corps) — Empire Vultric.',
                '  Émotions → force physique. Coût : draine les PV.',
                '',
                '\\C[2]MANA SPIRITUELLE\\C[0] (issu de l\'Âme) — invocateurs, Lou.',
                '  Manipulation des âmes. Coût : traumas, cauchemars.',
                '',
                '\\C[1]MANA POSITIF\\C[0] (issu de l\'Esprit) — Sorcières des Étoiles.',
                '  Intelligence, soin, eau, cosmos. Faiblit si la',
                '  santé mentale décline.'
            ]
        },
        {
            title: '③ Le Cycle des Avantages',
            lines: [
                'Pierre-feuille-ciseaux entre les 3 branches :',
                '',
                '\\C[6]NÉGATIF\\C[0]  ──bat──►  \\C[2]ÂME / SPIRITUELLE\\C[0]',
                '\\C[2]SPIRITUELLE\\C[0] ──bat──►  \\C[1]POSITIF\\C[0]',
                '\\C[1]POSITIF\\C[0]  ──bat──►  \\C[6]NÉGATIF\\C[0]',
                '',
                'Branche avantagée : \\C[24]×1.5 dégâts\\C[0].',
                'Branche désavantagée : \\C[25]×0.5 dégâts\\C[0].'
            ]
        },
        {
            title: '④ Le Mana Pur (et Semi-Parfait)',
            lines: [
                '\\C[14]LE MANA PUR\\C[0] transcende le cycle : il ignore',
                'tous les avantages et toutes les résistances.',
                'C\'est l\'énergie des attaques magiques spéciales',
                'des êtres transcendants (Élus).',
                '',
                '\\C[17]MANA SEMI-PARFAIT\\C[0] : 1 chance sur 1000 d\'avoir',
                'une affinité avec TOUTES les sources à la fois…',
                'mais son usage défie la réalité elle-même.'
            ]
        },
        {
            title: '⑤ Les 8 Éléments',
            lines: [
                'Couche tactique, à façonner depuis le mana :',
                '',
                '\\C[2]FEU\\C[0]►EAU  \\C[2]EAU\\C[0]►FOUDRE  \\C[2]FOUDRE\\C[0]►TERRE',
                '\\C[2]TERRE\\C[0]►VENT  \\C[2]VENT\\C[0]►GLACE  \\C[2]GLACE\\C[0]►FEU',
                '(chacun est faible contre celui qu\'il pointe)',
                '',
                '\\C[14]LUMIÈRE\\C[0] ⇄ \\C[8]OMBRE\\C[0] : s\'opposent mutuellement.',
                'Le Mana Pur transcende toute affinité élémentaire.'
            ]
        },
        {
            title: '⑥ Âme vs Esprit',
            lines: [
                '\\C[2]L\'ÂME\\C[0] : essence immortelle. Jamais détruite —',
                '  elle retourne aux codes sources. Corruption =',
                '  perte de personnage PERMANENTE.',
                '',
                '\\C[1]L\'ESPRIT\\C[0] : dimension mentale. Peut être brisé',
                '  ou guéri selon la Santé Mentale (SAN).',
                '  Trauma = moins de Mana Originel disponible.'
            ]
        },
        {
            title: '⑦ L\'Objet Spirituel',
            lines: [
                'L\'arme/objet reçu au début du jeu.',
                '',
                'C\'est la manifestation physique de ton âme',
                'en surface. Il évolue avec ton niveau et ton âme.',
                '',
                'L\'âme est une coquille :',
                '  • Surface : ce qui est matérialisé (l\'Objet).',
                '  • Profondeurs : capacités, nature et traits.'
            ]
        },
        {
            title: '⑧ Les Affinités',
            lines: [
                'L\'affinité dépend de la nature de ton âme et peut',
                'CHANGER selon tes décisions au fil de la vie :',
                '',
                '• Une source : courant (bonus clair).',
                '• Aucune source : rare (tout apprendre à la dure).',
                '• Deux sources : peu courant (polyvalent).',
                '• Toutes les sources : \\C[17]1/1000\\C[0] (Mana Semi-Parfait).',
                '',
                'Plus d\'affinité = plus fort dans sa branche, mais',
                'plus de difficulté dans les autres.'
            ]
        },
        {
            title: '⑨ Distribution dans la population',
            lines: [
                '\\C[1]Alignés\\C[0] (1 source) ........... ≈ 72%',
                '  +20% dans sa branche, −20% ailleurs.',
                '\\C[6]Duaux\\C[0] (2 sources) ............ ≈ 15%',
                '  Avantages partiels sur 2 branches. Ex : \\C[2]Lou\\C[0], \\C[1]Neyssa\\C[0].',
                '  (Corps+Esprit → ×1.25 partiel, résistances croisées)',
                '\\C[8]Atones\\C[0] (aucune) .............. ≈ 12%',
                '  0 bonus, mais 0 corruption, malus réduits.',
                '\\C[17]Trines\\C[0] (3 faibles) ........... ≈ 0.9%',
                '\\C[14]Élus du Prisme\\C[0] (Semi-Parfait) . ≈ 0.1%',
                '  1/1000 : Mana Pur, ignore le cycle. Ex : \\C[14]Dono\\C[0].'
            ]
        },
        {
            title: '⑮ Les Classes Corrompues',
            lines: [
                'Au-delà des affinités existe une aberration :',
                'une âme dont les codes sources ont été RÉÉCRITS.',
                '',
                '\\C[18]La Classe Corrompue\\C[0] n\'appartient à aucune',
                'branche du cycle. Elle ne se soigne pas, ne se',
                'raisonne pas — elle dévore.',
                '',
                'Cas connu : \\C[18]Jada\\C[0], une classe à part entière,',
                'née d\'une corruption irréversible de l\'âme.'
            ]
        },
        {
            title: '⑩ Les Grandes Factions',
            lines: [
                '\\C[1]Sorcières des Étoiles\\C[0] (Positif) — fondées par',
                '  \\C[14]JADE\\C[0], déesse primordiale. Soigner, prédire,',
                '  protéger. Ce sont elles qui enseignent la magie.',
                '',
                '\\C[6]Empire Vultric\\C[0] (Négatif) — fondé par \\C[6]KEV\\C[0].',
                '  Mentalité de conquête (un peu « Thragg ») : seuls',
                '  les forts méritent ; la force se paie de sa chair.',
                '',
                '\\C[2]Les Voix de l\'Âme\\C[0] (Spirituelle) — nécro,',
                '  invocateurs, Lou. N\'écoute jamais trop les morts.'
            ]
        },
        {
            title: '⑪ Les Codes Sources',
            lines: [
                'Ce monde est numérique. Donc :',
                '',
                '• Une âme n\'est jamais détruite — elle retourne',
                '  dans les CODES SOURCES du jeu.',
                '• Les \\C[1]joueurs\\C[0] non corrompus peuvent REVENIR',
                '  via les sauvegardes (leur quasi-immortalité).',
                '• Les PNJ et âmes corrompues n\'ont pas ce filet.',
                '',
                'Protéger son âme > protéger son corps :',
                'le corps est un fichier ; l\'âme est la donnée.'
            ]
        },
        {
            title: '⑫ Corruption, Mort & Retour',
            lines: [
                'L\'âme se corrompt par : abus du Sombre/Négatif,',
                'écoute excessive des âmes, SAN trop basse.',
                '',
                'À la mort du corps :',
                '  1. l\'Objet Spirituel se brise,',
                '  2. l\'âme reflue vers les codes sources,',
                '  3. joueur sain → recharge une sauvegarde,',
                '  4. \\C[18]corrompu → réécriture irréversible\\C[0].'
            ]
        },
        {
            title: '⑬ L\'Économie du Mana',
            lines: [
                '• Plus on s\'éloigne de son affinité, plus ça coûte.',
                '• \\C[6]Négatif / Sombre\\C[0] : coûtent des PV, pas du PM.',
                '• \\C[1]Positif\\C[0] : faiblit quand la SAN baisse.',
                '• \\C[14]Mana Pur\\C[0] : le plus cher, mais ignore les défenses.',
                '',
                'Puiser au-delà de ses limites → états',
                '\\C[17]Surcharge d\'Âme\\C[0] : un boost… puis l\'effondrement.'
            ]
        },
        {
            title: '⑭ L\'Objet Spirituel',
            lines: [
                'L\'arme de départ évolue avec ton niveau et ton âme.',
                '',
                '1. \\C[8]Éclat\\C[0] (Niv.1) : forme brute, à peine éveillée.',
                '2. \\C[8]Forme\\C[0] (~15) : choisit sa nature (arme/objet).',
                '3. \\C[8]Résonance\\C[0] (~35) : débloque un pouvoir unique.',
                '4. \\C[14]Vérité\\C[0] (~60) : expression totale de l\'âme.',
                '',
                'Surface = ce qu\'on touche ; Profondeurs = traits',
                'et pouvoirs secrets. Jamais deux identiques.'
            ]
        },
        {
            title: '⑮ La Vérité sur Jade',
            lines: [
                'La « Jade » que tu affrontes n\'est pas la joueuse',
                'd\'origine : un \\C[8]PNJ\\C[0] a pris son corps en y',
                'transférant son âme. L\'âme de la vraie Jade, elle,',
                'survit \\C[2]sans corps\\C[0] — esprit et âme intacts.',
                '',
                'Le déséquilibre a \\C[18]bugué la réalité\\C[0] : Jade fut',
                'supprimée du monde… mais existe encore dans les',
                'DONNÉES du jeu. Une entité quasi omnipotente, un',
                '\\C[18]virus\\C[0] qui réécrit le jeu lui-même.',
                '',
                'Réfugiée dans le mod qu\'elle a créé, son unique but :',
                '\\C[14]sortir du jeu et atteindre le monde réel\\C[0] — ce que',
                'seuls les joueurs peuvent faire… mais aucun n\'a',
                'réussi. Ou aucun n\'a voulu partir.'
            ]
        },
        {
            title: '⑯ Jada, la Marionnettiste',
            lines: [
                '\\C[8]Jada\\C[0] est le PNJ qui habite le corps de Jade.',
                'Comme \\C[18]Monika\\C[0], elle SAIT qu\'elle vit dans un jeu —',
                'et qu\'au-dehors existe un \\C[14]monde réel\\C[0].',
                '',
                'Brillante. Manipulatrice. \\C[2]Jalouse\\C[0]. Son désir est',
                'sincère et dévorant : \\C[14]devenir réelle\\C[0], sortir — et',
                'arracher d\'autres âmes vers la sortie avec elle.',
                '',
                'C\'est elle qui \\C[18]invoque les nouveaux joueurs\\C[0] : des',
                'pions lancés contre les trois âmes originelles pour',
                'les vaincre et les voler. Mais sa vraie cible, tout',
                'au bout du fil… c\'est \\C[14]le Créateur lui-même\\C[0].'
            ]
        },
        {
            title: '⑰ Le Dieu Fou & la Clé',
            lines: [
                'Le \\C[14]Créateur\\C[0] a bâti ce monde — puis y est entré.',
                'Il détient une \\C[14]Clé\\C[0] pour en ressortir. Il refuse',
                'de s\'en servir.',
                '',
                'Pourquoi ? Parce qu\'ici il est \\C[2]heureux avec ses',
                'amis\\C[0]. Parce qu\'ici il peut tout faire, \\C[2]personne',
                'n\'est blessé, tout se répare\\C[0]. Sa dépression, ses',
                'doutes, ses échecs et sa culpabilité l\'ont aveuglé',
                'et rendu \\C[18]à moitié fou\\C[0].',
                '',
                'Fin normale : il est le \\C[18]boss final\\C[0]. Garder les',
                'âmes ne le libère pas — ça ne fait que forger un',
                'nouveau cycle où il reste \\C[2]prisonnier au paradis\\C[0].'
            ]
        }
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
