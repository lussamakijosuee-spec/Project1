/*
 * AUDIT — LE CODE DES ÉVÉNEMENTS
 * ---------------------------------------------------------------------------
 * « Les événements, c'est pas un problème d'équilibrage, mais un problème de
 * code. J'ai beaucoup de codes qui bug, qui n'ont aucun sens ou qui ne sont
 * plus dans les mécaniques. »  — JOKO
 *
 * Cet audit ne corrige rien : il RELÈVE. Chaque famille de défaut est une
 * panne qui ne lève aucune erreur dans MV — le jeu continue, et quelque chose
 * ne se passe simplement jamais.
 *
 *   node bancs/audit/10_code_des_evenements.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
function lire(f) { return JSON.parse(fs.readFileSync(path.join(RACINE, 'data', f), 'utf8')); }

var CE = lire('CommonEvents.json');
var SYS = lire('System.json');
var SKILLS = lire('Skills.json');
var ITEMS = lire('Items.json');
var WEAPONS = lire('Weapons.json');
var ARMORS = lire('Armors.json');
var ACTORS = lire('Actors.json');
var TROOPS = lire('Troops.json');
var INFOS = lire('MapInfos.json');

var cartes = fs.readdirSync(path.join(RACINE, 'data'))
    .filter(function (f) { return /^Map\d+\.json$/.test(f); })
    .map(function (f) { return { f: f, id: parseInt(f.slice(3), 10), d: lire(f) }; });

/** Parcourt toutes les listes de commandes du projet, avec leur provenance. */
function parcourir(visite) {
    CE.forEach(function (c) {
        if (c && c.name !== undefined) { visite(c.list || [], 'EC' + c.id + ' « ' + c.name + ' »', c); }
    });
    cartes.forEach(function (m) {
        (m.d.events || []).forEach(function (ev) {
            if (!ev) { return; }
            (ev.pages || []).forEach(function (p, i) {
                visite(p.list || [], 'Map' + m.id + ' ev' + ev.id +
                    (ev.name ? ' « ' + ev.name + ' »' : '') + ' p' + (i + 1), null, m, ev, p);
            });
        });
    });
}

var existe = {
    switch: function (i) { return i > 0 && i < SYS.switches.length && String(SYS.switches[i] || '').trim() !== ''; },
    variable: function (i) { return i > 0 && i < SYS.variables.length && String(SYS.variables[i] || '').trim() !== ''; },
    ce: function (i) { return !!(CE[i] && String(CE[i].name || '').trim() !== '' && (CE[i].list || []).some(function (c) { return c.code !== 0; })); },
    item: function (i) { return !!(ITEMS[i] && String(ITEMS[i].name || '').trim() !== ''); },
    arme: function (i) { return !!(WEAPONS[i] && String(WEAPONS[i].name || '').trim() !== ''); },
    armure: function (i) { return !!(ARMORS[i] && String(ARMORS[i].name || '').trim() !== ''); },
    acteur: function (i) { return !!(ACTORS[i] && String(ACTORS[i].name || '').trim() !== ''); },
    troupe: function (i) { return !!(TROOPS[i] && String(TROOPS[i].name || '').trim() !== ''); },
    carte: function (i) { return cartes.some(function (m) { return m.id === i; }); }
};

var CONSTATS = [];
function noter(famille, ou, quoi) { CONSTATS.push({ famille: famille, ou: ou, quoi: quoi }); }

// ── 1 · les interrupteurs qu'on allume et que personne n'éteint ─────────────
// Un autorun tourne tant que son interrupteur est ON : s'il ne se relâche pas,
// le joueur perd la main pour de bon.
var allume = {}, eteint = {};
parcourir(function (list, ou) {
    list.forEach(function (c) {
        if (c.code !== 121) { return; }
        for (var s = c.parameters[0]; s <= c.parameters[1]; s++) {
            if (c.parameters[2] === 0) { (allume[s] = allume[s] || []).push(ou); }
            else { (eteint[s] = eteint[s] || []).push(ou); }
        }
    });
});
CE.forEach(function (c) {
    if (!c || !c.name || c.trigger === 0) { return; }
    var s = c.switchId;
    var type = c.trigger === 1 ? 'autorun' : 'parallèle';
    if (!s) {
        noter('déclencheur sans interrupteur',
            'EC' + c.id + ' « ' + c.name + ' »',
            type + ' sans interrupteur : il tourne en permanence, dès le lancement');
        return;
    }
    var seRelache = (c.list || []).some(function (x) {
        return x.code === 121 && x.parameters[2] === 1 && s >= x.parameters[0] && s <= x.parameters[1];
    });
    if (!seRelache && !eteint[s]) {
        noter('interrupteur jamais éteint',
            'EC' + c.id + ' « ' + c.name + ' »',
            type + ' sur l\'interrupteur ' + s + ' « ' + (SYS.switches[s] || '?') +
            ' » — rien dans tout le projet ne l\'éteint' +
            (c.trigger === 1 ? '  ⚠ le joueur perdra la main' : ''));
    }
});

