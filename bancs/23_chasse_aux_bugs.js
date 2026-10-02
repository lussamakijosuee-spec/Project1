/*
 * BANC — LA CHASSE AUX BUGS
 * ---------------------------------------------------------------------------
 * JOKO, 2026-10-02 : « un gigantesque chantier anti bug potentiel ou bug ».
 *
 * Ce banc lit TOUTES les données du jeu et cherche ce qui plante ou ce qui ne
 * fait rien en silence. Il sépare deux gravités :
 *
 *   ✗ BLOQUANT  — le jeu s'arrête ou se fige si on y passe :
 *       · un fichier (image, son) qui n'existe pas : MV affiche « Failed to
 *         load » et le jeu ne repart plus ;
 *       · un script qui ne se compile pas (faute de frappe dans un appel de
 *         script, une condition, une formule de dégâts) ;
 *       · une référence vers rien : un événement commun, une carte, une
 *         troupe, un objet, une compétence qui n'existe pas.
 *
 *   ⚠ SILENCIEUX — rien ne plante, mais rien ne se passe :
 *       · une commande de plugin qu'aucun plugin ne reconnaît ;
 *       · un transfert qui pose le joueur sur une case où il ne peut pas bouger ;
 *       · un fichier dont seule la casse diffère (marche sous Windows, casse
 *         ailleurs).
 *
 * Les cartes d'atelier et de démonstration (✎, ★, démos de plugins, salle de
 * test) et les événements communs ✎ (recettes à copier) sont comptés à part :
 * ils ne font pas échouer le banc, mais leurs défauts sont listés — JOKO les
 * copie dans son jeu.
 *
 *   node bancs/23_chasse_aux_bugs.js            résumé + détails
 *   node bancs/23_chasse_aux_bugs.js --tout     sans limite de lignes
 */
'use strict';
var fs = require('fs');
var path = require('path');
var R = path.join(__dirname, '..');
var TOUT = process.argv.indexOf('--tout') >= 0;
function lire(f) { return JSON.parse(fs.readFileSync(path.join(R, 'data', f), 'utf8')); }

var SYS = lire('System.json');
var INFOS = lire('MapInfos.json');
var DB = {};
['Actors', 'Classes', 'Skills', 'Items', 'Weapons', 'Armors', 'Enemies', 'Troops', 'States', 'Animations', 'Tilesets', 'CommonEvents'].forEach(function (n) { DB[n] = lire(n + '.json'); });

/* ── les fichiers du projet, avec leur casse exacte ── */
var dossiers = {};
function contenu(d) {
    if (dossiers[d]) return dossiers[d];
    var m = { exact: {}, bas: {} };
    try { fs.readdirSync(path.join(R, d)).forEach(function (f) { var b = f.replace(/\.[^.]+$/, ''); var e = (f.match(/\.([^.]+)$/) || [])[1] || ''; m.exact[b + '|' + e.toLowerCase()] = true; m.bas[(b + '|' + e).toLowerCase()] = b; }); } catch (e) { }
    return (dossiers[d] = m);
}
function existe(d, nom, ext) {
    var m = contenu(d);
    if (m.exact[nom + '|' + ext]) return 'ok';
    if (m.bas[(nom + '|' + ext).toLowerCase()]) return 'casse:' + m.bas[(nom + '|' + ext).toLowerCase()];
    return 'non';
}

/* ── où l'on est : jeu, ou atelier/démo ── */
function estDemo(mapId) {
    var i = INFOS[mapId]; if (!i) return true;
    return /✎|★|SALLE DE TEST|^MAP\d+$/.test(i.name) || (mapId >= 3 && mapId <= 27) || mapId === 66 || mapId === 67;
}
function ceDemo(id) { var c = DB.CommonEvents[id]; return !c || /^✎/.test(c.name); }

var bloquant = [], silencieux = [], bloquantDemo = [], silencieuxDemo = [];
function note(grave, demo, lieu, quoi) { (grave ? (demo ? bloquantDemo : bloquant) : (demo ? silencieuxDemo : silencieux)).push(lieu + ' — ' + quoi); }

