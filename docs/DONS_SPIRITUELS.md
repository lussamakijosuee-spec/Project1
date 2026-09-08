# ⚔️🔮👤 LES DONS SPIRITUELS — le dossier complet

> **v3.0 — la correction.** La version précédente de ce dossier décrivait un système où Vesper,
> Korrah et ludwing portaient **deux Dons** : leur Objet ou leur Avatar, **plus** une arme
> spirituelle appelée « Manifestation ». C'était une invention, et elle contredisait la règle
> centrale du monde. Elle est retirée. Personne n'a deux Dons.
>
> **Rien n'a été supprimé** : les douze armes concernées existent toujours, renommées, décrites,
> mises en vente. Elles sont juste redevenues ce qu'elles auraient toujours dû être — de l'acier.
>
> Le mot **« familier »** a disparu aussi : ce qu'il désignait s'appelle désormais un
> **AVATAR SPIRITUEL**, et le fichier `FamilierSpirituel.js` est devenu `AvatarSpirituel.js`.

---

## 0. La règle, en une page

Le Don n'est pas remis. Il **APPARAÎT**, de lui-même, la première fois qu'un marqué se sert
vraiment de son âme.

```
╔══════════════════════════════════════════════════════════════════════════╗
║   LA RÈGLE D'OR — ON N'EN A QU'UN.                                       ║
║                                                                          ║
║   Une ARME, OU un OBJET, OU un AVATAR.                                   ║
║   Jamais deux. Jamais de cumul. Jamais d'exception.                      ║
║                                                                          ║
║   Ce que le porteur tient dans l'autre main est de l'acier ordinaire :   ║
║   acheté, trouvé, remplaçable — et ça ne grandit PAS tout seul.          ║
║   Seul le Don fait ça.                                                   ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### 🔑 Chaque forme a sa place sur le corps

| | Forme | Fréquence | Slot occupé | Ce qu'elle donne | Ce qu'elle coûte |
|---|---|---|---|---|---|
| ⚔️ | **ARME** | **80 %** | **Arme** (etypeId 1) | Rien. Juste une résistance liée à l'âme. | Rien d'autre — **Accessoire et Âme restent libres** |
| 🔮 | **OBJET** | **18 %** | **Accessoire** (etypeId 5) | **Un effet ou un talent** — et une **seconde jauge** | Tout l'accessoire. On ne porte rien d'autre. |
| 👤 | **AVATAR** | **2 %** | **Âme** (etypeId 7) | Une **créature** qui agit seule, et qui peut porter un **Trait** | Tout le slot Âme. |

L'avantage caché des 80 % est réel : l'arme spirituelle ne coûte **aucun autre emplacement**.
Aël garde son Accessoire et son Âme libres. Vesper et ludwing paient leur Accessoire, Korrah paie
son Âme. C'est le prix d'un Don qui fait quelque chose.

### L'Endurance — commune aux trois formes

```
Endurance max = endurBase + niveau × endurParNiveau + (palier − 1) × endurParPalier
              =    40     + niveau ×        2       + (palier − 1) ×        20
