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
function PM(n) { return C.js('$gameParty.leader().mp >= ' + n); }
function sort(n, nom, effet) {
    return si(PM(n), cat(A.pm(-n, 0), A.se('Magic1'), effet), cat(A.se('Buzzer1'), dire('Pas assez de PM pour ' + nom + ' (' + n + ').')));
}
// un jour mémorisé pour cet événement, et combien de jours depuis
function marquerJour(cle) { return A.js('($gameSystem._atelierMarque = $gameSystem._atelierMarque || {})["' + cle + ':" + this._mapId + ":" + this._eventId] = $gameSystem.day();'); }
function joursDepuis(cle, n) { return C.js('(function(i){var m=($gameSystem._atelierMarque||{})["' + cle + ':"+i._mapId+":"+i._eventId]; return m !== undefined && $gameSystem.day() - m >= ' + n + ';})(this)'); }
function marque(cle) { return C.js('(function(i){return ($gameSystem._atelierMarque||{})["' + cle + ':"+i._mapId+":"+i._eventId] !== undefined;})(this)'); }
function oublier(cle) { return A.js('delete ($gameSystem._atelierMarque || {})["' + cle + ':" + this._mapId + ":" + this._eventId];'); }

/* ── dialogues avancés ────────────────────────────────────────────────── */
var dialogues = [
    R('Marchander — le prix baisse avec la chance', 'Prix de départ 100 ; la chance du chef fait baisser. « Prix négocié ».',
        cat(A.vrJs(VAR.prix, 'Math.max(50, 100 - Math.floor($gameParty.leader().luk / 2) - Math.randomInt(10))'),
            dire('« Pour toi… \\V[' + VAR.prix + '] or. »', { nom: 'Marchand' }), choix(['Accepter', 'Refuser'], [
                si(C.js('$gameParty.gold() >= $gameVariables.value(' + VAR.prix + ')'), cat(A.js('$gameParty.loseGold($gameVariables.value(' + VAR.prix + '));'), A.objet(11, 1), A.se('Shop1'), dire('« Affaire conclue. »', { nom: 'Marchand' })), dire('« Reviens avec de l\'or. »', { nom: 'Marchand' })),
                dire('« Tant pis pour toi. »', { nom: 'Marchand' })]))),
    R('Intimider — selon l\'attaque du chef', 'Réussit si ATQ du chef ≥ 40.',
        si(C.js('$gameParty.leader().atk >= 40'), cat(A.bulle(ICI, 6), dire('« D-d\'accord ! Je parle ! »', { nom: 'Voyou' }), A.sw(SW.chemin, true)), cat(A.bulle(ICI, 5), dire('« Tu crois me faire peur, toi ? »', { nom: 'Voyou' })))),
    R('Persuader — selon la magie du chef', 'Réussit si MAG du chef ≥ 40.',
        si(C.js('$gameParty.leader().mat >= 40'), cat(A.bulle(ICI, 9), dire('« Vu comme ça… tu as raison. »')), dire('« Je ne suis pas convaincu. »'))),
    R('Mentir — une chance sur deux d\'être cru', 'Réputation −1 si on est pris.',
        cat(choix(['Dire la vérité', 'Mentir'], [dire('« Merci pour ta franchise. »'),
            si(C.js('Math.random() < 0.5'), cat(A.bulle(ICI, 8), dire('« Ah bon ? Bon… d\'accord. »')), cat(A.bulle(ICI, 5), A.vrRetrait(VAR.reputation, 1), dire('« Tu me prends pour un idiot ? »')))]))),
    R('PNJ — pose une question dont il se souviendra', 'Ta réponse va dans « Réponse retenue » (1, 2 ou 3).',
        cat(dire('« Dis-moi : la mer, la forêt ou la montagne ? »'), choix(['La mer', 'La forêt', 'La montagne'], [A.vr(VAR.humeur, 1), A.vr(VAR.humeur, 2), A.vr(VAR.humeur, 3)]), dire('« Je m\'en souviendrai. »'))),
    R('PNJ — rappelle ta réponse d\'avant', 'Lit « Réponse retenue ».',
        si(C.vr(VAR.humeur, '=', 1), dire('« Toujours amoureux de la mer ? »'), si(C.vr(VAR.humeur, '=', 2), dire('« La forêt t\'attend, tu sais. »'), si(C.vr(VAR.humeur, '=', 3), dire('« Et ces montagnes, tu y es allé ? »'), dire('« On se connaît ? »'))))),
    R('PNJ — confidences selon l\'affinité', 'Affinité 0-2 / 3-5 / 6+. Chaque visite +1.',
        cat(A.vrAjout(VAR.affinite, 1), si(C.vr(VAR.affinite, '>=', 6), dire('« Je peux te dire un secret : je ne suis pas d\'ici. »'), si(C.vr(VAR.affinite, '>=', 3), dire('« Tu reviens souvent, toi. Ça me fait plaisir. »'), dire('« Bonjour. »'))))),
    R('Offrir un cadeau — il aime, il déteste', 'Aime la Pomme (44), déteste le Plat Douteux (8).',
        cat(dire('Offrir quelque chose ?'), A.choisirObjet(VAR.objetChoisi, 1),
            si(C.vr(VAR.objetChoisi, '=', 44), cat(A.objet(44, -1), A.vrAjout(VAR.affinite, 3), A.bulle(ICI, 4), dire('« Une pomme ! Ma préférée ! »')),
                si(C.vr(VAR.objetChoisi, '=', 8), cat(A.objet(8, -1), A.vrRetrait(VAR.affinite, 2), A.bulle(ICI, 5), dire('« Tu te moques de moi ? »')),
                    si(C.vr(VAR.objetChoisi, '>', 0), cat(A.js('$gameParty.loseItem($dataItems[$gameVariables.value(' + VAR.objetChoisi + ')], 1);'), A.vrAjout(VAR.affinite, 1), dire('« Oh. Merci. »'))))))),
    R('Dialogue en arbre — deux niveaux de choix', 'Chaque branche a ses sous-questions.',
        cat(dire('« Tu veux savoir quoi ? »'), choix(['Le village', 'La route', 'Rien'], [
            cat(dire('« Le village ? Quoi donc ? »'), choix(['Son histoire', 'Ses habitants'], [dire('« Fondé il y a trois siècles, par des bûcherons. »'), dire('« Des gens simples. Méfie-toi du meunier. »')])),
            cat(dire('« La route ? Laquelle ? »'), choix(['Le nord', 'Le sud'], [dire('« Des loups, au nord. »'), dire('« Le sud est sûr, mais long. »')])),
            dire('« Comme tu veux. »')]))),
    R('PNJ ivre — des phrases qui partent dans tous les sens', 'Réplique au hasard, bulle de sueur.',
        cat(A.bulle(ICI, 6), A.vrHasard(VAR.voix, 1, 3), si(C.vr(VAR.voix, '=', 1), dire('« T\'es mon meilleur ami, toi… *hic* »'), si(C.vr(VAR.voix, '=', 2), dire('« La lune… elle me suit… *hic* »'), dire('« Encore une… juste une… »'))))),
    R('PNJ muet — il répond en bulles', 'Aucun message : seulement des bulles.', cat(A.bulle(ICI, 2), A.attendre(20), A.bulle(ICI, 8), A.attendre(20), A.bulle(ICI, 9))),
    R('PNJ — ne dit son secret que si le héros est seul', 'Il faut une équipe d\'une seule personne.',
        si(C.js('$gameParty.size() === 1'), dire('« Approche. Le passage est derrière la cascade. »'), dire('« Pas devant tes amis. Reviens seul. »'))),
    R('PNJ — rendez-vous le soir', 'Ne parle que de 18 h à 22 h.', si(C.js('$gameSystem.hour() >= 18 && $gameSystem.hour() < 22'), cat(A.bulle(ICI, 4), dire('« Tu es venu… merci. »')), dire('« Reviens ce soir, près de la fontaine. »'))),
    R('PNJ vexé — ne parle plus jusqu\'à un cadeau', 'Interrupteur local A = vexé. Une Pomme (44) le calme.',
        si(C.ss('A'), si(C.objet(44), cat(A.objet(44, -1), A.ss('A', false), A.bulle(ICI, 4), dire('« … Bon. Je te pardonne. »')), cat(A.bulle(ICI, 5), dire('« Hmpf. »'))),
            cat(dire('« Tu as marché sur mes fleurs ! »'), A.bulle(ICI, 5), A.ss('A', true)))),
    R('Négocier sa récompense', 'Or ou objet.', cat(dire('« Merci pour ton aide. Que veux-tu ? »'), choix(['200 or', 'Une potion supérieure'], [cat(A.or(200), A.se('Coin')), cat(A.objet(11, 1), A.se('Item1'))]))),
    R('Interrogatoire — trois questions', 'Deux bonnes réponses : il avoue.',
        cat(A.vr(VAR.essais, 0),
            dire('« Où étais-tu hier soir ? »'), choix(['Au port', 'À la taverne'], [A.vrAjout(VAR.essais, 1), []]),
            dire('« Qui t\'a vu ? »'), choix(['Personne', 'Le garde'], [[], A.vrAjout(VAR.essais, 1)]),
            dire('« Qu\'avais-tu dans ton sac ? »'), choix(['Rien', 'Du pain'], [A.vrAjout(VAR.essais, 1), []]),
            si(C.vr(VAR.essais, '>=', 2), cat(A.bulle(ICI, 6), dire('« … D\'accord ! C\'est moi ! »')), dire('« Tu n\'as rien contre moi. »')))),
    R('PNJ — « tu veux que je répète ? »', 'Boucle tant que le joueur dit oui.',
        boucle(cat(dire('« Au nord, le pont. À l\'est, la tour. Au sud, rien. »'), choix(['Répète', 'Compris'], [[], D.sortirBoucle()])))),
    R('Deux PNJ se disputent — le joueur tranche', 'Réputation +1 d\'un côté.',
        cat(dire('« C\'est MA vache ! »', { nom: 'Fermier' }), dire('« Elle est dans MON champ ! »', { nom: 'Voisin' }),
            choix(['Le fermier a raison', 'Le voisin a raison'], [cat(A.vrAjout(VAR.reputation, 1), dire('« Merci, étranger ! »', { nom: 'Fermier' })), cat(A.vrAjout(VAR.reputation, 1), dire('« Enfin quelqu\'un de sensé. »', { nom: 'Voisin' }))]))),
    R('Salut selon la réputation', '< 0 méfiant · 0-4 poli · 5+ chaleureux.',
        si(C.vr(VAR.reputation, '<', 0), dire('« … Passe ton chemin. »'), si(C.vr(VAR.reputation, '>=', 5), cat(A.bulle(ICI, 4), dire('« Ah, notre héros ! Entre, entre ! »')), dire('« Bonjour, voyageur. »')))),
    R('Devinette — un prix la première fois', 'A = déjà résolue.',
        si(C.ss('A'), dire('« Tu as déjà trouvé. Bravo encore. »'), cat(dire('« Plus j\'ai de gardiens, moins je suis gardé. Qui suis-je ? »'),
            choix(['Un secret', 'Une prison', 'Un trésor'], [cat(A.se('Starlight'), A.objet(15, 2), dire('« Exact ! Prends ça. »'), A.ss('A', true)), dire('« Non. Réfléchis. »'), dire('« Non. Réfléchis. »')])))),
    R('PNJ demande de l\'aide — accepter lance une quête', 'Journal : quête secondaire « aide ».',
        cat(dire('« Mon puits est bouché, tu pourrais regarder ? »'), choix(['J\'y vais', 'Pas le temps'], [cat(A.plugin('QUEST add side aide "Un coup de main" "Déboucher le puits du villageois."'), A.se('Book1'), dire('« Merci ! »')), dire('« Tant pis… »')]))),
    R('Colporteur de rumeurs — 20 or la rumeur', 'Une rumeur au hasard.',
        si(C.or(20), cat(A.or(-20), A.vrHasard(VAR.voix, 1, 3), si(C.vr(VAR.voix, '=', 1), dire('« On a vu de la lumière dans la vieille tour. »'), si(C.vr(VAR.voix, '=', 2), dire('« Le maire cache quelque chose dans sa cave. »'), dire('« Un marchand paie cher les écailles de dragon. »')))), dire('« 20 or, pas moins. »'))),
    R('PNJ qui fait ses adieux et part', 'Il s\'en va en marchant puis disparaît (A).',
        cat(dire('« Je quitte le village. Prends soin de toi. »'), route(ICI, [M.fixeOff, M.bas, M.bas, M.bas, M.opacite(0)]), A.ss('A', true)))
];

