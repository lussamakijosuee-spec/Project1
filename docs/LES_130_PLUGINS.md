# Les 130 plugins installés

*Écrit par `bancs/audit/17_les_130_plugins.js`. Les trois premières colonnes sont
mesurées ; le verdict est un avis, et JOKO tranche. Aucun plugin n'est allumé,
éteint ni supprimé par ce banc.*

## En deux chiffres

| | |
|---|---:|
| fichiers SRD sur le disque | 130 |
| **branchés et mesurés** | **38** |
| inscrits mais éteints | 0 |
| jamais inscrits (donc invisibles pour le jeu) | 92 |

> Un fichier posé dans `js/plugins/` ne fait **rien**. RPG Maker ne charge que
> ce qui est inscrit dans `js/plugins.js`, et dans cet ordre-là.

---

## 15 · LES ÉCRANS DE MENU ALTERNATIFS  —  *exclusif*

Ils font tous la même chose : remplacer l'écran du menu principal. On n'en
allume qu'UN, jamais deux. Et tous réécrivent sèchement les mêmes fonctions
que YEP_MainMenuManager, qui range aujourd'hui les onglets de JOKO (Quêtes,
Musiques, Éléments). En allumer un, c'est reprendre cet écran à zéro.
Ça peut valoir le coup — mais c'est une décision, pas un réglage.
(FaceBars n'est pas un menu : c'est une rallonge du menu « Face ».)

| plugin | état | écrase | ce qu'il fait |
|---|---|---:|---|
| `AltMenuScreen_BustIcons` | pas inscrit | ⚠ 9 | Menu à bustes : un grand portrait par héros, des icônes pour les commandes. |
| `AltMenuScreen_BustSelect` | pas inscrit | ⚠ 6 | Menu à bustes où l'on choisit un héros en cliquant son portrait ; montre aussi son sprite de combat. |
| `AltMenuScreen_Down` | pas inscrit | ⚠ 7 | Menu avec les commandes en bas et les héros en carré 2 × 2. |
| `AltMenuScreen_FF7` | pas inscrit | ⚠ 2 | Menu copié sur celui de Final Fantasy VII. |
| `AltMenuScreen_Face` | pas inscrit | ⚠ 5 | Menu qui ne montre que les visages — plus de place pour une grande équipe. |
| `AltMenuScreen_FaceBars` | pas inscrit | ⚠ 1 | Rallonge du menu « Face » : ajoute les jauges de PV et de PM sous les visages. |
| `AltMenuScreen_IconCycle` | pas inscrit | ⚠ 6 | Menu en icônes que l'on fait défiler une par une. |
| `AltMenuScreen_Icons` | pas inscrit | ⚠ 6 | Menu où chaque commande est une icône au lieu d'un mot. |
| `AltMenuScreen_Info` | pas inscrit | ⚠ 6 | Menu à visages, avec les informations détaillées à côté. |
| `AltMenuScreen_KH` | pas inscrit | ⚠ 5 | Menu copié sur celui de Kingdom Hearts. |
| `AltMenuScreen_List` | pas inscrit | ⚠ 6 | Menu en liste : nom, PV, PM par ligne. Plus de place pour les commandes. |
| `AltMenuScreen_Mobile` | pas inscrit | ⚠ 7 | Menu à grosses touches, pensé pour le doigt sur un écran tactile. |
| `AltMenuScreen_Phantasia` | pas inscrit | ⚠ 7 | Menu copié sur celui de Tales of Phantasia. |
| `AltMenuScreen_Right` | pas inscrit | — | Le menu habituel, mais collé à droite. |
| `AltMenuScreen_Up` | pas inscrit | ⚠ 7 | Menu avec les commandes en haut et les héros en carré 2 × 2. |

---

## 7 · LES PLUGINS POKÉMON  —  *étranger*

