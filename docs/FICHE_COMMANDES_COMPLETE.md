# FICHE COMPLÈTE — TOUTES LES COMMANDES, NOTETAGS, FORMULES & RECETTES

> **La référence unique, copier-coller.** Extraite automatiquement des **279 plugins** du projet
> (105 ont des commandes). Complète `GUIDE_DEVELOPPEUR.md` (qui explique les *systèmes*) :
> ici c'est le **catalogue exhaustif** de tout ce que tu peux taper.
>
> **Où mettre quoi :**
> - **Commande de plugin** → événement : `Commandes avancées ▸ Commande de plugin` (tape la ligne sans « / »).
> - **Script** → événement : `Commandes avancées ▸ Script` ; ou **condition** : onglet 4 ▸ Script.
> - **Notetag** → case **Note** d'un skill / acteur / classe / ennemi / arme / armure / objet / événement.
>
> Légende état : **✅ activé** · **⬜ désactivé** · **❔ non listé dans plugins.js** (dépend de ton gestionnaire).
> Toutes les commandes canon acceptent la **clé** (`lou`, `neyssa`…) **ou l'ID** (1-4) du héros.

---

# SOMMAIRE
- **PARTIE 1** — Index de TOUTES les commandes de plugin (par thème)
- **PARTIE 2** — TOUS les notetags (par cible)
- **PARTIE 3** — Les formules (dégâts + ce que chaque système modifie)
- **PARTIE 4** — Les RECETTES prêtes à l'emploi (PNJ · ennemi · skill · personnage)
- **PARTIE 5** — Rappels d'IDs (héros, éléments, états, skills clés)

---

# PARTIE 1 — INDEX DE TOUTES LES COMMANDES

> Format : `COMMANDE sous-commande <arg>` — *(Plugin)*. Les `<arg>` entre chevrons sont à remplacer.

