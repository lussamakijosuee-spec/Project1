/*
 * BANC NAVIGATEUR — LE CORPS DE L'AVATAR DE KORRAH
 * ---------------------------------------------------------------------------
 * Le 2026-09-24, JOKO a retiré le système des Dons Spirituels : trop complexe
 * pour ce qu'il rendait. « Même quand j'ai joué en version bêta sans ça, tu
 * comprends bien le jeu et tu comprends quand même bien te battre. »
 *
 * Une seule pièce est restée : l'Avatar de Korrah, devenu un FAMILIER — un
 * Stand, comme l'Esprit Vengeur de Donovano. Son corps est seiryu (acteur 6,
 * classe 5 « familié »), le dragon que JOKO avait déjà posé dans le projet.
 *
 * Ce banc ne vérifie PAS ses règles — elles appartiennent à AvatarSpirituel.js.
 * Il vérifie qu'il A UN CORPS, et que ce corps se tient où il doit :
 *
 *   · derrière elle, et DESSINÉ derrière elle ;
 *   · entièrement dans l'écran — en vue de côté l'équipe est déjà collée au
 *     bord droit, un décalage naïf le fait sortir. Mesuré : il sortait de
 *     48 px avant qu'on le borne sur la largeur réelle de son image ;
 *   · il flotte, il ne reste pas planté ;
 *   · il bouge quand il frappe ;
 *   · elle tombe, il s'efface ; elle se relève, il revient.
 *
 * Il n'est pas automatique : il lui faut Playwright et un serveur.
 *
 *   npx http-server -p 8899 -c-1 .        (dans un autre terminal, à la racine)
 *   node bancs/navigateur/le_corps_de_lavatar.js
 */

