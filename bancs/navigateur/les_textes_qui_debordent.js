/*
 * LES TEXTES QUI DÉBORDENT
 * ---------------------------------------------------------------------------
 * Une ligne de dialogue trop longue ne lève aucune erreur : MV la dessine
 * jusqu'au bord de la fenêtre et coupe le reste. Le joueur lit « Je t'avais
 * dit de ne pas aller dans la for » et passe à la suite. Dans l'éditeur, rien
 * ne le montre — et c'est pire avec un visage, qui mange 168 pixels.
 *
 * Ce banc mesure chaque ligne avec le VRAI moteur : la police du jeu, les
 * codes de YEP_MessageCore (\C, \N[], \I[], \{ \}…), les noms des héros tels
 * qu'ils sont au début d'une partie. Il compare la largeur dessinée à la
 * place réelle : 780 px sans visage, 612 px avec.
 *
 * Il mesure aussi les descriptions (compétences, objets, armes, armures) dans
 * la fenêtre d'aide : deux lignes, même largeur.
 *
 * Deux chiffres : les lignes plus longues que la fenêtre (ce que les données
 * demandent), puis celles qui restent COUPÉES À L'ÉCRAN — chaque message
 * concerné est dessiné par la vraie fenêtre de message, plugins actifs
 * (TexteQuiTient replie ce qui dépasse), et on regarde où tombent les
 * caractères. C'est ce second chiffre qui fait échouer le banc.
 *
 *   node bancs/navigateur/les_textes_qui_debordent.js           le résumé
 *   node bancs/navigateur/les_textes_qui_debordent.js --tout    chaque ligne
 *   node bancs/navigateur/les_textes_qui_debordent.js --sans-repli
 *        contre-épreuve : TexteQuiTient éteint, les coupures doivent revenir
 */
'use strict';
var { chromium } = require('playwright');
var fs = require('fs');
var path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var TOUT = process.argv.indexOf('--tout') >= 0;
// contre-épreuve : TexteQuiTient éteint, le banc doit retrouver les coupures
var SANS = process.argv.indexOf('--sans-repli') >= 0;
var R = path.join(__dirname, '..', '..');

var INFOS = JSON.parse(fs.readFileSync(path.join(R, 'data', 'MapInfos.json'), 'utf8'));
function estDemo(id) {   // même règle que 23_chasse_aux_bugs.js
    var i = INFOS[id]; if (!i) return true;
    return /✎|★|SALLE DE TEST|^MAP\d+$/.test(i.name) || (id >= 3 && id <= 27) || id === 66 || id === 67;
}

