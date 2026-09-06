# ⚔️🔮👤 LES DONS SPIRITUELS — le dossier complet

> **Le relevé exhaustif.** Tout ce qui existe dans le jeu à propos du Don Spirituel et des Traits :
> le canon, les 16 armes, les 13 pièces d'équipement, les compétences, les états, les animations,
> les quatre plugins avec leurs réglages, leurs commandes et leur API — plus ce qui reste à écrire.
>
> Canon : [`../SYSTEME_DE_MANA.md`](../SYSTEME_DE_MANA.md) §6 et §6-bis.
> Code : `js/plugins/DonsSpirituels.js` · `TraitsAme.js` · `FamilierSpirituel.js` · `ObjetSpirituel.js`.

---

## 0. La règle, en une page

Le **Don Spirituel** est la manifestation physique de l'âme **en surface**. Il n'est pas remis : il
**apparaît de lui-même**, à la **première fois** qu'un marqué se sert vraiment de son âme.

### 🔑 Chaque forme a sa place sur le corps

| | Forme | Population | **Slot** | Ce qu'elle donne | Ce qu'elle coûte |
|---|---|---|---|---|---|
| ⚔️ | **L'ARME** | **80 %** | **Arme** | Rien de plus qu'une arme. Sa seule vertu : **résister**. | **Rien.** Accessoire et Âme restent **libres**. |
| 🔮 | **L'OBJET** | **18 %** | **Accessoire** | **Un effet ou un talent**, et une **seconde jauge**. | **Ton accessoire.** Tu ne portes rien d'autre. |
| 👤 | **LE FAMILIER** | **2 %** | **Âme** | Une **créature née de l'âme**, qui peut **porter un Trait** : son porteur en a alors **deux**. | **Ton slot d'Âme.** |

> C'est là tout l'équilibre du système. L'arme des 80 % n'a l'air de rien — mais elle est la seule
> à ne **rien** te prendre. Un Objet et un Familier sont plus forts, et **plus chers**.
> Un Don **non porté n'apporte plus rien du tout**, et un Familier absent **ferme le Trait
> qu'il débloquait**.

### L'Endurance — commune aux trois formes

```
Endurance max = 40 + (niveau × 2) + (palier − 1) × 20
```

Elle s'use à l'usage, se répare au repos. **Un Don ne se perd jamais** : à zéro il **casse**, mais il
reste utilisable — **tout ce qu'il apporte est divisé par deux** : les dégâts, **les statistiques de
la pièce**, le bonus de forme, et jusqu'au **Trait** qu'il sécurise.

**Plus le porteur est puissant, plus le Don résiste** : la jauge monte avec le niveau *et* avec le
palier. Un **Éclat** casse en un combat ; une **Vérité** presque jamais.

### La seconde jauge — le propre des OBJETS

Un Objet ne se contente pas de s'user : il **se gorge**. Chaque Objet a sa jauge, son carburant et sa
punition — et **en abuser coûte toujours plus cher que de laisser l'Endurance tomber**.

| Objet | Jauge | Carburant | Pleine → |
|---|---|---|---|
| 🩸 **le Masque** *(Vesper)* | **Sang** 0→100 | technique de sang **+10** | **le Masque SE FEND** : Endurance à zéro d'un coup, sans attendre l'usure. |
| ⬛ **l'Amulette** *(ludwing)* | **Ombre** 0→100 | technique d'ombre **+12** | **elle EXPLOSE** : capacités d'ombre scellées **4 tours**, absorption d'âmes **÷2** pendant ce temps. |

---

## 1. Les quatre marqués

| Acteur | Nom | Don | Forme → slot | Trait(s) | Sécurité : pourquoi ce Don-là |
|---|---|---|---|---|---|
| **1** | **Vesper** | **le Masque** | 🔮 Objet → **Accessoire** | **LE SANG** | Son sang la blesserait. Le Masque la laisse le manier **sans se blesser**. |
| **2** | **Korrah** | **l'Armure Volante** | 👤 Familier → **Âme** | **CHANGE** *(de base)* + **HIVER** *(débloqué par le familier)* | Un familier de corps-à-corps pour une âme qui **échange les places**. |
| **3** | **ludwing** | **l'Amulette** | 🔮 Objet → **Accessoire** | **L'ABSORPTION DES ÂMES** | L'amulette **boit les ombres** — c'est elle, pas son Trait, qui lui donne l'air d'en avoir deux. |
| **4** | **Aël** | **l'Arc et ses Flèches** | ⚔️ Arme → **Arme** | **MIRACLE** | Miracle **se matérialise en flèches**. Il ne lui faut rien de plus qu'un arc qui ne cède pas. |

> ⚖️ **La règle d'or.** Le porteur est affecté **par son propre Trait**. Le froid d'Hiver gèle Korrah.
> Le sang de Vesper est *son* sang. C'est pour cela que le Don arrive presque toujours **comme une
> sécurité adaptée au Trait** — un Trait de feu appelle une arme de distance. La puissance et la
> protection viennent du même endroit : **il faut bien jouer.**

### 1.1 · 🩸 VESPER — LE MASQUE *(objet · accessoire)*

Il lui permet d'utiliser son sang **comme elle l'entend, sans se blesser** — son sang se régénère, et
son style de combat *Sang* est appris par-dessus.

- **Tant qu'il tient** : aucune blessure, régénération pleine.
- **Jauge de Sang** : `+10` par technique de sang. **Pleine → le Masque se fend** (Endurance à zéro).
- **Fendu** : chaque attaque de sang lui coûte **8 % de ses PV max**, sa **régénération tombe de
  moitié**, et le Masque ne rend plus que la moitié de ses statistiques.

### 1.2 · ❄️ KORRAH — L'ARMURE VOLANTE *(familier · âme)*

Une **armure volante** : des **poings** et un **torse** qui flottent sans corps.
**Ce n'est pas un objet : c'est quelqu'un.** Il joue son propre tour — voir **§11**.

- Il **débloque le Trait HIVER** — la glace **sans passer par une formule**.
  **Familier retiré du slot Âme → HIVER ne répond plus du tout.**
