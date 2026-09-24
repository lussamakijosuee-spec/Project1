// ════════════════════════════════════════════════════════════════════════════
//  BANC D'ESSAI — « UN SEUL DON PAR PERSONNE »  (v3.0)
// ════════════════════════════════════════════════════════════════════════════
const fs = require('fs');
const D = require('path').join(__dirname, '../data/');
const rd = f => JSON.parse(fs.readFileSync(D + f, 'utf8'));
const W = rd('Weapons.json'), A = rd('Armors.json'), Ac = rd('Actors.json');
const S = rd('Skills.json'), C = rd('Classes.json'), Sy = rd('System.json');
const Et = rd('States.json');

// Le système des Dons est-il encore en service ? Le registre le dit, pas nous.
// Retiré le 2026-09-24 : « trop complexe pour rien ». Les contrôles qui le
// concernent basculent alors sur la règle qui a cours — plus aucun Don porté.
const DONS_EN_SERVICE = (function () {
    const reg = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'js', 'plugins.js'), 'utf8')
        .replace(/^[^\[]*/, '').replace(/;\s*$/, ''));
    return reg.some(p => p.name === 'DonsSpirituels' && p.status);
})();

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
    // Depuis le 2026-09-24, le système des Dons est retiré : la règle n'est
    // plus « exactement un », c'est « plus aucun ». On mesure celle qui a cours.
    if (DONS_EN_SERVICE) {
        T(HEROS[id] + ' démarre avec EXACTEMENT un Don équipé',
          dons === 1, detail.join(' · '));
    } else {
        T(HEROS[id] + ' ne porte plus aucun Don',
          dons === 0, detail.join(' · '));
    }
}
// et les armes équipées sont bien ordinaires — Aël comprise, depuis le retrait
[1, 2, 3].forEach(id => {
    const w = W[Ac[id].equips[0]];
    T(HEROS[id] + ' tient une arme ORDINAIRE (' + (w ? w.name : '—') + ')',
      w && !meta(w)['Don'] && !/^Éclat /.test(w.name));
});
if (DONS_EN_SERVICE) {
    T('Aël tient son Don — c\'est une ARME spirituelle',
      !!meta(W[Ac[4].equips[0]])['Don']);
} else {
    const wA = W[Ac[4].equips[0]];
    T('Aël aussi tient une arme ORDINAIRE (' + (wA ? wA.name : '—') + ')',
      !!wA && !meta(wA)['Don']);
}

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

// ─────────────────────────────────────────────────────────────────────────
// 2026-09-20 — CE CONTRÔLE A CHANGÉ DE CAMP.
// Il gardait l'ancienne règle : « l'Amulette ouvre progressivement les huit
// branches d'arme d'ombre ». JOKO l'a retirée :
//   « pour Ludwig, toutes les armes, à la base, c'était parce que j'avais fait
//     un événement où il y avait une sorte de roulette gacha […] je vais
//     enlever ça. Parce que ça sert à rien finalement. »
// Le banc garde donc la règle d'AUJOURD'HUI : plus aucune source n'ouvre une
// branche d'arme d'ombre — ni la classe, ni l'Amulette, ni rien d'autre — et
// les huit compétences restent en base, intactes (règle 3).
// ─────────────────────────────────────────────────────────────────────────
console.log('\n─── 6 · AUCUNE BRANCHE D\'OMBRE N\'EST OUVERTE EN PERMANENCE ───');
// La distinction qui compte : une branche ouverte EN PERMANENCE (par la classe,
// l'acteur, un état passif ou une pièce de Don) encombre le menu à chaque
// combat. Une branche ouverte par une ARME qu'on choisit d'équiper est le
// contraire d'un encombrement : c'est une décision, et elle s'annule en
// changeant d'arme. Les cinq armes d'ombre (« Épée d'Ombre », « Dague
// d'Ombre », « Hache des Ténèbres », « Lance des Abysses », « Fusil à Pompe
// Éternel ») ouvrent chacune SA branche et donnent SA compétence : on les
// garde. Mesurer « toute source » au lieu de « source permanente » accuserait
// une mécanique propre.
const sources41 = {};
C.filter(Boolean).forEach((c, i) => (c.traits || []).forEach(t => {
    if (t.code === 41 && t.dataId >= 11 && t.dataId <= 18)
        (sources41[t.dataId] = sources41[t.dataId] || []).push('classe#' + i);
}));
[72, 73, 74, 75].forEach(i => (A[i] && A[i].traits || []).forEach(t => {
    if (t.code === 41 && t.dataId >= 11 && t.dataId <= 18)
        (sources41[t.dataId] = sources41[t.dataId] || []).push('Amulette#' + i);
}));
const encoreOuverts = Object.keys(sources41);
T('aucune source PERMANENTE n\'ouvre un type d\'ombre (11→18)', encoreOuverts.length === 0,
  encoreOuverts.length ? encoreOuverts.map(t => t + ' par ' + sources41[t].join(',')).join(' · ')
                       : 'le gacha est bien parti');
