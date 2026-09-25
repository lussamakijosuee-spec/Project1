/*
 * OUTIL — chaque attaque a une animation, et une animation de SON élément
 * ---------------------------------------------------------------------------
 * JOKO, 2026-09-25 : « il y a plein d'attaques qui n'ont pas d'animation ou
 * qui ont des animations qui ne sont pas cohérentes. Il y a du feu et le mec,
 * il fait de l'eau. »
 *
 * Ce que l'outil fait, dans l'ordre — et rien d'autre :
 *
 *  ① ANIMATIONS.  La grille 158-339 (13 formes × 14 éléments naturels) n'a
 *     pas de ligne pour les sept manas (spirituelle, positive, négative,
 *     Sombre, Originel, AME, semi-parfait) : 360 compétences sans couleur
 *     possible. On construit ces 7 lignes dans les cases vides 461-551, avec
 *     EXACTEMENT la recette de la grille (mêmes feuilles, teinte + flashs
 *     recolorés) et la palette de ManaVisualEX — celle que le joueur voit
 *     déjà dans tous les menus. Les cases 130 et 135, appelées par l'état 39
 *     (Royaume Impérial de Lou) mais vides, reçoivent un Vortex et une
 *     Concentration : le Domaine s'ouvrait en silence.
 *
 *  ② ARMES.  46 armes nommées n'ont AUCUNE animation d'attaque : le coup de
 *     base est muet. Chacune prend l'animation que les autres armes de son
 *     type portent déjà (Épée → Trancher, Arc → Transpercer, fusil → Tir…).
 *
 *  ③ COMPÉTENCES.  Toute compétence élémentaire dont l'animation ment (muette
 *     ou d'un autre élément — règle dans coherence_animations.js) reçoit la
 *     forme de sa ligne : physique → Impact / Lame / Perce / Griffe /
 *     Projection ; magique → Parole I / II, Explosion / Cataclysme si c'est
 *     gros ; soin → Soin ; sans dégâts → Bénédiction (alliés) ou Malédiction
 *     (ennemis). Les animations déjà justes ne bougent pas.
 *     Plus une courte liste à la main : neuf compétences SANS élément qui
 *     portaient une anim élémentaire (Pétales sur des insectes, Braises sur un
 *     coup de poing), et sept qui n'avaient rien du tout.
 *
 *  ④ OBJETS.  Trois consommables à effet sans animation.
 *
 *  ⑥ TEINTES.  Le « hue » de MV fait tourner la couleur de la feuille, il ne
 *     la pose pas : la grille appliquait 210° à tout pour faire « Eau », et
 *     son Soin (feuille cyan) sortait orange, son Impact (feuille jaune)
 *     violet. Rotation juste = voulue − départ, feuille par feuille, départs
 *     mesurés sur les images (mesurer_teintes.js). Même chose pour les
 *     variantes « · Violet / · Rose / · Or » du catalogue FX, dont la feuille
 *     et les flashs prennent enfin la couleur que leur nom promet.
 *
 *  ⑤ ÉTATS.  Huit états dont un trait fait le contraire de leur nom (une
 *     Hémorragie qui protège de la magie à 90 %, un Silence qui donne des
 *     techniques, une Fatigue qui résiste aux malus…). Le trait fautif est
 *     corrigé, jamais retiré ; rien d'autre ne bouge dans l'état.
 *
 * Idempotent : relancé, il ne change plus rien. Rien n'est supprimé.
 *
 *   node bancs/outils/animer_les_competences.js            (applique)
 *   node bancs/outils/animer_les_competences.js --montre   (liste sans écrire)
 */
'use strict';
var fs = require('fs');
var path = require('path');
var C = require('./coherence_animations');
var RACINE = path.join(__dirname, '..', '..');
var MONTRE = process.argv.indexOf('--montre') >= 0;

