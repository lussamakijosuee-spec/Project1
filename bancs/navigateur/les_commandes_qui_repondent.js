/*
 * BANC NAVIGATEUR — LES COMMANDES QUI RÉPONDENT, ET L'ÉQUIPEMENT QU'ON PEUT
 * ENFIN ATTEINDRE
 * ---------------------------------------------------------------------------
 * CE BANC EXISTE PARCE QU'UNE COMMANDE MORTE NE FAIT PAS D'ERREUR.
 *
 * MV appelle `Game_Interpreter.prototype.pluginCommand`. Si aucun greffon ne
 * reconnaît le nom, la chaîne d'alias se déroule jusqu'à la fonction vide du
 * moteur, et c'est tout : pas d'exception, pas de ligne rouge, rien. Le joueur
 * lit « Te reposer ? », répond oui, et se relève aussi fatigué.
 *
 * C'est comme ça que 98 commandes sur 414 — presque une sur quatre — sont
 * restées sans répondant pendant toute la vie du projet.
 *
 * ── CE QU'ON MESURE, ET COMMENT ────────────────────────────────────────────
 *
 * Trois audits de ce projet se sont trompés en LISANT le code des greffons
 * (voir bancs/navigateur/les_tags_vus_par_le_moteur.js). Ici on ne lit rien :
 * on charge le jeu, on lance la commande, et on regarde ce qui a bougé dans
 * l'état du moteur. Une commande qui répond laisse une trace.
 *
 *     FEU repos       →  les PV remontent, et $gameSystem._feuDAme existe
 *     TEMPS basculer  →  $gameSystem.hour() a changé de moitié de journée
 *     CHUTE bete      →  l'interrupteur 97 est levé
 *     AME set …       →  la variable de la jauge vaut ce qu'on a demandé
 *     MARCHAND 3      →  Scene_Shop est empilée, avec un stock chiffré
 *
 * ── ET LES CONTRE-ÉPREUVES ─────────────────────────────────────────────────
 *
 * §6 : « le contrôle doit attraper le vrai coupable ET innocenter les faux ».
 * On lance donc aussi des commandes dont on SAIT qu'elles ne répondent pas
 * (« MARQUE », « PLIPLOP ») : si le banc les trouve vivantes, c'est le banc
 * qui ment.
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

var vert = 0, rouge = 0;
function ok(nom, cond, detail) {
    if (cond) { vert++; console.log('   ✓ ' + nom + (detail ? '   ' + detail : '')); }
    else { rouge++; console.log('   ✗ ' + nom + (detail ? '   ' + detail : '')); }
}

(async function () {
    var nav = await chromium.launch({
        args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio']
    });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.split('\n')[0]); });

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () {
        var s = SceneManager._scene;
        return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen();
    }, null, { timeout: 180000 });

    console.log('\n── LE CHARGEMENT ' + '─'.repeat(56));
    ok('aucune erreur JavaScript au titre', erreurs.length === 0, erreurs.slice(0, 2).join(' | '));

    // Nouvelle partie : il faut $gameSystem, $gameParty, $gameSwitches.
    await page.evaluate(function () {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    });
    await page.waitForFunction(function () {
        return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging() && !!$gameParty;
    }, null, { timeout: 120000 });

    var r = await page.evaluate(function () {
        var out = {};

        // ⚠ On ne fabrique PAS d'interprète nu : `YEP_PictureSpritesheets` lit
        //   `this._params[0]`, et un interprète sans paramètres le fait
        //   planter. On passe par le chemin du moteur — `command356` — avec
        //   l'interprète de la carte, exactement comme un événement le ferait.
        function lancer(ligne) {
            var i = $gameMap._interpreter;
            i._params = [String(ligne)];
            i.command356();
        }
        out.lancer = true;

        // ── les greffons sont-ils là ? ──────────────────────────────────────
        out.greffons = {
            EvenementsUtiles: typeof window.EvenementsUtiles === 'object',
            LeMarchandQuiSuit: typeof window.LeMarchandQuiSuit === 'object',
            // JadeEntitePlunging n'expose rien dans window : on le reconnaît à
            // ce qu'il fait, pas à ce qu'il déclare.
            VieDuVillage: typeof window.VieDuVillage === 'object'
        };

        // ── FEU repos ───────────────────────────────────────────────────────
        $gameParty.members().forEach(function (m) { m.setHp(1); m.setMp(0); });
        var avantPV = $gameParty.members().map(function (m) { return m.hp; });
        lancer('FEU repos');
        out.feu = {
            avant: avantPV,
            apres: $gameParty.members().map(function (m) { return m.hp; }),
            pleins: $gameParty.members().every(function (m) { return m.hp === m.mhp; }),
            point: !!($gameSystem && $gameSystem._feuDAme),
            carte: $gameSystem._feuDAme ? $gameSystem._feuDAme.carte : null
        };

        // ── TEMPS ───────────────────────────────────────────────────────────
        out.temps = { possible: typeof $gameSystem.set_hour === 'function' };
        if (out.temps.possible) {
            lancer('TEMPS jour');
            out.temps.jour = $gameSystem.hour();
            lancer('TEMPS nuit');
            out.temps.nuit = $gameSystem.hour();
            lancer('TEMPS basculer');
            out.temps.apresBascule = $gameSystem.hour();
        }

        // ── CHUTE ───────────────────────────────────────────────────────────
        [95, 96, 97, 98, 99].forEach(function (s) { $gameSwitches.setValue(s, false); });
        lancer('CHUTE bete 2');
        out.chute = { bete97: $gameSwitches.value(97), autres: [95, 96, 98, 99].map(function (s) { return $gameSwitches.value(s); }) };
        lancer('CHUTE fond');
        out.chute.fond99 = $gameSwitches.value(99);
        lancer('CHUTE calme');
        out.chute.apresCalme = [95, 96, 97, 98, 99].map(function (s) { return $gameSwitches.value(s); });

        // ── AME (JadeEntitePlunging, réinscrit) ─────────────────────────────
        // 21 commandes des cartes de JOKO l'appellent. La jauge est v11..v15.
        $gameVariables.setValue(11, 0);
        lancer('AME set thylane 7');
        out.ame = { apresSet: $gameVariables.value(11) };
        lancer('AME bon thylane 2');
        out.ame.apresBon = $gameVariables.value(11);
        lancer('AME mauvais thylane 3');
        out.ame.apresMauvais = $gameVariables.value(11);

        // ── MARCHAND ────────────────────────────────────────────────────────
        out.marchand = { recensement: window.LeMarchandQuiSuit ? window.LeMarchandQuiSuit.recensement() : null };
        // Ce qui a un prix est vendable ; un prix à 0 veut dire « ne se vend
        // pas » — butin de boss, arme d'histoire. Le dernier palier doit donc
        // couvrir exactement ceux-là, ni plus ni moins.
        function aUnPrix(liste, itemsSeuls) {
            return liste.filter(function (o) {
                return o && String(o.name || '').trim() && o.price > 0
                    && (!itemsSeuls || o.itypeId === 1);
            }).length;
        }
        out.marchand.vendables = {
            armes: aUnPrix($dataWeapons, false),
            armures: aUnPrix($dataArmors, false),
            objets: aUnPrix($dataItems, true)
        };
        var avantScene = SceneManager._nextScene;
        lancer('MARCHAND 3');
        out.marchand.pousseUneBoutique = !!(SceneManager._nextScene && SceneManager._nextScene instanceof Scene_Shop);
        SceneManager._nextScene = avantScene;      // on n'y va pas vraiment

        // ── LES CONTRE-ÉPREUVES ─────────────────────────────────────────────
        // « MARQUE » et un nom inventé : rien ne doit bouger.
        var temoinSw = [95, 96, 97, 98, 99].map(function (s) { return $gameSwitches.value(s); });
        var temoinV = $gameVariables.value(11);
        var temoinPV = $gameParty.members().map(function (m) { return m.hp; });
        lancer('MARQUE');
        lancer('PLIPLOP quelque chose');
        out.contre = {
            switchsIdentiques: JSON.stringify(temoinSw) === JSON.stringify([95, 96, 97, 98, 99].map(function (s) { return $gameSwitches.value(s); })),
            varIdentique: temoinV === $gameVariables.value(11),
            pvIdentiques: JSON.stringify(temoinPV) === JSON.stringify($gameParty.members().map(function (m) { return m.hp; }))
        };

        // ── L'ÉQUIPEMENT : qui peut porter quoi ─────────────────────────────
        // On demande au moteur, acteur par acteur : canEquip().
        var acteurs = [1, 2, 3, 4, 6, 7].map(function (i) { return $gameActors.actor(i); }).filter(Boolean);
        function personne(liste) {
            var out = [];
            liste.forEach(function (o) {
                if (!o || !String(o.name || '').trim()) { return; }
                if (!acteurs.some(function (a) { return a.canEquip(o); })) { out.push(o.id + ' ' + o.name); }
            });
            return out;
        }
        out.equip = {
            armesOrphelines: personne($dataWeapons),
            armuresOrphelines: personne($dataArmors),
            vesperSang: $gameActors.actor(1).canEquip($dataWeapons[160]),
            vesperArmureSang: $gameActors.actor(1).canEquip($dataArmors[57]),
            ludwingOmbre: $gameActors.actor(3).canEquip($dataWeapons[509])
        };

        // ── LES ÉVÉNEMENTS COMMUNS ──────────────────────────────────────────
        out.ce = {
            nouveaux: [],
            ce17: null, ce18: null
        };
        for (var id = 210; id <= 234; id++) {
            var e = $dataCommonEvents[id];
            out.ce.nouveaux.push({
                id: id,
                nom: e ? e.name : null,
                cmd: e ? e.list.filter(function (c) { return c.code !== 0; }).length : 0
            });
        }
        var c17 = $dataCommonEvents[17];
        out.ce.ce17 = c17 ? JSON.stringify(c17.list[1].parameters) : null;
        var c18 = $dataCommonEvents[18];
        out.ce.ce18 = c18 ? c18.list.filter(function (c) { return c.code === 117; }).map(function (c) { return c.parameters[0]; }) : null;

        // ── LES TROIS RELIQUES ──────────────────────────────────────────────
        // On ne lit pas le code : on frappe, et on regarde ce qui a changé.
        var h = $gameActors.actor(1);
        out.reliques = {
            lecture: [47, 48, 50].map(function (i) {
                return { id: i, relic: $dataArmors[i].meta ? String($dataArmors[i].meta.Relic || '').trim() : null };
            })
        };

        function sansReliques() {
            // On vide l'emplacement Accessoire (etypeId 5, index 4).
            h.changeEquip(4, null);
        }
        function avecRelique(id) {
            $gameParty.gainItem($dataArmors[id], 1);
            h.changeEquip(4, $dataArmors[id]);
            return h.equips().some(function (e) { return e && e.id === id && e.etypeId === 5; });
        }

        // ⚠ LA VARIANCE FAUSSE TOUT.
        //   MV tire ±20 % au hasard sur chaque coup (`applyVariance`). Comparer
        //   deux coups isolés, c'est mesurer le dé, pas la relique : la
        //   première version de ce contrôle a annoncé « ×1,23 » pour un bonus
        //   de 50 %, et « +5,7 % » là où il n'y avait rien du tout.
        //   On neutralise le dé le temps de la mesure, et on le remet après.
        var _variance = Game_Action.prototype.applyVariance;
        Game_Action.prototype.applyVariance = function (damage) { return damage; };

        function frappe(cible) {
            var act = new Game_Action(h);
            act.setSkill(1);                       // l'attaque de base
            return act.makeDamageValue(cible, false);
        }

        // #48 — « +50% de dégâts quand tes PV sont sous 30% »
        var cible = new Game_Enemy(1, 0, 0);
        h.setHp(h.mhp);
        sansReliques();
        var refPleineVie = frappe(cible);
        h.setHp(Math.floor(h.mhp * 0.20));
        var refBasseVie = frappe(cible);
        out.reliques.equipee48 = avecRelique(48);
        var avecBasseVie = frappe(cible);
        h.setHp(h.mhp);
        var avecPleineVie = frappe(cible);
        out.reliques.desespoir = {
            refBasse: refBasseVie, avecBasse: avecBasseVie,
            refPleine: refPleineVie, avecPleine: avecPleineVie
        };
        Game_Action.prototype.applyVariance = _variance;   // on remet le dé

        // #47 — « Vole 20% des dégâts infligés en PV »
        sansReliques();
        out.reliques.equipee47 = avecRelique(47);
        h.setHp(1);
        var cible2 = new Game_Enemy(1, 0, 0);
        cible2.setHp(cible2.mhp);
        var act2 = new Game_Action(h);
        act2.setSkill(1);
        act2.executeHpDamage(cible2, 500);
        out.reliques.vol = { pvApres: h.hp, attendu: 1 + Math.floor(500 * 0.20) };
        // contre-épreuve : sans la relique, rien n'est volé
        sansReliques();
        h.setHp(1);
        var act3 = new Game_Action(h);
        act3.setSkill(1);
        act3.executeHpDamage(cible2, 500);
        out.reliques.volSansRelique = h.hp;

        // #50 — « +1 âme à chaque ennemi vaincu »
        sansReliques();
        $gameVariables.setValue(15, 0);
        var mort1 = new Game_Enemy(1, 0, 0);
        mort1.die();
        out.reliques.amesSansRelique = $gameVariables.value(15);
        out.reliques.equipee50 = avecRelique(50);
        var mort2 = new Game_Enemy(1, 0, 0);
        mort2.die();
        out.reliques.amesAvecRelique = $gameVariables.value(15);
        sansReliques();

        return out;
    });

    console.log('\n── LES GREFFONS ' + '─'.repeat(57));
    ok('EvenementsUtiles est chargé', r.greffons.EvenementsUtiles);
    ok('LeMarchandQuiSuit est chargé', r.greffons.LeMarchandQuiSuit);

    console.log('\n── « FEU repos » (4 appels dans les cartes) ' + '─'.repeat(30));
    ok('le groupe remonte à plein', r.feu.pleins, r.feu.avant + ' → ' + r.feu.apres);
    ok('le lieu devient un point de retour', r.feu.point, 'carte ' + r.feu.carte);

    console.log('\n── « TEMPS » (3 appels) ' + '─'.repeat(49));
    ok('MOG_TimeSystem répond', r.temps.possible);
    ok('TEMPS jour → matin', r.temps.jour === 8, 'heure ' + r.temps.jour);
    ok('TEMPS nuit → soir', r.temps.nuit === 22, 'heure ' + r.temps.nuit);
    ok('TEMPS basculer inverse', r.temps.apresBascule === 8, 'heure ' + r.temps.apresBascule);

    console.log('\n── « CHUTE » (5 appels) ' + '─'.repeat(49));
    ok('CHUTE bete lève l\'interrupteur 97', r.chute.bete97 === true);
    ok('et ne touche à aucun autre', r.chute.autres.every(function (x) { return x === false; }));
    ok('CHUTE fond lève le 99', r.chute.fond99 === true);
    ok('CHUTE calme rabaisse tout', r.chute.apresCalme.every(function (x) { return x === false; }));

    console.log('\n── « AME » — JadeEntitePlunging, réinscrit (21 appels) ' + '─'.repeat(19));
    ok('AME set pose la jauge', r.ame.apresSet === 7, 'v11 = ' + r.ame.apresSet);
    ok('AME bon la fait monter', r.ame.apresBon > r.ame.apresSet, 'v11 = ' + r.ame.apresBon);
    ok('AME mauvais la fait descendre', r.ame.apresMauvais < r.ame.apresBon, 'v11 = ' + r.ame.apresMauvais);

    console.log('\n── « MARCHAND » — l\'échelle enfin en rayon ' + '─'.repeat(31));
    ok('la boutique s\'ouvre', r.marchand.pousseUneBoutique);
    if (r.marchand.recensement) {
        r.marchand.recensement.forEach(function (p) {
            console.log('        palier ' + p.palier + '  ≤ ' + (p.plafond === null || p.plafond > 1e9 ? '   ∞' : String(p.plafond).padStart(6)) + ' or'
                + '   ' + String(p.armes).padStart(3) + ' armes · ' + String(p.armures).padStart(3) + ' armures · ' + String(p.objets).padStart(3) + ' objets');
        });
        var dernier = r.marchand.recensement[r.marchand.recensement.length - 1];
        var v = r.marchand.vendables;
        ok('le dernier palier vend tout ce qui a un prix',
            dernier.armes === v.armes && dernier.armures === v.armures && dernier.objets === v.objets,
            dernier.armes + '/' + v.armes + ' armes · ' + dernier.armures + '/' + v.armures
            + ' armures · ' + dernier.objets + '/' + v.objets + ' objets');
        console.log('        (le reste est à prix 0 : butin de boss et armes d\'histoire — ça ne se vend pas)');
        ok('les paliers montent', r.marchand.recensement.every(function (p, i, t) { return i === 0 || p.armes >= t[i - 1].armes; }));
    }

    console.log('\n── L\'ÉQUIPEMENT QUE PERSONNE NE POUVAIT PORTER ' + '─'.repeat(26));
    ok('Vesper peut porter la Lame Écarlate', r.equip.vesperSang);
    ok('Vesper peut porter l\'Armure de Sang', r.equip.vesperArmureSang);
    ok('ludwing peut porter la Faux d\'Ossuaire', r.equip.ludwingOmbre);
    ok('plus aucune arme orpheline', r.equip.armesOrphelines.length === 0,
        r.equip.armesOrphelines.length + ' restantes' + (r.equip.armesOrphelines.length ? ' : ' + r.equip.armesOrphelines.slice(0, 4).join(' | ') : ''));
    ok('plus aucune armure orpheline', r.equip.armuresOrphelines.length === 0,
        r.equip.armuresOrphelines.length + ' restantes' + (r.equip.armuresOrphelines.length ? ' : ' + r.equip.armuresOrphelines.slice(0, 4).join(' | ') : ''));

    console.log('\n── LES ÉVÉNEMENTS COMMUNS ' + '─'.repeat(47));
    var nomsOk = r.ce.nouveaux.filter(function (e) { return e.nom && e.cmd > 0; });
    ok('25 nouveaux événements, tous garnis', nomsOk.length === 25, nomsOk.length + '/25');
    ok('#17 « mentale jade » plafonne à 10', r.ce.ce17 === '[16,16,0,0,10]', r.ce.ce17);
    ok('#18 « MENTALE JADE » appelle #17', JSON.stringify(r.ce.ce18) === '[17]', JSON.stringify(r.ce.ce18));

    console.log('\n── LES TROIS RELIQUES ' + '─'.repeat(51));
    r.reliques.lecture.forEach(function (x) {
        ok('#' + x.id + ' porte <Relic: ' + x.relic + '>', !!x.relic);
    });
    var d = r.reliques.desespoir;
    ok('#48 s\'équipe', r.reliques.equipee48);
    ok('#48 — sous 30 % de PV, les dégâts montent de moitié',
        d.avecBasse === Math.floor(d.refBasse * 1.5),
        d.refBasse + ' → ' + d.avecBasse + '  (×' + (d.avecBasse / d.refBasse).toFixed(2) + ')');
    ok('#48 — à pleine vie, elle ne fait rien (contre-épreuve)',
        d.avecPleine === d.refPleine, d.refPleine + ' → ' + d.avecPleine);
    ok('#47 s\'équipe', r.reliques.equipee47);
    ok('#47 — 20 % des dégâts reviennent en PV',
        r.reliques.vol.pvApres === r.reliques.vol.attendu,
        r.reliques.vol.pvApres + ' PV, attendu ' + r.reliques.vol.attendu);
    ok('#47 — sans elle, rien n\'est volé (contre-épreuve)',
        r.reliques.volSansRelique === 1, r.reliques.volSansRelique + ' PV');
    ok('#50 s\'équipe', r.reliques.equipee50);
    ok('#50 — un ennemi tombé donne une âme',
        r.reliques.amesAvecRelique === r.reliques.amesSansRelique + 1,
        r.reliques.amesSansRelique + ' → ' + r.reliques.amesAvecRelique);
    ok('#50 — sans elle, aucune âme (contre-épreuve)', r.reliques.amesSansRelique === 0);

    console.log('\n── LES CONTRE-ÉPREUVES ' + '─'.repeat(50));
    ok('« MARQUE » ne touche aucun interrupteur', r.contre.switchsIdentiques);
    ok('« PLIPLOP » ne touche aucune variable', r.contre.varIdentique);
    ok('ni les points de vie', r.contre.pvIdentiques);

    console.log('\n── LES ERREURS DU MOTEUR ' + '─'.repeat(48));
    ok('rien n\'a planté pendant la passe', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));

    console.log('\n' + '═'.repeat(74));
    console.log('   ' + vert + ' vert · ' + rouge + ' rouge');
    console.log('═'.repeat(74) + '\n');

    await nav.close();
    process.exit(rouge ? 1 : 0);
})();
