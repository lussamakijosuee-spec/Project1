/*
 * LA PLANCHE D'EXPRESSIONS (Studio), OUVERTE ET ENREGISTRÉE POUR DE VRAI
 * ---------------------------------------------------------------------------
 * Le générateur de RPG Maker MV exporte un visage à la fois (144×144). La page
 * /planche du Studio en assemble huit en une planche MV (576×288 : 4 × 2 cases),
 * dans le navigateur, et le serveur l'écrit dans img/faces sans rien remplacer.
 *
 * Le banc lance DEUX serveurs du Studio à lui (ports 8791 et 8792, jamais celui
 * de JOKO) : sur le premier, « RPG Maker » est un programme qui ne tourne pas ;
 * sur le second, c'est node.exe — qui tourne forcément — pour voir le refus.
 *   ① la page s'ouvre depuis l'accueil du Studio
 *   ② une image de 100×100 est refusée avec sa taille, rien n'est placé
 *   ③ huit PNG de couleurs différentes, déposés dans le désordre, se rangent par
 *     nom ; « Enregistrer » écrit img/faces/<nom>.png, relu ICI par un décodeur
 *     PNG à part (pas celui du navigateur) : 576×288, chaque case entièrement de
 *     sa couleur, dans l'ordre ; un bord semi-transparent reste semi-transparent
 *   ④ le même nom une 2e fois : refusé, fichier intact, un autre nom proposé ;
 *     un visage déjà là que le Studio n'a pas écrit (même écrit en MAJUSCULES) :
 *     refusé, fichier intact — c'est un leurre posé par le banc, jamais un visage
 *     de JOKO : un serveur cassé n'écraserait que lui
 *   ⑤ une case glissée sur une autre les échange ; une case vidée sort transparente
 *   ⑥ RPG Maker « ouvert » : refusé, rien d'écrit
 *   ⑦ le serveur ne croit pas la page sur parole : PNG de 100×100, autre chose
 *     qu'un PNG, nom qui sort du dossier — refusés
 * Le banc efface ses fichiers d'essai, puis vérifie que img/faces est exactement
 * comme avant.
 *
 *   node bancs/navigateur/la_planche_dexpressions.js
 */
'use strict';
var { chromium } = require('playwright');
var path = require('path');
var fs = require('fs');
var zlib = require('zlib');
var crypto = require('crypto');
var spawn = require('child_process').spawn;

var RACINE = path.resolve(__dirname, '..', '..');
var FACES = path.join(RACINE, 'img', 'faces');
var PORT = 8791, PORT_OUVERT = 8792;
var ETIQUETTE = '_banc_planche_' + process.pid;
var NOM_A = ETIQUETTE + '_A', NOM_B = ETIQUETTE + '_B', NOM_C = ETIQUETTE + '_C', NOM_LEURRE = ETIQUETTE + '_Leurre';

