/*
 * LES SITUATIONS — écrites à la main, pour JOKO, en partant de ce qu'il veut
 * faire (« couper la météo dans une grotte ») et non du plugin qui le fait.
 *
 * carnet_des_plugins.js VÉRIFIE chaque ligne avant d'écrire la page :
 *   · genre 'commande'    → le plugin cité écoute vraiment ce nom ;
 *   · genre 'script'      → la fonction appelée existe dans le code du plugin ;
 *   · genre 'note' / 'commentaire' / 'message' → le mot-clé est lu par le plugin ;
 *   · tout plugin cité est ACTIF.
 * 'mv' = une commande de l'éditeur de RPG Maker, sans plugin.
 *
 * Où va chaque genre :
 *   commande     → Commande d'événement « Commande de plugin » (page 3)
 *   script       → Commande d'événement « Script » (page 3), ou condition « Script »
 *   note         → la case Note (de la carte, de l'objet, de l'ennemi…)
 *   commentaire  → une commande « Commentaire » dans la page de l'événement
 *   message      → dans le texte d'un « Afficher un message »
 */
function C(texte, plugin, ou) { return { genre: 'commande', texte: texte, plugin: plugin, ou: ou || '' }; }
function S(texte, plugin, ou) { return { genre: 'script', texte: texte, plugin: plugin, ou: ou || '' }; }
function N(texte, plugin, ou) { return { genre: 'note', texte: texte, plugin: plugin, ou: ou || '' }; }
function K(texte, plugin, ou) { return { genre: 'commentaire', texte: texte, plugin: plugin, ou: ou || '' }; }
function M(texte, plugin, ou) { return { genre: 'message', texte: texte, plugin: plugin, ou: ou || '' }; }
function V(texte, ou) { return { genre: 'mv', texte: texte, plugin: 'MV', ou: ou || '' }; }

