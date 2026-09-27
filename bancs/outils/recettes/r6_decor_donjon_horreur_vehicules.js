'use strict';
/* Recettes ajoutées le 2026-09-27 — JOKO : « augmente un peu le nombre de
 * choses comme ça parce que c'est tellement utile ». */
var D = require('./dsl.js');
var A = D.A, C = D.C, M = D.M, SW = D.SW, VAR = D.VAR, si = D.si, choix = D.choix, dire = D.dire, narrer = D.narrer, note = D.note, route = D.route, cat = D.cat, combat = D.combat, boucle = D.boucle;
var ICI = D.CE_EV, JOUEUR = D.JOUEUR;
function R(nom, aide, cmds, o) { return Object.assign({ nom: nom, aide: aide, cmds: cmds }, o || {}); }
function unFoisParJour(cle) {
    return C.js('(function(i){var k="' + cle + ':"+i._mapId+":"+i._eventId, r=$gameSystem._atelierJour=$gameSystem._atelierJour||{}, d=$gameSystem.day(); if(r[k]===d) return false; r[k]=d; return true;})(this)');
}
function dest(carte, x, y) {
    return cat(note('↓ DESTINATION : change ces trois nombres (carte, X, Y).'),
        A.vr(VAR.destCarte, carte || 1), A.vr(VAR.destX, x || 6), A.vr(VAR.destY, y || 8));
}
var OUVRIR = D.OUVRIR, FERMER = D.FERMER;
var PM = function (n) { return C.js('$gameParty.leader().mp >= ' + n); };