function fichier(lieu, demo, d, nom, ext) {
    if (!nom) return;
    var r = existe(d, nom, ext);
    if (r === 'ok') return;
    if (r.indexOf('casse:') === 0) note(false, demo, lieu, d + '/' + nom + '.' + ext + ' : le fichier s\'appelle « ' + r.slice(6) + ' » (casse)');
    else note(true, demo, lieu, d + '/' + nom + '.' + ext + ' introuvable');
}
function son(lieu, demo, d, a) { if (a && a.name) fichier(lieu, demo, 'audio/' + d, a.name, 'ogg'); }
function img(lieu, demo, d, nom) { if (nom) fichier(lieu, demo, 'img/' + d, nom, 'png'); }

/* ── les commandes de plugin connues : les mots que les plugins comparent ── */
var connus = {};
var actifs = (function () { var t = fs.readFileSync(path.join(R, 'js', 'plugins.js'), 'utf8'); var $p; eval(t.replace('var $plugins', '$p')); return $p; })();
actifs.forEach(function (p) {
    var f = path.join(R, 'js', 'plugins', p.name + '.js');
    if (!fs.existsSync(f)) { if (p.status) note(true, false, 'js/plugins.js', 'le plugin actif « ' + p.name + ' » n\'a pas de fichier'); return; }
    if (!p.status) return;
    var src = fs.readFileSync(f, 'utf8');
    var re = /(["'])((?:\\.|(?!\1).){1,60})\1/g, m;
    while ((m = re.exec(src))) connus[m[2].toLowerCase()] = true;
    // les autres façons de déclarer une commande : Galv.pCmd.JUMPACTION,
    // et les expressions régulières (Irina : command.match(/FlushAudioCache/i))
    var re2 = /pCmd\.(\w+)|\.match\(\/\^?(\w+)/g;
    while ((m = re2.exec(src))) connus[(m[1] || m[2]).toLowerCase()] = true;
    // les paramètres déclarés « fichier » (@dir … @type file) doivent exister
    var dirs = {}, bloc = null;
    src.split('\n').forEach(function (l) {
        var a = l.match(/@param\s+(.+?)\s*$/); if (a) { bloc = { nom: a[1] }; return; }
        if (!bloc) return;
        var d = l.match(/@dir\s+(\S+)/); if (d) bloc.dir = d[1].replace(/\/$/, '');
        if (/@type\s+file\b/.test(l)) bloc.fichier = true;
        if (bloc.fichier && bloc.dir) dirs[bloc.nom] = bloc.dir;
    });
    // (l'en-tête peut mentir : GALV_Fishing annonce img/system/ mais charge
    //  depuis img/fishing/ — on accepte tout dossier que le plugin nomme)
    var autres = (src.match(/img\/\w+/g) || []).filter(function (x, i, a) { return a.indexOf(x) === i; });
    Object.keys(dirs).forEach(function (k) {
        var v = p.parameters[k]; if (!v) return;
        var ext = /^audio/.test(dirs[k]) ? 'ogg' : 'png';
        if (autres.some(function (d) { return existe(d, v, ext) === 'ok'; })) return;
        fichier('Paramètre « ' + k + ' » de ' + p.name, false, dirs[k], v, ext);
    });
});
// les commandes de base de MV et des plugins qui découpent autrement
['gab', 'quest', 'enemybook', 'itembook'].forEach(function (k) { connus[k] = true; });
function commandePlugin(lieu, demo, texte) {
    var mot = String(texte).trim().split(/[\s:]+/)[0];
    if (!mot) return;
    if (connus[mot.toLowerCase()]) return;
    note(false, demo, lieu, 'commande de plugin « ' + mot + ' » reconnue par aucun plugin actif (« ' + String(texte).slice(0, 60) + ' »)');
}

/* ── compilation des scripts ── */
function compile(lieu, demo, code, genre) {
    try { new Function('a', 'b', 'v', 'item', 'sign', 'subject', 'target', 'user', code); }
    catch (e) { note(true, demo, lieu, genre + ' qui ne se compile pas : ' + e.message + ' — « ' + code.replace(/\s+/g, ' ').slice(0, 80) + ' »'); }
}

/* ── passabilité d'une case (algorithme de MV) ── */
var cartes = {};
function carte(id) {
    if (cartes[id] !== undefined) return cartes[id];
    var f = 'Map' + String(id).padStart(3, '0') + '.json';
    try { cartes[id] = lire(f); } catch (e) { cartes[id] = null; }
    return cartes[id];
}
function bloqueeDePartout(m, x, y) {
    var ts = DB.Tilesets[m.tilesetId]; if (!ts) return false;
    var flags = ts.flags, w = m.width, h = m.height;
    var libre = false;
    [1, 2, 4, 8].forEach(function (bit) {
        for (var z = 3; z >= 0; z--) {
            var t = m.data[(z * h + y) * w + x] || 0; if (!t) continue;
            var fl = flags[t] || 0;
            if (fl & 0x10) continue;
            if ((fl & bit) === 0) { libre = true; return; }
            if ((fl & bit) === bit) return;
        }
    });
    return !libre;
}

/* ── références ── */
function ref(lieu, demo, table, id, quoi) {
    if (!id) return;
    var t = DB[table];
    if (!t[id] || (t[id].name === '' && table !== 'CommonEvents')) note(true, demo, lieu, quoi + ' n°' + id + ' n\'existe pas');
}

/* ── une liste de commandes ── */
function liste(lieu, demo, cmds) {
    var bloc = null, blocLieu = '';
    cmds.forEach(function (c, i) {
        var p = c.parameters || [], L = lieu + ' ligne ' + (i + 1);
        // les appels de script se lisent en bloc (355 puis 655…)
        if (c.code === 355) { if (bloc !== null) compile(blocLieu, demo, bloc, 'appel de script'); bloc = p[0]; blocLieu = L; return; }
        if (c.code === 655) { bloc += '\n' + p[0]; return; }
        if (bloc !== null) { compile(blocLieu, demo, bloc, 'appel de script'); bloc = null; }
        switch (c.code) {
            case 101: img(L, demo, 'faces', p[0]); break;
            case 111: if (p[0] === 12) compile(L, demo, 'return (' + p[1] + ');', 'condition'); break;
            case 122: if (p[3] === 4) compile(L, demo, 'return (' + p[4] + ');', 'calcul de variable'); break;
            case 117: if (!DB.CommonEvents[p[0]]) note(true, demo, L, 'appel de l\'événement commun n°' + p[0] + ', qui n\'existe pas'); break;
            case 126: if (p[2] === 0) ref(L, demo, 'Items', p[0], 'objet'); break;
            case 127: if (p[2] === 0) ref(L, demo, 'Weapons', p[0], 'arme'); break;
            case 128: if (p[2] === 0) ref(L, demo, 'Armors', p[0], 'armure'); break;
            case 129: ref(L, demo, 'Actors', p[0], 'héros'); break;
            case 132: case 241: son(L, demo, 'bgm', p[0]); break;
            case 133: case 139: case 249: son(L, demo, 'me', p[0]); break;
            case 140: son(L, demo, 'bgm', p[1]); break;
            case 245: son(L, demo, 'bgs', p[0]); break;
            case 250: son(L, demo, 'se', p[0]); break;
            case 201:
                if (p[0] === 0) {
                    var m = carte(p[1]);
                    if (!m) note(true, demo, L, 'transfert vers la carte n°' + p[1] + ', qui n\'existe pas');
                    else if (p[2] < 0 || p[3] < 0 || p[2] >= m.width || p[3] >= m.height) note(true, demo, L, 'transfert hors de la carte ' + p[1] + ' (' + p[2] + ',' + p[3] + ' pour ' + m.width + '×' + m.height + ')');
                    else if (bloqueeDePartout(m, p[2], p[3])) note(false, demo, L, 'transfert sur une case bloquée de tous côtés (carte ' + p[1] + ' ' + p[2] + ',' + p[3] + ') : le joueur ne peut plus bouger');
                }
                break;
            case 212: if (p[1] > 0 && !DB.Animations[p[1]]) note(true, demo, L, 'animation n°' + p[1] + ' inexistante'); break;
            case 231: img(L, demo, 'pictures', p[1]); break;
            case 261: if (p[0]) fichier(L, demo, 'movies', p[0], 'webm'); break;
            case 283: img(L, demo, 'battlebacks1', p[0]); img(L, demo, 'battlebacks2', p[1]); break;
            case 284: img(L, demo, 'parallaxes', p[0]); break;
            case 301: if (p[0] === 0) ref(L, demo, 'Troops', p[1], 'troupe'); break;
            case 322: img(L, demo, 'characters', p[1]); img(L, demo, 'faces', p[3]); img(L, demo, 'sv_actors', p[5]); break;
            case 323: img(L, demo, 'characters', p[1]); break;
            case 108: case 408:
                // MOG_EventIndicators : « indicator : Flame : 0 : 60 » (une image,
                // ou une série Flame_0, Flame_1…). Carte 16 : « flame » au lieu
                // de « Flame » — passe sous Windows, s'arrête ailleurs.
                var ind = String(p[0]).match(/^\s*indicator\s*:\s*([^:]+?)\s*:/i);
                if (ind && ind[1] && ind[1].trim()) {   // vide : un indicateur de texte seul, sans image
                    var nomI = ind[1].trim(), r0 = existe('img/eventindicators', nomI, 'png'), r1 = existe('img/eventindicators', nomI + '_0', 'png');
                    if (r0 !== 'ok' && r1 !== 'ok') {
                        var cas = r0.indexOf('casse:') === 0 ? r0 : r1;
                        if (cas.indexOf('casse:') === 0) note(false, demo, L, 'indicateur « ' + nomI + ' » : le fichier s\'appelle « ' + cas.slice(6) + ' » (casse)');
                        else note(true, demo, L, 'indicateur « ' + nomI + ' » : img/eventindicators/' + nomI + '.png introuvable');
                    }
                }
                break;
            case 356:
                commandePlugin(L, demo, p[0]);
                // MOG_Weather_EX : « weather : couche : type : densité : vitesse : mode : IMAGE … »
                var w = String(p[0]).split(':').map(function (x) { return x.trim(); });
                if (/^weather$/i.test(w[0]) && w[6] && !/[A-Z_]{4,}/.test(w[1])) img(L, demo, 'weather', w[6]);
                break;
            case 205:
                (p[1] && p[1].list || []).forEach(function (r, j) {
                    if (r.code === 41) img(L + ' (déplacement ' + (j + 1) + ')', demo, 'characters', r.parameters[0]);
                    if (r.code === 44) son(L + ' (déplacement ' + (j + 1) + ')', demo, 'se', r.parameters[0]);
                    if (r.code === 45) compile(L + ' (déplacement ' + (j + 1) + ')', demo, r.parameters[0], 'script de déplacement');
                });
                break;
        }
    });
    if (bloc !== null) compile(blocLieu, demo, bloc, 'appel de script');
}

/* ════════ 0. les noms écrits en dur dans le code des plugins ════════
 * AudioManager.playMe({ name: 'Recovery' }) dans EvenementsUtiles : le
 * fichier n'existait qu'en bruitage, chaque repos au Feu d'Âme arrêtait le
 * jeu. Aucune donnée ne le mentionnait : il faut lire le code. */
actifs.filter(function (p) { return p.status; }).forEach(function (p) {
    var f = path.join(R, 'js', 'plugins', p.name + '.js'); if (!fs.existsSync(f)) return;
    var src = fs.readFileSync(f, 'utf8'), m;
    // nom complet seulement : 'Thunder' + n (MeteoVivante) n'est pas un nom
    var reA = /AudioManager\.play(Bgm|Bgs|Me|Se)\(\s*\{\s*name\s*:\s*(['"])([^'"]+)\2(?=\s*[,}])/g;
    while ((m = reA.exec(src))) fichier('Plugin ' + p.name + ' (code)', false, 'audio/' + m[1].toLowerCase(), m[3], 'ogg');
    var reI = /ImageManager\.load(System|Picture|Character|Face|Parallax|Animation|Battleback1|Battleback2|Enemy|SvEnemy|SvActor|Tileset|Title1|Title2)\(\s*(['"])([^'"]+)\2/g;
    var dossierImg = { System: 'system', Picture: 'pictures', Character: 'characters', Face: 'faces', Parallax: 'parallaxes', Animation: 'animations', Battleback1: 'battlebacks1', Battleback2: 'battlebacks2', Enemy: 'enemies', SvEnemy: 'sv_enemies', SvActor: 'sv_actors', Tileset: 'tilesets', Title1: 'titles1', Title2: 'titles2' };
    while ((m = reI.exec(src))) fichier('Plugin ' + p.name + ' (code)', false, 'img/' + dossierImg[m[1]], m[3], 'png');
});

/* ════════ 1. la base de données ════════ */
DB.Actors.forEach(function (a) {
    if (!a || !a.name) return;
    var L = 'Héros ' + a.id + ' ' + a.name;
    img(L, false, 'characters', a.characterName); img(L, false, 'faces', a.faceName);
    if (SYS.optSideView) img(L, false, 'sv_actors', a.battlerName);
    ref(L, false, 'Classes', a.classId, 'classe');
    (a.equips || []).forEach(function (e, i) { if (e) ref(L, false, i === 0 ? 'Weapons' : 'Armors', e, 'équipement de départ'); });
});
DB.Classes.forEach(function (c) { if (!c || !c.name) return; (c.learnings || []).forEach(function (l) { ref('Classe ' + c.id + ' ' + c.name, false, 'Skills', l.skillId, 'compétence apprise'); }); });
function effets(L, demo, o) {
    (o.effects || []).forEach(function (e) {
        if (e.code === 21 && e.dataId > 0) ref(L, demo, 'States', e.dataId, 'état ajouté');
        if (e.code === 22) ref(L, demo, 'States', e.dataId, 'état retiré');
        if (e.code === 43) ref(L, demo, 'Skills', e.dataId, 'compétence enseignée');
        if (e.code === 44 && !DB.CommonEvents[e.dataId]) note(true, demo, L, 'événement commun n°' + e.dataId + ' inexistant');
    });
}
function formule(L, o) {
    if (!o.damage || !o.damage.type) return;
    compile(L, false, 'return (' + o.damage.formula + ');', 'formule de dégâts');
}
DB.Skills.forEach(function (s) {
    if (!s || !s.name) return; var L = 'Compétence ' + s.id + ' ' + s.name;
    if (s.animationId > 0 && !DB.Animations[s.animationId]) note(true, false, L, 'animation n°' + s.animationId + ' inexistante');
    if (s.stypeId > 0 && !SYS.skillTypes[s.stypeId]) note(false, false, L, 'type de compétence n°' + s.stypeId + ' sans nom (invisible ?)');
    effets(L, false, s); formule(L, s);
});
DB.Items.forEach(function (s) {
    if (!s || !s.name) return; var L = 'Objet ' + s.id + ' ' + s.name;
    if (s.animationId > 0 && !DB.Animations[s.animationId]) note(true, false, L, 'animation n°' + s.animationId + ' inexistante');
    effets(L, false, s); formule(L, s);
});
DB.Enemies.forEach(function (e) {
    if (!e || !e.name) return; var L = 'Ennemi ' + e.id + ' ' + e.name;
    if (e.battlerName) {
        var d = SYS.optSideView ? 'sv_enemies' : 'enemies';
        var r1 = existe('img/' + d, e.battlerName, 'png'), r2 = existe('img/enemies', e.battlerName, 'png'), r3 = existe('img/sv_actors', e.battlerName, 'png');
        if (r1 !== 'ok' && r2 !== 'ok' && r3 !== 'ok') note(true, false, L, 'image de combat « ' + e.battlerName + ' » introuvable');
    }
    (e.actions || []).forEach(function (a) { ref(L, false, 'Skills', a.skillId, 'action (compétence)'); });
    (e.dropItems || []).forEach(function (d) { if (d.kind) ref(L, false, ['', 'Items', 'Weapons', 'Armors'][d.kind], d.dataId, 'butin'); });
});
DB.States.forEach(function (s) { if (!s || !s.name) return; });
DB.Animations.forEach(function (a) {
    if (!a || !a.name) return; var L = 'Animation ' + a.id + ' ' + a.name;
    img(L, false, 'animations', a.animation1Name); img(L, false, 'animations', a.animation2Name);
    (a.timings || []).forEach(function (t) { son(L, false, 'se', t.se); });
});
DB.Tilesets.forEach(function (t) { if (!t || !t.name) return; t.tilesetNames.forEach(function (n) { img('Tileset ' + t.id + ' ' + t.name, false, 'tilesets', n); }); });
DB.Troops.forEach(function (t) {
    if (!t) return; var L = 'Troupe ' + t.id + ' ' + t.name;
    t.members.forEach(function (m) { ref(L, false, 'Enemies', m.enemyId, 'ennemi'); });
    t.pages.forEach(function (p, i) { liste(L + ' page ' + (i + 1), false, p.list); });
});
DB.CommonEvents.forEach(function (c) { if (!c) return; liste('Événement commun ' + c.id + ' « ' + c.name + ' »', ceDemo(c.id), c.list); });

/* ════════ 2. le système ════════ */
img('Système', false, 'titles1', SYS.title1Name); img('Système', false, 'titles2', SYS.title2Name);
['titleBgm', 'battleBgm'].forEach(function (k) { son('Système (' + k + ')', false, 'bgm', SYS[k]); });
['victoryMe', 'defeatMe', 'gameoverMe'].forEach(function (k) { son('Système (' + k + ')', false, 'me', SYS[k]); });
(SYS.sounds || []).forEach(function (s, i) { son('Système (son ' + i + ')', false, 'se', s); });
['boat', 'ship', 'airship'].forEach(function (k) { var v = SYS[k]; if (!v) return; img('Système (' + k + ')', false, 'characters', v.characterName); son('Système (' + k + ')', false, 'bgm', v.bgm); });
img('Système', false, 'battlebacks1', SYS.battleback1Name); img('Système', false, 'battlebacks2', SYS.battleback2Name);

/* ════════ 3. les cartes ════════ */
INFOS.forEach(function (i) {
    if (!i) return; var m = carte(i.id); var demo = estDemo(i.id);
    var L0 = 'Carte ' + i.id + ' « ' + i.name + ' »';
    if (!m) { note(true, demo, L0, 'fichier de carte absent'); return; }
    if (!DB.Tilesets[m.tilesetId]) note(true, demo, L0, 'tileset n°' + m.tilesetId + ' inexistant');
    img(L0, demo, 'parallaxes', m.parallaxName);
    if (m.specifyBattleback) { img(L0, demo, 'battlebacks1', m.battleback1Name); img(L0, demo, 'battlebacks2', m.battleback2Name); }
    if (m.autoplayBgm) son(L0, demo, 'bgm', m.bgm);
    if (m.autoplayBgs) son(L0, demo, 'bgs', m.bgs);
    (m.encounterList || []).forEach(function (e) { ref(L0, demo, 'Troops', e.troopId, 'troupe de rencontre'); });
    m.events.forEach(function (e) {
        if (!e) return;
        e.pages.forEach(function (p, pi) {
            var L = L0 + ' év.' + e.id + ' « ' + e.name + ' » p' + (pi + 1);
            if (p.image && p.image.characterName) img(L, demo, 'characters', p.image.characterName);
            (p.moveRoute && p.moveRoute.list || []).forEach(function (r, j) {
                if (r.code === 41) img(L + ' (route ' + (j + 1) + ')', demo, 'characters', r.parameters[0]);
                if (r.code === 44) son(L + ' (route ' + (j + 1) + ')', demo, 'se', r.parameters[0]);
                if (r.code === 45) compile(L + ' (route ' + (j + 1) + ')', demo, r.parameters[0], 'script de déplacement');
            });
            liste(L, demo, p.list);
        });
    });
});

/* ════════ 4. ce qui sort de sa feuille (2026-10-02, le check-up) ════════
 * Une icône, un visage, un sprite ou une case d'animation désignés au-delà de
 * leur image ne plantent pas : MV découpe un rectangle vide. Le joueur voit
 * une case sans icône, un dialogue sans visage, un PNJ invisible, une
 * animation qui « saute » une image. Aucune erreur, nulle part. */
var tailles = {};
function taille(d, nom) {
    var k = d + '/' + nom;
    if (k in tailles) return tailles[k];
    tailles[k] = null;
    var m = contenu(d), vrai = m.exact[nom + '|png'] ? nom : m.bas[(nom + '|png').toLowerCase()];
    if (!vrai) return null;
    try {
        var fd = fs.openSync(path.join(R, d, vrai + '.png'), 'r'), b = Buffer.alloc(24);
        fs.readSync(fd, b, 0, 24, 0); fs.closeSync(fd);
        tailles[k] = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    } catch (e) { }
    return tailles[k];
}
var ICONES = (function () { var t = taille('img/system', 'IconSet'); return t ? Math.floor(t.w / 32) * Math.floor(t.h / 32) : 1e9; })();
function icone(lieu, demo, n) {
    if (n >= ICONES) note(false, demo, lieu, 'icône n°' + n + ' au-delà de IconSet (' + ICONES + ' icônes) : case vide');
}
function iconesDuTexte(lieu, demo, t) {
    var re = /\\I\[(\d+)\]/gi, m;
    while ((m = re.exec(String(t || '')))) icone(lieu, demo, +m[1]);
}
function visage(lieu, demo, nom, i) {
    if (!nom) return; var t = taille('img/faces', nom); if (!t) return;
    if ((i % 4 + 1) * 144 > t.w || (Math.floor(i / 4) + 1) * 144 > t.h)
        note(false, demo, lieu, 'visage « ' + nom + ' » n°' + i + ' hors de l\'image (' + t.w + '×' + t.h + ') : visage vide');
}
function sprite(lieu, demo, nom, i) {
    if (!nom) return;
    var signe = nom.match(/^[!$]+/), seul = !!(signe && signe[0].indexOf('$') >= 0);   // ImageManager.isBigCharacter
    if (seul ? i !== 0 : i > 7) note(false, demo, lieu, 'sprite « ' + nom + ' » n°' + i + (seul ? ' : une feuille « $ » n\'a que le n°0' : ' : une feuille n\'en a que 8') + ' — personnage invisible');
}
DB.Skills.concat(DB.Items, DB.Weapons, DB.Armors, DB.States).forEach(function (o) {
    if (!o || !o.name) return;
    var genre = o.stypeId !== undefined ? 'Compétence' : o.itypeId !== undefined ? 'Objet' : o.wtypeId !== undefined ? 'Arme' : o.atypeId !== undefined ? 'Armure' : 'État';
    var L = genre + ' ' + o.id + ' ' + o.name;
    if (o.iconIndex) icone(L, false, o.iconIndex);
    iconesDuTexte(L, false, o.description); iconesDuTexte(L, false, o.message1); iconesDuTexte(L, false, o.message2);
});
DB.Actors.forEach(function (a) {
    if (!a || !a.name) return; var L = 'Héros ' + a.id + ' ' + a.name;
    visage(L, false, a.faceName, a.faceIndex); sprite(L, false, a.characterName, a.characterIndex);
});
DB.Animations.forEach(function (a) {
    if (!a || !a.name) return;
    var t1 = a.animation1Name && taille('img/animations', a.animation1Name), t2 = a.animation2Name && taille('img/animations', a.animation2Name);
    var hors = {};
    (a.frames || []).forEach(function (f) {
        (f || []).forEach(function (c) {
            var p = c[0]; if (p < 0) return;
            var t = p < 100 ? t1 : t2; if (!t) return;
            if (p % 100 >= 5 * Math.floor(t.h / 192)) hors[p] = true;
        });
    });
    var h = Object.keys(hors);
    if (h.length) note(false, false, 'Animation ' + a.id + ' ' + a.name, h.length + ' case(s) au-delà de son image (n° ' + h.slice(0, 6).join(', ') + ') : l\'animation saute des images');
});
function textes(lieu, demo, cmds) {
    (cmds || []).forEach(function (c, i) {
        var p = c.parameters || [], L = lieu + ' ligne ' + (i + 1);
        if (c.code === 101) visage(L, demo, p[0], p[1]);
        if (c.code === 401 || c.code === 405 || c.code === 102) iconesDuTexte(L, demo, c.code === 102 ? (p[0] || []).join(' ') : p[0]);
        if (c.code === 322) { visage(L, demo, p[3], p[4]); sprite(L, demo, p[1], p[2]); }
        if (c.code === 205) (p[1] && p[1].list || []).forEach(function (r) { if (r.code === 41) sprite(L, demo, r.parameters[0], r.parameters[1]); });
    });
}
DB.CommonEvents.forEach(function (c) { if (c) textes('Événement commun ' + c.id + ' « ' + c.name + ' »', ceDemo(c.id), c.list); });
DB.Troops.forEach(function (t) { if (t) t.pages.forEach(function (p, i) { textes('Troupe ' + t.id + ' ' + t.name + ' page ' + (i + 1), false, p.list); }); });
INFOS.forEach(function (i) {
    if (!i) return; var m = carte(i.id); if (!m) return; var demo = estDemo(i.id);
    m.events.forEach(function (e) {
        if (!e) return;
        e.pages.forEach(function (p, pi) {
            var L = 'Carte ' + i.id + ' « ' + i.name + ' » év.' + e.id + ' « ' + e.name + ' » p' + (pi + 1);
            if (p.image && p.image.characterName) sprite(L, demo, p.image.characterName, p.image.characterIndex);
            (p.moveRoute && p.moveRoute.list || []).forEach(function (r) { if (r.code === 41) sprite(L, demo, r.parameters[0], r.parameters[1]); });
            textes(L, demo, p.list);
        });
    });
});

/* ════════ le bilan ════════ */
function dedoublonner(a) { var vu = {}; return a.filter(function (x) { if (vu[x]) return false; vu[x] = true; return true; }); }
bloquant = dedoublonner(bloquant); silencieux = dedoublonner(silencieux); bloquantDemo = dedoublonner(bloquantDemo); silencieuxDemo = dedoublonner(silencieuxDemo);
function montre(titre, a, max) {
    console.log('\n' + titre + ' : ' + a.length);
    a.slice(0, TOUT ? a.length : max).forEach(function (x) { console.log('   ' + x); });
    if (!TOUT && a.length > max) console.log('   … et ' + (a.length - max) + ' autres (--tout)');
}
console.log('════ LA CHASSE AUX BUGS ════');
montre('✗ BLOQUANT dans le jeu', bloquant, 60);
montre('⚠ SILENCIEUX dans le jeu', silencieux, 60);
montre('✗ bloquant dans les ateliers / démos / recettes ✎', bloquantDemo, 25);
montre('⚠ silencieux dans les ateliers / démos / recettes ✎', silencieuxDemo, 15);
console.log('');
if (bloquant.length) { console.log('❌ ' + bloquant.length + ' défaut(s) bloquant(s) dans le jeu'); process.exit(1); }
console.log('✅ TOUT PASSE — aucun défaut bloquant dans le jeu');
