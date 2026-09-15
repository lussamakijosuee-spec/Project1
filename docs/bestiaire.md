# 👹 Bestiaire — *Le Monde des Trois Sources* (Phase 3)

> Refonte du bestiaire sur le canon du Codex. Les anciens bosses (Jade, Dono, Kev,
> Josu, Quentin…) sont **rethemés** en figures du nouveau monde (mêmes blocs de
> stats réutilisés). Canon : `docs/lore.md`, casting : `docs/personnages.md`.

---

## 🏛️ Bosses majeurs (réutilisent les anciens blocs de stats)

| ID | Nouveau nom | Rôle dans le monde | Ancien (archivé) |
|----|-------------|--------------------|------------------|
| 76 | **La Reine Oubliée** | la Déesse Blanche — le boss cosmique final (la tentation) | Josu, le Dieu Fou |
| 39 | **L'Empereur Kevératus** | l'Autorité qui veut naître la première (course aux Sommets) | JADE prime |
| 34 | **Arbitre de l'Ordre d'Or** | le juge qui traque Aël ; la part d'ombre de l'équilibre | Dono |
| 21 | **Champion de Vultric** | le bras armé de l'Empire (Maîtrise interdite, sang de bête) | Kev phase 2 |
| 25 | **Errant Gonflé** | une âme qui a trop consommé — boss de la Chute de l'Âme | Jade la marionnette |
| 23 | **Noyé du Lac** | un descendeur perdu au Mur — horreur, voix, oubliés | Jade corrompu |
| 72 | **Esprit Errant** | une âme errante hostile (mini-boss du Lac) | Esprit Vengeur de Dono |
| 18 | **Maraudeur des Marges** | rival/bandit des terres sans loi | Quentin |
| 74 | **Mercenaire** | adversaire de bas étage des Marges | Quentin |

---

## 🐺 Familles d'ennemis du monde *(à peupler — Phase 3)*

- **Les Sang-de-Bête / Meutes** *(Corps)* — guerriers de Vultric, exilés à la
  lisière de la Bête. Cornes, griffes, sang violet. Paliers Frémissement→Mue.
- **Les Noyés** *(Esprit)* — descendeurs revenus fous du Lac. Attaques psychiques,
  voient le « caché », infligent la perte de lucidité.
- **Les Errants / âmes errantes** *(Âme)* — entités muettes hors du monde, hostiles
  quand on les dérange. Drainent l'essence, infligent l'Errance.
- **Les Arbitres de l'Ordre d'Or** — chevaliers des trois voies, traquent les
  déséquilibrés. Combattants complets, durs.
- **Les soldats des Royaumes** — troupe de Vultric (Maîtrise), des Mages (Parole,
  invocations), de l'Est (familiers d'âme).
- **Les créatures du Lac / du Fond** — formes du Mur, Ombrefauves primordiaux,
  fragments de Vérité. Le bestiaire d'horreur des profondeurs.

---

## 🎯 Principes de design (cohérence lore ↔ combat)

- **Un ennemi = une source.** Son élément/mana trahit sa voie (Corps→Négatif,
  Esprit→Positif, Âme→Spirituel), donc ce qu'il inflige et comment on le contre.
- **Les bosses = des Autorités ou des champions.** Ils « plient » le combat
  (changent les règles de l'arène) — façon domaine d'Autorité.
- **Les Chutes infligées.** Certains ennemis poussent le héros vers une Chute :
  les Sang-de-Bête montent la Corruption, les âmes errantes l'Errance, les Noyés
  attaquent la lucidité (Santé Mentale).

---

## 🚧 À faire (Phase 3, suite)
- [ ] Peupler chaque famille (5-8 ennemis génériques par famille).
- [ ] Réviser les **notes** des bosses rethemés (retirer les tags des plugins
      désactivés : `MirrorTaunts`, `JosuMirror`… — sans impact car plugins off).
- [ ] Attribuer les **sorts dérivés** (801-806) à des ennemis/héros.
- [ ] `Troops.json` : recomposer les rencontres sur les nouvelles familles.