/* ── décor de la maison ───────────────────────────────────────────────── */
var decor = [
    R('Piano — jouer un air', 'Un petit air, puis le joueur se retourne.', cat(A.me('Musical1'), A.bulle(JOUEUR, 3), dire('Tu joues quelques notes. Pas si mal.'))),
    R('Miroir — son reflet', 'Le reflet regarde le joueur.', cat(A.se('Reflection', 60), A.bulle(JOUEUR, 8), dire('Ton reflet te regarde. Tu as l\'air fatigué.'))),
    R('Tableau — le contempler', 'Change le texte du tableau.', cat(dire('Un paysage de montagnes sous la neige.\nEn bas, une signature illisible.'))),
    R('Fenêtre — regarder dehors selon l\'heure', 'Jour, soir, nuit (heure MOG).',
        si(C.js('$gameSystem.hour() >= 20 || $gameSystem.hour() < 6'), dire('Dehors, il fait nuit noire. Quelques étoiles.'),
            si(C.js('$gameSystem.hour() >= 17'), dire('Le soleil se couche sur les toits.'), dire('Il fait grand jour. Des gens passent dans la rue.')))),
    R('Chaise — s\'asseoir un moment', 'Le joueur se pose, reprend quelques PV.',
        cat(route(JOUEUR, [M.fixeOn, M.att(30), M.fixeOff]), A.pv(20), dire('Ça fait du bien de s\'asseoir.'))),
    R('Lit — se coucher une heure', 'Une petite heure, sans soin complet.',
        cat(A.fonduNoir(), A.js('$gameSystem.add_hour(1);'), A.pv(50), A.attendre(30), A.fonduRetour(), dire('Une heure de repos.'))),
    R('Baignoire — prendre un bain', 'Retire les états, soigne un peu.',
        cat(A.se('Water1'), A.fonduNoir(), A.js('$gameParty.members().forEach(function(a){ a.clearStates(); });'), A.pv(100), A.attendre(40), A.fonduRetour(), dire('Propre comme un sou neuf.'))),
    R('Cuisinière — cuire une pomme', 'Pomme (44) → Plat Douteux (8). Change les objets.',
        si(C.objet(44), cat(A.se('Fire1'), A.attendre(30), A.objet(44, -1), A.objet(8, 1), dire('Ça sent… étrange. Tu obtiens \\I[0]\\ni[8].')), dire('Il n\'y a rien à cuire.'))),
    R('Vase — le casser (mauvaise idée)', 'Réputation −1, parfois une pièce.',
        cat(A.se('Break'), A.vrRetrait(VAR.reputation, 1), A.vrHasard(VAR.tirage, 1, 3), si(C.vr(VAR.tirage, '=', 1), cat(A.or(15), dire('Des pièces roulent par terre… 15 or.')), dire('Oups.')), A.effacer())),
    R('Horloge coucou — sonne l\'heure', 'Autant de coucous que l\'heure (au plus 12).',
        cat(A.vrJs(VAR.heure, '$gameSystem.hour() % 12 || 12'), A.se('Bell1', 60, 150), dire('Coucou ! Il est \\V[' + VAR.heure + '] heures.'))),
    R('Tapis — une trappe cachée dessous', 'Interrupteur local A : trappe découverte.',
        si(C.ss('A'), cat(dire('Descendre par la trappe ?'), choix(['Descendre', 'Non'], [cat(A.se('Open3'), dest(), A.transfertVar(0)), []])),
            cat(A.se('Move1'), dire('Sous le tapis… une trappe !'), A.ss('A', true)))),
    R('Lustre — il tombe si on tire la corde', 'Dégâts à tout le groupe (jamais mortel).',
        cat(dire('Une corde pend du plafond. Tirer ?'), choix(['Tirer', 'Laisser'], [cat(A.se('Collapse3'), A.trembler(6, 8, 30, true), A.js('$gameParty.members().forEach(function(a){ a.gainHp(-Math.floor(a.mhp * 0.15)); if (a.hp < 1) a.setHp(1); });'), dire('Le lustre s\'écrase à côté de toi !')), []]))),
    R('Rideaux — les ouvrir (la pièce s\'éclaire)', 'Bascule : lumière ou pénombre.',
        si(C.ss('A'), cat(A.se('Close2'), A.teinte([-68, -68, -34, 0], 30), A.ss('A', false)), cat(A.se('Open2'), A.teinte([0, 0, 0, 0], 30), A.ss('A', true)))),
    R('Bureau — écrire dans son journal (sauvegarde)', 'Ouvre l\'écran de sauvegarde.', cat(A.se('Book1'), dire('Tu notes les événements du jour.'), A.sauver())),
    R('Coffre à jouets — un jouet au hasard', 'Un souvenir d\'enfance.',
        cat(A.se('Chest2'), A.vrHasard(VAR.tirage, 1, 3), si(C.vr(VAR.tirage, '=', 1), dire('Un soldat de bois, la peinture écaillée.'), si(C.vr(VAR.tirage, '=', 2), dire('Une toupie. Elle tourne encore.'), dire('Une poupée de chiffon, un bouton en guise d\'œil.'))))),
    R('Bougeoir — allumer (lumière chaude)', 'Teinte chaude sur la pièce.', cat(A.se('Fire1', 60), A.teinte([34, 17, -17, 0], 40), A.ss('A', true))),
    R('Placard — quelqu\'un se cache dedans', 'Un enfant surpris ; bulle « ! ».',
        cat(A.se('Open1'), A.bulle(ICI, 1), dire('« Aaah ! Ne dis à personne que je suis là ! »', { nom: 'Enfant' }))),
    R('Carte murale — montrer la région', 'Affiche le nom de la carte actuelle.',
        cat(A.se('Book2'), A.js('$gameMessage.add("Une carte de la région. Un point marque : " + ($gameMap.displayName() || "ici") + ".");'))),
    R('Sac de farine — prendre une ration', 'Une fois par jour.', si(unFoisParJour('farine'), cat(A.se('Item1'), A.objet(46, 1), dire('Tu prends de quoi faire une \\ni[46].')), dire('Tu as déjà pris ta part aujourd\'hui.'))),
    R('Tonneau de bière — se servir', 'Une Bière (10), une fois par jour.', si(unFoisParJour('biere'), cat(A.se('Water2'), A.objet(10, 1), dire('Tu remplis une chope.')), dire('Le tonneau est vide pour aujourd\'hui.'))),
    R('Fontaine — boire (PM rendus)', 'Rend tous les PM.', cat(A.se('Water1'), A.anim(JOUEUR, 45), A.js('$gameParty.members().forEach(function(a){ a.setMp(a.mmp); });'), dire('L\'eau fraîche te revigore.'))),
    R('Statue — lire la plaque', 'Change le texte de la plaque.', dire('« À ceux qui ont tenu la porte quand tout brûlait. »')),
    R('Globe — le faire tourner', 'L\'événement tourne sur lui-même.', cat(A.se('Switch3'), route(ICI, [M.fixeOff, M.tDroite, M.att(4), M.tHaut, M.att(4), M.tGauche, M.att(4), M.tBas, M.fixeOn]))),
    R('Machine étrange — actionner', 'Un résultat au hasard parmi trois.',
        cat(A.se('Machine'), A.trembler(2, 9, 20, true), A.vrHasard(VAR.tirage, 1, 3),
            si(C.vr(VAR.tirage, '=', 1), cat(A.objet(1, 1), dire('Elle recrache une \\ni[1] !')), si(C.vr(VAR.tirage, '=', 2), cat(A.flash([255, 255, 0, 200], 10), A.pv(-10), dire('Bzzt ! Une décharge.')), dire('Elle s\'arrête. Rien.'))))),
    R('Cadre de travers — le remettre droit', 'Un petit plaisir.', cat(A.se('Equip1'), A.bulle(JOUEUR, 9), dire('Voilà. C\'est mieux.')))
];

