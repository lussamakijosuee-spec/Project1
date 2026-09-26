'use strict';
var D = require('./dsl.js');
var A = D.A, C = D.C, M = D.M, SW = D.SW, VAR = D.VAR, si = D.si, choix = D.choix, dire = D.dire, note = D.note, route = D.route, cat = D.cat, combat = D.combat;
var ICI = D.CE_EV, JOUEUR = D.JOUEUR;
function R(nom, aide, cmds) { return { nom: nom, aide: aide, cmds: cmds }; }
var BRULURE = 91, GELURE = 94, PARALYSIE = 136, SOMMEIL = 19, SAIGNE = 17, ETOURDI = 134, AFFAIBLI = 123;
function unFoisParJour(cle) {
    return C.js('(function(i){var k="' + cle + ':"+i._mapId+":"+i._eventId, r=$gameSystem._atelierJour=$gameSystem._atelierJour||{}, d=$gameSystem.day(); if(r[k]===d) return false; r[k]=d; return true;})(this)');
}
function dest() { return cat(note('↓ DESTINATION : change ces trois nombres (carte, X, Y).'), A.vr(VAR.destCarte, 1), A.vr(VAR.destX, 6), A.vr(VAR.destY, 8)); }

var pieges = [
    R('Piques au sol — dégâts au passage', 'Contact. 10 % des PV (jamais mortel).', cat(A.se('Sword4'), A.flash([255, 0, 0, 150], 8), A.js('$gameParty.members().forEach(function(a){ a.gainHp(-Math.max(1, Math.floor(a.mhp * 0.1))); if (a.hp < 1) a.setHp(1); });'))),
    R('Piques qui sortent par intermittence', 'Processus parallèle : piques 1 s, rentrées 1 s (interrupteur local A = sorties).',
        cat(A.ss('A', true), A.se('Sword4', 50), A.attendre(60), A.ss('A', false), A.attendre(60))),
    R('Marais empoisonné — chaque pas fait mal', 'Contact, sur chaque case du marais.', cat(A.se('Poison', 60), A.pv(-5), A.flash([100, 0, 150, 120], 6))),
    R('Gaz — brûlure', 'État « Brûlure ».', cat(A.se('Fire2'), A.anim(JOUEUR, 66), A.etat(BRULURE, true), dire('L\'air brûle !'))),
    R('Froid glacial — gelure', 'État « Gelure ».', cat(A.se('Ice4'), A.anim(JOUEUR, 71), A.etat(GELURE, true))),
    R('Piège à ours — paralysé un instant', 'Le joueur ne bouge plus 1 s.', cat(A.se('Slash5'), A.bulle(JOUEUR, 1), A.pv(-20), A.attendre(60), dire('Tu te dégages du piège.'), A.effacer())),
    R('Trappe — chute à l\'étage inférieur', '', cat(A.se('Fall'), dest(), A.transfertVar(2))),
    R('Rocher qui roule vers le joueur', 'L\'événement « rocher » fonce vers le bas.', cat(A.se('Earth4'), A.trembler(4, 6, 20), route(ICI, [M.vitesse(6), M.bas, M.bas, M.bas, M.bas, M.bas]))),
    R('Flèches du mur — esquiver avec de la chance', 'Une chance sur deux.',
        cat(A.se('Crossbow'), A.vrHasard(VAR.tirage, 1, 2), si(C.vr(VAR.tirage, '=', 1), cat(A.pv(-40), A.flash([255, 0, 0, 170], 8), dire('Touché !')), cat(A.se('Evasion1'), dire('Tu esquives de justesse.'))))),
    R('Sol qui s\'effondre derrière le joueur', 'L\'événement disparaît et laisse un trou.', cat(A.se('Collapse3'), A.trembler(2, 8, 20), A.effacer())),
    R('Explosion — tout le groupe', '', cat(A.se('Explosion1'), A.anim(JOUEUR, 70), A.trembler(8, 8, 30), A.flash([255, 200, 100, 255], 15), A.pv(-80))),
    R('Malédiction d\'une statue', 'Affaiblissement.', cat(A.se('Darkness3'), A.anim(JOUEUR, 101), A.etat(AFFAIBLI, true), dire('Une ombre se colle à toi.'))),
    R('Fleur au pollen — endormissement', '', cat(A.se('Pollen'), A.anim(JOUEUR, 33), A.etat(SOMMEIL, true))),
    R('Courant électrique — paralysie', '', cat(A.se('Thunder1'), A.anim(JOUEUR, 76), A.etat(PARALYSIE, true))),
    R('Lave — dégâts lourds et recul', '', cat(A.se('Fire3'), A.pv(-100), route(JOUEUR, [M.fixeOn, M.arriere, M.fixeOff]))),
    R('Glace fine — elle cède', 'Chute à l\'étage du dessous.', cat(A.se('Ice5'), dest(), A.transfertVar(0), dire('La glace a cédé !'))),
    R('Plafond qui descend — sortir avant 10 secondes', 'Minuterie ; perdu = game over.',
        cat(A.minuterie(10), A.se('Earth5'), A.trembler(2, 3, 60), dire('Le plafond descend ! Sors vite !'))),
    R('Plafond — le temps est écoulé', 'À appeler en processus parallèle : si la minuterie tombe à 0.', si(C.minuterie(0, '<='), cat(A.stopMinuterie(), A.se('Collapse4'), A.gameOver()))),
    R('Piège désamorcé — avec le bon objet', 'Objet 42 (Poudre Spectrale).', si(C.objet(42), cat(A.objet(42, -1), A.se('Switch3'), A.sw(SW.piegeArme, false), dire('Piège désamorcé.'), A.effacer()), dire('Un fil tendu. Mieux vaut ne pas y toucher.'))),
    R('Alarme — des gardes arrivent', 'Allume « Alarme donnée », combat.', cat(A.se('Siren'), A.flash([255, 0, 0, 200], 30), A.sw(SW.alarme, true), dire('Une alarme !'), combat(27, { fuite: true }))),
    R('Mimique déguisée en objet au sol', '', cat(A.se('Monster1'), A.bulle(ICI, 1), combat(18, { fuite: true }), A.effacer())),
    R('Vent qui repousse le joueur', 'Trois cases vers le bas.', cat(A.se('Wind1', 80), route(JOUEUR, [M.fixeOn, M.bas, M.bas, M.bas, M.fixeOff])))
];