- ⚠️ **Elle en subit les effets aussi** : **15 % des dégâts en retour**. Le froid ne fait pas de
  distinction — et **le familier ne lui donne aucune résistance à la glace**, volontairement.
- **Bonus passif** : **+10 % ATK / DÉF / AGI** tant qu'il est entier — **+5 %** s'il est brisé.
- C'est **elle** qui possède le Trait, même si c'est le familier qui l'a débloqué.

### 1.3 · ⬛ LUDWING — L'AMULETTE *(objet · accessoire)*

Elle lui permet d'**absorber les ombres** et de **mieux les manier**. C'est elle qui donne
l'impression qu'il possède **deux Traits alors qu'il n'en a qu'un** : son Trait est **l'absorption
des âmes**, l'**ombre vient de l'amulette**.

- **Jauge d'Ombre** : `+12` par technique d'ombre (types 11-18 ou note `<Ombre>`).
- **Pleine → elle EXPLOSE** : types de compétence **11 à 18 scellés 4 tours**, et l'**absorption
  d'âmes tombe de moitié** pendant ce temps. Puis l'amulette se recompose.

### 1.4 · ✦ AËL — L'ARC ET SES FLÈCHES *(arme · slot Arme)*

Le cas ordinaire — celui des 80 %. **Aucun effet, aucun talent.** Une arme, et c'est tout. Sa seule
vertu est de **résister**.

C'est peu, et c'est déjà énorme : une arme qui ne se brise pas au premier choc, qui grandit avec toi,
qu'on ne peut pas te voler — et qui **ne te prend aucun autre emplacement**. Là où Vesper et ludwing
paient leur accessoire et Korrah son Âme, **Aël garde tout**.

---

## 2. LES TRAITS — le don de naissance

Le Trait est **rare** : il faut une **certaine puissance**, une **volonté forte**, une **âme
puissante**. La plupart des gens n'en ont aucun. C'est la **Marque** qui l'active — une **Marque
creuse** ne répond plus.

| Clé | Trait | Porteur | Effet mécanique exact | Condition |
|---|---|---|---|---|
| `sang` | **LE SANG** | Vesper (1) | Ses frappes **ne ratent jamais** et lui **rendent 25 % des dégâts** infligés. | — |
| `change` | **CHANGE** | Korrah (2) | Visée sur un allié : elle **prend sa place** dans l'ordre du groupe **et lui reprend ses états négatifs**. Sa place, fardeau compris. | Trait de base — rien à porter. |
| `hiver` | **HIVER** | Korrah (2) | L'attaque **devient de l'élément GLACE** quelle que soit la formule — et Korrah **encaisse 15 %** des dégâts en retour. | **Le familier doit être au slot Âme.** |
| `ames` | **L'ABSORPTION DES ÂMES** | ludwing (3) | **+2 âmes** (variable 15) et **+10 % de ses PM max** par frappe, plus l'état **`l'Envers` (204)**. | **÷2** si l'amulette a explosé. |
| `miracle` | **MIRACLE** | Aël (4) | Voir ci-dessous. | — |

### 2.1 · Le Miracle d'Aël

Face à un ennemi, elle finit par **développer d'elle-même la technique capable de le toucher**, même
si elle **ne connaît pas le sort**. Ce qu'elle développe **se matérialise en flèches** — les
**Flèches Miracle**.

