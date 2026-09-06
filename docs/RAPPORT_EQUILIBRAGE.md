# ⚖️ RAPPORT D'ÉQUILIBRAGE — ce que tu as fait, ce qui tenait, ce qui ne tenait pas

> **Ce qui a été fait :** tout le contenu *joueur* que tu as créé a été mesuré — 462 compétences,
> 516 armes, 290 armures, 100 objets, 206 états, 4 classes. Chaque formule a été évaluée en
> JavaScript sur un héros de référence (niveau 35, ATQ/MAG 180) contre une cible de son rang, puis
> contre un boss.
>
> **Règle que je me suis fixée :** je n'ai corrigé que ce que j'ai pu **vérifier comme atteignable
> par le joueur** et **cassé au sens strict**. Tout ce qui est un choix de design — même déséquilibré
> en apparence — est signalé, pas touché. C'est ton jeu.
>
> *(Les ennemis sont traités à part, dans [`RAPPORT_COMBAT.md`](RAPPORT_COMBAT.md).)*

---

## 1. Ce qui tenait déjà

- **Les 7 paliers d'armes montent régulièrement**, pour les 13 types. Dague, Épée, Hache, Arc,
  Pistolet, Fouet… la courbe est propre du palier 1 au palier 7. C'est du travail de fond, et il est
  bon.
- **Les armures aussi** — Tête, Corps, Accessoire, Âme : chaque ligne monte de façon régulière.
- **Les armes « hors-progression »** (Fléau-Nocturne ATQ 100, Fusil Tueur de Dieu ATQ 90, L'Empereur
  ATQ 80) dépassent le palier 7/7 — mais elles sont toutes **à prix 0**, donc non achetables. Ce sont
  des récompenses. C'est exactement comme ça qu'il faut faire.
- **Les ultimes ont un vrai prix** : 25 à 35 % des PV **plus** un état de contre-coup.
- **`#77 Aube Partagée`** était la seule potion de groupe correctement réglée — elle a servi de
  référence pour corriger les autres.

---

## 2. Ce qui ne tenait pas — et qui est corrigé

### 🔴 2.1 · La boutique entière était décorative

C'est le problème le plus grave du côté joueur, et le plus invisible.

La **Potion Rouge** (500 PV pour 50 or) rendait **10 points de vie par pièce d'or**. Et **tous** les
objets plus chers rendaient **moins** :

| Objet | Prix | Soin | Rendement |
|---|---|---|---|
| **Potion Rouge** | 50 or | 500 PV | **10,0 PV/or** |
| Potion Supérieure | 300 or | 800 PV | 2,7 PV/or |
| Méga Potion | 800 or | 2 000 PV | 2,5 PV/or |
| Potion de Groupe | 2 500 or | 1 000 PV ×4 | 1,6 PV/or |
| Élixir | 4 000 or | tout PV + PM | 2,3 PV/or |
| **Élixir Suprême** | 9 000 or | + 100 TP | **1,5 PV/or** |

Conséquence : un joueur qui compte n'achète **que** des Potions Rouges, du début à la fin. Les
dix-huit autres objets de soin n'ont aucune raison d'exister. Tout l'or gagné n'a plus de sortie.

**Corrigé, au scalpel — huit objets, pas un rouleau compresseur.** J'ai monté la *puissance* des
potions plutôt que cassé tes prix, pour ne pas toucher à ton économie d'or :

| Objet | Avant | Après |
|---|---|---|
| **#11 Potion Supérieure** | 800 PV / 300 or | **2 400 PV** / 300 or |
| **#12 Méga Potion** | 2 000 PV / 800 or | **5 600 PV** / 800 or |
| **#14 Potion de Groupe** | 1 000 PV ×4 / 2 500 or | **3 000 PV ×4** / 2 500 or |
| **#59 Sève Vivifiante** | 1 500 PV ×4 / 3 000 or | **2 400 PV ×4** / **1 400 or** |
| **#22 Élixir** | 4 000 or | **3 000 or** |
| **#23 Élixir Suprême** | 9 000 or | **4 500 or** |