var recolte = [
    R('Plante — cueillir (revient chaque jour)', 'Herbe Dissipatrice.', si(unFoisParJour('plante'), cat(A.se('Item1'), A.objet(3, 1), A.vrAjout(VAR.plantes, 1), dire('Tu cueilles \\ni[3].')), dire('Déjà cueilli aujourd\'hui.'))),
    R('Buisson de baies', 'Pommes, 1 à 3.', si(unFoisParJour('baies'), cat(A.se('Item1'), A.vrHasard(VAR.tirage, 1, 3), A.js('$gameParty.gainItem($dataItems[44], $gameVariables.value(' + VAR.tirage + '));'), dire('\\V[' + VAR.tirage + '] × \\ni[44].')), dire('Plus rien à cueillir.'))),
    R('Arbre — couper du bois (il faut une hache)', 'Arme 2 (Hache Valo).', si(C.arme(2), cat(A.se('Slash3'), A.trembler(2, 5, 10), A.vrAjout(VAR.bois, 1), dire('+1 bois (\\V[' + VAR.bois + ']).')), dire('Il faudrait une hache.'))),
    R('Filon — miner (il faut une pioche)', 'Arme 2 ici aussi : change le numéro.', si(C.arme(2), cat(A.se('Hammer'), A.anim(ICI, 1), A.vrAjout(VAR.minerai, 1), dire('+1 minerai (\\V[' + VAR.minerai + ']).'), A.ss('A', true)), dire('Il faudrait une pioche.'))),
    R('Filon — minerai rare 10 %', '', cat(A.se('Hammer'), A.vrHasard(VAR.tirage, 1, 10), si(C.vr(VAR.tirage, '=', 1), cat(A.objet(57, 1), A.me('Fanfare1'), dire('Un \\ni[57] !')), cat(A.vrAjout(VAR.minerai, 1), dire('Du minerai.'))))),
    R('Pêche — mini-jeu GALV', 'Il faut la canne (objet 110).', si(C.objet(110), cat(A.fonduNoir(), A.js('Galv.FISH.run();'), A.fonduRetour()), dire('Il te faut une \\ni[110].'))),
    R('Pêche — simple, au hasard', 'Sans mini-jeu.', si(C.objet(110), cat(A.se('Water1'), A.attendre(60), A.vrHasard(VAR.tirage, 1, 3), si(C.vr(VAR.tirage, '=', 1), cat(A.se('Item1'), A.vrAjout(VAR.poissons, 1), A.objet(45, 1), dire('Une prise !')), dire('Rien ne mord.'))), dire('Il faut une canne.'))),
    R('Puits — tirer de l\'eau', 'Eau Magique.', cat(A.se('Water2'), A.objet(2, 1), dire('\\ni[2].'))),
    R('Vache — traire (une fois par jour)', '', si(unFoisParJour('lait'), cat(A.se('Cow'), A.objet(9, 1), dire('\\ni[9].')), cat(A.se('Cow'), dire('Meuh.')))),
    R('Poule — ramasser un œuf', 'Pomme en attendant un œuf : change l\'objet.', si(unFoisParJour('oeuf'), cat(A.se('Item1'), A.objet(44, 1), dire('Un œuf !')), dire('Cot cot.'))),
    R('Champignon — bon ou mauvais', 'Une chance sur trois d\'être malade.',
        cat(A.se('Item1'), A.vrHasard(VAR.tirage, 1, 3), si(C.vr(VAR.tirage, '=', 1), cat(A.etat(AFFAIBLI, true), dire('Il était vénéneux…')), cat(A.objet(8, 1), dire('\\ni[8].'))), A.effacer())),
    R('Artisanat — potion (2 herbes)', 'Deux Herbes Dissipatrices → une Potion Rouge.',
        si(C.js('$gameParty.numItems($dataItems[3]) >= 2'), cat(A.objet(3, -2), A.se('Heal1'), A.objet(1, 1), dire('Tu prépares \\ni[1].')), dire('Il faut 2 × \\ni[3].'))),
    R('Artisanat — forger une épée (5 minerais)', '', si(C.vr(VAR.minerai, '>=', 5), cat(A.vrRetrait(VAR.minerai, 5), A.se('Hammer'), A.se('Hammer'), A.arme(9, 1), dire('\\nw[9] forgée !')), dire('Il faut 5 minerais.'))),
    R('Artisanat — construire un radeau (10 bois)', 'Allume « Chemin dégagé ».', si(C.vr(VAR.bois, '>=', 10), cat(A.vrRetrait(VAR.bois, 10), A.se('Hammer'), A.sw(SW.chemin, true), dire('Le radeau est prêt.')), dire('Il faut 10 bois.'))),
    R('Cuisine — un repas (pomme + viande)', '', si(C.js('$gameParty.hasItem($dataItems[44]) && $gameParty.hasItem($dataItems[45])'), cat(A.objet(44, -1), A.objet(45, -1), A.se('Fire1'), A.objet(46, 2), dire('Deux \\ni[46].')), dire('Il faut une pomme et de la viande.'))),
    R('Cuisine — choisir la recette', 'Trois recettes.',
        cat(dire('Cuisiner quoi ?'), choix(['Ration (pomme+viande)', 'Café (herbe)', 'Rien'], [
            si(C.js('$gameParty.hasItem($dataItems[44]) && $gameParty.hasItem($dataItems[45])'), cat(A.objet(44, -1), A.objet(45, -1), A.objet(46, 1), A.se('Fire1')), dire('Il manque un ingrédient.')),
            si(C.objet(3), cat(A.objet(3, -1), A.objet(47, 1), A.se('Water1')), dire('Il manque une herbe.')), []], { annuler: 2 }))),
    R('Alambic — changer une potion en éther', '', si(C.objet(1), cat(A.objet(1, -1), A.se('Liquid'), A.objet(15, 1)), dire('Il faut une potion.'))),
    R('Vendre ses ressources — au marchand', 'Bois 5 or, minerai 15 or pièce.',
        cat(A.vrJs(VAR.or, '$gameVariables.value(' + VAR.bois + ') * 5 + $gameVariables.value(' + VAR.minerai + ') * 15'), dire('Tout ça vaut \\V[' + VAR.or + '] \\G. Vendre ?'),
            choix(['Vendre', 'Non'], [cat(A.js('$gameParty.gainGold($gameVariables.value(' + VAR.or + '));'), A.vr(VAR.bois, 0), A.vr(VAR.minerai, 0), A.se('Coin')), []]))),
    R('Montrer ses ressources', '', dire('Bois : \\V[' + VAR.bois + ']  ·  Minerai : \\V[' + VAR.minerai + ']  ·  Plantes : \\V[' + VAR.plantes + ']  ·  Poissons : \\V[' + VAR.poissons + ']')),
    R('Fouiller les ordures', 'Parfois de l\'or, parfois un rat.',
        cat(A.vrHasard(VAR.tirage, 1, 4), si(C.vr(VAR.tirage, '=', 1), cat(A.or(15), A.se('Coin'), dire('15 \\G !')), si(C.vr(VAR.tirage, '=', 2), cat(A.se('Monster4'), dire('Un rat !'), combat(1, { fuite: true })), dire('Rien d\'utile.'))))),
    R('Ruche — du miel, et des piqûres', '', cat(A.se('Pollen'), A.objet(59, 1), A.pv(-10), dire('Du miel… et quelques piqûres.'))),
    R('Graine plantée — pousse en trois jours', 'Interrupteur local A = planté ; jour stocké.',
        si(C.ss('A'), si(C.js('$gameSystem.day() - ($gameSystem._atelierPlant||{})[this._mapId+":"+this._eventId] >= 3 || $gameSystem.day() < ($gameSystem._atelierPlant||{})[this._mapId+":"+this._eventId]'),
            cat(A.se('Item1'), A.objet(44, 3), dire('La récolte est prête !'), A.ss('A', false)), dire('Ça pousse.')),
            si(C.objet(6), cat(A.objet(6, -1), A.js('($gameSystem._atelierPlant = $gameSystem._atelierPlant || {})[this._mapId+":"+this._eventId] = $gameSystem.day();'), A.se('Sand'), A.ss('A', true), dire('Tu plantes \\ni[6].')), dire('Un carré de terre.')))),
    R('Coffre de stockage — déposer ses minerais', 'Ils vont dans la variable, en sécurité.', dire('Le coffre garde tes ressources : \\V[' + VAR.minerai + '] minerais.')),
    R('Ramasser un fragment de lore (livre éparpillé)', 'Fragment +1.', cat(A.se('Book2'), A.vrAjout(VAR.fragments, 1), dire('Page \\V[' + VAR.fragments + '] retrouvée.'), A.effacer())),
    R('Donner à manger à un animal', 'Il suit ensuite le joueur.', si(C.objet(45), cat(A.objet(45, -1), A.se('Dog'), A.bulle(ICI, 4), route(ICI, [D.M.versJoueur], { repeter: true, attendre: false })), dire('Il te renifle, méfiant.')))
];

