/*
 * JOUER UNE SCÈNE
 * ---------------------------------------------------------------------------
 * JOKO : « créer une scène de A à Z avec événements […], une scène qui
 * fonctionne sans erreur, avec une animation qui fonctionne, c'est
 * extrêmement long ». Ce banc joue UNE scène dans le vrai moteur, comme un
 * joueur : il lit les messages (un appui toutes les ~0,8 s), prend la
 * réponse demandée aux choix, gagne d'office les combats que la scène lance,
 * et suit les transferts. Il rend :
 *
 *   · une PLANCHE D'IMAGES minutée (captures/scene_….png) — pour voir la
 *     scène sans la jouer ;
 *   · le DÉROULÉ : chaque commande jouée, à quel moment ;
 *   · les PROBLÈMES : erreurs JavaScript, fichiers introuvables, une scène
 *     qui ne bouge plus (et sur quelle ligne, en attendant quoi), et ce
 *     qu'elle oublie à la fin — écran resté noir ou teinté, images restées
 *     affichées, mode cinématique encore allumé, joueur resté transparent.
 *
 *   npx http-server -p 8899 -c-1 .
 *   node bancs/navigateur/jouer_une_scene.js --carte 1 --evenement 10
 *   node bancs/navigateur/jouer_une_scene.js --carte 1 --evenement 10 --page 2
 *   node bancs/navigateur/jouer_une_scene.js --commun 20
 *       --choix 2       prendre la 2e réponse à chaque choix (1 par défaut)
 *       --duree 180     abandonner après 180 s (120 par défaut)
 *       --images 16     nombre d'images sur la planche (12 par défaut)
 *       --deroule       afficher chaque commande jouée
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

function arg(nom, defaut) { var i = process.argv.indexOf('--' + nom); return i >= 0 ? process.argv[i + 1] : defaut; }
var CARTE = Number(arg('carte', 0)), EV = Number(arg('evenement', 0)), PAGE = Number(arg('page', 0));
var COMMUN = Number(arg('commun', 0)), CHOIX = Math.max(1, Number(arg('choix', 1)));
var DUREE = Number(arg('duree', 120)), IMAGES = Math.max(4, Number(arg('images', 12)));
var DEROULE = process.argv.indexOf('--deroule') >= 0;
if (!(CARTE && EV) && !COMMUN) {
    console.log('Il faut --carte N --evenement N, ou --commun N.');
    process.exit(2);
}
var R = path.join(__dirname, '..', '..');
var NOMS = { 101: 'Texte', 102: 'Choix', 103: 'Saisie de nombre', 104: 'Choix d\'objet', 108: 'Commentaire', 111: 'Si', 112: 'Boucle', 113: 'Sortir de la boucle', 115: 'Fin de l\'événement',
    117: 'Événement commun', 118: 'Étiquette', 119: 'Aller à l\'étiquette', 121: 'Interrupteurs', 122: 'Variables', 123: 'Interrupteur local', 125: 'Or', 126: 'Objet', 129: 'Équipe',
    201: 'Transférer le joueur', 203: 'Position d\'un événement', 204: 'Défiler la carte', 205: 'Déplacement', 211: 'Transparence', 212: 'Animation', 213: 'Bulle', 214: 'Effacer l\'événement',
    221: 'Fondu sortant', 222: 'Fondu entrant', 223: 'Teinte de l\'écran', 224: 'Flash', 225: 'Secousse', 230: 'Attendre', 231: 'Afficher une image', 232: 'Déplacer une image', 233: 'Faire tourner une image',
    234: 'Teinte d\'une image', 235: 'Effacer une image', 236: 'Météo', 241: 'Musique', 242: 'Fondu musique', 245: 'Ambiance', 246: 'Fondu ambiance', 249: 'Jingle', 250: 'Son', 261: 'Vidéo',
    132: 'Musique de combat', 283: 'Fond de combat', 301: 'Combat', 303: 'Nom du héros', 311: 'PV', 313: 'État', 314: 'Tout récupérer', 322: 'Apparence du héros', 351: 'Ouvrir le menu', 352: 'Sauvegarde', 353: 'Game over', 354: 'Écran-titre',
    355: 'Script', 356: 'Commande de plugin' };

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [], absents = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
    page.on('response', function (r) { if (r.status() >= 400) absents.push(decodeURIComponent(r.url().replace(BASE, ''))); });
    var ev = function (f, a) { return page.evaluate(f, a); };

    // en « test » : OutilsDeScene signale les déplacements bloqués
    await page.goto(BASE + '/index.html?test', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });

    // ── la scène à jouer ──
    var cible = { carte: CARTE, ev: EV, page: PAGE, commun: COMMUN };
    if (COMMUN) {
        var ce = JSON.parse(fs.readFileSync(path.join(R, 'data', 'CommonEvents.json'), 'utf8'))[COMMUN];
        if (!ce) { console.log('Événement commun ' + COMMUN + ' introuvable.'); process.exit(2); }
        cible.titre = 'Événement commun ' + COMMUN + ' « ' + ce.name + ' »';
        cible.carte = cible.carte || 1;
    } else {
        var m = JSON.parse(fs.readFileSync(path.join(R, 'data', 'Map' + String(CARTE).padStart(3, '0') + '.json'), 'utf8'));
        var e = m.events[EV];
        if (!e) { console.log('Carte ' + CARTE + ' : pas d\'événement ' + EV + '.'); process.exit(2); }
        cible.titre = 'Carte ' + CARTE + ' · événement ' + EV + ' « ' + e.name + ' »' + (PAGE ? ' page ' + PAGE : '');
        cible.x = e.x; cible.y = e.y;
    }
    console.log('═'.repeat(76) + '\n  JOUER UNE SCÈNE — ' + cible.titre + '\n' + '═'.repeat(76));

    await ev(function (c) {
        DataManager.setupNewGame();
        $gameSystem._meteo = { force: 'clair' };
        // le joueur à côté de l'événement (ou au milieu de la carte)
        $gamePlayer.reserveTransfer(c.carte, c.x !== undefined ? c.x : 10, c.y !== undefined ? c.y + 1 : 10, 8, 0);
        SceneManager.goto(Scene_Map);
    }, cible);
    await page.waitForFunction(function () { var s = SceneManager._scene; return s instanceof Scene_Map && s.isReady() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1200);

    // ── le mouchard : chaque commande jouée, à quel moment ──
    await ev(function (c) {
        window.__deroule = [];
        window.__t0 = performance.now();
        var _ex = Game_Interpreter.prototype.executeCommand;
        Game_Interpreter.prototype.executeCommand = function () {
            var cmd = this.currentCommand();
            // seulement la scène et ce qu'elle appelle (pas les processus parallèles)
            if (this._deLaScene && cmd && cmd.code && cmd.code < 400 && window.__deroule.length < 4000) {
                var p = cmd.parameters || [];
                var detail = cmd.code === 401 ? '' : cmd.code === 356 || cmd.code === 355 || cmd.code === 108 ? String(p[0]).slice(0, 60)
                    : cmd.code === 101 ? (this._list[this._index + 1] && this._list[this._index + 1].code === 401 ? String(this._list[this._index + 1].parameters[0]).slice(0, 60) : '')
                    : cmd.code === 117 ? String(p[0]) : cmd.code === 201 ? 'carte ' + p[1] + ' (' + p[2] + ',' + p[3] + ')' : cmd.code === 205 ? 'événement ' + p[0] : cmd.code === 230 ? p[0] + ' images'
                    : cmd.code === 231 ? '#' + p[0] + ' ' + p[1] : cmd.code === 301 ? 'troupe ' + p[1] : '';
                window.__deroule.push({ t: Math.round(performance.now() - window.__t0), prof: this._depth, ev: this._eventId, ligne: this._index + 1, code: cmd.code, detail: detail });
            }
            return _ex.call(this);
        };
        // les combats lancés par la scène sont gagnés d'office : on teste la scène
        var _setup = BattleManager.setup;
        BattleManager.setup = function () { _setup.apply(this, arguments); window.__combats = (window.__combats || 0) + 1; };
        var _child = Game_Interpreter.prototype.setupChild;
        Game_Interpreter.prototype.setupChild = function (list, eventId) {
            _child.call(this, list, eventId);
            if (this._childInterpreter) this._childInterpreter._deLaScene = this._deLaScene;
        };
        var it = $gameMap._interpreter;
        it._deLaScene = true;
        if (c.commun) {
            it.setup($dataCommonEvents[c.commun].list, 0);
        } else {
            var e = $gameMap.event(c.ev);
            var p = c.page ? e.event().pages[c.page - 1] : e.page();
            if (!p) { window.__erreurDepart = 'aucune page active (conditions non remplies) : utilise --page N'; return; }
            it.setup(p.list, c.ev);
        }
    }, cible);
    var depart = await ev(function () { return window.__erreurDepart || ''; });
    if (depart) { console.log('  ✗ ' + depart); await nav.close(); process.exit(1); }

    // ── on joue, en temps réel ──
    var images = [], t0 = Date.now(), pas = 1200, prochaine = 0;   // une image toutes les 1,2 s ; on en choisit IMAGES à la fin
    var immobile = 0, dernier = '', bloque = null, fin = false;
    while ((Date.now() - t0) / 1000 < DUREE) {
        await page.waitForTimeout(400);
        var st = await ev(function (choix) {
            var s = SceneManager._scene, o = { scene: s.constructor.name };
            var it = $gameMap._interpreter, prof = it;
            while (prof._childInterpreter && prof._childInterpreter.isRunning()) prof = prof._childInterpreter;
            o.court = it.isRunning();
            o.ou = prof._eventId + ':' + prof._index + ':' + prof._waitMode + ':' + prof._waitCount;
            o.ligne = prof._index + 1; o.attente = prof._waitMode; o.evId = prof._eventId;
            if (s instanceof Scene_Battle) {
                if ($gameTroop.aliveMembers().length) $gameTroop.aliveMembers().forEach(function (e) { e.addNewState(e.deathStateId()); e.refresh(); });
                if (BattleManager.isInputting()) BattleManager.checkBattleEnd();
                o.combat = true;
            }
            var w = s._messageWindow;
            o.messageAttend = !!(w && $gameMessage.isBusy() && w.pause && w._waitCount <= 0 && !$gameMessage.isChoice());
            o.choix = $gameMessage.isChoice() && s._messageWindow && s._messageWindow._choiceWindow && s._messageWindow._choiceWindow.active;
            if (o.choix) { var cw = s._messageWindow._choiceWindow; cw.select(Math.min(choix - 1, cw.maxItems() - 1)); }
            o.victoire = !!BattleManager._victoryPhase;
            return o;
        }, CHOIX);
        var ms = Date.now() - t0;
        if (ms >= prochaine) {
            images.push({ t: ms, png: await page.screenshot() });
            prochaine += pas;
        }
        if (st.messageAttend || st.choix || st.victoire) { await page.keyboard.down('Enter'); await page.waitForTimeout(80); await page.keyboard.up('Enter'); }
        if (!st.court && !st.combat && st.scene === 'Scene_Map') { fin = true; break; }
        // une scène qui ne bouge plus : même ligne, même attente, pas un message
        if (st.ou === dernier && !st.messageAttend && !st.choix && !st.combat) immobile += 400; else immobile = 0;
        dernier = st.ou;
        if (immobile >= 8000 && !bloque) bloque = st;
    }
    var duree = Math.round((Date.now() - t0) / 100) / 10;
    images.push({ t: Date.now() - t0, png: await page.screenshot() });

    // ── ce que la scène laisse derrière elle ──
    var reste = await ev(function () {
        var o = [];
        var b = $gameScreen.brightness();
        if (b < 255) o.push('l\'écran reste ' + (b === 0 ? 'NOIR' : 'assombri (' + b + ')') + ' — un « Fondu entrant » manque ?');
        var tn = $gameScreen.tone();
        if (tn && (tn[0] || tn[1] || tn[2] || tn[3])) o.push('l\'écran reste teinté (' + tn.join(', ') + ') — si ce n\'est pas l\'heure du jour (MOG), une « Teinte de l\'écran » à remettre ?');
        var imgs = $gameScreen._pictures.filter(function (p) { return p && p.name(); }).map(function (p, i) { return p.name(); });
        if (imgs.length) o.push(imgs.length + ' image(s) encore affichée(s) : ' + imgs.slice(0, 4).join(', '));
        if ($gameSwitches.value(912)) o.push('le mode cinématique (interrupteur 912) est encore allumé — « Fin de cinématique » oubliée ?');
        if ($gamePlayer.isTransparent()) o.push('le joueur est resté transparent');
        if ($gamePlayer.isThrough()) o.push('le joueur traverse encore les murs');
        if ($gameMessage.isBusy()) o.push('un message est encore ouvert');
        // le joueur peut-il encore bouger ? (un transfert sur une case fermée le coince)
        var libre = [2, 4, 6, 8].some(function (d) { return $gamePlayer.canPass($gamePlayer.x, $gamePlayer.y, d); });
        if (!libre && !$gamePlayer.isThrough()) o.push('le joueur est COINCÉ en ' + $gamePlayer.x + ',' + $gamePlayer.y + ' (carte ' + $gameMap.mapId() + ') : aucune direction possible');
        return { reste: o, deroule: window.__deroule, combats: window.__combats || 0, signal: window.OutilsDeScene ? OutilsDeScene.signalements() : [], carte: $gameMap.mapId() };
    });

    // ── la planche d'images : IMAGES captures réparties sur toute la scène ──
    if (images.length > IMAGES) {
        var choisies = [];
        for (var q = 0; q < IMAGES; q++) choisies.push(images[Math.round(q * (images.length - 1) / (IMAGES - 1))]);
        images = choisies;
    }
    var nomFichier = COMMUN ? 'scene_commun_' + COMMUN : 'scene_carte' + CARTE + '_ev' + EV + (PAGE ? '_p' + PAGE : '');
    var sortie = path.join(__dirname, 'captures', nomFichier + '.png');
    fs.mkdirSync(path.dirname(sortie), { recursive: true });
    var planche = await nav.newPage({ viewport: { width: 1640, height: 600 } });
    var base64 = await planche.evaluate(async function (a) {
        var cols = 4, w = 408, h = 312, pad = 22;
        var lignes = Math.ceil(a.imgs.length / cols);
        var c = document.createElement('canvas'); c.width = cols * w; c.height = lignes * (h + pad) + 40;
        var g = c.getContext('2d'); g.fillStyle = '#111'; g.fillRect(0, 0, c.width, c.height);
        g.fillStyle = '#fff'; g.font = 'bold 18px sans-serif'; g.fillText(a.titre, 10, 26);
        for (var i = 0; i < a.imgs.length; i++) {
            var im = new Image(); im.src = 'data:image/png;base64,' + a.imgs[i].b;
            await new Promise(function (ok) { im.onload = ok; });
            var x = (i % cols) * w, y = 40 + Math.floor(i / cols) * (h + pad);
            g.drawImage(im, x, y + pad, w, h);
            g.fillStyle = '#ddd'; g.font = '15px sans-serif';
            var s = a.imgs[i].t / 1000; g.fillText(Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') + '.' + Math.floor((s * 10) % 10), x + 6, y + 16);
        }
        return c.toDataURL('image/png').split(',')[1];
    }, { titre: cible.titre, imgs: images.map(function (i) { return { t: i.t, b: i.png.toString('base64') }; }) });
    fs.writeFileSync(sortie, Buffer.from(base64, 'base64'));
    await nav.close();

    // ── le rapport ──
    var probl = [];
    if (!fin) probl.push('la scène ne s\'est pas terminée en ' + DUREE + ' s');
    if (bloque) probl.push('elle ne bougeait plus depuis 8 s : événement ' + bloque.evId + ', ligne ' + bloque.ligne + (bloque.attente ? ', en attente « ' + bloque.attente + ' »' + (bloque.attente === 'route' ? ' (un déplacement qui n\'arrive pas au bout)' : '') : ''));
    reste.signal.forEach(function (s) { probl.push('signalé : ' + s); });
    var vus = {}; absents.forEach(function (a) { vus[a] = 1; });
    Object.keys(vus).forEach(function (a) { probl.push('fichier introuvable : ' + a); });
    erreurs.forEach(function (e) { probl.push('erreur : ' + e); });
    reste.reste.forEach(function (r) { probl.push('à la fin : ' + r); });

    console.log('  durée : ' + duree + ' s · ' + reste.deroule.length + ' commandes jouées · ' + reste.combats + ' combat(s) gagné(s) d\'office · fin sur la carte ' + reste.carte);
    var parCode = {};
    reste.deroule.forEach(function (d) { var n = NOMS[d.code] || ('code ' + d.code); parCode[n] = (parCode[n] || 0) + 1; });
    console.log('  ' + Object.keys(parCode).sort(function (a, b) { return parCode[b] - parCode[a]; }).slice(0, 10).map(function (k) { return k + ' ×' + parCode[k]; }).join(' · '));
    if (DEROULE) {
        console.log('\n  ── le déroulé ──');
        reste.deroule.forEach(function (d) {
            var s = d.t / 1000;
            console.log('  ' + (Math.floor(s / 60) + ':' + String((s % 60).toFixed(1)).padStart(4, '0')) + '  ' + '  '.repeat(d.prof) + 'l.' + String(d.ligne).padEnd(4) + (NOMS[d.code] || 'code ' + d.code) + (d.detail ? '  « ' + d.detail + ' »' : ''));
        });
    }
    console.log('\n  ── ' + (probl.length ? probl.length + ' problème(s)' : 'aucun problème') + ' ──');
    probl.forEach(function (p) { console.log('   ⚠ ' + p); });
    console.log('\n  planche : ' + path.relative(R, sortie));
    process.exit(probl.length ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
