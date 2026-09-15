// ═══════════════════════════════════════════════════════════════════════════
//  9 — L'ÉQUILIBRE, MESURÉ
//
//  Ce banc ne corrige rien et ne propose rien : il MESURE. Il rejoue les
//  vraies formules des vraies compétences apprises, contre les vrais ennemis
//  du bestiaire, à chaque palier de la partie, et il en sort deux chiffres :
//
//    TTK — combien de TOURS DE GROUPE (4 héros qui frappent) pour abattre
//          un ennemi médian du rang conseillé ;
//    TTD — combien de TOURS un héros médian encaisse avant de tomber.
//
//  Le niveau conseillé de chaque rang n'est pas inventé : il vient de
//  `ChasseAuxPrimes.js` (niveauxConseilles) — D:1 · C:12 · B:28 · A:45 · S:60.
//
//  ⚠ On mesure le SYMPTÔME, jamais le motif : les formules sont ÉVALUÉES,
//    pas lues au grep. Une passe écrite en Python avait déjà sauté en silence
//    toutes les formules contenant `b.def` (`def` est un mot-clé Python).
// ═══════════════════════════════════════════════════════════════════════════
const fs = require('fs');
const D = require('path').join(__dirname, '../../data/');
const rd = f => JSON.parse(fs.readFileSync(D + f, 'utf8'));
const S = rd('Skills.json'), C = rd('Classes.json'), E = rd('Enemies.json'), A = rd('Actors.json');

let ko = 0;
const ok = (cond, txt) => { console.log((cond ? '  ✔ ' : '  ✘ ') + txt); if (!cond) ko++; };
const med = a => { const b = a.slice().sort((x, y) => x - y); return b.length ? b[Math.floor(b.length / 2)] : 0; };

// ── Les plafonds du moteur (YEP_CoreEngine, paramètres du projet) ──────────
//  Ils ne sont pas décoratifs : un héros ne PEUT pas dépasser 9999 PV ni 999
//  d'ATQ/DÉF, quoi qu'on écrive dans Classes.json. Toute doctrine d'équilibre
//  se joue sous ce plafond.
const CAP_PV = 9999, CAP_PARAM = 999;

// ── Le bestiaire, par rang. Référence fixe : on n'y touche pas (règle 4). ──
const RANGS = {};
E.forEach(e => {
    if (!e || !e.name) return;
    const m = (e.note || '').match(/<Rang:\s*(\w+)>/);
    if (m) (RANGS[m[1].toUpperCase()] = RANGS[m[1].toUpperCase()] || []).push(e);
});
const BOSS = E.filter(e => e && e.name && /<Boss/i.test(e.note || ''));
function profil(liste) {
    return {
        hp:  med(liste.map(e => e.params[0])),
        mp:  med(liste.map(e => e.params[1])),
        // le moteur écrête aussi les ennemis : un boss à 1038 d'ATQ frappe à 999
        atk: Math.min(CAP_PARAM, med(liste.map(e => e.params[2]))),
        def: Math.min(CAP_PARAM, med(liste.map(e => e.params[3]))),
        mat: Math.min(CAP_PARAM, med(liste.map(e => e.params[4]))),
        mdf: Math.min(CAP_PARAM, med(liste.map(e => e.params[5]))),
        agi: Math.min(CAP_PARAM, med(liste.map(e => e.params[6]))),
        luk: Math.min(CAP_PARAM, med(liste.map(e => e.params[7])))
    };
}
const CIBLE = {};
['D', 'C', 'B', 'A', 'S'].forEach(r => { if (RANGS[r]) CIBLE[r] = profil(RANGS[r]); });
if (BOSS.length) CIBLE.BOSS = profil(BOSS);

