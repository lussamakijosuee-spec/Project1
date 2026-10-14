/*
 * INVENTAIRE DES CAPACITÉS — ce que les quatre héros ont vraiment en main.
 *
 * Ce banc ne corrige rien. Il ouvre les tiroirs et écrit ce qu'il y trouve
 * dans docs/INVENTAIRE_CAPACITES.md, pour que JOKO puisse décider sur pièces :
 * ce qui se garde, ce qui se réemploie, ce qui se renomme.
 *
 * Trois choses qu'on ne peut pas voir dans l'éditeur et que ce banc mesure :
 *   1. une compétence dont le TYPE n'est ouvert par AUCUN CHEMIN est apprise
 *      mais INVISIBLE dans tous les menus (piège MV connu du projet). On suit
 *      le chemin entier : la classe, l'acteur, les états passifs, mais aussi
 *      l'équipement portable et les états que le héros sait poser lui-même.
 *      Une branche à condition n'est pas une branche morte — vérifié dans le
 *      moteur : ludwing lance « Arme d'Ombre » et ses 8 branches d'Ombre
 *      s'ouvrent, avec leurs 8 compétences ;
 *   2. une balise <Truc> dans une note ne fait RIEN si aucun plugin ne la lit —
 *      on vérifie donc chaque balise contre le code de js/plugins/ ;
 *   3. une compétence sans dégâts ET sans effet ne fait rien du tout, même
 *      si sa description promet monts et merveilles.
 *
 * Lancement :  node bancs/audit/12_inventaire_capacites.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var D = function (f) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', f), 'utf8')); };

var Actors = D('Actors.json');
var Classes = D('Classes.json');
var Skills = D('Skills.json');
var Items = D('Items.json');
var States = D('States.json');
var System = D('System.json');
var Weapons = D('Weapons.json');
var Armors = D('Armors.json');
var Animations = D('Animations.json');
var Elements = System.elements || [];

/* ── Le code des plugins, en un seul bloc, pour savoir ce qui est lu ── */
var DOSSIER = path.join(RACINE, 'js', 'plugins');
var CODE = fs.readdirSync(DOSSIER).filter(function (f) { return /\.js$/i.test(f); })
    .map(function (f) { return fs.readFileSync(path.join(DOSSIER, f), 'utf8'); }).join('\n');

/* ── Les plugins endormis de _ancien_projet/ : une balise que le jeu actuel
 *    ne lit pas a souvent son lecteur ICI. Ce n'est pas la même chose qu'une
 *    balise que PERSONNE n'a jamais lue — la première se rebranche, la
 *    seconde est une simple étiquette. On ne confond pas les deux. ── */
var DORTS = [];
(function scan(dir) {
    var d;
    try { d = fs.readdirSync(dir, { withFileTypes: true }); } catch (err) { return; }
    d.forEach(function (x) {
        var p = path.join(dir, x.name);
        if (x.isDirectory()) { scan(p); }
        else if (/\.js$/i.test(x.name) && x.name !== 'plugins.js') {
            DORTS.push({ nom: x.name.replace(/\.js$/i, ''), code: fs.readFileSync(p, 'utf8') });
        }
    });
})(path.join(RACINE, '_ancien_projet'));

/** Une balise est « lue » si son nom apparaît dans le code d'un plugin actif. */
var memoBalise = {};
function baliseLue(nom) {
    if (memoBalise[nom] === undefined) {
        var n = nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        memoBalise[nom] = new RegExp(n, 'i').test(CODE);
    }
    return memoBalise[nom];
}

