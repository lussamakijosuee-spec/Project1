/*
 * BANC NAVIGATEUR — LES BOSS, JOUÉS DANS LE MOTEUR
 * ---------------------------------------------------------------------------
 * JOKO, le 2026-09-26 : « améliore les plugins de boss. Vraiment améliorer au
 * maximum. »
 *
 * Ce banc joue, dans le vrai moteur, avec les vrais greffons :
 *   · la RUPTURE : briser l'élan annule la frappe (l'IA ne la choisit plus) ;
 *   · les boss dont le texte dit « insécable » le sont, les autres non ;
 *   · les 27 mécaniques nouvelles : chacune tourne (mise en garde → frappe)
 *     sans planter et DIT quelque chose dans la barre ;
 *   · une quinzaine d'entre elles mesurées : le coefficient attendu, et la
 *     contre-épreuve (celui qui n'est pas visé ne prend pas le bonus) ;
 *   · Mahoraga (Kevératus, v3) garde ses propres postures, s'adapte à une
 *     gêne que le groupe lui pose deux fois, et la barre dit sa Roue ;
 *   · les météores de Radahn tombent ;
 *   · l'Esprit de Dono laisse une vraie fenêtre, et l'œil éteint le reste.
 *
 *   npx http-server -p 8899 -c-1 .        (à la racine)
 *   node bancs/navigateur/les_boss.js
 * Écrit deux captures : bancs/navigateur/captures/boss_*.png
 */
var { chromium } = require('playwright');
var fs = require('fs'), path = require('path');
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
var CAPT = path.join(__dirname, 'captures');

