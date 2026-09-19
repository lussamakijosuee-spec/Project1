/*
 * À QUOI SERT CHACUN DES 130, EN FRANÇAIS
 * ---------------------------------------------------------------------------
 * Le @plugindesc de chaque plugin est en anglais, souvent en une ligne sèche
 * (« #IconsAreMasterRace »). Ce fichier n'est pas un banc : c'est le
 * dictionnaire que 17_les_130_plugins.js va chercher pour écrire le document
 * dans la langue de JOKO.
 *
 * Chaque ligne dit ce que le plugin FAIT, et quand elle peut, ce qu'il
 * ferait DANS CE JEU-LÀ. C'est de la traduction, pas de la conception :
 * aucune de ces phrases ne décide de quoi que ce soit.
 */
'use strict';
module.exports = {

    /* ── les quinze écrans de menu ── */
    'SRD_AltMenuScreen_BustIcons': 'Menu à bustes : un grand portrait par héros, des icônes pour les commandes.',
    'SRD_AltMenuScreen_BustSelect': 'Menu à bustes où l\'on choisit un héros en cliquant son portrait ; montre aussi son sprite de combat.',
    'SRD_AltMenuScreen_Down': 'Menu avec les commandes en bas et les héros en carré 2 × 2.',
    'SRD_AltMenuScreen_FF7': 'Menu copié sur celui de Final Fantasy VII.',
    'SRD_AltMenuScreen_Face': 'Menu qui ne montre que les visages — plus de place pour une grande équipe.',
    'SRD_AltMenuScreen_FaceBars': 'Rallonge du menu « Face » : ajoute les jauges de PV et de PM sous les visages.',
    'SRD_AltMenuScreen_IconCycle': 'Menu en icônes que l\'on fait défiler une par une.',
    'SRD_AltMenuScreen_Icons': 'Menu où chaque commande est une icône au lieu d\'un mot.',
    'SRD_AltMenuScreen_Info': 'Menu à visages, avec les informations détaillées à côté.',
    'SRD_AltMenuScreen_KH': 'Menu copié sur celui de Kingdom Hearts.',
    'SRD_AltMenuScreen_List': 'Menu en liste : nom, PV, PM par ligne. Plus de place pour les commandes.',
    'SRD_AltMenuScreen_Mobile': 'Menu à grosses touches, pensé pour le doigt sur un écran tactile.',
    'SRD_AltMenuScreen_Phantasia': 'Menu copié sur celui de Tales of Phantasia.',
    'SRD_AltMenuScreen_Right': 'Le menu habituel, mais collé à droite.',
    'SRD_AltMenuScreen_Up': 'Menu avec les commandes en haut et les héros en carré 2 × 2.',

    /* ── Pokémon ── */
    'SRD_PKM_4MovesOnly': 'Limite chaque héros à QUATRE compétences apprises, comme un Pokémon.',
    'SRD_PKM_MoveDeleter': 'Un écran pour oublier une compétence apprise, afin d\'en apprendre une autre.',
    'SRD_PKM_TrainerName': 'Saisie de nom façon dresseur, avec un écran dédié.',
    'SRD_PKM_TrainerSprite': 'Des sprites de dresseur masculin et féminin, indépendants du héros.',
    'SRD_PKM_TypeDisplay': 'Affiche les éléments d\'un héros dans son écran de statut, comme un type Pokémon.',
    'SRD_PKM_TypeSystem': 'Le système de types Pokémon plaqué sur les éléments de RPG Maker.',
    'SRD_Natures': 'Les « natures » de Pokémon : chaque héros naît avec une force et une faiblesse.',

    /* ── invocations ── */
    'SRD_SummonCore': 'Une compétence qui fait ENTRER un héros invoqué dans l\'équipe, pour quelques tours.',
    'SRD_ReplaceSummons': 'L\'invocation REMPLACE l\'invocateur au lieu de s\'ajouter à lui.',
    'SRD_SummonBattlerImages': 'Donne aux invocations une grande image fixe au lieu d\'un sprite animé.',

    /* ── attaques chronométrées ── */
    'SRD_TimedAttackCore': 'Le socle : frapper plus fort en appuyant au bon moment.',
    'SRD_TimedAttack_Arrows': 'Il faut taper une suite de flèches, dans l\'ordre et dans le temps.',
    'SRD_TimedAttack_Circle': 'Un cercle rétrécit ; il faut l\'arrêter quand il touche la cible.',
    'SRD_TimedAttack_Clock': 'Une aiguille tourne ; il faut l\'arrêter dans la zone verte.',
    'SRD_TimedAttack_Mash': 'Il faut marteler une touche le plus vite possible.',
    'SRD_TimedAttack_Wheel': 'Des commandes tournent autour d\'un anneau ; il faut appuyer au bon passage.',
    'SRD_TimedAttack_Results': 'Une bulle qui annonce le résultat du minutage : raté, bien, parfait.',
    'SRD_TimedAttack_ActionSequences': 'Permet d\'appeler une attaque chronométrée depuis une séquence d\'action Yanfly.',

    /* ── défense active ── */
    'SRD_ActiveDefenseCore': 'Esquiver ou contrer l\'attaque d\'un ennemi en appuyant au bon moment.',
    'SRD_ActiveDefense_Charge': 'Une défense qu\'il faut CHARGER avant de pouvoir esquiver.',

    /* ── créateur de personnage ── */
    'SRD_CharacterCreator': 'Le joueur assemble son propre sprite, pièce par pièce.',
    'SRD_CharacterCreatorEX': 'La version étendue du créateur de personnage.',
    'SRD_CCEX_DynamicActors': 'Les images d\'un héros changent toutes seules selon sa classe ou son équipement.',
    'SRD_CCEX_MessageFaces': 'Plusieurs expressions de visage pour un personnage créé, utilisables dans les dialogues.',

    /* ── HUD ── */
    'SRD_HUDMaker': 'Dessiner un HUD de carte à la souris, DANS le jeu, sans écrire une ligne.',
    'SRD_HUDMakerMultilineText': 'Ajoute au HUD Maker un bloc de texte sur plusieurs lignes.',

    /* ── équilibrage ── */
    'SRD_StatDistribution': 'Des points à répartir soi-même dans les statistiques, à chaque niveau.',
    'SRD_TPUpgrade': 'Refait le système de points de technique : gain, plafond, affichage.',
    'SRD_MapSlipDamage': 'Refait les dégâts subis en marchant (poison, brûlure) : rythme, affichage, son.',
    'SRD_WeaponGuard': 'Chaque arme a sa propre parade au lieu de la garde générique.',
    'SRD_EquipCompareUpgrade': 'Choisir quelles statistiques se comparent quand on change d\'équipement.',

    /* ── caméras ── */
    'SRD_CameraCore': 'La caméra sait zoomer, viser un personnage, le suivre.',
    'SRD_SmoothCamera': 'Adoucit tous les mouvements de caméra au lieu de les faire sauter.',
    'SRD_AutoCamera': 'La caméra se déplace toute seule selon la région que le joueur traverse.',

    /* ── combat redessiné ── */
    'SRD_BattleGUICore': 'Refait entièrement la disposition des fenêtres de combat.',
    'SRD_BattleStatusCustomizer': 'Choisir ce qu\'affiche la barre d\'état du combat, et comment (partie 1).',
    'SRD_BattleStatusCustomizer_Part2': 'La suite : la position et la forme de chaque élément de la barre d\'état.',
    'SRD_BattlePopupCustomizer': 'Les chiffres de dégâts : police, couleur, taille, trajectoire, par élément.',
    'SRD_StatePopups': 'Des bulles qui annoncent l\'état posé ou retiré, en plus des dégâts.',
    'SRD_BattleLogUpgrade': 'Le journal de combat : ce qu\'il dit, combien de temps, à quelle vitesse.',
    'SRD_WalkCharBattlers': 'Utiliser les sprites de marche comme combattants, au lieu des sprites de combat.',

    /* ── à ne pas allumer ── */
    'SRD_DataCompressor': 'Compresse les fichiers de data/ pour réduire leur taille. ⚠ L\'éditeur et les bancs ne les lisent plus.',
    'SRD_AutoUpdater': 'Le jeu va chercher ses mises à jour sur un serveur au lancement. ⚠ Aucun serveur ici.',
    'SRD_PluginUpdater': 'Vérifie si les plugins SRD ont une version plus récente en ligne.',
    'SRD_RemoveTitleScreen': 'Supprime l\'écran-titre : le jeu démarre directement. ⚠ JOKO a monté un titre entier.',
    'SRD_SkipTitleWithoutSave': 'Saute le titre s\'il n\'y a aucune sauvegarde.',
    'SRD_RemoveFadedContinue': 'Enlève le « Continuer » grisé quand il n\'y a rien à continuer.',
    'SRD_TranslationEngine': 'Un outil pour traduire le jeu dans plusieurs langues, depuis le jeu.',
    'SRD_SpellCheck': 'Vérifie l\'orthographe des textes. ⚠ Dictionnaire anglais.',

    /* ── titre et fin ── */
    'SRD_TitleMapBackground': 'Une CARTE du jeu qui tourne derrière l\'écran-titre, au lieu d\'une image fixe.',
    'SRD_PressStart': 'Un « Appuyez sur une touche » avant que le menu du titre apparaisse.',
    'SRD_TitlePictureChoices': 'Les commandes du titre deviennent des images animées au lieu de mots.',
    'SRD_TitleCommandCustomizer': 'Choisir quelles commandes apparaissent au titre, et dans quel ordre.',
    'SRD_GameOverCore': 'L\'écran de mort : un événement commun, un choix, autre chose qu\'un retour au titre.',
    'SRD_RetryUpgrade': 'Après un combat perdu, un écran pour réessayer, s\'équiper, ou abandonner.',
    'SRD_RetryCosts': 'Faire payer un prix — or, objet, statistique — pour réessayer un combat.',
    'SRD_CreditsPlugin': 'Un écran de crédits rangé par catégories.',
    'SRD_MovieCredits': 'Des crédits qui défilent vers le haut, comme au cinéma.',
    'SRD_CEBattleIntro': 'Un événement commun joué comme introduction d\'un combat.',
    'SRD_CustomBattleIntro': 'Régler dans le détail l\'effet de transition vers un combat aléatoire.',

    /* ── le lot branché ── */
    'SRD_GameUpgrade': 'Le socle de huit autres SRD ; seul, il pilote la fenêtre du jeu sur le bureau.',
    'SRD_PreloaderCore': 'Charge sons et images AVANT d\'en avoir besoin. Le remède au gel quand un décor apparaît.',
    'SRD_OptionsUpgrade': 'Range les options en catégories au lieu d\'une liste qui déborde.',
    'SRD_MasterVolume': 'Un volume général, au-dessus de la musique et des bruitages.',
    'SRD_FullscreenToggleOption': 'Le plein écran depuis les options, sans connaître F4.',
    'SRD_QuitConfirmation': 'Demande confirmation avant de quitter, et propose de sauvegarder.',
    'SRD_WindowFrameAntiStretch': 'Le cadre des fenêtres se répète au lieu de s\'étirer et de baver.',
    'SRD_WindowLayers': 'Chaque fenêtre sur son propre plan : plus de fenêtre qui passe sous une autre.',
    'SRD_MenuBackgrounds': 'Un fond et une transparence réglables pour chaque menu.',
    'SRD_CustomColors': 'Les couleurs du texte (PV bas, PM, états) réglables sans repeindre Window.png.',
    'SRD_IndividualSkinsForWindows': 'Une apparence de fenêtre différente par menu.',
    'SRD_GoldWindowCustomizer': 'La fenêtre d\'or : ce qu\'elle montre, où, sous quelle forme.',
    'SRD_InMenuUsageUpgrade': 'La fenêtre qui s\'ouvre quand on utilise un objet depuis le menu.',
    'SRD_ShakingText': 'Du texte qui tremble dans un dialogue. Pour une voix qui craque, une menace.',
    'SRD_ShakingWindows': 'La fenêtre sous le curseur tremble légèrement.',
    'SRD_BlinkingFaces': 'Les visages clignent des yeux pendant les dialogues.',
    'SRD_AutoNameBox': 'La boîte de nom se remplit toute seule d\'après le visage utilisé.',
    'SRD_AudioFader': 'Les musiques montent et descendent en douceur au lieu de se couper net.',
    'SRD_TimerUpgrade': 'Le chronomètre : position, format, couleur, pause automatique.',
    'SRD_BattleEndEvents': 'Un événement commun à la fin d\'un combat, différent selon victoire, défaite ou fuite.',
    'SRD_BattleBackScroll': 'Les décors de combat défilent — un ciel qui bouge derrière un boss.',
    'SRD_WaitOptions': 'Attendre une touche, la fin d\'un son, une condition — pas seulement des images.',
    'SRD_VideoWait': 'L\'événement attend tout seul la fin d\'une vidéo.',
    'SRD_PluginComEvals': 'Du JavaScript dans une commande de plugin : elle peut lire une variable.',
    'SRD_VariableRates': 'Une variable qui monte ou descend toute seule dans le temps.',
    'SRD_CollisionChecker': 'Demander depuis un événement si une case est libre.',
    'SRD_RestrictMovementDirections': 'Interdire une direction sous condition : couloir à sens unique, falaise.',
    'SRD_RandomEncounterSwitches': 'Couper ou rétablir les rencontres aléatoires par interrupteur, carte par carte.',
    'SRD_SequenceInput': 'Lire une touche PENDANT une séquence d\'action Yanfly. La brique d\'un contre.',
    'SRD_RepeatUpgrade': 'Le « répéter » d\'une compétence : intervalle, cible changeante, dégâts croissants.',
    'SRD_ActorSelect': 'Un écran pour choisir un héros depuis un événement.',
    'SRD_PictureChoices': 'Un choix par images au lieu de mots : portraits, cartes, symboles.',
    'SRD_SellShop': 'Une boutique de rachat, avec ses propres prix.',
    'SRD_SwitchShop': 'Une boutique qui vend des interrupteurs : un service, un passage, une information.',
    'SRD_NameInputUpgrade': 'L\'écran de saisie de nom, en mieux : clavier, majuscules, longueur.',
    'SRD_MetronomeSkill': 'Une compétence qui en déclenche une autre au hasard.',
    'SRD_SwipeInput': 'Lire un glissement de doigt ou de souris.',
    'SRD_SuperToolsEngine': 'Un éditeur dans le jeu, en mode test. Socle du HUD Maker. Invisible pour le joueur.',
    'SRD_Debug_SpeedUp': 'Accélérer le jeu pendant un test.',

    /* ── le reste ── */
    'SRD_BitmapUpgrade': 'Transformer les couleurs d\'une image en jeu : teinte, saturation, négatif.',
    'SRD_CharacterChoices': 'Un choix où l\'on sélectionne un personnage animé plutôt qu\'une ligne de texte.',
    'SRD_CopyActors': 'Avoir plusieurs exemplaires du même héros dans l\'équipe.',
    'SRD_CustomFaces': 'Plusieurs expressions de visage pour un même personnage, dans les dialogues.',
    'SRD_Debug': 'Un écran de débogage : voir et changer variables, interrupteurs, états en jeu.',
    'SRD_DynamicActors': 'Les sprites et images d\'un héros changent selon sa classe, son arme, son état.',
    'SRD_EnemyBulkDrops': 'Régler les butins de plusieurs ennemis d\'un coup. ⚠ Réclame YEP_ExtraEnemyDrops, absent ici.',
    'SRD_FontOption': 'Le joueur choisit sa police dans les options. ⚠ Il n\'y a qu\'une police dans fonts/.',
    'SRD_IndependentCharSprite': 'Le sprite du joueur reste le même quel que soit le meneur de l\'équipe.',
    'SRD_MenuStatusCustomizer': 'Choisir ce qu\'affiche la fiche d\'un héros dans le menu.',
    'SRD_OptionsCreator': 'Créer ses propres options dans le menu des options.',
    'SRD_SkillExtender': 'Une compétence qui demande un SECOND choix au joueur avant de partir.',
    'SRD_UndertaleBattleSystem': 'Un combat où l\'on esquive des projectiles au clavier, comme dans Undertale.',
    'SRD_WindowOpenUpgrade': 'Régler l\'animation d\'ouverture et de fermeture des fenêtres.',
    'SRD_WindowSkinOption': 'Le joueur choisit l\'apparence des fenêtres. ⚠ Réclame des images dans img/SumRndmDde/.',
    'SRD_WindowUpgrade': 'Refait le système de fenêtres : marges, polices, tailles. ⚠ Écrase 21 réglages de YEP_CoreEngine.'
};