**#79 Écho de Repos** était le cas le plus net : un soin **plat de 99 999 PV** — donc un soin
total — pour 3 000 or, alors que la **Potion Divine** fait déjà 100 % des PV pour 2 000 or.
Il était *strictement moins bon qu'un objet moins cher*. Ramené à **1 200 or**, il devient le soin
total « à plat », utile quand les PV max sont bas, sous la Potion Divine qui, elle, monte avec le
personnage.

**#9 Lait du Ranch** (200 PV) et **#10 Bière** (60 PV) étaient à **prix 0**. Si une boutique les
liste, c'est du soin illimité. Prix posé à 20 or.

**#8 Plat Douteux** (1 PV pour 20 or) est laissé tel quel : c'est manifestement une blague, et une
blague n'a pas à être rentable.

### 🔴 2.2 · L'invulnérabilité au niveau 1

**`#89 Armure de Givre`** — compétence de Korrah, **apprise au niveau 1**, coût **12 mana** — donne
l'état **#66 « arret du temps (corporelle) »** :

> **DÉF × 9,99 pendant 7 à 10 tours.**

Douze points de mana, dès le premier combat, pour diviser par dix tous les dégâts physiques reçus,
pendant plus longtemps que ne dure un combat ordinaire. C'est la partie entière qui s'annule.

**Corrigé : DÉF × 2,2 pendant 3 à 4 tours.** Ça reste la meilleure défense du jeu — mais c'est un
tour de répit, pas une immunité.

### 🟠 2.3 · Les boucliers ne montaient pas

Les deux familles avaient des trous dans leur courbe :

```
Petit Bouclier   10 → 8 → 16 → 24 → 32      (le 2e est plus faible que le 1er)
Grand Bouclier   12 → 24 → 36 → 48 → 40 → 48 → 56   (le 5e recule)
```

Un joueur qui achète le bouclier suivant devenait plus fragile. **Corrigé** : les deux lignes sont
réalignées sur l'ordre des prix.

---

## 3. Ce que j'ai vérifié — et délibérément PAS touché

C'est la partie qui compte le plus, parce que « déséquilibré » et « mal fait » ne sont pas la même
chose.

### ✅ `#37 Souffre-Douleur` — ATQ ×2 permanent sur ludwing

Au premier regard : une statistique doublée en permanence, c'est énorme.

En regardant les autres traits de l'état : **TGR ×3** (il attire trois fois plus les attaques) et
**esquive −30 %**. C'est un aimant à coups qui frappe fort et ne peut pas éviter. **C'est un vrai
choix de design, et il est cohérent.** Je n'y touche pas.

### ✅ `#45 Assaut Fulgurant` (80 % des PV max) et `#31 Coup de Queue` (25 %)

Ces formules ignorent tout — défense, niveau, boss. Sur un boss à 52 000 PV, `#45` ferait 41 600
dégâts pour 10 mana.

**Mais aucune classe jouable ne les apprend.** Ce sont des compétences d'ennemis. Vérifié sur les
145 compétences réellement apprises par tes 4 classes. Rien à corriger.

### ✅ `#97 Valse des Positions` — 354 dégâts par point de mana

Mon outil la classait comme la plus rentable du jeu. Elle est notée `<Trait: change>` : à chaque
usage, `TraitsAme.js` prélève **20 % des PM max, 20 TP et +2 d'Errance** en plus du coût affiché.
Son vrai prix est bien supérieur aux 10 mana annoncés. **Mon outil avait tort.**

### ✅ Les états `#53 Mur 404`, `#57 Larmes de Vitesse`, `#58 Massacre Aveugle`

AGI ×5 permanent, DÉF ×2 permanent… mais **aucune compétence, aucun état passif, aucun objet ne les
donne au joueur**. Ils sont hors de portée. Laissés tels quels.

