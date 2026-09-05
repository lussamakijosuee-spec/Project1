# ⚔️🔮👤 LES DONS SPIRITUELS — le dossier complet

> **Ce fichier est le relevé exhaustif.** Tout ce qui existe déjà dans le jeu à propos du Don Spirituel
> et des Traits : le canon, les 16 armes, les 4 reliques d'âme, les compétences, les états, les
> animations, les trois plugins, leurs paramètres, leurs commandes et leur API — plus la liste
> honnête de ce qui est **écrit mais pas encore codé**, et des **incohérences relevées en base**.
>
> Canon de référence : [`../SYSTEME_DE_MANA.md`](../SYSTEME_DE_MANA.md) §6 et §6-bis.
> Code : `js/plugins/DonsSpirituels.js`, `js/plugins/TraitsAme.js`, `js/plugins/ObjetSpirituel.js`.

---

## 0. En dix lignes

Le **Don Spirituel** est la manifestation physique de l'âme **en surface**. Il n'est pas remis : il
**apparaît de lui-même**, à la **première fois** qu'un marqué se sert vraiment de son âme.

| | Forme | Population | Ce que ça donne |
|---|---|---|---|
| ⚔️ | **L'ARME** | **80 %** | Rien de plus qu'une arme. Sa seule vertu : **résister**. |
| 🔮 | **L'OBJET** | **18 %** | N'importe quelle forme (même celle d'une arme) — mais **un effet ou un talent**, et **une seconde jauge** qui se paie cher. |
| 👤 | **LE FAMILIER** | **2 %** | Une **créature née de l'âme**. Peut **porter un Trait** : son porteur en a alors **deux**. |

Les trois formes partagent une **jauge d'Endurance**. Elle s'use à l'usage, se répare au repos.
**Un Don ne se perd jamais** : à zéro il **casse**, mais il reste utilisable — **tout ce qu'il
apporte est simplement divisé par deux** (dégâts, effets, bénéfices).

**Plus le porteur est puissant, plus le Don résiste** : l'Endurance maximale monte avec le niveau
et avec le palier de l'objet.

---

## 1. Les quatre marqués — leur Don, leur Trait

| Acteur | Nom | Don | Forme | Trait(s) | Sécurité : pourquoi ce Don-là |
|---|---|---|---|---|---|
| **1** | **Vesper** | **le Masque** | 🔮 Objet | **LE SANG** | Son sang la blesserait. Le Masque la laisse le manier **sans se blesser**. |
| **2** | **Korrah** | **l'Armure Volante** | 👤 Familier | **CHANGE** *(de base)* + **HIVER** *(via le familier)* | Un familier de combat rapproché pour une âme qui **échange les places**. |
| **3** | **ludwing** | **l'Amulette** | 🔮 Objet | **L'ABSORPTION DES ÂMES** | L'amulette **boit les ombres** — c'est elle, pas son Trait, qui lui donne l'air d'en avoir deux. |
| **4** | **Aël** | **l'Arc et ses Flèches** | ⚔️ Arme | **MIRACLE** | Miracle **se matérialise en flèches**. Il ne lui faut rien de plus qu'un arc qui ne cède pas. |

> ⚖️ **La règle d'or.** Le porteur est affecté **par son propre Trait**. Le froid d'Hiver gèle Korrah.
> Le sang de Vesper est *son* sang. C'est pour cela que le Don arrive presque toujours **comme une
> sécurité adaptée au Trait** — un Trait de feu appelle une arme de distance. La puissance et la
> protection viennent du même endroit : **il faut bien jouer.**

### 1.1 · 🩸 VESPER — LE MASQUE *(objet)*

Il lui permet d'utiliser son sang **comme elle l'entend, sans se blesser** — son sang se régénère, et
son style de combat *Sang* est appris par-dessus.

- **Tant qu'il tient** : aucune blessure, régénération pleine.
- **Brisé** : chaque attaque de sang lui coûte **8 % de ses PV max** (`sangCoutPct`), et sa
  **régénération tombe de moitié** (`maluxCasse`).

### 1.2 · ❄️ KORRAH — L'ARMURE VOLANTE *(familier)*

Une **armure volante** : des **poings** et un **torse** qui flottent sans corps.

- Il **débloque le Trait HIVER** — elle manipule la glace **sans passer par une formule**.
- ⚠️ **Elle en subit les effets aussi** : **15 % des dégâts en retour** (`hiverRecul`). Le froid ne
  fait pas de distinction.
- **Bonus passif** tant que le familier est entier : **+10 % ATK / DÉF / AGI** (`familierBonus`).
- C'est **elle** qui possède le Trait, même si c'est le familier qui l'a débloqué.

### 1.3 · ⬛ LUDWING — L'AMULETTE *(objet)*

Elle lui permet d'**absorber les ombres** et de **mieux les manier**. C'est elle qui donne
l'impression qu'il possède **deux Traits alors qu'il n'en a qu'un** : son Trait est **l'absorption
des âmes**, l'**ombre vient de l'amulette**.

- **Jauge d'Ombre** : `100` de capacité, `+12` par technique d'ombre employée.
- **Pleine → elle EXPLOSE** : capacités d'ombre **scellées 4 tours** (types de compétence 11–18),
  et l'**absorption d'âmes tombe de moitié** pendant ce temps.
- Le compteur repart de zéro ; l'amulette se recompose au bout des 4 tours.

### 1.4 · ✦ AËL — L'ARC ET SES FLÈCHES *(arme)*

Le cas ordinaire — celui des 80 %. **Aucun effet, aucun talent.** Une arme, et c'est tout. Sa seule
vertu est de **résister**.

C'est peu, et c'est déjà énorme : une arme qui ne se brise pas au premier choc, qui grandit avec toi
et qu'on ne peut pas te voler.

---

## 2. LES TRAITS — le don de naissance

Le Trait est **rare** : il faut une **certaine puissance**, une **volonté forte**, une **âme
puissante**. La plupart des gens n'en ont aucun. C'est la **Marque** qui l'active — une **Marque
creuse** ne répond plus.

| Clé | Trait | Porteur | Effet mécanique exact |
|---|---|---|---|
| `sang` | **LE SANG** | Vesper (1) | Ses frappes **ne ratent jamais** (`itemHit = 1`) et lui **rendent 25 % des dégâts** infligés. |
| `change` | **CHANGE** | Korrah (2) | Visée sur un allié : elle **prend sa place** dans l'ordre du groupe **et lui reprend ses états négatifs**. Elle prend sa place, fardeau compris. |
| `hiver` | **HIVER** | Korrah (2) | L'attaque **devient de l'élément GLACE** quelle que soit la formule — et Korrah **encaisse 15 %** des dégâts en retour. |
| `ames` | **L'ABSORPTION DES ÂMES** | ludwing (3) | **+2 âmes** (variable 15) et **+10 % de ses PM max** par frappe, plus l'état **`l'Envers` (204)**. Divisé par deux si l'amulette a explosé. |
| `miracle` | **MIRACLE** | Aël (4) | Voir ci-dessous. |

### 2.1 · Le Miracle d'Aël — comment il fonctionne

Face à un ennemi, elle finit par **développer d'elle-même la technique capable de le toucher**, même
si elle **ne connaît pas le sort**. Ce qu'elle développe **se matérialise en flèches** — d'où les
**Flèches Miracle**.

Deux contraintes, et elles sont dures :

| | Règle | Valeur |
|---|---|---|
| **C'est lent** | Il faut un tour économe pour progresser | `+20` de progression / tour |
| **Il faut économiser le mana** | Un tour où elle dépense **plus de 20 PM** fait retomber la jauge | `−25` de progression |
| **À 100** | Sa prochaine frappe de Trait **touche par la faiblesse de la cible** (le meilleur taux élémentaire de l'ennemi), et **ne rate pas** | puis retour à `0` |

> *Exemple canon : contre un ennemi faible au **mana positif** — en particulier au **Crépuscule** —
> elle développera au fil du combat de quoi l'atteindre, même sans connaître le sort.*
> *(L'élément **Crépuscule** existe en base : ID **29**.)*

### 2.2 · Le prix — commun à tous les Traits

À **chaque usage** d'une compétence notée `<Trait: …>` :

| Prix | Marque légitime | Marque étrangère |
|---|---|---|
| PM max drainés | **20 %** | **40 %** (×2) |
| TP drainés | **20** | **40** (×2) |
| Errance gagnée | **+2** | **+6** |
| Bonus du Trait | oui | **aucun** — « le Trait déchire le porteur » |

**Marque CREUSE → le Trait ne répond plus du tout** (la compétence devient impayable).

### 2.3 · Anciennes clés — reprises, pas abandonnées

Les compétences déjà notées avec l'ancienne clé continuent de fonctionner : chaque ancienne clé
pointe vers le Trait **nouveau du même personnage**.

| Ancienne clé | → Trait actuel | Personnage |
|---|---|---|
| `rupture` | `sang` | Vesper |
| `gel` | `hiver` | Korrah |
| `porte` | `ames` | ludwing |
| `verbe` | `miracle` | Aël |

---

# 📦 TOUT CE QUI EXISTE DÉJÀ EN BASE

## 3. Les 16 armes spirituelles — IDs **501 → 516**

Chaque héros a **une chaîne de 4 paliers**. L'arme est remplacée automatiquement à la montée de
niveau (`ObjetSpirituel.js`), Mana d'attaque conservé.

**Paliers :** `1 · ÉCLAT` (niv. 1) → `2 · FORME` (niv. **15**) → `3 · RÉSONANCE` (niv. **35**) →
`4 · VÉRITÉ` (niv. **60**).

**Notetags portés par les 16 armes :** `<Objet Spirituel: nom>` et `<Palier: 1-4>`.
*(Le nom du tag est l'**ancien** nom du personnage — voir §12.)*

### 3.1 · 🩸 Vesper — le Masque · type d'arme **15 (SANG)** · tag `<Objet Spirituel: thylane>`

| ID | Nom | Palier | HP | MP | ATK | DÉF | MAT | MDF | AGI | CHA | Anim. | Élément d'attaque |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **501** | Éclat de Sang | 1 · Éclat | 0 | 0 | 10 | 0 | 0 | 0 | 3 | 0 | 361 *Éclat* | 4 · mana négative |
| **502** | Masque Naissant | 2 · Forme | 0 | 0 | 15 | 5 | 0 | 0 | 6 | 0 | 361 *Éclat* | 4 · mana négative |
| **503** | Masque Résonant | 3 · Résonance | 0 | 0 | 25 | 10 | 0 | 0 | 10 | 2 | 367 *Onde de choc · Rose* | 4 · mana négative |
| **504** | Vérité du Masque | 4 · Vérité | 30 | 0 | 40 | 22 | 38 | 31 | 16 | 16 | 364 *Éclat · Or* | 4 · mana négative **+ 8 · FEU** |

### 3.2 · ❄️ Korrah — l'Armure Volante · type d'arme **11 (Gant)** · tag `<Objet Spirituel: neyssa>`

| ID | Nom | Palier | HP | MP | ATK | DÉF | MAT | MDF | AGI | CHA | Anim. | Élément d'attaque |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **505** | Éclat Lucide | 1 · Éclat | 0 | 0 | 7 | 4 | 8 | 8 | 0 | 0 | 361 *Éclat* | 3 · mana positive |
| **506** | Poings Naissants | 2 · Forme | 0 | 5 | 14 | 10 | 18 | 20 | 0 | 2 | 361 *Éclat* | 3 · mana positive |
| **507** | Armure Résonante | 3 · Résonance | 0 | 10 | 23 | 18 | 24 | 30 | 5 | 4 | 363 *Éclat · Rose* | 3 · mana positive |
| **508** | Vérité de l'Armure Volante | 4 · Vérité | 0 | 20 | 35 | 45 | 14 | 32 | 0 | 8 | 364 *Éclat · Or* | 3 · mana positive **+ 13 · GLACE** |

### 3.3 · ⬛ ludwing — l'Amulette · type d'arme **14 (OMBRE)** · tag `<Objet Spirituel: lou>`

| ID | Nom | Palier | HP | MP | ATK | DÉF | MAT | MDF | AGI | CHA | Anim. | Élément d'attaque |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **509** | Éclat des Âmes | 1 · Éclat | 0 | 0 | 13 | 0 | 10 | 0 | 0 | 2 | 361 *Éclat* | 2 · mana spirituelle |
| **510** | Amulette Naissante | 2 · Forme | 10 | 5 | 30 | 6 | 24 | 8 | 4 | 6 | 361 *Éclat* | 2 · mana spirituelle |
| **511** | Amulette Résonante | 3 · Résonance | 20 | 10 | 28 | 12 | 31 | 18 | 8 | 10 | 363 *Éclat · Rose* | 2 · mana spirituelle |
| **512** | Vérité de l'Amulette | 4 · Vérité | 14 | −9 | 33 | 27 | 33 | 9 | 41 | 45 | 364 *Éclat · Or* | 2 · mana spirituelle **+ 15 · OMBRE** |

### 3.4 · ✦ Aël — l'Arc et ses Flèches · type d'arme **7 (Arc)** · tag `<Objet Spirituel: tianna>`

| ID | Nom | Palier | HP | MP | ATK | DÉF | MAT | MDF | AGI | CHA | Anim. | Élément d'attaque |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **513** | Éclat Stellaire | 1 · Éclat | 0 | 5 | 10 | 0 | 14 | 8 | 4 | 2 | 361 *Éclat* | 3 · mana positive |
| **514** | Arc Naissant | 2 · Forme | 0 | 15 | 14 | 4 | 30 | 16 | 8 | 4 | 361 *Éclat* | 3 · mana positive |
| **515** | Arc Résonant | 3 · Résonance | 0 | 30 | 19 | 8 | 56 | 30 | 12 | 8 | 363 *Éclat · Rose* | 3 · mana positive |
| **516** | Vérité de l'Arc | 4 · Vérité | 0 | 60 | 25 | 14 | 45 | 52 | 16 | 18 | 364 *Éclat · Or* | 3 · mana positive **+ 14 · LUMIÈRE** |

> 🎨 **Convention d'animation des paliers** : `1-2 → 361 Éclat` · `3 → 363 Éclat · Rose`
> (Vesper : `367 Onde de choc · Rose`) · `4 → 364 Éclat · Or`.
> L'**animation d'évolution** entre deux paliers est la **51 · Augmenter la puissance 1**, son
> **`Saint5`** (paramètres `evoAnim` / `evoSE` d'`ObjetSpirituel`).

---

## 4. Les 4 Dons en **équipement d'Âme** — armures **68 → 71**

Slot d'équipement **7 · « Ame »** · type d'armure **7** · notetag **`<DonSpirituel>`**.
Statistiques identiques pour les quatre : **DÉF +10, MDF +10, CHA +5**.

| ID | Nom | Porteur | Description en base |
|---|---|---|---|
| **68** | **le Masque** | Vesper | *Le Don de Vesper. Tant qu'il tient, elle use de son sang sans se blesser.* |
| **69** | **l'Armure Volante** | Korrah | *Le Don de Korrah : des poings et un torse qui flottent sans corps. Il porte le Trait Hiver.* |
| **70** | **l'Amulette** | ludwing | *Le Don de Ludwing. Elle boit les ombres — et explose si on en abuse.* |
| **71** | **le Carquois d'Étoiles** | Aël | *Le Don d'Aël. Rien de plus qu'un carquois : c'est déjà tout ce qu'il faut à Miracle.* |

**Le reste du slot d'Âme** (générique, 7 paliers) : **Reliques d'Âme** `40` Cuir → `41` Fer →
`42` Acier → `43` Mithril → `44` Cristal → `45` Runique → `46` Légendaire.
**Slot talisman (6)** : **Talismans** `33` → `39`, mêmes 7 paliers.

---

## 5. Les compétences

### 5.1 · Les compétences de **Trait** — notetag `<Trait: …>`

Ce sont **elles** qui déclenchent le prix et les effets de `TraitsAme.js`.

| ID | Nom | `<Trait:>` | Type | Anim. | Élément | PM | TP |
|---|---|---|---|---|---|---|---|
| **465** | Cercle Écarlate | `sang` | sang | 415 *Cercle de runes · Rose* | mana spirituelle | 24 | 0 |
| **438** | Change | `change` | ult | — | (aucun) | 20 | 20 |
| **97** | Valse des Positions | `change` | ult | 404 *Vortex · Or* | mana positive | 10 | 0 |
| **24** | le Monde Gelé | `gel` → hiver | ult | 232 *Glace · Cataclysme* | GLACE | 100 | 50 |
| **89** | Armure de Givre | `gel` → hiver | ult | 312 *Givre · Bénédiction* | GLACE | 12 | 0 |
| **90** | Instant Gelé | `gel` → hiver | Spéciale | 223 *Glace · Impact* | GLACE | 12 | 0 |
| **91** | Zéro Absolu | `gel` → hiver | capacité | 231 *Glace · Explosion* | GLACE | 12 | 0 |
| **468** | Dette d'Âme | `ames` | ame | 458 *Mains de l'ombre · Violet* | mana spirituelle | 18 | 0 |
| **69** | Porte de l'Envers | `porte` → ames | Spéciale | 253 *Ombre · Projection* | OMBRE | 12 | 0 |
| **110** | Abri de l'Envers | `porte` → ames | Spéciale | 260 *Ombre · Bénédiction* | AME | 12 | 0 |
| **101** | « Viens. » — l'Attraction | `verbe` → miracle | Spéciale | 333 *Crépuscule · Parole I* | mana positive | 27 | 20 |
| **102** | « Pars. » — la Répulsion | `verbe` → miracle | Spéciale | 334 *Crépuscule · Parole II* | mana positive | 15 | 20 |
| **11** | Éclat Noir | `rupture` → sang | ult | 64 *Paralyser* | Mana Sombre | 15 | 20 |
| **130** | Éclat Noir Concentré | `rupture` → sang | Arts Sereins | 64 *Paralyser* | Mana Originel | 15 | 20 |

### 5.2 · 🩸 Les techniques de **SANG** — type de compétence **10**

Reconnues par `DonsSpirituels` (type 10 **ou** notetag `<Sang>`). Ce sont elles qui coûtent des PV
quand le Masque est brisé.

| ID | Nom | Anim. | Élément | Formule | PM |
|---|---|---|---|---|---|
| **463** | Saignée | 423 *Griffes · Rose* | Physique | `a.atk * 2.5 - b.def` | 8 |
| **464** | Fouet de Sang | 379 *Pluie perçante · Rose* | mana spirituelle | `a.atk * 3 - b.def * 1.5` | 14 |
| **465** | Cercle Écarlate | 415 *Cercle de runes · Rose* | mana spirituelle | `(a.atk + a.mat) * 2 - b.def` | 24 |

**Autres compétences notées `<Sang>`** (hors type 10, reconnues quand même) :
`53` Lame de Sang · `55` Pluie de Flèches Sanglantes · `56` Paon Hémorragique · `57` Frappe Écarlate ·
`58` Rafale de Coups Écarlates · `59` Dragon de la Nuit Sanglante · `113` Armure de Sang ·
`138` Disque Sanglant · `146` Sang pour Sang · `434` Fleur Écarlate · `826` ◈ Rune de Saignée.

### 5.3 · 👁 Les techniques d'**ÂME** — type de compétence **9**

| ID | Nom | Anim. | Élément | Formule | PM | Appris |
|---|---|---|---|---|---|---|
| **466** | Aspiration d'Âme | 434 *Drain de vie · Violet* | mana spirituelle | `a.mat * 2.5 - b.mdf` | 12 | niv. 1 |
| **467** | Chaîne d'Âmes | 450 *Volutes d'âme · Violet* | mana spirituelle | `a.mat * 2 - b.mdf` | 22 | niv. 10 |
| **468** | Dette d'Âme | 458 *Mains de l'ombre · Violet* | mana spirituelle | `a.mat * 3.5 - b.mdf * 1.5` | 18 | niv. 22 |

### 5.4 · ⬛ Les techniques d'**OMBRE** — types de compétence **11 à 18**

**Ce sont elles qui remplissent la jauge d'Ombre de l'amulette (+12 chacune), et ce sont
exactement celles qui sont scellées 4 tours quand elle explose.**

| Type | Nom du type | ID | Compétence | Anim. | Élément | Formule | PM/TP |
|---|---|---|---|---|---|---|---|
| 11 | ombre d'épée | **115** | Frappe Aveuglante | *animation de l'arme* | LUMIÈRE | `a.atk * 3 - b.def * 2` | 10 / 0 |
| 12 | ombre de dague | **116** | Rafale d'Ombre | 17 *Griffer Effet* | OMBRE | `a.atk * 1.5 - b.def` | 10 / 0 |
| 13 | ombre de hache | **118** | Fendoir Obscur | 250 *Ombre · Lame* | OMBRE | `a.atk * 3.5 - b.def * 2` | 22 / 20 |
| 14 | ombre de katana | **122** | Danse Macabre | 7 *Trancher Effet* | mana spirituelle | `a.atk * 2.5 - b.def` | 15 / 0 |
| 15 | ombre de lance | **121** | Geyser Abyssal | 84 *Eau Tous 2* | OMBRE | `(a.atk + a.mat) * 2.5 - b.def * 2` | 22 / 20 |
| 16 | ombre de griffe | **120** | Déchirure d'Âme | 252 *Ombre · Griffe* | mana spirituelle | `a.atk * 3 - b.def * 1.5` | 15 / 0 |
| 17 | ombre de arc | **117** | Tir d'Ombre | 29 *Flèche Spéciale* | OMBRE | `a.atk * 2.5` | 10 / 0 |
| 18 | ombre de arme à feu | **119** | Balle Corrompue | 253 *Ombre · Projection* | Mana Sombre | `a.atk * 4 - b.def * 2` | 15 / 0 |

**Les deux ouvreuses** (type *capacité*, notées `<Ombre>`) : **111** Arme d'Ombre · **112** Âme d'Ombre.
**Autres compétences notées `<Ombre>`** : `44` Lame de Mana Sombre · `66` Lotus des Ténèbres ·
`67` Pluie de Lances d'Ombre · `68` Annihilation des Ténèbres · `159` Voile d'Ombre · `164` Abysse ·
`187` Griffe d'Ombre · `188` Voile de Ténèbres · `195` Abysse Sombre · `196` Souffle Corrompu ·
`210` Focalisation Sombre.

### 5.5 · Les **Ultimes** des quatre marqués *(contre-coup = état)*

| ID | Ultime | Porteur | Anim. | Prix PV | État de contre-coup |
|---|---|---|---|---|---|
| **445** | Tranche-Néant | Aël | 22 | 25 % | **190** Épuisement de l'Âme |
| **446** | Jugement de Soi | Aël | 35 | 33 % | **190** Épuisement de l'Âme |
| **449** | Instant Absolu | Korrah | 178 | 15 % | **191** Brûlure Mentale |
| **450** | Point Zéro | Korrah | 40 | 25 % | **191** Brûlure Mentale |
| **453** | Dévoreur d'Âmes | ludwing | 66 | 30 % | **192** Folie du Joueur |
| **454** | Tout ou Rien | ludwing | 84 | 35 % | **192** Folie du Joueur |
| **457** | Éclat de Conviction | Vesper | 31 | 20 % | **193** Doute Paralysant |
| **458** | Certitude Absolue | Vesper | 31 | 28 % | **193** Doute Paralysant |

---

## 6. Les états liés

| ID | Nom | Rôle |
|---|---|---|
| **204** | **l'Envers ◈ Trait de ludwing** | Accordé à chaque usage du Trait `ames`. Priorité 96, icône 71, `<StateFX>` couleur `#2a2a3e`. Effet : **+50 % PM max**. |
| **190** | Épuisement de l'Âme | Contre-coup d'ultime (Aël) : ATK ×0.6, AGI ×0.75. |
| **191** | Brûlure Mentale | Contre-coup d'ultime (Korrah) : MAT ×0.6, MDF ×0.85. |
| **192** | Folie du Joueur | Contre-coup d'ultime (ludwing) : CHA ×0.5, DÉF ×0.85. |
| **193** | Doute Paralysant | Contre-coup d'ultime (Vesper) : MAT ×0.7, DÉF ×0.8. |
| **147** | Lien Spirituel | +6 % TGR/GRD (compétence 386). |

**Les états passifs de mental** (via `YEP_AutoPassiveStates`, notetag `<Passive State: …>` sur
l'acteur) — chacun conditionné à la jauge mentale du personnage :

| Acteur | Variable mentale | États passifs |
|---|---|---|
| **1 · Vesper** | **11** *maitrise de soi* | 61 · 10 · 30 · 31 · 28 · 29 |
| **2 · Korrah** | **12** *concentration* | 22 · 23 · 24 · 25 · 62 |
| **3 · ludwing** | **13** *LOU* | 34 · 35 · 36 · 37 |
| **4 · Aël** | **14** *tianaa* | 40 · 41 · 42 · 43 · 63 |

---

## 7. Les objets liés

| ID | Objet | Description |
|---|---|---|
| **80** | **Éclat d'Âme** | *Fragment d'une âme retournée au code. Matériau de forge.* |
| **85** | **Fil de Crépuscule** | *Ni jour ni nuit — la matière dont **Miracle** fait ses flèches.* |
| **78** | **Larme d'Âme** | *Rend une âme à elle-même : ranime un allié tombé.* |
| **42** | Poudre Spectrale | Onde spirituelle sur tous les ennemis. |

---

## 8. Les animations récupérables

### 8.1 · L'atlas **361 → 460** — 25 familles × 4 couleurs

Chaque famille existe en **4 teintes** dans cet ordre : **base · Violet · Rose · Or**.
*(base = `n`, Violet = `n+1`, Rose = `n+2`, Or = `n+3`.)*

| Famille | base | Violet | Rose | Or |
|---|---|---|---|---|
| Éclat | 361 | 362 | 363 | 364 |
| Onde de choc | 365 | 366 | 367 | 368 |
| Lames triples | 369 | 370 | 371 | 372 |
| Pilier | 373 | 374 | 375 | 376 |
| Pluie perçante | 377 | 378 | 379 | 380 |
| Foudre | 381 | 382 | 383 | 384 |
| Cristal | 385 | 386 | 387 | 388 |
| Pétales | 389 | 390 | 391 | 392 |
| Bulles | 393 | 394 | 395 | 396 |
| Braises | 397 | 398 | 399 | 400 |
| Vortex | 401 | 402 | 403 | 404 |
| Concentration | 405 | 406 | 407 | 408 |
| Croix de lumière | 409 | 410 | 411 | 412 |
| Cercle de runes | 413 | 414 | 415 | 416 |
| L'Œil | 417 | 418 | 419 | 420 |
| Griffes | 421 | 422 | 423 | 424 |
| Grande vague | 425 | 426 | 427 | 428 |
| Éclats brisés | 429 | 430 | 431 | 432 |
| Drain de vie | 433 | 434 | 435 | 436 |
| Dôme gardien | 437 | 438 | 439 | 440 |
| Rayon | 441 | 442 | 443 | 444 |
| Étoiles noires | 445 | 446 | 447 | 448 |
| Volutes d'âme | 449 | 450 | 451 | 452 |
| Corruption | 453 | 454 | 455 | 456 |
| Mains de l'ombre | 457 | 458 | 459 | 460 |

> **La grammaire de couleur en usage** : **Rose** = Vesper / le sang · **Violet** = ludwing / l'âme
> et l'ombre · **Or** = le palier *Vérité* et les Traits de Korrah · **base** = neutre / palier bas.

### 8.2 · Animations « signature » déjà branchées sur le système

| ID | Nom | Où |
|---|---|---|
| **361** | Éclat | armes paliers 1 et 2 (les 16) |
| **363** | Éclat · Rose | armes palier 3 (Korrah, ludwing, Aël) |
| **367** | Onde de choc · Rose | arme palier 3 (Vesper) |
| **364** | Éclat · Or | armes palier 4 · *Vérité* (les 4) |
| **51** | Augmenter la puissance 1 | **évolution de palier** (`evoAnim`), SE `Saint5` |
| **429** | Éclats brisés | compétence 462 *Attaque* — **la casse**, animation toute trouvée pour un Don brisé |
| **423** | Griffes · Rose | Saignée |
| **379** | Pluie perçante · Rose | Fouet de Sang |
| **415** | Cercle de runes · Rose | Cercle Écarlate |
| **434** | Drain de vie · Violet | Aspiration d'Âme |
| **450** | Volutes d'âme · Violet | Chaîne d'Âmes |
| **458** | Mains de l'ombre · Violet | Dette d'Âme |
| **250 / 252 / 253 / 260** | Ombre · Lame / Griffe / Projection / Bénédiction | techniques d'ombre |
| **223 / 231 / 232 / 312** | Glace · Impact / Explosion / Cataclysme, Givre · Bénédiction | Trait Hiver |
| **333 / 334** | Crépuscule · Parole I & II | Trait Miracle *(le Crépuscule, élément 29)* |
| **404** | Vortex · Or | Trait Change |
| **64** | Paralyser | Éclat Noir |

---

## 9. Les types & éléments de référence (`System.json`)

**Types de compétence** — `1` capacité · `2` Spéciale · `3` ult · `4` JACKPOT · `5` BERSEK ·
`6` TIME · `7` MANA semi-parfait · `8` invocation · **`9` ame** · **`10` sang** ·
**`11-18` ombre d'épée / dague / hache / katana / lance / griffe / arc / arme à feu** · `19` Arts Sereins.

**Types d'arme** — `1` Dague · `2` Épée · `3` arme à feu · `4` Hache · `5` fouet · `6` Canne ·
**`7` Arc** *(Aël)* · `8` Arbalète · `9` fusil · `10` Griffe · **`11` Gant** *(Korrah)* · `12` Lance ·
`13` pompe · **`14` OMBRE** *(ludwing)* · **`15` SANG** *(Vesper)* · `16` éclat *(libre — inutilisé)*.

**Slots d'équipement** — `1` Arme · `2` Bouclier · `3` Tête · `4` Corps · `5` Accessoire ·
`6` talisement · **`7` Ame** *(les Dons 68-71)*.

**Éléments** — `1` Physique · **`2` mana spirituelle** · `3` mana positive · `4` mana négative ·
`5` Mana Sombre · `6` Mana Originel · `7` AME · `8` FEU · `9` EAU · `10` VENT · `11` TERRE ·
`12` FOUDRE · **`13` GLACE** *(Hiver)* · `14` LUMIÈRE · **`15` OMBRE** *(l'amulette)* ·
`16` mana semi parfait · `17` Vapeur · `19` Lave · `20` Plante · `22` Givre · `23` Métal ·
**`29` Crépuscule** *(la faiblesse que Miracle apprend à toucher)*.

---

# 🔧 LE CODE

## 10. Les trois plugins

### 10.1 · `DonsSpirituels.js` — l'Endurance et les trois formes

**Ordre de chargement : #160**, après `ObjetSpirituel` (#34), `Errance` (#128) et `MarqueVivante` (#133).

| Paramètre | Défaut | Ce que ça fait |
|---|---|---|
| `usureParUsage` | **1** | Endurance perdue par action offensive employant le Don. |
| `endurBase` | **40** | Base de la jauge. |
| `endurParNiveau` | **2** | *« Plus tu es puissant, plus ton Don résiste »* — gain par niveau. |
| `endurParPalier` | **20** | Gain par palier de l'Objet : un **Éclat** casse vite, une **Vérité** presque jamais. |
| `maluxCasse` | **0.50** | Don brisé : **tout ce qu'il apporte ÷ 2**. |
| `ombreMax` | **100** | Capacité de la jauge d'Ombre de l'amulette. |
| `ombreParUsage` | **12** | Ombre gagnée par technique d'ombre. |
| `ombreBlocage` | **4** | Tours de blocage après l'explosion. |
| `sangCoutPct` | **8** | Masque brisé : % des PV max payés par attaque de sang. |
| `familierBonus` | **10** | Familier entier : bonus passif % (ATK/DÉF/AGI). |

**Formule d'Endurance maximale :**

```
Endurance max = endurBase + (niveau × endurParNiveau) + (palier − 1) × endurParPalier
             =     40     + (niveau ×        2      ) + (palier − 1) ×       20
```

*Exemple — Aël niveau 60, palier 4 (Vérité) :* `40 + 120 + 60 = **220**`.
*Exemple — Aël niveau 1, palier 1 (Éclat) :* `40 + 2 + 0 = **42**`.

**Commandes de plugin**

| Commande | Effet |
|---|---|
| `DON reparer` | Répare les Dons de **tout le groupe**. |
| `DON reparer 3` | Répare celui de l'acteur 3. |
| `DON casser 3` | **Brise** celui de l'acteur 3 (pour le scénario). |
| `DON afficher` | Ouvre l'écran de lecture des Dons du groupe (`Scene_Dons`). |

**API script**

```js
window.Dons.de(actorId)          // {type, typeNom, nom, arme, palier, endurance, max, casse}
window.Dons.estCasse(actorId)    // true / false
window.Dons.ombre(3)             // jauge d'Ombre de ludwing (0-100)
window.Dons.ombreBloquee(3)      // true si l'amulette a explosé et n'est pas revenue
window.Dons.reparer(actorId)
window.Dons.casser(actorId)
window.Dons.facteur(actorId)     // 1 si entier, 0.50 si brisé — à multiplier partout
```

**Ce que le plugin accroche** *(pour savoir où intervenir)*

| Hook | Rôle |
|---|---|
| `Game_Action.apply` | usure, apparition du Don, jauge d'Ombre, prix du sang |
| `Game_Action.makeDamageValue` | Don brisé → dégâts ÷ 2 |
| `Game_BattlerBase.isSkillTypeSealed` | amulette explosée → types 11-18 scellés |
| `Game_Battler.onTurnEnd` | décompte des tours de blocage |
| `Game_Battler.regenerateHp` | Masque brisé → régénération ÷ 2 |
| `Game_Battler.paramRate` | Familier entier → +10 % ATK/DÉF/AGI |
| `Game_Actor.recoverAll` | **le repos répare** (auberge, soin complet) |

**Le registre en dur** *(à éditer pour ajouter un porteur)* :

```js
var DONS = {
    1: { type: 'objet',    nom: 'le Masque',            effet: 'sang'  },
    2: { type: 'familier', nom: "l'Armure Volante",     effet: 'hiver' },
    3: { type: 'objet',    nom: "l'Amulette",           effet: 'ombre' },
    4: { type: 'arme',     nom: "l'Arc et ses Flèches", effet: ''      }
};
```

### 10.2 · `TraitsAme.js` — les Traits

**Ordre de chargement : #161**, juste après `DonsSpirituels`.

| Paramètre | Défaut | Ce que ça fait |
|---|---|---|
| `drainPM` | **20** | % des PM max drainés par usage d'un Trait. |
| `drainTP` | **20** | TP drainés par usage. |
| `errancePar` | **2** | Errance gagnée par usage (forcer la marque use l'âme). |
| `erranceForce` | **6** | Errance si la marque n'est pas la tienne. |
| `etatEnvers` | **204** | État bonus de l'Absorption des Âmes. |
| `sangDrain` | **25** | SANG : % des dégâts rendus à Vesper. |
| `hiverRecul` | **15** | HIVER : % des dégâts que Korrah subit en retour. |
| `hiverElement` | **13** | HIVER : élément forcé (13 = GLACE). |
| `amesGain` | **2** | ABSORPTION : âmes gagnées par usage. |
| `amesVar` | **15** | Variable « Âmes Damnées ». |
| `miracleSeuil` | **20** | MIRACLE : PM par tour à ne pas dépasser. |
| `miracleGain` | **20** | MIRACLE : progression par tour économe. |
| `miraclePerte` | **25** | MIRACLE : progression perdue par tour dépensier. |

**API script**

```js
window.Traits.de(actorId)              // {cle, nom, don}
window.Traits.tous(actorId)            // tous ses Traits (Korrah en a deux)
window.Traits.possede(actorId,'hiver') // true / false
window.Traits.infos('miracle')         // {actor, nom}
window.Traits.miracle(4)               // progression 0-100 d'Aël
```

**Interaction avec le Don** : `TraitsAme` lit `window.Dons.facteur(id)` — **un Don brisé divise
aussi par deux ce que rapporte le Trait**, et `window.Dons.ombreBloquee(3)` — **l'amulette explosée
réduit l'absorption d'âmes de moitié**.

### 10.3 · `ObjetSpirituel.js` — l'évolution en 4 paliers

**Ordre de chargement : #34** (avant les deux autres).

| Paramètre | Défaut |
|---|---|
| `lvForme` | **15** |
| `lvResonance` | **35** |
| `lvVerite` | **60** |
| `soulBonus` | **true** — l'arme gagne/perd ATK & MAT selon la santé mentale du porteur |
| `evoAnim` | **51** |
| `evoSE` | **Saint5** |

**Commande** : `OBJET check` — réévalue tous les héros (après un événement scénarisé).

### 10.4 · Les plugins voisins qui touchent au Don

| Plugin | # | Lien avec le Don |
|---|---|---|
| `ObjetEveille` | 183 | **L'arme parle** : répliques en combat selon la Chute, + l'**Ancre** (corruption ≥ 85 → l'arme crie ton nom, −20 de corruption, 1×/combat). Héros `1,2,3,4`, ou n'importe quelle arme notée `<Eveil>`. |
| `AuraPaliers` | 131 | L'aura visible du porteur, couleur lue sur `<Mana:>` / `<Mana2:>`, palier par niveau (<20 · <40 · <60 · 60+). |
| `Errance` | 128 | Reçoit l'Errance payée par chaque usage de Trait. |
| `MarqueVivante` | 133 | Fournit `window.Marque.etat(id)` — une **marque creuse** coupe les Traits. |
| `AmeSouls` | 36 | Le stock d'âmes (variable 15) qu'alimente l'Absorption. |
| `MaitriseVoies` | 158 | Les Voies de combat, dont `sang` — le style **appris** de Vesper, par-dessus son Trait. |

**Ordre à respecter** : `ObjetSpirituel` (34) → `Errance` (128) → `MarqueVivante` (133) →
**`DonsSpirituels` (160)** → **`TraitsAme` (161)** → `ObjetEveille` (183).

---

## 11. Recettes

### 11.1 · Donner un Don à un nouveau personnage

1. **Créer la chaîne d'armes** (4 entrées) avec, sur chacune :
   `<Objet Spirituel: cle>` et `<Palier: 1>` … `<Palier: 4>`.
2. **Déclarer la chaîne** dans `ObjetSpirituel.js` → `CHAINS[actorId] = { ids:[…], names:[…] }`.
3. **Déclarer le Don** dans `DonsSpirituels.js` → `DONS[actorId] = { type, nom, effet }`
   (`type` : `'arme' | 'objet' | 'familier'`).
4. *(Optionnel)* **Créer l'armure de slot Âme** avec `<DonSpirituel>` sur le modèle des 68-71.

### 11.2 · Donner un Trait

1. **Déclarer** dans `TraitsAme.js` → `TRAITS.macle = { actor: N, nom: '…', don: '…' }`.
2. **Noter les compétences** concernées : `<Trait: macle>`.
3. Coder l'effet dans le bloc `Game_Action.apply` de `TraitsAme.js`, en multipliant toujours par
   `facteurDon(id)` — **le Don brisé divise le Trait par deux, lui aussi**.
4. **Respecter la règle d'or** : le porteur doit **subir** son propre Trait, et son Don doit être la
   **sécurité** qui lui répond.

### 11.3 · Marquer une compétence pour l'usure

| Tu veux… | Notetag / condition |
|---|---|
| Qu'elle remplisse la jauge d'Ombre | type de compétence **11-18**, ou `<Ombre>` |
| Qu'elle coûte des PV si le Masque est brisé | type de compétence **10**, ou `<Sang>` |
| Qu'elle déclenche le prix et l'effet d'un Trait | `<Trait: sang\|change\|hiver\|ames\|miracle>` |
| Qu'elle use l'Endurance | rien à faire — **toute action de dégâts** du porteur l'use |

---

## 12. Table de correspondance — anciens noms

Les notetags en base portent encore les **anciens noms** des personnages. C'est **normal et
fonctionnel** (le code lit l'ID d'acteur, pas le nom), mais il faut le savoir en lisant la base.

| ID | Nom actuel | Ancien nom en base | Classe | Mana | Voie par défaut | Camp |
|---|---|---|---|---|---|---|
| **1** | **Vesper** | `thylane` | 1 · l'Équilibre | spirituelle + négatif | `sang` | ombre |
| **2** | **Korrah** | `neyssa` | 2 · la Maîtrise | négatif + positif | `flash` | lumière |
| **3** | **ludwing** | `lou` | 3 · le Symbole | spirituelle + positif | `source` | ombre |
| **4** | **Aël** | `tianna` | 4 · la Parole | positif | `miroir` | lumière |

Anciennes clés de Trait : `rupture → sang` · `gel → hiver` · `porte → ames` · `verbe → miracle`.

---

## 13. Écrits mais **pas encore codés**

Ce qui est dans le canon et qu'aucun plugin ne fait aujourd'hui :

1. **Les 80 / 18 / 2 %.** Aucun tirage de population : les quatre marqués ont leur Don écrit en dur,
   et les PNJ/ennemis n'en ont pas. *Si tu veux un jour un PNJ avec un Don, il faut un tirage
   (80/18/2) au moment de sa création.*
2. **L'apparition à la première utilisation.** `faireApparaitre()` **existe et affiche le message**,
   mais rien n'empêche d'employer le Don avant : l'apparition est **narrative**, pas bloquante.
3. **Le Familier comme entité séparée.** L'Armure Volante est un **bonus passif** (+10 %), pas une
   créature qui agit. Un vrai familier au sens *stand* — qui frappe de son côté — reste à écrire.
4. **Un second Trait porté par le familier, hors Korrah.** Le mécanisme est en dur pour elle
   (`hiver` déclaré sur l'acteur 2) ; il n'y a pas de règle générique « ce familier débloque ce Trait ».
5. **La jauge propre à chaque Objet.** Seule l'**Ombre** de ludwing en a une. Le Masque de Vesper n'a
   **que** l'Endurance — sa punition arrive à la casse, pas au trop-plein.
6. **L'Endurance visible en combat.** Elle n'existe qu'à l'écran `DON afficher` ; aucune barre dans
   l'interface de combat.
7. **La réparation hors auberge.** Seuls `recoverAll` et `DON reparer` réparent. Pas d'objet
   consommable « répare le Don » *(le `80 · Éclat d'Âme` serait le matériau tout trouvé)*.

---

## 14. Incohérences relevées en base — à trancher

Aucune n'est bloquante ; toutes sont volontairement laissées **telles quelles** en attendant ton avis.

| # | Où | Le constat |
|---|---|---|
| 1 | **Armes 501-504** | Élément d'attaque **4 · mana négative**, et **8 · FEU** ajouté à la *Vérité du Masque*. Or Vesper est `<Mana: spirituelle>` / `<Mana2: negatif>` et son Don est **le sang**. Les trois autres chaînes ont un élément de *Vérité* cohérent (Korrah GLACE, ludwing OMBRE, Aël LUMIÈRE) — **FEU** détonne. Élément **2 · mana spirituelle** ou **1 · Physique** collerait mieux. |
| 2 | **Armes 505-508 / 513-516** | Korrah (`<Mana: negatif>`) attaque en **mana positive**, Aël (`<Mana: positif>`) aussi. Deux chaînes suivent le Mana **primaire** (ludwing, Aël), deux le **secondaire** (Vesper, Korrah). À uniformiser si tu veux une règle lisible. |
| 3 | **Arme 511** *(Amulette Résonante)* | **ATK 28** alors que la 510 est à **30** : le palier 3 **régresse** en attaque. |
| 4 | **Arme 512** *(Vérité de l'Amulette)* | **MP −9**. Volontaire (le prix de l'Envers) ou coquille ? C'est la seule *Vérité* avec un malus. |
| 5 | **Armure 71** | Le Don d'Aël s'appelle **« le Carquois d'Étoiles »** côté armure, mais **« l'Arc et ses Flèches »** côté plugin et codex. Deux noms pour un seul Don. |
| 6 | **États 28-31** | Leurs commentaires internes parlent d'« Aël » alors qu'ils sont branchés sur la **variable 11**, celle de **Vesper** (acteur 1). Texte hérité de l'ancien nommage — sans effet, mais trompeur. |
| 7 | **`docs/INDEX.md`** | Le rappel « Héros : 1 Aël · 2 Korrah · 3 ludwing · 4 Vesper » **inverse 1 et 4**. La base dit : **1 Vesper**, 4 Aël. *(corrigé)* |
| 8 | **Type d'arme 16 · « éclat »** | Déclaré dans `System.json`, **aucune arme ne l'utilise**. Slot libre — ou vestige. |

---

*Dernière compilation : lecture intégrale de `data/Weapons.json`, `Armors.json`, `Skills.json`,
`States.json`, `Items.json`, `Actors.json`, `Classes.json`, `Animations.json`, `System.json`,
`js/plugins.js` et des plugins `DonsSpirituels`, `TraitsAme`, `ObjetSpirituel`, `ObjetEveille`.*