function lire(nom) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', nom + '.json'), 'utf8')); }
function ecrire(nom, tab) {
    // Le format de l'éditeur : une entrée par ligne, pas d'indentation.
    var txt = '[\n' + tab.map(function (e) { return JSON.stringify(e); }).join(',\n') + '\n]';
    fs.writeFileSync(path.join(RACINE, 'data', nom + '.json'), txt, 'utf8');
}
var A = lire('Animations'), S = lire('Skills'), W = lire('Weapons'), I = lire('Items'), St = lire('States'), Sys = lire('System');
var journal = [];
function note(t) { journal.push(t); }

// ═══════════════════════════════════════════════════════════════════════════
// ① Les sept lignes des manas — la recette de la grille, relue sur « Feu »
// ═══════════════════════════════════════════════════════════════════════════
var LIGNES_MANA = [
    // nom, élément, teinte, flash RGB (ManaVisualEX), feuilles magiques
    { nom: 'Spirituel',   el: 2,  hue: 260, rgb: [205, 184, 255], magie: 'Magic' },
    { nom: 'Positif',     el: 3,  hue: 45,  rgb: [255, 217, 90],  magie: 'Holy' },
    { nom: 'Négatif',     el: 4,  hue: 220, rgb: [111, 168, 255], magie: 'Darkness' },
    { nom: 'Sombre',      el: 5,  hue: 285, rgb: [176, 97, 224],  magie: 'Darkness' },
    { nom: 'Originel',    el: 6,  hue: 0,   rgb: [242, 242, 242], magie: 'Magic' },
    { nom: 'Âme',         el: 7,  hue: 165, rgb: [95, 214, 192],  magie: 'Magic' },
    { nom: 'Semi-parfait', el: 16, hue: 290, rgb: [224, 160, 255], magie: 'Magic' }
];
var PREMIERE_CASE = 461;
// Pour Positif / Négatif / Sombre, les formes magiques prennent les feuilles Holy / Darkness
// (les anims de base 96-99 et 101-104) : une Parole positive ne doit pas avoir la silhouette
// d'une Parole de Lumière (grille : Magic1, teinte 50) — la couleur seule ne suffirait pas.
var BASE_MAGIQUE = { Magic: null, Holy: { 'Parole I': 96, 'Parole II': 98, 'Explosion': 97, 'Cataclysme': 99 },
    Darkness: { 'Parole I': 101, 'Parole II': 103, 'Explosion': 102, 'Cataclysme': 104 } };

function feu(forme) { return A.filter(function (a) { return a && a.name === 'Feu · ' + forme; })[0]; }
function recolore(anim, hue, rgb) {
    anim.animation1Hue = hue; anim.animation2Hue = anim.animation2Name ? hue : 0;
    anim.timings.forEach(function (t) {
        if (t.flashScope === 1 || t.flashScope === 2) { t.flashColor = [rgb[0], rgb[1], rgb[2], t.flashColor[3]]; }
    });
}
function estVide(a) { return !a || (a.frames.length <= 1 && !a.animation1Name && !a.animation2Name); }

var casesCreees = 0;
LIGNES_MANA.forEach(function (L, li) {
    C.FORMES.forEach(function (forme, fi) {
        var id = PREMIERE_CASE + li * C.FORMES.length + fi;
        var nom = L.nom + ' · ' + forme;
        if (A[id] && A[id].name === nom) { return; }             // déjà construite
        if (!estVide(A[id])) { throw new Error('la case ' + id + ' n\'est pas vide : ' + A[id].name); }
        var base = feu(forme);
        var surcharge = BASE_MAGIQUE[L.magie] && BASE_MAGIQUE[L.magie][forme];
        if (surcharge) { base = A[surcharge]; }
        var a = JSON.parse(JSON.stringify(base));
        a.id = id; a.name = nom;
        recolore(a, L.hue, L.rgb);
        A[id] = a; casesCreees++;
    });
});
if (casesCreees) { note('① ' + casesCreees + ' animations construites (lignes des manas, cases 461-551)'); }