// ── LA DIFFICULTÉ — SoulsDifficulty.js multiplie tout, et il est ACTIF ─────
//  Mesurer à « Normal » quand le jeu démarre à « elden » (PV ennemis ×2,2,
//  attaque ×1,6, dégâts subis ×1,6) donne des chiffres qui ne sont ceux de
//  personne. On lit donc les paliers et le palier par défaut dans les vraies
//  sources, pour que le banc reste d'accord avec le plugin si JOKO le règle.
const J = require('path').join(__dirname, '../../js/');
function lireTiers() {
    const src = fs.readFileSync(J + 'plugins/SoulsDifficulty.js', 'utf8');
    const m = src.match(/var\s+TIERS\s*=\s*(\{[\s\S]*?\n\s*\});/);
    return m ? eval('(' + m[1] + ')') : { normal: { name: 'Normal', hp: 1, atk: 1, dmg: 1, heal: 1 } };
}
function lireDefaut() {
    // js/plugins.js déclare « var $plugins = [...] ». On l'évalue tel quel,
    // comme le fait le moteur, et on relit la globale.
    eval(fs.readFileSync(J + 'plugins.js', 'utf8'));
    const liste = (typeof $plugins !== 'undefined') ? $plugins : global.$plugins || [];
    const p = liste.find(x => x.name === 'SoulsDifficulty');
    return { actif: !!(p && p.status), tier: p ? String(p.parameters['defaultTier'] || 'elden') : null };
}
const TIERS = lireTiers(), DEF = lireDefaut();

// ── Un héros à un niveau donné, avec sa vraie courbe de classe ─────────────
const NOMS = { 1: 'Vesper', 2: 'Korrah', 3: 'ludwing', 4: 'Aël' };
function heros(actorId, lv) {
    const p = C[A[actorId].classId].params;
    const cap = i => Math.min(i === 0 ? CAP_PV : i === 1 ? CAP_PV : CAP_PARAM, p[i][Math.min(lv, 99)]);
    const h = { mhp: cap(0), mmp: cap(1), atk: cap(2), def: cap(3),
                mat: cap(4), mdf: cap(5), agi: cap(6), luk: cap(7) };
    h.hp = h.mhp; h.mp = h.mmp; h.level = lv; h.tp = 100;
    return h;
}
// les compétences offensives réellement disponibles à ce niveau
function arsenal(actorId, lv) {
    return C[A[actorId].classId].learnings
        .filter(l => l.level <= lv)
        .map(l => S[l.skillId])
        .filter(s => s && s.damage && (s.damage.type === 1 || s.damage.type === 2));
}
// Les compétences de Lien (Duo, Trio, Escouade) lisent le RESTE du groupe :
// `$gameActors.actor(3).atk`, `$gameParty.aliveMembers()`… Sans ces deux
// globales elles lèvent une exception et un contrôle naïf les accuse à tort.
// Le banc doit attraper le vrai coupable ET innocenter les faux : on monte
// donc le groupe complet au même niveau avant d'évaluer.
function poserLeGroupe(lv) {
    const g = {}; [1, 2, 3, 4].forEach(id => g[id] = heros(id, lv));
    global.$gameActors = { actor: id => g[id] || heros(1, lv) };
    global.$gameParty = { aliveMembers: () => [1, 2, 3, 4].map(id => g[id]),
                          members: () => [1, 2, 3, 4].map(id => g[id]),
                          size: () => 4 };
    // Certaines formules sont « à caractère » et lisent la Santé Mentale de
    // l'Âme (variables 11-14). On les mesure à la jauge de départ posée par
    // JadeEntitePlunging : 7 sur 10. Ce ne sont pas des formules cassées.
    global.$gameVariables = { value: v => (v >= 11 && v <= 14) ? 7 : 0 };
    global.$gameSwitches = { value: () => false };
}
function evalue(f, a, b) {
    try { const v = eval(f); return Number.isFinite(v) ? Math.max(0, v) : NaN; }
    catch (e) { return NaN; }
}

// ── LA MESURE ──────────────────────────────────────────────────────────────
//  niveau ↔ rang : les chiffres de JOKO (ChasseAuxPrimes, niveauxConseilles)
const PALIERS = [[1, 'D'], [12, 'C'], [28, 'B'], [45, 'A'], [60, 'S'], [85, 'BOSS'], [99, 'BOSS']];
// La cible, telle que JOKO l'a arrêtée : « dur mais juste », et il a ajouté
// « faut pas que le jeu soit trop dur ». D'où un TTD de 6 à 9 tours plutôt
// que 5-6, et des boss à 9-14 tours plutôt que 12-18.
const CIBLE_TTK = [2, 3], CIBLE_TTK_BOSS = [9, 14], CIBLE_TTD = [6, 9];

