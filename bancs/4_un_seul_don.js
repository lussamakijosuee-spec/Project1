// ════════════════════════════════════════════════════════════════════════════
//  BANC D'ESSAI — « UN SEUL DON PAR PERSONNE »  (v3.0)
// ════════════════════════════════════════════════════════════════════════════
const fs = require('fs');
const D = require('path').join(__dirname, '../data/');
const rd = f => JSON.parse(fs.readFileSync(D + f, 'utf8'));
const W = rd('Weapons.json'), A = rd('Armors.json'), Ac = rd('Actors.json');
const S = rd('Skills.json'), C = rd('Classes.json'), Sy = rd('System.json');

let ok = 0, ko = 0;
const T = (nom, cond, det) => {
    if (cond) { ok++; console.log('  ✅ ' + nom); }
    else { ko++; console.log('  ❌ ' + nom + (det ? '\n        → ' + det : '')); }
};

// MV : DataManager.extractMetadata
function meta(o) {
    const m = {}, re = /<([^<>:]+)(:?)([^>]*)>/g; let r;
    while ((r = re.exec(o.note || '')) !== null) {
        if (r[2] === ':') m[r[1]] = r[3]; else m[r[1]] = true;
    }
    return m;
}
const pieces = [];
W.forEach((w, i) => { if (w) pieces.push({ k: 'arme', i, o: w, m: meta(w) }); });
A.forEach((a, i) => { if (a) pieces.push({ k: 'armure', i, o: a, m: meta(a) }); });

console.log('\n─── 1 · LA RÈGLE D\'OR : un seul Don par personne ───');
const HEROS = { 1: 'Vesper', 2: 'Korrah', 3: 'ludwing', 4: 'Aël' };
const CLE = { vesper: 1, korrah: 2, ludwing: 3, ael: 4 };

// combien de FORMES de Don chaque héros possède-t-il ?
const formes = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() };
pieces.forEach(p => {
    const cle = String(p.m['Don'] || p.m['DonSpirituel'] || p.m['Objet Spirituel'] || '').toLowerCase().trim();
    const alias = { thylane: 'vesper', neyssa: 'korrah', lou: 'ludwing', tianna: 'ael' };
    const id = CLE[alias[cle] || cle];
    // MV garde l'espace après « : » — comme le plugin, on trim.
    if (id) formes[id].add(String(p.m['Forme'] || '?').trim());
});
for (const id in HEROS) {
    T(HEROS[id] + ' n\'a QU\'UNE seule forme de Don',
      formes[id].size === 1, HEROS[id] + ' porte : ' + [...formes[id]].join(' + '));
}
T('Aucune pièce ne porte encore <Manifestation>',
  !pieces.some(p => p.m['Manifestation']),
  pieces.filter(p => p.m['Manifestation']).map(p => p.k + ' #' + p.i).join(', '));

console.log('\n─── 2 · LES QUATRE FORMES SONT LES BONNES ───');
T('Vesper — OBJET (accessoire)',  [...formes[1]][0] === 'objet');
T('Korrah — AVATAR (âme)',        [...formes[2]][0] === 'avatar');
T('ludwing — OBJET (accessoire)', [...formes[3]][0] === 'objet');
T('Aël — ARME (slot Arme)',       [...formes[4]][0] === 'arme');
T('Plus aucun <Forme: familier> dans les données',
  !pieces.some(p => String(p.m['Forme']).trim() === 'familier'));

