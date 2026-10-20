/*
 * BANC NAVIGATEUR — LE MOUVEMENT (LeMouvement.js, 2026-10-20)
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-10-20 : « Mana sombre, c'est plus corporel, mouvement,
 * fluidité, et maîtrise » ; « D'abord, fais les mouvements, finis le rework
 * mouvement » ; et, après avoir joué : « j'ai rien senti de différence ».
 *
 * Ce banc vérifie, dans le vrai moteur et dans les deux sens :
 *   1. les réglages et les 9 états de posture (une icône chacun) ;
 *   2. qui fait un mouvement : la technique de Voie, l'Attaque — pas une Parole,
 *      pas une technique de l'âme, pas l'ordre à seiryu, pas un ennemi ;
 *   3. le flux sur une vraie chaîne de Korrah : posture, ×1,15 en changeant de
 *      Voie, LE GESTE JUSTE ×1,5 au 3, ×0,85 et flux à 0 sur la même technique,
 *      rien qui bouge sur une autre technique de la même Voie ;
 *   4. à l'écran : l'icône de posture passe en tête, le flux en chiffre,
 *      chaque pas s'annonce au-dessus d'elle ;
 *   5. le geste faux : un coup de 20 % des PV brise (pas un de 5 %), un état
 *      qui immobilise brise (pas un autre), une Parole arrête le corps, la Garde non ;
 *   6. en premier : dans le flux, son mouvement passe devant un ennemi plus
 *      rapide — pas sans flux, pas avec une Parole ;
 *   7. un vrai combat laissé tourner : Korrah enchaîne, le geste juste sort,
 *      elle joue en premier dès qu'elle est dans le flux.
 *
 *   node <scratchpad>/serveur_bancs.js . 8899   (ou npx http-server -p 8899 -c-1 .)
 *   node bancs/navigateur/le_mouvement.js
 */

var { chromium } = require('playwright');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';