// ── PNG : un encodeur et un décodeur à part, pour ne pas relire avec le navigateur ──
var TABLE_CRC = (function () {
    var t = [];
    for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    return t;
})();
function crc32(buf) { var c = 0xFFFFFFFF; for (var i = 0; i < buf.length; i++) c = TABLE_CRC[(c ^ buf[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function morceau(type, donnees) {
    var l = Buffer.alloc(4); l.writeUInt32BE(donnees.length);
    var td = Buffer.concat([Buffer.from(type, 'ascii'), donnees]);
    var c = Buffer.alloc(4); c.writeUInt32BE(crc32(td));
    return Buffer.concat([l, td, c]);
}
function encoderPNG(largeur, hauteur, pixel) {          // pixel(x, y) → [r, g, b, a]
    var brut = Buffer.alloc((largeur * 4 + 1) * hauteur);
    for (var y = 0; y < hauteur; y++) {
        brut[y * (largeur * 4 + 1)] = 0;
        for (var x = 0; x < largeur; x++) {
            var p = pixel(x, y), o = y * (largeur * 4 + 1) + 1 + x * 4;
            brut[o] = p[0]; brut[o + 1] = p[1]; brut[o + 2] = p[2]; brut[o + 3] = p[3];
        }
    }
    var ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(largeur, 0); ihdr.writeUInt32BE(hauteur, 4);
    ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
    return Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), morceau('IHDR', ihdr),
        morceau('IDAT', zlib.deflateSync(brut)), morceau('IEND', Buffer.alloc(0))]);
}
function decoderPNG(buf) {
    if (buf.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw new Error('pas un PNG');
    var o = 8, ihdr = null, idat = [];
    while (o < buf.length) {
        var l = buf.readUInt32BE(o), type = buf.toString('ascii', o + 4, o + 8), d = buf.slice(o + 8, o + 8 + l);
        if (type === 'IHDR') ihdr = { largeur: d.readUInt32BE(0), hauteur: d.readUInt32BE(4), profondeur: d[8], couleur: d[9], entrelace: d[12] };
        else if (type === 'IDAT') idat.push(d);
        else if (type === 'IEND') break;
        o += 12 + l;
    }
    if (ihdr.profondeur !== 8 || ihdr.entrelace !== 0 || [2, 6].indexOf(ihdr.couleur) < 0)
        throw new Error('PNG non pris en charge par le banc : couleur ' + ihdr.couleur + ', profondeur ' + ihdr.profondeur + ', entrelacé ' + ihdr.entrelace);
    var bpp = ihdr.couleur === 6 ? 4 : 3, ligne = ihdr.largeur * bpp;
    var brut = zlib.inflateSync(Buffer.concat(idat)), px = Buffer.alloc(ligne * ihdr.hauteur);
    for (var y = 0; y < ihdr.hauteur; y++) {
        var filtre = brut[y * (ligne + 1)], src = y * (ligne + 1) + 1, dst = y * ligne;
        for (var x = 0; x < ligne; x++) {
            var a = x >= bpp ? px[dst + x - bpp] : 0, b = y ? px[dst - ligne + x] : 0, c = (x >= bpp && y) ? px[dst - ligne + x - bpp] : 0, v = brut[src + x];
            if (filtre === 1) v += a; else if (filtre === 2) v += b; else if (filtre === 3) v += (a + b) >> 1;
            else if (filtre === 4) { var p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += (pa <= pb && pa <= pc) ? a : pb <= pc ? b : c; }
            px[dst + x] = v & 0xFF;
        }
    }
    return { largeur: ihdr.largeur, hauteur: ihdr.hauteur,
             pixel: function (x, y) { var i = y * ligne + x * bpp; return [px[i], px[i + 1], px[i + 2], bpp === 4 ? px[i + 3] : 255]; } };
}

// les huit visages d'essai : une couleur pleine chacun ; le 6e (case 5) a ses 20
// dernières lignes à moitié transparentes, pour voir ce que devient un bord doux
var COULEURS = [[220, 40, 40], [240, 140, 20], [230, 210, 40], [40, 170, 60], [30, 180, 200], [40, 70, 210], [140, 60, 190], [230, 100, 170]];
var NOMS_COULEURS = ['rouge', 'orange', 'jaune', 'vert', 'cyan', 'bleu', 'violet', 'rose'];
var SEMI = { case: 5, depuis: 124, alpha: 128 };
function visage(i) {
    return encoderPNG(144, 144, function (x, y) {
        var c = COULEURS[i];
        return [c[0], c[1], c[2], (i === SEMI.case && y >= SEMI.depuis) ? SEMI.alpha : 255];
    });
}
// mesure d'une case de la planche relue : combien de pixels s'écartent de ce qu'on attend
function mesurerCase(img, k, attendu) {           // attendu : index de couleur, ou null (vide)
    var x0 = (k % 4) * 144, y0 = Math.floor(k / 4) * 144, faux = 0, ecartSemi = 0, alphaSemiFaux = 0, premier = null;
    for (var y = 0; y < 144; y++) for (var x = 0; x < 144; x++) {
        var p = img.pixel(x0 + x, y0 + y), bon;
        if (attendu === null) bon = p[3] === 0;
        else {
            var c = COULEURS[attendu];
            if (attendu === SEMI.case && y >= SEMI.depuis) {
                if (p[3] !== SEMI.alpha) alphaSemiFaux++;
                ecartSemi = Math.max(ecartSemi, Math.abs(p[0] - c[0]), Math.abs(p[1] - c[1]), Math.abs(p[2] - c[2]));
                continue;
            }
            bon = p[0] === c[0] && p[1] === c[1] && p[2] === c[2] && p[3] === 255;
        }
        if (!bon) { faux++; if (!premier) premier = '(' + x + ',' + y + ') = ' + p.join(','); }
    }
    return { faux: faux, premier: premier, centre: img.pixel(x0 + 72, y0 + 72), ecartSemi: ecartSemi, alphaSemiFaux: alphaSemiFaux };
}
function empreinte(f) { return crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'); }
function listeFaces() { return fs.readdirSync(FACES).sort().join('\n'); }

// ── un serveur du Studio à nous ─────────────────────────────────────────────
function lancerStudio(port, editeur) {
    return new Promise(function (ok, ko) {
        var p = spawn(process.execPath, [path.join(RACINE, 'studio', 'serveur.js')], {
            env: Object.assign({}, process.env, { STUDIO_PORT: String(port), STUDIO_EDITEUR: editeur }), windowsHide: true });
        var sortie = '';
        var minuteur = setTimeout(function () { ko(new Error('le Studio (port ' + port + ') ne démarre pas : ' + sortie)); }, 15000);
        p.stdout.on('data', function (d) {
            sortie += d;
            if (/Studio prêt/.test(sortie)) { clearTimeout(minuteur); ok(p); }
            else if (/tourne déjà/.test(sortie)) { clearTimeout(minuteur); ko(new Error('le port ' + port + ' est déjà pris : le banc ne parlera pas à un autre serveur')); }
        });
        p.stderr.on('data', function (d) { sortie += d; });
        p.on('exit', function (c) { clearTimeout(minuteur); ko(new Error('le Studio (port ' + port + ') s\'est arrêté (' + c + ') : ' + sortie)); });
    });
}

(async function () {
    var ok = 0, ko = 0, serveurs = [], nav = null, ecrits = [NOM_A, NOM_B, NOM_C, NOM_A + '_2'];
    function V(t, c, d) { if (c) { ok++; console.log('   ✓ ' + t + (d ? '  —  ' + d : '')); } else { ko++; console.log('   ✗ ' + t + (d ? '  —  ' + d : '')); } }
    var avant = listeFaces();
    var erreurs = [];

    try {
        serveurs.push(await lancerStudio(PORT, 'banc_aucun_editeur.exe'));
        var BASE = 'http://127.0.0.1:' + PORT;
        nav = await chromium.launch({ args: ['--no-sandbox', '--mute-audio'] });
        var page = await nav.newPage({ viewport: { width: 1200, height: 860 } });
        page.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });

        async function deposer(p, selecteur, fichiers) {      // un glisser-déposer de fichiers, comme depuis l'Explorateur
            var dt = await p.evaluateHandle(function (liste) {
                var dt = new DataTransfer();
                liste.forEach(function (f) {
                    var b = atob(f.b64), u = new Uint8Array(b.length);
                    for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
                    dt.items.add(new File([u], f.nom, { type: 'image/png' }));
                });
                return dt;
            }, fichiers.map(function (f) { return { nom: f.nom, b64: f.octets.toString('base64') }; }));
            await p.dispatchEvent(selecteur, 'drop', { dataTransfer: dt });
        }
        async function enregistrer(p, nom) {
            await p.evaluate(function () { document.getElementById('resultat').textContent = ''; });
            await p.fill('#nom', nom);
            await p.click('#btnEnregistrer');
            await p.waitForFunction(function () { return !document.getElementById('btnEnregistrer').disabled && document.getElementById('resultat').textContent; }, null, { timeout: 15000 });
            return p.evaluate(function () { return { resultat: document.getElementById('resultat').textContent, nom: document.getElementById('nom').value }; });
        }
        var pleines = function (p) { return p.evaluate(function () { return document.querySelectorAll('#planche .case.pleine').length; }); };
        var huit = COULEURS.map(function (c, i) { return { nom: 'visage_' + (i + 1) + '_' + NOMS_COULEURS[i] + '.png', octets: visage(i) }; });

        // ── ① depuis l'accueil ─────────────────────────────────────────────
        console.log('① La page s\'ouvre depuis l\'accueil du Studio');
        await page.goto(BASE + '/', { waitUntil: 'load' });
        await page.click('a[href="/planche"]');
        await page.waitForURL('**/planche');
        await page.waitForSelector('#planche .case');
        var entete = await page.evaluate(function () { return { h1: document.querySelector('h1').textContent, cases: document.querySelectorAll('#planche .case').length }; });
        V('le lien de l\'accueil mène à la planche', /Planche d'expressions/.test(entete.h1), entete.h1);
        V('la planche a 8 cases vides', entete.cases === 8 && (await pleines(page)) === 0, entete.cases + ' cases');
        await page.waitForFunction(function () { return /RPG Maker/.test(document.getElementById('etatEditeur').textContent); });
        V('la pastille dit RPG Maker fermé', /fermé/.test(await page.textContent('#etatEditeur')), await page.textContent('#etatEditeur'));

        // ── ② une image de la mauvaise taille ──────────────────────────────
        console.log('\n② Une image de 100×100');
        var petite = encoderPNG(100, 100, function () { return [10, 200, 10, 255]; });
        await deposer(page, '#planche .case[data-case="0"]', [{ nom: 'petite.png', octets: petite }]);
        await page.waitForFunction(function () { return document.querySelector('#refus li, #planche .case.pleine'); }, null, { timeout: 10000 });
        var refus = await page.textContent('#refus');
        V('refusée, avec sa taille et celle qu\'il faut', /100 × 100/.test(refus) && /144 × 144/.test(refus) && /pas redimensionné/.test(refus), refus);
        V('rien n\'est placé', (await pleines(page)) === 0);

        // ── ③ huit visages, enregistrés, relus ─────────────────────────────
        console.log('\n③ Huit visages, déposés dans le désordre, enregistrés et relus');
        await deposer(page, '#planche', huit.slice().reverse());
        await page.waitForFunction(function () { return document.querySelectorAll('#planche .case.pleine').length === 8; }, null, { timeout: 10000 });
        var ordreEcran = await page.evaluate(function () { return Array.prototype.map.call(document.querySelectorAll('#planche .case img'), function (i) { return i.alt; }); });
        V('les huit sont placés, rangés par nom', ordreEcran.join() === huit.map(function (f) { return f.nom; }).join(), ordreEcran.map(function (n) { return n.replace(/^visage_\d_|\.png$/g, ''); }).join(' · '));
        var r = await enregistrer(page, NOM_A);
        var fA = path.join(FACES, NOM_A + '.png');
        V('« Enregistrer » écrit le fichier dans img/faces', /✅/.test(r.resultat) && fs.existsSync(fA), r.resultat);
        if (fs.existsSync(fA)) {
            var a = decoderPNG(fs.readFileSync(fA));
            V('la planche fait 576 × 288', a.largeur === 576 && a.hauteur === 288, a.largeur + ' × ' + a.hauteur);
            var centres = [], tout = true, detail = [];
            for (var k = 0; k < 8; k++) {
                var m = mesurerCase(a, k, k);
                centres.push(m.centre.slice(0, 3).join(',') === COULEURS[k].join(',') && m.centre[3] === 255);
                if (m.faux) { tout = false; detail.push('case ' + k + ' : ' + m.faux + ' pixels faux, ' + m.premier); }
                if (k === SEMI.case) var semi = m;
            }
            V('le centre de chaque case a sa couleur, dans l\'ordre', centres.every(Boolean), centres.map(function (b, i) { return (b ? '' : '✗') + NOMS_COULEURS[i]; }).join(' · '));
            V('chaque case est entièrement de sa couleur (144 × 144 pixels, aucun débord)', tout, detail.join(' | ') || '8 × 20 736 pixels');
            V('le bord semi-transparent garde sa transparence (alpha 128, couleur à ±2)', semi.alphaSemiFaux === 0 && semi.ecartSemi <= 2, 'écart de couleur max ' + semi.ecartSemi + ', alpha faux ' + semi.alphaSemiFaux);
        }

        // ── ④ jamais par-dessus ────────────────────────────────────────────
        console.log('\n④ Jamais par-dessus un fichier');
        var hA = empreinte(fA);
        r = await enregistrer(page, NOM_A);
        V('le même nom une 2e fois : refusé', /existe déjà/.test(r.resultat), r.resultat);
        V('…le fichier n\'a pas bougé', empreinte(fA) === hA);
        V('…un autre nom est proposé dans la case, sans rien écrire', r.nom === NOM_A + '_2' && !fs.existsSync(path.join(FACES, NOM_A + '_2.png')), r.nom);
        // un visage que le Studio n'a pas écrit — un leurre posé par le banc, pas un
        // visage de JOKO : si le serveur régressait, c'est le leurre qu'il écraserait
        var fL = path.join(FACES, NOM_LEURRE + '.png');
        fs.writeFileSync(fL, encoderPNG(144, 144, function () { return [1, 2, 3, 255]; }), { flag: 'wx' });
        var hL = empreinte(fL), tL = fs.statSync(fL).mtimeMs;
        r = await enregistrer(page, NOM_LEURRE);
        V('un visage déjà là, que le Studio n\'a pas écrit : refusé', /existe déjà/.test(r.resultat), r.resultat);
        r = await enregistrer(page, NOM_LEURRE.toUpperCase());
        V('…le même nom en MAJUSCULES : refusé aussi', /existe déjà/.test(r.resultat), r.resultat);
        V('…son fichier n\'a pas bougé (contenu et date)', empreinte(fL) === hL && fs.statSync(fL).mtimeMs === tL);

        // ── ⑤ glisser une case, en vider une ───────────────────────────────
        console.log('\n⑤ Échanger deux cases, en vider une');
        await page.dragAndDrop('#planche .case[data-case="0"]', '#planche .case[data-case="7"]');
        await page.hover('#planche .case[data-case="3"]');
        await page.click('#planche .case[data-case="3"] .vider');
        var ecran = await page.evaluate(function () { return Array.prototype.map.call(document.querySelectorAll('#planche .case'), function (c) { var i = c.querySelector('img'); return i ? i.alt : ''; }); });
        V('à l\'écran : la case 1 et la case 8 échangées, la case 4 vide', ecran[0] === huit[7].nom && ecran[7] === huit[0].nom && ecran[3] === '' && (await pleines(page)) === 7, ecran.map(function (n) { return n ? n.replace(/^visage_\d_|\.png$/g, '') : '—'; }).join(' · '));
        r = await enregistrer(page, NOM_B);
        var fB = path.join(FACES, NOM_B + '.png');
        V('enregistrée sous un autre nom', /✅/.test(r.resultat) && fs.existsSync(fB), r.resultat);
        if (fs.existsSync(fB)) {
            var b = decoderPNG(fs.readFileSync(fB)), attendu = [7, 1, 2, null, 4, 5, 6, 0], fauxB = [];
            attendu.forEach(function (c, k) { var m = mesurerCase(b, k, c); if (m.faux) fauxB.push('case ' + k + ' : ' + m.faux + ' pixels faux, ' + m.premier); });
            V('relue : rose en case 0, rouge en case 7, case 3 entièrement transparente, le reste en place', fauxB.length === 0, fauxB.join(' | ') || 'rose · orange · jaune · (vide) · cyan · bleu · violet · rouge');
        }

        // ── ⑥ RPG Maker ouvert ─────────────────────────────────────────────
        console.log('\n⑥ RPG Maker ouvert');
        if (process.platform === 'win32') {
            serveurs.push(await lancerStudio(PORT_OUVERT, 'node.exe'));
            var page2 = await nav.newPage({ viewport: { width: 1200, height: 860 } });
            page2.on('pageerror', function (e) { erreurs.push(e.message.slice(0, 200)); });
            await page2.goto('http://127.0.0.1:' + PORT_OUVERT + '/planche', { waitUntil: 'load' });
            await page2.waitForFunction(function () { return /RPG Maker/.test(document.getElementById('etatEditeur').textContent); });
            V('la pastille le signale', /ouvert/.test(await page2.textContent('#etatEditeur')), await page2.textContent('#etatEditeur'));
            await deposer(page2, '#planche', huit);
            await page2.waitForFunction(function () { return document.querySelectorAll('#planche .case.pleine').length === 8; }, null, { timeout: 10000 });
            r = await enregistrer(page2, NOM_C);
            V('« Enregistrer » est refusé', /RPG Maker est ouvert/.test(r.resultat), r.resultat);
            V('…et rien n\'est écrit', !fs.existsSync(path.join(FACES, NOM_C + '.png')));
            await page2.close();
        } else console.log('   (pas sous Windows : le contrôle de RPG Maker ne s\'applique pas)');

        // ── ⑦ le serveur vérifie lui-même ──────────────────────────────────
        console.log('\n⑦ Le serveur ne croit pas la page sur parole');
        async function poster(corps) {
            var rep = await fetch(BASE + '/api/planche', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps) });
            return { statut: rep.status, j: await rep.json() };
        }
        var url = function (buf) { return 'data:image/png;base64,' + buf.toString('base64'); };
        var bonne = encoderPNG(576, 288, function () { return [0, 0, 0, 0]; });
        var p1 = await poster({ nom: ETIQUETTE + '_petite', png: url(petite) });
        V('un PNG de 100 × 100 envoyé comme planche : refusé', p1.statut === 400 && /100 × 100/.test(p1.j.erreur) && !fs.existsSync(path.join(FACES, ETIQUETTE + '_petite.png')), p1.statut + ' ' + p1.j.erreur);
        var p2 = await poster({ nom: ETIQUETTE + '_texte', png: 'data:image/png;base64,' + Buffer.from('pas une image').toString('base64') });
        V('autre chose qu\'un PNG : refusé', p2.statut === 400 && !fs.existsSync(path.join(FACES, ETIQUETTE + '_texte.png')), p2.statut + ' ' + p2.j.erreur);
        var p3 = await poster({ nom: '../' + ETIQUETTE + '_evasion', png: url(bonne) });
        V('un nom qui sort de img/faces : refusé', p3.statut === 400 && !fs.existsSync(path.join(RACINE, 'img', ETIQUETTE + '_evasion.png')), p3.statut + ' ' + p3.j.erreur);

        V('aucune erreur JavaScript dans la page', erreurs.length === 0, erreurs.slice(0, 3).join(' | ') || 'rien');
    } catch (e) {
        ko++; console.log('   ✗ le banc s\'est arrêté : ' + (e && e.stack || e));
    } finally {
        if (nav) await nav.close().catch(function () {});
        serveurs.forEach(function (p) { p.removeAllListeners('exit'); p.kill(); });
        // le ménage : seulement les fichiers que ce banc a pu écrire
        var effaces = [];
        ecrits.concat([NOM_LEURRE, NOM_LEURRE.toUpperCase(), ETIQUETTE + '_petite', ETIQUETTE + '_texte']).forEach(function (n) {
            var f = path.join(FACES, n + '.png');
            if (fs.existsSync(f)) { fs.unlinkSync(f); effaces.push(n + '.png'); }
        });
        console.log('\nMénage');
        V('img/faces est exactement comme avant le banc', listeFaces() === avant, effaces.length + ' fichier(s) d\'essai effacé(s)');
    }
    console.log('\n  ' + ok + ' contrôles passés · ' + ko + ' échec(s)' + (ko ? '' : '\n  ✅ TOUT PASSE'));
    process.exit(ko ? 1 : 0);
})();
