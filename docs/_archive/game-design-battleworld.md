# 🎮 Game Design Document — *Âmes & Mana*
> Bible de production. Organise le jeu **de A à Z** : vision, structure, systèmes,
> contenu, quêtes, fins, et la feuille de route vers la complétion.
> À lire avec `docs/lore.md` (canon narratif) et `docs/guide.html` (vitrine).

---

## 1. 🌟 Vision

**Pitch** : un J-RPG sombre et méta où un joueur invoqué dans un monde-jeu
(*Battle World*) découvre que ses héros ont une **âme** qui peut se briser, se
corrompre — et que le monde lui-même est un mensonge dont une marionnette veut
s'échapper vers le réel.

**Piliers de design**
1. **L'âme a un coût** — Santé Mentale & Corruption pèsent sur chaque choix.
2. **Le souls-like de l'esprit** — mourir coûte des âmes ; le Feu d'Âme est refuge.
3. **Un monde vraiment vivant** — 50+ PNJ réactifs, rumeurs, factions.
4. **Méta-horreur** — Jada brise le 4e mur ; la corruption déforme l'écran.
5. **Tes choix écrivent la fin** — 7 fins selon âmes, liens, faction, santé.

---

## 2. 🎬 Structure narrative (la colonne vertébrale)

> Inspiré des grands RPG : accroche forte → montée → exploration libre →
> convergence → climax → fins multiples → postgame.

### Prologue — *L'Invocation* (Château 1F & 3F)
- Le joueur reçoit un « mail » et est **invoqué** dans Battle World (méta).
- Cour du château : Roi, Reine, et **Dame Elara** (clone de Jada, douce/fausse).
- **Tutoriel diégétique** : Mana, attaque, premiers PV/PM.
- Hook : *« les âmes se dérèglent »*. On confie une quête au joueur.

### Acte I — *Le Monde d'Avant* (Camps de Nomades = hub)
- Découverte du **hub** : Muta & son refuge, les Affranchis, marchands.
- Déblocage : **Feu d'Âme** (checkpoint), **Âmes** (monnaie), **Liens**.
- Premières quêtes secondaires. Thème : *« il y avait un monde avant toi »*.

### Acte II — *Les Quatre Dimensions* (cœur du jeu)
Explorer les mondes des 4 Originels et confronter leurs âmes :
| Dimension | Maître | Faction | Mana dominant |
|-----------|--------|---------|----------------|
| **Battle World** | Josu (le Créateur) | — | Pur |
| **Empire Vultric** | Kev (Kiev) | Empire Vultric | Sombre |
| **Monde de Dono** | Dono | Culte des Âmes | Spirituel |
| **Royaume des Étoiles** | Jada | Royaume des Étoiles | Négatif |
- Déblocage : **Corruption** (abus du Sombre), **Bestiaire**, **Reliques**.

### Acte III — *Les Clés du Monde*
- Quête des artefacts admin : la **Clé** (sortie) et le **Masque** (code source).
- Révélations : Jada manipule l'invocation des joueurs ; Josu a tout caché.

### Acte IV — *L'Allégeance*
- Le joueur **rallie une faction** (ou les Affranchis) → oriente la fin.
- Conséquences durables sur le monde (PNJ, zones, rumeurs).

### Climax — *Le Dieu Fou*
- Confrontation finale avec **Josu**. Pas de « bonne » fin pour lui.
- Selon ton parcours → l'une des **7 fins**.

### Postgame
- Superboss : les **4 Originels à leur apogée**.
- **New Game +**, complétion Codex/Bestiaire, galerie des fins.

---

## 3. 🔁 Boucle de jeu

`Explorer → Combattre (gérer Mana/Santé/Corruption) → Récolter âmes →
Feu d'Âme (repos, Forge, purge) → Tisser des Liens → Quêtes → Avancer l'acte`

---

## 4. 🔓 Ordre de déblocage des systèmes

| Moment | Système débloqué |
|--------|------------------|
| Prologue | Mana & affinités · Objet Spirituel · Santé Mentale |
| Acte I | Feu d'Âme · Âmes · Forge · Liens · Quêtes (Journal) |
| Acte II | Corruption · Bestiaire · Reliques · Combos d'équipe |
| Acte III | Clé · Masque · Sanctuaire · Alchimie · Invocation |
| Acte IV | Factions · routes de fin |
| Postgame | New Game+ · superboss · galerie des fins |

> Règle d'or : **n'introduire qu'un système nouveau à la fois**, toujours via un
> PNJ ou un événement qui l'explique en contexte.

---

## 5. 🧩 Inventaire des systèmes (déjà en place)

**Combat & âme** : Système de Mana · Affinités · Santé Mentale (5 phases) ·
Corruption de l'Âme · Objet Spirituel évolutif · Concentration (Neyssa) ·
Copie & Domaine (Lou).
**Progression** : Feu d'Âme (souls-like) · Forge d'Âmes · Sanctuaire · Alchimie ·
Invocation · New Game+ · Reliques & Talismans · Bestiaire · Succès/Titres.
**Social** : Liens · Combos d'équipe · Factions (4 voies de fin).
**Monde** : LivingNPC (52 PNJ : rumeurs, barks, dialogues) · Jour/Nuit ·
Journal de quêtes · Codex du Mana (18 pages).
**Boss** : Mahoraga · Dono · Jade/JadeObsession (méta-horreur) · Régis & Quentin
(duo rage-bait) · Jade Dernier Souffle.
**Présentation (MOG)** : titre animé · compas · météo · marqueurs de quête ·
effets de perso · HUD or/coffres · filtres de corruption (CorruptionFX).