// ── 2 · l'interrupteur local posé dans un événement commun ─────────────────
// Un interrupteur local (A/B/C/D) appartient à un événement de CARTE. Dans un
// événement commun, la commande s'exécute et ne touche rien du tout.
CE.forEach(function (c) {
    if (!c || !c.name) { return; }
    (c.list || []).forEach(function (x) {
        if (x.code === 123) {
            noter('interrupteur local hors carte',
                'EC' + c.id + ' « ' + c.name + ' »',
                'pose l\'interrupteur local ' + x.parameters[0] +
                ' — sans effet dans un événement commun');
        }
    });
});

// ── 3 · les renvois dans le vide ───────────────────────────────────────────
parcourir(function (list, ou) {
    list.forEach(function (c) {
        var p = c.parameters;
        if (c.code === 117 && !existe.ce(p[0])) {
            noter('renvoi dans le vide', ou, 'appelle l\'événement commun ' + p[0] +
                (CE[p[0]] && CE[p[0]].name ? ' « ' + CE[p[0]].name + ' », qui est vide' : ', qui n\'existe pas'));
        }
        if (c.code === 201 && p[0] === 0 && !existe.carte(p[1])) {
            noter('renvoi dans le vide', ou, 'téléporte vers la carte ' + p[1] + ', qui n\'existe pas');
        }
        if (c.code === 301 && p[0] === 0 && !existe.troupe(p[1])) {
            noter('renvoi dans le vide', ou, 'lance le combat contre la troupe ' + p[1] + ', qui n\'existe pas');
        }
        if (c.code === 126 && !existe.item(p[0])) {
            noter('renvoi dans le vide', ou, 'donne ou retire l\'objet ' + p[0] + ', qui n\'existe pas');
        }
        if (c.code === 127 && !existe.arme(p[0])) {
            noter('renvoi dans le vide', ou, 'donne ou retire l\'arme ' + p[0] + ', qui n\'existe pas');
        }
        if (c.code === 128 && !existe.armure(p[0])) {
            noter('renvoi dans le vide', ou, 'donne ou retire l\'armure ' + p[0] + ', qui n\'existe pas');
        }
        if (c.code === 129 && !existe.acteur(p[0])) {
            noter('renvoi dans le vide', ou, 'modifie l\'équipe avec l\'acteur ' + p[0] + ', qui n\'existe pas');
        }
    });
});

// ── 4 · les conditions sur un interrupteur que personne n'allume ───────────
// La branche est écrite, elle ne s'ouvrira jamais.
var testes = {};
parcourir(function (list, ou) {
    list.forEach(function (c) {
        if (c.code === 111 && c.parameters[0] === 0) {
            var s = c.parameters[1];
            (testes[s] = testes[s] || []).push(ou);
        }
    });
});
// Un interrupteur peut aussi être levé depuis un PLUGIN, et une lecture des
// seuls événements accuse alors une branche qui s'ouvre très bien. On va donc
// lire js/plugins : les appels setValue(<n>, true) écrits en clair, et ceux qui
// passent par un paramètre, de la forme « var X = Number(params['…'] || <n>) ».
var allumeParPlugin = {};
(function () {
    var dossier = path.join(RACINE, 'js', 'plugins');
    if (!fs.existsSync(dossier)) { return; }
    fs.readdirSync(dossier).filter(function (f) { return /\.js$/.test(f); }).forEach(function (f) {
        var src;
        try { src = fs.readFileSync(path.join(dossier, f), 'utf8'); } catch (e) { return; }
        var m;
        var litteral = /setValue\s*\(\s*(\d+)\s*,\s*true\s*\)/g;
        while ((m = litteral.exec(src))) { (allumeParPlugin[m[1]] = allumeParPlugin[m[1]] || []).push(f); }
        // via une constante tirée d'un paramètre de plugin
        var parVariable = /setValue\s*\(\s*([A-Za-z_$][\w$]*)\s*,\s*true\s*\)/g;
        while ((m = parVariable.exec(src))) {
            var nom = m[1];
            var def = new RegExp('var\\s+' + nom + '\\s*=\\s*Number\\s*\\([^)]*\\|\\|\\s*(\\d+)\\s*\\)');
            var d = src.match(def);
            if (d) { (allumeParPlugin[d[1]] = allumeParPlugin[d[1]] || []).push(f); }
        }
    });
})();

