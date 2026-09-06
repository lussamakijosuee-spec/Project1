//=============================================================================
// MenuClair.js — v1.0  ·  Le menu principal cesse de déborder
// RPG Maker MV   ·   by JOKO
//   À charger EN DERNIER, après tous les plugins qui ajoutent des commandes.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Corrige le menu principal : la fenêtre d'or ne recouvre
 * plus la dernière commande, et la liste défile au lieu de sortir de l'écran.
 * @author JOKO
 *
 * @param margeBas
 * @text Marge au-dessus de la fenêtre d'or (px)
 * @type number
 * @min 0
 * @default 0
 *
 * @param deuxColonnes
 * @text Passer à deux colonnes si la liste est trop longue ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default false
 * @desc Alternative au défilement : la liste s'étale sur deux colonnes.
 *
 * @param largeurDeuxCol
 * @text Largeur du menu en deux colonnes (px)
 * @type number
 * @min 240
 * @default 420
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE PROBLÈME
 * ═══════════════════════════════════════════════════════════════════════════
 *  Dans le MV de base, Window_MenuCommand.numVisibleRows() renvoie
 *  maxItems() : la fenêtre grandit pour afficher TOUTES les commandes, sans
 *  jamais défiler. Et Scene_Menu place la fenêtre d'or en bas de l'écran,
 *  par-dessus.
 *
 *  Dans ce projet, 7 plugins ajoutent chacun une commande (AmeStatusScene,
 *  LiensSocial, SuccesTitres, VisualMaxEX2, TriangleAffinites,
 *  GuideVoiesParoles, GrimoireHub) en plus des 8 commandes de base :
 *
 *      15 lignes × 36 px + 36 px de cadre = 576 px de haut
 *      fenêtre d'or : de 552 à 624 px
 *      → les 24 derniers pixels de la DERNIÈRE commande sont recouverts.
 *
 *  Et au 17e ajout, la fenêtre dépasserait franchement l'écran : les
 *  commandes du bas deviendraient tout bonnement inatteignables.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  CE QUE FAIT CE PLUGIN
 * ═══════════════════════════════════════════════════════════════════════════
 *  • Il borne la hauteur de la liste à la place réellement disponible
 *    au-dessus de la fenêtre d'or. Au-delà, MV fait ce qu'il sait déjà
 *    faire : la liste DÉFILE. Plus rien n'est caché, plus rien n'est perdu.
 *  • En option, il passe la liste sur deux colonnes plutôt que de la faire
 *    défiler — plus lisible quand il y a beaucoup d'entrées.
 *  • Il replace la fenêtre de statut en conséquence, pour qu'elle reste
 *    collée à la liste quelle que soit sa largeur.
 *
 *  Aucun effet de bord : le plugin ne touche qu'à la géométrie des fenêtres
 *  du menu principal. Les commandes, leurs handlers et leur ordre sont
 *  laissés exactement tels que les autres plugins les ont posés.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('MenuClair');
    var MARGE   = parseInt(P['margeBas'] || 0);
    var DEUX    = String(P['deuxColonnes'] || 'false') === 'true';
    var LARGEUR = parseInt(P['largeurDeuxCol'] || 420);

    /** La place réellement disponible : tout l'écran, moins la fenêtre d'or. */
    function hauteurDisponible() {
        var or = Window_Base.prototype.fittingHeight(1);   // hauteur de Window_Gold
        return Graphics.boxHeight - or - MARGE;
    }

    // ── La liste ne dépasse plus jamais : au-delà, elle défile ──────────────
    var _numVisibleRows = Window_MenuCommand.prototype.numVisibleRows;
    Window_MenuCommand.prototype.numVisibleRows = function () {
        var voulu = _numVisibleRows.call(this);            // ce que MV (ou un plugin) demande
        var lignes = Math.floor((hauteurDisponible() - this.standardPadding() * 2)
                                / this.lineHeight());
        var possible = Math.max(1, lignes);
        if (DEUX) {
            // deux colonnes : il faut deux fois moins de lignes
            return Math.max(1, Math.min(Math.ceil(voulu / 2), possible));
        }
        return Math.min(voulu, possible);
    };

    if (DEUX) {
        var _maxCols = Window_MenuCommand.prototype.maxCols;
        Window_MenuCommand.prototype.maxCols = function () {
            return this.maxItems() > this.numVisibleRows() ? 2 : _maxCols.call(this);
        };
        var _windowWidth = Window_MenuCommand.prototype.windowWidth;
        Window_MenuCommand.prototype.windowWidth = function () {
            return this.maxCols() > 1 ? LARGEUR : _windowWidth.call(this);
        };
    }

    // ── La fenêtre de statut suit la largeur réelle de la liste ─────────────
    var _createStatusWindow = Scene_Menu.prototype.createStatusWindow;
    Scene_Menu.prototype.createStatusWindow = function () {
        _createStatusWindow.call(this);
        try {
            if (this._statusWindow && this._commandWindow) {
                this._statusWindow.x = this._commandWindow.width;
                this._statusWindow.width = Graphics.boxWidth - this._commandWindow.width;
                this._statusWindow.refresh();
            }
        } catch (e) { }
    };
})();
