/*
 * LE SYSTÈME — états, objets, armes et armures
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-12 : « Maintenant pour le système surtout état, objets, arme et
 * armure […] tu peux changer ce qui est déjà là pour l'améliorer si possible
 * mais toujours tu proposes, on réfléchit ensemble », puis, sur les six idées :
 * « Oui tout mais reste cohérent au lore aussi ».
 *
 * Ce que l'outil écrit (avec --ecrire ; sans, il dit seulement ce qu'il ferait) :
 *   ① les icônes des états qui agissent et n'en avaient pas (pas les marqueurs
 *      invisibles des plugins : une icône de plus prendrait l'une des deux
 *      places qu'un héros a pour ses états) ; une fin pour le seul état qu'une
 *      compétence de héros pose et qui restait après le combat (Domaine Déployé) ;
 *   ③ un prix aux armes et armures qui n'en avaient pas, selon leur puissance
 *      (la Bible : « une relique a un rang selon ses performances ») — jamais les
 *      pièces de l'Âme (les anciens dons), jamais un prix déjà posé ;
 *   ④ une description aux armes, armures et objets muets : ce qu'ils FONT, lu
 *      dans leurs traits — aucun lore inventé ;
 *   ⑥ un nom distinct aux états qui portaient le même nom ;
 *   ② le tableau des pièces sans source : docs/EQUIPEMENT_SANS_SOURCE.md.
 *
 *   node bancs/outils/le_systeme.js            (montre)
 *   node bancs/outils/le_systeme.js --ecrire   (écrit data/ et le tableau)
 *   node bancs/outils/le_systeme.js --sortie <dossier>   (écrit ailleurs : bancs)
 */
'use strict';
var fs = require('fs'), path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var args = process.argv.slice(2);
var ECRIRE = args.indexOf('--ecrire') >= 0;
var iS = args.indexOf('--sortie'), SORTIE = iS >= 0 ? path.resolve(args[iS + 1]) : null;
var DATA = path.join(RACINE, 'data');
function lire(n) { return JSON.parse(fs.readFileSync(path.join(DATA, n + '.json'), 'utf8')); }
function ecrire(n, o) {
    var dossier = SORTIE ? path.join(SORTIE, 'data') : DATA;
    if (!fs.existsSync(dossier)) fs.mkdirSync(dossier, { recursive: true });
    // la forme de RPG Maker : une entrée par ligne (le diff reste lisible, l'éditeur relit sans rien changer)
    fs.writeFileSync(path.join(dossier, n + '.json'), '[\n' + o.map(function (x) { return JSON.stringify(x); }).join(',\n') + '\n]');
}
var St = lire('States'), It = lire('Items'), We = lire('Weapons'), Ar = lire('Armors'), Sk = lire('Skills'), En = lire('Enemies'), Sy = lire('System');
var journal = [];
function note(t) { journal.push(t); }