// Les deux cases vides que l'état 39 appelle par leur numéro.
function remplir(id, source, nom) {
    if (A[id] && A[id].name === nom) { return; }
    if (!estVide(A[id])) { throw new Error('la case ' + id + ' n\'est pas vide : ' + A[id].name); }
    var a = JSON.parse(JSON.stringify(A[source])); a.id = id; a.name = nom; A[id] = a;
    note('① case ' + id + ' « ' + nom + ' » (copie de ' + source + ' ' + A[source].name + ') — appelée par l\'état 39');
}
remplir(130, 401, 'Royaume — Ouverture');
remplir(135, 406, 'Royaume — Écho');

// ═══════════════════════════════════════════════════════════════════════════
// ⑥ Les teintes vraies — « hue » fait TOURNER la couleur de la feuille, il ne la pose pas
// ═══════════════════════════════════════════════════════════════════════════
// La grille 158-339 appliquait la même rotation à toutes ses feuilles : « Eau · Soin » =
// Cure1 (cyan, 184°) + 210° = orange ; « Foudre · Impact » = Hit1 (jaune, 51°) + 60° = vert.
// La rotation juste, c'est (couleur voulue − couleur de départ), feuille par feuille. Les
// teintes de départ sont mesurées sur les images (mesurer_teintes.js) ; les couleurs voulues
// suivent la palette de ManaVisualEX, écartées quand deux éléments se touchaient.
var TEINTES = JSON.parse(fs.readFileSync(path.join(__dirname, 'teintes_des_feuilles.json'), 'utf8'));
var TEINTE_CIBLE = {
    Feu: 12, Lave: 25, Terre: 35, Positif: 42, Lumière: 50, Originel: 50, Foudre: 58, Plante: 100, Vent: 130,
    'Âme': 165, Givre: 185, Glace: 195, Vapeur: 200, Eau: 205, 'Métal': 215, 'Négatif': 220, Spirituel: 250,
    Ombre: 265, Sombre: 280, 'Semi-parfait': 295, 'Crépuscule': 305
};
// Le catalogue FX 361-460 : la variante de base garde l'art tel quel ; « · Violet », « · Rose »,
// « · Or » deviennent vraiment violettes, roses, dorées — feuille ET flashs.
var VARIANTES = { Violet: { hue: 275, rgb: [170, 110, 240] }, Rose: { hue: 325, rgb: [240, 110, 170] }, Or: { hue: 45, rgb: [250, 205, 90] } };
function rotationPour(feuille, cible) {
    var t = TEINTES[feuille];
    if (!t || t.teinte < 0) { return 0; }          // feuille grise ou blanche : rien à tourner
    return ((cible - t.teinte) % 360 + 360) % 360;
}
function poserTeinte(a, cible) {
    var h1 = a.animation1Name ? rotationPour(a.animation1Name, cible) : 0;
    var h2 = a.animation2Name ? rotationPour(a.animation2Name, cible) : 0;
    if (a.animation1Hue === h1 && a.animation2Hue === h2) { return false; }
    a.animation1Hue = h1; a.animation2Hue = h2; return true;
}
var teintes = 0, flashs = 0;
A.forEach(function (a) {
    if (!a || !a.name) { return; }
    var m = a.name.match(/^(.+?) · (.+)$/);
    if (!m) { return; }
    if (TEINTE_CIBLE[m[1]] !== undefined && C.FORMES.indexOf(m[2]) >= 0) {
        if (poserTeinte(a, TEINTE_CIBLE[m[1]])) { teintes++; }
    } else if (VARIANTES[m[2]] && a.id >= 361 && a.id <= 460) {
        var V = VARIANTES[m[2]];
        if (poserTeinte(a, V.hue)) { teintes++; }
        a.timings.forEach(function (t) {
            if ((t.flashScope === 1 || t.flashScope === 2) && (t.flashColor[0] !== V.rgb[0] || t.flashColor[1] !== V.rgb[1] || t.flashColor[2] !== V.rgb[2])) {
                t.flashColor = [V.rgb[0], V.rgb[1], V.rgb[2], t.flashColor[3]]; flashs++;
            }
        });
    }
});
if (teintes || flashs) { note('⑥ ' + teintes + ' animations remises à leur vraie couleur (rotation = voulue − départ, feuille par feuille), ' + flashs + ' flashs de variantes recolorés'); }

