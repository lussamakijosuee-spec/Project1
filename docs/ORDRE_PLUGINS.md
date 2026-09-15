# 🧩 ORDRE DES PLUGINS — la référence, générée depuis `js/plugins.js`

> **Ce fichier est un relevé, pas un souhait.** Il décrit l'ordre réellement présent dans
> `js/plugins.js`, section par section. Régénéré après chaque réorganisation.

| | |
|---|---|
| **Entrées** | 194 |
| **Plugins actifs** | 167 |
| **Plugins désactivés** | 9 |
| **Intertitres** | 18 |
| **Dépendances déclarées vérifiées** | 68 — **0 violation** |

---

## Les trois règles à ne jamais casser

1. **`YEP_CoreEngine` en premier**, et chaque `YEP_X_*` **après** sa base
   (`YEP_X_ActSeqPack*`, `YEP_X_BattleSysCTB`, `YEP_X_AnimatedSVEnemies` → après
   `YEP_BattleEngineCore`).
2. **Les producteurs de jauges avant leurs consommateurs** :
   `JadeEntitePlunging` → `CorruptionAme` → `Errance` → tout ce qui les lit.
3. **`SafetyNet` tout à la fin.** Son filet n'enveloppe que ce qui est chargé *avant* lui.
   *(Il était en 155ᵉ position : 37 plugins actifs se chargeaient hors de sa protection.)*

---

## L'ordre réel, section par section

### ① NOYAU · moteur, canon, cœur du combat

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 1 | `MadeWithMv` | ⬜ | — |
| 2 | `YEP_CoreEngine` | ✅ | — |
| 3 | `LoreCanon` | ✅ | — |
| 4 | `YEP_BattleEngineCore` | ✅ | — |

### ② COMBAT · séquences d'action

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 6 | `YEP_X_ActSeqPack1` | ✅ | — |
| 7 | `YEP_X_ActSeqPack2` | ✅ | — |
| 8 | `YEP_X_ActSeqPack3` | ✅ | — |

### ③ COMBAT · IA, ordre des tours, états passifs

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 10 | `YEP_BattleAICore` | ✅ | — |
| 11 | `YEP_X_BattleSysCTB` | ✅ | — |
| 12 | `YEP_X_AnimatedSVEnemies` | ✅ | — |
| 13 | `YEP_AutoPassiveStates` | ✅ | — |

### ④ COMBAT · compétences & boss scriptés

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 15 | `MahoragaBoss` | ✅ | — |
| 16 | `YEP_SkillCore` | ✅ | — |
| 17 | `JadeObsession` | ✅ | — |

### ⑤ CONFORT · écrans système, anti-lag, options

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 19 | `Aries001L_ShakeEffects` | ✅ | — |
| 20 | `Irina_AntiAudioDelay` | ✅ | — |
| 21 | `Community_Basic` | ✅ | — |
| 22 | `Olivia_AntiPlayerStress` | ✅ | — |
| 23 | `Aries002_SystemCustomiser` | ✅ | — |
| 24 | `AmeStatusScene` | ✅ | — |
| 25 | `Olivia_MapDisplayNameCore` | ✅ | — |
| 26 | `Olivia_MetaControls` | ✅ | — |
| 27 | `TSR_EquipSlots` | ✅ | — |

### ⑥ L'ÂME · jauges, entité, Objet Spirituel, mana

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 29 | `JadeBattleFX` | ✅ | — |
| 30 | `Neyssa_Concentration` | ✅ | — |
| 31 | `JadeEntitePlunging` | ✅ | — |
| 32 | `Surpassement` | ✅ | — |
| 33 | `LouCopySystem` | ✅ | — |
| 34 | `ManaAffinity` | ✅ | — |
| 35 | `ObjetSpirituel` | ✅ | — |
| 36 | `JourNuit` | ✅ | — |
| 37 | `AmeSouls` | ✅ | — |
| 38 | `ForgeAmes` | ✅ | — |
| 39 | `NewGamePlus` | ✅ | — |
| 40 | `LiensSocial` | ✅ | — |
| 41 | `ComboLiens` | ✅ | — |
| 42 | `InvocationAmes` | ✅ | — |
| 43 | `SuccesTitres` | ✅ | — |
| 44 | `SanctuaireAmes` | ✅ | — |
| 45 | `AlchimieAmes` | ✅ | — |