/* ── donjons et salles ────────────────────────────────────────────────── */
var donjon = [
    R('Petite clé — la ramasser', 'Variable « Petites clés (donjon) » +1 ; l\'événement disparaît (A).',
        cat(A.se('Item3'), A.vrAjout(VAR.petitesCles, 1), dire('Petite clé ! (\\V[' + VAR.petitesCles + '] en poche)'), A.ss('A', true))),
    R('Porte à petite clé — en utiliser une', 'Page 2 (A) : ouverte. La clé est dépensée.',
        si(C.vr(VAR.petitesCles, '>=', 1), cat(A.vrRetrait(VAR.petitesCles, 1), A.se('Key'), route(ICI, OUVRIR), A.ss('A', true)), cat(A.se('Buzzer1'), dire('Verrouillée. Il faut une petite clé.')))),
    R('Porte du boss — il faut la grande clé', 'Objet 81 (change-le). Demande confirmation.',
        si(C.objet(81), cat(dire('Derrière cette porte, quelque chose respire. Entrer ?'), choix(['Entrer', 'Pas encore'], [cat(A.se('Door4'), A.trembler(3, 4, 20), route(ICI, OUVRIR), dest(), A.transfertVar(0)), []])),
            dire('Une énorme serrure. Il faut la grande clé.'))),
    R('Salle close — les portes se ferment, combat, elles se rouvrent', 'Contact à l\'entrée de la salle. « Salle verrouillée » est ON pendant le combat.',
        si(C.ss('A', false), cat(A.sw(SW.salle, true), A.se('Close3'), A.trembler(4, 6, 20, true), dire('Les portes claquent derrière toi !'),
            combat(3, { victoire: cat(A.sw(SW.salle, false), A.se('Open5'), dire('Les portes se rouvrent.'), A.ss('A', true)), defaite: A.sw(SW.salle, false) })))),
    R('Grille de la salle close — fermée pendant le combat', 'Lit « Salle verrouillée ».',
        si(C.sw(SW.salle), cat(A.se('Buzzer1'), dire('La grille est baissée.')), cat(A.se('Open5'), route(ICI, OUVRIR)))),
    R('Ennemis de la salle — en mettre 3', 'À appeler en entrant : « Ennemis restants » = 3.', A.vr(VAR.ennemis, 3)),
    R('Ennemi de la salle — un de moins', 'À la fin de chaque combat de la salle. À 0, « Portail ouvert ».',
        cat(A.vrRetrait(VAR.ennemis, 1), si(C.vr(VAR.ennemis, '<=', 0), cat(A.sw(SW.portail, true), A.se('Saint1'), dire('La salle est vide. Un passage s\'ouvre.')), dire('Encore \\V[' + VAR.ennemis + '] ennemi(s).')))),
    R('Coffre qui apparaît quand la salle est vide', 'Lit « Ennemis restants ». A = pris.',
        si(C.vr(VAR.ennemis, '<=', 0), cat(A.se('Chest1'), route(ICI, OUVRIR), A.objet(11, 1), dire('Une \\ni[11] !'), A.ss('A', true)), dire('Un coffre scellé. Il réagit aux ennemis présents.'))),
    R('Carte du donjon — la ramasser', 'Une fois (A).', cat(A.se('Item1'), dire('Tu trouves la carte de ce donjon !\nLes salles cachées apparaissent sur le parchemin.'), A.ss('A', true))),
    R('Torche de la salle — l\'allumer (compte)', 'Variable « Torches allumées » +1. A = allumée.',
        si(C.ss('A', false), cat(A.se('Fire1'), route(ICI, [M.image('!Flame', 0), M.pasOn]), A.vrAjout(VAR.torches, 1), A.ss('A', true)))),
    R('Toutes les torches allumées ? (4)', 'À appeler après chaque torche, ou en processus parallèle.',
        si(C.vr(VAR.torches, '>=', 4), si(C.sw(SW.portail, false), cat(A.sw(SW.portail, true), A.se('Saint3'), A.trembler(3, 5, 30), dire('Un mécanisme gronde : la porte s\'ouvre.'))))),
    R('Interrupteur de couleur — rouge / bleu', 'Bascule « Blocs rouges levés ».',
        si(C.sw(SW.blocs), cat(A.sw(SW.blocs, false), A.se('Switch2'), A.flash([0, 120, 255, 160], 10)), cat(A.sw(SW.blocs, true), A.se('Switch2'), A.flash([255, 40, 40, 160], 10)))),
    R('Bloc rouge — infranchissable s\'il est levé', 'À mettre en processus parallèle sur le bloc.',
        cat(si(C.sw(SW.blocs), route(ICI, [M.traverserOff, M.opacite(255)], { attendre: false }), route(ICI, [M.traverserOn, M.opacite(90)], { attendre: false })), A.attendre(10))),
    R('Éboulement — le chemin se ferme derrière', 'Contact. Une fois (A).', si(C.ss('A', false), cat(A.se('Collapse4'), A.trembler(7, 7, 40, true), A.bulle(JOUEUR, 1), dire('Le plafond s\'effondre derrière toi. Plus de retour possible.'), A.ss('A', true)))),
    R('Repos avant le boss — soin puis sauvegarde', 'Le dernier feu avant la porte.', cat(A.se('Heal3'), A.soigner(0), dire('Une lueur apaisante. Sauvegarder ?'), choix(['Sauvegarder', 'Non'], [A.sauver(), []]))),
    R('Pierre de retour — revenir à l\'entrée du donjon', 'Destination réglable.', cat(dire('Revenir à l\'entrée ?'), choix(['Oui', 'Non'], [cat(A.se('Teleport'), dest(), A.transfertVar(1)), []]))),
    R('Levier piégé — une chance sur deux', 'Porte ou monstres.', cat(A.se('Switch1'), si(C.js('Math.random() < 0.5'), cat(A.sw(SW.portail, true), dire('Clac ! Une porte s\'ouvre au loin.')), cat(A.se('Monster1'), dire('Des monstres surgissent !'), combat(2, { fuite: true }))))),
    R('Récompense de fin de donjon', 'Or + objet rare, une fois (A).', cat(A.me('Fanfare2'), A.or(1000), A.objet(22, 1), dire('1000 or et un \\ni[22] !'), A.ss('A', true))),
    R('Autel — y poser le bon objet', 'Choisir un objet du sac ; l\'objet 82 est le bon.',
        cat(dire('Un autel creux. Y poser quelque chose ?'), A.choisirObjet(VAR.objetChoisi, 1),
            si(C.vr(VAR.objetChoisi, '=', 82), cat(A.objet(82, -1), A.se('Saint2'), A.sw(SW.enigme, true), dire('L\'autel s\'illumine.')), si(C.vr(VAR.objetChoisi, '>', 0), dire('Rien ne se passe.'))))),
    R('Plateforme — sauter par-dessus le vide', 'Saut de deux cases dans le sens du joueur.',
        cat(A.se('Jump1'), A.js('var p = $gamePlayer, d = p.direction(); p.jump(d === 4 ? -2 : d === 6 ? 2 : 0, d === 8 ? -2 : d === 2 ? 2 : 0);'), A.attendre(20))),
    R('Raccourci — ouvrir le chemin vers l\'entrée', 'Allume « Chemin dégagé ».', cat(A.se('Open4'), A.sw(SW.chemin, true), dire('Un raccourci vers l\'entrée ! Plus besoin de tout refaire.'))),
    R('Passage à sens unique — on ne revient pas', 'Contact. Si le joueur regarde vers le haut, il est repoussé.',
        si(C.js('$gamePlayer.direction() === 8'), cat(A.bulle(JOUEUR, 6), route(JOUEUR, [M.fixeOn, M.bas, M.fixeOff]), dire('On ne peut pas remonter par là.')))),
    R('Mur fragile — le briser avec une bombe', 'Objet 38 (Bombe Incendiaire).',
        si(C.objet(38), cat(A.objet(38, -1), A.se('Explosion1'), A.anim(ICI, 68, true), A.trembler(6, 8, 20), A.sw(SW.secret, true), A.effacer()), dire('Le mur est fissuré. Une explosion le ferait tomber.'))),
    R('Obscurité totale — il faut une lanterne', 'Objet 7 (Bocal à Lucioles).',
        si(C.objet(7), cat(A.teinte([-34, -34, -17, 0], 30), dire('Le bocal éclaire faiblement le chemin.')), cat(A.teinte([-170, -170, -170, 0], 30), dire('Il fait noir comme dans un four. Il faudrait une lumière.')))),
    R('Étage du donjon — l\'annoncer', 'Variable « Étage ».', cat(A.vrAjout(VAR.etage, 1), A.se('Move3'), narrer('— Étage \\V[' + VAR.etage + '] —')))
];