console.log('\n=== LE BESTIAIRE — la référence fixe (règle 4 : on n\'y touche pas) ===');
console.log('  rang         PV     ATQ     DÉF     MAT     MDF');
Object.keys(CIBLE).forEach(r => {
    const c = CIBLE[r];
    console.log('  ' + r.padEnd(7) + String(c.hp).padStart(8) + String(c.atk).padStart(8)
        + String(c.def).padStart(8) + String(c.mat).padStart(8) + String(c.mdf).padStart(8));
});

console.log('\n=== LA DIFFICULTÉ (SoulsDifficulty.js) ===');
console.log('  plugin ' + (DEF.actif ? 'ACTIF' : 'inactif') + ' · palier de départ : « ' + DEF.tier + ' »');
Object.keys(TIERS).forEach(k => {
    const t = TIERS[k];
    console.log('  ' + (k === DEF.tier ? '★ ' : '  ') + t.name.padEnd(11)
        + 'PV ennemis ×' + t.hp + '   attaque ×' + t.atk + '   dégâts subis ×' + t.dmg + '   soin ×' + t.heal);
});

function mesurer(tier) {
const T = TIERS[tier] || { hp: 1, atk: 1, dmg: 1 };
console.log('\n=== LE COMBAT, À CHAQUE PALIER — difficulté « ' + (TIERS[tier] ? TIERS[tier].name : tier) + ' » ===');
console.log('  niv  rang     PV   ATQ   nb  dégâts méd.     TTK      TTD');
const releve = [];
PALIERS.forEach(([lv, rang]) => {
    const c0 = CIBLE[rang];
    if (!c0) return;
    // SoulsDifficulty passe par Game_Enemy.paramBase : PV ×hp, ATQ et MAT ×atk
    const c = Object.assign({}, c0, { hp: Math.round(c0.hp * T.hp),
        atk: Math.min(CAP_PARAM, Math.round(c0.atk * T.atk)),
        mat: Math.min(CAP_PARAM, Math.round(c0.mat * T.atk)) });
    const b = Object.assign({}, c, { level: lv });
    poserLeGroupe(lv);
    const degats = [];
    let pv = 0, def = 0;
    [1, 2, 3, 4].forEach(id => {
        const a = heros(id, lv);
        pv += a.mhp; def += a.def;
        arsenal(id, lv).forEach(s => {
            const v = evalue(s.damage.formula, a, b);
            if (Number.isFinite(v) && v > 0) {
                // un coup = la formule × ses répétitions ; le multi-cible vaut un peu plus
                degats.push(v * (s.repeats || 1) * (s.scope === 2 ? 1.6 : 1));
            }
        });
    });
    pv /= 4; def /= 4;
    const dm = med(degats);
    // TTK : les QUATRE héros frappent dans le même tour
    const ttk = dm > 0 ? c.hp / (4 * dm) : 999;
    // TTD : l'attaque de base du moteur, a.atk * 4 - b.def * 2,
    //       puis le multiplicateur de dégâts subis du palier de difficulté
    const recu = Math.max(1, Math.round(Math.max(1, Math.floor(c.atk * 4 - def * 2)) * T.dmg));
    const ttd = pv / recu;
    releve.push({ lv, rang, pv, dm, ttk, ttd, n: degats.length });
});
releve.forEach(r => {
    const f = x => (x >= 100 ? String(Math.round(x)) : x.toFixed(1));
    console.log('  ' + String(r.lv).padStart(3) + '  ' + r.rang.padEnd(5)
        + String(Math.round(r.pv)).padStart(7)
        + String(r.n).padStart(6)
        + String(Math.round(r.dm)).padStart(13)
        + f(r.ttk).padStart(8) + f(r.ttd).padStart(9));
});

console.log('\n--- verdict — cible « dur mais juste » ---');
console.log('  TTK ' + CIBLE_TTK[0] + '-' + CIBLE_TTK[1] + ' tours de groupe (boss '
    + CIBLE_TTK_BOSS[0] + '-' + CIBLE_TTK_BOSS[1] + ')   ·   TTD ' + CIBLE_TTD[0] + '-' + CIBLE_TTD[1] + ' tours');
releve.forEach(r => {
    const [lo, hi] = r.rang === 'BOSS' ? CIBLE_TTK_BOSS : CIBLE_TTK;
    const kOK = r.ttk >= lo && r.ttk <= hi;
    const dOK = r.ttd >= CIBLE_TTD[0] && r.ttd <= CIBLE_TTD[1];
    const dit = (v, o, lo2, hi2) => o ? 'dans la cible' : (v < lo2 ? 'trop court' : 'trop long');
    console.log('  niv ' + String(r.lv).padStart(2) + ' (' + r.rang + ')  '
        + (kOK ? '✔' : '·') + ' TTK ' + dit(r.ttk, kOK, lo, hi).padEnd(14)
        + (dOK ? '✔' : '·') + ' TTD ' + dit(r.ttd, dOK, CIBLE_TTD[0], CIBLE_TTD[1]));
});
return releve;
}
Object.keys(TIERS).forEach(mesurer);

