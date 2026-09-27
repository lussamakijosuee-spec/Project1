'use strict';
var D = require('./dsl.js');
var A = D.A, C = D.C, M = D.M, SW = D.SW, VAR = D.VAR, si = D.si, choix = D.choix, dire = D.dire, narrer = D.narrer, note = D.note, route = D.route, cat = D.cat, combat = D.combat;
var ICI = D.CE_EV, JOUEUR = D.JOUEUR;
function R(nom, aide, cmds) { return { nom: nom, aide: aide, cmds: cmds }; }
function unFoisParJour(cle) {
    return C.js('(function(i){var k="' + cle + ':"+i._mapId+":"+i._eventId, r=$gameSystem._atelierJour=$gameSystem._atelierJour||{}, d=$gameSystem.day(); if(r[k]===d) return false; r[k]=d; return true;})(this)');
}

var equipe = [
    R('Ajouter un héros à l\'équipe', 'Héros 2.', cat(A.equipe(2, true), A.me('Fanfare1'))),
    R('Retirer un héros de l\'équipe', '', A.equipe(2, false)),
    R('Soigner toute l\'équipe', '', cat(A.se('Heal2'), A.soigner(0))),
    R('Soigner un seul héros', 'Héros 1.', A.soigner(1)),
    R('Gagner de l\'expérience', '100 XP à tous.', cat(A.xp(100), A.se('Powerup'))),
    R('Monter d\'un niveau', '', cat(A.niveau(1), A.me('Fanfare1'))),
    R('Apprendre une compétence', 'Héros 1, compétence 124 : change les numéros.', cat(A.apprendre(1, 124), A.se('Skill1'), dire('\\N[1] apprend \\ns[124] !'))),
    R('Renommer un héros', '', A.nomSaisie(1, 10)),
    R('Donner un surnom', '', A.surnom(1, 'la Lame Rouge')),
    R('Augmenter une stat (graine)', 'PV max +50.', cat(A.stat(0, 50), A.se('Powerup'))),
    R('Changer le chef d\'équipe (le 2e passe devant)', '', A.js('var a = $gameParty._actors; if (a.length > 1) { a.push(a.shift()); $gamePlayer.refresh(); }')),
    R('Ouvrir la formation', '', A.js('SceneManager.push(Scene_Menu);')),
    R('Cacher les suiveurs (scène à un seul personnage)', '', A.suiveurs(false)),
    R('Montrer les suiveurs', '', A.suiveurs(true)),
    R('Rassembler les suiveurs', '', A.rassembler()),
    R('Retirer un état (soigner un poison, une brûlure)', 'État 91 (Brûlure).', A.etat(91, false)),
    R('Tester si un héros est dans l\'équipe', 'Héros 3.', si(C.acteur(3), dire('ludwing est avec toi.'), dire('ludwing n\'est pas là.'))),
    R('Tester le niveau du chef', 'Niveau 10 ou plus.', si(C.js('$gameParty.leader().level >= 10'), dire('Tu es assez fort.'), dire('Reviens au niveau 10.'))),
    R('Santé mentale — calmer (bon choix)', 'Héros 1 : +1 de sérénité.', A.plugin('AME bon 1 1')),
    R('Santé mentale — perturber (mauvais choix)', 'Héros 1 : −1.', A.plugin('AME mauvais 1 1')),
    R('Dire combien de héros sont dans l\'équipe', '', cat(A.vrJs(VAR.taille, '$gameParty.size()'), dire('Vous êtes \\V[' + VAR.taille + '].')))
];

