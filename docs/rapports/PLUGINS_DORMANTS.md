# Les plugins qui dorment

> Mesure du 2026-09-18. La restauration du 2026-09-15 n'a gardé que les plugins **tiers**.
> Les systèmes écrits par JOKO sont restés dans `_ancien_projet/` — mais **leurs marqueurs sont toujours posés
> dans `data/`**. Chaque ligne ci-dessous est un plugin absent dont au moins un notetag est employé par le jeu.

Le « poids » est le nombre total d'entrées de `data/` qui portent un de ses marqueurs.

| poids | plugin | dossier | lignes | marqueurs posés | ce qu'il fait |
|---:|---|---|---:|---|---|
| 984 | `AuraPaliers` | systemes_du_jeu | 130 | `<Mana>` ×555 · `<Aura>` ×421 · `<Mana2>` ×8 | En combat, une AURA visible enveloppe chaque combattant : |
| 563 | `AmeStatusScene` | systemes_du_jeu | 274 | `<Mana>` ×555 · `<Mana2>` ×8 | Écran/Page visuelle de Santé Mentale (jauges des 4 âmes) |
| 559 | `BestiaireAmes` | systemes_du_jeu | 121 | `<Mana>` ×555 · `<Lore>` ×4 | Bestiaire qui se remplit au combat : stats, affinité de |
| 555 | `Lore_CombatFlavor` | systemes_lore | 107 | `<Mana>` ×555 | [Lore] Saveur de combat fondue : annonce de Source, « FAIBLESSE ! » (Roue), bonus de Liens, flash élémentaire  |
| 555 | `Lore_ManaSourceTag` | abandonnes | 37 | `<Mana>` ×555 | [Lore 01/50] Journal de combat : nomme la Source (Corps/Ame/Esprit/Pur) et son role dans le cycle. |
| 103 | `PortesProgression` | systemes_du_jeu | 255 | `<Voie>` ×98 · `<Invocation>` ×4 · `<FrappeAme>` ×1 | « Le secret n'est pas de maxer une voie, mais d'entraîner |
| 34 | `DonsSpirituels` | systemes_du_jeu | 920 | `<Sang>` ×21 · `<Ombre>` ×13 | UN SEUL Don par personne : 80% une ARME (slot Arme), 18% un |
| 24 | `Codex_Chutes` | systemes_du_jeu | 893 | `<ErrantTombe>` ×9 · `<DementTombe>` ×7 · `<BeteTombee>` ×6 · `<DechireTombe>` ×1 | Les 4 chutes en UN plugin : Dément (il croit rester), |
| 14 | `TraitsAme` | systemes_du_jeu | 435 | `<Trait>` ×14 | Le TRAIT : le don unique que l'âme offre à la naissance. |
| 12 | `ComboLiens` | systemes_du_jeu | 82 | `<Combo>` ×6 · `<ComboLien>` ×6 | Combos d'équipe : des compétences spéciales (duo/trio/ |
| 10 | `AmbianceCanon` | systemes_du_jeu | 66 | `<TraitBoss>` ×8 · `<Regard>` ×2 | Battement de cœur à Corruption 70+, musique de combat du |
| 9 | `RoyaumeImperial` | systemes_du_jeu | 236 | `<Invocation>` ×4 · `<SceauMagie>` ×2 · `<RoyaumeImperial>` ×1 · `<AspirationDamnees>` ×1 | Le Domaine de ludwing : toutes les âmes reviennent, toutes |
| 8 | `CanonPlus` | systemes_du_jeu | 195 | `<TraitBoss>` ×8 | 5 systèmes canon : PURGE (transvaser, jamais effacer), |
| 8 | `SuccesTitres` | systemes_du_jeu | 146 | `<Mana2>` ×8 | Succès débloquables avec écran dédié + entrée menu. |
| 7 | `DementInterne` | systemes_du_jeu | 178 | `<DementTombe>` ×7 | [v1.0] Complète le Dément : combats-hallucinations sans butin ni |
| 6 | `FusionsEtendues` | systemes_du_jeu | 82 | `<FusionTech>` ×3 · `<Rune>` ×3 | La FUSION est un principe, pas un sort : fondre deux |
| 6 | `RelicPassifs` | systemes_du_jeu | 87 | `<Relic>` ×6 | Passifs uniques des reliques équipées (notetag <Relic: x>) : |
| 4 | `InvocationAmes` | systemes_du_jeu | 49 | `<Invocation>` ×4 | Compétences d'invocation : <Invocation: n> dépense n âmes |
| 4 | `PorteurDAmes` | systemes_du_jeu | 77 | `<Invocation>` ×4 | Les âmes : tout le monde les récolte (tuer = +1 Errance |
| 3 | `UltimesSources` | systemes_du_jeu | 205 | `<Ultime>` ×3 | Les ultimes d'Aël (la Convergence), Korrah (la Mue |
| 2 | `JadeMemoire` | systemes_du_jeu | 318 | `<JadeMemoire>` ×2 | Jade se SOUVIENT de tes parties precedentes (hors sauvegarde) : |
| 2 | `JadeObsession` | systemes_du_jeu | 978 | `<Malenia>` ×2 | Boss IA ENDGAME (Niv 80) : L'Obsession de Jade avec Plunging Méta, IA Mentale et Screamers Visuels. |
| 1 | `FrappeAme` | systemes_du_jeu | 116 | `<FrappeAme>` ×1 | <FrappeAme> : le coup traverse chair, armure et mana |
| 1 | `MueMaitrisee` | systemes_du_jeu | 255 | `<Mue>` ×1 | [v1.0] Maîtriser la Mue : transforme-toi en Bête à volonté en |
| 1 | `Lore_MaitrisesInterdites` | systemes_lore | 72 | `<Interdit>` ×1 | [Lore] <Interdit> sur un skill : dégâts fortement amplifiés, |
| 1 | `JadeGaster` | abandonnes | 344 | `<Gaster>` ×1 | Boss secret "style Gaster" : entrée glitchée, Gaster Blasters, |
| 1 | `KevSignature` | abandonnes | 85 | `<Radahn>` ×1 | Kev (<Radahn>) : sa fureur enfle à chaque tour (ATK qui |

## Remonter un plugin

```bash
# 1 · le fichier
mv _ancien_projet/02_plugins/<dossier>/<Nom>.js js/plugins/
# 2 · son entrée dans js/plugins.js — son réglage d'origine est dans
#     _ancien_projet/02_plugins/plugins.js.ancien
```

Sept bancs redeviennent mesurables dès que leur plugin revient : `1_dons_spirituels`, `2_evolution_paliers`,
`3_avatar_spirituel`, `5_verrou_et_ordres`, `6_avatar_niveaux` (Dons), `audit/8_tableau_de_chasse`
(`ChasseAuxPrimes`), `audit/9_equilibre` (`SoulsDifficulty`).
