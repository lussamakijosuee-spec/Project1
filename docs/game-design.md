# 🎮 Game Design — *Le Monde des Trois Sources* (refonte A→Z)

> Feuille de route de **reconstruction**. L'ancien GDD (Battle World) est archivé
> dans `docs/_archive/game-design-battleworld.md`. Canon : `docs/lore.md` +
> `docs/codex-trois-sources.html`. Système : `docs/SYSTEME_DE_MANA.md`.

---

## 1. 🌟 Vision

Un J-RPG de **dark fantasy** dans un monde bâti sur **trois sources** — Corps,
Âme, Esprit — et sur la **peur de ce qui se tient au-delà** (le Lac, le Mur, la
Déesse Blanche). Le héros est un **marqué** : il puise au Fond, gagne en
puissance, et frôle sa **Chute**. Le vrai sujet du jeu : **rester soi** quand tout
pousse à pencher.

**Piliers de design**
1. **Le pouvoir a un prix** — chaque source donne sa force *et* sa Chute.
2. **L'équilibre est le seul refuge** — le Mana Semi-Parfait se *tient*, pas se gagne.
3. **Un monde qui se craint lui-même** — quatre royaumes, une course aux Autorités.
4. **L'horreur du Lac** — plus on est lucide, plus on voit ce qu'on ne devrait pas.
5. **Tes choix te font pencher** — l'affinité évolue ; on glisse vers une Chute.

---

## 2. 🗺️ Le monde (résumé — détail dans `lore.md`)

- **Le Fond / le Lac** : la couche profonde, source de tout mana et de toute folie.
- **Trois Sources / Arts / Chutes** : Esprit/Parole/Dément · Corps/Souffle/Bête ·
  Âme/Symbole/Errant. Centre = Mana Semi-Parfait.
- **Quatre Royaumes** : Ordre d'Or (équilibre) · Empire Vultric (Corps) · Mages
  des Étoiles (Esprit) · Empire Uni de l'Est (Âme).
- **Les Autorités** & le **Concordat des Sommets** : la course muette du présent.
- **Les Marges** : Sans-Marque, Meutes, Noyés, Errants liés.
- **Le Mur & la Reine Oubliée** : l'horreur cosmique, la fausse lumière.

---

## 3. ⚙️ Systèmes — ce qui est CONSERVÉ (déjà codé, cohérent avec le canon)

| Pilier | Plugin(s) |
|--------|-----------|
| La Parole (Esprit) | `ParolesMagic`, `ManaVisuals`, `ManaCodex` |
| Le Souffle (Corps) | `ManaAffinity` (recul PV), skill types `sang`/`ombre` |
| Le Symbole (Âme) | `ObjetSpirituel` (la Marque), `InvocationAmes`, `LouCopySystem` |
| Lucidité / Dément | `JadeEntitePlunging` *(moteur de Santé Mentale — à renommer)*, `Neyssa_Concentration` |
| La Bête (Corps) | `CorruptionAme` (Calme/Frémissement/Fièvre/Mue), `CorruptionFX` |
| L'Errant (Âme) | `Errance`, `AmeSouls`, `Bloodstain` |
| Équilibre / Semi-Parfait | `Surpassement` |
| Éléments & dérivés | `System.json` (1-16 + 17/19/20/22/23/29), `ManaVisuals` |
| Feu d'Âme / mort / progression | `AmeSouls`, `ForgeAmes`, `SanctuaireAmes`, `AlchimieAmes`, `NewGamePlus` |
| Royaumes / social | `FactionsAmes`, `LiensSocial`, `ComboLiens`, `QuestJournal` |
| Monde vivant / présentation | `LivingNPC`, `NPCRoutines`, MOG_*, `ReadableText`, `DialogueWrap`, `SoulHud` |

> 🔧 **Dette technique de nommage :** plusieurs plugins gardent un nom hérité
> (`JadeEntitePlunging` = en fait le moteur de **Lucidité/Santé Mentale**). Le
> joueur ne voit jamais ces noms ; on les renommera dans une passe propre.

## 3bis. Systèmes/contenus DÉSACTIVÉS (anciens personnages / méta)

