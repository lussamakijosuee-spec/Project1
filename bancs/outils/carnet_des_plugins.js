/*
 * LE CARNET DES PLUGINS — tout ce qu'on peut taper, pour chaque plugin ACTIF
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-09-26 : « une page où il y a littéralement toutes les
 * commandes […] pour toutes les situations possibles, de tous les plugins.
 * Mais je parle des plugins actifs. »
 *
 * Pour chaque plugin allumé dans js/plugins.js, dans l'ordre de chargement :
 *   · les COMMANDES DE PLUGIN que son code écoute vraiment (même méthode que
 *     bancs/audit/19_toutes_les_commandes.js), avec la syntaxe de son @help
 *     et, quand tu t'en sers déjà, ta propre ligne copiée d'un événement ;
 *   · les BALISES DE NOTE : les lignes de son @help qui en montrent une, et
 *     celles que son code lit vraiment (meta.X, /<X…/) ;
 *   · les APPELS DE SCRIPT que son @help documente ;
 *   · les INTERRUPTEURS et VARIABLES qu'il lit, avec leur nom dans le jeu ;
 *   · ses RÉGLAGES actuels, et son @help complet.
 * En tête : les SITUATIONS, écrites à la main (carnet_situations.js), chacune
 * vérifiée contre le code du plugin qu'elle cite.
 *
 *   node bancs/outils/carnet_des_plugins.js            → contrôle seulement
 *   node bancs/outils/carnet_des_plugins.js --ecrire   → écrit docs/CARNET_DES_PLUGINS.html
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var D = path.join(RACINE, 'js', 'plugins');
var DATA = path.join(RACINE, 'data');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var JSON_SEUL = process.argv.indexOf('--json') >= 0;

var brut = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
var liste = JSON.parse(brut.slice(brut.indexOf('['), brut.lastIndexOf(']') + 1));
var SYS = JSON.parse(fs.readFileSync(path.join(DATA, 'System.json'), 'utf8'));
var sections = {}, sectionCourante = 'Le reste';
liste.forEach(function (p) {
    if (/^▬/.test(p.name)) {
        sectionCourante = p.name.replace(/▬/g, '').trim();
        return;
    }
    sections[p.name] = sectionCourante;
});
var actifs = liste.filter(function (p) {
    return p.status && !/^▬/.test(p.name) && fs.existsSync(path.join(D, p.name + '.js'));
});

/* ── le bloc d'en-tête /*: … *\/ et son @help ─────────────────────────── */
function entete(t) {
    var i = t.indexOf('/*:');
    if (i < 0) return '';
    // l'en-tête principal : le premier /*: qui n'est pas une traduction /*:ja
    var j = t.indexOf('*/', i);
    return t.slice(i, j < 0 ? t.length : j);
}
function nettoie(l) { return l.replace(/^\s*\*\s?/, '').replace(/\s+$/, ''); }
function aideDe(t) {
    var e = entete(t);
    var h = e.indexOf('@help');
    if (h < 0) return '';
    return e.slice(h + 5).split('\n').map(nettoie).join('\n').replace(/^\n+/, '').replace(/\n{3,}/g, '\n\n');
}
function champ(t, nom) {
    var m = new RegExp('@' + nom + '\\s+([^\\n]*)').exec(entete(t));
    return m ? m[1].replace(/\s*\*?\s*$/, '').trim() : '';
}

/* ── les paramètres typés switch / variable ───────────────────────────── */
function paramsTypes(t) {
    var e = entete(t), out = [];
    var blocs = e.split(/@param\s+/).slice(1);
    blocs.forEach(function (b) {
        var nom = b.split('\n')[0].replace(/\s*\*?\s*$/, '').trim();
        var type = (/@type\s+(\S+)/.exec(b) || [])[1] || '';
        var texte = (/@text\s+([^\n]*)/.exec(b) || [])[1] || '';
        var desc = (/@desc\s+([^\n]*)/.exec(b) || [])[1] || '';
        out.push({ nom: nom, type: type, texte: texte.replace(/\s*\*?\s*$/, '').trim(), desc: desc.replace(/\s*\*?\s*$/, '').trim() });
    });
    return out;
}