/* ── horreur et mystère ───────────────────────────────────────────────── */
var horreur = [
    R('Lumière qui vacille', 'Trois clignements.', cat(A.se('Darkness1', 40), A.teinte([-100, -100, -100, 0], 4, true), A.teinte([0, 0, 0, 0], 4, true), A.teinte([-100, -100, -100, 0], 4, true), A.attendre(10), A.teinte([0, 0, 0, 0], 8, true))),
    R('Chuchotements', 'Personne autour.', cat(A.se('Darkness3', 30, 70), dire('\\}…viens… viens voir…\\{'), A.bulle(JOUEUR, 2))),
    R('Des pas derrière le joueur', 'Le joueur se retourne : rien.', cat(A.se('Footstep-slow', 70), A.attendre(40), A.se('Footstep-slow', 80), route(JOUEUR, [M.tDemi]), A.bulle(JOUEUR, 1), A.attendre(20), dire('…Personne.'), route(JOUEUR, [M.tDemi]))),
    R('Apparition dans le miroir', 'L\'événement était invisible : il apparaît un instant.',
        cat(route(ICI, [M.opacite(0)], { attendre: true }), A.se('Darkness5'), route(ICI, [M.opacite(200), M.att(12), M.opacite(0)]), A.flash([255, 255, 255, 120], 6), A.bulle(JOUEUR, 1))),
    R('Porte qui claque toute seule', 'Un courant d\'air ?', cat(A.se('Close1', 100, 80), A.trembler(3, 9, 10), A.bulle(JOUEUR, 1))),
    R('Poupée qui a changé de place', 'L\'événement se déplace d\'une case quand on revient.',
        cat(A.js('var e = $gameMap.event(this._eventId), d = [2,4,6,8][Math.randomInt(4)]; if (e.canPass(e.x, e.y, d)) e.moveStraight(d);'), A.se('Darkness2', 40), dire('Elle n\'était pas là avant… si ?'))),
    R('Écran qui grésille', 'Flash, secousse, bruit.', cat(A.se('Noise'), A.flash([255, 255, 255, 170], 4), A.trembler(2, 9, 12), A.flash([0, 0, 0, 200], 4, true))),
    R('Silence soudain, puis un battement de cœur', 'Coupe musique et ambiance.', cat(A.fonduBgm(1), A.fonduBgs(1), A.attendre(80), A.se('HeartBeat-1shot'), A.attendre(40), A.se('HeartBeat-1shot'))),
    R('Rire d\'enfant au loin', '', cat(A.se('Laugh', 50, 130), A.attendre(20), A.bulle(JOUEUR, 2))),
    R('Une ombre traverse la pièce', 'L\'événement (translucide) passe de gauche à droite et disparaît.',
        cat(route(ICI, [M.traverserOn, M.opacite(120), M.vitesse(6), M.droite, M.droite, M.droite, M.droite, M.opacite(0), M.gauche, M.gauche, M.gauche, M.gauche, M.vitesse(3)]), A.se('Wind4', 50))),
    R('Du sang sur le mur', 'Teinte rouge un instant.', cat(A.se('Damage3', 60), A.teinte([68, -34, -34, 0], 20, true), dire('Des traces rouges. Encore fraîches.'), A.teinte([0, 0, 0, 0], 40))),
    R('Peur — elle monte', 'Variable « Peur » +1 ; à 5, état Terreur (138) sur le groupe.',
        cat(A.vrAjout(VAR.peur, 1), A.se('HeartBeat-1shot'), si(C.vr(VAR.peur, '>=', 5), cat(A.etat(138, true, 0), A.flash([120, 0, 0, 160], 20), dire('Tes mains tremblent. Tu n\'arrives plus à penser.'))))),
    R('Peur — se calmer', 'Remet « Peur » à 0 et retire la Terreur.', cat(A.vr(VAR.peur, 0), A.etat(138, false, 0), A.se('Heal1'), dire('Tu respires. Ça va aller.'))),
    R('Lettre de menace glissée sous la porte', '', cat(A.se('Book2'), narrer('« Nous savons où tu dors. »'), A.bulle(JOUEUR, 1))),
    R('Téléphone qui sonne — décrocher ?', 'Pour un décor moderne ou un rêve.',
        cat(A.se('Phone'), A.attendre(30), A.se('Phone'), choix(['Décrocher', 'Laisser sonner'], [cat(A.se('Noise', 40), dire('… Une respiration. Puis plus rien.')), dire('La sonnerie s\'arrête d\'un coup.')]))),
    R('Statue qui suit le joueur des yeux', 'Elle se tourne vers le joueur.', cat(A.se('Stare', 60), route(ICI, [M.fixeOff, M.tVersJoueur, M.fixeOn]), A.bulle(JOUEUR, 1))),
    R('Un cri au loin', '', cat(A.se('Scream', 60), A.trembler(2, 5, 10), A.bulle(JOUEUR, 1))),
    R('Main qui attrape le joueur', 'Le joueur ne bouge plus une seconde, un peu de dégâts.',
        cat(A.se('Darkness4'), A.flash([60, 0, 0, 200], 10), A.pv(-15), route(JOUEUR, [M.fixeOn, M.att(60), M.fixeOff]), dire('Quelque chose t\'a agrippé la cheville !'))),
    R('Couloir sans fin — on revient au début', 'Contact au bout du couloir : le joueur est replacé 8 cases plus à gauche.',
        cat(A.fonduNoir(), A.js('$gamePlayer.locate(Math.max(0, $gamePlayer.x - 8), $gamePlayer.y);'), A.attendre(10), A.fonduRetour(), A.bulle(JOUEUR, 2))),
    R('Boîte à musique qui démarre seule', '', cat(A.me('Musical3', 60), A.bulle(JOUEUR, 1), dire('Personne n\'a touché à la boîte.'))),
    R('Réveil en sursaut — ce n\'était qu\'un rêve', '', cat(A.se('Shot1', 40), A.flash([255, 255, 255, 255], 10, true), A.teinte([0, 0, 0, 0], 1), A.bulle(JOUEUR, 1), dire('…Un rêve. Ce n\'était qu\'un rêve.'))),
    R('Lieu hanté — l\'ambiance tombe', 'Teinte froide, ambiance sombre.', cat(A.teinte([-34, -17, 17, 34], 60), A.bgs('Darkness', 60)))
];