// ── ① les états ─────────────────────────────────────────────────────────────
// l'icône d'un élément est celle que le jeu lui donne déjà (Résistance — Feu : 64, les auras ◈ 64-71)
var ICONES = {
    21: 81,     // « RESTISTE » : résiste à un état → le bouclier (Bouclier de Mana)
    45: 58,     // Technique Incomplète : ATQ et MAG ×0,75 → l'attaque qui baisse (Affaiblissement)
    60: 7,      // Fascination Macabre : attire les coups → le cœur (Charmé)
    102: 67, 103: 66, 104: 65, 105: 68, 106: 69, 107: 70, 108: 71,   // Résistance — Eau, Foudre, Glace, Terre, Vent, Lumière, Ombre
    109: 2588,  // Résistance — Sombre (mana négatif) → l'icône de Mana Sombre
    110: 14,    // Résistance — Positif → l'icône des Bénédictions
    176: 58,    // Empathie de Dono : ATQ et MAG ×0,55
    177: 127,   // Sérieux : précision et coups critiques en hausse → la Concentration
    184: 81     // Kamui ◈ Intangible
};
Object.keys(ICONES).forEach(function (k) {
    var s = St[+k];
    if (!s || s.iconIndex) return;
    note('état ' + k + ' « ' + s.name.trim() + ' » : icône ' + ICONES[k]);
    s.iconIndex = ICONES[k];
});
// la seule pose d'un héros qui ne finissait jamais : le Domaine Déployé restait après le combat
if (St[16] && !St[16].removeAtBattleEnd && St[16].autoRemovalTiming === 0) {
    St[16].removeAtBattleEnd = true;
    note('état 16 « Domaine Déployé » : retiré à la fin du combat (il restait sur le héros après)');
}
// ⑥ les noms portés deux fois : un nom qui dit ce qui les distingue (les variables 12, 14, 13 sont les jauges de
//    Korrah, de Vesper et de ludwing — la note de l'état les lit ; 69 met la DÉF à 0 ; 186 ne touche que l'AGI)
var NOMS = { 62: 'Normal · Korrah', 63: 'Normal · Vesper', 64: 'Normal · ludwing', 69: 'Provocation · garde baissée', 186: 'Euphorie · vitesse' };
Object.keys(NOMS).forEach(function (k) {
    var s = St[+k];
    if (!s || s.name === NOMS[k]) return;
    note('état ' + k + ' : « ' + s.name.trim() + ' » → « ' + NOMS[k] + ' »');
    s.name = NOMS[k];
});

// ── ③ les prix ──────────────────────────────────────────────────────────────
function valeur(o) { var p = o.params; return p[2] + p[3] + p[4] + p[5] + p[6] + p[7] + p[0] / 10 + p[1] / 5; }
function mediane(l) { l = l.slice().sort(function (a, b) { return a - b; }); return l.length ? l[Math.floor(l.length / 2)] : 0; }
function arrondi(x) { return x < 100 ? Math.max(10, Math.round(x / 5) * 5) : x < 1000 ? Math.round(x / 10) * 10 : Math.round(x / 50) * 50; }
function horsPrix(o, armure) { return armure && (o.etypeId === 7 || !Sy.equipTypes[o.etypeId]); }   // les pièces de l'Âme (anciens dons)
function ratio(L, armure) {
    return mediane(L.filter(function (o) { return o && o.name && o.price > 0 && valeur(o) > 0 && !horsPrix(o, armure); }).map(function (o) { return o.price / valeur(o); }));
}
var RW = ratio(We, false), RA = ratio(Ar, true), ecarts = [];
function prix(L, R, armure, nom) {
    var n = 0;
    L.forEach(function (o) {
        if (!o || !o.name || horsPrix(o, armure) || /mains nues/i.test(o.name)) return;   // les mains nues ne se vendent pas
        var regle = arrondi(Math.max(1, valeur(o)) * R);
        if (!o.price) { o.price = regle; n++; return; }
        if (o.price < regle * 0.5 || o.price > regle * 2) ecarts.push({ type: nom, o: o, regle: regle });
    });
    note(nom + ' : ' + n + ' prix posés (' + R.toFixed(1) + ' G par point de puissance, la médiane des prix déjà posés)');
}
prix(We, RW, false, 'armes'); prix(Ar, RA, true, 'armures');