console.log('\n─── 3 · L\'ÉQUIPEMENT DE DÉPART : une main d\'acier ───');
const SLOT = { 0: 'Arme', 4: 'Accessoire', 6: 'Âme' };
for (const id in HEROS) {
    const eq = Ac[id].equips;
    // combien de pièces de Don le héros porte-t-il au départ ?
    let dons = 0, detail = [];
    eq.forEach((wid, slot) => {
        if (!wid) return;
        const o = slot === 0 ? W[wid] : A[wid];
        if (!o) { detail.push('slot ' + slot + ' → #' + wid + ' INTROUVABLE'); return; }
        const m = meta(o);
        if (m['Don']) { dons++; detail.push(o.name + ' (DON)'); }
        else detail.push(o.name);
    });
    T(HEROS[id] + ' démarre avec EXACTEMENT un Don équipé',
      dons === 1, detail.join(' · '));
}
// et les armes équipées sont bien ordinaires, sauf pour Aël
[1, 2, 3].forEach(id => {
    const w = W[Ac[id].equips[0]];
    T(HEROS[id] + ' tient une arme ORDINAIRE (' + (w ? w.name : '—') + ')',
      w && !meta(w)['Don'] && !/^Éclat /.test(w.name));
});
T('Aël tient son Don — c\'est une ARME spirituelle',
  !!meta(W[Ac[4].equips[0]])['Don']);

console.log('\n─── 4 · LE MOT « ÉCLAT » EST RÉSERVÉ AU PALIER 1 D\'UN DON ───');
const faux = pieces.filter(p => /^Éclat\b/i.test(p.o.name) && !p.m['Don']);
T('Aucune pièce ordinaire ne s\'appelle « Éclat … »',
  faux.length === 0, faux.map(p => p.k + ' #' + p.i + ' ' + p.o.name).join(', '));
const eclats = pieces.filter(p => p.m['Don'] && String(p.m['Palier']).trim() === '1');
T('Les 4 Éclats existent, un par héros', eclats.length === 4,
  eclats.map(p => '#' + p.i + ' ' + p.o.name).join(' · '));

console.log('\n─── 5 · LES ARMES 501-512 SONT REDEVENUES ORDINAIRES (rien supprimé) ───');
let ordi = 0, prix = 0, typeComp = 0;
for (let i = 501; i <= 512; i++) {
    const w = W[i];
    if (!w) { T('arme #' + i + ' toujours présente', false); continue; }
    ordi++;
    if (w.price > 0) prix++;
    if (w.traits.some(t => t.code === 41)) typeComp++;
}
T('Les 12 armes existent toujours — aucune suppression', ordi === 12);
T('Les 12 ont un prix : elles sont réellement atteignables', prix === 12);
T('Aucune n\'ouvre plus de type de compétence (c\'est l\'affaire de l\'Amulette)', typeComp === 0);
T('Aucune ne porte plus de note de Don',
  ![501,502,503,504,505,506,507,508,509,510,511,512].some(i => (W[i].note || '').indexOf('<Don') >= 0
      || (W[i].note || '').indexOf('Manifestation') >= 0));

console.log('\n─── 6 · L\'AMULETTE OUVRE LES OMBRES (canon), PAS UNE ARME ───');
const attendu = [2, 4, 6, 8];
for (let k = 0; k < 4; k++) {
    const t = A[72 + k].traits.filter(x => x.code === 41);
    T('Amulette palier ' + (k + 1) + ' ouvre ' + attendu[k] + ' type(s) d\'ombre',
      t.length === attendu[k], 'trouvé ' + t.length);
}
const p4 = A[75].traits.filter(t => t.code === 41).map(t => t.dataId).sort((a, b) => a - b);
T('À la Vérité, les HUIT ombres (11→18) sont ouvertes',
  JSON.stringify(p4) === JSON.stringify([11,12,13,14,15,16,17,18]), p4.join(','));
// aucune n'était atteignable pour 13,15,17,18 avant : on le vérifie côté sources
const sources41 = {};
pieces.concat(C.filter(Boolean).map((c,i)=>({k:'classe',i,o:c,m:{}})))
      .forEach(p => (p.o.traits || []).forEach(t => {
          if (t.code === 41 && t.dataId >= 11 && t.dataId <= 18)
              (sources41[t.dataId] = sources41[t.dataId] || []).push(p.k + '#' + p.i);
      }));
const orphelins = [11,12,13,14,15,16,17,18].filter(t => !sources41[t]);
T('Les 8 types d\'ombre ont tous une source', orphelins.length === 0,
  'sans source : ' + orphelins.join(','));