/* ── véhicules et montures ────────────────────────────────────────────── */
var vehicules = [
    R('Barque — la placer à côté du joueur', 'La barque vient sur la case sous le joueur (sur l\'eau, de préférence).', cat(A.js('$gameMap.boat().setLocation($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y + 1);'), A.se('Water1'))),
    R('Navire — le placer à côté du joueur', '', cat(A.js('$gameMap.ship().setLocation($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y + 1);'), A.se('Water2'))),
    R('Dirigeable — l\'appeler et monter', 'Le dirigeable descend sur le joueur.', cat(A.se('Wind5'), A.js('$gameMap.airship().setLocation($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);'), A.attendre(10), [[206, 0, []]])),
    R('Monter dans le véhicule en face', 'Commande « Monter / descendre du véhicule ».', [[206, 0, []]]),
    R('Descendre du véhicule', 'Seulement si le joueur est dedans.', si(C.js('$gamePlayer.isInVehicle()'), [[206, 0, []]])),
    R('Passeur en barque — traverser le lac', '30 or ; bruit des vagues pendant le fondu.',
        cat(dire('« Je te fais traverser pour 30 or. »', { nom: 'Passeur' }), choix(['Payer', 'Non'], [si(C.or(30), cat(A.or(-30), A.bgs('Sea', 60), A.fonduNoir(), A.attendre(60), A.fonduBgs(1), dest(), A.transfertVar(2), A.fonduRetour()), dire('« Pas d\'or, pas de barque. »', { nom: 'Passeur' })), []]))),
    R('Chariot de mine — le trajet', 'Le joueur file tout droit à grande vitesse vers la droite (8 cases).',
        cat(A.se('Machine'), route(JOUEUR, [M.traverserOn, M.vitesse(6), M.droite, M.droite, M.droite, M.droite, M.droite, M.droite, M.droite, M.droite, M.vitesse(4), M.traverserOff]), A.se('Crash'))),
    R('Téléphérique — monter', 'Fondu, puis transfert.', cat(A.se('Machine'), A.fonduNoir(), A.bgs('Wind', 50), A.attendre(90), A.fonduBgs(1), dest(), A.transfertVar(2), A.fonduRetour())),
    R('Diligence — choisir sa destination', 'Trois villes, prix différents (change les nombres).',
        cat(dire('« Où allons-nous ? »', { nom: 'Cocher' }), choix(['La ville (50 or)', 'Le port (80 or)', 'Rien'], [
            si(C.or(50), cat(A.or(-50), A.se('Horse'), A.vr(VAR.destCarte, 1), A.vr(VAR.destX, 6), A.vr(VAR.destY, 8), A.transfertVar(0)), dire('« Il manque de l\'or. »')),
            si(C.or(80), cat(A.or(-80), A.se('Horse'), A.vr(VAR.destCarte, 1), A.vr(VAR.destX, 6), A.vr(VAR.destY, 8), A.transfertVar(0)), dire('« Il manque de l\'or. »')), []]))),
    R('Radeau — traverser s\'il est construit', 'Lit « Chemin dégagé ».', si(C.sw(SW.chemin), cat(A.se('Water1'), dest(), A.transfertVar(0)), dire('La rivière est trop large. Il faudrait un radeau.'))),
    R('Quai — le bateau passe à heure fixe', 'Départ entre 9 h et 11 h (heure MOG).',
        si(C.js('$gameSystem.hour() >= 9 && $gameSystem.hour() < 11'), cat(A.se('Horn'), dire('« On lève l\'ancre ! »', { nom: 'Marin' }), dest(), A.transfertVar(0)), dire('Un panneau : « Départ de 9 h à 11 h. »'))),
    R('Ascenseur de mine — choisir l\'étage', 'Trois étages ; « Étage » est mis à jour.',
        cat(A.se('Machine'), choix(['Surface', 'Étage 1', 'Étage 2'], [cat(A.vr(VAR.etage, 0), A.vr(VAR.destCarte, 1), A.vr(VAR.destX, 6), A.vr(VAR.destY, 8), A.transfertVar(0)),
            cat(A.vr(VAR.etage, 1), A.vr(VAR.destCarte, 1), A.vr(VAR.destX, 6), A.vr(VAR.destY, 8), A.transfertVar(0)),
            cat(A.vr(VAR.etage, 2), A.vr(VAR.destCarte, 1), A.vr(VAR.destX, 6), A.vr(VAR.destY, 8), A.transfertVar(0))]))),
    R('Pont-levis — le baisser', 'Allume « Pont baissé ».', si(C.sw(SW.pont, false), cat(A.se('Machine'), A.trembler(2, 5, 40, true), A.se('Earth2'), A.sw(SW.pont, true), dire('Le pont-levis s\'abaisse.')), dire('Le pont est déjà baissé.'))),
    R('Monture — siffler le cheval', 'L\'événement cheval vient à côté du joueur.', cat(A.se('Horse'), A.js('var e = $gameMap.event(this._eventId); if (e) e.locate($gamePlayer.x + 1, $gamePlayer.y);'), A.bulle(ICI, 1))),
    R('Musique de voyage le temps d\'un trajet', 'Mémorise la musique, joue un air, puis la rend.', cat(A.garderBgm(), A.me('Fanfare2'), A.attendre(60), A.reprendreBgm()))
];

module.exports = [
    { theme: 'Décor de la maison', recettes: decor },
    { theme: 'Donjons et salles', recettes: donjon },
    { theme: 'Horreur et mystère', recettes: horreur },
    { theme: 'Véhicules et montures', recettes: vehicules }
];
