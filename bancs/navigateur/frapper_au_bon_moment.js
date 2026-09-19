/*
 * FRAPPER AU BON MOMENT, ESQUIVER AU BON MOMENT
 * ---------------------------------------------------------------------------
 * JOKO : « Les attaques chronométrées + défense active oui avec plaisir ».
 *
 * Les dix plugins sont branchés. Branchés ne veut pas dire vivants : ils ne
 * se déclenchent que sur une compétence portant une balise, et les notes des
 * compétences appartiennent à JOKO. Ce banc ne touche donc à AUCUN fichier :
 * il pose la balise EN MÉMOIRE, le temps de l'essai, et la retire.
 *
 * Ce qu'il mesure vraiment :
 *   · les six façons de minuter démarrent-elles en combat ;
 *   · la puissance ($gameTemp.tas_power) change-t-elle selon qu'on appuie
 *     bien ou mal — sinon le minutage est un décor, pas une mécanique ;
 *   · la défense active existe-t-elle, et les images dessinées se
 *     chargent-elles sans « Loading Error ».
 *
 * ⚠ Le contrôle qui compte est le DEUXIÈME : un banc qui vérifie seulement
 *   que la fenêtre s'ouvre dirait « ça marche » d'un jeu où appuyer ne sert
 *   à rien. On appuie donc deux fois, bien et mal, et les deux puissances
 *   doivent différer.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/frapper_au_bon_moment.js
 */