Un système de types à la Pokémon, des natures, un effaceur de capacités, et
SRD_PKM_4MovesOnly qui limite chaque héros à QUATRE compétences. Le jeu en
compte 354 et quatre arbres de progression. Ce n'est pas un réglage à
ajuster : c'est un autre jeu.

| plugin | état | écrase | ce qu'il fait |
|---|---|---:|---|
| `Natures` | pas inscrit | ⚠ 1 | Les « natures » de Pokémon : chaque héros naît avec une force et une faiblesse. |
| `PKM_4MovesOnly` | pas inscrit | — | Limite chaque héros à QUATRE compétences apprises, comme un Pokémon. |
| `PKM_MoveDeleter` | pas inscrit | — | Un écran pour oublier une compétence apprise, afin d'en apprendre une autre. |
| `PKM_TrainerName` | pas inscrit | — | Saisie de nom façon dresseur, avec un écran dédié. |
| `PKM_TrainerSprite` | pas inscrit | — | Des sprites de dresseur masculin et féminin, indépendants du héros. |
| `PKM_TypeDisplay` | pas inscrit | — | Affiche les éléments d'un héros dans son écran de statut, comme un type Pokémon. |
| `PKM_TypeSystem` | pas inscrit | — | Le système de types Pokémon plaqué sur les éléments de RPG Maker. |

---

## 3 · LES INVOCATIONS  —  *utile*

SRD_SummonCore fait entrer un héros invoqué dans l'équipe, le temps de
quelques tours. SRD_ReplaceSummons le fait REMPLACER l'invocateur.
SRD_SummonBattlerImages leur donne une image fixe au lieu d'un sprite animé.
⚠ Je ne les allume pas : ils touchent au Royaume Impérial des Ténèbres, et
le lore appartient à JOKO. C'est à lui de dire si « utiliser les techniques
de toutes les invocations » se joue comme ça.
Ils écrasent 13 fonctions de YEP_BattleEngineCore : à vérifier en combat.

| plugin | état | écrase | ce qu'il fait |
|---|---|---:|---|
| `ReplaceSummons` | pas inscrit | — | L'invocation REMPLACE l'invocateur au lieu de s'ajouter à lui. |
| `SummonBattlerImages` | pas inscrit | — | Donne aux invocations une grande image fixe au lieu d'un sprite animé. |
| `SummonCore` | pas inscrit | — | Une compétence qui fait ENTRER un héros invoqué dans l'équipe, pour quelques tours. |

---

## 8 · LES ATTAQUES CHRONOMÉTRÉES  —  *utile*

Appuyer au bon moment pour frapper plus fort : une roue, une horloge, un
cercle qui rétrécit, des flèches, un martèlement. Cinq façons, plus le socle
et un affichage de résultat. Ça changerait la nature des combats — ils sont
au tour par tour CTB aujourd'hui. Gros potentiel pour les boss ; à décider.

| plugin | état | écrase | ce qu'il fait |
|---|---|---:|---|
| `TimedAttackCore` | pas inscrit | — | Le socle : frapper plus fort en appuyant au bon moment. |
| `TimedAttack_ActionSequences` | pas inscrit | — | Permet d'appeler une attaque chronométrée depuis une séquence d'action Yanfly. |
| `TimedAttack_Arrows` | pas inscrit | ⚠ 2 | Il faut taper une suite de flèches, dans l'ordre et dans le temps. |
| `TimedAttack_Circle` | pas inscrit | ⚠ 2 | Un cercle rétrécit ; il faut l'arrêter quand il touche la cible. |
| `TimedAttack_Clock` | pas inscrit | ⚠ 2 | Une aiguille tourne ; il faut l'arrêter dans la zone verte. |
| `TimedAttack_Mash` | pas inscrit | ⚠ 2 | Il faut marteler une touche le plus vite possible. |
| `TimedAttack_Results` | pas inscrit | — | Une bulle qui annonce le résultat du minutage : raté, bien, parfait. |
| `TimedAttack_Wheel` | pas inscrit | — | Des commandes tournent autour d'un anneau ; il faut appuyer au bon passage. |