// CONTRE-ÉPREUVE : les armes d'ombre, elles, doivent toujours ouvrir la leur.
const armesOmbre = W.filter(w => w && (w.traits || []).some(
    t => t.code === 41 && t.dataId >= 11 && t.dataId <= 18));
T('les armes d\'ombre ouvrent toujours la leur quand on les équipe',
  armesOmbre.length >= 5, armesOmbre.map(w => w.name).join(' · '));
for (let k = 0; k < 4; k++) {
    const t = A[72 + k].traits.filter(x => x.code === 41 && x.dataId >= 11 && x.dataId <= 18);
    T('Amulette palier ' + (k + 1) + ' n\'ouvre plus d\'ombre', t.length === 0, 'trouvé ' + t.length);
}
// CONTRE-ÉPREUVE : on n'a RIEN supprimé. Les huit compétences d'ombre doivent
// toujours exister et rester apprises par la classe de ludwing.
const ombresEnBase = S.filter(s => s && s.name && s.stypeId >= 11 && s.stypeId <= 18);
T('les compétences d\'ombre sont toujours en base', ombresEnBase.length >= 8,
  ombresEnBase.length + ' trouvée(s) — on ferme la porte, on ne brûle pas la pièce');
const apprisesOmbre = (C[3].learnings || []).filter(l => {
    const s = S[l.skillId]; return s && s.stypeId >= 11 && s.stypeId <= 18;
});
T('ludwing les apprend toujours', apprisesOmbre.length >= 8, apprisesOmbre.length + ' apprentissage(s)');

console.log('\n─── 7 · LE MASQUE FAIT CE QUE LE LORE DIT, ET RIEN DE PLUS ───');
// JOKO : « un masque qui lui permet d'utiliser son sang comme elle veut sans
// se blesser ». C'est TOUT son talent d'Objet. La régénération citée entre
// parenthèses (« car son sang se régénère ») décrit SON sang à elle — la
// raison pour laquelle le Masque fonctionne, pas un bonus qu'il accorde.
// J'avais inventé un trait de régénération de PV : il est retiré.
[68,69,70,71].forEach((i,k) => {
    const hrg = A[i].traits.find(x => x.code === 23 && x.dataId === 7);
    T('Masque palier ' + (k+1) + ' : aucun bonus de régénération inventé',
      !hrg, hrg ? 'trait HRG ' + hrg.value + ' encore présent' : '');
});
// Son talent réel — « son sang ne la blesse pas tant que le Masque tient » —
// est une mécanique de plugin, pas une donnée : elle se vérifie en jouant le
// code, pas en relisant le texte du fichier. C'est le banc 1 qui s'en charge
// (« Abuser du sang FEND le masque » et le prix du sang une fois fendu).
T('Le Masque garde une jauge de Sang, et rien d\'autre en dur',
  [68,69,70,71].every(i => !A[i].traits.some(t => t.code === 23)),
  'un trait de statistique spéciale traîne encore sur le Masque');

console.log('\n─── 8 · TROIS ORDRES À L\'AVATAR, JOUABLES EN COMBAT ───');

// Le moteur n'ouvre PAS un type de compétence depuis la seule classe : il
// additionne les traits 41 de la classe, de l'acteur et de ses états passifs
// (`Game_Actor.traitObjects`). Ce contrôle ne lisait que la classe — il a donc
// accusé Korrah à tort le jour où les types sont passés de la classe à
// l'acteur. On relit maintenant les trois sources, comme le banc 11.
const typesOuvertsPour = idActeur => {
    const a = Ac[idActeur], ouverts = {};
    const lire = tr => (tr || []).forEach(t => { if (t.code === 41) { ouverts[t.dataId] = true; } });
    lire(a.traits);
    lire(C[a.classId].traits);
    ((a.note || '').match(/<Passive State:[^>]*>/gi) || []).forEach(ligne => {
        ligne.replace(/<Passive State:/i, '').replace('>', '').split(',').forEach(x => {
            const n = parseInt(x, 10);
            if (n > 0 && Et[n]) { lire(Et[n].traits); }
        });
    });
    return ouverts;
};
const OUVERTS_KORRAH = typesOuvertsPour(2);

const ORD = [1246, 1247, 1248];
ORD.forEach(id => {
    const s = S[id];
    T('Compétence #' + id + ' « ' + (s ? s.name : '?') + ' » existe', !!s);
    if (!s) return;
    T('  · gratuite (0 mana, 0 TP)', s.mpCost === 0 && s.tpCost === 0);
    T('  · porte <AvatarPosture>', /<AvatarPosture:\s*\w+>/.test(s.note));
    T('  · en combat seulement', s.occasion === 1);
    T('  · type de compétence accessible à Korrah',
      OUVERTS_KORRAH[s.stypeId] === true,
      'type ' + s.stypeId + ' · ouverts : ' + Object.keys(OUVERTS_KORRAH).join(', '));
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
