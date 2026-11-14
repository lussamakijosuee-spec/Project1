/*
 * LE SYSTÈME — états, objets, armes et armures (bancs/outils/le_systeme.js)
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-12 : « Oui tout mais reste cohérent au lore aussi ».
 *
 *   ① tout état qui AGIT (il a des traits ou il immobilise) a une icône — sauf
 *      les marqueurs des plugins, exprès sans icône et sans effet ;
 *      aucun état posé par une compétence de héros ne reste après le combat ;
 *   ② le tableau des pièces sans source existe, et ses comptes sont justes ;
 *   ③ toute arme et armure a un prix (sauf les mains nues et les pièces de
 *      l'Âme) ; les prix déjà posés par JOKO n'ont pas bougé ;
 *   ④ toute arme et armure a une description, et ce qu'elle dit est VRAI :
 *      l'élément nommé est celui de ses traits, une stat citée a le bon signe ;
 *   ⑥ plus deux états du même nom (le 👑 du Royaume Impérial les distingue) ;
 *   et les contre-épreuves : chaque contrôle attrape le défaut planté exprès.
 *
 *   node bancs/26_le_systeme.js
 */
'use strict';
var fs = require('fs'), path = require('path'), cp = require('child_process');
var R = path.join(__dirname, '..');
function lire(n, dossier) { return JSON.parse(fs.readFileSync(path.join(dossier || path.join(R, 'data'), n + '.json'), 'utf8')); }
var St = lire('States'), We = lire('Weapons'), Ar = lire('Armors'), Sk = lire('Skills'), Sy = lire('System'), Cl = lire('Classes');
var ok = 0, ko = 0;
function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
console.log('═'.repeat(70)); console.log('  LE SYSTÈME — états, objets, armes, armures'); console.log('═'.repeat(70));

// ── les règles, écrites une fois, jouées sur la vraie base puis sur une base sabotée
function marqueur(s) { return !s.traits.length && s.restriction === 0; }                       // sans effet : un marqueur de plugin
function etatsSansIcone(L) { return L.filter(function (s) { return s && s.name && !s.iconIndex && !marqueur(s) && s.id > 1; }).map(function (s) { return s.id + ' ' + s.name.trim(); }); }
function poseParHeros(L, Skills) {
    var appris = {};
    Cl.forEach(function (c) { if (c) (c.learnings || []).forEach(function (l) { appris[l.skillId] = 1; }); });
    var out = [];
    Skills.forEach(function (s) {
        if (!s || !appris[s.id]) return;
        (s.effects || []).forEach(function (e) {
            var st = L[e.dataId];
            if (e.code === 21 && st && e.dataId > 1 && st.autoRemovalTiming === 0 && !st.removeAtBattleEnd && !st.removeByDamage && !st.removeByWalking && !st.removeByRestriction && out.indexOf(e.dataId + ' ' + st.name) < 0) out.push(e.dataId + ' ' + st.name);
        });
    });
    return out;
}
function ame(o) { return o.etypeId === 7 || !Sy.equipTypes[o.etypeId]; }
function sansPrix(L, armure) { return L.filter(function (o) { return o && o.name && !o.price && !/mains nues/i.test(o.name) && !(armure && ame(o)); }).map(function (o) { return o.id + ' ' + o.name; }); }
function sansDesc(L) { return L.filter(function (o) { return o && o.name && !String(o.description || '').trim(); }).map(function (o) { return o.id + ' ' + o.name; }); }
function el(i) { var n = String(Sy.elements[i] || '').trim(); return n ? n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : ''; }
// une description écrite par l'outil (« Hache : … ») doit dire vrai
function mensonges(L) {
    var out = [];
    L.forEach(function (o) {
        if (!o || !o.name) return;
        var d = String(o.description || '');
        if (!/^[A-ZÀ-Ý][^:]*(: |, sans propriété particulière\.)/.test(d) || /palier|Relique|«/.test(d.slice(0, 12))) return;   // pas une description de l'outil
        var m = d.match(/frappe en ([A-Za-zÀ-ÿ]+)/g) || [];
        m.forEach(function (f) {
            var nom = f.replace('frappe en ', '');
            var vrai = (o.traits || []).some(function (t) { return t.code === 31 && el(t.dataId) === nom; });
            if (!vrai) out.push(o.id + ' ' + o.name + ' dit « ' + f + ' »');
        });
        var noms = ['PV max', 'PM max', 'ATQ', 'DÉF', 'ATQ M.', 'DÉF M.', 'AGI', 'CHA'];
        noms.forEach(function (n, i) {
            var r = new RegExp('(^|[ :·])' + n.replace('.', '\\.') + ' ([+−])(\\d+)');
            var x = d.match(r);
            if (x && ((x[2] === '+' ? 1 : -1) * Number(x[3])) !== o.params[i]) out.push(o.id + ' ' + o.name + ' dit « ' + n + ' ' + x[2] + x[3] + ' », la fiche ' + o.params[i]);
        });
        if (/undefined|NaN|null/.test(d)) out.push(o.id + ' ' + o.name + ' : « ' + d + ' »');
    });
    return out;
}
function doubles(L) { var v = {}; L.forEach(function (s) { if (s && s.name) { var k = s.name.trim().toLowerCase(); (v[k] = v[k] || []).push(s.id); } }); return Object.keys(v).filter(function (k) { return v[k].length > 1; }).map(function (k) { return k + ' ' + v[k].join('/'); }); }

