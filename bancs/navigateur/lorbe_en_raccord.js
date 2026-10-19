/*
 * BANC NAVIGATEUR — L'ORBE MONTRE CE QUE LE HÉROS A VRAIMENT
 * ---------------------------------------------------------------------------
 * JOKO : « les orbes des compétences ne sont pas en raccord avec les
 * personnages comme compétences ils ont. […] Korrah a hiver et avatar. En soi,
 * hiver, c'est pour toutes les compétences de glace, parce que je voulais tout
 * réunir au même endroit. »
 *
 * Mesuré avant la passe :
 *   · Korrah : 13 compétences d'Avatar absentes de l'Orbe, et AUCUNE compétence
 *     dans son type « hiver » — ses 16 compétences de glace étaient éparpillées
 *     dans capacité, Spéciale, ult, avatar, et une dans le type 0 (invisible) ;
 *   · Aël : l'Orbe lui prêtait 39 compétences « Miracle » (règle devinée sur
 *     les noms et le coût en PM) ; son menu de combat en montre UNE.
 *
 * Le contrôle : pour chaque héros, les branches de l'Orbe doivent être
 * exactement ses types ouverts en combat — ni plus, ni moins.
 */
'use strict';
var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var vert = 0, rouge = 0;
function ok(nom, cond, detail) {
    if (cond) { vert++; console.log('   ✓ ' + nom + (detail ? '   ' + detail : '')); }
    else { rouge++; console.log('   ✗ ' + nom + (detail ? '   ' + detail : '')); }
}

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message.split('\n')[0]); });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen(); }, null, { timeout: 180000 });
    await page.evaluate(function () { DataManager.setupNewGame(); });

    var r = await page.evaluate(function () {
        var out = [];
        [1, 2, 3, 4].forEach(function (id) {
            var a = $gameActors.actor(id);
            var combat = a.addedSkillTypes().filter(function (t, i, l) { return l.indexOf(t) === i; })
                .filter(function (t) { return a.skills().some(function (s) { return s.stypeId === t; }); })
                .map(function (t) { return $dataSystem.skillTypes[t]; }).sort();
            var orbe = OrbeDesCapacites.branchesDe(a).map(function (b) { return b.nom; }).sort();
            var glace = a.skills().filter(function (s) { return [13, 22].indexOf(s.damage.elementId) >= 0; });
            out.push({
                nom: a.name(), combat: combat, orbe: orbe,
                // les duos (type 25) restent dans « Combo » : JOKO, 2026-10-18, « menu Combo »
                glaceHorsHiver: glace.filter(function (s) { return s.stypeId !== 6 && s.stypeId !== 3 && s.stypeId !== 25 && !(s.meta && s.meta.Avatar !== undefined); })
                    .map(function (s) { return s.id + ' ' + s.name; }),
                glaceEnHiver: glace.filter(function (s) { return s.stypeId === 6; }).length,
                invisibles: a.skills().filter(function (s) { return !s.stypeId; }).map(function (s) { return s.id + ' ' + s.name; })
            });
        });
        return out;
    });

    r.forEach(function (h) {
        console.log('\n── ' + h.nom + ' ' + '─'.repeat(68 - h.nom.length));
        console.log('      combat : ' + h.combat.join(' · '));
        console.log('      orbe   : ' + h.orbe.join(' · '));
        ok('l\'Orbe montre exactement ses catégories de combat', JSON.stringify(h.combat) === JSON.stringify(h.orbe));
        ok('aucune compétence sans type (invisible partout)', h.invisibles.length === 0, h.invisibles.join(' | '));
    });
    var k = r.filter(function (h) { return h.nom === 'Korrah'; })[0];
    console.log('\n── L\'HIVER DE KORRAH ' + '─'.repeat(53));
    ok('Korrah a une branche Hiver', k.combat.indexOf('hiver') >= 0 && k.orbe.indexOf('hiver') >= 0);
    ok('et une branche Avatar', k.combat.indexOf('avatar') >= 0 && k.orbe.indexOf('avatar') >= 0);
    ok('toutes ses compétences de glace y sont (hors ultime et ordres d\'Avatar)', k.glaceHorsHiver.length === 0,
        k.glaceEnHiver + ' dans Hiver' + (k.glaceHorsHiver.length ? ' · dehors : ' + k.glaceHorsHiver.join(', ') : ''));
    var ael = r.filter(function (h) { return h.nom === 'Aël'; })[0];
    ok('Aël : l\'Orbe ne lui prête plus 39 « Miracle »', ael.orbe.indexOf('le Miracle') < 0);

    console.log('\n── LES ERREURS DU MOTEUR ' + '─'.repeat(48));
    ok('rien n\'a planté', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
    console.log('\n' + '═'.repeat(74) + '\n   ' + vert + ' vert · ' + rouge + ' rouge\n' + '═'.repeat(74) + '\n');
    await nav.close();
    process.exit(rouge ? 1 : 0);
})();
