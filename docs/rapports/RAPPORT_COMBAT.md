# ⚔️ RAPPORT DE COMBAT — audit, diagnostic, et ce qui a été construit

> **Ce qui a été fait :** tous les combats du jeu ont été passés au banc d'essai — 147 ennemis,
> 500 compétences, 180 troupes, 202 états, et les 165 plugins actifs. Chaque formule de dégâts a été
> **évaluée pour de vrai en JavaScript**, dans cinq situations de combat différentes. Ce rapport dit
> ce qui allait, ce qui n'allait pas, et ce qui a été corrigé et ajouté ensuite.

| | Avant | Après |
|---|---|---|
| **Ennemis** | 147 | **548** *(+401)* |
| **Compétences** | 500 | **736** *(+236)* |
| **Troupes** | 180 | **491** *(+311)* |
| **États** | 202 | **222** *(+20)* |
| **Bugs corrigés** | — | **68** |

---

# PARTIE I — LE DIAGNOSTIC

## 1. Ce qui allait déjà bien

Il faut le dire d'abord, parce que c'est la fondation sur laquelle tout le reste s'appuie.

- **Le cycle du mana est une vraie idée de design.** Négatif bat Âme bat Positif bat Négatif : c'est
  lisible, ça se retient, et ça donne une raison de changer de personnage en combat. Peu de projets
  RPG Maker ont un triangle aussi propre.
- **Les personnages ont chacun leur système**, pas juste des statistiques différentes : les Voies,
  les Paroles, les Traits, les Dons, les jauges mentales. Vesper ne se joue pas comme Korrah pour des
  raisons mécaniques, pas cosmétiques.
- **Les ultimes ont un prix.** 25 à 35 % de PV **plus** un état de contre-coup. C'est rare et c'est
  bien : un ultime qui coûte cher est un ultime qu'on choisit.
- **L'atlas d'animations 361-460** — 25 familles × 4 teintes — est un outil remarquable. Il permet
  d'habiller n'importe quel effet avec une grammaire de couleur cohérente, sans jamais repartir de
  zéro. Il était largement sous-utilisé.
- **1 821 sprites d'ennemis et 2 555 sprites SV** dans le projet… dont **101 utilisés**. Une réserve
  énorme, dormante.

## 2. Ce qui n'allait pas

### 🔴 2.1 · Le mur de DÉF — le problème de fond

C'est le plus grave, et il ne se voit pas dans l'éditeur.

La quasi-totalité des formules du projet sont en **soustraction sèche** :

```
a.atk * 4 - b.def * 2
```

RPG Maker évalue la formule puis fait `Math.max(résultat, 0)`. Donc dès que la DÉF de la cible
dépasse le double de l'ATQ du lanceur, le coup ne fait pas « peu » — **il ne fait rien. Zéro.**

Mesuré sur les 500 compétences d'origine, en évaluant chaque formule :

| Situation | Compétences qui tombent à **0** |
|---|---|
| Le lanceur est de bas niveau (ATQ/MAG 20) | **269** |
| La cible est blindée (DÉF/MDF 400) | **278** |