// ── ④ les descriptions ─────────────────────────────────────────────────────
var ARMES = { 1: 'Dague', 2: 'Épée', 3: 'Arme à feu', 4: 'Hache', 5: 'Fouet', 6: 'Canne', 7: 'Arc', 8: 'Arbalète', 9: 'Fusil', 10: 'Griffes', 11: 'Gants', 12: 'Lance', 13: 'Fusil à pompe', 14: 'Arme d\'ombre' };
var PLACES = { 2: 'Bouclier', 3: 'Coiffe', 4: 'Tenue', 5: 'Accessoire', 6: 'Talisman' };
var PARAMS = ['PV max', 'PM max', 'ATQ', 'DÉF', 'ATQ M.', 'DÉF M.', 'AGI', 'CHA'];
var XP = { 0: 'précision', 1: 'esquive', 2: 'coups critiques', 3: 'esquive des critiques', 4: 'esquive magique', 5: 'renvoi magique', 6: 'contre-attaque', 7: 'régén. PV', 8: 'régén. PM', 9: 'régén. PT' };
function el(i) { var n = String(Sy.elements[i] || '').trim(); return n ? n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : null; }
function etat(i) { var s = St[i]; return s && s.name ? s.name.replace(/^[^A-Za-zÀ-ÿ]+/, '').trim() : null; }
function pct(v) { return Math.round(v * 100) + ' %'; }
function effets(o, armure) {
    var out = [];
    (o.traits || []).forEach(function (t) {
        if (t.code === 31 && t.dataId > 1 && el(t.dataId)) out.push('frappe en ' + el(t.dataId));
        else if (t.code === 32 && etat(t.dataId) && t.value > 0) out.push(pct(t.value) + ' de chances de ' + etat(t.dataId).toLowerCase());
        else if (t.code === 34 && t.value > 0) out.push('frappe ' + (t.value + 1) + ' fois');
        else if (t.code === 22 && XP[t.dataId] && t.value) out.push(XP[t.dataId] + ' ' + (t.value > 0 ? '+' : '−') + pct(Math.abs(t.value)));
        else if (t.code === 11 && el(t.dataId) && t.value !== 1) out.push(t.value < 1 ? 'résiste à ' + el(t.dataId) + ' (×' + String(t.value).replace('.', ',') + ')' : 'craint ' + el(t.dataId) + ' (×' + String(t.value).replace('.', ',') + ')');
        else if (t.code === 14 && etat(t.dataId)) out.push('protège de ' + etat(t.dataId).toLowerCase());
        else if (t.code === 13 && etat(t.dataId) && t.value < 1) out.push('moins sensible à ' + etat(t.dataId).toLowerCase());
        else if (t.code === 21 && t.value !== 1 && PARAMS[t.dataId]) out.push(PARAMS[t.dataId] + ' ×' + String(t.value).replace('.', ','));
        else if (t.code === 43 && Sk[t.dataId] && Sk[t.dataId].name) out.push('apprend « ' + Sk[t.dataId].name + ' »');
        else if (t.code === 23 && t.dataId === 0 && t.value > 1) out.push('attire les coups');
    });
    // les statistiques : pour une armure toutes, pour une arme celles qui ne sont pas l'attaque (l'écran la montre déjà)
    o.params.forEach(function (v, i) { if (!v) return; if (!armure && i === 2) return; out.push(PARAMS[i] + ' ' + (v > 0 ? '+' : '−') + Math.abs(v)); });
    return out;
}
function decrire(o, armure) {
    if (/mains nues/i.test(o.name)) return 'Se battre à mains nues.';
    var quoi = armure ? (PLACES[o.etypeId] || 'Équipement') : (ARMES[o.wtypeId] || 'Arme');
    var e = effets(o, armure);
    if (!e.length) return quoi + ', sans propriété particulière.';
    var t = quoi + ' : ' + e.join(' · ') + '.';
    return t.charAt(0).toUpperCase() + t.slice(1);
}
var nD = { armes: 0, armures: 0, objets: 0 };
We.forEach(function (o) { if (o && o.name && !String(o.description || '').trim()) { o.description = decrire(o, false); nD.armes++; } });
Ar.forEach(function (o) { if (o && o.name && !String(o.description || '').trim()) { o.description = decrire(o, true); nD.armures++; } });
var OBJETS = { 112: 'La clé de ta chambre à l\'auberge.' };
It.forEach(function (o) { if (o && o.name && !String(o.description || '').trim() && OBJETS[o.id]) { o.description = OBJETS[o.id]; nD.objets++; } });
note('descriptions : ' + nD.armes + ' armes, ' + nD.armures + ' armures, ' + nD.objets + ' objet (le « cored » 68 reste muet : on ne sait pas ce que c\'est)');