var objets = [
    R('Donner un objet', 'Potion.', cat(A.objet(1, 1), A.se('Item1'), dire('Tu reçois \\ni[1].'))),
    R('Retirer un objet', '', A.objet(1, -1)),
    R('Donner une arme', '', cat(A.arme(9, 1), dire('Tu reçois \\nw[9].'))),
    R('Donner une armure', '', cat(A.armure(1, 1), dire('Tu reçois \\na[1].'))),
    R('Donner de l\'or', '', cat(A.or(100), A.se('Coin'))),
    R('Retirer de l\'or', '', A.or(-100)),
    R('Tester si le joueur a un objet', '', si(C.objet(1), dire('Tu as une potion.'), dire('Tu n\'as pas de potion.'))),
    R('Tester si le joueur a assez d\'or', '', si(C.or(500), dire('Tu as au moins 500 \\G.'), dire('Il te manque de l\'or.'))),
    R('Choisir un objet dans son sac', 'L\'objet choisi va dans « Objet choisi ».', cat(dire('Que montres-tu ?'), A.choisirObjet(VAR.objetChoisi, 1), si(C.vr(VAR.objetChoisi, '=', 0), dire('Rien.'), dire('Tu montres \\ni[\\V[' + VAR.objetChoisi + ']].')))),
    R('Montrer le bon objet à un PNJ', 'Il attend l\'objet 9 (Lait).', cat(A.choisirObjet(VAR.objetChoisi, 1), si(C.vr(VAR.objetChoisi, '=', 9), cat(A.objet(9, -1), dire('« C\'est exactement ça ! »'), A.or(50)), dire('« Ce n\'est pas ça. »')))),
    R('Objet clé — donner', 'Objet 81.', cat(A.objet(81, 1), A.me('Fanfare1'), dire('Tu obtiens \\ni[81].'))),
    R('Vendre un objet à un PNJ', 'Pomme contre 5 or.', si(C.objet(44), cat(A.objet(44, -1), A.or(5), A.se('Coin')), dire('Tu n\'as pas de pomme.'))),
    R('Vider tout l\'inventaire (prison, naufrage)', 'Les objets sont mis de côté pour être rendus.', cat(A.js('$gameSystem._atelierSac = { items: JSON.parse(JSON.stringify($gameParty._items)), gold: $gameParty.gold() }; $gameParty._items = {}; $gameParty.loseGold($gameParty.gold());'), dire('On t\'a tout pris.'))),
    R('Rendre l\'inventaire mis de côté', '', A.js('var s = $gameSystem._atelierSac; if (s) { $gameParty._items = s.items; $gameParty.gainGold(s.gold); $gameSystem._atelierSac = null; }')),
    R('Compter un objet', 'Combien de potions ?', cat(A.vrJeu(VAR.objetChoisi, 0, 1), dire('Tu as \\V[' + VAR.objetChoisi + '] potion(s).'))),
    R('Utiliser un objet sur la carte (boire une potion)', '', si(C.objet(1), cat(A.objet(1, -1), A.se('Heal1'), A.pv(200)), dire('Pas de potion.'))),
    R('Lire l\'or du groupe', '', cat(A.vrJeu(VAR.or, 6, 1), dire('Tu as \\V[' + VAR.or + '] \\G.'))),
    R('Livre des objets — ouvrir', '', A.plugin('ItemBook open'))
];

var defis = [
    R('Minuterie — lancer 60 secondes', '', A.minuterie(60)),
    R('Minuterie — arrêter', '', A.stopMinuterie()),
    R('Minuterie — que faire quand elle tombe à zéro', 'Processus parallèle.', si(C.minuterie(0, '<='), cat(A.stopMinuterie(), dire('Temps écoulé !')))),
    R('Chrono visuel MOG — le placer à l\'écran', '', A.plugin('visual_timer : 330 : 60')),
    Object.assign(R('Défi — 20 pas maximum', 'Chaque pas compte. Processus parallèle, seulement pendant le défi (interrupteur « Défi des pas en cours », allumé par « mémoriser le départ »).',
        cat(A.vrJeu(VAR.pas, 6, 2), si(C.js('$gameParty.steps() - ($gameSystem._atelierPas || 0) >= 20'), cat(A.sw(SW.defiPas, false), dire('Trop de pas !'), A.transfert(1, 6, 8, 2, 0))))),
        { declencheur: { type: 2, sw: SW.defiPas } }),
    R('Défi — mémoriser le départ des pas', 'À appeler au début du défi : lance le compte (interrupteur « Défi des pas en cours »).', cat(A.js('$gameSystem._atelierPas = $gameParty.steps();'), A.sw(SW.defiPas, true))),
    R('Défi sans soin — interdire le menu', '', A.menuAcces(false)),
    R('Défi — rendre le menu', '', A.menuAcces(true)),
    R('Défi — interdire la sauvegarde', '', A.sauvegardeAcces(false)),
    R('Défi — rendre la sauvegarde', '', A.sauvegardeAcces(true)),
    R('Survie — trois vies', 'À chaque coup, une vie de moins.', cat(A.vrRetrait(VAR.vies, 1), A.flash([255, 0, 0, 170], 10), si(C.vr(VAR.vies, '<=', 0), cat(dire('Plus de vies.'), A.gameOver()), dire('Il reste \\V[' + VAR.vies + '] vie(s).')))),
    R('Survie — mettre les vies à 3', '', A.vr(VAR.vies, 3)),
    R('Collecte chronométrée — ramasser un point', '', cat(A.se('Coin'), A.vrAjout(VAR.score, 1), A.effacer())),
    R('Donjon — étage suivant', 'Variable « Étage ».', cat(A.vrAjout(VAR.etage, 1), narrer('Étage \\V[' + VAR.etage + ']'))),
    R('Boss rush — enchaîner deux boss', '', cat(combat(7, {}), A.soigner(0), combat(11, {})))
];