// ── LES CONTRÔLES DURS ─────────────────────────────────────────────────────
//  Un banc doit attraper le vrai coupable ET innocenter les faux. Ici on ne
//  juge pas l'équilibre (c'est une décision de JOKO), on attrape ce qui est
//  cassé sans discussion possible : une courbe au-dessus du plafond moteur,
//  une formule qui ne s'évalue pas, un héros sans aucune arme chiffrable.
console.log('\n=== CE QUI EST CASSÉ, SANS DISCUSSION ===');
let horsPlafond = [];
[1, 2, 3, 4].forEach(id => {
    const p = C[A[id].classId].params;
    for (let lv = 1; lv <= 99; lv++) {
        if (p[0][lv] > CAP_PV) horsPlafond.push(NOMS[id] + ' PV niv' + lv);
        for (let i = 2; i <= 7; i++) if (p[i][lv] > CAP_PARAM) horsPlafond.push(NOMS[id] + ' param' + i + ' niv' + lv);
    }
});
ok(horsPlafond.length === 0, 'aucune courbe de classe ne dépasse le plafond du moteur'
    + (horsPlafond.length ? ' — ' + horsPlafond.slice(0, 5).join(', ') : ''));

const cassees = [];
poserLeGroupe(45);
[1, 2, 3, 4].forEach(id => {
    const a = heros(id, 45);
    const b = Object.assign({}, CIBLE.A || CIBLE.D, { level: 45 });
    arsenal(id, 45).forEach(s => {
        const v = evalue(s.damage.formula, a, b);
        if (!Number.isFinite(v)) cassees.push('#' + s.id + ' « ' + s.name + ' »');
    });
});
ok(cassees.length === 0, 'toutes les formules apprises s\'évaluent'
    + (cassees.length ? ' — ' + cassees.slice(0, 6).join(', ') : ''));

[1, 2, 3, 4].forEach(id => {
    ok(arsenal(id, 99).length > 0, NOMS[id] + ' a au moins une compétence chiffrable au niveau 99');
});

// Le trou de fin de partie : combien de compétences arrivent après le niveau 60 ?
const tardives = [];
[1, 2, 3, 4].forEach(id => C[A[id].classId].learnings.forEach(l => { if (l.level > 60) tardives.push(l); }));
console.log('  ℹ compétences apprises au-delà du niveau 60 : ' + tardives.length
    + ' (les 39 derniers niveaux n\'apportent ' + (tardives.length ? 'presque ' : '') + 'rien)');

console.log(ko === 0 ? '\n✅ TOUT PASSE\n' : `\n❌ ${ko} échec(s)\n`);
process.exit(ko ? 1 : 0);