/* ── pouvoirs sur la carte (le chef dépense des PM) ───────────────────── */
var pouvoirs = [
    R('Sort de lumière — éclaire la grotte', '5 PM.', sort(5, 'la lumière', cat(A.anim(JOUEUR, 96), A.teinte([0, 0, 0, 0], 40)))),
    R('Sort de soin — soigner le groupe sur la carte', '10 PM.', sort(10, 'soigner', cat(A.anim(JOUEUR, 43), A.js('$gameParty.members().forEach(function(a){ a.gainHp(Math.floor(a.mhp * 0.5)); });')))),
    R('Sort de téléportation — retour au lieu choisi', '20 PM ; destination réglable.', sort(20, 'se téléporter', cat(A.anim(JOUEUR, 40, true), dest(), A.transfertVar(1)))),
    R('Révéler les passages secrets', '8 PM ; allume « Passage secret trouvé ».', sort(8, 'révéler', cat(A.flash([180, 180, 255, 200], 20, true), A.sw(SW.secret, true), dire('Des contours apparaissent dans les murs.')))),
    R('Briser un rocher par la magie', '12 PM ; l\'événement rocher disparaît.', sort(12, 'briser le rocher', cat(A.anim(ICI, 88, true), A.se('Crash'), A.effacer()))),
    R('Geler l\'eau pour traverser', '10 PM ; allume « Chemin dégagé ».', sort(10, 'geler l\'eau', cat(A.anim(ICI, 73, true), A.se('Ice1'), A.sw(SW.chemin, true), dire('L\'eau gèle : on peut marcher dessus.')))),
    R('Allumer une torche à distance', '3 PM ; la torche prend feu (A).', sort(3, 'allumer', cat(A.anim(ICI, 66), route(ICI, [M.image('!Flame', 0), M.pasOn]), A.ss('A', true)))),
    R('Léviter au-dessus d\'un trou', '6 PM ; saut de trois cases dans le sens du joueur.',
        sort(6, 'léviter', cat(A.anim(JOUEUR, 91), A.js('var p = $gamePlayer, d = p.direction(); p.setThrough(true); p.jump(d === 4 ? -3 : d === 6 ? 3 : 0, d === 8 ? -3 : d === 2 ? 3 : 0);'), A.attendre(30), A.js('$gamePlayer.setThrough(false);')))),
    R('Lire les pensées d\'un PNJ', '4 PM ; texte en petit.', sort(4, 'lire ses pensées', cat(A.bulle(ICI, 8), dire('\\}(Pourvu qu\'il ne remarque pas la clé sous le pot…)\\{')))),
    R('Invisibilité — le joueur devient translucide', '8 PM ; allume « Invisible (sort) » et « Joueur caché ».',
        sort(8, 'disparaître', cat(A.js('$gamePlayer.setOpacity(80);'), A.sw(SW.invisible, true), A.sw(SW.cachette, true)))),
    R('Invisibilité — redevenir visible', '', cat(A.js('$gamePlayer.setOpacity(255);'), A.sw(SW.invisible, false), A.sw(SW.cachette, false), A.se('Magic2'))),
    R('Arrêter le temps quelques secondes', '15 PM ; teinte grise, l\'heure MOG s\'arrête 3 s.',
        sort(15, 'arrêter le temps', cat(A.plugin('disable_time'), A.teinte([0, 0, 0, 255], 20, true), A.attendre(180), A.teinte([0, 0, 0, 0], 20), A.plugin('enable_time')))),
    R('Déplacer un objet à distance', '5 PM ; l\'événement avance d\'une case dans le sens du joueur.',
        sort(5, 'déplacer l\'objet', A.js('var e = $gameMap.event(this._eventId), d = $gamePlayer.direction(); if (e.canPass(e.x, e.y, d)) e.moveStraight(d);'))),
    R('Détecter les trésors de la carte', '6 PM ; compte les événements dont le nom contient « coffre ».',
        sort(6, 'détecter', A.js('var n = $gameMap.events().filter(function(e){ return /coffre/i.test(e.event().name); }).length; $gameMessage.add("Tu sens " + n + " trésor(s) sur cette carte.");'))),
    R('Bourrasque — éteindre toutes les lampes', '5 PM ; éteint « Lampes allumées ».', sort(5, 'la bourrasque', cat(A.se('Wind7'), A.anim(JOUEUR, 93), A.sw(SW.lampes, false))))
];