var discretion = [
    R('Se cacher dans un buisson', 'Allume « Joueur caché ».', cat(A.se('Sand'), route(JOUEUR, [M.opacite(120)]), A.sw(SW.cachette, true))),
    R('Sortir de sa cachette', '', cat(route(JOUEUR, [M.opacite(255)]), A.sw(SW.cachette, false))),
    R('Garde qui voit le joueur devant lui (3 cases)', 'Processus parallèle sur le garde.',
        si(C.js('(function(i){var e=$gameMap.event(i._eventId),p=$gamePlayer,d=e.direction(),dx=p.x-e.x,dy=p.y-e.y; if($gameSwitches.value(' + SW.cachette + ')) return false; return (d===2&&dx===0&&dy>0&&dy<=3)||(d===8&&dx===0&&dy<0&&dy>=-3)||(d===6&&dy===0&&dx>0&&dx<=3)||(d===4&&dy===0&&dx<0&&dx>=-3);})(this)'),
            cat(A.bulle(ICI, 1), A.se('Stare'), A.sw(SW.gardeAverti, true), dire('« Halte ! »', { nom: 'Garde' }), A.transfert(1, 6, 8, 2, 0)))),
    R('Garde en ronde (processus parallèle)', '', route(ICI, [M.gauche, M.gauche, M.gauche, M.att(60), M.droite, M.droite, M.droite, M.att(60)], { repeter: true, attendre: false })),
    R('Distraire un garde (lancer un caillou)', 'Le garde se tourne ailleurs.', cat(A.se('Blow1', 60), A.js('var e = $gameMap.event(this._eventId + 1); if (e) { e.requestBalloon(2); e.setDirection(8); }'))),
    R('Endormir un garde', 'Avec l\'objet 42.', si(C.objet(42), cat(A.objet(42, -1), A.bulle(ICI, 10), A.ss('A', true)), dire('Il faudrait de quoi l\'endormir.'))),
    R('Se faire prendre — en prison', '', cat(A.sw(SW.prison, true), A.fonduNoir(), A.transfert(1, 6, 8, 2, 0), A.fonduRetour(), dire('Te voilà enfermé.'))),
    R('S\'évader de prison', '', cat(A.sw(SW.prison, false), A.se('Open3'), dire('La grille cède.'))),
    R('Pickpocket — voler un PNJ', 'Une chance sur trois d\'être vu.', cat(A.vrHasard(VAR.tirage, 1, 3), si(C.vr(VAR.tirage, '=', 1), cat(A.bulle(ICI, 5), dire('« Au voleur ! »'), A.vrAjout(VAR.reputation, -3)), cat(A.or(40), A.se('Coin'), dire('40 \\G subtilisés.'))))),
    R('Ombre — le joueur devient translucide', '', route(JOUEUR, [M.opacite(100)])),
    R('Ombre — redevenir visible', '', route(JOUEUR, [M.opacite(255)])),
    R('Chiens de garde — aboient au passage', 'Contact.', cat(A.se('Dog'), A.bulle(ICI, 5), A.sw(SW.alarme, true)))
];

