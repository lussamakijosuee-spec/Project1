/*
 * BANC 3 — la base complète, et les pièges qui l'ont cassée pour de vrai
 * ---------------------------------------------------------------------------
 * Contrôle toute la base de données : références croisées, fichiers d'assets
 * réellement présents sur le disque, et les six pièges MV qui ont chacun cassé
 * le jeu pendant qu'on le jouait.
 *
 *   node bancs/3_base_complete.js      (depuis la racine du projet)
 *
 * Chaque contrôle est joué DEUX FOIS : sur la vraie base, où il doit passer,
 * puis sur une base sabotée exprès, où il doit ÉCHOUER. Un contrôle sans
 * contre-épreuve doit être déclaré invariant, sinon le banc sort en erreur.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');

function charger() {
    var lire = function (nom) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', nom), 'utf8')); };
    return {
        systeme:   lire('System.json'),
        acteurs:   lire('Actors.json'),
        classes:   lire('Classes.json'),
        comps:     lire('Skills.json'),
        objets:    lire('Items.json'),
        armes:     lire('Weapons.json'),
        armures:   lire('Armors.json'),
        etats:     lire('States.json'),
        ennemis:   lire('Enemies.json'),
        troupes:   lire('Troops.json'),
        communs:   lire('CommonEvents.json'),
        tilesets:  lire('Tilesets.json'),
        infos:     lire('MapInfos.json'),
        cartes:    (function () {
            var c = {};
            JSON.parse(fs.readFileSync(path.join(RACINE, 'data', 'MapInfos.json'), 'utf8'))
                .forEach(function (i) {
                    if (!i) { return; }
                    var n = 'Map' + ('00' + i.id).slice(-3) + '.json';
                    c[i.id] = JSON.parse(fs.readFileSync(path.join(RACINE, 'data', n), 'utf8'));
                });
            return c;
        })()
    };
}
function copie(d) { return JSON.parse(JSON.stringify(d)); }
function existe(rel) { return fs.existsSync(path.join(RACINE, rel)); }
function audio(dossier, nom) {
    if (!nom) { return true; }
    return existe('audio/' + dossier + '/' + nom + '.ogg') || existe('audio/' + dossier + '/' + nom + '.m4a');
}

var CONTROLES = [];
function controle(titre, fn) { CONTROLES.push({ titre: titre, fn: fn }); }

// ═══════════════════════════════════════════════════════════════════════════
//  LES SIX PIÈGES — chacun a cassé le jeu en le jouant
// ═══════════════════════════════════════════════════════════════════════════

controle('PIÈGE 1 — flags[0] vaut 16 sur chaque tileset', function (d) {
    // La tuile 0 signifie « pas de tuile ». MV la lit sur toutes les couches
    // vides et la teste comme les autres. Le bit 0x10 la fait SAUTER.
    // À 0, les murs ne bloquent plus rien. À 15, la carte entière est bloquée.
    // Les deux se produisent en silence : le jeu se lance et paraît normal.
    var pb = [];
    for (var i = 1; i < d.tilesets.length; i++) {
        var t = d.tilesets[i];
        if (!t) { continue; }
        if (t.flags[0] !== 16) { pb.push(t.name + ' : flags[0] = ' + t.flags[0] + ' au lieu de 16'); }
        if (t.flags.length !== 8192) { pb.push(t.name + ' : ' + t.flags.length + ' drapeaux au lieu de 8192'); }
    }
    return pb.length ? pb.join(' · ') : null;
});

controle('PIÈGE 2 — chaque classe et chaque ennemi sait toucher', function (d) {
    // Sans le trait xparam 0, « hit » vaut 0 en MV : AUCUNE attaque physique ne
    // touche jamais. Le combat tourne, les tours passent, et tout le monde
    // affiche « Manqué ! » à l'infini. Vu à l'écran avant d'être compris.
    var pb = [];
    var precision = function (o) {
        var t = (o.traits || []).filter(function (x) { return x.code === 22 && x.dataId === 0; });
        return t.length ? t[0].value : 0;
    };
    for (var i = 1; i < d.classes.length; i++) {
        if (d.classes[i] && !(precision(d.classes[i]) > 0)) { pb.push('classe « ' + d.classes[i].name + ' » : précision ' + precision(d.classes[i])); }
    }
    for (var j = 1; j < d.ennemis.length; j++) {
        if (d.ennemis[j] && !(precision(d.ennemis[j]) > 0)) { pb.push('ennemi « ' + d.ennemis[j].name + ' » : précision ' + precision(d.ennemis[j])); }
    }
    return pb.length ? pb.join(' · ') : null;
});

controle('PIÈGE 3 — aucun événement autorun ne tourne en boucle', function (d) {
    // Un autorun (déclencheur 3) ou un parallèle (4) sans moyen de s'arrêter
    // gèle la partie : le joueur ne peut plus jamais bouger. Il lui faut soit
    // une SECONDE PAGE conditionnée à son interrupteur local, soit une commande
    // qui coupe la condition qui le déclenche.
    var pb = [];
    Object.keys(d.cartes).forEach(function (id) {
        var carte = d.cartes[id];
        (carte.events || []).forEach(function (ev) {
            if (!ev) { return; }
            ev.pages.forEach(function (page, n) {
                if (page.trigger !== 3 && page.trigger !== 4) { return; }
                var coupe = page.list.some(function (c) { return c.code === 123; });  // interrupteur local
                var autrePage = ev.pages.some(function (p, m) { return m !== n && p.conditions.selfSwitchValid; });
                if (!(coupe && autrePage)) {
                    pb.push('carte ' + id + ' · « ' + ev.name +' » page ' + (n + 1) +
                            ' : déclencheur ' + page.trigger + ' sans porte de sortie');
                }
            });
        });
    });
    // Les événements communs : même règle, par interrupteur global.
    for (var i = 1; i < d.communs.length; i++) {
        var ce = d.communs[i];
        if (!ce || (ce.trigger !== 1 && ce.trigger !== 2)) { continue; }
        var eteint = ce.list.some(function (c) { return c.code === 121; });
        if (!eteint) { pb.push('événement commun « ' + ce.name + ' » : déclencheur ' + ce.trigger + ' qui ne coupe jamais son interrupteur'); }
    }
    return pb.length ? pb.join(' · ') : null;
});

controle('PIÈGE 4 — le point de départ est réellement praticable', function (d) {
    var s = d.systeme;
    var carte = d.cartes[s.startMapId];
    if (!carte) { return 'la carte de départ ' + s.startMapId + ' n\'existe pas'; }
    if (s.startX < 0 || s.startX >= carte.width || s.startY < 0 || s.startY >= carte.height) {
        return 'le départ (' + s.startX + ',' + s.startY + ') est hors de la carte ' + carte.width + 'x' + carte.height;
    }
    var t = d.tilesets[carte.tilesetId];
    if (!t) { return 'la carte de départ n\'a pas de tileset'; }
    // On rejoue checkPassage de MV, couche par couche, du haut vers le bas.
    var w = carte.width, h = carte.height, x = s.startX, y = s.startY;
    var passable = false, decide = false;
    for (var z = 3; z >= 0 && !decide; z--) {
        var tile = carte.data[(z * h + y) * w + x];
        var flag = t.flags[tile];
        if ((flag & 0x10) !== 0) { continue; }
        if ((flag & 0x02) === 0) { passable = true; decide = true; }
        else { passable = false; decide = true; }
    }
    return passable ? null : 'le héros démarre sur une case infranchissable (' + x + ',' + y + ')';
});

controle('PIÈGE 5 — les compétences 1 et 2 sont l\'attaque et la garde', function (d) {
    // MV code attackSkillId = 1 et guardSkillId = 2 EN DUR. Ces deux entrées
    // doivent exister, et porter stypeId 0 pour ne dépendre d'aucun trait.
    if (!d.comps[1] || !d.comps[2]) { return 'la compétence 1 ou 2 manque'; }
    if (d.comps[1].stypeId !== 0) { return 'la compétence 1 « ' + d.comps[1].name + ' » a stypeId ' + d.comps[1].stypeId + ' au lieu de 0'; }
    if (d.comps[2].stypeId !== 0) { return 'la compétence 2 « ' + d.comps[2].name + ' » a stypeId ' + d.comps[2].stypeId + ' au lieu de 0'; }
    if (!d.etats[1] || d.etats[1].restriction !== 4) { return 'l\'état 1 n\'est pas la mort'; }
    return null;
});

controle('PIÈGE 6 — aucune compétence apprise n\'est invisible', function (d) {
    // Une compétence dont le type n'est ouvert par AUCUN trait est apprise et
    // n'apparaît dans aucun menu. Le type peut être ouvert par la classe ou par
    // une pièce d'équipement — c'est le cas de l'Ombre, ouverte par l'Amulette.
    var ouverts = {};
    var noter = function (liste) {
        for (var i = 1; i < liste.length; i++) {
            if (!liste[i]) { continue; }
            (liste[i].traits || []).forEach(function (t) { if (t.code === 41) { ouverts[t.dataId] = true; } });
        }
    };
    noter(d.classes); noter(d.armes); noter(d.armures); noter(d.acteurs);
    var pb = [];
    for (var c = 1; c < d.classes.length; c++) {
        var cl = d.classes[c];
        if (!cl) { continue; }
        (cl.learnings || []).forEach(function (l) {
            var sk = d.comps[l.skillId];
            if (!sk) { pb.push(cl.name + ' apprend la compétence ' + l.skillId + ', qui n\'existe pas'); return; }
            if (sk.stypeId === 0) { return; }              // attaque / garde : toujours visibles
            if (!ouverts[sk.stypeId]) {
                pb.push(cl.name + ' apprend « ' + sk.name + ' » (type ' + sk.stypeId + ') qu\'aucun trait n\'ouvre : elle sera invisible');
            }
        });
    }
    return pb.length ? pb.join(' · ') : null;
});

// ═══════════════════════════════════════════════════════════════════════════
//  LES RÉFÉRENCES CROISÉES
// ═══════════════════════════════════════════════════════════════════════════

controle('les acteurs pointent vers des classes et un équipement réels', function (d) {
    var pb = [];
    var nbSlots = d.systeme.equipTypes.length - 1;
    for (var i = 1; i < d.acteurs.length; i++) {
        var a = d.acteurs[i];
        if (!a) { continue; }
        if (!d.classes[a.classId]) { pb.push(a.name + ' : classe ' + a.classId + ' inexistante'); }
        if (a.equips.length !== nbSlots) { pb.push(a.name + ' : ' + a.equips.length + ' slots au lieu de ' + nbSlots); }
        a.equips.forEach(function (id, slot) {
            if (id === 0) { return; }
            var piece = slot === 0 ? d.armes[id] : d.armures[id];
            if (!piece) { pb.push(a.name + ' : slot ' + (slot + 1) + ' → pièce ' + id + ' inexistante'); return; }
            var attendu = slot + 1;
            if (piece.etypeId !== attendu) { pb.push(a.name + ' : « ' + piece.name + ' » est du slot ' + piece.etypeId + ', posée au slot ' + attendu); }
        });
    }
    return pb.length ? pb.join(' · ') : null;
});

controle('chaque héros peut porter ce qu\'il a sur le dos', function (d) {
    // Un équipement de départ qu'aucun trait de classe n'autorise est
    // silencieusement retiré au lancement : le héros démarre les mains vides.
    var pb = [];
    for (var i = 1; i < d.acteurs.length; i++) {
        var a = d.acteurs[i];
        if (!a) { continue; }
        var cl = d.classes[a.classId];
        if (!cl) { continue; }
        var armesOk = {}, armuresOk = {};
        cl.traits.forEach(function (t) {
            if (t.code === 51) { armesOk[t.dataId] = true; }
            if (t.code === 52) { armuresOk[t.dataId] = true; }
        });
        a.equips.forEach(function (id, slot) {
            if (id === 0) { return; }
            if (slot === 0) {
                var arme = d.armes[id];
                if (arme && !armesOk[arme.wtypeId]) { pb.push(a.name + ' ne peut pas porter « ' + arme.name + ' » (type d\'arme ' + arme.wtypeId + ')'); }
            } else {
                var arm = d.armures[id];
                if (arm && !armuresOk[arm.atypeId]) { pb.push(a.name + ' ne peut pas porter « ' + arm.name + ' » (type d\'armure ' + arm.atypeId + ')'); }
            }
        });
    }
    return pb.length ? pb.join(' · ') : null;
});

controle('les troupes, les butins et les actions pointent juste', function (d) {
    var pb = [];
    for (var i = 1; i < d.troupes.length; i++) {
        var t = d.troupes[i];
        if (!t) { continue; }
        if (!t.members.length) { pb.push('troupe « ' + t.name + ' » vide'); }
        t.members.forEach(function (m) { if (!d.ennemis[m.enemyId]) { pb.push('troupe « ' + t.name + ' » : ennemi ' + m.enemyId + ' inexistant'); } });
        if (!t.pages || !t.pages.length) { pb.push('troupe « ' + t.name + ' » sans page : Game_Troop.increaseTurn plante au premier tour'); }
    }
    for (var e = 1; e < d.ennemis.length; e++) {
        var en = d.ennemis[e];
        if (!en) { continue; }
        (en.actions || []).forEach(function (a) { if (!d.comps[a.skillId]) { pb.push(en.name + ' emploie la compétence ' + a.skillId + ', inexistante'); } });
        (en.dropItems || []).forEach(function (dr) {
            if (dr.kind === 1 && !d.objets[dr.dataId]) { pb.push(en.name + ' lâche l\'objet ' + dr.dataId + ', inexistant'); }
            if (dr.kind === 2 && !d.armes[dr.dataId]) { pb.push(en.name + ' lâche l\'arme ' + dr.dataId + ', inexistante'); }
            if (dr.kind === 3 && !d.armures[dr.dataId]) { pb.push(en.name + ' lâche l\'armure ' + dr.dataId + ', inexistante'); }
        });
    }
    return pb.length ? pb.join(' · ') : null;
});

controle('les effets de compétence et d\'objet visent des états qui existent', function (d) {
    var pb = [];
    var voir = function (liste, quoi) {
        for (var i = 1; i < liste.length; i++) {
            var o = liste[i];
            if (!o) { continue; }
            (o.effects || []).forEach(function (e) {
                if ((e.code === 21 || e.code === 22) && !d.etats[e.dataId]) {
                    pb.push(quoi + ' « ' + o.name + ' » touche l\'état ' + e.dataId + ', inexistant');
                }
            });
            if (o.damage && o.damage.elementId > 0 && !d.systeme.elements[o.damage.elementId]) {
                pb.push(quoi + ' « ' + o.name + ' » emploie l\'élément ' + o.damage.elementId + ', vide dans System.json');
            }
        }
    };
    voir(d.comps, 'la compétence'); voir(d.objets, 'l\'objet');
    return pb.length ? pb.join(' · ') : null;
});

controle('les cartes pointent vers des tilesets et des troupes réels', function (d) {
    var pb = [];
    Object.keys(d.cartes).forEach(function (id) {
        var c = d.cartes[id];
        if (!d.tilesets[c.tilesetId]) { pb.push('carte ' + id + ' : tileset ' + c.tilesetId + ' inexistant'); }
        if (c.data.length !== c.width * c.height * 6) {
            pb.push('carte ' + id + ' : ' + c.data.length + ' tuiles au lieu de ' + (c.width * c.height * 6));
        }
        (c.encounterList || []).forEach(function (e) { if (!d.troupes[e.troopId]) { pb.push('carte ' + id + ' : rencontre vers la troupe ' + e.troopId + ', inexistante'); } });
        (c.events || []).forEach(function (ev) {
            if (!ev) { return; }
            ev.pages.forEach(function (p) {
                p.list.forEach(function (cmd) {
                    if (cmd.code === 201 && !d.cartes[cmd.parameters[1]]) { pb.push('carte ' + id + ' · « ' + ev.name + ' » transfère vers la carte ' + cmd.parameters[1] + ', inexistante'); }
                    if (cmd.code === 301 && !d.troupes[cmd.parameters[1]]) { pb.push('carte ' + id + ' · « ' + ev.name + ' » lance la troupe ' + cmd.parameters[1] + ', inexistante'); }
                    if (cmd.code === 117 && !d.communs[cmd.parameters[0]]) { pb.push('carte ' + id + ' · « ' + ev.name + ' » appelle l\'événement commun ' + cmd.parameters[0] + ', inexistant'); }
                    if (cmd.code === 126 && !d.objets[cmd.parameters[0]]) { pb.push('carte ' + id + ' · « ' + ev.name + ' » donne l\'objet ' + cmd.parameters[0] + ', inexistant'); }
                });
            });
        });
    });
    return pb.length ? pb.join(' · ') : null;
});

// ═══════════════════════════════════════════════════════════════════════════
//  LES FICHIERS RÉELLEMENT SUR LE DISQUE
// ═══════════════════════════════════════════════════════════════════════════

controle('toutes les images citées existent sur le disque', function (d) {
    var pb = [];
    var img = function (dossier, nom, quoi) {
        if (!nom) { return; }
        if (!existe('img/' + dossier + '/' + nom + '.png')) { pb.push(quoi + ' → img/' + dossier + '/' + nom + '.png'); }
    };
    for (var i = 1; i < d.acteurs.length; i++) {
        var a = d.acteurs[i];
        if (!a) { continue; }
        img('characters', a.characterName, 'acteur « ' + a.name + ' » (sprite)');
        img('faces', a.faceName, 'acteur « ' + a.name + ' » (visage)');
        if (!a.characterName) { pb.push('acteur « ' + a.name + ' » n\'a AUCUN sprite : il sera invisible sur la carte'); }
    }
    for (var e = 1; e < d.ennemis.length; e++) {
        if (d.ennemis[e]) { img('enemies', d.ennemis[e].battlerName, 'ennemi « ' + d.ennemis[e].name + ' »'); }
    }
    for (var t = 1; t < d.tilesets.length; t++) {
        if (!d.tilesets[t]) { continue; }
        d.tilesets[t].tilesetNames.forEach(function (n) { img('tilesets', n, 'tileset « ' + d.tilesets[t].name + ' »'); });
    }
    img('titles1', d.systeme.title1Name, 'écran-titre');
    Object.keys(d.cartes).forEach(function (id) {
        var c = d.cartes[id];
        img('battlebacks1', c.battleback1Name, 'carte ' + id + ' (fond de combat 1)');
        img('battlebacks2', c.battleback2Name, 'carte ' + id + ' (fond de combat 2)');
        img('parallaxes', c.parallaxName, 'carte ' + id + ' (panorama)');
        (c.events || []).forEach(function (ev) {
            if (!ev) { return; }
            ev.pages.forEach(function (p) { img('characters', p.image.characterName, 'carte ' + id + ' · « ' + ev.name + ' »'); });
        });
    });
    return pb.length ? pb.join(' · ') : null;
});

controle('toutes les musiques et tous les sons cités existent', function (d) {
    var pb = [];
    var son = function (dossier, nom, quoi) { if (nom && !audio(dossier, nom)) { pb.push(quoi + ' → audio/' + dossier + '/' + nom); } };
    son('bgm', d.systeme.titleBgm.name, 'musique du titre');
    son('bgm', d.systeme.battleBgm.name, 'musique de combat');
    son('me', d.systeme.victoryMe.name, 'fanfare de victoire');
    son('me', d.systeme.gameoverMe.name, 'game over');
    son('me', d.systeme.defeatMe.name, 'défaite');
    (d.systeme.sounds || []).forEach(function (s, i) { son('se', s.name, 'son système ' + i); });
    Object.keys(d.cartes).forEach(function (id) {
        son('bgm', d.cartes[id].bgm.name, 'carte ' + id);
        son('bgs', d.cartes[id].bgs.name, 'carte ' + id + ' (ambiance)');
        (d.cartes[id].events || []).forEach(function (ev) {
            if (!ev) { return; }
            ev.pages.forEach(function (p) { p.list.forEach(function (c) { if (c.code === 250) { son('se', c.parameters[0].name, 'carte ' + id + ' · « ' + ev.name + ' »'); } }); });
        });
    });
    for (var i = 1; i < d.communs.length; i++) {
        if (!d.communs[i]) { continue; }
        d.communs[i].list.forEach(function (c) { if (c.code === 250) { son('se', c.parameters[0].name, 'événement commun « ' + d.communs[i].name + ' »'); } });
    }
    return pb.length ? pb.join(' · ') : null;
});

controle('les plugins déclarés sont réellement présents', function () {
    var src = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
    var liste = JSON.parse(src.match(/\[[\s\S]*\]/)[0]);
    var pb = [];
    liste.forEach(function (p) {
        if (!existe('js/plugins/' + p.name + '.js')) { pb.push(p.name + ' déclaré dans plugins.js, absent de js/plugins/'); }
    });
    return pb.length ? pb.join(' · ') : null;
});

controle('les formules de dégâts tiennent contre une DÉF de fin de partie', function (d) {
    // « a.atk * k - b.def * k » tombe à 0 contre la DÉF de fin de partie.
    // On rejoue la formule, on ne cherche pas un motif dans le texte.
    var a = { atk: 300, mat: 300, hp: 3000, mhp: 3000, mp: 500, level: 99 };
    var b = { def: 900, mdf: 900, hp: 20000, mhp: 20000 };
    var v = { a: a, b: b, Math: Math };
    var pb = [];
    for (var i = 1; i < d.comps.length; i++) {
        var s = d.comps[i];
        if (!s || !s.damage || s.damage.type !== 1) { continue; }   // dégâts PV seulement
        var r;
        try { r = Function('a', 'b', 'return ' + s.damage.formula)(a, b); }
        catch (err) { pb.push('« ' + s.name + ' » : la formule plante (' + err.message + ')'); continue; }
        if (!(r > 0)) { pb.push('« ' + s.name + ' » fait ' + r + ' dégât contre DÉF 900'); }
    }
    return pb.length ? pb.join(' · ') : null;
});

// ═══════════════════════════════════════════════════════════════════════════
//  CONTRE-ÉPREUVES
// ═══════════════════════════════════════════════════════════════════════════

var SABOTAGES = [
    ['PIÈGE 1 — flags[0] vaut 16 sur chaque tileset', function (d) { d.tilesets[1].flags[0] = 0; }],
    ['PIÈGE 2 — chaque classe et chaque ennemi sait toucher',
     function (d) { d.classes[1].traits = d.classes[1].traits.filter(function (t) { return !(t.code === 22 && t.dataId === 0); }); }],
    ['PIÈGE 3 — aucun événement autorun ne tourne en boucle',
     function (d) { var c = d.cartes[1]; c.events.forEach(function (e) { if (e && e.pages[0].trigger === 4) { e.pages.length = 1; } }); }],
    ['PIÈGE 4 — le point de départ est réellement praticable',
     function (d) { d.systeme.startX = 0; d.systeme.startY = 0; }],
    ['PIÈGE 5 — les compétences 1 et 2 sont l\'attaque et la garde',
     function (d) { d.comps[1].stypeId = 1; }],
    ['PIÈGE 6 — aucune compétence apprise n\'est invisible',
     function (d) { d.classes[1].traits = d.classes[1].traits.filter(function (t) { return !(t.code === 41 && t.dataId === 10); }); }],
    ['les acteurs pointent vers des classes et un équipement réels',
     function (d) { d.acteurs[1].classId = 99; }],
    ['chaque héros peut porter ce qu\'il a sur le dos',
     function (d) { d.classes[1].traits = d.classes[1].traits.filter(function (t) { return t.code !== 51; }); }],
    ['les troupes, les butins et les actions pointent juste',
     function (d) { d.troupes[1].members[0].enemyId = 99; }],
    ['les effets de compétence et d\'objet visent des états qui existent',
     function (d) { d.comps[6].effects = [{ code: 21, dataId: 999, value1: 1, value2: 0 }]; }],
    ['les cartes pointent vers des tilesets et des troupes réels',
     function (d) { d.cartes[1].tilesetId = 99; }],
    ['toutes les images citées existent sur le disque',
     function (d) { d.acteurs[1].characterName = 'CeSpriteNExistePas'; }],
    ['toutes les musiques et tous les sons cités existent',
     function (d) { d.cartes[1].bgm.name = 'CetteMusiqueNExistePas'; }],
    ['les formules de dégâts tiennent contre une DÉF de fin de partie',
     function (d) { d.comps[3].damage.formula = 'a.atk * 4 - b.def * 4'; }]
];

var SANS_LEVIER = {
    'les plugins déclarés sont réellement présents':
        'il lit js/plugins.js sur le disque, pas la base chargée — rien à saboter en mémoire'
};

// ═══════════════════════════════════════════════════════════════════════════
//  EXÉCUTION
// ═══════════════════════════════════════════════════════════════════════════

function lancer() {
    var vraie = charger();
    var echecs = 0, muets = 0;

    console.log('BANC 3 — la base complète\n');
    console.log('1) Sur la vraie base — tout doit passer');
    console.log('   ' + new Array(74).join('-'));
    CONTROLES.forEach(function (c) {
        var r;
        try { r = c.fn(vraie); } catch (err) { r = 'exception : ' + err.message; }
        if (r) { echecs++; console.log('   ✗ ' + c.titre + '\n       → ' + r); }
        else { console.log('   ✓ ' + c.titre); }
    });

    console.log('\n2) Contre-épreuve — chaque contrôle doit tomber quand on sabote ce qu\'il vise');
    console.log('   ' + new Array(74).join('-'));
    SABOTAGES.forEach(function (s) {
        var c = null;
        CONTROLES.forEach(function (x) { if (x.titre === s[0]) { c = x; } });
        if (!c) { muets++; console.log('   ✗ sabotage orphelin : « ' + s[0] + ' »'); return; }
        var cassee = copie(vraie);
        var r;
        try { s[1](cassee); r = c.fn(cassee); } catch (err) { r = 'exception'; }
        if (r) { console.log('   ✓ ' + s[0]); }
        else { muets++; console.log('   ✗ ' + s[0] + '\n       → le contrôle passe sur une base cassée : il ne mesure rien'); }
    });

    if (Object.keys(SANS_LEVIER).length) {
        console.log('\n3) Invariants déclarés');
        console.log('   ' + new Array(74).join('-'));
        Object.keys(SANS_LEVIER).forEach(function (t) { console.log('   · ' + t + '\n       ' + SANS_LEVIER[t]); });
    }

    var orphelins = CONTROLES.filter(function (c) {
        return !SABOTAGES.some(function (s) { return s[0] === c.titre; }) && !(c.titre in SANS_LEVIER);
    });
    if (orphelins.length) {
        muets += orphelins.length;
        console.log('\n   ✗ contrôles ni sabotés ni déclarés invariants :');
        orphelins.forEach(function (c) { console.log('       · ' + c.titre); });
    }

    console.log('\n' + new Array(77).join('='));
    console.log(CONTROLES.length + ' contrôles · ' + SABOTAGES.length + ' contre-épreuves · ' +
                Object.keys(SANS_LEVIER).length + ' invariant déclaré');
    if (echecs === 0 && muets === 0) { console.log('✅ BANC PASSÉ'); process.exit(0); }
    console.log('❌ BANC ÉCHOUÉ — ' + echecs + ' en échec, ' + muets + ' qui ne mesurent rien');
    process.exit(1);
}

lancer();