module.exports = [
{
    theme: 'Météo et saisons',
    id: 'meteo',
    intro: 'La météo des saisons vient de quatre événements communs en processus parallèle (Spring, Summer, Fall, Winter). Ils ne tournent que si l\'interrupteur 231 « TS · Météo des saisons » est allumé, et ils remettent leur météo dès qu\'elle manque. La météo MOG n\'appartient à aucune carte : elle te suit partout tant qu\'on ne l\'efface pas.',
    situations: [
        { titre: 'J\'entre dans une grotte, une maison, une autre dimension : plus de météo',
          texte: 'Dans l\'événement de transfert, AVANT le transfert. L\'ordre compte : d\'abord l\'interrupteur, sinon la saison remet sa météo à l\'image suivante.',
          lignes: [V('Contrôle d\'interrupteur : 231 TS · Météo des saisons = OFF'), C('clear_all_weathers', 'MOG_Weather_EX')] },
        { titre: 'Je ressors dehors : la saison reprend',
          texte: 'Rien d\'autre à faire : l\'événement de la saison en cours relance sa météo tout seul.',
          lignes: [V('Contrôle d\'interrupteur : 231 TS · Météo des saisons = ON')] },
        { titre: 'Nouvelle partie qui commence à l\'intérieur (ou dans l\'espace)',
          texte: 'VerrouDesSaisons allume le 231 au lancement d\'une nouvelle partie. Si le jeu commence dedans, éteins-le en première ligne de l\'événement de départ.',
          lignes: [V('Contrôle d\'interrupteur : 231 TS · Météo des saisons = OFF'), C('clear_all_weathers', 'MOG_Weather_EX')] },
        { titre: 'Poser une météo précise (pluie, neige, brouillard, étoiles…)',
          texte: 'weather : COUCHE : TYPE : QUANTITÉ : VITESSE : MÉLANGE : IMAGE. La couche va de 0 à 9 : plusieurs météos peuvent se superposer. La couche 0 est celle des saisons : pour une météo à toi, prends 1 ou plus. Les images sont dans img/weather/. Pense à couper le 231 si tu ne veux pas que la saison s\'y ajoute.',
          lignes: [C('weather : 1 : 12 : 50 : 50 : 0 : Rain_01A', 'MOG_Weather_EX', 'pluie'),
                   C('weather : 1 : 9 : 40 : 30 : 0 : Snow_01', 'MOG_Weather_EX', 'neige'),
                   C('weather : 1 : 22 : 30 : 100 : 0 : Fog_01a', 'MOG_Weather_EX', 'brouillard'),
                   C('weather : 1 : 25 : 20 : 100 : 1 : Star_01A', 'MOG_Weather_EX', 'étoiles filantes (l\'espace)'),
                   C('weather : 1 : 5 : 30 : 100 : 1 : Light_01A', 'MOG_Weather_EX', 'lucioles'),
                   C('weather : 1 : 0 : 40 : 100 : 0 : Sakura_01A', 'MOG_Weather_EX', 'pétales qui tombent')] },
        { titre: 'Enlever une seule couche de météo',
          lignes: [C('clear_weather : 1', 'MOG_Weather_EX', 'efface la couche 1, garde les autres')] },
        { titre: 'Une carte qui a TOUJOURS sa météo à elle',
          texte: 'Dans la note de la carte : elle se pose à chaque arrivée. Exemple réel, Ville Forestière (carte 29).',
          lignes: [N('weather : 0 : 21 : 15 : 100 : 1 : SunLight_01B', 'MOG_Weather_EX', 'note de la carte')] },
        { titre: 'Garder ou couper la météo pendant les combats',
          lignes: [C('battle_weather : true', 'MOG_Weather_EX'), C('battle_weather : false', 'MOG_Weather_EX')] },
        { titre: 'Changer de saison d\'un coup',
          texte: '1 Printemps · 2 Été · 3 Automne · 4 Hiver.',
          lignes: [S('$gameSystem.set_season(4)', 'MOG_TimeSystem', 'passe en hiver'), S('$gameSystem.add_season(1)', 'MOG_TimeSystem', 'saison suivante')] },
        { titre: 'Les types de météo (le 2e nombre)',
          texte: '0 vent qui tombe · 1 vent de côté · 2 vent en zoom · 3 étincelles · 4 champ magique · 5 lucioles · 6 feu des deux côtés · 7 feu d\'un côté · 8 explosion de feu · 9 neige · 10 tempête de neige · 11 gel · 12 pluie · 13 pluie qui éclabousse · 14 pluie en zoom · 15 nuages (brume) · 16 nuages de face · 17 nuages forts · 18-20 aléatoire (20 cosmos) · 21 soleil · 22 brouillard · 23 vapeur · 24 vitesse lumière · 25-26 étoiles filantes · 27 scintillement · 28 rebonds · 29 champ magique en diagonale · 30 bulles · 31 immobile · 32-33 brouillard qui défile · 35-36 calque.',
          lignes: [] }
    ]
},
{
    theme: 'L\'heure, les jours, la nuit',
    id: 'temps',
    intro: 'MOG_TimeSystem fait passer les heures, les jours et les saisons, et teinte l\'écran selon l\'heure. L\'horloge à l\'écran vient de MOG_TimeSystem_Hud.',
    situations: [
        { titre: 'Une carte où le temps n\'existe pas (l\'espace, un rêve, un menu de choix)',
          lignes: [N('<Disable Time System>', 'MOG_TimeSystem', 'note de la carte : ni heure qui passe, ni teinte')] },
        { titre: 'Une grotte ou une maison : le temps passe, mais la nuit ne l\'assombrit pas',
          lignes: [N('<Disable Tint Screen>', 'MOG_TimeSystem', 'note de la carte')] },
        { titre: 'Arrêter puis relancer le temps (pendant une cinématique)',
          lignes: [C('disable_time', 'MOG_TimeSystem'), C('enable_time', 'MOG_TimeSystem')] },
        { titre: 'Cacher puis remontrer l\'horloge',
          lignes: [C('hide_clock', 'MOG_TimeSystem'), C('show_clock', 'MOG_TimeSystem')] },
        { titre: 'Mettre une heure précise, ou avancer le temps',
          lignes: [S('$gameSystem.set_hour(22)', 'MOG_TimeSystem', '22 h'), S('$gameSystem.set_minute(0)', 'MOG_TimeSystem'),
                   S('$gameSystem.add_hour(8)', 'MOG_TimeSystem', 'dormir 8 heures'), S('$gameSystem.add_day(1)', 'MOG_TimeSystem', 'lendemain')] },
        { titre: 'Passer au jour ou à la nuit en une ligne',
          texte: 'Règle l\'heure à 8 h ou 22 h.',
          lignes: [C('TEMPS jour', 'EvenementsUtiles'), C('TEMPS nuit', 'EvenementsUtiles'), C('TEMPS basculer', 'EvenementsUtiles')] },
        { titre: 'Faire aller le temps plus vite ou plus lentement',
          lignes: [S('$gameSystem.set_time_speed(10)', 'MOG_TimeSystem')] },
        { titre: 'Tester l\'heure dans une condition',
          texte: 'Condition « Script » d\'un embranchement conditionnel.',
          lignes: [S('$gameSystem.hour() >= 20', 'MOG_TimeSystem', 'c\'est le soir'), S('$gameSystem.season() === 4', 'MOG_TimeSystem', 'c\'est l\'hiver')] }
    ]
},
{
    theme: 'Cinématiques et histoire',
    id: 'histoire',
    intro: 'Pour raconter le lore avec une image derrière, faire parler des personnages, et choisir un héros. Les commandes « MV » sont celles de l\'éditeur, sans plugin.',
    situations: [
        { titre: 'Préparer l\'écran : plus rien qui dépasse',
          texte: 'Au début de la cinématique. À remettre à la fin avec les commandes « show » correspondantes.',
          lignes: [C('hide_clock', 'MOG_TimeSystem'), C('hide_gold_hud', 'MOG_GoldHud'), C('hide_treasure_hud', 'MOG_TreasureHud'),
                   C('hide_compass', 'MOG_Compass'), C('hide_all_indicators', 'MOG_EventIndicators'), C('disable_time', 'MOG_TimeSystem'),
                   C('JUMPACTION FALSE', 'GALV_JumpAbility', 'le joueur ne saute plus')] },
        { titre: 'Une image du lore en fond, qui vit un peu',
          texte: 'Afficher l\'image avec la commande MV, puis lui donner du mouvement. Le premier nombre est le numéro de l\'image.',
          lignes: [V('Afficher une image : n°1, « ton_image_de_lore », opacité 0'), V('Déplacer une image : n°1, opacité 255, 60 images (fondu)'),
                   C('pic_breath : 1 : 2 : 100', 'MOG_PictureEffects', 'respire doucement'),
                   C('pic_float : 1 : 0 : 100', 'MOG_PictureEffects', 'flotte'),
                   C('pic_qzoom : 1 : 0 : 100 : 1', 'MOG_PictureEffects', 'léger zoom'),
                   C('pic_camera : 1 : true : 30', 'MOG_PictureEffects', 'suit un peu la caméra')] },
        { titre: 'Faire trembler, pivoter ou s\'effondrer une image',
          lignes: [C('pic_shake : 1 : 0 : 6 : 10 : 30', 'MOG_PictureEffects', 'tremble 30 images'),
                   C('pic_swing : 1 : 0 : 100', 'MOG_PictureEffects', 'se balance'),
                   C('pic_collapse : 1 : 0 : 1 : 100', 'MOG_PictureEffects', 's\'efface en s\'effondrant'),
                   C('pic_fade : 1 : 0 : 3 : 10', 'MOG_PictureEffects', 'clignote')] },
        { titre: 'Un portrait qui parle (bouche, clignement)',
          lignes: [C('pic_skit : 2 : 160 : true', 'MOG_PictureEffects', 'image 2 : clignote toutes les 160 images et parle')] },
        { titre: 'Filtres sur tout l\'écran (flou, souvenir, rêve)',
          lignes: [C('filter_effect : 1', 'MOG_PixiFilters'), C('filter_clear', 'MOG_PixiFilters', 'retirer')] },
        { titre: 'Un narrateur ou un personnage qui parle, avec son nom',
          lignes: [M('\\n<Vesper>Tu es enfin réveillée.', 'YEP_MessageCore', 'nom à gauche'), M('\\nc<???>Tu ne devrais pas être ici.', 'YEP_MessageCore', 'nom centré'),
                   M('\\C[2]rouge\\C[0] · \\I[64] icône · \\fs[28] grand · \\fb gras · \\fi italique', 'YEP_MessageCore'),
                   M('\\. pause courte · \\| pause d\'une seconde · \\w[30] 30 images · \\^ ne pas attendre la touche', 'YEP_MessageCore'),
                   M('\\N[1] nom du héros 1 · \\V[15] valeur de la variable 15 · \\ns[124] nom de la compétence 124', 'YEP_MessageCore')] },
        { titre: 'Des messages plus grands, ou qu\'on ne peut pas accélérer',
          lignes: [C('MessageRows 6', 'YEP_MessageCore', '6 lignes par boîte'), C('MessageWidth 600', 'YEP_MessageCore'),
                   C('DisableFastForward', 'YEP_MessageCore', 'pendant une scène importante'), C('EnableFastForward', 'YEP_MessageCore'),
                   C('EnableWordWrap', 'YEP_MessageCore', 'le texte revient à la ligne tout seul')] },
        { titre: 'Des bulles qui parlent sans bloquer le joueur',
          texte: 'Dans un « Afficher un message » : la bulle apparaît sur la cible et se ferme seule. Cible : n° d\'événement, -1 le joueur, 0 l\'événement lui-même.',
          lignes: [M('<c:4,160,0>Il paraît que la forêt a changé.', 'GALV_TimedMessagePopups', 'sur l\'événement 4, 160 images'),
                   M('<c:-1,90,0>Hm ?', 'GALV_TimedMessagePopups', 'sur le joueur'), S('Galv.Mpup.clear()', 'GALV_TimedMessagePopups', 'tout effacer')] },
        { titre: 'Choisir son héros au début (tes quatre personnages)',
          texte: 'Choix MV, puis on vide l\'équipe et on met le héros choisi. Les choix s\'affichent en style visual novel si on l\'active.',
          lignes: [S('$gameSystem.vnChoices = true', 'GALV_VisualNovelChoices', 'choix en grand, au centre'),
                   V('Afficher un choix : Vesper / Korrah / ludwing / Aël'),
                   V('Pour chaque choix : Changer l\'équipe : retirer les autres, ajouter le héros choisi'),
                   V('Transférer le joueur : la carte de départ de ce héros')] },
        { titre: 'Un nom de lieu qui s\'affiche autrement (un rêve, un souvenir)',
          lignes: [S('$gameMap.overrideMapName("Le Vide entre les Sources")', 'Olivia_MapDisplayNameCore'), S('$gameMap.clearOverrideMapName()', 'Olivia_MapDisplayNameCore', 'remettre le vrai nom')] },
        { titre: 'Secousses d\'écran : choisir leur sens',
          lignes: [C('AriesScreenShakeType HORIZONTAL', 'Aries001L_ShakeEffects'), C('AriesScreenShakeType VERTICAL', 'Aries001L_ShakeEffects'), V('Faire trembler l\'écran : force, vitesse, durée')] },
        { titre: 'Fin de la cinématique : tout remettre',
          lignes: [C('show_clock', 'MOG_TimeSystem'), C('show_gold_hud', 'MOG_GoldHud'), C('show_treasure_hud', 'MOG_TreasureHud'),
                   C('show_compass', 'MOG_Compass'), C('show_all_indicators', 'MOG_EventIndicators'), C('enable_time', 'MOG_TimeSystem'),
                   C('JUMPACTION TRUE', 'GALV_JumpAbility'), V('Effacer l\'image : n°1')] }
    ]
},
{
    theme: 'Carte, déplacements, événements',
    id: 'carte',
    intro: 'Ce qu\'on règle sur une carte ou un événement : le saut, les zones interdites, les indicateurs au-dessus des PNJ, la boussole, le brouillard autour du joueur.',
    situations: [
        { titre: 'Empêcher ou permettre le saut',
          lignes: [C('JUMPACTION FALSE', 'GALV_JumpAbility'), C('JUMPACTION TRUE', 'GALV_JumpAbility'),
                   K('<blockJump>', 'GALV_JumpAbility', 'premier commentaire de la page : on ne saute pas par-dessus cet événement')] },
        { titre: 'Des zones où le joueur ou les PNJ ne peuvent pas aller',
          texte: 'Peins la région dans l\'éditeur de carte, puis dans la note de la carte :',
          lignes: [N('<Player Restrict Region: 10>', 'YEP_RegionRestrictions', 'le joueur ne passe pas sur la région 10'),
                   N('<Event Restrict Region: 11>', 'YEP_RegionRestrictions', 'les PNJ ne passent pas sur la région 11'),
                   N('<All Allow Region: 12>', 'YEP_RegionRestrictions', 'tout le monde passe, même sur un décor bloquant')] },
        { titre: 'Marcher sur une zone lance un événement commun',
          lignes: [N('<Region 5 Event: 12>', 'YEP_RegionEvents', 'note de la carte : région 5 → événement commun 12')] },
        { titre: 'Un événement qui se déclenche à distance du joueur',
          lignes: [K('event sensor : 3', 'MOG_EventSensor', 'commentaire de l\'événement : à 3 cases, son interrupteur local D s\'allume ; fais une page conditionnée par D')] },
        { titre: 'Un indicateur au-dessus d\'un PNJ (!, flèche, texte)',
          lignes: [C('indicator : 5 : NewIndicator : 0 : 0', 'MOG_EventIndicators', 'image au-dessus de l\'événement 5'),
                   C('text_indicator : 5 : Nouveau !', 'MOG_EventIndicators'), C('clear_indicator : 5', 'MOG_EventIndicators', 'l\'enlever'),
                   C('hide_all_indicators', 'MOG_EventIndicators'), C('show_all_indicators', 'MOG_EventIndicators')] },
        { titre: 'La boussole vers la prochaine destination',
          lignes: [K('<Destination>', 'MOG_Compass', 'commentaire dans l\'événement visé'), C('compass_event_id : 12', 'MOG_Compass', 'viser l\'événement 12 jusqu\'au prochain transfert'),
                   C('show_compass', 'MOG_Compass'), C('hide_compass', 'MOG_Compass')] },
        { titre: 'Obscurité autour du joueur (grotte, forêt la nuit)',
          texte: 'L\'image vient de img/system/. Elle suit le joueur de carte en carte : enlève-la en sortant. Sa taille et sa transparence sont les variables 153 et 154.',
          lignes: [C('VISRANGE VisibilityRange2', 'GALV_VisibilityRange'), C('VISRANGE X', 'GALV_VisibilityRange', 'l\'enlever')] },
        { titre: 'Effets sur un personnage (fantôme, respiration, éclats)',
          lignes: [C('ghost_mode_event_id : 4 : 1', 'MOG_CharacterMotion', 'l\'événement 4 devient translucide'),
                   C('breath_mode_event_id : 4 : 2', 'MOG_CharacterMotion', 'il respire'), C('float_mode_event_id : 4', 'MOG_CharacterMotion', 'il flotte'),
                   C('clear_effects_event_id : 4', 'MOG_CharacterMotion', 'tout enlever'),
                   C('shatter_event_id : 4 : 0 : 0 : -1', 'MOG_CharShatterEffect', 'il vole en éclats'),
                   C('gtrail_player_id : 0 : true : 0 : 10', 'MOG_CharGhostTrail', 'traînée derrière le joueur'),
                   C('shadow_event_id : 4 : true', 'MOG_CharacterShadow', 'une ombre sous l\'événement 4')] },
        { titre: 'Remettre les événements à leur place d\'origine',
          lignes: [C('ResetAllEventLocations', 'YEP_SaveEventLocations')] },
        { titre: 'Un PNJ de village qui s\'arrête pour parler',
          lignes: [N('<NPC: forgeron>', 'VieDuVillage', 'nom de l\'événement ou note'), C('NPC talk forgeron', 'EvenementsUtiles', 'en tête de sa page'),
                   N('<Vie: garde>', 'VieDuVillage', 'aussi : sedentaire, noctambule, villageois, fixe')] },
        { titre: 'Voyage rapide sur une carte du monde',
          lignes: [S('Galv.MAPT.openMap(1)', 'GALV_MapTravel'), S('Galv.MAPT.enableLocation(1,"Ville Forestière",true)', 'GALV_MapTravel', 'débloquer un lieu')] }
    ]
},
{
    theme: 'Quêtes',
    id: 'quetes',
    intro: 'QuetesDuMonde reçoit la commande QUEST et remplit le journal de YEP (menu « Quêtes »). Les guillemets gardent les espaces.',
    situations: [
        { titre: 'Donner une quête',
          lignes: [C('QUEST add side lait "Le lait de la ferme" "La fermière n\'a plus de quoi livrer."', 'QuetesDuMonde', 'main · side · perso · tuto'),
                   C('QUEST de lait "Mira" "Ville Forestière"', 'QuetesDuMonde', 'qui la donne, où'),
                   C('QUEST obj lait "Rapporter le lait"', 'QuetesDuMonde'), C('QUEST prix lait "50 or"', 'QuetesDuMonde')] },
        { titre: 'Faire avancer, réussir, échouer',
          lignes: [C('QUEST step lait 1', 'QuetesDuMonde', 'l\'objectif 1 est fait'), C('QUEST step lait next', 'QuetesDuMonde'),
                   C('QUEST done lait', 'QuetesDuMonde'), C('QUEST fail lait', 'QuetesDuMonde')] },
        { titre: 'Des objectifs qui se comptent tout seuls',
          lignes: [C('QUEST chasse bandits 1 5 "Bandit"', 'QuetesDuMonde', '5 bandits tués'), C('QUEST visite sortie 1 29', 'QuetesDuMonde', 'arriver sur la carte 29'),
                   C('QUEST commande repos 1 1 FEU', 'QuetesDuMonde', 'se reposer une fois à un Feu d\'Âme')] },
        { titre: 'Suivre une quête à l\'écran, ouvrir le journal',
          lignes: [C('QUEST track lait', 'QuetesDuMonde'), C('QUEST untrack', 'QuetesDuMonde'), C('QUEST ecran', 'QuetesDuMonde')] },
        { titre: 'Tester une quête dans une condition',
          lignes: [S('$gameSystem.questStatus(\'lait\') === \'active\'', 'QuetesDuMonde', 'active · done · failed · none'),
                   S('$gameSystem.questDone(\'lait\')', 'QuetesDuMonde'), S('$gameSystem.questObjDone(\'lait\', 1)', 'QuetesDuMonde')] }
    ]
},
{
    theme: 'Combat et boss',
    id: 'combat',
    intro: 'Le système de combat, l\'écran de victoire, les boss et leurs mécaniques.',
    situations: [
        { titre: 'Changer de système de combat',
          lignes: [C('setBattleSys DTB', 'YEP_BattleEngineCore', 'tour par tour'), C('setBattleSys CTB', 'YEP_BattleEngineCore', 'par charge')] },
        { titre: 'Couper l\'écran ou la musique de victoire (combat scénarisé)',
          lignes: [C('DisableVictoryAftermath', 'YEP_VictoryAftermath'), C('EnableVictoryAftermath', 'YEP_VictoryAftermath'),
                   C('DisableVictoryMusic', 'YEP_VictoryAftermath'), C('EnableVictoryMusic', 'YEP_VictoryAftermath')] },
        { titre: 'Faire d\'un ennemi un boss',
          texte: 'Il reçoit la carte-titre, la barre en haut de l\'écran et le plafond des compétences en % de PV.',
          lignes: [N('<Boss>', 'ScenesDeBoss', 'note de l\'ennemi')] },
        { titre: 'Donner une mécanique à un boss',
          lignes: [N('<MecaBoss: flair>', 'MecaniquesDeBossSuite', 'note de l\'ennemi : une des 27 mécaniques'),
                   N('<MecaCompteARebours: 5>', 'MecaniquesDeBoss', 'ou l\'une des douze d\'origine'),
                   N('<Telegraphe>', 'BossTelegraphe', 'note de la compétence de mise en garde'),
                   N('<Apres: surcharge>', 'BossTelegraphe', 'note de la grosse frappe')] },
        { titre: 'L\'IA d\'un ennemi',
          lignes: [N('<AI Priority>\nEVAL user.enCharge(): Skill 985, Random\nHP% param <= 40%: Skill 984, Random\nALWAYS: Skill 833, Random\n</AI Priority>', 'YEP_BattleAICore', 'note de l\'ennemi')] },
        { titre: 'Le bestiaire et le livre des objets',
          lignes: [C('EnemyBook open', 'EnemyBook'), C('EnemyBook add 788', 'EnemyBook', 'inscrire un ennemi'), C('ItemBook open', 'ItemBook')] }
    ]
},
{
    theme: 'Objets, argent, boutiques, menus',
    id: 'objets',
    intro: 'Ce qui touche à l\'inventaire, aux marchands et aux écrans du menu.',
    situations: [
        { titre: 'Donner ou retirer de l\'or',
          lignes: [C('GainGold 500', 'YEP_CoreEngine'), C('LoseGold 200', 'YEP_CoreEngine')] },
        { titre: 'Un marchand dont le stock suit la progression',
          lignes: [C('MARCHAND 1', 'LeMarchandQuiSuit', 'forge de village · jusqu\'à 5 paliers'), C('MARCHAND armes 3', 'LeMarchandQuiSuit', 'seulement les armes, jusqu\'au palier 3')] },
        { titre: 'La forge, le Feu d\'Âme',
          lignes: [C('FORGE', 'EvenementsUtiles', 'ouvre l\'amélioration d\'équipement'), C('FEU repos', 'EvenementsUtiles', 'soigne et devient le point de renaissance'),
                   C('FEU renaitre', 'EvenementsUtiles', 'dans un événement de défaite')] },
        { titre: 'Montrer ou cacher l\'amélioration d\'objets dans le menu',
          lignes: [C('ShowItemUpgrade', 'YEP_X_ItemUpgradeSlots'), C('HideItemUpgrade', 'YEP_X_ItemUpgradeSlots'),
                   C('EnableItemUpgrade', 'YEP_X_ItemUpgradeSlots'), C('DisableItemUpgrade', 'YEP_X_ItemUpgradeSlots')] },
        { titre: 'Afficher ou cacher l\'or et les trésors à l\'écran',
          lignes: [C('show_gold_hud', 'MOG_GoldHud'), C('hide_gold_hud', 'MOG_GoldHud'), C('show_treasure_popup', 'MOG_TreasurePopup'), C('hide_treasure_popup', 'MOG_TreasurePopup')] },
        { titre: 'Ouvrir un écran',
          lignes: [C('OpenQuestJournal', 'YEP_QuestJournal', 'journal des quêtes'), C('music_book', 'MOG_Music_Book', 'livre des musiques'),
                   C('ELEMENTS', 'VisualMaxEX', 'écran des éléments'), C('VOIES ecran', 'MaitriseVoies', 'les cinq Voies'), S('Galv.MLEVEL.levelUp(1)', 'GALV_ManualLevel', 'monter de niveau à la main')] }
    ]
},
{
    theme: 'Mini-jeux',
    id: 'minijeux',
    intro: 'Chacun s\'ouvre en une ligne.',
    situations: [
        { titre: 'La roue des prix',
          lignes: [S('Galv.PRIZE.addPrizes("i1,20","w12,1","a4,2")', 'Galv_PrizeWheel', '20 objets n°1, 1 arme n°12, 2 armures n°4'), S('Galv.PRIZE.start()', 'Galv_PrizeWheel'), S('Galv.PRIZE.give()', 'Galv_PrizeWheel', 'donne le prix tiré')] },
        { titre: 'La pêche',
          lignes: [S('Galv.FISH.run()', 'GALV_Fishing'), S('Galv.FISH.viewStats()', 'GALV_Fishing', 'tableau des prises')] },
        { titre: 'Le tir vu de haut',
          lignes: [S('ChampDeTir.lancer()', 'ChampDeTir')] },
        { titre: 'Le jeu de rythme',
          lignes: [C('theatrhythm : 99 : 5', 'MOG_Theatrhythm', 'ennemi 99, vitesse 5')] }
    ]
},
{
    theme: 'Les systèmes des héros',
    id: 'heros',
    intro: 'Les commandes des systèmes écrits pour ton jeu.',
    situations: [
        { titre: 'ludwing : le Pari Mortel et le Royaume',
          lignes: [C('JACKPOT lancer', 'JackpotHakari'), C('JACKPOT win', 'JackpotHakari'), C('JACKPOT fail', 'JackpotHakari'), C('JACKPOT arreter', 'JackpotHakari'),
                   C('DOMAINE ouvrir 3', 'RoyaumeImperial'), C('DOMAINE fermer 3', 'RoyaumeImperial')] },
        { titre: 'Les fusions de mana',
          lignes: [C('FUSION chair 1', 'FusionMana'), C('FUSION rasoir 1', 'FusionMana'), C('FUSION songe 1', 'FusionMana'), C('FUSION fin 1', 'FusionMana')] },
        { titre: 'seiryu',
          lignes: [C('SEIRYU palier 2', 'SeiryuLeFamilier'), C('SEIRYU experience 40', 'SeiryuLeFamilier'), C('SEIRYU oublier', 'SeiryuLeFamilier')] },
        { titre: 'Lou et les âmes',
          lignes: [C('LOU copies', 'LouCopySystem'), C('LOU clear_copies', 'LouCopySystem'), C('LOU add_copy 124', 'LouCopySystem'),
                   N('<Invocation: 3>', 'InvocationAmes', 'note d\'une compétence : coûte 3 âmes')] },
        { titre: 'Les chutes et la santé mentale',
          lignes: [C('CHUTE bete 2', 'EvenementsUtiles', 'errant · bete · dement · dechire · fond · calme'), C('AME bon 1 1', 'JadeEntitePlunging', 'héros 1 (Vesper) : +1 de sérénité'), C('AME mauvais 1 1', 'JadeEntitePlunging', 'la clé peut aussi être l\'ancien prénom : thylane 1 · neyssa 2 · lou 3 · tianna 4')] },
        { titre: 'Les cinématiques d\'ultime',
          lignes: [C('ULTI cutin Nom de l\'attaque | #ff3355 | Sous-titre', 'UltiCinematics'), C('AURA #00ffcc', 'UltiCinematics'), C('BURST #ffd700', 'UltiCinematics')] }
    ]
},
{
    theme: 'Son, sauvegarde, réglages',
    id: 'systeme',
    intro: 'Le reste du quotidien.',
    situations: [
        { titre: 'Vider le cache audio (si un son se bloque)',
          lignes: [C('FlushAudioCache ALL', 'Irina_AntiAudioDelay')] },
        { titre: 'Un interrupteur ou une variable qui survit à toutes les sauvegardes',
          texte: 'Pas de commande : on l\'écrit dans le NOM de l\'interrupteur ou de la variable, dans la base de données.',
          lignes: [N('Fin vue <Global Meta>', 'Olivia_MetaControls', 'nom d\'un interrupteur : partagé par toutes les parties'),
                   N('Coffres <Local Meta>', 'Olivia_MetaControls', 'partagé par les sauvegardes d\'une même partie')] }
    ]
}
];