var animaux = [
    R('Chat — le caresser', '', cat(A.se('Cat'), A.bulle(ICI, 4), dire('Le chat ronronne.'))),
    R('Chien — il aboie et remue', '', cat(A.se('Dog'), route(ICI, [M.saut(0, 0)]))),
    R('Vache', '', A.se('Cow')),
    R('Mouton qui fuit', '', cat(A.se('Sheep'), route(ICI, [M.fuirJoueur, M.fuirJoueur]))),
    R('Cheval — le monter', '', cat(A.se('Horse'), A.sw(SW.monture, true), route(JOUEUR, [M.vitesse(5)]))),
    R('Grenouille qui saute', '', cat(A.se('Frog'), route(ICI, [M.saut(1, 0)]))),
    R('Corbeau qui s\'envole', '', cat(A.se('Crow'), route(ICI, [M.traverserOn, M.haut, M.haut, M.opacite(0)]), A.effacer())),
    R('Oiseaux qui s\'envolent quand on approche', 'Contact.', cat(A.se('Crow'), route(ICI, [M.traverserOn, M.vitesse(6), M.fuirJoueur, M.fuirJoueur, M.opacite(0)]), A.effacer())),
    R('Animal errant (processus parallèle)', '', route(ICI, [M.hasard, M.att(90)])),
    R('Animal apprivoisé — suit le joueur', '', route(ICI, [M.versJoueur], { repeter: true, attendre: false })),
    R('Poule à attraper', 'Elle fuit ; au bout de 3 essais, attrapée.', cat(A.vrAjout(VAR.essais, 1), si(C.vr(VAR.essais, '>=', 3), cat(A.se('Item1'), dire('Attrapée !'), A.effacer()), route(ICI, [M.fuirJoueur, M.fuirJoueur])))),
    R('Loup — grogne puis attaque', '', cat(A.se('Growl'), A.bulle(ICI, 5), combat(1, { fuite: true, victoire: A.effacer() })))
];

var village = [
    R('Cloche du village — l\'heure sonne', 'Au marché, à midi.', cat(A.se('Bell3'), A.trembler(1, 9, 10))),
    R('Marché — ouvert de jour (processus parallèle)', 'Allume « Marché ouvert (jour) » de 8 h à 18 h.',
        si(C.js('$gameSystem.hour() >= 8 && $gameSystem.hour() < 18'), si(C.sw(SW.marcheOuvert, false), A.sw(SW.marcheOuvert, true)), si(C.sw(SW.marcheOuvert), A.sw(SW.marcheOuvert, false)))),
    R('Fête au village — lanternes, musique, pétales', '', cat(A.sw(SW.festival, true), A.bgm('Town2'), A.plugin('weather : 1 : 0 : 30 : 100 : 0 : Sakura_01A'), A.sw(SW.lampes, true))),
    R('Fin de la fête', '', cat(A.sw(SW.festival, false), A.plugin('clear_weather : 1'), A.fonduBgm(2))),
    R('Feu d\'artifice', '', cat(A.se('Explosion1', 60), A.flash([255, 120, 200, 200], 15), A.attendre(30), A.se('Explosion2', 60), A.flash([120, 200, 255, 200], 15))),
    R('Puits à vœux — jeter une pièce', '', si(C.or(1), cat(A.or(-1), A.se('Water1'), A.vrHasard(VAR.tirage, 1, 20), si(C.vr(VAR.tirage, '=', 1), cat(A.me('Fanfare1'), A.objet(22, 1), dire('Un \\ni[22] remonte du fond !')), dire('Plouf.'))), dire('Il te faut une pièce.'))),
    R('Panneau — indiquer la direction', '', dire('← Ville Forestière    Marché →\n↑ Forêt Perdue')),
    R('Affiche — avis de recherche', '', dire('AVIS DE RECHERCHE\nLe bandit à la cicatrice.\nPrime : 500 \\G.')),
    R('Tableau d\'affichage — nouvelles du jour au hasard', '', D.si(C.js('Math.random() < 0.5'), dire('« Les loups rôdent au nord. »'), dire('« Grand marché le premier du mois. »'))),
    R('Journal du jour — nouvelle différente chaque jour', '', A.js('var n = ["Les récoltes seront bonnes.", "Un voyageur étrange a été vu au lac.", "La forge cherche un apprenti.", "Le pont du nord est fermé."]; $gameMessage.add(n[$gameSystem.day() % n.length]);')),
    R('Porte d\'une maison — l\'habitant répond selon l\'heure', '', si(C.js('$gameSystem.hour() >= 22 || $gameSystem.hour() < 7'), dire('« Il est tard ! On dort ! »'), dire('« Entrez, c\'est ouvert. »'))),
    R('Lit d\'une maison — interdit (ce n\'est pas le tien)', '', dire('Ce n\'est pas ton lit.')),
    R('Cheminée — se réchauffer', 'Retire la gelure.', cat(A.se('Fire1'), A.etat(94, false), dire('La chaleur te fait du bien.'))),
    R('Cuisine d\'une maison — un repas offert (une fois par jour)', '', si(unFoisParJour('repas'), cat(A.objet(46, 1), dire('« Tiens, mange quelque chose. »')), dire('« Reviens demain pour le repas. »'))),
    R('Marchand ambulant — ne vient que certains jours', 'Jours pairs.', si(C.js('$gameSystem.day() % 2 === 0'), D.boutique([['objet', 22], ['objet', 24], ['objet', 57]]), dire('Personne aujourd\'hui.'))),
    R('Prière à l\'autel', '', cat(A.se('Saint1'), A.anim(JOUEUR, 117), A.pm(9999), dire('Tu te sens apaisé.'))),
    R('Cimetière — tombe qui parle la nuit', '', si(C.js('$gameSystem.hour() >= 22 || $gameSystem.hour() < 4'), cat(A.se('Darkness1'), dire('« …Tu m\'entends ? »', { nom: '???' })), dire('Une tombe usée.'))),
    R('PNJ qui rentre chez lui le soir (s\'efface)', 'Processus parallèle.', si(C.js('$gameSystem.hour() >= 20'), A.effacer())),
    R('Le PNJ de village s\'arrête pour parler (VieDuVillage)', 'Nom de l\'événement : <NPC: forgeron>.', cat(A.plugin('NPC talk forgeron'), dire('« Oui ? »', { nom: 'Forgeron' }))),
    R('Donner à la collecte du village', 'Réputation +2.', si(C.or(50), cat(A.or(-50), A.vrAjout(VAR.reputation, 2), dire('« Merci pour le village ! »')), dire('Il faut 50 \\G.')))
];