### ⚠️ Ce que je signale sans corriger : les attaques de base

`#3 Attaque Consécutive`, `#4 Double Attaque` et `#5 Triple Attaque` sont **gratuites** et font
920 à 1 380 dégâts, quand la compétence *payante* médiane en fait **770**.

Autrement dit : sur beaucoup de tours, la meilleure décision est de ne rien dépenser. Les
compétences payantes devraient dominer les attaques gratuites — c'est ce qui donne un intérêt au
mana.

**Je ne l'ai pas corrigé** parce que ça veut dire retoucher la courbe de dégâts de dizaines de
compétences que tu as réglées à la main, et ce n'est pas un bug : c'est un arbitrage de game design
qui t'appartient. Deux directions possibles, si tu veux qu'on s'y mette :

1. Baisser les attaques de base (`a.atk * 4` → `a.atk * 2.5`) — une ligne à changer, effet immédiat
   sur tout le jeu.
2. Monter les compétences payantes de 30 à 50 % — plus long, mais ça valorise ce que tu as écrit.

---

## 4. Les images des nouveaux ennemis

Tu avais raison, et c'était net une fois mesuré.

**Ton jeu est en style RTP** : `Bat`, `Slime`, `Orc`, `Zombie`, `Gargoyle`, `Dragon`, `Werewolf`,
`Soldier`, `Minotaur`, plus **tes propres sprites faits main** — les 13 `Stick_Errant*` et
`Errant_*`.

J'avais pioché dans un pack moderne haute définition : *« Eldritch Slime Vermillion »*,
*« Corrupted Void Fire Wolf »*, *« Dark Elves Crystal Mage »*. Techniquement corrects, visuellement
étrangers au jeu.

**Les 401 ennemis sont remappés** sur les **84 sprites de style maison** présents dans le projet —
dont **tes 13 sprites d'Errants**, qui servent maintenant à la famille des Errants. 38 des 79
sprites employés sont ceux que tes propres ennemis utilisaient déjà.

Et pour que 401 ennemis sur 79 sprites ne se ressemblent pas tous : **la teinte varie par rang**
(D bleu-neutre, C vert, B pourpre, A rouge, S doré) plus une variation par ennemi. C'est la méthode
classique du RPG Maker — même sprite, teinte différente, monstre différent — et c'est ce que ton jeu
faisait déjà en réutilisant `Actor1_6` six fois.

> **Sur l'idée de prendre des images sur internet :** je ne l'ai pas fait volontairement. Je ne peux
> pas vérifier les licences des images que je trouverais, et importer un asset dont les droits sont
> inconnus dans un jeu que tu veux peut-être diffuser, c'est te créer un problème plus tard. Le
> projet contient déjà **2 555 sprites** ; il y avait de quoi faire sans prendre ce risque. Si tu as
> un pack dont tu possèdes la licence, dépose-le dans `img/sv_enemies/` et je remappe dessus en
> deux minutes.

---

## 5. Vérification

| Contrôle | Résultat |
|---|---|
| Les 8 fichiers de données restent valides | ✅ |
| Les 4 bancs d'essai (Dons, paliers, Familier, bestiaire) | ✅ 72 contrôles |
| Les 401 ennemis ont un sprite qui existe | ✅ 0 manquant |
| Les lignes d'armes et d'armures montent | ✅ toutes |
| Les boucliers montent | ✅ corrigé |

---

## 6. Ce qui reste ouvert

1. **L'arbitrage attaques gratuites / compétences payantes** (§3) — ta décision.
2. **Les objets de mana** (Éther, Cristal de Mana, Encens Sacré) sont peu rentables au point de vue,
   mais le mana est plus rare que les PV : leur valeur réelle dépend de ton rythme de combat. Je ne
   les ai pas touchés faute de pouvoir mesurer ça sans jouer.
3. **Les 270 troupes de rencontre et les 41 boss** ne sont toujours branchés sur aucune carte.