var { chromium } = require('playwright');
var SHOTS = process.env.ETT_CAPTURES || '/tmp/corps/';
require('fs').mkdirSync(SHOTS,{recursive:true});
var BASE = process.env.ETT_URL || 'http://127.0.0.1:8899';
(async function(){
  var nav = await chromium.launch({ args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox','--mute-audio'] });
  var page = await nav.newPage({ viewport:{width:816,height:624} });
  var err=[]; page.on('pageerror',function(e){err.push(e.message.split('\n')[0]);});
  page.on('console',function(m){ if(m.type()==='error'&&!/Failed to load|net::ERR/.test(m.text())) err.push('CONSOLE '+m.text().slice(0,140)); });
  var ok=0,ko=0; var v=function(t,c,d){ if(c){ok++;console.log('   OK  '+t+(d?'  — '+d:''));}else{ko++;console.log('   KO  '+t+(d?'  — '+d:''));} };
  await page.goto(BASE+'/index.html',{waitUntil:'load'});
  await page.waitForFunction(function(){var s=SceneManager._scene;return s&&s._commandWindow&&s._commandWindow.active&&s._commandWindow.isOpen();},null,{timeout:180000});
  await page.evaluate(function(){DataManager.setupNewGame();SceneManager.goto(Scene_Map);});
  await page.waitForFunction(function(){return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging();},null,{timeout:60000});
  await page.waitForTimeout(1500);
  console.log("=== LE CORPS DE L'AVATAR ===\n");

  await page.evaluate(function(){
    $gameParty.members().forEach(function(a){a.recoverAll();a.setTp(100);});
    BattleManager.setup(1,true,true); SceneManager.push(Scene_Battle);
  });
  await page.waitForFunction(function(){return SceneManager._scene instanceof Scene_Battle && !SceneManager.isSceneChanging();},null,{timeout:60000});
  await page.waitForTimeout(3500);

  var s = await page.evaluate(function(){
    var sp=SceneManager._scene._spriteset, a=sp._avatarKorrah;
    var enfants=(sp._battleField.children||[]).map(function(c){return c.constructor.name;});
    var korrah=null; sp._actorSprites.forEach(function(x){ if(x._actor&&x._actor.actorId()===2) korrah=x; });
    return {
      existe: !!a,
      classe: a?a.constructor.name:null,
      acteur: (a&&a._actor)?(a._actor.actorId()+' '+a._actor.name()):null,
      battler: (a&&a._actor)?a._actor.battlerName():null,
      position: a?{x:Math.round(a.x),y:Math.round(a.y)}:null,
      korrahPos: korrah?{x:Math.round(korrah.x),y:Math.round(korrah.y)}:null,
      opacite: a?a.opacity:null,
      visible: a?a.visible:null,
      echelle: a?a.scale.x:null,
      rangDessin: enfants.indexOf('Sprite_AvatarKorrah'),
      rangKorrah: (function(){ var r=-1; (sp._battleField.children||[]).forEach(function(c,i){ if(c._actor&&c._actor.actorId&&c._actor.actorId()===2&&c.constructor.name==='Sprite_Actor') r=i; }); return r; })(),
      bords: (function(){ if(!a||!a._mainSprite||!a._mainSprite.bitmap) return null;
        var demi=(a._mainSprite.bitmap.width/9)*Math.abs(a.scale.x)/2;
        return { gauche:a.x-demi, droite:a.x+demi, demi:demi }; })(),
      enfants: enfants,
      bitmapChargee: (a&&a._mainSprite&&a._mainSprite.bitmap)?(a._mainSprite.bitmap.width+'×'+a._mainSprite.bitmap.height):null
    };
  });
  v("le corps est sur le champ de bataille", s.existe, s.classe+' · acteur '+s.acteur+' · image « '+s.battler+' »');
  // Le champ de bataille est trié par profondeur (y croissant) : exiger le rang 0
  // mesurerait une POSITION, pas la propriété qui compte — être dessiné AVANT elle.
  v("il est dessiné derrière Korrah", s.rangDessin >= 0 && s.rangKorrah >= 0 && s.rangDessin < s.rangKorrah,
     'seiryu au rang '+s.rangDessin+', Korrah au rang '+s.rangKorrah+' (plus petit = plus derrière)');
  v("il tient entièrement dans l'écran", s.bords && s.bords.gauche >= 0 && s.bords.droite <= 816,
     s.bords ? ('de x='+Math.round(s.bords.gauche)+' à x='+Math.round(s.bords.droite)+' sur 816') : '?');
  v("son image est chargée", !!s.bitmapChargee, s.bitmapChargee || 'pas de bitmap');
  v("il se tient derrière Korrah", s.position && s.korrahPos && s.position.x > s.korrahPos.x && s.position.y < s.korrahPos.y,
     'Korrah ('+ (s.korrahPos?s.korrahPos.x+','+s.korrahPos.y:'?') +')   seiryu ('+ (s.position?s.position.x+','+s.position.y:'?') +')');
  v("il est visible", s.visible===true && s.opacite>0, 'opacité '+s.opacite+' · échelle '+s.echelle);
  await page.screenshot({path:SHOTS+'01_en_place.png'});

  // il flotte ?
  var p1 = await page.evaluate(function(){ return SceneManager._scene._spriteset._avatarKorrah.y; });
  await page.waitForTimeout(700);
  var p2 = await page.evaluate(function(){ return SceneManager._scene._spriteset._avatarKorrah.y; });
  v("il flotte au lieu de rester planté", Math.abs(p1-p2) > 0.4, 'y '+p1.toFixed(1)+' → '+p2.toFixed(1));

  // il bouge quand il agit ?
  var g = await page.evaluate(function(){
    var a=SceneManager._scene._spriteset._avatarKorrah;
    var avant = a._motion ? a._motion.index : null;
    window.Avatars.agir(2);
    return { avant:avant, apres: a._actor._motionType || null, demande: a._actor.isMotionRequested ? a._actor.isMotionRequested() : null };
  });
  await page.waitForTimeout(1400);
  var g2 = await page.evaluate(function(){
    var a=SceneManager._scene._spriteset._avatarKorrah;
    return { motion: a._motion ? Object.keys(Sprite_Actor.MOTIONS).filter(function(k){return Sprite_Actor.MOTIONS[k]===a._motion;})[0] : null };
  });
  v("il joue un geste quand il frappe", !!g.apres || !!g2.motion, 'geste demandé « '+(g.apres||'?')+' » · joué « '+(g2.motion||'?')+' »');
  await page.screenshot({path:SHOTS+'02_il_frappe.png'});

  // Korrah tombe → il s'efface
  var chute = await page.evaluate(function(){
    var k=$gameParty.members().filter(function(x){return x.actorId()===2;})[0];
    k.setHp(0); k.refresh();
    return { morte: k.isDead(), present: window.AvatarCorps.present() };
  });
  await page.waitForTimeout(2200);
  var apresChute = await page.evaluate(function(){ var a=SceneManager._scene._spriteset._avatarKorrah; return {op:a.opacity, vis:a.visible}; });
  v("elle tombe, il s'efface", chute.present===false && apresChute.op < 215, 'present='+chute.present+' · opacité '+apresChute.op);
  await page.screenshot({path:SHOTS+'03_elle_tombe.png'});

  var retour = await page.evaluate(function(){
    var k=$gameParty.members().filter(function(x){return x.actorId()===2;})[0];
    k.setHp(k.mhp); k.removeState(1); k.refresh();
    return window.AvatarCorps.present();
  });
  await page.waitForTimeout(2600);
  var apresRetour = await page.evaluate(function(){ return SceneManager._scene._spriteset._avatarKorrah.opacity; });
  v("elle se relève, il revient", retour===true && apresRetour > 100, 'opacité '+apresRetour);
  await page.screenshot({path:SHOTS+'04_elle_revient.png'});

  console.log();
  v('aucune erreur JavaScript', err.length===0, err.slice(0,3).join(' | ')||'rien');
  console.log('\n'+'='.repeat(72));
  console.log('  '+ok+' contrôles passés · '+ko+' échec(s)');
  console.log('='.repeat(72));
  await nav.close();
  process.exit(ko?1:0);
})();