var systemes = [
    R('Feu d\'Âme — rituel de repos', '', A.plugin('FEU repos')),
    R('Renaître au dernier Feu d\'Âme', '', A.plugin('FEU renaitre')),
    R('Forge — améliorer une arme', '', A.plugin('FORGE')),
    R('Jour / nuit — basculer', '', A.plugin('TEMPS basculer')),
    R('Forcer le jour', '', A.plugin('TEMPS jour')),
    R('Forcer la nuit', '', A.plugin('TEMPS nuit')),
    R('Marchand qui suit — palier 3 (la ville)', '', A.plugin('MARCHAND 3')),
    R('Jackpot de ludwing — lancer la minute', '', A.plugin('JACKPOT lancer')),
    R('Royaume Impérial — ouvrir (ludwing)', '', A.plugin('DOMAINE ouvrir 3')),
    R('Royaume Impérial — fermer', '', A.plugin('DOMAINE fermer 3')),
    R('Fusion — Chair d\'Âme (héros 1)', '', A.plugin('FUSION chair 1')),
    R('Fusion — finir', '', A.plugin('FUSION fin 1')),
    R('seiryu — passer au palier 2', '', A.plugin('SEIRYU palier 2')),
    R('Lou — voir les techniques copiées', '', A.plugin('LOU copies')),
    R('Écran des Voies', '', A.plugin('VOIES ecran')),
    R('Écran des éléments', '', A.plugin('ELEMENTS')),
    R('Bestiaire — inscrire un ennemi', 'Ennemi 788.', A.plugin('EnemyBook add 788')),
    R('Choisir son marqué (DebutMarques)', '', A.plugin('DEBUT choisir')),
    R('Chute — la bête (pour tester)', '', A.plugin('CHUTE bete 2')),
    R('Donner des âmes (variable 15)', '+10 âmes.', cat(A.vrAjout(15, 10), A.se('Absorb1'), dire('+10 âmes.')))
];

var interfaceMenus = [
    R('Ouvrir le menu', '', A.menu()),
    R('Ouvrir la sauvegarde', '', A.sauver()),
    R('Ouvrir le journal des quêtes', '', A.plugin('OpenQuestJournal')),
    R('Ouvrir le bestiaire', '', A.plugin('EnemyBook open')),
    R('Ouvrir le livre des objets', '', A.plugin('ItemBook open')),
    R('Ouvrir le livre des musiques', '', A.plugin('music_book')),
    R('Cacher l\'or à l\'écran', '', A.plugin('hide_gold_hud')),
    R('Montrer l\'or à l\'écran', '', A.plugin('show_gold_hud')),
    R('Boussole — viser un événement', 'Événement 12.', A.plugin('compass_event_id : 12')),
    R('Boussole — cacher / montrer', '', cat(A.plugin('hide_compass'), A.attendre(60), A.plugin('show_compass'))),
    R('Indicateur au-dessus d\'un PNJ', 'Événement 5.', A.plugin('text_indicator : 5 : !')),
    R('Enlever l\'indicateur', '', A.plugin('clear_indicator : 5')),
    R('Choix en style visual novel — activer', '', A.js('$gameSystem.vnChoices = true;')),
    R('Messages — 6 lignes par boîte', '', A.plugin('MessageRows 6')),
    R('Messages — retour à la ligne automatique', '', A.plugin('EnableWordWrap')),
    R('Retour à l\'écran titre', '', cat(dire('Revenir à l\'écran titre ?'), choix(['Oui', 'Non'], [A.titre(), []])))
];