/* ── tutoriels et aide ────────────────────────────────────────────────── */
var tutos = [
    R('Tutoriel — les touches (une seule fois)', 'A = déjà vu.', si(C.ss('A', false), cat(narrer('Flèches : se déplacer.\nEntrée / Espace : parler, fouiller.\nÉchap : le menu.   Maj : courir.'), A.ss('A', true)))),
    R('Tutoriel — le combat', '', narrer('En combat, choisis une action pour chaque héros.\nLes compétences coûtent des PM.\nObserve l\'ennemi : chacun a ses faiblesses.')),
    R('Tutoriel — le menu', '', cat(narrer('Échap ouvre le menu : objets, compétences, équipement, sauvegarde.'), choix(['Ouvrir le menu', 'Plus tard'], [A.menu(), []]))),
    R('Tutoriel — la sauvegarde', '', cat(narrer('Pense à sauvegarder souvent.\nLes cristaux et les lits te le proposent.'), A.sauver())),
    R('Astuce du jour au hasard', 'Cinq astuces (change les textes).',
        cat(A.vrHasard(VAR.voix, 1, 5), si(C.vr(VAR.voix, '=', 1), narrer('Astuce : les coffres rares brillent.'), si(C.vr(VAR.voix, '=', 2), narrer('Astuce : dormir fait passer la nuit.'),
            si(C.vr(VAR.voix, '=', 3), narrer('Astuce : parle deux fois aux habitants.'), si(C.vr(VAR.voix, '=', 4), narrer('Astuce : les monstres sont plus forts la nuit.'), narrer('Astuce : les boutiques changent avec ta progression.'))))))),
    R('Première entrée dans une zone', 'Contact à l\'entrée. A = déjà venu.', si(C.ss('A', false), cat(A.bulle(JOUEUR, 1), A.js('$gameMessage.add("\\\\{" + ($gameMap.displayName() || "Un nouveau lieu") + "\\\\}");'), A.ss('A', true)))),
    R('Rappel de l\'objectif', 'Change le texte (ou lis la quête suivie).', cat(A.se('Book1'), narrer('Objectif : trouver un passage vers le nord.'))),
    R('Panneau d\'aide — relire un tutoriel', 'Au choix.', cat(dire('Quel conseil relire ?'), choix(['Les touches', 'Le combat', 'La sauvegarde', 'Rien'], [
        narrer('Flèches : se déplacer. Entrée : agir. Échap : menu. Maj : courir.'), narrer('Chaque héros agit à son tour. Les compétences coûtent des PM.'), narrer('Sauvegarde aux cristaux, aux lits, dans le menu.'), []]))),
    R('Tutoriel — courir', '', narrer('Maintiens Maj pour courir.\nOn ne court pas dans les maisons, par politesse.')),
    R('Tutoriel — les coffres', 'Avec un exemple : une potion.', cat(narrer('Les coffres se fouillent avec Entrée.\nVoilà de quoi commencer.'), A.objet(1, 1), A.se('Item1'))),
    R('Tutoriel — la pêche', '', narrer('Trouve un point d\'eau avec une canne à pêche.\nAppuie au bon moment quand ça mord.')),
    R('Tutoriel — as-tu compris ? (répète sinon)', 'Boucle jusqu\'au « oui ».',
        boucle(cat(narrer('Pour ouvrir une porte fermée à clé, il faut la clé dans ton sac.'), dire('Compris ?'), choix(['Oui', 'Répète'], [D.sortirBoucle(), []]))))
];

