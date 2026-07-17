# AUDIT DES PLUGINS — le tri à faire

> Fait le 2026-07-17 en croisant les **fichiers sur disque** avec **`js/plugins.js`** (ce qui est réellement chargé).
> But : repérer le mort, le doublon et le lore abandonné. **Rien n'est supprimé ici** — c'est une liste de décision.

## Le constat en un chiffre
- **278** fichiers `.js` sur disque
- **190** réellement **chargés** (activés dans plugins.js)
- ⇒ **~88 fichiers (≈ 1 sur 3) ne servent pas au jeu qui tourne.**

| Catégorie | Nombre | Impact sur le jeu | Action |
|---|---|---|---|
| Chargés & actifs | 190 | c'est ton jeu | garder |
| **Désactivés** (par toi) | 30 | aucun | à trancher — voir §3 |
| **Orphelins** (chargés par rien) | 57 | aucun | voir §1-2 |
| Séparateurs (`--------`) | ~17 | aucun (décoratif) | garder, c'est normal |

---

## 1. 🟢 MORT SÛR — à retirer sans réfléchir (chargé par rien, aucun impact)
Ces fichiers ne sont **pas** dans plugins.js : le jeu ne les charge jamais.

**Séparateurs orphelins** (doublons des séparateurs du gestionnaire) :
`-BATTLE` · `-GAMEPLAY` · `-HUD` · `-MENU` · `-SCENES` · `-TITLE SCREEN` · `-VISUAL`

**Plugins custom abandonnés** (faits, puis jamais branchés) :
`Cinematiques` · `JadeScreamer` · `ParolesMagic` · `PsychoSystem`

> ⚠️ Détail à savoir : **`ParolesMagic` et `Cinematiques` sont cités comme actifs dans le codex/les docs**, alors qu'ils ne sont **pas chargés**. Soit tu les rebranches, soit on corrige les docs.

## 2. 🧰 BOÎTE À OUTILS — présents mais éteints (à garder OU archiver, ton choix)
Ce ne sont **pas** du lore abandonné : ce sont des **librairies** que tu pourrais réactiver un jour. Elles ne gênent pas (non chargées), mais elles encombrent le dossier.

- **YEP (Yanfly)** — 29 fichiers non chargés : `YEP_MessageCore`, `YEP_ItemCore`, `YEP_EquipCore`, `YEP_BuffsStatesCore`, `YEP_QuestJournal`, `YEP_SaveCore`, `YEP_ElementCore`, `YEP_X_SkillCooldowns`… (+ `KELYEP_DragonBones`)
- **MOG non utilisés** — 7 : `MOG_ActorHud`, `MOG_Music_Book`, `MOG_SHud`, `MOG_Theatrhythm`, `MOG_TitlePictureCom`, `MOG_TitleSplashScreen`, `MOG_VisualTimer`
- **Autres libs** — `EnemyBook`, `ItemBook`, `CTB_Timers`/`CTB_TimersMZ`, `GALV_TimedMessagePopups`, `SimpleMsgSideView`, `AltMenuScreen`, `AltSaveScreen`, `TitleCommandPosition`, `WeaponSkill`

💡 **Idée propre** : les déplacer dans `js/plugins/_boite_a_outils/` — le jeu ne les regarde pas (ils ne sont pas dans plugins.js), mais ton dossier de plugins actifs redevient lisible.

## 3. 🟡 TES DÉSACTIVÉS — à confirmer pour suppression (tu les as jugés inutiles/rythme)
30 plugins que **tu** as éteints. Si tu es sûr de ne pas revenir dessus, on les retire (fichier + entrée). Regroupés :

- **La feature « Miroirs / railleries » (abandonnée ?)** — 7 : `KevSignature` · `JosuMirror` · `MirrorTaunts` · `Lore_MiroirJosu` · `Lore_MiroirDono` · `Lore_MiroirKev` · `Lore_MiroirJadeExces`
- **MOG cosmétiques** — 11 : `MOG_Footsteps` · `MOG_VariableHud` · `MOG_PictureGallery` · `MOG_CharParticles` · `MOG_CharPoses` · `MOG_EmotionFace` · `MOG_PickupThrow` · `MOG_MenuBackground` · `MOG_MenuCursor` · `MOG_MenuParticles` · `MOG_PartyHud`
- **Couches d'horreur en trop** — 3 : `ChutesMurmures` · `ChutesLacMusique` · `ChutesAnalogHorror`
- **Divers lore/systèmes coupés** — `DarkNecromancer` · `ManaCodex` · `Bloodstain` · `FactionsAmes` · `Pensees` · `JadeGaster` · `ThylaneFormes` · `LOU_HakariJackpot`
- **À GARDER quand même** : `AtelierTest` (ton menu de test dev — désactivé en jeu exporté, c'est normal).

---

## 4. 🔵 LES VRAIS DOUBLONS ? — moins qu'il n'y paraît (vérifié)
J'ai contrôlé les « versions EX / 2 » qu'on croirait redondantes : elles sont en fait **complémentaires**, pas des copies. Ne les touche pas.

| Ce qui SEMBLE un doublon | La réalité |
|---|---|
| `ManaVisuals` vs `ManaVisualEX` | l'un colore les noms de compétences, l'autre anime les barres de stats — **différents** |
| `VisualMaxEX` vs `VisualMaxEX2` | popups de dégâts vs jauges qui glissent — **différents** |
| `JadeRework` vs `JadeEntitePlunging` | un boss secret vs la jauge de santé mentale — **rien à voir** |
| la pile `Chutes*` (18) | architecture en couches : `ChutesNoyau` = cœur, les autres = effets par-dessus — **pas des copies** |

## 5. 🟣 LE VRAI POIDS À MOYEN TERME — les 55 `Lore_`
55 micro-plugins `Lore_*` (51 activés). Chacun fait une petite chose. C'est **là** que se cache le plus de « lore abandonné » potentiel et le plus gros risque de conflit — mais ça demande de les **lire un par un** pour distinguer le vivant du mort. Candidats à fusionner en 3-4 gros plugins par thème (affinités, signatures, SAN…), ou à élaguer.

---

## Plan proposé (par lots, réversibles, rien sans ton feu vert)
1. **Lot 1 — mort sûr** (§1) : ✅ **FAIT (2026-07-17)** — 7 séparateurs orphelins + 4 custom abandonnés (`Cinematiques`, `JadeScreamer`, `ParolesMagic`, `PsychoSystem`) retirés ; docs corrigées (`ParolesMagic` → `ParolesSysteme`, `Cinematiques` marqué retiré). 278 → 267 fichiers.
2. **Lot 2 — rangement** (§2) : ✅ **FAIT (2026-07-17)** — les 46 orphelins (YEP/MOG/libs) déplacés dans `js/plugins/_boite_a_outils/` (voir le LISEZ-MOI du dossier). Racine : 221 fichiers, tous chargés. Vérifié : 190 plugins actifs, 0 fichier manquant.
3. **Lot 3 — tes désactivés** (§3) : ✅ **FAIT (2026-07-17)** — 29 désactivés retirés de `js/plugins.js` (237 → 208 entrées) et fichiers rangés dans `js/plugins/_abandonnes/`. `AtelierTest` conservé (test dev). Vérifié : 190 plugins actifs inchangés, 0 fichier manquant, plugins.js revalidé.
4. **Lot 4 — les `Lore_`** (§5) : audit détaillé plugin par plugin, puis fusion/élagage.