## 1.1 — Les 3 jauges & la santé mentale
| Commande | Effet | Plugin |
|---|---|---|
| `CORRUPTION add <héros> <n>` | +n corruption (défaut 10) | CorruptionAme ✅ |
| `CORRUPTION purge <héros> <n>` | −n corruption (défaut 30) | CorruptionAme ✅ |
| `CORRUPTION ecran` | ouvre l'écran corruption | CorruptionAme ✅ |
| `ERRANCE add <héros> <n>` | +n errance | Errance ✅ |
| `ERRANCE purge <héros> <n>` | −n errance | Errance ✅ |
| `ERRANCE ecran` | ouvre l'écran errance | Errance ✅ |
| `PURGE bete\|errant\|dement <héros>` | purge **tragique** (transvase, n'efface pas — voir P3) | CanonPlus ✅ |

Santé mentale : pas de commande directe, ça passe par **script** (`Ame.bon`, `Ame.mauvais`… → §Scripts).

## 1.2 — Combat : arts, fusions, ultimes, domaine
| Commande | Effet | Plugin |
|---|---|---|
| `VOIES` | écran des 9 Voies (maîtrises) | MaitriseVoies ✅ |
| `TRIANGLE` | écran triangle Esprit/Corps/Âme | TriangleAffinites ✅ |
| `TRIANGLE hud on\|off\|toggle` | HUD triangle sur la carte | TriangleAffinites ✅ |
| `FUSION chair\|rasoir\|songe <id>` | entre en Fusion (mise en scène) | FusionMana ✅ |
| `FUSION fin <id>` | sort de Fusion | FusionMana ✅ |
| `ULTIME convergence\|mue\|parole <id>` | déclenche un ultime (mise en scène) | UltimesSources ✅ |
| `ULTIME fin <id>` | referme l'ultime | UltimesSources ✅ |
| `DOMAINE ouvrir\|fermer <id>` | Royaume Impérial de ludwing | RoyaumeImperial ✅ |
| `MUE forcer <id>` / `MUE fin <id>` | Mue maîtrisée (Bête à volonté) | MueMaitrisee ✅ |
| `ULTI` · `JACKPOT` · `AURA` · `BURST` | cinématiques d'ultime (visuel) | UltiCinematics ✅ |
| `NEYSSA_CONC reset_counters\|set_evasion\|set_shockwave` | réglage Concentration de Korrah | Neyssa_Concentration ✅ |

## 1.3 — Progression, rangs, marque, destins
| Commande | Effet | Plugin |
|---|---|---|
| `PORTES` | écran des Portes (entraînement des 3 sources) | PortesProgression ✅ |
| `PORTES xp <id> corps\|ame\|esprit <n>` | ajoute n d'entraînement | PortesProgression ✅ |
| `RANGS` | écran des rangs D→S | RangsPuissance ✅ |
| `MARQUE` | écran de lecture de la Marque | MarqueVivante ✅ |
| `FICHE` | fiche complète du marqué (trait, don, jauges) | CanonPlus ✅ |
| `DESTINS ecran` | écran des vies parallèles | DestinsParalleles ✅ |
| `DESTINS tick <n>` | fait avancer la vie des absents de n battements | DestinsParalleles ✅ |
| `DESTINS pause on\|off` | fige / relance les dérives (cutscene) | DestinsParalleles ✅ |
| `VIES` | écran IA des héros absents (ce qu'ils font) | ViesParalleles ✅ |

## 1.4 — Économie des âmes (var 15)
| Commande | Effet | Plugin |
|---|---|---|
| `FORGE` | forge d'âmes (renforcer, base 5 âmes) | ForgeAmes ✅ |
| `SANCTUAIRE` | apprendre des skills contre des âmes | SanctuaireAmes ✅ |
| `ALCHIMIE` | combiner des objets | AlchimieAmes ✅ |
| `GRAVER entrave\|renvoi\|saignee` | 5 âmes → 1 rune (items 65/66/67) | CanonPlus ✅ |
| `FEU repos` | Feu d'Âme : repos + checkpoint | AmeSouls ✅ |
| `FEU set` | pose le checkpoint courant | AmeSouls ✅ |
| `OBJET check` | met à jour le palier de l'Objet Spirituel | ObjetSpirituel ✅ |
| `LOU copies` / `LOU add_copy <skillId>` / `LOU clear_copies` | slots de copie de ludwing | LouCopySystem ✅ |

## 1.5 — Reine, Noyade, Reprises, Pactes
| Commande | Effet | Plugin |
|---|---|---|
| `REINE pacte <id>` | pacte d'Aldébaran (+20 % ATK/MAT, prix mental) | Lore_AldebaranAppel ✅ |
| `REINE oubli <id>` | annule le pacte | Lore_AldebaranAppel ✅ |
| `PACTE <...>` / `PACTE oubli` | pactes aux sanctuaires de la Reine | PactesAldebaran ✅ |
| `NOYADE pardonne <id>` | retire une cicatrice de Noyade | Lore_LoiNoyade ✅ |
| `REPRISES dire` | le monde murmure le nombre de game over | Lore_Reprises ✅ |

## 1.6 — Chutes & horreur (méta)
| Commande | Effet | Plugin |
|---|---|---|
| `CHUTE errant\|bete <n>` · `CHUTE fond` | joue la cinématique de chute | ChutesCinematiques ✅ |
| `CHUTE calme` / `CHUTE reprendre` | coupe / relance l'ambiance | ChutesCinematiques ✅ |
| `CHUTEDEF off\|on` | (dés)active les chutes DÉFINITIVES | ChutesDefinitives ✅ |
| `CHUTEDEF forcer bete\|dement\|errant <id>` | force une perte (mise en scène) | ChutesDefinitives ✅ |
| `CHUTEPROG off\|on` | chutes progressives | ChutesProgression ✅ |
| `CHUTEHALL off\|on` | hallucinations avant chute | ChutesHallucinations ✅ |
| `CHUTEVHS off\|on\|burst` · `CHUTEVHS niveau <n>` | esthétique analog-horror | ChutesAnalogHorror ⬜ |
| `CHUTELAC play` · `CHUTELAC voie <nom> <0-100>` | musiques générées | ChutesLacMusique ⬜ |
| `CHUTELAC theme <n>` · `CHUTELAC intensite <0-100>` · `CHUTELAC stop\|auto` | idem | ChutesLacMusique ⬜ |
| `DEMENT chute\|ancrage` · `BETE <...>` | les 4 chutes unifiées | Codex_Chutes ✅ |
| `HALLUCO off\|on` / `DEMENTINT off\|on` | combats-hallucination du Dément | DementInterne ✅ |
| `CONTAGION off\|on` | chute contagieuse entre héros | ContagionAme ✅ |
| `CHASSE off\|on\|force` | chasseurs d'âme à jauges hautes | ChasseursAme ✅ |
| `MUR off\|on\|forcer` | le Mur / le Fond (réalité déforme) | LeMur ✅ |
| `PLONGER` / `REMONTER` | plonger volontairement dans le Lac | PlongerLac ✅ |
| `THEATRE off\|on` | l'interface MENT (faux PV…) | TheatreDement ✅ |
| `REGARD whisper\|glitch\|error\|title\|hp` | Jade exploite la faille | JadeRegard ✅ |
| `MEMOIRE greet\|record_ending\|defeat_jade\|flag\|store_runs\|store_kills\|forget` | Jade se souvient des parties | JadeMemoire ✅ |

## 1.7 — PNJ & monde vivant
| Commande | Effet | Plugin |
|---|---|---|
| `PNJ react` | le PNJ commente l'état du chef | PNJVivantsPlus ✅ |
| `PNJ rumeur` | raconte la dernière action d'un absent | PNJVivantsPlus ✅ |
| `PNJ fond` | le PNJ du Fond (se souvient des Reprises) | PNJVivantsPlus ✅ |
| `PNJ graveur` | dialogue du Graveur (5 âmes → rune) | PNJVivantsPlus ✅ |
| `PNJ destin <clé> <n>` | +n à la chute d'un PNJ nommé | PNJVivantsPlus ✅ |
| `PNJ soigner <clé> <n>` | −n à sa chute | PNJVivantsPlus ✅ |
| `PNJ lire <clé>` | le Regard lit sa marque | PNJVivantsPlus ✅ |
| `PNJLIEN up <clé>` | +1 lien avec ce PNJ | PNJVivantsPlus ✅ |
| `NPC talk <clé>` | dialogue réactif d'un PNJ | LivingNPC ✅ |
| `NPC rumeur` | rumeur au courant du monde | LivingNPC ✅ |
| `NPC bark <clé>` / `NPC mute` | petite phrase au-dessus / faire taire | LivingNPC ✅ |
| `REGARD` | lis l'âme d'un PNJ/ennemi (nature, marque) | LeRegard ✅ |
| `CHRONIQUE region\|faction\|pnj\|flag\|note <...>` | écrit dans la mémoire du monde | ChroniqueMonde ✅ |
| `CHRONIQUE ecran` / `CHRONIQUE fin` | consulter la chronique | ChroniqueMonde ✅ |
| `LIEN up\|set <héros> <n>` / `LIEN ecran` | liens avec les 4 héros | LiensSocial ✅ |

## 1.8 — Quêtes, succès, difficulté
| Commande | Effet | Plugin |
|---|---|---|
| `QUEST add <id>` · `QUEST obj\|step <...>` | inscrit une quête / un objectif | QuestJournal ✅ |
| `QUEST done\|fail <id>` · `QUEST track\|untrack <id>` | terminer / suivre | QuestJournal ✅ |
| `QUEST ecran` | ouvre le journal | QuestJournal ✅ |
| `MAINQUEST <...>` | quête principale (6 chapitres) | MainQuests ✅ |
| `SUCCES unlock <id>` / `SUCCES ecran` | succès + écran | SuccesTitres ✅ |
| `DIFFICULTE histoire\|normal\|elden\|cauchemar` | règle la difficulté souls | SoulsDifficulty ✅ |

## 1.9 — Écrans, codex, menus, divers
| Commande | Effet | Plugin |
|---|---|---|
| `GRIMOIRE` | le hub qui regroupe tous les écrans | GrimoireHub ✅ |
| `CODEX` | le livre du lore & des règles (7 pages) | CodexSources ✅ |
| `MANA` | codex du système de mana | ManaCodex ⬜ |
| `BESTIAIRE` | bestiaire (se remplit au combat) | BestiaireAmes ✅ |
| `AME` | page/écran de santé mentale (4 jauges) | AmeStatusScene ✅ · JadeEntitePlunging ✅ |
| `GUIDEVP` | guide clair des Voies & Paroles | GuideVoiesParoles ✅ |
| `PENSEE` | affiche une question morale | Pensees ⬜ |
| `FACTION join\|quit\|ecran <...>` | rallier une faction | FactionsAmes ⬜ |
| `REVE` / `FEUAME` / `FEU` | rêver au repos (chute la plus proche) | RevesFeuAme ✅ |
| `DEBUT` | choix du marqué de départ | DebutMarques ✅ |
| `NGPLUS` | New Game + | NewGamePlus ✅ |
| `TUTOS reset\|off\|on` | tutoriels contextuels | PremiersPas ✅ |
| `ATELIER` | menu de test (playtest uniquement) | AtelierTest ⬜ |
| `TEMPS jour\|nuit\|basculer` | jour/nuit (module le Mana) | JourNuit ✅ |
| `ELEMENTS` | popups de dégâts teintés par élément | VisualMaxEX ✅ |
| `CINE duel` / `CINE jouer <prefixe> <nb> <ms>` | séquences d'images | Cinematiques ❔ |

## 1.10 — MOG (HUD & effets visuels)
> Purement visuel. `id` = ID d'événement (0 = celui qui exécute), `player_id` = le joueur.

| Commande | Effet | Plugin |
|---|---|---|
| `show_actor_hud` / `hide_actor_hud` | HUD des héros | MOG_ActorHud ❔ |
| `show_gold_hud` / `hide_gold_hud` | HUD d'argent | MOG_GoldHud ✅ |
| `show_party_hud` / `hide_party_hud` | HUD du groupe | MOG_PartyHud ⬜ |
| `show_s_hud` / `hide_s_hud` | HP au-dessus du perso | MOG_SHud ❔ |
| `show_treasure_hud` / `hide_treasure_hud` | HUD des trésors | MOG_TreasureHud ✅ |
| `show_treasure_popup` / `hide_treasure_popup` | popup de trésor | MOG_TreasurePopup ✅ |
| `show_variable_hud` / `hide_variable_hud` / `set_variable_max` | HUD de variables | MOG_VariableHud ⬜ |
| `show_compass` / `hide_compass` / `compass_event_id <id>` | boussole | MOG_Compass ✅ |
| `weather <type> <power>` / `clear_weather` / `battle_weather` | climats | MOG_Weather_EX ✅ |
| `filter_effect <...>` / `filter_clear` / `filter_event_id <id>` | filtres graphiques (Pixi) | MOG_PixiFilters ✅ |
| `pic_ocean/breath/float/swing/shake/flip/fade/collapse/animated/camera …` | anime une image | MOG_PictureEffects ✅ |
| `shadow_event_id <id>` / `shadow_player_id` | ombre sous le perso | MOG_CharacterShadow ✅ |
| `shatter_event_id <id>` | effet « éclats » | MOG_CharShatterEffect ✅ |
| `gtrail_event_id <id>` / `gtrail_player_id` | traînée fantôme | MOG_CharGhostTrail ✅ |
| `breath/ghost/float/swing/zoom/rotation/shake/collapse/clear …_event_id <id>` | animations de sprite | MOG_CharacterMotion ✅ |
| `indicator / text_indicator / variable_indicator / show_indicator / hide_indicator …` | indicateurs au-dessus des events | MOG_EventIndicators ✅ |
| `music_book` · `picture_gallery` · `theatrhythm` · `visual_timer` | mini-scènes | MOG_* (divers) |

## 1.11 — YEP (moteur Yanfly) & autres
| Commande | Effet | Plugin |
|---|---|---|
| `GainGold <n>` / `LoseGold <n>` | or (utilitaire) | YEP_CoreEngine ✅ |
| `setBattleSys <dtb\|atb\|ctb\|stb>` | change le système de combat | YEP_BattleEngineCore ✅ |
| `OpenQuestJournal` / `Quest <...>` | journal de quêtes Yanfly | YEP_QuestJournal ❔ |
| `OpenPatchNotes` / `ShowMenuPatchNotesCommand` | notes de patch | YEP_PatchNotes ❔ |
| `MessageRows <n>` / `MessageWidth <n>` / `EnableWordWrap` | réglages de message | YEP_MessageCore ❔ |
| `EnableVarianceStock` / `DisableVarianceStock` | variance des objets | YEP_ItemCore ❔ |
| `ShowItemUpgrade` / `HideItemUpgrade` / `EnableItemUpgrade` | slots d'amélioration | YEP_X_ItemUpgradeSlots ❔ |
| `DisableVictoryAftermath` / `EnableVictoryMusic` … | écran de victoire | YEP_VictoryAftermath ❔ |
| `ResetAllEventLocations` | réinitialise les positions mémorisées | YEP_SaveEventLocations ❔ |
| `EnemyBook <...>` · `ItemBook <...>` | livres ennemis / objets | EnemyBook · ItemBook ❔ |
| `HakariJackpot Start` | pari mortel de Lou | LOU_HakariJackpot ⬜ |
| `AriesScreenShakeType <...>` | type de secousse d'écran | Aries001L_ShakeEffects ✅ |

---

# PARTIE 2 — TOUS LES NOTETAGS (par cible)

## 2.1 — Notes de SKILL (compétence)
| Notetag | Effet | Système |
|---|---|---|
| `<Voie: forge\|onde\|source\|miroir\|vide\|eclair\|domaine\|flash\|sang>` | applique une Voie (bonus + prix) | MaitriseVoies |
| `<Parole>` · `<ParoleL: n>` · `<Parole: origine>` · `<NoParole>` | rend le skill « parlé » (peut échouer si lucidité basse) | ParolesSysteme |
| `<FrappeAme>` · `<FrappeAmeEtat: id>` | frappe d'âme (ignore DEF/MDF + résistances) | FrappeAme |
| `<Interdit>` · `<Interdit: 1.8>` | art interdit : dégâts ×1.6 (ou ×x), +8 corruption | Lore_MaitrisesInterdites |
| `<Fusion: chair\|rasoir\|songe>` | forme de Fusion (transformation) | FusionMana |
| `<FusionTech: chair\|rasoir\|songe>` | Fusion « technique » (un instant, prix immédiat) | FusionsEtendues |
| `<Rune>` | Parole gravée : jamais ratée, marche même Muet | FusionsEtendues |
| `<Ultime: convergence\|mue\|parole>` | carte finale d'un héros | UltimesSources |
| `<RoyaumeImperial>` · `<ContreTotale>` · `<SceauMagie>` | arsenal du Domaine (ludwing) | RoyaumeImperial |
| `<AspirationDamnees>` | aspire les âmes de tous les morts (régen + état 200) | RoyaumeImperial |
| `<Invocation: n>` | dépense n âmes (var 15) | InvocationAmes |
| `<ReculVital: n>` | force le recul PV du skill à n % | ManaAffinity |
| `<HP Cost: n%>` | coûte n % des PV max | YEP_SkillCore |
| `<Ulti>` · `<Ulti: Nom>` · `<UltiColor: #hex>` | cinématique d'ultime | UltiCinematics |
| `<StateFX>` · `<StateFX: burst>` · `<StateFXColor: #hex>` | effet visuel d'état | UltiCinematics |
| `<Combo: 1,3>` · `<ComboLien: n>` | combo/lien entre héros | ComboLiens |
| `<skill_id: n>` | lie une compétence à une arme | WeaponSkill |
| `<setup/target/finish action> … </...>` | séquences d'action visuelles | YEP_X_ActSeqPack1-3 |

## 2.2 — Notes d'ACTEUR ou de CLASSE
| Notetag | Effet | Système |
|---|---|---|
| `<Mana: positif\|negatif\|spirituelle\|sombre\|pur\|semiparfait>` | affinité principale (Corps) | ManaAffinity |
| `<Mana2: …>` | seconde affinité | ManaAffinity |
| `<Atone>` | sans affinité (recul vital ÷2) | ManaAffinity |
| `<VoieDefaut: onde>` | Voie par défaut du personnage | MaitriseVoies |
| `<Camp: lumiere\|ombre>` | camp (sorts 14/15 : ×1.5 vs opposé, ×0.5 même) | Lore_CampsLumiereOmbre |
| `<Trait: rupture\|gel\|porte\|verbe>` | Trait d'âme (don de naissance) | TraitsAme |
| `<Passive State: id, id…>` | états passifs permanents | YEP_AutoPassiveStates |
| `<Faction: nom>` | appartenance de faction | Lore_FactionCouleur |

> **Config canon actuelle** (dans `data/Actors.json`) :
> Aël `<Mana: spirituelle><Mana2: negatif><VoieDefaut: sang><Camp: ombre>` ·
> Korrah `<Mana: negatif><Mana2: positif><VoieDefaut: flash><Camp: lumiere>` ·
> ludwing `<Mana: spirituelle><Mana2: positif><VoieDefaut: source><Camp: ombre>` ·
> Vesper `<Mana: positif><VoieDefaut: miroir><Camp: lumiere>`.

## 2.3 — Notes d'ENNEMI
| Notetag | Effet | Système |
|---|---|---|
| `<Rang: D\|C\|B\|A\|S>` · `<Rang: astre>` | rang affiché (astre = hors échelle) | RangsPuissance |
| `<Aura: n>` | palier d'aura (compte dans le score) | RangsPuissance |
| `<Mana: …>` · `<Mana2: …>` | affinités de l'ennemi | ManaAffinity |
| `<Camp: lumiere\|ombre>` | camp de l'ennemi | Lore_CampsLumiereOmbre |
| `<VoieDefaut: …>` | Voie de l'ennemi | MaitriseVoies |
| `<TraitBoss: Nom\|type>` | trait de boss (`gel\|faim\|rupture\|renvoi\|regard`) | CanonPlus |
| `<Chase: n>` | poursuit le joueur (rayon n) | ChaseEnemies |
| `<BeteTombee>` `<DechireTombe>` `<DementTombe>` `<ErrantTombe>` | marqueurs de version chutée | Codex_Chutes |
| `<Gaster>` · `<Radahn>` · `<Malenia>` · `<DonoBoss>`/`<DonoEsprit>` | boss signatures | JadeGaster · KevSignature · JadeObsession · DonoKamui |

## 2.4 — Notes d'ARME / ARMURE / OBJET
| Notetag | Effet | Système |
|---|---|---|
| `<Relic: antirot>` | gains de corruption ÷2 | CorruptionAme |
| `<Relic: lifesteal\|lowhp\|thorns\|soulgain\|firstaid>` | passifs de relique | RelicPassifs |
| `<Eveil>` | objet qui s'éveille | ObjetEveille |
| `<Signature: arc\|flammes\|forteresse\|nova\|abime\|vague>` | armes/objets signatures (lore) | Lore_* |

## 2.5 — Notes d'ÉVÉNEMENT (carte)
| Notetag | Effet | Système |
|---|---|---|
| `<Envers>` | l'événement n'existe QUE côté Envers (Errance ≥ 40 ou lucidité ≤ 3) | PNJVivantsPlus |
| `<NPC: clé>` | identifie un PNJ vivant | LivingNPC · NPCRoutines |
| `<Joueur>` | l'événement se comporte comme le joueur (PNJ) | Lore_JoueurPNJ |
| `<SafeZone>` | zone sûre (pas de chasseurs, repos) | ChasseursAme · Lore_SANReposMarche |
| `<Cache>` | caché sauf en plongée | PlongerLac |
| `<NoRead>` | le monde ne « lit » pas ici | MondeTeLit |

## 2.6 — Les scripts (conditions & effets)
```js
// --- Jauges (lecture) ---
Corruption.niveau('lou')        // 0-100
Errance.niveau('lou')           // 0-100
Ame.jauge('neyssa')             // 1-10   santé mentale
Ame.phase('neyssa')             // 1-5    phase mentale
Ame.calme('neyssa')             // true si phase >= 4
$gameVariables.value(15)        // stock d'âmes

// --- Santé mentale (écriture) ---
Ame.bon('neyssa', 1)            // +1 (bon choix / repos)
Ame.mauvais('neyssa', 2)        // -2 (trauma)
Ame.absorber(2)                 // Lou dévore 2 âmes (+var15, -2 mental)

// --- États des systèmes ---
Voies.mastery(1, 'forge')       // 0-40
Rangs.rang(1)                   // 'D'…'S'|'Astre'
Rangs.details(1)                // {reserves, maitrise, aura, score, rang}
Marque.etat(1)                  // 'pleine'|'felee'|'affamee'|'gonflee'|'creuse'
Equilibre.etat(1)               // 'semiparfait'|'calme'|'corps'|'ame'|'esprit'
Fusion.actif(1)                 // 'chair'|'rasoir'|'songe' ou ''
Ultimes.actif(2)                // 'convergence'|'mue'|'parole' ou ''
RoyaumeTenebres.total()         // âmes récoltées depuis le début
RoyaumeTenebres.domaineActif(3) // Domaine de ludwing ouvert ?

// --- Destins / chutes ---
Destins.absent(2)               // true si l'acteur 2 vit sa vie ailleurs
Destins.chute(2)                // '' | 'bete' | 'dement' | 'errant'
Chutes.perdu(2)                 // '' | 'bete' | 'dement' | 'errant' (définitif)
Chutes.survivants()             // héros encore debout (0 = fin)

// --- Traits / PNJ ---
Traits.de(2)                    // {cle:'gel', nom:"l'Instant Gelé", don:'…'}
Traits.possede(1,'rupture')     // true
PNJ.destin('marc')              // 0-100   chute d'un PNJ
PNJ.perdu('marc')               // true si le PNJ a chuté
PNJ.voitEnvers()                // le chef voit l'autre côté ?
PNJ.lien('marc')                // niveau de lien
```

---

# PARTIE 3 — LES FORMULES

## 3.1 — La formule de dégâts (case « Formule » du skill)
RPG Maker évalue une expression JS. Variables dispo : `a` = lanceur, `b` = cible, `v` = variables, `item`.
```
a.atk * 4 - b.def * 2          // physique standard (déjà utilisé partout)
a.mat * 6 - b.mdf * 2          // magique standard
a.atk * 8 - b.def * 2          // gros coup (ex. skill 11 Éclat Noir)
a.hp * 0.25                    // 25 % des PV actuels du lanceur
b.mhp * 0.10                   // 10 % des PV max de la cible
Math.max(1, a.atk*3 - b.def)   // plancher à 1
```
Puis l'**élément** (menu déroulant), la **variance**, le flag critique. Le reste (Voie ×1.5, Interdit ×1.6, recul PV…) est appliqué **par les plugins** via les notetags — **ne le mets pas dans la formule.**

## 3.2 — Ce que chaque système AJOUTE à un coup (au-dessus de la formule)
| Notetag / condition | Modificateur appliqué |
|---|---|
| `<Voie: forge>` | dégâts **×1.5**, mais **−5 % PV** au lanceur / coup |
| `<Voie: domaine>` | dégâts **×1.3** garanti, **+3 corruption** |
| `<Voie: sang>` | vole **45 %** des dégâts en PV, **+2 corruption** |
| `<Interdit: x>` | dégâts **×x** (défaut 1.6), **+8 corruption** |
| `<FrappeAme>` | ignore DEF/MDF **et toutes les résistances**, **+2 Errance** |
| élément 7 (AME) / 16 (semi-parfait) | **perce toute résistance** (taux forcé 100 %) |
| élément 4 (Négatif) offensif | **+2 corruption**, recul **15 %** des dégâts en PV |
| élément 5 (Sombre) offensif | **+3 corruption**, recul **25 %** en PV |
| élément 2 (spirituelle) offensif | **+1 Errance** (mise à mort : **+5**) |
| camp opposé (sorts 14/15) | **×1.5** (même camp : ×0.5) |
| Fusion en suspens (élém somme existe) | **×1.25** |
| Errance 100 (passif) | ATK/MAT jusqu'à **+50 %**, mais dégâts subis **+40 %** |
| état 188 Surpassé | ATK/MAT **×1.15**, +10 % crit |

## 3.3 — Les formules des systèmes (rappel des calculs)
```
Rang     : score = niveau/99×40 + meilleureVoie/40×30 + auraPalier×7.5
           <25 D · 25-44 C · 45-64 B · 65-84 A · ≥85 S   (+1 cran si Semi-Parfait)
Paroles  : Kr = 8·L^1.8 ; tenue = min(1,Kd/Kr)·min(1,tf/(0.8·L))  (tf=5.0)
Portes   : +10/action ; niveaux à 100/300/600/1000/1500 (cumul)
Maîtrise : +1/usage (max 40) ; amplifie bonus ET malus jusqu'à ×1.2
Noyade   : chaque phase 1 → plafond mental −1 (plancher 4) + 5 Errance
```

---

# PARTIE 4 — LES RECETTES (copier-coller)

## 4.1 — RECETTE : un PNJ vivant
**But :** un villageois qui réagit à ton état, donne des rumeurs, et a son propre destin.
```
Événement PNJ ▸ Déclenchement : Touche d'action

— PAGE 1 (normale) —
◆ Commande de plugin : NPC talk villageois       (dialogue réactif à tes jauges)
◆ Commande de plugin : PNJ destin villageois 1   (sa marque s'use un peu)

— PAGE 2 (condition ▸ Script) : PNJ.destin('villageois') >= 70 —
◆ Texte : « Aide-moi… quelque chose me ronge de l'intérieur. »
◆ Afficher choix : L'aider / Plus tard
  ◆ Si L'aider : Commande de plugin : PNJ soigner villageois 40

— PAGE 3 (condition ▸ Script) : PNJ.perdu('villageois') —
◆ (maison vide, ou un monstre à sa place — il a chuté)
```
Variante « caché dans l'Envers » : mets `<Envers>` dans la **Note de l'événement** → il n'apparaît que si `PNJ.voitEnvers()` (Errance ≥ 40 ou lucidité ≤ 3).

## 4.2 — RECETTE : un ennemi (boss de rang S, être d'Ombre, art interdit)
**Base ▸ Ennemis** → crée l'ennemi, mets dans sa **Note :**
```
<Rang: S>
<Camp: ombre>
<Mana: sombre>
<Mana2: negatif>
<Aura: 4>
<TraitBoss: le Dévoreur|faim>
```
Son **skill signature** (Base ▸ Compétences), Note :
```
<Voie: domaine>
<Interdit: 1.8>
<Ulti: le Dévoreur|#7a2fff>
```
Formule du skill : `a.mat * 6 - b.mdf * 2`, élément **Sombre (15)**. Le plugin gère le ×1.3 (domaine), le ×1.8 (interdit), la corruption et le visuel.
Le poser sur la carte : événement ▸ `Lancer le combat` ▸ sa troupe. Difficulté globale : `DIFFICULTE elden`.

## 4.3 — RECETTE : une compétence
**Une frappe d'âme qui étourdit (art de l'Âme) :**
```
Type : ame (stype 9)   |  Coût : PM 12, TP 0  |  Portée : 1 ennemi
Formule : a.mat * 5 - b.mdf   |  Élément : mana spirituelle (2)
Note :
  <FrappeAme>
  <FrappeAmeEtat: 134>     (ignore les résistances, 30 % d'étourdir)
```
**Une Parole de soin infaillible (ultime) :**
```
Type : ult (stype 3)  |  Coût : PM 30  |  Portée : tous les alliés
Formule : a.mat * 3 + 200   |  Élément : mana positive (3)
Note :
  <Parole: origine>        (type 3 = origine, ne rate jamais)
```
**Une compétence de Voie (forge, gros dégâts, tu paies) :**
```
Formule : a.atk * 5 - b.def * 2   |  Élément : Physique (1)
Note :
  <Voie: forge>            (×1.5 dégâts, −5 % PV/coup)
  <Ulti>                   (cut-in cinématique)
```

## 4.4 — RECETTE : un personnage (héros jouable)
1. **Base ▸ Acteurs** → nom, classe, graphismes, arme de départ.
2. **Note de l'acteur** (choisis son identité de jeu) :
```
<Mana: positif>            (son affinité — voir table 2.2)
<Mana2: spirituelle>
<VoieDefaut: source>       (sa Voie de prédilection)
<Camp: lumiere>
<Trait: verbe>             (son don de naissance — rupture/gel/porte/verbe)
<Passive State: 40, 41>    (ses passifs)
```
3. **Sa variable de santé mentale** : héros 1→var 11, 2→12, 3→13, 4→14 (déjà câblé pour 1-4).
4. **Ses ultimes** : câblés par classe au niveau 1 (classe 1→813-814, 2→815-817, 3→810-812, 4→818-820). Pour un 5e héros, apprends-lui les skills à la main dans sa classe.
5. **Le recruter en jeu** : `Script : $gameParty.addActor(5)` — ou via un événement de rencontre (voir Destins §4.1 du GUIDE).

## 4.5 — RECETTE : un checkpoint / feu de repos
```
◆ Commande de plugin : FEU repos              (repos + sauvegarde du checkpoint)
◆ Commande de plugin : CORRUPTION purge 1 20  (répéter 2,3,4 si tu veux tout purger)
◆ Commande de plugin : ERRANCE purge 1 20
◆ Script : Ame.bon(1,2); Ame.bon(2,2); Ame.bon(3,2); Ame.bon(4,2)
```

## 4.6 — RECETTE : le pacte de la Reine (choix moral)
```
◆ Texte : « Je peux te donner ce que tu cherches. Il y aura un prix. »
◆ Afficher choix : Accepter / Refuser
  ◆ Si Accepter : Commande de plugin : REINE pacte 3
  ◆ Si Refuser  : Texte : « Sage. Ou lâche. Les deux se ressemblent. »
```

---

# PARTIE 5 — RAPPELS D'IDs

| Héros | ID | Clé | Var mentale | Classe |
|---|---|---|---|---|
| Aël (Équilibre) | 1 | `thylane` | 11 | 1 |
| Korrah (Maîtrise) | 2 | `neyssa` | 12 | 2 |
| ludwing (Symbole) | 3 | `lou` | 13 | 3 |
| Vesper (Parole) | 4 | `tianna` | 14 | 4 |

**Var 15** = stock d'âmes (partagé, porté par ludwing).

**Éléments clés :** 1 Physique · 2 spirituelle (Âme) · 3 positive (Esprit) · 4 négative · 5 Sombre · 7 AME/pur (perce) · 16 semi-parfait (perce) · 8-15 Feu/Eau/Vent/Terre/Foudre/Glace/Lumière/Ombre.

**Skill types :** 3 ult (Paroles origine) · 8 invocation · 9 ame (Errance) · 11-18 ombres d'armes.

**États système :** 181-183 corruption (Frémissement/Fièvre/Mue) · 188 Surpassé · 195-197 Fusions · 198 Domaine · 199 Contre Totale · 200 Traumatisé · 201-203 ultimes · 204 l'Envers · 205-206 Formes d'Aël.

**Skills canon :** 810 Domaine · 811 Pluie du Styx · 812 Contre Totale · 813-814 Aël · 815-817 Korrah · 818-820 Vesper · 821-826 Fusions étendues (technique/rune).

**Compteurs data :** 826 skills · 426 ennemis · 516 troupes · 516 armes · 290 armures · 100 objets · 1000 états · 460 animations.

---

> **Pour aller plus loin :** `docs/GUIDE_DEVELOPPEUR.md` (les systèmes expliqués en détail),
> `docs/ORDRE_PLUGINS.md` (l'ordre de chargement — ⚠️ à respecter), `SYSTEME_DE_MANA.md` (le canon du mana),
> `docs/CODEX` en jeu (commande `CODEX`).