### ⑦ CORRUPTION, PNJ VIVANTS & QUÊTES

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 47 | `DonoBoss` | ✅ | — |
| 48 | `DonoKamui` | ✅ | — |
| 49 | `JadeRework` | ✅ | — |
| 50 | `CorruptionAme` | ✅ | — |
| 51 | `RelicPassifs` | ✅ | — |
| 52 | `BestiaireAmes` | ✅ | — |
| 53 | `LivingNPC` | ✅ | — |
| 54 | `NPCRoutines` | ✅ | — |
| 55 | `RageBaitDuo` | ✅ | — |
| 56 | `QuestJournal` | ✅ | — |
| 57 | `MainQuests` | ✅ | — |

### ⑧ MOG · titre, HUD, météo, effets d'écran

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 59 | `MOG_TitleLayers` | ✅ | — |
| 60 | `MOG_TitleParticles` | ✅ | — |
| 61 | `MOG_TitleMagicCircles` | ✅ | — |
| 62 | `MOG_Credits` | ✅ | — |
| 63 | `MOG_Weather_EX` | ✅ | — |
| 64 | `MOG_Compass` | ✅ | — |
| 65 | `MOG_EventIndicators` | ✅ | — |
| 66 | `MOG_DestinationPointer` | ✅ | — |
| 67 | `MOG_PixiFilters` | ✅ | — |
| 68 | `MOG_PictureEffects` | ✅ | — |
| 69 | `MOG_CharDustTrail` | ✅ | — |
| 70 | `MOG_CharGhostTrail` | ✅ | — |
| 71 | `MOG_CharShatterEffect` | ✅ | — |
| 72 | `MOG_CharacterMotion` | ✅ | — |
| 73 | `MOG_CharacterShadow` | ✅ | — |
| 74 | `MOG_EventSensor` | ✅ | — |
| 75 | `MOG_CursorBorder` | ✅ | — |
| 76 | `MOG_Scrollbar` | ✅ | — |
| 77 | `MOG_GoldHud` | ✅ | — |
| 78 | `MOG_TreasureHud` | ✅ | — |
| 79 | `MOG_TreasurePopup` | ✅ | — |
| 80 | `MOG_Music_Book` | ✅ | — |
| 81 | `MOG_Theatrhythm` | ✅ | — |

### ⑨ DIFFICULTÉ, UI d'âme & lisibilité

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 83 | `CorruptionFX` | ✅ | — |
| 84 | `SoulsDifficulty` | ✅ | — |
| 85 | `ChaseEnemies` | ✅ | — |
| 86 | `SoulMessages` | ⬜ | — |
| 87 | `CorruptedUI` | ✅ | — |
| 88 | `SoulHud` | ✅ | — |
| 89 | `ManaVisuals` | ✅ | — |
| 90 | `ReadableText` | ✅ | — |
| 91 | `DialogueWrap` | ✅ | — |
| 92 | `AudioGuard` | ✅ | — |

### ⑩ JADE · mémoire, regard, échos · ultimes

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 94 | `JadeMemoire` | ✅ | — |
| 95 | `JadeRegard` | ✅ | — |
| 96 | `JadeEchos` | ✅ | — |
| 97 | `ManaVisualEX` | ✅ | ManaVisuals |
| 98 | `VisualMaxEX` | ✅ | YEP_BattleEngineCore |
| 99 | `VisualMaxEX2` | ✅ | VisualMaxEX · VisualMaxEX |
| 100 | `UltiCinematics` | ✅ | — |
| 101 | `ParolesSysteme` | ✅ | JadeEntitePlunging |

