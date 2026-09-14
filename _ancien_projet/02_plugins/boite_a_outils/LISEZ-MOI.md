# 🧰 Boîte à outils — plugins en réserve (NON chargés)

Ces **46 plugins** ne sont **pas utilisés** par le jeu : ils n'étaient pas listés dans
`js/plugins.js`. Ils ont été rangés ici le **2026-07-17** pour que le dossier
`js/plugins/` ne contienne que les plugins **réellement chargés**.

## Important
- **RPG Maker MV ne charge PAS les sous-dossiers.** Tant qu'un plugin est ici, il est inactif — c'est voulu.
- **Pour réactiver un plugin** : remonte son fichier `.js` dans `js/plugins/` (à la racine),
  puis ajoute-le dans le gestionnaire de plugins (ou dans `js/plugins.js`), et coche-le.
- Ce sont surtout des **librairies** (Yanfly/YEP, MOG, etc.) qui peuvent servir plus tard —
  ce n'est **pas** du lore abandonné, donc on ne les jette pas.

## Contenu
- **Yanfly (YEP)** : moteur & extensions (MessageCore, ItemCore, EquipCore, BuffsStatesCore,
  QuestJournal, SaveCore, ElementCore, X_SkillCooldowns…) + `KELYEP_DragonBones`.
- **MOG** : `MOG_ActorHud`, `MOG_SHud`, `MOG_Music_Book`, `MOG_Theatrhythm`, `MOG_VisualTimer`,
  `MOG_TitleSplashScreen`, `MOG_TitlePictureCom`.
- **Autres librairies** : `EnemyBook`, `ItemBook`, `CTB_Timers`/`CTB_TimersMZ`,
  `GALV_TimedMessagePopups`, `SimpleMsgSideView`, `AltMenuScreen`, `AltSaveScreen`,
  `TitleCommandPosition`, `WeaponSkill`.

Voir `docs/AUDIT_PLUGINS.md` pour le détail du tri.