/* ── commandes : mêmes formes que le banc 19 ──────────────────────────── */
function corpsApres(t, i) {
    var n = 0, j = i;
    for (; j < t.length && j < i + 40000; j++) {
        if (t[j] === '{') n++;
        else if (t[j] === '}') { n--; if (n === 0) break; }
    }
    return t.slice(i, j + 1);
}
function commandesDe(t) {
    if (t.indexOf('pluginCommand') < 0) return { cmds: {}, sous: [] };
    var VAR = '(?:command|cmd|commande|_command|comando)';
    var cmds = {}, m;
    var re1 = new RegExp(VAR + '\\s*[!=]==?\\s*[\'"]([A-Za-z_][\\w ]{1,30})[\'"]', 'g');
    while ((m = re1.exec(t))) cmds[m[1]] = cmds[m[1]] || { casse: false };
    var re2 = new RegExp(VAR + '\\s*\\)?\\s*\\.to(?:Upper|Lower)Case\\(\\)\\s*[!=]==?\\s*[\'"]([A-Za-z_][\\w ]{1,30})[\'"]', 'g');
    while ((m = re2.exec(t))) { cmds[m[1]] = cmds[m[1]] || {}; cmds[m[1]].casse = true; }
    var re2b = new RegExp('String\\(\\s*' + VAR + '\\s*\\)\\s*\\.to(?:Upper|Lower)Case\\(\\)\\s*[!=]==?\\s*[\'"]([A-Za-z_][\\w ]{1,30})[\'"]', 'g');
    while ((m = re2b.exec(t))) { cmds[m[1]] = cmds[m[1]] || {}; cmds[m[1]].casse = true; }
    var reSw = new RegExp('switch\\s*\\(\\s*(?:String\\(\\s*)?' + VAR + '[^)]{0,30}\\)\\s*\\{', 'g');
    while ((m = reSw.exec(t))) {
        var bloc = corpsApres(t, m.index + m[0].length - 1);
        var mc, reC = /case\s+['"]([A-Za-z_][\w ]{1,30})['"]\s*:/g;
        while ((mc = reC.exec(bloc))) cmds[mc[1]] = cmds[mc[1]] || { casse: false };
    }
    var sous = {};
    var re4 = /(?:args\[0\]|sub|sousCommande|action)\s*(?:\)|\.toLowerCase\(\)|\.toUpperCase\(\))?\s*[!=]==?\s*['"]([A-Za-z_][\w]{1,24})['"]/g;
    while ((m = re4.exec(t))) sous[m[1]] = 1;

    /* Forme générale : dans le corps de CHAQUE pluginCommand, on suit le nom
     * de la commande et tout ce qu'on en tire (var MOT = String(cmd)…), et
     * de même pour le premier argument (les sous-commandes). */
    var reF = /pluginCommand\s*=\s*function\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*\{/g, f;
    while ((f = reF.exec(t))) {
        var corps = corpsApres(t, f.index + f[0].length - 1);
        var noms = [f[1]], sousNoms = [];
        for (var tour = 0; tour < 3; tour++) {
            var ra = /var\s+(\w+)\s*=\s*([^;]+);/g, a;
            while ((a = ra.exec(corps))) {
                var expr = a[2];
                if (noms.indexOf(a[1]) < 0 && noms.some(function (n) { return new RegExp('\\b' + n + '\\b').test(expr); })) noms.push(a[1]);
                if (sousNoms.indexOf(a[1]) < 0 && (new RegExp('\\b' + f[2] + '\\s*\\[\\s*0\\s*\\]').test(expr) ||
                    /\b\w+\[0\]/.test(expr) && sousNoms.length === 0 && !noms.some(function (n) { return new RegExp('\\b' + n + '\\b').test(expr); }))) sousNoms.push(a[1]);
                if (sousNoms.indexOf(a[1]) < 0 && sousNoms.some(function (n) { return new RegExp('\\b' + n + '\\b').test(expr); })) sousNoms.push(a[1]);
            }
        }
        function comparees(vars, cible, prendreSwitch) {
            if (!vars.length) return;
            var alt = vars.join('|');
            var rc = new RegExp('(?:\\b(?:' + alt + ')\\b|String\\(\\s*(?:' + alt + ')[^)]*\\))(?:\\s*\\.\\s*\\w+\\(\\))*\\s*[!=]==?\\s*[\'"]([A-Za-z_][\\w ]{0,30})[\'"]', 'g'), x;
            while ((x = rc.exec(corps))) cible(x[1]);
            var rs = new RegExp('switch\\s*\\(\\s*(?:String\\(\\s*)?(?:' + alt + ')\\b[^)]{0,40}\\)\\s*\\{', 'g');
            while ((x = rs.exec(corps))) {
                var bl = corpsApres(corps, x.index + x[0].length - 1), y, rC = /case\s+['"]([A-Za-z_][\w ]{0,30})['"]\s*:/g;
                while ((y = rC.exec(bl))) cible(y[1]);
            }
        }
        comparees(noms, function (n) { if (n.length > 1) cmds[n] = cmds[n] || { casse: /toUpperCase|toLowerCase/.test(corps) }; });
        // e.match(/FlushAudioCache/i) · line.match(/Picture (\d+) Frame/i)
        var rm = /(\w+)\.match\(\s*\/\^?([A-Za-z][A-Za-z_]{2,30})/g, mm;
        while ((mm = rm.exec(corps))) {
            if (noms.indexOf(mm[1]) >= 0 || /^(line|ligne|str|text|full)$/i.test(mm[1])) cmds[mm[2]] = cmds[mm[2]] || { casse: true };
        }
        // une table d'aiguillage : Galv.pCmd[command](args) → Galv.pCmd.JUMPACTION = function…
        var rt = new RegExp('([\\w$.]+)\\[\\s*(?:' + noms.join('|') + ')\\s*\\]', 'g'), tb;
        while ((tb = rt.exec(corps))) {
            var chemin = tb[1].replace(/[.$]/g, function (c) { return '\\' + c; });
            var rd = new RegExp(chemin + '(?:\\.([A-Za-z_]\\w*)|\\[\\s*[\'"]([^\'"]+)[\'"]\\s*\\])\\s*=(?!=)', 'g'), d;
            while ((d = rd.exec(t))) { var nn = d[1] || d[2]; if (nn) cmds[nn] = cmds[nn] || { casse: false }; }
        }
        comparees(sousNoms, function (n) { sous[n] = 1; });
    }
    return { cmds: cmds, sous: Object.keys(sous) };
}
function syntaxesDe(aide, connues) {
    var out = {}, min = {};
    Object.keys(connues).forEach(function (c) { min[c.toLowerCase()] = c; });
    aide.split('\n').forEach(function (l) {
        var nu = l.trim();
        if (!nu) return;
        var premier = nu.split(/\s+/)[0].replace(/[:：]$/, '');
        var vraie = min[premier.toLowerCase()];
        if (!vraie) return;
        // MV compare caractère par caractère : si le plugin ne rattrape pas la
        // casse, la ligne doit porter la commande EXACTEMENT comme il l'attend
        if (!connues[vraie].casse && premier !== vraie) return;
        // de la prose qui commence par le nom de la commande n'est pas un exemple
        if (/[.;]\s*$/.test(nu) || /\.\s+[A-Za-z]/.test(nu) || (/\w: /.test(nu) && !/ : /.test(nu))) return;
        var coupe = nu.search(/\s{2,}[#\-]|\s+#\s|\s{3,}/);
        var ex = (coupe > 0 ? nu.slice(0, coupe) : nu).trim();
        var glose = coupe > 0 ? nu.slice(coupe).replace(/^[\s#\-\/]+/, '').trim() : '';
        if (ex.length < 2 || ex.length > 140 || ex.split(/\s+/).length > 12) return;
        if (/ \/ /.test(ex)) return;   // un titre de l'aide (« VOIES INTERDITES / ÉTRANGÈRES »)
        var e = out[vraie] = out[vraie] || [];
        if (!e.some(function (x) { return x.ex === ex; }) && e.length < 40) e.push({ ex: ex, glose: glose });
    });
    return out;
}

/* ── ce qui est déjà posé dans les événements (tes propres lignes) ────── */
var employees = {};
fs.readdirSync(DATA).filter(function (f) { return /\.json$/.test(f) && !require('./atelier.js').estAtelier(f); }).forEach(function (f) {
    var t = fs.readFileSync(path.join(DATA, f), 'utf8');
    var m, re = /"code":356,"indent":\d+,"parameters":\["((?:[^"\\]|\\.)*)"\]/g;
    while ((m = re.exec(t))) {
        var ligne;
        try { ligne = JSON.parse('"' + m[1] + '"'); } catch (e) { continue; }
        var premier = ligne.trim().split(/\s+/)[0];
        if (!premier) continue;
        var cle = premier.toLowerCase();
        var e = employees[cle] = employees[cle] || { fois: 0, exemples: [] };
        e.fois++;
        if (e.exemples.indexOf(ligne) < 0 && e.exemples.length < 3) e.exemples.push(ligne);
    }
});

/* ── les balises de note ──────────────────────────────────────────────── */
var CIBLES = [
    ['Carte', /\bmap\b|\bmapa\b|carte/i], ['Événement', /\bevent\b|evento|événement|evenement/i],
    ['Acteur', /\bactor\b|acteur|héros|personnage/i], ['Classe', /\bclass\b|classe/i],
    ['Compétence', /\bskill\b|compétence|habilidade/i], ['Objet', /\bitem\b|objet/i],
    ['Arme', /\bweapon\b|arme\b/i], ['Armure', /\barmor\b|armure/i],
    ['Ennemi', /\benemy\b|\benemies\b|ennemi|inimigo/i], ['État', /\bstate\b|état|estado/i],
    ['Troupe', /\btroop\b|troupe/i], ['Tileset', /tileset/i]
];
function balisesDe(aide, connues) {
    var out = [], titre = '', vu = {};
    var lignes = aide.split('\n');
    lignes.forEach(function (l, i) {
        var nu = l.trim();
        if (!nu) return;
        // une ligne de titre : courte, sans balise, finie par « : » ou soulignée
        var suivante = (lignes[i + 1] || '').trim();
        if (!/</.test(nu) && nu.length < 70 && (/:\s*$/.test(nu) || /^[=\-─━]{4,}$/.test(suivante) || /notetag|note tag|comment|nota/i.test(nu))) {
            titre = nu.replace(/[:=\-─━]+\s*$/, '').trim();
            return;
        }
        var m = /<\s*\/?\s*[A-Za-zÀ-ÿ][^<>]{0,80}>/.exec(nu);
        // le style MOG : « event sensor : X » dans un commentaire d'événement
        // ou la note d'une carte, sans chevrons
        if (!m && /^[a-z][a-z_ ]{2,30} : (?:[A-Z_]{1,20}|\d+|X|true|false)\b/.test(nu) && !/^(ex|obs|nota|note|example)\b/i.test(nu) &&
            (connues ? !connues[nu.split(/\s+/)[0].toLowerCase()] : true)) {
            if (!vu[nu]) { vu[nu] = 1; out.push({ ligne: nu, titre: titre, cible: 'Commentaire d\'événement ou note' }); }
            return;
        }
        if (!m) return;
        if (/^<\/?(?:br|b|i|p|span|div|font|color)\b/i.test(m[0])) return;
        if (nu.length > 160) return;
        if (vu[nu]) return;
        vu[nu] = 1;
        var cible = '';
        for (var k = 0; k < CIBLES.length; k++) if (CIBLES[k][1].test(titre)) { cible = CIBLES[k][0]; break; }
        out.push({ ligne: nu, titre: titre, cible: cible });
    });
    return out.slice(0, 160);
}
function balisesDuCode(t) {
    var s = {}, m;
    var reMeta = /\.meta\.([A-Za-z_][\w]*)|\.meta\[\s*['"]([^'"]{1,40})['"]\s*\]/g;
    while ((m = reMeta.exec(t))) { var n = m[1] || m[2]; if (!/^(note|length)$/.test(n)) s[n] = 1; }
    var reRx = /\/<\\?s?\*?\??\s*\(?\??([A-Za-z][A-Za-z_ ]{1,30}?)(?:\\s|\s|:|>|\(|\\|\))/g;
    while ((m = reRx.exec(t))) { var x = m[1].trim(); if (x.length > 1 && !/^(br|b|i|img|span|div)$/i.test(x)) s[x] = 1; }
    return Object.keys(s).sort();
}

/* ── appels de script documentés ──────────────────────────────────────── */
function scriptsDe(aide) {
    var out = [], vu = {};
    aide.split('\n').forEach(function (l) {
        var nu = l.trim();
        var appel = /^[\$A-Za-z_][\w$]*(?:\.[\w$]+)+\s*\(.*\)\s*;?\s*(?:\/\/.*)?$/.test(nu);
        if (!appel && !/(\$game\w+|\$data\w+|SceneManager|BattleManager|this\.[a-zA-Z]+|Yanfly\.\w+|window\.\w+)[\w.]*\s*\(/.test(nu) &&
            !/^\$game\w+\.\w+/.test(nu)) return;
        if (nu.length > 170 || vu[nu]) return;
        vu[nu] = 1;
        out.push(nu);
    });
    return out.slice(0, 80);
}

/* ── interrupteurs et variables ───────────────────────────────────────── */
function nomInter(n) { return (SYS.switches[n] || '').trim(); }
function nomVar(n) { return (SYS.variables[n] || '').trim(); }
function interrupteursDe(t, params, types) {
    var out = [];
    types.forEach(function (p) {
        if (p.type !== 'switch' && p.type !== 'variable') return;
        var v = Number(params[p.nom]);
        out.push({ genre: p.type === 'switch' ? 'Interrupteur' : 'Variable', num: v, nom: p.type === 'switch' ? nomInter(v) : nomVar(v),
            role: p.texte || p.nom, desc: p.desc, reglage: p.nom });
    });
    var m, vus = {};
    out.forEach(function (o) { vus[o.genre + o.num] = 1; });
    var re = /\$game(Switches|Variables)\.(value|setValue)\(\s*(\d+)/g;
    while ((m = re.exec(t))) {
        var g = m[1] === 'Switches' ? 'Interrupteur' : 'Variable', n = Number(m[3]);
        if (vus[g + n]) continue;
        vus[g + n] = 1;
        out.push({ genre: g, num: n, nom: g === 'Interrupteur' ? nomInter(n) : nomVar(n), role: m[2] === 'setValue' ? 'écrit par le code' : 'lu par le code', desc: '', reglage: '' });
    }
    return out;
}

/* ── les résumés en français des plugins dont la description ne l'est pas ── */
var RESUMES = require('./carnet_resumes.js');
var SITUATIONS = require('./carnet_situations.js');

/* Quatre commandes que leur @help ne montre pas : la syntaxe lue dans leur code. */
var SYNTAXES_LUES = {
    'Aries001L_ShakeEffects|AriesScreenShakeType': [
        { ex: 'AriesScreenShakeType STANDARD', glose: 'secousse normale de MV' },
        { ex: 'AriesScreenShakeType RANDOM', glose: 'dans tous les sens' },
        { ex: 'AriesScreenShakeType HORIZONTAL', glose: 'gauche-droite' },
        { ex: 'AriesScreenShakeType VERTICAL', glose: 'haut-bas (réglage actuel)' }],
    'FusionMana|FUSION': [
        { ex: 'FUSION chair 1', glose: 'le héros 1 entre en Chair d\'Âme' },
        { ex: 'FUSION rasoir 1', glose: 'le héros 1 entre dans le Fil du Rasoir' },
        { ex: 'FUSION songe 1', glose: 'le héros 1 entre dans le Songe Incarné' },
        { ex: 'FUSION fin 1', glose: 'le héros 1 sort de sa fusion' }],
    'RoyaumeImperial|DOMAINE': [
        { ex: 'DOMAINE ouvrir 3', glose: 'le héros 3 ouvre le Royaume Impérial' },
        { ex: 'DOMAINE fermer 3', glose: 'le referme' }],
    'SeiryuLeFamilier|SEIRYU': [
        { ex: 'SEIRYU experience 40', glose: 'fixe l\'expérience de seiryu' },
        { ex: 'SEIRYU palier 2', glose: 'le met directement au palier 2 ou 3' },
        { ex: 'SEIRYU oublier', glose: 'efface ce qu\'il a appris des ennemis' }]
};

var plugins = actifs.map(function (p, i) {
    var t = fs.readFileSync(path.join(D, p.name + '.js'), 'utf8');
    var aide = aideDe(t);
    var types = paramsTypes(t);
    var c = commandesDe(t);
    var syn = syntaxesDe(aide, c.cmds);
    var commandes = Object.keys(c.cmds).sort().map(function (n) {
        var e = employees[n.toLowerCase()];
        return { nom: n, casse: !!c.cmds[n].casse, syntaxes: syn[n] || SYNTAXES_LUES[p.name + '|' + n] || [], tiennes: e ? e.exemples : [], fois: e ? e.fois : 0 };
    });
    var params = p.parameters || {};
    return {
        ordre: i + 1, nom: p.name, section: sections[p.name] || '',
        auteur: champ(t, 'author'), desc: (p.description || '').replace(/\r?\n/g, ' ').trim(),
        resume: RESUMES[p.name] || '',
        commandes: commandes, sousCommandes: c.sous,
        balises: balisesDe(aide, (function () { var o = {}; Object.keys(c.cmds).forEach(function (k) { o[k.toLowerCase()] = 1; }); return o; })()), balisesCode: balisesDuCode(t),
        scripts: scriptsDe(aide),
        interrupteurs: interrupteursDe(t, params, types),
        reglages: Object.keys(params).filter(function (k) { return !/^-+|<<<|^─|^==/.test(k); }).map(function (k) {
            var tp = types.filter(function (x) { return x.nom === k; })[0];
            var v = String(params[k]);
            return { cle: k, valeur: v.length > 300 ? v.slice(0, 300) + ' …' : v, texte: tp ? tp.texte : '', type: tp ? tp.type : '' };
        }),
        aide: aide.length > 60000 ? aide.slice(0, 60000) + '\n\n[… aide tronquée, voir js/plugins/' + p.name + '.js]' : aide
    };
});

/* ── contrôles : un carnet qui ment ne vaut rien ──────────────────────── */
var ko = 0;
function verifie(titre, ok, detail) {
    console.log((ok ? '   ✓ ' : '   ✗ ') + titre + (detail ? '  —  ' + detail : ''));
    if (!ok) ko++;
}
var sansResume = plugins.filter(function (p) { return !p.resume && !/[éèàùâêîôûç■]|\b(le|la|les|des|du|une?)\b/i.test(p.desc); });
verifie('chaque plugin actif a une phrase en français', sansResume.length === 0, sansResume.map(function (p) { return p.nom; }).join(', '));
var resumesMorts = Object.keys(RESUMES).filter(function (n) { return !actifs.some(function (p) { return p.name === n; }); });
verifie('aucun résumé pour un plugin éteint ou absent', resumesMorts.length === 0, resumesMorts.join(', '));

// chaque commande citée dans une situation doit être écoutée par le plugin cité
var toutes = {};
plugins.forEach(function (p) { p.commandes.forEach(function (c) { toutes[p.nom + '|' + c.nom.toLowerCase()] = 1; }); });
var fausses = [];
SITUATIONS.forEach(function (th) {
    th.situations.forEach(function (s) {
        (s.lignes || []).forEach(function (l) {
            if (l.genre !== 'commande') return;
            var premier = l.texte.trim().split(/\s+/)[0].toLowerCase();
            if (!toutes[l.plugin + '|' + premier]) fausses.push(l.plugin + ' : ' + l.texte);
        });
        (s.lignes || []).forEach(function (l) {
            if (!l.plugin || l.plugin === 'MV') return;
            if (!actifs.some(function (p) { return p.name === l.plugin; })) fausses.push('plugin éteint : ' + l.plugin);
        });
    });
});
verifie('chaque commande des situations est écoutée par le plugin qu\'elle cite', fausses.length === 0, fausses.slice(0, 8).join(' · '));
// les scripts appellent une fonction qui existe ; les notes nomment un mot que le plugin lit
var douteuses = [];
SITUATIONS.forEach(function (th) {
    th.situations.forEach(function (s) {
        (s.lignes || []).forEach(function (l) {
            if (!l.plugin || l.plugin === 'MV' || l.genre === 'commande') return;
            var code = fs.readFileSync(path.join(D, l.plugin + '.js'), 'utf8');
            var mot;
            if (l.genre === 'script') {
                var m = /([A-Za-z_$][\w$]*)\s*(?:\(|=)/.exec(l.texte.replace(/^.*\.(?=[A-Za-z_$][\w$]*\s*(?:\(|=))/, ''));
                mot = m ? m[1] : '';
            } else {
                var n = (l.genre === 'message' && /\\([a-zA-Z]{1,2})[\[<]/.exec(l.texte)) ||
                    /<\s*([A-Za-z][A-Za-z ]*?)\s*(?:\d|:|>)/.exec(l.texte) || /^([a-z][a-z_ ]+?) :/.exec(l.texte);
                mot = n ? n[1] : '';
            }
            if (!mot || code.toLowerCase().indexOf(mot.toLowerCase()) < 0) douteuses.push(l.plugin + ' : ' + l.texte.split('\n')[0] + ' [' + mot + ']');
        });
    });
});
verifie('chaque script, note ou code de message des situations est lu par son plugin', douteuses.length === 0, douteuses.slice(0, 10).join(' · '));
var nbSit = SITUATIONS.reduce(function (s, t) { return s + t.situations.length; }, 0);
var nbCmd = plugins.reduce(function (s, p) { return s + p.commandes.length; }, 0);
var nbBal = plugins.reduce(function (s, p) { return s + p.balises.length; }, 0);
var nbScr = plugins.reduce(function (s, p) { return s + p.scripts.length; }, 0);
console.log('\n   ' + plugins.length + ' plugins actifs · ' + nbSit + ' situations · ' + nbCmd + ' commandes · ' + nbBal + ' lignes de balises · ' + nbScr + ' appels de script');

if (JSON_SEUL) {
    fs.writeFileSync(path.join(RACINE, 'bancs', 'outils', 'carnet_brut.json'), JSON.stringify(plugins, null, 1));
    console.log('   écrit bancs/outils/carnet_brut.json');
}
if (ECRIRE) {
    var gabarit = fs.readFileSync(path.join(__dirname, 'carnet_gabarit.html'), 'utf8');
    var donnees = JSON.stringify({ plugins: plugins, situations: SITUATIONS, date: new Date().toISOString().slice(0, 10) })
        .replace(/</g, '\\u003c');
    var html = gabarit.replace('/*__DONNEES__*/null', function () { return donnees; });
    fs.writeFileSync(path.join(RACINE, 'docs', 'CARNET_DES_PLUGINS.html'), html);
    console.log('   écrit docs/CARNET_DES_PLUGINS.html  (' + Math.round(html.length / 1024) + ' Ko)');
}
process.exit(ko ? 1 : 0);
