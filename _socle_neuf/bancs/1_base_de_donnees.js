/*
 * BANC 1 — la base de données
 * ---------------------------------------------------------------------------
 * Contrôle data/System.json, States.json, Classes.json et Actors.json contre
 * ce que docs/GAME_DESIGN.md et la consigne de JOKO demandent.
 *
 *   node bancs/1_base_de_donnees.js     (depuis la racine du projet)
 *
 * En JavaScript, comme le moteur — une passe écrite dans un autre langage avait
 * déjà sauté en silence toutes les formules contenant « b.def ».
 *
 * Chaque contrôle est joué DEUX FOIS :
 *   1. sur la vraie base — il doit passer ;
 *   2. sur une base sabotée exprès — il doit ÉCHOUER.
 * Un contrôle qui passe dans les deux cas ne mesure rien : le banc le signale.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..');

function charger() {
    var lire = function (nom) {
        return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', nom), 'utf8'));
    };
    return {
        systeme: lire('System.json'),
        etats:   lire('States.json'),
        classes: lire('Classes.json'),
        acteurs: lire('Actors.json')
    };
}
function copie(d) { return JSON.parse(JSON.stringify(d)); }

// ── Outils ───────────────────────────────────────────────────────────────────

// Lit les notetags comme DataManager.extractMetadata de MV : la valeur GARDE
// l'espace après le « : ». C'est le piège ; on le reproduit au lieu de l'éviter.
function metadonnees(note) {
    var meta = {}, re = /<([^<>:]+)(:?)([^>]*)>/g, m;
    while ((m = re.exec(note || '')) !== null) {
        meta[m[1]] = m[2] === ':' ? m[3] : true;   // brut, espace compris
    }
    return meta;
}
function paires(valeurBrute) {
    var o = {};
    String(valeurBrute).split(',').forEach(function (bout) {
        var i = bout.indexOf('=');
        if (i > 0) { o[bout.slice(0, i).trim()] = bout.slice(i + 1).trim(); }
    });
    return o;
}
function etatNomme(d, nom) {
    for (var i = 1; i < d.etats.length; i++) {
        if (d.etats[i] && d.etats[i].name === nom) { return d.etats[i]; }
    }
    return null;
}
function taux(etat, dataId) {
    var t = (etat.traits || []).filter(function (x) { return x.code === 21 && x.dataId === dataId; });
    return t.length ? t[0].value : null;
}
var PVMAX = 0, ATQ = 2, DEF = 3, ATQM = 4, DEFM = 5, AGI = 6;

function seDissipeSeul(e) {
    return e.autoRemovalTiming !== 0 || e.removeAtBattleEnd || e.removeByDamage ||
           e.removeByRestriction || e.removeByWalking;
}

// ── Les contrôles ────────────────────────────────────────────────────────────
// Chacun retourne null si tout va bien, ou une phrase qui dit ce qui cloche.

var CONTROLES = [];
function controle(titre, fn) { CONTROLES.push({ titre: titre, fn: fn }); }

// --- A. Les éléments -------------------------------------------------------

var ELEMENTS_ATTENDUS = {
    1: 'Physique',
    8: 'Feu', 9: 'Eau', 10: 'Vent', 11: 'Terre',
    12: 'Foudre', 13: 'Glace', 14: 'Lumière', 15: 'Ombre',
    17: 'Vapeur', 19: 'Lave', 20: 'Plante', 22: 'Givre', 23: 'Métal',
    29: 'Crépuscule', 30: 'Mana positif', 31: 'Mana spirituel'
};
var TROUS = [2, 3, 4, 5, 6, 7, 16, 18, 21, 24, 25, 26, 27, 28];

controle('les éléments sont à l\'index exact', function (d) {
    var faux = [];
    Object.keys(ELEMENTS_ATTENDUS).forEach(function (id) {
        if (d.systeme.elements[id] !== ELEMENTS_ATTENDUS[id]) {
            faux.push(id + ' = "' + d.systeme.elements[id] + '" au lieu de "' + ELEMENTS_ATTENDUS[id] + '"');
        }
    });
    return faux.length ? faux.join(' · ') : null;
});

controle('les trous réservés sont vides (aucun décalage)', function (d) {
    var pleins = TROUS.filter(function (id) { return d.systeme.elements[id] !== ''; });
    return pleins.length ? 'occupés : ' + pleins.join(', ') : null;
});

controle('la somme de deux fondamentaux retombe sur le bon dérivé', function (d) {
    // La règle du canon : on forge un élément en additionnant deux codes.
    var sommes = [[8, 9, 'Vapeur'], [8, 11, 'Lave'], [9, 11, 'Plante'],
                  [9, 13, 'Givre'], [11, 12, 'Métal'], [14, 15, 'Crépuscule']];
    var faux = sommes.filter(function (s) { return d.systeme.elements[s[0] + s[1]] !== s[2]; })
                     .map(function (s) { return s[0] + '+' + s[1] + ' → "' + d.systeme.elements[s[0] + s[1]] + '" au lieu de ' + s[2]; });
    return faux.length ? faux.join(' · ') : null;
});

controle('System.json a tous les champs que MV lit', function (d) {
    var requis = ['airship', 'armorTypes', 'attackMotions', 'battleBgm', 'battleback1Name',
        'battleback2Name', 'battlerHue', 'battlerName', 'boat', 'currencyUnit', 'defeatMe',
        'editMapId', 'elements', 'equipTypes', 'gameTitle', 'gameoverMe', 'locale',
        'magicSkills', 'menuCommands', 'optDisplayTp', 'optDrawTitle', 'optExtraExp',
        'optFloorDeath', 'optFollowers', 'optSideView', 'optSlipDeath', 'optTransparent',
        'partyMembers', 'ship', 'skillTypes', 'sounds', 'startMapId', 'startX', 'startY',
        'switches', 'terms', 'testBattlers', 'testTroopId', 'title1Name', 'title2Name',
        'titleBgm', 'variables', 'versionId', 'victoryMe', 'weaponTypes', 'windowTone'];
    var manque = requis.filter(function (c) { return !(c in d.systeme); });
    if (manque.length) { return 'champs manquants : ' + manque.join(', '); }
    if (d.systeme.attackMotions.length < d.systeme.weaponTypes.length) {
        return 'attackMotions (' + d.systeme.attackMotions.length + ') plus court que weaponTypes (' +
               d.systeme.weaponTypes.length + ') : MV lira undefined';
    }
    return null;
});

// --- B. Les états ----------------------------------------------------------

controle('l\'état 1 est bien la mort (MV le code en dur)', function (d) {
    var e = d.etats[1];
    if (!e) { return 'aucun état 1'; }
    if (e.restriction !== 4) { return 'l\'état 1 « ' + e.name + ' » n\'a pas la restriction 4'; }
    return null;
});

var ETATS_DEMANDES = ['Manifestation brisée', 'Masque brisé', 'Amulette explosée', 'En creuset',
    'Gelé', 'En fuite', 'Stade 1 — Le Calme', 'Stade 2 — Le Frémissement', 'Stade 3 — La Fièvre',
    'Vœu mineur', 'Vœu majeur', 'Vœu absolu'];

controle('les 12 états demandés existent, nommés et illustrés', function (d) {
    var pb = [];
    ETATS_DEMANDES.forEach(function (nom) {
        var e = etatNomme(d, nom);
        if (!e) { pb.push('manquant : ' + nom); return; }
        if (!e.message1) { pb.push(nom + ' : pas de message d\'application'); }
        if (!e.iconIndex) { pb.push(nom + ' : pas d\'icône'); }
    });
    return pb.length ? pb.join(' · ') : null;
});

controle('Manifestation brisée : ATQ et DÉF de moitié, et ne part pas seule', function (d) {
    var e = etatNomme(d, 'Manifestation brisée');
    if (!e) { return 'état absent'; }
    if (taux(e, ATQ) !== 0.5) { return 'ATQ = ' + taux(e, ATQ) + ' au lieu de 0.5'; }
    if (taux(e, DEF) !== 0.5) { return 'DÉF = ' + taux(e, DEF) + ' au lieu de 0.5'; }
    if (seDissipeSeul(e)) { return 'elle se dissipe toute seule'; }
    return null;
});

controle('Masque brisé = Manifestation brisée + régénération entamée', function (d) {
    var e = etatNomme(d, 'Masque brisé');
    if (!e) { return 'état absent'; }
    if (taux(e, ATQ) !== 0.5 || taux(e, DEF) !== 0.5) { return 'il n\'hérite pas des ×0.5'; }
    if (seDissipeSeul(e)) { return 'il se dissipe tout seul'; }
    var hrg = e.traits.filter(function (t) { return t.code === 22 && t.dataId === 7; });
    if (!hrg.length || hrg[0].value >= 0) { return 'aucune régénération entamée (HRG ≥ 0)'; }
    var m = metadonnees(e.note);
    if (m['retourDegats'] === undefined) { return 'pas de notetag <retourDegats:> pour le plugin'; }
    return null;
});

controle('Amulette explosée = Manifestation brisée + un type scellé QUI EXISTE', function (d) {
    var e = etatNomme(d, 'Amulette explosée');
    if (!e) { return 'état absent'; }
    if (taux(e, ATQ) !== 0.5 || taux(e, DEF) !== 0.5) { return 'il n\'hérite pas des ×0.5'; }
    if (seDissipeSeul(e)) { return 'il se dissipe tout seul'; }
    var sceaux = e.traits.filter(function (t) { return t.code === 42; });
    if (!sceaux.length) { return 'aucun type de compétence scellé'; }
    var id = sceaux[0].dataId;
    // Le piège : sceller un type qui n'existe pas ne produit AUCUNE erreur en jeu.
    if (!d.systeme.skillTypes[id]) {
        return 'il scelle le type ' + id + ', qui est vide dans System.json — un sceau sur du vide';
    }
    return null;
});

controle('En creuset : part à la prochaine attaque subie, et seulement là', function (d) {
    var e = etatNomme(d, 'En creuset');
    if (!e) { return 'état absent'; }
    if (!e.removeByDamage) { return 'il ne part pas sur dégâts'; }
    if (e.chanceByDamage !== 100) { return 'chance de retrait à ' + e.chanceByDamage + ' % au lieu de 100'; }
    if (e.autoRemovalTiming !== 0) { return 'il a aussi une durée en tours'; }
    return null;
});

controle('Gelé : ralentit ET ronge', function (d) {
    var e = etatNomme(d, 'Gelé');
    if (!e) { return 'état absent'; }
    var agi = taux(e, AGI);
    if (agi === null || agi >= 1) { return 'il ne ralentit pas (AGI ' + agi + ')'; }
    var hrg = e.traits.filter(function (t) { return t.code === 22 && t.dataId === 7; });
    if (!hrg.length || hrg[0].value >= 0) { return 'aucun dégât par tour'; }
    return null;
});

controle('En fuite : un marqueur, sans effet de statistique', function (d) {
    var e = etatNomme(d, 'En fuite');
    if (!e) { return 'état absent'; }
    if (e.traits.length) { return 'il porte ' + e.traits.length + ' trait(s) : ce n\'est plus un marqueur neutre'; }
    if (seDissipeSeul(e)) { return 'il se dissipe tout seul, il ne peut rien détecter'; }
    return null;
});

controle('les trois stades montent : force, puis agilité, puis la Fièvre', function (d) {
    var c = etatNomme(d, 'Stade 1 — Le Calme');
    var f = etatNomme(d, 'Stade 2 — Le Frémissement');
    var v = etatNomme(d, 'Stade 3 — La Fièvre');
    if (!c || !f || !v) { return 'un stade manque'; }
    if (!(taux(c, ATQ) > 1)) { return 'le Calme ne donne pas de bonus de force'; }
    if (!(taux(f, AGI) > 1)) { return 'le Frémissement ne donne pas de bonus d\'agilité'; }
    if (!(taux(v, ATQ) > 1) || !(taux(v, ATQM) > 1)) { return 'la Fièvre n\'est pas offensive'; }
    if (!(taux(v, DEF) < 1) || !(taux(v, DEFM) < 1)) { return 'la Fièvre ne coûte rien en défense'; }
    if (!(taux(v, ATQ) > taux(c, ATQ))) { return 'la Fièvre frappe moins fort que le Calme'; }
    return null;
});

controle('les trois vœux sont strictement croissants', function (d) {
    var rangs = ['Vœu mineur', 'Vœu majeur', 'Vœu absolu'].map(function (n) { return etatNomme(d, n); });
    if (rangs.indexOf(null) >= 0) { return 'un vœu manque'; }
    var m = rangs.map(function (e) { return taux(e, ATQ); });
    if (m.indexOf(null) >= 0) { return 'un vœu n\'a pas de multiplicateur'; }
    if (!(m[0] < m[1] && m[1] < m[2])) { return 'multiplicateurs non croissants : ' + m.join(' / '); }
    if (!(m[0] > 1)) { return 'le vœu mineur ne multiplie rien (' + m[0] + ')'; }
    return null;
});

// --- C. Les classes --------------------------------------------------------

controle('les 4 classes existent avec des courbes complètes', function (d) {
    var noms = ['Chasseur de monstres', 'Chasseur d\'insectes', 'Écrivain', 'Mage stellaire'];
    var pb = [];
    noms.forEach(function (n) {
        var c = null;
        for (var i = 1; i < d.classes.length; i++) { if (d.classes[i] && d.classes[i].name === n) { c = d.classes[i]; } }
        if (!c) { pb.push('manquante : ' + n); return; }
        if (c.params.length !== 8) { pb.push(n + ' : ' + c.params.length + ' paramètres au lieu de 8'); return; }
        c.params.forEach(function (serie, i) {
            if (serie.length !== 100) { pb.push(n + ' : paramètre ' + i + ' a ' + serie.length + ' niveaux au lieu de 100'); }
        });
    });
    return pb.length ? pb.join(' · ') : null;
});

controle('les courbes montent à chaque niveau (aucun palier mort)', function (d) {
    var pb = [];
    for (var i = 1; i < d.classes.length; i++) {
        var c = d.classes[i];
        if (!c) { continue; }
        c.params.forEach(function (serie, p) {
            for (var lvl = 2; lvl <= 99; lvl++) {
                if (serie[lvl] < serie[lvl - 1]) { pb.push(c.name + ' : paramètre ' + p + ' recule au niveau ' + lvl); return; }
            }
            if (serie[99] <= serie[1]) { pb.push(c.name + ' : paramètre ' + p + ' ne monte jamais'); }
        });
    }
    return pb.length ? pb.join(' · ') : null;
});

controle('l\'Écrivain est le plus mauvais combattant, à TOUS les niveaux', function (d) {
    var e = null, autres = [];
    for (var i = 1; i < d.classes.length; i++) {
        if (!d.classes[i]) { continue; }
        if (d.classes[i].name === 'Écrivain') { e = d.classes[i]; } else { autres.push(d.classes[i]); }
    }
    if (!e) { return 'classe Écrivain absente'; }
    // On mesure niveau par niveau, pas seulement au niveau 1 : une courbe peut
    // très bien démarrer plus bas et rattraper tout le monde au niveau 40.
    for (var lvl = 1; lvl <= 99; lvl++) {
        for (var j = 0; j < autres.length; j++) {
            if (e.params[PVMAX][lvl] >= autres[j].params[PVMAX][lvl]) {
                return 'PV : au niveau ' + lvl + ' il rattrape ' + autres[j].name;
            }
            if (e.params[ATQ][lvl] >= autres[j].params[ATQ][lvl]) {
                return 'ATQ : au niveau ' + lvl + ' il rattrape ' + autres[j].name;
            }
            if (e.params[ATQM][lvl] <= autres[j].params[ATQM][lvl]) {
                return 'ATQm : au niveau ' + lvl + ' il ne domine plus ' + autres[j].name;
            }
        }
    }
    return null;
});

controle('aucune classe ne renvoie vers un type d\'arme ou d\'armure vide', function (d) {
    var pb = [];
    for (var i = 1; i < d.classes.length; i++) {
        var c = d.classes[i];
        if (!c) { continue; }
        c.traits.forEach(function (t) {
            if (t.code === 51 && !d.systeme.weaponTypes[t.dataId]) { pb.push(c.name + ' : type d\'arme ' + t.dataId + ' vide'); }
            if (t.code === 52 && !d.systeme.armorTypes[t.dataId]) { pb.push(c.name + ' : type d\'armure ' + t.dataId + ' vide'); }
            // Le piège MV : une compétence dont le type n'est ouvert par aucun
            // trait est apprise mais INVISIBLE dans tous les menus.
            if (t.code === 41 && !d.systeme.skillTypes[t.dataId]) { pb.push(c.name + ' : ouvre le type de compétence ' + t.dataId + ', qui est vide'); }
        });
    }
    return pb.length ? pb.join(' · ') : null;
});

// --- D. Les acteurs --------------------------------------------------------

var MANIFESTATIONS = {
    Vesper: { type: 'objet',  nom: 'Le Masque',   endurance: 140, jauge: 'Saturation' },
    Ludwig: { type: 'objet',  nom: "L'Amulette",  endurance: 90,  jauge: 'Ombre' },
    'Aël':  { type: 'arme',   nom: "L'Arc",       endurance: 110, jauge: null },
    Korrah: { type: 'avatar', nom: 'Les Poings',  endurance: 160, jauge: null }
};

controle('les 4 acteurs existent et pointent vers une classe réelle', function (d) {
    var pb = [];
    Object.keys(MANIFESTATIONS).forEach(function (nom) {
        var a = null;
        for (var i = 1; i < d.acteurs.length; i++) { if (d.acteurs[i] && d.acteurs[i].name === nom) { a = d.acteurs[i]; } }
        if (!a) { pb.push('manquant : ' + nom); return; }
        if (!d.classes[a.classId]) { pb.push(nom + ' : classe ' + a.classId + ' inexistante'); }
    });
    return pb.length ? pb.join(' · ') : null;
});

controle('chaque acteur a autant de slots que System.json en déclare', function (d) {
    var attendu = d.systeme.equipTypes.length - 1;
    var pb = [];
    for (var i = 1; i < d.acteurs.length; i++) {
        var a = d.acteurs[i];
        if (a && a.equips.length !== attendu) {
            pb.push(a.name + ' : ' + a.equips.length + ' slots au lieu de ' + attendu);
        }
    }
    return pb.length ? pb.join(' · ') : null;
});

controle('les notetags <manifestation> se lisent comme MV les lira', function (d) {
    var pb = [];
    for (var i = 1; i < d.acteurs.length; i++) {
        var a = d.acteurs[i];
        if (!a) { continue; }
        var attendu = MANIFESTATIONS[a.name];
        if (!attendu) { continue; }
        var meta = metadonnees(a.note);
        if (meta['manifestation'] === undefined) { pb.push(a.name + ' : pas de <manifestation>'); continue; }
        // Piège MV : la métadonnée garde l'espace après le « : ».
        if (String(meta['manifestation']).charAt(0) !== ' ') {
            pb.push(a.name + ' : la métadonnée ne commence pas par l\'espace attendu — le notetag est malformé');
            continue;
        }
        var p = paires(meta['manifestation']);
        if (p.type !== attendu.type) { pb.push(a.name + ' : type "' + p.type + '" au lieu de "' + attendu.type + '"'); }
        if (p.nom !== attendu.nom) { pb.push(a.name + ' : nom "' + p.nom + '" au lieu de "' + attendu.nom + '"'); }
        if (Number(p.endurance) !== attendu.endurance) { pb.push(a.name + ' : endurance ' + p.endurance + ' au lieu de ' + attendu.endurance); }
        if (['arme', 'objet', 'avatar'].indexOf(p.type) < 0) { pb.push(a.name + ' : forme "' + p.type + '" hors des trois du canon'); }
    }
    return pb.length ? pb.join(' · ') : null;
});

controle('seuls les porteurs d\'un OBJET ont une seconde jauge', function (d) {
    // La règle du canon : la seconde jauge est le propre des Objets.
    // Ce contrôle doit attraper le vrai coupable ET innocenter les faux :
    // une jauge sur Aël (arme) ou Korrah (avatar) est une faute ; son absence
    // chez eux n'en est pas une.
    var pb = [];
    for (var i = 1; i < d.acteurs.length; i++) {
        var a = d.acteurs[i];
        if (!a) { continue; }
        var meta = metadonnees(a.note);
        var p = paires(meta['manifestation'] || '');
        var aJauge = meta['jaugePropre'] !== undefined;
        if (p.type === 'objet' && !aJauge) { pb.push(a.name + ' porte un Objet mais n\'a pas de <jaugePropre>'); }
        if (p.type !== 'objet' && aJauge) { pb.push(a.name + ' porte un ' + p.type + ' et a quand même une <jaugePropre>'); }
        if (aJauge) {
            var j = paires(meta['jaugePropre']);
            var attendu = MANIFESTATIONS[a.name];
            if (attendu && attendu.jauge && j.nom !== attendu.jauge) { pb.push(a.name + ' : jauge "' + j.nom + '" au lieu de "' + attendu.jauge + '"'); }
            if (Number(j.seuil) > Number(j.max)) { pb.push(a.name + ' : seuil de rupture (' + j.seuil + ') au-dessus du max (' + j.max + ') — il ne tombera jamais'); }
            if (['brisure', 'explosion'].indexOf(j.rupture) < 0) { pb.push(a.name + ' : rupture "' + j.rupture + '" inconnue'); }
        }
    }
    return pb.length ? pb.join(' · ') : null;
});

controle('chaque héros n\'a QU\'UNE manifestation', function (d) {
    // La règle d'or du monde. Elle s'est déjà fait violer une fois.
    var pb = [];
    for (var i = 1; i < d.acteurs.length; i++) {
        var a = d.acteurs[i];
        if (!a) { continue; }
        var n = (a.note.match(/<manifestation\s*:/g) || []).length;
        if (n > 1) { pb.push(a.name + ' en porte ' + n); }
    }
    return pb.length ? pb.join(' · ') : null;
});

// ── Les sabotages : chacun doit faire tomber le contrôle qu'il vise ──────────

var SABOTAGES = [
    ['les éléments sont à l\'index exact',
     function (d) { d.systeme.elements[29] = 'Crepuscule'; }],
    ['les trous réservés sont vides (aucun décalage)',
     function (d) { d.systeme.elements[16] = 'Intrus'; }],
    ['la somme de deux fondamentaux retombe sur le bon dérivé',
     function (d) { d.systeme.elements[17] = 'Brume'; }],
    ['System.json a tous les champs que MV lit',
     function (d) { delete d.systeme.terms; }],
    ['l\'état 1 est bien la mort (MV le code en dur)',
     function (d) { d.etats[1].restriction = 0; }],
    ['les 12 états demandés existent, nommés et illustrés',
     function (d) { etatNomme(d, 'Gelé').message1 = ''; }],
    ['Manifestation brisée : ATQ et DÉF de moitié, et ne part pas seule',
     function (d) { etatNomme(d, 'Manifestation brisée').removeAtBattleEnd = true; }],
    ['Masque brisé = Manifestation brisée + régénération entamée',
     function (d) { var e = etatNomme(d, 'Masque brisé');
                    e.traits = e.traits.filter(function (t) { return !(t.code === 22 && t.dataId === 7); }); }],
    ['Amulette explosée = Manifestation brisée + un type scellé QUI EXISTE',
     function (d) { etatNomme(d, 'Amulette explosée').traits.forEach(function (t) { if (t.code === 42) { t.dataId = 7; } }); }],
    ['En creuset : part à la prochaine attaque subie, et seulement là',
     function (d) { etatNomme(d, 'En creuset').removeByDamage = false; }],
    ['Gelé : ralentit ET ronge',
     function (d) { var e = etatNomme(d, 'Gelé');
                    e.traits.forEach(function (t) { if (t.code === 21 && t.dataId === AGI) { t.value = 1.2; } }); }],
    ['En fuite : un marqueur, sans effet de statistique',
     function (d) { etatNomme(d, 'En fuite').traits.push({ code: 21, dataId: ATQ, value: 1.5 }); }],
    ['les trois stades montent : force, puis agilité, puis la Fièvre',
     function (d) { var v = etatNomme(d, 'Stade 3 — La Fièvre');
                    v.traits.forEach(function (t) { if (t.code === 21 && t.dataId === DEF) { t.value = 1.5; } }); }],
    ['les trois vœux sont strictement croissants',
     function (d) { var e = etatNomme(d, 'Vœu absolu');
                    e.traits.forEach(function (t) { if (t.code === 21) { t.value = 1.1; } }); }],
    ['les 4 classes existent avec des courbes complètes',
     function (d) { d.classes[3].params[0] = [1, 2, 3]; }],
    ['les courbes montent à chaque niveau (aucun palier mort)',
     function (d) { d.classes[1].params[2][40] = 0; }],
    ['l\'Écrivain est le plus mauvais combattant, à TOUS les niveaux',
     function (d) { for (var l = 0; l <= 99; l++) { d.classes[3].params[2][l] = 9999; } }],
    ['aucune classe ne renvoie vers un type d\'arme ou d\'armure vide',
     function (d) { d.classes[1].traits.push({ code: 51, dataId: 3, value: 0 }); }],
    ['les 4 acteurs existent et pointent vers une classe réelle',
     function (d) { d.acteurs[1].classId = 42; }],
    ['chaque acteur a autant de slots que System.json en déclare',
     function (d) { d.acteurs[2].equips = [0, 0, 0, 0, 0]; }],
    ['les notetags <manifestation> se lisent comme MV les lira',
     function (d) { d.acteurs[3].note = d.acteurs[3].note.replace('type=arme', 'type=épée'); }],
    ['seuls les porteurs d\'un OBJET ont une seconde jauge',
     function (d) { d.acteurs[4].note += '\n<jaugePropre: nom=Givre, max=100, seuil=100, rupture=brisure>'; }],
    ['chaque héros n\'a QU\'UNE manifestation',
     function (d) { d.acteurs[1].note += '\n<manifestation: type=arme, nom=Une seconde, endurance=50>'; }]
];

// ── Exécution ────────────────────────────────────────────────────────────────

function lancer() {
    var vraie = charger();
    var echecs = 0, muets = 0;

    console.log('BANC 1 — la base de données\n');
    console.log('1) Sur la vraie base — tout doit passer');
    console.log('   ' + new Array(70).join('-'));
    CONTROLES.forEach(function (c) {
        var r;
        try { r = c.fn(vraie); } catch (err) { r = 'exception : ' + err.message; }
        if (r) { echecs++; console.log('   ✗ ' + c.titre + '\n       → ' + r); }
        else { console.log('   ✓ ' + c.titre); }
    });

    console.log('\n2) Contre-épreuve — chaque contrôle doit tomber quand on sabote ce qu\'il vise');
    console.log('   ' + new Array(70).join('-'));
    SABOTAGES.forEach(function (s) {
        var titre = s[0];
        var c = null;
        CONTROLES.forEach(function (x) { if (x.titre === titre) { c = x; } });
        if (!c) { muets++; console.log('   ✗ sabotage orphelin : « ' + titre + ' »'); return; }
        var cassee = copie(vraie);
        try { s[1](cassee); } catch (err) { muets++; console.log('   ✗ ' + titre + ' : le sabotage a planté (' + err.message + ')'); return; }
        var r;
        try { r = c.fn(cassee); } catch (err) { r = 'exception'; }
        if (r) { console.log('   ✓ ' + titre); }
        else { muets++; console.log('   ✗ ' + titre + '\n       → le contrôle passe QUAND MÊME sur une base cassée : il ne mesure rien'); }
    });

    var sansSabotage = CONTROLES.filter(function (c) {
        return !SABOTAGES.some(function (s) { return s[0] === c.titre; });
    });
    if (sansSabotage.length) {
        console.log('\n   ⚠ contrôles sans contre-épreuve : ' + sansSabotage.map(function (c) { return c.titre; }).join(' · '));
    }

    console.log('\n' + new Array(73).join('='));
    console.log(CONTROLES.length + ' contrôles · ' + SABOTAGES.length + ' contre-épreuves');
    if (echecs === 0 && muets === 0) {
        console.log('✅ BANC PASSÉ');
        process.exit(0);
    }
    console.log('❌ BANC ÉCHOUÉ — ' + echecs + ' contrôle(s) en échec, ' + muets + ' contrôle(s) qui ne mesurent rien');
    process.exit(1);
}

lancer();