---

## 6. 🗺️ Inventaire du contenu

- **Maps** : 49 (château, hub Camps de Nomades, donjons, dimensions…).
- **Ennemis** : 75+ nommés (dont boss). **Compétences** : 270+. **Objets/armes** :
  90+ (dont 10 reliques). **États** : 180+.
- **PNJ vivants** : 52 (cour du château, Camps de Nomades, marginaux, Originels).

---

## 7. 📜 Structure des quêtes

### Quête principale (fil rouge — à câbler dans le Journal)
1. `q_main_1` — *L'Invocation* : comprendre où l'on est (Prologue).
2. `q_main_2` — *Le Dérèglement* : enquêter sur les âmes (Acte I).
3. `q_main_3` — *Les Quatre Mondes* : voyager dans les dimensions (Acte II).
4. `q_main_4` — *Les Clés* : trouver la Clé et le Masque (Acte III).
5. `q_main_5` — *L'Allégeance* : choisir sa voie (Acte IV).
6. `q_main_6` — *Le Dieu Fou* : la confrontation finale.

### Quêtes secondaires (exemples, branchées PNJ existants)
- `q_muta` — récupérer ses biens volés (or **ou** duel amical).
- `q_regis` — faire taire le rival (duo-boss Régis & Quentin).
- `q_elara` — percer le secret de la mage de la cour.
- `q_yuki` / `q_orin` / `q_selena`… — liens & histoires personnelles.

> Toutes pilotées par `QUEST add/obj/step/done` (plugin QuestJournal).

---

## 8. 🌓 Système de fins (récap)

Score calculé au climax : **âmes** · **Santé Mentale moyenne** · **Corruption** ·
**Liens** · **Clé/Masque** · **faction**.

| Fin | Déclencheur |
|-----|-------------|
| 🕊️ Paradis-Prison | défaut, âmes gardées |
| 🗝️ La Clé | Clé + Liens élevés + épargner Josu |
| 😈 Possession (Jada) | faction Étoiles / corruption max |
| 🕯️ Transcendance (Culte) | faction Culte des Âmes |
| ⚔️ Instinct (Vultric) | faction Empire Vultric |
| 🩸 Corruption Totale | équipe corrompue au max |
| 🌟 Cycle Brisé | 100% conditions positives (secrète) |

---

## 9. 🎛️ UI / UX / Onboarding

- **Écran-titre animé** (cosmique) ✅.
- **Menus custom** : Codex, Santé Mentale, Liens, Factions, Bestiaire, Journal,
  Corruption, Succès — à regrouper visuellement (sous-menu « Âme »).
- **HUD à venir** : Âmes & Corruption à l'écran (VariableHud + art dédié).
- **Onboarding** : tutoriel diégétique au Prologue ; chaque système présenté par
  un PNJ.
- **Accessibilité** : difficulté (Histoire/Normal/Cauchemar), vitesse de texte.

---

## 10. 🔊 Direction audio

- BGM par zone (château solennel, hub chaleureux, dimensions thématiques).
- **Musique dynamique** (objectif) : variation selon Santé Mentale / Corruption.
- Jingles : Feu d'Âme, montée de Lien, déblocage de fin.
- ⚠️ Garde-fou `AudioGuard` actif (ignore les SE au nom vide).

---

## 11. 🛠️ Feuille de route vers la complétion

### ✅ Fait
Systèmes de combat/âme · progression · social · monde vivant · boss principaux ·
lore (bible) · présentation MOG (titre/compas/météo/effets) · Journal · Factions.

### 🔨 En cours / prioritaire
- [ ] **Câbler la quête principale** (q_main_1→6) dans le Journal.
- [ ] **HUD Âmes/Corruption** à l'écran (art + VariableHud).
- [ ] **Méta-horreur Jada** (4e mur : menus, titre fenêtre, faux messages).
- [ ] **Système de fins** (moteur de score → épilogues + galerie).

### ⏳ À faire (complétion)
- [ ] **Prologue jouable** (intro + tutoriel diégétique).
- [ ] **4 dimensions** : level design + boss + récompenses.
- [ ] **Clé & Masque** : quêtes d'artefacts.
- [ ] **PNJ recruteurs de factions** placés dans le monde.
- [ ] **Quêtes secondaires** écrites (Muta, Régis, Elara, liens).
- [ ] **Équilibrage** de la courbe de difficulté (Acte I→Climax).
- [ ] **Carte du monde + voyage rapide** entre Feux d'Âme.
- [ ] **Écran-titre commandes** + **crédits** finalisés (assets).
- [ ] **Postgame** : superboss Originels, galerie des fins.
- [ ] **Passe de polish** : sons, transitions, sauvegarde/checkpoints clairs.

---

## 12. 🧭 Conventions de production
- **Un seul système nouveau introduit à la fois**, expliqué en contexte.
- **`plugins.js` géré par l'assistant** (source n°1 des conflits) ; le créateur
  ajoute des images/maps et indique quoi activer.
- **Activer un plugin = vérifier/créer ses assets d'abord** (zéro écran rouge).
- **Tout passe par des PR vérifiées** ; `AudioGuard` reste le dernier plugin.