var combats = [
    R('Ennemi sur la carte — combat au contact, puis disparaît', 'Troupe 1.', cat(A.se('Battle1'), combat(1, {}), A.effacer())),
    R('Ennemi — combat, fuite possible', '', combat(2, { fuite: true, victoire: A.effacer(), fuite: route(JOUEUR, [M.arriere]) })),
    R('Ennemi — la défaite ne donne pas un game over', 'On se réveille soigné.', combat(3, { defaite: cat(A.soigner(0), dire('Tu reprends connaissance…')), victoire: A.effacer() })),
    R('Ennemi qui poursuit le joueur (processus parallèle)', '', route(ICI, [M.versJoueur], { repeter: false, attendre: false })),
    R('Ennemi qui revient chaque jour', 'Réapparaît avec l\'interrupteur local A coupé chaque jour.', si(unFoisParJour('ennemi'), A.ss('A', false))),
    R('Boss — présentation, musique, combat', '',
        cat(A.garderBgm(), A.fonduBgm(1), A.trembler(5, 5, 40, true), dire('« Tu es venu mourir ici ? »', { nom: '???' }), A.bgm('Boss-battle'),
            combat(7, { defaite: A.gameOver(), victoire: cat(A.sw(SW.boss, true), A.me('Fanfare2'), A.effacer()) }), A.reprendreBgm())),
    R('Boss — musique de combat choisie', 'Musique de combat changée juste pour ce combat.', cat([[132, 0, [D.audio('Battle-Demonic')]]], combat(7, {}))),
    R('Embuscade — des ennemis surgissent', '', cat(A.se('Stare'), A.bulle(JOUEUR, 1), A.flash([255, 255, 255, 170], 10), combat(10, { fuite: true }))),
    R('Combat d\'entraînement (sans risque)', 'On ne peut pas perdre de vraie partie.', cat(dire('Un duel d\'entraînement ?'), choix(['Oui', 'Non'], [combat(2, { defaite: cat(A.soigner(0), dire('Pas mal pour un début.')), victoire: cat(A.soigner(0), A.xp(50)) }), []]))),
    R('Arène — trois combats d\'affilée', 'On perd tout si on perd un combat.',
        cat(A.vr(VAR.vagues, 0), D.boucle(cat(A.vrAjout(VAR.vagues, 1), dire('Combat \\V[' + VAR.vagues + '] !'),
            combat(2, { defaite: cat(dire('Éliminé.'), A.soigner(0), D.sortirBoucle()) }),
            si(C.vr(VAR.vagues, '>=', 3), cat(A.me('Fanfare2'), A.or(500), dire('Champion ! 500 \\G.'), D.sortirBoucle())))))),
    R('Rencontres aléatoires — couper', '', A.rencontres(false)),
    R('Rencontres aléatoires — remettre', '', A.rencontres(true)),
    R('Ennemi plus fort la nuit', 'Troupe différente selon l\'heure.', si(C.js('$gameSystem.hour() >= 20 || $gameSystem.hour() < 6'), combat(14, {}), combat(2, {}))),
    R('Ennemi — n\'attaque pas si on est discret', 'Si « Joueur caché ».', si(C.sw(SW.cachette), A.bulle(ICI, 2), combat(3, {}))),
    R('Gardien — ne combat qu\'après un avertissement', '', si(C.ss('A'), combat(9, { victoire: A.effacer() }), cat(dire('« Fais demi-tour. »', { nom: 'Gardien' }), route(JOUEUR, [M.arriere]), A.ss('A', true)))),
    R('Butin après combat — objet au hasard', '', cat(combat(2, {}), A.vrHasard(VAR.tirage, 1, 2), si(C.vr(VAR.tirage, '=', 1), cat(A.objet(1, 1), dire('Butin : \\ni[1].'))))),
    R('Combat contre un PNJ qui se rend', 'Victoire : il parle.', cat(combat(3, { victoire: cat(dire('« D\'accord, d\'accord ! Je me rends ! »', { nom: 'Bandit' }), A.or(100)) }))),
    R('Défense — trois vagues d\'ennemis', '',
        cat(A.vr(VAR.vagues, 0), D.boucle(cat(A.vrAjout(VAR.vagues, 1), combat(2, {}), si(C.vr(VAR.vagues, '>=', 3), D.sortirBoucle()))), dire('Le village est sauf.'), A.vrAjout(VAR.reputation, 5))),
    R('Soigner le groupe après un combat', '', cat(A.se('Heal1'), A.soigner(0))),
    R('Game over immédiat (piège mortel)', '', cat(A.se('Collapse2'), A.gameOver())),
    R('Défaite — retour au dernier Feu d\'Âme au lieu du game over', '', combat(3, { defaite: A.plugin('FEU renaitre') })),
    R('Monstre endormi — l\'éviter ou l\'attaquer', 'Attaquer par surprise donne un avantage (1er tour).',
        cat(A.bulle(ICI, 10), dire('Il dort.'), choix(['L\'attaquer', 'Passer'], [cat(A.js('BattleManager._preemptive = true;'), combat(4, {}), A.effacer()), []]))),
    R('Duel — le chef d\'équipe seul', 'Les autres restent sur le côté.', cat(A.js('$gameTemp._duelAvant = $gameParty._actors.slice(); $gameParty._actors = [$gameParty._actors[0]]; $gamePlayer.refresh();'), combat(3, {}), A.js('if ($gameTemp._duelAvant) { $gameParty._actors = $gameTemp._duelAvant; $gamePlayer.refresh(); }'))),
    R('Combat — Theatrhythm (rythme)', 'Ennemi 99, vitesse 5.', A.plugin('theatrhythm : 99 : 5')),
    R('Afficher le bestiaire', '', A.plugin('EnemyBook open'))
];