/* ── ferme et vie de tous les jours ───────────────────────────────────── */
var ferme = [
    R('Plante — l\'arroser', 'Mémorise le jour d\'arrosage de cet événement.', cat(A.se('Water1'), marquerJour('arrose'), A.anim(ICI, 81), dire('Tu arroses la plante.'))),
    R('Plante — récolter si elle a été arrosée (2 jours)', 'Deux jours après l\'arrosage : 2 Herbes (3).',
        si(joursDepuis('arrose', 2), cat(A.se('Item1'), A.objet(3, 2), oublier('arrose'), dire('Belle récolte : 2 \\ni[3] !')), si(marque('arrose'), dire('Elle pousse. Encore un peu de patience.'), dire('La terre est sèche. Il faudrait arroser.')))),
    R('Nourrir les poules — des œufs le lendemain', 'Pomme en guise d\'œuf : change l\'objet.',
        si(joursDepuis('poules', 1), cat(A.objet(44, 2), oublier('poules'), A.se('Item1'), dire('Deux œufs dans la paille !')), cat(marquerJour('poules'), A.se('Sand'), dire('Tu jettes du grain aux poules.')))),
    R('Travail à la journée — couper du bois', '4 heures de travail contre 60 or.',
        cat(dire('« Tu veux gagner 60 or ? Coupe-moi ce bois. »', { nom: 'Bûcheron' }), choix(['Au travail', 'Non'], [cat(A.fonduNoir(), A.se('Slash1'), A.js('$gameSystem.add_hour(4);'), A.attendre(40), A.fonduRetour(), A.or(60), dire('Tes bras te font mal. 60 or gagnés.')), []]))),
    R('Payer le loyer', '100 or ; sinon la « Dette » monte.',
        si(C.or(100), cat(A.or(-100), A.se('Coin'), dire('« Loyer payé. À la semaine prochaine. »', { nom: 'Propriétaire' })), cat(A.vrAjout(VAR.dette, 100), dire('« Tu me dois \\V[' + VAR.dette + '] or. »', { nom: 'Propriétaire' })))),
    R('Boîte aux lettres — la lettre du jour', 'Une par jour, au hasard.',
        si(unFoisParJour('lettre'), cat(A.se('Book2'), A.vrHasard(VAR.voix, 1, 3), si(C.vr(VAR.voix, '=', 1), narrer('« Maman va bien. Écris-moi. »'), si(C.vr(VAR.voix, '=', 2), narrer('« Facture : 30 or de grain. »'), narrer('« Tu es invité à la fête du village. »')))), dire('La boîte est vide.'))),
    R('Laver le linge au lavoir', 'Une heure passe.', cat(A.se('Water3'), A.fonduNoir(), A.js('$gameSystem.add_hour(1);'), A.attendre(20), A.fonduRetour(), dire('Le linge sèche au soleil.'))),
    R('Moulin — moudre trois herbes en potion', '3 Herbes (3) → Potion de Groupe (14).',
        si(C.js('$gameParty.numItems($dataItems[3]) >= 3'), cat(A.se('Machine'), A.objet(3, -3), A.objet(14, 1), dire('Une \\ni[14] !')), dire('Il faut 3 \\ni[3].'))),
    R('Épouvantail — lui parler', 'Il ne répond pas. Ou si ?', cat(A.attendre(30), si(C.js('Math.random() < 0.1'), cat(A.bulle(ICI, 1), dire('« … Bonjour. »')), dire('C\'est un épouvantail.')))),
    R('Marché du dimanche', 'Le marché n\'ouvre que le 7e jour de la semaine (jour MOG % 7 = 0).',
        si(C.js('$gameSystem.day() % 7 === 0'), D.boutique([['objet', 44], ['objet', 45], ['objet', 46], ['objet', 9]]), dire('« Le marché, c\'est le dimanche ! »'))),
    R('Tondre un mouton', 'Une fois par jour : « Laine » +1.', si(unFoisParJour('laine'), cat(A.se('Sheep'), A.vrAjout(VAR.laine, 1), dire('De la laine ! (\\V[' + VAR.laine + '])')), cat(A.se('Sheep'), dire('Le mouton a déjà été tondu.')))),
    R('Clôture — la réparer avec du bois', '3 de bois (variable « Bois »). A = réparée.',
        si(C.vr(VAR.bois, '>=', 3), cat(A.vrRetrait(VAR.bois, 3), A.se('Hammer'), A.ss('A', true), dire('La clôture tient de nouveau.')), dire('Il faut 3 de bois.'))),
    R('Serre — une récolte en toute saison', 'Une fois par jour, une Herbe (3).', si(unFoisParJour('serre'), cat(A.objet(3, 1), A.se('Item1'), dire('Tu cueilles une \\ni[3].')), dire('Rien de mûr aujourd\'hui.'))),
    R('Chien de berger — rassembler le troupeau', 'L\'événement court en rond autour du joueur.',
        cat(A.se('Dog'), route(ICI, [M.fixeOff, M.vitesse(5), M.droite, M.bas, M.gauche, M.gauche, M.haut, M.haut, M.droite, M.droite, M.bas, M.gauche, M.vitesse(3)]), dire('Le troupeau est rentré !'))),
    R('Four à pain — cuire des rations', 'Une fois par jour, 2 Rations (46).', si(unFoisParJour('four'), cat(A.se('Fire1'), A.attendre(40), A.objet(46, 2), dire('Deux \\ni[46] toutes chaudes.')), dire('Le four refroidit.'))),
    R('Grenier — ranger ses plantes', 'Les « Plantes » récoltées vont au grenier ; chacune vaut 5 or.',
        si(C.vr(VAR.plantes, '>', 0), cat(A.js('$gameParty.gainGold($gameVariables.value(' + VAR.plantes + ') * 5);'), A.vr(VAR.plantes, 0), A.se('Coin'), dire('Plantes vendues au grossiste.')), dire('Le grenier est vide.'))),
    R('Chant du coq — réveil à 6 h', 'Fondu, 6 h du matin.', cat(A.fonduNoir(), A.js('$gameSystem.set_hour(6); $gameSystem.set_minute(0);'), A.attendre(30), A.fonduRetour(), A.se('Crow'), dire('Cocorico ! Il est 6 h.'))),
    R('Fin de journée — le bilan', 'Or, jours passés, réputation.', A.js('$gameMessage.add("Jour " + $gameSystem.day() + " : " + $gameParty.gold() + " or en poche, réputation " + $gameVariables.value(' + VAR.reputation + ') + ".");'))
];