'use strict';
var { chromium } = require('playwright');
var path = require('path');
var SHOTS = path.join(__dirname, 'captures') + path.sep;
require('fs').mkdirSync(SHOTS, { recursive: true });
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [], absents = [];
    page.on('pageerror', function (e) { erreurs.push('PAGEERROR: ' + e.message.slice(0, 140)); });
    page.on('console', function (m) { if (m.type() === 'error') { erreurs.push('CONSOLE: ' + m.text().slice(0, 140)); } });
    page.on('response', function (r) { if (r.status() >= 400) { absents.push(r.url().replace(BASE, '')); } });

    var ok = 0, ko = 0;
    var V = function (l, c, d) {
        if (c) { ok++; console.log('   OK  ' + l + (d ? '  — ' + d : '')); }
        else { ko++; console.log('   KO  ' + l + (d ? '  — ' + d : '')); }
    };
    var ev = function (f, a) { return page.evaluate(f, a); };
    var photo = async function (n) { await page.screenshot({ path: SHOTS + n + '.png' }); console.log('   [capture] ' + n); };
    var pause = function (ms) { return page.waitForTimeout(ms); };

    console.log('=== FRAPPER AU BON MOMENT ===\n');
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 120000 });
    await pause(700);

    console.log('1) Les dix plugins sont-ils vivants ?');
    var vie = await ev(function () {
        return {
            socle: typeof SRD !== 'undefined' && !!SRD.TimedAttack,
            // l'espace s'appelle ActiveDefenseCore, pas ActiveDefense
            defense: typeof SRD !== 'undefined' && !!SRD.ActiveDefenseCore,
            importes: Object.keys(Imported || {}).filter(function (k) {
                return /Timed Attack|Active Defense/.test(k);
            }),
            versionSocle: (Imported || {})['SumRndmDde Timed Attack Core'],
            vueDeCote: $dataSystem.optSideView
        };
    });
    V('le socle du minutage est chargé', vie.socle === true);
    V('le socle de la défense active est chargé', vie.defense === true);
    V('les dix sont importés', vie.importes.length === 10, vie.importes.length + ' : ' + vie.importes.join(', ').slice(0, 90));
    V('la vue de côté est active (sans elle la défense ne fait rien)', vie.vueDeCote === true);
    /* ⚠ le garde de version : sous 1.20, Arrows et Circle remplacent
     *   DataManager.setupNewGame par une fausse carte « mets à jour », ce qui
     *   tuerait le lever de saison. On vérifie que le socle est au-dessus. */
    V('le socle est en 1.20 ou plus (sinon les saisons sautent)',
        vie.versionSocle >= 1.20, 'version ' + vie.versionSocle);

    console.log('\n2) Les images dessinées se chargent-elles ?');
    var img = await ev(function () {
        var noms = ['Ring', 'Target', 'ZX', 'Arrows', 'DefaultBackground'];
        return new Promise(function (res) {
            var out = {};
            noms.forEach(function (n) { out[n] = SRD.TimedAttack.loadImage(n); });
            setTimeout(function () {
                var r = {};
                noms.forEach(function (n) { r[n] = out[n].isReady() ? (out[n].width + '×' + out[n].height) : 'PAS CHARGÉE'; });
                res(r);
            }, 2500);
        });
    });
    Object.keys(img).forEach(function (n) { console.log('      ' + n.padEnd(20) + img[n]); });
    V('les cinq images se chargent', Object.keys(img).every(function (n) { return img[n] !== 'PAS CHARGÉE'; }),
        Object.keys(img).filter(function (n) { return img[n] === 'PAS CHARGÉE'; }).join(', ') || 'les cinq');
    V('la planche ZX se découpe en deux cases carrées', img.ZX === '96×48');
    V('la planche des flèches se découpe en quatre cases carrées', img.Arrows === '192×48');

    console.log('\n3) En combat, avec une balise posée EN MÉMOIRE (aucun fichier touché)');
    await ev(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () {
        return SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Map'
            && !SceneManager.isSceneChanging();
    }, null, { timeout: 40000 });
    await pause(1500);
    await ev(function () { BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle); });
    await page.waitForFunction(function () {
        return SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Battle';
    }, null, { timeout: 40000 });
    await pause(3500);

    /* On choisit une compétence d'attaque simple appartenant au premier héros,
     * et on lui pose la balise à la volée. La note d'origine est gardée pour
     * être remise : ce banc ne doit rien laisser derrière lui. */
    var prepare = await ev(function () {
        var acteur = $gameParty.members()[0];
        var comp = acteur.skills().filter(function (s) {
            return s && s.damage && s.damage.type === 1 && s.scope === 1;
        })[0] || acteur.skills()[0] || $dataSkills[1];
        window.__noteOrigine = { id: comp.id, note: comp.note, meta: comp.meta['SRD TAS'] };
        return { id: comp.id, nom: comp.name, acteur: acteur.name() };
    });
    console.log('      cobaye : « ' + prepare.nom +' » (n°' + prepare.id + ') de ' + prepare.acteur);

    /** Pose la balise et lance le minutage EXACTEMENT comme le fait le moteur.
     *
     *  ⚠ Première version fausse : je passais la COMPÉTENCE à setItem(), qui
     *    attend l'objet de la balise — `skill.meta["SRD TAS"]`. Résultat,
     *    `item.type` valait undefined, rien ne démarrait, et le banc disait
     *    « ne démarre pas » d'un système qui n'avait jamais été appelé.
     *    Le moteur, lui, fait dans BattleManager.updatePhase :
     *        setItem(action.item().meta["SRD TAS"]) · open() · start()
     */
    async function essayer(facon) {
        await ev(function (a) {
            var s = $dataSkills[a.id];
            s.note = '<Timed Attack: ' + a.facon + '>\n<End Timed Attack>';
            SRD.TimedAttack.loadNotetagsSkills($dataSkills);
            $gameTemp.tas_power = -1;          // sentinelle : personne n'écrit -1
            var acteur = $gameParty.members()[0];
            var action = new Game_Action(acteur);
            action.setSkill(a.id);
            acteur.setAction(0, action);
            BattleManager._subject = acteur;
            BattleManager._action = action;
            var t = SceneManager._scene._tasAttack;
            t.setItem(s.meta['SRD TAS']);
            t.open();
            t.start();
        }, { id: prepare.id, facon: facon });
        await pause(1400);
        return await ev(function () {
            var t = SceneManager._scene._tasAttack;
            return {
                type: t ? t._type : null,
                enfants: t ? t.children.length : 0,
                puissance: $gameTemp.tas_power
            };
        });
    }

    var facons = ['default', 'wheel', 'circle', 'clock', 'mash', 'arrows'];
    var demarrees = [];
    for (var i = 0; i < facons.length; i++) {
        var r = await essayer(facons[i]);
        var vivant = r.type === facons[i];
        if (vivant) { demarrees.push(facons[i]); }
        console.log('      ' + facons[i].padEnd(10) + (vivant ? 'démarre' : 'ne démarre pas') +
            '   type lu : ' + r.type + '   ' + r.enfants + ' élément(s) à l\'écran');
        if (facons[i] === 'wheel') { await photo('minutage_roue'); }
        if (facons[i] === 'clock') { await photo('minutage_horloge'); }
    }
    V('les six façons de minuter démarrent', demarrees.length === 6,
        demarrees.join(' · ') + (demarrees.length < 6 ? '  (manquent : ' +
            facons.filter(function (f) { return demarrees.indexOf(f) < 0; }).join(', ') + ')' : ''));

    console.log('\n4) LE CONTRÔLE QUI COMPTE : appuyer change-t-il quelque chose ?');
    /* On joue le martèlement : c'est la seule façon dont le résultat dépend
     * d'un nombre d'appuis, donc la seule qu'un banc peut jouer « bien » et
     * « mal » de façon reproductible. Les autres dépendent d'un instant. */
    /* ⚠ Deuxième piège, et celui-là aurait fait passer le banc au vert pour
     *   rien : `tas_power` vaut 1 par défaut — BattleManager.endAction le
     *   remet à 1 après chaque action. Lire cette valeur après coup, c'est
     *   lire le repli du moteur, pas le résultat du martèlement. Ma première
     *   version annonçait « 40 coups → 1 » alors que le jeu n'avait même pas
     *   démarré.
     *   On pose donc une sentinelle à -1 que personne d'autre n'écrit, et on
     *   SURVEILLE la valeur pendant que le jeu tourne, au lieu de la cueillir
     *   à la fin. */
    /* ⚠ Troisième piège : le martèlement dure CINQ secondes et n'écrit sa
     *   puissance qu'à la toute fin. Guetter `tas_power` pendant la partie ne
     *   donne rien, et la lire après, c'est lire le repli. On surveille donc
     *   la JAUGE elle-même — c'est le symptôme : taper doit la faire monter.
     *   Et on compare toujours deux fois, avec et sans marteler : si les deux
     *   donnent la même chose, ce n'est pas le plugin qui est en cause, c'est
     *   que mes touches n'arrivent pas, et il faut le savoir. */
    await page.mouse.click(408, 500);   // rendre le clavier au jeu
    async function marteler(coups) {
        var lance = await ev(function (a) {
            var s = $dataSkills[a.id];
            s.note = '<Timed Attack: mash>\n<End Timed Attack>';
            SRD.TimedAttack.loadNotetagsSkills($dataSkills);
            $gameTemp.tas_power = -1;
            var acteur = $gameParty.members()[0];
            var action = new Game_Action(acteur);
            action.setSkill(a.id);
            acteur.setAction(0, action);
            BattleManager._subject = acteur;
            BattleManager._action = action;
            var t = SceneManager._scene._tasAttack;
            t.setItem(s.meta['SRD TAS']);
            t.open();
            t.start();
            window.__jauge = [];
            window.__guet = setInterval(function () {
                var w = SceneManager._scene._tasAttack;
                window.__jauge.push({
                    x: w._xPosition, max: w._maxPosition,
                    p: $gameTemp.tas_power, s: w._seconds
                });
            }, 40);
            return { type: t._type, depart: t._xPosition, max: t._maxPosition };
        }, { id: prepare.id });
        await pause(400);
        for (var k = 0; k < coups; k++) {
            await page.keyboard.down('z'); await page.waitForTimeout(20);
            await page.keyboard.up('z'); await page.waitForTimeout(20);
        }
        await pause(5200);   // les cinq secondes du jeu, et de quoi finir
        var r = await ev(function () {
            clearInterval(window.__guet);
            var j = window.__jauge;
            var hautes = j.map(function (e) { return e.x; });
            var puissances = j.map(function (e) { return e.p; }).filter(function (p) { return p !== -1; });
            return {
                pointe: hautes.length ? Math.max.apply(null, hautes) : null,
                puissance: puissances.length ? puissances[puissances.length - 1] : null,
                releves: j.length
            };
        });
        return { type: lance.type, depart: lance.depart, max: lance.max, pointe: r.pointe, puissance: r.puissance, releves: r.releves };
    }
    var mou = await marteler(0);
    var fort = await marteler(60);
    console.log('      sans marteler → jauge ' + mou.depart + ' → ' + mou.pointe + ' / ' + mou.max + '   puissance ' + mou.puissance);
    console.log('      60 coups      → jauge ' + fort.depart + ' → ' + fort.pointe + ' / ' + fort.max + '   puissance ' + fort.puissance);
    V('le jeu de martèlement démarre bien', mou.type === 'mash' && fort.type === 'mash',
        mou.type + ' / ' + fort.type);
    V('marteler fait monter la jauge', fort.pointe > mou.pointe,
        fort.pointe + ' > ' + mou.pointe +
        (fort.pointe === mou.pointe ? '  ← soit le plugin ignore la touche, soit mes touches n\'arrivent pas' : ''));
    V('marteler donne plus de puissance', fort.puissance > mou.puissance,
        fort.puissance + ' > ' + mou.puissance);
    V('la puissance reste entre 0 et 1',
        fort.puissance !== null && fort.puissance >= 0 && fort.puissance <= 1, String(fort.puissance));
    await photo('minutage_martelement');

    console.log('\n5) LA QUESTION QUI DÉCIDE DE TOUT : le minutage change-t-il les dégâts ?');
    /* Le plugin ne touche PAS aux dégâts tout seul. Il pose une valeur dans
     * $gameTemp.tas_power, et c'est à la FORMULE de la compétence de s'en
     * servir :  (a.atk * 4 - b.def * 2) * $gameTemp.tas_power
     * Sans ça, réussir ou rater son minutage donne exactement le même coup —
     * un décor, pas une mécanique. On le mesure au lieu de le supposer. */
    /* ⚠ Les essais de martèlement durent une trentaine de secondes, et le
     *   combat, lui, continue de tourner en CTB : il s'est terminé entre-temps
     *   et il ne restait plus un ennemi à frapper. On en relance un propre. */
    var vivant = await ev(function () {
        return SceneManager._scene.constructor.name === 'Scene_Battle'
            && $gameTroop && $gameTroop.members().length > 0
            && $gameTroop.members().some(function (e) { return e.isAlive(); });
    });
    if (!vivant) {
        console.log('      (le combat précédent s\'est terminé — on en relance un)');
        await ev(function () { SceneManager.goto(Scene_Map); });
        await page.waitForFunction(function () {
            return SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Map'
                && !SceneManager.isSceneChanging();
        }, null, { timeout: 40000 });
        await pause(1200);
        await ev(function () { BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle); });
        await page.waitForFunction(function () {
            return SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Battle'
                && $gameTroop.members().length > 0;
        }, null, { timeout: 40000 });
        await pause(2200);
    }
    var degats = await ev(function (a) {
        var acteur = $gameParty.members()[0];
        var cible = $gameTroop.members().filter(function (e) { return e.isAlive(); })[0]
            || $gameTroop.members()[0];
        var s = $dataSkills[a.id];
        var formuleOrigine = s.damage.formula;

        function frapper(puissance) {
            $gameTemp.tas_power = puissance;
            var act = new Game_Action(acteur);
            act.setSkill(a.id);
            // on calcule sans appliquer, pour ne rien casser au combat en cours
            return Math.floor(act.evalDamageFormula(cible));
        }
        var telQuel = { fort: frapper(1), faible: frapper(0.25) };

        // et la même compétence si sa formule tenait compte du minutage
        s.damage.formula = '(' + formuleOrigine + ') * $gameTemp.tas_power';
        var avecMinutage = { fort: frapper(1), faible: frapper(0.25) };
        s.damage.formula = formuleOrigine;           // remis tout de suite

        return {
            formule: formuleOrigine,
            telQuel: telQuel,
            avecMinutage: avecMinutage,
            remise: s.damage.formula === formuleOrigine
        };
    }, { id: prepare.id });
    console.log('      formule de « ' + prepare.nom + ' » : ' + degats.formule);
    console.log('      telle quelle        parfait ' + degats.telQuel.fort + '   raté ' + degats.telQuel.faible);
    console.log('      si elle lisait le minutage   parfait ' + degats.avecMinutage.fort + '   raté ' + degats.avecMinutage.faible);
    V('sans toucher à la formule, réussir ou rater donne le MÊME coup',
        degats.telQuel.fort === degats.telQuel.faible,
        degats.telQuel.fort + ' = ' + degats.telQuel.faible + ' → le minutage est un décor tant que la formule l\'ignore');
    V('si la formule le lit, rater coûte vraiment',
        degats.avecMinutage.faible < degats.avecMinutage.fort,
        degats.avecMinutage.faible + ' < ' + degats.avecMinutage.fort);
    V('la formule d\'origine est remise', degats.remise === true, degats.formule);

    console.log('\n6) La défense active');
    var def = await ev(function () {
        return {
            objet: typeof $ActiveDefense !== 'undefined',
            puissance: typeof $ActiveDefense !== 'undefined' ? $ActiveDefense.power : null,
            facons: typeof SRD !== 'undefined' && SRD.ActiveDefense ?
                Object.keys(SRD.ActiveDefense).filter(function (k) { return /jump|charge/i.test(k); }) : []
        };
    });
    V('l\'objet $ActiveDefense existe en combat', def.objet === true, 'puissance ' + def.puissance);

    /* La balise de défense se pose sur la compétence de l'ENNEMI : c'est son
     * attaque qu'on esquive. On la pose en mémoire, on vérifie qu'elle est
     * lue, et on la retire. */
    var lue = await ev(function () {
        var ennemi = $gameTroop.members()[0];
        var comp = ennemi.enemy().actions[0] ? $dataSkills[ennemi.enemy().actions[0].skillId] : $dataSkills[1];
        var avant = comp.note;
        comp.note = '<Active Defense: jump>\n<End Active Defense>';
        // ⚠ le lecteur s'appelle loadSkills ici, pas loadNotetagsSkills :
        //   deux plugins du même auteur, deux noms. J'avais deviné au lieu
        //   de regarder, et le banc est mort sur « undefined ».
        SRD.ActiveDefenseCore.loadSkills($dataSkills);
        var cle = Object.keys(comp.meta).filter(function (k) { return /ADS|Active/i.test(k); })[0];
        var pose = !!cle;
        var type = pose ? comp.meta[cle].type : null;
        comp.note = avant;               // on remet tout de suite
        if (cle) { delete comp.meta[cle]; }
        return { nom: comp.name, pose: pose, type: type, cle: cle || '(aucune)', remise: comp.note === avant };
    }).catch(function (e) { return { erreur: String(e).slice(0, 80) }; });
    if (lue.erreur) {
        V('la balise d\'esquive est lue sur une compétence d\'ennemi', false, lue.erreur);
    } else {
        console.log('      compétence d\'ennemi : « ' + lue.nom + ' »');
        V('la balise d\'esquive est lue', lue.pose === true, 'type : ' + lue.type);
        V('la note de l\'ennemi est remise comme avant', lue.remise === true);
    }

    console.log('\n7) On ne laisse rien derrière');
    var propre = await ev(function () {
        var o = window.__noteOrigine;
        $dataSkills[o.id].note = o.note;
        if (o.meta === undefined) { delete $dataSkills[o.id].meta['SRD TAS']; }
        else { $dataSkills[o.id].meta['SRD TAS'] = o.meta; }
        return {
            note: $dataSkills[o.id].note,
            balise: !!$dataSkills[o.id].meta['SRD TAS'],
            attendue: o.meta !== undefined
        };
    });
    V('la compétence retrouve sa note d\'origine', propre.note === '' || propre.note.indexOf('Timed Attack') < 0,
        propre.note ? propre.note.slice(0, 40) : '(note vide, comme avant)');
    V('aucune balise de minutage ne reste posée', propre.balise === propre.attendue);

    console.log('\n8) Le bilan');
    var horsNWjs = erreurs.filter(function (e) { return /process is not defined/.test(e); });
    var vraies = erreurs.filter(function (e) { return !/process is not defined/.test(e); });
    if (horsNWjs.length) { console.log('   (' + horsNWjs.length + ' « process is not defined » : propre au navigateur, mis de côté)'); }
    V('aucune erreur JavaScript', vraies.length === 0, vraies.slice(0, 3).join(' | ') || 'rien');
    V('aucun fichier introuvable', absents.length === 0, absents.slice(0, 4).join(' | ') || 'rien');

    console.log('\n' + '='.repeat(66));
    console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
    console.log('='.repeat(66));
    await nav.close();
    process.exit(ko ? 1 : 0);
})();