---

## 2 · LA DÉFENSE ACTIVE  —  *utile*

Esquiver ou contrer l'attaque d'un ennemi en appuyant au bon moment.
ludwing a « Contre totale » ; c'est l'outil qui la rendrait jouable au lieu
de la laisser passive. Même remarque : ça change la nature des combats.

| plugin | état | écrase | ce qu'il fait |
|---|---|---:|---|
| `ActiveDefenseCore` | pas inscrit | — | Esquiver ou contrer l'attaque d'un ennemi en appuyant au bon moment. |
| `ActiveDefense_Charge` | pas inscrit | — | Une défense qu'il faut CHARGER avant de pouvoir esquiver. |

---

## 4 · LE CRÉATEUR DE PERSONNAGE  —  *incomplet*

Il laisse le joueur assembler son propre sprite pièce par pièce. Il lui faut
un dossier img/SumRndmDde/CharacterCreator rempli de cheveux, d'yeux, de
vêtements — ce dossier n'existe pas ici. Et les héros de ce jeu ont un
visage : ce n'est pas un jeu où l'on se fabrique un inconnu.

| plugin | état | écrase | ce qu'il fait |
|---|---|---:|---|
| `CCEX_DynamicActors` | pas inscrit | — | Les images d'un héros changent toutes seules selon sa classe ou son équipement. |
| `CCEX_MessageFaces` | pas inscrit | ⚠ 1 | Plusieurs expressions de visage pour un personnage créé, utilisables dans les dialogues. |
| `CharacterCreator` | pas inscrit | ⚠ 2 | Le joueur assemble son propre sprite, pièce par pièce. |
| `CharacterCreatorEX` | pas inscrit | ⚠ 2 | La version étendue du créateur de personnage. |

---

## 2 · LE HUD SUR MESURE  —  *exclusif*

SRD_HUDMaker dessine un HUD de carte à la souris, dans le jeu. Séduisant —
mais l'écran de JOKO porte déjà l'or, les trésors, la boussole, l'horloge et
les saisons, tous en MOG. Deux systèmes de HUD sur le même écran se
marchent dessus. Il faudrait choisir : refaire tout le HUD ici, ou garder
MOG. Son socle SRD_SuperToolsEngine, lui, EST branché.

| plugin | état | écrase | ce qu'il fait |
|---|---|---:|---|
| `HUDMaker` | pas inscrit | — | Dessiner un HUD de carte à la souris, DANS le jeu, sans écrire une ligne. |
| `HUDMakerMultilineText` | pas inscrit | — | Ajoute au HUD Maker un bloc de texte sur plusieurs lignes. |

---

## 5 · CE QUI TOUCHE À L'ÉQUILIBRAGE  —  *utile*

SRD_StatDistribution donne des points à répartir à chaque niveau.
SRD_TPUpgrade refait le système de points de technique.
SRD_MapSlipDamage refait les dégâts de poison sur la carte.
SRD_WeaponGuard donne une garde propre à chaque arme.
Les quatre déplacent des chiffres que JOKO a réglés lui-même. Règle du
projet : je signale, il décide.

| plugin | état | écrase | ce qu'il fait |
|---|---|---:|---|
| `EquipCompareUpgrade` | pas inscrit | ⚠ 11 | Choisir quelles statistiques se comparent quand on change d'équipement. |
| `MapSlipDamage` | pas inscrit | — | Refait les dégâts subis en marchant (poison, brûlure) : rythme, affichage, son. |
| `StatDistribution` | pas inscrit | — | Des points à répartir soi-même dans les statistiques, à chaque niveau. |
| `TPUpgrade` | pas inscrit | ⚠ 4 | Refait le système de points de technique : gain, plafond, affichage. |
| `WeaponGuard` | pas inscrit | — | Chaque arme a sa propre parade au lieu de la garde générique. |