var ID_PAR_NOM = {};
A.forEach(function (a) { if (a && a.name) { ID_PAR_NOM[a.name] = a.id; } });
function anim(ligne, forme) {
    var id = ID_PAR_NOM[ligne + ' · ' + forme];
    if (!id) { throw new Error('pas d\'animation « ' + ligne + ' · ' + forme + ' »'); }
    return id;
}

// ═══════════════════════════════════════════════════════════════════════════
// ② Les armes muettes — ce que les autres armes du même type portent déjà
// ═══════════════════════════════════════════════════════════════════════════
var ANIM_PAR_TYPE_D_ARME = { 1: 1, 2: 6, 3: 111, 4: 6, 5: 1, 6: 1, 7: 11, 8: 11, 9: 111, 10: 16, 11: 1, 12: 11, 13: 112, 14: 1, 15: 6, 16: 1 };
var armes = 0;
W.forEach(function (w) {
    if (!w || !w.name || w.animationId !== 0) { return; }
    var id = ANIM_PAR_TYPE_D_ARME[w.wtypeId] || 1;
    w.animationId = id; armes++;
    note('② arme ' + w.id + ' « ' + w.name + ' » (' + Sys.weaponTypes[w.wtypeId] + ') → ' + id + ' ' + A[id].name);
});

// ═══════════════════════════════════════════════════════════════════════════
// ③ Les compétences — la forme de leur ligne
// ═══════════════════════════════════════════════════════════════════════════
var GROS = /déluge|suprême|majeur|cataclysme|apocalypse|ultime|nova\b|grand|géant|absolu|final|dévast|annihil|extinction|titan|colossal|météore|tempête|ouragan|éruption|cataracte|marée|raz-de|abîme|abysse/i;
var GRIFFE = /griffe|morsure|croc|lacér|déchir|éventr/i;
var PERCE = /perc|transperc|lance\b|flèche|\btirs?\b|\bpic\b|estoc|harpon|dard|aiguille|javelot|empal|poignard|pieu|perfor/i;
var LAME = /lame|tranch|entaille|taillade|épée|sabre|katana|fauch|hache|coupe|décapit|saign|rasoir|faux\b/i;
var SOUFFLE = /souffle|haleine|breath|expir/i;
function versTous(s) { return s.scope >= 2 && s.scope <= 6; }
function versAllies(s) { return s.scope >= 7 || s.scope === 0; }

function formePour(s) {
    var t = s.damage.type;
    if (t === 3 || t === 4) { return 'Soin'; }
    if (t === 0) { return versAllies(s) ? 'Bénédiction' : 'Malédiction'; }
    if (SOUFFLE.test(s.name)) { return 'Souffle'; }
    if (s.hitType === 1) {
        if (GRIFFE.test(s.name)) { return 'Griffe'; }
        if (PERCE.test(s.name)) { return 'Perce'; }
        if (LAME.test(s.name)) { return 'Lame'; }
        return versTous(s) ? 'Projection' : 'Impact';
    }
    var gros = s.stypeId === 3 || GROS.test(s.name);
    if (versTous(s)) { return gros ? 'Cataclysme' : 'Parole II'; }
    return gros ? 'Explosion' : 'Parole I';
}

// Vesper, type « sang » : la forme, mais en rouge (les FX « · Rose » du catalogue), pas en bleu de mana négatif.
var ROUGE_PAR_FORME = { Impact: 'Lames triples · Rose', Lame: 'Lames triples · Rose', Griffe: 'Lames triples · Rose',
    Perce: 'Pluie perçante · Rose', Projection: 'Pluie perçante · Rose', Souffle: 'Grande vague · Rose',
    'Parole I': 'Drain de vie · Rose', Explosion: 'Drain de vie · Rose', 'Parole II': 'Grande vague · Rose',
    Cataclysme: 'Grande vague · Rose', Soin: 'Volutes d\'âme · Rose', 'Bénédiction': 'Concentration · Rose',
    'Malédiction': 'Mains de l\'ombre · Rose' };

