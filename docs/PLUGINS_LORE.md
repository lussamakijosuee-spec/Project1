# 🔌 Les 50 Plugins de Lore — *Âmes & Mana*

Plugins additifs, **sans asset** (effets CSS/DOM), ancrés dans `docs/lore.md` et
`docs/SYSTEME_DE_MANA.md`. Chargés en fin de `plugins.js` (après YEP, ManaAffinity,
JadeEntitePlunging/`window.Ame`, CorruptionAme, LiensSocial, FactionsAmes,
VisualMaxEX, ThylaneFormes). Légende : **[A]** automatique · **[N]** notetag · **[C]** commande de plugin.

## 🌌 Le Mana : sources, cycle & branches
| # | Plugin | Déclencheur |
|---|--------|-------------|
| 01 | Lore_ManaSourceTag | **[A]** nomme la Source (Corps/Âme/Esprit/Pur) d'un sort au combat |
| 02 | Lore_ManaReculVital | **[N]** skill `<ReculVital: 15>` → le lanceur perd 15 % des dégâts en PV (Atone : moitié) |
| 03 | Lore_SoinsSAN | **[A]** « un esprit brisé soigne mal » : soins réduits si SAN basse |
| 04 | Lore_ManaPurPerce | **[A]** éléments Mana Parfait(7)/Semi-parfait(16) ignorent les résistances |
| 05 | Lore_SpirituelTrauma | **[A]** sorts Mana Spirituelle(2) : risque de Trauma au lanceur (−1 SAN) |
| 06 | Lore_CyclePopup | **[A]** popup `AVANTAGE ×1.5` / `RÉSISTE ×0.5` selon le cycle des branches |
| 07 | Lore_RoueElements | **[N]** ennemi `<RoueElem: 8>` → annonce `FAIBLESSE !` selon la Roue |

## ⚜️ Affinités de l'âme
| # | Plugin | Déclencheur |
|---|--------|-------------|
| 08 | Lore_AffiniteAlignes | **[N]** `<Mana: x>` seul → +20 % dans sa source, −20 % ailleurs |
| 09 | Lore_AffiniteDuaux | **[N]** `<Mana: x>`+`<Mana2: y>` → +10 % dans deux sources |
| 10 | Lore_AffiniteAtones | **[N]** `<Atone>` → moins de dégâts Négatif/Sombre, corruption ÷2 |
| 11 | Lore_AffiniteEvolue | **[A]** SAN basse → +15 % Corps ; SAN haute → +15 % Esprit |
| 12 | Lore_PrismeReel | **[A]** lancer du Mana semi-parfait/pur déforme la réalité (glitch) |

## ✨ Sorts signature (Élément + Mana) — notetag `<Signature: …>`
| # | Plugin | Notetag |
|---|--------|---------|
| 13 | Lore_FlammesMaudites | `<Signature: flammes>` — brûlure qui perce (Feu+Négatif) |
| 14 | Lore_VagueSacree | `<Signature: vague>` — soin + bouclier de groupe (Eau+Positif) |
| 15 | Lore_PuitsAbime | `<Signature: abime>` — effondre la MDF (Ombre+Sombre) |
| 16 | Lore_NovaSainte | `<Signature: nova>` — purifie la corruption (Lumière+Pur) |
| 17 | Lore_ArcCreatif | `<Signature: arc>` — forme libre, bonus aléatoire (Foudre+Originel) |
| 18 | Lore_ForteresseAme | `<Signature: forteresse>` — rempart lié à l'Objet Spirituel (Terre+Spirituel) |

## 🪞 L'Objet Spirituel, l'Âme & la Corruption
| # | Plugin | Déclencheur |
|---|--------|-------------|
| 19 | Lore_ObjetSpirituel | **[A]** 4 paliers (Éclat/Forme/Résonance/Vérité) selon le niveau |
| 20 | Lore_ObjetSpirituelMenu | **[A]** palier affiché dans l'écran Statut |
| 21 | Lore_AmeRetourCode | **[A]** mort = l'âme retourne au code + coût en âmes (Var 15) |
| 22 | Lore_CorruptionReecriture | **[A/C]** corruption haute → monde désaturé ; `REECRITURE` |
| 23 | Lore_AuraCorruption | **[A]** aura sombre sur les héros corrompus |
| 24 | Lore_FeuAmeRefuge | **[C]** `FEUAME repos` → soigne PV/PM + restaure la SAN |

