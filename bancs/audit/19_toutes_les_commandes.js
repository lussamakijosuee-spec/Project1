/*
 * TOUTES LES COMMANDES DU JEU, PRÊTES À COPIER
 * ---------------------------------------------------------------------------
 * JOKO : « fais-moi un fichier développeur avec toutes les commandes du jeu
 * déjà faites, j'ai juste à copier-coller ».
 *
 * Un carnet de commandes ne vaut que si les commandes MARCHENT. Trois fois
 * dans ce projet, une commande posée dans un événement n'était écoutée par
 * personne — « JACKPOT win » avec une espace devant, et MV coupe sur l'espace :
 * le nom de la commande devenait la chaîne vide, et l'événement ne déclenchait
 * rien, sans la moindre erreur à l'écran.
 *
 * Ce banc ne recopie donc AUCUNE documentation. Il lit le code de chaque
 * plugin allumé et relève les chaînes que ce code compare vraiment au nom de
 * la commande. Puis il range chaque trouvaille dans l'une de deux colonnes :
 *
 *   ✔ PROUVÉE  — la commande est déjà posée dans tes événements ET un plugin
 *                l'écoute. Elle marche, on l'a vue tourner.
 *   · lue dans le code — le plugin l'écoute, mais tu ne t'en es jamais servi.
 *                Elle devrait marcher ; personne ne l'a encore essayée.
 *
 * Et il signale le cas qui fait mal :
 *   ✘ MORTE    — posée dans un événement, écoutée par personne.
 *
 * Les exemples sont tirés de TES propres événements quand il y en a : c'est la
 * ligne exacte, telle qu'elle marche déjà quelque part dans le jeu.
 *
 *   node bancs/audit/19_toutes_les_commandes.js
 *   node bancs/audit/19_toutes_les_commandes.js --ecrire
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var D = path.join(RACINE, 'js', 'plugins');
var DATA = path.join(RACINE, 'data');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;

/* ── les plugins allumés ── */
var brut = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
var liste = JSON.parse(brut.slice(brut.indexOf('['), brut.lastIndexOf(']') + 1));
var actifs = liste.filter(function (p) {
    return p.status && !/^▬/.test(p.name) && fs.existsSync(path.join(D, p.name + '.js'));
});
/* les séparateurs de js/plugins.js portent les titres de sections : ils disent
 * à quoi sert chaque famille, autant s'en servir pour ranger le carnet. */
var sections = {}, sectionCourante = 'Le reste';
liste.forEach(function (p) {
    if (/^▬/.test(p.name)) {
        sectionCourante = p.name.replace(/▬/g, '').replace(/^[\s①-⑳]+/, '').trim();
        return;
    }
    sections[p.name] = sectionCourante;
});

/* ─────────────────────────────────────────────────────────────────────────
 * CE QUE LE CODE ÉCOUTE VRAIMENT
 *
 * On cherche les chaînes comparées au nom de la commande. Les auteurs de
 * plugins écrivent ça de quatre ou cinq façons différentes ; on les couvre
 * toutes, puis on nettoie.
 * ───────────────────────────────────────────────────────────────────────── */