Concrètement, deux moments du jeu où ça se voit : le **début de partie** (l'équipe est faible, rien
ne décolle) et les **boss blindés** (toute l'équipe tape dans le vide sans comprendre pourquoi).
Et rien à l'écran ne l'explique au joueur.

### 🔴 2.2 · Deux compétences purement mortes

| ID | Nom | Formule | Le problème |
|---|---|---|---|
| **27** | Tirs en Rafale | `a.atk * 5 - b.def * 20` | `× 20` au lieu de `× 2` : **0 dégât même sur une cible ordinaire**. La compétence n'a jamais rien fait. |
| **37** | Rugissement | *(vide)* | Formule vide sur une compétence déclarée offensive. |

### 🟠 2.3 · 59 ennemis qui ne savent que frapper

59 ennemis n'avaient **qu'une seule action : « Attaque »**. Un combat contre eux ne contient aucune
décision — ni pour eux, ni pour le joueur. Ce sont surtout les ennemis du début, c'est-à-dire
exactement ceux qui donnent au joueur sa première impression du système de combat.

### 🟠 2.4 · Le cycle du mana n'était pas branché sur les ennemis

**111 ennemis sur 147 n'avaient aucune résistance élémentaire.** Le triangle Négatif/Âme/Positif —
la meilleure idée du système — ne s'appliquait donc pas à eux : frapper un Errant au mana négatif ne
donnait aucun avantage. Le cycle existait dans le codex, pas dans les combats.

**44 ennemis n'avaient même pas de `<Mana:>` déclaré** : ni aura visible, ni affinité, ni place dans
le cycle.

### 🟡 2.5 · Récompenses et butins

- **6 ennemis très puissants donnaient 0 exp et 0 or** — dont *Celui qui est Tombé* (66 360 de
  puissance). Le joueur gagne le combat le plus dur de sa vie et ne reçoit rien.
- **18 butins garantis à 100 %** : le Minotaure lâchait sa Potion Rouge à chaque fois.
- **2 ennemis avaient le même objet listé deux fois** — un des deux emplacements était perdu.

### 🟡 2.6 · Données cassées

- **23 noms d'ennemis en doublon** — « voleuse » ×3, « ombres » ×3, « Vesper, l'Errant » ×3. Dans le
  bestiaire et les combats, rien ne les distingue.
- **La troupe #14 « vampire » était VIDE** → combat impossible, le jeu se bloque.
- **La troupe #88 « Titan de Roche »** référençait l'ennemi 92, qui n'existe pas.
- **3 ennemis** avaient une action conditionnée au « tour 1 à 0 » — une condition qui ne peut
  jamais être vraie. L'action était morte.

### 🟠 2.7 · Le menu principal déborde

Le bug le plus visible, et il est là **maintenant**, à chaque ouverture du menu.

`Window_MenuCommand.numVisibleRows()` renvoie `maxItems()` : la fenêtre grandit pour tout afficher et
**ne défile jamais**. Et `Scene_Menu` place la fenêtre d'or en bas de l'écran, **par-dessus**.

```
8 commandes de base + 7 ajoutées par plugins   = 15 lignes
15 × 36 px + 36 px de cadre                    = 576 px
fenêtre d'or (72 px) collée en bas             = de 552 à 624 px
                              ┌──────────────────────────────┐
chevauchement                 │  24 px  ← la DERNIÈRE        │
                              │          commande est cachée │
                              └──────────────────────────────┘
```

Les 7 plugins concernés : `AmeStatusScene`, `LiensSocial`, `SuccesTitres`, `VisualMaxEX2`,
`TriangleAffinites`, `GuideVoiesParoles`, `GrimoireHub`. **Au 17ᵉ ajout, les commandes du bas
deviendraient carrément inatteignables.**

### 🟡 2.8 · Points de vigilance (non corrigés — signalés)

- **89 plugins** aliasent `Game_Interpreter.pluginCommand` — c'est normal en MV, mais ça veut dire
  qu'une erreur dans un seul plugin peut casser les commandes de tous les suivants.
- **25 plugins** redéfinissent `Game_Action.apply`, **20** `executeDamage`, **18**
  `makeDamageValue`. L'ordre de chargement devient critique et n'est documenté nulle part de façon
  exhaustive.
- **165 plugins actifs sur 193.** C'est beaucoup. Chaque plugin inactif reste chargé en mémoire.

---

# PARTIE II — CE QUI A ÉTÉ CONSTRUIT

## 3. Le bestiaire — 401 nouveaux ennemis

### 3.1 · Le principe : 18 familles, chacune avec une identité mécanique

Pas 401 blocs de statistiques. **18 familles**, chacune répondant à une question de combat
différente, déclinées sur les 5 rangs (D → S), 4 ennemis par rang.

| Famille | Source | Ce qu'elle fait au joueur |
|---|---|---|
| 🐺 **La Meute** | Corps | Chasse en groupe. Quand l'une tombe, les autres **entrent en rage**. |
| 🩸 **Les Écorchés** | Corps | Se **soignent en te frappant**. Les laisser vivre, c'est les nourrir. |
| 🔥 **Les Fauves de Cendre** | Corps | Ne frappent pas fort : ils **allument**. Ce qui brûle s'aggrave tout seul. |
| ⚔️ **La Horde Vultric** | Corps | Discipline militaire : **buffs de groupe, formations, ordres**. Casser la ligne avant qu'elle ne tienne. |
| 👻 **Les Errants** | Âme | **Reviennent une fois** (état ♻ Reprise). Les tuer ne suffit pas. |
| 🕳️ **Les Mangeurs d'Âmes** | Âme | **Volent PM et statistiques**. Plus le combat dure, plus ils sont forts. |
| 🎭 **Les Masques** | Esprit | **Copient** et **renvoient**. Frapper fort, c'est se frapper fort. |
| 🎵 **Le Chœur** | Esprit | Force proportionnelle **au nombre de survivants**. En tuer une affaiblit les autres. |
| 📜 **Les Scribes** | Esprit | **Effacent tes buffs**, scellent la magie. Le contre des équipes qui se préparent. |
| 🪞 **Les Miroirs** | Esprit | **Renvoient les dégâts**. Il faut trouver l'angle. |
| ⭐ **Les Astres Éteints** | Esprit | Soignent, protègent, **prédisent**. Il faut les tuer en premier. |
| 🗿 **Les Titans** | Corps | Lents, énormes, et **annoncent tout ce qu'ils font**. |
| 🪙 **Les Ors** | Corps | Blindés. **Pas de faiblesse apparente — il faut la créer** (🔩 Blindage Fissuré). |
| 💀 **Les Tombés** | Âme | Les marqués corrompus. Frappent **plus fort quand ils sont blessés**. |
| ⛓️ **Les Glitchs** | Pur | Viennent du Fond. **Ignorent le cycle**, cassent les règles. |
| ⚙️ **Les Automates** | Esprit | **Se réparent**, surchauffent, puis **purgent**. Une course contre la montre. |
| 🐜 **Les Insectes** | Corps | Le nombre, le poison, la reine qui **pond des renforts**. |
| 🐁 **Les Petits** | Corps | Le début du jeu — mais ils ont quand même des idées. |

### 3.2 · Les 41 boss

Chacun est construit sur les principes du design de boss moderne — **télégraphier, phaser, laisser
une fenêtre de riposte** :

**① Le télégraphe.** Tous les 4 tours, le boss passe en **⚡ Charge**. Un message dit exactement ce
qui arrive et que le boss est à découvert. Sa DÉF chute de 30 % pendant ce tour.

**② Le coup annoncé.** Il ne sort **que** si le boss est en ⚡ Charge — condition d'action sur l'état,
pas sur le hasard. Le joueur qui a lu le message sait quoi faire.

**③ La fenêtre de riposte.** Après le coup, le boss passe en **✷ Surcharge** : DÉF et MDF à 40 %,
+60 % de dégâts reçus, +50 % de critiques contre lui. **C'est maintenant qu'il faut frapper.**
Le joueur est récompensé pour avoir encaissé.

**④ Trois phases** par événement de troupe :

| Seuil | Ce qui se passe |
|---|---|
| **Entrée** | Réplique du boss + animation. Il annonce ce qu'il est. |
| **60 % de PV** | **Phase II** : il se referme (🛡 Posture de Fer) et resserre les rangs. |
| **25 % de PV** | **Phase III** : il lâche la garde et entre en 💢 Rage. Plus rien ne le retient. |

Quelques-uns, pour donner le ton :

- **Gargal, le Premier Croc** — *« Il ne grogne pas. Il attend que tu bouges en premier. »*
- **Fournaise, la gueule qui ne se ferme pas** — la mèche est allumée : **compte les tours**.
- **Le Grand Immobile** — *« Il lève le bras. Il prend son temps. Tu as un tour. Un seul. »*
- **Ton Visage, le masque qui a réussi** — il apprend en te regardant, et n'a pas tes hésitations.
- **Reprise 21** — *« Tu as déjà fait ce combat. Vingt fois. Il s'en souvient mieux que toi. »*
- **Le Compteur** — il annonce un nombre. Le nombre descend.
- **Thanatos** — *« Il n'a rien contre toi. C'est bien ça le problème. »*

### 3.3 · Les 20 nouveaux états — la boîte à outils

`⚡ Charge` · `✷ Surcharge` · `🛡 Posture de Fer` · `💢 Rage de Meute` · `🩸 Hémorragie Profonde` ·
`❄ Engourdissement` · `🔇 Silence Runique` · `👁 Marqué` · `♻ Reprise` · `🪞 Reflet` · `⛓ Ancrage` ·
`🌑 Éclipse` · `🔩 Blindage Fissuré` · `☠ Compte à Rebours` · `🔥 Combustion` · `🌀 Vertige` ·
`⚖ Verdict` · `🫀 Ravage` · `✨ Grâce Volée` · `🐺 Instinct de Meute`

Les deux qui portent tout le design de boss sont **⚡ Charge** (le télégraphe) et **✷ Surcharge**
(la fenêtre de riposte).

### 3.4 · Les 236 nouvelles compétences

**Toutes en formule ratio** — c'est la réponse directe au problème du §2.1 :

```
Math.floor(a.atk * K * 200 / (200 + b.def))
```

Une DÉF énorme **divise** les dégâts. Elle ne les efface plus. Vérifié par le banc d'essai :
**aucune des 236 ne tombe à 0**, même contre une cible à DÉF 600, même lancée par un personnage
faible.

Chacune porte un nom et une description écrits, pas générés : *« Elle vise les jambes. C'est toujours
par là que ça commence. »*, *« Il te dit ce que tu sais déjà, et ça te coupe les jambes. »*

### 3.5 · Les 311 nouvelles troupes

- **270 troupes de rencontre** : chaque famille × chaque rang × trois formations
  (*patrouille* 2, *groupe* 3, *nuée* 4).
- **41 troupes de boss**, chacune avec ses 4 pages d'événement.

---

## 4. Les 68 corrections

| Catégorie | Nombre | Ce qui a été fait |
|---|---|---|
| **Doublons de noms** | 24 | Numérotés (« voleuse », « voleuse II », « voleuse III »). |
| **Butins** | 20 | 100 % → 1 chance sur 3 (consommables) ou sur 8 (équipement) ; doublons retirés. |
| **Récompenses** | 12 | Les 6 ennemis à 0 exp / 0 or reçoivent une récompense calculée sur leur puissance. |
| **Cycle du mana** | 3 lots | **155 ennemis** reçoivent leurs résistances ; **44** reçoivent un `<Mana:>` déduit de l'élément qu'ils emploient le plus. |
| **Actions mortes** | 3 | Conditions « tour 1..0 » réparées. |
| **Formules** | 2 | #27 passée en ratio, #37 déclarée sans dégâts. |
| **Troupes** | 2 | La troupe vide et la troupe cassée réparées. |
| **Ennemis monotones** | 59 | Chacun reçoit **3 actions supplémentaires**, choisies d'après ce qu'il est — bête, mort-vivant, soldat, esprit, titan, insecte… — dont une conditionnée à ses PV bas. |

---

## 5. Les deux nouveaux plugins

### 5.1 · `PlancherDegats.js` — la réponse au mur de DÉF

Le vrai problème (§2.1) touche **278 formules réglées à la main**. Les réécrire aurait détruit
l'équilibrage existant. Le plugin fait autrement :

> **Un coup qui touche, et qui n'est pas annulé par une immunité, fait au minimum 8 % de la
> statistique de son lanceur.**

Ce qui continue de fonctionner exactement comme avant : l'esquive, le ratage, **les immunités
élémentaires** (taux 0 → toujours rien : une immunité doit rester une immunité), les absorptions,
les soins, et toute formule qui produit déjà un résultat positif.

Une DÉF de 400 reste une excellente défense — elle divise les dégâts par dix. **Elle ne les efface
plus.** Désactivable par compétence ou par cible avec `<SansPlancher>`.

### 5.2 · `MenuClair.js` — la réponse au menu qui déborde

Il borne la hauteur de la liste à la place réellement disponible au-dessus de la fenêtre d'or.
Au-delà, MV fait ce qu'il sait déjà faire : **la liste défile**.

```
avant :  576 px de menu · fenêtre d'or à 552 px  →  24 px de chevauchement
après :  540 px de menu · fenêtre d'or à 552 px  →   0 px, et la 15e commande est atteignable
```

Option `deuxColonnes` pour étaler la liste plutôt que la faire défiler. Le plugin ne touche qu'à la
**géométrie** : les commandes, leurs handlers et leur ordre restent exactement tels que les autres
plugins les ont posés.

---

## 6. Vérification

Tout a été testé sur banc d'essai, pas seulement écrit.

| Banc | Contrôles | Ce qu'il vérifie |
|---|---|---|
| `audit.py` | 26 familles de contrôles | Actions mortes, formules, animations, états, butins, troupes, récompenses, notes de lore |
| `formules.js` | 736 formules × 5 situations | Évaluation **réelle en JavaScript** : erreurs, NaN, dégâts nuls, démesure |
| `combat.js` | 24 contrôles | Le bestiaire complet : jouabilité, sprites, animations, télégraphes de boss, phases, cycle, courbe de progression |

**Résultats du dernier passage :**

- ✅ 401 ennemis créés, **0 doublon**, **0 action cassée**, **0 animation manquante**,
  **0 sprite manquant**, **0 statistique nulle**
- ✅ **0 compétence du nouveau bestiaire ne tombe à 0**, même contre DÉF 600
- ✅ Les **41 boss** télégraphient, leur coup lourd ne sort que sous ⚡ Charge, et les laisse en
  ✷ Surcharge
- ✅ Les **164 pages d'événement** de boss sont valides et pointent sur des états et animations réels
- ✅ **0 ennemi** sans `<Mana:>`, **0 ennemi** hors-cycle sans résistance, **0 ennemi** qui ne sait
  que frapper *(avant : 44, 111, 59)*
- ✅ La courbe monte proprement : D 122-279 PV · C 476-1085 · B 1632-3720 · A 4760-10850 ·
  S 11560-26350 · boss 52000+

**Un point de lore vérifié plutôt que corrigé :** 29 êtres de **Mana Pur** n'ont aucune résistance
sur le triangle du cycle. Ce n'est pas un oubli — le canon (§4) dit que le Mana Pur **transcende le
cycle**. Le banc d'essai a été corrigé, pas les données.

---

## 7. Ce qui reste ouvert

1. **Les 270 troupes de rencontre ne sont branchées sur aucune carte.** Elles existent et
   fonctionnent, mais il faut décider **où** chaque famille apparaît. C'est un choix de level design,
   pas de données — je ne l'ai pas pris à ta place.
2. **Les 41 boss n'ont pas de place dans le scénario.** Mêmes raisons.
3. **Les 278 anciennes formules** restent en soustraction sèche. Le plancher les rend jouables ; les
   convertir en ratio serait plus propre, mais casserait un équilibrage fait à la main. À décider.
4. **L'ordre de chargement des 165 plugins actifs** mériterait un document exhaustif — 25 plugins
   redéfinissent `Game_Action.apply` et l'ordre entre eux n'est écrit nulle part.
5. **Les nouveaux ennemis n'ont pas d'entrée de bestiaire rédigée** au-delà de leur `<Desc:>`. Le
   plugin `BestiaireAmes` pourrait les lire.

---

*Audit et construction vérifiés sur trois bancs d'essai automatisés. Sources d'inspiration pour le
design de boss : [itch.io — Designing the Perfect Boss Battle](https://itch.io/blog/1022703/designing-the-perfect-boss-battle-a-deep-dive-into-crafting-memorable-moments),
[GDKeys — Anatomy of an Attack](https://gdkeys.com/keys-to-combat-design-1-anatomy-of-an-attack/),
[Chaotic Stupid — Enemy Attacks and Telegraphing](http://www.chaoticstupid.com/enemy-attacks-and-telegraphing/).*
