# 🌌 SYSTÈME DE MANA — BIBLE DU JEU
### RPG Maker MV · Guide complet des Énergies, Sources, Éléments & Affinités
> Version remodelée & cohérente — intègre l'ancien guide (les 8 éléments, Âme vs Esprit, classes) avec la nouvelle théorie des **3 Sources Primordiales**.

---

## 0. RÉSUMÉ EN UNE PHRASE
> Tout être est un **triptyque — Corps, Âme, Esprit**. Chacun est un **puits de magie primordial** quasi impossible à puiser directement, alors les civilisations ont creusé des **branches secondaires** plus maniables (Négatif, Spirituelle, Positif), à partir desquelles naissent les **sorts, capacités et éléments**. Au sommet, transcendant tout : le **Mana Pur**.

---

## 1. LA TRINITÉ — LES 3 SOURCES PRIMORDIALES

Au commencement, il n'existe pas « de la magie » mais **trois puits de réalité**, un par facette de l'être vivant. Ce sont des **sources primordiales** : immenses, brutes, presque impossibles à utiliser directement. Un joueur peut avoir **plus d'affinité** avec l'une d'elles selon la nature de son **âme**.

| Facette | Source primordiale | Élément (ID jeu) | Nature | Couleur |
|---|---|---|---|---|
| **LE CORPS** | **Mana Sombre** | 5 · `Mana Sombre` | Manifestation physique de **toutes les émotions et désirs enfouis**. Puissance brute et dévastatrice. | ⬛ Noir |
| **L'ÂME** | **Âme / Mana Spirituelle** | 2 · `mana spirituelle` | L'**essence immortelle** de l'être. Énergie produite directement par l'âme. | 🟥 Cramoisi |
| **L'ESPRIT** | **Mana Originel** | 6 · `Mana Originel` | Le **mental & la santé mentale** convertis en énergie créatrice. | 🟦 Cyan |

> ⚠️ **Pourquoi des branches secondaires ?**
> Puiser une source primordiale **directement** revient à plonger les mains dans un soleil. C'est mortel pour la quasi-totalité des joueurs. Pour rendre la magie **utilisable**, les peuples ont « domestiqué » chaque source en une **branche secondaire** plus douce et plus stable.

---

## 2. LES 3 BRANCHES SECONDAIRES (la magie « utilisable »)

Chaque source primordiale a été raffinée par une civilisation en une branche secondaire. **C'est là que naissent les vrais sorts, capacités et éléments.**

### 🟪 MANA NÉGATIF — la branche du **Corps** (ID 4 · `mana négative`)
- **Origine** : l'**Empire Vultric**, fondé par un joueur. Ils ont démontré que le Mana Sombre, longtemps cru **purement maléfique**, est en réalité un **concept fondamental** de la réalité.
- **Principe** : transformer ses **émotions et ses pensées sombres** en **puissance physique extraordinaire**.
- **Force** : capacités physiques surhumaines, dégâts bruts.
- **Contrepartie** : **inflige des blessures à l'utilisateur** et **draine ses PV**. Plus on frôle ses émotions les plus noires, plus on devient fort — au prix de son corps.

### 🟥 MANA SPIRITUELLE — la branche de l'**Âme** (ID 2)
- **Origine** : aussi ancienne que les âmes elles-mêmes. **Tout le monde peut l'apprendre** avec le temps.
- **Principe** : manipuler l'énergie produite par l'âme. Sa **forme et sa nature changent selon l'âme** de chacun (deux personnes n'ont jamais le même Mana Spirituel).
- **Utilisée par** : **Invocateurs**, **Nécromanciens**, et **Lou**, pour **manipuler les âmes**.
- **Contrepartie** : communiquer avec les âmes et jouer avec leur énergie est **extrêmement dangereux**, même pour les plus talentueux → **traumas et cauchemars** des âmes contactées.