Désactivés dans `plugins.js` (status:false) — réactivables, rien n'est supprimé :
`JadeObsession`, `JadeBattleFX`, `JadeRework`, `JadeGaster`, `JadeMemoire`,
`JadeRegard`, `JadeEchos`, `DonoBoss`, `DonoKamui`, `KevSignature`, `JosuMirror`,
`MirrorTaunts`, `MahoragaBoss`, `DarkNecromancer`, `RageBaitDuo`, `CorruptedUI`.

> Les **données** liées (Enemies de Jade/Dono/Kev/Josu, Common Events de la lettre
> et des miroirs, NPC anciens, maps) seront **refaites** par phases (voir §5).

---

## 4. 🧑‍🎤 Le protagoniste & le parti *(à définir avec JOKO)*

Pistes pour le héros « marqué » :
- **Origine** : de quel Royaume / des Marges ? Quelle **source dominante** ?
- **Sa Marque** : couleur, nature d'âme (Volonté/Attachement/Colère/Foi/Deuil/
  Curiosité) → ce qu'il matérialise.
- **Sa Chute à éviter** : Bête, Errant ou Dément ? (Le danger qui le suit.)
- **Le parti** : 3-4 compagnons, idéalement **un par source** (pour incarner les
  trois voies et l'équilibre), plus un éventuel reflet de la **Chute**.

*(Les anciens héros Thylane/Neyssa/Lou/Tianna peuvent être **réécrits** comme
nouveaux personnages de ce monde, ou remplacés — décision ouverte.)*

---

## 5. 🛠️ Feuille de route de reconstruction (par phases)

### ✅ Phase 0 — Fondation *(faite)*
Archivage de l'ancien lore ; nouvelle bible `lore.md` (monde du Codex) ; GDD ;
désactivation des plugins d'anciens personnages.

### 🔨 Phase 1 — Identité & personnages
- [ ] Définir le **protagoniste**, le **parti**, l'antagoniste principal.
- [ ] Réécrire/relire les **Acteurs** (`Actors.json`, `Classes.json`) sur les 3 sources.
- [ ] Choisir le **point de départ** (Royaume ou Marge).

### 🗺️ Phase 2 — Le fil rouge
- [ ] Synopsis en actes (la course aux Autorités / le Mur / la Reine Oubliée).
- [ ] **Common Events** narratifs refaits ; anciens (lettre/miroirs/Jada) retirés.
- [ ] Quêtes principales (`MainQuests`) réécrites.

### ⚔️ Phase 3 — Contenu de combat
- [ ] **Ennemis** refaits (bestiaire du monde : Sang-de-Bête, Noyés, Errants,
      Arbitres, soldats des Royaumes, créatures du Lac).
- [ ] Bosses = des **Autorités** ou des champions de Royaume.
- [ ] Sorts dérivés (801-806) attribués ; arbre des éléments étendu.

### 🌍 Phase 4 — Le monde jouable
- [ ] **Maps** refaites (les Quatre Royaumes, les Marges, une descente dans le Lac).
- [ ] **PNJ** du monde (remplacer les anciens via `LivingNPC`).
- [ ] Feux d'Âme, Sanctuaires, voyage.

### 🎚️ Phase 5 — Fins & polish
- [ ] Fins liées aux **Chutes** et à l'**équilibre** (devenir une Autorité ?
      sombrer ? détourner le regard de la Déesse Blanche ?).
- [ ] Équilibrage, audio, transitions.

---

## 6. ❓ Décisions ouvertes (pour démarrer la Phase 1)
1. **Le protagoniste** : qui est-il, d'où vient-il, quelle source domine ?
2. **Le parti** : on réécrit les anciens héros, ou on repart sur de nouveaux ?
3. **Le fil rouge** : la course aux Autorités, la descente dans le Lac, ou
   l'appel de la Reine Oubliée — quel moteur principal ?
4. **Le ton de l'horreur** : combien de « Mur » / cosmique veux-tu en surface ?

> Réponds à celles-ci et on attaque la **Phase 1** (personnages + données).
