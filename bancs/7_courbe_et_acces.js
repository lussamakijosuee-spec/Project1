// ════════════════════════════════════════════════════════════════════════════
//  BANC D'ESSAI — TOUT LE CONTENU EST-IL ATTEIGNABLE ?
//  Trois défauts que ce banc empêche de revenir :
//    · des types de compétence qu'AUCUNE classe n'ouvre (le joueur apprend
//      une compétence qu'il ne verra jamais dans un menu) ;
//    · des compétences que personne n'apprend et qu'aucun ennemi n'emploie ;
//    · des tranches de niveaux entièrement vides.
// ════════════════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path').join(__dirname, '../');
const rd = f => JSON.parse(fs.readFileSync(path + 'data/' + f, 'utf8'));
const S = rd('Skills.json'), C = rd('Classes.json'), E = rd('Enemies.json'),
      Sy = rd('System.json'), W = rd('Weapons.json'), A = rd('Armors.json'), Ac = rd('Actors.json');

let ko = 0;
const ok = (c, t) => { if (c) console.log('  ✔ ' + t); else { ko++; console.log('  ✘ ' + t); } };
const HEROS = [1, 2, 3, 4];

// Les types qu'un héros peut ouvrir : sa classe, plus l'équipement qu'il
// peut réellement porter (type d'arme / d'armure autorisé, et pas le Don d'un autre).
function typesAccessibles(id) {
    const set = new Set(C[id].traits.filter(t => t.code === 41).map(t => t.dataId));
    const wOK = new Set(C[id].traits.filter(t => t.code === 51).map(t => t.dataId));
    const aOK = new Set(C[id].traits.filter(t => t.code === 52).map(t => t.dataId));
    const proprio = o => { const m = (o.note || '').match(/<DonDe:\s*(\d+)>/); return m ? +m[1] : 0; };
    W.forEach(o => { if (!o || !o.traits) return;
        if (!wOK.has(o.wtypeId)) return;
        const p = proprio(o); if (p && p !== id) return;
        o.traits.forEach(t => { if (t.code === 41) set.add(t.dataId); }); });
    A.forEach(o => { if (!o || !o.traits) return;
        if (!aOK.has(o.atypeId)) return;
        const p = proprio(o); if (p && p !== id) return;
        o.traits.forEach(t => { if (t.code === 41) set.add(t.dataId); }); });
    return set;
}
const ACCES = {}; HEROS.forEach(i => ACCES[i] = typesAccessibles(i));

console.log('\n=== 1 · AUCUNE COMPÉTENCE APPRISE MAIS INVISIBLE ===');
// Le bug le plus sournois du projet : la classe apprend la compétence, mais
// son type n'est ouvert par rien — elle n'apparaît dans aucun menu.
let invisibles = [];
HEROS.forEach(i => {
    C[i].learnings.forEach(l => {
        const s = S[l.skillId];
        if (s && !ACCES[i].has(s.stypeId)) {
            invisibles.push(Ac[i].name + ' #' + l.skillId + ' ' + s.name
                + ' (type ' + s.stypeId + ' « ' + Sy.skillTypes[s.stypeId] + ' »)');
        }
    });
});
ok(invisibles.length === 0, 'les ' + HEROS.reduce((n, i) => n + C[i].learnings.length, 0)
   + ' apprentissages mènent tous à une compétence visible'
   + (invisibles.length ? '\n        → ' + invisibles.slice(0, 8).join('\n        → ') : ''));

console.log('\n=== 2 · CHAQUE TYPE DE COMPÉTENCE A UN PORTEUR ===');
const enJeu = {};
S.forEach(s => { if (s && s.name && s.stypeId > 0) enJeu[s.stypeId] = (enJeu[s.stypeId] || 0) + 1; });
Object.keys(enJeu).map(Number).sort((a, b) => a - b).forEach(t => {
    const qui = HEROS.filter(i => ACCES[i].has(t));
    ok(qui.length > 0, 'type ' + String(t).padStart(2) + ' « '
       + String(Sy.skillTypes[t]).padEnd(22) + ' » (' + String(enJeu[t]).padStart(3)
       + ' compétences) → ' + (qui.length ? qui.map(i => Ac[i].name).join(', ') : 'PERSONNE'));
});

console.log('\n=== 3 · LA COURBE N\'A PLUS DE TROU ===');
const tranches = [[1, 20], [21, 40], [41, 60], [61, 80], [81, 99]];
HEROS.forEach(i => {
    const l = C[i].learnings;
    const cpt = tranches.map(t => l.filter(x => x.level >= t[0] && x.level <= t[1]).length);
    const vides = cpt.filter(n => n === 0).length;
    ok(vides === 0, Ac[i].name.padEnd(9) + ' ' + tranches.map((t, k) =>
        (t[0] + '-' + t[1]) + ':' + String(cpt[k]).padStart(3)).join('  '));
});
// et la fin de partie n'est pas symbolique
HEROS.forEach(i => {
    const n = C[i].learnings.filter(x => x.level >= 61).length;
    ok(n >= 10, Ac[i].name.padEnd(9) + ' a ' + n + ' compétence(s) après le niveau 60');
});