| Règle | Valeur |
|---|---|
| **C'est lent** — un tour économe fait monter la jauge | `+20` / tour |
| **Il faut économiser** — un tour à plus de 20 PM la fait retomber | `−25` |
| **À 100** — sa prochaine frappe de Trait **touche par la faiblesse de la cible** (le meilleur taux élémentaire de l'ennemi) et **ne rate pas** | puis retour à `0` |

> *Exemple canon : contre un ennemi faible au **mana positif** — en particulier au **Crépuscule** —
> elle développera au fil du combat de quoi l'atteindre, même sans connaître le sort.
> (L'élément **Crépuscule** existe en base : ID **29**.)*

### 2.2 · Le prix — commun à tous les Traits

| Prix par usage | Marque légitime | Marque étrangère |
|---|---|---|
| PM max drainés | **20 %** | **40 %** |
| TP drainés | **20** | **40** |
| Errance gagnée | **+2** | **+6** |
| Bonus du Trait | oui | **aucun** — « le Trait déchire le porteur » |

**Marque CREUSE → le Trait ne répond plus du tout.**
**Don BRISÉ → ce que le Trait rapporte est divisé par deux.**
*(Un Don simplement rangé ne supprime pas le Trait : il lui retire sa sécurité. Seul le **Familier**
fait exception — absent, le Trait qu'il débloquait n'existe plus.)*

### 2.3 · Anciennes clés — reprises, pas abandonnées

| Ancienne clé | → Trait actuel | Personnage |
|---|---|---|
| `rupture` | `sang` | Vesper |
| `gel` | `hiver` | Korrah |
| `porte` | `ames` | ludwing |
| `verbe` | `miracle` | Aël |

---

# 📦 TOUT CE QUI EXISTE EN BASE

## 3. LE DON — les 13 pièces, chacune dans son slot

**Notetags portés par chaque pièce de Don** *(arme ou armure)* :

```
<Don: vesper|korrah|ludwing|ael>
<Forme: arme|objet|familier>
<Palier: 1-4>
<TraitDebloque: hiver>        ← familier seulement
```

Les anciens tags `<Objet Spirituel: thylane|neyssa|lou|tianna>` restent lus par le plugin.

**Paliers :** `1 · ÉCLAT` (niv. 1) → `2 · FORME` (niv. **15**) → `3 · RÉSONANCE` (niv. **35**) →
`4 · VÉRITÉ` (niv. **60**).

### 3.1 · 🔮 OBJET → slot **Accessoire** (etypeId 5)

**🩸 le Masque — Vesper** · armures **68-71** · icône 184

| ID | Nom | Palier | HP | MP | ATK | DÉF | MAT | MDF | AGI | CHA |
|---|---|---|---|---|---|---|---|---|---|---|
| **68** | Éclat de Masque | 1 · Éclat | 20 | 0 | 0 | 3 | 0 | 3 | 2 | 2 |
| **69** | Masque Naissant | 2 · Forme | 60 | 5 | 0 | 7 | 4 | 7 | 5 | 4 |
| **70** | Masque Résonant | 3 · Résonance | 120 | 10 | 0 | 12 | 9 | 12 | 9 | 7 |
| **71** | Vérité du Masque | 4 · Vérité | 220 | 20 | 0 | 20 | 16 | 20 | 14 | 12 |

**⬛ l'Amulette — ludwing** · armures **72-75** · icône 185

| ID | Nom | Palier | HP | MP | ATK | DÉF | MAT | MDF | AGI | CHA |
|---|---|---|---|---|---|---|---|---|---|---|
| **72** | Éclat d'Amulette | 1 · Éclat | 0 | 20 | 0 | 2 | 4 | 3 | 0 | 2 |
| **73** | Amulette Naissante | 2 · Forme | 10 | 50 | 0 | 5 | 10 | 7 | 2 | 4 |
| **74** | Amulette Résonante | 3 · Résonance | 25 | 95 | 0 | 9 | 18 | 12 | 4 | 7 |
| **75** | Vérité de l'Amulette | 4 · Vérité | 45 | 160 | 0 | 15 | 30 | 20 | 7 | 12 |

### 3.2 · 👤 FAMILIER → slot **Âme** (etypeId 7)

**❄️ l'Armure Volante — Korrah** · armures **76-79** · icône 186 · `<TraitDebloque: hiver>`

| ID | Nom | Palier | HP | MP | ATK | DÉF | MAT | MDF | AGI | CHA |
|---|---|---|---|---|---|---|---|---|---|---|
| **76** | Éclat Volant | 1 · Éclat | 25 | 0 | 3 | 6 | 0 | 4 | 4 | 0 |
| **77** | Armure Naissante | 2 · Forme | 70 | 0 | 7 | 14 | 0 | 9 | 9 | 2 |
| **78** | Armure Résonante | 3 · Résonance | 140 | 5 | 13 | 25 | 4 | 16 | 16 | 4 |
| **79** | Vérité de l'Armure Volante | 4 · Vérité | 250 | 10 | 22 | 40 | 8 | 26 | 26 | 8 |

### 3.3 · ⚔️ ARME → slot **Arme** (etypeId 1)

**✦ l'Arc et ses Flèches — Aël** · armes **513-516** · type d'arme **7 (Arc)**
*C'est le Don lui-même : Aël n'a pas de pièce d'accessoire ni d'Âme, et c'est exactement son avantage.*

| ID | Nom | Palier | HP | MP | ATK | DÉF | MAT | MDF | AGI | CHA | Anim. | Élément d'attaque |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **513** | Éclat Stellaire | 1 · Éclat | 0 | 5 | 10 | 0 | 14 | 8 | 4 | 2 | 361 | 3 · mana positive |
| **514** | Arc Naissant | 2 · Forme | 0 | 15 | 14 | 4 | 30 | 16 | 8 | 4 | 361 | 3 · mana positive |
| **515** | Arc Résonant | 3 · Résonance | 0 | 30 | 19 | 8 | 44 | 30 | 12 | 8 | 363 | 3 · mana positive |
| **516** | Vérité de l'Arc | 4 · Vérité | 0 | 60 | 25 | 14 | 58 | 52 | 16 | 18 | 364 | 3 · mana positive **+ 14 · LUMIÈRE** |

### 3.4 · L'accessoire d'Aël — **ce n'est pas un Don**

| ID | Nom | Slot | Stats | Note |
|---|---|---|---|---|
| **80** | le Carquois d'Étoiles | Accessoire | AGI +4, CHA +4 | **Aucun tag de Don.** Un carquois, rien de plus. Son slot est libre : elle y met ce qu'elle veut. |

---

## 4. LA MANIFESTATION — l'arme que le Don façonne

Quand le Don **n'est pas une arme**, le porteur tient quand même quelque chose : c'est ce que son Don
lui permet de tenir. Ces armes suivent **les mêmes paliers, au même moment**, et portent le notetag
`<Manifestation: cle>` + `<Palier: n>` — **elles ne sont pas le Don** et le plugin ne les confond pas.

**Règle d'élément** — *l'élément d'attaque est le **Mana primaire** du porteur ; la **Vérité** ajoute
l'élément de son Don ou de son Trait.*

### 4.1 · 🩸 Vesper — **la Lame de Sang** · armes **501-504** · type d'arme **15 (SANG)**

*« L'arme que le Masque lui permet de tenir : son propre sang, durci. »*

| ID | Nom | Palier | HP | MP | ATK | DÉF | MAT | MDF | AGI | CHA | Anim. | Élément |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **501** | Éclat de Sang | 1 | 0 | 0 | 10 | 0 | 0 | 0 | 3 | 0 | 361 | 2 · mana spirituelle |
| **502** | Lame de Sang Naissante | 2 | 0 | 0 | 18 | 5 | 6 | 0 | 7 | 2 | 361 | 2 · mana spirituelle |
| **503** | Lame de Sang Résonante | 3 | 0 | 0 | 28 | 10 | 14 | 6 | 12 | 4 | 367 | 2 · mana spirituelle |
| **504** | Vérité de la Lame de Sang | 4 | 30 | 0 | 42 | 18 | 26 | 14 | 18 | 8 | 364 | 2 · spirituelle **+ 4 · mana négative** |

### 4.2 · ❄️ Korrah — **les Poings Volants** · armes **505-508** · type d'arme **11 (Gant)**

*« Les poings que l'Armure Volante lui prête — son familier frappe pour elle. »*

| ID | Nom | Palier | HP | MP | ATK | DÉF | MAT | MDF | AGI | CHA | Anim. | Élément |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **505** | Éclat Lucide | 1 | 0 | 0 | 7 | 4 | 8 | 8 | 0 | 0 | 361 | 4 · mana négative |
| **506** | Poings Naissants | 2 | 0 | 5 | 14 | 10 | 18 | 20 | 2 | 2 | 361 | 4 · mana négative |
| **507** | Poings Résonants | 3 | 0 | 10 | 23 | 18 | 26 | 30 | 5 | 4 | 363 | 4 · mana négative |
| **508** | Vérité des Poings Volants | 4 | 0 | 20 | 34 | 28 | 36 | 42 | 9 | 8 | 364 | 4 · négative **+ 13 · GLACE** |

### 4.3 · ⬛ ludwing — **l'Arme d'Ombre** · armes **509-512** · type d'arme **14 (OMBRE)**

*« L'arme que l'Amulette tire de l'ombre qu'elle a bue. »*
⚠️ **C'est ce type d'arme (14) qui ouvre les types de compétence 11-18** — l'arsenal d'ombre.

| ID | Nom | Palier | HP | MP | ATK | DÉF | MAT | MDF | AGI | CHA | Anim. | Élément |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **509** | Éclat des Âmes | 1 | 0 | 0 | 13 | 0 | 10 | 0 | 0 | 2 | 361 | 2 · mana spirituelle |
| **510** | Ombre Naissante | 2 | 10 | 5 | 30 | 6 | 24 | 8 | 4 | 6 | 361 | 2 · mana spirituelle |
| **511** | Ombre Résonante | 3 | 20 | 12 | 36 | 13 | 33 | 17 | 8 | 12 | 363 | 2 · mana spirituelle |
| **512** | Vérité de l'Ombre | 4 | 35 | 24 | 44 | 22 | 46 | 28 | 14 | 20 | 364 | 2 · spirituelle **+ 15 · OMBRE** |

> 🎨 **Convention d'animation des paliers** : `1-2 → 361 Éclat` · `3 → 363 Éclat · Rose`
> (Vesper : `367 Onde de choc · Rose`) · `4 → 364 Éclat · Or`.
> **Évolution de palier** : animation **51 · Augmenter la puissance 1**, son **`Saint5`**.

### 4.4 · L'équipement de départ

| Acteur | Arme | Accessoire | Âme |
|---|---|---|---|
| **1 · Vesper** | 501 *Éclat de Sang* | **68 le Masque** 🔮 | *(libre)* |
| **2 · Korrah** | 505 *Éclat Lucide* | *(libre)* | **76 l'Armure Volante** 👤 |
| **3 · ludwing** | 509 *Éclat des Âmes* | **72 l'Amulette** 🔮 | *(libre)* |
| **4 · Aël** | **513 l'Arc** ⚔️ | 80 *le Carquois* (ordinaire) | *(libre)* |

---

## 5. Les compétences

### 5.1 · Les compétences de **Trait** — notetag `<Trait: …>`

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

> ⚠️ Les quatre compétences `gel` → **hiver** deviennent **impayables** si l'Armure Volante n'est pas
> équipée au slot Âme. C'est voulu : *c'est le familier qui débloque le Trait.*

### 5.2 · 🩸 Les techniques de **SANG** — type **10** *(remplissent la jauge du Masque)*

| ID | Nom | Anim. | Élément | Formule | PM |
|---|---|---|---|---|---|
| **463** | Saignée | 423 *Griffes · Rose* | Physique | `a.atk * 2.5 - b.def` | 8 |
| **464** | Fouet de Sang | 379 *Pluie perçante · Rose* | mana spirituelle | `a.atk * 3 - b.def * 1.5` | 14 |
| **465** | Cercle Écarlate | 415 *Cercle de runes · Rose* | mana spirituelle | `(a.atk + a.mat) * 2 - b.def` | 24 |

**Autres compétences notées `<Sang>`** (reconnues aussi) : `53` Lame de Sang · `55` Pluie de Flèches
Sanglantes · `56` Paon Hémorragique · `57` Frappe Écarlate · `58` Rafale de Coups Écarlates ·
`59` Dragon de la Nuit Sanglante · `113` Armure de Sang · `138` Disque Sanglant · `146` Sang pour
Sang · `434` Fleur Écarlate · `826` ◈ Rune de Saignée.

### 5.3 · 👁 Les techniques d'**ÂME** — type **9**

| ID | Nom | Anim. | Élément | Formule | PM | Appris |
|---|---|---|---|---|---|---|
| **466** | Aspiration d'Âme | 434 *Drain de vie · Violet* | mana spirituelle | `a.mat * 2.5 - b.mdf` | 12 | niv. 1 |
| **467** | Chaîne d'Âmes | 450 *Volutes d'âme · Violet* | mana spirituelle | `a.mat * 2 - b.mdf` | 22 | niv. 10 |
| **468** | Dette d'Âme | 458 *Mains de l'ombre · Violet* | mana spirituelle | `a.mat * 3.5 - b.mdf * 1.5` | 18 | niv. 22 |

### 5.4 · ⬛ Les techniques d'**OMBRE** — types **11 à 18**

**Elles remplissent la jauge d'Ombre (+12) et ce sont exactement celles qui sont scellées 4 tours
quand l'amulette explose.**

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

**Les deux ouvreuses** (notées `<Ombre>`) : **111** Arme d'Ombre · **112** Âme d'Ombre.
**Autres `<Ombre>`** : `44` · `66` · `67` · `68` · `159` · `164` · `187` · `188` · `195` · `196` · `210`.

### 5.5 · Les **Ultimes** des quatre marqués

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
| **204** | **l'Envers ◈ Trait de ludwing** | Accordé à chaque usage du Trait `ames`. Priorité 96, icône 71, `<StateFX>` `#2a2a3e`. Effet : **+50 % PM max**. |
| **190** | Épuisement de l'Âme | Contre-coup (Aël) : ATK ×0.6, AGI ×0.75. |
| **191** | Brûlure Mentale | Contre-coup (Korrah) : MAT ×0.6, MDF ×0.85. |
| **192** | Folie du Joueur | Contre-coup (ludwing) : CHA ×0.5, DÉF ×0.85. |
| **193** | Doute Paralysant | Contre-coup (Vesper) : MAT ×0.7, DÉF ×0.8. |
| **147** | Lien Spirituel | +6 % TGR/GRD (compétence 386). |

**États passifs de mental** (`<Passive State: …>` sur l'acteur, via `YEP_AutoPassiveStates`) :

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

Chaque famille existe en **4 teintes**, dans cet ordre : **base (`n`) · Violet (`n+1`) · Rose (`n+2`)
· Or (`n+3`)**.

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

> **La grammaire de couleur** : **Rose** = Vesper / le sang · **Violet** = ludwing / l'âme et l'ombre
> · **Or** = le palier *Vérité* et les Traits de Korrah · **base** = neutre / palier bas.

### 8.2 · Animations déjà branchées sur le système

| ID | Nom | Où |
|---|---|---|
| **361** | Éclat | paliers 1 et 2 des quatre chaînes d'arme |
| **363** | Éclat · Rose | palier 3 (Korrah, ludwing, Aël) |
| **367** | Onde de choc · Rose | palier 3 (Vesper) |
| **364** | Éclat · Or | palier 4 · *Vérité* |
| **51** | Augmenter la puissance 1 | **évolution de palier**, SE `Saint5` |
| **429** | Éclats brisés | compétence 462 *Attaque* — l'animation toute trouvée pour un Don brisé |
| **423 / 379 / 415** | Griffes · Pluie perçante · Cercle de runes (Rose) | les trois techniques de sang |
| **434 / 450 / 458** | Drain de vie · Volutes d'âme · Mains de l'ombre (Violet) | les trois techniques d'âme |
| **250 / 252 / 253 / 260** | Ombre · Lame / Griffe / Projection / Bénédiction | techniques d'ombre |
| **223 / 231 / 232 / 312** | Glace · Impact / Explosion / Cataclysme, Givre · Bénédiction | Trait Hiver |
| **333 / 334** | Crépuscule · Parole I & II | Trait Miracle |
| **404** | Vortex · Or | Trait Change |
| **64** | Paralyser | Éclat Noir |

---

## 9. Types & éléments de référence (`System.json`)

**Slots d'équipement** — `1` Arme *(⚔️ le Don-arme)* · `2` Bouclier · `3` Tête · `4` Corps ·
**`5` Accessoire** *(🔮 le Don-objet)* · `6` talisement · **`7` Ame** *(👤 le Don-familier)*.

**Types de compétence** — `1` capacité · `2` Spéciale · `3` ult · `4` JACKPOT · `5` BERSEK · `6` TIME ·
`7` MANA semi-parfait · `8` invocation · **`9` ame** · **`10` sang** ·
**`11-18` ombre d'épée / dague / hache / katana / lance / griffe / arc / arme à feu** · `19` Arts Sereins.

**Types d'arme** — `1` Dague · `2` Épée · `3` arme à feu · `4` Hache · `5` fouet · `6` Canne ·
**`7` Arc** *(Aël — son Don)* · `8` Arbalète · `9` fusil · `10` Griffe · **`11` Gant** *(Korrah)* ·
`12` Lance · `13` pompe · **`14` OMBRE** *(ludwing)* · **`15` SANG** *(Vesper)* · `16` éclat *(libre)*.

**Éléments** — `1` Physique · **`2` mana spirituelle** · `3` mana positive · `4` mana négative ·
`5` Mana Sombre · `6` Mana Originel · `7` AME · `8` FEU · `9` EAU · `10` VENT · `11` TERRE ·
`12` FOUDRE · **`13` GLACE** *(Hiver)* · **`14` LUMIÈRE** *(Aël)* · **`15` OMBRE** *(l'amulette)* ·
`16` mana semi parfait · `17` Vapeur · `19` Lave · `20` Plante · `22` Givre · `23` Métal ·
**`29` Crépuscule** *(la faiblesse que Miracle apprend à toucher)*.

---

# 🔧 LE CODE

## 10. `DonsSpirituels.js` v2.0 — l'Endurance, les jauges, les trois formes

**Ordre de chargement : #160**, après `ObjetSpirituel` (#34), `Errance` (#128), `MarqueVivante` (#133).

| Paramètre | Défaut | Ce que ça fait |
|---|---|---|
| `usureParUsage` | **1** | Endurance perdue par action offensive employant le Don. |
| `endurBase` | **40** | Base de la jauge. |
| `endurParNiveau` | **2** | *« Plus tu es puissant, plus ton Don résiste »*. |
| `endurParPalier` | **20** | Gain par palier : un **Éclat** casse vite, une **Vérité** presque jamais. |
| `maluxCasse` | **0.50** | Don brisé : **tout** ÷2 — dégâts, stats de la pièce, bonus de forme, Trait. |
| `ombreMax` | **100** | 🔮 Amulette — capacité de la jauge d'Ombre. |
| `ombreParUsage` | **12** | 🔮 Amulette — Ombre par technique d'ombre. |
| `ombreBlocage` | **4** | 🔮 Amulette — tours de blocage après l'explosion. |
| `sangMax` | **100** | 🔮 Masque — capacité de la jauge de Sang. |
| `sangParUsage` | **10** | 🔮 Masque — Sang par technique de sang. |
| `sangCoutPct` | **8** | 🔮 Masque **fendu** — % des PV max payés par attaque de sang. |
| `familierBonus` | **10** | 👤 Familier — bonus passif % (ATK/DÉF/AGI), ÷2 s'il est brisé. |
| `exigerEquipe` | **true** | Un Don rangé au sac n'apporte **rien** — et le Familier ne débloque plus son Trait. |

**Commandes**

| Commande | Effet |
|---|---|
| `DON reparer` | Répare les Dons de **tout le groupe**. |
| `DON reparer 3` | Répare celui de l'acteur 3. |
| `DON casser 3` | **Brise** celui de l'acteur 3 (scénario). |
| `DON vider 3` | Vide la **seconde jauge** de l'acteur 3. |
| `DON afficher` | Ouvre l'écran de lecture (`Scene_Dons`). |

**API script**

```js
window.Dons.de(actorId)          // {cle,type,typeNom,slot,slotNom,nom,piece,porte,
                                 //  palier,palierNom,endurance,max,casse,facteur,jauge,trait}
window.Dons.estCasse(actorId)    // brisé ?
window.Dons.estPorte(actorId)    // le Don est-il équipé ?
window.Dons.palier(actorId)      // 1-4
window.Dons.jauge(actorId)       // {nom, val, max, bloc} — null pour arme et familier
window.Dons.aLaForme(id,'objet') // 'arme' | 'objet' | 'familier'
window.Dons.traitDebloque(2)     // 'hiver' si le familier est porté, '' sinon
window.Dons.facteur(id)          // ce que le DON apporte : 0 non porté · 0.5 brisé · 1
window.Dons.facteurTrait(id)     // ce que le Don fait au TRAIT : 0.5 brisé · 1 sinon
window.Dons.reparer(id) / .casser(id) / .vider(id)
// compat v1 : .ombre(id) et .ombreBloquee(id) pointent sur la jauge générique
```

**Les hooks posés**

| Hook | Rôle |
|---|---|
| `Game_Action.apply` | usure, apparition, remplissage de la jauge, prix du sang |
| `Game_Action.makeDamageValue` | Don brisé → dégâts ÷2 |
| `Game_Actor.paramPlus` | Don brisé → **la moitié des stats de la pièce est retirée** |
| `Game_BattlerBase.isSkillTypeSealed` | amulette explosée → types 11-18 scellés |
| `Game_Battler.onTurnEnd` | décompte des tours de blocage |
| `Game_Battler.regenerateHp` | Masque fendu → régénération ÷2 |
| `Game_Battler.paramRate` | Familier → +10 % ATK/DÉF/AGI (+5 % s'il est brisé, 0 s'il est absent) |
| `Game_Actor.recoverAll` | **le repos répare** (auberge, soin complet) |

**Le registre en dur** *(à éditer pour ajouter un porteur)* :

```js
var DONS = {
    1: { cle:'vesper',  type:'objet',    slot:5, nom:'le Masque',
         jauge:{ nom:'Sang',  max:SANG_MAX,  parUsage:SANG_USE,  sur:'sang',  fin:'fendre' } },
    2: { cle:'korrah',  type:'familier', slot:7, nom:"l'Armure Volante", trait:'hiver' },
    3: { cle:'ludwing', type:'objet',    slot:5, nom:"l'Amulette",
         jauge:{ nom:'Ombre', max:OMBRE_MAX, parUsage:OMBRE_USE, sur:'ombre', fin:'exploser' } },
    4: { cle:'ael',     type:'arme',     slot:1, nom:"l'Arc et ses Flèches" }
};
```

## 11. `FamilierSpirituel.js` v1.0 — **la créature qui agit seule**

**Ordre de chargement : #162**, après `DonsSpirituels` et `TraitsAme`.

> *« Le Familier est une créature issue directement de l'âme — pas une invocation, pas un pacte :
> une part de soi qui marche à côté de soi. »* Les 2 % ne reçoivent pas un objet : ils reçoivent
> **quelqu'un**. Ce plugin lui donne ce qui lui manquait — **un tour à lui**.

### 11.1 · Il joue son propre tour

Quand sa porteuse a fini d'agir, le Familier agit **à son tour**. Ce n'est pas une seconde action
pour elle : c'est **lui** qui frappe, avec ses compétences, son animation, sa cible. **Elle n'a rien
à dépenser** — ni PM, ni TP, ni son tour.

**Il choisit seul :**

| Ce qu'il décide | Comment |
|---|---|
| **Sa cible** | Celle que sa porteuse vient de frapper *(il finit le travail)* — sinon **l'ennemi le plus bas en PV**. |
| **Son geste** | Palier **1-2** → il cogne une cible. Palier **3-4** → il alterne et **déferle sur tout le groupe un tour sur deux**. Face à un ennemi isolé, il ne déferle jamais. |
| **Frapper ou protéger** | Selon sa **posture** (ci-dessous). |

### 11.2 · Il se met devant

Un torse qui flotte sans corps, ça sert à ça. Quand sa porteuse encaisse un coup, le Familier en
prend une part — et **c'est son Endurance à lui qui la paie** (`−2` par coup encaissé). Protéger
l'use : un Familier qui a beaucoup gardé finit par **se disloquer**.

### 11.3 · Les trois postures — `FAMILIER posture 2 <mot>`

| Posture | Il frappe ? | Il intercepte | Particularité |
|---|---|---|---|
| **`libre`** *(défaut)* | oui | **20 %** | **Bascule tout seul en protection** quand sa porteuse tombe sous **40 % de PV**. |
| **`agressif`** | toujours | **20 %** | Il frappe quoi qu'il arrive, même si elle est au bord. |
| **`garde`** | non | **45 %** | Il ne fait plus que se mettre devant. |

### 11.4 · Ce qu'il coûte — la contrepartie des 2 %

- Il occupe le **slot Âme**.
- **Chacune de ses frappes use l'Endurance du Don**, comme celles de sa porteuse : un Familier actif
  **brûle sa jauge deux fois plus vite**. C'est le vrai prix d'une action gratuite par tour.
- Chaque interception coûte **2 d'Endurance** de plus.
- **Brisé** : il n'agit plus **qu'un tour sur deux**, et tout ce qu'il fait est **÷2** — dégâts comme
  interception. Il ne meurt pas : il **fatigue**.
- **Absent du slot Âme** : il n'existe pas, et le Trait qu'il débloquait non plus.

> ⚠️ **Il ne porte pas le Trait à la place de sa porteuse.** Ses frappes sont des frappes de
> Familier : elles **n'ont pas l'élément GLACE** et **ne déclenchent pas le recul d'HIVER**. Le froid
> reste le prix que Korrah paie elle-même — sinon le Familier deviendrait la faille qui **annule la
> règle d'or**.

### 11.5 · Ses trois actions (compétences **469-471**, `stypeId 0`, `occasion 3`)

Jamais sélectionnables par le joueur : **c'est le Familier qui décide.**

| ID | Nom | Anim. | Portée | Élément | Formule |
|---|---|---|---|---|---|
| **469** | Frappe des Poings Volants | 21 *Frapper Spécial 1* | 1 ennemi | mana négative | `a.atk * 1.2 - b.def * 0.8` |
| **470** | Déferlante des Poings | 404 *Vortex · Or* | tous | mana négative | `a.atk * 1.0 - b.def * 0.6` |
| **471** | Torse Gardien | 440 *Dôme gardien · Or* | lui-même | — | *(aucun dégât — c'est l'image de l'interception)* |

### 11.6 · Réglages, commandes et API

| Paramètre | Défaut | | Paramètre | Défaut |
|---|---|---|---|---|
| `postureDefaut` | **libre** | | `usureInterception` | **2** |
| `seuilDetresse` | **40** % | | `palierDeferlante` | **3** |
| `interceptLibre` | **20** % | | `brisePause` | **true** |
| `interceptGarde` | **45** % | | `montrerLog` | **true** |

| Commande | Effet |
|---|---|
| `FAMILIER posture 2 garde` | Change la posture du familier de l'acteur 2. |
| `FAMILIER agir 2` | Le fait agir immédiatement (scénario). |
| `FAMILIER etat` | Résumé dans le journal de combat. |

```js
window.Familiers.de(actorId)       // {nom, posture, present, actif, brise, palier, facteur}
window.Familiers.present(2)        // le familier est-il là ?
window.Familiers.posture(2,'garde')
window.Familiers.agir(2)
```

**Le registre** *(à étendre pour un nouveau familier)* :

```js
var FAMILIERS = {
    2: { nom: "l'Armure Volante", frappe: 469, deferlante: 470, garde: 471 }
};
```

## 12. `ObjetSpirituel.js` v2.0 — l'évolution en 4 paliers, dans les bons slots

**Ordre de chargement : #34** (avant les deux autres).

| Paramètre | Défaut |
|---|---|
| `lvForme` / `lvResonance` / `lvVerite` | **15** / **35** / **60** |
| `soulBonus` | **true** — le Don gagne/perd ATK & MAT selon la santé mentale du porteur |
| `evoAnim` / `evoSE` | **51** / **Saint5** |

Il fait évoluer **deux chaînes par héros, en même temps** : le **Don** dans son slot, et la
**Manifestation** dans la main. Une seule annonce — celle du Don.

| Commande | Effet |
|---|---|
| `OBJET check` | Réévalue tous les héros (après un événement scénarisé). |
| `OBJET rendre` | Redonne à chaque héros la pièce de son Don si elle a été perdue, et la rééquipe. |

## 13. `TraitsAme.js` v2.0 — les Traits

**Ordre de chargement : #161**, juste après `DonsSpirituels`.

| Paramètre | Défaut | | Paramètre | Défaut |
|---|---|---|---|---|
| `drainPM` | **20** | | `amesGain` | **2** |
| `drainTP` | **20** | | `amesVar` | **15** |
| `errancePar` | **2** | | `miracleSeuil` | **20** |
| `erranceForce` | **6** | | `miracleGain` | **20** |
| `etatEnvers` | **204** | | `miraclePerte` | **25** |
| `sangDrain` | **25** | | `hiverRecul` | **15** |
| `hiverElement` | **13** | | | |

```js
window.Traits.de(actorId)              // {cle, nom, don}
window.Traits.tous(actorId)            // tous ses Traits (Korrah en a deux)
window.Traits.possede(actorId,'hiver')
window.Traits.miracle(4)               // progression 0-100 d'Aël
```

**Interaction avec le Don** : `TraitsAme` lit `window.Dons.facteurTrait(id)` — un **Don brisé** divise
par deux ce que rapporte le Trait — `window.Dons.ombreBloquee(3)` — l'**amulette explosée** réduit
l'absorption d'âmes de moitié — et `window.Dons.traitDebloque(2)` — sans le **familier**, HIVER ne
répond plus.

## 14. Les plugins voisins

| Plugin | # | Lien avec le Don |
|---|---|---|
| `ObjetEveille` | 183 | **L'arme parle** : répliques en combat selon la Chute, + l'**Ancre** (corruption ≥ 85 → −20, 1×/combat). |
| `AuraPaliers` | 131 | L'aura visible, couleur lue sur `<Mana:>` / `<Mana2:>`, palier par niveau. |
| `Errance` | 128 | Reçoit l'Errance payée par chaque usage de Trait. |
| `MarqueVivante` | 133 | `window.Marque.etat(id)` — une **marque creuse** coupe les Traits. |
| `AmeSouls` | 36 | Le stock d'âmes (variable 15) qu'alimente l'Absorption. |
| `MaitriseVoies` | 158 | Les Voies de combat, dont `sang` — le style **appris** de Vesper, par-dessus son Trait. |

**Ordre à respecter** : `ObjetSpirituel` (34) → `Errance` (128) → `MarqueVivante` (133) →
**`DonsSpirituels` (160)** → **`TraitsAme` (161)** → **`FamilierSpirituel` (162)** → `ObjetEveille` (183).

---

## 15. Recettes

### 15.1 · Donner un Don à un nouveau personnage

1. **Choisir la forme** — elle décide du slot : `arme` → Arme · `objet` → Accessoire · `familier` → Âme.
2. **Créer la chaîne de 4 pièces** (armes si `arme`, armures sinon) avec sur chacune :
   `<Don: cle>`, `<Forme: xxx>`, `<Palier: 1>` … `<Palier: 4>`.
3. **Déclarer la chaîne** dans `ObjetSpirituel.js` → `CHAINS[actorId] = { don:{…}, manif:{…}|null }`.
4. **Déclarer le Don** dans `DonsSpirituels.js` → `DONS[actorId] = { cle, type, slot, nom, … }`.
   - Pour un **objet**, ajouter sa `jauge : { nom, max, parUsage, sur, fin }`
     (`sur` : `'sang'` ou `'ombre'` · `fin` : `'fendre'` ou `'exploser'`).
   - Pour un **familier**, ajouter `trait: 'cle'` — c'est ce qui le rend redoutable.
5. **Si le Don n'est pas une arme**, créer aussi la **Manifestation** : 4 armes notées
   `<Manifestation: cle>` + `<Palier: n>`.

### 15.2 · Donner un Trait

1. **Déclarer** dans `TraitsAme.js` → `TRAITS.macle = { actor: N, nom, don }` — plus
   `parFamilier: true` si c'est un familier qui l'ouvre.
2. **Noter les compétences** : `<Trait: macle>`.
3. Coder l'effet dans `Game_Action.apply`, en multipliant toujours par `facteurDon(id)`.
4. **Respecter la règle d'or** : le porteur doit **subir** son propre Trait, et son Don doit être la
   **sécurité** qui lui répond.

### 15.3 · Marquer une compétence

| Tu veux… | Notetag / condition |
|---|---|
| Qu'elle remplisse la jauge d'Ombre | type **11-18**, ou `<Ombre>` |
| Qu'elle remplisse la jauge de Sang, et coûte des PV si le Masque est fendu | type **10**, ou `<Sang>` |
| Qu'elle déclenche le prix et l'effet d'un Trait | `<Trait: sang\|change\|hiver\|ames\|miracle>` |
| Qu'elle use l'Endurance | rien à faire — **toute action de dégâts** du porteur l'use |

---

## 16. Table de correspondance — anciens noms

Certains notetags historiques portent encore les anciens noms. Le code lit l'**ID d'acteur**, jamais
le nom, et les alias sont gérés — mais il faut le savoir en lisant la base.

| ID | Nom actuel | Ancien nom | Classe | Mana | Voie par défaut | Camp |
|---|---|---|---|---|---|---|
| **1** | **Vesper** | `thylane` | 1 · l'Équilibre | spirituelle + négatif | `sang` | ombre |
| **2** | **Korrah** | `neyssa` | 2 · la Maîtrise | négatif + positif | `flash` | lumière |
| **3** | **ludwing** | `lou` | 3 · le Symbole | spirituelle + positif | `source` | ombre |
| **4** | **Aël** | `tianna` | 4 · la Parole | positif | `miroir` | lumière |

Traits : `rupture → sang` · `gel → hiver` · `porte → ames` · `verbe → miracle`.

---

## 17. Ce qui reste à écrire

1. **Les 80 / 18 / 2 %.** Aucun tirage de population : les quatre marqués ont leur Don écrit en dur,
   les PNJ et ennemis n'en ont pas. Il faudrait un tirage (80/18/2) à leur création.
2. **L'apparition à la première utilisation** est **narrative** : le message s'affiche, mais rien
   n'empêche d'employer le Don avant.
3. **Un familier générique.** Ses actions et le Trait qu'il débloque sont déclarés dans les registres
   des plugins ; le notetag `<TraitDebloque: hiver>` est posé sur les pièces mais pas encore lu comme
   source de vérité. Un second familier demande deux lignes de registre, pas du code.
4. **Le familier n'a pas de sprite propre.** Il agit, il frappe, il se met devant — mais visuellement
   c'est l'animation de sa compétence qui le représente, pas une figure à l'écran.
5. **L'Endurance en combat.** Elle n'apparaît qu'à l'écran `DON afficher` ; aucune barre dans
   l'interface de combat — alors que le familier la brûle deux fois plus vite.
6. **La réparation hors auberge.** Seuls `recoverAll` et `DON reparer` réparent. Pas d'objet
   consommable *(le `80 · Éclat d'Âme` serait le matériau tout trouvé)*.

---

## 18. Corrections appliquées (v2)

| # | Ce qui n'allait pas | Correction |
|---|---|---|
| 0 | Le **Familier** était un simple bonus passif de +10 %. Le canon dit une **créature** — un stand, une part de soi qui marche à côté de soi. | **`FamilierSpirituel.js`** : il joue son propre tour, choisit sa cible et son geste, se met devant sa porteuse en danger, et paie tout ça de sa propre Endurance. Voir **§11**. |
| 1 | Les trois formes vivaient **toutes** dans le slot Arme : rien ne distinguait un Objet d'un Familier. | **Chaque forme a son slot** : Arme → Arme · Objet → **Accessoire** · Familier → **Âme**. 12 pièces créées (68-79). |
| 2 | Le nom du Don servait à la fois à l'arme **et** à l'objet (*Masque Résonant* était une arme de type SANG). | Le Don et la **Manifestation** sont séparés : 501-512 renommées (Lame de Sang · Poings Volants · Arme d'Ombre), 68-79 portent les vrais noms du Don. |
| 3 | Le **Masque n'avait pas de seconde jauge** — il ne cassait que par usure, alors que le canon dit « si elle en abuse, il se casse ». | Jauge de **Sang** (100, +10 par technique) : pleine, **le Masque se fend** d'un coup. |
| 4 | « Tout ce qu'il apporte ÷2 » ne s'appliquait qu'aux **dégâts**. | Le Don brisé retire aussi **la moitié des statistiques de sa pièce**, et le bonus du Familier tombe à +5 %. |
| 5 | HIVER répondait **même sans le familier**, alors que c'est lui qui le débloque. | Familier absent du slot Âme → les compétences `<Trait: hiver>` deviennent **impayables**. |
| 6 | La *Vérité du Masque* attaquait en **FEU**, sans rapport avec le sang. | Règle uniforme : **élément = Mana primaire du porteur**, la **Vérité** ajoute l'élément de son Don/Trait (Vesper → mana négative · Korrah → GLACE · ludwing → OMBRE · Aël → LUMIÈRE). |
| 7 | L'*Amulette Résonante* **perdait** 2 d'ATK par rapport au palier précédent, et la *Vérité de l'Amulette* avait **−9 MP**. | Courbes rendues **monotones** sur les quatre chaînes. Idem pour le pic de MAT de l'*Arc Résonant* (56 → 44, puis 58 à la Vérité). |
| 8 | Le Don d'Aël avait **deux noms** (« le Carquois d'Étoiles » côté armure, « l'Arc » côté plugin). | Son Don est **l'arc**, un seul nom. Le Carquois (armure **80**) devient un accessoire **ordinaire**, sans mécanique — la preuve que ses slots sont libres. |
| 9 | `plugins.js` n'exposait pas tous les paramètres. | Les 13 paramètres de `DonsSpirituels` et les 13 de `TraitsAme` sont déclarés. |

---

*Compilé depuis la lecture intégrale de `data/Weapons.json`, `Armors.json`, `Skills.json`,
`States.json`, `Items.json`, `Actors.json`, `Classes.json`, `Animations.json`, `System.json`,
`js/plugins.js` et des plugins `DonsSpirituels`, `TraitsAme`, `ObjetSpirituel`, `ObjetEveille`.
Comportement vérifié sur banc d'essai : 24 contrôles sur `DonsSpirituels`, 7 sur `ObjetSpirituel`,
17 sur `FamilierSpirituel` (tour autonome, choix de cible, déferlante, postures, interception,
usure, familier brisé, familier retiré).*