console.log('\n① Les états');
var a = etatsSansIcone(St);
V('tout état qui agit a une icône (les marqueurs des plugins, sans effet, restent invisibles)', !a.length, a.slice(0, 6).join(' · ') || St.filter(function (s) { return s && s.name && !s.iconIndex; }).length + ' marqueurs sans icône');
var b = poseParHeros(St, Sk);
V('aucun état posé par une compétence de héros ne reste après le combat', !b.length, b.join(' · ') || 'Domaine Déployé finit avec le combat');
console.log('\n⑥ Les noms');
var d = doubles(St);
V('plus deux états du même nom', !d.length, d.join(' · ') || 'Normal · Korrah / Vesper / ludwing, Provocation · garde baissée, Euphorie · vitesse');
console.log('\n③ Les prix');
var p1 = sansPrix(We, false), p2 = sansPrix(Ar, true);
V('toute arme et armure a un prix (sauf les mains nues et les pièces de l\'Âme)', !p1.length && !p2.length, (p1.concat(p2)).slice(0, 5).join(' · '));
// les prix de JOKO n'ont pas bougé : ceux qui étaient posés dans le dernier commit d'avant l'outil
var avant = null;
try { avant = { We: JSON.parse(cp.execSync('git show 28d8cb8ea:data/Weapons.json', { cwd: R, maxBuffer: 1 << 26 }).toString()), Ar: JSON.parse(cp.execSync('git show 28d8cb8ea:data/Armors.json', { cwd: R, maxBuffer: 1 << 26 }).toString()) }; } catch (e) { /* sans git */ }
if (avant) {
    var bouges = [];
    [['We', We], ['Ar', Ar]].forEach(function (x) { avant[x[0]].forEach(function (o, i) { if (o && o.price && x[1][i] && x[1][i].price !== o.price) bouges.push(x[0] + i + ' ' + o.price + '→' + x[1][i].price); }); });
    V('les prix déjà posés n\'ont pas bougé', !bouges.length, bouges.slice(0, 5).join(' · ') || 'comparé au commit 28d8cb8ea');
} else { console.log('   · (pas de git : la comparaison des prix est sautée)'); }
console.log('\n④ Les descriptions');
var s1 = sansDesc(We), s2 = sansDesc(Ar);
V('toute arme et armure a une description', !s1.length && !s2.length, s1.concat(s2).slice(0, 5).join(' · '));
var mt = mensonges(We).concat(mensonges(Ar));
V('ce que les descriptions disent est vrai (l\'élément, les statistiques)', !mt.length, mt.slice(0, 4).join(' · ') || 'élément et statistiques relus sur chaque fiche');
console.log('\n② Le tableau des pièces sans source');
var doc = path.join(R, 'docs', 'EQUIPEMENT_SANS_SOURCE.md');
var t = fs.existsSync(doc) ? fs.readFileSync(doc, 'utf8') : '';
var lignesArmes = ((t.split('## Armes')[1] || '').split('## Armures')[0]).split('\n').filter(function (l) { return /^\| [DCBAS] \| \d+/.test(l); }).length;
var annonce = Number(((t.match(/\| Armes \| (\d+) \//) || [])[1]) || -1);
V('le tableau existe et chaque arme annoncée a sa ligne', t.length > 0 && lignesArmes === annonce && annonce > 0, annonce + ' armes annoncées, ' + lignesArmes + ' lignes');

console.log('\n── Les contre-épreuves (on sabote une copie, chaque contrôle doit crier)');
var c = JSON.parse(JSON.stringify(St)), cw = JSON.parse(JSON.stringify(We)), cs = JSON.parse(JSON.stringify(Sk));
c[102].iconIndex = 0;                                                          // une résistance perd son icône
var hs = cs.filter(function (s) { return s && Cl.some(function (k) { return k && (k.learnings || []).some(function (l) { return l.skillId === s.id; }); }); })[0];
hs.effects.push({ code: 21, dataId: 20, value1: 1, value2: 0 });             // un héros pose « Vitesse Divine », qui n'a pas de fin
c[63].name = 'normal'; c[64].name = 'normal';                                 // un double revient
var w = cw.filter(function (o) { return o && o.name && o.price && !/mains nues/i.test(o.name); })[0]; w.price = 0;
var w2 = cw.filter(function (o) { return o && o.name && /^Hache : /.test(o.description || ''); })[0];
var w3 = cw.filter(function (o) { return o && o.name && /frappe en /.test(o.description || ''); })[0];
if (w2) { w2.description = w2.description.replace(/AGI −(\d+)/, 'AGI +$1'); }
var faux = w3 || cw.filter(function (o) { return o && o.name && /, sans propriété particulière\./.test(o.description || ''); })[0];
faux.description = (faux.description.split(/[:,]/)[0]) + ' : frappe en Lumière.';
faux.traits = (faux.traits || []).filter(function (t) { return t.code !== 31 || el(t.dataId) !== 'Lumière'; });
V('une icône retirée est attrapée', etatsSansIcone(c).some(function (x) { return /^102 /.test(x); }));
V('un état sans fin posé par un héros est attrapé', poseParHeros(c, cs).some(function (x) { return /^20 /.test(x); }), 'compétence ' + hs.id);
V('un nom en double est attrapé', doubles(c).length > 0, doubles(c).join(' · '));
V('un prix remis à 0 est attrapé', sansPrix(cw, false).length > 0, w.id + ' ' + w.name);
var mt2 = mensonges(cw);
V('une description qui ment sur l\'élément est attrapée', mt2.some(function (x) { return x.indexOf(String(faux.id) + ' ') === 0 && /Lumière/.test(x); }), faux.id + ' ' + faux.name);
if (w2) V('une description qui ment sur une statistique est attrapée', mt2.some(function (x) { return x.indexOf(String(w2.id) + ' ') === 0 && /AGI/.test(x); }), w2.id + ' ' + w2.name);
console.log('\n' + (ko ? '❌ ' + ko + ' ÉCHEC(S) — ' : '✅ TOUT PASSE — ') + ok + ' contrôles passés');
process.exit(ko ? 1 : 0);