/* ── événements de carte (déclenchements automatiques, zones) ─────────── */
var carte = [
    R('Première visite — une scène, puis plus jamais', 'Démarrage automatique ; A à la fin.',
        cat(A.attendre(20), A.bulle(JOUEUR, 1), narrer('Tu arrives dans un lieu inconnu.'), A.ss('A', true)), { vitrine: { trigger: 3 } }),
    R('Zone qui soigne', 'Contact, sur chaque case (source, cercle sacré).', cat(A.se('Heal1', 40), A.js('$gameParty.members().forEach(function(a){ a.gainHp(Math.ceil(a.mhp * 0.05)); });'))),
    R('Zone qui empoisonne', 'Contact, sur chaque case (marais, gaz).', cat(A.se('Poison', 40), A.js('$gameParty.members().forEach(function(a){ a.gainHp(-Math.ceil(a.mhp * 0.03)); if (a.hp < 1) a.setHp(1); });'), A.flash([100, 0, 150, 90], 4))),
    R('Zone de silence', 'Contact : la musique s\'éteint en fondu.', cat(A.fonduBgm(2), A.fonduBgs(2))),
    R('Zone de musique', 'Contact : une musique propre à la zone.', A.bgm('Field1', 80)),
    R('Une seule fois par partie — puis disparaît', 'A = fait ; l\'événement s\'efface.', cat(A.se('Item3'), dire('Ceci n\'arrive qu\'une fois.'), A.ss('A', true), A.effacer())),
    R('Revient chaque jour', 'Une fois par jour de jeu MOG.', si(unFoisParJour('chaquejour'), cat(A.se('Item1'), A.objet(1, 1), dire('Une \\ni[1] t\'attendait.')), dire('Reviens demain.'))),
    R('Déclencheur invisible — un PNJ interpelle le joueur', 'Contact, au milieu du chemin.', si(C.ss('A', false), cat(A.bulle(JOUEUR, 1), dire('« Hé, toi ! Attends ! »'), A.ss('A', true)))),
    R('Sortie bloquée tant que la quête n\'est pas acceptée', 'Contact ; lit la quête « exemple ».',
        si(C.js('$gameSystem.questStatus("exemple") !== "active" && $gameSystem.questStatus("exemple") !== "done"'), cat(dire('Tu ne devrais pas partir sans avoir parlé au chef.'), route(JOUEUR, [M.fixeOn, M.arriere, M.fixeOff])))),
    R('La caméra montre la sortie à l\'arrivée', 'Démarrage automatique ; A à la fin.',
        cat(A.defiler(8, 5, 4), A.attendre(40), A.defiler(2, 5, 4), A.attendre(20), A.ss('A', true)), { vitrine: { trigger: 3 } }),
    R('Un levier qui ouvre l\'événement suivant (interrupteur local d\'un autre)', 'Allume l\'interrupteur local A de l\'événement numéro +1.',
        cat(A.se('Switch1'), A.js('$gameSelfSwitches.setValue([this._mapId, this._eventId + 1, "A"], true);'), dire('Quelque chose a bougé.'))),
    R('Suit le joueur de loin', 'Processus parallèle : un pas vers le joueur toutes les demi-secondes.', cat(route(ICI, [M.fixeOff, M.versJoueur], { attendre: false, passer: true }), A.attendre(30))),
    R('Patrouille entre deux points', 'Processus parallèle : 4 cases à droite, 4 à gauche.',
        route(ICI, [M.fixeOff, M.droite, M.droite, M.droite, M.droite, M.att(30), M.gauche, M.gauche, M.gauche, M.gauche, M.att(30)])),
    R('Horloge de carte — un son toutes les 10 secondes', 'Processus parallèle.', cat(A.attendre(600), A.se('Bell3', 40))),
    R('La pluie commence au bout d\'un moment', 'Processus parallèle ; A une fois la pluie lancée.',
        si(C.ss('A', false), cat(A.attendre(300), A.plugin('weather : 1 : 12 : 50 : 50 : 0 : Rain_01A'), A.bgs('Storm1', 50), A.ss('A', true)))),
    R('Porte automatique', 'Contact : elle s\'ouvre, on passe.', cat(A.se('Open5'), route(ICI, D.OUVRIR), dest(), A.transfertVar(0))),
    R('Dalle de téléportation dans la même carte', 'Contact ; change X, Y.', cat(A.se('Teleport'), A.anim(JOUEUR, 40), A.js('$gamePlayer.reserveTransfer($gameMap.mapId(), 5, 5, 2, 2);'))),
    R('Fin de chapitre — texte puis sauvegarde', '', cat(A.fonduBgm(3), A.fonduNoir(), narrer('FIN DU CHAPITRE'), A.fonduRetour(), choix(['Sauvegarder', 'Continuer'], [A.sauver(), []])))
];