```

Plus le porteur est puissant, plus son Don résiste. Elle s'use à chaque action offensive et se
restaure au repos (auberge, soin complet, commande `DON reparer`).

**À zéro, le Don CASSE — mais reste utilisable.** Tout ce qu'il apporte est **divisé par deux** :
dégâts, statistiques de la pièce, bonus de forme, et jusqu'à ce que le Trait en tire.

### La seconde jauge — le propre des OBJETS

Un Objet ne se contente pas de s'user : il se **gorge**. Chaque Objet a sa jauge, son carburant et
sa punition — et **en abuser coûte toujours plus cher que de laisser l'Endurance tomber**.

### 🆕 On est prévenu avant

Les deux jauges n'étaient lisibles qu'au menu : en combat, le joueur découvrait la casse au moment
où elle tombait. Le Don **avertit maintenant une fois** au franchissement du seuil, et il reste des
tours pour changer d'avis :

```
⚠ le Masque — Sang à 70 %. Encore 3 techniques avant qu'il ne se fende.
⚠ l'Amulette fatigue — Endurance 24 / 100. Un repos le remettrait d'aplomb.
```

Seuils réglables (`alerteJauge` 70 %, `alerteEndurance` 25 %), une seule alerte par seuil, `0` pour
les couper.

### 🆕 Le Don ne se retire pas, et ne se prête pas

Il est né de **cette** âme-là. Le joueur ne peut ni le déséquiper par erreur, ni le passer à
quelqu'un d'autre. C'est du canon, mais c'est surtout du **confort** : on ne perd plus son Trait en
rangeant un accessoire sans regarder.

- Retirer le Don → refusé (buzzer).
- Le remplacer par autre chose → refusé.
- **Tout retirer** / **Optimiser** → le Don reste, le reste part.
- Le Don d'un autre n'apparaît **même pas** dans la liste d'équipement.
- L'évolution de palier, elle, passe : elle porte un drapeau interne.
- Un événement garde `forceChangeEquip()` comme porte de service.

Option `verrouSlot`, notetag `<DonDe: actorId>`.

---

## 1. Les quatre marqués

| | Héros | Son **unique** Don | Forme | Slot | Sa main tient | Son Trait |
|---|---|---|---|---|---|---|
| 🩸 | **Vesper** | **le Masque** | OBJET | Accessoire | Lame Écarlate de Fer *(acier)* | **sang** |
| ❄️ | **Korrah** | **l'Armure Volante** | AVATAR | Âme | Gantelet de Fer *(acier)* | **change** + **hiver** *(via l'Avatar)* |
| ⬛ | **ludwing** | **l'Amulette** | OBJET | Accessoire | Hache Valo *(acier)* | **ames** |
| ✦ | **Aël** | **l'Arc et ses Flèches** | ARME | **Arme** | *son Don* | **miracle** |

> **Le Trait et le Don sont liés comme une sécurité.** L'utilisateur est affecté par ses propres
> effets : qui a un Trait de feu reçoit une arme de distance ou quelque chose qui lui permet de
> l'employer sans se brûler. Ce n'est pas décoratif, c'est ce qui rend le Trait jouable.

### 1.1 · 🩸 VESPER — LE MASQUE *(objet · accessoire)*

Son **unique** Don. Tant qu'il tient, elle taille dans son propre sang **sans se blesser** — et ce
sang **revient tout seul**. C'est l'effet que tout Objet doit porter : une **régénération de PV**
(+3 % → +12 % selon le palier).

**Jauge de SANG.** Chaque technique de sang (type 10 ou `<Sang>`) la remplit de 10.
**Pleine → LE MASQUE SE FEND** d'un coup — Endurance à zéro, sans attendre l'usure.

Dès lors :
- chaque attaque de sang lui coûte **8 % de ses PV max** ;
- sa **régénération tombe de moitié** ;
- tout ce que le Masque apporte est ÷2.

**Dans sa main : de l'acier.** Pas un second Don.

### 1.2 · ❄️ KORRAH — L'ARMURE VOLANTE *(AVATAR SPIRITUEL · âme)*

Son **unique** Don, et le plus rare des trois formes. Des **poings et un torse qui flottent sans
corps**, nés directement de son âme — pas une invocation, pas un pacte : *une part de soi qui
marche à côté de soi*. Un Stand.

Il **agit de lui-même**, à son propre tour (voir §11). Il débloque le Trait **HIVER** : elle
manipule la glace sans passer par une formule — **et le froid l'atteint elle aussi**.

> C'est bien **elle** qui porte le Trait, même si c'est **l'Avatar** qui le débloque.

**Il est INSÉPARABLE d'elle** — le même lien que Dono et son second œil. Rien ne peut le lui
prendre : ni un désarmement, ni un dissipateur, ni le joueur. Il ne meurt pas non plus : brisé, il
**fatigue**, il ne disparaît pas. Deux choses seulement l'éteignent — **elle tombe**, ou **elle perd
conscience**. Elle rouvre les yeux, il est là.

**Il monte en trois niveaux avec elle** (25 · 50 · 85), et plus il monte, plus elle le tient : de
l'IA automatique au contrôle total. Détail complet en **§11.3**.

**Dans sa main : de l'acier.** Pas un second Don.

### 1.3 · ⬛ LUDWING — L'AMULETTE *(objet · accessoire)*

Son **unique** Don. Elle **absorbe les ombres et les lui rend maniables** — c'est elle qui donne
l'impression qu'il a **deux Traits alors qu'il n'en a qu'un**. Le second, c'est le bijou.

**🆕 C'est l'Amulette qui ouvre les types de compétence d'ombre**, deux par palier :

| Palier | Ouvre | Cumul |
|---|---|---|
| 1 · Éclat | ombre d'**épée** (11), ombre de **dague** (12) | 2 |
| 2 · Forme | + ombre de **hache** (13), ombre de **katana** (14) | 4 |
| 3 · Résonance | + ombre de **lance** (15), ombre de **griffe** (16) | 6 |
| 4 · Vérité | + ombre d'**arc** (17), ombre d'**arme à feu** (18) | **8 — toutes** |

*Avant, quatre types d'ombre étaient posés au hasard sur des **armes**, et quatre types (13, 15, 17,
18) n'avaient aucune source dans tout le jeu : les compétences existaient, personne ne pouvait les
atteindre. C'est réglé, et c'est le canon qui le dit — l'amulette absorbe les ombres.*

**Jauge d'OMBRE.** Chaque technique d'ombre la remplit de 12.
**Pleine → elle EXPLOSE** : capacités d'ombre **bloquées 4 tours**, et l'absorption d'âmes deux fois
moins efficace pendant ce temps.

**Dans sa main : de l'acier.** Pas un second Don.

### 1.4 · ✦ AËL — L'ARC ET SES FLÈCHES *(arme · slot Arme)*

Son **unique** Don, et le seul des quatre qui soit une **arme**. Aucun effet, aucun talent :
seulement une arme qui ne cède pas.

Et c'est exactement la sécurité qu'il faut à **MIRACLE**, un Trait qui se matérialise en flèches.
En échange, son **Accessoire et son Âme restent libres** — c'est ça, l'avantage des 80 %.

Le **Carquois d'Étoiles** (armure 80) qu'elle porte à l'accessoire **n'est pas un Don** : c'est un
carquois, et il est là pour rappeler que sa place était libre.

---

## 2. LES TRAITS — le don de naissance

Un Trait est **rare** : il faut de la puissance, une volonté forte, une âme puissante. Il permet de
faire directement ce que les autres font par formule.

| Trait | Qui | Ce qu'il fait |
|---|---|---|
| **sang** | Vesper | contrôler son sang directement, et le fusionner avec du mana |
| **change** | Korrah | son Trait de base |
| **hiver** | Korrah | manipuler la glace sans formule — **elle reste affectée aussi** · débloqué par l'**Avatar** |
| **ames** | ludwing | absorber les âmes directement et les utiliser |
| **miracle** | Aël | développer de nouvelles techniques **en temps réel** |

### 2.1 · Le Miracle d'Aël

Si un ennemi est faible à un mana positif — le **Crépuscule** en particulier — elle finit par
développer une technique capable de le toucher **même si elle ne connaît pas le sort**.

Mais c'est **lent**, et surtout : elle doit **ne pas trop dépenser de mana** pour conserver l'effet.
Ça se matérialise en flèches. D'où **la Flèche de Miracle**.

### 2.2 · Le prix — commun à tous les Traits

L'utilisateur est **affecté par ses propres effets**. Chaque usage d'un Trait prélève, en plus du
coût affiché : **20 % des PM max**, **20 TP**, **+2 d'Errance**.

C'est là que le Don joue son rôle de sécurité — et c'est pour ça qu'il ne se retire pas.

### 2.3 · Anciennes clés — reprises, pas abandonnées

Les pièces écrites avant le renommage des personnages restent lues :
`thylane → vesper` · `neyssa → korrah` · `lou → ludwing` · `tianna → ael`.

---

# 📦 TOUT CE QUI EXISTE EN BASE

## 3. LE DON — les 16 pièces, chacune dans son slot

**Quatre chaînes, une par héros, quatre paliers chacune.** C'est tout. Il n'y en a pas d'autres.

```
Palier 1 · ÉCLAT      dès le niveau 1
Palier 2 · FORME      niveau 15
Palier 3 · RÉSONANCE  niveau 35
Palier 4 · VÉRITÉ     niveau 60
```

> **Le mot « Éclat » est réservé au palier 1 d'un Don.** Une arme ordinaire ne s'appelle jamais
> « Éclat de… » : ce serait promettre un Don à un objet qui n'en est pas un. Les armes 501, 505 et
> 509 portaient ce nom à tort — elles ont été renommées.

### 3.1 · 🔮 OBJET → slot **Accessoire** (etypeId 5)

**🩸 Vesper — le Masque · armures 68-71**

| ID | Nom | PV | Régénération |
|---|---|---|---|
| 68 | Éclat de Masque | +20 | **+3 %/tour** |
| 69 | Masque Naissant | +60 | **+5 %/tour** |
| 70 | Masque Résonant | +120 | **+8 %/tour** |
| 71 | Vérité du Masque | +220 | **+12 %/tour** |

**⬛ ludwing — l'Amulette · armures 72-75**

| ID | Nom | PM | Types d'ombre ouverts |
|---|---|---|---|
| 72 | Éclat d'Amulette | +20 | 11, 12 |
| 73 | Amulette Naissante | +50 | 11-14 |
| 74 | Amulette Résonante | +95 | 11-16 |
| 75 | Vérité de l'Amulette | +160 | **11-18 (les huit)** |

### 3.2 · 👤 AVATAR SPIRITUEL → slot **Âme** (etypeId 7)

**❄️ Korrah — l'Armure Volante · armures 76-79** — `<TraitDebloque: hiver>`

| ID | Nom | PV | DÉF |
|---|---|---|---|
| 76 | Éclat Volant | +25 | +6 |
| 77 | Armure Naissante | +70 | +14 |
| 78 | Armure Résonante | +140 | +25 |
| 79 | Vérité de l'Armure Volante | +250 | +40 |

Bonus passif **+10 % ATQ / DÉF / AGI** tant que l'Avatar est entier (**+5 %** s'il est brisé,
**rien** s'il est retiré).

### 3.3 · ⚔️ ARME → slot **Arme** (etypeId 1)

**✦ Aël — l'Arc · armes 513-516** *(type d'arme 7 · Arc)*

| ID | Nom | ATQ | MAT |
|---|---|---|---|
| 513 | Éclat Stellaire | 10 | 14 |
| 514 | Arc Naissant | 14 | 30 |
| 515 | Arc Résonant | 19 | 44 |
| 516 | Vérité de l'Arc | 25 | 58 |

### 3.4 · Ce qui **n'est pas** un Don

| ID | Pièce | Pourquoi |
|---|---|---|
| **80** | le Carquois d'Étoiles | Un carquois. Il marque la place libre d'Aël, rien de plus. |
| **501-512** | les douze armes ci-dessous | Elles ont été présentées à tort comme des Dons. |

---

## 4. 🔧 LA CORRECTION — les armes 501-512 redeviennent de l'acier

**Ce qui était écrit avant :** Vesper tenait « la Lame de Sang », Korrah « les Poings Volants »,
ludwing « l'Arme d'Ombre » — des **Manifestations**, des armes que le Don façonnait, qui montaient
de palier en même temps que lui.

**Pourquoi c'était faux :** ça leur donnait **deux Dons chacun**. Un objet **et** une arme. Le
système entier repose sur le fait qu'on n'en a qu'un, et que la forme qu'on reçoit **décide de ce
qu'on peut faire d'autre**. Avec une Manifestation, l'avantage des 80 % — garder ses autres
emplacements — ne voulait plus rien dire, puisque tout le monde avait aussi une arme.

**Ce qui a été fait :** les douze armes sont **gardées**, débarrassées de toute note de Don,
renommées, redécrites et **mises en vente**. Ce sont maintenant les lignes d'armes personnelles de
chaque héros — de l'acier, qui ne monte pas de palier tout seul.

| ID | Ancien nom | **Nouveau nom** | Type | Prix |
|---|---|---|---|---|
| 501 | ~~Éclat de Sang~~ | **Lame de Garde Écarlate** | 15 · SANG | 200 |
| 502 | ~~Lame de Sang Naissante~~ | **Lame Écarlate Fendue** | 15 · SANG | 900 |
| 503 | ~~Lame de Sang Résonante~~ | **Lame Écarlate Jumelée** | 15 · SANG | 1 800 |
| 504 | ~~Vérité de la Lame de Sang~~ | **Écarlate de Serment** | 15 · SANG | 3 300 |
| 505 | ~~Éclat Lucide~~ | **Gantelets Lucides** | 11 · Gant | 150 |
| 506 | ~~Poings Naissants~~ | **Gantelets Renforcés** | 11 · Gant | 600 |
| 507 | ~~Poings Résonants~~ | **Gantelets de Maîtrise** | 11 · Gant | 1 700 |
| 508 | ~~Vérité des Poings Volants~~ | **Gantelets de Contre-Prise** | 11 · Gant | 3 100 |
| 509 | ~~Éclat des Âmes~~ | **Faux d'Ossuaire** | 14 · OMBRE | 300 |
| 510 | ~~Ombre Naissante~~ | **Faux d'Ossuaire Noircie** | 14 · OMBRE | 2 100 |
| 511 | ~~Ombre Résonante~~ | **Faux d'Ossuaire Veillante** | 14 · OMBRE | 2 800 |
| 512 | ~~Vérité de l'Ombre~~ | **Faux d'Ossuaire Dernière** | 14 · OMBRE | 3 600 |

Les types d'arme **15 (SANG)** et **14 (OMBRE)** restent réservés à leur classe : ces armes restent
personnelles à Vesper et à ludwing. Elles ne sont juste plus spirituelles.

Les **types de compétence d'ombre** qu'elles ouvraient sont partis là où le canon les met :
**sur l'Amulette** (§1.3).

### 4.1 · L'équipement de départ

| Héros | Arme | Accessoire | Âme |
|---|---|---|---|
| **Vesper** | #160 Lame Écarlate de Fer *(acier)* | **#68 Éclat de Masque — son Don** | libre |
| **Korrah** | #139 Gantelet de Fer *(acier)* | libre | **#76 Éclat Volant — son Don** |
| **ludwing** | #2 Hache Valo *(acier)* | **#72 Éclat d'Amulette — son Don** | libre |
| **Aël** | **#513 Éclat Stellaire — son Don** | #80 le Carquois d'Étoiles | **libre** |

**Chacun démarre avec exactement un Don.** Vérifié par banc d'essai.

> **Sauvegardes existantes :** rien n'est cassé. Une partie où Vesper portait « l'Éclat de Sang »
> la voit maintenant porter la « Lame de Garde Écarlate » — même arme, mêmes statistiques, même
> emplacement. Elle ne montera simplement plus de palier toute seule.

---

## 5. Les compétences

### 5.1 · Les compétences de **Trait** — notetag `<Trait: …>`

Elles prélèvent leur dîme (§2.2) en plus de leur coût. Celles marquées `<Trait: hiver>` deviennent
**impayables** si l'Avatar n'est pas au slot Âme.

### 5.2 · 🩸 Les techniques de **SANG** — type **10**

Elles remplissent la jauge du Masque. Le type 10 est ouvert par la **classe 1** (l'Équilibre).

### 5.3 · 👁 Les techniques d'**ÂME** — type **9**

Le Trait de ludwing. Le type 9 est ouvert par la **classe 3** (le Symbole).

### 5.4 · ⬛ Les techniques d'**OMBRE** — types **11 à 18**

**Ouvertes par l'Amulette**, deux par palier (§1.3). Elles remplissent la jauge d'Ombre et sont
**scellées** pendant les 4 tours qui suivent l'explosion.

### 5.5 · 🆕 Les trois **ORDRES** à l'Avatar — compétences **1246-1248**

*Voir §11.3. Type 2 (Spéciale), 0 mana, 0 TP, en combat uniquement, connues dès le niveau 1.*

### 5.6 · Les gestes de l'Avatar — compétences **469-471** et **1249-1254**

Notés `<Avatar>`, `occasion 3` (jamais dans un menu). Ce ne sont pas des compétences que Korrah
lance : c'est **l'Avatar** qui les joue, tout seul, à son tour. **Aucune classe ne les apprend** —
c'est voulu.

| ID | Nom | Avatar niveau | Quand |
|---|---|---|---|
| 469 | Frappe des Poings Volants | naissance | il cogne une cible |
| 470 | Déferlante des Poings | naissance | palier 3+, un tour sur deux, sur le groupe |
| 471 | Torse Gardien | naissance | il se place devant elle |
| **1249** | **Poings Enchaînés** | **1** (25) | trois frappes sur la même garde |
| **1250** | **Saisie de l'Armure** | **1** (25) | le torse se referme — peut étourdir |
| **1251** | **Étau de l'Armure** | **2** (50) | les deux poings au même endroit — fissure le blindage |
| **1252** | **Le Torse Se Referme** | **2** (50) | la grande garde : rien ne passe plus |
| **1253** | **Déferlante d'Unisson** | **3** (85) | le même geste qu'elle, au même instant, sur tout le champ |
| **1254** | **Ce Que Le Froid Garde** | **3** (85) | il rend le froid qu'elle lui a confié — gèle |

### 5.7 · Les ordres de Korrah — compétences **1246-1248** et **1255-1258**

Deux familles, deux notetags :

- `<AvatarPosture: libre\|agressif\|garde>` → **comment** il se comporte (1246-1248, dès le niveau 1)
- `<AvatarOrdre: skillId>` → **quoi faire, et sur qui** (1255-1258, débloqués par niveau)

Tous coûtent **0 mana** et **ne perdent pas le tour** : l'Avatar agit dans la foulée.

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
| **361** | Éclat | paliers 1 et 2 des chaînes de Don |
| **363** | Éclat · Rose | palier 3 (Korrah, ludwing, Aël) |
| **367** | Onde de choc · Rose | palier 3 (Vesper) |
| **364** | Éclat · Or | palier 4 · *Vérité* |
| **51** | Augmenter la puissance 1 | **évolution de palier**, SE `Saint5` |
| **429** | Éclats brisés | compétence 462 *Attaque* — l'animation toute trouvée pour un Don brisé |
| **21** | *(geste de l'Avatar)* | compétence 469, et les ordres 1246 / 1247 |
| **404** | Vortex · Or | compétence 470 · Déferlante · Trait Change |
| **440** | Dôme gardien · Or | compétence 471, et l'ordre 1248 |
| **423 / 379 / 415** | Griffes · Pluie perçante · Cercle de runes (Rose) | les trois techniques de sang |
| **434 / 450 / 458** | Drain de vie · Volutes d'âme · Mains de l'ombre (Violet) | les trois techniques d'âme |
| **250 / 252 / 253 / 260** | Ombre · Lame / Griffe / Projection / Bénédiction | techniques d'ombre |
| **223 / 231 / 232 / 312** | Glace · Impact / Explosion / Cataclysme, Givre · Bénédiction | Trait Hiver |
| **333 / 334** | Crépuscule · Parole I & II | Trait Miracle |
| **64** | Paralyser | Éclat Noir |

---

## 9. Types & éléments de référence (`System.json`)

**Slots d'équipement** — `1` Arme *(⚔️ le Don-arme)* · `2` Bouclier · `3` Tête · `4` Corps ·
**`5` Accessoire** *(🔮 le Don-objet)* · `6` talisement · **`7` Ame** *(👤 l'Avatar Spirituel)*.

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

## 10. `DonsSpirituels.js` **v3.0** — l'Endurance, les jauges, le verrou

Le registre est la **seule source de vérité** sur qui a quoi :

```js
var DONS = {
    1: { cle:'vesper',  type:'objet',  slot:5, nom:'le Masque',
         jauge:{ nom:'Sang',  max:100, parUsage:10, sur:'sang',  fin:'fendre' } },
    2: { cle:'korrah',  type:'avatar', slot:7, nom:"l'Armure Volante",
         trait:'hiver' },
    3: { cle:'ludwing', type:'objet',  slot:5, nom:"l'Amulette",
         jauge:{ nom:'Ombre', max:100, parUsage:12, sur:'ombre', fin:'exploser' } },
    4: { cle:'ael',     type:'arme',   slot:1, nom:"l'Arc et ses Flèches" }
};
```

**Une entrée par héros. Un `type`. Un `slot`.** Il n'y a nulle part où mettre un second Don.

### 10.1 · Ce que la v3.0 change

| | v2.0 | **v3.0** |
|---|---|---|
| Formes | arme · objet · **familier** | arme · objet · **avatar** |
| Dons par personne | 1 **+ une « Manifestation »** pour 3 héros sur 4 | **1. Point.** |
| Retirer son Don | possible, en silence | **refusé** (`verrouSlot`) |
| Porter le Don d'un autre | possible | **refusé**, et invisible dans la liste |
| Jauges | lisibles au menu seulement | **alerte en combat** au seuil |
| Écran `DON afficher` | aucune touche de sortie — **l'écran restait bloqué** | Annuler/OK ferment |
| Accès à l'écran | commande d'événement seulement | **entrée dans le menu principal** |

### 10.2 · Réglages

| Paramètre | Défaut | Rôle |
|---|---|---|
| `usureParUsage` | 1 | Endurance perdue par action offensive |
| `endurBase` / `endurParNiveau` / `endurParPalier` | 40 / 2 / 20 | la formule d'Endurance |
| `maluxCasse` | 0.50 | ce que devient **tout** ce qu'apporte un Don brisé |
| `ombreMax` / `ombreParUsage` / `ombreBlocage` | 100 / 12 / 4 | l'Amulette |
| `sangMax` / `sangParUsage` / `sangCoutPct` | 100 / 10 / 8 | le Masque |
| `avatarBonus` | 10 | % d'ATQ/DÉF/AGI de l'Avatar *(ex-`familierBonus`, encore lu)* |
| `exigerEquipe` | Oui | un Don rangé au sac n'apporte plus rien |
| **`verrouSlot`** | **Oui** | le Don ne se retire pas, ne se prête pas |
| **`alerteJauge`** | **70** | % de la seconde jauge qui déclenche l'avertissement (0 = jamais) |
| **`alerteEndurance`** | **25** | % d'Endurance qui déclenche l'avertissement (0 = jamais) |
| **`dansLeMenu`** | **Oui** | ajoute « LES DONS SPIRITUELS » au menu principal |

### 10.3 · Commandes et API

```
DON reparer          répare les Dons de tout le groupe
DON reparer 3        répare celui de l'acteur 3
DON casser 3         le brise (scénario)
DON vider 3          vide sa seconde jauge
DON afficher         ouvre l'écran de lecture

