/*
 * LES PLUGINS QUI SE MARCHENT DESSUS
 * ---------------------------------------------------------------------------
 * Le conflit de plugins le plus courant dans MV ne lève aucune erreur : un
 * plugin remplace une fonction du moteur (Window_Message.prototype.update,
 * Scene_Map.prototype.start…) SANS rappeler la version d'avant. Si un plugin
 * chargé plus haut avait déjà modifié cette fonction, son ajout disparaît —
 * il est « chargé », il ne fait plus rien.
 *
 * Ce banc charge le jeu comme MV le fait, mais photographie toutes les
 * fonctions du moteur ENTRE deux plugins. Il sait donc, pour chaque fonction,
 * qui l'a écrite en dernier. Quand un plugin remplace la version d'un AUTRE
 * plugin et que son code ne rappelle rien (aucun .call / .apply / alias), le
 * premier perd sa modification : c'est ce qu'il liste.
 *
 * C'est un repérage, pas un verdict : un plugin peut réécrire volontairement
 * une fonction en reprenant ce que faisait l'autre. Chaque cas se relit. Le
 * banc innocente aussi : un remplacement qui rappelle la version d'avant
 * (l'alias classique) n'est jamais compté.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/les_plugins_qui_se_marchent_dessus.js
 *   node bancs/navigateur/les_plugins_qui_se_marchent_dessus.js --tout   (avec le code des deux versions)
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var TOUT = process.argv.indexOf('--tout') >= 0;

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 160)); });

    // Une photo des fonctions du moteur après chaque plugin. Le petit script
    // « data: » est inséré juste après celui du plugin, avec async=false : le
    // navigateur garantit l'ordre, il s'exécute donc entre deux plugins.
    await page.addInitScript(function () {
        var proprietaire = {};   // clé → nom du plugin (ou « moteur »)
        var vu = {};             // clé → fonction
        var journal = [];
        var STATIQUES = ['BattleManager', 'SceneManager', 'DataManager', 'ConfigManager', 'StorageManager',
            'ImageManager', 'AudioManager', 'SoundManager', 'TextManager', 'PluginManager', 'Graphics',
            'Input', 'TouchInput', 'Utils', 'JsonEx', 'ResourceHandler', 'WebAudio', 'Html5Audio'];
        function cles() {
            var out = {};
            Object.getOwnPropertyNames(window).forEach(function (n) {
                if (!/^(Game_|Scene_|Window_|Sprite|Spriteset_|Bitmap|Tilemap|ShaderTilemap|TilingSprite|ScreenSprite|Weather|ToneFilter|ToneSprite|Stage|WindowLayer|Rectangle|Point|CacheEntry|CacheMap|ImageCache|RequestQueue)/.test(n)) return;
                var c; try { c = window[n]; } catch (e) { return; }
                if (typeof c !== 'function' || !c.prototype) return;
                Object.getOwnPropertyNames(c.prototype).forEach(function (p) {
                    var d = Object.getOwnPropertyDescriptor(c.prototype, p);
                    if (d && typeof d.value === 'function' && p !== 'constructor') out[n + '.prototype.' + p] = d.value;
                });
            });
            STATIQUES.forEach(function (n) {
                var o; try { o = window[n]; } catch (e) { return; }
                if (!o) return;
                Object.getOwnPropertyNames(o).forEach(function (p) {
                    var d = Object.getOwnPropertyDescriptor(o, p);
                    if (d && typeof d.value === 'function' && p !== 'prototype') out[n + '.' + p] = d.value;
                });
            });
            return out;
        }
        window.__photo = function (nom) {
            var maintenant = cles();
            Object.keys(maintenant).forEach(function (k) {
                var f = maintenant[k];
                if (vu[k] === f) return;
                if (vu[k] && nom !== 'moteur') {
                    var src = String(f);
                    var norm = function (s) { return String(s).replace(/[\s;]+/g, ''); };
                    journal.push({
                        cle: k, par: nom, avant: proprietaire[k],
                        // la même petite fonction redéclarée mot pour mot (les MOG le font tous) : rien de perdu
                        identique: norm(src) === norm(vu[k]),
                        rappelle: /\.(call|apply)\s*\(/.test(src) || /arguments\s*\)/.test(src),
                        lignes: src.split('\n').length,
                        src: src.slice(0, 600), srcAvant: String(vu[k]).slice(0, 600)
                    });
                }
                vu[k] = f; proprietaire[k] = nom;
            });
        };
        window.__journal = function () { return journal; };
        window.__proprietaires = function () { return proprietaire; };
    });

    // Le chargeur de plugins de MV, avec la photo glissée après chacun.
    await page.route('**/js/rpg_managers.js', async function (route) {
        var r = await route.fetch();
        var corps = await r.text();
        corps += '\n;(function(){\n' +
            '  var _setup = PluginManager.setup;\n' +
            '  PluginManager.setup = function (plugins) { window.__photo("moteur"); _setup.call(this, plugins); };\n' +
            '  PluginManager.loadScript = function (name) {\n' +
            '    var s = document.createElement("script"); s.type = "text/javascript"; s.src = this._path + name;\n' +
            '    s.async = false; s.onerror = this.onError.bind(this); s._url = this._path + name; document.body.appendChild(s);\n' +
            '    var t = document.createElement("script"); t.async = false;\n' +
            '    t.src = "data:text/javascript," + encodeURIComponent("window.__photo(" + JSON.stringify(name.replace(/\\.js$/, "")) + ")");\n' +
            '    document.body.appendChild(t);\n' +
            '  };\n' +
            '})();\n';
        await route.fulfill({ response: r, body: corps, headers: Object.assign({}, r.headers(), { 'content-type': 'text/javascript' }) });
    });

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { return window.SceneManager && SceneManager._scene; }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);
    var journal = await page.evaluate(function () { return window.__journal(); });
    await nav.close();

    // Une fonction écrite par un plugin, remplacée par un autre qui ne rappelle rien.
    var ecrasees = journal.filter(function (j) {
        return j.avant !== 'moteur' && j.avant !== j.par && !j.rappelle && !j.identique;
    });
    var nouveaux = ecrasees.filter(function (j) { return !RELUS[j.cle + ' ← ' + j.par]; });
    var parVictime = {};
    nouveaux.forEach(function (j) { (parVictime[j.avant] = parVictime[j.avant] || []).push(j); });

    var remplacements = journal.filter(function (j) { return !j.rappelle; }).length;
    var identiques = journal.filter(function (j) { return j.identique; }).length;
    console.log('═'.repeat(76));
    console.log('  LES PLUGINS QUI SE MARCHENT DESSUS');
    console.log('═'.repeat(76));
    console.log('  ' + journal.length + ' fonctions du moteur modifiées par les plugins, dont ' +
        remplacements + ' remplacées sans rappel de la version d\'avant');
    console.log('  ' + identiques + ' redéclarations mot pour mot d\'une même petite fonction (rien de perdu)');
    console.log('  ' + ecrasees.length + ' remplacent la modification d\'un AUTRE plugin — ' +
        (ecrasees.length - nouveaux.length) + ' relues à la main et voulues (liste RELUS)\n');
    if (!nouveaux.length) console.log('  ✅ aucune nouvelle — aucun plugin n\'efface le travail d\'un autre');
    else console.log('  ⚠ ' + nouveaux.length + ' à relire :\n');
    Object.keys(parVictime).sort().forEach(function (v) {
        console.log('  ■ ' + v + ' perd :');
        parVictime[v].forEach(function (j) {
            console.log('      ' + j.cle.padEnd(56) + ' ← ' + j.par + ' (' + j.lignes + ' l.)');
            if (TOUT) {
                console.log('        AVANT : ' + j.srcAvant.replace(/\s+/g, ' ').slice(0, 300));
                console.log('        APRÈS : ' + j.src.replace(/\s+/g, ' ').slice(0, 300));
            }
        });
    });
    if (TOUT) {
        console.log('\n  ── relues ──');
        ecrasees.filter(function (j) { return RELUS[j.cle + ' ← ' + j.par]; }).forEach(function (j) {
            console.log('   ' + (j.cle + ' ← ' + j.par).padEnd(74) + ' ' + RELUS[j.cle + ' ← ' + j.par]);
        });
    }
    if (erreurs.length) { console.log('\n  erreurs au chargement : ' + erreurs.length); erreurs.slice(0, 5).forEach(function (e) { console.log('    ' + e); }); }
    console.log('═'.repeat(76));
    process.exit(nouveaux.length || erreurs.length ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });

// Relues le 2026-10-02, une par une, dans le code des deux plugins.
var YANFLY = 'Yanfly réécrit ici sa propre version (plugins conçus pour s\'enchaîner dans cet ordre)';
var RELUS = {
    'Scene_Boot.prototype.isGameFontLoaded ← YEP_X_CoreUpdatesOpt': YANFLY,
    'Game_Battler.prototype.onTurnEnd ← YEP_BattleEngineCore': YANFLY,
    'BattleManager.displayStartMessages ← YEP_BattleEngineCore': YANFLY,
    'BattleManager.processEscape ← YEP_BattleEngineCore': YANFLY,
    'Window_SkillList.prototype.drawSkillCost ← YEP_SkillCore': YANFLY,
    'Window_Base.prototype.textWidthEx ← YEP_MessageCore': YANFLY,
    'Window_Base.prototype.textWidthEx ← YEP_SaveCore': 'même mesure, dessinée une ligne plus haut mais toujours hors du cadre',
    'Game_Enemy.prototype.skills ← YEP_BattleAICore': YANFLY,
    'Game_Unit.prototype.refreshMembers ← YEP_AutoPassiveStates': YANFLY,
    'BattleManager.processVictory ← YEP_VictoryAftermath': YANFLY,
    'Game_Troop.prototype.allMembers ← YEP_BuffsStatesCore': YANFLY,
    'Game_Battler.prototype.hasState ← YEP_BuffsStatesCore': YANFLY,
    'Game_Actor.prototype.convertInitEquips ← YEP_EquipCore': YANFLY,
    'Game_Actor.prototype.grabInitEquips ← YEP_EquipCore': YANFLY,
    'SceneManager.updateMain ← YEP_FpsSynchOption': YANFLY,
    'Game_Event.prototype.updateSelfMovement ← YEP_EventChasePlayer': 'rappelle la version d\'avant depuis updateChaseMovement',
    'Game_Actor.prototype.isSpriteVisible ← MOG_Theatrhythm': 'combat de côté : même réponse que Yanfly (vrai)',
    'SceneManager.preferableRendererType ← Community_Basic': 'Community_Basic choisit le rendu selon ses réglages',
    'SceneManager.catchException ← Olivia_AntiPlayerStress': 'écran d\'erreur d\'Olivia, voulu',
    'Graphics.printFullError ← Olivia_AntiPlayerStress': 'écran d\'erreur d\'Olivia, voulu',
    'Graphics._makeFullErrorHtml ← Olivia_AntiPlayerStress': 'écran d\'erreur d\'Olivia, voulu',
    'Graphics.processErrorStackMessage ← Olivia_AntiPlayerStress': 'écran d\'erreur d\'Olivia, voulu',
    'BattleManager.processEscape ← Olivia_AntiPlayerStress': 'réglage « Escape Always » : la fuite réussit toujours, voulu',
    'Bitmap.prototype.drawText ← Aries002_SystemCustomiser': 'même dessin que Yanfly, avec le contour réglable d\'Aries',
    'Window_Base.prototype.standardBackOpacity ← Aries002_SystemCustomiser': 'opacité des fenêtres réglée par Aries',
    'Window_EquipStatus.prototype.drawCurrentParam ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Window_EquipStatus.prototype.drawNewParam ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Window_EquipStatus.prototype.drawNewParam ← VisualMaxEX2': 'reprend le dessin de TSR, avec le compteur animé et l\'écart (+n)',
    'Scene_Equip.prototype.createStatusWindow ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Scene_Equip.prototype.createItemWindow ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Scene_Equip.prototype.refreshActor ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Scene_Equip.prototype.onSlotOk ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Scene_Equip.prototype.onItemOk ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Scene_Equip.prototype.onItemCancel ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Scene_Equip.prototype.onActorChange ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Window_EquipItem.prototype.maxCols ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Window_EquipItem.prototype.setSlotId ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Window_EquipItem.prototype.includes ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Window_EquipItem.prototype.isEnabled ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Window_EquipItem.prototype.drawItem ← TSR_EquipSlots': 'TSR est écrit pour remplacer l\'écran de Yanfly',
    'Scene_Map.prototype.createTimeStatus ← MOG_TimeSystem_Hud': 'le HUD de l\'horloge remplace la fenêtre du temps sur la carte (prévu par MOG)',
    'Window_MusicComp.prototype.refresh ← TexteQuiTient': 'même compteur, aligné sur la vraie largeur du cadre (la parenthèse était rognée)',
    'Game_Actor.prototype.shouldDisplayLevelUp ← GALV_ManualLevel': 'niveau manuel : la victoire n\'annonce plus de montée automatique, voulu'
};
