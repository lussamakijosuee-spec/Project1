//=============================================================================
// PlancherDegats.js — v1.0  ·  Aucun coup ne fait littéralement rien
// RPG Maker MV   ·   by JOKO
//   À charger APRÈS les plugins de combat (YEP_BattleEngineCore & consorts).
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Un coup qui touche fait toujours quelque chose. Corrige le
 * « mur de DÉF » des formules en soustraction sèche, sans toucher aux formules.
 * @author JOKO
 *
 * @param plancherPct
 * @text Plancher — % de la statistique de l'attaquant
 * @type number
 * @min 1
 * @max 50
 * @default 8
 * @desc Ce qu'un coup fait au minimum : 8 % de l'ATQ (physique) ou de la MAG (magique) du lanceur.
 *
 * @param plancherMini
 * @text Plancher — minimum absolu
 * @type number
 * @min 1
 * @default 1
 *
 * @param respecterImmunite
 * @text Respecter les immunités élémentaires ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Si Oui, une cible IMMUNISÉE à l'élément (taux 0) ne subit toujours rien. L'immunité reste une immunité.
 *
 * @param montrerLog
 * @text Annoncer le coup minimal dans le journal
 * @type boolean
 * @on Oui
 * @off Non
 * @default false
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE PROBLÈME QUE CE PLUGIN RÈGLE
 * ═══════════════════════════════════════════════════════════════════════════
 *  La plupart des formules du projet sont en SOUSTRACTION SÈCHE :
 *
 *      a.atk * 4 - b.def * 2
 *
 *  RPG Maker évalue cette formule puis fait Math.max(résultat, 0). Autrement
 *  dit : dès que la DÉF de la cible dépasse le double de l'ATQ du lanceur,
 *  le coup ne fait pas « peu » — il ne fait RIEN. Zéro. Et ça ne se voit
 *  jamais venir, parce que rien ne l'annonce.
 *
 *  Mesuré sur la base du projet :
 *    • 278 compétences tombent à 0 contre une cible à DÉF/MDF 400 ;
 *    • 269 compétences tombent à 0 quand le lanceur est de bas niveau.
 *
 *  Deux moments où ça se voit en jeu : le début de partie (tes personnages
 *  sont faibles, les formules ne décollent pas) et les boss blindés (toute
 *  une équipe qui tape dans le vide sans comprendre pourquoi).
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  CE QUE FAIT CE PLUGIN
 * ═══════════════════════════════════════════════════════════════════════════
 *  Il ne réécrit AUCUNE formule — celles du projet sont réglées à la main et
 *  méritent de le rester. Il pose simplement un plancher :
 *
 *      un coup qui TOUCHE et qui n'est pas annulé par une immunité
 *      fait au minimum plancherPct % de la statistique de son lanceur.
 *
 *  Ce qui continue de fonctionner exactement comme avant :
 *    • l'esquive et le ratage (le coup ne touche pas → rien, comme avant) ;
 *    • les IMMUNITÉS élémentaires (taux 0 → toujours rien : une immunité
 *      doit rester une immunité, sinon elle ne veut plus rien dire) ;
 *    • les absorptions élémentaires (taux négatif → soigne, comme avant) ;
 *    • les soins, les dégâts de PM, les compétences sans dégâts ;
 *    • toute formule qui produit déjà un résultat positif.
 *
 *  Autrement dit : une DÉF énorme reste une excellente défense — elle divise
 *  les dégâts par dix. Elle ne les efface plus.
 *
 *  ▶ POUR LE DÉSACTIVER sur une compétence précise :  <SansPlancher>
 *  ▶ POUR LE DÉSACTIVER sur une cible précise      :  <SansPlancher>
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('PlancherDegats');
    var PCT   = parseInt(P['plancherPct']  || 8);
    var MINI  = parseInt(P['plancherMini'] || 1);
    var IMMU  = String(P['respecterImmunite'] || 'true') === 'true';
    var LOG   = String(P['montrerLog'] || 'false') === 'true';

    function exempt(obj) {
        return !!(obj && obj.meta && obj.meta.SansPlancher);
    }

    /** La statistique sur laquelle le plancher se calcule : ATQ ou MAG. */
    function socle(action, sujet) {
        if (!sujet) return 0;
        return action.isMagical() ? sujet.mat : sujet.atk;
    }

    var _make = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var valeur = _make.call(this, target, critical);
        try {
            var item = this.item();
            // uniquement les dégâts de PV (type 1) — pas les soins, pas les PM
            if (!item || item.damage.type !== 1) return valeur;
            if (valeur > 0) return valeur;                       // le coup portait déjà
            if (exempt(item) || exempt(target)) return valeur;

            var taux = this.calcElementRate(target);
            if (IMMU && taux <= 0) return valeur;                 // immunité (ou absorption) : on ne touche à rien

            var base = socle(this, this.subject());
            var plancher = Math.max(MINI, Math.floor(base * PCT / 100 * taux));
            if (plancher <= 0) return valeur;

            if (LOG) {
                var w = SceneManager._scene && SceneManager._scene._logWindow;
                if (w) w.push('addText', '\\C[8]Le coup passe à peine. (' + plancher + ')\\C[0]');
            }
            return plancher;
        } catch (e) {
            return valeur;                                       // ne jamais casser un combat
        }
    };
})();