Object.keys(testes).map(Number).forEach(function (s) {
    if (allume[s]) { return; }
    // Un plugin qui le lève suffit : la branche s'ouvre, le contrôle doit
    // innocenter ce cas au lieu de le compter comme une panne.
    if (allumeParPlugin[s]) { return; }
    noter('branche qui ne s\'ouvrira jamais',
        testes[s].slice(0, 2).join(' · ') + (testes[s].length > 2 ? ' (+' + (testes[s].length - 2) + ')' : ''),
        'teste l\'interrupteur ' + s + ' « ' + (SYS.switches[s] || '?') +
        ' », que rien dans le projet n\'allume');
});

// ── 5 · ce qui reste de l'ancien lore ──────────────────────────────────────
// JOKO : « tous les événements sur la santé mentale ne marchent plus, il n'y a
// plus de santé mentale dans le jeu ». Idem pour les Chutes.
var RE_MORT = /santé mentale|sante mentale|mental|chute[s]?\b|folie|démence|demence/i;
parcourir(function (list, ou) {
    list.forEach(function (c) {
        if (c.code !== 101 && c.code !== 401 && c.code !== 355 && c.code !== 655 && c.code !== 108) { return; }
        var t = String(c.parameters[0] || '');
        if (RE_MORT.test(t)) { noter('ancien lore', ou, t.trim().slice(0, 90)); }
    });
});
[['interrupteur', SYS.switches], ['variable', SYS.variables]].forEach(function (pair) {
    pair[1].forEach(function (n, i) {
        if (n && RE_MORT.test(n)) { noter('ancien lore', pair[0] + ' ' + i, '« ' + n + ' »'); }
    });
});

// ── 6 · les événements communs vides, mais appelés ─────────────────────────
var appeles = {};
parcourir(function (list, ou) {
    list.forEach(function (c) { if (c.code === 117) { (appeles[c.parameters[0]] = appeles[c.parameters[0]] || []).push(ou); } });
});
CE.forEach(function (c) {
    if (!c || !c.name || !c.name.trim()) { return; }
    var vide = !(c.list || []).some(function (x) { return x.code !== 0; });
    if (vide && appeles[c.id]) {
        noter('coquille appelée', 'EC' + c.id + ' « ' + c.name + ' »',
            'est vide, et ' + appeles[c.id].length + ' endroit(s) l\'appellent : ' + appeles[c.id].slice(0, 2).join(', '));
    }
});

//===========================================================================
// Restitution
//===========================================================================
var familles = {};
CONSTATS.forEach(function (c) { (familles[c.famille] = familles[c.famille] || []).push(c); });

console.log('LE CODE DES ÉVÉNEMENTS — ce qui ne se passera jamais\n');
console.log('  ' + CE.filter(function (c) { return c && c.name && c.name.trim(); }).length +
    ' événements communs · ' + cartes.length + ' cartes · ' +
    cartes.reduce(function (n, m) { return n + (m.d.events || []).filter(Boolean).length; }, 0) + ' événements de carte\n');

var ORDRE = ['déclencheur sans interrupteur', 'interrupteur jamais éteint', 'interrupteur local hors carte',
    'renvoi dans le vide', 'coquille appelée', 'branche qui ne s\'ouvrira jamais', 'ancien lore'];
ORDRE.forEach(function (f) {
    var l = familles[f];
    if (!l) { return; }
    console.log('── ' + f.toUpperCase() + ' — ' + l.length + ' ──');
    l.slice(0, 14).forEach(function (c) { console.log('   ' + c.ou + '\n      ' + c.quoi); });
    if (l.length > 14) { console.log('   … et ' + (l.length - 14) + ' autre(s)'); }
    console.log('');
});

console.log('='.repeat(70));
console.log('  ' + CONSTATS.length + ' constat(s) sur ' + Object.keys(familles).length + ' famille(s)');
console.log('='.repeat(70));
