# 🗑️ Plugins abandonnés — désactivés puis retirés

Ces **29 plugins** avaient été **désactivés** dans le gestionnaire (tu les jugeais inutiles
ou nuisibles au rythme du jeu). Le **2026-07-17**, ils ont été retirés de `js/plugins.js`
et rangés ici pour désencombrer.

## Important
- Ils ne sont **plus dans `js/plugins.js`** : le jeu ne les connaît plus du tout.
- **Pour en récupérer un** : remonte son `.js` dans `js/plugins/` (racine) et rajoute-le
  dans le gestionnaire de plugins (à la bonne place — voir `docs/ORDRE_PLUGINS.md`).
- Rien n'est perdu : tout reste dans l'historique git, et les fichiers sont ici.

## Ce qui a été retiré, par thème
- **Feature « Miroirs / railleries » (abandonnée)** : `KevSignature`, `JosuMirror`,
  `MirrorTaunts`, `Lore_MiroirJosu`, `Lore_MiroirDono`, `Lore_MiroirKev`, `Lore_MiroirJadeExces`.
- **MOG cosmétiques** : `MOG_Footsteps`, `MOG_VariableHud`, `MOG_PictureGallery`,
  `MOG_CharParticles`, `MOG_CharPoses`, `MOG_EmotionFace`, `MOG_PickupThrow`,
  `MOG_MenuBackground`, `MOG_MenuCursor`, `MOG_MenuParticles`, `MOG_PartyHud`.
- **Couches d'horreur en trop** : `ChutesMurmures`, `ChutesLacMusique`, `ChutesAnalogHorror`.
- **Lore / systèmes coupés** : `DarkNecromancer`, `ManaCodex`, `Bloodstain`, `FactionsAmes`,
  `Pensees`, `JadeGaster`, `ThylaneFormes`, `LOU_HakariJackpot`.

> `AtelierTest` (menu de test dev) a été **conservé** dans `js/plugins.js` (désactivé) : il ne
> s'affiche qu'en playtest et sert pour le développement.