---

## 3 · LES CAMÉRAS  —  *utile*

SRD_CameraCore sait zoomer et suivre une cible ; SRD_SmoothCamera adoucit
ses mouvements ; SRD_AutoCamera la déplace selon les régions traversées.
Ce serait beau sur les ultimes et l'entrée dans le Royaume.
⚠ Mais CameraCore remplace sèchement Game_Screen.clearZoom, que
YEP_X_ActSeqPack3 utilise pour les zooms des séquences d'action. JOKO en a
beaucoup. À essayer séparément, avec un banc dédié — pas dans le lot.

| plugin | état | écrase | ce qu'il fait |
|---|---|---:|---|
| `AutoCamera` | pas inscrit | — | La caméra se déplace toute seule selon la région que le joueur traverse. |
| `CameraCore` | pas inscrit | ⚠ 1 | La caméra sait zoomer, viser un personnage, le suivre. |
| `SmoothCamera` | pas inscrit | — | Adoucit tous les mouvements de caméra au lieu de les faire sauter. |

---

## 7 · LE COMBAT REDESSINÉ  —  *exclusif*

SRD_BattleGUICore, SRD_BattleStatusCustomizer et SRD_BattlePopupCustomizer
refont les fenêtres, la barre d'état et les chiffres de dégâts du combat.
Ils écrasent YEP_BattleEngineCore, YEP_X_BattleSysCTB, VisualMaxEX et
VisualMaxEX2 — c'est-à-dire tout ce qui tient le combat aujourd'hui.
Très beau potentiel, mais c'est un chantier à part entière.

| plugin | état | écrase | ce qu'il fait |
|---|---|---:|---|
| `BattleGUICore` | pas inscrit | ⚠ 6 | Refait entièrement la disposition des fenêtres de combat. |
| `BattleLogUpgrade` | pas inscrit | ⚠ 3 | Le journal de combat : ce qu'il dit, combien de temps, à quelle vitesse. |
| `BattlePopupCustomizer` | pas inscrit | ⚠ 5 | Les chiffres de dégâts : police, couleur, taille, trajectoire, par élément. |
| `BattleStatusCustomizer` | pas inscrit | ⚠ 1 | Choisir ce qu'affiche la barre d'état du combat, et comment (partie 1). |
| `BattleStatusCustomizer_Part2` | pas inscrit | — | La suite : la position et la forme de chaque élément de la barre d'état. |
| `StatePopups` | pas inscrit | — | Des bulles qui annoncent l'état posé ou retiré, en plus des dégâts. |
| `WalkCharBattlers` | pas inscrit | ⚠ 3 | Utiliser les sprites de marche comme combattants, au lieu des sprites de combat. |

---

## 8 · CE QU'IL NE FAUT PAS ALLUMER  —  *dangereux*

SRD_DataCompressor réécrit les fichiers de data/ dans un format compressé :
l'éditeur de RPG Maker et tous les bancs de ce projet cessent de les lire.
SRD_AutoUpdater et SRD_PluginUpdater appellent un serveur de mise à jour qui
n'existe pas.
SRD_RemoveTitleScreen et SRD_SkipTitleWithoutSave effacent l'écran-titre —
or JOKO y a monté MOG_TitleLayers, TitleParticles et TitleMagicCircles.
SRD_TranslationEngine et SRD_SpellCheck servent à traduire vers l'anglais et
à corriger l'orthographe anglaise : le jeu est en français.