window.Dons.de(id)             fiche complète
window.Dons.estCasse(id)       true / false
window.Dons.estPorte(id)       le Don est-il équipé ?
window.Dons.jauge(id)          {nom, val, max, bloc}
window.Dons.facteur(id)        1 · 0.50 · 0
window.Dons.aLaForme(id,'avatar')   ('familier' accepté aussi)
window.Dons.estAvatar(id)      raccourci
window.Dons.traitDebloque(2)   'hiver' si l'Avatar est là
```

---

## 11. `AvatarSpirituel.js` **v3.0** — la créature qui agit seule

> *Anciennement `FamilierSpirituel.js`. Le fichier a été renommé, l'entrée de `plugins.js` aussi,
> et tous ses réglages ont été conservés.*

### 11.0 · 🔗 IL EST INSÉPARABLE — le lien de Dono

> *« Elle peut pas disparaître tant que l'utilisateur est vivant ou conscient. »*

L'Avatar n'est **pas un équipement**. C'est une part d'elle. Concrètement :

| Ce qui arrive | L'Avatar |
|---|---|
| Le joueur essaie de le déséquiper | **refusé** — le verrou du Don (§10.1) |
| Un autre héros essaie de le porter | **refusé**, et il n'apparaît même pas dans sa liste |
| « Tout retirer » / « Optimiser » | **il reste** |
| Son Endurance tombe à zéro (**brisé**) | **il reste** — il fatigue, un tour sur deux, tout ÷2 |
| **Korrah tombe** (0 PV) | **il s'éteint avec elle** |
| **Korrah perd conscience** (sommeil, étourdissement, paralysie) | **il s'éteint** le temps qu'elle revienne |
| Elle rouvre les yeux | **il est là** |

Techniquement : `consciente(a)` = vivante **et** `restriction() !== 4`. Le journal de combat
l'annonce **au changement d'état seulement**, jamais en boucle. Option `inseparable`.

### 11.0-bis · 📈 IL MONTE EN NIVEAU — et elle le tient de mieux en mieux

> *« Un avatar peut agir tout ou sous, mais c'est souvent indépendant de l'utilisateur. Plus la
> puissance augmente, plus l'utilisateur peut contrôler l'avatar. »*

**Trois niveaux**, qui montent avec Korrah :

| Avatar | Korrah | Contrôle | Ce qu'elle gagne |
|---|---|---|---|
| *(naissance)* | 1 → 24 | **AUTOMATIQUE** | une posture, rien de plus |
| **niveau 1 · l'Accord** | **25** | **SEMI-AUTOMATIQUE** | elle désigne la **cible** |
| **niveau 2 · la Conduite** | **50** | **SEMI-AUTO affermi** | elle choisit aussi le **geste** |
| **niveau 3 · l'Unisson** | **85** | **CONTRÔLE TOTAL** | tout son arsenal, sur tout le champ |

À chaque niveau, l'Avatar gagne :

- **+15 % de puissance** sur ses frappes *(appliqué sur la valeur des dégâts, pas sur les stats de
  Korrah — c'est son corps à lui qui s'affermit)* ;
- **+5 points d'interception** ;
- **deux nouvelles techniques**, qu'il joue tout seul en automatique (§5.6).

Seuils, puissance et interception sont des **paramètres de plugin** (`niveau1`/`2`/`3`,
`puissanceParNiveau`, `interceptParNiveau`) : si 25/50/85 ne te va pas, ça se change sans toucher
au code.

### 11.1 · Il joue son propre tour

Quand sa porteuse a fini d'agir, **l'Avatar agit**. Ce n'est pas une seconde action pour elle : c'est
**lui** qui frappe, avec ses compétences, son animation, sa cible. Elle ne dépense rien.

- palier 1-2 → il frappe une cible ;
- palier 3-4 → il alterne, et **déferle sur tout le groupe un tour sur deux** ;
- un seul ennemi → il ne déferle jamais, il cogne.

Sa cible : **celle que sa porteuse vient de frapper** (il finit le travail), sinon l'ennemi le plus
bas en PV.

### 11.2 · Il se met devant

Quand sa porteuse encaisse un coup, l'Avatar en prend une part — et c'est **son Endurance** qui la
paie. Protéger l'use : un Avatar qui a beaucoup gardé finit par se disloquer.

### 11.3 · 🆕 LES TROIS ORDRES — et on les donne **en plein combat**

La posture ne se réglait que par **commande d'événement**. Le joueur n'avait **aucune prise** sur la
seule créature autonome du jeu — c'était le trou de maniabilité le plus net du système.

Korrah connaît maintenant trois ordres, **dès le niveau 1**, sous **Spéciale** :

| ID | Compétence | Posture | Ce qu'il fait |
|---|---|---|---|
| **1246** | **Avatar — Laisse-le faire** | LIBRE | il frappe, intercepte 20 %, et bascule **tout seul** en protection sous 40 % de PV |
| **1247** | **Avatar — Assaut** | AGRESSIF | il frappe **toujours**, même si elle est au bord. Intercepte peu. |
| **1248** | **Avatar — Devant moi** | GARDE | il ne frappe plus du tout, et encaisse **45 %** de ce qui la vise |

**0 mana, 0 TP.** Et surtout : **le tour n'est pas perdu** — donner l'ordre le fait agir dans la
foulée. On paie une action, on obtient une action.

Toute compétence notée `<AvatarPosture: libre|agressif|garde>` se comporte ainsi. *(`assaut` est
accepté comme synonyme d'`agressif`.)*

### 11.3-bis · 🆕 LES ORDRES DIRIGÉS — la prise qui grandit

Une **posture** dit *comment* il se comporte. Un **ordre dirigé** dit *quoi faire, et sur qui*.
C'est là que se joue le « plus la puissance augmente, plus elle le contrôle » : chaque ordre n'est
appris qu'au niveau d'Avatar correspondant.

| ID | Compétence | Avatar niveau | Korrah | Ce qu'elle fait |
|---|---|---|---|---|
| **1255** | **Avatar — Vise ça** | 1 | **25** | elle **désigne la cible**, il enchaîne trois frappes |
| **1256** | **Avatar — Étau** | 2 | **50** | elle choisit la cible **et le geste** |
| **1257** | **Avatar — Unisson** | 3 | **85** | tout le champ, d'un seul mouvement |
| **1258** | **Avatar — Rends-le** | 3 | **85** | il rend le froid qu'elle lui a confié |

Notetag : `<AvatarOrdre: skillId>` — l'Avatar exécute **cette** technique sur la cible qu'**elle**
sélectionne dans le menu de combat. Le geste reste le sien : elle ne fait que le diriger.

Un ordre au-dessus de son niveau est **refusé proprement** (`<AvatarNiveau: n>`) : le jeu le dit,
et le tour n'est pas gaspillé.

> **Un ordre dirigé passe outre la posture de GARDE.** Même planté devant elle, si elle lui dit de
> frapper, il frappe. C'est exactement ça, le contrôle.

> **Un bug attrapé par le banc :** l'Avatar joue son action à la main, donc MV n'appliquait pas
> `numRepeats()` pour lui — « Poings Enchaînés » (3 coups) n'en aurait porté **qu'un seul**. La
> boucle de répétition est maintenant dans le plugin.

### 11.4 · Ce qu'il coûte — la contrepartie des 2 %

- Il occupe le **slot Âme**.
- Chacune de ses frappes **use l'Endurance du Don** : un Avatar actif brûle sa jauge **deux fois plus vite**.
- Chaque interception coûte **2** de plus.
- **Brisé**, il agit un tour sur deux et tout ce qu'il fait est ÷2. Il ne meurt pas : il fatigue.
- **Absent** du slot Âme, il n'existe pas — et le Trait HIVER non plus.

> ⚠️ **Il ne porte pas le Trait à la place de sa porteuse.** Les frappes de l'Avatar sont des frappes
> d'Avatar : elles n'ont pas l'élément GLACE et ne déclenchent pas le recul d'HIVER. Le froid reste
> le prix que Korrah paie elle-même — sinon l'Avatar serait la faille qui annule la règle d'or.

### 11.5 · Commandes et API

```
AVATAR posture 2 garde     change la posture
AVATAR agir 2              le fait agir (scénario)
AVATAR etat                résumé : niveau, contrôle, techniques, posture
FAMILIER …                 toujours accepté : les anciens événements marchent