// ── ② le tableau des pièces sans source ─────────────────────────────────────
var tout = fs.readdirSync(DATA).filter(function (f) { return /^Map\d+\.json$/.test(f); }).map(function (f) { return fs.readFileSync(path.join(DATA, f), 'utf8'); }).join('\n')
    + fs.readFileSync(path.join(DATA, 'CommonEvents.json'), 'utf8') + fs.readFileSync(path.join(DATA, 'Troops.json'), 'utf8');
var plugins = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
var source = {};
function marque(k, id, s) { var c = k + ':' + id; (source[c] = source[c] || []); if (source[c].indexOf(s) < 0) source[c].push(s); }
En.forEach(function (e) { if (e && e.name) (e.dropItems || []).forEach(function (d) { if (d.kind > 0 && d.dataId) marque(d.kind, d.dataId, 'butin'); }); });
var m, r1 = /"code":(302|605),"indent":\d+,"parameters":\[(\d),(\d+)/g; while ((m = r1.exec(tout))) marque(+m[2] + 1, +m[3], 'boutique');
var r2 = /"code":(126|127|128),"indent":\d+,"parameters":\[(\d+),0/g; while ((m = r2.exec(tout))) marque(+m[1] - 125, +m[2], 'événement');
var r3 = /"code":(126|127|128),"indent":\d+,"parameters":\[(\d+),0,0/g;
function rang(v, l) { var i = l.indexOf(v), q = i / Math.max(1, l.length - 1); return q < 0.2 ? 'D' : q < 0.45 ? 'C' : q < 0.7 ? 'B' : q < 0.9 ? 'A' : 'S'; }
function tableau(k, L, armure, titre) {
    var vrais = L.filter(function (o) { return o && o.name && !horsPrix(o, armure); });
    var vals = vrais.map(valeur).sort(function (a, b) { return a - b; });
    var sans = vrais.filter(function (o) { return !source[k + ':' + o.id]; });
    var lignes = ['## ' + titre + ' — ' + sans.length + ' sur ' + vrais.length + ' sans source', '', '| Rang | N° | Nom | ' + (armure ? 'Emplacement' : 'Type') + ' | Puissance | Prix | Ce qu\'elle fait |', '|---|---|---|---|---|---|---|'];
    sans.sort(function (a, b) { return valeur(a) - valeur(b); }).forEach(function (o) {
        var v = valeur(o), boss = (o.note.match(/<ButinBoss:\s*(\d+)>/) || [])[1];
        var quoi = armure ? (PLACES[o.etypeId] || '?') : (ARMES[o.wtypeId] || '?');
        lignes.push('| ' + rang(v, vals) + ' | ' + o.id + ' | ' + o.name.trim() + (boss ? ' *(mémo : butin du boss ' + boss + ')*' : '') + ' | ' + quoi + ' | ' + Math.round(v) + ' | ' + o.price + ' | ' + String(o.description || '').replace(/\|/g, '/').replace(/\n/g, ' ').slice(0, 90) + ' |');
    });
    return { lignes: lignes, n: sans.length, total: vrais.length, rangs: sans.reduce(function (a, o) { var r = rang(valeur(o), vals); a[r] = (a[r] || 0) + 1; return a; }, {}) };
}
var TW = tableau(2, We, false, 'Armes'), TA = tableau(3, Ar, true, 'Armures'), TI = (function () {
    var vrais = It.filter(function (o) { return o && o.name && o.itypeId === 1 && !/<(Poisson|Trouvaille|Bouteille|Plage)/.test(o.note); });
    var sans = vrais.filter(function (o) { return !source['1:' + o.id]; });
    var l = ['## Objets — ' + sans.length + ' sur ' + vrais.length + ' sans source', '', '*(les poissons, les trouvailles et les bouteilles de la plage ont leur source dans LaPlage : ils ne sont pas comptés)*', '', '| N° | Nom | Ce qu\'il fait |', '|---|---|---|'];
    sans.forEach(function (o) { l.push('| ' + o.id + ' | ' + o.name.trim() + ' | ' + String(o.description || '').replace(/\|/g, '/').replace(/\n/g, ' ').slice(0, 100) + ' |'); });
    return { lignes: l, n: sans.length, total: vrais.length };
})();
function rangs(r) { return ['D', 'C', 'B', 'A', 'S'].map(function (k) { return k + ' ' + (r[k] || 0); }).join(' · '); }
var doc = [
    '# L\'équipement sans source',
    '',
    '*Mesuré le ' + new Date().toISOString().slice(0, 10) + ' par `bancs/outils/le_systeme.js` (JOKO : « Oui tout mais reste cohérent au lore »).*',
    '',
    'Une pièce **a une source** si un ennemi la laisse en butin, si une boutique la vend (cartes, événements communs, troupes), ou si un événement la',
    'donne (« Modifier les objets / armes / armures »). Les autres n\'existent pas pour le joueur. **Rien n\'a été posé** : les cartes et le level design',
    'sont à toi — ce tableau est là pour choisir.',
    '',
    '**Le rang** suit la Bible (*« une relique a un rang selon ses performances »*, de D à S) : la puissance de la pièce (ses statistiques), rangée',
    'parmi toutes celles de son genre (les 20 % les plus faibles en D, puis C, B, A, et les 10 % les plus fortes en S). Il aide à placer : du D au',
    'magasin du village, du C et du B dans les butins du Chapitre 1, l\'A et le S pour les boss et les coffres — à toi de dire.',
    '',
    '| | Sans source | Par rang |',
    '|---|---|---|',
    '| Armes | ' + TW.n + ' / ' + TW.total + ' | ' + rangs(TW.rangs) + ' |',
    '| Armures | ' + TA.n + ' / ' + TA.total + ' | ' + rangs(TA.rangs) + ' |',
    '| Objets | ' + TI.n + ' / ' + TI.total + ' | |',
    '',
    'Les pièces de l\'Âme (les anciens dons, emplacement 7) ne sont pas comptées.',
    '',
    '## Les prix à revoir',
    '',
    'Les prix vides ont reçu celui de la règle (' + RW.toFixed(1) + ' G par point de puissance pour une arme, ' + RA.toFixed(1) + ' pour une armure : la médiane des prix',
    'que tu avais posés). **Tes prix n\'ont pas été touchés** ; voici ceux qui s\'écartent de plus du double de la règle, dans un sens ou dans l\'autre :',
    '',
    '| Genre | N° | Nom | Ton prix | La règle |',
    '|---|---|---|---|---|'
].concat(ecarts.sort(function (a, b) { return (b.o.price / b.regle) - (a.o.price / a.regle); }).map(function (e) {
    return '| ' + e.type + ' | ' + e.o.id + ' | ' + e.o.name.trim() + ' | ' + e.o.price + ' | ' + e.regle + ' |';
}), [''], TW.lignes, [''], TA.lignes, [''], TI.lignes, ['']).join('\n');

console.log(journal.join('\n'));
console.log('sans source : armes ' + TW.n + '/' + TW.total + ', armures ' + TA.n + '/' + TA.total + ', objets ' + TI.n + '/' + TI.total + ' · prix à revoir : ' + ecarts.length);
if (ECRIRE || SORTIE) {
    ecrire('States', St); ecrire('Weapons', We); ecrire('Armors', Ar); ecrire('Items', It);
    var dd = SORTIE ? path.join(SORTIE, 'docs') : path.join(RACINE, 'docs');
    if (!fs.existsSync(dd)) fs.mkdirSync(dd, { recursive: true });
    fs.writeFileSync(path.join(dd, 'EQUIPEMENT_SANS_SOURCE.md'), doc);
    console.log('écrit' + (SORTIE ? ' dans ' + SORTIE : ''));
} else { console.log('(rien écrit : --ecrire pour écrire)'); }