var quetes = [
    R('Quête — donner (secondaire)', '', cat(dire('« Tu voudrais m\'aider ? »', { nom: 'Mira' }), A.plugin('QUEST add side exemple "Un coup de main" "Mira a besoin d\'aide au moulin."'), A.plugin('QUEST de exemple "Mira" "Ville Forestière"'), A.plugin('QUEST obj exemple "Aller au moulin"'))),
    R('Quête — donner (principale)', '', cat(A.plugin('QUEST add main exemple2 "La route du nord" "Trouver un passage vers le nord."'), A.plugin('QUEST obj exemple2 "Parler au garde"'), A.me('Fanfare1'))),
    R('Quête — accepter ou refuser', '', cat(dire('« Tu prends le contrat ? »', { nom: 'Chef de guilde' }), choix(['Accepter', 'Refuser'], [cat(A.plugin('QUEST add side contrat "Contrat de chasse" "Abattre 5 slimes."'), A.plugin('QUEST chasse contrat 1 5 "Slime"')), dire('« Dommage. »', { nom: 'Chef de guilde' })]))),
    R('Quête — objectif accompli', '', cat(A.se('Starlight'), A.plugin('QUEST step exemple 1'))),
    R('Quête — terminer et récompenser', '', cat(A.plugin('QUEST done exemple'), A.me('Fanfare2'), A.or(200), A.xp(100), dire('Quête accomplie ! 200 \\G.'))),
    R('Quête — échouer', '', cat(A.plugin('QUEST fail exemple'), A.se('Disappointment'))),
    R('Quête — dire l\'état (conditions)', 'Selon la quête « exemple ».',
        si(C.js('$gameSystem.questStatus("exemple") === "done"'), dire('« Merci encore ! »'), si(C.js('$gameSystem.questStatus("exemple") === "active"'), dire('« Alors, ça avance ? »'), dire('« Bonjour. »')))),
    R('Quête de livraison — apporter l\'objet', 'Objet 9 (Lait du Ranch).',
        si(C.objet(9), cat(A.objet(9, -1), A.plugin('QUEST done livraison'), A.or(80), dire('« Parfait, merci ! »')), dire('« Tu as le lait ? »'))),
    R('Quête de chasse — compter les ennemis tués', 'Compteur automatique : 5 bandits.', cat(A.plugin('QUEST add side bandits "Chasse aux bandits" "Cinq bandits rôdent."'), A.plugin('QUEST chasse bandits 1 5 "bandit"'))),
    R('Quête d\'exploration — atteindre un lieu', 'Automatique en arrivant sur la carte 29.', cat(A.plugin('QUEST add side visite "Voir la ville" "Rejoindre la Ville Forestière."'), A.plugin('QUEST visite visite 1 29'))),
    R('Quête — suivre à l\'écran', '', A.plugin('QUEST track exemple')),
    R('Journal des quêtes — ouvrir', '', A.plugin('QUEST ecran')),
    R('Tableau de primes — choisir un contrat', '',
        cat(dire('Le tableau des primes.'), choix(['Loups (100 \\G)', 'Bandits (200 \\G)', 'Rien'], [
            cat(A.plugin('QUEST add side loups "Prime : loups" "Trois loups au nord."'), A.plugin('QUEST prix loups "100 or"')),
            cat(A.plugin('QUEST add side primeBandits "Prime : bandits" "Le chef des bandits."'), A.plugin('QUEST prix primeBandits "200 or"')), []], { annuler: 2 }))),
    R('Escorte — le PNJ suit le joueur', 'À appeler depuis le PNJ : il marche derrière le joueur jusqu\'à l\'arrivée.', cat(dire('« Je te suis. »', { nom: 'Voyageur' }), A.sw(SW.suiveur, true), route(ICI, [M.traverserOn, M.versJoueur], { repeter: true, attendre: false }))),
    R('Escorte — arrivé, le PNJ s\'arrête et paie', 'À appeler depuis le PNJ, sur la case d\'arrivée.', cat(route(ICI, [M.traverserOff, M.tVersJoueur]), A.sw(SW.suiveur, false), dire('« Merci de m\'avoir accompagné. »', { nom: 'Voyageur' }), A.or(150))),
    R('Collecte — 10 plantes', 'Variable « Plantes ».', si(C.vr(VAR.plantes, '>=', 10), cat(A.vrRetrait(VAR.plantes, 10), A.or(120), dire('« 10 plantes, parfait. »')), dire('« Il m\'en faut 10. Tu en as \\V[' + VAR.plantes + ']. »'))),
    R('Enquête — interroger trois témoins', 'Chaque témoin fait +1 ; au bout de 3, la vérité.', cat(A.vrAjout(VAR.essais, 1), si(C.vr(VAR.essais, '>=', 3), dire('Tout concorde : c\'est le meunier !'), dire('Encore \\V[' + VAR.essais + '] témoignage(s) sur 3.')))),
    R('Objet perdu — le rendre à son propriétaire', 'Objet 69 (Vieux couteau de Tobin).', si(C.objet(69), cat(A.objet(69, -1), dire('« Mon couteau ! »', { nom: 'Tobin' }), A.vrAjout(VAR.reputation, 3)), dire('« Tu n\'aurais pas vu mon couteau ? »', { nom: 'Tobin' }))),
    R('Quête à choix moral — deux fins', '',
        cat(dire('Le voleur supplie : « Laisse-moi partir. »'), choix(['Le livrer', 'Le laisser filer'], [cat(A.vrAjout(VAR.reputation, 5), A.or(100), dire('Le garde te remercie.')), cat(A.vrAjout(VAR.reputation, -3), A.objet(22, 1), dire('Il te glisse un \\ni[22].'))]))),
    R('Quête en chaîne — étape suivante si la précédente est finie', '', si(C.js('$gameSystem.questDone("exemple")'), cat(A.plugin('QUEST add side exemple3 "La suite" "Ce n\'était que le début."'), dire('« J\'ai autre chose pour toi. »')), dire('« Finis d\'abord ce que je t\'ai demandé. »'))),
    R('Récompense unique — prise une seule fois', 'Interrupteur « Récompense prise ».', si(C.sw(SW.recompense), dire('« Tu as déjà ta récompense. »'), cat(A.sw(SW.recompense, true), A.armure(3, 1), A.me('Fanfare1'), dire('Tu reçois \\na[3] !')))),
    R('Quête minutée — 60 secondes', 'Minuterie + processus parallèle d\'échec.', cat(A.minuterie(60), A.sw(SW.chrono, true), dire('Vite ! 60 secondes !'))),
    R('Quête minutée — échec quand le temps est écoulé', 'Processus parallèle sur « Défi chronométré en cours ».', si(C.minuterie(0, '<='), cat(A.stopMinuterie(), A.sw(SW.chrono, false), A.plugin('QUEST fail exemple'), dire('Trop tard…')))),
    R('Réputation — un PNJ refuse de parler aux mal vus', '', si(C.vr(VAR.reputation, '<', 0), dire('« Je ne parle pas aux gens comme toi. »'), dire('« Que veux-tu ? »'))),
    R('Lettre à livrer — la remettre', 'Objet 5 : change-le.', si(C.objet(5), cat(A.objet(5, -1), dire('« Une lettre de mon fils ! »'), A.plugin('QUEST done lettre'), A.or(60)), dire('« Tu as du courrier pour moi ? »')))
];

module.exports = [
    { theme: 'Pièges et dangers', recettes: pieges },
    { theme: 'Récolte, artisanat, cuisine', recettes: recolte },
    { theme: 'Combats sur la carte', recettes: combats },
    { theme: 'Quêtes', recettes: quetes }
];