/* ── argent et commerce ───────────────────────────────────────────────── */
var argent = [
    R('Banque — emprunter 500 or', 'Variable « Prêt de la banque » +500.', cat(dire('« 500 or, à rendre avec 10 %. »', { nom: 'Banquier' }), choix(['Emprunter', 'Non'], [cat(A.or(500), A.vrAjout(VAR.pret, 550), A.se('Coin')), []]))),
    R('Banque — rembourser le prêt', 'Tout ou rien.',
        si(C.vr(VAR.pret, '<=', 0), dire('« Tu ne nous dois rien. »', { nom: 'Banquier' }), si(C.js('$gameParty.gold() >= $gameVariables.value(' + VAR.pret + ')'),
            cat(A.js('$gameParty.loseGold($gameVariables.value(' + VAR.pret + '));'), A.vr(VAR.pret, 0), A.se('Coin'), dire('« Prêt remboursé. »', { nom: 'Banquier' })), dire('« Il te faut \\V[' + VAR.pret + '] or. »', { nom: 'Banquier' })))),
    R('Salaire — une fois par jour', '50 or par jour de travail.', si(unFoisParJour('salaire'), cat(A.or(50), A.se('Coin'), dire('« Ta paie : 50 or. »')), dire('« Reviens demain. »'))),
    R('Vendre un objet choisi — moitié prix', 'Prix = moitié du prix de base de l\'objet.',
        cat(A.choisirObjet(VAR.objetChoisi, 1), si(C.vr(VAR.objetChoisi, '>', 0), A.js('var it = $dataItems[$gameVariables.value(' + VAR.objetChoisi + ')], p = Math.floor(it.price / 2); $gameParty.loseItem(it, 1); $gameParty.gainGold(p); $gameMessage.add("Vendu : " + it.name + " pour " + p + " or.");')))),
    R('Acheter une maison', '5000 or ; allume « Maison achetée ».',
        si(C.sw(SW.maison), dire('« C\'est chez toi, maintenant. »'), cat(dire('« La maison est à vendre : 5000 or. »'), choix(['Acheter', 'Non'], [si(C.or(5000), cat(A.or(-5000), A.sw(SW.maison, true), A.me('Fanfare1'), dire('Te voilà propriétaire !')), dire('« Il manque de l\'or. »')), []])))),
    R('Péage à la porte de la ville', '10 or pour passer ; sinon on recule.',
        si(C.or(10), cat(A.or(-10), A.se('Coin'), dire('« Bienvenue. »', { nom: 'Garde' })), cat(dire('« 10 or de péage. »', { nom: 'Garde' }), route(JOUEUR, [M.fixeOn, M.arriere, M.fixeOff])))),
    R('Pourboire à l\'aubergiste', '5 or ; réputation +1.', si(C.or(5), cat(A.or(-5), A.vrAjout(VAR.reputation, 1), A.bulle(ICI, 4), dire('« Merci bien ! »')), dire('Tu n\'as pas de monnaie.'))),
    R('Prix qui baisse avec la réputation', 'Boutique : 10 % de remise si réputation ≥ 5.',
        cat(si(C.vr(VAR.reputation, '>=', 5), dire('« Pour toi, prix d\'ami. »'), dire('« Les prix sont les prix. »')), D.boutique([['objet', 1], ['objet', 15]]))),
    R('Enchères — trois tours', 'Chaque tour, on surenchérit ou on abandonne.',
        cat(A.vr(VAR.mise, 100), boucle(cat(dire('« \\V[' + VAR.mise + '] or ! Qui dit mieux ? »', { nom: 'Commissaire' }), choix(['+50', 'J\'abandonne'], [
            cat(A.vrAjout(VAR.mise, 50), si(C.js('Math.random() < 0.4'), cat(D.sortirBoucle()))), cat(A.vr(VAR.mise, 0), D.sortirBoucle())]))),
            si(C.vr(VAR.mise, '>', 0), si(C.js('$gameParty.gold() >= $gameVariables.value(' + VAR.mise + ')'), cat(A.js('$gameParty.loseGold($gameVariables.value(' + VAR.mise + '));'), A.objet(22, 1), dire('« Adjugé ! »', { nom: 'Commissaire' })), dire('« Tu n\'as pas cet or. Enchère annulée. »', { nom: 'Commissaire' }))))),
    R('Coffre de la guilde — contribuer', '100 or ; réputation +2.', si(C.or(100), cat(A.or(-100), A.vrAjout(VAR.reputation, 2), A.se('Coin'), dire('La guilde te remercie.')), dire('Il faut 100 or.'))),
    R('Tombola — 30 or le ticket', '1 chance sur 5 de gagner un objet.',
        si(C.or(30), cat(A.or(-30), si(C.js('Math.random() < 0.2'), cat(A.me('Fanfare1'), A.objet(12, 1), dire('Gagné : une \\ni[12] !')), dire('Perdu.'))), dire('Pas assez d\'or.'))),
    R('Pickpocket — il te prend 10 % de ton or', '', cat(A.bulle(JOUEUR, 1), A.js('var p = Math.floor($gameParty.gold() / 10); $gameParty.loseGold(p); $gameMessage.add("On t\'a volé " + p + " or !");'), route(ICI, [M.fixeOff, M.vitesse(5), M.fuirJoueur, M.fuirJoueur, M.fuirJoueur, M.vitesse(3)])))
];

module.exports = [
    { theme: 'Dialogues avancés', recettes: dialogues },
    { theme: 'Pouvoirs sur la carte', recettes: pouvoirs },
    { theme: 'Tutoriels et aide', recettes: tutos },
    { theme: 'Ferme et vie de tous les jours', recettes: ferme },
    { theme: 'Événements de carte', recettes: carte },
    { theme: 'Argent et commerce', recettes: argent }
];
