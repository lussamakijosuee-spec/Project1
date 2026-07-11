//=============================================================================
// ClarteUI.js — v1.0  ·  Lisibilité : voir ce qu'on paie, en combat et dehors
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//   À charger EN DERNIER (après tous les systèmes, juste avant GrimoireHub).
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Clarté : l'aide des compétences affiche automatiquement
 * élément, Voie, Parole, Trait, Fusion et leurs PRIX ; jauges en combat.
 * @author JOKO
 *
 * @param aideEnrichie
 * @text Aide enrichie (skills)
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param jaugesCombat
 * @text Mini-jauges des 3 Chutes en combat
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  CLARTÉ — « toute puissance a un prix : encore faut-il le VOIR »     by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  ▶ AIDE ENRICHIE — partout où on choisit une compétence (combat, menu),
 *    la fenêtre d'aide ajoute une ligne d'infos lue dans les notetags :
 *      élément · Voie (et son prix) · Parole (niveau) · TRAIT (et son prix)
 *      · Fusion · Ultime · Invocation (âmes) · Interdit · Recul vital · % PV
 *    Rien à configurer : tout est automatique.
 *
 *  ▶ JAUGES EN COMBAT — sous chaque héros, trois mini-barres :
 *      violet = Corruption (la Bête) · rouge = Errance (l'Errant)
 *      bleu = santé mentale (pleine = saine).
 *
 *  Aucune donnée modifiée. Purement additif. Tout est désactivable.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('ClarteUI');
    var AIDE = String(P['aideEnrichie'] || 'true') === 'true';
    var JAUGES = String(P['jaugesCombat'] || 'true') === 'true';

    //=========================================================================
    // L'AIDE ENRICHIE — la ligne « ce que ça fait / ce que ça coûte »
    //=========================================================================
    var VOIES = {
        forge:   '×1.5 — prix −5 % PV/coup',
        onde:    'contre ×2 — exposé +20 %',
        source:  'soigne 60 % — +1 Errance',
        miroir:  'renvoi 100 % — 20 % subi',
        vide:    'perce — +2 Corruption',
        eclair:  'crit +50 % — dégâts −8 %',
        domaine: 'touche sûre ×1.3 — +3 Corruption',
        flash:   'Éclat Noir 25 % — −10 % PV max',
        sang:    'vol 45 % — +2 Corruption'
    };
    var FUSIONS = {
        chair:  'prix/tour : +Bête & +Errant',
        rasoir: 'prix/tour : +Bête & −lucidité',
        songe:  'prix/tour : −lucidité & +Errant'
    };

    function infoSkill(sk) {
        if (!sk) return '';
        var m = sk.meta || {};
        var p = [];
        var el = sk.damage && sk.damage.elementId;
        if (el > 0 && $dataSystem && $dataSystem.elements[el]) {
            p.push('\\C[4]' + $dataSystem.elements[el] + '\\C[0]');
        }
        if (m.Voie) {
            var v = String(m.Voie).toLowerCase().trim();
            p.push('\\C[6]Voie ' + v + '\\C[0]' + (VOIES[v] ? ' (' + VOIES[v] + ')' : ''));
        }
        if (m.ParoleL) p.push('\\C[23]Parole niv ' + String(m.ParoleL).trim() + '\\C[0]');
        else if (m.Parole !== undefined && String(m.Parole).indexOf('origine') >= 0) p.push('\\C[23]Parole d\'origine (infaillible)\\C[0]');
        if (m.Trait) p.push('\\C[18]TRAIT\\C[0] (prix : 20 % PM · 20 TP · +2 Errance)');
        if (m.Fusion || m.FusionChair !== undefined) {
            var f = m.FusionChair !== undefined ? 'chair' : String(m.Fusion).toLowerCase().trim();
            p.push('\\C[18]FUSION\\C[0]' + (FUSIONS[f] ? ' (' + FUSIONS[f] + ')' : ''));
        }
        if (m.Ultime) p.push('\\C[18]ULTIME\\C[0] (prix/tour croissant)');
        if (m.RoyaumeImperial !== undefined) p.push('\\C[18]DOMAINE\\C[0] (+30 âmes → Errance ↑)');
        if (m.Invocation) p.push('\\C[5]Invocation : ' + String(m.Invocation).trim() + ' âme(s)\\C[0]');
        if (m.Interdit !== undefined) p.push('\\C[2]INTERDIT : +8 Corruption\\C[0]');
        if (m.ReculVital) p.push('\\C[2]recul ' + String(m.ReculVital).trim() + ' % des dégâts\\C[0]');
        if (m.SceauMagie !== undefined) p.push('scelle la magie (PM → 0)');
        if (m.ContreTotale !== undefined) p.push('renvoie tout ce tour');
        if (m.AspirationDamnees !== undefined) p.push('régen ∝ âmes de la partie — Traumatisé');
        var hp = (sk.note || '').match(/<HP\s*Cost:\s*(\d+)\s*%>/i);
        if (hp) p.push('\\C[2]coût : ' + hp[1] + ' % PV\\C[0]');
        return p.join(' \\C[8]·\\C[0] ');
    }

    if (AIDE) {
        var _setItem = Window_Help.prototype.setItem;
        Window_Help.prototype.setItem = function (item) {
            try {
                if (item && DataManager.isSkill(item)) {
                    var info = infoSkill(item);
                    if (info) {
                        var d = String(item.description || '').split('\n')[0];
                        this.setText(d + '\n' + info);
                        return;
                    }
                }
            } catch (e) {}
            _setItem.call(this, item);
        };
    }

    //=========================================================================
    // LES 3 CHUTES EN COMBAT — mini-barres sous chaque héros
    //=========================================================================
    function jCorr(id) { try { return window.Corruption ? window.Corruption.niveau(id) / 100 : 0; } catch (e) { return 0; } }
    function jErr(id) { try { return window.Errance ? window.Errance.niveau(id) / 100 : 0; } catch (e) { return 0; } }
    function jMent(id) { try { return window.Ame ? (window.Ame.jauge(id) || 10) / 10 : 1; } catch (e) { return 1; } }

    if (JAUGES) {
        var _drawItem = Window_BattleStatus.prototype.drawItem;
        Window_BattleStatus.prototype.drawItem = function (index) {
            _drawItem.call(this, index);
            try {
                var actor = $gameParty.battleMembers()[index];
                if (!actor) return;
                var rect = this.itemRectForText(index);
                var id = actor.actorId();
                var y = rect.y + rect.height - 5;
                var w = Math.floor(rect.width / 3) - 4;
                var vals = [
                    { v: jCorr(id), c: '#B455E8' },   // la Bête
                    { v: jErr(id),  c: '#E85555' },   // l'Errant
                    { v: jMent(id), c: '#55A8E8' }    // l'esprit (pleine = saine)
                ];
                for (var i = 0; i < 3; i++) {
                    var x = rect.x + i * (w + 4);
                    this.contents.fillRect(x, y, w, 4, 'rgba(0,0,0,0.55)');
                    var fw = Math.max(0, Math.min(w - 2, Math.floor((w - 2) * vals[i].v)));
                    if (fw > 0) this.contents.fillRect(x + 1, y + 1, fw, 2, vals[i].c);
                }
            } catch (e) {}
        };
    }
})();
