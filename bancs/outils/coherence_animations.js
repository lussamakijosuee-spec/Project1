/*
 * COHÉRENCE ÉLÉMENT ↔ ANIMATION — la règle, partagée par l'outil et le banc
 * ---------------------------------------------------------------------------
 * JOKO, 2026-09-25 : « il y a plein d'attaques qui ont des animations qui ne
 * sont pas cohérentes. Il y a du feu et le mec, il fait de l'eau. »
 *
 * Une animation « parle » une famille d'éléments (son nom le dit : « Feu ·
 * Lame », « Glace Tous 2 », « Braises », « Cristal »…), ou n'en parle aucune
 * (« Frapper Physique », « Neutre Un 1 » : muettes), ou est universelle (un
 * soin, une malédiction, une charge — le geste compte, pas la couleur).
 *
 * Une compétence élémentaire est cohérente si :
 *   · son animation parle sa famille d'éléments (Feu et Lave, Glace et Givre,
 *     Eau et Vapeur, Terre et Métal, Ombre et Crépuscule sont des familles) ;
 *   · ou son animation est universelle ;
 *   · ou son NOM dit ce que l'animation montre — « Marée de Deuil » a le droit
 *     à sa vague, « Fouet de Sang » à sa pluie rouge : le nom a guidé le geste,
 *     et c'est lui que le joueur lit ;
 *   · ou elle est un mana (spirituel, positif, négatif, Sombre, Originel,
 *     Âme, semi-parfait) et son animation est un effet abstrait (Vortex,
 *     Étoiles noires, Drain, Runes…) qui ne nomme aucun élément naturel.
 * Elle est INCOHÉRENTE si l'animation parle une AUTRE famille sans que le nom
 * l'appelle, ou si elle est muette alors que la compétence a un élément : un
 * coup de feu muet ressemble à un coup de poing.
 *
 *   var C = require('./coherence_animations');
 *   C.elementsDeLAnim(anim)   -> { universelle, abstraite, elements: Set<id>, mots: RegExp|null } | null (muette)
 *   C.estCoherente(skill, anim)
 *   C.LIGNE_PAR_ELEMENT[8] === 'Feu'
 */
'use strict';

// Les 14 lignes de la grille 158-339 (une par élément naturel)…
var LIGNE_PAR_ELEMENT = {
    8: 'Feu', 9: 'Eau', 10: 'Vent', 11: 'Terre', 12: 'Foudre', 13: 'Glace', 14: 'Lumière', 15: 'Ombre',
    17: 'Vapeur', 19: 'Lave', 20: 'Plante', 22: 'Givre', 23: 'Métal', 29: 'Crépuscule',
    // …et les 7 lignes des manas (461-551), teintées d'après la palette de ManaVisualEX.
    2: 'Spirituel', 3: 'Positif', 4: 'Négatif', 5: 'Sombre', 6: 'Originel', 7: 'Âme', 16: 'Semi-parfait'
};
var ELEMENT_PAR_LIGNE = {};
Object.keys(LIGNE_PAR_ELEMENT).forEach(function (k) { ELEMENT_PAR_LIGNE[LIGNE_PAR_ELEMENT[k]] = parseInt(k, 10); });
var MANAS = [2, 3, 4, 5, 6, 7, 16];

var FORMES = ['Impact', 'Lame', 'Perce', 'Griffe', 'Projection', 'Souffle', 'Parole I', 'Parole II',
    'Explosion', 'Cataclysme', 'Soin', 'Bénédiction', 'Malédiction'];