(async function () {
    var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
    var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
    var err = [];
    page.on('pageerror', function (e) { err.push(e.message.split('\n')[0]); });
    page.on('console', function (m) { if (m.type() === 'error' && !/Failed to load|net::ERR/.test(m.text())) { err.push('CONSOLE ' + m.text().slice(0, 150)); } });
    var ok = 0, ko = 0;
    var v = function (t, c, d) { if (c) { ok++; console.log('   OK  ' + t + (d ? '  — ' + d : '')); } else { ko++; console.log('   KO  ' + t + (d ? '  — ' + d : '')); } };

    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen(); }, null, { timeout: 180000 });
    await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
    await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);

    async function ouvrirCombat() {
        await page.evaluate(function () {
            $gameParty.members().forEach(function (a) { a.recoverAll(); });
            BattleManager.setup(1, true, true); SceneManager.push(Scene_Battle);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(2500);
    }
    async function fermerCombat() {
        await page.evaluate(function () {
            delete SceneManager._scene.update;
            BattleManager.endBattle(2); $gameParty.onBattleEnd(); $gameTroop.onBattleEnd();
            SceneManager.goto(Scene_Map);
        });
        await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
        await page.waitForTimeout(800);
    }

    console.log('=== LE MOUVEMENT ===\n');
    await ouvrirCombat();
    var r = await page.evaluate(function () {
        SceneManager._scene.update = function () { };
        BattleManager._phase = 'turn';
        var out = {}, M = LeMouvement;
        var k = $gameActors.actor(2), e = $gameTroop.members()[0];
        e.addParam(0, 9999999); e.recoverAll();
        Math.random = function () { return 0.5; };

        // un geste joué par le vrai chemin : startAction (le flux décide) → apply → endAction (la posture se pose)
        function geste(h, id, cible) {
            var act = new Game_Action(h); act.setSkill(id);
            act.setTarget(cible.isEnemy() ? cible.index() : $gameParty.members().indexOf(cible));
            h._actions = [act]; h.setMp(h.mmp); h.setTp(100);
            $gameSystem._voieMastery = {};
            BattleManager._subject = h;
            BattleManager.startAction();
            cible.clearResult(); cible.recoverAll(); act.apply(cible);
            var dmg = cible.result().hpDamage;
            BattleManager.endAction();
            BattleManager._subject = null;
            var id2 = M.postures[M.posture(h)];
            return { dmg: dmg, mult: act._mvtMult || 1, posture: M.posture(h), flux: M.flux(h),
                     etat: id2 ? h.isStateAffected(id2) : false, compteur: id2 ? h.getStateCounter(id2) : undefined,
                     annonces: (h._ctAnnonces || []).map(function (a) { return a.texte; }) };
        }
        function remettre(h) { h._mvtVoie = ''; h._mvtFlux = 0; h._mvtDernier = 0; Object.keys(M.postures).forEach(function (x) { h.eraseState(M.postures[x]); h.removeStateCounter(M.postures[x]); }); h._ctAnnonces = []; }
        function action(h, id) { var a = new Game_Action(h); a.setSkill(id); a.setTarget(0); return a; }

        // 1 · réglages
        out.reglages = $plugins.filter(function (p) { return p.name === 'LeMouvement'; })[0];
        out.etats = Object.keys(M.postures).map(function (x) { var s = $dataStates[M.postures[x]]; return [x, s.name, s.iconIndex, s.priority]; });

        // 2 · qui fait un mouvement
        var parole = k.skills().filter(function (s) { return LaParole.estParole(s); })[0];
        out.qui = {
            pasDeCote: M.voie(action(k, 1106)), attaque: M.voie(action(k, 1)), parole: M.voie(action(k, parole.id)), paroleNom: parole.name,
            ame: M.voie(action(k, 452)), avatar: M.voie(action(k, 1250)), ennemi: M.voie((function () { var a = new Game_Action(e); a.setSkill(1); return a; })())
        };

        // 3 · une chaîne de Korrah
        remettre(k);
        var c = {};
        c.a = geste(k, 1106, e);                       // Pas de Côté — éclair : la posture
        c.b = geste(k, 1098, e);                       // Traverser — vide : flux 1
        c.c = geste(k, 1122, e);                       // Éclat Bref — flash : flux 2
        c.d = geste(k, 1106, e);                       // Pas de Côté — éclair : flux 3 → geste juste
        c.e = geste(k, 1106, e);                       // la même technique : ×0,85
        c.f = geste(k, 1107, e);                       // Trait Foudroyant — éclair, autre technique : rien ne bouge
        remettre(k); var base = geste(k, 1098, e).dmg;  // Traverser sans flux : la base
        remettre(k); k._mvtVoie = 'onde'; k._mvtDernier = 1; var enchaine = geste(k, 1098, e).dmg;
        remettre(k); k._mvtVoie = 'onde'; k._mvtFlux = 2; k._mvtDernier = 1; var juste = geste(k, 1098, e).dmg;
        out.chaine = c; out.ratios = { enchaine: enchaine / base, juste: juste / base, base: base };

        // 4 · à l'écran : l'icône de posture en tête
        remettre(k); geste(k, 1106, e); geste(k, 1098, e);
        out.icones = { premiere: k.allIcons()[0], attendue: $dataStates[M.postures.vide].iconIndex, compteur: k.getStateCounter(M.postures.vide) };

        // 5 · le geste faux
        var f = {};
        remettre(k); geste(k, 1106, e); geste(k, 1098, e);
        k.onDamage(Math.floor(k.mhp * 0.05)); f.petit = [M.posture(k), M.flux(k)];
        k.onDamage(Math.ceil(k.mhp * 0.20)); f.gros = [M.posture(k), M.flux(k), k.isStateAffected(M.postures.vide)];
        f.annonceGros = (k._ctAnnonces || []).map(function (a) { return a.texte; }).filter(function (t) { return /Geste faux/.test(t); });
        remettre(k); geste(k, 1106, e); geste(k, 1098, e);
        k.addState(10); f.autreEtat = [M.posture(k), M.flux(k)]; k.removeState(10);
        k.addState(1005); f.immobile = [M.posture(k), M.flux(k)]; k.removeState(1005);
        remettre(k); geste(k, 1106, e); geste(k, 1098, e);
        geste(k, 2, k); f.garde = [M.posture(k), M.flux(k)];
        geste(k, 1250, e); f.avatar = [M.posture(k), M.flux(k)];   // un ordre à seiryu : c'est lui qui bouge
        geste(k, parole.id, e); f.parole = [M.posture(k), M.flux(k), k.isStateAffected(M.postures.vide)];
        out.faux = f;

        // 6 · en premier
        var o = {};
        // l'ennemi A se met en Garde (vitesse +2000) : il passe naturellement devant tout le monde ;
        // les autres attaquent (vitesse = AGI). L'AGI d'un ennemi plafonne à 999 : on ne peut pas la gonfler.
        function ordre(act) {
            k._actions = [act];
            $gameParty.battleMembers().forEach(function (a) { if (a !== k) { var x = new Game_Action(a); x.setSkill(1); x.setTarget(0); a._actions = [x]; } });
            $gameTroop.members().forEach(function (x, i) { var a = new Game_Action(x); a.setSkill(i === 0 ? 2 : 1); x._actions = [a]; });
            BattleManager.makeActionOrders();
            return BattleManager._actionBattlers.map(function (b) { return b.name(); });
        }
        remettre(k); k._mvtVoie = 'eclair'; k._mvtFlux = 1;
        o.flux = ordre(action(k, 1098));
        remettre(k); k._mvtVoie = 'eclair'; k._mvtFlux = 0;
        o.sansFlux = ordre(action(k, 1098));
        remettre(k); k._mvtVoie = 'eclair'; k._mvtFlux = 2;
        o.parole = ordre(action(k, parole.id));
        out.ordre = o; out.ennemiNom = e.name();

        // 2 bis · un ennemi ne prend pas de posture
        var ea = new Game_Action(e); ea.setSkill(1); ea.setTarget(0); e._actions = [ea];
        BattleManager._subject = e; BattleManager.startAction(); BattleManager.endAction(); BattleManager._subject = null;
        out.ennemiPosture = [M.posture(e), Object.keys(M.postures).some(function (x) { return e.isStateAffected(M.postures[x]); })];
        remettre(k);
        return out;
    });

    console.log('1) Les réglages et les postures');
    v('LeMouvement est actif, le geste juste au flux 3', r.reglages && r.reglages.status && r.reglages.parameters.fluxGeste === '3');
    v('9 états de posture, une icône chacun, priorité 98', r.etats.length === 9 && r.etats.every(function (x) { return x[2] > 0 && x[3] === 98 && /Posture/.test(x[1]); }),
      r.etats.map(function (x) { return x[0] + ' ' + x[2]; }).join(', '));

    console.log('\n2) Qui fait un mouvement');
    v('Pas de Côté (Voie écrite) : un mouvement d\'Éclair', r.qui.pasDeCote === 'eclair');
    v('l\'Attaque de Korrah : un mouvement dans sa Voie (Flash)', r.qui.attaque === 'flash');
    v('contre-épreuve : pas une Parole (' + r.qui.paroleNom + '), pas l\'âme (Onde Concentrée), pas l\'ordre à seiryu, pas un ennemi',
      r.qui.parole === '' && r.qui.ame === '' && r.qui.avatar === '' && r.qui.ennemi === '', JSON.stringify(r.qui));
    v('un ennemi qui agit ne prend pas de posture', r.ennemiPosture[0] === '' && !r.ennemiPosture[1]);

    console.log('\n3) Le flux, sur une chaîne de Korrah');
    var c = r.chaine;
    v('Pas de Côté : la posture de l\'Éclair, flux 0, ×1', c.a.posture === 'eclair' && c.a.flux === 0 && c.a.mult === 1 && c.a.etat, JSON.stringify([c.a.posture, c.a.flux, c.a.mult]));
    v('Traverser (Vide) : flux 1, ×1,15', c.b.posture === 'vide' && c.b.flux === 1 && c.b.mult === 1.15 && c.b.compteur === 1, JSON.stringify([c.b.posture, c.b.flux, c.b.mult, c.b.compteur]));
    v('Éclat Bref (Flash) : flux 2, ×1,15', c.c.posture === 'flash' && c.c.flux === 2 && c.c.mult === 1.15 && c.c.compteur === 2);
    v('Pas de Côté (Éclair) au flux 3 : LE GESTE JUSTE ×1,5, puis flux 0', c.d.mult === 1.5 && c.d.flux === 0 && c.d.posture === 'eclair', JSON.stringify([c.d.posture, c.d.flux, c.d.mult]));
    v('la même technique deux fois : ×0,85 et flux 0', c.e.mult === 0.85 && c.e.flux === 0);
    v('une autre technique de la même Voie : ×1, rien ne bouge', c.f.mult === 1 && c.f.flux === 0 && c.f.posture === 'eclair');
    v('les dégâts suivent : ×1,15 en enchaînant, ×1,5 au geste juste',
      Math.abs(r.ratios.enchaine - 1.15) < 0.01 && Math.abs(r.ratios.juste - 1.5) < 0.01,
      'base ' + r.ratios.base + ' · ×' + r.ratios.enchaine.toFixed(3) + ' · ×' + r.ratios.juste.toFixed(3));

    console.log('\n4) À l\'écran');
    v('l\'icône de posture passe en tête de ses icônes', r.icones.premiere === r.icones.attendue, r.icones.premiere + ' / ' + r.icones.attendue);
    v('le flux s\'y lit en chiffre', r.icones.compteur === 1, String(r.icones.compteur));
    var tout = [].concat(c.a.annonces, c.b.annonces, c.d.annonces, c.e.annonces);
    v('chaque pas s\'annonce au-dessus d\'elle (posture, flux, geste juste, répété)',
      tout.some(function (t) { return /Posture : Éclair/.test(t); }) && tout.some(function (t) { return /Vide · flux 1/.test(t); }) &&
      tout.some(function (t) { return /GESTE JUSTE/.test(t); }) && tout.some(function (t) { return /Répété ×0,85/.test(t); }), tout.slice(-4).join(' | '));

    console.log('\n5) Le geste faux');
    var f = r.faux;
    v('un coup de 5 % des PV : le flux tient', f.petit[0] === 'vide' && f.petit[1] === 1, JSON.stringify(f.petit));
    v('un coup de 20 % des PV : flux et posture brisés, et ça se voit', f.gros[0] === '' && f.gros[1] === 0 && !f.gros[2] && f.annonceGros.length > 0, JSON.stringify(f.gros) + ' ' + f.annonceGros.join(''));
    v('un état qui n\'immobilise pas : rien', f.autreEtat[0] === 'vide' && f.autreEtat[1] === 1);
    v('💥 Brisé (immobilise) : le flux se brise', f.immobile[0] === '' && f.immobile[1] === 0);
    v('la Garde garde la posture et le flux', f.garde[0] === 'vide' && f.garde[1] === 1, JSON.stringify(f.garde));
    v('un ordre à seiryu (Saisie de l\'Armure) aussi : c\'est lui qui bouge', f.avatar[0] === 'vide' && f.avatar[1] === 1, JSON.stringify(f.avatar));
    v('une Parole arrête le corps : plus de posture', f.parole[0] === '' && !f.parole[2], JSON.stringify(f.parole));

    console.log('\n6) En premier');
    v('dans le flux, son mouvement passe devant un ennemi en Garde (+2000 de vitesse)', r.ordre.flux[0] === 'Korrah' && r.ordre.flux[1] === r.ennemiNom, r.ordre.flux.join(' > '));
    v('contre-épreuve : sans flux, l\'ennemi en Garde passe devant elle', r.ordre.sansFlux[0] === r.ennemiNom && r.ordre.sansFlux[0] !== 'Korrah', r.ordre.sansFlux.join(' > '));
    v('contre-épreuve : dans le flux mais avec une Parole, elle ne passe pas devant', r.ordre.parole[0] === r.ennemiNom, r.ordre.parole.join(' > '));
    await fermerCombat();

    // ── 7 · un vrai combat ─────────────────────────────────────────────
    console.log('\n7) Un vrai combat laissé tourner');
    await page.evaluate(function () {
        Math.random = window.__alea || Math.random;
        Game_Actor.prototype.isAutoBattle = function () { return true; };
        var mk = Game_Actor.prototype.makeAutoBattleActions, CH = [1106, 1098, 1122, 1106, 1098];
        Game_Actor.prototype.makeAutoBattleActions = function () {
            this.clearActions();
            var act = new Game_Action(this);
            if (this.actorId() === 2) { var n = window.__n = (window.__n || 0); act.setSkill(CH[n % CH.length]); act.setTarget(0); window.__n++; }
            else { act.setGuard(); }
            this.setAction(0, act);
        };
        window.__ordre = []; window.__vus = [];
        var sa = BattleManager.startAction;
        BattleManager.startAction = function () {
            var s = this._subject;
            if (s) { window.__ordre.push({ tour: $gameTroop.turnCount(), qui: s.name(), flux: s._mvtFlux || 0 }); }
            return sa.apply(this, arguments);
        };
        var an = CombatTactique.annoncer;
        CombatTactique.annoncer = function (b, t) { if (b && b.actorId && b.actorId() === 2) { window.__vus.push(t); } return an.apply(this, arguments); };
    });
    await ouvrirCombat();
    await page.evaluate(function () {
        $gameTroop.members().forEach(function (e) { e.addParam(0, 9999999); e.recoverAll(); e.addParam(2, -e.atk + 1); e.addParam(4, -e.mat + 1); });
        $gameParty.members().forEach(function (a) { a.addParam(0, 9999999); a.recoverAll(); a.setMp(a.mmp); a.setTp(100); });
    });
    try {
        await page.waitForFunction(function () { return (window.__n || 0) >= 5 && $gameTroop.turnCount() >= 5; }, null, { timeout: 300000, polling: 300 });
    } catch (x) { }
    var vrai = await page.evaluate(function () {
        var k = $gameActors.actor(2);
        return { ordre: window.__ordre, vus: window.__vus, n: window.__n, posture: LeMouvement.posture(k),
                 icone: k.allIcons()[0], tour: $gameTroop.turnCount() };
    });
    var parTour = {};
    vrai.ordre.forEach(function (o) { (parTour[o.tour] = parTour[o.tour] || []).push(o); });
    var premiers = Object.keys(parTour).filter(function (t) {
        var l = parTour[t], i = l.map(function (o) { return o.qui; }).indexOf('Korrah');
        return i >= 0 && l[i].flux >= 1;
    }).map(function (t) { return parTour[t][0].qui === 'Korrah'; });
    v('le combat a tourné (' + vrai.n + ' gestes de Korrah, tour ' + vrai.tour + ')', vrai.n >= 5);
    v('le geste juste est sorti, et s\'est annoncé', vrai.vus.some(function (t) { return /GESTE JUSTE/.test(t); }), vrai.vus.slice(0, 6).join(' | '));
    v('dans le flux, elle a joué la première, devant ses alliés en Garde (+2000 de vitesse)', premiers.length > 0 && premiers.every(Boolean),
      premiers.length + ' tour(s) dans le flux, tous en tête : ' + premiers.join(','));
    v('à la fin, une posture sur elle, et son icône en tête', !!vrai.posture && vrai.icone === $dataStatesIcone(vrai.posture), vrai.posture + ' · icône ' + vrai.icone);
    function $dataStatesIcone(p) { return { forge: 223, onde: 67, source: 84, miroir: 222, vide: 161, eclair: 126, domaine: 207, flash: 127, sang: 86 }[p]; }
    await fermerCombat();

    v('aucune erreur dans la page', err.length === 0, err.slice(0, 3).join(' · '));
    console.log('\n' + (ko === 0 ? '✅ TOUT PASSE' : '❌ ' + ko + ' ÉCHEC(S)') + ' — ' + ok + ' contrôles passés');
    await nav.close();
    process.exit(ko === 0 ? 0 : 1);
})().catch(function (x) { console.error(x); process.exit(1); });