// Les blocs de texte du jeu : un « Afficher le texte » (101) et ses lignes (401).
var blocs = [];
function lireListe(lieu, liste) {
    for (var i = 0; i < liste.length; i++) {
        var c = liste[i];
        if (c.code !== 101) continue;
        var b = { lieu: lieu + ' ligne ' + (i + 1), visage: !!c.parameters[0], lignes: [] };
        while (liste[i + 1] && liste[i + 1].code === 401) { b.lignes.push(liste[++i].parameters[0]); }
        blocs.push(b);
    }
}
INFOS.forEach(function (inf) {
    if (!inf || estDemo(inf.id)) return;
    var f = path.join(R, 'data', 'Map' + String(inf.id).padStart(3, '0') + '.json');
    if (!fs.existsSync(f)) return;
    var m = JSON.parse(fs.readFileSync(f, 'utf8'));
    m.events.forEach(function (e) {
        if (!e) return;
        e.pages.forEach(function (p, pi) { lireListe('Carte ' + inf.id + ' « ' + inf.name + ' » év.' + e.id + ' « ' + e.name + ' » p' + (pi + 1), p.list); });
    });
});
JSON.parse(fs.readFileSync(path.join(R, 'data', 'CommonEvents.json'), 'utf8')).forEach(function (c) {
    if (c && !/^✎/.test(c.name)) lireListe('Événement commun ' + c.id + ' « ' + c.name + ' »', c.list);
});
JSON.parse(fs.readFileSync(path.join(R, 'data', 'Troops.json'), 'utf8')).forEach(function (t) {
    if (t) t.pages.forEach(function (p, i) { lireListe('Troupe ' + t.id + ' ' + t.name + ' page ' + (i + 1), p.list); });
});

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    if (SANS) await page.route('**/js/plugins.js', async function (route) {
        var rep = await route.fetch(), t = await rep.text();
        await route.fulfill({ response: rep, body: t.replace('{"name":"TexteQuiTient","status":true', '{"name":"TexteQuiTient","status":false') });
    });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active; }, null, { timeout: 120000 });
    // une partie neuve : les \N[n] valent les vrais noms des héros
    await page.evaluate(function () { DataManager.setupNewGame(); });

    var r = await page.evaluate(function (blocs) {
        var w = new Window_Message();
        SceneManager._scene.addChild(w);
        // la longueur brute se mesure SANS repli (TexteQuiTient replie déjà) :
        // la mesure de mot de YEP coupe le repli, et retire « \n<Nom> »
        function brute(t) { return w.textWidthExCheck ? w.textWidthExCheck(t) : w.textWidthEx(t); }
        var place = w.contentsWidth(), retrait = eval(Yanfly.Param.MSGFaceIndent || 'Window_Base._faceWidth + 24');
        var out = { place: place, retrait: retrait, dialogues: [], coupes: [], lignes: 0 };

        // Le symptôme : on fait DESSINER chaque message par la vraie fenêtre
        // (avec les plugins actifs, pages comprises) et on regarde si un
        // caractère a été posé au-delà du bord.
        var limite = place + 1, deborde = false;
        var _pnc = w.processNormalCharacter;
        w.processNormalCharacter = function (ts) {
            _pnc.call(this, ts);
            // ⚠ les MESURES (YEP, TexteQuiTient) dessinent sous le cadre, à
            //   y = hauteur du contenu : ce n'est pas ce que le joueur voit
            if (ts.y < this.contents.height && !this._checkWordWrapMode && ts.x > limite) deborde = true;
        };
        function dessiner(b) {
            $gameMessage.clear();
            $gameMessage.setFaceImage(b.visage ? 'Actor1' : '', 0);
            b.lignes.forEach(function (l) { $gameMessage.add(l); });
            deborde = false;
            w._textState = null; w.startMessage();
            for (var garde = 0; w._textState && garde < 400; garde++) {
                w.pause = false; w._waitCount = 0; w._showFast = true;
                w.updateMessage();
            }
            w.terminateMessage();
            return deborde;
        }

        blocs.forEach(function (b) {
            b.lignes.forEach(function (t, k) {
                out.lignes++;
                var largeur = brute(t);
                var dispo = place - (b.visage ? retrait : 0);
                if (largeur > dispo) out.dialogues.push({ lieu: b.lieu, n: k + 1, texte: t, depasse: Math.round(largeur - dispo), visage: b.visage });
            });
        });
        // seulement les blocs dont une ligne est trop longue : les autres ne peuvent pas déborder
        var vus = {};
        out.dialogues.forEach(function (d) {
            if (vus[d.lieu]) return; vus[d.lieu] = true;
            var b = blocs.filter(function (x) { return x.lieu === d.lieu; })[0];
            if (dessiner(b)) out.coupes.push(d.lieu);
        });

        // la fenêtre d'aide : on dessine chaque description et on regarde où
        // tombent les caractères (à droite du bord, ou sous la dernière ligne)
        var h = new Window_Help(2), placeAide = h.contentsWidth(), hautAide = h.contentsHeight();
        var maxX = 0, maxY = 0;
        var _pncH = h.processNormalCharacter;
        h.processNormalCharacter = function (ts) {
            _pncH.call(this, ts);
            if (this._checkWordWrapMode || ts.y >= this.contents.height + this.lineHeight()) return;   // une mesure, pas un tracé
            maxX = Math.max(maxX, ts.x); maxY = Math.max(maxY, ts.y + ts.height);
        };
        out.aide = []; out.aideEcran = []; out.descriptions = 0;
        [['Compétence', $dataSkills], ['Objet', $dataItems], ['Arme', $dataWeapons], ['Armure', $dataArmors]].forEach(function (g) {
            g[1].forEach(function (o) {
                if (!o || !o.name || !o.description) return;
                out.descriptions++;
                var lignes = String(o.description).split('\n');
                var trop = lignes.map(function (l) { return Math.round(h.textWidthEx(l) - placeAide); }).filter(function (d) { return d > 0; });
                var lieu = g[0] + ' ' + o.id + ' ' + o.name;
                if (trop.length || lignes.length > 2)
                    out.aide.push({ lieu: lieu, depasse: trop.length ? Math.max.apply(null, trop) : 0, lignes: lignes.length });
                maxX = 0; maxY = 0;
                h.setText(''); h.setText(o.description);
                if (maxX > placeAide + 1 || maxY > hautAide + 1)
                    out.aideEcran.push({ lieu: lieu, x: Math.round(maxX - placeAide), y: Math.round(maxY - hautAide) });
            });
        });
        out.placeAide = placeAide;
        return out;
    }, blocs);
    await nav.close();

    console.log('═'.repeat(76));
    console.log('  LES TEXTES QUI DÉBORDENT');
    console.log('═'.repeat(76));
    console.log('  place pour une ligne : ' + r.place + ' px, ' + (r.place - r.retrait) + ' px avec un visage');
    console.log('  ' + r.lignes + ' lignes de dialogue mesurées dans le jeu (ateliers et démos à part)');
    console.log('  → ' + r.dialogues.length + ' sont plus longues que la fenêtre');
    console.log('  → ' + r.coupes.length + ' messages restent coupés à l\'écran, dessinés par la vraie fenêtre ' + (SANS ? 'SANS TexteQuiTient (contre-épreuve)' : 'avec les plugins actifs'));
    r.coupes.forEach(function (c) { console.log('      ✗ ' + c); });
    var parLieu = {};
    r.dialogues.forEach(function (d) { var k = d.lieu.replace(/ év\..*| ligne.*/, ''); parLieu[k] = (parLieu[k] || 0) + 1; });
    Object.keys(parLieu).sort(function (a, b) { return parLieu[b] - parLieu[a]; }).forEach(function (k) { console.log('      ' + String(parLieu[k]).padStart(4) + '  ' + k); });
    r.dialogues.sort(function (a, b) { return b.depasse - a.depasse; });
    console.log('\n  les lignes les plus longues :');
    r.dialogues.slice(0, TOUT ? r.dialogues.length : 12).forEach(function (d) {
        console.log('    +' + String(d.depasse).padStart(3) + ' px' + (d.visage ? ' (visage)' : '         ') + '  ' + d.lieu + ' (l.' + d.n + ')');
        console.log('              « ' + d.texte.slice(0, 110) + ' »');
    });
    console.log('\n  ' + r.descriptions + ' descriptions dans la fenêtre d\'aide (' + r.placeAide + ' px, 2 lignes)');
    console.log('  → ' + r.aide.length + ' sont trop longues pour 2 lignes de cette largeur');
    console.log('  → ' + r.aideEcran.length + ' restent coupées à l\'écran');
    r.aideEcran.slice(0, 20).forEach(function (d) { console.log('      ✗ ' + d.lieu + (d.x > 0 ? ' (+' + d.x + ' px à droite)' : '') + (d.y > 0 ? ' (+' + d.y + ' px en bas)' : '')); });
    console.log('\n  les descriptions les plus longues :');
    r.aide.sort(function (a, b) { return b.depasse - a.depasse; }).slice(0, TOUT ? r.aide.length : 12).forEach(function (d) {
        console.log('    ' + (d.depasse ? '+' + d.depasse + ' px' : '') + (d.lignes > 2 ? ' ' + d.lignes + ' lignes' : '') + '  ' + d.lieu);
    });
    console.log('═'.repeat(76));
    process.exit(r.coupes.length || r.aideEcran.length ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