// Les familles, et les mots qui les appellent dans un nom de compétence.
var FAMILLES = {
    feu:     { el: [8, 19],  mots: /feu|flamme|brasier|incendie|brûl|ardent|braise|pyro|cendre|lave|magma|escarbille|fournaise|détonation/i },
    eau:     { el: [9, 17],  mots: /\beau|geyser|vague|pluie|pleu|marée|torrent|déluge|bulle|onde|aqua|vapeur|brume/i },
    vent:    { el: [10],     mots: /vent|bourrasque|tornade|rafale|cyclone|tempête|ouragan|zéphyr/i },
    terre:   { el: [11, 23], mots: /terre|roche|rocher|pierre|séisme|sable|gravit|\bsol\b|éboul|métal|acier|fer\b|cristal/i },
    foudre:  { el: [12],     mots: /foudre|éclair|tonnerre|électr|orage|étincelle|fulgur|rail/i },
    glace:   { el: [13, 22], mots: /glace|\bgel|givre|froid|neige|blizzard|cristal|polaire|frimas/i },
    // La lumière accueille le mana positif (or) et l'Originel (blanc) ; l'ombre accueille le Sombre
    // (violet) et le négatif — l'anim 123 « mana négative » de JOKO est une feuille Darkness.
    lumiere: { el: [14, 3, 6],     mots: /lumière|sacré|saint|stellaire|étoile|aube|soleil|solaire|radian|divin|ange|conviction/i },
    ombre:   { el: [15, 29, 5, 4], mots: /ombre|ténèbre|nuit|noir|obscur|abyss|néant|sombre|styx|spectr|macabre|crépuscule|mort/i },
    plante:  { el: [20],           mots: /plante|fleur|pétale|racine|ronce|épine|sève|pollen|lierre/i },
    sang:    { el: [4, 7, 2],      mots: /sang|saign|drain|aspir|festin|dîme|dette|vampir|ponction|dévor/i },
    // Deux gestes sans couleur qui n'ont de sens que si le nom les appelle.
    rayon:   { el: [],             mots: /rayon|laser|faisceau/i },
    tir:     { el: [],             mots: /\btirs?\b|balle|canon|fusil|pistolet|mitraill|rafale/i }
};
// Vesper : ses techniques de type « sang » (10) restent rouges — les FX « · Rose » et le Drain sont à elle,
// quel que soit l'élément que porte la technique.
var TYPE_SANG = 10;
var ROUGE = /· Rose$|^Drain de vie/;
var MOTS_DE_SANG = /sang|saign|écarlate|rouge|coule|lambeau|plaie|veine|carmin|vermeil|hémo|dette/i;

