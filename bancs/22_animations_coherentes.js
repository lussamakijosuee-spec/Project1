/*
 * BANC 22 — chaque attaque se voit, et dans SA couleur
 * ---------------------------------------------------------------------------
 * JOKO, 2026-09-25 : « il y a plein d'attaques qui n'ont pas d'animation ou
 * qui ont des animations qui ne sont pas cohérentes. Il y a du feu et le mec,
 * il fait de l'eau. »
 *
 * On mesure le SYMPTÔME (une compétence de feu qui joue une anim d'eau, une
 * arme qui frappe sans rien montrer, un état qui fait le contraire de son
 * nom), pas le motif — et dans les deux sens : chaque contrôle a sa
 * contre-épreuve, un faux coupable fabriqué que la règle doit attraper.
 *
 *   node bancs/22_animations_coherentes.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var C = require('./outils/coherence_animations');
var RACINE = path.join(__dirname, '..');
function lire(n) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', n + '.json'), 'utf8')); }
var A = lire('Animations'), S = lire('Skills'), W = lire('Weapons'), I = lire('Items'), St = lire('States'), Sys = lire('System');

var vert = 0, rouge = 0;
function ok(nom, cond, detail) {
    if (cond) { vert++; console.log('   ✓ ' + nom + (detail ? '  —  ' + detail : '')); }
    else { rouge++; console.log('   ✗ ' + nom + (detail ? '  —  ' + detail : '')); }
}
function estVide(a) { return !a || (a.frames.length <= 1 && !a.animation1Name && !a.animation2Name); }
function nomEl(id) { return (Sys.elements[id] || String(id)).trim(); }

console.log('\n══ LES ANIMATIONS ' + '═'.repeat(56));

// ── ① les lignes des manas existent, construites comme la grille ──────────
var manquantes = [];
C.MANAS.forEach(function (el) {
    C.FORMES.forEach(function (f) {
        var nom = C.LIGNE_PAR_ELEMENT[el] + ' · ' + f;
        if (!A.some(function (a) { return a && a.name === nom && !estVide(a); })) { manquantes.push(nom); }
    });
});
ok('les 7 lignes des manas ont leurs 13 formes (91 animations, cases 461-551)', manquantes.length === 0, manquantes.slice(0, 5).join(', '));
var feuImpact = A.filter(function (a) { return a && a.name === 'Feu · Impact'; })[0];
var posImpact = A.filter(function (a) { return a && a.name === 'Positif · Impact'; })[0];
ok('une ligne de mana a les mêmes images que la grille, seule la teinte change',
    feuImpact && posImpact && JSON.stringify(feuImpact.frames) === JSON.stringify(posImpact.frames) && feuImpact.animation1Hue !== posImpact.animation1Hue,
    posImpact && ('teinte ' + posImpact.animation1Hue + ' contre ' + feuImpact.animation1Hue));

// ── ①bis chaque ligne a vraiment sa couleur : rotation = voulue − départ ──
// « hue » fait tourner la couleur de la feuille. On lit la teinte de départ mesurée sur l'image
// (outils/teintes_des_feuilles.json) et on vérifie que feuille + rotation tombe sur la couleur de la ligne.
var TEINTES = JSON.parse(fs.readFileSync(path.join(__dirname, 'outils', 'teintes_des_feuilles.json'), 'utf8'));
var CIBLE = { Feu: 12, Lave: 25, Terre: 35, Positif: 42, Lumière: 50, Originel: 50, Foudre: 58, Plante: 100, Vent: 130,
    'Âme': 165, Givre: 185, Glace: 195, Vapeur: 200, Eau: 205, 'Métal': 215, 'Négatif': 220, Spirituel: 250,
    Ombre: 265, Sombre: 280, 'Semi-parfait': 295, 'Crépuscule': 305, Violet: 275, Rose: 325, Or: 45 };
function ecart(a, b) { var d = Math.abs(((a - b) % 360 + 360) % 360); return Math.min(d, 360 - d); }
function couleurFausse(a, cible) {
    var fautes = [];
    [[a.animation1Name, a.animation1Hue], [a.animation2Name, a.animation2Hue]].forEach(function (p) {
        var t = TEINTES[p[0]];
        if (!p[0] || !t || t.teinte < 0 || t.part < 0.3) { return; }      // feuille grise/blanche : la rotation ne se voit pas
        var obtenue = (t.teinte + p[1]) % 360;
        if (ecart(obtenue, cible) > 25) { fautes.push(p[0] + ' ' + t.teinte + '°+' + p[1] + '° = ' + obtenue + '° (voulu ' + cible + '°)'); }
    });
    return fautes;
}
var mauvaisesCouleurs = [];
A.forEach(function (a) {
    if (!a || !a.name) { return; }
    var m = a.name.match(/^(.+?) · (.+)$/); if (!m) { return; }
    var cible = C.FORMES.indexOf(m[2]) >= 0 ? CIBLE[m[1]] : (a.id >= 361 && a.id <= 460 ? CIBLE[m[2]] : undefined);
    if (cible === undefined) { return; }
    var f = couleurFausse(a, cible); if (f.length) { mauvaisesCouleurs.push(a.id + ' ' + a.name + ' : ' + f.join(', ')); }
});
ok('chaque ligne de la grille et chaque variante du catalogue a vraiment sa couleur (feuille + rotation)', mauvaisesCouleurs.length === 0, mauvaisesCouleurs.slice(0, 3).join(' ; '));
ok('contre-épreuve : « Eau · Soin » à l\'ancienne recette (Cure1 cyan + 210°) sortait orange, la règle l\'attrape',
    couleurFausse({ animation1Name: 'Cure1', animation1Hue: 210, animation2Name: '', animation2Hue: 0 }, CIBLE.Eau).length === 1);

// ── ② aucune arme muette ─────────────────────────────────────────────────
var armesMuettes = W.filter(function (w) { return w && w.name && w.animationId === 0; });
ok('aucune arme nommée ne frappe sans animation', armesMuettes.length === 0, armesMuettes.length ? armesMuettes.slice(0, 4).map(function (w) { return w.id + ' ' + w.name; }).join(', ') : W.filter(function (w) { return w && w.name; }).length + ' armes');

// ── ③ aucune compétence, aucun objet, aucune arme ne pointe sur une case vide ──
var versVide = [];
[['compétence', S], ['objet', I], ['arme', W]].forEach(function (p) {
    p[1].forEach(function (x) { if (x && x.name && x.animationId > 0 && estVide(A[x.animationId])) { versVide.push(p[0] + ' ' + x.id + ' ' + x.name + ' → ' + x.animationId); } });
});
ok('aucune compétence, objet ou arme ne pointe sur une animation vide', versVide.length === 0, versVide.slice(0, 4).join(' ; '));
var re = /startAnimation\((\d+)\)|requestAnimation\([^,]+,\s*(\d+)\)/g, notesVides = [];
[['état', St], ['compétence', S]].forEach(function (p) {
    p[1].forEach(function (x) { if (!x || !x.note) { return; } var m; re.lastIndex = 0; while ((m = re.exec(x.note))) { var id = parseInt(m[1] || m[2], 10); if (estVide(A[id])) { notesVides.push(p[0] + ' ' + x.id + ' ' + x.name + ' → ' + id); } } });
});
ok('aucune note d\'état ou de compétence n\'appelle une animation vide', notesVides.length === 0, notesVides.join(' ; ') || 'les cases 130 et 135 du Royaume sont remplies');

// ── ④ chaque compétence élémentaire porte une animation de sa couleur ─────
var incoherentes = [], sansAnim = [], elementaires = 0;
S.forEach(function (s) {
    if (!s || !s.name) { return; }
    if (C.LIGNE_PAR_ELEMENT[s.damage.elementId] === undefined) { return; }
    elementaires++;
    if (s.animationId === 0 && C.aBesoinDUneAnim(s)) { sansAnim.push(s.id + ' ' + s.name); return; }
    if (!C.estCoherente(s, A[s.animationId])) { incoherentes.push(s.id + ' « ' + s.name + ' » [' + nomEl(s.damage.elementId) + '] → ' + s.animationId + ' ' + (A[s.animationId] ? A[s.animationId].name : '?')); }
});
ok('aucune compétence élémentaire agissante n\'est sans animation', sansAnim.length === 0, sansAnim.slice(0, 4).join(', ') || elementaires + ' compétences élémentaires');
ok('aucune compétence élémentaire ne joue l\'animation d\'un autre élément', incoherentes.length === 0, incoherentes.slice(0, 5).join(' ; '));
var actives = S.filter(function (s) { return s && s.name && s.animationId === 0 && C.aBesoinDUneAnim(s); });
ok('aucune compétence qui agit en combat n\'est muette, élément ou pas', actives.length === 0, actives.slice(0, 4).map(function (s) { return s.id + ' ' + s.name; }).join(', '));

// ── contre-épreuves : la règle doit attraper un vrai coupable ─────────────
function faux(el, animId, nom, stype) { return { id: 0, name: nom || 'Faux', stypeId: stype || 1, occasion: 0, animationId: animId, damage: { type: 1, elementId: el }, effects: [], note: '' }; }
var eauTous2 = A.filter(function (a) { return a && a.name === 'Eau Tous 2'; })[0];
var feuLame = A.filter(function (a) { return a && a.name === 'Feu · Lame'; })[0];
var frapper = A[1];
ok('contre-épreuve : du FEU qui joue « Eau Tous 2 » est attrapé', !C.estCoherente(faux(8, eauTous2.id, 'Boule de feu'), eauTous2));
ok('contre-épreuve : du FEU qui joue « Frapper Physique » (muet) est attrapé', !C.estCoherente(faux(8, 1, 'Boule de feu'), frapper));
ok('contre-épreuve : du FEU qui joue « Feu · Lame » passe', C.estCoherente(faux(8, feuLame.id, 'Boule de feu'), feuLame));
ok('contre-épreuve : de la LAVE qui joue « Feu · Lame » passe (même famille)', C.estCoherente(faux(19, feuLame.id, 'Coulée'), feuLame));
ok('contre-épreuve : une « Marée de Deuil » spirituelle garde sa vague (le nom l\'appelle)',
    C.estCoherente(faux(2, eauTous2.id, 'Marée de Deuil'), eauTous2));
var drainRose = A.filter(function (a) { return a && a.name === 'Drain de vie · Rose'; })[0];
ok('contre-épreuve : une technique de sang de Vesper garde son rouge', C.estCoherente(faux(4, drainRose.id, 'Ligne Rouge', C.TYPE_SANG), drainRose));
ok('contre-épreuve : une compétence physique peut jouer ce qu\'elle veut', C.estCoherente(faux(1, eauTous2.id, 'Coup'), eauTous2));

// ══ LES ÉTATS ═══════════════════════════════════════════════════════════════
console.log('\n══ LES ÉTATS ' + '═'.repeat(61));
// Un trait est « bon » ou « mauvais » pour celui qui porte l'état.
var SPgood = [0, 1, 1, 1, -1, 1, -1, -1, -1, 1];   // tgr grd rec pha mcr tcr pdr mdr fdr exr
function signe(t) {
    switch (t.code) {
        case 11: case 12: case 13: return t.value < 1 ? 1 : t.value > 1 ? -1 : 0;
        case 14: return 1;
        case 21: return t.value > 1 ? 1 : t.value < 1 ? -1 : 0;
        case 22: return t.dataId === 9 ? 0 : (t.value > 0 ? 1 : t.value < 0 ? -1 : 0);
        case 23: { var g = SPgood[t.dataId]; if (!g || t.value === 1) { return 0; } return (t.value > 1 ? 1 : -1) * g; }
        case 33: return 0;   // la vitesse d'attaque départage l'ordre du tour : ni cadeau ni entrave (et rien du tout quand on ne peut pas bouger)
        case 31: case 32: case 34: case 41: case 43: case 51: case 52: case 64: return 1;
        case 42: case 44: return -1;
        case 61: return t.value > 0 ? 1 : -1;
        case 62: return t.dataId === 0 ? -1 : 1;
        default: return 0;
    }
}
function bons(s) { return s.traits.filter(function (t) { return signe(t) > 0; }); }
function mauvais(s) { return s.traits.filter(function (t) { return signe(t) < 0; }).length + (s.restriction > 0 ? 1 : 0); }
// Un état dont le nom est une blessure ou une entrave ne doit rien OFFRIR à celui qui le porte.
// (« Massacre Aveugle » n'est pas un mal : c'est une rage choisie, AGI ×5 contre −80 % de précision — on écrit « aveuglé ».)
var NOM_DE_MAL = /hémorragie|saignement|brûlure|combustion|poison|putréf|\bgel|givre éternel|fatigue|terreur|faiblesse|vulnérab|silence|muet|paralys|aveuglé|sommeil|endormi|étourdi|confus|lourdeur|poisse|corrompu|maladresse|désespoir|épuisement|malédiction|fragilité|hésitation/i;
var malsQuiOffrent = St.filter(function (s) { return s && s.name && NOM_DE_MAL.test(s.name) && bons(s).length > 0; })
    .map(function (s) { return s.id + ' ' + s.name + ' (' + JSON.stringify(bons(s)) + ')'; });
ok('aucun état nommé comme un mal n\'offre quelque chose à celui qui le porte', malsQuiOffrent.length === 0, malsQuiOffrent.slice(0, 4).join(' ; ') || St.filter(function (s) { return s && s.name && NOM_DE_MAL.test(s.name); }).length + ' états de mal contrôlés');
var mauxSansEffet = St.filter(function (s) { return s && s.name && NOM_DE_MAL.test(s.name) && mauvais(s) === 0 && !/<Custom|<Desc/.test(s.note || '') && S.some(function (k) { return k && k.effects.some(function (e) { return e.code === 21 && e.dataId === s.id; }); }); })
    .map(function (s) { return s.id + ' ' + s.name; });
ok('aucun état de mal posé par une compétence n\'est sans effet', mauxSansEffet.length === 0, mauxSansEffet.join(', '));
// Les huit corrections, une par une.
function trait(id, code, dataId) { return (St[id].traits.filter(function (t) { return t.code === code && t.dataId === dataId; })[0] || {}).value; }
ok('Fatigue (14) affaiblit : ATQ et AGI ×0,8', trait(14, 21, 2) === 0.8 && trait(14, 21, 6) === 0.8);
ok('Saignement Brûlant (18) ralentit : AGI ×0,9', trait(18, 21, 6) === 0.9);
ok('Hésitation (41) encaisse : dégâts physiques ×1,25', trait(41, 11, 1) === 1.25);
ok('Terrain Corrompu (51) draine PV et PM', trait(51, 22, 7) === -0.05 && trait(51, 22, 8) === -0.05);
ok('Vulnérable (71) fait quelque chose : dégâts physiques ×1,25', trait(71, 23, 6) === 1.25);
ok('Hémorragie Profonde (210) saigne : −10 % PV / tour, et ne protège plus de la magie', trait(210, 22, 7) === -0.1 && trait(210, 23, 7) === undefined);
ok('Silence Runique (212) scelle les Spéciales et les ult', trait(212, 42, 2) === 1 && trait(212, 42, 3) === 1 && trait(212, 43, 1) === undefined);
ok('Combustion (221) brûle : −12 % PV / tour, et ne protège plus de la magie', trait(221, 22, 7) === -0.12 && trait(221, 23, 7) === undefined);
// contre-épreuves
ok('contre-épreuve : une « Brûlure » qui donne ATQ ×1,5 serait attrapée', bons({ traits: [{ code: 21, dataId: 2, value: 1.5 }] }).length === 1);
ok('contre-épreuve : « Frénésie » ATQ ×1,6 / DÉF ×0,7 n\'est pas un mal, la règle la laisse', !NOM_DE_MAL.test('Frénésie Sanguinaire'));
// 2026-10-14 : quatre états ajoutés pour Vesper (1001 Rage, 1002 Épuisement du Flow, 1003 Armure Brisée,
// 1004 Convergence). « Rien de supprimé » : on ne descend jamais sous ce que la base contenait.
var nommes = St.filter(function (s) { return s && s.name; }).length;
ok('rien n\'a été supprimé : au moins 239 états nommés, au moins 1 000 cases', nommes >= 239 && St.length >= 1001, nommes + ' nommés · ' + (St.length - 1) + ' cases');

console.log('\n' + '═'.repeat(74) + '\n   ' + vert + ' contrôles passés · ' + rouge + ' échec(s)\n' + '═'.repeat(74));
process.exit(rouge ? 1 : 0);