console.log('\n─── 7 · LE MASQUE PORTE ENFIN UN EFFET (tout OBJET doit en avoir un) ───');
[68,69,70,71].forEach((i,k) => {
    const t = A[i].traits.find(x => x.code === 23 && x.dataId === 7);
    T('Masque palier ' + (k+1) + ' : régénération de PV', !!t && t.value > 0,
      t ? '' : 'aucun trait HRG');
});
let croissant = true;
for (let k = 1; k < 4; k++) {
    const a = A[67+k].traits.find(x => x.code===23 && x.dataId===7);
    const b = A[68+k].traits.find(x => x.code===23 && x.dataId===7);
    if (!a || !b || b.value <= a.value) croissant = false;
}
T('La régénération monte à chaque palier', croissant);

console.log('\n─── 8 · TROIS ORDRES À L\'AVATAR, JOUABLES EN COMBAT ───');
const ORD = [1246, 1247, 1248];
ORD.forEach(id => {
    const s = S[id];
    T('Compétence #' + id + ' « ' + (s ? s.name : '?') + ' » existe', !!s);
    if (!s) return;
    T('  · gratuite (0 mana, 0 TP)', s.mpCost === 0 && s.tpCost === 0);
    T('  · porte <AvatarPosture>', /<AvatarPosture:\s*\w+>/.test(s.note));
    T('  · en combat seulement', s.occasion === 1);
    T('  · type de compétence accessible à Korrah',
      C[2].traits.some(t => t.code === 41 && t.dataId === s.stypeId));
});
const apprises = ORD.filter(id => C[2].learnings.some(l => l.skillId === id && l.level <= 1));
T('Korrah connaît les trois ordres dès le niveau 1', apprises.length === 3,
  apprises.length + '/3');
const postures = ORD.map(id => (S[id].note.match(/<AvatarPosture:\s*(\w+)>/) || [])[1]);
T('Les trois postures sont distinctes et valides',
  new Set(postures).size === 3 && postures.every(p => ['libre','agressif','garde'].includes(p)),
  postures.join(', '));

console.log('\n─── 9 · LES GESTES DE L\'AVATAR (469-471) ───');
[469,470,471].forEach(id => {
    T('Compétence #' + id + ' notée <Avatar>', (S[id].note || '').indexOf('<Avatar>') >= 0);
});
T('Plus aucune compétence notée <Familier>',
  !S.some(s => s && /<Familier>/.test(s.note || '')));

console.log('\n─── 10 · LE VERROU : chaque Don nomme son porteur ───');
pieces.filter(p => p.m['Don']).forEach(p => {
    const cle = String(p.m['Don']).toLowerCase().trim();
    const attendu = CLE[cle];
    const declare = parseInt(p.m['DonDe']);
    T('#' + p.i + ' ' + p.o.name + ' → verrouillé sur ' + (HEROS[attendu] || '?'),
      declare === attendu, 'DonDe=' + p.m['DonDe'] + ' attendu ' + attendu);
});

console.log('\n─── 11 · RIEN N\'EST CASSÉ AILLEURS ───');
T('Aucune référence à une arme inexistante dans l\'équipement de départ',
  [1,2,3,4].every(id => Ac[id].equips.every((w,s) => !w || (s===0 ? W[w] : A[w]))));
T('Les classes peuvent équiper l\'arme de départ de leur héros',
  [1,2,3,4].every(id => {
      const w = W[Ac[id].equips[0]];
      return !w || C[Ac[id].classId].traits.some(t => t.code === 51 && t.dataId === w.wtypeId);
  }));
T('Toutes les compétences apprises par les 4 classes existent',
  [1,2,3,4].every(id => C[id].learnings.every(l => !!S[l.skillId])));
T('Aucun doublon d\'identifiant dans les nouveaux ordres',
  new Set(ORD).size === 3 && ORD.every(id => S[id] && S[id].id === id));

console.log('\n' + '═'.repeat(70));
console.log('  ' + ok + ' contrôles passés · ' + ko + ' échec(s)');
console.log('═'.repeat(70) + '\n');
process.exit(ko ? 1 : 0);