// Les anims de base de MV, par leur nom.
var BASE_TYPEE = [
    [/Feu/, 'feu'], [/Glace/, 'glace'], [/Tonnerre/, 'foudre'], [/^Eau/, 'eau'], [/^Terre/, 'terre'],
    [/^Vent/, 'vent'], [/Lumière/, 'lumiere'], [/Ténèbres/, 'ombre'], [/^Laser/, 'rayon'], [/^Tir /, 'tir']
];
// Le catalogue FX 361-460. `fam` : la famille qu'il montre ; `abstrait` : ne nomme aucun élément
// naturel, donc va à n'importe quel mana ; `universel` : va à tout.
var FX = [
    [/^Éclat( · |$)/, { fam: 'feu', abstrait: true }], [/^Onde de choc/, { fam: 'eau', abstrait: true }],
    [/^Lames triples/, { universel: true }], [/^Pilier/, { fam: 'lumiere', abstrait: true }],
    [/^Pluie perçante/, { fam: 'eau' }], [/^Foudre/, { fam: 'foudre' }], [/^Cristal/, { fam: 'glace' }],
    [/^Pétales/, { fam: 'plante' }], [/^Bulles/, { fam: 'eau' }], [/^Braises/, { fam: 'feu' }],
    [/^Vortex/, { fam: 'ombre', abstrait: true }], [/^Concentration/, { universel: true }],
    [/^Croix de lumière/, { fam: 'lumiere', abstrait: true }], [/^Cercle de runes/, { universel: true }],
    [/^L'Œil/, { universel: true }], [/^Griffes/, { universel: true }], [/^Grande vague/, { fam: 'eau' }],
    [/^Éclats brisés/, { fam: 'terre', abstrait: true }], [/^Drain de vie/, { fam: 'sang', abstrait: true }],
    [/^Dôme gardien/, { fam: 'terre', abstrait: true }], [/^Rayon/, { universel: true }],
    [/^Étoiles noires/, { fam: 'ombre', abstrait: true }], [/^Volutes d'âme/, { fam: 'sang', abstrait: true }],
    [/^Corruption/, { universel: true }], [/^Mains de l'ombre/, { fam: 'ombre', abstrait: true }]
];
// Les anims de MV qui ne parlent AUCUN élément : sur une compétence élémentaire, elles mentent.
var NEUTRES_MUETTES = /^(Frapper|Trancher|Transpercer|Griffer) (Physique|Effet|Spécial)|^Flèche Spéciale|^Général Spécial|^Balayage|^Neutre /;

function famille(nom) {
    var f = FAMILLES[nom];
    return { universelle: false, abstraite: false, elements: new Set(f.el), mots: f.mots };
}
function elementsDeLAnim(anim) {
    if (!anim || !anim.name) { return null; }
    var n = anim.name, i, r;
    var m = n.match(/^(.+?) · (.+)$/);
    if (m && ELEMENT_PAR_LIGNE[m[1]] !== undefined && FORMES.indexOf(m[2]) >= 0) {
        var el = ELEMENT_PAR_LIGNE[m[1]];
        for (var k in FAMILLES) { if (FAMILLES[k].el.indexOf(el) >= 0 && MANAS.indexOf(el) < 0) { return famille(k); } }
        return { universelle: false, abstraite: false, elements: new Set([el]), mots: null };
    }
    for (i = 0; i < FX.length; i++) {
        if (FX[i][0].test(n)) {
            var d = FX[i][1];
            if (d.universel) { return { universelle: true, abstraite: true, elements: new Set(), mots: null }; }
            r = famille(d.fam); r.abstraite = !!d.abstrait; return r;
        }
    }
    if (n === 'mana positive') { return { universelle: false, abstraite: true, elements: new Set([3]), mots: null }; }
    if (n === 'mana négative') { return { universelle: false, abstraite: true, elements: new Set([4]), mots: null }; }
    if (n === 'GGHB') { r = famille('ombre'); r.abstraite = true; return r; }
    if (NEUTRES_MUETTES.test(n)) { return null; }
    for (i = 0; i < BASE_TYPEE.length; i++) {
        if (BASE_TYPEE[i][0].test(n)) { return famille(BASE_TYPEE[i][1]); }
    }
    // Souffle, Pollen, Chanson, Cri, soins, revivre, états, Absorber, les anims de lore (340-360),
    // les anims de MV sans nom élémentaire : le geste compte, pas la couleur.
    return { universelle: true, abstraite: true, elements: new Set(), mots: null };
}

/** Une compétence élémentaire (grille ou mana) porte-t-elle une animation qui lui va ? */
function estCoherente(skill, anim) {
    var el = skill.damage.elementId;
    if (LIGNE_PAR_ELEMENT[el] === undefined) { return true; }   // physique, sans élément, élément de l'arme
    if (skill.animationId <= 0) { return skill.animationId === -1 ? true : !aBesoinDUneAnim(skill); }
    if (anim && ROUGE.test(anim.name) && (skill.stypeId === TYPE_SANG || MOTS_DE_SANG.test(skill.name))) { return true; }
    var p = elementsDeLAnim(anim);
    if (p === null) { return false; }
    if (p.universelle || p.elements.has(el)) { return true; }
    if (p.mots && p.mots.test(skill.name)) { return true; }
    return p.abstraite && MANAS.indexOf(el) >= 0;
}

/** Une compétence qui fait quelque chose en combat doit se voir. */
function aBesoinDUneAnim(skill) {
    if (!skill.name) { return false; }
    if (skill.occasion === 2 || skill.occasion === 3) { return false; }   // menu seulement / jamais
    if (skill.stypeId === 22) { return false; }                            // les Styles : le greffon joue l'effet
    return skill.damage.type > 0 || skill.effects.length > 0 || /<Appel:|<Avatar/.test(skill.note || '') || /^VUE/.test(skill.name);
}

module.exports = {
    LIGNE_PAR_ELEMENT: LIGNE_PAR_ELEMENT, ELEMENT_PAR_LIGNE: ELEMENT_PAR_LIGNE, FORMES: FORMES, MANAS: MANAS, TYPE_SANG: TYPE_SANG,
    FAMILLES: FAMILLES, elementsDeLAnim: elementsDeLAnim, estCoherente: estCoherente, aBesoinDUneAnim: aBesoinDUneAnim
};