### ⑪ LORE · les règles du monde, appliquées

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 103 | `Lore_SpirituelTrauma` | ✅ | — |
| 104 | `Lore_PrismeReel` | ✅ | — |
| 105 | `Lore_ObjetSpirituel` | ✅ | — |
| 106 | `Lore_Signatures` | ✅ | — |
| 107 | `Lore_Affinites` | ✅ | — |
| 108 | `Lore_Auras` | ✅ | — |
| 109 | `Lore_Factions` | ✅ | — |
| 110 | `Lore_SanteMentale` | ✅ | — |
| 111 | `Lore_CombatFlavor` | ✅ | — |
| 112 | `Lore_AmeRetourCode` | ✅ | — |
| 113 | `Lore_CorruptionReecriture` | ✅ | — |
| 114 | `Lore_FeuAmeRefuge` | ✅ | — |
| 115 | `Lore_SANEcran` | ✅ | — |
| 116 | `Lore_JadaMail` | ⬜ | — |
| 117 | `Lore_JadaTitre` | ⬜ | — |
| 118 | `Lore_JadaChoix` | ⬜ | — |
| 119 | `Lore_RealiteGlitch` | ⬜ | — |
| 120 | `Lore_ScoreFin` | ✅ | — |
| 121 | `Lore_Artefacts` | ✅ | — |
| 122 | `Lore_DilatationTemps` | ⬜ | — |
| 123 | `Lore_JoueurPNJ` | ✅ | — |
| 124 | `Lore_RumeurMonde` | ⬜ | — |
| 125 | `Lore_AbsorptionAme` | ✅ | — |
| 126 | `Lore_CodexAuto` | ✅ | — |

### ⑫ AFFINITÉS, ERRANCE & MARQUE

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 128 | `TriangleAffinites` | ✅ | — |
| 129 | `Errance` | ✅ | — |
| 130 | `FusionElements` | ✅ | — |
| 131 | `RangsPuissance` | ✅ | — |
| 132 | `AuraPaliers` | ✅ | — |
| 133 | `FrappeAme` | ✅ | — |
| 134 | `MarqueVivante` | ✅ | — |

### ⑬ LORE · pactes, lois, reprises, camps

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 136 | `Lore_AldebaranAppel` | ✅ | — |
| 137 | `Lore_LoiNoyade` | ✅ | — |
| 138 | `Lore_MaitrisesInterdites` | ✅ | — |
| 139 | `Lore_Reprises` | ✅ | — |
| 140 | `Lore_CampsLumiereOmbre` | ✅ | — |

### ⑭ DESTINS PARALLÈLES & PREMIÈRES CHUTES

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 142 | `DestinsParalleles` | ✅ | — |
| 143 | `PremiersPas` | ✅ | — |
| 144 | `PortesProgression` | ✅ | — |
| 145 | `ViesParalleles` | ✅ | DestinsParalleles · CorruptionAme |
| 146 | `AtelierTest` | ⬜ | — |
| 147 | `ChutesCinematiques` | ✅ | — |
| 148 | `ChutesDefinitives` | ✅ | ChutesCinematiques |
| 149 | `ElementsVivants` | ✅ | — |

### ⑮ LES CHUTES · noyau, progression, hallucinations

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 151 | `ChutesNoyau` | ✅ | — |
| 152 | `VisualOverhaul` | ✅ | — |
| 153 | `ChutesProgression` | ✅ | ChutesCinematiques |
| 154 | `ChutesHallucinations` | ✅ | ChutesProgression |

### ⑯ FUSIONS, VOIES, DONS SPIRITUELS & TRAITS

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 156 | `FusionMana` | ✅ | CorruptionAme · Errance · JadeEntitePlunging |
| 157 | `MaitriseVoies` | ✅ | — |
| 158 | `GuideVoiesParoles` | ✅ | MaitriseVoies · ParolesSysteme |
| 159 | `RoyaumeImperial` | ✅ | InvocationAmes · Errance · JadeEntitePlunging |
| 160 | `DonsSpirituels` | ✅ | ObjetSpirituel · Errance · JadeEntitePlunging |
| 161 | `TraitsAme` | ✅ | Errance · JadeEntitePlunging · MarqueVivante · DonsSpirituels |
| 162 | `AvatarSpirituel` | ✅ | DonsSpirituels · TraitsAme |
| 163 | `ClarteUI` | ✅ | — |
| 164 | `CodexSources` | ✅ | — |
| 165 | `CanonPlus` | ✅ | CorruptionAme · Errance |
| 166 | `FusionsEtendues` | ✅ | FusionMana · CorruptionAme · Errance · JadeEntitePlunging |
| 167 | `DebutMarques` | ✅ | — |
| 168 | `UltimesSources` | ✅ | CorruptionAme · Errance · JadeEntitePlunging · ManaAffinity |
| 169 | `AmbianceCanon` | ✅ | — |
| 170 | `PorteurDAmes` | ✅ | InvocationAmes · Errance · CanonPlus |
| 171 | `PNJVivantsPlus` | ✅ | ViesParalleles · CanonPlus |
| 172 | `GrimoireHub` | ✅ | — |
| 173 | `Codex_Chutes` | ✅ | JadeEntitePlunging · CorruptionAme |