## 🧠 Santé Mentale (SAN)
| # | Plugin | Déclencheur |
|---|--------|-------------|
| 25 | Lore_SANTeinte | **[A]** vignette selon la pire SAN du groupe |
| 26 | Lore_SANPanique | **[A]** SAN phase 1 → la fenêtre de commandes tremble |
| 27 | Lore_SANMurmures | **[A]** murmures sur la carte quand la SAN est basse |
| 28 | Lore_SANEcran | **[C]** `SAN afficher` → écran de Santé Mentale |
| 29 | Lore_SANReposMarche | **[N]** carte `<SafeZone>` → marcher restaure la SAN |

## 👁️ Méta-horreur (Jada, 4e mur)
| # | Plugin | Commande |
|---|--------|----------|
| 30 | Lore_JadaMail | `JADA mail` — fausse invitation e-mail |
| 31 | Lore_JadaTitre | `JADA titre <texte>` — glitche le titre de la fenêtre |
| 32 | Lore_JadaChoix | `JADA choix <question>` — un « Non » qui se dérobe |
| 33 | Lore_RealiteGlitch | `GLITCH [ms]` — distorsion (+ auto si corruption extrême) |

## 🏛️ Factions, Fins & Artefacts
| # | Plugin | Déclencheur |
|---|--------|-------------|
| 34 | Lore_FactionRepute | **[C]** `REPUTE add <faction> <n>` · `REPUTE ecran` (`window.Reputation`) |
| 35 | Lore_FactionCouleur | **[N]** ennemi `<Faction: vultric\|culte\|etoiles\|prisme>` |
| 36 | Lore_ScoreFin | **[C]** `FINSCORE [varId]` — score de fin (`window.ScoreFin`) |
| 37 | Lore_Artefacts | **[C]** `ARTEFACT cle\|masque on\|off` — Masque : Mana Pur +25 % |
| 38 | Lore_LiensCombo | **[A]** Liens forts → +2 %/niveau de dégâts au groupe (max +20 %) |

## 🎭 Les Miroirs Héros ⇄ Boss
| # | Plugin | Notetag ennemi |
|---|--------|----------------|
| 39 | Lore_MiroirJosu | `<MiroirJosu>` — plus on le frappe, plus il s'amuse (contre : Thylane sereine) |
| 40 | Lore_MiroirDono | `<MiroirDono>` — fixation sur un héros (contre : Neyssa concentrée) |
| 41 | Lore_MiroirKev | `<MiroirKev>` — écrase le doute, punit l'arrogance (contre : Tianna confiante) |
| 42 | Lore_MiroirJadeExces | `<MiroirJade>` — vole les renforts (contre : Lou en retenue) |

## 🌍 Immersion du monde
| # | Plugin | Déclencheur |
|---|--------|-------------|
| 43 | Lore_DilatationTemps | **[C]** `TEMPS afficher` — 1 min réelle ≈ 1000 ans |
| 44 | Lore_JoueurPNJ | **[N]** `<PNJ>`/`<AmeBoss>` — seuls les Joueurs recueillent l'âme d'un boss |
| 45 | Lore_RumeurMonde | **[A]** rumeurs de lore sur la carte (switch d'arrêt configurable) |
| 46 | Lore_AbsorptionAme | **[C]** `AMEABSORB <nom>` — cinématique d'absorption + gain d'âmes |
| 47 | Lore_CodexAuto | **[A/C]** découvre les sources rencontrées ; `CODEXMANA` pour consulter |

## 🎨 Finitions visuelles
| # | Plugin | Déclencheur |
|---|--------|-------------|
| 48 | Lore_FlashElement | **[A]** flash écran coloré par élément sur les gros coups (≥25 % PV) |
| 49 | Lore_PasDeCombat | **[A]** le lanceur fait un pas vif vers l'avant |
| 50 | Lore_AuraSource | **[A]** aura de source (couleur d'âme) sous chaque héros |

---
> Tous s'appuient sur les APIs existantes (`window.Ame`, `window.Corruption`,
> `window.Lien`, `$gameSystem.faction()`, Var 15 = âmes) avec garde-fous : si un
> système n'est pas chargé, le plugin reste neutre. Aucun fichier image/audio requis.