window.Avatars.de(2)        {nom, posture, present, actif, brise, palier,
                             niveau, niveauNom, controle, prochainSeuil,
                             puissance, techniques, consciente, eteinte}
window.Avatars.niveau(2)        0 · 1 · 2 · 3
window.Avatars.consciente(2)    l'Avatar peut-il exister en ce moment ?
window.Avatars.posture(2,'garde')
window.Avatars.present(2)
window.Familiers                alias de window.Avatars
```

---

## 12. `ObjetSpirituel.js` **v3.0** — l'évolution en 4 paliers

Une chaîne par héros. **Plus de `manif`.**

```js
var CHAINS = {
    1: { don:{ forme:'objet',  slot:5, type:'armure', ids:[68,69,70,71] } },
    2: { don:{ forme:'avatar', slot:7, type:'armure', ids:[76,77,78,79] } },
    3: { don:{ forme:'objet',  slot:5, type:'armure', ids:[72,73,74,75] } },
    4: { don:{ forme:'arme',   slot:1, type:'arme',   ids:[513,514,515,516] } }
};
```

À la montée de niveau, la pièce du palier atteint est donnée et équipée, et **toutes les versions
inférieures sont purgées du sac**. L'évolution pose `window._DonInterne = true` le temps du
`changeEquip` — c'est ce qui lui permet de passer le verrou.

```
OBJET check     réévalue tout le groupe
OBJET rendre    restitue et rééquipe un Don perdu
```

---

## 13. `TraitsAme.js` — les Traits

Le registre gate `hiver` sur la présence de l'Avatar :

```js
hiver: { actor:2, nom:'Hiver', don:"l'Armure Volante — son Avatar Spirituel", parAvatar:true }
```

*(L'ancienne clé `parFamilier` est toujours reconnue.)*

---

## 14. Vérification — 8 bancs d'essai, 0 échec

Ils sont dans **`bancs/`**, lançables avec Node depuis la racine du projet
(`node bancs/6_avatar_niveaux.js`). Voir [`bancs/LISEZ-MOI.md`](../bancs/LISEZ-MOI.md).

| Banc | Ce qu'il contrôle | |
|---|---|---|
| `1_dons_spirituels.js` | endurance, jauges, casse, ÷2, bonus, repos | ✅ |
| `2_evolution_paliers.js` | les 4 paliers · **l'acier ne monte pas tout seul** | ✅ |
| `3_avatar_spirituel.js` | l'Avatar : tour, ciblage, interception, postures | ✅ |
| `4_un_seul_don.js` | **la règle d'or — 76 contrôles** | ✅ |
| `5_verrou_et_ordres.js` | **le verrou et les trois postures** | ✅ |
| **`6_avatar_niveaux.js`** | **les 3 niveaux, le contrôle croissant, l'inséparabilité** | ✅ |
| `audit/6_bestiaire.js` | le bestiaire | ✅ |
| `audit/7_nouveau_lot.js` | les compétences du lot | ✅ |
| `audit/8_tableau_de_chasse.js` | le Tableau de Chasse | ✅ |

Ce que `banc_don.js` vérifie, entre autres :

- **chacun des quatre héros n'a qu'UNE forme de Don** ;
- plus aucune pièce ne porte `<Manifestation>` ;
- chacun **démarre avec exactement un Don équipé** ;
- Vesper, Korrah et ludwing tiennent une arme **ordinaire** ;
- **aucune pièce ordinaire ne s'appelle « Éclat … »** ;
- les 12 armes 501-512 existent toujours, ont un prix, et n'ouvrent plus de type de compétence ;
- les **huit** types d'ombre ont une source (c'était 4 sur 8 avant) ;
- le Masque porte un effet à chaque palier, croissant ;
- les trois ordres sont gratuits, en combat, et connus de Korrah au niveau 1 ;
- chaque pièce de Don **nomme son porteur** (`<DonDe:>`).

Et `5_verrou_et_ordres.js` rejoue le vrai code des plugins sur un moteur simulé qui se comporte
comme MV (`changeEquip`, `clearEquipments`, `optimizeEquipments`) — c'est là que se vérifient le
refus de retirer, le refus de prêter, le passage de l'évolution, et les trois postures.

`6_avatar_niveaux.js` va plus loin encore : il simule un vrai `Game_Action` (cibles, répétitions,
dégâts) et vérifie, sur le code réel du plugin :

- les **trois seuils** 25 / 50 / 85, à la borne près (24 → niveau 0, 25 → niveau 1…) ;
- que le **mode de contrôle** suit le niveau ;
- qu'il **apprend deux techniques par niveau** (2 → 4 → 6 → 8), sans doublon ;
- que sa **puissance monte vraiment** — une frappe de référence à 100 en vaut 145 au niveau 3 ;
- **l'inséparabilité** : brisé il reste, inconsciente il s'éteint, relevée il revient, tombée il
  s'éteint ;
- que chaque **ordre dirigé** est refusé sous son niveau et exécuté au-dessus, sur la cible qu'elle
  désigne — et qu'il **passe outre la posture de garde** ;
- qu'aucune frappe de l'Avatar ne tombe à **0 dégât contre DÉF 900** (le palier du niveau 85).

---

## 15. Recettes

### 15.1 · Donner un Don à un nouveau personnage

1. Créer **4 pièces** (armes ou armures) dans le slot de la forme choisie.
2. Sur chacune : `<Don: cle>` · `<Forme: arme|objet|avatar>` · `<Palier: 1-4>` · `<DonDe: actorId>`.
3. Ajouter l'entrée dans `DONS` (`DonsSpirituels.js`) et dans `CHAINS` (`ObjetSpirituel.js`).
4. **Ne pas lui en donner un second.** C'est tout l'enjeu.

### 15.2 · Donner un Trait

Ajouter l'entrée dans `TRAITS` (`TraitsAme.js`). Si c'est un **Avatar** qui l'ouvre :
`parAvatar: true` côté plugin, `<TraitDebloque: cle>` sur les 4 pièces.

### 15.3 · Marquer une compétence

`<Trait: cle>` · `<Sang>` · `<Ombre>` · `<Avatar>` · `<AvatarPosture: libre|agressif|garde>`.

---

## 16. Table de correspondance — ce qui a changé de nom

| Avant | Maintenant |
|---|---|
| famille · familier | **AVATAR SPIRITUEL** |
| `FamilierSpirituel.js` | `AvatarSpirituel.js` |
| `window.Familiers` | `window.Avatars` *(l'alias reste)* |
| `FAMILIER posture …` | `AVATAR posture …` *(l'ancienne reste comprise)* |
| `<Forme: familier>` | `<Forme: avatar>` *(l'ancienne reste lue)* |
| `parFamilier: true` | `parAvatar: true` *(l'ancienne reste lue)* |
| `familierBonus` | `avatarBonus` *(l'ancien reste lu)* |
| `<Familier>` sur 469-471 | `<Avatar>` |
| « la Manifestation » | **rien — le concept est retiré** |
| thylane · neyssa · lou · tianna | vesper · korrah · ludwing · ael *(alias conservés)* |

---

## 17. Ce qui reste ouvert

1. **Les autres marqués du monde.** Le système gère les quatre héros ; les PNJ marqués n'ont pas
   encore de Don en base. Le registre est prêt à les recevoir (§15.1).
2. **L'apparition du Don n'est pas encore une scène.** Le code l'annonce dans le journal de combat
   la première fois — mais le canon dit que c'est un moment. Il mériterait son événement.
3. **La ligne d'armes 501-512 n'est vendue nulle part.** Elles ont un prix, plus aucune boutique ne
   les liste. Une ligne à ajouter dans le marchand de ton choix, ou en butin.
4. **Le Trait `change` de Korrah** est le seul des cinq qui n'a pas de mécanique propre écrite.
5. **Les seuils 25 / 50 / 85 dépassent la courbe d'apprentissage actuelle**, qui s'arrête au
   niveau 60. Le niveau 3 de l'Avatar n'est donc atteignable qu'en fin de partie très avancée —
   c'est cohérent avec « il faut de la puissance », mais si tu veux qu'on y arrive plus tôt, les
   trois seuils sont des paramètres de plugin.

---

*Dossier v3.0 — la règle d'or appliquée partout : **on n'a qu'un seul Don**.
Et pour Korrah, ce Don-là ne la quitte jamais : il s'éteint avec elle, et il revient avec elle.*