(async function () {
  var nav = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--mute-audio'] });
  var page = await nav.newPage({ viewport: { width: 816, height: 624 } });
  var err = []; page.on('pageerror', function (e) { err.push(e.message.split('\n')[0]); });
  var ok = 0, ko = 0;
  var v = function (t, c, d) { if (c) { ok++; console.log('   OK  ' + t + (d ? '  — ' + d : '')); } else { ko++; console.log('   KO  ' + t + (d ? '  — ' + d : '')); } };

  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.waitForFunction(function () { var s = SceneManager._scene; return s && s._commandWindow && s._commandWindow.active && s._commandWindow.isOpen(); }, null, { timeout: 180000 });
  await page.evaluate(function () { DataManager.setupNewGame(); SceneManager.goto(Scene_Map); });
  await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
  await page.waitForTimeout(1000);

  // Le groupe au complet, niveau 60, pour que les frappes aient de quoi mordre
  await page.evaluate(function () {
    [1, 2, 3, 4].forEach(function (id) { if ($gameParty.members().length < 4 && $gameParty._actors.indexOf(id) < 0) $gameParty.addActor(id); });
    $gameParty.members().forEach(function (a) { a.changeLevel(60, false); a.recoverAll(); });
    BattleManager.setup(519, false, false); SceneManager.push(Scene_Battle);
  });
  await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
  await page.waitForTimeout(1500);

  // ── outils posés dans la page
  await page.evaluate(function () {
    var dit = window.__dit = [];
    var w = SceneManager._scene._logWindow, vrai = w.push.bind(w);
    w.push = function (m, t) { if (m === 'addText' && t) dit.push(String(t).replace(/\\C\[\d+\]/g, '')); return vrai(m, t); };
    window.__jouer = function (sujet, skillId, cible) {
      var a = new Game_Action(sujet); a.setSkill(skillId);
      if (cible) a.setTarget(cible.index()); else a.decideRandomTarget();
      BattleManager._subject = sujet; BattleManager._action = a;
      var ts = a.makeTargets(); a.applyGlobal();
      var degats = [];
      ts.forEach(function (t) { a.apply(t); degats.push([t.name(), t.result().hpDamage]); });
      BattleManager.endAction();
      BattleManager._subject = null; BattleManager._action = null;
      return { cibles: ts.map(function (t) { return t.name(); }), degats: degats };
    };
    window.__troupe = function (id) {
      $gameTroop.setup(id); $gameTroop.onBattleStart && $gameTroop.onBattleStart();
      $gameParty.members().forEach(function (a) { a.recoverAll(); a.clearBuffs && a.clearBuffs(); });
      MecaBoss._bannieres.length = 0; window.__dit.length = 0;
      // sans sprite, un ennemi neuf n'a pas encore sa file de nombres (YEP)
      $gameTroop.members().concat($gameParty.members()).forEach(function (m) { m.clearDamagePopup(); });
      return $gameTroop.members()[0];
    };
    window.__competences = function (b) {
      var ids = b.enemy().actions.map(function (x) { return x.skillId; });
      return {
        tele: ids.filter(function (i) { return MecaBoss.estTelegraphe($dataSkills[i]); })[0],
        frappe: ids.filter(function (i) { return MecaBoss.estFrappe($dataSkills[i]); })[0]
      };
    };
    // dégâts d'une frappe sur une cible, hasard figé
    window.__mesure = function (b, skillId, cible) {
      var r = Math.random; Math.random = function () { return 0.5; };
      var a = new Game_Action(b); a.setSkill(skillId);
      var d = a.makeDamageValue(cible, false);
      Math.random = r; return d;
    };
  });

  // ═════════ 0 · chargement
  var base = await page.evaluate(function () {
    var MB = window.MecaBoss, t = MB.table, ids = Object.keys(t).map(Number);
    return {
      defs: Object.keys(MB.defs).length, table: ids.length,
      tousBoss: ids.every(function (i) { return $dataEnemies[i] && ($dataEnemies[i].meta.Boss || $dataEnemies[i].meta.Mahoraga); }),
      sansDef: ids.filter(function (i) { return !MB.defs[t[i]]; }),
      barre: !!SceneManager._scene._barreBoss, bandeau: !!SceneManager._scene._bandeauBoss,
      titre: MB._bannieres.length ? MB._bannieres[0].titre : (SceneManager._scene._bandeauBoss._duree ? 'déjà affiché' : '')
    };
  });
  console.log('\n— Chargement');
  // la Veuve (797) et l'Errant (796) sont devenus les deux mains du Percepteur (JOKO, 2026-10-29) : leurs
  // mécaniques restent écrites, mais plus aucun ennemi ne les porte. Et la Roue de Kevératus (<Mahoraga>,
  // MahoragaBoss v3, 2026-11-03) est une mécanique de plus : 28 / 26
  v('28 mécaniques déclarées, 26 boss reliés', base.defs === 28 && base.table === 26, base.defs + ' / ' + base.table);
  v('chaque boss de la table est un <Boss> (ou <Mahoraga>) et a sa mécanique', base.tousBoss && base.sansDef.length === 0, base.sansDef.join(','));
  v('la barre du boss et le bandeau existent dans la scène', base.barre && base.bandeau);
  v('la carte-titre annonce le boss', /GARGAL|déjà/.test(base.titre), base.titre);

  // capture : carte-titre
  await page.waitForTimeout(900);
  if (!fs.existsSync(CAPT)) fs.mkdirSync(CAPT, { recursive: true });
  await page.screenshot({ path: path.join(CAPT, 'boss_titre.png') });

  // ═════════ 1 · la rupture
  console.log('\n— La rupture');
  var r1 = await page.evaluate(function () {
    var b = __troupe(519), c = __competences(b), h = $gameParty.aliveMembers()[0];
    __jouer(b, c.tele);
    var charge = b.isStateAffected(207), seuil = b._ruptureSeuil, mhp = b.mhp;
    var banniere = MecaBoss._bannieres.map(function (x) { return x.titre; }).join(' | ');
    // un petit coup ne suffit pas
    var a = new Game_Action(h); a.setAttack(); BattleManager._subject = h;
    a.executeHpDamage(b, Math.floor(seuil / 3));
    var tientEncore = b.isStateAffected(207);
    a.executeHpDamage(b, seuil);
    BattleManager._subject = null;
    var rompu = !b.isStateAffected(207) && b.isStateAffected(218);
    // l'IA, maintenant : elle ne choisit plus la frappe
    b.makeActions();
    var choix = b._actions.map(function (x) { return x.item() ? x.item().id : 0; });
    return { charge: charge, seuil: seuil, mhp: mhp, banniere: banniere, tient: tientEncore, rompu: rompu,
      choix: choix, frappe: c.frappe, dit: __dit.slice(-3).join(' / ') };
  });
  v('la mise en garde pose ⚡ Charge et arme une jauge', r1.charge && r1.seuil > 0, 'seuil ' + r1.seuil + ' = ' + (100 * r1.seuil / r1.mhp).toFixed(1) + ' % des PV max');
  v('un bandeau porte le NOM de la mise en garde', /Renifle/.test(r1.banniere), r1.banniere);
  v('un tiers du seuil ne rompt pas', r1.tient);
  v('le seuil atteint rompt : Charge ôtée, ✷ Surcharge posée', r1.rompu, r1.dit);
  v('après la rupture, l\'IA ne choisit plus la frappe', r1.choix.indexOf(r1.frappe) < 0, 'choix ' + r1.choix.join(',') + ' (frappe ' + r1.frappe + ')');

  var r2 = await page.evaluate(function () {
    function seuil(troupe) { var b = __troupe(troupe), c = __competences(b); __jouer(b, c.tele); return b._ruptureSeuil / b.mhp; }
    return { gargal: seuil(519), fournaise: seuil(523), glace: seuil(537), vhaal: seuil(525), immobile: seuil(541) };
  });
  v('Fournaise, Grande Glace : insécables, comme leur texte le dit', r2.fournaise === 0 && r2.glace === 0);
  v('Vhaal, « la ligne qui n\'a jamais cédé » : deux fois plus dur', Math.abs(r2.vhaal / r2.gargal - 2) < 0.01, (r2.vhaal / r2.gargal).toFixed(2));
  v('le Grand Immobile, « un tour, un seul » : deux fois plus facile', Math.abs(r2.immobile / r2.gargal - 0.5) < 0.01, (r2.immobile / r2.gargal).toFixed(2));

  // ═════════ 2 · les 27, joués
  console.log('\n— Les 25 mécaniques reliées, mise en garde puis frappe');
  var r3 = await page.evaluate(function () {
    var out = [];
    Object.keys(MecaBoss.table).map(Number).forEach(function (eid) {
      var troupe = 0;
      for (var i = 1; i < $dataTroops.length; i++) {
        var t = $dataTroops[i];
        if (t && t.members.length === 1 && t.members[0].enemyId === eid) { troupe = i; break; }
      }
      // un boss qui vient avec d'autres (le Percepteur et ses deux mains) : sa troupe ◈, lui en tête
      for (var j = 1; !troupe && j < $dataTroops.length; j++) {
        var u = $dataTroops[j];
        if (u && /◈/.test(u.name) && u.members.length && u.members[0].enemyId === eid) { troupe = j; }
      }
      var ligne = { eid: eid, cle: MecaBoss.table[eid] };
      try {
        var b = __troupe(troupe), c = __competences(b);
        __jouer(b, c.tele);
        ligne.charge = b.isStateAffected(207);
        ligne.barre = MecaBoss.ligne(b);
        // un héros agit pendant la charge (attaque simple)
        var h = $gameParty.aliveMembers()[0];
        __jouer(h, h.attackSkillId(), b);
        var r = __jouer(b, c.frappe);
        ligne.frappe = r.degats.length;
        ligne.apres = MecaBoss.ligne(b);
      } catch (e) { ligne.erreur = e.message; }
      out.push(ligne);
    });
    return out;
  });
  var plantes = r3.filter(function (l) { return l.erreur; });
  v('les 25 jouent mise en garde → action d\'un héros → frappe, sans planter', plantes.length === 0, plantes.map(function (l) { return l.eid + ' ' + l.erreur; }).join(' ; '));
  var muets = r3.filter(function (l) { return !l.barre; });
  v('pendant la charge, les 25 disent quelque chose dans la barre', muets.length === 0, muets.map(function (l) { return l.cle; }).join(','));
  r3.forEach(function (l) { console.log('        ' + (l.cle + '          ').slice(0, 11) + '│ ' + l.barre); });

  // ═════════ 3 · mesures, avec contre-épreuve
  console.log('\n— Mesures');
  var r4 = await page.evaluate(function () {
    var R = {}, H = function () { return $gameParty.aliveMembers(); };
    // Gargal : l'odeur ×1,5 sur elle, ×0,7 sur les autres à la Curée
    var b = __troupe(519), c = __competences(b), h = H();
    b._flair = h[0]; var avec = __mesure(b, c.frappe, h[0]);
    b._flair = h[1]; var sans = __mesure(b, c.frappe, h[0]);
    R.flair = avec / sans;
    // Dynamo : qui a bougé prend ×0,5, qui est resté ×1,5
    b = __troupe(543); c = __competences(b); __jouer(b, c.tele);
    __jouer(H()[0], H()[0].attackSkillId(), b);
    var bouge = __mesure(b, c.frappe, H()[0]); b._bouge = []; var reste = __mesure(b, c.frappe, H()[0]);
    R.bouge = bouge / reste;
    // la Cantatrice : la magie scellée pendant la charge, pas le corps
    b = __troupe(533); c = __competences(b);
    var mage = H().map(function (a) { return a.skills().filter(function (s) { return s.hitType === 2 && s.damage.type === 1 && a.meetsSkillConditions(s); })[0] ? a : null; }).filter(Boolean)[0];
    var sort = mage && mage.skills().filter(function (s) { return s.hitType === 2 && s.damage.type === 1 && mage.meetsSkillConditions(s); })[0];
    __jouer(b, c.tele);
    R.scelle = mage ? !mage.meetsSkillConditions(sort) : null;
    R.corps = mage ? mage.meetsSkillConditions($dataSkills[mage.attackSkillId()]) : null;
    b.removeState(207); R.rendu = mage ? mage.meetsSkillConditions(sort) : null;
    // le Sans-Prix : le mauvais élément ×0,15, le bon rompt. La base se
    // mesure mécanique coupée, CHARGE COMPRISE (elle baisse la DÉF).
    b = __troupe(546); c = __competences(b); __jouer(b, c.tele);
    var hh = H()[0], bon = b._interstice;
    var mauvais = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(function (e) { return e !== bon && b.elementRate(e) > 0; })[0];
    var sk = JSON.parse(JSON.stringify($dataSkills[hh.attackSkillId()])); sk.id = 9999; $dataSkills[9999] = sk;
    function coup(el, meca) {
      sk.damage.elementId = el;
      var def = MecaBoss.defs.interstice, f = def.degatsRecus;
      if (!meca) def.degatsRecus = null;
      var a = new Game_Action(hh); a.setSkill(9999);
      var rnd = Math.random; Math.random = function () { return 0.5; };
      var d = a.makeDamageValue(b, false);
      Math.random = rnd; def.degatsRecus = f; return d;
    }
    var baseM = coup(mauvais, false), dM = coup(mauvais, true);
    var enCore = b.isStateAffected(207);
    var baseB = coup(bon, false), dB = coup(bon, true);
    R.interstice = { mauvais: dM / baseM, bon: dB / baseB, tenait: enCore, rompu: !b.isStateAffected(207) && b.isStateAffected(218) };
    delete $dataSkills[9999];
    // le Rapiécé : la frappe part 1 + greffes fois
    b = __troupe(521); c = __competences(b); __jouer(b, c.tele); b.removeState(207); __jouer(b, c.tele);
    var ac = new Game_Action(b); ac.setSkill(c.frappe);
    R.greffes = { g: b._greffes, rep: ac.numRepeats() };
    // la Panse : crever la panse rompt la charge
    b = __troupe(522); c = __competences(b); __jouer(b, c.tele);
    var panse = b._panse, hp0 = b.hp; a = new Game_Action(H()[0]); a.setAttack(); BattleManager._subject = H()[0];
    a.executeDamage(b, Math.floor(panse / 2)); var intact = b.hp === hp0 && b.isStateAffected(207);
    a.executeDamage(b, panse); BattleManager._subject = null;
    R.panse = { intact: intact, crevee: !b.isStateAffected(207) && b.isStateAffected(218), reste: hp0 - b.hp, attendu: Math.floor(panse / 2) };
    // le Bourreau : la Sentence tombe sur le nom écrit
    b = __troupe(526); c = __competences(b); __jouer(b, c.tele);
    var nom = b._liste.name(), cibles = [];
    for (var k = 0; k < 6; k++) { var x = new Game_Action(b); x.setSkill(c.frappe); x.decideRandomTarget(); cibles.push(x.makeTargets()[0].name()); }
    R.liste = cibles.every(function (n) { return n === nom; });
    // l'Errata : la Correction barre les bonus
    b = __troupe(536); c = __competences(b); H()[0].addBuff(2, 3); H()[1].addBuff(3, 3);
    __jouer(b, c.tele); __jouer(b, c.frappe);
    R.rature = !H()[0].isBuffAffected(2) && !H()[1].isBuffAffected(3);
    // le Consenti : ce qu'on lui inflige ressort
    b = __troupe(547); c = __competences(b);
    var poison = 4; BattleManager._subject = H()[0]; b.addState(poison); BattleManager._subject = null;
    __jouer(b, c.tele); __jouer(b, c.frappe);
    R.accepte = { quitte: !b.isStateAffected(poison), sur: H().filter(function (h) { return h.isStateAffected(poison) || h.isStateResist(poison); }).length, n: H().length };
    // le Percepteur : la Dîme prend 30 % des PM
    b = __troupe(529); c = __competences(b); H().forEach(function (h) { h.setMp(h.mmp); });
    var mp0 = H()[0].mp; __jouer(b, c.tele); __jouer(b, c.frappe);
    R.registre = (mp0 - H()[0].mp) / mp0;
    // Midas : l'éboulis lui tombe dessus
    b = __troupe(545); c = __competences(b); var hpM = b.hp; __jouer(b, c.frappe);
    R.tresor = (hpM - b.hp) / b.mhp;
    return R;
  });
  v('Gargal : l\'odeur rend la Curée ×1,5 sur elle et ×0,7 ailleurs', Math.abs(r4.flair - 1.5 / 0.7) < 0.03, r4.flair.toFixed(3) + ' (attendu ' + (1.5 / 0.7).toFixed(3) + ')');
  v('Dynamo : « Bouge. » — qui agit prend ×0,5, qui reste ×1,5', Math.abs(r4.bouge - 1 / 3) < 0.01, r4.bouge.toFixed(3));
  v('la Cantatrice : la magie se tait pendant la charge, pas le corps, et revient après', r4.scelle === true && r4.corps === true && r4.rendu === true, JSON.stringify([r4.scelle, r4.corps, r4.rendu]));
  v('le Sans-Prix : le mauvais élément ne passe qu\'à 15 %', Math.abs(r4.interstice.mauvais - 0.15) < 0.01, r4.interstice.mauvais.toFixed(3));
  v('le Sans-Prix : l\'interstice passe ×2 et rompt la charge', Math.abs(r4.interstice.bon - 2) < 0.01 && r4.interstice.tenait && r4.interstice.rompu, r4.interstice.bon.toFixed(3));
  v('le Rapiécé : deux greffes, la frappe part trois fois', r4.greffes.g === 2 && r4.greffes.rep === 3, JSON.stringify(r4.greffes));
  v('Panse-Monde : la panse encaisse d\'abord, crevée elle rompt', r4.panse.intact && r4.panse.crevee && r4.panse.reste === r4.panse.attendu, JSON.stringify(r4.panse));
  v('le Bourreau : la Sentence tombe six fois sur six sur le nom écrit', r4.liste);
  v('l\'Errata : la Correction Générale barre les bonus', r4.rature);
  v('le Consenti : le poison qu\'on lui a mis ressort sur le groupe', r4.accepte.quitte && r4.accepte.sur === r4.accepte.n, JSON.stringify(r4.accepte));
  v('le Percepteur : la Dîme Totale prend 30 % des PM', Math.abs(r4.registre - 0.3) < 0.02, (r4.registre * 100).toFixed(1) + ' %');
  v('Midas : l\'éboulis lui prend 5 % de ses PV', Math.abs(r4.tresor - 0.05) < 0.002, (r4.tresor * 100).toFixed(2) + ' %');

  // ═════════ 4 · Mahoraga, Radahn, Dono
  console.log('\n— Mahoraga · Radahn · Dono');
  var r5 = await page.evaluate(function () {
    var R = {};
    var b = __troupe(21), h = $gameParty.aliveMembers()[0];
    R.mahoraga = b.isMahoraga();
    // ses propres postures : il se les pose deux fois, la seconde tient
    var buff = 5;
    BattleManager._subject = b; b.addState(buff); b.removeState(buff); b.clearResult(); b.addState(buff); BattleManager._subject = null;
    R.propre = b.isStateAffected(buff);
    b.removeState(buff);
    // un état posé par le groupe : subi une fois, refusé la seconde
    BattleManager._subject = h; b.addState(6); b.removeState(6); b.clearResult(); b.addState(6); BattleManager._subject = null;
    R.adapte = !b.isStateAffected(6) && (b._roueEtats || []).indexOf(6) >= 0;
    // le frapper (la Roue compte) ne plante pas
    try { var a = new Game_Action(h); a.setAttack(); BattleManager._subject = h; a.makeDamageValue(b, false); a.makeDamageValue(b, false); BattleManager._subject = null; R.anim = true; }
    catch (e) { R.anim = e.message; }
    // la barre du boss dit sa Roue (v3 : les trois arts)
    R.cles = window.LaRoue ? LaRoue.ligne(b) : '';
    // Radahn : sous 30 %, la pluie s'annonce puis tombe (s'il la connaît encore)
    R.meteores = b.enemy().actions.some(function (a) { return a.skillId === 436; });
    b.setHp(Math.floor(b.mhp * 0.25));
    $gameTroop._turnCount = 10; b.makeActions();
    R.annonce = !!b._radahnMeteor;
    $gameTroop._turnCount = 11; b.makeActions();
    R.pluie = b._actions[0] && b._actions[0].item() && b._actions[0].item().id;
    $gameTroop._turnCount = 12; b.makeActions();
    R.pasEncore = b._actions[0] && b._actions[0].item() && b._actions[0].item().id;
    $gameTroop._turnCount = 14; b.makeActions();
    R.encore = b._actions[0] && b._actions[0].item() && b._actions[0].item().id;
    // Dono : l'Esprit abattu reste à terre un tour plein
    var d = __troupe(33);
    var esp = $gameTroop.members().filter(function (m) { return m.enemy().meta.DonoEsprit; })[0];
    R.duo = !!(d.enemy().meta.DonoBoss && esp);
    if (esp) {
      esp.appear();                       // caché jusqu'à son entrée en scène
      $gameTroop._turnCount = 3; esp.addState(esp.deathStateId());
      BattleManager.endTurn(); R.memeTour = esp.isDead();
      $gameTroop._turnCount = 4; BattleManager.endTurn(); R.tourSuivant = esp.isAlive();
      R.oeil = !!d._oeilEteint;
      // Dono tombe : l'Esprit s'éteint avec lui (ne se faisait jamais)
      d.addState(d.deathStateId());
      R.ensemble = d.isDead() && esp.isDead();
    }
    // Lou : l'âme d'un ennemi qu'il achève est capturée (ne se faisait jamais)
    var soul = Number(PluginManager.parameters('LouCopySystem').soulVar || 15);
    var e = __troupe(519); var avant = $gameVariables.value(soul);
    e._louLastHit = true; e.addState(e.deathStateId());
    R.ame = soul ? $gameVariables.value(soul) - avant : 'soulVar ?';
    return R;
  });
  v('Mahoraga est reconnu', r5.mahoraga);
  v('Mahoraga garde ses propres postures (la Roue ne s\'y adapte plus)', r5.propre);
  v('Mahoraga s\'adapte à une gêne que le groupe lui pose deux fois', r5.adapte);
  v('le frapper ne plante pas (la Roue compte)', r5.anim === true, String(r5.anim));
  v('la barre dit sa Roue des trois arts', /☸ Voies .* · Paroles .* · Runes /.test(r5.cles), r5.cles);
  if (r5.meteores) {
    v('Radahn : sous 30 %, la pluie de météores s\'annonce', r5.annonce);
    v('Radahn : au tour suivant elle TOMBE, puis revient tous les 3 tours', r5.pluie === 436 && r5.pasEncore !== 436 && r5.encore === 436, [r5.pluie, r5.pasEncore, r5.encore].join(' → '));
  } else {
    // JOKO lui a donné un autre jeu (2026-10-29) : plus de météores, donc plus d'annonce qui promet le ciel
    v('Radahn sans ses météores : sous 30 %, rien ne s\'annonce', !r5.annonce);
  }
  v('Dono et son Esprit sont dans la troupe 33', r5.duo);
  v('l\'Esprit abattu ne renaît pas à la fin du même tour', r5.memeTour === true);
  v('… il renaît au tour suivant, et l\'œil éteint le reste', r5.tourSuivant === true && r5.oeil === true);
  v('Dono tombe : son Esprit s\'éteint avec lui', r5.ensemble === true);
  v('Lou capture l\'âme de l\'ennemi qu\'il achève', r5.ame === 1, String(r5.ame));

  // ═════════ 5 · la barre, à l'écran
  await page.evaluate(function () {
    var b = __troupe(519); var c = __competences(b);
    SceneManager._scene._spriteset.createEnemies && SceneManager._scene._spriteset.createEnemies();
    __jouer(b, c.tele);
    __jouer($gameParty.aliveMembers()[0], $gameParty.aliveMembers()[0].attackSkillId(), b);
    SceneManager._scene._bandeauBoss._t = 999;
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(CAPT, 'boss_barre.png') });

  // ═════════ 6 · un vrai combat, joué par le moteur (combat auto)
  console.log('\n— Un vrai combat contre Gargal, tour après tour');
  await page.evaluate(function () { BattleManager._phase = 'battleEnd'; SceneManager.pop(); });
  await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
  await page.waitForTimeout(800);
  await page.evaluate(function () {
    window.__vus = [];
    var b0 = MecaBoss.banniere;
    MecaBoss.banniere = function (t, s, c) { window.__vus.push(t); return b0.apply(this, arguments); };
    Game_Actor.prototype.isAutoBattle = function () { return true; };
    $gameParty.members().forEach(function (a) { a.recoverAll(); });
    BattleManager.setup(519, false, false); SceneManager.push(Scene_Battle);
  });
  await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
  var fin = Date.now() + 150000, vu = null;
  while (Date.now() < fin) {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(700);
    vu = await page.evaluate(function () {
      $gameParty.members().forEach(function (a) { if (a.hpRate() < 0.5) a.recoverAll(); });
      var b = $gameTroop.members()[0]; if (b && b.hpRate() < 0.3) b.setHp(b.mhp);
      return { vus: window.__vus.slice(), tour: $gameTroop.turnCount(), ok: BattleManager.isBattleEnd && !BattleManager.isBattleEnd() };
    });
    if (vu.vus.some(function (t) { return /découvert|RUPTURE/.test(t); }) && vu.vus.some(function (t) { return /^⚡/.test(t); })) break;
  }
  console.log('        bandeaux vus : ' + vu.vus.join(' | ') + '  (tour ' + vu.tour + ')');
  v('le moteur, seul, annonce la mise en garde par un bandeau', vu.vus.some(function (t) { return /^⚡/.test(t); }));
  v('… puis la fenêtre : « à découvert » après la frappe, ou la rupture', vu.vus.some(function (t) { return /découvert|RUPTURE/.test(t); }));
  // Fournaise ne se rompt pas : la frappe part, puis la fenêtre s'annonce
  await page.evaluate(function () { BattleManager._phase = 'battleEnd'; SceneManager.pop(); });
  await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
  await page.waitForTimeout(800);
  await page.evaluate(function () {
    window.__vus.length = 0;
    $gameParty.members().forEach(function (a) { a.recoverAll(); });
    BattleManager.setup(523, false, false); SceneManager.push(Scene_Battle);
  });
  await page.waitForFunction(function () { return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging(); }, null, { timeout: 60000 });
  fin = Date.now() + 200000;
  var surTroisTours = null;
  while (Date.now() < fin) {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(700);
    vu = await page.evaluate(function () {
      $gameParty.members().forEach(function (a) { if (a.hpRate() < 0.5) a.recoverAll(); });
      var b = $gameTroop.members()[0]; if (b && b.hpRate() < 0.3) b.setHp(b.mhp);
      return { vus: window.__vus.slice(), tour: $gameTroop.turnCount(), sur: b && b.isStateAffected(218) ? b._stateTurns[218] : 0 };
    });
    if (vu.sur) surTroisTours = Math.max(surTroisTours || 0, vu.sur);
    if (vu.vus.some(function (t) { return /découvert/.test(t); })) break;
  }
  console.log('        bandeaux vus : ' + vu.vus.join(' | ') + '  (tour ' + vu.tour + ')');
  v('Fournaise : la frappe part, PUIS « à découvert » s\'affiche', vu.vus.some(function (t) { return /découvert/.test(t); }) && !vu.vus.some(function (t) { return /RUPTURE/.test(t); }));
  v('Fournaise : « il reste ouvert un instant » — trois tours', surTroisTours === 3, 'tours de Surcharge : ' + surTroisTours);
  await page.screenshot({ path: path.join(CAPT, 'boss_combat.png') });

  console.log('\n— Erreurs de page');
  v('aucune erreur de page', err.length === 0, err.slice(0, 3).join(' | '));
  console.log('\n' + ok + ' OK, ' + ko + ' KO');
  await nav.close();
  process.exit(ko ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