var competences = 0;
S.forEach(function (s) {
    if (!s || !s.name) { return; }
    var ligne = C.LIGNE_PAR_ELEMENT[s.damage.elementId];
    if (!ligne) { return; }
    if (C.estCoherente(s, A[s.animationId])) { return; }
    var avant = s.animationId, forme = formePour(s);
    s.animationId = s.stypeId === C.TYPE_SANG ? ID_PAR_NOM[ROUGE_PAR_FORME[forme]] : anim(ligne, forme); competences++;
    note('③ ' + s.id + ' « ' + s.name + ' » [' + (Sys.elements[s.damage.elementId] || '').trim() + '] ' + avant + (A[avant] && A[avant].name ? ' ' + A[avant].name : '') + ' → ' + s.animationId + ' ' + A[s.animationId].name);
});

// À la main : sans élément mais habillées d'un autre, ou sans rien du tout.
var A_LA_MAIN = {
    50: 21,     // Pari Téméraire (physique) portait « Eau Tous 2 » → Frapper Spécial 1
    818: 441,   // la Parole Originelle : « Mains de l'ombre » → Rayon (le catalogue : « lasers, Mana Pur »)
    849: 405,   // Mèche Lente (une charge qui s'allume) : « Terre · Soin » → Concentration
    969: 33,    // Nuée, Toile, Petits en Nombre, Marée de Petits, Éclosion : des insectes en Pétales → Pollen
    971: 57,    //   Toile → Attacher
    982: 33, 987: 33, 1053: 33,
    983: 21,    // Coup de Désespoir (physique) portait des Braises → Frapper Spécial 1
    115: 236,   // Frappe Aveuglante [LUMIÈRE] jouait l'anim de l'arme → Lumière · Impact
    474: 377,   // « Qu'il pleuve. » → Pluie perçante
    475: 483,   // « Que le ciel s'ouvre. » → Positif · Cataclysme (le ciel entier)
    476: 385,   // « Qu'il neige. » → Cristal
    480: 417,   // VUE (Lou regarde) → L'Œil
    1263: 437,  // Avatar — Protège-le → Dôme gardien sur l'allié
    1264: 405   // Avatar — Soigne-le → Concentration sur l'allié
};
Object.keys(A_LA_MAIN).forEach(function (id) {
    var s = S[id], vers = A_LA_MAIN[id];
    if (!s || s.animationId === vers) { return; }
    note('③ ' + s.id + ' « ' + s.name + ' » ' + s.animationId + (A[s.animationId] && A[s.animationId].name ? ' ' + A[s.animationId].name : '') + ' → ' + vers + ' ' + A[vers].name + ' (à la main)');
    s.animationId = vers; competences++;
});

// ═══════════════════════════════════════════════════════════════════════════
// ④ Les objets
// ═══════════════════════════════════════════════════════════════════════════
var OBJETS = { 5: 58, 9: 41, 10: 41 };   // Live Interdit → Absorber ; Lait, Bière → Guérir Un 1
var objets = 0;
Object.keys(OBJETS).forEach(function (id) {
    var o = I[id]; if (!o || o.animationId !== 0) { return; }
    o.animationId = OBJETS[id]; objets++;
    note('④ objet ' + id + ' « ' + o.name + ' » → ' + o.animationId + ' ' + A[o.animationId].name);
});