### 🟦 MANA POSITIF — la branche de l'**Esprit** (ID 3 · `mana positive`)
- **Origine** : le **Culte des Sorcières des Étoiles**, fondé par une **joueuse**. Ce sont **les femmes** qui ont créé les sorts purement positifs.
- **Principe** : énergie liée à l'**intelligence**, aux **soins**, à l'**eau** et au **cosmos**.
- **Force** : la plus **polyvalente** ; facile à modifier et adapter.
- **Contrepartie** : de **plus en plus faible** quand la **santé mentale** du joueur décline (l'esprit fatigué produit moins de Mana Originel à raffiner).

> 📝 **Note de lore** : Mana Originel (primordial) ≈ le **potentiel mental brut** ; Mana Positif (secondaire) ≈ sa version **canalisée et bienveillante**. De même, Mana Sombre (brut, corps) ↔ Mana Négatif (canalisé). L'Âme/Spirituelle est particulière : sa branche secondaire porte presque le même nom car l'âme se laisse moins « domestiquer » — on travaille presque la source brute.

---

## 3. LE CYCLE DES AVANTAGES (style Pokémon)

Les trois branches secondaires forment un **pierre-feuille-ciseaux** :

```
        ┌──────────────────────────────┐
        ▼                              │
   MANA NÉGATIF  ──bat──►  ÂME / SPIRITUELLE  ──bat──►  MANA POSITIF
   (Corps)                  (Âme)                        (Esprit)
        ▲                                                   │
        └───────────────────bat─────────────────────────────┘
```

- **Mana Négatif > Âme/Spirituelle** : la fureur du corps brise les âmes fragiles.
- **Âme/Spirituelle > Mana Positif** : l'essence pure transperce les barrières de l'esprit.
- **Mana Positif > Mana Négatif** : la lumière de l'esprit apaise et contre la rage du corps.

> ⚖️ **Règle de combat** : frapper avec la branche **avantagée** inflige **×1.5 dégâts** ; frapper avec la branche **désavantagée** inflige **×0.5**. (Réglable dans les éléments de la base de données.)

### 👑 LE MANA PUR — au-dessus de tout (ID 7 · `Mana Parfait`)
Le **Mana Pur** transcende le cycle : il **ignore** les avantages/faiblesses des trois branches et des éléments. C'est l'énergie des **attaques magiques spéciales** des êtres transcendants.
- **Sous-branche ultra-rare : le MANA SEMI-PARFAIT** (skill type 7 dans ton jeu).
  - **1 chance sur 1000** : naître avec une affinité pour **toutes les sources** à la fois.
  - **Risque** : son usage **défie la réalité** elle-même (instabilité, conséquences imprévisibles).

---

## 4. LES 8 ÉLÉMENTS PHYSIQUES (la couche tactique)

Les éléments ne sont **pas naturellement utilisables** : ce sont des **formes** que l'on apprend à donner au mana. Ils constituent la couche tactique du combat, **indépendante** du cycle Négatif/Âme/Positif, mais **amplifiable** par certains manas. Le **Mana Pur** transcende les affinités élémentaires.

| Élément (ID jeu) | Faiblesse | Rôle | Amplifié par | Lié à la source |
|---|---|---|---|---|
| 🔴 **FEU** (8) | EAU | Attaque directe, brûlure continue | Mana Négatif | Corps |
| 🔵 **EAU** (9) | FOUDRE | Soin, ralentissement | Mana Positif | Esprit |
| 🟢 **VENT** (10) | GLACE | Vitesse, évasion, dégâts de zone | Mana Originel | Esprit |
| 🟤 **TERRE** (11) | VENT | Défense, écrasement | Résistance physique | Corps |
| 🟡 **FOUDRE** (12) | TERRE | Paralysie, dégâts techniques | INT (Mana Positif) | Esprit |
| 🧊 **GLACE** (13) | FEU | Gel, ralenti, armure | Précision mentale | Esprit |
| ⬜ **LUMIÈRE** (14) | OMBRE | Purification, guérison d'âme | Mana Pur | Âme |
| 🟣 **OMBRE** (15) | LUMIÈRE | Silence, peur, corruption | Mana Sombre | Corps |

### La Roue des Éléments (faiblesses)
```
FEU ─► EAU ─► FOUDRE ─► TERRE ─► VENT ─► GLACE ─► FEU
(chaque élément est faible contre le suivant)

OMBRE ◄──► LUMIÈRE   (s'opposent mutuellement)
```

### Combinaisons ÉLÉMENT + MANA (sorts signature)
| Combinaison | Sort | Effet |
|---|---|---|
| **Feu + Mana Négatif** | *Flammes Maudites* | Dégâts ×1.5, la brûlure **ignore la résistance au feu** |
| **Eau + Mana Positif** | *Vague Sacrée* | Soin de zone + **bouclier cosmique** pour tous les alliés |
| **Ombre + Mana Sombre** | *Puits d'Abîme* | Réduit à **0** la résistance magique ennemie pendant 2 tours |
| **Lumière + Mana Pur** | *Nova Sainte* | Purifie la corruption d'âme + dégâts massifs **non-élémentaux** |
| **Foudre + Mana Originel** | *Arc Créatif* | Le joueur **définit librement** la forme du sort au lancement |
| **Terre + Mana Spirituel** | *Forteresse d'Âme* | Crée un bouclier lié directement aux **PV de l'Objet Spirituel** |

---

## 5. ÂME vs ESPRIT — différences fondamentales

| | **ÂME** | **ESPRIT** |
|---|---|---|
| Nature | Essence spirituelle et **immortelle** | Dimension **mentale et intellectuelle** |
| Destructibilité | **Ne peut jamais être détruite** — elle retourne dans les **codes sources** du jeu | Peut être **fragilisé, brisé, ou guéri** selon la Santé Mentale (SAN) |
| Énergie produite | **Mana Spirituelle** | **Mana Originel** |
| Représentation | l'**Objet Spirituel** en surface | la **barre de Santé Mentale (SAN)** |
| Affinités | Invocateurs, nécromanciens | Mages créateurs, stratèges |
| Dégradation | **Corruption → perte de personnage permanente** | **Traumatisme → réduction du Mana Originel disponible** |

> 💡 **Le retour des âmes** : une âme peut être **absorbée, manipulée, changée, scellée**… mais **jamais réellement détruite**. Elle retourne dans les codes sources. **Seuls les joueurs non corrompus** peuvent revenir via les **sauvegardes**. Une âme corrompue, elle, ne revient **jamais vraiment**.

---

## 6. L'OBJET SPIRITUEL

L'arme/objet que le joueur reçoit **au début du jeu**.
- C'est la **manifestation physique de son âme en surface**.
- Il **évolue avec le joueur** : directement relié à son **niveau** et à son **âme**.
- Peut être un **objet, une arme ou une armure**.

**Image de l'âme = une coquille :**
- **La surface** : ce qui peut être **touché et matérialisé** physiquement → l'Objet Spirituel.
- **Les profondeurs** : là où résident les **capacités spéciales**, la **nature** de l'âme et ses **traits**.

---

## 7. AFFINITÉS — comment un joueur se connecte aux sources

L'affinité dépend de la **nature de l'âme**. Elle détermine la **puissance** et la **facilité** dans chaque branche :

- **Plus d'affinité** avec une source → plus **puissant** et plus **à l'aise** dans sa branche secondaire… mais **des difficultés** dans les autres branches.
- L'affinité **n'est pas figée** : elle peut **changer au fil des décisions** prises dans la vie du personnage (lien direct avec le système de **Santé Mentale de l'Âme**).

**Distribution des affinités dans la population :**
| Cas | Fréquence | Description |
|---|---|---|
| **Une source** | Courant | La majorité : prédisposition claire à un puits. |
| **Aucune source** | Rare | Doit tout apprendre « à la dure », aucun bonus naturel. |
| **Deux sources** | Peu courant | Polyvalence, deux branches accessibles. |
| **Toutes les sources** | **1 / 1000** | Accès au **Mana Semi-Parfait** — au risque de **défier la réalité**. |

---

## 8. CLASSES & AFFINITÉS DE MANA

| Classe | Affinité dominante | Spécialité |
|---|---|---|
| **Mage des Étoiles** | Mana Positif + Eau/Cosmos | Guérison cosmique, prédiction, protection |
| **Nécromancien** | Mana Spirituelle + Ombre | Manipulation d'âmes, résurrection corrompue |
| **Berserker Arcanique** | Mana Négatif + Feu | Dégâts bruts, auto-destruction maîtrisée |
| **Invocateur** | Mana Spirituelle + Terre/Vent | Création d'entités, lien avec les âmes |
| **Ombremancien** | Mana Sombre + Ombre | Corruption, manipulation psychique, abîme |
| **Artiste Arcanique** | Mana Originel + Tout élément | Sorts libres, adaptation en combat |
| **Élu / Transcendant** | Mana Pur + Multi-éléments | **Classe finale**, accès aux pouvoirs absolus |
| **Lou** *(personnage)* | Mana Spirituelle + Originel | Manipulation d'âmes — **traumatismes intenses** |

---

## 9. HISTOIRE — les grands tournants de la magie

1. **L'Ère des Sources Brutes** : les premiers joueurs ne pouvaient toucher que les puits primordiaux. La plupart en mouraient. La magie était rare, terrifiante, presque mythique.
2. **Le Culte des Sorcières des Étoiles** *(fondé par une joueuse)* : domestication de l'Esprit en **Mana Positif**. Naissance des **soins**, de l'**eau** et des sorts **cosmiques**. La magie devient enseignable.
3. **L'Empire Vultric** *(fondé par un joueur)* : réhabilitation du **Mana Sombre**, longtemps cru maléfique. Création du **Mana Négatif** — la force par les émotions. La guerre change de visage.
4. **Les Nécromanciens & Invocateurs** : maîtrise progressive de la **Mana Spirituelle**, au prix de traumas. On apprend à parler aux âmes.
5. **L'Éveil du Mana Pur** : l'apparition des premiers **Transcendants**, et la légende du **Mana Semi-Parfait** (1/1000) qui défie la réalité.

---

## 10. EXEMPLES CONCRETS (pour comprendre vite)

- **Une berserker au Mana Négatif** lance *Flammes Maudites* sur une nécromancienne (Âme) → **avantage du cycle (×1.5)** : la rage du corps brise l'âme fragile. Mais elle **perd des PV** à chaque coup.
- **Une Sorcière des Étoiles (Mana Positif)** affronte cette même berserker → **avantage (×1.5)** : la lumière de l'esprit apaise la rage. Sauf que si la Sorcière a une **mauvaise SAN**, son Mana Positif s'**affaiblit**.
- **Lou (Mana Spirituelle)** absorbe une âme ennemie → il se renforce, mais **récolte le trauma** de l'âme (cf. *LouCopySystem* : aspiration → soin + risque de Trauma).
- **Un Élu** lance *Nova Sainte* (Lumière + Mana Pur) → **ignore toutes les résistances** et purifie la corruption : aucun cycle ne le contre.
- **Un joueur sans affinité** doit choisir une branche et l'apprendre lentement, sans bonus — mais sans malus de corruption non plus.

---

## 11. CORRESPONDANCE AVEC TA BASE DE DONNÉES (RPG Maker MV)

**Éléments (`System.json`)** — déjà en place, à utiliser tels quels :
| ID | Nom en base | Rôle dans le lore |
|---|---|---|
| 1 | Physique | attaques d'arme / Objet Spirituel |
| 2 | mana spirituelle | **Âme** (source) |
| 3 | mana positive | branche **Esprit** |
| 4 | mana négative | branche **Corps** |
| 5 | Mana Sombre | **Corps** (source brute) |
| 6 | Mana Originel | **Esprit** (source brute) |
| 7 | Mana Parfait | **Mana Pur** |
| 8–15 | FEU…OMBRE | les 8 éléments physiques |

**Réglage du cycle (à faire dans Base de données ▸ Types ▸ Éléments, onglet des traits d'ennemis/armures, OU via un plugin d'affinités) :**
- mana négative **fort** contre mana spirituelle → résistance cible **200 %**
- mana spirituelle **fort** contre mana positive → **200 %**
- mana positive **fort** contre mana négative → **200 %**
- branche désavantagée → **50 %**
- Mana Parfait → **100 %** partout (jamais réduit, jamais augmenté)

**Skill Types utiles déjà présents** : `9 · ame`, `10 · sang`, `7 · MANA semi-parfait`, `19 · Arts Sereins`.

---

> *« Au centre de tout se trouve l'Âme — unique, immortelle, et seul vrai reflet du joueur dans ce monde. Protège-la. Car si le corps peut guérir, une âme corrompue ne revient jamais vraiment. »*