### ⑰ FIN DE JEU · pactes, mue, théâtre, le Mur

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 175 | `PactesAldebaran` | ✅ | Errance · CorruptionAme |
| 176 | `LeRegard` | ✅ | JadeEntitePlunging · Errance |
| 177 | `MueMaitrisee` | ✅ | CorruptionAme · Codex_Chutes |
| 178 | `RevesFeuAme` | ✅ | Errance · CorruptionAme |
| 179 | `Resonance` | ✅ | LiensSocial · Errance |
| 180 | `MondeTeLit` | ✅ | CorruptionAme · Errance |
| 181 | `ChasseursAme` | ✅ | CorruptionAme · Errance |
| 182 | `ContagionAme` | ✅ | CorruptionAme · Errance |
| 183 | `PlongerLac` | ✅ | JadeEntitePlunging · LeRegard |
| 184 | `ObjetEveille` | ✅ | CorruptionAme · Errance |
| 185 | `TheatreDement` | ✅ | JadeEntitePlunging |
| 186 | `LeMur` | ✅ | JadeEntitePlunging |
| 187 | `ChroniqueMonde` | ✅ | — |
| 188 | `DementInterne` | ✅ | Codex_Chutes · TheatreDement |

### ⑱ CORRECTIFS · le filet de sécurité ferme la marche

| # | Plugin | | Doit suivre |
|---|---|---|---|
| 190 | `Zikhrael_Mazal` | ✅ | — |
| 191 | `PlancherDegats` | ✅ | — |
| 192 | `MenuClair` | ✅ | — |
| 193 | `SafetyNet` | ✅ | — |

---

## Fichiers présents mais non déclarés

41 fichiers dorment dans `js/plugins/` sans figurer dans `plugins.js`. Ils ne sont **pas**
chargés et ne coûtent rien — mais ils encombrent le dossier :

`--------------------` · `CTB_Timers` · `CTB_TimersMZ` · `EnemyBook` · `Foreground` · `GALV_TimedMessagePopups` · `MOG_ActorHud` · `MOG_SHud` · `MOG_TitlePictureCom` · `MOG_TitleSplashScreen` · `MOG_VisualTimer` · `ParallaxLayerMap` · `YEP_AnimateTilesOption` · `YEP_BaseTroopEvents` · `YEP_BuffsStatesCore` · `YEP_ElementCore` · `YEP_EquipCore` · `YEP_EventChasePlayer` · `YEP_FpsSynchOption` · `YEP_ItemCore` · `YEP_KeyboardConfig` · `YEP_LevelUpGrowthEffects` · `YEP_MainMenuManager` · `YEP_MessageCore` · `YEP_MoveRouteCore` · `YEP_PatchNotes` · `YEP_PictureSpritesheets` · `YEP_QuestJournal` · `YEP_RegionEvents` · `YEP_RegionRestrictions` · `YEP_SaveCore` · `YEP_SaveEventLocations` · `YEP_ScriptCallPluginCmd` · `YEP_VictoryAftermath` · `YEP_X_BattleSysATB` · `YEP_X_BattleSysSTB` · `YEP_X_CoreUpdatesOpt` · `YEP_X_ExtMovePack1` · `YEP_X_ItemUpgradeSlots` · `YEP_X_SkillCooldowns` · `rpg_sprites`

---

## Points de vigilance

- **89 plugins** aliasent `Game_Interpreter.pluginCommand`. C'est normal en MV, mais une
  erreur non rattrapée dans l'un d'eux casse les commandes de **tous les suivants** —
  d'où l'importance que `SafetyNet` ferme la marche.
- **25 plugins** redéfinissent `Game_Action.apply`, **20** `executeDamage`, **18**
  `makeDamageValue`. L'ordre entre eux décide de l'ordre d'application des effets.
- **23 plugins** se greffent sur `Scene_Map.update`, appelé 60 fois par seconde.
- **17 plugins** ajoutent une commande au menu principal — voir `MenuClair` dans
  [`RAPPORT_COMBAT.md`](RAPPORT_COMBAT.md) §5.2.