| plugin | état | écrase | ce qu'il fait |
|---|---|---:|---|
| `AutoUpdater` | pas inscrit | — | Le jeu va chercher ses mises à jour sur un serveur au lancement. ⚠ Aucun serveur ici. |
| `DataCompressor` | pas inscrit | — | Compresse les fichiers de data/ pour réduire leur taille. ⚠ L'éditeur et les bancs ne les lisent plus. |
| `PluginUpdater` | pas inscrit | — | Vérifie si les plugins SRD ont une version plus récente en ligne. |
| `RemoveFadedContinue` | pas inscrit | ⚠ 1 | Enlève le « Continuer » grisé quand il n'y a rien à continuer. |
| `RemoveTitleScreen` | pas inscrit | ⚠ 1 | Supprime l'écran-titre : le jeu démarre directement. ⚠ JOKO a monté un titre entier. |
| `SkipTitleWithoutSave` | pas inscrit | ⚠ 1 | Saute le titre s'il n'y a aucune sauvegarde. |
| `SpellCheck` | pas inscrit | — | Vérifie l'orthographe des textes. ⚠ Dictionnaire anglais. |
| `TranslationEngine` | pas inscrit | — | Un outil pour traduire le jeu dans plusieurs langues, depuis le jeu. |

---

## 11 · L'ÉCRAN-TITRE ET LA FIN  —  *utile*

SRD_TitleMapBackground met une CARTE derrière le titre — le village qui
s'anime pendant qu'on hésite. SRD_PressStart fait attendre une touche.
SRD_TitlePictureChoices remplace les mots par des images animées.
SRD_GameOverCore, SRD_RetryUpgrade et SRD_RetryCosts font payer un prix pour
réessayer un combat perdu au lieu de renvoyer au titre.
SRD_CreditsPlugin et SRD_MovieCredits font défiler des crédits — mais
MOG_Credits est déjà branché et tient le même rôle.

| plugin | état | écrase | ce qu'il fait |
|---|---|---:|---|
| `CEBattleIntro` | pas inscrit | ⚠ 1 | Un événement commun joué comme introduction d'un combat. |
| `CreditsPlugin` | pas inscrit | — | Un écran de crédits rangé par catégories. |
| `CustomBattleIntro` | pas inscrit | ⚠ 1 | Régler dans le détail l'effet de transition vers un combat aléatoire. |
| `GameOverCore` | pas inscrit | ⚠ 1 | L'écran de mort : un événement commun, un choix, autre chose qu'un retour au titre. |
| `MovieCredits` | pas inscrit | — | Des crédits qui défilent vers le haut, comme au cinéma. |
| `PressStart` | pas inscrit | — | Un « Appuyez sur une touche » avant que le menu du titre apparaisse. |
| `RetryCosts` | pas inscrit | — | Faire payer un prix — or, objet, statistique — pour réessayer un combat. |
| `RetryUpgrade` | pas inscrit | — | Après un combat perdu, un écran pour réessayer, s'équiper, ou abandonner. |
| `TitleCommandCustomizer` | pas inscrit | ⚠ 3 | Choisir quelles commandes apparaissent au titre, et dans quel ordre. |
| `TitleMapBackground` | pas inscrit | — | Une CARTE du jeu qui tourne derrière l'écran-titre, au lieu d'une image fixe. |
| `TitlePictureChoices` | pas inscrit | ⚠ 1 | Les commandes du titre deviennent des images animées au lieu de mots. |

---

## 55 · LE RESTE, PRÊT À SERVIR  —  *utile*

Des outils qui ne coûtent rien tant qu'on ne s'en sert pas, et qui répondent
à une envie précise le jour où elle vient.