var utilitaires = [
    R('Lire la position du joueur (X, Y)', '', cat(A.vrJeu(VAR.posX, 5, -1, 0), A.vrJeu(VAR.posY, 5, -1, 1), dire('X \\V[' + VAR.posX + ']  Y \\V[' + VAR.posY + ']'))),
    R('Lire la région sous le joueur', '', cat(A.js('$gameVariables.setValue(' + VAR.region + ', $gameMap.regionId($gamePlayer.x, $gamePlayer.y));'), dire('Région \\V[' + VAR.region + '].'))),
    R('Lire la direction du joueur', '2 bas · 4 gauche · 6 droite · 8 haut.', A.vrJeu(VAR.dir, 5, -1, 2)),
    R('Distance entre le joueur et cet événement', '', A.js('var e = $gameMap.event(this._eventId); $gameVariables.setValue(' + VAR.distance + ', e ? Math.abs(e.x - $gamePlayer.x) + Math.abs(e.y - $gamePlayer.y) : 0);')),
    R('Déplacer cet événement à côté du joueur', '', A.js('var e = $gameMap.event(this._eventId); if (e) e.locate($gamePlayer.x, $gamePlayer.y + 1);')),
    R('Faire face au joueur', '', route(ICI, [M.tVersJoueur])),
    R('Effacer cet événement jusqu\'au prochain passage', '', A.effacer()),
    R('Rendre cet événement traversable', '', route(ICI, [M.traverserOn])),
    R('Tirer un nombre au hasard (1 à 100)', '', A.vrHasard(VAR.tirage, 1, 100)),
    R('Une chance sur deux (branche)', '', si(C.js('Math.random() < 0.5'), dire('Pile.'), dire('Face.'))),
    R('Attendre une seconde', '', A.attendre(60)),
    R('Attendre que le joueur appuie sur OK', 'Boucle jusqu\'à la touche.', D.boucle(cat(si(C.touche('ok'), D.sortirBoucle()), A.attendre(1)))),
    R('Remettre tous les interrupteurs de l\'atelier à OFF', '901 à 999.', A.js('for (var i = 901; i <= 999; i++) $gameSwitches.setValue(i, false);')),
    R('Remettre toutes les variables de l\'atelier à 0', '', A.js('for (var i = 901; i <= 999; i++) $gameVariables.setValue(i, 0);')),
    R('Réinitialiser les interrupteurs locaux de cette carte', '', A.js('var m = $gameMap.mapId(); Object.keys($gameSelfSwitches._data).forEach(function (k) { if (Number(k.split(",")[0]) === m) delete $gameSelfSwitches._data[k]; }); $gameMap.requestRefresh();')),
    R('Afficher un message de débogage (valeurs)', '', dire('Tirage \\V[' + VAR.tirage + ']  ·  Essais \\V[' + VAR.essais + ']  ·  Score \\V[' + VAR.score + ']')),
    R('Tout soigner et tout donner (test)', 'Pour tester vite.', cat(A.soigner(0), A.or(9999), A.objet(1, 20), A.objet(15, 20)))
];

module.exports = [
    { theme: 'Équipe et héros', recettes: equipe },
    { theme: 'Objets et inventaire', recettes: objets },
    { theme: 'Défis et minuteries', recettes: defis },
    { theme: 'Discrétion, gardes, prison', recettes: discretion },
    { theme: 'Animaux', recettes: animaux },
    { theme: 'La vie du village', recettes: village },
    { theme: 'Les systèmes de ton jeu', recettes: systemes },
    { theme: 'Menus et interface', recettes: interfaceMenus },
    { theme: 'Utilitaires', recettes: utilitaires }
];