/** Quel plugin endormi lirait cette balise ? (liste, éventuellement vide) */
var memoDort = {};
function quiDort(nom) {
    if (memoDort[nom] === undefined) {
        var r = new RegExp(nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        memoDort[nom] = DORTS.filter(function (p) { return r.test(p.code); })
            .map(function (p) { return p.nom; });
    }
    return memoDort[nom];
}

/** Les balises <Truc> ou <Truc: valeur> d'une note. */
function balises(note) {
    var out = [], r = /<([^<>:\/]+?)(\s*:\s*([^>]*))?>/g, x;
    while ((x = r.exec(note || ''))) {
        var nom = x[1].trim();
        if (!nom || /^\//.test(nom)) { continue; }
        out.push({ nom: nom, valeur: x[3] === undefined ? null : x[3].trim() });
    }
    return out;
}

/** Qui pose cet état ? On cherche l'effet 21 (ajouter un état) dans les
 *  compétences et les objets. Un état que RIEN ne pose ferme sa branche
 *  pour de bon, quel que soit le trait qu'il porte. */
var memoPoseurs = {};
/** Quelles classes apprennent cette compétence. Une compétence que PERSONNE
 *  n'apprend ne pose jamais son état : la branche qu'elle ouvrirait est
 *  fermée, même si le trait est bien là. */
var QUI_APPREND = (function () {
    var m = {};
    Classes.forEach(function (c) {
        if (!c || !c.name) { return; }
        (c.learnings || []).forEach(function (l) { (m[l.skillId] = m[l.skillId] || []).push(c); });
    });
    return m;
})();

function poseursDe(idEtat) {
    if (memoPoseurs[idEtat]) { return memoPoseurs[idEtat]; }
    var r = [];
    [[Skills, 'compétence'], [Items, 'objet']].forEach(function (src) {
        src[0].forEach(function (o) {
            if (!o || !o.name) { return; }
            (o.effects || []).forEach(function (ef) {
                if (ef.code === 21 && ef.dataId === idEtat) { r.push({ genre: src[1], o: o }); }
            });
        });
    });
    return (memoPoseurs[idEtat] = r);
}

/** Les types de compétence accessibles à ce héros, et PAR QUEL CHEMIN.
 *
 *  ⚠ CE CONTRÔLE ACCUSAIT. Il ne lisait que la classe, l'acteur et les états
 *  passifs, et marquait « INVISIBLE » tout le reste. Les 8 branches d'Ombre de
 *  ludwing étaient dans ce cas : elles s'ouvrent quand il lance « Arme
 *  d'Ombre », qu'il apprend au niveau 1. Elles marchent. Un trait 41 posé par
 *  un ÉTAT ou par un ÉQUIPEMENT n'est pas une branche morte — c'est une
 *  branche à condition, et la condition doit être nommée, pas ignorée.
 *
 *  Mais une condition hors d'atteinte referme la branche pour de bon : un état
 *  que rien ne pose, une arme que la classe ne peut pas porter. On mesure donc
 *  le chemin entier, jusqu'au bout.
 *
 *  ⚠ $dataActors.meta ne garde que la DERNIÈRE ligne <Passive State:>,
 *  alors que YEP_AutoPassiveStates les lit toutes : on relit à la main. */
function typesOuverts(a) {
    var ouverts = {}, conditions = {}, passifs = [];
    var cl = Classes[a.classId];
    function lire(tr) { (tr || []).forEach(function (t) { if (t.code === 41) { ouverts[t.dataId] = true; } }); }
    lire(a.traits);
    lire(cl.traits);
    ((a.note || '').match(/<Passive State:[^>]*>/gi) || []).forEach(function (ligne) {
        ligne.replace(/<Passive State:/i, '').replace('>', '').split(',').forEach(function (x) {
            var n = parseInt(x, 10);
            if (n > 0 && passifs.indexOf(n) < 0) { passifs.push(n); }
        });
    });
    passifs.forEach(function (id) { if (States[id]) { lire(States[id].traits); } });

    // Ce que le héros peut porter (traits 51 « type d'arme » / 52 « type d'armure »).
    var wOK = {}, aOK = {};
    [a.traits, cl.traits].forEach(function (tr) {
        (tr || []).forEach(function (t) {
            if (t.code === 51) { wOK[t.dataId] = true; }
            if (t.code === 52) { aOK[t.dataId] = true; }
        });
    });
    // Les compétences que sa propre classe lui apprend : de quoi poser un état.
    var sait = {};
    (cl.learnings || []).forEach(function (l) { sait[l.skillId] = true; });
    // …et celles que l'acteur ou sa classe ajoutent par un trait 43 « Ajouter une
    // compétence ». Sans ça, le Berserker et l'État de Flow de Vesper (2026-10-14)
    // passaient pour « qu'aucune classe n'apprend » — et leurs branches pour mortes.
    [a.traits, cl.traits].forEach(function (tr) { (tr || []).forEach(function (t) { if (t.code === 43) { sait[t.dataId] = true; } }); });

    function noter(t, texte) { (conditions[t] = conditions[t] || []).push(texte); }
    [[Weapons, 'arme'], [Armors, 'armure'], [States, 'état']].forEach(function (src) {
        src[0].forEach(function (o) {
            if (!o || !o.name) { return; }
            (o.traits || []).forEach(function (t) {
                if (t.code !== 41 || ouverts[t.dataId]) { return; }
                var nom = '« ' + o.name.trim() + ' »';
                if (src[1] === 'état') {
                    var p = poseursDe(o.id);
                    var sien = p.filter(function (x) { return x.genre === 'compétence' && sait[x.o.id]; });
                    // Un objet s'obtient ; une compétence, il faut que QUELQU'UN l'apprenne.
                    var autre = p.filter(function (x) {
                        return x.genre === 'objet' || (QUI_APPREND[x.o.id] || []).length;
                    });
                    if (sien.length) {
                        noter(t.dataId, 'en lançant « ' + sien[0].o.name.trim() + ' » → état ' + nom);
                    } else if (autre.length) {
                        var q = autre[0];
                        noter(t.dataId, 'sous l\'état ' + nom + ', posé par ' + q.genre + ' « ' + q.o.name.trim() + ' »' +
                            (q.genre === 'compétence' ? ' — que ' + QUI_APPREND[q.o.id][0].name + ' apprend, pas lui' : ''));
                    } else if (p.length) {
                        noter(t.dataId, '✗ état ' + nom + ' — posé seulement par « ' + p[0].o.name.trim() +
                            ' », qu\'aucune classe n\'apprend');
                    } else {
                        noter(t.dataId, '✗ état ' + nom + ' — que rien ne pose');
                    }
                } else {
                    var portable = src[1] === 'arme' ? wOK[o.wtypeId] : aOK[o.atypeId];
                    noter(t.dataId, (portable ? 'en équipant ' : '✗ ') + src[1] + ' ' + nom +
                        (portable ? '' : ' — que sa classe ne peut pas porter'));
                }
            });
        });
    });
    return { ouverts: ouverts, conditions: conditions, passifs: passifs };
}

/** L'état d'une branche pour ce héros : 'ouvert', 'condition' ou 'ferme'. */
function etatBranche(info, t) {
    if (info.ouverts[t]) { return { rang: 'ouvert', texte: 'ouvert', marque: '✔' }; }
    var voies = (info.conditions[t] || []).filter(function (x) { return x.charAt(0) !== '✗'; });
    if (voies.length) { return { rang: 'condition', texte: 'à condition : ' + voies[0], marque: '◑' }; }
    var mortes = info.conditions[t] || [];
    return {
        rang: 'ferme', marque: '✘',
        texte: mortes.length
            ? '**INVISIBLE** — ' + mortes[0].replace(/^✗ /, 'seul chemin : ') + ', hors d\'atteinte'
            : '**INVISIBLE** — aucun trait n\'ouvre ce type'
    };
}

/** Ce qu'une compétence fait RÉELLEMENT, en dehors de sa description. */
function effetsLisibles(s) {
    var out = [];
    (s.effects || []).forEach(function (e) {
        switch (e.code) {
            case 11: out.push('PV ' + (e.value1 * 100).toFixed(0) + '% ' + (e.value2 >= 0 ? '+' : '') + e.value2); break;
            case 12: out.push('PM ' + (e.value1 * 100).toFixed(0) + '% ' + (e.value2 >= 0 ? '+' : '') + e.value2); break;
            case 13: out.push('PT +' + e.value1); break;
            case 21: out.push('pose « ' + nomEtat(e.dataId) + ' » ' + Math.round(e.value1 * 100) + '%'); break;
            case 22: out.push('retire « ' + nomEtat(e.dataId) + ' » ' + Math.round(e.value1 * 100) + '%'); break;
            case 31: out.push('boost ' + param(e.dataId) + ' ' + e.value1 + 't'); break;
            case 32: out.push('malus ' + param(e.dataId) + ' ' + e.value1 + 't'); break;
            case 33: out.push('purge boost ' + param(e.dataId)); break;
            case 34: out.push('purge malus ' + param(e.dataId)); break;
            case 41: out.push('fuite spéciale'); break;
            case 42: out.push('grandit ' + param(e.dataId) + ' +' + e.value1); break;
            case 43: out.push('apprend « ' + (Skills[e.dataId] ? Skills[e.dataId].name : e.dataId) + ' »'); break;
            case 44: out.push('script commun ' + e.dataId); break;
            default: out.push('effet ' + e.code);
        }
    });
    return out;
}
function nomEtat(id) { return States[id] && States[id].name ? States[id].name.trim() || ('état ' + id) : ('état ' + id + ' ABSENT'); }
function param(i) { return ['PVmax', 'PMmax', 'ATQ', 'DÉF', 'MAT', 'MDF', 'AGI', 'CHA'][i] || ('p' + i); }

/** L'équipement qui porte une balise de Don, pour le relier à son héros. */
function equipementsDe(nom) {
    var out = [];
    [[Weapons, 'arme'], [Armors, 'armure']].forEach(function (paire) {
        paire[0].forEach(function (o) {
            if (!o || !o.name || !o.name.trim()) { return; }
            var n = (o.note || '');
            if (new RegExp(nom, 'i').test(n) || new RegExp(nom, 'i').test(o.name)) {
                out.push({ genre: paire[1], id: o.id, nom: o.name, etype: o.etypeId, note: n });
            }
        });
    });
    return out;
}

/* ─────────────────────────────────────────────────────────────── */

var HEROS = [
    { id: 1, don: 'le Masque', forme: 'objet', slot: 'Accessoire (5)', trait: 'sang' },
    { id: 2, don: "l'Armure Volante", forme: 'avatar spirituel', slot: 'Âme (7)', trait: 'change + hiver' },
    { id: 3, don: "l'Amulette", forme: 'objet', slot: 'Accessoire (5)', trait: 'ames' },
    { id: 4, don: "l'Arc", forme: 'arme', slot: 'Arme (1)', trait: 'miracle' }
];

var L = [];
var e = function (s) { L.push(s === undefined ? '' : s); };
var aujourdhui = new Date().toISOString().slice(0, 10);

e('# Inventaire des capacités');
e();
e('Relevé du ' + aujourdhui + '. **Rien n\'a été modifié** : ce fichier dit ce qui EST.');
e('Il se régénère avec `node bancs/audit/12_inventaire_capacites.js`.');
e();
e('Trois colonnes de vérité, que l\'éditeur ne montre pas :');
e();
e('| Marque | Ce que ça veut dire |');
e('|---|---|');
e('| ✔ **ouvert** | la classe, l\'acteur ou un état passif ouvre le type : la compétence se voit toujours |');
e('| ◑ **à condition** | le type s\'ouvre sous un état que le héros sait poser, ou sous un équipement qu\'il peut porter. La branche marche — la colonne « État » dit par où |');
e('| ✘ **INVISIBLE** | aucun chemin : soit rien n\'ouvre le type, soit le seul ouvreur est hors d\'atteinte (état que rien ne pose, arme que la classe ne porte pas) |');
e('| **encre morte** | la note porte une balise qu\'aucun plugin de `js/plugins/` ne lit — elle ne fait rien |');
e('| **coquille** | ni dégâts ni effet : la compétence s\'exécute et il ne se passe rien |');
e();

/* ── ① Les quatre héros ── */
var balisesMortes = {};
var totaux = { skills: 0, invisibles: 0, conditions: 0, coquilles: 0 };

HEROS.forEach(function (h) {
    var a = Actors[h.id];
    var c = Classes[a.classId];
    var info = typesOuverts(a);

    e('---');
    e();
    e('## ' + a.name + ' — ' + c.name);
    e();
    e('| | |');
    e('|---|---|');
    e('| Classe | ' + a.classId + ' · ' + c.name + ' |');
    e('| Son unique Don | **' + h.don + '** *(' + h.forme + ')* → emplacement ' + h.slot + ' |');
    e('| Trait | ' + h.trait + ' |');
    e('| Note de l\'acteur | `' + (a.note || '').replace(/\n/g, ' · ') + '` |');
    e();

    /* les types */
    var parType = {}, vus = {};
    (c.learnings || []).forEach(function (l) {
        var s = Skills[l.skillId];
        if (!s || !s.name || !s.name.trim()) { return; }
        var cle = l.skillId + '@' + l.level;
        if (vus[cle]) { return; }
        vus[cle] = 1;
        (parType[s.stypeId] = parType[s.stypeId] || []).push({ s: s, nv: l.level });
    });

    e('### Ses branches');
    e();
    e('| | Type | Compétences | État |');
    e('|---|---|---|---|');
    var invisiblesIci = 0, sousConditionIci = 0;
    Object.keys(parType).map(Number).sort(function (x, y) { return x - y; }).forEach(function (t) {
        var et = etatBranche(info, t);
        if (et.rang === 'ferme') { invisiblesIci += parType[t].length; }
        if (et.rang === 'condition') { sousConditionIci += parType[t].length; }
        e('| ' + et.marque + ' | ' + t + ' · ' + (System.skillTypes[t] || '?').trim() +
            ' | ' + parType[t].length + ' | ' + et.texte + ' |');
    });
    e();
    if (sousConditionIci) {
        e('> **' + sousConditionIci + ' compétences de ' + a.name + ' attendent leur condition.** ' +
          'Elles ne sont pas mortes : la branche s\'ouvre dès que la condition est remplie, ' +
          'et la colonne « État » dit laquelle.');
        e();
    }
    if (invisiblesIci) {
        e('> **' + invisiblesIci + ' compétences de ' + a.name + ' ne sont accessibles nulle part.** ' +
          'Elles s\'apprennent, et rien — ni classe, ni état posable, ni équipement portable — ' +
          'n\'ouvre leur type.');
        e();
    }

    /* le détail, branche par branche */
    Object.keys(parType).map(Number).sort(function (x, y) { return x - y; }).forEach(function (t) {
        var et = etatBranche(info, t);
        var ouvert = et.rang !== 'ferme';
        e('### ' + (et.rang === 'ouvert' ? '' : et.marque + ' ') + 'Type ' + t + ' — ' +
            (System.skillTypes[t] || '?').trim() +
            (et.rang === 'ouvert' ? '' : et.rang === 'condition' ? '  *(à condition)*' : '  *(INVISIBLE)*'));
        e();
        if (et.rang !== 'ouvert') { e('*' + et.texte.replace(/\*\*/g, '') + '*'); e(); }
        e('| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |');
        e('|---|---|---|---|---|---|---|');
        parType[t].sort(function (x, y) { return x.nv - y.nv || x.s.id - y.s.id; }).forEach(function (n) {
            var s = n.s;
            totaux.skills++;
            if (!ouvert) { totaux.invisibles++; }
            if (et.rang === 'condition') { totaux.conditions++; }

            var cout = [];
            if (s.mpCost) { cout.push(s.mpCost + ' PM'); }
            if (s.tpCost) { cout.push(s.tpCost + ' PT'); }
            var hp = (s.note || '').match(/<HP Cost:\s*([^>]+)>/i);
            if (hp) { cout.push(hp[1].trim() + ' PV'); }

            var fait = [];
            if (s.damage && s.damage.type > 0 && String(s.damage.formula).trim() !== '0') {
                var genre = ['', 'dégâts PV', 'dégâts PM', 'soin PV', 'soin PM', 'drain PV', 'drain PM'][s.damage.type] || ('dmg' + s.damage.type);
                var el = s.damage.elementId > 0 ? (Elements[s.damage.elementId] || ('él' + s.damage.elementId)) : '';
                fait.push(genre + (el ? ' *' + el + '*' : '') + ' `' + String(s.damage.formula).replace(/\|/g, '\\|') + '`');
            }
            effetsLisibles(s).forEach(function (x) { fait.push(x); });
            var coquille = fait.length === 0;
            if (coquille) { totaux.coquilles++; fait.push('**coquille** — rien'); }

            var anim = s.animationId;
            var animTxt = anim === -1 ? 'arme' : (anim === 0 ? '—' : String(anim) + (Animations[anim] ? '' : ' **VIDE**'));

            var bal = balises(s.note).map(function (b) {
                if (/^(HP Cost|Passive State|setup action|target action|finish action|whole action|follow action)$/i.test(b.nom)) { return null; }
                var lue = baliseLue(b.nom);
                if (!lue) {
                    (balisesMortes[b.nom] = balisesMortes[b.nom] || []).push(a.name + ' #' + s.id + ' ' + s.name);
                }
                return '`<' + b.nom + (b.valeur !== null ? ': ' + b.valeur : '') + '>`' + (lue ? '' : ' ⚠');
            }).filter(Boolean).join(' ');

            e('| ' + n.nv + ' | ' + s.id + ' | ' + s.name.trim().replace(/\|/g, '\\|') +
                ' | ' + (cout.join(' + ') || '—') +
                ' | ' + fait.join(' · ').replace(/\n/g, ' ') +
                ' | ' + animTxt +
                ' | ' + (bal || '—') + ' |');
        });
        e();
    });

    /* ses états passifs */
    e('### Ses états passifs');
    e();
    if (!info.passifs.length) { e('Aucun.'); e(); }
    else {
        e('| # | État | Traits | Ouvre |');
        e('|---|---|---|---|');
        info.passifs.forEach(function (sid) {
            var st = States[sid];
            if (!st || !st.name || !st.name.trim()) { e('| ' + sid + ' | **N\'EXISTE PAS** | — | — |'); return; }
            var ouvre = (st.traits || []).filter(function (x) { return x.code === 41; })
                .map(function (x) { return (System.skillTypes[x.dataId] || x.dataId).toString().trim(); });
            e('| ' + sid + ' | ' + st.name.trim() + ' | ' + (st.traits || []).length +
                ((st.traits || []).length ? '' : ' **aucun : il ne fait rien**') +
                ' | ' + (ouvre.join(', ') || '—') + ' |');
        });
        e();
    }

    /* son Don, tel qu'il est posé dans l'équipement */
    var pieces = equipementsDe(h.don.replace(/^l'|^le |^la /i, ''));
    e('### Son Don dans l\'équipement');
    e();
    if (!pieces.length) { e('Rien trouvé au nom de « ' + h.don +' ».'); e(); }
    else {
        e('| Genre | # | Nom | etypeId | Note |');
        e('|---|---|---|---|---|');
        pieces.slice(0, 12).forEach(function (p) {
            e('| ' + p.genre + ' | ' + p.id + ' | ' + p.nom + ' | ' + p.etype + ' | `' + (p.note || '').replace(/\n/g, ' · ').slice(0, 120) + '` |');
        });
        if (pieces.length > 12) { e(); e('*… et ' + (pieces.length - 12) + ' autres pièces portant ce nom.*'); }
        e();
    }
});

/* ── ② L'encre morte ── */
e('---');
e();
e('## L\'encre morte — les balises que personne ne lit');
e();
e('Ces balises sont écrites dans les notes des compétences des quatre héros, et **aucun**');
e('fichier de `js/plugins/` n\'en cherche le nom. Elles ne produisent aucun effet aujourd\'hui.');
e();
e('La colonne de droite fait la différence entre deux cas qu\'il ne faut pas confondre :');
e();
e('- **dort dans `X.js`** — le lecteur existe, il est resté dans `_ancien_projet/`. La');
e('  mécanique a été écrite ; elle a été perdue lors du commit « projet vierge ». Elle se');
e('  rebranche en remontant le fichier ;');
e('- **étiquette** — aucun plugin, ni actif ni endormi, ne lit ce nom. Ce n\'est pas un');
e('  défaut : c\'est une note de travail posée dans le fichier (un nom d\'origine gardé');
e('  après un renommage, par exemple). On n\'y touche pas.');
e();
var mortes = Object.keys(balisesMortes).sort(function (x, y) { return balisesMortes[y].length - balisesMortes[x].length; });
if (!mortes.length) { e('Aucune. Tout ce qui est écrit est lu.'); e(); }
else {
    e('| Balise | Compétences | Son lecteur | Exemples |');
    e('|---|---|---|---|');
    mortes.forEach(function (n) {
        var l = balisesMortes[n];
        var d = quiDort(n);
        e('| `<' + n + '>` | ' + l.length +
            ' | ' + (d.length ? 'dort dans `' + d.slice(0, 3).join('`, `') + '`' + (d.length > 3 ? ' …' : '') : '**étiquette** — jamais lue nulle part') +
            ' | ' + l.slice(0, 2).join(' · ') + (l.length > 2 ? ' …' : '') + ' |');
    });
    e();
}

/* ── ③ Les jauges et leurs états ── */
e('---');
e();
e('## Les jauges d\'esprit et ce qu\'elles posent');
e();
e('| Variable | Nom | Héros |');
e('|---|---|---|');
[[11, 'Vesper'], [12, 'Korrah'], [13, 'ludwing'], [14, 'Aël'], [15, '— compteur d\'âmes —']].forEach(function (p) {
    e('| ' + p[0] + ' | ' + (System.variables[p[0]] || '(sans nom)') + ' | ' + p[1] + ' |');
});
e();
e('Les états pilotés par ces jauges, avec leur condition réelle :');
e();
e('| # | État | Traits | Condition |');
e('|---|---|---|---|');
States.forEach(function (st) {
    if (!st || !st.name || !st.name.trim()) { return; }
    var m = (st.note || '').match(/condition\s*=\s*(.+)/);
    if (!m || !/\$gameVariables\.value\((1[1-5])\)/.test(m[1])) { return; }
    e('| ' + st.id + ' | ' + st.name.trim() + ' | ' + (st.traits || []).length +
        ((st.traits || []).length ? '' : ' **aucun**') +
        ' | `' + m[1].trim().replace(/\|/g, '\\|').slice(0, 110) + '` |');
});
e();

/* ── ④ Le total ── */
e('---');
e();
e('## Le compte');
e();
e('- **' + totaux.skills + '** entrées d\'apprentissage sur les quatre héros ;');
e('- **' + totaux.invisibles + '** sont invisibles en jeu : aucun chemin n\'ouvre leur type ;');
e('- **' + totaux.conditions + '** s\'ouvrent sous condition — elles marchent, la colonne « État » dit par où ;');
e('- **' + totaux.coquilles + '** ne font rien du tout (ni dégâts, ni effet) ;');
var rebranchables = mortes.filter(function (n) { return quiDort(n).length > 0; });
e('- **' + mortes.length + '** balises différentes sont écrites sans qu\'aucun plugin actif ne les lise,');
e('  dont **' + rebranchables.length + '** dont le lecteur dort dans `_ancien_projet/` (et ' +
    (mortes.length - rebranchables.length) + ' simple(s) étiquette(s)).');
e();

var sortie = path.join(RACINE, 'docs', 'INVENTAIRE_CAPACITES.md');
fs.writeFileSync(sortie, L.join('\n'), 'utf8');
console.log('Écrit : docs/INVENTAIRE_CAPACITES.md   (' + L.length + ' lignes)');
console.log('  ' + totaux.skills + ' apprentissages · ' + totaux.invisibles + ' invisibles · ' +
    totaux.conditions + ' à condition · ' +
    totaux.coquilles + ' coquilles · ' + mortes.length + ' balises mortes');
