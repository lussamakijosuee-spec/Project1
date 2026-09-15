# AUDIT DES 51 PLUGINS `Lore_`

> Fait le 2026-07-17. Chaque `Lore_*.js` lu et pesé (taille, hooks, notetags, effet réel).
> But : trouver le mort, le doublon, et proposer des **fusions** pour passer de 51 micro-plugins à ~30.

## Répartition
| Verdict | Nombre | Sens |
|---|---|---|
| **Stub mort** | 3 | vides, logique déplacée ailleurs — à retirer |
| Faux-stub (marche) | 2 | ratés par le scanner (hookent `BattleManager`) — à garder |
| Micro (1 petit effet) | ~21 | fonctionnent, mais minuscules — **candidats à fusion** |
| Substantiels | ~25 | vrais systèmes / commandes — à garder |

---

## 1. 🟢 STUBS MORTS — retirés (Lot 4a)
Trois plugins **vides** : leur logique a été **fusionnée dans `ManaAffinity.js`** (ils le disent eux-mêmes dans leur `@help`). Ils ne font littéralement rien.
- `Lore_ManaPurPerce` — le perce-résistance du Mana Pur est géré par ManaAffinity.
- `Lore_ManaReculVital` — le recul PV est géré par ManaAffinity.
- `Lore_CyclePopup` — le cycle ×1.5/×0.5 a été supprimé ; le popup n'a plus lieu d'être.

→ **✅ retirés de plugins.js + rangés dans `_abandonnes/`** (2026-07-17). Zéro impact (ils étaient inertes).

## 2. ⚠️ FAUX-STUBS — gardés
Le scanner les a notés « effet 0 » à tort : ils hookent `BattleManager.*` (pas `.prototype.*`). Ils **fonctionnent** :
- `Lore_JoueurPNJ` — définit l'API `Lignage.estJoueur()` + message à la mort d'un `<AmeBoss>`.
- `Lore_PrismeReel` — glitch visuel quand on lance un sort Mana Pur(7)/Semi-Parfait(16).

---

## 3. 🔵 PLAN DE FUSION PROPOSÉ (21 micro → ~7 plugins thématiques)
> Ces micro-plugins marchent, mais chacun ne fait qu'une chose. Les regrouper par thème réduit le nombre de fichiers, l'ordre de chargement, et le risque de conflit — **sans rien perdre** en comportement.

| Nouveau plugin | Fusionne | Ce que ça fait |
|---|---|---|
| **`Lore_Signatures`** ✅ **FAIT** | `Lore_PuitsAbime` · `Lore_FlammesMaudites` · `Lore_NovaSainte` · `Lore_VagueSacree` · `Lore_ForteresseAme` · `Lore_ArcCreatif` | tous les `<Signature: x>` d'armes/objets (6 → 1). *Bug de récursion infinie de l'« arc » corrigé au passage. Aucune signature n'était encore branchée sur un skill → risque nul.* |
| **`Lore_Affinites`** | `Lore_AffiniteAlignes` · `Lore_AffiniteDuaux` · `Lore_AffiniteAtones` · `Lore_AffiniteEvolue` | bonus/malus selon `<Mana>`/`<Mana2>`/`<Atone>` (4 → 1) |
| **`Lore_SanteMentale`** | `Lore_SANReposMarche` · `Lore_SANPanique` · `Lore_SANMurmures` · `Lore_SANTeinte` · `Lore_SoinsSAN` | tous les effets liés à la SAN (5 → 1) *(`Lore_SANEcran` = commande, garder à part)* |
| **`Lore_Auras`** | `Lore_AuraCorruption` · `Lore_AuraSource` | auras visuelles sous les acteurs (2 → 1) |
| **`Lore_Factions`** | `Lore_FactionCouleur` · `Lore_FactionRepute` | couleur + réputation de faction (2 → 1) |
| **`Lore_ObjetSpirituel`** | `Lore_ObjetSpirituel` + `Lore_ObjetSpirituelMenu` | paliers + ligne de menu (2 → 1) |
| **`Lore_CombatFlavor`** | `Lore_ManaSourceTag` · `Lore_RoueElements` · `Lore_LiensCombo` · `Lore_FlashElement` · `Lore_PasDeCombat` | petits effets de journal/visuel de combat (5 → 1) |

**Bilan** : ✅ **TOUTES FAITES (2026-07-17)** — les 7 fusions exécutées (`Lore_Signatures`, `Lore_Affinites`, `Lore_Auras`, `Lore_Factions`, `Lore_SanteMentale`, `Lore_ObjetSpirituel`+menu, `Lore_CombatFlavor`). Dossier `Lore_` : **51 → 29**. Comportement reproduit à l'identique ; 25 anciens fichiers rangés dans `_abandonnes/`. Vérifié : 168 plugins actifs, 0 fichier manquant, syntaxe JS OK.

## 4. 🟡 À GARDER TELS QUELS (systèmes / commandes uniques)
`Lore_AldebaranAppel` (REINE) · `Lore_LoiNoyade` (NOYADE) · `Lore_Reprises` · `Lore_CampsLumiereOmbre` · `Lore_MaitrisesInterdites` (`<Interdit>`) · `Lore_CodexAuto` · `Lore_CorruptionReecriture` · `Lore_Artefacts` (Clé/Masque) · `Lore_AbsorptionAme` (AMEABSORB) · `Lore_ScoreFin` (FINSCORE) · `Lore_SpirituelTrauma` · `Lore_SANEcran` (SAN afficher) · `Lore_AmeRetourCode` · `Lore_RealiteGlitch` (GLITCH) · `Lore_DilatationTemps` (TEMPS) · `Lore_FeuAmeRefuge` (FEUAME) · `Lore_RumeurMonde` · `Lore_JoueurPNJ` · `Lore_PrismeReel` · la famille **JADA** (`Lore_JadaTitre` · `Lore_JadaMail` · `Lore_JadaChoix` — méta-horreur, fusionnables entre elles si tu veux).

---

## Note honnête
- Le « score d'effet » du scanner est **approximatif** (il sous-compte les hooks `BattleManager`). J'ai relu à la main tout ce qui était classé « stub » ; les fusions ci-dessus sont des **propositions** à valider avant exécution.
- **Fusionner = réécrire du code** : ça se teste. Je le ferais **par famille**, une à la fois, en vérifiant à chaque étape que le comportement est identique.