// ═══════════════════════════════════════════════════════════════════════════
// ⑤ Les états dont un trait dit le contraire du nom
// ═══════════════════════════════════════════════════════════════════════════
// code 21 = paramètre ×, 22 = ex-paramètre +, 23 = paramètre spécial ×, 12 = taux de malus reçu,
// 11 = taux de dégâts d'un élément, 42 = type de compétence scellé, 43 = compétence ajoutée.
var ETATS = [
    { id: 14, nom: 'Fatigue', pourquoi: '« résiste aux malus d\'ATQ et d\'AGI à 80 % » — une fatigue affaiblit',
      de: { code: 12, dataId: 2, value: 0.2 }, vers: { code: 21, dataId: 2, value: 0.8 } },
    { id: 14, nom: 'Fatigue', de: { code: 12, dataId: 6, value: 0.2 }, vers: { code: 21, dataId: 6, value: 0.8 } },
    { id: 18, nom: 'Saignement Brûlant', pourquoi: '« résiste aux malus d\'AGI à 90 % » — un saignement ralentit',
      de: { code: 12, dataId: 6, value: 0.1 }, vers: { code: 21, dataId: 6, value: 0.9 } },
    { id: 41, nom: 'Hésitation', pourquoi: '« ne prend que 40 % des dégâts physiques » — hésiter, c\'est encaisser',
      de: { code: 11, dataId: 1, value: 0.4 }, vers: { code: 11, dataId: 1, value: 1.25 } },
    { id: 51, nom: 'Terrain Corrompu', pourquoi: '« les sorts coûtent 5 % » — un terrain corrompu draine, il n\'offre pas',
      de: { code: 23, dataId: 4, value: 0.05 }, vers: { code: 22, dataId: 8, value: -0.05 } },
    { id: 71, nom: 'Vulnérable', pourquoi: 'aucun effet (EVA +0) — posé par trois coups lourds des héros',
      de: { code: 22, dataId: 1, value: 0 }, vers: { code: 23, dataId: 6, value: 1.25 } },
    { id: 210, nom: '🩸 Hémorragie Profonde', pourquoi: '« ne prend que 10 % des dégâts magiques » — Vesper protégeait ses cibles',
      de: { code: 23, dataId: 7, value: 0.1 }, vers: { code: 22, dataId: 7, value: -0.1 } },
    { id: 212, nom: '🔇 Silence Runique', pourquoi: '« apprend Attaque et Garde » — un silence scelle les Spéciales et les ult',
      de: { code: 43, dataId: 1, value: 1 }, vers: { code: 42, dataId: 2, value: 1 } },
    { id: 212, nom: '🔇 Silence Runique', de: { code: 43, dataId: 2, value: 1 }, vers: { code: 42, dataId: 3, value: 1 } },
    { id: 221, nom: '🔥 Combustion', pourquoi: '« ne prend que 12 % des dégâts magiques » — le feu des Paroles blindait ses cibles',
      de: { code: 23, dataId: 7, value: 0.12 }, vers: { code: 22, dataId: 7, value: -0.12 } }
];
var etats = 0;
ETATS.forEach(function (E) {
    var s = St[E.id]; if (!s) { return; }
    var t = s.traits.filter(function (x) { return x.code === E.de.code && x.dataId === E.de.dataId && x.value === E.de.value; })[0];
    if (!t) { return; }
    t.code = E.vers.code; t.dataId = E.vers.dataId; t.value = E.vers.value; etats++;
    note('⑤ état ' + E.id + ' « ' + E.nom + ' » : ' + JSON.stringify(E.de) + ' → ' + JSON.stringify(E.vers) + (E.pourquoi ? '   — ' + E.pourquoi : ''));
});

// ═══════════════════════════════════════════════════════════════════════════
journal.forEach(function (l) { console.log('  ' + l); });
console.log('\n  ' + casesCreees + ' animations · ' + teintes + ' teintes · ' + armes + ' armes · ' + competences + ' compétences · ' + objets + ' objets · ' + etats + ' traits d\'état');
if (MONTRE) { console.log('  (--montre : rien n\'est écrit)'); process.exit(0); }
if (journal.length) {
    ecrire('Animations', A); ecrire('Skills', S); ecrire('Weapons', W); ecrire('Items', I); ecrire('States', St);
    console.log('  data/ écrit.');
} else { console.log('  rien à changer.'); }