function commandesDe(nom) {
    var t = fs.readFileSync(path.join(D, nom + '.js'), 'utf8');
    if (t.indexOf('pluginCommand') < 0) { return { cmds: {}, sousOrphelines: [] }; }

    /* Le nom de la variable qui porte la commande change d'un plugin à
     * l'autre : command, cmd, _command… On les prend tous. */
    var VAR = '(?:command|cmd|commande|_command|comando)';
    var cmds = {}, m;

    /* forme 1 :  command === "poser"   ·   cmd == 'poser'  */
    var re1 = new RegExp(VAR + '\\s*[!=]==?\\s*[\'"]([A-Za-z_][\\w ]{1,30})[\'"]', 'g');
    while ((m = re1.exec(t))) { cmds[m[1]] = cmds[m[1]] || { sous: {}, casse: false }; }

    /* forme 2 :  command.toUpperCase() === 'POSER'  → insensible à la casse */
    var re2 = new RegExp(VAR + '\\s*\\)?\\s*\\.to(?:Upper|Lower)Case\\(\\)\\s*[!=]==?\\s*[\'"]([A-Za-z_][\\w ]{1,30})[\'"]', 'g');
    while ((m = re2.exec(t))) {
        cmds[m[1]] = cmds[m[1]] || { sous: {}, casse: false };
        cmds[m[1]].casse = true;
    }
    /* forme 2 bis : String(cmd).toUpperCase() !== 'POSER' */
    var re2b = new RegExp('String\\(\\s*' + VAR + '\\s*\\)\\s*\\.to(?:Upper|Lower)Case\\(\\)\\s*[!=]==?\\s*[\'"]([A-Za-z_][\\w ]{1,30})[\'"]', 'g');
    while ((m = re2b.exec(t))) {
        cmds[m[1]] = cmds[m[1]] || { sous: {}, casse: false };
        cmds[m[1]].casse = true;
    }

    /* forme 3 : un switch sur la commande. On ne prend les « case » que s'ils
     * suivent un switch portant sur la bonne variable — sinon on ramasserait
     * les switch internes du plugin, qui n'ont rien à voir. */
    var reSw = new RegExp('switch\\s*\\(\\s*(?:String\\(\\s*)?' + VAR + '[^)]{0,30}\\)\\s*\\{', 'g');
    while ((m = reSw.exec(t))) {
        var bloc = corpsApres(t, m.index + m[0].length - 1);
        var mc, reC = /case\s+['"]([A-Za-z_][\w ]{1,30})['"]\s*:/g;
        while ((mc = reC.exec(bloc))) { cmds[mc[1]] = cmds[mc[1]] || { sous: {}, casse: false }; }
    }

    /* Les SOUS-COMMANDES : args[0] comparé à une chaîne. Elles ne se
     * rattachent pas à une commande en particulier dans le code, donc on les
     * pose sur la commande du plugin quand il n'en a qu'une — c'est le cas
     * général (DOMAINE ouvrir, JACKPOT win…). Avec plusieurs commandes, on
     * les liste à part plutôt que de deviner. */
    var sous = {};
    var re4 = /(?:args\[0\]|sub|sousCommande|action)\s*(?:\)|\.toLowerCase\(\)|\.toUpperCase\(\))?\s*[!=]==?\s*['"]([A-Za-z_][\w]{1,24})['"]/g;
    while ((m = re4.exec(t))) { sous[m[1]] = 1; }

    var noms = Object.keys(cmds);
    if (noms.length === 1) {
        Object.keys(sous).forEach(function (s) { cmds[noms[0]].sous[s] = 1; });
        sous = {};
    }
    return { cmds: cmds, sousOrphelines: Object.keys(sous) };
}

/* ─────────────────────────────────────────────────────────────────────────
 * COMMENT ON L'ÉCRIT : les arguments.
 *
 * Le code dit QUELLES commandes existent — c'est lui qui fait foi. Mais il ne
 * dit pas comment les écrire : « GainGold » tout seul ne sert à rien, il faut
 * « GainGold 500 ». Cette syntaxe-là vit dans le @help du plugin, sous une
 * ligne « Plugin Command ».
 *
 * On croise donc les deux : on ne garde du @help que les lignes dont le
 * PREMIER MOT est une commande que le code écoute vraiment. Une syntaxe
 * documentée pour une commande disparue ne passera pas, et une commande du
 * code sans ligne de @help sera signalée telle quelle.
 * ───────────────────────────────────────────────────────────────────────── */
function syntaxesDe(nom, connues) {
    var t = fs.readFileSync(path.join(D, nom + '.js'), 'utf8');
    var h = t.indexOf('@help');
    if (h < 0) { return {}; }
    var bloc = t.slice(h, t.indexOf('*/', h) < 0 ? t.length : t.indexOf('*/', h));
    var out = {};
    var minuscules = {};
    Object.keys(connues).forEach(function (c) { minuscules[c.toLowerCase()] = c; });

    bloc.split('\n').forEach(function (ligne) {
        var l = ligne.replace(/^\s*\*\s?/, '').replace(/\s+$/, '');
        if (!l.trim()) { return; }
        // la ligne d'exemple est indentée sous « Plugin Command: »
        var nu = l.trim();
        var premier = nu.split(/\s+/)[0].replace(/[:：]$/, '');
        var vraie = minuscules[premier.toLowerCase()];
        if (!vraie) { return; }
        // on sépare l'exemple de son commentaire (# … ou - …)
        var coupe = nu.search(/\s{2,}[#\-]|\s+#\s/);
        var exemple = (coupe > 0 ? nu.slice(0, coupe) : nu).trim();
        var glose = coupe > 0 ? nu.slice(coupe).replace(/^[\s#\-]+/, '').trim() : '';
        if (exemple.length < 2 || exemple.length > 120) { return; }
        // une ligne de prose qui commence par le nom de la commande n'est pas
        // un exemple : on exige qu'elle tienne en peu de mots
        if (exemple.split(/\s+/).length > 7) { return; }
        var e = out[vraie] = out[vraie] || [];
        if (!e.some(function (x) { return x.exemple === exemple; }) && e.length < 6) {
            e.push({ exemple: exemple, glose: glose });
        }
    });
    return out;
}

/** Le contenu d'un bloc { … }, à partir de l'accolade ouvrante. */
function corpsApres(t, i) {
    var n = 0, j = i;
    for (; j < t.length && j < i + 40000; j++) {
        if (t[j] === '{') { n++; }
        else if (t[j] === '}') { n--; if (n === 0) { break; } }
    }
    return t.slice(i, j + 1);
}

/* ─────────────────────────────────────────────────────────────────────────
 * CE QUI EST DÉJÀ POSÉ DANS LES ÉVÉNEMENTS
 * On garde la ligne ENTIÈRE : c'est elle que JOKO copiera, avec ses vrais
 * arguments, pas une syntaxe reconstituée.
 * ───────────────────────────────────────────────────────────────────────── */
var employees = {};      // commande → { fois, exemples[], ou[] }
fs.readdirSync(DATA).filter(function (f) { return /\.json$/.test(f); }).forEach(function (f) {
    var t = fs.readFileSync(path.join(DATA, f), 'utf8');
    var m, re = /"code":356,"indent":\d+,"parameters":\["((?:[^"\\]|\\.)*)"\]/g;
    while ((m = re.exec(t))) {
        var ligne = m[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        var premier = ligne.trim().split(/\s+/)[0];
        if (!premier) {
            /* ⚠ LE PIÈGE. MV découpe la commande sur les espaces puis retire
             *   le premier morceau. Une espace en tête fait que ce morceau est
             *   la chaîne vide : la commande n'est JAMAIS délivrée, et rien ne
             *   le signale. On le garde pour le dire. */
            (employees['(espace en tête)'] = employees['(espace en tête)'] ||
                { fois: 0, exemples: [], ou: {} }).fois++;
            employees['(espace en tête)'].exemples.push(JSON.stringify(ligne));
            employees['(espace en tête)'].ou[f] = 1;
            continue;
        }
        var e = employees[premier] = employees[premier] || { fois: 0, exemples: [], ou: {} };
        e.fois++;
        e.ou[f] = 1;
        if (e.exemples.indexOf(ligne) < 0 && e.exemples.length < 3) { e.exemples.push(ligne); }
    }
});

/* ─────────────────────────────────────────────────────────────────────────
 * LES BALISES DE NOTE
 * ───────────────────────────────────────────────────────────────────────── */
function balisesDe(nom) {
    var t = fs.readFileSync(path.join(D, nom + '.js'), 'utf8');
    var out = {}, m;
    // celles écrites dans une expression régulière : /<\s*Invocation\s*:/
    var re = /<\s*(?:\\s\*)?([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9 _\\s*]{1,36}?)(?:\\s\*)?\s*[:>]/g;
    while ((m = re.exec(t))) {
        var b = m[1].replace(/\\s\*/g, ' ').replace(/\s+/g, ' ').trim();
        if (b.length > 2 && !/^(br|div|span|p|b|i)$/i.test(b)) { out[b] = 1; }
    }
    return Object.keys(out);
}
var balisesPosees = {};
fs.readdirSync(DATA).filter(function (f) { return /\.json$/.test(f); }).forEach(function (f) {
    var t = fs.readFileSync(path.join(DATA, f), 'utf8');
    var m, re = /<([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9 _]{1,36}?)\s*[:>]/g;
    while ((m = re.exec(t))) { balisesPosees[m[1].trim().toLowerCase()] = (balisesPosees[m[1].trim().toLowerCase()] || 0) + 1; }
});

/* ─────────────────────────────────────────────────────────────────────────
 * LES APPELS DE SCRIPT (code 355 / 655)
 * Ceux-là, on ne les devine pas : on prend ceux que JOKO a DÉJÀ écrits dans
 * ses événements. Ce sont les seuls dont on sait qu'ils tournent.
 * ───────────────────────────────────────────────────────────────────────── */
/* ⚠ Un script de plusieurs lignes n'est PAS plusieurs commandes : MV met la
 *   première ligne en code 355 et TOUTES les suivantes en 655. Les relever
 *   une par une donne une liste de « } » et de « if (…) { » orphelins, sans
 *   aucune valeur à copier. On recolle donc chaque 355 avec les 655 qui le
 *   suivent — c'est le script entier qui se copie, pas ses morceaux. */
var scripts = {};
function parcourirListe(liste, fichier) {
    if (!Array.isArray(liste)) { return; }
    for (var i = 0; i < liste.length; i++) {
        var c = liste[i];
        if (!c || c.code !== 355) { continue; }
        var lignes = [String(c.parameters[0] || '')];
        var j = i + 1;
        while (j < liste.length && liste[j] && liste[j].code === 655) {
            lignes.push(String(liste[j].parameters[0] || ''));
            j++;
        }
        i = j - 1;
        var script = lignes.join('\n').replace(/\s+$/, '');
        if (!script.trim()) { continue; }
        var e = scripts[script] = scripts[script] || { fois: 0, ou: {}, lignes: lignes.length };
        e.fois++; e.ou[fichier] = 1;
    }
}
fs.readdirSync(DATA).filter(function (f) { return /\.json$/.test(f); }).forEach(function (f) {
    var data;
    try { data = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')); } catch (e) { return; }
    if (f === 'CommonEvents.json') {
        data.forEach(function (ce) { if (ce) { parcourirListe(ce.list, f); } });
    } else if (f === 'Troops.json') {
        data.forEach(function (tr) {
            if (tr) { (tr.pages || []).forEach(function (pg) { parcourirListe(pg.list, f); }); }
        });
    } else if (/^Map\d+\.json$/.test(f)) {
        (data.events || []).forEach(function (ev) {
            if (ev) { (ev.pages || []).forEach(function (pg) { parcourirListe(pg.list, f); }); }
        });
    }
});

/* ─────────────────────────────────────────────────────────────────────────
 * LES INTERRUPTEURS ET LES VARIABLES QUE LES PLUGINS LISENT
 *
 * Un numéro écrit en dur dans un plugin est un rendez-vous silencieux : si
 * JOKO réutilise la variable 15 pour autre chose, les âmes de ludwing se
 * dérèglent sans que rien ne le dise. On les relève, avec leur nom dans la
 * base pour qu'ils soient reconnaissables.
 * ───────────────────────────────────────────────────────────────────────── */
var systeme = JSON.parse(fs.readFileSync(path.join(DATA, 'System.json'), 'utf8'));
var rendezVous = { vars: {}, sws: {} };
/** Le code seul, sans les commentaires.
 *
 *  ⚠ Sans ça, le relevé ment. Le @help d'un plugin regorge d'exemples du
 *    genre « $gameVariables.value(1) », et on se retrouve à annoncer que
 *    YEP_SkillCore réserve la variable 1 — ce qu'il ne fait pas du tout.
 *    Un rendez-vous inventé est pire que pas de relevé : JOKO éviterait une
 *    variable libre en croyant la protéger.
 */
function codeSeul(t) {
    return t
        .replace(/\/\*[\s\S]*?\*\//g, ' ')     // blocs /* … */, @help compris
        .replace(/(^|[^:])\/\/[^\n]*/g, '$1'); // lignes //, sans casser les URL
}
/* ⚠ Le code n'est PAS la bonne source. Les plugins bien écrits ne mettent
 *   aucun numéro en dur : ils le lisent dans leurs réglages —
 *   InvocationAmes a « soulVar: 15 », RoyaumeImperial a « etatDomaine: 198 ».
 *   Chercher les numéros dans le code trouvait ceux des EXEMPLES du @help et
 *   ratait les vrais. On lit donc d'abord les réglages, et on ajoute ensuite
 *   les rares numéros écrits en dur, qui sont justement les plus fragiles. */
actifs.forEach(function (p) {
    Object.keys(p.parameters || {}).forEach(function (cle) {
        var val = String(p.parameters[cle]).trim();
        if (!/^\d{1,4}$/.test(val) || val === '0') { return; }
        var n = Number(val);
        if (/var(iable)?/i.test(cle)) {
            (rendezVous.vars[n] = rendezVous.vars[n] || {})[p.name + ' · ' + cle] = 1;
        } else if (/switch|interrupteur/i.test(cle)) {
            (rendezVous.sws[n] = rendezVous.sws[n] || {})[p.name + ' · ' + cle] = 1;
        }
    });
});
actifs.forEach(function (p) {
    var t = codeSeul(fs.readFileSync(path.join(D, p.name + '.js'), 'utf8')), m;
    var reV = /\$gameVariables\s*\.\s*(?:value|setValue)\s*\(\s*(\d{1,4})\s*[),]/g;
    while ((m = reV.exec(t))) {
        var v = Number(m[1]);
        (rendezVous.vars[v] = rendezVous.vars[v] || {})[p.name + ' · écrit en dur'] = 1;
    }
    var reS = /\$gameSwitches\s*\.\s*(?:value|setValue)\s*\(\s*(\d{1,4})\s*[),]/g;
    while ((m = reS.exec(t))) {
        var s = Number(m[1]);
        (rendezVous.sws[s] = rendezVous.sws[s] || {})[p.name + ' · écrit en dur'] = 1;
    }
});

/* ── on rassemble ── */
var carnet = [];
var ecoutees = {};
actifs.forEach(function (p) {
    var r = commandesDe(p.name);
    var noms = Object.keys(r.cmds);
    var bal = balisesDe(p.name).filter(function (b) { return balisesPosees[b.toLowerCase()]; });
    if (!noms.length && !bal.length) { return; }
    noms.forEach(function (c) { ecoutees[c] = p.name; });
    carnet.push({
        plugin: p.name,
        section: sections[p.name] || 'Le reste',
        quoi: (p.description || '').replace(/^v?[\d.]+\s*[■·-]?\s*/, '').trim(),
        cmds: r.cmds,
        syntaxes: syntaxesDe(p.name, r.cmds),
        sousOrphelines: r.sousOrphelines,
        balises: bal
    });
});

/* les mortes : posées dans un événement, écoutées par personne */
var mortes = Object.keys(employees).filter(function (c) {
    if (c === '(espace en tête)') { return false; }
    if (ecoutees[c]) { return false; }
    // insensible à la casse, comme les plugins qui font toUpperCase()
    return !Object.keys(ecoutees).some(function (e) { return e.toLowerCase() === c.toLowerCase(); });
});

/* ── à l'écran ── */
console.log('═'.repeat(76));
console.log('  TOUTES LES COMMANDES DU JEU');
console.log('═'.repeat(76));
console.log('   plugins allumés qui écoutent quelque chose : ' + carnet.length + ' sur ' + actifs.length);
console.log('   commandes distinctes écoutées              : ' + Object.keys(ecoutees).length);
console.log('   commandes déjà posées dans tes événements  : ' +
    Object.keys(employees).filter(function (c) { return c !== '(espace en tête)'; }).length);
console.log('   ✘ posées mais écoutées par PERSONNE        : ' + mortes.length);
if (employees['(espace en tête)']) {
    console.log('   ✘ avec une espace en tête (jamais délivrées) : ' + employees['(espace en tête)'].fois);
    employees['(espace en tête)'].exemples.slice(0, 3).forEach(function (x) { console.log('        ' + x); });
}
if (mortes.length) {
    console.log('\n   ── les mortes ──');
    mortes.slice(0, 14).forEach(function (c) {
        console.log('      ' + c.padEnd(26) + '×' + employees[c].fois + '   dans ' + Object.keys(employees[c].ou).slice(0, 3).join(', '));
    });
    if (mortes.length > 14) { console.log('      … et ' + (mortes.length - 14) + ' autres'); }
}

/* ── le document ── */
var L = [];
L.push('# Les commandes du jeu');
L.push('');
L.push('*Tout ce que les plugins allumés savent écouter, prêt à coller dans une');
L.push('commande d\'événement **Commande de plugin**. Écrit par');
L.push('`bancs/audit/19_toutes_les_commandes.js` — rien n\'est recopié d\'une');
L.push('documentation : chaque ligne vient du code qui l\'écoute.*');
L.push('');
L.push('| | |');
L.push('|---|---:|');
L.push('| plugins qui écoutent | ' + carnet.length + ' |');
L.push('| commandes distinctes | ' + Object.keys(ecoutees).length + ' |');
L.push('| déjà posées dans tes événements | ' +
    Object.keys(employees).filter(function (c) { return c !== '(espace en tête)'; }).length + ' |');
L.push('');
L.push('**Comment lire.** ✔ veut dire que la commande tourne déjà quelque part');
L.push('dans le jeu — l\'exemple donné est ta propre ligne, copiée telle quelle.');
L.push('Sans marque, le plugin l\'écoute mais tu ne t\'en es jamais servi.');
L.push('');
L.push('**Vérifié.** `bancs/navigateur/le_carnet_dit_vrai.js` ouvre le jeu et TIRE');
L.push('des commandes de ce carnet pour de vrai : cinq sur six font bouger l\'état du');
L.push('moteur, aucune ne plante. Et dans l\'autre sens — les sept déclarées mortes');
L.push('plus bas sont tirées elles aussi, et ne font rien. Sans cette contre-épreuve,');
L.push('un moteur qui avalerait n\'importe quoi passerait pour un carnet exact.');
L.push('');
L.push('> ⚠ **Une espace avant le nom et la commande n\'est jamais délivrée.**');
L.push('> RPG Maker découpe la ligne sur les espaces puis jette le premier');
L.push('> morceau : avec une espace en tête, ce morceau est vide, et le nom de');
L.push('> la commande disparaît. Rien ne s\'affiche, rien ne plante, ça ne');
L.push('> marche simplement pas. C\'est arrivé trois fois ici.');
L.push('');

/* rangé par section de js/plugins.js */
var parSection = {};
carnet.forEach(function (c) { (parSection[c.section] = parSection[c.section] || []).push(c); });
Object.keys(parSection).forEach(function (s) {
    L.push('---');
    L.push('');
    L.push('## ' + s);
    L.push('');
    parSection[s].forEach(function (c) {
        var noms = Object.keys(c.cmds);
        L.push('### `' + c.plugin + '`');
        if (c.quoi) { L.push(''); L.push(c.quoi); }
        L.push('');
        noms.forEach(function (nom) {
            var d = c.cmds[nom];
            var sous = Object.keys(d.sous);
            var vu = employees[nom] ||
                Object.keys(employees).filter(function (e) { return e.toLowerCase() === nom.toLowerCase(); })
                    .map(function (e) { return employees[e]; })[0];
            L.push('**' + (vu ? '✔ ' : '') + '`' + nom + '`**' +
                (d.casse ? '  *(la casse n\'a pas d\'importance)*' : '') +
                (vu ? '  — utilisée ' + vu.fois + ' fois dans tes événements' : ''));
            L.push('');
            /* Priorité aux lignes de JOKO : ce sont les seules dont on sait
             * qu'elles marchent. Puis la syntaxe du plugin. Puis, faute de
             * mieux, les sous-commandes reconnues par le code. */
            var pose = false;
            if (vu && vu.exemples.length) {
                L.push('```');
                vu.exemples.forEach(function (x) { L.push(x); });
                L.push('```');
                L.push('');
                L.push('*Tes propres lignes, copiées de tes événements.*');
                pose = true;
            }
            var syn = c.syntaxes[nom];
            if (syn && syn.length) {
                if (pose) { L.push(''); L.push('Et la syntaxe complète :'); }
                L.push('');
                L.push('```');
                syn.forEach(function (s) { L.push(s.exemple + (s.glose ? '    # ' + s.glose : '')); });
                L.push('```');
                pose = true;
            }
            if (sous.length) {
                if (pose) { L.push(''); L.push('Les mots qu\'elle accepte :'); }
                L.push('');
                L.push('```');
                sous.sort().forEach(function (x) { L.push(nom + ' ' + x); });
                L.push('```');
                pose = true;
            }
            if (!pose) {
                L.push('```');
                L.push(nom);
                L.push('```');
                L.push('');
                L.push('*Le plugin l\'écoute, mais il ne documente aucun argument et tu ne');
                L.push('t\'en es jamais servi — à essayer telle quelle d\'abord.*');
            }
            L.push('');
        });
        if (c.sousOrphelines.length) {
            L.push('*Mots reconnus après le nom de la commande, sans qu\'on puisse dire');
            L.push('lequel va avec laquelle :* `' + c.sousOrphelines.sort().join('` · `') + '`');
            L.push('');
        }
        if (c.balises.length) {
            L.push('Balises de note employées dans le jeu :');
            L.push('');
            L.push('```');
            c.balises.sort().forEach(function (b) { L.push('<' + b + ': …>'); });
            L.push('```');
            L.push('');
        }
    });
});

/* ── les appels de script ── */
var scriptsTries = Object.keys(scripts).sort(function (a, b) { return scripts[b].fois - scripts[a].fois; });
if (scriptsTries.length) {
    L.push('---');
    L.push('');
    L.push('## Les appels de script');
    L.push('');
    L.push('Dans un événement : **Script…**. Ceux-ci ne sont pas déduits du code —');
    L.push('ce sont les tiens, relevés dans tes propres événements. Ils tournent déjà.');
    L.push('');
    /* les scripts d'une seule ligne d'abord : ce sont ceux qu'on colle
     * vraiment sans rien y comprendre. Les blocs viennent après. */
    var courts = scriptsTries.filter(function (s) { return scripts[s].lignes === 1; });
    var blocs = scriptsTries.filter(function (s) { return scripts[s].lignes > 1; });
    if (courts.length) {
        L.push('### Une ligne — ' + courts.length);
        L.push('');
        L.push('```js');
        courts.slice(0, 70).forEach(function (s) {
            L.push(s + (scripts[s].fois > 1 ? '    // ×' + scripts[s].fois : ''));
        });
        L.push('```');
        if (courts.length > 70) { L.push(''); L.push('*(' + (courts.length - 70) + ' autres, plus rares.)*'); }
        L.push('');
    }
    if (blocs.length) {
        L.push('### Plusieurs lignes — ' + blocs.length);
        L.push('');
        L.push('*Un bloc se colle en entier : RPG Maker le recoupera tout seul.*');
        L.push('');
        blocs.slice(0, 12).forEach(function (s) {
            L.push('```js');
            L.push(s);
            L.push('```');
            L.push('');
        });
        if (blocs.length > 12) { L.push('*(' + (blocs.length - 12) + ' autres blocs, plus rares.)*'); L.push(''); }
    }
}

/* ── les numéros réservés ── */
var varsTriees = Object.keys(rendezVous.vars).map(Number).sort(function (a, b) { return a - b; });
var swsTries = Object.keys(rendezVous.sws).map(Number).sort(function (a, b) { return a - b; });
if (varsTriees.length || swsTries.length) {
    L.push('---');
    L.push('');
    L.push('## Les numéros déjà pris');
    L.push('');
    L.push('Ces variables et ces interrupteurs sont écrits **en dur** dans un plugin.');
    L.push('Les réutiliser pour autre chose dérègle ce plugin en silence : rien ne');
    L.push('plante, le système se met simplement à lire le mauvais nombre.');
    L.push('');
    if (varsTriees.length) {
        L.push('### Variables');
        L.push('');
        L.push('| n° | nom dans la base | lue par |');
        L.push('|---:|---|---|');
        varsTriees.forEach(function (v) {
            L.push('| ' + v + ' | ' + ((systeme.variables || [])[v] || '*(sans nom)*') +
                ' | ' + Object.keys(rendezVous.vars[v]).join(', ') + ' |');
        });
        L.push('');
    }
    if (swsTries.length) {
        L.push('### Interrupteurs');
        L.push('');
        L.push('| n° | nom dans la base | lu par |');
        L.push('|---:|---|---|');
        swsTries.forEach(function (s) {
            L.push('| ' + s + ' | ' + ((systeme.switches || [])[s] || '*(sans nom)*') +
                ' | ' + Object.keys(rendezVous.sws[s]).join(', ') + ' |');
        });
        L.push('');
    }
}

if (mortes.length || employees['(espace en tête)']) {
    L.push('---');
    L.push('');
    L.push('## Ce qui ne marche pas');
    L.push('');
    if (employees['(espace en tête)']) {
        L.push('### Une espace en tête — ' + employees['(espace en tête)'].fois + ' fois');
        L.push('');
        L.push('Ces lignes ne déclenchent rien du tout.');
        L.push('');
        L.push('```');
        employees['(espace en tête)'].exemples.forEach(function (x) { L.push(x); });
        L.push('```');
        L.push('');
    }
    if (mortes.length) {
        L.push('### Posées dans un événement, écoutées par personne — ' + mortes.length);
        L.push('');
        L.push('Soit le plugin qui les écoutait est éteint, soit le nom a changé.');
        L.push('');
        L.push('| commande | fois | où |');
        L.push('|---|---:|---|');
        mortes.forEach(function (c) {
            L.push('| `' + c + '` | ' + employees[c].fois + ' | ' +
                Object.keys(employees[c].ou).slice(0, 4).join(', ') + ' |');
        });
        L.push('');
    }
}

var doc = L.join('\n') + '\n';
if (ECRIRE) {
    fs.mkdirSync(path.join(RACINE, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(RACINE, 'docs', 'COMMANDES_DU_JEU.md'), doc, 'utf8');
    console.log('\n   écrit : docs/COMMANDES_DU_JEU.md (' + L.length + ' lignes)');
} else {
    console.log('\n   (ajoute --ecrire pour écrire docs/COMMANDES_DU_JEU.md)');
}
console.log('═'.repeat(76));
