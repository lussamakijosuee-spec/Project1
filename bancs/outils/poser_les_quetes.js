/*
 * OUTIL — les quêtes du monde : remettre celles de JOKO, poser les nouvelles
 * ---------------------------------------------------------------------------
 * JOKO, 2026-09-26 : « ce qui me manque particulièrement, c'est les événements
 * de quête. Vu que c'est un jeu basique, il faut énormément de quêtes. […]
 * Inspire-toi des références de quêtes de jeux vidéo. » Et : « les événements
 * de cartes, je te donne l'autorisation. »
 *
 * ① REMETTRE. Les cartes portaient déjà des quêtes (le couteau de Tobin, les
 *    trois rumeurs de Sarielle) écrites pour le greffon QuestJournal.js, parti
 *    à la restauration. Leurs commandes « QUEST … » avaient été mises en
 *    commentaire (neutraliser_commandes_mortes.js). QuetesDuMonde.js parle à
 *    nouveau ce langage : on les rebascule en commandes, mot pour mot.
 *
 * ② POSER. Vingt-trois quêtes neuves, chacune un événement posé sur une case
 *    praticable et libre du monde de JOKO (jamais sur les cartes de démo des
 *    greffons). Les familles, d'après les types de quêtes recensés dans les
 *    grands RPG (gamedesignskills.com « 17 types of game quests », les
 *    contrats du Witcher 3, la chaîne d'échanges de Zelda) :
 *      · chasse (contrat) : repérer, abattre, revenir ;
 *      · livraison / collecte : rapporter ce qu'on demande ;
 *      · enquête : écouter, aller voir la nuit, lire une tombe ;
 *      · chaîne d'échanges : un objet en appelle un autre ;
 *      · quêtes de personnage : Vesper, Korrah, ludwing, Aël, chacune sur
 *        SA mécanique (les Styles, l'Avatar, les âmes, les Portes) ;
 *      · apprentissage : le Feu d'Âme, le Marché, les Sept Noms.
 *    Rien n'est inventé sur l'univers : les PNJ sont des villageois, des
 *    gardes, des artisans ; les lieux, les ennemis et les objets sont ceux
 *    des cartes.
 *
 * Idempotent : les événements posés portent le préfixe « ✎ » dans leur nom et
 * sont remplacés à chaque passage ; rien d'autre n'est touché.
 *
 *   node bancs/outils/poser_les_quetes.js            (applique)
 *   node bancs/outils/poser_les_quetes.js --montre   (liste sans écrire)
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var MONTRE = process.argv.indexOf('--montre') >= 0;
var PREFIXE = '[commande sans répondant] ';
var MARQUE = '✎ ';

function lire(nom) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', nom + '.json'), 'utf8')); }
function ecrireTableau(nom, tab) {
    fs.writeFileSync(path.join(RACINE, 'data', nom + '.json'), '[\n' + tab.map(function (e) { return JSON.stringify(e); }).join(',\n') + '\n]', 'utf8');
}
function ecrireCarte(id, carte) { fs.writeFileSync(path.join(RACINE, 'data', 'Map' + String(id).padStart(3, '0') + '.json'), JSON.stringify(carte), 'utf8'); }
var TS = lire('Tilesets'), MI = lire('MapInfos');
var journal = [];
function note(t) { journal.push(t); }

// ═══════════════════════════════════════════════════════════════════════════
// ① Remettre les commandes QUEST de JOKO
// ═══════════════════════════════════════════════════════════════════════════
var cartes = {};
function carte(id) {
    if (!cartes[id]) { cartes[id] = { id: id, data: JSON.parse(fs.readFileSync(path.join(RACINE, 'data', 'Map' + String(id).padStart(3, '0') + '.json'), 'utf8')), modifiee: false }; }
    return cartes[id];
}
var remises = 0;
function remettre(liste, ou) {
    liste.forEach(function (c) {
        if (c.code === 108 && typeof c.parameters[0] === 'string' && c.parameters[0].indexOf(PREFIXE + 'QUEST') === 0) {
            c.code = 356; c.parameters = [c.parameters[0].slice(PREFIXE.length)]; remises++;
            note('① ' + ou + ' : « ' + c.parameters[0].slice(0, 60) + ' »');
        }
    });
}
MI.forEach(function (m) {
    if (!m) { return; }
    var C; try { C = carte(m.id); } catch (e) { return; }
    C.data.events.forEach(function (e) { if (!e) { return; } e.pages.forEach(function (p, i) { var avant = remises; remettre(p.list, 'carte ' + m.id + ' ev ' + e.id + ' p' + i); if (remises > avant) { C.modifiee = true; } }); });
});
var CE = lire('CommonEvents'), ceModifie = false;
CE.forEach(function (c) { if (!c) { return; } var avant = remises; remettre(c.list, 'CE ' + c.id); if (remises > avant) { ceModifie = true; } });

// ═══════════════════════════════════════════════════════════════════════════
// ② La petite fabrique d'événements
// ═══════════════════════════════════════════════════════════════════════════
function Bloc() { this.l = []; this.i = 0; }
Bloc.prototype.cmd = function (code, params) { this.l.push({ code: code, indent: this.i, parameters: params || [] }); return this; };
Bloc.prototype.texte = function (lignes, visage) {
    for (var k = 0; k < lignes.length; k += 4) {
        this.cmd(101, [visage ? visage[0] : '', visage ? visage[1] : 0, 0, 2]);
        lignes.slice(k, k + 4).forEach(function (l) { this.cmd(401, [l]); }, this);
    }
    return this;
};
Bloc.prototype.choix = function (libelles, branches) {
    this.cmd(102, [libelles, libelles.length - 1, 0, 2, 0]);
    libelles.forEach(function (lib, n) {
        this.cmd(402, [n, lib]); this.i++;
        if (branches[n]) { branches[n](this); }
        this.i--;
    }, this);
    return this.cmd(404, []);
};
Bloc.prototype.si = function (cond, alors, sinon) {
    this.cmd(111, cond); this.i++; alors(this); this.i--;
    if (sinon) { this.cmd(411, []); this.i++; sinon(this); this.i--; }
    return this.cmd(412, []);
};
Bloc.prototype.siScript = function (js, alors, sinon) { return this.si([12, js], alors, sinon); };
Bloc.prototype.siObjet = function (id, alors, sinon) { return this.si([8, id], alors, sinon); };
Bloc.prototype.quest = function (s) { return this.cmd(356, ['QUEST ' + s]); };
Bloc.prototype.self = function (ch, on) { return this.cmd(123, [ch, on === false ? 1 : 0]); };
Bloc.prototype.or = function (n) { return this.cmd(125, [0, 0, n]); };
Bloc.prototype.objet = function (id, n) { return this.cmd(126, [id, 0, 0, n]); };
Bloc.prototype.retirer = function (id, n) { return this.cmd(126, [id, 1, 0, n]); };
Bloc.prototype.arme = function (id, n) { return this.cmd(127, [id, 0, 0, n, false]); };
Bloc.prototype.son = function (nom) { return this.cmd(250, [{ name: nom, volume: 90, pitch: 100, pan: 0 }]); };
Bloc.prototype.fin = function () { this.cmd(0, []); return this.l; };

function page(bloc, opt) {
    opt = opt || {};
    return {
        conditions: { actorId: 1, actorValid: false, itemId: 1, itemValid: false, selfSwitchCh: opt.self || 'A', selfSwitchValid: !!opt.self, switch1Id: 1, switch1Valid: false, switch2Id: 1, switch2Valid: false, variableId: 1, variableValid: false, variableValue: 0 },
        directionFix: false,
        image: { characterIndex: opt.img ? opt.img[1] : 0, characterName: opt.img ? opt.img[0] : '', direction: 2, pattern: 1, tileId: 0 },
        list: bloc.fin(), moveFrequency: 3, moveRoute: { list: [{ code: 0, parameters: [] }], repeat: true, skippable: false, wait: false },
        moveSpeed: 3, moveType: 0, priorityType: opt.priorite === undefined ? 1 : opt.priorite, stepAnime: false, through: false,
        trigger: opt.trigger === undefined ? 0 : opt.trigger, walkAnime: true
    };
}
function praticable(map, x, y) {
    if (x < 0 || y < 0 || x >= map.width || y >= map.height) { return false; }
    var flags = TS[map.tilesetId].flags;
    for (var z = 3; z >= 0; z--) {
        var t = map.data[(z * map.height + y) * map.width + x];
        if (!t) { continue; }
        var f = flags[t];
        if ((f & 0x10) !== 0) { continue; }
        return (f & 0x0f) === 0;
    }
    return false;
}
function caseLibre(map, ax, ay) {
    var occupe = {}; map.events.forEach(function (e) { if (e) { occupe[e.x + ',' + e.y] = true; } });
    for (var r = 0; r <= 6; r++) {
        for (var dy = -r; dy <= r; dy++) {
            for (var dx = -r; dx <= r; dx++) {
                if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) { continue; }
                var x = ax + dx, y = ay + dy;
                if (praticable(map, x, y) && !occupe[x + ',' + y]) { return { x: x, y: y }; }
            }
        }
    }
    throw new Error('aucune case libre autour de ' + ax + ',' + ay);
}
var poses = 0;
function poser(mapId, nom, ax, ay, pages, exact) {
    var C = carte(mapId), map = C.data;
    map.events = map.events.map(function (e) { return e && e.name === MARQUE + nom ? null : e; });
    var pos = exact ? { x: ax, y: ay } : caseLibre(map, ax, ay);
    var id = map.events.length; while (map.events[id]) { id++; }
    map.events[id] = { id: id, name: MARQUE + nom, note: '', pages: pages, x: pos.x, y: pos.y };
    C.modifiee = true; poses++;
    note('② carte ' + mapId + ' (' + (MI[mapId] || {}).name + ') : « ' + nom + ' » en ' + pos.x + ',' + pos.y);
}

// ── les patrons ───────────────────────────────────────────────────────────
// Un PNJ qui donne une quête, attend, puis paie. `d` :
//   id, type, titre, desc, de, lieu, img, intro[], accepte[] (lignes), refuse[] ,
//   commandes[] (QUEST … après add), attente[], condition (fn bloc→bloc.si…), reussite[], paie(bloc), apres[]
// une quête donnée maintenant par un habitant (l'outil des habitants l'écrit dans sa page) : le ✎ ne se pose plus
function retirerPose(mapId, nom) {
    var C = carte(mapId), map = C.data, avant = map.events.filter(Boolean).length;
    map.events = map.events.map(function (e) { return e && e.name === MARQUE + nom ? null : e; });
    if (map.events.filter(Boolean).length !== avant) { C.modifiee = true; note('② carte ' + mapId + ' : « ' + nom + ' » retiré'); }
}
function rendue(mapId, nom, aQui) { retirerPose(mapId, nom); note('② carte ' + mapId + ' : la quête de « ' + nom + ' » est à ' + aQui); }
function pnjQuete(mapId, nom, ax, ay, d) {
    var p0 = new Bloc();
    p0.texte(d.intro, d.visage);
    p0.choix([d.oui || 'Oui', d.non || 'Plus tard'], [function (b) {
        b.quest('add ' + d.type + ' ' + d.id + ' "' + d.titre + '" "' + d.desc + '"');
        b.quest('de ' + d.id + ' "' + d.de + '" "' + d.lieu + '"');
        (d.objectifs || []).forEach(function (o) { b.quest('obj ' + d.id + ' "' + o + '"'); });
        (d.prix || []).forEach(function (o) { b.quest('prix ' + d.id + ' "' + o + '"'); });
        (d.commandes || []).forEach(function (c) { b.quest(c); });
        b.quest('track ' + d.id);
        b.texte(d.accepte, d.visage); b.self('A');
    }, function (b) { b.texte(d.refuse || ['« Comme tu veux. »'], d.visage); }]);
    var p1 = new Bloc();
    d.condition(p1, function (b) {
        b.texte(d.reussite, d.visage);
        if (d.paie) { d.paie(b); }
        b.quest('done ' + d.id); b.self('B');
    }, function (b) { b.texte(d.attente, d.visage); });
    var p2 = new Bloc(); p2.texte(d.apres, d.visage);
    poser(mapId, nom, ax, ay, [page(p0, { img: d.img }), page(p1, { img: d.img, self: 'A' }), page(p2, { img: d.img, self: 'B' })]);
}
function objDone(id, n) { return "$gameSystem.questObjDone('" + id + "', " + n + ')'; }
function statut(id) { return "$gameSystem.questStatus('" + id + "')"; }

// ═══════════════════════════════════════════════════════════════════════════
// ③ Les quêtes
// ═══════════════════════════════════════════════════════════════════════════

// ── PRINCIPALES et APPRENTISSAGE : déclenchées en arrivant, sans PNJ ──────
(function () {
    // Caverne de Pierre (28) : la première quête, en sortant de la pierre.
    var b = new Bloc();
    b.quest('add main sortie "Sortir de la pierre" "La Caverne de Pierre s\'ouvre sur le Marécage. Au-delà, une forêt, et quelque part une ville avec un toit et un feu."');
    b.quest('de sortie "—" "Caverne de Pierre"');
    b.quest('obj sortie "Traverser le Marécage"'); b.quest('obj sortie "Passer la Forêt"'); b.quest('obj sortie "Atteindre la Ville Forestière"');
    b.quest('prix sortie "Un toit, un feu, un marché."');
    b.quest('visite sortie 1 32'); b.quest('visite sortie 2 31'); b.quest('visite sortie 3 29');
    b.quest('auto sortie'); b.quest('track sortie'); b.self('A');
    poser(28, 'Quête — sortir de la pierre', 1, 1, [page(b, { trigger: 3, priorite: 0 }), page(new Bloc(), { self: 'A', priorite: 0 })], true);

    // Ville Forestière (29) : les Sept Noms, le Feu d'Âme, le Marché.
    var c = new Bloc();
    c.quest('add main noms "Les Sept Noms" "Sept âmes murmurent chacune un nom dans la langue d\'avant. Sulith dans la pierre, Nedra et Maroth dans le marais, Oshka au bord de l\'eau, Ilesse dans la montagne, Kavor derrière les murs, Temira tout en haut. Le Sanctuaire des Sept Noms les attend."');
    c.quest('de noms "—" "Ville Forestière"');
    c.quest('obj noms "Entendre Oshka au Village de Pêche"'); c.quest('obj noms "Entendre Ilesse au Village Montagnard"');
    c.quest('obj noms "Entendre Kavor dans la Forteresse"'); c.quest('obj noms "Entendre Temira en haut de la Tour"'); c.quest('obj noms "Entrer au Sanctuaire des Sept Noms"');
    c.quest('prix noms "Ce que les sept gardent."');
    c.quest('visite noms 1 33'); c.quest('visite noms 2 36'); c.quest('visite noms 3 52'); c.quest('visite noms 4 55'); c.quest('visite noms 5 56');
    c.quest('auto noms');
    c.quest('add tuto feu "Le Feu d\'Âme" "Un Feu d\'Âme brûle près de l\'entrée de la ville. S\'y reposer remet tout le groupe à neuf et en fait un point de retour."');
    c.quest('de feu "—" "Ville Forestière"'); c.quest('obj feu "Te reposer au Feu d\'Âme"'); c.quest('prix feu "Un point de retour."');
    c.quest('commande feu 1 1 FEU'); c.quest('auto feu');
    c.quest('add tuto marche "Le Marché" "Le Marché est au sud de la ville. On y achète de quoi tenir : potions, éthers, et plus tard des armes."');
    c.quest('de marche "—" "Marché"'); c.quest('obj marche "Acheter quelque chose"'); c.quest('prix marche "Savoir où dépenser."');
    c.quest('achat marche 1 1'); c.quest('auto marche');
    c.self('A');
    poser(29, 'Quête — la ville', 1, 1, [page(c, { trigger: 3, priorite: 0 }), page(new Bloc(), { self: 'A', priorite: 0 })], true);
})();

// ── SECONDAIRES ──────────────────────────────────────────────────────────
// Un contrat de chasse à la manière des contrats du Witcher : repérer, abattre, revenir.
pnjQuete(29, 'Garde de la ville', 33, 29, {
    id: 'bandits', type: 'side', titre: 'Les bandits de la Forêt Perdue', img: ['Actor1', 5],
    desc: 'Des bandits tiennent les chemins entre le Marécage et la Forêt Perdue. Le garde de la ville paie par tête.',
    de: 'Le garde de la ville', lieu: 'Ville Forestière',
    intro: ['Garde — Cinq bandits. C\'est ce qu\'il en faut', 'pour que la route redevienne une route.', 'Marécage, Forêt Perdue : ils y sont.', 'Tu en es ?'],
    objectifs: ['Abattre des bandits (%1 / %2)', 'Revenir voir le garde'], prix: ['300 or', 'Potion Supérieure ×2'],
    commandes: ['chasse bandits 1 5 "bandit"'],
    accepte: ['Garde — Cinq. Pas quatre. Je compte.'],
    attente: ['Garde — Alors ? Je n\'ai pas entendu la route', 'se calmer.'],
    condition: function (b, oui, non) { b.siScript(objDone('bandits', 1), oui, non); },
    reussite: ['Garde — Cinq. Bon. La route est à nouveau', 'une route. Tiens, c\'est de la caisse.'],
    paie: function (b) { b.or(300); b.objet(11, 2); },
    apres: ['Garde — Si tu repasses par la Forêt Perdue,', 'garde la main sur la garde.']
});
pnjQuete(30, 'Éclaireuse du Marché', 14, 7, {
    id: 'chauves', type: 'side', titre: 'Ce qui vole dans la Caverne', img: ['People4', 1],
    desc: 'Les chauves-souris de la Caverne de Pierre descendent jusqu\'au Marécage. L\'éclaireuse du Marché veut que le passage redevienne sûr.',
    de: 'L\'éclaireuse', lieu: 'Marché',
    intro: ['Éclaireuse — La Caverne de Pierre. Les', 'chauves-souris y sont si nombreuses qu\'on', 'ne passe plus sans lanterne. Quatre de', 'moins, et je te paie.'],
    objectifs: ['Abattre des chauves-souris (%1 / %2)', 'Revenir voir l\'éclaireuse'], prix: ['150 or', 'Bocal à Lucioles ×1'],
    commandes: ['chasse chauves 1 4 "Chauve-souris"'],
    accepte: ['Éclaireuse — Elles dorment au plafond.', 'Elles ne dorment pas longtemps.'],
    attente: ['Éclaireuse — Quatre. Tu sais compter, je sais', 'compter.'],
    condition: function (b, oui, non) { b.siScript(objDone('chauves', 1), oui, non); },
    reussite: ['Éclaireuse — Le passage respire. Tiens :', 'une lanterne pour la prochaine fois.'],
    paie: function (b) { b.or(150); b.objet(7, 1); },
    apres: ['Éclaireuse — Le Marché te doit une lanterne.', 'Ne la perds pas.']
});
pnjQuete(29, 'Égoutier', 25, 27, {
    id: 'egouts', type: 'side', titre: 'Ce qui rôde dans les égouts', img: ['People2', 5],
    desc: 'Quelque chose vole dans la Cave Égout, sous la Forêt Perdue. L\'égoutier n\'y descend plus.',
    de: 'L\'égoutier', lieu: 'Ville Forestière',
    intro: ['Égoutier — Les égouts, sous la Forêt Perdue.', 'On m\'y a volé mes outils, ma lanterne, et', 'presque mes bottes. Des voleuses. Trois au', 'moins. Descends-y pour moi.'],
    objectifs: ['Descendre dans la Cave Égout', 'Chasser les voleuses (%1 / %2)', 'Revenir voir l\'égoutier'], prix: ['250 or', 'Éther ×2'],
    commandes: ['visite egouts 1 50', 'chasse egouts 2 3 "voleuse "'],
    accepte: ['Égoutier — L\'entrée est dans la Forêt Perdue.', 'Bouche-toi le nez.'],
    attente: ['Égoutier — Trois voleuses. Et mes bottes,', 'si tu les vois.'],
    condition: function (b, oui, non) { b.siScript(objDone('egouts', 2), oui, non); },
    reussite: ['Égoutier — Je vais pouvoir redescendre.', 'Tiens, c\'est pas grand-chose.'],
    paie: function (b) { b.or(250); b.objet(15, 2); },
    apres: ['Égoutier — Ça sent toujours pareil là-dessous.', 'Mais ça vole moins.']
});
pnjQuete(51, 'Ouvrier du camp', 22, 27, {
    id: 'corde', type: 'side', titre: 'Une corde pour la Forteresse', img: ['People4', 6],
    desc: 'La porte de la Forteresse ne s\'ouvre qu\'avec une corde pour monter. Les bandits forts du camp ont pris celle de l\'ouvrier.',
    de: 'L\'ouvrier du camp', lieu: 'Camps de Nomades',
    intro: ['Ouvrier — Tu veux entrer dans la Forteresse ?', 'Il te faut une corde. J\'en avais une.', 'Les bandits forts du camp l\'ont prise avec', 'le reste. Trois d\'entre eux, et elle est à toi.'],
    objectifs: ['Abattre des bandits forts (%1 / %2)', 'Récupérer la corde'], prix: ['La corde', '200 or'],
    commandes: ['chasse corde 1 3 "bandit fort "'],
    accepte: ['Ouvrier — Ils traînent autour des tentes.', 'Frappe fort, ils frappent fort.'],
    attente: ['Ouvrier — Trois. Ils sont encore là, je les', 'entends rire.'],
    condition: function (b, oui, non) { b.siScript(objDone('corde', 1), oui, non); },
    reussite: ['Ouvrier — Ils l\'avaient roulée sous une tente.', 'Prends-la. Et prends ça, pour la peine.'],
    paie: function (b) { b.objet(68, 1); b.or(200); },
    apres: ['Ouvrier — La porte est au fond, près de la', 'flamme. Place la corde et monte.']
});
pnjQuete(46, 'Nomade au comptoir', 29, 15, {
    id: 'lait', type: 'side', titre: 'Du lait pour le camp', img: ['People4', 3],
    desc: 'Les enfants du Camp des Nomades ne boivent que de l\'eau du marais. Un nomade au comptoir du bar cherche trois Laits du Ranch.',
    de: 'Un nomade', lieu: 'BAR',
    intro: ['Nomade — Au camp, les petits boivent l\'eau', 'du marais. Trois Laits du Ranch, et je', 'repars avec quelque chose de propre.', 'Le Marché en vend.'],
    objectifs: ['Rapporter 3 Laits du Ranch'], prix: ['180 or', 'Plat Douteux ×2'],
    accepte: ['Nomade — Trois. Je t\'attends ici, je ne bouge', 'pas du comptoir.'],
    attente: ['Nomade — Trois Laits du Ranch. Le Marché,', 'au sud.'],
    condition: function (b, oui, non) { b.siScript('$gameParty.numItems($dataItems[9]) >= 3', oui, non); },
    reussite: ['Nomade — Du propre. Les petits vont faire', 'la grimace, et boire quand même.'],
    paie: function (b) { b.retirer(9, 3); b.or(180); b.objet(8, 2); },
    apres: ['Nomade — Passe au camp un jour. On te', 'servira autre chose que de l\'eau.']
});
pnjQuete(44, 'Aubergiste', 9, 6, {
    id: 'biere', type: 'side', titre: 'La dette de Grod', img: ['People3', 5],
    desc: 'Grod doit trois mois de bière à l\'auberge et jure que l\'aubergiste l\'adore. Elle ne l\'adore pas. Trois Bières règleraient la note.',
    de: 'L\'aubergiste', lieu: 'Auberge',
    intro: ['Aubergiste — Grod. Trois mois de bière et', 'des « je t\'estime ». Si quelqu\'un me rapporte', 'trois Bières, sa dette est effacée et je', 'lui rends son tabouret.'],
    objectifs: ['Rapporter 3 Bières'], prix: ['120 or', 'Tonique de Combat ×1'],
    accepte: ['Aubergiste — Trois. Pas une de plus, il', 'les boirait.'],
    attente: ['Aubergiste — Trois Bières. Le Marché ou', 'le bar, mais pas les siennes.'],
    condition: function (b, oui, non) { b.siScript('$gameParty.numItems($dataItems[10]) >= 3', oui, non); },
    reussite: ['Aubergiste — Dette effacée. Il va croire que', 'c\'est de l\'estime. Laisse-le croire.'],
    paie: function (b) { b.retirer(10, 3); b.or(120); b.objet(19, 1); },
    apres: ['Aubergiste — Il a repris son tabouret.', 'Et sa chanson.']
});
pnjQuete(36, 'Milicien', 29, 25, {
    id: 'soldats', type: 'side', titre: 'Le village occupé', img: ['Actor1', 4],
    desc: 'Des soldats tiennent les ruelles du Village Montagnard et prennent ce qu\'ils veulent. Le milicien n\'a plus assez d\'hommes.',
    de: 'Le milicien', lieu: 'Village Montagnard',
    intro: ['Milicien — Ils sont entrés en disant qu\'ils', 'passaient. Ils sont restés. Quatre soldats', 'de moins et le sous-capitaine repartira', 'de lui-même.'],
    objectifs: ['Chasser des soldats (%1 / %2)', 'Revenir voir le milicien'], prix: ['400 or', 'Adrénaline ×2'],
    commandes: ['chasse soldats 1 4 "soldat "'],
    accepte: ['Milicien — Ils patrouillent par deux.', 'Ne les prends pas de front à un contre deux.'],
    attente: ['Milicien — Quatre. Je te couvre depuis ici,', 'c\'est tout ce que je peux.'],
    condition: function (b, oui, non) { b.siScript(objDone('soldats', 1), oui, non); },
    reussite: ['Milicien — Ils plient bagage. Le village', 'te doit ses ruelles. Tiens.'],
    paie: function (b) { b.or(400); b.objet(20, 2); },
    apres: ['Milicien — On respire. Merci.']
});
pnjQuete(52, 'Intendant de la Forteresse', 24, 20, {
    id: 'duo', type: 'side', titre: 'Le duo infernal', img: ['People1', 1],
    desc: 'Luc et Ève tiennent le Manoir derrière la Forteresse. Personne n\'en est revenu avec ses bottes. L\'intendant paie pour les deux têtes.',
    de: 'L\'intendant', lieu: 'Forteresse',
    intro: ['Intendant — Luc et Ève. Le Manoir, derrière.', 'Ils ne sont que deux et c\'est déjà trop.', 'Va voir d\'abord. Frappe ensuite.', 'Je paie les deux têtes.'],
    objectifs: ['Fouiller le Manoir', 'Abattre Luc', 'Abattre Ève', 'Revenir voir l\'intendant'], prix: ['1 000 or', 'Élixir ×1'],
    commandes: ['visite duo 1 54', 'chasse duo 2 1 "luc "', 'chasse duo 3 1 "eve "'],
    accepte: ['Intendant — Ils se battent ensemble. Sépare-les', 'si tu peux.'],
    attente: ['Intendant — Les deux. Je ne paie pas la', 'moitié.'],
    condition: function (b, oui, non) { b.siScript(objDone('duo', 2) + ' && ' + objDone('duo', 3), oui, non); },
    reussite: ['Intendant — Les deux. Le Manoir va enfin', 'pouvoir s\'aérer. Voilà ta part.'],
    paie: function (b) { b.or(1000); b.objet(22, 1); },
    apres: ['Intendant — Leur chef, lui, est toujours', 'là-haut. Quand tu voudras.']
});
pnjQuete(52, 'Intendant — le chef', 26, 20, {
    id: 'chef', type: 'side', titre: 'Le chef des bandits', img: ['People1', 0],
    desc: 'Le chef des bandits, celui qui a muté, règne au sommet du Manoir. Après Luc et Ève, il ne reste que lui.',
    de: 'L\'intendant', lieu: 'Forteresse',
    intro: ['Intendant — Le chef. Il a changé, là-haut.', 'On ne sait pas en quoi. Personne ne l\'a', 'revu de près. Après le duo, c\'est lui.'],
    objectifs: ['Abattre le chef des bandits', 'Revenir voir l\'intendant'], prix: ['2 000 or', 'Élixir Suprême ×1'],
    commandes: ['chasse chef 1 1 "chef des bandit muta"'],
    accepte: ['Intendant — Tout en haut du Manoir.', 'Ne monte pas blessé.'],
    attente: ['Intendant — Il est encore là-haut. Je', 'l\'entends d\'ici.'],
    condition: function (b, oui, non) { b.siScript(objDone('chef', 1), oui, non); },
    reussite: ['Intendant — C\'est fini. Le Manoir est', 'à nouveau une maison. Prends tout ça.'],
    paie: function (b) { b.or(2000); b.objet(23, 1); },
    apres: ['Intendant — Merci. Vraiment.']
});
pnjQuete(43, 'Apothicaire', 6, 7, {
    id: 'herbes', type: 'side', titre: 'L\'apothicaire manque d\'herbes', img: ['People2', 6],
    desc: 'L\'apothicaire du Magasin d\'Objets n\'a plus d\'Herbe Dissipatrice pour ses remèdes. Trois brins suffiraient.',
    de: 'L\'apothicaire', lieu: 'Magasin d\'Objets',
    intro: ['Apothicaire — Mes remèdes tiennent avec de', 'l\'Herbe Dissipatrice, et je n\'en ai plus.', 'Trois brins. Le Marché en vend, les', 'bandits en portent.'],
    objectifs: ['Rapporter 3 Herbes Dissipatrices'], prix: ['Remède Universel ×2', '100 or'],
    accepte: ['Apothicaire — Trois. Et pas fanées.'],
    attente: ['Apothicaire — Trois brins d\'Herbe', 'Dissipatrice. Je n\'ai pas bougé.'],
    condition: function (b, oui, non) { b.siScript('$gameParty.numItems($dataItems[3]) >= 3', oui, non); },
    reussite: ['Apothicaire — Fraîches. Tiens, mes deux', 'premiers remèdes sont pour toi.'],
    paie: function (b) { b.retirer(3, 3); b.objet(26, 2); b.or(100); },
    apres: ['Apothicaire — Reviens quand tu tousses.']
});
// JOKO, 2026-11-09 (« tout ») : sa quête est à Sora, la fille du pêcheur (habitants/refonte/peche.js) ; le ✎ ne se pose plus
rendue(33, 'Fille du pêcheur', 'Sora', {
    id: 'lucioles', type: 'side', titre: 'Des lucioles pour le pêcheur', img: ['People1', 3],
    desc: 'Le pêcheur ne sort plus la nuit sans lanterne. Sa fille cherche deux Bocaux à Lucioles.',
    de: 'La fille du pêcheur', lieu: 'Village de Pêche',
    intro: ['Fille — Mon père pêche la nuit, et la nuit', 'il ne voit plus le fil. Deux Bocaux à', 'Lucioles, et il rentrera avec autre chose', 'que des ampoules.'],
    objectifs: ['Rapporter 2 Bocaux à Lucioles'], prix: ['Appât ×5', '150 or'],
    accepte: ['Fille — Deux. Merci. Les lucioles, on en', 'trouve au Marché, ou dans la Caverne.'],
    attente: ['Fille — Deux Bocaux à Lucioles. Il attend', 'la nuit pour sortir.'],
    condition: function (b, oui, non) { b.siScript('$gameParty.numItems($dataItems[7]) >= 2', oui, non); },
    reussite: ['Fille — Il va y voir. Tiens, ses appâts :', 'il dit que les tiens sont trop gros.'],
    paie: function (b) { b.retirer(7, 2); b.objet(111, 5); b.or(150); },
    apres: ['Fille — Il est rentré avec deux poissons', 'et pas une ampoule.']
});

// ── ENQUÊTES : le chant du lac, la tombe sans nom ────────────────────────
// JOKO, 2026-11-09 : « Mer plutôt » ; la quête est à Orin, « Le chant de la mer » (habitants/refonte/peche.js)
rendue(33, 'Vieux pêcheur', 'Orin', {
    id: 'lac', type: 'side', titre: 'Le chant du lac', img: ['People1', 4],
    desc: 'Le barde du bar jure que certains soirs, le lac chante une note très basse. Un vieux pêcheur dit où l\'écouter : au bord, la nuit.',
    de: 'Le vieux pêcheur', lieu: 'Village de Pêche',
    intro: ['Vieux pêcheur — Le lac chante. Pas le jour.', 'La nuit, au bord, là où l\'eau est noire.', 'Va l\'écouter, et reviens me dire si tu', 'es revenu pareil.'],
    objectifs: ['Écouter le lac, la nuit, au bord de l\'eau', 'Revenir voir le vieux pêcheur'], prix: ['Note Tenue ×1', '200 or'],
    accepte: ['Vieux pêcheur — La nuit. Le jour, il se tait.'],
    attente: ['Vieux pêcheur — Alors ? Tu as attendu la nuit ?', 'Au bord, l\'eau noire.'],
    condition: function (b, oui, non) { b.siScript(objDone('lac', 1), oui, non); },
    reussite: ['Vieux pêcheur — Une note. Très basse. Tu l\'as', 'entendue. Garde ça : c\'est elle, tenue.'],
    paie: function (b) { b.objet(93, 1); b.or(200); },
    apres: ['Vieux pêcheur — N\'y retourne pas trop souvent.']
});
(function () {
    // La rive : un événement invisible, au bord de l'eau, qui n'écoute que la nuit (TS · Nuit, interrupteur 205).
    var b = new Bloc();
    b.siScript(statut('lac') + " === 'active' && !" + objDone('lac', 1), function (b) {
        b.si([0, 205, 0], function (b) {
            b.son('Darkness4');
            b.texte(['Une note. Une seule, très basse, venue', 'de sous la mer. Elle tient plus longtemps', 'qu\'un souffle. Puis plus rien.']);
            b.quest('step lac 1');
        }, function (b) { b.texte(['La mer est noire et ne dit rien.', 'Le jour, il se tait.']); });
    }, function (b) { b.texte(['La mer est noire, ici.']); });
    retirerPose(33, 'Rive du lac');                       // 2026-11-09 : la mer, plus le lac
    poser(33, 'Rive', 8, 37, [page(b, { priorite: 0 })]);
})();
(function () {
    // La tombe sans nom du cimetière : la rumeur de Marn. Lire la stèle ouvre la quête ; de l'Encens Sacré la referme.
    var p0 = new Bloc();
    p0.texte(['Une tombe. Plus vieille que le village,', 'et sans un nom dessus. Quelqu\'un a gratté', 'la pierre, il y a longtemps.']);
    p0.choix(['Se recueillir', 'Passer'], [function (b) {
        b.quest('add side tombe "La tombe sans nom" "Au cimetière du Village Montagnard, une tombe plus vieille que le village, sans nom. Marn le fossoyeur en parle à voix basse. De l\'Encens Sacré, peut-être, pour ce qui dort dessous."');
        b.quest('de tombe "La tombe elle-même" "Village Montagnard"');
        b.quest('obj tombe "Brûler de l\'Encens Sacré sur la tombe"'); b.quest('prix tombe "Éclat d\'Âme ×1"'); b.quest('track tombe');
        b.texte(['Le silence dure. Il manque quelque chose', 'à cette tombe. De l\'encens, peut-être.']);
        b.self('A');
    }, function (b) { }]);
    var p1 = new Bloc();
    p1.siObjet(60, function (b) {
        b.choix(['Brûler l\'Encens Sacré', 'Pas maintenant'], [function (b) {
            b.retirer(60, 1); b.son('Saint5');
            b.texte(['L\'encens monte droit. La pierre, un instant,', 'semble porter un nom — puis il s\'efface.', 'Quelque chose a été rendu.']);
            b.objet(80, 1); b.quest('done tombe'); b.self('B');
        }, function (b) { }]);
    }, function (b) { b.texte(['Il manque de l\'encens. De l\'Encens Sacré,', 'celui du Marché.']); });
    var p2 = new Bloc(); p2.texte(['La tombe sans nom. Le silence y est', 'moins lourd, maintenant.']);
    poser(36, 'Tombe sans nom', 12, 36, [page(p0, { img: ['!Other1', 4] }), page(p1, { img: ['!Other1', 4], self: 'A' }), page(p2, { img: ['!Other1', 4], self: 'B' })]);
})();

// ── LA CHAÎNE D'ÉCHANGES (Zelda : un objet en appelle un autre) ──────────
(function () {
    // ① la femme du pêcheur : un Bocal à Lucioles contre du Fil de Suture
    var a0 = new Bloc();
    a0.siScript(statut('troc') + " === 'none'", function (b) {
        b.texte(['Femme du pêcheur — Tu as l\'air de courir', 'partout. Un Bocal à Lucioles contre le Fil', 'de Suture de ma mère ? Il ne me sert plus.', 'La tisserande de la montagne le cherche.']);
        b.choix(['Marché conclu', 'Non merci'], [function (b) {
            b.quest('add side troc "La chaîne des échanges" "Un Bocal à Lucioles contre du Fil de Suture. Du Fil de Suture contre une Braise Froide. Une Braise Froide contre… on verra. Chaque troc mène au suivant."');
            b.quest('de troc "La femme du pêcheur" "Village de Pêche"');
            b.quest('obj troc "Donner un Bocal à Lucioles à la femme du pêcheur"'); b.quest('obj troc "Porter le Fil de Suture à la tisserande"'); b.quest('obj troc "Porter la Braise Froide au forgeron"');
            b.quest('prix troc "Ce que le forgeron en fera."'); b.quest('track troc');
            b.texte(['Femme du pêcheur — Reviens avec le bocal.']);
        }, function (b) { }]);
    }, function (b) {
        b.siScript(statut('troc') + " === 'active' && !" + objDone('troc', 1), function (b) {
            b.siObjet(7, function (b) {
                b.retirer(7, 1); b.objet(87, 1);
                b.texte(['Femme du pêcheur — Le bocal. Et voilà le fil.', 'La tisserande, au Village Montagnard.']);
                b.quest('step troc 1');
            }, function (b) { b.texte(['Femme du pêcheur — Un Bocal à Lucioles.', 'Le Marché en vend.']); });
        }, function (b) { b.texte(['Femme du pêcheur — Le fil est parti', 'faire sa route.']); });
    });
    poser(33, 'Femme du pêcheur', 32, 26, [page(a0, { img: ['People2', 3] })]);
    // ② la tisserande : le Fil de Suture contre une Braise Froide
    var t0 = new Bloc();
    t0.siScript(statut('troc') + " === 'active' && " + objDone('troc', 1) + ' && !' + objDone('troc', 2), function (b) {
        b.siObjet(87, function (b) {
            b.retirer(87, 1); b.objet(88, 1);
            b.texte(['Tisserande — Le fil de sa mère ! Je le', 'cherchais depuis l\'hiver. Prends cette', 'Braise Froide : le forgeron de la ville', 'sait quoi en faire.']);
            b.quest('step troc 2');
        }, function (b) { b.texte(['Tisserande — Tu as le Fil de Suture ?']); });
    }, function (b) { b.texte(['Tisserande — Je tisse. Ça se voit.']); });
    poser(36, 'Tisserande', 14, 18, [page(t0, { img: ['People2', 3] })]);
    // ③ le forgeron : la Braise Froide contre une lame
    var f0 = new Bloc();
    f0.siScript(statut('troc') + " === 'active' && " + objDone('troc', 2), function (b) {
        b.siObjet(88, function (b) {
            b.retirer(88, 1); b.son('Sword1'); b.arme(15, 1);
            b.texte(['Forgeron — Une Braise Froide. Ça ne brûle', 'pas, ça trempe. Attends.', '…', 'Tiens. Une Épée de clair de lune. Elle', 'est à toi, la braise valait ça.']);
            b.quest('step troc 3'); b.quest('done troc');
        }, function (b) { b.texte(['Forgeron — Tu devais m\'apporter une braise.']); });
    }, function (b) { b.texte(['Forgeron — Les lames, c\'est à côté.', 'Moi, je les fais.']); });
    poser(41, 'Forgeron', 8, 6, [page(f0, { img: ['People3', 2] })]);
})();

// ── LES QUÊTES DE PERSONNAGE : le maître d'armes, une par héros ──────────
(function () {
    var img = ['Actor3', 1], V = ['Actor3', 1];
    var p0 = new Bloc();
    p0.texte(['Maître d\'armes — Quatre. Vous êtes quatre et', 'aucun de vous ne se bat comme les autres.', 'Ça m\'intéresse. Vesper, d\'abord : tes trois', 'Styles. Change-en cinq fois en combat.']);
    p0.choix(['D\'accord', 'Plus tard'], [function (b) {
        b.quest('add perso vesper "Le sang qui répond" "Le maître d\'armes veut voir Vesper changer de Style au milieu du combat : Lame, Garde, Saignée. Cinq changements, sans perdre un tour."');
        b.quest('de vesper "Le maître d\'armes" "Ville Forestière"'); b.quest('obj vesper "Changer de Style en combat (%1 / %2)"'); b.quest('prix vesper "Fiole de Sang ×2"');
        b.quest('style vesper 1 5'); b.quest('track vesper');
        b.texte(['Maître d\'armes — Le menu « style », en combat.', 'Ça ne coûte pas le tour. Sers-t\'en.']);
        b.self('A');
    }, function (b) { b.texte(['Maître d\'armes — Quand tu voudras.']); }]);
    var p1 = new Bloc();
    p1.siScript(objDone('vesper', 1), function (b) {
        b.texte(['Maître d\'armes — Cinq. Et tu tiens debout.', 'Tiens, du sang en fiole : pour la Saignée.', 'Korrah, maintenant : ton Avatar. Donne-lui', 'trois ordres en combat.']);
        b.objet(70, 2); b.quest('done vesper');
        b.quest('add perso korrah "L\'Avatar obéit" "Le maître d\'armes veut voir l\'Avatar de Korrah répondre : « Protège-le », « Soigne-le ». Trois ordres donnés en combat."');
        b.quest('de korrah "Le maître d\'armes" "Ville Forestière"'); b.quest('obj korrah "Donner un ordre à l\'Avatar (%1 / %2)"'); b.quest('prix korrah "Éther Supérieur ×2"');
        b.quest('usage korrah 1 3 1263 1264'); b.quest('track korrah');
        b.self('B');
    }, function (b) { b.texte(['Maître d\'armes — Cinq changements. Je regarde.']); });
    var p2 = new Bloc();
    p2.siScript(objDone('korrah', 1), function (b) {
        b.texte(['Maître d\'armes — Il obéit. Pas toujours vite,', 'mais il obéit. Tiens. ludwing, à toi : tes', 'âmes. Invoque-les trois fois — Jugement des', 'Défunts ou Rappel des Âmes.']);
        b.objet(16, 2); b.quest('done korrah');
        b.quest('add perso ludwing "Les âmes répondent" "Le maître d\'armes veut voir ludwing appeler ses familiers spirituels : Jugement des Défunts, Rappel des Âmes. Trois invocations — chacune coûte des âmes."');
        b.quest('de ludwing "Le maître d\'armes" "Ville Forestière"'); b.quest('obj ludwing "Invoquer ses familiers (%1 / %2)"'); b.quest('prix ludwing "Larme d\'Âme ×1"');
        b.quest('usage ludwing 1 3 124 125'); b.quest('track ludwing');
        b.self('C');
    }, function (b) { b.texte(['Maître d\'armes — Trois ordres à l\'Avatar.', 'Je regarde.']); });
    var p3 = new Bloc();
    p3.siScript(objDone('ludwing', 1), function (b) {
        b.texte(['Maître d\'armes — Elles répondent. Toujours.', 'Tiens, une larme. Aël, la dernière : tes', 'Portes. Ouvres-en trois en combat.']);
        b.objet(78, 1); b.quest('done ludwing');
        b.quest('add perso ael "Les Portes s\'ouvrent" "Le maître d\'armes veut voir Aël ouvrir ses Portes : le Voile, l\'Oubli, le Gouffre, les Pieux, la Fermeture, l\'Allègement. Trois Portes ouvertes en combat."');
        b.quest('de ael "Le maître d\'armes" "Ville Forestière"'); b.quest('obj ael "Ouvrir une Porte (%1 / %2)"'); b.quest('prix ael "Méga Éther ×2"');
        b.quest('usage ael 1 3 1273 1274 1275 1276 1277 1278'); b.quest('track ael');
        b.self('D');
    }, function (b) { b.texte(['Maître d\'armes — Trois invocations. Je regarde.']); });
    var p4 = new Bloc();
    p4.siScript(objDone('ael', 1), function (b) {
        b.siScript(statut('ael') + " === 'active'", function (b) {
            b.texte(['Maître d\'armes — Trois Portes. Vous êtes', 'quatre, et vous êtes une équipe. Je n\'ai', 'plus rien à vous apprendre. Tiens.']);
            b.objet(17, 2); b.or(500); b.quest('done ael');
        }, function (b) { b.texte(['Maître d\'armes — Vous êtes une équipe.', 'Ne l\'oubliez pas.']); });
    }, function (b) { b.texte(['Maître d\'armes — Trois Portes. Je regarde.']); });
    poser(29, 'Maître d\'armes', 36, 22, [page(p0, { img: img }), page(p1, { img: img, self: 'A' }), page(p2, { img: img, self: 'B' }), page(p3, { img: img, self: 'C' }), page(p4, { img: img, self: 'D' })]);
})();

// ═══════════════════════════════════════════════════════════════════════════
journal.forEach(function (l) { console.log('  ' + l); });
console.log('\n  ' + remises + ' commandes QUEST remises · ' + poses + ' événements posés');
if (MONTRE) { console.log('  (--montre : rien n\'est écrit)'); process.exit(0); }
Object.keys(cartes).forEach(function (id) { if (cartes[id].modifiee) { ecrireCarte(id, cartes[id].data); } });
if (ceModifie) { ecrireTableau('CommonEvents', CE); }
console.log('  cartes écrites : ' + Object.keys(cartes).filter(function (id) { return cartes[id].modifiee; }).join(', '));