console.log('\n=== 4 · PLUS DE CONTENU ORPHELIN ===');
const app = new Set(); [1, 2, 3, 4, 5].forEach(i => C[i] && C[i].learnings.forEach(l => app.add(l.skillId)));
const enn = new Set(); E.forEach(e => e && (e.actions || []).forEach(a => enn.add(a.skillId)));
const orph = [];
S.forEach((s, i) => {
    if (!s || !s.name || i < 1) return;
    if (app.has(i) || enn.has(i)) return;
    if (/<Avatar>/.test(s.note || '')) return;       // jouées par l'Avatar, jamais apprises
    if (s.stypeId === 0) return;                     // hors de toute liste de compétences
    orph.push('#' + i + ' ' + s.name);
});
ok(orph.length <= 2, 'au plus 2 compétences sans porteur (trouvé ' + orph.length + ')'
   + (orph.length > 2 ? '\n        → ' + orph.slice(0, 10).join(', ') : ''));

// Le héros de référence et sa cible, partagés par les sections 5 et 6.
const P = { atk: 180, mat: 180, mhp: 4000, hp: 4000, mp: 400, level: 35,
            agi: 150, def: 150, mdf: 150, luk: 100, tp: 100 };
const B = { atk: 200, mat: 200, mhp: 12000, hp: 12000, mp: 300, level: 35,
            agi: 100, def: 200, mdf: 200, luk: 80, tp: 0 };

console.log('\n=== 5 · AUCUNE COMPÉTENCE D\'ENNEMI DANS LES MAINS DU JOUEUR ===');
// Une formule assise sur les PV MAX DE LA CIBLE ignore défense, niveau et
// boss : #45 « Assaut Fulgurant » (b.mhp * 0.80) ferait 116 000 sur le boss
// final, pour 0 mana.
// On ne cherche PAS le texte « b.mhp » : il sert aussi de condition
// d'achèvement légitime (« +80 % si la cible est sous 35 % de PV »). On
// mesure le SYMPTÔME — les dégâts suivent-ils les PV max de la cible ?
function suitLesPvMax(s) {
    if (s.damage.type !== 1 && s.damage.type !== 2) return false;
    const f = s.damage.formula || '';
    if (!/\bb\.mhp\b/.test(f)) return false;
    const essai = mhp => {
        const a = P, b = Object.assign({}, B, { mhp: mhp, hp: mhp });
        try { const v = eval(f); return Number.isFinite(v) ? Math.max(0, v) : 0; } catch (e) { return 0; }
    };
    const petit = essai(10000), grand = essai(200000);
    // une vraie formule de dégâts ne change pas quand la cible a 20× plus de PV
    return grand > petit * 3 && grand > 20000;
}
const dangereuses = [];
app.forEach(id => {
    const s = S[id];
    if (s && suitLesPvMax(s)) dangereuses.push('#' + id + ' ' + s.name + ' → ' + s.damage.formula);
});
ok(dangereuses.length === 0, 'aucune compétence apprise ne calibre ses dégâts sur les PV max de la cible'
   + (dangereuses.length ? '\n        → ' + dangereuses.join('\n        → ') : ''));

console.log('\n=== 6 · LE PAYANT DOMINE LE GRATUIT ===');
function force(s) {
    let v = 0;
    try { const a = P, b = B; v = eval(s.damage.formula || '0'); } catch (e) { v = 0; }
    if (!Number.isFinite(v)) v = 0;
    return Math.max(0, v) * (s.scope === 2 || s.scope === 8 ? 1.7 : 1) * (s.repeats || 1);
}
const BASE = new Set([1, 2, 3, 4, 5, 6, 7, 462]);
let pires = [], payantes = [];
app.forEach(id => {
    const s = S[id];
    if (!s || (s.damage.type !== 1 && s.damage.type !== 2)) return;
    const f = force(s);
    if (f <= 0) return;
    const gratuite = (s.mpCost || 0) === 0 && (s.tpCost || 0) === 0 && !/<HP Cost/i.test(s.note || '');
    if (gratuite) { if (!BASE.has(id)) pires.push([f, id, s.name]); }
    else payantes.push(f);
});
pires.sort((a, b) => b[0] - a[0]);
payantes.sort((a, b) => a - b);
const med = payantes[Math.floor(payantes.length / 2)];
const topGratuit = pires.length ? pires[0][0] : 0;
console.log('      payante médiane : ' + Math.round(med)
    + '   ·   meilleure gratuite hors attaque de base : ' + Math.round(topGratuit)
    + (pires.length ? ' (' + pires[0][2] + ')' : ''));
ok(topGratuit <= med, 'aucune compétence gratuite ne dépasse la payante médiane');

console.log(ko === 0 ? '\n✅ TOUT PASSE\n' : `\n❌ ${ko} échec(s)\n`);
process.exit(ko ? 1 : 0);