| plugin | état | écrase | ce qu'il fait |
|---|---|---:|---|
| `ActorSelect` | **branché** | ⚠ 24 | Un écran pour choisir un héros depuis un événement. |
| `AudioFader` | **branché** | ⚠ 7 | Les musiques montent et descendent en douceur au lieu de se couper net. |
| `AutoNameBox` | **branché** | — | La boîte de nom se remplit toute seule d'après le visage utilisé. |
| `BattleBackScroll` | **branché** | ⚠ 3 | Les décors de combat défilent — un ciel qui bouge derrière un boss. |
| `BattleEndEvents` | **branché** | ⚠ 1 | Un événement commun à la fin d'un combat, différent selon victoire, défaite ou fuite. |
| `BitmapUpgrade` | pas inscrit | ⚠ 1 | Transformer les couleurs d'une image en jeu : teinte, saturation, négatif. |
| `BlinkingFaces` | **branché** | ⚠ 2 | Les visages clignent des yeux pendant les dialogues. |
| `CharacterChoices` | pas inscrit | ⚠ 1 | Un choix où l'on sélectionne un personnage animé plutôt qu'une ligne de texte. |
| `CollisionChecker` | **branché** | — | Demander depuis un événement si une case est libre. |
| `CopyActors` | pas inscrit | — | Avoir plusieurs exemplaires du même héros dans l'équipe. |
| `CustomColors` | **branché** | — | Les couleurs du texte (PV bas, PM, états) réglables sans repeindre Window.png. |
| `CustomFaces` | pas inscrit | — | Plusieurs expressions de visage pour un même personnage, dans les dialogues. |
| `Debug` | pas inscrit | — | Un écran de débogage : voir et changer variables, interrupteurs, états en jeu. |
| `Debug_SpeedUp` | **branché** | ⚠ 2 | Accélérer le jeu pendant un test. |
| `DynamicActors` | pas inscrit | — | Les sprites et images d'un héros changent selon sa classe, son arme, son état. |
| `EnemyBulkDrops` | pas inscrit | — | Régler les butins de plusieurs ennemis d'un coup. ⚠ Réclame YEP_ExtraEnemyDrops, absent ici. |
| `FontOption` | pas inscrit | — | Le joueur choisit sa police dans les options. ⚠ Il n'y a qu'une police dans fonts/. |
| `FullscreenToggleOption` | **branché** | ⚠ 1 | Le plein écran depuis les options, sans connaître F4. |
| `GameUpgrade` | **branché** | ⚠ 8 | Le socle de huit autres SRD ; seul, il pilote la fenêtre du jeu sur le bureau. |
| `GoldWindowCustomizer` | **branché** | — | La fenêtre d'or : ce qu'elle montre, où, sous quelle forme. |
| `InMenuUsageUpgrade` | **branché** | ⚠ 22 | La fenêtre qui s'ouvre quand on utilise un objet depuis le menu. |
| `IndependentCharSprite` | pas inscrit | — | Le sprite du joueur reste le même quel que soit le meneur de l'équipe. |
| `IndividualSkinsForWindows` | **branché** | — | Une apparence de fenêtre différente par menu. |
| `MasterVolume` | **branché** | ⚠ 2 | Un volume général, au-dessus de la musique et des bruitages. |
| `MenuBackgrounds` | **branché** | ⚠ 9 | Un fond et une transparence réglables pour chaque menu. |
| `MenuStatusCustomizer` | pas inscrit | ⚠ 3 | Choisir ce qu'affiche la fiche d'un héros dans le menu. |
| `MetronomeSkill` | **branché** | ⚠ 2 | Une compétence qui en déclenche une autre au hasard. |
| `NameInputUpgrade` | **branché** | ⚠ 14 | L'écran de saisie de nom, en mieux : clavier, majuscules, longueur. |
| `OptionsCreator` | pas inscrit | ⚠ 2 | Créer ses propres options dans le menu des options. |
| `OptionsUpgrade` | **branché** | ⚠ 30 | Range les options en catégories au lieu d'une liste qui déborde. |
| `PictureChoices` | **branché** | ⚠ 19 | Un choix par images au lieu de mots : portraits, cartes, symboles. |
| `PluginComEvals` | **branché** | ⚠ 1 | Du JavaScript dans une commande de plugin : elle peut lire une variable. |
| `PreloaderCore` | **branché** | ⚠ 14 | Charge sons et images AVANT d'en avoir besoin. Le remède au gel quand un décor apparaît. |
| `QuitConfirmation` | **branché** | — | Demande confirmation avant de quitter, et propose de sauvegarder. |
| `RandomEncounterSwitches` | **branché** | ⚠ 1 | Couper ou rétablir les rencontres aléatoires par interrupteur, carte par carte. |
| `RepeatUpgrade` | **branché** | ⚠ 1 | Le « répéter » d'une compétence : intervalle, cible changeante, dégâts croissants. |
| `RestrictMovementDirections` | **branché** | — | Interdire une direction sous condition : couloir à sens unique, falaise. |
| `SellShop` | **branché** | ⚠ 2 | Une boutique de rachat, avec ses propres prix. |
| `SequenceInput` | **branché** | ⚠ 6 | Lire une touche PENDANT une séquence d'action Yanfly. La brique d'un contre. |
| `ShakingText` | **branché** | ⚠ 7 | Du texte qui tremble dans un dialogue. Pour une voix qui craque, une menace. |
| `ShakingWindows` | pas inscrit | — | La fenêtre sous le curseur tremble légèrement. |
| `SkillExtender` | pas inscrit | ⚠ 1 | Une compétence qui demande un SECOND choix au joueur avant de partir. |
| `SuperToolsEngine` | **branché** | ⚠ 17 | Un éditeur dans le jeu, en mode test. Socle du HUD Maker. Invisible pour le joueur. |
| `SwipeInput` | **branché** | — | Lire un glissement de doigt ou de souris. |
| `SwitchShop` | **branché** | ⚠ 46 | Une boutique qui vend des interrupteurs : un service, un passage, une information. |
| `TimerUpgrade` | **branché** | ⚠ 29 | Le chronomètre : position, format, couleur, pause automatique. |
| `UndertaleBattleSystem` | pas inscrit | — | Un combat où l'on esquive des projectiles au clavier, comme dans Undertale. |
| `VariableRates` | **branché** | ⚠ 1 | Une variable qui monte ou descend toute seule dans le temps. |
| `VideoWait` | **branché** | ⚠ 1 | L'événement attend tout seul la fin d'une vidéo. |
| `WaitOptions` | **branché** | — | Attendre une touche, la fin d'un son, une condition — pas seulement des images. |
| `WindowFrameAntiStretch` | **branché** | — | Le cadre des fenêtres se répète au lieu de s'étirer et de baver. |
| `WindowLayers` | **branché** | — | Chaque fenêtre sur son propre plan : plus de fenêtre qui passe sous une autre. |
| `WindowOpenUpgrade` | pas inscrit | ⚠ 2 | Régler l'animation d'ouverture et de fermeture des fenêtres. |
| `WindowSkinOption` | pas inscrit | — | Le joueur choisit l'apparence des fenêtres. ⚠ Réclame des images dans img/SumRndmDde/. |
| `WindowUpgrade` | pas inscrit | ⚠ 22 | Refait le système de fenêtres : marges, polices, tailles. ⚠ Écrase 21 réglages de YEP_CoreEngine. |

---

## Ce qui reste à décider

1. **Un écran de menu alternatif ?** Quatorze au choix, un seul possible, et
   celui d'aujourd'hui est à refaire si on en prend un.
2. **Les invocations** — `SummonCore` ferait entrer une invocation dans
   l'équipe. C'est exactement ce que décrit le Royaume Impérial des Ténèbres,
   mais c'est du lore : à JOKO de dire.
3. **Les attaques chronométrées et la défense active** changeraient la nature
   des combats. « Contre totale » deviendrait une vraie parade.
4. **Les caméras** — beau sur les ultimes, mais `CameraCore` écrase le zoom des
   séquences d'action de Yanfly. À essayer seul, avec un banc.
5. **Le combat redessiné** — trois plugins qui refont tout l'écran de combat.
   Chantier à part entière.

